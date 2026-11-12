import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {build} from 'vite';
import {ROOMS,resumeRoom,roomDenial,roomActions,navigationGuidance} from '../src/navigation.ts';
import {buildEncounterScenes,readSceneMemory,finishScene,nextScene} from '../src/encounters.ts';
import {newCampaign,availableActions} from '../src/game.ts';
function fixture(){
 const campaign=newCampaign('navigation',{accounts:{player:'player',vesper:'vesper',seraphine:'seraphine',marius:'marius',lucien:'lucien',mirelle:'mirelle',sabine:'sabine',cassian:'cassian',dorian:'dorian'}});
 const world={night:0,properties:[{id:'library',owner:'player'},{id:'crypt',owner:'vesper'}],access:{library:true,crypt:true,lounge:false},grants:[],leases:[],ancestry:[]};
 return {campaign,world,error:null,actions:availableActions(campaign,world),availability:{rooms:{lounge:'Lease required.'},accept:[],reject:[],end_night:[]}};
}
test('castle and room routes accept only existing accessible rooms; denial never changes state',()=>{
 const r=fixture(),before=structuredClone(r);assert.deepEqual(ROOMS.map(r=>r.id),['crypt','library','lounge']);
 assert.equal(resumeRoom('library',r).room,'library');assert.equal(resumeRoom(null,r).room,null);assert.equal(resumeRoom('invented',r).room,null);
 assert.equal(roomDenial(r,'lounge'),'Lease required.');assert.equal(resumeRoom('lounge',r).room,null);assert.deepEqual(r,before);
});
test('room reload shares existing scene memory and falls back with explanation after lost access',()=>{
 const r=fixture(),memory=readSceneMemory(JSON.stringify({seen:['ultimatum'],active:'character:mirelle',line:1,room:'library'}));
 assert.equal(memory.room,'library');assert.equal(finishScene(memory,memory.active).room,'library');
 assert.equal(nextScene(buildEncounterScenes(r),memory).id,'character:mirelle');
 r.world.access.library=false;const recovered=resumeRoom(memory.room,r);assert.equal(recovered.room,null);assert.match(recovered.reason,/no longer accessible/);
 assert.equal(readSceneMemory('{"seen":[],"room":"unknown"}').room,undefined);
});
test('context actions and bounded guidance derive from current availability, not invented contacts or authority',()=>{
 const r=fixture();assert.ok(roomActions(r,'library').some(a=>a.kind==='investigate_title'));assert.ok(!roomActions(r,'library').some(a=>a.kind==='rest'));
 const guidance=navigationGuidance(r);assert.ok(guidance.leads.length<=3);assert.ok(guidance.leads.some(l=>l.room==='library'));assert.ok(guidance.leads.some(l=>l.actor==='marius'));
 for(const a of r.actions)a.allowed=false;r.campaign.status='defeat';assert.equal(navigationGuidance(r).leads.length,0);
});
test('resource decisions have inspectable costs and existing commands; free inspection emits no command',()=>{
 const r=fixture(),before=structuredClone(r),scenes=buildEncounterScenes(r);
 const feed=scenes.find(s=>s.id==='action:feed');assert.deepEqual(feed.choices[0].action,{action:'game',choice:'feed'});assert.ok(feed.terms.some(t=>/off-chain/.test(t)));assert.deepEqual(feed.rights,[]);
 const character=scenes.find(s=>s.id==='character:marius');assert.ok(character.choices.some(ch=>ch.inspect==='action:petition_marius'));assert.deepEqual(r,before);
});
test('quiet reckoning is a real presentation transition with no new scheduler or gameplay action',()=>{
 const r=fixture();r.campaign.night=2;r.campaign.agentHistory=[{night:1,actor:'vesper',kind:'pass',execution:'local'}];
 const scenes=buildEncounterScenes(r),memory=readSceneMemory(null);const s=nextScene(scenes,memory);
 assert.equal(s.id,'reckoning:1');assert.equal(s.choices.length,0);assert.match(s.lines[0].text,/completed this reckoning/);assert.equal(nextScene(scenes,finishScene(memory,s.id)).id,'incident:2');
});
test('encounter director mounts either a scene or exploration; overlays render native free controls',async()=>{
 const dir=await mkdtemp(resolve('.local/navigation-ssr-'));try{
 const output=await build({configFile:false,logLevel:'silent',build:{ssr:true,write:false,rollupOptions:{input:{encounter:resolve('src/VampireEncounter.tsx'),inspection:resolve('src/GameInspection.tsx')},external:['react','react/jsx-runtime'],output:{entryFileNames:'[name].mjs',chunkFileNames:'[name].mjs'}}}});
 for(const chunk of output.output)if(chunk.type==='chunk')await writeFile(join(dir,chunk.fileName),chunk.code);
 const {EncounterDirector,VampireEncounter}=await import(pathToFileURL(join(dir,'encounter.mjs')).href);const {InspectionOverlay}=await import(pathToFileURL(join(dir,'inspection.mjs')).href);
 const r=fixture();let calls=0;
 let html=renderToStaticMarkup(createElement(EncounterDirector,{result:r,busy:false,request:null,onAction:async()=>{calls++;return r;},children:createElement('div',null,'EXPLORATION ONLY')}));assert.match(html,/THREE|Three/);assert.doesNotMatch(html,/EXPLORATION ONLY/);
 r.campaign.night=1;const politics=r.campaign.politics;delete r.campaign.politics;html=renderToStaticMarkup(createElement(EncounterDirector,{result:r,busy:false,request:null,onAction:async()=>r,children:createElement('div',null,'EXPLORATION ONLY')}));assert.match(html,/EXPLORATION ONLY/);assert.doesNotMatch(html,/<dialog/);r.campaign.politics=politics;
 const overlay=renderToStaticMarkup(createElement(InspectionOverlay,{kind:'Rights',result:r,debug:'',onClose(){},onScene(){},onAction(){calls++;}}));assert.match(overlay,/<dialog/);assert.match(overlay,/Close inspection/);assert.match(overlay,/<details/);
 r.campaign.night=2;r.campaign.agentHistory=[{night:1,actor:'vesper',kind:'pass',execution:'local'}];const scene=buildEncounterScenes(r).find(s=>s.type==='RECKONING');
 const htmlScene=renderToStaticMarkup(createElement(VampireEncounter,{scene,lineIndex:0,busy:false,feedback:'',onLine(){},onChoice(){calls++;},onComplete(){},onSkipReckoning(){}}));assert.match(htmlScene,/Continue to next night/);assert.equal(calls,0);
 }finally{await rm(dir,{recursive:true,force:true});}
});
