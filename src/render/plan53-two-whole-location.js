import { createSymbolicFraction } from './symbolic.js';

const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export function createPlan53Renderer({ container, view, dispatch, progression, helpOpen, toggleHelp, active }) {
  let root = null;
  let gesture = null;
  let destroyed = false;
  let scene;
  const valid = node => !destroyed && active() && root?.isConnected && root.contains(node);
  const cancelGesture = () => {
    if (!gesture) return;
    const previous = gesture;
    gesture = null;
    try { previous.token.releasePointerCapture(previous.pointerId); } catch { /* already released */ }
    previous.token.classList.remove('is-dragging');
    root?.querySelector('.plan53-highlight')?.classList.remove('plan53-highlight');
  };
  const onResize = () => {
    if (!gesture) return;
    cancelGesture();
    if (active()) dispatch(null);
  };
  window.addEventListener('resize', onResize);
  const destroy = () => {
    cancelGesture();
    window.removeEventListener('resize', onResize);
    destroyed = true; root?.remove(); root = null;
  };
  function render(next) {
    if (gesture) return;
    scene = next;
    const model = scene.meaning.location;
    const focusKey = root?.contains(document.activeElement) ? document.activeElement.dataset.focusKey : null;
    const section = element('section', 'plan53-location');
    section.setAttribute('aria-label', 'Place a fraction on a number line from zero to two');
    const live = model.status === 'active';
    const intent = (type, fields = {}) => ({ type, context: model.context, ...fields });
    const button = (label, action, key, primary = false) => {
      const node = element('button', primary ? 'control-btn' : 'app-secondary-button', label);
      node.type = 'button';
      node.dataset.focusKey = key;
      if (primary) node.classList.add('plan53-primary');
      node.addEventListener('click', () => { if (valid(node)) action(); });
      return node;
    };
    const fraction = () => createSymbolicFraction(model.sourceForm.numerator, model.sourceForm.denominator, { variant: 'compact' });
    const feedback = element('p', live ? 'plan53-feedback' : 'plan53-feedback plan50-success');
    feedback.tabIndex = -1; feedback.dataset.focusKey = 'feedback';
    if (model.evaluation.status === 'incomplete') feedback.textContent = 'Choose a position first.';
    if (model.evaluation.status === 'incorrect') feedback.textContent = 'Check this placement and try again.';
    if (model.evaluation.status === 'accepted') feedback.textContent = "That's right.";
    if (live && feedback.textContent) feedback.id = `plan53-guidance-${view}`;
    if (live && feedback.textContent) feedback.classList.add(model.evaluation.status === 'incorrect' ? 'house-retry' : 'house-attention');
    if (live) section.append(element('h2', 'plan53-prompt', 'Place this fraction on the number line.'));
    else section.append(feedback);
    const denominator = Number(model.sourceForm.denominator);
    const last = denominator * 2;
    const selected = model.placement === null ? null : Number(model.placement.slice(5));
    const place = index => dispatch(intent('place-two-whole', { candidateId: `step-${index}` }));
    if (live && view === 'visual') {
      const positionStatus = element('p', 'plan53-position-status', selected === null
        ? 'Fraction unplaced.'
        : `Selected position: ${selected} over ${denominator}${selected === 0 ? ', zero' : selected === denominator ? ', one' : selected === last ? ', two' : ''}.`);
      positionStatus.setAttribute('role', 'status');
      section.append(positionStatus);
    }
    if (view === 'visual') {
      if (live) {
        const tray = element('div', model.placement === null ? 'plan53-tray' : 'plan53-tray plan53-tray-empty');
        if (model.placement === null) {
          tray.setAttribute('aria-label', 'Unplaced fraction');
          tray.append(makeToken());
        } else tray.setAttribute('aria-hidden', 'true');
        section.append(tray);
      }
      const frame = element('div', 'plan53-frame');
      const axis = element('div', 'plan53-axis');
      axis.setAttribute('aria-label', 'Number line from zero to two');
      for (let i = 0; i <= last; i += 1) {
        const mark = element('span', 'plan53-mark'); mark.dataset.candidateId = `step-${i}`;
        mark.style.left = `${i / last * 100}%`;
        if (i % denominator === 0) { const label = element('span', 'plan53-benchmark', String(i / denominator)); mark.append(label); }
        axis.append(mark);
      }
      const nearest = (x, y) => {
        const box = axis.getBoundingClientRect();
        if (x < box.left || x > box.right || Math.abs(y - (box.top + box.height / 2)) > 44) return null;
        return Math.max(0, Math.min(last, Math.round((x - box.left) / box.width * last)));
      };
      axis.addEventListener('click', event => { if (live && valid(axis)) { const index = nearest(event.clientX, event.clientY); if (index !== null) place(index); } });
      frame.append(axis);
      if (selected !== null) {
        const token = makeToken(); token.classList.add('plan53-positioned'); token.style.left = `${selected / last * 100}%`;
        frame.append(token);
      }
      section.append(frame);
      function makeToken() {
        const token = element(live ? 'button' : 'span', 'plan53-token');
        if (live) { token.type = 'button'; if (feedback.id) token.setAttribute('aria-describedby', feedback.id); token.setAttribute('aria-label', `${model.sourceForm.numerator} over ${model.sourceForm.denominator}, ${selected === null ? 'unplaced' : 'placed'}`); }
        token.append(fraction());
        if (live) token.addEventListener('pointerdown', event => {
          if (!valid(token) || !event.isPrimary || event.button !== 0) return;
          event.preventDefault();
          const box = token.getBoundingClientRect();
          gesture = { token, pointerId: event.pointerId, x: event.clientX, y: event.clientY, offsetX: event.clientX - (box.left + box.width / 2), offsetY: event.clientY - box.bottom, dragging: false };
          try { token.setPointerCapture(event.pointerId); } catch { gesture = null; }
        });
        return token;
      }
      section.addEventListener('pointermove', event => {
        const g = gesture; if (!g || event.pointerId !== g.pointerId) return;
        if (!g.dragging && Math.hypot(event.clientX - g.x, event.clientY - g.y) < 6) return;
        g.dragging = true; g.token.classList.add('is-dragging');
        g.token.style.left = `${event.clientX - g.offsetX}px`; g.token.style.top = `${event.clientY - g.offsetY}px`;
        const index = nearest(event.clientX - g.offsetX, event.clientY - g.offsetY);
        section.querySelector('.plan53-highlight')?.classList.remove('plan53-highlight');
        if (index !== null) axis.querySelector(`[data-candidate-id="step-${index}"]`)?.classList.add('plan53-highlight');
      });
      const finish = event => {
        const g = gesture; if (!g || event.pointerId !== g.pointerId) return;
        const index = g.dragging && event.type === 'pointerup' ? nearest(event.clientX - g.offsetX, event.clientY - g.offsetY) : null;
        cancelGesture();
        if (index !== null && valid(axis)) place(index); else if (active()) dispatch(null);
      };
      section.addEventListener('pointerup', finish); section.addEventListener('pointercancel', finish); section.addEventListener('lostpointercapture', finish);
      if (!live) {
        const bars = element('div', 'plan53-bars'); bars.setAttribute('aria-label', 'Equal whole bars');
        const whole = Number(model.verification.whole), remainder = Number(model.verification.remainder.numerator);
        const count = Math.max(1, whole + (remainder > 0 ? 1 : 0));
        for (let row = 0; row < count; row += 1) {
          const bar = element('div', 'plan53-bar');
          const filled = row < whole ? denominator : remainder;
          for (let part = 0; part < denominator; part += 1) bar.append(element('span', `plan53-part${part < filled ? ' is-shaded' : ''}`));
          bars.append(bar);
        }
        section.append(bars);
        const info = element('p', 'plan53-information', `${whole} ${whole === 1 ? 'whole' : 'wholes'}${remainder ? ` and ${remainder} of ${denominator} equal parts` : ''}.`);
        section.append(info);
      }
    } else {
      const source = element('p', 'plan53-linear-source', 'Fraction: '); source.append(fraction()); section.append(source);
    }
    if (live) {
      section.append(feedback);
      const controls = element('div', 'plan53-controls');
      if (view === 'visual') {
        const left = button(selected === null ? 'Place at rightmost point' : 'Move left', () => place(selected === null ? last : Math.max(0, selected - 1)), 'left');
        const right = button(selected === null ? 'Place at leftmost point' : 'Move right', () => place(selected === null ? 0 : Math.min(last, selected + 1)), 'right');
        if (feedback.id) {
          left.setAttribute('aria-describedby', feedback.id);
          right.setAttribute('aria-describedby', feedback.id);
        }
        controls.append(left, right);
      } else {
        const label = element('label', '', 'Choose a position '); const select = element('select'); select.dataset.focusKey = 'position';
        const empty = element('option', '', 'Choose a position'); empty.value = ''; select.append(empty);
        for (const c of model.candidates) { const option = element('option', '', `${c.form.numerator} over ${c.form.denominator}`); option.value = c.id; select.append(option); }
        select.value = model.placement || '';
        if (feedback.id) select.setAttribute('aria-describedby', feedback.id);
        select.addEventListener('change', () => { if (valid(select) && select.value) dispatch(intent('place-two-whole', { candidateId: select.value })); });
        label.append(select); controls.append(label);
      }
      const help = button(helpOpen() ? 'Close help' : 'Help', toggleHelp, 'help'); help.setAttribute('aria-expanded', String(helpOpen())); controls.append(help);
      controls.append(button('Check', () => dispatch(intent('check-two-whole', { revision: model.placementRevision })), 'check', true));
      section.append(controls);
      if (helpOpen()) section.append(element('p', 'plan53-help', 'Each whole is divided into equal parts. Find the two whole intervals.'));
    } else {
      if (view === 'linear') {
        const whole = Number(model.verification.whole);
        const remainder = Number(model.verification.remainder.numerator);
        section.append(element('p', 'plan53-information', `${whole} ${whole === 1 ? 'whole' : 'wholes'}${remainder ? ` and ${remainder} of ${model.verification.remainder.denominator} equal parts` : ''}.`));
      }
      const p = progression(); if (p?.notice) section.append(element('p', '', p.notice));
      if (p?.onAction) section.append(button(p.label, p.onAction, 'next', true));
    }
    if (root) root.replaceWith(section); else container.append(section);
    root = section;
    if (focusKey) root.querySelector(`[data-focus-key="${focusKey}"]`)?.focus();
  }
  return { mount: render, update: render, destroy, cancelGesture, focusFeedback: () => root?.querySelector('.plan53-feedback')?.focus() };
}
