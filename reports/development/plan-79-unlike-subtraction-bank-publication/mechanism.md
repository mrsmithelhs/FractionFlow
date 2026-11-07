# Plan 79 — Requirement 0 mechanism proposal

2026-11-07. **Proposed; not approved or implemented.** Preflight `node scripts/dev/plan-status.js check 79` returned RUNNABLE. Committed source baseline: `527815ee2f6eb2b467951cb189ad4a9b9ec68c5f`. Three unrelated untracked Plan 39 route-run JSON files pre-existed. Plan 78 is proposing in parallel: recheck HEAD, status, and affected files after an assigned write window; rebase the proposal if those files change. Local app integration is in scope; deployment is a separate gate.

## Exact data and identity

Use the eight full records in Plan 76 `expanded-records.json` verbatim as the identity/content authority, including source operands, candidates, selectors, overlays, required sides, and registered targets. Add them to the existing Plan 40 records array, letting its existing normalizer and fixture map materialize the definition, task data, fixtures, and inspect stimuli. Every item has authoring revision `plan76-record-v1`, fixture ID `curated-<itemId>`, definition `phase-3-reusable-subtraction-recipes` revision 1, pattern revision 1, task data `plan40-subtraction-recipe-task-data` revision 1; inspect stimulus IDs are `<itemId>-stimulus` revision 1, with candidates exactly as adopted. No separately stored answer keys: derive conversions and differences through the exact math core. Do not register the eligible alternate target.

Keep the existing `PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET` and its constants as v1, unchanged, including order and holdout set. Add a separately named v2 object with the same set ID and revision `2`, membership exactly the 17 ordered item IDs in Plan 76 `publication-proposal.json` (nine existing then these eight):

1. `plan76-construct-two-thirds-one-fifth-15` — 2/3 − 1/5, target 15, construct, 7/15.
2. `plan76-construct-five-sixths-one-tenth-30` — 5/6 − 1/10, target 30, construct, 22/30.
3. `plan76-construct-three-fifths-one-fourth-20` — 3/5 − 1/4, target 20, construct, 7/20.
4. `plan76-inspect-three-fourths-one-fifth-20` — 3/4 − 1/5, target 20, inspect, candidates 15/20 and 5/20, 11/20.
5. `plan76-inspect-seven-eighths-one-sixth-24` — 7/8 − 1/6, target 24, inspect, candidates 20/24 and 4/24, 17/24.
6. `plan76-inspect-four-fifths-one-third-15` — 4/5 − 1/3, target 15, inspect, candidates 11/15 and 5/15, 7/15.
7. `plan76-identify-seven-eighths-one-fourth-8` — 7/8 − 1/4, target 8, identify right, 5/8.
8. `plan76-identify-three-fourths-one-eighth-8` — 3/4 − 1/8, target 8, identify left, 5/8.

Register both set objects plus unchanged holdouts in the association list. Build live practice items in v2 manifest order by ID, not by filtering records (holdouts must remain isolated). Point only the existing `unlike-denominator-subtraction` chooser practice at v2; keep its label, definition and chooser structure. Existing v1 batch exports stay v1 for historical consumers. Source inspection: `src/app/app.js` passes `practiceType.setId` and `.setRevision` to `resolvePlan40SubtractionRecipeContext` both while checking the instance and creating the episode; the resolver uses exact ID/revision/item membership and context validation re-resolves the stored identity. `rg` over src/tests found the item-only `findPlan40RecipeAssociationSet` only in its definition and test imports, no production callers. It will return null for v1 items shared by v2, by its current ambiguity contract; explicitly test that behavior and the explicit resolver. No shared behavior change is currently proposed. If a real consumer or identity failure appears, stop and seek approval before broadening.

## Frozen oracle and replay

Before any source changes, captured `v1-v6-oracle.json` from the pinned checkout: the first v1 construct item, high support, five actual intents through resolved compact completion, its v6 envelope and complete expected state. Immediately reconstructed it and checked deep equality on the pre-change code. After integration read this static file, compare reconstructed state exactly, and do not regenerate the oracle. Test both a carried v1 item and a new item with explicit v2 context and replay, wrong revisions and wrong membership (including a new item under v1), plus existing v4/v5 baseline readers and existing v1/holdout tests. The oracle is one representative, not proof of all prior sessions.

## Duplicate and coverage audit before activation

