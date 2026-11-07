import { createPlan82Episode, applyPlan82Intent, PLAN82_ID } from './plan82-mixed-subtraction-episode.js';
import { createPlan78Episode, applyPlan78Intent, PLAN78_ID } from './plan78-mixed-subtraction-episode.js';
import { createPlan74Episode, applyPlan74Intent, PLAN74_ID } from './plan74-mixed-addition-episode.js';
import { createPlan72Episode, applyPlan72Intent, PLAN72_ID } from './plan72-mixed-addition-episode.js';
import { createPlan59Episode, applyPlan59Intent } from './plan59-directed-endpoint-episode.js';
import { createPlan58Episode, applyPlan58Intent } from './plan58-whole-plus-fraction-episode.js';
import { createPlan53Episode, applyPlan53Intent } from './plan53-two-whole-location-episode.js';
import { createPlan51Episode, applyPlan51Intent } from './plan51-distance-episode.js';
import { createPlan50Episode, applyPlan50Intent } from './plan50-number-line-collection-episode.js';
import { createPlan49PublicEpisode, applyPlan49PublicIntent, plan49PublicSnapshot } from './plan49-comparison-construction.js';
import {
  evaluateInstanceEligibility,
  evaluateProposedPathEligibility,
} from '../content/eligibility.js';
import { validateProblemInstance } from '../content/validation.js';
import { resolveAuthoredContent } from '../content/authored-content-catalog.js';
import {
  deepFreeze,
} from '../content/schema.js';
import {
  classifyCommonDenominatorResponse,
  classifyConversionResponseForEpisode,
  classifyInspectedCandidate,
  classifyNoticeResponse,
  classifyOperationResponseForEpisode,
  classifyPremiseResponse,
  classifyReflectionResponse,
  classifyResolutionResponse,
  classifyTransformHelpMultiplier,
} from './classification.js';
import {
  FULL_ADDITION_CONSTRUCT_PATTERN,
  FULL_ADDITION_INSPECT_PATTERN,
  PLAN34_EPISODE_DEFINITION_ID,
  validatePlan34TaskContext,
} from '../content/full-addition-task-patterns.js';
import { PLAN18_NESTED_DEFINITION_ID, validatePlan18TaskContext } from '../content/nested-renaming-task.js';
import { isPlan35AdditionRecipeDefinition, isPlan35IdentifyRecipe, validatePlan35AdditionRecipeContext } from '../content/plan35-addition-recipe-task.js';
import { isPlan36SubtractionDefinition, validatePlan36LikeDenominatorSubtractionContext } from '../content/plan36-like-denominator-takeaway-task.js';
import {
  isPlan40SubtractionRecipeDefinition,
  isPlan40IdentifyRecipe,
  validatePlan40SubtractionRecipeContext,
} from '../content/plan40-reusable-subtraction-recipes.js';
import { subtractAtCommonDenominator, validateOperationResult } from '../math/index.js';
import { benchmarkFraction, classifyMagnitude, compareFractions, createFraction, equalFractions } from '../math/index.js';
import { fractionFromWire } from './classification.js';
import {
  isPlan37BarToLineBridgeTaskDefinition,
  plan37SourceFraction,
  validatePlan37BarToLineBridgeContext,
  validatePlan37BarToLineBridgeInstance,
} from '../content/plan37-bar-to-line-bridge-task.js';
import {
  isPlan45ComparisonDefinition,
} from '../content/plan45-symbolic-fraction-comparison-task.js';
import {
  applyPlan45ComparisonIntent,
  createPlan45ComparisonEpisode,
  isPlan45ComparisonEpisode,
  plan45ComparisonStateSnapshot,
} from './plan45-comparison-episode.js';
import {
  EPISODE_BEATS,
  PHASE2_ACTIVE_CONDITION,
  PHASE2_EPISODE_DEFINITION,
  PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION,
  PLAN17_CROSSING_EPISODE_DEFINITION,
  PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION,
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

function responseForEntry(definition, entry, taskContext = null) {
  const beat = entry.kind;
  const common = {
    promptId: definition.promptIdentities[beat],
    beat,
    evidenceCategory: 'supported-construction',
  };
  if (isPlan37BarToLineBridgeTaskDefinition(definition)) {
    if (beat === 'encounter') return { ...common, responsibility: 'inspect-reference-bar', inputKind: 'acknowledge-bridge-encounter' };
    if (beat === 'locate') return { ...common, responsibility: 'place-source-amount-on-number-line', inputKind: 'number-line-position', responseId: 'propose-number-line-location' };
    if (beat === 'resolve') return { ...common, responsibility: 'confirm-number-line-location', inputKind: 'finish-navigation' };
  }
  if (isPlan36SubtractionDefinition(definition)) {
    if (beat === 'encounter') {
      return {
        ...common,
        responsibility: 'mark-subtrahend-amount-for-inspection',
        inputKind: 'grouped-removal-action',
        question: 'How much is left?',
      };
    }
    if (beat === 'operate') {
      return {
        ...common,
        responsibility: 'supply-amount-left',
        inputKind: 'fraction',
        question: 'How much is left?',
      };
    }
    if (beat === 'resolve') {
      return {
        ...common,
        responsibility: 'settle-final-form',
        inputKind: 'fraction',
      };
    }
  }
  if (beat === 'encounter') return { ...common, responsibility: 'inspect-expression', inputKind: 'acknowledge' };
  if (beat === 'notice') return { ...common, responsibility: 'identify-unit-relationship', inputKind: 'unit-match-choice' };
  if (beat === 'decide') return definition.id === PLAN18_NESTED_DEFINITION_ID
    || (isPlan35AdditionRecipeDefinition(definition) && isPlan35IdentifyRecipe(taskContext))
    || (isPlan40SubtractionRecipeDefinition(definition) && isPlan40IdentifyRecipe(taskContext))
    ? {
      ...common,
      responsibility: 'identify-renaming-side',
      inputKind: 'side-choice',
      question: 'Which fraction needs a different denominator?',
      choices: ['left', 'right'].map((side) => ({ side, form: taskContext.sourceForms[side] })),
      targetDenominator: taskContext.targetDenominator,
    }
    : { ...common, responsibility: 'choose-common-denominator', inputKind: 'whole-fraction' };
  if (beat === 'transform') {
    if (definition.id === PLAN34_EPISODE_DEFINITION_ID
      || isPlan35AdditionRecipeDefinition(definition)
      || isPlan40SubtractionRecipeDefinition(definition)) {
      const isInspect = taskContext.patternId === FULL_ADDITION_INSPECT_PATTERN.id
        || ['unlike-subtraction.inspect-keep-repair', 'unlike-subtraction.inspect-candidate', 'full-subtraction.inspect-keep-repair'].includes(taskContext.patternId);
      return {
        ...common,
        responsibility: isInspect
          ? 'inspect-keep-or-repair-candidate'
          : 'construct-equivalent-numerator',
        inputKind: isInspect ? 'inspect-candidate' : 'numerator',
        target: entry.side,
        targetDenominator: taskContext.targetDenominator,
        patternId: taskContext.patternId,
        evidenceCategory: 'prediction',
      };
    }
    return {
      ...common,
      responsibility: 'construct-equivalent-form',
      inputKind: 'fraction',
      target: entry.side,
      evidenceCategory: 'prediction',
    };
  }
  if (beat === 'operate') {
    if (isPlan40SubtractionRecipeDefinition(definition)) {
      return {
        ...common,
        responsibility: 'supply-amount-left',
        inputKind: 'fraction-response',
        question: 'How much is left?',
      };
    }
    return { ...common, responsibility: 'combine-like-units', inputKind: 'fraction' };
  }
  if (beat === 'resolve') return { ...common, responsibility: 'settle-final-form', inputKind: 'fraction' };
  return { ...common, responsibility: 'inspect-invariant', inputKind: 'structured-choice' };
}

function isPlan20Definition(definition) {
  return definition?.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
    && definition?.revision === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.revision;
}

function sharedUnitFromValidatedContent(instance) {
  const left = instance.operands.left.initialForm;
  const right = instance.operands.right.initialForm;
  if (left.denominator !== right.denominator
    || instance.classification.denominator.relationship !== 'same') {
    throw new EpisodeIntentError('INVALID_SHARED_UNIT', 'the registered task does not have one validated shared unit');
  }
  return {
    kind: 'already-shared-unit',
    targetDenominator: left.denominator,
    source: 'validated-equal-original-denominators',
    sourceForms: { left, right },
  };
}

function targetDenominatorFor(state) {
  const establishedUnit = state.established.sharedUnit ?? state.established.commonDenominator;
  if (!establishedUnit?.targetDenominator) {
    throw new EpisodeIntentError('MISSING_ESTABLISHED_UNIT', 'operation requires an established fraction unit');
  }
  return establishedUnit.targetDenominator;
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
  const approvedBeats = (registered.id === PLAN72_ID || registered.id === PLAN74_ID || registered.id === PLAN78_ID || registered.id === PLAN82_ID)
    ? ['construct', 'resolve']
    : registered.id === 'phase-4-directed-number-line-endpoint'
    ? ['locate', 'resolve']
    : registered.id === 'phase-4-whole-plus-fraction-construction'
    ? ['construct', 'resolve']
    : registered.id === 'phase-4-two-whole-location'
    ? ['locate', 'resolve']
    : registered.id === 'phase-4-fraction-distance'
    ? ['compare', 'distance', 'resolve']
    : registered.id === 'phase-4-number-line-collection'
    ? ['place-collection', 'resolve']
    : isPlan37BarToLineBridgeTaskDefinition(registered)
    ? (registered.revision === '2' ? ['locate', 'resolve'] : ['encounter', 'locate', 'resolve'])
    : isPlan45ComparisonDefinition(registered)
      ? ['compare', 'resolve']
    : registered.id === PLAN36_LIKE_DENOMINATOR_SUBTRACTION_EPISODE_DEFINITION.id
    ? ['encounter', 'operate', 'resolve']
    : [PLAN18_NESTED_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(registered.id)
      ? ['encounter', 'decide', 'transform', 'operate', 'resolve']
      : EPISODE_BEATS;
  if (JSON.stringify(registered.beats) !== JSON.stringify(approvedBeats)) {
    throw new EpisodeConstructionError('INVALID_EPISODE_DEFINITION', 'registered episode beats do not match the approved grammar');
  }
  return registered;
}

function assertInstance(instance, definition) {
  if (isPlan37BarToLineBridgeTaskDefinition(definition)) {
    try {
      return validatePlan37BarToLineBridgeInstance(instance);
    } catch (error) {
      throw new EpisodeConstructionError('INVALID_CONTENT_INSTANCE', error.message);
    }
  }
  const validation = validateProblemInstance(instance);
  if (!validation.valid) {
    throw new EpisodeConstructionError(
      'INVALID_CONTENT_INSTANCE',
      'episode construction requires a valid content instance',
      { errors: validation.errors, checks: validation.checks.filter((check) => !check.valid) },
    );
  }
  const identityContract = definition.contentContract ?? null;
  const isPlan36 = isPlan36SubtractionDefinition(definition);
  const isPlan17Contract = identityContract?.resultStackCapability === 'plan17-two-whole-stack-v1';
  const isPlan20Contract = definition.id === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.id
    && definition.revision === PLAN20_LIKE_DENOMINATOR_EPISODE_DEFINITION.revision;
  const isPlan18 = definition.id === PLAN18_NESTED_DEFINITION_ID && definition.revision === '1';
  const isPlan35 = definition.id === 'phase-3-reusable-addition-recipes' && definition.revision === '1';
  const isPlan40 = isPlan40SubtractionRecipeDefinition(definition);
  const registeredCrossing = identityContract?.resultStackCapability === 'plan17-two-whole-stack-v1'
    ? resolveAuthoredContent(identityContract.fixtureId, identityContract.authoringRevision)
    : null;
  const registeredPlan20 = isPlan20Contract
    ? resolveAuthoredContent(identityContract.fixtureId, identityContract.authoringRevision)
    : null;
  const operandsMatchRegisteredCrossing = identityContract === null || (
    registeredCrossing?.fixture?.left?.kind === instance.operands?.left?.initialForm?.kind
    && registeredCrossing.fixture.left.numerator === instance.operands.left.initialForm.numerator
    && registeredCrossing.fixture.left.denominator === instance.operands.left.initialForm.denominator
    && registeredCrossing.fixture.right?.kind === instance.operands?.right?.initialForm?.kind
    && registeredCrossing.fixture.right.numerator === instance.operands.right.initialForm.numerator
    && registeredCrossing.fixture.right.denominator === instance.operands.right.initialForm.denominator
  );
  const crossingContractMatches = !isPlan17Contract || (
    instance.provenance?.fixtureId === identityContract.fixtureId
    && instance.provenance?.authoringRevision === identityContract.authoringRevision
    && instance.request.selector === identityContract.selector
    && instance.request.operation === identityContract.operation
    && JSON.stringify(instance.request.overlays) === JSON.stringify(identityContract.overlays)
    && instance.classification?.result?.crossesWhole === identityContract.crossesWhole
    && identityContract.resultStackCapability === 'plan17-two-whole-stack-v1'
    && operandsMatchRegisteredCrossing
    && instance.representationFacts?.wholeSpan?.lowerWhole === '1'
    && instance.representationFacts?.wholeSpan?.upperWhole === '2'
  );
  const formMatches = (actual, expected) => actual?.kind === expected?.kind
    && actual?.numerator === expected?.numerator
    && actual?.denominator === expected?.denominator;
  const plan20ContractMatches = !isPlan20Contract || (
    registeredPlan20?.itemId === identityContract.itemId
    && registeredPlan20?.taskDataRevision === identityContract.taskDataRevision
    && registeredPlan20?.recipe?.id === identityContract.recipe.id
    && registeredPlan20?.recipe?.revision === identityContract.recipe.revision
    && registeredPlan20?.fixture?.selector === identityContract.selector
    && registeredPlan20?.fixture?.profileId === 'curated-review'
    && registeredPlan20?.fixture?.overlays?.length === 0
    && formMatches(registeredPlan20?.fixture?.left, identityContract.left)
    && formMatches(registeredPlan20?.fixture?.right, identityContract.right)
    && instance.provenance?.fixtureId === identityContract.fixtureId
    && instance.provenance?.authoringRevision === identityContract.authoringRevision
    && instance.request.selector === identityContract.selector
    && instance.request.operation === identityContract.operation
    && JSON.stringify(instance.request.overlays) === JSON.stringify(identityContract.overlays)
    && formMatches(instance.operands?.left?.initialForm, identityContract.left)
    && formMatches(instance.operands?.right?.initialForm, identityContract.right)
    && instance.classification?.denominator?.relationship === 'same'
    && instance.classification?.transformations?.canonicalRenaming?.left === false
    && instance.classification?.transformations?.canonicalRenaming?.right === false
    && definition.includeReflection === false
  );
  if ((instance.request.selector !== definition.selector
      && !(isPlan35 && ['relatively-prime-addition', 'nested-denominator-addition', 'shared-factor-addition'].includes(instance.request.selector))
      && !(isPlan40 && ['relatively-prime-subtraction', 'nested-denominator-subtraction', 'shared-factor-subtraction'].includes(instance.request.selector)))
    || instance.request.operation !== definition.operation
    || !crossingContractMatches
    || !plan20ContractMatches
    || (identityContract !== null && !isPlan17Contract && !isPlan20Contract)
    || (isPlan18 && (instance.provenance?.authoringRevision !== 'plan18-record-v1'
      || instance.classification?.transformations?.canonicalRenaming?.left === instance.classification?.transformations?.canonicalRenaming?.right))
    || (isPlan36 && (instance.provenance?.authoringRevision !== 'plan36-record-v1'
      || instance.classification?.denominator?.relationship !== 'same'))) {
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
  if (isPlan45ComparisonEpisode(state)) return state.episodeDefinition.revision === '2' ? plan49PublicSnapshot(state) : plan45ComparisonStateSnapshot(state);
  return {
    encounter: state.established.encounter,
    notice: state.established.notice,
    commonDenominator: state.established.commonDenominator,
    conversions: state.established.conversions,
    operation: state.established.operation,
    resolution: state.established.resolution,
    reflection: state.established.reflection,
    route: state.established.route,
    ...(Object.prototype.hasOwnProperty.call(state.established, 'sharedUnit')
      ? { sharedUnit: state.established.sharedUnit }
      : {}),
    ...([PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes'].includes(state.episodeDefinition?.id)
      ? {
        compactCompletion: state.established.compactCompletion ?? null,
        conversionOrigins: state.established.conversionOrigins ?? {},
        taskContext: state.taskContext,
      }
      : {}),
    ...(state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes'
      ? {
        compactCompletion: state.established.compactCompletion ?? null,
        conversionOrigins: state.established.conversionOrigins ?? {},
        subtractionRemoval: state.established.subtractionRemoval ?? 'unmarked',
        selectedRenamingSide: state.established.selectedRenamingSide ?? null,
        taskContext: state.taskContext,
      }
      : {}),
    ...(state.episodeDefinition?.id === PLAN18_NESTED_DEFINITION_ID ? {
      nestedCompletion: state.established.nestedCompletion ?? null,
      selectedRenamingSide: state.established.selectedRenamingSide ?? null,
      conversionOrigins: state.established.conversionOrigins ?? {},
      taskContext: state.taskContext,
    } : {}),
    ...(isPlan36SubtractionDefinition(state.episodeDefinition) ? {
      subtractionRemoval: state.established.subtractionRemoval ?? 'unmarked',
      compactCompletion: state.established.compactCompletion ?? null,
      taskContext: state.taskContext,
    } : {}),
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
    expectedResponse: responseForEntry(state.episodeDefinition, nextEntry, state.taskContext),
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
  const isPlan36 = isPlan36SubtractionDefinition(state.episodeDefinition);
  const establishedState = {
    ...state.established,
    ...(beat === 'resolve' && ([PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id) || isPlan36)
      ? { compactCompletion: established }
      : beat === 'resolve' && state.episodeDefinition.id === PLAN18_NESTED_DEFINITION_ID
        ? { nestedCompletion: established }
      : beat === 'resolve' ? { resolution: established } : {}),
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
  const isPlan36 = isPlan36SubtractionDefinition(state.episodeDefinition);
  return deepFreeze({
    ...next,
    supportHistory: [...next.supportHistory, {
      type: 'task-help-request',
      beat: state.beat,
      schedulePosition: state.schedulePosition,
      scheduleEntryId: scheduleEntry.id,
      side: scheduleEntry.side ?? null,
      ...((isPlan36 || state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes') && state.beat === 'operate'
        ? { helpKind: 'like-denominator-takeaway' }
        : {}),
      ...(state.episodeDefinition.id === PLAN34_EPISODE_DEFINITION_ID
        && state.taskContext.patternId === FULL_ADDITION_INSPECT_PATTERN.id
        ? { helpKind: 'inspect-comparison-invariant' }
       : {}),
      ...(isPlan35AdditionRecipeDefinition(state.episodeDefinition)
        && (state.taskContext.patternId === FULL_ADDITION_INSPECT_PATTERN.id
          || (isPlan35IdentifyRecipe(state.taskContext) && state.beat === 'decide'))
        ? { helpKind: state.taskContext.patternId === FULL_ADDITION_INSPECT_PATTERN.id ? 'inspect-comparison-invariant' : 'renaming-side-comparison' }
        : {}),
      ...(state.episodeDefinition.id === 'phase-3-reusable-subtraction-recipes'
        && (['unlike-subtraction.inspect-keep-repair', 'unlike-subtraction.inspect-candidate', 'full-subtraction.inspect-keep-repair'].includes(state.taskContext.patternId)
          || (isPlan40IdentifyRecipe(state.taskContext) && state.beat === 'decide'))
        ? { helpKind: ['unlike-subtraction.inspect-keep-repair', 'unlike-subtraction.inspect-candidate', 'full-subtraction.inspect-keep-repair'].includes(state.taskContext.patternId) ? 'inspect-comparison-invariant' : 'renaming-side-comparison' }
        : {}),
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

function handleMarkSubtrahendAmount(state, intent) {
  if (intent.type !== 'mark-subtrahend-amount') return null;
  const establishedEncounter = { acknowledged: true };
  const next = advanceSchedule(state, establishedEncounter);
  const classification = {
    kind: 'grouped-removal-triggered',
    actionRole: 'grouped-removal-triggered',
  };
  return assessedSuccess(state, intent, classification, {
    ...next,
    established: {
      ...next.established,
      encounter: establishedEncounter,
      subtractionRemoval: 'marked',
    },
  });
}

function handleEncounter(state, intent) {
  if (intent.type !== 'acknowledge-encounter') return null;
  const established = { acknowledged: true };
  const compact = [PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id);
  const nested = state.episodeDefinition.id === PLAN18_NESTED_DEFINITION_ID;
  const next = advanceSchedule(compact || nested ? {
    ...state,
    established: {
      ...state.established,
      commonDenominator: {
        kind: 'authored-target-context',
        targetDenominator: state.taskContext.targetDenominator,
        source: 'validated-authored-task-context',
        validity: 'valid',
        rendering: 'eligible',
        authoredCoverage: 'authored',
      },
    },
  } : state, established);
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
    established: {
      ...next.established,
      notice: established,
      ...(isPlan20Definition(state.episodeDefinition)
        ? { sharedUnit: sharedUnitFromValidatedContent(state.content) }
        : {}),
    },
  });
}

function handleDecide(state, intent) {
  const identifyRecipe = (isPlan35AdditionRecipeDefinition(state.episodeDefinition) && isPlan35IdentifyRecipe(state.taskContext))
    || (isPlan40SubtractionRecipeDefinition(state.episodeDefinition) && isPlan40IdentifyRecipe(state.taskContext));
  if (state.episodeDefinition.id === PLAN18_NESTED_DEFINITION_ID || identifyRecipe) {
    if (intent.type !== 'select-renaming-side') return null;
    const requiredSide = identifyRecipe ? state.taskContext.requiredSides[0] : state.taskContext.requiredSide;
    if (intent.side !== requiredSide) return recovery(state, intent, { kind: 'side-choice-needs-retry', selectedSide: intent.side, targetDenominator: state.taskContext.targetDenominator });
    const next = advanceSchedule(state, { side: intent.side, targetDenominator: state.taskContext.targetDenominator, source: 'learner-selected-authored-renaming-side' });
    return assessedSuccess(state, intent, { kind: 'correct-renaming-side', selectedSide: intent.side }, {
      ...next, established: { ...next.established, selectedRenamingSide: intent.side },
    });
  }
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
  const compact = [PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id);
  const nested = state.episodeDefinition.id === PLAN18_NESTED_DEFINITION_ID;
  if (!compact && intent.type !== 'submit-equivalent-form') return null;
  if (compact && !['submit-equivalent-form', 'keep-inspected-form', 'repair-inspected-form'].includes(intent.type)) return null;
  const targetDenominator = state.established.commonDenominator.targetDenominator;
  const side = state.expectedResponse.target;
  const inspect = compact && (state.taskContext.patternId === FULL_ADDITION_INSPECT_PATTERN.id
    || ['unlike-subtraction.inspect-keep-repair', 'unlike-subtraction.inspect-candidate', 'full-subtraction.inspect-keep-repair'].includes(state.taskContext.patternId));
  let proposed = intent.proposed;
  let classification;
  let origin = 'learner-constructed';
  if (inspect) {
    const candidate = state.taskContext.candidates[side];
    if (intent.type === 'keep-inspected-form') {
      proposed = candidate;
      classification = classifyInspectedCandidate({ instance: state.content, targetDenominator, side, candidate, action: 'keep' });
      origin = 'authored-then-confirmed';
    } else if (intent.type === 'repair-inspected-form') {
      proposed = { kind: 'fraction', numerator: intent.numerator, denominator: targetDenominator };
      classification = classifyInspectedCandidate({ instance: state.content, targetDenominator, side, candidate, action: 'change-top', proposed });
      origin = classification.kind === 'valid-unchanged-edit'
        ? 'learner-confirmed-unchanged'
        : 'learner-repaired';
    } else {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'inspect transforms require keep or repair intents');
    }
    if (classification.validity !== 'valid') return recovery(state, intent, classification);
  } else {
    classification = classifyConversionResponseForEpisode({ instance: state.content, targetDenominator, side, proposed });
    if (classification.kind !== 'correct-equivalent-form') return recovery(state, intent, classification);
  }
  const establishedConversions = {
    ...state.established.conversions,
    [side]: proposed,
  };
  const established = {
    side,
    form: proposed,
    targetDenominator,
    supportOrigin: state.nextResponseSupport ?? (compact ? origin : 'learner'),
  };
  const isPlan40 = state.episodeDefinition.id === 'phase-3-reusable-subtraction-recipes';
  const nextEntry = state.beatSchedule[state.schedulePosition + 1];
  const advancingToOperate = nextEntry?.kind === 'operate';
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
      ...(compact || nested ? {
        conversionOrigins: { ...next.established.conversionOrigins, [side]: origin },
      } : {}),
      ...(isPlan40 && advancingToOperate ? { subtractionRemoval: 'marked' } : {}),
      lastConversion: established,
    },
    nextResponseSupport: null,
  });
}

function handleOperate(state, intent) {
  if (intent.type !== 'submit-operation-result') return null;
  const targetDenominator = targetDenominatorFor(state);
  const usesOriginalForms = isPlan20Definition(state.episodeDefinition);
  const classification = classifyOperationResponseForEpisode({
    instance: state.content,
    targetDenominator,
    convertedLeft: usesOriginalForms ? null : state.established.conversions.left,
    convertedRight: usesOriginalForms ? null : state.established.conversions.right,
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

function handleSubmitSubtractionResult(state, intent) {
  if (intent.type !== 'submit-subtraction-result') return null;
  const left = fractionFromWire(state.taskContext.sourceForms.left);
  const right = fractionFromWire(state.taskContext.sourceForms.right);
  const proposed = fractionFromWire(intent.proposed);
  const validation = validateOperationResult(proposed, left, right, 'subtract');

  if (validation.validity !== 'valid') {
    const recoveryClassification = {
      kind: 'incorrect-subtraction-result',
      validity: 'invalid',
      mathClassification: validation.classification,
      proposed: intent.proposed,
    };
    return recovery(state, intent, recoveryClassification);
  }

  const isPlan40 = state.episodeDefinition?.id === 'phase-3-reusable-subtraction-recipes';
  const targetDenominator = isPlan40
    ? state.established.commonDenominator.targetDenominator
    : state.taskContext.sourceForms.left.denominator;
  const rawDifference = isPlan40
    ? subtractAtCommonDenominator(left, right, BigInt(targetDenominator))
    : null;
  const rawResultForm = isPlan40
    ? {
      kind: 'fraction',
      numerator: String(rawDifference.numerator),
      denominator: String(rawDifference.denominator),
    }
    : state.content.resultState.canonicalRawResultForm;

  const successClassification = {
    kind: 'learner-supplied-result',
    actionRole: 'learner-supplied-result',
    validity: 'valid',
    mathClassification: validation.classification,
    proposed: intent.proposed,
    rawResultForm,
    submittedForm: intent.proposed,
  };
  const established = {
    ...successClassification,
    proposed: intent.proposed,
    rawResultForm,
    submittedForm: intent.proposed,
    targetDenominator,
  };
  const next = advanceSchedule(state, established);
  return assessedSuccess(state, intent, successClassification, {
    ...next,
    established: { ...next.established, operation: established },
    nextResponseSupport: null,
  });
}

function handleResolve(state, intent) {
  if (isPlan36SubtractionDefinition(state.episodeDefinition)) {
    if (intent.type !== 'finish-compact-episode') return null;
    return assessedSuccess(state, intent, { kind: 'compact-navigation-completed' }, resolvedState(state, { kind: 'navigation-completion' }));
  }
  if (state.episodeDefinition.id === PLAN18_NESTED_DEFINITION_ID) {
    if (intent.type !== 'finish-nested-episode') return null;
    return assessedSuccess(state, intent, { kind: 'nested-navigation-completed' }, resolvedState(state, { kind: 'navigation-completion' }));
  }
  if ([PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id)) {
    if (intent.type !== 'finish-compact-episode') return null;
    return assessedSuccess(state, intent, { kind: 'compact-navigation-completed' }, resolvedState(state, { kind: 'navigation-completion' }));
  }
  if (intent.type !== 'submit-resolution') return null;
  const targetDenominator = targetDenominatorFor(state);
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
  'mark-subtrahend-amount': ['type'],
  'acknowledge-encounter': ['type'],
  'submit-notice': ['type', 'matchesUnits'],
  'propose-common-denominator': ['type', 'proposed'],
  'select-renaming-side': ['type', 'side'],
  'submit-equivalent-form': ['type', 'proposed'],
  'keep-inspected-form': ['type'],
  'repair-inspected-form': ['type', 'numerator'],
  'submit-subtraction-result': ['type', 'proposed'],
  'submit-operation-result': ['type', 'proposed'],
  'submit-resolution': ['type', 'proposed'],
  'finish-compact-episode': ['type'],
  'finish-nested-episode': ['type'],
  'submit-reflection': ['type', 'response'],
  'request-help': ['type'],
  'request-task-help': ['type'],
  'submit-transform-help-multiplier': ['type', 'proposed'],
  'request-replay': ['type'],
  'acknowledge-bridge-encounter': ['type'],
  'propose-number-line-location': ['type', 'proposed'],
});

const INTENT_BEATS = Object.freeze({
  'mark-subtrahend-amount': 'encounter',
  'acknowledge-encounter': 'encounter',
  'submit-notice': 'notice',
  'propose-common-denominator': 'decide',
  'select-renaming-side': 'decide',
  'submit-equivalent-form': 'transform',
  'keep-inspected-form': 'transform',
  'repair-inspected-form': 'transform',
  'submit-subtraction-result': 'operate',
  'submit-operation-result': 'operate',
  'submit-resolution': 'resolve',
  'finish-compact-episode': 'resolve',
  'finish-nested-episode': 'resolve',
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
  if (intent.type === 'select-renaming-side' && !['left', 'right'].includes(intent.side)) throw new EpisodeIntentError('INVALID_INTENT_SHAPE', 'side must be left or right');
  if (intent.type === 'propose-common-denominator') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'submit-equivalent-form') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'repair-inspected-form'
    && (typeof intent.numerator !== 'string' || !/^(0|[1-9][0-9]*)$/.test(intent.numerator))) {
    throw new EpisodeIntentError('INVALID_INTENT_SHAPE', 'repair numerator must be a nonnegative integer string');
  }
  if (intent.type === 'submit-transform-help-multiplier') {
    assertWireFraction(intent.proposed, 'intent.proposed');
    if (intent.proposed.denominator !== '1') {
      throw new EpisodeIntentError('INVALID_INTENT_SHAPE', 'transform-help multiplier must be a whole fraction');
    }
  }
  if (intent.type === 'submit-subtraction-result') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'submit-operation-result') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'submit-resolution') assertWireFraction(intent.proposed, 'intent.proposed');
  if (intent.type === 'propose-number-line-location') assertWireFraction(intent.proposed, 'intent.proposed');
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
  const compact = [PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id);
  const nested = state.episodeDefinition.id === PLAN18_NESTED_DEFINITION_ID;
  const isPlan35 = isPlan35AdditionRecipeDefinition(state.episodeDefinition);
  const isPlan36 = isPlan36SubtractionDefinition(state.episodeDefinition);
  const isPlan40 = isPlan40SubtractionRecipeDefinition(state.episodeDefinition);
  const identify = (isPlan35 && isPlan35IdentifyRecipe(state.taskContext))
    || (isPlan40 && isPlan40IdentifyRecipe(state.taskContext));
  const isInspect = compact && (state.taskContext.patternId === FULL_ADDITION_INSPECT_PATTERN.id
    || ['unlike-subtraction.inspect-keep-repair', 'unlike-subtraction.inspect-candidate', 'full-subtraction.inspect-keep-repair'].includes(state.taskContext.patternId));
  if (isPlan36) {
    if (intent.type === 'acknowledge-encounter') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'like-denominator subtraction does not use acknowledge-encounter');
    }
    if (intent.type === 'submit-operation-result') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'like-denominator subtraction uses submit-subtraction-result');
    }
    if (intent.type === 'request-help') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'Plan 36 subtraction does not use legacy request-help');
    }
    if (intent.type === 'request-replay') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'Plan 36 subtraction does not expose legacy replay actions');
    }
    if (intent.type === 'submit-resolution') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'compact resolve is navigation only');
    }
  }
  if (isPlan40) {
    if (intent.type === 'submit-operation-result') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'reusable subtraction uses submit-subtraction-result');
    }
  }
  if (intent.type === 'mark-subtrahend-amount') {
    if (!isPlan36 || state.beat !== 'encounter' || state.established.subtractionRemoval === 'marked') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'mark-subtrahend-amount is only allowed at encounter in like-denominator subtraction');
    }
  }
  if (intent.type === 'submit-subtraction-result') {
    if ((!isPlan36 && !isPlan40) || state.beat !== 'operate') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'submit-subtraction-result is only valid at operate in subtraction episodes');
    }
    if (state.established.subtractionRemoval !== 'marked') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'submit-subtraction-result requires subtrahend amount to be marked first');
    }
  }
  if ((nested || identify) && intent.type === 'propose-common-denominator' && state.beat === 'decide') {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', 'nested side choice does not accept a common-denominator proposal');
  }
  if (nested && intent.type === 'submit-resolution' && state.beat === 'resolve') {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', 'nested resolve is navigation only');
  }
  if (intent.type === 'select-renaming-side' && (!(nested || identify) || state.beat !== 'decide')) throw new EpisodeIntentError('UNEXPECTED_INTENT', 'side choice is only available at an admitted side-identification decision');
  if (intent.type === 'finish-nested-episode' && (!nested || state.beat !== 'resolve')) throw new EpisodeIntentError('UNEXPECTED_INTENT', 'nested finish is available only at nested resolve');
  const identifyHasConverted = identify && state.taskContext.requiredSides.some((side) => state.established.conversions[side] !== null);
  if (compact && intent.type === 'request-replay' && !identifyHasConverted) {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', 'compact episodes do not expose legacy replay actions');
  }
  if (['keep-inspected-form', 'repair-inspected-form'].includes(intent.type)
    && (!compact || !isInspect || state.beat !== 'transform')) {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', `${intent.type} requires an inspect transform`);
  }
  if (intent.type === 'submit-equivalent-form' && compact
    && isInspect && !identify) {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', 'inspect transforms require keep or repair intents');
  }
  if (intent.type === 'finish-compact-episode' && ((!compact && !isPlan36) || state.beat !== 'resolve')) {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', 'compact finish is available only at compact resolve');
  }
  if (intent.type === 'submit-resolution' && compact) {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', 'compact resolve is navigation only');
  }
  if (['request-task-help', 'submit-transform-help-multiplier'].includes(intent.type)) {
    const plan20OperationHelp = intent.type === 'request-task-help'
      && isPlan20Definition(state.episodeDefinition)
      && state.beat === 'operate';
    const plan36OperateHelp = intent.type === 'request-task-help'
      && isPlan36
      && state.beat === 'operate';
    const plan40OperateHelp = intent.type === 'request-task-help'
      && isPlan40
      && state.beat === 'operate';
    const compactConstructMultiplierHelp = intent.type === 'submit-transform-help-multiplier'
      && [PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id)
      && (state.taskContext.patternId === FULL_ADDITION_CONSTRUCT_PATTERN.id || ['unlike-subtraction.construct-equivalent', 'full-subtraction.construct-equivalent'].includes(state.taskContext.patternId))
      && state.beat === 'transform';
    const nestedTaskHelp = (nested && ((intent.type === 'request-task-help' && ['decide', 'transform'].includes(state.beat))
      || (intent.type === 'submit-transform-help-multiplier' && state.beat === 'transform')))
      || (identify && ((intent.type === 'request-task-help' && ['decide', 'transform'].includes(state.beat))
        || (intent.type === 'submit-transform-help-multiplier' && state.beat === 'transform')));
    if (state.episodeDefinition.revision !== '3'
      && !([PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(state.episodeDefinition.id) && intent.type === 'request-task-help')
      && !compactConstructMultiplierHelp
      && !nestedTaskHelp
      && !(state.episodeDefinition.id === PLAN17_CROSSING_EPISODE_DEFINITION.id
        && state.episodeDefinition.revision === PLAN17_CROSSING_EPISODE_DEFINITION.revision)
      && !plan20OperationHelp
      && !plan36OperateHelp
      && !plan40OperateHelp) {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', `${intent.type} requires episode definition revision 3`);
    }
    if (intent.type === 'submit-transform-help-multiplier' && state.beat !== 'transform') {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'transform help multiplier is valid only during a transform');
    }
    if (intent.type === 'request-task-help'
      && !['decide', 'transform'].includes(state.beat)
      && !plan20OperationHelp
      && !plan36OperateHelp
      && !plan40OperateHelp) {
      throw new EpisodeIntentError('UNEXPECTED_INTENT', 'task help is available only for denominator choice or conversion');
    }
  }
}

