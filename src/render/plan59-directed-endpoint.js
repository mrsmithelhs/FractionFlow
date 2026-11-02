import { createSymbolicFraction } from './symbolic.js';

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

// The episode is the only response owner. This renderer keeps only a pointer preview.
export function createPlan59Renderer({ container, view, dispatch, progression, helpOpen, toggleHelp, active }) {
  let root = null;
  let destroyed = false;
  let preview = null;
  const valid = node => !destroyed && active() && root?.isConnected && root.contains(node);
  const cancelGesture = () => {
    preview = null;
    root?.querySelector('.plan53-highlight')?.classList.remove('plan53-highlight');
  };
  const onResize = () => cancelGesture();
  window.addEventListener('resize', onResize);
  const destroy = () => { cancelGesture(); window.removeEventListener('resize', onResize); destroyed = true; root?.remove(); root = null; };

  function render(scene) {
    const model = scene.meaning.endpoint;
    const live = model.status === 'active';
    const denominator = Number(model.start.denominator);
    const start = Number(model.start.numerator);
    const selected = model.placement === null ? null : Number(model.placement.slice(5));
    const focusKey = root?.contains(document.activeElement) ? document.activeElement.dataset.focusKey : null;
    const section = element('section', 'plan59-endpoint');
    section.setAttribute('aria-label', 'Find the endpoint on a number line');
    const intent = (type, fields = {}) => ({ type, context: model.context, ...fields });
    const place = index => dispatch(intent('place-directed-endpoint', { candidateId: `step-${index}` }));
    const button = (label, callback, key, primary = false) => {
      const node = element('button', primary ? 'control-btn plan53-primary' : 'app-secondary-button', label);
      node.type = 'button'; node.dataset.focusKey = key;
      node.addEventListener('click', () => { if (valid(node)) callback(); });
      return node;
    };
    const expression = element('p', 'plan59-expression');
    expression.append(createSymbolicFraction(model.start.numerator, model.start.denominator, { variant: 'compact' }),
      element('span', '', model.operation === 'add' ? '+' : '−'),
      createSymbolicFraction(model.amount.numerator, model.amount.denominator, { variant: 'compact' }));
    if (!live) expression.append(element('span', '', '='), createSymbolicFraction(model.verification.endpoint.numerator, model.verification.endpoint.denominator, { variant: 'compact' }));
    section.append(expression);
    if (live) section.append(element('h2', 'plan53-prompt', view === 'visual'
      ? 'Tap the line or use the position buttons.' : 'Choose an end position.'));
    const feedback = element('p', live ? 'plan53-feedback' : 'plan53-feedback plan50-success');
    feedback.tabIndex = -1; feedback.dataset.focusKey = 'feedback';
    if (model.evaluation.status === 'incomplete') feedback.textContent = 'Place the end first.';
    if (model.evaluation.status === 'incorrect') feedback.textContent = 'Check the direction and number of equal parts.';
    if (model.evaluation.status === 'accepted') feedback.textContent = "That's right.";
    if (live && feedback.textContent) {
      feedback.id = `plan59-guidance-${view}`;
      feedback.classList.add(model.evaluation.status === 'incorrect' ? 'house-retry' : 'house-attention');
    }
    if (view === 'visual') {
      if (live) {
        const status = element('p', 'plan59-position', selected === null
          ? 'Endpoint not placed.' : `Endpoint at ${selected} over ${denominator}.`);
        status.id = `plan59-position-${view}`;
        section.append(status);
      }
      const frame = element('div', 'plan53-frame plan59-frame');
      const axis = element('div', 'plan53-axis plan59-axis');
      axis.setAttribute('aria-label', 'Number line from zero to one');
      for (let i = 0; i <= denominator; i += 1) {
        const tick = element('span', 'plan53-mark'); tick.style.left = `${i / denominator * 100}%`; tick.dataset.candidateId = `step-${i}`;
        if (i === 0 || i === denominator) tick.append(element('span', 'plan53-benchmark', i === 0 ? '0' : '1'));
        axis.append(tick);
      }
      const fixedStart = element('span', 'plan59-start', 'Start');
      fixedStart.style.left = `${start / denominator * 100}%`;
      fixedStart.setAttribute('role', 'img');
      fixedStart.setAttribute('aria-label', `Supplied start ${model.start.numerator} over ${model.start.denominator}`);
      frame.append(axis, fixedStart);
      if (selected !== null) {
        const marker = element('span', 'plan59-marker', 'End'); marker.style.left = `${selected / denominator * 100}%`;
        marker.setAttribute('role', 'img');
        marker.setAttribute('aria-label', `Endpoint at ${selected} over ${denominator}`); frame.append(marker);
      }
      if (!live) {
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrow.classList.add('plan59-arrow'); arrow.setAttribute('aria-hidden', 'true');
        arrow.setAttribute('viewBox', '0 0 100 20'); arrow.setAttribute('preserveAspectRatio', 'none');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(start / denominator * 100)); line.setAttribute('x2', String(selected / denominator * 100));
        line.setAttribute('y1', '10'); line.setAttribute('y2', '10'); line.setAttribute('stroke', 'currentColor'); line.setAttribute('stroke-width', '2');
        const head = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const end = selected / denominator * 100; const back = end + (model.operation === 'add' ? -2 : 2);
        head.setAttribute('points', `${end},10 ${back},5 ${back},15`); head.setAttribute('fill', 'currentColor');
        arrow.append(line, head); frame.append(arrow);
      }
      const nearest = event => {
        const box = axis.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || Math.abs(event.clientY - (box.top + box.height / 2)) > 44) return null;
        return Math.max(0, Math.min(denominator, Math.round((event.clientX - box.left) / box.width * denominator)));
      };
      if (live) {
        axis.addEventListener('pointermove', event => {
          if (!valid(axis)) return;
          cancelGesture(); preview = nearest(event);
          if (preview !== null) axis.querySelector(`[data-candidate-id="step-${preview}"]`)?.classList.add('plan53-highlight');
        });
        axis.addEventListener('pointerleave', cancelGesture);
        axis.addEventListener('pointercancel', cancelGesture);
        axis.addEventListener('click', event => { if (valid(axis)) { const index = nearest(event); cancelGesture(); if (index !== null) place(index); } });
      }
      section.append(frame);
    } else {
      section.append(element('p', 'plan59-linear-cue', `Start at ${model.start.numerator} over ${model.start.denominator}. Exact position choices name each fraction.`));
      if (!live) {
        const { direction, amount, endpoint } = model.verification;
        section.append(element('p', 'plan59-linear-verification', `From the start, move ${direction} ${amount.numerator} over ${amount.denominator} to ${endpoint.numerator} over ${endpoint.denominator}.`));
      }
    }
    section.append(feedback);
    if (live) {
      const controls = element('div', 'plan53-controls');
      if (view === 'visual') {
        const left = button(selected === null ? 'Place at 0' : 'Move left', () => place(selected === null ? 0 : Math.max(0, selected - 1)), 'left');
        const right = button(selected === null ? 'Place at 1' : 'Move right', () => place(selected === null ? denominator : Math.min(denominator, selected + 1)), 'right');
        const description = [`plan59-position-${view}`, feedback.id].filter(Boolean).join(' ');
        left.setAttribute('aria-describedby', description);
        right.setAttribute('aria-describedby', description);
        controls.append(left, right);
      } else {
        const label = element('label', '', 'Choose a position '); const select = element('select'); select.dataset.focusKey = 'position';
        const empty = element('option', '', 'Choose a position'); empty.value = ''; select.append(empty);
        for (const candidate of model.candidates) { const option = element('option', '', `${candidate.form.numerator} over ${candidate.form.denominator}`); option.value = candidate.id; select.append(option); }
        select.value = model.placement || ''; if (feedback.id) select.setAttribute('aria-describedby', feedback.id);
        select.addEventListener('change', () => { if (valid(select) && select.value) place(Number(select.value.slice(5))); });
        label.append(select); controls.append(label);
      }
      const help = button(helpOpen() ? 'Close help' : 'Help', toggleHelp, 'help'); help.setAttribute('aria-expanded', String(helpOpen()));
      controls.append(help, button('Check', () => dispatch(intent('check-directed-endpoint', { revision: model.placementRevision })), 'check', true));
      section.append(controls);
      if (helpOpen()) section.append(element('p', 'plan53-help', model.operation === 'add' ? 'From the start, count equal parts to the right.' : 'From the start, count equal parts to the left.'));
    } else {
      const p = progression(); if (p?.notice) section.append(element('p', '', p.notice));
      if (p?.onAction) section.append(button(p.label, p.onAction, 'next', true));
    }
    if (root) root.replaceWith(section); else container.append(section);
    root = section;
    if (focusKey) root.querySelector(`[data-focus-key="${focusKey}"]`)?.focus();
  }
  return { mount: render, update: render, destroy, cancelGesture, focusFeedback: () => root?.querySelector('.plan53-feedback')?.focus() };
}
