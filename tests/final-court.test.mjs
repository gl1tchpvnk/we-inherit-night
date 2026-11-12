import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,availableActions,playerAction} from '../src/game.ts';
import {finalReasons,finalPlayerOperation,finalNpcReasons,finalAccepted,PASSAGE_PRICE} from '../src/finalCourt.ts';
import {decisionProposal,validateDecision,observeAgent} from '../src/agents.ts';
function fixture(){
 const s=newCampaign('final-test',{living:true,dangerous:true});s.night=6;
 s.politics.accounts=Object.fromEntries([...Object.keys(s.npcs),'player'].map(n=>[n,n]));s.politics.appointment='player';s.politics.serviceFulfilled=true;
 const w={night:6,next_nonce:0,properties:[{id:'library',owner:'player'},{id:'passage',owner:'lucien'}],grants:[{id:0,property_id:'court',grantor:'marius',grantee:'player',scope:'enter',can_delegate:false,parent_grant_id:null,expiry_night:null,revoked:false}],grant_validity:[true],leases:[],access:{library:true,court:true},ancestry:[]};return {s,w};
}
test('published information gates counterproposal; older saves have no new actions',()=>{
 const {s,w}=fixture();assert.match(finalReasons(s,'final_counter',w).join(),/published/);
 s.politics.library.result='mirelle';assert.deepEqual(finalReasons(s,'final_counter',w),[]);
 const after=playerAction(s,'final_counter',w);assert.equal(after.actionsLeft,0);assert.equal(after.resources.blood,s.resources.blood-1);assert.equal(after.politics.finalCourt.response,'counter');assert.ok(finalReasons(after,'final_counter',w).length);
 delete s.politics.finalCourt;assert.ok(availableActions(s,w).every(a=>!a.kind.startsWith('final_')));
});
test('counterproposal acceptance needs completed institutional work and settled independent passage',()=>{
 const {s,w}=fixture();s.politics.library.result='mirelle';const op=finalPlayerOperation(s,'final_counter',w);s.politics.finalCourt.response='counter';
 w.grants.push({id:1,...op.args,grantor:'player',revoked:false});w.grant_validity.push(true);
 assert.equal(!!finalAccepted(s,w),false);
 w.leases.push({id:2,property_id:'passage',buyer:'cassian',owner:'lucien',price_yocto:PASSAGE_PRICE,duration_nights:3,offer_expiry_night:5,status:'accepted',settled:true,end_night:7});assert.equal(finalAccepted(s,w),true);
 s.politics.library.result='dorian';assert.equal(!!finalAccepted(s,w),false);
 s.politics.finalCourt.response='accept';w.grants[1].expiry_night=null;assert.equal(finalAccepted(s,w),true);
});
test('bounded autonomous proposal rejects changed price, wrong actor, shortage and expiry',()=>{
 const {s,w}=fixture();s.night=w.night=4;
 w.leases.push({id:2,property_id:'passage',buyer:'cassian',owner:'lucien',price_yocto:PASSAGE_PRICE,duration_nights:3,offer_expiry_night:5,status:'offered'});
 w.passage_budget={seller:'lucien',remaining:PASSAGE_PRICE,expiry_night:5,lease_id:null};
 const p=decisionProposal('cassian','passage_buy',s,w);assert.equal(p.parameters.priceYocto,PASSAGE_PRICE);assert.equal(p.parameters.leaseId,2);
 validateDecision('cassian',p,s,w,'cassian');p.parameters.priceYocto='1';assert.throws(()=>validateDecision('cassian',p,s,w,'cassian'));
 assert.ok(finalNpcReasons('marius','passage_buy',s,w).length);w.passage_budget.remaining='0';assert.ok(finalNpcReasons('cassian','passage_buy',s,w).length);
 w.passage_budget.remaining=PASSAGE_PRICE;w.night=s.night=5;assert.ok(finalNpcReasons('cassian','passage_buy',s,w).length);
});
