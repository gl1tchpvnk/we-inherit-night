import {isFinalNpcAction,finalNpcReasons,finalAccepted,cassianPassage,PASSAGE_PRICE,type FinalNpcAction} from './finalCourt.ts';
import {isLibraryNpcAction,libraryNpcReasons,timelyLibraryPetition,type LibraryNpcAction} from './library.ts';
import type {Authority, Campaign, NpcName} from './game.ts';
import {log, requirePlaying} from './game.ts';
import {seededRoll,type Politics} from './politics.ts';

export type NpcAction = 'revoke'|'collect'|'offer'|'pass'|'appoint'|'dismiss'|'open_passage'|'publish'|'compete'|'sponsor'|'collect_sanctuary'|LibraryNpcAction|FinalNpcAction;
export interface NpcProposal {kind:NpcAction}
export interface AgentDefinition {
  name:string; goal:string; personality:string; allowedActions:readonly NpcAction[];
}
// Behaviour is provisional; profiles confer no holdings, genealogy or authority.
export const AGENTS:Readonly<Record<NpcName,AgentDefinition>> = {
  vesper:{name:'Lady Vesper',personality:'Calculating traditionalist',goal:'Preserve the ruling dynasty and obedience.',allowedActions:['revoke','pass']},
  seraphine:{name:'Seraphine Volari',personality:'Pragmatic rebel',goal:'Preserve independence and honor agreed commercial terms.',allowedActions:['offer','collect','collect_sanctuary','pass']},
  lucien:{name:'Lucien',personality:'Opportunistic diplomat',goal:'Trade temporary escape access for a public political connection; external to House Volari.',allowedActions:['passage_offer','passage_collect','archive_protect','open_passage','pass']},
  marius:{name:'Marius Volari',personality:'TBD; institutional policy only',goal:'Exchange institutional protection for completed administrative service.',allowedActions:['final_answer','archive_protect','appoint','dismiss','pass']},
  cassian:{name:'Cassian',personality:'Provisional disgraced courtier',goal:'Secure the available administrative appointment.',allowedActions:['passage_buy','compete','pass']},
  mirelle:{name:'Mirelle',personality:'Provisional archivist',goal:'Publish an archive lead while her Library permission is valid.',allowedActions:['archive_assist','archive_research','publish','pass']},
  dorian:{name:'Dorian',personality:'Provisional opportunist',goal:'Claim the finite dossier before a rival.',allowedActions:['archive_assist','archive_research','archive_challenge','compete','pass']},
  sabine:{name:'Sabine',personality:'Provisional intermediary',goal:'Use her delegated institutional access to sponsor Cassian.',allowedActions:['sponsor','pass']}
};
export const NPC_ORDER:readonly NpcName[] = ['vesper','seraphine','lucien'];
export const COURT_ORDER:readonly NpcName[] = ['vesper','seraphine','mirelle','cassian','dorian','marius','lucien','sabine'];
export interface AgentEvent {
  night:number; actor:NpcName; kind:NpcAction; source:'deterministic-policy'|'fallback'|'llm';
  decisionId?:string; proposal?:DecisionProposal; validation?:'accepted'|'fallback'; execution?:'pending'|'confirmed'|'local'|'failed'; detail?:string;attempts?:number;model?:string;rejectedProposal?:DecisionProposal;
  outcome:'confirmed'|'passed'|'proposed';
}
export interface AgentObservation {
  politics?:Pick<Politics,'seed'>;
  actor:NpcName; account:string; night:number; revision:number;
  observationId:string; agreements:Agreement[]; available:DecisionProposal[];
  self:{relationships:Campaign['npcs'][NpcName]['relationships'];memory:string[]};
  publicState:Pick<Authority,'properties'|'ancestry'|'grants'|'grant_validity'|'leases'>;
  ownAccess:Record<string,boolean>;
}
export type NpcSelector = (observation:Readonly<AgentObservation>)=>NpcProposal;

