import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET } from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';

const require = createRequire(import.meta.url);
const {
  expandRouteExecutions,
  plan40WitnessSeeds,
  validateMatrixIntegrity,
} = require('../scripts/dev/run-route-matrix.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const matrixPath = path.resolve(__dirname, 'routes/route-matrix.json');
const contextMapPath = path.resolve(__dirname, 'routes/plan34-context-map.json');

describe('Plan 40 Reachable Behavior Route Contract & Subtraction Recipes Matrix', () => {
  const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
  const contextMap = JSON.parse(fs.readFileSync(contextMapPath, 'utf8'));

  it('validates production matrix integrity including Plan 40 routes with zero errors', async () => {
    const result = await validateMatrixIntegrity(matrix, REGISTERED_CONDITIONS, contextMap);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('declares 8 Plan 40 unlike-denominator subtraction routes mapped to production-default-v7', () => {
    const plan40Routes = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN40-'));
    expect(plan40Routes.map((route) => route.id)).toEqual([
      'ROUTE-PLAN40-UNLIKE-SUBTRACTION-HIGH-VISUAL-ALL',
      'ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL',
      'ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE',
      'ROUTE-PLAN40-DEEP-SAMPLE-INSPECT-REPAIR',
      'ROUTE-PLAN40-DEEP-SAMPLE-IDENTIFY-REDUCIBLE',
      'ROUTE-PLAN40-HELP-RECOVERY-VIEW-TOGGLE',
      'ROUTE-PLAN40-RESPONSIVE-VIEWPORTS',
      'ROUTE-PLAN40-CHROMEBOOK-SCALED-VIEWPORT',
    ]);
    expect(plan40Routes.map((route) => contextMap.contexts[route.id])).toEqual(
      Array(8).fill('production-default-v7'),
    );
  });

  it('registers plan40-unlike-subtraction context with exact vetted items and revisions', () => {
    const ctx = contextMap['plan40-unlike-subtraction'];
    expect(ctx).toBeDefined();
    expect(ctx.practiceSetId).toBe('unlike-subtraction-vetted-set');
    expect(ctx.practiceSetRevision).toBe('1');
    expect(ctx.episodeDefinitionId).toBe('phase-3-reusable-subtraction-recipes');
    expect(ctx.episodeDefinitionRevision).toBe('1');
    expect(ctx.itemIds).toEqual(PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.itemIds);
    expect(ctx.itemIds).toHaveLength(9);
  });

  it('binds completePlan40SubtractionSet across visual and linear paths', () => {
    const visual = matrix.routes.find((r) => r.id === 'ROUTE-PLAN40-UNLIKE-SUBTRACTION-HIGH-VISUAL-ALL');
    const linear = matrix.routes.find((r) => r.id === 'ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL');

    expect(visual.actions.find((a) => a.method === 'completePlan40SubtractionSet')).toEqual(
      expect.objectContaining({ view: 'visual', supportProfile: 'high-support' }),
    );
    expect(linear.actions.find((a) => a.method === 'completePlan40SubtractionSet')).toEqual(
      expect.objectContaining({ view: 'linear', supportProfile: 'medium-support' }),
    );
  });

  it('registers all 4 required Plan 40 falsification seeds targeting operate beat assertions', () => {
    expect(Object.keys(plan40WitnessSeeds).sort()).toEqual([
      'addition-wording-in-subtraction',
      'erased-takeaway-hatch-after-transform',
      'missing-operate-fraction-inputs',
      'premature-difference-leak',
    ]);

    for (const [seedName, seed] of Object.entries(plan40WitnessSeeds)) {
      expect(seed.routeId).toBe('ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE');
      expect(seed.injectBeforeDescription).toBe('Plan 40: assert visible hatch and non-leakage at operate');
      expect(seed.failure).toBeTruthy();
    }
  });

  it('preserves existing 73 route rows and expands to 83 total browser executions', () => {
    expect(matrix.routes).toHaveLength(81);
    const executions = expandRouteExecutions(matrix.routes);
    expect(executions).toHaveLength(83);
  });
});
