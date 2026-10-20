import { STRINGS } from './strings.js';

/**
 * Discrete Interactive Controls (DECISION-010, DECISION-013, DECISION-021, DECISION-025)
 *
 * Provides keyboard-operable, touch-accessible controls for every learner decision.
 * Key constraints:
 * - DECISION-013: Direct tap/click and keyboard navigation are primary. Dragging is NEVER required.
 * - DECISION-010 & DECISION-021: Target sizes are minimum 24×24 CSS px (WCAG 2.2 SC 2.5.8),
 *   designed with 44×44 CSS px touch targets and generous margins.
 * - DECISION-025: Control size is strictly decoupled from denominator. A 30-part bar never
 *   creates small controls.
 * - Pure: Dispatches learner intent via onAction callback; never calculates truth or mutates state.
 */

export function createButton({
  label,
  ariaLabel = null,
  onClick,
  className = 'control-btn',
  disabled = false,
  type = 'button',
} = {}) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.classList.add('fraction-control', className);
  btn.textContent = label;
  if (ariaLabel) {
    btn.setAttribute('aria-label', ariaLabel);
  }
  btn.disabled = disabled;
  if (onClick) {
    btn.addEventListener('click', (event) => {
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (!btn.disabled) onClick(event);
    });
  }
  return btn;
}

export function createNumericInput({
  label,
  id,
  supportingText = null,
  supportingTextId = null,
  min = 1,
  max = 999,
  onSubmit,
  onEmptySubmit,
  buttonLabel = 'Submit',
  initialValue = '',
  strings = STRINGS,
} = {}) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('control-numeric-wrapper');

  const labelEl = document.createElement('label');
  labelEl.setAttribute('for', id);
  labelEl.classList.add('control-label');
  labelEl.textContent = label;
  wrapper.appendChild(labelEl);

  let supportingTextEl = null;
  if (typeof supportingText === 'string' && supportingText.length > 0) {
    supportingTextEl = document.createElement('p');
    supportingTextEl.id = supportingTextId || `${id}-supporting-text`;
    supportingTextEl.classList.add('control-supporting-text');
    supportingTextEl.textContent = supportingText;
    wrapper.appendChild(supportingTextEl);
  }

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('control-input-group');

  const inputEl = document.createElement('input');
  inputEl.type = 'number';
  inputEl.id = id;
  inputEl.setAttribute('id', id);
  inputEl.classList.add('fraction-control', 'control-numeric-input');
  inputEl.min = String(min);
  inputEl.max = String(max);
  inputEl.value = String(initialValue);
  inputEl.setAttribute('inputmode', 'numeric');
  if (supportingTextEl) inputEl.setAttribute('aria-describedby', supportingTextEl.id);
  inputGroup.appendChild(inputEl);

  const submitBtn = createButton({
    label: buttonLabel || strings.controls.check,
    className: 'control-submit-btn',
    onClick: () => {
      const val = inputEl.value.trim();
      if (val && onSubmit) {
        onSubmit(val);
      } else if (!val && onEmptySubmit) {
        onEmptySubmit();
      }
    },
  });
  inputGroup.appendChild(submitBtn);

  // Submit on Enter key
  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const val = inputEl.value.trim();
      if (val && onSubmit) {
        onSubmit(val);
      } else if (!val && onEmptySubmit) {
        onEmptySubmit();
      }
    }
  });

  wrapper.appendChild(inputGroup);
  return {
    element: wrapper,
    focus: () => inputEl.focus(),
    clear: () => { inputEl.value = ''; },
  };
}

