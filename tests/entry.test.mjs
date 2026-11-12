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
  const html=renderToStaticMarkup(createElement(TitleScreen,props));assert.match(html,/>New Game</);assert.match(html,/disabled="">Continue/);assert.doesNotMatch(html,/Settings/);
  const confirm=renderToStaticMarkup(createElement(TitleScreen,{...props,confirm:true}));assert.match(confirm,/Replace save/);assert.match(confirm,/Keep existing save/);
  const valid=renderToStaticMarkup(createElement(TitleScreen,{...props,save:{exists:true,valid:true,night:3}}));assert.match(valid,/<button>Continue/);
  const intro=renderToStaticMarkup(createElement(Prologue,{progress:{line:0,done:false},onAdvance(){}}));assert.match(intro,/Skip intro/);assert.match(intro,/Dialogue is free/);
  const waiting=renderToStaticMarkup(createElement(Prologue,{progress:{line:0,done:false},waiting:true,onAdvance(){}}));assert.match(waiting,/Establishing verified local rights/);assert.doesNotMatch(waiting,/<button disabled/);
  const skipped=renderToStaticMarkup(createElement(Prologue,{progress:{line:3,done:true},waiting:true,onAdvance(){assert.fail('render must not commit');}}));assert.match(skipped,/<button disabled="">Continue/);assert.match(skipped,/<button disabled="">Skip intro/);
  const entry=renderToStaticMarkup(createElement(GameEntry,{children(){assert.fail('gameplay cannot render on title');}}));assert.match(entry,/Checking for a saved campaign/);
 }finally{await rm(dir,{recursive:true,force:true});}
});
