# Plan 39 Stage 6 Progress

Stage 6 route and evidence work is recorded for technical review. It does not declare Plan 39 complete, establish owner rendered-page or agency acceptance, or authorize deployment.

## What was added

The route matrix now appends ten Plan 39 rows for the two eight-item traversals, deep representation samples, recovery/help/remount behavior, and the required responsive contexts. The prior 81 route rows remain an exact prefix of the pre-change matrix; all 79 prior context mappings retain their original values. The expanded matrix has 91 route rows and 93 browser executions.

The bounded Plan 39 route helper drives the visual stepper with real touchscreen taps on touch routes and completes the linear candidate selection with Space/ArrowRight plus Enter activation of task controls on the keyboard route. The shared route runner records ordinary locate assertions and resolved connector geometry. Its five `--plan39-witness-seed` cases each produced one intended assertion detection, zero unrelated failures, and one browser execution. Filtered or seeded runs now leave the canonical full-matrix summary and viewport measurements untouched; those files are written only by an unfiltered clean matrix run.

## Verification evidence

The final full Chrome matrix passed **93/93 executions across 91 rows**. The durable clean receipt is [plan39-route-matrix-summary.json](evidence/plan39-route-matrix-summary.json), with viewport and geometry details in [plan39-viewport-measurements.json](evidence/plan39-viewport-measurements.json). All eight visual resolve transitions recorded a connector from the final shaded bar segment to the accepted point; the largest measured endpoint error was approximately 0.011 CSS pixels. The 25 saved locate measurements all passed endpoint alignment, prompt/control viewport containment, target size, non-overlap, center hit-testing, and distinct accessible-label checks. They cover 360x740, 360x752, 1366x768, and 1093x614 at DPR 1.25. The screenshots include the high-support eighths scene at each required viewport.

The five seed receipts are preserved separately under `evidence/plan39-seed-*-receipt.json`: `misaligned-endpoints`, `premature-target-leak`, `undersized-touch-target`, `single-tap-auto-submit`, and `coarse-bucket-sr-collapse`. Each records one detected intended failure, zero unrelated failures, and one execution. The auto-submit seed actually fires Check when the stepper changes the preview.

The final restored full-matrix summary was produced after an earlier full 93/93 pass had been overwritten by filtered/seeded runs. I corrected the writer so only a clean, unfiltered run updates canonical files, then repeated the matrix. During both full runs I snapshotted and restored only pre-existing route screenshots and shared historical evidence outputs; the final restore covered 36 existing files and verified each SHA-256. The helper-generated Plan 40 `linear-operate-360x752.png`, which was not named directly by a route row, was also restored byte-for-byte to `HEAD`. The frozen v1-v6 fixtures and oracle files were not edited or regenerated.

Validation completed:

- `npm test`: 56 test files passed, 506 tests passed.
- Focused route contract and Plan 40 matrix contract after the final assertion-message adjustment: 37 tests passed.
- `npm run build` and `npm run build:learner` both passed.
- `node scripts/dev/plan-status.js lint` and `git diff --check` passed.
- Historical route prefix/context mapping equality was checked against the pre-change committed files. Parent verification separately confirmed the saved v6 oracle and the final 93/93 receipt.

## Ownership and maintainability observations

The task-local preview `readPreview`/`writePreview` boundary remained a clean fit. App storage is opaque, the active Plan 39 region validates the current item and candidate context and reacquires the submitted form from the current scene, and renderer disposal remains responsible for invalidating controls. This work did not extract a shared preview framework or migrate other regions. The shared runner does select the active visual/linear host for the evidence assertions, while the Plan 39 helper owns its route action sequencing; this is localized evidence/test duplication rather than a new product-state owner.

The implementation cost was a Plan 39 route helper, bounded assertions/seeds/output handling in the existing route runner, ten matrix rows, and the corresponding context/test updates. Full-route evidence work exposed two harness costs: historical static entries are rebuilt by the existing runner, and helper-generated historical screenshots must be included explicitly when restoring rewritten artifacts. A summary-path collision between filtered/seeded and full runs was corrected after it erased the first full receipt, which required a second full matrix run. These are the concrete MAINT-42-C ownership/evidence costs for the parent’s disposition; no broader architecture refactor was made.

Advisor consultation was parent-mediated with a read-only Sol review. Physical-device touch behavior and assistive-technology behavior remain unverified; browser touch emulation, native radio semantics, keyboard operation, and rendered accessible labels are the evidence boundary here.
