import type {Authority,Campaign,NpcName} from './game';
import {effectiveGrant,type LibraryOperation} from './library.ts';

export const PASSAGE_PRICE='10000000000000000000000';
export interface FinalCourt {response:'accept'|'refuse'|'counter'|null;result:'accepted'|'rejected'|null}
export const FINAL_ACTIONS={
 final_accept:{label:'Give Marius a continuing invitation',description:'One major action. Give Marius non-delegable Library access without expiry; keep his revocable protection.',blood:0,property:'library'},
 final_refuse:{label:'Refuse Marius’s demand',description:'One major action. Marius will withdraw his own protection at this reckoning. Independent shelter remains; without it you may lose.',blood:0},
 final_counter:{label:'Offer a limited inspection',description:'One major action and 1 Blood. Give Marius a two-night Library invitation covering the final night, even if he refuses. He evaluates the public account and Cassian’s separate passage; rejection costs his protection.',blood:1,property:'library'}
} as const;
export type FinalAction=keyof typeof FINAL_ACTIONS;
export type FinalNpcAction='passage_offer'|'passage_buy'|'passage_collect'|'final_answer';
export const isFinalAction=(s:string):s is FinalAction=>Object.hasOwn(FINAL_ACTIONS,s);
export const isFinalNpcAction=(s:string):s is FinalNpcAction=>['passage_offer','passage_buy','passage_collect','final_answer'].includes(s);
export function cassianPassage(s:Campaign,w:Authority){return w.leases.find(l=>l.property_id==='passage'&&l.buyer===s.politics?.accounts.cassian&&l.owner===s.politics?.accounts.lucien&&l.price_yocto===PASSAGE_PRICE&&l.duration_nights===3&&l.offer_expiry_night===5);}
export function mariusProtection(s:Campaign,w:Authority){return w.grants.find(g=>g.property_id==='court'&&g.grantee===s.politics?.accounts.player&&g.grantor===s.politics?.accounts.marius&&effectiveGrant(w,g));}
export function finalDemand(s:Campaign,w:Authority){return !!s.politics?.finalCourt&&s.night===6&&!!mariusProtection(s,w);}
export function finalReasons(s:Campaign,kind:FinalAction,w:Authority):string[]{
 if(!finalDemand(s,w)||s.politics!.finalCourt!.response)return ['No unanswered final demand.'];
 if(kind==='final_counter'&&(!s.politics?.library||s.politics.library.result==='open'))return ['A published Library account is required to support this proposal.'];
 return [];
}
export function finalPlayerOperation(s:Campaign,kind:FinalAction,w:Authority):LibraryOperation|null{
 const reasons=finalReasons(s,kind,w);if(reasons.length)throw new Error(reasons.join(' '));
 if(kind==='final_refuse')return null;
 return {method:'grant_access',args:{property_id:'library',scope:'enter',grantee:s.politics!.accounts.marius,parent_grant_id:null,can_delegate:false,expiry_night:kind==='final_counter'?8:null}};
}
// Published findings and the public paid lease are legitimate information for Marius.
export function counterAccepted(s:Campaign,w:Authority){const lease=cassianPassage(s,w);return s.politics?.library?.result==='mirelle'&&s.politics.serviceFulfilled&&lease?.status==='accepted'&&lease.settled&&lease.end_night!==null&&lease.end_night>w.night;}
export function finalAccepted(s:Campaign,w:Authority){
 const response=s.politics?.finalCourt?.response;
 const invitation=w.grants.some(g=>g.property_id==='library'&&g.grantor===s.politics?.accounts.player&&g.grantee===s.politics?.accounts.marius&&!g.can_delegate&&g.parent_grant_id===null&&g.expiry_night===(response==='counter'?8:null)&&effectiveGrant(w,g));
 return invitation&&(response==='accept'||response==='counter'&&counterAccepted(s,w));
}
export function finalNpcReasons(actor:NpcName,kind:FinalNpcAction,s:Campaign,w:Authority):string[]{
 if(!s.politics?.finalCourt)return ['Requires a new Dangerous Court campaign.'];
 const lease=cassianPassage(s,w),a=s.politics.accounts;
 if(kind==='final_answer')return actor==='marius'&&finalDemand(s,w)&&s.politics.finalCourt.result===null?[]:['No final demand to resolve.'];
 if(kind==='passage_offer')return actor==='lucien'&&s.night===3&&s.politics.appointment==='player'&&!lease&&w.properties.some(p=>p.id==='passage'&&p.owner===a.lucien)?[]:['No eligible passage customer.'];
 if(kind==='passage_buy')return actor==='cassian'&&s.politics.appointment==='player'&&lease?.status==='offered'&&w.night<5&&w.passage_budget?.seller===a.lucien&&w.passage_budget.remaining===PASSAGE_PRICE&&w.passage_budget.lease_id===null?[]:['No affordable authorized passage offer.'];
 return actor==='lucien'&&lease?.status==='accepted'&&!lease.settled&&!lease.payout_pending&&lease.escrow_yocto===PASSAGE_PRICE?[]:['No earned passage rent.'];
}
export function finalNpcOperation(actor:NpcName,kind:FinalNpcAction,s:Campaign,w:Authority){
 const lease=cassianPassage(s,w);
 if(kind==='final_answer')return finalAccepted(s,w)?null:{method:'revoke_grant',args:{grant_id:mariusProtection(s,w)!.id}};
 if(kind==='passage_offer')return {method:'offer_lease',args:{property_id:'passage',buyer:s.politics!.accounts.cassian,price_yocto:PASSAGE_PRICE,duration_nights:3,offer_expiry_night:5}};
 return {method:kind==='passage_buy'?'accept_funded_passage':'claim_rent',args:{lease_id:lease!.id}};
}
export function finalNpcConfirmed(kind:FinalNpcAction,s:Campaign,w:Authority,operation:ReturnType<typeof finalNpcOperation>){
 const lease=cassianPassage(s,w);
 if(kind==='final_answer')return operation? w.grants.some(g=>g.id===operation.args.grant_id&&g.revoked):finalAccepted(s,w);
 if(kind==='passage_offer')return !!lease;
 if(kind==='passage_buy')return lease?.status==='accepted'&&w.passage_budget?.remaining==='0'&&w.passage_budget.lease_id===lease.id&&w.access.passage;
 return lease?.settled===true&&lease.escrow_yocto==='0'&&!lease.payout_pending;
}
