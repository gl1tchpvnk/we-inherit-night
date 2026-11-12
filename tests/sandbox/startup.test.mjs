import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createBridge} from '../../scripts/bridge.mjs';

test('Windows-to-WSL bundled startup preserves finalized bootstrap, scheduled agents, stale reset protection and reload',{timeout:120000,skip:process.platform!=='win32'?'Run this Windows bundler regression with Windows Node; other Sandbox suites run in Linux':false},async()=>{
 const saveDir='.local/startup-regression-'+randomUUID();
 let bridge=createBridge('sandbox',{saveDir,profile:true,disableLlm:true});
 try{
  const fresh=await bridge.request({action:'view'});
  assert.equal(fresh.error,null);assert.equal(fresh.pending,false);
  assert.equal(fresh.campaign.agentHistory.length,0);
  assert.equal(fresh.transactions.length,9);
  assert.ok(fresh.campaign.politics.finalCourt);
  assert.equal(fresh.transactions.filter(t=>t.action==='fund_passage'&&t.actor==='cassian'&&t.success).length,1);
  assert.ok(fresh.transactions.every(t=>t.success&&t.executionStatus==='FINAL'));
  assert.deepEqual(fresh.world.grants.map(g=>g.grantee),['player.test.near','mirelle.test.near','sabine.test.near','player.test.near']);
  const again=await bridge.request({action:'view'});
  assert.deepEqual(again.transactions,fresh.transactions);
  const stale=await bridge.request({action:'reset',campaign_id:fresh.campaign.id,revision:999});assert.ok(stale.error);
  const unchanged=await bridge.request({action:'view'});assert.equal(unchanged.campaign.id,fresh.campaign.id);
  const next=await bridge.request({action:'end_night',campaign_id:fresh.campaign.id,revision:fresh.campaign.revision});
  assert.equal(next.error,null);assert.equal(next.campaign.agentHistory.length,8);
  await bridge.close();
  bridge=createBridge('sandbox',{saveDir,disableLlm:true});
  const resumed=await bridge.request({action:'view'});
  assert.equal(resumed.error,null);assert.deepEqual(resumed.transactions,next.transactions);assert.deepEqual(resumed.campaign,next.campaign);
 }finally{await bridge.close();}
});
