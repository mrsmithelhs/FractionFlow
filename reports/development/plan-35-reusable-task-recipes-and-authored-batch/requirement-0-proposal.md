# Plan 35 Requirement 0 — mechanism and batch proposal

Date: 2026-10-17. This is an investigation proposal only. No product or test
source has been changed, and no implementation/test authorization is inferred.

## Finding and mechanism boundary

The requested generalization crosses three distinct current contracts. In
`src/content/full-addition-task-patterns.js`, `resolvePlan34TaskContext` rejects
every target except `12`, accepts only three task records, checks selected-set
membership at revisions 5/6, and insists both operands need conversion. The
second and third limits are legitimate current authored coverage; the exact
target and two-side constraints are implementation limits of this bounded
resolver. `deriveRequiredConversionSides` already computes sides through
`convertToDenominator`. `src/interaction/beat-schedule.js` then freezes encounter,
one transform per derived side, operate and resolve. It already lets the
construct/inspect pattern change transform responsibility without changing the
shared reducer.

In `src/content/nested-renaming-task.js`, Plan 18 resolves only two exact
records, requires set@6 membership, checks target 8, and pins one conversion
side. The required side is authored and checked against exact conversion truth.
Its episode branch hard-codes target 8 in recovery and scheduling
(`src/interaction/episode.js`). DECISION-037/044 intentionally authorize that
focused task and its two operand orders; this is not permission for arbitrary
common-unit choice. Target, content identity, exactly-one-side requirement and
exact source records remain policy checks; registry size and target-8-only
admission are current data/association limits for this focused task. `createEpisode`
also has separate family gates for Plan34 and Plan18 identities, and the nested
gate checks its historical authoring revision and exactly-one-side relationship.
Current render copy in `src/render/strings.js` includes target-12 plural wording
(`Use twelfths.`), target-12/24 unit names, a Plan18 side question, and generic
multiplier/help contracts; new recipes need target-derived wording without a
per-item branch.

Representation admission is separately bounded by
`src/content/eligibility.js`: current fraction-bar paths cap target denominator
at 30 and each scale factor at 12. Mathematical validity, authored path
coverage, and representation eligibility are separate outputs. Keep those
boundaries; no larger denominator or unrestricted path is proposed. Probe
results in [requirement-0-probe-results.json](requirement-0-probe-results.json)
were calculated by the exact APIs (`convertToDenominator`,
`validateCommonDenominator`, `addAtCommonDenominator`,
`validateOperationResult`, and `simplifyFraction`). The script is
[requirement-0-probe.mjs](requirement-0-probe.mjs). It is a 15-row exact-math
probe covering the five reassociated prefix items, eight appended items and two
held-outs, including mirrored identify-side cases; it is not an authored
content validator run or proof of learner readiness.

## Three fixed recipe contracts

Use a new, explicit Plan 35 episode definition identity, proposed as
`phase-3-reusable-addition-recipes@1`, with exact immutable task records that
associate a content identity/revision, recipe identity/revision, target,
task-data identity/revision and optional candidate stimulus identity/revision.
Select and validate that association before episode creation; compute/freeze
the schedule once. Recovery, errors, help, view, support and replay never
choose or change the recipe. Unknown, missing, extra or mismatched context
fails closed. Recipe IDs are task semantics; item IDs remain numerical content;
practice-set placement is a third identity.

| Recipe identity | Fixed learner obligations | Derived facts and constraints |
|---|---|---|
| `full-addition.construct-equivalent@1` | Encounter acknowledgment; construct each required equivalent; submit one addition result; finish at resolve. | Use exact conversion to derive sides/forms and exact operation validation for truth. Supply the authored target as concise context. Admit only reviewed proper, reduced, positive operands, two required sides, sum below one, and eligible exact target. No notice, denominator choice, or reflection. |
| `full-addition.inspect-keep-repair@1` | Same schedule positions and operation/finish responsibilities; at each transform, respond to one authored candidate by keeping it or changing its numerator, then submit one addition result and finish. | Candidate identity/forms are fixed authored data. Exact fraction equivalence and operation APIs determine validity; no correctness cue before response. Preserve candidate stimulus, actual keep/change intent, valid unchanged edit, rejected response/recovery, and confirmed/repaired/provided form provenance. |
| `full-addition.identify-side-construct@1` | Encounter acknowledgment; answer “Which fraction needs a different denominator?”; construct only that side; submit one sum; finish. | Fixed target equals the denominator already present on exactly one operand. Derive the other side by exact conversion and verify one side is unchanged. Wrong-side response recovers at the choice and cannot alter the frozen side. The untouched source form is provided context, with no learner conversion provenance. |

