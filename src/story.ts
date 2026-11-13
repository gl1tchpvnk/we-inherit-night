import {livingCourt} from './livingCourt.ts';
import type {Result} from './chain';
import type {NpcName} from './game';
import type {EncounterScene,SceneChoice} from './encounters';
import {AGENTS} from './agents.ts';

// Provisional dialogue and UI projections. These functions cannot authorize or execute actions.
export function protectionSummary(r:Result):string[]{
  const c=r.campaign!,w=r.world;
  return [
    `Blood ${c.resources.blood}/12. Blood reaching zero ends the campaign even with valid rights. Feeding is a major action.`,
    `Effective protection: ${['crypt','sanctuary','court','passage'].filter(id=>w.access[id]).join(', ')||'none'}. After the third reckoning, at least one must remain. Vesper withdraws only her Crypt grant.`,
    `Ordinary access: Library ${w.access.library?'open':'closed'}; Lounge ${w.access.lounge?'open':'closed'}. Neither counts as shelter. Library ownership remains independent; Lounge tenancy is not sanctuary.`,
    'Night 7: Unbound requires your Library ownership and effective sanctuary lease extending beyond that reckoning. Favoured requires effective court protection. Both require enough Blood to survive.',
    ...(c.politics?.appointment==='player'?[c.politics.serviceFulfilled?'Marius’s service is fulfilled. His grant remains patron-dependent and revocable.':'Marius’s service is due during Nights 4–5. Leaving it unfulfilled lets him revoke his grant at the sixth reckoning.']:[])
  ];
}

const impacts:Record<string,string>={
  investigate_title:'Gain: file your independent Library title, qualifying for sanctuary. Mirelle helps establish the record. No protection is granted yet: accept sanctuary separately before Night 4.',
  secure_dossier:'Gain: claim the finite dossier before Dorian; it qualifies you for sanctuary but grants no protection. This closes Dorian’s competing claim. The sanctuary deadline still applies.',
  sanctuary_pact:'Gain: fixed-term protection independent of Vesper and Marius, supporting Unbound alongside your Library title. Seraphine receives rent; the lease grants no ownership. Marius’s existing obligation, if any, is not cancelled.',
  petition_marius:'Gain: claim the finite appointment; Marius can issue court protection at reckoning. This supports Favoured, not Unbound. Marius benefits from your service; Cassian loses this appointment. It does not block Seraphine, but spends one of the three nights before her deadline.',
  fulfil_service:'Gain: meet Marius’s obligation and retain his patron-dependent route. Marius receives the service. This grants no independent title or sanctuary.',
  broker_passage:'Gain: Lucien’s temporary protection after his verified grant. It expires at the start of Night 6 and cannot win an ending. Use the time to secure another source; this is not permanent escape.',
  feed:'Recover 4 Blood, capped at 12. You benefit; no vampire gains authority. Feeding preserves physical survival but grants no political protection.',
  rest:'Recover 2 Blood, subject to resource bounds and Crypt access. You benefit; no authority changes. Resting cannot preserve Vesper’s revoked grant.',

};
export function commitmentImpact(kind:string,r?:Result):string[]{
  let benefit=impacts[kind]??'Information does not grant rights or protection.';
  if(r?.campaign&&['investigate_title','secure_dossier'].includes(kind)&&r.campaign.night>=2)benefit='Too late for the sanctuary route: this record grants no protection. Committing now cannot leave another major action before sanctuary closes after Night 3. '+benefit;
  return [benefit,...(kind in impacts?['Opportunity cost: this commitment spends tonight’s major action and advances the court. Other deadlines and finite claims continue; free conversation alone closes nothing.']:[])];
}

