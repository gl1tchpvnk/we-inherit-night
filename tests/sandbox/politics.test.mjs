import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox,readJson,saveJson} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {buildEncounterScenes,finishScene,readSceneMemory} from '../../src/encounters.ts';

for(const route of ['unbound','favoured','failure','passage'])test(`Pass 2C real Sandbox: ${route}`,{timeout:360000},async()=>{
 const id=randomUUID(),home=join('.local','pass2c-'+id);let worker,scenario,session,current;
 async function start(resume=false){
  ({worker}=await startPersistentSandbox(home));
  scenario=await createScenario(worker,{resume,political:true,restrictKeys:true,transactions:await readJson(join(home,'transactions.json'))??[],saveTransactions:t=>saveJson(join(home,'transactions.json'),t)});
  session=await createCampaignSession(scenario,join(home,'campaign.json'),id,undefined,async()=>{throw new Error('LLM forbidden in 2C');});
  current=await session.request({action:'view'});assert.equal(current.error,null);
 }
 async function request(action,extra={}){current=await session.request({action,campaign_id:id,revision:current.campaign.revision,...extra});assert.equal(current.error,null);return current;}
 async function game(choice){return request('game',{choice});}
 try{
  await start();assert.equal(current.campaign.actionsLeft,1);
  assert.ok(buildEncounterScenes(current).some(s=>s.id==='ultimatum'));
  const before=structuredClone(current.campaign);await request('enter',{property_id:'library'});assert.deepEqual(current.campaign,before);
  assert.equal(current.world.properties.find(p=>p.id==='court').owner,scenario.actors.marius.accountId);
  assert.equal(current.world.properties.find(p=>p.id==='passage').owner,scenario.actors.lucien.accountId);
  if(route==='unbound'){
   await game('investigate_title');assert.equal(current.campaign.night,1);
   const original=scenario.action;
   scenario.action=async(actor,method,args,deposit)=>{const result=await original(actor,method,args,deposit);if(actor==='player'&&method==='accept_lease'&&args.lease_id===1&&result.succeeded)throw new Error('Lost committed sanctuary response');return result;};
   const scene=buildEncounterScenes(current).find(s=>s.id==='action:sanctuary_pact');
   assert.match(scene.terms.join(' '),/0.02 Sandbox NEAR/);
   const choice=scene.choices.find(c=>c.id==='commit');
   current=await session.request({...choice.action,campaign_id:id,revision:current.campaign.revision});assert.match(current.error,/Lost committed/);
   await worker.tearDown();await start(true);assert.equal(current.campaign.night,2);assert.equal(current.world.access.sanctuary,true);
   assert.equal(scenario.transactions.filter(t=>t.action==='accept_lease'&&t.success).length,1);
   assert.equal(scenario.transactions.find(t=>t.action==='accept_lease'&&t.success).property,'sanctuary');
   await game('feed');assert.equal(current.world.access.crypt,false);assert.equal(current.world.access.library,true);assert.equal(current.world.access.sanctuary,true);
   const denied=await scenario.action('vesper','revoke_grant',{grant_id:2});assert.equal(denied.failed,true); // Marius -> Sabine root.
   assert.equal((await scenario.view()).grant_validity[2],true);
   const forbidden=await scenario.action('player','enter_room',{property_id:'crypt'});assert.equal(forbidden.failed,true);
  }else if(route==='favoured'){
   await game('petition_marius');assert.equal(current.world.access.court,true);
   await game('feed');await request('end_night');assert.equal(current.world.access.crypt,false);assert.equal(current.world.access.court,true);
   await game('fulfil_service');
  }else if(route==='passage'){
   await game('investigate_title');await game('broker_passage');
   assert.equal(current.world.access.passage,true);
   assert.ok(current.world.grants.some(g=>g.property_id==='passage'&&g.grantor===scenario.actors.lucien.accountId&&g.expiry_night===5));
  }
  while(current.campaign.status==='playing')await request('end_night');
  assert.equal(current.campaign.ending,route==='passage'?'failure':route);assert.equal(current.campaign.night,route==='failure'?3:route==='passage'?5:7);
  assert.equal(current.world.access.library,true);
  const conclusion=buildEncounterScenes(current).find(s=>s.type==='CAMPAIGN CONCLUSION');
  assert.ok(conclusion.terms.includes(current.campaign.reason));
  const presentation=finishScene(readSceneMemory(null),conclusion.id);
  assert.ok(presentation.seen.includes(conclusion.id));
  assert.equal(current.campaign.agentHistory.length,current.campaign.night*8);
  assert.equal(new Set(current.campaign.agentHistory.map(e=>`${e.actor}:${e.night}`)).size,current.campaign.agentHistory.length);
  const final=structuredClone(current.campaign),count=scenario.transactions.length;
  await worker.tearDown();await start(true);assert.deepEqual(current.campaign,final);assert.equal(scenario.transactions.length,count);
  await writeFile(`docs/evidence/pass2c-${route}.json`,JSON.stringify({status:'PASS',decisions:'autonomous deterministic policies; no LLM calls',finishedAt:new Date().toISOString(),campaign:current.campaign,world:current.world,transactions:scenario.transactions},null,2)+'\n');
 }finally{await worker?.tearDown();}
});
