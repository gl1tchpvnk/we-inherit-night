import {dialogueBeats} from '../src/scenePresentation.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {build} from 'vite';
import {newCampaign,availableActions} from '../src/game.ts';
import {buildEncounterScenes} from '../src/encounters.ts';
import {endingSummary,endingConsequences} from '../src/livingCourt.ts';
import {libraryPlayerOperation} from '../src/library.ts';
import {finalPlayerOperation,finalAccepted,PASSAGE_PRICE} from '../src/finalCourt.ts';
import {encounterFeedText} from '../src/blood.ts';

// Synthetic authoritative-view fixtures only; no RPC, signing or saved campaigns.
function fixture(night=0){
 const campaign=newCampaign('narrative-v2',{living:true,dangerous:true});campaign.night=night;
 campaign.politics.accounts=Object.fromEntries(['player',...Object.keys(campaign.npcs)].map(a=>[a,a]));
 const world={night,next_nonce:0,properties:['crypt','library','lounge','sanctuary','court','passage'].map((id,i)=>({id,owner:['vesper','player','seraphine','seraphine','marius','lucien'][i]})),ancestry:[{sire:'vesper',descendant:'player'}],grants:[],grant_validity:[],access:{crypt:night<3,library:true,lounge:true,sanctuary:false,court:false,passage:false},leases:[
  {id:0,property_id:'lounge',owner:'seraphine',buyer:'player',price_yocto:'20000000000000000000000',duration_nights:3,offer_expiry_night:2,status:'offered',end_night:null,settled:false,payout_pending:false,escrow_yocto:'0'},
  {id:1,property_id:'sanctuary',owner:'seraphine',buyer:'player',price_yocto:'20000000000000000000000',duration_nights:7,offer_expiry_night:3,status:'offered',end_night:null,settled:false,payout_pending:false,escrow_yocto:'0'}]};
 return refresh({campaign,world,pending:false,error:null,events:[],availability:{end_night:[],accept:[],reject:[],rooms:{}}});
}
function refresh(r){r.actions=availableActions(r.campaign,r.world);return r;}
function grant(r,property,issuer,recipient,extra={}){
 const g={id:r.world.grants.length,property_id:property,scope:'enter',grantor:issuer,grantee:recipient,parent_grant_id:null,can_delegate:false,expiry_night:null,revoked:false,...extra};
 r.world.grants.push(g);r.world.grant_validity.push(!g.revoked);if(recipient==='player')r.world.access[property]=!g.revoked;return g;
}
function scenes(r){return buildEncounterScenes(refresh(r));}
function scene(r,id){return scenes(r).find(s=>s.id===id);}
function words(s){return [...s.lines.map(l=>l.text),...s.terms].join(' ');}
function research(r,actor='mirelle'){
 r.campaign.politics.library={chosen:actor,authorizedNight:3,result:'open',challenged:false};
 return grant(r,'library','player',actor,{can_delegate:true});
}

test('V2 seven-night projections preserve state, destinations, allowed commands and urgent information',()=>{
 for(let n=0;n<7;n++){
  const r=fixture(n);r.campaign.resources.blood=3;
  if(n>=3){r.campaign.politics.appointment='player';grant(r,'court','marius','player');}
  const before=structuredClone(refresh(r)),all=scenes(r),ids=new Set(all.map(s=>s.id));
  assert.equal(ids.size,all.length);
  for(const s of all)for(const ch of s.choices){
   if(ch.inspect)assert.ok(ids.has(ch.inspect),ch.inspect);
   if(ch.action?.action==='game')assert.ok(r.actions.some(a=>a.kind===ch.action.choice&&a.allowed));
  }
  if(n<6){
   const hub=all.find(s=>s.id===`discovery:${n}`);
   assert.match(words(hub),/hunger/i);
   if(n===3||n===4)assert.match(words(hub),/work by the end of Night Five/);
   if(n>0)assert.notEqual(hub.lines[0].text,all.find(s=>s.id===`incident:${n}`).lines[0].text);
  }
  assert.deepEqual(r,before);
 }
});

