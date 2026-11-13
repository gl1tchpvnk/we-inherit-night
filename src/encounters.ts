import {expiryDescription} from './leaseNarrative.ts';
import type {Action,Result} from './chain';
import type {GameAction,NpcName} from './game';
import {AGENTS} from './agents.ts';
import {addDirectedStory} from './story.ts';
import {addCourtReactions} from './reactiveCourt.ts';

export type SceneType='ENCOUNTER'|'NEGOTIATION'|'RECKONING'|'CAMPAIGN CONCLUSION'|'DECISION';
export interface DialogueLine {speaker:NpcName|'narrator';text:string}
export interface SceneChoice {id:string;label:string;action?:Action;inspect?:string;summary?:string[]}
export interface EncounterScene {
  id:string;type:SceneType;title:string;location:'crypt'|'library'|'lounge';
  portraits:NpcName[];lines:DialogueLine[];terms:string[];rights:string[];
  choices:SceneChoice[];compact?:boolean;outcome?:string;automatic?:boolean;completionLabel?:string;
  reactionLevel?:'minor'|'significant'|'major';
}
export interface SceneMemory {seen:string[];active:string|null;line:number;room?:string|null}
export const emptySceneMemory=():SceneMemory=>({seen:[],active:null,line:0});
export function readSceneMemory(raw:string|null):SceneMemory {
  try{const m=JSON.parse(raw??'null');if(!m||!Array.isArray(m.seen))return emptySceneMemory();return {...(m.room===null||['crypt','library','lounge'].includes(m.room)?{room:m.room}:{}),seen:m.seen.filter((id:unknown)=>typeof id==='string'&&id.length<160).slice(-120),active:typeof m.active==='string'&&m.active.length<160?m.active:null,line:Number.isInteger(m.line)?Math.max(0,Math.min(100,m.line)):0};}catch{return emptySceneMemory();}
}
export function finishScene(memory:SceneMemory,id:string):SceneMemory {
  return {...memory,seen:[...new Set([...memory.seen,id])].slice(-120),active:null,line:0};
}
export function nextScene(scenes:EncounterScene[],memory:SceneMemory):EncounterScene|undefined {
  return scenes.find(s=>s.id===memory.active)??scenes.find(s=>s.reactionLevel&&s.automatic&&!memory.seen.includes(s.id))??scenes.find(s=>s.automatic&&!memory.seen.includes(s.id));
}
export const MAJOR_VAMPIRES:NpcName[]=['vesper','seraphine','marius','lucien'];
export const ACTION_SPEAKER:Partial<Record<GameAction,NpcName>>={
 final_accept:'marius',final_refuse:'marius',final_counter:'marius',
  authorize_mirelle:'mirelle',authorize_dorian:'dorian',withdraw_library:'mirelle',petition_marius:'marius',fulfil_service:'marius',sanctuary_pact:'seraphine',broker_passage:'lucien',
  secure_dossier:'dorian',investigate_title:'mirelle',investigate_bloodline:'vesper',investigate_expiry:'seraphine',learn_seraphine:'seraphine',discuss_exchange:'seraphine'
};
const roomFor=(actor:NpcName):EncounterScene['location']=>actor==='vesper'?'crypt':['mirelle','dorian','cassian'].includes(actor)?'library':'lounge';
const line=(speaker:DialogueLine['speaker'],text:string):DialogueLine=>({speaker,text});
function amount(value:string){const n=BigInt(value);return `${n/10n**24n}.${(n%10n**24n).toString().padStart(24,'0').replace(/0+$/,'')||'0'} Sandbox NEAR`;}
function authority(r:Result,property:string):string[] {
  const p=r.world.properties.find(p=>p.id===property);
  if(!p)return [`${property}: no verified authority record available.`];
  return [`${property} · owner: ${p.owner}`,`Your current effective access: ${r.world.access[property]?'PERMITTED':'NOT PERMITTED'}.`,...r.world.grants.filter(g=>g.property_id===property).map(g=>`Grant ${g.id}: ${g.grantor} → ${g.grantee}; ${g.revoked?'revoked':r.world.grant_validity?.[r.world.grants.indexOf(g)]?'effective':'not effective'}; expiry ${g.expiry_night??'none'}.`)];
}
function characterLines(actor:NpcName,r:Result):DialogueLine[]{
  const c=r.campaign!,p=c.politics,w=r.world;
  switch(actor){
    case 'vesper':return [line(actor,w.grants[0]?.revoked?'The Crypt is closed to you. Your other arrangements are your own.':p?'Three nights. After the third reckoning, my permission ends. Decide where you will stand.':'The Crypt is yours to use while my grant remains.'),line('narrator','Vesper can withdraw her own grant. Your independent Library title lies outside it.')];
    case 'seraphine':return [line(actor,!p?'The Lounge agreement stands on its recorded terms. Let us inspect them.':w.access.sanctuary?'Your sanctuary covenant is recorded. Its protection lasts until the stated expiry.':p.titleFiled||p.dossier==='player'?'You have brought something concrete. Let us read the terms.':'Independence requires more than a declaration. File your title, or secure the archive dossier.'),line(actor,'Entry is not ownership. Read the duration before you give your answer.')];
    case 'marius':return [line(actor,p?.serviceFulfilled&&w.access.court?'Your service is fulfilled. The grant remains; so does its dependence on my authority.':p?.serviceFulfilled?'Your service is recorded, but it does not replace a valid grant. Inspect your present rights.':w.access.court?'You have institutional protection. The administrative obligation is still due during Nights Four and Five.':p?.appointment==='cassian'?'The appointment has been claimed. I will not promise it twice.':'One appointment is available. It carries protection and an obligation.'),line('narrator','This is institutional protection, not succession or a council vote.')];
    case 'lucien':return [line(actor,!p?'There is no passage agreement available in this campaign.':w.access.passage?'The passage is open to you—for now. It closes at contract night five.':p.passageRequested?'The passage you commissioned has ended. It was never a permanent settlement.':'I can arrange a temporary passage. You will still need a lasting position.'),line('narrator','Lucien acts independently, outside House Volari.')];
    case 'mirelle':return [line(actor,p?.archiveLead?'The lead is public now. The dossier will not remain unclaimed forever.':'While my Library permission holds, I can make the archive lead public.'),line(actor,p?.titleFiled?'Your title filing is already recorded. It grants no sanctuary by itself.':'A title can open a negotiation. It cannot replace the agreement.')];
    case 'cassian':return [line(actor,p?.appointment==='player'?'You reached the appointment first. Its obligation is yours as well.':p?.appointment==='cassian'?'The service is mine. The court can inspect the grant for itself.':'If you leave the appointment open, I intend to pursue it.')];
    case 'dorian':return [line(actor,p?.dossier==='player'?'You secured the dossier before I did. Now decide what to do with it.':p?.dossier==='dorian'?'The dossier has been claimed. That opportunity is closed.':'An open archive is an invitation. I do not intend to wait indefinitely.')];
    case 'sabine':return [line(actor,'A patron’s promise and a valid grant are different things. Inspect the chain.'),line(actor,r.world.grants.some(g=>g.grantor===p?.accounts.sabine&&g.grantee===p?.accounts.cassian)?'My sponsorship of Cassian is recorded. It still depends on the grant above it.':'I may sponsor Cassian only while my delegated court authority permits it.')];
  }
}
function leaseTerms(r:Result,id:number):string[]{
  const l=r.world.leases.find(l=>l.id===id);if(!l)return ['No verified lease available.'];
  return [`Lease #${l.id} · ${l.property_id} · ${l.status.toUpperCase()}`,`${amount(l.price_yocto)} prepaid and nonrefundable; network gas is additional.`,`${l.duration_nights} nights of entry only. No title, delegation or votes.`,`Accept before contract night ${l.offer_expiry_night}${l.end_night!==null?`; access ${expiryDescription(l.end_night,r.world.night)}`:''}.`,`Recipient: ${l.buyer}. Accepted lease cannot be revoked; it still expires.`];
}
const eventText:Record<string,string>={
  archive_assist:'The investigator brought an assistant into your Library. Their access depends on your permission; withdrawing it closes both doors.',
  archive_research:'The investigation is published. Your patron now has grounds to protect you; withdrawing Library access cannot erase the findings.',
  archive_challenge:'Dorian has made a competing petition. His bargain would bring Lucien into the Library. Hear his petition at court; no permission has been granted.',
  archive_protect:'A patron has granted lasting protection in their own name. Your Library investigator does not control it, and withdrawing Library access cannot revoke it.',
  revoke:'Vesper revoked her Crypt grant. Crypt entry is lost; unrelated independent rights remain.',
  collect:'Seraphine collected vested Lounge rent. Settlement does not extend the lease.',
  collect_sanctuary:'Seraphine collected sanctuary rent. Protection retains its recorded expiry.',
  appoint:'Marius issued institutional protection to the service claimant. It remains revocable.',
  dismiss:'Marius revoked his player grant after the unfulfilled obligation. Check your remaining shelter.',
  open_passage:'Lucien granted temporary passage. It expires at contract night 5.',
  sponsor:'Sabine delegated court access to Cassian through her existing grant.',
  publish:'Mirelle published the archive lead. Information opportunities are now available; no player right was granted.',
  offer:'Seraphine presented her existing Lounge offer. Nothing is signed until you accept.',
  compete:'A finite political opportunity was claimed. Review the current claimant before choosing.'
};

