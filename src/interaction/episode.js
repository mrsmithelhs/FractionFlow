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
  classifyPremiseResponse,
  classifyReflectionResponse,
  classifyResolutionResponse,
  classifyTransformHelpMultiplier,
} from './classification.js';
import {
  EPISODE_BEATS,
  PHASE2_ACTIVE_CONDITION,
  PHASE2_EPISODE_DEFINITION,
  PLAN17_CROSSING_EPISODE_DEFINITION,
  getEpisodeDefinition,
  validateActiveCondition,
} from './episode-definition.js';
import { evaluateTaskPathClosure } from './path-closure.js';
import { createResponseProvenance } from './provenance.js';
import { computeBeatSchedule, currentScheduleEntry } from './beat-schedule.js';
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

function responseForEntry(definition, entry) {
  const beat = entry.kind;
  const common = {
    promptId: definition.promptIdentities[beat],
    beat,
    evidenceCategory: 'supported-construction',
  };
  if (beat === 'encounter') return { ...common, responsibility: 'inspect-expression', inputKind: 'acknowledge' };
  if (beat === 'notice') return { ...common, responsibility: 'identify-unit-relationship', inputKind: 'unit-match-choice' };
  if (beat === 'decide') return { ...common, responsibility: 'choose-common-denominator', inputKind: 'whole-fraction' };
  if (beat === 'transform') {
    return {
      ...common,
      responsibility: 'construct-equivalent-form',
      inputKind: 'fraction',
      target: entry.side,
      evidenceCategory: 'prediction',
    };
  }
  if (beat === 'operate') return { ...common, responsibility: 'combine-like-units', inputKind: 'fraction' };
  if (beat === 'resolve') return { ...common, responsibility: 'settle-final-form', inputKind: 'fraction' };
  return { ...common, responsibility: 'inspect-invariant', inputKind: 'structured-choice' };
}

function sameDefinitionValue(left, right) {
  if (Object.is(left, right)) return true;
  if (typeof left !== 'object' || left === null || typeof right !== 'object' || right === null) return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((value, index) => sameDefinitionValue(value, right[index]));
  }
  if (!isPlainRecord(left) || !isPlainRecord(right)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return JSON.stringify(leftKeys) === JSON.stringify(rightKeys)
    && leftKeys.every((key) => sameDefinitionValue(left[key], right[key]));
}

function assertDefinitionWireData(value, name, seen = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', `${name} contains a non-finite number`);
    }
    return;
  }
  if (typeof value === 'undefined' || typeof value === 'function'
    || typeof value === 'symbol' || typeof value === 'bigint') {
    throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', `${name} is not JSON-safe wire data`);
  }
  if (typeof value !== 'object') {
    throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', `${name} contains an unsupported value`);
  }
  if (seen.has(value)) {
    throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', `${name} must not be circular`);
  }
  seen.add(value);
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      assertDefinitionWireData(value[index], `${name}[${index}]`, seen);
    }
  } else {
    if (!isPlainRecord(value) || Object.prototype.hasOwnProperty.call(value, 'toJSON')) {
      throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', `${name} must contain only plain records and arrays`);
    }
    Object.entries(value).forEach(([key, entry]) => assertDefinitionWireData(entry, `${name}.${key}`, seen));
  }
  seen.delete(value);
}

function assertDefinition(definition) {
  if (!isPlainRecord(definition) || typeof definition.id !== 'string' || typeof definition.revision !== 'string') {
    throw new EpisodeConstructionError('UNKNOWN_EPISODE_DEFINITION', 'unsupported episode definition');
  }
  assertDefinitionWireData(definition, 'episodeDefinition');
  let registered;
  try {
    registered = getEpisodeDefinition(definition.id, definition.revision);
  } catch (error) {
    throw new EpisodeConstructionError('UNKNOWN_EPISODE_DEFINITION', 'unsupported episode definition');
  }
  if (!sameDefinitionValue(definition, registered)) {
    throw new EpisodeConstructionError(
      'INVALID_EPISODE_DEFINITION',
      'episode definition semantics do not match its registered identity',
    );
  }
  if (JSON.stringify(registered.beats) !== JSON.stringify(EPISODE_BEATS)) {
    throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', 'registered episode beats do not match the approved grammar');
  }
  return registered;
}

