import {servicePolicy} from './config.mjs';
import {createServer} from 'node:http';
import {realpath} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import {resolve,sep,extname} from 'node:path';

const ACTIONS=new Set(['view','reset','game','enter','end_night','accept','reject','agreement_accept','agreement_reject']);
const FIELDS=new Set(['action','choice','property_id','campaign_id','revision','agreement_id']);
const COOKIE='night_session';
function tokenOf(req){return req.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)??null;}

const pick=(value,fields)=>Object.fromEntries(fields.filter(k=>Object.hasOwn(value,k)).map(k=>[k,value[k]]));
export function publicSnapshot(snapshot){
  const result=pick(snapshot,['world','proof','events','walletYocto','escrowYocto','actions','authority','availability','archiveCommitment','closure']);
  result.pending=!!snapshot.pending;
  result.error=snapshot.error?'The request could not be completed. Refresh to check the confirmed campaign state.':null;
  if(snapshot.campaign){
    const c=snapshot.campaign;
    result.campaign=pick(c,['version','id','revision','night','actionsLeft','actionLimit','politics','ending','resources','seats','status','reason','discoveries','agreements','events']);
    result.campaign.npcs=Object.fromEntries(Object.entries(c.npcs??{}).map(([role,npc])=>[role,{relationships:{player:npc.relationships?.player??0}}]));
    result.campaign.agentHistory=(c.agentHistory??[]).filter(e=>['confirmed','local'].includes(e.execution)).map(e=>pick(e,['night','actor','kind','source','execution','outcome']));
  }
  result.transactions=(snapshot.transactions??[]).filter(t=>t.executionStatus==='FINAL').map(t=>pick(t,['action','actor','property','hash','success','executionStatus','gasBurnt']));
  return result;
}

