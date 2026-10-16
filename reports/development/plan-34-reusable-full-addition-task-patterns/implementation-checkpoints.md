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
