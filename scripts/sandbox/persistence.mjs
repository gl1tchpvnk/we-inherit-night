import {timed} from './startup-trace.mjs';
import {spawn,execFileSync} from 'node:child_process';
import {createServer} from 'node:net';
import {mkdir,readFile,writeFile,rename,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import nearApi from 'near-api-js';
import {Worker,KeyPair} from 'near-workspaces';
const {keyStores}=nearApi; // Existing Workspaces dependency.
export async function saveJson(path,value){await writeFile(path+'.tmp',JSON.stringify(value,null,2)+'\n',{mode:0o600});await rename(path+'.tmp',path);}
export async function readJson(path){try{return JSON.parse(await readFile(path,'utf8'));}catch(e){if(e.code==='ENOENT')return null;throw e;}}
async function freePort(){const s=createServer();await new Promise(r=>s.listen(0,'127.0.0.1',r));const port=s.address().port;await new Promise(r=>s.close(r));return port;}
// Workspaces' SandboxWorker.init deletes existing homes. Use its custom-RPC
// client with the SAME pinned local binary so the chain itself survives restart.
export async function startPersistentSandbox(directory){
  if(process.platform!=='linux')throw new Error('Persistent Sandbox requires Linux/WSL2');
  const home=resolve(directory);await mkdir(home,{recursive:true,mode:0o700});
  const binary=resolve('scripts/sandbox/near-sandbox');
  if(!(await timed('sandbox:binary-version',()=>execFileSync(binary,['--version'],{encoding:'utf8'}))).includes('release 2.14.0'))throw new Error('Sandbox 2.14.0 required');
  try{await access(join(home,'config.json'));}catch(e){if(e.code!=='ENOENT')throw e;await timed('sandbox:genesis',()=>execFileSync(binary,['--home',home,'init'],{stdio:'ignore'}));
    // Disposable single-validator local chains only. Finality is still awaited;
    // campaign expiry is governed by explicit contract nights, not block time.
    const config=await readJson(join(home,'config.json'));
    config.gc_blocks_limit=40; // Runtime-required collection capacity for 25 ms blocks.
    config.consensus.min_block_production_delay={secs:0,nanos:25000000};
    config.consensus.max_block_production_delay={secs:0,nanos:50000000};
    config.consensus.max_block_wait_delay={secs:0,nanos:150000000};
    await saveJson(join(home,'config.json'),config);
  }
  const port=await freePort(),networkPort=await freePort();
  const child=spawn(binary,['--home',home,'run','--rpc-addr',`127.0.0.1:${port}`,'--network-addr',`127.0.0.1:${networkPort}`],{stdio:'ignore'});
  let exited=false;child.on('exit',()=>{exited=true;});child.on('error',()=>{exited=true;});
  const worker=await timed('sandbox:client',()=>Worker.init({network:'custom',rpcAddr:`http://127.0.0.1:${port}`,rootAccountId:'test.near',keyStore:new keyStores.UnencryptedFileSystemKeyStore(join(home,'keys'))}));
  const close=async()=>{if(exited)return;await new Promise(resolve=>{child.once('exit',resolve);child.kill('SIGINT');});};
  worker.tearDown=close;
  try{
    let ready=false;
    for(let i=0;i<120&&!exited;i++){try{const status=await worker.provider.status();if(status.version.version!=='2.14.0')throw new Error('Wrong local runtime');ready=true;break;}catch{await new Promise(r=>setTimeout(r,250));}}
    if(!ready)throw new Error('Persistent Sandbox did not start; another process may own its database.');
    const validator=await readJson(join(home,'validator_key.json'));
    await worker.rootAccount.setKey(KeyPair.fromString(validator.secret_key));
    return {worker,home};
  }catch(e){await close();throw e;}
}

