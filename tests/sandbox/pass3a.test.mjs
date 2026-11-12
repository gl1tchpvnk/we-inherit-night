import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {buildEncounterScenes} from '../../src/encounters.ts';
for(const finalChoice of ['finish','stop'])test(`Pass 3A: Night Seven ${finalChoice} changes research and patron outcome`,{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','pass3a-final-'+id);const {worker}=await startPersistentSandbox(home);
 try{
  const scenario=await createScenario(worker,{political:true,living:true,restrictKeys:true});
  const session=await createCampaignSession(scenario,join(home,'campaign.json'),id);let r=await session.request({action:'view'});
  async function move(choice){r=await session.request({action:choice==='pass'?'end_night':'game',...(choice!=='pass'?{choice}:{}),campaign_id:id,revision:r.campaign.revision});assert.equal(r.error,null);}
  for(const choice of ['investigate_title','sanctuary_pact','feed','pass','feed','authorize_mirelle'])await move(choice);
  assert.equal(r.campaign.night,6);assert.equal(r.campaign.politics.library.result,'open');
  const scenes=buildEncounterScenes(r);assert.ok(scenes.find(s=>s.id==='decision:6').choices.some(c=>c.inspect==='action:withdraw_library'));
  await move(finalChoice==='finish'?'pass':'withdraw_library');
  assert.equal(r.campaign.ending,'unbound');assert.equal(r.campaign.night,7);assert.equal(r.campaign.agentHistory.length,56);
  assert.equal(r.campaign.politics.library.result,finalChoice==='finish'?'mirelle':'open');
  assert.equal(r.world.access.court,finalChoice==='finish');
  assert.equal((await scenario.view(scenario.actors.cassian)).access.library,finalChoice==='finish');
  assert.equal(r.world.access.sanctuary,true);assert.equal(r.world.access.library,true);
  assert.ok(scenario.transactions.every(t=>!t.success||t.executionStatus==='FINAL'));
  const snapshot=structuredClone(r.campaign),count=scenario.transactions.length;
  r=await session.request({action:'view'});assert.deepEqual(r.campaign,snapshot);assert.equal(scenario.transactions.length,count);
  await writeFile(`docs/evidence/pass3a-final-${finalChoice}.json`,JSON.stringify({scope:'Real local NEAR Sandbox; no public deployment',campaign:r.campaign,world:r.world,transactions:scenario.transactions},null,2));
 }finally{await worker.tearDown();}
});
