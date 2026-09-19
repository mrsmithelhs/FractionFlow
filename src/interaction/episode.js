import {
  evaluateInstanceEligibility,
  evaluateProposedPathEligibility,
} from '../content/eligibility.js';
import { validateProblemInstance } from '../content/validation.js';
import {
  deepFreeze,
} from '../content/schema.js';
import {
  classifyCommonDenominatorResponse,
  classifyConversionResponseForEpisode,
  classifyNoticeResponse,
  classifyOperationResponseForEpisode,
  classifyResolutionResponse,
} from './classification.js';
import {
  EPISODE_BEATS,
  PHASE2_ACTIVE_CONDITION,
  PHASE2_EPISODE_DEFINITION,
  validateActiveCondition,
} from './episode-definition.js';
import { createResponseProvenance } from './provenance.js';
import {
  createSupportConfiguration,
  DEFAULT_SUPPORT_CONFIGURATION,
  HELP_LEVELS,
} from './support.js';

export class EpisodeConstructionError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'EpisodeConstructionError';
    this.code = code;
    this.details = details;
  }
}

export class EpisodeIntentError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'EpisodeIntentError';
    this.code = code;
  }
}

function responseForBeat(definition, beat, state) {
  const common = {
    promptId: definition.promptIdentities[beat],
    beat,
    evidenceCategory: 'supported-construction',
  };
  if (beat === 'encounter') return { ...common, responsibility: 'inspect-expression', inputKind: 'acknowledge' };
  if (beat === 'notice') return { ...common, responsibility: 'identify-unit-relationship', inputKind: 'unit-match-choice' };
  if (beat === 'decide') return { ...common, responsibility: 'choose-common-denominator', inputKind: 'whole-fraction' };
  if (beat === 'transform') {
    const side = state.established.conversions.left === null ? 'left' : 'right';
    return {
      ...common,
      responsibility: 'construct-equivalent-form',
      inputKind: 'fraction',
      target: side,
      evidenceCategory: 'prediction',
    };
  }
  if (beat === 'operate') return { ...common, responsibility: 'combine-like-units', inputKind: 'fraction' };
  if (beat === 'resolve') return { ...common, responsibility: 'settle-final-form', inputKind: 'fraction' };
  return { ...common, responsibility: 'inspect-invariant', inputKind: 'structured-choice' };
}

function assertDefinition(definition) {
  if (!definition || definition.id !== PHASE2_EPISODE_DEFINITION.id
    || definition.revision !== PHASE2_EPISODE_DEFINITION.revision) {
    throw new EpisodeConstructionError('UNKNOWN_EPISODE_DEFINITION', 'unsupported episode definition');
  }
  if (JSON.stringify(definition.beats) !== JSON.stringify(EPISODE_BEATS)) {
    throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', 'episode beats do not match the approved grammar');
  }
  return deepFreeze(definition);
}

function assertInstance(instance) {
  const validation = validateProblemInstance(instance);
  if (!validation.valid) {
    throw new EpisodeConstructionError(
      'INVALID_CONTENT_INSTANCE',
      'episode construction requires a valid content instance',
      { errors: validation.errors, checks: validation.checks.filter((check) => !check.valid) },
    );
  }
  if (instance.request.selector !== PHASE2_EPISODE_DEFINITION.selector
    || instance.request.operation !== PHASE2_EPISODE_DEFINITION.operation) {
    throw new EpisodeConstructionError('UNSUPPORTED_CONTENT_FAMILY', 'content instance is outside the Phase 2 episode family');
  }
  const eligibility = evaluateInstanceEligibility(instance);
  if (eligibility.eligibility.fractionBar !== 'eligible') {
    throw new EpisodeConstructionError(
      'INELIGIBLE_BASE_REPRESENTATION',
      'canonical fraction-bar capability is required before episode construction',
      { eligibility },
    );
  }
  return instance;
}

function stateSnapshot(state) {
  return {
    encounter: state.established.encounter,
    notice: state.established.notice,
    commonDenominator: state.established.commonDenominator,
    conversions: state.established.conversions,
    operation: state.established.operation,
    resolution: state.established.resolution,
    reflection: state.established.reflection,
    route: state.established.route,
  };
}

