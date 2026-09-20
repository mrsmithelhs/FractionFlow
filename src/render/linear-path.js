import { assertValidScene, RenderContractError } from './contract.js';
import { STRINGS } from './strings.js';
import { createButton, createNumericInput, createChoiceGroup } from './controls.js';

/**
 * Accessible Linear Alternative Renderer (Plan 08, Requirement 1, DECISION-004, DECISION-024)
 *
 * Implements the third access path on the Plan 07 presentation boundary:
 * - Pure display consumer of validated frozen scene (Condition C).
 * - Modality translation: expresses spatial part-whole quantities in programmatically
 *   inspectable text, preserving 100% of learner responsibility (OQ-04).
 * - Text all the way down, held strictly to Grade 2–3 reading level (DECISION-004).
 * - Completed beats collapse into parameterized summaryLines under the <details>
 *   disclosure rule (Finding R6, OQ-18, DECISION-014, DECISION-021).
 * - Full parity for DECISION-026 check-the-premise and matching reflection forms.
 */

export function createLinearPathRenderer({
  container,
  dispatchAction,
  strings = STRINGS,
} = {}) {
  if (!container) {
    throw new Error('container element is required for linear path renderer');
  }
  if (!dispatchAction || typeof dispatchAction !== 'function') {
    throw new Error('dispatchAction function is required for linear path renderer');
  }

  let rootEl = null;
  let liveRegionEl = null;
  let contextSectionEl = null;
  let completedBeatsEl = null;
  let activeBeatEl = null;

  function initLayout() {
    rootEl = document.createElement('div');
    rootEl.classList.add('accessible-linear-path');
    rootEl.setAttribute('role', 'region');
    rootEl.setAttribute('aria-label', 'Accessible step-by-step fraction lesson');
    container.appendChild(rootEl);

    // Live Region for screen-reader announcements
    liveRegionEl = document.createElement('div');
    liveRegionEl.setAttribute('role', 'status');
    liveRegionEl.setAttribute('aria-live', 'polite');
    liveRegionEl.classList.add('sr-only', 'linear-live-announcements');
    rootEl.appendChild(liveRegionEl);

    // Mathematical Context Section
    contextSectionEl = document.createElement('section');
    contextSectionEl.classList.add('linear-context-section');
    contextSectionEl.setAttribute('aria-label', 'Current problem and quantities');
    rootEl.appendChild(contextSectionEl);

    // Completed Beats Section (Collapsed Context)
    completedBeatsEl = document.createElement('section');
    completedBeatsEl.classList.add('completed-beats-section', 'linear-completed-section');
    completedBeatsEl.setAttribute('aria-label', 'Previous steps');
    rootEl.appendChild(completedBeatsEl);

    // Active Beat Section
    activeBeatEl = document.createElement('section');
    activeBeatEl.classList.add('active-beat-section', 'linear-active-section');
    activeBeatEl.setAttribute('aria-live', 'polite');
    rootEl.appendChild(activeBeatEl);
  }

  function renderContext(scene) {
    contextSectionEl.replaceChildren();
    const quantities = scene.meaning.quantities;
    const op = scene.meaning.operation;

    const heading = document.createElement('h2');
    heading.classList.add('linear-context-heading');
    heading.textContent = 'Problem and Quantities';
    contextSectionEl.appendChild(heading);

    const problemDesc = document.createElement('p');
    problemDesc.classList.add('linear-problem-statement');
    const leftSource = `${quantities.left.sourceForm.numerator}/${quantities.left.sourceForm.denominator}`;
    const rightSource = `${quantities.right.sourceForm.numerator}/${quantities.right.sourceForm.denominator}`;
    const symbol = op.operation === 'add' ? '+' : '-';
    problemDesc.textContent = `Problem: ${leftSource} ${symbol} ${rightSource}`;
    contextSectionEl.appendChild(problemDesc);

    const list = document.createElement('ul');
    list.classList.add('linear-quantities-list');

    const itemLeft = document.createElement('li');
    itemLeft.textContent = `First fraction: ${quantities.left.currentForm.numerator} of ${quantities.left.currentForm.denominator} equal parts in 1 whole.`;
    list.appendChild(itemLeft);

    const itemRight = document.createElement('li');
    itemRight.textContent = `Second fraction: ${quantities.right.currentForm.numerator} of ${quantities.right.currentForm.denominator} equal parts in 1 whole.`;
    list.appendChild(itemRight);

    contextSectionEl.appendChild(list);
  }

  function renderCompletedBeats(scene) {
    completedBeatsEl.replaceChildren();
    const currentBeat = scene.meaning.currentTask.beat;
    const unitRel = scene.meaning.unitRelationship;
    const quantities = scene.meaning.quantities;
    const op = scene.meaning.operation;

    const milestones = [];

    // Encounter
    if (currentBeat !== 'encounter') {
      milestones.push(strings.summaryLines.encounterDone || 'Problem established.');
    }

    // Notice
    if (currentBeat !== 'encounter' && currentBeat !== 'notice') {
      milestones.push(strings.summaryLines.noticeDone);
    }

    // Decide
    if (unitRel.commonUnit && currentBeat !== 'encounter' && currentBeat !== 'notice' && currentBeat !== 'decide') {
      milestones.push(strings.summaryLines.decideDone(unitRel.commonUnit.targetDenominator));
    }

    // Transform
    if (currentBeat === 'operate' || currentBeat === 'resolve' || currentBeat === 'reflect') {
      milestones.push(strings.summaryLines.transformDone(
        'left',
        `${quantities.left.sourceForm.numerator}/${quantities.left.sourceForm.denominator}`,
        `${quantities.left.currentForm.numerator}/${quantities.left.currentForm.denominator}`,
      ));
      milestones.push(strings.summaryLines.transformDone(
        'right',
        `${quantities.right.sourceForm.numerator}/${quantities.right.sourceForm.denominator}`,
        `${quantities.right.currentForm.numerator}/${quantities.right.currentForm.denominator}`,
      ));
    }

    // Operate
    if ((currentBeat === 'resolve' || currentBeat === 'reflect') && op.rawResult) {
      milestones.push(strings.summaryLines.operateDone(
        `${op.rawResult.numerator}/${op.rawResult.denominator}`,
      ));
    }

    // Resolve
    if (currentBeat === 'reflect' && (op.preferredFinalForm || op.rawResult)) {
      const finalForm = op.preferredFinalForm || op.rawResult;
      milestones.push(strings.summaryLines.resolveDone(
        `${finalForm.numerator}/${finalForm.denominator}`,
      ));
    }

    if (milestones.length === 0) {
      return;
    }

    if (milestones.length === 1) {
      const summary = document.createElement('div');
      summary.classList.add('completed-beat-summary');
      summary.textContent = milestones[0];
      completedBeatsEl.appendChild(summary);
      return;
    }

    // Completed-Beat Collapse Rule (Finding R6, OQ-18, Condition 1)
    const details = document.createElement('details');
    details.classList.add('completed-beats-history');

    const toggle = document.createElement('summary');
    toggle.classList.add('completed-beats-summary-toggle');
    const olderCount = milestones.length - 1;
    toggle.textContent = typeof strings.summaryLines.summaryDisclosureLabel === 'function'
      ? strings.summaryLines.summaryDisclosureLabel(olderCount)
      : `Show previous steps (${olderCount} completed)`;
    details.appendChild(toggle);

    for (let i = 0; i < olderCount; i += 1) {
      const summary = document.createElement('div');
      summary.classList.add('completed-beat-summary');
      summary.textContent = milestones[i];
      details.appendChild(summary);
    }
    completedBeatsEl.appendChild(details);

    // Latest milestone visible inline
    const latestSummary = document.createElement('div');
    latestSummary.classList.add('completed-beat-summary', 'latest-milestone');
    latestSummary.textContent = milestones[milestones.length - 1];
    completedBeatsEl.appendChild(latestSummary);
  }

  function renderActiveBeat(scene) {
    activeBeatEl.replaceChildren();
    const task = scene.meaning.currentTask;
    const beat = task.beat;
    const recovery = scene.meaning.status.recovery;

    // Prompt Header
    const promptHeader = document.createElement('div');
    promptHeader.classList.add('active-beat-header');

    const promptText = document.createElement('h3');
    promptText.classList.add('active-beat-prompt');

    // Controls Container
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('active-beat-controls');

    if (scene.meaning.status.episode === 'resolved') {
      promptText.textContent = strings.resolve.complete || 'You finished this problem.';
      const completeEl = document.createElement('p');
      completeEl.classList.add('resolve-complete');
      completeEl.textContent = strings.resolve.complete || 'You finished this problem.';
      controlsContainer.appendChild(completeEl);
      promptHeader.appendChild(promptText);
      activeBeatEl.appendChild(promptHeader);
      activeBeatEl.appendChild(controlsContainer);
      return;
    }

    // Local recovery feedback
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
      } else if (recovery.classification.kind === 'incorrect-notice') {
        recoveryEl.textContent = strings.notice.feedbackDiff;
      } else if (recovery.classification.kind === 'incorrect') {
        const leftDen = scene.meaning.quantities.left.unit.denominator;
        const rightDen = scene.meaning.quantities.right.unit.denominator;
        recoveryEl.textContent = typeof strings.notice.feedbackSame === 'function'
          ? strings.notice.feedbackSame(leftDen, rightDen)
          : strings.notice.feedbackSame;
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
        const candidates = scene.meaning.unitRelationship.candidateDenominators;

        if (Array.isArray(candidates) && candidates.length >= 2) {
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
        } else {
          const numInput = createNumericInput({
            id: 'linear-decide-common-denominator-input',
            label: strings.decide.prompt,
            min: 1,
            max: 99,
            strings,
            onSubmit: (val) => {
              dispatchAction({
                type: 'propose-common-denominator',
                proposed: {
                  kind: 'fraction',
                  numerator: String(val),
                  denominator: '1',
                },
              });
            },
          });
          controlsContainer.appendChild(numInput.element);
        }
        break;
      }

      case 'transform': {
        const side = task.target;
        if (side !== 'left' && side !== 'right') {
          throw new RenderContractError(
            'MISSING_TASK_TARGET',
            'transform beat requires a valid target side ("left" or "right")',
          );
        }
        const commonUnit = scene.meaning.unitRelationship.commonUnit;
        if (!commonUnit || !commonUnit.targetDenominator) {
          throw new RenderContractError(
            'MISSING_ESTABLISHED_UNIT',
            'transform beat requires established commonUnit.targetDenominator in scene',
          );
        }
        const targetDen = commonUnit.targetDenominator;
        promptText.textContent = strings.transform.prompt(side, targetDen);

        const numInput = createNumericInput({
          id: `linear-transform-num-input-${side}`,
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
          id: 'linear-operate-sum-input',
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
          label: scene.meaning.currentTask.promptId?.includes('reflect')
            ? (strings.resolve.continueReflectionButton || strings.resolve.continueButton)
            : strings.resolve.continueButton,
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
        // DECISION-026 & Condition 6: Check-the-premise form and visual matching form
        const isPremise = scene.meaning.condition.connectionMaking === 'CM-01-P'
          || scene.meaning.currentTask.promptId?.includes('premise');

        if (isPremise) {
          promptText.textContent = strings.reflect.premisePromptLinear || strings.reflect.premisePrompt;
          const options = [
            {
              label: strings.reflect.premiseOptions.yes,
              value: 'yes',
              ariaLabel: strings.reflect.premiseOptions.yes,
            },
            {
              label: strings.reflect.premiseOptions.no,
              value: 'no',
              ariaLabel: strings.reflect.premiseOptions.no,
            },
          ];

          const choiceGroup = createChoiceGroup({
            legend: promptText.textContent,
            options,
            onSelect: (val) => {
              dispatchAction({
                type: 'submit-reflection',
                response: val,
              });
            },
          });
          controlsContainer.appendChild(choiceGroup);
        } else {
          const left = scene.meaning.quantities.left;
          const targetForm = `${left.sourceForm.numerator}/${left.sourceForm.denominator}`;
          promptText.textContent = typeof strings.reflect.matchingPromptLinear === 'function'
            ? strings.reflect.matchingPromptLinear(targetForm)
            : strings.reflect.matchingPrompt(targetForm);

          const currentLeft = left.currentForm;
          const currentLabel = `${currentLeft.numerator}/${currentLeft.denominator}`;
          const noneLabel = strings.reflect.noneOfTheseOptionLinear || strings.reflect.noneOfTheseOption;
          const options = [
            {
              label: currentLabel,
              value: 'correct',
              ariaLabel: `${currentLabel} shows the same amount`,
            },
            {
              label: noneLabel,
              value: 'none',
              ariaLabel: noneLabel,
            },
          ];

          const choiceGroup = createChoiceGroup({
            legend: promptText.textContent,
            options,
            onSelect: (val) => {
              dispatchAction({
                type: 'submit-reflection',
                response: val,
              });
            },
          });
          controlsContainer.appendChild(choiceGroup);
        }
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
    renderContext(scene);
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
