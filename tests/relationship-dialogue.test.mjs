import {personalFinale} from '../src/courtPayoff.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,availableActions} from '../src/game.ts';
import {buildEncounterScenes,resolveScene,readSceneMemory,markSceneRead,topicStatus} from '../src/encounters.ts';
import {relationshipState,chooseRelationship,leaveRelationship,relationshipFinale,RELATIONSHIP_TEXT as T,RELATIONSHIP_REPLIES as R} from '../src/relationshipDialogue.ts';
function fixture(order=null,origin='appointment'){
 const c=newCampaign('relationship-fixture',{living:true,dangerous:true});c.night=order?4:0;
 c.politics.accounts=Object.fromEntries(['player',...Object.keys(c.npcs)].map(a=>[a,a]));
 const w={night:c.night,next_nonce:0,properties:['library','court','sanctuary','passage'].map((id,i)=>({id,owner:['player','marius','seraphine','lucien'][i]})),grants:[],grant_validity:[],ancestry:[],leases:[{id:1,property_id:'sanctuary',owner:'seraphine',buyer:'player',status:'offered',price_yocto:'20000000000000000000000',duration_nights:7,offer_expiry_night:3,end_night:null}],access:{library:true,lounge:true,crypt:!order,court:!!order,sanctuary:!!order,passage:false}};
 if(order){
  w.leases[0].status='accepted';w.leases[0].end_night=order==='marius'?9:8;
  w.grants.push({id:0,property_id:'court',scope:'enter',grantor:'marius',grantee:'player',parent_grant_id:null,can_delegate:false,expiry_night:null,revoked:false});w.grant_validity.push(true);
  c.politics.appointment=origin==='appointment'?'player':'cassian';
  if(origin==='research'){c.politics.library.result='mirelle';c.politics.serviceFulfilled=true;c.agentHistory.push({actor:'mirelle',kind:'archive_research',night:3,execution:'confirmed'});}
  c.agentHistory.push({actor:'marius',kind:origin==='appointment'?'appoint':'archive_protect',night:order==='marius'?0:3,execution:'confirmed'});
 }
 const r={campaign:c,world:w,error:null,pending:false,events:[],transactions:[],availability:{end_night:[],accept:[],reject:[],rooms:{}}};r.actions=availableActions(c,w);return r;
}
const scenes=(r,m={})=>buildEncounterScenes(r,m.relationships);
const get=(r,id,m={})=>resolveScene(scenes(r,m),id);
function select(r,m,key,id){const s=get(r,`personal:relationship:${key}`,m);return chooseRelationship(m,s,s.choices.find(c=>c.reply===id),r);}

test('exact offer/questions share existing commitment surface; free topics never contain actions',()=>{
 const r=fixture(),before=structuredClone(r),ss=scenes(r);
 assert.equal(get(r,'character:marius').lines[0].text,T.M_OFFER);
 assert.equal(get(r,'action:petition_marius').lines[0].text,T.M_OFFER);
 assert.deepEqual(get(r,'character:marius').choices.filter(c=>c.action).map(c=>c.action),[{action:'game',choice:'petition_marius'}]);
 assert.match(get(r,'action:petition_marius').terms.join(' '),/1 Blood/);
 assert.equal(get(r,'character:seraphine').lines[0].text,T.S_OPEN+'\n\n'+T.S_OFFER);
 for(const s of ss.filter(s=>s.id.startsWith('ask:relationship:')))assert(s.choices.every(c=>!c.action&&!c.reply));
 assert.equal(get(r,'ask:relationship:M-Q1').lines[0].text,T.M_Q1);
 assert.equal(get(r,'ask:relationship:S-Q2').lines[0].text,T.S_Q2);
 assert.deepEqual(r,before);
 r.world.night=3;assert(!get(r,'character:marius').choices.some(c=>c.id==='M-Q2'));
});

