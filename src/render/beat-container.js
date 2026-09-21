import { assertValidScene, RenderContractError } from './contract.js';
import { STRINGS } from './strings.js';
import { createFractionBarRenderer, createTrackAndReadout } from './fraction-bar.js';
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
  let barsWrapper = null;
  let leftBarBox = null;
  let rightBarBox = null;
  let symbolicSectionEl = null;
  let completedBeatsEl = null;
  let activeBeatEl = null;

  let leftBarRenderer = null;
  let rightBarRenderer = null;
  let symbolicRenderer = null;
  let previousFocusRef = null;
  let activeBeatRenderToken = null;

  function initLayout() {
    rootEl = document.createElement('div');
    rootEl.classList.add('episode-beat-container');
    container.appendChild(rootEl);

    // Visual representations section
    visualSectionEl = document.createElement('section');
    visualSectionEl.classList.add('render-visual-section');
    visualSectionEl.setAttribute('aria-label', 'Fraction bar models');

    barsWrapper = document.createElement('div');
    barsWrapper.classList.add('fraction-bars-wrapper');

    leftBarBox = document.createElement('div');
    leftBarBox.classList.add('fraction-bar-box');
    rightBarBox = document.createElement('div');
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

    // Active beat interaction section
    activeBeatEl = document.createElement('section');
    activeBeatEl.classList.add('active-beat-section');
    rootEl.appendChild(activeBeatEl);

    // Completed beats section (collapsed summary context)
    completedBeatsEl = document.createElement('section');
    completedBeatsEl.classList.add('completed-beats-section');
    completedBeatsEl.setAttribute('aria-label', 'Previous steps');
    rootEl.appendChild(completedBeatsEl);

    // Initialize sub-renderers
    leftBarRenderer = createFractionBarRenderer({ side: 'left', container: leftBarBox, strings, dispatchAction });
    rightBarRenderer = createFractionBarRenderer({ side: 'right', container: rightBarBox, strings, dispatchAction });
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
      milestones.push(strings.summaryLines.decideDone(
        unitRel.commonUnit.targetDenominator,
        unitRel.commonUnit.mathClassification,
      ));
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

    activeBeatEl.replaceChildren();

    // Prompt header
    const promptHeader = document.createElement('div');
    promptHeader.classList.add('active-beat-header');

    const promptText = document.createElement('h2');
    promptText.classList.add('active-beat-prompt');

    // Controls container
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

    // Local recovery feedback (Quality doc §16, §63)
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
          recoveryEl.textContent = strings.reflect.matchingDistractor;
        }
      } else if (recovery.classification.kind === 'invalid-reflection-choice') {
        recoveryEl.textContent = strings.reflect.invalidChoice || strings.status.stepIncorrect;
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
          card.classList.add('replay-inspection-card');
          card.setAttribute('role', 'region');
          card.setAttribute('aria-label', promptText.textContent);

          const summaryText = typeof strings.summaryLines?.transformDone === 'function'
            ? strings.summaryLines.transformDone(side, `${preNum}/${preDen}`, `${postNum}/${postDen}`)
            : `${side === 'left' ? 'First' : 'Second'} fraction: ${preNum}/${preDen} = ${postNum}/${postDen}`;
          const noteEl = document.createElement('p');
          noteEl.classList.add('replay-inspection-note');
          noteEl.textContent = summaryText;
          card.appendChild(noteEl);

          const choreography = scene.presentation.choreography || 'in-place';
          const mode = scene.presentation.mode;

          if (choreography === 'juxtaposed') {
            const wrapper = document.createElement('div');
            wrapper.classList.add('fraction-bar-juxtaposed');

            // Row 1: Before
            const beforeRow = document.createElement('div');
            beforeRow.classList.add('fraction-bar-comparison-row', 'fraction-bar-row-before');
            const beforeBadgeWrap = document.createElement('div');
            beforeBadgeWrap.classList.add('fraction-bar-badge-wrap');
            const beforeBadge = document.createElement('span');
            beforeBadge.classList.add('fraction-bar-badge');
            beforeBadge.textContent = strings.transition.beforeLabel(preNum, preDen);
            beforeBadgeWrap.appendChild(beforeBadge);
            beforeRow.appendChild(beforeBadgeWrap);

            const beforeBody = document.createElement('div');
            beforeBody.classList.add('fraction-bar-row-body');
            const beforeElements = createTrackAndReadout({
              numerator: preNum,
              denominator: preDen,
              isSubdivided: false,
              mode,
            });
            beforeBody.appendChild(beforeElements.trackEl);
            beforeBody.appendChild(beforeElements.readoutEl);
            beforeRow.appendChild(beforeBody);
            wrapper.appendChild(beforeRow);

            // Row 2: After
            const afterRow = document.createElement('div');
            afterRow.classList.add('fraction-bar-comparison-row', 'fraction-bar-row-after');
            const afterBadgeWrap = document.createElement('div');
            afterBadgeWrap.classList.add('fraction-bar-badge-wrap');
            const afterBadge = document.createElement('span');
            afterBadge.classList.add('fraction-bar-badge');
            afterBadge.textContent = strings.transition.afterLabel(postNum, postDen);
            afterBadgeWrap.appendChild(afterBadge);
            afterRow.appendChild(afterBadgeWrap);

            const afterBody = document.createElement('div');
            afterBody.classList.add('fraction-bar-row-body');
            const afterElements = createTrackAndReadout({
              numerator: postNum,
              denominator: postDen,
              isSubdivided: true,
              mode,
            });
            afterBody.appendChild(afterElements.trackEl);
            afterBody.appendChild(afterElements.readoutEl);
            afterRow.appendChild(afterBody);
            wrapper.appendChild(afterRow);

            card.appendChild(wrapper);
          } else if (choreography === 'sequential') {
            const wrapper = document.createElement('div');
            wrapper.classList.add('fraction-bar-sequential');

            // Card 1: Step 1
            const step1Card = document.createElement('div');
            step1Card.classList.add('fraction-bar-step-card', 'fraction-bar-step-1');
            const step1Header = document.createElement('div');
            step1Header.classList.add('fraction-bar-step-header');
            const step1Heading = document.createElement('span');
            step1Heading.classList.add('fraction-bar-step-heading');
            step1Heading.textContent = strings.transition.step1Label(preNum, preDen);
            step1Header.appendChild(step1Heading);
            step1Card.appendChild(step1Header);

            const step1Body = document.createElement('div');
            step1Body.classList.add('fraction-bar-row-body');
            const step1Elements = createTrackAndReadout({
              numerator: preNum,
              denominator: preDen,
              isSubdivided: false,
              mode,
            });
            step1Body.appendChild(step1Elements.trackEl);
            step1Body.appendChild(step1Elements.readoutEl);
            step1Card.appendChild(step1Body);
            wrapper.appendChild(step1Card);

            // Connector
            const connector = document.createElement('div');
            connector.classList.add('fraction-bar-step-connector');
            connector.setAttribute('aria-hidden', 'true');
            const connectorText = document.createElement('span');
            connectorText.classList.add('fraction-bar-connector-text');
            connectorText.textContent = `\u2193 ${strings.transition.stepConnector(postDen)}`;
            connector.appendChild(connectorText);
            wrapper.appendChild(connector);

            // Card 2: Step 2
            const step2Card = document.createElement('div');
            step2Card.classList.add('fraction-bar-step-card', 'fraction-bar-step-2');
            const step2Header = document.createElement('div');
            step2Header.classList.add('fraction-bar-step-header');
            const step2Heading = document.createElement('span');
            step2Heading.classList.add('fraction-bar-step-heading');
            step2Heading.textContent = strings.transition.step2Label(postNum, postDen);
            step2Header.appendChild(step2Heading);
            step2Card.appendChild(step2Header);

            const step2Body = document.createElement('div');
            step2Body.classList.add('fraction-bar-row-body');
            const step2Elements = createTrackAndReadout({
              numerator: postNum,
              denominator: postDen,
              isSubdivided: true,
              mode,
            });
            step2Body.appendChild(step2Elements.trackEl);
            step2Body.appendChild(step2Elements.readoutEl);
            step2Card.appendChild(step2Body);
            wrapper.appendChild(step2Card);

            card.appendChild(wrapper);
          } else {
            // in-place
            const wrapper = document.createElement('div');
            wrapper.classList.add('fraction-bar-in-place-replay');

            const headerRow = document.createElement('div');
            headerRow.classList.add('fraction-bar-replay-header');
            const badge = document.createElement('span');
            badge.classList.add('fraction-bar-badge');
            badge.textContent = typeof strings.transition?.replayingLabel === 'function'
              ? strings.transition.replayingLabel(preNum, preDen)
              : `Starting parts: ${preNum}/${preDen}`;
            headerRow.appendChild(badge);
            wrapper.appendChild(headerRow);

            const body = document.createElement('div');
            body.classList.add('fraction-bar-row-body');
            const elements = createTrackAndReadout({
              numerator: preNum,
              denominator: preDen,
              isSubdivided: false,
              mode,
            });
            body.appendChild(elements.trackEl);
            body.appendChild(elements.readoutEl);
            wrapper.appendChild(body);

            card.appendChild(wrapper);
          }

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
            if (typeof doneButton.focus === 'function') {
              doneButton.focus();
            }
          }, 0);
        } else {
          // Restore focus on exit if saved (Condition B)
          if (previousFocusRef) {
            const elToFocus = previousFocusRef;
            previousFocusRef = null;
            setTimeout(() => {
              if (elToFocus && elToFocus.isConnected && typeof elToFocus.focus === 'function') {
                elToFocus.focus();
              } else {
                const firstChoice = controlsContainer.querySelector('button, input');
                if (firstChoice && typeof firstChoice.focus === 'function') firstChoice.focus();
              }
            }, 0);
          }

          const isPremise = scene.meaning.currentTask.connectionForm === 'premise';

          if (isPremise) {
            // DECISION-026: Check-the-premise form (answer is not always the reassuring one)
            const framingEl = document.createElement('p');
            framingEl.classList.add('premise-framing');
            framingEl.textContent = strings.reflect?.premiseFraming || 'Check this renaming:';
            promptHeader.appendChild(framingEl);

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

  function renderVisualSection(scene) {
    const isPremise = scene.meaning.currentTask?.beat === 'reflect'
      && scene.meaning.currentTask?.connectionForm === 'premise';

    if (isPremise && scene.meaning.premiseCase) {
      const premiseCase = scene.meaning.premiseCase;
      const srcNum = Number(premiseCase.sourceForm.numerator);
      const srcDen = Number(premiseCase.sourceForm.denominator);
      const presNum = Number(premiseCase.presentedForm.numerator);
      const presDen = Number(premiseCase.presentedForm.denominator);
      const mode = scene.presentation.mode;

      barsWrapper.replaceChildren();

      const comparisonEl = document.createElement('div');
      comparisonEl.classList.add('fraction-bar-container', 'premise-comparison');
      comparisonEl.setAttribute('role', 'img');
      comparisonEl.setAttribute('tabindex', '-1');
      comparisonEl.setAttribute(
        'aria-label',
        `Starting fraction: ${srcNum} of ${srcDen} equal parts shaded. New parts: ${presNum} of ${presDen} equal parts shaded.`,
      );

      const wrapper = document.createElement('div');
      wrapper.classList.add('fraction-bar-juxtaposed');

      // Top Row: Starting fraction
      const topRow = document.createElement('div');
      topRow.classList.add('fraction-bar-comparison-row', 'fraction-bar-row-before');
      const topBadgeWrap = document.createElement('div');
      topBadgeWrap.classList.add('fraction-bar-badge-wrap');
      const topBadge = document.createElement('span');
      topBadge.classList.add('fraction-bar-badge');
      topBadge.textContent = typeof strings.reflect?.premiseTopBarLabel === 'function'
        ? strings.reflect.premiseTopBarLabel(srcNum, srcDen)
        : `Starting fraction: ${srcNum}/${srcDen}`;
      topBadgeWrap.appendChild(topBadge);
      topRow.appendChild(topBadgeWrap);

      const topBody = document.createElement('div');
      topBody.classList.add('fraction-bar-row-body');
      const topElements = createTrackAndReadout({
        numerator: srcNum,
        denominator: srcDen,
        isSubdivided: false,
        mode,
      });
      topBody.appendChild(topElements.trackEl);
      topBody.appendChild(topElements.readoutEl);
      topRow.appendChild(topBody);
      wrapper.appendChild(topRow);

      // Bottom Row: New parts
      const bottomRow = document.createElement('div');
      bottomRow.classList.add('fraction-bar-comparison-row', 'fraction-bar-row-after');
      const bottomBadgeWrap = document.createElement('div');
      bottomBadgeWrap.classList.add('fraction-bar-badge-wrap');
      const bottomBadge = document.createElement('span');
      bottomBadge.classList.add('fraction-bar-badge');
      bottomBadge.textContent = typeof strings.reflect?.premiseBottomBarLabel === 'function'
        ? strings.reflect.premiseBottomBarLabel(presNum, presDen)
        : `New parts: ${presNum}/${presDen}`;
      bottomBadgeWrap.appendChild(bottomBadge);
      bottomRow.appendChild(bottomBadgeWrap);

      const bottomBody = document.createElement('div');
      bottomBody.classList.add('fraction-bar-row-body');
      const bottomElements = createTrackAndReadout({
        numerator: presNum,
        denominator: presDen,
        isSubdivided: true,
        mode,
      });
      bottomBody.appendChild(bottomElements.trackEl);
      bottomBody.appendChild(bottomElements.readoutEl);
      bottomRow.appendChild(bottomBody);
      wrapper.appendChild(bottomRow);

      comparisonEl.appendChild(wrapper);
      barsWrapper.appendChild(comparisonEl);
    } else {
      if (!barsWrapper.contains(leftBarBox)) {
        barsWrapper.replaceChildren(leftBarBox, rightBarBox);
      }
      leftBarRenderer.update(scene);
      rightBarRenderer.update(scene);
    }
  }

  function update(scene) {
    assertValidScene(scene);

    // Update child renderers
    renderVisualSection(scene);
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
      activeBeatRenderToken = null;
    },
    getElement() {
      return rootEl;
    },
  };
}
