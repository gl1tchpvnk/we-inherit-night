import {expiryDescription} from './leaseNarrative.ts';
import {finalDemand,counterAccepted,FINAL_ACTIONS,isFinalAction} from './finalCourt.ts';
import type {Result} from './chain';

import type {NpcName,GameAction} from './game';

import type {EncounterScene,SceneChoice,DialogueLine} from './encounters';

import {libraryRoot,effectiveGrant} from './library.ts';



// Authored fiction over existing state. No new history, knowledge, rights or decisions.

export const CHAPTERS=[

  {title:'A bed before dawn',question:'Whose help can you afford?',text:'You are newly awakened. Vesper is your sire, but the Library belongs to you. In three nights she will close the Crypt. Find somewhere the daylight cannot reach you. These seven nights will decide whether you endure on your own terms or under a patron.'},

  {title:'The price of company',question:'A bargain or a place in the House?',text:'Seraphine offers a bargain with a limit. Marius offers a place with a duty. Lucien offers time. None of them can choose for you, and none will keep an offer open forever.'},

  {title:'The last borrowed night',question:'Where will you sleep tomorrow?',text:'Tonight Vesper means to close her door. It will not make the Library hers. Owning that room, though, will not keep the sun from your body.'},

  {title:'Your door, their quarrel',question:'Who gets to use what is yours?',text:'Now the petitions come to you. Mirelle wants to put the Library to work for Marius. Dorian wants Lucien to benefit instead. They need your leave, and each intends to bring someone with them.'},

  {title:'Before the ink dries',question:'Let the work finish, or stop it?',text:'There is a difference between letting someone read and letting their findings leave the room. Once the work is published, closing the Library cannot call it back.'},

  {title:'What survives a promise',question:'What are you prepared to leave unfinished?',text:'There is just enough time to begin one last investigation and let it finish tomorrow. There is not enough time to change your mind twice. Keep yourself alive while you decide which promises deserve another night.'},

  {title:'The door you leave open',question:'What will remain when dawn comes?',text:'This is the final night of the campaign. If research is still running, you can let it finish or stop it. If it is published, you can reclaim the keys or leave your allies welcome. Whatever you choose, you must survive the dawn.'}

] as const;

export const ROLEPLAY_LABELS:Partial<Record<GameAction,string>>={

  investigate_title:'Put my claim before Seraphine',sanctuary_pact:'I want a refuge of my own',petition_marius:'I will take my chances with Marius',fulfil_service:'Keep my word to Marius',

  authorize_mirelle:'Let Mirelle and Cassian do the work',authorize_dorian:'Back Dorian and Lucien',withdraw_library:'I want my Library back',broker_passage:'Ask Lucien for a way out',feed:'Hunt before hunger decides for me',rest:'Rest while Vesper still permits it',conceal:'Keep out of sight'

};

export function endingSummary(r:Result):string{

  const c=r.campaign!;

  if(c.ending==='unbound'){

    const lease=r.world.leases.find(l=>l.property_id==='sanctuary'&&l.buyer===c.politics?.accounts.player&&l.status==='accepted');

    const title=r.world.properties.some(p=>p.id==='library'&&p.owner===c.politics?.accounts.player)?'Your Library is still yours. ':'';
    if(lease?.end_night!=null&&lease.end_night>r.world.night&&lease.end_night>=7)return `${title}Seraphine cannot withdraw her protection, and it will last through the final night. But sanctuary is not ownership.`;
    if(lease)return `${title}Your sanctuary ${expiryDescription(lease.end_night,r.world.night)}. It grants no ownership${lease.end_night!==null&&lease.end_night>r.world.night?'; Seraphine cannot withdraw it before that deadline':''}.`;
    return `${title}No accepted sanctuary agreement is confirmed in the current record. Sanctuary is not ownership.`;

  }

  if(c.ending==='favoured')return `${c.reason.includes('Lucien')?'Lucien':'Marius'} protects you. That promise has no scheduled end, but remains the patron’s to withdraw. Your Library remains separate.`;

  return c.resources.blood===0?'Your Blood is exhausted. Rights and promises cannot keep you alive without it.':c.resources.exposure>=10?'The hunters found you. Exposure reached 10.':c.night<7?'No shelter remained after Vesper closed the Crypt. The Library and Lounge are not refuges.':'No lasting patron protection or qualifying sanctuary remained at the final reckoning. Ordinary room invitations cannot replace them.';

}

