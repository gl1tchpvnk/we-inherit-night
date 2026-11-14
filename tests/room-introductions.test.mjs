import test from 'node:test';import assert from 'node:assert/strict';
import {newCampaign,availableActions} from '../src/game.ts';
import {introductoryRoom,roomIntroduction,finishRoomIntroduction,resumeEncounterMemory,readSceneMemory,buildEncounterScenes,markSceneRead,topicStatus} from '../src/encounters.ts';
import {runtimeDescription,initializationDescription,FIRST_NIGHT_PRELUDE} from '../src/entry.ts';
function fixture(night=0){const campaign=newCampaign('room-intro',{living:true,dangerous:true});campaign.night=night;campaign.politics.accounts=Object.fromEntries(['player',...Object.keys(campaign.npcs)].map(a=>[a,a]));const world={night,properties:[{id:'library',owner:'player'},{id:'sanctuary',owner:'seraphine'}],grants:[],grant_validity:[],leases:[{id:1,property_id:'sanctuary',buyer:'player',owner:'seraphine',status:'offered',duration_nights:7,offer_expiry_night:3,end_night:null,price_yocto:'20000000000000000000000'}],ancestry:[],access:{library:true,lounge:true,crypt:night<3}};return {campaign,world,error:null,pending:false,events:[],actions:availableActions(campaign,world)};}

test('room introductions use explicit encounter triggers, never generic room metadata',()=>{
 for(const id of ['character:seraphine','action:sanctuary_pact','lease:0','ask:4:seraphine','ask:relationship:S-Q1'])assert.equal(introductoryRoom(id),'lounge');
 for(const id of ['character:mirelle','character:dorian','action:investigate_title','action:authorize_mirelle','action:authorize_dorian','record:library','finding:mirelle'])assert.equal(introductoryRoom(id),'library');
 for(const id of ['decision:0','reckoning:3','incident:0','final-demand','character:marius','character:vesper','action:feed','record:crypt'])assert.equal(introductoryRoom(id),null);
});

test('completion and skip share one presentation transition; destination is not read prematurely',()=>{
 for(const id of ['character:seraphine','record:library','action:authorize_dorian']){
  const r=fixture(id.includes('authorize')?3:0),before=structuredClone(r),scenes=buildEncounterScenes(r);let memory={...readSceneMemory(null),active:id};const intro=roomIntroduction(scenes,memory,r);assert(intro);
  assert.deepEqual(markSceneRead(memory,intro),memory);assert.deepEqual(intro.choices,[]);
  memory={...memory,roomIntroduction:{room:intro.introduction,destination:id}};
  const restored=readSceneMemory(JSON.stringify(memory));assert.equal(roomIntroduction(scenes,restored,r).id,intro.id);
  const done=finishRoomIntroduction(restored);assert.equal(done.active,id);assert.equal(roomIntroduction(scenes,done,r),undefined);assert(!done.seen.includes(id));
  const target=scenes.find(s=>s.id===id);assert.notEqual(topicStatus(target,done),'Explored');
  assert.equal(roomIntroduction(scenes,readSceneMemory(JSON.stringify(done)),r),undefined);assert.deepEqual(r,before);
  const later=fixture(4),laterScenes=buildEncounterScenes(later);assert.equal(roomIntroduction(laterScenes,{...done,active:intro.introduction==='library'?'character:dorian':'character:seraphine'},later),undefined,'completion follows the room across characters and nights');
  assert(roomIntroduction(scenes,{...readSceneMemory(null),active:id},r),'new campaign without memory gets introduction');
 }
});

test('late records, old room saves, pending and failed state remain safe and state aware',()=>{
 const r=fixture(4),scenes=buildEncounterScenes(r),memory=resumeEncounterMemory(readSceneMemory(JSON.stringify({seen:['personal:0:vesper'],room:'library',active:null,line:0})));
 assert.equal(memory.active,'record:library');assert.equal(memory.room,null);assert(memory.seen.includes('personal:0:vesper'));assert(roomIntroduction(scenes,memory,r));
 for(const changes of [{pending:true},{error:'uncertain'}])assert.equal(roomIntroduction(scenes,memory,{...r,...changes}),undefined);
 assert.match(scenes.find(s=>s.id==='record:library').lines[0].text,/closed|will not reopen/);
 assert.match(scenes.find(s=>s.id==='ask:4:seraphine').lines[0].text,/not accepted before it closed/);
 const active={...memory,active:'ask:4:seraphine',room:'library'};assert.equal(resumeEncounterMemory(active).active,active.active);
});

test('runtime wording distinguishes hosted Testnet from genuine local modes; Crypt bridge remains narration',()=>{
 assert.match(runtimeDescription('testnet',true),/^NEAR Testnet · deterministic vampires · no live AI$/);assert.doesNotMatch(initializationDescription('testnet',true),/local|Sandbox/);
 assert.match(runtimeDescription('sandbox',false),/Local NEAR Sandbox/);assert.match(initializationDescription('sandbox',false),/Sandbox/);
 assert.match(FIRST_NIGHT_PRELUDE.text,/guides your first feeding/);assert.match(FIRST_NIGHT_PRELUDE.text,/Night One begins/);
});

test('rendered room introduction has only Continue and Skip, with no functional Feed or commitment',async()=>{
 const {build}=await import('vite'),{mkdtemp,writeFile,rm}=await import('node:fs/promises'),{resolve,join}=await import('node:path'),{pathToFileURL}=await import('node:url');const {createElement}=await import('react'),{renderToStaticMarkup}=await import('react-dom/server');const dir=await mkdtemp(resolve('.local/room-intro-ssr-'));
 try{const output=await build({configFile:false,logLevel:'silent',build:{ssr:resolve('src/VampireEncounter.tsx'),write:false,rollupOptions:{external:['react','react/jsx-runtime']}}});const file=join(dir,'scene.mjs');await writeFile(file,output.output.find(o=>o.type==='chunk').code);const {VampireEncounter}=await import(pathToFileURL(file).href);const r=fixture(),scene=roomIntroduction(buildEncounterScenes(r),{...readSceneMemory(null),active:'character:seraphine'},r);let calls=0;
 const html=renderToStaticMarkup(createElement(VampireEncounter,{scene,result:r,busy:false,lineIndex:0,feedback:'',onFeed(){calls++;},onChoice(){calls++;},onComplete(){},onLine(){},onSkipReckoning(){}}));
 assert.match(html,/lounge-provisional.png/);assert.match(html,/>Continue</);assert.match(html,/>Skip introduction</);assert.equal((html.match(/<button/g)||[]).length,2);assert.doesNotMatch(html,/encounter-feed|binding-choice|Wait for dawn|Rest|Tonight’s choices|Castle map/);assert.equal(calls,0);
 }finally{await rm(dir,{recursive:true,force:true});}
});
