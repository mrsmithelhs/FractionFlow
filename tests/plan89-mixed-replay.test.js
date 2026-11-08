import { describe,it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PLAN74_RECORDS, PLAN74_RECORDS_V2, resolvePlan74Context, admitPlan74Record } from '../src/content/plan74-mixed-addition-task.js';
import { PLAN78_RECORDS, PLAN78_RECORDS_V2, resolvePlan78Context, admitPlan78Record } from '../src/content/plan78-mixed-subtraction-task.js';
import { PLAN82_RECORDS, PLAN82_RECORDS_V2, resolvePlan82Context, admitPlan82Record } from '../src/content/plan82-mixed-subtraction-task.js';
import { PLAN74_ID,PLAN74_CONDITION,plan74IntentContext } from '../src/interaction/plan74-mixed-addition-episode.js';
import { PLAN78_ID,plan78IntentContext } from '../src/interaction/plan78-mixed-subtraction-episode.js';
import { PLAN82_ID,plan82IntentContext } from '../src/interaction/plan82-mixed-subtraction-episode.js';
import { createEpisode,applyIntent } from '../src/interaction/episode.js';
import { createReplayEnvelope,replayEpisode } from '../src/interaction/replay.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
const specs=[
 {id:PLAN74_ID,set:'mixed-number-addition-with-regrouping',v1:PLAN74_RECORDS,v2:PLAN74_RECORDS_V2,resolve:resolvePlan74Context,admit:admitPlan74Record,intent:plan74IntentContext,kind:'addition',condition:PLAN74_CONDITION},
 {id:PLAN78_ID,set:'mixed-number-subtraction-without-decomposition',v1:PLAN78_RECORDS,v2:PLAN78_RECORDS_V2,resolve:resolvePlan78Context,admit:admitPlan78Record,intent:plan78IntentContext,kind:'subtraction'},
 {id:PLAN82_ID,set:'mixed-number-subtraction-with-decomposition',v1:PLAN82_RECORDS,v2:PLAN82_RECORDS_V2,resolve:resolvePlan82Context,admit:admitPlan82Record,intent:plan82IntentContext,kind:'subtraction'},
];
describe('Plan 89 mixed bank replay',()=>{
 it('reconstructs frozen completed v1 states and their help histories exactly',()=>{
  const oracle=JSON.parse(readFileSync(new URL('../reports/development/plan-89-versioned-problem-bank-publication/mixed-baseline-oracles.json',import.meta.url),'utf8'));
  expect(oracle.witnesses).toHaveLength(3);for(const w of oracle.witnesses){const state=replayEpisode(w.envelope);expect(JSON.parse(JSON.stringify(state))).toEqual(w.expected);expect(state.status).toBe('resolved');expect(state.taskContext.setRevision).toBe('1');}
 });
 it.each(specs)('completes and reconstructs all v2 records for $set, with v1 default and strict identity',s=>{
  expect(s.v2).toHaveLength(30);expect(s.v2.slice(0,s.v1.length)).toEqual(s.v1);
  const chooser=PRACTICE_TYPES.find(x=>x.id===s.set);expect(chooser.setRevision).toBe('1');expect(chooser.items.map(x=>x.id)).toEqual(s.v1.map(x=>x.itemId));
  expect(new Set(s.v2.map(r=>JSON.stringify(r.operands))).size).toBe(30);
  for(const r of s.v2){
   const ctx=s.resolve(r.itemId,{setId:s.set,setRevision:'2'}),result=s.admit(r).result;
   let state=createEpisode({episodeDefinition:getEpisodeDefinition(s.id,'1'),taskContext:ctx,...(s.condition?{activeCondition:s.condition}:{})});
   const send=(type,fields={})=>{state=applyIntent(state,{type,context:s.intent(state),...fields});};
   send(`edit-mixed-${s.kind}`,{field:'whole',raw:String(result.whole)});send(`edit-mixed-${s.kind}`,{field:'pieces',raw:String(result.fraction.numerator)});send(`check-mixed-${s.kind}`,{revision:state.draftRevision});
   expect(state.status).toBe('resolved');const envelope=createReplayEnvelope(state);expect(replayEpisode(envelope)).toEqual(state);expect(replayEpisode(envelope).taskContext.setRevision).toBe('2');
  }
  const fresh=s.v2[s.v1.length].itemId;expect(()=>s.resolve(fresh,{setId:s.set,setRevision:'1'})).toThrow();expect(()=>s.resolve(fresh,{setId:'wrong',setRevision:'2'})).toThrow();expect(()=>s.resolve(fresh,{setId:s.set,setRevision:'3'})).toThrow();expect(()=>s.resolve(s.v1[0].itemId,{})).toThrow();expect(()=>s.resolve(s.v1[0].itemId,{setId:s.set})).toThrow();expect(()=>s.resolve(s.v1[0].itemId,{setRevision:'1'})).toThrow();
  const ctx=s.resolve(fresh,{setId:s.set,setRevision:'2'}),state=createEpisode({episodeDefinition:getEpisodeDefinition(s.id,'1'),taskContext:ctx,...(s.condition?{activeCondition:s.condition}:{})}),envelope=createReplayEnvelope(state);
  for(const change of [e=>e.taskContext.setRevision='1',e=>e.taskContext.setId='wrong',e=>e.contentIdentity.reconstruction.setRevision='1',e=>e.taskContext.itemId='missing']){const bad=structuredClone(envelope);change(bad);expect(()=>replayEpisode(bad)).toThrow();}
 });
});