function assertInstance(instance, definition) {
  const validation = validateProblemInstance(instance);
  if (!validation.valid) {
    throw new EpisodeConstructionError(
      'INVALID_CONTENT_INSTANCE',
      'episode construction requires a valid content instance',
      { errors: validation.errors, checks: validation.checks.filter((check) => !check.valid) },
    );
  }
  const identityContract = definition.contentContract ?? null;
  const crossingContractMatches = identityContract === null || (
    instance.provenance?.fixtureId === identityContract.fixtureId
    && instance.provenance?.authoringRevision === identityContract.authoringRevision
    && instance.request.selector === identityContract.selector
    && instance.request.operation === identityContract.operation
    && JSON.stringify(instance.request.overlays) === JSON.stringify(identityContract.overlays)
    && instance.classification?.result?.crossesWhole === identityContract.crossesWhole
    && identityContract.resultStackCapability === 'plan17-two-whole-stack-v1'
    && instance.representationFacts?.wholeSpan?.lowerWhole === '1'
    && instance.representationFacts?.wholeSpan?.upperWhole === '2'
  );
  if (instance.request.selector !== definition.selector
    || instance.request.operation !== definition.operation
    || !crossingContractMatches) {
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

function advanceSchedule(state, established, { completeCurrent = true } = {}) {
  const entry = currentScheduleEntry(state);
  const nextPosition = state.schedulePosition + 1;
  const nextEntry = state.beatSchedule[nextPosition];
  if (!entry || !nextEntry) {
    throw new EpisodeIntentError('INVALID_BEAT_SCHEDULE', 'a non-terminal beat must have a scheduled successor');
  }
  const completed = completeCurrent
    ? [...state.completedBeats, {
      beat: entry.kind,
      established,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: entry.id,
    }]
    : state.completedBeats;
  const next = {
    ...state,
    beat: nextEntry.kind,
    schedulePosition: nextPosition,
    expectedResponse: responseForEntry(state.episodeDefinition, nextEntry),
    completedBeats: completed,
    revision: state.revision + 1,
    lastRecovery: null,
    pendingResponse: null,
  };
  return next;
}

function resolvedState(state, established) {
  const entry = currentScheduleEntry(state);
  if (!entry || state.schedulePosition !== state.beatSchedule.length - 1) {
    throw new EpisodeIntentError('INVALID_BEAT_SCHEDULE', 'only the final scheduled beat can resolve the episode');
  }
  const beat = entry.kind;
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
    completedBeats: [...state.completedBeats, {
      beat,
      established,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: entry.id,
    }],
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

function currentTaskHelpEntries(state, scheduleEntry = currentScheduleEntry(state)) {
  return state.supportHistory.filter((entry) => (
    entry.type === 'task-help-request'
    && entry.scheduleEntryId === scheduleEntry?.id
  ));
}

function handleTaskHelpRequest(state, intent) {
  const scheduleEntry = currentScheduleEntry(state);
  if (currentTaskHelpEntries(state, scheduleEntry).length > 0) return state;
  const next = appendIntent(state, intent);
  return deepFreeze({
    ...next,
    supportHistory: [...next.supportHistory, {
      type: 'task-help-request',
      beat: state.beat,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: scheduleEntry.id,
      side: scheduleEntry.side ?? null,
    }],
  });
}

function handleTransformHelpMultiplier(state, intent) {
  const scheduleEntry = currentScheduleEntry(state);
  const requests = currentTaskHelpEntries(state, scheduleEntry);
  if (requests.length === 0) {
    throw new EpisodeIntentError('TASK_HELP_NOT_REQUESTED', 'transform help must be requested for this conversion first');
  }
  const latestAttempt = state.supportHistory.findLast((entry) => (
    entry.type === 'transform-help-multiplier'
    && entry.scheduleEntryId === scheduleEntry.id
  ));
  if (latestAttempt?.classification === 'accepted') {
    throw new EpisodeIntentError('TASK_HELP_ALREADY_ACCEPTED', 'the multiplier for this conversion was already accepted');
  }
  const result = classifyTransformHelpMultiplier({
    instance: state.content,
    targetDenominator: state.established.commonDenominator.targetDenominator,
    side: scheduleEntry.side,
    proposed: intent.proposed,
  });
  const next = appendIntent(state, intent);
  const event = {
    type: 'transform-help-multiplier',
    beat: 'transform',
    schedulePosition: state.schedulePosition,
    scheduleEntryId: scheduleEntry.id,
    side: scheduleEntry.side,
    proposed: intent.proposed,
    classification: result.kind === 'helper-multiplier-accepted' ? 'accepted' : 'incorrect',
  };
  return deepFreeze({
    ...next,
    supportHistory: [...next.supportHistory, event],
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
  const next = advanceSchedule(state, established);
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
  const next = advanceSchedule(state, established);
  return assessedSuccess(state, intent, classification, {
    ...next,
    established: { ...next.established, notice: established },
  });
}

function handleDecide(state, intent) {
  if (intent.type !== 'propose-common-denominator') return null;
  const classification = classifyCommonDenominatorResponse(state.content, intent.proposed);
  if (classification.kind === 'invalid-common-denominator') return recovery(state, intent, classification);

  const usesHistoricalTaskClosure = ['2', '3'].includes(state.episodeDefinition.revision);
  const usesPlan17TaskClosure = state.episodeDefinition.id === PLAN17_CROSSING_EPISODE_DEFINITION.id
    && state.episodeDefinition.revision === PLAN17_CROSSING_EPISODE_DEFINITION.revision;
  if (usesHistoricalTaskClosure || usesPlan17TaskClosure) {
    const taskPathClosure = evaluateTaskPathClosure({
      instance: state.content,
      targetDenominator: classification.targetDenominator,
      episodeDefinition: state.episodeDefinition,
      activeCondition: state.activeCondition,
    });
    if (!taskPathClosure.available) {
      return recovery(state, intent, {
        ...classification,
        kind: 'valid-but-unavailable-task-path',
        pathClassification: classification,
        taskPathClosure,
        continuation: 'local-recovery',
      });
    }
  }

  const established = {
    ...classification,
    proposed: intent.proposed,
    route: classification.kind === 'valid-but-outside-representation-capability'
      ? 'symbolic-continuation'
      : 'episode-definition',
  };
  const next = advanceSchedule(state, established);
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
  const nextEntry = state.beatSchedule[state.schedulePosition + 1];
  const next = nextEntry?.kind === 'transform'
    ? advanceSchedule({
      ...state,
      established: { ...state.established, conversions: establishedConversions },
    }, establishedConversions, { completeCurrent: false })
    : advanceSchedule(state, establishedConversions);
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
  const next = advanceSchedule(state, established);
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
    const next = advanceSchedule(state, established);
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
    resolvedState(state, established),
  );
}

function handleReflect(state, intent) {
  if (intent.type !== 'submit-reflection') return null;
  if (typeof intent.response !== 'string' || intent.response.length === 0) {
    throw new EpisodeIntentError('INVALID_REFLECTION_RESPONSE', 'reflection response must be a stable choice identity');
  }

  const establishedDenominator = state.established.commonDenominator.targetDenominator;

  // DECISION-026 premise checks intentionally use their authored yes/no
  // response contract. CM-01 matching choices are classified here, upstream
  // of both renderers, against the established equivalent form.
  if (state.activeCondition.connectionMaking === 'CM-01-P') {
    const classification = classifyPremiseResponse({
      instance: state.content,
      establishedDenominator,
      response: intent.response,
    });
    if (classification.kind !== 'correct-reflection') {
      return recovery(state, intent, classification);
    }
    const established = {
      premiseCaseId: classification.premiseCase.id,
      response: intent.response,
      expected: classification.premiseCase.expectedResponse,
    };
    return assessedSuccess(
      state,
      intent,
      classification,
      resolvedState(state, established),
    );
  }

  const classification = classifyReflectionResponse({
    instance: state.content,
    establishedDenominator,
    targetForm: state.established.conversions.left,
    response: intent.response,
  });
  if (classification.kind !== 'correct-reflection') {
    return recovery(state, intent, classification);
  }
  return assessedSuccess(
    state,
    intent,
    classification,
    resolvedState(state, { response: intent.response }),
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
  'request-task-help': ['type'],
  'submit-transform-help-multiplier': ['type', 'proposed'],
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
  if (intent.type === 'submit-transform-help-multiplier') {
    assertWireFraction(intent.proposed, 'intent.proposed');
    if (intent.proposed.denominator !== '1') {
      throw new EpisodeIntentError('INVALID_INTENT_SHAPE', 'transform-help multiplier must be a whole fraction');
    }
  }
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
  const scheduleEntry = currentScheduleEntry(state);
  if (!Array.isArray(state.beatSchedule)
    || !Number.isInteger(state.schedulePosition)
    || !scheduleEntry
    || scheduleEntry.kind !== state.beat
    || state.expectedResponse?.beat !== state.beat
    || (state.beat === 'transform' && state.expectedResponse.target !== scheduleEntry.side)) {
    throw new EpisodeIntentError('INVALID_EPISODE_STATE', 'active beat does not match its scheduled entry');
  }
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
  if (['request-task-help', 'submit-transform-help-multiplier'].includes(intent.type)) {
    if (state.episodeDefinition.revision !== '3'
      && !(state.episodeDefinition.id === PLAN17_CROSSING_EPISODE_DEFINITION.id
        && state.episodeDefinition.revision === PLAN17_CROSSING_EPISODE_DEFINITION.revision)) {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', `${intent.type} requires episode definition revision 3`);
    }
    if (intent.type === 'submit-transform-help-multiplier' && state.beat !== 'transform') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'transform help multiplier is valid only during a transform');
    }
    if (intent.type === 'request-task-help' && !['decide', 'transform'].includes(state.beat)) {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'task help is available only for denominator choice or conversion');
    }
  }
}

export function createEpisode({
  instance,
  episodeDefinition = PHASE2_EPISODE_DEFINITION,
  support = DEFAULT_SUPPORT_CONFIGURATION,
  activeCondition = PHASE2_ACTIVE_CONDITION,
} = {}) {
  const definition = assertDefinition(episodeDefinition);
  const content = assertInstance(instance, definition);
  const normalizedSupport = createSupportConfiguration(support);
  const normalizedCondition = validateActiveCondition(activeCondition);
  const beatSchedule = computeBeatSchedule(content, definition);
  const firstEntry = beatSchedule[0];
  const initial = {
    schemaVersion: 'fractionflow.episode-state/v1',
    status: 'active',
    revision: 0,
    content,
    episodeDefinition: definition,
    activeCondition: normalizedCondition,
    beatSchedule,
    schedulePosition: 0,
    support: normalizedSupport,
    beat: firstEntry.kind,
    expectedResponse: responseForEntry(definition, firstEntry),
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
  if (intent.type === 'request-task-help') return handleTaskHelpRequest(state, intent);
  if (intent.type === 'submit-transform-help-multiplier') return handleTransformHelpMultiplier(state, intent);
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

/**
 * Replace the upstream design condition without resetting the episode.
 *
 * A condition is presentation/instruction configuration, not learner work. It
 * therefore does not become a learner intent and does not advance the math or
 * instructional revision. The replay envelope records the resulting active
 * condition when the episode is exported.
 */
export function withActiveCondition(state, activeCondition) {
  if (!state || state.schemaVersion !== 'fractionflow.episode-state/v1') {
    throw new EpisodeIntentError('INVALID_EPISODE_STATE', 'state is not a Plan 05 episode state');
  }
  const normalizedCondition = validateActiveCondition(activeCondition);
  return deepFreeze({
    ...state,
    activeCondition: normalizedCondition,
  });
}

export { evaluateProposedPathEligibility };
