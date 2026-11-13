import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,playerAction,dawn} from '../src/game.ts';
import {bloodWarning,hungerText,encounterFeed} from '../src/blood.ts';
function fixture(blood,political=true){
 const campaign=newCampaign('blood-warning',{political,living:political,legacy:!political});campaign.resources.blood=blood;
 const world={night:0,next_nonce:0,properties:[{id:'library',owner:'player'}],grants:[],leases:[],ancestry:[],access:{crypt:true,library:true,lounge:true}};
 return {campaign,world,error:null,pending:false};
}
test('Blood warnings match engine depletion at every boundary without changing state',()=>{
 for(let blood=1;blood<=12;blood++)for(const shelter of [true,false])for(const choice of ['feed','investigate_title']){
  const r=fixture(blood);r.world.access.crypt=shelter;const before=structuredClone(r);
  const after=playerAction(r.campaign,choice,r.world),warning=bloodWarning(r,{action:'game',choice});
  if(after.resources.blood===0)assert.match(warning,/last Blood/);
  else{
   const outcome=dawn(after,r.world);
   if(outcome.resources.blood===0)assert.match(warning,/Fatal|Danger/);
   if(after.resources.blood>3)assert.equal(warning,null);
   if(after.resources.blood===1)assert.match(warning,/Even sheltered upkeep takes 1 Blood, leaving 0/);
   if(after.resources.blood===2||after.resources.blood===3)assert.match(warning,/Without shelter/);
  }
  assert.deepEqual(r,before);
 }
});
test('wait, rest, cap, free questions and legacy turns use actual action timing',()=>{
 for(const blood of [1,2,3,4]){
  const r=fixture(blood);assert.equal(bloodWarning(r,{action:'end_night'})!==null,blood<=3);
 }
 assert.match(bloodWarning(fixture(1),{action:'game',choice:'rest'}),/leaves 3 Blood/);
 assert.equal(bloodWarning(fixture(2),{action:'game',choice:'rest'}),null);
 assert.equal(bloodWarning(fixture(11),{action:'game',choice:'feed'}),null);
 assert.equal(bloodWarning(fixture(1),{action:'game',choice:'learn_seraphine'}),null);
 const legacy=fixture(2,false);assert.equal(bloodWarning(legacy,{action:'game',choice:'investigate_title'}),null);
 assert.match(bloodWarning(fixture(1,false),{action:'game',choice:'investigate_title'}),/last Blood/);
 assert.match(bloodWarning(fixture(1),{action:'agreement_accept'}),/Fatal/);
 const pending=fixture(1);pending.pending=true;assert.equal(bloodWarning(pending,{action:'end_night'}),null);
 assert.match(hungerText(1),/Feed/);assert.match(hungerText(3),/Hunger/);assert.equal(hungerText(8),'');
});

test('encounters show Blood and fatal warnings before commitment; feeding stays primary',async()=>{
 const {build}=await import('vite'),{mkdtemp,writeFile,rm}=await import('node:fs/promises'),{resolve,join}=await import('node:path'),{pathToFileURL}=await import('node:url');
 const {createElement}=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{buildEncounterScenes}=await import('../src/encounters.ts'),{availableActions}=await import('../src/game.ts');
 const dir=await mkdtemp(resolve('.local/blood-ssr-'));
 try{
  const output=await build({configFile:false,logLevel:'silent',build:{ssr:resolve('src/VampireEncounter.tsx'),write:false,rollupOptions:{external:['react','react/jsx-runtime']}}});
  const file=join(dir,'scene.mjs');await writeFile(file,output.output.find(o=>o.type==='chunk').code);
  const {VampireEncounter}=await import(pathToFileURL(file).href),r=fixture(2);r.actions=availableActions(r.campaign,r.world);
  const scenes=buildEncounterScenes(r),scene=scenes.find(s=>s.id==='action:investigate_title');
  const html=renderToStaticMarkup(createElement(VampireEncounter,{result:r,scene,lineIndex:scene.lines.length-1,busy:false,feedback:'',onFeed(){},onLine(){},onChoice(){},onComplete(){},onSkipReckoning(){}}));
  assert.match(html,/Your action/);assert.match(html,/Feed .*4 Blood .*1 action/);
  assert.match(html,/Blood 2\/12/);assert.match(html,/Hunger is closing in/);assert.match(html,/Fatal: this leaves 1 Blood/);
  assert(html.indexOf('Fatal:')<html.indexOf('class="binding-choice"'));
  for(const blocked of [{...r,pending:true},{...r,campaign:{...r.campaign,actionsLeft:0}}]){
   const disabled=renderToStaticMarkup(createElement(VampireEncounter,{result:blocked,scene,lineIndex:0,busy:false,feedback:'',onFeed(){},onLine(){},onChoice(){},onComplete(){},onSkipReckoning(){}}));
   assert.match(disabled,/disabled="">Feed/);
  }

  const feed=scenes.find(s=>s.id==='decision:0').choices.find(c=>c.inspect==='action:feed');assert.equal(feed.secondary,false);assert.match(feed.label,/Feed.*4 Blood/);
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('title filing at 2 Blood is fatal after sheltered dawn, not before it',()=>{
 const r=fixture(2);const filed=playerAction(r.campaign,'investigate_title',r.world);
 assert.equal(filed.resources.blood,1);assert.equal(filed.status,'playing');assert.equal(filed.actionsLeft,0);
 const morning=dawn(filed,r.world);assert.equal(morning.resources.blood,0);assert.equal(morning.status,'defeat');
 assert.match(bloodWarning(r,{action:'game',choice:'investigate_title'}),/upkeep takes 1 Blood, leaving 0\. Zero Blood is fatal/);
});
test('encounter feeding respects availability, pending state, closure and exhausted actions',async()=>{
 const {availableActions}=await import('../src/game.ts');
 const r=fixture(1);r.actions=availableActions(r.campaign,r.world);const before=structuredClone(r);
 assert.deepEqual(encounterFeed(r),{action:'game',choice:'feed'});
 const fed=playerAction(r.campaign,encounterFeed(r).choice,r.world);assert.equal(fed.resources.blood,5);assert.equal(fed.actionsLeft,0);assert.equal(dawn(fed,r.world).resources.blood,4);assert.deepEqual(r,before);
 for(const blocked of [{...r,pending:true},{...r,error:'uncertain'},{...r,closure:{reason:'quit',complete:false}},{...r,actions:[]},{...r,actions:r.actions.map(a=>({...a,allowed:false}))},{...r,campaign:{...r.campaign,actionsLeft:0}},{...r,campaign:{...r.campaign,status:'defeat'}}])assert.equal(encounterFeed(blocked),null);
 assert.throws(()=>playerAction({...r.campaign,actionsLeft:0},'feed',r.world),/No major actions/);
});
