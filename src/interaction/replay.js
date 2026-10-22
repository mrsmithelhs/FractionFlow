import { buildCuratedProblem, generateProblem } from '../content/generator.js';
import { resolveCuratedFixture } from '../content/authored-content-catalog.js';
import { validateProblemInstance } from '../content/validation.js';
import { resolvePlan37BarToLineBridgeInstance } from '../content/authored-content-catalog.js';
import {
  EXACT_PLAN37_BAR_TO_LINE_CONTEXT_KEYS,
  isPlan37BarToLineBridgeDefinition,
  isPlan37BarToLineBridgeRepairDefinition,
  validatePlan37BarToLineBridgeContext,
  validatePlan37BarToLineBridgeInstance,
} from '../content/plan37-bar-to-line-bridge-task.js';
import { deepFreeze } from '../content/schema.js';
import { applyIntent, createEpisode } from './episode.js';
import { getEpisodeDefinition, validateActiveCondition } from './episode-definition.js';
import { makeContentIdentity } from './provenance.js';
import { validateSupportConfiguration } from './support.js';

export const REPLAY_SCHEMA_VERSION = 'fractionflow.episode-replay/v1';
export const REPLAY_V2_SCHEMA_VERSION = 'fractionflow.episode-replay/v2';
export const REPLAY_V3_SCHEMA_VERSION = 'fractionflow.episode-replay/v3';
export const REPLAY_V4_SCHEMA_VERSION = 'fractionflow.episode-replay/v4';
export const REPLAY_V5_SCHEMA_VERSION = 'fractionflow.episode-replay/v5';
export const REPLAY_V6_SCHEMA_VERSION = 'fractionflow.episode-replay/v6';
export const REPLAY_V7_SCHEMA_VERSION = 'fractionflow.episode-replay/v7';
export const REPLAY_V8_SCHEMA_VERSION = 'fractionflow.episode-replay/v8';

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
  if (identity?.schemaVersion === 'fractionflow.bridge-content-identity/v1') {
    assertExactKeys(identity, ['schemaVersion', 'id', 'source', 'provenance', 'sourceForm', 'reconstruction'], 'bridge contentIdentity');
    if (identity.source !== 'curated' || typeof identity.id !== 'string') throw new TypeError('bridge contentIdentity has invalid identity fields');
    assertExactKeys(identity.provenance, ['fixtureId', 'authoringRevision', 'itemId'], 'bridge contentIdentity.provenance');
    assertExactKeys(identity.sourceForm, ['kind', 'numerator', 'denominator'], 'bridge contentIdentity.sourceForm');
    assertExactKeys(identity.reconstruction, ['kind', 'practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision', 'taskDataId', 'taskDataRevision'], 'bridge contentIdentity.reconstruction');
    assertWireData(identity, 'bridge contentIdentity');
    return;
  }
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
  const v2 = envelope?.schemaVersion === REPLAY_V2_SCHEMA_VERSION;
  const v3 = envelope?.schemaVersion === REPLAY_V3_SCHEMA_VERSION;
  const v4 = envelope?.schemaVersion === REPLAY_V4_SCHEMA_VERSION;
  const v5 = envelope?.schemaVersion === REPLAY_V5_SCHEMA_VERSION;
  const v6 = envelope?.schemaVersion === REPLAY_V6_SCHEMA_VERSION;
  const v7 = envelope?.schemaVersion === REPLAY_V7_SCHEMA_VERSION;
  const v8 = envelope?.schemaVersion === REPLAY_V8_SCHEMA_VERSION;
  assertExactKeys(envelope, [
    'schemaVersion',
    'contentIdentity',
    'episodeDefinition',
    'support',
    'activeCondition',
    'learnerIntents',
    ...(v2 || v3 || v4 || v5 || v6 || v7 || v8 ? ['taskContext'] : []),
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
  if (v2) {
    if (!envelope.taskContext || typeof envelope.taskContext !== 'object' || Array.isArray(envelope.taskContext)) {
      throw new TypeError('replay v2 requires an exact taskContext');
    }
    if (envelope.episodeDefinition.id !== 'phase-3-reusable-full-addition'
      || envelope.episodeDefinition.revision !== '1') {
      throw new TypeError('replay v2 is reserved for the compact full-addition definition');
    }
  }
  if (v3) {
    const c = envelope.taskContext;
    assertExactKeys(c, ['practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision', 'definitionId', 'definitionRevision', 'taskDataId', 'taskDataRevision', 'sourceForms', 'targetDenominator', 'requiredSide'], 'replay v3 taskContext');
    if (envelope.episodeDefinition.id !== 'phase-3-nested-renaming-addition' || envelope.episodeDefinition.revision !== '1'
      || c.practiceSetId !== 'unlike-addition-vetted-set' || c.practiceSetRevision !== '6'
      || c.definitionId !== envelope.episodeDefinition.id || c.definitionRevision !== envelope.episodeDefinition.revision
      || c.targetDenominator !== '8' || !['left', 'right'].includes(c.requiredSide)) throw new TypeError('replay v3 is reserved for exact Plan 18 nested-addition context');
  }
  if (v4) {
    const c = envelope.taskContext;
    assertExactKeys(c, ['practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision', 'definitionId', 'definitionRevision', 'patternId', 'patternRevision', 'targetDenominator', 'taskDataId', 'taskDataRevision', 'stimulusId', 'stimulusRevision', 'candidates', 'requiredSides', 'sourceForms'], 'replay v4 taskContext');
    if (envelope.episodeDefinition.id !== 'phase-3-reusable-addition-recipes' || envelope.episodeDefinition.revision !== '1'
      || c.definitionId !== envelope.episodeDefinition.id || c.definitionRevision !== envelope.episodeDefinition.revision) {
      throw new TypeError('replay v4 is reserved for exact Plan 35 recipe context');
    }
  }
  if (v5) {
    const c = envelope.taskContext;
    assertExactKeys(c, [
      'practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision',
      'definitionId', 'definitionRevision', 'recipeId', 'recipeRevision',
      'taskDataId', 'taskDataRevision', 'sourceForms',
    ], 'replay v5 taskContext');
    if (envelope.episodeDefinition.id !== 'phase-3-like-denominator-takeaway-subtraction'
      || envelope.episodeDefinition.revision !== '1'
      || c.definitionId !== envelope.episodeDefinition.id
      || c.definitionRevision !== envelope.episodeDefinition.revision
      || c.recipeId !== 'plan36.like-denominator-takeaway'
      || c.recipeRevision !== '1'
      || c.taskDataId !== 'plan36-like-denominator-takeaway'
      || c.taskDataRevision !== '1'
      || c.practiceSetId !== 'like-denominator-subtraction-vetted-set'
      || c.practiceSetRevision !== '1'
      || c.authoringRevision !== 'plan36-record-v1') {
      throw new TypeError('replay v5 is reserved for exact Plan 36 subtraction context');
    }
    const allowedIntentTypes = new Set([
      'mark-subtrahend-amount',
      'request-task-help',
      'submit-subtraction-result',
      'finish-compact-episode',
    ]);
    for (const intent of envelope.learnerIntents) {
      if (!isPlainRecord(intent) || !allowedIntentTypes.has(intent.type)) {
        throw new TypeError(`replay v5 does not permit intent type: ${intent?.type}`);
      }
    }
  }
  if (v6) {
    const c = envelope.taskContext;
    assertExactKeys(c, [
      'practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision',
      'definitionId', 'definitionRevision', 'patternId', 'patternRevision',
      'targetDenominator', 'taskDataId', 'taskDataRevision', 'stimulusId', 'stimulusRevision',
      'candidates', 'requiredSides', 'sourceForms',
    ], 'replay v6 taskContext');
    if (envelope.episodeDefinition.id !== 'phase-3-reusable-subtraction-recipes'
      || envelope.episodeDefinition.revision !== '1'
      || c.definitionId !== envelope.episodeDefinition.id
      || c.definitionRevision !== envelope.episodeDefinition.revision) {
      throw new TypeError('replay v6 is reserved for exact Plan 40 recipe context');
    }
    const allowedIntentTypes = new Set([
      'acknowledge-encounter',
      'choose-common-denominator',
      'propose-common-denominator',
      'select-renaming-side',
      'submit-equivalent-form',
      'keep-inspected-form',
      'repair-inspected-form',
      'submit-subtraction-result',
      'finish-compact-episode',
      'request-task-help',
      'submit-transform-help-multiplier',
    ]);
    for (const intent of envelope.learnerIntents) {
      if (!isPlainRecord(intent) || !allowedIntentTypes.has(intent.type)) {
        throw new TypeError(`replay v6 does not permit intent type: ${intent?.type}`);
      }
    }
  }
  if (v7) {
    const context = envelope.taskContext;
    assertExactKeys(context, EXACT_PLAN37_BAR_TO_LINE_CONTEXT_KEYS, 'replay v7 taskContext');
    if (envelope.episodeDefinition.id !== 'phase-4-bar-to-line-same-amount'
      || envelope.episodeDefinition.revision !== '1'
      || context.definitionId !== envelope.episodeDefinition.id
      || context.definitionRevision !== envelope.episodeDefinition.revision) {
      throw new TypeError('replay v7 is reserved for exact Plan 39 bridge context');
    }
    if (!['acknowledge-bridge-encounter', 'propose-number-line-location', 'request-task-help', 'finish-compact-episode']
      .includes(envelope.learnerIntents[0]?.type) && envelope.learnerIntents.length > 0) {
      throw new TypeError('replay v7 does not permit this learner intent');
    }
    const allowedIntentTypes = new Set([
      'acknowledge-bridge-encounter', 'propose-number-line-location',
      'request-task-help', 'finish-compact-episode',
    ]);
    for (const intent of envelope.learnerIntents) {
      if (!isPlainRecord(intent) || !allowedIntentTypes.has(intent.type)) {
        throw new TypeError(`replay v7 does not permit intent type: ${intent?.type}`);
      }
    }
  }
  if (v8) {
    const context = envelope.taskContext;
    assertExactKeys(context, EXACT_PLAN37_BAR_TO_LINE_CONTEXT_KEYS, 'replay v8 taskContext');
    if (envelope.episodeDefinition.id !== 'phase-4-bar-to-line-same-amount'
      || envelope.episodeDefinition.revision !== '2'
      || context.definitionId !== envelope.episodeDefinition.id
      || context.definitionRevision !== envelope.episodeDefinition.revision) {
      throw new TypeError('replay v8 is reserved for exact Plan 39 Repair 02 bridge context');
    }
    const allowedIntentTypes = new Set([
      'propose-number-line-location',
      'request-task-help',
      'finish-compact-episode',
    ]);
    for (const intent of envelope.learnerIntents) {
      if (!isPlainRecord(intent) || !allowedIntentTypes.has(intent.type)) {
        throw new TypeError(`replay v8 does not permit intent type: ${intent?.type}`);
      }
    }
  }
}

function contentReconstructionIdentity(content) {
  const identity = makeContentIdentity(content);
  if (content?.schemaVersion === 'fractionflow.bridge-instance/v1') return identity;
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
  const fixture = resolveCuratedFixture(
    reconstruction.fixtureId,
    reconstruction.authoringRevision,
  );
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

function reconstructPlan37BarToLineBridge(identity) {
  const reconstruction = identity.reconstruction;
  if (!reconstruction || reconstruction.kind !== 'plan37-bar-to-line-bridge') {
    throw new Error('Plan 39 bridge replay identity is incomplete');
  }
  const instance = resolvePlan37BarToLineBridgeInstance(reconstruction.itemId, reconstruction.authoringRevision);
  if (!instance) throw new Error('unknown Plan 39 bridge replay identity');
  validatePlan37BarToLineBridgeInstance(instance);
  const expected = makeContentIdentity(instance);
  if (!sameJson(expected, identity)) throw new Error('Plan 39 bridge replay identity does not match authoritative registry');
  return instance;
}

function reconstructContent(identity) {
  if (!identity || typeof identity !== 'object') throw new Error('replay content identity is required');
  if (identity.schemaVersion === 'fractionflow.bridge-content-identity/v1') return reconstructPlan37BarToLineBridge(identity);
  if (identity.source === 'generated') return reconstructGenerated(identity);
  if (identity.source === 'curated') return reconstructCurated(identity);
  throw new Error(`unknown replay content source: ${String(identity.source)}`);
}

export function createReplayEnvelope(state) {
  if (!state || state.schemaVersion !== 'fractionflow.episode-state/v1') {
    throw new TypeError('state must be a Plan 05 episode state');
  }
  const envelope = {
    schemaVersion: isPlan37BarToLineBridgeRepairDefinition(state.episodeDefinition)
      ? REPLAY_V8_SCHEMA_VERSION
      : isPlan37BarToLineBridgeDefinition(state.episodeDefinition)
        ? REPLAY_V7_SCHEMA_VERSION
      : state.episodeDefinition.id === 'phase-3-reusable-subtraction-recipes'
      ? REPLAY_V6_SCHEMA_VERSION
      : state.episodeDefinition.id === 'phase-3-like-denominator-takeaway-subtraction'
        ? REPLAY_V5_SCHEMA_VERSION
        : state.episodeDefinition.id === 'phase-3-nested-renaming-addition'
          ? REPLAY_V3_SCHEMA_VERSION
          : state.episodeDefinition.id === 'phase-3-reusable-addition-recipes'
            ? REPLAY_V4_SCHEMA_VERSION
            : state.taskContext ? REPLAY_V2_SCHEMA_VERSION : REPLAY_SCHEMA_VERSION,
    contentIdentity: contentReconstructionIdentity(state.content),
    episodeDefinition: {
      id: state.episodeDefinition.id,
      revision: state.episodeDefinition.revision,
    },
    support: state.support,
    activeCondition: state.activeCondition,
    learnerIntents: state.intentHistory,
    ...(state.taskContext ? { taskContext: state.taskContext } : {}),
  };
  assertJsonSafe(envelope, 'replay envelope');
  return deepFreeze(envelope);
}

export function replayEpisode(envelope) {
  assertJsonSafe(envelope, 'replay envelope');
  if (!envelope || typeof envelope !== 'object') throw new TypeError('replay envelope must be an object');
  if (![REPLAY_SCHEMA_VERSION, REPLAY_V2_SCHEMA_VERSION, REPLAY_V3_SCHEMA_VERSION, REPLAY_V4_SCHEMA_VERSION, REPLAY_V5_SCHEMA_VERSION, REPLAY_V6_SCHEMA_VERSION, REPLAY_V7_SCHEMA_VERSION, REPLAY_V8_SCHEMA_VERSION].includes(envelope?.schemaVersion)) {
    throw new Error('unsupported replay envelope version');
  }
  assertReplayEnvelopeShape(envelope);
  const content = reconstructContent(envelope.contentIdentity);
  const definition = getEpisodeDefinition(
    envelope.episodeDefinition?.id,
    envelope.episodeDefinition?.revision,
  );
  if ((isPlan37BarToLineBridgeDefinition(definition) && envelope.schemaVersion !== REPLAY_V7_SCHEMA_VERSION)
    || (isPlan37BarToLineBridgeRepairDefinition(definition) && envelope.schemaVersion !== REPLAY_V8_SCHEMA_VERSION)
    || (![isPlan37BarToLineBridgeDefinition(definition), isPlan37BarToLineBridgeRepairDefinition(definition)].some(Boolean)
      && [REPLAY_V7_SCHEMA_VERSION, REPLAY_V8_SCHEMA_VERSION].includes(envelope.schemaVersion))) {
    throw new Error('Plan 39 bridge episodes require replay v7 and v7 is bridge-only');
  }
  if (envelope.schemaVersion === REPLAY_V7_SCHEMA_VERSION || envelope.schemaVersion === REPLAY_V8_SCHEMA_VERSION) {
    const expectedMode = envelope.support?.dimensions?.fractionBarModel === 'high support'
      ? 'partitioned'
      : envelope.support?.dimensions?.fractionBarModel === 'medium support'
        ? 'sparse-benchmarks' : null;
    validatePlan37BarToLineBridgeContext(content, envelope.taskContext, expectedMode);
  }
  let state = createEpisode({
    instance: content,
    episodeDefinition: definition,
    support: envelope.support,
    activeCondition: envelope.activeCondition,
    ...(envelope.schemaVersion === REPLAY_V2_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V3_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V4_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V5_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V6_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V7_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V8_SCHEMA_VERSION ? {
      taskContext: envelope.taskContext,
      allowCompatibilityPair: envelope.schemaVersion !== REPLAY_V4_SCHEMA_VERSION
        && envelope.schemaVersion !== REPLAY_V5_SCHEMA_VERSION
        && envelope.schemaVersion !== REPLAY_V6_SCHEMA_VERSION
        && envelope.taskContext.practiceSetId === null
        && envelope.taskContext.practiceSetRevision === null,
    } : {}),
  });
  for (const intent of envelope.learnerIntents) {
    state = applyIntent(state, intent);
  }
  return state;
}
