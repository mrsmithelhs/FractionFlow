# Plan 20 Requirement 0 — Mechanism proposal

Date: 2026-10-15  
Baseline: `f8e154b98d85e681ce0cd87d99c8aa11a53b6e65`  
Preflight: `node scripts/dev/plan-status.js check 20` returned `RUNNABLE`.

This is a proposal for orchestrator review. No source changes or tests have been
made. The packet's Requirement 0 gate remains open until the orchestrator approves
the mechanism and exact write scope.

## Current flow and gap

The frozen schedule in `src/interaction/beat-schedule.js` already yields
`encounter → notice → operate → resolve` when validated content has no canonical
renaming and its registered definition has `includeReflection: false`. The schedule
is computed once in `createEpisode`; it does not need a new schedule rule.

The reducer does not yet support that schedule end to end. Successful notice only
advances the schedule. `handleOperate` and `handleResolve` read
`state.established.commonDenominator.targetDenominator`, and operation classification
requires two submitted converted forms. The only code that establishes
`commonDenominator` is `handleDecide`, a beat the like-denominator schedule omits.
The renderer's operate control currently accepts only a numerator and supplies a
fixed denominator. That cannot express the packet's required `5/14` denominator-
addition error. Both visual and linear notice-recovery renderers currently use copy
about unlike parts, while OQ-21 requires authored feedback for equal denominators.

Episode construction already validates the content instance and exact registered
definition, then checks selector and operation compatibility. App admission resolves
each item's exact fixture, task-data and definition identities, validates authored
path data and checks task-path closure for each listed denominator and condition.
The scene has separate mathematical and presentation boundaries, and the replay
envelope records content and episode-definition identity plus actual learner
intents. These are the contracts the proposed addition will preserve.

## Proposed learner task and identities

DECISION-041 keeps the present `Add fractions with different denominators` goal for
its current authored unlike-denominator set and future nested/shared-factor routes.
Putting `2/7 + 3/7` under that button would contradict its label. Add one separate,
small registered goal titled **“Add fractions with the same denominator”**. This is
within DECISION-035's small-goal model and makes only this one vetted task reachable;
it does not create a family taxonomy or generated practice.

Proposed immutable identities:

| Record | Identity |
|---|---|
| Practice type | `like-denominator-addition` |
| Ordered set | `like-denominator-addition-vetted-set@1` |
| Item | `two-sevenths-plus-three-sevenths` |
| Fixture | `curated-like-denominator-addition-two-sevenths-three-sevenths@plan20-record-v1` |
| Recipe | `plan20-reviewed-like-denominator-addition@1` |
| Task data | `plan20-task-data-v1` |
| Episode definition | `phase-3-like-denominator-addition@1` |

The registered fixture is exactly `2/7 + 3/7 = 5/7`, using the existing
`like-denominator-addition` selector and no overlays. The new definition binds
`selector: like-denominator-addition`, `operation: add`, and
`includeReflection: false`. Existing episode definitions, fixtures, recipes,
task-data records, practice set order and replay identities remain unchanged.
There is one item in this new set, so Plan 20 adds no Next action. Retry reconstructs
the same identity with clean state; Back to start and fragment re-entry return to
the stable same-denominator practice entry.

The candidate learner-visible button label is subject to orchestrator review. It
should stay short and accurately describe the same-denominator task.

## Proposed established-unit state and transitions

Leave `established.commonDenominator` null throughout this task: no learner chooses
a common denominator. On an accepted notice response, the reducer will establish a
distinct optional `established.sharedUnit` record derived only from the validated
content's original forms, for example:

```json
{
  "kind": "already-shared-unit",
  "targetDenominator": "7",
  "source": "validated-equal-original-denominators",
  "sourceForms": {
    "left": {"kind":"fraction","numerator":"2","denominator":"7"},
    "right": {"kind":"fraction","numerator":"3","denominator":"7"}
  }
}
```

The field is present only for the new definition, preserving historical state and
snapshot shapes for existing episodes. It is system-established evidence, not a
learner-selected denominator and not a fabricated conversion. For all other
definitions, `commonDenominator` and both conversion records retain their existing
meanings and values.

The operation classifier will accept the validated original operand forms for this
definition and compare the learner's complete submitted fraction to the exact
addition result through the existing math core. For the regular renamed route, it
will continue to receive the learner-established target and submitted equivalent
forms. `handleResolve` will validate against the same effective unit and the
accepted operation result. Resolution then reaches `status: resolved` directly
because the definition omits reflection. The episode definition and fixture
identities are replayed as usual; no replay-envelope or global schema migration is
proposed. Tests will check definition mismatch, original-form identity, exported
and restored replay, clean Retry and no skipped completion record.

The scene's Plan 20 operate meaning will use the original validated forms as the
current forms and expose the derived unit only as the active task unit. No renderer
will determine equality, sum, denominator or correctness. The output must not show a
result before the learner submits it. Provenance will record the actual notice,
operation and resolution intents and leave decide, conversion and reflection work
absent.

### Learner-submitted `5/14` recovery

For this definition only, visual and linear operate controls will provide numerator
and denominator inputs; both are actual mounted controls. The submitted pair is
passed unchanged to exact upstream classification. `5/14` is a wrong response to
`2/7 + 3/7`, so it remains in local recovery and the learner can correct it to
`5/7`. Existing practice controls keep the current single-numerator format and
fixed denominator. The `5/14` test must use a mounted input interaction in both
paths; pure classifier coverage alone is insufficient. Invalid fractions remain
rejected by the existing wire/math validators. If source inspection or a focused
prototype disproves that this conditional control can submit and retain a complete
fraction safely, stop for orchestrator direction before expanding the input model.

