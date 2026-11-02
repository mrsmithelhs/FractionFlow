import { projectPlan51Distance } from './plan51-distance-scene.js';
import { admitPlan50Record, validatePlan50Context } from '../content/plan50-number-line-collection-task.js';
import { PLAN50_CONDITION } from './plan50-number-line-collection-episode.js';
import { validatePlan49Context, projectPlan49PublicConstruction } from './plan49-comparison-construction.js';
import { deepFreeze } from '../content/schema.js';
import { candidateDenominatorsForInstance } from '../content/eligibility.js';
import { reflectionChoicesForInstance } from '../content/data/reflection-choices.js';
import { premiseCheckForInstance } from '../content/data/premise-checks.js';
import { crossingResultStackForIdentity } from '../content/authored-content-catalog.js';
import { makeContentIdentity } from './provenance.js';
import { makePlan45ComparisonContentIdentity } from './provenance.js';
import { isPlan45ComparisonEpisode } from './plan45-comparison-episode.js';
import { plan45ComparisonHelpText, validatePlan45ComparisonContext } from '../content/plan45-symbolic-fraction-comparison-task.js';
import { validateActiveCondition } from './episode-definition.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION } from './episode-definition.js';
import { currentScheduleEntry } from './beat-schedule.js';
import {
  classifyPlan37BenchmarkRelation,
  isPlan37BarToLineBridgeTaskDefinition,
  plan37ExactLocationScale,
  validatePlan37BarToLineBridgeInstance,
} from '../content/plan37-bar-to-line-bridge-task.js';

export const SCENE_SCHEMA_VERSION = 'fractionflow.scene/v1';
export const EPISODE_STATE_SCHEMA_VERSION = 'fractionflow.episode-state/v1';

export const REPRESENTATION_ROLES = Object.freeze([
  'fraction-bar',
  'symbolic',
  'number-line',
]);

export const PRESENTATION_MODES = Object.freeze([
  'standard-motion',
  'reduced-motion',
  'instant-test',
]);

const REPRESENTATION_VERDICT_KEYS = Object.freeze({
  'fraction-bar': 'fractionBar',
  symbolic: 'symbolic',
  'number-line': 'numberLine',
});

const VALID_VERDICTS = Object.freeze([
  'eligible',
  'ineligible',
  'not-in-phase-2',
]);

const SCENE_HISTORY_KEYS = Object.freeze([
  'intentHistory',
  'completedBeats',
  'helpHistory',
  'replayHistory',
  'retryHistory',
  'responseProvenance',
]);

export class SceneProjectionError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'SceneProjectionError';
    this.code = code;
    this.details = details;
  }
}

function isPlainRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function wireError(path, message) {
  throw new SceneProjectionError(
    'INVALID_SCENE_INPUT',
    `${path} is not canonical JSON-wire data: ${message}`,
  );
}

function canonicalWireCopy(value, path = 'value', seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || Object.is(value, -0)) {
      wireError(path, 'numbers must be finite and must not be negative zero');
    }
    return value;
  }
  if (typeof value === 'undefined' || typeof value === 'function'
    || typeof value === 'symbol' || typeof value === 'bigint') {
    wireError(path, `unsupported ${typeof value}`);
  }
  if (typeof value !== 'object') wireError(path, `unsupported ${typeof value}`);
  if (seen.has(value)) wireError(path, 'circular values are not allowed');
  seen.add(value);

  let copy;
  if (Array.isArray(value)) {
    const lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length');
    if (!lengthDescriptor || !Object.prototype.hasOwnProperty.call(lengthDescriptor, 'value')) {
      wireError(path, 'array length must be a data property');
    }
    const arrayLength = lengthDescriptor.value;
    for (const key of Reflect.ownKeys(value)) {
      if (key === 'length') continue;
      if (typeof key !== 'string' || !/^(0|[1-9]\d*)$/.test(key)
        || Number(key) >= arrayLength || Number(key) >= 2 ** 32 - 1) {
        wireError(path, 'arrays must contain only dense JSON index keys');
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !descriptor.enumerable
        || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
        wireError(`${path}[${key}]`, 'array entries must be enumerable data properties');
      }
    }
    copy = [];
    for (let index = 0; index < arrayLength; index += 1) {
      if (!Object.prototype.hasOwnProperty.call(value, index)) {
        wireError(`${path}[${index}]`, 'sparse arrays are not canonical JSON-wire data');
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      copy[index] = canonicalWireCopy(descriptor.value, `${path}[${index}]`, seen);
    }
  } else {
    if (!isPlainRecord(value) || Object.prototype.hasOwnProperty.call(value, 'toJSON')) {
      wireError(path, 'only plain records and arrays are allowed');
    }
    copy = Object.create(null);
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key !== 'string') {
        wireError(path, 'records must not contain symbol keys');
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor || !descriptor.enumerable
        || !Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
        wireError(`${path}.${key}`, 'record entries must be enumerable data properties');
      }
    }
    for (const key of Object.keys(value).sort()) {
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      copy[key] = canonicalWireCopy(descriptor.value, `${path}.${key}`, seen);
    }
  }
  seen.delete(value);
  return copy;
}

function canonicalWireSerialize(value, path = 'value') {
  const copy = canonicalWireCopy(value, path);
  return serializeCanonicalValue(copy);
}

function canonicalSceneResult(value) {
  try {
    const copy = canonicalWireCopy(value, 'scene result');
    return {
      copy,
      serialized: serializeCanonicalValue(copy),
    };
  } catch (error) {
    if (error instanceof SceneProjectionError && error.code === 'INVALID_SCENE_INPUT') {
      throw new SceneProjectionError('INVALID_SCENE_RESULT', error.message);
    }
    throw error;
  }
}

