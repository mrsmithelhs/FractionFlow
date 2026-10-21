import { assertValidScene } from './contract.js';
import { createButton } from './controls.js';

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

function makeBar(scene, strings, view) {
  const quantity = scene.meaning.quantities.source;
  const numerator = Number(quantity.sourceForm.numerator);
  const denominator = Number(quantity.sourceForm.denominator);
  const figure = document.createElement('figure');
  figure.className = 'plan39-source-figure';
  const label = document.createElement('figcaption');
  label.textContent = strings.plan39.sourceBar;
  figure.appendChild(label);
  const fractionText = document.createElement('span');
  fractionText.className = 'plan39-source-fraction';
  fractionText.setAttribute('aria-label', `${quantity.sourceForm.numerator} over ${quantity.sourceForm.denominator}`);
  const numeratorText = document.createElement('span');
  numeratorText.setAttribute('aria-hidden', 'true');
  numeratorText.textContent = quantity.sourceForm.numerator;
  const denominatorText = document.createElement('span');
  denominatorText.setAttribute('aria-hidden', 'true');
  denominatorText.textContent = quantity.sourceForm.denominator;
  fractionText.appendChild(numeratorText);
  fractionText.appendChild(denominatorText);
  figure.appendChild(fractionText);

  if (view === 'linear') {
    const description = document.createElement('p');
    description.textContent = strings.plan39.sourceBarDescription(numerator, denominator);
    figure.appendChild(description);
    return figure;
  }

  const svg = svgElement('svg', { viewBox: '0 0 1000 138', role: 'img', 'aria-label': strings.plan39.sourceBarDescription(numerator, denominator) });
  const x0 = 42;
  const x1 = 958;
  const y = 46;
  const height = 48;
  svg.appendChild(svgElement('rect', { x: x0, y, width: x1 - x0, height, class: 'plan39-bar-outline' }));
  for (let index = 0; index < denominator; index += 1) {
    const width = (x1 - x0) / denominator;
    svg.appendChild(svgElement('rect', {
      x: x0 + index * width,
      y,
      width,
      height,
      class: index < numerator ? 'plan39-bar-part plan39-bar-part-shaded' : 'plan39-bar-part',
    }));
  }
  svg.appendChild(svgElement('line', { x1: x0, y1: y + height + 2, x2: x0, y2: 122, class: 'plan39-endpoint-extension' }));
  svg.appendChild(svgElement('line', { x1, y1: y + height + 2, x2: x1, y2: 122, class: 'plan39-endpoint-extension' }));
  figure.appendChild(svg);
  return figure;
}

function makeTrack(scene, strings, selectedCandidateId, view) {
  const model = scene.meaning.numberLine;
  const figure = document.createElement('figure');
  figure.className = 'plan39-track-figure';
  const caption = document.createElement('figcaption');
  caption.textContent = strings.plan39.numberLine;
  figure.appendChild(caption);
  if (view === 'linear') {
    const description = document.createElement('p');
    description.className = 'plan39-track-description';
    description.textContent = strings.plan39.trackDescription;
    figure.appendChild(description);
    return figure;
  }
  const svg = svgElement('svg', { viewBox: '0 0 1000 178', role: 'img', 'aria-label': strings.plan39.trackDescription });
  const x0 = 42;
  const x1 = 958;
  const y = 79;
  svg.appendChild(svgElement('line', { x1: x0, y1: y, x2: x1, y2: y, class: 'plan39-track' }));
  for (const benchmark of model.benchmarks) {
    const value = Number(benchmark.form.numerator) / Number(benchmark.form.denominator);
    const x = x0 + (x1 - x0) * value;
    svg.appendChild(svgElement('line', { x1: x, y1: y - 12, x2: x, y2: y + 12, class: 'plan39-benchmark-tick' }));
    const text = svgElement('text', { x, y: y + 39, 'text-anchor': value === 0 ? 'start' : value === 1 ? 'end' : 'middle', class: 'plan39-benchmark-label' });
    text.textContent = benchmark.label === '0' ? strings.plan39.zero : benchmark.label === '1' ? strings.plan39.one : strings.plan39.half;
    svg.appendChild(text);
  }
  for (const candidate of model.candidatePositions) {
    const position = Number(candidate.form.numerator) / Number(candidate.form.denominator);
    const x = x0 + (x1 - x0) * position;
    svg.appendChild(svgElement('circle', {
      cx: x,
      cy: y,
      r: 7,
      class: candidate.id === selectedCandidateId ? 'plan39-candidate-point plan39-candidate-point-preview' : 'plan39-candidate-point',
      'data-candidate-id': candidate.id,
    }));
  }
  if (model.acceptedPosition) {
    const position = Number(model.acceptedPosition.numerator) / Number(model.acceptedPosition.denominator);
    const x = x0 + (x1 - x0) * position;
    svg.appendChild(svgElement('circle', { cx: x, cy: y, r: 10, class: 'plan39-accepted-point' }));
  }
  figure.appendChild(svg);
  return figure;
}

