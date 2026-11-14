import React, {useEffect,useRef,useState} from 'react';

import {createRoot} from 'react-dom/client';

import {adapter, playableTestnet, type Action, type Result} from './chain';

import './style.css';

import {CHAPTERS,ROLEPLAY_LABELS} from './livingCourt';





import {courtReactions} from './reactiveCourt';

import {EncounterDirector,BloodStatus} from './VampireEncounter';

import {GameEntry} from './GameEntry';
import {bloodWarning} from './blood';
import {CampaignFinale} from './CampaignFinale';

import {buildEncounterScenes} from './encounters';

import {navigationGuidance} from './navigation';

import {InspectionOverlay,SceneSurface,type Inspection} from './GameInspection';



function App({initialResult,onTitle}:{initialResult:Result;onTitle:()=>void}){

  const [sceneRequest,setSceneRequest]=useState<{id:string;serial:number}|null>(null);

  const openScene=(id:string)=>setSceneRequest(previous=>({id,serial:(previous?.serial??0)+1}));

  const [state,setState]=useState<Result|null>(initialResult),[busy,setBusy]=useState(''),[message,setMessage]=useState(''),[debug,setDebug]=useState('');


  const [inspection,setInspection]=useState<Inspection|null>(null);

  const [menuOpen,setMenuOpen]=useState(false),[confirmQuit,setConfirmQuit]=useState(false),[quitRequested,setQuitRequested]=useState(false);
  const menuHeading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(menuOpen)menuHeading.current?.focus();},[menuOpen,confirmQuit]);
  useEffect(()=>{if(state?.closure?.reason==='quit'&&state.closure.complete&&!state.pending&&state.archiveCommitment)onTitle();},[state,onTitle]);

  const pending=useRef(false),sceneHeading=useRef<HTMLHeadingElement>(null);

  const world=state?.world, sandbox=adapter.mode==='sandbox',local=adapter.mode==='local';

  const campaign=state?.campaign;

  const developments=state?courtReactions(state):[];






  async function act(action:Action){

    if(pending.current)return null;

    pending.current=true;setBusy(action.action);setMessage('');setDebug('');

    try{

      const result=await adapter.request({...action,campaign_id:state?.campaign?.id,revision:state?.campaign?.revision});setState(result);
      if(action.action==='view'&&!result.pending&&!result.closure)setQuitRequested(false);

      if(result.error){

        setDebug(result.error);

        setMessage((action.action==='game'||action.action==='end_night')&&!result.error.includes('panicked')?result.error.replace(/^Error: /,''):action.action==='enter'?'The door remains closed. You do not currently hold permission to use this room.':action.action==='accept'?'The agreement could not be completed. Check its current status before trying again.':'The court could not complete this action. Your current rights are shown below.');



      }else{

        const messages:Record<Action['action'],string>={quit:'Quit requested. Waiting for verified settlement and reclamation.',agreement_accept:'The bargain stands. Your invitation is ready.',agreement_reject:'Proposal declined. No transaction or relationship penalty.',game:'Your choice is made. The court has answered.',end_night:'Dawn resolves. The reckoning is recorded.',view:'Your castle is ready. Review tonight’s choices or speak with the court.',reset:'A new night begins. Your Crypt privilege and Library are yours; Seraphine awaits your decision.',accept:'The lease is confirmed and your rent is in escrow. The Lounge is open. Vesper has heard of your agreement. She chooses her response at dawn.',reject:'You decline. No rent was paid. Vesper leaves your Crypt privilege intact, but the Lounge remains closed.',continue:'Vesper withdraws your Crypt privilege. Your Lounge lease and Library remain yours.',settle:'Seraphine has received the agreed rent. Your lease rights are unchanged.',enter:'',grant:'Vesper grants you shelter in the Crypt.',revoke:'Vesper has withdrawn your Crypt privilege.'};

        setMessage(result.closure&&!result.closure.complete?'Settlement and slot reclamation are still pending. Check settlement to resume safely.':messages[action.action]);

        if(action.action==='reset'){setSceneRequest(null);}

      }

      if(!result.error&&!result.pending&&result.campaign&&state?.campaign&&result.campaign.night>state.campaign.night){setInspection(null);setSceneRequest(null);}

      return result;

    }catch(error){

      setDebug(String(error));setState(null);

      setMessage('The castle could not confirm the outcome. Use Recover current state to recover its current state before trying again.');

      return null;

    }finally{pending.current=false;setBusy('');}

  }



  const settling=quitRequested||!!state?.closure&&!state.closure.complete;
  const disabled=!!busy||!world||!!state?.pending||!!state?.closure||settling||menuOpen;

  const guidance=state?navigationGuidance(state):{situation:'Recover the current castle state before choosing.',leads:[]};


  function actionScene(kind:string){openScene(`action:${kind}`);}

  if(state&&campaign&&campaign.status!=='playing'&&!['quit','abandoned'].includes(state.closure?.reason??''))return <CampaignFinale key={campaign.id} result={state} busy={!!busy} requireArchive={playableTestnet} onReplay={onTitle} onRefresh={()=>void act({action:'view'})}/>;
  const exploration=<SceneSurface>

    <header className="game-hud"><button disabled={!!busy||settling} onClick={()=>playableTestnet?setMenuOpen(true):onTitle()}>Main menu</button>{campaign&&<><span>Night {Math.min(7,campaign.night+1)}/7</span><BloodStatus result={state!}/><span>Action {campaign.actionsLeft}/{campaign.actionLimit??3}</span>{!campaign.politics&&state&&bloodWarning(state,{action:'end_night'})&&<span className="blood-warning">{bloodWarning(state,{action:'end_night'})}</span>}{!campaign.politics&&<button disabled={disabled||campaign.status!=='playing'||!!state?.availability?.end_night.length} onClick={()=>void act({action:'end_night'})}>End night / Pass</button>}</>}</header>
    {menuOpen&&<section className="notice" aria-label="Game menu"><h2 ref={menuHeading} tabIndex={-1}>{confirmQuit?'Quit this campaign?':'Game menu'}</h2>{confirmQuit?<><p>This permanently ends this campaign. Your history is kept. Existing payments and obligations must settle before its slot is released. You cannot resume after confirming.</p><button disabled={!!busy||settling||!!state?.pending||!!state?.error} onClick={()=>{setQuitRequested(true);setMenuOpen(false);setConfirmQuit(false);void act({action:'quit'});}}>Confirm Quit Campaign</button><button onClick={()=>setConfirmQuit(false)}>Keep playing</button></>:<><button onClick={onTitle}>Save and return to title</button><button disabled={!!busy||settling||!campaign||campaign.status!=='playing'||!!state?.pending||!!state?.error||!!state?.closure} onClick={()=>setConfirmQuit(true)}>Quit Campaign</button><button onClick={()=>setMenuOpen(false)}>Back to game</button></>}</section>}
    {settling&&<section role="status" className="notice"><p>{state?.closure?'Campaign closure is recorded. Settlement and slot reclamation are not yet confirmed.':'Quit outcome is not yet confirmed. Gameplay is paused while you check its status.'} Your history and financial obligations are preserved.</p><button disabled={!!busy} onClick={()=>void act({action:'view'})}>{busy?'Checking settlement…':'Check settlement'}</button></section>}
    {state?.closure?.complete&&<p role="status" className="notice">This campaign is closed{state.closure.reason==='quit'?' at your request':state.closure.reason==='abandoned'?' after its inactivity deadline':' after defeat'}. Its active slot has been reclaimed and the original gameplay record is preserved.</p>}


    <details className="court-records"><summary>Court records</summary><nav className="inspection-nav" aria-label="Secondary information">{(['Rights','Bloodline','Relationships','Chronicle','Diagnostics'] as Inspection[]).map(kind=><button key={kind} onClick={()=>setInspection(kind)}>{kind}</button>)}</nav></details>

    <p className="scene-status" role="status">{busy?'The court weighs your decision…':message}</p>

    {!state?<section><h1 tabIndex={-1}>Awaiting the castle</h1><button disabled={!!busy} onClick={()=>void act({action:'view'})}>Recover current state</button></section>:<section className="castle-view" aria-label="Castle exploration">

      <div className="castle-architecture"><h1 ref={sceneHeading} tabIndex={-1}>The castle</h1><div className="castle-map"><img src="/art/castle-cutaway.png" alt="Castle cutaway: Lounge and Library above the Crypt."/></div></div>

      <aside className="scene-guidance"><p className="eyebrow">Current situation</p><h2>{campaign?.status==='playing'?(campaign.politics?.library?CHAPTERS[campaign.night].title:'Choose your next allegiance'):'Your political position'}</h2><p>{guidance.situation}</p><details className="court-developments"><summary>Word from the court</summary>{developments.slice(-3).reverse().map(u=><button key={u.id} onClick={()=>openScene(u.id)}>{u.title}<small>{u.level} · read freely</small></button>)}</details><h3>Tonight</h3>{guidance.leads.map((lead,i)=><button key={i} disabled={disabled} onClick={()=>openScene(lead.scene??(lead.room?`record:${lead.room}`:`character:${lead.actor}`))}>{lead.label}</button>)}


      {campaign&&campaign.status!=='playing'&&<button onClick={()=>openScene(buildEncounterScenes(state).find(s=>s.type==='CAMPAIGN CONCLUSION')!.id)}>Review conclusion</button>}

      </aside>

    </section>}

    {!campaign&&state&&<section className="legacy-controls"><p>{state.proof} · original contract inspection mode</p>{local&&<><button disabled={disabled} onClick={()=>void act({action:'grant'})}>Vesper: grant Crypt access</button><button disabled={disabled} onClick={()=>void act({action:'revoke'})}>Vesper: revoke her grant</button></>}{sandbox&&<><button disabled={disabled||!!state.availability?.accept.length} onClick={()=>void act({action:'accept'})}>Accept standing lease · 0.02 Sandbox NEAR</button><button disabled={disabled||!!state.availability?.reject.length} onClick={()=>void act({action:'reject'})}>Reject standing lease</button>{state.phase==='retaliation_pending'&&<button disabled={disabled} onClick={()=>void act({action:'continue'})}>Face Vesper</button>}<button disabled={disabled} onClick={()=>void act({action:'settle'})}>Settle rent</button></>}</section>}

    {inspection&&<InspectionOverlay kind={inspection} result={state} debug={debug} onClose={()=>setInspection(null)} onScene={openScene} onAction={action=>void act(action)}/>}

  </SceneSurface>;

  return state?.campaign&&!state.closure&&!quitRequested&&!menuOpen?<EncounterDirector key={state.campaign.id} result={state} busy={!!busy} request={sceneRequest} onRequestHandled={serial=>setSceneRequest(current=>current?.serial===serial?null:current)} onCastleMap={()=>{setSceneRequest(null);}} onAction={act}>{exploration}</EncounterDirector>:exploration;

}

createRoot(document.getElementById('root')!).render(<GameEntry>{(result,onTitle)=><App initialResult={result} onTitle={onTitle}/>}</GameEntry>);

