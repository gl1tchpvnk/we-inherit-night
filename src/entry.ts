import type {Action,Result} from './chain';
// User-approved prologue/backstory (2026-11-13). Narration changes no gameplay authority.
export const PROLOGUE = [
  {title:'The inheritance',actor:'vesper',text:`Vesper gave you two things.

Immortality. And a Library.

An entire wing of House Volari's ancestral castle, filled with the secrets, debts, and forgotten promises of generations.

She transferred its ownership to you without explanation. No conditions. No apparent price.

You are young enough to mistake that for generosity.

You are beginning to know better.`},
  {title:'The house',actor:'marius',text:`House Volari has endured through centuries of carefully negotiated loyalties and obligations.

Marius presides over its court, where power is inherited, granted, and occasionally taken back.

His authority is considerable. His patience, less so.

And somewhere within his castle, a newly made vampire now owns something he cannot simply command.

You.

Or rather, what Vesper has given you.`},
  {title:'The other power',actor:'seraphine',text:`Seraphine Volari has watched powerful men mistake possession for authority for longer than most remember.

She founded the House alongside Marius, bringing rights that remain hers alone.

Even he cannot revoke them.

She understands something you have yet to learn: a promise is only as valuable as the power behind it.

And Vesper's peculiar gift has made you someone worth watching.`},
  {title:'The ultimatum',actor:'vesper',text:`Then Vesper summons you.

The Crypt has sheltered you since your making. Tonight, she informs you that her hospitality has an end.

Three nights.

After the third reckoning, she will withdraw your invitation.

Your Library belongs to you. Unfortunately, its walls cannot protect you from the sun.

Seven nights to survive a court where every offer carries a price.

Seven nights to discover why Vesper gave you something she cannot take back.

And now she is waiting to see what you will do with it.`}
] as const;
export const FIRST_NIGHT_PRELUDE={title:'Before the first dawn',actor:'vesper',text:`Hunger comes before understanding. Vesper guides your first feeding. When its urgency ebbs, she brings you to the Crypt before daylight.

You survive your first day behind its stone, sheltered by her permission.

Then you awaken. Night One begins. The next decision is yours.`} as const;
export type IntroProgress={line:number;done:boolean;arrivalDone?:boolean};
export function readIntro(raw:string|null):IntroProgress|null{
  try{const p=JSON.parse(raw??'null');return p&&Number.isInteger(p.line)&&p.line>=0&&p.line<PROLOGUE.length&&typeof p.done==='boolean'?{line:p.line,done:p.done,...(typeof p.arrivalDone==='boolean'?{arrivalDone:p.arrivalDone}:{})}:null;}catch{return null;}
}
export function advanceIntro(progress:IntroProgress,skip=false):IntroProgress{
  return {...progress,line:Math.min(PROLOGUE.length-1,progress.line+1),done:skip||progress.line===PROLOGUE.length-1};
}
export type SaveStatus={exists:boolean;valid:boolean;closed?:boolean;closing?:boolean;id?:string;night?:number;error?:string;inactivityMs?:number};
export function requiresReplacementConfirmation(save:SaveStatus|null){return !!save?.exists&&!save.closed;}
export async function loadEntryCampaign(fresh:boolean,save:SaveStatus,request:(action:Action)=>Promise<Result>):Promise<Result>{
  if(save.error||(!fresh&&!save.valid))throw new Error('No readable saved campaign is available. Nothing was replaced.');
  let result=await request({action:'view'});
  if(result.error||result.pending&&(fresh||!result.closure&&(!result.campaign||result.campaign.status==='playing')))throw new Error('Campaign recovery is not yet confirmed. Continue again to recover; no replacement was attempted.');
  if(save.exists&&result.campaign?.id!==save.id)throw new Error('The saved campaign changed. Return to the title screen before choosing again.');
  if(fresh&&save.exists){
    result=await request({action:'reset',campaign_id:result.campaign?.id,revision:result.campaign?.revision});
    if(result.error||result.pending)throw new Error('New campaign was not confirmed. Reload the title screen before trying again.');
  }
  return result;
}

// Story completion is not proof that financial settlement/reclamation finished.
export function canReplayCampaign(result:Result,requireArchive:boolean):boolean{
  return !!result.campaign&&result.campaign.status!=='playing'&&!result.pending&&!result.error&&
    (!requireArchive||result.archiveComplete===true&&!!result.archiveCommitment)&&
    (!result.closure||result.closure.complete);
}

export function runtimeDescription(mode:string,hosted:boolean):string{
 return `${hosted?'NEAR Testnet':mode==='sandbox'?'Local NEAR Sandbox':mode==='testnet'?'NEAR Testnet inspection':'Local contract inspection'} · deterministic vampires · no live AI`;
}
export function initializationDescription(mode:string,hosted:boolean):string{
 return `Establishing verified ${hosted?'Testnet':mode==='sandbox'?'Sandbox':mode==='testnet'?'Testnet':'local contract'} rights… The court opens when initialization completes.`;
}