// Epilogue evidence is presentation only; the engine's stored ending is never recomputed.

export function endingConsequences(r:Result):string[]{

  const c=r.campaign!,p=c.politics,d=p?.library;

  if(!p||!d)return [];

  const root=libraryRoot(c,r.world),lines:string[]=[];

  if(p.appointment==='player')lines.push(p.serviceFulfilled?'You kept the work promised to Marius. Your place in his institution was earned through service.':r.world.grants.some(g=>g.property_id==='court'&&g.grantee===p.accounts.player&&g.revoked)?'You left Marius’s work unfinished. He withdrew his promise; any separate shelter had to carry you.':'Marius’s promised work remains unfinished.');

  if(d.result!=='open')lines.push(d.result==='mirelle'?'You let Mirelle deliver the Library account to Marius. Dorian’s competing investigation closed before it could serve Lucien.':'You let Dorian deliver the Library account to Lucien. Mirelle’s competing investigation closed before it could serve Marius.');

  else lines.push('Neither investigator delivered the Library account. No patron can owe you protection for work that never reached them.');

  const withdrawn=r.world.grants.some(g=>g.property_id==='library'&&g.grantor===p.accounts.player&&g.can_delegate&&g.revoked);

  if(withdrawn)lines.push('You took back an investigator’s key. Their dependent invitations fell with it; separate promises did not.');

  if(root)lines.push(`You left ${d.chosen==='mirelle'?'Mirelle':'Dorian'} welcome in the Library. That invitation remains yours to withdraw.`);

  const patrons=[['court','Marius'],['passage','Lucien']] as const;

  for(const [property,name] of patrons)if(r.world.grants.some(g=>g.property_id===property&&g.grantee===p.accounts.player&&g.expiry_night===null&&effectiveGrant(r.world,g)))lines.push(`${name}’s separate protection still stands. It depends on that patron, not on the investigator keeping your key.`);

  if(p.finalCourt?.result)lines.push(p.finalCourt.result==='accepted'?(p.finalCourt.response==='counter'?'Your published account supported a narrower bargain. Marius kept his protection; you gave him a two-night Library invitation, not permanent access.':'You kept Marius’s protection by giving him a continuing, non-delegable Library invitation.'):'Marius withdrew his protection at the final confrontation. Your refusal or rejected proposal did not cancel independent shelter.');
  if(p.finalCourt?.result==='rejected'&&p.finalCourt.response==='counter'&&r.world.grants.some(g=>g.property_id==='library'&&g.grantee===p.accounts.marius&&g.expiry_night===8&&effectiveGrant(r.world,g)))lines.push('The two-night invitation you offered Marius still stands, although he rejected the bargain. It is temporary access, not ownership.');

  return lines;

}

