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
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
  }),
]);

export function getPracticeType(id) {
  return PRACTICE_TYPES.find((practiceType) => practiceType.id === id) ?? null;
}
