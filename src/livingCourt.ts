import {expiryDescription,sanctuaryOfferSummary} from './leaseNarrative.ts';
import {finalDemand,mariusProtection,counterAccepted,FINAL_ACTIONS,isFinalAction} from './finalCourt.ts';
import type {Result} from './chain';

import {ACTIONS,type NpcName,type GameAction} from './game.ts';

import type {EncounterScene,SceneChoice,DialogueLine} from './encounters';

import {libraryRoot,effectiveGrant} from './library.ts';
import {INVESTIGATION_QUESTION,completedInvestigator,investigationFinding} from './courtPayoff.ts';
import {petitionHasShelter} from './agents.ts';



// Authored fiction over existing state. No new history, knowledge, rights or decisions.

export const CHAPTERS=[

  {title:'A bed before dawn',question:'Whose help can you afford?',text:'Vesper has given you a deadline. The Library belongs to you, but it cannot shelter you. Before the third dawn, someone else’s offer must become more than an offer.'},

  {title:'The price of company',question:'A bargain or a place in the House?',text:'Listen for what each bargain asks you to depend on. Seraphine names a price. Marius names an obligation. Lucien offers time. None is offering the same escape.'},

  {title:'The last borrowed night',question:'Where will you sleep tomorrow?',text:'Tonight, Vesper\'s promise ends. By dawn, whatever protection you have secured elsewhere must be enough.'},

  {title:'Your door, their quarrel',question:'Who gets to use what is yours?',text:'The Library is yours, and now someone wants something from you. Mirelle and Dorian intend to put it to different uses. Neither can proceed on good intentions alone.'},

  {title:'Before the ink dries',question:'Let the work finish, or stop it?',text:'The question is no longer only who may enter. It is who will receive what leaves the Library—and whether you are still in time to stop it.'},

  {title:'What survives a promise',question:'What are you prepared to leave unfinished?',text:'Tomorrow is the final night. Take account of what still stands, what is unfinished, and what is no longer yours to undo.'},

  {title:'The door you leave open',question:'What will remain when dawn comes?',text:'The court has one reckoning left in this campaign. Not every promise needs a new answer. Some do. You must decide which arrangements you are prepared to finish with.'}

] as const;

export const ROLEPLAY_LABELS:Partial<Record<GameAction,string>>={

  investigate_title:'Put my claim before Seraphine',sanctuary_pact:'I want a refuge of my own',petition_marius:'I will take my chances with Marius',fulfil_service:'Keep my word to Marius',

  authorize_mirelle:'Let Mirelle and Cassian do the work',authorize_dorian:'Back Dorian and Lucien',withdraw_library:'I want my Library back',broker_passage:'Ask Lucien for a way out',feed:'Feed · restore 4 Blood',rest:'Rest while Vesper still permits it'

};

export const DISCUSS_LABELS:Partial<Record<GameAction,string>>={
  investigate_title:'Discuss filing my Library claim',sanctuary_pact:'Discuss Seraphine’s sanctuary',petition_marius:'Ask about the appointment',fulfil_service:'Review my outstanding service',
  authorize_mirelle:'Discuss Mirelle’s proposal',authorize_dorian:'Discuss Dorian’s proposal',withdraw_library:'Review taking back the keys',broker_passage:'Discuss Lucien’s passage',feed:'Review feeding · +4 Blood',rest:'Review resting in the Crypt'
};

export function endingSummary(r:Result):string{

  const c=r.campaign!;

  if(c.ending==='unbound'){

    const lease=r.world.leases.find(l=>l.property_id==='sanctuary'&&l.buyer===c.politics?.accounts.player&&l.status==='accepted');

    const title=r.world.properties.some(p=>p.id==='library'&&p.owner===c.politics?.accounts.player)?'Your Library is still yours. ':'';
    if(lease?.end_night!=null&&lease.end_night>r.world.night&&lease.end_night>=7)return `${title}${r.world.night>=7?'The final reckoning is over. ':''}Your sanctuary ${expiryDescription(lease.end_night,r.world.night)}. Seraphine cannot cancel the remaining term. You own no part of her sanctuary.`;
    if(lease)return `${title}Your sanctuary ${expiryDescription(lease.end_night,r.world.night)}. It grants no ownership${lease.end_night!==null&&lease.end_night>r.world.night?'; Seraphine cannot withdraw it before that deadline':''}.`;
    return `${title}No accepted sanctuary agreement is confirmed in the current record. Sanctuary is not ownership.`;

  }

  if(c.ending==='favoured')return `${c.reason.includes('Lucien')?'Lucien':'Marius'} protects you. That promise has no scheduled end, but remains the patron’s to withdraw. Your Library remains separate.`;

  return c.resources.blood===0?'Your Blood is exhausted. Rights and promises cannot keep you alive without it.':c.reason.includes('Exposure')?'The recorded campaign ended when hunters found you.':c.night<7?'No shelter remained after Vesper closed the Crypt. The Library and Lounge are not refuges.':'No lasting patron protection or qualifying sanctuary remained at the final reckoning. Ordinary room invitations cannot replace them.';

}

// Epilogue evidence is presentation only; the engine's stored ending is never recomputed.

export function endingConsequences(r:Result):string[]{

  const c=r.campaign!,p=c.politics,d=p?.library;

  if(!p||!d)return [];

  const root=libraryRoot(c,r.world),lines:string[]=[];

  if(p.appointment==='player')lines.push(p.serviceFulfilled?'You kept the work promised to Marius. Your place in his institution was earned through service.':r.world.grants.some(g=>g.property_id==='court'&&g.grantee===p.accounts.player&&g.revoked)?'Marius’s service remained unfinished. A court grant to you was withdrawn; any surviving shelter was separate.':'Marius’s promised work remains unfinished.');

  if(d.result!=='open')lines.push(d.result==='mirelle'?'You let Mirelle deliver the Library account to Marius. Dorian’s competing investigation closed before it could serve Lucien.':'You let Dorian deliver the Library account to Lucien. Mirelle’s competing investigation closed before it could serve Marius.');

  else lines.push('Neither investigator delivered the Library account. No patron can owe you protection for work that never reached them.');

  const withdrawn=r.world.grants.some(g=>g.property_id==='library'&&g.grantor===p.accounts.player&&g.can_delegate&&g.revoked);

  if(withdrawn)lines.push('You took back an investigator’s key. Their dependent invitations fell with it; separate promises did not.');

  if(root)lines.push(`You left ${d.chosen==='mirelle'?'Mirelle':'Dorian'} welcome in the Library. That invitation remains yours to withdraw.`);

  const patrons=[['court','Marius'],['passage','Lucien']] as const;

  for(const [property,name] of patrons)if(r.world.grants.some(g=>g.property_id===property&&g.grantee===p.accounts.player&&g.expiry_night===null&&effectiveGrant(r.world,g)))lines.push(`${name}’s separate protection still stands. It depends on that patron, not on the investigator keeping your key.`);

  if(p.finalCourt?.result)lines.push(p.finalCourt.result==='accepted'?(p.finalCourt.response==='counter'?'Your published account supported a narrower bargain. Marius kept his protection; you gave him a two-night Library invitation, not permanent access.':'You kept Marius’s protection by giving him a continuing, non-delegable Library invitation.'):'Marius withdrew his protection at the final reckoning. Refusal, silence or a rejected proposal did not cancel independent shelter.');
  if(p.finalCourt?.result==='rejected'&&p.finalCourt.response==='counter'&&r.world.grants.some(g=>g.property_id==='library'&&g.grantee===p.accounts.marius&&g.expiry_night===8&&effectiveGrant(r.world,g)))lines.push('Marius rejected the bargain. The two-night Library invitation you gave him still stands. He gained entry, not ownership.');

  return lines;

}

