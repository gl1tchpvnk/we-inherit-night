import type {Result} from './chain';
import type {EncounterScene} from './encounters';
import {expiryDescription} from './leaseNarrative.ts';

export function sanctuaryShot(panel:ReturnType<typeof sanctuaryPanel>,sceneId:string,frame:number,still:boolean){
  if(panel==='consequence')return still||frame>=2?'consequence':frame===0?'authority-cut':'authority-bond';
  if(still||panel!=='entrance')return 'decision';
  if(sceneId.startsWith('ask:'))return frame===0?'terms':'decision';
  if(sceneId.startsWith('personal:'))return 'decision';
  if(sceneId!=='character:seraphine')return 'decision';
  return (['establishing','detail','entrance','decision'] as const)[Math.min(3,Math.max(0,frame))];
}

// Exact excerpts only: the complete original line remains available for inspection.
export function cinematicExcerpt(text:string,shot:string):string{
  if(shot==='establishing'||shot==='authority-cut')return '';
  const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s=>s.trim())??[text];
  if(shot==='detail')return sentences[0];
  if(shot==='authority-bond')return sentences[1]??sentences[0];
  const last=sentences.at(-1)??text;
  return shot==='confrontation'?last.split(/\s+/).slice(-8).join(' '):last;
}

export function sanctuaryShotDuration(shot:string){
  return ({'authority-cut':350,'authority-bond':3800,establishing:650,detail:1350,entrance:2500,terms:2200} as Record<string,number>)[shot]??0;
}

// One presentation prototype. This selector never creates or authorizes an action.
export function sanctuaryPanel(scene:EncounterScene):'entrance'|'bargain'|'consequence'|null{
  if((scene.id==='character:seraphine'||/^(ask|personal):[0-2]:seraphine$/.test(scene.id))&&scene.choices.some(c=>c.inspect==='action:sanctuary_pact'))return 'entrance';
  if(scene.id==='action:sanctuary_pact')return 'bargain';
  if(/^reaction:lease:\d+:accepted$/.test(scene.id)&&scene.outcome==='Sanctuary confirmed')return 'consequence';
  return null;
}

export function sanctuaryConsequence(before:Result,after:Result):EncounterScene|null{
  const player=after.campaign?.politics?.accounts.player;
  if(!player||before.campaign?.id!==after.campaign?.id||after.pending||after.error||after.closure||!after.world.access.sanctuary)return null;
  const lease=after.world.leases.find(l=>l.property_id==='sanctuary'&&l.buyer===player&&l.owner===after.campaign?.politics?.accounts.seraphine&&l.status==='accepted'&&l.end_night!==null&&l.end_night>after.world.night);
  if(!lease||!before.world.leases.some(l=>l.id===lease.id&&l.status==='offered'))return null;
  return {
    id:`reaction:lease:${lease.id}:accepted`,type:'ENCOUNTER',location:'lounge',portraits:['seraphine'],compact:true,
    title:'A door Vesper cannot close',
    lines:[{speaker:'seraphine',text:'You paid for a refuge. You have one. You may stop thanking me whenever it becomes tiresome.'}],
    terms:[`Your accepted sanctuary ${expiryDescription(lease.end_night,after.world.night)}. Neither Vesper nor Marius can withdraw this lease. It is shelter for a fixed term, not ownership.`, ...(after.world.properties.some(p=>p.id==='library'&&p.owner===player)?['Your Library remains yours. The rest of the court will still answer for itself.']:[])],
    rights:[`Accepted sanctuary lease ${lease.id}. Exclusive expiry: contract night ${lease.end_night}.`],
    choices:[],completionLabel:'Continue to the court',outcome:'Sanctuary confirmed',
  };
}
