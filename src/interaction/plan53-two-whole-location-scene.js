import { deepFreeze } from '../content/schema.js';
import { admitPlan53Record, validatePlan53Context } from '../content/plan53-two-whole-location-task.js';
import { PLAN53_CONDITION } from './plan53-two-whole-location-episode.js';

export function projectPlan53Location(state) {
  const context = validatePlan53Context(state.taskContext);
  const active = state.status === 'active' && state.beat === 'locate' && state.schedulePosition === 0;
  const resolved = state.status === 'resolved' && state.beat === 'resolve' && state.schedulePosition === 1;
  if (state.episodeDefinition?.id !== 'phase-4-two-whole-location'
    || state.episodeDefinition.revision !== '1'
    || JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN53_CONDITION)
    || !(active || resolved)) throw new TypeError('invalid two-whole scene state');
  const admitted = admitPlan53Record({
    itemId: context.itemId, itemRevision: context.itemRevision,
    purpose: context.purpose, form: context.form,
  });
  return deepFreeze({
    context: {
      setId: context.setId, setRevision: context.setRevision, itemId: context.itemId,
      itemRevision: context.itemRevision, definitionId: context.definitionId,
      definitionRevision: context.definitionRevision,
    },
    placementRevision: state.placementRevision, status: state.status,
    sourceForm: structuredClone(context.form), candidates: admitted.candidates,
    placement: state.placement, evaluation: state.evaluation, support: state.support,
    helpRequested: state.assistanceHistory.length > 0,
    verification: resolved ? admitted.verification : null,
  });
}
