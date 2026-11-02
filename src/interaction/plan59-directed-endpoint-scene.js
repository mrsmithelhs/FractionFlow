import { deepFreeze } from '../content/schema.js';
import { admitPlan59Record, validatePlan59Context, plan59RecordFromContext } from '../content/plan59-directed-endpoint-task.js';
import { PLAN59_CONDITION, plan59IntentContext } from './plan59-directed-endpoint-episode.js';

export function projectPlan59Endpoint(state) {
  const context = validatePlan59Context(state.taskContext);
  const active = state.status === 'active' && state.beat === 'locate' && state.schedulePosition === 0;
  const resolved = state.status === 'resolved' && state.beat === 'resolve' && state.schedulePosition === 1;
  if (state.episodeDefinition?.id !== 'phase-4-directed-number-line-endpoint'
    || state.episodeDefinition.revision !== '1'
    || JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN59_CONDITION)
    || !(active || resolved)) throw new TypeError('invalid directed endpoint scene state');
  const admitted = admitPlan59Record(plan59RecordFromContext(context));
  return deepFreeze({ context: plan59IntentContext(state), status: state.status,
    placementRevision: state.placementRevision, start: structuredClone(context.start),
    operation: context.operation, amount: structuredClone(context.amount), candidates: admitted.candidates,
    placement: state.placement, evaluation: state.evaluation, support: state.support,
    helpRequested: state.assistanceHistory.length > 0,
    verification: resolved ? admitted.verification : null });
}
