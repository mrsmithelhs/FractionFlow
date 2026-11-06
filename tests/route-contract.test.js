import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';

const require = createRequire(import.meta.url);
const {
  expandRouteExecutions,
  motionWitnessSeeds,
  plan18WitnessSeeds,
  plan38WitnessSeeds,
  plan39WitnessSeeds,
  plan39Repair02WitnessSeeds,
  plan39Repair03WitnessSeeds,
  resolveStartingSurface,
  selectRoutesForRun,
  validateMatrixIntegrity,
} = require('../scripts/dev/run-route-matrix.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const matrixPath = path.resolve(__dirname, 'routes/route-matrix.json');
// Derived from the frozen, pre-Plan 17 54-row route matrix whose raw SHA-256 is
// 2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd.
const PRE_PLAN17_ROUTE_PREFIX_HASH = '861c315fa1cff3a3e3daa949c53c41a27d7bf27ba54a0981b02a5bd3f0e87650';

// Remove only the approved entry setup when checking the original route fingerprints.
const migratedEntryIndices = new Set([55, 56, ...Array.from({ length: 16 }, (_, i) => i + 65), ...Array.from({ length: 8 }, (_, i) => i + 91), 116]);
function originalEntryRoutes(routes) {
  return routes.map((route, index) => {
    if (route.id === 'ROUTE-ENTRY-GEAR-TAB') {
      expect(index).toBe(24);
      expect(route.actions).toEqual([
        { step: 1, method: 'pressKey', target: 'body', value: 'Tab', description: 'Tab to the practice button' },
        { step: 2, method: 'pressKey', target: '.app-practice-button', value: 'Tab', description: 'Tab onward to Start a practice session' },
        { method: 'assertFocused', target: '[data-session-entry="comparison"]', description: 'Verify Start a practice session has focus' },
        { method: 'pressKey', target: '[data-session-entry="comparison"]', value: 'Tab', description: 'Tab onward to Choose what to practice' },
        { method: 'assertFocused', target: '.app-chooser-button', description: 'Verify Choose has focus' },
        { method: 'pressKey', target: '.app-chooser-button', value: 'Tab', description: 'Tab onward to Settings' },
      ]);
      return { ...route, actions: [route.actions[0], { ...route.actions[1], description: 'Tab onward to the reviewer gear' }] };
    }
    if (route.id === 'ROUTE-ENTRY-BEGIN-RETURN-FOCUS') {
      expect(index).toBe(25);
      expect(route.expect.assertions[1]).toEqual({ type: 'activeElementEquals', target: 'activeElement', value: 'button.fraction-control.app-practice-choice.app-practice-button' });
      return { ...route, expect: { ...route.expect, assertions: [route.expect.assertions[0], { ...route.expect.assertions[1], value: 'button.fraction-control.app-practice-button' }] } };
    }
    if (!migratedEntryIndices.has(index)) return route;
    const actions = [];
    for (let i = 0; i < route.actions.length; i++) {
      const action = route.actions[i];
      if (action.target === '[data-entry-chooser]') {
        expect(action).toEqual({ method: 'click', target: '[data-entry-chooser]', description: 'Open practice chooser' });
        const next = route.actions[++i];
        expect(next?.target).toMatch(/^\[data-entry-role="browse"\]\[data-practice-type=/);
        actions.push({ ...next, target: next.target.replace('[data-entry-role="browse"]', '') });
      } else {
        expect(action.target || '').not.toMatch(/^\[data-entry-role="browse"\]\[data-practice-type=/);
        actions.push(action);
      }
    }
    expect(actions.length).toBeLessThan(route.actions.length);
    return { ...route, actions };
  });
}

it('fixes the addition day only for the named current production routes', () => {
  const { usesFixedAdditionDay } = require('../scripts/dev/run-route-matrix.js');
  expect(usesFixedAdditionDay('ROUTE-PLAN35-CURRENT-HIGH-VISUAL-ALL-21', 'production-default-v7')).toBe(true);
  expect(usesFixedAdditionDay('ROUTE-PLAN35-CURRENT-HIGH-VISUAL-ALL-21', 'historical-v6')).toBe(false);
  expect(usesFixedAdditionDay('ROUTE-PLAN43-ADDITION-CONSTRUCT', 'production-default-v7')).toBe(false);
});

it('changes historical fixture entries only by requesting the flat entry', () => {
  const pins = {
    'plan18-historical-entry.js': 'c510d3d60897c4aef774ff8ea66498df4f054bd5e5937bc33a81a9dec70951c2',
    'plan34-historical-entry.js': '5adaaf045baa7b5ab5478cfb2cd4a88b1848733aa8d517019ca52a2ce71e9e0f',
    'plan39-historical-v7-entry.js': 'bff50ae21a834b434c0aee430ffcf24b99460277ef90a71e895ce3a7ccc37b30',
  };
  for (const [name, pin] of Object.entries(pins)) {
    const source = fs.readFileSync(path.resolve(__dirname, 'fixtures', name), 'utf8').replace(/\r\n/g, '\n');
    const option = ", entryMode: 'historical-flat'";
    expect(source.split(option)).toHaveLength(2);
    expect(createHash('sha256').update(source.replace(option, '')).digest('hex')).toBe(pin);
  }
});

it('uses the chooser only for current Plan 39 re-entry', async () => {
  const { buildPlan39BridgeActions } = await import('../scripts/dev/plan39-route-bridge.mjs');
  const base = { view: 'visual', supportProfile: 'high-support', returnReentry: true };
  const historical = buildPlan39BridgeActions(base);
  const current = buildPlan39BridgeActions({ ...base, currentEntry: true });
  expect(historical.some(a => a.target === '[data-entry-chooser]')).toBe(false);
  expect(current.some(a => a.target === '[data-entry-chooser]')).toBe(true);
  expect(current.find(a => a.description === 'Plan39 re-enter bridge set').target).toBe('[data-entry-role="browse"][data-practice-type="bar-to-line-same-amount"]');
});

describe('Plan 14 Reachable Behavior Route Contract & Matrix Schema', () => {
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

  it('validates production matrix integrity and registered condition coverage with zero errors', async () => {
    const result = await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('requires explicit historical or production context for every mounted route and excludes prototypes', async () => {
    const contextMap = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'routes/plan34-context-map.json'), 'utf8'));
    const clean = await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS, contextMap);
    expect(clean.valid).toBe(true);
    const missing = structuredClone(contextMap);
    delete missing.contexts['ROUTE-PLAN34-INSPECT-LINEAR-DEEP'];
    expect((await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS, missing)).errors.join('\n'))
      .toContain('ROUTE-PLAN34-INSPECT-LINEAR-DEEP" has no explicit Plan 34 app context mapping');
    const prototype = structuredClone(contextMap);
    prototype.contexts['ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY'] = 'historical-v4';
    expect((await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS, prototype)).errors.join('\n'))
      .toContain('Non-app route "ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY" must not be mapped');
    const unknown = structuredClone(contextMap);
    unknown.contexts['ROUTE-DOES-NOT-EXIST'] = 'historical-v4';
    expect((await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS, unknown)).errors.join('\n'))
      .toContain('Plan 34 context map contains unknown route id "ROUTE-DOES-NOT-EXIST"');
    const mislabeled = structuredClone(contextMap);
    mislabeled.contexts['ROUTE-PLAN34-INSPECT-LINEAR-DEEP'] = 'historical-v4';
    expect((await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS, mislabeled)).errors.join('\n'))
      .toContain('Current Plan 34/35/38 route "ROUTE-PLAN34-INSPECT-LINEAR-DEEP" must exercise production-default-v7');
  });

  it('pins two v6 nested traversals while separately proving current v7 full-set reach', () => {
    const nested = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN18-'));
    const contexts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'routes/plan34-context-map.json'), 'utf8')).contexts;
    expect(nested.map((route) => route.id)).toEqual([
      'ROUTE-PLAN18-PRODUCTION-HIGH-VISUAL-COMPLETE',
      'ROUTE-PLAN18-PRODUCTION-MEDIUM-LINEAR-REDUCED',
    ]);
    expect(nested.map((route) => contexts[route.id])).toEqual(['historical-v6', 'historical-v6']);
    expect(contexts['ROUTE-PLAN17-APPENDED-ITEM-REACHABLE']).toBe('historical-v4');
    expect(nested.map((route) => route.actions.find((action) => action.method === 'completePlan18RetainedPrefix')))
      .toEqual([
        expect.objectContaining({ view: 'visual', supportProfile: 'high-support' }),
        expect.objectContaining({ view: 'linear', supportProfile: 'medium-support' }),
      ]);
    for (const route of nested) {
      expect(route.actions.some((action) => action.method === 'dispatch-fallback')).toBe(false);
      expect(route.actions.some((action) => action.description.includes('both nested operand orders'))).toBe(false);
      expect(route.actions.some((action) => action.method === 'pressKey')).toBe(route.inputMode !== 'touch');
    }
    expect(plan18WitnessSeeds).toHaveProperty('wrong-transform-side');
    expect(plan18WitnessSeeds).toHaveProperty('stale-denominator-control');
    const high = nested[0];
    const medium = nested[1];
    expect(high.actions.some((action) => action.method === 'tap')).toBe(true);
    expect(high.actions.some((action) => action.method === 'tap'
      && action.target.includes('#transform-num-input-left + .control-submit-btn'))).toBe(true);
    expect(high.actions.some((action) => action.method === 'assert'
      && action.description.includes('untouched source eighths'))).toBe(true);
    expect(high.actions.some((action) => action.method === 'screenshot' && action.requireNestedChoices)).toBe(true);
    expect(medium.actions.some((action) => action.method === 'pressKey' && action.value === 'Enter')).toBe(true);
    expect(medium.actions.some((action) => action.description.includes('incorrect equivalent numerator'))).toBe(true);
    expect(medium.actions.some((action) => action.description.includes('Retry mirrored item'))).toBe(true);
    expect(medium.actions.some((action) => action.method === 'assertNoSubdivisionMotion')).toBe(false);

    const current = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN35-CURRENT-'));
    expect(current.map((route) => route.id)).toEqual([
      'ROUTE-PLAN35-CURRENT-HIGH-VISUAL-ALL-21',
      'ROUTE-PLAN35-CURRENT-MEDIUM-LINEAR-ALL-21',
    ]);
    expect(current.map((route) => contexts[route.id])).toEqual(['production-default-v7', 'production-default-v7']);
    expect(current.map((route) => route.actions.find((action) => action.method === 'completePlan35LiveSet')))
      .toEqual([
        expect.objectContaining({ view: 'visual', supportProfile: 'high-support' }),
        expect.objectContaining({ view: 'linear', supportProfile: 'medium-support' }),
      ]);
    expect(current.every((route) => route.actions.some((action) => action.method === 'completePlan35LiveSet'))).toBe(true);
  });

  it('declares 8 Plan 38 like-denominator subtraction routes and 5 falsification seeds', () => {
    const plan38Routes = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN38-'));
    const contexts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'routes/plan34-context-map.json'), 'utf8')).contexts;
    expect(plan38Routes.map((route) => route.id)).toEqual([
      'ROUTE-PLAN38-SUBTRACTION-HIGH-VISUAL-ALL-8',
      'ROUTE-PLAN38-SUBTRACTION-MEDIUM-LINEAR-ALL-8',
      'ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE',
      'ROUTE-PLAN38-DEEP-SAMPLE-REDUCIBLE-DIFFERENCE',
      'ROUTE-PLAN38-HELP-TOGGLE-REPEATED-ERROR',
      'ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION',
      'ROUTE-PLAN38-REDUCED-MOTION-NO-ANIMATION',
      'ROUTE-PLAN38-RESPONSIVE-VIEWPORTS',
    ]);
    expect(plan38Routes.map((route) => contexts[route.id])).toEqual(
      Array(8).fill('production-default-v7')
    );
    const setRoutes = plan38Routes.filter((route) => route.actions.some((action) => action.method === 'completePlan38SubtractionSet'));
    expect(setRoutes).toHaveLength(2);
    expect(Object.keys(plan38WitnessSeeds).sort()).toEqual([
      'action-as-answer',
      'addition-semantics',
      'clipped-takeaway-bar',
      'erased-removal-marks',
      'operation-draft-loss',
      'operation-wrong-focus',
      'premature-answer-leak',
    ]);
  });

  it('pins the original 91 route objects and migrates only Plan 39 context mappings to v1 history', async () => {
    expect(matrix.routes).toHaveLength(117);
    expect(createHash('sha256').update(JSON.stringify(originalEntryRoutes(matrix.routes).slice(0, 91))).digest('hex'))
      .toBe('eee8367c25fdaa88612b516a05b6989a919ae10b8e822a6339bea9b4c3c631de');
    expect(createHash('sha256').update(JSON.stringify(originalEntryRoutes(matrix.routes).slice(0, 98))).digest('hex'))
      .toBe('e30aa7a3ee8a4f4f0567d245256ed954881d931f2d2136304320cc39a25a93ef');
    const contexts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'routes/plan34-context-map.json'), 'utf8')).contexts;
    const contextsBeforeRepair03 = { ...contexts };
    delete contextsBeforeRepair03['ROUTE-PLAN39-REPAIR03-ANCHOR-RING'];
    for (const key of Object.keys(contextsBeforeRepair03)) {
      if (key.startsWith('ROUTE-PLAN43-')) {
        delete contextsBeforeRepair03[key];
      }
      if (key.startsWith('ROUTE-PLAN45-')) {
        delete contextsBeforeRepair03[key];
      }
      if (key.startsWith('ROUTE-PLAN51-')) delete contextsBeforeRepair03[key];
    }
    expect(createHash('sha256').update(JSON.stringify(contextsBeforeRepair03)).digest('hex'))
      .toBe('c2c83aee5eea3436a66deb4978ad8891fadb694fa4c2f48c212e48db9dee0c00');
    const nonPlan39 = Object.fromEntries(Object.entries(contexts).filter(([id]) => (
      !id.startsWith('ROUTE-PLAN39-') && !id.startsWith('ROUTE-PLAN43-') && !id.startsWith('ROUTE-PLAN45-') && !id.startsWith('ROUTE-PLAN51-')
    )));
    expect(Object.keys(nonPlan39)).toHaveLength(79);
    expect(createHash('sha256').update(JSON.stringify(nonPlan39)).digest('hex'))
      .toBe('bbba2bc77d74738de5f665e7da75e3a8284c1a80ef07f4e3f21146fbf0009954');
    const legacy = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN39-')
      && !route.id.startsWith('ROUTE-PLAN39-REPAIR02-') && !route.id.startsWith('ROUTE-PLAN39-REPAIR03-'));
    expect(legacy).toHaveLength(10);
    expect(legacy.every((route) => contexts[route.id] === 'historical-plan39-v7')).toBe(true);
    const wrongLegacyMap = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'routes/plan34-context-map.json'), 'utf8'));
    wrongLegacyMap.contexts[legacy[0].id] = 'production-default-v8';
    expect((await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS, wrongLegacyMap)).errors.join('\n'))
      .toContain('must exercise the pinned revision-1/replay-v7 fixture');
  });

  it('appends current Plan 43 direct progression routes in production-direct-plan43', () => {
    const plan43Routes = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN43-'));
    const contexts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'routes/plan34-context-map.json'), 'utf8')).contexts;
    expect(plan43Routes.map((route) => route.id)).toEqual([
      'ROUTE-PLAN43-ADDITION-CONSTRUCT-NEXT',
      'ROUTE-PLAN43-ADDITION-INSPECT-NEXT',
      'ROUTE-PLAN43-ADDITION-IDENTIFY-NEXT',
      'ROUTE-PLAN43-PLAN20-SAME-DENOM-RETURN',
      'ROUTE-PLAN43-SUBTRACTION-TAKEAWAY-NEXT',
      'ROUTE-PLAN43-UNLIKE-SUBTRACTION-CONSTRUCT-NEXT',
      'ROUTE-PLAN43-UNLIKE-SUBTRACTION-INSPECT-NEXT',
      'ROUTE-PLAN43-UNLIKE-SUBTRACTION-IDENTIFY-NEXT',
      'ROUTE-PLAN43-NUMBER-LINE-DIRECT-NEXT',
      'ROUTE-PLAN43-REFLECTION-MILESTONE-CONTINUE-NEXT',
      'ROUTE-PLAN43-PREMISE-REFLECTION-NEXT',
    ]);
    expect(plan43Routes.map((route) => contexts[route.id])).toEqual(
      Array(11).fill('production-direct-plan43')
    );
  });

  it('appends current Repair02 routes in production-default-v8 with executable pointer and keyboard journeys', () => {
    const rows = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN39-'));
    const contexts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'routes/plan34-context-map.json'), 'utf8')).contexts;
    expect(rows.map(({ id }) => id)).toEqual([
      'ROUTE-PLAN39-BRIDGE-VISUAL-ALL-8', 'ROUTE-PLAN39-BRIDGE-LINEAR-ALL-8',
      'ROUTE-PLAN39-DEEP-SAMPLE-UNREDUCED-TWO-FOURTHS', 'ROUTE-PLAN39-DEEP-SAMPLE-ODD-THIRDS-B3',
      'ROUTE-PLAN39-DEEP-SAMPLE-HIGH-EIGHTHS-B8', 'ROUTE-PLAN39-DEEP-SAMPLE-MEDIUM-07-08',
      'ROUTE-PLAN39-RECOVERY-HELP-PREVIEW', 'ROUTE-PLAN39-RESPONSIVE-360X752',
      'ROUTE-PLAN39-RESPONSIVE-1366X768', 'ROUTE-PLAN39-RESPONSIVE-1093X614-DPR125',
      'ROUTE-PLAN39-REPAIR02-DRAG-ALL-8', 'ROUTE-PLAN39-REPAIR02-TOUCH-TAP-ALL-8',
      'ROUTE-PLAN39-REPAIR02-KEYBOARD-ALL-8', 'ROUTE-PLAN39-REPAIR02-BOUNDARIES',
      'ROUTE-PLAN39-REPAIR02-ODD-THIRDS-360X740', 'ROUTE-PLAN39-REPAIR02-MEDIUM-1366X768',
      'ROUTE-PLAN39-REPAIR02-EIGHTHS-1093X614-DPR125',
      'ROUTE-PLAN39-REPAIR03-ANCHOR-RING',
    ]);
    expect(rows.slice(0, 10).map(({ id }) => contexts[id])).toEqual(Array(10).fill('historical-plan39-v7'));
    expect(rows[0].actions.some((action) => action.method === 'completePlan39BridgeSet' && action.supportProfile === 'high-support')).toBe(true);
    expect(rows[1].actions.some((action) => action.method === 'completePlan39BridgeSet' && action.supportProfile === 'medium-support')).toBe(true);
    expect(rows.slice(2).flatMap((route) => route.actions).some((action) => action.method === 'plan39Witness')).toBe(true);
    expect(Object.keys(plan39WitnessSeeds).sort()).toEqual([
      'coarse-bucket-sr-collapse', 'misaligned-endpoints', 'premature-target-leak',
      'single-tap-auto-submit', 'undersized-touch-target',
    ]);
    const repair = rows.slice(10, 17);
    expect(repair.map(({ id }) => id)).toEqual([
      'ROUTE-PLAN39-REPAIR02-DRAG-ALL-8',
      'ROUTE-PLAN39-REPAIR02-TOUCH-TAP-ALL-8',
      'ROUTE-PLAN39-REPAIR02-KEYBOARD-ALL-8',
      'ROUTE-PLAN39-REPAIR02-BOUNDARIES',
      'ROUTE-PLAN39-REPAIR02-ODD-THIRDS-360X740',
      'ROUTE-PLAN39-REPAIR02-MEDIUM-1366X768',
      'ROUTE-PLAN39-REPAIR02-EIGHTHS-1093X614-DPR125',
    ]);
    expect(repair.every(({ id }) => contexts[id] === 'production-default-v8')).toBe(true);
    expect(repair[0].actions.some((action) => action.method === 'completePlan39Repair02Set' && action.interaction === 'drag')).toBe(true);
    expect(repair[1].actions.some((action) => action.method === 'completePlan39Repair02Set' && action.interaction === 'tap')).toBe(true);
    expect(repair[2].actions.some((action) => action.method === 'completePlan39Repair02Set' && action.interaction === 'keyboard')).toBe(true);
    const mediumWide = repair[5].actions.find((action) => action.method === 'completePlan39Repair02Set');
    expect(mediumWide).toMatchObject({ view: 'visual', supportProfile: 'medium-support', startAt: 6, endAt: 6, stepperEndpointCheck: true });
    expect(repair[6].actions.find((action) => action.method === 'completePlan39Repair02Set')).toMatchObject({ startAt: 5, endAt: 5 });
    expect(Object.keys(plan39Repair02WitnessSeeds).sort()).toEqual([
      'auto-check-on-placement', 'cancel-loses-prior-placement', 'correctness-aware-snap',
      'hidden-bar-before-check', 'outside-drop-accepted',
    ]);
    const repair03 = rows.slice(17);
    expect(repair03.map(({ id }) => id)).toEqual(['ROUTE-PLAN39-REPAIR03-ANCHOR-RING']);
    expect(repair03[0].actions.some((action) => action.method === 'plan39Repair03AnchorWitness')).toBe(true);
    expect(contexts[repair03[0].id]).toBe('production-default-v8');
    expect(Object.keys(plan39Repair03WitnessSeeds)).toEqual(['highlight-anchor-mismatch']);
    expect(plan39Repair03WitnessSeeds['highlight-anchor-mismatch']).toMatchObject({
      routeId: 'ROUTE-PLAN39-REPAIR03-ANCHOR-RING',
      failure: 'Plan39 Repair03 shared anchor/highlight assertion failed',
    });
    expect(expandRouteExecutions(matrix.routes)).toHaveLength(119);
  });

  it('enforces Rule 1: fails if a registered condition has no declared route witness', async () => {
    const syntheticConditions = [
      ...REGISTERED_CONDITIONS,
      { id: 'phase2-unregistered-condition-test' },
    ];
    const result = await validateMatrixIntegrity(matrix, syntheticConditions);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.includes('FATAL (Rule 1)') && e.includes('phase2-unregistered-condition-test')),
    ).toBe(true);
  });

  it('enforces Rule 3: fails if any route is marked skipped or notRun', async () => {
    const mutated = JSON.parse(JSON.stringify(matrix));
    mutated.routes[0].skipped = true;
    const result = await validateMatrixIntegrity(mutated, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('FATAL (Rule 3)') && e.includes('marked skipped/notRun'))).toBe(true);
  });

  it('enforces Rule 3: fails if any route lacks actions or expect assertions', async () => {
    const mutated = JSON.parse(JSON.stringify(matrix));
    mutated.routes[0].actions = [];
    mutated.routes[1].expect = { assertions: [] };
    const result = await validateMatrixIntegrity(mutated, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('FATAL (Rule 3)') && e.includes('lacks concrete actions'))).toBe(true);
    expect(result.errors.some((e) => e.includes('FATAL (Rule 3)') && e.includes('lacks executable expect assertions'))).toBe(true);
  });

  it('enforces Condition A: dispatch-fallback requires reason and valid witnessRouteId', async () => {
    const mutated = JSON.parse(JSON.stringify(matrix));
    mutated.routes[0].actions.push({
      step: 99,
      method: 'dispatch-fallback',
      action: { type: 'test' },
    });
    const result = await validateMatrixIntegrity(mutated, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('FATAL (Condition A)') && e.includes('without a "reason"'))).toBe(true);
  });

  it('enforces Condition A: presence of visual and linear full traversals with zero dispatch', async () => {
    const visual = matrix.routes.find((r) => r.id === 'ROUTE-TRAVERSAL-VISUAL-NO-DISPATCH');
    const linear = matrix.routes.find((r) => r.id === 'ROUTE-TRAVERSAL-LINEAR-NO-DISPATCH');

    expect(visual).toBeDefined();
    expect(visual.actions.every((a) => a.method !== 'dispatch-fallback')).toBe(true);

    expect(linear).toBeDefined();
    expect(linear.actions.every((a) => a.method !== 'dispatch-fallback')).toBe(true);
  });

  it('enforces Condition B: declared sameness is expressible and points to valid route', () => {
    const sameRoute = matrix.routes.find((r) => r.id === 'ROUTE-COND-4-TRANSFORM-SAME');
    expect(sameRoute).toBeDefined();
    expect(sameRoute.declaredSameAs).toBeDefined();
    expect(sameRoute.declaredSameAs.targetRouteId).toBe('ROUTE-COND-1-TRANSFORM');

    const targetRoute = matrix.routes.find((r) => r.id === sameRoute.declaredSameAs.targetRouteId);
    expect(targetRoute).toBeDefined();
  });

  it('enforces Condition C: covers both twelfths and twenty-fourths premise routes (both Yes and No answers)', () => {
    const expectedIds = [
      'ROUTE-PREMISE-12-FALSE-NO',
      'ROUTE-PREMISE-12-FALSE-YES',
      'ROUTE-PREMISE-24-TRUE-YES',
      'ROUTE-PREMISE-24-TRUE-NO',
    ];
    for (const id of expectedIds) {
      const route = matrix.routes.find((r) => r.id === id);
      expect(route, `Missing premise route: ${id}`).toBeDefined();
      expect(route.configuration).toBe('phase2-bundle-4');
    }
  });

  it('preserves learner and prototype routes while adding mounted high/medium support witnesses', () => {
    const baselineRoutes = originalEntryRoutes(matrix.routes).slice(0, 57);
    expect(matrix.routes.length).toBeGreaterThanOrEqual(57);
    expect(createHash('sha256').update(JSON.stringify(baselineRoutes)).digest('hex'))
      .toBe('97ed8bc2e0461611fba8eb8691f00ce76bce7f6c49452ff74cf5ef0124b3358c');
    const learnerRoutes = baselineRoutes.filter((route) => route.configuration !== 'plan15-subtraction-prototype');
    expect(learnerRoutes).toHaveLength(55);
    for (const route of learnerRoutes) {
      expect(route.startingSurface).toBe('mounted-app-entry');
      expect(route.viewport.width).toBe(route.id === 'ROUTE-PLAN22-36-PREMISE-LINEAR-REDUCED'
        ? 320
        : route.id === 'ROUTE-PLAN26-CHROMEBOOK-CSS-VIEWPORT' ? 1366 : 360);
      expect(route.viewport.height).toBe([
        'ROUTE-REPLAY-COND-1',
        'ROUTE-REPLAY-NEW-CONVERSION-COND-1',
        'ROUTE-REPLAY-REDUCED-COND-1',
        'ROUTE-PLAN24-HIGH-LINEAR-HELP',
        'ROUTE-PLAN24-HIGH-HELP-VIEW-TOGGLE-RESET',
        'ROUTE-PLAN20-LIKE-ADDITION-LINEAR',
      ].includes(route.id) ? 752
        : route.id === 'ROUTE-PLAN26-CHROMEBOOK-CSS-VIEWPORT' ? 768 : 740);
      expect(['standard-motion', 'reduced-motion']).toContain(route.motionMode);
      expect(route.witness).toBe('browser');
    }

    const closureRoutes = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN22-36-'));
    expect(closureRoutes.map((route) => route.id)).toEqual([
      'ROUTE-PLAN22-36-MATCHING-VISUAL',
      'ROUTE-PLAN22-36-PREMISE-LINEAR-REDUCED',
      'ROUTE-PLAN22-36-RETRY-RETURN',
    ]);
    expect(closureRoutes.some((route) => route.configuration === 'phase2-bundle-1')).toBe(true);
    expect(closureRoutes.some((route) => route.configuration === 'phase2-bundle-4')).toBe(true);
    const hasBoundaryRecoveryWitness = closureRoutes.some((route) => (
      route.actions.some((action) => (
        action.method === 'assert'
        && action.assertions?.some((assertion) => (
          assertion.type === 'containsText'
          && assertion.value.includes('valid common denominator')
        ))
      ))
    ));
    expect(hasBoundaryRecoveryWitness).toBe(true);
    expect(closureRoutes.some((route) => route.motionMode === 'reduced-motion')).toBe(true);
    expect(closureRoutes.some((route) => route.actions.some((action) => action.method === 'assertFocused'
      && action.target === '.app-entry-title'))).toBe(true);

    const prototypeRoutes = matrix.routes.filter((route) => (
      route.configuration === 'plan15-subtraction-prototype'
    ));
    expect(prototypeRoutes.map((route) => route.id)).toEqual([
      'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY',
      'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON',
    ]);
    for (const route of prototypeRoutes) {
      expect(route.viewport).toEqual({ width: 360, height: 740 });
      expect(route.motionModes).toEqual(['standard-motion', 'reduced-motion']);
      expect(route.witness).toBe('browser');
      expect(route.negativeControl.sameMotionMode).toBe(true);
      expect(route.expect.capture.target).toBe('#representation-visual');
      expect(route.expect.capture.type).toBe('renderedFractionRepresentation');
      expect(route.actions.some((action) => action.method === 'assertFocused'
        && action.target === '#answer-numerator')).toBe(true);
      expect(route.expect.assertions.some((assertion) => assertion.type === 'visibleGeometry')).toBe(true);
      if (route.id === 'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY') {
        expect(route.expect.assertions).toContainEqual(expect.objectContaining({
          type: 'visibleGeometry',
          target: '.bar-segment.is-removed',
          backgroundImageIncludes: 'repeating-linear-gradient',
        }));
      }
      expect(route.expect.assertions).toContainEqual(expect.objectContaining({
        type: 'notVisible',
        target: '#operation-button',
      }));
      expect(route.expect.assertions).toContainEqual(expect.objectContaining({
        type: 'visibleGeometry',
        target: '.fraction-whole',
        requireVisibleCenterHit: true,
      }));
      if (route.id === 'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY') {
        expect(route.expect.assertions).toContainEqual(expect.objectContaining({
          type: 'visibleGeometry',
          target: '.bar-segment.is-removed',
          requireVisibleCenterHit: true,
        }));
      } else {
        expect(route.expect.assertions).toContainEqual(expect.objectContaining({
          type: 'visibleGeometry',
          target: '.gap-marker',
          backgroundImageIncludes: 'repeating-linear-gradient',
          requireVisibleCenterHit: true,
          borderContrastAgainstAncestor: true,
        }));
      }
    }
  });

  it('preserves the frozen 54-route prefix and appends the Plan 17 learner-reach route', () => {
    const originalPrefix = originalEntryRoutes(matrix.routes).slice(0, 54);
    const prefixHash = createHash('sha256').update(JSON.stringify(originalPrefix)).digest('hex');
    expect(prefixHash).toBe(PRE_PLAN17_ROUTE_PREFIX_HASH);
    const appended = matrix.routes[54];
    expect(appended.id).toBe('ROUTE-PLAN17-APPENDED-ITEM-REACHABLE');
    expect(appended.configuration).toBe('phase2-bundle-1');
    expect(appended.actions).toHaveLength(121);
    expect(appended.actions.at(-1)).toMatchObject({
      method: 'click',
      target: '.app-next-button',
    });
  });

  it('declares bounded visual and linear Plan 20 recovery, equivalent-answer, focus and absence witnesses', () => {
    const visual = matrix.routes.find((route) => route.id === 'ROUTE-PLAN20-LIKE-ADDITION-VISUAL');
    const linear = matrix.routes.find((route) => route.id === 'ROUTE-PLAN20-LIKE-ADDITION-LINEAR');
    expect(visual).toBeDefined();
    expect(linear).toBeDefined();
    expect(visual.motionMode).toBe('reduced-motion');
    expect(linear.motionMode).toBe('reduced-motion');
    expect(visual.viewport).toEqual({ width: 360, height: 740 });
    expect(linear.viewport).toEqual({ width: 360, height: 752 });
    expect(visual.negativeControl).toMatchObject({ targetRouteId: linear.id, sameMotionMode: true });
    expect(linear.negativeControl).toMatchObject({ targetRouteId: visual.id, sameMotionMode: true });

    for (const [route, view, support] of [
      [visual, 'visual', 'high-support'],
      [linear, 'linear', 'medium-support'],
    ]) {
      const actions = route.actions;
      const actionText = actions.map((action) => JSON.stringify(action)).join('\n');
      expect(actions.some((action) => action.target === `[data-support-id="${support}"]`)).toBe(true);
      expect(actions.some((action) => action.target === `[data-entry-role="browse"][data-practice-type="like-denominator-addition"]`)).toBe(true);
      expect(actionText).toContain(`.app-${view}-view .recovery-feedback`);
      expect(actionText).toContain('Both bars have 7 equal parts. Those parts are the same size.');
      expect(actionText).toContain('The denominator stays the same. Add only the top numbers.');
      expect(actionText).toContain('10/14');
      expect(actionText).toContain('#decide-common-denominator-input');
      expect(actionText).toContain('#transform-num-input-left');
      expect(actionText).toContain('.app-reflection');
      expect(actions.some((action) => action.method === 'assertFocused' && action.target === '.app-episode')).toBe(true);
      expect(actions.some((action) => action.method === 'pressKey')).toBe(view === 'visual');
      expect(actions.some((action) => action.method === 'click'
        && action.target === `.app-${view}-view .control-submit-btn`)).toBe(true);
    }
    expect(visual.actions.some((action) => action.method === 'click'
      && action.target === '.app-return-button')).toBe(true);
    expect(visual.actions.some((action) => action.description?.includes('Re-enter a fresh'))).toBe(true);
  });

  it('executes each prototype route in both motion modes and brings in its filtered negative control', () => {
    const executions = expandRouteExecutions(matrix.routes);
    expect(executions).toHaveLength(119);
    expect(executions.filter((execution) => (
      execution.route.configuration === 'plan15-subtraction-prototype'
    ))).toHaveLength(4);

    const filtered = selectRoutesForRun(
      matrix.routes,
      'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY',
    );
    expect(filtered.map((route) => route.id)).toEqual([
      'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY',
      'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON',
    ]);
    expect(expandRouteExecutions(filtered)).toHaveLength(4);
  });

  it('declares reciprocal matched-profile controls and all medium premise outcomes', () => {
    const matchedRoutes = [
      ['ROUTE-SUPPORT-HIGH-DECIDE', 'ROUTE-SUPPORT-MEDIUM-DECIDE'],
      ['ROUTE-SUPPORT-HIGH-PREMISE-12', 'ROUTE-SUPPORT-MEDIUM-PREMISE-12'],
      ['ROUTE-SUPPORT-HIGH-PREMISE-24', 'ROUTE-SUPPORT-MEDIUM-PREMISE-24'],
    ];
    for (const [highId, mediumId] of matchedRoutes) {
      const high = matrix.routes.find((route) => route.id === highId);
      const medium = matrix.routes.find((route) => route.id === mediumId);
      expect(high).toBeDefined();
      expect(medium).toBeDefined();
      expect(high.negativeControl).toMatchObject({ targetRouteId: mediumId, sameMotionMode: true });
      expect(medium.negativeControl).toMatchObject({ targetRouteId: highId, sameMotionMode: true });
      expect(high.viewport).toEqual(medium.viewport);
      expect(high.motionMode).toBe(medium.motionMode);
      expect(high.actions.some((action) => action.target === '[data-support-id="high-support"]')).toBe(true);
      expect(medium.actions.some((action) => action.target === '[data-support-id="medium-support"]')).toBe(true);
    }

    const mediumOutcomes = [
      ['ROUTE-PREMISE-MEDIUM-12-FALSE-NO', 'ROUTE-PREMISE-12-FALSE-NO'],
      ['ROUTE-PREMISE-MEDIUM-12-FALSE-YES', 'ROUTE-PREMISE-12-FALSE-YES'],
      ['ROUTE-PREMISE-MEDIUM-24-TRUE-YES', 'ROUTE-PREMISE-24-TRUE-YES'],
      ['ROUTE-PREMISE-MEDIUM-24-TRUE-NO', 'ROUTE-PREMISE-24-TRUE-NO'],
    ];
    for (const [mediumId, highId] of mediumOutcomes) {
      const medium = matrix.routes.find((route) => route.id === mediumId);
      expect(medium, `Missing medium-support outcome route ${mediumId}`).toBeDefined();
      expect(medium.configuration).toBe('phase2-bundle-4');
      expect(medium.actions.some((action) => action.target === '[data-support-id="medium-support"]')).toBe(true);
      expect(medium.negativeControl).toMatchObject({ targetRouteId: highId, sameMotionMode: true });
      if (mediumId.includes('12-FALSE-NO')) {
        expect(medium.actions.some((action) => action.method === 'assertText'
          && action.value.includes('not a common denominator.'))).toBe(true);
      }
    }
  });

  it('compares Plan 22 boundaries and Plan 24 help witnesses under matching motion modes', () => {
    const matchedControls = [
      ['ROUTE-PLAN22-36-MATCHING-VISUAL', 'ROUTE-SUPPORT-MEDIUM-DECIDE'],
      ['ROUTE-PLAN24-MEDIUM-LOCAL-HELP', 'ROUTE-SUPPORT-MEDIUM-DECIDE'],
      ['ROUTE-PLAN24-HIGH-LINEAR-HELP', 'ROUTE-SUPPORT-HIGH-DECIDE'],
    ];
    for (const [routeId, targetId] of matchedControls) {
      const route = matrix.routes.find((candidate) => candidate.id === routeId);
      const target = matrix.routes.find((candidate) => candidate.id === targetId);
      expect(route).toBeDefined();
      expect(target).toBeDefined();
      expect(route.negativeControl).toMatchObject({ targetRouteId: targetId, sameMotionMode: true });
      expect(route.motionMode).toBe(target.motionMode);
    }
  });

  it('preserves the Plan 11 route baseline and witnesses executed motion, interruption, Replay, static arms, and both support profiles', () => {
    const baselineRoutes = originalEntryRoutes(matrix.routes).slice(0, 57);
    expect(createHash('sha256').update(JSON.stringify(baselineRoutes)).digest('hex'))
      .toBe('97ed8bc2e0461611fba8eb8691f00ce76bce7f6c49452ff74cf5ef0124b3358c');
    expect(baselineRoutes.filter((route) => !route.id.startsWith('ROUTE-PLAN22-36-'))).toHaveLength(54);
    expect(expandRouteExecutions(baselineRoutes)).toHaveLength(59);

    const route = (id) => matrix.routes.find((candidate) => candidate.id === id);
    const linearHelpFocus = route('ROUTE-PLAN25-TRANSFORM-HELP-LINEAR-FOCUS');
    expect(linearHelpFocus.actions.some((action) => (
      action.method === 'pressKey'
      && action.target === '.app-linear-view .active-beat-controls .app-secondary-button'
      && action.value === 'Enter'
    ))).toBe(true);
    expect(linearHelpFocus.actions.some((action) => (
      action.method === 'click'
      && action.description === 'Reopen the incorrect multiplier step with a real click'
    ))).toBe(true);
    expect(linearHelpFocus.actions.some((action) => action.assertions?.some((assertion) => (
      assertion.type === 'activeElementEquals'
    )))).toBe(true);
    const primary = route('ROUTE-COND-1-TRANSFORM');
    expect(primary.actions.find((action) => action.method === 'clickAndObserveSubdivision')
      .interruptReducedMotion).toBe(true);
    expect(primary.viewport).toEqual({ width: 360, height: 740 });
    expect(primary.actions.some((action) => action.method === 'clickAndObserveSubdivision'
      && action.container.includes('data-side="left"'))).toBe(true);
    expect(primary.actions.some((action) => action.method === 'clickAndObserveSubdivision'
      && action.interruptReducedMotion === true
      && action.container.includes('data-side="left"'))).toBe(true);
    expect(primary.actions.some((action) => action.method === 'click'
      && action.target.includes('Need help?'))).toBe(true);
    expect(primary.actions.some((action) => action.method === 'assertNoSubdivisionMotion'
      && action.container === '.app-visual-view .fraction-bar-container[data-side="left"]')).toBe(true);

    const replay = route('ROUTE-REPLAY-COND-1');
    expect(replay.viewport).toEqual({ width: 360, height: 752 });
    const replayMotion = replay.actions.filter((action) => action.method === 'clickAndObserveSubdivision');
    expect(replayMotion).toHaveLength(2);
    expect(replayMotion[0].target).toBe('.app-visual-view .control-submit-btn');
    expect(replayMotion[1].target).toBe('.app-visual-view .fraction-bar-toggle-btn');
    expect(replay.actions.some((action) => action.method === 'scrollIntoView'
      && action.target === '.app-visual-view .fraction-bar-toggle-btn')).toBe(true);
    expect(replay.actions.find((action) => action.step === 10).assertions)
      .toContainEqual(expect.objectContaining({
        type: 'visibleGeometry',
        target: '.app-visual-view .fraction-bar-toggle-btn',
        minWidth: 24,
        minHeight: 24,
      }));

    const replayNewConversion = route('ROUTE-REPLAY-NEW-CONVERSION-COND-1');
    expect(replayNewConversion.motionMode).toBe('standard-motion');
    expect(replayNewConversion.actions.some((action) => action.method === 'click'
      && action.target.includes('Need help?'))).toBe(true);
    expect(replayNewConversion.actions.some((action) => action.method === 'clickAndObserveSubdivision'
      && action.container.includes('data-side="right"'))).toBe(true);

    const reducedReplay = route('ROUTE-REPLAY-REDUCED-COND-1');
    expect(reducedReplay.motionMode).toBe('reduced-motion');
    expect(reducedReplay.actions.some((action) => action.method === 'clickAndObserveReplayReveal'
      && action.target === '.app-visual-view .fraction-bar-toggle-btn')).toBe(true);
    const retainedAnswer = reducedReplay.actions.find((action) => action.method === 'fillWithKnownSelection');
    const reveal = reducedReplay.actions.find((action) => action.method === 'clickAndObserveReplayReveal');
    expect(retainedAnswer).toMatchObject({
      value: '8',
      selectionStart: 0,
      selectionEnd: 1,
      target: '.app-visual-view #transform-num-input-right',
    });
    expect(retainedAnswer.step).toBeLessThan(reveal.step);
    const restoredInputType = reducedReplay.actions.find((action) => action.method === 'restoreInputType');
    expect(restoredInputType).toMatchObject({
      value: 'number',
      target: '.app-visual-view #transform-num-input-right',
    });
    expect(restoredInputType.step).toBeGreaterThan(reveal.step);
    expect(restoredInputType.step).toBeLessThan(reducedReplay.actions.find((action) => (
      action.method === 'fill' && action.value === '3'
    )).step);
    expect(reducedReplay.actions.some((action) => action.method === 'assertNoSubdivisionMotion'
      && action.container.includes('data-side="right"'))).toBe(true);
    expect(reducedReplay.actions.some((action) => action.method === 'clickAndAssertBarPosition'
      && action.container.includes('data-side="right"')
      && action.numerator === 3 && action.denominator === 12)).toBe(true);
    expect(reducedReplay.actions.some((action) => action.method === 'assertFreshBarLayout'
      && action.container === '.app-visual-view .fraction-bars-wrapper'
      && action.expectedHeight === 108)).toBe(true);

    const high = route('ROUTE-SUPPORT-HIGH-DECIDE');
    const medium = route('ROUTE-SUPPORT-MEDIUM-DECIDE');
    for (const [candidate, profile] of [[high, 'high-support'], [medium, 'medium-support']]) {
      expect(candidate.actions.some((action) => action.target === `[data-support-id="${profile}"]`)).toBe(true);
      expect(candidate.actions.some((action) => action.target?.includes('control-choice-btn >> nth=1')
        || action.value === '24')).toBe(true);
      for (const side of ['left', 'right']) {
        expect(candidate.actions.some((action) => (
          ['clickAndObserveSubdivision', 'clickAndStartSubdivision'].includes(action.method)
          && action.container?.includes(`data-side="${side}"`)
        ))).toBe(true);
      }
      expect(candidate.expect.assertions).toContainEqual(expect.objectContaining({
        type: 'attributeEquals',
        target: `.app-visual-view .fraction-bar-container[data-side="left"] .fraction-bar-track`,
        attribute: 'data-denominator',
        value: '24',
      }));
    }
    expect(high.actions.some((action) => action.method === 'clickAndObserveSubdivision'
      && action.requireConcurrentMotion === true)).toBe(true);

    const reduced = route('ROUTE-REDUCED-MOTION');
    expect(reduced.motionMode).toBe('reduced-motion');
    expect(reduced.actions.filter((action) => action.method === 'assertNoSubdivisionMotion'
      && action.denominator === 24)).toHaveLength(2);
    const endpointSignature = (assertions) => assertions
      .filter((assertion) => assertion.target?.endsWith('.fraction-bar-track'))
      .map(({ target, attribute, value }) => ({ target, attribute, value }))
      .sort((left, right) => `${left.target}:${left.attribute}`.localeCompare(`${right.target}:${right.attribute}`));
    const mediumEndpoint = endpointSignature(route('ROUTE-SUPPORT-MEDIUM-DECIDE').expect.assertions);
    const reducedEndpoint = endpointSignature(reduced.expect.assertions);
    expect(reducedEndpoint).toEqual(mediumEndpoint);

    for (const id of ['ROUTE-COND-2-TRANSFORM', 'ROUTE-COND-3-TRANSFORM', 'ROUTE-COND-4-REFLECT']) {
      expect(route(id).actions.some((action) => action.method === 'assertNoSubdivisionMotion')).toBe(true);
    }
    expect(route('ROUTE-FOCUS-INSPECTION-RESTORE').actions.some((action) => (
      action.method === 'assertNoSubdivisionMotion' && action.container === '.app-visual-view'
    ))).toBe(true);
    expect(route('ROUTE-FOCUS-INSPECTION-RESTORE-LINEAR').actions.some((action) => (
      action.method === 'assertNoSubdivisionMotion' && action.container === '.app-linear-view'
    ))).toBe(true);
    expect(route('ROUTE-COND-4-TRANSFORM-SAME').actions.some((action) => (
      action.method === 'clickAndObserveSubdivision'
    ))).toBe(true);
    expect(route('ROUTE-COND-4-TRANSFORM-SAME').actions.find((action) => (
      action.method === 'clickAndObserveSubdivision'
    )).interruptReducedMotionAtHighlight).toBe(true);
    expect(route('ROUTE-COND-1-REFLECT').actions.some((action) => (
      action.method === 'clickAndObserveSubdivision'
      && action.interruptReducedMotion === true
      && action.container.includes('data-side="right"')
    ))).toBe(true);
  });

  it('rejects unknown methods and incomplete subdivision-motion witnesses', async () => {
    const unknown = JSON.parse(JSON.stringify(matrix));
    unknown.routes[0].actions[0].method = 'clickAndPretendSubdivision';
    const unknownResult = await validateMatrixIntegrity(unknown, REGISTERED_CONDITIONS);
    expect(unknownResult.valid).toBe(false);
    expect(unknownResult.errors.some((error) => error.includes('unknown action method'))).toBe(true);

    const missingContainer = JSON.parse(JSON.stringify(matrix));
    const observer = missingContainer.routes.find((candidate) => candidate.id === 'ROUTE-COND-1-TRANSFORM')
      .actions.find((action) => action.method === 'clickAndObserveSubdivision');
    delete observer.container;
    const containerResult = await validateMatrixIntegrity(missingContainer, REGISTERED_CONDITIONS);
    expect(containerResult.valid).toBe(false);
    expect(containerResult.errors.some((error) => error.includes('requires a mounted "target" and "container"'))).toBe(true);

    const missingNoRestartContainer = JSON.parse(JSON.stringify(matrix));
    const noRestartAction = missingNoRestartContainer.routes
      .find((candidate) => candidate.id === 'ROUTE-REPLAY-NEW-CONVERSION-COND-1')
      .actions.find((action) => action.forbidConcurrentMotion);
    delete noRestartAction.concurrentContainer;
    const noRestartResult = await validateMatrixIntegrity(missingNoRestartContainer, REGISTERED_CONDITIONS);
    expect(noRestartResult.valid).toBe(false);
    expect(noRestartResult.errors.some((error) => error.includes('no-restart subdivision evidence requires a concurrent container'))).toBe(true);
  });

  it('rejects a prototype route when its same-motion negative control row is removed', async () => {
    const mutated = JSON.parse(JSON.stringify(matrix));
    mutated.routes = mutated.routes.filter((route) => (
      route.id !== 'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON'
    ));
    const result = await validateMatrixIntegrity(mutated, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes('negative control references missing route'))).toBe(true);
  });

  it('maps only declared browser starting surfaces and supplies their readiness selectors', async () => {
    expect(resolveStartingSurface('mounted-app-entry')).toEqual({
      path: '',
      readySelector: '.fractionflow-app',
    });
    expect(resolveStartingSurface('subtraction-takeaway-prototype')).toEqual({
      path: 'prototypes/subtraction/index.html?mode=takeaway&fixture=0',
      readySelector: '#subtraction-prototype[data-mode="takeaway"]',
    });
    expect(resolveStartingSurface('subtraction-comparison-prototype')).toEqual({
      path: 'prototypes/subtraction/index.html?mode=comparison&fixture=0',
      readySelector: '#subtraction-prototype[data-mode="comparison"]',
    });
    expect(resolveStartingSurface('plan18-historical-v6-entry')).toEqual({
      path: '__test__/plan18-historical/plan18-historical-entry.html',
      readySelector: '.fractionflow-app',
    });
    expect(resolveStartingSurface('unknown-surface')).toBeNull();

    const mutated = JSON.parse(JSON.stringify(matrix));
    mutated.routes[0].startingSurface = 'unknown-surface';
    const result = await validateMatrixIntegrity(mutated, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes('unknown startingSurface'))).toBe(true);
  });

  it('rejects unknown motion modes and missing same-mode negative controls', async () => {
    const mutatedMode = JSON.parse(JSON.stringify(matrix));
    mutatedMode.routes.find((route) => route.id === 'ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY')
      .motionModes[1] = 'automatic-motion';
    const modeResult = await validateMatrixIntegrity(mutatedMode, REGISTERED_CONDITIONS);
    expect(modeResult.valid).toBe(false);
    expect(modeResult.errors.some((error) => error.includes('invalid motion mode "automatic-motion"'))).toBe(true);

    const mutatedControl = JSON.parse(JSON.stringify(matrix));
    mutatedControl.routes.find((route) => route.id === 'ROUTE-PROTOTYPE-SUBTRACTION-COMPARISON')
      .motionModes = ['standard-motion'];
    const controlResult = await validateMatrixIntegrity(mutatedControl, REGISTERED_CONDITIONS);
    expect(controlResult.valid).toBe(false);
    expect(controlResult.errors.some((error) => error.includes('requires negative control'))).toBe(true);

    const wrongHighlightMode = JSON.parse(JSON.stringify(matrix));
    wrongHighlightMode.routes.find((route) => route.id === 'ROUTE-COND-4-TRANSFORM-SAME')
      .motionMode = 'reduced-motion';
    const highlightModeResult = await validateMatrixIntegrity(wrongHighlightMode, REGISTERED_CONDITIONS);
    expect(highlightModeResult.valid).toBe(false);
    expect(highlightModeResult.errors.some((error) => error.includes('may interrupt a boundary highlight only from standard motion'))).toBe(true);
  });

  it('retains the subdivision sensitivity seeds and adds independent glow and core suppression at Replay', () => {
    expect(Object.keys(motionWitnessSeeds).sort()).toEqual([
      'core-suppressed',
      'disabled-motion',
      'glow-suppressed',
      'half-height-new-boundary',
      'no-op-keyframes',
      'reduced-accidental-motion',
      'static-accidental-motion',
      'whole-bar-translation',
    ]);
    expect(motionWitnessSeeds['glow-suppressed']).toEqual({
      routeId: 'ROUTE-REPLAY-NEW-CONVERSION-COND-1',
      step: 12,
      failure: 'new subdivision boundary did not show the post-arrival highlight',
    });
    expect(motionWitnessSeeds['core-suppressed']).toEqual({
      routeId: 'ROUTE-REPLAY-NEW-CONVERSION-COND-1',
      step: 12,
      failure: 'new subdivision boundary did not show the temporary dark core',
    });
  });

  it('requires the retired focus defect to assert the restored first choice', () => {
    const route = matrix.routes.find((r) => r.id === 'ROUTE-FOCUS-INSPECTION-RESTORE');
    expect(route).toBeDefined();
    expect(route.knownDefect).toBeUndefined();
    expect(route.expect.assertions).toContainEqual(expect.objectContaining({
      type: 'activeElementEquals',
      value: 'button.fraction-control.matching-choice-btn.control-choice-btn.inspection-focus-return-target',
    }));
    const linearRoute = matrix.routes.find((r) => r.id === 'ROUTE-FOCUS-INSPECTION-RESTORE-LINEAR');
    expect(linearRoute).toBeDefined();
    expect(linearRoute.knownDefect).toBeUndefined();
    expect(linearRoute.expect.assertions).toContainEqual(expect.objectContaining({
      type: 'activeElementEquals',
      value: 'button.fraction-control.control-choice-btn.linear-matching-choice-btn.inspection-focus-return-target',
    }));
  });

  it('witnesses the first keyboard stop after episode entry', () => {
    const route = matrix.routes.find((r) => r.id === 'ROUTE-ENTRY-BEGIN-FIRST-TAB-EPISODE');
    expect(route).toBeDefined();
    expect(route.actions.some((action) => action.method === 'pressKey' && action.value === 'Tab')).toBe(true);
    expect(route.expect.assertions).toContainEqual(expect.objectContaining({
      type: 'activeElementEquals',
      value: 'button.fraction-control.app-secondary-button.app-view-toggle',
    }));
  });

  it('rejects malformed knownDefect fields on any row', async () => {
    const mutated = JSON.parse(JSON.stringify(matrix));
    const target = mutated.routes.find((r) => r.id === 'ROUTE-FOCUS-INSPECTION-RESTORE');
    target.knownDefect = { id: 'TEST' }; // missing description and trackedIn
    const result = await validateMatrixIntegrity(mutated, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('missing required non-empty "description"'))).toBe(true);
    expect(result.errors.some((e) => e.includes('missing required non-empty "trackedIn"'))).toBe(true);
  });
});
