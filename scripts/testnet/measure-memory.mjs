
// Local synthetic benchmark. No network signer or live credentials are loaded.
import {fork} from 'node:child_process';
import {mkdtemp,rm,readdir,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {Store} from './store.mjs';
import {createGameServer} from './server.mjs';
import {createCampaignSession} from '../sandbox/campaign.mjs';
import {createEnvironmentSigner,CONTRACT} from './signing.mjs';
import {METHODS} from './scenario.mjs';
import {newCampaign} from '../../src/game.ts';
import near from 'near-api-js';

if(process.argv.includes('--child')){
 const dir=await mkdtemp(resolve('.local/memory-'));
 const store=new Store(join(dir,'game.sqlite'));
 const key=near.KeyPair.fromRandom('ed25519');
 const actors=Object.fromEntries(Object.keys(METHODS).map(role=>[role,{accountId:role+'.fixture.testnet',publicKey:key.getPublicKey().toString()}]));
 const sign=createEnvironmentSigner(JSON.stringify(Object.entries(actors).map(([role,a])=>({role,accountId:a.accountId,privateKey:key.toString()}))),actors);
 const cookies=[];
 for(let i=0;i<4;i++){
  const id='memory-'+i;store.register({campaignId:id});cookies.push(store.allocate().token);
  const c=newCampaign(id,{living:true,dangerous:true});c.night=6;
  for(const npc of Object.values(c.npcs))npc.memory=Array.from({length:7},()=> 'Synthetic bounded NPC memory '.repeat(10));
  c.agentHistory=Array.from({length:48},(_,j)=>({night:Math.floor(j/8),actor:Object.keys(c.npcs)[j%8],kind:'pass',source:'deterministic-policy',execution:'local',outcome:'passed'}));
  await store.saveJson(id,{campaign:c,pending:null,chainBinding:{campaignId:id,contractId:CONTRACT}});
  for(let j=0;j<1000;j++)store.journal(id+'-'+j,id,{actor:actors.player.accountId,phase:'final',outcome:{receipts_outcome:[],fixture:'x'.repeat(4096)}});
 }
 const world={night:6,next_nonce:0,access:{crypt:true,library:true,lounge:true},properties:[],grants:[],ancestry:[],leases:[{id:0,status:'offered',price_yocto:'0',offer_expiry_night:7}]};
 const server=createGameServer({store,origin:'http://127.0.0.1:5196',secureCookies:false,loadSession:async id=>{
  // Exercise the real signer offline; it only signs disposable fixture bytes.
  await sign({...actors.player,method:'enter_room',args:{campaign_id:id,nonce:0,property_id:'library'},nonce:1,blockHash:near.utils.serialize.base_encode(new Uint8Array(32))});
  const scenario={campaignId:id,contract:{accountId:CONTRACT},actors,view:async()=>structuredClone(world),snapshot:async(error=null)=>({world:structuredClone(world),error,walletYocto:'1',transactions:store.transactions(id).map(t=>({hash:t.id,actor:t.actor,action:'enter_room',executionStatus:'FINAL',success:true}))}),reconcile:async()=>{store.transactions(id);store.pendingForActor(actors.player.accountId);}};
  return createCampaignSession(scenario,id,id,undefined,null,store);
 }});
 let peak=process.memoryUsage().rss;const timer=setInterval(()=>{peak=Math.max(peak,process.memoryUsage().rss);},10);
 server.listen(5196,'127.0.0.1',()=>process.send({ready:true,cookies,idleMiB:process.memoryUsage().rss/2**20}));
 process.on('message',async()=>{clearInterval(timer);server.closeAllConnections();await new Promise(r=>server.close(r));const result={peakRssMiB:Math.max(peak,process.memoryUsage().rss,process.resourceUsage().maxRSS*1024)/2**20,heapUsedMiB:process.memoryUsage().heapUsed/2**20,sqliteMiB:(await stat(join(dir,'game.sqlite'))).size/2**20};store.close();await rm(dir,{recursive:true,force:true});process.send(result);process.disconnect();});
}else{
 const child=fork(new URL(import.meta.url),['--child'],{execArgv:['--max-old-space-size=256'],stdio:['ignore','ignore','inherit','ipc']});
 const ready=await new Promise((r,j)=>{child.once('message',r);child.once('exit',code=>j(new Error('benchmark child exited '+code)));});
 let apiResponses=0,assetResponses=0;
 try{
  const files=await readdir('dist/art');let largest={name:'',size:0};
  for(const name of files){const s=await stat(join('dist/art',name));if(s.isFile()&&s.size>largest.size)largest={name,size:s.size};}
  for(let round=0;round<20;round++){
   await Promise.all([...ready.cookies.map(async token=>{const r=await fetch('http://127.0.0.1:5196/api/game',{method:'POST',headers:{Origin:'http://127.0.0.1:5196','Content-Type':'application/json',Cookie:'night_session='+token},body:'{"action":"view"}'});if(r.status!==200)throw new Error('API '+r.status);await r.json();apiResponses++;}),...Array.from({length:4},async()=>{const r=await fetch('http://127.0.0.1:5196/art/'+encodeURIComponent(largest.name));if(r.status!==200)throw new Error('Asset '+r.status);for await(const chunk of r.body)void chunk;assetResponses++;})]);
  }
  const done=new Promise(r=>child.once('message',r));child.send('done');const measured=await done;
  console.log(JSON.stringify({kind:'local synthetic workload, not live gameplay',platform:process.platform,node:process.version,heapCapMiB:256,campaigns:4,storedTransactions:4000,apiResponses,assetResponses,largestAssetBytes:largest.size,idleMiB:ready.idleMiB,...measured},null,2));
 }catch(e){child.kill();throw e;}
}
