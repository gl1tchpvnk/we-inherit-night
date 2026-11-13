import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import near from 'near-api-js';
import {Store} from '../scripts/testnet/store.mjs';
import {createGameServer} from '../scripts/testnet/server.mjs';
import {verifySigned,createKeychainSigner,CONTRACT,GAS} from '../scripts/testnet/signing.mjs';
import {createTestnetScenario,METHODS} from '../scripts/testnet/scenario.mjs';
import {createCampaignSession} from '../scripts/sandbox/campaign.mjs';

async function temporary(){const dir=await mkdtemp(resolve('.local/backend-test-'));return {dir,path:join(dir,'game.sqlite'),clean:()=>rm(dir,{recursive:true,force:true})};}
const fixtureConfig=id=>({campaignId:id,contractId:CONTRACT,actors:Object.fromEntries(Object.keys(METHODS).map(role=>[role,{accountId:role+'.fixture.testnet',publicKey:'ed25519:fixture'}]))});

test('SQLite allocation is unique, hashed, durable and never recycles abandoned campaigns',async()=>{
 const tmp=await temporary();let store=new Store(tmp.path);
 try{
  store.register(fixtureConfig('one'));store.register(fixtureConfig('two'));
  assert.throws(()=>store.register(fixtureConfig('verification-a')));
  const a=store.allocate(),b=store.allocate();assert.notEqual(a.id,b.id);assert.equal(store.lookup('one'),null);
  assert.notEqual(store.db.prepare('SELECT token_hash FROM sessions LIMIT 1').get().token_hash,a.token);
  assert.throws(()=>store.allocate(a.token));assert.equal(store.lookup(a.token).id,a.id);
  await store.saveJson(a.id,{campaign:{id:a.id,revision:4},pending:{kind:'player'}});
  store.close();store=new Store(tmp.path);assert.equal(store.lookup(a.token).id,a.id);assert.equal((await store.readJson(a.id)).campaign.revision,4);
  assert.throws(()=>store.register(fixtureConfig('one')));
 }finally{store.close();await tmp.clean();}
});

test('HTTP sessions enforce cookies, Origin, command shape, ownership and restart persistence',async()=>{
 const tmp=await temporary();let store=new Store(tmp.path),server;
 async function start(){
  server=createGameServer({store,origin:'http://127.0.0.1:5199',loadSession:async id=>({request:async req=>{
   const state=await store.readJson(id)??{campaign:{id,revision:0,night:0}};
   if(req.action!=='view')state.campaign.revision++;
   await store.saveJson(id,state);return {...state,world:{campaign_id:id},error:null};
  }})});await new Promise(r=>server.listen(5199,'127.0.0.1',r));
 }
 const request=(body,cookie='',extra={})=>fetch('http://127.0.0.1:5199/api/game',{method:'POST',headers:{Origin:'http://127.0.0.1:5199','Content-Type':'application/json',Cookie:cookie,Connection:'close',...extra},body:JSON.stringify(body)});
 try{
  store.register(fixtureConfig('one'));store.register(fixtureConfig('two'));await start();
  const metadata=await fetch('http://127.0.0.1:5199/api/save',{headers:{Connection:'close'}});assert.equal((await metadata.json()).exists,false);assert.equal(store.db.prepare('SELECT count(*) AS n FROM sessions').get().n,0);
  const first=await request({action:'view'}),cookie=first.headers.get('set-cookie');assert.match(cookie,/HttpOnly/);assert.match(cookie,/SameSite=Strict/);assert.match(cookie,/Secure/);
  const a=await first.json(),second=await request({action:'view'}),cookieB=second.headers.get('set-cookie').split(';')[0],b=await second.json();const cookieA=cookie.split(';')[0];assert.notEqual(a.campaign.id,b.campaign.id);
  assert.equal((await request({action:'game',campaign_id:b.campaign.id,revision:0},cookieA)).status,403);
  assert.equal((await request({action:'game',campaign_id:a.campaign.id,revision:0,method:'create_campaign'},cookieA)).status,400);
  assert.equal((await request({action:'view'},cookieA,{Origin:'https://attacker.example'})).status,403);
  assert.equal((await request({action:'view'},'')).status,409);
  assert.equal((await request({action:'reset',campaign_id:a.campaign.id,revision:0},cookieA)).status,409);
  await request({action:'game',campaign_id:a.campaign.id,revision:0,choice:'feed'},cookieA);
  assert.equal((await (await request({action:'view'},cookieB)).json()).campaign.revision,0);
  await new Promise(r=>server.close(r));store.close();store=new Store(tmp.path);await start();
  assert.equal((await (await request({action:'view'},cookieA)).json()).campaign.revision,1);
 }finally{if(server?.listening)await new Promise(r=>server.close(r));store.close();await tmp.clean();}
});

