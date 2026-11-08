import { assertValidScene, RenderContractError } from './contract.js';
import { STRINGS } from './strings.js';
import { isPlan86ReviewInspect, showPlan86FixedDenominator } from './plan86-review-presentation.js';
import { createFractionBarRenderer, createMultiWholeStack, createTakeawayBar, createTrackAndReadout } from './fraction-bar.js';
import { createSymbolicRenderer } from './symbolic.js';
import { createSymbolicFraction } from './symbolic.js';
import {
  createButton,
  createFractionResponseInput,
  createNumericInput,
  createChoiceGroup,
} from './controls.js';
import { createVisualMatchingChoice } from './matching-choice.js';
import { createOperateResponse } from './operate-response.js';

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
  isTaskHelpOpen = () => false,
  isInspectChangeOpen = () => false,
  onInspectChangeOpen = () => {},
  getProgression = null,
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
  let activeBeatRenderToken = null;
  let activeOperateResponse = null;

  function isElementVisible(el) {
    let curr = el;
    // Stop at the document: `document.hidden` is the Page Visibility API, not an
    // element's hidden attribute, and reading it would disable focus management
    // in any backgrounded tab.
    while (curr && curr !== globalThis.document) {
      if (curr.hidden || (typeof curr.hasAttribute === 'function' && curr.hasAttribute('hidden'))) {
        return false;
      }
      curr = curr.parentNode;
    }
    return true;
  }

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
    if (scene.meaning.takeaway) {
      const schedulePosition = scene.meaning.currentTask.schedulePosition;
      const milestones = [];
      if (schedulePosition > 0) {
        milestones.push(strings.summaryLines.encounterDone || 'Problem established.');
      }
      if (Boolean(scene.meaning.currentTask.patternId)) {
        const quantities = scene.meaning.quantities;
        const changedSides = ['left', 'right'].filter((side) => {
          const quantity = quantities[side];
          return quantity.sourceForm.numerator !== quantity.currentForm.numerator
            || quantity.sourceForm.denominator !== quantity.currentForm.denominator;
        });
        for (const side of changedSides) {
          const quantity = quantities[side];
          milestones.push(strings.summaryLines.transformDone(
            side,
            `${quantity.sourceForm.numerator}/${quantity.sourceForm.denominator}`,
            `${quantity.currentForm.numerator}/${quantity.currentForm.denominator}`,
          ));
        }
      }
      if (milestones.length === 0) return;
      if (milestones.length === 1) {
        const summary = document.createElement('div');
        summary.classList.add('completed-beat-summary');
        appendMilestoneSummary(summary, milestones[0], scene.meaning.quantities);
        completedBeatsEl.appendChild(summary);
        return;
      }
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
        appendMilestoneSummary(summary, milestones[i], scene.meaning.quantities);
        details.appendChild(summary);
      }
      completedBeatsEl.appendChild(details);
      const latestSummary = document.createElement('div');
      latestSummary.classList.add('completed-beat-summary', 'completed-beat-summary-latest');
      appendMilestoneSummary(latestSummary, milestones.at(-1), scene.meaning.quantities);
      completedBeatsEl.appendChild(latestSummary);
      return;
    }
    const currentTask = scene.meaning.currentTask;
    const currentEntryId = currentTask.scheduleEntryId;
    const schedulePosition = currentTask.schedulePosition;
    const unitRel = scene.meaning.unitRelationship;
    const quantities = scene.meaning.quantities;
    const op = scene.meaning.operation;
    const isCompactTask = Boolean(currentTask.patternId);
    const nestedContext = scene.derivation?.sourceContext?.instructional?.taskContext;
    const isNestedTask = nestedContext?.definitionId === 'phase-3-nested-renaming-addition'
      && nestedContext.definitionRevision === '1';

    const milestones = [];

    // Encounter is completed if past encounter
    if (schedulePosition > 0) {
      milestones.push(strings.summaryLines.encounterDone || 'Problem established.');
    }

    // Notice completed if past notice
    if (!isCompactTask && !isNestedTask && schedulePosition > 1) {
      const denominators = unitRel.sourceDenominators;
      milestones.push(denominators.left === denominators.right
        && typeof strings.summaryLines.noticeDoneSame === 'function'
        ? strings.summaryLines.noticeDoneSame(denominators.left)
        : strings.summaryLines.noticeDone);
    }

    // Decide completed if common unit is established and past decide
    if (!isNestedTask && !isCompactTask && unitRel.commonUnit && schedulePosition > 2 && currentEntryId !== 'decide') {
      milestones.push({
        text: strings.summaryLines.decideDone(
          unitRel.commonUnit.targetDenominator,
          unitRel.commonUnit.mathClassification,
        ),
        selectedUnitHelp: scene.meaning.supportConsequence?.decideHelpRequested
          ? unitRel.commonUnit
          : null,
      });
    }

    // Transform completed if conversions established and past transform
    if (schedulePosition > 2 && !currentEntryId.startsWith('transform-')) {
      const changedSides = ['left', 'right'].filter((side) => {
        const quantity = quantities[side];
        return quantity.sourceForm.numerator !== quantity.currentForm.numerator
          || quantity.sourceForm.denominator !== quantity.currentForm.denominator;
      });
      for (const side of changedSides) {
        const quantity = quantities[side];
        milestones.push(strings.summaryLines.transformDone(
          side,
          `${quantity.sourceForm.numerator}/${quantity.sourceForm.denominator}`,
          `${quantity.currentForm.numerator}/${quantity.currentForm.denominator}`,
        ));
      }
    }

    // Operate completed if past operate
    if (op.rawResult && currentEntryId !== 'operate') {
      milestones.push(strings.summaryLines.operateDone(
        `${op.rawResult.numerator}/${op.rawResult.denominator}`,
      ));
    }

    // Resolve completed if past resolve
    if ((currentEntryId === 'reflect' || (isNestedTask && currentEntryId === 'resolve')) && (op.preferredFinalForm || op.rawResult)) {
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
      appendMilestoneSummary(summary, milestones[0], quantities);
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
      appendMilestoneSummary(summary, milestones[i], quantities);
      details.appendChild(summary);
    }
    completedBeatsEl.appendChild(details);

    // Most recent milestone is always visible inline directly above active beat
    const latestSummary = document.createElement('div');
    latestSummary.classList.add('completed-beat-summary', 'latest-milestone');
    appendMilestoneSummary(latestSummary, milestones[milestones.length - 1], quantities);
    completedBeatsEl.appendChild(latestSummary);
  }

  function appendMilestoneSummary(containerEl, milestone, quantities) {
    if (typeof milestone === 'string') {
      containerEl.textContent = milestone;
      return;
    }
    const milestoneText = document.createElement('span');
    milestoneText.textContent = milestone.text;
    containerEl.appendChild(milestoneText);
    const unit = milestone.selectedUnitHelp;
    if (!unit?.scaleFactors) return;
    const details = document.createElement('details');
    details.classList.add('selected-unit-help');
    const summary = document.createElement('summary');
    summary.textContent = strings.decide.selectedUnitHelpSummary(unit.targetDenominator);
    details.appendChild(summary);
    const explanation = document.createElement('p');
    const unitName = strings.decide.selectedUnitName(unit.targetDenominator);
    explanation.textContent = strings.decide.selectedUnitHelp(
      unit.targetDenominator,
      unitName,
      unit.scaleFactors.left,
      quantities.left.unit.denominator,
      unit.scaleFactors.right,
      quantities.right.unit.denominator,
    );
    details.appendChild(explanation);
    containerEl.appendChild(details);
  }

  function renderActiveBeat(scene) {
    const task = scene.meaning.currentTask;
    const beat = task.beat;
    const isReplaying = Boolean(scene.presentation?.isReplaying);
    const recovery = scene.meaning.status.recovery;
    const activeTaskHelp = beat === 'transform'
      && scene.meaning.taskHelp?.kind === 'equivalent-fraction'
      ? scene.meaning.taskHelp
      : null;
    const showingMultiplierStep = Boolean(activeTaskHelp
      && isTaskHelpOpen()
      && activeTaskHelp.status !== 'accepted');

    // Condition B & Repair 07 Item 2: Scope re-render so active control subtree is not rebuilt on replay
    const token = JSON.stringify({
      beat,
      schedulePosition: task.schedulePosition,
      scheduleEntryId: task.scheduleEntryId,
      target: task.target,
      targetDenominator: task.targetDenominator,
      promptId: task.promptId,
      connectionForm: task.connectionForm,
      resolved: scene.meaning.status.episode === 'resolved',
      recoveryKind: recovery?.classification?.kind,
      recoveryTarget: recovery?.classification?.targetDenominator || recovery?.classification?.proposed,
      taskHelp: beat === 'transform' ? scene.meaning.taskHelp : null,
      taskHelpOpen: Boolean(isTaskHelpOpen()),
      inspectChangeOpen: Boolean(isInspectChangeOpen()),
      candidate: beat === 'transform' ? task.candidate : null,
      helpLevel: beat === 'decide' ? null : scene.meaning.supportConsequence?.lastHelp?.level,
      helpBeat: beat === 'decide' ? null : scene.meaning.supportConsequence?.lastHelp?.beat,
      support: scene.meaning.support,
      premiseComparison: scene.meaning.supportConsequence?.premiseComparison,
      candidateDenominators: scene.meaning.unitRelationship?.candidateDenominators,
      isInspection: beat === 'reflect' && isReplaying && Boolean(scene.meaning.transition),
      premiseCaseId: scene.meaning.premiseCase?.id,
      takeawayRemoval: scene.meaning.takeaway?.removalStatus,
      takeawayHelpOpen: Boolean(scene.meaning.takeaway && isTaskHelpOpen()),
      operationResponseContext: beat === 'operate' ? [
        Boolean(scene.meaning.takeaway),
        scene.meaning.unitRelationship.commonUnit?.kind,
        scene.meaning.quantities.left.currentForm.denominator,
      ] : null,
    });

    if (activeBeatRenderToken === token) {
      return;
    }
    activeOperateResponse?.invalidate();
    activeOperateResponse = null;
    activeBeatRenderToken = token;

    const isInspection = beat === 'reflect' && isReplaying && Boolean(scene.meaning.transition);

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
      promptHeader.classList.add('house-success');
      let completeMessage = strings.resolve.complete || 'You finished this problem.';
      if (task.connectionForm === 'premise' && scene.meaning.premiseCase) {
        completeMessage = scene.meaning.premiseCase.expectedResponse === 'yes'
          ? (strings.reflect.premiseExpectedYes || completeMessage)
          : (strings.reflect.premiseExpectedNo || completeMessage);
      }
      promptText.textContent = completeMessage;
      promptHeader.appendChild(promptText);
      activeBeatEl.appendChild(promptHeader);

      const progression = getProgression ? getProgression() : null;
      if (progression && progression.actionKind !== 'none') {
        if (progression.notice) {
          const noticeEl = document.createElement('p');
          noticeEl.className = 'progression-notice';
          noticeEl.textContent = progression.notice;
          controlsContainer.appendChild(noticeEl);
        }
        const actionBtn = createButton({
          label: progression.label,
          className: 'control-action-btn',
          onClick: () => progression.onAction?.(),
        });
        controlsContainer.appendChild(actionBtn);
        activeBeatEl.appendChild(controlsContainer);
      }
      return;
    }

    // Local recovery feedback (Quality doc §16, §63)
    let decideRecoveryEl = null;
    if (recovery && recovery.beat === beat && !showingMultiplierStep) {
      const recoveryEl = document.createElement('div');
      recoveryEl.classList.add('active-beat-feedback', 'recovery-feedback');
      recoveryEl.setAttribute('role', 'alert');

      if (recovery.classification.kind === 'invalid-common-denominator') {
        const denom = recovery.classification.targetDenominator
          || recovery.classification.proposed
          || 'This number';
        const reasons = recovery.classification.reasons || [];
        const failedSide = reasons.includes('not-divisible-by-left-denominator')
          ? 'left'
          : reasons.includes('not-divisible-by-right-denominator') ? 'right' : null;
        if (failedSide && reasons.length === 1) {
          const multipleSide = failedSide === 'left' ? 'right' : 'left';
          recoveryEl.textContent = strings.decide.invalidOneSidedDenominator(
            denom,
            scene.meaning.unitRelationship.sourceDenominators[multipleSide],
            scene.meaning.unitRelationship.sourceDenominators[failedSide],
          );
        } else {
          recoveryEl.textContent = strings.decide.invalidDenominator(denom);
        }
      } else if (recovery.classification.kind === 'valid-but-unavailable-task-path') {
        recoveryEl.classList.add('house-attention');
        recoveryEl.textContent = strings.decide.validButUnavailable(
          recovery.classification.targetDenominator,
        );
      } else if (recovery.classification.kind === 'denominator-changed-without-numerator') {
        recoveryEl.textContent = strings.transform.errorScaleFactor;
      } else if (recovery.classification.kind === 'incorrect-equivalent-numerator') {
        recoveryEl.textContent = strings.transform.errorNumerator;
      } else if (recovery.classification.kind === 'side-choice-needs-retry') {
        recoveryEl.textContent = strings.nestedAddition.wrongSide(task.targetDenominator ?? '8');
      } else if (recovery.classification.kind === 'incorrect-numerator-arithmetic') {
        recoveryEl.textContent = strings.operate.errorArithmetic;
      } else if (recovery.classification.kind === 'incorrect-notice') {
        const leftDen = scene.meaning.quantities.left.unit.denominator;
        const rightDen = scene.meaning.quantities.right.unit.denominator;
        recoveryEl.textContent = recovery.classification.expectedMatches
          ? strings.notice.feedbackDifferentWhenSame(leftDen)
          : typeof strings.notice.feedbackSame === 'function'
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
      } else if (recovery.classification.kind === 'incorrect-subtraction-result') {
        recoveryEl.textContent = strings.subtraction.errorRecovery;
      } else if (recovery.classification.kind === 'invalid-reflection-choice') {
        recoveryEl.textContent = strings.reflect.invalidChoice || strings.status.stepIncorrect;
      } else {
        recoveryEl.textContent = strings.status.stepIncorrect;
      }
      if (beat === 'decide') decideRecoveryEl = recoveryEl;
      else activeBeatEl.appendChild(recoveryEl);
    }

    switch (beat) {
      case 'encounter': {
        if (scene.meaning.takeaway) {
          promptText.textContent = strings.subtraction.howMuchLeft;
          const takeAwayBtn = createButton({
            label: strings.subtraction.takeAwayButton,
            className: 'control-action-btn',
            onClick: () => dispatchAction({ type: 'mark-subtrahend-amount' }),
          });
          controlsContainer.appendChild(takeAwayBtn);
          break;
        }
        promptText.textContent = strings.encounter.prompt;
        if (task.patternId && !['full-addition.identify-side-construct', 'unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(task.patternId)) {
          const targetContext = document.createElement('p');
          targetContext.classList.add('active-beat-prompt-context');
          targetContext.textContent = strings.encounter.compactTarget(task.targetDenominator);
          controlsContainer.appendChild(targetContext);
        }
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
        if (task.inputKind === 'side-choice') {
          const options = ['left', 'right'].map((side) => {
            const quantity = scene.meaning.quantities[side];
            return { side, form: quantity.sourceForm, value: side };
          });
          const choiceGroup = createChoiceGroup({
            legend: strings.nestedAddition.sideChoicePrompt,
            options,
            onSelect: (side) => dispatchAction({ type: 'select-renaming-side', side }),
            renderOption: (option, onClick) => {
              const button = createButton({ label: option.side === 'left' ? strings.nestedAddition.firstFraction : strings.nestedAddition.secondFraction, ariaLabel: `${option.side === 'left' ? strings.nestedAddition.firstFraction : strings.nestedAddition.secondFraction}, ${option.form.numerator} over ${option.form.denominator}`, className: 'nested-side-choice', onClick });
              button.classList.add('control-choice-btn');
              button.appendChild(createSymbolicFraction(option.form.numerator, option.form.denominator, { ariaHidden: true, variant: 'compact' }));
              return button;
            },
          });
          const legend = choiceGroup.querySelector('.control-legend');
          legend.classList.remove('sr-only');
          legend.classList.add('active-beat-prompt');
          controlsContainer.appendChild(choiceGroup);
          break;
        }
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
          const questionLegend = choiceGroup.querySelector('.control-legend');
          questionLegend.classList.remove('sr-only');
          questionLegend.classList.add('active-beat-prompt');
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
          numInput.element.querySelector('.control-label').classList.add('active-beat-prompt');
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
        const sourceForm = scene.meaning.quantities[side].sourceForm;
        const inspect = task.inputKind === 'inspect-candidate';
        if (inspect) {
          const candidate = task.candidate;
          if (!candidate) throw new RenderContractError('MISSING_INSPECT_CANDIDATE', 'inspect transform requires the current authored proposal');
          const directRepair = isPlan86ReviewInspect(scene);
          promptText.textContent = directRepair ? strings.transform.plan86InspectPrompt(side) : strings.transform.inspectPrompt(side);
          controlsContainer.appendChild(createSymbolicFraction(
            candidate.numerator, candidate.denominator, { ariaPrefix: 'New fraction', variant: 'compact' },
          ));
          const keep = createButton({
            label: 'Keep',
            ariaLabel: `Keep new fraction ${candidate.numerator} over ${candidate.denominator}`,
            className: 'control-choice-btn',
            onClick: () => dispatchAction({ type: 'keep-inspected-form' }),
          });
          controlsContainer.appendChild(keep);
          if (directRepair || isInspectChangeOpen()) {
          const changeInput = createNumericInput({
            id: `transform-num-input-${side}`,
            label: strings.transform.changeTopPrompt,
            min: 0,
            max: Number(targetDen),
            initialValue: candidate.numerator,
            buttonLabel: directRepair ? strings.controls.check : strings.transform.changeTopButton,
            strings,
            onSubmit: (val) => dispatchAction({ type: 'repair-inspected-form', numerator: String(val) }),
          });
          if (directRepair) showPlan86FixedDenominator(changeInput, targetDen, strings.transform.plan86RepairLabel(targetDen));
          controlsContainer.appendChild(changeInput.element);
          } else {
            const changeButton = createButton({
              label: strings.transform.changeTopButton,
              className: 'inspect-change-button',
              onClick: onInspectChangeOpen,
            });
            changeButton.classList.add('control-choice-btn');
            controlsContainer.appendChild(changeButton);
          }
          if (scene.meaning.taskHelp?.kind === 'inspect-comparison-invariant' && isTaskHelpOpen()) {
            const help = document.createElement('p');
            help.id = 'visual-transform-task-help';
            help.classList.add('active-beat-help');
            help.textContent = strings.transform.inspectHelp;
            controlsContainer.appendChild(help);
          }
          break;
        }
        const taskHelp = activeTaskHelp;
        const helpOpen = Boolean(isTaskHelpOpen());
        const showMultiplierStep = Boolean(taskHelp && helpOpen
          && taskHelp.status !== 'accepted');
        if (showMultiplierStep) {
          const multiplierInput = createNumericInput({
            id: `transform-help-multiplier-${side}`,
            label: strings.transform.helpMultiplierInstruction(sourceForm.denominator, targetDen),
            supportingText: strings.transform.helpMultiplierPrompt(sourceForm.denominator, targetDen),
            supportingTextId: 'visual-transform-task-help-equation',
            min: 0,
            max: Number(targetDen),
            strings,
            onSubmit: (val) => {
              if (!/^-?\d+$/.test(String(val))) {
                emptyNotice.textContent = strings.transform.helpMultiplierRequired;
                if (!emptyNotice.isConnected) controlsContainer.appendChild(emptyNotice);
                return;
              }
              dispatchAction({
                type: 'submit-transform-help-multiplier',
                proposed: { kind: 'fraction', numerator: String(val), denominator: '1' },
              });
            },
            onEmptySubmit: () => {
              emptyNotice.textContent = strings.transform.helpMultiplierRequired;
              if (!emptyNotice.isConnected) controlsContainer.appendChild(emptyNotice);
            },
          });
          multiplierInput.element.id = 'visual-transform-task-help';
          multiplierInput.element.querySelector('.control-label').classList.add('active-beat-prompt');
          const emptyNotice = document.createElement('p');
          emptyNotice.classList.add('active-beat-feedback', 'recovery-feedback', 'house-attention');
          emptyNotice.setAttribute('role', 'alert');
          multiplierInput.element.querySelector('input').addEventListener('input', () => {
            if (emptyNotice.isConnected) emptyNotice.remove();
          });
          controlsContainer.appendChild(multiplierInput.element);
          if (taskHelp.status === 'incorrect') {
            const error = document.createElement('p');
            error.classList.add('active-beat-feedback', 'recovery-feedback');
            error.setAttribute('role', 'alert');
            error.textContent = strings.transform.helpMultiplierError;
            controlsContainer.appendChild(error);
          }
        } else {
          if (taskHelp?.status === 'accepted' && helpOpen) {
            const cue = document.createElement('p');
            cue.id = 'visual-transform-task-help';
            cue.classList.add('active-beat-help');
            cue.textContent = strings.transform.helpMultiplierAccepted(taskHelp.acceptedMultiplier);
            controlsContainer.appendChild(cue);
          }
          const numInput = createNumericInput({
            id: `transform-num-input-${side}`,
            label: strings.transform.equivalentNumeratorPrompt(sourceForm, targetDen),
            min: 1,
            max: Number(targetDen),
            strings,
            onSubmit: (val) => dispatchAction({
              type: 'submit-equivalent-form',
              proposed: {
                kind: 'fraction',
                numerator: val,
                denominator: targetDen,
              },
            }),
          });
          numInput.element.querySelector('.control-label').classList.add('active-beat-prompt');
          controlsContainer.appendChild(numInput.element);
        }
        break;
      }

      case 'operate': {
        activeOperateResponse = createOperateResponse({
          scene,
          strings,
          inputPrefix: 'operate',
          taskHelpId: 'visual-subtraction-task-help',
          taskHelpText: strings.subtraction.visualHelp,
          helpOpen: isTaskHelpOpen(),
          activeBeatRoot: activeBeatEl,
          controlsRoot: controlsContainer,
          dispatchAction,
        });
        promptText.textContent = scene.meaning.takeaway
          ? strings.subtraction.howMuchLeft
          : strings.operate.prompt;
        activeOperateResponse.elements.forEach((element) => controlsContainer.appendChild(element));
        break;
      }

      case 'resolve': {
        promptHeader.classList.add('house-success');
        const progression = getProgression ? getProgression() : null;
        if (scene.meaning.takeaway) {
          const accepted = scene.meaning.takeaway.acceptedResponseForm
            || scene.meaning.operation?.acceptedResponseForm
            || scene.meaning.operation?.rawResult;
          promptText.textContent = typeof strings.subtraction.thatAmountLeft === 'function'
            ? strings.subtraction.thatAmountLeft(accepted.numerator, accepted.denominator)
            : `${accepted.numerator}/${accepted.denominator} is left.`;
          if (progression && progression.actionKind !== 'none') {
            if (progression.notice) {
              const noticeEl = document.createElement('p');
              noticeEl.className = 'progression-notice';
              noticeEl.textContent = progression.notice;
              controlsContainer.appendChild(noticeEl);
            }
            controlsContainer.appendChild(createButton({
              label: progression.label,
              className: 'control-action-btn',
              onClick: () => progression.onAction?.(),
            }));
          } else {
            const finishBtn = createButton({
              label: strings.resolve.finishButton,
              className: 'control-action-btn',
              onClick: () => dispatchAction({ type: 'finish-compact-episode' }),
            });
            controlsContainer.appendChild(finishBtn);
          }
          break;
        }

        const raw = scene.meaning.operation.rawResult;
        const pref = scene.meaning.operation.simplifiedResult || raw;
        const compact = scene.meaning.currentTask.patternId != null;
        const nestedContext = scene.derivation?.sourceContext?.instructional?.taskContext;
        const nested = nestedContext?.definitionId === 'phase-3-nested-renaming-addition'
          && nestedContext.definitionRevision === '1';
        const plan20 = scene.meaning.currentTask.promptId?.startsWith('phase3.like-addition.');

        if (compact && raw) {
          promptText.textContent = strings.resolve.compactReady(pref.numerator, pref.denominator);
        } else if (plan20 && pref && raw
          && (pref.numerator !== raw.numerator || pref.denominator !== raw.denominator)) {
          promptText.textContent = strings.resolve.likeAdditionEquivalentReady;
        } else if (pref && raw && (pref.numerator !== raw.numerator || pref.denominator !== raw.denominator)) {
          promptText.textContent = strings.resolve.unsimplifiedNotice(
            `${raw.numerator}/${raw.denominator}`,
            `${pref.numerator}/${pref.denominator}`,
          );
        } else if (pref && scene.meaning.operation.resultStack !== undefined) {
          promptText.textContent = strings.resolve.crossingAcceptedCue;
        } else if (plan20) {
          promptText.textContent = strings.resolve.likeAdditionReady;
        } else if (pref) {
          promptText.textContent = strings.resolve.summary(pref.numerator, pref.denominator);
        }

        if (progression && progression.actionKind !== 'none') {
          if (progression.notice) {
            const noticeEl = document.createElement('p');
            noticeEl.className = 'progression-notice';
            noticeEl.textContent = progression.notice;
            controlsContainer.appendChild(noticeEl);
          }
          controlsContainer.appendChild(createButton({
            label: progression.label,
            className: 'control-action-btn',
            onClick: () => progression.onAction?.(),
          }));
          break;
        }

        const nextBtn = createButton({
          label: compact || nested
            ? strings.resolve.finishButton
            : plan20
            ? strings.resolve.finishButton
            : scene.meaning.currentTask.promptId?.includes('reflect')
            ? (strings.resolve.continueReflectionButton || strings.resolve.continueButton)
            : strings.resolve.continueButton,
          onClick: () => {
            dispatchAction(compact
              ? { type: 'finish-compact-episode' }
              : nested
              ? { type: 'finish-nested-episode' }
              : { type: 'submit-resolution', proposed: raw });
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
              // Dispatch synchronously remounts the current reflection choices.
              // Resolve the target after that remount, rather than restoring the
              // Replay button that a real mouse click has just focused.
              if (!rootEl?.isConnected || !isElementVisible(rootEl)) return;
              const currentControls = rootEl.querySelector('.active-beat-controls');
              if (!currentControls?.isConnected || !rootEl.contains(currentControls)) return;
              const firstChoice = currentControls.querySelector('.matching-choice-btn, .control-choice-btn');
              if (!firstChoice?.isConnected || !currentControls.contains(firstChoice) || !isElementVisible(firstChoice)) return;
              firstChoice.classList.add('inspection-focus-return-target');
              if (typeof firstChoice.focus === 'function') firstChoice.focus();
            },
          });
          card.appendChild(doneButton);
          controlsContainer.appendChild(card);

          setTimeout(() => {
            if (isElementVisible(rootEl) && typeof doneButton.focus === 'function') {
              doneButton.focus();
            }
          }, 0);
        } else {
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
    const helpMessage = lastHelp && lastHelp.beat === beat && beat !== 'decide'
      ? strings.app?.helpLevels?.[lastHelp.level]
      : null;
    if (beat !== 'decide' && (beat !== 'transform' || task.inputKind === 'inspect-candidate')) {
      promptHeader.appendChild(promptText);
      activeBeatEl.appendChild(promptHeader);
    }
    if (helpMessage) {
      const helpEl = document.createElement('p');
      helpEl.classList.add('active-beat-help');
      helpEl.textContent = helpMessage;
      activeBeatEl.appendChild(helpEl);
    }
    activeBeatEl.appendChild(controlsContainer);
    if (decideRecoveryEl) activeBeatEl.appendChild(decideRecoveryEl);

    if (recovery?.classification?.kind === 'valid-but-unavailable-task-path' && beat === 'decide') {
      let ancestor = activeBeatEl;
      let visible = true;
      while (ancestor) {
        if (ancestor.hasAttribute?.('hidden')) visible = false;
        ancestor = ancestor.parentNode;
      }
      const responseInput = controlsContainer.querySelector('input.control-numeric-input');
      if (visible && responseInput && typeof responseInput.focus === 'function') responseInput.focus();
    }
  }

  function renderVisualSection(scene) {
    const operation = scene.meaning.operation;
    const plan17Crossing = operation?.resultStack !== undefined;
    const isResolved = scene.meaning.status.episode === 'resolved';
    const isReflection = scene.meaning.currentTask?.beat === 'reflect';
    const isInspection = isReflection && Boolean(scene.presentation?.isReplaying && scene.meaning.transition);
    const isPremise = scene.meaning.currentTask?.beat === 'reflect'
      && scene.meaning.currentTask?.connectionForm === 'premise';

    if (plan17Crossing && isInspection) {
      barsWrapper.replaceChildren();
      return;
    }

    if (plan17Crossing && operation.resultStack
      && (!isPremise || isResolved)) {
      barsWrapper.replaceChildren(createMultiWholeStack(operation.resultStack, {
        mode: scene.presentation.mode,
      }));
      return;
    }

    if (isPremise && scene.meaning.premiseCase) {
      const premiseCase = scene.meaning.premiseCase;
      const srcNum = Number(premiseCase.sourceForm.numerator);
      const srcDen = Number(premiseCase.sourceForm.denominator);
      const presNum = Number(premiseCase.presentedForm.numerator);
      const presDen = Number(premiseCase.presentedForm.denominator);
      const mode = scene.presentation.mode;
      const showSourceBar = scene.meaning.supportConsequence?.premiseComparison === 'paired-bars';

      barsWrapper.replaceChildren();

      if (!showSourceBar) {
        const sourceReference = document.createElement('p');
        sourceReference.classList.add('premise-source-reference');
        sourceReference.textContent = `Starting fraction: ${srcNum}/${srcDen}`;
        barsWrapper.appendChild(sourceReference);
      }

      const comparisonEl = document.createElement('div');
      comparisonEl.classList.add('fraction-bar-container', 'premise-comparison');
      comparisonEl.setAttribute('role', 'img');
      comparisonEl.setAttribute('tabindex', '-1');
      comparisonEl.setAttribute(
        'aria-label',
        showSourceBar
          ? `Starting fraction: ${srcNum} of ${srcDen} equal parts shaded. New parts: ${presNum} of ${presDen} equal parts shaded.`
          : `New parts: ${presNum} of ${presDen} equal parts shaded.`,
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
      if (showSourceBar) wrapper.appendChild(topRow);

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
    } else if (scene.meaning.takeaway) {
      const mode = scene.presentation?.presentationMode;
      const takeawayBar = createTakeawayBar(scene.meaning.takeaway, { mode });
      barsWrapper.replaceChildren(takeawayBar);
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
      activeOperateResponse?.invalidate();
      activeOperateResponse = null;
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
    getResponseRegion(beat) {
      return beat === 'operate' ? activeOperateResponse?.handle ?? null : null;
    },
  };
}
