import { deepFreeze } from '../content/schema.js';
import { validatePlan58Context } from '../content/plan58-whole-plus-fraction-task.js';
import { PLAN58_CONDITION, parsePlan58Field, plan58IntentContext } from './plan58-whole-plus-fraction-episode.js';

export function projectPlan58Construction(state) {
  const context = validatePlan58Context(state.taskContext);
  const active = state.status === 'active' && state.beat === 'construct' && state.schedulePosition === 0;
  const resolved = state.status === 'resolved' && state.beat === 'resolve' && state.schedulePosition === 1;
  if (state.episodeDefinition?.id !== 'phase-4-whole-plus-fraction-construction' || state.episodeDefinition.revision !== '1' || JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN58_CONDITION) || !(active || resolved)) throw new TypeError('invalid construction scene state');
  const denominator = Number(context.form.denominator);
  const unit = denominator === 2 ? 'halves' : 'fourths';
  const region = (field, max) => {
    const parsed = parsePlan58Field(state.draft[field], max);
    const count = parsed.value;
    const rows = parsed.status !== 'valid' ? [] : field === 'whole'
      ? Array.from({ length: count }, () => denominator)
      : Array.from({ length: Math.ceil(count / denominator) }, (_, row) => Math.min(denominator, count - row * denominator));
    return { ...parsed, rows };
  };
  const grouping = resolved ? state.established.grouping : null;
  const remainder = grouping?.remainder;
  const hasWhole = grouping && grouping.whole !== '0';
  const hasRemainder = remainder && remainder.numerator !== '0';
  const singular = remainder?.numerator === '1';
  const spokenUnit = denominator === 2 ? (singular ? 'half' : 'halves') : (singular ? 'fourth' : 'fourths');
  const notation = grouping ? { whole: grouping.whole, remainder: grouping.remainder, hasWhole, hasRemainder,
    name: hasWhole && hasRemainder ? `${grouping.whole} and ${remainder.numerator} ${spokenUnit}`
      : hasRemainder ? `${remainder.numerator} ${spokenUnit}` : grouping.whole } : null;
  return deepFreeze({ context: plan58IntentContext(state), status: state.status, draftRevision: state.draftRevision,
    sourceForm: structuredClone(context.form), draft: structuredClone(state.draft),
    unit, pieceLimit: 2 * denominator, regions: { whole: region('whole', 2), pieces: region('pieces', 2 * denominator) },
    evaluation: structuredClone(state.evaluation), support: state.support, helpRequested: state.assistanceHistory.length > 0,
    verification: resolved ? structuredClone(state.established.grouping) : null, notation });
}
