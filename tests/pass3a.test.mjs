import {expiryDescription} from '../src/leaseNarrative.ts';
import {courtReactions} from '../src/reactiveCourt.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,availableActions} from '../src/game.ts';
import {buildEncounterScenes} from '../src/encounters.ts';
import {CHAPTERS,roomDevelopment,endingSummary} from '../src/livingCourt.ts';

function fixture(night=0){
 const c=newCampaign('pass3a',{living:true});c.night=night;
 c.politics.accounts=Object.fromEntries(['player',...Object.keys(c.npcs)].map(a=>[a,a]));
 const world={night,next_nonce:0,properties:[{id:'library',owner:'player'}],grants:[],grant_validity:[],leases:[{id:1,property_id:'sanctuary',owner:'seraphine',buyer:'player',price_yocto:'20000000000000000000000',duration_nights:7,offer_expiry_night:3,status:'offered',end_night:null}],ancestry:[],access:{library:true,lounge:true,crypt:night<3,sanctuary:true,court:false,passage:false}};
 const r={campaign:c,world,error:null,pending:false,events:[],proof:'unit fixture',availability:{accept:[],reject:[],rooms:{},end_night:[]}};
 r.actions=availableActions(c,world);return r;
}
function researcher(r,actor='mirelle'){
 r.campaign.politics.library.chosen=actor;r.campaign.politics.library.authorizedNight=3;
 r.world.grants.push({id:10,property_id:'library',grantee:actor,grantor:'player',parent_grant_id:null,scope:'enter',can_delegate:true,expiry_night:null,revoked:false});r.world.grant_validity.push(true);r.actions=availableActions(r.campaign,r.world);
}
test('ending portrait follows the recorded patron when multiple rights survive',()=>{
 const r=fixture(7);r.campaign.status='victory';r.campaign.ending='favoured';r.campaign.reason='Lucien protects you beyond the temporary passage.';
 r.world.access.court=true;r.world.access.passage=true;
 const scene=buildEncounterScenes(r).find(s=>s.type==='CAMPAIGN CONCLUSION');
 assert.deepEqual(scene.portraits,['lucien']);assert.match(scene.lines[0].text,/Lucien stands behind you/);
});
test('seven distinct chapters have available decisions and resolvable links without changing state',()=>{
 assert.equal(new Set(CHAPTERS.map(c=>c.title)).size,7);
 for(let night=0;night<7;night++){
  const r=fixture(night),before=structuredClone(r),scenes=buildEncounterScenes(r),ids=new Set(scenes.map(s=>s.id));
  assert.ok(scenes.find(s=>s.id===`decision:${night}`).choices.length);
  for(const s of scenes)for(const ch of s.choices){
   if(ch.inspect)assert.ok(ids.has(ch.inspect),`${night}: missing ${ch.inspect}`);
   if(ch.action?.action==='game')assert.ok(r.actions.some(a=>a.kind===ch.action.choice&&a.allowed));
  }
  assert.deepEqual(r,before);
 }
});
test('no phantom assistant, patron protection or private knowledge is narrated',()=>{
 const r=fixture(4);researcher(r);r.campaign.npcs.mirelle.memory.push('PRIVATE_SECRET');
 let scenes=buildEncounterScenes(r);assert.match(scenes.find(s=>s.id==='character:mirelle').lines[0].text,/still need/);
 r.world.grants.push({id:11,property_id:'library',grantee:'cassian',grantor:'mirelle',parent_grant_id:10});r.world.grant_validity.push(true);
 scenes=buildEncounterScenes(r);assert.match(scenes.find(s=>s.id==='character:mirelle').lines[0].text,/Cassian has joined/);
 assert.ok(!JSON.stringify(scenes).includes('PRIVATE_SECRET'));
 r.campaign.politics.library.result='dorian';scenes=buildEncounterScenes(r);
 assert.match(scenes.find(s=>s.id==='character:lucien').lines[0].text,/Until I actually/);
});
test('Night Seven can stop pending research or keep it running; publication changes the stakes',()=>{
 const r=fixture(6);researcher(r);let scenes=buildEncounterScenes(r);
 const decision=scenes.find(s=>s.id==='decision:6');assert.ok(decision.choices.some(c=>c.inspect==='action:withdraw_library'));
 assert.ok(decision.choices.some(c=>c.inspect==='hold:6'));
 assert.deepEqual(scenes.find(s=>s.id==='hold:6').choices[0].action,{action:'end_night'});
 assert.ok(!decision.choices.some(c=>c.inspect==='action:authorize_dorian'));
 assert.match(roomDevelopment(r,'library').text,/unfinished|stop the research/);
 r.campaign.politics.library.result='mirelle';assert.match(roomDevelopment(r,'library').text,/public/);
});
test('material risks remain visible; failed or pending actions never acquire narrative commitments',()=>{
 const r=fixture(1);r.campaign.politics.titleFiled=true;r.campaign.resources.exposure=8;r.actions=availableActions(r.campaign,r.world);
 let scenes=buildEncounterScenes(r),terms=scenes.find(s=>s.id==='action:sanctuary_pact').terms.join(' ');
 for(const text of ['0.02 Sandbox NEAR','nonrefundable','gas','7 nights','one major action','Night Four'])assert.ok(terms.includes(text),text);
 assert.match(scenes.find(s=>s.id==='action:feed').terms.join(' '),/fatal Exposure/);
 r.pending=true;scenes=buildEncounterScenes(r);assert.ok(scenes.every(s=>!s.automatic&&s.choices.every(c=>!c.action)));
});
test('reckoning excludes pending/failed NPC acts; withdrawn research never erases independent rewards',()=>{
 const r=fixture(5);r.campaign.agentHistory=[{night:4,actor:'mirelle',kind:'archive_research',execution:'pending'},{night:4,actor:'marius',kind:'archive_protect',execution:'failed'},{night:4,actor:'vesper',kind:'pass',execution:'local'}];
 let s=buildEncounterScenes(r).find(s=>s.id==='reckoning:4');assert.ok(!s.lines.some(l=>l.text.includes('published')||l.text.includes('You have my protection')));
 r.campaign.agentHistory[0].execution='confirmed';r.campaign.agentHistory[1].execution='confirmed';
 s=buildEncounterScenes(r).find(s=>s.id==='reckoning:4');assert.ok(s.lines.some(l=>l.text.includes('work is published')));
 assert.ok(s.lines.some(l=>l.text.includes('Taking her key back will not undo')));
});


