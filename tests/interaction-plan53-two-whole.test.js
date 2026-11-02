import { describe, it, expect } from "vitest";
import { PLAN53_RECORDS } from "../src/content/data/plan53-two-whole-location-records.js";
import { admitPlan53Record, resolvePlan53Context, validatePlan53Context } from "../src/content/plan53-two-whole-location-task.js";
import { getEpisodeDefinition } from "../src/interaction/episode-definition.js";
import { createEpisode, applyIntent, withActiveCondition } from "../src/interaction/episode.js";
import { plan53IntentContext } from "../src/interaction/plan53-two-whole-location-episode.js";
import { projectPlan53Location } from "../src/interaction/plan53-two-whole-location-scene.js";
import { createReplayEnvelope, replayEpisode } from "../src/interaction/replay.js";
import { MEDIUM_SUPPORT_CONFIGURATION } from "../src/interaction/support.js";
const definition = getEpisodeDefinition("phase-4-two-whole-location", "1");
const start = (id, support) => createEpisode({ episodeDefinition: definition, taskContext: resolvePlan53Context(id), ...support ? { support } : {} });
const send = (s, type, extra = {}) => applyIntent(s, { type, context: plan53IntentContext(s), ...extra });
const place = (s, i) => send(s, "place-two-whole", { candidateId: `step-${i}` });
const check = (s) => send(s, "check-two-whole", { revision: s.placementRevision });
const roundtrip = (s) => expect(replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(s))))).toEqual(s);
describe("Plan 53 pure location", () => {
  it("derives every authored record and accepts only after Check, for both support settings", () => {
    const expected = [["step-0", "0", "0"], ["step-3", "0", "3"], ["step-4", "1", "0"], ["step-5", "1", "1"], ["step-6", "1", "2"], ["step-3", "1", "1"], ["step-8", "2", "0"], ["step-10", "1", "2"]];
    PLAN53_RECORDS.forEach((r, i) => {
      const a = admitPlan53Record(r);
      expect([a.correctPosition, a.verification.whole, a.verification.remainder.numerator], "WITNESS_BOUNDARY_INDEX").toEqual(expected[i]);
      expect(a.candidates).toHaveLength(2 * Number(r.form.denominator) + 1);
      for (const support of [void 0, MEDIUM_SUPPORT_CONFIGURATION]) {
        let s = start(r.itemId, support);
        expect(projectPlan53Location(s).verification, "WITNESS_PREMATURE_VERIFICATION").toBeNull();
        s = place(s, Number(r.form.numerator));
        expect(s.status).toBe("active");
        expect(projectPlan53Location(s).placement).toBe(expected[i][0]);
        expect(projectPlan53Location(s).verification, "WITNESS_PREMATURE_VERIFICATION").toBeNull();
        s = check(s);
        expect(s.status).toBe("resolved");
        expect(projectPlan53Location(s).verification).toEqual(a.verification);
        roundtrip(s);
      }
    });
  });
  it("rejects bad admission and changed or unregistered contexts", () => {
    const base = PLAN53_RECORDS[0];
    for (const f of [{ numerator: "-1", denominator: "4" }, { numerator: "9", denominator: "4" }, { numerator: "1", denominator: "3" }, { numerator: "01", denominator: "4" }, { numerator: 1, denominator: "4" }, { numerator: "1", denominator: "0" }]) expect(() => admitPlan53Record({ ...base, form: f })).toThrow();
    expect(() => resolvePlan53Context("unknown")).toThrow();
    const c = structuredClone(resolvePlan53Context("zero-fourths"));
    c.form.numerator = "1";
    expect(() => validatePlan53Context(c)).toThrow();
  });
  it("preserves incorrect, revision and assistance; withholds truth; rejects stale and foreign intents", () => {
    let s = start("six-fourths");
    roundtrip(s);
    s = check(s);
    expect(s.evaluation.status).toBe("incomplete");
    s = place(s, 5);
    s = check(s);
    expect(s.evaluation.status).toBe("incorrect");
    expect(projectPlan53Location(s).verification, "WITNESS_PREMATURE_VERIFICATION").toBeNull();
    roundtrip(s);
    s = send(s, "request-two-whole-help", { helpKind: "placement" });
    const rev = s.placementRevision;
    s = place(s, 6);
    expect(s.evaluation.status).toBe("unchecked");
    expect(s.assistanceHistory, "WITNESS_ASSISTANCE_HISTORY").toHaveLength(1);
    expect(() => send(s, "check-two-whole", { revision: rev })).toThrow();
    expect(() => applyIntent(s, { type: "place-two-whole", context: { ...plan53IntentContext(s), itemId: "three-halves" }, candidateId: "step-3" })).toThrow();
    expect(() => place(s, 9)).toThrow();
    roundtrip(s);
    s = check(s);
    expect(s.status).toBe("resolved");
    expect(() => place(s, 3)).toThrow();
    roundtrip(s);
    expect(withActiveCondition(s, s.activeCondition)).toBe(s);
    expect(() => withActiveCondition(s, { ...s.activeCondition, display: "other" })).toThrow();
  });
  it("rejects malformed and cross-version replay", () => {
    const e = JSON.parse(JSON.stringify(createReplayEnvelope(start("five-fourths"))));
    for (const mutate of [(x) => x.contentIdentity.id = "zero-fourths", (x) => x.taskContext.form.numerator = "2", (x) => x.extra = true, (x) => x.schemaVersion = "fractionflow.episode-replay/v12", (x) => x.learnerIntents = {}]) {
      const b = structuredClone(e);
      mutate(b);
      expect(() => replayEpisode(b)).toThrow();
    }
  });
});
