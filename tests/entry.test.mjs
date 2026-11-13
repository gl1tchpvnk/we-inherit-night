import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,readdir} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {inspectSave} from '../scripts/save-status.mjs';
import {PROLOGUE,readIntro,advanceIntro,requiresReplacementConfirmation,loadEntryCampaign} from '../src/entry.ts';
import {buildEncounterScenes} from '../src/encounters.ts';
import {newCampaign} from '../src/game.ts';

test('title save inspection is read-only, distinguishes absent, valid, corrupt and legacy saves',async()=>{
 const base=await mkdtemp(resolve('.local/entry-save-'));
 try{
  assert.deepEqual(await inspectSave(base),{exists:false,valid:false});assert.deepEqual(await readdir(base),[]);
  const id='11111111-1111-1111-1111-111111111111',home=join(base,id);await mkdir(home);for(const name of ['data','keys'])await mkdir(join(home,name));
  const campaign=newCampaign(id);const saved=JSON.stringify({campaign,pending:{kind:'dawn'}});
  await Promise.all([writeFile(join(base,'current.json'),JSON.stringify({id})),writeFile(join(home,'ready.json'),JSON.stringify({id})),writeFile(join(home,'campaign.json'),saved),writeFile(join(home,'config.json'),'{}')]);
  assert.equal((await inspectSave(base)).valid,true);assert.equal(await readFile(join(home,'campaign.json'),'utf8'),saved);
  campaign.version=2;await writeFile(join(home,'campaign.json'),JSON.stringify({campaign,pending:null}));assert.equal((await inspectSave(base)).valid,true);
  campaign.version=999;await writeFile(join(home,'campaign.json'),JSON.stringify({campaign}));assert.equal((await inspectSave(base)).valid,false);
  await writeFile(join(base,'current.json'),JSON.stringify({id:'../../outside'}));assert.equal((await inspectSave(base)).valid,false);
 }finally{await rm(base,{recursive:true,force:true});}
});

test('New Game requires confirmation for existing saves; Continue only loads and preserves journal result',async()=>{
 assert.equal(requiresReplacementConfirmation({exists:false,valid:false}),false);
 assert.equal(requiresReplacementConfirmation({exists:true,valid:true}),true);
 const result={campaign:{id:'old',revision:4},error:null},calls=[];
 const request=async action=>{calls.push(action);return action.action==='reset'?{campaign:{id:'new'},error:null}:result;};
 assert.equal(await loadEntryCampaign(false,{exists:true,valid:true,id:'old'},request),result);assert.deepEqual(calls,[{action:'view'}]);calls.length=0;
 const next=await loadEntryCampaign(true,{exists:true,valid:true,id:'old'},request);assert.equal(next.campaign.id,'new');assert.deepEqual(calls,[{action:'view'},{action:'reset',campaign_id:'old',revision:4}]);
 calls.length=0;await loadEntryCampaign(true,{exists:false,valid:false},request);assert.deepEqual(calls,[{action:'view'}]);
});

test('stale save, missing Continue and uncertain recovery never reset',async()=>{
 for(const [save,result] of [[{exists:true,valid:true,id:'other'},{campaign:{id:'old'},error:null}],[{exists:true,valid:true,id:'old'},{pending:true, ...{campaign:{id:'old'},error:null}}]]){
  const calls=[];await assert.rejects(loadEntryCampaign(true,save,async a=>{calls.push(a);return result;}));assert.deepEqual(calls,[{action:'view'}]);
 }
 await assert.rejects(loadEntryCampaign(false,{exists:false,valid:false},async()=>{assert.fail('must not create a campaign');}));
});

test('Quit settlement can resume on Continue but cannot reset until confirmed; archived history permits New Game',async()=>{
 const pending={campaign:{id:'old',revision:4},closure:{reason:'quit',complete:false},pending:true,error:null};
 const save={exists:true,valid:true,closing:true,id:'old'},calls=[];
 const request=async a=>{calls.push(a);return pending;};
 assert.equal(await loadEntryCampaign(false,save,request),pending);
 await assert.rejects(loadEntryCampaign(true,save,request));assert(calls.every(a=>a.action==='view'));
 const closed={...save,valid:false,closing:false,closed:true};assert.equal(requiresReplacementConfirmation(closed),false);
 calls.length=0;
 const fresh=await loadEntryCampaign(true,closed,async a=>{calls.push(a);return a.action==='view'?{...pending,pending:false,closure:{reason:'quit',complete:true},archiveCommitment:'verified'}:{campaign:{id:'fresh'},error:null};});
 assert.equal(fresh.campaign.id,'fresh');assert.deepEqual(calls,[{action:'view'},{action:'reset',campaign_id:'old',revision:4}]);
});

