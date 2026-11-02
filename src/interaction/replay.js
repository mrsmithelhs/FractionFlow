import { resolvePlan59Context, validatePlan59Context } from '../content/plan59-directed-endpoint-task.js';
import { resolvePlan58Context, validatePlan58Context } from '../content/plan58-whole-plus-fraction-task.js';
import { resolvePlan53Context, validatePlan53Context } from '../content/plan53-two-whole-location-task.js';
import { resolvePlan51Context, validatePlan51Context } from '../content/plan51-distance-task.js';
import { resolvePlan50Context, validatePlan50Context } from '../content/plan50-number-line-collection-task.js';
import { validatePlan49Context } from './plan49-comparison-construction.js';
import { buildCuratedProblem, generateProblem } from '../content/generator.js';
import { resolveCuratedFixture } from '../content/authored-content-catalog.js';
import { validateProblemInstance } from '../content/validation.js';
import { resolvePlan37BarToLineBridgeInstance } from '../content/authored-content-catalog.js';
import { isPlan45ComparisonDefinition, validatePlan45ComparisonContext } from '../content/plan45-symbolic-fraction-comparison-task.js';
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
import { makeContentIdentity, makePlan45ComparisonContentIdentity } from './provenance.js';
import { isPlan45ComparisonEpisode } from './plan45-comparison-episode.js';
import { validateSupportConfiguration } from './support.js';

export const REPLAY_SCHEMA_VERSION = 'fractionflow.episode-replay/v1';
export const REPLAY_V2_SCHEMA_VERSION = 'fractionflow.episode-replay/v2';
export const REPLAY_V3_SCHEMA_VERSION = 'fractionflow.episode-replay/v3';
export const REPLAY_V4_SCHEMA_VERSION = 'fractionflow.episode-replay/v4';
export const REPLAY_V5_SCHEMA_VERSION = 'fractionflow.episode-replay/v5';
export const REPLAY_V6_SCHEMA_VERSION = 'fractionflow.episode-replay/v6';
export const REPLAY_V7_SCHEMA_VERSION = 'fractionflow.episode-replay/v7';
export const REPLAY_V8_SCHEMA_VERSION = 'fractionflow.episode-replay/v8';
export const REPLAY_V9_SCHEMA_VERSION = 'fractionflow.episode-replay/v9';
export const REPLAY_V10_SCHEMA_VERSION = 'fractionflow.episode-replay/v10';
export const REPLAY_V11_SCHEMA_VERSION = 'fractionflow.episode-replay/v11';
export const REPLAY_V12_SCHEMA_VERSION = 'fractionflow.episode-replay/v12';
export const REPLAY_V15_SCHEMA_VERSION = 'fractionflow.episode-replay/v15';
function plan59Identity(c) {
  return { schemaVersion: 'fractionflow.directed-endpoint-content-identity/v1', id: c.itemId, source: 'curated',
    reconstruction: { kind: 'plan59-directed-endpoint', setId: c.setId, setRevision: c.setRevision,
      itemId: c.itemId, itemRevision: c.itemRevision } };
}
export const REPLAY_V14_SCHEMA_VERSION = 'fractionflow.episode-replay/v14';
function plan58Identity(c) { return { schemaVersion: 'fractionflow.construction-content-identity/v1', id: c.itemId, source: 'curated', reconstruction: { kind: 'plan58-whole-plus-fraction', setId: c.setId, setRevision: c.setRevision, itemId: c.itemId, itemRevision: c.itemRevision } }; }
export const REPLAY_V13_SCHEMA_VERSION = 'fractionflow.episode-replay/v13';
function plan53Identity(context) {
  return {
    schemaVersion: 'fractionflow.two-whole-location-content-identity/v1',
    id: context.itemId, source: 'curated',
    reconstruction: {
      kind: 'plan53-two-whole-location', setId: context.setId, setRevision: context.setRevision,
      itemId: context.itemId, itemRevision: context.itemRevision,
    },
  };
}

function plan51Identity(c) {
  return { schemaVersion: 'fractionflow.distance-content-identity/v1', id: c.itemId, source: 'curated',
    reconstruction: { kind: 'plan51-fraction-distance', setId: c.setId, setRevision: c.setRevision, itemId: c.itemId, itemRevision: c.itemRevision } };
}