function bridgeCandidates(state) {
  if (state.taskContext.supportMode === 'sparse-benchmarks') return state.taskContext.sparseCandidates;
  const denominator = BigInt(state.taskContext.partitionDenominator);
  return Array.from({ length: Number(denominator) + 1 }, (_, stepIndex) => ({
    id: `partition-${stepIndex}-of-${denominator}`,
    form: { kind: 'fraction', numerator: String(stepIndex), denominator: String(denominator) },
  }));
}

function bridgeModeFromSupport(support) {
  const level = support?.dimensions?.fractionBarModel;
  if (level === 'high support') return 'partitioned';
  if (level === 'medium support') return 'sparse-benchmarks';
  throw new EpisodeConstructionError('UNSUPPORTED_BRIDGE_SUPPORT', 'Plan 39 supports high or medium support only');
}

function classifyBridgeRecovery(proposed, target) {
  const proposedMagnitude = classifyMagnitude(proposed);
  const targetMagnitude = classifyMagnitude(target);
  let kind;
  if (equalFractions(proposed, benchmarkFraction('zero'))
    || equalFractions(proposed, benchmarkFraction('one'))) {
    kind = 'at-endpoint';
  } else if ((proposedMagnitude.relativeToHalf === 0) !== (targetMagnitude.relativeToHalf === 0)
    || Math.sign(proposedMagnitude.relativeToHalf) !== Math.sign(targetMagnitude.relativeToHalf)) {
    kind = 'wrong-side-of-half';
  } else {
    kind = compareFractions(proposed, target) < 0 ? 'too-low-same-side' : 'too-high-same-side';
  }
  return {
    kind,
    proposed: { kind: 'fraction', numerator: proposed.numerator.toString(), denominator: proposed.denominator.toString() },
    proposedRegion: proposedMagnitude.benchmarkRegion,
    targetRegion: targetMagnitude.benchmarkRegion,
    comparison: compareFractions(proposed, target),
  };
}

