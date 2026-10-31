# Plan 45 Progress — Integrated Comparison Task

## Overall summary

Plan 45 is implemented through the bounded app, renderer, replay, and route integration. The learner sees the two raw source fractions and submits one `<`, `=`, or `>` choice. The first requested model is the sole source model shown before acceptance and remains fixed for the current attempt through retry, help/view changes, resize, and app remount. Acceptance reveals both aligned source models for verification and proceeds directly to the shared Next / final Back to start flow. A fresh attempt starts without the prior response or model choice.

The fixed comparison condition is surfaced honestly in the app menu. Existing arithmetic tasks continue to use their selected display settings. The More/Less support copy is generic and does not claim the comparison task applies unrelated display or premise controls.

Delivery Review Repair 01 is implemented and ready for orchestrator re-review. Retained controls from older renderer generations can no longer act on the current attempt; retry feedback is associated with each view's response group; accepted verification uses the neutral heading “That's right.” Packet status remains unchanged (`in-progress`). Owner rendered-page and agency acceptance remain outstanding; no push or deployment occurred.

Repair 01 implementation and refreshed evidence were committed as `3d33052`; this progress update is committed separately last.

## Delivery Review Repair 01

The orchestrator reproduced a stale-control scope bypass in the mounted app. The comparison renderer now issues a fresh, revocable callback lease for every render. Each lease closes over that render's scoped response handle; rerender and destroy revoke the previous lease. The response, model/help actions, relation draft, help disclosure, and progression callbacks all reject retired subtrees. The app no longer routes old renderer callbacks through a mutable current handle. Newly rendered controls are verified to remain usable after same-item rerender and after Next.

Mounted regressions retain real model/help buttons, relation inputs, and disclosures across both a same-item rerender and item advancement. They check that stale actions leave the active state reference, model choice, assistance history, response provenance, draft, and disclosure unchanged, then exercise fresh controls. Retry status paragraphs now have unique `plan45-recovery-visual` / `plan45-recovery-linear` ids referenced from each view's relation fieldset; successful acceptance removes the recovery and association. The shared accepted heading is now “That's right.” in visual and linear views.

I inspected the refreshed 360×740 wrong-response and accepted-linear screenshots. The accepted linear capture now uses the neutral heading; retry remains visible and concise. The full route matrix refreshed current Plan45 screenshots and its receipt. No additional reviewer pass was requested or run for this repair.

## Files changed

- App and registry: `src/app/app.js`, `src/app/practice-types.js`, `src/app/support-levels.js`, `src/app/styles.css`.
- Comparison contract and replay: `src/interaction/classification.js`, `src/interaction/plan45-comparison-episode.js`, `src/interaction/provenance.js`, `src/interaction/replay.js`, `src/interaction/scene.js`.
- Presentation: `src/render/index.js`, `src/render/strings.js`, new `src/render/plan45-comparison.js`.
- Browser route runner and data: `scripts/dev/run-route-matrix.js`, new `scripts/dev/plan45-route-comparison.mjs`, `tests/routes/route-matrix.json`, `tests/routes/plan34-context-map.json`.
- Regression tests: `tests/app-plan45-symbolic-fraction-comparison.test.js`, `tests/app-plan45-falsification-seeds.test.js`, `tests/interaction-plan45-symbolic-fraction-comparison.test.js`, plus route/progression expectations in `tests/plan43-shared-progression.test.js`, `tests/route-contract.test.js`, and `tests/routes-plan40-subtraction-recipes.test.js`.

## Artifacts produced

- `evidence/falsification-seeds.json` records four real mutations, their ordinary assertion failures, and clean recovery.
- `evidence/full-route-matrix-receipt.json` records the final unfiltered runner aggregate and every route row. Runner summary: 118 passed, 0 failed across 116 route rows and 118 browser executions. Per-row pass status follows from that aggregate; the runner did not persist individual durations for Plan 45.
- `evidence/screenshots/` contains route-prefixed captures for initial, chosen-source, wrong/recovery, accepted and Next states, plus 200% text-scale and final-reentry views. The wrong-response and accepted-linear captures were refreshed and visually inspected for Repair 01. Prefixing prevents viewport routes from overwriting each other.

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

The Terra reviewer did not run tests or inspect the rendered page. The later delivery review independently reproduced a distinct stale rendered-control issue, inspected mounted behavior and requested the bounded Repair 01 documented above. I independently ran the validations below after those fixes. No second Terra or other reviewer pass was run.

The Repair 01 findings were addressed as follows:

1. Stale renderer callbacks formerly looked up the mutable current response handle. Render-generation leases now bind callbacks to the scoped handle and reject retired controls; mounted tests exercise stale help/model, response/draft, and disclosure controls across same-item rerender and Next, while proving fresh controls still work.
2. Recovery feedback now has unique per-view ids and `aria-describedby` references from the active relation groups. Mounted assertions verify both ids/references and that the association disappears when recovery clears.
3. The accepted heading changed from “Check with the bars.” to “That's right.” in both paths; a mounted assertion checks both views and the updated linear screenshot was inspected.

## Commands run and validation

- `node scripts/dev/plan-status.js check 45` before source changes and at delivery — `RUNNABLE`.
- `node scripts/dev/plan-status.js lint` at delivery — passed with no violations.
- Focused Repair 01 and Plan 45 comparison tests: `npx vitest run tests/app-plan45-symbolic-fraction-comparison.test.js tests/interaction-plan45-symbolic-fraction-comparison.test.js tests/app-plan45-falsification-seeds.test.js` — 3 files, 17 tests passed.
- Full `npx vitest run` after Repair 01 — 62 files, 571 tests passed.
- Sequential `npm run build` — learner and subtraction prototype builds passed.
- Final `node scripts/dev/run-route-matrix.js` after the app/renderer changes — 118 passed, 0 failed (116 route rows; 118 browser executions); results are recorded in `evidence/full-route-matrix-receipt.json`.
- Filtered Plan45 browser matrix — 6/6 passed in the original delivery; the final unfiltered run also passed all six Plan45 route rows.
- `git diff --check` — run before the Repair 01 commit; passed.

## Problems and resolution

The first focused Repair 01 run exposed a mock-DOM limitation with a `:checked` selector; the mounted assertion was rewritten to inspect the radio's checked property, then passed. The earlier sandbox Git metadata limitation and narrowly escalated scoped restoration are recorded above through the existing commit. The final route run regenerated historical evidence, which I restored to keep the repair scoped. It also wrote three untracked Plan39 clean-run receipts; those are retained, excluded from Plan45 staging, and reported for orchestrator handling as shared-tree evidence.

## Remaining limits and next step

The full suite, build, and route matrix establish repository and browser-simulation behavior for the described evidence only. Physical hardware, actual assistive technology, browser-chrome zoom, owner rendered-page review, and learner agency acceptance remain unverified. This report does not claim Plan 45 is accepted or complete.

Ready for orchestrator re-review: **yes**. Inspect the Repair 01 diff, refreshed retry and accepted-linear screenshots, and final receipt; route owner rendered-page/agency acceptance separately. Do not change packet status as part of this implementation report.
