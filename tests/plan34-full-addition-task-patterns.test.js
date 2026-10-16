import { describe, expect, it } from 'vitest';
import { buildCuratedProblem } from '../src/content/generator.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import {
  FULL_ADDITION_CONSTRUCT_PATTERN,
  FULL_ADDITION_INSPECT_PATTERN,
  deriveRequiredConversionSides,
  resolvePlan34TaskContext,
  validatePlan34TaskContext,
} from '../src/content/full-addition-task-patterns.js';
import { LEGACY_PRACTICE_TYPES_V4, PLAN34_PRACTICE_TYPES_V5 } from '../src/app/practice-types.js';

const itemSpecs = [
  ['two-thirds-plus-one-fourth', 'curated-relatively-prime-addition-non-least', 'plan03-fixtures-v1'],
  ['one-half-plus-one-third', 'curated-relatively-prime-addition-one-half-one-third', 'plan26-fixtures-v1'],
  ['one-third-plus-one-fourth', 'curated-relatively-prime-addition-one-third-one-fourth', 'plan32-record-v1'],
];
function makeInstance([, fixtureId, authoringRevision]) {
  const fixture = resolveCuratedFixture(fixtureId, authoringRevision);
  return buildCuratedProblem({ fixture, selector: fixture.selector, overlays: fixture.overlays, profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] } });
}

describe('Plan 34 authored pattern admission', () => {
  it('keeps immutable v4 and v5 registries distinct with the same eleven numeric IDs and order', () => {
    const v4 = LEGACY_PRACTICE_TYPES_V4.find((entry) => entry.id === 'sum-under-one');
    const v5 = PLAN34_PRACTICE_TYPES_V5.find((entry) => entry.id === 'sum-under-one');
    expect(v4.setRevision).toBe('4');
    expect(v5.setRevision).toBe('5');
    expect(v5.items.map((entry) => entry.id)).toEqual(v4.items.map((entry) => entry.id));
    expect(v5.items).toHaveLength(11);
    expect(v5.items.filter((entry) => entry.patternId).map(({ id, patternId }) => ({ id, patternId }))).toEqual([
      { id: 'two-thirds-plus-one-fourth', patternId: FULL_ADDITION_CONSTRUCT_PATTERN.id },
      { id: 'one-half-plus-one-third', patternId: FULL_ADDITION_INSPECT_PATTERN.id },
      { id: 'one-third-plus-one-fourth', patternId: FULL_ADDITION_INSPECT_PATTERN.id },
    ]);
  });

  it('validates six compatibility pairs without asserting alternate pairs are live set members', () => {
    for (const spec of itemSpecs) {
      const instance = makeInstance(spec);
      for (const pattern of [FULL_ADDITION_CONSTRUCT_PATTERN, FULL_ADDITION_INSPECT_PATTERN]) {
        const context = resolvePlan34TaskContext(instance, pattern.id, pattern.revision, '12', { allowCompatibilityPair: true });
        expect(context.itemId).toBe(spec[0]);
        expect(context.practiceSetId).toBeNull();
        expect(context.practiceSetRevision).toBeNull();
        expect(context.requiredSides).toEqual(['left', 'right']);
      }
    }
  });

  it('rejects association, target, task data, candidate, and authored-source mismatches', () => {
    const instance = makeInstance(itemSpecs[0]);
    expect(() => resolvePlan34TaskContext(instance, FULL_ADDITION_INSPECT_PATTERN.id, '1'))
      .toThrow(/incompatible with the fixed live association/);
    expect(() => resolvePlan34TaskContext(instance, FULL_ADDITION_CONSTRUCT_PATTERN.id, '1', '24'))
      .toThrow(/only the authored target 12/);
    const inspectInstance = makeInstance(itemSpecs[1]);
    const valid = resolvePlan34TaskContext(inspectInstance, FULL_ADDITION_INSPECT_PATTERN.id, '1');
    expect(() => validatePlan34TaskContext(inspectInstance, { ...valid, taskDataRevision: 'future' }))
      .toThrow(/taskDataRevision does not match/);
    expect(() => validatePlan34TaskContext(inspectInstance, {
      ...valid, candidates: { ...valid.candidates, left: { ...valid.candidates.left, numerator: '6' } },
    })).toThrow(/candidates does not match/);
    expect(() => resolvePlan34TaskContext({ ...instance, operands: {
      ...instance.operands, left: { ...instance.operands.left, initialForm: { ...instance.operands.left.initialForm, numerator: '1' } },
    } }, FULL_ADDITION_CONSTRUCT_PATTERN.id, '1')).toThrow(/source form does not match/);
  });

  it('derives required sides from exact target conversion', () => {
    for (const spec of itemSpecs) expect(deriveRequiredConversionSides(makeInstance(spec), '12')).toEqual(['left', 'right']);
  });
});
