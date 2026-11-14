import {chooseRelationship,leaveRelationship} from './relationshipDialogue';
import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import type {Action,Result} from './chain';
import {AGENTS} from './agents';
import {bloodWarning,hungerText,encounterFeed,encounterFeedText} from './blood';
import {Portrait,RoomArt} from './visuals';
import {buildEncounterScenes,roomIntroduction,finishRoomIntroduction,resumeEncounterMemory,finishScene,visitScene,leaveEncounters,nextScene,readSceneMemory,resolveScene,topicStatus,markSceneRead,type SceneMemory,type EncounterScene,type SceneChoice} from './encounters';

export function BloodStatus({result}:{result:Result}){
  const c=result.campaign;
  if(!c||c.status!=='playing')return null;
  return <aside className="blood-status" aria-label="Blood status" data-danger={c.resources.blood<=3}><strong>Blood {c.resources.blood}/12</strong><span>{hungerText(c.resources.blood)}</span><small>Dawn takes 1 Blood with shelter, 3 without.</small></aside>;
}

export function VampireEncounter({scene,lineIndex,busy,feedback,result,onFeed,onLine,onChoice,onComplete,onSkipReckoning,onRefresh,onBack,onTonight,onCastle,backLabel,tonightCurrent=false,refreshBusy=false,seen=[],scenes=[],memory}:{
  onFeed?:()=>void;result?:Result;scene:EncounterScene;lineIndex:number;busy:boolean;feedback:string;seen?:string[];
  scenes?:EncounterScene[];memory?:SceneMemory;
  onRefresh?:()=>void;refreshBusy?:boolean;onBack?:()=>void;onTonight?:()=>void;onCastle?:()=>void;backLabel?:string;tonightCurrent?:boolean;
  onLine:(index:number)=>void;onChoice:(choice:SceneChoice)=>void;onComplete:()=>void;onSkipReckoning:()=>void;
}){
  const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);
  const index=Math.min(lineIndex,scene.lines.length-1),spoken=scene.lines[index];
  const currentActor=spoken?.speaker!=='narrator'&&spoken?.speaker!=='player'?spoken?.speaker:scene.portraits[0];
  const displayedPortraits=scene.type==='RECKONING'&&currentActor?[currentActor]:scene.portraits;
  const chapter=/^(reckoning|incident):/.test(scene.id)?Number(scene.id.split(':')[1])+1:null;
  const finishLabel=scene.completionLabel??'Continue';
  const reading=scene.type!=='NEGOTIATION'&&index<scene.lines.length-1;
  const readMemory=memory??{seen,active:null,line:0};
  const entry=useRef({key:'',review:false});
  if(entry.current.key!==`${scene.id}:${scene.readVersion}`)entry.current={key:`${scene.id}:${scene.readVersion}`,review:(scene.id.startsWith('character:')||['action:petition_marius','action:sanctuary_pact'].includes(scene.id))&&topicStatus(scene,readMemory)==='Explored'};
  const back=scene.choices.find(c=>c.inspect?.startsWith('decision:')&&/Consider|Compare|Return/.test(c.label));
  const choices=scene.choices.filter(c=>c!==back&&!(onBack&&c.inspect?.startsWith('character:')&&/^(There is something|Return to our conversation|Back to conversation|Ask another)/.test(c.label)));
  const isNavigation=(c:SceneChoice)=>/^(Return|Back|There is something|Consider|Compare|Continue|I am ready)/.test(c.label);
  const status=(c:SceneChoice)=>{if(c.action||c.reply||c.id==='unanswered'||isNavigation(c))return null;const state=topicStatus(resolveScene(scenes,c.inspect??null),readMemory);return c.reviewOnly&&state!=='Explored'?null:state;};
  const isReview=(c:SceneChoice)=>c.reviewOnly||!!c.inspect&&/^(ask:|personal:|talk:|purpose:|meaning:|finding:)/.test(c.inspect)&&status(c)==='Explored';
  const primary=choices.filter(c=>!isReview(c)),review=choices.filter(isReview);
  const hasFeed=scene.id==='action:feed'||choices.some(c=>c.inspect==='action:feed'||c.action?.action==='game'&&c.action.choice==='feed');
  const leave=()=>onBack?onBack():onCastle?onCastle():onComplete();
  const renderChoice=(choice:SceneChoice)=><div key={choice.id} className="story-choice">{choice.summary&&<div className="choice-consequences">{choice.summary.map((text,i)=><p key={i}>{text}</p>)}</div>}{result&&choice.action&&bloodWarning(result,choice.action)&&<p className="blood-warning" role="status">{bloodWarning(result,choice.action)}</p>}<button type="button" className={choice.action?'binding-choice':''} disabled={busy||!!result?.pending||!!result?.error&&!!choice.action} onClick={()=>onChoice(choice)}>{choice.label}{status(choice)&&<small>{status(choice)}</small>}</button></div>;
  const speech=<>{(scene.type==='NEGOTIATION'?scene.lines:[spoken]).filter(Boolean).map((line,i)=><div key={`${scene.id}:${index}:${i}`} className="spoken-line" aria-live="polite" aria-atomic="true"><p className="eyebrow">{line.speaker==='narrator'?'The chronicle':line.speaker==='player'?'YOU':AGENTS[line.speaker].name}</p><blockquote>{line.text}</blockquote></div>)}</>;
  useEffect(()=>{
    const previous=document.activeElement as HTMLElement|null;
    dialog.current?.showModal();heading.current?.focus();
    return ()=>{dialog.current?.close();previous?.focus();};
  },[]);
  useEffect(()=>{heading.current?.focus();},[scene.id]);
  return <dialog ref={dialog} data-actor={currentActor} data-kind={scene.type} className={`vampire-scene scene-${scene.location}${scene.portraits.length===0?' scene-overview':''}${scene.compact?' living-encounter':''}`} aria-labelledby="encounter-title" onCancel={event=>{event.preventDefault();if(!busy){if(scene.introduction)onComplete();else leave();}}}>
    {result&&<BloodStatus result={result}/>}
    <div className={`scene-stage${entry.current.review?' scene-review':''}`} key={scene.id}>
      <div className="scene-background" aria-hidden="true"><RoomArt room={scene.location}/></div>
      <div className={`scene-portraits ${displayedPortraits.length>1?'paired':''}`}>{displayedPortraits.length?displayedPortraits.map(actor=><Portrait actor={actor} key={actor}/>):<figure className="portrait environment-portrait"><RoomArt room={scene.location}/><figcaption>PROVISIONAL GENERATED INTERIOR · APPROVAL PENDING</figcaption></figure>}</div>
      <div className="scene-script">
        {chapter!==null&&<p className="chapter-folio">Night {['I','II','III','IV','V','VI','VII'][chapter-1]??chapter} <span>{scene.type==='RECKONING'?'The reckoning':'A new chapter'}</span></p>}
        <div className="scene-topline"><span>{scene.location==='crypt'?'Ancestral Crypt':scene.location==='library'?'Forbidden Library':'Crimson Lounge'}</span></div>
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
            {scene.introduction&&<button disabled={busy||!!result?.error} onClick={onComplete}>Continue</button>}{primary.filter(c=>!c.secondary).map(renderChoice)}
            {primary.some(c=>c.secondary)&&<details className="other-choices"><summary>Also tonight: {primary.filter(c=>c.secondary).map(c=>c.label).join(' · ')}</summary>{primary.filter(c=>c.secondary).map(renderChoice)}</details>}
            {review.length>0&&<details className="other-choices"><summary>Review conversation</summary>{review.map(renderChoice)}</details>}
            {scene.type==='RECKONING'&&<button type="button" disabled={busy} onClick={onSkipReckoning}>{finishLabel}</button>}
          </>}
          {!scene.introduction&&!hasFeed&&onFeed&&result?.campaign?.status==='playing'&&<div className="story-choice encounter-feed" data-hungry={result.campaign.resources.blood<=3}><button type="button" aria-describedby="encounter-feed-cost" disabled={busy||!encounterFeed(result)} onClick={onFeed}>Feed · +4 Blood · 1 action</button><p id="encounter-feed-cost">{encounterFeedText(result)}</p></div>}
        </div>
      </div>
    </div>
    <nav className="encounter-navigation" aria-label="Encounter navigation">{scene.introduction?<button disabled={busy||!!result?.error} onClick={onComplete}>Skip introduction</button>:<>
      <div>{onBack&&<button type="button" disabled={busy} onClick={onBack}>← {backLabel??'Back to conversation'}</button>}</div>
      <div>{onTonight&&<button type="button" disabled={busy||tonightCurrent} onClick={onTonight}>Tonight’s choices</button>}<button type="button" disabled={busy} onClick={onCastle??onComplete}>{scene.exchange||scene.id.includes(':relationship:')?'Return to court':'Castle map'}</button></div>
    </>}</nav>
  </dialog>;
}

