import { deepFreeze } from '../content/schema.js';
import {
  PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION as PLAN45_COMPARISON_EPISODE_DEFINITION,
} from './episode-definition.js';
import {
  PLAN45_COMPARISON_DEFINITION_ID,
  validatePlan45ComparisonContext,
} from '../content/plan45-symbolic-fraction-comparison-task.js';
import { computeBeatSchedule, currentScheduleEntry } from './beat-schedule.js';
import { classifyPlan45FractionComparison } from './classification.js';
import { createPlan45ComparisonResponseProvenance } from './provenance.js';
import {
  createSupportConfiguration,
  DEFAULT_SUPPORT_CONFIGURATION,
  HIGH_SUPPORT_CONFIGURATION,
  MEDIUM_SUPPORT_CONFIGURATION,
} from './support.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION, validateActiveCondition } from './episode-definition.js';

export class Plan45ComparisonIntentError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'Plan45ComparisonIntentError';
    this.code = code;
  }
}

function exactKeys(value, expected) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
}

function assertIntent(intent) {
  if (!intent || typeof intent !== 'object' || Array.isArray(intent)
    || typeof intent.type !== 'string') {
    throw new Plan45ComparisonIntentError('INVALID_INTENT', 'intent must be a typed record');
  }
  if (intent.type === 'request-comparison-model') {
    if (!exactKeys(intent, ['type', 'side']) || !['first', 'second'].includes(intent.side)) {
      throw new Plan45ComparisonIntentError('INVALID_COMPARISON_MODEL_SIDE', 'model side must be exactly first or second');
    }
  } else if (intent.type === 'request-comparison-help') {
    if (!exactKeys(intent, ['type', 'helpKind']) || !['reasoning', 'notation'].includes(intent.helpKind)) {
      throw new Plan45ComparisonIntentError('INVALID_COMPARISON_HELP_KIND', 'help kind must be exactly reasoning or notation');
    }
  } else if (intent.type === 'submit-fraction-comparison') {
    if (!exactKeys(intent, ['type', 'proposed']) || !['<', '=', '>'].includes(intent.proposed)) {
      throw new Plan45ComparisonIntentError('INVALID_RELATION_RESPONSE', 'relation response must be exactly <, =, or >');
    }
  } else {
    throw new Plan45ComparisonIntentError('UNEXPECTED_INTENT', `intent ${intent.type} is not part of the Plan 45 comparison contract`);
  }
  return deepFreeze({ ...intent });
}

function appendIntent(state, intent) {
  return { ...state, intentHistory: [...state.intentHistory, intent], revision: state.revision + 1 };
}

function assertComparisonState(state) {
  if (!state || state.schemaVersion !== 'fractionflow.episode-state/v1'
    || state.episodeDefinition?.id !== PLAN45_COMPARISON_DEFINITION_ID
    || state.episodeDefinition?.revision !== '1') {
    throw new Plan45ComparisonIntentError('INVALID_EPISODE_STATE', 'state is not a Plan 45 comparison episode');
  }
  validatePlan45ComparisonContext(state.taskContext);
  if (!Array.isArray(state.beatSchedule) || state.beatSchedule.length !== 2
    || state.beatSchedule[0]?.id !== 'compare' || state.beatSchedule[1]?.id !== 'resolve'
    || !['compare', 'resolve'].includes(state.beat)
    || !['active', 'resolved'].includes(state.status)
    || (state.status === 'active' && (state.beat !== 'compare' || state.schedulePosition !== 0))
    || (state.status === 'resolved' && (state.beat !== 'resolve' || state.schedulePosition !== 1))
    || !state.assistance || ![null, 'first', 'second'].includes(state.assistance.modelChoice)) {
    throw new Plan45ComparisonIntentError('INVALID_BEAT_SCHEDULE', 'Plan 45 comparison schedule is malformed');
  }
  return state;
}

