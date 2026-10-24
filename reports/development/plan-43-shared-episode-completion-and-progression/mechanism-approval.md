# Plan 43 Requirement 0 — revised mechanism approval

Date: 2026-10-24. Proposal: revision2, commit 7a838b3. Reviewed against prior
mechanism-review.md and current source. Preflight is RUNNABLE. No new advisor
consultation, browser run, source/test/fixture edits or deployment in this review.

## Decision

**Source gate open for Alternative A, as bounded below.** The app owns one explicit
continuation transaction: validate destination and eligibility, derive completed
old state with the existing pure instructional intent, then install one fresh
item without an intermediate completion render. Accepted reflection is already
resolved and must not receive another completion intent. Final Back to start
also records completion when needed; ordinary mid-task Return remains an exit.

The revision adequately addresses the four prior mechanism gaps: eligibility is
separate from item position, renderers receive a descriptor, historical/current
UI behavior is explicit, both transactions and stale guards are specified, and
the reflection inventory is corrected. No further proposal-only round is needed.
The following decisions amend specific illustrative details in the revision and
are part of source authorization, not optional follow-up work.

## Implementation bindings

1. **Use actual state fields and preserve exact intents.** Both Plan20 completion
   and Continue to reflection use the accepted form at
   `state.established.operation.proposed`, equivalent to the existing scene
   operation.rawResult. The proposal's state.established.operation.rawResult does
   not exist: handleOperate/classifyOperationResponseForEpisode store proposed,
   and scene.js derives its rawResult from that field. Preserve the existing raw
   payload, classification and provenance. For an already-resolved reflection,
   completion is identity, not another applyIntent call. Unknown or ineligible
   contexts fail closed. Descriptor construction is shared; this does not remove
   legitimate pattern-specific instructional rendering outside progression.

2. **Use dedicated test composition, not a production query switch.** Select the
   proposal's dedicated historical-entry/build alternative. Keep production
   src/app/main.js unconditionally on the direct default; do not add ?nav=legacy
   handling there, a reviewer control, or a public learner-selectable legacy mode.
   Historical entries explicitly pass legacy-acknowledged. The runner routes each
   existing mapped context to its correct legacy composition/registry and appends
   Plan43 direct-mode witnesses against the ordinary production entry. Preserve
   ALL99 existing route objects and existing map entries, including the Repair03
   row; earlier98 hashes are a minimum, not permission to edit row99. Preserve
   historical artifacts and test pins. Validate actual context resolution, not
   route-prefix guesses. A production-default-v9 context name is UI-test context
   identity only; it does not introduce replay schema v9. Use a descriptive
   direct-progression context name instead if that avoids ambiguity, consistently
   across new entries/validation. No hidden Finish in current production.

3. **Keep transactions pure until commit and focus/reset singular.** Revalidate
   generation, accepted phase and requested action kind, with the re-entrancy lock
   released in finally on all paths. Evaluate potentially failing preparation,
   pure completion and any envelope validation before changing app state or the
   episode generation. Failure retains accepted work/history; only refusal UI
   changes. Scope any installation/render-error guarantee honestly. Use
   installFreshEpisode(..., {focusEpisode: true}) and its existing reset/focus
   policy once; do not reset again after render/focus or increment generation in
   several nested calls for one event. Capture a generation that invalidates on
   fresh item, Retry and Return/re-entry. Completion evidence may use a pure
   helper/transaction result in tests; do not add a production lastCompletedEnvelope
   cache solely for testing or accumulate cross-item history. No persistence,
   tracking, extra response attribution or public API expansion is authorized.

4. **Make negative controls genuinely discriminating.** The proposed extra seed
   that disables only the generation guard may still be rejected by eligibility
   revalidation on the next fresh item; it cannot be assumed to skip an item.
   Similarly, calling a guarded advance from Continue may refuse rather than
   actually bypass reflection. Verify the injected behavioral defect manifests
   and that the ordinary assertion catches it. Use a live-handler defect that
   actually models the required two-click or premature-continuation regression,
   not an assertion change or forced error. The packet requires those two seeds;
   double/stale activation and refusal still need ordinary negative-path tests,
   but do not invent additional guaranteed seed failures or spend repeated runs
   defeating redundant guards. Keep clean and seeded receipts separate.

## Compatibility, review and delivery

No episode-definition, authored-set or replay-schema revision is expected for
this app/presentation change, provided existing instructional schedules, exact
intents/payloads and frozen replay outcomes remain unchanged. Prove that with the
existing oracles; do not state compatibility as already verified. If preserving
those contracts actually requires a semantic change, stop and report the precise
conflict before a revision bump or migration. Keep the protected eight reflections
substantive and retain truthful labels; production already supplies Continue.

Complete the packet's whole-bank deterministic sweep, discriminating browser
sample, final clean build/matrix, historical restoration and objective evidence
map. Use current registered identities and actual installed browser scale. Keep
Plan39 Repair04 visuals out of scope. Advisor-capability limitations are accepted
as reported; no paid model probe or substitution is requested. Follow the owner
review cost limit for any later advisor work and state the actual disposition.

Implementer may now implement this bounded approved mechanism, commit its own
scoped source/evidence, write/commit progress last and return for delivery review.
Do not set packet status, edit acceptance records, push or deploy. Owner rendered
acceptance of Plan43 remains separate from Plan39's visual acceptance/closure.