export function EncounterDirector({result,busy,request,onAction,children,room,onCastleMap,onRequestHandled}:{result:Result;busy:boolean;children?:ReactNode;room?:string|null;onCastleMap?:()=>void;onRequestHandled?:(serial:number)=>void;request:{id:string;serial:number}|null;onAction:(action:Action)=>Promise<Result|null>}){
  const campaign=result.campaign!;
  const storageKey=`night-scenes:v1:${campaign.id}`;
  const [memory,setMemory]=useState(()=>{try{return resumeEncounterMemory(readSceneMemory(localStorage.getItem(storageKey)));}catch{return readSceneMemory(null);}});
  const [feedback,setFeedback]=useState('');
  const committing=useRef(false);
  const scenes=useMemo(()=>buildEncounterScenes(result,memory.relationships),[result,memory.relationships]);
  const intended=resolveScene(scenes,memory.roomIntroduction?.destination??null)??nextScene(scenes,memory);
  const intro=roomIntroduction(scenes,memory,result);
  const scene=intro??intended;
  useEffect(()=>{if(intro&&intended&&!memory.roomIntroduction)setMemory(m=>({...m,active:intended.id,line:0,roomIntroduction:{room:intro.introduction!,destination:intended.id}}));},[intro?.id,intended?.id,memory.roomIntroduction]);
  const visibleLine=memory.active===scene?.id?memory.line:0;
  useEffect(()=>{if(scene&&!busy&&!result.pending&&!result.error&&(scene.type==='NEGOTIATION'||visibleLine>=scene.lines.length-1))setMemory(m=>markSceneRead(m,scene));},[scene,visibleLine,busy,result.pending,result.error]);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify({...memory,...(room!==undefined?{room}:{})}));}catch{/* Presentation remains usable when storage is unavailable. */}},[storageKey,memory,room]);
  useEffect(()=>{if(request&&!committing.current&&!busy&&!result.pending){setMemory(m=>({...m,active:request.id,line:0,trail:[],roomIntroduction:undefined}));setFeedback('');onRequestHandled?.(request.serial);}},[request]);
  function complete(){if(scene?.introduction){if(!committing.current&&!busy&&!result.pending&&!result.error){const next=finishRoomIntroduction(memory.roomIntroduction?memory:{...memory,roomIntroduction:{room:scene.introduction,destination:intended!.id}});try{localStorage.setItem(storageKey,JSON.stringify(next));}catch{}setMemory(next);}return;}if(scene&&!committing.current&&!busy&&!result.pending){setMemory(m=>finishScene(leaveRelationship(m,scene),scene.id));setFeedback('');}}
  async function choose(choice:SceneChoice){
    if(committing.current||busy||result.pending||!scene)return;
    // Resolve against the latest scene, never a stored action or dialogue string.
    const feeding=choice.id==='player:feed';
    const feed=feeding?encounterFeed(result):null;
    const current=feeding?(feed?{id:'player:feed',label:'Feed',action:feed}:null):scene.choices.find(c=>c.id===choice.id);if(!current)return;
    if(current.reply){
      if(result.error)return;
      const next=chooseRelationship(memory,scene,current,result);
      try{localStorage.setItem(storageKey,JSON.stringify({...next,...(room!==undefined?{room}:{})}));}catch{setFeedback('Your reply could not be saved. Try again or leave this unanswered.');return;}
      setMemory(next);setFeedback('');return;
    }
    if(current.inspect){setMemory(m=>visitScene(leaveRelationship(m,scene),scene.id,current.inspect!));setFeedback('');return;}
    if(result.error||!current.action)return;
    committing.current=true;setFeedback('');
    try{
      const next=await onAction(current.action);
      if(!next||next.error||next.pending){setFeedback('The choice was not confirmed. Review current rights or return to the castle and refresh; no success is assumed.');return;}
      setMemory(m=>({...finishScene(leaveRelationship(m,scene),scene.id),trail:[]}));
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
  const previous=resolveScene(scenes,memory.trail?.at(-1)??null);
  function goBack(){if(!scene||!previous||committing.current||busy||result.pending)return;setMemory(m=>({...finishScene(leaveRelationship(m,scene),scene.id),active:previous.id,trail:(m.trail??[]).slice(0,-1)}));setFeedback('');}
  function goTonight(){if(!scene||committing.current||busy||result.pending)return;setMemory(m=>({...finishScene(leaveRelationship(m,scene),scene.id),active:`decision:${campaign.night}`,trail:[]}));setFeedback('');}
  function goCastle(){if(!scene||committing.current||busy||result.pending)return;setMemory(m=>leaveEncounters(leaveRelationship(m,scene),scenes,scene.id));onCastleMap?.();setFeedback('');}
  if(!scene)return children??null;
  return <VampireEncounter result={result} scene={scene} scenes={scenes} memory={memory} seen={memory.seen} lineIndex={visibleLine} busy={busy||!!result.pending} feedback={feedback}
    onFeed={()=>void choose({id:'player:feed',label:'Feed'})} onLine={line=>setMemory(m=>({...m,active:scene.id,line}))} onChoice={choice=>void choose(choice)} onComplete={complete}
    onBack={previous&&previous.id!==scene.id?goBack:scene.id.startsWith('personal:relationship:')||scene.id.startsWith('ask:relationship:')?()=>{const target=scenes.find(s=>s.id===`character:${scene.portraits[0]}`);if(target&&!busy&&!result.pending)setMemory(m=>({...finishScene(leaveRelationship(m,scene),scene.id),active:target.id,trail:[]}));}:undefined} backLabel={scene.id.includes(':relationship:')||previous?.id.startsWith('character:')?'Back to conversation':'Back'}
    onTonight={campaign.status==='playing'?goTonight:undefined} tonightCurrent={resolveScene(scenes,`decision:${campaign.night}`)?.id===scene.id} onCastle={goCastle}
    refreshBusy={busy} onRefresh={()=>void refresh()}
    onSkipReckoning={()=>{if(!committing.current&&!busy&&!result.pending)setMemory(m=>({...m,active:campaign.politics?.library&&campaign.status==='playing'?`decision:${campaign.night}`:null,line:0,seen:[...new Set([...m.seen,...scenes.filter(s=>s.type==='RECKONING').map(s=>s.id)])]}));}}/>;
}
