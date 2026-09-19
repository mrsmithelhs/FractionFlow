# Plan 05 Mechanism Review

**Review date:** 2026-09-19  
**Verdict:** Approved with binding implementation clarifications  
**Implementation authority:** The implementer may begin Plan 05 source work within the packet's
write scope. This approval does not authorize renderer, Scene Model, app-shell, deployment, or
packet-status work.

## Approved core mechanism

The approved design is an immutable, JSON-serializable instructional episode state advanced only by
learner-intent actions; exact mathematical judgments delegate to Plan 02 and Plan 03 contracts; a
new deterministic Phase 2 fraction-bar eligibility evaluator is the packet's one deliberate
`src/content/` responsibility; and synthetic response provenance plus a replay envelope reproduce
the same reducer transitions without rendered or pixel state.

The evaluator repairs the formerly inverted dependency: it runs before episode instantiation,
applies DECISION-011's LCD <= 30 and single-operand scale-factor <= 12 ceilings, preserves exact
mathematical validity separately from rendering eligibility, and distinguishes representation
capability from authored-path coverage.

## Binding clarifications

1. **Terminal and shell boundaries.** An instantiated episode is only `active` or `resolved`.
   Do not introduce a learner-facing `rejected` terminal state: invalid learner work receives local
   recovery while the episode remains active, and invalid construction fails before a state exists.
   `continue` is an app-shell transition and must not be a Plan 05 learner intent or replayed
   reducer action.

2. **Wire values and content authority.** Episode state, provenance, and replay envelopes remain
   canonical JSON-safe wire data; no `BigInt` reaches a serializable artifact. Use the existing
   schema conversions at the content/math delegation boundary rather than adding ad-hoc number or
   string coercion. `createEpisode()` receives and retains the full immutable, validated content
   instance—not a summary that drops its canonical path, alternate paths, or result facts.

3. **Replay must be deterministic and local.** The envelope must contain the complete reconstruction
   identity: the exact request fields needed for a generated instance and its seed/version
   provenance, or the curated fixture id and authoring revision; it also retains episode-definition,
   support, active-condition, and ordered learner-intent data. Replay uses the repository's
   deterministic generator or static curated-fixture registry only, validates the reconstructed
   instance, verifies its identity, and fails closed for an unknown, mismatched, or unreproducible
   identity. It performs no network lookup, ambient-cache lookup, or best-effort substitution.

4. **Eligibility shape.** `evaluateInstanceEligibility()` derives the instance profile identity from
   the already validated instance; callers may not override it with an arbitrary `profileId`.
   Per-path evaluation remains available for canonical, authored-alternate, and learner-proposed
   denominators. A valid but ineligible *proposed path* triggers the reviewed symbolic continuation;
   it does not reject the already active episode. The base fraction-bar verdict controls whether a
   requested fraction-bar episode can be constructed.

   `numberLine: 'not-in-phase-2'` is approved as a Phase 2 scope label, provided it is explicitly
   distinct from `ineligible` and is never read as a permanent mathematical or representation-
   capability verdict. `symbolic: 'eligible'` is the Phase 2 continuation baseline. The content
   validator must recompute and validate the new eligibility contract rather than retaining a
   hard-coded `'deferred'` expectation.

5. **Condition data, not a new product surface.** The active condition is immutable, JSON-safe
   configuration with a stable id, revision, and explicit data values. Plan 05 may consume and
   preserve that descriptor, but must not build a condition switcher, renderer flag, preference
   surface, adaptive policy, or unbounded arbitrary-variable bag. Plan 09 retains the switcher.

6. **Advisor disposition.** The proposed Branch C is compliant only if this individual implementer
   thread actually lacks a callable higher-tier, read-only advisor path. The final progress report
   must state the thread-level capability evidence, not rely on the generic phrase “Codex desktop.”
   If such a path is callable, this behavioral packet requires Branch A consultation against the
   implemented artifact; otherwise record Branch C as orchestrator-gate-only.

## Required evidence at handoff

In addition to Plan 05's packet checklist, the progress report must map evidence to each binding
clarification above. In particular, demonstrate local recovery after an invalid learner response;
reject invalid construction; replay one generated and one curated instance from envelope-only
identity; reject a tampered replay identity; distinguish an ineligible proposed path from an
ineligible base fraction-bar episode; and show that no `'deferred'` eligibility expectation remains
for the Phase 2 family.

The proposal correctly preserves no-DOM/no-render/no-Scene-Model boundaries, mathematical
delegation, support-dimension independence, help provenance, non-enumerated valid denominators,
and the decision that Phase 2 does not create a transfer task.