function applyPlan37BridgeIntent(state, intent) {
  const expectedBeat = {
    'acknowledge-bridge-encounter': 'encounter',
    'propose-number-line-location': 'locate',
    'request-task-help': 'locate',
    'finish-compact-episode': 'resolve',
  }[intent.type];
  if (!expectedBeat || state.beat !== expectedBeat) {
    throw new EpisodeIntentError('UNEXPECTED_INTENT', `${intent.type} is not valid at beat ${state.beat}`);
  }
  if (intent.type === 'request-task-help' && state.established.help.locate) return state;
  if (intent.type === 'request-task-help') {
    const next = appendIntent(state, intent);
    const classification = { kind: 'task-help-requested', validity: 'valid', helpKind: 'number-line-location' };
    const withHelp = {
      ...next,
      established: { ...next.established, help: { ...next.established.help, locate: true } },
      supportHistory: [...next.supportHistory, {
        type: 'task-help-request', beat: 'locate', schedulePosition: state.schedulePosition,
        scheduleEntryId: 'locate', side: null, helpKind: 'number-line-location',
      }],
    };
    const provenance = createResponseProvenance({ state, intent, classification, nextState: withHelp });
    return deepFreeze({ ...withHelp, responseProvenance: [...state.responseProvenance, provenance] });
  }
  if (intent.type === 'acknowledge-bridge-encounter') {
    const next = advanceSchedule(state, { kind: 'bridge-encounter-acknowledged', validity: 'valid' });
    return assessedSuccess(state, intent, { kind: 'bridge-encounter-acknowledged', validity: 'valid' }, next);
  }
  if (intent.type === 'propose-number-line-location') {
    const wire = intent.proposed;
    if (!wire || wire.kind !== 'fraction' || typeof wire.numerator !== 'string'
      || !/^(0|[1-9][0-9]*)$/.test(wire.numerator)
      || typeof wire.denominator !== 'string' || !/^[1-9][0-9]*$/.test(wire.denominator)) {
      throw new EpisodeIntentError('INVALID_NUMBER_LINE_CANDIDATE', 'proposal must be a canonical exact wire fraction');
    }
    let proposed;
    try {
      proposed = createFraction(BigInt(wire.numerator), BigInt(wire.denominator));
    } catch {
      throw new EpisodeIntentError('INVALID_NUMBER_LINE_CANDIDATE', 'proposal is outside the exact fraction domain');
    }
    const offered = bridgeCandidates(state).filter((candidate) => (
      candidate.form.numerator === wire.numerator && candidate.form.denominator === wire.denominator
    ));
    if (offered.length !== 1) {
      throw new EpisodeIntentError('UNOFFERED_NUMBER_LINE_CANDIDATE', 'proposal must exactly match one candidate offered in the active support mode');
    }
    const target = plan37SourceFraction(state.content);
    if (!equalFractions(proposed, target)) {
      return recovery(state, intent, classifyBridgeRecovery(proposed, target));
    }
    const acceptedPosition = { kind: 'fraction', numerator: wire.numerator, denominator: wire.denominator };
    const next = advanceSchedule(state, {
      kind: 'accepted-number-line-location',
      proposed: acceptedPosition,
      acceptedPosition,
    });
    next.established = {
      ...next.established,
      numberLineLocation: { acceptedPosition },
    };
    return assessedSuccess(state, intent, {
      kind: 'correct-number-line-location', validity: 'valid', proposed: acceptedPosition,
    }, next);
  }
  const next = resolvedState(state, { kind: 'navigation-completion' });
  return assessedSuccess(state, intent, { kind: 'navigation-completion', validity: 'valid' }, next);
}