const DISCOVERY_PROMPTS=[
  'Hear Seraphine’s price. Hear what Marius expects. Neither conversation commits you.',
  'Ask what each offer leaves in the other person’s hands.',
  'Ask what is still available before you spend this night.',
  'Hear whom each investigator intends to serve.',
  'Hear what has changed before deciding whether the work continues.',
  'Ask about the position you have now, not the offer you remember.',
  'Hear the people whose promises still matter.',
] as const;

export function chapterSituation(r:Result,discovery=false):string{

  const c=r.campaign!,p=c.politics!,d=p.library,n=c.night,w=r.world;

  if(c.status!=='playing')return endingSummary(r);
  if(finalDemand(c,w)&&!p.finalCourt?.response)return 'Marius wants a continuing Library invitation. Answer before the final reckoning: accept, refuse and lose his protection, or use the published account to propose limited entry. Other patrons’ protection remains separate.';

  const base=discovery?DISCOVERY_PROMPTS[Math.min(n,6)]:n===5&&d?.result!=='open'? 'The account is public. Its beneficiary has been chosen. What remains is who keeps your permission—and whether you can afford another night without feeding.':CHAPTERS[Math.min(n,6)].text;

  const hunger=c.resources.blood<=3?' Your hunger is immediate: another costly night could kill you.':'';

  if(n<3)return base+(w.access.sanctuary||w.access.court?' Your shelter is secured separately from Vesper. Keep enough Blood to reach it.':'')+hunger;

  const root=libraryRoot(c,w);

  const progress=d?.result!=='open'&&d?.result?` ${d.result==='mirelle'?'Mirelle':'Dorian'} has published. ${root?'The Library remains open to your investigator.':'Your investigator no longer has the key you issued.'}`:root?' The account is unfinished. Let the investigators continue, or withdraw the permission they still need.':n===6?' No investigation is running. It is too late to begin one now.':' Neither investigator has your invitation. Only the offers still available can change that.';

  return base+progress+(p.appointment==='player'&&!p.serviceFulfilled&&n<=4?' Marius still expects your work by the end of Night Five.':'')+hunger;

}

export function roomDevelopment(r:Result,room:string):{text:string;contacts:NpcName[];scene:string}{

  const c=r.campaign!,p=c.politics!,d=p.library,root=libraryRoot(c,r.world);

  if(room==='crypt')return {text:r.world.access.crypt?(c.night>=3?'A surviving right still admits you to the Crypt. Vesper’s withdrawn invitation is not the source of that shelter.':'Vesper still permits you to rest here. Read the family record: being her descendant does not make your Library hers. After the third reckoning this shelter is hers to close.'):'Vesper has closed this shelter. Blood ties remain; her hospitality does not.',contacts:['vesper'],scene:'record:crypt'};

  if(room==='library')return {text:d?.result&&d.result!=='open'?`The work by ${d.result==='mirelle'?'Mirelle':'Dorian'} is public. ${root?'The investigator still has your key.':'The keys you issued no longer open these doors.'} Read what the publication changed.`:root?'Your chosen investigator can work here. There is still time to stop the research before it leaves the room.':c.night<3?'Your title is already yours. Putting it before Seraphine may buy a hearing; reading it alone cannot buy shelter.':'The shelves are yours to open or close. Mirelle and Dorian want the work to serve different patrons.',contacts:c.night<3?['mirelle']:d?.chosen?[d.chosen,d.chosen==='mirelle'?'cassian':'lucien']:['mirelle','dorian'],scene:'record:library'};

  return {text:c.night<3?'A seat at Seraphine’s table is an invitation to talk, not a place to sleep. Hear the patrons before choosing a debt.':d?.result==='mirelle'?'Mirelle’s work has reached Marius. Ask what he now offers, and what still depends on him.':d?.result==='dorian'?'Dorian has put the work before Lucien. Ask the outsider what his protection will cost you in dependence.':'The court is waiting to learn whom your Library will serve. Sabine can explain how Cassian’s other patronage survives your choices.',contacts:c.night<3?['seraphine','marius','lucien']:d?.result==='mirelle'?['marius','seraphine','sabine']:d?.result==='dorian'?['lucien','seraphine','sabine']:['marius','lucien','sabine'],scene:'record:lounge'};

}



