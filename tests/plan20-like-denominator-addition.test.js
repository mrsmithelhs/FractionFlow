import { describe, expect, it } from 'vitest';
import {
  buildCuratedProblem,
  resolveAuthoredContent,
  resolveCuratedFixture,
  validateCuratedFixtures,
} from '../src/content/index.js';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  episodeStateSnapshot,
  getEpisodeDefinition,
  PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
  projectScene,
  replayEpisode,
} from '../src/interaction/index.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { createFractionResponseInput } from '../src/render/controls.js';
import { STRINGS } from '../src/render/strings.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

const fixtureId = 'curated-like-denominator-addition-two-sevenths-three-sevenths';
const authoringRevision = 'plan20-record-v1';
const itemId = 'two-sevenths-plus-three-sevenths';

function plan20Instance() {
  const fixture = resolveCuratedFixture(fixtureId, authoringRevision);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: {
      left: fixture.left,
      right: fixture.right,
      reviewedTransitions: [],
    },
  });
}

function atOperate(instance = plan20Instance()) {
  let state = createEpisode({
    instance,
    episodeDefinition: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
  });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-notice', matchesUnits: true });
  return state;
}

function fraction(numerator, denominator) {
  return {
    kind: 'fraction',
    numerator: String(numerator),
    denominator: String(denominator),
  };
}

