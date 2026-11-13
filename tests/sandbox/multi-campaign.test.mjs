import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario,RENT_YOCTO} from '../../scripts/sandbox/scenario.mjs';
import {Store} from '../../scripts/testnet/store.mjs';
import {campaignLifecycle} from '../../scripts/testnet/lifecycle.mjs';
import {readFile} from 'node:fs/promises';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
const ok=r=>assert.equal(r.succeeded&&r.receiptFailures.length===0,true,JSON.stringify(r.status));
const fails=r=>assert.equal(r.succeeded,false);

test('one contract: campaign authority, economic, replay, callback and concurrency isolation',{timeout:240000},async()=>{
 const home=join('.local','multi-'+randomUUID()),{worker}=await startPersistentSandbox(home);
 try {
  const a=await createScenario(worker,{campaignId:'a',actorPrefix:'a-',political:true,living:true,dangerous:true});
  const b=await createScenario(worker,{contract:a.contract,campaignId:'b',actorPrefix:'b-',political:true,living:true,dangerous:true});
  assert.equal(a.contract.accountId,b.contract.accountId);
  const initial=await b.view();
  const init={mode:'political',participants:Object.values(a.actors).map(a=>a.accountId),vesper:a.actors.vesper.accountId,player:a.actors.player.accountId,executor:a.actors.keeper.accountId,seraphine:a.actors.seraphine.accountId,marius:a.actors.marius.accountId,lucien:a.actors.lucien.accountId};
  fails(await a.call('castle','create_campaign',init,'3000000000000000000000000'));
  // Raw calls intentionally bypass adapter routing to test contract enforcement.
  const raw=async(actor,method,args,deposit='0')=>actor.callRaw(a.contract,method,args,{gas:'100000000000000',attachedDeposit:deposit});
  fails(await raw(worker.rootAccount,'create_campaign',{...init,campaign_id:'unauthorized'},'3000000000000000000000000'));
  fails(await raw(a.actors.vesper,'revoke_grant',{campaign_id:'b',grant_id:0,nonce:1}));
  fails(await raw(a.actors.keeper,'advance_night',{campaign_id:'b',expected_night:0}));
  fails(await raw(a.actors.player,'enter_room',{campaign_id:'b',property_id:'library',nonce:0}));
  fails(await raw(a.actors.cassian,'fund_passage',{campaign_id:'b',nonce:0},'10000000000000000000000'));
  assert.deepEqual(await b.view(),initial);
  const both=await Promise.all([a.action('player','accept_lease',{lease_id:1},RENT_YOCTO),b.action('player','reject_lease',{lease_id:1})]);both.forEach(ok);
  const bAfter=await b.view();
  ok(await a.action('seraphine','claim_rent',{lease_id:1}));
  assert.equal((await a.view()).leases[1].settled,true);assert.deepEqual(await b.view(),bAfter);
  fails(await raw(a.actors.seraphine,'claim_rent',{campaign_id:'b',lease_id:1,nonce:0}));
  fails(await raw(a.actors.player,'rent_paid',{campaign_id:'b',lease_id:1}));
  ok(await a.action('vesper','revoke_grant',{grant_id:0}));
  assert.equal((await a.view()).access.crypt,false);assert.equal((await b.view()).access.crypt,true);
  assert.equal((await a.view()).access.library,true);
  // Independent root in A cannot be used as a parent in B.
  fails(await raw(a.actors.player,'grant_access',{campaign_id:'b',property_id:'crypt',scope:'enter',grantee:a.actors.lucien.accountId,parent_grant_id:0,can_delegate:false,expiry_night:null,nonce:0}));
  const nonce=(await b.view()).next_nonce;
  const conflict=await Promise.allSettled([b.call('player','enter_room',{property_id:'library',nonce}),b.call('player','enter_room',{property_id:'crypt',nonce})]);
  assert.equal(conflict.filter(r=>r.status==='fulfilled'&&r.value.succeeded).length,1);
  for(const r of conflict)if(r.status==='rejected')assert.match(String(r.reason),/nonce/i);
  assert.equal((await b.view()).next_nonce,nonce+1);
  for(let night=0;night<5;night++)ok(await a.call('keeper','advance_night',{expected_night:night}));
  assert.equal((await b.view()).night,0);
  ok(await a.action('cassian','refund_passage_budget'));
  assert.equal((await a.view(a.actors.cassian)).passage_budget.remaining,'0');
  assert.equal((await b.view(b.actors.cassian)).passage_budget.remaining,'10000000000000000000000');
  fails(await a.action('cassian','refund_passage_budget'));
  // Explicitly shared identities: same account is an owner in one world and has no right in another.
  ok(await raw(a.contract,'create_campaign',{...init,participants:[...init.participants,b.actors.player.accountId],campaign_id:'shared',player:b.actors.player.accountId},'3000000000000000000000000'));
  assert.equal(await a.contract.view('has_access',{campaign_id:'shared',account_id:a.actors.player.accountId,property_id:'library'}),false);
  fails(await raw(a.actors.player,'enter_room',{campaign_id:'shared',property_id:'library',nonce:0}));
  ok(await raw(a.actors.vesper,'grant_access',{campaign_id:'shared',property_id:'crypt',scope:'enter',grantee:b.actors.player.accountId,parent_grant_id:null,can_delegate:false,expiry_night:1,nonce:0}));
  assert.notEqual((await a.view(a.actors.vesper)).next_nonce,1);
  assert.equal((await a.contract.view('get_world',{campaign_id:'shared',account_id:a.actors.vesper.accountId})).next_nonce,1);
  const evidence={network:'local-sandbox',contract:a.contract.accountId,campaigns:['a','b','shared'],a:await a.view(),b:await b.view(),transactions:[...a.transactions,...b.transactions]};
  await writeFile('docs/evidence/pass4b1-isolation.json',JSON.stringify(evidence,null,2));
 } finally {await worker.tearDown();}
});

