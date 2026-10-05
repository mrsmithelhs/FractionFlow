#!/usr/bin/env node
'use strict';

/**
 * FractionFlow — Reachable Behavior Route Contract & Browser Route Matrix Runner
 *
 * Executes the declarative route matrix (tests/routes/route-matrix.json) against the
 * production-built static application in a real browser using Playwright.
 *
 * Enforces the Three Non-Negotiable Rules and Conditions A-D:
 * 1. Registered Configuration Completeness: fails if any registered condition has no row.
 * 2. Negative Control Diversity: fails if output is identical to negative control.
 * 3. Non-execution & Narrative Rejection: fails on skipped rows or unexecutable witnesses.
 * Condition A: Dispatch-fallback loophole closed; verified fast-forward witnesses & zero-dispatch paths.
 * Condition B: Declared sameness expressible & verified.
 * Condition C: Both premise routes (twelfths & twenty-fourths, both answers).
 * Condition D: Maintained browser driver (Playwright against dist/).
 */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const matrixPath = path.join(rootDir, 'tests/routes/route-matrix.json');
const validMotionModes = new Set(['standard-motion', 'reduced-motion']);
const seededPrototypeVisualDefects = Object.freeze({
  hidden: `#representation-visual .fraction-whole,
#representation-visual .gap-grid { visibility: hidden !important; }`,
  collapsed: `#representation-visual .fraction-whole,
#representation-visual .gap-grid {
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  border: 0 !important;
  overflow: hidden !important;
}
#representation-visual .bar-segment,
#representation-visual .gap-marker { display: none !important; }`,
  'erased-removal-mark': `#representation-visual .bar-segment.is-removed {
  background-color: #3976bd !important;
  background-image: none !important;
  border-color: #17457f !important;
}
#representation-visual .bar-segment.is-removed::after {
  content: none !important;
  display: none !important;
}`,
  'erased-comparison-gap-mark': `.gap-marker {
  background: white !important;
  border-color: white !important;
}`,
  'fully-clipped-representation': `#representation-visual {
  clip-path: inset(100%) !important;
}`,
});
const motionWitnessSeeds = Object.freeze({
  'no-op-keyframes': { routeId: 'ROUTE-COND-1-TRANSFORM', failure: 'no partially painted boundary was observed' },
  'half-height-new-boundary': { routeId: 'ROUTE-COND-1-TRANSFORM', failure: 'settled new boundaries did not span' },
  'disabled-motion': { routeId: 'ROUTE-COND-1-TRANSFORM', failure: 'expected one executed animation per new boundary' },
  'static-accidental-motion': { routeId: 'ROUTE-COND-2-TRANSFORM', failure: 'unexpectedly ran animation within the fraction track' },
  'reduced-accidental-motion': { routeId: 'ROUTE-REDUCED-MOTION', failure: 'unexpectedly ran animation within the fraction track' },
  'whole-bar-translation': { routeId: 'ROUTE-REPLAY-NEW-CONVERSION-COND-1', step: 12, failure: 'whole/fill document position changed during subdivision' },
});
const startingSurfaces = Object.freeze({
  'mounted-app-entry': Object.freeze({
    path: '',
    readySelector: '.fractionflow-app',
  }),
  'subtraction-takeaway-prototype': Object.freeze({
    path: 'prototypes/subtraction/index.html?mode=takeaway&fixture=0',
    readySelector: '#subtraction-prototype[data-mode="takeaway"]',
  }),
  'subtraction-comparison-prototype': Object.freeze({
    path: 'prototypes/subtraction/index.html?mode=comparison&fixture=0',
    readySelector: '#subtraction-prototype[data-mode="comparison"]',
  }),
});

function resolveStartingSurface(surfaceId) {
  return startingSurfaces[surfaceId] || null;
}

function getRouteMotionModes(route) {
  if (Array.isArray(route.motionModes)) return route.motionModes;
  return typeof route.motionMode === 'string' ? [route.motionMode] : [];
}

function expandRouteExecutions(routes) {
  return routes.flatMap((route) => getRouteMotionModes(route).map((motionMode) => ({
    route,
    motionMode,
  })));
}

function selectRoutesForRun(routes, filter) {
  if (!filter) return routes;

  const selected = new Set(routes.filter((route) => route.id.includes(filter)).map((route) => route.id));
  let changed = true;
  while (changed) {
    changed = false;
    for (const route of routes) {
      if (!selected.has(route.id) || route.negativeControl?.sameMotionMode !== true) continue;
      const targetId = route.negativeControl.targetRouteId;
      if (routes.some((candidate) => candidate.id === targetId) && !selected.has(targetId)) {
        selected.add(targetId);
        changed = true;
      }
    }
  }
  return routes.filter((route) => selected.has(route.id));
}

