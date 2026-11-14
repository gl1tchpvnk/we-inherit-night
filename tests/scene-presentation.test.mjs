import test from 'node:test';
import assert from 'node:assert/strict';
import {cinematicEncounter,dialogueBeats} from '../src/scenePresentation.ts';
import {RELATIONSHIP_TEXT as text} from '../src/relationshipDialogue.ts';

const scene=(id,prose)=>({id,type:'ENCOUNTER',portraits:['seraphine'],lines:[{speaker:'seraphine',text:prose}]});

test('cinematic offer preserves every authored paragraph in order without mutating the scene',()=>{
  const s=scene('character:seraphine',`${text.S_OPEN}\n\n${text.S_OFFER}`),before=structuredClone(s);
  const beats=dialogueBeats(s);
  assert.equal(beats.length,4);
  assert.equal(beats.map(b=>b.text).join('\n\n'),s.lines[0].text);
  assert(beats.every(b=>b.speaker==='seraphine'));
  assert.deepEqual(s,before);
});

test('short optional answers stay coherent, and authored offer variants retain their text',()=>{
  for(const [id,prose] of [['ask:relationship:S-Q1',text.S_Q1],['ask:relationship:S-Q2',text.S_Q2],['action:sanctuary_pact',`${text.S_OPEN_M}\n\n${text.S_OFFER}`]]){
    const s=scene(id,prose),beats=dialogueBeats(s);
    assert.equal(beats.map(b=>b.text).join('\n\n'),prose);
    assert(beats.every(b=>b.text!=='Ask him.'));
  }
  assert.equal(dialogueBeats(scene('ask:relationship:S-Q2',text.S_Q2)).length,1);
});

test('all character conversations and negotiations qualify, while non-character surfaces do not',()=>{
  for(const actor of ['marius','seraphine','vesper','lucien','mirelle','dorian','cassian','sabine']){
    assert(cinematicEncounter({...scene(`character:${actor}`,'Text'),portraits:[actor]}));
  }
  for(const id of ['lease:0','personal:relationship:S-P','final-demand','reaction:npc:1:vesper:revoke'])assert(cinematicEncounter(scene(id,'Text')));
  for(const type of ['RECKONING','DECISION','CAMPAIGN CONCLUSION'])assert(!cinematicEncounter({...scene('example','Text'),type}));
  for(const id of ['decision:1','incident:1','discovery:1','record:lounge'])assert(!cinematicEncounter(scene(id,'Text')));
  assert(!cinematicEncounter({...scene('room-introduction:lounge','Text'),introduction:'lounge'}));
  assert(!cinematicEncounter({...scene('old','Text'),redirect:'new'}));
  assert(!cinematicEncounter({...scene('empty','Text'),portraits:[]}));
});

test('multi-speaker exchanges preserve authored lines and saved beat offsets',()=>{
  const s={...scene('personal:relationship:S-D','Text'),exchange:'S-D',lines:[
    {speaker:'player',text:'First.\n\nSecond.'},{speaker:'seraphine',text:'Answer.'},{speaker:'narrator',text:'Record.'}
  ]};
  assert(cinematicEncounter(s));assert.equal(dialogueBeats(s),s.lines);
});
