import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {join} from 'node:path';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario,RENT_YOCTO,WASM_PATH} from '../../scripts/sandbox/scenario.mjs';
import {Store} from '../../scripts/testnet/store.mjs';
import {campaignLifecycle} from '../../scripts/testnet/lifecycle.mjs';
import {newCampaign} from '../../src/game.ts';

const ok=r=>assert.equal(r.succeeded&&r.receiptFailures.length===0,true,JSON.stringify(r.status));
const digest=b=>createHash('sha256').update(b).digest('hex');
test('deployed WASM and exact public state upgrade without migration; reclaim two early campaigns',{timeout:240000},async()=>{
 const old=await readFile('.local/capacity-deployed.wasm'),next=await readFile(WASM_PATH);
 const captured=JSON.parse(await readFile('docs/evidence/capacity-deployed-state.json','utf8'));
 assert.equal(digest(old),captured.sha256);
 const home=join('.local','capacity-upgrade-'+randomUUID()),{worker}=await startPersistentSandbox(home);
 const store=new Store(join(home,'game.sqlite'));
 try{
  const root=worker.rootAccount,contract=await root.createSubAccount('castle',{initialBalance:30000000000000000000000000n});
  const raw=(actor,method,args={})=>actor.callRaw(contract,method,args,{gas:'100000000000000'});
  ok(await contract.deploy(old));ok(await raw(contract,'new_registry'));
  const a=await createScenario(worker,{contract,campaignId:'early-defeat',actorPrefix:'a-',political:true,living:true,dangerous:true,prepaid:true,restrictKeys:true,lifecycle:true});
  const b=await createScenario(worker,{contract,campaignId:'abandoned',actorPrefix:'b-',political:true,living:true,dangerous:true,prepaid:true,restrictKeys:true,lifecycle:true});
  const creator=await root.createSubAccount('creator');
  const order=['vesper','player','keeper','seraphine','marius','lucien','mirelle','dorian','cassian','sabine'];
  ok(await raw(contract,'configure_provisioning',{policy:{creator:creator.accountId,actors:order.map(r=>a.actors[r].accountId),max_active:2,interval_blocks:10,treasury:'40000000000000000000000'}}));
  for(const s of [a,b]){
   ok(await s.call('keeper','advance_night',{expected_night:0}));
   ok(await s.action('player','accept_lease',{lease_id:1},RENT_YOCTO));
   ok(await s.call('keeper','advance_night',{expected_night:1}));
  }
  const before=await contract.viewStateRaw(),worlds=await Promise.all([a.view(),b.view()]),money=await a.resourceView();
  ok(await contract.deploy(next));
  assert.deepEqual(await contract.viewStateRaw(),before);
  assert.deepEqual(await Promise.all([a.view(),b.view()]),worlds);
  const after=await a.resourceView();for(const key of ['liabilities','treasury_total','pool','active'])assert.equal(after[key],money[key]);
  assert.equal(await contract.view('campaign_capacity'),2);
  assert.equal((await raw(creator,'set_campaign_capacity',{max_active:8})).succeeded,false);
  assert.equal((await raw(contract,'set_campaign_capacity',{max_active:0})).succeeded,false);
  ok(await raw(contract,'set_campaign_capacity',{max_active:8}));assert.equal(await contract.view('campaign_capacity'),8);
  ok(await raw(contract,'set_campaign_capacity',{max_active:1}));assert.equal((await a.resourceView()).active,2);
  assert.equal((await raw(creator,'open_campaign',{campaign_id:'over-cap'})).succeeded,false);
  ok(await raw(contract,'set_campaign_capacity',{max_active:8}));
  assert.equal((await raw(creator,'open_campaign',{campaign_id:'unfunded'})).succeeded,false);
  assert.equal((await raw(contract,'new_registry')).succeeded,false);
  const records=[];
  for(const [s,reason] of [[a,'defeat'],[b,'abandoned']]){
   store.register({campaignId:s.campaignId});store.allocate();
   const campaign=newCampaign(s.campaignId,{living:true,dangerous:true});campaign.night=2;
   if(reason==='defeat'){campaign.status='defeat';campaign.ending='failure';campaign.reason='Blood exhausted';campaign.resources.blood=0;}
   await store.saveJson(s.campaignId,{campaign,pending:null});
   if(reason==='abandoned')store.touch(s.campaignId,Date.now()-86400001);
   const snapshot={...await s.snapshot(),campaign,pending:false};
   const initial=await s.resourceView(),life=campaignLifecycle(store,{},null);
   const call=s.call;let lost=false;
   s.call=async(...args)=>{const result=await call(...args);if(args[1]==='reclaim_campaign'&&!lost){lost=true;throw new Error('Lost response');}return result;};
   await assert.rejects(life.close(s,snapshot,reason),/Lost response/);
   const result=await life.close(s,snapshot,reason),end=await s.resourceView();
   assert.deepEqual(result.campaign,campaign);assert.deepEqual(result.world,snapshot.world);assert.equal(result.closure.complete,true);
   assert.equal(end.status,'reclaimed');assert.equal(BigInt(initial.liabilities)-BigInt(end.liabilities),30000000000000000000000n);assert.equal(end.treasury,'0');
   assert.equal(BigInt(end.pool)-BigInt(initial.pool),BigInt(initial.treasury));
   const calls=s.transactions.length;await life.close(s,snapshot,reason);assert.equal(s.transactions.length,calls);
   assert.equal((await s.call('keeper','reclaim_campaign',{commitment:end.commitment})).succeeded,false);
   records.push({id:s.campaignId,reason,initial,end,originalNight:result.campaign.night,settlementNight:store.archive(s.campaignId).settlement.world.night});
  }
  assert.equal((await a.resourceView()).active,0);
  // Exact live public storage is replayed only into a disposable local account.
  const live=await root.createSubAccount('live-state',{initialBalance:10000000000000000000000000n});
  ok(await live.deploy(old));
  for(const row of captured.state.values)await live.patchState(Buffer.from(row.key,'base64'),Buffer.from(row.value,'base64'));
  const liveBefore=await live.viewStateRaw();ok(await live.deploy(next));assert.deepEqual(await live.viewStateRaw(),liveBefore);
  assert.equal(await live.view('campaign_capacity'),4);
  ok(await live.callRaw(live,'set_campaign_capacity',{max_active:12}));assert.equal(await live.view('campaign_capacity'),12);
  ok(await live.callRaw(live,'set_campaign_capacity',{max_active:4}));assert.deepEqual(await live.viewStateRaw(),liveBefore);
  await writeFile('docs/evidence/capacity-upgrade.json',JSON.stringify({network:'local-sandbox',deployedSha256:digest(old),replacementSha256:digest(next),exactLiveStatePreserved:true,populatedStatePreserved:true,records},null,2));
 }finally{store.close();await worker.tearDown();}
});
