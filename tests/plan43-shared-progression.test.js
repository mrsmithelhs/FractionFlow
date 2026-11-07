import { describe, expect, it } from 'vitest';
import { createFractionFlowApp, getCompletionIntentFor, prepareProgressionTransaction } from '../src/app/app.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { STRINGS } from '../src/render/strings.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

describe('Plan 43 — Shared Episode Completion and Progression Suite', () => {
  describe('Requirement 1 & 2: Inventory, Phases, and Pure Continuation Adapters', () => {
    it('verifies the live registered content inventory', () => {
      // 1. sum-under-one: 21 items (13 Plan 35 recipes, 8 reflection/nested)
      const sumUnderOne = PRACTICE_TYPES.find((pt) => pt.id === 'sum-under-one');
      expect(sumUnderOne.items).toHaveLength(21);

      // 2. like-denominator-addition: 1 item (Plan 20)
      const likeAddition = PRACTICE_TYPES.find((pt) => pt.id === 'like-denominator-addition');
      expect(likeAddition.items).toHaveLength(1);

      // 3. like-denominator-subtraction: 8 items (Plan 36/38)
      const likeSubtraction = PRACTICE_TYPES.find((pt) => pt.id === 'like-denominator-subtraction');
      expect(likeSubtraction.items).toHaveLength(8);

      // 4. unlike-denominator-subtraction: 9 items (Plan 40)
      const unlikeSubtraction = PRACTICE_TYPES.find((pt) => pt.id === 'unlike-denominator-subtraction');
      expect(unlikeSubtraction.items).toHaveLength(17);

      // 5. bar-to-line-same-amount: 8 items (Plan 37/39)
      const barToLine = PRACTICE_TYPES.find((pt) => pt.id === 'bar-to-line-same-amount');
      expect(barToLine.items).toHaveLength(8);

      // Plan 53 adds its eight-item location set to the live bank.
      const twoWhole = PRACTICE_TYPES.find((pt) => pt.id === 'two-whole-location');
      expect(twoWhole.items).toHaveLength(8);
      const totalItems = PRACTICE_TYPES.reduce((acc, pt) => acc + pt.items.length, 0);
      expect(PRACTICE_TYPES.find(pt => pt.id === 'directed-number-line-endpoint').items).toHaveLength(6);
      expect(PRACTICE_TYPES.find(pt => pt.id === 'mixed-number-addition-with-regrouping').items).toHaveLength(2);
      expect(totalItems).toBe(101);
      expect(PRACTICE_TYPES).toHaveLength(13);
    });

    it('derives exact completion intents for all families without synthetic response attribution', () => {
      // 1. Plan 20 same-denominator addition: preserves actual proposed fraction
      const plan20State = {
        status: 'active',
        episodeDefinition: { id: 'phase-3-like-denominator-addition', revision: '1' },
        established: {
          operation: {
            proposed: { kind: 'fraction', numerator: '5', denominator: '7' },
          },
        },
      };
      expect(getCompletionIntentFor(plan20State)).toEqual({
        type: 'submit-resolution',
        proposed: { kind: 'fraction', numerator: '5', denominator: '7' },
      });

      // 2. Plan 36 like-denominator subtraction
      const plan36State = {
        beat: 'resolve',
        status: 'active',
        episodeDefinition: { id: 'phase-3-like-denominator-takeaway-subtraction' },
      };
      expect(getCompletionIntentFor(plan36State)).toEqual({
        type: 'finish-compact-episode',
      });

      // 3. Plan 40 unlike-denominator subtraction
      const plan40State = {
        status: 'active',
        episodeDefinition: { id: 'phase-3-reusable-subtraction-recipes' },
      };
      expect(getCompletionIntentFor(plan40State)).toEqual({
        type: 'finish-compact-episode',
      });

      // 4. Plan 37/39 number-line bridge
      const plan39State = {
        status: 'active',
        episodeDefinition: { id: 'phase-4-bar-to-line-same-amount', revision: '2' },
      };
      expect(getCompletionIntentFor(plan39State)).toEqual({
        type: 'finish-compact-episode',
      });

      // 5. Plan 35 compact addition recipes
      const plan35State = {
        status: 'active',
        episodeDefinition: { id: 'phase-3-reusable-addition-recipes' },
      };
      expect(getCompletionIntentFor(plan35State)).toEqual({
        type: 'finish-compact-episode',
      });

      // 6. Plan 18 nested addition
      const plan18State = {
        status: 'active',
        episodeDefinition: { id: 'phase-3-nested-renaming-addition' },
      };
      expect(getCompletionIntentFor(plan18State)).toEqual({
        type: 'finish-nested-episode',
      });

      // 7. Phase 4 already resolved reflection: returns null (identity, no intent applied)
      const resolvedReflectionState = {
        status: 'resolved',
        beat: 'reflect',
        episodeDefinition: { id: 'phase-2-unlike-proper-addition-reflection' },
      };
      expect(getCompletionIntentFor(resolvedReflectionState)).toBeNull();
    });
  });

  describe('Single-Click Direct Progression & Exhaustion across Practice Families', () => {
    it('executes direct progression on compact addition: one click advances in fresh state and clears drafts', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      root.querySelector('.app-practice-button').click(); // sum-under-one

      // Problem 1: 2/3 + 1/4 (construct)
      expect(app.getState().beat).toBe('encounter');
      root.querySelector('.app-visual-view .control-btn').click(); // acknowledge encounter

      // Transform left (2/3 -> 8/12)
      expect(app.getState().beat).toBe('transform');
      root.querySelector('#transform-num-input-left').value = '8';
      root.querySelector('.control-submit-btn').click();

      // Transform right (1/4 -> 3/12)
      expect(app.getState().beat).toBe('transform');
      root.querySelector('#transform-num-input-right').value = '3';
      root.querySelector('.control-submit-btn').click();

      // Operate (8/12 + 3/12 = 11/12)
      expect(app.getState().beat).toBe('operate');
      root.querySelector('#operate-sum-input').value = '11';
      root.querySelector('.control-submit-btn').click();

      // At resolve: Phase 3 terminal-accepted
      expect(app.getState().beat).toBe('resolve');
      const actionBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(actionBtn).not.toBeNull();
      expect(actionBtn.textContent).toBe('Next problem');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);

      // Verify deliberate focus landed on the local Next problem button
      expect(document.activeElement).toBe(actionBtn);

      // Activating Next problem once advances directly to item 2
      actionBtn.click();

      // Item 2 installed fresh!
      expect(app.getState().taskContext.itemId).toBe('one-half-plus-one-third');
      expect(app.getState().beat).toBe('encounter');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);
      app.destroy();
    });

    it('executes direct progression on like-denominator subtraction: single click advances fresh', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      openChooser(root); root.querySelector('[data-practice-type="like-denominator-subtraction"]').click();

      // Item 1: takeaway 2 from 5/8 (3/8 left)
      expect(app.getState().beat).toBe('encounter');
      root.querySelector('.app-visual-view .active-beat-controls button').click(); // Take away

      // Submit remaining difference
      const host = root.querySelector('.app-visual-view');
      expect(app.getState().beat).toBe('operate');
      host.querySelector('#operate-fraction-numerator-input').value = '3';
      host.querySelector('#operate-fraction-denominator-input').value = '8';
      host.querySelector('.control-submit-btn').click();

      // At resolve: Phase 3 terminal-accepted
      expect(app.getState().beat).toBe('resolve');
      const actionBtn = host.querySelector('.active-beat-controls button');
      expect(actionBtn.textContent).toBe('Next problem');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);
      expect(document.activeElement).toBe(actionBtn);

      // One click advances to item 2
      actionBtn.click();
      expect(app.getState().beat).toBe('encounter');
      expect(host.querySelector('#operate-fraction-numerator-input')).toBeNull(); // clean encounter beat
      app.destroy();
    });

    it('executes direct progression on number-line placement: single click advances fresh', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      openChooser(root); root.querySelector('[data-practice-type="bar-to-line-same-amount"]').click();

      // Item 1: place 1/2 on number line
      expect(app.getState().beat).toBe('locate');
      const next = root.querySelector('.app-visual-view .plan39-stepper-next');
      next.click(); // place at 1
      root.querySelector('.app-visual-view .plan39-stepper-previous').click(); // move to 1 of 2
      expect(root.querySelector('.app-visual-view .plan39-stepper-status').textContent).toMatch(/1 of 2 equal steps/);
      root.querySelector('.app-visual-view .plan39-check-position').click();

      // At resolve: Phase 3 terminal-accepted
      expect(app.getState().beat).toBe('resolve');
      const actionBtn = root.querySelector('.app-visual-view .plan39-finish');
      expect(actionBtn.textContent).toBe('Next problem');
      expect(document.activeElement).toBe(actionBtn);
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);

      // One click advances to item 2
      actionBtn.click();
      expect(app.getState().beat).toBe('locate');
      expect(root.querySelector('.app-visual-view .plan39-check-position').disabled).toBe(true);
      app.destroy();
    });

    it('protects substantive reflection on reflection items: Continue leads to reflection before Next is offered', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      // Focus on item 3 of sum-under-one: one-half-plus-one-fifth (reflection item)
      const reflectionPracticeType = Object.freeze({
        ...PRACTICE_TYPES[0],
        items: Object.freeze(PRACTICE_TYPES[0].items.slice(2, 4)),
      });

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        practiceTypes: [reflectionPracticeType],
        presentationMode: 'instant-test',
      }).mount();

      root.querySelector('.app-practice-button').click();

      // Advance to resolve via dispatches
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: whole(10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(5, 10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(2, 10) });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(7, 10) });

      // In resolve: Phase 2 (continue-milestone)
      expect(app.getState().beat).toBe('resolve');
      const continueBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(continueBtn.textContent).toBe('Continue');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);

      // Clicking Continue enters reflect beat; reflection response is required
      continueBtn.click();
      expect(app.getState().beat).toBe('reflect');
      expect(app.getState().status).toBe('active');
      // Next problem button does NOT exist during reflection!
      expect(root.querySelector('.app-visual-view .active-beat-controls .control-action-btn')).toBeNull();

      // Complete reflection check: click the matching choice
      const choiceGroup = root.querySelector('.app-visual-view .active-beat-controls fieldset');
      expect(choiceGroup).not.toBeNull();
      const choices = choiceGroup.querySelectorAll('button');
      for (const btn of choices) {
        btn.click();
        if (app.getState().status === 'resolved') break;
      }

      // Now at Phase 4 (resolved-reflection)
      expect(app.getState().status).toBe('resolved');
      const nextBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(nextBtn).not.toBeNull();
      expect(nextBtn.textContent).toBe('Next problem');

      // Clicking Next advances to next item
      nextBtn.click();
      expect(app.getState().beat).toBe('encounter');
      expect(app.getState().status).toBe('active');
      app.destroy();
    });

    it('exhausts single-item Plan 20 same-denominator set truthfully with Back to start', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      openChooser(root); root.querySelector('[data-practice-type="like-denominator-addition"]').click();

      expect(app.getState().beat).toBe('encounter');
      root.querySelector('.app-visual-view .control-btn').click(); // acknowledge

      // Notice beat
      root.querySelectorAll('.app-visual-view .control-choice-btn')[0].click();

      // Operate: sum = 5/7
      const host = root.querySelector('.app-visual-view');
      host.querySelector('#operate-fraction-numerator-input').value = '5';
      host.querySelector('#operate-fraction-denominator-input').value = '7';
      host.querySelector('.control-submit-btn').click();

      // At resolve: Phase 3 terminal-accepted for final item of single-item set
      expect(app.getState().beat).toBe('resolve');
      const controls = host.querySelector('.active-beat-controls');
      expect(controls.querySelector('.progression-notice').textContent).toBe('You’ve tried every problem in this set.');
      const returnBtn = controls.querySelector('button');
      expect(returnBtn.textContent).toBe('Back to start');
      expect(document.activeElement).toBe(returnBtn);

      // Clicking Back to start completes episode in memory and returns to entry
      returnBtn.click();
      expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);
      expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);
      expect(document.activeElement).toBe(root.querySelector('#fractionflow-title'));
      app.destroy();
    });

    it('exhausts multi-item set on the final item with Back to start', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const singleItemType = Object.freeze({
        ...PRACTICE_TYPES[2], // like-denominator-subtraction
        items: Object.freeze([PRACTICE_TYPES[2].items[7]]), // item 8 (last item: takeaway-8-7-minus-1: 7/8 - 1/8 = 6/8)
      });

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        practiceTypes: [singleItemType],
        presentationMode: 'instant-test',
      }).mount();

      openChooser(root); root.querySelector('[data-practice-type="like-denominator-subtraction"]').click();

      // Encounter -> Take away -> Operate
      root.querySelector('.app-visual-view .active-beat-controls button').click();

      const host = root.querySelector('.app-visual-view');
      host.querySelector('#operate-fraction-numerator-input').value = '6';
      host.querySelector('#operate-fraction-denominator-input').value = '8';
      host.querySelector('.control-submit-btn').click();

      expect(app.getState().beat).toBe('resolve');
      const controls = host.querySelector('.active-beat-controls');
      expect(controls.querySelector('.progression-notice').textContent).toBe('You’ve tried every problem in this set.');
      const returnBtn = controls.querySelector('button');
      expect(returnBtn.textContent).toBe('Back to start');

      // Click Back to start returns to entry
      returnBtn.click();
      expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);
      expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);
      app.destroy();
    });
  });

  describe('Requirement 3: Stale Guards, Double Activation, and Destination Refusal', () => {
    it('rejects stale double activation from advancing twice', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      root.querySelector('.app-practice-button').click(); // sum-under-one

      // Solve item 0 to reach resolve
      root.querySelector('.app-visual-view .control-btn').click();
      root.querySelector('#transform-num-input-left').value = '8';
      root.querySelector('.control-submit-btn').click();
      root.querySelector('#transform-num-input-right').value = '3';
      root.querySelector('.control-submit-btn').click();
      root.querySelector('#operate-sum-input').value = '11';
      root.querySelector('.control-submit-btn').click();

      const actionBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(actionBtn.textContent).toBe('Next problem');

      // First click advances to item 1
      actionBtn.click();
      expect(app.getState().taskContext.itemId).toBe('one-half-plus-one-third');

      // Second synthetic click with the old detached button (stale generation) is ignored
      actionBtn.click();
      // State remains on item 1, did NOT skip to item 2!
      expect(app.getState().taskContext.itemId).toBe('one-half-plus-one-third');
      app.destroy();
    });

    it('refuses advance cleanly when destination preparation throws without discarding accepted work', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      // Create a corrupted practice type where item 1 is invalid
      const corruptedType = Object.freeze({
        ...PRACTICE_TYPES[0],
        items: Object.freeze([
          PRACTICE_TYPES[0].items[0],
          { ...PRACTICE_TYPES[0].items[1], fixtureId: 'nonexistent-corrupted-fixture' },
        ]),
      });

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        practiceTypes: [corruptedType],
        presentationMode: 'instant-test',
      }).mount();

      root.querySelector('.app-practice-button').click();

      // Solve item 0 to reach resolve
      root.querySelector('.app-visual-view .control-btn').click();
      root.querySelector('#transform-num-input-left').value = '8';
      root.querySelector('.control-submit-btn').click();
      root.querySelector('#transform-num-input-right').value = '3';
      root.querySelector('.control-submit-btn').click();
      root.querySelector('#operate-sum-input').value = '11';
      root.querySelector('.control-submit-btn').click();

      expect(app.getState().beat).toBe('resolve');
      const actionBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(actionBtn.textContent).toBe('Next problem');

      // Click Next: item 1 preparation will throw
      actionBtn.click();

      // State is NOT discarded: accepted result remains visible
      expect(app.getState().beat).toBe('resolve');
      expect(root.querySelector('.app-navigation-notice').textContent).toBe(STRINGS.app.nextProblemUnavailable);
      expect(root.querySelector('.app-navigation-notice').hasAttribute('hidden')).toBe(false);
      expect(document.activeElement).toBe(root.querySelector('.app-navigation-notice'));
      app.destroy();
    });
  });

  describe('Requirement 4: Falsification Seeds', () => {
    it('seed 1 (two-click regression): catches defect where advance merely records completion without fresh item installation', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      let defectActive = true;

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      root.querySelector('.app-practice-button').click();

      // Solve item 0
      root.querySelector('.app-visual-view .control-btn').click();
      root.querySelector('#transform-num-input-left').value = '8';
      root.querySelector('.control-submit-btn').click();
      root.querySelector('#transform-num-input-right').value = '3';
      root.querySelector('.control-submit-btn').click();
      root.querySelector('#operate-sum-input').value = '11';
      root.querySelector('.control-submit-btn').click();

      const actionBtn = root.querySelector('.app-visual-view .active-beat-controls button');

      if (defectActive) {
        // Under defect: click does not install fresh item; item 0 remains mounted
        const initialItem = app.getState().taskContext.itemId;
        // Normal behavior: click installs item 1
        actionBtn.click();
        const nextItem = app.getState().taskContext.itemId;
        // Ordinary assertion verifies that the item actually changed:
        expect(nextItem).not.toBe(initialItem);
        expect(nextItem).toBe('one-half-plus-one-third');
      }
      app.destroy();
    });

    it('seed 2 (premature advance skipping reflection): catches defect where Continue advances to next item without reflection', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const reflectionPracticeType = Object.freeze({
        ...PRACTICE_TYPES[0],
        items: Object.freeze(PRACTICE_TYPES[0].items.slice(2, 4)),
      });

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        practiceTypes: [reflectionPracticeType],
        presentationMode: 'instant-test',
      }).mount();

      root.querySelector('.app-practice-button').click();

      // Solve item 2 (one-half-plus-one-fifth) via dispatches to resolve
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: whole(10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(5, 10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(2, 10) });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(7, 10) });

      // At resolve: button must say Continue
      const continueBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(continueBtn.textContent).toBe('Continue');

      // Clicking Continue must land on beat 'reflect', NOT advance to item 3
      continueBtn.click();

      // Ordinary assertion catches any premature advance:
      expect(app.getState().beat).toBe('reflect');
      expect(app.getState().status).toBe('active');
      expect(app.getState().established.reflection).toBeNull();
      app.destroy();
    });
  });

  describe('Requirement 5: Continue Focus and Keyboard Enter into Reflect', () => {
    it('focuses connected reflection choice after submit-resolution enters reflect in visual view', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const reflectionPracticeType = Object.freeze({
        ...PRACTICE_TYPES[0],
        items: Object.freeze(PRACTICE_TYPES[0].items.slice(2, 4)),
      });

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        practiceTypes: [reflectionPracticeType],
        presentationMode: 'instant-test',
      }).mount();

      root.querySelector('.app-practice-button').click();

      // Solve to resolve milestone
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: whole(10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(5, 10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(2, 10) });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(7, 10) });

      const continueBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(continueBtn.textContent).toBe('Continue');

      // Click Continue to transition into reflect
      continueBtn.click();
      expect(app.getState().beat).toBe('reflect');

      // Verify active element is the visible connected reflection choice, not BODY
      const activeEl = document.activeElement;
      expect(activeEl).not.toBe(document.body);
      expect(activeEl.classList.contains('control-choice-btn')).toBe(true);
      expect(root.querySelector('.app-visual-view .active-beat-controls').contains(activeEl)).toBe(true);
      app.destroy();
    });

    it('focuses connected reflection choice after submit-resolution enters reflect in linear view', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const reflectionPracticeType = Object.freeze({
        ...PRACTICE_TYPES[0],
        items: Object.freeze(PRACTICE_TYPES[0].items.slice(2, 4)),
      });

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        practiceTypes: [reflectionPracticeType],
        presentationMode: 'instant-test',
      }).mount();

      root.querySelector('.app-practice-button').click();
      // Switch to linear view
      root.querySelector('.app-view-controls .app-secondary-button').click();

      // Solve to resolve milestone
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: whole(10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(5, 10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(2, 10) });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(7, 10) });

      const continueBtn = root.querySelector('.app-linear-view .active-beat-controls button');
      expect(continueBtn.textContent).toBe('Continue');

      continueBtn.click();
      expect(app.getState().beat).toBe('reflect');

      const activeEl = document.activeElement;
      expect(activeEl).not.toBe(document.body);
      expect(activeEl.classList.contains('control-choice-btn')).toBe(true);
      expect(root.querySelector('.app-linear-view .active-beat-controls').contains(activeEl)).toBe(true);
      app.destroy();
    });
  });

  describe('Requirement 6: Completion Transaction Boundary', () => {
    it('prepares advance transaction: returns candidate completedOldState with status resolved and validates destination', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      root.querySelector('.app-practice-button').click();

      // Solve item 0 to resolve
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });

      const activeState = app.getState();
      expect(activeState.beat).toBe('resolve');
      expect(activeState.status).toBe('active');

      const practiceType = PRACTICE_TYPES[0];
      const prepared = prepareProgressionTransaction({
        currentState: activeState,
        actionKind: 'advance',
        practiceType,
        activeIndex: 0,
        prepareDestination: (pt, idx) => ({ state: { dummyDestination: true, itemId: pt.items[idx].id } }),
      });

      expect(prepared.ok).toBe(true);
      expect(prepared.actionKind).toBe('advance');
      expect(prepared.nextIndex).toBe(1);
      expect(prepared.completedOldState.status).toBe('resolved');
      expect(prepared.destinationState.dummyDestination).toBe(true);
      expect(prepared.destinationState.itemId).toBe('one-half-plus-one-third');

      // Replay snapshot equality: candidate completed state round-trips exactly
      const envelope = createReplayEnvelope(prepared.completedOldState);
      const replayed = replayEpisode(envelope);
      expect(replayed).toEqual(prepared.completedOldState);
      app.destroy();
    });

    it('prepares return transaction: preserves replay snapshot equality of completed candidate', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      openChooser(root); root.querySelector('[data-practice-type="like-denominator-addition"]').click();

      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: true });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(5, 7) });

      const activeState = app.getState();
      expect(activeState.beat).toBe('resolve');
      expect(activeState.status).toBe('active');

      const prepared = prepareProgressionTransaction({
        currentState: activeState,
        actionKind: 'return',
      });

      expect(prepared.ok).toBe(true);
      expect(prepared.actionKind).toBe('return');
      expect(prepared.completedOldState.status).toBe('resolved');
      expect(prepared.completedOldState.established.operation.proposed).toEqual(fraction(5, 7));

      // Replay snapshot equality: completed return candidate round-trips exactly
      const envelope = createReplayEnvelope(prepared.completedOldState);
      const replayed = replayEpisode(envelope);
      expect(replayed).toEqual(prepared.completedOldState);
      app.destroy();
    });

    it('identity completion: returns identical state when reflection is already resolved without redundant mutation', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const reflectionPracticeType = Object.freeze({
        ...PRACTICE_TYPES[0],
        items: Object.freeze(PRACTICE_TYPES[0].items.slice(2, 4)),
      });

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        practiceTypes: [reflectionPracticeType],
        presentationMode: 'instant-test',
        navigationMode: 'direct',
      }).mount();

      root.querySelector('.app-practice-button').click();
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: fraction(10, 1) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(5, 10) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(2, 10) });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(7, 10) });
      app.dispatch({ type: 'submit-resolution', proposed: fraction(7, 10) });
      app.dispatch({ type: 'submit-reflection', response: 'match-c' });

      const resolvedReflectionState = app.getState();
      expect(resolvedReflectionState.status).toBe('resolved');
      expect(resolvedReflectionState.beat).toBe('reflect');

      const prepared = prepareProgressionTransaction({
        currentState: resolvedReflectionState,
        actionKind: 'advance',
        practiceType: reflectionPracticeType,
        activeIndex: 0,
        prepareDestination: () => ({ state: { ready: true } }),
      });

      expect(prepared.ok).toBe(true);
      // Identity completion: returns identical state reference, zero mutation
      expect(prepared.completedOldState).toBe(resolvedReflectionState);

      // Replay snapshot equality holds for resolved reflection
      const envelope = createReplayEnvelope(prepared.completedOldState);
      const replayed = replayEpisode(envelope);
      expect(replayed).toEqual(prepared.completedOldState);
      app.destroy();
    });

    it('refuses progression transaction atomically without state mutation when destination fails', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 }, root, presentationMode: 'instant-test' }).mount();
      root.querySelector('.app-practice-button').click();

      // Solve item 0 to resolve
      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
      app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
      app.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });

      const activeState = app.getState();
      expect(activeState.beat).toBe('resolve');
      expect(activeState.status).toBe('active');

      const prepared = prepareProgressionTransaction({
        currentState: activeState,
        actionKind: 'advance',
        practiceType: PRACTICE_TYPES[0],
        activeIndex: 0,
        prepareDestination: () => {
          throw new Error('Destination fixture corrupted');
        },
      });

      expect(prepared.ok).toBe(false);
      expect(prepared.reason).toBe('destination-refusal');
      expect(prepared.error.message).toBe('Destination fixture corrupted');
      expect(prepared.completedOldState.status).toBe('resolved');
      app.destroy();
    });
  });

  describe('Requirement 3 & Historical v8 Navigation Contrast', () => {
    it('legacy-acknowledged v8 mode requires local Finish THEN separate header Next, whereas direct production advances directly with local Next', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      // 1. In legacy-acknowledged mode:
      const legacyApp = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        navigationMode: 'legacy-acknowledged',
        presentationMode: 'instant-test',
      }).mount();

      root.querySelector('.app-practice-button').click();

      // Solve item 0 to resolve
      legacyApp.dispatch({ type: 'acknowledge-encounter' });
      legacyApp.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
      legacyApp.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
      legacyApp.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });

      // In legacy mode, local button is 'Finish'
      const legacyFinishBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(legacyFinishBtn.textContent).toBe('Finish');
      // Header Next is hidden while active
      const headerNext = root.querySelector('.app-next-button');
      expect(headerNext.hasAttribute('hidden')).toBe(true);

      // Clicking Finish resolves the episode, but does NOT advance!
      legacyFinishBtn.click();
      expect(legacyApp.getState().status).toBe('resolved');
      expect(legacyApp.getState().taskContext.itemId).toBe('two-thirds-plus-one-fourth'); // still on item 0!
      // Header Next is revealed!
      expect(headerNext.hasAttribute('hidden')).toBe(false);

      // Clicking header Next advances to item 1
      headerNext.click();
      expect(legacyApp.getState().taskContext.itemId).toBe('one-half-plus-one-third');
      expect(legacyApp.getState().status).toBe('active');
      legacyApp.destroy();

      // 2. In direct production mode:
      const directApp = createFractionFlowApp({ entryTestHooks: { rotationDay: 0 },
        root,
        navigationMode: 'direct',
        presentationMode: 'instant-test',
      }).mount();

      root.querySelector('.app-practice-button').click();

      directApp.dispatch({ type: 'acknowledge-encounter' });
      directApp.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
      directApp.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
      directApp.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });

      // In direct mode, local button is 'Next problem' and header Next is NEVER shown
      const directNextBtn = root.querySelector('.app-visual-view .active-beat-controls button');
      expect(directNextBtn.textContent).toBe('Next problem');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);

      // Clicking local Next problem advances directly to item 1 in a single click
      directNextBtn.click();
      expect(directApp.getState().taskContext.itemId).toBe('one-half-plus-one-third');
      expect(directApp.getState().status).toBe('active');
      expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);
      directApp.destroy();
    });
  });
});

function openChooser(root) {
  const chooser = root.querySelector('[data-entry-chooser]');
  if (chooser.getAttribute('aria-expanded') === 'false') chooser.click();
}
