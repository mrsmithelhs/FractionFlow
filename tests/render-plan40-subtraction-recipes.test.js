import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import {
  PLAN40_RECIPE_IDS,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  PLAN40_VETTED_BATCH,
} from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { resolvePlan40SubtractionRecipeContext } from '../src/content/plan40-reusable-subtraction-recipes.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import { PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { HIGH_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';
import { resolveRenderableScene } from '../src/render/contract.js';
import { createBeatContainer } from '../src/render/beat-container.js';
import { createLinearPathRenderer } from '../src/render/linear-path.js';
import { STRINGS } from '../src/render/strings.js';

function wireFraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function instanceFor(record) {
  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] },
  });
}

function startEpisode(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const instance = instanceFor(record);
  const taskContext = resolvePlan40SubtractionRecipeContext(instance, record.itemId, {
    practiceSetId: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
    practiceSetRevision: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  });
  return createEpisode({
    instance,
    episodeDefinition: PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
    support,
    taskContext,
  });
}

describe('Plan 40 rendered subtraction recipes', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  function mountRenderers(scene, dispatch = () => {}) {
    const visualContainer = doc.createElement('div');
    const linearContainer = doc.createElement('div');
    doc.body.appendChild(visualContainer);
    doc.body.appendChild(linearContainer);

    const visual = createBeatContainer({ container: visualContainer, dispatchAction: dispatch, strings: STRINGS });
    visual.mount(scene);

    const linear = createLinearPathRenderer({ container: linearContainer, dispatchAction: dispatch, strings: STRINGS });
    linear.mount(scene);

    return { visualContainer, linearContainer, visual, linear };
  }

  describe('Encounter beat rendering across recipes', () => {
    it('shows target context for construct-equivalent recipe (e.g. Use 10 equal parts)', () => {
      const record = PLAN40_VETTED_BATCH.find((r) => r.recipeId === PLAN40_RECIPE_IDS.construct);
      const state = startEpisode(record);
      const scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
      const { visualContainer, linearContainer } = mountRenderers(scene);

      for (const container of [visualContainer, linearContainer]) {
        const targetContext = container.querySelector('.active-beat-prompt-context');
        expect(targetContext).not.toBeNull();
        expect(targetContext.textContent).toBe(STRINGS.encounter.compactTarget(record.targetDenominator));
        // No Take away button at encounter
        const buttons = Array.from(container.querySelectorAll('.active-beat-controls button'));
        expect(buttons.map((b) => b.textContent)).toContain(STRINGS.controls.next);
        expect(buttons.map((b) => b.textContent)).not.toContain(STRINGS.subtraction.takeAwayButton);
        // No takeaway bar at encounter
        expect(container.querySelector('.fraction-bar-takeaway-track')).toBeNull();
        expect(container.querySelector('.linear-takeaway-removal-status')).toBeNull();
      }
    });

    it('shows target context for inspect-keep-repair recipe (e.g. Use 12 equal parts)', () => {
      const record = PLAN40_VETTED_BATCH.find((r) => r.recipeId === PLAN40_RECIPE_IDS.inspect);
      const state = startEpisode(record);
      const scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
      const { visualContainer, linearContainer } = mountRenderers(scene);

      for (const container of [visualContainer, linearContainer]) {
        const targetContext = container.querySelector('.active-beat-prompt-context');
        expect(targetContext).not.toBeNull();
        expect(targetContext.textContent).toBe(STRINGS.encounter.compactTarget(record.targetDenominator));
      }
    });

    it('suppresses target context for identify-side-construct recipe at encounter', () => {
      const record = PLAN40_VETTED_BATCH.find((r) => r.recipeId === PLAN40_RECIPE_IDS.identify);
      const state = startEpisode(record);
      const scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
      const { visualContainer, linearContainer } = mountRenderers(scene);

      for (const container of [visualContainer, linearContainer]) {
        const targetContext = container.querySelector('.active-beat-prompt-context');
        expect(targetContext).toBeNull();
        // Standard encounter next button is still present
        const buttons = Array.from(container.querySelectorAll('.active-beat-controls button'));
        expect(buttons.map((b) => b.textContent)).toContain(STRINGS.controls.next);
      }
    });
  });

  describe('Operate beat takeaway rendering & completed beats', () => {
    it('renders single-whole takeaway bar, fraction inputs, and completed transform milestones for construct recipe', () => {
      const record = PLAN40_VETTED_BATCH.find((r) => r.itemId === 'plan40-construct-half-fifth-10');
      let state = startEpisode(record);
      // encounter -> transform(left) -> transform(right) -> operate
      state = applyIntent(state, { type: 'acknowledge-encounter' });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('5', '10') });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('2', '10') });
      expect(state.beat).toBe('operate');

      const dispatched = [];
      const scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
      const { visualContainer, linearContainer } = mountRenderers(scene, (a) => dispatched.push(a));

      // Visual: Single-whole takeaway bar
      const takeawayTrack = visualContainer.querySelector('.fraction-bar-takeaway-track');
      expect(takeawayTrack).not.toBeNull();
      const segments = takeawayTrack.querySelectorAll('.fraction-bar-segment');
      expect(segments).toHaveLength(10);
      // Left was 5/10, right was 2/10, diff is 3/10
      // 0..2: remaining; 3..4: removed; 5..9: outside-start
      for (let i = 0; i < 3; i += 1) expect(segments[i].classList.contains('remaining')).toBe(true);
      for (let i = 3; i < 5; i += 1) expect(segments[i].classList.contains('removed')).toBe(true);
      for (let i = 5; i < 10; i += 1) expect(segments[i].classList.contains('outside-start')).toBe(true);

      // Linear: Takeaway removal status text
      const removalStatus = linearContainer.querySelector('.linear-takeaway-removal-status');
      expect(removalStatus).not.toBeNull();
      expect(removalStatus.textContent).toBe('2/10 is taken away from 5/10.');

      // Both: Prompt text and fraction inputs
      for (const container of [visualContainer, linearContainer]) {
        const prompt = container.querySelector('.active-beat-prompt');
        expect(prompt.textContent).toBe(STRINGS.subtraction.howMuchLeft);

        const numInput = container.querySelector('.control-fraction-input');
        expect(numInput).not.toBeNull();
        const submitBtn = container.querySelector('.control-submit-btn');
        expect(submitBtn).not.toBeNull();

        // Check completed beats history
        const completedSection = container.querySelector('.completed-beats-section');
        const historyText = completedSection.textContent;
        expect(historyText).toContain('Problem established.');
        expect(historyText).toContain('First fraction: 1/2 = 5/10');
        expect(historyText).toContain('Second fraction: 1/5 = 2/10');
        expect(historyText).not.toContain('Difference:');
      }

      // Test input dispatch in visual container
      const numInput = visualContainer.querySelector('#operate-fraction-numerator-input');
      const denInput = visualContainer.querySelector('#operate-fraction-denominator-input');
      const submitBtn = visualContainer.querySelector('.control-submit-btn');
      numInput.value = '3';
      denInput.value = '10';
      submitBtn.click();

      expect(dispatched).toHaveLength(1);
      expect(dispatched[0]).toEqual({
        type: 'submit-subtraction-result',
        proposed: { kind: 'fraction', numerator: '3', denominator: '10' },
      });
    });

    it('renders single-whole takeaway bar and single transform milestone for identify recipe', () => {
      const record = PLAN40_VETTED_BATCH.find((r) => r.itemId === 'plan40-identify-five-sixths-one-third-6');
      let state = startEpisode(record);
      // encounter -> decide -> transform(right) -> operate
      state = applyIntent(state, { type: 'acknowledge-encounter' });
      state = applyIntent(state, { type: 'select-renaming-side', side: 'right' });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('2', '6') });
      expect(state.beat).toBe('operate');

      const scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
      const { visualContainer, linearContainer } = mountRenderers(scene);

      for (const container of [visualContainer, linearContainer]) {
        const completedSection = container.querySelector('.completed-beats-section');
        const historyText = completedSection.textContent;
        expect(historyText).toContain('Problem established.');
        // Only the right side was changed (1/3 -> 2/6); left was already 5/6
        expect(historyText).toContain('Second fraction: 1/3 = 2/6');
        expect(historyText).not.toContain('First fraction:');
      }
    });
  });

  describe('Resolve beat rendering & history disclosure', () => {
    it('renders Difference summary, history disclosure toggle, and That is right button', () => {
      const record = PLAN40_VETTED_BATCH.find((r) => r.itemId === 'plan40-construct-half-fifth-10');
      let state = startEpisode(record);
      state = applyIntent(state, { type: 'acknowledge-encounter' });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('5', '10') });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('2', '10') });
      state = applyIntent(state, { type: 'submit-subtraction-result', proposed: wireFraction('3', '10') });
      expect(state.beat).toBe('resolve');

      const dispatched = [];
      const scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
      const { visualContainer, linearContainer } = mountRenderers(scene, (a) => dispatched.push(a));

      for (const container of [visualContainer, linearContainer]) {
        const completedSection = container.querySelector('.completed-beats-section');
        expect(completedSection).not.toBeNull();

        // Disclosure toggle exists with count of previous steps (3 completed)
        const details = completedSection.querySelector('details.completed-beats-history');
        expect(details).not.toBeNull();
        const summary = details.querySelector('summary.completed-beats-summary-toggle');
        expect(summary.textContent).toBe('Show previous steps (3 completed)');

        // Latest milestone is the Difference
        const latest = completedSection.querySelector('.completed-beat-summary-latest');
        expect(latest).not.toBeNull();
        expect(latest.textContent).toContain('Difference: 3/10');

        // Resolve prompt and finish button
        const finishBtn = container.querySelector('.active-beat-controls button');
        expect(finishBtn).not.toBeNull();
        expect(finishBtn.textContent).toBe(STRINGS.resolve.finishButton);
      }

      // Clicking finish dispatches finish-compact-episode
      const finishBtn = visualContainer.querySelector('.active-beat-controls button');
      finishBtn.click();
      expect(dispatched).toHaveLength(1);
      expect(dispatched[0]).toEqual({ type: 'finish-compact-episode' });
    });
  });
});
