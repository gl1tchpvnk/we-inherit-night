import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {CONTRACT,gasForMethod,rpc,result,verifySigned} from './signing.mjs';

export const METHODS={
  provisioner:['open_campaign'],
  player:['grant_access','revoke_grant','enter_room','accept_lease','reject_lease'],
  vesper:['revoke_grant'],seraphine:['claim_rent'],keeper:['advance_night','complete_campaign','settlement_dawn','archive_campaign','reclaim_campaign'],
  marius:['grant_access','revoke_grant'],lucien:['grant_access','offer_lease','claim_rent'],
  mirelle:['enter_room','grant_access'],dorian:['enter_room','grant_access'],
  cassian:['enter_room','accept_funded_passage','refund_passage_budget'],sabine:['grant_access']
};
const queues=new Map();
export function restrictedPermission(role,key,method){
  const p=key.permission?.FunctionCall;
  if(!p||p.receiver_id!==CONTRACT||!Array.isArray(p.method_names)||!p.method_names.length||p.method_names.some(m=>!METHODS[role]?.includes(m))||method&&!p.method_names.includes(method)||typeof p.allowance!=='string'||!/^\d+$/.test(p.allowance)||BigInt(p.allowance)<=0n)throw new Error('Restricted key permissions mismatch; FullAccess signing forbidden');
}
export async function verifyRuntimeRoster(actors,query=result){
  if(!actors||Object.keys(actors).length!==Object.keys(METHODS).length||new Set(Object.values(actors).map(a=>a.accountId)).size!==Object.keys(METHODS).length)throw new Error('Invalid runtime roster');
  await Promise.all(Object.entries(METHODS).map(async([role,methods])=>{
    const a=actors[role];
    if(!a?.accountId?.endsWith('.testnet')||a.accountId===CONTRACT||!a.publicKey?.startsWith('ed25519:'))throw new Error('Invalid runtime actor');
    const key=await query('query',{request_type:'view_access_key',finality:'final',account_id:a.accountId,public_key:a.publicKey});
    for(const method of methods)restrictedPermission(role,key,method);
  }));
}
function serialize(actor,work){const run=(queues.get(actor)??Promise.resolve()).then(work);const tail=run.catch(()=>{});queues.set(actor,tail);return run.finally(()=>{if(queues.get(actor)===tail)queues.delete(actor);});}
const success=t=>'SuccessValue' in t.status&&t.receipts_outcome.every(r=>!('Failure' in r.outcome.status));
export function finalized(t,expected){
  if(t.final_execution_status!=='FINAL'||t.transaction.hash!==expected.hash||t.transaction.public_key!==expected.publicKey||t.transaction.signer_id!==expected.actor||t.transaction.receiver_id!==CONTRACT)throw new Error('Transaction identity/finality mismatch; recovery required');
  const call=t.transaction.actions[0]?.FunctionCall;
  if(t.transaction.actions.length!==1||!call||call.method_name!==expected.method||call.deposit!=='0'||String(call.gas)!==gasForMethod(expected.method)||!isDeepStrictEqual(JSON.parse(Buffer.from(call.args,'base64')),expected.args))throw new Error('Finalized action mismatch');
  return {succeeded:success(t),receiptFailures:t.receipts_outcome.filter(r=>'Failure' in r.outcome.status),result:t};
}

