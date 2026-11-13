import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import type {Action,Result} from './chain';
import {AGENTS} from './agents';
import {bloodWarning,hungerText,encounterFeed} from './blood';
import {Portrait,RoomArt} from './visuals';
import {sanctuaryPanel,sanctuaryConsequence,sanctuaryShot,cinematicExcerpt,sanctuaryShotDuration} from './motionComic';
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
  const panel=sanctuaryPanel(scene);
  const [skippedScene,setSkippedScene]=useState<string|null>(null),[reviewFrame,setReviewFrame]=useState(false);
  const [reduced,setReduced]=useState(()=>typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [playback,setPlayback]=useState({sceneId:scene.id,frame:0}),[paused,setPaused]=useState(false);
  const frame=playback.sceneId===scene.id?playback.frame:0;
  const setFrame=(update:number|((value:number)=>number))=>setPlayback(p=>({sceneId:scene.id,frame:typeof update==='number'?update:update(p.sceneId===scene.id?p.frame:0)}));
  const still=skippedScene===scene.id;
  const shot=sanctuaryShot(panel,scene.id,frame,still||reduced||(panel==='entrance'&&seen.includes(scene.id)));
  const immersive=!!panel&&shot!=='decision'&&shot!=='consequence';
  const skipControl=useRef<HTMLButtonElement>(null);
  useEffect(()=>{setPaused(false);setReviewFrame(false);},[scene.id]);
  useEffect(()=>{(immersive?skipControl.current:heading.current)?.focus({preventScroll:true});},[immersive,scene.id]);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches);media.addEventListener('change',update);
    return ()=>media.removeEventListener('change',update);
  },[]);
  useEffect(()=>{
    if(!panel||shot==='decision'||shot==='consequence'||paused)return;
    const timer=setTimeout(()=>setFrame(f=>f+1),sanctuaryShotDuration(shot));
    return ()=>clearTimeout(timer);
  },[panel,shot,paused,scene.id]);
  const back=scene.choices.find(c=>c.inspect?.startsWith('decision:')&&/Consider|Compare|Return/.test(c.label));
  const choices=scene.choices.filter(c=>c!==back);
  const leave=()=>back?onChoice(back):onComplete();
  const renderChoice=(choice:SceneChoice)=><div key={choice.id} className="story-choice">{choice.summary&&<div className="choice-consequences">{choice.summary.map((text,i)=><p key={i}>{text}</p>)}</div>}{result&&choice.action&&bloodWarning(result,choice.action)&&<p className="blood-warning" role="status">{bloodWarning(result,choice.action)}</p>}<button type="button" className={choice.action?'binding-choice':''} disabled={busy} onClick={()=>onChoice(choice)}>{choice.label}{choice.inspect&&seen.includes(choice.inspect)&&<small>Explored</small>}</button></div>;

  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    dialog.current?.showModal();heading.current?.focus();
    return ()=>{dialog.current?.close();previous?.focus();};
  },[]);
  useEffect(()=>{heading.current?.focus({preventScroll:!!panel});if(panel)dialog.current?.scrollTo({top:0});},[scene.id]);
  const dialogue=<div key={`${scene.id}:${index}`} className="spoken-line" aria-live="polite" aria-atomic="true"><p className="eyebrow">{spoken?.speaker==='narrator'?'The chronicle':spoken?AGENTS[spoken.speaker].name:''}</p><blockquote>{spoken?.text}</blockquote></div>;
  return <dialog ref={dialog} data-immersive={immersive} data-actor={currentActor} data-kind={scene.type} data-panel={panel??undefined} data-shot={panel?shot:undefined} data-still={still||reduced} data-paused={paused} data-review-frame={reviewFrame} className={`vampire-scene scene-${scene.location}${panel?' motion-comic':''}${scene.portraits.length===0?' scene-overview':''}${scene.compact?' living-encounter':''}`} aria-label={immersive?scene.title:undefined} aria-labelledby={immersive?undefined:"encounter-title"} onCancel={event=>{event.preventDefault();if(!busy)leave();}}>
    {result&&<BloodStatus result={result}/>}
    {panel&&shot!=='decision'&&shot!=='consequence'&&<nav className="comic-controls" aria-label="Cinematic playback"><span>{shot==='establishing'?'I · Crimson Lounge':shot==='detail'?'II · The price of refuge':shot==='entrance'?'II · Seraphine':shot==='terms'?'III · The offer':panel==='consequence'?'V · A bargain recorded':'IV · Your decision'}</span>{!reduced&&!still&&<button type="button" aria-pressed={paused} onClick={()=>{setReviewFrame(false);setPaused(p=>!p);}}>{paused?'Play scene':'Pause scene'}</button>}{paused&&!still&&!reduced&&<button type="button" onClick={()=>{setReviewFrame(true);setFrame(f=>Math.min(4,f+1));}}>Next shot</button>}<button type="button" ref={skipControl} onClick={()=>{setSkippedScene(scene.id);setFrame(4);requestAnimationFrame(()=>dialog.current?.querySelector('.scene-script')?.scrollIntoView({block:'start'}));}} disabled={still||reduced}>Continue / Skip</button></nav>}
    <div className="scene-stage" key={scene.id}>
      <div className="scene-background" aria-hidden="true"><RoomArt room={scene.location}/></div>
      {panel?<section className="comic-screen" aria-label="Illustrated scene"><div className="comic-environment"><RoomArt room="lounge"/><small>PROVISIONAL LOUNGE STUDY</small></div><div className="comic-character"><Portrait actor="seraphine"/></div><div className="comic-shadow" aria-hidden="true"/><div className="comic-location" aria-hidden="true">Crimson<br/>Lounge</div>{panel==='consequence'&&<section className="comic-authority" aria-label="Confirmed fixed-term sanctuary lease"><div className="authority-party authority-lessor"><Portrait actor="seraphine"/><span>Seraphine · lessor</span></div><div className="authority-party authority-tenant"><Portrait actor="player"/><span>You · tenant</span></div><div className="authority-link" aria-hidden="true"/><div className="authority-contract"><strong>Sanctuary<br/>granted</strong><span>Paid lease · fixed term</span><small>Shelter, not ownership.<br/>No bloodline bond.</small></div></section>}<div className="comic-caption">{shot==='decision'||shot==='consequence'?null:cinematicExcerpt(spoken?.text??'',shot)&&<blockquote className="comic-fragment">{cinematicExcerpt(spoken?.text??'',shot)}</blockquote>}</div></section>:<div className={`scene-portraits ${displayedPortraits.length>1?'paired':''}`}>{displayedPortraits.length?displayedPortraits.map(actor=><Portrait actor={actor} key={actor}/>):<figure className="portrait environment-portrait"><RoomArt room={scene.location}/><figcaption>PROVISIONAL GENERATED INTERIOR · APPROVAL PENDING</figcaption></figure>}</div>}
      <div className="scene-script" hidden={immersive}>
        {chapter!==null&&<p className="chapter-folio">Night {['I','II','III','IV','V','VI','VII'][chapter-1]??chapter} <span>{scene.type==='RECKONING'?'The reckoning':'A new chapter'}</span></p>}
        <div className="scene-topline"><span>{scene.location==='crypt'?'Ancestral Crypt':scene.location==='library'?'Forbidden Library':'Crimson Lounge'}</span>{scene.type!=='RECKONING'&&<button type="button" disabled={busy} onClick={leave}>{back?'Back to tonight’s choices':scene.completionLabel??'Return to the castle'}</button>}</div>
        {scene.reactionLevel&&<p className="eyebrow">{scene.reactionLevel==='major'?'The balance has shifted':'Word from the court'}</p>}
        <h2 id="encounter-title" tabIndex={-1} ref={heading}>{scene.title}</h2>
        {(!panel||shot==='decision'||shot==='consequence')&&dialogue}{panel&&shot!=='decision'&&shot!=='consequence'&&<details className="comic-transcript"><summary>Read full dialogue</summary>{dialogue}</details>}
        {!reading&&panel!=='consequence'&&scene.terms.length>0&&<section className="scene-terms" aria-label="Before you decide">{scene.terms.map((term,i)=><p key={i}>{term}</p>)}</section>}

        {scene.rights.length>0&&<details className="scene-rights"><summary>Inspect terms</summary><ul>{panel==='consequence'&&scene.terms.map((term,i)=><li key={`term:${i}`}>{term}</li>)}{scene.rights.map((right,i)=><li key={i}>{right}</li>)}</ul></details>}
        {scene.outcome&&<p className="scene-outcome">{scene.outcome}</p>}
        <p role="status" className="scene-feedback">{busy?'Your decision is being resolved…':feedback}</p>
        <div className="scene-choices">
          {reading?<button type="button" disabled={busy} onClick={()=>{onLine(index+1);heading.current?.focus();}}>Continue</button>:<>
            {choices.filter(c=>!c.secondary).map(renderChoice)}

            {choices.some(c=>c.secondary)&&<details className="other-choices"><summary>Also tonight: {choices.filter(c=>c.secondary).map(c=>c.label).join(' · ')}</summary>{choices.filter(c=>c.secondary).map(renderChoice)}</details>}
            {scene.type==='RECKONING'&&<button type="button" disabled={busy} onClick={onSkipReckoning}>{finishLabel}</button>}
          </>}
        {onFeed&&result?.campaign?.status==='playing'&&<div className="encounter-feed"><button type="button" disabled={busy||!encounterFeed(result)} onClick={onFeed}>Feed · +4 Blood · 1 action</button><small>{result.pending?'Waiting for the current commitment to resolve.':result.campaign.actionsLeft<1?'No nightly action remains.':'Up to 12 Blood. Uses tonight’s action; may advance the night.'}</small></div>}

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
  const [reveal,setReveal]=useState<EncounterScene|null>(null);
  const committing=useRef(false);
  const scenes=useMemo(()=>buildEncounterScenes(result),[result]);
  const scene=reveal??nextScene(scenes,memory);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify({...memory,...(room!==undefined?{room}:{})}));}catch{/* Presentation remains usable when storage is unavailable. */}},[storageKey,memory,room]);
  useEffect(()=>{if(request){setMemory(m=>({...m,active:request.id,line:0}));setFeedback('');}},[request]);
  function complete(){if(scene&&!committing.current){setMemory(m=>finishScene(m,scene.id));setReveal(null);setFeedback('');}}
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
      setReveal(current.action.action==='game'&&current.action.choice==='sanctuary_pact'?sanctuaryConsequence(result,next):null);
      setFeedback(current.action.action==='agreement_reject'?'Proposal declined. No transaction or relationship penalty.':'Your choice is made. The court will answer.');
    }finally{committing.current=false;}
  }
  if(!scene)return children??null;
  return <VampireEncounter result={result} scene={scene} seen={memory.seen} lineIndex={memory.active===scene.id?memory.line:0} busy={busy||!!result.pending} feedback={feedback}
    onFeed={()=>void choose({id:'player:feed',label:'Feed'})} onLine={line=>setMemory(m=>({...m,active:scene.id,line}))} onChoice={choice=>void choose(choice)} onComplete={complete}
    onSkipReckoning={()=>{if(!committing.current)setMemory(m=>({...m,active:null,line:0,seen:[...new Set([...m.seen,...scenes.filter(s=>s.type==='RECKONING').map(s=>s.id)])]}));}}/>;
}
