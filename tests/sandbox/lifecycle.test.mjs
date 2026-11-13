import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {Store} from '../../scripts/testnet/store.mjs';
import {campaignLifecycle} from '../../scripts/testnet/lifecycle.mjs';
import {KeyPair} from 'near-workspaces';
import near from 'near-api-js';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario,RENT_YOCTO} from '../../scripts/sandbox/scenario.mjs';
const ok=r=>assert.equal(r.succeeded&&r.receiptFailures.length===0,true,JSON.stringify(r.status));
const fail=r=>assert.equal(r.succeeded,false);

test('measured storage, restricted prepaid leases, settlement, tombstones and bounded repeated creation',{timeout:240000},async()=>{
 const {worker}=await startPersistentSandbox(join('.local','lifecycle-'+randomUUID()));
 try{
  const a=await createScenario(worker,{campaignId:'life-a',actorPrefix:'a-',political:true,living:true,dangerous:true,prepaid:true,restrictKeys:true,retainFixtureKeys:true});
  const resources=id=>a.contract.view('campaign_resources',{campaign_id:id});
  const initial=await resources('life-a');
  assert.equal(initial.treasury,'40000000000000000000000');assert(initial.world_bytes<10000);
  const b=await createScenario(worker,{contract:a.contract,campaignId:'life-b',actorPrefix:'b-',political:true,living:true,dangerous:true,prepaid:true,restrictKeys:true});
  const bInitial=await b.view(),bMoney=await resources('life-b');
  const raw=async(actor,method,args,deposit='0')=>actor.callRaw(a.contract,method,args,{gas:'50000000000000',attachedDeposit:deposit});
  const playerKey=await a.actors.player.getKey();
  const access=await worker.provider.query({request_type:'view_access_key',finality:'final',account_id:a.actors.player.accountId,public_key:playerKey.getPublicKey().toString()});
  assert.notEqual(access.permission,'FullAccess');
  const nonce=(await a.view()).next_nonce;
  const paid=await a.action('player','accept_lease',{lease_id:1},RENT_YOCTO);ok(paid);
  assert.equal(paid.result.transaction.actions[0].FunctionCall.deposit,'0');
  assert.equal((await resources('life-a')).treasury,RENT_YOCTO);assert.equal((await a.view()).leases[1].escrow_yocto,RENT_YOCTO);
  fail(await a.call('player','accept_lease',{lease_id:1,nonce}));
  fail(await raw(a.actors.player,'accept_lease',{campaign_id:'life-b',lease_id:1,nonce:(await b.view()).next_nonce}));
  assert.deepEqual(await b.view(),bInitial);assert.equal((await resources('life-b')).treasury,bMoney.treasury);
  const before=await a.actors.seraphine.accountView();ok(await a.action('seraphine','claim_rent',{lease_id:1}));
  assert(BigInt((await a.actors.seraphine.accountView()).amount)>BigInt(before.amount));
  for(let n=0;n<7;n++)ok(await a.call('keeper','advance_night',{expected_night:n}));
  // Keeper's old key intentionally lacks lifecycle methods; add a separate
  // restricted lifecycle key using disposable Sandbox account provisioning.
  const keeper=a.actors.keeper,root=worker.rootAccount;
  await assert.rejects(()=>raw(keeper,'complete_campaign',{campaign_id:'life-a',commitment:'a'.repeat(64)}),/MethodNameMismatch|access key|permission/i);
  ok(await a.action('cassian','refund_passage_budget'));
  const key=KeyPair.fromRandom('ed25519');
  // Disposable test fixture only; provisioning key is never used for gameplay.
  const provisioning=a.provisioningKeys.keeper;
  await keeper.setKey(provisioning);
  ok(await keeper.batch(keeper).addKey(key.getPublicKey(),near.transactions.functionCallAccessKey(a.contract.accountId,['complete_campaign','archive_campaign','reclaim_campaign','settlement_dawn'],200000000000000000000000n)).transact());
  await keeper.setKey(key);
  const commitment='a'.repeat(64);
  ok(await a.call('keeper','complete_campaign',{commitment}));
  ok(await a.call('keeper','archive_campaign',{commitment}));
  const peak=await resources('life-a');ok(await a.call('keeper','reclaim_campaign',{commitment}));
  const reclaimed=await resources('life-a');assert.equal(reclaimed.status,'reclaimed');assert.equal(reclaimed.commitment,commitment);assert.equal(reclaimed.world_bytes,0);assert(reclaimed.storage_usage<peak.storage_usage);
  fail(await a.call('keeper','reclaim_campaign',{commitment}));
  await assert.rejects(()=>a.view(),/unknown campaign/);
  fail(await raw(a.actors.player,'enter_room',{campaign_id:'life-a',property_id:'library',nonce:2}));
  const creator=await root.createSubAccount('provisioner');
  const order=['vesper','player','keeper','seraphine','marius','lucien','mirelle','dorian','cassian','sabine'];
  ok(await raw(a.contract,'configure_provisioning',{policy:{creator:creator.accountId,actors:order.map(r=>b.actors[r].accountId),max_active:3,interval_blocks:10,treasury:'40000000000000000000000'}}));
  ok(await raw(a.contract,'fund_pool',{},'100000000000000000000000'));
  const pk=KeyPair.fromRandom('ed25519'),old=await creator.getKey();
  ok(await creator.batch(creator).addKey(pk.getPublicKey(),near.transactions.functionCallAccessKey(a.contract.accountId,['open_campaign'],200000000000000000000000n)).deleteKey(old.getPublicKey()).transact());await creator.setKey(pk);
  const poolStore=new Store(join('.local','provision-'+randomUUID()+'.sqlite'));
  let createdId;
  try {
    const lifecycle=campaignLifecycle(poolStore,{provisioning:{contractId:a.contract.accountId,actors:Object.fromEntries(order.map(r=>[r,{accountId:b.actors[r].accountId}]))}},null,async binding=>({
      call:async(role,method)=>{assert.equal(role,'provisioner');const result=await raw(creator,method,{campaign_id:binding.campaignId});
        const final=await worker.provider.sendJsonRpc('tx_status',{tx_hash:result.result.transaction.hash,sender_account_id:creator.accountId,wait_until:'FINAL'});assert.equal(final.final_execution_status,'FINAL');return result;},
      view:()=>a.contract.view('get_world',{campaign_id:binding.campaignId,account_id:b.actors.player.accountId}),resourceView:()=>resources(binding.campaignId)
    }));
    await lifecycle.ensureCapacity();createdId=poolStore.db.prepare('SELECT id FROM campaigns').get().id;
    await lifecycle.ensureCapacity();assert.equal(poolStore.db.prepare('SELECT count(*) AS n FROM campaigns').get().n,1);
    const visitor=poolStore.allocate();assert.equal(visitor.id,createdId);
    await assert.rejects(()=>lifecycle.ensureCapacity(),/cooling down/);
  }finally{poolStore.close();}
  const c=await a.contract.view('get_world',{campaign_id:createdId,account_id:b.actors.player.accountId});assert.equal(c.night,0);assert.equal(c.grants.length,4);assert.equal(c.leases.length,2);
  fail(await raw(creator,'open_campaign',{campaign_id:'life-a'}));
  await assert.rejects(()=>raw(b.actors.player,'open_campaign',{campaign_id:'unauthorized'}),/MethodNameMismatch|access key|permission/i);
  assert.equal((await resources(createdId)).treasury,'40000000000000000000000');
  assert.deepEqual(await b.view(),bInitial);
  // Exercise existing bounded growth, not a guessed maximum reservation.
  const init={mode:'political',participants:order.map(r=>a.actors[r].accountId),vesper:a.actors.vesper.accountId,player:a.actors.player.accountId,executor:a.actors.keeper.accountId,seraphine:a.actors.seraphine.accountId,marius:a.actors.marius.accountId,lucien:a.actors.lucien.accountId};
  const boundsStart=(await a.contract.accountView()).storage_usage;
  ok(await raw(a.contract,'create_campaign',{...init,campaign_id:'bounds'}));
  await root.transfer(a.actors.player,'2000000000000000000000000'); // batch gas only, disposable Sandbox
  await a.actors.player.setKey(a.provisioningKeys.player);
  for(let first=0;first<256;first+=8){
    const batch=a.actors.player.batch(a.contract);
    for(let n=first;n<Math.min(first+8,256);n++)batch.functionCall('grant_access',{campaign_id:'bounds',property_id:'library',scope:'enter',grantee:a.actors.mirelle.accountId,parent_grant_id:null,can_delegate:false,expiry_night:null,nonce:n},{gas:25000000000000n});
    ok(await batch.transact());
  }
  const maxGrants=await resources('bounds');
  fail(await raw(a.actors.player,'grant_access',{campaign_id:'bounds',property_id:'library',scope:'enter',grantee:a.actors.mirelle.accountId,parent_grant_id:null,can_delegate:false,expiry_night:null,nonce:256}));
  await a.actors.seraphine.setKey(a.provisioningKeys.seraphine);
  for(let first=0;first<64;first+=8){
    const batch=a.actors.seraphine.batch(a.contract);
    for(let n=first;n<first+8;n++)batch.functionCall('offer_lease',{campaign_id:'bounds',property_id:'sanctuary',buyer:a.actors.player.accountId,price_yocto:RENT_YOCTO,duration_nights:7,offer_expiry_night:3,nonce:n},{gas:25000000000000n});
    ok(await batch.transact());
  }
  const maxBounds=await resources('bounds');
  fail(await raw(a.actors.seraphine,'offer_lease',{campaign_id:'bounds',property_id:'sanctuary',buyer:a.actors.player.accountId,price_yocto:RENT_YOCTO,duration_nights:7,offer_expiry_night:3,nonce:64}));
  const beforeFailed=await a.contract.view('get_world',{campaign_id:'bounds',account_id:a.actors.player.accountId});
  assert.equal(beforeFailed.grants.length,256);assert.equal(beforeFailed.leases.length,64);
  // Drain only free operational backing in this disposable fixture; liabilities
  // remain in the account. A new world must fail atomically without using them.
  const account=await a.contract.accountView();
  const obligations=BigInt(maxBounds.liabilities)+BigInt(maxBounds.treasury_total)+BigInt(maxBounds.pool);
  const keep=BigInt(account.storage_usage)*BigInt(maxBounds.storage_price)+obligations+10000000000000000000000n;
  await a.contract.transfer(root,BigInt(account.amount)-keep);
  fail(await raw(a.contract,'create_campaign',{...init,campaign_id:'underfunded'}));
  await assert.rejects(()=>resources('underfunded'),/unknown campaign lifecycle/);
  await assert.rejects(()=>a.contract.view('get_world',{campaign_id:'underfunded',account_id:a.actors.player.accountId}),/unknown campaign/);
  assert.deepEqual(await a.contract.view('get_world',{campaign_id:'bounds',account_id:a.actors.player.accountId}),beforeFailed);
  await root.transfer(a.contract,'1000000000000000000000000');
  await writeFile('docs/evidence/pass4c2-lifecycle.json',JSON.stringify({network:'local-sandbox',initial,initialCampaignBytes:initial.storage_usage-a.transactions.find(t=>t.action==='create_campaign').storageBefore,peak,maxGrants,maxBounds,boundsFootprint:maxBounds.storage_usage-boundsStart,reclaimed,storageRecovered:peak.storage_usage-reclaimed.storage_usage,created:await resources(createdId),paidHash:paid.result.transaction.hash,transactions:a.transactions},null,2));
 }finally{await worker.tearDown();}
});
