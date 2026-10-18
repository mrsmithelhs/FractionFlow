# Plan 35 child checkpoints

## Requirement 0 investigation — 2026-10-17

- Preflight: `node scripts/dev/plan-status.js check 35` returned
  `RUNNABLE: plan-35 is ready to implement`.
- Read the active packet, `AGENTS.md`, implementer prompt, Plan 18/32/34 reports,
  Plan 29 adopted scale/integration addendum, Phase 3 follow-up obligations,
  orchestration checkpoint and decision-log entries 034/035/037/042/044.
- Traced current Plan34/Plan18 admission, schedule construction, task registries,
  practice-set membership, app association, replay dispatch, route context and
  the Plan18 retained-prefix helper. Details and proposed exact source paths are
  in `requirement-0-proposal.md`.
- Ran only the small read-only exact-math proposal probe. The `.mjs` artifact
  calls current math APIs and writes the accompanying 15-row JSON receipt. No
  tests, browser routes, builds or package scripts were run.
- This assignment stops here pending parent mechanism/batch approval. No product
  source, tests, dependencies/settings, packet status, review, orchestration
  checkpoint, Git metadata or Bootstrap files were changed. Pre-existing
  `tmp-vite-out.log` and `tmp-vite-err.log` were not touched.

## Parent-directed R0 refinements — 2026-10-17

- Parent/reader review clarified that v2 already carries target, candidate and
  stimulus fields; v4 reuses those and adds only explicit `sourceForms`, while
  retaining strict old definition/schema validation.
- Parent approved the exact versioned reassociation approach: set@7 preserves
  the first 13 numerical item IDs/order; the eight legacy workflows stay on
  their old definitions; three Plan34 and two Plan18 compact prefix items move
  to equivalent Plan35/v4 recipes with exact schedules/stimuli/forms. Set@6,
  its helper/routes and v2/v3 replay remain historical and unchanged.
- Initial live batch is 21 items: the 13-item prefix plus eight named appended
  items. Two named hold-outs use an explicit test-only set@1 and task-data@2;
  strict membership and replay do not use null/implicit compatibility.
- Parent-arranged Sol read-only R0 review agreed with the recipe and bounded
  mechanism. Requested/observed identity and cost remain parent-side review
  reporting; no behavioral implementation consultation has run.
- Exact math probe now covers prefix, appended and both hold-out examples (15
  rows), including mirrored sides, candidate equivalence, scale/target limits,
  raw results and reducible/irreducible forms.
- Ready for parent mechanism/batch review. Stop here: no source/test edits or
  executions were made.

## Parent decisions incorporated; gate remains

- Parent selected the three fixed recipes, Plan35 definition@1 / replay-v4,
  set@7 with the same first 13 numerical IDs/order and eight appended tasks.
- Parent selected equivalent Plan35/v4 reassociation for three Plan34 and two
  Plan18 compact prefix items. The other eight prefix workflows remain legacy;
  historical set@6, its helper/routes and v1/v2/v3 meanings remain pinned.
- Parent selected the two named explicit test-only hold-outs and the strict
  exact-membership/reconstruction model. They remain for a later data-only
  checkpoint after foundation review.
- At the end of R0, work stopped at the parent mechanism gate. Parent later
  approved and committed that gate before this oracle-only assignment.

## Pre-edit Plan 18 v3 oracle capture — 2026-10-17

- After parent mechanism approval at `459745954d6b342237083e13a13bcac18a074c7b`,
  captured the existing Plan 18 v3 initial and completed replay envelopes and
  full expected states for both operand orders.
- Reproducible capture: `capture-plan18-v3-oracles.mjs`. Its four-case
  round-trip self-check returned `allReplayMatches: true`. The artifact records
  the captured source HEAD and remains the pre-foundation baseline.
- Persisted `tests/fixtures/plan18-v3-replay-oracles.json`. Existing v1/v2
  fixtures were not edited. No product source or test code was changed and no
  suite/build/browser check was run. Stop for parent verification and commit.

Uncertainty: the exact catalog path for a new curated fixture revision and the
current source/test route ownership should be rechecked at the authorized next
stage. The candidate cases are mathematical/API-validity probes only; authored
task admission, candidate stimulus quality, geometry at all viewports, and
rendered learner agency remain unverified.

## Stage A pure foundation — 2026-10-17

- Added a closed exact set/item/task-data association registry. Only live
  set@7/task-data@1 is registered at this checkpoint; the registry API is
  prepared for later exact test-only hold-out registration through data edits,
  while null or unregistered set identities remain rejected.
