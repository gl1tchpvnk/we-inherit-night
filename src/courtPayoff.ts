import {relationshipFinale,finalRelationshipResponse,type RelationshipMemory} from './relationshipDialogue.ts';
import type {Result} from './chain';
import type {NpcName} from './game';
import {effectiveGrant} from './library.ts';

// PROVISIONAL authored interpretations of current obligations, not historical discoveries.
export const INVESTIGATION_QUESTION='Must useful service to a patron cost you control of the Library? We will separate the work you deliver from the invitations used to produce it.';

export function completedInvestigator(r:Result):'mirelle'|'dorian'|null{
  const winner=r.campaign?.politics?.library?.result;
  if(r.pending||r.error||!winner||winner==='open')return null;
  return r.campaign!.agentHistory.some(e=>e.actor===winner&&e.kind==='archive_research'&&['confirmed','local'].includes(e.execution??''))?winner:null;
}

export function investigationFinding(actor:'mirelle'|'dorian'):string{
  return actor==='mirelle'
    ?'The account is complete: delivering the Library work satisfies Marius’s service without giving him your Library. Cassian helped under my invitation; neither of us has to keep a key for that completed work to count. I delivered it to Marius. I wanted him to recognise something you had done, not merely someone he could shelter.'
    :'The account is complete: the Library is yours to put to use outside Marius’s House. Lucien helped under my invitation; that invitation gives him no ownership. I delivered the work to him. He now has a reason to offer protection in his own name. I wanted you to have someone else to turn to.';
}

export interface PersonalFinale {
  actor:NpcName;title:string;opening:string;account:string[];
  responses:{id:string;label:string;reply:string}[];
}

export function personalFinale(r:Result,relationships:RelationshipMemory={}):PersonalFinale|null{
  const c=r.campaign,p=c?.politics,w=r.world;
  if(!c||c.status==='playing'||!p?.library||r.pending||r.error||['quit','abandoned'].includes(r.closure?.reason??''))return null;
  const completed=completedInvestigator(r);
  const protectedBy=(actor:'marius'|'lucien')=>w.grants.some(g=>g.property_id===(actor==='marius'?'court':'passage')&&g.grantor===p.accounts[actor]&&g.grantee===p.accounts.player&&!g.revoked&&effectiveGrant(w,g));
  const paid=w.leases.find(l=>l.property_id==='sanctuary'&&l.owner===p.accounts.seraphine&&l.buyer===p.accounts.player&&l.status==='accepted');
  const survived=c.ending==='unbound'||c.ending==='favoured';
  const actor:NpcName=survived&&c.ending==='unbound'&&paid?'seraphine':survived&&c.reason.includes('Lucien')&&protectedBy('lucien')?'lucien':survived&&protectedBy('marius')?'marius':completed??'vesper';
  const account:string[]=[];
  if(completed){
    const name=completed==='mirelle'?'Mirelle':'Dorian',assistant=completed==='mirelle'?'cassian':'lucien';
    account.push(`${name} completed the account for ${completed==='mirelle'?'Marius':'Lucien'}. Publication settled whom the work served; the ending does not redirect it.`);
    const roots=w.grants.filter(g=>g.property_id==='library'&&g.grantor===p.accounts.player&&g.grantee===p.accounts[completed]&&g.can_delegate);
    const root=roots.at(-1);
    if(root&&effectiveGrant(w,root)&&!root.revoked)account.push(`You kept ${name}’s invitation open after the work. That was continued access, not a surrender of your title.`);
    else if(root?.revoked){
      account.push(`You took back ${name}’s key. The published work remains.`);
      const child=w.grants.find(g=>g.parent_grant_id===root.id&&g.grantee===p.accounts[assistant]);
      if(child&&!effectiveGrant(w,child))account.push(`${assistant==='cassian'?'Cassian':'Lucien'}’s invitation through that key no longer opens the Library.`);
    }
  }else account.push('No completed investigation is confirmed. This farewell credits no patron reward for unfinished work.');
  for(const patron of ['marius','lucien'] as const)if(protectedBy(patron))account.push(`${patron==='marius'?'Marius':'Lucien'}’s separate protection remains effective in the recorded outcome. It does not depend on an investigator keeping your key.`);
  if(paid)account.push(paid.end_night!==null&&paid.end_night>w.night?'Your paid sanctuary still has time remaining. Neither this reply nor another patron’s displeasure cancels its accepted term.':'Your paid sanctuary agreement is recorded; this farewell does not extend its term.');
  const finalReply=finalRelationshipResponse(r,relationships);
  if(p.finalCourt?.result)account.push(finalReply&&actor!=='marius'?`Marius:\n${finalReply.text}${finalReply.factual?`\n\n${finalReply.factual}`:''}`:p.finalCourt.result==='accepted'?'Marius’s final answer is already recorded. This conversation does not renegotiate it.':'Marius’s final refusal is recorded. It did not cancel an independent sanctuary agreement.');
  const opening=!survived
    ?actor==='vesper'?'You were my descendant before this chronicle began. That is still part of its record, even where the account of your survival ends.': 'The work reached its patron. You did not survive. I will not call those the same kind of success.'
    :actor==='seraphine'?'You paid for shelter, not my approval. Whatever use you made of your Library, you did not have to become mine to keep our bargain.'
    :actor==='lucien'?'You made room for an answer from outside the House. My protection stands. Tell me whether you consider that a beginning or simply another dependence.'
    :actor==='marius'?'You have a place under my protection. The question of your Library was never the same as the question of your service. How will you describe the place you have secured?'
    :'The chronicle has its outcome. You may still choose the words with which you close it.';
  const responses=!survived?[
    {id:'remember',label:'Remember what I tried to keep.',reply:'Then let the record name your choices, not reduce you to the last thing that failed.'},
    {id:'cost',label:'Do not make a lesson of me.',reply:'Then I will leave the judgment unfinished. The loss is enough to record.'}
  ]:[
    {id:'own',label:'What remains mine matters most.',reply:actor==='seraphine'?'Then keep the distinction. You bought time from me. What you do with it is yours.':actor==='lucien'?'Good. Accepting my help need not mean mistaking it for ownership of you.': 'Then distinguish what you have earned from what you have entrusted to me. Neither needs a flattering name.'},
    {id:'help',label:'I did not reach this dawn alone.',reply:actor==='seraphine'?'No. But gratitude need not become another payment. Our price was already agreed.':actor==='lucien'?(completed==='dorian'?'No. Dorian did his part, and I made my choice. You can acknowledge both without promising me everything.':'No. I made my promise. Acknowledging it need not mean promising me everything in return.'):'No. A place in the House is made of obligations kept by more than one person. Your part belongs in that account.'}
  ];
  return {actor,title:survived?'Before you close the chronicle':'Words at the close',opening:actor==='seraphine'?(relationshipFinale(r,relationships)??opening):actor==='marius'?(finalReply?.text??opening):opening,account,responses};
}

export function readFinaleMemory(raw:string|null):{response:string|null;done:boolean}{
  try{const v=JSON.parse(raw??'null');return {response:typeof v?.response==='string'&&['own','help','remember','cost'].includes(v.response)?v.response:null,done:v?.done===true};}catch{return {response:null,done:false};}
}
