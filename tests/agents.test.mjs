import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,rm} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {newCampaign,migrateCampaign} from '../src/game.ts';
import {observeAgent,selectNpcAction,validateNpc,applyNpc} from '../src/agents.ts';
import {createCampaignSession} from '../scripts/sandbox/campaign.mjs';

function fixture(){return {night:0,next_nonce:0,access:{crypt:true,library:false,lounge:false},properties:[{id:'crypt',owner:'vesper'},{id:'library',owner:'player'},{id:'lounge',owner:'seraphine'}],ancestry:[{sire:'vesper',descendant:'player'}],grants:[{id:0,property_id:'crypt',scope:'enter',grantor:'vesper',grantee:'player',parent_grant_id:null,can_delegate:true,expiry_night:null,revoked:false}],grant_validity:[true],leases:[{id:0,property_id:'lounge',owner:'seraphine',buyer:'player',status:'accepted',settled:false,payout_pending:false,escrow_yocto:'2',price_yocto:'2',offer_expiry_night:2,end_night:3}]};}
test('agent observations expose public ledger and own memory only, without aliases',()=>{
 const s=newCampaign('test',{legacy:true}),w=fixture();s.npcs.lucien.memory.push('secret plan');s.discoveries.push({secret:'player discovery'});
 const o=observeAgent('vesper','vesper',s,w);assert.equal(o.account,'vesper');assert.equal(o.ownAccess.library,false);
 assert.ok(!JSON.stringify(o).includes('secret'));for(const key of ['resources','discoveries','npcs','events','agentHistory'])assert.ok(!(key in o));
 o.self.relationships.player=5;o.publicState.grants[0].revoked=true;assert.equal(s.npcs.vesper.relationships.player,0);assert.equal(w.grants[0].revoked,false);
});
test('bound identity, strict proposal, authority, expiry and revoked state validation',()=>{
 const s=newCampaign('test',{legacy:true}),w=fixture();
 for(const p of [{kind:'revoke',actor:'vesper'},{kind:'revoke',account:'vesper'},{kind:'Vote'},null,Object.create({kind:'pass'})])assert.throws(()=>validateNpc('vesper',p,s,w,'vesper'));
 assert.throws(()=>validateNpc('toString',{kind:'pass'},s,w,'vesper'),/identity/);
 assert.throws(()=>validateNpc('lucien',{kind:'revoke'},s,w,'lucien'),/not allowed/);
 assert.throws(()=>validateNpc('vesper',{kind:'revoke'},s,w,'lucien'),/authorized/);
 assert.throws(()=>validateNpc('seraphine',{kind:'collect'},s,w,'lucien'),/authorized/);
 w.night=1;assert.throws(()=>validateNpc('vesper',{kind:'pass'},s,w,'vesper'),/expired/);w.night=0;
 w.grants[0].revoked=true;assert.throws(()=>validateNpc('vesper',{kind:'revoke'},s,w,'vesper'),/authorized/);
 w.grants[0].revoked=false;w.grants[0].expiry_night=0;w.grant_validity=[false];
 assert.doesNotThrow(()=>validateNpc('vesper',{kind:'revoke'},s,w,'vesper')); // Original issuer can revoke even expired grants.
 s.night=w.night=3;assert.doesNotThrow(()=>validateNpc('seraphine',{kind:'collect'},s,w,'seraphine')); // Rent survives expiry.
 w.leases[0].payout_pending=true;assert.throws(()=>validateNpc('seraphine',{kind:'collect'},s,w,'seraphine'),/collectible/);
});
test('distinct fallback policies and persisted per-night limit',()=>{
 let s=newCampaign('test',{legacy:true});const w=fixture();
 for(const [actor,kind] of [['vesper','revoke'],['seraphine','collect'],['lucien','pass']])assert.equal(selectNpcAction(observeAgent(actor,actor,s,w)).kind,kind);
 s=applyNpc(s,'vesper',{kind:'revoke'},w,'vesper');s=migrateCampaign(JSON.parse(JSON.stringify(s)));
 assert.throws(()=>validateNpc('vesper',{kind:'pass'},s,w,'vesper'),/already scheduled/);
 s.night=w.night=1;assert.doesNotThrow(()=>validateNpc('vesper',{kind:'pass'},s,w,'vesper'));
 w.leases[0].status='rejected';assert.equal(selectNpcAction(observeAgent('vesper','vesper',s,w)).kind,'pass');
 const old=newCampaign('old',{legacy:true});delete old.agentHistory;old.npcs.vesper.holdings=['fake title'];
 const migrated=migrateCampaign(old);assert.deepEqual(migrated.agentHistory,[]);assert.ok(!('holdings' in migrated.npcs.vesper));
});

