import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {completedInvestigator,personalFinale,readFinaleMemory} from '../src/courtPayoff.ts';
import {buildEncounterScenes} from '../src/encounters.ts';
import {observeAgent,selectNpcAction,validateNpc} from '../src/agents.ts';
import {newCampaign} from '../src/game.ts';

async function recorded(route='switch'){
 const e=JSON.parse(await readFile(`docs/evidence/pass3b-${route}.json`,'utf8'));
 return {campaign:e.campaign,world:e.world,events:[],pending:false,error:null};
}

test('finding requires committed publication and a successful research journal; presentation is immutable',async()=>{
 for(const route of ['switch','withdrawn']){
  const r=await recorded(route),before=structuredClone(r),actor=completedInvestigator(r);
  assert.equal(actor,route==='switch'?'dorian':'mirelle');
  const scenes=buildEncounterScenes(r),finding=scenes.find(s=>s.id===`finding:${actor}`);
  assert.ok(finding);assert.match(finding.lines[0].text,/account is complete/);
  assert.match(finding.terms.join(' '),/cannot recall.*separate confirmed grant/);
  assert.ok(scenes.find(s=>s.id===`meaning:${actor}`).choices.every(c=>!c.action));
  assert.deepEqual(r,before);
  for(const execution of ['pending','failed',undefined]){
   const invalid=structuredClone(r);invalid.campaign.agentHistory.filter(e=>e.kind==='archive_research').forEach(e=>e.execution=execution);
   assert.equal(completedInvestigator(invalid),null);
   assert.ok(!buildEncounterScenes(invalid).some(s=>s.id.startsWith('finding:')));
  }
  r.campaign.politics.library.result='open';assert.equal(completedInvestigator(r),null);
 }
});

test('farewell distinguishes revoked descendants, independent protection, payment and uncompleted work',async()=>{
 const r=await recorded('withdrawn'),before=structuredClone(r),f=personalFinale(r);
 assert.equal(f.actor,'seraphine');assert.match(f.account.join(' '),/took back Mirelle.*Cassian.*no longer.*Marius.*remains effective/s);
 assert.match(f.account.join(' '),/paid sanctuary/);assert.notEqual(f.responses[0].reply,f.responses[1].reply);
 assert.deepEqual(r,before);
 r.campaign.politics.library.result='open';r.campaign.agentHistory=[];
 assert.match(personalFinale(r).account.join(' '),/No completed investigation/);
 assert.doesNotMatch(personalFinale(r).account.join(' '),/Mirelle completed/);
 r.world.leases.forEach(l=>l.status='offered');assert.notEqual(personalFinale(r).actor,'seraphine');
 assert.doesNotMatch(personalFinale(r).account.join(' '),/paid sanctuary/);
});

test('patron and failure finales follow recorded ending without predicting success or physical meetings',async()=>{
 for(const patron of ['marius','lucien']){
  const r=await recorded(patron==='marius'?'marius':'switch');r.campaign.ending='favoured';r.campaign.reason=`${patron==='marius'?'Marius':'Lucien'} protects you`;
  const f=personalFinale(r);assert.equal(f.actor,patron);
  r.campaign.ending='failure';r.campaign.resources.blood=0;
  const failed=personalFinale(r);assert.match(failed.title,/close/);assert.equal(failed.responses[0].id,'remember');
  for(const flag of ['pending','error']){r[flag]=flag==='pending'?true:'uncertain';assert.equal(personalFinale(r),null);r[flag]=flag==='pending'?false:null;}
 }
});

test('browser memory resumes a reply or results; malformed memory grants nothing',()=>{
 for(const response of ['own','help','remember','cost'])assert.deepEqual(readFinaleMemory(JSON.stringify({response,done:false})),{response,done:false});
 assert.deepEqual(readFinaleMemory('{broken'),{response:null,done:false});
 assert.deepEqual(readFinaleMemory('{"response":"grant_access","done":true}'),{response:null,done:true});
});

function petitionFixture(){
 const c=newCampaign('petition-context',{living:true});c.night=3;c.politics.accounts=Object.fromEntries(['player',...Object.keys(c.npcs)].map(a=>[a,a]));
 c.politics.library={chosen:'mirelle',authorizedNight:3,result:'open',challenged:false};
 const w={night:3,next_nonce:0,properties:[{id:'library',owner:'player'}],ancestry:[],leases:[],grants:[{id:10,property_id:'library',scope:'enter',grantor:'player',grantee:'mirelle',parent_grant_id:null,can_delegate:true,expiry_night:null,revoked:false}],grant_validity:[true],access:{library:false}};
 return {c,w};
}
test('Dorian chooses petition or restraint from public shelter, with unchanged authority and replay guards',()=>{
 const {c,w}=petitionFixture();
 const choose=()=>selectNpcAction(observeAgent('dorian','dorian',c,w)).kind;
 assert.equal(choose(),'pass');
 w.grants.push({id:11,property_id:'passage',scope:'enter',grantor:'lucien',grantee:'player',expiry_night:5,revoked:false});w.grant_validity.push(true);
 assert.equal(choose(),'pass','temporary passage is not a safe switching fallback');
 w.leases.push({property_id:'sanctuary',buyer:'player',status:'accepted',end_night:8});
 assert.equal(choose(),'archive_challenge');assert.equal(choose(),'archive_challenge');
 validateNpc('dorian',{kind:choose()},c,w,'dorian');
 w.leases[0].status='offered';assert.equal(choose(),'pass');
 w.grants[1].expiry_night=null;assert.equal(choose(),'archive_challenge');
 w.grant_validity[1]=false;assert.equal(choose(),'pass');
 w.grants[0].revoked=true;w.grant_validity[0]=false;assert.equal(choose(),'pass');
 c.agentHistory.push({actor:'dorian',night:3,kind:'pass'});
 assert.throws(()=>validateNpc('dorian',{kind:'archive_challenge'},c,w,'dorian'),/already scheduled/);
 assert.throws(()=>observeAgent('dorian','mirelle',c,w),/identity mismatch/);
});

test('rendered farewell, resumed reply, results and pending gate retain usable controls',async()=>{
 const dir=await mkdtemp(resolve('.local/payoff-render-'));
 const original=globalThis.localStorage;
 try{
  await build({configFile:false,logLevel:'silent',build:{ssr:resolve('src/CampaignFinale.tsx'),outDir:dir,rollupOptions:{external:['react','react/jsx-runtime']}}});
  const {CampaignFinale}=await import(pathToFileURL(join(dir,'CampaignFinale.js')).href);
  const r=await recorded(),props={result:r,busy:false,requireArchive:false,onReplay(){throw Error('unexpected replay');},onRefresh(){throw Error('unexpected refresh');}};
  const render=memory=>{globalThis.localStorage={getItem:()=>JSON.stringify(memory)};return renderToStaticMarkup(createElement(CampaignFinale,props));};
  assert.match(render({}),/What remains mine matters most/);assert.doesNotMatch(render({}),/Begin Another Campaign/);
  assert.match(render({response:'own',done:false}),/Read the recorded ending/);
  assert.match(render({response:'own',done:true}),/Begin Another Campaign/);
  r.pending=true;assert.match(render({done:true}),/Check confirmed outcome/);assert.doesNotMatch(render({}),/You paid for shelter/);
 }finally{globalThis.localStorage=original;await rm(dir,{recursive:true,force:true});}
});