function completedBeat(state, beat, established, nextBeat) {
  const completed = [
    ...state.completedBeats,
    { beat, established },
  ];
  const next = {
    ...state,
    beat: nextBeat,
    expectedResponse: responseForBeat(state.episodeDefinition, nextBeat, state),
    completedBeats: completed,
    revision: state.revision + 1,
    lastRecovery: null,
    pendingResponse: null,
  };
  return next;
}

function resolvedState(state, beat, established) {
  const establishedState = {
    ...state.established,
    ...(beat === 'resolve' ? { resolution: established } : {}),
    ...(beat === 'reflect' ? { reflection: established } : {}),
  };
  return {
    ...state,
    status: 'resolved',
    beat,
    expectedResponse: null,
    established: establishedState,
    completedBeats: [...state.completedBeats, { beat, established }],
    revision: state.revision + 1,
    lastRecovery: null,
    pendingResponse: null,
  };
}

function appendIntent(state, intent) {
  return {
    ...state,
    intentHistory: [...state.intentHistory, intent],
    revision: state.revision + 1,
  };
}

function recovery(state, intent, classification) {
  const next = appendIntent(state, intent);
  const responseState = {
    ...next,
    lastRecovery: {
      beat: state.beat,
      classification,
      clearedPendingResponse: true,
    },
    retryHistory: [...next.retryHistory, { beat: state.beat, reason: classification.kind }],
    pendingResponse: null,
    nextResponseSupport: state.nextResponseSupport,
  };
  const provenance = createResponseProvenance({
    state,
    intent,
    classification,
    nextState: responseState,
  });
  return deepFreeze({
    ...responseState,
    responseProvenance: [...state.responseProvenance, provenance],
  });
}

function assessedSuccess(state, intent, classification, next) {
  const withIntent = appendIntent(state, intent);
  const nextState = {
    ...next,
    revision: withIntent.revision,
    intentHistory: withIntent.intentHistory,
    nextResponseSupport: null,
  };
  const provenance = createResponseProvenance({
    state,
    intent,
    classification,
    nextState,
  });
  return deepFreeze({
    ...nextState,
    responseProvenance: [...state.responseProvenance, provenance],
  });
}

function nextHelpLevel(state) {
  const used = state.helpHistory.map((entry) => entry.level);
  return HELP_LEVELS.find((level) => !used.includes(level)) ?? HELP_LEVELS.at(-1);
}

function handleHelp(state, intent) {
  const level = nextHelpLevel(state);
  const nextSupport = {
    type: 'help',
    level,
    beat: state.beat,
  };
  const next = appendIntent(state, intent);
  return deepFreeze({
    ...next,
    helpHistory: [...next.helpHistory, nextSupport],
    supportHistory: [...next.supportHistory, nextSupport],
    nextResponseSupport: level === 'demonstrate' ? 'demonstrate' : null,
  });
}

function handleReplay(state, intent) {
  const entry = { type: 'replay', beat: state.beat };
  const next = appendIntent(state, intent);
  return deepFreeze({
    ...next,
    replayHistory: [...next.replayHistory, entry],
    supportHistory: [...next.supportHistory, entry],
  });
}

function handleEncounter(state, intent) {
  if (intent.type !== 'acknowledge-encounter') return null;
  const established = { acknowledged: true };
  const next = completedBeat(
    state,
    'encounter',
    established,
    'notice',
  );
  return assessedSuccess(state, intent, { kind: 'encounter-acknowledged' }, {
    ...next,
    established: { ...next.established, encounter: established },
  });
}

function handleNotice(state, intent) {
  if (intent.type !== 'submit-notice') return null;
  const classification = classifyNoticeResponse(state.content, intent.matchesUnits);
  if (classification.kind !== 'correct') return recovery(state, intent, classification);
  const established = {
    ...classification,
    relationship: state.content.classification.denominator.relationship,
  };
  const next = completedBeat(state, 'notice', established, 'decide');
  return assessedSuccess(state, intent, classification, {
    ...next,
    established: { ...next.established, notice: established },
  });
}

