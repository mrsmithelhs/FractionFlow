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
    candidateSet: numberLine.candidatePositions.map(({ id, form }) => [id, form]),
    supportMode: numberLine.densityMode,
    scheduleEntryId: scene.meaning.currentTask.scheduleEntryId,
  });
}

function ratio(form) {
  return Number(form.numerator) / Number(form.denominator);
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
  const figure = document.createElement('figure');
  figure.className = 'plan39-track-figure';
  if (view === 'linear') {
    const description = document.createElement('p');
    description.className = 'plan39-track-description';
    description.textContent = strings.plan39.trackDescription;
    figure.appendChild(description);
    return figure;
  }

  const frame = document.createElement('div');
  frame.className = 'plan39-unit-frame plan39-axis-frame';
  frame.setAttribute('role', 'img');
  frame.setAttribute('aria-label', strings.plan39.trackDescription);
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
    frame.appendChild(point);
  }
  if (selectedCandidateId) {
    const selected = model.candidatePositions.find(({ id }) => id === selectedCandidateId);
    if (selected) {
      const marker = document.createElement('span');
      marker.className = 'plan39-preview-marker';
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
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'plan39-candidates plan39-candidates-linear';
  const legend = document.createElement('legend');
  legend.textContent = strings.plan39.candidateLegend;
  fieldset.appendChild(legend);
  scene.meaning.numberLine.candidatePositions.forEach((candidate) => {
    const labelText = scene.meaning.numberLine.densityMode === 'partitioned'
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
  const candidates = scene.meaning.numberLine.candidatePositions;
  let selectedIndex = previewHandle ? candidates.findIndex(({ id }) => id === previewHandle.candidateId) : -1;
  const group = document.createElement('div');
  group.className = 'plan39-stepper';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', strings.plan39.stepperLabel);
  const status = document.createElement('output');
  status.className = 'plan39-stepper-status';
  status.setAttribute('aria-live', 'polite');
  const previous = createButton({ label: strings.plan39.previousPoint, className: 'plan39-stepper-previous' });
  previous.classList.add('plan39-stepper-move');
  const next = createButton({ label: strings.plan39.nextPoint, className: 'plan39-stepper-next' });
  next.classList.add('plan39-stepper-move');

  function updateSelection(nextIndex, notify = true) {
    selectedIndex = nextIndex;
    const selected = candidates[selectedIndex];
    if (notify) onPreviewChange({ contextKey: key, candidateId: selected.id });
    status.setAttribute('data-candidate-id', selected.id);
    status.textContent = scene.meaning.numberLine.densityMode === 'partitioned'
      ? strings.plan39.previewPartitionStep(selected.stepIndex, selected.totalSteps)
      : strings.plan39.previewSparsePoint(selectedIndex);
    previous.disabled = selectedIndex === 0;
    next.disabled = selectedIndex === candidates.length - 1;
    updateTrack(selected.id);
  }

  previous.addEventListener('click', () => {
    const targetIndex = selectedIndex < 0 ? candidates.length - 1 : selectedIndex - 1;
    updateSelection(targetIndex);
  });
  next.addEventListener('click', () => {
    const targetIndex = selectedIndex < 0 ? 0 : selectedIndex + 1;
    updateSelection(targetIndex);
  });
  if (selectedIndex >= 0) updateSelection(selectedIndex, false);
  else {
    status.textContent = strings.plan39.noPreview;
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
  };
}

export function createNumberLineLocateRenderer({
  container,
  view,
  strings,
  dispatchAction,
  onPreviewChange = () => {},
  getHelpOpen = () => false,
} = {}) {
  if (!container || !['visual', 'linear'].includes(view)) throw new TypeError('container and valid view are required');
  if (!dispatchAction || typeof dispatchAction !== 'function') throw new TypeError('dispatchAction is required');
  let root = null;
  let activeControls = null;
  let activeStepper = null;
  let currentKey = null;
  let currentScene = null;
  let previewHandle = null;

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
    if (currentKey !== nextKey || scene.meaning.currentTask.beat !== 'locate') previewHandle = null;
    currentScene = scene;
    currentKey = nextKey;
    activeStepper = null;
    root.replaceChildren();
    const heading = document.createElement('h2');
    heading.className = 'active-beat-prompt';
    heading.textContent = scene.meaning.status.episode === 'resolved' ? strings.plan39.resolvedPrompt : strings.plan39.prompt;
    root.appendChild(heading);
    const stack = document.createElement('div');
    stack.className = 'plan39-representation-stack';
    stack.appendChild(makeBar(scene, strings, view));
    stack.appendChild(makeTrack(scene, strings, previewHandle?.contextKey === currentKey ? previewHandle.candidateId : null, view));
    root.appendChild(stack);
    refreshGeometry();

    if (scene.meaning.status.recovery?.beat === 'locate') {
      const feedback = document.createElement('p');
      feedback.className = 'plan39-feedback';
      feedback.setAttribute('role', 'alert');
      feedback.textContent = strings.plan39.recovery(scene.meaning.status.recovery.classification.kind);
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
      };
      const updateTrack = (candidateId) => {
        const currentTrack = stackForUpdate.querySelector('.plan39-track-figure');
        if (!currentTrack) throw new Error('Visible Plan 39 track is missing during preview update');
        replaceNode(stackForUpdate, currentTrack, makeTrack(currentScene, strings, candidateId, view));
        refreshGeometry();
      };
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
        label: strings.plan39.checkPosition,
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
        dispatchAction({ type: 'propose-number-line-location', proposed: candidate.form });
      });
    } else if (scene.meaning.currentTask.beat === 'resolve' && scene.meaning.status.episode !== 'resolved') {
      activeControls = document.createElement('div');
      activeControls.className = 'active-beat-controls plan39-controls';
      activeControls.appendChild(createButton({ label: strings.plan39.finish, className: 'plan39-finish', onClick: () => dispatchAction({ type: 'finish-compact-episode' }) }));
    } else {
      activeControls = document.createElement('div');
      activeControls.className = 'active-beat-controls plan39-controls';
    }
    root.appendChild(activeControls);
    if (getHelpOpen() && scene.meaning.currentTask.beat === 'locate') {
      const help = document.createElement('p');
      help.id = `${view}-plan39-help`;
      help.className = 'plan39-help';
      help.textContent = strings.plan39.help;
      root.appendChild(help);
    }
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
      const check = activeControls.querySelector('.plan39-check-position');
      if (check) check.disabled = false;
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
