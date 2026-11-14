import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {newCampaign,availableActions} from '../src/game.ts';
import {buildEncounterScenes,resolveScene,readSceneMemory,markSceneRead,topicStatus,finishScene,nextScene} from '../src/encounters.ts';
import {libraryReasons} from '../src/library.ts';

function fixture(night=0){
 const c=newCampaign('flow-fixture',{living:true,dangerous:true});c.night=night;
 c.politics.accounts=Object.fromEntries(['player',...Object.keys(c.npcs)].map(a=>[a,a]));
 const w={night,next_nonce:0,properties:['library','court','sanctuary','passage'].map((id,i)=>({id,owner:['player','marius','seraphine','lucien'][i]})),grants:[],grant_validity:[],ancestry:[],leases:[{id:1,property_id:'sanctuary',owner:'seraphine',buyer:'player',status:'offered',price_yocto:'20000000000000000000000',duration_nights:7,offer_expiry_night:3,end_night:null}],access:{library:true,lounge:true,crypt:night<3,court:false,sanctuary:false,passage:false}};
 return {campaign:c,world:w,events:[],error:null,pending:false,availability:{end_night:[],accept:[],reject:[],rooms:{}}};
}
const all=r=>buildEncounterScenes({...r,actions:availableActions(r.campaign,r.world)});
const scene=(r,id)=>resolveScene(all(r),id);
const grant=(r,property,issuer,recipient,extra={})=>{const g={id:r.world.grants.length,property_id:property,scope:'enter',grantor:issuer,grantee:recipient,parent_grant_id:null,can_delegate:false,expiry_night:null,revoked:false,...extra};r.world.grants.push(g);r.world.grant_validity.push(!g.revoked);if(recipient==='player')r.world.access[property]=!g.revoked;return g;};
function research(r,actor='mirelle'){r.campaign.politics.library={chosen:actor,authorizedNight:3,result:'open',challenged:false};return grant(r,'library','player',actor,{can_delegate:true});}

test('read versions follow topic content across nights, entry routes, reload and unrelated changes',()=>{
 const r=fixture(),before=structuredClone(r);
 const question=scene(r,'personal:0:marius');let memory=markSceneRead(readSceneMemory(null),question);
 assert.equal(topicStatus(question,memory),'Explored');assert.deepEqual(r,before);
 r.campaign.night=r.world.night=1;r.campaign.resources.blood=5;
 const unchanged=scene(r,'personal:1:marius');memory=readSceneMemory(JSON.stringify(memory));
 assert.equal(topicStatus(unchanged,memory),'Explored');
 for(const parent of ['character:marius','decision:1','discovery:1'])assert.ok(scene(r,parent));
 const oldWork=scene(r,'ask:1:marius');memory=markSceneRead(memory,oldWork);
 r.campaign.politics.appointment='player';grant(r,'court','marius','player');r.campaign.politics.serviceFulfilled=true;
 assert.equal(topicStatus(scene(r,'ask:1:marius'),memory),'Updated');
 assert.equal(topicStatus(scene(r,'personal:1:marius'),memory),'Explored');
 assert.equal(topicStatus(unchanged,readSceneMemory(null)),'New','new campaign starts without read memory');
 assert.equal(topicStatus(unchanged,readSceneMemory(JSON.stringify({seen:['personal:0:marius'],active:null,line:0}))),'Explored','known static legacy answer is retained');
 assert.equal(topicStatus(scene(r,'ask:1:marius'),readSceneMemory(JSON.stringify({seen:['ask:0:marius'],active:null,line:0}))),'Review needed','legacy conditional answer is not guessed');
});