export function livingCourt(r:Result,scenes:EncounterScene[]):void{

  const c=r.campaign!,p=c.politics!,d=p.library!,n=c.night,w=r.world,root=libraryRoot(c,w);

  const allowed=(kind:string)=>r.actions?.some(a=>a.kind===kind&&a.allowed);

  const inspect=(id:string,label:string):SceneChoice=>({id,label,inspect:id});

  const action=(kind:GameAction,label=ROLEPLAY_LABELS[kind]??ACTIONS[kind].label)=>inspect(`action:${kind}`,label);

  const make=(id:string,title:string,speaker:DialogueLine['speaker'],text:string,choices:SceneChoice[],terms:string[]=[]):EncounterScene=>({id,title,type:'ENCOUNTER',location:speaker==='vesper'?'crypt':['mirelle','cassian','dorian'].includes(speaker)?'library':'lounge',portraits:speaker==='narrator'||speaker==='player'?[]:[speaker],lines:[{speaker,text}],choices,terms,rights:[],compact:true});

  const assistant=root&&w.grants.find(g=>g.parent_grant_id===root.id&&effectiveGrant(w,g));

  const permanentPassage=w.access.passage&&w.grants.some(g=>g.property_id==='passage'&&g.grantee===p.accounts.player&&g.grantor===p.accounts.lucien&&g.expiry_night===null&&effectiveGrant(w,g));

  const voices:Record<NpcName,{opening:string;question:string;answer:string;personal:string;reply:string;offer?:GameAction}>={

    vesper:{opening:w.access.crypt?(n===2?'Tonight. You have had time to ask everyone else what they think of me. I trust you have also found a bed.':n<2?`I made you one of us. I did not promise you a place beside me forever. You have ${3-n} more nights in my Crypt. Then you must find another roof.`:'The Crypt still admits you. Do not take that as a new promise from me.'):'You are still my descendant. You are no longer sheltered here. I see no reason to confuse the two.',question:'Does being your descendant count for nothing?',answer:'It makes you my descendant. It does not oblige me to house you forever. Nor does it entitle me to your Library. Tradition has limits; that is why it survives.',personal:'Are you trying to make me fail?',reply:'If I wanted you unprepared, I would have said nothing. Do not turn a warning into a promise that I will relent.'},

    seraphine:{opening:w.access.sanctuary?'You paid for a refuge. You have one. You may stop thanking me whenever it becomes tiresome.':n>=3?'The offer is closed. I can still listen, but listening will not put a roof over your head.':p.titleFiled?'Your Library really is your own. Good. Now we can discuss a bargain between people with something to lose.':'Marius likes to know where everyone belongs. I prefer to know whether they can keep a bargain. You need a place to sleep. I have one.',question:'What is the catch?',answer:'We must read the current offer before discussing a bargain.',personal:'And Marius is content with that?',reply:'Ask him. We founded this House together; we did not become the same person. My rights were mine before our marriage. They still are.',offer:allowed('sanctuary_pact')?'sanctuary_pact':n<2&&allowed('investigate_title')?'investigate_title':undefined},

    marius:{opening:p.serviceFulfilled&&mariusProtection(c,w)?'The work is finished. I said I would protect you, and I am doing so. We need not make a ceremony of it.':p.serviceFulfilled?'The work is finished. That does not replace a promise actually made: we must still settle whether my protection stands.':mariusProtection(c,w)?'You have my protection. I still expect the work you undertook. A useful arrangement should be useful to both of us.':p.appointment==='cassian'?'Cassian took the appointment. I will not offer you his place as though he had done nothing.':n<3?'Vesper has made your position uncertain. I can offer a place with duties you can fulfil, rather than favour you must keep guessing at. There is one appointment. Consider whether you want it.':'There is no empty appointment waiting for you. Mirelle’s completed work could still give me reason to offer protection.',question:'What work, exactly?',answer:d.result==='mirelle'?'Mirelle completed the Library investigation. That satisfies the service I required; you need not perform it again.':p.serviceFulfilled?'Your obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.':'Service to the House, completed on Night Four or Five. It costs you that night and 1 Blood. Leave it unfinished and I withdraw my protection at the sixth reckoning. Mirelle’s completed investigation can satisfy it instead.',personal:'Why should I choose you over Seraphine?',reply:'That is your decision. She can make a bargain I cannot cancel. I can offer a place in the institution I administer. Neither is the same as inheriting it.',offer:allowed('fulfil_service')?'fulfil_service':allowed('petition_marius')?'petition_marius':undefined},

    mirelle:{opening:d.result==='mirelle'?'It is published. Marius has the work; you cannot make him unread it. My key is another matter.':d.result==='dorian'?'Dorian finished first. I dislike the result. Pretending there is still a race would be worse.':root&&d.chosen==='mirelle'?(assistant?'Cassian has joined the work. Give us until the next reckoning. Or close the room now, if you have changed your mind.':'You have let me begin. I still need to bring Cassian in before we can finish.'):root?'You have chosen Dorian. I will not claim a place at his desk. If you stop him before publication, we can talk again.':n<3?'There is a difference between owning the Library and making the court acknowledge it. I can help you put the record before Seraphine.':'Marius needs the Library account. I can give him work worth having—if you will let me begin. Dorian will tell you whom that benefits. I assume you can work it out without him.',question:'What will you reveal?',answer:'Who may use the Library. Which obligations reach beyond it. It is an account Marius can act on, not a collection of rumours. If I finish first, Dorian cannot deliver this investigation to Lucien.',personal:'Why bring Cassian?',reply:'Because I intend to finish. Cassian is impatient to be useful; I can use impatience. Let me in and I can invite him. Withdraw my permission and his Library access goes with it.',offer:allowed('authorize_mirelle')?'authorize_mirelle':n<2&&allowed('investigate_title')?'investigate_title':undefined},

    dorian:{opening:d.result==='dorian'?'The work is published. Lucien has it. You can take my key back; you cannot put the findings back in a drawer.':d.result==='mirelle'?'Mirelle finished. Marius gets the useful result. There is no sense pretending I can still beat her to it.':d.challenged&&d.result==='open'&&d.chosen==='mirelle'&&root?'Mirelle will hand the work to Marius. You do have another option. Stop her before she publishes, then let me bring Lucien in.':root&&d.chosen==='dorian'?(assistant?'Lucien can enter now. You knew I wanted him involved. Let us finish, or tell us to leave.':'You have given me a start. Lucien still needs his invitation before the work can be finished.'):'Mirelle will make Marius the beneficiary and call it useful work. It will be useful work. That is not the part I object to.',question:'Why should I let Lucien see my records?',answer:'Because he has an interest outside Marius’s House. Finish the account for Lucien and he has a reason to protect you without a deadline. He must still grant it, and it remains his to withdraw. I am offering a different patron, not a world without them.',personal:'Are you accusing Mirelle of something?',reply:'No. I am telling you whom she means to help. You do not need a secret crime to have conflicting interests.',offer:allowed('authorize_dorian')?'authorize_dorian':undefined},

    lucien:{opening:permanentPassage?'Dorian did the work. I have extended my protection without a deadline. It is still a favour from me; I would rather you understood that.':d.result==='dorian'?'Dorian has delivered. That gives us something to discuss. Until I actually extend my protection, do not count a conversation as a safe bed.':w.access.passage?'You have a way out until Night Six. Please do not spend all that time congratulating yourself on escaping.':p.passageRequested?'The temporary passage has ended. I told you it would. If Dorian finishes, there may still be a lasting arrangement.':'I can buy you time. It is not the same as solving your problem, but people in your position sometimes need the distinction explained.',question:'How do I make the escape last?',answer:'With temporary passage alone, you must let Dorian begin on Night Four and finish on Night Five, before the passage closes at the start of Night Six. His completed work can earn lasting protection. Delay is dangerous.',personal:'Why help anyone in House Volari?',reply:'Marius would prefer that you needed him. I would prefer that you had reason to remember someone else.',offer:allowed('broker_passage')?'broker_passage':undefined},

    cassian:{opening:d.chosen==='mirelle'&&assistant?'Mirelle brought me into the Library. I would like to finish something before the next person changes their mind.':p.appointment==='player'?'You took the appointment. Congratulations. Now you get to discover why it was called work.':p.appointment==='cassian'?'I took the appointment while it was open. Waiting politely was not going to make me indispensable.':'If you want the appointment, take it. If you do not, stop standing in the doorway.',question:'Would you lose everything if I closed the Library?',answer:'Only what depends on that invitation. Sabine’s court sponsorship, if she has given it, is separate. You can close one door without becoming master of all the others.',personal:'You seem remarkably eager to owe someone.',reply:'I am eager to have a position. There is a difference. You may decide you prefer a bargain of your own.'},

    sabine:{opening:root?'You are getting used to lending keys. The awkward part comes when you ask for them back.':d.result!=='open'?'The work is already public. Taking back the keys cannot undo it. It can still settle who is welcome tomorrow.':'Everyone asks who will protect them. Try asking who that person must answer to. It saves time later.',question:'Can I shut out one person without losing another?',answer:root?'Your investigator and any assistant using their invitation depend on your Library key. Close that invitation and both lose that route. A separate promise from Marius, Lucien or Seraphine remains separate.':'Yes, if their arrangements really are separate. My sponsorship of Cassian depends on Marius, not on your Library. Do not confuse a person with a single chain of favours.',personal:'Whose side are you on?',reply:'I sponsor Cassian when my own position permits it. That is an answer, even if it is not the answer you hoped for.'}

  };

  const mariusRight=mariusProtection(c,w),accepted=p.appointment==='player',paidSanctuary=w.leases.find(l=>l.property_id==='sanctuary'&&l.buyer===p.accounts.player&&l.status==='accepted');
  if(accepted||p.serviceFulfilled||mariusRight){
    voices.marius.question=p.serviceFulfilled?'What remains between us?':'What service is still outstanding?';
    voices.marius.answer=p.serviceFulfilled?(mariusRight?'Your obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.':'The service is fulfilled. No effective protection from me stands in the current record; completed work does not itself reopen a withdrawn promise.'):'Service on Night Four or Five, or Mirelle’s completed investigation. Conversation does not complete it. The obligation remains until the work is confirmed.';
    if(!mariusRight)voices.marius.opening='The current record does not show my protection standing. Your service and your arrangements elsewhere must be considered separately.';
    if(p.finalCourt?.result){voices.marius.opening=p.finalCourt.result==='accepted'?(mariusRight?'My answer is recorded. Our final arrangement stands on its accepted terms.':'My final answer is recorded, but no effective protection from me remains in the current view.'):'My protection was withdrawn at the final reckoning. Your separate arrangements were not mine to cancel.';voices.marius.question='What did the final answer settle?';voices.marius.answer=p.finalCourt.response==='counter'?'The limited invitation you issued has its own term, even if I rejected your proposal. My answer did not transfer your Library or cancel independent shelter.':'The final response is settled. Conversation cannot repeat it or change a separate patron’s rights.';}
  }
  const sanctuaryLease=w.leases.find(l=>l.property_id==='sanctuary'&&l.buyer===p.accounts.player);
  const sanctuaryOffered=!!sanctuaryLease&&sanctuaryLease.status==='offered'&&w.night<sanctuaryLease.offer_expiry_night;
  if(paidSanctuary){
    const active=paidSanctuary.end_night!==null&&w.night<paidSanctuary.end_night&&w.access.sanctuary;
    voices.seraphine.opening=active?'You paid for a refuge. You have one. You may stop thanking me whenever it becomes tiresome.':'Our paid term is in the record, but it is not an effective refuge now. I will not offer the old bargain as though its deadline had never passed.';
    voices.seraphine.question=active?'What remains of our bargain?':'Where does our old bargain stand?';
    voices.seraphine.answer=active?`Your paid sanctuary ${expiryDescription(paidSanctuary.end_night,w.night)}. You owe no new acceptance. The price bought that term, not ownership; neither my displeasure nor Marius’s can shorten it.`:`The accepted sanctuary ${expiryDescription(paidSanctuary.end_night,w.night)}. Check the shelter that is effective now; this conversation does not renew it.`;
    voices.seraphine.offer=undefined;
  }else if(!sanctuaryOffered){
    voices.seraphine.opening=w.access.court||w.access.passage||w.access.sanctuary?'Your other protection stands. My offer is closed; it need not be reopened for that protection to remain yours.':'The offer is closed. I can still listen, but listening will not put a roof over your head.';
    voices.seraphine.question='Can our old offer still help me?';
    voices.seraphine.answer='That offer was not accepted before it closed. Bringing a claim now cannot reopen it. Your Library remains yours; any other effective protection keeps its own terms.';
    voices.seraphine.offer=undefined;
  }else{
    voices.seraphine.opening=p.titleFiled?'Your Library really is your own. Good. Now we can discuss a bargain between people with something to lose.':'Marius likes to know where everyone belongs. I prefer to know whether they can keep a bargain. You need a place to sleep. I have one.';
    if(w.access.court||w.access.passage||w.access.sanctuary)voices.seraphine.opening='You already have shelter under another arrangement. Mine would be a separate bargain: a fixed term, paid in advance, beyond a patron’s change of mind.';
    voices.seraphine.answer=`${sanctuaryOfferSummary(w.night,sanctuaryLease!.duration_nights)} The rent is paid in advance and nonrefundable. Bring your Library claim or the dossier while this offer is still open; filing and acceptance are separate commitments.`;
  }
  if(permanentPassage){voices.lucien.question='What could end your protection?';voices.lucien.answer='My grant has no scheduled end. I can withdraw my own promise; Dorian cannot withdraw it by losing his Library key. You have a patron, not an irrevocable covenant.';}
  for(const actor of ['mirelle','dorian'] as const){
    if(d.chosen===actor&&root&&d.result==='open'){
      voices[actor].question='What still needs to happen?';
      voices[actor].answer=effectiveGrant(w,root)?assistant?'Our assistant has access. The work needs a later reckoning while those invitations remain effective. You do not need to authorize us again.':'I have your invitation. The assistant still needs effective access before the work can finish. A conversation cannot advance the reckoning.':'The invitation is recorded, but it is not effective now. We cannot finish through a permission that no longer opens the Library.';
    }else if(d.result!=='open'&&d.result!==actor){voices[actor].question='Is there still another investigation to choose?';voices[actor].answer='The competing account is already public. That investigation is closed to me. Taking back a key can change future access, but cannot redirect the published work.';}
  }

  const material:Partial<Record<GameAction,string[]>>={

    investigate_title:['It is already your Library. Let us make that claim the reason Seraphine hears you.','This takes tonight’s action and 1 Blood. Accept sanctuary separately by the end of Night Three.'],

    sanctuary_pact:['Marius can decide you have ceased to be useful. Vesper can decide you have stayed long enough. Pay me, and neither decision shortens your sanctuary. Mine cannot either. I find a price agreed in advance saves a great deal of injured feeling.','One nightly action. Pay 0.02 NEAR from the prepaid campaign treasury, nonrefundable, plus network gas. An accepted lease cannot be cancelled by Seraphine, Marius or Vesper. Accept before Night Four.'],

    petition_marius:['Take the appointment. Do the work. You need not plead with me each evening for what you have undertaken to earn. But understand this before you accept: I will expect the obligation fulfilled.','This takes tonight’s action and 1 Blood. Finish service on Night Four or Five, directly or through Mirelle’s completed work. Otherwise Marius withdraws his protection at the sixth reckoning. Protection requires his confirmed grant at reckoning and remains revocable.'],

    fulfil_service:['You undertook the work. Finish it. I value an obligation honoured more than an apology well delivered.','This takes tonight’s action and 1 Blood. Completes your outstanding service. Marius’s protection remains revocable.'],

    authorize_mirelle:['Give me permission to bring Cassian in. Let us finish, and Marius receives the account. If you mean to stop us, do it before I publish. I will not pretend the work can be unread.','One nightly action and 1 Blood. Give Mirelle delegable Library entry without expiry; she can invite Cassian. You may revoke her permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Dorian’s route. The completed account satisfies Marius’s service; his protection still requires his own confirmed grant.'],

    authorize_dorian:['Let me invite Lucien. We finish the account; he gets the benefit. You need not pretend this is neutral. Neither will I.','One nightly action and 1 Blood. Give Dorian delegable Library entry without expiry; he can invite Lucien. You may revoke that permission and its dependent access. Research needs a later reckoning. Publication cannot be recalled and closes Mirelle’s route. Lucien’s lasting protection requires his own confirmed grant.'],

    withdraw_library:['Ask for my key, and my assistant loses this invitation too. If our work is unfinished, it stops here.','This takes tonight’s action. Published findings, your Library ownership, sanctuary and separate patron protection remain.'],

    broker_passage:['Until Night Six, if I grant it. Not forever. You look disappointed. Would a longer promise make you safer if I could not honour it?','This takes tonight’s action and 1 Blood. For lasting protection on this route, begin Dorian’s research on Night Four and allow it to finish on Night Five. Lucien must confirm passage at reckoning; this request alone grants no shelter.'],

    feed:['Hunting restores 4 Blood, up to 12. Tonight’s upkeep still applies.','This takes tonight’s action. Hunting grants no political protection.'],

    rest:['For now, the Crypt admits you. Take what rest it permits.','One nightly action. Restore 2 Blood, up to 12. Requires Crypt access. Vesper’s deadline and dawn upkeep remain unchanged.'],



  };

  const demoted=new Set(['secure_dossier','learn_seraphine','discuss_exchange','investigate_bloodline','investigate_expiry']);

  for(const s of scenes){

    s.compact=true;

    if(s.id.startsWith('action:')){

      const kind=s.id.slice(7) as GameAction;s.rights.push(...s.terms);s.terms=(material[kind]??s.terms).map(t=>t.replace(/^Cost: /,'This takes '));

      s.title=ROLEPLAY_LABELS[kind]??s.title;
      if(isFinalAction(kind)){
        s.title=FINAL_ACTIONS[kind].label;s.lines=[{speaker:'marius',text:kind==='final_counter'?'Two nights. You want me to accept a limit on your hospitality while leaving none on mine. Show me why that should interest me.':kind==='final_refuse'?'You may refuse me. You may not refuse me and keep what I offered on my authority. At this reckoning, my protection ends.':'Then we understand one another. Your title remains yours. I expect to be admitted.'}];
        s.terms=[FINAL_ACTIONS[kind].description,'Marius answers before dawn. Independent shelter and other patrons’ promises remain separate.'];
        if(kind==='final_counter')s.terms.push('Once you offer the invitation, you cannot take it back as part of this bargain—even if Marius refuses.',counterAccepted(c,w)?'Mirelle’s public account, your completed service and Cassian’s settled independent passage give Marius reason to accept a limited inspection.':'Marius will reject this alternative: it requires Mirelle’s published account, completed service, and Cassian’s settled, still-active purchased passage.');
      }
      if(p.finalCourt&&['petition_marius','fulfil_service','authorize_mirelle'].includes(kind))s.terms.push('Marius may demand a continuing Library invitation on Night Seven. Refusal costs his own protection; independent shelter survives. A published account may support a limited counterproposal.');

      const speaker=kind==='withdraw_library'?(d.chosen??'mirelle'):s.portraits[0];

      if(speaker&&!isFinalAction(kind)){s.portraits=[speaker];s.lines=[{speaker,text:kind==='withdraw_library'?(d.result==='open'?'You can tell us to leave. Just understand that the work will stop with us.':'The work is already out. If you want the keys back, say so.'):(material[kind]?.[0]??voices[speaker].opening)}];}

      if(kind==='feed'||kind==='rest')s.lines=[{speaker:'narrator',text:kind==='feed'?'There are arguments you can postpone. Hunger is not one of them.':material.rest![0]}];

      if(material[kind]&&kind!=='feed')s.terms=s.terms.slice(1);
      if(kind==='withdraw_library')s.terms.push('Revokes the investigator’s Library permission and access derived from it. Unfinished research stops; existing financial obligations remain.');







      if(kind==='investigate_title'&&n>=2)s.terms.push('Too late to secure sanctuary this way: you cannot file and accept with the single action left before her deadline.');

      if(kind.startsWith('authorize_')&&n===5)s.terms.push('This is the last start that can finish by Night Seven. Stopping the work tomorrow forfeits its reward.');

      if(kind==='sanctuary_pact'&&sanctuaryLease){s.terms.push(sanctuaryOfferSummary(w.night,sanctuaryLease.duration_nights));s.rights.push(`Exact duration: ${sanctuaryLease.duration_nights} nights from acceptance. Calculated expiry if accepted now: contract night ${w.night+sanctuaryLease.duration_nights} (start of Night ${w.night+sanctuaryLease.duration_nights+1}); expiry is exclusive.`);}

      if(demoted.has(kind))s.choices=[];

      if(s.choices.find(ch=>ch.id==='commit'))s.choices.find(ch=>ch.id==='commit')!.label=isFinalAction(kind)?(kind==='final_counter'?'Grant two nights’ entry and counter · 1 Blood':kind==='final_refuse'?'Refuse his demand':'Give the continuing invitation'):kind==='withdraw_library'?'Take back the keys':kind==='sanctuary_pact'?'We have a deal · pay 0.02 NEAR':ROLEPLAY_LABELS[kind]??'I will do it';

      if(c.status==='playing')s.choices.push(inspect(`decision:${n}`,'Consider my other choices'));

      s.rights.push(`Operation: ${kind.startsWith('authorize_')?'grant_access':kind==='withdraw_library'?'revoke_grant':kind==='sanctuary_pact'?'accept_lease':'existing validated campaign action'}.`);

    }

    if(s.type==='RECKONING'){

      const night=Number(s.id.split(':')[1]);s.rights.push(...s.lines.map(l=>l.text));

      s.lines=reckoningLines(r,night);

      s.title=CHAPTERS[Math.min(night,6)].title;s.terms=[];

    }

    if(s.type==='CAMPAIGN CONCLUSION'){

      if(c.ending==='favoured')s.portraits=[c.reason.includes('Lucien')?'lucien':'marius'];

      s.rights.push(c.reason,...s.terms);s.lines=[{speaker:'narrator',text:c.ending==='unbound'?'You began with shelter someone else could withdraw. You finish the seventh night with your Library still yours, and sanctuary paid for on terms no change of mood can shorten.\n\nSeraphine has not given you a home forever. You have not inherited her power. What you secured is smaller, and real: time that cannot be taken back merely because you cease to please.\n\nFor these seven nights, that was enough.':c.ending==='favoured'?(c.reason.includes('Lucien')?'You have survived the seventh night with Lucien’s protection still standing. A promise from outside House Volari has carried you further than its temporary passage could.\n\nThere is no scheduled end to this protection. There is still a man who can withdraw it. You kept your Library and gained a patron—not a guarantee that he will always want what you want.':'You have survived the seventh night with Marius’s protection still standing. There is a place for you in his order. It is not a small achievement. It is not a place beyond his reach.\n\nYour Library remains yours. His promise remains his. You have secured a future in which that distinction will matter.'):c.resources.blood===0?'Your Blood is exhausted. Whatever shelter you held, it could not replace what was gone.\n\nNo title could answer that hunger. No promise could sustain you.':c.reason.includes('Exposure')?'The old chronicle records the hunters finding you. The court’s promises could not shield you.':'At the reckoning, no qualifying protection remained. A title to the Library was not a place beyond the daylight.\n\nThat distinction has ended this campaign. What you owned and what you could survive were never quite the same question.'}];

      s.terms=[endingSummary(r),...endingConsequences(r)];

    }

  }

  for(const actor of Object.keys(c.npcs) as NpcName[]){

    const v=voices[actor],s=scenes.find(s=>s.id===`character:${actor}`)!;

    s.lines=[{speaker:actor,text:v.opening}];s.terms=[];s.rights=[];

    s.choices=[inspect(`ask:${n}:${actor}`,v.question),inspect(`personal:${n}:${actor}`,v.personal),...(v.offer?[action(v.offer)]:[])];
    if(actor==='vesper'&&c.status==='playing')s.choices.push(inspect(`decision:${n}`,'Return to court exploration'));
    if(actor==='mirelle'||actor==='dorian'){
      if(d.result==='open'&&n>=3){
        s.choices.unshift(inspect(`purpose:${actor}`,'What will the account establish?'));
        scenes.push(make(`purpose:${actor}`,'Work, not surrender',actor,INVESTIGATION_QUESTION,[inspect(`character:${actor}`,'Return to our conversation')]));
      }
      if(completedInvestigator(r)===actor){
        s.choices=[inspect(`finding:${actor}`,'What did our work establish?'),inspect(`meaning:${actor}`,'Why did this matter to you?')];
        scenes.push(make(`finding:${actor}`,'What the account established',actor,investigationFinding(actor),[inspect(`meaning:${actor}`,'Why did this matter to you?'),inspect(`character:${actor}`,'Return to our conversation')],['The work is published. Taking back an invitation cannot recall it. Protection requires a separate confirmed grant.']));
        const finding=scenes.at(-1)!,patron=actor==='mirelle'?'marius':'lucien';
        const protection=w.grants.find(g=>g.property_id===(patron==='marius'?'court':'passage')&&g.grantor===p.accounts[patron]&&g.grantee===p.accounts.player&&g.expiry_night===null&&!g.revoked&&effectiveGrant(w,g));
        if(protection)finding.terms.push(`${patron==='marius'?'Marius':'Lucien'} has separately granted lasting protection. Taking the investigator’s key back does not cancel that promise.`);
        finding.rights=['Completed archive_research journal and persisted publication agree. The finding is authored interpretation, not a new contract rule.',...w.grants.filter(g=>g.property_id==='library'||g===protection).map(g=>`Grant #${g.id}: ${g.grantor} → ${g.grantee}; ${g.property_id}; parent ${g.parent_grant_id??'independent'}; effective ${effectiveGrant(w,g)}.`)];
        scenes.push(make(`meaning:${actor}`,'Whom the work served',actor,actor==='mirelle'?'I wanted Marius to recognise work delivered, rather than keep asking you to prove your usefulness. Cassian helped me finish it. Whether you keep either of us welcome is a different answer.':'I wanted Lucien to have a reason to deal with you directly. It would be a poor escape from one patron if I made myself the keeper of every conversation with the next.',[inspect(`character:${actor}`,'Return to our conversation')]));
      }
    }
    if(actor==='dorian'&&d.result==='open'&&d.chosen==='mirelle'&&root&&effectiveGrant(w,root)&&n<=4&&!d.challenged&&!petitionHasShelter(w,n))s.lines=[{speaker:actor,text:'Changing investigators takes two commitments before the work can finish. I cannot treat Marius’s conditional protection as a reliable fallback, and I see no independent shelter lasting beyond the final reckoning. I will not press you to spend those nights on my petition. You may still inspect the choices available to you.'}];

    const back=[inspect(`character:${actor}`,'There is something else I want to ask'),...(v.offer?[action(v.offer)]:[])];

    scenes.push(make(`ask:${n}:${actor}`,v.question,actor,v.answer,back),make(`personal:${n}:${actor}`,v.personal,actor,v.reply,back));

  }

  const recordText={

    crypt:'The family record names Vesper as your sire. It does not make her the owner of everything you hold. Your Library title is separate. Crypt shelter is hers to withdraw; your ancestry remains.',

    library:d.result==='mirelle'?'Mirelle’s account separates the Library invitations from the promises held outside them. Your title remains yours; your researcher’s key does not control sanctuary or court protection. The completed work has satisfied Marius’s service. His protection is a separate promise, not something that depends on keeping her key.':d.result==='dorian'?'Dorian’s work has reached Lucien. It can earn his lasting protection. It cannot make him incapable of withdrawing that protection, and taking Dorian’s key back cannot make him unread the work.':p.titleFiled?'Your independent Library claim has been put before the court. That fact cannot shelter you by itself. The researchers now want to decide whom the work will benefit.':n<3?'The Library record names you as owner. Vesper cannot take it merely because she is your sire. Put that existing claim before Seraphine if you want to negotiate sanctuary.':'The Library record still names you as owner. The early sanctuary offer has closed; filing this title now will not reopen it.',

    lounge:`Marius and Seraphine founded House Volari from independent bloodlines. He administers castle and succession; her older rights remain her own. ${permanentPassage?'Lucien now offers protection in his own name, outside the House.':'Lucien offers a route outside the House, but his temporary passage alone does not last.'}`

  };

  for(const room of ['crypt','library','lounge'] as const){const detail=roomDevelopment(r,room);scenes.push({...make(`record:${room}`,room==='crypt'?'Blood is not a deed':room==='library'?'What the record can tell you':'Two founders, separate powers','narrator',recordText[room],detail.contacts.map(a=>inspect(`character:${a}`,`Send for ${a[0].toUpperCase()+a.slice(1)}`))),location:room});}

  for(const actor of ['mirelle','dorian'] as const){
    const negotiation=scenes.find(s=>s.id===`action:authorize_${actor}`);
    if(negotiation)negotiation.lines.push({speaker:actor,text:INVESTIGATION_QUESTION});
  }
  if(c.status!=='playing')return;

  const chapter=CHAPTERS[n],text=chapterSituation(r);

  const contacts:NpcName[]=n<3?['seraphine','marius','lucien','vesper']:root?[d.chosen!,d.chosen==='mirelle'?'dorian':'mirelle','sabine']:d.result!=='open'?[d.result==='mirelle'?'marius':'lucien','sabine']:['mirelle','dorian','sabine'];

  scenes.push(make(`discovery:${n}`,chapter.question,'narrator',chapterSituation(r,true),[...contacts.map(a=>({...inspect(`character:${a}`,`Hear ${a[0].toUpperCase()+a.slice(1)}`),secondary:n===0&&a==='lucien'})),inspect(`decision:${n}`,'I am ready to choose')]));

  // Filing is a route to sanctuary, not useful busywork after its offer closes.
  const choices=(r.actions??[]).filter(a=>a.allowed&&a.cost.majorActions>0&&!demoted.has(a.kind)&&(a.kind!=='investigate_title'||w.leases.some(l=>l.property_id==='sanctuary'&&l.status==='offered'&&w.night<l.offer_expiry_night))).map(a=>action(a.kind as GameAction));

  if(!r.pending&&!r.error&&r.availability?.end_night.length===0)choices.push(inspect(`hold:${n}`,root&&d.result==='open'?'Let the investigation finish':root?'Keep the Library open to my allies':'Keep my bargains and wait for dawn'));

  // Rank presentation only: every allowed choice remains available in this same list.
  for(const choice of choices){
    const kind=choice.inspect?.replace('action:','');
    const urgent=kind?.startsWith('final_')||kind==='sanctuary_pact'||kind==='petition_marius'||kind==='fulfil_service'||kind==='investigate_title'&&n<2||kind==='broker_passage'&&n>=2&&!w.access.sanctuary&&!w.access.court;
    choice.secondary=!urgent&&kind!=='feed'&&(kind==='rest'||n<3);
  }
  if(c.resources.blood<=3)choices.sort((a,b)=>Number(b.inspect==='action:feed')-Number(a.inspect==='action:feed'));
  scenes.push({...make(`decision:${n}`,chapter.question,'narrator','You have one action before dawn. A hunt takes the same night as a bargain; hear the terms before you choose.',choices),type:'DECISION'});

  scenes.push({...make(`hold:${n}`,n===6?'Meet the final dawn':'Let the court move','narrator',root&&d.result==='open'?'You leave the investigators to their work. If they still have what they need, they may finish at this reckoning.':'You make no new commitment. The court will still act, and every promise keeps its deadline.',[{id:'pass',label:n===6?'Face the final reckoning':'Wait for dawn',action:{action:'end_night'}}],['Ends this night. No new protection is purchased. Dawn costs 1 Blood with shelter, 3 without; NPCs act and deadlines still apply.']),type:'DECISION'});

  const opening=scenes.find(s=>s.id==='ultimatum');

  if(opening){opening.title=chapter.title;opening.lines=[{speaker:'vesper',text:voices.vesper.opening},{speaker:'narrator',text:'Before the third dawn, find another refuge. Seraphine will sell sanctuary. Marius wants service. The Library cannot shelter you.'}];opening.terms=[];opening.choices=[inspect(`discovery:${n}`,'Find out who might help me'),inspect('character:vesper','I want an explanation')];}

  if(n>0)scenes.push({...make(`incident:${n}`,chapter.title,'narrator',text,[inspect(`discovery:${n}`,'Hear the people involved'),inspect(`decision:${n}`,'Choose my next move')]),automatic:true});

  if(finalDemand(c,w)&&!p.finalCourt!.response){
    const demand=make('final-demand','The price of remaining','marius','You have my protection. You would like to keep it. Very well.\n\nI want an invitation to your Library that does not expire. Keep your title. I have no interest in taking it from you. I am asking whether you intend our arrangement to benefit only you.',[action('final_accept','Keep his protection. Give Marius entry without expiry.'),action('final_refuse','Refuse. Lose his protection at dawn.'),...(allowed('final_counter')?[action('final_counter','Offer two nights of entry—even if he refuses.')]:[])],['One major action. Refusing, ignoring the demand, or offering an unacceptable alternative leads Marius to withdraw his own protection tonight. Independent rights remain intact.']);
    scenes.push(demand);
    for(const id of [`incident:${n}`,`decision:${n}`,'character:marius']){const target=scenes.find(s=>s.id===id);if(target){target.lines=demand.lines;target.choices=target.choices.filter(ch=>!ch.inspect?.startsWith('action:final_'));target.choices.unshift(inspect('final-demand','Answer Marius’s final demand'));target.terms.unshift(...demand.terms);}}
    const hold=scenes.find(s=>s.id===`hold:${n}`);if(hold)hold.terms.unshift('Leaving Marius unanswered costs his protection at this reckoning.');
  }
}



