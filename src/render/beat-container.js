import { assertValidScene } from './contract.js';
import { STRINGS } from './strings.js';
import { createFractionBarRenderer } from './fraction-bar.js';
import { createSymbolicRenderer } from './symbolic.js';
import { createButton, createNumericInput, createChoiceGroup } from './controls.js';

/**
 * Beat-Gated Mounting Container (DECISION-014, Reconciliation Finding R6, DECISION-021)
 *
 * Coordinates the presentation of an episode:
 * - Condition C: Receives ONLY the validated frozen scene and dispatchAction callback.
 *   Does NOT hold or receive episode state.
 * - DECISION-014 (Beat-gated DOM lifecycle):
 *   1. Unreached beats and future mathematical values/answers are NEVER mounted in the DOM.
 *      No aria-hidden or display:none pre-mounting.
 *   2. Active beat mounts primary prompt, representations, and active controls.
 *   3. Completed beats remain mounted as inspectable context, but collapse to compact
 *      summary lines with interactive controls dismounted (Finding R6, DECISION-021 criterion 1).
 * - Coordinates pure fraction-bar and symbolic renderers.
 */

export function createBeatContainer({
  container,
  dispatchAction,
  strings = STRINGS,
} = {}) {
  if (!container) {
    throw new Error('container element is required for beat container');
  }
  if (!dispatchAction || typeof dispatchAction !== 'function') {
    throw new Error('dispatchAction function is required for beat container');
  }

  let rootEl = null;
  let liveRegionEl = null;
  let visualSectionEl = null;
  let symbolicSectionEl = null;
  let completedBeatsEl = null;
  let activeBeatEl = null;

  let leftBarRenderer = null;
  let rightBarRenderer = null;
  let symbolicRenderer = null;

  function initLayout() {
    rootEl = document.createElement('div');
    rootEl.classList.add('episode-beat-container');
    container.appendChild(rootEl);

    // ARIA Live Region for screen-reader status announcements
    liveRegionEl = document.createElement('div');
    liveRegionEl.setAttribute('role', 'status');
    liveRegionEl.setAttribute('aria-live', 'polite');
    liveRegionEl.classList.add('sr-only', 'live-announcements');
    rootEl.appendChild(liveRegionEl);

    // Visual representations section
    visualSectionEl = document.createElement('section');
    visualSectionEl.classList.add('render-visual-section');
    visualSectionEl.setAttribute('aria-label', 'Fraction bar models');

    const barsWrapper = document.createElement('div');
    barsWrapper.classList.add('fraction-bars-wrapper');

    const leftBarBox = document.createElement('div');
    leftBarBox.classList.add('fraction-bar-box');
    const rightBarBox = document.createElement('div');
    rightBarBox.classList.add('fraction-bar-box');

    barsWrapper.appendChild(leftBarBox);
    barsWrapper.appendChild(rightBarBox);
    visualSectionEl.appendChild(barsWrapper);
    rootEl.appendChild(visualSectionEl);

    // Symbolic representation section
    symbolicSectionEl = document.createElement('section');
    symbolicSectionEl.classList.add('render-symbolic-section');
    symbolicSectionEl.setAttribute('aria-label', 'Symbolic notation');
    rootEl.appendChild(symbolicSectionEl);

    // Completed beats section (collapsed summary context)
    completedBeatsEl = document.createElement('section');
    completedBeatsEl.classList.add('completed-beats-section');
    completedBeatsEl.setAttribute('aria-label', 'Previous steps');
    rootEl.appendChild(completedBeatsEl);

    // Active beat section
    activeBeatEl = document.createElement('section');
    activeBeatEl.classList.add('active-beat-section');
    activeBeatEl.setAttribute('aria-live', 'polite');
    rootEl.appendChild(activeBeatEl);

    // Initialize sub-renderers
    leftBarRenderer = createFractionBarRenderer({ side: 'left', container: leftBarBox, strings });
    rightBarRenderer = createFractionBarRenderer({ side: 'right', container: rightBarBox, strings });
    symbolicRenderer = createSymbolicRenderer({ container: symbolicSectionEl });
  }

  function renderCompletedBeats(scene) {
    completedBeatsEl.replaceChildren();
    const currentBeat = scene.meaning.currentTask.beat;
    const unitRel = scene.meaning.unitRelationship;
    const quantities = scene.meaning.quantities;
    const op = scene.meaning.operation;

    // Encounter is completed if past encounter
    if (currentBeat !== 'encounter') {
      const summary = document.createElement('div');
      summary.classList.add('completed-beat-summary');
      summary.textContent = 'Problem established.';
      completedBeatsEl.appendChild(summary);
    }

    // Notice completed if past notice
    if (currentBeat !== 'encounter' && currentBeat !== 'notice') {
      const summary = document.createElement('div');
      summary.classList.add('completed-beat-summary');
      summary.textContent = strings.summaryLines.noticeDone;
      completedBeatsEl.appendChild(summary);
    }

    // Decide completed if common unit is established and past decide
    if (unitRel.commonUnit && currentBeat !== 'encounter' && currentBeat !== 'notice' && currentBeat !== 'decide') {
      const summary = document.createElement('div');
      summary.classList.add('completed-beat-summary');
      summary.textContent = strings.summaryLines.decideDone(unitRel.commonUnit.targetDenominator);
      completedBeatsEl.appendChild(summary);
    }

    // Transform completed if conversions established and past transform
    if (currentBeat === 'operate' || currentBeat === 'resolve' || currentBeat === 'reflect') {
      const summaryLeft = document.createElement('div');
      summaryLeft.classList.add('completed-beat-summary');
      summaryLeft.textContent = strings.summaryLines.transformDone(
        'left',
        `${quantities.left.sourceForm.numerator}/${quantities.left.sourceForm.denominator}`,
        `${quantities.left.currentForm.numerator}/${quantities.left.currentForm.denominator}`,
      );
      completedBeatsEl.appendChild(summaryLeft);

      const summaryRight = document.createElement('div');
      summaryRight.classList.add('completed-beat-summary');
      summaryRight.textContent = strings.summaryLines.transformDone(
        'right',
        `${quantities.right.sourceForm.numerator}/${quantities.right.sourceForm.denominator}`,
        `${quantities.right.currentForm.numerator}/${quantities.right.currentForm.denominator}`,
      );
      completedBeatsEl.appendChild(summaryRight);
    }

    // Operate completed if past operate
    if ((currentBeat === 'resolve' || currentBeat === 'reflect') && op.rawResult) {
      const summary = document.createElement('div');
      summary.classList.add('completed-beat-summary');
      summary.textContent = strings.summaryLines.operateDone(
        `${op.rawResult.numerator}/${op.rawResult.denominator}`,
      );
      completedBeatsEl.appendChild(summary);
    }
  }

  function renderActiveBeat(scene) {
    activeBeatEl.replaceChildren();
    const task = scene.meaning.currentTask;
    const beat = task.beat;
    const recovery = scene.meaning.status.recovery;

    // Prompt header
    const promptHeader = document.createElement('div');
    promptHeader.classList.add('active-beat-header');

    const promptText = document.createElement('h2');
    promptText.classList.add('active-beat-prompt');

    // Controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('active-beat-controls');

    // Local recovery feedback (Quality doc §16, §63)
    if (recovery && recovery.beat === beat) {
      const recoveryEl = document.createElement('div');
      recoveryEl.classList.add('active-beat-feedback', 'recovery-feedback');
      recoveryEl.setAttribute('role', 'alert');

      if (recovery.classification.kind === 'invalid-common-denominator') {
        recoveryEl.textContent = strings.decide.invalidDenominator(
          recovery.classification.proposed || 'This number',
        );
      } else if (recovery.classification.kind === 'incorrect-conversion') {
        recoveryEl.textContent = strings.transform.errorNumerator;
      } else if (recovery.classification.kind === 'incorrect-operation') {
        recoveryEl.textContent = strings.operate.errorArithmetic;
      } else if (recovery.classification.kind === 'incorrect') {
        recoveryEl.textContent = strings.notice.feedbackSame;
      } else {
        recoveryEl.textContent = strings.status.stepIncorrect;
      }
      activeBeatEl.appendChild(recoveryEl);
    }

    switch (beat) {
      case 'encounter': {
        promptText.textContent = strings.encounter.prompt;
        const continueBtn = createButton({
          label: strings.controls.next,
          onClick: () => dispatchAction({ type: 'acknowledge-encounter' }),
        });
        controlsContainer.appendChild(continueBtn);
        break;
      }

      case 'notice': {
        promptText.textContent = strings.notice.prompt;
        const choiceGroup = createChoiceGroup({
          legend: strings.notice.prompt,
          options: [
            { label: strings.notice.options.same, value: 'same' },
            { label: strings.notice.options.different, value: 'different' },
          ],
          onSelect: (val) => {
            dispatchAction({
              type: 'submit-notice',
              matchesUnits: val === 'same',
            });
          },
        });
        controlsContainer.appendChild(choiceGroup);
        break;
      }

      case 'decide': {
        promptText.textContent = strings.decide.prompt;
        const leftDen = scene.meaning.quantities.left.currentForm.denominator;
        const rightDen = scene.meaning.quantities.right.currentForm.denominator;
        // Common candidate options (e.g. 12, 24, or multiples)
        const candidates = [
          String(Number(leftDen) * Number(rightDen)),
          String(Number(leftDen) * 2),
          String(Number(rightDen) * 2),
        ].filter((v, i, arr) => arr.indexOf(v) === i && Number(v) <= 30).sort((a, b) => Number(a) - Number(b));

        const choiceGroup = createChoiceGroup({
          legend: strings.decide.prompt,
          options: candidates.map((den) => ({
            label: den,
            value: den,
            ariaLabel: strings.decide.optionAriaLabel(den),
          })),
          onSelect: (den) => {
            dispatchAction({
              type: 'propose-common-denominator',
              proposed: {
                kind: 'fraction',
                numerator: String(den),
                denominator: '1',
              },
            });
          },
        });
        controlsContainer.appendChild(choiceGroup);
        break;
      }

      case 'transform': {
        const side = task.target || 'left';
        const targetDen = scene.meaning.unitRelationship.commonUnit?.targetDenominator || '12';
        promptText.textContent = strings.transform.prompt(side, targetDen);

        const numInput = createNumericInput({
          id: `transform-num-input-${side}`,
          label: strings.transform.equivalentNumeratorPrompt(targetDen),
          min: 1,
          max: Number(targetDen),
          strings,
          onSubmit: (val) => {
            dispatchAction({
              type: 'submit-equivalent-form',
              proposed: {
                kind: 'fraction',
                numerator: val,
                denominator: targetDen,
              },
            });
          },
        });
        controlsContainer.appendChild(numInput.element);
        break;
      }

      case 'operate': {
        const commonDen = scene.meaning.quantities.left.currentForm.denominator;
        promptText.textContent = strings.operate.prompt;

        const sumInput = createNumericInput({
          id: 'operate-sum-input',
          label: strings.operate.inputLabel(commonDen),
          min: 1,
          max: 999,
          strings,
          onSubmit: (val) => {
            dispatchAction({
              type: 'submit-operation-result',
              proposed: {
                kind: 'fraction',
                numerator: val,
                denominator: commonDen,
              },
            });
          },
        });
        controlsContainer.appendChild(sumInput.element);
        break;
      }

      case 'resolve': {
        promptText.textContent = strings.resolve.prompt;
        const raw = scene.meaning.operation.rawResult;
        const pref = scene.meaning.operation.preferredFinalForm || raw;

        const summaryEl = document.createElement('div');
        summaryEl.classList.add('resolve-summary');
        if (pref && raw && (pref.numerator !== raw.numerator || pref.denominator !== raw.denominator)) {
          summaryEl.textContent = strings.resolve.unsimplifiedNotice(
            `${raw.numerator}/${raw.denominator}`,
            `${pref.numerator}/${pref.denominator}`,
          );
        } else if (pref) {
          summaryEl.textContent = strings.resolve.summary(pref.numerator, pref.denominator);
        }
        controlsContainer.appendChild(summaryEl);

        const nextBtn = createButton({
          label: strings.resolve.continueButton,
          onClick: () => {
            dispatchAction({
              type: 'submit-resolution',
              proposed: pref || raw,
            });
          },
        });
        controlsContainer.appendChild(nextBtn);
        break;
      }

      case 'reflect': {
        // DECISION-012 & DECISION-026: Visual matching check with distractors
        const targetForm = `${scene.meaning.quantities.left.sourceForm.numerator}/${scene.meaning.quantities.left.sourceForm.denominator}`;
        promptText.textContent = strings.reflect.matchingPrompt(targetForm);

        const choiceGroup = createChoiceGroup({
          legend: promptText.textContent,
          options: [
            { label: `8/12`, value: 'correct', ariaLabel: strings.reflect.matchingOptionLabel(8, 12) },
            { label: `7/12`, value: 'distractor-1', ariaLabel: strings.reflect.matchingOptionLabel(7, 12) },
            { label: strings.reflect.noneOfTheseOption, value: 'none', ariaLabel: strings.reflect.noneOfTheseOption },
          ],
          onSelect: (val) => {
            dispatchAction({
              type: 'submit-reflection',
              proposed: { choice: val },
            });
          },
        });
        controlsContainer.appendChild(choiceGroup);
        break;
      }

      default: {
        promptText.textContent = '';
        break;
      }
    }

    promptHeader.appendChild(promptText);
    activeBeatEl.appendChild(promptHeader);
    activeBeatEl.appendChild(controlsContainer);
  }

  function update(scene) {
    assertValidScene(scene);

    // Update child renderers
    leftBarRenderer.update(scene);
    rightBarRenderer.update(scene);
    symbolicRenderer.update(scene);

    // Update beat lifecycle
    renderCompletedBeats(scene);
    renderActiveBeat(scene);
  }

  return {
    mount(scene) {
      initLayout();
      update(scene);
      return this;
    },
    update(scene) {
      update(scene);
      return this;
    },
    destroy() {
      if (leftBarRenderer) leftBarRenderer.destroy();
      if (rightBarRenderer) rightBarRenderer.destroy();
      if (symbolicRenderer) symbolicRenderer.destroy();
      if (rootEl && rootEl.parentNode) {
        rootEl.parentNode.removeChild(rootEl);
      }
      rootEl = null;
    },
    getElement() {
      return rootEl;
    },
  };
}
