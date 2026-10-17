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
