import { afterEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import {
  PLAN36_SUBTRACTION_PRACTICE_TYPE,
  PLAN38_PRACTICE_TYPES_V8,
  PRACTICE_TYPES,
} from '../src/app/practice-types.js';
import {
  PLAN36_SUBTRACTION_PRACTICE_SET_ID,
  PLAN36_SUBTRACTION_PRACTICE_SET_REVISION,
  PLAN36_SUBTRACTION_RECORDS,
} from '../src/content/data/plan36-like-denominator-subtraction-records.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 38 rendered like-denominator subtraction batch', () => {
  afterEach(() => {
    teardownMockDOM();
  });

  describe('Practice type registration and invariants', () => {
    it('registers PLAN36_SUBTRACTION_PRACTICE_TYPE in PRACTICE_TYPES with all 8 vetted items', () => {
      expect(PLAN36_SUBTRACTION_PRACTICE_TYPE.id).toBe('like-denominator-subtraction');
      expect(PLAN36_SUBTRACTION_PRACTICE_TYPE.label).toBe('Subtract fractions with the same denominator');
      expect(PLAN36_SUBTRACTION_PRACTICE_TYPE.setId).toBe(PLAN36_SUBTRACTION_PRACTICE_SET_ID);
      expect(PLAN36_SUBTRACTION_PRACTICE_TYPE.setRevision).toBe(PLAN36_SUBTRACTION_PRACTICE_SET_REVISION);
      expect(PLAN36_SUBTRACTION_PRACTICE_TYPE.items).toHaveLength(8);

      const expectedItemIds = [
        'takeaway-8-5-minus-2',
        'takeaway-12-8-minus-3',
        'takeaway-10-7-minus-3',
        'takeaway-11-9-minus-4',
        'takeaway-9-6-minus-1',
        'takeaway-9-6-minus-6',
        'takeaway-6-5-minus-4',
        'takeaway-8-7-minus-1',
      ];
      expect(PLAN36_SUBTRACTION_PRACTICE_TYPE.items.map((it) => it.id)).toEqual(expectedItemIds);

      const subtractionType = PRACTICE_TYPES.find((pt) => pt.id === 'like-denominator-subtraction');
      expect(subtractionType).toBe(PLAN36_SUBTRACTION_PRACTICE_TYPE);
      expect(PLAN38_PRACTICE_TYPES_V8).toContain(PLAN36_SUBTRACTION_PRACTICE_TYPE);
    });

    it('renders a choice button on the entry page that launches the subtraction practice set', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({
        root,
        practiceTypes: PRACTICE_TYPES,
        presentationMode: 'instant-test',
      });
      app.mount();

      const choiceBtn = root.querySelector('[data-practice-type="like-denominator-subtraction"]');
      expect(choiceBtn).not.toBeNull();
      expect(choiceBtn.textContent).toBe('Subtract fractions with the same denominator');

      choiceBtn.click();
      expect(app.getState().beat).toBe('encounter');
      expect(app.getState().episodeDefinition.id).toBe('phase-3-like-denominator-takeaway-subtraction');
      expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(true);
      expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(false);

      app.destroy();
    });
  });

  describe('Mounted episode journeys across all 8 records in visual and linear views', () => {
    for (const record of PLAN36_SUBTRACTION_RECORDS) {
      for (const view of ['visual', 'linear']) {
        it(`runs full journey for ${record.itemId} in ${view} view with recovery, help, and resolution`, () => {
          const document = setupMockDOM();
          const root = document.createElement('div');
          document.body.appendChild(root);

          const singleItemType = Object.freeze({
            ...PLAN36_SUBTRACTION_PRACTICE_TYPE,
            items: Object.freeze([
              PLAN36_SUBTRACTION_PRACTICE_TYPE.items.find((it) => it.id === record.itemId),
            ]),
          });

          const app = createFractionFlowApp({
            root,
            practiceTypes: [singleItemType],
            presentationMode: 'instant-test',
          });
          app.mount();

          // Enter practice
          root.querySelector('[data-practice-type="like-denominator-subtraction"]').click();
          if (view === 'linear') {
            root.querySelector('.app-view-toggle').click();
          }

          const hostSelector = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
          const host = root.querySelector(hostSelector);

          // 1. Encounter Beat
          expect(app.getState().beat).toBe('encounter');
          const takeAwayBtn = host.querySelector('.active-beat-controls button');
          expect(takeAwayBtn).not.toBeNull();
          expect(takeAwayBtn.textContent).toBe('Take away');
          expect(document.activeElement).toBe(takeAwayBtn);

          // Pre-resolution leakage checks at encounter
          const leftNum = Number(record.leftNumerator);
          const rightNum = Number(record.rightNumerator);
          const den = Number(record.denominator);
          const diffNum = leftNum - rightNum;

          if (view === 'visual') {
            const bar = host.querySelector('.fraction-bar-takeaway-track');
            expect(bar).not.toBeNull();
            const segments = bar.querySelectorAll('.fraction-bar-segment');
            expect(segments).toHaveLength(den);
            for (let i = 0; i < den; i += 1) {
              if (i < leftNum) {
                expect(segments[i].classList.contains('starting')).toBe(true);
              } else {
                expect(segments[i].classList.contains('outside-start')).toBe(true);
              }
            }
          }

          // Inputs must not be mounted yet
          const numInputId = view === 'visual' ? '#operate-fraction-numerator-input' : '#linear-operate-fraction-numerator-input';
          const denInputId = view === 'visual' ? '#operate-fraction-denominator-input' : '#linear-operate-fraction-denominator-input';
          expect(host.querySelector(numInputId)).toBeNull();
          expect(host.querySelector(denInputId)).toBeNull();

          // Replay control must be hidden and disabled
          const replayBtn = root.querySelector('.app-replay-button');
          expect(replayBtn.hidden).toBe(true);
          expect(replayBtn.disabled).toBe(true);

          // 2. Click "Take away" -> Transition to Operate Beat
          takeAwayBtn.click();
          expect(app.getState().beat).toBe('operate');

          const numInput = host.querySelector(numInputId);
          const denInput = host.querySelector(denInputId);
          expect(numInput).not.toBeNull();
          expect(denInput).not.toBeNull();
          expect(document.activeElement).toBe(numInput);

          if (view === 'visual') {
            const bar = host.querySelector('.fraction-bar-takeaway-track');
            const segments = bar.querySelectorAll('.fraction-bar-segment');
            for (let i = 0; i < den; i += 1) {
              if (i < diffNum) {
                expect(segments[i].classList.contains('remaining')).toBe(true);
              } else if (i < leftNum) {
                expect(segments[i].classList.contains('removed')).toBe(true);
              } else {
                expect(segments[i].classList.contains('outside-start')).toBe(true);
              }
            }
          }

          // Pre-resolution leakage check at operate
          const operateHtml = host.innerHTML;
          expect(operateHtml).not.toContain(`Difference:`);
          expect(operateHtml).not.toContain(`That amount is left.`);

          // 3. Test Wrong Answer Submission and Recovery
          const checkBtn = host.querySelector('.control-submit-btn');
          numInput.value = '99';
          denInput.value = String(den);
          checkBtn.click();

          expect(app.getState().beat).toBe('operate');
          expect(app.getState().lastRecovery?.beat).toBe('operate');
          expect(app.getState().lastRecovery?.classification?.kind).toBe('incorrect-subtraction-result');

          const recoveryFeedback = host.querySelector('.recovery-feedback');
          expect(recoveryFeedback).not.toBeNull();
          expect(recoveryFeedback.textContent).toBe('Check the parts left. Try again.');

          // Focus returns to numerator input on recovery
          expect(document.activeElement).toBe(host.querySelector(numInputId));
          // Inputs retain what was typed
          expect(host.querySelector(numInputId).value).toBe('99');
          expect(host.querySelector(denInputId).value).toBe(String(den));

          // 4. Test Task Help Toggle
          const helpBtn = host.querySelector('.app-secondary-button');
          expect(helpBtn).not.toBeNull();
          expect(helpBtn.textContent).toBe('Need help?');
          expect(helpBtn.getAttribute('aria-expanded')).toBe('false');

          // Open help
          helpBtn.click();
          expect(helpBtn.textContent).toBe('Close help');
          expect(helpBtn.getAttribute('aria-expanded')).toBe('true');
          expect(document.activeElement).toBe(helpBtn);

          const helpCueId = view === 'visual' ? '#visual-subtraction-task-help' : '#linear-subtraction-task-help';
          const helpCue = host.querySelector(helpCueId);
          expect(helpCue).not.toBeNull();
          if (view === 'visual') {
            expect(helpCue.textContent).toBe('Count only the shaded parts without removal marks.');
          } else {
            expect(helpCue.textContent).toBe('The second fraction is the amount taken away. Use the starting amount to work out what remains.');
          }

          // Submit another wrong answer while help is open
          const numInputDuringHelp = host.querySelector(numInputId);
          numInputDuringHelp.value = '98';
          host.querySelector('.control-submit-btn').click();

          // Help remains open across wrong submission!
          expect(host.querySelector(helpCueId)).not.toBeNull();
          expect(host.querySelector('.app-secondary-button').getAttribute('aria-expanded')).toBe('true');
          expect(document.activeElement).toBe(host.querySelector(numInputId));

          // Close help
          host.querySelector('.app-secondary-button').click();
          expect(host.querySelector(helpCueId)).toBeNull();
          expect(host.querySelector('.app-secondary-button').getAttribute('aria-expanded')).toBe('false');
          expect(document.activeElement).toBe(host.querySelector('.app-secondary-button'));

          // 5. Test Correct Answer Submission -> Resolve Beat
          const finalNumInput = host.querySelector(numInputId);
          const finalDenInput = host.querySelector(denInputId);
          finalNumInput.value = String(diffNum);
          finalDenInput.value = String(den);
          host.querySelector('.control-submit-btn').click();

          expect(app.getState().beat).toBe('resolve');
          const prompt = host.querySelector('.active-beat-prompt');
          expect(prompt.textContent).toBe('That amount is left.');

          const finishBtn = host.querySelector('.active-beat-controls button');
          expect(finishBtn).not.toBeNull();
          expect(finishBtn.textContent).toBe('Finish');
          expect(document.activeElement).toBe(finishBtn);

          // 6. Finish Episode -> Resolved
          finishBtn.click();
          expect(app.getState().status).toBe('resolved');

          app.destroy();
        });
      }
    }
  });

  describe('Zero-difference item takeaway-9-6-minus-6 (6/9 - 6/9 = 0/9)', () => {
    it('accepts raw 0/9 and simplified 0/1 without leaking numeric result before resolve', () => {
      for (const proposedForm of [{ num: '0', den: '9' }, { num: '0', den: '1' }]) {
        const document = setupMockDOM();
        const root = document.createElement('div');
        document.body.appendChild(root);

        const singleItemType = Object.freeze({
          ...PLAN36_SUBTRACTION_PRACTICE_TYPE,
          items: Object.freeze([
            PLAN36_SUBTRACTION_PRACTICE_TYPE.items.find((it) => it.id === 'takeaway-9-6-minus-6'),
          ]),
        });

        const app = createFractionFlowApp({
          root,
          practiceTypes: [singleItemType],
          presentationMode: 'instant-test',
        });
        app.mount();

        root.querySelector('[data-practice-type="like-denominator-subtraction"]').click();
        const host = root.querySelector('.app-visual-view');

        // Check bar aria-label at encounter does not leak remainder
        const barAtEncounter = host.querySelector('.fraction-bar-takeaway-container');
        expect(barAtEncounter.getAttribute('aria-label')).toBe(
          'Fraction bar: 6 of 9 equal parts shaded in 1 whole.',
        );

        // Click Take away
        host.querySelector('.active-beat-controls button').click();

        // Check bar aria-label at operate does not leak 0 remainder
        const barAtOperate = host.querySelector('.fraction-bar-takeaway-container');
        expect(barAtOperate.getAttribute('aria-label')).toBe(
          'Fraction bar: 6 of 9 equal parts started, 6 marked for removal.',
        );

        // Submit 0/9 or 0/1
        const numInput = host.querySelector('#operate-fraction-numerator-input');
        const denInput = host.querySelector('#operate-fraction-denominator-input');
        numInput.value = proposedForm.num;
        denInput.value = proposedForm.den;
        host.querySelector('.control-submit-btn').click();

        expect(app.getState().beat).toBe('resolve');
        const state = app.getState();
        expect(state.established.operation.rawResultForm).toEqual({
          kind: 'fraction',
          numerator: '0',
          denominator: '9',
        });
        expect(state.established.operation.submittedForm).toEqual({
          kind: 'fraction',
          numerator: proposedForm.num,
          denominator: proposedForm.den,
        });

        // Finish
        host.querySelector('.active-beat-controls button').click();
        expect(app.getState().status).toBe('resolved');

        app.destroy();
      }
    });
  });

  describe('Reducible difference item takeaway-10-7-minus-3 (7/10 - 3/10 = 4/10 or 2/5)', () => {
    it('accepts simplified equivalent 2/5 and records both rawResultForm and submittedForm', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const singleItemType = Object.freeze({
        ...PLAN36_SUBTRACTION_PRACTICE_TYPE,
        items: Object.freeze([
          PLAN36_SUBTRACTION_PRACTICE_TYPE.items.find((it) => it.id === 'takeaway-10-7-minus-3'),
        ]),
      });

      const app = createFractionFlowApp({
        root,
        practiceTypes: [singleItemType],
        presentationMode: 'instant-test',
      });
      app.mount();

      root.querySelector('[data-practice-type="like-denominator-subtraction"]').click();
      const host = root.querySelector('.app-visual-view');

      host.querySelector('.active-beat-controls button').click();

      // Submit 2/5
      host.querySelector('#operate-fraction-numerator-input').value = '2';
      host.querySelector('#operate-fraction-denominator-input').value = '5';
      host.querySelector('.control-submit-btn').click();

      expect(app.getState().beat).toBe('resolve');
      const state = app.getState();
      expect(state.established.operation.rawResultForm).toEqual({
        kind: 'fraction',
        numerator: '4',
        denominator: '10',
      });
      expect(state.established.operation.submittedForm).toEqual({
        kind: 'fraction',
        numerator: '2',
        denominator: '5',
      });

      app.destroy();
    });
  });

  describe('Draft preservation across view toggle (Visual <-> Linear)', () => {
    it('preserves numerator and denominator drafts and focus across visual and linear view switching', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({
        root,
        practiceTypes: PRACTICE_TYPES,
        presentationMode: 'instant-test',
      });
      app.mount();

      root.querySelector('[data-practice-type="like-denominator-subtraction"]').click();
      const visualHost = root.querySelector('.app-visual-view');

      // Click Take away to enter operate
      visualHost.querySelector('.active-beat-controls button').click();

      // Type partial draft in visual view
      const visualNum = visualHost.querySelector('#operate-fraction-numerator-input');
      const visualDen = visualHost.querySelector('#operate-fraction-denominator-input');
      visualNum.value = '3';
      visualDen.value = '8';
      visualNum.focus();

      // Switch to linear view
      root.querySelector('.app-view-toggle').click();

      const linearHost = root.querySelector('.app-linear-view');
      const linearNum = linearHost.querySelector('#linear-operate-fraction-numerator-input');
      const linearDen = linearHost.querySelector('#linear-operate-fraction-denominator-input');

      expect(linearNum.value).toBe('3');
      expect(linearDen.value).toBe('8');
      expect(document.activeElement).toBe(linearNum);

      // Modify draft in linear view
      linearNum.value = '1';
      linearDen.value = '4';

      // Switch back to visual view
      root.querySelector('.app-view-toggle').click();

      const restoredVisualNum = visualHost.querySelector('#operate-fraction-numerator-input');
      const restoredVisualDen = visualHost.querySelector('#operate-fraction-denominator-input');
      expect(restoredVisualNum.value).toBe('1');
      expect(restoredVisualDen.value).toBe('4');

      app.destroy();
    });
  });

  describe('Full 8-item sequence progression, Next navigation, Retry, and Exhaustion', () => {
    it('progresses through all 8 items in order, focuses Next/Exhaustion, supports Retry and Return', () => {
      const document = setupMockDOM();
      const root = document.createElement('div');
      document.body.appendChild(root);

      const app = createFractionFlowApp({
        root,
        practiceTypes: PRACTICE_TYPES,
        presentationMode: 'instant-test',
      });
      app.mount();

      root.querySelector('[data-practice-type="like-denominator-subtraction"]').click();

      // Complete items 0 through 7 sequentially
      for (let index = 0; index < 8; index += 1) {
        const expectedRecord = PLAN36_SUBTRACTION_RECORDS[index];
        const state = app.getState();
        expect(state.taskContext.itemId).toBe(expectedRecord.itemId);
        expect(state.beat).toBe('encounter');

        const host = root.querySelector('.app-visual-view');
        const takeAwayBtn = host.querySelector('.active-beat-controls button');
        expect(document.activeElement).toBe(takeAwayBtn);

        // Test Retry on item 1
        if (index === 1) {
          root.querySelector('.app-restart-button').click();
          expect(app.getState().taskContext.itemId).toBe(expectedRecord.itemId);
          expect(app.getState().beat).toBe('encounter');
          expect(document.activeElement).toBe(host.querySelector('.active-beat-controls button'));
        }

        // Take away
        host.querySelector('.active-beat-controls button').click();

        // Submit correct answer
        const leftNum = Number(expectedRecord.leftNumerator);
        const rightNum = Number(expectedRecord.rightNumerator);
        const den = Number(expectedRecord.denominator);
        const diffNum = leftNum - rightNum;

        host.querySelector('#operate-fraction-numerator-input').value = String(diffNum);
        host.querySelector('#operate-fraction-denominator-input').value = String(den);
        host.querySelector('.control-submit-btn').click();

        expect(app.getState().beat).toBe('resolve');

        // Finish
        host.querySelector('.active-beat-controls button').click();
        expect(app.getState().status).toBe('resolved');

        const nextBtn = root.querySelector('.app-next-button');
        const notice = root.querySelector('.app-navigation-notice');

        if (index < 7) {
          expect(nextBtn.hasAttribute('hidden')).toBe(false);
          expect(document.activeElement).toBe(nextBtn);
          nextBtn.click();
        } else {
          // Item 7 is the final item: Next hidden, exhaustion notice focused!
          expect(nextBtn.hasAttribute('hidden')).toBe(true);
          expect(notice.hasAttribute('hidden')).toBe(false);
          expect(notice.textContent).toBe('You’ve tried every problem in this set.');
          expect(document.activeElement).toBe(notice);
        }
      }

      // Return to entry
      root.querySelector('.app-return-button').click();
      expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);
      expect(document.activeElement).toBe(root.querySelector('.app-entry-title'));

      app.destroy();
    });
  });
});
