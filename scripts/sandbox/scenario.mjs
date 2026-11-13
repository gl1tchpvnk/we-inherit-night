import {timed} from './startup-trace.mjs';
import { readFile } from 'node:fs/promises';
import { transactionEvidence } from './runtime.mjs';
import { TransactionResult } from 'near-workspaces';
import nearApi from 'near-api-js';
import {KeyPair} from 'near-workspaces';

const {transactions:nearTransactions}=nearApi;

export const RENT_YOCTO = '20000000000000000000000'; // 0.02 Sandbox NEAR
export const WASM_PATH = 'target/near/night_authority/night_authority.wasm';

export async function createScenario(worker, options={}) {
  const root=worker.rootAccount;
  const campaignId=options.campaignId??'default';
  const actorPrefix=options.actorPrefix??'';
  const actors={},provisioningKeys={};
  for (const name of ['vesper','player','seraphine','keeper','lucien',...(options.political?['marius','cassian','mirelle','dorian','sabine']:[])]) {
    actors[name]=options.resume?root.getSubAccount(actorPrefix+name):await timed(`account:${name}`,()=>root.createSubAccount(actorPrefix+name,{initialBalance:name==='player'?250000000000000000000000n:1000000000000000000000000n}));
  }
  const contract=options.contract??(options.resume?root.getSubAccount('castle'):await timed('account:castle',()=>root.createSubAccount('castle',{initialBalance:20000000000000000000000000n})));
  const transactions=options.transactions??[];
  async function record(tx){transactions.push(tx);if(options.saveTransactions)await options.saveTransactions(transactions);}
  async function finalized(result) {
    const final=await worker.provider.sendJsonRpc('tx_status',{tx_hash:result.result.transaction.hash,
      sender_account_id:result.result.transaction.signer_id,wait_until:'FINAL'});
    if(final.final_execution_status!=='FINAL')throw new Error('Transaction has not finalized');
    const complete=new TransactionResult(final,result.startMs,Date.now(),{});
    return complete;
  }
  const wasm=await readFile(WASM_PATH);
  // Never upgrade persisted pre-migration World storage automatically.
  if(!options.resume&&!options.contract){
    const before=await contract.accountView();
    const deployment=await timed('deploy',async()=>finalized(await contract.deploy(wasm)));
    await record(transactionEvidence('deploy','castle','castle',deployment,before,await contract.accountView()));
    if(!deployment.succeeded)throw new Error('Sandbox deployment failed');
    requireSuccess(await call('castle','new_registry'));
  }
  const view=async(actor=actors.player)=>{
    const world=await contract.view('get_world',{campaign_id:campaignId,account_id:actor.accountId});
    if(world.campaign_id!==undefined&&world.campaign_id!==campaignId)throw new Error('Contract campaign mismatch');
    return world;
  };
  async function call(actorName,method,args={},deposit='0') {
    const actor=actorName==='castle'?contract:actors[actorName];
    let property=args.property_id;
    if(!property){
      if(method==='advance_night'||method.startsWith('new')||method==='create_campaign')property='castle';
      else if(args.lease_id!==undefined)property=(await view()).leases.find(l=>l.id===args.lease_id)?.property_id??'unknown';
      else if(args.grant_id!==undefined)property=(await view()).grants.find(g=>g.id===args.grant_id)?.property_id??'unknown';
      else property='unknown';
    }
    const before=await contract.accountView();
    const result=await timed(`contract:${actorName}:${method}`,async()=>finalized(await actor.callRaw(contract,method,method==='new_registry'?args:{...args,campaign_id:campaignId},{gas:'50000000000000',attachedDeposit:deposit})));
    await record({...transactionEvidence(method,actorName,property,result,before,await contract.accountView()),campaignId,contractId:contract.accountId});
    return result;
  }
  async function action(actor,method,args={},deposit='0') {
    return call(actor,method,{...args,nonce:(await view(actors[actor])).next_nonce},options.prepaid&&actor==='player'&&method==='accept_lease'?'0':deposit);
  }
  function requireSuccess(result) {
    if(!result.succeeded || result.receiptFailures.length) throw new Error(result.receiptFailureMessages.join('; ') || JSON.stringify(result.status));
  }
  if(!options.resume){
  requireSuccess(await call('castle','create_campaign',{mode:options.political?'political':'economy',participants:Object.values(actors).map(a=>a.accountId),vesper:actors.vesper.accountId,player:actors.player.accountId,
    seraphine:actors.seraphine.accountId,executor:actors.keeper.accountId,...(options.political?{marius:actors.marius.accountId,lucien:actors.lucien.accountId}:{})},'0'));
  requireSuccess(await action('vesper','grant_access',{property_id:'crypt',scope:'enter',grantee:actors.player.accountId,
    parent_grant_id:null,can_delegate:true,expiry_night:null}));
  requireSuccess(await action('seraphine','offer_lease',{property_id:'lounge',buyer:actors.player.accountId,
    price_yocto:RENT_YOCTO,duration_nights:3,offer_expiry_night:2}));
  if(options.political){
    requireSuccess(await action('seraphine','offer_lease',{property_id:'sanctuary',buyer:actors.player.accountId,price_yocto:RENT_YOCTO,duration_nights:7,offer_expiry_night:3}));
    requireSuccess(await action('player','grant_access',{property_id:'library',scope:'enter',grantee:actors.mirelle.accountId,parent_grant_id:null,can_delegate:false,expiry_night:options.living?3:null}));
    requireSuccess(await action('marius','grant_access',{property_id:'court',scope:'enter',grantee:actors.sabine.accountId,parent_grant_id:null,can_delegate:true,expiry_night:null}));
  }
  if(options.living)requireSuccess(await action('seraphine','grant_access',{property_id:'lounge',scope:'enter',grantee:actors.player.accountId,parent_grant_id:null,can_delegate:false,expiry_night:null}));
  if(options.dangerous)requireSuccess(await action('cassian','fund_passage',{},'10000000000000000000000'));
  if(options.prepaid)requireSuccess(await call('castle','fund_treasury',{},'40000000000000000000000'));
  if(options.restrictKeys){
    const permissions={...(options.prepaid?{player:['accept_lease','reject_lease','grant_access','revoke_grant','enter_room']}:{}),vesper:['revoke_grant'],seraphine:['claim_rent'],keeper:options.lifecycle?['advance_night','complete_campaign','archive_campaign','reclaim_campaign','settlement_dawn']:['advance_night'],lucien:options.dangerous?['grant_access','offer_lease','claim_rent']:options.political?['grant_access']:['enter_room'],...(options.political?{marius:['grant_access','revoke_grant'],sabine:['grant_access'],mirelle:options.living?['enter_room','grant_access']:['enter_room'],cassian:options.dangerous?['enter_room','accept_funded_passage','refund_passage_budget']:['enter_room'],dorian:options.living?['enter_room','grant_access']:['enter_room']}:{})};
    // Different signing accounts: no shared nonce and no shared evidence-file writes.
    const restrictions=await Promise.allSettled(Object.entries(permissions).map(async([name,methods])=>{
      const account=actors[name],old=await account.getKey(),key=KeyPair.fromRandom('ed25519');
      if(options.retainFixtureKeys)provisioningKeys[name]=old;
      const batch=account.batch(account).addKey(key.getPublicKey(),nearTransactions.functionCallAccessKey(contract.accountId,methods,200000000000000000000000n));
      if(!options.retainFixtureKeys)batch.deleteKey(old.getPublicKey());
      requireSuccess(await timed(`restricted-key:${name}`,()=>batch.transact()));
      await account.setKey(key);
    }));
    const failed=restrictions.find(result=>result.status==='rejected');
    if(failed)throw failed.reason;
  }
  }

  async function snapshot(error=null) {
    const [world,balance]=await Promise.all([view(),actors.player.balance()]);
    const lease=world.leases[0];
    const phase=lease.status==='accepted'?(world.night>=lease.end_night?'expired':world.grants[0].revoked?'independent':'retaliation_pending'):lease.status;
    return {world,error,proof:'near-sandbox',events:[],phase,
      walletYocto:options.prepaid?(await contract.view('campaign_resources',{campaign_id:campaignId})).treasury:balance.available,
      escrowYocto:world.leases.reduce((sum,l)=>sum+BigInt(l.escrow_yocto),0n).toString(),
      transactions:transactions.map(({transactionOutcome,receiptOutcomes,receipts,...summary})=>summary)};
  }
  // Fixed policy, not AI: react only after finalized accepted state. Retry is safe.
  async function retaliate() {
    const world=await view();
    if(world.leases[0].status==='accepted'&&!world.grants[0].revoked)
      requireSuccess(await action('vesper','revoke_grant',{grant_id:0}));
  }
  async function request(request) {
    try {
      switch(request.action) {
        case 'view': break;
        case 'accept': requireSuccess(await action('player','accept_lease',{lease_id:0},RENT_YOCTO)); break;
        case 'reject': requireSuccess(await action('player','reject_lease',{lease_id:0})); break;
        case 'continue': await retaliate(); break;
        case 'settle': requireSuccess(await action('seraphine','claim_rent',{lease_id:0})); break;
        case 'enter':
          if(!['crypt','library','lounge'].includes(request.property_id))throw new Error('Unknown room');
          requireSuccess(await action('player','enter_room',{property_id:request.property_id})); break;
        default: throw new Error('Unknown scenario action');
      }
      return snapshot();
    } catch(error) {return snapshot(String(error));}
  }
  const hasAccess=(property_id,actor=actors.player)=>contract.view('has_access',{campaign_id:campaignId,account_id:actor.accountId,property_id});
  return {campaignId,actors,provisioningKeys,contract,transactions,view,hasAccess,call,action,request,snapshot,reconcile:async()=>{},resourceView:()=>contract.view('campaign_resources',{campaign_id:campaignId}),political:!!options.political,living:!!options.living,dangerous:!!options.dangerous};
}
