import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';

const require = createRequire(import.meta.url);
const {
  expandRouteExecutions,
  resolveStartingSurface,
  selectRoutesForRun,
  validateMatrixIntegrity,
} = require('../scripts/dev/run-route-matrix.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const matrixPath = path.resolve(__dirname, 'routes/route-matrix.json');

describe('Plan 14 Reachable Behavior Route Contract & Matrix Schema', () => {
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));

  it('validates production matrix integrity and registered condition coverage with zero errors', async () => {
    const result = await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
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
    expect(matrix.routes).toHaveLength(39);
    const learnerRoutes = matrix.routes.filter((route) => route.configuration !== 'plan15-subtraction-prototype');
    expect(learnerRoutes).toHaveLength(37);
    for (const route of learnerRoutes) {
      expect(route.startingSurface).toBe('mounted-app-entry');
      expect(route.viewport).toEqual({ width: 360, height: 740 });
      expect(['standard-motion', 'reduced-motion']).toContain(route.motionMode);
      expect(route.witness).toBe('browser');
    }

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

  it('executes each prototype route in both motion modes and brings in its filtered negative control', () => {
    const executions = expandRouteExecutions(matrix.routes);
    expect(executions).toHaveLength(41);
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
      value: 'button.fraction-control.control-choice-btn.inspection-focus-return-target',
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