Plan 76's audit classified 39 binary live entries and left 54 unary/unresolved entries; it compared 11 Plan 40 records and found an addition overlap for 2/3 and 1/5. Produce a reproducible per-entry inventory of *all* current practice items, grouped by practice type, definition/operation, item ID, source catalog and resolution method. Trace each of the 54 through its actual definition-specific catalog or classify demonstrably unary/non-binary with the reason; no unexplained unresolved entries. Include relevant registered subtraction records beyond the live chooser, holdouts, and adopted batch; use reduced exact ordered operand pairs (also report exact authored forms), compare within and against candidates, and identify within-batch repeats. Separately list cross-operation overlaps. Audit item IDs, fixture ID+authoring revision, stimulus ID+revision, set ID+revision and catalog collisions across actual registries, accounting for legitimate v1/v2 membership repetition. Independently calculate and record coverage by recipe, denominator relationship, target, side/invalid side and exact difference, verifying 3 construct, 3 inspect, 2 identify. Persist script/ledger and results under this report folder. If any subtraction duplicate, unsupported entry, ambiguous source, or identity collision remains, report evidence and stop before activation; do not silently modify the adopted batch. This audit is planned, not yet completed.

## Mounted witness and protected routes

Add a distinct Plan 79 route/context and browser evidence; preserve the historical Plan 40 v1 context, route specifications, receipts and fixture oracles unchanged. If existing assertions assume the chooser itself remains v1, update those assertions to distinguish historical context from current chooser, without rewriting historical evidence. Use the actual app chooser and controls: start the existing practice, complete/advance through the nine originals, explicitly observe item 9 `plan40-identify-two-thirds-five-twelfths-12` → Next → item 10 `plan76-construct-two-thirds-one-fifth-15`, v2 context, fresh draft, and complete through item 17 and exhaustion. Record chooser, item identity/order, controls and transitions with screenshots/route results. Across discriminating real-browser journeys cover construct, inspect and identify, incorrect answer and recovery, accepted equivalent, view switching, and narrow 360px visual and linear rendering at target 30. Pair with deterministic admission and completion for every v2 item; do not imply mock or intent-driven setup is real UI evidence. Preserve protected routes and rerun affected ones; if a route hard-codes old chooser behavior, propose a separately reviewed migration rather than overwrite historical evidence. No device, AT speech or learner validation is inferred from browser automation.

## Expected shared-file write window

Exact anticipated existing shared files, subject to approval and recheck (no source edits made):

- `src/content/data/plan40-reusable-subtraction-recipes-records.js` — adopted records, separate v2 association.
- `src/app/practice-types.js` — ordered v2 chooser materialization.
- `tests/content-plan40-subtraction-recipes.test.js` — preserve v1 and add v2 identity/admission assertions.
- `tests/app-plan40-subtraction-recipes.test.js` — current chooser and boundary tests while preserving historical cases.
- `tests/plan43-shared-progression.test.js` — current chooser length expectation and progression.
- `tests/replay-plan40-v6-compatibility.test.js` — frozen oracle and explicit revision cases; preserve older readers.
- `tests/routes/plan34-context-map.json`, `tests/routes/route-matrix.json`, `scripts/dev/run-route-matrix.js`, `tests/routes-plan40-subtraction-recipes.test.js`, `tests/route-contract.test.js` — only if the new mounted route requires new entries or explicit compatibility assertions; append new Plan 79 context/route, not alter historical Plan 40 route/receipts. Reassess whether a packet-local browser harness avoids each of these edits; do not assume historical route can still launch v1 via the current chooser.

New packet-local audit, browser and evidence artifacts and a focused `tests/plan79-unlike-subtraction-publication.test.js` are anticipated. Existing shared test files may need small expectation changes when their assumed record count changes; if inspection identifies additional exact paths, return to orchestration before editing them. No edits planned to `src/app/app.js`, resolver, replay, renderer, scheduler, featured rotation, local records, existing receipts or protected route definitions. Plan 78 may overlap shared tests/routes or app practice wiring: require both mechanism approval **and an assigned exclusive shared-file write window** before any shared edit; coordinate actual final file list with orchestration.

## Verification and gates

After approval and write window: audit first; run focused content/app/replay/progression and new tests, full `npm test`, `npm run build`, applicable `npm run test:routes` selections and browser journeys, `node scripts/dev/plan-status.js lint`, and scoped diff checks. Save command/results and browser/version/device/AT limits. Report implementation and stop for orchestration technical review and owner rendered acceptance. No push/deployment. Subagent tool is available; this proposal uses orchestrator-gate-only review, with no advisor run. A bounded read-only Terra-medium advisor on implementation may run only if orchestration authorizes it; record actual disposition then.
