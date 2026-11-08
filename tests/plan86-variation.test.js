import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  PLAN35_ADDITION_RECIPE_RECORDS,
  PLAN86_ADDITION_REVIEW_SET,
  PLAN35_ADDITION_RECIPE_PRACTICE_SET,
} from '../src/content/data/plan35-addition-recipe-records.js';
import {
  PLAN40_SUBTRACTION_RECIPE_RECORDS,
  PLAN86_SUBTRACTION_REVIEW_SET,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2,
} from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import { resolvePlan35AdditionRecipeContext } from '../src/content/plan35-addition-recipe-task.js';
import { resolvePlan40SubtractionRecipeContext } from '../src/content/plan40-reusable-subtraction-recipes.js';
import { addAtCommonDenominator, createFraction, convertToDenominator, subtractAtCommonDenominator } from '../src/math/index.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import {
  PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION,
  PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
import { HIGH_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { isPlan86ReviewInspect } from '../src/render/plan86-review-presentation.js';

const variants = [
  {
    family: 'addition', records: PLAN35_ADDITION_RECIPE_RECORDS, set: PLAN86_ADDITION_REVIEW_SET,
    defaultSet: PLAN35_ADDITION_RECIPE_PRACTICE_SET,
    resolve: resolvePlan35AdditionRecipeContext,
    definition: PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION,
    operation: 'add', resultIntent: 'submit-operation-result',
  },
  {
    family: 'subtraction', records: PLAN40_SUBTRACTION_RECIPE_RECORDS, set: PLAN86_SUBTRACTION_REVIEW_SET,
    defaultSets: [PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2],
    resolve: resolvePlan40SubtractionRecipeContext,
    definition: PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
    operation: 'subtract', resultIntent: 'submit-subtraction-result',
  },
];

function instanceFor(record) {
  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  return buildCuratedProblem({ fixture, selector: fixture.selector, overlays: fixture.overlays,
    profileId: fixture.profileId, candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] } });
}

function start(config, record, set = config.set) {
  const instance = instanceFor(record);
  const taskContext = config.resolve(instance, record.itemId, { practiceSetId: set.id, practiceSetRevision: set.revision });
  const state = createEpisode({ instance, episodeDefinition: config.definition, taskContext, support: HIGH_SUPPORT_CONFIGURATION });
  return { instance, taskContext, state };
}

function expectedForm(instance, side, denominator) {
  const source = instance.operands[side].initialForm;
  const converted = convertToDenominator(createFraction(BigInt(source.numerator), BigInt(source.denominator)), BigInt(denominator));
  return { kind: 'fraction', numerator: converted.numerator.toString(), denominator: converted.denominator.toString() };
}

function resultForm(config, instance, denominator) {
  const convert = (side) => {
    const f = instance.operands[side].initialForm;
    return createFraction(BigInt(f.numerator), BigInt(f.denominator));
  };
  const result = config.operation === 'add'
    ? addAtCommonDenominator(convert('left'), convert('right'), BigInt(denominator))
    : subtractAtCommonDenominator(convert('left'), convert('right'), BigInt(denominator));
  return { kind: 'fraction', numerator: result.numerator.toString(), denominator: result.denominator.toString() };
}

function completeVariant(config, record) {
  const { instance, taskContext, state: initial } = start(config, record);
  let state = applyIntent(initial, { type: 'acknowledge-encounter' });
  for (const side of taskContext.requiredSides) {
    const candidate = taskContext.candidates[side];
    const source = instance.operands[side].initialForm;
    const same = BigInt(source.numerator) * BigInt(candidate.denominator)
      === BigInt(candidate.numerator) * BigInt(source.denominator);
    if (same) {
      state = applyIntent(state, { type: 'keep-inspected-form' });
    } else {
      const correct = expectedForm(instance, side, taskContext.targetDenominator);
      state = applyIntent(state, { type: 'repair-inspected-form', numerator: correct.numerator });
    }
  }
  state = applyIntent(state, { type: config.resultIntent, proposed: resultForm(config, instance, taskContext.targetDenominator) });
  return { initial, state };
}

