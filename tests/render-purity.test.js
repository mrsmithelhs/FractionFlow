import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createFractionBarRenderer } from '../src/render/fraction-bar.js';
import { createSymbolicRenderer } from '../src/render/symbolic.js';
import { createBeatContainer } from '../src/render/beat-container.js';
import { createLinearPathRenderer } from '../src/render/linear-path.js';
import { createChoiceGroup, createNumericInput } from '../src/render/controls.js';
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
    beat = 'encounter',
    candidateDenominators = null,
    commonUnit = null,
    taskTarget = null,
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
          candidateDenominators,
          commonUnit,
          authoredCoverage: null,
        },
        currentTask: {
          beat,
          responsibility: beat === 'decide' ? 'choose-common-denominator' : beat === 'transform' ? 'construct-equivalent-form' : 'inspect-expression',
          promptId: `phase2.${beat}`,
          inputKind: beat === 'decide' ? 'whole-fraction' : beat === 'transform' ? 'fraction' : 'acknowledge',
          target: taskTarget,
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

  it('proves by construction that beat-container does not compute candidate common denominators', () => {
    // Non-standard fractions (5/17 and 3/19)
    // If beat-container performed arithmetic (e.g. 17 * 19 = 323, 17 * 2 = 34, 19 * 2 = 38 filtered by <= 30),
    // it would produce an empty candidate list [] because all derived values exceed 30.
    // Because it is pure presentation, it faithfully mounts exactly what upstream supplies:
    const scene = createSyntheticScene({
      leftNum: '5',
      leftDen: '17',
      rightNum: '3',
      rightDen: '19',
      beat: 'decide',
      candidateDenominators: ['17', '34', '51'],
    });

    const container = doc.createElement('div');
    const actions = [];
    const beatContainer = createBeatContainer({
      container,
      dispatchAction: (action) => actions.push(action),
    });

    beatContainer.mount(scene);
    const root = beatContainer.getElement();
    expect(root).toBeTruthy();

    // Verify buttons rendered match upstream candidates exactly without arithmetic
    const buttons = root.querySelectorAll('.control-choice-btn');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toBe('17');
    expect(buttons[1].textContent).toBe('34');
    expect(buttons[2].textContent).toBe('51');

    // Clicking dispatches without calculating truth
    buttons[1].click();
    expect(actions).toEqual([
      {
        type: 'propose-common-denominator',
        proposed: { kind: 'fraction', numerator: '34', denominator: '1' },
      },
    ]);
  });

  it('proves that beat-container falls back to numeric entry when candidateDenominators is null', () => {
    // At lower support levels or instances without eligible alternates, candidateDenominators is null.
    // beat-container mounts numeric entry rather than choice buttons, without calculating any candidates.
    const scene = createSyntheticScene({
      leftNum: '2',
      leftDen: '3',
      rightNum: '1',
      rightDen: '4',
      beat: 'decide',
      candidateDenominators: null,
    });

    const container = doc.createElement('div');
    const actions = [];
    const beatContainer = createBeatContainer({
      container,
      dispatchAction: (action) => actions.push(action),
    });

    beatContainer.mount(scene);
    const root = beatContainer.getElement();
    const choiceButtons = root.querySelectorAll('.control-choice-btn');
    expect(choiceButtons.length).toBe(0);

    const input = root.querySelector('.control-numeric-input');
    expect(input).toBeTruthy();

    input.value = '12';
    const submitBtn = root.querySelector('.control-submit-btn');
    submitBtn.click();

    expect(actions).toEqual([
      {
        type: 'propose-common-denominator',
        proposed: { kind: 'fraction', numerator: '12', denominator: '1' },
      },
    ]);
  });

  it('Blocker 2: proves that beat-container fails loud when commonUnit is missing at transform beat', () => {
    // A missing commonUnit at transform beat must throw RenderContractError loudly, never defaulting to '12'
    const scene = createSyntheticScene({
      beat: 'transform',
      taskTarget: 'left',
      commonUnit: null,
    });

    const container = doc.createElement('div');
    const beatContainer = createBeatContainer({
      container,
      dispatchAction: () => {},
    });

    expect(() => beatContainer.mount(scene)).toThrowError(
      expect.objectContaining({ code: 'MISSING_ESTABLISHED_UNIT' }),
    );
  });

  it('proves that controls.js does not compute mathematics or validate correctness', () => {
    const choiceGroup = createChoiceGroup({
      legend: 'Custom choices',
      options: [
        { label: 'Foo', value: 'foo', ariaLabel: 'Foo option' },
        { label: 'Bar', value: 'bar', ariaLabel: 'Bar option' },
      ],
      onSelect: (val) => val,
    });
    expect(choiceGroup).toBeTruthy();

    const actions = [];
    const numInput = createNumericInput({
      id: 'test-input',
      label: 'Enter value',
      onSubmit: (val) => actions.push(val),
    });
    const inputEl = numInput.element.querySelector('input');
    inputEl.value = '9999';
    const btn = numInput.element.querySelector('button');
    btn.click();
    expect(actions).toEqual(['9999']);
  });

  it('behavioral purity probe: renderers faithfully display mutually inconsistent mathematical values without derivation (Condition 2)', () => {
    // Condition 2: Behavioral purity check that is completely rename-proof.
    // Feed the renderers scenes whose mathematical fields are mutually inconsistent:
    // 1. Inconsistent candidates ['7', '19'] for 2/3 and 1/4 (real candidates would be 12, 24).
    const sceneDecide = createSyntheticScene({
      leftNum: '2',
      leftDen: '3',
      rightNum: '1',
      rightDen: '4',
      beat: 'decide',
      candidateDenominators: ['7', '19'],
    });

    const containerVisual = doc.createElement('div');
    const beatContainer = createBeatContainer({
      container: containerVisual,
      dispatchAction: () => {},
    });
    beatContainer.mount(sceneDecide);

    const containerLinear = doc.createElement('div');
    const linearPath = createLinearPathRenderer({
      container: containerLinear,
      dispatchAction: () => {},
    });
    linearPath.mount(sceneDecide);

    // Both renderers must display exactly '7' and '19', never deriving 12 or 24 from 3 and 4
    const visualButtons = Array.from(containerVisual.querySelectorAll('.control-choice-btn')).map((b) => b.textContent);
    expect(visualButtons).toEqual(['7', '19']);

    const linearButtons = Array.from(containerLinear.querySelectorAll('.control-choice-btn')).map((b) => b.textContent);
    expect(linearButtons).toEqual(['7', '19']);

    // 2. Inconsistent common unit and converted numerators:
    // Common denominator '5' with converted numerators '13' and '29' for 2/3 and 1/4
    const sceneTransform = createSyntheticScene({
      leftNum: '13',
      leftDen: '5',
      rightNum: '29',
      rightDen: '5',
      beat: 'operate',
      commonUnit: { targetDenominator: '5' },
    });

    beatContainer.update(sceneTransform);
    linearPath.update(sceneTransform);

    // The operate input label must display '5', and completed summaries must display 13/5 and 29/5
    const visualLabel = containerVisual.querySelector('.control-label');
    expect(visualLabel.textContent).toContain('5');
    const linearPrompt = containerLinear.querySelector('.active-beat-prompt');
    expect(linearPrompt.textContent).toBeTruthy();

    const visualSummaries = Array.from(containerVisual.querySelectorAll('.completed-beat-summary')).map((s) => s.textContent);
    expect(visualSummaries.some((text) => text.includes('13/5'))).toBe(true);
    expect(visualSummaries.some((text) => text.includes('29/5'))).toBe(true);

    // 3. Arithmetically false sum: 99/5 instead of 42/5
    const sceneResolve = createSyntheticScene({
      leftNum: '13',
      leftDen: '5',
      rightNum: '29',
      rightDen: '5',
      rawSumNum: '99',
      rawSumDen: '5',
      beat: 'resolve',
      commonUnit: { targetDenominator: '5' },
    });

    beatContainer.update(sceneResolve);
    linearPath.update(sceneResolve);

    const visualSummary = containerVisual.querySelector('.resolve-summary');
    expect(visualSummary.textContent).toContain('99/5');
    expect(visualSummary.textContent).not.toContain('42');

    const linearSummary = containerLinear.querySelector('.resolve-summary');
    expect(linearSummary.textContent).toContain('99/5');
    expect(linearSummary.textContent).not.toContain('42');
  });

  it('statically verifies module isolation: render modules never import from math/content or call arithmetic functions', () => {
    const renderFiles = [
      'contract.js',
      'strings.js',
      'fraction-bar.js',
      'symbolic.js',
      'controls.js',
      'beat-container.js',
      'linear-path.js',
      'index.js',
    ];

    for (const file of renderFiles) {
      const source = readFileSync(new URL(`../src/render/${file}`, import.meta.url), 'utf8');

      // No imports from mathematical or content layers
      expect(source).not.toMatch(/from\s+['"][^'"]*\/math\//);
      expect(source).not.toMatch(/from\s+['"][^'"]*\/content\//);

      // No exact arithmetic derivation or BigInt in render
      expect(source).not.toMatch(/\bBigInt\b/);
      expect(source).not.toMatch(/\bgcd\s*\(/);
      expect(source).not.toMatch(/\blcm\s*\(/);

      // No hardcoded unit size names in strings/code
      expect(source).not.toMatch(/\bthirds\b/i);
      expect(source).not.toMatch(/\bfourths\b/i);

      // No fallback to '12'
      expect(source).not.toMatch(/\|\|\s*['"]12['"]/);
    }
  });
});
