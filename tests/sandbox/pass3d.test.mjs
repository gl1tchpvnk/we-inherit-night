import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import {startPersistentSandbox} from '../../scripts/sandbox/persistence.mjs';
import {createScenario} from '../../scripts/sandbox/scenario.mjs';
import {createCampaignSession} from '../../scripts/sandbox/campaign.mjs';
import {buildEncounterScenes} from '../../src/encounters.ts';
import {cassianPassage} from '../../src/finalCourt.ts';
const routes={
 counter:['petition_marius','feed','feed','authorize_mirelle','pass','withdraw_library','final_counter'],
 accept:['petition_marius','feed','feed','authorize_mirelle','pass','withdraw_library','final_accept'],
 refuse:['petition_marius','feed','feed','authorize_mirelle','pass','withdraw_library','final_refuse'],
 rejected:['petition_marius','feed','feed','authorize_dorian','fulfil_service','feed','final_counter'],
 alternate:['investigate_title','sanctuary_pact','feed','authorize_mirelle','withdraw_library','authorize_dorian','pass']
};
for(const [route,plan] of Object.entries(routes))test(`Pass 3D authoritative seven-night route: ${route}`,{timeout:180000},async()=>{
 const id=randomUUID(),home=join('.local','pass3d-'+id),{worker}=await startPersistentSandbox(home);
 try{
  const scenario=await createScenario(worker,{political:true,living:true,dangerous:true,restrictKeys:true});
  const path=join(home,'campaign.json');let session=await createCampaignSession(scenario,path,id),r=await session.request({action:'view'});const nights=[];
  const lucienBefore=(await scenario.actors.lucien.balance()).available;
  assert.equal((await scenario.view(scenario.actors.cassian)).passage_budget.remaining,'10000000000000000000000');
  // Inject lost RPC response after a real accepted lease, then recover the persisted intent.
  const action=scenario.action;let interrupted=false;
  scenario.action=async(...args)=>{const tx=await action(...args);if(route==='counter'&&args[1]==='accept_funded_passage'&&!interrupted&&tx.succeeded){interrupted=true;throw new Error('Injected lost committed payment response');}return tx;};
  for(const choice of plan){
   nights.push({night:r.campaign.night+1,choice,access:r.world.access,resources:r.campaign.resources,available:r.actions.filter(a=>a.allowed).map(a=>a.kind)});
   if(r.campaign.night===6&&route!=='alternate'){const scenes=buildEncounterScenes(r);assert.ok(scenes.some(s=>s.id==='final-demand'&&s.choices.length===3));assert.match(scenes.find(s=>s.id==='action:final_counter').lines[0].text,/limited inspection/);}
   r=await session.request({action:choice==='pass'?'end_night':'game',...(choice==='pass'?{}:{choice}),campaign_id:id,revision:r.campaign.revision});
   if(r.error&&interrupted){session=await createCampaignSession(scenario,path,id);r=await session.request({action:'view'});}
   assert.equal(r.error,null,JSON.stringify(r.error));
   const before=structuredClone(r.campaign),count=scenario.transactions.length;
   session=await createCampaignSession(scenario,path,id);r=await session.request({action:'view'});
   assert.deepEqual(r.campaign,before);assert.equal(scenario.transactions.length,count);
  }
  assert.equal(r.campaign.night,7);assert.equal(r.campaign.agentHistory.length,56);
  assert.equal(new Set(r.campaign.agentHistory.map(e=>`${e.night}:${e.actor}`)).size,56);
  if(route==='alternate'){assert.equal(r.campaign.ending,'unbound');assert.equal(r.campaign.politics.library.result,'dorian');assert.ok(r.world.access.passage);assert.equal(r.campaign.politics.finalCourt.result,null);}
  else{
   const lease=cassianPassage(r.campaign,r.world);assert.equal(lease.status,'accepted');assert.equal(lease.settled,true);assert.equal(lease.escrow_yocto,'0');
   assert.equal((await scenario.view(scenario.actors.cassian)).passage_budget.remaining,'0');
   const payout=scenario.transactions.find(t=>t.action==='claim_rent'&&t.actor==='lucien'&&t.success);
   assert.equal(payout.executionStatus,'FINAL');
   assert.ok(payout.receipts.some(receipt=>receipt.predecessor_id===scenario.contract.accountId&&receipt.receiver_id===scenario.actors.lucien.accountId&&receipt.receipt.Action?.actions.some(a=>a.Transfer?.deposit==='10000000000000000000000')),'exact native NEAR transfer to authorized seller');
   assert.equal(scenario.transactions.filter(t=>t.action==='accept_funded_passage'&&t.success).length,1);
   if(route==='counter')assert.equal(interrupted,true);
   const purchases=r.campaign.agentHistory.filter(e=>e.kind==='passage_buy');assert.equal(purchases.length,1);assert.equal(purchases[0].execution,'confirmed');
   const accepted=['counter','accept'].includes(route);assert.equal(r.campaign.politics.finalCourt.result,accepted?'accepted':'rejected');assert.equal(r.world.access.court,accepted);
   if(accepted)assert.equal(r.campaign.ending,'favoured');
   if(route==='refuse')assert.notEqual(r.campaign.ending,'favoured');
   if(route==='rejected')assert.ok(r.world.access.passage,'Lucien protection survives Marius refusal');
   if(route==='counter'||route==='accept')assert.ok(r.world.grants.some(g=>g.grantee===r.campaign.politics.accounts.marius&&g.property_id==='library'&&g.expiry_night===(route==='counter'?8:null)));
   const replay=await scenario.action('cassian','accept_funded_passage',{lease_id:lease.id});assert.equal(replay.succeeded,false);
  }
  const lucienAfter=(await scenario.actors.lucien.balance()).available;
  await writeFile(`docs/evidence/pass3d-${route}.json`,JSON.stringify({scope:'Real local NEAR Sandbox, restricted NPC keys',nights,campaign:r.campaign,world:r.world,lucienBefore,lucienAfter,transactions:scenario.transactions},null,2));
 }finally{await worker.tearDown();}
});

