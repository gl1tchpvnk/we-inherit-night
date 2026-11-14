import type {FinalCourt} from './finalCourt';
import type {LibraryDispute} from './library';
import type {Authority,Campaign} from './game';

// New gameplay assignments, not inferred genealogy or historical holdings.
export interface Politics {
  library?:LibraryDispute;
  finalCourt?:FinalCourt;
  accounts:Record<string,string>;
  seed:number;
  appointment:'open'|'player'|'cassian';
  dossier:'open'|'player'|'dorian';
  titleFiled:boolean;
  archiveLead:boolean;
  serviceFulfilled:boolean;
  passageRequested:boolean;
  encounters:{night:number;actor:string;action:string;roll:number}[];
}
export function seededRoll(seed:number,night:number,actor:string):number {
  let n=(seed^Math.imul(night+1,0x9e3779b1))>>>0;
  for(const c of actor)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;
  n^=n>>>16;return (n>>>0)/4294967296;
}
export function newPolitics(id:string):Politics {
  let seed=2166136261;for(const c of id)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
  return {accounts:{},seed,appointment:'open',dossier:'open',titleFiled:false,archiveLead:false,serviceFulfilled:false,passageRequested:false,encounters:[]};
}
export const POLITICAL_ACTIONS={
  petition_marius:{label:'Serve Marius — accept an appointment',description:'Cost 1 Blood. Claim the finite administrative service. Marius may grant revocable protection at reckoning. Fulfil the obligation during Nights 4–5 or lose it.',blood:1},
  sanctuary_pact:{label:'Accept Seraphine’s sanctuary covenant',description:'Requires a filed title or secured dossier. Pay 0.02 Sandbox NEAR for seven nights of non-revocable sanctuary access; no ownership. Offer closes after Night 3.',blood:0},
  fulfil_service:{label:'Fulfil the administrative obligation',description:'Requires Marius’s protection, Nights 4–5. Cost 1 Blood and this night’s opportunity; retains the revocable patron relationship.',blood:1},
  secure_dossier:{label:'Secure the contested archive dossier',description:'Cost 1 Blood. Requires Mirelle’s public lead; compete with Dorian. Opens sanctuary negotiations but grants no right.',blood:1,property:'library'},
  broker_passage:{label:'Commission Lucien’s escape passage',description:'Cost 1 Blood. Requires Mirelle’s lead. Lucien may delegate temporary protection until Night 6; this is a bridge, not an ending.',blood:1}
} as const;
export type PoliticalAction=keyof typeof POLITICAL_ACTIONS;
export function politicalReasons(s:Campaign,kind:string,w:Authority):string[]{
  const p=s.politics;if(!p)return ['Requires a new Pass 2C campaign.'];
  const r:string[]=[];
  if(kind==='petition_marius'&&(p.appointment!=='open'||s.night>=3))r.push('The appointment is already claimed or closed.');
  if(kind==='sanctuary_pact'){
    if(!p.titleFiled&&p.dossier!=='player')r.push('First file your Library title or secure the dossier.');
    const l=w.leases.find(l=>l.property_id==='sanctuary');
    if(!l||l.status!=='offered'||w.night>=l.offer_expiry_night)r.push('The sanctuary offer is unavailable or expired.');
  }
  if(kind==='fulfil_service'&&(p.appointment!=='player'||p.serviceFulfilled||!w.access.court||s.night<3||s.night>=5))r.push('Requires active patron protection and an unfulfilled obligation during Nights 4–5.');
  if(kind==='secure_dossier'&&(!p.archiveLead||p.dossier!=='open'||s.night>=4))r.push('No available archive lead; dossier claimed or deadline passed.');
  if(kind==='broker_passage'&&(!p.archiveLead||p.passageRequested||s.night>=3))r.push('Requires a public lead and an unclaimed passage before Night 4.');
  return r;
}
export function hasShelter(w:Authority){return ['crypt','sanctuary','court','passage'].some(id=>w.access[id]===true);}
export function politicalEnding(s:Campaign,w:Authority):void {
  if(!s.politics||s.status==='defeat')return;
  if(s.night>=3&&!hasShelter(w)){
    s.status='defeat';s.ending='failure';s.reason='FAILURE — no enforceable shelter remains after Vesper’s ultimatum: Crypt, sanctuary, court and passage are all inaccessible. Library ownership and Crimson Lounge entry are ordinary access, not shelter; they may remain valid despite this defeat.';return;
  }
  if(s.night<7)return;
  const player=w.leases.find(l=>l.id===0)?.buyer;
  const sanctuary=w.leases.find(l=>l.property_id==='sanctuary'&&l.buyer===player&&l.status==='accepted'&&l.end_night!==null&&l.end_night>w.night);
  if(w.access.sanctuary&&sanctuary&&w.properties.some(p=>p.id==='library'&&p.owner===player)){
    s.status='concluded';s.ending='unbound';s.reason=`THE UNBOUND — your Library title and non-revocable sanctuary lease survive Vesper. Sanctuary lasts through the final night, but remains temporary access, not ownership.`;
  }else if(s.politics.library&&w.access.passage&&w.grants.some(g=>g.property_id==='passage'&&g.grantee===player&&g.grantor===s.politics!.accounts.lucien&&g.expiry_night===null&&w.grant_validity?.[w.grants.indexOf(g)])){
    s.status='concluded';s.ending='favoured';s.reason='THE FAVOURED — Lucien protects you beyond the temporary passage. His independent grant remains revocable by him, not by Vesper or by withdrawing your Library permission.';
  }else if(w.access.court){
    s.status='concluded';s.ending='favoured';s.reason='THE FAVOURED — Marius’s effective grant protects you. You remain dependent: its issuer may revoke it.';
  }else{s.status='defeat';s.ending='failure';s.reason='FAILURE — no qualifying independent sanctuary or institutional protection remains. Night 7 requires Library ownership plus an effective sanctuary lease, or effective court protection. Ordinary Lounge/Library entry and temporary passage do not satisfy either ending.';}
}
