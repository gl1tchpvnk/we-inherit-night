import type {Authority,Campaign,NpcName} from './game';

// Pass 2H provisional political assignments. Rights always come from the ledger.
export interface LibraryDispute {chosen:'mirelle'|'dorian'|null;authorizedNight:number|null;result:'open'|'mirelle'|'dorian';challenged:boolean}
export const LIBRARY_ACTIONS={
  authorize_mirelle:{label:'Give Mirelle Library access',description:'Let Mirelle bring Cassian to investigate. Her findings can satisfy Marius’s service and earn institutional protection. You may revoke your permission and its dependent grants.',blood:0,property:'library'},
  authorize_dorian:{label:'Give Dorian Library access',description:'Let Dorian bring Lucien into your Library. His findings can earn Lucien’s lasting protection. Both gain access under your authority; published findings cannot be recalled.',blood:0,property:'library'},
  withdraw_library:{label:'Withdraw your Library permission',description:'Remove the access you granted and its dependent permissions. Unfinished research stops. Published findings and unrelated patron protection remain.',blood:0,property:'library'}
} as const;
export type LibraryAction=keyof typeof LIBRARY_ACTIONS;
export type LibraryNpcAction='archive_assist'|'archive_research'|'archive_challenge'|'archive_protect';
export interface LibraryOperation {method:'grant_access'|'revoke_grant'|'enter_room';args:Record<string,string|number|boolean|null>}
export const isLibraryAction=(kind:string):kind is LibraryAction=>Object.hasOwn(LIBRARY_ACTIONS,kind);
export const isLibraryNpcAction=(kind:string):kind is LibraryNpcAction=>['archive_assist','archive_research','archive_challenge','archive_protect'].includes(kind);
const accounts=(s:Campaign)=>s.politics!.accounts;
export function effectiveGrant(w:Authority,grant:Authority['grants'][number]){return w.grant_validity?.[w.grants.indexOf(grant)]===true;}
export function libraryRoot(s:Campaign,w:Authority){
  const actor=s.politics?.library?.chosen;
  return actor?w.grants.slice().reverse().find(g=>g.property_id==='library'&&g.grantor===accounts(s).player&&g.grantee===accounts(s)[actor]&&g.parent_grant_id===null&&g.can_delegate&&g.expiry_night===null&&!g.revoked):undefined;
}
export function libraryReasons(s:Campaign,kind:LibraryAction,w:Authority):string[]{
  if(!s.politics?.library)return ['Requires a new Living Court campaign.'];
  if(w.properties.find(p=>p.id==='library')?.owner!==accounts(s).player)return ['You do not own the Library.'];
  if(s.night<3)return ['The Library petitions arrive after Vesper’s ultimatum.'];
  const root=libraryRoot(s,w);
  if(kind==='withdraw_library')return root?[]:['No permission of yours remains to withdraw.'];
  if(s.night>=6)return ['There is no time left for a new investigation.'];
  if(s.politics.library.result!=='open')return ['The investigation is already published.'];
  return root?['Withdraw your current delegation before choosing another investigator.']:[];
}
export function libraryPlayerOperation(s:Campaign,kind:LibraryAction,w:Authority):LibraryOperation{
  const reasons=libraryReasons(s,kind,w);if(reasons.length)throw new Error(reasons.join(' '));
  if(kind==='withdraw_library')return {method:'revoke_grant',args:{grant_id:libraryRoot(s,w)!.id}};
  return {method:'grant_access',args:{property_id:'library',scope:'enter',grantee:accounts(s)[kind==='authorize_mirelle'?'mirelle':'dorian'],parent_grant_id:null,can_delegate:true,expiry_night:null}};
}
function assistant(s:Campaign){return s.politics!.library!.chosen==='mirelle'?'cassian':'lucien';}
function assistantGrant(s:Campaign,w:Authority){const root=libraryRoot(s,w);return w.grants.find(g=>g.parent_grant_id===root?.id&&g.grantee===accounts(s)[assistant(s)]&&g.property_id==='library');}
export function timelyLibraryPetition(s:Campaign,w:Authority):boolean{
  const root=libraryRoot(s,w);
  return !!root&&effectiveGrant(w,root)&&s.night<=3;
}
export function libraryNpcReasons(actor:NpcName,kind:LibraryNpcAction,s:Campaign,w:Authority):string[]{
  const d=s.politics?.library;if(!d)return ['No Library dispute.'];
  const root=libraryRoot(s,w),a=accounts(s);
  // Preserve validity of already-journaled local petitions from older saves.
  // New policy observations omit petitions that can no longer lead to a switch.
  if(kind==='archive_challenge')return actor==='dorian'&&d.chosen==='mirelle'&&!d.challenged&&d.result==='open'?[]:['No rival petition.'];
  if(kind==='archive_protect'){
    const property=actor==='marius'?'court':'passage',winner=actor==='marius'?'mirelle':'dorian';
    return (actor==='marius'||actor==='lucien')&&d.result===winner&&w.properties.some(p=>p.id===property&&p.owner===a[actor])&&!w.grants.some(g=>g.property_id===property&&g.grantor===a[actor]&&g.grantee===a.player&&g.expiry_night===null&&effectiveGrant(w,g))?[]:['No available patron reward.'];
  }
  if(actor!==d.chosen||d.result!=='open'||!root||!effectiveGrant(w,root)||!w.access.library)return ['No current investigative authority.'];
  if(kind==='archive_assist')return assistantGrant(s,w)?['Assistant already appointed.']:[];
  const child=assistantGrant(s,w);
  return child&&effectiveGrant(w,child)&&d.authorizedNight!==null&&s.night>d.authorizedNight?[]:['Research needs an authorized assistant and a subsequent night.'];
}
export function libraryNpcOperation(actor:NpcName,kind:LibraryNpcAction,s:Campaign,w:Authority):LibraryOperation|null{
  if(kind==='archive_challenge')return null;
  if(kind==='archive_research')return {method:'enter_room',args:{property_id:'library'}};
  const root=libraryRoot(s,w);
  return {method:'grant_access',args:{property_id:kind==='archive_protect'?(actor==='marius'?'court':'passage'):'library',scope:'enter',grantee:accounts(s)[kind==='archive_protect'?'player':assistant(s)],parent_grant_id:kind==='archive_protect'?null:root?.id??null,can_delegate:false,expiry_night:null}};
}
export function operationConfirmed(w:Authority,op:LibraryOperation,issuer:string):boolean{
  if(op.method==='enter_room')return false; // Execution journal verifies the actor nonce.
  if(op.method==='revoke_grant')return w.grants.some(g=>g.id===op.args.grant_id&&g.grantor===issuer&&g.revoked);
  return w.grants.some(g=>g.grantor===issuer&&!g.revoked&&effectiveGrant(w,g)&&Object.entries(op.args).every(([key,value])=>g[key as keyof typeof g]===value));
}