## Notice recovery and task applicability

Use centralized strings for OQ-21. When `recovery.classification.expectedMatches`
is true and the learner answers that parts differ, give short, specific feedback
such as “Both bars have 7 equal parts. Those parts are the same size.” Keep the
existing different-denominator response path and copy for its distinct
`expectedMatches: false` case. The exact new wording remains reviewable in the
rendered-screen acceptance. Both renderers consume the same authored string; neither
constructs feedback from mathematical truth.

Use the existing condition registry and selected support profile without silently
changing settings. For this task, transform-specific condition differences and
support dimensions for common-denominator choice/conversion are inapplicable under
DECISION-039; identical behavior is therefore a valid declared match, while the
existing canonical condition witnesses remain untouched. The route matrix will
declare same-output relations only where the tasks truly have identical applicability
and separately assert that skipped controls/tasks are absent. It will not add a
trivial reflection, a fake conversion or negative condition controls solely to
manufacture variation.

## Exact proposed write paths

New files:

- `src/content/data/plan20-like-denominator-addition-records.js` — one immutable
  compact authored record using the existing materialization contract.
- `reports/development/plan-20-like-denominator-addition/mechanism-proposal.md` —
  this gate artifact.
- `reports/development/plan-20-like-denominator-addition/progress.md` — delivery
  report, written after source/evidence work.
- `reports/development/plan-20-like-denominator-addition/evidence/` — mounted
  screenshots and machine-readable measurements required by the packet.

Existing files proposed for scoped implementation:

- `src/content/authored-problem-materializer.js` — validate and materialize the
  exact Plan 20 recipe identity.
- `src/content/authored-content-catalog.js` — register exact immutable fixture and
  task-data identity.
- `src/app/practice-types.js` — register the separate one-item same-denominator
  practice goal with the exact item/definition identity.
- `src/app/app.js` — add a narrow exact-definition admission branch for the
  zero-renaming, no-reflection task: validate the exact authored item, validated
  family, equality of original denominators and fraction-bar eligibility without
  requiring denominator-choice premise/reflection records or unlike-family path
  closure. Construct from the exact definition and preserve existing lifecycle and
  fragment semantics. The existing full authored-task/path-closure gate remains
  unchanged for other items.
- `src/interaction/episode-definition.js` — register the immutable Plan 20
  definition without altering prior definitions.
- `src/interaction/episode.js` — establish the validated shared unit on successful
  notice, use the Plan 20 operation/resolution path, and preserve actual provenance.
- `src/interaction/classification.js` — classify complete Plan 20 operation forms
  against exact original operands and the existing math core.
- `src/interaction/scene.js` — project original current forms and the established
  shared unit for this definition without answer leakage.
- `src/render/strings.js` — author concise equal-parts recovery copy and any
  definition-specific full-fraction operation prompts.
- `src/render/beat-container.js` and `src/render/linear-path.js` — render the same
  denominator-addition response fields and OQ-21 feedback through existing scene
  contracts.
- `tests/plan20-like-denominator-addition.test.js` — add focused fixture/materializer,
  definition/admission, reducer, scene, recovery, registered route and replay
  assertions, while keeping the current canonical suites unchanged where possible.
- `tests/interaction-provenance-replay.test.js` — add an exact Plan 20 replay
  round-trip and historical envelope compatibility assertion.
- `tests/routes/route-matrix.json` and `tests/route-contract.test.js` — add only the
  Plan 20 routes and their contract/absence/applicability declarations.

The route runner already supports mounted selector-based fill/click and absence
assertions, so no edit to `scripts/dev/run-route-matrix.js` is currently proposed.
If the existing route vocabulary cannot exercise two actual response fields, stop
and propose the smallest runner change before editing it.

No source path outside this list is proposed. If delivery evidence demonstrates a
necessary extra source path or requires broader state/input contracts, stop and
request a bounded scope amendment.

## Requirement 1–2 evidence boundary

The later delivery will exercise the real learner route from entry through correct
notice, wrong-notice recovery and retry, actual mounted `5/14` entry and correction,
addition and resolution, help/Replay when meaningful, Retry, Back to start,
re-entry and the supported fragment. It will include keyboard/tab completion,
non-drag touch-context controls, visual and linear paths, standard and reduced
motion, selected high/medium support profiles, and measured 360px entry/recovery/
completion states. It will assert skipped decide/transform/reflect prompts, controls,
summaries and result content are absent from visual, semantic and hidden DOM surfaces
before the learner's response and that only actually performed work appears in the
resolved summary/provenance.

Seeded negative controls will mount stale conversion copy and unlike-denominator
recovery text and require the witnesses to fail. Captures and their verifier will
be rerun from the final build. Existing route rows and reciprocal controls remain
intact. Browser routes evidence the browser control contract only; they do not
establish physical Chromebook, native touch keyboard, assistive technology or
learning efficacy.

## Questions for the mechanism review

1. Approve or correct the separate `like-denominator-addition` learner goal, label,
   one-item set and proposed exact identities.
2. Approve or correct the optional `established.sharedUnit` set on successful
   notice, with `commonDenominator` remaining null and original forms retained.
3. Approve the conditional mounted numerator+denominator operation control needed
   for actual `5/14` recovery, and the bounded classification/UI paths above.
4. Approve the exact write list, test placement and limited route-runner contingency.

I will not begin source changes until the orchestrator returns an explicit
mechanism disposition.