- Added the 13-item compact recipe data batch: the original 13 item identities
  and order are retained, with the five Plan34/Plan18 compact-prefix
  associations versioned to Plan35; the other eight remain on their existing
  workflows. The eight appended recipe tasks follow the approved batch. No
  hold-out records were added.
- Added Plan35 recipe admission using the exact registered item, fixture,
  source forms, selector, candidate, target and required sides, validated with
  the existing exact math APIs and task eligibility/capacity rules. The
  resolver supports only the three approved recipe families and does not
  admit arbitrary fixtures or selectors.
- Registered the Plan35 episode definition and immutable schedules, shared
  compact episode/recovery/provenance/help/scene handling, and strict v4 replay
  reconstruction. The Plan18 identify recipe retains its side-selection
  responsibility, post-conversion history Replay and multiplier-help path.
  Its pre-choice scene projection omits `requiredSides`, source forms and
  candidate answers. V1/v2/v3 fixtures and the frozen pre-edit Plan18 v3
  oracle remain unchanged.
- Focused verification: `npx vitest run
  tests/interaction-plan35-reusable-addition.test.js
  tests/interaction-episode.test.js tests/interaction-provenance-replay.test.js
  tests/interaction-plan34-task-patterns.test.js
  tests/interaction-plan18-nested-addition.test.js` passed: 5 files, 44 tests.
  The Plan35 sweep exercises every current registered item through high and
  medium support, recovery/completion, replay reconstruction, and semantic
  comparison of the five reassociated prefix items with their historical
  Plan34/Plan18 task semantics.
- Not run: hold-out replay after data-only registration, app/default-registry
  wiring, mounted render or route matrix, browser/accessibility observation,
  build, and full repository test suite. These remain outside Stage A.
- This is an implementation checkpoint for parent/Sol review, not product
  acceptance or Plan35 completion. No Git metadata was written; existing
  `tmp-vite-out.log` and `tmp-vite-err.log` were left untouched.

## Stage A consolidated repair round 1 — 2026-10-17

- Restored beat-specific identify help: at `decide`, Plan35 matches Plan18's
  renaming-side comparison; at `transform`, it returns the established
  equivalent-fraction help with side, status and accepted multiplier. Tests
  compare the projected help responsibilities/fields against the historical
  Plan18 helper at both beats.
- Added closed recipe identity/revision validation before task derivation.
  Inspect candidate validation now requires `kind: fraction`, a canonical
  nonnegative integer-string numerator, exact target denominator and numerator
  no greater than that denominator. Malformed candidate forms produce the
  typed task-context error rather than falling into `BigInt` parsing.
- Kept episode admission bound to the exact registered item/fixture resolver;
  the exported pure record validator supports negative authoring checks but
  does not provide another episode admission path. Tests reject unknown recipe
  IDs/revisions and malformed/out-of-domain candidates.
- Removed duplicate numerical fixture definitions for the six new Plan35
  fixtures: each task row is now the authoritative compact source-form record,
  and its profile, selector and overlays generate the corresponding fixture
  row. Existing prefix fixture bindings and all reviewed identities/forms are
  unchanged. A data-only fixture addition now requires one numerical source
  row plus the distinct task association(s) that reference it.
- Strengthened the all-record high/medium sweep: each item now exercises
  applicable wrong-side/conversion/inspect recovery and a wrong operation,
  confirms the frozen schedule remains unchanged, completes correctly, and
  asserts the expected constructed, confirmed, repaired or absent conversion
  origins.
- Focused verification after round 1: `npx vitest run
  tests/interaction-plan35-reusable-addition.test.js
  tests/interaction-episode.test.js tests/interaction-provenance-replay.test.js
  tests/interaction-plan34-task-patterns.test.js
  tests/interaction-plan18-nested-addition.test.js` passed: 5 files, 45 tests.
  No hold-outs, app/default registry, mounted rendering, routes, dependencies,
  settings or Git metadata were changed.

## Stage A data-only readiness repair round 2 — 2026-10-17

- Replaced live set@7's derived appended membership with the explicit eight
  approved appended item IDs. Adding a separate registered test set later will
  not expand or reorder the learner-facing 21-item live set.
- Task-data mapping now preserves an authored `taskDataRevision` when present
  and defaults to revision 1 only when absent. This enables later hold-out
  associations to declare task-data@2 with data-only additions.
- The generic test start helper now resolves the item's unique registered
  association set and passes its exact ID/revision to task admission, rather
  than assuming every registered task belongs to live set@7. Assertions for
  live set size (21), preserved prefix/order (13), and live recipe totals
  (3 construct / 4 inspect / 6 identify) filter explicitly to set@7, so
  additional test-only task rows do not require changing those expectations.
- Recipe admission now requires `targetDenominator` to be a canonical positive
  integer string; a negative test passes numeric `12` and verifies rejection.