export function chapterSituation(r:Result):string{

  const c=r.campaign!,p=c.politics!,d=p.library,n=c.night,w=r.world;

  if(c.status!=='playing')return endingSummary(r);
  if(finalDemand(c,w)&&!p.finalCourt?.response)return 'Marius wants a continuing Library invitation. Answer before the final reckoning: accept, refuse and lose his protection, or use the published account to propose limited entry. Other patrons’ protection remains separate.';

  const base=n===5&&d?.result!=='open'? 'The work is public. There is no second investigation to sell to a different patron. Decide who may keep using your Library, and whether you can afford another night without feeding.':CHAPTERS[Math.min(n,6)].text;

  const hunger=c.resources.blood<=3?' Your hunger is immediate: another costly night could kill you.':'';

  if(n<3)return base+(w.access.sanctuary||w.access.court?' Your shelter is secured separately from Vesper. Keep enough Blood to reach it.':'')+hunger;

  const root=libraryRoot(c,w);

  const progress=d?.result!=='open'&&d?.result?` ${d.result==='mirelle'?'Mirelle':'Dorian'} has published. ${root?'The Library remains open to your investigator.':'Your investigator no longer has the key you issued.'}`:root?' The investigation is still unfinished. Closing the Library now stops it.':n===6?' No investigation is running. Earlier choices have left no time to begin another.':' Neither investigator currently has your lasting invitation to the Library.';

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

  const action=(kind:GameAction,label=ROLEPLAY_LABELS[kind]??kind)=>inspect(`action:${kind}`,label);

  const make=(id:string,title:string,speaker:DialogueLine['speaker'],text:string,choices:SceneChoice[],terms:string[]=[]):EncounterScene=>({id,title,type:'ENCOUNTER',location:speaker==='vesper'?'crypt':['mirelle','cassian','dorian'].includes(speaker)?'library':'lounge',portraits:speaker==='narrator'?[]:[speaker],lines:[{speaker,text}],choices,terms,rights:[],compact:true});

  const assistant=root&&w.grants.find(g=>g.parent_grant_id===root.id&&effectiveGrant(w,g));

  const permanentPassage=w.access.passage&&w.grants.some(g=>g.property_id==='passage'&&g.grantee===p.accounts.player&&g.grantor===p.accounts.lucien&&g.expiry_night===null&&effectiveGrant(w,g));

  const voices:Record<NpcName,{opening:string;question:string;answer:string;personal:string;reply:string;offer?:GameAction}>={

    vesper:{opening:w.access.crypt?(n===2?'Tonight. You have had time to ask everyone else what they think of me. I trust you have also found a bed.':`You may sleep in my Crypt for ${3-n} more nights. Then you will find another roof. I will not have dependence mistaken for a birthright.`):'My door is closed. Yours is not. You still own the Library. I expect you are discovering how pleasant it is to be the one people ask.',question:'Does being your descendant count for nothing?',answer:'It makes you my descendant. It does not oblige me to house you forever. Nor does it entitle me to your Library. Tradition has limits; that is why it survives.',personal:'Are you trying to make me fail?',reply:'I am telling you precisely when my hospitality ends. Do not mistake that warning for a promise that someone else will catch you.'},

    seraphine:{opening:w.access.sanctuary?'You paid for a refuge. You have one. You may stop thanking me whenever it becomes tiresome.':n>=3?'You missed the offer. I can still listen, but listening will not put a roof over your head.':p.titleFiled?'Your Library really is your own. Good. Now we can discuss a bargain between people with something to lose.':'Marius likes to know where everyone belongs. I prefer to know whether they can keep a bargain. You need a place to sleep. I have one.',question:'What is the catch?',answer:'Seven nights of sanctuary, paid in advance: 0.02 NEAR. No refund, no ownership. I cannot take it back once you accept, but it ends. Bring your Library claim or the dossier before Night Four.',personal:'And Marius is content with that?',reply:'Ask him. We founded this House together; we did not become the same person. My rights were mine before our marriage. They still are.',offer:allowed('sanctuary_pact')?'sanctuary_pact':n<2&&allowed('investigate_title')?'investigate_title':undefined},

    marius:{opening:p.serviceFulfilled&&w.access.court?'The work is finished. I said I would protect you, and I am doing so. We need not make a ceremony of it.':p.serviceFulfilled?'The work is finished. That does not replace a promise actually made: we must still settle whether my protection stands.':w.access.court?'You have my protection. I still expect the work you undertook. A useful arrangement should be useful to both of us.':p.appointment==='cassian'?'Cassian took the appointment. I will not offer you his place as though he had done nothing.':n<3?'Vesper has given you a deadline. I have an appointment to fill. Do the work the House needs, and I can make room for you.':'There is no empty appointment waiting for you. Mirelle’s completed work could still give me reason to offer protection.',question:'What work, exactly?',answer:d.result==='mirelle'?'Mirelle completed the Library investigation. That satisfies the service I required; you need not perform it again.':p.serviceFulfilled?'Your obligation is fulfilled. My protection remains mine to withdraw, not Vesper’s.':'Service to the House, completed on Night Four or Five. It costs you that night and 1 Blood. Leave it unfinished and I withdraw my protection at the sixth reckoning. Mirelle’s completed investigation can satisfy it instead.',personal:'Why should I choose you over Seraphine?',reply:'That is your decision. She can make a bargain I cannot cancel. I can offer a place in the institution I administer. Neither is the same as inheriting it.',offer:allowed('fulfil_service')?'fulfil_service':allowed('petition_marius')?'petition_marius':undefined},

    mirelle:{opening:d.result==='mirelle'?'It is published. Marius has the work; you cannot make him unread it. My key is another matter.':d.result==='dorian'?'Dorian finished first. I dislike the result. Pretending there is still a race would be worse.':root&&d.chosen==='mirelle'?(assistant?'Cassian has joined the work. Give us until the next reckoning. Or close the room now, if you have changed your mind.':'You have let me begin. I still need to bring Cassian in before we can finish.'):root?'You have chosen Dorian. I will not claim a place at his desk. If you stop him before publication, we can talk again.':n<3?'There is a difference between owning the Library and making the court acknowledge it. I can help you put the record before Seraphine.':'I want to finish work Marius can use. Cassian can help. You have the room; I need you to decide whether we may use it.',question:'What will you reveal?',answer:'An account of the Library’s present obligations: who may use it, and which promises stand outside it. Not a secret ancestry or a convenient scandal. Marius wants the finished work. Once he has it, Dorian cannot offer Lucien the same investigation.',personal:'Why bring Cassian?',reply:'Because I need an assistant. Let me in and I can invite him under your permission. Take my key back and his stops working too. His other patrons are another matter.',offer:allowed('authorize_mirelle')?'authorize_mirelle':n<2&&allowed('investigate_title')?'investigate_title':undefined},

    dorian:{opening:d.result==='dorian'?'The work is published. Lucien has it. You can take my key back; you cannot put the findings back in a drawer.':d.result==='mirelle'?'Mirelle finished. Marius gets the useful result. There is no sense pretending I can still beat her to it.':d.challenged&&d.result==='open'&&d.chosen==='mirelle'&&root?'Mirelle will hand the work to Marius. You do have another option. Stop her before she publishes, then let me bring Lucien in.':root&&d.chosen==='dorian'?(assistant?'Lucien can enter now. You knew I wanted him involved. Let us finish, or tell us to leave.':'You have given me a start. Lucien still needs his invitation before the work can be finished.'):'Help Mirelle and Marius benefits. Help me and someone outside his House does. I am not pretending those are the same bargain.',question:'Why should I let Lucien see my records?',answer:'Because his protection could be useful to you. Finish the research and he has a reason to offer it without a deadline. It is still his to withdraw. If you want a favour with no patron attached, talk to Seraphine.',personal:'Are you accusing Mirelle of something?',reply:'No. I am telling you whom she means to help. You do not need a secret crime to have conflicting interests.',offer:allowed('authorize_dorian')?'authorize_dorian':undefined},

    lucien:{opening:permanentPassage?'Dorian did the work. I have extended my protection without a deadline. It is still a favour from me; I would rather you understood that.':d.result==='dorian'?'Dorian has delivered. That gives us something to discuss. Until I actually extend my protection, do not count a conversation as a safe bed.':w.access.passage?'You have a way out until Night Six. Please do not spend all that time congratulating yourself on escaping.':p.passageRequested?'The temporary passage has ended. I told you it would. If Dorian finishes, there may still be a lasting arrangement.':'I can buy you time. It is not the same as solving your problem, but people in your position sometimes need the distinction explained.',question:'How do I make the escape last?',answer:'With temporary passage alone, you must let Dorian begin on Night Four and finish on Night Five, before the passage closes at the start of Night Six. His completed work can earn lasting protection. Delay is dangerous.',personal:'Why help anyone in House Volari?',reply:'I am outside the House. That does not mean I have no interest in what happens here. A useful connection need not become a family relationship.',offer:allowed('broker_passage')?'broker_passage':undefined},

    cassian:{opening:d.chosen==='mirelle'&&assistant?'Mirelle brought me into the Library. I would like to finish something before the next person changes their mind.':p.appointment==='player'?'You took the appointment. Congratulations. Now you get to discover why it was called work.':p.appointment==='cassian'?'I took the appointment while it was open. Waiting politely was not going to make me indispensable.':'If you want the appointment, take it. If you do not, stop standing in the doorway.',question:'Would you lose everything if I closed the Library?',answer:'Only what depends on that invitation. Sabine’s court sponsorship, if she has given it, is separate. You can close one door without becoming master of all the others.',personal:'You seem remarkably eager to owe someone.',reply:'I am eager to have a position. There is a difference. You may decide you prefer a bargain of your own.'},

    sabine:{opening:root?'You are getting used to lending keys. The awkward part comes when you ask for them back.':d.result!=='open'?'The work is already public. Taking back the keys cannot undo it. It can still settle who is welcome tomorrow.':'Everyone asks who will protect them. Try asking who that person must answer to. It saves time later.',question:'Can I shut out one person without losing another?',answer:root?'Your investigator and any assistant using their invitation depend on your Library key. Close that invitation and both lose that route. A separate promise from Marius, Lucien or Seraphine remains separate.':'Yes, if their arrangements really are separate. My sponsorship of Cassian depends on Marius, not on your Library. Do not confuse a person with a single chain of favours.',personal:'Whose side are you on?',reply:'I sponsor Cassian when my own position permits it. That is an answer, even if it is not the answer you hoped for.'}

  };

  const material:Partial<Record<GameAction,string[]>>={

    investigate_title:['Put your existing independent Library claim before Seraphine. It opens her sanctuary offer; it does not give shelter.','Cost: one major action and 1 Blood. Accept sanctuary separately by the end of Night Three.'],

    sanctuary_pact:['Receive 7 nights of sanctuary. Neither Vesper nor Marius can withdraw it; Seraphine cannot cancel an accepted bargain. Your Library remains yours.','Cost: 0.02 Sandbox NEAR, prepaid and nonrefundable, plus network gas and one major action. Temporary shelter, not ownership. Accept before Night Four.'],

    petition_marius:['Claim the appointment before Cassian. Marius must actually offer protection at reckoning; the appointment alone is not shelter.','Cost: one major action. Finish service on Night Four or Five, directly or through Mirelle’s completed work. Otherwise Marius withdraws his protection at the sixth reckoning.'],

    fulfil_service:['Complete the work you owe Marius. His protection remains dependent on him; this does not buy independence.','Cost: one major action and 1 Blood. Completes your outstanding service.'],

    authorize_mirelle:['Let Mirelle read the Library and invite Cassian. Completed research satisfies Marius’s service and can earn his protection.','Cost: one major action. No deadline on these invitations; you may withdraw them. They need a subsequent reckoning to finish. Publication closes Dorian’s competing route and cannot be recalled.'],

    authorize_dorian:['Let Dorian read the Library and invite Lucien. Completed research can earn lasting protection from Lucien, still his to withdraw.','Cost: one major action. No deadline on these invitations; you may withdraw them. Lucien can see your records. Publication needs a subsequent reckoning, closes Mirelle’s route and cannot be recalled.'],

    withdraw_library:['Take back the investigator’s key and any assistant’s dependent invitation. Unfinished research stops.','Cost: one major action. Published findings, your Library ownership, sanctuary and separate patron protection remain.'],

    broker_passage:['Lucien can open temporary shelter at reckoning, ending at the start of Night Six. It cannot carry you through the ending alone.','Cost: one major action. For lasting protection on this route, begin Dorian’s research on Night Four and allow it to finish on Night Five.'],

    feed:['Recover 4 Blood, up to 12; gain 2 Exposure before reckoning. Exposure 10 is fatal. Tonight’s upkeep still applies.','Cost: one major action. Hunting grants no political protection.'],

    rest:['Recover 2 Blood and lose 1 Exposure, within resource limits. Requires Crypt access.','Cost: one major action. Vesper’s deadline is unchanged.'],

    conceal:['Lose 3 Exposure, down to zero.','Cost: one major action and 1 Blood. This does not provide shelter.']

  };

  const demoted=new Set(['secure_dossier','learn_seraphine','discuss_exchange','investigate_bloodline','investigate_expiry']);

  for(const s of scenes){

    s.compact=true;

    if(s.id.startsWith('action:')){

      const kind=s.id.slice(7) as GameAction;s.rights.push(...s.terms);s.terms=material[kind]??s.terms;

      s.title=ROLEPLAY_LABELS[kind]??s.title;
      if(isFinalAction(kind)){
        s.title=FINAL_ACTIONS[kind].label;s.lines=[{speaker:'marius',text:kind==='final_counter'?'A limited inspection, instead of a standing invitation? Show me what makes that worth accepting.':kind==='final_refuse'?'Then you understand what you are refusing. My protection ends tonight. Your arrangements with the others are their affair.':'A standing invitation, then. I keep my protection; you let me into the Library. Neither of us needs to pretend this is friendship.'}];
        s.terms=[FINAL_ACTIONS[kind].description,'This decision uses tonight’s one major action. Navigation and inspection are free. Marius answers at this reckoning. Independent shelter and other patrons’ promises remain separate.'];
        if(kind==='final_counter')s.terms.push('You surrender the limited invitation even if he rejects the proposal. Issuing it and his later answer are separate operations, not an atomic bargain.',counterAccepted(c,w)?'Mirelle’s public account, your completed service and Cassian’s settled independent passage give Marius reason to accept a limited inspection.':'Marius will reject this alternative: it requires Mirelle’s published account, completed service, and Cassian’s settled, still-active purchased passage.');
      }
      if(p.finalCourt&&['petition_marius','fulfil_service','authorize_mirelle'].includes(kind))s.terms.push('Marius may demand a continuing Library invitation on Night Seven. Refusal costs his own protection; independent shelter survives. A published account may support a limited counterproposal.');

      const speaker=kind==='withdraw_library'?(d.chosen??'mirelle'):s.portraits[0];

      if(speaker&&!isFinalAction(kind)){s.portraits=[speaker];s.lines=[{speaker,text:kind==='withdraw_library'?(d.result==='open'?'You can tell us to leave. Just understand that the work will stop with us.':'The work is already out. If you want the keys back, say so.'):kind==='investigate_title'?'You need not win the Library from Vesper. It is yours. Put that fact before Seraphine, and see what she will offer.':voices[speaker].opening}];}

      if(kind==='feed'||kind==='rest'||kind==='conceal')s.lines=[{speaker:'narrator',text:kind==='feed'?'There are arguments you can postpone. Hunger is not one of them.':kind==='rest'?'For one more night, Vesper’s roof is available. Rest here, knowing it is still hers.':'Leave the court’s attention elsewhere. Silence costs time too.'}];

      const cost=r.actions?.find(a=>a.kind===kind)?.cost.blood??0;

      if(c.resources.blood<=cost+1&&kind!=='feed'&&kind!=='rest')s.terms.push('Warning: the Blood cost and dawn upkeep may kill you. Protection cannot sustain an exhausted body.');

      if(kind==='feed'&&c.resources.exposure>=8)s.terms.push('Warning: feeding now reaches the fatal Exposure threshold of 10.');

      if(kind==='investigate_title'&&n>=2)s.terms.push('Too late to secure sanctuary this way: you cannot file and accept with the single action left before her deadline.');

      if(kind.startsWith('authorize_')&&n===5)s.terms.push('This is the last start that can finish by Night Seven. Stopping the work tomorrow forfeits its reward.');

      if(kind==='sanctuary_pact'){const lease=w.leases.find(l=>l.property_id==='sanctuary');if(lease)s.terms.push(`Shelter ends at the start of Night ${w.night+lease.duration_nights+1} if accepted now; it must still be active after the seventh reckoning.`);}

      if(demoted.has(kind))s.choices=[];

      if(s.choices.find(ch=>ch.id==='commit'))s.choices.find(ch=>ch.id==='commit')!.label=isFinalAction(kind)?(kind==='final_counter'?'Make the counterproposal · 1 Blood':kind==='final_refuse'?'Refuse his demand':'Give the continuing invitation'):kind==='withdraw_library'?'Take back the keys':kind==='sanctuary_pact'?'We have a deal · pay 0.02 NEAR':ROLEPLAY_LABELS[kind]??'I will do it';

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

      s.rights.push(c.reason,...s.terms);s.lines=[{speaker:'narrator',text:c.ending==='unbound'?'Vesper’s door is closed. You no longer need it. The Library remains yours, and Seraphine’s bargain has carried you beyond this week. Freedom has an end date here; it is still more than you began with.':c.ending==='favoured'?`You have survived. ${c.reason.includes('Lucien')?'Lucien':'Marius'} stands behind you. That is a place in the world, even if it is not a place beyond everyone else’s reach.`:c.resources.blood===0?'You kept count of promises until there was no Blood left to spend. A safe room cannot save a body that cannot reach it.':c.resources.exposure>=10?'You fed until the hunters found you. The court’s promises were no shield against that attention.':'The Library may still bear your name. It is not a refuge. Dawn finds you without the protection you needed.'}];

      s.terms=[endingSummary(r),...endingConsequences(r)];

    }

  }

  for(const actor of Object.keys(c.npcs) as NpcName[]){

    const v=voices[actor],s=scenes.find(s=>s.id===`character:${actor}`)!;

    s.lines=[{speaker:actor,text:v.opening}];s.terms=[];s.rights=[];

    s.choices=[inspect(`ask:${n}:${actor}`,v.question),inspect(`personal:${n}:${actor}`,v.personal),...(v.offer?[action(v.offer)]:[])];

    const back=[inspect(`character:${actor}`,'There is something else I want to ask'),...(v.offer?[action(v.offer)]:[])];

    scenes.push(make(`ask:${n}:${actor}`,v.question,actor,v.answer,back),make(`personal:${n}:${actor}`,v.personal,actor,v.reply,back));

  }

  const recordText={

    crypt:'The family record names Vesper as your sire. It does not make her the owner of everything you hold. Your Library title is separate. Crypt shelter is hers to withdraw; your ancestry remains.',

    library:d.result==='mirelle'?'Mirelle’s account separates the Library invitations from the promises held outside them. Your title remains yours; your researcher’s key does not control sanctuary or court protection. The completed work has satisfied Marius’s service. His protection is a separate promise, not something that depends on keeping her key.':d.result==='dorian'?'Dorian’s work has reached Lucien. It can earn his lasting protection. It cannot make him incapable of withdrawing that protection, and taking Dorian’s key back cannot make him unread the work.':p.titleFiled?'Your independent Library claim has been put before the court. That fact cannot shelter you by itself. The researchers now want to decide whom the work will benefit.':n<3?'The Library record names you as owner. Vesper cannot take it merely because she is your sire. Put that existing claim before Seraphine if you want to negotiate sanctuary.':'The Library record still names you as owner. The early sanctuary offer has closed; filing this title now will not reopen it.',

    lounge:`Marius and Seraphine founded House Volari from independent bloodlines. He administers castle and succession; her older rights remain her own. ${permanentPassage?'Lucien now offers protection in his own name, outside the House.':'Lucien offers a route outside the House, but his temporary passage alone does not last.'}`

  };

  for(const room of ['crypt','library','lounge'] as const){const detail=roomDevelopment(r,room);scenes.push({...make(`record:${room}`,room==='crypt'?'Blood is not a deed':room==='library'?'What the record can tell you':'Two founders, separate powers','narrator',recordText[room],detail.contacts.map(a=>inspect(`character:${a}`,`Send for ${a[0].toUpperCase()+a.slice(1)}`))),location:room});}

  if(c.status!=='playing')return;

  const chapter=CHAPTERS[n],text=chapterSituation(r);

  const contacts:NpcName[]=n<3?['seraphine','marius','lucien']:root?[d.chosen!,d.chosen==='mirelle'?'dorian':'mirelle','sabine']:d.result!=='open'?[d.result==='mirelle'?'marius':'lucien','sabine']:['mirelle','dorian','sabine'];

  scenes.push(make(`discovery:${n}`,chapter.question,'narrator',text,[...contacts.map(a=>inspect(`character:${a}`,`Hear ${a[0].toUpperCase()+a.slice(1)}`)),inspect(`decision:${n}`,'I am ready to choose')]));

  // Filing is a route to sanctuary, not useful busywork after its offer closes.
  const choices=(r.actions??[]).filter(a=>a.allowed&&a.cost.majorActions>0&&!demoted.has(a.kind)&&(a.kind!=='investigate_title'||w.leases.some(l=>l.property_id==='sanctuary'&&l.status==='offered'&&w.night<l.offer_expiry_night))).map(a=>action(a.kind as GameAction));

  if(!r.pending&&!r.error&&r.availability?.end_night.length===0)choices.push(inspect(`hold:${n}`,root&&d.result==='open'?'Let the investigation finish':root?'Keep the Library open to my allies':'Keep my bargains and wait for dawn'));

  scenes.push({...make(`decision:${n}`,chapter.question,'narrator','Choose how to spend this night. Hear the terms before you commit; you can still walk away.',choices),type:'DECISION'});

  scenes.push({...make(`hold:${n}`,n===6?'Meet the final dawn':'Let the court move','narrator',root&&d.result==='open'?'You leave the investigators to their work. If they still have what they need, they may finish at this reckoning.':'You make no new commitment. The court will still act, and every promise keeps its deadline.',[{id:'pass',label:n===6?'Face the final reckoning':'Wait for dawn',action:{action:'end_night'}}],['Ends this night. No new protection is purchased. Dawn costs 1 Blood with shelter, 3 without; NPCs act and deadlines still apply.',...(c.resources.blood<=1?['Warning: waiting with this much Blood is fatal.']:[])]),type:'DECISION'});

  const opening=scenes.find(s=>s.id==='ultimatum');

  if(opening){opening.title=chapter.title;opening.lines=[{speaker:'vesper',text:voices.vesper.opening},{speaker:'narrator',text:CHAPTERS[0].text}];opening.terms=['Find shelter before the third reckoning. Survive seven nights with your Library and Seraphine’s sanctuary, or lasting patron protection. A Lounge invitation is not shelter.'];opening.choices=[inspect(`discovery:${n}`,'Find out who might help me'),inspect('character:vesper','I want an explanation')];}

  if(n>0)scenes.push({...make(`incident:${n}`,chapter.title,'narrator',text,[inspect(`discovery:${n}`,'Hear the people involved'),inspect(`decision:${n}`,'Choose my next move')]),automatic:true});

  if(finalDemand(c,w)&&!p.finalCourt!.response){
    const demand=make('final-demand','The price of remaining','marius','The work is finished. Our arrangement is not. I want to enter your Library without having to ask again. Give me that, or find another protector.',[action('final_accept','Keep his protection: give a standing invitation'),action('final_refuse','Refuse and face the loss of his protection'),...(allowed('final_counter')?[action('final_counter','Propose a limited inspection using the published account')]:[])],['One major action. Refusing, ignoring the demand, or offering an unacceptable alternative leads Marius to withdraw his own protection tonight. Independent rights remain intact.']);
    scenes.push(demand);
    for(const id of [`incident:${n}`,`decision:${n}`,'character:marius']){const target=scenes.find(s=>s.id===id);if(target){target.lines=demand.lines;target.choices.unshift(inspect('final-demand','Answer Marius’s final demand'));target.terms.unshift(...demand.terms);}}
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

  for(const l of r.world.leases.filter(l=>l.buyer===c.politics?.accounts.player&&['sanctuary','lounge'].includes(l.property_id)&&l.status==='accepted'&&l.end_night!==null&&l.end_night-l.duration_nights===night))lines.unshift({speaker:'seraphine',text:`We have a bargain. Your ${l.property_id==='sanctuary'?'sanctuary':'place in the Lounge'} ${expiryDescription(l.end_night,r.world.night)}. Neither gratitude nor argument will change that date.`});

  if(night===4&&r.world.grants.some(g=>g.property_id==='passage'&&g.grantee===c.politics?.accounts.player&&g.expiry_night===5))lines.push({speaker:'narrator',text:`The temporary passage has reached its deadline. ${r.world.access.passage?'A separate right still keeps the passage open to you.':'That route is now closed to you.'}`});

  if(!lines.length)lines.push({speaker:'narrator',text:night===6?'The final dawn arrives. No new bargain was made in the court tonight. What remains is what your choices have left standing.':'No new claim or broken promise reaches you tonight. The quiet does not stop the deadlines.'});

  return lines;


}


