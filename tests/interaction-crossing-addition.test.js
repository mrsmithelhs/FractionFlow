import { describe, expect, it } from 'vitest';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { REGISTERED_SUPPORT_LEVELS } from '../src/app/support-levels.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { fractionToWire, wireToForm } from '../src/content/schema.js';
import { addAtCommonDenominator, convertToDenominator } from '../src/math/index.js';
import {
  applyIntent,
  createEpisode,
  EpisodeConstructionError,
} from '../src/interaction/episode.js';
import { replayEpisode, createReplayEnvelope } from '../src/interaction/replay.js';
import {
  PHASE2_REFLECTION_EPISODE_DEFINITION,
  PLAN17_CROSSING_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import { resolveRenderableScene } from '../src/render/contract.js';

const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const item = practiceType.items[10];

function buildInstance(itemOverride = item) {
  const fixture = resolveCuratedFixture(itemOverride.fixtureId, itemOverride.authoringRevision);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: {
      left: fixture.left,
      right: fixture.right,
      reviewedTransitions: fixture.reviewedTransitions ?? [],
    },
  });
}

function startAtOperate(target = '12', condition = REGISTERED_CONDITIONS[0], support = REGISTERED_SUPPORT_LEVELS[0]) {
  const instance = buildInstance();
  const denominator = BigInt(target);
  const left = wireToForm(instance.operands.left.initialForm);
  const right = wireToForm(instance.operands.right.initialForm);
  const convertedLeft = convertToDenominator(left, denominator);
  const convertedRight = convertToDenominator(right, denominator);
  const result = convertToDenominator(addAtCommonDenominator(left, right, denominator), denominator);
  let state = createEpisode({
    instance,
    episodeDefinition: PLAN17_CROSSING_EPISODE_DEFINITION,
    activeCondition: condition.activeCondition,
    support: support.configuration,
  });
  for (const intent of [
    { type: 'acknowledge-encounter' },
    { type: 'submit-notice', matchesUnits: false },
    { type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: target, denominator: '1' } },
    { type: 'submit-equivalent-form', proposed: fractionToWire(convertedLeft) },
    { type: 'submit-equivalent-form', proposed: fractionToWire(convertedRight) },
  ]) state = applyIntent(state, intent);
  return { instance, state, result, convertedLeft, convertedRight };
}

function scene(state, isReplaying = false) {
  return resolveRenderableScene({
    state,
    initialRole: 'fraction-bar',
    presentationMode: 'instant-test',
    isReplaying,
  });
}

