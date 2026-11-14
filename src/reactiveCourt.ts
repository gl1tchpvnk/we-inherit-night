import {expiryDescription} from './leaseNarrative.ts';
import {cassianPassage} from './finalCourt.ts';
import type {Result} from './chain';

import type {NpcName} from './game';

import type {EncounterScene,SceneChoice} from './encounters';

import {effectiveGrant} from './library.ts';
import {completedInvestigator,investigationFinding} from './courtPayoff.ts';



export interface CourtReaction {

  id:string;night:number;actor:NpcName;room:'crypt'|'library'|'lounge';

  level:'minor'|'significant'|'major';title:string;text:string;evidence:string;

  follow?:string;

}



// Public ledger changes and completed journal entries are evidence, not new

// decisions. No random choices, storage writes, NPC locations or signing here.

export function courtReactions(r:Result):CourtReaction[]{

  const c=r.campaign,p=c?.politics;

  if(!c||!p||r.pending||r.error)return [];

  const updates:CourtReaction[]=[];

  const add=(u:CourtReaction)=>{if(!updates.some(v=>v.id===u.id))updates.push(u);};

  for(const e of c.agentHistory){

    if(!['confirmed','local'].includes(e.execution??'')||e.kind==='pass')continue;

    const id=`reaction:npc:${e.night}:${e.actor}:${e.kind}`;

    const base={id,night:e.night,actor:e.actor,evidence:`Completed journal: Night ${e.night+1}, ${e.actor}, ${e.kind}, ${e.execution}.`};

    const grant=r.world.grants.find(g=>g.property_id==='crypt'&&g.grantor===p.accounts.vesper&&g.grantee===p.accounts.player&&g.revoked);

    switch(e.kind){
      case 'passage_offer':if(cassianPassage(c,r.world))add({...base,room:'lounge',level:'minor',title:'Lucien names his price',text:'After losing the appointment, Cassian has another offer: a temporary passage from Lucien. An offer alone buys him nothing.'});break;
      case 'passage_buy':if(cassianPassage(c,r.world)?.status==='accepted')add({...base,room:'lounge',level:'significant',title:'Cassian buys a way out',text:'Cassian has spent his entire passage allowance on three nights outside Marius’s protection. His paid escape does not depend on your Library invitation. The accepted lease is publicly recorded.'});break;
      case 'passage_collect':if(cassianPassage(c,r.world)?.settled)add({...base,room:'lounge',level:'minor',title:'Lucien receives Cassian’s payment',text:'The agreed passage rent has reached Lucien. Cassian’s finite allowance is spent; the passage retains its recorded deadline.'});break;
      case 'final_answer':if(p.finalCourt?.result)add({...base,room:'lounge',level:'major',title:p.finalCourt.result==='accepted'?'Marius accepts your terms':'Marius withdraws his protection',text:p.finalCourt.result==='accepted'?(p.finalCourt.response==='counter'?'Marius accepts a limited inspection. Mirelle’s completed account and Cassian’s paid escape have made a narrower bargain worth accepting. You gave him a two-night invitation, not permanent access.':'Marius keeps his protection. You have given him a continuing invitation to the Library; he cannot pass that invitation on.'):'Marius has withdrawn his own protection after your answer—or your silence. Other independent promises remain governed by their own terms.'});break;


      case 'revoke':if(grant)add({...base,room:'crypt',level:'major',title:'The door Vesper closed',text:r.world.access.crypt?'Vesper has withdrawn her invitation. Another valid right still opens the Crypt. Her decision did not erase it.':'Vesper has withdrawn her invitation. The Crypt no longer admits you. Your Library title remains separate; it is not a refuge.',follow:'record:crypt'});break;

      case 'dismiss':add({...base,room:'lounge',level:'major',title:'A place taken back',text:`Marius has withdrawn the protection tied to unfinished service. ${r.world.access.court?'Another effective right still admits you at court.':'That court protection is no longer available.'} Your other arrangements stand or fall on their own terms.`,follow:'character:marius'});break;

      case 'archive_assist':add({...base,room:'library',level:'significant',title:e.actor==='mirelle'?'A second name beside Mirelle’s':'Dorian brings Lucien into the work',text:`${e.actor==='mirelle'?'Cassian':'Lucien'} received an assistant’s invitation beneath ${e.actor==='mirelle'?'Mirelle':'Dorian'}’s. It created a route into the Library, not ownership. Check the present invitations below before deciding whether the work continues.`,follow:'record:library'});break;

      case 'archive_challenge':add({...base,room:'library',level:'significant',title:'Dorian asks you to reconsider',text:'Dorian made a competing petition while Mirelle could still be stopped. His proposal was a change of patron, not an accusation. A change requires taking back her key before inviting him; publication or delay can close that route.',follow:'character:dorian'});break;

      case 'archive_research':add({...base,room:'library',level:'major',title:'The work leaves the Library',text:`${e.actor==='mirelle'?'Mirelle has delivered to Marius':'Dorian has delivered to Lucien'}. The account of present obligations is public. The rival investigation is finished as an opportunity. Taking back a key cannot unpublish the work; a patron’s protection still requires their own actual promise.`,follow:'record:library'});break;

      case 'archive_protect':add({...base,room:'lounge',level:'major',title:'A promise in another name',text:`${e.actor==='marius'?'Marius':'Lucien'} issued separate protection after the research. The investigator cannot withdraw that promise. Its patron can. That promise is separate from your decision about the Library invitation.`,follow:'action:withdraw_library'});break;

      case 'appoint':add({...base,room:'lounge',level:p.appointment==='player'?'major':'significant',title:p.appointment==='player'?'Marius makes room for you':'Cassian has his place',text:p.appointment==='player'?'Marius issued protection for your service. His support comes with work due on Nights Four or Five. Leaving it undone allows him to withdraw his promise.':'Marius issued protection to Cassian. The appointment is no longer yours to claim. Separate sanctuary, passage and the Library contest are different routes.',follow:p.appointment==='player'?'character:marius':'character:cassian'});break;

      case 'open_passage':add({...base,room:'lounge',level:'significant',title:'Time borrowed from Lucien',text:'Lucien opened the temporary passage, ending at the start of Night Six. To turn that escape into lasting protection, Dorian must finish before it closes, unless another refuge carries you longer.',follow:'character:lucien'});break;

      case 'publish':add({...base,room:'library',level:'significant',title:'A lead reaches the court',text:'Mirelle made the archive lead public. Lucien can now discuss passage. Information has opened a conversation; it has not yet opened a refuge.',follow:'character:lucien'});break;

      case 'sponsor':add({...base,room:'lounge',level:'minor',title:'Sabine sponsors Cassian',text:'Cassian received a court invitation through Sabine. It depends on her authority from Marius, not on your Library key.'});break;

      case 'compete':add({...base,room:'lounge',level:'minor',title:'Someone else took the opening',text:e.actor==='cassian'?'Cassian claimed the vacant appointment. Waiting was a decision too.':'Dorian claimed the finite dossier. The record is no longer waiting for a claimant.'});break;

      case 'collect':case 'collect_sanctuary':add({...base,room:'lounge',level:'minor',title:'Seraphine receives the agreed rent',text:'The agreed rent has been collected. Payment settlement does not extend your stay.'});break;

      case 'offer':add({...base,room:'lounge',level:'significant',title:'An invitation to bargain',text:'Seraphine proposed the existing Lounge agreement. Reading or declining it does not mean accepting it.',follow:'lease:0'});break;

    }

  }

  // Player-issued invitations and their withdrawal are immutable ledger evidence.

  const roots=r.world.grants.filter(g=>g.property_id==='library'&&g.grantor===p.accounts.player&&g.parent_grant_id===null&&g.can_delegate);

  const withdrawals=c.events.filter(t=>/Night \d+: Withdraw your Library permission\./.test(t));

  for(const g of roots){

    const actor=g.grantee===p.accounts.mirelle?'mirelle':g.grantee===p.accounts.dorian?'dorian':null;if(!actor)continue;

    const issued=c.events.filter(t=>t.includes(`Give ${actor==='mirelle'?'Mirelle':'Dorian'} Library access.`));

    const sameActor=roots.filter(v=>v.grantee===g.grantee);

    const issue=issued.length===sameActor.length?issued[sameActor.indexOf(g)]:undefined;

    const night=issue?Number(issue.match(/Night (\d+)/)?.[1]??0)-1:-1;

    add({id:`reaction:key:${g.id}`,night,actor,room:'library',level:'significant',title:`You opened the Library to ${actor==='mirelle'?'Mirelle':'Dorian'}`,text:`Your invitation let ${actor==='mirelle'?'Mirelle pursue Marius’s interests':'Dorian pursue Lucien’s interests'} and bring an assistant. ${g.revoked?'That invitation has since been withdrawn.':'Keeping it open is a continuing choice.'}`,evidence:`Library grant #${g.id}.`,follow:`character:${actor}`});

    if(g.revoked){

      const revoked=roots.filter(v=>v.revoked);

      const entry=withdrawals.length===revoked.length?withdrawals[revoked.indexOf(g)]:undefined;

      const withdrawNight=entry?Number(entry.match(/Night (\d+)/)![1])-1:-1;

      add({id:`reaction:withdraw:${g.id}`,night:withdrawNight,actor,room:'library',level:'major',title:'The key you took back',text:`Your invitation to ${actor==='mirelle'?'Mirelle':'Dorian'} is withdrawn. Any route depending on it is ineffective. ${p.library?.result==='open'?'The unfinished work cannot proceed through that invitation. You can hear the rival if time remains.':'Published findings remain. Separate patron protection is not yours to cancel with this key.'}`,evidence:`Revoked Library grant #${g.id}; current grant validity checked by contract.`,follow:'record:library'});

    }

  }

  for(const l of r.world.leases){

    if(l.buyer!==p.accounts.player||!['accepted','rejected'].includes(l.status))continue;

    const night=l.end_night===null?-1:l.end_night-l.duration_nights;

    add({id:`reaction:lease:${l.id}:${l.status}`,night,actor:'seraphine',room:'lounge',level:'significant',title:l.status==='accepted'?'A bargain kept separate':'The bargain you declined',text:l.status==='accepted'?`Your ${l.property_id} agreement was accepted. It ${expiryDescription(l.end_night,r.world.night)}. Neither gratitude nor an unrelated quarrel changes that term.`:'You rejected this standing agreement. It grants no shelter or access. Refusal is recorded; no personal grudge is invented.',evidence:`Lease #${l.id}: ${l.status}.`,follow:'character:seraphine'});

  }

  for(const a of c.agreements.filter(a=>a.status==='rejected'))add({id:`reaction:decline:${a.id}`,night:a.proposedNight,actor:'seraphine',room:'lounge',level:'minor',title:'No bargain was made',text:'You declined Seraphine’s proposal. No payment or relationship penalty followed. The refusal does not close an independently valid right.',evidence:`Agreement ${a.id}: rejected.`});

  if(p.appointment==='player'&&p.serviceFulfilled)add({id:'reaction:service-kept',night:c.agentHistory.find(e=>e.kind==='archive_research'&&e.actor==='mirelle'&&e.execution==='confirmed')?.night??Number(c.events.find(e=>e.includes('Fulfil the administrative obligation.'))?.match(/Night (\d+)/)?.[1]??0)-1,actor:'marius',room:'lounge',level:'significant',title:'The work you owed is done',text:'Your service is fulfilled. Marius no longer has that unfinished obligation to invoke. Protection still depends on the actual right he issued, not this acknowledgement.',evidence:'Persisted serviceFulfilled after validated player work or completed research.',follow:'character:marius'});

  return updates.sort((a,b)=>a.night-b.night||a.id.localeCompare(b.id)).slice(-64);

}



