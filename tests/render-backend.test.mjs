import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawn} from 'node:child_process';
import near from 'near-api-js';
import {Store} from '../scripts/testnet/store.mjs';
import {runtimeConfig,acquireWriter} from '../scripts/testnet/config.mjs';
import {createEnvironmentSigner,CONTRACT,gasForMethod,verifySigned} from '../scripts/testnet/signing.mjs';
import {createTestnetScenario,METHODS,verifyRuntimeRoster,proveUnexecutedProvision} from '../scripts/testnet/scenario.mjs';
import {campaignLifecycle} from '../scripts/testnet/lifecycle.mjs';
import {publicSnapshot,createGameServer} from '../scripts/testnet/server.mjs';
import {createCampaignSession} from '../scripts/sandbox/campaign.mjs';
import {newCampaign} from '../src/game.ts';

async function fixture(){
  const dir=await mkdtemp(resolve('.local/render-test-')),store=new Store(join(dir,'game.sqlite'));
  return {dir,store,clean:async()=>{store.close();await rm(dir,{recursive:true,force:true});}};
}
const hash=near.utils.serialize.base_encode(new Uint8Array(32));
function signingFixture(){
  const key=near.KeyPair.fromRandom('ed25519');
  const actors=Object.fromEntries(Object.keys(METHODS).map(role=>[role,{accountId:role+'.fixture.testnet',publicKey:key.getPublicKey().toString()}]));
  const config={campaignId:'one',contractId:CONTRACT,actors,prepaid:true};
  const credentials=JSON.stringify(Object.entries(actors).map(([role,a])=>({role,accountId:a.accountId,privateKey:key.toString()})));
  const sign=createEnvironmentSigner(credentials,actors);
  return {key,actors,config,credentials,sign};
}
function outcome(payload){
  const signed=near.transactions.SignedTransaction.decode(Buffer.from(payload,'base64')),tx=signed.transaction,c=tx.actions[0].functionCall;
  const expected={accountId:tx.signerId,publicKey:'ed25519:'+near.utils.serialize.base_encode(Buffer.from(tx.publicKey.ed25519Key.data)),nonce:tx.nonce,blockHash:hash,method:c.methodName,args:JSON.parse(Buffer.from(c.args))};
  const checked=verifySigned(payload,expected);
  return {final_execution_status:'FINAL',status:{SuccessValue:''},receipts_outcome:[],transaction:{hash:checked.hash,public_key:expected.publicKey,signer_id:tx.signerId,receiver_id:CONTRACT,actions:[{FunctionCall:{method_name:c.methodName,deposit:'0',gas:gasForMethod(c.methodName),args:Buffer.from(c.args).toString('base64')}}]}};
}
const query=async(_method,p)=>_method==='block'?{header:{height:1}}:_method==='EXPERIMENTAL_protocol_config'?{transaction_validity_period:86400}:p.request_type==='view_access_key'?{permission:{FunctionCall:{receiver_id:CONTRACT,method_names:['revoke_grant'],allowance:'10000000000000000000000'}},nonce:1,block_hash:hash,block_height:1}:{result:[...Buffer.from(JSON.stringify({campaign_id:'one',night:0,next_nonce:0}))]};