All three retain the existing operation form actually accepted by the learner.
There is one numeric sum submission at operate; resolve is the established
finish/navigation action. No answer table is authored: equivalents, sides,
raw totals, simplification classification, validity and path eligibility are
derived by the existing exact APIs and validators. Shared reducers/renderers
consume the frozen schedule and validated state; recipe-specific source
branches are limited to admission/configuration where semantics differ.

Local help stays opt-in, task-local, draft-preserving and answer-withholding.
Construct help can explain the requested target/unit multiplier without
entering or accepting a numerator. Inspect help can explain what equivalence
means without identifying whether the displayed candidate is valid or supplying
the repair. Side-identification help may explain comparing source units only
after requested; it must not name the side or transform factor. Keep actual
registered high/medium support configurations and both views. Do not invent a
profile distinction or a learner taxonomy control.

## Discriminating initial assignments and data-only hold-outs

The exact arithmetic probe supports these target/scale cases under current
bar limits. First keep all 13 numerical item IDs and their order exactly as
set@6. Reassociate only the five compact items in set@7 to the new definition;
their previously accepted learner responsibility, target, schedule shape,
candidate stimulus identity/forms, operation and finish behavior stay the same.

| Existing set@6 item / exact fixture revision | Old active task | New set@7 task | Preserved target, schedule and authored stimulus |
|---|---|---|---|
| `two-thirds-plus-one-fourth` / `curated-relatively-prime-addition-non-least@plan03-fixtures-v1` (`2/3 + 1/4`) | Plan34 def@1, construct pattern@1 | Same item ID and fixture under Plan35 def@1, `construct-equivalent@1` | Target 12; encounter, two transforms, operate, resolve; factors 4/3 and `11/12`. |
| `one-half-plus-one-third` / `curated-relatively-prime-addition-one-half-one-third@plan26-fixtures-v1` (`1/2 + 1/3`) | Plan34 def@1, inspect pattern@1 | Same item ID/fixture under Plan35 def@1, `inspect-keep-repair@1` | Target 12; preserve candidate ID `plan34-one-half-plus-one-third-inspect-candidate@1`; left `5/12` false (repair to 6), right `4/12` true (keep); same two-transform schedule. |
| `one-third-plus-one-fourth` / `curated-relatively-prime-addition-one-third-one-fourth@plan32-record-v1` (`1/3 + 1/4`) | Plan34 def@1, inspect pattern@1 | Same item ID/fixture under Plan35 def@1, `inspect-keep-repair@1` | Target 12; preserve candidate ID `plan34-one-third-plus-one-fourth-inspect-candidate@1`; left `4/12` true (keep), right `7/12` false (repair to 3); same schedule. |
| `nested-one-half-plus-three-eighths` / `curated-nested-addition-one-half-three-eighths@plan18-record-v1` (`1/2 + 3/8`) | Plan18 def@1, one-side task | Same item ID/fixture under Plan35 def@1, `identify-side-construct@1` | Target 8, choose left, construct left only, operate, resolve; same five entries and forms. |
| `nested-three-eighths-plus-one-half` / `curated-nested-addition-three-eighths-one-half@plan18-record-v1` (`3/8 + 1/2`) | Plan18 def@1, one-side task | Same item ID/fixture under Plan35 def@1, `identify-side-construct@1` | Target 8, choose right, construct right only, operate, resolve; same five entries and forms. |

The remaining eight prefix workflows retain their exact legacy definitions,
task contexts and behavior. Old v1/v2/v3 replay and the historical set@6 route
continue to reconstruct the previous identities. The new associations preserve
the five compact tasks' behavior while making all three recipes reachable under
the one new definition and replay contract.

Every initial Plan35/v4 context uses exact registered set@7 membership and
`plan35-addition-recipe-task-data@1`; inspect contexts preserve the Plan34
stimulus IDs and exact candidate forms listed above. Reassociation does not
mutate existing Plan34 or Plan18 data records. The v4 record explicitly binds
the same source forms and target to the preserved numerical item identity.

Append exactly these eight new live task items after the same 13-item prefix:

| Recipe association and item ID | Compact numerical record identity / source forms | Target and required sides | Stimulus or exact distinction |
|---|---|---:|---|
| `construct-equivalent@1`, `plan35-construct-half-fifth-10` | Existing `one-half-plus-one-fifth` = `curated-relatively-prime-addition-one-half-one-fifth@plan32-record-v1`; `1/2 + 1/5` | 10; both | Factors 5 and 2; exact forms `5/10 + 2/10`, raw/simplified `7/10`. |
| `construct-equivalent@1`, `plan35-construct-three-fifths-third-30` | Existing `three-fifths-plus-one-third` = `curated-relatively-prime-addition-three-fifths-one-third@plan32-record-v1`; `3/5 + 1/3` | 30; both | Factors 6 and 10; `18/30 + 10/30`, raw `28/30`, simplified `14/15`. |
| `inspect-keep-repair@1`, `plan35-inspect-third-eighth-24` | New `curated-plan35-inspect-one-third-one-eighth@plan35-record-v1`; `1/3 + 1/8` | 24; both | Stimulus `plan35-stim-third-eighth-24@1`: left `5/24` false (repair to 8), right `3/24` true (keep); `11/24`. |
| `inspect-keep-repair@1`, `plan35-inspect-fifth-third-30` | New `curated-plan35-inspect-one-fifth-one-third@plan35-record-v1`; `1/5 + 1/3` | 30; both | Stimulus `plan35-stim-fifth-third-30@1`: left `6/30` true (keep or valid unchanged-edit), right `11/30` false (repair to 10); raw `16/30`, simplified `8/15`. |
| `identify-side-construct@1`, `plan35-identify-half-three-tenths-10` | New `curated-plan35-identify-one-half-three-tenths@plan35-record-v1`; `1/2 + 3/10` | 10; left | Target is already present on right; construct `5/10`; raw `8/10`, simplified `4/5`. |
| `identify-side-construct@1`, `plan35-identify-three-tenths-half-10` | New mirrored `curated-plan35-identify-three-tenths-one-half@plan35-record-v1`; `3/10 + 1/2` | 10; right | Opposite frozen side with same exact sum. |
| `identify-side-construct@1`, `plan35-identify-third-five-twelfths-12` | New `curated-plan35-identify-one-third-five-twelfths@plan35-record-v1`; `1/3 + 5/12` | 12; left | Target is present on right; construct `4/12`; raw `9/12`, simplified `3/4`. |
| `identify-side-construct@1`, `plan35-identify-five-twelfths-third-12` | New mirrored `curated-plan35-identify-five-twelfths-one-third@plan35-record-v1`; `5/12 + 1/3` | 12; right | Opposite frozen side with same exact sum. |

Together, the reassociated prefix and eight appended items give construct
targets 10/12/30, inspect targets 12/24/30, and identify-side targets 8/10/12
with both required-side values. The listed item IDs, compact fixture identities,
recipe/target associations, stimulus IDs/forms and corrections are the exact
proposal. All candidate truth, sides, scales and results in the probe receipt
were computed/checked with current exact APIs, including `equalFractions`.
Candidate truth remains hidden until a learner response.

Declare these exact held-outs before implementation; they are not in the live
set@7 and must never be assigned a null/implicit set identity:

| Hold-out task item | Numerical record identity and source forms | Association/stimulus | Exact expected forms and result |
|---|---|---|---|
| `plan35-holdout-construct-fifth-sixth-30` | `curated-plan35-holdout-one-fifth-one-sixth-construct@plan35-record-v1`; `1/5 + 1/6` | construct@1, target 30, task data `plan35-addition-recipe-task-data@2` | `6/30 + 5/30 = 11/30`; irreducible. |
| `plan35-holdout-inspect-half-fifth-20` | `curated-plan35-holdout-half-fifth-inspect@plan35-record-v1`; `1/2 + 1/5` | inspect@1, target 20, stimulus `plan35-stim-holdout-half-fifth-20@1`, task data `plan35-addition-recipe-task-data@2`; candidates left `9/20` (false, repair to 10), right `4/20` (true, keep). | `10/20 + 4/20 = 14/20`, simplified `7/10`; candidate truth is confirmed by exact equality. |

Keep both hold-outs outside app practice types and register them under the exact
test-only set `plan35-data-only-holdouts@1`, with precisely those two item IDs.
The generic resolver and replay accept this explicit set only when its exact
registered item/task-data membership matches; no `null` compatibility pair or
arbitrary omitted set is admitted. A v4 replay for a hold-out reconstructs the
exact fixture and task-data revision and validates membership in that exact
test-only set, so the proof covers ordinary strict replay without making the
task learner-reachable. Following the foundation checkpoint, the only allowed
source diff for the hold-out proof is authored fixture/task data and that
explicit test-only membership/association data. No recipe, resolver, reducer,
renderer, schedule, or replay code may change for the proof.

