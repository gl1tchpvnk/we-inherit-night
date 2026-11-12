import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox,readJson,saveJson} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';

for(const route of ['mirelle','dorian','withdraw'])test(`Pass 2H real Sandbox: ${route}`,{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','pass2h-'+id);let worker,scenario,session,current;
 async function start(resume=false){
  ({worker}=await startPersistentSandbox(home));
  scenario=await createScenario(worker,{resume,political:true,living:true,restrictKeys:true,transactions:await readJson(join(home,'transactions.json'))??[],saveTransactions:t=>saveJson(join(home,'transactions.json'),t)});
  session=await createCampaignSession(scenario,join(home,'campaign.json'),id);
  current=await session.request({action:'view'});assert.equal(current.error,null);
 }
 async function request(action,extra={}){current=await session.request({action,campaign_id:id,revision:current.campaign.revision,...extra});assert.equal(current.error,null);return current;}
 const game=choice=>request('game',{choice});
 try{
  await start();assert.equal(current.world.access.lounge,true);assert.equal(current.campaign.agentHistory.length,0);
  if(route==='dorian'){await game('feed');await game('broker_passage');await request('end_night');}
  else{await game('investigate_title');await game('sanctuary_pact');await game('feed');}
  assert.equal(current.world.access.crypt,false);assert.equal(current.world.access.library,true);
  const actor=route==='mirelle'?'mirelle':'dorian',helper=actor==='mirelle'?'cassian':'lucien';
  await game('authorize_'+actor);
  const root=current.world.grants.find(g=>g.property_id==='library'&&g.grantor===scenario.actors.player.accountId&&g.can_delegate);
  assert.equal((await scenario.view(scenario.actors[helper])).access.library,true);
  const invalid=await scenario.action('vesper','revoke_grant',{grant_id:root.id});assert.equal(invalid.succeeded,false);
  if(route==='withdraw')await game('withdraw_library');else await request('end_night');
  if(route!=='withdraw'){
   assert.equal(current.campaign.politics.library.result,actor);
   await game('withdraw_library');
  }else assert.equal(current.campaign.politics.library.result,'open');
  assert.equal((await scenario.view(scenario.actors[helper])).access.library,false);
  assert.equal((await scenario.view(scenario.actors[actor])).access.library,false);
  assert.equal(current.world.access.library,true);
  while(current.campaign.status==='playing')await request('end_night');
  assert.equal(current.campaign.ending,route==='dorian'?'favoured':'unbound');
  if(route==='dorian')assert.match(current.campaign.reason,/Lucien/);
  else assert.ok(scenario.transactions.some(t=>t.action==='accept_lease'&&t.property==='sanctuary'&&t.success&&t.executionStatus==='FINAL'));
  const copy=structuredClone(current.campaign),count=scenario.transactions.length;
  await worker.tearDown();await start(true);assert.deepEqual(current.campaign,copy);assert.equal(scenario.transactions.length,count);
  assert.equal(new Set(copy.agentHistory.map(e=>e.night+':'+e.actor)).size,copy.agentHistory.length);
  await writeFile(`docs/evidence/pass2h-${route}.json`,JSON.stringify({status:'PASS',scope:'real local NEAR Sandbox; deterministic agents; no new NPC-funded purchases',campaign:current.campaign,world:current.world,transactions:scenario.transactions},null,2)+'\n');
 }finally{await worker?.tearDown();}
});
