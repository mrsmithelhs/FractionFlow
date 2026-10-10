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
    setRevision: '1',
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
    ]),
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
  }),
]);

export function getPracticeType(id) {
  return PRACTICE_TYPES.find((practiceType) => practiceType.id === id) ?? null;
}
