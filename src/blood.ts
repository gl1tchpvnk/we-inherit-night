import type {Action,Result} from './chain';
import {finalDemand} from './finalCourt.ts';
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

// Compare only the clock against existing rules, never forecast NPC decisions or rights.
export function encounterFeedText(result:Result):string{
  const c=result.campaign;
  if(result.pending)return 'Waiting for the current commitment to resolve.';
  if(!c||c.status!=='playing'||result.closure)return 'This campaign is no longer taking actions.';
  if(result.error)return 'Refresh the current state before feeding.';
  if(c.actionsLeft<1)return 'No nightly action remains.';
  if(!encounterFeed(result))return 'Feeding is currently unavailable.';
  if(c.actionsLeft>1)return 'Restores up to 4 Blood (maximum 12). One action; you can return to this conversation before dawn.';
  if(!c.politics)return 'Restores up to 4 Blood (maximum 12). Uses your last action; you choose when to end the night.';
  if(c.night===6)return 'Restores up to 4 Blood (maximum 12), then begins the final reckoning. No nightly action will remain for another commitment.'+(finalDemand(c,result.world)&&!c.politics.finalCourt?.response?' Leaving Marius unanswered also costs his protection at this reckoning.':'');
  const tomorrow={...c,night:c.night+1},world={...result.world,night:result.world.night+1};
  const closing=(result.actions??[]).filter(a=>a.allowed&&a.kind!=='feed'&&!actionAvailability(tomorrow,a.kind,world).allowed).map(a=>a.label);
  const player=c.politics.accounts.player;
  for(const lease of result.world.leases){
    if(lease.status==='offered'&&lease.buyer===player&&lease.offer_expiry_night>result.world.night&&lease.offer_expiry_night<=world.night){
      const action=result.actions?.find(a=>a.kind==='sanctuary_pact');
      if(lease.property_id!=='sanctuary'||!action||!closing.includes(action.label))closing.push(`${lease.property_id} lease offer`);
    }
  }
  return `Restores up to 4 Blood (maximum 12). Uses your last action and advances the night; dawn upkeep follows. ${closing.length?`Closes at dawn: ${closing.join('; ')}.`:'You can return to opportunities that remain available after the court acts.'}`;
}