async function syntheticSigned(expected,key){
 const signer=await near.InMemorySigner.fromKeyPair('testnet',expected.accountId,key);
 const tx=near.transactions.createTransaction(expected.accountId,key.getPublicKey(),CONTRACT,expected.nonce,[near.transactions.functionCall(expected.method,expected.args,BigInt(GAS),0n)],near.utils.serialize.base_decode(expected.blockHash));
 const [,signed]=await near.transactions.signTransaction(tx,signer,expected.accountId,'testnet');
 return {payload:Buffer.from(signed.encode()).toString('base64')};
}
test('runtime checks actual signed key, arguments, receiver and signature before accepting payload',async()=>{
 const key=near.KeyPair.fromRandom('ed25519');const expected={accountId:'vesper.fixture.testnet',publicKey:key.getPublicKey().toString(),nonce:1,blockHash:near.utils.serialize.base_encode(new Uint8Array(32)),method:'revoke_grant',args:{campaign_id:'one',grant_id:0,nonce:0}};
 const signed=await syntheticSigned(expected,key);assert.equal(verifySigned(signed.payload,expected).publicKey,expected.publicKey);
 assert.throws(()=>verifySigned(signed.payload,{...expected,publicKey:near.KeyPair.fromRandom('ed25519').getPublicKey().toString()}));
 assert.throws(()=>verifySigned(signed.payload,{...expected,args:{...expected.args,campaign_id:'two'}}));
 const bytes=Buffer.from(signed.payload,'base64');bytes[bytes.length-1]^=1;assert.throws(()=>verifySigned(bytes.toString('base64'),expected));
 assert.throws(()=>createKeychainSigner({cli:'near',provisioningUsername:'same',runtimeUsername:'same'}),/separate Windows/);
});

