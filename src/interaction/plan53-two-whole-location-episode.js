import { deepFreeze } from '../content/schema.js';
import { admitPlan53Record, validatePlan53Context } from '../content/plan53-two-whole-location-task.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';

export const PLAN53_CONDITION = deepFreeze({
  id: 'plan53-static-location', revision: '1', display: 'not-applicable',
  choreography: 'not-applicable', promptCadence: 'D-05-focused-key-beats', connectionMaking: 'not-applicable',
});
const keys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value)
  && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = message => { throw new TypeError(`invalid two-whole intent: ${message}`); };
const identity = context => ({
  setId: context.setId, setRevision: context.setRevision, itemId: context.itemId,
  itemRevision: context.itemRevision, definitionId: context.definitionId, definitionRevision: context.definitionRevision,
});
export const plan53IntentContext = state => deepFreeze(identity(state.taskContext));
const record = context => ({ itemId: context.itemId, itemRevision: context.itemRevision, purpose: context.purpose, form: context.form });

export function createPlan53Episode({ taskContext, support = HIGH_SUPPORT_CONFIGURATION,
  activeCondition = PLAN53_CONDITION, episodeDefinition } = {}) {
  const context = validatePlan53Context(taskContext);
  const profile = createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION].some(value => same(profile, createSupportConfiguration(value)))) fail('support');
  if (!same(validateActiveCondition(activeCondition), PLAN53_CONDITION)) fail('condition');
  return deepFreeze({
    schemaVersion: 'fractionflow.episode-state/v1', status: 'active', revision: 0, placementRevision: 0,
    episodeDefinition, taskContext: context, support: profile, activeCondition: PLAN53_CONDITION,
    beatSchedule: [{ id: 'locate', kind: 'locate' }, { id: 'resolve', kind: 'resolve' }],
    schedulePosition: 0, beat: 'locate', placement: null,
    evaluation: { status: 'unchecked', placementRevision: null }, established: { location: null },
    intentHistory: [], assistanceHistory: [], retryHistory: [], responseProvenance: [],
    completedBeats: [], helpHistory: [], replayHistory: [], supportHistory: [],
  });
}
export function applyPlan53Intent(state, intent) {
  if (state?.schemaVersion !== 'fractionflow.episode-state/v1'
    || state.episodeDefinition?.id !== 'phase-4-two-whole-location'
    || state.episodeDefinition.revision !== '1' || state.status !== 'active' || state.beat !== 'locate') fail('state');
  const context = validatePlan53Context(state.taskContext);
  const expectedContext = identity(context);
  const admitted = admitPlan53Record(record(context));
  if (!intent || !keys(intent.context, Object.keys(expectedContext))
    || !Object.keys(expectedContext).every(key => intent.context[key] === expectedContext[key])) fail('context');
  let next = state;
  const eventRevision = state.revision + 1;
  if (intent.type === 'place-two-whole') {
    if (!keys(intent, ['type', 'context', 'candidateId'])
      || !admitted.candidates.some(candidate => candidate.id === intent.candidateId)) fail('placement');
    if (state.placement === intent.candidateId) return state;
    next = { ...state, placement: intent.candidateId, placementRevision: state.placementRevision + 1,
      evaluation: { status: 'unchecked', placementRevision: null } };
  } else if (intent.type === 'request-two-whole-help') {
    if (!keys(intent, ['type', 'context', 'helpKind']) || intent.helpKind !== 'placement') fail('help');
    next = { ...state, assistanceHistory: [...state.assistanceHistory, { kind: 'placement-help', eventRevision }] };
  } else if (intent.type === 'check-two-whole') {
    if (!keys(intent, ['type', 'context', 'revision']) || intent.revision !== state.placementRevision) fail('stale check');
    const status = state.placement === null ? 'incomplete'
      : state.placement === admitted.correctPosition ? 'accepted' : 'incorrect';
    next = { ...state, evaluation: { status, placementRevision: state.placementRevision },
      ...(status === 'incorrect' ? { retryHistory: [...state.retryHistory, { eventRevision }] } : {}),
      ...(status === 'accepted' ? {
        status: 'resolved', beat: 'resolve', schedulePosition: 1, established: { location: state.placement },
        responseProvenance: [...state.responseProvenance, {
          action: structuredClone(intent), placement: state.placement,
          assistanceHistory: structuredClone(state.assistanceHistory), eventRevision,
        }],
      } : {}),
    };
  } else fail('unknown');
  return deepFreeze({ ...next, revision: eventRevision, intentHistory: [...state.intentHistory, structuredClone(intent)] });
}
