import { describe, expect, it } from 'vitest';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { REGISTERED_SUPPORT_LEVELS } from '../src/app/support-levels.js';
import {
  resolveAuthoredContent,
  resolveCuratedFixture,
} from '../src/content/authored-content-catalog.js';
import {
  SHARED_FACTOR_ADDITION_RECORDS,
} from '../src/content/data/shared-factor-addition-records.js';
import {
  MATERIALIZED_PLAN19_ADDITIONS,
  MATERIALIZED_PLAN32_ADDITIONS,
  materializeCompactAdditionRecords,
  materializeSharedFactorAdditionRecords,
} from '../src/content/authored-problem-materializer.js';
import { validateAuthoredPathTaskData, validateAuthoredTaskData } from '../src/content/authored-task-data.js';
import { evaluateProposedPathEligibility } from '../src/content/eligibility.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { fractionToWire, wireToForm } from '../src/content/schema.js';
import {
  addAtCommonDenominator,
  convertToDenominator,
  equalFractions,
  leastCommonDenominator,
} from '../src/math/index.js';
import {
  classifyCommonDenominatorResponse,
  classifyOperationResponseForEpisode,
} from '../src/interaction/classification.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import {
  PHASE2_REFLECTION_EPISODE_DEFINITION,
  SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import { evaluateTaskPathClosure } from '../src/interaction/path-closure.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';

const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const item = practiceType.items.find((entry) => entry.id === 'one-sixth-plus-one-fourth');

function buildInstance(targetItem = item) {
  const fixture = resolveCuratedFixture(targetItem.fixtureId, targetItem.authoringRevision);
  if (!fixture) throw new Error(`missing fixture ${targetItem.fixtureId}@${targetItem.authoringRevision}`);
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

function completeEpisode(instance, target, condition, support) {
  const left = wireToForm(instance.operands.left.initialForm);
  const right = wireToForm(instance.operands.right.initialForm);
  const denominator = BigInt(target);
  const convertedLeft = convertToDenominator(left, denominator);
  const convertedRight = convertToDenominator(right, denominator);
  const sum = addAtCommonDenominator(left, right, denominator);
  let state = createEpisode({
    instance,
    episodeDefinition: SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION,
    activeCondition: condition.activeCondition,
    support: support.configuration,
  });
  for (const intent of [
    { type: 'acknowledge-encounter' },
    { type: 'submit-notice', matchesUnits: false },
    { type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: target, denominator: '1' } },
    { type: 'submit-equivalent-form', proposed: fractionToWire(convertedLeft) },
    { type: 'submit-equivalent-form', proposed: fractionToWire(convertedRight) },
    { type: 'submit-operation-result', proposed: fractionToWire(sum) },
    { type: 'submit-resolution', proposed: fractionToWire(sum) },
  ]) state = applyIntent(state, intent);

  const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  const response = condition.activeCondition.connectionMaking === 'CM-01-P'
    ? authored.premiseChecks[target].expectedResponse
    : authored.reflectionChoices[target].find((choice) => equalFractions(
      wireToForm(choice.form), left,
    )).id;
  return applyIntent(state, { type: 'submit-reflection', response });
}

