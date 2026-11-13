import {chapterSituation,endingSummary,ROLEPLAY_LABELS} from './livingCourt.ts';
import type {Result} from './chain';
import type {GameAction,NpcName} from './game';
export const ROOMS=[
 {id:'crypt',name:'Ancestral Crypt',description:'Shelter held at Vesper’s pleasure.',contacts:['vesper']},
 {id:'library',name:'Forbidden Library',description:'Your independent title. A power no sire can revoke.',contacts:['mirelle','dorian','cassian']},
 {id:'lounge',name:'Crimson Lounge',description:'The court’s invitations, connections and dangerous bargains.',contacts:['seraphine','marius','lucien','sabine']}
] as const;
export type RoomId=typeof ROOMS[number]['id'];
const ACTION_ROOM:Partial<Record<GameAction,RoomId>>={authorize_mirelle:'library',authorize_dorian:'library',withdraw_library:'library',investigate_title:'library',secure_dossier:'library',investigate_bloodline:'crypt',rest:'crypt',learn_seraphine:'lounge',discuss_exchange:'lounge',investigate_expiry:'lounge',petition_marius:'lounge',fulfil_service:'lounge',sanctuary_pact:'lounge',broker_passage:'library'};
export function roomActions(result:Result,room:RoomId){return (result.actions??[]).filter(a=>(!result.campaign?.politics?.library||!['secure_dossier','learn_seraphine','discuss_exchange','investigate_expiry','investigate_bloodline'].includes(a.kind))&&(ACTION_ROOM[a.kind as GameAction]??a.permission)===room).map(a=>({...a,label:result.campaign?.politics?.library?ROLEPLAY_LABELS[a.kind as GameAction]??a.label:a.label}));}
export function resumeRoom(room:unknown,result:Result):{room:RoomId|null;reason:string}{
 if(!ROOMS.some(r=>r.id===room))return {room:null,reason:''};
 if(!result.world.access[room as string])return {room:null,reason:`${ROOMS.find(r=>r.id===room)!.name} is no longer accessible. You have returned to the castle.`};
 return {room:room as RoomId,reason:''};
}
export function roomDenial(result:Result,room:RoomId){return result.world.access[room]?null:result.availability?.rooms[room]??'No current effective permission. Inspect rights for its source and expiry.';}
export interface Lead {label:string;room?:RoomId;actor?:NpcName;scene?:string}
export function navigationGuidance(result:Result):{situation:string;leads:Lead[]}{
 const c=result.campaign;if(!c)return {situation:'Inspect contract-backed room access.',leads:[]};
 if(c.status!=='playing')return {situation:c.politics?.library?endingSummary(result):c.reason,leads:[]};
 const allowed=new Set((result.actions??[]).filter(a=>a.allowed).map(a=>a.kind));
 const leads:Lead[]=[];
 if(c.politics?.library){
   leads.push({label:'Review tonight’s situation and choices',scene:`decision:${c.night}`});
   if(c.resources.blood<=3&&allowed.has('feed'))leads.unshift({label:'Hunt before dawn',scene:'action:feed'});
   else leads.push({label:c.night<3?'Read your Library claim':'Revisit the Library dispute',room:'library'});
   return {situation:chapterSituation(result),leads};
 }

 if(allowed.has('fulfil_service'))leads.push({label:'Fulfil Marius’s obligation',scene:'action:fulfil_service'});
 if(allowed.has('sanctuary_pact'))leads.push({label:'Negotiate Seraphine’s sanctuary',actor:'seraphine'});
 if(allowed.has('investigate_title')&&result.world.access.library)leads.push({label:'Library · investigate your title',room:'library'});
 if(allowed.has('petition_marius'))leads.push({label:'Discuss Marius’s appointment',actor:'marius'});
 if(!c.politics?.library&&allowed.has('secure_dossier')&&result.world.access.library)leads.push({label:'Library · contested dossier',room:'library'});
 if(allowed.has('broker_passage')&&(!c.politics?.library||!result.world.access.sanctuary&&!result.world.access.court))leads.push({label:'Contact Lucien about passage',actor:'lucien'});
 if(!c.politics?.library&&c.agreements.some(a=>a.status==='pending'))leads.push({label:'Inspect Seraphine’s pending offer',scene:'lease:0'});
 if((c.resources.blood<=4||c.politics?.library&&c.night===2)&&allowed.has('feed'))leads.unshift({label:'Attend to your Blood',scene:'action:feed'});
 if(leads.length<2)leads.push({label:'Speak with Seraphine · free',actor:'seraphine'});
 return {situation:c.politics?.library&&c.night<3&&(result.world.access.sanctuary||result.world.access.court)?'Your shelter is secured separately from Vesper. Keep your Blood supplied; the third reckoning will test which rights remain.':c.night<3?'Vesper withdraws Crypt shelter at the third reckoning. Secure another source of protection.':`Consolidate your position before Night 7. Effective protection: ${['sanctuary','court','passage','crypt'].filter(id=>result.world.access[id]).join(', ')||'none'}.`,leads:leads.slice(0,3)};
}