function handleDecide(state, intent) {
  if (intent.type !== 'propose-common-denominator') return null;
  const classification = classifyCommonDenominatorResponse(state.content, intent.proposed);
  if (classification.kind === 'invalid-common-denominator') return recovery(state, intent, classification);
  const established = {
    ...classification,
    proposed: intent.proposed,
    route: classification.kind === 'valid-but-outside-representation-capability'
      ? 'symbolic-continuation'
      : 'episode-definition',
  };
  const next = completedBeat(state, 'decide', established, 'transform');
  return assessedSuccess(state, intent, classification, {
    ...next,
    established: { ...next.established, commonDenominator: established, route: established.route },
    nextResponseSupport: null,
  });
}

function handleTransform(state, intent) {
  if (intent.type !== 'submit-equivalent-form') return null;
  const targetDenominator = state.established.commonDenominator.targetDenominator;
  const side = state.expectedResponse.target;
  const classification = classifyConversionResponseForEpisode({
    instance: state.content,
    targetDenominator,
    side,
    proposed: intent.proposed,
  });
  if (classification.kind !== 'correct-equivalent-form') return recovery(state, intent, classification);
  const establishedConversions = {
    ...state.established.conversions,
    [side]: intent.proposed,
  };
  const established = {
    side,
    form: intent.proposed,
    targetDenominator,
    supportOrigin: state.nextResponseSupport ?? 'learner',
  };
  const bothComplete = establishedConversions.left !== null && establishedConversions.right !== null;
  const next = bothComplete
    ? completedBeat(state, 'transform', establishedConversions, 'operate')
    : {
      ...state,
      established: { ...state.established, conversions: establishedConversions },
      expectedResponse: responseForBeat(state.episodeDefinition, 'transform', {
        ...state,
        established: { ...state.established, conversions: establishedConversions },
      }),
      revision: state.revision + 1,
      lastRecovery: null,
      pendingResponse: null,
    };
  return assessedSuccess(state, intent, classification, {
    ...next,
    established: {
      ...next.established,
      conversions: establishedConversions,
      lastConversion: established,
    },
    nextResponseSupport: null,
  });
}

function handleOperate(state, intent) {
  if (intent.type !== 'submit-operation-result') return null;
  const targetDenominator = state.established.commonDenominator.targetDenominator;
  const classification = classifyOperationResponseForEpisode({
    instance: state.content,
    targetDenominator,
    convertedLeft: state.established.conversions.left,
    convertedRight: state.established.conversions.right,
    proposed: intent.proposed,
  });
  if (classification.validity !== 'valid') return recovery(state, intent, classification);
  const established = {
    ...classification,
    proposed: intent.proposed,
    targetDenominator,
  };
  const next = completedBeat(state, 'operate', established, 'resolve');
  return assessedSuccess(state, intent, classification, {
    ...next,
    established: { ...next.established, operation: established },
    nextResponseSupport: null,
  });
}

function handleResolve(state, intent) {
  if (intent.type !== 'submit-resolution') return null;
  const targetDenominator = state.established.commonDenominator.targetDenominator;
  const classification = classifyResolutionResponse({
    instance: state.content,
    targetDenominator,
    proposed: intent.proposed,
  });
  if (classification.validity !== 'valid') return recovery(state, intent, classification);
  const established = {
    ...classification,
    proposed: intent.proposed,
  };
  if (state.episodeDefinition.includeReflection) {
    const next = completedBeat(state, 'resolve', established, 'reflect');
    return assessedSuccess(state, intent, classification, {
      ...next,
      established: { ...next.established, resolution: established },
      nextResponseSupport: null,
    });
  }
  return assessedSuccess(
    state,
    intent,
    classification,
    resolvedState(state, 'resolve', established),
  );
}

