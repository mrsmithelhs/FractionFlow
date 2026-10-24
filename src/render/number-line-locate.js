import { assertValidScene } from './contract.js';
import { createButton } from './controls.js';
import { createSymbolicFraction } from './symbolic.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgElement(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
}

function replaceNode(parent, current, next) {
  if (typeof parent.replaceChild === 'function') parent.replaceChild(next, current);
  else {
    parent.appendChild(next);
    parent.removeChild(current);
  }
}

function previewKey(scene) {
  const task = scene.derivation.sourceContext.instructional.taskContext;
  const numberLine = scene.meaning.numberLine;
  return JSON.stringify({
    itemId: task.itemId,
    definitionRevision: task.definitionRevision,
    candidateSet: numberLine.candidatePositions.map(({ id, form }) => [id, form]),
    supportMode: numberLine.densityMode,
    scheduleEntryId: scene.meaning.currentTask.scheduleEntryId,
  });
}

function ratio(form) {
  return Number(form.numerator) / Number(form.denominator);
}

function isRepair02(scene) {
  return scene.meaning.currentTask?.definitionRevision === '2';
}

function makeRepairToken(scene, strings) {
  const form = scene.meaning.quantities.source.sourceForm;
  const token = document.createElement('figure');
  token.className = 'plan39-source-figure plan39-repair-token';
  token.setAttribute('role', 'img');
  token.setAttribute('aria-label', strings.plan39Repair02.tokenNotPlaced(form.numerator, form.denominator));
  token.setAttribute('data-plan39-source-token', 'true');
  const fraction = createSymbolicFraction(form.numerator, form.denominator, { ariaHidden: true, variant: 'compact' });
  fraction.classList.add('plan39-source-fraction');
  const tray = document.createElement('div');
  tray.className = 'plan39-token-tray';
  const cue = document.createElement('span');
  cue.className = 'plan39-grab-cue';
  cue.setAttribute('aria-hidden', 'true');
  cue.textContent = '☝';
  token.appendChild(cue);
  token.appendChild(fraction);
  tray.appendChild(token);
  return tray;
}

function makeRepairResolution(scene, strings) {
  const result = document.createElement('p');
  result.className = 'plan39-resolution-description';
  result.textContent = scene.meaning.numberLine.acceptedLocationDescription;
  return result;
}

function makeRepairAcceptedSource(scene) {
  const form = scene.meaning.quantities.source.sourceForm;
  const figure = document.createElement('figure');
  figure.className = 'plan39-source-figure';
  const fraction = createSymbolicFraction(form.numerator, form.denominator, { variant: 'compact' });
  fraction.classList.add('plan39-source-fraction');
  figure.appendChild(fraction);
  return figure;
}

function makeBar(scene, strings, view) {
  const form = scene.meaning.quantities.source.sourceForm;
  const numerator = Number(form.numerator);
  const denominator = Number(form.denominator);
  const figure = document.createElement('figure');
  figure.className = 'plan39-source-figure';
  const fraction = createSymbolicFraction(form.numerator, form.denominator, { variant: 'compact' });
  fraction.classList.add('plan39-source-fraction');
  figure.appendChild(fraction);

  if (view === 'linear') {
    const description = document.createElement('p');
    description.className = 'plan39-linear-source-description';
    description.textContent = strings.plan39.sourceBarDescription(numerator, denominator);
    figure.appendChild(description);
    return figure;
  }

  const visual = document.createElement('div');
  visual.className = 'plan39-bar-visual';
  visual.setAttribute('role', 'img');
  visual.setAttribute('aria-label', strings.plan39.sourceBarDescription(numerator, denominator));
  const frame = document.createElement('div');
  frame.className = 'plan39-unit-frame plan39-bar-track';
  frame.style.setProperty('--partition-count', denominator);
  for (let index = 0; index < denominator; index += 1) {
    const segment = document.createElement('span');
    segment.className = index < numerator ? 'plan39-bar-part plan39-bar-part-shaded' : 'plan39-bar-part';
    frame.appendChild(segment);
  }
  visual.appendChild(frame);
  figure.appendChild(visual);
  return figure;
}

