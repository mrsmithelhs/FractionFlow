import { describe, expect, it } from 'vitest';
import {
  PLAN40_RECIPE_DEFINITION_ID,
  PLAN40_RECIPE_DEFINITION_REVISION,
  PLAN40_RECIPE_FIXTURES,
  PLAN40_RECIPE_IDS,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  PLAN40_SUBTRACTION_RECIPE_RECORDS,
  PLAN40_VETTED_BATCH,
  PLAN40_DATA_ONLY_HOLDOUTS,
  PLAN40_DATA_ONLY_HOLDOUTS_ID,
  PLAN40_DATA_ONLY_HOLDOUTS_REVISION,
  findPlan40RecipeAssociationSet,
  resolvePlan40RecipeAssociationSet,
} from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import {
  EXACT_PLAN40_TASK_CONTEXT_KEYS,
  isPlan40IdentifyRecipe,
  isPlan40SubtractionRecipeDefinition,
  listPlan40RecipeRecords,
  resolvePlan40SubtractionRecipeContext,
  validatePlan40SubtractionRecipeContext,
  validatePlan40SubtractionRecipeRecord,
} from '../src/content/plan40-reusable-subtraction-recipes.js';
import {
  resolveCuratedFixture,
} from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { PROFILE_DEFINITIONS, getProfile } from '../src/content/profiles.js';
import { validateProblemInstance } from '../src/content/validation.js';
import {
  createFraction,
  equalFractions,
  leastCommonDenominator,
  subtractAtCommonDenominator,
} from '../src/math/index.js';

function toMath(wire) {
  return createFraction(BigInt(wire.numerator), BigInt(wire.denominator));
}

function instanceFor(record) {
  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] },
  });
}

