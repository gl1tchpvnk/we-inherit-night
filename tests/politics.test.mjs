import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {newCampaign,migrateCampaign,playerAction,actionAvailability} from '../src/game.ts';
import {observeAgent,validateNpc,COURT_ORDER} from '../src/agents.ts';
import {seededRoll,politicalEnding} from '../src/politics.ts';
import {createCampaignSession} from '../scripts/sandbox/campaign.mjs';
import {libraryPlayerOperation,libraryNpcReasons,operationConfirmed} from '../src/library.ts';
import {navigationGuidance} from '../src/navigation.ts';
import {buildEncounterScenes} from '../src/encounters.ts';

// In-memory authority fixture: runner/rules tests, NOT NEAR execution evidence.
async function fixture(id='political-test',living=false){
 const dir=await mkdtemp(join(resolve('.local'),'politics-test-')),path=join(dir,'campaign.json');
 const accounts=Object.fromEntries([...COURT_ORDER,'player','keeper'].map(a=>[a,a]));
 const actors=Object.fromEntries(Object.keys(accounts).map(a=>[a,{accountId:a,balance:async()=>({available:'250000000000000000000000'})}]));
 const world={night:0,properties:[['crypt','vesper'],['library','player'],['lounge','seraphine'],['court','marius'],['sanctuary','seraphine'],['passage','lucien']].map(([id,owner])=>({id,owner})),ancestry:[{sire:'vesper',descendant:'player'}],grants:[['crypt','vesper','player',true],['library','player','mirelle',false],['court','marius','sabine',true]].map(([property_id,grantor,grantee,can_delegate],id)=>({id,property_id,scope:'enter',grantor,grantee,can_delegate,parent_grant_id:null,expiry_night:null,revoked:false})),leases:[['lounge',3,2],['sanctuary',7,3]].map(([property_id,duration_nights,offer_expiry_night],id)=>({id,property_id,duration_nights,offer_expiry_night,owner:'seraphine',buyer:'player',price_yocto:'20000000000000000000000',escrow_yocto:'0',status:'offered',end_night:null,settled:false,payout_pending:false}))};
 if(living)world.grants[1].expiry_night=3;
 const nonces={},tx=[];let lose=false,reject=false;
 const valid=g=>!g.revoked&&(g.expiry_night===null||g.expiry_night>world.night)&&(g.parent_grant_id===null||valid(world.grants[g.parent_grant_id]));
 const view=async(actor=actors.player)=>({...structuredClone(world),next_nonce:nonces[actor.accountId]??0,grant_validity:world.grants.map(valid),access:Object.fromEntries(world.properties.map(p=>[p.id,p.owner===actor.accountId||world.grants.some(g=>g.property_id===p.id&&g.grantee===actor.accountId&&valid(g))||world.leases.some(l=>l.property_id===p.id&&l.buyer===actor.accountId&&l.status==='accepted'&&l.end_night>world.night)]))});
 const action=async(actor,method,args)=>{
   if(reject&&method==='accept_lease')return {succeeded:false,receiptFailures:['injected']};
   if(method==='accept_lease'){const l=world.leases[args.lease_id];l.status='accepted';l.end_night=world.night+l.duration_nights;l.escrow_yocto=l.price_yocto;}
   if(method==='grant_access')world.grants.push({...args,id:world.grants.length,grantor:actor,revoked:false});
   if(method==='revoke_grant')world.grants[args.grant_id].revoked=true;
   if(method==='claim_rent'){world.leases[args.lease_id].settled=true;world.leases[args.lease_id].escrow_yocto='0';}
   nonces[actor]=(nonces[actor]??0)+1;tx.push({actor,method,args});
   if(lose===method){lose=false;throw new Error('Lost committed response');}
   return {succeeded:true,receiptFailures:[]};
 };
 const scenario={contract:{accountId:"mock-contract"},campaignId:"default",actors,political:true,living,view,action,hasAccess:async id=>(await view()).access[id],snapshot:async(error=null)=>({world:await view(),walletYocto:'250000000000000000000000',error}),call:async()=>{world.night++;tx.push({method:'advance_night'});return {succeeded:true,receiptFailures:[]};},request:async()=>{await action('seraphine','claim_rent',{lease_id:0});return {error:null};}};
 let session,current;
 async function reload(){session=await createCampaignSession(scenario,path,id,undefined,async()=>{throw new Error('Provider must never run in 2C');});current=await session.request({action:'view'});return current;}
 async function request(action,extra={}){current=await session.request({action,campaign_id:id,revision:current.campaign.revision,...extra});return current;}
 async function play(choice){const r=await request('game',{choice});assert.equal(r.error,null);return r;}
 await reload();
 return {world,actors,view,tx,play,request,reload,current:()=>current,lose:(method='accept_lease')=>{lose=method;},reject:()=>{reject=true;},close:()=>rm(dir,{recursive:true,force:true})};
}

