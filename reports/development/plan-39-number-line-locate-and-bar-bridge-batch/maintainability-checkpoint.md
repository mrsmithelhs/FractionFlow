# Plan 39 maintainability checkpoint — MAINT-42-B/C

Date: 2026-10-21. Parent source/evidence-workflow assessment. This record makes
recommendations and closes review obligations; it authorizes no new source work,
framework migration or packet. Final delivery behavior remains separately reviewed.

## Preview ownership fit

The task-local adaptation fits without imposing an arithmetic response draft.
`src/app/app.js` owns the opaque `{ contextKey, candidateId }` storage and reset/
capture/restore timing. `src/render/number-line-locate.js` owns candidate controls,
the context check, current-subtree reads/writes, preview geometry and dispatch from
the real Check button. The shared renderer supports visual and linear paths;
neither path determines correctness. The approved upstream bridge instance is
unary and replay v7 is scoped to that identity, preserving old arithmetic versions.
MAINT-42-B's initial fit assessment is confirmed by the mounted remount journey.

There is still task-specific app lifecycle/help/focus wiring. This is explicit
coupling rather than evidence of a general representation interface. A second
preview-based task that duplicates it is the trigger to investigate extraction;
one successful task does not justify an admission or representation framework.

## Decide/transform and remount ownership

The old visual and linear renderer files remain unchanged by Plan 39. They retain
the duplicated 24-field active-response remount token, including Plan 42's
operationResponseContext. Plan 39 neither worsens that duplication nor exercises
the decide/transform ownership seam. Its preview renderer's smaller context key
is a different lifecycle contract; forcing both into one key would be premature.

Recommend a bounded transform-response ownership investigation/extraction before
the next substantial conversion/help feature, using the already-recorded Plan 31
and 32 focus/remount cases as parity cases. Do not widen this number-line packet
to perform it. Defer decide extraction and shared token extraction until an
actual change needs coordinated edits to both old renderers or reproduces token
drift; preserve the exact invalidation semantics and replay boundaries. These
are explicit revisit triggers, not claims that duplication is harmless forever.

## Evidence cost and harness follow-up

This run needed substantial verifier correction. The first checkpoint collected
measurements without enforcing them and inspected a hidden view. Later checks
exposed a real stale-track defect, missing help linkage, transition focus loss
and endpoint focus loss. Early Stage 6 drafts repeated active-view, mounted-prefix,
support-profile and pre/post-scroll mistakes; normal smoke runs and read-only
review corrected these. Tests and seeds only count when normal assertions reject
the actual mutation and clean mounted journeys pass.

That cost is not evidence that a Vue migration would fix the problem. The same
verification mistakes can occur with component templates. A useful future bounded
tooling slice would give active-task resolution, one-scroll geometry measurement,
failure receipts and seed accounting one tested owner in the route tooling. Trigger
it before the next representation needs another geometry verifier; do not build
a broad test framework here. Keep task action builders separate from generic
runner orchestration, with actual mounted state rather than assumed prefix state.

Historical evidence output contention was known and required explicit restoration;
it is distinct from product source-edit locality. A later evidence-output isolation
change should preserve historical fixtures and the existing route contract rather
than replacing old proof with new round trips.

Stage 6 also reproduced a concrete output-isolation defect: final filtered seed
runs overwrote the successful full-matrix summary and measurements. The first
93/93 pass was observed, but its complete JSON was lost. The bounded repair gives
seed/filtered/full outputs distinct destinations and repeats the full matrix once
to regenerate durable proof; it does not infer full results from partial receipts.
This is a directly observed harness cost, not a hypothetical framework benefit.

MAINT-42-C is discharged as a review with these bounded recommendations and
deferrals. No overall token/time saving, learner efficacy, settled owner markup
readability, physical-device accessibility or framework superiority is claimed.
