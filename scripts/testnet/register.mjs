import {readFile} from 'node:fs/promises';
import {acquireWriter} from './config.mjs';
import {Store} from './store.mjs';
import {createTestnetScenario,METHODS} from './scenario.mjs';
import {result,CONTRACT} from './signing.mjs';

// Offline administrative allocation import: no signing, account creation or
// privileged endpoint. Provisioning and bootstrap remain a separate operator task.
const [database,manifest]=process.argv.slice(2);
if(!database||!manifest)throw new Error('Usage: node scripts/testnet/register.mjs <database> <public-campaign-manifest.json>');
const config=JSON.parse(await readFile(manifest,'utf8'));
const release=acquireWriter(database);const store=new Store(database);
try{
  if(!config.prepaid&&store.db.prepare('SELECT id FROM campaigns').all().some(({id})=>store.config(id).actors.player.accountId===config.actors.player.accountId))throw new Error('Visitor campaigns require distinct player accounts');
  const scenario=await createTestnetScenario(config,store,()=>{throw new Error('Signing disabled during import');});
  const w=await scenario.view();
  if(config.prepaid&&!(await scenario.resourceView()).prepaid)throw new Error('Campaign is not prepaid');
  if(w.night!==0||w.next_nonce!==1||w.grants.length!==4||w.leases.length!==2||w.leases.some(l=>l.status!=='offered')||w.grants.some(g=>g.revoked)||!w.access.crypt||!w.access.library||!w.access.lounge)throw new Error('Campaign is not a fresh complete bootstrap');
  const a=config.actors;
  const grants=[['crypt','vesper','player',true,null],['library','player','mirelle',false,3],['court','marius','sabine',true,null],['lounge','seraphine','player',false,null]];
  for(const [i,[property,owner,grantee,delegate,expiry]] of grants.entries()){
    const g=w.grants[i];if(g.id!==i||g.property_id!==property||g.grantor!==a[owner].accountId||g.grantee!==a[grantee].accountId||g.scope!=='enter'||g.parent_grant_id!==null||g.can_delegate!==delegate||g.expiry_night!==expiry||!w.grant_validity[i])throw new Error('Unexpected initial grant');
  }
  for(const [i,property,duration,expiry] of [[0,'lounge',3,2],[1,'sanctuary',7,3]]){
    const l=w.leases[i];if(l.id!==i||l.property_id!==property||l.owner!==a.seraphine.accountId||l.buyer!==a.player.accountId||l.duration_nights!==duration||l.offer_expiry_night!==expiry||l.price_yocto!=='20000000000000000000000'||l.end_night!==null||l.escrow_yocto!=='0')throw new Error('Unexpected initial lease');
  }
  const budget=(await scenario.view(scenario.actors.cassian)).passage_budget;
  if(budget?.seller!==a.lucien.accountId||budget.remaining!=='10000000000000000000000'||budget.expiry_night!==5||budget.lease_id!==null)throw new Error('Missing bounded passage budget');
  for(const [role,actor] of Object.entries(a)){
    const key=await result('query',{request_type:'view_access_key',finality:'final',account_id:actor.accountId,public_key:actor.publicKey});
    const p=key.permission?.FunctionCall;
    if(!p||p.receiver_id!==CONTRACT||!p.allowance||!p.method_names.length||p.method_names.some(m=>!METHODS[role]?.includes(m)))throw new Error('Unsafe runtime key');
  }
  store.register(config);console.log('Verified unused Testnet campaign registered; no transaction submitted.');
}finally{store.close();release();}
