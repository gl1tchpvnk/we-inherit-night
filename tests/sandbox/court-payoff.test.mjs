import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {completedInvestigator} from '../../src/courtPayoff.ts';
import {buildEncounterScenes} from '../../src/encounters.ts';

for(const sheltered of [true,false])test(`Dorian public-shelter policy and research payoff: ${sheltered?'petition':'restraint'}`,{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','payoff-sandbox-'+id),{worker}=await startPersistentSandbox(home);
 try{
  const scenario=await createScenario(worker,{political:true,living:true,restrictKeys:true});
  let session=await createCampaignSession(scenario,join(home,'campaign.json'),id),r=await session.request({action:'view'});
  const plan=sheltered?['investigate_title','sanctuary_pact','feed','authorize_mirelle']:['feed','broker_passage','feed','authorize_mirelle'];
  for(const choice of plan){r=await session.request({action:'game',choice,campaign_id:id,revision:r.campaign.revision});assert.equal(r.error,null);}
  const decision=r.campaign.agentHistory.find(e=>e.actor==='dorian'&&e.night===3);
  assert.equal(decision.kind,sheltered?'archive_challenge':'pass');
  assert.equal(r.campaign.politics.library.challenged,sheltered);
  const count=scenario.transactions.length,before=structuredClone(r.campaign);
  session=await createCampaignSession(scenario,join(home,'campaign.json'),id);r=await session.request({action:'view'});
  assert.deepEqual(r.campaign,before);assert.equal(scenario.transactions.length,count);
  r=await session.request({action:'end_night',campaign_id:id,revision:r.campaign.revision});assert.equal(r.error,null);
  assert.equal(completedInvestigator(r),'mirelle');
  assert.ok(buildEncounterScenes(r).find(s=>s.id==='finding:mirelle'));
  assert.equal(new Set(r.campaign.agentHistory.map(e=>`${e.actor}:${e.night}`)).size,r.campaign.agentHistory.length);
 }finally{await worker.tearDown();}
});
