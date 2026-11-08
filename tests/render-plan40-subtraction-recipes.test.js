import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import {
  PLAN40_DATA_ONLY_HOLDOUTS,
  PLAN40_DATA_ONLY_HOLDOUTS_ID,
  PLAN40_DATA_ONLY_HOLDOUTS_REVISION,
  PLAN40_RECIPE_IDS,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  PLAN40_VETTED_BATCH,
} from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE } from '../src/app/practice-types.js';
import { resolvePlan40SubtractionRecipeContext } from '../src/content/plan40-reusable-subtraction-recipes.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import { PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import {
  HIGH_SUPPORT_CONFIGURATION,
  MEDIUM_SUPPORT_CONFIGURATION,
} from '../src/interaction/support.js';
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

function startEpisode(record, support = HIGH_SUPPORT_CONFIGURATION, practiceSetId = null, practiceSetRevision = null) {
  const isHoldout = record.itemId?.includes('holdout');
  const setId = practiceSetId ?? (isHoldout ? PLAN40_DATA_ONLY_HOLDOUTS_ID : PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID);
  const setRev = practiceSetRevision ?? (isHoldout ? PLAN40_DATA_ONLY_HOLDOUTS_REVISION : PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION);
  const instance = instanceFor(record);
  const taskContext = resolvePlan40SubtractionRecipeContext(instance, record.itemId, {
    practiceSetId: setId,
    practiceSetRevision: setRev,
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

        // Accessible grouping and concise visible labels with complete accessible names
        const fieldset = container.querySelector('fieldset.control-fraction-response-wrapper');
        expect(fieldset).not.toBeNull();
        expect(fieldset.getAttribute('aria-label')).toBe(STRINGS.subtraction.amountLeftGroup);
        const labels = [...container.querySelectorAll('.control-label')].map((el) => el.textContent.trim());
        expect(labels).toEqual(['Numerator', 'Denominator']);
        const numInp = container.querySelector(container === visualContainer ? '#operate-fraction-numerator-input' : '#linear-operate-fraction-numerator-input');
        const denInp = container.querySelector(container === visualContainer ? '#operate-fraction-denominator-input' : '#linear-operate-fraction-denominator-input');
        expect(numInp.getAttribute('aria-label')).toBe(STRINGS.subtraction.numeratorAriaLabel);
        expect(denInp.getAttribute('aria-label')).toBe(STRINGS.subtraction.denominatorAriaLabel);

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
    it('renders resolved equation and success cue while omitting redundant Difference milestone in history', () => {
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

        // Previous steps disclosure contains earlier steps, but strictly omits redundant Difference milestone
        expect(completedSection.textContent).not.toContain('Difference:');
        expect(completedSection.textContent).toContain('Problem established.');
        expect(completedSection.textContent).toContain('First fraction: 1/2 = 5/10');
        expect(completedSection.textContent).toContain('Second fraction: 1/5 = 2/10');

        const details = completedSection.querySelector('details.completed-beats-history');
        expect(details).not.toBeNull();
        const summary = details.querySelector('summary.completed-beats-summary-toggle');
        // 3 milestones total (Problem established + 2 transforms) -> 2 older steps behind toggle
        expect(summary.textContent).toBe('Show previous steps (2 completed)');

        // The equation and model retain the accepted form; the banner confirms success.
        const prompt = container.querySelector('.active-beat-prompt');
        expect(prompt.textContent).toBe(STRINGS.resolve.crossingAcceptedCue);

        // Finish button is present
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

  describe('Data-only holdouts rendering suite (Option B coverage)', () => {
    it('exposes a stable operate handle until replacement, then invalidates it in both renderers', () => {
      const holdout = PLAN40_DATA_ONLY_HOLDOUTS.find(
        (r) => r.itemId === 'plan40-holdout-construct-three-fifths-one-half-10',
      );
      let state = startEpisode(holdout);
      const visualContainer = doc.createElement('div');
      const linearContainer = doc.createElement('div');
      doc.body.appendChild(visualContainer);
      doc.body.appendChild(linearContainer);
      let helpOpen = false;
      const visual = createBeatContainer({
        container: visualContainer,
        dispatchAction: () => {},
        isTaskHelpOpen: () => helpOpen,
      });
      const linear = createLinearPathRenderer({
        container: linearContainer,
        dispatchAction: () => {},
        isTaskHelpOpen: () => helpOpen,
      });
      let mounted = false;
      const updateBoth = () => {
        const scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
        if (mounted) {
          visual.update(scene);
          linear.update(scene);
        } else {
          visual.mount(scene);
          linear.mount(scene);
          mounted = true;
        }
      };
      updateBoth();
      state = applyIntent(state, { type: 'acknowledge-encounter' });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('6', '10') });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('5', '10') });
      updateBoth();

      for (const renderer of [visual, linear]) {
        const handle = renderer.getResponseRegion('operate');
        expect(handle.kind).toBe('fraction');
        expect(renderer.getResponseRegion('decide')).toBeNull();
        expect(handle.readDraft()).toMatchObject({ kind: 'fraction', numerator: '', denominator: '' });
        renderer.update(resolveRenderableScene({ state, presentationMode: 'instant-test' }));
        expect(renderer.getResponseRegion('operate')).toBe(handle);
      }
      const visualDraft = visual.getResponseRegion('operate').readDraft();
      expect(linear.getResponseRegion('operate').writeDraft(visualDraft)).toBe(true);
      expect(linear.getResponseRegion('operate').readDraft()).toEqual(visualDraft);

      const oldVisual = visual.getResponseRegion('operate');
      const oldLinear = linear.getResponseRegion('operate');
      helpOpen = true;
      updateBoth();
      expect(visual.getResponseRegion('operate')).not.toBe(oldVisual);
      expect(linear.getResponseRegion('operate')).not.toBe(oldLinear);
      expect(oldVisual.readDraft()).toBeNull();
      expect(oldLinear.readDraft()).toBeNull();
      expect(visualContainer.querySelector('#visual-subtraction-task-help')).not.toBeNull();
      expect(linearContainer.querySelector('#linear-subtraction-task-help')).not.toBeNull();

      const finalVisual = visual.getResponseRegion('operate');
      const finalLinear = linear.getResponseRegion('operate');
      visual.destroy();
      linear.destroy();
      expect(finalVisual.readDraft()).toBeNull();
      expect(finalLinear.readDraft()).toBeNull();
    });

    it('renders construct holdout across visual and linear renderers through full journey under high and medium support', () => {
      const holdout = PLAN40_DATA_ONLY_HOLDOUTS.find(
        (r) => r.itemId === 'plan40-holdout-construct-three-fifths-one-half-10',
      );
      expect(holdout).toBeDefined();
      expect(holdout.recipeId).toBe(PLAN40_RECIPE_IDS.construct);

      // Verify holdout is outside vetted practice type
      expect(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.some((i) => i.id === holdout.itemId)).toBe(false);

      for (const support of [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]) {
        // 1. Encounter
        let state = startEpisode(holdout, support);
        let scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
        let { visualContainer, linearContainer } = mountRenderers(scene);

        for (const container of [visualContainer, linearContainer]) {
          expect(container.querySelector('.active-beat-prompt').textContent).toBe(STRINGS.encounter.prompt);
          expect(container.querySelector('.active-beat-controls button').textContent).toBe(STRINGS.controls.next);
        }
        expect(visualContainer.querySelector('.fraction-bar-takeaway-track')).toBeNull();

        // 2. Transform left: 3/5 -> 6/10
        state = applyIntent(state, { type: 'acknowledge-encounter' });
        state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('6', '10') });

        // 3. Transform right: 1/2 -> 5/10
        state = applyIntent(state, { type: 'submit-equivalent-form', proposed: wireFraction('5', '10') });
        expect(state.beat).toBe('operate');

        // 4. Operate
        scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
        ({ visualContainer, linearContainer } = mountRenderers(scene));

        // Visual: Single-whole takeaway bar with 10 segments (1 remaining, 5 removed, 4 outside-start)
        const track = visualContainer.querySelector('.fraction-bar-takeaway-track');
        expect(track).not.toBeNull();
        const segments = track.querySelectorAll('.fraction-bar-segment');
        expect(segments).toHaveLength(10);
        expect(track.querySelectorAll('.fraction-bar-segment.removed')).toHaveLength(5);

        // Linear: removal status
        const removalStatus = linearContainer.querySelector('.linear-takeaway-removal-status');
        expect(removalStatus).not.toBeNull();
        expect(removalStatus.textContent).toBe('5/10 is taken away from 6/10.');

        // Response inputs: concise visible labels and complete accessible names
        for (const container of [visualContainer, linearContainer]) {
          const labels = [...container.querySelectorAll('.control-label')].map((el) => el.textContent.trim());
          expect(labels).toEqual(['Numerator', 'Denominator']);
        }

        // 5. Submit operate: 1/10
        state = applyIntent(state, { type: 'submit-subtraction-result', proposed: wireFraction('1', '10') });
        expect(state.beat).toBe('resolve');

        // 6. Resolve
        scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
        ({ visualContainer, linearContainer } = mountRenderers(scene));

        for (const container of [visualContainer, linearContainer]) {
          expect(container.querySelector('.active-beat-prompt').textContent).toBe(STRINGS.resolve.crossingAcceptedCue);
          expect(container.querySelector('.completed-beats-section').textContent).not.toContain('Difference:');
        }
      }
    });

    it('renders inspect holdout across visual and linear renderers through full journey under high and medium support', () => {
      const holdout = PLAN40_DATA_ONLY_HOLDOUTS.find(
        (r) => r.itemId === 'plan40-holdout-inspect-three-fourths-one-sixth-12',
      );
      expect(holdout).toBeDefined();
      expect(holdout.recipeId).toBe(PLAN40_RECIPE_IDS.inspect);

      for (const support of [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]) {
        // 1. Encounter
        let state = startEpisode(holdout, support);
        state = applyIntent(state, { type: 'acknowledge-encounter' });
        expect(state.beat).toBe('transform');

        // 2. Transform inspect: keep left (9/12)
        state = applyIntent(state, { type: 'keep-inspected-form' });

        // 3. Transform inspect: repair right (5/12 -> 2/12)
        let scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
        let { visualContainer } = mountRenderers(scene, () => {}, () => true);
        const repairBtn = visualContainer.querySelector('.inspect-change-button');
        expect(repairBtn).not.toBeNull();

        state = applyIntent(state, { type: 'repair-inspected-form', numerator: '2' });
        expect(state.beat).toBe('operate');

        // 4. Operate
        scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
        let { visualContainer: visOp, linearContainer: linOp } = mountRenderers(scene);

        // Visual: Single-whole takeaway bar with 12 segments (7 remaining, 2 removed, 3 outside-start)
        const track = visOp.querySelector('.fraction-bar-takeaway-track');
        expect(track).not.toBeNull();
        expect(track.querySelectorAll('.fraction-bar-segment.removed')).toHaveLength(2);

        // Linear removal status
        expect(linOp.querySelector('.linear-takeaway-removal-status').textContent).toBe(
          '2/12 is taken away from 9/12.',
        );

        // 5. Submit operate: 7/12
        state = applyIntent(state, { type: 'submit-subtraction-result', proposed: wireFraction('7', '12') });
        expect(state.beat).toBe('resolve');

        // 6. Resolve
        scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
        let { visualContainer: visRes, linearContainer: linRes } = mountRenderers(scene);

        for (const container of [visRes, linRes]) {
          expect(container.querySelector('.active-beat-prompt').textContent).toBe(STRINGS.resolve.crossingAcceptedCue);
          expect(container.querySelector('.completed-beats-section').textContent).not.toContain('Difference:');
        }
      }
    });
  });
});
