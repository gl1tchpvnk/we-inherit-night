import { defineConfig, loadEnv } from 'vite';
import { createBridge } from './scripts/bridge.mjs';
import { inspectSave } from './scripts/save-status.mjs';
export default defineConfig(({mode}) => ({
  server: {host:'127.0.0.1', port:5187, strictPort:true},
  plugins: [{name:'local-contract-runtime', configureServer(server) {
    if (loadEnv(mode, process.cwd()).VITE_MODE === 'testnet') return;
    // One serialized local play runner owns the persistent Sandbox and save.
    const saveDir=process.env.NIGHT_SAVE_DIR??loadEnv(mode,process.cwd(),'').NIGHT_SAVE_DIR;
    let bridge;
    server.middlewares.use('/api/save', async (req,res) => {
      res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
      if(req.method!=='GET'||req.headers.host!=='127.0.0.1:5187'||(req.headers.origin&&req.headers.origin!=='http://127.0.0.1:5187')){res.statusCode=403;res.end('{}');return;}
      res.end(JSON.stringify(await inspectSave(saveDir)));
    });
    server.httpServer?.on('close', () => bridge?.close());
    server.middlewares.use('/api/demo', async (req,res) => {
      res.setHeader('Content-Type','application/json');
      res.setHeader('Cache-Control','no-store');
      if (req.method !== 'POST' || req.headers.host !== '127.0.0.1:5187' ||
          (req.headers.origin && req.headers.origin !== 'http://127.0.0.1:5187') ||
          req.headers['content-type'] !== 'application/json') {res.statusCode=403; res.end('{}'); return;}
      try {
        let body=''; for await (const chunk of req) {body+=chunk; if(body.length>1024) throw new Error('Request too large');}
        const request=JSON.parse(body);
        if (!['agreement_accept','agreement_reject','game','end_night','view','reset','grant','revoke','enter','accept','reject','continue','settle'].includes(request.action)) throw new Error('Unknown action');
        bridge??=createBridge(loadEnv(mode,process.cwd()).VITE_MODE ?? 'sandbox',{saveDir,profile:process.env.NIGHT_STARTUP_PROFILE==='1'});
        res.end(JSON.stringify(await bridge.request(request)));
      } catch(error) {res.statusCode=503; res.end(JSON.stringify({error:String(error)}));}
    });
  }}]
}));