// The server binds account and supplies get_world for THAT account. Public ledger
// records are not secrets. Player discoveries/resources and other NPC memory are.
export function observeAgent(actor:NpcName,account:string,s:Campaign,w:Authority):AgentObservation {
  if(!Object.hasOwn(AGENTS,actor)||!account)throw new Error('Invalid NPC identity.');
  if(s.politics&&s.politics.accounts[actor]!==account)throw new Error('Court identity mismatch.');
  return structuredClone({actor,account,night:w.night,revision:s.revision,
    ...(s.politics?{politics:{seed:s.politics.seed}}:{}),
    self:{relationships:s.npcs[actor].relationships,memory:s.npcs[actor].memory},
    publicState:{properties:w.properties,ancestry:w.ancestry,grants:w.grants,grant_validity:w.grant_validity,leases:w.leases},
    ownAccess:w.access,observationId:`${s.id}:${s.night}:${actor}`,agreements:(s.agreements??[]).filter(a=>a.actor===actor),
    available:AGENTS[actor].allowedActions.flatMap(kind=>{
      if(kind==='archive_challenge'&&!timelyLibraryPetition(s,w))return [];
      try{validateNpc(actor,{kind},s,w,account);return [decisionProposal(actor,kind,s,w)];}catch{return [];}
    })});
}

export const selectNpcAction:NpcSelector=o=>{
  if(o.politics){
    const available=(kind:NpcAction)=>o.available.some(p=>p.kind===kind);
    if(o.actor==='dorian'&&available('archive_challenge')&&!petitionHasShelter(o.publicState,o.night))return {kind:'pass'};
    // Seeded competition is bounded and reproducible; it cannot mint permissions.
    for(const kind of POLICY_PRIORITIES[o.actor]){
      if(available(kind)&&(kind!=='compete'||o.night>=2||seededRoll(o.politics.seed,o.night,o.actor)<0.55))return {kind};
    }
    return {kind:'pass'};
  }
  const grant=o.publicState.grants.find(g=>g.id===0),lease=o.publicState.leases.find(l=>l.id===0);
  if(o.actor==='vesper'&&lease?.status==='accepted'&&grant?.grantor===o.account&&!grant.revoked)return {kind:'revoke'};
  if(o.actor==='seraphine'&&o.available.some(p=>p.kind==='offer'))return {kind:'offer'};
  if(o.actor==='seraphine'&&lease?.owner===o.account&&lease.status==='accepted'&&!lease.settled&&!lease.payout_pending&&BigInt(lease.escrow_yocto)>0n)return {kind:'collect'};
  return {kind:'pass'};
};

// Public Library ownership identifies the player; no private resources or decisions.
// A switch costs two commitments. Public grants cannot establish fulfilled private service.
// Conservatively exclude conditional court protection; never infer safety from no expiry.
export function petitionHasShelter(w:AgentObservation['publicState'],night:number):boolean{
  const player=w.properties.find(p=>p.id==='library')?.owner;
  if(!player||night>=7)return false;
  return w.leases.some(l=>l.property_id==='sanctuary'&&l.buyer===player&&l.status==='accepted'&&l.end_night!==null&&l.end_night>7)
    ||w.grants.some((g,i)=>g.property_id==='passage'&&g.grantee===player&&g.scope==='enter'&&!g.revoked&&w.grant_validity?.[i]===true&&(g.expiry_night===null||g.expiry_night>7)&&night<7);
}

// Each policy pursues its own legitimate opportunities. Availability is computed
// by the validator; the selector never receives the player's private politics.
export const POLICY_PRIORITIES:Record<NpcName,readonly NpcAction[]>={
  vesper:['revoke'],seraphine:['collect_sanctuary','collect','offer'],
  marius:['final_answer','dismiss','archive_protect','appoint'],lucien:['passage_collect','archive_protect','passage_offer','open_passage'],
  mirelle:['archive_assist','archive_research','publish'],
  dorian:['archive_assist','archive_research','archive_challenge','compete'],
  cassian:['passage_buy','compete'],sabine:['sponsor']
};

