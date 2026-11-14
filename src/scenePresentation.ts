import type {DialogueLine,EncounterScene,SceneChoice} from './encounters';

// Character scenes share one renderer; strategic and aggregate narrative surfaces do not.
export function cinematicEncounter(scene:EncounterScene):boolean {
  return !scene.redirect&&!scene.introduction&&scene.portraits.length>0&&
    (scene.type==='ENCOUNTER'||scene.type==='NEGOTIATION')&&
    !/^(decision|discovery|incident|record):/.test(scene.id);
}

// Authored paragraph boundaries, never sentence chopping or changes to source prose.
// Short lead-ins stay with the paragraph they introduce.
export function dialogueBeats(scene:EncounterScene):DialogueLine[] {
  // Preserve existing multi-speaker beat indices, including resumed legacy scenes.
  if(!cinematicEncounter(scene)||scene.lines.length!==1)return scene.lines;
  return scene.lines.flatMap(line=>{
    const paragraphs=line.text.split('\n\n'),beats:DialogueLine[]=[];
    for(let i=0;i<paragraphs.length;i++){
      let text=paragraphs[i];
      if(text.length<80&&i+1<paragraphs.length)text+='\n\n'+paragraphs[++i];
      beats.push({...line,text});
    }
    return beats;
  });
}

/** Presentation grouping only; commands and availability remain on the original choices. */
export function strategicEncounter(scene:EncounterScene):boolean {
  return scene.type==='DECISION'||scene.id==='final-demand';
}
export function nightlyChoiceKind(choice:SceneChoice):'feed'|'wait'|null {
  if(choice.inspect==='action:feed'||choice.action?.action==='game'&&choice.action.choice==='feed')return 'feed';
  if(choice.action?.action==='end_night'||choice.inspect?.startsWith('hold:'))return 'wait';
  return null;
}