const voices:Record<NpcName,{question:string;answer:string;relationship:string;respect:string;challenge:string}>={
  vesper:{question:'What can you actually take from me?',answer:'My Crypt permission. Not your Library title, and not an unrelated grant. Do not confuse my displeasure with unlimited power.',relationship:'I am your sire. The grant, not that ancestry, gives the Crypt arrangement its enforceable shape.',respect:'Then use the time I gave you. Courtesy does not extend the deadline.',challenge:'Question me if you wish. The deadline and the limits of my grant remain the same.'},
  seraphine:{question:'Is a place in the Lounge enough to protect me?',answer:'No. The Lounge is entry to a room. Sanctuary is a separate covenant. File your title or secure the dossier, then accept its recorded terms before Night Four.',relationship:'Marius and I joined independent bloodlines to found House Volari. Our marriage does not put my rights beneath his.',respect:'Careful questions are welcome. Read the expiry as closely as the promise.',challenge:'You need not trust a promise. Inspect the authority and decide from the terms.'},
  marius:{question:'What does your protection require?',answer:'Claim the appointment before it closes. My grant must be confirmed; then fulfil the service during Nights Four or Five. Unfulfilled service puts that protection at risk.',relationship:'My authority here is institutional. Seraphine’s independent authority is not mine to withdraw.',respect:'Then consider the obligation before accepting the appointment.',challenge:'You may question the terms freely. An appointment still requires the same service.'},
  lucien:{question:'Can your passage carry me through the final night?',answer:'No. It ends at the start of Night Six. It buys time, not a permanent position.',relationship:'I am outside House Volari. My passage depends on my own recorded authority, not its marriage or bloodline.',respect:'A useful arrangement begins with an honest deadline.',challenge:'Doubt the promise if you like. The expiry is there to inspect.'},
  mirelle:{question:'What does investigating my title accomplish?',answer:'Reading is free. Publicly filing the title is a major political act: it opens sanctuary negotiations, but the filing itself grants no shelter.',relationship:'My Library work depends on a real delegated permission. Information and ownership are different things.',respect:'Then distinguish the record from the right it describes.',challenge:'Check the record yourself. A sharp question changes no grant.'},
  cassian:{question:'Are we competing for the same appointment?',answer:'Yes, while it remains open. Claiming it closes that opportunity to the other claimant; an existing grant cannot be wished away.',relationship:'My court position depends on legitimate patronage, not on an invented blood relationship.',respect:'Politeness does not reserve the appointment. Decide before someone else does.',challenge:'You may challenge my ambition. Only a valid claim changes the opportunity.'},
  dorian:{question:'Why should I pursue the dossier now?',answer:'Once the public lead exists, the dossier is finite. It can qualify its claimant for sanctuary; it cannot itself provide protection.',relationship:'I pursue an available opportunity. That gives me no power to revoke your unrelated rights.',respect:'Then you understand why an open opportunity will not stay open forever.',challenge:'Argue if you wish. Neither of us owns a claim merely by speaking.'},
  sabine:{question:'How do I know whose protection I depend on?',answer:'Inspect the grant and its parents. A revoked parent breaks dependent rights. Independently sourced rights survive unrelated revocation.',relationship:'My court delegation depends on Marius’s root grant. Sponsorship cannot exceed that permission.',respect:'Good. Read the whole chain before making a commitment.',challenge:'Scepticism is useful. It is not a substitute for checking the issuer.'}
};

