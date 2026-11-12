import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { resolve } from 'node:path';

let runnerBuild;
async function buildRunner(){
  // One bundled file avoids hundreds of slow WSL reads across the Windows mount.
  // Build only code: no save access, key generation or chain initialization.
  runnerBuild??=import('vite').then(({build})=>build({configFile:false,logLevel:'error',
    ssr:{noExternal:true},
    build:{ssr:'scripts/sandbox/play.mjs',outDir:'.local/sandbox-runner',
      rollupOptions:{output:{entryFileNames:'play.mjs',banner:'import {createRequire as runnerRequire} from "node:module"; const require=runnerRequire(import.meta.url); import {fileURLToPath as runnerPath} from "node:url"; import {dirname as runnerDir} from "node:path"; const __dirname=runnerDir(runnerPath(import.meta.url));'}}}
  }));
  return runnerBuild;
}

export function createBridge(mode='local', options={}) {
  const command=mode==='sandbox'?(process.platform==='win32'?'wsl':'bash'):resolve('target/debug/local-demo' + (process.platform === 'win32' ? '.exe' : ''));
  // WSL does not automatically inherit custom Windows environment variables.
  // Forward only non-secret runner settings as argv; provider credentials stay
  // in the runner's ignored .env, never command lines.
  const saveDir=options.saveDir??process.env.NIGHT_SAVE_DIR;
  const disableLlm=options.disableLlm||process.env.NIGHT_LLM_ENABLED==='0';
  const settings=[...(options.profile?['NIGHT_STARTUP_PROFILE=1']:[]),...(saveDir?[`NIGHT_SAVE_DIR=${saveDir}`]:[]),...(disableLlm?['NIGHT_LLM_ENABLED=0']:[]),...(options.legacy?['NIGHT_LEGACY_CAMPAIGN=1']:[])];
  const bundled=mode==='sandbox'&&process.platform==='win32';
  const args=mode==='sandbox'?(process.platform==='win32'?['-d','Ubuntu','--','env',...settings,'bash','scripts/run-sandbox.sh',...(bundled?['.local/sandbox-runner/play.mjs']:[])]:['scripts/run-sandbox.sh',...(bundled?['.local/sandbox-runner/play.mjs']:[])]):[];
  let failure;
  const queue=[];
  function fail(error) { failure = error; for (const pending of queue.splice(0)) pending.reject(error); }
  const started=performance.now();
  const ready=(async()=>{
    if(bundled)await buildRunner();
    const child = spawn(command,args,{stdio:['pipe','pipe','pipe'],windowsHide:true,env:{...process.env,...(options.profile?{NIGHT_STARTUP_PROFILE:'1'}:{}),...(options.legacy?{NIGHT_LEGACY_CAMPAIGN:'1'}:{}),...(options.disableLlm?{NIGHT_LLM_ENABLED:'0'}:{}),...(options.saveDir?{NIGHT_SAVE_DIR:options.saveDir}:{})}});
  
    child.on('error', () => fail(new Error('Contract runtime unavailable. Run npm run demo:build.')));
    child.on('exit', () => fail(new Error('Contract runtime stopped. Restart the dev server.')));
    child.stderr.on('data', () => {});
    createInterface({input:child.stdout}).on('line', line => {
      const pending = queue.shift();
      if (!pending) return;
      try { const result=JSON.parse(line);if(options.profile)result.bridgeElapsedMs=Math.round(performance.now()-started);pending.resolve(result); } catch { pending.reject(new Error('Invalid runtime response')); }
    });
    child.stdin.on('error',()=>fail(new Error('Contract runtime input closed. Restart the dev server.')));
    return child;
  })();
  ready.catch(error=>fail(error));
  return {
    async request(action) { const child=await ready;return new Promise((resolve,reject) => {
      if (failure) return reject(failure);
      queue.push({resolve,reject}); child.stdin.write(JSON.stringify(action)+'\n');
    }); },
    close() { return ready.then(child=>child.stdin.end(),()=>{}); }
  };
}