test('obsolete unfunded provisioning closes atomically only with independent absence proof, preserves evidence and permits one fresh intent',async()=>{
 const f=await fixture(),s=signingFixture(),release=acquireWriter(join(f.dir,'game.sqlite'));
 try{
  assert.throws(()=>acquireWriter(join(f.dir,'game.sqlite')),/Another application/);
  const job={id:'one',phase:'pending',started:0};
  const signed=await s.sign({...s.actors.provisioner,nonce:2,blockHash:hash,method:'open_campaign',args:{campaign_id:'one'}});
  f.store.journal('old','one',{actor:s.actors.provisioner.accountId,publicKey:s.actors.provisioner.publicKey,method:'open_campaign',args:{campaign_id:'one'},phase:'broadcast',...signed});
  f.store.db.prepare('INSERT INTO service_state VALUES (?,?)').run('provision',JSON.stringify(job));
  const entry=f.store.transactions('one')[0];let fault='',sends=0;
  const inspect=async(method,p,url)=>{
   assert.notEqual(method,'send_tx');
   if(method==='tx')return fault==='known'?{result:{final_execution_status:'FINAL'}}:{error:{cause:{name:'UNKNOWN_TRANSACTION'}}};
   if(method==='block')return {result:{header:{hash, height:10}}};
   if(p.request_type==='view_access_key')return {result:{nonce:fault==='nonce'?2:100,permission:{FunctionCall:{receiver_id:CONTRACT,method_names:['open_campaign'],allowance:'1'}}}};
   if(fault==='rpc'&&url.includes('drpc'))throw new Error('unavailable');
   return {result:{values:fault==='tombstone'&&Buffer.from(p.prefix_base64,'base64').toString().startsWith('lifecycle:')?[{key:'retained'}]:[]}};
  };
  for(fault of ['known','nonce','tombstone'])assert.equal(await proveUnexecutedProvision(entry,s.actors.provisioner,inspect),null);
  fault='rpc';await assert.rejects(proveUnexecutedProvision(entry,s.actors.provisioner,inspect),/unavailable/);
  assert.deepEqual(f.store.transactions('one')[0],entry);fault='';
  const q=async(method,p)=>p.request_type==='view_access_key'?{nonce:100,block_hash:hash,permission:{FunctionCall:{receiver_id:CONTRACT,method_names:['open_campaign'],allowance:'1'}}}:{result:[...Buffer.from(JSON.stringify(p.method_name==='campaign_resources'?{prepaid:true,status:'active'}:{campaign_id:JSON.parse(Buffer.from(p.args_base64,'base64')).campaign_id,night:0}))]};
  const create=(binding,store,sign)=>createTestnetScenario(binding,store,sign,{query:q,send:async(method,p)=>{assert.equal(method,'send_tx');sends++;const tx=near.transactions.SignedTransaction.decode(Buffer.from(p.signed_tx_base64,'base64')).transaction;assert.equal(String(tx.nonce),'101');assert.notEqual(JSON.parse(Buffer.from(tx.actions[0].functionCall.args)).campaign_id,'one');return {result:outcome(p.signed_tx_base64)};}});
  const life=campaignLifecycle(f.store,{provisioning:{contractId:CONTRACT,actors:s.actors}},s.sign,create,(e,a)=>proveUnexecutedProvision(e,a,inspect));
  await life.ensureCapacity();await life.ensureCapacity();
  const old=f.store.transactions('one')[0];assert.equal(old.phase,'rejected');assert.equal(old.payload,entry.payload);assert.equal(old.hash,entry.hash);assert.deepEqual(old.recovery.job,job);assert.equal(old.recovery.evidence.length,2);
  assert.equal(sends,1);assert.equal(f.store.pendingForActor(s.actors.provisioner.accountId),false);assert.equal(f.store.db.prepare('SELECT count(*) n FROM campaigns').get().n,1);
 }finally{release();await f.clean();}
});

test('Linux-compatible offline signer uses exact synthetic keys; malformed and excess credentials fail closed',async()=>{
  const {sign,actors,credentials}=signingFixture();
  const expected={...actors.vesper,method:'revoke_grant',args:{campaign_id:'one',grant_id:0,nonce:0},nonce:2,blockHash:hash};
  assert.equal((await sign(expected)).publicKey,actors.vesper.publicKey);
  await assert.rejects(sign({...expected,publicKey:near.KeyPair.fromRandom('ed25519').getPublicKey().toString()}),/Restricted runtime/);
  assert.throws(()=>createEnvironmentSigner('SECRET malformed',actors),e=>!e.message.includes('SECRET'));
  assert.throws(()=>createEnvironmentSigner(credentials,{vesper:actors.vesper}),/Invalid restricted/);
});

for(const permission of ['FullAccess',{FunctionCall:{receiver_id:'wrong.testnet',method_names:['revoke_grant'],allowance:'1'}},{FunctionCall:{receiver_id:CONTRACT,method_names:[],allowance:'1'}},{FunctionCall:{receiver_id:CONTRACT,method_names:['revoke_grant','delete_account'],allowance:'1'}},{FunctionCall:{receiver_id:CONTRACT,method_names:['revoke_grant'],allowance:null}}])test('unsafe permission rejected before signing: '+JSON.stringify(permission),async()=>{
  const f=await fixture();let signs=0;
  try{const s=await createTestnetScenario(signingFixture().config,f.store,()=>{signs++;},{query:async()=>({permission,nonce:1}),send:()=>{throw new Error('must not send');}});await assert.rejects(s.call('vesper','revoke_grant',{}),/permissions mismatch/);assert.equal(signs,0);}finally{await f.clean();}
});

