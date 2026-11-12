import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox,readJson,saveJson} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {createDecisionProvider} from '../../src/decision-provider.ts';
import {buildEncounterScenes} from '../../src/encounters.ts';

// Mocked HTTP responses exercise the REAL provider adapter. They are not live LLM evidence.
for(const choice of ['accept','reject'])test(`Pass 2B: provider-adapter negotiation ${choice} with real NEAR`,{timeout:240000},async()=>{
 const id=randomUUID(),home=join('.local','pass2b-'+id);let worker,scenario,session,current,providerCalls=0;
 const provider=createDecisionProvider({NIGHT_LLM_ENABLED:'1',OPENAI_API_KEY:'mock-only',NIGHT_LLM_MODEL:'mock-model'},async(_url,options)=>{
  providerCalls++;const o=JSON.parse(JSON.parse(options.body).input).observation;
  const proposal=o.available.find(p=>p.kind==='offer')??o.available.find(p=>p.kind==='revoke')??o.available.find(p=>p.kind==='collect')??o.available.find(p=>p.kind==='pass');
  proposal.dialogue=proposal.kind==='offer'?'The Lounge is mine to offer. These terms purchase entry, not allegiance.':'';
  return new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify(proposal)}]}]}));
 });
 async function start(resume=false){
  ({worker}=await startPersistentSandbox(home));scenario=await createScenario(worker,{resume,restrictKeys:true,transactions:await readJson(join(home,'transactions.json'))??[],saveTransactions:t=>saveJson(join(home,'transactions.json'),t)});
  session=await createCampaignSession(scenario,join(home,'campaign.json'),id,undefined,provider);current=await session.request({action:'view'});assert.equal(current.error,null);
 }
 async function request(action,extra={}){current=await session.request({action,campaign_id:id,revision:current.campaign.revision,...extra});assert.equal(current.error,null);return current;}
 try{
  await start();await request('game',{choice:'investigate_title'});await request('end_night');
  const agreement=current.campaign.agreements[0];assert.equal(agreement.status,'pending');assert.equal(agreement.source,'llm');assert.equal(providerCalls,3);
  assert.equal(current.world.properties.find(p=>p.id==='lounge').owner,scenario.actors.seraphine.accountId);
  const before=structuredClone(current.campaign),txCount=scenario.transactions.length;
  const response=buildEncounterScenes(current).find(s=>s.id==='lease:0').choices.find(c=>c.id===choice).action;
  await worker.tearDown();await start(true);assert.deepEqual(current.campaign,before);assert.equal(providerCalls,3);
  if(choice==='accept'){
   scenario.actors.intruder=worker.rootAccount;
   const denied=await scenario.action('intruder','accept_lease',{lease_id:0},agreement.priceYocto);assert.equal(denied.failed,true);
   const original=scenario.request;scenario.request=async input=>{const result=await original(input);if(input.action==='accept'&&!result.error)throw new Error('Injected lost accepted agreement response');return result;};
   current=await session.request({...response,campaign_id:id,revision:current.campaign.revision});assert.match(current.error,/Injected/);
   await worker.tearDown();await start(true);assert.equal(current.campaign.agreements[0].status,'accepted');assert.equal(current.world.access.lounge,true);assert.equal(current.world.access.library,true);
   assert.equal(scenario.transactions.filter(t=>t.action==='accept_lease'&&t.success).length,1);assert.equal(providerCalls,3);
   const duplicate=await session.request({action:'agreement_accept',agreement_id:agreement.id,campaign_id:id,revision:current.campaign.revision});assert.match(duplicate.error,/resolved/);
   await request('end_night');assert.equal(current.world.access.crypt,false);assert.equal(current.world.access.library,true);assert.equal(current.escrowYocto,'0');
  }else{
   await request(response.action,{agreement_id:response.agreement_id});assert.equal(scenario.transactions.length,txCount);assert.equal(current.campaign.agreements[0].status,'rejected');assert.deepEqual(current.campaign.npcs,before.npcs);
   await request('end_night');assert.equal(current.world.access.crypt,true);assert.equal(current.world.access.lounge,false);assert.equal(current.campaign.agreements.length,1);
  }
  const final=structuredClone(current.campaign);await worker.tearDown();await start(true);assert.deepEqual(current.campaign,final);
  await writeFile(`docs/evidence/pass2b-${choice}.json`,JSON.stringify({status:'PASS',provider:'mocked Responses HTTP; no live model call',finishedAt:new Date().toISOString(),campaign:current.campaign,transactions:scenario.transactions},null,2)+'\n');
 }finally{await worker?.tearDown();}
});