test('proposal inspection is free; authoritative eligibility retires stale and incompatible commitments',()=>{
 const r=fixture(3),before=structuredClone(r);
 for(const actor of ['mirelle','dorian']){
  const proposal=scene(r,`action:authorize_${actor}`);const memory=markSceneRead(readSceneMemory(null),proposal);
  assert.equal(topicStatus(proposal,memory),'Explored');assert.ok(proposal.choices.some(c=>c.action?.choice===`authorize_${actor}`));
 }
 assert.deepEqual(r,before);
 const root=research(r);
 assert.ok(libraryReasons(r.campaign,'authorize_dorian',r.world).length);
 assert.ok(!scene(r,'action:authorize_dorian').choices.some(c=>c.action));
 assert.match(scene(r,'action:authorize_dorian').terms.join(' '),/Withdraw/);
 assert.ok(scene(r,'character:dorian').choices.some(c=>c.inspect==='action:withdraw_library'));
 root.revoked=true;r.world.grant_validity[0]=false;
 assert.ok(scene(r,'action:authorize_dorian').choices.some(c=>c.action?.choice==='authorize_dorian'));
 r.campaign.politics.library.result='mirelle';
 assert.ok(!scene(r,'action:authorize_dorian').choices.some(c=>c.action));
 assert.match(scene(r,'action:authorize_dorian').terms.join(' '),/published/);
 r.pending=true;assert.ok(all(r).every(s=>s.choices.every(c=>!c.action)));
 r.pending=false;r.error='uncertain';assert.ok(all(r).every(s=>s.choices.every(c=>!c.action)));
});

test('Marius follows current service, protection and settled demand without retiring valid independent research',()=>{
 const r=fixture();assert.ok(scene(r,'character:marius').choices.some(c=>c.action?.choice==='petition_marius'));
 r.campaign.night=r.world.night=3;r.campaign.politics.appointment='player';const g=grant(r,'court','marius','player');
 assert.match(scene(r,'ask:3:marius').title,/outstanding/);
 assert.equal(scene(r,'character:marius').choices.find(c=>c.inspect==='personal:3:marius').reviewOnly,true);
 r.campaign.politics.serviceFulfilled=true;
 assert.match(scene(r,'ask:3:marius').lines[0].text,/fulfilled/);
 assert.ok(scene(r,'action:authorize_mirelle').choices.some(c=>c.action),'completed direct service does not prohibit research');
 r.campaign.night=r.world.night=6;
 for(const id of ['character:marius','decision:6','discovery:6','incident:6','action:final_refuse'])assert.equal(scene(r,id).id,'final-demand');
 assert.ok(scene(r,'final-demand').choices.some(c=>c.action?.choice==='final_refuse'));
 r.campaign.politics.finalCourt={response:'refuse',result:'rejected'};g.revoked=true;r.world.grant_validity[0]=false;r.world.access.court=false;
 assert.equal(all(r).some(s=>s.id==='final-demand'),false);
 assert.match(scene(r,'character:marius').lines[0].text,/withdrawn/);
 assert.ok(!scene(r,'action:final_accept').choices.some(c=>c.action));
});

test('shelter-aware alternatives and expired sanctuary never assert paid refuge from unrelated access',()=>{
 const r=fixture(1);grant(r,'court','marius','player');
 assert.match(scene(r,'character:seraphine').lines[0].text,/Marius has made room for you/);
 r.campaign.politics.titleFiled=true;assert.ok(scene(r,'action:sanctuary_pact').choices.some(c=>c.action));
 r.world.leases[0].status='accepted';r.world.leases[0].end_night=8;r.world.access.sanctuary=true;
 assert.match(scene(r,'ask:1:seraphine').title,/remains/);
 r.world.access.crypt=false;r.campaign.night=r.world.night=3;
 assert.match(scene(r,'character:seraphine').lines[0].text,/paid for a refuge/);
 r.world.access.sanctuary=false;r.world.access.court=false;r.world.leases[0].end_night=5;r.world.night=r.campaign.night=5;
 assert.match(scene(r,'character:seraphine').lines[0].text,/not an effective refuge/);
});

