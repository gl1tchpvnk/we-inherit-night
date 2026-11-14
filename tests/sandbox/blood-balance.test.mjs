import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
const routes={
 sanctuary:['investigate_title','sanctuary_pact','feed','feed','feed','feed','feed'],
 marius:['petition_marius','feed','feed','fulfil_service','feed','feed','final_accept'],
 lucien:['feed','broker_passage','feed','authorize_dorian','feed','feed','feed'],
 combined:['petition_marius','investigate_title','sanctuary_pact','authorize_mirelle','feed','feed','final_refuse']
};
for(const [route,plan] of Object.entries(routes))test(`one-Blood balance: ${route} survives with planned feeding`,{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','blood-balance-'+id),file=join(home,'campaign.json'),{worker}=await startPersistentSandbox(home);
 try{
  const scenario=await createScenario(worker,{political:true,living:true,dangerous:true,restrictKeys:true});let session=await createCampaignSession(scenario,file,id),r=await session.request({action:'view'});
  assert.equal(r.campaign.resources.blood,8);
  for(const choice of plan){
   const beforeBlood=r.campaign.resources.blood;
   if(choice.startsWith('authorize')){
    const original=scenario.action;
    scenario.action=async(actor,method,...args)=>actor==='player'&&method==='grant_access'?{succeeded:false,receiptFailures:['injected failure before submission']}:original(actor,method,...args);
    r=await session.request({action:'game',choice,campaign_id:id,revision:r.campaign.revision});assert.match(r.error,/transaction failed/);assert.equal(r.campaign.resources.blood,beforeBlood);assert.equal(r.campaign.actionsLeft,1);
    scenario.action=async(actor,method,...args)=>{const result=await original(actor,method,...args);if(actor==='player'&&method==='grant_access')throw new Error('Injected lost successful response');return result;};
    r=await session.request({action:'game',choice,campaign_id:id,revision:r.campaign.revision});assert.match(r.error,/lost successful response/);assert.equal(r.pending,true);
    scenario.action=original;session=await createCampaignSession(scenario,file,id);r=await session.request({action:'view'});assert.equal(r.error,null);assert.equal(r.campaign.resources.blood,beforeBlood-2,'one commitment Blood plus one dawn upkeep');
   }else{
    const revision=r.campaign.revision;r=await session.request({action:'game',choice,campaign_id:id,revision});assert.equal(r.error,null);
    const replay=await session.request({action:'game',choice,campaign_id:id,revision});assert.match(replay.error,/stale/);assert.deepEqual(replay.campaign,r.campaign);
    if(['petition_marius','broker_passage'].includes(choice))assert.equal(r.campaign.resources.blood,beforeBlood-2);
    if(choice==='sanctuary_pact')assert.equal(r.campaign.resources.blood,beforeBlood-1,'sanctuary remains zero Blood plus dawn');
   }
   const snapshot=structuredClone(r.campaign),count=scenario.transactions.length;
   session=await createCampaignSession(scenario,file,id);r=await session.request({action:'view'});assert.deepEqual(r.campaign,snapshot);assert.equal(scenario.transactions.length,count);
  }
  assert.equal(r.campaign.night,7);assert.equal(r.campaign.status,'concluded');assert(r.campaign.resources.blood>0);
  assert.equal(r.campaign.ending,['sanctuary','combined'].includes(route)?'unbound':'favoured');
  if(route==='combined'){assert.equal(r.world.access.sanctuary,true);assert.equal(r.world.access.court,false);}
  console.log(`${route}: final Blood ${r.campaign.resources.blood}, ${r.campaign.ending}`);
 }finally{await worker.tearDown();}
});