export function politicalRelationship(r:Result,actor:NpcName):string{

  const c=r.campaign,p=c?.politics;if(!c||!p)return 'No political relationship recorded.';

  const w=r.world,account=p.accounts[actor];

  if(actor==='mirelle'||actor==='dorian'){

    const invitations=w.grants.filter(g=>g.property_id==='library'&&g.grantor===p.accounts.player&&g.grantee===account&&g.can_delegate);

    const latest=invitations.at(-1);

    if(latest?.revoked)return `Cooperation withdrawn: you took back this investigator’s key. ${p.library?.result===actor?'Their published work remains.':'They cannot continue unfinished work through it.'}`;

    if(latest&&effectiveGrant(w,latest))return p.library?.result===actor?'Work delivered; continuing invitation.':'Cooperating through your Library invitation.';

    if(p.library?.result&&p.library.result!=='open')return 'Rival route closed by published work; no new investigation remains.';

    return 'No lasting Library invitation from you.';

  }

  if(actor==='marius'&&p.appointment==='player')return p.serviceFulfilled?'Service kept. His actual protection remains separately revocable.':w.grants.some(g=>g.property_id==='court'&&g.grantor===account&&g.grantee===p.accounts.player&&g.revoked)?'Service left unfinished; Marius withdrew his promise.':'Service owed by the end of Night Five.';

  if(actor==='seraphine')return w.leases.some(l=>l.buyer===p.accounts.player&&l.status==='accepted')?'Paid bargain: its fixed term survives unrelated political disputes.':c.agreements.some(a=>a.status==='rejected')?'Proposal declined without a personal penalty.':'No paid bargain recorded.';

  if(actor==='vesper')return w.grants.some(g=>g.property_id==='crypt'&&g.grantor===account&&g.grantee===p.accounts.player&&g.revoked)?'Hospitality withdrawn; blood relationship and your independent title remain.':'Temporary hospitality, not ownership or unconditional loyalty.';

  const issued=w.grants.find(g=>g.grantor===account&&g.grantee===p.accounts.player&&effectiveGrant(w,g));

  if(issued)return issued.expiry_night===null?'Separate patron protection: the issuer may withdraw it.':`Temporary protection ${expiryDescription(issued.expiry_night,r.world.night)}; the issuer may still withdraw it.`;

  return actor==='cassian'?'Competing for a position; any Library invitation is separate from court sponsorship.':actor==='sabine'?'Sponsors Cassian only through her own valid court authority.':'No promise to you recorded. Motives beyond established interests remain unknown.';

}



