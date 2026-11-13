import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {Store} from '../scripts/testnet/store.mjs';
import {campaignLifecycle} from '../scripts/testnet/lifecycle.mjs';

test('archive is immutable, survives restart, and recovers a lost reclamation response without another call',async()=>{
 const dir=await mkdtemp(resolve('.local/archive-test-'));let store=new Store(join(dir,'game.sqlite'));
 try{
  const snapshot={campaign:{id:'closed',status:'concluded',night:7,ending:'favoured'},world:{night:7},pending:false,error:null};
  await store.saveJson('closed',{campaign:snapshot.campaign,pending:null});
  let status='active',commitment,night=7,sends=[];
  const scenario={campaignId:'closed',actors:{player:{accountId:'player'}},reconcile:async()=>{},snapshot:async()=>({world:{night:7},error:null}),
   view:async()=>({night,leases:[{status:'accepted',settled:true,end_night:8}]}),
   resourceView:async()=>({status,commitment}),
   call:async(role,method,args)=>{sends.push(method);
    if(method==='complete_campaign'){commitment=args.commitment;status='completed';}
    if(method==='settlement_dawn')night++;
    if(method==='archive_campaign')status='archived';
    if(method==='reclaim_campaign'){status='reclaimed';throw new Error('Lost response after confirmed reclamation');}
    return {succeeded:true};
   }};
  const lifecycle=campaignLifecycle(store,{},null);
  await assert.rejects(()=>lifecycle.archive(scenario,snapshot),/Lost response/);
  const first=store.archive('closed');assert.equal(first.complete,false);assert.equal(first.snapshot.campaign.ending,'favoured');
  store.close();store=new Store(join(dir,'game.sqlite'));
  const count=sends.length,restored=await campaignLifecycle(store,{},null).archive(scenario,snapshot);
  assert.equal(restored.campaign.ending,'favoured');assert.equal(sends.length,count);assert.equal(store.archive('closed').complete,true);
  assert.equal(store.archive('closed').serialized,first.serialized);assert.equal(store.archive('closed').commitment,commitment);
 }finally{store.close();await rm(dir,{recursive:true,force:true});}
});

test('unfinished or pending campaign is not archived or reclaimed',async()=>{
 const dir=await mkdtemp(resolve('.local/archive-pending-'));const store=new Store(join(dir,'game.sqlite'));
 try{
  const scenario={campaignId:'pending',reconcile:()=>{throw new Error('must not execute');}};
  const run=campaignLifecycle(store,{},null).archive;
  for(const snapshot of [{campaign:{status:'playing',night:6}},{campaign:{status:'concluded',night:7},pending:true}])assert.equal(await run(scenario,snapshot),snapshot);
  assert.equal(store.archive('pending'),null);
 }finally{store.close();await rm(dir,{recursive:true,force:true});}
});
