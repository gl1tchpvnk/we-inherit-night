import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import near from 'near-api-js';
import {Store} from '../scripts/testnet/store.mjs';
import {createEnvironmentSigner,CONTRACT} from '../scripts/testnet/signing.mjs';
import {createTestnetScenario,recoverSharedActors,METHODS} from '../scripts/testnet/scenario.mjs';
import {campaignLifecycle} from '../scripts/testnet/lifecycle.mjs';

// Synthetic network only. No live keys, RPC or session-authorized new decisions.
async function fixture(){
 const dir=await mkdtemp(resolve('.local/shared-recovery-')),store=new Store(join(dir,'game.sqlite'));
 const key=near.KeyPair.fromRandom('ed25519'),block=near.utils.serialize.base_encode(new Uint8Array(32));
 const actors=Object.fromEntries(Object.keys(METHODS).map(role=>[role,{accountId:role+'.fixture.testnet',publicKey:key.getPublicKey().toString()}]));
 const signer=createEnvironmentSigner(JSON.stringify(Object.entries(actors).map(([role,a])=>({role,...a,privateKey:key.toString()}))),actors);
 const worlds=new Map(['a','b'].map(id=>[id,{campaign_id:id,night:0,next_nonce:0,leases:[],access:{},properties:[],grants:[],status:'active',commitment:'',budget:'100'}]));
 const receipts=new Map(),nonces=new Map(),executions=[],payloads=[];
 let signs=0,held=true,hideReceipt=false,expired=false,malformed=false;
 const query=async(method,p)=>{
  if(method==='block')return {header:{height:1}};
  if(method==='EXPERIMENTAL_protocol_config')return {transaction_validity_period:86400};
  if(p.request_type==='view_access_key'){const role=Object.keys(actors).find(r=>actors[r].accountId===p.account_id);return {nonce:nonces.get(p.account_id)??1,block_hash:block,block_height:expired?90000:2,permission:{FunctionCall:{receiver_id:CONTRACT,method_names:METHODS[role],allowance:'100000000000000000000000'}}};}
  const args=JSON.parse(Buffer.from(p.args_base64,'base64')),w=worlds.get(args.campaign_id);
  const value=p.method_name==='campaign_resources'?{status:w.status,commitment:w.commitment,prepaid:true,treasury:'40000'}:{...w,passage_budget:args.account_id===actors.cassian.accountId?{remaining:w.budget,refund_pending:false}:null};
  return {result:[...Buffer.from(JSON.stringify(value))]};
 };
 const send=async(method,p)=>{
  if(method==='tx')return !hideReceipt&&receipts.has(p.tx_hash)?{result:receipts.get(p.tx_hash)}:{error:{cause:{name:'UNKNOWN_TRANSACTION'}}};
  assert.equal(method,'send_tx');payloads.push(p.signed_tx_base64);
  if(held)throw new Error('controlled lost response before inclusion');
  const signed=near.transactions.SignedTransaction.decode(Buffer.from(p.signed_tx_base64,'base64')),tx=signed.transaction,fc=tx.actions[0].functionCall,args=JSON.parse(Buffer.from(fc.args));
  const {createHash}=await import('node:crypto'),hash=near.utils.serialize.base_encode(createHash('sha256').update(Buffer.from(p.signed_tx_base64,'base64').subarray(0,-65)).digest());
  if(receipts.has(hash))return {result:receipts.get(hash)};
  assert.ok(BigInt(tx.nonce)>BigInt(nonces.get(tx.signerId)??1),'duplicate signing nonce');
  nonces.set(tx.signerId,Number(tx.nonce));const w=worlds.get(args.campaign_id);
  if(fc.methodName==='advance_night'||fc.methodName==='settlement_dawn'){assert.equal(w.night,args.expected_night);w.night++;}
  if(fc.methodName==='claim_rent'){const lease=w.leases.find(l=>l.id===args.lease_id);assert.equal(lease.settled,false);lease.settled=true;lease.escrow_yocto='0';w.next_nonce++;}
  if(fc.methodName==='refund_passage_budget'){assert.notEqual(w.budget,'0');w.budget='0';w.next_nonce++;}
  if(fc.methodName==='complete_campaign'){assert.equal(w.night,7);w.status='completed';w.commitment=args.commitment;}
  if(fc.methodName==='archive_campaign')w.status='archived';
  if(fc.methodName==='reclaim_campaign'){assert.equal(w.status,'archived');assert.equal(w.budget,'0');assert(w.leases.every(l=>l.settled));w.status='reclaimed';}
  executions.push({campaign:args.campaign_id,method:fc.methodName,args});
  const outcome={final_execution_status:'FINAL',status:{SuccessValue:''},receipts_outcome:[],transaction:{hash,public_key:key.getPublicKey().toString(),signer_id:tx.signerId,receiver_id:malformed?'wrong.testnet':CONTRACT,actions:[{FunctionCall:{method_name:fc.methodName,gas:String(fc.gas),deposit:'0',args:Buffer.from(fc.args).toString('base64')}}]}};
  receipts.set(hash,outcome);return {result:outcome};
 };
 const sign=async e=>{signs++;return signer(e);};
 const scenarios={};for(const id of ['a','b']){const config={campaignId:id,contractId:CONTRACT,actors,prepaid:true};store.register(config);scenarios[id]=await createTestnetScenario(config,store,sign,{query,send});}
 return {store,actors,scenarios,worlds,executions,payloads,receipts,query,send,signs:()=>signs,
  release:()=>{held=false;},hide:()=>{hideReceipt=true;},expire:()=>{expired=true;},malform:()=>{malformed=true;},
  clean:async()=>{store.close();await rm(dir,{recursive:true,force:true});}};
}

