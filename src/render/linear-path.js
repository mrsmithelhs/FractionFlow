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
  let contextSectionEl = null;
  let completedBeatsEl = null;
  let activeBeatEl = null;
  let previousFocusRef = null;
  let activeBeatRenderToken = null;

  function isElementVisible(el) {
    let curr = el;
    while (curr) {
      if (curr.hidden || (typeof curr.hasAttribute === 'function' && curr.hasAttribute('hidden'))) {
        return false;
      }
      curr = curr.parentNode;
    }
    return true;
  }

  function initLayout() {
    rootEl = document.createElement('div');
    rootEl.classList.add('accessible-linear-path');
    rootEl.setAttribute('role', 'region');
    rootEl.setAttribute('aria-label', 'Accessible step-by-step fraction lesson');
    container.appendChild(rootEl);

    // Mathematical Context Section
    contextSectionEl = document.createElement('section');
    contextSectionEl.classList.add('linear-context-section');
    contextSectionEl.setAttribute('aria-label', 'Current problem and quantities');
    rootEl.appendChild(contextSectionEl);

    // Active Beat Section
    activeBeatEl = document.createElement('section');
    activeBeatEl.classList.add('active-beat-section', 'linear-active-section');
    rootEl.appendChild(activeBeatEl);

    // Completed Beats Section (Collapsed Context)
    completedBeatsEl = document.createElement('section');
    completedBeatsEl.classList.add('completed-beats-section', 'linear-completed-section');
    completedBeatsEl.setAttribute('aria-label', 'Previous steps');
    rootEl.appendChild(completedBeatsEl);
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

    const isPremise = scene.meaning.currentTask?.beat === 'reflect'
      && scene.meaning.currentTask?.connectionForm === 'premise';

    if (isPremise && scene.meaning.premiseCase) {
      const premiseCase = scene.meaning.premiseCase;
      const src = premiseCase.sourceForm;
      const pres = premiseCase.presentedForm;

      const item1 = document.createElement('li');
      item1.textContent = `Starting fraction: ${src.numerator} of ${src.denominator} equal parts in 1 whole.`;
      list.appendChild(item1);

      const item2 = document.createElement('li');
      item2.textContent = `New parts: ${pres.numerator} of ${pres.denominator} equal parts in 1 whole.`;
      list.appendChild(item2);
    } else {
      for (const side of ['left', 'right']) {
        const item = document.createElement('li');
        const beat = scene.meaning.currentTask?.beat;
        const isReplaying = Boolean(scene.presentation?.isReplaying);
        const isConversionBeat = beat === 'transform' || beat === 'operate' || isReplaying;
        const isTransformed = isConversionBeat
          && scene.meaning.transition
          && scene.meaning.transition.changed?.includes(side);

        if (isTransformed && scene.presentation.choreography === 'juxtaposed' && strings.transition?.linearJuxtaposed) {
          const pre = scene.meaning.transition.pre[side];
          const post = scene.meaning.transition.post[side];
          const baseText = strings.transition.linearJuxtaposed(side, pre.numerator, pre.denominator, post.numerator, post.denominator);
          item.textContent = isReplaying ? `${baseText} (replaying)` : baseText;
          if (isReplaying) item.classList.add('replay-active', 'replay-highlight');
        } else if (isTransformed && scene.presentation.choreography === 'sequential' && strings.transition?.linearSequential) {
          const pre = scene.meaning.transition.pre[side];
          const post = scene.meaning.transition.post[side];
          const baseText = strings.transition.linearSequential(side, pre.numerator, pre.denominator, post.numerator, post.denominator);
          item.textContent = isReplaying ? `${baseText} (replaying)` : baseText;
          if (isReplaying) item.classList.add('replay-active', 'replay-highlight');
        } else if (isTransformed && isReplaying && scene.presentation.choreography === 'in-place') {
          const pre = scene.meaning.transition.pre[side];
          item.textContent = typeof strings.transition?.replayingAria === 'function'
            ? strings.transition.replayingAria(side, pre.numerator, pre.denominator)
            : `${side === 'left' ? 'First' : 'Second'} fraction replaying: started with ${pre.numerator} of ${pre.denominator} equal parts in 1 whole.`;
          item.classList.add('replay-active', 'replay-highlight');
        } else {
          const ord = side === 'left' ? 'First' : 'Second';
          item.textContent = `${ord} fraction: ${quantities[side].currentForm.numerator} of ${quantities[side].currentForm.denominator} equal parts in 1 whole.`;
        }
        list.appendChild(item);
      }
    }

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
      milestones.push(strings.summaryLines.decideDone(
        unitRel.commonUnit.targetDenominator,
        unitRel.commonUnit.mathClassification,
      ));
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
    const task = scene.meaning.currentTask;
    const beat = task.beat;
    const isReplaying = Boolean(scene.presentation?.isReplaying);
    const recovery = scene.meaning.status.recovery;

    // Condition B & Repair 07 Item 2: Scope re-render so active control subtree is not rebuilt on replay
    const token = JSON.stringify({
      beat,
      target: task.target,
      promptId: task.promptId,
      connectionForm: task.connectionForm,
      resolved: scene.meaning.status.episode === 'resolved',
      recoveryKind: recovery?.classification?.kind,
      recoveryTarget: recovery?.classification?.targetDenominator || recovery?.classification?.proposed,
      helpLevel: scene.meaning.supportConsequence?.lastHelp?.level,
      helpBeat: scene.meaning.supportConsequence?.lastHelp?.beat,
      isInspection: beat === 'reflect' && isReplaying && Boolean(scene.meaning.transition),
      premiseCaseId: scene.meaning.premiseCase?.id,
    });

    if (activeBeatRenderToken === token) {
      return;
    }
    activeBeatRenderToken = token;

    // Focus management (Condition B): Capture active element before unmount
    const isInspection = beat === 'reflect' && isReplaying && Boolean(scene.meaning.transition);
    if (isInspection && !previousFocusRef && typeof document !== 'undefined' && document.activeElement && rootEl.contains(document.activeElement)) {
      previousFocusRef = document.activeElement;
    }

    activeBeatEl.replaceChildren();

    // Prompt Header
    const promptHeader = document.createElement('div');
    promptHeader.classList.add('active-beat-header');

    const promptText = document.createElement('h3');
    promptText.classList.add('active-beat-prompt');

    // Controls Container
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('active-beat-controls');

    if (scene.meaning.status.episode === 'resolved') {
      let completeMessage = strings.resolve.complete || 'You finished this problem.';
      if (task.connectionForm === 'premise' && scene.meaning.premiseCase) {
        completeMessage = scene.meaning.premiseCase.expectedResponse === 'yes'
          ? (strings.reflect.premiseExpectedYes || completeMessage)
          : (strings.reflect.premiseExpectedNo || completeMessage);
      }
      promptText.textContent = completeMessage;
      promptHeader.appendChild(promptText);
      activeBeatEl.appendChild(promptHeader);
      return;
    }

    // Local recovery feedback
    if (recovery && recovery.beat === beat) {
      const recoveryEl = document.createElement('div');
      recoveryEl.classList.add('active-beat-feedback', 'recovery-feedback');
      recoveryEl.setAttribute('role', 'alert');

      if (recovery.classification.kind === 'invalid-common-denominator') {
        const denom = recovery.classification.targetDenominator
          || recovery.classification.proposed
          || 'This number';
        recoveryEl.textContent = strings.decide.invalidDenominator(denom);
      } else if (recovery.classification.kind === 'denominator-changed-without-numerator') {
        recoveryEl.textContent = strings.transform.errorScaleFactor;
      } else if (recovery.classification.kind === 'incorrect-equivalent-numerator') {
        recoveryEl.textContent = strings.transform.errorNumerator;
      } else if (recovery.classification.kind === 'incorrect-numerator-arithmetic') {
        recoveryEl.textContent = strings.operate.errorArithmetic;
      } else if (recovery.classification.kind === 'incorrect-notice') {
        // In Phase 2, only unlike-denominator fixtures ship (expectedMatches is always false).
        // A like-denominator mistake (learner answers "different" when denominators match) has no
        // authored string yet and is deferred to Phase 3 like-denominator work.
        const leftDen = scene.meaning.quantities.left.unit.denominator;
        const rightDen = scene.meaning.quantities.right.unit.denominator;
        recoveryEl.textContent = typeof strings.notice.feedbackSame === 'function'
          ? strings.notice.feedbackSame(leftDen, rightDen)
          : strings.notice.feedbackSame;
      } else if (recovery.classification.kind === 'incorrect-reflection') {
        if (task.connectionForm === 'premise') {
          const isYes = recovery.classification.response === 'yes';
          recoveryEl.textContent = isYes
            ? strings.reflect.premiseFalseYesNotice
            : (strings.reflect.premiseFalseNoNotice || strings.status.stepIncorrect);
        } else {
          recoveryEl.textContent = strings.reflect.matchingDistractorLinear
            || strings.reflect.matchingDistractor;
        }
      } else if (recovery.classification.kind === 'invalid-reflection-choice') {
        recoveryEl.textContent = strings.reflect.invalidChoiceLinear
          || strings.reflect.invalidChoice
          || strings.status.stepIncorrect;
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
        const raw = scene.meaning.operation.rawResult;
        const pref = scene.meaning.operation.simplifiedResult || raw;

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
              proposed: raw,
            });
          },
        });
        controlsContainer.appendChild(nextBtn);
        break;
      }

      case 'reflect': {
        if (scene.presentation?.isReplaying && scene.meaning.transition) {
          const transition = scene.meaning.transition;
          const side = transition.changed[0] || 'right';
          const pre = transition.pre[side];
          const post = transition.post[side];
          const preNum = Number(pre.numerator);
          const preDen = Number(pre.denominator);
          const postNum = Number(post.numerator);
          const postDen = Number(post.denominator);

          promptText.textContent = strings.app?.replayInspectionHeading || 'Looking back at the last change:';

          const card = document.createElement('div');
          card.classList.add('linear-replay-inspection-card');
          card.setAttribute('role', 'region');
          card.setAttribute('aria-label', promptText.textContent);

          const note = document.createElement('p');
          note.classList.add('linear-replay-inspection-note');
          const choreography = scene.presentation.choreography || 'in-place';
          if (choreography === 'juxtaposed' && typeof strings.transition?.linearJuxtaposed === 'function') {
            note.textContent = strings.transition.linearJuxtaposed(side, preNum, preDen, postNum, postDen);
          } else if (choreography === 'sequential' && typeof strings.transition?.linearSequential === 'function') {
            note.textContent = strings.transition.linearSequential(side, preNum, preDen, postNum, postDen);
          } else {
            note.textContent = typeof strings.summaryLines?.transformDone === 'function'
              ? strings.summaryLines.transformDone(side, `${preNum}/${preDen}`, `${postNum}/${postDen}`)
              : `${side === 'left' ? 'First' : 'Second'} fraction: ${preNum}/${preDen} = ${postNum}/${postDen}`;
          }
          card.appendChild(note);

          const doneButton = createButton({
            label: strings.app?.doneLooking || 'Done looking',
            className: 'app-done-looking-button',
            onClick: () => {
              dispatchAction({ type: 'dismiss-replay' });
            },
          });
          card.appendChild(doneButton);
          controlsContainer.appendChild(card);

          // Focus management (Condition B)
          if (!previousFocusRef && typeof document !== 'undefined' && document.activeElement && rootEl.contains(document.activeElement)) {
            previousFocusRef = document.activeElement;
          }
          setTimeout(() => {
            if (isElementVisible(rootEl) && typeof doneButton.focus === 'function') {
              doneButton.focus();
            }
          }, 0);
        } else {
          // Restore focus on exit if saved (Condition B)
          if (previousFocusRef) {
            const elToFocus = previousFocusRef;
            previousFocusRef = null;
            setTimeout(() => {
              if (!isElementVisible(rootEl)) return;
              if (elToFocus && elToFocus.isConnected && typeof elToFocus.focus === 'function') {
                elToFocus.focus();
              } else {
                const firstChoice = controlsContainer.querySelector('button, input') || controlsContainer.querySelector('button');
                if (firstChoice && typeof firstChoice.focus === 'function') firstChoice.focus();
              }
            }, 0);
          }

          // DECISION-026 & Condition 6: Check-the-premise form and visual matching form
          const isPremise = scene.meaning.currentTask.connectionForm === 'premise';

          if (isPremise) {
            const premiseCase = scene.meaning.premiseCase;
            const framingEl = document.createElement('p');
            framingEl.classList.add('premise-framing');
            if (premiseCase && typeof strings.reflect?.premiseFramingLinear === 'function') {
              const pres = `${premiseCase.presentedForm.numerator}/${premiseCase.presentedForm.denominator}`;
              const src = `${premiseCase.sourceForm.numerator}/${premiseCase.sourceForm.denominator}`;
              framingEl.textContent = strings.reflect.premiseFramingLinear(pres, src);
            } else {
              framingEl.textContent = strings.reflect?.premiseFraming || 'Check this renaming:';
            }
            promptHeader.appendChild(framingEl);

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

            const choices = scene.meaning.reflectionChoices;
            if (!Array.isArray(choices) || choices.length < 3) {
              throw new RenderContractError(
                'MISSING_REFLECTION_CHOICES',
                'linear matching requires at least three content-supplied choices',
              );
            }
            const options = choices.map((choice) => ({
              label: `${choice.form.numerator}/${choice.form.denominator}`,
              value: choice.id,
              ariaLabel: strings.reflect.matchingOptionLabelLinear(
                choice.form.numerator,
                choice.form.denominator,
              ),
            }));

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
      activeBeatRenderToken = null;
    },
    getElement() {
      return rootEl;
    },
  };
}
