import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import type {Action,Result} from './chain';
import {AGENTS} from './agents';
import {bloodWarning,hungerText,encounterFeed} from './blood';
import {Portrait,RoomArt} from './visuals';
import {buildEncounterScenes,finishScene,nextScene,readSceneMemory,type EncounterScene,type SceneChoice} from './encounters';

export function BloodStatus({result}:{result:Result}){
  const c=result.campaign;
  if(!c||c.status!=='playing')return null;
  return <aside className="blood-status" aria-label="Blood status" data-danger={c.resources.blood<=3}><strong>Blood {c.resources.blood}/12</strong><span>{hungerText(c.resources.blood)}</span><small>Dawn takes 1 Blood with shelter, 3 without.</small></aside>;
}

export function VampireEncounter({scene,lineIndex,busy,feedback,result,onFeed,onLine,onChoice,onComplete,onSkipReckoning,seen=[]}:{
  onFeed?:()=>void;result?:Result;scene:EncounterScene;lineIndex:number;busy:boolean;feedback:string;seen?:string[];
  onLine:(index:number)=>void;onChoice:(choice:SceneChoice)=>void;onComplete:()=>void;onSkipReckoning:()=>void;
}){
  const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
  const index=Math.min(lineIndex,scene.lines.length-1),spoken=scene.lines[index];
  const currentActor=spoken?.speaker!=='narrator'?spoken?.speaker:scene.portraits[0];
  const displayedPortraits=scene.type==='RECKONING'&&currentActor?[currentActor]:scene.portraits;
  const chapter=/^(reckoning|incident):/.test(scene.id)?Number(scene.id.split(':')[1])+1:null;
  const finishLabel=scene.completionLabel??(scene.type==='RECKONING'?'Continue to next night':'Return to the castle');
  const reading=index<scene.lines.length-1;
  const back=scene.choices.find(c=>c.inspect?.startsWith('decision:')&&/Consider|Compare|Return/.test(c.label));
  const choices=scene.choices.filter(c=>c!==back);
  const leave=()=>back?onChoice(back):onComplete();
  const renderChoice=(choice:SceneChoice)=><div key={choice.id} className="story-choice">{choice.summary&&<div className="choice-consequences">{choice.summary.map((text,i)=><p key={i}>{text}</p>)}</div>}{result&&choice.action&&bloodWarning(result,choice.action)&&<p className="blood-warning" role="status">{bloodWarning(result,choice.action)}</p>}<button type="button" className={choice.action?'binding-choice':''} disabled={busy} onClick={()=>onChoice(choice)}>{choice.label}{choice.inspect&&seen.includes(choice.inspect)&&<small>Explored</small>}</button></div>;

  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    dialog.current?.showModal();heading.current?.focus();
    return ()=>{dialog.current?.close();previous?.focus();};
  },[]);
  useEffect(()=>{heading.current?.focus();},[scene.id]);
  return <dialog ref={dialog} data-actor={currentActor} data-kind={scene.type} className={`vampire-scene scene-${scene.location}${scene.portraits.length===0?' scene-overview':''}${scene.compact?' living-encounter':''}`} aria-labelledby="encounter-title" onCancel={event=>{event.preventDefault();if(!busy)leave();}}>
    {result&&<BloodStatus result={result}/>}
    <div className="scene-stage" key={scene.id}>
      <div className="scene-background" aria-hidden="true"><RoomArt room={scene.location}/></div>
      <div className={`scene-portraits ${displayedPortraits.length>1?'paired':''}`}>{displayedPortraits.length?displayedPortraits.map(actor=><Portrait actor={actor} key={actor}/>):<figure className="portrait environment-portrait"><RoomArt room={scene.location}/><figcaption>PROVISIONAL GENERATED INTERIOR · APPROVAL PENDING</figcaption></figure>}</div>
      <div className="scene-script">
        {chapter!==null&&<p className="chapter-folio">Night {['I','II','III','IV','V','VI','VII'][chapter-1]??chapter} <span>{scene.type==='RECKONING'?'The reckoning':'A new chapter'}</span></p>}
        <div className="scene-topline"><span>{scene.location==='crypt'?'Ancestral Crypt':scene.location==='library'?'Forbidden Library':'Crimson Lounge'}</span>{scene.type!=='RECKONING'&&<button type="button" disabled={busy} onClick={leave}>{back?'Back to tonight’s choices':'Return to the castle'}</button>}</div>
        {scene.reactionLevel&&<p className="eyebrow">{scene.reactionLevel==='major'?'The balance has shifted':'Word from the court'}</p>}
        <h2 id="encounter-title" tabIndex={-1} ref={heading}>{scene.title}</h2>
        <div key={`${scene.id}:${index}`} className="spoken-line" aria-live="polite" aria-atomic="true"><p className="eyebrow">{spoken?.speaker==='narrator'?'The chronicle':spoken?AGENTS[spoken.speaker].name:''}</p><blockquote>{spoken?.text}</blockquote></div>
        {!reading&&scene.terms.length>0&&<section className="scene-terms" aria-label="Before you decide">{scene.terms.map((term,i)=><p key={i}>{term}</p>)}</section>}

        {scene.rights.length>0&&<details className="scene-rights"><summary>Inspect terms</summary><ul>{scene.rights.map((right,i)=><li key={i}>{right}</li>)}</ul></details>}
        {scene.outcome&&<p className="scene-outcome">{scene.outcome}</p>}
        <p role="status" className="scene-feedback">{busy?'Your decision is being resolved…':feedback}</p>
        <div className="scene-choices">
          {reading?<button type="button" disabled={busy} onClick={()=>{onLine(index+1);heading.current?.focus();}}>Continue</button>:<>
            {choices.filter(c=>!c.secondary).map(renderChoice)}
            {choices.some(c=>c.secondary)&&<details className="other-choices"><summary>Also tonight: {choices.filter(c=>c.secondary).map(c=>c.label).join(' · ')}</summary>{choices.filter(c=>c.secondary).map(renderChoice)}</details>}
            {scene.type==='RECKONING'&&<button type="button" disabled={busy} onClick={onSkipReckoning}>{finishLabel}</button>}
          </>}

        </div>
        {onFeed&&result?.campaign?.status==='playing'&&<aside className="encounter-player-action" aria-label="Your action"><span className="eyebrow">Your action</span><button type="button" disabled={busy||!encounterFeed(result)} onClick={onFeed}>Feed · +4 Blood · 1 action</button><small>{result.pending?'Waiting for the current commitment to resolve.':result.campaign.actionsLeft<1?'No nightly action remains.':'Up to 12 Blood. Uses your action instead of this bargain; the night advances when your actions run out.'}</small></aside>}
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
    if(committing.current||busy||result.pending||result.error||!scene)return;
    // Resolve against the latest scene, never a stored action or dialogue string.
    const feeding=choice.id==='player:feed';
    const feed=feeding?encounterFeed(result):null;
    const current=feeding?(feed?{id:'player:feed',label:'Feed',action:feed}:null):scene.choices.find(c=>c.id===choice.id);if(!current)return;
    if(current.inspect){setMemory(m=>({...finishScene(m,scene.id),active:current.inspect!,line:0}));setFeedback('');return;}
    if(!current.action)return;
    committing.current=true;setFeedback('');
    try{
      const next=await onAction(current.action);
      if(!next||next.error||next.pending){setFeedback('The choice was not confirmed. Review current rights or return to the castle and refresh; no success is assumed.');return;}
      setMemory(m=>feeding?{...m,active:null,line:0}:finishScene(m,scene.id));
      setFeedback(current.action.action==='agreement_reject'?'Proposal declined. No transaction or relationship penalty.':'Your choice is made. The court will answer.');
    }finally{committing.current=false;}
  }
  if(!scene)return children??null;
  return <VampireEncounter result={result} scene={scene} seen={memory.seen} lineIndex={memory.active===scene.id?memory.line:0} busy={busy||!!result.pending} feedback={feedback}
    onFeed={()=>void choose({id:'player:feed',label:'Feed'})} onLine={line=>setMemory(m=>({...m,active:scene.id,line}))} onChoice={choice=>void choose(choice)} onComplete={complete}
    onSkipReckoning={()=>{if(!committing.current)setMemory(m=>({...m,active:null,line:0,seen:[...new Set([...m.seen,...scenes.filter(s=>s.type==='RECKONING').map(s=>s.id)])]}));}}/>;
}
