import {bloodWarning} from '../src/blood.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {build} from 'vite';
import {newCampaign,availableActions} from '../src/game.ts';
import {buildEncounterScenes,readSceneMemory,finishScene,nextScene} from '../src/encounters.ts';

function fixture(){
 const campaign=newCampaign('scene-fixture');campaign.politics.accounts={player:'player',marius:'marius',sabine:'sabine',cassian:'cassian'};
 const world={night:0,next_nonce:0,properties:[{id:'crypt',owner:'vesper'},{id:'library',owner:'player'},{id:'lounge',owner:'seraphine'},{id:'court',owner:'marius'},{id:'sanctuary',owner:'seraphine'},{id:'passage',owner:'lucien'}],access:{crypt:true,library:true,lounge:false,court:false,sanctuary:false,passage:false},ancestry:[{sire:'vesper',descendant:'player'}],grants:[{id:0,property_id:'crypt',grantor:'vesper',grantee:'player',scope:'enter',parent_grant_id:null,can_delegate:true,expiry_night:null,revoked:false}],grant_validity:[true],leases:[{id:0,property_id:'lounge',owner:'seraphine',buyer:'player',price_yocto:'20000000000000000000000',duration_nights:3,offer_expiry_night:2,status:'offered',end_night:null,settled:false,payout_pending:false,escrow_yocto:'0'},{id:1,property_id:'sanctuary',owner:'seraphine',buyer:'player',price_yocto:'20000000000000000000000',duration_nights:7,offer_expiry_night:3,status:'offered',end_night:null,settled:false,payout_pending:false,escrow_yocto:'0'}]};
 const r={campaign,world,error:null,proof:'mock fixture',availability:{accept:[],reject:[],end_night:[],rooms:{}},pending:false};r.actions=availableActions(campaign,world);return r;
}
test('initial ultimatum, eight character scenes and only supported negotiation choices',()=>{
 const r=fixture(),before=structuredClone(r),scenes=buildEncounterScenes(r);
 assert.equal(nextScene(scenes,readSceneMemory(null)).id,'ultimatum');
 assert.equal(scenes.filter(s=>s.id.startsWith('character:')).length,8);
 assert.equal(scenes.find(s=>s.id==='action:sanctuary_pact').choices.filter(c=>c.action).length,0);
 assert.deepEqual(scenes.find(s=>s.id==='action:petition_marius').choices[0].action,{action:'game',choice:'petition_marius'});
 assert.deepEqual(r,before);assert.deepEqual(buildEncounterScenes(r),scenes);
});
test('conditional dialogue follows verified rights, obligations and finite outcomes without private memories',()=>{
 const r=fixture();r.campaign.npcs.marius.memory.push('private hidden thought');
 r.campaign.politics.serviceFulfilled=true;r.world.access.court=true;r.campaign.politics.dossier='dorian';
 let scenes=buildEncounterScenes(r);assert.match(scenes.find(s=>s.id==='character:marius').lines[0].text,/fulfilled/);
 assert.match(scenes.find(s=>s.id==='character:dorian').lines[0].text,/closed/);assert.ok(!JSON.stringify(scenes).includes('private hidden thought'));
 r.world.access.court=false;assert.match(buildEncounterScenes(r).find(s=>s.id==='character:marius').lines[0].text,/does not replace/);
 r.world.grants[0].revoked=true;assert.match(buildEncounterScenes(r).find(s=>s.id==='character:vesper').lines[0].text,/closed/);
});
test('sanctuary material terms stay visible and commitment exactly matches existing command',()=>{
 const r=fixture();r.campaign.politics.titleFiled=true;r.actions=availableActions(r.campaign,r.world);
 const s=buildEncounterScenes(r).find(s=>s.id==='action:sanctuary_pact');
 assert.match(s.terms.join(' '),/0.02 Sandbox NEAR/);assert.match(s.terms.join(' '),/7 nights/);assert.match(s.terms.join(' '),/nonrefundable/);assert.match(s.terms.join(' '),/one|major action/);
 assert.deepEqual(s.choices[0].action,{action:'game',choice:'sanctuary_pact'});
 r.pending=true;assert.equal(buildEncounterScenes(r).find(s=>s.id==='action:sanctuary_pact').choices.filter(c=>c.action).length,0);
});
test('pending acceptance/rejection, resolved agreements and failure snapshots cannot replay old choices',()=>{
 const r=fixture();r.campaign.agreements=[{id:'agreement',leaseId:0,status:'pending'}];
 let s=buildEncounterScenes(r).find(s=>s.id==='lease:0');
 assert.deepEqual(s.choices.find(c=>c.id==='accept').action,{action:'agreement_accept',agreement_id:'agreement'});
 assert.deepEqual(s.choices.find(c=>c.id==='reject').action,{action:'agreement_reject',agreement_id:'agreement'});
 r.world.leases[0].status='accepted';r.campaign.agreements[0].status='accepted';r.campaign.agreements[0].result='Contract confirmed';
 s=buildEncounterScenes(r).find(s=>s.id==='lease:0');assert.equal(s.choices.length,0);assert.equal(s.outcome,'Contract confirmed');
 r.error='uncertain';assert.ok(buildEncounterScenes(r).every(s=>!s.automatic&&s.choices.every(c=>!c.action)));
});
test('scene completion, skipping and reload are presentation-only; malicious persisted commands ignored',()=>{
 const r=fixture(),before=structuredClone(r);const scenes=buildEncounterScenes(r);
 let memory=readSceneMemory('{"seen":[],"active":"character:seraphine","line":1,"action":{"action":"accept"}}');
 assert.equal(nextScene(scenes,memory).id,'character:seraphine');assert.ok(!('action' in memory));
 memory=finishScene(memory,'ultimatum');assert.equal(nextScene(scenes,memory),undefined);
 assert.deepEqual(readSceneMemory(JSON.stringify(memory)),memory);assert.deepEqual(r,before);
 assert.deepEqual(readSceneMemory('broken'),{seen:[],active:null,line:0});
});
test('reckoning uses committed event IDs, distinguishes evidence and includes expiry even when every NPC passes',()=>{
 const r=fixture();r.campaign.night=3;r.world.night=3;r.campaign.agentHistory=[{night:2,actor:'vesper',kind:'revoke',execution:'confirmed'},{night:2,actor:'dorian',kind:'compete',execution:'local'},{night:2,actor:'marius',kind:'appoint',execution:'pending'}];
 let s=buildEncounterScenes(r).find(s=>s.id==='reckoning:2');assert.equal(s.lines.length,2);assert.match(s.lines[0].text,/NEAR-confirmed/);assert.match(s.lines[1].text,/Off-chain/);
 const m=finishScene(readSceneMemory(null),s.id);assert.equal(nextScene(buildEncounterScenes(r),m).id,'incident:3');
 r.campaign.night=5;r.world.night=5;r.campaign.agentHistory=[{night:4,actor:'lucien',kind:'pass',execution:'local'}];
 r.world.grants.push({property_id:'passage',grantee:'player',expiry_night:5});
 s=buildEncounterScenes(r).find(s=>s.id==='reckoning:4');assert.match(s.lines[0].text,/deadline/);
});
test('all campaign conclusions project engine outcomes without evaluating a new victory',()=>{
 for(const ending of ['unbound','favoured','failure']){const r=fixture();r.campaign.status=ending==='failure'?'defeat':'concluded';r.campaign.ending=ending;r.campaign.reason=`Recorded ${ending}`;
 const s=buildEncounterScenes(r).find(s=>s.type==='CAMPAIGN CONCLUSION');assert.equal(s.id,`conclusion:${ending}`);assert.ok(s.terms.includes(r.campaign.reason));assert.equal(s.choices.length,0);}
});
test('React scene renders native accessible controls, escaped dialogue and always-visible material terms (SSR, not browser QA)',async()=>{
 const dir=await mkdtemp(join(resolve('.local'),'scene-ssr-'));
 try{
 const output=await build({configFile:false,logLevel:'silent',build:{ssr:resolve('src/VampireEncounter.tsx'),write:false,minify:false,rollupOptions:{external:['react','react/jsx-runtime']}}});
 const chunk=output.output.find(o=>o.type==='chunk');const file=join(dir,'scene.mjs');await writeFile(file,chunk.code);
 const {VampireEncounter}=await import(pathToFileURL(file).href);
 const r=fixture(),scene=buildEncounterScenes(r).find(s=>s.id==='lease:0');scene.lines[0].text='<script>not trusted</script>';
 let calls=0;const html=renderToStaticMarkup(createElement(VampireEncounter,{scene,lineIndex:0,busy:false,feedback:'',onLine:()=>{},onChoice:()=>{calls++;},onComplete:()=>{},onSkipReckoning:()=>{}}));
 assert.match(html,/<dialog/);assert.match(html,/aria-labelledby="encounter-title"/);assert.match(html,/type="button"/);assert.match(html,/0.02 Sandbox NEAR/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);assert.equal(calls,0);
 const focused=fixture();focused.campaign.politics.library={chosen:null,authorizedNight:null,result:'open',challenged:false};
 const opening=buildEncounterScenes(focused).find(s=>s.id==='ultimatum');
 const props={scene:opening,lineIndex:0,busy:false,feedback:'',onLine(){},onChoice(){},onComplete(){},onSkipReckoning(){}};
 const first=renderToStaticMarkup(createElement(VampireEncounter,props));assert.match(first,/>Continue</);assert.doesNotMatch(first,/Find out who|Finish \/ skip|What changes/);
 const last=renderToStaticMarkup(createElement(VampireEncounter,{...props,lineIndex:1}));assert.match(last,/Find out who might help/);assert.doesNotMatch(last,/>Continue</);assert.equal((last.match(/>Castle map</g)||[]).length,1);
 const busy=renderToStaticMarkup(createElement(VampireEncounter,{scene,lineIndex:0,busy:true,feedback:'',onLine:()=>{},onChoice:()=>{},onComplete:()=>{},onSkipReckoning:()=>{}}));assert.match(busy,/disabled/);
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('Pass 2G: every night directs discovery after reckoning; viewed incidents remain reload-safe',()=>{
 for(let night=0;night<7;night++){
  const r=fixture();r.campaign.night=night;r.world.night=night;
  if(night)r.campaign.agentHistory=[{night:night-1,actor:'marius',kind:'pass',execution:'local'}];
  const before=structuredClone(r),scenes=buildEncounterScenes(r);let memory=readSceneMemory(null);
  if(night){assert.equal(nextScene(scenes,memory).id,`reckoning:${night-1}`);memory=finishScene(memory,`reckoning:${night-1}`);}
  const incident=nextScene(scenes,memory);assert.equal(incident.id,night?`incident:${night}`:'ultimatum');
  assert.ok(incident.choices.some(c=>c.inspect===`discovery:${night}`));
  memory=finishScene(memory,incident.id);assert.equal(nextScene(scenes,readSceneMemory(JSON.stringify(memory))),undefined);
  assert.deepEqual(r,before);
 }
});

test('Pass 2G: discovery reaches both patrons after appointment despite locked Lounge; all eight have free branches',()=>{
 const r=fixture();r.campaign.night=1;r.campaign.politics.appointment='player';r.world.access.court=true;
 const before=structuredClone(r),scenes=buildEncounterScenes(r),discovery=scenes.find(s=>s.id==='discovery:1');
 for(const actor of Object.keys(r.campaign.npcs)){
  assert.ok(discovery.choices.some(c=>c.inspect===`character:${actor}`));
  const parent=scenes.find(s=>s.id===`character:${actor}`);
  for(const branch of ['question','relationship','respect','challenge']){
   const id=`talk:1:${actor}:${branch}`;assert.ok(parent.choices.some(c=>c.inspect===id));
   const topic=scenes.find(s=>s.id===id);assert.ok(topic.choices.every(c=>!c.action));
   assert.ok(topic.choices.some(c=>c.inspect===`character:${actor}`));
  }
 }
 assert.equal(r.world.access.lounge,false);assert.deepEqual(r,before);
});

test('Pass 2G: decisions expose only available major actions, explicit pass and inspection; current commands remain authoritative',()=>{
 const r=fixture();r.campaign.politics.titleFiled=true;r.actions=availableActions(r.campaign,r.world);
 let scenes=buildEncounterScenes(r),decision=scenes.find(s=>s.id==='decision:0');
 for(const a of r.actions.filter(a=>a.allowed&&a.cost.majorActions)){
  const option=decision.choices.find(c=>c.inspect===`action:${a.kind}`);assert.ok(option);assert.ok(option.summary.join(' ').includes('Cost:'));
  const detail=scenes.find(s=>s.id===option.inspect);assert.deepEqual(detail.choices.find(c=>c.id==='commit').action,{action:'game',choice:a.kind});
  assert.ok(detail.choices.some(c=>c.inspect==='decision:0'));
 }
 assert.deepEqual(decision.choices.find(c=>c.id==='pass').action,{action:'end_night'});
 assert.ok(!decision.choices.some(c=>c.inspect==='action:fulfil_service'));
 r.pending=true;scenes=buildEncounterScenes(r);assert.ok(scenes.every(s=>s.choices.every(c=>!c.action)));
});

test('Pass 2G: incidents react to resources and unfinished obligations; endings explain ordinary access',()=>{
 const r=fixture();r.campaign.night=4;r.world.night=4;r.world.access.court=true;r.campaign.politics.appointment='player';
 let scenes=buildEncounterScenes(r);assert.equal(scenes.find(s=>s.id==='incident:4').lines[0].speaker,'marius');
 r.campaign.resources.blood=2;scenes=buildEncounterScenes(r);assert.match(scenes.find(s=>s.id==='incident:4').lines[0].text,/Blood/);
 r.campaign.status='defeat';r.campaign.ending='failure';r.campaign.reason='FAILURE — your Blood is exhausted.';r.world.access.lounge=true;
 const ending=buildEncounterScenes(r).find(s=>s.type==='CAMPAIGN CONCLUSION');
 assert.ok(ending.terms.includes(r.campaign.reason));assert.match(ending.terms.join(' '),/Lounge open/);assert.match(ending.terms.join(' '),/Neither counts as shelter/);
 assert.ok(!buildEncounterScenes(r).some(s=>s.id==='incident:4'));
});

test('Pass 2G: late qualification and immediately dangerous resources are explained before commitment',()=>{
 const r=fixture();r.campaign.night=2;r.world.night=2;r.campaign.resources.blood=2;r.campaign.resources.exposure=8;r.actions=availableActions(r.campaign,r.world);
 const scenes=buildEncounterScenes(r),decision=scenes.find(s=>s.id==='decision:2');
 assert.match(decision.choices.find(c=>c.inspect==='action:investigate_title').summary.join(' '),/Too late/);
 assert.match(bloodWarning(r,{action:'game',choice:'investigate_title'}),/Fatal/);
 assert.doesNotMatch(scenes.find(s=>s.id==='action:feed').terms.join(' '),/Exposure|fatal threshold/);
 // Warnings inform; only the existing validator determines availability.
 assert.deepEqual(scenes.find(s=>s.id==='action:feed').choices.find(c=>c.id==='commit').action,{action:'game',choice:'feed'});
});

test('Pass 2G: final reckoning leads to outcome, with no eighth-night decision',()=>{
 const r=fixture();r.campaign.night=7;r.world.night=7;r.campaign.status='concluded';r.campaign.ending='favoured';r.campaign.reason='Recorded patron outcome';r.campaign.agentHistory=[{night:6,actor:'marius',kind:'pass',execution:'local'}];
 const scenes=buildEncounterScenes(r),last=scenes.find(s=>s.id==='reckoning:6');
 assert.equal(last.completionLabel,'Review campaign outcome');assert.deepEqual(last.portraits,[]);
 assert.ok(!scenes.some(s=>s.type==='DECISION'||s.id==='discovery:7'));
 assert.equal(nextScene(scenes,finishScene(readSceneMemory(null),last.id)).type,'CAMPAIGN CONCLUSION');
});
