import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveAuthoredContent } from '../src/content/authored-content-catalog.js';
import {
  PLAN36_SUBTRACTION_RECORDS,
  PLAN36_SUBTRACTION_PRACTICE_SET,
  findPlan36SubtractionAssociationSet,
} from '../src/content/data/plan36-like-denominator-subtraction-records.js';
import {
  resolvePlan36LikeDenominatorSubtractionContext,
} from '../src/content/plan36-like-denominator-takeaway-task.js';
import {
  applyIntent,
  createEpisode,
  EpisodeIntentError,
} from '../src/interaction/episode.js';
import {
  PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import {
  createReplayEnvelope,
  replayEpisode,
  REPLAY_V4_SCHEMA_VERSION,
  REPLAY_V5_SCHEMA_VERSION,
} from '../src/interaction/replay.js';
import { projectScene } from '../src/interaction/scene.js';
import {
  HIGH_SUPPORT_CONFIGURATION,
  MEDIUM_SUPPORT_CONFIGURATION,
} from '../src/interaction/support.js';

function startEpisode(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const resolved = resolveAuthoredContent(record.fixtureId, record.authoringRevision);
  if (!resolved) throw new Error(`unresolved authored content for ${record.itemId}`);
  const association = findPlan36SubtractionAssociationSet(record.itemId);
  if (!association) throw new Error(`missing association set for ${record.itemId}`);
  const taskContext = resolvePlan36LikeDenominatorSubtractionContext(
    resolved.instance,
    record.itemId,
    {
      practiceSetId: association.id,
      practiceSetRevision: association.revision,
    },
  );
  const state = createEpisode({
    instance: resolved.instance,
    episodeDefinition: PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
    taskContext,
    support,
  });
  return { resolved, taskContext, state };
}

function rawDifferenceFraction(record) {
  const left = Number(record.leftNumerator);
  const right = Number(record.rightNumerator);
  return {
    kind: 'fraction',
    numerator: String(left - right),
    denominator: record.denominator,
  };
}

describe('Plan 38 like-denominator subtraction interaction foundation', () => {
  it('admits, completes, and v5-round-trips all 8 registered records under high and medium support', () => {
    for (const support of [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]) {
      for (const record of PLAN36_SUBTRACTION_RECORDS) {
        const { state, resolved, taskContext } = startEpisode(record, support);
        expect(state.status).toBe('active');
        expect(state.beat).toBe('encounter');
        expect(state.established.subtractionRemoval).toBe('unmarked');
        expect(state.beatSchedule.map((entry) => entry.kind)).toEqual(['encounter', 'operate', 'resolve']);
        expect(Object.isFrozen(state.beatSchedule)).toBe(true);

        const marked = applyIntent(state, { type: 'mark-subtrahend-amount' });
        expect(marked.status).toBe('active');
        expect(marked.beat).toBe('operate');
        expect(marked.established.subtractionRemoval).toBe('marked');
        expect(marked.expectedResponse.responsibility).toBe('supply-amount-left');
        expect(marked.expectedResponse.inputKind).toBe('fraction');

        // Check provenance for mark action
        const markProvenance = marked.responseProvenance.at(-1);
        expect(markProvenance.classification.kind).toBe('grouped-removal-triggered');
        expect(markProvenance.classification.actionRole).toBe('grouped-removal-triggered');
        expect(markProvenance.learnerAction.type).toBe('mark-subtrahend-amount');

        // Submit raw difference
        const rawDiff = rawDifferenceFraction(record);
        const answered = applyIntent(marked, {
          type: 'submit-subtraction-result',
          proposed: rawDiff,
        });
        expect(answered.status).toBe('active');
        expect(answered.beat).toBe('resolve');
        expect(answered.established.operation.proposed).toEqual(rawDiff);
        expect(answered.established.operation.submittedForm).toEqual(rawDiff);

        // Check provenance for answer action
        const answerProvenance = answered.responseProvenance.at(-1);
        expect(answerProvenance.classification.kind).toBe('learner-supplied-result');
        expect(answerProvenance.classification.validity).toBe('valid');

        // Resolve episode
        const finished = applyIntent(answered, { type: 'finish-compact-episode' });
        expect(finished.status).toBe('resolved');
        expect(finished.beat).toBe('resolve');
        expect(finished.established.compactCompletion).toEqual({ kind: 'navigation-completion' });

        // Replay v5 round-trip
        const envelope = createReplayEnvelope(finished);
        expect(envelope.schemaVersion).toBe(REPLAY_V5_SCHEMA_VERSION);
        expect(envelope.episodeDefinition.id).toBe(PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION.id);
        expect(envelope.taskContext.itemId).toBe(record.itemId);
        expect(Object.keys(envelope.taskContext).sort()).toEqual([
          'authoringRevision',
          'definitionId',
          'definitionRevision',
          'fixtureId',
          'itemId',
          'practiceSetId',
          'practiceSetRevision',
          'recipeId',
          'recipeRevision',
          'sourceForms',
          'taskDataId',
          'taskDataRevision',
        ].sort());

        const replayed = replayEpisode(envelope);
        expect(replayed.status).toBe('resolved');
        expect(replayed.beat).toBe('resolve');
        expect(replayed.established.operation.submittedForm).toEqual(rawDiff);
      }
    }
  });

  it('rejects duplicate or out-of-order intents with exact errors', () => {
    const record = PLAN36_SUBTRACTION_RECORDS[0];
    const { state } = startEpisode(record);

    // Reject acknowledge-encounter on Plan 36
    expect(() => applyIntent(state, { type: 'acknowledge-encounter' }))
      .toThrowError(EpisodeIntentError);

    // Reject submit-subtraction-result before marking
    expect(() => applyIntent(state, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '3', denominator: '8' },
    })).toThrowError(EpisodeIntentError);

    // Reject submit-operation-result on Plan 36
    expect(() => applyIntent(state, {
      type: 'submit-operation-result',
      proposed: { kind: 'fraction', numerator: '3', denominator: '8' },
    })).toThrowError(EpisodeIntentError);

    // Reject request-replay on Plan 36
    expect(() => applyIntent(state, { type: 'request-replay' }))
      .toThrowError(EpisodeIntentError);

    // Advance to operate
    const marked = applyIntent(state, { type: 'mark-subtrahend-amount' });

    // Duplicate mark-subtrahend-amount at operate must be rejected
    expect(() => applyIntent(marked, { type: 'mark-subtrahend-amount' }))
      .toThrowError(EpisodeIntentError);

    // Advance to resolve
    const answered = applyIntent(marked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '3', denominator: '8' },
    });

    // Duplicate mark-subtrahend-amount at resolve must be rejected
    expect(() => applyIntent(answered, { type: 'mark-subtrahend-amount' }))
      .toThrowError(EpisodeIntentError);

    // Reject submit-resolution at resolve
    expect(() => applyIntent(answered, {
      type: 'submit-resolution',
      proposed: { kind: 'fraction', numerator: '3', denominator: '8' },
    })).toThrowError(EpisodeIntentError);
  });

  it('accepts exact equivalent answers, preserves submittedForm, and recovers on invalid input', () => {
    // Test reducible item 10-7-minus-3: 7/10 - 3/10 = 4/10 = 2/5
    const reducibleRecord = PLAN36_SUBTRACTION_RECORDS.find((r) => r.itemId === 'takeaway-10-7-minus-3');
    const { state } = startEpisode(reducibleRecord);
    const marked = applyIntent(state, { type: 'mark-subtrahend-amount' });

    // Wrong submission triggers recovery without resetting marked state
    const wrongAttempt = applyIntent(marked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '5', denominator: '10' },
    });
    expect(wrongAttempt.status).toBe('active');
    expect(wrongAttempt.beat).toBe('operate');
    expect(wrongAttempt.lastRecovery.classification.kind).toBe('incorrect-subtraction-result');
    expect(wrongAttempt.retryHistory.length).toBe(1);
    expect(wrongAttempt.established.subtractionRemoval).toBe('marked');

    // Both 4/10 and 2/5 accepted from marked state
    const unsimplifiedAttempt = applyIntent(marked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '4', denominator: '10' },
    });
    expect(unsimplifiedAttempt.status).toBe('active');
    expect(unsimplifiedAttempt.beat).toBe('resolve');
    expect(unsimplifiedAttempt.established.operation.mathClassification).toBe('correct-unsimplified');
    expect(unsimplifiedAttempt.established.operation.submittedForm).toEqual({
      kind: 'fraction',
      numerator: '4',
      denominator: '10',
    });

    const simplifiedAttempt = applyIntent(marked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '2', denominator: '5' },
    });
    expect(simplifiedAttempt.status).toBe('active');
    expect(simplifiedAttempt.beat).toBe('resolve');
    expect(simplifiedAttempt.established.operation.mathClassification).toBe('correct-simplified');
    expect(simplifiedAttempt.established.operation.submittedForm).toEqual({
      kind: 'fraction',
      numerator: '2',
      denominator: '5',
    });

    // Test reducible item 8-7-minus-1: 7/8 - 1/8 = 6/8 = 3/4
    const nearWholeRecord = PLAN36_SUBTRACTION_RECORDS.find((r) => r.itemId === 'takeaway-8-7-minus-1');
    const nearWhole = startEpisode(nearWholeRecord);
    const nearWholeMarked = applyIntent(nearWhole.state, { type: 'mark-subtrahend-amount' });
    const nearWholeSimplified = applyIntent(nearWholeMarked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '3', denominator: '4' },
    });
    expect(nearWholeSimplified.established.operation.mathClassification).toBe('correct-simplified');
    expect(nearWholeSimplified.established.operation.submittedForm).toEqual({
      kind: 'fraction',
      numerator: '3',
      denominator: '4',
    });

    // Test zero boundary item 9-6-minus-6: 6/9 - 6/9 = 0/9 = 0/1
    const zeroRecord = PLAN36_SUBTRACTION_RECORDS.find((r) => r.itemId === 'takeaway-9-6-minus-6');
    const zero = startEpisode(zeroRecord);
    const zeroMarked = applyIntent(zero.state, { type: 'mark-subtrahend-amount' });

    const zeroRaw = applyIntent(zeroMarked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '0', denominator: '9' },
    });
    expect(zeroRaw.established.operation.mathClassification).toBe('correct-unsimplified');
    expect(zeroRaw.established.operation.submittedForm).toEqual({
      kind: 'fraction',
      numerator: '0',
      denominator: '9',
    });

    const zeroSimplified = applyIntent(zeroMarked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '0', denominator: '1' },
    });
    expect(zeroSimplified.established.operation.mathClassification).toBe('correct-simplified');
    expect(zeroSimplified.established.operation.submittedForm).toEqual({
      kind: 'fraction',
      numerator: '0',
      denominator: '1',
    });
  });

  it('manages task help at operate correctly and idempotently', () => {
    const record = PLAN36_SUBTRACTION_RECORDS[0];
    const { state } = startEpisode(record);

    // Help at encounter is not permitted
    expect(() => applyIntent(state, { type: 'request-task-help' }))
      .toThrowError(EpisodeIntentError);

    // Help at operate is permitted and recorded
    const marked = applyIntent(state, { type: 'mark-subtrahend-amount' });
    const helped = applyIntent(marked, { type: 'request-task-help' });
    expect(helped.supportHistory).toEqual([
      expect.objectContaining({
        type: 'task-help-request',
        beat: 'operate',
        helpKind: 'like-denominator-takeaway',
      }),
    ]);

    // Second request is idempotent
    const helpedAgain = applyIntent(helped, { type: 'request-task-help' });
    expect(helpedAgain.supportHistory.length).toBe(1);

    // Scene projects taskHelp as requested
    const scene = projectScene({ state: helped, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(scene.meaning.taskHelp).toEqual({
      kind: 'like-denominator-takeaway',
      status: 'requested',
    });
  });

  it('projects scene meaning, partition cells, zero boundary, and result leakage guards', () => {
    // Test standard item takeaway-8-5-minus-2: 5/8 - 2/8 = 3/8
    const record = PLAN36_SUBTRACTION_RECORDS.find((r) => r.itemId === 'takeaway-8-5-minus-2');
    const { state } = startEpisode(record);

    // 1. Encounter beat scene
    const encounterScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(encounterScene.meaning.takeaway).not.toBeNull();
    expect(encounterScene.meaning.takeaway.operation).toBe('subtract');
    expect(encounterScene.meaning.takeaway.wholePartitionCount).toBe(8);
    expect(encounterScene.meaning.takeaway.removalStatus).toBe('unmarked');
    expect(encounterScene.meaning.takeaway.acceptedResponseForm).toBeNull();
    expect(encounterScene.meaning.takeaway.cells.map((c) => c.role)).toEqual([
      'starting', 'starting', 'starting', 'starting', 'starting',
      'outside-start', 'outside-start', 'outside-start',
    ]);
    expect(encounterScene.meaning.availableAction).toEqual(expect.objectContaining({
      responsibility: 'mark-subtrahend-amount-for-inspection',
      inputKind: 'grouped-removal-action',
    }));
    // Pre-resolution leakage guards
    expect(encounterScene.meaning.operation.rawResult).toBeNull();
    expect(encounterScene.meaning.operation.simplifiedResult).toBeNull();
    expect(encounterScene.meaning.operation.preferredFinalForm).toBeNull();
    expect(encounterScene.meaning.operation.acceptedResponseForm).toBeNull();
    expect(encounterScene.meaning.operation.resultWholeSpan).toBeNull();

    // 2. Operate beat scene
    const marked = applyIntent(state, { type: 'mark-subtrahend-amount' });
    const operateScene = projectScene({ state: marked, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(operateScene.meaning.takeaway.removalStatus).toBe('marked');
    expect(operateScene.meaning.takeaway.acceptedResponseForm).toBeNull();
    expect(operateScene.meaning.takeaway.cells.map((c) => c.role)).toEqual([
      'remaining', 'remaining', 'remaining',
      'removed', 'removed',
      'outside-start', 'outside-start', 'outside-start',
    ]);
    expect(operateScene.meaning.availableAction).toEqual(expect.objectContaining({
      responsibility: 'supply-amount-left',
      inputKind: 'fraction',
    }));
    // Pre-resolution leakage guards still hold
    expect(operateScene.meaning.operation.rawResult).toBeNull();
    expect(operateScene.meaning.operation.simplifiedResult).toBeNull();
    expect(operateScene.meaning.operation.preferredFinalForm).toBeNull();
    expect(operateScene.meaning.operation.acceptedResponseForm).toBeNull();
    expect(operateScene.meaning.operation.resultWholeSpan).toBeNull();

    // 3. Resolve beat scene
    const answered = applyIntent(marked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '3', denominator: '8' },
    });
    const resolveScene = projectScene({ state: answered, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(resolveScene.meaning.takeaway.removalStatus).toBe('marked');
    expect(resolveScene.meaning.takeaway.acceptedResponseForm).toEqual({
      kind: 'fraction',
      numerator: '3',
      denominator: '8',
    });
    expect(resolveScene.meaning.operation.preferredFinalForm).toEqual({
      kind: 'fraction',
      numerator: '3',
      denominator: '8',
    });
    expect(resolveScene.meaning.operation.acceptedResponseForm).toEqual({
      kind: 'fraction',
      numerator: '3',
      denominator: '8',
    });
    expect(resolveScene.meaning.operation.resultWholeSpan).toEqual({
      lowerWhole: '0',
      upperWhole: '1',
    });

    // 4. Zero boundary scene: 6/9 - 6/9
    const zeroRecord = PLAN36_SUBTRACTION_RECORDS.find((r) => r.itemId === 'takeaway-9-6-minus-6');
    const zero = startEpisode(zeroRecord);
    const zeroMarked = applyIntent(zero.state, { type: 'mark-subtrahend-amount' });
    const zeroOperateScene = projectScene({ state: zeroMarked, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(zeroOperateScene.meaning.takeaway.cells.length).toBe(9);
    expect(zeroOperateScene.meaning.takeaway.cells.map((c) => c.role)).toEqual([
      'removed', 'removed', 'removed', 'removed', 'removed', 'removed',
      'outside-start', 'outside-start', 'outside-start',
    ]);
    expect(zeroOperateScene.meaning.takeaway.cells.filter((c) => c.role === 'remaining').length).toBe(0);
    expect(zeroOperateScene.meaning.operation.rawResult).toBeNull();

    // Resolve with 0/1 displays 0/1 exactly
    const zeroResolved = applyIntent(zeroMarked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '0', denominator: '1' },
    });
    const zeroResolveScene = projectScene({ state: zeroResolved, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(zeroResolveScene.meaning.operation.preferredFinalForm).toEqual({
      kind: 'fraction',
      numerator: '0',
      denominator: '1',
    });
    expect(zeroResolveScene.meaning.takeaway.acceptedResponseForm).toEqual({
      kind: 'fraction',
      numerator: '0',
      denominator: '1',
    });
  });

  it('fails closed on tampered or invalid Replay v5 envelopes', () => {
    const record = PLAN36_SUBTRACTION_RECORDS[0];
    const { state } = startEpisode(record);
    const marked = applyIntent(state, { type: 'mark-subtrahend-amount' });
    const answered = applyIntent(marked, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '3', denominator: '8' },
    });
    const validEnvelope = createReplayEnvelope(answered);

    // Tampered schema version
    const badVersion = { ...validEnvelope, schemaVersion: 'fractionflow.episode-replay/v99' };
    expect(() => replayEpisode(badVersion)).toThrow();

    // Tampered taskContext keys
    const missingContextKey = {
      ...validEnvelope,
      taskContext: { ...validEnvelope.taskContext },
    };
    delete missingContextKey.taskContext.recipeId;
    expect(() => replayEpisode(missingContextKey)).toThrow();

    // Tampered definition ID
    const badDef = {
      ...validEnvelope,
      episodeDefinition: { id: 'wrong-definition', revision: '1' },
    };
    expect(() => replayEpisode(badDef)).toThrow();

    // Tampered intent type in learnerIntents
    const badIntent = {
      ...validEnvelope,
      learnerIntents: [
        { type: 'mark-subtrahend-amount' },
        { type: 'bogus-intent-type' },
      ],
    };
    expect(() => replayEpisode(badIntent)).toThrow();
  });

  it('preserves frozen Plan 35 baseline v4 oracles without modification', () => {
    const oraclesJson = readFileSync(
      new URL('./fixtures/plan35-v4-replay-oracles.json', import.meta.url),
      'utf8',
    );
    const oracleDocument = JSON.parse(oraclesJson);
    expect(oracleDocument.oracleId).toBe('plan35-v4-replay-baseline-before-plan38');
    expect(Array.isArray(oracleDocument.cases)).toBe(true);
    expect(oracleDocument.cases.length).toBe(8);

    for (const oracleCase of oracleDocument.cases) {
      expect(oracleCase.envelope.schemaVersion).toBe(REPLAY_V4_SCHEMA_VERSION);
      const replayed = replayEpisode(oracleCase.envelope);
      expect(replayed.status).toBe(oracleCase.expectedState.status);
      expect(replayed.beat).toBe(oracleCase.expectedState.beat);
      expect(replayed.revision).toBe(oracleCase.expectedState.revision);
      const envelope = createReplayEnvelope(replayed);
      expect(envelope.schemaVersion).toBe(REPLAY_V4_SCHEMA_VERSION);
      expect(envelope.episodeDefinition.id).toBe('phase-3-reusable-addition-recipes');
    }
  });
});

