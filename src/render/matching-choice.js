import { createButton } from './controls.js';

function formNumbers(form) {
  if (!form || form.kind !== 'fraction') {
    throw new TypeError('matching choice must provide a fraction form');
  }
  const numerator = Number(form.numerator);
  const denominator = Number(form.denominator);
  if (!Number.isSafeInteger(numerator)
    || !Number.isSafeInteger(denominator)
    || numerator < 0
    || denominator <= 0
    || numerator > denominator) {
    throw new TypeError('matching choice fraction form is outside the supported bar range');
  }
  return { numerator, denominator };
}

function createChoiceBar(form) {
  const { numerator, denominator } = formNumbers(form);
  const bar = document.createElement('span');
  bar.classList.add('matching-choice-bar');
  bar.setAttribute('aria-hidden', 'true');

  const track = document.createElement('span');
  track.classList.add('matching-choice-track');
  for (let index = 0; index < denominator; index += 1) {
    const segment = document.createElement('span');
    segment.classList.add('matching-choice-segment');
    segment.classList.add(index < numerator ? 'shaded' : 'unshaded');
    track.appendChild(segment);
  }
  bar.appendChild(track);
  return bar;
}

/**
 * Renders one content-supplied matching form as a display-only bar inside a
 * native button. It does not derive choices, classify correctness, or compute
 * an alternative form.
 */
export function createVisualMatchingChoice({ choice, ariaLabel, onClick }) {
  const button = createButton({
    label: '',
    ariaLabel,
    className: 'matching-choice-btn',
    onClick,
  });
  button.classList.add('control-choice-btn');
  button.appendChild(createChoiceBar(choice.form));
  return button;
}
