// Only these validated private associations receive the review presentation.
export function isPlan86ReviewInspect(scene) {
  const context = scene.derivation?.sourceContext?.instructional?.taskContext;
  return context?.practiceSetRevision === '1' && (
    (context.practiceSetId === 'plan86-addition-review' && context.stimulusId === 'plan86-add-inspect-7-3-twelfths')
    || (context.practiceSetId === 'plan86-subtraction-review' && context.stimulusId === 'plan86-subtract-inspect-5-3-tenths')
  );
}

export function showPlan86FixedDenominator(control, denominator, labelText) {
  control.element.classList.add('plan86-repair');
  const label = control.element.querySelector('label');
  label.textContent = labelText;
  const group = control.element.querySelector('.control-input-group');
  const input = group.querySelector('input');
  const fraction = document.createElement('span');
  fraction.className = 'plan86-repair-fraction';
  group.insertBefore(fraction, input);
  fraction.appendChild(input);
  const fixed = document.createElement('span');
  fixed.textContent = `/ ${denominator}`;
  fixed.setAttribute('aria-hidden', 'true');
  fraction.appendChild(fixed);
}
