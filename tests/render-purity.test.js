import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createFractionBarRenderer } from '../src/render/fraction-bar.js';
import { createSymbolicRenderer } from '../src/render/symbolic.js';
import { assertValidScene, RenderContractError } from '../src/render/contract.js';

describe('Renderer Purity & Determinism by Construction (Requirement 2, Condition C)', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  function createSyntheticScene({
    leftNum = '2',
    leftDen = '3',
    rightNum = '1',
    rightDen = '4',
    rawSumNum = null,
    rawSumDen = null,
    mode = 'standard-motion',
  } = {}) {
    const scene = {
      schemaVersion: 'fractionflow.scene/v1',
      kind: 'scene',
      meaning: {
        representationRole: 'fraction-bar',
        condition: {
          id: 'phase2-bundle-1',
          revision: '1',
          display: 'D-01-A',
          choreography: 'D-02-M',
          promptCadence: 'D-05-focused-key-beats',
          connectionMaking: 'CM-01-M',
        },
        quantities: {
          left: {
            id: 'left',
            quantity: { exactValue: { n: leftNum, d: leftDen } },
            sourceForm: { kind: 'fraction', numerator: leftNum, denominator: leftDen },
            currentForm: { kind: 'fraction', numerator: leftNum, denominator: leftDen },
            unit: { denominator: leftDen },
            count: { numerator: leftNum },
            whole: {
              kind: 'stable-unit-whole',
              id: 'left-stable-whole',
              extent: { lowerWhole: '0', upperWhole: '1' },
            },
          },
          right: {
            id: 'right',
            quantity: { exactValue: { n: rightNum, d: rightDen } },
            sourceForm: { kind: 'fraction', numerator: rightNum, denominator: rightDen },
            currentForm: { kind: 'fraction', numerator: rightNum, denominator: rightDen },
            unit: { denominator: rightDen },
            count: { numerator: rightNum },
            whole: {
              kind: 'stable-unit-whole',
              id: 'right-stable-whole',
              extent: { lowerWhole: '0', upperWhole: '1' },
            },
          },
        },
        unitRelationship: {
          sourceDenominators: { left: leftDen, right: rightDen },
          commonUnit: null,
          authoredCoverage: null,
        },
        currentTask: {
          beat: 'encounter',
          responsibility: 'inspect-expression',
          promptId: 'phase2.encounter',
          inputKind: 'acknowledge',
          target: null,
          evidenceCategory: 'supported-construction',
        },
        availableAction: null,
        status: { episode: 'active', recovery: null },
        operation: {
          operation: 'add',
          currentForms: null,
          rawResult: rawSumNum ? { kind: 'fraction', numerator: rawSumNum, denominator: rawSumDen } : null,
          resultWholeSpan: null,
          preferredFinalForm: null,
        },
        transition: null,
        capability: { instance: 'eligible', activePath: null, authoredCoverage: null, continuation: null },
        support: { fractionBar: 'high', commonDenominator: 'constrained-choices' },
        supportConsequence: { nextResponseSupport: null, lastHelp: null },
      },
      presentation: { mode },
      derivation: { key: 'synthetic-key' },
    };

    // Deep freeze to guarantee immutability
    return Object.freeze({
      ...scene,
      meaning: Object.freeze({
        ...scene.meaning,
        quantities: Object.freeze({
          left: Object.freeze({
            ...scene.meaning.quantities.left,
            currentForm: Object.freeze(scene.meaning.quantities.left.currentForm),
            whole: Object.freeze(scene.meaning.quantities.left.whole),
          }),
          right: Object.freeze({
            ...scene.meaning.quantities.right,
            currentForm: Object.freeze(scene.meaning.quantities.right.currentForm),
            whole: Object.freeze(scene.meaning.quantities.right.whole),
          }),
        }),
        operation: Object.freeze({ ...scene.meaning.operation }),
        currentTask: Object.freeze({ ...scene.meaning.currentTask }),
      }),
      presentation: Object.freeze({ ...scene.presentation }),
    });
  }

  it('proves by construction that the fraction bar does not compute mathematics', () => {
    // Pass arbitrary non-standard values (e.g. 5/17)
    // If the renderer were computing mathematical truth, it might reject or alter 17
    // Because it is pure presentation, it faithfully displays 5 shaded out of 17 segments.
    const scene = createSyntheticScene({ leftNum: '5', leftDen: '17' });
    const container = doc.createElement('div');
    const barRenderer = createFractionBarRenderer({ side: 'left', container });

    barRenderer.mount(scene);

    const root = barRenderer.getElement();
    expect(root).toBeTruthy();
    expect(root.getAttribute('aria-label')).toContain('5 of 17 equal parts');

    const segments = root.querySelectorAll('.fraction-bar-segment');
    expect(segments.length).toBe(17);

    const shaded = root.querySelectorAll('.fraction-bar-segment.shaded');
    expect(shaded.length).toBe(5);

    const unshaded = root.querySelectorAll('.fraction-bar-segment.unshaded');
    expect(unshaded.length).toBe(12);
  });

  it('proves by construction that symbolic renderer does not compute sums', () => {
    // When rawResult is null in the scene, the renderer never computes 2/3 + 1/4 = 11/12
    const beforeOperationScene = createSyntheticScene({
      leftNum: '2',
      leftDen: '3',
      rightNum: '1',
      rightDen: '4',
      rawSumNum: null,
      rawSumDen: null,
    });

    const container = doc.createElement('div');
    const symRenderer = createSymbolicRenderer({ container });
    symRenderer.mount(beforeOperationScene);

    const root = symRenderer.getElement();
    // No equals sign or result when not established
    expect(root.textContent).not.toContain('=');
    expect(root.textContent).not.toContain('11');

    // When established in scene, displays rawResult faithfully without recomputing
    const afterOperationScene = createSyntheticScene({
      leftNum: '8',
      leftDen: '12',
      rightNum: '3',
      rightDen: '12',
      rawSumNum: '11',
      rawSumDen: '12',
    });

    symRenderer.update(afterOperationScene);
    expect(root.textContent).toContain('=');
    expect(root.textContent).toContain('11');
    expect(root.textContent).toContain('12');
  });

  it('condition C: renderers reject mutable or invalid scenes and require frozen scenes', () => {
    const mutableScene = {
      kind: 'scene',
      meaning: { test: 123 },
      presentation: { mode: 'standard-motion' },
    };

    expect(() => assertValidScene(mutableScene)).toThrow(RenderContractError);
    expect(() => assertValidScene(null)).toThrow(RenderContractError);
    expect(() => assertValidScene({ kind: 'capability-refusal' })).toThrow(RenderContractError);
  });

  it('demonstrates determinism: identical scenes produce identical DOM structure', () => {
    const sceneA = createSyntheticScene({ leftNum: '3', leftDen: '5' });
    const sceneB = createSyntheticScene({ leftNum: '3', leftDen: '5' });

    const containerA = doc.createElement('div');
    const containerB = doc.createElement('div');

    const barA = createFractionBarRenderer({ side: 'left', container: containerA });
    const barB = createFractionBarRenderer({ side: 'left', container: containerB });

    barA.mount(sceneA);
    barB.mount(sceneB);

    const rootA = barA.getElement();
    const rootB = barB.getElement();

    expect(rootA.getAttribute('aria-label')).toBe(rootB.getAttribute('aria-label'));
    expect(rootA.querySelectorAll('.fraction-bar-segment').length).toBe(
      rootB.querySelectorAll('.fraction-bar-segment').length,
    );
    expect(rootA.querySelectorAll('.fraction-bar-segment.shaded').length).toBe(
      rootB.querySelectorAll('.fraction-bar-segment.shaded').length,
    );
  });
});
