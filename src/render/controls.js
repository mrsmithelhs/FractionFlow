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
  min = 1,
  max = 999,
  onSubmit,
  buttonLabel = 'Submit',
  strings = STRINGS,
} = {}) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('control-numeric-wrapper');

  const labelEl = document.createElement('label');
  labelEl.setAttribute('for', id);
  labelEl.classList.add('control-label');
  labelEl.textContent = label;
  wrapper.appendChild(labelEl);

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('control-input-group');

  const inputEl = document.createElement('input');
  inputEl.type = 'number';
  inputEl.id = id;
  inputEl.setAttribute('id', id);
  inputEl.classList.add('fraction-control', 'control-numeric-input');
  inputEl.min = String(min);
  inputEl.max = String(max);
  inputEl.setAttribute('inputmode', 'numeric');
  inputGroup.appendChild(inputEl);

  const submitBtn = createButton({
    label: buttonLabel || strings.controls.check,
    className: 'control-submit-btn',
    onClick: () => {
      const val = inputEl.value.trim();
      if (val && onSubmit) {
        onSubmit(val);
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

export function createChoiceGroup({
  legend,
  name,
  options = [], // [{ label, value, ariaLabel }]
  onSelect,
} = {}) {
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('control-choice-fieldset');

  const legendEl = document.createElement('legend');
  legendEl.classList.add('control-legend');
  legendEl.textContent = legend;
  fieldset.appendChild(legendEl);

  const optionsContainer = document.createElement('div');
  optionsContainer.classList.add('control-choice-options');

  for (const opt of options) {
    const btn = createButton({
      label: opt.label,
      ariaLabel: opt.ariaLabel || null,
      className: 'control-choice-btn',
      onClick: () => {
        if (onSelect) onSelect(opt.value);
      },
    });
    optionsContainer.appendChild(btn);
  }

  fieldset.appendChild(optionsContainer);
  return fieldset;
}
