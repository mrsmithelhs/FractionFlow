import { createFractionResponseInput, createNumericInput } from './controls.js';
import { STRINGS } from './strings.js';

function isHiddenThroughAncestors(element) {
  let current = element;
  while (current && current !== globalThis.document) {
    const style = current.style;
    if (current.hidden || current.hasAttribute?.('hidden')
      || style?.display === 'none'
      || style?.visibility === 'hidden'
      || style?.visibility === 'collapse') {
      return true;
    }

    if (typeof globalThis.getComputedStyle === 'function') {
      const computed = globalThis.getComputedStyle(current);
      if (computed.display === 'none'
        || computed.visibility === 'hidden'
        || computed.visibility === 'collapse') {
        return true;
      }
    }
    current = current.parentElement || current.parentNode;
  }
  return false;
}

/**
 * Builds the current operate response controls while leaving draft policy and
 * focus timing with the app and the surrounding instructional shell.
 */
export function createOperateResponse({
  scene,
  strings = STRINGS,
  inputPrefix,
  taskHelpId,
  taskHelpText = null,
  helpOpen = false,
  activeBeatRoot,
  controlsRoot,
  dispatchAction,
} = {}) {
  if (!scene) throw new TypeError('operate response scene is required');
  if (!inputPrefix) throw new TypeError('operate response input prefix is required');
  if (!activeBeatRoot || !controlsRoot) throw new TypeError('operate response roots are required');

  const elements = [];
  if (scene.meaning.takeaway && helpOpen && taskHelpText) {
    const help = document.createElement('p');
    help.id = taskHelpId;
    help.classList.add('active-beat-help');
    help.textContent = taskHelpText;
    elements.push(help);
  }

  const isTakeaway = Boolean(scene.meaning.takeaway);
  const commonDenominator = scene.meaning.quantities.left.currentForm.denominator;
  const usesFractionPair = isTakeaway
    || scene.meaning.unitRelationship.commonUnit?.kind === 'already-shared-unit';
  let kind;
  let controlElement;
  let controlRootSelector;

  if (usesFractionPair) {
    kind = 'fraction';
    const numeratorId = `${inputPrefix}-fraction-numerator-input`;
    const denominatorId = `${inputPrefix}-fraction-denominator-input`;
    controlRootSelector = '.control-fraction-response-wrapper';
    const recoveryProposal = scene.meaning.status.recovery?.classification?.proposed;
    const response = createFractionResponseInput({
      numeratorId,
      denominatorId,
      ...(isTakeaway ? {
        groupLabel: strings.subtraction.amountLeftGroup,
        numeratorLabel: strings.subtraction.numeratorLabel,
        denominatorLabel: strings.subtraction.denominatorLabel,
        numeratorAriaLabel: strings.subtraction.numeratorAriaLabel,
        denominatorAriaLabel: strings.subtraction.denominatorAriaLabel,
        allowZeroNumerator: true,
        initialNumerator: recoveryProposal?.numerator ?? '',
        initialDenominator: recoveryProposal?.denominator ?? '',
      } : {}),
      strings,
      onSubmit: (proposed) => dispatchAction({
        type: isTakeaway ? 'submit-subtraction-result' : 'submit-operation-result',
        proposed,
      }),
    });
    controlElement = response.element;
    elements.push(controlElement);
  } else {
    kind = 'single';
    const inputId = `${inputPrefix}-sum-input`;
    controlRootSelector = '.control-numeric-wrapper';
    const response = createNumericInput({
      id: inputId,
      label: strings.operate.inputLabel(commonDenominator),
      min: 1,
      max: 999,
      strings,
      onSubmit: (value) => dispatchAction({
        type: 'submit-operation-result',
        proposed: {
          kind: 'fraction',
          numerator: value,
          denominator: commonDenominator,
        },
      }),
    });
    controlElement = response.element;
    elements.push(controlElement);
  }

  const context = JSON.stringify({
    kind,
    isTakeaway,
    commonDenominator,
    schedulePosition: scene.meaning.task?.schedulePosition ?? null,
    scheduleEntryId: scene.meaning.task?.scheduleEntryId ?? null,
    promptId: scene.meaning.task?.promptId ?? null,
  });

  let active = true;

  function currentControls() {
    if (!active) return null;

    if (!controlElement.isConnected
      || !controlsRoot.isConnected
      || !activeBeatRoot.isConnected
      || !controlsRoot.contains(controlElement)
      || !activeBeatRoot.contains(controlsRoot)) {
      throw new Error('Mounted operate response controls are detached from their current renderer roots.');
    }

    const expectedRootClass = controlRootSelector.slice(1);
    if (!controlElement.classList?.contains(expectedRootClass)) {
      throw new Error(`Mounted operate response is missing required ${kind} control root.`);
    }

    let numerator;
    let denominator = null;
    if (kind === 'fraction') {
      numerator = controlElement.querySelector(`#${inputPrefix}-fraction-numerator-input`);
      denominator = controlElement.querySelector(`#${inputPrefix}-fraction-denominator-input`);
      if (!numerator || !denominator
        || !controlElement.contains(numerator)
        || !controlElement.contains(denominator)) {
        throw new Error('Mounted fraction response is missing its current numerator or denominator control.');
      }
    } else {
      numerator = controlElement.querySelector(`#${inputPrefix}-sum-input`);
      if (!numerator || !controlElement.contains(numerator)) {
        throw new Error('Mounted single response is missing its current numeric control.');
      }
    }

    if (!numerator.isConnected || (denominator && !denominator.isConnected)) {
      throw new Error('Mounted operate response input is disconnected from its current control root.');
    }

    if (isHiddenThroughAncestors(controlElement)
      || isHiddenThroughAncestors(numerator)
      || (denominator && isHiddenThroughAncestors(denominator))) {
      return null;
    }

    return { numerator, denominator };
  }

  const handle = {
    kind,
    primaryInput() {
      return currentControls()?.numerator ?? null;
    },
    readDraft() {
      const controls = currentControls();
      if (!controls) return null;
      return kind === 'fraction'
        ? { kind, context, numerator: controls.numerator.value, denominator: controls.denominator.value }
        : { kind, context, value: controls.numerator.value };
    },
    writeDraft(draft) {
      const controls = currentControls();
      if (!controls) return false;
      if (draft === null) {
        controls.numerator.value = '';
        if (controls.denominator) controls.denominator.value = '';
        return true;
      }
      if (!draft || draft.kind !== kind || draft.context !== context) return false;
      if (kind === 'fraction') {
        if (typeof draft.numerator !== 'string' || typeof draft.denominator !== 'string') return false;
        controls.numerator.value = draft.numerator;
        controls.denominator.value = draft.denominator;
      } else {
        if (typeof draft.value !== 'string') return false;
        controls.numerator.value = draft.value;
      }
      return true;
    },
    focusPrimary() {
      const input = currentControls()?.numerator;
      if (!input || typeof input.focus !== 'function') return false;
      input.focus();
      return document.activeElement === input;
    },
  };

  return {
    elements,
    handle,
    invalidate() {
      active = false;
    },
  };
}
