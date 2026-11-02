import { createMixedNumeral, createSymbolicFraction } from './symbolic.js';

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export function createPlan58Renderer({ container, view, dispatch, progression, helpOpen, toggleHelp, active }) {
  let root, model, destroyed = false;
  const composing = new Set();
  const inputs = {};
  const valid = node => !destroyed && active() && root?.isConnected && root.contains(node);
  const intent = (type, fields = {}) => ({ type, context: model.context, ...fields });
  function commit(input, field) {
    if (!valid(input)) return false;
    if (input.value.length > 32) {
      input.value = model.draft[field];
      input.setSelectionRange(input.value.length, input.value.length);
      const guidance = root.querySelector('.plan58-feedback');
      guidance.textContent = 'Use at most 32 characters.';
      guidance.className = 'plan58-feedback house-attention';
      return false;
    }
    dispatch(intent('edit-whole-plus-fraction', { field, raw: input.value }));
    return true;
  }
  function flushComposition() {
    for (const field of [...composing]) {
      composing.delete(field);
      if (!commit(inputs[field], field)) return false;
    }
    return true;
  }
  function mount(scene) {
    model = scene.meaning.construction;
    root = element('section', 'plan58-construction');
    root.setAttribute('aria-label', 'Make wholes and remaining pieces');
    const prompt = element('h2', 'plan58-prompt');
    const controls = element('div', 'plan58-controls');
    for (const field of ['whole', 'pieces']) {
      const label = element('label', 'plan58-label');
      const caption = element('span');
      const input = element('input');
      input.type = 'text'; input.inputMode = 'numeric'; input.autocomplete = 'off';
      input.dataset.field = field;
      input.setAttribute('aria-describedby', `plan58-guidance-${view}`);
      input.addEventListener('compositionstart', () => composing.add(field));
      input.addEventListener('compositionend', () => { if (composing.delete(field)) commit(input, field); });
      input.addEventListener('input', event => { if (!composing.has(field) && !event.isComposing) commit(input, field); });
      label.append(caption, input); controls.append(label); inputs[field] = input;
    }
    const draft = element('div', 'plan58-draft');
    const feedback = element('p', 'plan58-feedback'); feedback.id = `plan58-guidance-${view}`; feedback.tabIndex = -1;
    const actions = element('div', 'plan58-actions');
    const help = element('button', 'app-secondary-button', 'Help'); help.type = 'button';
    help.addEventListener('click', () => { if (valid(help) && flushComposition()) toggleHelp(); });
    const check = element('button', 'control-btn', 'Check'); check.type = 'button';
    check.addEventListener('click', () => { if (valid(check) && flushComposition()) dispatch(intent('check-whole-plus-fraction', { revision: model.draftRevision })); });
    actions.append(help, check);
    const helpRegion = element('div', 'plan58-help');
    const result = element('div', 'plan58-result');
    root.append(prompt, controls, draft, feedback, actions, helpRegion, result); container.append(root);
    update(scene);
  }
  function update(scene) {
    model = scene.meaning.construction;
    const live = model.status === 'active';
    const d = Number(model.sourceForm.denominator), unit = model.unit;
    const prompt = root.querySelector('.plan58-prompt'); prompt.replaceChildren();
    if (live) prompt.append('Show ', createSymbolicFraction(model.sourceForm.numerator, model.sourceForm.denominator, { variant: 'compact' }), ` as wholes and ${unit}.`);
    else { prompt.hidden = false; prompt.append('Source: ', createSymbolicFraction(model.sourceForm.numerator, model.sourceForm.denominator, { variant: 'compact' })); }
    for (const field of ['whole', 'pieces']) {
      const input = inputs[field];
      input.previousSibling.textContent = field === 'whole' ? 'Whole units' : `Remaining ${unit}`;
      if (!composing.has(field) && input.value !== model.draft[field]) input.value = model.draft[field];
      input.disabled = !live;
    }
    const draft = root.querySelector('.plan58-draft'); draft.replaceChildren();
    for (const field of ['whole', 'pieces']) {
      const region = model.regions[field], title = field === 'whole' ? 'Whole units' : `Remaining ${unit}`;
      const block = element('div', 'plan58-region');
      const summary = region.status === 'valid' ? String(region.value) : region.status === 'missing' ? 'not entered' : 'needs correction';
      block.append(element('p', 'plan58-summary', `${title}: ${summary}`));
      if (view === 'visual' && region.status === 'valid') {
        const bars = element('div', 'plan58-bars'); bars.setAttribute('aria-hidden', 'true');
        for (const filled of region.rows) {
          const bar = element('div', 'plan58-bar');
          for (let part = 0; part < d; part += 1) bar.append(element('span', `plan58-part${part < filled ? ' is-shaded' : ''}`));
          bars.append(bar);
        }
        block.append(bars);
      }
      draft.append(block);
    }
    const feedback = root.querySelector('.plan58-feedback'); feedback.replaceChildren();
    feedback.className = 'plan58-feedback';
    const status = model.evaluation.status;
    if (status === 'incorrect') { feedback.textContent = 'Check the amount and try again.'; feedback.classList.add('house-retry'); }
    if (status === 'organize') { feedback.append('That is ', createSymbolicFraction(model.sourceForm.numerator, model.sourceForm.denominator, { variant: 'compact' }), `. Can you make a whole from the ${unit}?`); feedback.classList.add('house-attention'); }
    if (status === 'input') {
      const messages = [];
      for (const field of ['whole', 'pieces']) {
        const error = model.evaluation.fields[field].status, label = field === 'whole' ? 'whole units' : `remaining ${unit}`;
        if (error === 'missing') messages.push(`Enter ${label}.`);
        if (error === 'malformed') messages.push(`Use whole-number digits for ${label}.`);
        if (error === 'out-of-range') messages.push(`Enter ${label} from 0 to ${field === 'whole' ? 2 : model.pieceLimit}.`);
      }
      feedback.textContent = messages.join(' '); feedback.classList.add('house-attention');
    }
    if (!live) { feedback.textContent = "That's right."; feedback.classList.add('plan50-success'); }
    root.querySelector('.plan58-actions').hidden = !live;
    const help = root.querySelector('.plan58-actions button'); help.textContent = helpOpen() ? 'Close help' : 'Help'; help.setAttribute('aria-expanded', String(helpOpen()));
    const helpRegion = root.querySelector('.plan58-help'); helpRegion.replaceChildren();
    if (live && helpOpen()) {
      helpRegion.append(element('p', '', `How many ${unit} make one whole?`));
      const bar = element('div', 'plan58-bar'); bar.setAttribute('aria-label', `One whole divided into ${d} equal parts`);
      for (let i = 0; i < d; i += 1) bar.append(element('span', 'plan58-part'));
      helpRegion.append(bar);
    }
    const result = root.querySelector('.plan58-result'); result.replaceChildren();
    if (!live) {
      result.append(createMixedNumeral(model.notation));
      const p = progression();
      if (p?.notice) result.append(element('p', '', p.notice));
      if (p?.onAction) { const next = element('button', 'control-btn', p.label); next.type = 'button'; next.addEventListener('click', () => { if (valid(next)) p.onAction(); }); result.append(next); }
    }
  }
  return { mount, update, flushComposition, focusFeedback: () => root?.querySelector('.plan58-feedback')?.focus(), destroy: () => { destroyed = true; root?.remove(); root = null; } };
}