function routeCaptureKey(routeId, motionMode) {
  return routeId + '::' + motionMode;
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function createStaticServer() {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].replace(/^\/FractionFlow/, '');
    if (!reqPath || reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(distDir, reqPath);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Not found: ${reqPath}`);
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
}

/**
 * Validate schema and static invariants before running browser tests.
 */
async function validateMatrixIntegrity(matrix, registeredConditions) {
  const errors = [];

  if (!matrix || !Array.isArray(matrix.routes) || matrix.routes.length === 0) {
    errors.push('Route matrix must contain a non-empty "routes" array.');
    return { valid: false, errors };
  }

  const routeIds = new Set();
  const configurationsCovered = new Set();
  const validActionMethods = new Set([
    'click',
    'fill',
    'fillWithKnownSelection',
    'restoreInputType',
    'pressKey',
    'assertText',
    'focus',
    'assertFocused',
    'assert',
    'scrollIntoView',
    'clickAndObserveSubdivision',
    'clickAndObserveReplayReveal',
    'clickAndAssertBarPosition',
    'assertFreshBarLayout',
    'clickAndStartSubdivision',
    'assertNoSubdivisionMotion',
    'dispatch-fallback',
  ]);

  for (const route of matrix.routes) {
    if (!route.id) errors.push('Route missing required "id".');
    if (routeIds.has(route.id)) errors.push(`Duplicate route id: "${route.id}".`);
    routeIds.add(route.id);

    if (!route.behavior) errors.push(`Route "${route.id}" missing required "behavior".`);
    if (!route.configuration) errors.push(`Route "${route.id}" missing required "configuration".`);
    configurationsCovered.add(route.configuration);

    if (!route.startingSurface) errors.push(`Route "${route.id}" missing required "startingSurface".`);
    else if (!resolveStartingSurface(route.startingSurface)) {
      errors.push(`Route "${route.id}" has unknown startingSurface "${route.startingSurface}".`);
    }
    if (!route.viewport || !route.viewport.width || !route.viewport.height) {
      errors.push(`Route "${route.id}" missing explicit "viewport" geometry.`);
    }
    const hasMotionMode = typeof route.motionMode === 'string';
    const hasMotionModes = Object.hasOwn(route, 'motionModes');
    if (hasMotionMode && hasMotionModes) {
      errors.push(`Route "${route.id}" must use either "motionMode" or "motionModes", not both.`);
    } else if (!hasMotionMode && !hasMotionModes) {
      errors.push(`Route "${route.id}" missing required motion mode declaration.`);
    } else {
      const modes = getRouteMotionModes(route);
      if (modes.length === 0) {
        errors.push(`Route "${route.id}" must declare at least one motion mode.`);
      }
      if (new Set(modes).size !== modes.length) {
        errors.push(`Route "${route.id}" repeats a motion mode.`);
      }
      for (const mode of modes) {
        if (!validMotionModes.has(mode)) {
          errors.push(`Route "${route.id}" has invalid motion mode "${mode}".`);
        }
      }
    }
    if (!['browser', 'harness'].includes(route.witness)) {
      errors.push(`Route "${route.id}" has invalid witness "${route.witness}".`);
    }

    // Rule 3: No skipped rows, no unexecutable narrative witnesses
    if (route.skipped || route.notRun) {
      errors.push(`FATAL (Rule 3): Route "${route.id}" is marked skipped/notRun.`);
    }
    if (!Array.isArray(route.actions) || route.actions.length === 0) {
      errors.push(`FATAL (Rule 3): Route "${route.id}" lacks concrete actions.`);
    }
    if (!route.expect || !route.expect.assertions || route.expect.assertions.length === 0) {
      errors.push(`FATAL (Rule 3): Route "${route.id}" lacks executable expect assertions.`);
    }

    // Known defect schema validation
    if (route.knownDefect !== undefined && route.knownDefect !== null) {
      if (typeof route.knownDefect !== 'object' || Array.isArray(route.knownDefect)) {
        errors.push(`Route "${route.id}" has invalid "knownDefect": must be an object.`);
      } else {
        if (!route.knownDefect.id || typeof route.knownDefect.id !== 'string' || !route.knownDefect.id.trim()) {
          errors.push(`Route "${route.id}" has "knownDefect" missing required non-empty "id".`);
        }
        if (!route.knownDefect.description || typeof route.knownDefect.description !== 'string' || !route.knownDefect.description.trim()) {
          errors.push(`Route "${route.id}" has "knownDefect" missing required non-empty "description".`);
        }
        if (!route.knownDefect.trackedIn || typeof route.knownDefect.trackedIn !== 'string' || !route.knownDefect.trackedIn.trim()) {
          errors.push(`Route "${route.id}" has "knownDefect" missing required non-empty "trackedIn".`);
        }
      }
    }

    // Condition A: Dispatch-fallback enforcement
    for (const action of route.actions || []) {
      if (!validActionMethods.has(action.method)) {
        errors.push(`Route "${route.id}" step ${action.step} has unknown action method "${action.method}".`);
      }
      if (['clickAndObserveSubdivision', 'clickAndStartSubdivision', 'clickAndObserveReplayReveal'].includes(action.method)
        && (!action.target || !action.container)) {
        errors.push(`Route "${route.id}" step ${action.step} subdivision action requires a mounted "target" and "container".`);
      }
      if (action.method === 'clickAndAssertBarPosition' && (!action.target || !action.container
        || !Number.isInteger(action.numerator) || !Number.isInteger(action.denominator))) {
        errors.push(`Route "${route.id}" step ${action.step} document-position click requires a mounted target/container and integer endpoint.`);
      }
      if (action.method === 'assertFreshBarLayout' && (!action.container || !Number.isFinite(action.expectedHeight))) {
        errors.push(`Route "${route.id}" step ${action.step} fresh-bar layout assertion requires a container and expectedHeight.`);
      }
      if (action.method === 'clickAndObserveReplayReveal'
        && (!action.responseInput || !Number.isInteger(action.numerator) || !Number.isInteger(action.denominator))) {
        errors.push(`Route "${route.id}" step ${action.step} reduced Replay witness requires responseInput and integer endpoint numerator/denominator.`);
      }
      if (action.method === 'fillWithKnownSelection'
        && (!action.value || !Number.isInteger(action.selectionStart) || !Number.isInteger(action.selectionEnd)
          || action.selectionStart < 0 || action.selectionEnd < action.selectionStart
          || action.selectionEnd > String(action.value).length)) {
        errors.push(`Route "${route.id}" step ${action.step} known-selection fill requires a non-empty value and an in-range selection.`);
      }
      if (action.method === 'restoreInputType' && !['number', 'text'].includes(action.value)) {
        errors.push(`Route "${route.id}" step ${action.step} input-type restoration supports only number or text.`);
      }
      if (action.method === 'clickAndObserveSubdivision' && action.interruptReducedMotion
        && route.motionMode !== 'standard-motion') {
        errors.push(`Route "${route.id}" step ${action.step} may interrupt with reduced motion only from standard motion.`);
      }
      if (action.method === 'clickAndObserveSubdivision' && action.requireConcurrentMotion
        && (!action.concurrentContainer || action.interruptReducedMotion)) {
        errors.push(`Route "${route.id}" step ${action.step} concurrent subdivision evidence requires a concurrent container and cannot interrupt motion.`);
      }
      if (action.method === 'clickAndObserveSubdivision' && action.forbidConcurrentMotion
        && !action.concurrentContainer) {
        errors.push(`Route "${route.id}" step ${action.step} no-restart subdivision evidence requires a concurrent container.`);
      }
      if (action.method === 'assertNoSubdivisionMotion' && !action.container) {
        errors.push(`Route "${route.id}" step ${action.step} static-motion assertion requires a mounted "container".`);
      }
      if (action.method === 'dispatch-fallback') {
        if (!action.reason) {
          errors.push(`FATAL (Condition A): Route "${route.id}" step ${action.step} has dispatch-fallback without a "reason".`);
        } else if (action.reason === 'fast-forward') {
          if (!action.witnessRouteId) {
            errors.push(`FATAL (Condition A): Route "${route.id}" step ${action.step} fast-forward must specify "witnessRouteId".`);
          }
        }
      }
    }
  }

  for (const route of matrix.routes) {
    if (!route.negativeControl) continue;
    const target = matrix.routes.find((candidate) => candidate.id === route.negativeControl.targetRouteId);
    if (!target) {
      if (route.negativeControl.sameMotionMode === true) {
        errors.push(`Route "${route.id}" negative control references missing route "${route.negativeControl.targetRouteId}".`);
      }
      continue;
    }
    if (route.negativeControl.sameMotionMode === true) {
      const targetModes = getRouteMotionModes(target);
      for (const mode of getRouteMotionModes(route)) {
        if (!targetModes.includes(mode)) {
          errors.push(`Route "${route.id}" requires negative control "${target.id}" under "${mode}", but that mode is not declared.`);
        }
      }
    }
  }

  // Cross-reference dispatch-fallback witness routes
  for (const route of matrix.routes) {
    for (const action of route.actions || []) {
      if (action.method === 'dispatch-fallback' && action.reason === 'fast-forward') {
        const witness = matrix.routes.find((r) => r.id === action.witnessRouteId);
        if (!witness) {
          errors.push(`FATAL (Condition A): Route "${route.id}" references non-existent witnessRouteId "${action.witnessRouteId}".`);
        } else {
          const hasDispatch = witness.actions.some((a) => a.method === 'dispatch-fallback');
          if (hasDispatch) {
            errors.push(`FATAL (Condition A): Witness route "${action.witnessRouteId}" referenced by "${route.id}" itself contains dispatch-fallback.`);
          }
        }
      }
    }
  }

  // Condition A: Verify at least one visual and one linear zero-dispatch traversal to resolve
  const zeroDispatchVisual = matrix.routes.find((r) => (
    r.id === 'ROUTE-TRAVERSAL-VISUAL-NO-DISPATCH' &&
    r.actions.every((a) => a.method !== 'dispatch-fallback')
  ));
  if (!zeroDispatchVisual) {
    errors.push('FATAL (Condition A): Missing visual full-traversal route with zero dispatch fallback.');
  }

  const zeroDispatchLinear = matrix.routes.find((r) => (
    r.id === 'ROUTE-TRAVERSAL-LINEAR-NO-DISPATCH' &&
    r.actions.every((a) => a.method !== 'dispatch-fallback')
  ));
  if (!zeroDispatchLinear) {
    errors.push('FATAL (Condition A): Missing linear full-traversal route with zero dispatch fallback.');
  }

  // Rule 1: Every registered configuration must have at least one route witness
  if (registeredConditions && Array.isArray(registeredConditions)) {
    for (const condition of registeredConditions) {
      if (!configurationsCovered.has(condition.id)) {
        errors.push(`FATAL (Rule 1): Registered configuration "${condition.id}" has no declared route witness in the matrix.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Execute a single action against Playwright page.
 */
async function observeSubdivision(page, action, routeId) {
  const evidenceId = `${routeId}:${action.step}`;
  const container = page.locator(action.container);
  await container.evaluate((root, options) => {
    const track = root.querySelector('.fraction-bar-track');
    const fill = track?.querySelector('.fraction-bar-fill');
    const boundaryLayer = track?.querySelector('.fraction-bar-boundary-layer');
    const episode = root.closest('.app-episode');
    const question = episode?.querySelector('.active-beat-prompt');
    const controls = episode?.querySelector('.active-beat-controls');
    const whole = track?.getBoundingClientRect();
    const fillBox = fill?.getBoundingClientRect();
    if (!track || !fill || !boundaryLayer || !whole || !fillBox || !question || !controls) {
      throw new Error('persistent track, fill, question, and active controls must be mounted before the learner action');
    }
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return {
        x: box.x,
        y: box.y,
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    };
    const relativeRect = (element, ancestor) => {
      const box = rect(element);
      const base = rect(ancestor);
      return { ...box, x: box.x - base.x, y: box.y - base.y };
    };
    const documentRect = (element) => {
      const box = rect(element);
      return { ...box, x: box.x + window.scrollX, y: box.y + window.scrollY };
    };
    window.__fractionFlowMotionWitnesses ||= new Map();
    const boundaries = [...track.querySelectorAll('.fraction-bar-boundary')];
    const record = {
      root,
      track,
      fill,
      boundaryLayer,
      rootBox: rect(root),
      boundaries: new Map(boundaries.map((element) => [element.dataset.boundaryKey, element])),
      before: {
        whole: { x: whole.x, y: whole.y, width: whole.width, height: whole.height },
        fill: { x: fillBox.x, y: fillBox.y, width: fillBox.width, height: fillBox.height },
        documentWhole: documentRect(track),
        documentFill: documentRect(fill),
        relativeWhole: relativeRect(track, root),
        relativeFill: relativeRect(fill, root),
        layout: {
          question: rect(question),
          controls: rect(controls),
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        },
        boundaryCount: boundaries.length,
        boundaryGeometry: new Map(boundaries.map((element) => {
          const box = element.getBoundingClientRect();
          return [element.dataset.boundaryKey, relativeRect(element, root)];
        })),
      },
    };
    window.__fractionFlowMotionWitnesses.set(options.id, record);
    if (options.seed === 'no-op-keyframes' || options.seed === 'disabled-motion') {
      const originalAnimate = Element.prototype.animate;
      Element.prototype.animate = function animateWithWitnessSeed(keyframes, timing) {
        if (this.matches?.('.fraction-bar-boundary-new')) {
          if (options.seed === 'disabled-motion') {
            return originalAnimate.call(this, keyframes, { ...timing, duration: 0 });
          }
          return originalAnimate.call(this, [
            { transform: 'scaleY(1)' },
            { transform: 'scaleY(1)' },
          ], timing);
        }
        return originalAnimate.call(this, keyframes, timing);
      };
    }
  }, { id: evidenceId, seed: action.motionWitnessSeed || null });

  // This is the same mounted control a learner activates. The observer is attached
  // to the real page; it does not call or configure a renderer.
  await page.locator(action.target).click();

  const started = await container.evaluate((root, options) => {
    const records = window.__fractionFlowMotionWitnesses;
    const previous = records?.get(options.id);
    if (!previous) throw new Error('missing pre-action DOM identity witness');
    const track = root.querySelector('.fraction-bar-track');
    const fill = track?.querySelector('.fraction-bar-fill');
    if (root !== previous.root || track !== previous.track || fill !== previous.fill) {
      throw new Error('bar root, track, or shaded-fill element was replaced by the conversion');
    }
    const boundaries = [...track.querySelectorAll('.fraction-bar-boundary')];
    const existing = [...previous.boundaries.entries()];
    const replacedExisting = existing.filter(([key, element]) => (
      !boundaries.some((current) => current === element && current.dataset.boundaryKey === key)
    ));
    if (replacedExisting.length > 0) {
      throw new Error(`existing partition boundary nodes were replaced: ${replacedExisting.map(([key]) => key).join(', ')}`);
    }
    const newBoundaries = boundaries.filter((element) => !existing.some(([, old]) => old === element));
    if (newBoundaries.length === 0) throw new Error('the learner action added no subdivision boundaries');
    const animations = newBoundaries.flatMap((element) => element.getAnimations());
    if (animations.length !== newBoundaries.length) {
      throw new Error(`expected one executed animation per new boundary; found ${animations.length} for ${newBoundaries.length} boundaries`);
    }
    const allAnimations = track.getAnimations({ subtree: true });
    if (allAnimations.length !== animations.length
      || allAnimations.some((animation) => !newBoundaries.includes(animation.effect?.target))) {
      throw new Error('motion ran on a visual element other than a newly introduced boundary');
    }
    if (options.seed === 'whole-bar-translation') {
      root.style.transform = 'translateX(12px)';
    }
    previous.newBoundaries = newBoundaries;
    previous.animations = animations;
    const concurrentContainer = options.concurrentContainer
      ? document.querySelector(options.concurrentContainer)
      : null;
    if ((options.requireConcurrentMotion || options.forbidConcurrentMotion) && !concurrentContainer) {
      throw new Error(`concurrent subdivision witness container was missing: ${options.concurrentContainer}`);
    }
    const concurrentAnimations = concurrentContainer
      ? [...concurrentContainer.querySelectorAll('.fraction-bar-boundary')]
        .flatMap((element) => element.getAnimations())
        .filter((animation) => animation.playState === 'running').length
      : 0;
    previous.concurrentAnimations = concurrentAnimations;
    if (options.requireConcurrentMotion && concurrentAnimations === 0) {
      throw new Error(`expected the preceding submission's effect to remain active during the rapid next submission`);
    }
    if (options.forbidConcurrentMotion && concurrentAnimations !== 0) {
      throw new Error(`an established conversion restarted while the learner accepted a different conversion (${concurrentAnimations} animations)`);
    }
    return { existingBoundaryCount: existing.length, newBoundaryCount: newBoundaries.length, concurrentAnimations };
  }, {
    id: evidenceId,
    seed: action.motionWitnessSeed || null,
    concurrentContainer: action.concurrentContainer || null,
    requireConcurrentMotion: action.requireConcurrentMotion === true,
    forbidConcurrentMotion: action.forbidConcurrentMotion === true,
  });

  const intermediate = await container.evaluate(async (root, options) => {
    const previous = window.__fractionFlowMotionWitnesses?.get(options.id);
    if (!previous) throw new Error('missing in-flight DOM identity witness');
    const track = root.querySelector('.fraction-bar-track');
    const fill = track?.querySelector('.fraction-bar-fill');
    const episode = root.closest('.app-episode');
    const question = episode?.querySelector('.active-beat-prompt');
    const controls = episode?.querySelector('.active-beat-controls');
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return {
        x: box.x,
        y: box.y,
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    };
    const relativeRect = (element, ancestor) => {
      const box = rect(element);
      const base = rect(ancestor);
      return { ...box, x: box.x - base.x, y: box.y - base.y };
    };
    const documentRect = (element) => {
      const box = rect(element);
      return { ...box, x: box.x + window.scrollX, y: box.y + window.scrollY };
    };
    const measureLayout = () => {
      const currentQuestion = root.closest('.app-episode')?.querySelector('.active-beat-prompt');
      const currentControls = root.closest('.app-episode')?.querySelector('.active-beat-controls');
      if (!currentQuestion || !currentControls) return null;
      return {
        question: rect(currentQuestion),
        controls: rect(currentControls),
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    };
    if (!question || !controls) throw new Error('question and active response control bounds are missing during subdivision');
    const boundaryLayer = track.querySelector('.fraction-bar-boundary-layer');
    if (!boundaryLayer) throw new Error('inner boundary layer is missing during subdivision');
    const interiorHeight = rect(boundaryLayer).height;
    let sample = null;
    for (let frame = 0; frame < 24 && !sample; frame += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      for (const animation of previous.animations) {
        const progress = animation.effect?.getComputedTiming().progress;
        const target = animation.effect?.target;
        if (target && Number.isFinite(progress) && progress > 0.15 && progress < 0.9) {
          const boundary = rect(target);
          if (boundary.height > 0) {
            const layout = measureLayout();
            if (!layout) throw new Error('question and active response control bounds disappeared during subdivision');
            sample = {
              progress,
              boundary,
              whole: rect(track),
              fill: rect(fill),
              rootBox: rect(root),
              relativeWhole: relativeRect(track, root),
              relativeFill: relativeRect(fill, root),
              documentWhole: documentRect(track),
              documentFill: documentRect(fill),
              layout,
            };
            break;
          }
        }
      }
    }
    if (!sample || sample.boundary.height < 1 || sample.boundary.height > interiorHeight - 1) {
      throw new Error('no partially painted boundary was observed during the executed animation');
    }
    if (options.seed === 'half-height-new-boundary') {
      previous.newBoundaries[0].style.bottom = '50%';
    }
    return { ...sample, interiorHeight };
  }, { id: evidenceId, seed: action.motionWitnessSeed || null });

  let interrupted = null;
  let restored = null;
  if (action.interruptReducedMotion) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    interrupted = await container.evaluate(async (root) => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const track = root.querySelector('.fraction-bar-track');
      const fill = track?.querySelector('.fraction-bar-fill');
      const rect = (element) => {
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      };
      return {
        reducedMotionTrack: track.classList.contains('reduced-motion'),
        activeAnimations: track.getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length,
        whole: rect(track),
        fill: rect(fill),
        denominator: track.dataset.denominator,
        numerator: track.dataset.numerator,
      };
    });
    if (!interrupted.reducedMotionTrack || interrupted.activeAnimations !== 0) {
      throw new Error(`switching to reduced motion failed to cancel and settle the effect: ${JSON.stringify(interrupted)}`);
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    restored = await container.evaluate(async (root) => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const track = root.querySelector('.fraction-bar-track');
      return {
        reducedMotionTrack: track.classList.contains('reduced-motion'),
        activeAnimations: track.getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length,
        denominator: track.dataset.denominator,
        numerator: track.dataset.numerator,
      };
    });
    if (restored.reducedMotionTrack || restored.activeAnimations !== 0
      || restored.denominator !== interrupted.denominator
      || restored.numerator !== interrupted.numerator) {
      throw new Error(`restoring standard motion replayed or changed the settled endpoint: ${JSON.stringify(restored)}`);
    }
  } else {
    await container.evaluate(async (root) => {
      let running = true;
      for (let frame = 0; frame < 90 && running; frame += 1) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const track = root.querySelector('.fraction-bar-track');
        running = track.getAnimations({ subtree: true })
          .some((animation) => animation.playState === 'running');
      }
      if (running) throw new Error('subdivision animation did not settle within 90 rendered frames');
    });
  }

  const finalState = await container.evaluate((root, evidence) => {
    const records = window.__fractionFlowMotionWitnesses;
    const previous = records?.get(evidence.id);
    if (!previous) throw new Error('missing settled DOM identity witness');
    const track = root.querySelector('.fraction-bar-track');
    const fill = track?.querySelector('.fraction-bar-fill');
    const boundaryLayer = track?.querySelector('.fraction-bar-boundary-layer');
    if (root !== previous.root || track !== previous.track || fill !== previous.fill
      || boundaryLayer !== previous.boundaryLayer || !boundaryLayer?.isConnected) {
      throw new Error('bar root, track, or shaded-fill element was replaced before the effect settled');
    }
    const boundaries = [...track.querySelectorAll('.fraction-bar-boundary')];
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return {
        x: box.x,
        y: box.y,
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height,
      };
    };
    const relativeRect = (element, ancestor) => {
      const box = rect(element);
      const base = rect(ancestor);
      return { ...box, x: box.x - base.x, y: box.y - base.y };
    };
    const documentRect = (element) => {
      const box = rect(element);
      return { ...box, x: box.x + window.scrollX, y: box.y + window.scrollY };
    };
    const rectDelta = (beforeBox, afterBox) => Object.fromEntries(
      ['x', 'y', 'width', 'height'].map((key) => [key, Math.abs(beforeBox[key] - afterBox[key])]),
    );
    const whole = rect(track);
    const fillBox = rect(fill);
    const boundaryLayerBox = rect(boundaryLayer);
    const episode = root.closest('.app-episode');
    const question = episode?.querySelector('.active-beat-prompt');
    const activeControls = episode?.querySelector('.active-beat-controls');
    if (!question || !activeControls) {
      throw new Error('question and active response control bounds are missing after subdivision');
    }
    const layout = {
      question: rect(question),
      controls: rect(activeControls),
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
    const visibleInViewport = (box, height) => box.top >= 0 && box.bottom <= height;
    const newBoundaries = previous.newBoundaries;
    const newBoundaryGeometry = newBoundaries.map((element) => {
      const box = rect(element);
      const [indexText, denominatorText] = element.dataset.boundaryKey.split('/');
      const index = Number(indexText);
      const denominator = Number(denominatorText);
      const expectedCenter = boundaryLayerBox.left + (index / denominator) * boundaryLayerBox.width;
      return {
        key: element.dataset.boundaryKey,
        connected: element.isConnected && boundaryLayer.contains(element),
        rect: box,
        expectedCenter,
        centerDelta: Math.abs((box.left + box.width / 2) - expectedCenter),
        topDelta: Math.abs(box.top - boundaryLayerBox.top),
        bottomDelta: Math.abs(box.bottom - boundaryLayerBox.bottom),
        heightDelta: Math.abs(box.height - boundaryLayerBox.height),
      };
    });
    const settled = {
      whole,
      fill: fillBox,
      boundaryLayer: boundaryLayerBox,
      newBoundaryGeometry,
      activeAnimations: track.getAnimations({ subtree: true })
        .filter((animation) => animation.playState === 'running').length,
      denominator: track.dataset.denominator,
      numerator: track.dataset.numerator,
    };
    const taskLayout = {
      before: previous.before.layout,
      intermediate: evidence.intermediate.layout,
      settled: layout,
    };
    const questionAndControlsVisible = [taskLayout.before, taskLayout.intermediate, taskLayout.settled]
      .every((frame) => visibleInViewport(frame.question, frame.viewportHeight)
        && visibleInViewport(frame.controls, frame.viewportHeight));
    const relativeWholeBefore = previous.before.relativeWhole;
    const relativeFillBefore = previous.before.relativeFill;
    const anchorDrift = {
      wholeIntermediate: rectDelta(relativeWholeBefore, evidence.intermediate.relativeWhole),
      fillIntermediate: rectDelta(relativeFillBefore, evidence.intermediate.relativeFill),
      wholeSettled: rectDelta(relativeWholeBefore, relativeRect(track, root)),
      fillSettled: rectDelta(relativeFillBefore, relativeRect(fill, root)),
    };
    const documentPositionDrift = {
      wholeIntermediate: rectDelta(previous.before.documentWhole, evidence.intermediate.documentWhole),
      fillIntermediate: rectDelta(previous.before.documentFill, evidence.intermediate.documentFill),
      wholeSettled: rectDelta(previous.before.documentWhole, documentRect(track)),
      fillSettled: rectDelta(previous.before.documentFill, documentRect(fill)),
    };
    const existing = [...previous.boundaries.entries()];
    const existingBoundaryDrifts = existing.map(([key, element]) => ({
      key,
      delta: rectDelta(previous.before.boundaryGeometry.get(key), relativeRect(element, root)),
      activeAnimations: element.getAnimations().filter((animation) => animation.playState === 'running').length,
    }));
    const driftWithinTolerance = (drift) => Object.values(drift).every((delta) => delta <= 0.5);
    records.delete(evidence.id);
    return {
      before: {
        ...previous.before,
        boundaryGeometry: [...previous.before.boundaryGeometry.entries()].map(([key, geometry]) => ({ key, ...geometry })),
      },
      intermediate: evidence.intermediate,
      settled,
      taskLayout,
      questionAndControlsVisible,
      anchorDrift,
      documentPositionDrift,
      existingBoundaryCount: existing.length,
      newBoundaryCount: newBoundaries.length,
      newBoundariesSpanGrid: newBoundaryGeometry.length > 0 && newBoundaryGeometry.every((entry) => (
        entry.connected && entry.centerDelta <= 0.75 && entry.topDelta <= 0.5
        && entry.bottomDelta <= 0.5 && entry.heightDelta <= 0.5
      )),
      concurrentAnimations: previous.concurrentAnimations,
      interrupted: evidence.interrupted,
      restored: evidence.restored,
      existingBoundaryDrifts,
      existingBoundariesStable: existingBoundaryDrifts.every((entry) => (
        driftWithinTolerance(entry.delta) && entry.activeAnimations === 0
      )),
      stableAnchors: Object.values(anchorDrift).every(driftWithinTolerance),
      conservedDocumentPosition: Object.values(documentPositionDrift).every(driftWithinTolerance),
    };
  }, { id: evidenceId, intermediate, interrupted, restored });

  if (!finalState.conservedDocumentPosition) {
    throw new Error(`whole/fill document position changed during subdivision: ${JSON.stringify({ drift: finalState.documentPositionDrift, before: { whole: finalState.before.documentWhole, fill: finalState.before.documentFill }, intermediate: { whole: finalState.intermediate.documentWhole, fill: finalState.intermediate.documentFill }, settled: { whole: finalState.settled.whole, fill: finalState.settled.fill, scrollX: finalState.taskLayout.settled.scrollX, scrollY: finalState.taskLayout.settled.scrollY } })}`);
  }
  if (!finalState.stableAnchors) {
    throw new Error(`bar outline or shaded amount moved during subdivision: ${JSON.stringify(finalState)}`);
  }
  if (!finalState.existingBoundariesStable) {
    throw new Error(`an existing boundary moved or animated during subdivision: ${JSON.stringify(finalState)}`);
  }
  if (finalState.settled.activeAnimations !== 0) {
    throw new Error(`subdivision effect did not settle: ${JSON.stringify(finalState)}`);
  }
  if (!finalState.newBoundariesSpanGrid) {
    throw new Error(`settled new boundaries did not span the connected inner layer at their supplied grid positions: ${JSON.stringify(finalState.settled.newBoundaryGeometry)}`);
  }
  if (!finalState.questionAndControlsVisible) {
    throw new Error(`question or active response controls left the visible viewport during subdivision: ${JSON.stringify(finalState.taskLayout)}`);
  }
  action.motionEvidence = finalState;
  console.log(`  Motion witness ${evidenceId}: ${JSON.stringify(finalState)}`);
}

