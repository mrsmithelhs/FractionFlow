import { deepFreeze } from "../content/schema.js";
import { admitPlan53Record, validatePlan53Context } from "../content/plan53-two-whole-location-task.js";
import { PLAN53_CONDITION } from "./plan53-two-whole-location-episode.js";
function projectPlan53Location(state) {
  const c = validatePlan53Context(state.taskContext);
  if (state.episodeDefinition?.id !== "phase-4-two-whole-location" || state.episodeDefinition.revision !== "1" || JSON.stringify(state.activeCondition) !== JSON.stringify(PLAN53_CONDITION) || !(state.status === "active" && state.beat === "locate" && state.schedulePosition === 0 || state.status === "resolved" && state.beat === "resolve" && state.schedulePosition === 1)) throw new TypeError("invalid two-whole scene state");
  const a = admitPlan53Record({ itemId: c.itemId, itemRevision: c.itemRevision, purpose: c.purpose, form: c.form });
  return deepFreeze({ context: {setId:c.setId,setRevision:c.setRevision,itemId:c.itemId,itemRevision:c.itemRevision,definitionId:c.definitionId,definitionRevision:c.definitionRevision}, placementRevision:state.placementRevision, status: state.status, sourceForm: structuredClone(c.form), candidates: a.candidates, placement: state.placement, evaluation: state.evaluation, support: state.support, helpRequested: state.assistanceHistory.length > 0, verification: state.status === "resolved" ? a.verification : null });
}
export {
  projectPlan53Location
};
