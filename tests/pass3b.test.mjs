import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,availableActions} from '../src/game.ts';
import {observeAgent,selectNpcAction} from '../src/agents.ts';
import {libraryNpcReasons,timelyLibraryPetition} from '../src/library.ts';
import {courtReactions,politicalRelationship} from '../src/reactiveCourt.ts';
import {buildEncounterScenes,finishScene,nextScene,readSceneMemory} from '../src/encounters.ts';

function fixture(){
 const campaign=newCampaign('reactive-fixture',{living:true});campaign.night=4;
 campaign.politics.accounts=Object.fromEntries(['player',...Object.keys(campaign.npcs)].map(a=>[a,a]));
 const world={night:4,next_nonce:0,properties:[{id:'library',owner:'player'},{id:'court',owner:'marius'}],grants:[],grant_validity:[],leases:[],ancestry:[],access:{library:true,lounge:true,crypt:false,court:false,passage:false,sanctuary:false}};
 const r={campaign,world,pending:false,error:null,events:[],availability:{end_night:[],rooms:{},accept:[],reject:[]}};r.actions=availableActions(campaign,world);return r;
}
function invite(r){r.campaign.politics.library={chosen:'mirelle',authorizedNight:3,result:'open',challenged:false};r.world.grants.push({id:10,property_id:'library',grantor:'player',grantee:'mirelle',parent_grant_id:null,can_delegate:true,expiry_night:null,revoked:false});r.world.grant_validity.push(true);r.campaign.events.push('Night 4: Give Mirelle Library access.');}