test('Pass 3D funded mandate rejects unsafe terms and refunds unused expired funds',{timeout:90000},async()=>{
 const home=join('.local','pass3d-security-'+randomUUID()),{worker}=await startPersistentSandbox(home);
 try{
  const s=await createScenario(worker,{political:true,living:true,dangerous:true,restrictKeys:true});
  const before=await s.view(s.actors.cassian);
  const offer={property_id:'passage',buyer:s.actors.cassian.accountId,price_yocto:'10000000000000000000001',duration_nights:3,offer_expiry_night:5};
  assert.equal((await s.action('lucien','offer_lease',offer)).succeeded,true);
  assert.equal((await s.action('cassian','accept_funded_passage',{lease_id:2})).succeeded,false);
  assert.deepEqual(await s.view(s.actors.cassian),{...before,leases:(await s.view()).leases});
  assert.equal((await s.view()).leases[2].status,'offered');
  for(let n=0;n<5;n++)assert.equal((await s.call('keeper','advance_night',{expected_night:n})).succeeded,true);
  assert.equal((await s.action('cassian','accept_funded_passage',{lease_id:2})).succeeded,false);
  const balanceBefore=(await s.actors.cassian.balance()).available;
  assert.equal((await s.action('cassian','refund_passage_budget')).succeeded,true);
  const balanceAfter=(await s.actors.cassian.balance()).available;
  assert.ok(BigInt(balanceAfter)>BigInt(balanceBefore));
  const budget=(await s.view(s.actors.cassian)).passage_budget;
  assert.equal(budget.remaining,'0');assert.equal(budget.refund_pending,false);
  assert.equal((await s.action('cassian','refund_passage_budget')).succeeded,false);
  await writeFile('docs/evidence/pass3d-security.json',JSON.stringify({scope:'Real local NEAR Sandbox',balanceBefore,balanceAfter,budget,transactions:s.transactions},null,2));
 }finally{await worker.tearDown();}
});