describe('Plan 20 like-denominator addition', () => {
  it('keeps empty and malformed fraction submissions local, then permits corrected entry', () => {
    const document = setupMockDOM();
    try {
      const makeElement = document.createElement.bind(document);
      document.createElement = (tagName) => {
        const element = makeElement(tagName);
        element.append = (...children) => children.forEach((child) => element.appendChild(child));
        return element;
      };
      const submitted = [];
      const control = createFractionResponseInput({
        numeratorId: 'test-numerator',
        denominatorId: 'test-denominator',
        strings: STRINGS,
        onSubmit: (value) => submitted.push(value),
      });
      document.body.appendChild(control.element);
      const numerator = document.querySelector('#test-numerator');
      const denominator = document.querySelector('#test-denominator');
      const submit = control.element.querySelector('.control-submit-btn');
      const error = control.element.querySelector('[role="alert"]');

      submit.click();
      expect(error.textContent).toBe(STRINGS.operate.fractionRequired);
      expect(submitted).toEqual([]);

      numerator.value = '0';
      denominator.value = '7';
      submit.click();
      expect(error.textContent).toBe(STRINGS.operate.fractionRequired);
      expect(submitted).toEqual([]);

      numerator.value = '5.5';
      denominator.value = '14';
      submit.click();
      expect(error.textContent).toBe(STRINGS.operate.fractionRequired);
      expect(submitted).toEqual([]);

      numerator.value = '10';
      denominator.value = '14';
      submit.click();
      expect(error.textContent).toBe('');
      expect(submitted).toEqual([fraction(10, 14)]);
    } finally {
      teardownMockDOM();
    }
  });

  it('registers only the exact authored item and a definition bound to its original forms', () => {
    const authored = resolveAuthoredContent(fixtureId, authoringRevision);
    const practice = PRACTICE_TYPES.find((entry) => entry.id === 'like-denominator-addition');

    expect(authored).toMatchObject({
      itemId,
      fixtureId,
      authoringRevision,
      taskDataRevision: 'plan20-task-data-v1',
      recipe: { id: 'plan20-reviewed-like-denominator-addition', revision: '1' },
      premiseChecks: null,
      reflectionChoices: null,
    });
    expect(practice).toMatchObject({
      id: 'like-denominator-addition',
      label: 'Add fractions with the same denominator',
      setId: 'like-denominator-addition-vetted-set',
      setRevision: '1',
      items: [{ id: itemId, fixtureId, authoringRevision }],
    });
    expect(getEpisodeDefinition('phase-3-like-denominator-addition', '1'))
      .toEqual(PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION);

    const mismatched = buildCuratedProblem({
      fixture: { ...authored.fixture, id: 'another-reviewed-like-addition' },
      selector: authored.fixture.selector,
      overlays: authored.fixture.overlays,
      profileId: authored.fixture.profileId,
      candidate: {
        left: authored.fixture.left,
        right: authored.fixture.right,
        reviewedTransitions: [],
      },
    });
    expect(() => createEpisode({
      instance: mismatched,
      episodeDefinition: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
    })).toThrow('content instance is outside the Phase 2 episode family');
  });

  it('establishes an already-shared unit only after the correct Notice, without choice or conversion records', () => {
    const initial = createEpisode({
      instance: plan20Instance(),
      episodeDefinition: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
    });
    expect(initial.beatSchedule.map((entry) => entry.kind))
      .toEqual(['encounter', 'notice', 'operate', 'resolve']);
    expect(initial.established).toMatchObject({
      sharedUnit: null,
      commonDenominator: null,
      conversions: { left: null, right: null },
    });

    let state = applyIntent(initial, { type: 'acknowledge-encounter' });
    const incorrectNotice = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    expect(incorrectNotice.beat).toBe('notice');
    expect(incorrectNotice.established.sharedUnit).toBeNull();

    state = applyIntent(state, { type: 'submit-notice', matchesUnits: true });
    expect(state.beat).toBe('operate');
    expect(state.established).toMatchObject({
      commonDenominator: null,
      conversions: { left: null, right: null },
      sharedUnit: {
        kind: 'already-shared-unit',
        targetDenominator: '7',
        source: 'validated-equal-original-denominators',
        sourceForms: {
          left: fraction(2, 7),
          right: fraction(3, 7),
        },
      },
    });
  });

  it('recovers from 5/14, accepts equivalent 10/14, resolves, and reconstructs that work from replay', () => {
    let state = atOperate();
    const wrong = applyIntent(state, {
      type: 'submit-operation-result',
      proposed: fraction(5, 14),
    });
    expect(wrong.beat).toBe('operate');
    expect(wrong.lastRecovery.classification.kind).toBe('incorrect-numerator-arithmetic');
    expect(wrong.responseProvenance.at(-1).learnerAction.proposed).toEqual(fraction(5, 14));
    expect(wrong.established.sharedUnit.targetDenominator).toBe('7');

    state = applyIntent(wrong, {
      type: 'submit-operation-result',
      proposed: fraction(10, 14),
    });
    expect(state.beat).toBe('resolve');
    expect(state.established.operation).toMatchObject({
      validity: 'valid',
      kind: 'correct-unsimplified',
      proposed: fraction(10, 14),
      targetDenominator: '7',
    });
    expect(state.established.conversions).toEqual({ left: null, right: null });

    const scene = projectScene({
      state,
      representationRole: 'fraction-bar',
      presentationMode: 'instant-test',
    });
    expect(scene.meaning.unitRelationship.commonUnit).toMatchObject({
      kind: 'already-shared-unit',
      targetDenominator: '7',
      source: 'validated-equal-original-denominators',
    });
    expect(scene.meaning.operation).toMatchObject({
      currentForms: { left: fraction(2, 7), right: fraction(3, 7) },
      rawResult: fraction(10, 14),
    });
    expect(scene.meaning.currentTask.beat).toBe('resolve');

    state = applyIntent(state, {
      type: 'submit-resolution',
      proposed: fraction(10, 14),
    });
    expect(state.status).toBe('resolved');
    expect(state.beatSchedule.map((entry) => entry.kind))
      .toEqual(['encounter', 'notice', 'operate', 'resolve']);
    expect(state.completedBeats.map((entry) => entry.beat))
      .toEqual(['encounter', 'notice', 'operate', 'resolve']);
    expect(state.completedBeats.map((entry) => entry.scheduleEntryId))
      .not.toContain('reflect');
    expect(state.responseProvenance.map((entry) => entry.beat))
      .toEqual(['encounter', 'notice', 'operate', 'operate', 'resolve']);

    const envelope = createReplayEnvelope(state);
    const replayed = replayEpisode(envelope);
    expect(envelope.episodeDefinition).toEqual({ id: 'phase-3-like-denominator-addition', revision: '1' });
    expect(replayed.status).toBe('resolved');
    expect(replayed.established.sharedUnit).toEqual(state.established.sharedUnit);
    expect(replayed.established.operation.proposed).toEqual(fraction(10, 14));
    expect(episodeStateSnapshot(replayed)).toEqual(episodeStateSnapshot(state));
  });

  it('records local operation help in replay and subsequent response provenance without changing unassisted work', () => {
    const unassisted = applyIntent(atOperate(), {
      type: 'submit-operation-result',
      proposed: fraction(5, 7),
    });
    let assisted = applyIntent(atOperate(), { type: 'request-task-help' });
    expect(assisted).toMatchObject({
      beat: 'operate',
      schedulePosition: 2,
      supportHistory: [{
        type: 'task-help-request',
        beat: 'operate',
        schedulePosition: 2,
        scheduleEntryId: 'operate',
      }],
    });
    expect(assisted.intentHistory.at(-1)).toEqual({ type: 'request-task-help' });
    expect(projectScene({
      state: assisted,
      representationRole: 'fraction-bar',
      presentationMode: 'instant-test',
    }).meaning.taskHelp)
      .toEqual({ kind: 'like-denominator-operation', status: 'requested' });

    const envelope = createReplayEnvelope(assisted);
    const replayedHelp = replayEpisode(envelope);
    expect(replayedHelp.supportHistory).toEqual(assisted.supportHistory);
    expect(replayedHelp.intentHistory).toEqual(assisted.intentHistory);

    assisted = applyIntent(replayedHelp, {
      type: 'submit-operation-result',
      proposed: fraction(5, 7),
    });
    expect(assisted.responseProvenance.at(-1).supportActions).toEqual(['task-help-request']);
    expect(assisted.responseProvenance.at(-1).learnerAction.proposed).toEqual(fraction(5, 7));

    const replayedResponse = replayEpisode(createReplayEnvelope(assisted));
    expect(replayedResponse.responseProvenance).toEqual(assisted.responseProvenance);
    expect(replayedResponse.supportHistory).toEqual(assisted.supportHistory);
    expect(unassisted.responseProvenance.at(-1).supportActions).toEqual([]);
    expect(unassisted.responseProvenance.at(-1).learnerAction.proposed).toEqual(fraction(5, 7));
  });

  it('keeps Plan 20 operation help local, preserves drafts on open and close, and clears exposure on retry', () => {
    const document = setupMockDOM();
    const makeElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
      const element = makeElement(tagName);
      element.append = (...children) => children.forEach((child) => element.appendChild(child));
      return element;
    };
    const root = document.createElement('div');
    document.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    try {
      app.mount();
      root.querySelector('[data-practice-type="like-denominator-addition"]').click();
      root.querySelector('.app-visual-view .control-btn').click();
      root.querySelectorAll('.app-visual-view .control-choice-btn')[0].click();
      const numerator = root.querySelector('#operate-fraction-numerator-input');
      const denominator = root.querySelector('#operate-fraction-denominator-input');
      numerator.value = '4';
      denominator.value = '7';
      const help = root.querySelector('.app-visual-view .active-beat-controls .app-secondary-button');
      const schedulePosition = app.getState().schedulePosition;

      help.click();
      expect(root.querySelector('.active-denominator-help-cue').textContent)
        .toBe(STRINGS.operate.likeAdditionHelp);
      expect(app.getState().supportHistory).toHaveLength(1);
      expect(app.getState().supportHistory[0]).toMatchObject({
        type: 'task-help-request', beat: 'operate', schedulePosition,
      });
      expect(app.getState().helpHistory).toEqual([]);
      expect(app.getState().intentHistory.at(-1)).toEqual({ type: 'request-task-help' });
      expect(app.getReplayEnvelope().learnerIntents.at(-1)).toEqual({ type: 'request-task-help' });
      expect(app.getState().schedulePosition).toBe(schedulePosition);
      expect(numerator.value).toBe('4');
      expect(denominator.value).toBe('7');

      const exposed = app.getState();
      help.click();
      expect(root.querySelector('.active-denominator-help-cue')).toBeNull();
      expect(app.getState()).toBe(exposed);
      expect(app.getState().supportHistory).toHaveLength(1);
      expect(numerator.value).toBe('4');
      expect(denominator.value).toBe('7');

      help.click();
      expect(app.getState().supportHistory).toHaveLength(1);
      expect(app.getState().intentHistory.filter((intent) => intent.type === 'request-task-help'))
        .toHaveLength(1);
      expect(root.querySelector('.active-denominator-help-cue').textContent)
        .toBe(STRINGS.operate.likeAdditionHelp);

      numerator.value = '5';
      denominator.value = '7';
      root.querySelector('.app-visual-view .control-submit-btn').click();
      expect(app.getState().responseProvenance.at(-1).supportActions).toEqual(['task-help-request']);

      root.querySelector('.app-restart-button').click();
      expect(app.getState().beat).toBe('encounter');
      expect(app.getState().supportHistory).toEqual([]);
      expect(app.getState().intentHistory).toEqual([]);
      expect(root.querySelector('.app-support-notice').textContent).toBe('');
      expect(root.textContent).not.toContain(STRINGS.operate.likeAdditionHelp);

      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: true });
      root.querySelector('.app-visual-view .active-beat-controls .app-secondary-button').click();
      expect(app.getState().supportHistory).toHaveLength(1);
      root.querySelector('.app-return-button').click();
      expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);
      expect(app.getState().beat).toBe('encounter');
      expect(app.getState().supportHistory).toEqual([]);
      expect(app.getState().intentHistory).toEqual([]);
      expect(root.querySelector('.app-support-notice').textContent).toBe('');
      expect(root.textContent).not.toContain(STRINGS.operate.likeAdditionHelp);
      root.querySelector('[data-practice-type="like-denominator-addition"]').click();
      expect(app.getState().supportHistory).toEqual([]);
      expect(app.getState().intentHistory).toEqual([]);
      expect(root.querySelector('.active-denominator-help-cue')).toBeNull();
    } finally {
      app.destroy();
      teardownMockDOM();
    }
  });

  it('accepts the canonical 5/7 result and keeps legacy state snapshots free of Plan 20 fields', () => {
    let state = atOperate();
    state = applyIntent(state, {
      type: 'submit-operation-result',
      proposed: fraction(5, 7),
    });
    expect(state.established.operation).toMatchObject({
      validity: 'valid',
      proposed: fraction(5, 7),
    });

    const legacyInstance = validateCuratedFixtures().find((entry) => (
      entry.fixture.id === 'curated-relatively-prime-addition-non-least'
    )).instance;
    const legacy = createEpisode({ instance: legacyInstance });
    expect(legacy.established).not.toHaveProperty('sharedUnit');
    expect(episodeStateSnapshot(legacy)).not.toHaveProperty('sharedUnit');
  });
});