test('B recovers A exact keeper identity without A session and signs only B next operation',async()=>{
 const f=await fixture();try{
  await assert.rejects(f.scenarios.a.call('keeper','advance_night',{expected_night:0}),/controlled/);
  const original=f.store.transactions('a')[0];assert.equal(f.signs(),1);
  await assert.rejects(f.scenarios.b.call('keeper','advance_night',{expected_night:0}),/unknown/);
  assert.equal(f.signs(),1);assert.equal(f.executions.length,0);assert.equal(f.store.transactions('b').length,0);
  f.release();await f.scenarios.b.call('keeper','advance_night',{expected_night:0});
  assert.equal(f.store.transactions('a')[0].hash,original.hash);assert.equal(f.store.transactions('a')[0].payload,original.payload);
  assert.equal(f.store.transactions('a')[0].phase,'final');assert.equal(f.signs(),2);
  assert.deepEqual(f.executions.map(e=>e.campaign),['a','b']);
  await f.scenarios.b.call('keeper','advance_night',{expected_night:0});assert.equal(f.executions.length,2);assert.equal(f.signs(),2);
 }finally{await f.clean();}
});

test('periodic shared recovery works without either session; concurrent recovery cannot duplicate execution',async()=>{
 const f=await fixture();try{
  await assert.rejects(f.scenarios.a.call('keeper','advance_night',{expected_night:0}));
  const before=f.store.transactions('a')[0];f.release();
  await Promise.all([recoverSharedActors(f.store,f.actors,f),recoverSharedActors(f.store,f.actors,f),f.scenarios.a.reconcile()]);
  assert.equal(f.executions.length,1);assert.equal(f.signs(),1);assert.equal(f.store.transactions('a')[0].hash,before.hash);
  assert.equal(f.store.pendingForActor(f.actors.keeper.accountId),false);
 }finally{await f.clean();}
});

for(const fault of ['expired','hash','campaign','nonfinal','receipt'])test('uncertain or mismatched '+fault+' remains blocked without replacement signing',async()=>{
 const f=await fixture();try{
  await assert.rejects(f.scenarios.a.call('keeper','advance_night',{expected_night:0}));
  const entry=f.store.transactions('a')[0];f.release();
  if(fault==='expired')f.expire();
  if(fault==='hash')f.store.journal(entry.id,'a',{...entry,hash:'wrong'});
  if(fault==='campaign')f.store.journal(entry.id,'a',{...entry,args:{...entry.args,campaign_id:'b'}});
  if(fault==='receipt')f.malform();
  const options=fault==='nonfinal'?{query:f.query,send:async()=>({result:{final_execution_status:'INCLUDED'}})}:f;
  const result=await recoverSharedActors(f.store,f.actors,options);assert.equal(result.blocked,1);
  assert.equal(f.store.pendingForActor(f.actors.keeper.accountId),true);assert.equal(f.signs(),1);
  assert.notEqual(f.store.transactions('a')[0].phase,'final');
  if(fault!=='receipt')assert.equal(f.executions.length,0);
 }finally{await f.clean();}
});

test('both authorized abandonments reuse lifecycle, settle once, preserve history and reclaim once',async()=>{
 const f=await fixture();try{
  await assert.rejects(f.scenarios.a.call('keeper','advance_night',{expected_night:0}));f.release();
  assert.equal((await recoverSharedActors(f.store,f.actors,f)).blocked,0);
  for(const id of ['a','b']){
   const w=f.worlds.get(id);w.leases.push({id:1,status:'accepted',owner:f.actors.seraphine.accountId,settled:false,payout_pending:false,escrow_yocto:'20',end_night:7});
   const snapshot={campaign:{id,status:'playing',night:w.night,revision:2},pending:false,error:null,world:structuredClone(w)};
   await f.store.saveJson(id,{campaign:snapshot.campaign,pending:null});
   const life=campaignLifecycle(f.store,{},null);const result=await life.close(f.scenarios[id],snapshot,'quit');
   assert.equal(result.archiveComplete,true);assert.equal(result.closure.complete,true);
   assert.equal(f.store.archive(id).snapshot.campaign.status,'playing');assert.equal(f.worlds.get(id).status,'reclaimed');
   const count=f.executions.length;await life.close(f.scenarios[id],snapshot,'quit');assert.equal(f.executions.length,count);
   for(const method of ['claim_rent','refund_passage_budget','complete_campaign','archive_campaign','reclaim_campaign'])assert.equal(f.executions.filter(e=>e.campaign===id&&e.method===method).length,1);
   assert(f.store.transactions(id).every(t=>t.phase==='final'));
  }
  assert.equal(f.store.pendingTransactions().length,0);
 }finally{await f.clean();}
});
