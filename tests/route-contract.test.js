import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';

const require = createRequire(import.meta.url);
const {
  expandRouteExecutions,
  motionWitnessSeeds,
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
    expect(matrix.routes).toHaveLength(44);
    const learnerRoutes = matrix.routes.filter((route) => route.configuration !== 'plan15-subtraction-prototype');
    expect(learnerRoutes).toHaveLength(42);
    for (const route of learnerRoutes) {
      expect(route.startingSurface).toBe('mounted-app-entry');
      expect(route.viewport.width).toBe(route.id === 'ROUTE-PLAN22-36-PREMISE-LINEAR-REDUCED' ? 320 : 360);
      expect(route.viewport.height).toBe([
        'ROUTE-REPLAY-COND-1',
        'ROUTE-REPLAY-NEW-CONVERSION-COND-1',
        'ROUTE-REPLAY-REDUCED-COND-1',
      ].includes(route.id) ? 752 : 740);
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

  it('executes each prototype route in both motion modes and brings in its filtered negative control', () => {
    const executions = expandRouteExecutions(matrix.routes);
    expect(executions).toHaveLength(46);
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

  it('preserves the Plan 11 route baseline and witnesses executed motion, interruption, Replay, static arms, and both support profiles', () => {
    expect(matrix.routes).toHaveLength(44);
    expect(matrix.routes.filter((route) => !route.id.startsWith('ROUTE-PLAN22-36-'))).toHaveLength(41);
    expect(expandRouteExecutions(matrix.routes)).toHaveLength(46);

    const route = (id) => matrix.routes.find((candidate) => candidate.id === id);
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