// Pure presentation projection. Never writes campaign state, rolls randomness or calls a signer.
export function buildEncounterScenes(r:Result):EncounterScene[]{
  const c=r.campaign;if(!c)return [];
  const scenes:EncounterScene[]=[];
  for(const actor of Object.keys(c.npcs) as NpcName[]){
    const choices:SceneChoice[]=(r.actions??[]).filter(a=>a.allowed&&ACTION_SPEAKER[a.kind as GameAction]===actor).map(a=>a.cost.majorActions?{id:`inspect-${a.kind}`,label:`Discuss: ${a.label}`,inspect:`action:${a.kind}`}:{id:`read-${a.kind}`,label:`${a.label} · free`,action:{action:'game',choice:a.kind as GameAction}});
    if(actor==='seraphine'&&r.world.leases[0])choices.push({id:'lounge',label:'Inspect the Lounge agreement',inspect:'lease:0'});
    scenes.push({id:`character:${actor}`,type:'ENCOUNTER',title:AGENTS[actor].name,location:roomFor(actor),portraits:[actor],lines:characterLines(actor,r),terms:[],rights:[],choices});
  }
  for(const a of r.actions??[]){
    const actor=ACTION_SPEAKER[a.kind as GameAction];
    const property=a.kind==='sanctuary_pact'?'sanctuary':['petition_marius','fulfil_service'].includes(a.kind)?'court':a.kind==='broker_passage'?'passage':a.permission??'library';
    const terms=[a.description,`Cost: ${a.cost.majorActions} major action; ${a.cost.blood} Blood.`,...(a.kind==='sanctuary_pact'?leaseTerms(r,1):[]),...(a.kind==='petition_marius'?['Protection requires Marius’s confirmed grant at reckoning. Fulfil service during Nights 4–5 or he may revoke it.']:[]),...(a.kind==='broker_passage'?['Access requires Lucien’s confirmed grant; expires at contract night 5.']:[])];
    if(!actor)terms.push('Survival resources are off-chain campaign state. This action grants no political authority.');
    if(a.cost.majorActions&&c.politics)terms.push('A successful commitment uses your major action and automatically resolves the nightly court.');
    if(!a.allowed)terms.push(...a.reasons);
    scenes.push({id:`action:${a.kind}`,type:'NEGOTIATION',title:a.label,location:actor?roomFor(actor):a.permission==='library'?'library':'crypt',portraits:actor?[actor]:[],lines:actor?characterLines(actor,r):[line('narrator',a.description)],terms,rights:!actor&&!a.permission?[]:authority(r,property),choices:a.allowed&&!r.pending&&c.status==='playing'?[{id:'commit',label:a.cost.majorActions?'Commit this night’s action':'Read the record · free',action:{action:'game',choice:a.kind as GameAction}}]:[]});
  }
  const lease=r.world.leases[0];
  if(lease){
    const agreement=c.agreements.find(a=>a.leaseId===0&&a.status==='pending');
    const playing=c.status==='playing'&&!r.pending;
    const choices:SceneChoice[]=[];
    if(playing&&lease.status==='offered'&&r.availability?.accept.length===0)choices.push({id:'accept',label:'Accept · pay rent and commit one action',action:agreement?{action:'agreement_accept',agreement_id:agreement.id}:{action:'accept'}});
    if(playing&&agreement)choices.push({id:'reject',label:'Decline proposal · free, no transaction',action:{action:'agreement_reject',agreement_id:agreement.id}});
    else if(playing&&lease.status==='offered'&&r.availability?.reject.length===0)choices.push({id:'reject',label:'Reject standing lease · signed, one action',action:{action:'reject'}});
    scenes.push({id:'lease:0',type:'NEGOTIATION',title:'The Lounge agreement',location:'lounge',portraits:['seraphine'],lines:[line('seraphine','A place at my table, for the nights written here. Nothing more is concealed in the promise.')],terms:[...leaseTerms(r,0),'Acceptance costs one major action. Inspecting or leaving this scene is free.',...(c.politics?['The Lounge lease alone does not provide sanctuary or satisfy a campaign ending.']:[])],rights:authority(r,'lounge'),choices,outcome:c.agreements.find(a=>a.leaseId===0)?.result});
  }
  if(c.politics&&c.night===0&&c.status==='playing')scenes.push({...scenes.find(s=>s.id==='character:vesper')!,id:'ultimatum',title:'Three nights under my roof',choices:[{id:'lead-seraphine',label:'Seek Seraphine · speak freely',inspect:'character:seraphine'},{id:'lead-marius',label:'Seek Marius · speak freely',inspect:'character:marius'}],automatic:true});
  for(const night of [...new Set(c.agentHistory.map(e=>e.night))]){
    const events=c.agentHistory.filter(e=>e.night===night&&e.kind!=='pass'&&(e.execution==='confirmed'||e.execution==='local'));
    const lines=events.map(e=>line(e.actor,`${eventText[e.kind]??e.kind} ${e.execution==='confirmed'?'[NEAR-confirmed]':'[Off-chain political event]'}`));
    for(const lease of r.world.leases.filter(l=>l.status==='accepted'&&l.end_night!==null&&l.end_night-l.duration_nights===night))lines.unshift(line('seraphine',`${lease.property_id} agreement accepted. Entry ${expiryDescription(lease.end_night,r.world.night)}; ownership did not change. [NEAR lease record]`));
    for(const lease of r.world.leases.filter(l=>l.status==='accepted'&&l.end_night===night+1))lines.push(line('narrator',`${lease.property_id} lease expired at dawn. Current effective access: ${r.world.access[lease.property_id]?'permitted':'not permitted'} [current contract view].`));
    if(c.politics&&night===4&&r.world.grants.some(g=>g.property_id==='passage'&&g.grantee===c.politics?.accounts.player&&g.expiry_night===5))lines.push(line('narrator',`Lucien’s temporary passage deadline arrived at contract night 5. Current effective passage: ${r.world.access.passage?'permitted':'not permitted'} [current contract view].`));
    const finalReckoning=c.status!=='playing'&&night===c.night-1;
    if(!lines.length)lines.push(line('narrator',finalReckoning?'The final reckoning is complete. No new consequential NPC action was recorded. Review the campaign outcome.':'The court has completed this reckoning. No new consequential NPC action was recorded. Review your current rights before choosing again.'));
    scenes.push({id:`reckoning:${night}`,type:'RECKONING',completionLabel:finalReckoning?'Review campaign outcome':undefined,title:`The court moves · Night ${night+1}`,location:'lounge',portraits:events.length?[...new Set(events.map(e=>e.actor))].slice(0,2):[],lines,terms:['These are recorded consequences, not new choices. Continuing or skipping signs nothing.'],rights:[],choices:[],automatic:night===c.night-1});
  }
  if(c.status!=='playing')scenes.push({id:`conclusion:${c.ending??c.status}`,type:'CAMPAIGN CONCLUSION',title:c.ending==='unbound'?'The Unbound':c.ending==='favoured'?'The Favoured':c.status==='defeat'?'Failure':'Seven nights survived',location:c.ending==='unbound'?'library':'crypt',portraits:[c.ending==='unbound'?'seraphine':c.ending==='favoured'?(r.world.access.court?'marius':'lucien'):'vesper'],lines:[line('narrator',c.ending==='unbound'?'The Crypt door closes. It is no longer the only door that matters.':c.ending==='favoured'?'You endure beneath another’s protection. Survival has a patron.':'The last reckoning offers no shelter in words.'),line('narrator',c.reason)],terms:[c.reason,'Outcome computed by the campaign rules from verified rights and survival state; this illustration changes nothing.'],rights:authority(r,c.ending==='unbound'?'sanctuary':'court'),choices:[],automatic:true});
  addDirectedStory(r,scenes);
  if(c.politics?.library)addCourtReactions(r,scenes);
  if(r.pending||r.error)for(const s of scenes){s.automatic=false;s.choices=s.choices.filter(ch=>!ch.action);}
  return scenes;
}
