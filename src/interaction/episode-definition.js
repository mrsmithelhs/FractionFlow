import { deepFreeze } from '../content/schema.js';

export const EPISODE_DEFINITION_ID = 'phase-2-unlike-proper-addition';
export const EPISODE_DEFINITION_REVISION = '3';
export const PREVIOUS_EPISODE_DEFINITION_REVISION = '2';
export const LEGACY_EPISODE_DEFINITION_REVISION = '1';

export const PHASE2_ACTIVE_CONDITION = deepFreeze({
  id: 'phase2-bundle-1',
  revision: '1',
  display: 'D-01-A',
  choreography: 'D-02-M',
  promptCadence: 'D-05-focused-key-beats',
  connectionMaking: 'CM-01-M',
});

export const PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION = deepFreeze({
  id: 'plan45-static-comparison',
  revision: '1',
  display: 'not-applicable',
  choreography: 'not-applicable',
  promptCadence: 'D-05-focused-key-beats',
  connectionMaking: 'not-applicable',
});

export const EPISODE_BEATS = Object.freeze([
  'encounter',
  'notice',
  'decide',
  'transform',
  'operate',
  'resolve',
  'reflect',
]);

const BASE_EPISODE_DEFINITION = {
  operation: 'add',
  selector: 'relatively-prime-addition',
  beats: EPISODE_BEATS,
  includeReflection: false,
  promptIdentities: {
    encounter: 'phase2.encounter',
    notice: 'phase2.notice',
    decide: 'phase2.decide-common-denominator',
    transform: 'phase2.transform-equivalent-form',
    operate: 'phase2.operate',
    resolve: 'phase2.resolve',
    reflect: 'phase2.reflect',
  },
};

function episodeDefinition(id, revision, includeReflection) {
  return deepFreeze({
    ...BASE_EPISODE_DEFINITION,
    id,
    revision,
    includeReflection,
  });
}

export const LEGACY_PHASE2_EPISODE_DEFINITION = episodeDefinition(
  EPISODE_DEFINITION_ID,
  LEGACY_EPISODE_DEFINITION_REVISION,
  false,
);
export const LEGACY_PHASE2_REFLECTION_EPISODE_DEFINITION = episodeDefinition(
  'phase-2-unlike-proper-addition-reflection',
  LEGACY_EPISODE_DEFINITION_REVISION,
  true,
);
export const PREVIOUS_PHASE2_EPISODE_DEFINITION = episodeDefinition(
  EPISODE_DEFINITION_ID,
  PREVIOUS_EPISODE_DEFINITION_REVISION,
  false,
);
export const PREVIOUS_PHASE2_REFLECTION_EPISODE_DEFINITION = episodeDefinition(
  'phase-2-unlike-proper-addition-reflection',
  PREVIOUS_EPISODE_DEFINITION_REVISION,
  true,
);
export const PHASE2_EPISODE_DEFINITION = episodeDefinition(
  EPISODE_DEFINITION_ID,
  EPISODE_DEFINITION_REVISION,
  false,
);
export const PHASE2_REFLECTION_EPISODE_DEFINITION = episodeDefinition(
  'phase-2-unlike-proper-addition-reflection',
  EPISODE_DEFINITION_REVISION,
  true,
);

export const SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-2-shared-factor-addition-reflection',
  revision: '3',
  includeReflection: true,
  selector: 'shared-factor-addition',
});

export const PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-3-like-denominator-addition',
  revision: '1',
  includeReflection: false,
  selector: 'like-denominator-addition',
  promptIdentities: {
    encounter: 'phase3.like-addition.encounter',
    notice: 'phase3.like-addition.notice',
    operate: 'phase3.like-addition.operate',
    resolve: 'phase3.like-addition.resolve',
  },
  contentContract: {
    itemId: 'two-sevenths-plus-three-sevenths',
    fixtureId: 'curated-like-denominator-addition-two-sevenths-three-sevenths',
    authoringRevision: 'plan20-record-v1',
    taskDataRevision: 'plan20-task-data-v1',
    recipe: { id: 'plan20-reviewed-like-denominator-addition', revision: '1' },
    selector: 'like-denominator-addition',
    operation: 'add',
    overlays: [],
    left: { kind: 'fraction', numerator: '2', denominator: '7' },
    right: { kind: 'fraction', numerator: '3', denominator: '7' },
  },
});

