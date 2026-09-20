import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  applyIntent,
  assertSceneCurrent,
  createEpisode,
  createReplayEnvelope,
  isSceneCurrent,
  projectScene,
  replayEpisode,
  SceneProjectionError,
} from '../src/interaction/index.js';
import {
  buildCuratedProblem,
  generateProblem,
  validateCuratedFixtures,
} from '../src/content/index.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return {
    kind: 'fraction',
    numerator: String(numerator),
    denominator: String(denominator),
  };
}

function canonicalInstance() {
  return validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-non-least'
  )).instance;
}

function outsideAuthoredCoverageInstance() {
  const fixture = {
    id: 'plan06-outside-authored-coverage',
    authoringRevision: 'plan06-test-v1',
  };
  return buildCuratedProblem({
    fixture,
    selector: 'relatively-prime-addition',
    overlays: [],
    profileId: 'curated-review',
    candidate: {
      left: fraction(1, 2),
      right: fraction(1, 3),
    },
  });
}

function crossingInstance() {
  return generateProblem({
    selector: 'relatively-prime-addition',
    overlays: ['crosses-one-whole'],
    seed: 'plan06-crossing-whole',
  });
}

function atDecide(instance = canonicalInstance(), options = {}) {
  let state = createEpisode({ instance, ...options });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
  return state;
}

function afterLeftConversion(instance = canonicalInstance(), options = {}) {
  let state = atDecide(instance, options);
  state = applyIntent(state, {
    type: 'propose-common-denominator',
    proposed: whole(instance.canonicalPath.targetDenominator),
  });
  const left = instance.canonicalPath.transformations.find((entry) => entry.target === 'left')?.toForm
    ?? instance.canonicalPath.operation.left;
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: left });
  return state;
}

function afterBothConversions(instance = canonicalInstance(), options = {}) {
  let state = afterLeftConversion(instance, options);
  const right = instance.canonicalPath.transformations.find((entry) => entry.target === 'right')?.toForm
    ?? instance.canonicalPath.operation.right;
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: right });
  return state;
}

function afterOperation(instance) {
  let state = atDecide(instance);
  state = applyIntent(state, {
    type: 'propose-common-denominator',
    proposed: whole(instance.canonicalPath.targetDenominator),
  });
  const left = instance.canonicalPath.transformations.find((entry) => entry.target === 'left')?.toForm
    ?? instance.canonicalPath.operation.left;
  const right = instance.canonicalPath.transformations.find((entry) => entry.target === 'right')?.toForm
    ?? instance.canonicalPath.operation.right;
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: left });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: right });
  state = applyIntent(state, {
    type: 'submit-operation-result',
    proposed: instance.canonicalPath.finalResult.rawForm,
  });
  return state;
}

function sceneInput(state, overrides = {}) {
  return {
    state,
    representationRole: 'fraction-bar',
    presentationMode: 'standard-motion',
    ...overrides,
  };
}

function deliverToStub(result, input, deliveries) {
  assertSceneCurrent(result, input);
  if (result.kind !== 'scene') throw new Error('capability refusal is not a renderable scene');
  deliveries.push(result);
  return result.meaning;
}