test('Living Court: Mirelle delegates to Cassian, publishes once, fulfils service and survives unrelated revocation',async()=>{
 const f=await fixture('living-mirelle',true);try{
  await f.play('petition_marius');await f.play('feed');await f.request('end_night');
  assert.equal(f.current().world.access.crypt,false);
  await f.play('authorize_mirelle');
  const root=f.world.grants.find(g=>g.property_id==='library'&&g.grantor==='player'&&g.can_delegate);
  const child=f.world.grants.find(g=>g.parent_grant_id===root.id);assert.equal(child.grantee,'cassian');
  assert.equal(f.current().campaign.politics.library.result,'open');
  await f.request('end_night');assert.equal(f.current().campaign.politics.library.result,'mirelle');assert.equal(f.current().campaign.politics.serviceFulfilled,true);
  await f.play('withdraw_library');assert.equal((await f.view(f.actors.cassian)).access.library,false);assert.equal(f.current().world.access.court,true);
  while(f.current().campaign.status==='playing')await f.request('end_night');
  assert.equal(f.current().campaign.ending,'favoured');assert.equal(f.tx.filter(t=>t.method==='enter_room').length,1);
  const count=f.tx.length,copy=structuredClone(f.current().campaign);await f.reload();assert.equal(f.tx.length,count);assert.deepEqual(f.current().campaign,copy);
 }finally{await f.close();}
});

test('Living Court: Lucien temporary passage becomes a viable late recovery through Dorian',async()=>{
 const f=await fixture('living-dorian',true);try{
  await f.play('feed');await f.play('broker_passage');await f.request('end_night');
  await f.play('authorize_dorian');
  assert.equal((await f.view(f.actors.lucien)).access.library,true);
  await f.request('end_night');assert.equal(f.current().campaign.politics.library.result,'dorian');
  assert.ok(f.world.grants.some(g=>g.property_id==='passage'&&g.grantee==='player'&&g.expiry_night===null));
  await f.play('withdraw_library');assert.equal((await f.view(f.actors.lucien)).access.library,false);assert.equal(f.current().world.access.passage,true);
  await f.request('end_night');assert.equal(f.current().campaign.ending,'favoured');assert.match(f.current().campaign.reason,/Lucien/);
 }finally{await f.close();}
});

test('Living Court: revoking before research removes descendants and prevents the patron reward',async()=>{
 const f=await fixture('living-withdraw',true);try{
  await f.play('investigate_title');await f.play('sanctuary_pact');await f.play('feed');
  await f.play('authorize_dorian');await f.play('withdraw_library');
  assert.equal(f.current().campaign.politics.library.result,'open');assert.equal((await f.view(f.actors.lucien)).access.library,false);
  assert.equal(f.current().world.access.sanctuary,true);assert.equal(f.current().world.access.library,true);
  assert.ok(!f.world.grants.some(g=>g.property_id==='passage'&&g.expiry_night===null));
  assert.throws(()=>libraryPlayerOperation(f.current().campaign,'withdraw_library',f.current().world),/No permission/);
  assert.ok(libraryNpcReasons('marius','archive_assist',f.current().campaign,f.current().world).length);
  assert.equal(operationConfirmed(f.current().world,{method:'revoke_grant',args:{grant_id:0}},'player'),false);
 }finally{await f.close();}
});

for(const method of ['grant_access','enter_room'])test(`Living Court: lost ${method} response recovers once`,async()=>{
 const f=await fixture('living-lost-'+method,true);try{
  await f.play('investigate_title');await f.play('sanctuary_pact');await f.play('feed');
  if(method==='grant_access')f.lose(method);
  await f.request('game',{choice:'authorize_mirelle'});await f.reload();
  if(method==='enter_room'){f.lose(method);await f.request('end_night');await f.reload();}
  else await f.request('end_night');
  assert.equal(f.current().campaign.politics.library.result,'mirelle');
  assert.equal(f.tx.filter(t=>t.method==='grant_access'&&t.actor==='player').length,1);
  assert.equal(f.tx.filter(t=>t.method==='enter_room').length,1);
  assert.equal(new Set(f.current().campaign.agentHistory.map(e=>e.night+':'+e.actor)).size,f.current().campaign.agentHistory.length);
 }finally{await f.close();}
});

