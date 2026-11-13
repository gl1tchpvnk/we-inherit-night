import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,availableActions} from '../src/game.ts';
import {buildEncounterScenes,finishScene,emptySceneMemory} from '../src/encounters.ts';
import {sanctuaryPanel,sanctuaryConsequence,sanctuaryShot,cinematicExcerpt,sanctuaryShotDuration} from '../src/motionComic.ts';

test('shots are distinct, bounded, skippable, and never infer a consequence from elapsed time',()=>{
 assert.deepEqual([0,1,2,3,4].map(f=>sanctuaryShot('entrance','character:seraphine',f,false)),['establishing','detail','entrance','decision','decision']);
 for(const frame of [0,1,2,3])assert.equal(sanctuaryShot('entrance','character:seraphine',frame,true),'decision');
 assert.equal(sanctuaryShot('bargain','action:sanctuary_pact',0,false),'decision');
 assert.equal(sanctuaryShot('entrance','ask:1:seraphine',0,false),'terms');
 assert.equal(sanctuaryShot('entrance','personal:1:seraphine',0,false),'decision');
 assert.equal(sanctuaryShot('entrance','ask:1:seraphine',1,false),'decision');
 assert.equal(sanctuaryShot('consequence','reaction:lease:1:accepted',0,true),'consequence');
 assert.deepEqual([0,1,2,3].map(f=>sanctuaryShot('consequence','reaction:lease:1:accepted',f,false)),['authority-cut','authority-bond','consequence','consequence']);
});

function fixture(){
 const campaign=newCampaign('comic-test',{living:true});campaign.politics.accounts={player:'player',seraphine:'seraphine'};campaign.politics.titleFiled=true;
 const world={night:1,next_nonce:0,properties:[{id:'library',owner:'player'}],grants:[],leases:[{id:1,property_id:'sanctuary',buyer:'player',owner:'seraphine',status:'offered',end_night:null,duration_nights:7,offer_expiry_night:3,price_yocto:'20000000000000000000000'}],access:{crypt:true,lounge:true,library:true},ancestry:[]};
 campaign.night=1;
 return {campaign,world,pending:false,error:null,events:[],proof:'Unit fixture',actions:availableActions(campaign,world),availability:{accept:[],reject:[],end_night:[],rooms:{}}};
}
function accepted(before){const next=structuredClone(before);next.world.leases[0].status='accepted';next.world.leases[0].end_night=8;next.world.access.sanctuary=true;next.world.night=next.campaign.night=2;next.campaign.revision++;return next;}

test('prototype is limited to Seraphine and preserves original decision and inspection',()=>{
 const r=fixture(),before=structuredClone(r),scenes=buildEncounterScenes(r);
 assert.equal(sanctuaryPanel(scenes.find(s=>s.id==='character:seraphine')),'entrance');
 const bargain=scenes.find(s=>s.id==='action:sanctuary_pact');assert.equal(sanctuaryPanel(bargain),'bargain');
 assert.deepEqual(bargain.choices.find(c=>c.id==='commit').action,{action:'game',choice:'sanctuary_pact'});
 for(const scene of scenes.filter(s=>!['character:seraphine','action:sanctuary_pact','ask:1:seraphine','personal:1:seraphine'].includes(s.id)))assert.equal(sanctuaryPanel(scene),null);
 assert.equal(sanctuaryPanel({...scenes.find(s=>s.id==='character:seraphine'),choices:[]}),null);
 assert.deepEqual(r,before);
});
test('consequence uses a newly accepted active lease for the same campaign and player',()=>{
 const before=fixture(),next=accepted(before),original=structuredClone(next),scene=sanctuaryConsequence(before,next);
 assert.equal(sanctuaryPanel(scene),'consequence');assert.match(scene.terms.join(' '),/fixed term, not ownership/);assert.match(scene.rights.join(' '),/contract night 8/);
 assert.deepEqual(scene.choices,[]);assert.deepEqual(next,original);
 const originalReaction=buildEncounterScenes(next).find(s=>s.id===scene.id);
 assert.ok(originalReaction,'cinematic reveal uses the existing reaction identity');
 assert.ok(finishScene(emptySceneMemory(),scene.id).seen.includes(originalReaction.id));
 assert.equal(sanctuaryConsequence(next,next),null);
});
test('pending, failed, unrelated, expired or unverified rights cannot produce a consequence',()=>{
 const before=fixture();
 const cases=[n=>n.pending=true,n=>n.error='uncertain',n=>n.campaign.id='other',n=>n.world.access.sanctuary=false,n=>n.world.leases[0].status='offered',n=>n.world.leases[0].status='rejected',n=>n.world.leases[0].buyer='other',n=>n.world.leases[0].owner='other',n=>n.world.leases[0].end_night=null,n=>n.world.leases[0].end_night=n.world.night,n=>n.closure={reason:'quit'}];
 for(const mutate of cases){const next=accepted(before);mutate(next);assert.equal(sanctuaryConsequence(before,next),null);}
});

test('motion excerpts preserve exact dialogue and use deliberate bounded holds',()=>{
 const text='Your Library really is your own. Good. Now we can discuss a bargain between people with something to lose.';
 for(const shot of ['detail','entrance','confrontation','terms','authority-bond'])assert.ok(text.includes(cinematicExcerpt(text,shot)));
 assert.equal(cinematicExcerpt(text,'establishing'),'');
 assert.equal(cinematicExcerpt(text,'authority-cut'),'');
 assert.ok(cinematicExcerpt(text,'confrontation').split(/\s+/).length<=8);
 assert.ok(sanctuaryShotDuration('entrance')>sanctuaryShotDuration('detail'));
 assert.ok(sanctuaryShotDuration('detail')>sanctuaryShotDuration('establishing'));
 assert.equal(['establishing','detail','entrance'].reduce((sum,shot)=>sum+sanctuaryShotDuration(shot),0),4500);
 assert.equal(sanctuaryShotDuration('decision'),0);
 assert.equal(sanctuaryShotDuration('consequence'),0);
});
