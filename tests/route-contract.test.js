import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';

const require = createRequire(import.meta.url);
const { validateMatrixIntegrity } = require('../scripts/dev/run-route-matrix.js');

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

  it('enforces starting-surface rule: all routes begin from mounted-app-entry', () => {
    for (const route of matrix.routes) {
      expect(route.startingSurface).toBe('mounted-app-entry');
      expect(route.viewport).toEqual({ width: 360, height: 740 });
      expect(['standard-motion', 'reduced-motion']).toContain(route.motionMode);
      expect(route.witness).toBe('browser');
    }
  });
});