test('Living Court scenes offer bounded conversations, direct commitments and free inspection',async()=>{
 const f=await fixture('living-scenes',true);try{
  const before=structuredClone(f.current().campaign),scenes=buildEncounterScenes(f.current());
  for(const s of scenes.filter(s=>s.id.startsWith('character:')))assert.ok(s.choices.length<=3);
  assert.ok(!scenes.find(s=>s.id==='character:seraphine').choices.some(ch=>ch.inspect==='lease:0'));
  assert.ok(scenes.find(s=>s.id==='action:sanctuary_pact').rights.some(t=>t.includes('accept_lease')));
  assert.deepEqual(f.current().campaign,before);
  await f.play('investigate_title');await f.play('sanctuary_pact');await f.play('feed');
  const offer=buildEncounterScenes(f.current()).find(s=>s.id==='action:authorize_dorian');
  assert.equal(offer.choices.filter(c=>c.action).length,1);assert.ok(offer.choices.some(c=>c.inspect==='decision:3'));assert.equal(offer.choices[0].action.choice,'authorize_dorian');
  assert.ok(offer.terms.some(t=>t.includes('Lucien')));
 }finally{await f.close();}
});
test('one action automatically resolves eight bounded NPC turns; free exploration and stale replay',async()=>{
 const f=await fixture();try{
 const before=f.current().campaign;await f.request('enter',{property_id:'library'});assert.deepEqual(f.current().campaign,before);
 const r=await f.play('petition_marius');assert.equal(r.campaign.night,1);assert.equal(r.campaign.actionsLeft,1);assert.equal(r.world.access.court,true);assert.equal(r.campaign.agentHistory.length,8);
 assert.ok(r.campaign.agentHistory.every(e=>e.source==='deterministic-policy'));
 const stale=await f.request('game',{choice:'feed',revision:before.revision});assert.match(stale.error,/stale/);
 const saved=structuredClone(r);assert.deepEqual((await f.reload()).campaign,saved.campaign);assert.equal(f.tx.filter(t=>t.method==='advance_night').length,1);
 }finally{await f.close();}
});
test('independent sanctuary route reaches Unbound; final state is rights-based',async()=>{
 const f=await fixture();try{
 await f.play('investigate_title');await f.play('sanctuary_pact');await f.play('feed');
 assert.equal(f.current().world.access.crypt,false);assert.equal(f.current().world.access.sanctuary,true);assert.equal(f.current().world.access.library,true);
 while(f.current().campaign.night<7){const r=await f.request('end_night');assert.equal(r.error,null);}
 assert.equal(f.current().campaign.ending,'unbound');assert.equal(f.current().campaign.agentHistory.length,56);
 const copy=structuredClone(f.current().campaign),world=await f.view();world.access.sanctuary=false;politicalEnding(copy,world);assert.equal(copy.ending,'failure');
 }finally{await f.close();}
});
test('patron route reaches Favoured; breached service loses only institutional grant',async()=>{
 for(const fulfil of [true,false]){const f=await fixture();try{
 await f.play('petition_marius');await f.play('feed');await f.request('end_night');
 assert.equal(f.current().world.access.crypt,false);assert.equal(f.current().world.access.court,true);
 if(fulfil)await f.play('fulfil_service');
 while(f.current().campaign.status==='playing')await f.request('end_night');
 assert.equal(f.current().campaign.ending,fulfil?'favoured':'failure');assert.equal(f.current().world.access.library,true);
 assert.equal(f.current().campaign.night,fulfil?7:6);
 }finally{await f.close();}}
});
test('passing triggers ultimatum and early defeat without forcing seven nights',async()=>{
 const f=await fixture();try{for(let i=0;i<3;i++)await f.request('end_night');assert.equal(f.current().campaign.ending,'failure');assert.equal(f.current().campaign.night,3);assert.equal(f.current().world.grants[0].revoked,true);}finally{await f.close();}
});
test('invalid terms and failed acceptance cost no action; lost response recovers once through automatic dawn',async()=>{
 for(const mode of ['invalid','failed','lost']){const f=await fixture();try{
 await f.play('investigate_title');const before=structuredClone(f.current().campaign);
 if(mode==='invalid')f.world.leases[1].price_yocto='1';if(mode==='failed')f.reject();if(mode==='lost')f.lose();
 const r=await f.request('game',{choice:'sanctuary_pact'});assert.ok(r.error);
 if(mode==='lost'){await f.reload();assert.equal(f.current().campaign.night,2);assert.equal(f.current().world.access.sanctuary,true);assert.equal(f.tx.filter(t=>t.method==='accept_lease').length,1);assert.equal(f.current().campaign.agentHistory.length,16);}
 else{assert.equal(r.campaign.actionsLeft,before.actionsLeft);assert.equal(r.campaign.night,before.night);assert.deepEqual(r.campaign.resources,before.resources);}
 }finally{await f.close();}}
});
test('minor NPC finite competition, public lead and legitimate sponsorship persist with seeded events',async()=>{
 const f=await fixture('repeatable');try{
 await f.play('investigate_title');assert.equal(f.current().campaign.politics.archiveLead,true);
 await f.play('secure_dossier');assert.equal(f.current().campaign.politics.dossier,'player');assert.ok(f.current().world.grants.some(g=>g.grantor==='sabine'&&g.grantee==='cassian'&&g.parent_grant_id===2));
 assert.ok(f.current().campaign.agentHistory.some(e=>e.actor==='cassian'&&e.kind==='compete')||f.current().campaign.night===2);
 const records=structuredClone(f.current().campaign.politics.encounters);await f.reload();assert.deepEqual(f.current().campaign.politics.encounters,records);
 const invalid=await f.request('game',{choice:'secure_dossier'});assert.match(invalid.error,/claimed/);
 }finally{await f.close();}
 assert.equal(seededRoll(123,2,'dorian'),seededRoll(123,2,'dorian'));assert.notEqual(seededRoll(123,2,'dorian'),seededRoll(124,2,'dorian'));
});
test('Lucien temporary leverage and issuer restrictions; observations contain no player-private discoveries',async()=>{
 const f=await fixture();try{
 await f.play('investigate_title');await f.play('broker_passage');assert.equal(f.current().world.access.passage,true);
 const s=f.current().campaign,w=await f.view(f.actors.lucien),o=observeAgent('lucien','lucien',s,w);
 assert.ok(!('discoveries' in o));assert.ok(!('resources' in o));assert.throws(()=>validateNpc('lucien',{kind:'revoke'},s,w,'lucien'),/not allowed/);
 assert.throws(()=>validateNpc('marius',{kind:'pass'},s,w,'lucien'),/identity/);
 while(f.current().campaign.status==='playing')await f.request('end_night');assert.equal(f.current().campaign.night,5);assert.equal(f.current().campaign.ending,'failure');
 }finally{await f.close();}
});
test('same seed and decisions reproduce encounters across independent saves; Dorian consumes a finite opportunity',async()=>{
 const a=await fixture('same-seed'),b=await fixture('same-seed');try{
  for(const f of [a,b])for(let i=0;i<3;i++)await f.request('end_night');
  assert.deepEqual(a.current().campaign.politics.encounters,b.current().campaign.politics.encounters);
  assert.equal(a.current().campaign.politics.dossier,'dorian');assert.equal(a.current().campaign.politics.appointment,'cassian');
 }finally{await a.close();await b.close();}
});
test('new saves use one configurable internal action; old saves preserve original mechanics and rights',()=>{
 assert.equal(newCampaign('fresh').actionsLeft,1);assert.equal(newCampaign('test',{actionLimit:2}).actionsLeft,2);
 const old=newCampaign('old',{legacy:true});assert.deepEqual(migrateCampaign(old),old);assert.equal(migrateCampaign(old).actionsLeft,3);assert.ok(!migrateCampaign(old).politics);
 const s=newCampaign('free'),w={night:0,access:{lounge:true},leases:[],grants:[],properties:[]};
 assert.equal(actionAvailability(s,'learn_seraphine',w).cost.majorActions,0);assert.equal(playerAction(s,'learn_seraphine',w).actionsLeft,1);
});

