import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,availableActions} from '../src/game.ts';
import {buildEncounterScenes,resolveScene,markSceneRead,readSceneMemory,topicStatus} from '../src/encounters.ts';
import {investigationState} from '../src/livingCourt.ts';
import {personalFinale} from '../src/courtPayoff.ts';

function fixture(night=3){
 const c=newCampaign('continuity',{living:true,dangerous:true});c.night=night;
 c.politics.accounts=Object.fromEntries(['player',...Object.keys(c.npcs)].map(a=>[a,a]));
 const w={night,next_nonce:0,properties:['library','court','sanctuary','passage'].map((id,i)=>({id,owner:['player','marius','seraphine','lucien'][i]})),grants:[],grant_validity:[],ancestry:[],leases:[],access:{library:true,crypt:false,lounge:true,court:false,sanctuary:false,passage:false}};
 return {campaign:c,world:w,events:[],error:null,pending:false,availability:{end_night:[],accept:[],reject:[],rooms:{}}};
}
const scenes=r=>buildEncounterScenes({...r,actions:availableActions(r.campaign,r.world)});
const scene=(r,id)=>resolveScene(scenes(r),id);
const text=s=>s.lines.map(l=>l.text).join(' ');
function grant(r,actor='mirelle'){
 const g={id:r.world.grants.length,property_id:'library',scope:'enter',grantor:'player',grantee:actor,parent_grant_id:null,can_delegate:true,expiry_night:null,revoked:false};r.world.grants.push(g);r.world.grant_validity.push(true);r.campaign.politics.library.chosen=actor;r.campaign.politics.library.authorizedNight=3;return g;
}
function publish(r,actor='mirelle'){
 r.campaign.politics.library.result=actor;r.campaign.politics.serviceFulfilled=actor==='mirelle';r.campaign.agentHistory.push({night:4,actor,kind:'archive_research',execution:'confirmed',reason:'confirmed fixture'});
}

test('all current investigator questions follow authorization, revocation, restart and publication',()=>{
 for(const actor of ['mirelle','dorian']){
  const r=fixture();assert.equal(investigationState(r,actor),'not-started');assert.match(text(scene(r,`ask:3:${actor}`)),/No investigation has begun/);
  const g=grant(r,actor);assert.equal(investigationState(r,actor),'active');assert.match(text(scene(r,`ask:3:${actor}`)),/invitation|assistant/);
  g.revoked=true;r.world.grant_validity[0]=false;assert.equal(investigationState(r,actor),'interrupted');
  for(const id of [`character:${actor}`,`ask:3:${actor}`,`personal:3:${actor}`,`purpose:${actor}`])assert.doesNotMatch(text(scene(r,id)),/If I finish first|Because I intend to finish|Let us finish|Give us until/);
  assert.match(text(scene(r,`ask:3:${actor}`)),/investigation has stopped/);
  assert(scene(r,`action:authorize_${actor}`).choices.some(c=>c.action),'legitimate reauthorization stays available');
  grant(r,actor);assert.equal(investigationState(r,actor),'active');publish(r,actor);assert.equal(investigationState(r,actor),'completed');
  assert.match(text(scene(r,`ask:3:${actor}`)),/account is complete/);assert(!scene(r,`action:authorize_${actor}`).choices.some(c=>c.action));
 }
});

test('ineffective authority, deadline, rival publication and ended campaigns do not promise future work',()=>{
 const r=fixture();grant(r);r.world.grant_validity[0]=false;assert.equal(investigationState(r,'mirelle'),'interrupted');assert.match(text(scene(r,'character:cassian')),/cannot continue/);
 r.campaign.night=r.world.night=6;assert(!scene(r,'action:authorize_mirelle').choices.some(c=>c.action));assert.match(scene(r,'action:authorize_mirelle').terms.join(' '),/no time/);
 publish(r,'dorian');assert.equal(investigationState(r,'mirelle'),'unavailable');assert.match(text(scene(r,'ask:6:mirelle')),/no competing investigation/);
 r.campaign.status='defeat';assert.doesNotMatch(text(scene(r,'personal:6:mirelle')),/intend to finish|Let me in/);
 const missing=fixture();missing.campaign.politics.library.result='mirelle';assert.equal(investigationState(missing,'mirelle'),'unavailable');assert.doesNotMatch(text(scene(missing,'ask:3:mirelle')),/account is complete/);
});

