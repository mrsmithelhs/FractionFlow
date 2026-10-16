import { PHASE2_REFLECTION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { PLAN34_FULL_ADDITION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';
import { deepFreeze } from '../content/schema.js';

/**
 * Learner-reachable practice types. A type is registered only when the app can
 * build and run its complete episode; future types belong here with content.
 */
export const LEGACY_PRACTICE_TYPES_V4 = Object.freeze([
  Object.freeze({
    id: 'sum-under-one',
    label: 'Add fractions with different denominators',
    fixtureId: 'curated-relatively-prime-addition-non-least',
    setId: 'unlike-addition-vetted-set',
    setRevision: '4',
    items: Object.freeze([
      Object.freeze({
        id: 'two-thirds-plus-one-fourth',
        fixtureId: 'curated-relatively-prime-addition-non-least',
        authoringRevision: 'plan03-fixtures-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['12', '24']),
      }),
      Object.freeze({
        id: 'one-half-plus-one-third',
        fixtureId: 'curated-relatively-prime-addition-one-half-one-third',
        authoringRevision: 'plan26-fixtures-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['6', '12']),
      }),
      Object.freeze({
        id: 'one-half-plus-one-fifth',
        fixtureId: 'curated-relatively-prime-addition-one-half-one-fifth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['10', '20']),
      }),
      Object.freeze({
        id: 'one-half-plus-two-fifths',
        fixtureId: 'curated-relatively-prime-addition-one-half-two-fifths',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['10', '20']),
      }),
      Object.freeze({
        id: 'one-third-plus-one-fourth',
        fixtureId: 'curated-relatively-prime-addition-one-third-one-fourth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['12', '24']),
      }),
      Object.freeze({
        id: 'one-third-plus-one-fifth',
        fixtureId: 'curated-relatively-prime-addition-one-third-one-fifth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'one-third-plus-two-fifths',
        fixtureId: 'curated-relatively-prime-addition-one-third-two-fifths',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'two-thirds-plus-one-fifth',
        fixtureId: 'curated-relatively-prime-addition-two-thirds-one-fifth',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'three-fifths-plus-one-third',
        fixtureId: 'curated-relatively-prime-addition-three-fifths-one-third',
        authoringRevision: 'plan32-record-v1',
        episodeDefinitionId: 'phase-2-unlike-proper-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['15', '30']),
      }),
      Object.freeze({
        id: 'one-sixth-plus-one-fourth',
        fixtureId: 'curated-shared-factor-addition-one-sixth-one-fourth',
        authoringRevision: 'plan19-record-v1',
        episodeDefinitionId: 'phase-2-shared-factor-addition-reflection',
        episodeDefinitionRevision: '3',
        targetDenominators: Object.freeze(['12', '24']),
      }),
      Object.freeze({
        id: 'two-thirds-plus-three-fourths',
        fixtureId: 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths',
        authoringRevision: 'plan17-record-v1',
        episodeDefinitionId: 'phase-3-crossing-one-whole-addition-reflection',
        episodeDefinitionRevision: '1',
        targetDenominators: Object.freeze(['12', '24']),
      }),
    ]),
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
  }),
  Object.freeze({
    id: 'like-denominator-addition',
    label: 'Add fractions with the same denominator',
    setId: 'like-denominator-addition-vetted-set',
    setRevision: '1',
    items: Object.freeze([
      Object.freeze({
        id: 'two-sevenths-plus-three-sevenths',
        fixtureId: 'curated-like-denominator-addition-two-sevenths-three-sevenths',
        authoringRevision: 'plan20-record-v1',
        taskDataRevision: 'plan20-task-data-v1',
        recipe: Object.freeze({ id: 'plan20-reviewed-like-denominator-addition', revision: '1' }),
        episodeDefinitionId: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id,
        episodeDefinitionRevision: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.revision,
      }),
    ]),
    episodeDefinition: PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
  }),
]);

const plan34PatternByItem = Object.freeze({
  'two-thirds-plus-one-fourth': 'full-addition.construct-equivalent',
  'one-half-plus-one-third': 'full-addition.inspect-keep-repair',
  'one-third-plus-one-fourth': 'full-addition.inspect-keep-repair',
});

export const PLAN34_PRACTICE_TYPES_V5 = deepFreeze(LEGACY_PRACTICE_TYPES_V4.map((practiceType) => {
  if (practiceType.id !== 'sum-under-one') return practiceType;
  return {
    ...practiceType,
    setRevision: '5',
    items: practiceType.items.map((item) => {
      const patternId = plan34PatternByItem[item.id];
      if (!patternId) return item;
      return {
        ...item,
        episodeDefinitionId: PLAN34_FULL_ADDITION_EPISODE_DEFINITION.id,
        episodeDefinitionRevision: PLAN34_FULL_ADDITION_EPISODE_DEFINITION.revision,
        patternId,
        patternRevision: '1',
        targetDenominator: '12',
        taskDataId: 'plan34-full-addition-task-data',
        taskDataRevision: '1',
      };
    }),
    episodeDefinition: PLAN34_FULL_ADDITION_EPISODE_DEFINITION,
  };
}));

// Stage B activates this registry in app composition after task-context wiring.
export const PRACTICE_TYPES = LEGACY_PRACTICE_TYPES_V4;

export function getPracticeType(id) {
  return PRACTICE_TYPES.find((practiceType) => practiceType.id === id) ?? null;
}
