import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../src/content/data/plan37-bar-to-line-bridge-records.js';
import { resolvePlan37BarToLineBridgeInstance, resolvePlan37BarToLineBridgeContext, validatePlan37BarToLineBridgeContext, plan37ExactLocationScale } from '../src/content/plan37-bar-to-line-bridge-task.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import { PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION, PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';
import { projectScene } from '../src/interaction/scene.js';
import { createReplayEnvelope, replayEpisode, REPLAY_V7_SCHEMA_VERSION, REPLAY_V8_SCHEMA_VERSION } from '../src/interaction/replay.js';

const high = HIGH_SUPPORT_CONFIGURATION;
const medium = MEDIUM_SUPPORT_CONFIGURATION;

function start(record, support = high) {
  const instance = resolvePlan37BarToLineBridgeInstance(record.itemId);
  const supportMode = support.dimensions.fractionBarModel === 'high support' ? 'partitioned' : 'sparse-benchmarks';
  const taskContext = resolvePlan37BarToLineBridgeContext(instance, record.itemId, { supportMode });
  return { instance, taskContext, state: createEpisode({ instance, taskContext, support, episodeDefinition: PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION }) };
}

function locate(record, support = high) {
  const started = start(record, support);
  return { ...started, state: applyIntent(applyIntent(started.state, { type: 'acknowledge-bridge-encounter' }), { type: 'request-task-help' }) };
}

