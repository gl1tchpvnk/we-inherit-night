import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {Store} from '../../scripts/testnet/store.mjs';
import {campaignLifecycle,archivedSnapshot} from '../../scripts/testnet/lifecycle.mjs';
import {canReplayCampaign} from '../../src/entry.ts';

test('seven-night patron route preserves paid NPC consequences and gates finale replay until recovered reclamation',{timeout:180000},async()=>{
 const id='refinement-seven',home=join('.local','refinement-seven-'+randomUUID()),{worker}=await startPersistentSandbox(home);
 let store=new Store(join(home,'game.sqlite'));
 try{
  const scenario=await createScenario(worker,{campaignId:id,political:true,living:true,dangerous:true,prepaid:true,restrictKeys:true,lifecycle:true});
  store.register({campaignId:id});store.allocate();
  let session=await createCampaignSession(scenario,id,id,undefined,null,store),r=await session.request({action:'view'});const nights=[];
  for(const choice of ['petition_marius','feed','feed','authorize_mirelle','pass','withdraw_library','final_counter']){
   const prior=r.campaign;
   r=await session.request({action:choice==='pass'?'end_night':'game',...(choice==='pass'?{}:{choice}),campaign_id:id,revision:r.campaign.revision});
   assert.equal(r.error,null);assert.equal(r.pending,false);assert.equal(r.campaign.night,prior.night+1);assert.equal(r.campaign.resources.exposure,undefined);
   nights.push({night:r.campaign.night,choice,blood:r.campaign.resources.blood});
   session=await createCampaignSession(scenario,id,id,undefined,null,store);const restored=await session.request({action:'view'});assert.deepEqual(restored.campaign,r.campaign);r=restored;
  }
  assert.equal(r.campaign.ending,'favoured');assert.equal(r.campaign.politics.finalCourt.result,'accepted');assert.equal(r.campaign.agentHistory.length,56);
  const passage=r.world.leases.find(l=>l.property_id==='passage');assert(passage.settled);assert.equal(passage.escrow_yocto,'0');
  assert.equal(canReplayCampaign(r,true),false);
  const call=scenario.call;let interrupted=false;
  scenario.call=async(...args)=>{const tx=await call(...args);if(args[1]==='reclaim_campaign'&&!interrupted){interrupted=true;throw new Error('Lost reclaim response');}return tx;};
  await assert.rejects(campaignLifecycle(store,{},null).archive(scenario,r),/Lost reclaim/);
  assert.equal(canReplayCampaign(archivedSnapshot(store.archive(id)),true),false);
  const count=scenario.transactions.length;store.close();store=new Store(join(home,'game.sqlite'));
  const complete=await campaignLifecycle(store,{},null).archive(scenario,r);assert.equal(scenario.transactions.length,count);assert.equal(complete.closure,undefined);assert.equal(complete.archiveComplete,true);assert.equal(canReplayCampaign(complete,true),true);
  const resources=await scenario.resourceView();assert.equal(resources.status,'reclaimed');assert.equal(resources.active,0);assert.equal(resources.liabilities,'0');assert.deepEqual(complete.campaign,r.campaign);
  await writeFile('.local/refinement-seven-result.json',JSON.stringify({scope:'real local Sandbox; no public transactions',status:'PASS',nights,ending:r.campaign.ending,finalDemand:r.campaign.politics.finalCourt,passage,resources,archiveComplete:complete.archiveComplete,closure:complete.closure??null,recoveredWithoutDuplicate:true},null,2));
 }finally{store.close();await worker.tearDown();}
});
