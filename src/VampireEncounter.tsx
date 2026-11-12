import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import type {Action,Result} from './chain';
import {AGENTS} from './agents';
import {Portrait,RoomArt} from './visuals';
import {buildEncounterScenes,finishScene,nextScene,readSceneMemory,type EncounterScene,type SceneChoice} from './encounters';

export function VampireEncounter({scene,lineIndex,busy,feedback,onLine,onChoice,onComplete,onSkipReckoning,seen=[]}:{
  scene:EncounterScene;lineIndex:number;busy:boolean;feedback:string;seen?:string[];
  onLine:(index:number)=>void;onChoice:(choice:SceneChoice)=>void;onComplete:()=>void;onSkipReckoning:()=>void;
}){
  const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
  const index=Math.min(lineIndex,scene.lines.length-1),spoken=scene.lines[index];
  const currentActor=spoken?.speaker!=='narrator'?spoken?.speaker:scene.portraits[0];
  const displayedPortraits=scene.type==='RECKONING'&&currentActor?[currentActor]:scene.portraits;
  const chapter=/^(reckoning|incident):/.test(scene.id)?Number(scene.id.split(':')[1])+1:null;
  const finishLabel=scene.completionLabel??(scene.reactionLevel?'Return to the court':scene.type==='RECKONING'?'Continue to next night':'Return to exploration');
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    dialog.current?.showModal();heading.current?.focus();
    return ()=>{dialog.current?.close();previous?.focus();};
  },[]);
  useEffect(()=>{heading.current?.focus();},[scene.id]);
  return <dialog ref={dialog} data-actor={currentActor} data-kind={scene.type} className={`vampire-scene scene-${scene.location}${scene.portraits.length===0?' scene-overview':''}${scene.compact?' living-encounter':''}`} aria-labelledby="encounter-title" onCancel={event=>{event.preventDefault();if(!busy)onComplete();}}>
    <div className="scene-stage" key={scene.id}>
      <div className="scene-background" aria-hidden="true"><RoomArt room={scene.location}/></div>
      <div className={`scene-portraits ${displayedPortraits.length>1?'paired':''}`}>{displayedPortraits.length?displayedPortraits.map(actor=><Portrait actor={actor} key={actor}/>):<figure className="portrait environment-portrait"><RoomArt room={scene.location}/><figcaption>PROVISIONAL GENERATED INTERIOR · APPROVAL PENDING</figcaption></figure>}</div>
      <div className="scene-script">
        {chapter!==null&&<p className="chapter-folio">Night {['I','II','III','IV','V','VI','VII'][chapter-1]??chapter} <span>{scene.type==='RECKONING'?'The reckoning':'A new chapter'}</span></p>}
        <div className="scene-topline"><span>{scene.type} · {scene.location==='crypt'?'Ancestral Crypt':scene.location==='library'?'Forbidden Library':'Crimson Lounge'}</span><button type="button" disabled={busy} onClick={onComplete} aria-label={scene.type === 'RECKONING' ? finishLabel : 'Close encounter without committing'}>{finishLabel} ×</button></div>
        {scene.reactionLevel&&<p className="eyebrow">{scene.reactionLevel==='major'?'The balance has shifted':'Word from the court'}</p>}
        <h2 id="encounter-title" tabIndex={-1} ref={heading}>{scene.title}</h2>
        <div key={`${scene.id}:${index}`} className="spoken-line" aria-live="polite" aria-atomic="true"><p className="eyebrow">{spoken?.speaker==='narrator'?'The chronicle':spoken?AGENTS[spoken.speaker].name:''}</p><blockquote>{spoken?.text}</blockquote>{!scene.compact&&<small>Line {index+1} of {scene.lines.length} · dialogue is free</small>}</div>
        {scene.terms.length>0&&<section className="scene-terms" aria-label="Material terms and consequences"><h3>{scene.compact?'What changes':scene.type==='NEGOTIATION'?'The exact terms':'What this means'}</h3><ul>{scene.terms.map((term,i)=><li key={i}>{term}</li>)}</ul></section>}
        {scene.rights.length>0&&<details className="scene-rights"><summary>Inspect terms</summary><ul>{scene.rights.map((right,i)=><li key={i}>{right}</li>)}</ul></details>}
        {scene.outcome&&<p className="scene-outcome">{scene.outcome}</p>}
        <p role="status" className="scene-feedback">{busy?'Your decision is being resolved…':feedback}</p>
        <div className="scene-choices">
          {index<scene.lines.length-1&&<button type="button" disabled={busy} onClick={()=>{onLine(index+1);heading.current?.focus();}}>Continue dialogue ▸ <small>Free</small></button>}
          {scene.choices.map(choice=><div key={choice.id} className="story-choice">{choice.summary&&<div className="choice-consequences">{choice.summary.map((text,i)=><p key={i}>{text}</p>)}</div>}<button type="button" className={choice.action?'binding-choice':''} key={choice.id} disabled={busy} onClick={()=>onChoice(choice)}>{choice.label}{choice.inspect&&seen.includes(choice.inspect)&&<small>Explored</small>}</button></div>)}
          <button type="button" disabled={busy} onClick={onComplete}>{scene.type==='NEGOTIATION'?(scene.compact?'Consider another offer':'Defer · leave without committing'):scene.type==='RECKONING'?finishLabel:'Finish / skip dialogue'}</button>
          {scene.type==='RECKONING'&&<button type="button" disabled={busy} onClick={onSkipReckoning}>Skip remaining reckoning · retained in history</button>}
        </div>
      </div>
    </div>
  </dialog>;
}

