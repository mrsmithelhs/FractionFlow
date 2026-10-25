# Plan 39 Repair 04 mechanism approval

Date: 2026-10-24. Proposal: cb944a0, repair-04-mechanism-proposal.md.

Disposition: APPROVED with the binding implementation details below. Requirement
0 source gate is open for the bounded Repair 04 layout and affordance work.
Preflight is RUNNABLE. Owner packet/index dispatch edits remain uncommitted and
must be preserved outside implementation commits. No source changed in this review.

The proposed intro tray, accepted-result header, aligned separated graphics and
reuse of getProgression() fit the adopted design. No new instructional state,
completion mechanism, content or replay revision is approved.

## Binding details

1. Moving the unplaced token outside the stack changes an existing dependency:
   bindTokenDrag currently finds the token with stack.querySelector. Bind the
   actual token from its new location while retaining the frame/stack geometry
   reference. Preserve bottom-center anchor, grab offset, pointer capture,
   ring/release agreement and cancellation. Avoid reparenting during an active
   captured gesture; if necessary, settle/release capture before moving the node.
   Exercise the first drag FROM THE TRAY as well as repositioning a placed token.
2. The existing tray CSS has height: 48px. Replace that fixed-height constraint;
   intrinsic content and padding must determine required height. Proposed minimums
   are floors, not caps. Verify enlarged type containment in both token and tray.
   Keep the empty tray stable after placement without a duplicate token or new
   learner-facing explanation. Scope new layout to the current repair contract;
   preserve historical semantic content and behavior.
3. New rendered witnesses must use the ordinary current direct-navigation app
   composition. Existing Repair02/03 v8 routes use a legacy-navigation fixture;
   their passing Finish selectors alone cannot establish current Next behavior.
   Preserve their action objects/mappings and add isolated current witnesses.
   Identify routes by actual ID/context, not row numbers or approximate names.
4. Keep accepted-only green and the read-only header fraction in both visual and
   linear paths. Do not insert a visual answer bar into the linear path merely
   to satisfy a shared visual assertion, or duplicate its amount description.
   Retain useful existing linear semantics. Assert exact next item identity,
   fresh state and deliberate focus after one Next activation. The final-item
   exhaustion notice belongs to the accepted result before Back to start;
   do not invent a new post-return confirmation or move this shared behavior.
5. Test geometry and visible behavior rather than requiring literal color hex
   values as the acceptance oracle. Measure bar-bottom to painted axis, actual
   fraction containment, connector/endpoints, starting-tray separation and wrong
   Check withholding acceptance. Negative controls must mutate the inspected
   condition and fail ordinary assertions; do not manufacture success receipts.

## Validation and review

Use focused tests and rendered checks during editing. Run the consolidated Luna
HIGH read-only review and bounded browser walkthrough before the final broad
validation, so any fixes precede one final clean matrix/build receipt. Do not
rerun a baseline full suite merely because it passed during investigation.
Final test counts must reflect actual output, not the proposal's baseline count.

Continue the browser pilot under the handed-off authority: read its workflow and
prior capability log, keep observations screenshot-driven without source access,
and persist limitations. Treat it as model usability feedback, not learner data.
No additional advisor is needed for this mechanism approval; parent inspected
the current renderer, tray CSS, context mappings and progression boundary inline.

Commit scoped source/evidence, then repair-04-progress.md last. Return for technical
review and owner rendered-page acceptance. No packet status edits, push or deployment.
The implementer's reported cross-runtime recipient-not-found means owner relay
remains the working communication path; do not claim successful peer delivery.
