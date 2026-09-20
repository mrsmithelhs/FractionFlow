import { assertValidScene, RenderContractError } from './contract.js';
import { STRINGS } from './strings.js';
import { createFractionBarRenderer } from './fraction-bar.js';
import { createSymbolicRenderer } from './symbolic.js';
import { createButton, createNumericInput, createChoiceGroup } from './controls.js';
import { createVisualMatchingChoice } from './matching-choice.js';

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

    // Active beat section
    activeBeatEl = document.createElement('section');
    activeBeatEl.classList.add('active-beat-section');
    rootEl.appendChild(activeBeatEl);

    // Completed beats section (collapsed summary context)
    completedBeatsEl = document.createElement('section');
    completedBeatsEl.classList.add('completed-beats-section');
    completedBeatsEl.setAttribute('aria-label', 'Previous steps');
    rootEl.appendChild(completedBeatsEl);

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

    const milestones = [];

    // Encounter is completed if past encounter
    if (currentBeat !== 'encounter') {
      milestones.push(strings.summaryLines.encounterDone || 'Problem established.');
    }

    // Notice completed if past notice
    if (currentBeat !== 'encounter' && currentBeat !== 'notice') {
      milestones.push(strings.summaryLines.noticeDone);
    }

    // Decide completed if common unit is established and past decide
    if (unitRel.commonUnit && currentBeat !== 'encounter' && currentBeat !== 'notice' && currentBeat !== 'decide') {
      milestones.push(strings.summaryLines.decideDone(unitRel.commonUnit.targetDenominator));
    }

    // Transform completed if conversions established and past transform
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

    // Operate completed if past operate
    if ((currentBeat === 'resolve' || currentBeat === 'reflect') && op.rawResult) {
      milestones.push(strings.summaryLines.operateDone(
        `${op.rawResult.numerator}/${op.rawResult.denominator}`,
      ));
    }

    // Resolve completed if past resolve
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

    // Collapse rule (Finding R6, OQ-18, DECISION-014, DECISION-021 Criterion 1):
    // Design intent: Fold older milestones into native <details> disclosure so scene remains
    // calm and occupies minimal vertical height on 360px viewports, while keeping all past
    // milestones reachable in the DOM for screen readers and learner inspection.
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

    // Most recent milestone is always visible inline directly above active beat
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

    // Prompt header
    const promptHeader = document.createElement('div');
    promptHeader.classList.add('active-beat-header');

    const promptText = document.createElement('h2');
    promptText.classList.add('active-beat-prompt');

    // Controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('active-beat-controls');

    if (scene.meaning.status.episode === 'resolved') {
      promptText.textContent = strings.resolve.complete || 'You finished this problem.';
      promptHeader.appendChild(promptText);
      activeBeatEl.appendChild(promptHeader);
      return;
    }

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
      } else if (recovery.classification.kind === 'incorrect-notice') {
        recoveryEl.textContent = strings.notice.feedbackDiff;
      } else if (recovery.classification.kind === 'incorrect') {
        const leftDen = scene.meaning.quantities.left.unit.denominator;
        const rightDen = scene.meaning.quantities.right.unit.denominator;
        recoveryEl.textContent = typeof strings.notice.feedbackSame === 'function'
          ? strings.notice.feedbackSame(leftDen, rightDen)
          : strings.notice.feedbackSame;
      } else if (recovery.classification.kind === 'incorrect-reflection') {
        recoveryEl.textContent = strings.reflect.matchingDistractor;
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
            id: 'decide-common-denominator-input',
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
        const raw = scene.meaning.operation.rawResult;
        const pref = scene.meaning.operation.preferredFinalForm || raw;

        if (pref && raw && (pref.numerator !== raw.numerator || pref.denominator !== raw.denominator)) {
          promptText.textContent = strings.resolve.unsimplifiedNotice(
            `${raw.numerator}/${raw.denominator}`,
            `${pref.numerator}/${pref.denominator}`,
          );
        } else if (pref) {
          promptText.textContent = strings.resolve.summary(pref.numerator, pref.denominator);
        }

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
        const isPremise = scene.meaning.condition.connectionMaking === 'CM-01-P'
          || scene.meaning.currentTask.promptId?.includes('premise');

        if (isPremise) {
          // DECISION-026: Check-the-premise form (answer is not always the reassuring one)
          promptText.textContent = strings.reflect.premisePrompt;
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
          // DECISION-012 & DECISION-026: Visual matching check with distractors
          const left = scene.meaning.quantities.left;
          const targetForm = `${left.sourceForm.numerator}/${left.sourceForm.denominator}`;
          promptText.textContent = strings.reflect.matchingPrompt(targetForm);
          const choices = scene.meaning.reflectionChoices;
          if (!Array.isArray(choices) || choices.length < 3) {
            throw new RenderContractError(
              'MISSING_REFLECTION_CHOICES',
              'visual matching requires at least three content-supplied choices',
            );
          }

          const choiceGroup = createChoiceGroup({
            legend: promptText.textContent,
            options: choices.map((choice) => ({
              value: choice.id,
              choice,
              ariaLabel: strings.reflect.matchingOptionLabel(
                choice.form.numerator,
                choice.form.denominator,
              ),
            })),
            renderOption: (option, onClick) => createVisualMatchingChoice({
              choice: option.choice,
              ariaLabel: option.ariaLabel,
              onClick,
            }),
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

    const lastHelp = scene.meaning.supportConsequence?.lastHelp;
    const helpMessage = lastHelp && lastHelp.beat === beat
      ? strings.app?.helpLevels?.[lastHelp.level]
      : null;
    promptHeader.appendChild(promptText);
    activeBeatEl.appendChild(promptHeader);
    if (helpMessage) {
      const helpEl = document.createElement('p');
      helpEl.classList.add('active-beat-help');
      helpEl.textContent = helpMessage;
      activeBeatEl.appendChild(helpEl);
    }
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