describe('Plan 86 private review variation', () => {
  it('keeps both new associations out of default practice membership', () => {
    expect(PLAN86_ADDITION_REVIEW_SET.itemIds).toEqual(['plan86-add-inspect-two-thirds-one-fourth-12']);
    expect(PLAN86_SUBTRACTION_REVIEW_SET.itemIds).toEqual(['plan86-subtract-inspect-half-fifth-10']);
    expect(PLAN35_ADDITION_RECIPE_PRACTICE_SET.itemIds).not.toContain(PLAN86_ADDITION_REVIEW_SET.itemIds[0]);
    for (const set of [PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2]) {
      expect(set.itemIds).not.toContain(PLAN86_SUBTRACTION_REVIEW_SET.itemIds[0]);
    }
    const defaultItems = PRACTICE_TYPES.flatMap((type) => type.items.map((item) => item.id));
    expect(defaultItems).not.toContain(PLAN86_ADDITION_REVIEW_SET.itemIds[0]);
    expect(defaultItems).not.toContain(PLAN86_SUBTRACTION_REVIEW_SET.itemIds[0]);
  });

  it('limits the direct-repair presentation to the two exact registered review associations', () => {
    const scene = (context) => ({ derivation: { sourceContext: { instructional: { taskContext: context } } } });
    for (const [setId, stimulusId] of [
      ['plan86-addition-review', 'plan86-add-inspect-7-3-twelfths'],
      ['plan86-subtraction-review', 'plan86-subtract-inspect-5-3-tenths'],
    ]) {
      const context = { practiceSetId: setId, practiceSetRevision: '1', stimulusId };
      expect(isPlan86ReviewInspect(scene(context))).toBe(true);
      expect(isPlan86ReviewInspect(scene({ ...context, practiceSetId: 'ordinary-set' }))).toBe(false);
      expect(isPlan86ReviewInspect(scene({ ...context, practiceSetRevision: '2' }))).toBe(false);
      expect(isPlan86ReviewInspect(scene({ ...context, stimulusId: 'other' }))).toBe(false);
    }
  });

  it.each(variants)('round-trips the $family variant with wrong, repair, keep, and exact identity checks', (config) => {
    const record = config.records.find((r) => r.itemId === config.set.itemIds[0]);
    const { initial, state } = completeVariant(config, record);
    const envelope = createReplayEnvelope(state);
    expect(envelope.schemaVersion).toBe(config.family === 'addition'
      ? 'fractionflow.episode-replay/v4' : 'fractionflow.episode-replay/v6');
    expect(replayEpisode(envelope)).toEqual(state);
    expect(replayEpisode(createReplayEnvelope(initial))).toEqual(initial);
    expect(initial.taskContext.practiceSetId).toBe(config.set.id);
    expect(initial.taskContext.practiceSetRevision).toBe(config.set.revision);

    let started = applyIntent(initial, { type: 'acknowledge-encounter' });
    if (config.family === 'subtraction') started = applyIntent(started, { type: 'keep-inspected-form' });
    const wrongKeep = applyIntent(started, { type: 'keep-inspected-form' });
    expect(wrongKeep.beat).toBe('transform');
    expect(wrongKeep.status).toBe('active');
    expect(wrongKeep.lastRecovery).not.toBeNull();
    expect(wrongKeep.schedulePosition).toBe(started.schedulePosition);

    let unchanged = applyIntent(initial, { type: 'acknowledge-encounter' });
    if (config.family === 'addition') unchanged = applyIntent(unchanged, { type: 'repair-inspected-form', numerator: '8' });
    unchanged = applyIntent(unchanged, { type: 'repair-inspected-form', numerator: config.family === 'addition' ? '3' : '5' });
    expect(unchanged.established.conversionOrigins[config.family === 'addition' ? 'right' : 'left']).toBe('learner-confirmed-unchanged');

    for (const mutate of [
      (copy) => { copy.taskContext.itemId += '-altered'; },
      (copy) => { copy.taskContext.practiceSetId += '-altered'; },
      (copy) => { copy.taskContext.stimulusId += '-altered'; },
      (copy) => { copy.taskContext.fixtureId += '-altered'; },
      (copy) => { copy.taskContext.patternRevision = '99'; },
      (copy) => { copy.taskContext.candidates.left.numerator = '8'; },
    ]) {
      const changed = structuredClone(envelope);
      mutate(changed);
      expect(() => replayEpisode(changed)).toThrow();
    }
    const changedSet = structuredClone(envelope);
    changedSet.taskContext.practiceSetRevision = '2';
    expect(() => replayEpisode(changedSet)).toThrow();
  });

  it('replays the frozen Plan 35 v4 and Plan 40 v6 historical oracles unchanged', () => {
    const v4 = JSON.parse(readFileSync(new URL('./fixtures/plan35-v4-replay-oracles.json', import.meta.url), 'utf8'));
    for (const entry of v4.cases) expect(replayEpisode(entry.envelope)).toEqual(entry.expectedState);
    const v6 = JSON.parse(readFileSync(new URL('../reports/development/plan-89-versioned-problem-bank-publication/baseline-v6-oracles.json', import.meta.url), 'utf8'));
    for (const entry of v6.witnesses) expect(replayEpisode(entry.envelope)).toEqual(entry.expected);
  });
});