export function createPlan45ComparisonEpisode({
  taskContext,
  support = DEFAULT_SUPPORT_CONFIGURATION,
  activeCondition = PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION,
} = {}) {
  const context = validatePlan45ComparisonContext(taskContext);
  const normalizedSupport = createSupportConfiguration(support);
  const allowedSupport = [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]
    .map((configuration) => JSON.stringify(createSupportConfiguration(configuration)));
  if (!allowedSupport.includes(JSON.stringify(normalizedSupport))) {
    throw new Plan45ComparisonIntentError('UNSUPPORTED_SUPPORT', 'Plan 45 supports only the existing More and Less support profiles');
  }
  const normalizedCondition = validateActiveCondition(activeCondition);
  if (normalizedCondition.id !== PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION.id
    || normalizedCondition.revision !== PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION.revision
    || normalizedCondition.display !== 'not-applicable'
    || normalizedCondition.choreography !== 'not-applicable'
    || normalizedCondition.promptCadence !== 'D-05-focused-key-beats'
    || normalizedCondition.connectionMaking !== 'not-applicable') {
    throw new Plan45ComparisonIntentError(
      'UNSUPPORTED_COMPARISON_CONDITION',
      'static comparison accepts focused prompt cadence only; transformation display, choreography, and connection conditions do not apply',
    );
  }
  const beatSchedule = computeBeatSchedule(null, PLAN45_COMPARISON_EPISODE_DEFINITION, context);
  return deepFreeze({
    schemaVersion: 'fractionflow.episode-state/v1',
    status: 'active',
    revision: 0,
    episodeDefinition: PLAN45_COMPARISON_EPISODE_DEFINITION,
    taskContext: context,
    activeCondition: normalizedCondition,
    beatSchedule,
    schedulePosition: 0,
    support: normalizedSupport,
    beat: 'compare',
    expectedResponse: {
      promptId: PLAN45_COMPARISON_EPISODE_DEFINITION.promptIdentities.compare,
      beat: 'compare',
      responsibility: 'compare-symbolic-fraction-magnitudes',
      inputKind: 'relation',
      choices: ['<', '=', '>'],
      evidenceCategory: 'supported-construction',
    },
    pendingResponse: null,
    established: { comparison: null },
    completedBeats: [],
    intentHistory: [],
    helpHistory: [],
    replayHistory: [],
    supportHistory: [],
    assistanceHistory: [],
    retryHistory: [],
    responseProvenance: [],
    assistance: { modelChoice: null },
    lastRecovery: null,
  });
}

function appendAssistance(state, intent, event) {
  const withIntent = appendIntent(state, intent);
  return deepFreeze({
    ...withIntent,
    assistanceHistory: [...state.assistanceHistory, event],
  });
}

export function applyPlan45ComparisonIntent(state, rawIntent) {
  assertComparisonState(state);
  if (state.status !== 'active') {
    throw new Plan45ComparisonIntentError('EPISODE_RESOLVED', 'resolved comparison episodes do not accept further instructional intents');
  }
  const intent = assertIntent(rawIntent);
  if (intent.type === 'request-comparison-model') {
    const current = state.assistance.modelChoice;
    if (current === intent.side) return state; // Same-side duplicate: explicit deterministic no-op.
    if (current !== null) {
      throw new Plan45ComparisonIntentError('COMPARISON_MODEL_LOCKED', 'the first requested source model remains selected for this problem attempt');
    }
    const requested = appendAssistance(state, intent, {
      type: 'comparison-model-request', side: intent.side, cueId: state.taskContext.cueId,
    });
    return deepFreeze({
      ...requested,
      assistance: { ...state.assistance, modelChoice: intent.side },
    });
  }
  if (intent.type === 'request-comparison-help') {
    return appendAssistance(state, intent, {
      type: 'comparison-help-request', helpKind: intent.helpKind, cueId: state.taskContext.cueId,
    });
  }

  const classification = classifyPlan45FractionComparison({
    sourceForms: state.taskContext.sourceForms,
    proposed: intent.proposed,
  });
  const withIntent = appendIntent(state, intent);
  const correct = classification.kind === 'correct-comparison';
  const nextState = correct
    ? {
      ...withIntent,
      status: 'resolved',
      beat: 'resolve',
      schedulePosition: 1,
      expectedResponse: null,
      established: {
        comparison: {
          acceptedRelation: intent.proposed,
          sourceForms: state.taskContext.sourceForms,
        },
      },
      completedBeats: [...state.completedBeats, {
        beat: 'compare',
        established: { acceptedRelation: intent.proposed },
        schedulePosition: 0,
        scheduleEntryId: 'compare',
      }],
      lastRecovery: null,
    }
    : {
      ...withIntent,
      retryHistory: [...state.retryHistory, { beat: 'compare', reason: 'comparison-retry' }],
      lastRecovery: {
        beat: 'compare',
        classification: { kind: 'comparison-retry' },
        clearedPendingResponse: false,
      },
    };
  const provenance = createPlan45ComparisonResponseProvenance({ state, intent, classification, nextState });
  return deepFreeze({
    ...nextState,
    responseProvenance: [...state.responseProvenance, provenance],
  });
}

export function isPlan45ComparisonEpisode(state) {
  return state?.episodeDefinition?.id === PLAN45_COMPARISON_DEFINITION_ID
    && ['1', '2'].includes(state?.episodeDefinition?.revision);
}

export function plan45ComparisonStateSnapshot(state) {
  assertComparisonState(state);
  return deepFreeze({
    taskContext: state.taskContext,
    acceptedComparison: state.established.comparison,
    modelChoice: state.assistance.modelChoice,
    assistanceHistory: state.assistanceHistory,
    retryHistory: state.retryHistory,
  });
}

export function currentPlan45ComparisonScheduleEntry(state) {
  assertComparisonState(state);
  return currentScheduleEntry(state);
}