async function executeAction(page, action, routeId) {
  switch (action.method) {
    case 'click':
      await page.locator(action.target).click();
      break;

    case 'fill':
      await page.locator(action.target).fill(String(action.value));
      break;

    case 'fillWithKnownSelection': {
      const input = page.locator(action.target);
      await input.evaluate((element) => {
        // Number inputs do not expose text selection; this browser-only witness
        // switches the mounted field to text so value and selection continuity
        // can be measured through the real Replay button click.
        if (element.type === 'number') element.type = 'text';
      });
      await input.fill(String(action.value));
      await input.evaluate((element, selection) => {
        element.focus();
        element.setSelectionRange(selection.start, selection.end);
      }, { start: action.selectionStart, end: action.selectionEnd });
      const selection = await input.evaluate((element) => ({
        value: element.value,
        start: element.selectionStart,
        end: element.selectionEnd,
      }));
      if (selection.value !== String(action.value)
        || selection.start !== action.selectionStart
        || selection.end !== action.selectionEnd) {
        throw new Error(`Route "${routeId}" step ${action.step} failed to establish the requested response value and selection.`);
      }
      break;
    }

    case 'restoreInputType': {
      const input = page.locator(action.target);
      await input.evaluate((element, type) => { element.type = type; }, String(action.value));
      const restoredType = await input.getAttribute('type');
      if (restoredType !== String(action.value)) {
        throw new Error(`Route "${routeId}" step ${action.step} did not restore the response input type.`);
      }
      break;
    }

    case 'pressKey':
      await page.locator(action.target).press(action.value);
      break;

    case 'assertText': {
      const actual = await page.locator(action.target).first().textContent();
      if (!actual || !actual.includes(action.value)) {
        throw new Error(
          `Route "${routeId}" expected "${action.target}" to contain "${action.value}" after step ${action.step}; observed "${actual}".`,
        );
      }
      break;
    }

    case 'focus':
      await page.locator(action.target).focus();
      break;

    case 'scrollIntoView':
      await page.locator(action.target).scrollIntoViewIfNeeded();
      break;

    case 'assertFocused': {
      const target = page.locator(action.target);
      const count = await target.count();
      if (count === 0 || !await target.first().evaluate((element) => element === document.activeElement)) {
        throw new Error(`Route "${routeId}" expected "${action.target}" to have focus after step ${action.step}.`);
      }
      break;
    }

    case 'assert':
      await verifyAssertions(page, action.assertions || [], routeId);
      break;

    case 'clickAndObserveSubdivision':
      await observeSubdivision(page, action, routeId);
      break;

    case 'clickAndObserveReplayReveal': {
      const container = page.locator(action.container);
      const evidenceId = `${routeId}:${action.step}`;
      const before = await container.evaluate((root, options) => {
        const track = root.querySelector('.fraction-bar-track');
        const fill = track?.querySelector('.fraction-bar-fill');
        const layer = track?.querySelector('.fraction-bar-boundary-layer');
        const input = options.responseInput ? document.querySelector(options.responseInput) : null;
        if (!track || !fill || !layer || !input) {
          throw new Error('reduced Replay requires persistent anchors and the mounted response input');
        }
        const box = (element) => {
          const rect = element.getBoundingClientRect();
          const rootRect = root.getBoundingClientRect();
          return {
            x: rect.x - rootRect.x,
            y: rect.y - rootRect.y,
            width: rect.width,
            height: rect.height,
          };
        };
        const witness = {
          root,
          track,
          fill,
          layer,
          boundaries: [...track.querySelectorAll('.fraction-bar-boundary')],
          trackRect: box(track),
          fillRect: box(fill),
          layerRect: box(layer),
          boundaryRects: new Map([...track.querySelectorAll('.fraction-bar-boundary')]
          .map((boundary) => [boundary.dataset.boundaryKey, box(boundary)])),
          input,
          revealButton: document.querySelector(options.target),
          inputValue: input.value,
          selectionStart: input.selectionStart,
          selectionEnd: input.selectionEnd,
          responseInputFocused: document.activeElement === input,
          focusedElement: document.activeElement,
        };
        witness.controlFocusedDuringClick = false;
        witness.focusClickObserver = (event) => {
          if (event.target !== witness.revealButton) return;
          witness.controlFocusedDuringClick = document.activeElement === witness.revealButton;
          document.removeEventListener('click', witness.focusClickObserver, true);
        };
        document.addEventListener('click', witness.focusClickObserver, true);
        window.__fractionFlowReplayWitnesses ||= new Map();
        window.__fractionFlowReplayWitnesses.set(options.id, witness);
        return {
          inputValue: witness.inputValue,
          selectionStart: witness.selectionStart,
          selectionEnd: witness.selectionEnd,
          inputFocusedBeforeClick: witness.responseInputFocused,
          controlFocusedDuringClick: witness.controlFocusedDuringClick,
          oldBoundaryCount: witness.boundaries.length,
        };
      }, { responseInput: action.responseInput, target: action.target, id: evidenceId });
      await page.locator(action.target).click();
      const result = await container.evaluate(async (root, options) => {
        const previous = window.__fractionFlowReplayWitnesses?.get(options.id);
        if (!previous) throw new Error('missing reduced Replay anchor and input witness');
        const inspect = (label) => {
          const track = root.querySelector('.fraction-bar-track');
          const fill = track?.querySelector('.fraction-bar-fill');
          const layer = track?.querySelector('.fraction-bar-boundary-layer');
          if (root !== previous.root || track !== previous.track || fill !== previous.fill
            || layer !== previous.layer || !layer?.isConnected) {
            throw new Error(`reduced Replay ${label} replaced the bar root, track, fill, or boundary layer`);
          }
          const boundaries = [...track.querySelectorAll('.fraction-bar-boundary')];
          if (!previous.boundaries.every((boundary) => boundaries.includes(boundary))) {
            throw new Error(`reduced Replay ${label} replaced an existing boundary`);
          }
          const input = document.querySelector(options.responseInput);
          if (input !== previous.input || !input?.isConnected
            || input.value !== previous.inputValue
            || input.selectionStart !== previous.selectionStart
            || input.selectionEnd !== previous.selectionEnd
            || !document.activeElement?.isConnected) {
            throw new Error(`reduced Replay ${label} changed the response input or value/selection continuity, or left focus disconnected`);
          }
          if (!previous.controlFocusedDuringClick) {
            throw new Error(`reduced Replay ${label} did not focus Show new parts during its real click`);
          }
          const layerBox = layer.getBoundingClientRect();
          const box = (element) => {
            const rect = element.getBoundingClientRect();
            const rootRect = root.getBoundingClientRect();
            return {
              x: rect.x - rootRect.x,
              y: rect.y - rootRect.y,
              width: rect.width,
              height: rect.height,
            };
          };
          const geometryDelta = (before, after) => Object.fromEntries(
            ['x', 'y', 'width', 'height'].map((key) => [key, Math.abs(before[key] - after[key])]),
          );
          const anchorDrift = {
            track: geometryDelta(previous.trackRect, box(track)),
            fill: geometryDelta(previous.fillRect, box(fill)),
            layer: geometryDelta(previous.layerRect, box(layer)),
          };
          const oldBoundaryDrifts = previous.boundaries.map((boundary) => ({
            key: boundary.dataset.boundaryKey,
            delta: geometryDelta(previous.boundaryRects.get(boundary.dataset.boundaryKey), box(boundary)),
          }));
          const stable = [...Object.values(anchorDrift), ...oldBoundaryDrifts.map((entry) => entry.delta)]
            .every((drift) => Object.values(drift).every((delta) => delta <= 0.5));
          if (!stable) {
            throw new Error(`reduced Replay moved the persistent track, shaded extent, layer, or an existing boundary: ${JSON.stringify({ anchorDrift, oldBoundaryDrifts })}`);
          }
          const boundaryGeometry = boundaries.map((boundary) => {
            const box = boundary.getBoundingClientRect();
            const [indexText, denominatorText] = boundary.dataset.boundaryKey.split('/');
            const expectedCenter = layerBox.left + (Number(indexText) / Number(denominatorText)) * layerBox.width;
            return {
              key: boundary.dataset.boundaryKey,
              connected: boundary.isConnected && layer.contains(boundary),
              heightDelta: Math.abs(box.height - layerBox.height),
              topDelta: Math.abs(box.top - layerBox.top),
              bottomDelta: Math.abs(box.bottom - layerBox.bottom),
              centerDelta: Math.abs((box.left + box.width / 2) - expectedCenter),
            };
          });
          const runningAnimations = track.getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running').length;
          if (track.dataset.numerator !== String(options.numerator)
            || track.dataset.denominator !== String(options.denominator)) {
            throw new Error(`reduced Replay ${label} did not reach ${options.numerator}/${options.denominator}: ${track.dataset.numerator}/${track.dataset.denominator}`);
          }
          if (root.querySelector('.fraction-bar-in-place-replay') || runningAnimations !== 0) {
            throw new Error(`reduced Replay ${label} left stale replay controls or running effects (${runningAnimations})`);
          }
          if (boundaryGeometry.length !== Number(options.denominator) - 1
            || !boundaryGeometry.every((entry) => entry.connected && entry.heightDelta <= 0.5
              && entry.topDelta <= 0.5 && entry.bottomDelta <= 0.5 && entry.centerDelta <= 0.75)) {
            throw new Error(`reduced Replay ${label} geometry did not settle at its endpoint: ${JSON.stringify(boundaryGeometry)}`);
          }
          return {
            boundaryGeometry,
            anchorDrift,
            oldBoundaryDrifts,
            runningAnimations,
            numerator: track.dataset.numerator,
            denominator: track.dataset.denominator,
            inputValue: input.value,
            selectionStart: input.selectionStart,
            selectionEnd: input.selectionEnd,
            inputFocusedBeforeClick: previous.responseInputFocused,
            controlFocusedDuringClick: previous.controlFocusedDuringClick,
            activeElement: {
              tagName: document.activeElement?.tagName || null,
              className: String(document.activeElement?.className || ''),
              connected: Boolean(document.activeElement?.isConnected),
            },
          };
        };
        const immediate = inspect('immediately after click');
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const settled = inspect('after two paint frames');
        return {
          rootPreserved: true,
          trackPreserved: true,
          fillPreserved: true,
          boundaryLayerPreserved: true,
          oldBoundaryCount: previous.boundaries.length,
          newBoundaryCount: settled.boundaryGeometry.length - options.oldBoundaryCount,
          immediate,
          settled,
          boundaryGeometry: settled.boundaryGeometry,
          runningAnimations: settled.runningAnimations,
          numerator: settled.numerator,
          denominator: settled.denominator,
          responseInputPreserved: true,
          inputFocusedBeforeClick: options.inputFocusedBeforeClick,
          controlFocusedDuringClick: settled.controlFocusedDuringClick,
          focusAfterClick: settled.activeElement,
          focusedElementRemainsConnected: document.activeElement.isConnected,
          inputValue: settled.inputValue,
          selectionStart: settled.selectionStart,
          selectionEnd: settled.selectionEnd,
        };
      }, {
        id: evidenceId,
        responseInput: action.responseInput,
        numerator: action.numerator,
        denominator: action.denominator,
        oldBoundaryCount: before.oldBoundaryCount,
        inputFocusedBeforeClick: before.inputFocusedBeforeClick,
      });
      action.motionEvidence = result;
      console.log(`  Reduced Replay witness ${routeId}:${action.step}: ${JSON.stringify(result)}`);
      break;
    }

    case 'clickAndAssertBarPosition': {
      const container = page.locator(action.container);
      const evidenceId = `${routeId}:${action.step}`;
      const before = await container.evaluate((root, options) => {
        const track = root.querySelector('.fraction-bar-track');
        const fill = track?.querySelector('.fraction-bar-fill');
        if (!track || !fill) throw new Error('bar position witness requires a mounted track and fill');
        const documentRect = (element) => {
          const rect = element.getBoundingClientRect();
          return { x: rect.x + window.scrollX, y: rect.y + window.scrollY, width: rect.width, height: rect.height };
        };
        const witness = { root, track, fill, whole: documentRect(track), fillBox: documentRect(fill) };
        window.__fractionFlowPositionWitnesses ||= new Map();
        window.__fractionFlowPositionWitnesses.set(options.id, witness);
        return { whole: witness.whole, fillBox: witness.fillBox };
      }, { id: evidenceId });
      await page.locator(action.target).click();
      const evidence = await container.evaluate(async (root, options) => {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const previous = window.__fractionFlowPositionWitnesses?.get(options.id);
        if (!previous) throw new Error('missing reduced conversion document-position witness');
        const track = root.querySelector('.fraction-bar-track');
        const fill = track?.querySelector('.fraction-bar-fill');
        const layer = track?.querySelector('.fraction-bar-boundary-layer');
        const documentRect = (element) => {
          const rect = element.getBoundingClientRect();
          return { x: rect.x + window.scrollX, y: rect.y + window.scrollY, width: rect.width, height: rect.height };
        };
        if (root !== previous.root || track !== previous.track || fill !== previous.fill
          || !layer?.isConnected) {
          throw new Error('reduced conversion replaced the bar root, track, fill, or boundary layer');
        }
        const whole = documentRect(track);
        const fillBox = documentRect(fill);
        const delta = (first, second) => Object.fromEntries(
          ['x', 'y', 'width', 'height'].map((key) => [key, Math.abs(first[key] - second[key])]),
        );
        const wholeDrift = delta(previous.whole, whole);
        const fillDrift = delta(previous.fillBox, fillBox);
        const boundaries = [...layer.querySelectorAll('.fraction-bar-boundary')];
        const layerBox = layer.getBoundingClientRect();
        const boundaryGeometry = boundaries.map((element) => {
          const rect = element.getBoundingClientRect();
          const [indexText, denominatorText] = element.dataset.boundaryKey.split('/');
          const expectedCenter = layerBox.left + (Number(indexText) / Number(denominatorText)) * layerBox.width;
          return {
            key: element.dataset.boundaryKey,
            connected: element.isConnected && layer.contains(element),
            heightDelta: Math.abs(rect.height - layerBox.height),
            topDelta: Math.abs(rect.top - layerBox.top),
            bottomDelta: Math.abs(rect.bottom - layerBox.bottom),
            centerDelta: Math.abs((rect.left + rect.width / 2) - expectedCenter),
          };
        });
        const runningAnimations = track.getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length;
        if (Object.values(wholeDrift).some((value) => value > 0.5)
          || Object.values(fillDrift).some((value) => value > 0.5)) {
          throw new Error(`reduced conversion changed whole/fill document position: ${JSON.stringify({ wholeDrift, fillDrift, before: { whole: previous.whole, fill: previous.fillBox }, after: { whole, fill: fillBox }, scrollX: window.scrollX, scrollY: window.scrollY })}`);
        }
        if (track.dataset.numerator !== String(options.numerator)
          || track.dataset.denominator !== String(options.denominator)
          || runningAnimations !== 0) {
          throw new Error(`reduced conversion did not settle immediately without running effects: ${track.dataset.numerator}/${track.dataset.denominator}, running=${runningAnimations}`);
        }
        if (boundaries.length !== options.denominator - 1
          || !boundaryGeometry.every((entry) => entry.connected && entry.heightDelta <= 0.5
            && entry.topDelta <= 0.5 && entry.bottomDelta <= 0.5 && entry.centerDelta <= 0.75)) {
          throw new Error(`reduced conversion boundaries did not occupy the full supplied grid: ${JSON.stringify(boundaryGeometry)}`);
        }
        window.__fractionFlowPositionWitnesses.delete(options.id);
        return { before: { whole: previous.whole, fill: previous.fillBox }, whole, fill: fillBox, wholeDrift, fillDrift, scrollX: window.scrollX, scrollY: window.scrollY, boundaryGeometry, runningAnimations };
      }, { id: evidenceId, numerator: action.numerator, denominator: action.denominator });
      action.positionEvidence = evidence;
      console.log(`  Reduced conversion position witness ${routeId}:${action.step}: ${JSON.stringify(evidence)}`);
      break;
    }

    case 'assertFreshBarLayout': {
      const observed = await page.locator(action.container).evaluate((wrapper) => {
        const visualView = wrapper.closest('.app-visual-view');
        const boxes = [...wrapper.querySelectorAll('.fraction-bar-box')];
        const roots = boxes.map((box) => box.querySelector('.fraction-bar-container'));
        return {
          height: wrapper.getBoundingClientRect().height,
          boxCount: boxes.length,
          rootCount: roots.filter(Boolean).length,
          hasReplayReserve: Boolean(visualView?.querySelector('.fraction-bar-replay-reserve')),
        };
      });
      if (Math.abs(observed.height - action.expectedHeight) > (action.tolerance ?? 0.5)
        || observed.boxCount !== 2 || observed.rootCount !== 2 || observed.hasReplayReserve) {
        throw new Error(`fresh episode retained altered Replay bar layout: ${JSON.stringify(observed)}`);
      }
      action.layoutEvidence = observed;
      break;
    }

    case 'clickAndStartSubdivision': {
      const container = page.locator(action.container);
      const evidenceId = `${routeId}:${action.step}`;
      await container.evaluate((root, id) => {
        const track = root.querySelector('.fraction-bar-track');
        const fill = track?.querySelector('.fraction-bar-fill');
        if (!track || !fill) throw new Error('persistent track and fill must be mounted before the learner action');
        window.__fractionFlowRapidMotionWitnesses ||= new Map();
        window.__fractionFlowRapidMotionWitnesses.set(id, {
          root,
          track,
          fill,
          boundaries: [...track.querySelectorAll('.fraction-bar-boundary')],
        });
      }, evidenceId);
      await page.locator(action.target).click();
      const evidence = await container.evaluate((root, id) => {
        const previous = window.__fractionFlowRapidMotionWitnesses?.get(id);
        if (!previous) throw new Error('missing rapid-response pre-action identity witness');
        const track = root.querySelector('.fraction-bar-track');
        const fill = track?.querySelector('.fraction-bar-fill');
        const boundaries = [...(track?.querySelectorAll('.fraction-bar-boundary') || [])];
        const introduced = boundaries.filter((element) => !previous.boundaries.includes(element));
        const animations = introduced.flatMap((element) => element.getAnimations());
        const allPreviousBoundariesRetained = previous.boundaries.every((element) => boundaries.includes(element));
        const onlyNewBoundaryTargets = track.getAnimations({ subtree: true }).every((animation) => (
          introduced.includes(animation.effect?.target)
        ));
        if (root !== previous.root || track !== previous.track || fill !== previous.fill
          || !allPreviousBoundariesRetained || introduced.length === 0
          || animations.length !== introduced.length || !onlyNewBoundaryTargets) {
          throw new Error('rapid response did not start only on persistent track’s newly added boundaries');
        }
        const result = {
          rootPreserved: true,
          trackPreserved: true,
          fillPreserved: true,
          existingBoundariesPreserved: true,
          newBoundaryCount: introduced.length,
          runningAnimations: animations.filter((animation) => animation.playState === 'running').length,
        };
        window.__fractionFlowRapidMotionWitnesses.delete(id);
        return result;
      }, evidenceId);
      if (evidence.runningAnimations === 0) {
        throw new Error('rapid-response witness found no running subdivision animation');
      }
      action.motionEvidence = evidence;
      console.log(`  Rapid motion witness ${routeId}:${action.step}: ${JSON.stringify(evidence)}`);
      break;
    }

    case 'assertNoSubdivisionMotion': {
      const container = page.locator(action.container);
      const observed = await container.evaluateAll((roots) => {
        const items = roots.map((root) => {
          const tracks = root.matches('.fraction-bar-track')
            ? [root]
            : [...root.querySelectorAll('.fraction-bar-track')];
          const boundaryCount = tracks.reduce((sum, track) => (
            sum + track.querySelectorAll('.fraction-bar-boundary').length
          ), 0);
          const activeAnimations = tracks.reduce((sum, track) => (
            sum + track.getAnimations({ subtree: true })
              .filter((animation) => animation.playState === 'running').length
          ), 0);
          const activeVisualAnimations = root.getAnimations({ subtree: true })
            .filter((animation) => {
              if (animation.playState !== 'running') return false;
              const target = animation.effect?.target;
              if (!target || target.nodeType !== Node.ELEMENT_NODE) return false;
              return Boolean(target.closest('.fraction-bar-container, .replay-inspection-card'));
            }).length;
          return {
            trackCount: tracks.length,
            boundaryCount,
            activeAnimations,
            activeVisualAnimations,
            denominator: tracks[0]?.dataset.denominator || null,
            numerator: tracks[0]?.dataset.numerator || null,
          };
        });
        return {
          rootCount: roots.length,
          items,
          trackCount: items.reduce((sum, item) => sum + item.trackCount, 0),
          boundaryCount: items.reduce((sum, item) => sum + item.boundaryCount, 0),
          activeAnimations: items.reduce((sum, item) => sum + item.activeAnimations, 0),
          activeVisualAnimations: items.reduce((sum, item) => sum + item.activeVisualAnimations, 0),
          denominator: items[0]?.denominator || null,
          numerator: items[0]?.numerator || null,
        };
      });
      if (observed.rootCount === 0) {
        throw new Error(`static or reduced-motion route did not find the configured view: ${JSON.stringify(observed)}`);
      }
      if (observed.activeAnimations !== 0) {
        throw new Error(`static or reduced-motion route unexpectedly ran animation within the fraction track: ${JSON.stringify(observed)}`);
      }
      if (observed.activeVisualAnimations !== 0) {
        throw new Error(`static or reduced-motion route unexpectedly animated visual presentation: ${JSON.stringify(observed)}`);
      }
      if (action.expectBoundaries === false && observed.boundaryCount !== 0) {
        throw new Error(`static choreography unexpectedly mounted animated-arm boundaries: ${JSON.stringify(observed)}`);
      }
      if (action.denominator && observed.denominator !== String(action.denominator)) {
        throw new Error(`expected immediate denominator ${action.denominator}; observed ${JSON.stringify(observed)}`);
      }
      if (action.numerator && observed.numerator !== String(action.numerator)) {
        throw new Error(`expected immediate numerator ${action.numerator}; observed ${JSON.stringify(observed)}`);
      }
      action.motionEvidence = observed;
      break;
    }

    case 'dispatch-fallback':
      throw new Error(
        `dispatch-fallback in route "${routeId}" requires a mounted app dispatch seam which is not allowed in production static bundle.`
      );

    default:
      throw new Error(`Unknown action method: "${action.method}" in route "${routeId}".`);
  }
}

