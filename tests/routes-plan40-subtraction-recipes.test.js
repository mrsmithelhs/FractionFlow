import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET } from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';

const require = createRequire(import.meta.url);
const {
  assertPlan40SeedInvariant,
  derivePlan40ProhibitedResult,
  expandRouteExecutions,
  plan40WitnessSeeds,
  validateMatrixIntegrity,
  validatePlan40ScreenshotLayout,
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

  it('registers all required Plan 40 falsification seeds targeting operate beat assertions', () => {
    expect(Object.keys(plan40WitnessSeeds).sort()).toEqual([
      'addition-wording-in-subtraction',
      'erased-takeaway-hatch-after-transform',
      'missing-operate-fraction-inputs',
      'premature-difference-leak',
      'premature-difference-leak-accessible',
      'premature-difference-leak-bare',
      'premature-difference-leak-stacked',
    ]);

    for (const [seedName, seed] of Object.entries(plan40WitnessSeeds)) {
      expect(seed.routeId).toBe('ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE');
      expect(seed.injectBeforeDescription).toBe('Plan 40: assert visible hatch and non-leakage at operate');
      expect(seed.failure).toBeTruthy();
    }

    // Answer-leak sensitivity derives prohibited result (3/10) without magic word "Difference"
    for (const seedName of [
      'premature-difference-leak',
      'premature-difference-leak-bare',
      'premature-difference-leak-stacked',
      'premature-difference-leak-accessible',
    ]) {
      expect(plan40WitnessSeeds[seedName].failure).toBe('unexpectedly contains text "3/10"');
      expect(plan40WitnessSeeds[seedName].failure).not.toContain('Difference');
    }
  });

  it('enforces seed-run invariant: exactly 1 intended detection, 0 unintended failures, 1 route execution via production guard', () => {
    expect(() => assertPlan40SeedInvariant({ seedDetected: 1, failed: 0, total: 1 }, 'test-seed')).not.toThrow();
    expect(() => assertPlan40SeedInvariant({ seedDetected: 0, failed: 0, total: 1 }, 'test-seed')).toThrow(
      /did not produce exactly one intended failure/,
    );
    expect(() => assertPlan40SeedInvariant({ seedDetected: 1, failed: 1, total: 1 }, 'test-seed')).toThrow(
      /did not produce exactly one intended failure/,
    );
    expect(() => assertPlan40SeedInvariant({ seedDetected: 1, failed: 0, total: 2 }, 'test-seed')).toThrow(
      /did not produce exactly one intended failure/,
    );
  });

  it('enforces screenshot viewport containment: accepts within-viewport layout and rejects partially offscreen controls', () => {
    const cleanLayout = {
      viewport: { width: 360, height: 740 },
      document: { width: 360, height: 766 },
      horizontalOverflowPx: 0,
      question: {
        x: 63,
        y: 360,
        width: 234,
        height: 25,
        visible: true,
        horizontallyContained: true,
        verticallyContained: true,
        withinViewport: true,
        intersectsViewport: true,
      },
      controls: {
        x: 63,
        y: 416,
        width: 234,
        height: 240,
        visible: true,
        horizontallyContained: true,
        verticallyContained: true,
        withinViewport: true,
        intersectsViewport: true,
      },
    };

    expect(() => validatePlan40ScreenshotLayout(cleanLayout, 'clean.png')).not.toThrow();

    // Partially offscreen controls (translated down 300px: bounds y=716.84, height=200.59 in 740px viewport)
    const offscreenLayout = {
      ...cleanLayout,
      controls: {
        x: 63,
        y: 716.84,
        width: 234,
        height: 200.59,
        visible: true,
        horizontallyContained: true,
        verticallyContained: false,
        withinViewport: false,
        intersectsViewport: true,
      },
    };

    expect(() => validatePlan40ScreenshotLayout(offscreenLayout, 'offscreen.png')).toThrow(
      /has question or controls outside the viewport/,
    );
  });

  it('declares screenshots and layout measurement across all 4 required viewport configurations', () => {
    const plan40Routes = matrix.routes.filter((route) => route.id.startsWith('ROUTE-PLAN40-'));

    // 1. 360x740: responsive viewports
    const r360x740 = plan40Routes.find((r) => r.id === 'ROUTE-PLAN40-RESPONSIVE-VIEWPORTS');
    expect(r360x740.viewport).toEqual({ width: 360, height: 740 });
    expect(r360x740.actions.some((a) => a.method === 'screenshot' && a.measureLayout)).toBe(true);

    // 2. 360x752: linear view in completePlan40SubtractionSet
    const r360x752 = plan40Routes.find((r) => r.id === 'ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL');
    expect(r360x752.viewport).toEqual({ width: 360, height: 752 });

    // 3. 1366x768: desktop inspect largest target 30 case
    const r1366 = plan40Routes.find((r) => r.id === 'ROUTE-PLAN40-DEEP-SAMPLE-INSPECT-REPAIR');
    expect(r1366.viewport).toEqual({ width: 1366, height: 768 });
    const target30Screenshot = r1366.actions.find(
      (a) => a.method === 'screenshot' && a.file.includes('largest-target30'),
    );
    expect(target30Screenshot).toBeDefined();
    expect(target30Screenshot.measureLayout).toBe(true);

    // 4. 1093x614: Chromebook viewport with deviceScaleFactor 1.25
    const r1093 = plan40Routes.find((r) => r.id === 'ROUTE-PLAN40-CHROMEBOOK-SCALED-VIEWPORT');
    expect(r1093.viewport).toEqual({ width: 1093, height: 614 });
    expect(r1093.deviceScaleFactor).toBe(1.25);
    const chromebookScreenshot = r1093.actions.find(
      (a) => a.method === 'screenshot' && a.file.includes('chromebook-1093x614'),
    );
    expect(chromebookScreenshot).toBeDefined();
    expect(chromebookScreenshot.measureLayout).toBe(true);
  });

  it('asserts fresh first-item identity and cleared state on re-entry in subtraction set helper', async () => {
    const { buildPlan40SubtractionSetActions } = await import('../scripts/dev/plan40-route-subtraction.mjs');
    const actions = buildPlan40SubtractionSetActions({ view: 'visual', supportProfile: 'high-support' });
    const reEntryEncounter = actions.find(
      (a) => a.description && a.description.includes('Re-entry resets to fresh item 1 identity'),
    );
    expect(reEntryEncounter).toBeDefined();
    expect(reEntryEncounter.method).toBe('assert');
    const encounterValues = reEntryEncounter.assertions.map((a) => a.value).filter(Boolean);
    expect(encounterValues).toContain('Next');
    expect(encounterValues).toContain('Look at these two fractions.');
    expect(encounterValues).toContain('1 over 2');
    expect(encounterValues).toContain('minus');
    expect(encounterValues).toContain('−');
    expect(encounterValues).toContain('1 over 5');

    const notHasSelectors = reEntryEncounter.assertions
      .filter((a) => a.type === 'notHasSelector')
      .map((a) => a.target);
    expect(notHasSelectors.some((sel) => sel.includes('recovery-feedback'))).toBe(true);
    expect(notHasSelectors.some((sel) => sel.includes('-subtraction-task-help'))).toBe(true);
    expect(notHasSelectors.some((sel) => sel.includes('input'))).toBe(true);

    const reEntryTransform = actions.find(
      (a) => a.description && a.description.includes('Verify transform beat has empty input drafts'),
    );
    expect(reEntryTransform).toBeDefined();
    expect(reEntryTransform.method).toBe('assert');
    expect(reEntryTransform.assertions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'inputValueEquals', target: '.app-visual-view #transform-num-input-left', value: '' }),
        expect.objectContaining({ type: 'attributeEquals', target: '.app-visual-view .active-beat-controls .app-secondary-button', attribute: 'aria-expanded', value: 'false' }),
        expect.objectContaining({ type: 'containsText', target: '.app-visual-view .active-beat-controls .app-secondary-button', value: 'Need help?' }),
        expect.objectContaining({ type: 'notHasSelector', target: '.app-visual-view .recovery-feedback' }),
        expect.objectContaining({ type: 'notHasSelector', target: '.app-visual-view #transform-num-input-right' }),
      ]),
    );

    // Linear path re-entry assertion check
    const linearActions = buildPlan40SubtractionSetActions({ view: 'linear', supportProfile: 'medium-support' });
    const linearEncounter = linearActions.find(
      (a) => a.description && a.description.includes('Re-entry resets to fresh item 1 identity'),
    );
    expect(linearEncounter.assertions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'attributeEquals', target: '.app-linear-view .symbolic-expression', attribute: 'aria-label', value: '1 over 2 minus 1 over 5' }),
      ]),
    );
    const linearTransform = linearActions.find(
      (a) => a.description && a.description.includes('Verify transform beat has empty input drafts'),
    );
    expect(linearTransform.assertions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'inputValueEquals', target: '.app-linear-view #linear-transform-num-input-left', value: '' }),
        expect.objectContaining({ type: 'attributeEquals', target: '.app-linear-view .active-beat-controls .app-secondary-button', attribute: 'aria-expanded', value: 'false' }),
        expect.objectContaining({ type: 'containsText', target: '.app-linear-view .active-beat-controls .app-secondary-button', value: 'Need help?' }),
      ]),
    );
  });

  it('declares 98 route rows and 100 total browser executions for the expanded matrix', () => {
    expect(matrix.routes).toHaveLength(98);
    const executions = expandRouteExecutions(matrix.routes);
    expect(executions).toHaveLength(100);
  });
});
