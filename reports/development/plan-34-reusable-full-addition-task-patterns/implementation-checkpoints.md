# Plan 34 Stage A Implementation Checkpoint

## Stage A bounded execution

- Started: 2026-10-16 15:04:50 UTC (baseline capture and source work).
- Checkpoint: 2026-10-16 15:12:41 UTC.
- Baseline: `9e61a7479e96d0bf11138b002c00ba867af1fb76`.
- Authorization: parent-adopted mechanism review, Stage A only. Stage B remains closed pending parent inspection.
- Legacy oracle: `tests/fixtures/plan34-legacy-replay-oracle.json`, captured from current baseline before source edits. Its initial and completed v1 envelopes and exact expected semantic snapshots remain frozen. Current replay verifies both snapshots without regenerating the oracle.

### Implemented in the approved Stage A scope

- Added immutable authored item/task records and pure task-context identity, source-form, target, pattern-association, and candidate validation in `src/content/data/plan34-full-addition-task-records.js` and `src/content/full-addition-task-patterns.js`. Identity resolution uses authored fixture ID plus authoring revision; generated instance ID is not substituted for `itemId`. Required conversion sides derive through the existing exact `convertToDenominator` API.
- Exported distinct immutable v4/v5 practice registries while leaving the production `PRACTICE_TYPES` default on v4 for Stage B composition. Live v5 assignments live on authored records; compatibility contexts carry null set identity.
- Added the compact definition/schedule, target-derived state, inspect keep/repair/help/classification/provenance, operation-to-navigation completion, and replay v2 context pins. Content validation remains pure and interaction/replay do not import the app registry.
- Added reducer/admission/replay tests. The same shared completion helper drives all six item-pattern compatibility pairs, uses exact core conversion/addition APIs for responses, finishes each compact episode, and verifies replay. The pairs assert null practice-set identity; the test does not mislabel alternate associations as live v5 assignments.
- Restored legacy v1 transform provenance defaults and confined new compact conversion-origin fields to compact definitions after the frozen completed oracle exposed drift. The v1 oracle comparison remains strict.

### Validation

- Focused: `npm test -- tests/interaction-episode.test.js tests/plan34-full-addition-task-patterns.test.js tests/interaction-plan34-task-patterns.test.js tests/interaction-provenance-replay.test.js` — 4 files, 32 tests passed.
- Full suite: `npm test` — 38 files, 370 tests passed.
- Packet preflight previously returned RUNNABLE. No runner/build/DOM/app-composition/renderer/browser wiring was changed in this stage.
- Advisor disposition: orchestrator-gate-only; parent arranges the authorized read-only Sol review after stable Stage A artifact. Runtime model identity is not independently verified here.

### Remaining boundary

Stage A implementation and focused validation are complete. Preserve the production v4 default until Stage B supplies app composition context and compact rendering. Do not proceed into Stage B or change packet status; parent inspection/review is the next gate. No push or deployment was performed.

## Stage B implementation checkpoint

- Resumed: 2026-10-16 22:53 UTC after the explicit usage pause; checkpoint: 2026-10-16 22:56 UTC.
- Baseline foundation: Stage A commit `befe78c`; preserved Stage B edits resumed in place after pause `78b948a`. Authorization: parent-adopted Stage B gate. Stage C remains held.
- Production app now defaults atomically to `PLAN34_PRACTICE_TYPES_V5`. Initial and registered-item episode creation bind task context to the authored item identity and fixed live v5 association. New compact renderer paths stay behind the compact definition/pattern projection; reducer and replay remain independent of the app registry.
- Both render surfaces show one inspect prompt, one stacked authored proposal, explicit Keep / Change top number controls, and typed local help. Help is linked to its actual rendered explanation with `aria-controls`; opening it focuses the task response and closing returns focus to the help control. Inspect drafts survive a visual/linear switch, false keeps do not establish conversions, and compact replay is hidden and rejected by the reducer.
- Compact construct encounter displays the authored target as the short context “Use twelfths as your target parts.” Compact encounter/operate hide the generic escalating help control; task help is visible when the transform step is active. Compact operation input drafts and focused input survive visual/linear switching. Construct completion uses a navigation-only Finish action and does not create a resolution or reflection response.
- Mounted operate/resolve surfaces now derive completed summaries from actual scheduled tasks: compact episodes omit fabricated Notice and Decide milestones while retaining the accepted left/right conversions and sum. The production test verifies the active linear surface through Finish after switching from visual mode.
- Historical mounted-app tests retain their original actions/assertions but now explicitly inject/import v4 registries: `tests/app-shell.test.js`, `tests/entry-page.test.js`, `tests/plan26-practice-set.test.js`, `tests/plan32-compact-authored-problem-batch.test.js`. Parent separately authorized the same narrow historical pin in `tests/plan19-shared-factor-addition.test.js`, whose v4 set-revision assertion would otherwise target the production v5 default. No expected legacy behavior was loosened.
- Added production-default mounted coverage in `tests/plan34-rendered-task-patterns.test.js` for v5 mapping, target context, typed construct help, navigation finish, both inspect surfaces, no answer leakage, no replay, truthful keep/recovery, accessible help association, focus, and draft continuity.
- Sol's two consolidated Stage B findings were repaired: compact completed-step summaries no longer infer skipped Notice/Decide work from schedule position, and `updateHelpPlacement` restores visibility when a compact transform step makes local help available. Mounted checks assert the rendered surface behavior, including visible help and accepted conversion summaries at operate/resolve.

