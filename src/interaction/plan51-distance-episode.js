import { deepFreeze } from '../content/schema.js';
import { admitPlan51Record, validatePlan51Context } from '../content/plan51-distance-task.js';
import { createFraction, equalFractions } from '../math/index.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';

export const PLAN51_CONDITION = deepFreeze({
  id: 'plan51-static-distance', revision: '1', display: 'not-applicable',
  choreography: 'not-applicable', promptCadence: 'D-05-focused-key-beats', connectionMaking: 'not-applicable',
});
const keys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value)
  && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = message => { throw new TypeError(`invalid distance intent: ${message}`); };
const identity = c => ({ setId: c.setId, setRevision: c.setRevision, itemId: c.itemId,
  itemRevision: c.itemRevision, definitionId: c.definitionId, definitionRevision: c.definitionRevision });
export const plan51IntentContext = state => deepFreeze(identity(state.taskContext));

export function createPlan51Episode({ taskContext, support = HIGH_SUPPORT_CONFIGURATION,
  activeCondition = PLAN51_CONDITION, episodeDefinition } = {}) {
  const context = validatePlan51Context(taskContext);
  const profile = createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION].some(value => same(profile, createSupportConfiguration(value)))) fail('unsupported support');
  if (!same(validateActiveCondition(activeCondition), PLAN51_CONDITION)) fail('unsupported condition');
  return deepFreeze({
    schemaVersion: 'fractionflow.episode-state/v1', status: 'active', revision: 0,
    episodeDefinition, taskContext: context, support: profile, activeCondition: PLAN51_CONDITION,
    beatSchedule: ['compare', 'distance', 'resolve'].map(id => ({ id, kind: id })),
    schedulePosition: 0, beat: 'compare', modelChoice: null,
    established: { comparison: null, distance: null }, feedback: null,
    intentHistory: [], assistanceHistory: [], retryHistory: [], responseProvenance: [],
    completedBeats: [], helpHistory: [], replayHistory: [], supportHistory: [],
  });
}

export function applyPlan51Intent(state, intent) {
  if (state?.schemaVersion !== 'fractionflow.episode-state/v1'
    || state.episodeDefinition?.id !== 'phase-4-fraction-distance' || state.episodeDefinition.revision !== '1') fail('state identity');
  const context = validatePlan51Context(state.taskContext);
  if (state.status !== 'active') fail('resolved');
  if (!intent || !keys(intent.context, Object.keys(identity(context)))
    || !Object.keys(identity(context)).every(key => intent.context[key] === identity(context)[key])) fail('context');
  const admitted = admitPlan51Record({ itemId: context.itemId, itemRevision: context.itemRevision, sourceForms: context.sourceForms });
  const eventRevision = state.revision + 1;
  let next = state;
  let verdict = null;
  if (intent.type === 'request-distance-comparison-model' && state.beat === 'compare') {
    if (!keys(intent, ['type', 'context', 'side']) || !['first', 'second'].includes(intent.side)) fail('model');
    if (state.modelChoice && state.modelChoice !== intent.side) fail('model already selected');
    next = { ...state, modelChoice: intent.side,
      assistanceHistory: [...state.assistanceHistory, { kind: 'comparison-model', side: intent.side, eventRevision }] };
  } else if (intent.type === 'request-distance-comparison-help' && state.beat === 'compare') {
    if (!keys(intent, ['type', 'context', 'helpKind']) || !['notation', 'reasoning'].includes(intent.helpKind)) fail('comparison help');
    next = { ...state, assistanceHistory: [...state.assistanceHistory, { kind: 'comparison-help', helpKind: intent.helpKind, eventRevision }] };
  } else if (intent.type === 'submit-distance-comparison' && state.beat === 'compare') {
    if (!keys(intent, ['type', 'context', 'proposed']) || !['<', '=', '>'].includes(intent.proposed)) fail('relation');
    verdict = intent.proposed === admitted.relation ? 'correct' : 'incorrect';
    next = verdict === 'correct'
      ? { ...state, beat: 'distance', schedulePosition: 1, established: { ...state.established, comparison: intent.proposed }, feedback: null }
      : { ...state, feedback: 'incorrect-comparison', retryHistory: [...state.retryHistory, { stage: 'compare', eventRevision }] };
  } else if (intent.type === 'request-distance-help' && state.beat === 'distance') {
    if (!keys(intent, ['type', 'context', 'helpKind']) || !['cue', 'both-amounts'].includes(intent.helpKind)) fail('distance help');
    next = { ...state, assistanceHistory: [...state.assistanceHistory, { kind: 'distance-help', helpKind: intent.helpKind, eventRevision }] };
  } else if (intent.type === 'submit-distance-fraction' && state.beat === 'distance') {
    if (!keys(intent, ['type', 'context', 'numerator', 'denominator'])
      || typeof intent.numerator !== 'string' || typeof intent.denominator !== 'string'
      || !/^(0|[1-9][0-9]{0,17})$/.test(intent.numerator)
      || !/^[1-9][0-9]{0,17}$/.test(intent.denominator)) fail('fraction input');
    const proposed = createFraction(BigInt(intent.numerator), BigInt(intent.denominator));
    verdict = equalFractions(proposed, admitted.distance) ? 'correct' : 'incorrect';
    next = verdict === 'correct'
      ? { ...state, status: 'resolved', beat: 'resolve', schedulePosition: 2,
        established: { ...state.established, distance: { numerator: intent.numerator, denominator: intent.denominator } }, feedback: null }
      : { ...state, feedback: 'incorrect-distance', retryHistory: [...state.retryHistory, { stage: 'distance', eventRevision }] };
  } else fail('unexpected or out-of-stage action');
  if (verdict) next = { ...next, responseProvenance: [...state.responseProvenance,
    { action: structuredClone(intent), stage: state.beat, promptId: state.episodeDefinition.promptIdentities[state.beat], verdict,
      accepted: verdict === 'correct' ? (state.beat === 'compare' ? intent.proposed : { numerator: intent.numerator, denominator: intent.denominator }) : null,
      eventRevision, assistanceHistory: structuredClone(state.assistanceHistory),
      support: state.support, suppliedDistanceCue: state.beat === 'distance' && state.support.label === 'high support' }] };
  return deepFreeze({ ...next, revision: eventRevision, intentHistory: [...state.intentHistory, structuredClone(intent)] });
}
