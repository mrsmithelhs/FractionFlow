import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PLAN45_COMPARISON_RECORDS } from '../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import { createFraction, leastCommonDenominator, convertToDenominator, compareFractions } from '../src/math/index.js';
import { replayEpisode, createReplayEnvelope } from '../src/interaction/replay.js';
import { plan45ComparisonHelpText } from '../src/content/plan45-symbolic-fraction-comparison-task.js';
import { createPlan49Episode, resolvePlan49Context, applyPlan49Intent, projectPlan49Construction } from '../src/interaction/plan49-comparison-construction.js';
const start = id => createPlan49Episode({ taskContext: resolvePlan49Context(id) });
const send = (s,type, rest={}) => applyPlan49Intent(s,{type,...rest});
const submit = (s,type,proposed) => send(s,type,{phase:s.construction.phase,proposed:String(proposed)});
const f = x => createFraction(BigInt(x.numerator),BigInt(x.denominator));
const open = s => send(s,'open-comparison-construction');
const target = (s,n) => submit(s,'submit-comparison-denominator',n);

describe('Plan 49 isolated pure contract', () => {
 it('preserves captured pre-change v9 full states and cue', () => {
  const oracle = JSON.parse(readFileSync(new URL('../reports/development/plan-49-optional-common-denominator-comparison-help/v9-prechange-oracles.json',import.meta.url)));
  for (const c of oracle.cases) {
   const state = replayEpisode(c.envelope);
   expect(state).toEqual(c.expectedState);
   expect(createReplayEnvelope(state)).toEqual(c.envelope);
   expect(plan45ComparisonHelpText(state.taskContext,'reasoning')).toBe(c.cue);
  }
  expect(oracle.cases[0].cue).toContain('15');
 });
 it('audits each pair using exact core for least and non-least targets and exact forms', () => {
  for (const record of PLAN45_COMPARISON_RECORDS) {
   const {first,second}=record.sourceForms;
   const lcd = leastCommonDenominator(BigInt(first.denominator),BigInt(second.denominator));
   for (const value of [lcd,lcd*2n]) {
    expect(value).toBeLessThanOrEqual(144n);
    let state=target(open(start(record.itemId)),value);
    for (const side of ['first','second']) {
     const expected=convertToDenominator(f(record.sourceForms[side]),value);
     if (state.construction.phase === side) state=submit(state,'submit-comparison-numerator',expected.numerator);
     expect(state.construction.acceptedForms[side]).toEqual({numerator:String(expected.numerator),denominator:String(value)});
    }
    expect(state.construction.phase).toBe('ready');
    const a=f(state.construction.acceptedForms.first), b=f(state.construction.acceptedForms.second);
    expect(compareFractions(a,b)).toBe(compareFractions(f(first),f(second)));
   }
  }
 });
 it('handles input, capacity, helpers, revision and withheld future values', () => {
  let s=open(start('plan45-compare-01'));
  expect(()=>submit(s,'submit-comparison-denominator','-1')).toThrow();
  expect(()=>submit(s,'submit-comparison-denominator','01')).toThrow();
  s=target(s,0); expect(s.construction.recovery).toBe('not-common');
  s=target(s,14); expect(s.construction.recovery).toBe('not-common');
  s=target(s,150); expect(s.construction.recovery).toBe('unavailable');
  s=send(s,'request-comparison-construction-help',{helpKind:'denominator',phase:'denominator'});
  s=target(s,15); expect(s.construction.phase).toBe('first');
  expect(projectPlan49Construction(s).acceptedForms).toEqual({first:null,second:null});
  s=send(s,'request-comparison-construction-help',{helpKind:'multiplier',phase:'first'});
  s=submit(s,'submit-comparison-multiplier',4); expect(s.construction.recovery).toBe('incorrect-multiplier');
  s=submit(s,'submit-comparison-multiplier',5); expect(s.construction.multiplier).toBe('5');
  s=submit(s,'submit-comparison-numerator',11); expect(s.construction.recovery).toBe('incorrect-numerator');
  s=submit(s,'submit-comparison-numerator',10); expect(s.construction.phase).toBe('second');
  expect(()=>send(s,'submit-comparison-numerator',{phase:'first',proposed:'10'})).toThrow();
  expect(projectPlan49Construction(s).acceptedForms.second).toBeNull();
  s=send(s,'revise-comparison-denominator'); expect(s.construction.acceptedForms).toEqual({first:null,second:null});
  expect(s.construction.recovery).toBe('dependent-work-cleared');
  s=target(s,30); expect(s.construction.phase).toBe('first');
  expect(s.attempts.some(x=>x.outcome==='incorrect')).toBe(true);
 });
 it('retains model lock, nonnumeric cue, partial help and independently accepts the relation', () => {
  let s=start('plan45-compare-01');
  s=send(s,'request-comparison-help',{helpKind:'reasoning'});
  expect(projectPlan49Construction(s).reasoningCue).not.toContain('15');
  s=send(s,'request-comparison-model',{side:'first'});
  expect(()=>send(s,'request-comparison-model',{side:'second'})).toThrow();
  s=target(open(s),15);
  s=send(s,'submit-fraction-comparison',{proposed:'<'});
  expect(s.base.status).toBe('active');
  s=send(s,'submit-fraction-comparison',{proposed:'>'});
  expect(s.base.status).toBe('resolved');
  expect(s.base.responseProvenance.at(-1).assistanceHistory.some(e=>e.type==='construction-attempt')).toBe(true);
  expect(projectPlan49Construction(s).acceptedRelation).toBe('>');
  expect(()=>submit(s,'submit-comparison-numerator',10)).toThrow();
  expect(start('plan45-compare-01').construction.phase).toBe('inactive');
 });
 it('admits 144 where common, rejects extra keys and unrequested factor', () => {
  let s=target(open(start('plan45-compare-10')),144);
  expect(s.construction.phase).toBe('first');
  expect(()=>submit(s,'submit-comparison-multiplier',18)).toThrow();
  expect(()=>applyPlan49Intent(s,{type:'submit-comparison-numerator',phase:'first',proposed:'54',extra:true})).toThrow();
 });
});