for(const phase of ['intent','signed','broadcast'])test('restart recovery at '+phase+' preserves identity and never duplicates execution',async()=>{
  const f=await fixture(),sf=signingFixture();let sends=0,final;
  const send=async(method,p)=>{if(method==='send_tx'){sends++;final=outcome(p.signed_tx_base64);return {result:final};}return final?{result:final}:{error:{cause:{name:'UNKNOWN_TRANSACTION'}}};};
  try{
    const original=f.store.journal.bind(f.store);let interrupted=false;
    f.store.journal=(id,cid,value)=>{original(id,cid,value);if(!interrupted&&value.phase===phase){interrupted=true;throw new Error('controlled crash');}};
    let s=await createTestnetScenario(sf.config,f.store,sf.sign,{query,send});
    await assert.rejects(s.call('vesper','revoke_grant',{nonce:0,grant_id:0}),/controlled crash/);
    f.store.journal=original;
    const recorded=f.store.transactions('one')[0];
    s=await createTestnetScenario(sf.config,f.store,sf.sign,{query,send});
    await s.reconcile();await s.call('vesper','revoke_grant',{nonce:0,grant_id:0});assert.equal(sends,1);
    await s.call('vesper','revoke_grant',{nonce:0,grant_id:0});
    const completed=f.store.transactions('one')[0];assert.equal(completed.phase,'final');
    if(recorded.hash)assert.equal(completed.hash,recorded.hash);
    assert.equal(sends,1);
  }finally{await f.clean();}
});

test('prepaid balance comes from treasury and never queries the player account',async()=>{
  const f=await fixture();try{
    const s=await createTestnetScenario(signingFixture().config,f.store,null,{query:async(_m,p)=>{assert.equal(p.method_name,'campaign_resources');return {result:[...Buffer.from(JSON.stringify({prepaid:true,treasury:'20000000000000000000000'}))]};}});
    assert.equal(await s.paymentBalance(),'20000000000000000000000');
  }finally{await f.clean();}
});

for(const action of ['accept','agreement_accept','sanctuary_pact'])for(const affordable of [true,false])test(`${action} checks prepaid treasury (${affordable?'funded':'empty'}) with no account balance fallback`,async()=>{
 const f=await fixture();try{
  const rent='20000000000000000000000',actors=Object.fromEntries(Object.keys(METHODS).map(role=>[role,{accountId:role,balance:()=>{throw new Error('account balance must not be queried');}}]));
  const c=newCampaign('one',{actionLimit:3,living:true,dangerous:true});c.politics.accounts=Object.fromEntries(Object.keys(actors).map(r=>[r,r]));c.politics.titleFiled=true;
  const leases=['lounge','sanctuary'].map((property_id,id)=>({id,property_id,owner:'seraphine',buyer:'player',status:'offered',price_yocto:rent,offer_expiry_night:3,duration_nights:id?7:3,escrow_yocto:'0',end_night:null}));
  c.agreements=[{id:'one:lease:0',actor:'seraphine',recipient:'player',leaseId:0,property:'lounge',operation:'accept_lease',priceYocto:rent,durationNights:3,expiryNight:3,status:'pending'}];
  const world={campaign_id:'one',night:0,next_nonce:0,access:{crypt:true,library:true,lounge:false,sanctuary:false},leases,properties:leases.map(l=>({id:l.property_id,owner:l.owner})),grants:[],ancestry:[]};
  let calls=0;
  const scenario={contract:{accountId:CONTRACT},campaignId:'one',actors,political:true,living:true,dangerous:true,paymentBalance:async()=>affordable?rent:'0',view:async()=>structuredClone(world),hasAccess:async()=>true,snapshot:async(error=null)=>({world,error,walletYocto:affordable?rent:'0'}),action:async(_r,_m,args)=>{calls++;world.leases[args.lease_id].status='accepted';world.access[world.leases[args.lease_id].property_id]=true;world.next_nonce++;return {succeeded:true,receiptFailures:[]};}};
  scenario.request=async()=>{await scenario.action('player','accept_lease',{lease_id:0});return {error:null};};
  await f.store.saveJson('one',{campaign:c,pending:null,chainBinding:{campaignId:'one',contractId:CONTRACT}});
  const session=await createCampaignSession(scenario,'one','one',undefined,null,f.store);
  const r=await session.request({action:action==='sanctuary_pact'?'game':action,choice:action,agreement_id:'one:lease:0',campaign_id:'one',revision:0});
  assert.equal(calls,affordable?1:0,r.error);if(affordable)assert.equal(r.error,null);else assert.match(r.error,/Insufficient/);
 }finally{await f.clean();}
});

