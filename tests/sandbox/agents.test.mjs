import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox,readJson,saveJson} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';

test('Pass 2A: actor observations and lost finalized NPC response recover once',{timeout:240000},async()=>{
 const id=randomUUID(),home=join('.local','pass2a-'+id);let worker,scenario,session,current;
 async function start(resume=false){
  ({worker}=await startPersistentSandbox(home));
  scenario=await createScenario(worker,{resume,restrictKeys:true,transactions:await readJson(join(home,'transactions.json'))??[],saveTransactions:t=>saveJson(join(home,'transactions.json'),t)});
  session=await createCampaignSession(scenario,join(home,'campaign.json'),id,observation=>{
   assert.equal(observation.account,scenario.actors[observation.actor].accountId);
   assert.equal(observation.ownAccess.library,false);assert.ok(!('resources' in observation));
   return {kind:'grant_access',actor:'player'}; // Invalid decision must fall back without expanded signing.
  });
 }
 try{
  await start();current=await session.request({action:'view'});
  current=await session.request({action:'accept',campaign_id:id,revision:current.campaign.revision});assert.equal(current.error,null);
  const original=scenario.request;scenario.request=async request=>{const result=await original(request);if(request.action==='continue'&&!result.error)throw new Error('Injected lost finalized NPC response');return result;};
  current=await session.request({action:'end_night',campaign_id:id,revision:current.campaign.revision});assert.match(current.error,/Injected/);
  assert.equal(current.world.grants[0].revoked,true);assert.equal(current.campaign.agentHistory.length,0);
  await worker.tearDown();await start(true);current=await session.request({action:'view'});assert.equal(current.error,null);
  assert.equal(current.campaign.agentHistory.length,3);assert.equal(current.campaign.npcs.vesper.relationships.player,-2);
  assert.equal(current.world.night,1);assert.equal(current.world.access.library,true);assert.equal(current.escrowYocto,'0');
  for(const action of ['revoke_grant','claim_rent','advance_night'])assert.equal(scenario.transactions.filter(t=>t.action===action).length,1);
  assert.ok(current.campaign.agentHistory.every(e=>e.source==='fallback'));
  await writeFile('docs/evidence/pass2a-sandbox.json',JSON.stringify({status:'PASS',finishedAt:new Date().toISOString(),history:current.campaign.agentHistory,transactions:scenario.transactions},null,2)+'\n');
 }finally{await worker?.tearDown();}
});