function reckoningLines(r:Result,night:number):DialogueLine[]{

  const c=r.campaign!,lines:DialogueLine[]=[];

  // This persisted player event is written only after the runner confirms revocation.

  if(c.events.includes(`Night ${night+1}: Withdraw your Library permission.`))lines.push({speaker:'narrator',text:'You withdrew your Library invitation. The investigator and any assistant using that key cannot enter through it. Published findings and separate protection remain.'});

  for(const e of c.agentHistory.filter(e=>e.night===night&&e.kind!=='pass'&&(e.execution==='confirmed'||e.execution==='local'))){

    const text:Record<string,string>={

      revoke:'The three nights are over. My Crypt is closed to you. Your Library is still your own.',

      archive_assist:e.actor==='mirelle'?'I have brought Cassian into the Library. We can finish on a later night, if you leave us the room.':'Lucien can now enter the Library through my invitation. Give us another night to finish.',

      archive_research:e.actor==='mirelle'?'The work is published. Marius has what he needed. Dorian cannot claim the same investigation now.':'The findings are published and Lucien has them. Mirelle’s competing route is closed.',

      archive_protect:e.actor==='marius'?'Mirelle’s work is enough. You have my protection; the service is fulfilled. Taking her key back will not undo my promise.':'Dorian delivered. My protection now has no deadline. It remains mine to withdraw, not your investigator’s.',

      archive_challenge:'Before Mirelle publishes, hear my offer. Stop her work and you could still choose Lucien instead of Marius. I have no key until you give me one.',

      appoint:c.politics?.appointment==='player'?'You have my protection. I expect the work by the end of Night Five.':'Cassian has the appointment and my protection. I will not promise that place twice.',

      dismiss:'You left the service unfinished. I have withdrawn my protection. Your arrangements with others are your own.',

      open_passage:'The passage is open to you until the start of Night Six. Use the time. It will not last by itself.',

      sponsor:'I have sponsored Cassian at court. His place through me depends on Marius, not on the Library.',

      publish:'I have made the archive lead public. Lucien can now discuss a passage with you. Speaking to him is not the same as having somewhere safe to sleep.',

      compete:e.actor==='cassian'?'I took the appointment. You were not the only one who needed it.':'I secured the dossier. That opportunity is no longer waiting.',

      collect:'The agreed rent has reached me. It buys the nights we agreed, not another night beyond them.',

      collect_sanctuary:'The sanctuary rent has reached me. Your refuge keeps the same end date.',

      offer:'There is room at my table, if you want to discuss the standing offer.'

    };

    if(text[e.kind])lines.push({speaker:e.actor,text:text[e.kind]});

  }

  for(const l of r.world.leases.filter(l=>l.buyer===c.politics?.accounts.player&&['sanctuary','lounge'].includes(l.property_id)&&l.status==='accepted'&&l.end_night!==null&&l.end_night-l.duration_nights===night))lines.unshift({speaker:'seraphine',text:`We have a bargain. Your ${l.property_id==='sanctuary'?'sanctuary':'place in the Lounge'} ${expiryDescription(l.end_night,r.world.night)}. No gratitude is required. You met the price.`});

  if(night===4&&r.world.grants.some(g=>g.property_id==='passage'&&g.grantee===c.politics?.accounts.player&&g.expiry_night===5))lines.push({speaker:'narrator',text:`The temporary passage has reached its deadline. ${r.world.access.passage?'A separate right still keeps the passage open to you.':'That route is now closed to you.'}`});

  if(!lines.length)lines.push({speaker:'narrator',text:night===6?'The final dawn arrives. No new bargain was made in the court tonight. What remains is what your choices have left standing.':'No new claim or broken promise reaches you tonight. The quiet does not stop the deadlines.'});

  return lines;


}