export const PLAN17_CROSSING_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-3-crossing-one-whole-addition-reflection',
  revision: '1',
  includeReflection: true,
  promptIdentities: {
    encounter: 'phase3.crossing.encounter',
    notice: 'phase3.crossing.notice',
    decide: 'phase3.crossing.decide-common-denominator',
    transform: 'phase3.crossing.transform-equivalent-form',
    operate: 'phase3.crossing.operate',
    resolve: 'phase3.crossing.resolve',
    reflect: 'phase3.crossing.reflect',
  },
  contentContract: {
    fixtureId: 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths',
    authoringRevision: 'plan17-record-v1',
    selector: 'relatively-prime-addition',
    operation: 'add',
    overlays: ['crosses-one-whole'],
    crossesWhole: true,
    resultStackCapability: 'plan17-two-whole-stack-v1',
  },
});

export const PLAN34_FULL_ADDITION_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-3-reusable-full-addition',
  revision: '1',
  includeReflection: false,
  promptIdentities: {
    encounter: 'phase3.full-addition.encounter',
    notice: 'phase3.full-addition.notice',
    decide: 'phase3.full-addition.decide',
    transform: 'phase3.full-addition.transform',
    operate: 'phase3.full-addition.operate',
    resolve: 'phase3.full-addition.resolve',
    reflect: 'phase3.full-addition.reflect',
  },
});

export const PLAN18_NESTED_ADDITION_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-3-nested-renaming-addition',
  revision: '1',
  includeReflection: false,
  selector: 'nested-denominator-addition',
  beats: Object.freeze(['encounter', 'decide', 'transform', 'operate', 'resolve']),
  promptIdentities: {
    encounter: 'phase3.nested-addition.encounter',
    decide: 'phase3.nested-addition.select-renaming-side',
    transform: 'phase3.nested-addition.transform-one-side',
    operate: 'phase3.nested-addition.operate',
    resolve: 'phase3.nested-addition.resolve',
  },
});

export const PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-3-reusable-addition-recipes',
  revision: '1',
  includeReflection: false,
  selector: 'relatively-prime-addition',
  beats: Object.freeze(['encounter', 'decide', 'transform', 'operate', 'resolve']),
  promptIdentities: {
    encounter: 'phase3.full-addition.encounter',
    decide: 'phase3.full-addition.decide',
    transform: 'phase3.full-addition.transform',
    operate: 'phase3.full-addition.operate',
    resolve: 'phase3.full-addition.resolve',
  },
});

export const PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-3-like-denominator-takeaway-subtraction',
  revision: '1',
  operation: 'subtract',
  selector: 'like-denominator-subtraction',
  beats: Object.freeze(['encounter', 'operate', 'resolve']),
  includeReflection: false,
  promptIdentities: {
    encounter: 'phase3.like-subtraction.encounter',
    operate: 'phase3.like-subtraction.operate',
    resolve: 'phase3.like-subtraction.resolve',
  },
});

export const PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION = deepFreeze({
  ...BASE_EPISODE_DEFINITION,
  id: 'phase-3-reusable-subtraction-recipes',
  revision: '1',
  operation: 'subtract',
  selector: 'unlike-denominator-subtraction',
  beats: Object.freeze(['encounter', 'decide', 'transform', 'operate', 'resolve']),
  includeReflection: false,
  promptIdentities: {
    encounter: 'phase3.reusable-subtraction.encounter',
    decide: 'phase3.reusable-subtraction.decide',
    transform: 'phase3.reusable-subtraction.transform',
    operate: 'phase3.reusable-subtraction.operate',
    resolve: 'phase3.reusable-subtraction.resolve',
  },
});

export const PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION = deepFreeze({
  id: 'phase-4-bar-to-line-same-amount',
  revision: '1',
  family: 'bar-to-line-same-amount',
  beats: Object.freeze(['encounter', 'locate', 'resolve']),
  includeReflection: false,
  promptIdentities: {
    encounter: 'phase4.bridge.encounter',
    locate: 'phase4.bridge.locate',
    resolve: 'phase4.bridge.resolve',
  },
});

