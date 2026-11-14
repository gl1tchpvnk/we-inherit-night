import {useEffect,useRef,useState,type ReactNode} from 'react';
import {adapter,playableTestnet,type Result} from './chain';
import {Portrait,RoomArt} from './visuals';
import {PROLOGUE,FIRST_NIGHT_PRELUDE,runtimeDescription,initializationDescription,readIntro,advanceIntro,requiresReplacementConfirmation,loadEntryCampaign,type IntroProgress,type SaveStatus} from './entry';

export function TitleScreen({save,busy,error,confirm,onNew,onContinue,onCancel,onConfirm}:{save:SaveStatus|null;busy:boolean;error:string;confirm:boolean;onNew:()=>void;onContinue:()=>void;onCancel:()=>void;onConfirm:()=>void}){
  const title=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{title.current?.focus();},[confirm]);
  return <main className="game-entry"><div className="cover-art" aria-hidden="true"/><section className="entry-copy"><p className="eyebrow">A gothic political graphic novel</p><h1 ref={title} tabIndex={-1}>We Inherit<br/>Night</h1><p className="entry-motto">The night belongs to those who survive it.</p>

    {confirm?<section className="notice" aria-label="Confirm new campaign"><h2>Begin another seven nights?</h2><p>{playableTestnet?'This assigns a new unused campaign. Your previous campaign remains on-chain but cannot be resumed through this session. If capacity is full, your current campaign is preserved.':'This replaces the current local campaign. Its progress cannot be continued afterward. No public account is affected.'}</p><div className="controls"><button disabled={busy} onClick={onConfirm}>Replace save · New Game</button><button disabled={busy} onClick={onCancel}>Keep existing save</button></div></section>:<div className="entry-controls"><button disabled={busy||!save||!!save.error||!!save.closing} onClick={onNew}>{(adapter.mode==='sandbox'||playableTestnet)?'Begin the Night':'Open contract inspection'}</button><button disabled={busy||!save?.valid} onClick={onContinue}>{save?.closing?'Check settlement':save?.closed&&save.valid?'Review ending':'Continue'}</button></div>}
    <p role="status" className={busy||error||save?.error?'entry-alert':undefined}>{busy?'Opening the court. Waiting for the saved state…':error||save?.error||(!save?'Checking for a saved campaign…':save.closed?'Campaign archived. Begin a new game when ready.':save.closing?'Campaign settlement is pending. Check settlement to resume safely.':save.valid?`Saved campaign · Night ${Math.min(7,(save.night??0)+1)}`:'No saved campaign.')}</p><small>{runtimeDescription(adapter.mode,playableTestnet)}</small></section>{playableTestnet&&save?.inactivityMs&&<aside className="expiration-note"><strong>The night waits for no one.</strong><p>Campaigns close after 24 hours of inactivity. Their recorded outcome is preserved, but they cannot be resumed.</p></aside>}</main>;
}
export function Prologue({progress,onAdvance,waiting=false,arrival=false}:{progress:IntroProgress;onAdvance:(skip:boolean)=>void;waiting?:boolean;arrival?:boolean}){
  const heading=useRef<HTMLHeadingElement>(null),passage=arrival?FIRST_NIGHT_PRELUDE:PROLOGUE[progress.line];
  useEffect(()=>{heading.current?.focus();},[progress.line,arrival]);
  useEffect(()=>{if(performance.getEntriesByName('night:entry-start').length)requestAnimationFrame(()=>requestAnimationFrame(()=>{const measure=performance.measure('night:prologue-visible','night:entry-start');if(import.meta.env.DEV)console.info('[startup-prologue]',Math.round(measure.duration*10)/10);}));},[]);
  return <main className={`prologue panel-${progress.line}`} key={arrival?'arrival':progress.line}>{arrival?<figure className="portrait environment-portrait"><RoomArt room="crypt"/><figcaption>PROVISIONAL GENERATED INTERIOR · APPROVAL PENDING</figcaption></figure>:<Portrait actor={passage.actor}/>}<section><p className="eyebrow">{arrival?'Before Night One':`Prologue · ${progress.line+1} / ${PROLOGUE.length}`}</p><h1 ref={heading} tabIndex={-1}>{passage.title}</h1><p className="prologue-text" aria-live="polite">{passage.text}</p><small>Dialogue is free. These controls make no political commitment.</small>{waiting&&<p role="status">{initializationDescription(adapter.mode,playableTestnet)}</p>}</section><div className="controls prologue-controls" aria-label="Prologue navigation"><button disabled={waiting&&(arrival?progress.arrivalDone:progress.done)} onClick={()=>onAdvance(false)}>Continue</button><button disabled={waiting&&(arrival?progress.arrivalDone:progress.done)} onClick={()=>onAdvance(true)}>{arrival?'Skip scene':'Skip intro'}</button></div></main>;
}
export function GameEntry({children}:{children:(result:Result,onTitle:()=>void)=>ReactNode}){
  const [save,setSave]=useState<SaveStatus|null>(null),[result,setResult]=useState<Result|null>(null),[intro,setIntro]=useState<IntroProgress|null>(null);
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[confirm,setConfirm]=useState(false);
  const lock=useRef(false),opening=useRef(false),pendingIntro=useRef<IntroProgress|null>(null);
  useEffect(()=>{if(result&&opening.current){opening.current=false;performance.mark('night:entry-committed');performance.measure('night:entry-render','night:state-ready','night:entry-committed');requestAnimationFrame(()=>requestAnimationFrame(()=>{performance.mark('night:entry-painted');performance.measure('night:entry-total','night:entry-start','night:entry-painted');if(import.meta.env.DEV)console.info('[startup]',JSON.stringify(performance.getEntriesByType('measure').filter(e=>e.name.startsWith('night:')).map(e=>({name:e.name,ms:Math.round(e.duration*10)/10}))));}));}},[result]);
  async function check(){
    if(adapter.mode!=='sandbox'&&!playableTestnet){setSave({exists:false,valid:false});return;}
    try{const response=await fetch('/api/save',{cache:'no-store'});if(!response.ok)throw new Error();setSave(await response.json());}
    catch{setSave({exists:false,valid:false,error:'Saved campaign could not be checked. Reload to retry; nothing has been replaced.'});}
  }
  useEffect(()=>{void check();},[]);
  function store(id:string,p:IntroProgress){try{localStorage.setItem(`night-intro:v1:${id}`,JSON.stringify(p));}catch{/* Narrative can replay if browser storage is disabled; gameplay cannot. */}}
  async function open(fresh:boolean){
    if(lock.current)return;performance.mark('night:entry-start');opening.current=true;lock.current=true;setBusy(true);setError('');
    try{
      let current=save!;
      if(adapter.mode==='sandbox'||playableTestnet){
        const response=await fetch('/api/save',{cache:'no-store'});if(!response.ok)throw new Error('Saved campaign could not be checked.');
        current=await response.json();
        if(fresh&&current.exists&&!current.closed&&(!confirm||current.id!==save?.id)){setSave(current);setConfirm(true);return;}
      }
      performance.mark('night:metadata-ready');performance.measure('night:metadata','night:entry-start','night:metadata-ready');
      if(fresh){pendingIntro.current={line:0,done:false,arrivalDone:false};setIntro(pendingIntro.current);}
      const next=await loadEntryCampaign(fresh,current,async action=>{const start=performance.now();const response=await adapter.request(action);performance.measure(`night:request:${action.action}`,{start,end:performance.now()});return response;});
      performance.mark('night:state-ready');
      let progress:IntroProgress|null=null;
      if(next.campaign&&!next.closure){
        if(fresh){progress=pendingIntro.current??{line:0,done:false,arrivalDone:false};store(next.campaign.id,progress);}
        else{try{progress=readIntro(localStorage.getItem(`night-intro:v1:${next.campaign.id}`));if(next.campaign.night>0&&progress){progress={...progress,done:true,arrivalDone:true};store(next.campaign.id,progress);}}catch{}}
      }
      setIntro(progress);setResult(next);setConfirm(false);
    }catch(e){setIntro(null);pendingIntro.current=null;setError(String(e));void check();}
    finally{lock.current=false;setBusy(false);}
  }
  if(intro&&!intro.done)return <Prologue progress={intro} waiting={!result} onAdvance={skip=>{const next=advanceIntro(intro,skip);pendingIntro.current=next;setIntro(next);if(result?.campaign)store(result.campaign.id,next);}}/>;
  if(intro&&(intro.arrivalDone===false||intro.arrivalDone===true&&!result))return <Prologue progress={intro} arrival waiting={!result} onAdvance={()=>{const next={...intro,arrivalDone:true};pendingIntro.current=next;setIntro(next);if(result?.campaign)store(result.campaign.id,next);}}/>;
  if(!result)return <TitleScreen save={save} busy={busy} error={error} confirm={confirm} onNew={()=>requiresReplacementConfirmation(save)?setConfirm(true):void open(true)} onContinue={()=>void open(false)} onCancel={()=>setConfirm(false)} onConfirm={()=>void open(true)}/>;
  return children(result,()=>{setResult(null);setIntro(null);setConfirm(false);setError('');setSave(null);void check();});
}

