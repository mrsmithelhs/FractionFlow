import { describe, it, expect } from 'vitest';
import { createComparisonRecordController } from '../src/app/comparison-record-controller.js';
import { createPlan49PublicEpisode, applyPlan49PublicIntent, resolvePlan49Context } from '../src/interaction/plan49-comparison-construction.js';
import { emptyRoot } from '../src/app/comparison-record.js';
import { HIGH_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION } from '../src/interaction/episode-definition.js';
const generation='a'.repeat(32);
const tick=()=>new Promise(resolve=>setTimeout(resolve,0));
function initial(){return createPlan49PublicEpisode({taskContext:resolvePlan49Context('plan45-compare-02'),support:HIGH_SUPPORT_CONFIGURATION,activeCondition:PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION});}
describe('comparison record admission queue',()=>{
 it('keeps admitted retry and acceptance ordered after retirement and excludes stale callbacks',async()=>{
  let release; const gate=new Promise(r=>{release=r;});const writes=[];
  const storage={read:async()=>emptyRoot(generation,true),record:async(g,o)=>{writes.push(o);if(writes.length===1)await gate;return 'inserted';}};
  const c=createComparisonRecordController({storage});await c.refresh();let state=initial();expect(c.install(state)).toBe(true);
  c.helpOpened();let next=applyPlan49PublicIntent(state,{type:'submit-fraction-comparison',proposed:'<'});c.observe(state,next,{type:'submit-fraction-comparison'});state=next;
  next=applyPlan49PublicIntent(state,{type:'submit-fraction-comparison',proposed:'>'});c.observe(state,next,{type:'submit-fraction-comparison'});c.retire();c.observe(state,next,{type:'submit-fraction-comparison'});
  await tick();expect(writes.map(x=>x.kind)).toEqual(['first-retry']);expect(writes[0].assistance.help).toBe('yes');
  release();await tick();await tick();expect(writes.map(x=>x.kind)).toEqual(['first-retry','acceptance']);c.destroy();
 });
 it('does not admit an episode before storage readiness or after external generation change',async()=>{
  let current=emptyRoot(generation,true), release; const pending=new Promise(r=>{release=r;});
  const storage={read:()=>pending,record:async()=>{throw new Error('unexpected');}};
  const c=createComparisonRecordController({storage});const loading=c.refresh();expect(c.install(initial())).toBe(false);release(current);await loading;expect(c.install(initial())).toBe(true);
  current=emptyRoot('b'.repeat(32),true);storage.read=async()=>current;await c.refresh();expect(c.snapshot().eligible).toBe(false);c.destroy();
 });
 it('retires a live admission if refresh fails',async()=>{
  let fail=false; const writes=[]; const storage={read:async()=>{if(fail)throw new Error('unavailable');return emptyRoot(generation,true);},record:async(g,o)=>{writes.push(o);return 'inserted';}};
  const c=createComparisonRecordController({storage});await c.refresh();const state=initial();expect(c.install(state)).toBe(true);fail=true;await c.refresh();
  const next=applyPlan49PublicIntent(state,{type:'submit-fraction-comparison',proposed:'<'});c.observe(state,next,{type:'submit-fraction-comparison'});await tick();expect(writes).toHaveLength(0);c.destroy();
 });
 it('does not show an old rejected write on a newly installed episode',async()=>{
  let rejectWrite; const pending=new Promise((_,reject)=>{rejectWrite=reject;});const storage={read:async()=>emptyRoot(generation,true),record:()=>pending};
  const c=createComparisonRecordController({storage});await c.refresh();const state=initial();c.install(state);
  const next=applyPlan49PublicIntent(state,{type:'submit-fraction-comparison',proposed:'<'});c.observe(state,next,{type:'submit-fraction-comparison'});await tick();c.install(initial());rejectWrite(new Error('late failure'));await tick();
  expect(c.snapshot().message).toBe('');expect(c.snapshot().eligible).toBe(true);c.destroy();
 }); it('ordinary single-record assertion detects an injected duplicate and passes when restored',async()=>{
  const writes=[];const storage={read:async()=>emptyRoot(generation,true),record:async(g,o)=>{writes.push(o);return 'inserted';}};
  const c=createComparisonRecordController({storage});await c.refresh();const state=initial();c.install(state);
  const next=applyPlan49PublicIntent(state,{type:'submit-fraction-comparison',proposed:'<'});c.observe(state,next,{type:'submit-fraction-comparison'});await tick();
  const assertSingle=()=>expect(writes).toHaveLength(1);assertSingle();
  writes.push(writes[0]);expect(assertSingle).toThrow();writes.pop();assertSingle();c.destroy();
 });});