export function createEpisode({
  instance,
  episodeDefinition = PHASE2_EPISODE_DEFINITION,
  support = DEFAULT_SUPPORT_CONFIGURATION,
  activeCondition,
  taskContext = null,
  allowCompatibilityPair = false,
} = {}) {
  const definition = assertDefinition(episodeDefinition);
  if (definition.id === PLAN78_ID && definition.revision === '1') return createPlan78Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  if (definition.id === PLAN82_ID && definition.revision === '1') return createPlan82Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  if (definition.id === PLAN74_ID && definition.revision === '1') return createPlan74Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  if (definition.id === PLAN72_ID && definition.revision === '1') return createPlan72Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  if (definition.id === 'phase-4-directed-number-line-endpoint' && definition.revision === '1') {
    return createPlan59Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  }
  if (definition.id === 'phase-4-whole-plus-fraction-construction' && definition.revision === '1') {
    return createPlan58Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  }
  if (definition.id === 'phase-4-two-whole-location' && definition.revision === '1') {
    return createPlan53Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  }
  if (definition.id === 'phase-4-fraction-distance' && definition.revision === '1') return createPlan51Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  if (definition.id === 'phase-4-number-line-collection' && definition.revision === '1') return createPlan50Episode({ taskContext, support, activeCondition, episodeDefinition: definition });
  if (isPlan45ComparisonDefinition(definition)) {
    if (definition.revision === '2') return createPlan49PublicEpisode({ taskContext, support, activeCondition });
    return createPlan45ComparisonEpisode({
      taskContext,
      support,
      activeCondition,
    });
  }
  const content = assertInstance(instance, definition);
  const normalizedSupport = createSupportConfiguration(support);
  const normalizedCondition = validateActiveCondition(activeCondition === undefined
    ? PHASE2_ACTIVE_CONDITION
    : activeCondition);
  const isCompact = [PLAN34_EPISODE_DEFINITION_ID, 'phase-3-reusable-addition-recipes', 'phase-3-reusable-subtraction-recipes'].includes(definition.id);
  const isNested = definition.id === PLAN18_NESTED_DEFINITION_ID;
  const isPlan36 = isPlan36SubtractionDefinition(definition);
  const isPlan40 = isPlan40SubtractionRecipeDefinition(definition);
  const isPlan37Bridge = isPlan37BarToLineBridgeTaskDefinition(definition);
  const bridgeMode = isPlan37Bridge ? bridgeModeFromSupport(normalizedSupport) : null;
  const normalizedTaskContext = isCompact
    ? (isPlan40
      ? validatePlan40SubtractionRecipeContext(content, taskContext)
      : isPlan35AdditionRecipeDefinition(definition)
        ? validatePlan35AdditionRecipeContext(content, taskContext)
        : validatePlan34TaskContext(content, taskContext, { allowCompatibilityPair }))
    : isNested
      ? validatePlan18TaskContext(content, taskContext)
      : isPlan36
        ? validatePlan36LikeDenominatorSubtractionContext(content, taskContext)
        : isPlan37Bridge
          ? validatePlan37BarToLineBridgeContext(content, taskContext, bridgeMode)
          : null;
  if (!isCompact && !isNested && !isPlan36 && !isPlan37Bridge && taskContext !== null) {
    throw new EpisodeConstructionError('UNSUPPORTED_TASK_CONTEXT', 'task context is only supported by the compact full-addition definition');
  }
  const beatSchedule = computeBeatSchedule(content, definition, normalizedTaskContext, { allowCompatibilityPair });
  const firstEntry = beatSchedule[0];
  const initial = {
    schemaVersion: 'fractionflow.episode-state/v1',
    status: 'active',
    revision: 0,
    content,
    episodeDefinition: definition,
    ...(isCompact || isNested || isPlan36 || isPlan37Bridge ? { taskContext: normalizedTaskContext } : {}),
    activeCondition: normalizedCondition,
    beatSchedule,
    schedulePosition: 0,
    support: normalizedSupport,
    beat: firstEntry.kind,
    expectedResponse: responseForEntry(definition, firstEntry, normalizedTaskContext),
    established: {
      encounter: null,
      notice: null,
      commonDenominator: null,
      conversions: { left: null, right: null },
      operation: null,
      resolution: null,
      reflection: null,
      route: 'fraction-bar',
      ...(isPlan20Definition(definition) ? { sharedUnit: null } : {}),
      ...(isCompact ? { compactCompletion: null, conversionOrigins: {} } : {}),
      ...(isNested ? { nestedCompletion: null, selectedRenamingSide: null, conversionOrigins: {} } : {}),
      ...(isPlan36 ? { subtractionRemoval: 'unmarked', compactCompletion: null } : {}),
      ...(isPlan40 ? { subtractionRemoval: 'unmarked', selectedRenamingSide: null } : {}),
      ...(isPlan37Bridge ? { numberLineLocation: null, help: { locate: false } } : {}),
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
  if (state.episodeDefinition?.id === PLAN78_ID && state.episodeDefinition.revision === '1') return applyPlan78Intent(state, rawIntent);
  if (state.episodeDefinition?.id === PLAN82_ID && state.episodeDefinition.revision === '1') return applyPlan82Intent(state, rawIntent);
  if (state.episodeDefinition?.id === PLAN74_ID && state.episodeDefinition.revision === '1') return applyPlan74Intent(state, rawIntent);
  if (state.episodeDefinition?.id === PLAN72_ID && state.episodeDefinition.revision === '1') return applyPlan72Intent(state, rawIntent);
  if (state.episodeDefinition?.id === 'phase-4-directed-number-line-endpoint' && state.episodeDefinition.revision === '1') {
    return applyPlan59Intent(state, rawIntent);
  }
  if (state.episodeDefinition?.id === 'phase-4-whole-plus-fraction-construction' && state.episodeDefinition.revision === '1') {
    return applyPlan58Intent(state, rawIntent);
  }
  if (state.episodeDefinition?.id === 'phase-4-two-whole-location' && state.episodeDefinition.revision === '1') {
    return applyPlan53Intent(state, rawIntent);
  }
  if (state.episodeDefinition?.id === 'phase-4-fraction-distance' && state.episodeDefinition.revision === '1') return applyPlan51Intent(state, rawIntent);
  if (state.episodeDefinition?.id === 'phase-4-number-line-collection' && state.episodeDefinition.revision === '1') return applyPlan50Intent(state, rawIntent);
  if (isPlan45ComparisonEpisode(state)) {
    return state.episodeDefinition.revision === '2' ? applyPlan49PublicIntent(state, rawIntent) : applyPlan45ComparisonIntent(state, rawIntent);
  }
  if (state.status !== 'active') {
    throw new EpisodeIntentError('EPISODE_RESOLVED', 'resolved episodes do not accept more instructional intents');
  }
  const intent = ensureIntent(rawIntent);
  if (isPlan37BarToLineBridgeTaskDefinition(state.episodeDefinition)) {
    return applyPlan37BridgeIntent(state, intent);
  }
  assertIntentAllowedAtBeat(state, intent);
  if (intent.type === 'request-help') return handleHelp(state, intent);
  if (intent.type === 'request-task-help') return handleTaskHelpRequest(state, intent);
  if (intent.type === 'submit-transform-help-multiplier') return handleTransformHelpMultiplier(state, intent);
  if (intent.type === 'request-replay') return handleReplay(state, intent);
  if (intent.type === 'mark-subtrahend-amount') return handleMarkSubtrahendAmount(state, intent);
  if (intent.type === 'acknowledge-encounter') return handleEncounter(state, intent);
  if (intent.type === 'submit-notice') return handleNotice(state, intent);
  if (intent.type === 'propose-common-denominator') return handleDecide(state, intent);
  if (intent.type === 'select-renaming-side') return handleDecide(state, intent);
  if (['submit-equivalent-form', 'keep-inspected-form', 'repair-inspected-form'].includes(intent.type)) return handleTransform(state, intent);
  if (intent.type === 'submit-subtraction-result') return handleSubmitSubtractionResult(state, intent);
  if (intent.type === 'submit-operation-result') return handleOperate(state, intent);
  if (intent.type === 'submit-resolution' || intent.type === 'finish-compact-episode' || intent.type === 'finish-nested-episode') return handleResolve(state, intent);
  if (intent.type === 'submit-reflection') return handleReflect(state, intent);
  throw new EpisodeIntentError('UNEXPECTED_INTENT', `intent ${intent.type} is not valid at beat ${state.beat}`);
}

export function episodeStateSnapshot(state) {
  if (state?.episodeDefinition?.id === 'phase-4-fraction-distance') return deepFreeze(structuredClone(state));
  if (state?.episodeDefinition?.id === 'phase-4-number-line-collection') return deepFreeze(structuredClone(state));
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
  if (state.episodeDefinition?.id === 'phase-4-directed-number-line-endpoint') {
    if (!sameDefinitionValue(normalizedCondition, state.activeCondition)) throw new EpisodeIntentError('UNSUPPORTED_CONDITION', 'endpoint condition is frozen');
    return state;
  }
  if ([PLAN72_ID, PLAN74_ID, PLAN78_ID, PLAN82_ID].includes(state.episodeDefinition?.id)) {
    if (!sameDefinitionValue(normalizedCondition, state.activeCondition)) throw new EpisodeIntentError('UNSUPPORTED_CONDITION', 'addition condition is frozen');
    return state;
  }
  if (state.episodeDefinition?.id === 'phase-4-whole-plus-fraction-construction') {
    if (!sameDefinitionValue(normalizedCondition, state.activeCondition)) throw new EpisodeIntentError('UNSUPPORTED_CONDITION', 'construction condition is frozen');
    return state;
  }
  if (state.episodeDefinition?.id === 'phase-4-two-whole-location') {
    if (!sameDefinitionValue(normalizedCondition, state.activeCondition)) throw new EpisodeIntentError('UNSUPPORTED_CONDITION', 'location condition is frozen');
    return state;
  }
  if (state.episodeDefinition?.id === 'phase-4-fraction-distance') {
    if (!sameDefinitionValue(normalizedCondition, state.activeCondition)) throw new EpisodeIntentError('UNSUPPORTED_CONDITION', 'distance condition is frozen');
    return state;
  }
  if (state.episodeDefinition?.id === 'phase-4-number-line-collection') {
    if (!sameDefinitionValue(normalizedCondition, state.activeCondition)) throw new EpisodeIntentError('UNSUPPORTED_CONDITION', 'collection condition is frozen');
    return state;
  }
  return deepFreeze({
    ...state,
    activeCondition: normalizedCondition,
  });
}

export { evaluateProposedPathEligibility };
