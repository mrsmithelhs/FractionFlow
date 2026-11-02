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
  let gesture = null;
  const valid = node => !destroyed && active() && root?.isConnected && root.contains(node);
  const cancelGesture = () => {
    const current = gesture;
    gesture = null;
    preview = null;
    if (current) {
      current.token.classList.remove('is-dragging');
      current.token.style.cssText = current.originalStyle;
      current.placeholder?.remove();
      try { current.token.releasePointerCapture(current.pointerId); } catch { /* already released */ }
    }
    root?.querySelector('.plan53-highlight')?.classList.remove('plan53-highlight');
  };
  const onEscape = event => { if (event.key === 'Escape' && gesture) cancelGesture(); };
  window.addEventListener('resize', cancelGesture);
  window.addEventListener('scroll', cancelGesture, true);
  document.addEventListener('keydown', onEscape);
  const destroy = () => {
    cancelGesture();
    window.removeEventListener('resize', cancelGesture);
    window.removeEventListener('scroll', cancelGesture, true);
    document.removeEventListener('keydown', onEscape);
    destroyed = true; root?.remove(); root = null;
  };

  function render(scene) {
    cancelGesture();
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
      ? 'Drag End or tap the line.' : 'Choose an end position.'));
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
        const status = element('p', 'plan59-position sr-only', selected === null
          ? 'Endpoint not placed.' : `Endpoint at ${selected} over ${denominator}.`);
        status.id = `plan59-position-${view}`;
        section.append(status);
        const tray = element('div', selected === null ? 'plan59-tray' : 'plan59-tray plan59-tray-empty');
        tray.setAttribute('aria-label', 'End starting area');
        if (selected === null) tray.append(makeTile(false));
        else {
          tray.setAttribute('aria-hidden', 'true');
          const placeholder = element('span', 'plan59-drag-tile plan59-tray-placeholder', 'End');
          tray.append(placeholder);
        }
        section.append(tray);
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
        const marker = live ? makeTile(true) : element('span', 'plan59-marker', 'End');
        marker.style.left = `${selected / denominator * 100}%`;
        if (!live) {
          marker.setAttribute('role', 'img');
          marker.setAttribute('aria-label', `Endpoint at ${selected} over ${denominator}`);
        }
        frame.append(marker);
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
      function makeTile(positioned) {
        const token = element('span', positioned ? 'plan59-marker plan59-drag-tile' : 'plan59-drag-tile', 'End');
        token.setAttribute('role', 'img');
        token.setAttribute('aria-label', positioned ? 'End, placed' : 'End, unplaced');
        token.setAttribute('aria-describedby', `plan59-position-${view}`);
        token.addEventListener('pointerdown', event => {
          if (!valid(token) || gesture || !event.isPrimary || event.button !== 0) return;
          event.preventDefault();
          const box = token.getBoundingClientRect();
          gesture = { token, pointerId: event.pointerId, x: event.clientX, y: event.clientY,
            offsetX: event.clientX - (box.left + box.width / 2), offsetY: event.clientY - box.bottom,
            originalStyle: token.style.cssText, dragging: false };
          try { token.setPointerCapture(event.pointerId); } catch { cancelGesture(); }
        });
        return token;
      }
      const nearest = (x, y) => {
        const box = axis.getBoundingClientRect();
        if (x < box.left || x > box.right || Math.abs(y - (box.top + box.height / 2)) > 44) return null;
        return Math.max(0, Math.min(denominator, Math.round((x - box.left) / box.width * denominator)));
      };
      if (live) {
        axis.addEventListener('pointermove', event => {
          if (!valid(axis) || gesture) return;
          cancelGesture(); preview = nearest(event.clientX, event.clientY);
          if (preview !== null) axis.querySelector(`[data-candidate-id="step-${preview}"]`)?.classList.add('plan53-highlight');
        });
        axis.addEventListener('pointerleave', () => { if (!gesture) cancelGesture(); });
        axis.addEventListener('pointercancel', () => { if (!gesture) cancelGesture(); });
        axis.addEventListener('click', event => {
          if (valid(axis) && !gesture) {
            const index = nearest(event.clientX, event.clientY);
            cancelGesture(); if (index !== null) place(index);
          }
        });
        section.addEventListener('pointermove', event => {
          const current = gesture;
          if (!current || event.pointerId !== current.pointerId || !valid(current.token)) return;
          if (!current.dragging && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 6) return;
          if (!current.dragging && current.token.parentElement?.classList.contains('plan59-tray')) {
            const placeholder = current.token.cloneNode(true);
            placeholder.classList.add('plan59-tray-placeholder');
            placeholder.setAttribute('aria-hidden', 'true');
            placeholder.removeAttribute('role');
            placeholder.removeAttribute('aria-label');
            placeholder.removeAttribute('aria-describedby');
            current.token.before(placeholder);
            current.placeholder = placeholder;
          }
          current.dragging = true;
          const x = event.clientX - current.offsetX, y = event.clientY - current.offsetY;
          current.token.classList.add('is-dragging');
          current.token.style.left = `${x}px`; current.token.style.top = `${y}px`;
          preview = nearest(x, y);
          section.querySelector('.plan53-highlight')?.classList.remove('plan53-highlight');
          if (preview !== null) axis.querySelector(`[data-candidate-id="step-${preview}"]`)?.classList.add('plan53-highlight');
        });
        const finish = event => {
          const current = gesture;
          if (!current || event.pointerId !== current.pointerId) return;
          const index = current.dragging && event.type === 'pointerup'
            ? nearest(event.clientX - current.offsetX, event.clientY - current.offsetY) : null;
          const allowed = valid(current.token) && valid(axis);
          cancelGesture();
          if (allowed && index !== null) place(index);
        };
        section.addEventListener('pointerup', finish);
        section.addEventListener('pointercancel', finish);
        section.addEventListener('lostpointercapture', finish);
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