// This is the single NPC validator, shared by fallback and future decision sources.
// Targets stay fixed to the established scenario; no arbitrary signing surface.
export function validateNpc(actor:NpcName,p:NpcProposal,s:Campaign,w:Authority,account:string){
  if(!Object.hasOwn(AGENTS,actor)||!account||!p||typeof p!=='object'||Object.keys(p).length!==1||!Object.hasOwn(p,'kind'))throw new Error('Invalid NPC proposal or identity.');
  if(s.politics&&s.politics.accounts[actor]!==account)throw new Error('Court identity mismatch.');
  if(!AGENTS[actor].allowedActions.includes(p.kind))throw new Error('NPC action not allowed.');
  requirePlaying(s);
  if(w.night!==s.night||s.night>=7)throw new Error('NPC decision expired: contract night mismatch.');
  if(s.agentHistory.some(e=>e.actor===actor&&e.night===s.night))throw new Error('NPC already scheduled this night.');
  const grant=w.grants.find(g=>g.id===0),lease=w.leases.find(l=>l.id===0);
  // Revocation needs original grantor, NOT effective access: even an expired
  // grant can be revoked by its issuer in the existing Rust contract.
  if(p.kind==='revoke'&&!((s.politics?s.night>=2:lease?.status==='accepted')&&grant?.property_id==='crypt'&&grant.grantor===account&&!grant.revoked))throw new Error('No authorized retaliation.');
  if(isFinalNpcAction(p.kind)){const reasons=finalNpcReasons(actor,p.kind,s,w);if(reasons.length)throw new Error(reasons.join(' '));}
  if(isLibraryNpcAction(p.kind)){const reasons=libraryNpcReasons(actor,p.kind,s,w);if(reasons.length)throw new Error(reasons.join(' '));}
  if(p.kind==='offer'){
    if(s.politics?.library)throw new Error('Lounge invitation replaces the primary tenancy offer in this campaign.');
    if(s.agreements?.some(a=>a.leaseId===0)||!lease||lease.status!=='offered'||lease.owner!==account||w.properties.find(p=>p.id===lease.property_id)?.owner!==account||w.night>=lease.offer_expiry_night||lease.property_id!=='lounge'||lease.duration_nights!==3||lease.price_yocto!==RENT)throw new Error('No authorized available agreement.');
  }
  if(p.kind==='collect'&&!(lease?.owner===account&&lease.status==='accepted'&&!lease.settled&&!lease.payout_pending&&BigInt(lease.escrow_yocto)>0n))throw new Error('No authorized collectible rent.');
  if(['appoint','dismiss','open_passage','publish','compete','sponsor','collect_sanctuary'].includes(p.kind))validateCourtAction(actor,p.kind,s,w,account);
}

