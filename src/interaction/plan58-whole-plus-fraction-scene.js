import { deepFreeze } from '../content/schema.js';
import { validatePlan58Context } from '../content/plan58-whole-plus-fraction-task.js';
import { PLAN58_CONDITION, parsePlan58Field, plan58IntentContext } from './plan58-whole-plus-fraction-episode.js';

export function projectPlan58Construction(state) {
  const context = validatePlan58Context(state.taskContext);
  const active = state.status === 'active' && state.beat === 'construct' && state.schedulePosition === 0;
  const resolved = state.status === 'resolved' && state.beat === 'resolve' && state.schedulePosition === 1;
  if (state.episodeDefinition?.id !== 'phase-4-whole-plus-fraction-construction' || state.episodeDefinition.revision !== '1' || JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN58_CONDITION) || !(active || resolved)) throw new TypeError('invalid construction scene state');
  const denominator = Number(context.form.denominator);
  return deepFreeze({ context: plan58IntentContext(state), status: state.status, draftRevision: state.draftRevision,
    sourceForm: structuredClone(context.form), draft: structuredClone(state.draft),
    regions: { whole: parsePlan58Field(state.draft.whole, 2), pieces: parsePlan58Field(state.draft.pieces, 2 * denominator) },
    evaluation: structuredClone(state.evaluation), support: state.support, helpRequested: state.assistanceHistory.length > 0,
    verification: resolved ? structuredClone(state.established.grouping) : null });
}
