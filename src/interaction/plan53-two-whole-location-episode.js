import { deepFreeze } from "../content/schema.js";
import { admitPlan53Record, validatePlan53Context } from "../content/plan53-two-whole-location-task.js";
import { createSupportConfiguration, HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from "./support.js";
import { validateActiveCondition } from "./episode-definition.js";
const PLAN53_CONDITION = deepFreeze({ id: "plan53-static-location", revision: "1", display: "not-applicable", choreography: "not-applicable", promptCadence: "D-05-focused-key-beats", connectionMaking: "not-applicable" });
const keys = (v, k) => v && typeof v === "object" && !Array.isArray(v) && JSON.stringify(Object.keys(v).sort()) === JSON.stringify([...k].sort());
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const fail = (m) => {
  throw new TypeError(`invalid two-whole intent: ${m}`);
};
const identity = (c) => ({ setId: c.setId, setRevision: c.setRevision, itemId: c.itemId, itemRevision: c.itemRevision, definitionId: c.definitionId, definitionRevision: c.definitionRevision });
const plan53IntentContext = (s) => deepFreeze(identity(s.taskContext));
const record = (c) => ({ itemId: c.itemId, itemRevision: c.itemRevision, purpose: c.purpose, form: c.form });
function createPlan53Episode({ taskContext, support = HIGH_SUPPORT_CONFIGURATION, activeCondition = PLAN53_CONDITION, episodeDefinition } = {}) {
  const c = validatePlan53Context(taskContext), profile = createSupportConfiguration(support);
  if (![HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION].some((x) => same(profile, createSupportConfiguration(x)))) fail("support");
  if (!same(validateActiveCondition(activeCondition), PLAN53_CONDITION)) fail("condition");
  return deepFreeze({ schemaVersion: "fractionflow.episode-state/v1", status: "active", revision: 0, placementRevision: 0, episodeDefinition, taskContext: c, support: profile, activeCondition: PLAN53_CONDITION, beatSchedule: [{ id: "locate", kind: "locate" }, { id: "resolve", kind: "resolve" }], schedulePosition: 0, beat: "locate", placement: null, evaluation: { status: "unchecked", placementRevision: null }, established: { location: null }, intentHistory: [], assistanceHistory: [], retryHistory: [], responseProvenance: [], completedBeats: [], helpHistory: [], replayHistory: [], supportHistory: [] });
}
function applyPlan53Intent(state, intent) {
  if (state?.schemaVersion !== "fractionflow.episode-state/v1" || state.episodeDefinition?.id !== "phase-4-two-whole-location" || state.episodeDefinition.revision !== "1" || state.status !== "active" || state.beat !== "locate") fail("state");
  const c = validatePlan53Context(state.taskContext), context = identity(c), admitted = admitPlan53Record(record(c));
  if (!intent || !keys(intent.context, Object.keys(context)) || !Object.keys(context).every((k) => intent.context[k] === context[k])) fail("context");
  let next = state;
  const eventRevision = state.revision + 1;
  if (intent.type === "place-two-whole") {
    if (!keys(intent, ["type", "context", "candidateId"]) || !admitted.candidates.some((p) => p.id === intent.candidateId)) fail("placement");
    if (state.placement === intent.candidateId) return state;
    next = { ...state, placement: intent.candidateId, placementRevision: state.placementRevision + 1, evaluation: { status: "unchecked", placementRevision: null } };
  } else if (intent.type === "request-two-whole-help") {
    if (!keys(intent, ["type", "context", "helpKind"]) || intent.helpKind !== "placement") fail("help");
    next = { ...state, assistanceHistory: [...state.assistanceHistory, { kind: "placement-help", eventRevision }] };
  } else if (intent.type === "check-two-whole") {
    if (!keys(intent, ["type", "context", "revision"]) || intent.revision !== state.placementRevision) fail("stale check");
    const status = state.placement === null ? "incomplete" : state.placement === admitted.correctPosition ? "accepted" : "incorrect";
    next = { ...state, evaluation: { status, placementRevision: state.placementRevision }, ...status === "incorrect" ? { retryHistory: [...state.retryHistory, { eventRevision }] } : {}, ...status === "accepted" ? { status: "resolved", beat: "resolve", schedulePosition: 1, established: { location: state.placement }, responseProvenance: [...state.responseProvenance, { action: structuredClone(intent), placement: state.placement, assistanceHistory: structuredClone(state.assistanceHistory), eventRevision }] } : {} };
  } else fail("unknown");
  return deepFreeze({ ...next, revision: eventRevision, intentHistory: [...state.intentHistory, structuredClone(intent)] });
}
export {
  PLAN53_CONDITION,
  applyPlan53Intent,
  createPlan53Episode,
  plan53IntentContext
};
