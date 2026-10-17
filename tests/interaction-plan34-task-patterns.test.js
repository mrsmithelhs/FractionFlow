import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildCuratedProblem } from '../src/content/generator.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import {
  FULL_ADDITION_CONSTRUCT_PATTERN,
  FULL_ADDITION_INSPECT_PATTERN,
  resolvePlan34TaskContext,
  validatePlan34TaskContext,
} from '../src/content/full-addition-task-patterns.js';
import { PLAN34_FULL_ADDITION_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { applyIntent, createEpisode, episodeStateSnapshot } from '../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode, REPLAY_V2_SCHEMA_VERSION } from '../src/interaction/replay.js';
import { addFractions, convertToDenominator } from '../src/math/index.js';
import { projectScene } from '../src/interaction/scene.js';

const items = [
  { fixtureId: 'curated-relatively-prime-addition-non-least', revision: 'plan03-fixtures-v1', itemId: 'two-thirds-plus-one-fourth', pattern: FULL_ADDITION_CONSTRUCT_PATTERN, answers: ['8', '3', '11'] },
  { fixtureId: 'curated-relatively-prime-addition-one-half-one-third', revision: 'plan26-fixtures-v1', itemId: 'one-half-plus-one-third', pattern: FULL_ADDITION_INSPECT_PATTERN, answers: ['6', '4', '10'] },
  { fixtureId: 'curated-relatively-prime-addition-one-third-one-fourth', revision: 'plan32-record-v1', itemId: 'one-third-plus-one-fourth', pattern: FULL_ADDITION_INSPECT_PATTERN, answers: ['4', '3', '7'] },
];

function newState(entry, allowCompatibilityPair = false) {
  const fixture = resolveCuratedFixture(entry.fixtureId, entry.revision);
  const instance = buildCuratedProblem({
    fixture, selector: fixture.selector, overlays: fixture.overlays, profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] },
  });
  const taskContext = resolvePlan34TaskContext(instance, entry.pattern.id, entry.pattern.revision, '12', { allowCompatibilityPair });
  return { instance, taskContext, state: createEpisode({ instance, episodeDefinition: PLAN34_FULL_ADDITION_EPISODE_DEFINITION, taskContext, allowCompatibilityPair }) };
}

function apply(state, intent) { return applyIntent(state, intent); }

function exactAnswers(instance) {
  const asExact = (form) => ({ kind: 'fraction', numerator: BigInt(form.numerator), denominator: BigInt(form.denominator) });
  const left = convertToDenominator(asExact(instance.operands.left.initialForm), 12n);
  const right = convertToDenominator(asExact(instance.operands.right.initialForm), 12n);
  const sum = addFractions(left, right);
  return [left.numerator.toString(), right.numerator.toString(), sum.numerator.toString()];
}

function complete(entry, { help = false, falseKeep = false, unchangedEdit = false } = {}) {
  const created = newState(entry, entry.pattern.id !== (entry.itemId === 'two-thirds-plus-one-fourth'
    ? FULL_ADDITION_CONSTRUCT_PATTERN.id : FULL_ADDITION_INSPECT_PATTERN.id));
  const answers = exactAnswers(created.instance);
  let state = created.state;
  state = apply(state, { type: 'acknowledge-encounter' });
  if (help && entry.pattern.id === FULL_ADDITION_INSPECT_PATTERN.id) state = apply(state, { type: 'request-task-help' });
  for (const side of ['left', 'right']) {
    if (state.beat !== 'transform') continue;
    if (entry.pattern.id === FULL_ADDITION_CONSTRUCT_PATTERN.id) {
      state = apply(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: answers[side === 'left' ? 0 : 1], denominator: '12' } });
      continue;
    }
    const candidate = created.taskContext.candidates[side];
    if (falseKeep && side === 'left') {
      state = apply(state, { type: 'keep-inspected-form' });
      if (state.beat !== 'transform') throw new Error('false keep unexpectedly advanced');
    }
    if (unchangedEdit && side === 'right') {
      state = apply(state, { type: 'repair-inspected-form', numerator: candidate.numerator });
    } else if (candidate.numerator === answers[side === 'left' ? 0 : 1]) {
      state = apply(state, { type: 'keep-inspected-form' });
    } else {
      state = apply(state, { type: 'repair-inspected-form', numerator: answers[side === 'left' ? 0 : 1] });
    }
  }
  state = apply(state, { type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: answers[2], denominator: '12' } });
  return { ...created, state };
}