function handleReflect(state, intent) {
  if (intent.type !== 'submit-reflection') return null;
  if (typeof intent.response !== 'string' || intent.response.length === 0) {
    throw new EpisodeIntentError('INVALID_REFLECTION_RESPONSE', 'reflection response must be a stable choice identity');
  }
  const established = { response: intent.response };
  return assessedSuccess(
    state,
    intent,
    { kind: 'reflection-recorded' },
    resolvedState(state, 'reflect', established),
  );
}

const INTENT_KEYS = Object.freeze({
  'acknowledge-encounter': ['type'],
  'submit-notice': ['type', 'matchesUnits'],
  'propose-common-denominator': ['type', 'proposed'],
  'submit-equivalent-form': ['type', 'proposed'],
  'submit-operation-result': ['type', 'proposed'],
  'submit-resolution': ['type', 'proposed'],
  'submit-reflection': ['type', 'response'],
  'request-help': ['type'],
  'request-replay': ['type'],
});

const INTENT_BEATS = Object.freeze({
  'acknowledge-encounter': 'encounter',
  'submit-notice': 'notice',
  'propose-common-denominator': 'decide',
  'submit-equivalent-form': 'transform',
  'submit-operation-result': 'operate',
  'submit-resolution': 'resolve',
  'submit-reflection': 'reflect',
});

function isPlainRecord(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertExactKeys(value, expectedKeys, name) {
  if (!isPlainRecord(value)) {
    throw new EpisodeIntentError('INVALID_INTENT_SHAPE', `${name} must be a plain object`);
  }
  const actualKeys = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expected)) {
    throw new EpisodeIntentError('INVALID_INTENT_SHAPE', `${name} has an unsupported shape`);
  }
}

function assertWireFraction(value, name) {
  assertExactKeys(value, ['kind', 'numerator', 'denominator'], name);
  if (value.kind !== 'fraction'
    || typeof value.numerator !== 'string'
    || typeof value.denominator !== 'string'
    || value.numerator.length === 0
    || value.denominator.length === 0) {
    throw new EpisodeIntentError('INVALID_INTENT_SHAPE', `${name} must be a fraction wire value`);
  }
  try {
    BigInt(value.numerator);
    BigInt(value.denominator);
  } catch (error) {
    throw new EpisodeIntentError('INVALID_INTENT_SHAPE', `${name} must contain integer strings`);
  }
}

function assertCanonicalWireValue(value, name, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new EpisodeIntentError('NON_JSON_INTENT', `${name} must not contain non-finite numbers`);
    }
    return;
  }
  if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
    throw new EpisodeIntentError('NON_JSON_INTENT', `${name} contains a value that is not JSON wire data`);
  }
  if (typeof value !== 'object') {
    throw new EpisodeIntentError('NON_JSON_INTENT', `${name} contains an unsupported value`);
  }
  if (seen.has(value)) throw new EpisodeIntentError('NON_JSON_INTENT', `${name} must not be circular`);
  seen.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertCanonicalWireValue(entry, `${name}[${index}]`, seen));
  } else {
    if (!isPlainRecord(value) || Object.prototype.hasOwnProperty.call(value, 'toJSON')) {
      throw new EpisodeIntentError('NON_JSON_INTENT', `${name} must contain only plain records and arrays`);
    }
    Object.entries(value).forEach(([key, entry]) => assertCanonicalWireValue(entry, `${name}.${key}`, seen));
  }
  seen.delete(value);
}

function assertIntentShape(intent) {
  if (!Object.prototype.hasOwnProperty.call(INTENT_KEYS, intent.type)) {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', `intent ${intent.type} is not recognized`);
  }
  assertExactKeys(intent, INTENT_KEYS[intent.type], 'intent');
  if (intent.type === 'submit-notice' && typeof intent.matchesUnits !== 'boolean') {
    throw new EpisodeIntentError('INVALID_INTENT_SHAPE', 'submit-notice.matchesUnits must be boolean');
  }
  if (intent.type === 'propose-common-denominator') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'submit-equivalent-form') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'submit-operation-result') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'submit-resolution') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'submit-reflection'
    && (typeof intent.response !== 'string' || intent.response.length === 0)) {
    throw new EpisodeIntentError('INVALID_REFLECTION_RESPONSE', 'reflection response must be a stable choice identity');
  }
}

