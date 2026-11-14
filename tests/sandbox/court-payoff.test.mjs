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

test('risky Marius-only investigator switch remains possible but is not recommended and loses shelter before research',{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','switch-risk-'+id),{worker}=await startPersistentSandbox(home);
 try{
  const scenario=await createScenario(worker,{political:true,living:true,restrictKeys:true});
  const session=await createCampaignSession(scenario,join(home,'campaign.json'),id);let r=await session.request({action:'view'});
  for(const choice of ['petition_marius','feed','feed','authorize_mirelle','withdraw_library','authorize_dorian']){
   if(choice==='withdraw_library'){assert.equal(r.campaign.politics.serviceFulfilled,false);assert.equal(r.world.access.court,true);assert.equal(r.campaign.agentHistory.find(e=>e.actor==='dorian'&&e.night===3).kind,'pass');assert.match(buildEncounterScenes(r).find(s=>s.id==='character:dorian').terms.join(' '),/before Dorian can finish/);}
   r=await session.request({action:'game',choice,campaign_id:id,revision:r.campaign.revision});assert.equal(r.error,null);
  }
  assert.equal(r.world.access.court,false);assert.equal(r.campaign.status,'defeat');assert.equal(r.campaign.politics.library.result,'open');assert.equal(r.campaign.politics.library.chosen,'dorian');
  assert(r.campaign.agentHistory.some(e=>e.actor==='marius'&&e.kind==='dismiss'&&e.execution==='confirmed'));
 }finally{await worker.tearDown();}
});