// This fake tests runner persistence/crash ordering only, never NEAR enforcement.
for(const failure of ['before','after','unconfirmed'])test(`journal recovery after ${failure} execution; one outcome per actor/night`,async()=>{
 const root=resolve('.local');await mkdir(root,{recursive:true});
 const dir=await mkdtemp(join(root,'agent-test-')),path=join(dir,'campaign.json'),world=fixture();let calls=0,lost=true,observations=[];
 const scenario={actors:Object.fromEntries(['player','vesper','seraphine','lucien'].map(a=>[a,{accountId:a,balance:async()=>({available:'100'})}])),
  view:async actor=>{const w=structuredClone(world);w.access={crypt:actor?.accountId==='vesper'||!world.grants[0].revoked,library:!actor||actor.accountId==='player',lounge:actor?.accountId==='seraphine'};return w;},
  snapshot:async(error=null)=>({world:await scenario.view(),walletYocto:'100',error}),
  request:async({action})=>{
   if(action==='continue'){
    if(lost&&failure==='before'){lost=false;return {error:'injected failure'};}
    if(lost&&failure==='unconfirmed'){lost=false;return {error:null};}
    calls++;world.grants[0].revoked=true;
    if(lost&&failure==='after'){lost=false;throw new Error('lost response');}
   }else if(action==='settle'){world.leases[0].settled=true;world.leases[0].escrow_yocto='0';}
   return {error:null};
  },call:async(_actor,_method,{expected_night})=>{assert.equal(world.night,expected_night);world.night++;return {succeeded:true,receiptFailures:[]};}};
 const selector=o=>{observations.push(o);return {kind:'revoke',actor:'spoof'};}; // Invalid proposals use character fallback once.
 try{
  let session=await createCampaignSession(scenario,path,'test',selector);
  const failed=await session.request({action:'end_night',campaign_id:'test',revision:0});assert.ok(failed.error);assert.equal(failed.campaign.agentHistory.length,0);
  session=await createCampaignSession(scenario,path,'test',selector);
  const recovered=await session.request({action:'view'});assert.equal(recovered.error,null);assert.equal(calls,1);assert.equal(world.night,1);
  assert.deepEqual(recovered.campaign.agentHistory.map(e=>[e.actor,e.kind,e.source]),[['vesper','revoke','fallback'],['seraphine','collect','fallback'],['lucien','pass','fallback']]);
  assert.equal(recovered.campaign.npcs.vesper.relationships.player,-2);assert.equal(recovered.campaign.resources.blood,5);
  assert.deepEqual(observations.map(o=>o.account),['vesper','seraphine','lucien']);assert.equal(observations[0].ownAccess.library,false);
  const replay=await session.request({action:'end_night',campaign_id:'test',revision:0});assert.match(replay.error,/stale/);assert.equal(calls,1);
  session=await createCampaignSession(scenario,path,'test');assert.deepEqual((await session.request({action:'view'})).campaign,recovered.campaign);
 }finally{assert.ok(dir.startsWith(join(root,'agent-test-')));await rm(dir,{recursive:true,force:true});}
});