test('two complete seven-night campaigns share one contract, retain outcomes and recover independently',{timeout:300000},async()=>{
 const home=join('.local','multi-routes-'+randomUUID()),{worker}=await startPersistentSandbox(home);
 try {
  const a=await createScenario(worker,{campaignId:'marius-route',actorPrefix:'a-',political:true,living:true,dangerous:true,restrictKeys:true,prepaid:true,lifecycle:true});
  const b=await createScenario(worker,{contract:a.contract,campaignId:'independent-route',actorPrefix:'b-',political:true,living:true,dangerous:true,restrictKeys:true,prepaid:true,lifecycle:true});
  const paths=[join(home,'a.json'),join(home,'b.json')],scenarios=[a,b];
  let sessions=await Promise.all(scenarios.map((s,i)=>createCampaignSession(s,paths[i],s.campaignId)));
  await assert.rejects(createCampaignSession(b,paths[0],a.campaignId),/different on-chain campaign/);
  const plans=[['petition_marius','feed','feed','authorize_mirelle','pass','withdraw_library','final_counter'],['investigate_title','sanctuary_pact','feed','authorize_mirelle','withdraw_library','authorize_dorian','pass']];
  let states=await Promise.all(sessions.map(s=>s.request({action:'view'})));
  let interrupted=false;const original=a.action;
  a.action=async(...args)=>{const r=await original(...args);if(args[1]==='accept_funded_passage'&&!interrupted&&r.succeeded){interrupted=true;throw new Error('Lost committed payment response');}return r;};
  for(let night=0;night<7;night++){
   for(const i of [0,1]){
    const untouched=await scenarios[1-i].view(),choice=plans[i][night];
    states[i]=await sessions[i].request({action:choice==='pass'?'end_night':'game',...(choice==='pass'?{}:{choice}),campaign_id:scenarios[i].campaignId,revision:states[i].campaign.revision});
    if(states[i].error&&i===0&&interrupted){sessions[i]=await createCampaignSession(a,paths[i],a.campaignId);states[i]=await sessions[i].request({action:'view'});}
    assert.equal(states[i].error,null);
    assert.deepEqual(await scenarios[1-i].view(),untouched);
    const count=scenarios[i].transactions.length,prior=states[i].campaign;
    sessions[i]=await createCampaignSession(scenarios[i],paths[i],scenarios[i].campaignId);
    states[i]=await sessions[i].request({action:'view'});
    assert.deepEqual(states[i].campaign,prior);assert.equal(scenarios[i].transactions.length,count);
   }
  }
  assert.equal(interrupted,true);
  assert.equal(states[0].campaign.ending,'favoured');assert.equal(states[1].campaign.ending,'unbound');
  assert.equal(states[0].campaign.politics.library.result,'mirelle');assert.equal(states[1].campaign.politics.library.result,'dorian');
  for(const r of states){assert.equal(r.campaign.night,7);assert.equal(r.campaign.agentHistory.length,56);assert.equal(new Set(r.campaign.agentHistory.map(e=>`${e.night}:${e.actor}`)).size,56);}
  assert.equal(a.transactions.filter(t=>t.action==='accept_funded_passage'&&t.success).length,1);
  assert.equal([...a.transactions,...b.transactions].filter(t=>t.action==='deploy').length,1);
  const storage=[];
  let db=new Store(join(home,'archives.sqlite'));
  try {
   // Existing game outcomes above are unchanged. Archive with the production
   // lifecycle coordinator, using actual finalized Sandbox calls.
   for(const [i,scenario] of scenarios.entries()){
    db.register({campaignId:scenario.campaignId});
    await db.saveJson(scenario.campaignId,JSON.parse(await readFile(paths[i],'utf8')));
    const before=await scenario.resourceView();
    const final=await campaignLifecycle(db,{},null).archive(scenario,states[i]);
    const after=await scenario.resourceView();
    assert.equal(final.campaign.ending,states[i].campaign.ending);
    assert.equal(after.status,'reclaimed');assert(after.storage_usage<before.storage_usage);
    storage.push({id:scenario.campaignId,before,after,recovered:before.storage_usage-after.storage_usage});
   }
   db.close();db=new Store(join(home,'archives.sqlite'));
   for(const [i,scenario] of scenarios.entries()){
    const archived=db.archive(scenario.campaignId);assert(archived.complete);
    assert.equal(archived.snapshot.campaign.ending,states[i].campaign.ending);
    assert.equal(archived.state.campaign.agentHistory.length,56);
   }
   await writeFile('docs/evidence/pass4c2-campaigns.json',JSON.stringify({network:'local-sandbox',storage,endings:states.map(s=>s.campaign.ending),archives:scenarios.map(s=>db.archive(s.campaignId))},null,2));
  }finally{db.close();}
  await writeFile('docs/evidence/pass4b1-campaigns.json',JSON.stringify({network:'local-sandbox',contract:a.contract.accountId,states,transactions:[...a.transactions,...b.transactions]},null,2));
 }finally{await worker.tearDown();}
});
