import {useEffect,useRef,useState,type ReactNode} from 'react';

import type {Action,Result} from './chain';

import {Portrait,PORTRAIT_ASSETS} from './visuals';

import {AGENTS} from './agents';

import {politicalRelationship} from './reactiveCourt';

import {buildEncounterScenes} from './encounters';

import type {NpcName} from './game';

export type Inspection='Rights'|'Bloodline'|'Relationships'|'Chronicle'|'Diagnostics';

export function InspectionOverlay({kind,result,debug,onClose,onScene,onAction}:{kind:Inspection;result:Result|null;debug:string;onClose:()=>void;onScene:(id:string)=>void;onAction:(action:Action)=>void}){

 const dialog=useRef<HTMLDialogElement>(null),heading=useRef<HTMLHeadingElement>(null);

 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;dialog.current?.showModal();heading.current?.focus();return()=>{dialog.current?.close();previous?.focus();};},[]);

 const c=result?.campaign,w=result?.world;

 const [selectedAncestor,setSelectedAncestor]=useState<string|null>(null);

 const selectedPortrait=(Object.keys(PORTRAIT_ASSETS) as (NpcName|'player')[]).find(actor=>selectedAncestor===`${actor}.test.near`);

 const ancestryRoots=[...new Set(w?.ancestry.map(edge=>edge.sire)??[])];

 return <dialog className="inspection-overlay" ref={dialog} aria-labelledby="inspection-heading" onCancel={e=>{e.preventDefault();onClose();}}><div className="inspection-top"><h2 id="inspection-heading" ref={heading} tabIndex={-1}>{kind}</h2><button onClick={onClose}>Close inspection</button></div>

 {kind==='Rights'&&<><p>Genealogy, ownership, delegated authority and lease access are distinct.</p><p>{result?.authority?.limits}</p>{w?.properties.map(p=><details key={p.id}><summary>{p.id} · {w.access[p.id]?'Accessible':'No effective access'}</summary><p>Owner: {p.owner}</p>{c?.politics?.library&&['crypt','library','lounge'].includes(p.id)&&<button onClick={()=>{onClose();onScene(`record:${p.id}`);}}>Read current {p.id} record</button>}{w.grants.filter(g=>g.property_id===p.id).map(g=><details key={g.id}><summary>Grant #{g.id} · {g.grantee} · {g.revoked?'revoked':w.grant_validity?.[w.grants.indexOf(g)]?'effective':w.grant_validity?.[w.grants.indexOf(g)]===false?'ineffective':'unverified'}</summary><p>Grant #{g.id}: {g.grantor} → {g.grantee} · {g.scope} · parent {g.parent_grant_id??'none'} · expiry {g.expiry_night??'none'} · {g.revoked?'REVOKED':`contract validity ${String(w.grant_validity?.[w.grants.indexOf(g)]??'unknown')}`} · delegation {String(g.can_delegate)}. Revocation of this grant or its ancestor invalidates dependent access; independent grants remain separate.</p></details>)}{w.leases.filter(l=>l.property_id===p.id).map(l=><p key={l.id}>Lease #{l.id}: {l.status} · recipient {l.buyer} · duration {l.duration_nights} nights · ends {l.end_night??'not started'} · offer deadline {l.offer_expiry_night} · price {l.price_yocto} yoctoNEAR. Accepted lease is non-revocable, not ownership.</p>)}</details>)}{c&&<><h3>Obligations and agreements</h3><p>{c.politics?.appointment==='player'?`Marius’s service: ${c.politics.serviceFulfilled?'fulfilled':'due Nights 4–5'}`:'No player appointment recorded.'}</p>{c.agreements.map(a=><p key={a.id}>{a.status}: {a.result??'Inspect actual terms.'} <button onClick={()=>{onClose();onScene('lease:0');}}>Inspect Lounge terms</button></p>)}</>}</>}

 {kind==='Bloodline'&&<><h3>Genealogy</h3><p className="eyebrow">The recorded blood · select a name</p><div className="bloodline-branches">{ancestryRoots.map(sire=><div className="bloodline-branch" key={sire}><button className="bloodline-parent" aria-pressed={selectedAncestor===sire} onClick={()=>setSelectedAncestor(sire)}>{sire}</button><div className="bloodline-children">{w?.ancestry.filter(a=>a.sire===sire).map(a=><button className="bloodline-child" aria-pressed={selectedAncestor===a.descendant} key={a.descendant} onClick={()=>setSelectedAncestor(a.descendant)}>{a.descendant}</button>)}</div></div>)}</div>{selectedAncestor&&<section className="bloodline-selected" aria-live="polite">{selectedPortrait&&<Portrait actor={selectedPortrait} compact/>}<h3>{selectedAncestor}</h3><p>Recorded ownership: {w?.properties.filter(p=>p.owner===selectedAncestor).map(p=>p.id).join(', ')||'none in this view'}. Blood alone conveys no authority.</p><p>Inspect Rights for effective grants, their source and expiry.</p></section>}<h3>House membership</h3><p>Marius and Seraphine founded House Volari by uniting independent lineages. Marriage is not a sire edge. Lucien is external to the House.</p><p>Other undefined ancestry and membership remain TBD. Ancestry grants no automatic ownership or revocation authority.</p></>}

 {kind==='Relationships'&&<><p>These are court contacts, not tracked physical locations. Conversations are free.</p>{c&&Object.entries(c.npcs).map(([id,npc])=><details key={id}><summary>{AGENTS[id as NpcName].name}</summary><p>{AGENTS[id as NpcName].goal}</p>{c.politics&&<p>{politicalRelationship(result!,id as NpcName)}</p>}{!c.politics?.library&&<p>Relationship to you: {npc.relationships.player}. This value is not spendable authority.</p>}<button onClick={()=>{onClose();onScene(`character:${id}`);}}>Contact {AGENTS[id as NpcName].name}</button></details>)}</>}

 {kind==='Chronicle'&&<>{c&&<><div className="controls">{buildEncounterScenes(result!).filter(s=>s.reactionLevel||s.type==='RECKONING'||s.type==='CAMPAIGN CONCLUSION').map(s=><button key={s.id} onClick={()=>{onClose();onScene(s.id);}}>{s.title}</button>)}</div><details><summary>Inspect the execution record</summary><h3>Political history</h3>{c.agentHistory.map(e=><p key={`${e.night}:${e.actor}`}>Night {e.night+1} · {AGENTS[e.actor].name} · {e.source} · {e.kind} · {e.outcome}: {e.detail}</p>)}</details><h3>Discovered records</h3>{c.discoveries.map(d=><p key={d.id}>{d.summary}</p>)}<h3>Night chronicle</h3>{[...c.events].reverse().map((e,i)=><p key={i}>{e}</p>)}</>}</>}

 {kind==='Diagnostics'&&<><p>{result?.proof} · Signing is handled by the game runtime. The default NPC policy does not use live LLM dialogue.</p><p>Local Sandbox funds are disposable test NEAR, not fictional wealth or real-money earnings. No cryptocurrency purchase is needed. Gas pays execution; lease escrow holds the agreed rent. Cassian has one bounded, prepaid passage allowance. General NPC purchasing treasuries are not implemented.</p><p>Contract night {w?.night}; available funds {result?.walletYocto??'unknown'} yoctoNEAR; escrow {result?.escrowYocto??'unknown'}.</p>{debug&&<pre>{debug}</pre>}<button onClick={()=>onAction({action:'view'})}>Refresh authoritative state</button>{result?.transactions?.map(tx=><p key={tx.hash}>{tx.actor} · {tx.action} · {tx.success?'SUCCESS':'REJECTED'}<br/><code>{tx.hash}</code></p>)}{result?.events.map((e,i)=><p key={i}>SIMULATION: {e}</p>)}</>}

 </dialog>;

}

export function SceneSurface({children}:{children:ReactNode}){

 const root=useRef<HTMLElement>(null);

 useEffect(()=>{root.current?.querySelector<HTMLElement>('h1,h2')?.focus();},[]);

 return <main ref={root} className="game-shell">{children}</main>;

}

