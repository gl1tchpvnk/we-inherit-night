import type {Action,Result} from './chain';
import {actionAvailability,dawn,playerAction,spendAction} from './game.ts';

// Presentation only: use the engine on copies; never predict NPC rights or commit state.
export function bloodWarning(result:Result,action:Action):string|null{
  const c=result.campaign;
  if(!c||c.status!=='playing'||result.pending||result.error)return null;
  let after=structuredClone(c);
  try{
    if(action.action==='game'&&action.choice)after=playerAction(c,action.choice,result.world);
    else if(action.action==='agreement_accept'||action.action==='accept'||action.action==='reject'&&!c.politics?.library)spendAction(after);
    else if(action.action!=='end_night')return null;
  }catch{return null;} // Unavailable actions retain their existing validation message.
  if(after.resources.blood===0)return 'Fatal: this choice spends your last Blood. You will die before dawn. Feed before making this commitment.';
  const endsNight=action.action==='end_night'||!!c.politics&&after.actionsLeft<c.actionsLeft&&after.actionsLeft===0;
  if(!endsNight)return null;
  const atDawn=(shelter:boolean)=>dawn(after,{...result.world,access:{...result.world.access,crypt:shelter,court:false,sanctuary:false,passage:false}}).resources.blood;
  if(atDawn(true)===0)return `Fatal: this leaves ${after.resources.blood} Blood before dawn. Even sheltered upkeep takes 1 Blood, leaving 0. Zero Blood is fatal. This choice ends the night; feed instead if you want to survive.`;
  if(atDawn(false)===0)return `Danger: this leaves ${after.resources.blood} Blood before dawn. Without shelter, the 3 Blood upkeep will kill you. Protection may change when the court acts; consider feeding.`;
  return null;
}
export function hungerText(blood:number):string{
  return blood<=1?'Your strength is failing. Feed before dawn.':blood<=3?'Hunger is closing in. Consider feeding.':blood<=5?'Your hunger is growing.':'';
}


// The shortcut exposes the same feed command, never a separate resource mutation.
export function encounterFeed(result:Result):Action|null{
  if(!result.campaign||result.pending||result.error||result.closure)return null;
  const feed=result.actions?.find(a=>a.kind==='feed');
  return feed?.allowed&&actionAvailability(result.campaign,'feed',result.world).allowed?{action:'game',choice:'feed'}:null;
}