/**
 * Capture output representation for negative control / declared same comparisons.
 */
async function captureOutput(page, captureDef) {
  if (!captureDef) return '';
  const { target, type } = captureDef;

  if (target === 'activeElement') {
    return page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return 'none';
      const tag = el.tagName.toLowerCase();
      const cls = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
      return `${tag}${cls}`;
    });
  }

  const locator = page.locator(target);
  const count = await locator.count();
  if (count === 0) return '__NOT_FOUND__';

  switch (type) {
    case 'innerHTML':
      return locator.first().innerHTML();
    case 'outerHTML':
      return locator.first().evaluate((el) => el.outerHTML);
    case 'textContent':
      return locator.first().textContent();
    case 'attribute':
      return locator.first().getAttribute(captureDef.attribute || '');
    case 'inputValue':
      return locator.first().inputValue();
    case 'activeElementSelector':
      return page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return 'none';
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
        return `${tag}${cls}`;
      });
    case 'renderedFractionRepresentation':
      return locator.first().evaluate((root) => {
        const round = (value) => Math.round(value * 100) / 100;
        const describeGraphic = (element, pseudo = null) => {
          const box = element.getBoundingClientRect();
          const style = getComputedStyle(element, pseudo);
          return {
            geometry: {
              x: round(box.x),
              y: round(box.y),
              width: round(box.width),
              height: round(box.height),
            },
            paint: {
              display: style.display,
              visibility: style.visibility,
              opacity: style.opacity,
              backgroundColor: style.backgroundColor,
              backgroundImage: style.backgroundImage,
              borderTopColor: style.borderTopColor,
              borderTopWidth: style.borderTopWidth,
              borderRightColor: style.borderRightColor,
              borderRightWidth: style.borderRightWidth,
              borderBottomColor: style.borderBottomColor,
              borderBottomWidth: style.borderBottomWidth,
              borderLeftColor: style.borderLeftColor,
              borderLeftWidth: style.borderLeftWidth,
              content: style.content,
              transform: style.transform,
            },
          };
        };

        return JSON.stringify({
          bars: [...root.querySelectorAll('.fraction-whole')].map((bar) => ({
            whole: describeGraphic(bar),
            parts: [...bar.querySelectorAll('.bar-segment')].map((part) => ({
              segment: describeGraphic(part),
              mark: describeGraphic(part, '::after'),
            })),
          })),
          gaps: [...root.querySelectorAll('.gap-grid, .gap-marker')].map((gap) => (
            describeGraphic(gap)
          )),
        });
      });
    default:
      return locator.first().innerHTML();
  }
}

