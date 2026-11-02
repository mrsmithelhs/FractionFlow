import { deepFreeze } from '../content/schema.js';
import { admitPlan58Record, validatePlan58Context } from '../content/plan58-whole-plus-fraction-task.js';
import { createFraction, createMixedNumber, mixedToImproper, equalFractions } from '../math/index.js';
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from './support.js';
import { validateActiveCondition } from './episode-definition.js';

export const PLAN58_CONDITION = deepFreeze({ id: 'plan58-static-construction', revision: '1', display: 'not-applicable', choreography: 'not-applicable', promptCadence: 'D-05-focused-key-beats', connectionMaking: 'not-applicable' });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keys = (o, k) => o && typeof o === 'object' && !Array.isArray(o) && same(Object.keys(o).sort(), [...k].sort());
const fail = message => { throw new TypeError(`invalid construction intent: ${message}`); };
const identity = c => ({ setId: c.setId, setRevision: c.setRevision, itemId: c.itemId, itemRevision: c.itemRevision, definitionId: c.definitionId, definitionRevision: c.definitionRevision });
export const plan58IntentContext = state => deepFreeze(identity(state.taskContext));
export function parsePlan58Field(raw, maximum) {
  if (raw === '') return { status: 'missing', value: null };
  if (typeof raw !== 'string' || raw.length > 32 || !/^[0-9]+$/.test(raw)) return { status: 'malformed', value: null };
  const value = BigInt(raw);
  if (value > BigInt(maximum)) return { status: 'out-of-range', value: null };
  return { status: 'valid', value: Number(value) };
}
export function createPlan58Episode({ taskContext, support = HIGH_SUPPORT_CONFIGURATION, activeCondition = PLAN58_CONDITION, episodeDefinition } = {}) {
  const context = validatePlan58Context(taskContext);
  const profile = createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION].some(s => same(profile, createSupportConfiguration(s)))) fail('support');
  if (!same(validateActiveCondition(activeCondition), PLAN58_CONDITION)) fail('condition');
  return deepFreeze({ schemaVersion: 'fractionflow.episode-state/v1', status: 'active', revision: 0, draftRevision: 0,
    episodeDefinition, taskContext: context, support: profile, activeCondition: PLAN58_CONDITION,
    beatSchedule: [{ id: 'construct', kind: 'construct' }, { id: 'resolve', kind: 'resolve' }], schedulePosition: 0, beat: 'construct',
    draft: { whole: '', pieces: '' }, evaluation: { status: 'unchecked', draftRevision: null, fields: null }, established: { grouping: null },
    intentHistory: [], assistanceHistory: [], retryHistory: [], responseProvenance: [], completedBeats: [], helpHistory: [], replayHistory: [], supportHistory: [] });
}
export function applyPlan58Intent(state, intent) {
  if (state?.schemaVersion !== 'fractionflow.episode-state/v1' || state.episodeDefinition?.id !== 'phase-4-whole-plus-fraction-construction' || state.episodeDefinition.revision !== '1' || state.status !== 'active' || state.beat !== 'construct') fail('state');
  const context = validatePlan58Context(state.taskContext);
  if (!intent || !keys(intent.context, Object.keys(identity(context))) || !Object.keys(identity(context)).every(k => intent.context[k] === identity(context)[k])) fail('context');
  let next = state;
  const eventRevision = state.revision + 1;
  if (intent.type === 'edit-whole-plus-fraction') {
    if (!keys(intent, ['type', 'context', 'field', 'raw']) || !['whole', 'pieces'].includes(intent.field) || typeof intent.raw !== 'string' || intent.raw.length > 32) fail('edit');
    if (state.draft[intent.field] === intent.raw) return state;
    next = { ...state, draft: { ...state.draft, [intent.field]: intent.raw }, draftRevision: state.draftRevision + 1, evaluation: { status: 'unchecked', draftRevision: null, fields: null } };
  } else if (intent.type === 'request-whole-plus-fraction-help') {
    if (!keys(intent, ['type', 'context', 'helpKind']) || intent.helpKind !== 'unit') fail('help');
    next = { ...state, assistanceHistory: [...state.assistanceHistory, { kind: 'unit-help', eventRevision }] };
  } else if (intent.type === 'check-whole-plus-fraction') {
    if (!keys(intent, ['type', 'context', 'revision']) || intent.revision !== state.draftRevision) fail('stale check');
    const d = Number(context.form.denominator);
    const fields = { whole: parsePlan58Field(state.draft.whole, 2), pieces: parsePlan58Field(state.draft.pieces, 2 * d) };
    let status = 'input';
    let grouping = null;
    if (fields.whole.status === 'valid' && fields.pieces.status === 'valid') {
      const mixed = createMixedNumber(fields.whole.value, createFraction(fields.pieces.value, d));
      const source = admitPlan58Record({ itemId: context.itemId, itemRevision: context.itemRevision, purpose: context.purpose, form: context.form }).value;
      status = !equalFractions(mixedToImproper(mixed), source) ? 'incorrect' : fields.pieces.value >= d ? 'organize' : 'accepted';
      if (status === 'accepted') grouping = { whole: String(fields.whole.value), remainder: { numerator: String(fields.pieces.value), denominator: context.form.denominator }, exactValue: { numerator: context.form.numerator, denominator: context.form.denominator } };
    }
    next = { ...state, evaluation: { status, draftRevision: state.draftRevision, fields },
      ...(status === 'incorrect' ? { retryHistory: [...state.retryHistory, { eventRevision }] } : {}),
      ...(grouping ? { status: 'resolved', beat: 'resolve', schedulePosition: 1, established: { grouping }, responseProvenance: [...state.responseProvenance, { action: structuredClone(intent), draft: structuredClone(state.draft), assistanceHistory: structuredClone(state.assistanceHistory), notation: 'app-supplied', eventRevision }] } : {}) };
  } else fail('unknown');
  return deepFreeze({ ...next, revision: eventRevision, intentHistory: [...state.intentHistory, structuredClone(intent)] });
}
