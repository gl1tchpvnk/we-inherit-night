import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {Store} from '../scripts/testnet/store.mjs';
import {campaignLifecycle} from '../scripts/testnet/lifecycle.mjs';
import {servicePolicy} from '../scripts/testnet/config.mjs';
import {newCampaign} from '../src/game.ts';
import {createGameServer} from '../scripts/testnet/server.mjs';

test('configured HTTP admission is durable; closed playing campaigns can be replaced safely',async()=>{
 const dir=await mkdtemp(resolve('.local/capacity-http-')),store=new Store(join(dir,'game.sqlite'));
 const origin='http://127.0.0.1:5217';let server;
 const start=async()=>{server=createGameServer({store,origin,requireCompletion:true,creation:{perMinute:2,perDay:2},loadSession:async id=>({request:async()=>({campaign:{id,revision:3,status:'playing'},closure:{reason:'abandoned',complete:true},pending:false})})});await new Promise(r=>server.listen(5217,'127.0.0.1',r));};
 const stop=()=>new Promise(r=>server.close(r));
 const send=(body,cookie='')=>fetch(origin+'/api/game',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie,Connection:'close'},body:JSON.stringify(body)});
 try{
  for(const id of ['one','two','three'])store.register({campaignId:id});
  store.touch('one',0);await start();
  const first=await send({action:'view'}),cookie=first.headers.get('set-cookie').split(';')[0];assert.equal(first.status,200);
  assert(store.activity('one').last_activity>Date.now()-10000);
  assert.equal((await send({action:'reset',campaign_id:'one',revision:2},cookie)).status,409);
  assert.equal((await send({action:'reset',campaign_id:'one',revision:3},cookie)).status,200);
  await stop();await start();assert.equal((await send({action:'view'})).status,429);
 }finally{if(server)await stop();store.close();await rm(dir,{recursive:true,force:true});}
});

async function fixture(reason='defeat'){
 const dir=await mkdtemp(resolve('.local/capacity-test-'));let store=new Store(join(dir,'game.sqlite'));
 store.register({campaignId:'one'});store.allocate();
 const campaign=newCampaign('one',{living:true,dangerous:true});campaign.night=2;
 if(reason==='defeat'){campaign.status='defeat';campaign.ending='failure';campaign.reason='Blood exhausted';campaign.resources.blood=0;}
 const world={night:2,leases:[{id:0,owner:'seraphine',status:'accepted',settled:false,payout_pending:false,end_night:8,escrow_yocto:'20'}]};
 const snapshot={campaign,world:structuredClone(world),pending:false,error:null};await store.saveJson('one',{campaign,pending:null});
 if(reason==='abandoned')store.touch('one',Date.now()-86400001);
 let status='active',commitment,budget=10,refundPending=false,treasury=40,pool=0,paid=0,refunded=0,uncertain=false,failAfter;
 const sends=[];
 const scenario={campaignId:'one',actors:{player:{accountId:'player'},seraphine:{accountId:'seraphine'},cassian:{accountId:'cassian'}},
  reconcile:async()=>{if(uncertain)throw new Error('Unknown outcome');},
  view:async actor=>({...structuredClone(world),...(actor?.accountId==='cassian'?{passage_budget:{remaining:String(budget),refund_pending:refundPending}}:{})}),
  snapshot:async()=>({world:structuredClone(world),error:null,pending:false,walletYocto:String(treasury)}),resourceView:async()=>({status,commitment,treasury:String(treasury),pool:String(pool)}),
  call:async(role,method,args)=>{
   sends.push(method);assert.equal(role,'keeper');
   if(method==='advance_night'||method==='settlement_dawn'){assert.equal(args.expected_night,world.night);world.night++;}
   if(method==='complete_campaign'){assert(world.night>=7);assert.equal(paid,20);assert.equal(budget,0);assert.equal(refundPending,false);commitment=args.commitment;status='completed';pool+=treasury;treasury=0;}
   if(method==='archive_campaign'){assert.equal(status,'completed');assert(world.night>=8);assert.equal(args.commitment,commitment);status='archived';}
   if(method==='reclaim_campaign'){assert.equal(status,'archived');assert.equal(args.commitment,commitment);status='reclaimed';}
   if(failAfter===method){failAfter=null;throw new Error('Lost response');}return {succeeded:true,receiptFailures:[]};
  },action:async(role,method)=>{
   sends.push(method);
   if(method==='claim_rent'){assert.equal(role,'seraphine');assert.equal(paid,0);paid=20;world.leases[0].settled=true;world.leases[0].escrow_yocto='0';}
   if(method==='refund_passage_budget'){assert.equal(role,'cassian');assert(world.night>=5);assert.equal(refunded,0);refunded=budget;budget=0;}
   if(failAfter===method){failAfter=null;throw new Error('Lost response');}return {succeeded:true,receiptFailures:[]};
  }};
 return {dir,get store(){return store;},scenario,snapshot,world,sends,fail:method=>{failAfter=method;},unknown:value=>{uncertain=value;},pendingRefund:value=>{refundPending=value;},finances:()=>({paid,refunded,pool,treasury}),reopen:()=>{store.close();store=new Store(join(dir,'game.sqlite'));},clean:async()=>{store.close();await rm(dir,{recursive:true,force:true});}};
}