function makeTrack(scene, strings, selectedCandidateId, view) {
  const model = scene.meaning.numberLine;
  const repair02 = isRepair02(scene);
  const figure = document.createElement('figure');
  figure.className = 'plan39-track-figure';
  if (view === 'linear') {
    const description = document.createElement('p');
    description.className = 'plan39-track-description';
    description.textContent = repair02 ? model.scaleDescription : strings.plan39.trackDescription;
    figure.appendChild(description);
    return figure;
  }

  const frame = document.createElement('div');
  frame.className = 'plan39-unit-frame plan39-axis-frame';
  frame.setAttribute('role', repair02 ? 'group' : 'img');
  frame.setAttribute('aria-label', repair02 ? `${strings.plan39Repair02.trackTapLabel}. ${model.scaleDescription}` : strings.plan39.trackDescription);
  if (repair02) frame.setAttribute('data-plan39-track-hit-band', 'true');
  const line = document.createElement('span');
  line.className = 'plan39-axis-line';
  frame.appendChild(line);
  for (const benchmark of model.benchmarks) {
    const value = ratio(benchmark.form);
    const tick = document.createElement('span');
    tick.className = 'plan39-benchmark-tick';
    tick.style.left = `${value * 100}%`;
    frame.appendChild(tick);
    const label = document.createElement('span');
    label.className = 'plan39-benchmark-label';
    if (benchmark.label === '0') label.classList.add('plan39-benchmark-label-start');
    if (benchmark.label === '1') label.classList.add('plan39-benchmark-label-end');
    label.style.left = `${value * 100}%`;
    label.textContent = benchmark.label === '0' ? strings.plan39.zero
      : benchmark.label === '1' ? strings.plan39.one : strings.plan39.half;
    frame.appendChild(label);
  }
  for (const candidate of model.candidatePositions) {
    const point = document.createElement('span');
    point.className = 'plan39-candidate-point';
    point.style.left = `${ratio(candidate.form) * 100}%`;
    point.setAttribute('data-candidate-id', candidate.id);
    if (repair02) {
      point.setAttribute('role', 'img');
      point.setAttribute('aria-label', candidate.description);
    }
    frame.appendChild(point);
  }
  if (selectedCandidateId && !repair02) {
    const selected = model.candidatePositions.find(({ id }) => id === selectedCandidateId);
    if (selected) {
      const marker = document.createElement('span');
      marker.className = repair02 ? 'plan39-pending-marker' : 'plan39-preview-marker';
      marker.style.left = `${ratio(selected.form) * 100}%`;
      marker.setAttribute('data-candidate-id', selected.id);
      marker.setAttribute('aria-hidden', 'true');
      frame.appendChild(marker);
    }
  }
  if (model.acceptedPosition) {
    const point = document.createElement('span');
    point.className = 'plan39-accepted-point';
    point.style.left = `${ratio(model.acceptedPosition) * 100}%`;
    point.setAttribute('data-accepted-position', 'true');
    frame.appendChild(point);
  }
  figure.appendChild(frame);
  return figure;
}

function makeAcceptedConnectorOverlay(scene, stack) {
  const accepted = scene.meaning.numberLine.acceptedPosition;
  if (!accepted) return null;
  const bar = stack.querySelector('.plan39-bar-track');
  const frame = stack.querySelector('.plan39-axis-frame');
  const axis = frame?.querySelector('.plan39-axis-line');
  if (!bar || !frame || !axis || typeof stack.getBoundingClientRect !== 'function') return null;
  const stackRect = stack.getBoundingClientRect();
  const barRect = bar.getBoundingClientRect();
  const frameRect = frame.getBoundingClientRect();
  const axisRect = axis.getBoundingClientRect();
  if (!stackRect.width || !stackRect.height || !barRect.width || !frameRect.width) return null;
  const sourceForm = scene.meaning.quantities.source.sourceForm;
  const sourceX = barRect.left + bar.clientLeft + bar.clientWidth * ratio(sourceForm);
  const targetX = frameRect.left + frameRect.width * ratio(accepted);
  const sourceY = barRect.bottom;
  const targetY = axisRect.top + axisRect.height / 2;
  const overlay = svgElement('svg', {
    class: 'plan39-connector-overlay',
    viewBox: `0 0 ${stackRect.width} ${stackRect.height}`,
    'aria-hidden': 'true',
    focusable: 'false',
  });
  overlay.appendChild(svgElement('line', {
    x1: sourceX - stackRect.left,
    y1: sourceY - stackRect.top,
    x2: targetX - stackRect.left,
    y2: targetY - stackRect.top,
    class: 'plan39-accepted-connector',
  }));
  return overlay;
}

function makeLinearChoices(scene, strings, { previewHandle, onPreviewChange, key }) {
  const repair02 = isRepair02(scene);
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'plan39-candidates plan39-candidates-linear';
  const legend = document.createElement('legend');
  legend.textContent = repair02 ? strings.plan39Repair02.optionLegend : strings.plan39.candidateLegend;
  fieldset.appendChild(legend);
  scene.meaning.numberLine.candidatePositions.forEach((candidate) => {
    const labelText = repair02
      ? candidate.description
      : scene.meaning.numberLine.densityMode === 'partitioned'
        ? strings.plan39.stepChoice(candidate.stepIndex, candidate.totalSteps)
      : candidate.description;
    const label = document.createElement('label');
    label.className = 'plan39-candidate';
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `plan39-location-${key}`;
    radio.value = candidate.id;
    radio.setAttribute('data-candidate-id', candidate.id);
    radio.setAttribute('aria-label', labelText);
    radio.checked = previewHandle?.candidateId === candidate.id;
    radio.addEventListener('change', () => {
      if (radio.checked) onPreviewChange({ contextKey: key, candidateId: candidate.id });
    });
    label.appendChild(radio);
    const visible = document.createElement('span');
    visible.textContent = labelText;
    label.appendChild(visible);
    fieldset.appendChild(label);
  });
  return fieldset;
}

