import { describe, expect, it } from 'vitest';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { REGISTERED_SUPPORT_LEVELS } from '../src/app/support-levels.js';
import {
  resolveAuthoredContent,
  resolveCuratedFixture,
} from '../src/content/authored-content-catalog.js';
import {
  CROSSING_ADDITION_RECORDS,
} from '../src/content/data/crossing-addition-records.js';
import {
  MATERIALIZED_PLAN17_ADDITIONS,
  materializeCrossingAdditionRecords,
} from '../src/content/authored-problem-materializer.js';
import { validateAuthoredPathTaskData, validateAuthoredTaskData } from '../src/content/authored-task-data.js';
import { evaluateInstanceEligibility, evaluateProposedPathEligibility } from '../src/content/eligibility.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { validateProblemInstance } from '../src/content/validation.js';
import { addAtCommonDenominator, convertToDenominator, equalFractions } from '../src/math/index.js';
import { wireToForm } from '../src/content/schema.js';
import { PLAN17_CROSSING_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { evaluateTaskPathClosure } from '../src/interaction/path-closure.js';

const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const item = practiceType.items[10];

function buildInstance(fixtureOverride = null) {
  const fixture = fixtureOverride ?? resolveCuratedFixture(item.fixtureId, item.authoringRevision);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: {
      left: fixture.left,
      right: fixture.right,
      reviewedTransitions: fixture.reviewedTransitions ?? [],
    },
  });
}

describe('Plan 17 crossing addition content', () => {
  it('materializes the exact registered fixture and authored 12/24 policies', () => {
    expect(item).toMatchObject({
      id: 'two-thirds-plus-three-fourths',
      fixtureId: 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths',
      authoringRevision: 'plan17-record-v1',
      episodeDefinitionId: PLAN17_CROSSING_EPISODE_DEFINITION.id,
      episodeDefinitionRevision: '1',
      targetDenominators: ['12', '24'],
    });
    expect(CROSSING_ADDITION_RECORDS).toHaveLength(1);
    expect(MATERIALIZED_PLAN17_ADDITIONS).toHaveLength(1);
    expect(resolveAuthoredContent(item.fixtureId, item.authoringRevision))
      .toEqual(MATERIALIZED_PLAN17_ADDITIONS[0]);

    const authored = MATERIALIZED_PLAN17_ADDITIONS[0];
    expect(authored.premiseChecks['12']).toMatchObject({
      presentedForm: { kind: 'fraction', numerator: '7', denominator: '12' },
      isEquivalent: false,
      expectedResponse: 'no',
    });
    expect(authored.premiseChecks['24']).toMatchObject({
      presentedForm: { kind: 'fraction', numerator: '16', denominator: '24' },
      isEquivalent: true,
      expectedResponse: 'yes',
    });
    expect(authored.reflectionChoices['12'].map((choice) => choice.form)).toEqual([
      { kind: 'fraction', numerator: '8', denominator: '12' },
      { kind: 'fraction', numerator: '2', denominator: '12' },
      { kind: 'fraction', numerator: '9', denominator: '12' },
    ]);
    expect(authored.reflectionChoices['24'].map((choice) => choice.form)).toEqual([
      { kind: 'fraction', numerator: '2', denominator: '24' },
      { kind: 'fraction', numerator: '15', denominator: '24' },
      { kind: 'fraction', numerator: '16', denominator: '24' },
    ]);
  });

  it('validates exact math and complete authored coverage independently for both paths', () => {
    const instance = buildInstance();
    expect(validateProblemInstance(instance).valid).toBe(true);
    expect(instance.classification.result).toMatchObject({
      exactResult: { kind: 'fraction', numerator: '17', denominator: '12' },
      canonicalRawResultForm: { kind: 'fraction', numerator: '17', denominator: '12' },
      crossesWhole: true,
      resultForm: 'improper',
    });
    expect(instance.representationFacts.wholeSpan).toEqual({ lowerWhole: '1', upperWhole: '2' });
    expect(validateAuthoredTaskData(instance, item.targetDenominators)).toBe(true);

    const left = wireToForm(instance.operands.left.initialForm);
    const right = wireToForm(instance.operands.right.initialForm);
    for (const [target, expected] of [['12', ['8', '9', '17']], ['24', ['16', '18', '34']]]) {
      const denominator = BigInt(target);
      const renamedLeft = convertToDenominator(left, denominator);
      const renamedRight = convertToDenominator(right, denominator);
      const result = convertToDenominator(
        addAtCommonDenominator(left, right, denominator),
        denominator,
      );
      expect([
        renamedLeft.numerator.toString(),
        renamedRight.numerator.toString(),
        result.numerator.toString(),
      ]).toEqual(expected);
      expect(validateAuthoredPathTaskData(instance, target)).toBe(true);
      for (const condition of REGISTERED_CONDITIONS) {
        for (const support of REGISTERED_SUPPORT_LEVELS) {
          expect(evaluateTaskPathClosure({
            instance,
            targetDenominator: target,
            episodeDefinition: PLAN17_CROSSING_EPISODE_DEFINITION,
            activeCondition: condition.activeCondition,
            support: support.configuration,
          }).available).toBe(true);
        }
      }
    }
    expect(evaluateInstanceEligibility(instance).paths.alternates[0]).toMatchObject({
      targetDenominator: '24',
      rendering: 'eligible',
    });
    expect(equalFractions(
      wireToForm(instance.classification.result.exactResult),
      addAtCommonDenominator(left, right, 12n),
    )).toBe(true);
  });

  it('keeps invalid math, representation overflow, and missing task data distinct', () => {
    const instance = buildInstance();
    expect(evaluateProposedPathEligibility(instance, '36')).toMatchObject({
      mathematicalValidity: 'valid',
      rendering: 'ineligible',
      authoredCoverage: 'outside-authored-coverage',
      reasons: ['denominator-ceiling-exceeded'],
    });
    expect(evaluateProposedPathEligibility(instance, '8').mathematicalValidity).toBe('invalid');

    const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
    const unregisteredTaskRevision = buildInstance({
      ...fixture,
      authoringRevision: 'plan17-missing-task-test-v1',
    });
    const closure = evaluateTaskPathClosure({
      instance: unregisteredTaskRevision,
      targetDenominator: '12',
      episodeDefinition: PLAN17_CROSSING_EPISODE_DEFINITION,
      activeCondition: REGISTERED_CONDITIONS[0].activeCondition,
    });
    expect(closure).toMatchObject({ available: false, reason: 'missing-condition-reflection-data' });

    const missingAlternate = {
      ...CROSSING_ADDITION_RECORDS[0],
      paths: { '12': CROSSING_ADDITION_RECORDS[0].paths['12'] },
    };
    expect(() => materializeCrossingAdditionRecords([missingAlternate]))
      .toThrow(/authored paths must equal the exact representation-eligible paths/);

    const alteredOperands = {
      ...CROSSING_ADDITION_RECORDS[0],
      left: { ...CROSSING_ADDITION_RECORDS[0].left, numerator: '1' },
    };
    expect(() => materializeCrossingAdditionRecords([alteredOperands]))
      .toThrow(/recipe, selector, and immutable revisions/);
  });
});