describe('Plan 40 content: curated subtraction records and recipes (Stage 1)', () => {
  it('preserves existing curated-review profile without modifications', () => {
    const curated = PROFILE_DEFINITIONS['curated-review'];
    expect(curated.version).toBe('1');
    expect(curated.positiveResult).toBe(true);
    expect(curated.defaultSimplificationStatus).toBe('already-simplified');
    expect(curated.denominatorPool).toEqual([2n, 3n, 4n, 5n, 6n, 7n, 8n, 10n, 12n]);
  });

  it('declares exactly 9 vetted records and 2 data-only holdouts', () => {
    expect(PLAN40_VETTED_BATCH).toHaveLength(9);
    expect(PLAN40_DATA_ONLY_HOLDOUTS).toHaveLength(2);
    expect(PLAN40_SUBTRACTION_RECIPE_RECORDS).toHaveLength(32);

    const expectedVettedIds = [
      'plan40-construct-half-fifth-10',
      'plan40-construct-three-fourths-two-fifths-20',
      'plan40-construct-five-sixths-three-eighths-24',
      'plan40-inspect-two-thirds-one-fourth-12',
      'plan40-inspect-seven-tenths-one-fourth-20',
      'plan40-inspect-five-sixths-seven-tenths-30',
      'plan40-identify-five-sixths-one-third-6',
      'plan40-identify-one-half-one-eighth-8',
      'plan40-identify-two-thirds-five-twelfths-12',
    ];
    expect(PLAN40_VETTED_BATCH.map((r) => r.itemId)).toEqual(expectedVettedIds);

    const expectedHoldoutIds = [
      'plan40-holdout-construct-three-fifths-one-half-10',
      'plan40-holdout-inspect-three-fourths-one-sixth-12',
    ];
    expect(PLAN40_DATA_ONLY_HOLDOUTS.map((r) => r.itemId)).toEqual(expectedHoldoutIds);
  });

  it('declares records with no mathematical leakage or unrendered state', () => {
    for (const record of PLAN40_SUBTRACTION_RECIPE_RECORDS) {
      expect(record.patternRevision).toBe('1');
      expect(record.definitionId).toBe('phase-3-reusable-subtraction-recipes');
      expect(record.definitionRevision).toBe('1');
      expect(record.taskDataId).toBe('plan40-subtraction-recipe-task-data');
      expect(record).not.toHaveProperty('expectedResult');
      expect(record).not.toHaveProperty('difference');
      expect(record).not.toHaveProperty('remainder');
      expect(record).not.toHaveProperty('rawResult');
    }
  });

  it('guarantees 3 distinct target denominators per recipe family in the vetted batch', () => {
    const constructTargets = PLAN40_VETTED_BATCH
      .filter((r) => r.recipeId === PLAN40_RECIPE_IDS.construct)
      .map((r) => r.targetDenominator);
    expect(constructTargets).toEqual(['10', '20', '24']);

    const inspectTargets = PLAN40_VETTED_BATCH
      .filter((r) => r.recipeId === PLAN40_RECIPE_IDS.inspect)
      .map((r) => r.targetDenominator);
    expect(inspectTargets).toEqual(['12', '20', '30']);

    const identifyTargets = PLAN40_VETTED_BATCH
      .filter((r) => r.recipeId === PLAN40_RECIPE_IDS.identify)
      .map((r) => r.targetDenominator);
    expect(identifyTargets).toEqual(['6', '8', '12']);
  });

  it('admits all 9 curated batch items and 2 holdouts under curated-review profile and proper subtraction', () => {
    for (const record of PLAN40_SUBTRACTION_RECIPE_RECORDS) {
      const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
      expect(fixture).toBeDefined();
      expect(fixture.profileId).toBe('curated-review');

      const instance = instanceFor(record);
      expect(instance.request.operation).toBe('subtract');
      const validation = validateProblemInstance(instance);
      expect(validation.valid).toBe(true);

      const left = toMath(record.sourceForms.left);
      const right = toMath(record.sourceForms.right);

      // Verify proper fractions
      expect(left.numerator > 0n && left.numerator < left.denominator).toBe(true);
      expect(right.numerator > 0n && right.numerator < right.denominator).toBe(true);

      // Verify strictly positive subtraction result
      const target = BigInt(record.targetDenominator);
      const diff = subtractAtCommonDenominator(left, right, target);
      expect(diff.numerator > 0n).toBe(true);
      expect(diff.denominator).toBe(target);
    }
  });

  it('validates inspect candidate stimulus properties and invalid side balance', () => {
    const inspectRecords = PLAN40_SUBTRACTION_RECIPE_RECORDS
      .filter((r) => r.recipeId === PLAN40_RECIPE_IDS.inspect);

    const invalidSides = [];
    for (const record of inspectRecords) {
      expect(record.stimulusId).toMatch(/^(plan40-stim-|plan76-.*-stimulus$|isolated-plan85-stim-)/);
      expect(record.stimulusRevision).toBe('1');
      expect(record.candidates).toBeDefined();

      let validCount = 0;
      let invalidSide = null;

      for (const side of ['left', 'right']) {
        const candidate = record.candidates[side];
        expect(candidate.denominator).toBe(record.targetDenominator);
        const source = toMath(record.sourceForms[side]);
        const cand = toMath(candidate);
        if (equalFractions(source, cand)) {
          validCount += 1;
        } else {
          invalidSide = side;
        }
      }
      expect(validCount).toBe(1);
      invalidSides.push({ itemId: record.itemId, invalidSide });
    }

    // Verify left/right invalid balance
    const leftInvalid = invalidSides.filter((s) => s.invalidSide === 'left');
    const rightInvalid = invalidSides.filter((s) => s.invalidSide === 'right');
    expect(leftInvalid.length).toBeGreaterThan(0);
    expect(rightInvalid.length).toBeGreaterThan(0);
  });

  it('validates identify-side-construct records and both operand renaming orientations', () => {
    const identifyRecords = PLAN40_VETTED_BATCH
      .filter((r) => r.recipeId === PLAN40_RECIPE_IDS.identify);

    const requiredSides = [];
    for (const record of identifyRecords) {
      expect(record.candidates).toBeNull();
      expect(record.stimulusId).toBeNull();
      const instance = instanceFor(record);
      const sides = validatePlan40SubtractionRecipeRecord(instance, record);
      expect(sides).toHaveLength(1);
      requiredSides.push({ itemId: record.itemId, side: sides[0] });
    }

    // Item 7 renames right (5/6 - 1/3, target 6)
    expect(requiredSides.find((s) => s.itemId === 'plan40-identify-five-sixths-one-third-6')?.side).toBe('right');
    // Item 8 renames left (1/2 - 1/8, target 8)
    expect(requiredSides.find((s) => s.itemId === 'plan40-identify-one-half-one-eighth-8')?.side).toBe('left');
    // Item 9 renames left (2/3 - 5/12, target 12)
    expect(requiredSides.find((s) => s.itemId === 'plan40-identify-two-thirds-five-twelfths-12')?.side).toBe('left');
  });

  it('resolves and validates the exact 17-key task context for every vetted item', () => {
    for (const record of PLAN40_VETTED_BATCH) {
      const instance = instanceFor(record);
      const context = resolvePlan40SubtractionRecipeContext(instance, record.itemId, {
        practiceSetId: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
        practiceSetRevision: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
      });

      expect(Object.keys(context).sort()).toEqual([...EXACT_PLAN40_TASK_CONTEXT_KEYS].sort());
      expect(context.definitionId).toBe('phase-3-reusable-subtraction-recipes');
      expect(context.definitionRevision).toBe('1');
      expect(context.targetDenominator).toBe(record.targetDenominator);
      expect(context.sourceForms).toEqual(record.sourceForms);

      const validated = validatePlan40SubtractionRecipeContext(instance, context);
      expect(validated).toEqual(context);
    }
  });

  it('resolves and validates task context for data-only holdouts under their holdout set', () => {
    for (const record of PLAN40_DATA_ONLY_HOLDOUTS) {
      const instance = instanceFor(record);
      const context = resolvePlan40SubtractionRecipeContext(instance, record.itemId, {
        practiceSetId: PLAN40_DATA_ONLY_HOLDOUTS_ID,
        practiceSetRevision: PLAN40_DATA_ONLY_HOLDOUTS_REVISION,
      });

      expect(Object.keys(context).sort()).toEqual([...EXACT_PLAN40_TASK_CONTEXT_KEYS].sort());
      expect(context.practiceSetId).toBe(PLAN40_DATA_ONLY_HOLDOUTS_ID);
      expect(context.targetDenominator).toBe(record.targetDenominator);

      const validated = validatePlan40SubtractionRecipeContext(instance, context);
      expect(validated).toEqual(context);
    }
  });

  it('rejects tampered or mismatched context fields', () => {
    const record = PLAN40_VETTED_BATCH[0];
    const instance = instanceFor(record);
    const context = resolvePlan40SubtractionRecipeContext(instance, record.itemId);

    // Tampered targetDenominator
    const badTarget = { ...context, targetDenominator: '99' };
    expect(() => validatePlan40SubtractionRecipeContext(instance, badTarget)).toThrow(/targetDenominator/);

    // Tampered candidates
    const badCandidates = { ...context, candidates: { left: { kind: 'fraction', numerator: '1', denominator: '10' } } };
    expect(() => validatePlan40SubtractionRecipeContext(instance, badCandidates)).toThrow(/candidates/);

    // Missing key
    const missingKey = { ...context };
    delete missingKey.patternRevision;
    expect(() => validatePlan40SubtractionRecipeContext(instance, missingKey)).toThrow(/exact task context shape/);
  });

  it('recognizes both short and full alias recipe IDs', () => {
    expect(isPlan40IdentifyRecipe({ patternId: 'unlike-subtraction.identify-side-construct' })).toBe(true);
    expect(isPlan40IdentifyRecipe({ patternId: 'full-subtraction.identify-side-construct' })).toBe(true);
    expect(isPlan40IdentifyRecipe({ patternId: 'unlike-subtraction.construct-equivalent' })).toBe(false);

    expect(isPlan40SubtractionRecipeDefinition({ id: 'phase-3-reusable-subtraction-recipes', revision: '1' })).toBe(true);
    expect(isPlan40SubtractionRecipeDefinition({ id: 'phase-3-reusable-subtraction-recipes', revision: '2' })).toBe(false);
    expect(isPlan40SubtractionRecipeDefinition({ id: 'phase-3-reusable-addition-recipes', revision: '1' })).toBe(false);
  });
});