test('four prologue passages advance, skip and resume without modifying campaign or skipping Vesper',()=>{
 assert.equal(PROLOGUE.length,4);let progress={line:0,done:false};
 for(let i=0;i<3;i++){progress=advanceIntro(progress);assert.equal(progress.line,i+1);assert.equal(progress.done,false);assert.deepEqual(readIntro(JSON.stringify(progress)),progress);}
 assert.equal(advanceIntro(progress).done,true);assert.equal(advanceIntro({line:0,done:false},true).done,true);
 for(const raw of ['broken','{"line":-1,"done":false}','{"line":20,"done":false}'])assert.equal(readIntro(raw),null);
 const campaign=newCampaign('entry',{political:true});
 // Pure scene projection remains the only opening-encounter selector.
 campaign.politics??={};
 const result={campaign,world:{properties:[],grants:[],leases:[],access:{}},actions:[]};const before=structuredClone(result);
 const opening=buildEncounterScenes(result).find(s=>s.id==='ultimatum');assert.ok(opening.automatic);assert.deepEqual(opening.choices.map(c=>c.inspect),['character:seraphine','character:marius','discovery:0']);assert.ok(opening.choices.every(c=>!c.action));assert.deepEqual(result,before);
});

test('title and prologue SSR provide accessible real controls, no settings or gameplay commits',async()=>{
 const dir=await mkdtemp(resolve('.local/entry-ssr-'));
 try{
  const output=await build({configFile:false,logLevel:'silent',define:{'import.meta.env.VITE_MODE':'"sandbox"'},build:{ssr:resolve('src/GameEntry.tsx'),write:false,rollupOptions:{external:['react','react/jsx-runtime']}}});
  const file=join(dir,'entry.mjs');await writeFile(file,output.output.find(o=>o.type==='chunk').code);
  const {TitleScreen,Prologue,GameEntry}=await import(pathToFileURL(file).href);
  const props={save:{exists:false,valid:false},busy:false,error:'',confirm:false,onNew(){},onContinue(){},onCancel(){},onConfirm(){}};
  const html=renderToStaticMarkup(createElement(TitleScreen,props));assert.match(html,/>Begin the Night</);assert.match(html,/disabled="">Continue/);assert.doesNotMatch(html,/Settings/);
  const confirm=renderToStaticMarkup(createElement(TitleScreen,{...props,confirm:true}));assert.match(confirm,/Replace save/);assert.match(confirm,/Keep existing save/);
  const valid=renderToStaticMarkup(createElement(TitleScreen,{...props,save:{exists:true,valid:true,night:3}}));assert.match(valid,/<button>Continue/);
  const intro=renderToStaticMarkup(createElement(Prologue,{progress:{line:0,done:false},onAdvance(){}}));assert.match(intro,/Skip intro/);assert.match(intro,/Dialogue is free/);
  for(let line=0;line<PROLOGUE.length;line++){
   const panel=renderToStaticMarkup(createElement(Prologue,{progress:{line,done:false},onAdvance(){}}));
   assert.match(panel,/<\/section><div class="controls prologue-controls" aria-label="Prologue navigation">/,'navigation is outside the panel-specific swapping text column');
   assert.equal((panel.match(/>Continue<\/button>/g)??[]).length,1);
   assert.equal((panel.match(/>Skip intro<\/button>/g)??[]).length,1);
  }
  const waiting=renderToStaticMarkup(createElement(Prologue,{progress:{line:0,done:false},waiting:true,onAdvance(){}}));assert.match(waiting,/Establishing verified local rights/);assert.doesNotMatch(waiting,/<button disabled/);
  const skipped=renderToStaticMarkup(createElement(Prologue,{progress:{line:3,done:true},waiting:true,onAdvance(){assert.fail('render must not commit');}}));assert.match(skipped,/<button disabled="">Continue/);assert.match(skipped,/<button disabled="">Skip intro/);
  const entry=renderToStaticMarkup(createElement(GameEntry,{children(){assert.fail('gameplay cannot render on title');}}));assert.match(entry,/Checking for a saved campaign/);
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('normal finale requires verified reclamation for public replay, never just a commitment',async()=>{
 const {canReplayCampaign}=await import('../src/entry.ts');
 const r={campaign:{status:'concluded'},pending:false,error:null,archiveCommitment:'commitment'};
 assert.equal(canReplayCampaign(r,true),false);assert.equal(canReplayCampaign({...r,archiveComplete:false},true),false);
 assert.equal(canReplayCampaign({...r,archiveComplete:true},true),true);
 assert.equal(canReplayCampaign({...r,archiveComplete:true,pending:true},true),false);
 assert.equal(canReplayCampaign({...r,archiveComplete:true,error:'uncertain'},true),false);
 assert.equal(canReplayCampaign({...r,archiveComplete:true,closure:{complete:false}},true),false);
 assert.equal(canReplayCampaign({...r,campaign:{status:'playing'},archiveComplete:true},true),false);
 assert.equal(canReplayCampaign(r,false),true);
 const result=await loadEntryCampaign(false,{exists:true,valid:true,id:'ended'},async()=>({...r,campaign:{id:'ended',status:'concluded'},pending:true}));
 assert.equal(result.pending,true);
});

test('public title note and persistent finale render accessible copy and safe replay states',async()=>{
 const dir=await mkdtemp(resolve('.local/refinement-ssr-'));
 const originalStorage=globalThis.localStorage;
 try{
  globalThis.localStorage={getItem:()=>JSON.stringify({done:true,response:null})};
  const input=join(dir,'input.ts');await writeFile(input,"export {TitleScreen} from '../../src/GameEntry';export {CampaignFinale} from '../../src/CampaignFinale';");
  const output=await build({configFile:false,logLevel:'silent',define:{'import.meta.env.VITE_MODE':'"testnet"','import.meta.env.VITE_TESTNET_BACKEND':'"1"'},build:{ssr:input,write:false,rollupOptions:{external:['react','react/jsx-runtime']}}});
  const file=join(dir,'components.mjs');await writeFile(file,output.output.find(o=>o.type==='chunk').code);
  const {TitleScreen,CampaignFinale}=await import(pathToFileURL(file).href);
  const title=renderToStaticMarkup(createElement(TitleScreen,{save:{exists:false,valid:false,inactivityMs:86400000},busy:false,error:'',confirm:false,onNew(){},onContinue(){},onCancel(){},onConfirm(){}}));
  assert.match(title,/<aside class="expiration-note"><strong>The night waits for no one\.<\/strong>/);
  assert.match(title,/Campaigns close after 24 hours of inactivity\. Their recorded outcome is preserved, but they cannot be resumed\./);
  assert(title.indexOf('expiration-note')>title.indexOf('entry-controls'));assert.doesNotMatch(title,/class="notice"/);
  const campaign=newCampaign('ending',{living:true});campaign.status='concluded';campaign.ending='favoured';campaign.reason='Lucien protects you beyond the temporary passage.';campaign.night=7;
  const result={campaign,world:{night:7,properties:[],grants:[],leases:[],ancestry:[],access:{},next_nonce:0},pending:false,error:null,archiveCommitment:'record'};
  const props={result,busy:false,requireArchive:true,onReplay(){assert.fail('render must not reset');},onRefresh(){}};
  const pending=renderToStaticMarkup(createElement(CampaignFinale,props));assert.match(pending,/CAMPAIGN COMPLETE/);assert.match(pending,/The Favoured/);assert.match(pending,/Lucien’s protection still standing/);assert.match(pending,/Review Your Chronicle/);assert.match(pending,/disabled="">Begin Another Campaign/);assert.match(pending,/still being verified/);assert.doesNotMatch(pending,/Finish \/ skip|Return to exploration/);
  const ready=renderToStaticMarkup(createElement(CampaignFinale,{...props,result:{...result,archiveComplete:true}}));assert.match(ready,/<button class="binding-choice">Begin Another Campaign/);assert.doesNotMatch(ready,/Check settlement/);
 }finally{globalThis.localStorage=originalStorage;await rm(dir,{recursive:true,force:true});}
});
