import { describe, expect, it } from 'vitest';
import {
  PLAN36_SUBTRACTION_AUTHORING_REVISION,
  PLAN36_SUBTRACTION_DEFINITION_ID,
  PLAN36_SUBTRACTION_DEFINITION_REVISION,
  PLAN36_SUBTRACTION_FIXTURES,
  PLAN36_SUBTRACTION_PRACTICE_SET,
  PLAN36_SUBTRACTION_PRACTICE_SET_ID,
  PLAN36_SUBTRACTION_PRACTICE_SET_REVISION,
  PLAN36_SUBTRACTION_PROFILE_ID,
  PLAN36_SUBTRACTION_RECIPE_ID,
  PLAN36_SUBTRACTION_RECIPE_REVISION,
  PLAN36_SUBTRACTION_RECORDS,
  PLAN36_SUBTRACTION_SELECTOR,
  PLAN36_SUBTRACTION_TASK_DATA,
  PLAN36_SUBTRACTION_TASK_DATA_ID,
  PLAN36_SUBTRACTION_TASK_DATA_REVISION,
  findPlan36SubtractionAssociationSet,
  resolvePlan36SubtractionAssociationSet,
} from '../src/content/data/plan36-like-denominator-subtraction-records.js';
import {
  EXACT_PLAN36_TASK_CONTEXT_KEYS,
  isPlan36SubtractionDefinition,
  resolvePlan36LikeDenominatorSubtractionContext,
  validatePlan36LikeDenominatorSubtractionContext,
  validatePlan36LikeDenominatorSubtractionRecord,
} from '../src/content/plan36-like-denominator-takeaway-task.js';
import {
  MATERIALIZED_PLAN36_SUBTRACTIONS,
  listPlan36MaterializedContent,
} from '../src/content/authored-problem-materializer.js';
import {
  resolveAuthoredContent,
  resolveCuratedFixture,
} from '../src/content/authored-content-catalog.js';
import { PROFILE_DEFINITIONS, getProfile } from '../src/content/profiles.js';
import { validateProblemInstance } from '../src/content/validation.js';
import { createFraction, equalFractions, subtractAtCommonDenominator, simplifyFraction } from '../src/math/index.js';

