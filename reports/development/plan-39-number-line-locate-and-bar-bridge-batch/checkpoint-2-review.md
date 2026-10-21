# Plan 39 Checkpoint 2 — repaired submission approval

Date: 2026-10-21. Parent review of Repair 01 at `012dbf3` and its bounded
post-pause evidence/endpoint-focus amendment `712883d`. The original `ad913ce` submission
was rejected; its measurements and screenshots remain historical evidence.

Approve Stage 6 only. This is technical checkpoint approval, not owner rendered
or agency acceptance, packet completion, deployment, or authorization of another
plan.

## What was established

Parent inspected the repaired renderer/app/test diffs, actual high-eighths mobile
and medium-linear scaled-desktop viewport screenshots, enforcing probes and saved
measurements. The readable bar and line share endpoints; visual interaction uses
the approved left/right preview stepper, with Step k of b rather than a detached
text-choice grid. Linear choices remain native radios. Intrinsic fraction rules,
visible unshaded boundaries, current-track replacement, help linkage and Continue
focus address the rejected submission's defects. The opaque app preview handle
remains task-local and context-validated; correctness stays upstream.

Parent independently reran all eight coverage contexts: high eighths and odd
thirds, medium items 07 and 08, each at 360×740 DPR 1 and 1093×614 DPR 1.25.
All passed actual runtime viewport/DPR, common-scroll prompt/full-control bounds,
44px targets, non-overlap/hits, no initial selection, explicit Check, distinct
candidate descriptions, radio keyboard selection, endpoint alignment and resolve
connector checks, including non-half 5/6. Only known regenerated PNGs from this
parent run were restored to their committed bytes.

A Sol-low instruction-read-only review found no source blocker, but correctly
identified missing repeated-preview/remount evidence and missing durable failure
diagnostics. Both findings were accepted; none were rejected. The new exact
journey exposed an endpoint focus defect: clicking a movement button that became
disabled left focus at body. A two-line symmetric repair moves focus to the
remaining enabled movement control, with a focused regression test. This is an
actual reproduced behavior repair, not a relaxed assertion.

Parent independently ran the amended mounted agency probe: distinct A, B, both
view switches, C, then the real Check control; exact pending selections and
meaningful connected focus survived both remounts, no grading occurred before
Check, and recovery/help/retry/return/re-entry/Next passed without page errors.
Coverage and mounted probes now save failure diagnostics and rethrow. Historical
failure receipts are explicitly distinguished from the latest successful run.

Child reports 505 final-source tests and both builds passed; exact final counts
and commits are recorded in `checkpoint-2-repair-01-progress.md`. The parent
checks above establish the checkpoint behavior rather than relying on counts.
The advisor ran no tests, browser, edits or fan-out; requested runtime identity
was not independently observable. Physical-device and assistive-technology
behavior remain unverified.

## Stage 6 boundaries

Preserve all 81 baseline route rows, their mappings and 83 executions. Append
bounded Plan 39 rows for both full eight-item traversals, representative deep
recovery/help/preview/reset cases, reduced motion and required viewport contexts.
Use normal enforcing assertions and five real DOM/behavior falsification seeds;
seed detection must fail the intended ordinary assertion without unrelated
failures, followed by clean passes. Keep source changes narrow and report any
new behavioral conflict rather than silently widening scope.

Snapshot and restore only known generated historical evidence. Preserve frozen
v1–v6 fixtures and the pre-source v6 oracle. Final tests, both builds, full Chrome
matrix, packet lint and diff checks remain required. Commit scoped work and final
progress last, stop for parent technical review. Parent will record MAINT-42-C,
status and acceptance. No owner acceptance, push or deployment is implied.
