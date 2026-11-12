import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {endingConsequences,roomDevelopment} from '../src/livingCourt.ts';
import {buildEncounterScenes} from '../src/encounters.ts';

async function recorded(route){const e=JSON.parse(await readFile(`docs/evidence/pass3b-${route}.json`,'utf8'));return {campaign:e.campaign,world:e.world,events:[],pending:false,error:null};}
test('epilogues distinguish delivered work, switched allegiance and independently surviving protection without mutation',async()=>{
 const r=await recorded('switch'),before=structuredClone(r),lines=endingConsequences(r).join(' ');
 assert.match(lines,/Dorian deliver/);assert.match(lines,/Lucien’s separate protection/);assert.match(lines,/took back/);assert.doesNotMatch(lines,/Mirelle deliver/);
 assert.deepEqual(r,before);
 const other=endingConsequences(await recorded('withdrawn')).join(' ');assert.match(other,/Mirelle deliver/);assert.match(other,/Marius’s separate protection/);assert.doesNotMatch(other,/left Mirelle welcome/);
});
test('ending service is grounded in actual obligation; absent evidence never invents a bargain',async()=>{
 const r=await recorded('marius');assert.match(endingConsequences(r).join(' '),/kept the work promised/);
 r.campaign.politics.appointment='open';r.campaign.politics.serviceFulfilled=false;r.campaign.politics.library.result='open';r.world.grants=[];
 const lines=endingConsequences(r).join(' ');assert.doesNotMatch(lines,/kept the work|separate protection/);assert.match(lines,/Neither investigator/);
});
test('surviving Crypt access after revocation is not attributed to Vesper',async()=>{
 const r=await recorded('switch');r.world.access.crypt=true;
 assert.match(roomDevelopment(r,'crypt').text,/surviving right/);assert.doesNotMatch(roomDevelopment(r,'crypt').text,/Vesper still permits/);
});
test('reaction material consequences remain visible without advancing dialogue',async()=>{
 const r=await recorded('switch');const scenes=buildEncounterScenes(r).filter(s=>s.reactionLevel);
 assert.ok(scenes.length);assert.ok(scenes.every(s=>s.terms.length>=2));assert.ok(scenes.every(s=>s.choices.every(c=>!c.action)));
});
test('late decision lists do not sell an expired sanctuary route as useful title filing',async()=>{
 const r=await recorded('marius');r.campaign.status='playing';r.campaign.night=6;
 r.actions=[{kind:'investigate_title',allowed:true,cost:{majorActions:1}}];
 const decision=buildEncounterScenes(r).find(s=>s.id==='decision:6');
 assert.ok(decision);assert.ok(!decision.choices.some(c=>c.inspect==='action:investigate_title'));
});