export function courtGrant(s:Campaign,w:Authority,kind:NpcAction){
  const accounts=s.politics?.accounts??{};
  const property=kind==='open_passage'?'passage':'court';
  const recipient=kind==='sponsor'?'cassian':kind==='appoint'?(s.politics?.appointment==='cassian'?'cassian':'player'):'player';
  const issuer=kind==='sponsor'?'sabine':kind==='open_passage'?'lucien':'marius';
  return w.grants.find(g=>g.property_id===property&&g.grantee===accounts[recipient]&&g.grantor===accounts[issuer]);
}
function validateCourtAction(actor:NpcName,kind:NpcAction,s:Campaign,w:Authority,account:string){
  const p=s.politics;if(!p||p.accounts[actor]!==account)throw new Error('Court identity mismatch.');
  const owner=(id:string)=>w.properties.find(p=>p.id===id)?.owner===account;
  const live=(g:Authority['grants'][number])=>w.grant_validity?.[w.grants.indexOf(g)]===true;
  if(kind==='appoint'&&!(actor==='marius'&&p.appointment!=='open'&&owner('court')&&!courtGrant(s,w,kind)&&s.night<3))throw new Error('No appointment authority or available service.');
  if(kind==='dismiss'){
    const g=courtGrant(s,w,kind);
    if(!(actor==='marius'&&g&&g.grantor===account&&!g.revoked&&p.appointment==='player'&&!p.serviceFulfilled&&s.night>=5))throw new Error('No breached obligation to revoke.');
  }
  if(kind==='open_passage'&&!(actor==='lucien'&&p.passageRequested&&owner('passage')&&!courtGrant(s,w,kind)&&s.night<3))throw new Error('No passage agreement.');
  if(kind==='publish'&&!(actor==='mirelle'&&!p.archiveLead&&w.access.library))throw new Error('No authorized archive lead.');
  if(kind==='compete'&&s.politics?.library&&actor==='dorian')throw new Error('Dorian now pursues the Library dispute.');
  if(kind==='compete'&&!((actor==='cassian'&&p.appointment==='open'&&s.night>=1&&s.night<3)||(actor==='dorian'&&p.archiveLead&&p.dossier==='open'&&s.night>=2&&s.night<4)))throw new Error('Finite opportunity unavailable.');
  if(kind==='sponsor'&&!(actor==='sabine'&&s.night>=1&&!courtGrant(s,w,kind)&&w.grants.some(g=>g.property_id==='court'&&g.grantee===account&&g.can_delegate&&live(g))))throw new Error('No valid delegable sponsorship.');
  if(kind==='collect_sanctuary'&&!w.leases.some(l=>l.id===1&&l.property_id==='sanctuary'&&l.owner===account&&l.status==='accepted'&&!l.settled&&!l.payout_pending&&BigInt(l.escrow_yocto)>0n))throw new Error('No sanctuary rent to collect.');
}
// Arguments are derived from trusted state and fixed actions, never a caller's method/target.
export function courtOperation(actor:NpcName,kind:NpcAction,s:Campaign,w:Authority){
  const p=s.politics!;
  if(kind==='dismiss')return {method:'revoke_grant',args:{grant_id:courtGrant(s,w,kind)!.id}};
  if(kind==='collect_sanctuary')return {method:'claim_rent',args:{lease_id:1}};
  if(['appoint','open_passage','sponsor'].includes(kind)){
    const parent=kind==='sponsor'?w.grants.find((g,i)=>g.property_id==='court'&&g.grantee===p.accounts[actor]&&g.can_delegate&&w.grant_validity?.[i]):null;
    return {method:'grant_access',args:{property_id:kind==='open_passage'?'passage':'court',scope:'enter',grantee:p.accounts[kind==='sponsor'?'cassian':kind==='appoint'&&p.appointment==='cassian'?'cassian':'player'],parent_grant_id:parent?.id??null,can_delegate:false,expiry_night:kind==='open_passage'?5:null}};
  }
  return null;
}
export function courtConfirmed(s:Campaign,w:Authority,kind:NpcAction){
  if(kind==='collect_sanctuary')return w.leases.find(l=>l.id===1)?.settled===true;
  const g=courtGrant(s,w,kind);
  if(kind==='dismiss')return g?.revoked===true;
  return !!g&&w.grant_validity?.[w.grants.indexOf(g)]===true&&!g.can_delegate&&g.expiry_night===(kind==='open_passage'?5:null)&&(kind==='sponsor'?g.parent_grant_id!==null:g.parent_grant_id===null);
}