test('exclusive lease deadlines use the seven-night timeline without promising expired protection',()=>{
 assert.equal(expiryDescription(6,5),'ends at the start of Night 7');
 assert.equal(expiryDescription(7,6),'lasts through the final night');
 assert.equal(expiryDescription(7,7),'has expired');
 assert.equal(expiryDescription(null,6),'has no confirmed expiry');
 for(const end of [7,8,9]){
  const r=fixture(6);r.campaign.ending='unbound';r.world.leases[0].status='accepted';r.world.leases[0].end_night=end;
  assert.equal(endingSummary(r),'Your Library is still yours. Seraphine cannot withdraw her protection, and it will last through the final night. But sanctuary is not ownership.');
  assert.doesNotMatch(courtReactions(r).map(x=>x.text).join(' '),/Night (?:8|9|10|Eight|Nine)/);
  r.world.night=end;assert.match(endingSummary(r),/has expired/);assert.doesNotMatch(endingSummary(r),/will last through/);
 }
 const short=fixture(4);short.campaign.ending='unbound';short.world.leases[0].status='accepted';short.world.leases[0].end_night=5;
 assert.match(endingSummary(short),/ends at the start of Night 6/);assert.doesNotMatch(endingSummary(short),/through the final night/);
 short.world.leases[0].buyer='someone-else';assert.match(endingSummary(short),/No accepted sanctuary/);
});
