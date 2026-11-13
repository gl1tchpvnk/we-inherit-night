import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import type {Action,Result} from './chain';
import {AGENTS} from './agents';
import {bloodWarning,hungerText,encounterFeed,encounterFeedText} from './blood';
import {Portrait,RoomArt} from './visuals';
import {buildEncounterScenes,finishScene,nextScene,readSceneMemory,resolveScene,topicStatus,markSceneRead,type SceneMemory,type EncounterScene,type SceneChoice} from './encounters';

export function BloodStatus({result}:{result:Result}){
  const c=result.campaign;
  if(!c||c.status!=='playing')return null;
  return <aside className="blood-status" aria-label="Blood status" data-danger={c.resources.blood<=3}><strong>Blood {c.resources.blood}/12</strong><span>{hungerText(c.resources.blood)}</span><small>Dawn takes 1 Blood with shelter, 3 without.</small></aside>;
}

export function VampireEncounter({scene,lineIndex,busy,feedback,result,onFeed,onLine,onChoice,onComplete,onSkipReckoning,onRefresh,refreshBusy=false,seen=[],scenes=[],memory}:{
  onFeed?:()=>void;result?:Result;scene:EncounterScene;lineIndex:number;busy:boolean;feedback:string;seen?:string[];
  scenes?:EncounterScene[];memory?:SceneMemory;
  onRefresh?:()=>void;refreshBusy?:boolean;
  onLine:(index:number)=>void;onChoice:(choice:SceneChoice)=>void;onComplete:()=>void;onSkipReckoning:()=>void;
}){
  const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
  const index=Math.min(lineIndex,scene.lines.length-1),spoken=scene.lines[index];
  const currentActor=spoken?.speaker!=='narrator'?spoken?.speaker:scene.portraits[0];
  const displayedPortraits=scene.type==='RECKONING'&&currentActor?[currentActor]:scene.portraits;
  const chapter=/^(reckoning|incident):/.test(scene.id)?Number(scene.id.split(':')[1])+1:null;
  const finishLabel=scene.completionLabel??(scene.type==='RECKONING'?'Continue to next night':'Return to the castle');
  const reading=scene.type!=='NEGOTIATION'&&index<scene.lines.length-1;
  const readMemory=memory??{seen,active:null,line:0};
  const entry=useRef({key:'',review:false});
  if(entry.current.key!==`${scene.id}:${scene.readVersion}`)entry.current={key:`${scene.id}:${scene.readVersion}`,review:scene.id.startsWith('character:')&&topicStatus(scene,readMemory)==='Explored'};
  const back=scene.choices.find(c=>c.inspect?.startsWith('decision:')&&/Consider|Compare|Return/.test(c.label));
  const choices=scene.choices.filter(c=>c!==back);
  const isNavigation=(c:SceneChoice)=>/^(Return|Back|There is something|Consider|Compare|Continue|I am ready)/.test(c.label);
  const status=(c:SceneChoice)=>{if(c.action||isNavigation(c))return null;const state=topicStatus(resolveScene(scenes,c.inspect??null),readMemory);return c.reviewOnly&&state!=='Explored'?null:state;};
  const isReview=(c:SceneChoice)=>c.reviewOnly||!!c.inspect&&/^(ask:|personal:|talk:|purpose:|meaning:|finding:)/.test(c.inspect)&&status(c)==='Explored';
  const primary=choices.filter(c=>!isReview(c)),review=choices.filter(isReview);
  const hasFeed=scene.id==='action:feed'||choices.some(c=>c.inspect==='action:feed'||c.action?.action==='game'&&c.action.choice==='feed');
  const leave=()=>back?onChoice(back):onComplete();
  const renderChoice=(choice:SceneChoice)=><div key={choice.id} className="story-choice">{choice.summary&&<div className="choice-consequences">{choice.summary.map((text,i)=><p key={i}>{text}</p>)}</div>}{result&&choice.action&&bloodWarning(result,choice.action)&&<p className="blood-warning" role="status">{bloodWarning(result,choice.action)}</p>}<button type="button" className={choice.action?'binding-choice':''} disabled={busy||!!result?.pending||!!result?.error&&!!choice.action} onClick={()=>onChoice(choice)}>{choice.label}{status(choice)&&<small>{status(choice)}</small>}</button></div>;
  const speech=<>{(scene.type==='NEGOTIATION'?scene.lines:[spoken]).filter(Boolean).map((line,i)=><div key={`${scene.id}:${index}:${i}`} className="spoken-line" aria-live="polite" aria-atomic="true"><p className="eyebrow">{line.speaker==='narrator'?'The chronicle':AGENTS[line.speaker].name}</p><blockquote>{line.text}</blockquote></div>)}</>;
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
        {entry.current.review?<details><summary>Review introduction</summary>{speech}</details>:speech}
        {!reading&&scene.terms.length>0&&<section className="scene-terms" aria-label="Before you decide">{scene.terms.map((term,i)=><p key={i}>{term}</p>)}</section>}

        {scene.rights.length>0&&<details className="scene-rights"><summary>Inspect terms</summary><ul>{scene.rights.map((right,i)=><li key={i}>{right}</li>)}</ul></details>}
        {scene.outcome&&<p className="scene-outcome">{scene.outcome}</p>}
        <p role="status" className="scene-feedback">{busy?'Your decision is being resolved…':feedback}</p>
        {onRefresh&&(result?.pending||result?.error)&&<button type="button" disabled={refreshBusy} onClick={onRefresh}>Check confirmed outcome</button>}
        <div className="scene-choices">
          {reading?<button type="button" disabled={busy} onClick={()=>{onLine(index+1);heading.current?.focus();}}>Continue</button>:<>
            {primary.filter(c=>!c.secondary).map(renderChoice)}
            {primary.some(c=>c.secondary)&&<details className="other-choices"><summary>Also tonight: {primary.filter(c=>c.secondary).map(c=>c.label).join(' · ')}</summary>{primary.filter(c=>c.secondary).map(renderChoice)}</details>}
            {review.length>0&&<details className="other-choices"><summary>Review conversation</summary>{review.map(renderChoice)}</details>}
            {scene.type==='RECKONING'&&<button type="button" disabled={busy} onClick={onSkipReckoning}>{finishLabel}</button>}
          </>}
          {!hasFeed&&onFeed&&result?.campaign?.status==='playing'&&<div className="story-choice encounter-feed" data-hungry={result.campaign.resources.blood<=3}><button type="button" aria-describedby="encounter-feed-cost" disabled={busy||!encounterFeed(result)} onClick={onFeed}>Feed · +4 Blood · 1 action</button><p id="encounter-feed-cost">{encounterFeedText(result)}</p></div>}
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
  const visibleLine=memory.active===scene?.id?memory.line:0;
  useEffect(()=>{if(scene&&!busy&&!result.pending&&!result.error&&(scene.type==='NEGOTIATION'||visibleLine>=scene.lines.length-1))setMemory(m=>markSceneRead(m,scene));},[scene,visibleLine,busy,result.pending,result.error]);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify({...memory,...(room!==undefined?{room}:{})}));}catch{/* Presentation remains usable when storage is unavailable. */}},[storageKey,memory,room]);
  useEffect(()=>{if(request&&!committing.current&&!busy&&!result.pending){setMemory(m=>({...m,active:request.id,line:0}));setFeedback('');}},[request]);
  function complete(){if(scene&&!committing.current&&!busy&&!result.pending){setMemory(m=>finishScene(m,scene.id));setFeedback('');}}
  async function choose(choice:SceneChoice){
    if(committing.current||busy||result.pending||!scene)return;
    // Resolve against the latest scene, never a stored action or dialogue string.
    const feeding=choice.id==='player:feed';
    const feed=feeding?encounterFeed(result):null;
    const current=feeding?(feed?{id:'player:feed',label:'Feed',action:feed}:null):scene.choices.find(c=>c.id===choice.id);if(!current)return;
    if(current.inspect){setMemory(m=>({...finishScene(m,scene.id),active:current.inspect!,line:0}));setFeedback('');return;}
    if(result.error||!current.action)return;
    committing.current=true;setFeedback('');
    try{
      const next=await onAction(current.action);
      if(!next||next.error||next.pending){setFeedback('The choice was not confirmed. Review current rights or return to the castle and refresh; no success is assumed.');return;}
      setMemory(m=>finishScene(m,scene.id));
      setFeedback(current.action.action==='agreement_reject'?'Proposal declined. No transaction or relationship penalty.':next.campaign&&next.campaign.night>campaign.night?'Your decision and its reckoning are confirmed.':'Your decision is confirmed.');
    }finally{committing.current=false;}
  }

  async function refresh(){
    if(committing.current||busy)return;
    committing.current=true;
    try{
      const confirmed=await onAction({action:'view'});
      if(confirmed&&!confirmed.pending&&!confirmed.error){setMemory(m=>({...m,active:null,line:0}));setFeedback('Current confirmed state loaded.');}
    }finally{committing.current=false;}
  }
  if(!scene)return children??null;
  return <VampireEncounter result={result} scene={scene} scenes={scenes} memory={memory} seen={memory.seen} lineIndex={visibleLine} busy={busy||!!result.pending} feedback={feedback}
    onFeed={()=>void choose({id:'player:feed',label:'Feed'})} onLine={line=>setMemory(m=>({...m,active:scene.id,line}))} onChoice={choice=>void choose(choice)} onComplete={complete}
    refreshBusy={busy} onRefresh={()=>void refresh()}
    onSkipReckoning={()=>{if(!committing.current&&!busy&&!result.pending)setMemory(m=>({...m,active:campaign.politics?.library&&campaign.status==='playing'?`decision:${campaign.night}`:null,line:0,seen:[...new Set([...m.seen,...scenes.filter(s=>s.type==='RECKONING').map(s=>s.id)])]}));}}/>;
}
