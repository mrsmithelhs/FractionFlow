import { describe, expect, it } from 'vitest';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { REGISTERED_SUPPORT_LEVELS } from '../src/app/support-levels.js';
import {
  resolveAuthoredContent,
  resolveCuratedFixture,
} from '../src/content/authored-content-catalog.js';
import {
  COMPACT_ADDITION_RECORDS,
} from '../src/content/data/compact-addition-records.js';
import {
  MATERIALIZED_PLAN32_ADDITIONS,
  materializeCompactAdditionRecords,
} from '../src/content/authored-problem-materializer.js';
import {
  validateAuthoredMatchingChoices,
  validateAuthoredPathTaskData,
  validateAuthoredPremiseCase,
  validateAuthoredTaskData,
} from '../src/content/authored-task-data.js';
import { validateProblemInstance } from '../src/content/validation.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { evaluateInstanceEligibility } from '../src/content/eligibility.js';
import {
  addFractions,
  convertToDenominator,
  equalFractions,
} from '../src/math/index.js';
import { fractionToWire, wireToForm } from '../src/content/schema.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
import { getEpisodeDefinition, PHASE2_REFLECTION_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { evaluateTaskPathClosure } from '../src/interaction/path-closure.js';
import legacyBaseline from '../reports/development/plan-32-compact-authored-problem-batch/evidence/legacy-baseline.json';

const approvedItemIds = [
  'two-thirds-plus-one-fourth',
  'one-half-plus-one-third',
  'one-half-plus-one-fifth',
  'one-half-plus-two-fifths',
  'one-third-plus-one-fourth',
  'one-third-plus-one-fifth',
  'one-third-plus-two-fifths',
  'two-thirds-plus-one-fifth',
  'three-fifths-plus-one-third',
];

function buildInstance(item) {
  const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
  if (!fixture) throw new Error(`missing fixture ${item.fixtureId}@${item.authoringRevision}`);
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

function completeExactEpisode(instance, targetDenominator, activeCondition, support, episodeDefinition = PHASE2_REFLECTION_EPISODE_DEFINITION) {
  const left = wireToForm(instance.operands.left.initialForm);
  const right = wireToForm(instance.operands.right.initialForm);
  const target = BigInt(targetDenominator);
  const convertedLeft = convertToDenominator(left, target);
  const convertedRight = convertToDenominator(right, target);
  const sum = addFractions(convertedLeft, convertedRight);
  const intents = [
    { type: 'acknowledge-encounter' },
    { type: 'submit-notice', matchesUnits: false },
    { type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: target.toString(), denominator: '1' } },
    { type: 'submit-equivalent-form', proposed: fractionToWire(convertedLeft) },
    { type: 'submit-equivalent-form', proposed: fractionToWire(convertedRight) },
    { type: 'submit-operation-result', proposed: fractionToWire(sum) },
    { type: 'submit-resolution', proposed: fractionToWire(sum) },
  ];
  let state = createEpisode({
    instance,
    episodeDefinition,
    activeCondition,
    support,
  });
  for (const intent of intents) state = applyIntent(state, intent);
  const authored = resolveAuthoredContent(
    instance.provenance.fixtureId,
    instance.provenance.authoringRevision,
  );
  const route = authored.premiseChecks[targetDenominator]
    ? activeCondition.connectionMaking === 'CM-01-P'
      ? authored.premiseChecks[targetDenominator].expectedResponse
      : authored.reflectionChoices[targetDenominator].find((choice) => equalFractions(
        wireToForm(choice.form), left,
      )).id
    : null;
  state = applyIntent(state, { type: 'submit-reflection', response: route });
  return state;
}

describe('Plan 32 compact authored addition batch', () => {
  it('preserves the approved Plan 32 and Plan 19 history before the Plan 17 append', () => {
    const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
    expect(practiceType).toMatchObject({ setId: 'unlike-addition-vetted-set', setRevision: '4' });
    expect(practiceType.items).toHaveLength(11);
    expect(practiceType.items.slice(0, 9).map((item) => item.id)).toEqual(approvedItemIds);
    expect(practiceType.items[9].id).toBe('one-sixth-plus-one-fourth');
    expect(practiceType.items[10]).toEqual({
      id: 'two-thirds-plus-three-fourths',
      fixtureId: 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths',
      authoringRevision: 'plan17-record-v1',
      episodeDefinitionId: 'phase-3-crossing-one-whole-addition-reflection',
      episodeDefinitionRevision: '1',
      targetDenominators: ['12', '24'],
    });
    expect(MATERIALIZED_PLAN32_ADDITIONS).toHaveLength(7);
    expect(new Set(MATERIALIZED_PLAN32_ADDITIONS.map((item) => item.fixtureId)).size).toBe(7);
  });

  it('matches both preserved items and authored outputs to the frozen pre-implementation baseline', () => {
    const practiceType = PRACTICE_TYPES.find((entry) => entry.id === legacyBaseline.practiceSet.id);
    expect(legacyBaseline.baselineCommit).toBe('ae3943a7586a22fca8f15ee37fe6b73b595c0961');
    expect({
      id: practiceType.id,
      setId: practiceType.setId,
      setRevision: legacyBaseline.practiceSet.setRevision,
      episodeDefinitionId: practiceType.episodeDefinition.id,
      episodeDefinitionRevision: practiceType.episodeDefinition.revision,
      items: practiceType.items.slice(0, legacyBaseline.practiceSet.items.length).map((item) => ({
        id: item.id,
        fixtureId: item.fixtureId,
        authoringRevision: item.authoringRevision,
        episodeDefinitionId: item.episodeDefinitionId,
        episodeDefinitionRevision: item.episodeDefinitionRevision,
        targetDenominators: item.targetDenominators,
      })),
    }).toEqual(legacyBaseline.practiceSet);

    for (const item of legacyBaseline.practiceSet.items) {
      const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
      expect(authored.premiseChecks).toEqual(legacyBaseline.premiseChecks[item.fixtureId]);
      expect(authored.reflectionChoices).toEqual(legacyBaseline.reflectionChoices[item.fixtureId]);
      const instance = buildInstance(item);
      const source = wireToForm(instance.operands.left.initialForm);
      for (const target of item.targetDenominators) {
        const choices = authored.reflectionChoices[target];
        const correctPosition = choices.findIndex((choice) => equalFractions(
          wireToForm(choice.form), source,
        )) + 1;
        expect(correctPosition).toBeGreaterThan(0);
        if (item.id === 'two-thirds-plus-one-fourth' && target === '12') {
          expect(correctPosition).toBe(1);
        }
      }
    }
  });

  it('materializes each exact eligible route with the approved policies and safe unique forms', () => {
    const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
    const positionCounts = [0, 0, 0];
    let truePremises = 0;
    let falsePremises = 0;
    for (const item of practiceType.items) {
      const instance = buildInstance(item);
      expect(validateProblemInstance(instance).valid).toBe(true);
      const eligibility = evaluateInstanceEligibility(instance);
      const eligibleTargets = [eligibility.paths.canonical, ...eligibility.paths.alternates]
        .filter((path) => path.rendering === 'eligible')
        .map((path) => path.targetDenominator);
      expect([...item.targetDenominators].sort((a, b) => Number(a) - Number(b)))
        .toEqual([...eligibleTargets].sort((a, b) => Number(a) - Number(b)));
      expect(validateAuthoredTaskData(instance, item.targetDenominators)).toBe(true);
      for (const target of item.targetDenominators) {
        expect(validateAuthoredPathTaskData(instance, target)).toBe(true);
        const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
        const premise = authored.premiseChecks[target];
        const choices = authored.reflectionChoices[target];
        const left = wireToForm(instance.operands.left.initialForm);
        expect(premise.expectedResponse).toBe(equalFractions(
          wireToForm(premise.presentedForm),
          wireToForm(premise.sourceForm),
        ) ? 'yes' : 'no');
        const record = COMPACT_ADDITION_RECORDS.find((entry) => entry.itemId === item.id);
        if (record) {
          if (premise.expectedResponse === 'yes') truePremises += 1;
          else falsePremises += 1;
        }
        expect(choices).toHaveLength(3);
        const forms = choices.map((choice) => wireToForm(choice.form));
        expect(forms.filter((form) => equalFractions(form, left))).toHaveLength(1);
        for (let index = 0; index < forms.length; index += 1) {
          expect(Number(forms[index].denominator)).toBe(Number(target));
          expect(forms[index].numerator).toBeGreaterThanOrEqual(0n);
          expect(forms[index].numerator).toBeLessThanOrEqual(forms[index].denominator);
          for (let previous = 0; previous < index; previous += 1) {
            expect(equalFractions(forms[index], forms[previous])).toBe(false);
          }
        }
        if (record) {
          const correctPosition = record.paths[target].reflection.correctPosition;
          positionCounts[correctPosition - 1] += 1;
          expect(record.paths[target].reflection.order[correctPosition - 1]).toBe('R-CORRECT');
          expect(equalFractions(forms[correctPosition - 1], left)).toBe(true);
        }
        for (const condition of REGISTERED_CONDITIONS) {
          const closure = evaluateTaskPathClosure({
            instance,
            targetDenominator: target,
            episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
            activeCondition: condition.activeCondition,
          });
          expect(closure).toMatchObject({ available: true, reason: null, reflection: { available: true } });
        }
      }
    }
    expect({ truePremises, falsePremises, positionCounts }).toEqual({
      truePremises: 7,
      falsePremises: 7,
      positionCounts: [5, 5, 4],
    });
  });

  it('keeps materialized semantics stable when record enumeration order changes', () => {
    const reversed = materializeCompactAdditionRecords([...COMPACT_ADDITION_RECORDS].reverse());
    const byIdentity = new Map(MATERIALIZED_PLAN32_ADDITIONS.map((item) => [
      `${item.fixtureId}@${item.authoringRevision}`,
      item,
    ]));
    for (const item of reversed) {
      expect(item).toEqual(byIdentity.get(`${item.fixtureId}@${item.authoringRevision}`));
    }
  });

  it('rejects malformed records, missing routes, duplicate answer identities and duplicate math forms', () => {
    const first = COMPACT_ADDITION_RECORDS[0];
    expect(() => materializeCompactAdditionRecords([{ ...first, recipe: { id: 'latest', revision: '99' } }]))
      .toThrow(/unknown recipe identity/);
    expect(() => materializeCompactAdditionRecords([{
      ...first,
      paths: { '10': first.paths['10'] },
    }])).toThrow(/authored paths must equal/);

    const instance = buildInstance(PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one').items[2]);
    const authored = resolveAuthoredContent(
      instance.provenance.fixtureId,
      instance.provenance.authoringRevision,
    );
    const choices = authored.reflectionChoices['10'];
    const premise = authored.premiseChecks['10'];
    expect(() => validateAuthoredPathTaskData(instance, '10')).not.toThrow();
    expect(() => validateAuthoredPremiseCase(instance, {
      ...premise,
      isEquivalent: true,
      expectedResponse: 'yes',
    }, '10')).toThrow(/premise truth mismatch/);
    expect(choices.map((choice) => choice.id)).toHaveLength(3);
    expect(() => validateAuthoredMatchingChoices(instance.operands.left.initialForm, [
      choices[0], choices[1], { ...choices[2], id: choices[1].id },
    ], '10')).toThrow(/identity is invalid/);
    expect(() => validateAuthoredMatchingChoices(instance.operands.left.initialForm, [
      choices[0], { ...choices[1], form: choices[0].form }, choices[2],
    ], '10')).toThrow(/duplicate mathematical forms/);
    expect(() => validateAuthoredMatchingChoices(instance.operands.left.initialForm, [
      choices[0], choices[1], { ...choices[2], form: { kind: 'fraction', numerator: '11', denominator: '10' } },
    ], '10')).toThrow(/presentation range/);
    expect(() => materializeCompactAdditionRecords([{
      ...first,
      paths: {
        ...first.paths,
        '10': {
          ...first.paths['10'],
          reflection: { ...first.paths['10'].reflection, correctPosition: 2 },
        },
      },
    }])).toThrow(/answer position/);
    expect(validateAuthoredMatchingChoices).toBeDefined();
  });

  it('completes every item/path through all conditions and support profiles, including replay reconstruction', () => {
    const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
    for (const item of practiceType.items) {
      const instance = buildInstance(item);
      for (const target of item.targetDenominators) {
        for (const condition of REGISTERED_CONDITIONS) {
          for (const support of REGISTERED_SUPPORT_LEVELS) {
            const completed = completeExactEpisode(
              instance,
              target,
              condition.activeCondition,
              support.configuration,
              getEpisodeDefinition(item.episodeDefinitionId, item.episodeDefinitionRevision),
            );
            expect(completed.status).toBe('resolved');
            expect(completed.content.provenance.fixtureId).toBe(item.fixtureId);
            if (condition.id === REGISTERED_CONDITIONS[0].id
              && support.id === REGISTERED_SUPPORT_LEVELS[0].id) {
              expect(replayEpisode(createReplayEnvelope(completed))).toEqual(completed);
            }
          }
        }
      }
    }
  });
});
