import {
  buildCuratedProblem,
  generateProblem,
  PHASE1_GOLDEN_CASES,
  validateProblemInstance,
} from '../content/index.js';
import { deepFreeze } from '../content/schema.js';
import { applyIntent, createEpisode } from './episode.js';
import { getEpisodeDefinition } from './episode-definition.js';
import { makeContentIdentity } from './provenance.js';

export const REPLAY_SCHEMA_VERSION = 'fractionflow.episode-replay/v1';

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function assertJsonSafe(value, name) {
  try {
    JSON.stringify(value);
  } catch (error) {
    throw new TypeError(`${name} must be JSON-safe: ${error.message}`);
  }
}

function contentReconstructionIdentity(content) {
  const identity = makeContentIdentity(content);
  if (content.source === 'generated') {
    return {
      ...identity,
      reconstruction: {
        kind: 'generated',
        request: content.request,
        generatorVersion: content.provenance.generatorVersion,
        seed: content.provenance.seed,
        seedAlgorithm: content.provenance.seedAlgorithm,
        profileId: content.provenance.profileId,
        profileVersion: content.provenance.profileVersion,
      },
    };
  }
  if (content.source === 'curated') {
    return {
      ...identity,
      reconstruction: {
        kind: 'curated',
        request: content.request,
        fixtureId: content.provenance.fixtureId,
        authoringRevision: content.provenance.authoringRevision,
      },
    };
  }
  throw new TypeError(`unsupported content source: ${String(content.source)}`);
}

function assertContentIdentity(instance, identity) {
  const actual = makeContentIdentity(instance);
  if (!sameJson(actual, {
    schemaVersion: identity.schemaVersion,
    id: identity.id,
    source: identity.source,
    request: identity.request,
    provenance: identity.provenance,
    selector: identity.selector,
    overlays: identity.overlays,
    sourceForms: identity.sourceForms,
  })) {
    throw new Error('reconstructed content identity does not match replay envelope');
  }
}

function reconstructGenerated(identity) {
  const reconstruction = identity.reconstruction;
  if (!reconstruction || reconstruction.kind !== 'generated') {
    throw new Error('generated replay identity is incomplete');
  }
  const instance = generateProblem({
    selector: reconstruction.request.selector,
    overlays: reconstruction.request.overlays,
    profileId: reconstruction.request.profileId,
    seed: reconstruction.seed,
  });
  const validation = validateProblemInstance(instance);
  if (!validation.valid) throw new Error('reconstructed generated content failed validation');
  if (instance.provenance.generatorVersion !== reconstruction.generatorVersion
    || !sameJson(instance.provenance.seedAlgorithm, reconstruction.seedAlgorithm)
    || instance.provenance.profileVersion !== reconstruction.profileVersion) {
    throw new Error('generated replay version identity does not match');
  }
  if (instance.id !== identity.id) throw new Error('generated replay instance id does not match');
  assertContentIdentity(instance, identity);
  return instance;
}

function reconstructCurated(identity) {
  const reconstruction = identity.reconstruction;
  if (!reconstruction || reconstruction.kind !== 'curated') {
    throw new Error('curated replay identity is incomplete');
  }
  const fixture = PHASE1_GOLDEN_CASES.find((candidate) => (
    candidate.id === reconstruction.fixtureId
    && candidate.authoringRevision === reconstruction.authoringRevision
  ));
  if (!fixture) throw new Error('unknown curated replay fixture identity');
  const instance = buildCuratedProblem({
    fixture,
    selector: reconstruction.request.selector,
    overlays: reconstruction.request.overlays,
    profileId: reconstruction.request.profileId,
    candidate: {
      left: fixture.left,
      right: fixture.right,
      reviewedTransitions: fixture.reviewedTransitions ?? [],
    },
  });
  const validation = validateProblemInstance(instance);
  if (!validation.valid) throw new Error('reconstructed curated content failed validation');
  if (instance.id !== identity.id) throw new Error('curated replay instance id does not match');
  assertContentIdentity(instance, identity);
  return instance;
}

function reconstructContent(identity) {
  if (!identity || typeof identity !== 'object') throw new Error('replay content identity is required');
  if (identity.source === 'generated') return reconstructGenerated(identity);
  if (identity.source === 'curated') return reconstructCurated(identity);
  throw new Error(`unknown replay content source: ${String(identity.source)}`);
}

export function createReplayEnvelope(state) {
  if (!state || state.schemaVersion !== 'fractionflow.episode-state/v1') {
    throw new TypeError('state must be a Plan 05 episode state');
  }
  const envelope = {
    schemaVersion: REPLAY_SCHEMA_VERSION,
    contentIdentity: contentReconstructionIdentity(state.content),
    episodeDefinition: {
      id: state.episodeDefinition.id,
      revision: state.episodeDefinition.revision,
    },
    support: state.support,
    activeCondition: state.activeCondition,
    learnerIntents: state.intentHistory,
  };
  assertJsonSafe(envelope, 'replay envelope');
  return deepFreeze(envelope);
}

export function replayEpisode(envelope) {
  assertJsonSafe(envelope, 'replay envelope');
  if (envelope?.schemaVersion !== REPLAY_SCHEMA_VERSION) {
    throw new Error('unsupported replay envelope version');
  }
  const content = reconstructContent(envelope.contentIdentity);
  const definition = getEpisodeDefinition(
    envelope.episodeDefinition?.id,
    envelope.episodeDefinition?.revision,
  );
  let state = createEpisode({
    instance: content,
    episodeDefinition: definition,
    support: envelope.support,
    activeCondition: envelope.activeCondition,
  });
  if (!Array.isArray(envelope.learnerIntents)) throw new Error('replay learner intents must be an array');
  for (const intent of envelope.learnerIntents) {
    state = applyIntent(state, intent);
  }
  return state;
}