test('one canonical decision surface and final response per action, with no executable history',()=>{
 const r=fixture(6);grant(r,'court','marius','player');r.campaign.politics.library.result='mirelle';
 const scenes=all(r),demand=resolveScene(scenes,'decision:6');
 for(const kind of ['final_accept','final_refuse','final_counter'])assert.equal(scenes.flatMap(s=>s.choices).filter(c=>c.action?.choice===kind).length,1);
 assert.match(demand.choices.find(c=>c.id==='final_counter').summary.join(' '),/even if he refuses/);
 assert.ok(demand.choices.some(c=>c.action?.action==='end_night'));
 for(const s of scenes)if(s.redirect)assert.ok(resolveScene(scenes,s.id),'redirect is resolvable and acyclic');
 r.campaign.agentHistory.push({night:5,actor:'marius',kind:'pass',execution:'local'});
 const old=scene(r,'reckoning:5'),before=structuredClone(r);
 let memory=finishScene(readSceneMemory(null),old.id);memory=readSceneMemory(JSON.stringify(memory));
 assert.notEqual(nextScene(all(r),memory)?.id,old.id);assert.equal(old.choices.some(c=>c.action),false);assert.deepEqual(r,before);
 r.campaign.status='concluded';r.campaign.ending='favoured';r.campaign.night=r.world.night=7;
 assert.ok(all(r).every(s=>s.choices.every(c=>!c.action)));
});