test('Vesper warning precedes revocation; only confirmed withdrawal produces the completed-act reply',()=>{
 const r=fixture(2);const g=grant(r,'crypt','vesper','player');
 assert.match(scene(r,'incident:2').lines[0].text,/Tonight, Vesper's promise ends/);
 assert.doesNotMatch(scene(r,'incident:2').lines[0].text,/dread|has withdrawn/);
 assert.match(scene(r,'character:vesper').lines[0].text,/Tonight\. You have had time/);
 for(const execution of ['pending','failed']){
  r.campaign.agentHistory=[{night:2,actor:'vesper',kind:'revoke',execution}];
  assert.ok(!scenes(r).some(s=>s.id==='reaction:npc:2:vesper:revoke'));
 }
 g.revoked=true;r.world.grant_validity[0]=false;r.world.access.crypt=false;r.campaign.night=r.world.night=3;
 r.campaign.agentHistory[0].execution='confirmed';
 assert.match(words(scene(r,'reaction:npc:2:vesper:revoke')),/I have withdrawn my invitation/);
 grant(r,'crypt','other','player');
 assert.match(words(scene(r,'reaction:npc:2:vesper:revoke')),/Another valid right/);
 assert.doesNotMatch(scene(r,'character:vesper').lines[0].text,/-\d+ more nights/);
});

test('sanctuary separates a proposal, paid acceptance and rejection, and retains all binding terms',()=>{
 const r=fixture(1);r.campaign.politics.titleFiled=true;
 const offer=scene(r,'action:sanctuary_pact'),intro=scene(r,'character:seraphine').lines[0].text;
 assert.equal(offer.lines[0].text,intro,'offer and conversation use the same decision surface');assert.equal(offer.lines.length,1);
 for(const pattern of [/one nightly action/i,/0\.02 NEAR/,/nonrefundable/,/gas/,/temporary shelter, not ownership/,/cannot be cancelled/,/Night Four/,/until after the final reckoning/])assert.match(offer.terms.join(' '),pattern);
 assert.match(offer.rights.join(' '),/Exact duration: 7 nights/);assert.match(offer.rights.join(' '),/contract night 8 \(start of Night 9\)/);
 assert.deepEqual(offer.choices.find(c=>c.action).action,{action:'game',choice:'sanctuary_pact'});
 assert.ok(!scenes(r).some(s=>s.id==='reaction:lease:1:accepted'));
 for(const blocked of [{pending:true},{error:'unresolved'}]){
  const view={...r,...blocked};assert.ok(scenes(view).every(s=>s.choices.every(c=>!c.action)));
  assert.ok(!scenes(view).some(s=>s.id==='reaction:lease:1:accepted'));
 }
 r.world.leases[1].status='accepted';r.world.leases[1].end_night=8;r.world.leases[1].escrow_yocto='20000000000000000000000';r.world.access.sanctuary=true;
 assert.match(words(scene(r,'reaction:lease:1:accepted')),/It is settled/ );
 assert.match(scene(r,'character:seraphine').lines[0].text,/You paid for a refuge/);
 r.world.leases[1].status='rejected';r.world.access.sanctuary=false;
 assert.match(words(scene(r,'reaction:lease:1:rejected')),/rejected/);
 assert.doesNotMatch(scene(r,'character:seraphine').lines[0].text,/You paid/);
 const lounge=scene(r,'lease:0');assert.match(lounge.choices.find(c=>c.id==='reject').label,/no nightly action/);
 assert.deepEqual(lounge.choices.find(c=>c.id==='reject').action,{action:'reject'});
});

test('appointment and service remain future grants and existing obligations, not persuasive success',()=>{
 const r=fixture();let s=scene(r,'action:petition_marius');
 assert.match(s.terms.join(' '),/confirmed grant/);assert.match(s.terms.join(' '),/revocable/);
 assert.ok(!scenes(r).some(s=>s.id.includes('reaction:npc:0:marius:appoint')));
 r.campaign.night=r.world.night=3;r.campaign.politics.appointment='player';grant(r,'court','marius','player');
 s=scene(r,'action:fulfil_service');assert.match(s.terms.join(' '),/1 Blood/);
 assert.deepEqual(s.choices.find(c=>c.action).action,{action:'game',choice:'fulfil_service'});
 assert.match(scene(r,'character:marius').lines[0].text,/still expect the work/);
 r.campaign.politics.serviceFulfilled=true;
 assert.match(scene(r,'character:marius').lines[0].text,/work is finished/);
 assert.ok(!scene(r,'action:fulfil_service').choices.some(c=>c.action));
});

test('both investigators preserve mutually exclusive permission, cascades and irreversible publication',()=>{
 for(const actor of ['mirelle','dorian']){
  const r=fixture(3),other=actor==='mirelle'?'dorian':'mirelle';
  const operation=libraryPlayerOperation(r.campaign,`authorize_${actor}`,r.world);
  assert.equal(operation.method,'grant_access');assert.equal(operation.args.grantee,actor);
  assert.equal(operation.args.can_delegate,true);assert.equal(operation.args.expiry_night,null);
  const s=scene(r,`action:authorize_${actor}`);
  for(const pattern of [/One nightly action/,/delegable/,/without expiry/,/revoke/,/later reckoning/,/cannot be recalled/,/confirmed grant/])assert.match(s.terms.join(' '),pattern);
  const root=research(r,actor);grant(r,'library',actor,actor==='mirelle'?'cassian':'lucien',{parent_grant_id:root.id});
  assert.ok(!scene(r,`action:authorize_${other}`).choices.some(c=>c.action));
  assert.deepEqual(libraryPlayerOperation(r.campaign,'withdraw_library',r.world),{method:'revoke_grant',args:{grant_id:root.id}});
  assert.match(scene(r,'action:withdraw_library').terms.join(' '),/access derived from it.*Unfinished research stops; existing financial obligations remain/);
  r.campaign.night=r.world.night=5;r.campaign.politics.library.result=actor;
  grant(r,actor==='mirelle'?'court':'passage',actor==='mirelle'?'marius':'lucien','player');
  root.revoked=true;r.world.grant_validity[0]=r.world.grant_validity[1]=false;
  r.campaign.events.push('Night 6: Withdraw your Library permission.');
  const reaction=scene(r,`reaction:withdraw:${root.id}`);
  assert.match(words(reaction),/Published findings remain/);assert.match(words(reaction),/Separate patron protection/);
  assert.ok(!scene(r,`action:authorize_${other}`).choices.some(c=>c.action));
  assert.equal(r.campaign.politics.library.result,actor);
 }
});

test('final demand is conditional; counter grant survives rejection and neither outcome precedes confirmation',()=>{
 const r=fixture(6);assert.equal(scene(r,'final-demand'),undefined);
 grant(r,'court','marius','player');r.campaign.politics.library.result='mirelle';r.campaign.politics.serviceFulfilled=true;
 const demand=scene(r,'final-demand');
 assert.match(demand.lines[0].text,/I want an invitation to your Library that does not expire/);
 assert.doesNotMatch(demand.lines[0].text,/Your Library will admit me/);
 assert.deepEqual(demand.choices.filter(c=>c.action?.action==='game'&&c.action.choice.startsWith('final_')).map(c=>c.action.choice),['final_accept','final_refuse','final_counter']);
 assert.match(encounterFeedText(r),/Leaving Marius unanswered/);
 const counter=demand.choices.find(c=>c.id==='final_counter');assert.match(counter.summary.join(' '),/He will reject/);
 assert.match(counter.summary.join(' '),/even if he refuses/);
 assert.match(counter.label,/Grant two nights/);assert.equal(scene(r,'action:final_counter').redirect,'final-demand');
 const op=finalPlayerOperation(r.campaign,'final_counter',r.world);
 assert.equal(op.args.expiry_night,8);assert.equal(op.args.can_delegate,false);
 grant(r,'library','player','marius',op.args);r.campaign.politics.finalCourt.response='counter';
 assert.equal(finalAccepted(r.campaign,r.world),false);
 r.campaign.agentHistory=[{night:6,actor:'marius',kind:'final_answer',execution:'pending'}];
 assert.equal(scene(r,'reaction:npc:6:marius:final_answer'),undefined);
 r.world.leases.push({id:2,property_id:'passage',buyer:'cassian',owner:'lucien',price_yocto:PASSAGE_PRICE,duration_nights:3,offer_expiry_night:5,status:'accepted',settled:true,end_night:7});
 assert.equal(finalAccepted(r.campaign,r.world),true);
 r.campaign.politics.finalCourt.result='accepted';r.campaign.agentHistory[0].execution='confirmed';
 assert.match(words(scene(r,'reaction:npc:6:marius:final_answer')),/accepts a limited inspection/);
 r.campaign.politics.finalCourt.result='rejected';
 assert.match(endingConsequences(r).join(' '),/invitation you gave him still stands/);
 r.campaign.politics.finalCourt.response=null;r.campaign.politics.library.result='dorian';
 assert.match(scene(r,'final-demand').choices.find(c=>c.id==='final_counter').summary.join(' '),/He will reject/);
 r.campaign.politics.library.result='open';
 assert.ok(!scene(r,'final-demand').choices.some(c=>c.action?.choice==='final_counter'));
});

test('endings retain recorded cause, patron and expiry without inventing a final night or completed settlement',()=>{
 const r=fixture(7);r.campaign.status='concluded';r.campaign.ending='unbound';
 r.world.leases[1].status='accepted';r.world.leases[1].end_night=9;r.world.access.sanctuary=true;
 assert.match(endingSummary(r),/final reckoning is over/);assert.match(endingSummary(r),/2 nights remaining/);
 assert.doesNotMatch(endingSummary(r),/lasts through the final night/);
 assert.match(scene(r,'conclusion:unbound').lines[0].text,/not given you a home forever/);
 r.world.night=9;assert.match(endingSummary(r),/has expired/);
 for(const patron of ['Marius','Lucien']){
  r.campaign.ending='favoured';r.campaign.reason=`${patron} protects you`;
  assert.match(scene(r,'conclusion:favoured').lines[0].text,new RegExp(patron));
  assert.deepEqual(scene(r,'conclusion:favoured').portraits,[patron.toLowerCase()]);
 }
 for(const night of [0,3,6]){
  r.campaign.status='defeat';r.campaign.ending='failure';r.campaign.resources.blood=0;r.campaign.night=r.world.night=night;r.campaign.reason='Recorded Blood exhaustion';
  const text=scene(r,'conclusion:failure').lines[0].text;
  assert.match(text,/Your Blood is exhausted/);assert.doesNotMatch(text,/seventh|final night|this reckoning|campaign ends|decisions remain|you ignored/i);
 }
 r.campaign.resources.blood=3;r.campaign.reason='No qualifying shelter';
 assert.match(scene(r,'conclusion:failure').lines[0].text,/no qualifying protection/);
 assert.equal(r.archiveComplete,undefined);
});

test('visible negotiation and reaction markup keeps terms once and the matching command',async()=>{
 const dir=await mkdtemp(join(resolve('.local'),'narrative-v2-ssr-'));
 try{
  const output=await build({configFile:false,logLevel:'silent',build:{ssr:resolve('src/VampireEncounter.tsx'),write:false,rollupOptions:{external:['react','react/jsx-runtime']}}});
  const path=join(dir,'scene.mjs');await writeFile(path,output.output.find(x=>x.type==='chunk').code);
  const {VampireEncounter}=await import(pathToFileURL(path).href);
  const r=fixture(1);r.campaign.politics.titleFiled=true;
  const offer=scene(r,'action:sanctuary_pact');
  const render=(s,index)=>renderToStaticMarkup(createElement(VampireEncounter,{scene:s,lineIndex:index,busy:false,feedback:'',result:r,onLine(){},onChoice(){},onComplete(){},onSkipReckoning(){}}));
  const beats=dialogueBeats(offer),opening=render(offer,0);
  assert.doesNotMatch(opening,/binding-choice|Before you decide/);
  const markup=render(offer,beats.length-1);
  assert.equal(markup.match(/<blockquote>([\s\S]*?)<\/blockquote>/)?.[1],beats.at(-1).text);
  for(const term of offer.terms)assert.equal(markup.split(term.replaceAll('&','&amp;').replaceAll("'",'&#x27;')).length-1,1);
  assert.match(markup,/Before you decide/);assert.match(markup,/nonrefundable/);assert.match(markup,/Accept sanctuary/);
  r.world.leases[1].status='accepted';r.world.leases[1].end_night=8;r.world.access.sanctuary=true;
  const reaction=scene(r,'reaction:lease:1:accepted');
  assert.equal(render(reaction,dialogueBeats(reaction).length-1).match(/<blockquote>([\s\S]*?)<\/blockquote>/)?.[1],dialogueBeats(reaction).at(-1).text);
  assert.equal(dialogueBeats(reaction).map(b=>b.text).join('\n\n'),reaction.lines.map(l=>l.text).join('\n\n'));
  assert.ok(reaction.terms.every(t=>!reaction.lines.some(l=>l.text===t)));
 }finally{await rm(dir,{recursive:true,force:true});}
});