describe('Plan 38 content and curated subtraction records (Stage 1)', () => {
  it('preserves existing phase1-dev-default and curated-review profiles unchanged', () => {
    const devDefault = PROFILE_DEFINITIONS['phase1-dev-default'];
    expect(devDefault.version).toBe('1');
    expect(devDefault.positiveResult).toBe(true);
    expect(devDefault.defaultSimplificationStatus).toBe('already-simplified');
    expect(devDefault.denominatorPool).toEqual([2n, 3n, 4n, 5n, 6n, 8n, 10n, 12n]);

    const curated = PROFILE_DEFINITIONS['curated-review'];
    expect(curated.version).toBe('1');
    expect(curated.positiveResult).toBe(true);
    expect(curated.defaultSimplificationStatus).toBe('already-simplified');
    expect(curated.denominatorPool).toEqual([2n, 3n, 4n, 5n, 6n, 7n, 8n, 10n, 12n]);

    const plan36 = PROFILE_DEFINITIONS['plan36-subtraction-review'];
    expect(plan36.version).toBe('1');
    expect(plan36.positiveResult).toBe(false);
    expect(plan36.defaultSimplificationStatus).toBe('any');
    expect(plan36.denominatorPool).toEqual([2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n]);
  });

  it('declares the exact 8 authored records with no expected answer, remainder count, or renderer state', () => {
    expect(PLAN36_SUBTRACTION_RECORDS).toHaveLength(8);
    const expectedItemIds = [
      'takeaway-8-5-minus-2',
      'takeaway-12-8-minus-3',
      'takeaway-10-7-minus-3',
      'takeaway-11-9-minus-4',
      'takeaway-9-6-minus-1',
      'takeaway-9-6-minus-6',
      'takeaway-6-5-minus-4',
      'takeaway-8-7-minus-1',
    ];
    expect(PLAN36_SUBTRACTION_RECORDS.map((r) => r.itemId)).toEqual(expectedItemIds);

    const allowedKeys = [
      'itemId',
      'fixtureId',
      'authoringRevision',
      'recipe',
      'taskData',
      'leftNumerator',
      'rightNumerator',
      'denominator',
    ].sort();

    for (const record of PLAN36_SUBTRACTION_RECORDS) {
      expect(Object.keys(record).sort()).toEqual(allowedKeys);
      expect(record.fixtureId).toBe(`curated-plan36-${record.itemId}`);
      expect(record.authoringRevision).toBe('plan36-record-v1');
      expect(record.recipe).toEqual({ id: 'plan36.like-denominator-takeaway', revision: '1' });
      expect(record.taskData).toEqual({ id: 'plan36-like-denominator-takeaway', revision: '1' });
      expect(record).not.toHaveProperty('expectedResult');
      expect(record).not.toHaveProperty('remainder');
      expect(record).not.toHaveProperty('renderer');
    }
  });

  it('declares the fixed practice set and task data with exact canonical identities', () => {
    expect(PLAN36_SUBTRACTION_PRACTICE_SET.id).toBe('like-denominator-subtraction-vetted-set');
    expect(PLAN36_SUBTRACTION_PRACTICE_SET.revision).toBe('1');
    expect(PLAN36_SUBTRACTION_PRACTICE_SET.itemIds).toEqual(PLAN36_SUBTRACTION_RECORDS.map((r) => r.itemId));

    expect(PLAN36_SUBTRACTION_TASK_DATA.id).toBe('plan36-like-denominator-takeaway');
    expect(PLAN36_SUBTRACTION_TASK_DATA.revision).toBe('1');
    expect(PLAN36_SUBTRACTION_TASK_DATA.schedule).toEqual(['encounter', 'operate', 'resolve']);
    expect(PLAN36_SUBTRACTION_TASK_DATA.operationActionIntent).toBe('mark-subtrahend-amount');
    expect(PLAN36_SUBTRACTION_TASK_DATA.answerIntent).toBe('submit-subtraction-result');
    expect(PLAN36_SUBTRACTION_TASK_DATA.responsePolicyId).toBe('exact-equivalent-fraction-v1');
    expect(PLAN36_SUBTRACTION_TASK_DATA.prompts.question).toBe('How much is left?');
    expect(PLAN36_SUBTRACTION_TASK_DATA.prompts.actionLabel).toBe('Take away');
  });

  it('materializes all 8 fixtures and passes exact content validation including reducible and zero cases', () => {
    expect(MATERIALIZED_PLAN36_SUBTRACTIONS).toHaveLength(8);
    expect(listPlan36MaterializedContent()).toBe(MATERIALIZED_PLAN36_SUBTRACTIONS);

    for (const entry of MATERIALIZED_PLAN36_SUBTRACTIONS) {
      const { fixture, instance } = entry;
      expect(fixture.profileId).toBe('plan36-subtraction-review');
      expect(fixture.selector).toBe('like-denominator-subtraction');
      expect(fixture.overlays).toEqual([]);

      const validity = validateProblemInstance(instance);
      expect(validity.valid).toBe(true);

      const catalogFixture = resolveCuratedFixture(fixture.id, fixture.authoringRevision);
      expect(catalogFixture).toBe(fixture);

      const catalogAuthored = resolveAuthoredContent(fixture.id, fixture.authoringRevision);
      expect(catalogAuthored).toBe(entry);

      // Verify mathematical facts
      const left = createFraction(BigInt(fixture.left.numerator), BigInt(fixture.left.denominator));
      const right = createFraction(BigInt(fixture.right.numerator), BigInt(fixture.right.denominator));
      const diff = subtractAtCommonDenominator(left, right, left.denominator);
      expect(instance.resultState.canonicalRawResultForm).toEqual({
        kind: 'fraction',
        numerator: diff.numerator.toString(),
        denominator: diff.denominator.toString(),
      });
    }

    // Specific verification of reducible and zero boundary records
    const item10 = MATERIALIZED_PLAN36_SUBTRACTIONS.find((e) => e.itemId === 'takeaway-10-7-minus-3');
    expect(item10.instance.resultState.canonicalRawResultForm).toEqual({ kind: 'fraction', numerator: '4', denominator: '10' });
    expect(item10.instance.resultState.preferredFinalForm).toEqual({ kind: 'fraction', numerator: '2', denominator: '5' });

    const itemZero = MATERIALIZED_PLAN36_SUBTRACTIONS.find((e) => e.itemId === 'takeaway-9-6-minus-6');
    expect(itemZero.instance.resultState.canonicalRawResultForm).toEqual({ kind: 'fraction', numerator: '0', denominator: '9' });
    expect(itemZero.instance.resultState.preferredFinalForm).toEqual({ kind: 'fraction', numerator: '0', denominator: '1' });
    expect(itemZero.instance.classification.result.resultForm).toBe('zero');
  });

  it('resolves and validates the exact 12-key taskContext for each admitted record', () => {
    for (const entry of MATERIALIZED_PLAN36_SUBTRACTIONS) {
      const context = resolvePlan36LikeDenominatorSubtractionContext(entry.instance, entry.itemId);
      expect(Object.keys(context).sort()).toEqual([...EXACT_PLAN36_TASK_CONTEXT_KEYS].sort());
      expect(context.practiceSetId).toBe('like-denominator-subtraction-vetted-set');
      expect(context.practiceSetRevision).toBe('1');
      expect(context.itemId).toBe(entry.itemId);
      expect(context.fixtureId).toBe(entry.fixtureId);
      expect(context.authoringRevision).toBe('plan36-record-v1');
      expect(context.definitionId).toBe('phase-3-like-denominator-takeaway-subtraction');
      expect(context.definitionRevision).toBe('1');
      expect(context.recipeId).toBe('plan36.like-denominator-takeaway');
      expect(context.recipeRevision).toBe('1');
      expect(context.taskDataId).toBe('plan36-like-denominator-takeaway');
      expect(context.taskDataRevision).toBe('1');
      expect(context.sourceForms).toEqual({
        left: entry.fixture.left,
        right: entry.fixture.right,
      });

      const validated = validatePlan36LikeDenominatorSubtractionContext(entry.instance, context);
      expect(validated).toEqual(context);
    }
  });

  it('refuses malformed, negative, improper, zero-operand, and mismatched inputs before episode construction', () => {
    const validEntry = MATERIALIZED_PLAN36_SUBTRACTIONS[0];
    const validRecord = PLAN36_SUBTRACTION_RECORDS[0];

    // Refuses altered recipe ID
    expect(() => validatePlan36LikeDenominatorSubtractionRecord(validEntry.instance, {
      ...validRecord,
      recipe: { id: 'wrong-recipe', revision: '1' },
    })).toThrow(/recipe, task-data, and authoring revision/);

    // Refuses negative difference (subtrahend > minuend)
    expect(() => validatePlan36LikeDenominatorSubtractionRecord(validEntry.instance, {
      ...validRecord,
      leftNumerator: '2',
      rightNumerator: '5',
      denominator: '8',
    })).toThrow(/subtrahend numerator must not exceed minuend numerator/);

    // Refuses improper fraction (leftNumerator >= denominator)
    expect(() => validatePlan36LikeDenominatorSubtractionRecord(validEntry.instance, {
      ...validRecord,
      leftNumerator: '8',
      rightNumerator: '2',
      denominator: '8',
    })).toThrow(/operands must be proper fractions/);

    // Refuses zero operand
    expect(() => validatePlan36LikeDenominatorSubtractionRecord(validEntry.instance, {
      ...validRecord,
      rightNumerator: '0',
    })).toThrow(/canonical positive decimal strings/);

    // Refuses unregistered item ID
    expect(() => resolvePlan36LikeDenominatorSubtractionContext(validEntry.instance, 'unknown-item'))
      .toThrow(/exact registered practice-set and item membership is required/);

    // Refuses invalid context keys
    const validContext = resolvePlan36LikeDenominatorSubtractionContext(validEntry.instance, validEntry.itemId);
    expect(() => validatePlan36LikeDenominatorSubtractionContext(validEntry.instance, {
      ...validContext,
      extraKey: 'not-allowed',
    })).toThrow(/exact task context shape is required/);

    expect(() => validatePlan36LikeDenominatorSubtractionContext(validEntry.instance, {
      ...validContext,
      recipeRevision: '2',
    })).toThrow(/recipeRevision does not match its immutable authored association/);
  });

  it('correctly identifies the Plan 36 episode definition', () => {
    expect(isPlan36SubtractionDefinition({
      id: 'phase-3-like-denominator-takeaway-subtraction',
      revision: '1',
    })).toBe(true);

    expect(isPlan36SubtractionDefinition({
      id: 'phase-3-like-denominator-takeaway-subtraction',
      revision: '2',
    })).toBe(false);

    expect(isPlan36SubtractionDefinition({
      id: 'phase-3-reusable-addition-recipes',
      revision: '1',
    })).toBe(false);
  });
});
