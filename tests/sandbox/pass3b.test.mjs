import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {courtReactions,politicalRelationship} from '../../src/reactiveCourt.ts';
import {buildEncounterScenes,finishScene,nextScene,readSceneMemory} from '../../src/encounters.ts';

const routes={
 marius:['petition_marius','feed','feed','fulfil_service','pass','pass','feed'],
 switch:['investigate_title','sanctuary_pact','feed','authorize_mirelle','withdraw_library','authorize_dorian','pass'],
 withdrawn:['investigate_title','sanctuary_pact','feed','authorize_mirelle','pass','withdraw_library','feed']
};
for(const [route,plan] of Object.entries(routes))test(`Pass 3B seven-night reactive court: ${route}`,{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','pass3b-'+id);const {worker}=await startPersistentSandbox(home);
 try{
  const scenario=await createScenario(worker,{political:true,living:true,restrictKeys:true});
  let session=await createCampaignSession(scenario,join(home,'campaign.json'),id),r=await session.request({action:'view'}),memory=readSceneMemory(null);const developments=[];
  for(const choice of plan){
   r=await session.request({action:choice==='pass'?'end_night':'game',...(choice==='pass'?{}:{choice}),campaign_id:id,revision:r.campaign.revision});assert.equal(r.error,null);
   const scenes=buildEncounterScenes(r),updates=courtReactions(r);developments.push(updates.map(u=>u.id));
   assert.equal(new Set(updates.map(u=>u.id)).size,updates.length);
   assert.ok(scenes.filter(s=>s.reactionLevel&&s.automatic).length<=1);
   const scene=nextScene(scenes,memory);if(scene)memory=finishScene(memory,scene.id);
   const count=scenario.transactions.length,before=structuredClone(r.campaign);
   session=await createCampaignSession(scenario,join(home,'campaign.json'),id);r=await session.request({action:'view'});
   assert.deepEqual(r.campaign,before);assert.equal(scenario.transactions.length,count);
   assert.notEqual(nextScene(buildEncounterScenes(r),readSceneMemory(JSON.stringify(memory)))?.id,scene?.id);
  }
  assert.equal(r.campaign.night,7);assert.equal(r.campaign.agentHistory.length,56);assert.equal(new Set(r.campaign.agentHistory.map(e=>`${e.night}:${e.actor}`)).size,56);
  assert.equal(r.campaign.ending,route==='marius'?'favoured':'unbound');
  if(route==='marius'){assert.ok(r.campaign.politics.serviceFulfilled);assert.match(politicalRelationship(r,'marius'),/Service kept/);}
  if(route==='switch'){assert.equal(r.campaign.politics.library.result,'dorian');assert.ok(r.world.access.passage);assert.match(politicalRelationship(r,'mirelle'),/withdrawn/);assert.equal((await scenario.view(scenario.actors.cassian)).access.library,false);}
  if(route==='withdrawn'){assert.equal(r.campaign.politics.library.result,'mirelle');assert.ok(r.world.access.court);assert.equal((await scenario.view(scenario.actors.cassian)).access.library,false);}
  await writeFile(`docs/evidence/pass3b-${route}.json`,JSON.stringify({scope:'Real local NEAR Sandbox',campaign:r.campaign,world:r.world,developments,transactions:scenario.transactions},null,2));
 }finally{await worker.tearDown();}
});
