import {FINAL_ACTIONS,isFinalAction,finalReasons,type FinalAction} from './finalCourt.ts';
import {LIBRARY_ACTIONS,isLibraryAction,libraryReasons,type LibraryAction} from './library.ts';
import type {AgentEvent,Agreement} from './agents';
import {POLITICAL_ACTIONS,newPolitics,politicalReasons,hasShelter, type Politics,type PoliticalAction} from './politics.ts';
// Legacy Exposure is retained as inert historical save data.
export type Resources = {blood:number;exposure?:number};
export type NpcName = 'vesper'|'seraphine'|'lucien'|'marius'|'cassian'|'mirelle'|'dorian'|'sabine';
export type GameAction = 'feed'|'rest'|'investigate_title'|'investigate_bloodline'|'investigate_expiry'|'learn_seraphine'|'discuss_exchange'|PoliticalAction|LibraryAction|FinalAction;
export interface Authority {
  passage_budget?:{seller:string;remaining:string;expiry_night:number;lease_id:number|null}|null;
  night:number;access:Record<string,boolean>;properties:{id:string;owner:string}[];
  ancestry:{sire:string;descendant:string}[];
  grants:{id:number;property_id:string;scope:string;grantor:string;grantee:string;parent_grant_id:number|null;can_delegate:boolean;expiry_night:number|null;revoked:boolean}[];
  grant_validity?:boolean[];
  leases:{id:number;property_id:string;owner:string;buyer:string;status:string;settled:boolean;price_yocto:string;offer_expiry_night:number;escrow_yocto:string;end_night:number|null;duration_nights?:number;payout_pending?:boolean}[];
}
export interface Vampire {relationships:Partial<Record<NpcName,number>>&{player:number};memory:string[]}
export interface Discovery {id:string;summary:string;source:'contract-view'|'local-scenario';observedNight:number;facts:Record<string,unknown>;futureOpportunity:boolean}
export interface Campaign {version:2|3;id:string;revision:number;night:number;actionsLeft:number;actionLimit?:number;politics?:Politics;ending?:'unbound'|'favoured'|'failure';resources:Resources;seats:number;status:'playing'|'concluded'|'defeat';reason:string;discoveries:Discovery[];agentHistory:AgentEvent[];agreements:Agreement[];npcs:Record<NpcName,Vampire>;events:string[]}
export interface GameProposal {kind:GameAction}
export const ACTIONS:Record<GameAction,{label:string;description:string;blood:number;property?:string;once?:boolean}>={
  ...POLITICAL_ACTIONS,
  ...LIBRARY_ACTIONS,
  ...FINAL_ACTIONS,
  feed:{label:'Feed discreetly',description:'+4 Blood (maximum 12); uses tonight’s action',blood:0},
  rest:{label:'Rest in the Crypt',description:'+2 Blood; requires Crypt access and tonight’s action',blood:0,property:'crypt'},
  investigate_title:{label:'Investigate your Library title',description:'Cost 1 Blood; record its owner and independent title once',blood:1,property:'library',once:true},
  investigate_bloodline:{label:'Trace the Crypt delegation',description:'Cost 2 Blood; discover the recorded ancestry and grant chain once',blood:2,property:'library',once:true},
  investigate_expiry:{label:'Investigate the lease deadline',description:'Cost 1 Blood; unlocks after acceptance; record the actual expiry once',blood:1,property:'library',once:true},
  learn_seraphine:{label:'Ask what Seraphine wants',description:'No Blood cost; learn her terms once; requires Lounge access',blood:0,property:'lounge',once:true},
  discuss_exchange:{label:'Discuss an access exchange',description:'No Blood cost; requires her terms; record a future negotiation opportunity, not an agreement',blood:0,property:'lounge',once:true}
};
export interface Availability {kind:string;label:string;allowed:boolean;reasons:string[];cost:{blood:number;majorActions:number};permission:string|null;description:string}
export function newCampaign(id:string,options:{legacy?:boolean;actionLimit?:number;living?:boolean;dangerous?:boolean}={}):Campaign {
  const vampire=():Vampire=>({relationships:{player:0,vesper:0,seraphine:0,lucien:0},memory:[]});
  const limit=options.legacy?3:options.actionLimit??1;
  if(!Number.isInteger(limit)||limit<1||limit>3)throw new Error('Invalid internal action limit.');
  const npcs={vesper:vampire(),seraphine:vampire(),lucien:vampire()} as Record<NpcName,Vampire>;
  if(!options.legacy)for(const name of ['marius','cassian','mirelle','dorian','sabine'] as NpcName[])npcs[name]=vampire();
  return {version:options.legacy?2:3,id,revision:0,night:0,actionsLeft:limit,...(!options.legacy?{actionLimit:limit,politics:{...newPolitics(id),...(options.dangerous?{finalCourt:{response:null,result:null}}:{}),...(options.living?{library:{chosen:null,authorizedNight:null,result:'open',challenged:false}}:{})}}:{}),resources:{blood:8},seats:1,status:'playing',reason:'',discoveries:[],agentHistory:[],agreements:[],events:[options.legacy?'Legacy seven-night campaign.':'Vesper will revoke Crypt shelter at the third reckoning. Secure sanctuary or institutional protection. Deterministic agents; no model calls.'],npcs};
}
export function log(s:Campaign,text:string){s.events.push(text);s.events=s.events.slice(-80);}
function bounds(s:Campaign){s.resources.blood=Math.max(0,Math.min(12,s.resources.blood));}
export function requirePlaying(s:Campaign){if(s.status!=='playing')throw new Error('This campaign has ended. Start a new game.');}
export function spendAction(s:Campaign){requirePlaying(s);if(s.actionsLeft<1)throw new Error('No major actions remain. End the night.');s.actionsLeft--;}
export function assess(s:Campaign){bounds(s);if(s.resources.blood===0){s.status='defeat';if(s.politics)s.ending='failure';s.reason='FAILURE — your Blood is exhausted.';}else if(s.night===7&&!s.politics){s.status='concluded';s.reason='Temporary development conclusion: seven nights survived. Final council voting awaits Pass 3.';}}
// Signed relationships are not spendable resources. Migrate only local save data,
// preserving chain identity/night; never reconstruct or grant blockchain rights.
export function migrateCampaign(raw:Campaign):Campaign{
  if(raw.version===2||raw.version===3){
    const s=structuredClone(raw);s.agentHistory??=[];s.agreements??=[];
    for(const actor of ['vesper','seraphine','lucien'] as NpcName[]){
      s.npcs[actor]={relationships:s.npcs[actor].relationships,memory:s.npcs[actor].memory};
    }
    return s;
  }
  if(raw.version!==undefined)throw new Error('Unsupported save version.');
  const s=newCampaign(raw.id,{legacy:true});s.revision=raw.revision;s.night=raw.night;s.actionsLeft=raw.actionsLeft;
  s.resources={blood:raw.resources.blood,exposure:raw.resources.exposure};s.seats=raw.seats;
  for(const actor of ['vesper','seraphine','lucien'] as NpcName[]){s.npcs[actor].relationships={...raw.npcs[actor].relationships};}
  assess(s);log(s,'Save migrated: fictional currency and seat purchasing removed; historical seat count confers no voting right.');return s;
}
export function roomDenial(w:Authority,id:string):string|null{
  if(!Object.hasOwn(w.access,id))return 'Unknown property.';
  if(w.access[id])return null; // Effective access is computed by the contract, never genealogy/UI.
  if(w.leases.some(l=>l.property_id===id&&l.status==='accepted'&&l.end_night!==null&&w.night>=l.end_night))return 'Lease expired; no other effective access right.';
  if(w.grants.some(g=>g.property_id===id&&(g.revoked||g.expiry_night!==null&&w.night>=g.expiry_night)))return 'Permission revoked or expired; no other effective access right.';
  return 'No effective contract permission (an upstream grant may be invalid).';
}
export function actionAvailability(s:Campaign,kind:string,w:Authority):Availability{
  if(!Object.hasOwn(ACTIONS,kind))return {kind,label:kind,allowed:false,reasons:['Unknown game action.'],cost:{blood:0,majorActions:1},permission:null,description:''};
  const spec=ACTIONS[kind as GameAction],reasons:string[]=[];
  const free=!!s.politics&&['learn_seraphine','discuss_exchange','investigate_bloodline','investigate_expiry'].includes(kind);
  if(s.status!=='playing')reasons.push('Campaign ended.');
  if(!free&&s.actionsLeft<1)reasons.push('No major actions remain.');
  if(isFinalAction(kind))reasons.push(...finalReasons(s,kind,w));
  if(isLibraryAction(kind))reasons.push(...libraryReasons(s,kind,w));
  if(Object.hasOwn(POLITICAL_ACTIONS,kind))reasons.push(...politicalReasons(s,kind,w));
  if(!free&&s.resources.blood<spec.blood)reasons.push(`Insufficient Blood: need ${spec.blood}, current ${s.resources.blood}.`);
  if(spec.property){const denied=roomDenial(w,spec.property);if(denied)reasons.push(`${spec.property}: ${denied}`);}
  if(spec.once&&s.discoveries.some(d=>d.id===kind))reasons.push('Completed — this opportunity is exhausted.');
  if(kind==='investigate_expiry'&&!w.leases.some(l=>l.status==='accepted'))reasons.push('Requires an accepted lease to investigate.');
  if(kind==='discuss_exchange'&&!s.discoveries.some(d=>d.id==='learn_seraphine'))reasons.push('First learn what Seraphine wants.');
  if(kind==='rest'&&s.resources.blood===12)reasons.push('Already fully rested.');
  return {kind,label:spec.label,allowed:!reasons.length,reasons,cost:{blood:free?0:spec.blood,majorActions:free?0:1},permission:spec.property??null,description:free?'Free information: inspect this record once; rereading it is always free.':s.politics&&kind==='investigate_title'?'Cost 1 Blood; publicly file your verified Library title to qualify for sanctuary negotiations. This grants no rights.':spec.description};
}
export function validateAction(s:Campaign,proposal:GameProposal,w:Authority):Availability{
  if(!proposal||Object.keys(proposal).length!==1||typeof proposal.kind!=='string')throw new Error('Invalid action proposal.');
  const result=actionAvailability(s,proposal.kind,w);if(!result.allowed)throw new Error(result.reasons.join(' '));return result;
}
export function availableActions(s:Campaign,w:Authority){return Object.keys(ACTIONS).filter(kind=>(s.politics||!Object.hasOwn(POLITICAL_ACTIONS,kind))&&(!isLibraryAction(kind)||s.politics?.library)&&(!isFinalAction(kind)||s.politics?.finalCourt)).map(kind=>actionAvailability(s,kind,w));}
export function playerAction(s:Campaign,kind:GameAction,w:Authority):Campaign{
  const validation=validateAction(s,{kind},w),next=structuredClone(s);if(validation.cost.majorActions)spendAction(next);next.resources.blood-=validation.cost.blood;
  if(next.politics){
    if(isFinalAction(kind)&&next.politics.finalCourt)next.politics.finalCourt.response=kind==='final_accept'?'accept':kind==='final_counter'?'counter':'refuse';
    if(next.politics.library&&(kind==='authorize_mirelle'||kind==='authorize_dorian')){next.politics.library.chosen=kind==='authorize_mirelle'?'mirelle':'dorian';next.politics.library.authorizedNight=s.night;}
    if(kind==='petition_marius')next.politics.appointment='player';
    if(kind==='fulfil_service')next.politics.serviceFulfilled=true;
    if(kind==='investigate_title')next.politics.titleFiled=true;
    if(kind==='secure_dossier')next.politics.dossier='player';
    if(kind==='broker_passage')next.politics.passageRequested=true;
  }
  if(kind==='feed'){next.resources.blood+=4;}
  if(kind==='rest'){next.resources.blood+=2;}
  if(ACTIONS[kind].once){
    const discovery:Discovery={id:kind,summary:'',source:'contract-view',observedNight:w.night,facts:{},futureOpportunity:false};
    if(kind==='investigate_title'){discovery.summary='The Library has its own owner. Bloodline ancestry does not transfer this title.';discovery.facts={property:w.properties.find(p=>p.id==='library')};}
    if(kind==='investigate_bloodline'){discovery.summary='Crypt shelter follows explicit grants, not ancestry. A revoked ancestor invalidates dependent grants.';discovery.facts={ancestry:w.ancestry,grants:w.grants.map((g,i)=>({...g,effective:w.grant_validity?.[i]??null})).filter(g=>g.property_id==='crypt')};}
    if(kind==='investigate_expiry'){discovery.summary='The lease grants entry until its recorded end night; settlement does not extend it.';discovery.facts={leases:w.leases.filter(l=>l.status==='accepted').map(l=>({id:l.id,owner:l.owner,buyer:l.buyer,endNight:l.end_night}))};}
    if(kind==='learn_seraphine'){discovery.summary='Seraphine values independent tenancy and respect for her property. She will not give ownership with access.';discovery.source='local-scenario';discovery.facts={character:'seraphine',interest:'independent tenancy',proposedScope:'enter'};}
    if(kind==='discuss_exchange'){discovery.summary='Possible future negotiation: discuss exchanging scoped Library and Lounge access. No agreement, support, delegation or vote has been granted.';discovery.source='local-scenario';discovery.futureOpportunity=true;discovery.facts={parties:['player','seraphine'],properties:['library','lounge'],status:'requires future negotiation'};}
    next.discoveries.push(discovery);log(next,discovery.summary);
  }
  log(next,`Night ${s.night+1}: ${ACTIONS[kind].label}.`);assess(next);return next;
}
export function dawn(s:Campaign,w:Authority):Campaign{
  requirePlaying(s);if(w.night!==s.night)throw new Error('Contract night mismatch.');
  const next=structuredClone(s),sheltered=s.politics?hasShelter(w):w.access.crypt,cost=sheltered?1:3;next.resources.blood=Math.max(0,next.resources.blood-cost);next.night++;next.actionsLeft=next.night<7?(s.actionLimit??3):0;
  log(next,`Dawn ${next.night}: ${cost} Blood upkeep (${sheltered?'verified shelter':'no shelter'}).`);assess(next);if(next.status!=='playing')log(next,next.reason);return next;
}

export function inspectRights(w:Authority,account:string){
  return {backing:'NEAR contract view',account,night:w.night,
    properties:w.properties.map(p=>({...p,canExercise:w.access[p.id]===true,owned:p.owner===account,scope:'enter',ownershipAllowsDelegation:p.owner===account,denial:roomDenial(w,p.id)})),
    grants:w.grants.map((g,i)=>({...g,effective:w.grant_validity?.[i]??null,delegationSource:w.grant_validity?.[i]===true&&g.grantee===account&&g.can_delegate,mayRevoke:g.grantor===account&&!g.revoked})),
    leases:w.leases,ancestry:w.ancestry,
    limits:'Delegation candidates are subject to scope, grantee, expiry, depth, capacity and nonce validation by grant_access. Lease rights grant entry only. Ancestry grants no authority.',
    politicalSupport:'Not implemented; discoveries and relationships grant no votes.',votingAuthority:'Not implemented; legacy seats are local historical data.'};
}

