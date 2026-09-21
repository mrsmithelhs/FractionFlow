import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { createBeatContainer } from '../src/render/beat-container.js';
import { createLinearPathRenderer } from '../src/render/linear-path.js';
import { STRINGS } from '../src/render/strings.js';
import { deepFreeze } from '../src/content/schema.js';
import { CLASSIFICATION_RECOVERY_KINDS } from '../src/interaction/classification.js';

describe('Render Recovery Dispatch & Dead-Code Guard (Repair 04, Items 1, 4, 6)', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  function createSceneWithRecovery({ beat = 'transform', classification }) {
    return deepFreeze({
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
        reflectionChoices: beat === 'reflect' ? [
          { id: 'choice-1', form: { kind: 'fraction', numerator: '8', denominator: '12' } },
          { id: 'choice-2', form: { kind: 'fraction', numerator: '7', denominator: '12' } },
          { id: 'choice-3', form: { kind: 'fraction', numerator: '6', denominator: '12' } },
        ] : null,
        quantities: {
          left: {
            id: 'left',
            quantity: { exactValue: { n: '2', d: '3' } },
            sourceForm: { kind: 'fraction', numerator: '2', denominator: '3' },
            currentForm: { kind: 'fraction', numerator: '2', denominator: '3' },
            unit: { denominator: '3' },
            count: { numerator: '2' },
            whole: { kind: 'stable-unit-whole', id: 'w1', extent: { lowerWhole: '0', upperWhole: '1' } },
          },
          right: {
            id: 'right',
            quantity: { exactValue: { n: '1', d: '4' } },
            sourceForm: { kind: 'fraction', numerator: '1', denominator: '4' },
            currentForm: { kind: 'fraction', numerator: '1', denominator: '4' },
            unit: { denominator: '4' },
            count: { numerator: '1' },
            whole: { kind: 'stable-unit-whole', id: 'w2', extent: { lowerWhole: '0', upperWhole: '1' } },
          },
        },
        unitRelationship: {
          sourceDenominators: { left: '3', right: '4' },
          candidateDenominators: null,
          commonUnit: { targetDenominator: '12' },
          authoredCoverage: null,
        },
        currentTask: {
          beat,
          responsibility: 'learner',
          promptId: `task-${beat}`,
          target: beat === 'transform' ? 'left' : null,
          connectionForm: beat === 'reflect' ? 'matching' : null,
        },
        availableAction: {
          responsibility: 'learner',
          inputKind: 'numeric-fraction',
          target: 'left',
        },
        status: {
          episode: 'active',
          recovery: {
            beat,
            classification,
          },
        },
        operation: {
          operation: 'add',
          currentForms: null,
          rawResult: null,
          resultWholeSpan: null,
          preferredFinalForm: null,
        },
        transition: null,
        capability: {
          verdict: 'eligible',
          supportedRoles: ['fraction-bar', 'symbolic'],
          recommendedRole: 'fraction-bar',
        },
        support: null,
        supportConsequence: null,
      },
      presentation: {
        mode: 'standard-motion',
        reducedMotion: false,
        activePath: 'visual',
        choreography: 'in-place',
      },
    });
  }

  const recoveryKinds = [
    {
      kind: 'denominator-changed-without-numerator',
      beat: 'transform',
      classification: {
        kind: 'denominator-changed-without-numerator',
        validity: 'invalid',
        mathClassification: 'invalid-equivalent-fraction',
        patterns: ['denominator-changed-numerator-fixed'],
        targetDenominator: '12',
        side: 'left',
        reasons: ['numerator-incorrect'],
      },
      expectedString: STRINGS.transform.errorScaleFactor,
    },
    {
      kind: 'incorrect-equivalent-numerator',
      beat: 'transform',
      classification: {
        kind: 'incorrect-equivalent-numerator',
        validity: 'invalid',
        mathClassification: 'invalid-equivalent-fraction',
        patterns: [],
        targetDenominator: '12',
        side: 'left',
        reasons: ['numerator-incorrect'],
      },
      expectedString: STRINGS.transform.errorNumerator,
    },
    {
      kind: 'incorrect-numerator-arithmetic',
      beat: 'operate',
      classification: {
        kind: 'incorrect-numerator-arithmetic',
        validity: 'invalid',
        mathClassification: 'incorrect',
        patterns: [],
        targetDenominator: '12',
        proposed: { kind: 'fraction', numerator: '10', denominator: '12' },
        reasons: ['value-incorrect'],
      },
      expectedString: STRINGS.operate.errorArithmetic,
    },
    {
      kind: 'invalid-common-denominator',
      beat: 'decide',
      classification: {
        kind: 'invalid-common-denominator',
        validity: 'invalid',
        mathClassification: 'invalid',
        targetDenominator: '18',
        reasons: ['not-common-multiple'],
        authoredCoverage: 'not-applicable',
        rendering: 'ineligible',
        continuation: 'local-recovery',
      },
      expectedString: STRINGS.decide.invalidDenominator('18'),
    },
    {
      kind: 'incorrect-notice',
      beat: 'notice',
      classification: {
        kind: 'incorrect-notice',
        expectedMatches: false,
        matchesUnits: true,
      },
      expectedString: STRINGS.notice.feedbackSame('3', '4'),
    },
    {
      kind: 'incorrect-reflection',
      beat: 'reflect',
      classification: {
        kind: 'incorrect-reflection',
        response: 'choice-7-12',
        targetForm: { kind: 'fraction', numerator: '8', denominator: '12' },
        selectedForm: { kind: 'fraction', numerator: '7', denominator: '12' },
        continuation: 'local-recovery',
      },
      expectedVisualString: STRINGS.reflect.matchingDistractor,
      expectedLinearString: STRINGS.reflect.matchingDistractorLinear,
    },
    {
      kind: 'invalid-reflection-choice',
      beat: 'reflect',
      classification: {
        kind: 'invalid-reflection-choice',
        response: 'bogus-choice',
        continuation: 'local-recovery',
      },
      expectedVisualString: STRINGS.reflect.invalidChoice || STRINGS.status.stepIncorrect,
      expectedLinearString: STRINGS.reflect.invalidChoiceLinear || STRINGS.reflect.invalidChoice || STRINGS.status.stepIncorrect,
    },
  ];

  for (const entry of recoveryKinds) {
    it(`renders specific recovery message for "${entry.kind}" on visual path and never falls back to stepIncorrect`, () => {
      const scene = createSceneWithRecovery({ beat: entry.beat, classification: entry.classification });
      const container = doc.createElement('div');
      const beatContainer = createBeatContainer({ container, dispatchAction: () => {} });
      beatContainer.mount(scene);

      const recoveryEl = container.querySelector('.recovery-feedback');
      expect(recoveryEl).toBeTruthy();
      expect(recoveryEl.textContent).not.toBe(STRINGS.status.stepIncorrect);
      const expected = entry.expectedVisualString || entry.expectedString;
      expect(recoveryEl.textContent).toBe(expected);
    });

    it(`renders specific recovery message for "${entry.kind}" on linear path and never falls back to stepIncorrect`, () => {
      const scene = createSceneWithRecovery({ beat: entry.beat, classification: entry.classification });
      const container = doc.createElement('div');
      const linearRenderer = createLinearPathRenderer({ container, dispatchAction: () => {} });
      linearRenderer.mount(scene);

      const recoveryEl = container.querySelector('.recovery-feedback');
      expect(recoveryEl).toBeTruthy();
      expect(recoveryEl.textContent).not.toBe(STRINGS.status.stepIncorrect);
      const expected = entry.expectedLinearString || entry.expectedString;
      expect(recoveryEl.textContent).toBe(expected);
    });
  }

  it('Item 4: invalid denominator recovery explicitly names the attempted denominator instead of generic fallback', () => {
    const scene = createSceneWithRecovery({
      beat: 'decide',
      classification: {
        kind: 'invalid-common-denominator',
        validity: 'invalid',
        mathClassification: 'invalid',
        targetDenominator: '18',
        reasons: ['not-common-multiple'],
        authoredCoverage: 'not-applicable',
        rendering: 'ineligible',
        continuation: 'local-recovery',
      },
    });

    // Visual path
    const visualContainer = doc.createElement('div');
    const beatContainer = createBeatContainer({ container: visualContainer, dispatchAction: () => {} });
    beatContainer.mount(scene);
    const visualAlert = visualContainer.querySelector('.recovery-feedback');
    expect(visualAlert.textContent).toContain('18');
    expect(visualAlert.textContent).not.toContain('This number');

    // Linear path
    const linearContainer = doc.createElement('div');
    const linearRenderer = createLinearPathRenderer({ container: linearContainer, dispatchAction: () => {} });
    linearRenderer.mount(scene);
    const linearAlert = linearContainer.querySelector('.recovery-feedback');
    expect(linearAlert.textContent).toContain('18');
    expect(linearAlert.textContent).not.toContain('This number');
  });

  it('Item 5: covers every recovery kind emitted by classification.js in the guard table', () => {
    const tableKinds = new Set(recoveryKinds.map((entry) => entry.kind));
    for (const kind of CLASSIFICATION_RECOVERY_KINDS) {
      expect(tableKinds.has(kind)).toBe(true);
    }
    expect(tableKinds.size).toBe(CLASSIFICATION_RECOVERY_KINDS.length);

    // Statically verify that classification.js does not contain undeclared recovery kinds
    const source = readFileSync(new URL('../src/interaction/classification.js', import.meta.url), 'utf8');
    const matches = new Set(
      [...source.matchAll(/(?:kind:\s*|kind\s*=\s*)(?:[^\n;{}]*?\?\s*)?'([a-z-]+)'(?:\s*:\s*'([a-z-]+)')?/g)]
        .flatMap((m) => [m[1], m[2]].filter(Boolean))
        .filter((k) => (k.startsWith('incorrect-') || k.startsWith('invalid-') || k.startsWith('denominator-changed-')) && k !== 'incorrect-resolution'),
    );
    for (const kind of matches) {
      expect(tableKinds.has(kind)).toBe(true);
    }
  });
});