describe('Plan 34 compact episode reducer and replay', () => {
  it('completes construct through one operation and navigation without fabricating a second fraction response', () => {
    const { state: beforeFinish } = complete(items[0]);
    expect(beforeFinish.beat).toBe('resolve');
    expect(beforeFinish.established.operation.proposed).toEqual({ kind: 'fraction', numerator: '11', denominator: '12' });
    expect(() => apply(beforeFinish, { type: 'submit-resolution', proposed: { kind: 'fraction', numerator: '11', denominator: '12' } })).toThrow(/navigation only/);
    const finished = apply(beforeFinish, { type: 'finish-compact-episode' });
    expect(finished.status).toBe('resolved');
    expect(finished.established.resolution).toBeNull();
    expect(finished.established.compactCompletion).toEqual({ kind: 'navigation-completion' });
    expect(finished.intentHistory.at(-1)).toEqual({ type: 'finish-compact-episode' });
  });

  it('keeps future candidate data out of scene derivation until each inspect side becomes active', () => {
    const { taskContext, state: initial } = newState(items[1]);
    const scene = (state) => projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    const encounter = scene(initial);
    expect(encounter.meaning.currentTask.candidate).toBeNull();
    expect(encounter.derivation.sourceContext.instructional.taskContext).not.toHaveProperty('candidates');
    expect(encounter.derivation.sourceContext.instructional.taskContext).not.toHaveProperty('stimulus');
    const left = apply(initial, { type: 'acknowledge-encounter' });
    expect(scene(left).meaning.currentTask.candidate).toEqual(taskContext.candidates.left);
    const afterLeft = apply(left, { type: 'repair-inspected-form', numerator: '6' });
    const beforeRight = scene(afterLeft);
    expect(beforeRight.meaning.currentTask.candidate).toEqual(taskContext.candidates.right);
    expect(beforeRight.derivation.sourceContext.instructional.taskContext).not.toHaveProperty('candidates');
    expect(beforeRight.derivation.sourceContext.instructional.taskContext.itemId).toBe(items[1].itemId);
  });

  it('admits its fixed records against selected set v5 or v6 membership without broadening patterns', () => {
    const fixture = resolveCuratedFixture(items[0].fixtureId, items[0].revision);
    const instance = buildCuratedProblem({ fixture, selector: fixture.selector, overlays: fixture.overlays, profileId: fixture.profileId, candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] } });
    expect(resolvePlan34TaskContext(instance, items[0].pattern.id, '1', '12', { practiceSetRevision: '5' }).practiceSetRevision).toBe('5');
    expect(resolvePlan34TaskContext(instance, items[0].pattern.id, '1', '12', { practiceSetRevision: '6' }).practiceSetRevision).toBe('6');
    expect(() => resolvePlan34TaskContext(instance, items[0].pattern.id, '1', '12', { practiceSetRevision: '4' })).toThrow(/revision 5 or 6/);
  });

  it('runs compact construct multiplier help through wrong and correct proposals without autofilling', () => {
    let { state } = newState(items[0]);
    state = apply(state, { type: 'acknowledge-encounter' });
    state = apply(state, { type: 'request-task-help' });
    expect(projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.taskHelp)
      .toMatchObject({ kind: 'equivalent-fraction', status: 'awaiting-multiplier', side: 'left' });
    state = apply(state, { type: 'submit-transform-help-multiplier', proposed: { kind: 'fraction', numerator: '3', denominator: '1' } });
    expect(state.supportHistory.at(-1).classification).toBe('incorrect');
    state = apply(state, { type: 'submit-transform-help-multiplier', proposed: { kind: 'fraction', numerator: '4', denominator: '1' } });
    expect(state.supportHistory.at(-1).classification).toBe('accepted');
    expect(state.established.conversions.left).toBeNull();
    state = apply(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '8', denominator: '12' } });
    expect(state.established.conversions.left).toEqual({ kind: 'fraction', numerator: '8', denominator: '12' });
    expect(state.beat).toBe('transform');
  });

  it('classifies false keep, valid repair, valid keep, and valid unchanged edit without changing candidate truth', () => {
    const { taskContext, state: initial } = newState(items[1]);
    let state = apply(initial, { type: 'acknowledge-encounter' });
    state = apply(state, { type: 'request-task-help' });
    expect(state.supportHistory.at(-1).helpKind).toBe('inspect-comparison-invariant');
    state = apply(state, { type: 'keep-inspected-form' });
    expect(state.beat).toBe('transform');
    expect(state.lastRecovery.classification.kind).toBe('false-candidate-kept');
    state = apply(state, { type: 'repair-inspected-form', numerator: '6' });
    expect(state.established.conversionOrigins.left).toBe('learner-repaired');
    expect(state.beat).toBe('transform');
    state = apply(state, { type: 'repair-inspected-form', numerator: taskContext.candidates.right.numerator });
    expect(state.responseProvenance.at(-1).classification.kind).toBe('valid-unchanged-edit');
    expect(state.established.conversionOrigins.right).toBe('learner-confirmed-unchanged');
    expect(state.established.conversions.right).toEqual(taskContext.candidates.right);
  });

  it('runs all six compatibility pairs through the same reducer, while only fixed live pairs carry set identity', () => {
    for (const item of items) {
      for (const pattern of [FULL_ADDITION_CONSTRUCT_PATTERN, FULL_ADDITION_INSPECT_PATTERN]) {
        const context = newState({ ...item, pattern }, true);
        expect(context.taskContext.practiceSetId).toBeNull();
        expect(context.taskContext.practiceSetRevision).toBeNull();
        const completed = complete({ ...item, pattern });
        const finished = apply(completed.state, { type: 'finish-compact-episode' });
        expect(finished.status).toBe('resolved');
        expect(finished.established.operation?.proposed).toEqual(completed.state.established.operation?.proposed);
        expect(finished.established.resolution).toBeNull();
        const replayed = replayEpisode(createReplayEnvelope(finished));
        expect(replayed).toEqual(finished);
      }
    }
  });

  it('round-trips replay v2 and rejects task-context tampering; reconstruction clears by creating a fresh episode', () => {
    const { taskContext, state } = complete(items[1], { unchangedEdit: true });
    const finished = apply(state, { type: 'finish-compact-episode' });
    const envelope = createReplayEnvelope(finished);
    expect(envelope.schemaVersion).toBe(REPLAY_V2_SCHEMA_VERSION);
    expect(replayEpisode(JSON.parse(JSON.stringify(envelope)))).toEqual(finished);
    expect(() => replayEpisode({ ...envelope, taskContext: { ...envelope.taskContext, targetDenominator: '24' } })).toThrow();
    expect(() => replayEpisode({ ...envelope, taskContext: { ...envelope.taskContext, candidates: null } })).toThrow();
    const reset = newState(items[2]).state;
    expect(reset.status).toBe('active');
    expect(reset.beat).toBe('encounter');
    expect(reset.intentHistory).toEqual([]);
    expect(reset.supportHistory).toEqual([]);
    expect(reset.lastRecovery).toBeNull();
  });

  it('replays initial and completed v1 semantic oracles using current source', () => {
    const oracle = JSON.parse(readFileSync(new URL('./fixtures/plan34-legacy-replay-oracle.json', import.meta.url), 'utf8'));
    expect(oracle.captureSelfCheck).toEqual({ initialReplayMatches: true, completedReplayMatches: true });
    for (const entry of [oracle.initial, oracle.completed]) {
      const replayed = replayEpisode(entry.envelope);
      expect(episodeStateSnapshot(replayed)).toEqual(entry.expectedState);
    }
  });

  it('preserves the captured v2 initial and completed envelopes and state snapshots', () => {
    const oracle = JSON.parse(readFileSync(new URL('./fixtures/plan34-v2-replay-oracles.json', import.meta.url), 'utf8'));
    expect(oracle.capturedUsingCurrentReplayV2).toBe(REPLAY_V2_SCHEMA_VERSION);
    expect(oracle.selfCheck).toEqual({ caseCount: 4, allReplayMatches: true });
    for (const entry of oracle.cases) {
      const replayed = replayEpisode(entry.envelope);
      expect(entry.envelope.schemaVersion).toBe(REPLAY_V2_SCHEMA_VERSION);
      expect(episodeStateSnapshot(replayed)).toEqual(entry.expectedState);
    }
  });
});