test('public projection keeps scene evidence and strips memory, private journal and raw errors including archives',()=>{
 const c=newCampaign('one');c.npcs.vesper.memory=['PRIVATE'];c.agentHistory=[{night:0,actor:'vesper',kind:'revoke',source:'deterministic-policy',execution:'confirmed',outcome:'confirmed',proposal:{secret:'PRIVATE'},detail:'PRIVATE'}];
 const source={campaign:c,pending:{payload:'PRIVATE'},journal:'PRIVATE',error:'PRIVATE',transactions:[{payload:'PRIVATE',phase:'signed'},{hash:'public',action:'revoke_grant',executionStatus:'FINAL',payload:'PRIVATE'}]};
 const clean=publicSnapshot(source);assert.ok(!JSON.stringify(clean).includes('PRIVATE'));assert.equal(clean.pending,true);assert.equal(clean.campaign.agentHistory[0].kind,'revoke');assert.equal(source.campaign.npcs.vesper.memory[0],'PRIVATE');
});

test('durable limits survive database reopen; fixed windows reset without IP or cookie bypass',async()=>{
 const f=await fixture();try{
  assert.equal(f.store.takeLimit('creation',1,60000,1000),true);assert.equal(f.store.takeLimit('creation',1,60000,1001),false);
  f.store.close();f.store=new Store(join(f.dir,'game.sqlite'));
  assert.equal(f.store.takeLimit('creation',1,60000,2000),false);assert.equal(f.store.takeLimit('creation',1,60000,60001),true);
 }finally{f.store.close();await rm(f.dir,{recursive:true,force:true});}
});

test('persistent path and PORT are explicit; writer exclusion releases after a killed process',async()=>{
 const f=await fixture();try{
  const cfg=await runtimeConfig({NIGHT_CONFIG_JSON:'{}',NIGHT_DATA_DIR:f.dir,PORT:'5198'});
  assert.equal(cfg.database,join(f.dir,'game.sqlite'));assert.equal(cfg.port,5198);
  await assert.rejects(runtimeConfig({NIGHT_CONFIG_JSON:'SECRET malformed'}),e=>!e.message.includes('SECRET'));
  await assert.rejects(runtimeConfig({RENDER:'true',NIGHT_CONFIG_JSON:'{}'}),/disk/);
  const child=spawn(process.execPath,['--input-type=module','-e',`import {acquireWriter} from './scripts/testnet/config.mjs';acquireWriter(${JSON.stringify(cfg.database)});console.log('locked');setInterval(()=>{},1000);`],{stdio:['ignore','pipe','pipe']});
  await new Promise((r,j)=>{child.stdout.once('data',r);child.once('error',j);child.once('exit',code=>j(new Error('writer exited '+code)));});
  assert.throws(()=>acquireWriter(cfg.database),/Another application/);
  const stopped=new Promise(r=>child.once('exit',r));child.kill('SIGKILL');await stopped;
  const release=acquireWriter(cfg.database);release();
 }finally{await f.clean();}
});

test('production entry serves build and health using PORT; restart retains SQLite',async()=>{
 const f=await fixture();let child;
 async function start(){
  child=spawn(process.execPath,['--max-old-space-size=256','scripts/testnet/start.mjs'],{env:{...process.env,RENDER:'false',PORT:'5197',NIGHT_RUNTIME_KEYS:'',NIGHT_DATA_DIR:f.dir,NIGHT_CONFIG_JSON:JSON.stringify({origin:'http://127.0.0.1:5197',secureCookies:false})},stdio:['ignore','pipe','pipe']});
  await new Promise((r,j)=>{child.stdout.once('data',r);child.once('error',j);child.once('exit',code=>j(new Error('startup exited '+code)));});
 }
 async function stop(){if(child?.exitCode===null){const done=new Promise(r=>child.once('exit',r));child.kill();await done;}}
 try{
  await f.store.saveJson('sentinel',{campaign:{id:'sentinel',revision:7}});await start();
  assert.equal((await fetch('http://127.0.0.1:5197/healthz')).status,200);
  const page=await fetch('http://127.0.0.1:5197/');assert.equal(page.status,200);assert.match(await page.text(),/assets\/index/);
  await stop();await start();assert.equal((await fetch('http://127.0.0.1:5197/healthz')).status,200);
  assert.equal((await f.store.readJson('sentinel')).campaign.revision,7);
 }finally{await stop();await f.clean();}
});