// Consolidate existing projections and links; all executable choices come from availability.
export function repairCourtFlow(r:Result,scenes:EncounterScene[]):void{
  const c=r.campaign!,p=c.politics!,n=c.night,w=r.world,d=p.library!;
  const get=(id:string)=>scenes.find(s=>s.id===id);
  const link=(id:string,label:string):SceneChoice=>({id,inspect:id,label});
  const available=(kind:string)=>r.actions?.find(a=>a.kind===kind);
  const can=(kind:string)=>available(kind)?.allowed===true;
  const commitLabel=(kind:GameAction)=>`${kind==='feed'?'Feed · +4 Blood':kind==='petition_marius'?'Accept the appointment':kind==='sanctuary_pact'?'Accept sanctuary · pay 0.02 NEAR':kind==='authorize_mirelle'?'Authorize Mirelle':kind==='authorize_dorian'?'Authorize Dorian':kind==='withdraw_library'?'Take back the keys':kind==='fulfil_service'?'Complete my service':kind==='broker_passage'?'Request Lucien’s passage':kind==='final_counter'?'Grant two nights’ entry and counter':kind==='final_refuse'?'Refuse his demand':kind==='final_accept'?'Give the continuing invitation':available(kind)?.label??kind} · tonight’s action${available(kind)?.cost.blood?` · ${available(kind)!.cost.blood} Blood`:''}`;
  for(const s of scenes){
    if(s.type==='RECKONING'&&c.status==='playing')s.completionLabel='Review tonight’s choices';
    for(const choice of s.choices){
      if(choice.inspect?.startsWith('action:')){const kind=choice.inspect.slice(7) as GameAction;choice.label=DISCUSS_LABELS[kind]??`Review ${available(kind)?.label??choice.label}`;}
      if(choice.action?.action==='game'&&available(choice.action.choice!)?.cost.majorActions)choice.label=commitLabel(choice.action.choice!);
    }
    if(!s.id.startsWith('action:'))continue;
    const kind=s.id.slice(7) as GameAction,a=available(kind);
    s.title=DISCUSS_LABELS[kind]??s.title;
    if(a&&!a.allowed){
      s.rights.push(...s.lines.map(l=>l.text),...s.terms);
      s.lines=[{speaker:s.portraits[0]??'narrator',text:'This commitment is not available in the current situation.'}];
      s.terms=[...a.reasons];
      s.choices=s.choices.filter(ch=>!ch.action);
      if(s.portraits[0])s.choices.unshift(link(`character:${s.portraits[0]}`,'Discuss the current situation'));
    }
    // Current terms remain directly visible; no Continue gate inside an offer.
    if(kind==='final_accept'&&a?.allowed)s.lines=[{speaker:'marius',text:'If you give me that invitation, your title remains yours. I would be admitted on the terms you are considering.'}];
  }
  const root=libraryRoot(c,w);
  for(const actor of ['mirelle','dorian'] as const){
    const character=get(`character:${actor}`);if(!character)continue;
    if(root&&can('withdraw_library'))character.choices.push(link('action:withdraw_library','Review withdrawing the current invitation'));
    if(d.result==='open'&&root&&d.chosen!==actor)character.terms.push('Another investigator holds your delegation. Withdraw it before authorizing a different investigator; publication closes that competing route.');
    if(d.result!=='open'&&d.result!==actor)character.choices=character.choices.filter(ch=>!ch.inspect?.startsWith('purpose:'));
    const proposal=get(`action:authorize_${actor}`),purpose=get(`purpose:${actor}`);
    if(proposal&&purpose){
      // The optional research question remains, but no duplicate mandatory statement.
      proposal.lines=proposal.lines.filter(l=>l.text!==INVESTIGATION_QUESTION);
      proposal.choices.splice(Math.max(0,proposal.choices.length-1),0,link(purpose.id,'Ask what the account will establish'));
    }
  }
  if(!p.serviceFulfilled&&mariusProtection(c,w)&&!petitionHasShelter(w,n)&&d.result==='open'){
    const warning='Marius’s service is still outstanding. If you withdraw Mirelle on Night Five and authorize Dorian on Night Six, Marius withdraws protection at that reckoning, before Dorian can finish. Without independent shelter, this route can end your campaign. Switching remains your choice.';
    for(const id of ['character:dorian','action:withdraw_library','action:authorize_dorian'])get(id)?.terms.push(warning);
  }
  const marius=get('character:marius');
  if(marius&&(p.appointment==='player'||p.serviceFulfilled||mariusProtection(c,w)||p.finalCourt?.result)){
    const comparison=marius.choices.find(ch=>ch.inspect===`personal:${n}:marius`);if(comparison)comparison.reviewOnly=true;
  }
  // One nightly surface: situation, eligible proposals and optional contacts.
  const decision=get(`decision:${n}`),discovery=get(`discovery:${n}`),incident=get(`incident:${n}`);
  if(decision&&discovery){
    decision.lines=[{speaker:'narrator',text:chapterSituation(r)}];
    const contacts=discovery.choices.filter(ch=>ch.inspect?.startsWith('character:')).map(ch=>({...ch,secondary:!(n===0&&ch.inspect==='character:vesper'),label:ch.label.replace(/^Hear /,'Speak with ')}));
    decision.choices=decision.choices.filter(ch=>!ch.inspect?.startsWith('hold:'));
    if(c.status==='playing'&&!r.pending&&!r.error&&r.availability?.end_night.length===0)decision.choices.push({id:'wait',label:n===6?'Face the final reckoning · end this night':root&&d.result==='open'?'Let the work continue · end this night':'Wait for dawn · end this night',action:{action:'end_night'},summary:['Uses the remaining night. Dawn takes 1 Blood with shelter, 3 without; NPCs act and deadlines still apply. No new protection is purchased.']});
    decision.choices.push(...contacts);
    decision.automatic=n>0;
    discovery.redirect=decision.id;discovery.choices=[];discovery.automatic=false;
    const hold=get(`hold:${n}`);if(hold){hold.redirect=decision.id;hold.choices=[];}
    if(incident){incident.redirect=decision.id;incident.choices=[];incident.automatic=false;}
  }
  const demand=get('final-demand');
  if(demand&&c.status==='playing'&&!p.finalCourt?.response){
    demand.type='NEGOTIATION';
    demand.terms=['Marius answers before dawn. Advice is free; leaving this screen does not answer his demand.'];
    demand.choices=[];
    for(const kind of ['final_accept','final_refuse','final_counter'] as const){
      const proposal=get(`action:${kind}`),commit=proposal?.choices.find(ch=>ch.action);
      if(proposal&&commit){
        const terms:string[]=[FINAL_ACTIONS[kind].description];
        if(kind==='final_counter')terms.push(counterAccepted(c,w)?'The published Mirelle account and Cassian’s settled passage satisfy Marius’s stated conditions.':'The current account and passage conditions do not satisfy Marius. He will reject this counterproposal.');
        demand.choices.push({...commit,id:kind,summary:terms});
      }
      if(proposal){proposal.redirect=demand.id;proposal.choices=[];}
    }
    if(decision){
      demand.choices.push(...decision.choices.filter(ch=>ch.id==='wait'||ch.inspect==='action:feed'||ch.inspect==='action:rest').map(ch=>ch.id==='wait'?{...ch,label:'Leave the demand unanswered · face the final reckoning',summary:['Marius withdraws his protection. Other shelter remains independent. Dawn upkeep and the final court resolution still occur.']}:ch));
      decision.redirect=demand.id;decision.choices=[];decision.automatic=false;
    }
    demand.choices.push(link('character:seraphine','Ask Seraphine about independent shelter'),link('character:sabine','Ask Sabine about separate rights'));
    demand.automatic=true;
    if(marius){marius.redirect=demand.id;marius.choices=[];}
  }else for(const kind of ['final_accept','final_refuse','final_counter']){const old=get(`action:${kind}`);if(old){old.redirect='character:marius';old.choices=[];}}
  // Never execute a stale, reconstructed or ended commitment from presentation.
  for(const s of scenes)s.choices=s.choices.filter(ch=>!ch.action||c.status==='playing'&&!r.pending&&!r.error&&(ch.action.action!=='game'||can(ch.action.choice!)));
}