describe('Plan 39 bar-to-line bridge content and interaction', () => {
  it('keeps v1 historical and registers the revision-2 direct-location definition', () => {
    expect(PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION.revision).toBe('1');
    expect(PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION.revision).toBe('2');
    expect(PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION.beats).toEqual(['locate', 'resolve']);
    let maximumScale = 0;
    for (const record of PLAN37_BAR_TO_LINE_BRIDGE_RECORDS) {
      const instance = resolvePlan37BarToLineBridgeInstance(record.itemId);
      for (const supportMode of ['partitioned', 'sparse-benchmarks']) {
        const context = resolvePlan37BarToLineBridgeContext(instance, record.itemId, { definitionRevision: '2', supportMode });
        const scale = plan37ExactLocationScale(context);
        maximumScale = Math.max(maximumScale, Number(scale.totalUnits));
        expect(new Set(scale.positions.map(({ unitsFromZero }) => unitsFromZero)).size).toBe(scale.positions.length);
        expect(scale.positions.some(({ form }) => form.numerator === record.sourceForm.numerator && form.denominator === record.sourceForm.denominator)).toBe(true);
      }
    }
    expect(maximumScale).toBe(8);
  });

  it('uses replay v8 for the revision-2 context and does not reinterpret v7', () => {
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[0];
    const instance = resolvePlan37BarToLineBridgeInstance(record.itemId);
    const taskContext = resolvePlan37BarToLineBridgeContext(instance, record.itemId, { definitionRevision: '2', supportMode: 'partitioned' });
    const state = createEpisode({
      instance,
      taskContext,
      support: high,
      episodeDefinition: PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION,
    });
    const envelope = createReplayEnvelope(state);
    expect(envelope.schemaVersion).toBe(REPLAY_V8_SCHEMA_VERSION);
    expect(envelope.episodeDefinition.revision).toBe('2');
    expect(replayEpisode(envelope)).toMatchObject({ beat: 'locate', episodeDefinition: { revision: '2' } });
    const forgedV7 = { ...envelope, schemaVersion: REPLAY_V7_SCHEMA_VERSION };
    expect(() => replayEpisode(forgedV7)).toThrow();
  });

  it('admits exactly the eight registered unary records in both support modes', () => {
    expect(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS).toHaveLength(8);
    for (const record of PLAN37_BAR_TO_LINE_BRIDGE_RECORDS) {
      const instance = resolvePlan37BarToLineBridgeInstance(record.itemId);
      expect(instance).not.toHaveProperty('operands');
      const highScene = projectScene({ state: start(record, high).state, representationRole: 'number-line', presentationMode: 'instant-test' });
      const mediumScene = projectScene({ state: start(record, medium).state, representationRole: 'number-line', presentationMode: 'instant-test' });
      expect(highScene.meaning.numberLine.candidatePositions).toHaveLength(Number(record.partitionDenominator) + 1);
      expect(mediumScene.meaning.numberLine.candidatePositions).toHaveLength(4);
      expect(new Set(mediumScene.meaning.numberLine.candidatePositions.map((item) => item.description)).size).toBe(4);
    }
    const thirdScene = projectScene({ state: start(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[3]).state, representationRole: 'number-line', presentationMode: 'instant-test' });
    expect(thirdScene.meaning.numberLine.benchmarks.find((item) => item.label === '1/2')).toMatchObject({ selectable: false, kind: 'visual-reference-anchor' });
  });

  it('rejects context extras, cross-item and support-mode mismatch', () => {
    const { instance, taskContext } = start(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[0]);
    expect(() => validatePlan37BarToLineBridgeContext(instance, { ...taskContext, extra: true })).toThrow();
    expect(() => validatePlan37BarToLineBridgeContext(instance, { ...taskContext, itemId: PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[1].itemId })).toThrow();
    expect(() => validatePlan37BarToLineBridgeContext(instance, taskContext, 'sparse-benchmarks')).toThrow();
  });

  it('requires an offered exact wire candidate and preserves authored source form', () => {
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[4];
    const { state } = locate(record, medium);
    expect(state.content.sourceForm).toEqual(record.sourceForm);
    expect(() => applyIntent(state, { type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '1', denominator: '4', extra: true } })).toThrow(/unsupported shape/);
    expect(() => applyIntent(state, { type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '1', denominator: '2' } })).toThrow(/offered/);
    expect(() => applyIntent(state, { type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '4', denominator: '8' } })).toThrow(/offered/);
    const completed = applyIntent(state, { type: 'propose-number-line-location', proposed: record.sourceForm });
    expect(completed.beat).toBe('resolve');
    expect(completed.established.numberLineLocation.acceptedPosition).toEqual(record.sourceForm);
  });

  it('classifies each reachable recovery family and leaves help idempotent', () => {
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[1];
    const { state } = locate(record, medium);
    const classify = (n, d) => applyIntent(state, { type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: String(n), denominator: String(d) } }).lastRecovery.classification.kind;
    expect(classify(0, 1)).toBe('at-endpoint');
    expect(classify(3, 8)).toBe('too-high-same-side');
    const third = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[6];
    const thirdState = locate(third, medium).state;
    expect(applyIntent(thirdState, { type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '2', denominator: '3' } }).lastRecovery.classification.kind).toBe('wrong-side-of-half');
    expect(applyIntent(thirdState, { type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '1', denominator: '6' } }).lastRecovery.classification.kind).toBe('too-low-same-side');
    const helpAgain = applyIntent(state, { type: 'request-task-help' });
    expect(helpAgain).toBe(state);
  });

  it('round-trips bridge v7 and keeps all frozen v6 replay states exact', () => {
    for (const record of PLAN37_BAR_TO_LINE_BRIDGE_RECORDS) {
      for (const support of [high, medium]) {
        const { state: initial } = start(record, support);
        const initialEnvelope = createReplayEnvelope(initial);
        expect(initialEnvelope.schemaVersion).toBe(REPLAY_V7_SCHEMA_VERSION);
        expect(replayEpisode(initialEnvelope)).toEqual(initial);
        const encountered = applyIntent(initial, { type: 'acknowledge-bridge-encounter' });
        expect(replayEpisode(createReplayEnvelope(encountered))).toEqual(encountered);
        const locateState = applyIntent(encountered, { type: 'request-task-help' });
        expect(replayEpisode(createReplayEnvelope(locateState))).toEqual(locateState);
        const locateScene = projectScene({ state: locateState, representationRole: 'number-line', presentationMode: 'instant-test' });
        expect(locateScene.meaning.numberLine.acceptedPosition).toBeNull();
        expect(locateScene.meaning.numberLine.alignmentGuideVisible).toBe(false);
        expect(locateScene.meaning.currentTask.target).toBeNull();
        expect(JSON.stringify(locateScene)).not.toContain('correct-number-line-location');
        const matching = locateScene.meaning.numberLine.candidatePositions
          .find((candidate) => BigInt(candidate.form.numerator) * BigInt(record.sourceForm.denominator)
            === BigInt(record.sourceForm.numerator) * BigInt(candidate.form.denominator));
        expect(matching).toBeDefined();
        const located = applyIntent(locateState, { type: 'propose-number-line-location', proposed: matching.form });
        expect(replayEpisode(createReplayEnvelope(located))).toEqual(located);
        const resolveScene = projectScene({ state: located, representationRole: 'number-line', presentationMode: 'instant-test' });
        expect(resolveScene.meaning.numberLine.acceptedPosition).toEqual(record.sourceForm);
        expect(resolveScene.meaning.numberLine.alignmentGuideVisible).toBe(true);
        const completed = applyIntent(located, { type: 'finish-compact-episode' });
        expect(replayEpisode(createReplayEnvelope(completed))).toEqual(completed);
      }
    }
    const wrongRecord = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[1];
    const { state: beforeWrong } = start(wrongRecord, medium);
    const beforeLocate = applyIntent(beforeWrong, { type: 'acknowledge-bridge-encounter' });
    const wrong = applyIntent(beforeLocate, {
      type: 'propose-number-line-location',
      proposed: { kind: 'fraction', numerator: '3', denominator: '8' },
    });
    expect(wrong.lastRecovery.classification.kind).toBe('too-high-same-side');
    const recoveryScene = projectScene({ state: wrong, representationRole: 'number-line', presentationMode: 'instant-test' });
    expect(recoveryScene.meaning.numberLine.acceptedPosition).toBeNull();
    expect(recoveryScene.meaning.numberLine.alignmentGuideVisible).toBe(false);
    expect(replayEpisode(createReplayEnvelope(wrong))).toEqual(wrong);
    const helped = applyIntent(wrong, { type: 'request-task-help' });
    expect(replayEpisode(createReplayEnvelope(helped))).toEqual(helped);
    const corrected = applyIntent(helped, {
      type: 'propose-number-line-location',
      proposed: { kind: 'fraction', numerator: '1', denominator: '4' },
    });
    expect(replayEpisode(createReplayEnvelope(corrected))).toEqual(corrected);
    expect(projectScene({ state: corrected, representationRole: 'number-line', presentationMode: 'instant-test' }).meaning.numberLine.acceptedPosition)
      .toEqual(wrongRecord.sourceForm);
    const recoveryCompleted = applyIntent(corrected, { type: 'finish-compact-episode' });
    expect(replayEpisode(createReplayEnvelope(recoveryCompleted))).toEqual(recoveryCompleted);

    const sample = createReplayEnvelope(locate(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[0]).state);
    expect(() => replayEpisode({ ...sample, extra: true })).toThrow(/unsupported shape/);
    expect(() => replayEpisode({ ...sample, taskContext: { ...sample.taskContext, extra: true } })).toThrow(/unsupported shape/);
    expect(() => replayEpisode({ ...sample, learnerIntents: [{ type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '1', denominator: '2', extra: true } }] })).toThrow();
    const frozen = JSON.parse(readFileSync(new URL('../reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/v6-baseline-oracles.json', import.meta.url), 'utf8'));
    for (const snapshot of Object.values(frozen.snapshots)) {
      expect(replayEpisode(snapshot.envelope)).toEqual(snapshot.fullState);
      expect(() => replayEpisode({ ...snapshot.envelope, schemaVersion: REPLAY_V7_SCHEMA_VERSION })).toThrow();
    }
    const bridgeSample = createReplayEnvelope(start(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[0]).state);
    expect(() => replayEpisode({ ...bridgeSample, schemaVersion: 'fractionflow.episode-replay/v6' })).toThrow();
  });
});
