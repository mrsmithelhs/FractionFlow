import { describe, it, expect } from 'vitest';
import { PLAN50_RECORDS } from '../src/content/data/plan50-number-line-collection-records.js';
import { admitPlan50Record, resolvePlan50Context } from '../src/content/plan50-number-line-collection-task.js';
import { createFraction, equalFractions } from '../src/math/index.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
import { createEpisode, applyIntent, episodeStateSnapshot, withActiveCondition } from '../src/interaction/episode.js';
import { plan50IntentContext } from '../src/interaction/plan50-number-line-collection-episode.js';
const definition = getEpisodeDefinition('phase-4-number-line-collection','1');
const start = itemId => createEpisode({ episodeDefinition:definition, taskContext:resolvePlan50Context(itemId) });
const send = (s,type,fields={}) => applyIntent(s,{type,context:plan50IntentContext(s),...fields});
const place = (s,memberId,candidateId) => send(send(s,'select-collection-member',{memberId}),'place-collection-member',{memberId,candidateId});
describe('Plan 50 exact collection contract', () => {
  it('derives each value independently against every offered exact fraction', () => {
    const expected = [[6,4,4],[7,2,4],[4,2,4],[4,0,2]];
    PLAN50_RECORDS.forEach((r,i) => {
      const admitted=admitPlan50Record(r);
      const oracle=r.members.map(m => Array.from({length:r.lattice+1},(_,n)=>n).filter(n => equalFractions(createFraction(BigInt(m.form.numerator),BigInt(m.form.denominator)),createFraction(BigInt(n),BigInt(r.lattice)))));
      expect(oracle).toEqual(expected[i].map(n=>[n]));
      expect(r.members.map(m=>admitted.correctPositions[m.id])).toEqual(expected[i].map(n=>`step-${n}`));
    });
  });
  it('accepts each exact record only after one complete Check', () => {
    for (const record of PLAN50_RECORDS) {
      let s=start(record.itemId); const answers=admitPlan50Record(record).correctPositions;
      for (const member of record.members) s=place(s,member.id,answers[member.id]);
      expect(s.status).toBe('active');
      s=send(s,'check-collection',{revision:s.placementRevision});
      expect(s.status).toBe('resolved'); expect(s.established.collection).toEqual(answers);
      const replay=s.intentHistory.reduce((state,intent)=>applyIntent(state,intent),start(record.itemId));
      expect(episodeStateSnapshot(replay)).toEqual(episodeStateSnapshot(s));
    }
  });
  it('freezes the supported condition and treats repeated selection/placement as no-ops', () => {
    let s=start('collection-01'); s=send(s,'select-collection-member',{memberId:'a'});
    expect(send(s,'select-collection-member',{memberId:'a'})).toBe(s);
    s=send(s,'place-collection-member',{memberId:'a',candidateId:'step-0'});
    expect(send(s,'place-collection-member',{memberId:'a',candidateId:'step-0'})).toBe(s);
    expect(withActiveCondition(s,s.activeCondition)).toBe(s);
    expect(()=>withActiveCondition(s,{...s.activeCondition,display:'D-01-A'})).toThrow();
  });
  it('rejects unsupported records rather than grading them', () => {
    const base=structuredClone(PLAN50_RECORDS[0]);
    for (const mutate of [r=>r.members[1].id='a', r=>r.members[0].form={numerator:'1',denominator:'3'}, r=>r.members[0].form={numerator:'1',denominator:'10'}, r=>r.members[0].form={numerator:'01',denominator:'2'}, r=>r.members.forEach(m=>m.form={numerator:'1',denominator:'2'})]) {
      const bad=structuredClone(base); mutate(bad); expect(()=>admitPlan50Record(bad)).toThrow();
    }
  });
  it('keeps selection separate from placement revisions and evaluates all members atomically', () => {
    let s=start('collection-01'); s=place(s,'a','step-6'); s=send(s,'check-collection',{revision:s.placementRevision});
    expect(s.evaluation.feedbackByMember).toEqual({a:'not-graded',b:'unplaced',c:'unplaced'});
    s=place(s,'b','step-6'); s=place(s,'c','step-6'); expect(Object.values(s.placements)).toEqual(['step-6','step-6','step-6']);
    s=send(s,'check-collection',{revision:s.placementRevision}); expect(s.evaluation.status).toBe('incorrect');
    const revision=s.placementRevision; s=send(s,'select-collection-member',{memberId:'b'}); expect(s.placementRevision).toBe(revision); expect(s.evaluation.status).toBe('incorrect');
    s=send(s,'place-collection-member',{memberId:'b',candidateId:'step-4'}); expect(s.evaluation.status).toBe('unchecked'); expect(s.evaluation.feedbackByMember.b).toBeUndefined();
    expect(()=>send(s,'check-collection',{revision})).toThrow();
    s=place(s,'c','step-4'); s=send(s,'request-collection-help',{helpKind:'placement'}); s=send(s,'check-collection',{revision:s.placementRevision});
    expect(s.established.collection).toEqual({a:'step-6',b:'step-4',c:'step-4'}); expect(s.assistanceHistory).toHaveLength(1); expect(s.status).toBe('resolved');
    expect(()=>send(s,'select-collection-member',{memberId:'a'})).toThrow();
  });
  it('reconstructs full snapshots by replaying literal intents and refuses stale identity', () => {
    let s=start('collection-03'); s=place(s,'a','step-1'); s=send(s,'check-collection',{revision:s.placementRevision}); s=send(s,'request-collection-help',{helpKind:'placement'}); s=place(s,'b','step-2');
    const replay=s.intentHistory.reduce((state,intent)=>applyIntent(state,intent),start('collection-03'));
    expect(episodeStateSnapshot(replay)).toEqual(episodeStateSnapshot(s));
    expect(()=>applyIntent(s,{type:'select-collection-member',context:{...plan50IntentContext(s),itemId:'collection-01'},memberId:'a'})).toThrow();
    expect(()=>send(s,'place-collection-member',{memberId:'b',candidateId:'step-9'})).toThrow();
  });
});
