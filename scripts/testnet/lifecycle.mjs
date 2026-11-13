import {createHash,randomUUID} from 'node:crypto';
import {servicePolicy} from './config.mjs';
import {createTestnetScenario,proveUnexecutedProvision} from './scenario.mjs';

export const archivedSnapshot=record=>({...record.snapshot,archiveComplete:!!record.complete,pending:!record.complete,...(record.snapshot.closure?{closure:{...record.snapshot.closure,complete:!!record.complete},pending:!record.complete,actions:[]}:{}),proof:record.complete?'Archived campaign: verified historical state; on-chain world reclaimed':'Campaign complete: archive and reclamation verification pending',archiveCommitment:record.commitment});
export const closingSnapshot=record=>({...record.snapshot,closure:{reason:record.reason,startedAt:record.startedAt,complete:false},pending:true,actions:[],error:null});

// Both paths use the same durable signing/finality adapter as gameplay. No
// provisioning FullAccess credential or arbitrary method enters the service.
export function campaignLifecycle(store,config,sign,createScenario=createTestnetScenario,proveProvision=proveUnexecutedProvision){
  const policy=servicePolicy(config);
  let provisionQueue=Promise.resolve();
  async function ensureCapacity(){
    const work=provisionQueue.then(async()=>{
      if(store.db.prepare('SELECT id FROM campaigns WHERE claimed=0').get())return;
      if(!config.provisioning)throw new Error('Campaign provisioning is disabled');
      const now=Date.now();
      const row=store.db.prepare('SELECT value FROM service_state WHERE id=?').get('provision');
      let job=row?JSON.parse(row.value):null;
      if(job?.phase==='pending'){
        const entries=store.transactions(job.id);
        if(entries.length===1&&entries[0].args?.campaign_id===job.id){
          const proof=await proveProvision(entries[0],config.provisioning.actors.provisioner);
          if(proof){store.rejectProvisioning(entries[0],job,proof);job={...job,phase:'rejected'};}
        }
      }
      if(['done','rejected'].includes(job?.phase)&&now-job.started<policy.creation.cooldownMs)throw new Error('Campaign creation cooling down');
      if(!job||['done','rejected'].includes(job.phase)){
        job={id:'visitor-'+randomUUID(),phase:'pending',started:now};
        store.db.prepare('INSERT INTO service_state VALUES (?,?) ON CONFLICT(id) DO UPDATE SET value=excluded.value').run('provision',JSON.stringify(job));
      }
      const binding={...config.provisioning,campaignId:job.id,prepaid:true};
      const scenario=await createScenario(binding,store,sign);
      // call() reconciles a previous submitted identity before considering a
      // send. An uncertain response never creates a second campaign ID.
      const tx=await scenario.call('provisioner','open_campaign');
      if(!tx.succeeded){
        job.phase='rejected';store.db.prepare('UPDATE service_state SET value=? WHERE id=?').run(JSON.stringify(job),'provision');
        throw new Error('Campaign creation rejected; capacity or funding may be unavailable');
      }
      const world=await scenario.view(),resources=await scenario.resourceView();
      if(world.night!==0||!resources.prepaid||resources.status!=='active')throw new Error('Invalid created campaign');
      store.db.exec('BEGIN IMMEDIATE');
      try{
        if(!store.db.prepare('SELECT id FROM campaigns WHERE id=?').get(job.id))store.register(binding);
        job.phase='done';store.db.prepare('UPDATE service_state SET value=? WHERE id=?').run(JSON.stringify(job),'provision');
        store.db.exec('COMMIT');
      }catch(error){store.db.exec('ROLLBACK');throw error;}
    });
    provisionQueue=work.catch(()=>{});return work;
  }
  function cleanupReason(id,campaign,now=Date.now()){
    const activity=store.activity(id);
    if(activity?.closing)return JSON.parse(activity.closing).reason;
    if(campaign?.status==='defeat')return 'defeat';
    return activity&&now-activity.last_activity>=policy.cleanup.inactivityMs?'abandoned':null;
  }
  async function close(scenario,snapshot,reason){
    const id=scenario.campaignId;
    if(!store.closing(id)){
      if(snapshot.pending||snapshot.error||(await store.readJson(id))?.pending)return snapshot;
      if(snapshot.campaign?.status==='concluded')return archive(scenario,snapshot);
      // Explicit quit arrives only through the session/revision-checked command.
      if(reason!=='quit'&&(!['defeat','abandoned'].includes(reason)||cleanupReason(id,snapshot.campaign)!==reason))throw new Error('Campaign is not eligible for cleanup');
      await scenario.reconcile();
      // Freeze the real gameplay snapshot before any maintenance-only clock calls.
      store.beginClosing(id,{reason,startedAt:Date.now(),complete:false,snapshot:structuredClone(snapshot)});
    }
    return archive(scenario,snapshot);
  }
  async function archive(scenario,snapshot){
    const id=scenario.campaignId;
    const closing=store.closing(id);
    if(closing)snapshot={...closing.snapshot,closure:{reason:closing.reason,startedAt:closing.startedAt,complete:false}};
    const existing=store.archive(id);if(existing?.complete){store.finishClosing(id);return archivedSnapshot(existing);}
    if(!closing&&(snapshot.pending||snapshot.error||snapshot.campaign?.status==='playing'||snapshot.campaign?.night<7))return snapshot;
    await scenario.reconcile();
    let resources=await scenario.resourceView();
    if(existing&&resources.status==='reclaimed'){
      if(resources.commitment!==existing.commitment)throw new Error('Archive commitment mismatch');
      existing.complete=true;store.db.prepare('UPDATE archives SET value=? WHERE id=?').run(JSON.stringify(existing),id);store.finishClosing(id);return archivedSnapshot(existing);
    }
    let world=await scenario.view();
    if(closing&&resources.status==='active'){
      if(world.leases.some(l=>l.payout_pending))throw new Error('Pending rent callback blocks cleanup');
      for(const [role,actor] of Object.entries(scenario.actors)){
        if(role!=='provisioner'&&(await scenario.view(actor)).passage_budget?.refund_pending)throw new Error('Pending budget callback blocks cleanup');
      }
      while(world.night<7){
        const before=world.night;
        const tx=await scenario.call('keeper','advance_night',{expected_night:before});
        if(!tx.succeeded)throw new Error('Cleanup clock advance failed');
        world=await scenario.view();
        if(world.night!==before+1)throw new Error('Cleanup clock advance unconfirmed');
      }
    }
    // Settle only established claims, using each legitimate owner/beneficiary.
    for(const lease of world.leases.filter(l=>l.status==='accepted'&&!l.settled)){
      const role=Object.keys(scenario.actors).find(r=>scenario.actors[r].accountId===lease.owner);
      if(!role)throw new Error('Unknown lease owner; archive retained pending');
      const tx=await scenario.action(role,'claim_rent',{lease_id:lease.id});
      if(!tx.succeeded)throw new Error('Rent settlement unresolved');
    }
    for(const role of Object.keys(scenario.actors)){
      if(role==='provisioner')continue;
      const view=await scenario.view(scenario.actors[role]);
      if(BigInt(view.passage_budget?.remaining??'0')>0n){
        const tx=await scenario.action(role,'refund_passage_budget');
        if(!tx.succeeded)throw new Error('Passage refund unresolved');
      }
    }
    await scenario.reconcile();
    let record=store.archive(id);
    if(!record){
      const settlement=await scenario.snapshot();
      if(!closing)snapshot={...snapshot,...settlement};
      const data={snapshot,...(closing?{settlement}:{}),state:await store.readJson(id),transactions:store.transactions(id).map(({payload,...t})=>t)};
      const serialized=JSON.stringify(data),commitment=createHash('sha256').update(serialized).digest('hex');
      store.db.prepare('INSERT INTO archives VALUES (?,?,?)').run(id,commitment,JSON.stringify({...data,commitment,serialized,complete:false}));
      record=store.archive(id);
    }
    resources=await scenario.resourceView();
    const run=async(method,args={})=>{const tx=await scenario.call('keeper',method,args);if(!tx.succeeded)throw new Error('Lifecycle operation failed');};
    if(resources.status==='active')await run('complete_campaign',{commitment:record.commitment});
    resources=await scenario.resourceView();
    if(resources.status==='completed'){
      world=await scenario.view();
      const end=Math.max(7,...world.leases.filter(l=>l.status==='accepted').map(l=>l.end_night??0));
      for(let n=world.night;n<end;n++)await run('settlement_dawn',{expected_night:n});
      await run('archive_campaign',{commitment:record.commitment});
    }
    resources=await scenario.resourceView();
    if(resources.status==='archived')await run('reclaim_campaign',{commitment:record.commitment});
    resources=await scenario.resourceView();
    if(resources.status!=='reclaimed'||resources.commitment!==record.commitment)throw new Error('Reclamation not verified');
    record.complete=true;record.lifecycle=store.transactions(id).filter(t=>['complete_campaign','archive_campaign','reclaim_campaign','settlement_dawn'].includes(t.method)).map(({payload,...t})=>t);
    store.db.prepare('UPDATE archives SET value=? WHERE id=?').run(JSON.stringify(record),id);
    store.finishClosing(id);
    return archivedSnapshot(record);
  }
  let sweeping=false;
  async function sweep(loadSession){
    if(sweeping)return;sweeping=true;
    try{
      const id=store.cleanupCandidate(policy.cleanup.inactivityMs);
      if(id)await store.serial(id,async()=>{
        const saved=await store.readJson(id);
        // A player may have refreshed activity while cleanup waited for this queue.
        if(store.archive(id)?.complete||!cleanupReason(id,saved?.campaign))return;
        await (await loadSession(id)).request({action:'view'});
      });
    }finally{sweeping=false;}
  }
  return {ensureCapacity,archive,close,cleanupReason,sweep};
}