function makeVisualStepper(scene, strings, { previewHandle, onPreviewChange, key, updateTrack }) {
  const repair02 = isRepair02(scene);
  const candidates = scene.meaning.numberLine.candidatePositions;
  let selectedIndex = previewHandle ? candidates.findIndex(({ id }) => id === previewHandle.candidateId) : -1;
  const group = document.createElement('div');
  group.className = 'plan39-stepper';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', strings.plan39.stepperLabel);
  const status = document.createElement('output');
  status.className = 'plan39-stepper-status';
  status.setAttribute('aria-live', 'polite');
  const previous = createButton({
    label: repair02 && selectedIndex < 0 ? strings.plan39Repair02.placeLeftmost : strings.plan39.previousPoint,
    className: 'plan39-stepper-previous',
  });
  previous.classList.add('plan39-stepper-move');
  const next = createButton({
    label: repair02 && selectedIndex < 0 ? strings.plan39Repair02.placeRightmost : strings.plan39.nextPoint,
    className: 'plan39-stepper-next',
  });
  next.classList.add('plan39-stepper-move');

  function updateSelection(nextIndex, notify = true) {
    selectedIndex = nextIndex;
      previous.textContent = strings.plan39.previousPoint;
      next.textContent = strings.plan39.nextPoint;
    const selected = candidates[selectedIndex];
    if (notify) onPreviewChange({ contextKey: key, candidateId: selected.id });
    status.setAttribute('data-candidate-id', selected.id);
    status.textContent = repair02
      ? selected.description
      : scene.meaning.numberLine.densityMode === 'partitioned'
      ? strings.plan39.previewPartitionStep(selected.stepIndex, selected.totalSteps)
      : strings.plan39.previewSparsePoint(selectedIndex);
    previous.disabled = selectedIndex === 0;
    next.disabled = selectedIndex === candidates.length - 1;
    updateTrack(selected.id);
  }

  previous.addEventListener('click', () => {
    const targetIndex = selectedIndex < 0
      ? repair02 ? 0 : candidates.length - 1
      : selectedIndex - 1;
    updateSelection(targetIndex);
    if (previous.disabled) next.focus();
  });
  next.addEventListener('click', () => {
    const targetIndex = selectedIndex < 0
      ? repair02 ? candidates.length - 1 : 0
      : selectedIndex + 1;
    updateSelection(targetIndex);
    if (next.disabled) previous.focus();
  });
  if (selectedIndex >= 0) updateSelection(selectedIndex, false);
  else {
    status.textContent = repair02 ? strings.plan39Repair02.noSelection : strings.plan39.noPreview;
    previous.disabled = false;
    next.disabled = false;
  }
  group.appendChild(previous);
  group.appendChild(status);
  group.appendChild(next);
  return {
    element: group,
    readCandidateId: () => status.getAttribute('data-candidate-id'),
    writeCandidateId(candidateId) {
      const index = candidates.findIndex(({ id }) => id === candidateId);
      if (index < 0) return false;
      updateSelection(index, false);
      return true;
    },
    clearSelection() {
      selectedIndex = -1;
      previous.textContent = repair02 ? strings.plan39Repair02.placeLeftmost : strings.plan39.previousPoint;
      next.textContent = repair02 ? strings.plan39Repair02.placeRightmost : strings.plan39.nextPoint;
      status.removeAttribute('data-candidate-id');
      status.textContent = repair02 ? strings.plan39Repair02.noSelection : strings.plan39.noPreview;
      previous.disabled = false;
      next.disabled = false;
      updateTrack(null);
    },
  };
}