export function addDirectedStory(r:Result,scenes:EncounterScene[]):void{
  const c=r.campaign!;if(!c.politics)return;
  if(c.politics.library){livingCourt(r,scenes);return;}
  if(c.status!=='playing'){
    scenes.find(s=>s.type==='CAMPAIGN CONCLUSION')?.terms.push(...protectionSummary(r));
    return;
  }
  const n=c.night,discovery=`discovery:${n}`,decision=`decision:${n}`;
  const scene=(id:string,title:string,lines:EncounterScene['lines'],choices:SceneChoice[],terms:string[]=[],portraits:NpcName[]=[]):EncounterScene=>({id,type:'ENCOUNTER',title,location:'lounge',portraits,lines,terms,rights:[],choices});
  const inspect=(id:string,label:string):SceneChoice=>({id,label,inspect:id});
  const actors=Object.keys(c.npcs) as NpcName[];
  for(const actor of actors){
    const parent=scenes.find(s=>s.id===`character:${actor}`)!;const v=voices[actor];
    const branches=[['question',v.question,v.answer],['relationship','Ask about relationships and authority',v.relationship],['respect','“I want to understand the terms.”',v.respect],['challenge','“Why should I trust this arrangement?”',v.challenge]];
    parent.choices.unshift(...branches.map(([key,label])=>inspect(`talk:${n}:${actor}:${key}`,`${label} · free`)));
    parent.choices.push(inspect(discovery,'Return to Discovery'),inspect(decision,'Make your decision'));
    for(const [key,label,answer] of branches)scenes.push(scene(`talk:${n}:${actor}:${key}`,label,[{speaker:actor,text:answer},{speaker:'narrator',text:'This conversation is free. Your tone changes no relationship, right, resource or deadline.'}],[inspect(`character:${actor}`,'Ask another question'),inspect(discovery,'Return to Discovery'),inspect(decision,'Make your decision')],actor==='seraphine'&&n>=3?['The sanctuary acceptance deadline has passed. Existing accepted rights keep their recorded expiry; conversation cannot reopen the offer.']:[],[actor]));
  }
  for(const s of scenes.filter(s=>s.id.startsWith('action:'))){
    s.terms.push(...commitmentImpact(s.id.slice(7),r));
    s.choices.push(inspect(decision,'Compare decisions before committing'));
  }
  const contacts=actors.map(actor=>inspect(`character:${actor}`,`Speak with ${AGENTS[actor].name} · free`));
  scenes.push(scene(discovery,`Discovery · Night ${n+1}`,[{speaker:'narrator',text:'Hear the court before you choose. All contacts are available remotely; entering their rooms is not required. You may skip any conversation.'}],contacts.concat(inspect(decision,'Make your decision')),protectionSummary(r)));
  const available=(r.actions??[]).filter(a=>a.allowed&&a.cost.majorActions>0);
  const commitments:SceneChoice[]=available.map(a=>({...inspect(`action:${a.kind}`,`${a.label} · inspect consequences`),summary:[`Cost: ${a.cost.majorActions} major action; ${a.cost.blood} Blood.${a.kind==='sanctuary_pact'?' Plus 0.02 Sandbox NEAR rent and gas.':''}`,...commitmentImpact(a.kind,r).filter(t=>!t.startsWith('Opportunity cost:'))]}));
  if(scenes.find(s=>s.id==='lease:0')?.choices.some(ch=>ch.id==='accept'))commitments.push(inspect('lease:0','Lounge tenancy · ordinary entry, NOT protection'));
  if(c.status==='playing'&&!r.pending&&!r.error&&r.availability?.end_night.length===0)commitments.push({id:'pass',label:'Pass this night · no new protection; deadlines and Blood upkeep still resolve',action:{action:'end_night'}});
  scenes.push({...scene(decision,`Make your decision · Night ${n+1}`,[{speaker:'narrator',text:'Choose one commitment after inspecting its terms. Nothing is spent until you explicitly commit. Every commitment advances the court and its deadlines; you may return to Discovery first.'}],commitments.concat(inspect(discovery,'Return to Discovery · free')),protectionSummary(r)),type:'DECISION'});
  const opening=scenes.find(s=>s.id==='ultimatum');
  if(opening){opening.choices.push(inspect(discovery,'Hear all available voices · Discovery'));opening.terms.push('You have three major actions before the ultimatum. A Lounge lease is ordinary room entry, not sanctuary. Ask freely before choosing.');}
  if(c.status==='playing'&&n>0){
    let actor:NpcName='seraphine',text='The court has moved. Review your protection and choose what you will preserve tonight.';
    if(c.resources.blood<=3){actor='sabine';text='Your Blood is running low. Rights cannot sustain an exhausted body. Consider feeding before another costly commitment.';}
    else if(r.world.access.court&&!c.politics.serviceFulfilled&&n>=3){actor='marius';text='My protection carries an unfinished obligation. Fulfil it during Nights Four or Five; the appointment alone is not the end of your bargain.';}
    else if(n<3&&!r.world.access.sanctuary&&!r.world.access.court){actor='vesper';text=`${3-n} night${3-n===1?'':'s'} remain before my Crypt grant is withdrawn. Seraphine’s sanctuary and Marius’s appointment offer different dependencies. Ask them now.`;}
    else if(n<3){text='Your existing arrangement does not silence the other patrons. You can still discuss alternatives, but sanctuary closes after Night Three.';}
    else if(r.world.access.passage&&!r.world.access.sanctuary&&!r.world.access.court){actor='lucien';text='My passage still protects you, but it expires at the start of Night Six. Inspect whether a lasting route remains; temporary access cannot satisfy the final reckoning.';}
    else if(n>=5){actor=r.world.access.sanctuary?'seraphine':'marius';text='The final reckoning draws near. Preserve your qualifying protection and enough Blood to survive it. Ordinary room access is not an ending.';}
    scenes.push({...scene(`incident:${n}`,`The court approaches · Night ${n+1}`,[{speaker:actor,text}], [inspect(discovery,'Hear the court · Discovery'),inspect(decision,'Review tonight’s decisions')],protectionSummary(r),[actor]),automatic:true});
  }
}