- Focused verification after round 2: the same five authorized suites passed,
  45 tests total. No hold-out records, app/render/routes, settings, dependency
  changes or Git metadata were added. This is the second consolidated repair
  checkpoint; stop for parent/Sol review and commit before further expansion.

## Stage B data-only hold-outs — 2026-10-17

- Against accepted foundation `46790ad`, changed only
  `src/content/data/plan35-addition-recipe-records.js`: added the approved
  construct `1/5 + 1/6` at target 30 and inspect `1/2 + 1/5` at target 20,
  each with task-data@2 and exact membership in test-only
  `plan35-data-only-holdouts@1`.
- The live set remains 21 items and 13 live recipe records. The complete data
  registry now contains 15 records (13 live, 2 hold-out); the hold-out set
  contains only its two explicit IDs. No test or behavior changes were needed.
- Existing generic high/medium completion, recovery, and replay checks passed
  unchanged: five focused suites, 45 tests. A registry probe confirmed exact
  live/hold-out membership and task-data revision 2 for both held-out records.
- Full diff description, exact source diff statistics, verification command,
  change-class boundary, and limits are recorded in
  `stage-b-data-only-holdouts.md`. Stop for parent diff verification and commit;
  no mounted wiring is authorized at this checkpoint.

## Stage C1 mounted wiring — 2026-10-17

- Made set@7 the active `sum-under-one` practice type with 21 fixed items and
  Plan35 definition/context only for its 13 registered recipe tasks. The eight
  legacy prefix workflows remain on their previous definitions. The exported
  `PLAN18_PRACTICE_TYPES_V6` remains the exact 13-item set@6 historical fixture;
  new active practice items are derived from the live association data, never
  from the test-only hold-out set.
- Added exact authored-content catalog entries for newly materialized recipe
  fixtures and app-side exact Plan35 association resolution. The app rejects a
  live item whose definition, recipe, target, task data, fixture or set binding
  disagrees with the closed data resolver.
- Connected existing shared compact rendering to Plan35's side-choice and
  operation controls. Side-choice help and wrong-side recovery use the
  validated target denominator while the question stays target-free. Replay is
  hidden for construct/inspect and available to identify only after conversion.
  Operation focus/drafts use the existing compact controls. No per-item UI
  branches were added.
- Added `tests/plan35-mounted-recipes.test.js`: six mounted mock-DOM journeys
  cover construct at 10/30, inspect at 24/30 and identify at 10/12. They span
  visual/linear views and actual high/medium settings; exercise task help,
  applicable wrong-side/candidate/conversion/operation recoveries, completion,
  Next, fresh-state reset, focus, identify Replay and untouched-operand
  membership. The test also verifies live set@7 has 21 items, 13 recipe
  associations, and neither hold-out is reachable. Historical Plan18/34 tests
  now explicitly mount their preserved v6/v5 exported practice sets.
- Focused mounted verification passed: 5 files / 35 tests for Plan35, Plan18,
  Plan34 and app shell. Additional app/navigation/regression verification
  passed: 4 files / 26 tests for Plan26 practice navigation, crossing addition,
  and entry page. No route matrix, browser, build or broad full-suite run was
  performed; those belong to C2 after parent checkpoint.
- C1 source/test paths: `src/app/practice-types.js`, `src/app/app.js`,
  `src/content/authored-content-catalog.js`, shared `src/render/strings.js`,
  `src/render/beat-container.js`, `src/render/linear-path.js`, and
  `tests/plan35-mounted-recipes.test.js`, plus historical fixture test updates
  in `tests/app-plan18-practice-set.test.js`,
  `tests/plan18-rendered-nested-addition.test.js`, and
  `tests/plan34-rendered-task-patterns.test.js`.
- Stop for parent/Sol review and commit before C2. Mock-DOM evidence does not
  establish native browser layout, viewport reach, motion or assistive
  technology behavior. No route runner/matrix or root Vite log was changed.

### C1 target-copy correction — 2026-10-17

- Parameterized the encounter target cue from the validated task denominator:
  construct and inspect now say `Use N equal parts.` (retaining historical
  `Use twelfths.` at target 12), while identify-side tasks omit this additional
  cue. This avoids a false twelfths instruction on targets 10/24/30 and
  preserves the Plan18 identify question flow.
- Added mounted assertions for construct/inspect target cues at targets 10,
  24 and 30, and for no target cue on identify at targets 10/12.
- Reran the authorized focused app/render regression command: 9 files, 61 tests
  passed. `git diff --check` is clean. No route matrix, browser, build or full
  suite run was performed; stop for parent/Sol review before C2.
