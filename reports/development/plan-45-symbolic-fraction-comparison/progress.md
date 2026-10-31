# Plan 45 Progress — Integrated Comparison Task

## Overall summary

Plan 45 is implemented through the bounded app, renderer, replay, and route integration. The learner sees the two raw source fractions and submits one `<`, `=`, or `>` choice. The first requested model is the sole source model shown before acceptance and remains fixed for the current attempt through retry, help/view changes, resize, and app remount. Acceptance reveals both aligned source models for verification and proceeds directly to the shared Next / final Back to start flow. A fresh attempt starts without the prior response or model choice.

The fixed comparison condition is surfaced honestly in the app menu. Existing arithmetic tasks continue to use their selected display settings. The More/Less support copy is generic and does not claim the comparison task applies unrelated display or premise controls.

The implementation is ready for orchestrator review. Packet status remains unchanged (`in-progress`). Owner rendered-page and agency acceptance remain outstanding; no push or deployment occurred.

## Files changed

- App and registry: `src/app/app.js`, `src/app/practice-types.js`, `src/app/support-levels.js`, `src/app/styles.css`.
- Comparison contract and replay: `src/interaction/classification.js`, `src/interaction/plan45-comparison-episode.js`, `src/interaction/provenance.js`, `src/interaction/replay.js`, `src/interaction/scene.js`.
- Presentation: `src/render/index.js`, `src/render/strings.js`, new `src/render/plan45-comparison.js`.
- Browser route runner and data: `scripts/dev/run-route-matrix.js`, new `scripts/dev/plan45-route-comparison.mjs`, `tests/routes/route-matrix.json`, `tests/routes/plan34-context-map.json`.
- Regression tests: `tests/app-plan45-symbolic-fraction-comparison.test.js`, `tests/app-plan45-falsification-seeds.test.js`, `tests/interaction-plan45-symbolic-fraction-comparison.test.js`, plus route/progression expectations in `tests/plan43-shared-progression.test.js`, `tests/route-contract.test.js`, and `tests/routes-plan40-subtraction-recipes.test.js`.

## Artifacts produced

- `evidence/falsification-seeds.json` records four real mutations, their ordinary assertion failures, and clean recovery.
- `evidence/full-route-matrix-receipt.json` records the final unfiltered runner aggregate and every route row. Runner summary: 118 passed, 0 failed across 116 route rows and 118 browser executions. Per-row pass status follows from that aggregate; the runner did not persist individual durations for Plan 45.
- `evidence/screenshots/` contains route-prefixed captures for initial, chosen-source, wrong/recovery, accepted and Next states, plus 200% text-scale and final-reentry views. Prefixing prevents viewport routes from overwriting each other.

## Exact behavior and coverage

The production batch preserves the 12 ordered Plan44 pairs and raw numerator/denominator forms. Eligibility, relation, normalized identity, model unit counts, and cue context are derived through exact math and validated pure contracts; no hand-authored answer table is used. Equality is a genuine response. App-owned comparison response state and the selected-source assistance provenance are projected into scenes without exposing the expected relation before acceptance. The visual and linear paths obey the same one-model withholding rule. Accepted paired visual models use equal whole widths and true partition/shading counts; the linear accepted view supplies the paired equivalent.

Mounted coverage checks the exact identity of all 12 records, all three response choices per record against an independent exact-core oracle, model lock/refusal, retries and shared progression. This deterministic mounted coverage is broader than the browser sample and does not establish 12 separate browser journeys.

The six sampled current-app browser routes cover all relation outcomes; both model sides; high/medium support; visual and linear paths; help/notation; wrong response and revision; view switching; keyboard navigation; non-drag browser touch; reduced motion; resize; text size; direct Next; final exhaustion and return/re-entry. Geometry assertions inspect fraction containment, source model partition/shading fidelity, visible question/control reach, horizontal overflow, and equal whole widths. The sampled viewport checks include 360×740, 360×752, 1366×768, and 1093×614 at DPR 1.25. At injected 200% learner text size the prompt computed font increased from 19.2 px to 38.4 px; the document gained vertical scroll but had no horizontal overflow and the active Check control remained reachable by scrolling.

