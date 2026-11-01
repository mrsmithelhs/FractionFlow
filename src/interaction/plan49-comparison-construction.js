/** Isolated Plan 49 pure contract. Not registered for mounted use or replay yet. */
import { deepFreeze } from '../content/schema.js';
import { resolvePlan45ComparisonContext, validatePlan45ComparisonContext, plan45ComparisonHelpText } from '../content/plan45-symbolic-fraction-comparison-task.js';
import { createPlan45ComparisonEpisode, applyPlan45ComparisonIntent } from './plan45-comparison-episode.js';
import { createFraction, validateCommonDenominator, validateEquivalentFraction, scaleFactorForDenominator } from '../math/index.js';

export const PLAN49_DEFINITION = deepFreeze({ id: 'phase-4-symbolic-fraction-comparison', revision: '2' });
export const PLAN49_WORKSPACE_LIMIT = 144n;
const emptyWork = (epoch = 0) => ({ epoch, phase: 'inactive', target: null, acceptedForms: { first: null, second: null }, multiplier: null, recovery: null });
const keys = (x, expected) => x && typeof x === 'object' && !Array.isArray(x) && JSON.stringify(Object.keys(x).sort()) === JSON.stringify(expected.slice().sort());
const form = f => createFraction(BigInt(f.numerator), BigInt(f.denominator));
const whole = value => typeof value === 'string' && /^(0|[1-9][0-9]{0,29})$/.test(value);
const fail = message => { throw new TypeError(message); };