export function applyNpc(s:Campaign,actor:NpcName,p:NpcProposal,w:Authority,account:string,source:AgentEvent['source']='deterministic-policy'):Campaign{
  validateNpc(actor,p,s,w,account);const next=structuredClone(s),n=next.npcs[actor];
  if(next.politics?.library){
    if(p.kind==='archive_challenge')next.politics.library.challenged=true;
    if(p.kind==='archive_research'){next.politics.library.result=actor as 'mirelle'|'dorian';if(actor==='mirelle')next.politics.serviceFulfilled=true;}
  }
  if(next.politics){
    if(p.kind==='final_answer'&&next.politics.finalCourt)next.politics.finalCourt.result=finalAccepted(s,w)?'accepted':'rejected';
    next.politics.encounters.push({night:s.night,actor,action:p.kind,roll:seededRoll(next.politics.seed,s.night,actor)});
    if(p.kind==='publish')next.politics.archiveLead=true;
    if(p.kind==='compete'&&actor==='cassian')next.politics.appointment='cassian';
    if(p.kind==='compete'&&actor==='dorian')next.politics.dossier='dorian';
    if(p.kind!=='pass'){const event=`${AGENTS[actor].name}: ${p.kind} (${['publish','compete','offer','final_answer'].includes(p.kind)?'political simulation':'verified NEAR consequence'}).`;n.memory.push(event);n.memory=n.memory.slice(-12);log(next,event);}
  }
  if(p.kind==='revoke')n.relationships.player=Math.max(-5,n.relationships.player-2);
  if(p.kind==='collect')n.relationships.player=Math.min(5,n.relationships.player+1);
  next.agentHistory.push({night:s.night,actor,kind:p.kind,source,outcome:p.kind==='pass'?'passed':p.kind==='offer'?'proposed':'confirmed'});
  if(p.kind==='offer'){next.agreements.push(agreementFrom(s,w,source));log(next,'Seraphine proposes the existing Lounge lease. Inspect its terms before deciding.');}
  if(p.kind==='revoke'||p.kind==='collect'){
    const event=p.kind==='revoke'?'Vesper revokes her Crypt grant (verified NEAR action).':'Seraphine collects agreed rent (verified NEAR action).';
    n.memory.push(event);n.memory=n.memory.slice(-12);log(next,event);
  }
  return next; // Runner commits this only after confirming the chain postcondition.
}


