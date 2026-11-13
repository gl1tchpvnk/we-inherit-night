import {runtimeConfig,acquireWriter} from './config.mjs';
import {Store} from './store.mjs';
import {campaignLifecycle,archivedSnapshot,closingSnapshot} from './lifecycle.mjs';
import {createGameServer} from './server.mjs';
import {createTestnetScenario,verifyRuntimeRoster,recoverSharedActors} from './scenario.mjs';
import {createKeychainSigner,createEnvironmentSigner} from './signing.mjs';
import {createCampaignSession} from '../sandbox/campaign.mjs';

const config=await runtimeConfig();
process.umask(0o077);
const release=acquireWriter(config.database);
const store=new Store(config.database);
function signer(){
  if(process.env.NIGHT_RUNTIME_KEYS)return createEnvironmentSigner(process.env.NIGHT_RUNTIME_KEYS,config.provisioning?.actors??config.actors);
  if(process.env.RENDER==='true')throw new Error('Render requires restricted environment signing');
  return createKeychainSigner(config.signing??{});
}
let sign;
try{
  if(process.env.RENDER==='true')await verifyRuntimeRoster(config.provisioning.actors);
  if(config.provisioning||store.db.prepare('SELECT count(*) AS n FROM campaigns').get().n)sign=signer();
}
catch{store.close();release();throw new Error('Restricted signer configuration invalid');}
const lifecycle=campaignLifecycle(store,config,sign);
async function closeCampaign(scenario,snapshot,reason){
  try{return await lifecycle.close(scenario,snapshot,reason);}
  catch(error){
    const closing=store.closing(scenario.campaignId);
    if(!closing)throw error;
    // A durable closure is resumable, not a verified reclamation.
    return closingSnapshot(closing);
  }
}
async function archiveCampaign(scenario,snapshot){
  try{return await lifecycle.archive(scenario,snapshot);}
  catch(error){
    if(!snapshot.campaign||snapshot.campaign.status==='playing')throw error;
    return {...snapshot,archiveComplete:false,pending:true,actions:[],error:null};
  }
}
async function loadSession(id){
  const archived=store.archive(id);
  if(archived?.complete){store.finishClosing(id);return {request:async()=>archivedSnapshot(archived)};}
  sign??=signer();
  const scenario=await createTestnetScenario(store.config(id),store,sign);
  const closing=store.closing(id);
  if(closing)return {request:async()=>closeCampaign(scenario,closing.snapshot,closing.reason)};
  if(archived)return {request:async()=>archiveCampaign(scenario,archived.snapshot)};
  const session=await createCampaignSession(scenario,id,id,undefined,null,store);
  const saved=await store.readJson(id),reason=config.lifecycle?lifecycle.cleanupReason(id,saved.campaign):null;
  if(reason){
    // Finish recovery of already-admitted gameplay before freezing its outcome.
    const snapshot=await session.request({action:'view'});
    await closeCampaign(scenario,snapshot,reason);
    return {request:async()=>{
      const done=store.archive(id);return done?.complete?archivedSnapshot(done):closeCampaign(scenario,snapshot,reason);
    }};
  }
  return {request:async request=>{
    const closing=store.closing(id);
    if(closing)return closeCampaign(scenario,closing.snapshot,closing.reason);
    if(request.action==='quit'){
      if(!config.lifecycle)throw new Error('Campaign closure unavailable');
      const snapshot=await session.request({action:'view'});
      if(snapshot.pending||snapshot.error)return snapshot;
      if(request.campaign_id!==snapshot.campaign?.id||request.revision!==snapshot.campaign?.revision)throw new Error('Campaign changed before quit');
      return closeCampaign(scenario,snapshot,'quit');
    }
    const snapshot=await session.request(request);
    if(!config.lifecycle)return snapshot;
    return snapshot.campaign?.status==='defeat'?closeCampaign(scenario,snapshot,'defeat'):archiveCampaign(scenario,snapshot);
  }};
}
const server=createGameServer({store,loadSession,creation:config.creation,cleanup:config.cleanup,ensureCapacity:lifecycle.ensureCapacity,requireCompletion:!!config.provisioning,origin:config.origin,dist:config.dist,secureCookies:config.secureCookies!==false});
let maintenance=null;
function maintain(){
  if(maintenance)return maintenance;
  maintenance=(async()=>{
    const recovery=await recoverSharedActors(store,config.provisioning?.actors??config.actors);
    if(recovery.blocked)console.warn('Shared transaction recovery deferred; original identities retained.');
    if(config.lifecycle)await lifecycle.sweep(loadSession);
  })().catch(()=>console.warn('Campaign cleanup deferred; durable recovery state retained.')).finally(()=>{maintenance=null;});
  return maintenance;
}
// Reconcile even when no player returns and no campaign is yet inactive.
void maintain();
const cleanupTimer=setInterval(()=>void maintain(),config.cleanup.intervalMs);
cleanupTimer?.unref();
let closing=false;
async function close(){
  if(closing)return;closing=true;
  if(cleanupTimer)clearInterval(cleanupTimer);
  // Finish in-flight work if possible. A forced platform stop leaves durable intents.
  await new Promise(r=>server.close(r));
  await maintenance;await Promise.all([...store.queues.values()]);store.close();release();
}
process.once('SIGINT',()=>void close());process.once('SIGTERM',()=>void close());
server.requestTimeout=15000;server.headersTimeout=10000;
server.listen(config.port,config.host,()=>console.log('Campaign service listening.'));