function makeAcceptedConnectorOverlay(scene, stack) {
  const accepted = scene.meaning.numberLine.acceptedPosition;
  if (!accepted) return null;
  const barSvg = stack.querySelector('.plan39-source-figure svg');
  const trackSvg = stack.querySelector('.plan39-track-figure svg');
  if (!barSvg || !trackSvg || typeof stack.getBoundingClientRect !== 'function'
    || typeof barSvg.createSVGPoint !== 'function' || typeof trackSvg.createSVGPoint !== 'function') return null;
  const stackRect = stack.getBoundingClientRect();
  if (!stackRect.width || !stackRect.height) return null;
  const sourceForm = scene.meaning.quantities.source.sourceForm;
  const sourceX = 42 + (958 - 42) * Number(sourceForm.numerator) / Number(sourceForm.denominator);
  const targetX = 42 + (958 - 42) * Number(accepted.numerator) / Number(accepted.denominator);
  const screenPoint = (svg, x, y) => {
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(svg.getScreenCTM());
  };
  const source = screenPoint(barSvg, sourceX, 94);
  const target = screenPoint(trackSvg, targetX, 79);
  const overlay = svgElement('svg', {
    class: 'plan39-connector-overlay',
    viewBox: `0 0 ${stackRect.width} ${stackRect.height}`,
    'aria-hidden': 'true',
    focusable: 'false',
  });
  overlay.appendChild(svgElement('line', {
    x1: source.x - stackRect.left,
    y1: source.y - stackRect.top,
    x2: target.x - stackRect.left,
    y2: target.y - stackRect.top,
    class: 'plan39-accepted-connector',
  }));
  return overlay;
}