describe('Plan 17 crossing addition instructional semantics', () => {
  it('admits only the new exact content contract while preserving legacy admission', () => {
    const instance = buildInstance();
    const state = createEpisode({ instance, episodeDefinition: PLAN17_CROSSING_EPISODE_DEFINITION });
    expect(state.episodeDefinition).toEqual(PLAN17_CROSSING_EPISODE_DEFINITION);
    expect(state.beatSchedule.map((entry) => entry.kind)).toEqual([
      'encounter', 'notice', 'decide', 'transform', 'transform', 'operate', 'resolve', 'reflect',
    ]);
    expect(() => createEpisode({
      instance: buildInstance(practiceType.items[0]),
      episodeDefinition: PLAN17_CROSSING_EPISODE_DEFINITION,
    })).toThrow(EpisodeConstructionError);
    expect(createEpisode({
      instance,
      episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
    }).beat).toBe('encounter');

    const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
    const substitutedOperands = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: {
        left: fixture.left,
        right: { kind: 'fraction', numerator: '1', denominator: '2' },
        reviewedTransitions: [],
      },
    });
    expect(createEpisode({
      instance: substitutedOperands,
      episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
    })).toBeDefined();
  });

  it('binds Plan 17 construction to the registered fixture operands before advancement', () => {
    const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
    const substitutedOperands = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: {
        left: fixture.left,
        right: { kind: 'fraction', numerator: '1', denominator: '2' },
        reviewedTransitions: [],
      },
    });
    expect(substitutedOperands.provenance.fixtureId).toBe(item.fixtureId);
    expect(substitutedOperands.provenance.authoringRevision).toBe(item.authoringRevision);
    expect(substitutedOperands.operands.right.initialForm).toEqual({
      kind: 'fraction', numerator: '1', denominator: '2',
    });
    expect(() => createEpisode({
      instance: substitutedOperands,
      episodeDefinition: PLAN17_CROSSING_EPISODE_DEFINITION,
    })).toThrow(expect.objectContaining({ code: 'UNSUPPORTED_CONTENT_FAMILY' }));
  });

  it.each(['12', '24'])('withholds the result through wrong answers and projects exact %s-unit stack after acceptance', (target) => {
    const { instance, state: initial, result } = startAtOperate(target);
    expect(scene(initial).meaning.operation.resultStack).toBeNull();
    expect(scene(initial).meaning.quantities.left.currentForm.denominator).toBe(target);
    expect(scene(initial).meaning.quantities.right.currentForm.denominator).toBe(target);

    const wrongResult = { kind: 'fraction', numerator: '1', denominator: target };
    const wrong = applyIntent(initial, { type: 'submit-operation-result', proposed: wrongResult });
    expect(wrong.beat).toBe('operate');
    expect(wrong.established.operation).toBeNull();
    const wrongScene = scene(wrong);
    expect(wrongScene.meaning.status.recovery.classification.kind).toBe('incorrect-numerator-arithmetic');
    expect(wrongScene.meaning.operation.resultStack).toBeNull();

    const accepted = applyIntent(wrong, {
      type: 'submit-operation-result',
      proposed: fractionToWire(result),
    });
    const projected = scene(accepted).meaning.operation.resultStack;
    expect(accepted.beat).toBe('resolve');
    expect(projected).toMatchObject({
      kind: 'discrete-multi-whole',
      displayForm: { kind: 'fraction', numerator: target === '12' ? '17' : '34', denominator: target },
      wholeSpan: { lowerWhole: '1', upperWhole: '2' },
      wholeCount: '2',
      unitDenominator: target,
      rows: [
        { id: 'whole-1', shadedUnits: target, unitCount: target },
        { id: 'whole-2', shadedUnits: target === '12' ? '5' : '10', unitCount: target },
      ],
    });
    expect(scene(accepted, true).meaning.operation.resultStack).toEqual(projected);
    expect(accepted.established.operation.proposed.denominator).toBe(target);
  });

  it('retains the stack through matching reflection and replay round-trip', () => {
    const { state: atOperate, result } = startAtOperate('12');
    let state = applyIntent(atOperate, {
      type: 'submit-operation-result',
      proposed: fractionToWire(result),
    });
    state = applyIntent(state, { type: 'submit-resolution', proposed: fractionToWire(result) });
    const reflectedScene = scene(state);
    expect(state.beat).toBe('reflect');
    expect(reflectedScene.meaning.operation.resultStack.rows).toHaveLength(2);
    expect(reflectedScene.meaning.reflectionChoices).toHaveLength(3);
    expect(scene(state, true).meaning.transition).toMatchObject({
      type: 'equivalent-renaming',
      status: 'known-endpoints',
    });

    state = applyIntent(state, { type: 'submit-reflection', response: 'match-a' });
    expect(state.status).toBe('resolved');
    expect(scene(state).meaning.operation.resultStack.displayForm).toEqual(fractionToWire(result));
    const replayed = replayEpisode(createReplayEnvelope(state));
    expect(replayed).toEqual(state);
  });

  it('preserves premise task selection and task-help eligibility for the new exact identity', () => {
    const premiseCondition = REGISTERED_CONDITIONS.find(
      (condition) => condition.activeCondition.connectionMaking === 'CM-01-P',
    );
    const { state: atOperate, result } = startAtOperate('24', premiseCondition);
    let state = applyIntent(atOperate, {
      type: 'submit-operation-result',
      proposed: fractionToWire(result),
    });
    state = applyIntent(state, { type: 'submit-resolution', proposed: fractionToWire(result) });
    expect(scene(state).meaning.premiseCase).toMatchObject({
      presentedForm: { numerator: '16', denominator: '24' },
      expectedResponse: 'yes',
    });
    expect(scene(state).meaning.operation.resultStack).not.toBeNull();

    let conversion = createEpisode({
      instance: buildInstance(),
      episodeDefinition: PLAN17_CROSSING_EPISODE_DEFINITION,
    });
    conversion = applyIntent(conversion, { type: 'acknowledge-encounter' });
    conversion = applyIntent(conversion, { type: 'submit-notice', matchesUnits: false });
    conversion = applyIntent(conversion, {
      type: 'propose-common-denominator',
      proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
    });
    conversion = applyIntent(conversion, { type: 'request-task-help' });
    expect(conversion.supportHistory.at(-1).type).toBe('task-help-request');
  });
});