/**
 * Verify assertions on page.
 */
async function verifyAssertions(page, assertions, routeId) {
  for (const assertion of assertions) {
    const { type, target, value, attribute } = assertion;

    if (type === 'activeElementEquals') {
      const activeDesc = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return '';
        const tag = el.tagName.toLowerCase();
        const cls = el.className ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
        return `${tag}${cls}`;
      });
      if (!activeDesc.includes(value)) {
        throw new Error(
          `Route "${routeId}" activeElement assertion failed: expected "${value}", observed "${activeDesc}".`
        );
      }
      continue;
    }

    const locator = page.locator(target);

    switch (type) {
      case 'notVisible': {
        const count = await locator.count();
        if (count > 0 && await locator.first().isVisible()) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" should not be visible.`);
        }
        break;
      }

      case 'visibleGeometry': {
        const minCount = assertion.minCount ?? 1;
        const minWidth = assertion.minWidth ?? 12;
        const minHeight = assertion.minHeight ?? 12;
        const backgroundImageIncludes = assertion.backgroundImageIncludes?.toLowerCase();
        const requireVisibleCenterHit = assertion.requireVisibleCenterHit === true;
        const requireContrastingBorder = assertion.borderContrastAgainstAncestor === true;
        const geometries = await locator.evaluateAll((elements, checks) => elements.map((element) => {
          const box = element.getBoundingClientRect();
          let current = element;
          let styleVisible = true;
          let combinedOpacity = 1;
          while (current instanceof Element) {
            const style = getComputedStyle(current);
            combinedOpacity *= Number(style.opacity);
            if (style.display === 'none' || style.visibility === 'hidden'
              || style.visibility === 'collapse') {
              styleVisible = false;
            }
            current = current.parentElement;
          }
          const style = getComputedStyle(element);
          const colorIsVisible = (color) => {
            if (color === 'transparent') return false;
            const rgba = color.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)/);
            return !rgba || Number(rgba[1]) > 0;
          };
          const borderPaintVisible = [
            ['borderTopWidth', 'borderTopColor'],
            ['borderRightWidth', 'borderRightColor'],
            ['borderBottomWidth', 'borderBottomColor'],
            ['borderLeftWidth', 'borderLeftColor'],
          ].some(([width, color]) => (
            Number.parseFloat(style[width]) > 0 && colorIsVisible(style[color])
          ));
          const paintVisible = (style.backgroundImage !== 'none'
            && style.backgroundImage !== '')
            || colorIsVisible(style.backgroundColor)
            || borderPaintVisible;
          let centerHitWithinElement = true;
          if (checks.requireVisibleCenterHit) {
            let hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
            centerHitWithinElement = false;
            while (hit instanceof Element) {
              if (hit === element) {
                centerHitWithinElement = true;
                break;
              }
              hit = hit.parentElement;
            }
          }

          let hasContrastingBorder = true;
          if (checks.requireContrastingBorder) {
            const readColor = (color) => {
              const channels = color.match(/[\d.]+/g)?.map(Number);
              if (!channels || channels.length < 3) return null;
              const alpha = channels.length > 3 ? channels[3] : 1;
              return alpha <= 0 ? null : channels.slice(0, 3);
            };
            let backdrop = null;
            current = element.parentElement;
            while (current instanceof Element && !backdrop) {
              backdrop = readColor(getComputedStyle(current).backgroundColor);
              current = current.parentElement;
            }
            const luminance = ([red, green, blue]) => {
              const linear = (channel) => {
                const normalized = channel / 255;
                return normalized <= 0.04045
                  ? normalized / 12.92
                  : ((normalized + 0.055) / 1.055) ** 2.4;
              };
              return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
            };
            const contrastRatio = (first, second) => {
              const levels = [luminance(first), luminance(second)].sort((a, b) => b - a);
              return (levels[0] + 0.05) / (levels[1] + 0.05);
            };
            const borderColors = [
              ['borderTopWidth', 'borderTopColor'],
              ['borderRightWidth', 'borderRightColor'],
              ['borderBottomWidth', 'borderBottomColor'],
              ['borderLeftWidth', 'borderLeftColor'],
            ].filter(([width]) => Number.parseFloat(style[width]) > 0)
              .map(([, color]) => readColor(style[color]))
              .filter(Boolean);
            hasContrastingBorder = Boolean(backdrop)
              && borderColors.some((borderColor) => contrastRatio(borderColor, backdrop) >= 3);
          }
          return {
            width: box.width,
            height: box.height,
            visible: styleVisible && combinedOpacity >= 0.1
              && element.getClientRects().length > 0 && box.width > 0 && box.height > 0,
            paintVisible,
            backgroundImage: style.backgroundImage,
            centerHitWithinElement,
            hasContrastingBorder,
          };
        }), { requireVisibleCenterHit, requireContrastingBorder });
        const undersized = geometries.filter((geometry) => (
          !geometry.visible || !geometry.paintVisible
            || geometry.width < minWidth || geometry.height < minHeight
            || (backgroundImageIncludes
              && !geometry.backgroundImage.toLowerCase().includes(backgroundImageIncludes))
            || (requireVisibleCenterHit && !geometry.centerHitWithinElement)
            || (requireContrastingBorder && !geometry.hasContrastingBorder)
        ));
        if (geometries.length < minCount || undersized.length > 0) {
          throw new Error(
            `Route "${routeId}" visible geometry assertion failed for "${target}": `
            + `found ${geometries.length}, expected at least ${minCount} visible items `
            + `of ${minWidth}x${minHeight}px${backgroundImageIncludes
              ? ` with background image containing "${backgroundImageIncludes}"`
              : ''}${requireVisibleCenterHit ? ' with a visible center hit' : ''}`
            + `${requireContrastingBorder ? ' with a contrasting border against its ancestor background' : ''}`
            + `; ${undersized.length} were hidden, clipped, unpainted, undersized, or missing required paint.`,
          );
        }
        break;
      }

      case 'hasSelector': {
        const count = await locator.count();
        if (count === 0) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" not found.`);
        }
        break;
      }

      case 'notHasSelector': {
        const count = await locator.count();
        if (count > 0) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" should not exist, but found ${count}.`);
        }
        break;
      }

      case 'containsText': {
        const text = await locator.first().textContent();
        if (!text || !text.includes(value)) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" does not contain text "${value}". Observed: "${text}".`);
        }
        break;
      }

      case 'notContainsText': {
        const text = await locator.first().textContent();
        if (text && text.includes(value)) {
          throw new Error(`Route "${routeId}" assertion failed: selector "${target}" unexpectedly contains text "${value}".`);
        }
        break;
      }

      case 'attributeEquals': {
        const attrVal = await locator.first().getAttribute(attribute);
        if (attrVal !== value) {
          throw new Error(`Route "${routeId}" assertion failed: attribute "${attribute}" on "${target}" was "${attrVal}", expected "${value}".`);
        }
        break;
      }

      case 'inputValueEquals': {
        const inputVal = await locator.first().inputValue();
        if (inputVal !== value) {
          throw new Error(`Route "${routeId}" assertion failed: input value on "${target}" was "${inputVal}", expected "${value}".`);
        }
        break;
      }

      default:
        throw new Error(`Unknown assertion type: "${type}" in route "${routeId}".`);
    }
  }
}

