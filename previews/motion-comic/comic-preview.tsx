import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {EncounterDirector} from '../../src/VampireEncounter';
import {TitleScreen} from '../../src/GameEntry';
import {newCampaign,availableActions} from '../../src/game';
import '../../src/style.css';
const campaign=newCampaign('comic-preview',{living:true});campaign.night=1;campaign.resources.blood=4;campaign.politics.titleFiled=true;
campaign.politics.accounts=Object.fromEntries(['player',...Object.keys(campaign.npcs)].map(a=>[a,a]));
const world={night:1,next_nonce:0,properties:[{id:'library',owner:'player'}],grants:[],grant_validity:[],leases:[{id:1,property_id:'sanctuary',buyer:'player',owner:'seraphine',status:'offered',end_night:null,duration_nights:7,offer_expiry_night:3,price_yocto:'20000000000000000000000'}],access:{crypt:true,lounge:true,library:true},ancestry:[]};
const initial={campaign,world,pending:false,error:null,events:[],proof:'UI fixture — simulated response; no blockchain transactions',actions:availableActions(campaign,world),availability:{accept:[],reject:[],end_night:[],rooms:{}}};
const nativeMedia=window.matchMedia.bind(window);
function emulateReduced(value){document.body.dataset.reduce=String(value);window.matchMedia=value?(q)=>q.includes('prefers-reduced-motion')?{matches:true,media:q,addEventListener(){},removeEventListener(){}}:nativeMedia(q):nativeMedia;}
function App(){
 const [mode,setMode]=useState('menu'),[result,setResult]=useState(initial),[busy,setBusy]=useState(false),[request,setRequest]=useState(null),[calls,setCalls]=useState(0);
 async function act(action){setCalls(c=>c+1);setBusy(true);await new Promise(r=>setTimeout(r,1800));const next=structuredClone(result);
 if(mode==='pending')next.pending=true;
 else if(mode==='failure')next.error='Fixture: confirmation unavailable';
 else if(action.choice==='sanctuary_pact'){next.world.leases[0].status='accepted';next.world.leases[0].end_night=8;next.world.access.sanctuary=true;next.world.night=next.campaign.night=2;next.campaign.resources.blood--;next.campaign.revision++;next.actions=availableActions(next.campaign,next.world);}
 setResult(next);setBusy(false);return next;}
 const open=(m)=>{localStorage.removeItem('night-scenes:v1:comic-preview');setResult(structuredClone(initial));setMode(m);setRequest({id:'character:seraphine',serial:Date.now()});};
 return <><style>{`dialog.vampire-scene::after{content:'LOCAL UI FIXTURE · SIMULATED STATE · NO TRANSACTIONS';position:fixed;bottom:0;left:0;z-index:10;background:#050505;color:#b8b3aa;font:10px system-ui;padding:4px 10px;pointer-events:none}body[data-reduce=true] *,body[data-reduce=true] *::before{animation:none!important;transition:none!important;transform:none!important}`}</style>
 {mode==='menu'?<main style={{padding:40}}><h1>Seraphine / the bargain</h1><p>Local presentation fixture. No save replacement, signing or blockchain activity. Click the bargain, then commit to preview a simulated accepted result.</p>{['success','pending','failure'].map(m=><button onClick={()=>open(m)} key={m}>Preview {m}</button>)}<button onClick={()=>setMode('title')}>Preview title</button><p><label><input type="checkbox" onChange={e=>emulateReduced(e.target.checked)}/> Emulate reduced motion for this fixture</label></p></main>:mode==='title'?<TitleScreen save={{exists:true,valid:true,night:6}} busy={false} error="" confirm={false} onNew={()=>setMode('menu')} onContinue={()=>setMode('menu')} onCancel={()=>{}} onConfirm={()=>{}}/>:<><p>UI fixture · calls: {calls}</p><EncounterDirector result={result} busy={busy} request={request} onAction={act}><main style={{padding:40}}><h1>The court continues</h1><p>Fixture calls: {calls}. Verified-state projection completed; no real transaction was sent.</p><button onClick={()=>setMode('menu')}>Back to prototype</button></main></EncounterDirector></>}
 </>;
}
createRoot(document.getElementById('root')).render(<App/>);
