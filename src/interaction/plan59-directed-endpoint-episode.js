import { deepFreeze } from '../content/schema.js';
import { admitPlan59Record, validatePlan59Context, plan59RecordFromContext } from '../content/plan59-directed-endpoint-task.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';

export const PLAN59_CONDITION = deepFreeze({ id: 'plan59-static-endpoint', revision: '1',
  display: 'not-applicable', choreography: 'not-applicable',
  promptCadence: 'D-05-focused-key-beats', connectionMaking: 'not-applicable' });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value)
  && same(Object.keys(value).sort(), [...expected].sort());
const fail = message => { throw new TypeError(`invalid directed endpoint intent: ${message}`); };
const identity = context => ({ setId: context.setId, setRevision: context.setRevision,
  itemId: context.itemId, itemRevision: context.itemRevision,
  definitionId: context.definitionId, definitionRevision: context.definitionRevision });
export const plan59IntentContext = state => deepFreeze(identity(state.taskContext));

export function createPlan59Episode({ taskContext, support = HIGH_SUPPORT_CONFIGURATION,
  activeCondition = PLAN59_CONDITION, episodeDefinition } = {}) {
  const context = validatePlan59Context(taskContext);
  const profile = createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION].some(value => same(profile, createSupportConfiguration(value)))) fail('support');
  if (!same(validateActiveCondition(activeCondition), PLAN59_CONDITION)) fail('condition');
  return deepFreeze({ schemaVersion: 'fractionflow.episode-state/v1', status: 'active', revision: 0,
    placementRevision: 0, episodeDefinition, taskContext: context, support: profile, activeCondition: PLAN59_CONDITION,
    beatSchedule: [{ id: 'locate', kind: 'locate' }, { id: 'resolve', kind: 'resolve' }],
    schedulePosition: 0, beat: 'locate', placement: null,
    evaluation: { status: 'unchecked', placementRevision: null }, established: { endpoint: null },
    intentHistory: [], assistanceHistory: [], retryHistory: [], responseProvenance: [],
    completedBeats: [], helpHistory: [], replayHistory: [], supportHistory: [] });
}
export function applyPlan59Intent(state, intent) {
  if (state?.schemaVersion !== 'fractionflow.episode-state/v1'
    || state.episodeDefinition?.id !== 'phase-4-directed-number-line-endpoint'
    || state.episodeDefinition.revision !== '1' || state.status !== 'active' || state.beat !== 'locate') fail('state');
  const context = validatePlan59Context(state.taskContext);
  const expected = identity(context);
  if (!intent || !keys(intent.context, Object.keys(expected))
    || !Object.keys(expected).every(key => intent.context[key] === expected[key])) fail('context');
  const admitted = admitPlan59Record(plan59RecordFromContext(context));
  const eventRevision = state.revision + 1;
  let next;
  if (intent.type === 'place-directed-endpoint') {
    if (!keys(intent, ['type', 'context', 'candidateId'])
      || !admitted.candidates.some(candidate => candidate.id === intent.candidateId)) fail('placement');
    if (state.placement === intent.candidateId) return state;
    next = { ...state, placement: intent.candidateId, placementRevision: state.placementRevision + 1,
      evaluation: { status: 'unchecked', placementRevision: null } };
  } else if (intent.type === 'request-directed-endpoint-help') {
    if (!keys(intent, ['type', 'context', 'helpKind']) || intent.helpKind !== 'placement') fail('help');
    next = { ...state, assistanceHistory: [...state.assistanceHistory, { kind: 'placement-help', eventRevision }] };
  } else if (intent.type === 'check-directed-endpoint') {
    if (!keys(intent, ['type', 'context', 'revision']) || intent.revision !== state.placementRevision) fail('stale check');
    const status = state.placement === null ? 'incomplete'
      : state.placement === admitted.correctPosition ? 'accepted' : 'incorrect';
    next = { ...state, evaluation: { status, placementRevision: state.placementRevision },
      ...(status === 'incorrect' ? { retryHistory: [...state.retryHistory, { eventRevision }] } : {}),
      ...(status === 'accepted' ? { status: 'resolved', beat: 'resolve', schedulePosition: 1,
        established: { endpoint: state.placement }, responseProvenance: [...state.responseProvenance, {
          action: structuredClone(intent), placement: state.placement,
          assistanceHistory: structuredClone(state.assistanceHistory), eventRevision }] } : {}) };
  } else fail('unknown');
  return deepFreeze({ ...next, revision: eventRevision, intentHistory: [...state.intentHistory, structuredClone(intent)] });
}