test('rendered offers expose commitment immediately, deduplicate Feed and collapse only read information',async()=>{
 const dir=await mkdtemp(resolve('.local/flow-ssr-'));
 try{
  const output=await build({configFile:false,logLevel:'silent',build:{ssr:resolve('src/VampireEncounter.tsx'),write:false,rollupOptions:{external:['react','react/jsx-runtime']}}});
  const file=join(dir,'scene.mjs');await writeFile(file,output.output.find(o=>o.type==='chunk').code);
  const {VampireEncounter}=await import(pathToFileURL(file).href);
  const r=fixture(3),scenes=all(r),props={result:r,scenes,lineIndex:0,busy:false,feedback:'',onFeed(){},onLine(){},onChoice(){},onComplete(){},onSkipReckoning(){}};
  const render=(s,memory=readSceneMemory(null))=>renderToStaticMarkup(createElement(VampireEncounter,{...props,scene:s,memory}));
  for(const id of ['action:feed','decision:3','action:authorize_mirelle','character:marius']){
   const html=render(resolveScene(scenes,id));assert.equal((html.match(/<button[^>]*>(?:Feed|Review feeding)[^<]*/g)??[]).length,['action:feed','decision:3'].includes(id)?1:0,id);
   assert.doesNotMatch(html,/>Feed[^<]*<small>Explored/);
  }
  const strategic=render(resolveScene(scenes,'decision:3'));
  assert.match(strategic,/aria-label="Nightly actions"/);
  assert(strategic.indexOf('Review feeding')<strategic.indexOf('class="nightly-wait"'));
  assert.doesNotMatch(strategic,/Action \d|<div class="scene-topline"><span>Crimson Lounge/);
  const proposal=resolveScene(scenes,'action:authorize_mirelle'),html=render(proposal);
  assert.match(html,/Authorize Mirelle · tonight’s action/);assert.doesNotMatch(html,/>Continue</);
  assert.match(html,/Publication cannot be recalled/);
  const q=resolveScene(scenes,'personal:3:marius'),memory=markSceneRead(readSceneMemory(null),q),character=resolveScene(scenes,'character:marius');
  const viewed=render(character,memory);assert.match(viewed,/<summary>Review conversation<\/summary>/);
  assert.ok(viewed.indexOf('Review conversation')<viewed.indexOf('Why should I choose you over Seraphine?'));
  assert.doesNotMatch(viewed,/Return[^<]*<small>Explored/);
  for(const uncertain of [{...r,error:'unknown outcome'},{...r,pending:true}]){
   const html=renderToStaticMarkup(createElement(VampireEncounter,{...props,result:uncertain,scene:proposal,onRefresh(){},refreshBusy:false}));
   assert.match(html,/class="binding-choice" disabled=""/);
   assert.match(html,/<button type="button">Check confirmed outcome<\/button>/);
  }
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('Vesper opening information remains reachable in both orders without consuming state',()=>{
 const r=fixture(),before=structuredClone(r),scenes=all(r);let memory=readSceneMemory(null);
 function follow(id,target){const current=resolveScene(scenes,id),choice=current.choices.find(c=>c.inspect&&resolveScene(scenes,c.inspect)?.id===target);assert.ok(choice,`${id} must reach ${target}`);assert.equal(choice.action,undefined);memory={...finishScene(markSceneRead(memory,current),current.id),active:choice.inspect,line:0};return nextScene(scenes,memory).id;}
 assert.equal(follow('ultimatum','character:vesper'),'character:vesper');
 for(const question of ['ask:0:vesper','personal:0:vesper']){follow('character:vesper',question);follow(question,'character:vesper');}
 follow('character:vesper','decision:0');
 follow('ultimatum','decision:0');follow('decision:0','character:vesper');
 for(const question of ['personal:0:vesper','ask:0:vesper']){follow('character:vesper',question);follow(question,'character:vesper');assert.equal(topicStatus(resolveScene(scenes,question),readSceneMemory(JSON.stringify(memory))),'Explored');}
 follow('character:vesper','decision:0');
 assert.deepEqual(r,before,'all navigation is browser memory only');
 assert.ok(resolveScene(scenes,'decision:0').choices.some(c=>c.inspect==='character:marius'));
 assert.ok(resolveScene(scenes,'decision:0').choices.some(c=>c.inspect==='character:seraphine'));
});

test('Seraphine questions follow the contract offer deadline and accepted lease, not just offered status',()=>{
 const r=fixture(1);r.campaign.politics.titleFiled=true;
 const text=id=>{const s=scene(r,id);return [s.title,...s.lines.map(l=>l.text),...s.terms].join(' ');};
 assert.match(text('ask:1:seraphine'),/until after the final reckoning/);
 r.world.night=3; // intentionally differs from campaign night: deadline is contract authority
 assert.equal(r.world.leases[0].status,'offered');
 assert.match(text('character:seraphine'),/offer is closed/);assert.match(text('ask:1:seraphine'),/cannot reopen/);
 assert.doesNotMatch(text('ask:1:seraphine'),/Bring your Library|before Night Four/);
 r.world.leases[0].status='accepted';r.world.leases[0].end_night=8;r.world.access.sanctuary=true;
 assert.match(text('character:seraphine'),/paid for a refuge/);assert.match(text('ask:1:seraphine'),/owe no new acceptance/);
 r.world.night=8;r.world.access.court=true; // other protection cannot conceal this lease's expiry
 assert.match(text('character:seraphine'),/not an effective refuge/);assert.match(text('ask:1:seraphine'),/has expired/);
 assert.doesNotMatch(text('ask:1:seraphine'),/Bring your Library/);
});

test('navigation history and castle exit are presentation only and survive reload',async()=>{
 const {visitScene,leaveEncounters}=await import('../src/encounters.ts');const r=fixture(),before=structuredClone(r),scenes=all(r);
 let m=visitScene(readSceneMemory(null),'decision:0','character:vesper');m=visitScene(m,'character:vesper','ask:0:vesper');
 m=readSceneMemory(JSON.stringify(m));assert.deepEqual(m.trail,['decision:0','character:vesper']);
 m=visitScene(m,'ask:0:vesper','character:vesper');assert.deepEqual(m.trail,['decision:0']);
 m=leaveEncounters(m,scenes,'character:vesper');assert.equal(nextScene(scenes,m),undefined);assert.deepEqual(m.trail,[]);assert.deepEqual(r,before);
});