describe('Plan 19 shared-factor addition', () => {
  it('preserves the ten-item prefix and appends the Plan 17 crossing item', () => {
    expect(practiceType).toMatchObject({ setId: 'unlike-addition-vetted-set', setRevision: '4' });
    expect(practiceType.items).toHaveLength(11);
    expect(practiceType.items.slice(0, 9).map((entry) => entry.id)).toEqual([
      'two-thirds-plus-one-fourth',
      'one-half-plus-one-third',
      'one-half-plus-one-fifth',
      'one-half-plus-two-fifths',
      'one-third-plus-one-fourth',
      'one-third-plus-one-fifth',
      'one-third-plus-two-fifths',
      'two-thirds-plus-one-fifth',
      'three-fifths-plus-one-third',
    ]);
    expect(practiceType.items[9]).toEqual({
      id: 'one-sixth-plus-one-fourth',
      fixtureId: 'curated-shared-factor-addition-one-sixth-one-fourth',
      authoringRevision: 'plan19-record-v1',
      episodeDefinitionId: 'phase-2-shared-factor-addition-reflection',
      episodeDefinitionRevision: '3',
      targetDenominators: ['12', '24'],
    });
    expect(practiceType.items[10]).toEqual({
      id: 'two-thirds-plus-three-fourths',
      fixtureId: 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths',
      authoringRevision: 'plan17-record-v1',
      episodeDefinitionId: 'phase-3-crossing-one-whole-addition-reflection',
      episodeDefinitionRevision: '1',
      targetDenominators: ['12', '24'],
    });
    expect(PHASE2_REFLECTION_EPISODE_DEFINITION.selector).toBe('relatively-prime-addition');
  });

  it('pins and materializes only the new recipe with exact complete 12/24 paths', () => {
    expect(MATERIALIZED_PLAN19_ADDITIONS).toHaveLength(1);
    const record = SHARED_FACTOR_ADDITION_RECORDS[0];
    expect(record).toMatchObject({
      itemId: item.id,
      fixtureId: item.fixtureId,
      authoringRevision: 'plan19-record-v1',
      taskDataRevision: 'plan19-task-data-v1',
      recipe: { id: 'plan19-reviewed-shared-factor-addition', revision: '1' },
      selector: 'shared-factor-addition',
    });
    expect(resolveAuthoredContent(item.fixtureId, item.authoringRevision)).toEqual(MATERIALIZED_PLAN19_ADDITIONS[0]);

    const instance = buildInstance();
    expect(instance.classification.denominator.relationship).toBe('shared-factor');
    expect(leastCommonDenominator(6n, 4n)).toBe(12n);
    expect(validateAuthoredTaskData(instance, item.targetDenominators)).toBe(true);
    for (const target of [12n, 24n]) {
      const left = convertToDenominator(wireToForm(instance.operands.left.initialForm), target);
      const right = convertToDenominator(wireToForm(instance.operands.right.initialForm), target);
      const result = addAtCommonDenominator(
        wireToForm(instance.operands.left.initialForm),
        wireToForm(instance.operands.right.initialForm),
        target,
      );
      expect([left.numerator.toString(), left.denominator.toString()]).toEqual(
        target === 12n ? ['2', '12'] : ['4', '24'],
      );
      expect([right.numerator.toString(), right.denominator.toString()]).toEqual(
        target === 12n ? ['3', '12'] : ['6', '24'],
      );
      expect([result.numerator.toString(), result.denominator.toString()]).toEqual(
        target === 12n ? ['5', '12'] : ['10', '24'],
      );
      expect(validateAuthoredPathTaskData(instance, target.toString())).toBe(true);
      expect(evaluateTaskPathClosure({
        instance,
        targetDenominator: target.toString(),
        episodeDefinition: SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION,
        activeCondition: REGISTERED_CONDITIONS[0].activeCondition,
      }).available).toBe(true);
    }
  });

  it('derives both premise outcomes and unique reflection correctness through exact fraction equality', () => {
    const instance = buildInstance();
    const left = wireToForm(instance.operands.left.initialForm);
    const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
    expect(authored.premiseChecks['12'].presentedForm).toEqual({ kind: 'fraction', numerator: '3', denominator: '12' });
    expect(equalFractions(left, wireToForm(authored.premiseChecks['12'].presentedForm))).toBe(false);
    expect(authored.premiseChecks['12'].expectedResponse).toBe('no');
    expect(authored.premiseChecks['24'].presentedForm).toEqual({ kind: 'fraction', numerator: '4', denominator: '24' });
    expect(equalFractions(left, wireToForm(authored.premiseChecks['24'].presentedForm))).toBe(true);
    expect(authored.premiseChecks['24'].expectedResponse).toBe('yes');

    expect(authored.reflectionChoices['12'].map((choice) => choice.form)).toEqual([
      { kind: 'fraction', numerator: '1', denominator: '12' },
      { kind: 'fraction', numerator: '2', denominator: '12' },
      { kind: 'fraction', numerator: '3', denominator: '12' },
    ]);
    expect(authored.reflectionChoices['24'].map((choice) => choice.form)).toEqual([
      { kind: 'fraction', numerator: '4', denominator: '24' },
      { kind: 'fraction', numerator: '1', denominator: '24' },
      { kind: 'fraction', numerator: '5', denominator: '24' },
    ]);
    for (const target of ['12', '24']) {
      const forms = authored.reflectionChoices[target].map((choice) => wireToForm(choice.form));
      expect(forms.filter((form) => equalFractions(form, left))).toHaveLength(1);
      expect(new Set(forms.map((form) => `${form.numerator}/${form.denominator}`)).size).toBe(3);
    }
  });

  it('keeps Plan 32 recipe admission pinned and deterministic', () => {
    expect(materializeCompactAdditionRecords()).toEqual(MATERIALIZED_PLAN32_ADDITIONS);
    expect(() => materializeCompactAdditionRecords(SHARED_FACTOR_ADDITION_RECORDS))
      .toThrow(/does not belong to this recipe collection/);
    expect(() => materializeSharedFactorAdditionRecords(SHARED_FACTOR_ADDITION_RECORDS.map((record) => ({
      ...record,
      selector: 'relatively-prime-addition',
    })))).toThrow(/do not match an admitted recipe/);
  });

  it('requires a registered family-matched definition and verifies legacy identities', () => {
    const shared = buildInstance();
    expect(() => createEpisode({
      instance: shared,
      episodeDefinition: { ...SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION, promptIdentities: {} },
    })).toThrow(/semantics do not match its registered identity/);
    expect(() => createEpisode({ instance: shared, episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION }))
      .toThrow(/outside the Phase 2 episode family/);

    const oldItem = practiceType.items[0];
    const fixture = resolveCuratedFixture(oldItem.fixtureId, oldItem.authoringRevision);
    const legacyInstance = buildCuratedProblem({
      fixture,
      selector: fixture.selector,
      overlays: fixture.overlays,
      profileId: fixture.profileId,
      candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] },
    });
    expect(() => createEpisode({
      instance: legacyInstance,
      episodeDefinition: SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION,
    })).toThrow(/outside the Phase 2 episode family/);
  });

  it('keeps invalid math, unsupported capability, and missing authored data distinct', () => {
    const instance = buildInstance();
    expect(classifyCommonDenominatorResponse(instance, { kind: 'fraction', numerator: '18', denominator: '1' }))
      .toMatchObject({ kind: 'invalid-common-denominator', validity: 'invalid' });
    expect(classifyCommonDenominatorResponse(instance, { kind: 'fraction', numerator: '36', denominator: '1' }))
      .toMatchObject({ kind: 'valid-but-outside-representation-capability', validity: 'valid', rendering: 'ineligible' });

    const missingTaskData = structuredClone(instance);
    missingTaskData.provenance.fixtureId = 'missing-plan19-task-data';
    missingTaskData.alternatePaths = [];
    expect(evaluateProposedPathEligibility(missingTaskData, '24'))
      .toMatchObject({ mathematicalValidity: 'valid', rendering: 'eligible', authoredCoverage: 'outside-authored-coverage' });
    expect(evaluateTaskPathClosure({
      instance: missingTaskData,
      targetDenominator: '24',
      episodeDefinition: SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION,
      activeCondition: REGISTERED_CONDITIONS[0].activeCondition,
    })).toMatchObject({ available: false, reason: 'outside-authored-coverage' });

    let state = createEpisode({ instance, episodeDefinition: SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '36', denominator: '1' } });
    expect(state.beat).toBe('decide');
    expect(state.established.commonDenominator).toBeNull();
    expect(state.lastRecovery.classification.kind).toBe('valid-but-unavailable-task-path');
  });

  it('classifies exact and incorrect arithmetic and completes all conditions/supports with replay', () => {
    const instance = buildInstance();
    for (const target of ['12', '24']) {
      const left = convertToDenominator(wireToForm(instance.operands.left.initialForm), BigInt(target));
      const right = convertToDenominator(wireToForm(instance.operands.right.initialForm), BigInt(target));
      const correct = addAtCommonDenominator(
        wireToForm(instance.operands.left.initialForm),
        wireToForm(instance.operands.right.initialForm),
        BigInt(target),
      );
      const result = classifyOperationResponseForEpisode({
        instance,
        targetDenominator: target,
        convertedLeft: fractionToWire(left),
        convertedRight: fractionToWire(right),
        proposed: fractionToWire(correct),
      });
      expect(result.kind).toBe(target === '12' ? 'correct-simplified' : 'correct-unsimplified');
      for (const condition of REGISTERED_CONDITIONS) {
        for (const support of REGISTERED_SUPPORT_LEVELS) {
          const completed = completeEpisode(instance, target, condition, support);
          expect(completed.status).toBe('resolved');
          expect(completed.content.provenance.fixtureId).toBe(item.fixtureId);
          expect(replayEpisode(createReplayEnvelope(completed))).toEqual(completed);
        }
      }
    }
  });
});
