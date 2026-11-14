import {useEffect,useRef,useState} from 'react';
import type {Result} from './chain';
import {buildEncounterScenes,readSceneMemory} from './encounters';
import {endingConsequences,endingSummary} from './livingCourt';
import {canReplayCampaign} from './entry';
import {Portrait} from './visuals';
import {AGENTS} from './agents';
import {personalFinale,readFinaleMemory} from './courtPayoff';

export function CampaignFinale({result,busy,requireArchive,onReplay,onRefresh}:{result:Result;busy:boolean;requireArchive:boolean;onReplay:()=>void;onRefresh:()=>void}){
  const [reviewing,setReviewing]=useState(false);
  const memoryKey=`night-farewell:v1:${result.campaign!.id}`;
  const [memory,setMemory]=useState(()=>{try{return readFinaleMemory(localStorage.getItem(memoryKey));}catch{return readFinaleMemory(null);}});
  const [relationships]=useState(()=>{try{return readSceneMemory(localStorage.getItem(`night-scenes:v1:${result.campaign!.id}`)).relationships;}catch{return undefined;}});
  const farewell=personalFinale(result,relationships);
  const response=farewell?.responses.find(choice=>choice.id===memory.response);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus();},[memory.response,memory.done]);
  useEffect(()=>{try{localStorage.setItem(memoryKey,JSON.stringify(memory));}catch{/* Browser-only reading progress; campaign state is unaffected. */}},[memoryKey,memory]);
  const campaign=result.campaign!;
  const scene=buildEncounterScenes(result,relationships).find(s=>s.type==='CAMPAIGN CONCLUSION');
  const recorded=endingConsequences(result);
  const consequences=[...new Set(campaign.politics?.finalCourt?.result?[...recorded.slice(-2),...recorded]:recorded)].slice(0,3);
  const ready=canReplayCampaign(result,requireArchive);
  if(result.pending||result.error)return <main className="campaign-finale"><section className="finale-copy"><h1 ref={heading} tabIndex={-1}>The final record is being checked</h1><p>No farewell assumes an unconfirmed outcome.</p><button disabled={busy} onClick={onRefresh}>Check confirmed outcome</button></section></main>;
  if(farewell&&!memory.done)return <main className="campaign-finale">
    <Portrait actor={farewell.actor}/>
    <section className="finale-copy">
      <p className="eyebrow">{AGENTS[farewell.actor].name} · Closing correspondence</p>
      <h1 ref={heading} tabIndex={-1}>{farewell.title}</h1>
      <p className="finale-epilogue">{response?.reply??farewell.opening}</p>
      {!response&&<>{farewell.account.map(text=><p key={text}>{text}</p>)}<p>Your reply is free. It changes no rights, relationships or recorded outcome.</p></>}
      <div className="controls">{response?<button onClick={()=>setMemory(m=>({...m,done:true}))}>Read the recorded ending</button>:farewell.responses.map(choice=><button key={choice.id} onClick={()=>setMemory({response:choice.id,done:false})}>{choice.label}</button>)}{!response&&<button onClick={()=>setMemory(m=>({...m,done:true}))}>Leave these words unanswered</button>}</div>
      <details><summary>Inspect the recorded consequences</summary><p>{campaign.reason}</p>{endingConsequences(result).map(text=><p key={text}>{text}</p>)}<p>Authored correspondence interprets the record; it is not an on-chain action.</p><ul>{result.world.grants.filter(g=>['library','court','passage'].includes(g.property_id)).map(g=><li key={g.id}>Grant {g.id}: {g.grantor} → {g.grantee}; {g.property_id}; parent {g.parent_grant_id??'independent'}; effective {String(result.world.grant_validity?.[result.world.grants.indexOf(g)]??false)}</li>)}</ul>{result.transactions?.map(t=><p key={t.hash}>{t.action}: {t.hash} · {t.success?'confirmed success':'not confirmed successful'}</p>)}</details>
    </section>
  </main>;
  return <main className="campaign-finale">
    {scene?.portraits[0]&&<Portrait actor={scene.portraits[0]}/>}
    <section className="finale-copy">
      <p className="eyebrow">CAMPAIGN COMPLETE</p>
      <h1 ref={heading} tabIndex={-1}>{scene?.title??'The chronicle closes'}</h1>
      <p className="finale-epilogue">{scene?.lines[0]?.text??campaign.reason}</p>
      <p>{campaign.politics?.library?endingSummary(result):campaign.reason}</p>
      {consequences.length>0&&<section aria-label="The choices that remain"><h2>What you leave behind</h2>{consequences.map(text=><p key={text}>{text}</p>)}</section>}
      <div className="controls"><button aria-expanded={reviewing} onClick={()=>setReviewing(v=>!v)}>{reviewing?'Close Your Chronicle':'Review Your Chronicle'}</button><button className="binding-choice" disabled={busy||!ready} onClick={onReplay}>Begin Another Campaign</button></div>
      {reviewing&&<section aria-label="Your chronicle"><h2>Your chronicle</h2>{buildEncounterScenes(result,relationships).filter(s=>s.type==='RECKONING').map(s=><details key={s.id}><summary>{s.title}</summary>{s.lines.map((line,i)=><p key={i}>{line.text}</p>)}</details>)}<details><summary>Your recorded decisions</summary>{campaign.events.map((event,i)=><p key={i}>{event}</p>)}</details></section>}
      {!ready&&<div role="status"><p>Your story is complete. Its payments and archive are still being verified; a new campaign must wait.</p><button disabled={busy} onClick={onRefresh}>{busy?'Checking settlement…':'Check settlement'}</button></div>}
    </section>
  </main>;
}