/**
 * Run the full route matrix suite.
 */
async function runRouteMatrix(options = {}) {
  const {
    filter,
    verbose = false,
    preferredChannel,
    seededVisualDefect = null,
    motionWitnessSeed = null,
  } = options;

  if (seededVisualDefect !== null && !Object.hasOwn(seededPrototypeVisualDefects, seededVisualDefect)) {
    throw new Error(`Unknown seeded prototype visual defect "${seededVisualDefect}".`);
  }
  if (motionWitnessSeed !== null && !Object.hasOwn(motionWitnessSeeds, motionWitnessSeed)) {
    throw new Error(`Unknown motion witness seed "${motionWitnessSeed}".`);
  }

  if (!fs.existsSync(distDir)) {
    throw new Error('Built distribution (dist/) not found. Run `npm run build` before running route matrix.');
  }

  // Load matrix and registered conditions
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const conditionsUrl = pathToFileURL(path.join(rootDir, 'src/app/conditions.js')).href;
  const conditionsModule = await import(conditionsUrl);
  const registeredConditions = conditionsModule.REGISTERED_CONDITIONS;

  // Static integrity check
  const integrity = await validateMatrixIntegrity(matrix, registeredConditions);
  if (!integrity.valid) {
    for (const err of integrity.errors) {
      console.error(err);
    }
    throw new Error(`Route matrix integrity validation failed with ${integrity.errors.length} error(s).`);
  }

  // Start local server
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/FractionFlow/`;

  // Select browser channel
  let browserChannel = preferredChannel;
  if (!browserChannel) {
    const isWindows = process.platform === 'win32';
    if (isWindows && fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) {
      browserChannel = 'msedge';
    } else if (isWindows && fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')) {
      browserChannel = 'chrome';
    }
  }

  const browserLaunchOptions = { headless: true };
  if (browserChannel) {
    browserLaunchOptions.channel = browserChannel;
  }

  const browser = await chromium.launch(browserLaunchOptions);
  const routeResults = [];
  const captures = new Map();

  // Baseline capture for initial state
  try {
    const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
    const page = await context.newPage();
    await page.goto(baseUrl);
    await page.waitForSelector('.fractionflow-app');
    const initHtml = await page.locator('.app-visual-view').innerHTML();
    captures.set('INITIAL-ENCOUNTER-BASELINE', initHtml);
    captures.set('BODY-FOCUS-NEGATIVE-CONTROL', 'body');
    captures.set('INSPECTION-ACTIVE-FOCUS-BASELINE', 'button.fraction-control.app-done-looking-button');
    await context.close();
  } catch (err) {
    await browser.close();
    server.close();
    throw new Error(`Failed to capture initial baseline: ${err.message}`);
  }

  const effectiveFilter = motionWitnessSeed ? motionWitnessSeeds[motionWitnessSeed].routeId : filter;
  const routesToRun = selectRoutesForRun(matrix.routes, effectiveFilter);
  const routeExecutions = expandRouteExecutions(routesToRun);

  if (verbose) {
    console.log(`Executing ${routeExecutions.length} browser witnesses from ${routesToRun.length} route rows using browser channel: ${browserChannel || 'default chromium'}...`);
  }

  try {
    for (const execution of routeExecutions) {
      const { route, motionMode } = execution;
      const resultId = route.id + ' [' + motionMode + ']';
      const startTime = Date.now();
      const contextOptions = {
        viewport: route.viewport,
        reducedMotion: motionMode === 'reduced-motion' ? 'reduce' : 'no-preference',
      };

      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      page.setDefaultTimeout(5000);

      try {
        const startingSurface = resolveStartingSurface(route.startingSurface);
        const startUrl = new URL(startingSurface.path, baseUrl).toString();
        await page.goto(startUrl);
        await page.waitForSelector(startingSurface.readySelector);
        if (motionWitnessSeed === 'static-accidental-motion'
          || motionWitnessSeed === 'reduced-accidental-motion') {
          await page.addStyleTag({ content: `
            @keyframes fractionflow-witness-motion-seed { from { opacity: .98; } to { opacity: 1; } }
            .app-visual-view .fraction-bar-track { animation: fractionflow-witness-motion-seed 1s linear infinite !important; }
          ` });
        }
        if (seededVisualDefect && route.configuration === 'plan15-subtraction-prototype') {
          await page.addStyleTag({ content: seededPrototypeVisualDefects[seededVisualDefect] });
        }

        // Execute action sequence
        for (const action of route.actions) {
          const seededAction = motionWitnessSeed
            && route.id === motionWitnessSeeds[motionWitnessSeed].routeId
            && (motionWitnessSeeds[motionWitnessSeed].step === undefined
              || action.step === motionWitnessSeeds[motionWitnessSeed].step)
            && action.method === 'clickAndObserveSubdivision'
            ? { ...action, motionWitnessSeed }
            : action;
          await executeAction(page, seededAction, route.id);
        }

        // Capture output for negative control / sameness check
        const capturedVal = await captureOutput(page, route.expect.capture);
        captures.set(routeCaptureKey(route.id, motionMode), capturedVal);
        captures.set(route.id, capturedVal);

        // Verify assertions
        await verifyAssertions(page, route.expect.assertions, route.id);

        const duration = Date.now() - startTime;
        if (route.knownDefect) {
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'known-defect', duration, route });
          if (verbose) {
            console.log(`  ⚠ ${resultId} (${duration}ms) [KNOWN DEFECT: ${route.knownDefect.id} - ${route.knownDefect.description}]`);
          }
        } else {
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'pass', duration, route });
          if (verbose) {
            console.log(`  ✓ ${resultId} (${duration}ms)`);
          }
        }
      } catch (err) {
        const duration = Date.now() - startTime;
        if (motionWitnessSeed && route.id === motionWitnessSeeds[motionWitnessSeed].routeId
          && err.message.includes(motionWitnessSeeds[motionWitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [seed detected at intended assertion: ${motionWitnessSeed}; ${err.message}]`);
        } else if (route.knownDefect) {
          const cleanMsg = err.message.endsWith('.') ? err.message : `${err.message}.`;
          const defectErrMsg = `FATAL: Route "${route.id}" is marked with knownDefect "${route.knownDefect.id}", but stopped exhibiting the defect: ${cleanMsg} If this defect has been repaired, retire the "knownDefect" marker and invert the expectation assertion.`;
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'fail', error: defectErrMsg, duration, route });
          console.error(`  ✗ ${resultId} (${duration}ms): ${defectErrMsg}`);
        } else {
          routeResults.push({ id: resultId, routeId: route.id, motionMode, status: 'fail', error: err.message, duration, route });
          console.error(`  ✗ ${resultId} (${duration}ms): ${err.message}`);
        }
      } finally {
        await context.close();
      }
    }

    // Now enforce Rule 2 (Negative Controls) and Condition B (Declared Sameness)
    for (const res of routeResults) {
      if (res.status !== 'pass' && res.status !== 'known-defect') continue;
      const { route } = res;

      // Condition B: Declared Sameness Verification
      if (route.declaredSameAs) {
        const targetId = route.declaredSameAs.targetRouteId;
        const targetCapture = captures.get(targetId);
        const myCapture = captures.get(routeCaptureKey(res.routeId, res.motionMode));

        if (!targetCapture) {
          res.status = 'fail';
          res.error = `FATAL (Condition B): Route "${route.id}" declared same as "${targetId}", but target capture was missing.`;
          console.error(`  ✗ ${route.id}: ${res.error}`);
        } else if (myCapture !== targetCapture) {
          res.status = 'fail';
          res.error = `FATAL (Condition B): Route "${route.id}" was declared same as "${targetId}", but output was NOT identical.`;
          console.error(`  ✗ ${route.id}: ${res.error}`);
        }
      }

      // Rule 2: Negative Control Diversity Verification
      if (route.negativeControl) {
        const targetId = route.negativeControl.targetRouteId;
        const sameMotionMode = route.negativeControl.sameMotionMode === true;
        const targetCapture = sameMotionMode
          ? captures.get(routeCaptureKey(targetId, res.motionMode))
          : captures.get(targetId);
        const myCapture = captures.get(routeCaptureKey(res.routeId, res.motionMode));

        if (sameMotionMode && targetCapture === undefined) {
          res.status = 'fail';
          res.error = `FATAL (Rule 2): Route "${route.id}" lacks a captured negative control "${targetId}" under "${res.motionMode}".`;
          console.error(`  ✗ ${res.id}: ${res.error}`);
        } else if (targetCapture !== undefined && myCapture !== undefined && myCapture === targetCapture) {
          res.status = 'fail';
          res.error = `FATAL (Rule 2): Route "${route.id}" produced output identical to negative control "${targetId}" under "${res.motionMode}".`;
          console.error(`  ✗ ${res.id}: ${res.error}`);
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  const passed = routeResults.filter((r) => r.status === 'pass').length;
  const knownDefects = routeResults.filter((r) => r.status === 'known-defect').length;
  const failed = routeResults.filter((r) => r.status === 'fail').length;
  const seedDetected = routeResults.filter((r) => r.status === 'seed-detected').length;
  if (motionWitnessSeed && (seedDetected !== 1 || failed !== 0 || routeResults.length !== 1)) {
    throw new Error(`Motion witness seed "${motionWitnessSeed}" did not produce exactly one intended failure; detected=${seedDetected}, failed=${failed}, executions=${routeResults.length}.`);
  }

  return {
    total: routeResults.length,
    routeCount: routesToRun.length,
    passed,
    knownDefects,
    failed,
    seedDetected,
    results: routeResults,
  };
}

module.exports = {
  createStaticServer,
  expandRouteExecutions,
  getRouteMotionModes,
  resolveStartingSurface,
  runRouteMatrix,
  selectRoutesForRun,
  validateMatrixIntegrity,
};

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  let filter = null;
  let verbose = true;
  let motionWitnessSeed = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--filter' && args[i + 1]) {
      filter = args[++i];
    } else if (args[i] === '--quiet') {
      verbose = false;
    } else if (args[i] === '--motion-witness-seed' && args[i + 1]) {
      motionWitnessSeed = args[++i];
    }
  }

  console.log('--- FractionFlow Reachable Behavior Route Contract Runner ---');
  runRouteMatrix({ filter, verbose, motionWitnessSeed })
    .then((summary) => {
      const parts = [`${summary.passed} passed`];
      if (summary.seedDetected > 0) parts.push(`${summary.seedDetected} intended seed failure${summary.seedDetected === 1 ? '' : 's'} detected`);
      if (summary.knownDefects > 0) {
        parts.push(`${summary.knownDefects} known defect${summary.knownDefects === 1 ? '' : 's'}`);
      }
      parts.push(`${summary.failed} failed`);
      console.log(`\nRoute Matrix Run Complete: ${parts.join(', ')} (${summary.routeCount} route rows; ${summary.total} browser executions).`);
      if (summary.failed > 0) {
        process.exit(1);
      } else if (motionWitnessSeed && summary.seedDetected !== 1) {
        console.error(`Motion witness seed "${motionWitnessSeed}" was not detected at its intended assertion.`);
        process.exit(1);
      } else {
        process.exit(0);
      }
    })
    .catch((err) => {
      console.error('\nFatal Execution Error:\n', err.message);
      process.exit(1);
    });
}