export function createNumberLineLocateRenderer({
  container,
  view,
  strings,
  dispatchAction,
  onPreviewChange = () => {},
  getHelpOpen = () => false,
  getProgression = null,
} = {}) {
  if (!container || !['visual', 'linear'].includes(view)) throw new TypeError('container and valid view are required');
  if (!dispatchAction || typeof dispatchAction !== 'function') throw new TypeError('dispatchAction is required');
  let root = null;
  let activeControls = null;
  let activeStepper = null;
  let currentKey = null;
  let currentScene = null;
  let previewHandle = null;
  let tokenPointerState = null;
  let escapeListenerBound = false;
  let viewportResizeListenerBound = false;
  let resizeObserver = null;
  let observedFrame = null;
  let grabCueShown = false;
  let grabCueActive = false;

  function visibleRoot() {
    if (!root?.isConnected) return false;
    for (let ancestor = root; ancestor; ancestor = ancestor.parentNode) {
      if (ancestor.hasAttribute?.('hidden')) return false;
    }
    return true;
  }

  function stopGrabCue() {
    if (!grabCueActive) return;
    grabCueActive = false;
    root?.querySelector('.plan39-repair-token')?.classList.remove('has-grab-cue');
    document.removeEventListener('pointerdown', stopGrabCue, true);
    document.removeEventListener('keydown', stopGrabCue, true);
  }

  function maybeStartGrabCue(token) {
    if (view !== 'visual' || grabCueShown || !visibleRoot() || token?.classList.contains('is-placed')) return;
    grabCueShown = true;
    grabCueActive = true;
    token.classList.add('has-grab-cue');
    token.addEventListener('animationend', stopGrabCue, { once: true });
    document.addEventListener('pointerdown', stopGrabCue, true);
    document.addEventListener('keydown', stopGrabCue, true);
  }

  function onViewportResize() {
    if (!root?.isConnected || !currentScene || !isRepair02(currentScene)) return;
    if (tokenPointerState) cancelActiveTokenGesture();
    const selectedId = currentScene.meaning.currentTask.beat === 'locate'
      && previewHandle?.contextKey === currentKey ? previewHandle.candidateId : null;
    setTokenPlacement(selectedId);
    refreshGeometry();
  }

  function syncResizeObservation() {
    if (!isRepair02(currentScene)) {
      resizeObserver?.disconnect();
      observedFrame = null;
      if (viewportResizeListenerBound && typeof window !== 'undefined') {
        window.removeEventListener('resize', onViewportResize);
        viewportResizeListenerBound = false;
      }
      return;
    }
    if (!viewportResizeListenerBound && typeof window !== 'undefined') {
      window.addEventListener('resize', onViewportResize);
      viewportResizeListenerBound = true;
    }
    if (typeof ResizeObserver === 'undefined') return;
    const frame = root?.querySelector('.plan39-axis-frame');
    if (frame === observedFrame) return;
    resizeObserver?.disconnect();
    observedFrame = frame;
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        if (!root?.isConnected || !currentScene) return;
        if (tokenPointerState) cancelActiveTokenGesture();
        const selectedId = currentScene.meaning.currentTask.beat === 'locate'
          && previewHandle?.contextKey === currentKey ? previewHandle.candidateId : null;
        if (isRepair02(currentScene)) setTokenPlacement(selectedId);
        refreshGeometry();
      });
    }
    if (frame) resizeObserver.observe(frame);
  }

  function cancelActiveTokenGesture() {
    const active = tokenPointerState;
    if (!active) return;
    showDropPreview(active.frame, null);
    tokenPointerState = null;
    try { active.token.releasePointerCapture?.(active.pointerId); } catch { /* capture may already be gone */ }
    restoreTokenAfterGesture(active.token, active.candidateId);
  }

  function onDocumentKeyDown(event) {
    stopGrabCue();
    if (event.key !== 'Escape' || !tokenPointerState) return;
    event.preventDefault();
    cancelActiveTokenGesture();
  }

  function setTokenPlacement(candidateId) {
    const token = root?.querySelector('.plan39-repair-token');
    const stack = root?.querySelector('.plan39-representation-stack');
    const frame = stack?.querySelector('.plan39-axis-frame');
    if (!token || !stack || !frame || !candidateId || !isRepair02(currentScene)) {
      if (token) {
        token.classList.remove('is-placed', 'is-dragging');
        token.style.position = '';
        token.style.left = '';
        token.style.top = '';
        token.style.transform = '';
        token.style.zIndex = '';
        token.removeAttribute('data-candidate-id');
        const form = currentScene?.meaning.quantities.source.sourceForm;
        if (form) token.setAttribute('aria-label', strings.plan39Repair02.tokenNotPlaced(form.numerator, form.denominator));
      }
      return;
    }
    if (typeof stack.getBoundingClientRect !== 'function' || typeof frame.getBoundingClientRect !== 'function') return;
    const candidate = currentScene.meaning.numberLine.candidatePositions.find(({ id }) => id === candidateId);
    if (!candidate) return;
    const stackRect = stack.getBoundingClientRect();
    const frameRect = frame.getBoundingClientRect();
    const axis = frame.querySelector('.plan39-axis-line');
    const axisRect = axis?.getBoundingClientRect() ?? frameRect;
    token.classList.add('is-placed');
    token.classList.remove('is-dragging');
    token.style.position = 'absolute';
    token.style.left = `${frameRect.left - stackRect.left + frameRect.width * ratio(candidate.form)}px`;
    token.style.top = `${axisRect.top - stackRect.top + axisRect.height / 2}px`;
    token.style.transform = 'translate(-50%, -100%)';
    token.style.zIndex = '3';
    token.setAttribute('data-candidate-id', candidateId);
    const form = currentScene.meaning.quantities.source.sourceForm;
    token.setAttribute('aria-label', strings.plan39Repair02.tokenPlaced(form.numerator, form.denominator, candidate.description));
  }

  function restoreTokenAfterGesture(token, candidateId) {
    token.classList.remove('is-dragging');
    token.style.position = '';
    token.style.left = '';
    token.style.top = '';
    token.style.transform = '';
    token.style.zIndex = '';
    setTokenPlacement(candidateId);
  }

  function resolveCandidateAtAnchor(frame, anchorX, anchorY) {
    const rect = frame.getBoundingClientRect();
    const axis = frame.querySelector('.plan39-axis-line');
    const axisRect = axis?.getBoundingClientRect() ?? rect;
    const axisY = axisRect.top + axisRect.height / 2;
    const halfBand = Math.max(22, rect.height / 2);
    const ring = frame.querySelector('.plan39-candidate-point.is-drop-preview');
    ring?.classList.remove('is-drop-preview');
    if (anchorX < rect.left || anchorX > rect.right
      || anchorY < axisY - halfBand || anchorY > axisY + halfBand) return null;
    return currentScene.meaning.numberLine.candidatePositions
      .map((candidate, index) => ({
        candidate,
        index,
        centerX: rect.left + rect.width * ratio(candidate.form),
      }))
      .sort((left, right) => {
        const distanceDifference = Math.abs(left.centerX - anchorX) - Math.abs(right.centerX - anchorX);
        const tieTolerance = Number.EPSILON * Math.max(1, Math.abs(left.centerX), Math.abs(right.centerX), Math.abs(anchorX)) * 8;
        if (Math.abs(distanceDifference) > tieTolerance) return distanceDifference;
        return left.centerX - right.centerX || left.index - right.index;
      })[0]?.candidate ?? null;
  }

  function showDropPreview(frame, candidate) {
    frame.querySelector('.plan39-candidate-point.is-drop-preview')?.classList.remove('is-drop-preview');
    if (candidate) frame.querySelector(`.plan39-candidate-point[data-candidate-id="${candidate.id}"]`)?.classList.add('is-drop-preview');
  }

  function bindTokenDrag(stack, savePreview) {
    const token = stack.querySelector('.plan39-repair-token');
    if (!token || token.getAttribute('data-pointer-bound') === 'true') return;
    token.setAttribute('data-pointer-bound', 'true');
    token.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || (event.button !== undefined && event.button !== 0)) return;
      stopGrabCue();
      event.stopPropagation();
      const frame = stack.querySelector('.plan39-axis-frame');
      if (!frame) return;
      const tokenRect = token.getBoundingClientRect();
      const anchorX = tokenRect.left + tokenRect.width / 2;
      const anchorY = tokenRect.bottom;
      tokenPointerState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        candidateId: previewHandle?.candidateId ?? null,
        token,
        frame,
        grabOffsetX: event.clientX - anchorX,
        grabOffsetY: event.clientY - anchorY,
        dragging: false,
      };
      try { token.setPointerCapture(event.pointerId); } catch { tokenPointerState = null; }
    });
    token.addEventListener('pointermove', (event) => {
      const active = tokenPointerState;
      if (!active || active.pointerId !== event.pointerId) return;
      const dx = event.clientX - active.startX;
      const dy = event.clientY - active.startY;
      if (!active.dragging && Math.hypot(dx, dy) < 6) return;
      active.dragging = true;
      token.classList.add('is-dragging');
      const anchorX = event.clientX - active.grabOffsetX;
      const anchorY = event.clientY - active.grabOffsetY;
      token.style.position = 'fixed';
      token.style.left = '0px';
      token.style.top = '0px';
      token.style.transform = `translate3d(${anchorX}px, ${anchorY}px, 0) translate(-50%, -100%)`;
      token.style.zIndex = '1000';
      showDropPreview(active.frame, resolveCandidateAtAnchor(active.frame, anchorX, anchorY));
    });
    const cancel = (event) => {
      const active = tokenPointerState;
      if (!active || (event.pointerId !== undefined && active.pointerId !== event.pointerId)) return;
      tokenPointerState = null;
      showDropPreview(active.frame, null);
      restoreTokenAfterGesture(token, active.candidateId);
    };
    token.addEventListener('pointercancel', cancel);
    token.addEventListener('lostpointercapture', cancel);
    token.addEventListener('pointerup', (event) => {
      const active = tokenPointerState;
      if (!active || active.pointerId !== event.pointerId) return;
      tokenPointerState = null;
      let selected = null;
      const anchorX = event.clientX - active.grabOffsetX;
      const anchorY = event.clientY - active.grabOffsetY;
      if (active.dragging) selected = resolveCandidateAtAnchor(active.frame, anchorX, anchorY);
      showDropPreview(active.frame, null);
      restoreTokenAfterGesture(token, selected?.id ?? active.candidateId);
      if (selected) savePreview({ contextKey: currentKey, candidateId: selected.id });
    });
    if (!escapeListenerBound) {
      document.addEventListener('keydown', onDocumentKeyDown);
      escapeListenerBound = true;
    }
  }

  function bindTrackTap(frame, savePreview) {
    if (!frame || frame.getAttribute('data-pointer-tap-bound') === 'true') return;
    frame.setAttribute('data-pointer-tap-bound', 'true');
    let gesture = null;
    frame.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || (event.button !== undefined && event.button !== 0)) return;
      stopGrabCue();
      gesture = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, moved: false };
    });
    frame.addEventListener('pointermove', (event) => {
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const dx = event.clientX - gesture.startX;
      const dy = event.clientY - gesture.startY;
      if (Math.hypot(dx, dy) > 6 || (Math.abs(dy) >= 8 && Math.abs(dy) >= 1.25 * Math.abs(dx))) gesture.moved = true;
    });
    const clearGesture = (event) => {
      if (gesture && (event.pointerId === undefined || gesture.pointerId === event.pointerId)) gesture = null;
    };
    frame.addEventListener('pointercancel', clearGesture);
    frame.addEventListener('pointerup', (event) => {
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      const started = gesture;
      gesture = null;
      const rect = frame.getBoundingClientRect();
      const withinBand = event.clientX >= rect.left && event.clientX <= rect.right
        && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (started.moved || !withinBand) return;
      const axis = frame.querySelector('.plan39-axis-line');
      const axisRect = axis?.getBoundingClientRect() ?? rect;
      const candidate = resolveCandidateAtAnchor(frame, event.clientX, axisRect.top + axisRect.height / 2);
      if (candidate) savePreview({ contextKey: currentKey, candidateId: candidate.id });
    });
  }

  function readCurrentPreview() {
    if (!root?.isConnected) return null;
    let ancestor = root;
    while (ancestor) {
      if (ancestor.hasAttribute?.('hidden')) return null;
      ancestor = ancestor.parentNode;
    }
    if (!activeControls?.isConnected || !root.contains(activeControls)) throw new Error('Visible Plan 39 region is missing its current controls');
    if (currentScene?.meaning.currentTask.beat !== 'locate') return null;
    const candidateId = view === 'visual'
      ? activeStepper?.readCandidateId() ?? null
      : Array.from(activeControls.querySelectorAll('input')).find((input) => input.type === 'radio' && input.checked)?.getAttribute('data-candidate-id') ?? null;
    return candidateId ? { contextKey: currentKey, candidateId } : null;
  }

  function refreshGeometry() {
    const stack = root?.querySelector('.plan39-representation-stack');
    if (!stack) return;
    const previous = stack.querySelector('.plan39-connector-overlay');
    if (previous) stack.removeChild(previous);
    const connector = makeAcceptedConnectorOverlay(currentScene, stack);
    if (connector) stack.appendChild(connector);
  }

  function update(scene) {
    assertValidScene(scene);
    if (!scene.meaning.numberLine || scene.meaning.currentTask?.beat === undefined) throw new TypeError('Plan 39 number-line scene is required');
    if (scene.meaning.representationRole !== 'number-line') throw new TypeError('Plan 39 scene must be projected for the number-line representation role');
    const nextKey = previewKey(scene);
    cancelActiveTokenGesture();
    if (currentKey !== nextKey || scene.meaning.currentTask.beat !== 'locate') previewHandle = null;
    currentScene = scene;
    currentKey = nextKey;
    activeStepper = null;
    root.replaceChildren();
    const heading = document.createElement('h2');
    heading.className = 'active-beat-prompt';
    const repair02 = isRepair02(scene);
    const accepted = repair02 && (scene.meaning.currentTask.beat === 'resolve' || scene.meaning.status.episode === 'resolved');
    heading.textContent = repair02
      ? accepted ? strings.plan39Repair02.resolvedPrompt : view === 'linear' ? strings.plan39Repair02.linearPrompt : strings.plan39Repair02.visualPrompt
      : scene.meaning.status.episode === 'resolved' ? strings.plan39.resolvedPrompt : strings.plan39.prompt;
    root.appendChild(heading);
    const stack = document.createElement('div');
    stack.className = 'plan39-representation-stack';
    if (repair02 && !accepted) {
      stack.appendChild(makeRepairToken(scene, strings));
      stack.appendChild(makeTrack(scene, strings, previewHandle?.contextKey === currentKey ? previewHandle.candidateId : null, view));
    } else if (repair02 && view === 'linear') {
      stack.appendChild(makeRepairAcceptedSource(scene));
    } else {
      stack.appendChild(makeBar(scene, strings, view));
      stack.appendChild(makeTrack(scene, strings, previewHandle?.contextKey === currentKey ? previewHandle.candidateId : null, view));
    }
    root.appendChild(stack);
    if (repair02 && !accepted && scene.meaning.currentTask.beat === 'locate') {
      maybeStartGrabCue(stack.querySelector('.plan39-repair-token'));
    }
    refreshGeometry();
    if (accepted) root.appendChild(makeRepairResolution(scene, strings));
    if (repair02 && !accepted) {
      setTokenPlacement(previewHandle?.contextKey === currentKey ? previewHandle.candidateId : null);
    }

    if (scene.meaning.status.recovery?.beat === 'locate') {
      const feedback = document.createElement('p');
      feedback.className = 'plan39-feedback';
      feedback.setAttribute('role', 'alert');
      feedback.textContent = repair02
        ? strings.plan39Repair02.recovery(scene.meaning.status.recovery.classification.kind)
        : strings.plan39.recovery(scene.meaning.status.recovery.classification.kind);
      root.appendChild(feedback);
    }

    if (scene.meaning.currentTask.beat === 'encounter') {
      activeControls = document.createElement('div');
      activeControls.className = 'active-beat-controls plan39-controls';
      activeControls.appendChild(createButton({
        label: strings.plan39.continue,
        className: 'plan39-continue',
        onClick: () => dispatchAction({ type: 'acknowledge-bridge-encounter' }),
      }));
    } else if (scene.meaning.currentTask.beat === 'locate') {
      activeControls = document.createElement('div');
      activeControls.className = 'active-beat-controls plan39-controls';
      const stackForUpdate = stack;
      let checkButton = null;
      const savePreview = (handle) => {
        previewHandle = handle;
        onPreviewChange(handle);
        if (handle && checkButton) checkButton.disabled = false;
        if (repair02) setTokenPlacement(handle?.candidateId ?? null);
      };
      const savePreviewHandle = (handle) => {
        previewHandle = handle;
        onPreviewChange(handle);
        if (handle && checkButton) checkButton.disabled = false;
        if (repair02) setTokenPlacement(handle?.candidateId ?? null);
        if (view === 'visual' && activeStepper) activeStepper.writeCandidateId(handle?.candidateId);
        else updateTrack(handle?.candidateId ?? null);
      };
      const updateTrack = (candidateId) => {
        const currentTrack = stackForUpdate.querySelector('.plan39-track-figure');
        if (!currentTrack) throw new Error('Visible Plan 39 track is missing during preview update');
        replaceNode(stackForUpdate, currentTrack, makeTrack(currentScene, strings, candidateId, view));
        if (repair02 && view === 'visual') bindTrackTap(stackForUpdate.querySelector('.plan39-axis-frame'), savePreviewHandle);
        refreshGeometry();
        syncResizeObservation();
      };
      if (repair02) {
        bindTokenDrag(stackForUpdate, savePreviewHandle);
        if (view === 'visual') bindTrackTap(stackForUpdate.querySelector('.plan39-axis-frame'), savePreviewHandle);
      }
      if (view === 'visual') {
        activeStepper = makeVisualStepper(scene, strings, {
          previewHandle: previewHandle?.contextKey === currentKey ? previewHandle : null,
          onPreviewChange: savePreview,
          key: currentKey,
          updateTrack,
        });
        activeControls.appendChild(activeStepper.element);
      } else {
        const choices = makeLinearChoices(scene, strings, {
          previewHandle: previewHandle?.contextKey === currentKey ? previewHandle : null,
          onPreviewChange: savePreview,
          key: currentKey,
        });
        choices.classList.add('active-beat-controls');
        activeControls.appendChild(choices);
      }
      const check = createButton({
        label: repair02 ? strings.plan39Repair02.checkPosition : strings.plan39.checkPosition,
        className: 'plan39-check-position',
        disabled: !previewHandle,
      });
      checkButton = check;
      activeControls.appendChild(check);
      check.addEventListener('click', () => {
        const preview = readCurrentPreview();
        if (!preview || preview.contextKey !== currentKey) return;
        const candidate = currentScene.meaning.numberLine.candidatePositions.find(({ id }) => id === preview.candidateId);
        if (!candidate) return;
        previewHandle = null;
        onPreviewChange(null);
        if (repair02) setTokenPlacement(null);
        dispatchAction({ type: 'propose-number-line-location', proposed: candidate.form });
      });
    } else if (scene.meaning.currentTask.beat === 'resolve' && scene.meaning.status.episode !== 'resolved') {
      activeControls = document.createElement('div');
      activeControls.className = 'active-beat-controls plan39-controls';
      const progression = getProgression ? getProgression() : null;
      if (progression && progression.actionKind !== 'none') {
        if (progression.notice) {
          const noticeEl = document.createElement('p');
          noticeEl.className = 'progression-notice';
          noticeEl.textContent = progression.notice;
          activeControls.appendChild(noticeEl);
        }
        activeControls.appendChild(createButton({
          label: progression.label,
          className: 'plan39-finish',
          onClick: () => progression.onAction?.(),
        }));
      } else {
        activeControls.appendChild(createButton({ label: strings.plan39.finish, className: 'plan39-finish', onClick: () => dispatchAction({ type: 'finish-compact-episode' }) }));
      }
    } else {
      activeControls = document.createElement('div');
      activeControls.className = 'active-beat-controls plan39-controls';
    }
    root.appendChild(activeControls);
    if (getHelpOpen() && scene.meaning.currentTask.beat === 'locate') {
      const help = document.createElement('p');
      help.id = `${view}-plan39-help`;
      help.className = 'plan39-help';
      help.textContent = repair02 ? strings.plan39Repair02.help : strings.plan39.help;
      root.appendChild(help);
    }
    syncResizeObservation();
  }

  return {
    mount(scene) {
      root = document.createElement('section');
      root.className = `plan39-number-line plan39-${view}`;
      root.setAttribute('aria-label', strings.plan39.regionLabel);
      container.appendChild(root);
      update(scene);
      return this;
    },
    update,
    refreshGeometry,
    destroy() {
      cancelActiveTokenGesture();
      resizeObserver?.disconnect();
      resizeObserver = null;
      observedFrame = null;
      if (viewportResizeListenerBound && typeof window !== 'undefined') {
        window.removeEventListener('resize', onViewportResize);
        viewportResizeListenerBound = false;
      }
      if (escapeListenerBound) {
        document.removeEventListener('keydown', onDocumentKeyDown);
        escapeListenerBound = false;
      }
      stopGrabCue();
      if (root?.parentNode) root.parentNode.removeChild(root);
      root = null;
      activeControls = null;
      activeStepper = null;
      currentScene = null;
      currentKey = null;
      previewHandle = null;
    },
    readPreview() {
      return readCurrentPreview();
    },
    writePreview(handle) {
      if (!root?.isConnected) return false;
      let ancestor = root;
      while (ancestor) {
        if (ancestor.hasAttribute?.('hidden')) return false;
        ancestor = ancestor.parentNode;
      }
      if (!activeControls?.isConnected || !root.contains(activeControls)) throw new Error('Visible Plan 39 region is missing its current controls');
      if (!handle || handle.contextKey !== currentKey || currentScene?.meaning.currentTask.beat !== 'locate') return false;
      const candidate = currentScene.meaning.numberLine.candidatePositions.find(({ id }) => id === handle.candidateId);
      if (!candidate) return false;
      if (view === 'visual') {
        if (!activeStepper?.writeCandidateId(candidate.id)) return false;
        previewHandle = { contextKey: currentKey, candidateId: candidate.id };
      } else {
        const input = Array.from(activeControls.querySelectorAll('input')).find((item) => item.type === 'radio' && item.getAttribute('data-candidate-id') === candidate.id);
        if (!input) return false;
        input.checked = true;
        previewHandle = { contextKey: currentKey, candidateId: candidate.id };
        const check = activeControls.querySelector('.plan39-check-position');
        if (check) check.disabled = false;
      }
      if (isRepair02(currentScene)) setTokenPlacement(candidate.id);
      const check = activeControls.querySelector('.plan39-check-position');
      if (check) check.disabled = false;
      return true;
    },
    clearPreview() {
      previewHandle = null;
      onPreviewChange(null);
      if (activeStepper) activeStepper.clearSelection();
      else {
        for (const input of activeControls?.querySelectorAll('input') ?? []) {
          if (input.type === 'radio') input.checked = false;
        }
      }
      const check = activeControls?.querySelector('.plan39-check-position');
      if (check) check.disabled = true;
      if (isRepair02(currentScene)) setTokenPlacement(null);
      return true;
    },
    focusControl(kind) {
      if (!root?.isConnected || !activeControls?.isConnected || !root.contains(activeControls)) return false;
      const selector = kind === 'check' ? '.plan39-check-position'
        : kind === 'finish' ? '.plan39-finish'
          : kind === 'candidate' ? (view === 'visual' ? '.plan39-stepper-next' : '[type="radio"]') : '.plan39-continue';
      const control = activeControls.querySelector(selector);
      if (!control?.isConnected || !activeControls.contains(control)) return false;
      control.focus();
      return true;
    },
    getCurrentControls() {
      return activeControls?.isConnected && root?.contains(activeControls) ? activeControls : null;
    },
  };
}