for(const reason of ['defeat','abandoned'])for(const failure of ['advance_night','claim_rent','refund_passage_budget','complete_campaign','settlement_dawn','archive_campaign','reclaim_campaign'])test(`${reason}: recover ${failure} without duplicate payments or fabricated gameplay`,async()=>{
 const f=await fixture(reason);try{
  const original=structuredClone(f.snapshot);f.fail(failure);
  await assert.rejects(campaignLifecycle(f.store,{},null).close(f.scenario,f.snapshot,reason),/Lost response/);
  assert.equal(f.store.closing('one').reason,reason);f.reopen();
  const lifecycle=campaignLifecycle(f.store,{},null),result=await lifecycle.close(f.scenario,f.snapshot,reason);
  assert.equal(result.closure.complete,true);assert.equal(result.pending,false);assert.deepEqual(result.campaign,original.campaign);assert.deepEqual(result.world,original.world);
  assert.deepEqual((await f.store.readJson('one')).campaign,original.campaign);
  assert.equal(f.world.night,8);assert.deepEqual(f.finances(),{paid:20,refunded:10,pool:40,treasury:0});
  const count=f.sends.length;await lifecycle.close(f.scenario,f.snapshot,reason);assert.equal(f.sends.length,count);
  assert.equal(f.sends.filter(m=>m==='claim_rent').length,1);assert.equal(f.sends.filter(m=>m==='refund_passage_budget').length,1);
  assert.equal(f.store.archive('one').state.campaign.night,2);assert.equal(f.store.archive('one').settlement.world.night,7);
  assert.throws(()=>f.store.register({campaignId:'one'}));assert.equal(f.store.cleanupCandidate(86400000),undefined);
 }finally{await f.clean();}
});

test('pending gameplay, unknown finality and pending callbacks block cleanup',async()=>{
 const f=await fixture();try{
  const life=campaignLifecycle(f.store,{},null);
  const pending={...f.snapshot,pending:true};assert.equal(await life.close(f.scenario,pending,'defeat'),pending);assert.equal(f.store.closing('one'),null);
  f.unknown(true);await assert.rejects(life.close(f.scenario,f.snapshot,'defeat'),/Unknown/);assert.equal(f.store.closing('one'),null);f.unknown(false);
  f.world.leases[0].payout_pending=true;await assert.rejects(life.close(f.scenario,f.snapshot,'defeat'),/callback/);assert.equal(f.sends.length,0);
  f.world.leases[0].payout_pending=false;f.pendingRefund(true);await assert.rejects(life.close(f.scenario,f.snapshot,'defeat'),/callback/);assert.equal(f.sends.length,0);
 }finally{await f.clean();}
});

test('inactivity is durable; sweep rechecks after player queue and skips active campaigns',async()=>{
 const f=await fixture('abandoned');try{
  const last=f.store.activity('one').last_activity;f.reopen();assert.equal(f.store.activity('one').last_activity,last);
  const life=campaignLifecycle(f.store,{},null);let unblock,loaded=0;
  const player=f.store.serial('one',()=>new Promise(r=>{unblock=()=>{f.store.touch('one');r();};}));await Promise.resolve();
  const sweep=life.sweep(async()=>{loaded++;return {request:async()=>{}};});unblock();await Promise.all([player,sweep]);assert.equal(loaded,0);
  await assert.rejects(life.close(f.scenario,f.snapshot,'abandoned'),/not eligible/);
  f.store.touch('one',Date.now()-86400001);
  await life.sweep(async()=>({request:()=>life.close(f.scenario,f.snapshot,'abandoned')}));assert.equal(f.store.archive('one').complete,true);
 }finally{await f.clean();}
});

test('creation policy stays bounded and final capacity rejection does not permanently poison provisioning',async()=>{
 for(const config of [{creation:{perMinute:0}},{creation:{perDay:10001}},{creation:{cooldownMs:0}},{cleanup:{inactivityMs:0}}])assert.throws(()=>servicePolicy(config));
 const f=await fixture();try{
  let succeeded=false,calls=[];
  const life=campaignLifecycle(f.store,{creation:{cooldownMs:1000,perMinute:8,perDay:100},provisioning:{}},null,async binding=>({call:async()=>{calls.push(binding.campaignId);return {succeeded};},view:async()=>({night:0}),resourceView:async()=>({prepaid:true,status:'active'})}));
  await assert.rejects(life.ensureCapacity(),/rejected/);await assert.rejects(life.ensureCapacity(),/cooling/);
  const job=JSON.parse(f.store.db.prepare("SELECT value FROM service_state WHERE id='provision'").get().value);job.started-=1001;
  f.store.db.prepare("UPDATE service_state SET value=? WHERE id='provision'").run(JSON.stringify(job));succeeded=true;
  await life.ensureCapacity();assert.equal(calls.length,2);assert.notEqual(calls[0],calls[1]);assert.equal(f.store.db.prepare('SELECT count(*) AS n FROM campaigns').get().n,2);
 }finally{await f.clean();}
});
