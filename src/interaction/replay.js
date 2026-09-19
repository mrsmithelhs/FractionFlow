import {
  buildCuratedProblem,
  generateProblem,
  PHASE1_GOLDEN_CASES,
  validateProblemInstance,
} from '../content/index.js';
import { deepFreeze } from '../content/schema.js';
import { applyIntent, createEpisode } from './episode.js';
import { getEpisodeDefinition, validateActiveCondition } from './episode-definition.js';
import { makeContentIdentity } from './provenance.js';
import { validateSupportConfiguration } from './support.js';

export const REPLAY_SCHEMA_VERSION = 'fractionflow.episode-replay/v1';

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isPlainRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertWireData(value, name, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${name} must not contain non-finite numbers`);
    return;
  }
  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
    throw new TypeError(`${name} contains a value that is not JSON wire data`);
  }
  if (typeof value !== 'object') throw new TypeError(`${name} contains an unsupported value`);
  if (seen.has(value)) throw new TypeError(`${name} must not be circular`);
  seen.add(value);
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      assertWireData(value[index], `${name}[${index}]`, seen);
    }
  } else {
    if (!isPlainRecord(value) || Object.prototype.hasOwnProperty.call(value, 'toJSON')) {
      throw new TypeError(`${name} must contain only plain records and arrays`);
    }
    Object.entries(value).forEach(([key, entry]) => assertWireData(entry, `${name}.${key}`, seen));
  }
  seen.delete(value);
}

function assertJsonSafe(value, name) {
  assertWireData(value, name);
  const serialized = JSON.stringify(value);
  const roundTripped = JSON.parse(serialized);
  if (!sameJson(value, roundTripped)) {
    throw new TypeError(`${name} does not survive a JSON wire round trip`);
  }
}

function assertExactKeys(value, expectedKeys, name) {
  if (!isPlainRecord(value)) throw new TypeError(`${name} must be a plain object`);
  const actualKeys = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expected)) {
    throw new TypeError(`${name} has an unsupported shape`);
  }
}

function assertRequestShape(request, name) {
  assertExactKeys(request, ['selector', 'operation', 'overlays', 'profileId', 'profileVersion'], name);
  if (typeof request.selector !== 'string'
    || typeof request.operation !== 'string'
    || !Array.isArray(request.overlays)
    || typeof request.profileId !== 'string'
    || typeof request.profileVersion !== 'string') {
    throw new TypeError(`${name} has invalid request fields`);
  }
}

function assertContentIdentityShape(identity) {
  assertExactKeys(identity, [
    'schemaVersion',
    'id',
    'source',
    'request',
    'provenance',
    'selector',
    'overlays',
    'sourceForms',
    'reconstruction',
  ], 'contentIdentity');
  assertRequestShape(identity.request, 'contentIdentity.request');
  assertExactKeys(identity.sourceForms, ['left', 'right'], 'contentIdentity.sourceForms');
  assertWireData(identity, 'contentIdentity');
  if (identity.source !== 'generated' && identity.source !== 'curated') {
    throw new TypeError(`unsupported replay content source: ${String(identity.source)}`);
  }
  const reconstructionKeys = identity.source === 'generated'
    ? ['kind', 'request', 'generatorVersion', 'seed', 'seedAlgorithm', 'profileId', 'profileVersion']
    : ['kind', 'request', 'fixtureId', 'authoringRevision'];
  assertExactKeys(identity.reconstruction, reconstructionKeys, 'contentIdentity.reconstruction');
  assertRequestShape(identity.reconstruction.request, 'contentIdentity.reconstruction.request');
}

function assertReplayEnvelopeShape(envelope) {
  assertExactKeys(envelope, [
    'schemaVersion',
    'contentIdentity',
    'episodeDefinition',
    'support',
    'activeCondition',
    'learnerIntents',
  ], 'replay envelope');
  assertContentIdentityShape(envelope.contentIdentity);
  assertExactKeys(envelope.episodeDefinition, ['id', 'revision'], 'episodeDefinition');
  if (typeof envelope.episodeDefinition.id !== 'string'
    || typeof envelope.episodeDefinition.revision !== 'string') {
    throw new TypeError('episodeDefinition identity must contain string id and revision');
  }
  const support = validateSupportConfiguration(envelope.support);
  if (!sameJson(support, envelope.support)) throw new TypeError('support configuration is not canonical wire data');
  const condition = validateActiveCondition(envelope.activeCondition);
  if (!sameJson(condition, envelope.activeCondition)) throw new TypeError('active condition is not canonical wire data');
  if (!Array.isArray(envelope.learnerIntents)) throw new TypeError('replay learner intents must be an array');
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
  const { reconstruction: ignored, ...baseIdentity } = identity;
  if (!sameJson(actual, baseIdentity)) {
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
  const expectedReconstruction = contentReconstructionIdentity(instance).reconstruction;
  if (!sameJson(expectedReconstruction, reconstruction)) {
    throw new Error('generated replay reconstruction identity does not match');
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
  const expectedReconstruction = contentReconstructionIdentity(instance).reconstruction;
  if (!sameJson(expectedReconstruction, reconstruction)) {
    throw new Error('curated replay reconstruction identity does not match');
  }
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
  if (!envelope || typeof envelope !== 'object') throw new TypeError('replay envelope must be an object');
  if (envelope?.schemaVersion !== REPLAY_SCHEMA_VERSION) {
    throw new Error('unsupported replay envelope version');
  }
  assertReplayEnvelopeShape(envelope);
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
  for (const intent of envelope.learnerIntents) {
    state = applyIntent(state, intent);
  }
  return state;
}
