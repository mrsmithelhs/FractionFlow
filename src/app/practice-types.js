import { PHASE2_REFLECTION_EPISODE_DEFINITION } from '../interaction/episode-definition.js';

/**
 * Learner-reachable practice types. A type is registered only when the app can
 * build and run its complete episode; future types belong here with content.
 */
export const PRACTICE_TYPES = Object.freeze([
  Object.freeze({
    id: 'sum-under-one',
    label: 'Add fractions with different denominators',
    fixtureId: 'curated-relatively-prime-addition-non-least',
    setId: 'unlike-addition-vetted-set',
    setRevision: '3',
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
    ]),
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
  }),
]);

export function getPracticeType(id) {
  return PRACTICE_TYPES.find((practiceType) => practiceType.id === id) ?? null;
}
