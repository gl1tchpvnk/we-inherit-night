import {useEffect,useRef,useState} from 'react';
import type {Result} from './chain';
import {buildEncounterScenes} from './encounters';
import {endingConsequences,endingSummary} from './livingCourt';
import {canReplayCampaign} from './entry';
import {Portrait} from './visuals';

export function CampaignFinale({result,busy,requireArchive,onReplay,onRefresh}:{result:Result;busy:boolean;requireArchive:boolean;onReplay:()=>void;onRefresh:()=>void}){
  const [reviewing,setReviewing]=useState(false);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus();},[]);
  const campaign=result.campaign!;
  const scene=buildEncounterScenes(result).find(s=>s.type==='CAMPAIGN CONCLUSION');
  const recorded=endingConsequences(result);
  const consequences=[...new Set(campaign.politics?.finalCourt?.result?[...recorded.slice(-2),...recorded]:recorded)].slice(0,3);
  const ready=canReplayCampaign(result,requireArchive);
  return <main className="campaign-finale">
    {scene?.portraits[0]&&<Portrait actor={scene.portraits[0]}/>}
    <section className="finale-copy">
      <p className="eyebrow">CAMPAIGN COMPLETE</p>
      <h1 ref={heading} tabIndex={-1}>{scene?.title??'The chronicle closes'}</h1>
      <p className="finale-epilogue">{scene?.lines[0]?.text??campaign.reason}</p>
      <p>{campaign.politics?.library?endingSummary(result):campaign.reason}</p>
      {consequences.length>0&&<section aria-label="The choices that remain"><h2>What you leave behind</h2>{consequences.map(text=><p key={text}>{text}</p>)}</section>}
      <div className="controls"><button aria-expanded={reviewing} onClick={()=>setReviewing(v=>!v)}>{reviewing?'Close Your Chronicle':'Review Your Chronicle'}</button><button className="binding-choice" disabled={busy||!ready} onClick={onReplay}>Begin Another Campaign</button></div>
      {reviewing&&<section aria-label="Your chronicle"><h2>Your chronicle</h2>{buildEncounterScenes(result).filter(s=>s.type==='RECKONING').map(s=><details key={s.id}><summary>{s.title}</summary>{s.lines.map((line,i)=><p key={i}>{line.text}</p>)}</details>)}<details><summary>Your recorded decisions</summary>{campaign.events.map((event,i)=><p key={i}>{event}</p>)}</details></section>}
      {!ready&&<div role="status"><p>Your story is complete. Its payments and archive are still being verified; a new campaign must wait.</p><button disabled={busy} onClick={onRefresh}>{busy?'Checking settlement…':'Check settlement'}</button></div>}
    </section>
  </main>;
}
