import type {Result} from './chain';
import type {EncounterScene,SceneChoice,SceneMemory,DialogueLine} from './encounters';
import {mariusProtection,finalAccepted,finalDemand} from './finalCourt.ts';

// User-supplied dialogue. Presentation and browser memory only; never game authority.
export const RELATIONSHIP_TEXT={
 M_OFFER:`Vesper has told you how long you may stay. I would rather discuss what you might do here.

There is an appointment. Work the House needs done. Take it, fulfil the obligation, and I can offer you protection.

You need not spend every conversation asking someone to tolerate your existence. You could give them a reason to want you here.`,
 M_Q1:`Your work, first. I have enough people who agree with me until something needs doing.

But yes, I would like your loyalty. I would rather have someone beside me who intends to remain.`,
 M_Q2:`She is free to make it. You are free to accept.

I will not pretend it makes no difference to me. But another refuge does not release you from the work you promise.`,
 M_Q2_ACTIVE:`Your bargain with her stands.

I will not pretend it makes no difference to me. But it does not release you from the work you would undertake here.`,
 M_CONFIRMED:`You have a place here now.

I hope you will find something in it worth staying for.`,
 S_OPEN:`Vesper has made you think about where you will sleep. Marius would like you to think about where you belong.

I suggest we settle the first question before you let either of them answer the second.`,
 S_OPEN_M:`Marius has made room for you. Good.

Now you can consider my offer without pretending you have no other choice.`,
 S_OFFER:`Pay the agreed price, and the sanctuary remains yours to use for its term. Marius cannot shorten it. Vesper cannot. Neither can I.

I would rather have company that is free to leave.`,
 S_Q1:`Your support would please me.

I helped found this House. I would like its newest arrival to see more than one person worth listening to.

But I will not include your loyalty in the rent and tell you afterward.`,
 S_Q2:`Ask him.

We founded this House together; we did not become the same person. My rights were mine before our marriage. They still are.`,
 S_CONFIRMED:`It is settled.

You may have plenty to fear tonight. Finding somewhere to sleep need not be one of those things.`,
 M_SERVICE:`You said you intended to keep your word. You have.

I would prefer to judge you by that.`,
 M_FINAL:`Then we understand one another.

You told me you wanted the freedom to stay by choice. I will take you at your word.`,
 M_WITHDRAWN:`You prepared for the possibility that we would disagree. Here we are.`,
 S_D_APPOINT:`Yes. He can make being needed sound very much like being wanted.`,
 S_D_PROMISE:`When you said you wanted to stand with me, I believed you. I would like to know how this fits.`,
 S_D_OTHER:`I had hoped you might find your place beside me. I see I should have asked what you wanted before deciding what to hope for.`,
 S_D_RESEARCH:`Then he has acknowledged what he received. Good.

His gratitude does not tell me where you stand. What do you intend to make of it?`
} as const;
export const RELATIONSHIP_REPLIES={
 'M-P1':['I want that too.','Then we have somewhere to begin.'],
 'M-P2':['I’ll keep our agreement. I haven’t promised more.','Fair enough. Begin with what you have promised.'],
 'M-P2B':['I appreciate the protection. I haven’t promised allegiance.','No. You have not. I would rather hear it plainly.'],
 'S-P1':['I would like to stand with you.','I would like that too. Preferably after you have had time to discover how irritating I can be.'],
 'S-P2':['I’m buying shelter. I’m not choosing a side.','Understood. I was stating a preference, not adding a clause.'],
 'M-D1':['I still intend to keep my word to you.',''],
 'M-D2':['I wanted somewhere I could go if we disagreed.',`You have made provision for my displeasure before we have even had the argument.

That is sensible. You need not expect me to enjoy it.`],
 'M-D3':['I want a place here without being trapped in it.',`I offered you work, not captivity.

Still—if you can leave, and you choose to stay, I will know the difference.`],
 'S-D1':['His protection does not mean I have chosen him over you.',`No. It does not.

I would rather hear what you intend than argue with what I imagined.`],
 'S-D2':['I want a place in the House, not a quarrel with either founder.',`I am one of those founders. Remember that when he speaks as though belonging here means belonging to him.

You may care for us both. You cannot always agree with us both.`],
 'S-D3':['I want to stand with him. Our bargain was for shelter.',`It was.

Your sanctuary remains exactly what you paid for. I will keep my word. You need not mistake that for approval.`]
} as const;
export type RelationshipReply=keyof typeof RELATIONSHIP_REPLIES;
export type RelationshipExchange='M-P'|'S-P'|'M-D'|'S-D';
export interface RelationshipMemory {replies?:Partial<Record<RelationshipExchange,{id:RelationshipReply;serviceOutstanding:boolean}>>;dismissed?:string[];callbacks?:string[]}
export function readRelationships(raw:unknown):RelationshipMemory{
 const v=raw as RelationshipMemory|undefined,replies:NonNullable<RelationshipMemory['replies']>={};
 for(const key of ['M-P','S-P','M-D','S-D'] as const){const value=v?.replies?.[key];if(value&&Object.hasOwn(RELATIONSHIP_REPLIES,value.id)&&value.id.startsWith(key))replies[key]={id:value.id,serviceOutstanding:value.serviceOutstanding===true};}
 const ids=(values:unknown)=>Array.isArray(values)?values.filter((s):s is string=>typeof s==='string'&&/^[MS]-[A-Z0-9-]+$/.test(s)).slice(-24):[];
 return {replies,dismissed:ids(v?.dismissed),callbacks:ids(v?.callbacks)};
}
export function relationshipState(r:Result){
 const c=r.campaign,p=c?.politics,w=r.world;
 const safe=!!p&&!r.pending&&!r.error;
 const lease=w.leases.find(l=>l.property_id==='sanctuary'&&l.buyer===p?.accounts.player&&l.owner===p?.accounts.seraphine);
 const sanctuary=safe&&lease?.status==='accepted'&&lease.end_night!==null&&w.night<lease.end_night&&w.access.sanctuary===true;
 const grant=safe&&c&&w.access.court?mariusProtection(c,w):undefined;
 const events=c?.agentHistory.filter(e=>e.actor==='marius'&&e.execution==='confirmed'&&(e.kind==='appoint'&&p?.appointment==='player'||e.kind==='archive_protect'&&p?.library?.result==='mirelle'&&c.agentHistory.some(a=>a.actor==='mirelle'&&a.kind==='archive_research'&&a.execution==='confirmed')))??[];
 const event=events.length===1?events[0]:undefined;
 const start=sanctuary&&lease?.end_night!==null&&lease?.duration_nights?lease.end_night-lease.duration_nights:undefined;
 const order=grant&&sanctuary&&event&&start!==undefined&&event.night!==start?(event.night<start?'marius':'seraphine'):null;
 return {safe,lease,sanctuary:!!sanctuary,marius:!!grant,event,order,origin:event?.kind==='appoint'?'appointment':event?.kind==='archive_protect'?'research':null,offer:safe&&lease?.status==='offered'&&w.night<lease.offer_expiry_night};
}
export function leaveRelationship(memory:SceneMemory,scene:EncounterScene):SceneMemory{
 const key=scene.exchange,rel=memory.relationships??{};
 return {...memory,relationships:{...rel,dismissed:key&&!rel.replies?.[key]?[...new Set([...(rel.dismissed??[]),key])]:rel.dismissed,callbacks:scene.callback?[...new Set([...(rel.callbacks??[]),scene.callback])]:rel.callbacks}};
}
export function chooseRelationship(memory:SceneMemory,scene:EncounterScene,choice:SceneChoice,r:Result):SceneMemory{
 const key=scene.exchange,id=choice.reply;
 if(!key||!id||!scene.choices.some(c=>c.id===choice.id&&c.reply===id)||memory.relationships?.replies?.[key])return memory;
 return {...memory,active:`personal:relationship:${key}:answer`,line:0,trail:[`character:${key.startsWith('M')?'marius':'seraphine'}`],relationships:{...memory.relationships,replies:{...memory.relationships?.replies,[key]:{id,serviceOutstanding:r.campaign?.politics?.serviceFulfilled===false}}}};
}
const question=(id:string,label:string):SceneChoice=>({id,inspect:`ask:relationship:${id}`,label});
export function applyRelationshipDialogue(r:Result,scenes:EncounterScene[],memory:RelationshipMemory={}){
 const c=r.campaign,p=c?.politics;if(!c||!p?.library)return;
 const state=relationshipState(r),get=(id:string)=>scenes.find(s=>s.id===id),T=RELATIONSHIP_TEXT;
 const reply=(key:RelationshipExchange)=>memory.replies?.[key]?.id;
 const back=(actor:string):SceneChoice=>({id:'relationship-back',label:'Back to conversation',inspect:`character:${actor}`});
 function scene(id:string,actor:'marius'|'seraphine',title:string,lines:DialogueLine[],choices:SceneChoice[]):EncounterScene{
  const s:EncounterScene={id,type:'NEGOTIATION',location:'lounge',portraits:[actor],title,lines,choices,terms:[],rights:[],compact:true};scenes.push(s);return s;
 }
 function ask(id:string,actor:'marius'|'seraphine',label:string,text:string){scene(`ask:relationship:${id}`,actor,label,[{speaker:actor,text}],[back(actor)]);return question(id,label);}
 const mq1=ask('M-Q1','marius','Do you want my work, or my loyalty?',T.M_Q1);
 const sq1=ask('S-Q1','seraphine','What do you want from me besides the money?',T.S_Q1);
 const sq2=ask('S-Q2','seraphine','And Marius is content with that?',T.S_Q2);
 const mq2=state.sanctuary?ask('M-Q2','marius','And my sanctuary with Seraphine?',T.M_Q2_ACTIVE):state.offer?ask('M-Q2','marius','And if I also take Seraphine’s offer?',T.M_Q2):null;
 for(const [actor,kind,text,questions] of [
  ['marius','petition_marius',T.M_OFFER,[mq1,...(mq2?[mq2]:[])]],
  ['seraphine','sanctuary_pact',`${state.marius?T.S_OPEN_M:T.S_OPEN}\n\n${T.S_OFFER}`,[sq1,sq2]]
 ] as const){
  const offer=get(`action:${kind}`),character=get(`character:${actor}`);
  const available=actor==='marius'?!!r.actions?.find(a=>a.kind===kind&&a.allowed):state.offer;
  if(!state.safe||!available||!character||character.redirect)continue;
  const extras=character.choices.filter(ch=>!ch.inspect?.startsWith(`personal:${c.night}:${actor}`)&&ch.inspect!==`action:${kind}`);
  if(actor==='seraphine')extras.splice(0,extras.length,...extras.filter(ch=>!ch.inspect?.startsWith(`ask:${c.night}:seraphine`)));
  const commit=offer?.choices.filter(ch=>ch.action?.action==='game'&&ch.action.choice===kind)??[];
  character.type='NEGOTIATION';character.lines=[{speaker:actor,text}];character.terms=offer?.terms??character.terms;character.rights=offer?.rights??character.rights;character.choices=[...questions,...extras,...commit];
  if(offer&&!offer.redirect){offer.lines=[{speaker:actor,text}];offer.choices=[...questions,...offer.choices];}
 }
 // The old equivalent marriage question remains a stable redirect across entry points.
 const oldS=get(`personal:${c.night}:seraphine`);if(oldS){oldS.redirect='ask:relationship:S-Q2';oldS.choices=[];}
 function exchange(key:RelationshipExchange,actor:'marius'|'seraphine',lines:DialogueLine[],ids:RelationshipReply[],eligible:boolean){
  if(!eligible)return null;
  const selected=reply(key),target=`personal:relationship:${key}`,s=scene(target,actor,actor==='marius'?'Marius Volari':'Seraphine Volari',lines,[]);s.exchange=key;
  const answer=selected?RELATIONSHIP_REPLIES[selected][1]:null;
  if(selected){
   let text:string=answer!;
   if(selected==='M-D1')text=`${memory.replies?.[key]?.serviceOutstanding?'Then do the work. I would prefer to judge you by what you do.':'You have kept it. I have not forgotten.'}\n\nBut I had hoped this arrangement was becoming more to you than a necessity.`;
   if(selected==='M-D3'&&state.origin==='research')text=text.replace('I offered you work, not captivity.','I offered you protection, not captivity.');
   scene(`${target}:answer`,actor,s.title,[{speaker:actor,text}],[back(actor)]);
   s.redirect=`${target}:answer`;
  }else s.choices=[...ids.map(id=>({id,label:RELATIONSHIP_REPLIES[id][0],reply:id})),{id:'unanswered',label:'Leave this unanswered',inspect:`character:${actor}`}];
  const character=get(`character:${actor}`);if(character&&!character.redirect)character.choices.push({id:`review:${key}`,label:key.endsWith('-D')?'Review both arrangements':actor==='marius'?'Review protection conversation':'Review sanctuary conversation',inspect:target,reviewOnly:!!selected||memory.dismissed?.includes(key)});
  return s;
 }
 const mp=exchange('M-P','marius',[{speaker:'marius',text:T.M_CONFIRMED}],['M-P1',p.appointment==='player'?'M-P2':'M-P2B'],state.marius);
 const sp=exchange('S-P','seraphine',[{speaker:'seraphine',text:T.S_CONFIRMED}],['S-P1','S-P2'],state.sanctuary);
 // Replace existing verified result slots, not a new mandatory scene.
 for(const s of scenes){
  const ack=state.event&&s.id===`reaction:npc:${state.event.night}:marius:${state.event.kind}`?mp:state.lease&&s.id===`reaction:lease:${state.lease.id}:accepted`?sp:null;
  if(ack){s.type='NEGOTIATION';s.lines=ack.lines;s.exchange=ack.exchange;if(!reply(ack.exchange!))s.choices=[...ack.choices.filter(ch=>ch.reply),{id:'unanswered',label:'Leave this unanswered',inspect:`character:${ack.exchange==='M-P'?'marius':'seraphine'}`}];}
 }
 const md=exchange('M-D','marius',[{speaker:'player',text:'I have accepted Seraphine’s sanctuary.'},{speaker:'marius',text:'So my protection was not enough.'}],[...(p.appointment==='player'?['M-D1' as const]:[]),'M-D2','M-D3'],state.order==='marius');
 const sd=exchange('S-D','seraphine',state.origin==='appointment'?[{speaker:'player',text:'I took Marius’s appointment. His protection is confirmed.'},{speaker:'seraphine',text:`${T.S_D_APPOINT}\n\n${reply('S-P')==='S-P1'?T.S_D_PROMISE:T.S_D_OTHER}`}]:[{speaker:'player',text:'Marius has granted me protection for Mirelle’s work.'},{speaker:'seraphine',text:T.S_D_RESEARCH}],['S-D1','S-D2','S-D3'],state.order==='seraphine');
 for(const s of [md,sd])if(s&&!(finalDemand(c,r.world)&&!p.finalCourt?.response)&&!reply(s.exchange!)&&!memory.dismissed?.includes(s.exchange!)){
  const char=get(`character:${s.exchange==='M-D'?'marius':'seraphine'}`);if(char&&!char.redirect){char.type='NEGOTIATION';char.lines=s.lines;char.exchange=s.exchange;char.choices=s.choices;}
 }
 function greeting(actor:'marius'|'seraphine',id:string,text:string){const s=get(`character:${actor}`);if(s&&!s.redirect&&!s.exchange&&s.choices.length&&!memory.callbacks?.includes(id)){s.lines=[{speaker:actor,text}];s.callback=id;}}
 if(state.marius&&p.serviceFulfilled&&reply('M-D')==='M-D1'&&memory.replies?.['M-D']?.serviceOutstanding)greeting('marius','M-SERVICE',T.M_SERVICE);
 if(state.sanctuary){const d=reply('S-D'),q=reply('S-P');
  if(d==='S-D3')greeting('seraphine','S-D3','Our agreement stands. What would you like to discuss?');
  else if(d==='S-D2')greeting('seraphine','S-D2','How goes your attempt to keep both founders agreeable? No, do not reassure me. I would rather hear the truth.');
  else if(d==='S-D1')greeting('seraphine','S-D1','I heard what you said about Marius. I will not ask you to explain it again. What would you like to discuss?');
  else if(q==='S-P1')greeting('seraphine','S-P1','You need not arrive with another declaration. I heard you the first time. Tell me what has happened.');
 }
 const final=finalRelationshipResponse(r,memory);
 if(final)for(const s of scenes.filter(s=>/^reaction:npc:\d+:marius:final_answer$/.test(s.id))){
  s.type='NEGOTIATION';s.lines=[{speaker:'marius',text:final.text},...(final.factual?[{speaker:'narrator' as const,text:final.factual}]:[])];
 }
 // Replace matching acknowledgement lines in the existing reckoning/history as well.
 for(const s of scenes.filter(s=>s.type==='RECKONING')){
  const night=Number(s.id.split(':')[1]);
  s.lines=s.lines.map(line=>state.marius&&state.event?.night===night&&line.speaker==='marius'&&/^(You have my protection|Mirelle’s work is enough)/.test(line.text)?{...line,text:T.M_CONFIRMED}:state.sanctuary&&state.lease!.end_night!-state.lease!.duration_nights===night&&line.speaker==='seraphine'&&line.text.startsWith('We have a bargain. Your sanctuary')?{...line,text:T.S_CONFIRMED}:line);
 }

}
export function relationshipFinale(r:Result,memory:RelationshipMemory):string|null{
 const s=relationshipState(r);if(!s.sanctuary)return null;
 const d=memory.replies?.['S-D']?.id,p=memory.replies?.['S-P']?.id;
 if(d==='S-D3')return 'You chose to stand with him. I said our bargain would hold. It has.';
 if(d==='S-D2'&&s.marius)return 'You wanted room for both of us. For tonight, you have found it.';
 if(p==='S-P1'&&d!=='S-D2')return 'You said you wanted to stand with me. I hope there is still something in that beyond gratitude for a roof.';
 return null;
}

export function finalRelationshipResponse(r:Result,memory:RelationshipMemory):{text:string;factual?:string}|null{
 const c=r.campaign,p=c?.politics,state=relationshipState(r),reply=memory.replies?.['M-D']?.id;
 if(!c||!p||!state.safe||!c.agentHistory.some(e=>e.actor==='marius'&&e.kind==='final_answer'&&['confirmed','local'].includes(e.execution??'')))return null;
 if(reply==='M-D3'&&p.finalCourt?.response==='accept'&&p.finalCourt.result==='accepted'&&state.marius&&finalAccepted(c,r.world))return {text:RELATIONSHIP_TEXT.M_FINAL};
 if(reply==='M-D2'&&p.finalCourt?.result==='rejected'&&['refuse','counter'].includes(p.finalCourt.response??'')&&!state.marius&&r.world.grants.some(g=>g.property_id==='court'&&g.grantor===p.accounts.marius&&g.grantee===p.accounts.player&&g.revoked))return {text:RELATIONSHIP_TEXT.M_WITHDRAWN,...(state.sanctuary?{factual:'Marius’s protection has ended. Your paid sanctuary remains effective for its agreed term.'}:c.status==='defeat'?{factual:c.reason}:{})};
 return null;
}