export function EncounterDirector({result,busy,request,onAction,children,room}:{result:Result;busy:boolean;children?:ReactNode;room?:string|null;request:{id:string;serial:number}|null;onAction:(action:Action)=>Promise<Result|null>}){
  const campaign=result.campaign!;
  const storageKey=`night-scenes:v1:${campaign.id}`;
  const [memory,setMemory]=useState(()=>{try{return readSceneMemory(localStorage.getItem(storageKey));}catch{return readSceneMemory(null);}});
  const [feedback,setFeedback]=useState('');
  const committing=useRef(false);
  const scenes=useMemo(()=>buildEncounterScenes(result),[result]);
  const scene=nextScene(scenes,memory);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify({...memory,...(room!==undefined?{room}:{})}));}catch{/* Presentation remains usable when storage is unavailable. */}},[storageKey,memory,room]);
  useEffect(()=>{if(request){setMemory(m=>({...m,active:request.id,line:0}));setFeedback('');}},[request]);
  function complete(){if(scene&&!committing.current){setMemory(m=>finishScene(m,scene.id));setFeedback('');}}
  async function choose(choice:SceneChoice){
    if(committing.current||busy||!scene)return;
    // Resolve against the latest scene, never a stored action or dialogue string.
    const current=scene.choices.find(c=>c.id===choice.id);if(!current)return;
    if(current.inspect){setMemory(m=>({...finishScene(m,scene.id),active:current.inspect!,line:0}));setFeedback('');return;}
    if(!current.action)return;
    committing.current=true;setFeedback('');
    try{
      const next=await onAction(current.action);
      if(!next||next.error||next.pending){setFeedback('The choice was not confirmed. Review current rights or return to the castle and refresh; no success is assumed.');return;}
      setMemory(m=>finishScene(m,scene.id));
      setFeedback(current.action.action==='agreement_reject'?'Proposal declined. No transaction or relationship penalty.':'Your choice is made. The court will answer.');
    }finally{committing.current=false;}
  }
  if(!scene)return children??null;
  return <VampireEncounter scene={scene} seen={memory.seen} lineIndex={memory.active===scene.id?memory.line:0} busy={busy||!!result.pending} feedback={feedback}
    onLine={line=>setMemory(m=>({...m,active:scene.id,line}))} onChoice={choice=>void choose(choice)} onComplete={complete}
    onSkipReckoning={()=>{if(!committing.current)setMemory(m=>({...m,active:null,line:0,seen:[...new Set([...m.seen,...scenes.filter(s=>s.type==='RECKONING').map(s=>s.id)])]}));}}/>;
}
