import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile,mkdir} from 'node:fs/promises';
import {startPersistentSandbox,readJson,saveJson} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';

test('Pass 1: finite opportunities, actual rights, seven nights, persistence and replay protection',{timeout:360000},async()=>{
 const id=randomUUID(),home=join('.local','m3-test-'+id);let worker,scenario,session,current;
 async function start(resume=false){({worker}=await startPersistentSandbox(home));scenario=await createScenario(worker,{resume,restrictKeys:true,transactions:await readJson(join(home,'transactions.json'))??[],saveTransactions:t=>saveJson(join(home,'transactions.json'),t)});session=await createCampaignSession(scenario,join(home,'campaign.json'),id);current=await session.request({action:'view'});assert.equal(current.error,null);}
 async function request(action,extra={}){current=await session.request({action,...extra,campaign_id:id,revision:current.campaign.revision});assert.equal(current.error,null);return current;}
 try{
  await start();assert.equal(current.phase,'offered');assert.equal(current.escrowYocto,'0');assert.equal(current.transactions.length,4);
  const permissions={};for(const actor of ['vesper','seraphine','keeper','lucien']){const keys=await scenario.actors[actor].viewAccessKeys(scenario.actors[actor].accountId);permissions[actor]=keys;assert.equal(keys.keys.length,1);assert.notEqual(keys.keys[0].access_key.permission,'FullAccess');}
  await assert.rejects(()=>scenario.actors.vesper.transfer(scenario.actors.player.accountId,1n),/full access|FullAccess|InvalidAccessKey|permission/i);
  assert.deepEqual(current.world.grant_validity,[true]);
  assert.equal(current.authority.properties.find(p=>p.id==='library').owned,true);
  const originalRequest=scenario.request;
  scenario.request=async input=>{
    if(input.action!=='accept')return originalRequest(input);
    const failed=await scenario.action('player','accept_lease',{lease_id:0},'1');assert.equal(failed.failed,true);
    return scenario.snapshot('Injected underpayment: actual contract rejection');
  };
  const failed=await session.request({action:'accept',campaign_id:id,revision:current.campaign.revision});
  assert.match(failed.error,/underpayment/);assert.equal(failed.campaign.actionsLeft,3);assert.deepEqual(failed.campaign.resources,current.campaign.resources);
  current=failed;scenario.request=originalRequest;
  const old=current;await request('accept');assert.equal(current.phase,'retaliation_pending');assert.equal(current.world.access.crypt,true);
  const duplicate=await session.request({action:'accept',campaign_id:id,revision:old.campaign.revision});assert.match(duplicate.error,/stale/);assert.equal(duplicate.escrowYocto,'20000000000000000000000');
  // Permission really changes after the player's inspection, without changing
  // the local revision. The runner must consult the contract again.
  const beforeChange=structuredClone(current.campaign);
  await scenario.action('vesper','revoke_grant',{grant_id:0});
  const blocked=await session.request({action:'game',choice:'rest',campaign_id:id,revision:current.campaign.revision});
  assert.match(blocked.error,/revoked/);assert.deepEqual(blocked.campaign,beforeChange);
  const originalAccess=scenario.hasAccess;
  scenario.hasAccess=async()=>false;
  const changedDuringValidation=await session.request({action:'game',choice:'investigate_title',campaign_id:id,revision:current.campaign.revision});
  assert.match(changedDuringValidation.error,/changed before execution/);assert.deepEqual(changedDuringValidation.campaign,beforeChange);
  scenario.hasAccess=originalAccess;
  const navigationCount=scenario.transactions.length;
  await request('enter',{property_id:'library'});assert.equal(scenario.transactions.length,navigationCount);assert.deepEqual(current.campaign,beforeChange);
  const impersonation=await session.request({action:'game',choice:'feed',actor:'vesper',campaign_id:id,revision:current.campaign.revision});assert.match(impersonation.error,/Invalid action request/);
  const plan=[['learn_seraphine','discuss_exchange'],['feed','investigate_title','investigate_expiry'],['feed','investigate_bloodline','conceal'],['feed','feed','conceal'],['feed'],['feed'],['feed']];
  for(let night=0;night<7;night++){
   for(const choice of plan[night])await request('game',{choice});
   const before=current;
   if(night===1){const original=scenario.call;let once=true;scenario.call=async(...args)=>{const result=await original(...args);if(once&&args[1]==='advance_night'){once=false;throw new Error('Injected lost response after confirmed dawn');}return result;};
    const lost=await session.request({action:'end_night',campaign_id:id,revision:current.campaign.revision});assert.match(lost.error,/Injected/);current=await session.request({action:'view'});assert.equal(current.error,null);
   }else await request('end_night');
   assert.equal(current.campaign.night,night+1);assert.equal(current.world.night,night+1);
   const replay=await session.request({action:'end_night',campaign_id:id,revision:before.campaign.revision});assert.match(replay.error,/stale/);assert.equal(replay.world.night,night+1);
   if(night===0){assert.equal(current.world.access.crypt,false);assert.equal(current.world.access.lounge,true);assert.equal(current.world.access.library,true);assert.equal(current.escrowYocto,'0');const saved=structuredClone(current.campaign);await worker.tearDown();await start(true);assert.deepEqual(current.campaign,saved);}
   if(night===2){assert.equal(current.world.access.lounge,false);const noLease=await session.request({action:'game',choice:'learn_seraphine',campaign_id:id,revision:current.campaign.revision});assert.match(noLease.error,/expired/);assert.deepEqual(noLease.campaign,current.campaign);}
  }
  assert.equal(current.campaign.status,'concluded');assert.equal(scenario.transactions.filter(t=>t.action==='advance_night').length,7);
  assert.equal(current.campaign.agentHistory.length,21);
  assert.equal(new Set(current.campaign.agentHistory.map(e=>`${e.night}:${e.actor}`)).size,21);
  assert.equal(current.campaign.discoveries.length,5);assert.equal(current.campaign.seats,1);
  assert.ok(!('coin' in current.campaign.resources));assert.ok(!('influence' in current.campaign.resources));
  const finished=await session.request({action:'end_night',campaign_id:id,revision:current.campaign.revision});assert.match(finished.error,/ended/);
  await mkdir('docs/evidence',{recursive:true});await writeFile('docs/evidence/pass1-sandbox.json',JSON.stringify({status:'PASS',finishedAt:new Date().toISOString(),campaign:current.campaign,permissions,transactions:scenario.transactions},null,2)+'\n');
 }finally{await worker?.tearDown();}
});