export function addCourtReactions(r:Result,scenes:EncounterScene[]):void{

  const updates=courtReactions(r);if(!updates.length)return;

  const c=r.campaign!,latest=updates.filter(u=>u.night===c.night-1);

  const automatic=latest.find(u=>u.id.endsWith(':archive_research')&&completedInvestigator(r)===u.actor)??latest.filter(u=>u.level==='major').at(-1)??latest.filter(u=>u.level==='significant'&&u.id.startsWith('reaction:npc:')).at(-1)??latest.find(u=>u.level==='significant');

  for(const u of updates){

    const choices:SceneChoice[]=[];

    let follow=u.follow&&scenes.find(s=>s.id===u.follow);
    if(u.id.endsWith(':archive_research')&&completedInvestigator(r)===u.actor)follow=scenes.find(s=>s.id===`meaning:${u.actor}`);

    if(follow&&u.follow?.startsWith('action:')&&!follow.choices.some(choice=>choice.action))follow=scenes.find(s=>s.id==='record:library');

    if(follow)choices.push({id:'follow',label:follow.id.startsWith('action:')?'Consider the next commitment':'Follow this development · free',inspect:follow.id});

    const reply=reactionReply(u,r);
    const finding=u.id.endsWith(':archive_research')&&completedInvestigator(r)===u.actor;

    scenes.push({id:u.id,type:'ENCOUNTER',title:u.title,location:u.room,portraits:[u.actor],presentation:u.id.endsWith(':final_answer')?'consequence':undefined,lines:finding?[{speaker:u.actor,text:investigationFinding(u.actor as 'mirelle'|'dorian')}]:reply?[{speaker:u.actor,text:reply}]:[{speaker:'narrator',text:u.text}],terms:[reply?`${u.text} ${politicalRelationship(r,u.actor)}`:politicalRelationship(r,u.actor)],rights:[u.evidence,'Recorded correspondence and consequences; this scene establishes no physical NPC location.'],choices,compact:true,outcome:u.night>=0?`Recorded on Night ${u.night+1}. Present rights are shown separately.`:'Earlier correspondence; the exact night is not recorded.',reactionLevel:u.level,automatic:u.id===automatic?.id});
  }

  // A single consequence leads the new chapter; the full reckoning remains in history.

  if(latest.length){const recap=scenes.find(s=>s.id===`reckoning:${c.night-1}`);if(recap)recap.automatic=false;}

  if(c.politics?.library)for(const actor of ['mirelle','dorian'] as const){

    const relation=politicalRelationship(r,actor);

    if(relation.startsWith('Cooperation withdrawn')){

      const scene=scenes.find(s=>s.id===`character:${actor}`);

      if(scene)scene.lines=[{speaker:actor,text:c.politics.library.result===actor?'You took the key back after I delivered. The work is still public. We can discuss what remains; we cannot pretend it never happened.':'You told me to leave before the work was finished. I have stopped. If you want another investigation, you will have to make that choice explicitly.'}];

    }

  }

}



