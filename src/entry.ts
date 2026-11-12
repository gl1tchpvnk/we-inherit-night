import type {Action,Result} from './chain';
// Provisional narration; these panels convey no authority and invent no player history.
export const PROLOGUE = [
  {title:'A borrowed shelter',actor:'vesper',text:'The Crypt keeps the daylight out. For now. Vesper is your sire, and she has begun to speak of your shelter as something she might take away.'},
  {title:'House Volari',actor:'marius',text:'Here, a promise can open a door. A debt can close it. Marius presides over the court, where every offer asks something of you in return.'},
  {title:'A power of her own',actor:'seraphine',text:'Marius and Seraphine founded House Volari together. But hers is a power of her own. If you seek shelter at her table, it will be on her terms.'},
  {title:'Three nights',actor:'vesper',text:'Vesper will close the Crypt to you at the third reckoning. Over seven nights, you must survive with a refuge of your own or a patron willing to protect you. Before its rival promises pull you apart, she has something to say.'}
] as const;
export type IntroProgress={line:number;done:boolean};
export function readIntro(raw:string|null):IntroProgress|null{
  try{const p=JSON.parse(raw??'null');return p&&Number.isInteger(p.line)&&p.line>=0&&p.line<PROLOGUE.length&&typeof p.done==='boolean'?{line:p.line,done:p.done}:null;}catch{return null;}
}
export function advanceIntro(progress:IntroProgress,skip=false):IntroProgress{
  return {...progress,line:Math.min(PROLOGUE.length-1,progress.line+1),done:skip||progress.line===PROLOGUE.length-1};
}
export type SaveStatus={exists:boolean;valid:boolean;id?:string;night?:number;error?:string};
export function requiresReplacementConfirmation(save:SaveStatus|null){return !!save?.exists;}
export async function loadEntryCampaign(fresh:boolean,save:SaveStatus,request:(action:Action)=>Promise<Result>):Promise<Result>{
  if(save.error||(!fresh&&!save.valid))throw new Error('No readable saved campaign is available. Nothing was replaced.');
  let result=await request({action:'view'});
  if(result.error||result.pending)throw new Error('Campaign recovery is not yet confirmed. Continue again to recover; no replacement was attempted.');
  if(save.exists&&result.campaign?.id!==save.id)throw new Error('The saved campaign changed. Return to the title screen before choosing again.');
  if(fresh&&save.exists){
    result=await request({action:'reset',campaign_id:result.campaign?.id,revision:result.campaign?.revision});
    if(result.error||result.pending)throw new Error('New campaign was not confirmed. Reload the title screen before trying again.');
  }
  return result;
}