export const PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION = deepFreeze({
  id: 'phase-4-bar-to-line-same-amount',
  revision: '2',
  family: 'bar-to-line-same-amount',
  beats: Object.freeze(['locate', 'resolve']),
  includeReflection: false,
  promptIdentities: {
    locate: 'phase4.bridge.place',
    resolve: 'phase4.bridge.explain-location',
  },
});

export const PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION = deepFreeze({
  id: 'phase-4-symbolic-fraction-comparison',
  revision: '1',
  family: 'symbolic-fraction-comparison',
  beats: Object.freeze(['compare', 'resolve']),
  includeReflection: false,
  promptIdentities: {
    compare: 'phase4.comparison.compare-symbolic-fractions',
    resolve: 'phase4.comparison.accepted-result',
  },
});

export const PLAN49_COMPARISON_EPISODE_DEFINITION = deepFreeze({
  ...PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION, revision: '2',
});

export const PLAN50_COLLECTION_EPISODE_DEFINITION = deepFreeze({ id: 'phase-4-number-line-collection', revision: '1', family: 'number-line-collection', beats: ['place-collection', 'resolve'], includeReflection: false, promptIdentities: { 'place-collection': 'phase4.collection.place', resolve: 'phase4.collection.accepted' } });

export const PLAN51_DISTANCE_EPISODE_DEFINITION = deepFreeze({
  id: 'phase-4-fraction-distance', revision: '1', family: 'fraction-distance',
  beats: ['compare', 'distance', 'resolve'], includeReflection: false,
  promptIdentities: { compare: 'phase4.distance.compare', distance: 'phase4.distance.respond', resolve: 'phase4.distance.accepted' },
});

const EPISODE_DEFINITIONS = Object.freeze([
  LEGACY_PHASE2_EPISODE_DEFINITION,
  LEGACY_PHASE2_REFLECTION_EPISODE_DEFINITION,
  PREVIOUS_PHASE2_EPISODE_DEFINITION,
  PREVIOUS_PHASE2_REFLECTION_EPISODE_DEFINITION,
  PHASE2_EPISODE_DEFINITION,
  PHASE2_REFLECTION_EPISODE_DEFINITION,
  SHARED_FACTOR_REFLECTION_EPISODE_DEFINITION,
  PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
  PLAN17_CROSSING_EPISODE_DEFINITION,
  PLAN34_FULL_ADDITION_EPISODE_DEFINITION,
  PLAN18_NESTED_ADDITION_EPISODE_DEFINITION,
  PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION,
  PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
  PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
  PLAN37_BAR_TO_LINE_BRIDGE_EPISODE_DEFINITION,
  PLAN37_BAR_TO_LINE_BRIDGE_REPAIR_EPISODE_DEFINITION,
  PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION,
  PLAN49_COMPARISON_EPISODE_DEFINITION,
  PLAN50_COLLECTION_EPISODE_DEFINITION,
  PLAN51_DISTANCE_EPISODE_DEFINITION,
]);

export function getEpisodeDefinition(id = EPISODE_DEFINITION_ID, revision = EPISODE_DEFINITION_REVISION) {
  const definition = EPISODE_DEFINITIONS.find((candidate) => (
    candidate.id === id && candidate.revision === revision
  ));
  if (!definition) {
    throw new RangeError(`unknown episode definition: ${String(id)}@${String(revision)}`);
  }
  return definition;
}

export function validateActiveCondition(condition) {
  if (!condition || typeof condition !== 'object') {
    throw new TypeError('activeCondition must be an object');
  }
  const allowedKeys = ['id', 'revision', 'display', 'choreography', 'promptCadence', 'connectionMaking'];
  const actualKeys = Object.keys(condition).sort();
  const expectedKeys = [...allowedKeys].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
    throw new TypeError('activeCondition has an unsupported shape');
  }
  for (const key of allowedKeys) {
    if (typeof condition[key] !== 'string' || condition[key].length === 0) {
      throw new TypeError(`activeCondition.${key} must be a non-empty string`);
    }
  }
  return deepFreeze({ ...condition });
}
