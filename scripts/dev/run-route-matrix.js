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
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
let exactMathModulePromise = null;

const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const matrixPath = path.join(rootDir, 'tests/routes/route-matrix.json');
const plan34ContextMapPath = path.join(rootDir, 'tests/routes/plan34-context-map.json');
const plan34HistoricalRootDir = path.join(os.tmpdir(), 'fractionflow-plan34-historical-entry');
const plan34HistoricalBuilderPath = path.join(rootDir, 'scripts/dev/build-plan34-historical-fixture.mjs');
const plan18HistoricalRootDir = path.join(os.tmpdir(), 'fractionflow-plan18-historical-entry');
const plan18HistoricalBuilderPath = path.join(rootDir, 'scripts/dev/build-plan18-historical-fixture.mjs');
const plan39HistoricalRootDir = path.join(os.tmpdir(), 'fractionflow-plan39-historical-v7-entry');
const plan39HistoricalBuilderPath = path.join(rootDir, 'scripts/dev/build-plan39-historical-fixture.mjs');
const legacyNavigationRootDir = path.join(os.tmpdir(), 'fractionflow-legacy-navigation-entry');
const legacyNavigationBuilderPath = path.join(rootDir, 'scripts/dev/build-legacy-navigation-fixture.mjs');
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
  'glow-suppressed': { routeId: 'ROUTE-REPLAY-NEW-CONVERSION-COND-1', step: 12, failure: 'new subdivision boundary did not show the post-arrival highlight' },
  'core-suppressed': { routeId: 'ROUTE-REPLAY-NEW-CONVERSION-COND-1', step: 12, failure: 'new subdivision boundary did not show the temporary dark core' },
});
const plan34WitnessSeeds = Object.freeze({
  'answer-validity-leak': {
    routeId: 'ROUTE-PLAN34-INSPECT-LINEAR-DEEP',
    injectBeforeDescription: 'Ask a side-specific question and show stacked proposal',
    selector: '.app-linear-view .active-beat-section',
    text: '6/12',
    failure: 'unexpectedly contains text "6/12"',
  },
  'omitted-task-remnant': {
    routeId: 'ROUTE-PLAN34-INSPECT-LINEAR-DEEP',
    injectBeforeDescription: 'At resolve, keep conversions and sum, omit skipped milestones',
    selector: '.app-episode',
    text: 'Notice: Units do not match.',
    failure: 'unexpectedly contains text "Units do not match."',
  },
});
const plan18WitnessSeeds = Object.freeze({
  'wrong-transform-side': {
    routeId: 'ROUTE-PLAN18-PRODUCTION-HIGH-VISUAL-COMPLETE',
    injectBeforeDescription: 'Verify the untouched source eighths remains unchanged',
    selector: '.app-visual-view .fraction-bar-container[data-side="right"] .fraction-bar-track',
    attribute: 'data-numerator',
    value: '4',
    failure: 'attribute "data-numerator" on',
  },
  'stale-denominator-control': {
    routeId: 'ROUTE-PLAN18-PRODUCTION-HIGH-VISUAL-COMPLETE',
    injectBeforeDescription: 'Confirm the nested task has no denominator-entry control',
    selector: '.app-visual-view .active-beat-controls',
    failure: 'should not exist, but found 1',
  },
});
const plan38WitnessSeeds = Object.freeze({
  'operation-draft-loss': {
    routeId: 'ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION',
    injectBeforeDescription: 'Switch to linear view by pointer',
    mutation: 'erase-operation-draft',
    failure: 'input value on "#linear-operate-fraction-denominator-input" was "", expected "8"',
  },
  'operation-wrong-focus': {
    routeId: 'ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION',
    injectBeforeDescription: 'Switch to linear view by pointer',
    mutation: 'focus-denominator-after-view-switch',
    failure: 'expected ".app-linear-view #linear-operate-fraction-numerator-input" to have focus',
  },
  'erased-removal-marks': {
    routeId: 'ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE',
    injectBeforeDescription: 'Plan 38: assert visible hatch and non-leakage at operate',
    style: `
      .app-visual-view .fraction-bar-segment.removed,
      .app-visual-view .fraction-bar-segment.is-removed {
        background-image: none !important;
        background-color: var(--ff-bar-shaded) !important;
      }
    `,
    failure: 'with background image containing "repeating-linear-gradient"',
  },
  'clipped-takeaway-bar': {
    routeId: 'ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE',
    injectBeforeDescription: 'Plan 38: assert visible hatch and non-leakage at operate',
    style: `
      .app-visual-view .fraction-bar-takeaway-track {
        clip-path: inset(100%) !important;
      }
    `,
    failure: 'visible geometry assertion failed for ".app-visual-view .fraction-bar-takeaway-track"',
  },
  'premature-answer-leak': {
    routeId: 'ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE',
    injectBeforeDescription: 'Plan 38: assert visible hatch and non-leakage at operate',
    mutation: 'leak-answer',
    failure: 'unexpectedly contains text "0/9 is left."',
  },
  'addition-semantics': {
    routeId: 'ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE',
    injectBeforeDescription: 'Plan 38: assert visible hatch and non-leakage at operate',
    mutation: 'addition-semantics',
    failure: 'unexpectedly contains text "+"',
  },
  'action-as-answer': {
    routeId: 'ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE',
    injectBeforeDescription: 'Plan 38: assert visible hatch and non-leakage at operate',
    mutation: 'action-as-answer',
    failure: 'selector "#operate-fraction-numerator-input" not found.',
  },
});
const plan39WitnessSeeds = Object.freeze({
  'misaligned-endpoints': { routeId: 'ROUTE-PLAN39-DEEP-SAMPLE-HIGH-EIGHTHS-B8', failure: 'Plan39 endpoint alignment assertion failed' },
  'premature-target-leak': { routeId: 'ROUTE-PLAN39-DEEP-SAMPLE-HIGH-EIGHTHS-B8', failure: 'Plan39 pre-submit target leakage assertion failed' },
  'undersized-touch-target': { routeId: 'ROUTE-PLAN39-DEEP-SAMPLE-HIGH-EIGHTHS-B8', failure: 'Plan39 touch target assertion failed' },
  'single-tap-auto-submit': { routeId: 'ROUTE-PLAN39-DEEP-SAMPLE-HIGH-EIGHTHS-B8', failure: 'Plan39 preview-before-submit assertion failed' },
  'coarse-bucket-sr-collapse': { routeId: 'ROUTE-PLAN39-DEEP-SAMPLE-HIGH-EIGHTHS-B8', failure: 'Plan39 linear candidate descriptions assertion failed' },
});
const plan39Repair02WitnessSeeds = Object.freeze({
  'hidden-bar-before-check': { routeId: 'ROUTE-PLAN39-REPAIR02-BOUNDARIES', failure: 'Plan39 Repair02 pre-check bar assertion failed' },
  'auto-check-on-placement': { routeId: 'ROUTE-PLAN39-REPAIR02-BOUNDARIES', failure: 'Plan39 Repair02 preview-before-check assertion failed' },
  'correctness-aware-snap': { routeId: 'ROUTE-PLAN39-REPAIR02-BOUNDARIES', failure: 'Plan39 Repair02 nearest-offered selection assertion failed' },
  'cancel-loses-prior-placement': { routeId: 'ROUTE-PLAN39-REPAIR02-BOUNDARIES', failure: 'Plan39 Repair02 cancel-restoration assertion failed' },
  'outside-drop-accepted': { routeId: 'ROUTE-PLAN39-REPAIR02-BOUNDARIES', failure: 'Plan39 Repair02 outside-drop assertion failed' },
});
const plan39Repair03WitnessSeeds = Object.freeze({
  'highlight-anchor-mismatch': {
    routeId: 'ROUTE-PLAN39-REPAIR03-ANCHOR-RING',
    failure: 'Plan39 Repair03 shared anchor/highlight assertion failed',
  },
});
const plan40WitnessSeeds = Object.freeze({
  'erased-takeaway-hatch-after-transform': {
    routeId: 'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
    injectBeforeDescription: 'Plan 40: assert visible hatch and non-leakage at operate',
    style: `
      .app-visual-view .fraction-bar-segment.removed,
      .app-visual-view .fraction-bar-segment.is-removed {
        background-image: none !important;
        background-color: var(--ff-bar-shaded) !important;
      }
    `,
    failure: 'with background image containing "repeating-linear-gradient"',
  },
  'addition-wording-in-subtraction': {
    routeId: 'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
    injectBeforeDescription: 'Plan 40: assert visible hatch and non-leakage at operate',
    mutation: 'addition-wording',
    failure: 'unexpectedly contains text "+"',
  },
  'premature-difference-leak': {
    routeId: 'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
    injectBeforeDescription: 'Plan 40: assert visible hatch and non-leakage at operate',
    mutation: 'premature-result-leak-bare',
    failure: 'unexpectedly contains text "3/10"',
  },
  'premature-difference-leak-bare': {
    routeId: 'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
    injectBeforeDescription: 'Plan 40: assert visible hatch and non-leakage at operate',
    mutation: 'premature-result-leak-bare',
    failure: 'unexpectedly contains text "3/10"',
  },
  'premature-difference-leak-stacked': {
    routeId: 'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
    injectBeforeDescription: 'Plan 40: assert visible hatch and non-leakage at operate',
    mutation: 'premature-result-leak-stacked',
    failure: 'unexpectedly contains text "3/10"',
  },
  'premature-difference-leak-accessible': {
    routeId: 'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
    injectBeforeDescription: 'Plan 40: assert visible hatch and non-leakage at operate',
    mutation: 'premature-result-leak-accessible',
    failure: 'unexpectedly contains text "3/10"',
  },
  'missing-operate-fraction-inputs': {
    routeId: 'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
    injectBeforeDescription: 'Plan 40: assert visible hatch and non-leakage at operate',
    mutation: 'missing-inputs',
    failure: 'selector "#operate-fraction-numerator-input" not found.',
  },
});
const startingSurfaces = Object.freeze({
  'mounted-app-entry': Object.freeze({
    path: '',
    readySelector: '.fractionflow-app',
  }),
  'plan34-historical-v4-entry': Object.freeze({
    path: '__test__/plan34-historical/plan34-historical-entry.html',
    readySelector: '.fractionflow-app',
  }),
  'plan18-historical-v6-entry': Object.freeze({
    path: '__test__/plan18-historical/plan18-historical-entry.html',
    readySelector: '.fractionflow-app',
  }),
  'plan39-historical-v7-entry': Object.freeze({
    path: '__test__/plan39-historical-v7/plan39-historical-v7-entry.html',
    readySelector: '.fractionflow-app',
  }),
  'legacy-navigation-entry': Object.freeze({
    path: '__test__/legacy-navigation/legacy-navigation-entry.html',
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

async function derivePlan40ProhibitedResult(itemId = 'plan40-construct-half-fifth-10') {
  const [math, content] = await Promise.all([
    import(pathToFileURL(path.join(rootDir, 'src/math/index.js')).href),
    import(pathToFileURL(path.join(rootDir, 'src/content/index.js')).href),
  ]);
  const record = content.PLAN40_SUBTRACTION_RECIPE_RECORDS.find((r) => r.itemId === itemId);
  if (!record) throw new Error(`Plan 40 record "${itemId}" not found`);
  const left = math.createFraction(Number(record.sourceForms.left.numerator), Number(record.sourceForms.left.denominator));
  const right = math.createFraction(Number(record.sourceForms.right.numerator), Number(record.sourceForms.right.denominator));
  const targetD = Number(record.targetDenominator);
  const diff = math.subtractAtCommonDenominator(
    math.convertToDenominator(left, targetD),
    math.convertToDenominator(right, targetD),
    targetD,
  );
  return {
    numerator: String(diff.numerator),
    denominator: String(diff.denominator),
    fractionText: `${diff.numerator}/${diff.denominator}`,
  };
}

function validatePlan40ScreenshotLayout(layout, file = 'unspecified.png') {
  if (layout.horizontalOverflowPx > 1.0) {
    throw new Error(`Plan 40 screenshot ${file} has horizontal document overflow: ${layout.horizontalOverflowPx}px (scrollWidth=${layout.document.width}, clientWidth=${layout.viewport.width}).`);
  }
  const { question, controls } = layout;
  if (!question?.visible || !controls?.visible) {
    throw new Error(`Plan 40 screenshot ${file} does not capture visible question and controls.`);
  }
  if (!question.horizontallyContained || !controls.horizontallyContained) {
    throw new Error(`Plan 40 screenshot ${file} has question or controls exceeding horizontal viewport bounds.`);
  }
  if (!question.withinViewport || !controls.withinViewport) {
    throw new Error(`Plan 40 screenshot ${file} has question or controls outside the viewport (question: withinViewport=${question.withinViewport}, controls: withinViewport=${controls.withinViewport}).`);
  }
}

function assertPlan40SeedInvariant(summary, seedName = 'test-seed') {
  const { seedDetected, failed, total } = summary;
  if (seedDetected !== 1 || failed !== 0 || total !== 1) {
    throw new Error(`Plan 40 witness seed "${seedName}" did not produce exactly one intended failure; detected=${seedDetected}, failed=${failed}, executions=${total}.`);
  }
}

function readPlan34ContextMap() {
  return JSON.parse(fs.readFileSync(plan34ContextMapPath, 'utf8'));
}

const additionFeaturedRouteIds = new Set([
  'ROUTE-ENTRY-GEAR-TAB', 'ROUTE-ENTRY-BEGIN-RETURN-FOCUS', 'ROUTE-ENTRY-BEGIN-FIRST-TAB-EPISODE',
  'ROUTE-PLAN34-CONSTRUCT-VISUAL-DEEP', 'ROUTE-PLAN34-INSPECT-LINEAR-DEEP',
  'ROUTE-PLAN34-THIRD-IDENTITY-WIDE', 'ROUTE-PLAN34-RETRY-RETURN-REENTRY',
  'ROUTE-PLAN35-CURRENT-HIGH-VISUAL-ALL-21', 'ROUTE-PLAN35-CURRENT-MEDIUM-LINEAR-ALL-21',
]);
function usesFixedAdditionDay(routeId, contextId) {
  return contextId === 'production-default-v7' && additionFeaturedRouteIds.has(routeId);
}

function resolveRouteContext(route, contextMap) {
  const context = contextMap?.contexts?.[route.id] ?? null;
  if (context === 'historical-v4') return { id: context, startingSurface: 'plan34-historical-v4-entry' };
  if (context === 'historical-v6') return { id: context, startingSurface: 'plan18-historical-v6-entry' };
  if (context === 'historical-plan39-v7') return { id: context, startingSurface: 'plan39-historical-v7-entry' };
  if (context === 'production-default-v7' || context === 'production-default-v8') {
    return { id: context, startingSurface: 'legacy-navigation-entry' };
  }
  if (context === 'production-direct-plan43') {
    return { id: context, startingSurface: 'mounted-app-entry' };
  }
  if (context === 'production-direct-plan45') {
    return { id: context, startingSurface: 'mounted-app-entry' };
  }
  if (context === 'production-direct-plan51') {
    return { id: context, startingSurface: 'mounted-app-entry' };
  }
  return { id: route.startingSurface.startsWith('subtraction-') ? 'prototype' : null, startingSurface: route.startingSurface };
}

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

function createStaticServer({ historicalRootDir = null, plan18HistoricalRootDir = null, plan39HistoricalRootDir = null, legacyNavigationRootDir = null } = {}) {
  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0].replace(/^\/FractionFlow/, '');
    if (!reqPath || reqPath === '/') reqPath = '/index.html';
    let filePath;
    const historicalPrefix = '/__test__/plan34-historical/';
    const plan18Prefix = '/__test__/plan18-historical/';
    const plan39Prefix = '/__test__/plan39-historical-v7/';
    const legacyPrefix = '/__test__/legacy-navigation/';
    const fixtureRoot = reqPath.startsWith(historicalPrefix) ? historicalRootDir
      : reqPath.startsWith(plan18Prefix) ? plan18HistoricalRootDir
        : reqPath.startsWith(plan39Prefix) ? plan39HistoricalRootDir
          : reqPath.startsWith(legacyPrefix) ? legacyNavigationRootDir : null;
    const fixturePrefix = reqPath.startsWith(historicalPrefix) ? historicalPrefix
      : reqPath.startsWith(plan18Prefix) ? plan18Prefix
        : reqPath.startsWith(plan39Prefix) ? plan39Prefix : legacyPrefix;
    if (fixtureRoot) {
      filePath = path.resolve(fixtureRoot, path.normalize(reqPath.slice(fixturePrefix.length)));
      const relativeToRoot = path.relative(path.resolve(fixtureRoot), filePath);
      if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid historical fixture path');
        return;
      }
    } else {
      filePath = path.join(distDir, reqPath);
    }

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
async function validateMatrixIntegrity(matrix, registeredConditions, suppliedContextMap = null) {
  const errors = [];

  if (!matrix || !Array.isArray(matrix.routes) || matrix.routes.length === 0) {
    errors.push('Route matrix must contain a non-empty "routes" array.');
    return { valid: false, errors };
  }

  let contextMap = suppliedContextMap;
  try {
    contextMap ??= readPlan34ContextMap();
  } catch (error) {
    errors.push(`Plan 34 route context map could not be loaded: ${error.message}`);
  }
  const routeContexts = contextMap?.contexts;
  if (contextMap?.version !== 1 || !routeContexts || typeof routeContexts !== 'object' || Array.isArray(routeContexts)) {
    errors.push('Plan 34 route context map must have version 1 and an explicit contexts object.');
  } else {
    const idsInMatrix = new Set(matrix.routes.map((route) => route.id));
    const idsInMap = Object.keys(routeContexts);
    const contextCounts = {
      'historical-v4': 0,
      'historical-v6': 0,
      'historical-plan39-v7': 0,
      'production-default-v7': 0,
      'production-default-v8': 0,
      'production-direct-plan43': 0,
      'production-direct-plan45': 0,
      'production-direct-plan51': 0,
    };
    for (const route of matrix.routes) {
      const context = routeContexts[route.id];
      const isMountedApp = route.startingSurface === 'mounted-app-entry';
      if (isMountedApp && !context) errors.push(`Route "${route.id}" has no explicit Plan 34 app context mapping.`);
      if (!isMountedApp && context) errors.push(`Non-app route "${route.id}" must not be mapped as a Plan 34 app context.`);
      if (context && !Object.hasOwn(contextCounts, context)) {
        errors.push(`Route "${route.id}" has unknown Plan 34 app context "${context}".`);
      } else if (context) {
        contextCounts[context] += 1;
      }
      if (route.id.startsWith('ROUTE-PLAN18-') && context !== 'historical-v6') {
        errors.push(`Historical Plan 18 route "${route.id}" must exercise its pinned historical-v6 fixture.`);
      }
      if ((route.id.startsWith('ROUTE-PLAN39-REPAIR02-') || route.id.startsWith('ROUTE-PLAN39-REPAIR03-')) && context !== 'production-default-v8') {
        errors.push(`Current Plan 39 Repair02/03 route "${route.id}" must exercise production-default-v8.`);
      }
      if (route.id.startsWith('ROUTE-PLAN39-') && !route.id.startsWith('ROUTE-PLAN39-REPAIR02-') && !route.id.startsWith('ROUTE-PLAN39-REPAIR03-')
        && context !== 'historical-plan39-v7') {
        errors.push(`Historical Plan 39 route "${route.id}" must exercise the pinned revision-1/replay-v7 fixture.`);
      }
      if ((route.id.startsWith('ROUTE-PLAN34-') || route.id.startsWith('ROUTE-PLAN35-') || route.id.startsWith('ROUTE-PLAN38-')) && context !== 'production-default-v7') {
        errors.push(`Current Plan 34/35/38 route "${route.id}" must exercise production-default-v7.`);
      }
      if (route.id.startsWith('ROUTE-PLAN40-') && context !== 'production-default-v7') {
        errors.push(`Current Plan 40 route "${route.id}" must exercise production-default-v7.`);
      }
      if (route.id.startsWith('ROUTE-PLAN43-') && context !== 'production-direct-plan43') {
        errors.push(`Current Plan 43 route "${route.id}" must exercise production-direct-plan43.`);
      }
      if (route.id.startsWith('ROUTE-PLAN45-') && context !== 'production-direct-plan45') {
        errors.push(`Current Plan 45 route "${route.id}" must exercise production-direct-plan45.`);
      }
      if (route.id.startsWith('ROUTE-PLAN51-') && context !== 'production-direct-plan51') {
        errors.push(`Current Plan 51 route "${route.id}" must exercise production-direct-plan51.`);
      }
    }
    for (const routeId of idsInMap) {
      if (!idsInMatrix.has(routeId)) errors.push(`Plan 34 context map contains unknown route id "${routeId}".`);
    }
    for (const [context, count] of Object.entries(contextCounts)) {
      if (count === 0) errors.push(`Plan 34 route context "${context}" has no mapped route evidence.`);
    }
  }

  const routeIds = new Set();
  const configurationsCovered = new Set();
  const validActionMethods = new Set([
    'click',
    'tap',
    'clickEquivalentChoice',
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
    'screenshot',
    'dispatch-fallback',
    'completePlan18RetainedPrefix',
    'completePlan35LiveSet',
    'completePlan38SubtractionSet',
    'completePlan40SubtractionSet',
    'completePlan39BridgeSet',
    'completePlan39BridgeRecovery',
    'plan39Witness',
    'completePlan39Repair02Set',
    'plan39Repair02Boundary',
    'plan39Repair03AnchorWitness',
    'completePlan43Branch',
    'completePlan45ComparisonJourney',
    'keyboardActivate',
    'resizeViewport',
    'textScale',
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
    if (route.inputMode !== undefined && !['mouse', 'keyboard', 'touch'].includes(route.inputMode)) {
      errors.push(`Route "${route.id}" has invalid inputMode "${route.inputMode}".`);
    }
    if (route.actions?.some((action) => action.method === 'tap') && route.inputMode !== 'touch') {
      errors.push(`Route "${route.id}" uses browser touch without inputMode "touch".`);
    }
    if (route.deviceScaleFactor !== undefined && (typeof route.deviceScaleFactor !== 'number' || route.deviceScaleFactor <= 0)) {
      errors.push(`Route "${route.id}" has invalid deviceScaleFactor.`);
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
      if (action.method === 'clickEquivalentChoice'
        && (!action.target || !/^\d+$/.test(String(action.numerator))
          || !/^\d+$/.test(String(action.denominator)) || String(action.denominator) === '0')) {
        errors.push(`Route "${route.id}" step ${action.step} exact matching choice requires a target fraction with a positive denominator.`);
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
      if (action.method === 'keyboardActivate' && (!action.target || typeof action.target !== 'string')) {
        errors.push(`Route "${route.id}" step ${action.step} keyboardActivate requires a target.`);
      }
      if (action.method === 'resizeViewport' && (!Number.isInteger(action.width) || action.width <= 0
        || !Number.isInteger(action.height) || action.height <= 0)) {
        errors.push(`Route "${route.id}" step ${action.step} resizeViewport requires positive integer width and height.`);
      }
      if (action.method === 'textScale' && (!action.target || !['100%', '200%'].includes(action.value))) {
        errors.push(`Route "${route.id}" step ${action.step} textScale requires a target and 100% or 200% value.`);
      }
      if (action.method === 'screenshot'
        && (typeof action.file !== 'string'
          || !(action.file.startsWith('reports/development/plan-34-reusable-full-addition-task-patterns/evidence/')
            || action.file.startsWith('reports/development/plan-18-nested-denominator-addition/evidence/')
            || action.file.startsWith('reports/development/plan-38-like-denominator-subtraction-batch/evidence/')
            || action.file.startsWith('reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/')
            || action.file.startsWith('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/')
            || action.file.startsWith('reports/development/plan-45-symbolic-fraction-comparison/evidence/'))
          || action.file.includes('..') || typeof action.caption !== 'string' || !action.caption.trim())) {
        errors.push(`Route "${route.id}" screenshot action must name a scoped evidence file and caption.`);
      }
      if (action.method === 'screenshot' && action.measureLayout !== undefined
        && typeof action.measureLayout !== 'boolean') {
        errors.push(`Route "${route.id}" screenshot measureLayout must be boolean when supplied.`);
      }
      if (action.method === 'screenshot' && action.requireNestedChoices !== undefined
        && typeof action.requireNestedChoices !== 'boolean') {
        errors.push(`Route "${route.id}" screenshot requireNestedChoices must be boolean when supplied.`);
      }
      if (action.method === 'completePlan18RetainedPrefix'
        && (!['visual', 'linear'].includes(action.view)
          || !['high-support', 'medium-support'].includes(action.supportProfile))) {
        errors.push(`Route "${route.id}" step ${action.step} Plan 18 retained-prefix action requires a registered view and support profile.`);
      }
      if (action.method === 'completePlan35LiveSet'
        && (!['visual', 'linear'].includes(action.view)
          || !['high-support', 'medium-support'].includes(action.supportProfile))) {
        errors.push(`Route "${route.id}" step ${action.step} Plan 35 live-set action requires a registered view and support profile.`);
      }
      if (action.method === 'completePlan38SubtractionSet'
        && (!['visual', 'linear'].includes(action.view)
          || !['high-support', 'medium-support'].includes(action.supportProfile))) {
        errors.push(`Route "${route.id}" step ${action.step} Plan 38 subtraction-set action requires a registered view and support profile.`);
      }
      if (action.method === 'completePlan40SubtractionSet'
        && (!['visual', 'linear'].includes(action.view)
          || !['high-support', 'medium-support'].includes(action.supportProfile))) {
        errors.push(`Route "${route.id}" step ${action.step} Plan 40 subtraction-set action requires a registered view and support profile.`);
      }
      if (action.method === 'clickAndObserveSubdivision' && action.interruptReducedMotion
        && route.motionMode !== 'standard-motion') {
        errors.push(`Route "${route.id}" step ${action.step} may interrupt with reduced motion only from standard motion.`);
      }
      if (action.method === 'clickAndObserveSubdivision' && action.interruptReducedMotionAtHighlight
        && route.motionMode !== 'standard-motion') {
        errors.push(`Route "${route.id}" step ${action.step} may interrupt a boundary highlight only from standard motion.`);
      }
      if (action.method === 'clickAndObserveSubdivision' && action.interruptReducedMotion
        && action.interruptReducedMotionAtHighlight) {
        errors.push(`Route "${route.id}" step ${action.step} cannot interrupt both the reveal and highlight phases.`);
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
      if (['completePlan39BridgeSet', 'completePlan39BridgeRecovery'].includes(action.method)
        && (!['visual', 'linear'].includes(action.view) || !['high-support', 'medium-support'].includes(action.supportProfile))) {
        errors.push(`Route "${route.id}" step ${action.step} Plan 39 action requires a registered view and support profile.`);
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
          return [element.dataset.boundaryKey, {
            ...relativeRect(element, root),
            boxShadow: getComputedStyle(element).boxShadow,
            backgroundColor: getComputedStyle(element).backgroundColor,
          }];
        })),
      },
    };
    window.__fractionFlowMotionWitnesses.set(options.id, record);
    if (options.seed === 'no-op-keyframes'
      || options.seed === 'disabled-motion'
      || options.seed === 'glow-suppressed'
      || options.seed === 'core-suppressed') {
      const originalAnimate = Element.prototype.animate;
      Element.prototype.animate = function animateWithWitnessSeed(keyframes, timing) {
        if (this.matches?.('.fraction-bar-boundary-new')) {
          if (options.seed === 'disabled-motion') {
            return originalAnimate.call(this, keyframes, { ...timing, duration: 0 });
          }
          if (options.seed === 'glow-suppressed') {
            this.style.setProperty('--ff-bar-boundary-glow', 'rgba(2, 132, 199, 0)');
            return originalAnimate.call(this, keyframes, timing);
          }
          if (options.seed === 'core-suppressed') {
            return originalAnimate.call(this, keyframes.map((frame) => ({
              ...frame,
              ...(frame.backgroundColor ? { backgroundColor: 'var(--ff-bar-subdivide-line)' } : {}),
            })), timing);
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
        const revealEnd = animation.effect?.getKeyframes()
          .find((frame) => frame.transform === 'scaleY(1)')?.offset;
        const target = animation.effect?.target;
        // The reveal is the first keyframe phase. Sample only before its first
        // full-height keyframe; the longer composite timeline must not stretch it.
        if (target && Number.isFinite(progress) && Number.isFinite(revealEnd)
          && progress > 0.08 && progress < revealEnd - 0.025) {
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

  let highlight = null;
  if (!action.interruptReducedMotion) {
    highlight = await container.evaluate(async (root, options) => {
      const previous = window.__fractionFlowMotionWitnesses?.get(options.id);
      if (!previous) throw new Error('missing post-arrival highlight witness');
      const track = root.querySelector('.fraction-bar-track');
      const fill = track?.querySelector('.fraction-bar-fill');
      const layer = track?.querySelector('.fraction-bar-boundary-layer');
      if (!track || !fill || !layer) throw new Error('persistent anchors disappeared before boundary highlight');
      const rect = (element) => {
        const box = element.getBoundingClientRect();
        return {
          x: box.x, y: box.y, left: box.left, top: box.top,
          right: box.right, bottom: box.bottom, width: box.width, height: box.height,
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
      const layout = () => {
        const episode = root.closest('.app-episode');
        const question = episode?.querySelector('.active-beat-prompt');
        const controls = episode?.querySelector('.active-beat-controls');
        if (!question || !controls) return null;
        return {
          question: rect(question), controls: rect(controls),
          scrollX: window.scrollX, scrollY: window.scrollY,
          viewportWidth: window.innerWidth, viewportHeight: window.innerHeight,
        };
      };
      const interior = rect(layer);
      const highlightKeyframe = previous.animations[0]?.effect?.getKeyframes()
        .find((frame) => frame.transform === 'scaleY(1)'
          && typeof frame.boxShadow === 'string' && frame.boxShadow !== 'none');
      if (!Number.isFinite(highlightKeyframe?.offset)) {
        throw new Error('subdivision effect has no bounded post-arrival highlight keyframe');
      }
      const coreKeyframe = previous.animations[0]?.effect?.getKeyframes()
        .find((frame) => frame.boxShadow !== 'none' && typeof frame.backgroundColor === 'string');
      if (!Number.isFinite(coreKeyframe?.offset)) {
        throw new Error('subdivision effect has no bounded temporary boundary-core keyframe');
      }
      let sample = null;
      const deadline = performance.now() + 1500;
      while (!sample && performance.now() < deadline) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const geometry = previous.newBoundaries.map((element) => {
          const box = rect(element);
          const [indexText, denominatorText] = element.dataset.boundaryKey.split('/');
          const expectedCenter = interior.left + (Number(indexText) / Number(denominatorText)) * interior.width;
          const paint = getComputedStyle(element);
          return {
            key: element.dataset.boundaryKey,
            connected: element.isConnected && layer.contains(element),
            rect: box,
            boxShadow: paint.boxShadow,
            backgroundColor: paint.backgroundColor,
            expectedCenter,
            centerDelta: Math.abs((box.left + box.width / 2) - expectedCenter),
            topDelta: Math.abs(box.top - interior.top),
            bottomDelta: Math.abs(box.bottom - interior.bottom),
            heightDelta: Math.abs(box.height - interior.height),
          };
        });
        const fullHeight = geometry.length > 0 && geometry.every((entry) => (
          entry.connected && entry.heightDelta <= 0.5 && entry.topDelta <= 0.5
          && entry.bottomDelta <= 0.5 && entry.centerDelta <= 0.75
        ));
        const afterHighlightArrival = previous.animations.every((animation) => {
          const timing = animation.effect?.getComputedTiming();
          return Number.isFinite(timing?.progress) && timing.progress >= highlightKeyframe.offset;
        });
        const allHighlighted = geometry.every((entry) => {
          const alpha = entry.boxShadow.match(/rgba\([^)]*,\s*([0-9.]+)\)/)?.[1];
          return alpha !== undefined && Number(alpha) > 0.2;
        });
        const allCoresDark = geometry.every((entry) => {
          const channels = entry.backgroundColor.match(/\d+/g)?.map(Number);
          return channels?.length === 3
            && channels[0] <= 32 && channels[1] <= 32 && channels[2] <= 48;
        });
        if (afterHighlightArrival && fullHeight && allHighlighted) {
          if (!allCoresDark) {
            throw new Error(`new subdivision boundary did not show the temporary dark core: ${JSON.stringify({
              expected: 'dark core channels <= 32, 32, 48',
              actual: geometry.map((entry) => ({ key: entry.key, backgroundColor: entry.backgroundColor })),
            })}`);
          }
          const taskLayout = layout();
          if (!taskLayout) throw new Error('question and active controls disappeared during boundary highlight');
          const centers = geometry.map((entry) => entry.rect.left + entry.rect.width / 2).sort((a, b) => a - b);
          const minimumCenterGap = Math.min(...centers.slice(1).map((center, index) => center - centers[index]));
          const shadowLengths = [...geometry[0].boxShadow.matchAll(/(-?(?:\d+|\d*\.\d+))px/g)]
            .map((match) => Math.abs(Number(match[1])));
          const glowHalfOutset = geometry[0].rect.width / 2 + (shadowLengths[2] || 0) + (shadowLengths[3] || 0);
          const edgeClearance = Math.min(centers[0] - interior.left, interior.right - centers.at(-1));
          const oldBoundaries = [...previous.boundaries.entries()].map(([key, element]) => ({
            key,
            boxShadow: getComputedStyle(element).boxShadow,
            backgroundColor: getComputedStyle(element).backgroundColor,
            activeAnimations: element.getAnimations().filter((animation) => animation.playState === 'running').length,
          }));
          sample = {
            whole: rect(track), fill: rect(fill),
            documentWhole: documentRect(track), documentFill: documentRect(fill),
            relativeWhole: relativeRect(track, root), relativeFill: relativeRect(fill, root),
            interior, boundaryGeometry: geometry, oldBoundaries, taskLayout,
            allNewBoundariesHighlighted: true,
            allNewBoundariesHaveDarkCore: true,
            oldBoundariesUnhighlighted: oldBoundaries.every((entry) => (
              entry.boxShadow === 'none' && entry.backgroundColor === 'rgb(255, 255, 255)'
              && entry.activeAnimations === 0
            )),
            minimumCenterGap,
            glowHalfOutset,
            edgeClearance,
            glowFitsNarrowParts: glowHalfOutset * 2 < minimumCenterGap - 0.5
              && edgeClearance > glowHalfOutset,
          };
          previous.highlight = sample;
        }
      }
      if (!sample) {
        throw new Error(`new subdivision boundary did not show the post-arrival highlight: ${JSON.stringify({
        fullHeightObserved: previous.newBoundaries.every((element) => (
          Math.abs(rect(element).height - interior.height) <= 0.5
        )),
          boundaryShadows: previous.newBoundaries.map((element) => ({
            key: element.dataset.boundaryKey,
            boxShadow: getComputedStyle(element).boxShadow,
          })),
        })}`);
      }
      return sample;
    }, { id: evidenceId });
  }

  const contrastEvidenceDir = process.env.FF_PLAN11_CONTRAST_EVIDENCE_DIR;
  if (highlight && contrastEvidenceDir) {
    const track = container.locator('.fraction-bar-track');
    const denominator = Number(await track.getAttribute('data-denominator'));
    const numerator = Number(await track.getAttribute('data-numerator'));
    const isOwnerReviewConversion = (denominator === 12 && numerator === 8)
      || (denominator === 24 && numerator === 16);
    if (isOwnerReviewConversion) {
      fs.mkdirSync(contrastEvidenceDir, { recursive: true });
      const prefix = `${routeId}-denominator-${denominator}`;
      const peakPath = path.join(contrastEvidenceDir, `${prefix}-arrival.png`);
      const fadePath = path.join(contrastEvidenceDir, `${prefix}-mid-fade.png`);
      await container.screenshot({ path: peakPath });
      await page.waitForTimeout(380);
      const inspectFade = () => container.evaluate((root) => {
        const trackEl = root.querySelector('.fraction-bar-track');
        const numerator = Number(trackEl.dataset.numerator);
        const denominatorValue = Number(trackEl.dataset.denominator);
        const boundaries = [...trackEl.querySelectorAll('.fraction-bar-boundary-new')];
        const colors = boundaries.map((element) => ({
          key: element.dataset.boundaryKey,
          backgroundColor: getComputedStyle(element).backgroundColor,
          boxShadow: getComputedStyle(element).boxShadow,
        }));
        const bothRegions = boundaries.some((element) => {
          const [index, total] = element.dataset.boundaryKey.split('/').map(Number);
          const position = index / total;
          return position < numerator / denominatorValue;
        }) && boundaries.some((element) => {
          const [index, total] = element.dataset.boundaryKey.split('/').map(Number);
          const position = index / total;
          return position > numerator / denominatorValue;
        });
        const midFade = colors.length > 0 && colors.every((entry) => (
          entry.backgroundColor !== 'rgb(255, 255, 255)'
          && entry.backgroundColor !== 'rgb(11, 16, 32)'
          && entry.boxShadow !== 'none'
        ));
        return { sampledAt: performance.now(), denominator: denominatorValue, numerator, colors, bothRegions, midFade };
      });
      const fadeBeforeScreenshot = await inspectFade();
      if (!fadeBeforeScreenshot.bothRegions || !fadeBeforeScreenshot.midFade) {
        throw new Error(`rendered contrast fade evidence missed a filled/unfilled region or intermediate core paint before screenshot: ${JSON.stringify(fadeBeforeScreenshot)}`);
      }
      await container.screenshot({ path: fadePath });
      const fadeAfterScreenshot = await inspectFade();
      const afterByKey = new Map(fadeAfterScreenshot.colors.map((entry) => [entry.key, entry]));
      const screenshotPaintDeltas = fadeBeforeScreenshot.colors.map((entry) => {
        const after = afterByKey.get(entry.key);
        if (!after) return { key: entry.key, delta: Infinity };
        const beforeChannels = entry.backgroundColor.match(/\d+/g).map(Number);
        const afterChannels = after.backgroundColor.match(/\d+/g).map(Number);
        return {
          key: entry.key,
          delta: Math.max(...beforeChannels.map((channel, index) => Math.abs(channel - afterChannels[index]))),
        };
      });
      const screenshotPaintDelta = Math.max(...screenshotPaintDeltas.map((entry) => entry.delta));
      if (screenshotPaintDeltas.length !== fadeAfterScreenshot.colors.length
        || !fadeAfterScreenshot.bothRegions || !fadeAfterScreenshot.midFade || screenshotPaintDelta > 24) {
        throw new Error(`rendered contrast fade screenshot was not bounded by matching intermediate paint samples: ${JSON.stringify({ before: fadeBeforeScreenshot, after: fadeAfterScreenshot, screenshotPaintDelta })}`);
      }
      const fade = { ...fadeAfterScreenshot, fadeBeforeScreenshot, screenshotPaintDeltas, screenshotPaintDelta };
      if (!fade.bothRegions || !fade.midFade) {
        throw new Error(`rendered contrast fade evidence missed a filled/unfilled region or intermediate core paint: ${JSON.stringify(fade)}`);
      }
      const manifestPath = path.join(contrastEvidenceDir, 'contrast-evidence.json');
      let manifest = [];
      if (fs.existsSync(manifestPath)) manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      manifest.push({
        routeId,
        denominator,
        numerator: fade.numerator,
        arrivalScreenshot: path.basename(peakPath),
        midFadeScreenshot: path.basename(fadePath),
        arrivalCoreColor: highlight.boundaryGeometry[0]?.backgroundColor,
        midFadeCoreColors: [...new Set(fade.colors.map((entry) => entry.backgroundColor))],
        newBoundaryCount: fade.colors.length,
        bothFilledAndUnfilledRegions: fade.bothRegions,
        allNewBoundariesInMidFade: fade.midFade,
        screenshotBracketMaxChannelDelta: screenshotPaintDelta,
        screenshotBracketLimit: 24,
      });
      fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    }
  }

  let interrupted = null;
  let restored = null;
  if (action.interruptReducedMotion || action.interruptReducedMotionAtHighlight) {
    const beforePreferenceChange = await container.evaluate((root) => {
      const capturedAt = performance.now();
      const track = root.querySelector('.fraction-bar-track');
      if (!track) throw new Error('fraction track disappeared before reduced-motion interruption');
      const boundaries = [...track.querySelectorAll('.fraction-bar-boundary-new')];
      const runningAnimations = track.getAnimations({ subtree: true })
        .filter((animation) => animation.playState === 'running');
      const remainingTimes = runningAnimations.map((animation) => {
        const timing = animation.effect?.getComputedTiming();
        const currentTime = Number(animation.currentTime);
        return Number.isFinite(timing?.endTime) && Number.isFinite(currentTime)
          ? Math.max(0, timing.endTime - currentTime)
          : 0;
      });
      return {
        capturedAt,
        activeAnimations: runningAnimations.length,
        minimumRemainingMs: remainingTimes.length > 0 ? Math.min(...remainingTimes) : 0,
        highlightedBoundaries: boundaries.filter((element) => (
          getComputedStyle(element).boxShadow !== 'none'
        )).length,
        newBoundaryCount: boundaries.length,
      };
    });
    if (beforePreferenceChange.activeAnimations === 0
      || (action.interruptReducedMotionAtHighlight
        && beforePreferenceChange.highlightedBoundaries !== beforePreferenceChange.newBoundaryCount)) {
      throw new Error(`reduced-motion interruption did not begin during the expected running phase: ${JSON.stringify(beforePreferenceChange)}`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const preferenceChange = await container.evaluate((root, before) => {
      const observedAt = performance.now();
      const elapsedMs = observedAt - before.capturedAt;
      return {
        elapsedMs,
        minimumRemainingMsBeforeChange: before.minimumRemainingMs,
        reducedMotionPreference: matchMedia('(prefers-reduced-motion: reduce)').matches,
      };
    }, beforePreferenceChange);
    if (!preferenceChange.reducedMotionPreference
      || preferenceChange.elapsedMs + 50 >= preferenceChange.minimumRemainingMsBeforeChange) {
      throw new Error(`reduced motion was not applied before the effect could naturally settle: ${JSON.stringify({ beforePreferenceChange, preferenceChange })}`);
    }
    interrupted = await container.evaluate(async (root, before) => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const track = root.querySelector('.fraction-bar-track');
      const fill = track?.querySelector('.fraction-bar-fill');
      const rect = (element) => {
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      };
      const observed = {
        minimumRemainingMsBeforeChange: before.minimumRemainingMs,
        reducedMotionTrack: track.classList.contains('reduced-motion'),
        activeAnimations: track.getAnimations({ subtree: true })
          .filter((animation) => animation.playState === 'running').length,
        whole: rect(track),
        fill: rect(fill),
        boundaryPaint: [...track.querySelectorAll('.fraction-bar-boundary')]
          .map((element) => getComputedStyle(element).boxShadow),
        boundaryCorePaint: [...track.querySelectorAll('.fraction-bar-boundary')]
          .map((element) => getComputedStyle(element).backgroundColor),
        denominator: track.dataset.denominator,
        numerator: track.dataset.numerator,
      };
      observed.observedAt = performance.now();
      return observed;
    }, beforePreferenceChange);
    interrupted.elapsedMs = interrupted.observedAt - beforePreferenceChange.capturedAt;
    interrupted.beforePreferenceChange = beforePreferenceChange;
    interrupted.preferenceChange = preferenceChange;
    if (interrupted.elapsedMs + 50 >= interrupted.minimumRemainingMsBeforeChange) {
      throw new Error(`cancellation was not observed before the effect could naturally settle: ${JSON.stringify(interrupted)}`);
    }
    if (!interrupted.reducedMotionTrack || interrupted.activeAnimations !== 0
      || interrupted.boundaryPaint.some((shadow) => shadow !== 'none')
      || interrupted.boundaryCorePaint.some((color) => color !== 'rgb(255, 255, 255)')) {
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
      // The reveal plus highlight/fade is 1560ms. Give the browser 2600ms of
      // rendered frames to settle, while still requiring observed completion.
      const deadline = performance.now() + 2600;
      while (running && performance.now() < deadline) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const track = root.querySelector('.fraction-bar-track');
        running = track.getAnimations({ subtree: true })
          .some((animation) => animation.playState === 'running');
      }
      if (running) throw new Error('subdivision reveal and highlight did not settle within 2600 rendered milliseconds');
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
      newBoundaryPaint: newBoundaries.map((element) => ({
        key: element.dataset.boundaryKey,
        boxShadow: getComputedStyle(element).boxShadow,
        backgroundColor: getComputedStyle(element).backgroundColor,
      })),
      normalPaintRestored: newBoundaries.every((element) => {
        const paint = getComputedStyle(element);
        return paint.boxShadow === 'none' && paint.backgroundColor === 'rgb(255, 255, 255)';
      }),
      activeAnimations: track.getAnimations({ subtree: true })
        .filter((animation) => animation.playState === 'running').length,
      denominator: track.dataset.denominator,
      numerator: track.dataset.numerator,
    };
    const taskLayout = {
      before: previous.before.layout,
      intermediate: evidence.intermediate.layout,
      ...(evidence.highlight ? { highlight: evidence.highlight.taskLayout } : {}),
      settled: layout,
    };
    const questionAndControlsVisible = [
      taskLayout.before,
      taskLayout.intermediate,
      ...(taskLayout.highlight ? [taskLayout.highlight] : []),
      taskLayout.settled,
    ]
      .every((frame) => visibleInViewport(frame.question, frame.viewportHeight)
        && visibleInViewport(frame.controls, frame.viewportHeight));
    const relativeWholeBefore = previous.before.relativeWhole;
    const relativeFillBefore = previous.before.relativeFill;
    const anchorDrift = {
      wholeIntermediate: rectDelta(relativeWholeBefore, evidence.intermediate.relativeWhole),
      fillIntermediate: rectDelta(relativeFillBefore, evidence.intermediate.relativeFill),
      ...(evidence.highlight ? {
        wholeHighlight: rectDelta(relativeWholeBefore, evidence.highlight.relativeWhole),
        fillHighlight: rectDelta(relativeFillBefore, evidence.highlight.relativeFill),
      } : {}),
      wholeSettled: rectDelta(relativeWholeBefore, relativeRect(track, root)),
      fillSettled: rectDelta(relativeFillBefore, relativeRect(fill, root)),
    };
    const documentPositionDrift = {
      wholeIntermediate: rectDelta(previous.before.documentWhole, evidence.intermediate.documentWhole),
      fillIntermediate: rectDelta(previous.before.documentFill, evidence.intermediate.documentFill),
      ...(evidence.highlight ? {
        wholeHighlight: rectDelta(previous.before.documentWhole, evidence.highlight.documentWhole),
        fillHighlight: rectDelta(previous.before.documentFill, evidence.highlight.documentFill),
      } : {}),
      wholeSettled: rectDelta(previous.before.documentWhole, documentRect(track)),
      fillSettled: rectDelta(previous.before.documentFill, documentRect(fill)),
    };
    const existing = [...previous.boundaries.entries()];
    const existingBoundaryDrifts = existing.map(([key, element]) => ({
      key,
      delta: rectDelta(previous.before.boundaryGeometry.get(key), relativeRect(element, root)),
      paintUnchanged: getComputedStyle(element).boxShadow === previous.before.boundaryGeometry.get(key).boxShadow,
      corePaintUnchanged: getComputedStyle(element).backgroundColor
        === previous.before.boundaryGeometry.get(key).backgroundColor,
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
      highlight: evidence.highlight,
      settled,
      taskLayout,
      questionAndControlsVisible,
      highlightBoundariesSpanGrid: evidence.highlight?.boundaryGeometry.length > 0
        && evidence.highlight.boundaryGeometry.every((entry) => (
          entry.connected && entry.centerDelta <= 0.75 && entry.topDelta <= 0.5
          && entry.bottomDelta <= 0.5 && entry.heightDelta <= 0.5
        )),
      highlightPaintVisible: evidence.highlight?.allNewBoundariesHighlighted === true,
      highlightCoreVisible: evidence.highlight?.allNewBoundariesHaveDarkCore === true,
      oldBoundariesUnhighlighted: evidence.highlight?.oldBoundariesUnhighlighted !== false,
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
        driftWithinTolerance(entry.delta) && entry.paintUnchanged && entry.corePaintUnchanged
        && entry.activeAnimations === 0
      )),
      stableAnchors: Object.values(anchorDrift).every(driftWithinTolerance),
      conservedDocumentPosition: Object.values(documentPositionDrift).every(driftWithinTolerance),
    };
  }, { id: evidenceId, intermediate, highlight, interrupted, restored });

  if (!finalState.conservedDocumentPosition) {
    throw new Error(`whole/fill document position changed during subdivision: ${JSON.stringify({ drift: finalState.documentPositionDrift, before: { whole: finalState.before.documentWhole, fill: finalState.before.documentFill }, intermediate: { whole: finalState.intermediate.documentWhole, fill: finalState.intermediate.documentFill }, settled: { whole: finalState.settled.whole, fill: finalState.settled.fill, scrollX: finalState.taskLayout.settled.scrollX, scrollY: finalState.taskLayout.settled.scrollY } })}`);
  }
  if (!finalState.stableAnchors) {
    throw new Error(`bar outline or shaded amount moved during subdivision: ${JSON.stringify(finalState)}`);
  }
  if (!finalState.existingBoundariesStable) {
    throw new Error(`an existing boundary moved or animated during subdivision: ${JSON.stringify(finalState)}`);
  }
  if (highlight && (!finalState.highlightPaintVisible || !finalState.highlightBoundariesSpanGrid
    || !finalState.highlightCoreVisible || !finalState.oldBoundariesUnhighlighted || !highlight.glowFitsNarrowParts)) {
    throw new Error(`post-arrival boundary highlight did not preserve the new-line grid and old-line paint: ${JSON.stringify(finalState.highlight)}`);
  }
  if (finalState.settled.activeAnimations !== 0) {
    throw new Error(`subdivision effect did not settle: ${JSON.stringify(finalState)}`);
  }
  if (highlight && !finalState.settled.normalPaintRestored) {
    throw new Error(`new boundary highlight and core did not return to normal paint: ${JSON.stringify(finalState.settled.newBoundaryPaint)}`);
  }
  if (!finalState.newBoundariesSpanGrid) {
    throw new Error(`settled new boundaries did not span the connected inner layer at their supplied grid positions: ${JSON.stringify(finalState.settled.newBoundaryGeometry)}`);
  }
  if (!finalState.questionAndControlsVisible) {
    throw new Error(`question or active response controls left the visible viewport during subdivision: ${JSON.stringify(finalState.taskLayout)}`);
  }
  action.motionEvidence = finalState;
  if (highlight) {
    console.log(`  Glow witness ${evidenceId}: ${JSON.stringify({
      boundaryShadow: highlight.boundaryGeometry[0]?.boxShadow,
      everyNewBoundaryHighlighted: highlight.allNewBoundariesHighlighted,
      everyNewBoundaryFullHeightAndOnGrid: finalState.highlightBoundariesSpanGrid,
      oldBoundariesUnhighlighted: highlight.oldBoundariesUnhighlighted,
      minBoundaryCenterGap: highlight.minimumCenterGap,
      glowHalfOutset: highlight.glowHalfOutset,
      edgeClearance: highlight.edgeClearance,
      fitsNarrowParts: highlight.glowFitsNarrowParts,
      wholeDocumentBox: highlight.documentWhole,
      fillDocumentBox: highlight.documentFill,
      taskVisible: finalState.questionAndControlsVisible,
    })}`);
  }
  console.log(`  Motion witness ${evidenceId}: ${JSON.stringify(finalState)}`);
  return finalState;
}

async function executeAction(page, action, routeId, routeContext) {
  switch (action.method) {
    case 'completePlan39Repair02Set': {
      const { runPlan39Repair02Set } = await import('./plan39-repair02-route.mjs');
      action.repair02Evidence = await runPlan39Repair02Set(page, action);
      break;
    }
    case 'plan39Repair02Boundary': {
      const { runPlan39Repair02BoundaryWitness } = await import('./plan39-repair02-route.mjs');
      action.repair02Evidence = await runPlan39Repair02BoundaryWitness(page, action);
      break;
    }
    case 'plan39Repair03AnchorWitness': {
      const { runPlan39Repair03AnchorWitness } = await import('./plan39-repair03-route.mjs');
      action.repair03Evidence = await runPlan39Repair03AnchorWitness(page, action);
      break;
    }
    case 'completePlan39BridgeSet': {
      const { buildPlan39BridgeActions } = await import('./plan39-route-bridge.mjs');
      const generated = buildPlan39BridgeActions({ ...action, inputMode: action.inputMode || 'mouse', currentEntry: routeContext?.id === 'production-default-v8' });
      action.generatedActions = generated;
      for (const generatedAction of generated) {
        try { await executeAction(page, generatedAction, routeId); }
        catch (error) { error.message = `${generatedAction.description}: ${error.message}`; throw error; }
      }
      break;
    }
    case 'completePlan39BridgeRecovery': {
      const { buildPlan39RecoveryActions } = await import('./plan39-route-bridge.mjs');
      const generated = buildPlan39RecoveryActions({ ...action, inputMode: action.inputMode || 'mouse' });
      action.generatedActions = generated;
      for (const generatedAction of generated) {
        try { await executeAction(page, generatedAction, routeId); }
        catch (error) { error.message = `${generatedAction.description}: ${error.message}`; throw error; }
      }
      break;
    }
    case 'plan39Witness': {
      if (action.seed === 'single-tap-auto-submit') {
        await page.locator('.app-visual-view .plan39-stepper-next').evaluate((next) => {
          next.addEventListener('click', () => document.querySelector('.app-visual-view .plan39-check-position')?.click(), { once: true });
        });
        await page.locator('.app-visual-view .plan39-stepper-next').click();
      }
      else if (action.seed === 'misaligned-endpoints') await page.addStyleTag({ content: '.app-visual-view .plan39-axis-frame { transform: translateX(5px) !important; }' });
      else if (action.seed === 'premature-target-leak') await page.locator('.app-visual-view .plan39-candidate-point').first().evaluate((el) => el.setAttribute('data-correct', 'true'));
      else if (action.seed === 'undersized-touch-target') await page.addStyleTag({ content: '.app-visual-view .plan39-stepper-move { width: 20px !important; min-width: 20px !important; height: 20px !important; min-height: 20px !important; }' });
      else if (action.seed === 'coarse-bucket-sr-collapse') {
        await page.locator('.app-view-controls .app-secondary-button').click();
        await page.locator('.app-linear-view .plan39-candidate').evaluateAll((labels) => labels.forEach((label) => { const text = label.querySelector('span'); const radio=label.querySelector('input'); if (text) text.textContent = 'A point between the benchmarks'; if (radio) radio.setAttribute('aria-label', 'A point between the benchmarks'); }));
      }
      break;
    }
    case 'completePlan18RetainedPrefix': {
      const { buildPlan18RetainedPrefixActions } = await import('./plan18-route-prefix.mjs');
      const generated = buildPlan18RetainedPrefixActions({ view: action.view, supportProfile: action.supportProfile });
      for (const generatedAction of generated) {
        try {
          await executeAction(page, generatedAction, routeId);
        } catch (error) {
          error.message = `${generatedAction.description}: ${error.message}`;
          throw error;
        }
      }
      break;
    }
    case 'completePlan35LiveSet': {
      const { buildPlan35LiveSetActions } = await import('./plan35-route-live-set.mjs');
      const generated = buildPlan35LiveSetActions({ view: action.view, supportProfile: action.supportProfile });
      for (const generatedAction of generated) {
        try {
          await executeAction(page, generatedAction, routeId);
        } catch (error) {
          error.message = `${generatedAction.description}: ${error.message}`;
          throw error;
        }
      }
      break;
    }
    case 'completePlan38SubtractionSet': {
      const { buildPlan38SubtractionSetActions } = await import('./plan38-route-subtraction.mjs');
      const generated = buildPlan38SubtractionSetActions({ view: action.view, supportProfile: action.supportProfile });
      for (const generatedAction of generated) {
        try {
          await executeAction(page, generatedAction, routeId);
        } catch (error) {
          error.message = `${generatedAction.description}: ${error.message}`;
          throw error;
        }
      }
      break;
    }
    case 'completePlan40SubtractionSet': {
      const { buildPlan40SubtractionSetActions } = await import('./plan40-route-subtraction.mjs');
      const generated = buildPlan40SubtractionSetActions({ view: action.view, supportProfile: action.supportProfile });
      action.generatedActions = generated;
      for (const generatedAction of generated) {
        try {
          await executeAction(page, generatedAction, routeId);
        } catch (error) {
          error.message = `${generatedAction.description}: ${error.message}`;
          throw error;
        }
      }
      break;
    }
    case 'completePlan43Branch': {
      const { buildPlan43WitnessActions } = await import('./plan43-route-witnesses.mjs');
      const generated = buildPlan43WitnessActions(action);
      action.generatedActions = generated;
      for (const generatedAction of generated) {
        try {
          await executeAction(page, generatedAction, routeId);
        } catch (error) {
          error.message = `${generatedAction.description}: ${error.message}`;
          throw error;
        }
      }
      break;
    }
    case 'completePlan45ComparisonJourney': {
      const { buildPlan45ComparisonActions } = await import('./plan45-route-comparison.mjs');
      const generated = buildPlan45ComparisonActions({
        ...action,
        routeId,
        originalViewport: action.routeViewport,
        inputMode: action.inputMode || 'mouse',
      });
      action.generatedActions = generated;
      for (const generatedAction of generated) {
        try {
          await executeAction(page, generatedAction, routeId);
        } catch (error) {
          error.message = `${generatedAction.description}: ${error.message}`;
          throw error;
        }
      }
      break;
    }
    case 'screenshot': {
      if (action.settleAnimations) {
        await page.evaluate(async (maxWaitMs) => {
          const finite = document.getAnimations({ subtree: true }).filter((animation) => (
            animation.effect?.getTiming().iterations !== Infinity && animation.playState !== 'finished'
          ));
          if (finite.length === 0) return;
          await Promise.race([
            Promise.allSettled(finite.map((animation) => animation.finished)),
            new Promise((resolve) => setTimeout(resolve, maxWaitMs)),
          ]);
        }, 3000);
      }
      if (action.scrollTop === true) await page.evaluate(() => window.scrollTo(0, 0));
      const screenshotPath = path.resolve(rootDir, action.file);
      fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
      await page.screenshot({ path: screenshotPath });
      action.screenshotEvidence = { file: action.file, caption: action.caption, viewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight })) };
      if (action.measureLayout) {
        action.screenshotEvidence.layout = await page.evaluate(() => {
          const activeView = [...document.querySelectorAll('.app-visual-view, .app-linear-view')]
            .find((element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
            });
          const TOLERANCE_PX = 1.0;
          const measure = (element) => {
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const horizontallyContained = rect.x >= -TOLERANCE_PX && (rect.x + rect.width) <= (window.innerWidth + TOLERANCE_PX);
            const verticallyContained = rect.y >= -TOLERANCE_PX && (rect.y + rect.height) <= (window.innerHeight + TOLERANCE_PX);
            const intersectsViewport = (rect.x + rect.width) >= -TOLERANCE_PX && rect.x <= (window.innerWidth + TOLERANCE_PX)
              && (rect.y + rect.height) >= -TOLERANCE_PX && rect.y <= (window.innerHeight + TOLERANCE_PX);
            return {
              x: Math.round(rect.x * 100) / 100,
              y: Math.round(rect.y * 100) / 100,
              width: Math.round(rect.width * 100) / 100,
              height: Math.round(rect.height * 100) / 100,
              visible: rect.width > 0 && rect.height > 0
                && style.display !== 'none' && style.visibility !== 'hidden',
              horizontallyContained,
              verticallyContained,
              withinViewport: horizontallyContained && verticallyContained,
              intersectsViewport,
            };
          };
          const root = document.documentElement;
          const horizontalOverflowPx = Math.max(0, root.scrollWidth - root.clientWidth);
          return {
            viewport: { width: innerWidth, height: innerHeight },
            dpr: window.devicePixelRatio,
            roundingTolerancePx: TOLERANCE_PX,
            document: { width: root.scrollWidth, height: root.scrollHeight },
            horizontalOverflow: horizontalOverflowPx > TOLERANCE_PX,
            horizontalOverflowPx: Math.round(horizontalOverflowPx * 100) / 100,
            scroll: { x: scrollX, y: scrollY },
            activeView: activeView?.className ?? null,
            question: measure(activeView?.querySelector('.active-beat-prompt, .plan45-prompt, .plan45-expression')),
            controls: measure(activeView?.querySelector('.active-beat-controls, .plan45-response-region, .plan45-progression')),
            nestedChoices: [...(activeView?.querySelectorAll('.nested-side-choice') || [])].map((button) => ({
              button: measure(button),
              fraction: measure(button.querySelector('.symbolic-fraction')),
              fractionRule: measure(button.querySelector('.symbolic-bar')),
            })),
          };
        });
        if (routeId.startsWith('ROUTE-PLAN18-')) {
          if (action.screenshotEvidence.layout.horizontalOverflow) {
            throw new Error(`Plan 18 screenshot ${action.file} has horizontal document overflow.`);
          }
          const { question, controls, nestedChoices } = action.screenshotEvidence.layout;
          if (!question?.visible || !controls?.visible) {
            throw new Error(`Plan 18 screenshot ${action.file} does not capture visible question and controls.`);
          }
          const insideViewport = (box, viewport) => box.x >= 0 && box.y >= 0
            && box.x + box.width <= viewport.width && box.y + box.height <= viewport.height;
          const viewport = action.screenshotEvidence.layout.viewport;
          if (!insideViewport(question, viewport) || !insideViewport(controls, viewport)) {
            throw new Error(`Plan 18 screenshot ${action.file} has a question or control region outside the viewport: ${JSON.stringify({ question, controls, viewport })}`);
          }
          if (action.requireNestedChoices && (nestedChoices.length !== 2
            || nestedChoices.some((choice) => !choice.button?.visible || !choice.fraction?.visible || !choice.fractionRule?.visible
              || !insideViewport(choice.button, viewport) || !insideViewport(choice.fraction, viewport) || !insideViewport(choice.fractionRule, viewport)))) {
            throw new Error(`Plan 18 screenshot ${action.file} lacks two visible stacked fraction choices and rules.`);
          }
        }
        if (routeId.startsWith('ROUTE-PLAN40-')) {
          validatePlan40ScreenshotLayout(action.screenshotEvidence.layout, action.file);
        }
        if (routeId.startsWith('ROUTE-PLAN45-') && action.measureLayout) {
          const { question, controls, viewport, horizontalOverflow } = action.screenshotEvidence.layout;
          const reachableAtScroll = (box) => box?.visible && box.horizontallyContained && box.intersectsViewport;
          if (horizontalOverflow || (!reachableAtScroll(question) && !reachableAtScroll(controls))) {
            throw new Error(`Plan 45 screenshot ${action.file} leaves both prompt and active controls out of reach at the documented scroll position or has horizontal overflow: ${JSON.stringify(action.screenshotEvidence.layout)}`);
          }
        }
      }
      break;
    }

    case 'click':
      await page.locator(action.target).click();
      break;

    case 'tap': {
      const target = page.locator(action.target);
      await target.scrollIntoViewIfNeeded();
      const box = await target.boundingBox();
      if (!box) throw new Error(`Route "${routeId}" touch target "${action.target}" has no visible geometry.`);
      const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      const hit = await target.evaluate((element, coordinates) => {
        const top = document.elementFromPoint(coordinates.x, coordinates.y);
        return Boolean(top && (top === element || element.contains(top)));
      }, point);
      if (!hit) throw new Error(`Route "${routeId}" touch target "${action.target}" is obstructed at its center.`);
      await page.touchscreen.tap(point.x, point.y);
      break;
    }

    case 'clickEquivalentChoice': {
      exactMathModulePromise ??= import(pathToFileURL(path.join(rootDir, 'src/math/fraction.js')).href);
      const { createFraction, equalFractions } = await exactMathModulePromise;
      const target = createFraction(Number(action.numerator), Number(action.denominator));
      const choices = page.locator(action.target);
      const count = await choices.count();
      let selected = null;
      for (let index = 0; index < count; index += 1) {
        const label = await choices.nth(index).getAttribute('aria-label');
        const match = label?.match(/(?:Bar with|Fraction)\s+(\d+)\s+(?:of|over)\s+(\d+)/i);
        if (!match) throw new Error(`Route "${routeId}" matching option ${index} has no parseable authored fraction label.`);
        if (equalFractions(createFraction(Number(match[1]), Number(match[2])), target)) {
          if (selected !== null) throw new Error(`Route "${routeId}" matching target has more than one exact-equivalent choice.`);
          selected = index;
        }
      }
      if (selected === null) throw new Error(`Route "${routeId}" has no exact-equivalent matching choice for ${action.numerator}/${action.denominator}; observed labels: ${JSON.stringify(await choices.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label'))))}.`);
      await choices.nth(selected).click();
      break;
    }

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

    case 'keyboardActivate': {
      const target = page.locator(action.target).first();
      if (action.focusGroup) {
        const count = await page.locator(action.focusGroup).count();
        const targetIndex = await target.evaluate((element, selector) => (
          [...document.querySelectorAll(selector)].indexOf(element)
        ), action.focusGroup);
        if (count === 0 || targetIndex < 0) throw new Error(`Keyboard radio target "${action.target}" is not in its radio group.`);
        let activeIndex = -1;
        for (let press = 0; press < 80; press += 1) {
          activeIndex = await page.evaluate((selector) => (
            [...document.querySelectorAll(selector)].indexOf(document.activeElement)
          ), action.focusGroup);
          if (activeIndex >= 0) break;
          await page.keyboard.press('Tab');
        }
        if (activeIndex < 0) throw new Error(`Tab navigation could not reach radio group "${action.focusGroup}".`);
        const arrows = (targetIndex - activeIndex + count) % count;
        for (let step = 0; step < arrows; step += 1) await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Space');
        if (!await target.isChecked()) throw new Error(`Keyboard activation did not select "${action.target}".`);
        break;
      }
      if (!await target.isVisible()) throw new Error(`Keyboard activation target "${action.target}" is not visible.`);
      let focused = await target.evaluate((element) => element === document.activeElement);
      for (let press = 0; !focused && press < 80; press += 1) {
        await page.keyboard.press('Tab');
        focused = await target.evaluate((element) => element === document.activeElement);
      }
      if (!focused) throw new Error(`Tab navigation could not reach "${action.target}".`);
      await page.keyboard.press('Enter');
      break;
    }

    case 'resizeViewport':
      await page.setViewportSize({ width: action.width, height: action.height });
      break;

    case 'textScale': {
      const result = await page.locator(action.target).evaluate((host, scale) => {
        const root = host.querySelector('.plan45-comparison');
        if (!root) return { applied: false, reason: 'comparison renderer not mounted' };
        const elements = [root, ...root.querySelectorAll('*')];
        if (scale === '200%') {
          const baselineSizes = elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize) || 0);
          elements.forEach((element, index) => {
            element.setAttribute('data-plan45-prior-font-size', element.style.getPropertyValue('font-size'));
            element.setAttribute('data-plan45-prior-font-priority', element.style.getPropertyPriority('font-size'));
            element.style.setProperty('font-size', `${baselineSizes[index] * 2}px`, 'important');
          });
          root.dataset.plan45TextScale = '200%';
          return {
            applied: true,
            scale: root.dataset.plan45TextScale,
            promptBefore: baselineSizes[elements.indexOf(root.querySelector('.plan45-prompt'))],
            promptAfter: Number.parseFloat(getComputedStyle(root.querySelector('.plan45-prompt')).fontSize),
          };
        }
        elements.forEach((element) => {
          const priorSize = element.getAttribute('data-plan45-prior-font-size');
          const priorPriority = element.getAttribute('data-plan45-prior-font-priority');
          if (priorSize) element.style.setProperty('font-size', priorSize, priorPriority || '');
          else element.style.removeProperty('font-size');
          element.removeAttribute('data-plan45-prior-font-size');
          element.removeAttribute('data-plan45-prior-font-priority');
        });
        delete root.dataset.plan45TextScale;
        return { applied: true, scale: '100%', promptAfter: Number.parseFloat(getComputedStyle(root.querySelector('.plan45-prompt')).fontSize) };
      }, action.value);
      if (!result.applied || (action.value === '200%' && Math.abs(result.promptAfter - result.promptBefore * 2) > 0.1)) {
        throw new Error(`Plan 45 text scaling did not apply the requested ${action.value} change: ${JSON.stringify(result)}`);
      }
      console.log(`Plan 45 learner text scale ${routeId}: ${JSON.stringify(result)}`);
      break;
    }

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
              boxShadow: getComputedStyle(boundary).boxShadow,
              backgroundColor: getComputedStyle(boundary).backgroundColor,
            };
          });
          const highlightedBoundaryCount = boundaryGeometry.filter((entry) => entry.boxShadow !== 'none').length;
          const runningAnimations = track.getAnimations({ subtree: true })
            .filter((animation) => animation.playState === 'running').length;
          if (track.dataset.numerator !== String(options.numerator)
            || track.dataset.denominator !== String(options.denominator)) {
            throw new Error(`reduced Replay ${label} did not reach ${options.numerator}/${options.denominator}: ${track.dataset.numerator}/${track.dataset.denominator}`);
          }
          if (root.querySelector('.fraction-bar-in-place-replay') || runningAnimations !== 0) {
            throw new Error(`reduced Replay ${label} left stale replay controls or running effects (${runningAnimations})`);
          }
          if (highlightedBoundaryCount !== 0) {
            throw new Error(`reduced Replay ${label} retained a boundary highlight: ${JSON.stringify(boundaryGeometry)}`);
          }
          if (boundaryGeometry.some((entry) => entry.backgroundColor !== 'rgb(255, 255, 255)')) {
            throw new Error(`reduced Replay ${label} retained temporary boundary core paint: ${JSON.stringify(boundaryGeometry)}`);
          }
          if (boundaryGeometry.length !== Number(options.denominator) - 1
            || !boundaryGeometry.every((entry) => entry.connected && entry.heightDelta <= 0.5
              && entry.topDelta <= 0.5 && entry.bottomDelta <= 0.5 && entry.centerDelta <= 0.75)) {
            throw new Error(`reduced Replay ${label} geometry did not settle at its endpoint: ${JSON.stringify(boundaryGeometry)}`);
          }
          return {
            boundaryGeometry,
            highlightedBoundaryCount,
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
          const highlightedBoundaryCount = tracks.reduce((sum, track) => (
            sum + [...track.querySelectorAll('.fraction-bar-boundary')]
              .filter((boundary) => getComputedStyle(boundary).boxShadow !== 'none').length
          ), 0);
          const nonBaselineCoreBoundaryCount = tracks.reduce((sum, track) => (
            sum + [...track.querySelectorAll('.fraction-bar-boundary')]
              .filter((boundary) => getComputedStyle(boundary).backgroundColor !== 'rgb(255, 255, 255)').length
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
            highlightedBoundaryCount,
            nonBaselineCoreBoundaryCount,
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
          highlightedBoundaryCount: items.reduce((sum, item) => sum + item.highlightedBoundaryCount, 0),
          nonBaselineCoreBoundaryCount: items.reduce((sum, item) => sum + item.nonBaselineCoreBoundaryCount, 0),
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
      if (observed.highlightedBoundaryCount !== 0) {
        throw new Error(`static or reduced-motion route unexpectedly retained a subdivision highlight: ${JSON.stringify(observed)}`);
      }
      if (observed.nonBaselineCoreBoundaryCount !== 0) {
        throw new Error(`static or reduced-motion route unexpectedly retained non-baseline boundary core paint: ${JSON.stringify(observed)}`);
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

    if (type === 'plan39LocateContract') {
      const result = await page.evaluate(() => {
        const host = [...document.querySelectorAll('.app-visual-view, .app-linear-view')].find((element) => getComputedStyle(element).display !== 'none');
        const locate = host?.querySelector('.plan39-check-position');
        const root = host?.querySelector('.plan39-number-line');
        const source = root?.querySelector('.plan39-bar-track');
        const axis = root?.querySelector('.plan39-axis-frame');
        const prompt = host?.querySelector('.active-beat-prompt');
        const controls = host?.querySelector('.plan39-controls');
        prompt?.scrollIntoView({ block: 'start' });
        const candidates = root?.querySelectorAll('.plan39-candidate-point');
        const radios = root?.querySelectorAll('input[type="radio"]');
        const targets = [...(host?.querySelectorAll('.plan39-stepper-move, .plan39-candidate, .plan39-check-position, .plan39-continue') || [])];
        const rect = (element) => { const r = element.getBoundingClientRect(); return { left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height }; };
        const sourceBox = source && rect(source), axisBox = axis && rect(axis);
        const labels = [...(radios || [])].map((radio) => radio.getAttribute('aria-label') || '');
        const overlaps = targets.some((a, i) => targets.slice(i + 1).some((b) => {
          const x = rect(a), y = rect(b);
          return Math.min(x.right,y.right) - Math.max(x.left,y.left) > 0.5
            && Math.min(x.bottom,y.bottom) - Math.max(x.top,y.top) > 0.5;
        }));
        const undersized = targets.some((element) => { const r=rect(element); return r.width < 44 || r.height < 44; });
        const hitMiss = targets.some((element) => { const r=rect(element); const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2); return !hit || !(hit===element || element.contains(hit) || hit.contains(element)); });
        const accepted = root?.querySelector('.plan39-accepted-point, .plan39-accepted-connector');
        const boxesFit = [prompt, controls].every((element) => { if(!element) return false; const r=rect(element); return r.top >= 0 && r.bottom <= innerHeight; });
        const accessibleLeak = [...(root?.querySelectorAll('button, input, label, [role="radio"]') || [])].some((element) => /correct candidate|target candidate|answer is/i.test(`${element.getAttribute('aria-label') || ''} ${element.getAttribute('aria-description') || ''}`));
        return {
          viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
          beat: locate ? 'locate' : accepted ? 'resolved' : 'other',
          status: locate ? 'locate' : accepted ? 'resolved' : 'other',
          leak: Boolean(root?.matches('[data-correct="true"], [data-target="true"]') || root?.querySelector('[data-correct="true"], [data-target="true"], [data-answer="true"]') || accessibleLeak),
          feedback: Boolean(root?.querySelector('.plan39-feedback')),
          sourceBox, axisBox, aligned: !host?.classList.contains('app-visual-view') || Boolean(sourceBox && axisBox && Math.abs(sourceBox.left-axisBox.left)<=1 && Math.abs(sourceBox.right-axisBox.right)<=1),
          targetCount: targets.length, undersized, overlaps, hitMiss, boxesFit,
          radioCount: radios?.length || 0, candidateCount: candidates?.length || 0,
          labels, distinctLabels: labels.length === 0 || new Set(labels).size === labels.length,
          selected: root?.querySelector('.plan39-stepper-status[data-candidate-id], input[type="radio"]:checked')?.getAttribute('data-candidate-id') || null,
          checkEnabled: Boolean(locate && !locate.disabled),
          accepted: Boolean(accepted),
          scroll: { x: scrollX, y: scrollY },
          targets: targets.map((element) => ({ name: element.className || element.type || element.tagName.toLowerCase(), ...rect(element) })),
          promptBox: prompt ? rect(prompt) : null,
          controlsBox: controls ? rect(controls) : null,
        };
      });
      assertion.measurements = result;
      if (result.status !== 'locate' || result.feedback || result.accepted || !result.selected || !result.checkEnabled) throw new Error(`Plan39 preview-before-submit assertion failed: ${JSON.stringify(result)}`);
      if (result.leak) throw new Error(`Plan39 pre-submit target leakage assertion failed: ${JSON.stringify(result)}`);
      if (!result.aligned) throw new Error(`Plan39 endpoint alignment assertion failed: ${JSON.stringify(result)}`);
      if (result.undersized || result.overlaps || result.hitMiss || !result.boxesFit) throw new Error(`Plan39 touch target assertion failed: ${JSON.stringify(result)}`);
      if (!result.distinctLabels) throw new Error(`Plan39 linear candidate descriptions assertion failed: ${JSON.stringify(result)}`);
      continue;
    }
    if (type === 'plan39ResolveConnector') {
      const result = await page.evaluate(() => {
        const host = [...document.querySelectorAll('.app-visual-view')].find((element) => getComputedStyle(element).display !== 'none');
        const stack = host?.querySelector('.plan39-representation-stack');
        const bar = stack?.querySelector('.plan39-bar-track');
        const shadedParts = [...(stack?.querySelectorAll('.plan39-bar-part-shaded') || [])];
        const shadedEdge = shadedParts.at(-1);
        const point = stack?.querySelector('.plan39-accepted-point');
        const overlay = stack?.querySelector('.plan39-connector-overlay');
        const line = overlay?.querySelector('.plan39-accepted-connector');
        const matrix = overlay?.getScreenCTM();
        const endpoint = (x, y) => {
          if (!matrix || !overlay?.createSVGPoint) return null;
          const p = overlay.createSVGPoint(); p.x = Number(x); p.y = Number(y);
          const screen = p.matrixTransform(matrix); return { x: screen.x, y: screen.y };
        };
        if (!bar || !shadedEdge || !point || !line) return { present: false, hasBar: Boolean(bar), hasShadedEdge: Boolean(shadedEdge), hasAcceptedPoint: Boolean(point), hasOverlay: Boolean(overlay), hasLine: Boolean(line), hostFound: Boolean(host), stackFound: Boolean(stack) };
        const shadedRect = shadedEdge.getBoundingClientRect(), pointRect = point.getBoundingClientRect();
        const start = endpoint(line.getAttribute('x1'), line.getAttribute('y1'));
        const end = endpoint(line.getAttribute('x2'), line.getAttribute('y2'));
        const expectedStart = { x: shadedRect.right, y: shadedRect.bottom };
        const expectedEnd = { x: pointRect.left + pointRect.width / 2, y: pointRect.top + pointRect.height / 2 };
        const delta = (actual, expected) => actual ? Math.hypot(actual.x - expected.x, actual.y - expected.y) : Infinity;
        return { present: true, start, end, expectedStart, expectedEnd, startError: delta(start, expectedStart), endError: delta(end, expectedEnd), viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, scroll: { x: scrollX, y: scrollY } };
      });
      assertion.measurements = result;
      if (!result.present || result.startError > 2 || result.endError > 2 || result.end.y <= result.start.y) {
        throw new Error(`Plan39 resolved connector did not span source shaded edge to accepted point: ${JSON.stringify(result)}`);
      }
      continue;
    }
    if (type === 'plan39SourceForm') {
      const actual = await page.evaluate(() => ({
        numerator: document.querySelector('.plan39-source-fraction .symbolic-numerator')?.textContent?.trim(),
        denominator: document.querySelector('.plan39-source-fraction .symbolic-denominator')?.textContent?.trim(),
      }));
      if (actual.numerator !== String(assertion.numerator) || actual.denominator !== String(assertion.denominator)) {
        throw new Error(`Plan39 source form assertion failed: expected ${assertion.numerator}/${assertion.denominator}, got ${actual.numerator}/${actual.denominator}.`);
      }
      continue;
    }
    if (type === 'plan39PreviewId') {
      const selected = await page.evaluate(() => {
        const active = [...document.querySelectorAll('.app-visual-view, .app-linear-view')].find((element) => getComputedStyle(element).display !== 'none');
        return active?.querySelector('.plan39-stepper-status[data-candidate-id], input[type="radio"]:checked')?.getAttribute('data-candidate-id') || null;
      });
      if (selected !== value) throw new Error(`Plan39 pending preview was not preserved: expected ${value}, got ${selected}.`);
      continue;
    }
    if (type === 'plan39OddThirds') {
      const actual = await page.evaluate(() => {
        const track = document.querySelector('.plan39-axis-frame');
        const trackBox = track?.getBoundingClientRect();
        const points = [...(document.querySelectorAll('.app-visual-view .plan39-candidate-point') || [])];
        const centers = points.map((point) => {
          const r = point.getBoundingClientRect();
          return trackBox?.width ? (r.left + r.width / 2 - trackBox.left) / trackBox.width : null;
        });
        return { count: points.length, centers };
      });
      if (actual.count !== 4 || actual.centers.some((center) => center !== null && Math.abs(center - 0.5) < 0.01)) {
        throw new Error(`Plan39 odd-thirds candidate assertion failed; midpoint benchmark must remain nonselectable: ${JSON.stringify(actual)}`);
      }
      continue;
    }

    if (type === 'viewportLayout') {
      const metrics = await page.evaluate((selectors) => {
        const describe = (selector) => {
          const element = selector ? document.querySelector(selector) : null;
          if (!element) return null;
          const box = element.getBoundingClientRect();
          return {
            x: Math.round(box.x * 100) / 100,
            y: Math.round(box.y * 100) / 100,
            width: Math.round(box.width * 100) / 100,
            height: Math.round(box.height * 100) / 100,
            visible: box.width > 0 && box.height > 0,
          };
        };
        const root = document.documentElement;
        return {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          deviceScaleFactor: window.devicePixelRatio,
          document: { width: root.scrollWidth, height: root.scrollHeight },
          scroll: { x: window.scrollX, y: window.scrollY },
          horizontalOverflow: root.scrollWidth > root.clientWidth,
          verticalScrollRange: Math.max(0, root.scrollHeight - root.clientHeight),
          elements: Object.fromEntries(Object.entries(selectors).map(([name, selector]) => (
            [name, describe(selector)]
          ))),
        };
      }, assertion.selectors || {});
      if (assertion.expectedDeviceScaleFactor !== undefined
        && metrics.deviceScaleFactor !== assertion.expectedDeviceScaleFactor) {
        throw new Error(`Route "${routeId}" expected device scale factor ${assertion.expectedDeviceScaleFactor}, received ${metrics.deviceScaleFactor}.`);
      }
      if (assertion.requireNoHorizontalOverflow && metrics.horizontalOverflow) {
        throw new Error(`Route "${routeId}" has horizontal document overflow: ${JSON.stringify(metrics)}`);
      }
      for (const [name, geometry] of Object.entries(metrics.elements)) {
        if (assertion.requireVisibleElements && (!geometry || !geometry.visible)) {
          throw new Error(`Route "${routeId}" is missing visible viewport element "${name}": ${JSON.stringify(metrics)}`);
        }
      }
      console.log(`Viewport measure ${routeId}: ${JSON.stringify(metrics)}`);
      continue;
    }

    if (type === 'plan45ModelFidelity') {
      const measurements = await page.evaluate((expectedModels) => {
        const host = [...document.querySelectorAll('.app-visual-view')]
          .find((element) => getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
        const figures = [...(host?.querySelectorAll('figure.plan45-model') || [])];
        const expression = host?.querySelector('.plan45-expression');
        const models = expectedModels.map((expected) => {
          const prefix = expected.side === 'first' ? 'First amount' : 'Second amount';
          const ariaPrefix = expected.side === 'first' ? 'First fraction' : 'Second fraction';
          const figure = figures.find((candidate) => candidate.querySelector('figcaption')?.textContent?.trim() === prefix);
          const track = figure?.querySelector('.plan45-model-track');
          const parts = [...(track?.querySelectorAll('.plan45-model-part') || [])];
          const shaded = parts.filter((part) => part.classList.contains('is-shaded'));
          const trackRect = track?.getBoundingClientRect();
          const widths = parts.map((part) => part.getBoundingClientRect().width);
          const aria = track?.getAttribute('aria-label') || '';
          const expressionFraction = [...(expression?.querySelectorAll('.symbolic-fraction') || [])]
            .find((fraction) => fraction.getAttribute('aria-label') === `${ariaPrefix} ${expected.numerator} over ${expected.denominator}`);
          const expressionRect = expression?.getBoundingClientRect();
          const fractionRect = expressionFraction?.getBoundingClientRect();
          return {
            side: expected.side,
            expectedFraction: `${expected.numerator}/${expected.denominator}`,
            aria,
            partCount: parts.length,
            shadedCount: shaded.length,
            trackWidth: trackRect?.width ?? null,
            partWidths: widths,
            horizontallyContained: Boolean(trackRect && trackRect.left >= -1 && trackRect.right <= innerWidth + 1),
            sourceFractionMatchesExpression: Boolean(expressionFraction),
            sourceFractionContained: Boolean(expressionRect && fractionRect
              && fractionRect.left >= expressionRect.left - 1 && fractionRect.right <= expressionRect.right + 1
              && fractionRect.left >= -1 && fractionRect.right <= innerWidth + 1),
          };
        });
        const widths = models.map(({ trackWidth }) => trackWidth).filter(Number.isFinite);
        return {
          viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
          modelCount: figures.length,
          expectedCount: expectedModels.length,
          models,
          equalWholeWidths: widths.length < 2 || Math.max(...widths) - Math.min(...widths) <= 1,
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          scroll: { x: scrollX, y: scrollY },
        };
      }, assertion.models || []);
      assertion.measurements = measurements;
      if (measurements.modelCount !== measurements.expectedCount || !measurements.equalWholeWidths || measurements.horizontalOverflow
        || measurements.models.some((model) => model.partCount !== Number(model.expectedFraction.split('/')[1])
          || model.shadedCount !== Number(model.expectedFraction.split('/')[0])
          || !model.aria.includes(`${model.expectedFraction.split('/')[0]} of ${model.expectedFraction.split('/')[1]} equal parts`)
          || !model.horizontallyContained || !model.sourceFractionMatchesExpression || !model.sourceFractionContained)) {
        throw new Error(`Plan 45 fraction containment or honest-unit fidelity failed: ${JSON.stringify(measurements)}`);
      }
      console.log(`Plan 45 model fidelity ${routeId}: ${JSON.stringify(measurements)}`);
      continue;
    }

    if (type === 'plan45LinearModel') {
      const actual = await page.evaluate((expected) => {
        const host = [...document.querySelectorAll('.app-linear-view')]
          .find((element) => getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden');
        const models = [...(host?.querySelectorAll('.plan45-linear-model') || [])];
        const expectedLabel = expected.side === 'first' ? 'First amount' : 'Second amount';
        return {
          visibleCount: models.length,
          modelText: models.map((model) => model.textContent.trim()),
          expectedLabel,
          expectedFraction: `${expected.numerator}/${expected.denominator}`,
          viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        };
      }, assertion);
      assertion.measurements = actual;
      if (actual.visibleCount !== 1 || actual.horizontalOverflow
        || !actual.modelText[0].includes(actual.expectedLabel)
        || !actual.modelText[0].includes(`${assertion.numerator} of ${assertion.denominator} equal parts`)) {
        throw new Error(`Plan 45 linear source model did not communicate the selected fraction equivalently: ${JSON.stringify(actual)}`);
      }
      console.log(`Plan 45 linear model ${routeId}: ${JSON.stringify(actual)}`);
      continue;
    }

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
        const fractionMatch = typeof value === 'string' && value.match(/^(\d+)\s*\/\s*(\d+)$/);
        if (fractionMatch) {
          const num = fractionMatch[1];
          const den = fractionMatch[2];
          const disclosed = await locator.first().evaluate((root, { num, den, rawValue }) => {
            const normalizedText = (root.textContent || '').replace(/\s+/g, ' ');
            if (normalizedText.includes(rawValue) || normalizedText.includes(`${num} / ${den}`)) {
              return true;
            }
            const allElements = [root, ...root.querySelectorAll('*')];
            const fractionLabelRegex = new RegExp(`(?:\\b|^)${num}\\s*(?:\\/|over|of)\\s*${den}(?:\\b|$)`, 'i');
            for (const el of allElements) {
              const ariaLabel = el.getAttribute('aria-label') || '';
              if (fractionLabelRegex.test(ariaLabel) || ariaLabel.includes(rawValue)) {
                return true;
              }
              const title = el.getAttribute('title') || '';
              if (fractionLabelRegex.test(title) || title.includes(rawValue)) {
                return true;
              }
              const alt = el.getAttribute('alt') || '';
              if (fractionLabelRegex.test(alt) || alt.includes(rawValue)) {
                return true;
              }
              const ariaDesc = el.getAttribute('aria-description') || '';
              if (fractionLabelRegex.test(ariaDesc) || ariaDesc.includes(rawValue)) {
                return true;
              }
              if (el.classList.contains('symbolic-fraction')) {
                const numEl = el.querySelector('.symbolic-numerator');
                const denEl = el.querySelector('.symbolic-denominator');
                if (numEl && denEl && numEl.textContent.trim() === String(num) && denEl.textContent.trim() === String(den)) {
                  return true;
                }
              }
              const style = window.getComputedStyle(el);
              const isColumn = style.flexDirection === 'column' || style.flexDirection === 'column-reverse';
              if (isColumn || el.childElementCount === 2) {
                const children = Array.from(el.children).filter((c) => c.textContent.trim() !== '');
                if (children.length === 2) {
                  const topText = children[0].textContent.trim();
                  const bottomText = children[1].textContent.trim();
                  if (topText === String(num) && bottomText === String(den)) {
                    return true;
                  }
                }
              }
            }
            return false;
          }, { num, den, rawValue: value });

          if (disclosed) {
            throw new Error(`Route "${routeId}" assertion failed: selector "${target}" unexpectedly contains text "${value}".`);
          }
        }
        break;
      }

      case 'notContainsAccessibleText': {
        const snapshot = await locator.first().ariaSnapshot();
        if (snapshot.includes(value)) {
          throw new Error(`Route "${routeId}" assertion failed: accessible content unexpectedly contains text "${value}" in "${target}".`);
        }
        break;
      }

      case 'containsAccessibleText': {
        const snapshot = await locator.first().ariaSnapshot();
        if (!snapshot.includes(value)) {
          throw new Error(`Route "${routeId}" assertion failed: accessible content in "${target}" does not contain text "${value}".`);
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
    plan34WitnessSeed = null,
    plan18WitnessSeed = null,
    plan38WitnessSeed = null,
    plan40WitnessSeed = null,
    plan39WitnessSeed = null,
    plan39Repair02WitnessSeed = null,
    plan39Repair03WitnessSeed = null,
  } = options;

  if (seededVisualDefect !== null && !Object.hasOwn(seededPrototypeVisualDefects, seededVisualDefect)) {
    throw new Error(`Unknown seeded prototype visual defect "${seededVisualDefect}".`);
  }
  if (motionWitnessSeed !== null && !Object.hasOwn(motionWitnessSeeds, motionWitnessSeed)) {
    throw new Error(`Unknown motion witness seed "${motionWitnessSeed}".`);
  }
  if (plan34WitnessSeed !== null && !Object.hasOwn(plan34WitnessSeeds, plan34WitnessSeed)) {
    throw new Error(`Unknown Plan 34 witness seed "${plan34WitnessSeed}".`);
  }
  if (plan18WitnessSeed !== null && !Object.hasOwn(plan18WitnessSeeds, plan18WitnessSeed)) {
    throw new Error(`Unknown Plan 18 witness seed "${plan18WitnessSeed}".`);
  }
  if (plan38WitnessSeed !== null && !Object.hasOwn(plan38WitnessSeeds, plan38WitnessSeed)) {
    throw new Error(`Unknown Plan 38 witness seed "${plan38WitnessSeed}".`);
  }
  if (plan40WitnessSeed !== null && !Object.hasOwn(plan40WitnessSeeds, plan40WitnessSeed)) {
    throw new Error(`Unknown Plan 40 witness seed "${plan40WitnessSeed}".`);
  }
  if (plan39WitnessSeed !== null && !Object.hasOwn(plan39WitnessSeeds, plan39WitnessSeed)) throw new Error(`Unknown Plan 39 witness seed "${plan39WitnessSeed}".`);
  if (plan39Repair02WitnessSeed !== null && !Object.hasOwn(plan39Repair02WitnessSeeds, plan39Repair02WitnessSeed)) {
    throw new Error(`Unknown Plan 39 Repair02 witness seed "${plan39Repair02WitnessSeed}".`);
  }
  if (plan39Repair03WitnessSeed !== null && !Object.hasOwn(plan39Repair03WitnessSeeds, plan39Repair03WitnessSeed)) {
    throw new Error(`Unknown Plan 39 Repair03 witness seed "${plan39Repair03WitnessSeed}".`);
  }

  if (!fs.existsSync(distDir)) {
    throw new Error('Built distribution (dist/) not found. Run `npm run build` before running route matrix.');
  }

  // Load matrix and registered conditions
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const contextMap = readPlan34ContextMap();
  const conditionsUrl = pathToFileURL(path.join(rootDir, 'src/app/conditions.js')).href;
  const conditionsModule = await import(conditionsUrl);
  const registeredConditions = conditionsModule.REGISTERED_CONDITIONS;

  // Static integrity check
  const integrity = await validateMatrixIntegrity(matrix, registeredConditions, contextMap);
  if (!integrity.valid) {
    for (const err of integrity.errors) {
      console.error(err);
    }
    throw new Error(`Route matrix integrity validation failed with ${integrity.errors.length} error(s).`);
  }

  execFileSync(process.execPath, [plan34HistoricalBuilderPath], { cwd: rootDir, stdio: verbose ? 'inherit' : 'ignore' });
  execFileSync(process.execPath, [plan18HistoricalBuilderPath], { cwd: rootDir, stdio: verbose ? 'inherit' : 'ignore' });
  if (!fs.existsSync(path.join(plan34HistoricalRootDir, 'plan34-historical-entry.html'))) {
    throw new Error('Plan 34 historical fixture build did not produce its temporary entry HTML.');
  }
  if (!fs.existsSync(path.join(plan18HistoricalRootDir, 'plan18-historical-entry.html'))) {
    throw new Error('Plan 18 historical fixture build did not produce its temporary entry HTML.');
  }
  execFileSync(process.execPath, [plan39HistoricalBuilderPath], { cwd: rootDir, stdio: verbose ? 'inherit' : 'ignore' });
  if (!fs.existsSync(path.join(plan39HistoricalRootDir, 'plan39-historical-v7-entry.html'))) {
    throw new Error('Plan 39 revision-1 historical fixture build did not produce its temporary entry HTML.');
  }
  execFileSync(process.execPath, [legacyNavigationBuilderPath], { cwd: rootDir, stdio: verbose ? 'inherit' : 'ignore' });
  if (!fs.existsSync(path.join(legacyNavigationRootDir, 'legacy-navigation-entry.html'))) {
    throw new Error('Legacy navigation fixture build did not produce its temporary entry HTML.');
  }

  // Start local server
  const server = createStaticServer({ historicalRootDir: plan34HistoricalRootDir, plan18HistoricalRootDir, plan39HistoricalRootDir, legacyNavigationRootDir });
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

  const effectiveFilter = motionWitnessSeed ? motionWitnessSeeds[motionWitnessSeed].routeId
    : plan34WitnessSeed ? plan34WitnessSeeds[plan34WitnessSeed].routeId
      : plan18WitnessSeed ? plan18WitnessSeeds[plan18WitnessSeed].routeId
        : plan38WitnessSeed ? plan38WitnessSeeds[plan38WitnessSeed].routeId
          : plan40WitnessSeed ? plan40WitnessSeeds[plan40WitnessSeed].routeId
            : plan39Repair03WitnessSeed ? plan39Repair03WitnessSeeds[plan39Repair03WitnessSeed].routeId
              : plan39Repair02WitnessSeed ? plan39Repair02WitnessSeeds[plan39Repair02WitnessSeed].routeId
              : plan39WitnessSeed ? plan39WitnessSeeds[plan39WitnessSeed].routeId : filter;
  const routesToRun = selectRoutesForRun(matrix.routes, effectiveFilter);
  const routeExecutions = expandRouteExecutions(routesToRun);

  if (verbose) {
    console.log(`Executing ${routeExecutions.length} browser witnesses from ${routesToRun.length} route rows using browser channel: ${browserChannel || 'default chromium'}...`);
  }

  try {
    for (const execution of routeExecutions) {
      const { route, motionMode } = execution;
      const routeContext = resolveRouteContext(route, contextMap);
      const resultId = route.id + ' [' + motionMode + ']';
      const startTime = Date.now();
      const contextOptions = {
        viewport: route.viewport,
        reducedMotion: motionMode === 'reduced-motion' ? 'reduce' : 'no-preference',
        ...(route.inputMode === 'touch' ? { hasTouch: true } : {}),
        ...(route.deviceScaleFactor !== undefined ? { deviceScaleFactor: route.deviceScaleFactor } : {}),
      };

      const context = await browser.newContext(contextOptions);
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      let activeRouteAction = null;

      try {
        const startingSurface = resolveStartingSurface(routeContext.startingSurface);
        if (!startingSurface) throw new Error(`Route "${route.id}" has no resolved starting surface for context "${routeContext.id}".`);
        const startUrl = new URL(startingSurface.path, baseUrl).toString();
        if (usesFixedAdditionDay(route.id, routeContext.id)) await page.clock.setFixedTime(new Date('1970-01-01T12:00:00Z'));
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
          activeRouteAction = action;
          if (plan34WitnessSeed && route.id === plan34WitnessSeeds[plan34WitnessSeed].routeId
            && action.method === 'assert'
            && action.description === plan34WitnessSeeds[plan34WitnessSeed].injectBeforeDescription) {
            const seed = plan34WitnessSeeds[plan34WitnessSeed];
            await page.locator(seed.selector).evaluate((element, value) => {
              const seedNode = document.createElement('span');
              seedNode.className = 'plan34-test-witness-seed';
              seedNode.textContent = value;
              element.appendChild(seedNode);
            }, seed.text);
          }
          if (plan18WitnessSeed && route.id === plan18WitnessSeeds[plan18WitnessSeed].routeId
            && action.method === 'assert'
            && action.description === plan18WitnessSeeds[plan18WitnessSeed].injectBeforeDescription) {
            if (plan18WitnessSeed === 'wrong-transform-side') {
              const seed = plan18WitnessSeeds[plan18WitnessSeed];
              await page.locator(seed.selector).evaluate((element, seeded) => element.setAttribute(seeded.attribute, seeded.value), {
                attribute: seed.attribute,
                value: seed.value,
              });
            } else {
              const seed = plan18WitnessSeeds[plan18WitnessSeed];
              await page.locator(seed.selector).evaluate((element) => {
                const input = document.createElement('input');
                input.id = 'decide-common-denominator-input';
                input.type = 'number';
                input.setAttribute('aria-label', 'test-seeded stale denominator response');
                element.appendChild(input);
              });
            }
          }
          if (plan38WitnessSeed && route.id === plan38WitnessSeeds[plan38WitnessSeed].routeId
            && action.description === plan38WitnessSeeds[plan38WitnessSeed].injectBeforeDescription) {
            const seed = plan38WitnessSeeds[plan38WitnessSeed];
            if (seed.style) {
              await page.addStyleTag({ content: seed.style });
            } else if (seed.mutation === 'erase-operation-draft') {
              await page.locator('.app-view-controls .app-secondary-button').evaluate((toggle) => {
                toggle.addEventListener('click', () => {
                  const denominator = document.querySelector('.app-linear-view #linear-operate-fraction-denominator-input');
                  if (!denominator) throw new Error('Plan 38 draft-loss seed could not find the newly mounted denominator.');
                  denominator.value = '';
                }, { once: true });
              });
            } else if (seed.mutation === 'focus-denominator-after-view-switch') {
              await page.locator('.app-view-controls .app-secondary-button').evaluate((toggle) => {
                toggle.addEventListener('click', () => {
                  const denominator = document.querySelector('.app-linear-view #linear-operate-fraction-denominator-input');
                  if (!denominator) throw new Error('Plan 38 wrong-focus seed could not find the newly mounted denominator.');
                  denominator.focus();
                }, { once: true });
              });
            } else if (seed.mutation === 'leak-answer') {
              await page.locator('.app-visual-view .active-beat-prompt').evaluate((el) => {
                const span = document.createElement('span');
                span.textContent = ' 0/9 is left.';
                el.appendChild(span);
              });
            } else if (seed.mutation === 'addition-semantics') {
              await page.locator('.app-visual-view .active-beat-section').evaluate((el) => {
                const span = document.createElement('span');
                span.textContent = ' + ';
                el.appendChild(span);
              });
            } else if (seed.mutation === 'action-as-answer') {
              await page.locator('.app-visual-view .active-beat-controls').evaluate((el) => {
                el.innerHTML = '<button type="button" class="control-btn">Finish</button>';
              });
            }
          }
          if (plan40WitnessSeed && route.id === plan40WitnessSeeds[plan40WitnessSeed].routeId
            && action.description === plan40WitnessSeeds[plan40WitnessSeed].injectBeforeDescription) {
            const seed = plan40WitnessSeeds[plan40WitnessSeed];
            if (seed.style) {
              await page.addStyleTag({ content: seed.style });
            } else if (seed.mutation === 'addition-wording') {
              await page.locator('.app-visual-view .active-beat-section').evaluate((el) => {
                const span = document.createElement('span');
                span.textContent = ' + ';
                el.appendChild(span);
              });
            } else if (seed.mutation?.startsWith('premature-result-leak') || seed.mutation === 'difference-leak') {
              const derived = await derivePlan40ProhibitedResult('plan40-construct-half-fifth-10');
              const { numerator, denominator, fractionText } = derived;
              await page.locator('.app-visual-view .active-beat-prompt').evaluate((el, { mutation, numerator, denominator, fractionText }) => {
                const span = document.createElement('span');
                span.className = 'premature-result-leak-test';
                if (mutation === 'premature-result-leak-stacked') {
                  span.innerHTML = `<span style="display:inline-flex;flex-direction:column"><span>${numerator}</span><span style="border-top:1px solid">${denominator}</span></span>`;
                } else if (mutation === 'premature-result-leak-accessible') {
                  span.setAttribute('role', 'img');
                  span.setAttribute('aria-label', fractionText);
                } else {
                  span.textContent = ` ${fractionText}`;
                }
                el.appendChild(span);
              }, { mutation: seed.mutation, numerator, denominator, fractionText });
            } else if (seed.mutation === 'missing-inputs') {
              await page.locator('.app-visual-view .active-beat-controls').evaluate((el) => {
                el.innerHTML = '<button type="button" class="control-btn">Finish</button>';
              });
            }
          }
          const seededAction = motionWitnessSeed
            && route.id === motionWitnessSeeds[motionWitnessSeed].routeId
            && (motionWitnessSeeds[motionWitnessSeed].step === undefined
              || action.step === motionWitnessSeeds[motionWitnessSeed].step)
            && action.method === 'clickAndObserveSubdivision'
            ? { ...action, motionWitnessSeed }
            : plan39WitnessSeed && route.id === plan39WitnessSeeds[plan39WitnessSeed].routeId && action.method === 'plan39Witness'
              ? { ...action, seed: plan39WitnessSeed }
            : plan39Repair02WitnessSeed && route.id === plan39Repair02WitnessSeeds[plan39Repair02WitnessSeed].routeId
              && action.method === 'plan39Repair02Boundary'
              ? { ...action, seed: plan39Repair02WitnessSeed }
            : plan39Repair03WitnessSeed && route.id === plan39Repair03WitnessSeeds[plan39Repair03WitnessSeed].routeId
              && action.method === 'plan39Repair03AnchorWitness'
              ? { ...action, seed: plan39Repair03WitnessSeed }
            : action;
          if (['completePlan39BridgeSet', 'completePlan39BridgeRecovery'].includes(seededAction.method)) {
            seededAction.inputMode = route.inputMode || 'mouse';
          }
          const actionWithViewport = seededAction.method === 'completePlan45ComparisonJourney'
            ? { ...seededAction, routeViewport: route.viewport }
            : seededAction;
          await executeAction(page, actionWithViewport, route.id, routeContext);
          if (usesFixedAdditionDay(route.id, routeContext.id) && action.target === '.app-practice-button' && ['click', 'tap', 'keyboardActivate'].includes(action.method)) {
            const current = await page.locator('.app-episode').getAttribute('data-current-item-id');
            if (current !== 'two-thirds-plus-one-fourth') throw new Error(`Featured addition opened unexpected item: ${current}`);
          }
        }

        // Capture output for negative control / sameness check
        const capturedVal = await captureOutput(page, route.expect.capture);
        captures.set(routeCaptureKey(route.id, motionMode), capturedVal);
        captures.set(route.id, capturedVal);

        // Verify assertions
        await verifyAssertions(page, route.expect.assertions, route.id);

        const duration = Date.now() - startTime;
        if (route.knownDefect) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'known-defect', duration, route });
          if (verbose) {
            console.log(`  ⚠ ${resultId} (${duration}ms) [KNOWN DEFECT: ${route.knownDefect.id} - ${route.knownDefect.description}]`);
          }
        } else {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'pass', duration, route });
          if (verbose) {
          console.log(`  ✓ ${resultId} (${duration}ms) [${routeContext.id || routeContext.startingSurface}]`);
          }
        }
      } catch (err) {
        const duration = Date.now() - startTime;
        if (activeRouteAction?.description) err.message = `${err.message} (route action: ${activeRouteAction.description})`;
        if (plan34WitnessSeed && route.id === plan34WitnessSeeds[plan34WitnessSeed].routeId
          && err.message.includes(plan34WitnessSeeds[plan34WitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [intended assertion detected seed: ${plan34WitnessSeed}; ${err.message}]`);
        } else if (plan18WitnessSeed && route.id === plan18WitnessSeeds[plan18WitnessSeed].routeId
          && err.message.includes(plan18WitnessSeeds[plan18WitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [intended assertion detected seed: ${plan18WitnessSeed}; ${err.message}]`);
        } else if (plan38WitnessSeed && route.id === plan38WitnessSeeds[plan38WitnessSeed].routeId
          && err.message.includes(plan38WitnessSeeds[plan38WitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [intended assertion detected seed: ${plan38WitnessSeed}; ${err.message}]`);
        } else if (plan40WitnessSeed && route.id === plan40WitnessSeeds[plan40WitnessSeed].routeId
          && err.message.includes(plan40WitnessSeeds[plan40WitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [intended assertion detected seed: ${plan40WitnessSeed}; ${err.message}]`);
        } else if (plan39WitnessSeed && route.id === plan39WitnessSeeds[plan39WitnessSeed].routeId
          && err.message.includes(plan39WitnessSeeds[plan39WitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [intended assertion detected seed: ${plan39WitnessSeed}; ${err.message}]`);
        } else if (plan39Repair02WitnessSeed && route.id === plan39Repair02WitnessSeeds[plan39Repair02WitnessSeed].routeId
          && err.message.includes(plan39Repair02WitnessSeeds[plan39Repair02WitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [Repair02 assertion detected seed: ${plan39Repair02WitnessSeed}; ${err.message}]`);
        } else if (plan39Repair03WitnessSeed && route.id === plan39Repair03WitnessSeeds[plan39Repair03WitnessSeed].routeId
          && err.message.includes(plan39Repair03WitnessSeeds[plan39Repair03WitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: routeContext.id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [Repair03 assertion detected seed: ${plan39Repair03WitnessSeed}; ${err.message}]`);
        } else if (motionWitnessSeed && route.id === motionWitnessSeeds[motionWitnessSeed].routeId
          && err.message.includes(motionWitnessSeeds[motionWitnessSeed].failure)) {
          routeResults.push({ id: resultId, routeId: route.id, context: resolveRouteContext(route, contextMap).id, motionMode, status: 'seed-detected', error: err.message, duration, route });
          console.log(`  ✓ ${resultId} (${duration}ms) [seed detected at intended assertion: ${motionWitnessSeed}; ${err.message}]`);
        } else if (route.knownDefect) {
          const cleanMsg = err.message.endsWith('.') ? err.message : `${err.message}.`;
          const defectErrMsg = `FATAL: Route "${route.id}" is marked with knownDefect "${route.knownDefect.id}", but stopped exhibiting the defect: ${cleanMsg} If this defect has been repaired, retire the "knownDefect" marker and invert the expectation assertion.`;
          routeResults.push({ id: resultId, routeId: route.id, context: resolveRouteContext(route, contextMap).id, motionMode, status: 'fail', error: defectErrMsg, duration, route });
          console.error(`  ✗ ${resultId} (${duration}ms): ${defectErrMsg}`);
        } else {
          routeResults.push({ id: resultId, routeId: route.id, context: resolveRouteContext(route, contextMap).id, motionMode, status: 'fail', error: err.message, duration, route });
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
  if (plan34WitnessSeed && (seedDetected !== 1 || failed !== 0 || routeResults.length !== 1)) {
    throw new Error(`Plan 34 witness seed "${plan34WitnessSeed}" did not produce exactly one intended failure; detected=${seedDetected}, failed=${failed}, executions=${routeResults.length}.`);
  }
  if (plan18WitnessSeed && (seedDetected !== 1 || failed !== 0 || routeResults.length !== 1)) {
    throw new Error(`Plan 18 witness seed "${plan18WitnessSeed}" did not produce exactly one intended failure; detected=${seedDetected}, failed=${failed}, executions=${routeResults.length}.`);
  }
  if (plan40WitnessSeed) {
    assertPlan40SeedInvariant({ seedDetected, failed, total: routeResults.length }, plan40WitnessSeed);
  }
  if (plan39Repair03WitnessSeed && (seedDetected !== 1 || failed !== 0 || routeResults.length !== 1)) {
    throw new Error(`Plan 39 Repair03 witness seed "${plan39Repair03WitnessSeed}" did not produce exactly one intended failure; detected=${seedDetected}, failed=${failed}, executions=${routeResults.length}.`);
  }

  if (routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN18-'))) {
    const evidenceName = plan18WitnessSeed ? `plan18-seed-${plan18WitnessSeed}-receipt.json` : 'route-matrix-results.json';
    const evidencePath = path.join(rootDir, 'reports/development/plan-18-nested-denominator-addition/evidence', evidenceName);
    const plan18Results = routeResults.filter((result) => result.routeId.startsWith('ROUTE-PLAN18-'));
    fs.writeFileSync(evidencePath, `${JSON.stringify({
      capturedAt: new Date().toISOString(),
      browserChannel: browserChannel || 'default chromium',
      mode: plan18WitnessSeed ? `seed:${plan18WitnessSeed}` : 'clean',
      results: plan18Results.map(({ routeId, context, motionMode, status, error, route }) => ({
        routeId, context, motionMode, status, ...(error ? { error } : {}),
        viewport: route.viewport,
        inputMode: route.inputMode || 'pointer-click-and-keyboard',
        screenshots: route.actions.filter((action) => action.method === 'screenshot')
          .map(({ file, caption, screenshotEvidence }) => ({ file, caption, ...screenshotEvidence })),
      })),
    }, null, 2)}\n`);
  }

  const completedPlan34RouteIds = new Set(routeResults
    .filter((result) => result.routeId.startsWith('ROUTE-PLAN34-'))
    .map((result) => result.routeId));
  if (['ROUTE-PLAN34-CONSTRUCT-VISUAL-DEEP', 'ROUTE-PLAN34-INSPECT-LINEAR-DEEP',
    'ROUTE-PLAN34-THIRD-IDENTITY-WIDE', 'ROUTE-PLAN34-RETRY-RETURN-REENTRY']
    .every((routeId) => completedPlan34RouteIds.has(routeId))) {
    const layoutEvidence = routeResults
      .filter((result) => result.routeId.startsWith('ROUTE-PLAN34-'))
      .flatMap((result) => result.route.actions
        .filter((action) => action.method === 'screenshot' && action.screenshotEvidence?.layout)
        .map((action) => ({ routeId: result.routeId, context: result.context, motionMode: result.motionMode, ...action.screenshotEvidence })));
    const evidencePath = path.join(rootDir, 'reports/development/plan-34-reusable-full-addition-task-patterns/evidence/plan34-viewport-measurements.json');
    fs.writeFileSync(evidencePath, `${JSON.stringify({ capturedAt: new Date().toISOString(), measurements: layoutEvidence }, null, 2)}\n`);
  }

  if (routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN35-'))) {
    const evidencePath = path.join(rootDir, 'reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-route-matrix-summary.json');
    fs.writeFileSync(evidencePath, `${JSON.stringify({
      capturedAt: new Date().toISOString(),
      browserChannel: browserChannel || 'default chromium',
      mode: plan18WitnessSeed || motionWitnessSeed || plan34WitnessSeed ? 'seeded' : 'clean',
      routeRows: routesToRun.length,
      browserExecutions: routeResults.length,
      passed,
      knownDefects,
      failed,
      seedDetected,
      contexts: routeResults.reduce((counts, result) => {
        const key = result.context || 'prototype';
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      }, {}),
      results: routeResults.map(({ id, routeId, context, motionMode, status, error }) => ({
        id, routeId, context, motionMode, status, ...(error ? { error } : {}),
      })),
    }, null, 2)}\n`);
  }

  if (routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN38-'))) {
    const layoutEvidence = routeResults
      .filter((result) => result.routeId.startsWith('ROUTE-PLAN38-'))
      .flatMap((result) => result.route.actions
        .filter((action) => action.method === 'screenshot' && action.screenshotEvidence?.layout)
        .map((action) => ({ routeId: result.routeId, context: result.context, motionMode: result.motionMode, ...action.screenshotEvidence })));
    if (layoutEvidence.length > 0) {
      const layoutPath = path.join(rootDir, 'reports/development/plan-38-like-denominator-subtraction-batch/evidence/plan38-viewport-measurements.json');
      fs.writeFileSync(layoutPath, `${JSON.stringify({ capturedAt: new Date().toISOString(), measurements: layoutEvidence }, null, 2)}\n`);
    }

    const evidencePath = path.join(rootDir, 'reports/development/plan-38-like-denominator-subtraction-batch/evidence/plan38-route-matrix-summary.json');
    fs.writeFileSync(evidencePath, `${JSON.stringify({
      capturedAt: new Date().toISOString(),
      browserChannel: browserChannel || 'default chromium',
      mode: plan38WitnessSeed ? `seed:${plan38WitnessSeed}` : 'clean',
      routeRows: routesToRun.length,
      browserExecutions: routeResults.length,
      passed,
      knownDefects,
      failed,
      seedDetected,
      contexts: routeResults.reduce((counts, result) => {
        const key = result.context || 'prototype';
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      }, {}),
      results: routeResults.map(({ id, routeId, context, motionMode, status, error }) => ({
        id, routeId, context, motionMode, status, ...(error ? { error } : {}),
      })),
    }, null, 2)}\n`);
  }

  if (routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN40-'))) {
    if (!plan40WitnessSeed) {
      const layoutEvidence = routeResults
        .filter((result) => result.routeId.startsWith('ROUTE-PLAN40-'))
        .flatMap((result) => {
          const direct = result.route.actions
            .filter((action) => action.method === 'screenshot' && action.screenshotEvidence?.layout)
            .map((action) => ({ routeId: result.routeId, context: result.context, motionMode: result.motionMode, ...action.screenshotEvidence }));
          const generated = result.route.actions
            .flatMap((action) => (action.generatedActions || [])
              .filter((gen) => gen.method === 'screenshot' && gen.screenshotEvidence?.layout)
              .map((gen) => ({ routeId: result.routeId, context: result.context, motionMode: result.motionMode, ...gen.screenshotEvidence })));
          return [...direct, ...generated];
        });
      if (layoutEvidence.length > 0) {
        const layoutPath = path.join(rootDir, 'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-viewport-measurements.json');
        fs.mkdirSync(path.dirname(layoutPath), { recursive: true });
        fs.writeFileSync(layoutPath, `${JSON.stringify({ capturedAt: new Date().toISOString(), measurements: layoutEvidence }, null, 2)}\n`);
      }

      const evidencePath = path.join(rootDir, 'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-route-matrix-summary.json');
      fs.mkdirSync(path.dirname(evidencePath), { recursive: true });
      fs.writeFileSync(evidencePath, `${JSON.stringify({
        capturedAt: new Date().toISOString(),
        browserChannel: browserChannel || 'default chromium',
        mode: 'clean',
        routeRows: routesToRun.length,
        browserExecutions: routeResults.length,
        passed,
        knownDefects,
        failed,
        seedDetected,
        contexts: routeResults.reduce((counts, result) => {
          const key = result.context || 'prototype';
          counts[key] = (counts[key] || 0) + 1;
          return counts;
        }, {}),
        results: routeResults.map(({ id, routeId, context, motionMode, status, error }) => ({
          id, routeId, context, motionMode, status, ...(error ? { error } : {}),
        })),
      }, null, 2)}\n`);
    } else {
      const seedReceiptPath = path.join(rootDir, `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-seed-${plan40WitnessSeed}-summary.json`);
      fs.mkdirSync(path.dirname(seedReceiptPath), { recursive: true });
      fs.writeFileSync(seedReceiptPath, `${JSON.stringify({
        capturedAt: new Date().toISOString(),
        browserChannel: browserChannel || 'default chromium',
        mode: `seed:${plan40WitnessSeed}`,
        routeRows: routesToRun.length,
        browserExecutions: routeResults.length,
        passed,
        knownDefects,
        failed,
        seedDetected,
        contexts: routeResults.reduce((counts, result) => {
          const key = result.context || 'prototype';
          counts[key] = (counts[key] || 0) + 1;
          return counts;
        }, {}),
        results: routeResults.map(({ id, routeId, context, motionMode, status, error }) => ({
          id, routeId, context, motionMode, status, ...(error ? { error } : {}),
        })),
      }, null, 2)}\n`);
    }
  }

  if (routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN39-'))) {
    const plan39EvidenceRoot = path.join(rootDir, 'reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence');
    fs.mkdirSync(plan39EvidenceRoot, { recursive: true });
    const routeDetails = routeResults.map((result) => {
      const actions = (result.route?.actions || []).flatMap((action) => [action, ...(action.generatedActions || [])]);
      return {
        id: result.id,
        routeId: result.routeId,
        context: result.context,
        motionMode: result.motionMode,
        status: result.status,
        ...(result.error ? { error: result.error } : {}),
        geometryChecks: actions.flatMap((action) => (action.assertions || [])
          .filter((assertion) => ['plan39LocateContract', 'plan39ResolveConnector'].includes(assertion.type) && assertion.measurements)
          .map((assertion) => ({ description: action.description, ...assertion.measurements }))),
        repair02Evidence: actions.filter((action) => action.repair02Evidence).flatMap((action) => Array.isArray(action.repair02Evidence)
          ? action.repair02Evidence : [action.repair02Evidence]),
        repair03Evidence: actions.filter((action) => action.repair03Evidence).map(({ repair03Evidence }) => repair03Evidence),
        screenshots: actions.filter((action) => action.method === 'screenshot' && action.screenshotEvidence)
          .map(({ screenshotEvidence }) => screenshotEvidence),
      };
    });
    if (!filter && !plan39WitnessSeed && !plan39Repair02WitnessSeed && !plan39Repair03WitnessSeed) {
      const includesRepair02 = routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN39-REPAIR02-'));
      const finalEvidenceRoot = includesRepair02
        ? path.join(plan39EvidenceRoot, 'repair02-current')
        : plan39EvidenceRoot;
      fs.mkdirSync(finalEvidenceRoot, { recursive: true });
      const summaryFileName = includesRepair02 ? 'repair02-final-unfiltered-route-summary.json' : 'plan39-route-matrix-summary.json';
      const viewportFileName = includesRepair02 ? 'repair02-final-unfiltered-viewport-measurements.json' : 'plan39-viewport-measurements.json';
      fs.writeFileSync(path.join(finalEvidenceRoot, summaryFileName), `${JSON.stringify({
        capturedAt: new Date().toISOString(),
        browserChannel: browserChannel || 'default chromium',
        mode: 'clean',
        baseline: { routeRows: 81, browserExecutions: 83, preserved: true },
        appendedRouteRows: matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN39-')).length,
        historicalPlan39Rows: matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN39-')
          && !route.id.startsWith('ROUTE-PLAN39-REPAIR02-') && !route.id.startsWith('ROUTE-PLAN39-REPAIR03-')).length,
        repair02AddedRows: matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN39-REPAIR02-')).length,
        repair03AddedRows: matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN39-REPAIR03-')).length,
        routeRows: routesToRun.length,
        browserExecutions: routeResults.length,
        passed, failed, seedDetected,
        results: routeDetails.map(({ geometryChecks, screenshots, ...result }) => result),
      }, null, 2)}\n`);
      fs.writeFileSync(path.join(finalEvidenceRoot, viewportFileName), `${JSON.stringify({
        capturedAt: new Date().toISOString(),
        measurements: [
          ...routeDetails.flatMap((result) => result.geometryChecks.map((measurement) => ({
            routeId: result.routeId, context: result.context, motionMode: result.motionMode,
            revision: 'historical-route-geometry', ...measurement,
          }))),
          ...routeDetails.flatMap((result) => result.repair02Evidence
            .filter((evidence) => evidence.geometry)
            .map((evidence) => ({
              routeId: result.routeId,
              context: result.context,
              motionMode: result.motionMode,
              revision: 'production-default-v8',
              itemId: evidence.itemId,
              selectedId: evidence.selectedId,
              ...evidence.geometry,
              resizedAlignment: evidence.resizedAlignment,
            }))),
        ],
        screenshots: routeDetails.flatMap((result) => result.screenshots.map((screenshot) => ({ routeId: result.routeId, context: result.context, motionMode: result.motionMode, ...screenshot }))),
      }, null, 2)}\n`);

      const plan43EvidenceRoot = path.join(rootDir, 'reports/development/plan-43-shared-episode-completion-and-progression/evidence');
      if (fs.existsSync(plan43EvidenceRoot)) {
        fs.writeFileSync(path.join(plan43EvidenceRoot, 'route-matrix-plan43-receipt.json'), `${JSON.stringify({
          capturedAt: new Date().toISOString(),
          browserChannel: browserChannel || 'default chromium',
          mode: 'clean',
          routeRows: routesToRun.length,
          browserExecutions: routeResults.length,
          passed,
          failed,
          seedDetected,
          contexts: routeResults.reduce((counts, result) => {
            const key = result.context || 'prototype';
            counts[key] = (counts[key] || 0) + 1;
            return counts;
          }, {}),
          results: routeDetails,
        }, null, 2)}\n`);
      }
    }
    if (plan39WitnessSeed) {
      fs.writeFileSync(path.join(plan39EvidenceRoot, `plan39-seed-${plan39WitnessSeed}-receipt.json`), `${JSON.stringify({
        capturedAt: new Date().toISOString(),
        browserChannel: browserChannel || 'default chromium',
        seed: plan39WitnessSeed,
        intendedFailure: plan39WitnessSeeds[plan39WitnessSeed].failure,
        routeRows: routesToRun.length,
        browserExecutions: routeResults.length,
        passed, failed, seedDetected,
        results: routeDetails,
      }, null, 2)}\n`);
    }
    if (routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN39-REPAIR02-'))) {
      const currentEvidenceDir = path.join(plan39EvidenceRoot, 'repair02-current');
      fs.mkdirSync(currentEvidenceDir, { recursive: true });
      const repair02Receipt = plan39Repair02WitnessSeed
        ? `repair02-seed-${plan39Repair02WitnessSeed}-receipt.json`
        : filter ? `repair02-filtered-${filter.replace(/[^a-z0-9-]/gi, '-')}.json` : 'repair02-clean-final-receipt.json';
      fs.writeFileSync(path.join(currentEvidenceDir, repair02Receipt), `${JSON.stringify({
        capturedAt: new Date().toISOString(),
        browserChannel: browserChannel || 'default chromium',
        mode: plan39Repair02WitnessSeed ? `seed:${plan39Repair02WitnessSeed}` : filter ? 'filtered' : 'clean',
        routeRows: routesToRun.length,
        browserExecutions: routeResults.length,
        passed,
        failed,
        seedDetected,
        results: routeDetails,
      }, null, 2)}\n`);
    }
    if (routeResults.some((result) => result.routeId.startsWith('ROUTE-PLAN39-REPAIR03-'))) {
      const currentEvidenceDir = path.join(plan39EvidenceRoot, 'repair03-current', 'route-runs');
      fs.mkdirSync(currentEvidenceDir, { recursive: true });
      const runStamp = new Date().toISOString().replace(/[^0-9TZ]/g, '');
      const runLabel = plan39Repair03WitnessSeed ? `seed-${plan39Repair03WitnessSeed}`
        : filter ? `filtered-${filter.replace(/[^a-z0-9-]/gi, '-')}` : 'clean';
      fs.writeFileSync(path.join(currentEvidenceDir, `repair03-${runLabel}-${runStamp}.json`), `${JSON.stringify({
        capturedAt: new Date().toISOString(),
        browserChannel: browserChannel || 'default chromium',
        mode: plan39Repair03WitnessSeed ? `seed:${plan39Repair03WitnessSeed}` : filter ? 'filtered' : 'clean',
        routeRows: routesToRun.length,
        browserExecutions: routeResults.length,
        passed,
        failed,
        seedDetected,
        results: routeDetails,
      }, null, 2)}\n`);
    }
  }

  return {
    total: routeResults.length,
    routeCount: routesToRun.length,
    passed,
    knownDefects,
    failed,
    seedDetected,
    results: routeResults,
    contexts: routeResults.reduce((counts, result) => {
      const key = result.context || 'prototype';
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {}),
  };
}

module.exports = {
  assertPlan40SeedInvariant,
  createStaticServer,
  derivePlan40ProhibitedResult,
  executeAction,
  expandRouteExecutions,
  getRouteMotionModes,
  motionWitnessSeeds,
  plan34WitnessSeeds,
  plan18WitnessSeeds,
  plan38WitnessSeeds,
  plan40WitnessSeeds,
  plan39WitnessSeeds,
  plan39Repair02WitnessSeeds,
  plan39Repair03WitnessSeeds,
  observeSubdivision,
  resolveStartingSurface,
  runRouteMatrix,
  selectRoutesForRun,
  validateMatrixIntegrity,
  usesFixedAdditionDay,
  validatePlan40ScreenshotLayout,
  verifyAssertions,
};

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  let filter = null;
  let verbose = true;
  let motionWitnessSeed = null;
  let plan34WitnessSeed = null;
  let plan18WitnessSeed = null;
  let plan38WitnessSeed = null;
  let plan40WitnessSeed = null;
  let plan39WitnessSeed = null;
  let plan39Repair02WitnessSeed = null;
  let plan39Repair03WitnessSeed = null;
  let preferredChannel = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--filter' && args[i + 1]) {
      filter = args[++i];
    } else if (args[i] === '--quiet') {
      verbose = false;
    } else if (args[i] === '--motion-witness-seed' && args[i + 1]) {
      motionWitnessSeed = args[++i];
    } else if (args[i] === '--plan34-witness-seed' && args[i + 1]) {
      plan34WitnessSeed = args[++i];
    } else if (args[i] === '--plan18-witness-seed' && args[i + 1]) {
      plan18WitnessSeed = args[++i];
    } else if (args[i] === '--plan38-witness-seed' && args[i + 1]) {
      plan38WitnessSeed = args[++i];
    } else if (args[i] === '--plan40-witness-seed' && args[i + 1]) {
      plan40WitnessSeed = args[++i];
    } else if (args[i] === '--plan39-witness-seed' && args[i + 1]) {
      plan39WitnessSeed = args[++i];
    } else if (args[i] === '--plan39-repair02-witness-seed' && args[i + 1]) {
      plan39Repair02WitnessSeed = args[++i];
    } else if (args[i] === '--plan39-repair03-witness-seed' && args[i + 1]) {
      plan39Repair03WitnessSeed = args[++i];
    } else if (args[i] === '--browser-channel' && args[i + 1]) {
      preferredChannel = args[++i];
    }
  }

  console.log('--- FractionFlow Reachable Behavior Route Contract Runner ---');
  runRouteMatrix({ filter, verbose, preferredChannel, motionWitnessSeed, plan34WitnessSeed, plan18WitnessSeed, plan38WitnessSeed, plan40WitnessSeed, plan39WitnessSeed, plan39Repair02WitnessSeed, plan39Repair03WitnessSeed })
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
      } else if (plan18WitnessSeed && summary.seedDetected !== 1) {
        console.error(`Plan 18 witness seed "${plan18WitnessSeed}" was not detected at its intended assertion.`);
        process.exit(1);
      } else if (plan38WitnessSeed && summary.seedDetected !== 1) {
        console.error(`Plan 38 witness seed "${plan38WitnessSeed}" was not detected at its intended assertion.`);
        process.exit(1);
      } else if (plan40WitnessSeed && (summary.seedDetected !== 1 || summary.failed !== 0 || summary.total !== 1)) {
        console.error(`Plan 40 witness seed "${plan40WitnessSeed}" did not produce exactly one intended failure (detected=${summary.seedDetected}, failed=${summary.failed}, total=${summary.total}).`);
        process.exit(1);
      } else if (plan39WitnessSeed && (summary.seedDetected !== 1 || summary.failed !== 0 || summary.total !== 1)) {
        console.error(`Plan 39 witness seed "${plan39WitnessSeed}" did not produce exactly one intended failure (detected=${summary.seedDetected}, failed=${summary.failed}, total=${summary.total}).`);
        process.exit(1);
      } else if (plan39Repair02WitnessSeed && (summary.seedDetected !== 1 || summary.failed !== 0 || summary.total !== 1)) {
        console.error(`Plan 39 Repair02 witness seed "${plan39Repair02WitnessSeed}" did not produce exactly one intended failure (detected=${summary.seedDetected}, failed=${summary.failed}, total=${summary.total}).`);
        process.exit(1);
      } else if (plan39Repair03WitnessSeed && (summary.seedDetected !== 1 || summary.failed !== 0 || summary.total !== 1)) {
        console.error(`Plan 39 Repair03 witness seed "${plan39Repair03WitnessSeed}" did not produce exactly one intended failure (detected=${summary.seedDetected}, failed=${summary.failed}, total=${summary.total}).`);
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