export function createGameServer({store,loadSession,origin='http://localhost:5190',dist='dist',secureCookies=true,ensureCapacity=async()=>{},requireCompletion=false,creation,cleanup}){
  const base=new URL(origin);
  if(base.protocol!=='https:'&&!['localhost','127.0.0.1','[::1]'].includes(base.hostname))throw new Error('HTTPS required outside loopback');
  if(!secureCookies&&!['localhost','127.0.0.1','[::1]'].includes(base.hostname))throw new Error('Insecure cookies are loopback-only');
  const policy=servicePolicy({creation,cleanup}),limits=policy.creation;
  // Rehydrate under the campaign queue; do not retain every visitor in memory.
  const load=loadSession;
  let inFlight=0;
  const serial=(id,work)=>store.serial(id,work);
  const cookie=token=>`${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000${secureCookies?'; Secure':''}`;
  function json(res,status,value){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));}
  async function api(req,res,path){
    if(req.headers.host!==base.host||(req.headers.origin&&req.headers.origin!==base.origin)||req.headers['sec-fetch-site']==='cross-site')return json(res,403,{error:'Request origin is not allowed.'});
    const token=tokenOf(req),owned=store.lookup(token);
    if(!store.takeLimit('requests',120,60000)||owned&&!store.takeLimit('campaign:'+owned.id,30,60000))return json(res,429,{error:'Please wait before making another request.'});
    if(path==='/api/history'&&req.method==='GET')return owned?json(res,200,store.history(token).map(a=>({...a,snapshot:publicSnapshot(a.snapshot)}))):json(res,401,{error:'Session required.'});
    if(path==='/api/save'&&req.method==='GET'){
      if(!owned)return json(res,200,{exists:false,valid:false,inactivityMs:policy.cleanup.inactivityMs,...(token?{error:'This session has expired. Clear its cookie to start a new campaign.'}:{})});
      const saved=await store.readJson(owned.id);
      return json(res,200,{exists:true,valid:true,inactivityMs:policy.cleanup.inactivityMs,id:owned.id,night:saved?.campaign?.night??0});
    }
    if(path!=='/api/game'||req.method!=='POST')return json(res,404,{error:'Not found.'});
    if(req.headers.origin!==base.origin||req.headers['content-type']!=='application/json')return json(res,403,{error:'Same-origin JSON request required.'});
    let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>2048)return json(res,413,{error:'Request too large.'});}
    let request;try{request=JSON.parse(body);}catch{return json(res,400,{error:'Invalid request.'});}
    if(!request||Array.isArray(request)||!ACTIONS.has(request.action)||Object.keys(request).some(k=>!FIELDS.has(k)))return json(res,400,{error:'Invalid gameplay command.'});
    if(['choice','property_id','campaign_id','agreement_id'].some(k=>request[k]!==undefined&&(typeof request[k]!=='string'||request[k].length>128))||request.revision!==undefined&&(!Number.isSafeInteger(request.revision)||request.revision<0))return json(res,400,{error:'Invalid gameplay command.'});
    if(request.campaign_id!==undefined&&request.campaign_id!==owned?.id)return json(res,403,{error:'Campaign is not owned by this session.'});
    if(!owned){
      if(token||request.action!=='view')return json(res,401,{error:'A valid campaign session is required.'});
      // Allocate only after explicit entry, never during title inspection.
      let allocation;try{if(!store.takeLimit('creation',limits.perMinute,60000)||!store.takeLimit('creation-day',limits.perDay,86400000))return json(res,429,{error:'Campaign creation limit reached. Please return later.'});await ensureCapacity();allocation=store.allocate();}catch{return json(res,409,{error:'No unused campaigns are available. Please return later.'});}
      res.setHeader('Set-Cookie',cookie(allocation.token));
      return serial(allocation.id,async()=>json(res,200,publicSnapshot(await (await load(allocation.id)).request({action:'view'}))));
    }
    return serial(owned.id,async()=>{
      if(store.lookup(token)?.id!==owned.id)return json(res,401,{error:'Session changed. Reload before continuing.'});
      const session=await load(owned.id);
      store.touch(owned.id);
      if(request.action==='reset'){
        const current=await session.request({action:'view'});
        if(requireCompletion&&current.campaign?.status==='playing'&&!current.closure?.complete)return json(res,409,{error:'Finish this campaign before starting another.'});
        if(current.error||current.pending||request.campaign_id!==owned.id||request.revision!==current.campaign?.revision)return json(res,409,{error:'Campaign changed or recovery is pending. Refresh before replacing it.'});
        let allocation;try{if(!store.takeLimit('creation',limits.perMinute,60000)||!store.takeLimit('creation-day',limits.perDay,86400000))return json(res,429,{error:'Campaign creation limit reached. Please return later.'});await ensureCapacity();allocation=store.allocate(token);}catch{return json(res,409,{error:'No unused campaigns are available. Your current campaign is preserved.'});}
        res.setHeader('Set-Cookie',cookie(allocation.token));
        return json(res,200,publicSnapshot(await (await load(allocation.id)).request({action:'view'})));
      }
      if(request.action!=='view'&&(request.campaign_id!==owned.id||!Number.isSafeInteger(request.revision)))return json(res,400,{error:'Current campaign revision required.'});
      return json(res,200,publicSnapshot(await session.request(request)));
    });
  }
  return createServer(async(req,res)=>{
    if(req.url==='/healthz'&&req.method==='GET'){try{store.db.prepare('SELECT 1').get();return json(res,200,{ok:true});}catch{return json(res,503,{ok:false});}}
    if(inFlight>=8)return json(res,503,{error:'Service busy. Please retry shortly.'});
    inFlight++;
    try{
      const path=new URL(req.url,'http://localhost').pathname;
      if(path.startsWith('/api/'))return await api(req,res,path);
      if(req.method!=='GET'||req.headers.host!==base.host){res.writeHead(404);return res.end();}
      const root=await realpath(resolve(dist));
      const file=await realpath(resolve(root,'.'+decodeURIComponent(path==='/'?'/index.html':path)));
      if(!file.startsWith(root+sep)){res.writeHead(404);return res.end();}
      const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon'};
      const type=types[extname(file)];if(!type){res.writeHead(404);return res.end();}
      res.writeHead(200,{'Content-Type':type,'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'});await pipeline(createReadStream(file),res);
    }catch{if(!res.headersSent)json(res,503,{error:'Campaign service unavailable or recovery pending. No replacement transaction will be signed.'});else res.end();}finally{inFlight--;}
  });
}