test('reaction prerequisites exclude pending, failed and absent decisions',()=>{
 const r=fixture();assert.deepEqual(courtReactions(r),[]);
 for(const execution of ['pending','failed',undefined]){r.campaign.agentHistory=[{night:3,actor:'mirelle',kind:'archive_research',execution}];assert.deepEqual(courtReactions(r),[]);}
 r.campaign.agentHistory[0].execution='confirmed';assert.equal(courtReactions(r).length,1);
 r.pending=true;assert.deepEqual(courtReactions(r),[]);r.pending=false;r.error='uncertain';assert.deepEqual(courtReactions(r),[]);
});
test('stable event scenes are bounded, read-only and do not replay after completion/reload',()=>{
 const r=fixture();invite(r);r.campaign.agentHistory=[{night:3,actor:'mirelle',kind:'archive_assist',execution:'confirmed'},{night:3,actor:'dorian',kind:'archive_challenge',execution:'local'}];
 const before=structuredClone(r),scenes=buildEncounterScenes(r),reaction=nextScene(scenes,readSceneMemory(null));
 assert.ok(reaction.reactionLevel);assert.equal(scenes.filter(s=>s.reactionLevel&&s.automatic).length,1);
 assert.ok(scenes.filter(s=>s.reactionLevel).every(s=>s.choices.every(c=>!c.action)));
 const memory=readSceneMemory(JSON.stringify(finishScene(readSceneMemory(null),reaction.id)));
 assert.notEqual(nextScene(buildEncounterScenes(r),memory)?.id,reaction.id);
 assert.deepEqual(r,before);assert.ok(courtReactions(r).length<=64);
 for(const s of scenes)for(const ch of s.choices)if(ch.inspect)assert.ok(scenes.some(t=>t.id===ch.inspect));
});
test('withdrawal changes cooperation without inventing betrayal or erasing independent protection',()=>{
 const r=fixture();invite(r);r.world.grants[0].revoked=true;r.world.grant_validity[0]=false;r.campaign.events.push('Night 5: Withdraw your Library permission.');r.campaign.night=5;
 r.world.grants.push({id:11,property_id:'court',grantor:'marius',grantee:'player',expiry_night:null});r.world.grant_validity.push(true);
 assert.match(politicalRelationship(r,'mirelle'),/Cooperation withdrawn/);
 assert.match(buildEncounterScenes(r).find(s=>s.id==='character:mirelle').lines[0].text,/I have stopped/);
 const u=courtReactions(r).find(u=>u.id==='reaction:withdraw:10');assert.equal(u.night,4);assert.doesNotMatch(u.text,/betray|all protection.*lost/i);
 assert.match(politicalRelationship(r,'marius'),/Separate patron/);
});
test('revoked Crypt invitation never asserts that an independent right was lost',()=>{
 const r=fixture();r.campaign.agentHistory=[{night:2,actor:'vesper',kind:'revoke',execution:'confirmed'}];assert.equal(courtReactions(r).length,0);
 r.world.grants.push({id:0,property_id:'crypt',grantor:'vesper',grantee:'player',revoked:true});r.world.access.crypt=true;
 assert.match(courtReactions(r)[0].text,/Another valid right/);assert.doesNotMatch(courtReactions(r)[0].text,/no longer admits/);
});
test('NPC observation removes private politics and unrelated agreement decisions',()=>{
 const r=fixture();r.campaign.politics.titleFiled=true;r.campaign.politics.passageRequested=true;r.campaign.politics.encounters.push({secret:'PRIVATE_INTENTION'});r.campaign.agreements=[{actor:'seraphine',status:'rejected',result:'PRIVATE_REFUSAL'}];r.campaign.npcs.marius.memory.push('MARIUS_ONLY');
 const o=observeAgent('vesper','vesper',r.campaign,r.world),json=JSON.stringify(o);
 assert.deepEqual(Object.keys(o.politics),['seed']);assert.doesNotMatch(json,/titleFiled|passageRequested|PRIVATE_INTENTION|PRIVATE_REFUSAL|MARIUS_ONLY/);
 assert.equal(selectNpcAction(o).kind,'pass');
});
test('Dorian petitions only while a live rival can still be replaced and finished',()=>{
 const r=fixture();invite(r);r.campaign.night=3;r.world.night=3;
 assert.equal(timelyLibraryPetition(r.campaign,r.world),true);
 r.campaign.night=4;r.world.night=4;assert.equal(timelyLibraryPetition(r.campaign,r.world),false);
 assert.ok(!observeAgent('dorian','dorian',r.campaign,r.world).available.some(p=>p.kind==='archive_challenge'));
 assert.deepEqual(libraryNpcReasons('dorian','archive_challenge',r.campaign,r.world),[],'Older journaled local petition remains recoverable');
 r.campaign.night=3;r.world.grants[0].revoked=true;r.world.grant_validity[0]=false;assert.equal(timelyLibraryPetition(r.campaign,r.world),false);
});
test('acceptance and rejection are separate evidence, never inferred from leaving dialogue',()=>{
 const r=fixture();r.world.leases=[{id:1,buyer:'player',property_id:'sanctuary',status:'offered',end_night:null,duration_nights:7}];assert.equal(courtReactions(r).length,0);
 r.world.leases[0].status='accepted';r.world.leases[0].end_night=8;assert.match(courtReactions(r)[0].text,/Night 9/);
 r.world.leases[0].status='rejected';r.world.leases[0].end_night=null;assert.match(courtReactions(r)[0].text,/no shelter or access/);assert.equal(courtReactions(r)[0].night,-1);
});
test('historical assistant and rival replies acknowledge a subsequently closed route',()=>{
 const r=fixture();invite(r);r.campaign.night=6;r.world.grants[0].revoked=true;r.world.grant_validity[0]=false;
 r.campaign.agentHistory=[{night:3,actor:'mirelle',kind:'archive_assist',execution:'confirmed'},{night:3,actor:'dorian',kind:'archive_challenge',execution:'local'}];
 const scenes=buildEncounterScenes(r);
 assert.match(scenes.find(s=>s.id.endsWith('mirelle:archive_assist')).lines[0].text,/no longer works/);
 assert.match(scenes.find(s=>s.id.endsWith('dorian:archive_challenge')).lines[0].text,/offer then/);
});