function ensureIntent(intent) {
  if (!isPlainRecord(intent) || typeof intent.type !== 'string') {
    throw new EpisodeIntentError('INVALID_INTENT', 'intent must have a type');
  }
  if (intent.type === 'continue') {
    throw new EpisodeIntentError('APP_SHELL_INTENT', 'continue is outside the instructional reducer');
  }
  assertCanonicalWireValue(intent, 'intent');
  assertIntentShape(intent);
  return deepFreeze({ ...intent });
}

function assertIntentAllowedAtBeat(state, intent) {
  const expectedBeat = INTENT_BEATS[intent.type];
  if (expectedBeat && state.beat !== expectedBeat) {
    throw new EpisodeIntentError(
      'UNEXPECTED_INTENT',
      `intent ${intent.type} is not valid at beat ${state.beat}`,
    );
  }
  if (intent.type === 'submit-reflection' && !state.episodeDefinition.includeReflection) {
    throw new EpisodeIntentError(
      'UNEXPECTED_INTENT',
      'submit-reflection is not enabled for this episode definition',
    );
  }
}

export function createEpisode({
  instance,
  episodeDefinition = PHASE2_EPISODE_DEFINITION,
  support = DEFAULT_SUPPORT_CONFIGURATION,
  activeCondition = PHASE2_ACTIVE_CONDITION,
} = {}) {
  const content = assertInstance(instance);
  const definition = assertDefinition(episodeDefinition);
  const normalizedSupport = createSupportConfiguration(support);
  const normalizedCondition = validateActiveCondition(activeCondition);
  const initial = {
    schemaVersion: 'fractionflow.episode-state/v1',
    status: 'active',
    revision: 0,
    content,
    episodeDefinition: definition,
    activeCondition: normalizedCondition,
    support: normalizedSupport,
    beat: 'encounter',
    expectedResponse: responseForBeat(definition, 'encounter', {
      established: { conversions: { left: null, right: null } },
    }),
    established: {
      encounter: null,
      notice: null,
      commonDenominator: null,
      conversions: { left: null, right: null },
      operation: null,
      resolution: null,
      reflection: null,
      route: 'fraction-bar',
    },
    completedBeats: [],
    pendingResponse: null,
    nextResponseSupport: null,
    helpHistory: [],
    replayHistory: [],
    retryHistory: [],
    supportHistory: [],
    intentHistory: [],
    responseProvenance: [],
    lastRecovery: null,
  };
  return deepFreeze(initial);
}

export function applyIntent(state, rawIntent) {
  if (!state || state.schemaVersion !== 'fractionflow.episode-state/v1') {
    throw new EpisodeIntentError('INVALID_EPISODE_STATE', 'state is not a Plan 05 episode state');
  }
  if (state.status !== 'active') {
    throw new EpisodeIntentError('EPISODE_RESOLVED', 'resolved episodes do not accept more instructional intents');
  }
  const intent = ensureIntent(rawIntent);
  assertIntentAllowedAtBeat(state, intent);
  if (intent.type === 'request-help') return handleHelp(state, intent);
  if (intent.type === 'request-replay') return handleReplay(state, intent);
  if (intent.type === 'acknowledge-encounter') return handleEncounter(state, intent);
  if (intent.type === 'submit-notice') return handleNotice(state, intent);
  if (intent.type === 'propose-common-denominator') return handleDecide(state, intent);
  if (intent.type === 'submit-equivalent-form') return handleTransform(state, intent);
  if (intent.type === 'submit-operation-result') return handleOperate(state, intent);
  if (intent.type === 'submit-resolution') return handleResolve(state, intent);
  if (intent.type === 'submit-reflection') return handleReflect(state, intent);
  throw new EpisodeIntentError('UNEXPECTED_INTENT', `intent ${intent.type} is not valid at beat ${state.beat}`);
}

export function episodeStateSnapshot(state) {
  return deepFreeze(stateSnapshot(state));
}

export { evaluateProposedPathEligibility };