## Versioning, replay and old journey preservation

Set@7 keeps the current set@6 numerical item IDs and order exactly for its
first 13 positions, then appends the eight named items in table order. The
first eight workflows retain their exact legacy definitions and meanings.
Three Plan34 and two Plan18 compact items keep their numerical identities and
learner responsibilities but receive the explicit Plan35/v4 associations
shown above. Set@6 remains fully pinned with its old definitions and replay
meaning; v2/v3 historical membership is not broadened.

Do not repurpose current `phase-3-reusable-full-addition@1`, Plan 18
`phase-3-nested-renaming-addition@1`, or replay envelope versions. Existing
`fractionflow.episode-replay/v1` remains legacy definitions without task
context; v2 keeps its exact Plan 34 context and definition@1 meaning; v3 keeps
its exact Plan 18 context, set@6, target 8 and required side. Current replay
shape validation in `src/interaction/replay.js` hard-binds v2 to Plan34 and v3
to Plan18; those are intentional compatibility guards.

Propose one new envelope version v4 for the new definition. Reuse v2's exact
context keys for selected set identity/revision, item/fixture/authoring identity,
definition identity/revision, recipe identity/revision, task-data identity/
revision, target, required-side list, and inspect stimulus identity/revision and
candidate forms; v2 already carries those fields. Add exactly one context key,
`sourceForms`, pinning the two source forms in operand order. On reconstruction,
require it to equal both the existing `contentIdentity.sourceForms` and the
exact reconstructed fixture's initial forms. No union of undeclared fields or
latest fallback. V4 is justified because current v2 validation reserves its
existing exact context and `phase-3-reusable-full-addition@1` semantics for
Plan34's two patterns, two-side paths, and accepted v5/v6 associations; v3
reserves Plan18's separate one-side task and set@6. Reusing v2 by broadening
those restrictions would reinterpret accepted envelopes and definition meaning.
The new definition includes three recipes, one-side behavior, new exact
associations for the five reassociated prefix items and eight appended items,
set@7 and strict test-only membership; v4 explicitly binds its
source forms while preserving every old contract. V4 reconstructs
the exact selected fixture and task-data revision, recomputes task eligibility,
validates the exact set membership and form binding, then replays ordered
intents. It refuses incompatible recipe/item pairs, unregistered revisions,
forged required sides, candidate alterations, missing/extra fields, or data
outside the supported denominator/scale/result bounds.

Before any source edit, capture exact initial and completed examples of all
three old replay versions. Preserve the existing v1 fixture
`tests/fixtures/plan34-legacy-replay-oracle.json` and v2 fixture
`tests/fixtures/plan34-v2-replay-oracles.json` unchanged; Plan 18 currently has
v3 round-trip/tamper tests but no standalone frozen v3 oracle, so add a frozen
initial/completed artifact `tests/fixtures/plan18-v3-replay-oracles.json` from
the pre-edit source and verify it unchanged later. Capture the five old-to-new
Plan35/v4 prefix mappings in `tests/fixtures/plan35-prefix-semantic-oracles.json`:
compare exact schedule, target, candidate stimulus/forms, required side,
accepted operand forms/origins, operation result and completion navigation to
the old v2/v3 behavior. This is a semantic differential, not byte equality
between different envelope schemas.

Append eight reviewed new items to a new immutable practice-set revision
(proposed set@7), after the same first 13 numerical item IDs/order as set@6,
with the five explicit Plan35 task reassociations above; retain set@6 as the
historical 13-item value. Plan18 route coverage currently asserts exhaustion
at exactly 13 items. Once default grows,
those routes must become explicitly historical set@6 journeys and the new
production-default journey must separately prove set@7 completion and Next.
Do not relabel old exhaustion as current-default behavior. The existing
Plan18 route-map rows currently say `production-default-v6`; change them to an
explicit pinned historical context (for example `historical-plan18-set-v6`)
and construct that route against the exact v6 registry while keeping its route
IDs/actions/assertions. Add a separate `production-default-v7` context for the
new default. `scripts/dev/plan18-route-prefix.mjs` currently imports live
`PRACTICE_TYPES`, then requires
set@6/13; pin its historical item registry and associated Plan34 task data
consistently. Pinning only route metadata/HTML is insufficient because this
helper resolves current live state.

