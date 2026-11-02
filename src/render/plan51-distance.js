import { createSymbolicFraction } from './symbolic.js';

const append = (parent, ...children) => children.forEach(child => parent.appendChild(child));
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

// Callbacks are scoped to the current episode, stage and render by the app.
export function renderPlan51Distance(container, scene, options) {
  const d = scene.meaning.distance;
  const root = el('section', 'plan51-distance');
  const expression = el('div', 'plan45-expression');
  append(expression, createSymbolicFraction(d.sourceForms.first.numerator, d.sourceForms.first.denominator, { ariaPrefix: 'First amount' }));
  if (d.acceptedRelation) {
    const relation = el('span', 'plan45-expression-relation', d.acceptedRelation);
    relation.setAttribute('aria-label', d.acceptedRelation === '<' ? 'is less than' : 'is greater than');
    append(expression, relation);
  }
  append(expression, createSymbolicFraction(d.sourceForms.second.numerator, d.sourceForms.second.denominator, { ariaPrefix: 'Second amount' }));
  append(root, expression);

  const button = (label, action, className = 'app-secondary-button') => {
    const control = el('button', className, label);
    control.type = 'button';
    if (action) control.addEventListener('click', () => options.action(action));
    return control;
  };
  const model = (side, range = null) => {
    const form = d.sourceForms[side];
    const figure = el('figure', 'plan45-model');
    append(figure, el('figcaption', 'plan45-model-caption', `${side === 'first' ? 'First' : 'Second'} amount`));
    if (options.view === 'linear') {
      append(figure, el('p', '', `One whole has ${form.denominator} equal parts; ${form.numerator} parts are shown.`));
    } else {
      const track = el('div', 'plan45-model-track');
      track.setAttribute('aria-label', `One whole has ${form.denominator} equal parts; ${form.numerator} parts are shown.`);
      for (let i = 0; i < Number(form.denominator); i += 1) {
        const cell = el('span', `plan45-model-part${i < Number(form.numerator) ? ' is-shaded' : ''}${range && i >= range.start && i < range.end ? ' plan51-between' : ''}`);
        append(track, cell);
      }
      append(figure, track);
    }
    return figure;
  };
  if (d.stage === 'resolve') {
    const result = el('p', 'plan51-result', 'Distance: ');
    append(result, createSymbolicFraction(d.acceptedDistance.numerator, d.acceptedDistance.denominator));
    append(root, result, el('p', '', `The distance is ${d.distanceRange.count} of the ${d.distanceRange.denominator} equal parts, from part ${d.distanceRange.start} to part ${d.distanceRange.end}.`));
    const pair = el('div', 'plan45-model-pair');
    append(pair, model('first', d.distanceRange), model('second', d.distanceRange));
    append(root, pair);
    const progression = options.progression();
    if (progression?.notice) append(root, el('p', '', progression.notice));
    if (progression?.onAction) {
      const next = button(progression.label, null, 'plan51-next');
      next.addEventListener('click', progression.onAction);
      append(root, next);
    }
    container.replaceChildren(root);
    return;
  }

  append(root, el('h1', 'plan45-prompt', d.stage === 'compare' ? 'Compare these amounts.' : 'How far apart are these amounts?'));
  if (d.stage === 'distance' && d.distanceCue && d.support.label === 'high support') {
    append(root, el('p', 'plan45-strategy-cue', 'Use the greater amount minus the smaller amount. The parts have the same size.'));
  }
  if (d.stage === 'compare' && d.modelChoice) append(root, model(d.modelChoice));
  if (d.feedback || options.refusal) {
    const feedback = el('p', 'plan45-recovery', options.refusal || (d.stage === 'compare' ? 'Not quite. Try comparing the amounts again.' : 'Not quite. Check the size and number of parts between the amounts.'));
    feedback.id = `plan51-feedback-${options.view}`;
    feedback.setAttribute('role', 'status');
    append(root, feedback);
  }
  const form = el('form', 'plan51-response');
  if (d.feedback || options.refusal) form.setAttribute('aria-describedby', `plan51-feedback-${options.view}`);
  if (d.stage === 'compare') {
    const group = el('fieldset', 'plan45-relation-group');
    append(group, el('legend', 'sr-only', 'Choose a relation'));
    const choices = el('div', 'plan45-relation-options');
    for (const [glyph, label] of [['<', 'is less than'], ['=', 'is equal to'], ['>', 'is greater than']]) {
      const option = el('label', 'plan45-relation-option');
      const input = el('input'); input.type = 'radio'; input.name = `plan51-relation-${options.view}`; input.value = glyph;
      input.checked = options.draft.relation === glyph;
      input.addEventListener('change', () => options.setDraft('relation', glyph));
      append(option, input, el('span', 'plan45-relation-glyph', glyph), el('span', 'plan45-relation-label', label));
      append(choices, option);
    }
    append(group, choices); append(form, group);
  } else {
    for (const [key, label] of [['numerator', 'Numerator'], ['denominator', 'Denominator']]) {
      const wrap = el('label', 'plan51-field', label);
      const input = el('input'); input.type = 'text'; input.inputMode = 'numeric'; input.value = options.draft[key];
      input.setAttribute('data-plan51-focus', key);
      input.addEventListener('focus', () => options.setFocus(key));
      input.addEventListener('input', () => options.setDraft(key, input.value));
      append(wrap, input); append(form, wrap);
    }
  }
  const check = el('button', 'app-primary-button', 'Check'); check.type = 'submit'; append(form, check);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (d.stage === 'compare') options.action({ type: 'submit-distance-comparison', proposed: options.draft.relation });
    else options.action({ type: 'submit-distance-fraction', numerator: options.draft.numerator, denominator: options.draft.denominator });
  });
  append(root, form);
  const details = el('details', 'plan45-help'); details.open = options.helpOpen;
  const summary = el('summary', 'plan45-help-summary', 'Help');
  append(details, summary);
  details.addEventListener('toggle', () => options.setHelpOpen(details.open));
  if (d.stage === 'compare') {
    if (d.comparisonHelp) append(details, el('p', '', d.comparisonHelp === 'notation' ? 'The open side faces the greater amount.' : 'Compare same-size parts.'));
    append(details, button('Comparison tip', { type: 'request-distance-comparison-help', helpKind: 'reasoning' }), button('Symbol tip', { type: 'request-distance-comparison-help', helpKind: 'notation' }));
    if (!d.modelChoice) append(details, button('Show first amount', { type: 'request-distance-comparison-model', side: 'first' }), button('Show second amount', { type: 'request-distance-comparison-model', side: 'second' }));
  } else {
    if (d.distanceCue && d.support.label !== 'high support') append(details, el('p', '', 'Use the greater amount minus the smaller amount. The parts have the same size.'));
    else if (!d.distanceCue) append(details, button('Show a tip', { type: 'request-distance-help', helpKind: 'cue' }));
    if (!d.pairedAmounts) append(details, button('Show both amounts', { type: 'request-distance-help', helpKind: 'both-amounts' }));
    else { const pair = el('div', 'plan45-model-pair'); append(pair, model('first'), model('second')); append(details, pair); }
  }
  append(root, details);
  container.replaceChildren(root);
}