test('Lounge access and independent Library cannot substitute for shelter; precise failure preserves rights',()=>{
 const s=newCampaign('lounge-only');s.night=3;
 const w={night:3,access:{lounge:true,library:true,crypt:false,court:false,sanctuary:false,passage:false},properties:[{id:'library',owner:'player'}],leases:[],grants:[]};
 const before=structuredClone(w);politicalEnding(s,w);
 assert.equal(s.ending,'failure');assert.match(s.reason,/Crimson Lounge entry/);assert.match(s.reason,/ordinary access/);assert.deepEqual(w,before);
});


test('Living Court guidance acknowledges secured shelter and revoked permissions without demoted options',async()=>{
 const f=await fixture('guidance',true);try{
  await f.play('investigate_title');await f.play('sanctuary_pact');
  const guide=navigationGuidance(f.current());assert.match(guide.situation,/secured separately/);assert.ok(!guide.leads.some(l=>/dossier|passage/.test(l.label)));
  await f.play('feed');await f.play('authorize_mirelle');await f.request('end_night');await f.play('withdraw_library');
  const scenes=buildEncounterScenes(f.current());assert.match(scenes.find(s=>s.id==='reckoning:5').lines[0].text,/You withdrew/);
  assert.equal(f.current().world.access.court,true);assert.equal(f.current().world.access.sanctuary,true);
 }finally{await f.close();}
});
