import { afterEach, describe, expect, it } from 'vitest';
import {
  PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE,
  PLAN40_PRACTICE_TYPES_V9,
  PRACTICE_TYPES,
} from '../src/app/practice-types.js';
import { createFractionFlowApp } from '../src/app/app.js';
import {
  PLAN40_RECIPE_IDS,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2,
  PLAN40_DATA_ONLY_HOLDOUT_SET,
} from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 40 app shell subtraction recipes integration', () => {
  afterEach(() => {
    teardownMockDOM();
  });

  describe('Practice type registration and invariants', () => {
    it('registers PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE in PRACTICE_TYPES with all 17 vetted items', () => {
      expect(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.id).toBe('unlike-denominator-subtraction');
      expect(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.label).toBe('Subtract fractions with different denominators');
      expect(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.setId).toBe('unlike-subtraction-vetted-set');
      expect(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.setRevision).toBe('2');
      expect(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items).toHaveLength(17);
      expect(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.map((it) => it.id)).toEqual(
        PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2.itemIds,
      );

      // Verify holdouts are excluded
      expect(
        PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.some((it) => PLAN40_DATA_ONLY_HOLDOUT_SET.itemIds.includes(it.id)),
      ).toBe(false);

      // Verify registration in PRACTICE_TYPES and PLAN40_PRACTICE_TYPES_V9
      const registered = PRACTICE_TYPES.find((pt) => pt.id === 'unlike-denominator-subtraction');
      expect(registered).toBe(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE);
      expect(PLAN40_PRACTICE_TYPES_V9).toContain(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE);
    });

    it('renders a choice button on the entry page that launches the subtraction practice set', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({
        root,
        practiceTypes: PRACTICE_TYPES,
        presentationMode: 'instant-test',
        navigationMode: 'legacy-acknowledged',
      });
      app.mount();

      openChooser(root); const choiceBtn = root.querySelector('[data-practice-type="unlike-denominator-subtraction"]');
      expect(choiceBtn).not.toBeNull();
      expect(choiceBtn.textContent).toBe('Subtract fractions with different denominators');

      choiceBtn.click();
      expect(app.getState().beat).toBe('encounter');
      expect(app.getState().episodeDefinition.id).toBe('phase-3-reusable-subtraction-recipes');
      expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(true);
      expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(false);

      app.destroy();
    });
  });

  describe('Mounted episode journeys across recipes', () => {
    it('runs construct-equivalent journey with Option B focus, draft preservation, subtraction help, recovery, and completion', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const singleItemType = Object.freeze({
        ...PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE,
        items: Object.freeze([
          PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.find((it) => it.id === 'plan40-construct-half-fifth-10'),
        ]),
      });

      const app = createFractionFlowApp({
        root,
        practiceTypes: [singleItemType],
        presentationMode: 'instant-test',
        navigationMode: 'legacy-acknowledged',
      });
      app.mount();

      // Launch practice
      openChooser(root); root.querySelector('[data-practice-type="unlike-denominator-subtraction"]').click();
      const host = () => root.querySelector('.app-visual-view');
      const activeControls = () => host().querySelector('.active-beat-controls');

      // 1. Encounter beat
      expect(app.getState().beat).toBe('encounter');
      expect(root.querySelector('.app-replay-button').hidden).toBe(true);
      expect(root.querySelector('.app-support-controls .app-secondary-button').hidden).toBe(true);
      activeControls().querySelector('.control-btn').click();

      // 2. Transform Left beat (1/2 -> 5/10)
      expect(app.getState().beat).toBe('transform');
      expect(app.getState().expectedResponse.target).toBe('left');
      const leftInput = host().querySelector('#transform-num-input-left');
      leftInput.value = '5';
      leftInput.parentNode.parentNode.querySelector('.control-submit-btn').click();

      // 3. Transform Right beat (1/5 -> 2/10)
      expect(app.getState().beat).toBe('transform');
      expect(app.getState().expectedResponse.target).toBe('right');
      const rightInput = host().querySelector('#transform-num-input-right');
      rightInput.value = '2';
      rightInput.parentNode.parentNode.querySelector('.control-submit-btn').click();

      // 4. Transition to Operate Beat — Option B Focus Choreography
      expect(app.getState().beat).toBe('operate');
      const numInput = host().querySelector('#operate-fraction-numerator-input');
      const denInput = host().querySelector('#operate-fraction-denominator-input');
      expect(numInput).not.toBeNull();
      expect(denInput).not.toBeNull();
      expect(document.activeElement).toBe(numInput);

      // Replay button must remain hidden and disabled at operate
      const replayBtn = root.querySelector('.app-replay-button');
      expect(replayBtn.hidden).toBe(true);
      expect(replayBtn.disabled).toBe(true);

      // 5. Test Draft Preservation across View Switching
      numInput.value = '3';
      denInput.value = '10';
      // Toggle to linear view
      root.querySelector('.app-view-toggle').click();
      const linearHost = root.querySelector('.app-linear-view');
      const linearNumInput = linearHost.querySelector('#linear-operate-fraction-numerator-input');
      const linearDenInput = linearHost.querySelector('#linear-operate-fraction-denominator-input');
      expect(linearNumInput.value).toBe('3');
      expect(linearDenInput.value).toBe('10');
      // Toggle back to visual view
      root.querySelector('.app-view-toggle').click();
      expect(host().querySelector('#operate-fraction-numerator-input').value).toBe('3');
      expect(host().querySelector('#operate-fraction-denominator-input').value).toBe('10');

      // 6. Test Subtraction Task Help in Operate Beat
      const helpBtn = activeControls().querySelector('.app-secondary-button');
      expect(helpBtn).not.toBeNull();
      expect(helpBtn.textContent).toBe('Need help?');
      expect(helpBtn.getAttribute('aria-expanded')).toBe('false');

      // Click to open help
      helpBtn.click();
      expect(helpBtn.textContent).toBe('Close help');
      expect(helpBtn.getAttribute('aria-expanded')).toBe('true');
      expect(helpBtn.getAttribute('aria-controls')).toBe('visual-subtraction-task-help');
      const helpText = host().querySelector('#visual-subtraction-task-help');
      expect(helpText).not.toBeNull();
      expect(helpText.textContent).toContain('Count only the shaded parts without removal marks.');
      expect(document.activeElement).toBe(helpBtn);

      // Click to close help
      helpBtn.click();
      expect(helpBtn.textContent).toBe('Need help?');
      expect(helpBtn.getAttribute('aria-expanded')).toBe('false');
      expect(host().querySelector('#visual-subtraction-task-help')).toBeNull();

      // 7. Test Incorrect Subtraction Result Recovery
      const operateSubmit = activeControls().querySelector('.control-submit-btn');
      host().querySelector('#operate-fraction-numerator-input').value = '99';
      host().querySelector('#operate-fraction-denominator-input').value = '10';
      operateSubmit.click();

      expect(app.getState().beat).toBe('operate');
      expect(app.getState().lastRecovery?.beat).toBe('operate');
      expect(app.getState().lastRecovery?.classification?.kind).toBe('incorrect-subtraction-result');
      const recoveryFeedback = host().querySelector('.recovery-feedback');
      expect(recoveryFeedback).not.toBeNull();
      expect(recoveryFeedback.textContent).toBe('Check the parts left. Try again.');
      // Focus returns to numerator input
      expect(document.activeElement).toBe(host().querySelector('#operate-fraction-numerator-input'));

      // 8. Submit Correct Subtraction Result (3/10)
      host().querySelector('#operate-fraction-numerator-input').value = '3';
      host().querySelector('#operate-fraction-denominator-input').value = '10';
      activeControls().querySelector('.control-submit-btn').click();

      // 9. Resolve Beat
      expect(app.getState().beat).toBe('resolve');
      expect(root.querySelector('.app-support-controls .app-secondary-button').hidden).toBe(true);
      expect(replayBtn.hidden).toBe(true);

      const finishBtn = activeControls().querySelector('button');
      expect(finishBtn).not.toBeNull();
      expect(finishBtn.textContent).toBe('Finish');
      expect(document.activeElement).toBe(finishBtn);

      // Finish problem
      finishBtn.click();
      expect(app.getState().status).toBe('resolved');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true); // Single item set has no next
      app.destroy();
    });

    it('runs identify-side-construct journey with decide beat, side choice help, replay suppression at operate/resolve', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const singleItemType = Object.freeze({
        ...PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE,
        items: Object.freeze([
          PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.find((it) => it.id === 'plan40-identify-five-sixths-one-third-6'),
        ]),
      });

      const app = createFractionFlowApp({
        root,
        practiceTypes: [singleItemType],
        presentationMode: 'instant-test',
        navigationMode: 'legacy-acknowledged',
      });
      app.mount();

      openChooser(root); root.querySelector('[data-practice-type="unlike-denominator-subtraction"]').click();
      const host = () => root.querySelector('.app-visual-view');
      const activeControls = () => host().querySelector('.active-beat-controls');

      // 1. Encounter Beat: Compact target must be suppressed
      expect(app.getState().beat).toBe('encounter');
      expect(root.querySelector('.active-beat-prompt-context')).toBeNull();
      expect(root.textContent).not.toContain('Use 6 equal parts.');
      activeControls().querySelector('.control-btn').click();

      // 2. Decide Beat: Side selection
      expect(app.getState().beat).toBe('decide');
      // Decide help button
      const decideHelp = activeControls().querySelector('.app-secondary-button');
      expect(decideHelp).not.toBeNull();
      decideHelp.click();
      expect(root.textContent).toContain('Compare each bottom number with 6.');
      decideHelp.click();

      // Test wrong side choice retry
      const sideChoices = activeControls().querySelectorAll('.nested-side-choice');
      expect(sideChoices).toHaveLength(2);
      sideChoices[0].click(); // Left side is already 5/6!
      expect(app.getState().beat).toBe('decide');
      expect(app.getState().lastRecovery?.classification?.kind).toBe('side-choice-needs-retry');

      // Choose correct side (right)
      activeControls().querySelectorAll('.nested-side-choice')[1].click();

      // 3. Transform Beat (1/3 -> 2/6)
      expect(app.getState().beat).toBe('transform');
      expect(app.getState().expectedResponse.target).toBe('right');
      const rightInput = host().querySelector('#transform-num-input-right');
      rightInput.value = '2';
      rightInput.parentNode.parentNode.querySelector('.control-submit-btn').click();

      // 4. Operate Beat: Takeaway bar shown, Replay button MUST be hidden and disabled!
      expect(app.getState().beat).toBe('operate');
      const replayBtn = root.querySelector('.app-replay-button');
      expect(replayBtn.hidden).toBe(true);
      expect(replayBtn.disabled).toBe(true);

      // Solve: 5/6 - 2/6 = 3/6
      const numInput = host().querySelector('#operate-fraction-numerator-input');
      const denInput = host().querySelector('#operate-fraction-denominator-input');
      numInput.value = '3';
      denInput.value = '6';
      activeControls().querySelector('.control-submit-btn').click();

      // 5. Resolve Beat: Replay button MUST still be hidden and disabled!
      expect(app.getState().beat).toBe('resolve');
      expect(replayBtn.hidden).toBe(true);
      expect(replayBtn.disabled).toBe(true);

      activeControls().querySelector('button').click();
      expect(app.getState().status).toBe('resolved');
      app.destroy();
    });

    it('runs inspect-keep-repair journey with candidate evaluation, repair, operate, and resolve', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const singleItemType = Object.freeze({
        ...PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE,
        items: Object.freeze([
          PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.find((it) => it.id === 'plan40-inspect-two-thirds-one-fourth-12'),
        ]),
      });

      const app = createFractionFlowApp({
        root,
        practiceTypes: [singleItemType],
        presentationMode: 'instant-test',
        navigationMode: 'legacy-acknowledged',
      });
      app.mount();

      openChooser(root); root.querySelector('[data-practice-type="unlike-denominator-subtraction"]').click();
      const host = () => root.querySelector('.app-visual-view');
      const activeControls = () => host().querySelector('.active-beat-controls');

      // 1. Encounter
      expect(app.getState().beat).toBe('encounter');
      activeControls().querySelector('.control-btn').click();

      // 2. Transform: Inspect left candidate (5/12 for 2/3) - invalid candidate, repair it
      expect(app.getState().beat).toBe('transform');
      expect(app.getState().expectedResponse.target).toBe('left');
      const changeBtn = activeControls().querySelector('.inspect-change-button');
      expect(changeBtn).not.toBeNull();
      changeBtn.click();

      // Repair left candidate to 8/12
      const leftInput = host().querySelector('#transform-num-input-left');
      expect(leftInput).not.toBeNull();
      leftInput.value = '8';
      leftInput.parentNode.parentNode.querySelector('.control-submit-btn').click();

      // Transform: Inspect right candidate (3/12 for 1/4) - valid candidate, keep it
      expect(app.getState().beat).toBe('transform');
      expect(app.getState().expectedResponse.target).toBe('right');
      const keepRightBtn = [...activeControls().querySelectorAll('button')].find(
        (b) => b.getAttribute('aria-label') === 'Keep new fraction 3 over 12',
      );
      expect(keepRightBtn).not.toBeNull();
      keepRightBtn.click();

      // 3. Operate: 8/12 - 3/12 = 5/12
      expect(app.getState().beat).toBe('operate');
      const numInput = host().querySelector('#operate-fraction-numerator-input');
      const denInput = host().querySelector('#operate-fraction-denominator-input');
      numInput.value = '5';
      denInput.value = '12';
      activeControls().querySelector('.control-submit-btn').click();

      // 4. Resolve
      expect(app.getState().beat).toBe('resolve');
      activeControls().querySelector('button').click();
      expect(app.getState().status).toBe('resolved');
      app.destroy();
    });
  });

  describe('Problem advancement and set completion', () => {
    it('advances through multiple problems and displays exhaustion on set finish', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      // Two-item subset for testing advancement and exhaustion
      const twoItemType = Object.freeze({
        ...PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE,
        items: Object.freeze(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.slice(0, 2)),
      });

      const app = createFractionFlowApp({
        root,
        practiceTypes: [twoItemType],
        presentationMode: 'instant-test',
        navigationMode: 'legacy-acknowledged',
      });
      app.mount();

      openChooser(root); root.querySelector('[data-practice-type="unlike-denominator-subtraction"]').click();
      const host = () => root.querySelector('.app-visual-view');
      const activeControls = () => host().querySelector('.active-beat-controls');

      // Item 0: 1/2 - 1/5 -> 10
      activeControls().querySelector('.control-btn').click(); // encounter
      host().querySelector('#transform-num-input-left').value = '5'; // left -> 5/10
      host().querySelector('#transform-num-input-left').parentNode.parentNode.querySelector('.control-submit-btn').click();
      host().querySelector('#transform-num-input-right').value = '2'; // right -> 2/10
      host().querySelector('#transform-num-input-right').parentNode.parentNode.querySelector('.control-submit-btn').click();
      host().querySelector('#operate-fraction-numerator-input').value = '3'; // operate -> 3/10
      host().querySelector('#operate-fraction-denominator-input').value = '10';
      activeControls().querySelector('.control-submit-btn').click();
      activeControls().querySelector('button').click(); // resolve finish

      expect(app.getState().status).toBe('resolved');
      const nextBtn = root.querySelector('.app-next-button');
      expect(nextBtn.hasAttribute('hidden')).toBe(false);

      // Advance to Item 1: 3/4 - 2/5 -> 20
      nextBtn.click();
      expect(app.getState().taskContext.itemId).toBe('plan40-construct-three-fourths-two-fifths-20');
      expect(app.getState().beat).toBe('encounter');

      activeControls().querySelector('.control-btn').click(); // encounter
      host().querySelector('#transform-num-input-left').value = '15'; // left -> 15/20
      host().querySelector('#transform-num-input-left').parentNode.parentNode.querySelector('.control-submit-btn').click();
      host().querySelector('#transform-num-input-right').value = '8'; // right -> 8/20
      host().querySelector('#transform-num-input-right').parentNode.parentNode.querySelector('.control-submit-btn').click();
      host().querySelector('#operate-fraction-numerator-input').value = '7'; // operate -> 7/20
      host().querySelector('#operate-fraction-denominator-input').value = '20';
      activeControls().querySelector('.control-submit-btn').click();
      activeControls().querySelector('button').click(); // resolve finish

      // Final item completed: Next button should be hidden, exhaustion shown
      expect(app.getState().status).toBe('resolved');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);

      // Return button is available to return to entry page
      const returnBtn = root.querySelector('.app-return-button');
      expect(returnBtn).not.toBeNull();
      returnBtn.click();
      expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);
      expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);

      app.destroy();
    });
  });
});


function openChooser(root) { const chooser = root.querySelector('[data-entry-chooser]'); if (chooser.getAttribute('aria-expanded') === 'false') chooser.click(); }