function serializeCanonicalValue(value) {
  if (value === null) return 'null';
  if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((child) => serializeCanonicalValue(child)).join(',')}]`;
  }
  return `{${Object.keys(value).sort().map((key) => (
    `${JSON.stringify(key)}:${serializeCanonicalValue(value[key])}`
  )).join(',')}}`;
}

function copyAndFreeze(value, path) {
  return deepFreeze(canonicalWireCopy(value, path));
}

function assertStateShape(state) {
  if (!isPlainRecord(state) || state.schemaVersion !== EPISODE_STATE_SCHEMA_VERSION) {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      'state must be a Plan 05 episode state',
    );
  }

  // Validate the complete input boundary, but deliberately discard this copy. The scene
  // must not carry instructional-history arrays even though the source state does.
  canonicalWireCopy(state, 'state');
  for (const key of SCENE_HISTORY_KEYS) {
    if (!Array.isArray(state[key])) {
      throw new SceneProjectionError('INVALID_SCENE_INPUT', `state.${key} must be an array`);
    }
  }
  if (state.episodeDefinition?.id === 'phase-4-fraction-distance') {
    projectPlan51Distance(state);
    return;
  }
  if (state.episodeDefinition?.id === 'phase-4-number-line-collection') {
    validatePlan50Context(state.taskContext);
    if (state.episodeDefinition.revision !== '1' || JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN50_CONDITION) || !((state.status === 'active' && state.beat === 'place-collection' && state.schedulePosition === 0) || (state.status === 'resolved' && state.beat === 'resolve' && state.schedulePosition === 1))) throw new SceneProjectionError('INVALID_SCENE_INPUT','invalid collection state');
    return;
  }
  if (isPlan45ComparisonEpisode(state)) {
    if (state.episodeDefinition.revision === '2') validatePlan49Context(state.taskContext);
    else validatePlan45ComparisonContext(state.taskContext);
    if (!Array.isArray(state.beatSchedule)
      || state.beatSchedule.length !== 2
      || state.beatSchedule[0]?.id !== 'compare'
      || state.beatSchedule[1]?.id !== 'resolve'
      || !['compare', 'resolve'].includes(state.beat)
      || (state.status === 'active' && (state.beat !== 'compare' || state.schedulePosition !== 0))
      || (state.status === 'resolved' && (state.beat !== 'resolve' || state.schedulePosition !== 1))) {
      throw new SceneProjectionError('INVALID_SCENE_INPUT', 'Plan 45 comparison schedule is malformed');
    }
    try {
      validateActiveCondition(state.activeCondition);
    } catch (error) {
      throw new SceneProjectionError('INVALID_SCENE_INPUT', `active condition is invalid: ${error.message}`);
    }
    if (JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION)) {
      throw new SceneProjectionError('INVALID_SCENE_INPUT', 'Plan 45 requires its registered static comparison condition');
    }
    return;
  }
  if (!state.content || typeof state.content !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'state.content is required');
  }
  if (!state.episodeDefinition || typeof state.episodeDefinition !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'state.episodeDefinition is required');
  }
  if (!state.activeCondition || typeof state.activeCondition !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'state.activeCondition is required');
  }
  if (!Array.isArray(state.beatSchedule)
    || !Number.isInteger(state.schedulePosition)
    || state.schedulePosition < 0
    || state.schedulePosition >= state.beatSchedule.length) {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'state must carry a valid active schedule position');
  }
  const scheduleEntry = currentScheduleEntry(state);
  if (!scheduleEntry || scheduleEntry.kind !== state.beat
    || typeof scheduleEntry.id !== 'string') {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', 'active beat must match its schedule entry');
  }
  try {
    validateActiveCondition(state.activeCondition);
  } catch (error) {
    throw new SceneProjectionError('INVALID_SCENE_INPUT', `active condition is invalid: ${error.message}`);
  }
}

function assertProjectionOptions({ representationRole, presentationMode, isReplaying = false }) {
  if (!REPRESENTATION_ROLES.includes(representationRole)) {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      `unsupported representation role: ${String(representationRole)}`,
    );
  }
  if (!PRESENTATION_MODES.includes(presentationMode)) {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      `unsupported presentation mode: ${String(presentationMode)}`,
    );
  }
  if (typeof isReplaying !== 'boolean') {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      `isReplaying must be a boolean: ${String(isReplaying)}`,
    );
  }
}

function contentIdentity(state) {
  if (isPlan45ComparisonEpisode(state)) return makePlan45ComparisonContentIdentity(state.taskContext);
  try {
    return copyAndFreeze(makeContentIdentity(state.content), 'content identity');
  } catch (error) {
    if (error instanceof SceneProjectionError) throw error;
    throw new SceneProjectionError('INVALID_SCENE_INPUT', `content identity is invalid: ${error.message}`);
  }
}

function currentSupportConsequence(state) {
  const lastHelp = state.helpHistory.at(-1) ?? null;
  const isPremiseCheck = state.beat === 'reflect'
    && state.activeCondition?.connectionMaking === 'CM-01-P';
  const premiseComparison = isPremiseCheck
    ? (state.support.dimensions.fractionBarModel === 'high support'
      ? 'paired-bars'
      : 'new-bar-with-source-reference')
    : null;
  return {
    nextResponseSupport: state.nextResponseSupport ?? null,
    premiseComparison,
    lastHelp: lastHelp
      ? {
        type: lastHelp.type,
        level: lastHelp.level,
        beat: lastHelp.beat,
      }
      : null,
    decideHelpRequested: state.helpHistory.some((entry) => entry.type === 'help' && entry.beat === 'decide')
      || state.supportHistory.some((entry) => entry.type === 'task-help-request'
        && entry.beat === 'decide'),
  };
}

function sceneTaskIdentity(state) {
  if (!state.taskContext) return null;
  const context = state.taskContext;
  if (isPlan45ComparisonEpisode(state)) return {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
    itemId: context.itemId,
    authoringRevision: context.authoringRevision,
    definitionId: context.definitionId,
    definitionRevision: context.definitionRevision,
    recipeId: context.recipeId,
    recipeRevision: context.recipeRevision,
    taskDataId: context.taskDataId,
    taskDataRevision: context.taskDataRevision,
    sourceForms: context.sourceForms,
    teachingIntentId: context.teachingIntentId,
    cueId: context.cueId,
  };
  if (isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)) return {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
    itemId: context.itemId,
    fixtureId: context.fixtureId,
    authoringRevision: context.authoringRevision,
    definitionId: context.definitionId,
    definitionRevision: context.definitionRevision,
    taskDataId: context.taskDataId,
    taskDataRevision: context.taskDataRevision,
    recipeId: context.recipeId,
    recipeRevision: context.recipeRevision,
    supportMode: context.supportMode,
  };
  if (state.episodeDefinition?.id === 'phase-3-reusable-addition-recipes'
    || state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes') return {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
    itemId: context.itemId,
    fixtureId: context.fixtureId,
    authoringRevision: context.authoringRevision,
    definitionId: context.definitionId,
    definitionRevision: context.definitionRevision,
    patternId: context.patternId,
    patternRevision: context.patternRevision,
    targetDenominator: context.targetDenominator,
    taskDataId: context.taskDataId,
    taskDataRevision: context.taskDataRevision,
    stimulusId: context.stimulusId,
    stimulusRevision: context.stimulusRevision,
    ...(!['full-addition.identify-side-construct', 'unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(context.patternId)
      ? { requiredSides: context.requiredSides } : {}),
  };
  if (state.episodeDefinition?.id === 'phase-3-nested-renaming-addition') return {
    practiceSetId: context.practiceSetId, practiceSetRevision: context.practiceSetRevision,
    itemId: context.itemId, fixtureId: context.fixtureId, authoringRevision: context.authoringRevision,
    definitionId: context.definitionId, definitionRevision: context.definitionRevision,
    targetDenominator: context.targetDenominator, taskDataId: context.taskDataId,
    taskDataRevision: context.taskDataRevision, sourceForms: context.sourceForms,
  };
  if (state.episodeDefinition?.id === 'phase-3-like-denominator-takeaway-subtraction') return {
    practiceSetId: context.practiceSetId, practiceSetRevision: context.practiceSetRevision,
    itemId: context.itemId, fixtureId: context.fixtureId, authoringRevision: context.authoringRevision,
    definitionId: context.definitionId, definitionRevision: context.definitionRevision,
    recipeId: context.recipeId, recipeRevision: context.recipeRevision,
    taskDataId: context.taskDataId, taskDataRevision: context.taskDataRevision,
    sourceForms: context.sourceForms,
  };
  return {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
    itemId: context.itemId,
    fixtureId: context.fixtureId,
    authoringRevision: context.authoringRevision,
    definitionId: context.definitionId,
    definitionRevision: context.definitionRevision,
    patternId: context.patternId,
    patternRevision: context.patternRevision,
    targetDenominator: context.targetDenominator,
    taskDataId: context.taskDataId,
    taskDataRevision: context.taskDataRevision,
    stimulusId: context.stimulusId,
    stimulusRevision: context.stimulusRevision,
    requiredSides: context.requiredSides,
  };
}

function currentTaskHelp(state) {
  const scheduleEntry = currentScheduleEntry(state);
  const request = state.supportHistory.find((entry) => (
    entry.type === 'task-help-request'
    && entry.scheduleEntryId === scheduleEntry?.id
  ));
  if (!request) return null;
  if (request.helpKind === 'number-line-location') return { kind: 'number-line-location', status: 'requested' };
  if (request.helpKind === 'like-denominator-takeaway'
    || (request.beat === 'operate' && ['phase-3-like-denominator-takeaway-subtraction', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition?.id))) {
    return { kind: 'like-denominator-takeaway', status: 'requested' };
  }
  if (request.helpKind === 'inspect-comparison-invariant') {
    return { kind: 'inspect-comparison-invariant', status: 'requested', side: scheduleEntry.side };
  }
  if (request.helpKind === 'renaming-side-comparison') {
    const multiplier = state.supportHistory.findLast((entry) => (
      entry.type === 'transform-help-multiplier' && entry.scheduleEntryId === scheduleEntry?.id
    ));
    return {
      kind: 'renaming-side-comparison',
      status: multiplier?.classification ?? 'requested',
      targetDenominator: state.taskContext.targetDenominator,
      acceptedMultiplier: multiplier?.classification === 'accepted' ? multiplier.proposed.numerator : null,
    };
  }
  const multiplier = state.supportHistory.findLast((entry) => (
    entry.type === 'transform-help-multiplier'
    && entry.scheduleEntryId === scheduleEntry.id
  ));
  if (request.beat === 'decide' && (state.episodeDefinition?.id === 'phase-3-nested-renaming-addition'
    || (state.episodeDefinition?.id === 'phase-3-reusable-addition-recipes'
      && state.taskContext.patternId === 'full-addition.identify-side-construct')
    || (state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes'
      && ['unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(state.taskContext?.patternId)))) {
    return { kind: 'renaming-side-comparison', status: 'requested', targetDenominator: state.taskContext.targetDenominator };
  }
  if (request.beat === 'decide') return { kind: 'common-denominator', status: 'requested' };
  if (request.beat === 'operate'
    && state.episodeDefinition?.id === 'phase-3-like-denominator-addition'
    && state.episodeDefinition?.revision === '1') {
    return { kind: 'like-denominator-operation', status: 'requested' };
  }
  return {
    kind: 'equivalent-fraction',
    status: multiplier?.classification ?? 'awaiting-multiplier',
    side: scheduleEntry.side,
    acceptedMultiplier: multiplier?.classification === 'accepted'
      ? multiplier.proposed.numerator
      : null,
  };
}

function instructionalSourceContext(state) {
  const scheduleEntry = currentScheduleEntry(state);
  return {
    schemaVersion: state.schemaVersion,
    revision: state.revision,
    status: state.status,
    beat: state.beat,
    schedulePosition: state.schedulePosition,
    scheduleEntryId: scheduleEntry.id,
    episodeDefinition: {
      id: state.episodeDefinition.id,
      revision: state.episodeDefinition.revision,
    },
    ...(state.taskContext ? { taskContext: sceneTaskIdentity(state) } : {}),
    activeCondition: state.activeCondition,
    support: state.support,
    expectedResponse: state.expectedResponse,
    established: state.established,
    supportConsequence: currentSupportConsequence(state),
    pendingResponse: state.pendingResponse,
    lastRecovery: state.lastRecovery,
  };
}

function contentProjectionSource(state) {
  if (isPlan45ComparisonEpisode(state)) {
    return { comparisonSourceForms: state.taskContext.sourceForms };
  }
  const facts = state.content.representationFacts;
  if (state.content.schemaVersion === 'fractionflow.bridge-instance/v1') {
    return {
      sourceForm: state.content.sourceForm,
      eligibility: facts.eligibility,
      alternateRepresentationRecommendation: facts.alternateRepresentationRecommendation,
    };
  }
  const resultEstablished = Boolean(
    state.established?.operation || state.established?.resolution,
  );
  return {
    operands: {
      left: {
        exactValue: state.content.operands.left.exactValue,
        initialForm: state.content.operands.left.initialForm,
        currentForm: state.content.operands.left.currentForm,
      },
      right: {
        exactValue: state.content.operands.right.exactValue,
        initialForm: state.content.operands.right.initialForm,
        currentForm: state.content.operands.right.currentForm,
      },
    },
    eligibility: facts.eligibility,
    alternateRepresentationRecommendation: facts.alternateRepresentationRecommendation,
    wholeSpan: resultEstablished ? facts.wholeSpan : null,
  };
}

function sourceContext({ state, representationRole, presentationMode, isReplaying = false }) {
  if (state.episodeDefinition?.id === 'phase-4-fraction-distance') return { distance: projectPlan51Distance(state), context: state.taskContext, revision: state.revision, representationRole, presentationMode, isReplaying };
  if (state.episodeDefinition?.id === 'phase-4-number-line-collection') return { collection: {taskContext:state.taskContext, revision:state.revision, placementRevision:state.placementRevision, selectedMemberId:state.selectedMemberId, placements:state.placements, evaluation:state.evaluation, status:state.status, support:state.support, activeCondition:state.activeCondition, helpRequested:state.assistanceHistory.length > 0}, representationRole,presentationMode,isReplaying };
  return {
    contentIdentity: contentIdentity(state),
    contentProjection: contentProjectionSource(state),
    instructional: instructionalSourceContext(state),
    representationRole,
    presentationMode,
    isReplaying: Boolean(isReplaying),
  };
}

function derivationContext(input) {
  const context = copyAndFreeze(
    sourceContext(input),
    'scene derivation source context',
  );
  return {
    sourceContext: context,
    key: canonicalWireSerialize(context, 'scene derivation source context'),
  };
}

function capabilityRefusal({
  state,
  role,
  verdict,
  reason,
  path = null,
  continuation = null,
  derivation,
}) {
  const refusal = {
    schemaVersion: SCENE_SCHEMA_VERSION,
    kind: 'capability-refusal',
    representationRole: role,
    status: reason === 'not-in-phase-2'
      ? 'not-in-phase-2'
      : 'valid-but-outside-representation-capability',
    verdict,
    path,
    continuation,
    sourceContext: derivation.sourceContext,
    derivationKey: derivation.key,
    contentId: state.content.id,
  };
  return deepFreeze(copyAndFreeze(refusal, 'scene capability refusal'));
}

function validVerdict(value, name) {
  if (!VALID_VERDICTS.includes(value)) {
    throw new SceneProjectionError(
      'UNRESOLVED_CAPABILITY',
      `${name} must be an explicit Plan 05 capability verdict`,
    );
  }
  return value;
}

function pathSummary(state) {
  const path = state.established?.commonDenominator;
  if (!path) return null;
  if (typeof path !== 'object' || path.rendering === undefined) {
    throw new SceneProjectionError(
      'UNRESOLVED_CAPABILITY',
      'established common-denominator path has no rendering verdict',
    );
  }
  const rendering = validVerdict(path.rendering, 'established path rendering');
  if (rendering === 'not-in-phase-2') {
    throw new SceneProjectionError(
      'INCONSISTENT_CAPABILITY',
      'a selected common-denominator path cannot be not-in-phase-2',
    );
  }
  return {
    kind: path.kind ?? null,
    validity: path.validity ?? null,
    targetDenominator: path.targetDenominator ?? null,
    rendering,
    authoredCoverage: path.authoredCoverage ?? null,
    scaleFactors: path.scaleFactors ?? null,
    continuation: path.continuation ?? null,
    reasons: path.reasons ?? [],
  };
}

function capabilityFor(state, role, derivation) {
  if (state.episodeDefinition?.id === 'phase-4-fraction-distance') return { instance: 'eligible', activePath: null, authoredCoverage: null, continuation: null };
  if (state.episodeDefinition?.id === 'phase-4-number-line-collection') { if (role !== 'number-line') throw new SceneProjectionError('UNRESOLVED_CAPABILITY','collection requires number-line'); return {instance:'eligible',activePath:null,authoredCoverage:null,continuation:null}; }
  if (isPlan45ComparisonEpisode(state)) {
    return { instance: 'eligible', activePath: null, authoredCoverage: null, continuation: null };
  }
  const key = REPRESENTATION_VERDICT_KEYS[role];
  const eligibility = state.content?.representationFacts?.eligibility;
  if (!eligibility || typeof eligibility !== 'object') {
    throw new SceneProjectionError(
      'UNRESOLVED_CAPABILITY',
      'content representation eligibility is missing',
    );
  }
  const instanceVerdict = validVerdict(eligibility[key], `content eligibility.${key}`);
  const path = pathSummary(state);

  if (role === 'number-line') {
    if (isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)
      && instanceVerdict === 'eligible') {
      return { instance: instanceVerdict, activePath: null, authoredCoverage: null, continuation: null };
    }
    if (instanceVerdict !== 'not-in-phase-2') {
      throw new SceneProjectionError(
        'INCONSISTENT_CAPABILITY',
        'number-line capability must be explicitly not-in-phase-2 in Plan 05',
      );
    }
    return capabilityRefusal({
      state,
      role,
      verdict: instanceVerdict,
      reason: 'not-in-phase-2',
      path,
      derivation,
    });
  }

  if (role === 'fraction-bar' && path?.rendering === 'ineligible') {
    const continuation = path.continuation === 'symbolic'
      ? { representationRole: 'symbolic', route: 'symbolic-continuation' }
      : null;
    return capabilityRefusal({
      state,
      role,
      verdict: path.rendering,
      reason: 'valid-but-outside-representation-capability',
      path,
      continuation,
      derivation,
    });
  }

  if (instanceVerdict === 'ineligible') {
    const continuation = state.content.representationFacts.alternateRepresentationRecommendation
      === 'symbolic-continuation'
      ? { representationRole: 'symbolic', route: 'symbolic-continuation' }
      : null;
    return capabilityRefusal({
      state,
      role,
      verdict: instanceVerdict,
      reason: 'valid-but-outside-representation-capability',
      path,
      continuation,
      derivation,
    });
  }

  if (instanceVerdict !== 'eligible') {
    throw new SceneProjectionError(
      'INCONSISTENT_CAPABILITY',
      `${role} cannot use the ${instanceVerdict} instance verdict`,
    );
  }

  return {
    instance: instanceVerdict,
    activePath: path,
    authoredCoverage: path?.authoredCoverage ?? null,
    continuation: path?.continuation ?? null,
  };
}

function wireFormFor(state, side) {
  const established = state.established?.conversions?.[side];
  return established ?? state.content.operands[side].currentForm;
}

function quantityScene(state, side) {
  const operand = state.content.operands[side];
  const currentForm = wireFormFor(state, side);
  if (!currentForm || currentForm.kind !== 'fraction') {
    throw new SceneProjectionError(
      'INVALID_SCENE_INPUT',
      `${side} current form must be a fraction wire value`,
    );
  }
  return {
    id: side,
    quantity: {
      exactValue: operand.exactValue,
    },
    sourceForm: operand.initialForm,
    currentForm,
    unit: {
      denominator: currentForm.denominator,
    },
    count: {
      numerator: currentForm.numerator,
    },
    whole: {
      kind: 'stable-unit-whole',
      id: `${side}-stable-whole`,
      extent: {
        lowerWhole: '0',
        upperWhole: '1',
      },
    },
  };
}

function taskMeaning(state) {
  const expected = state.expectedResponse;
  const scheduleEntry = currentScheduleEntry(state);
  const connectionForm = state.beat === 'reflect'
    ? (state.activeCondition?.connectionMaking === 'CM-01-P' ? 'premise' : 'matching')
    : null;
  if (isPlan45ComparisonEpisode(state)) return {
    beat: state.beat,
    schedulePosition: state.schedulePosition,
    scheduleEntryId: scheduleEntry.id,
    responsibility: expected?.responsibility ?? null,
    promptId: expected?.promptId ?? null,
    inputKind: expected?.inputKind ?? null,
    target: null,
    evidenceCategory: 'supported-construction',
    itemId: state.taskContext.itemId,
    definitionRevision: state.episodeDefinition.revision,
    recipeId: state.taskContext.recipeId,
    recipeRevision: state.taskContext.recipeRevision,
  };
  if (isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)) {
    return {
      beat: state.beat,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: scheduleEntry.id,
      responsibility: expected?.responsibility ?? null,
      promptId: expected?.promptId ?? null,
      inputKind: expected?.inputKind ?? null,
      target: null,
      evidenceCategory: expected?.evidenceCategory ?? 'supported-construction',
      connectionForm: null,
      itemId: state.taskContext.itemId,
      ...(state.episodeDefinition.revision === '2' ? { definitionRevision: state.episodeDefinition.revision } : {}),
      recipeId: state.taskContext.recipeId,
      recipeRevision: state.taskContext.recipeRevision,
    };
  }
  if (!expected) {
    return {
      beat: state.beat,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: scheduleEntry.id,
      responsibility: null,
      promptId: null,
      inputKind: null,
      target: null,
      evidenceCategory: null,
      connectionForm,
      ...(state.episodeDefinition?.id === 'phase-3-like-denominator-takeaway-subtraction' && state.taskContext ? {
        recipeId: state.taskContext.recipeId,
        recipeRevision: state.taskContext.recipeRevision,
        itemId: state.taskContext.itemId,
      } : state.taskContext ? (state.episodeDefinition.id === 'phase-3-nested-renaming-addition'
        ? { targetDenominator: state.taskContext.targetDenominator }
        : {
            patternId: state.taskContext.patternId,
            targetDenominator: state.taskContext.targetDenominator,
            ...(['full-addition.identify-side-construct', 'unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(state.taskContext.patternId)
              && (state.beat === 'transform' || state.established?.selectedRenamingSide)
              ? { selectedSide: state.established.selectedRenamingSide }
              : {}),
          }) : {}),
    };
  }
  return {
    beat: state.beat,
    schedulePosition: state.schedulePosition,
    scheduleEntryId: scheduleEntry.id,
    responsibility: expected.responsibility,
    promptId: expected.promptId,
    inputKind: expected.inputKind,
    target: expected.target ?? null,
    evidenceCategory: expected.evidenceCategory,
    connectionForm,
    ...(state.episodeDefinition?.id === 'phase-3-like-denominator-takeaway-subtraction' && state.taskContext ? {
      recipeId: state.taskContext.recipeId,
      recipeRevision: state.taskContext.recipeRevision,
      itemId: state.taskContext.itemId,
    } : state.taskContext && state.episodeDefinition.id === 'phase-3-nested-renaming-addition' ? {
      targetDenominator: state.taskContext.targetDenominator,
      ...(state.beat === 'transform' || state.established.selectedRenamingSide ? { selectedSide: state.established.selectedRenamingSide } : {}),
    } : state.taskContext ? {
      patternId: state.taskContext.patternId,
      targetDenominator: state.taskContext.targetDenominator,
      ...(['full-addition.identify-side-construct', 'unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(state.taskContext.patternId)
        && (state.beat === 'transform' || state.established?.selectedRenamingSide)
        ? { selectedSide: state.established.selectedRenamingSide }
        : {}),
      candidate: expected.inputKind === 'inspect-candidate' ? state.taskContext.candidates[expected.target] : null,
    } : {}),
  };
}

function candidateDenominatorsMeaning(state) {
  if (state.beat !== 'decide') return null;
  if (state.episodeDefinition?.id === 'phase-3-nested-renaming-addition'
    && state.episodeDefinition?.revision === '1') return null;
  if (state.episodeDefinition?.id === 'phase-3-reusable-addition-recipes'
    && state.episodeDefinition?.revision === '1'
    && state.taskContext.patternId === 'full-addition.identify-side-construct') return null;
  if (state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes'
    && state.episodeDefinition?.revision === '1'
    && ['unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(state.taskContext?.patternId)) return null;
  const supportLevel = state.support?.dimensions?.commonDenominator;
  if (supportLevel !== 'high support') return null;
  return candidateDenominatorsForInstance(state.content);
}

function commonUnitMeaning(state) {
  const sharedUnit = state.established?.sharedUnit;
  if (sharedUnit) {
    if (sharedUnit.kind !== 'already-shared-unit'
      || sharedUnit.source !== 'validated-equal-original-denominators'
      || !sharedUnit.targetDenominator
      || sharedUnit.targetDenominator !== state.content.operands.left.initialForm.denominator
      || sharedUnit.targetDenominator !== state.content.operands.right.initialForm.denominator) {
      throw new SceneProjectionError(
        'UNRESOLVED_CAPABILITY',
        'already-shared unit must match both validated original denominators',
      );
    }
    return {
      kind: 'already-shared-unit',
      source: sharedUnit.source,
      targetDenominator: sharedUnit.targetDenominator,
      validity: 'valid',
      mathClassification: 'already-shared-unit',
      rendering: 'eligible',
      authoredCoverage: 'not-required',
      scaleFactors: null,
    };
  }
  const commonDenominator = state.established?.commonDenominator;
  if (!commonDenominator) return null;
  if (commonDenominator.kind === 'authored-target-context') {
    return {
      kind: commonDenominator.kind,
      source: commonDenominator.source,
      targetDenominator: commonDenominator.targetDenominator,
      validity: 'valid',
      rendering: 'eligible',
      authoredCoverage: 'authored',
      scaleFactors: null,
    };
  }
  const targetDenominator = commonDenominator.targetDenominator;
  const classification = state.content.classification;
  const canonicalFactors = classification?.denominator?.canonicalScaleFactors;
  const alternate = classification?.transformations?.alternates?.find((path) => (
    Array.isArray(path) && path.length === 2
      && path.every((step) => step.toForm?.denominator === targetDenominator)
  ));
  const exactScaleFactors = targetDenominator === classification?.denominator?.leastCommonDenominator
    ? canonicalFactors
    : alternate
      ? { left: alternate[0].scaleFactor, right: alternate[1].scaleFactor }
      : null;
  return {
    targetDenominator,
    validity: commonDenominator.validity,
    kind: commonDenominator.kind,
    mathClassification: commonDenominator.mathClassification ?? null,
    rendering: commonDenominator.rendering,
    authoredCoverage: commonDenominator.authoredCoverage,
    scaleFactors: exactScaleFactors ?? commonDenominator.scaleFactors ?? null,
  };
}

function operationMeaning(state) {
  if (isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)) return null;
  if (state.episodeDefinition?.id === 'phase-3-like-denominator-takeaway-subtraction') {
    const isResolved = state.beat === 'resolve' && state.established?.operation;
    const acceptedForm = isResolved ? state.established.operation.submittedForm : null;
    return {
      operation: 'subtract',
      currentForms: {
        left: state.content.operands.left.initialForm,
        right: state.content.operands.right.initialForm,
      },
      rawResult: isResolved ? state.established.operation.proposed : null,
      resultWholeSpan: isResolved ? state.content.representationFacts.wholeSpan : null,
      preferredFinalForm: acceptedForm,
      simplifiedResult: null,
      acceptedResponseForm: acceptedForm,
    };
  }
  const isPlan40 = state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes';
  const operation = state.established?.operation;
  const resolution = state.established?.resolution;
  if (!operation && !resolution && !(isPlan40 && state.beat === 'operate')) {
    return {
      operation: state.content.request.operation,
      currentForms: null,
      rawResult: null,
      resultWholeSpan: null,
      preferredFinalForm: null,
      simplifiedResult: null,
      ...(isPlan17CrossingDefinition(state) ? { resultStack: null } : {}),
      ...(isPlan40 ? { acceptedResponseForm: null } : {}),
    };
  }

  const rawResult = operation?.proposed ?? null;
  const simplifiedResult = operation?.simplifiedResult ?? resolution?.simplifiedResult ?? null;

  const preserveNestedOriginal = (state.episodeDefinition?.id === 'phase-3-nested-renaming-addition'
    && state.episodeDefinition?.revision === '1')
    || (state.episodeDefinition?.id === 'phase-3-reusable-addition-recipes'
      && state.taskContext.patternId === 'full-addition.identify-side-construct')
    || (isPlan40
      && ['unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(state.taskContext?.patternId));
  return {
    operation: state.content.request.operation,
    currentForms: {
      left: state.established.sharedUnit
        ? state.content.operands.left.initialForm
        : state.established.conversions.left ?? (preserveNestedOriginal ? state.content.operands.left.initialForm : null),
      right: state.established.sharedUnit
        ? state.content.operands.right.initialForm
        : state.established.conversions.right ?? (preserveNestedOriginal ? state.content.operands.right.initialForm : null),
    },
    ...(['phase-3-nested-renaming-addition', 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id)
      && (state.episodeDefinition.id === 'phase-3-nested-renaming-addition'
        || ['full-addition.identify-side-construct', 'unlike-subtraction.identify-side-construct', 'full-subtraction.identify-side-construct'].includes(state.taskContext?.patternId)) ? { operandOrigins: {
      left: { kind: state.established.conversions.left ? 'learner-converted' : 'validated-original', performed: Boolean(state.established.conversions.left) },
      right: { kind: state.established.conversions.right ? 'learner-converted' : 'validated-original', performed: Boolean(state.established.conversions.right) },
    } } : {}),
    rawResult,
    resultWholeSpan: state.content.representationFacts.wholeSpan,
    preferredFinalForm: resolution?.proposed ?? (simplifiedResult || rawResult),
    simplifiedResult,
    ...(isPlan17CrossingDefinition(state)
      ? { resultStack: crossingResultStack(state, operation) }
      : {}),
    ...(isPlan40
      ? { acceptedResponseForm: state.beat === 'resolve' && operation?.submittedForm ? operation.submittedForm : null }
      : {}),
  };
}

function isPlan17CrossingDefinition(state) {
  return state.episodeDefinition?.id === 'phase-3-crossing-one-whole-addition-reflection'
    && state.episodeDefinition?.revision === '1';
}

function invalidCrossingStack(message) {
  throw new SceneProjectionError('UNRESOLVED_CAPABILITY', message);
}

function crossingResultStack(state, operation) {
  if (!operation?.proposed) return null;

  const rawResult = operation.proposed;
  const target = state.established?.commonDenominator?.targetDenominator;
  const span = state.content.representationFacts?.wholeSpan;
  const provenance = state.content.provenance;
  const validatedStack = crossingResultStackForIdentity(
    provenance?.fixtureId,
    provenance?.authoringRevision,
    target,
  );
  if (rawResult.kind !== 'fraction'
    || rawResult.denominator !== target
    || !/^(0|[1-9][0-9]*)$/.test(rawResult.numerator)
    || !/^[1-9][0-9]*$/.test(rawResult.denominator)
    || !['12', '24'].includes(target)
    || span?.lowerWhole !== '1'
    || span?.upperWhole !== '2'
    || !validatedStack) {
    invalidCrossingStack('crossing result is outside the registered two-whole stack capability');
  }
  if (JSON.stringify(rawResult) !== JSON.stringify(validatedStack.rawResult)
    || validatedStack.rows.length !== 2) {
    invalidCrossingStack('crossing result does not match the validated authored path');
  }

  return {
    kind: 'discrete-multi-whole',
    displayForm: validatedStack.rawResult,
    wholeSpan: span,
    wholeCount: String(validatedStack.rows.length),
    unitDenominator: target,
    rows: validatedStack.rows.map((row, index) => ({
      id: `whole-${index + 1}`,
      shadedUnits: row.numerator,
      unitCount: row.denominator,
    })),
  };
}

function transitionMeaning(state) {
  const lastConversion = state.established?.lastConversion;
  if (!lastConversion) return null;
  const provenanceIndex = state.responseProvenance.findIndex((entry) => {
    const candidate = entry?.resultingState?.established?.lastConversion;
    if (!candidate || candidate.side !== lastConversion.side
      || candidate.targetDenominator !== lastConversion.targetDenominator) {
      return false;
    }
    return canonicalWireSerialize(candidate.form, 'last conversion form')
      === canonicalWireSerialize(lastConversion.form, 'last conversion form');
  });
  if (provenanceIndex < 0) {
    throw new SceneProjectionError(
      'UNRESOLVED_TRANSITION',
      'the established conversion has no matching Plan 05 provenance record',
    );
  }
  const preceding = [...state.responseProvenance]
    .slice(0, provenanceIndex)
    .reverse()
    .find((entry) => entry?.resultingState?.established?.conversions);
  const precedingConversions = preceding?.resultingState?.established?.conversions;
  if (!precedingConversions
    || !Object.prototype.hasOwnProperty.call(precedingConversions, 'left')
    || !Object.prototype.hasOwnProperty.call(precedingConversions, 'right')) {
    throw new SceneProjectionError(
      'UNRESOLVED_TRANSITION',
      'the established conversion has no preceding Plan 05 endpoints',
    );
  }
  return {
    type: 'equivalent-renaming',
    status: 'known-endpoints',
    changed: [lastConversion.side],
    pre: {
      left: precedingConversions.left ?? state.content.operands.left.initialForm,
      right: precedingConversions.right ?? state.content.operands.right.initialForm,
    },
    post: {
      left: state.established.conversions.left ?? state.content.operands.left.initialForm,
      right: state.established.conversions.right ?? state.content.operands.right.initialForm,
    },
  };
}

function takeawayMeaning(state) {
  const isPlan36 = state.episodeDefinition?.id === 'phase-3-like-denominator-takeaway-subtraction'
    && state.episodeDefinition?.revision === '1';
  const isPlan40 = state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes'
    && state.episodeDefinition?.revision === '1';
  if (!isPlan36 && !isPlan40) return null;

  if (isPlan40 && ['encounter', 'decide', 'transform'].includes(state.beat)) {
    return null;
  }

  const sourceForms = isPlan40
    ? {
      left: wireFormFor(state, 'left'),
      right: wireFormFor(state, 'right'),
    }
    : (state.taskContext?.sourceForms ?? {
      left: state.content.operands.left.initialForm,
      right: state.content.operands.right.initialForm,
    });
  const den = Number(sourceForms.left.denominator);
  const leftNum = Number(sourceForms.left.numerator);
  const rightNum = Number(sourceForms.right.numerator);
  const isMarked = state.established?.subtractionRemoval === 'marked';
  const removalStatus = isMarked ? 'marked' : 'unmarked';

  const cells = Array.from({ length: den }, (_, index) => {
    let role;
    if (!isMarked) {
      role = index < leftNum ? 'starting' : 'outside-start';
    } else {
      if (index < leftNum - rightNum) {
        role = 'remaining';
      } else if (index < leftNum) {
        role = 'removed';
      } else {
        role = 'outside-start';
      }
    }
    return { index, role };
  });

  const acceptedResponseForm = state.beat === 'resolve' && state.established?.operation?.submittedForm
    ? state.established.operation.submittedForm
    : null;

  return {
    operation: 'subtract',
    wholePartitionCount: den,
    sourceForms,
    removalStatus,
    cells,
    acceptedResponseForm,
  };
}

function sceneMeaning(state, representationRole, capability) {
  if (state.episodeDefinition?.id === 'phase-4-fraction-distance') return { representationRole, capability, distance: projectPlan51Distance(state), status: { episode: state.status }, support: state.support };
  if (state.episodeDefinition?.id === 'phase-4-number-line-collection') {
    const c=state.taskContext; const {candidates}=admitPlan50Record({itemId:c.itemId,itemRevision:c.itemRevision,purpose:c.purpose,lattice:c.lattice,members:c.members});
    return {representationRole,capability,collection:{context:{setId:c.setId,setRevision:c.setRevision,itemId:c.itemId,itemRevision:c.itemRevision,definitionId:c.definitionId,definitionRevision:c.definitionRevision},members:c.members,candidates,lattice:c.lattice,selectedMemberId:state.selectedMemberId,placements:state.placements,placementRevision:state.placementRevision,evaluation:state.evaluation,status:state.status,helpRequested:state.assistanceHistory.length > 0,showPartitions:state.support.label === 'high support'}};
  }
  if (isPlan45ComparisonEpisode(state)) return plan45ComparisonMeaning(state, representationRole, capability);
  const isPlan37Bridge = isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition);
  const left = isPlan37Bridge ? null : quantityScene(state, 'left');
  const right = isPlan37Bridge ? null : quantityScene(state, 'right');
  const recovery = state.lastRecovery
    ? {
      beat: state.lastRecovery.beat,
      classification: state.lastRecovery.classification,
    }
    : null;
  const isPremise = state.beat === 'reflect' && state.activeCondition?.connectionMaking === 'CM-01-P';
  return {
    representationRole,
    condition: state.activeCondition,
    reflectionChoices: state.beat === 'reflect' && !isPremise
      ? reflectionChoicesForInstance(
        state.content,
        state.established?.commonDenominator?.targetDenominator,
      )
      : null,
    premiseCase: isPremise
      ? premiseCheckForInstance(
        state.content,
        state.established?.commonDenominator?.targetDenominator,
      )
      : null,
    quantities: isPlan37Bridge ? {
      source: {
        id: 'source',
        sourceForm: state.content.sourceForm,
        currentForm: state.content.sourceForm,
        unit: { denominator: state.content.sourceForm.denominator },
        count: { numerator: state.content.sourceForm.numerator },
        whole: { kind: 'stable-unit-whole', id: 'source-stable-whole', extent: { lowerWhole: '0', upperWhole: '1' } },
      },
    } : { left, right },
    unitRelationship: isPlan37Bridge ? null : {
      sourceDenominators: {
        left: left.unit.denominator,
        right: right.unit.denominator,
      },
      candidateDenominators: candidateDenominatorsMeaning(state),
      commonUnit: commonUnitMeaning(state),
      authoredCoverage: state.established?.commonDenominator?.authoredCoverage
        ?? (state.established?.sharedUnit ? 'not-required' : null),
    },
    currentTask: taskMeaning(state),
    availableAction: state.expectedResponse
      ? {
        responsibility: state.expectedResponse.responsibility,
        inputKind: state.expectedResponse.inputKind,
        target: state.expectedResponse.target ?? null,
        schedulePosition: state.schedulePosition,
        scheduleEntryId: currentScheduleEntry(state).id,
      }
      : null,
    status: {
      episode: state.status,
      recovery,
    },
    operation: operationMeaning(state),
    takeaway: isPlan37Bridge ? null : takeawayMeaning(state),
    transition: isPlan37Bridge ? null : transitionMeaning(state),
    capability,
    support: state.support,
    supportConsequence: currentSupportConsequence(state),
    taskHelp: currentTaskHelp(state),
    ...(isPlan37Bridge ? { numberLine: plan37NumberLineMeaning(state) } : {}),
  };
}

function plan45ComparisonMeaning(state, representationRole, capability) {
  const accepted = state.status === 'resolved' ? state.established.comparison : null;
  const lastHelp = [...state.assistanceHistory].reverse().find((entry) => entry.type === 'comparison-help-request') ?? null;
  return {
    representationRole,
    condition: state.activeCondition,
    reflectionChoices: null,
    premiseCase: null,
    quantities: { first: null, second: null },
    unitRelationship: null,
    currentTask: taskMeaning(state),
    availableAction: state.expectedResponse ? {
      responsibility: state.expectedResponse.responsibility,
      inputKind: state.expectedResponse.inputKind,
      target: null,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: currentScheduleEntry(state).id,
    } : null,
    status: {
      episode: state.status,
      recovery: state.lastRecovery ? { beat: 'compare', classification: state.lastRecovery.classification } : null,
    },
    operation: null,
    takeaway: null,
    transition: null,
    capability,
    support: state.support,
    supportConsequence: { nextResponseSupport: null, premiseComparison: null, lastHelp: null, decideHelpRequested: Boolean(lastHelp) },
    comparison: {
      sourceForms: state.taskContext.sourceForms,
      modelChoice: state.assistance.modelChoice,
      pairedVerificationVisible: Boolean(accepted),
      ...(accepted ? { acceptedRelation: accepted.acceptedRelation } : {}),
      reasoningCue: lastHelp?.helpKind === 'reasoning' ? (state.episodeDefinition.revision === '2' && state.taskContext.hintContext.kind === 'common-unit-target' ? 'Try naming both amounts with the same-size parts.' : plan45ComparisonHelpText({ ...state.taskContext, definitionRevision: '1' }, 'reasoning')) : null,
      notationCue: lastHelp?.helpKind === 'notation' ? plan45ComparisonHelpText({ ...state.taskContext, definitionRevision: '1' }, 'notation') : null,
      ...(state.episodeDefinition.revision === '2' ? { construction: projectPlan49PublicConstruction(state) } : {}),
    },
    taskHelp: null,
  };
}

function plan37NumberLineMeaning(state) {
  const instance = validatePlan37BarToLineBridgeInstance(state.content);
  const context = state.taskContext;
  const partitioned = context.supportMode === 'partitioned';
  if (state.episodeDefinition.revision === '2') {
    const exactScale = plan37ExactLocationScale(context);
    const benchmarks = [
      { label: '0', form: { kind: 'fraction', numerator: '0', denominator: '1' }, benchmarkRelation: 'exact-zero', selectable: false },
      { label: '1/2', form: { kind: 'fraction', numerator: '1', denominator: '2' }, benchmarkRelation: 'exact-half', selectable: false },
      { label: '1', form: { kind: 'fraction', numerator: '1', denominator: '1' }, benchmarkRelation: 'exact-one', selectable: false },
    ];
    if (partitioned && !exactScale.partitionHasHalfPoint) {
      benchmarks[1] = { ...benchmarks[1], kind: 'visual-reference-anchor' };
    }
    const accepted = state.beat === 'resolve'
      ? state.established.numberLineLocation?.acceptedPosition ?? null
      : null;
    const acceptedCandidate = accepted
      ? exactScale.positions.find(({ form }) => form.numerator === accepted.numerator && form.denominator === accepted.denominator)
      : null;
    const acceptedLocationDescription = acceptedCandidate
      ? `${acceptedCandidate.unitsFromZero} of ${acceptedCandidate.totalUnits} equal steps from 0 is ${accepted.numerator}/${accepted.denominator}.`
      : null;
    return {
      domain: { lowerWhole: '0', upperWhole: '1' },
      densityMode: context.supportMode,
      totalUnits: exactScale.totalUnits,
      scaleDescription: exactScale.scaleDescription,
      benchmarks,
      candidatePositions: exactScale.positions,
      acceptedPosition: accepted,
      acceptedLocationDescription,
      alignmentGuideVisible: state.beat === 'resolve',
    };
  }
  const benchmark = (label, form, selectable = false) => ({
    label,
    form,
    benchmarkRelation: classifyPlan37BenchmarkRelation(form),
    selectable,
  });
  const benchmarks = [
    benchmark('0', { kind: 'fraction', numerator: '0', denominator: '1' }),
    benchmark('1/2', { kind: 'fraction', numerator: '1', denominator: '2' }, false),
    benchmark('1', { kind: 'fraction', numerator: '1', denominator: '1' }),
  ];
  const candidatePositions = partitioned
    ? Array.from({ length: Number(context.partitionDenominator) + 1 }, (_, stepIndex) => {
      const form = { kind: 'fraction', numerator: String(stepIndex), denominator: context.partitionDenominator };
      return {
        id: `partition-${stepIndex}-of-${context.partitionDenominator}`,
        form,
        stepIndex,
        totalSteps: Number(context.partitionDenominator),
        benchmarkRelation: classifyPlan37BenchmarkRelation(form),
      };
    })
    : context.sparseCandidates.map((candidate, index) => ({
      id: candidate.id,
      form: candidate.form,
      stepIndex: index + 1,
      totalSteps: context.sparseCandidates.length,
      benchmarkRelation: classifyPlan37BenchmarkRelation(candidate.form),
      description: `Offered point ${String.fromCharCode(65 + index)}: ${benchmarkDescription(classifyPlan37BenchmarkRelation(candidate.form))}.`,
    }));
  const oddThirds = partitioned && context.partitionDenominator === '3';
  if (oddThirds) benchmarks[1] = { ...benchmarks[1], selectable: false, kind: 'visual-reference-anchor' };
  const accepted = state.beat === 'resolve'
    ? state.established.numberLineLocation?.acceptedPosition ?? null
    : null;
  return {
    domain: { lowerWhole: '0', upperWhole: '1' },
    densityMode: context.supportMode,
    benchmarks,
    candidatePositions,
    acceptedPosition: accepted,
    alignmentGuideVisible: state.beat === 'resolve',
  };
}

function benchmarkDescription(relation) {
  const descriptions = {
    'exact-zero': 'at zero',
    'exact-half': 'at one half',
    'exact-one': 'at one',
    'between-0-and-half/closer-to-zero': 'between zero and one half, closer to zero',
    'between-0-and-half/closer-to-half': 'between zero and one half, closer to one half',
    'between-0-and-half/midway': 'between zero and one half, halfway between them',
    'between-half-and-1/closer-to-half': 'between one half and one, closer to one half',
    'between-half-and-1/closer-to-one': 'between one half and one, closer to one',
    'between-half-and-1/midway': 'between one half and one, halfway between them',
  };
  return descriptions[relation] ?? 'between zero and one';
}

function assertNoSceneHistory(scene) {
  for (const key of SCENE_HISTORY_KEYS) {
    if (Object.prototype.hasOwnProperty.call(scene, key)) {
      throw new SceneProjectionError('INVALID_SCENE_INPUT', `scene must not carry ${key}`);
    }
  }
}

function choreographyDirectiveFor(activeCondition) {
  switch (activeCondition?.choreography) {
    case 'D-02-J':
      return 'juxtaposed';
    case 'D-02-S':
      return 'sequential';
    case 'D-02-M':
    default:
      return 'in-place';
  }
}

export function projectScene({ state, representationRole, presentationMode, isReplaying = false } = {}) {
  assertStateShape(state);
  assertProjectionOptions({ representationRole, presentationMode, isReplaying });
  const derivation = derivationContext({ state, representationRole, presentationMode, isReplaying });
  const capability = capabilityFor(state, representationRole, derivation);
  if (capability.kind === 'capability-refusal') return capability;

  const scene = {
    schemaVersion: SCENE_SCHEMA_VERSION,
    kind: 'scene',
    meaning: sceneMeaning(state, representationRole, capability),
    presentation: {
      mode: presentationMode,
      choreography: choreographyDirectiveFor(state.activeCondition),
      isReplaying: Boolean(isReplaying),
    },
    derivation,
  };
  const frozen = deepFreeze(copyAndFreeze(scene, 'scene'));
  assertNoSceneHistory(frozen);
  return frozen;
}

export function assertSceneCurrent(sceneResult, { state, representationRole, presentationMode, isReplaying = false } = {}) {
  if (!sceneResult || typeof sceneResult !== 'object') {
    throw new SceneProjectionError('INVALID_SCENE_RESULT', 'scene result is required');
  }
  assertStateShape(state);
  assertProjectionOptions({ representationRole, presentationMode, isReplaying });
  const current = derivationContext({ state, representationRole, presentationMode, isReplaying });
  const supplied = canonicalSceneResult(sceneResult);
  const sceneKey = supplied.copy.derivation?.key ?? supplied.copy.derivationKey;
  if (sceneKey !== current.key) {
    throw new SceneProjectionError(
      'STALE_SCENE',
      'scene derivation does not match the current upstream state',
      { expected: current.key, actual: sceneKey ?? null },
    );
  }

  const expected = projectScene({ state, representationRole, presentationMode, isReplaying });
  const expectedCanonical = canonicalWireSerialize(expected, 'expected scene result');
  if (supplied.serialized !== expectedCanonical) {
    throw new SceneProjectionError(
      'SCENE_INTEGRITY',
      'scene result payload does not match the canonical projection for the current inputs',
    );
  }
  return expected;
}

export function isSceneCurrent(sceneResult, input) {
  try {
    assertSceneCurrent(sceneResult, input);
    return true;
  } catch (error) {
    if (error instanceof SceneProjectionError && error.code === 'STALE_SCENE') return false;
    throw error;
  }
}