The keyboard browser route uses sequential Tab focus and arrow/Space activation. The touch route uses browser touch taps without drag. These are browser simulations, not physical device or assistive-technology evaluations. Browser-chrome zoom was not established; the 200% check uses injected computed text scaling. The final route runner emits extensive historical evidence as side effects; unrelated regenerated historical report artifacts were restored, while this Plan45 receipt and screenshots were retained.

## Falsification evidence

Each seed mutates the actual mounted DOM or event behavior before running an ordinary assertion:

- Premature paired model: `.plan45-model-pair` unexpectedly present; assertion reported `expected MockElement{...} to be null`.
- Second-source disclosure after retry/view transition: two models instead of one; assertion reported array length 2 rather than 1.
- Inverted equality result: rendered `<` where exact accepted relation was `=`; assertion reported `expected '<' to be '='`.
- Stale/no-op Next: production click handler blocked; assertion reported the item id did not change.

All four have `cleanRecovery: true` after removing the mutation and verifying restored state. Exact full assertion strings are in the JSON evidence artifact.

## Review disposition

One consolidated cold, read-only reviewer pass was requested as `gpt-6.1-terra` at medium effort. The child stated that harness-controlled actual configuration could not be independently verified; the reported disposition is therefore based on the requested configuration, with observed model identity unverified. Post-review inspection confirmed the primary thread remained the sole writer. Coarse cost: one review pass; elapsed time was not measured.

The disposition on the then-submitted diff was **re-review needed**, with no findings rejected:

1. The condition menu implied display settings applied to this fixed-condition task. I added the visible task-specific applicability explanation and verified it in the app/route validation.
2. Two viewport runs reused screenshot names. I made names route-specific and verified distinct captures exist for the 360×740 and DPR 1.25 scaled routes.
3. Browser proof lacked authentic keyboard flow, resize/text-scale, final exhaustion/return, and explicit model geometry checks. I added Tab-driven focus with arrow/Space activation, resize plus injected 200% text scaling and measured scroll/control reach, final Back to start and fresh re-entry, and source-fraction/partition/shading/whole-width geometry assertions. All six filtered Plan45 browser routes passed before the final unfiltered run; the final full matrix passed all 118 executions.

The reviewer did not run tests or inspect the rendered page. I independently ran the validations below after incorporating the findings. No second reviewer pass was run.

## Commands run and validation

- `node scripts/dev/plan-status.js check 45` before source changes and at delivery — `RUNNABLE`.
- `node scripts/dev/plan-status.js lint` at delivery — passed with no violations.
- Focused comparison/app/replay/route regressions — passed (83/83 in the broader focused run; later focused suite passed 42 tests).
- Full `npx vitest run` — 62 files, 567 tests passed.
- Sequential `npm run build` — learner and subtraction prototype builds passed.
- Final `node scripts/dev/run-route-matrix.js` — 118 passed, 0 failed (116 route rows; 118 browser executions).
- Filtered Plan45 browser matrix — 6/6 passed; final unfiltered result is recorded in `evidence/full-route-matrix-receipt.json`.
- `git diff --check` — run before commit; results recorded by the final diff check.

## Problems and resolution

The initial Git restore of runner-generated historical evidence was denied because `.git/index.lock` could not be created, despite no lock file existing. `git add --refresh -- .` confirmed the sandbox denied Git metadata writes. The scoped `git restore` was then run with narrowly escalated Git permission and succeeded. No lock was removed and no ACL was changed. The full route run also wrote two Plan39 clean-run receipts as untracked outputs; those are retained and excluded from Plan45 staging to preserve shared-tree evidence.

## Remaining limits and next step

The full suite, build, and route matrix establish repository and browser-simulation behavior for the described evidence only. Physical hardware, actual assistive technology, browser-chrome zoom, owner rendered-page review, and learner agency acceptance remain unverified. This report does not claim Plan 45 is accepted or complete.

Ready for orchestrator review: **yes**. Please inspect the scoped commits and evidence, then route owner rendered-page/agency acceptance separately. Do not change packet status as part of this implementation report.
