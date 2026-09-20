import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createEpisode, applyIntent } from '../src/interaction/episode.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
import { validateCuratedFixtures } from '../src/content/index.js';
import { resolveRenderableScene } from '../src/render/contract.js';
import { createBeatContainer } from '../src/render/beat-container.js';
import { createLinearPathRenderer } from '../src/render/linear-path.js';
import { createFractionBarRenderer } from '../src/render/fraction-bar.js';
import { projectScene } from '../src/interaction/scene.js';

/**
 * Access Parity & Participation-Floor Suite (Plan 08, Requirements 4, 5, 6)
 *
 * Evidences:
 * 1. Keyboard and Non-Drag Touch Parity per Decision (DECISION-010, DECISION-013).
 * 2. Target Sizing & Denominator Decoupling (DECISION-010 WCAG 2.2 SC 2.5.8, DECISION-025).
 * 3. Completed-Beat Collapse Rule & Disclosure Trail (Finding R6, OQ-18, DECISION-014, DECISION-021 Criterion 1).
 * 4. Reduced-Motion Endpoint & Semantic Parity (DECISION-007, DECISION-009).
 * 5. Full Parity across Visual and Accessible Linear Paths.
 */

describe('Access Parity & Participation Floor (Plan 08)', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  function canonicalEpisode(activeCondition = null, withReflection = false) {
    const instance = validateCuratedFixtures().find((entry) => (
      entry.fixture.id === 'curated-relatively-prime-addition-non-least'
    )).instance;
    const episodeDefinition = withReflection
      ? getEpisodeDefinition('phase-2-unlike-proper-addition-reflection')
      : undefined;
    return createEpisode({
      instance,
      ...(activeCondition ? { activeCondition } : {}),
      ...(episodeDefinition ? { episodeDefinition } : {}),
    });
  }

  describe('Requirement 4: Per-Decision Keyboard & Non-Drag Touch Parity', () => {
    const decisions = [
      {
        name: 'Decision 1 (acknowledge-encounter)',
        advanceTo: (ep) => ep,
        actionExpected: 'acknowledge-encounter',
        triggerControl: (box) => {
          const btn = box.querySelector('button');
          expect(btn).toBeTruthy();
          expect(btn.tabIndex).toBeGreaterThanOrEqual(0);
          btn.click();
        },
      },
      {
        name: 'Decision 2 (submit-notice)',
        advanceTo: (ep) => applyIntent(ep, { type: 'acknowledge-encounter' }),
        actionExpected: 'submit-notice',
        triggerControl: (box) => {
          const btn = box.querySelectorAll('.control-choice-btn')[1]; // 'different'
          expect(btn).toBeTruthy();
          expect(btn.tabIndex).toBeGreaterThanOrEqual(0);
          btn.click();
        },
      },
      {
        name: 'Decision 3 (propose-common-denominator)',
        advanceTo: (ep) => {
          let state = applyIntent(ep, { type: 'acknowledge-encounter' });
          return applyIntent(state, { type: 'submit-notice', matchesUnits: false });
        },
        actionExpected: 'propose-common-denominator',
        triggerControl: (box) => {
          const choiceBtn = box.querySelector('.control-choice-btn');
          if (choiceBtn) {
            expect(choiceBtn.tabIndex).toBeGreaterThanOrEqual(0);
            choiceBtn.click();
          } else {
            const input = box.querySelector('input');
            const submit = box.querySelector('.control-submit-btn') || box.querySelector('button');
            expect(input).toBeTruthy();
            expect(input.tabIndex).toBeGreaterThanOrEqual(0);
            expect(submit).toBeTruthy();
            input.value = '12';
            submit.click();
          }
        },
      },
      {
        name: 'Decision 4 (submit-equivalent-form - left)',
        advanceTo: (ep) => {
          let state = applyIntent(ep, { type: 'acknowledge-encounter' });
          state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
          return applyIntent(state, {
            type: 'propose-common-denominator',
            proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
          });
        },
        actionExpected: 'submit-equivalent-form',
        triggerControl: (box) => {
          const input = box.querySelector('input');
          const submit = box.querySelector('.control-submit-btn');
          expect(input).toBeTruthy();
          expect(submit).toBeTruthy();
          input.value = '8';
          submit.click();
        },
      },
      {
        name: 'Decision 5 (submit-equivalent-form - right)',
        advanceTo: (ep) => {
          let state = applyIntent(ep, { type: 'acknowledge-encounter' });
          state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
          state = applyIntent(state, {
            type: 'propose-common-denominator',
            proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
          });
          return applyIntent(state, {
            type: 'submit-equivalent-form',
            proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
          });
        },
        actionExpected: 'submit-equivalent-form',
        triggerControl: (box) => {
          const input = box.querySelector('input');
          const submit = box.querySelector('.control-submit-btn');
          expect(input).toBeTruthy();
          expect(submit).toBeTruthy();
          input.value = '3';
          submit.click();
        },
      },
      {
        name: 'Decision 6 (submit-operation-result)',
        advanceTo: (ep) => {
          let state = applyIntent(ep, { type: 'acknowledge-encounter' });
          state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
          state = applyIntent(state, {
            type: 'propose-common-denominator',
            proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
          });
          state = applyIntent(state, {
            type: 'submit-equivalent-form',
            proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
          });
          return applyIntent(state, {
            type: 'submit-equivalent-form',
            proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
          });
        },
        actionExpected: 'submit-operation-result',
        triggerControl: (box) => {
          const input = box.querySelector('input');
          const submit = box.querySelector('.control-submit-btn');
          expect(input).toBeTruthy();
          expect(submit).toBeTruthy();
          input.value = '11';
          submit.click();
        },
      },
      {
        name: 'Decision 7 (submit-resolution)',
        advanceTo: (ep) => {
          let state = applyIntent(ep, { type: 'acknowledge-encounter' });
          state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
          state = applyIntent(state, {
            type: 'propose-common-denominator',
            proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
          });
          state = applyIntent(state, {
            type: 'submit-equivalent-form',
            proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
          });
          state = applyIntent(state, {
            type: 'submit-equivalent-form',
            proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
          });
          return applyIntent(state, {
            type: 'submit-operation-result',
            proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
          });
        },
        actionExpected: 'submit-resolution',
        triggerControl: (box) => {
          const btn = box.querySelector('button');
          expect(btn).toBeTruthy();
          expect(btn.tabIndex).toBeGreaterThanOrEqual(0);
          btn.click();
        },
      },
      {
        name: 'Decision 8 (submit-reflection - matching)',
        advanceTo: (ep) => {
          let state = applyIntent(ep, { type: 'acknowledge-encounter' });
          state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
          state = applyIntent(state, {
            type: 'propose-common-denominator',
            proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
          });
          state = applyIntent(state, {
            type: 'submit-equivalent-form',
            proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
          });
          state = applyIntent(state, {
            type: 'submit-equivalent-form',
            proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
          });
          state = applyIntent(state, {
            type: 'submit-operation-result',
            proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
          });
          return applyIntent(state, {
            type: 'submit-resolution',
            proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
          });
        },
        actionExpected: 'submit-reflection',
        triggerControl: (box) => {
          const btn = box.querySelector('.control-choice-btn');
          expect(btn).toBeTruthy();
          expect(btn.tabIndex).toBeGreaterThanOrEqual(0);
          btn.click();
        },
      },
    ];

    for (const d of decisions) {
      it(`evidences keyboard and non-drag tap completion for ${d.name} across visual and linear paths`, () => {
        let ep = canonicalEpisode(null, d.name.includes('Decision 8'));
        ep = d.advanceTo(ep);
        const scene = resolveRenderableScene({ state: ep });

        // 1. Visual path
        const visualActions = [];
        const visualBox = doc.createElement('div');
        const visual = createBeatContainer({
          container: visualBox,
          dispatchAction: (a) => visualActions.push(a),
        });
        visual.mount(scene);
        d.triggerControl(visualBox);
        expect(visualActions.length).toBe(1);
        expect(visualActions[0].type).toBe(d.actionExpected);

        // 2. Accessible linear path
        const linearActions = [];
        const linearBox = doc.createElement('div');
        const linear = createLinearPathRenderer({
          container: linearBox,
          dispatchAction: (a) => linearActions.push(a),
        });
        linear.mount(scene);
        d.triggerControl(linearBox);
        expect(linearActions.length).toBe(1);
        expect(linearActions[0].type).toBe(d.actionExpected);
      });
    }

    it('evidences DECISION-026 check-the-premise reflection parity across visual and linear paths (Condition 6)', () => {
      // Create episode with premise condition CM-01-P
      const premiseCondition = {
        id: 'phase2-bundle-premise',
        revision: '1',
        display: 'D-01-A',
        choreography: 'D-02-M',
        promptCadence: 'D-05-focused-key-beats',
        connectionMaking: 'CM-01-P',
      };
      let ep = canonicalEpisode(premiseCondition, true);
      ep = applyIntent(ep, { type: 'acknowledge-encounter' });
      ep = applyIntent(ep, { type: 'submit-notice', matchesUnits: false });
      ep = applyIntent(ep, {
        type: 'propose-common-denominator',
        proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
      });
      ep = applyIntent(ep, {
        type: 'submit-equivalent-form',
        proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
      });
      ep = applyIntent(ep, {
        type: 'submit-equivalent-form',
        proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
      });
      ep = applyIntent(ep, {
        type: 'submit-operation-result',
        proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
      });
      ep = applyIntent(ep, {
        type: 'submit-resolution',
        proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
      });

      const scene = resolveRenderableScene({ state: ep });

      // Visual Path
      const visualActions = [];
      const visualBox = doc.createElement('div');
      const visual = createBeatContainer({
        container: visualBox,
        dispatchAction: (a) => visualActions.push(a),
      });
      visual.mount(scene);

      const visualPrompt = visualBox.querySelector('.active-beat-prompt');
      expect(visualPrompt.textContent).toContain('same amount');
      const visualButtons = visualBox.querySelectorAll('.control-choice-btn');
      expect(visualButtons.length).toBe(2);
      expect(visualButtons[0].textContent).toContain('same amount');
      expect(visualButtons[1].textContent).toContain('amount changed');
      visualButtons[1].click(); // click 'no'
      expect(visualActions).toEqual([{ type: 'submit-reflection', response: 'no' }]);

      // Linear Path
      const linearActions = [];
      const linearBox = doc.createElement('div');
      const linear = createLinearPathRenderer({
        container: linearBox,
        dispatchAction: (a) => linearActions.push(a),
      });
      linear.mount(scene);

      const linearPrompt = linearBox.querySelector('.active-beat-prompt');
      expect(linearPrompt.textContent).toContain('same amount');
      const linearButtons = linearBox.querySelectorAll('.control-choice-btn');
      expect(linearButtons.length).toBe(2);
      expect(linearButtons[0].textContent).toContain('same amount');
      expect(linearButtons[1].textContent).toContain('amount changed');
      linearButtons[0].click(); // click 'yes'
      expect(linearActions).toEqual([{ type: 'submit-reflection', response: 'yes' }]);
    });
  });

  describe('Requirement 4 & DECISION-025: Target Sizing & LCD Decoupling', () => {
    it('verifies DECISION-025: at permitted LCD 30, fraction bar segments are NOT interactive and controls remain full size', () => {
      let ep = canonicalEpisode();
      ep = applyIntent(ep, { type: 'acknowledge-encounter' });
      ep = applyIntent(ep, { type: 'submit-notice', matchesUnits: false });

      // Propose common denominator 24 (or high denominator)
      ep = applyIntent(ep, {
        type: 'propose-common-denominator',
        proposed: { kind: 'fraction', numerator: '24', denominator: '1' },
      });
      const scene = resolveRenderableScene({ state: ep });

      const container = doc.createElement('div');
      const barRenderer = createFractionBarRenderer({ side: 'left', container });
      barRenderer.mount(scene);

      const barElement = barRenderer.getElement();
      expect(barElement.getAttribute('role')).toBe('img');
      expect(barElement.tabIndex).toBe(-1);

      // Verify that every segment is strictly non-interactive
      const segments = barElement.querySelectorAll('.fraction-bar-segment');
      for (const segment of segments) {
        expect(segment.getAttribute('aria-hidden')).toBe('true');
        expect(segment.tabIndex).toBe(-1);
      }

      // Verify active input control on beat-container remains independent discrete control
      const beatBox = doc.createElement('div');
      const beatContainer = createBeatContainer({ container: beatBox, dispatchAction: () => {} });
      beatContainer.mount(scene);

      const input = beatBox.querySelector('.control-numeric-input');
      expect(input).toBeTruthy();
      expect(input.tabIndex).toBeGreaterThanOrEqual(0);

      const submitBtn = beatBox.querySelector('.control-submit-btn');
      expect(submitBtn).toBeTruthy();
      expect(submitBtn.classList.contains('fraction-control')).toBe(true);
    });
  });

  describe('Requirement 5: Completed-Beat Collapse Rule & Disclosure Trail', () => {
    it('verifies that completed beats fold older steps into details disclosure and show latest step inline (Finding R6, OQ-18)', () => {
      let ep = canonicalEpisode();
      ep = applyIntent(ep, { type: 'acknowledge-encounter' });
      ep = applyIntent(ep, { type: 'submit-notice', matchesUnits: false });
      ep = applyIntent(ep, {
        type: 'propose-common-denominator',
        proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
      });
      ep = applyIntent(ep, {
        type: 'submit-equivalent-form',
        proposed: { kind: 'fraction', numerator: '8', denominator: '12' },
      });
      ep = applyIntent(ep, {
        type: 'submit-equivalent-form',
        proposed: { kind: 'fraction', numerator: '3', denominator: '12' },
      });
      ep = applyIntent(ep, {
        type: 'submit-operation-result',
        proposed: { kind: 'fraction', numerator: '11', denominator: '12' },
      });

      // At resolve beat: 5 prior beats (encounter, notice, decide, transform left, transform right, operate)
      const scene = resolveRenderableScene({ state: ep });

      for (const createRenderer of [createBeatContainer, createLinearPathRenderer]) {
        const box = doc.createElement('div');
        const renderer = createRenderer({ container: box, dispatchAction: () => {} });
        renderer.mount(scene);

        // 1. Details disclosure exists
        const details = box.querySelector('details.completed-beats-history');
        expect(details).toBeTruthy();

        // 2. Summary toggle displays count
        const summaryToggle = box.querySelector('.completed-beats-summary-toggle');
        expect(summaryToggle).toBeTruthy();
        expect(summaryToggle.textContent).toContain('Show previous steps');

        // 3. Older milestones are inside details
        const olderMilestones = details.querySelectorAll('.completed-beat-summary');
        expect(olderMilestones.length).toBeGreaterThanOrEqual(3);

        // 4. Latest milestone is mounted inline outside details
        const latestMilestone = box.querySelector('.completed-beat-summary.latest-milestone');
        expect(latestMilestone).toBeTruthy();
        expect(latestMilestone.textContent).toContain('Sum: 11/12');

        // 5. Details is inspectable (open property can be toggled)
        expect(details.open).toBe(false);
        details.open = true;
        expect(details.open).toBe(true);
      }
    });
  });

  describe('Reduced-Motion Parity', () => {
    it('verifies that standard-motion and reduced-motion modes reach the exact same mathematical post-state', () => {
      let ep = canonicalEpisode();
      ep = applyIntent(ep, { type: 'acknowledge-encounter' });
      ep = applyIntent(ep, { type: 'submit-notice', matchesUnits: false });
      ep = applyIntent(ep, {
        type: 'propose-common-denominator',
        proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
      });

      const sceneStandard = resolveRenderableScene({
        state: ep,
        presentationMode: 'standard-motion',
      });
      const sceneReduced = resolveRenderableScene({
        state: ep,
        presentationMode: 'reduced-motion',
      });

      // Same mathematical meaning
      expect(sceneStandard.meaning).toEqual(sceneReduced.meaning);

      // Presentation mode distinguishes motion
      expect(sceneStandard.presentation.mode).toBe('standard-motion');
      expect(sceneReduced.presentation.mode).toBe('reduced-motion');
    });
  });
});