test('identical finding routes share persisted read identity; distinct interpretations remain separate',()=>{
 const r=fixture(5);grant(r);publish(r);const all=scenes(r),finding=resolveScene(all,'finding:mirelle'),reaction=all.find(s=>s.id==='reaction:npc:4:mirelle:archive_research');assert(reaction);
 assert.equal(reaction.topicId,finding.topicId);assert.equal(reaction.readVersion,finding.readVersion);
 for(const first of [finding,reaction]){const memory=readSceneMemory(JSON.stringify(markSceneRead(readSceneMemory(null),first)));assert.equal(topicStatus(finding,memory),'Explored');assert.equal(topicStatus(reaction,memory),'Explored');assert.equal(topicStatus(resolveScene(all,'meaning:mirelle'),memory),'New');}
 assert.equal(topicStatus(finding,readSceneMemory(JSON.stringify({seen:[reaction.id],active:null,line:0}))),'Explored');
 const q=fixture(),personal=scene(q,'personal:3:mirelle');let memory=markSceneRead(readSceneMemory(null),personal);q.campaign.night=q.world.night=4;assert.equal(topicStatus(scene(q,'personal:4:mirelle'),memory),'Explored');const root=grant(q);root.revoked=true;q.world.grant_validity[0]=false;assert.equal(topicStatus(scene(q,'personal:4:mirelle'),memory),'Updated');memory=readSceneMemory(JSON.stringify(markSceneRead(memory,scene(q,'personal:4:mirelle'))));assert.equal(topicStatus(scene(q,'personal:4:mirelle'),memory),'Explored');
});

test('contextual offers preserve exact authoritative eligibility and free projection',()=>{
 const r=fixture();r.campaign.politics.serviceFulfilled=true;const before=structuredClone(r);assert.match(scene(r,'action:authorize_mirelle').terms.join(' '),/already fulfilled/);assert.deepEqual(r,before);
 for(const night of [3,5,6]){r.campaign.night=r.world.night=night;const actions=availableActions(r.campaign,r.world);for(const actor of ['mirelle','dorian'])assert.equal(!!scene(r,`action:authorize_${actor}`).choices.find(ch=>ch.action),actions.find(a=>a.kind===`authorize_${actor}`).allowed);}
 for(const flags of [{pending:true},{error:'uncertain'}])assert(scenes({...r,...flags}).every(s=>s.choices.every(ch=>!ch.action)));
});

test('closing characters distinguish paid independence, revocable patrons and failure without changing outcomes',()=>{
 for(const route of ['marius','lucien','sanctuary','failure','unfinished']){
  const r=fixture(7),c=r.campaign;c.status=route==='failure'||route==='unfinished'?'defeat':'survived';c.ending=c.status==='defeat'?'failure':route==='sanctuary'?'unbound':'favoured';c.reason=route==='lucien'?'Lucien protection':'Recorded outcome';
  if(['marius','lucien'].includes(route)){r.world.grants.push({id:0,property_id:route==='marius'?'court':'passage',grantor:route,grantee:'player',scope:'enter',can_delegate:false,parent_grant_id:null,expiry_night:null,revoked:false});r.world.grant_validity.push(true);r.world.access[route==='marius'?'court':'passage']=true;}
  if(route==='sanctuary'){r.world.leases.push({id:1,property_id:'sanctuary',owner:'seraphine',buyer:'player',status:'accepted',end_night:8});r.world.access.sanctuary=true;}
  if(route==='failure')publish(r);
  const before=structuredClone(r),f=personalFinale(r);assert(f);assert.deepEqual(r,before);assert.notEqual(f.responses[0].reply,f.responses[1].reply);
  if(route==='marius'){assert.equal(f.actor,'marius');assert.match(f.opening,/surviving|still here/);assert.match(f.opening,/mine to withdraw/);}
  if(route==='lucien'){assert.equal(f.actor,'lucien');assert.match(f.opening,/can withdraw/);}
  if(route==='sanctuary'){assert.equal(f.actor,'seraphine');assert.match(f.opening,/term, not forever/);r.world.night=8;r.world.access.sanctuary=false;assert.doesNotMatch(personalFinale(r).opening,/time left|tonight.*stay/);}
  if(route==='failure')assert.match(f.opening,/did not survive/);
  if(route==='unfinished'){assert.equal(f.actor,'vesper');assert.match(f.account.join(' '),/No completed investigation/);}
  assert.equal(personalFinale({...r,pending:true}),null);assert.equal(personalFinale({...r,error:'unconfirmed'}),null);
 }
});