test('HTTP projection protects live/history responses and durable action limits reject excess requests',async()=>{
 const f=await fixture();let server;
 try{
  f.store.register({campaignId:'one'});f.store.register({campaignId:'two'});
  const old=f.store.allocate(),current=f.store.allocate(old.token);
  const campaign=newCampaign('one');campaign.npcs.vesper.memory=['PRIVATE'];
  const snapshot={campaign,world:{},pending:{payload:'PRIVATE'},journal:'PRIVATE',error:'PRIVATE'};
  f.store.db.prepare('INSERT INTO archives VALUES (?,?,?)').run('one','commitment',JSON.stringify({snapshot,state:{secret:'PRIVATE'},transactions:[{payload:'PRIVATE'}]}));
  server=createGameServer({store:f.store,origin:'http://127.0.0.1:5195',secureCookies:false,loadSession:async()=>({request:async()=>snapshot})});
  await new Promise(r=>server.listen(5195,'127.0.0.1',r));
  const headers={Cookie:'night_session='+current.token,Origin:'http://127.0.0.1:5195','Content-Type':'application/json'};
  const history=await fetch('http://127.0.0.1:5195/api/history',{headers});assert.equal(history.status,200);const h=await history.text();assert.ok(h.includes('commitment'));assert.ok(!h.includes('PRIVATE'));
  for(let i=0;i<29;i++){const r=await fetch('http://127.0.0.1:5195/api/game',{method:'POST',headers,body:'{"action":"view"}'});assert.equal(r.status,200);assert.ok(!(await r.text()).includes('PRIVATE'));}
  assert.equal((await fetch('http://127.0.0.1:5195/api/game',{method:'POST',headers,body:'{"action":"view"}'})).status,429);
 }finally{if(server?.listening){server.closeAllConnections();await new Promise(r=>server.close(r));}await f.clean();}
});


test('startup verifies every exact roster key and refuses FullAccess or incomplete permissions',async()=>{
 const {actors}=signingFixture();let reads=0;
 const check=async(_m,p)=>{reads++;const role=Object.keys(actors).find(r=>actors[r].accountId===p.account_id);assert.equal(p.public_key,actors[role].publicKey);return {permission:{FunctionCall:{receiver_id:CONTRACT,method_names:METHODS[role],allowance:'100'}}};};
 await verifyRuntimeRoster(actors,check);assert.equal(reads,11);
 await assert.rejects(verifyRuntimeRoster(actors,async()=>({permission:'FullAccess'})),/FullAccess/);
 await assert.rejects(verifyRuntimeRoster({...actors,admin:{accountId:'admin.testnet'}},check),/roster/);
});

test('expired or rejected unknown broadcast never re-signs or discards its identity',async()=>{
 const f=await fixture(),sf=signingFixture();let signs=0,sends=0,payload;
 try{
  const sign=async e=>{signs++;return sf.sign(e);};
  const send=async(method,p)=>{if(method==='tx')return {error:{cause:{name:'UNKNOWN_TRANSACTION'}}};sends++;if(payload)assert.equal(p.signed_tx_base64,payload);payload=p.signed_tx_base64;return {error:{cause:{name:'INVALID_TRANSACTION'},data:'Expired'}};};
  const s=await createTestnetScenario(sf.config,f.store,sign,{query,send});
  await assert.rejects(s.call('vesper','revoke_grant',{nonce:0,grant_id:0}),/unknown/);
  await assert.rejects(s.reconcile(),/unknown/);assert.equal(signs,1);assert.equal(sends,2);
  assert.equal(f.store.transactions('one')[0].phase,'broadcast');
 }finally{await f.clean();}
});
