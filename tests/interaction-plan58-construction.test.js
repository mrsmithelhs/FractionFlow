import { describe, it, expect } from 'vitest';
import { PLAN58_RECORDS } from '../src/content/data/plan58-whole-plus-fraction-records.js';
import { admitPlan58Record, resolvePlan58Context, validatePlan58Context } from '../src/content/plan58-whole-plus-fraction-task.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
import { createEpisode, applyIntent } from '../src/interaction/episode.js';
import { plan58IntentContext } from '../src/interaction/plan58-whole-plus-fraction-episode.js';
import { projectPlan58Construction } from '../src/interaction/plan58-whole-plus-fraction-scene.js';
import { projectScene } from '../src/interaction/scene.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
const start = id => createEpisode({ episodeDefinition: getEpisodeDefinition('phase-4-whole-plus-fraction-construction', '1'), taskContext: resolvePlan58Context(id) });
const send = (s, type, extra = {}) => applyIntent(s, { type, context: plan58IntentContext(s), ...extra });
const edit = (s, field, raw) => send(s, 'edit-whole-plus-fraction', { field, raw });
const check = s => send(s, 'check-whole-plus-fraction', { revision: s.draftRevision });
const roundtrip = s => expect(replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(s))))).toEqual(s);
describe('Plan 58 pure construction', () => {
  it('accepts the six raw identities and preserves their source units', () => {
    const answers = [['0','3'],['1','0'],['1','1'],['1','2'],['1','1'],['2','0']];
    expect(PLAN58_RECORDS).toHaveLength(6);
    PLAN58_RECORDS.forEach((record, i) => {
      expect(admitPlan58Record(record).record.form).toEqual(record.form);
      let s = start(record.itemId);
      expect(projectPlan58Construction(s).verification).toBeNull();
      expect(projectScene({ state:s, representationRole:'fraction-bar', presentationMode:'instant-test' }).meaning.construction.verification).toBeNull();
      s = edit(edit(s, 'whole', answers[i][0]), 'pieces', answers[i][1]);
      expect(projectPlan58Construction(s).verification).toBeNull();
      s = check(s);
      expect(s.evaluation.status).toBe('accepted');
      expect(projectPlan58Construction(s).verification.remainder).toEqual({ numerator: answers[i][1], denominator: record.form.denominator });
      roundtrip(s);
    });
  });
  it('rejects unregistered or changed source identities', () => {
    const record = PLAN58_RECORDS[0];
    for (const form of [{ numerator:'0', denominator:'4' }, { numerator:'3', denominator:'8' }, { numerator:'6', denominator:'8' }, { numerator:'03', denominator:'4' }, { numerator:'9', denominator:'4' }]) expect(() => admitPlan58Record({ ...record, form })).toThrow();
    expect(() => resolvePlan58Context('unknown')).toThrow();
    expect(() => validatePlan58Context({ ...resolvePlan58Context(record.itemId), form: { numerator:'6', denominator:'8' } })).toThrow();
  });
  it('distinguishes missing, malformed, boundaries, explicit zero and leading zeros', () => {
    let s = start('five-fourths');
    s = check(s); expect(s.evaluation.fields.whole.status).toBe('missing');
    s = edit(s, 'whole', '0');
    expect(projectPlan58Construction(s).regions).toEqual({ whole: {status:'valid',value:0}, pieces:{status:'missing',value:null} });
    for (const raw of [' 1', '-1', '+1', '1.0', 'a']) {
      s = edit(s, 'pieces', raw); s = check(s);
      expect(s.evaluation.fields.pieces.status).toBe('malformed');
      expect(projectPlan58Construction(s).regions.pieces.value).toBeNull();
    }
    s = edit(s, 'whole', '0'.repeat(32)); expect(projectPlan58Construction(s).regions.whole.value).toBe(0);
    expect(() => edit(s, 'whole', '0'.repeat(33))).toThrow();
    s = edit(s, 'whole', '3'); s = edit(s, 'pieces', '9'); s = check(s);
    expect(s.evaluation.fields.whole.status).toBe('out-of-range'); expect(s.evaluation.fields.pieces.status).toBe('out-of-range');
    s = edit(s, 'whole', '02'); s = edit(s, 'pieces', '08');
    expect(projectPlan58Construction(s).regions).toEqual({whole:{status:'valid',value:2},pieces:{status:'valid',value:8}});
    roundtrip(s);
  });
  it('separates wrong amount from equivalent unorganized and retains help and raw revision', () => {
    let s = start('five-fourths');
    s = edit(edit(s, 'whole', '1'), 'pieces', '2'); s = check(s); expect(s.evaluation.status).toBe('incorrect');
    s = send(s, 'request-whole-plus-fraction-help', { helpKind:'unit' });
    s = edit(edit(s, 'whole', '0'), 'pieces', '5'); s = check(s); expect(s.evaluation.status).toBe('organize');
    expect(projectPlan58Construction(s).verification).toBeNull(); roundtrip(s);
    const revision = s.draftRevision;
    s = edit(s, 'whole', '01');
    expect(s.draft.pieces).toBe('5'); expect(s.assistanceHistory).toHaveLength(1); expect(s.evaluation.status).toBe('unchecked');
    expect(() => send(s, 'check-whole-plus-fraction', { revision })).toThrow();
    expect(() => applyIntent(s, { type:'edit-whole-plus-fraction', context:{...plan58IntentContext(s),itemId:'six-fourths'},field:'whole',raw:'1' })).toThrow();
    s = edit(s, 'pieces', '01'); s = check(s); expect(s.evaluation.status).toBe('accepted'); expect(s.draft).toEqual({whole:'01',pieces:'01'}); roundtrip(s);
  });
  it('rejects tampered replay identities and stale history', () => {
    const e = JSON.parse(JSON.stringify(createReplayEnvelope(start('six-fourths'))));
    for (const mutate of [x => x.contentIdentity.id = 'three-halves', x => x.taskContext.form.numerator = '3', x => x.extra = 1, x => x.learnerIntents = [{type:'check-whole-plus-fraction',context:plan58IntentContext(start('six-fourths')),revision:1}]]) {
      const bad = structuredClone(e); mutate(bad); expect(() => replayEpisode(bad)).toThrow();
    }
  });
});
