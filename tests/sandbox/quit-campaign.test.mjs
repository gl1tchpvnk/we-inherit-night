import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import near from 'near-api-js';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario,RENT_YOCTO} from '../../scripts/sandbox/scenario.mjs';
import {Store} from '../../scripts/testnet/store.mjs';
import {campaignLifecycle,closingSnapshot} from '../../scripts/testnet/lifecycle.mjs';
import {newCampaign} from '../../src/game.ts';

const ok=r=>assert.equal(r.succeeded&&r.receiptFailures.length===0,true,JSON.stringify(r.status));
test('voluntary Quit settles a paid early campaign, recovers lost reclamation, and frees capacity for a fresh campaign',{timeout:180000},async()=>{
 const home=join('.local','quit-campaign-'+randomUUID()),{worker}=await startPersistentSandbox(home);
 let store=new Store(join(home,'game.sqlite'));
 try{
  const s=await createScenario(worker,{campaignId:'quit-early',actorPrefix:'q-',political:true,living:true,dangerous:true,prepaid:true,restrictKeys:true,lifecycle:true});
  const creator=await worker.rootAccount.createSubAccount('creator');
  const order=['vesper','player','keeper','seraphine','marius','lucien','mirelle','dorian','cassian','sabine'];
  ok(await s.contract.callRaw(s.contract,'configure_provisioning',{policy:{creator:creator.accountId,actors:order.map(r=>s.actors[r].accountId),max_active:1,interval_blocks:10,treasury:RENT_YOCTO.replace(/^2/,'4')}}));
  ok(await s.contract.callRaw(s.contract,'fund_pool',{}, {attachedDeposit:'100000000000000000000000'}));
  const runtime=near.KeyPair.fromRandom('ed25519'),old=await creator.getKey();
  ok(await creator.batch(creator).addKey(runtime.getPublicKey(),near.transactions.functionCallAccessKey(s.contract.accountId,['open_campaign'],1000000000000000000000000n)).deleteKey(old.getPublicKey()).transact());await creator.setKey(runtime);
  const open=id=>creator.callRaw(s.contract,'open_campaign',{campaign_id:id},{gas:'50000000000000'});
  assert.equal((await open('full')).succeeded,false);
  ok(await s.action('player','accept_lease',{lease_id:1},RENT_YOCTO));
  store.register({campaignId:s.campaignId});store.allocate();
  const campaign=newCampaign(s.campaignId,{living:true,dangerous:true});
  const snapshot={...await s.snapshot(),campaign,pending:false};await store.saveJson(s.campaignId,{campaign,pending:null});
  const before=await s.resourceView(),actualCall=s.call;let lost=false;
  s.call=async(...args)=>{const result=await actualCall(...args);if(args[1]==='reclaim_campaign'&&!lost){lost=true;throw new Error('Lost finalized response');}return result;};
  await assert.rejects(campaignLifecycle(store,{},null).close(s,snapshot,'quit'),/Lost finalized/);
  assert.equal(closingSnapshot(store.closing(s.campaignId)).pending,true);
  const count=s.transactions.length;store.close();store=new Store(join(home,'game.sqlite'));
  const result=await campaignLifecycle(store,{},null).close(s,snapshot,'quit'),after=await s.resourceView();
  assert.equal(s.transactions.length,count);assert.equal(result.closure.complete,true);assert.equal(result.pending,false);assert.deepEqual(result.campaign,campaign);assert.deepEqual(result.world,snapshot.world);
  assert.equal(after.status,'reclaimed');assert.equal(after.active,0);assert.equal(after.world_bytes,0);assert.equal(after.liabilities,'0');assert.equal(after.treasury_total,'0');assert.equal(BigInt(after.pool)-BigInt(before.pool),BigInt(before.treasury));
  assert.equal(store.archive(s.campaignId).complete,true);assert.equal(store.archive(s.campaignId).state.campaign.night,0);
  assert.equal((await s.call('keeper','reclaim_campaign',{commitment:after.commitment})).succeeded,false);
  assert.equal((await open('quit-early')).succeeded,false);
  const created=await open('fresh-after-quit');ok(created);
  const final=await worker.provider.sendJsonRpc('tx_status',{tx_hash:created.result.transaction.hash,sender_account_id:creator.accountId,wait_until:'FINAL'});assert.equal(final.final_execution_status,'FINAL');
  const fresh=await s.contract.view('campaign_resources',{campaign_id:'fresh-after-quit'});assert.equal(fresh.active,1);assert.equal(fresh.status,'active');
  await writeFile('.local/quit-sandbox-result.json',JSON.stringify({network:'local-sandbox',status:'PASS',before,after,fresh,originalNight:campaign.night,historyPreserved:true,lostResponseRecovered:true,freshTransaction:final.transaction.hash},null,2));
 }finally{store.close();await worker.tearDown();}
});
