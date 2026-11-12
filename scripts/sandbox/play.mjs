import {timed,startupTrace,moduleStarted,markDuration} from './startup-trace.mjs';
import {createInterface} from 'node:readline';
import {randomUUID} from 'node:crypto';
import {resolve,join} from 'node:path';
import {mkdir,open,rm,realpath} from 'node:fs/promises';
import {startPersistentSandbox,readJson,saveJson} from './persistence.mjs';
import {createScenario} from './scenario.mjs';
import {existsSync} from 'node:fs';
if(existsSync('.env'))process.loadEnvFile('.env');
import {createCampaignSession} from './campaign.mjs';
markDuration('runtime:imports',moduleStarted);
console.log=(...args)=>console.error(...args);
const base=resolve(process.env.NIGHT_SAVE_DIR??'.local/night-play');
await mkdir(base,{recursive:true});
// One writer owns the persistent chain. Never steal a possibly live writer lock.
const lockStart=performance.now();
let lock;
for(let attempt=0;attempt<120&&!lock;attempt++){
  try{lock=await open(join(base,'play.lock'),'wx');}
  catch(error){if(error.code!=='EEXIST')throw error;await new Promise(r=>setTimeout(r,250));}
}
if(!lock)throw new Error('Another play process owns the save lock. Stop it before restarting; never remove a live lock.');
markDuration('save:lock',lockStart);
let worker,closing=false;
async function close(){if(!closing){closing=true;await worker?.tearDown();await lock.close();await rm(join(base,'play.lock'),{force:true});}}
process.on('SIGTERM',()=>void close().then(()=>process.exit(0)));
process.on('SIGINT',()=>void close().then(()=>process.exit(0)));
async function load(id){
  if(!/^[0-9a-f-]{36}$/.test(id))throw new Error('Invalid saved session identifier');
  const directory=join(base,id),runtime=await timed('sandbox:start',()=>startPersistentSandbox(directory));
  try{
    const existing=await readJson(join(directory,'ready.json'));
    const political=existing?existing.political===true:process.env.NIGHT_LEGACY_CAMPAIGN!=='1';
    const living=political&&(existing?existing.living===true:true);
    const dangerous=living&&(existing?existing.dangerous===true:true);
    const scenario=await timed('scenario:initialize',async()=>createScenario(runtime.worker,{resume:!!existing,political,living,dangerous,restrictKeys:true,upgradeView:true,
      transactions:await readJson(join(directory,'transactions.json'))??[],saveTransactions:t=>saveJson(join(directory,'transactions.json'),t)}));
    if(!existing)await saveJson(join(directory,'ready.json'),{id,political,living,dangerous});
    // Pass 2C MVP never invokes a paid provider, even if old environment flags exist.
    const session=await timed('campaign:initialize',()=>createCampaignSession(scenario,join(directory,'campaign.json'),id));
    return {...runtime,session,id};
  }catch(e){await runtime.worker.tearDown();throw e;}
}
try{
  const previous=await readJson(join(base,'current.json'));
  let active=await load(previous?.id??randomUUID());worker=active.worker;
  await saveJson(join(base,'current.json'),{id:active.id});
  for await(const line of createInterface({input:process.stdin})){
    try{
      const request=JSON.parse(line);
      if(request.action==='reset'){
        const current=await active.session.request({action:'view'});
        if(request.campaign_id!==active.id||request.revision!==current.campaign.revision)throw new Error('Stale reset request; refresh first.');
        const fresh=await load(randomUUID());
        await saveJson(join(base,'current.json'),{id:fresh.id});
        const old=active;active=fresh;worker=fresh.worker;await timed('reset:stop-old',()=>old.worker.tearDown());
        const oldPath=await realpath(old.home),rootPath=await realpath(base);
        if(oldPath!==join(rootPath,old.id))throw new Error('Refusing to clean an unexpected Sandbox path');
        await timed('reset:remove-old',()=>rm(oldPath,{recursive:true}));
      }
      const result=await timed(`request:${request.action}`,()=>active.session.request(request.action==='reset'?{action:'view'}:request));
      if(process.env.NIGHT_STARTUP_PROFILE==='1'){result.startupTimings=startupTrace.splice(0);await saveJson(join(base,'startup-profile.json'),result.startupTimings);}
      process.stdout.write(JSON.stringify(result)+'\n');
    }catch{process.stdout.write(JSON.stringify({error:'Local campaign request failed; refresh to recover.'})+'\n');}
  }
}finally{await close();}

