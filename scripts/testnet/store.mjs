import {DatabaseSync} from 'node:sqlite';
import {randomBytes,createHash} from 'node:crypto';

export const sessionHash=token=>createHash('sha256').update(token).digest('hex');

// A single service owns this database. SQLite transactions protect allocation;
// the campaign engine retains its serialized decision/revision journal.
export class Store {
  constructor(path){
    this.queues=new Map();
    this.db=new DatabaseSync(path);
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA cache_size=-8192; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS campaign_activity(id TEXT PRIMARY KEY,last_activity INTEGER NOT NULL,checked_at INTEGER NOT NULL DEFAULT 0,closing TEXT);
      CREATE TABLE IF NOT EXISTS session_history(token_hash TEXT NOT NULL, campaign_id TEXT NOT NULL, PRIMARY KEY(token_hash,campaign_id));
      CREATE TABLE IF NOT EXISTS service_state(id TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS archives(id TEXT PRIMARY KEY, commitment TEXT NOT NULL, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS campaigns(id TEXT PRIMARY KEY, config TEXT NOT NULL, claimed INTEGER NOT NULL DEFAULT 0);
      CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, campaign_id TEXT NOT NULL UNIQUE, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS states(id TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS transactions(id TEXT PRIMARY KEY, campaign_id TEXT NOT NULL, value TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS transactions_campaign ON transactions(campaign_id);
      CREATE INDEX IF NOT EXISTS transactions_actor_phase ON transactions(json_extract(value,'$.actor'),json_extract(value,'$.phase'));`);
    // Existing saves get a full grace period when this schema is first opened.
    this.db.prepare('INSERT OR IGNORE INTO campaign_activity(id,last_activity) SELECT id,? FROM campaigns').run(Date.now());
  }
  serial(id,work){
    const run=(this.queues.get(id)??Promise.resolve()).then(work),tail=run.catch(()=>{});
    this.queues.set(id,tail);
    return run.finally(()=>{if(this.queues.get(id)===tail)this.queues.delete(id);});
  }
  activity(id){return this.db.prepare('SELECT * FROM campaign_activity WHERE id=?').get(id);}
  closing(id){const row=this.activity(id);return row?.closing?JSON.parse(row.closing):null;}
  touch(id,now=Date.now()){this.db.prepare('UPDATE campaign_activity SET last_activity=? WHERE id=? AND closing IS NULL').run(now,id);}
  beginClosing(id,record){
    this.db.exec('BEGIN IMMEDIATE');
    try{
      this.db.prepare('UPDATE campaign_activity SET closing=? WHERE id=? AND closing IS NULL').run(JSON.stringify(record),id);
      this.db.prepare('UPDATE campaigns SET claimed=1 WHERE id=?').run(id);
      this.db.exec('COMMIT');
    }catch(e){this.db.exec('ROLLBACK');throw e;}
    return this.closing(id);
  }
  finishClosing(id){this.db.prepare("UPDATE campaign_activity SET closing=json_set(closing,'$.complete',json('true')) WHERE id=? AND closing IS NOT NULL").run(id);}
  cleanupCandidate(inactivityMs,now=Date.now()){
    const row=this.db.prepare("SELECT a.id FROM campaign_activity a LEFT JOIN states s ON s.id=a.id LEFT JOIN archives r ON r.id=a.id WHERE COALESCE(json_extract(r.value,'$.complete'),0)=0 AND (a.closing IS NOT NULL OR a.last_activity<=? OR json_extract(s.value,'$.campaign.status')='defeat') ORDER BY a.checked_at,a.last_activity LIMIT 1").get(now-inactivityMs);
    if(row)this.db.prepare('UPDATE campaign_activity SET checked_at=? WHERE id=?').run(now,row.id);
    return row?.id;
  }
  register(config){
    if(!/^[a-zA-Z0-9_-]{1,64}$/.test(config.campaignId)||config.campaignId.startsWith('verification-'))throw new Error('Only fresh visitor campaigns may be allocated');
    this.db.prepare('INSERT INTO campaigns(id,config) VALUES (?,?)').run(config.campaignId,JSON.stringify(config));
    this.db.prepare('INSERT INTO campaign_activity(id,last_activity) VALUES (?,?)').run(config.campaignId,Date.now());
  }
  lookup(token){
    if(typeof token!=='string'||! /^[a-f0-9]{64}$/.test(token))return null;
    return this.db.prepare('SELECT campaign_id AS id FROM sessions WHERE token_hash=? AND expires>?').get(sessionHash(token),Date.now())??null;
  }
  allocate(previousToken=null){
    this.db.exec('BEGIN IMMEDIATE');
    try{
      const next=this.db.prepare('SELECT id FROM campaigns WHERE claimed=0 ORDER BY id LIMIT 1').get();
      if(!next)throw new Error('No unused campaigns are available. Please return later.');
      const token=randomBytes(32).toString('hex');
      this.db.prepare('UPDATE campaigns SET claimed=1 WHERE id=? AND claimed=0').run(next.id);
      this.touch(next.id);
      this.db.prepare('INSERT INTO sessions VALUES (?,?,?)').run(sessionHash(token),next.id,Date.now()+30*86400000);
      if(previousToken){
        const previous=sessionHash(previousToken),nextHash=sessionHash(token);
        this.db.prepare('INSERT OR IGNORE INTO session_history SELECT ?,campaign_id FROM session_history WHERE token_hash=?').run(nextHash,previous);
        this.db.prepare('INSERT OR IGNORE INTO session_history SELECT ?,campaign_id FROM sessions WHERE token_hash=?').run(nextHash,previous);
        this.db.prepare('DELETE FROM session_history WHERE token_hash=?').run(previous);
        this.db.prepare('DELETE FROM sessions WHERE token_hash=?').run(previous);
      }
      this.db.exec('COMMIT');return {token,id:next.id};
    }catch(e){this.db.exec('ROLLBACK');throw e;}
  }
  config(id){const r=this.db.prepare('SELECT config FROM campaigns WHERE id=?').get(id);if(!r)throw new Error('Unknown campaign');return JSON.parse(r.config);}
  readJson=async id=>{const r=this.db.prepare('SELECT value FROM states WHERE id=?').get(id);return r?JSON.parse(r.value):null;};
  saveJson=async(id,value)=>{this.db.prepare('INSERT INTO states VALUES (?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').run(id,JSON.stringify(value));};
  journal(id,campaignId,value){this.db.prepare('INSERT INTO transactions VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').run(id,campaignId,JSON.stringify(value));}
  rejectProvisioning(entry,job,proof){
    this.db.exec('BEGIN IMMEDIATE');
    try{
      const current=this.transactions(job.id);
      if(current.length!==1||JSON.stringify(current[0])!==JSON.stringify(entry)||this.db.prepare('SELECT value FROM service_state WHERE id=?').get('provision')?.value!==JSON.stringify(job)||job.phase!=='pending')throw new Error('Provisioning changed during verification');
      const original=this.db.prepare('SELECT value FROM transactions WHERE id=?').get(entry.id).value;
      this.journal(entry.id,job.id,{...entry,phase:'rejected',reason:'Proven permanently non-executable provisioning',recovery:{...proof,job,previousPhase:entry.phase,originalRecordSha256:createHash('sha256').update(original).digest('hex')}});
      this.db.prepare('UPDATE service_state SET value=? WHERE id=?').run(JSON.stringify({...job,phase:'rejected',transaction:entry.hash}),'provision');
      this.db.exec('COMMIT');
    }catch(error){this.db.exec('ROLLBACK');throw error;}
  }
  transactions(id){return this.db.prepare('SELECT id,value FROM transactions WHERE campaign_id=? ORDER BY rowid').all(id).map(r=>({id:r.id,...JSON.parse(r.value)}));}
  pendingForActor(account){return !!this.db.prepare("SELECT 1 FROM transactions WHERE json_extract(value,'$.actor')=? AND json_extract(value,'$.phase') NOT IN ('final','rejected','unsubmitted') LIMIT 1").get(account);}
  pendingTransactions(account=null){
    return this.db.prepare("SELECT id,campaign_id,value FROM transactions WHERE json_extract(value,'$.phase') NOT IN ('final','rejected','unsubmitted') AND (? IS NULL OR json_extract(value,'$.actor')=?) ORDER BY rowid").all(account,account).map(r=>({campaignId:r.campaign_id,id:r.id,...JSON.parse(r.value)}));
  }

  history(token){
    if(!this.lookup(token))return [];
    // Project only the public snapshot; don't deserialize private archive journals.
    return this.db.prepare("SELECT a.commitment,json_extract(a.value,'$.snapshot') AS snapshot FROM session_history h JOIN archives a ON a.id=h.campaign_id WHERE h.token_hash=? ORDER BY h.rowid DESC LIMIT 20").all(sessionHash(token)).map(r=>({commitment:r.commitment,snapshot:JSON.parse(r.snapshot)}));
  }

  archive(id){const row=this.db.prepare('SELECT value FROM archives WHERE id=?').get(id);return row?JSON.parse(row.value):null;}
  // Fixed windows are durable and global: rotating cookies/IPs cannot bypass them.
  takeLimit(key,maximum,windowMs,now=Date.now()){
    const bucket=Math.floor(now/windowMs);
    const id='limit:'+key;
    const old=this.db.prepare('SELECT value FROM service_state WHERE id=?').get(id);
    const value=old?JSON.parse(old.value):null;
    const count=value?.bucket===bucket?value.count:0;
    if(count>=maximum)return false;
    this.db.prepare('INSERT INTO service_state VALUES (?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').run(id,JSON.stringify({bucket,count:count+1}));
    return true;
  }
  close(){this.db.close();}
}
