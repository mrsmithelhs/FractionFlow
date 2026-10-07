import { deepFreeze } from '../content/schema.js';

export const EPISODE_DEFINITION_ID = 'phase-2-unlike-proper-addition';
export const EPISODE_DEFINITION_REVISION = '2';
export const LEGACY_EPISODE_DEFINITION_REVISION = '1';

export const PHASE2_ACTIVE_CONDITION = deepFreeze({
  id: 'phase2-bundle-1',
  revision: '1',
  display: 'D-01-A',
  choreography: 'D-02-M',
  promptCadence: 'D-05-focused-key-beats',
  connectionMaking: 'CM-01-M',
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

const EPISODE_DEFINITIONS = Object.freeze([
  LEGACY_PHASE2_EPISODE_DEFINITION,
  LEGACY_PHASE2_REFLECTION_EPISODE_DEFINITION,
  PHASE2_EPISODE_DEFINITION,
  PHASE2_REFLECTION_EPISODE_DEFINITION,
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
