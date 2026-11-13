import {readFile,mkdir,realpath} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {existsSync} from 'node:fs';

export function servicePolicy(config={}){
  function bounded(value,fallback,min,max){
    const n=value??fallback;
    if(!Number.isSafeInteger(n)||n<min||n>max)throw new Error('Invalid bounded service policy');
    return n;
  }
  return {
    creation:{perMinute:bounded(config.creation?.perMinute,4,1,120),perDay:bounded(config.creation?.perDay,24,1,10000),cooldownMs:bounded(config.creation?.cooldownMs,60000,1000,86400000)},
    cleanup:{inactivityMs:bounded(config.cleanup?.inactivityMs,86400000,3600000,2592000000),intervalMs:bounded(config.cleanup?.intervalMs,60000,10000,3600000)}
  };
}

export async function runtimeConfig(env=process.env){
  let config;
  try{config=env.NIGHT_CONFIG_JSON?JSON.parse(env.NIGHT_CONFIG_JSON):JSON.parse(await readFile(env.NIGHT_SERVER_CONFIG??'.local/testnet-server.json','utf8'));}
  catch{throw new Error('Invalid server configuration');}
  if(env.RENDER==='true'){
    if(env.NIGHT_DATA_DIR!=='/var/data/night'||!env.NIGHT_RUNTIME_KEYS)throw new Error('Render disk and restricted credentials required');
    // Fail closed if the disk was omitted instead of creating an ephemeral directory.
    const mounts=await readFile('/proc/self/mountinfo','utf8');
    if(!mounts.split('\n').some(line=>line.split(' ')[4]==='/var/data'))throw new Error('Persistent Render disk is not mounted');
    config.origin=env.NIGHT_ORIGIN??env.RENDER_EXTERNAL_URL;
    if(!config.origin?.startsWith('https://')||!config.provisioning||!config.lifecycle)throw new Error('HTTPS origin and lifecycle configuration required');
    config.secureCookies=true;
  }
  const database=env.NIGHT_DATA_DIR?join(resolve(env.NIGHT_DATA_DIR),'game.sqlite'):resolve(config.database??'.local/testnet-game/game.sqlite');
  await mkdir(dirname(database),{recursive:true,mode:0o700});
  if(env.RENDER==='true'&&await realpath(dirname(database))!=='/var/data/night')throw new Error('Persistent path must not be redirected');
  const port=Number(env.PORT??config.port??5190);
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid service port');
  return {...config,...servicePolicy(config),database,port,host:env.RENDER==='true'?'0.0.0.0':'127.0.0.1'};
}

// A separate SQLite lock database holds an OS-backed write lock for the whole
// process lifetime. Abrupt exits release it; a second writer cannot start.
export function acquireWriter(database){
  if(existsSync(database+'.writer'))throw new Error('Legacy writer lock requires operator review before upgrade');
  const lock=new DatabaseSync(database+'.writer.sqlite');
  try{lock.exec('PRAGMA busy_timeout=0; BEGIN EXCLUSIVE;');}
  catch{lock.close();throw new Error('Another application process owns this database');}
  return ()=>lock.close();
}