### Validation

- Focused mounted/history set: `npm test -- tests/plan34-rendered-task-patterns.test.js tests/app-shell.test.js tests/entry-page.test.js tests/plan26-practice-set.test.js tests/plan32-compact-authored-problem-batch.test.js` — 5 files, 49 tests passed before the separately authorized Plan 19 historical pin.
- Full suite after all Stage B changes: `npm test` — 39 files, 375 tests passed.
- Repository whitespace validation: `git diff --check` — clean (only Git's line-ending normalization notices were emitted).
- Frozen Stage A legacy replay oracle and reducer/replay tests remain unchanged and passed in the full suite. No runner, route, browser, or fixture-build changes were made. No packet status change, push, or deployment was performed.
- Advisor disposition: orchestrator-gate-only; parent arranges authorized read-only Sol review after this stable artifact. Runtime model identity is not independently verified here.

### Boundary

Stage B is ready for parent inspection and the parent-arranged read-only review. Do not begin Stage C or change packet status until the parent opens that gate.

## Stage A consolidated repair round 1

- Completed: 2026-10-16 15:15:37 UTC, before Stage B.
- Scene derivation now exposes only task identity pins under `instructional.taskContext`; candidate/stimulus payload is omitted there. The active inspect candidate remains available only through the current-task projection while that side is active. Tests cover encounter (no candidate) and the state immediately before the right-side response.
- Inspect repair that preserves the authored numerator now records `learner-confirmed-unchanged`; response provenance still records the actual `repair-inspected-form` intent and classification. Tests no longer label it as a changed-form repair.
- Compact construct accepts the existing typed multiplier-help request/submission flow. Wrong and correct multiplier proposals are classified, and accepting help does not populate a conversion; the learner must still submit the equivalent form.
- Admission explicitly requires both authored operands to need conversion, and candidate validation is limited to those required sides. Current records remain the only admitted records; no one-side content capability or activation was added.
- Frozen pre-source oracle remains unchanged and passes.
- Focused: 5 files, 60 tests passed (`interaction-plan34-task-patterns`, authored task patterns, scene, episode, provenance/replay).
- Full suite: 38 files, 372 tests passed.
- Stage B remains closed pending parent inspection and the authorized read-only Sol review. No render/app/runner/browser work was performed.

## Stage C stable checkpoint — parent review pending

- Baseline: Stage B commit `28a5636`; Stage C authorization is the adopted Stage C gate in `mechanism-review.md`. Active execution began by 2026-10-16 23:05 UTC; stable checkpoint recorded 2026-10-16 23:20 UTC.
- Historical v4 is served from a builder output at `os.tmpdir()/fractionflow-plan34-historical-entry`, produced from current source by `createFractionFlowApp({practiceTypes: LEGACY_PRACTICE_TYPES_V4})`. The fixture is test-only and no historical output enters `dist/`. The route-ID context map covers every mounted row, excludes both prototypes, rejects unknown/missing/incorrect mappings, and prints per-context counts.
- The route matrix contains 61 rows: the first 57 baseline rows remain byte-identical to `28a5636` (parsed-prefix SHA-256 `97ed8bc2e0461611fba8eb8691f00ce76bce7f6c49452ff74cf5ef0124b3358c`); four Plan 34 rows are appended. The full Chrome sweep executed 63 witnesses: 49 historical-v4, 10 production-default-v5, and 4 prototype executions; 63 passed, zero known defects, zero failures.
- New route journeys pass independently: construct at 360×740; inspect with actual linear controls at 360×752, touch-tapping and asserting focus on every field before fill, preserving a draft across view switches and completing operation/Finish in linear; a deep wide journey traverses original bank positions 3 and 4 through legacy controls and exact-core reflection equivalence selection, reaches the fifth bank item (`one-third-plus-one-fourth`), completes visually, retries the same item, then completes and Finishes in linear; and retry/return/re-entry reset. Parent separately completed a native Tab/Enter/type keyboard-only repair journey; evidence is `evidence/orchestration-keyboard-repair-verified.png`.
- Answer and omitted-task sensitivity seeds each fail the exact clean-route assertion that protects them: candidate `6/12` is caught by the active-beat withholding assertion; `Units do not match.` is caught by the full `.app-episode` assertion. Each seeded run reports exactly one intended detection and zero unrelated failures. Parent independently tested 20 replay-v2 pin, shape, and schema corruptions; all were rejected, so no duplicate matrix was added here.
- Layout measurements for every new-route screenshot are persisted in `evidence/plan34-viewport-measurements.json` with viewport and document dimensions, scroll position, active view, question/control bounds, and visibility. Captures cover 360×740, 360×752, and 1366×768. All measured states had no horizontal overflow; several mobile/task states have vertical scroll and controls below the first viewport, so the evidence does not claim that every control fits without scrolling.
- Stage C fixed the real-browser `classList.add` error by adding the two inspect classes separately in each renderer. Compact resolve now uses the short “That's right.” prompt instead of repeating the accepted total; resolve screenshots await finite animations to settle. The clean inspect route and sensitivity tests pass after these changes.
- Validation: `npm test` — 39 files, 376 tests passed; `npm run build` passed; `node scripts/dev/plan-status.js check plan-34` returned `RUNNABLE`; `git diff --check` passed with only line-ending notices. The frozen legacy replay oracle and v1 decoder were not modified.
- Parent review is the remaining Stage C gate. No packet status change, final progress report/commit, push, or deployment has been made. No physical-device or assistive-technology claim is made from browser automation.