test('both acquisition orders and origins require confirmed evidence and current independent protection',()=>{
 for(const first of ['marius','seraphine'])for(const origin of ['appointment','research']){
  const r=fixture(first,origin),before=structuredClone(r),key=first==='marius'?'M-D':'S-D',actor=first;
  assert.equal(relationshipState(r).order,first);const s=get(r,`character:${actor}`);assert.equal(s.exchange,key);assert(s.choices.every(c=>!c.action));
  if(first==='marius')assert.equal(s.choices.some(c=>c.reply==='M-D1'),origin==='appointment');
  else assert.equal(s.lines[0].text,origin==='appointment'?'I took Marius’s appointment. His protection is confirmed.':'Marius has granted me protection for Mirelle’s work.');
  assert.deepEqual(r,before);
  for(const flag of ['pending','error']){const bad=structuredClone(r);bad[flag]=flag==='pending'?true:'unconfirmed';assert.equal(relationshipState(bad).order,null);assert(!scenes(bad).some(s=>s.exchange));}
  r.campaign.agentHistory=[];assert.equal(relationshipState(r).order,null);assert(!get(r,`character:${actor}`).exchange);
 }
 const r=fixture('marius');r.world.leases[0].end_night=r.world.night;assert.equal(relationshipState(r).order,null);
 const revoked=fixture('seraphine');revoked.world.grants[0].revoked=true;revoked.world.grant_validity[0]=false;revoked.world.access.court=false;assert.equal(relationshipState(revoked).order,null);
});

test('one immutable reply survives reload; dismissal is not a declaration; interruption does not dismiss',()=>{
 const r=fixture('marius'),before=structuredClone(r);let m=readSceneMemory(null);
 const s=get(r,'character:marius',m);assert.equal(readSceneMemory(JSON.stringify({...m,active:s.id})).relationships.dismissed.length,0);
 const dismissed=leaveRelationship(m,s);assert(dismissed.relationships.dismissed.includes('M-D'));assert.equal(dismissed.relationships.replies?.['M-D'],undefined);assert(!get(r,'character:marius',dismissed).exchange);
 m=select(r,m,'M-D','M-D2');assert.equal(m.active,'personal:relationship:M-D:answer');m=readSceneMemory(JSON.stringify(m));
 const answer=get(r,m.active,m);assert.equal(answer.lines[0].text,R['M-D2'][1]);assert(answer.choices.every(c=>!c.reply&&!c.action));
 assert.deepEqual(chooseRelationship(m,s,s.choices.find(c=>c.reply==='M-D3'),r),m);
 assert(!get(r,'character:marius',m).exchange);assert.equal(get(r,'personal:relationship:M-D',m).lines[0].text,R['M-D2'][1]);
 assert.equal(readSceneMemory(null).relationships,undefined);assert.deepEqual(r,before);
});

test('questions stay explored across replies, entry points, night changes and reload',()=>{
 const r=fixture();let m=markSceneRead(readSceneMemory(null),get(r,'ask:relationship:M-Q1'));
 r.campaign.night=r.world.night=1;m=readSceneMemory(JSON.stringify(m));
 assert.equal(topicStatus(get(r,'ask:relationship:M-Q1',m),m),'Explored');
 assert.equal(topicStatus(get(r,'ask:relationship:S-Q1',m),m),'New');
 const next=fixture('marius');m=select(next,m,'M-P','M-P1');assert.equal(topicStatus(get(next,'ask:relationship:M-Q1',m),m),'Explored');
});

test('service callback requires actual earlier promise and later fulfilment; research is not an appointment oath',()=>{
 const r=fixture('marius');let m=select(r,readSceneMemory(null),'M-D','M-D1');assert.match(get(r,m.active,m).lines[0].text,/Then do the work/);
 assert.notEqual(get(r,'character:marius',m).lines[0].text,T.M_SERVICE);r.campaign.politics.serviceFulfilled=true;
 const callback=get(r,'character:marius',m);assert.equal(callback.lines[0].text,T.M_SERVICE);m=leaveRelationship(m,callback);assert.notEqual(get(r,'character:marius',m).lines[0].text,T.M_SERVICE);
 const research=fixture('marius','research');const p=get(research,'personal:relationship:M-P');assert(p.choices.some(c=>c.reply==='M-P2B'));assert(!p.choices.some(c=>c.reply==='M-P2'));
 const rm=select(research,readSceneMemory(null),'M-D','M-D3');assert.match(get(research,rm.active,rm).lines[0].text,/^I offered you protection, not captivity\./);
});