test('interrupted broadcast retries identical bytes only; unresolved status blocks views',async()=>{
 const tmp=await temporary(),store=new Store(tmp.path);const config=fixtureConfig('one');
 const key=near.KeyPair.fromRandom('ed25519');config.actors.vesper.publicKey=key.getPublicKey().toString();
 let submissions=0,lookups=0,known=false,submitted,firstPayload;const hash=near.utils.serialize.base_encode(new Uint8Array(32));
 const query=async(method,p)=>method==='block'?{header:{height:1}}:method==='EXPERIMENTAL_protocol_config'?{transaction_validity_period:86400}:p.request_type==='view_access_key'?{permission:{FunctionCall:{receiver_id:CONTRACT,method_names:['revoke_grant'],allowance:'50000000000000000000000'}},nonce:1,block_hash:hash,block_height:1}:{result:[...Buffer.from(JSON.stringify({campaign_id:'one',night:0,next_nonce:0}))]};
 const send=async(method,p)=>{
  if(method==='send_tx'){submissions++;if(firstPayload)assert.equal(p.signed_tx_base64,firstPayload);else firstPayload=p.signed_tx_base64;const decoded=near.transactions.SignedTransaction.decode(Buffer.from(p.signed_tx_base64,'base64'));const e={accountId:config.actors.vesper.accountId,publicKey:config.actors.vesper.publicKey,nonce:2,blockHash:hash,method:'revoke_grant',args:{grant_id:0,nonce:0,campaign_id:'one'}};const checked=verifySigned(p.signed_tx_base64,e);submitted={final_execution_status:'FINAL',status:{SuccessValue:''},receipts_outcome:[],transaction:{hash:checked.hash,public_key:e.publicKey,signer_id:e.accountId,receiver_id:CONTRACT,actions:[{FunctionCall:{method_name:e.method,deposit:'0',gas:Number(GAS),args:Buffer.from(JSON.stringify(e.args)).toString('base64')}}]}};throw new Error('controlled lost response after simulated commit');}
  lookups++;return known?{result:submitted}:{error:{cause:{name:'UNKNOWN_TRANSACTION'}}};
 };
 try{
  let scenario=await createTestnetScenario(config,store,e=>syntheticSigned(e,key),{query,send});
  await assert.rejects(scenario.action('vesper','revoke_grant',{grant_id:0}),/lost response/);assert.equal(submissions,1);
  await assert.rejects(scenario.view(),/unknown/);assert.equal(store.transactions('one')[0].phase,'broadcast');
  known=true;scenario=await createTestnetScenario(config,store,e=>syntheticSigned(e,key),{query,send});await scenario.reconcile();assert.equal(store.transactions('one')[0].phase,'final');assert.equal(submissions,2);assert.equal(lookups,2);
  await assert.rejects(scenario.action('player','accept_lease',{lease_id:0},'20000000000000000000000'),/bounded deposit signer/);
  await assert.rejects(scenario.call('vesper','create_campaign',{}),/not allowed/);
 }finally{store.close();await tmp.clean();}
});

test('existing campaign engine writes SQLite and retains pending player state during uncertain finality',async()=>{
 const tmp=await temporary(),store=new Store(tmp.path);const actors=Object.fromEntries(Object.keys(METHODS).map(role=>[role,{accountId:role+'.fixture.testnet'}]));
 const world={campaign_id:'one',night:0,next_nonce:0,access:{crypt:true,library:true,lounge:true},properties:[],grants:[],leases:[{status:'offered',price_yocto:'0',offer_expiry_night:2}],ancestry:[]};
 let uncertain=false;const scenario={actors,campaignId:'one',contract:{accountId:CONTRACT},political:true,living:true,dangerous:true,reconcile:async()=>{if(uncertain)throw new Error('pending finality');},view:async()=>world,snapshot:async(error=null)=>({world,error,walletYocto:'1'})};
 try{
  let session=await createCampaignSession(scenario,'one','one',undefined,null,store);const initial=await session.request({action:'view'});assert.equal(initial.campaign.id,'one');
  let saved=await store.readJson('one');saved.campaign.resources.blood=2;saved.campaign.actionsLeft=3;saved.campaign.actionLimit=3;await store.saveJson('one',saved);
  session=await createCampaignSession(scenario,'one','one',undefined,null,store);
  const feed={action:'game',choice:'feed',campaign_id:'one',revision:saved.campaign.revision};
  const fed=await session.request(feed);assert.equal(fed.error,null);assert.equal(fed.campaign.resources.blood,6);assert.equal(fed.campaign.actionsLeft,2);
  const duplicate=await session.request(feed);assert.match(duplicate.error,/stale/);assert.equal(duplicate.campaign.resources.blood,6);
  saved=await store.readJson('one');saved.pending={kind:'player',nonce:0,before:saved.campaign,after:{...saved.campaign,revision:saved.campaign.revision+1},action:'reject'};await store.saveJson('one',saved);uncertain=true;
  session=await createCampaignSession(scenario,'one','one',undefined,null,store);await session.request({action:'view'});assert.equal((await store.readJson('one')).pending.kind,'player');
  const before=await store.readJson('one');await session.request({...feed,revision:fed.campaign.revision});assert.deepEqual(await store.readJson('one'),before);
 }finally{store.close();await tmp.clean();}
});
