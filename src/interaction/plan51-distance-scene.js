import { deepFreeze } from '../content/schema.js';
import { admitPlan51Record, validatePlan51Context } from '../content/plan51-distance-task.js';
import { PLAN51_CONDITION } from './plan51-distance-episode.js';

// Pure task-specific projection. The common scene router is integrated after checkpoint approval.
export function projectPlan51Distance(state) {
  const context = validatePlan51Context(state.taskContext);
  const validPhase = (state.status === 'active' && state.beat === 'compare' && state.schedulePosition === 0)
    || (state.status === 'active' && state.beat === 'distance' && state.schedulePosition === 1)
    || (state.status === 'resolved' && state.beat === 'resolve' && state.schedulePosition === 2);
  if (state.episodeDefinition?.id !== 'phase-4-fraction-distance' || state.episodeDefinition.revision !== '1'
    || JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN51_CONDITION) || !validPhase) {
    throw new TypeError('invalid distance scene state');
  }
  const asked = (kind, helpKind) => state.assistanceHistory.some(event => event.kind === kind && event.helpKind === helpKind);
  const result = {
    stage: state.beat, status: state.status, sourceForms: structuredClone(context.sourceForms),
    feedback: state.feedback, support: state.support,
    acceptedRelation: state.established.comparison,
    acceptedDistance: state.established.distance,
    modelChoice: state.beat === 'compare' ? state.modelChoice : null,
    comparisonHelp: state.beat === 'compare' ? ([...state.assistanceHistory].reverse().find(event => event.kind === 'comparison-help')?.helpKind ?? null) : null,
    distanceCue: state.beat === 'distance' && (state.support.label === 'high support' || asked('distance-help', 'cue')),
    pairedAmounts: state.beat === 'resolve' || (state.beat === 'distance' && asked('distance-help', 'both-amounts')),
    distanceRange: null,
  };
  if (state.beat === 'resolve') {
    result.distanceRange = admitPlan51Record({ itemId: context.itemId, itemRevision: context.itemRevision, sourceForms: context.sourceForms }).range;
  }
  return deepFreeze(result);
}
