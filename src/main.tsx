import React, {useEffect,useRef,useState} from 'react';

import {createRoot} from 'react-dom/client';

import {adapter, type Action, type Result} from './chain';

import './style.css';

import {CHAPTERS,ROLEPLAY_LABELS,roomDevelopment} from './livingCourt';

import {Portrait,RoomArt} from './visuals';

import {AGENTS} from './agents';

import {courtReactions} from './reactiveCourt';

import {EncounterDirector} from './VampireEncounter';

import {GameEntry} from './GameEntry';

import {buildEncounterScenes,readSceneMemory} from './encounters';

import {ROOMS,roomActions,roomDenial,resumeRoom,navigationGuidance,type RoomId} from './navigation';

import {InspectionOverlay,SceneSurface,type Inspection} from './GameInspection';



function App({initialResult,onTitle}:{initialResult:Result;onTitle:()=>void}){

  const [sceneRequest,setSceneRequest]=useState<{id:string;serial:number}|null>(null);

  const openScene=(id:string)=>setSceneRequest(previous=>({id,serial:(previous?.serial??0)+1}));

  const [state,setState]=useState<Result|null>(initialResult),[busy,setBusy]=useState(''),[message,setMessage]=useState(''),[debug,setDebug]=useState('');

  const [restored]=useState(()=>{let room:unknown=null;try{room=readSceneMemory(localStorage.getItem(`night-scenes:v1:${initialResult.campaign?.id}`)).room;}catch{}return resumeRoom(room,initialResult);});

  const [roomId,setRoomId]=useState<RoomId|null>(restored.room),[inspection,setInspection]=useState<Inspection|null>(null);

  const [discovery,setDiscovery]=useState(restored.reason);

  const pending=useRef(false),sceneHeading=useRef<HTMLHeadingElement>(null);

  const world=state?.world, sandbox=adapter.mode==='sandbox',local=adapter.mode==='local';

  const campaign=state?.campaign;

  const developments=state?courtReactions(state):[];

  const room=ROOMS.find(r=>r.id===roomId);

  const roomStory=room&&state?.campaign?.politics?.library?roomDevelopment(state,room.id):null;

  useEffect(()=>{if(state&&roomId&&!state.world.access[roomId]){setRoomId(null);setMessage('Room access has changed. You have returned to the castle.');}},[state,roomId]);

  useEffect(()=>{sceneHeading.current?.focus();},[roomId]);

  async function act(action:Action){

    if(pending.current)return null;

    pending.current=true;setBusy(action.action);setMessage('');setDebug('');

    try{

      const result=await adapter.request({...action,campaign_id:state?.campaign?.id,revision:state?.campaign?.revision});setState(result);

      if(result.error){

        setDebug(result.error);

        setMessage((action.action==='game'||action.action==='end_night')&&!result.error.includes('panicked')?result.error.replace(/^Error: /,''):action.action==='enter'?'The door remains closed. You do not currently hold permission to use this room.':action.action==='accept'?'The agreement could not be completed. Check its current status before trying again.':'The court could not complete this action. Your current rights are shown below.');

        if(action.action==='enter'){setRoomId(null);setDiscovery('');}

      }else{

        const messages:Record<Action['action'],string>={agreement_accept:'The bargain stands. Your invitation is ready.',agreement_reject:'Proposal declined. No transaction or relationship penalty.',game:'Your choice is made. The court has answered.',end_night:'Dawn resolves. The reckoning is recorded.',view:'Your castle is ready. Explore a room, then speak with Seraphine in the court.',reset:'A new night begins. Your Crypt privilege and Library are yours; Seraphine awaits your decision.',accept:'The lease is confirmed and your rent is in escrow. The Lounge is open. Vesper has heard of your agreement. She chooses her response at dawn.',reject:'You decline. No rent was paid. Vesper leaves your Crypt privilege intact, but the Lounge remains closed.',continue:'Vesper withdraws your Crypt privilege. Your Lounge lease and Library remain yours.',settle:'Seraphine has received the agreed rent. Your lease rights are unchanged.',enter:'',grant:'Vesper grants you shelter in the Crypt.',revoke:'Vesper has withdrawn your Crypt privilege.'};

        setMessage(messages[action.action]);

        if(action.action==='enter'){

          const selected=ROOMS.find(r=>r.id===action.property_id);

          setRoomId(action.property_id as RoomId);setDiscovery('');

          setMessage(`You enter the ${selected?.name}.`);

        }

        if(action.action==='reset'){setSceneRequest(null);setRoomId(null);setDiscovery('');}

      }

      if(!result.error&&!result.pending&&result.campaign&&state?.campaign&&result.campaign.night>state.campaign.night){setRoomId(null);setDiscovery('');setInspection(null);setSceneRequest(null);}

      return result;

    }catch(error){

      setDebug(String(error));setState(null);setRoomId(null);setDiscovery('');

      setMessage('The castle could not confirm the outcome. Use Recover current state to recover its current state before trying again.');

      return null;

    }finally{pending.current=false;setBusy('');}

  }



  const disabled=!!busy||!world||!!state?.pending;

  const guidance=state?navigationGuidance(state):{situation:'Recover the current castle state before choosing.',leads:[]};

  function enter(id:RoomId){if(!state)return;const reason=roomDenial(state,id);if(reason){setMessage(reason);const update=developments.filter(u=>u.room===id&&u.level==='major').at(-1);if(update)openScene(update.id);return;}void act({action:'enter',property_id:id});}

  function actionScene(kind:string){openScene(`action:${kind}`);}

  const exploration=<SceneSurface>

    <header className="game-hud"><button disabled={!!busy} onClick={onTitle}>Main menu</button>{campaign&&<><span>Night {Math.min(7,campaign.night+1)}/7</span><span>Blood {campaign.resources.blood}/12</span><span>Exposure {campaign.resources.exposure}/10</span><span>Action {campaign.actionsLeft}/{campaign.actionLimit??3}</span><button disabled={disabled||campaign.status!=='playing'||!!state?.availability?.end_night.length} onClick={()=>void act({action:'end_night'})}>End night / Pass</button></>}</header>

    {campaign?.politics&&campaign.status==='playing'&&<nav className="story-nav" aria-label="Nightly phases"><button disabled={disabled} onClick={()=>openScene(`discovery:${campaign.night}`)}>Hear the court</button><button className="binding-choice" disabled={disabled} onClick={()=>openScene(`decision:${campaign.night}`)}>Choose this night</button></nav>}

    <details className="court-records"><summary>Court records</summary><nav className="inspection-nav" aria-label="Secondary information">{(['Rights','Bloodline','Relationships','Chronicle','Diagnostics'] as Inspection[]).map(kind=><button key={kind} onClick={()=>setInspection(kind)}>{kind}</button>)}</nav></details>

    <p className="scene-status" role="status">{busy?'The court weighs your decision…':message||discovery}</p>

    {!state?<section><h1 tabIndex={-1}>Awaiting the castle</h1><button disabled={!!busy} onClick={()=>void act({action:'view'})}>Recover current state</button></section>:room?<section className={`room-view room-${room.id}`} aria-label={`${room.name} room`}>

      <div className="room-plate"><RoomArt room={room.id}/><small className="art-note">Provisional generated interior · approval pending</small><h1 ref={sceneHeading} tabIndex={-1}>{room.name}</h1><p>{roomStory?.text??room.description}</p><button disabled={!!busy} onClick={()=>{setRoomId(null);setDiscovery('');setMessage('');}}>Return to castle</button></div>

      <div className="room-interactions"><p className="eyebrow">Voices of the court</p><h2>Who will you trust?</h2><p>Send for someone involved in this matter. A conversation makes no promise and places nobody in this room.</p>{roomStory&&<button onClick={()=>openScene(roomStory.scene)}>Read what has changed here</button>}<div className="room-contacts">{(roomStory?.contacts??room.contacts).filter(actor=>campaign?.npcs[actor]).map(actor=><button disabled={disabled} key={actor} onClick={()=>openScene(`character:${actor}`)}><Portrait actor={actor} compact/><span>Contact {AGENTS[actor].name} · free</span></button>)}</div>

      <div aria-label="Developments in this room">{developments.filter(u=>u.room===room.id).slice(-3).reverse().map(u=><button key={u.id} onClick={()=>openScene(u.id)}>{u.title}<small>{u.level} · read freely</small></button>)}</div>

      <div className="context-actions">{roomActions(state,room.id).filter(a=>a.allowed).map(a=><button key={a.kind} disabled={disabled} onClick={()=>actionScene(a.kind)}>{a.label}<small>{a.cost.majorActions?'Inspect commitment':'Free information'}</small></button>)}</div>

      <details><summary>Unavailable interactions</summary>{roomActions(state,room.id).filter(a=>!a.allowed).map(a=><p key={a.kind}>{a.label}: {a.reasons.join(' ')}</p>)}</details>

      <button onClick={()=>setInspection('Rights')}>Inspect this room’s authority</button></div>

    </section>:<section className="castle-view" aria-label="Castle exploration">

      <div className="castle-architecture"><h1 ref={sceneHeading} tabIndex={-1}>The castle</h1><div className="castle-map"><img src="/art/castle-cutaway.png" alt="Castle cutaway: Lounge and Library above the Crypt."/><div className="castle-hotspots">{ROOMS.map(r=><button className={`architectural-hotspot hotspot-${r.id} ${world?.access[r.id]?'permitted':'restricted'}`} disabled={disabled||adapter.mode==='testnet'} key={r.id} onClick={()=>enter(r.id)} aria-label={`${r.name} · ${world?.access[r.id]?'Enter':'Access restricted; inspect reason'}`}><span>{r.id==='crypt'?'Crypt':r.id==='library'?'Library':'Lounge'}</span><small>{world?.access[r.id]?'Enter':'Restricted'}</small></button>)}</div></div></div>

      <aside className="scene-guidance"><p className="eyebrow">Current situation</p><h2>{campaign?.status==='playing'?(campaign.politics?.library?CHAPTERS[campaign.night].title:'Choose your next allegiance'):'Your political position'}</h2><p>{guidance.situation}</p><div aria-label="Court developments">{developments.slice(-3).reverse().map(u=><button key={u.id} onClick={()=>openScene(u.id)}>{u.title}<small>{u.level} · read freely</small></button>)}</div><h3>Possible next steps</h3>{guidance.leads.map((lead,i)=><button key={i} disabled={disabled} onClick={()=>lead.room?enter(lead.room):openScene(lead.scene??`character:${lead.actor}`)}>{lead.label}</button>)}

      <details><summary>Attend to yourself</summary>{state.actions?.filter(a=>['feed','rest','conceal'].includes(a.kind)).map(a=><div key={a.kind}><button disabled={disabled||!a.allowed} onClick={()=>actionScene(a.kind)}>{ROLEPLAY_LABELS[a.kind as keyof typeof ROLEPLAY_LABELS]??a.label}</button>{!a.allowed&&<small>{a.reasons.join(' ')}</small>}</div>)}</details>

      {campaign&&campaign.status!=='playing'&&<button onClick={()=>openScene(buildEncounterScenes(state).find(s=>s.type==='CAMPAIGN CONCLUSION')!.id)}>Review conclusion</button>}

      </aside>

    </section>}

    {!campaign&&state&&<section className="legacy-controls"><p>{state.proof} · original contract inspection mode</p>{local&&<><button disabled={disabled} onClick={()=>void act({action:'grant'})}>Vesper: grant Crypt access</button><button disabled={disabled} onClick={()=>void act({action:'revoke'})}>Vesper: revoke her grant</button></>}{sandbox&&<><button disabled={disabled||!!state.availability?.accept.length} onClick={()=>void act({action:'accept'})}>Accept standing lease · 0.02 Sandbox NEAR</button><button disabled={disabled||!!state.availability?.reject.length} onClick={()=>void act({action:'reject'})}>Reject standing lease</button>{state.phase==='retaliation_pending'&&<button disabled={disabled} onClick={()=>void act({action:'continue'})}>Face Vesper</button>}<button disabled={disabled} onClick={()=>void act({action:'settle'})}>Settle rent</button></>}</section>}

    {inspection&&<InspectionOverlay kind={inspection} result={state} debug={debug} onClose={()=>setInspection(null)} onScene={openScene} onAction={action=>void act(action)}/>}

  </SceneSurface>;

  return state?.campaign?<EncounterDirector key={state.campaign.id} result={state} busy={!!busy} request={sceneRequest} room={roomId} onAction={act}>{exploration}</EncounterDirector>:exploration;

}

createRoot(document.getElementById('root')!).render(<GameEntry>{(result,onTitle)=><App initialResult={result} onTitle={onTitle}/>}</GameEntry>);

