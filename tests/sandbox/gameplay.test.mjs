import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {createBridge} from '../../scripts/bridge.mjs';

test('play runner: decisions wait for player; rejection, separate retaliation, isolated reset', {timeout:240000}, async()=>{
  const evidencePaths=['docs/evidence/m1b-sandbox.json','docs/evidence/m2-sandbox.json'];
  const hashes=await Promise.all(evidencePaths.map(async p=>createHash('sha256').update(await readFile(p)).digest('hex')));
  const bridge=createBridge('sandbox',{saveDir:'.local/m3-reset-'+randomUUID(),disableLlm:true,legacy:true}), snapshots=[];
  let current;
  const command=action=>({...action,campaign_id:current?.campaign.id,revision:current?.campaign.revision});
  async function request(action){const r=await bridge.request(command(action));assert.equal(r.error,null);current=r;snapshots.push({action:action.action,phase:r.phase,access:r.world.access,escrow:r.escrowYocto,transactions:r.transactions});return r;}
  function fresh(r){assert.equal(r.phase,'offered');assert.equal(r.escrowYocto,'0');assert.deepEqual(r.world.access,{crypt:true,library:true,lounge:false});assert.deepEqual(r.transactions.map(t=>t.action),['deploy','new_economy','grant_access','offer_lease']);}
  try{
    const start=await request({action:'view'});fresh(start);
    const untouched=await request({action:'view'});assert.deepEqual(untouched.transactions,start.transactions);
    const declined=await request({action:'reject'});assert.equal(declined.phase,'rejected');assert.equal(declined.escrowYocto,'0');assert.equal(declined.world.access.crypt,true);
    const dawn=await request({action:'end_night'});assert.equal(dawn.world.access.crypt,true); // No retaliation for refusal.
    const reset=await request({action:'reset'});fresh(reset);assert.notEqual(reset.transactions[0].hash,start.transactions[0].hash);
    const accepted=await request({action:'accept'});assert.equal(accepted.phase,'retaliation_pending');assert.equal(accepted.world.access.crypt,true);assert.equal(accepted.world.access.lounge,true);assert.equal(accepted.escrowYocto,'20000000000000000000000');assert.equal(accepted.transactions.at(-1).actor,'player');assert.equal(accepted.transactions.at(-1).action,'accept_lease');assert.equal(accepted.transactions.at(-1).executionStatus,'FINAL');
    const reloaded=await request({action:'view'});assert.deepEqual(reloaded.world,accepted.world);
    const response=await request({action:'end_night'});assert.equal(response.phase,'independent');assert.deepEqual(response.world.access,{crypt:false,library:true,lounge:true});assert.ok(response.transactions.some(tx=>tx.actor==='vesper'&&tx.action==='revoke_grant'&&tx.success));
    const denied=await bridge.request(command({action:'enter',property_id:'crypt'}));current=denied;assert.match(denied.error,/access denied/i);assert.equal(denied.transactions.length,response.transactions.length);assert.deepEqual(denied.campaign,response.campaign);
    for(const property_id of ['library','lounge'])await request({action:'enter',property_id});
    fresh(await request({action:'reset'}));
    for(let i=0;i<evidencePaths.length;i++)assert.equal(createHash('sha256').update(await readFile(evidencePaths[i])).digest('hex'),hashes[i]);
    await writeFile('docs/evidence/pass1-reset.json',JSON.stringify({status:'PASS',finishedAt:new Date().toISOString(),snapshots},null,2)+'\n');
  }finally{bridge.close();}
});