export async function createTestnetScenario(config,store,sign,{query=result,send=rpc}={}){
  if(!/^[a-zA-Z0-9_-]{1,64}$/.test(config.campaignId)||config.contractId!==CONTRACT)throw new Error('Invalid Testnet campaign binding');
  const actors={};
  for(const role of Object.keys(METHODS)){
    if(role==='provisioner'&&!config.actors?.provisioner)continue;
    const a=config.actors?.[role];
    if(!a?.accountId?.endsWith('.testnet')||a.accountId===CONTRACT||!a.publicKey?.startsWith('ed25519:'))throw new Error('Missing isolated runtime actor/key');
    actors[role]={...a,balance:async()=>{
      const r=await query('query',{request_type:'view_account',finality:'final',account_id:a.accountId});
      // Conservative spendable estimate; payments are separately blocked below.
      return {available:(BigInt(r.amount)-BigInt(r.storage_usage)*10n**19n).toString()};
    }};
  }
  if(new Set(Object.values(actors).map(a=>a.accountId)).size!==Object.keys(actors).length)throw new Error('Campaign roles must use distinct actor identities');
  const resourceView=async()=>{const r=await query('query',{request_type:'call_function',finality:'final',account_id:CONTRACT,method_name:'campaign_resources',args_base64:Buffer.from(JSON.stringify({campaign_id:config.campaignId})).toString('base64')});return JSON.parse(Buffer.from(r.result));};
  async function rawView(actor=actors.player){
    const r=await query('query',{request_type:'call_function',finality:'final',account_id:CONTRACT,method_name:'get_world',args_base64:Buffer.from(JSON.stringify({campaign_id:config.campaignId,account_id:actor.accountId})).toString('base64')});
    const world=JSON.parse(Buffer.from(r.result));if(world.campaign_id!==config.campaignId)throw new Error('Wrong campaign response');return world;
  }
  async function reconcile(){
    for(const entry of store.transactions(config.campaignId)){
      if(entry.phase==='rejected'&&entry.reason==='Interrupted before broadcast'){
        store.journal(entry.id,config.campaignId,{...entry,phase:'unsubmitted'});continue;
      }
      if(['final','rejected','unsubmitted'].includes(entry.phase))continue;
      if(entry.phase==='intent'){
        // No payload existed, so this attempt could never have been submitted.
        store.journal(entry.id,config.campaignId,{...entry,phase:'unsubmitted',reason:'Interrupted before signing'});continue;
      }
      if(entry.phase==='signed'){
        // Resume the exact durable bytes, never create a replacement payment.
        store.journal(entry.id,config.campaignId,{...entry,phase:'broadcast'});
        await send('send_tx',{signed_tx_base64:entry.payload,wait_until:'FINAL'});
      }
      let response=await send('tx',{tx_hash:entry.hash,sender_account_id:entry.actor,wait_until:'FINAL'});
      if(response.error?.cause?.name==='UNKNOWN_TRANSACTION'&&entry.payload){
        // The marker may have committed before submission. Replaying these exact
        // bytes cannot execute twice: hash/access-key nonce stay unchanged. Never
        // re-sign an uncertain action, even after expiry or nonce rejection.
        try{response=await send('send_tx',{signed_tx_base64:entry.payload,wait_until:'FINAL'});}
        catch{throw new Error('Transaction outcome remains unknown; recorded identity retained');}
      }
      if(response.error||!response.result)throw new Error('Transaction outcome remains unknown; no replacement action or payment signed');
      finalized(response.result,entry);store.journal(entry.id,config.campaignId,{...entry,phase:'final',outcome:response.result});
    }
  }
  // Called under the campaign engine's single-writer queue. Recovery is also
  // performed before exposing views, so an unchanged game nonce cannot erase
  // a submitted but unresolved player intent.
  const view=async actor=>{await reconcile();return rawView(actor);};
  async function call(role,method,args={},deposit='0'){
    if(!METHODS[role]?.includes(method))throw new Error('Runtime method is not allowed for this actor');
    if(BigInt(deposit)!==0n){
      if(!config.prepaid||role!=='player'||method!=='accept_lease')throw new Error('Player payment unavailable: a separate bounded deposit signer has not been provisioned');
      const resources=await resourceView();
      if(!resources.prepaid)throw new Error('Campaign treasury is not provisioned');
      deposit='0';
    }
    const actor=actors[role];
    return serialize(actor.accountId,async()=>{
      await reconcile();
      if(store.pendingForActor(actor.accountId))throw new Error('Another campaign has an unresolved transaction for this actor');
      const body={...args,campaign_id:config.campaignId};
      const id=createHash('sha256').update(JSON.stringify([config.campaignId,actor.accountId,method,body])).digest('hex');
      const old=store.transactions(config.campaignId).find(t=>t.id===id);
      if(old?.phase==='final')return finalized(old.outcome,old);
      if(old&&old.phase!=='unsubmitted')throw new Error('Previously rejected intent; refresh rather than automatically repeating it');
      const entry={actor:actor.accountId,publicKey:actor.publicKey,method,args:body,phase:'intent'};
      store.journal(id,config.campaignId,entry);
      const key=await query('query',{request_type:'view_access_key',finality:'final',account_id:actor.accountId,public_key:actor.publicKey});
      restrictedPermission(role,key,method);
      if(!Number.isSafeInteger(key.nonce)||!Number.isSafeInteger(key.nonce+1))throw new Error('Unsafe access-key nonce');
      const expected={...actor,method,args:body,nonce:key.nonce+1,blockHash:key.block_hash,blockHeight:key.block_height};
      const signed=await sign(expected);
      // Check again at the submission boundary, regardless of signer implementation.
      const checked=verifySigned(signed.payload,expected);
      Object.assign(entry,checked,{phase:'signed'});store.journal(id,config.campaignId,entry);
      entry.phase='broadcast';store.journal(id,config.campaignId,entry);
      const response=await send('send_tx',{signed_tx_base64:entry.payload,wait_until:'FINAL'});
      if(response.error){
        throw new Error('Transaction status unknown; retained for recovery');
      }
      const tx=finalized(response.result,entry);entry.phase='final';entry.outcome=response.result;store.journal(id,config.campaignId,entry);
      return tx;
    });
  }
  const action=async(role,method,args={},deposit='0')=>call(role,method,{...args,nonce:(await view(actors[role])).next_nonce},deposit);
  const paymentBalance=async()=>{
    if(!config.prepaid)return (await actors.player.balance()).available;
    const resources=await resourceView();
    if(!resources.prepaid)throw new Error('Campaign treasury is not provisioned');
    return resources.treasury;
  };
  async function snapshot(error=null){
    const world=await view();return {world,error,proof:'near-testnet',events:[],walletYocto:await paymentBalance(),
      escrowYocto:world.leases.reduce((sum,l)=>sum+BigInt(l.escrow_yocto),0n).toString(),
      transactions:store.transactions(config.campaignId).filter(t=>t.phase==='final').map(t=>({action:t.method,actor:t.actor,property:t.args.property_id??'court',hash:t.hash,success:success(t.outcome),status:t.outcome.status,executionStatus:'FINAL',gasBurnt:t.outcome.receipts_outcome.reduce((n,r)=>n+BigInt(r.outcome.gas_burnt),0n).toString()}))};
  }
  async function request(r){
    let tx;
    if(r.action==='accept'){const w=await view();tx=await action('player','accept_lease',{lease_id:0},w.leases[0].price_yocto);}
    else if(r.action==='reject')tx=await action('player','reject_lease',{lease_id:0});
    else if(r.action==='settle')tx=await action('seraphine','claim_rent',{lease_id:0});
    else if(r.action==='continue')tx=await action('vesper','revoke_grant',{grant_id:0});
    else if(r.action!=='view')throw new Error('Unsupported scenario action');
    return snapshot(tx&&!tx.succeeded?'Contract rejected the action':null);
  }
  return {campaignId:config.campaignId,contract:{accountId:CONTRACT},actors,view,call,action,request,snapshot,reconcile,resourceView,paymentBalance,
    hasAccess:async(property,actor=actors.player)=>(await view(actor)).access[property]===true,political:true,living:true,dangerous:true};
}