test('Seraphine remembers exact choices with priority, without changing sanctuary or finale eligibility',()=>{
 const r=fixture('seraphine');let m=select(r,readSceneMemory(null),'S-P','S-P1');
 assert.match(get(r,'character:seraphine',m).lines[1].text,/When you said you wanted to stand with me, I believed you/);
 const before=structuredClone(r);
 for(const id of ['S-D1','S-D2','S-D3']){
  const selected=select(r,m,'S-D',id),g=get(r,'character:seraphine',selected);
  assert(!g.exchange);assert.equal(g.callback,id);assert.equal(get(r,selected.active,selected).lines[0].text,R[id][1]);
  assert(relationshipFinale(r,selected.relationships));assert(!get(r,'character:seraphine',leaveRelationship(selected,g)).callback);
 }
 assert.deepEqual(r,before);
});

test('final acceptance and actual withdrawal callbacks never project pending or failed success',()=>{
 const r=fixture('marius');let m=select(r,readSceneMemory(null),'M-D','M-D3');r.campaign.night=r.world.night=7;r.campaign.status='concluded';r.campaign.ending='favoured';r.campaign.politics.finalCourt={response:'accept',result:'accepted'};
 r.campaign.agentHistory.push({actor:'marius',kind:'final_answer',night:6,execution:'confirmed'});
 r.world.grants.push({id:1,property_id:'library',scope:'enter',grantor:'player',grantee:'marius',parent_grant_id:null,can_delegate:false,expiry_night:null,revoked:false});r.world.grant_validity.push(true);
 assert.equal(get(r,'reaction:npc:6:marius:final_answer',m).lines[0].text,T.M_FINAL);assert.equal(personalFinale(r,m.relationships).opening,T.M_FINAL);
 const withdrawn=fixture('marius');m=select(withdrawn,readSceneMemory(null),'M-D','M-D2');withdrawn.campaign.politics.finalCourt={response:'refuse',result:'rejected'};withdrawn.campaign.agentHistory.push({actor:'marius',kind:'final_answer',night:6,execution:'confirmed'});withdrawn.world.grants[0].revoked=true;withdrawn.world.grant_validity[0]=false;withdrawn.world.access.court=false;
 const result=get(withdrawn,'reaction:npc:6:marius:final_answer',m);assert.equal(result.lines[0].text,T.M_WITHDRAWN);assert.equal(result.lines[1].text,'Marius’s protection has ended. Your paid sanctuary remains effective for its agreed term.');
 withdrawn.pending=true;assert(!scenes(withdrawn,m).some(s=>s.lines.some(l=>l.text===T.M_WITHDRAWN)));
});

 test('all personal replies render only their selected supplied response; old saves and legacy question reads stay neutral',()=>{
 for(const [key,ids] of [['M-P',['M-P1','M-P2']],['S-P',['S-P1','S-P2']],['M-D',['M-D1','M-D2','M-D3']],['S-D',['S-D1','S-D2','S-D3']]]){
  const r=fixture(key==='S-D'?'seraphine':'marius'),before=structuredClone(r);
  for(const id of ids){const m=select(r,readSceneMemory(null),key,id),answer=get(r,m.active,m);assert.equal(answer.lines.length,1);assert(answer.choices.every(ch=>!ch.reply&&!ch.action));if(id!=='M-D1')assert.equal(answer.lines[0].text,R[id][1]);assert.equal(readSceneMemory(null).relationships,undefined);}
  assert.deepEqual(r,before);
 }
 const r=fixture(),old=readSceneMemory(JSON.stringify({seen:['personal:0:seraphine'],active:null,line:0}));
 assert.equal(topicStatus(get(r,'ask:relationship:S-Q2'),old),'Explored');assert.deepEqual(old.relationships.replies,{});
 });

 test('urgent final demand retains priority over a new dual-arrangement greeting',()=>{
 const r=fixture('seraphine');r.campaign.night=r.world.night=6;r.actions=availableActions(r.campaign,r.world);
 assert.equal(get(r,'character:marius').id,'final-demand');assert(!get(r,'character:seraphine').exchange);
 assert(get(r,'final-demand').choices.some(c=>c.action?.choice==='final_refuse'));
 });