// Correspondence about the speaker's own act or an invitation addressed to them.

// These replies never describe a meeting, unseen betrayal or private intention.

function reactionReply(u:CourtReaction,r:Result):string|undefined{

  if(u.id.startsWith('reaction:withdraw:'))return r.campaign?.politics?.library?.result===u.actor?'You wanted the work. You have it. Now you want the key back. Very well. Let us be precise about which part of our arrangement is over.':'I have your answer. The work stops here. If you invite someone else, at least let them finish before you change your mind again.';

  if(u.id==='reaction:service-kept')return 'You kept your word. I prefer that to elaborate assurances. The work is done; I have no unfinished service to demand of you.';

  const kind=u.id.split(':').at(-1);

  switch(kind){

    case 'revoke':return 'I have withdrawn my invitation. You are still my descendant. I will not let you make those the same promise.';

    case 'dismiss':return 'I kept a place for you. You left the work undone. I have withdrawn that promise. Whatever you arranged elsewhere is your affair.';

    case 'archive_assist':if(r.campaign?.politics?.library?.result!=='open')return 'That was the invitation used for the work. Publication has settled the investigation; current access is a separate question.';if(r.campaign?.status!=='playing')return 'The campaign has ended. That invitation is part of the record, not work still to be completed.';if(!r.world.grants.some(g=>g.property_id==='library'&&g.grantor===r.campaign?.politics?.accounts[u.actor]&&effectiveGrant(r.world,g)))return 'I brought an assistant into the work. That invitation no longer works. The unfinished research cannot continue through it.';return u.actor==='mirelle'?'Cassian has his invitation. Now we can get on with it. Give us another night, unless you would rather have an empty desk.':'Lucien has his invitation. I said whom I wanted involved. I have not changed the bargain behind your back.';
    case 'archive_challenge':if(r.campaign?.politics?.library?.result!=='open'||r.campaign.night>4||r.campaign.politics.library.chosen!=='mirelle'||!r.world.grants.some(g=>g.property_id==='library'&&g.grantee===r.campaign?.politics?.accounts.mirelle&&effectiveGrant(r.world,g)))return 'I asked you to reconsider while there was time to change patrons. That was the offer then. We must deal with the choices you have made since.';return 'Stop Mirelle before she publishes, then invite me. Two commitments, not one clever answer. Count the nights before you choose.';
    case 'archive_research':return u.actor==='mirelle'?'Finished. Marius has the account. You can close the Library tomorrow, but he will still have read it.':'Lucien has the finished account. Mirelle will not like losing the race. That does not make the work any less finished.';

    case 'archive_protect':return u.actor==='marius'?'Mirelle delivered. You have my protection. Whether she keeps your key is between the two of you.':'Dorian delivered. I have made my promise without a deadline this time. It is my promise, not something you borrowed from his key.';

    case 'appoint':return r.campaign?.politics?.appointment==='player'?'The place is yours. I expect the work by the end of the fifth night. You need not thank me repeatedly; doing it will suffice.':'Cassian took the appointment. I have kept my side of that arrangement. You will have to find a different opening.';

    case 'open_passage':return 'I opened the way. Until the sixth night, remember. Escape is useful; mistaking it for a permanent solution is less useful.';

    case 'publish':return 'The lead is public now. Ask Lucien what he can make of it. I have given you information, not a bed.';

    default:return undefined;

  }

}