export const RENT='20000000000000000000000';
export interface DecisionProposal {
  actor:NpcName; kind:NpcAction; target:string; observationId:string;
  parameters:{leaseId:number|null;grantId:number|null;priceYocto:string;durationNights:number;expiryNight:number|null};
  dialogue:string; rationale:string;
}
export interface Agreement {
  id:string; actor:'seraphine';recipient:string;leaseId:0;property:'lounge';
  priceYocto:string;durationNights:3;expiryNight:number;proposedNight:number;
  operation:'accept_lease';conditions:string;source:AgentEvent['source'];dialogue:string;
  status:'pending'|'accepted'|'rejected'|'expired'|'unavailable';result?:string;
}
export function decisionProposal(actor:NpcName,kind:NpcAction,s:Campaign,w:Authority):DecisionProposal {
  const l=w.leases.find(l=>l.id===0);
  const target=isFinalNpcAction(kind)?(kind==='final_answer'?'court':'passage'):isLibraryNpcAction(kind)?(kind==='archive_protect'?(actor==='marius'?'court':'passage'):'library'):kind==='pass'?'none':kind==='revoke'?'crypt':kind==='open_passage'?'passage':['appoint','dismiss','sponsor'].includes(kind)?'court':kind==='collect_sanctuary'?'sanctuary':['publish','compete'].includes(kind)?'opportunity':'lounge';
  return {actor,kind,target,observationId:`${s.id}:${s.night}:${actor}`,
    parameters:{leaseId:kind==='passage_buy'||kind==='passage_collect'?cassianPassage(s,w)?.id??null:kind==='offer'||kind==='collect'?0:kind==='collect_sanctuary'?1:null,grantId:kind==='revoke'?0:kind==='dismiss'?courtGrant(s,w,kind)?.id??null:null,
      priceYocto:kind.startsWith('passage_')?PASSAGE_PRICE:kind==='offer'?l?.price_yocto??'':'0',durationNights:kind.startsWith('passage_')?3:kind==='offer'?l?.duration_nights??0:0,expiryNight:kind.startsWith('passage_')?5:kind==='offer'?l?.offer_expiry_night??null:null},dialogue:'',rationale:''};
}
function exactKeys(value:unknown,keys:string[]):value is Record<string,unknown>{
  return !!value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).length===keys.length&&keys.every(k=>Object.hasOwn(value,k));
}
export function parseDecision(value:unknown):DecisionProposal {
  if(!exactKeys(value,['actor','kind','target','observationId','parameters','dialogue','rationale'])||
    typeof value.actor!=='string'||!Object.hasOwn(AGENTS,value.actor)||!['revoke','collect','offer','pass','appoint','dismiss','open_passage','publish','compete','sponsor','collect_sanctuary','archive_assist','archive_research','archive_challenge','archive_protect','passage_offer','passage_buy','passage_collect','final_answer'].includes(String(value.kind))||
    typeof value.target!=='string'||typeof value.observationId!=='string'||value.observationId.length>200||
    typeof value.dialogue!=='string'||value.dialogue.length>280||typeof value.rationale!=='string'||value.rationale.length>280||
    !exactKeys(value.parameters,['leaseId','grantId','priceYocto','durationNights','expiryNight']))throw new Error('Invalid decision schema.');
  const p=value.parameters;
  if(![p.leaseId,p.grantId,p.expiryNight].every(n=>n===null||typeof n==='number'&&Number.isSafeInteger(n)&&n>=0)||
    typeof p.durationNights!=='number'||!Number.isSafeInteger(p.durationNights)||typeof p.priceYocto!=='string'||!/^\d{1,25}$/.test(p.priceYocto))throw new Error('Invalid decision parameters.');
  return value as unknown as DecisionProposal;
}
export function validateDecision(actor:NpcName,value:unknown,s:Campaign,w:Authority,account:string):DecisionProposal {
  const p=parseDecision(value);
  if(p.actor!==actor)throw new Error('Decision actor mismatch.');
  const expected=decisionProposal(actor,p.kind,s,w);
  if(p.observationId!==expected.observationId)throw new Error('Stale decision identifier.');
  if(p.target!==expected.target||Object.keys(expected.parameters).some(k=>p.parameters[k as keyof typeof p.parameters]!==expected.parameters[k as keyof typeof p.parameters]))throw new Error('Unsupported target or agreement terms.');
  validateNpc(actor,{kind:p.kind},s,w,account);return p;
}
function agreementFrom(s:Campaign,w:Authority,source:AgentEvent['source']):Agreement {
  const lease=w.leases.find(l=>l.id===0)!;
  return {id:`${s.id}:lease:0`,actor:'seraphine',recipient:lease.buyer,leaseId:0,property:'lounge',priceYocto:lease.price_yocto,durationNights:3,expiryNight:lease.offer_expiry_night,proposedNight:s.night,operation:'accept_lease',conditions:'Exact prepaid rent; entry only; no ownership, delegation or votes.',source,dialogue:'',status:'pending'};
}
export function validateAgreement(a:Agreement,s:Campaign,w:Authority,owner:string,player:string){
  requirePlaying(s);
  if(a.status!=='pending'||a.id!==`${s.id}:lease:0`)throw new Error('Agreement already resolved or unknown.');
  if(w.night!==s.night||w.night>=a.expiryNight)throw new Error('Agreement expired.');
  const lease=w.leases.find(l=>l.id===0);
  if(a.actor!=='seraphine'||a.recipient!==player||a.leaseId!==0||a.property!=='lounge'||a.operation!=='accept_lease'||a.priceYocto!==RENT||a.durationNights!==3||!lease||lease.owner!==owner||lease.buyer!==player||lease.status!=='offered'||lease.property_id!==a.property||lease.price_yocto!==a.priceYocto||lease.duration_nights!==a.durationNights||lease.offer_expiry_night!==a.expiryNight||w.properties.find(p=>p.id===a.property)?.owner!==owner)throw new Error('Agreement authority or terms changed.');
}