function plan50Identity(c) { return { schemaVersion:'fractionflow.collection-content-identity/v1', id:c.itemId, source:'curated', reconstruction:{kind:'plan50-number-line-collection',setId:c.setId,setRevision:c.setRevision,itemId:c.itemId,itemRevision:c.itemRevision} }; }

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
  if (identity?.schemaVersion === 'fractionflow.comparison-content-identity/v1') {
    assertExactKeys(identity, ['schemaVersion', 'id', 'source', 'reconstruction'], 'comparison contentIdentity');
    assertExactKeys(identity.reconstruction, ['kind', 'practiceSetId', 'practiceSetRevision', 'itemId', 'authoringRevision'], 'comparison contentIdentity.reconstruction');
    if (identity.source !== 'curated' || identity.reconstruction.kind !== 'plan45-symbolic-fraction-comparison'
      || typeof identity.id !== 'string') throw new TypeError('comparison contentIdentity has invalid identity fields');
    assertWireData(identity, 'comparison contentIdentity');
    return;
  }
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
  const v9 = envelope?.schemaVersion === REPLAY_V9_SCHEMA_VERSION;
  const v10 = envelope?.schemaVersion === REPLAY_V10_SCHEMA_VERSION;
  assertExactKeys(envelope, [
    'schemaVersion',
    'contentIdentity',
    'episodeDefinition',
    'support',
    'activeCondition',
    'learnerIntents',
    ...(v2 || v3 || v4 || v5 || v6 || v7 || v8 || v9 || v10 ? ['taskContext'] : []),
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
  if (v9) {
    const context = envelope.taskContext;
    assertExactKeys(context, [
      'practiceSetId', 'practiceSetRevision', 'itemId', 'authoringRevision',
      'definitionId', 'definitionRevision', 'recipeId', 'recipeRevision',
      'taskDataId', 'taskDataRevision', 'sourceForms', 'teachingIntentId', 'cueId', 'hintContext',
    ], 'replay v9 taskContext');
    if (envelope.episodeDefinition.id !== 'phase-4-symbolic-fraction-comparison'
      || envelope.episodeDefinition.revision !== '1') {
      throw new TypeError('replay v9 is reserved for Plan 45 symbolic fraction comparison');
    }
    validatePlan45ComparisonContext(context);
    const expectedIdentity = makePlan45ComparisonContentIdentity(context);
    if (!sameJson(expectedIdentity, envelope.contentIdentity)) throw new TypeError('replay v9 comparison identity does not match its authoritative context');
    const allowedIntentTypes = new Set([
      'request-comparison-model', 'request-comparison-help', 'submit-fraction-comparison',
    ]);
    for (const intent of envelope.learnerIntents) {
      if (!isPlainRecord(intent) || !allowedIntentTypes.has(intent.type)) {
        throw new TypeError(`replay v9 does not permit intent type: ${intent?.type}`);
      }
    }
  }
  if (v10) {
    if (envelope.episodeDefinition.id !== 'phase-4-symbolic-fraction-comparison' || envelope.episodeDefinition.revision !== '2') throw new TypeError('replay v10 requires comparison revision 2');
    validatePlan49Context(envelope.taskContext);
    if (!sameJson(makePlan45ComparisonContentIdentity(envelope.taskContext), envelope.contentIdentity)) throw new TypeError('replay v10 identity mismatch');
    const allowed = new Set(['request-comparison-model','request-comparison-help','submit-fraction-comparison','open-comparison-construction','revise-comparison-denominator','request-comparison-construction-help','submit-comparison-denominator','submit-comparison-multiplier','submit-comparison-numerator']);
    for (const intent of envelope.learnerIntents) if (!isPlainRecord(intent) || !allowed.has(intent.type)) throw new TypeError('invalid v10 intent');
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
  if (state.episodeDefinition?.id === 'phase-4-directed-number-line-endpoint' && state.episodeDefinition.revision === '1') {
    const context = validatePlan59Context(state.taskContext);
    const envelope = { schemaVersion: REPLAY_V15_SCHEMA_VERSION, contentIdentity: plan59Identity(context),
      episodeDefinition: { id: state.episodeDefinition.id, revision: state.episodeDefinition.revision },
      support: state.support, activeCondition: state.activeCondition, learnerIntents: state.intentHistory, taskContext: context };
    assertJsonSafe(envelope, 'replay envelope');
    return deepFreeze(envelope);
  }
  if (state.episodeDefinition?.id === 'phase-4-whole-plus-fraction-construction' && state.episodeDefinition.revision === '1') {
    const c = validatePlan58Context(state.taskContext);
    const envelope = { schemaVersion: REPLAY_V14_SCHEMA_VERSION, contentIdentity: plan58Identity(c), episodeDefinition: { id: state.episodeDefinition.id, revision: state.episodeDefinition.revision }, support: state.support, activeCondition: state.activeCondition, learnerIntents: state.intentHistory, taskContext: c };
    assertJsonSafe(envelope, 'replay envelope');
    return deepFreeze(envelope);
  }
  if (state.episodeDefinition?.id === 'phase-4-two-whole-location' && state.episodeDefinition.revision === '1') {
    const context = validatePlan53Context(state.taskContext);
    const envelope = {
      schemaVersion: REPLAY_V13_SCHEMA_VERSION, contentIdentity: plan53Identity(context),
      episodeDefinition: { id: state.episodeDefinition.id, revision: state.episodeDefinition.revision },
      support: state.support, activeCondition: state.activeCondition,
      learnerIntents: state.intentHistory, taskContext: context,
    };
    assertJsonSafe(envelope, 'replay envelope');
    return deepFreeze(envelope);
  }
  const isComparison = isPlan45ComparisonEpisode(state);
  if (state.episodeDefinition?.id === 'phase-4-fraction-distance' && state.episodeDefinition.revision === '1') {
    const c = validatePlan51Context(state.taskContext);
    const envelope = { schemaVersion: REPLAY_V12_SCHEMA_VERSION, contentIdentity: plan51Identity(c),
      episodeDefinition: { id: state.episodeDefinition.id, revision: state.episodeDefinition.revision },
      support: state.support, activeCondition: state.activeCondition, learnerIntents: state.intentHistory, taskContext: c };
    assertJsonSafe(envelope, 'replay envelope');
    return deepFreeze(envelope);
  }
  if (state.episodeDefinition?.id === 'phase-4-number-line-collection' && state.episodeDefinition.revision === '1') {
    const c = validatePlan50Context(state.taskContext);
    const envelope = { schemaVersion:REPLAY_V11_SCHEMA_VERSION, contentIdentity:plan50Identity(c), episodeDefinition:{id:state.episodeDefinition.id,revision:state.episodeDefinition.revision}, support:state.support, activeCondition:state.activeCondition, learnerIntents:state.intentHistory, taskContext:c };
    assertJsonSafe(envelope, 'replay envelope');
    return deepFreeze(envelope);
  }
  const envelope = {
    schemaVersion: isComparison
      ? (state.episodeDefinition.revision === '2' ? REPLAY_V10_SCHEMA_VERSION : REPLAY_V9_SCHEMA_VERSION)
      : isPlan37BarToLineBridgeRepairDefinition(state.episodeDefinition)
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
    contentIdentity: isComparison
      ? makePlan45ComparisonContentIdentity(state.taskContext)
      : contentReconstructionIdentity(state.content),
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
  if (envelope.schemaVersion === REPLAY_V15_SCHEMA_VERSION) {
    assertExactKeys(envelope, ['schemaVersion', 'contentIdentity', 'episodeDefinition', 'support', 'activeCondition', 'learnerIntents', 'taskContext'], 'replay v15');
    assertExactKeys(envelope.episodeDefinition, ['id', 'revision'], 'replay v15 definition');
    if (envelope.episodeDefinition.id !== 'phase-4-directed-number-line-endpoint' || envelope.episodeDefinition.revision !== '1') throw new TypeError('invalid v15 definition');
    const context = validatePlan59Context(envelope.taskContext);
    if (!sameJson(plan59Identity(context), envelope.contentIdentity) || !Array.isArray(envelope.learnerIntents)) throw new TypeError('invalid v15 identity or intents');
    let state = createEpisode({ episodeDefinition: getEpisodeDefinition('phase-4-directed-number-line-endpoint', '1'),
      taskContext: resolvePlan59Context(context.itemId), support: envelope.support, activeCondition: envelope.activeCondition });
    for (const intent of envelope.learnerIntents) state = applyIntent(state, intent);
    return state;
  }
  if (envelope.schemaVersion === REPLAY_V14_SCHEMA_VERSION) {
    assertExactKeys(envelope, ['schemaVersion', 'contentIdentity', 'episodeDefinition', 'support', 'activeCondition', 'learnerIntents', 'taskContext'], 'replay v14');
    assertExactKeys(envelope.episodeDefinition, ['id', 'revision'], 'replay v14 definition');
    if (envelope.episodeDefinition.id !== 'phase-4-whole-plus-fraction-construction' || envelope.episodeDefinition.revision !== '1') throw new TypeError('invalid v14 definition');
    const context = validatePlan58Context(envelope.taskContext);
    if (!sameJson(plan58Identity(context), envelope.contentIdentity) || !Array.isArray(envelope.learnerIntents)) throw new TypeError('invalid v14 identity or intents');
    let state = createEpisode({ episodeDefinition: getEpisodeDefinition('phase-4-whole-plus-fraction-construction', '1'), taskContext: resolvePlan58Context(context.itemId), support: envelope.support, activeCondition: envelope.activeCondition });
    for (const intent of envelope.learnerIntents) state = applyIntent(state, intent);
    return state;
  }
  if (envelope.schemaVersion === REPLAY_V13_SCHEMA_VERSION) {
    assertExactKeys(envelope, ['schemaVersion', 'contentIdentity', 'episodeDefinition', 'support',
      'activeCondition', 'learnerIntents', 'taskContext'], 'replay v13');
    assertExactKeys(envelope.episodeDefinition, ['id', 'revision'], 'replay v13 definition');
    if (envelope.episodeDefinition.id !== 'phase-4-two-whole-location'
      || envelope.episodeDefinition.revision !== '1') throw new TypeError('invalid v13 definition');
    const context = validatePlan53Context(envelope.taskContext);
    assertExactKeys(envelope.contentIdentity, ['schemaVersion', 'id', 'source', 'reconstruction'], 'replay v13 identity');
    assertExactKeys(envelope.contentIdentity.reconstruction, ['kind', 'setId', 'setRevision', 'itemId', 'itemRevision'], 'replay v13 reconstruction');
    if (!sameJson(plan53Identity(context), envelope.contentIdentity) || !Array.isArray(envelope.learnerIntents)) {
      throw new TypeError('invalid v13 identity or intents');
    }
    let state = createEpisode({
      episodeDefinition: getEpisodeDefinition('phase-4-two-whole-location', '1'),
      taskContext: resolvePlan53Context(context.itemId), support: envelope.support, activeCondition: envelope.activeCondition,
    });
    for (const intent of envelope.learnerIntents) state = applyIntent(state, intent);
    return state;
  }
  if (envelope.schemaVersion === REPLAY_V12_SCHEMA_VERSION) {
    assertExactKeys(envelope, ['schemaVersion', 'contentIdentity', 'episodeDefinition', 'support', 'activeCondition', 'learnerIntents', 'taskContext'], 'replay v12');
    assertExactKeys(envelope.episodeDefinition, ['id', 'revision'], 'replay v12 definition');
    if (envelope.episodeDefinition.id !== 'phase-4-fraction-distance' || envelope.episodeDefinition.revision !== '1') throw new TypeError('invalid v12 definition');
    const c = validatePlan51Context(envelope.taskContext);
    assertExactKeys(envelope.contentIdentity, ['schemaVersion', 'id', 'source', 'reconstruction'], 'replay v12 identity');
    assertExactKeys(envelope.contentIdentity.reconstruction, ['kind', 'setId', 'setRevision', 'itemId', 'itemRevision'], 'replay v12 reconstruction');
    if (!sameJson(plan51Identity(c), envelope.contentIdentity) || !Array.isArray(envelope.learnerIntents)) throw new TypeError('invalid v12 identity or intents');
    let state = createEpisode({ episodeDefinition: getEpisodeDefinition('phase-4-fraction-distance', '1'), taskContext: resolvePlan51Context(c.itemId), support: envelope.support, activeCondition: envelope.activeCondition });
    for (const intent of envelope.learnerIntents) state = applyIntent(state, intent);
    return state;
  }
  if (envelope.schemaVersion === REPLAY_V11_SCHEMA_VERSION) {
    assertExactKeys(envelope,['schemaVersion','contentIdentity','episodeDefinition','support','activeCondition','learnerIntents','taskContext'],'replay v11');
    assertExactKeys(envelope.episodeDefinition,['id','revision'],'replay v11 definition');
    if (envelope.episodeDefinition.id !== 'phase-4-number-line-collection' || envelope.episodeDefinition.revision !== '1') throw new TypeError('invalid v11 definition');
    const c = validatePlan50Context(envelope.taskContext);
    assertExactKeys(envelope.contentIdentity,['schemaVersion','id','source','reconstruction'],'replay v11 identity');
    assertExactKeys(envelope.contentIdentity.reconstruction,['kind','setId','setRevision','itemId','itemRevision'],'replay v11 reconstruction');
    if (!sameJson(plan50Identity(c),envelope.contentIdentity)) throw new TypeError('invalid v11 identity');
    if (!Array.isArray(envelope.learnerIntents)) throw new TypeError('invalid v11 intents');
    let state = createEpisode({episodeDefinition:getEpisodeDefinition('phase-4-number-line-collection','1'),taskContext:resolvePlan50Context(c.itemId),support:envelope.support,activeCondition:envelope.activeCondition});
    for (const intent of envelope.learnerIntents) state = applyIntent(state,intent);
    return state;
  }
  if (![REPLAY_SCHEMA_VERSION, REPLAY_V2_SCHEMA_VERSION, REPLAY_V3_SCHEMA_VERSION, REPLAY_V4_SCHEMA_VERSION, REPLAY_V5_SCHEMA_VERSION, REPLAY_V6_SCHEMA_VERSION, REPLAY_V7_SCHEMA_VERSION, REPLAY_V8_SCHEMA_VERSION, REPLAY_V9_SCHEMA_VERSION, REPLAY_V10_SCHEMA_VERSION].includes(envelope?.schemaVersion)) {
    throw new Error('unsupported replay envelope version');
  }
  assertReplayEnvelopeShape(envelope);
  const content = [REPLAY_V9_SCHEMA_VERSION, REPLAY_V10_SCHEMA_VERSION].includes(envelope.schemaVersion)
    ? null
    : reconstructContent(envelope.contentIdentity);
  const definition = getEpisodeDefinition(
    envelope.episodeDefinition?.id,
    envelope.episodeDefinition?.revision,
  );
  if (isPlan45ComparisonDefinition(definition) !== [REPLAY_V9_SCHEMA_VERSION, REPLAY_V10_SCHEMA_VERSION].includes(envelope.schemaVersion) || (isPlan45ComparisonDefinition(definition) && definition.revision !== (envelope.schemaVersion === REPLAY_V9_SCHEMA_VERSION ? '1' : '2'))) {
    throw new Error('Plan 45 comparison episodes require replay v9 and v9 is comparison-only');
  }
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
      || envelope.schemaVersion === REPLAY_V8_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V9_SCHEMA_VERSION
      || envelope.schemaVersion === REPLAY_V10_SCHEMA_VERSION ? {
      taskContext: envelope.taskContext,
      allowCompatibilityPair: envelope.schemaVersion !== REPLAY_V4_SCHEMA_VERSION
        && envelope.schemaVersion !== REPLAY_V5_SCHEMA_VERSION
        && envelope.schemaVersion !== REPLAY_V6_SCHEMA_VERSION
        && envelope.schemaVersion !== REPLAY_V9_SCHEMA_VERSION
        && envelope.taskContext.practiceSetId === null
        && envelope.taskContext.practiceSetRevision === null,
    } : {}),
  });
  for (const intent of envelope.learnerIntents) {
    state = applyIntent(state, intent);
  }
  return state;
}