export function resolvePlan49Context(itemId) {
  return deepFreeze({ ...resolvePlan45ComparisonContext(itemId), definitionRevision: '2' });
}
export function validatePlan49Context(context) {
  if (!context || context.definitionRevision !== '2') fail('Plan 49 requires revision 2 context');
  validatePlan45ComparisonContext({ ...context, definitionRevision: '1' });
  return deepFreeze({ ...context });
}
export function createPlan49Episode({ taskContext, support, activeCondition } = {}) {
  const context = validatePlan49Context(taskContext);
  const base = createPlan45ComparisonEpisode({ taskContext: { ...context, definitionRevision: '1' }, support, activeCondition });
  return deepFreeze({ definition: PLAN49_DEFINITION, taskContext: context, base, construction: emptyWork(), intentHistory: [], assistanceHistory: [], attempts: [] });
}
function nextSide(work, sources) {
  const acceptedForms = { ...work.acceptedForms };
  for (const side of ['first', 'second']) {
    if (!acceptedForms[side] && sources[side].denominator === work.target) acceptedForms[side] = sources[side];
    if (!acceptedForms[side]) return { ...work, acceptedForms, phase: side, multiplier: null, recovery: null };
  }
  return { ...work, acceptedForms, phase: 'ready', multiplier: null, recovery: null };
}
function record(state, intent, construction, event = null, attempt = null) {
  return deepFreeze({ ...state, construction, intentHistory: [...state.intentHistory, intent],
    assistanceHistory: event ? [...state.assistanceHistory, event] : state.assistanceHistory,
    attempts: attempt ? [...state.attempts, attempt] : state.attempts });
}
export function applyPlan49Intent(state, intent) {
  if (state?.definition?.revision !== '2' || state.base.status !== 'active') fail('active revision 2 episode required');
  validatePlan49Context(state.taskContext);
  if (!intent || typeof intent.type !== 'string') fail('typed intent required');
  const w = state.construction;
  const sources = state.taskContext.sourceForms;
  if (['request-comparison-model', 'request-comparison-help', 'submit-fraction-comparison'].includes(intent.type)) {
    // Preserve the legacy reducer's validation/model lock and retain actual construction assistance in relation provenance.
    const baseForAction = intent.type === 'submit-fraction-comparison'
      ? { ...state.base, assistanceHistory: state.assistanceHistory } : state.base;
    const applied = applyPlan45ComparisonIntent(baseForAction, intent);
    if (applied === state.base) return state;
    const base = intent.type === 'submit-fraction-comparison' ? { ...applied, assistanceHistory: state.base.assistanceHistory,
      responseProvenance: applied.responseProvenance.map((entry, index) => index === applied.responseProvenance.length - 1
        ? { ...entry, episodeDefinition: PLAN49_DEFINITION, taskContext: state.taskContext } : entry) } : applied;
    const addedAssistance = intent.type === 'submit-fraction-comparison' ? [] : applied.assistanceHistory.slice(state.base.assistanceHistory.length);
    return deepFreeze({ ...state, base, assistanceHistory: [...state.assistanceHistory, ...addedAssistance], intentHistory: [...state.intentHistory, intent] });
  }
  if (intent.type === 'open-comparison-construction') {
    if (!keys(intent, ['type'])) fail('invalid open intent');
    if (w.phase !== 'inactive') return state;
    return record(state, intent, { ...w, phase: 'denominator' }, { type: 'construction-opened' });
  }
  if (intent.type === 'revise-comparison-denominator') {
    if (!keys(intent, ['type']) || !['first', 'second', 'ready'].includes(w.phase)) fail('target revision unavailable');
    return record(state, intent, { ...emptyWork(w.epoch + 1), phase: 'denominator', recovery: 'dependent-work-cleared' }, { type: 'construction-target-revised' });
  }
  if (intent.type === 'request-comparison-construction-help') {
    if (!keys(intent, ['type', 'helpKind', 'phase']) || intent.phase !== w.phase || !((w.phase === 'denominator' && intent.helpKind === 'denominator') || (['first', 'second'].includes(w.phase) && intent.helpKind === 'multiplier' && w.multiplier === null))) fail('help unavailable for phase');
    if (state.assistanceHistory.some(e => e.type === 'construction-help' && e.phase === w.phase && e.target === w.target && e.epoch === w.epoch)) return state;
    return record(state, intent, w, { type: 'construction-help', helpKind: intent.helpKind, phase: w.phase, target: w.target, epoch: w.epoch });
  }
  const types = { 'submit-comparison-denominator': 'denominator', 'submit-comparison-multiplier': 'side', 'submit-comparison-numerator': 'side' };
  if (!Object.hasOwn(types, intent.type) || !keys(intent, ['type', 'phase', 'proposed']) || intent.phase !== w.phase || !whole(intent.proposed) || (types[intent.type] === 'denominator' ? w.phase !== 'denominator' : !['first', 'second'].includes(w.phase))) fail('invalid or stale construction submission');
  const value = BigInt(intent.proposed);
  let updated = w;
  let outcome;
  if (intent.type === 'submit-comparison-denominator') {
    const result = validateCommonDenominator(value, form(sources.first), form(sources.second));
    outcome = result.validity !== 'valid' ? 'not-common' : value > PLAN49_WORKSPACE_LIMIT ? 'unavailable' : 'accepted';
    updated = outcome === 'accepted' ? nextSide({ ...w, target: intent.proposed, recovery: null }, sources) : { ...w, recovery: outcome };
  } else if (intent.type === 'submit-comparison-multiplier') {
    if (w.multiplier !== null || !state.assistanceHistory.some(e => e.type === 'construction-help' && e.helpKind === 'multiplier' && e.phase === w.phase && e.target === w.target && e.epoch === w.epoch)) fail('multiplier help not requested or already accepted');
    outcome = value === scaleFactorForDenominator(form(sources[w.phase]), BigInt(w.target)) ? 'accepted' : 'incorrect';
    updated = { ...w, multiplier: outcome === 'accepted' ? intent.proposed : null, recovery: outcome === 'accepted' ? null : 'incorrect-multiplier' };
  } else {
    const proposed = createFraction(value, BigInt(w.target));
    outcome = validateEquivalentFraction(proposed, form(sources[w.phase]), BigInt(w.target)).validity === 'valid' ? 'accepted' : 'incorrect';
    updated = outcome === 'accepted' ? nextSide({ ...w, acceptedForms: { ...w.acceptedForms, [w.phase]: { numerator: intent.proposed, denominator: w.target } } }, sources) : { ...w, recovery: 'incorrect-numerator' };
  }
  return record(state, intent, updated, { type: 'construction-attempt', phase: w.phase, action: intent.type, outcome }, { phase: w.phase, action: intent.type, proposed: intent.proposed, outcome });
}
export function projectPlan49Construction(state) {
  const w = state.construction;
  const helper = state.assistanceHistory.some(e => e.type === 'construction-help' && e.phase === w.phase && e.target === w.target && e.epoch === w.epoch);
  return deepFreeze({ phase: w.phase, target: w.target, acceptedForms: w.acceptedForms, recovery: w.recovery,
    helpRequested: helper, acceptedMultiplier: w.multiplier,
    sourceForms: state.taskContext.sourceForms, modelChoice: state.base.assistance.modelChoice,
    reasoningCue: state.base.assistanceHistory.some(e => e.type === 'comparison-help-request' && e.helpKind === 'reasoning')
      ? (state.taskContext.hintContext.kind === 'common-unit-target' ? 'Try naming both amounts with the same-size parts.' : plan45ComparisonHelpText(state.base.taskContext, 'reasoning')) : null,
    acceptedRelation: state.base.status === 'resolved' ? state.base.established.comparison.acceptedRelation : null });
}