describe('Plan 06 semantic Scene Model', () => {
  it('is deterministic, immutable, and carries no instructional-history arrays', () => {
    const state = createEpisode({ instance: canonicalInstance() });
    const input = sceneInput(state);
    const first = projectScene(input);
    const second = projectScene(input);

    expect(first.kind).toBe('scene');
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.meaning)).toBe(true);
    for (const key of [
      'intentHistory',
      'completedBeats',
      'helpHistory',
      'replayHistory',
      'retryHistory',
      'responseProvenance',
    ]) {
      expect(first).not.toHaveProperty(key);
      expect(JSON.stringify(first)).not.toContain(`"${key}"`);
    }
  });

  it('projects the current support configuration and consequence without deciding help reset policy', () => {
    let state = atDecide();
    state = applyIntent(state, { type: 'request-help' });
    const scene = projectScene(sceneInput(state));

    expect(scene.meaning.support).toEqual(state.support);
    expect(scene.meaning.supportConsequence).toEqual({
      nextResponseSupport: null,
      lastHelp: { type: 'help', level: 'orient', beat: 'decide' },
    });
    expect(scene.derivation.sourceContext.instructional.supportConsequence)
      .toEqual(scene.meaning.supportConsequence);
  });

  it('keeps future mathematical values out of the renderable scene until established', () => {
    const initial = projectScene(sceneInput(createEpisode({ instance: canonicalInstance() })));
    expect(initial.meaning.unitRelationship.commonUnit).toBeNull();
    expect(initial.meaning.operation.rawResult).toBeNull();
    expect(initial.meaning.operation.preferredFinalForm).toBeNull();
    expect(initial.meaning.transition).toBeNull();
    expect(JSON.stringify(initial)).not.toContain('"denominator":"12"');

    const decided = applyIntent(
      atDecide(),
      { type: 'propose-common-denominator', proposed: whole(12) },
    );
    const decidedScene = projectScene(sceneInput(decided));
    expect(decidedScene.meaning.unitRelationship.commonUnit).toMatchObject({
      targetDenominator: '12',
      kind: 'valid-common-denominator',
    });
    expect(decidedScene.meaning.transition).toBeNull();
  });

  it('uses only established forms for known transition endpoints', () => {
    const state = afterLeftConversion();
    const scene = projectScene(sceneInput(state));

    expect(scene.meaning.transition).toEqual({
      type: 'equivalent-renaming',
      status: 'known-endpoints',
      changed: ['left'],
      pre: {
        left: fraction(2, 3),
        right: fraction(1, 4),
      },
      post: {
        left: fraction(8, 12),
        right: fraction(1, 4),
      },
    });
    expect(scene.meaning.quantities.left.currentForm).toEqual(fraction(8, 12));
    expect(scene.meaning.quantities.right.currentForm).toEqual(fraction(1, 4));
  });

  it('uses the immediately preceding established endpoints for the second conversion', () => {
    const state = afterBothConversions();
    const scene = projectScene(sceneInput(state));

    expect(scene.meaning.transition).toEqual({
      type: 'equivalent-renaming',
      status: 'known-endpoints',
      changed: ['right'],
      pre: {
        left: fraction(8, 12),
        right: fraction(1, 4),
      },
      post: {
        left: fraction(8, 12),
        right: fraction(3, 12),
      },
    });
  });

  it('reaches the same semantic post-state in standard, reduced, and instant modes', () => {
    const state = afterLeftConversion();
    const modes = ['standard-motion', 'reduced-motion', 'instant-test'];
    const scenes = modes.map((presentationMode) => projectScene(
      sceneInput(state, { presentationMode }),
    ));

    expect(scenes.map((scene) => scene.meaning)).toEqual([
      scenes[0].meaning,
      scenes[0].meaning,
      scenes[0].meaning,
    ]);
    expect(scenes.map((scene) => scene.presentation.mode)).toEqual(modes);
    expect(new Set(scenes.map((scene) => scene.meaning.transition.post.left.numerator))).toEqual(new Set(['8']));
  });

  it('exposes semantic inputs for a linear alternative without revealing an unestablished answer', () => {
    const scene = projectScene(sceneInput(afterLeftConversion()));

    expect(scene.meaning.quantities.left).toMatchObject({
      quantity: { exactValue: fraction(2, 3) },
      unit: { denominator: '12' },
      count: { numerator: '8' },
      whole: { kind: 'stable-unit-whole' },
    });
    expect(scene.meaning.currentTask).toMatchObject({
      beat: 'transform',
      responsibility: 'construct-equivalent-form',
      inputKind: 'fraction',
      target: 'right',
    });
    expect(scene.meaning.availableAction).toMatchObject({
      responsibility: 'construct-equivalent-form',
      inputKind: 'fraction',
      target: 'right',
    });
    expect(scene.meaning.status.episode).toBe('active');
    expect(scene.meaning.transition).toMatchObject({
      pre: { left: fraction(2, 3), right: fraction(1, 4) },
      post: { left: fraction(8, 12), right: fraction(1, 4) },
    });
    expect(scene.meaning.operation.rawResult).toBeNull();
    expect(scene.meaning.operation.preferredFinalForm).toBeNull();
  });

  it('separates an operand stable whole from a crossing result whole span', () => {
    const instance = crossingInstance();
    expect(instance.representationFacts.wholeSpan).toEqual({ lowerWhole: '1', upperWhole: '2' });
    const beforeOperation = projectScene(sceneInput(createEpisode({ instance })));

    expect(beforeOperation.meaning.quantities.left.whole).toEqual({
      kind: 'stable-unit-whole',
      id: 'left-stable-whole',
      extent: { lowerWhole: '0', upperWhole: '1' },
    });
    expect(beforeOperation.meaning.quantities.right.whole).toEqual({
      kind: 'stable-unit-whole',
      id: 'right-stable-whole',
      extent: { lowerWhole: '0', upperWhole: '1' },
    });
    expect(beforeOperation.meaning.operation.resultWholeSpan).toBeNull();

    const operation = projectScene(sceneInput(afterOperation(instance)));
    expect(operation.meaning.operation.resultWholeSpan).toEqual({ lowerWhole: '1', upperWhole: '2' });
    expect(operation.meaning.quantities.left.whole.extent).toEqual({ lowerWhole: '0', upperWhole: '1' });
    expect(operation.meaning.quantities.right.whole.extent).toEqual({ lowerWhole: '0', upperWhole: '1' });
  });

  it('refuses a number-line explicitly without inventing a symbolic continuation', () => {
    const state = createEpisode({ instance: canonicalInstance() });
    const refusal = projectScene(sceneInput(state, { representationRole: 'number-line' }));

    expect(refusal.kind).toBe('capability-refusal');
    expect(refusal.status).toBe('not-in-phase-2');
    expect(refusal.verdict).toBe('not-in-phase-2');
    expect(refusal.continuation).toBeNull();
  });

  it('refuses an ineligible valid path before a stub consumer can receive a scene', () => {
    let state = atDecide();
    state = applyIntent(state, {
      type: 'propose-common-denominator',
      proposed: whole(36),
    });
    const input = sceneInput(state);
    const refusal = projectScene(input);
    const deliveries = [];

    expect(refusal.kind).toBe('capability-refusal');
    expect(refusal.status).toBe('valid-but-outside-representation-capability');
    expect(refusal.continuation).toEqual({
      representationRole: 'symbolic',
      route: 'symbolic-continuation',
    });
    expect(() => deliverToStub(refusal, input, deliveries))
      .toThrow('capability refusal is not a renderable scene');
    expect(deliveries).toEqual([]);

    const symbolic = projectScene(sceneInput(state, { representationRole: 'symbolic' }));
    expect(symbolic.kind).toBe('scene');
    expect(symbolic.meaning.capability.activePath.rendering).toBe('ineligible');
  });

  it('keeps valid outside-authored coverage distinct from capability ineligibility', () => {
    const state = atDecide(outsideAuthoredCoverageInstance());
    const selected = applyIntent(state, {
      type: 'propose-common-denominator',
      proposed: whole(18),
    });
    expect(selected.established.commonDenominator).toMatchObject({
      kind: 'valid-but-outside-authored-coverage',
      rendering: 'eligible',
      authoredCoverage: 'outside-authored-coverage',
    });

    const scene = projectScene(sceneInput(selected));
    expect(scene.kind).toBe('scene');
    expect(scene.meaning.capability.activePath).toMatchObject({
      rendering: 'eligible',
      authoredCoverage: 'outside-authored-coverage',
    });
    expect(scene.meaning.unitRelationship.authoredCoverage).toBe('outside-authored-coverage');
  });

  it('rejects stale scenes before stub-consumer delivery', () => {
    const original = createEpisode({ instance: canonicalInstance() });
    const originalInput = sceneInput(original);
    const scene = projectScene(originalInput);
    const current = applyIntent(original, { type: 'acknowledge-encounter' });
    const currentInput = sceneInput(current);
    const deliveries = [];

    expect(isSceneCurrent(scene, currentInput)).toBe(false);
    expect(isSceneCurrent(scene, { ...originalInput, representationRole: 'symbolic' })).toBe(false);
    expect(isSceneCurrent(scene, { ...originalInput, presentationMode: 'reduced-motion' })).toBe(false);
    expect(() => deliverToStub(scene, currentInput, deliveries))
      .toThrowError(expect.objectContaining({ code: 'STALE_SCENE' }));
    expect(deliveries).toEqual([]);
    expect(assertSceneCurrent(scene, originalInput)).toBe(scene);
  });

  it('binds freshness to every content fact consumed by the projection', () => {
    const original = createEpisode({ instance: canonicalInstance() });
    const scene = projectScene(sceneInput(original));
    const changedContent = structuredClone(original);
    changedContent.content.operands.left.exactValue = fraction(3, 4);

    expect(isSceneCurrent(scene, sceneInput(changedContent))).toBe(false);

    const established = afterOperation(canonicalInstance());
    const establishedScene = projectScene(sceneInput(established));
    const changedResultFacts = structuredClone(established);
    changedResultFacts.content.representationFacts.wholeSpan = {
      lowerWhole: '2',
      upperWhole: '3',
    };

    expect(isSceneCurrent(establishedScene, sceneInput(changedResultFacts))).toBe(false);
  });

  it('replays source and instructional meaning without treating presentation as source', () => {
    const original = afterOperation(canonicalInstance());
    const envelope = createReplayEnvelope(original);
    const replayed = replayEpisode(JSON.parse(JSON.stringify(envelope)));
    const originalScene = projectScene(sceneInput(original, { presentationMode: 'reduced-motion' }));
    const replayedScene = projectScene(sceneInput(replayed, { presentationMode: 'reduced-motion' }));

    expect(replayedScene.meaning).toEqual(originalScene.meaning);
    expect(replayedScene.derivation.sourceContext.contentIdentity)
      .toEqual(originalScene.derivation.sourceContext.contentIdentity);
    expect(replayedScene.derivation.sourceContext.instructional.episodeDefinition)
      .toEqual(originalScene.derivation.sourceContext.instructional.episodeDefinition);
    expect(replayedScene.meaning.support).toEqual(originalScene.meaning.support);
    expect(envelope.learnerIntents).toEqual(original.intentHistory);
    expect(envelope).not.toHaveProperty('presentationMode');
    expect(envelope).not.toHaveProperty('scene');
  });

  it('uses one scene schema for every declared condition arm', () => {
    const base = {
      id: 'plan06-condition-fixture',
      revision: 'contract-fixture-v1',
      display: 'D-01-A',
      choreography: 'D-02-M',
      promptCadence: 'D-05-focused-key-beats',
      connectionMaking: 'CM-01-M',
    };
    const arms = [
      ['D-01-A', 'D-02-M', 'D-05-focused-key-beats', 'CM-01-M'],
      ['D-01-B', 'D-02-M', 'D-05-focused-key-beats', 'CM-01-M'],
      ['D-01-A', 'D-02-J', 'D-05-focused-key-beats', 'CM-01-M'],
      ['D-01-A', 'D-02-S', 'D-05-focused-key-beats', 'CM-01-M'],
      ['D-01-A', 'D-02-M', 'D-05-L', 'CM-01-M'],
      ['D-01-A', 'D-02-M', 'D-05-H', 'CM-01-M'],
      ['D-01-A', 'D-02-M', 'D-05-C', 'CM-01-M'],
      ['D-01-A', 'D-02-M', 'D-05-focused-key-beats', 'CM-01-N'],
      ['D-01-A', 'D-02-M', 'D-05-focused-key-beats', 'CM-01-M'],
      ['D-01-A', 'D-02-M', 'D-05-focused-key-beats', 'CM-01-E'],
    ];
    const scenes = arms.map(([display, choreography, promptCadence, connectionMaking]) => {
      const activeCondition = {
        ...base,
        id: `${display}-${choreography}-${promptCadence}-${connectionMaking}`,
        display,
        choreography,
        promptCadence,
        connectionMaking,
      };
      const state = createEpisode({ instance: canonicalInstance(), activeCondition });
      return projectScene(sceneInput(state));
    });

    expect(scenes.every((scene) => scene.kind === 'scene')).toBe(true);
    expect(new Set(scenes.map((scene) => Object.keys(scene).sort().join('|'))).size).toBe(1);
    expect(new Set(scenes.map((scene) => Object.keys(scene.meaning).sort().join('|'))).size).toBe(1);
    expect(scenes.map((scene) => scene.meaning.condition.display)).toEqual(
      arms.map(([display]) => display),
    );
  });

  it('does not import mathematical or eligibility authority', () => {
    const source = readFileSync(new URL('../src/interaction/scene.js', import.meta.url), 'utf8');
    expect(source).not.toMatch(/from ['"]\.\.\/math\//);
    expect(source).not.toMatch(/from ['"]\.\.\/content\/eligibility\.js['"];/);
    expect(source).not.toMatch(/BigInt|validateCommonDenominator|evaluatePathEligibility|evaluateInstanceEligibility/);
  });

  it('rejects non-wire inputs before projection', () => {
    const state = createEpisode({ instance: canonicalInstance() });
    const forged = structuredClone(state);
    forged.support.label = undefined;

    expect(() => projectScene(sceneInput(forged))).toThrowError(
      expect.objectContaining({ code: 'INVALID_SCENE_INPUT' }),
    );
    expect(() => projectScene(sceneInput(state, { presentationMode: 'animated' })))
      .toThrowError(SceneProjectionError);
  });

  it('keeps canonical derivation keys distinct for prototype keys and rejects sparse arrays', () => {
    const state = createEpisode({ instance: canonicalInstance() });
    const withPrototypeKey = structuredClone(state);
    withPrototypeKey.pendingResponse = JSON.parse('{"__proto__":{"marker":1}}');
    const withEmptyObject = structuredClone(state);
    withEmptyObject.pendingResponse = {};

    const keyed = projectScene(sceneInput(withPrototypeKey));
    const empty = projectScene(sceneInput(withEmptyObject));
    expect(keyed.derivation.key).not.toBe(empty.derivation.key);
    expect(Object.prototype.hasOwnProperty.call(
      keyed.derivation.sourceContext.instructional.pendingResponse,
      '__proto__',
    )).toBe(true);

    const sparse = structuredClone(state);
    sparse.intentHistory = new Array(1);
    expect(() => projectScene(sceneInput(sparse))).toThrowError(
      expect.objectContaining({ code: 'INVALID_SCENE_INPUT' }),
    );
  });
});
