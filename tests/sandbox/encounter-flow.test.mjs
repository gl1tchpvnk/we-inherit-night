import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {buildEncounterScenes,resolveScene,markSceneRead,readSceneMemory,topicStatus,finishScene} from '../../src/encounters.ts';

test('seven-night scene commitments preserve actions, read versions, withdrawal and final-counter settlement',{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','flow-sandbox-'+id),{worker}=await startPersistentSandbox(home);
 try{
  const scenario=await createScenario(worker,{political:true,living:true,dangerous:true,restrictKeys:true});
  let session=await createCampaignSession(scenario,join(home,'campaign.json'),id),r=await session.request({action:'view'}),memory=readSceneMemory(null);
  const scenes=()=>buildEncounterScenes(r),current=id=>resolveScene(scenes(),id),nights=[];
  memory=markSceneRead(memory,current('personal:0:marius'));
  for(const kind of ['petition_marius','feed','feed','authorize_mirelle','wait','withdraw_library','final_counter']){
   const old=r.campaign,source=current(kind==='wait'?`decision:${old.night}`:`action:${kind}`);
   const choice=source.choices.find(c=>kind==='wait'?c.action?.action==='end_night':c.action?.choice===kind);
   assert.ok(choice,`${kind}: live commitment is reachable`);
   const before=structuredClone(r.campaign),txs=scenario.transactions.length;
   memory=markSceneRead(memory,source);assert.deepEqual(r.campaign,before);assert.equal(scenario.transactions.length,txs);
   r=await session.request({...choice.action,campaign_id:id,revision:old.revision});assert.equal(r.error,null);assert.equal(r.pending,false);
   assert.equal(r.campaign.night,old.night+1);assert.equal(r.campaign.agentHistory.length,r.campaign.night*8);
   memory=finishScene(memory,source.id);
   if(kind==='petition_marius'){
    assert.ok(r.world.access.court);
    assert.ok(!current('action:petition_marius').choices.some(c=>c.action));
    assert.equal(topicStatus(current('personal:1:marius'),memory),'Explored');
   }
   if(kind==='feed'){
    assert.equal(r.campaign.resources.blood,Math.min(12,old.resources.blood+4)-1);
    const after=structuredClone(r.campaign),count=scenario.transactions.length;
    const duplicate=await session.request({...choice.action,campaign_id:id,revision:old.revision});assert.ok(duplicate.error);
    r=await session.request({action:'view'});assert.deepEqual(r.campaign,after);assert.equal(scenario.transactions.length,count);
   }
   if(kind==='authorize_mirelle'){
    assert.equal(r.campaign.politics.library.result,'open');
    assert.ok(!current('action:authorize_dorian').choices.some(c=>c.action));
   }
   if(kind==='wait')assert.equal(r.campaign.politics.library.result,'mirelle');
   if(kind==='withdraw_library'){
    assert.equal((await scenario.view(scenario.actors.cassian)).access.library,false);assert.equal(r.world.access.court,true);
    assert.equal(current('decision:6').id,'final-demand');
   }
   const transactionCount=scenario.transactions.length,snapshot=structuredClone(r.campaign);
   session=await createCampaignSession(scenario,join(home,'campaign.json'),id);r=await session.request({action:'view'});memory=readSceneMemory(JSON.stringify(memory));
   assert.deepEqual(r.campaign,snapshot);assert.equal(scenario.transactions.length,transactionCount);
   assert.equal(topicStatus(current(`personal:${r.campaign.night}:marius`),memory),'Explored');
   nights.push({night:r.campaign.night,choice:kind,blood:r.campaign.resources.blood});
  }
  assert.equal(r.campaign.ending,'favoured');assert.equal(r.campaign.politics.finalCourt.result,'accepted');
  assert.ok(scenes().every(s=>s.choices.every(c=>!c.action)));
  assert.equal(new Set(r.campaign.agentHistory.map(e=>`${e.night}:${e.actor}`)).size,56);
  await writeFile('.local/encounter-flow-sandbox.json',JSON.stringify({scope:'real local NEAR Sandbox; automated scene/state traversal, not browser acceptance',nights,ending:r.campaign.ending,finalCourt:r.campaign.politics.finalCourt,transactions:scenario.transactions},null,2));
 }finally{await worker.tearDown();}
});