/** One accessible response control for a numerator and denominator pair. */
export function createFractionResponseInput({
  numeratorId,
  denominatorId,
  strings = STRINGS,
  onSubmit,
  onEmptySubmit,
  initialNumerator = '',
  initialDenominator = '',
  groupLabel = null,
  numeratorLabel = null,
  denominatorLabel = null,
  numeratorAriaLabel = null,
  denominatorAriaLabel = null,
  allowZeroNumerator = false,
} = {}) {
  const wrapper = groupLabel ? document.createElement('fieldset') : document.createElement('div');
  wrapper.classList.add('control-fraction-response-wrapper');
  if (groupLabel) {
    wrapper.setAttribute('role', 'group');
    wrapper.setAttribute('aria-label', groupLabel);
    const legendEl = document.createElement('legend');
    legendEl.classList.add('control-legend', 'sr-only');
    legendEl.textContent = groupLabel;
    wrapper.appendChild(legendEl);
  }

  const fields = document.createElement('div');
  fields.classList.add('control-fraction-fields');

  const makeField = (id, label, minVal = '1', ariaLabel = null) => {
    const field = document.createElement('div');
    field.classList.add('control-fraction-field');
    const labelEl = document.createElement('label');
    labelEl.classList.add('control-label');
    labelEl.htmlFor = id;
    labelEl.textContent = label;
    field.appendChild(labelEl);

    const input = document.createElement('input');
    input.type = 'number';
    input.id = id;
    input.classList.add('fraction-control', 'control-numeric-input', 'control-fraction-input');
    input.min = minVal;
    input.max = '999';
    input.step = '1';
    input.inputMode = 'numeric';
    input.value = id === numeratorId ? initialNumerator : initialDenominator;
    if (ariaLabel) {
      input.setAttribute('aria-label', ariaLabel);
    }
    field.appendChild(input);
    return { field, input };
  };

  const numerator = makeField(
    numeratorId,
    numeratorLabel || strings.operate.numeratorLabel,
    allowZeroNumerator ? '0' : '1',
    numeratorAriaLabel,
  );
  const slash = document.createElement('span');
  slash.classList.add('control-fraction-slash');
  slash.setAttribute('aria-hidden', 'true');
  slash.textContent = '/';
  const denominator = makeField(
    denominatorId,
    denominatorLabel || strings.operate.denominatorLabel,
    '1',
    denominatorAriaLabel,
  );
  fields.appendChild(numerator.field);
  fields.appendChild(slash);
  fields.appendChild(denominator.field);

  const error = document.createElement('p');
  error.classList.add('control-supporting-text', 'control-fraction-error');
  error.setAttribute('role', 'alert');

  const submit = () => {
    const numeratorValue = numerator.input.value.trim();
    const denominatorValue = denominator.input.value.trim();
    const validNumerator = (value) => (allowZeroNumerator
      ? /^(0|[1-9][0-9]*)$/.test(value)
      : /^[1-9][0-9]*$/.test(value));
    const validDenominator = (value) => /^[1-9][0-9]*$/.test(value);
    if (!validNumerator(numeratorValue) || !validDenominator(denominatorValue)) {
      error.textContent = strings.operate.fractionRequired;
      if (onEmptySubmit) onEmptySubmit();
      return;
    }
    error.textContent = '';
    if (onSubmit) {
      onSubmit({ kind: 'fraction', numerator: numeratorValue, denominator: denominatorValue });
    }
  };

  const submitButton = createButton({
    label: strings.controls.check,
    className: 'control-submit-btn',
    onClick: submit,
  });
  for (const input of [numerator.input, denominator.input]) {
    input.addEventListener('input', () => { error.textContent = ''; });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submit();
      }
    });
  }

  wrapper.appendChild(fields);
  wrapper.appendChild(submitButton);
  wrapper.appendChild(error);
  return {
    element: wrapper,
    focus: () => numerator.input.focus(),
    clear: () => { numerator.input.value = ''; denominator.input.value = ''; },
  };
}

export function createChoiceGroup({
  legend,
  name,
  options = [], // [{ label, value, ariaLabel }]
  onSelect,
  renderOption = null,
} = {}) {
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('control-choice-fieldset');

  const legendEl = document.createElement('legend');
  legendEl.classList.add('control-legend', 'sr-only');
  legendEl.textContent = legend;
  fieldset.appendChild(legendEl);

  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('control-choice-options');

  for (const opt of options) {
    const onOptionClick = () => {
      if (onSelect) onSelect(opt.value);
    };
    const btn = typeof renderOption === 'function'
      ? renderOption(opt, onOptionClick)
      : createButton({
        label: opt.label,
        ariaLabel: opt.ariaLabel || null,
        className: 'control-choice-btn',
        onClick: onOptionClick,
      });
    optionsContainer.appendChild(btn);
  }

  fieldset.appendChild(optionsContainer);
  return fieldset;
}