function makeCandidateFieldset(scene, strings, { previewHandle, onPreviewChange, key, view, updateTrack }) {
  const model = scene.meaning.numberLine;
  const fieldset = document.createElement('fieldset');
  fieldset.className = `plan39-candidates plan39-candidates-${view}`;
  const legend = document.createElement('legend');
  legend.textContent = strings.plan39.candidateLegend;
  fieldset.appendChild(legend);
  const current = previewHandle?.contextKey === key ? previewHandle : null;
  model.candidatePositions.forEach((candidate, index) => {
    const labelText = model.densityMode === 'partitioned'
      ? strings.plan39.stepChoice(candidate.form.numerator, candidate.form.denominator)
      : candidate.description;
    if (view === 'visual') {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'plan39-candidate plan39-candidate-option';
      option.textContent = labelText;
      option.setAttribute('data-candidate-id', candidate.id);
      option.setAttribute('aria-pressed', String(current?.candidateId === candidate.id));
      option.addEventListener('click', () => {
        const handle = { contextKey: key, candidateId: candidate.id };
        onPreviewChange(handle);
        for (const button of fieldset.querySelectorAll('.plan39-candidate-option')) {
          button.setAttribute('aria-pressed', String(button === option));
        }
        updateTrack(candidate.id);
        check.disabled = false;
      });
      fieldset.appendChild(option);
    } else {
      const label = document.createElement('label');
      label.className = 'plan39-candidate';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `plan39-location-${view}-${key}`;
      radio.value = candidate.id;
      radio.setAttribute('data-candidate-id', candidate.id);
      radio.setAttribute('aria-label', labelText);
      radio.checked = current?.candidateId === candidate.id;
      radio.addEventListener('change', () => {
        if (!radio.checked) return;
        onPreviewChange({ contextKey: key, candidateId: candidate.id });
        check.disabled = false;
      });
      label.appendChild(radio);
      const visibleLabel = document.createElement('span');
      visibleLabel.textContent = labelText;
      label.appendChild(visibleLabel);
      fieldset.appendChild(label);
    }
  });
  const check = createButton({
    label: strings.plan39.checkPosition,
    className: 'plan39-check-position',
    disabled: !current,
  });
  fieldset.appendChild(check);
  return fieldset;
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
      ? activeControls.querySelector('.plan39-candidate-option[aria-pressed="true"]')?.getAttribute('data-candidate-id') ?? null
      : Array.from(activeControls.querySelectorAll('input')).find((input) => input.type === 'radio' && input.checked)?.getAttribute('data-candidate-id') ?? null;
    return candidateId ? { contextKey: currentKey, candidateId } : null;
  }

  function update(scene) {
    assertValidScene(scene);
    if (!scene.meaning.numberLine || scene.meaning.currentTask?.beat === undefined) throw new TypeError('Plan 39 number-line scene is required');
    if (scene.meaning.representationRole !== 'number-line') throw new TypeError('Plan 39 scene must be projected for the number-line representation role');
    const nextKey = previewKey(scene);
    if (currentKey !== nextKey || scene.meaning.currentTask.beat !== 'locate') previewHandle = null;
    currentScene = scene;
    currentKey = nextKey;
    root.replaceChildren();
    const heading = document.createElement('h2');
    heading.className = 'active-beat-prompt';
    heading.textContent = scene.meaning.status.episode === 'resolved'
      ? strings.plan39.resolvedPrompt
      : strings.plan39.prompt;
    root.appendChild(heading);
    const stack = document.createElement('div');
    stack.className = 'plan39-representation-stack';
    stack.appendChild(makeBar(scene, strings, view));
    const track = makeTrack(scene, strings, previewHandle?.contextKey === currentKey ? previewHandle.candidateId : null, view);
    stack.appendChild(track);
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
      activeControls.appendChild(createButton({ label: strings.plan39.continue, className: 'plan39-continue', onClick: () => dispatchAction({ type: 'acknowledge-bridge-encounter' }) }));
    } else if (scene.meaning.currentTask.beat === 'locate') {
      activeControls = makeCandidateFieldset(scene, strings, {
        previewHandle: previewHandle?.contextKey === currentKey ? previewHandle : null,
        onPreviewChange: (handle) => { previewHandle = handle; onPreviewChange(handle); },
        key: currentKey,
        view,
        updateTrack: (candidateId) => {
          const next = makeTrack(scene, strings, candidateId, view);
          replaceNode(stack, track, next);
        },
      });
      activeControls.classList.add('active-beat-controls');
      activeControls.addEventListener('click', (event) => {
        if (event.target.closest?.('.plan39-check-position')) {
          const preview = readCurrentPreview();
          if (!preview || preview.contextKey !== currentKey) return;
          const candidate = currentScene.meaning.numberLine.candidatePositions.find(({ id }) => id === preview.candidateId);
          if (!candidate) return;
          previewHandle = null;
          onPreviewChange(null);
          dispatchAction({ type: 'propose-number-line-location', proposed: candidate.form });
        }
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
      help.id = `plan39-help-${view}`;
      help.className = 'plan39-help';
      help.textContent = strings.plan39.help;
      root.appendChild(help);
    }
  }

  function refreshGeometry() {
    const stack = root?.querySelector('.plan39-representation-stack');
    if (!stack) return;
    const previous = stack.querySelector('.plan39-connector-overlay');
    if (previous) stack.removeChild(previous);
    const connector = makeAcceptedConnectorOverlay(currentScene, stack);
    if (connector) stack.appendChild(connector);
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
      previewHandle = { contextKey: currentKey, candidateId: candidate.id };
      if (view === 'visual') {
        for (const button of activeControls.querySelectorAll('.plan39-candidate-option')) button.setAttribute('aria-pressed', String(button.getAttribute('data-candidate-id') === candidate.id));
        const stack = root.querySelector('.plan39-representation-stack');
        replaceNode(stack, stack.querySelector('.plan39-track-figure'), makeTrack(currentScene, strings, candidate.id, view));
      } else {
        for (const input of activeControls.querySelectorAll('input')) if (input.type === 'radio') input.checked = input.getAttribute('data-candidate-id') === candidate.id;
      }
      const check = activeControls.querySelector('.plan39-check-position');
      if (check) check.disabled = false;
      return true;
    },
    focusControl(kind) {
      if (!root?.isConnected || !activeControls?.isConnected || !root.contains(activeControls)) return false;
      const selector = kind === 'check' ? '.plan39-check-position'
        : kind === 'finish' ? '.plan39-finish'
          : kind === 'candidate' ? (view === 'visual' ? '.plan39-candidate-option' : '[type="radio"]') : '.plan39-continue';
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