The Plan34 v2 resolver currently accepts selected sets 5/6 and membership of
the first-eleven records. It continues reconstructing archived v5/v6
associations only. Set@7 uses Plan35/v4 for its three compact prefix items,
preserving their numeric identities and learner semantics in the differential
map above; it similarly uses the equivalent identify-side recipe for the two
Plan18 compact items. This avoids adding set@7 to v2/v3 or changing their exact
historical meanings.
The exact historical v4 page fixture and every route's selector/action/assertion
must remain protected. Freeze current v1/v2/v3 initial and completed oracle
envelopes/states before any source edits, including the existing fixtures
`tests/fixtures/plan34-legacy-replay-oracle.json`,
`tests/fixtures/plan34-v2-replay-oracles.json`, and the explicitly proposed
Plan18 v3 oracle file.

## Proposed source/evidence ownership and staged checks

All paths below are proposals pending parent mechanism approval. Likely shared
content/admission paths: `src/content/data/plan35-addition-numerical-records.js`,
`src/content/data/plan35-addition-recipe-associations.js`,
`src/content/full-addition-task-patterns.js` or a new
`src/content/addition-task-recipes.js`, `src/content/nested-renaming-task.js`,
`src/content/data/plan18-nested-addition-records.js`,
`src/content/authored-task-data.js`, `src/content/index.js`, and exact set
membership in `src/content/data/plan18-nested-addition-records.js` or a small
new versioned set registry. Definition/schedule/state/replay paths:
`src/interaction/episode-definition.js`, `beat-schedule.js`, `episode.js`,
`classification.js`, `scene.js`, `provenance.js`, and `replay.js`; app
composition and shared copy/views: `src/app/practice-types.js`, `app.js`,
`src/render/strings.js`, `controls.js`, `beat-container.js`, and
`linear-path.js`, only where tracing confirms they need updates. Tests/routes:
focused content/context, schedule, reducer, replay/oracle and rendering tests,
including `tests/fixtures/plan18-v3-replay-oracles.json` and the semantic
baseline `tests/fixtures/plan35-prefix-semantic-oracles.json`;
`tests/routes/route-matrix.json`, `tests/routes/plan34-context-map.json`,
`tests/route-contract.test.js`, and a new Plan35 route-contract test. Pin the
existing Plan18 route-prefix helper and its exact registry/data input in
`scripts/dev/plan18-route-prefix.mjs` and add explicit historical route context
coverage. Store Plan35 receipts/screens/measurements and seeds only under this
packet folder.

1. **Before source:** parent reviews and approves the recipe/data/replay/route
   contract and resolves any load-bearing identity choice. Freeze old v1/v2/v3
   initial/completed oracles from the pre-edit source.
2. **Pure foundation checkpoint:** exact record binding, full admission and
   capability sweep for every registered item/recipe/target; immutable schedule
   construction; all whole-episode state completions; form origins/classification;
   task-local help; strict malformed/incompatible-context refusal; old replay
   oracles pass. Stop for parent checkpoint review.
3. **Data-only hold-out checkpoint:** append the two declared held-outs. Inspect
   the diff proving only records/associations/set membership changed, and prove
   generic admission/completion/replay discovers both without source branches.
   Stop for parent review.
4. **Mounted evidence:** a small risk-mapped Chrome sample reaches each distinct
   responsibility across targets, both views, registered support profiles,
   keyboard and touch-context actions, reduced motion, help/recovery/Replay/Retry,
   plus actual new-default exhaustion/return/re-entry. Separately traverse the
   pinned historical Plan18 13-item journey. Capture 360x740/752, actual
   Chromebook CSS viewport and enlarged-text/zoom where target wrapping changes;
   measure viewport intersection and ordinary vertical scrolling. Physical
   keyboard/touch and assistive-technology claims remain untested unless actually
   observed. Include a seeded incompatible recipe binding and answer leak, each
   failing at its intended assertion, plus separate clean receipts.
5. **Review and delivery:** focused checks, full suite/builds/routes, packet lint
   and diff check. Preserve accepted screenshots regenerated by shared routes;
   name validation evidence and residual uncertainty in the progress report.
   Parent remains responsible for independent review, status, acceptance and
   explicit-path Git actions. Owner rendered-screen/agency acceptance and
   deployment remain separate.

This work proposes reusable fixed recipes only. It adds no random/adaptive
selection, subtraction, crossing-one-whole behavior, new representation,
content-family expansion beyond reviewed proper additions, persistence, or
broader arithmetic.
