# Plan 32 — Progress and Delivery Report

Date: 2026-10-10. Plan status remains orchestration-owned (`in-progress`). Requirement 0 was approved in `mechanism-review.md`; the scoped Requirement 1-3 implementation and evidence below are delivered for orchestration review. No packet status change was made.

## Requirement 1-3 implementation delivery

The approved compact batch is registered as set revision 2: the two existing items remain first and unchanged, followed by the seven approved new mathematical items. New records pin their exact authoring, recipe, and task-data revisions. A shared deterministic materializer derives exact mathematical forms and outcomes while instructional premise/distractor policies remain explicit reviewed inputs. Exact catalog lookup is shared by admission, scene data, and replay; it has no latest-revision fallback. Admission and path closure now use the complete authored-data validator and the existing presentation bounds. Legacy premise and reflection rows were moved intact, and the existing replay identity reconstruction remains supported.

Revision note: the packet's statement that set revision 1 remains an immutable two-item record describes historical authoring state, not a runtime set registry. Runtime admission now selects set revision 2; replay envelopes identify the individual fixture and authoring revision, not set membership. The old items still reconstruct from their preserved fixture/task identities, but the app does not retain a resolver for old set revision 1. No replay envelope schema or historical item meaning was changed.

### Verified automated and browser evidence

- `npm test`: **29 files, 327 tests passed**. The Plan 32 test covers the exact approved item order, all 18 admitted item/path pairs, exact outcomes and safe choice constraints, rejection controls, materialization order stability, and whole-episode completion under all 4 registered conditions and both support profiles. It reconstructs replay for each path under the first condition/support profile (18 replay reconstructions). This is deterministic headless state-machine coverage, not a browser sweep of every combination.
- `npm run build`: learner and subtraction prototype builds both succeeded on the clean retry. The first attempt hit a transient `EPERM` creating ignored `dist/prototypes/subtraction`; closing the pre-existing preview process allowed the normal build to pass.
- Browser route matrix: **56/56 executions passed across 54 route rows**, with zero known defects. `ROUTE-PLAN32-NEXT-REACHES-NEW-BATCH` proves the actual Next interaction reaches the first new item. The other broad route rows chiefly exercise established shared transitions and legacy fixtures; they do not amount to browser completion of every compact item/path.
- The dedicated Playwright evidence capture completed all nine items and verified the exhaustion notice receives focus, Next is hidden, Back to start remains enabled, and re-entry begins at 2/3 + 1/4. It saved six mounted states at 360×740 and 1366×768: first new item, the 30-part 10/30 + 6/30 conversion, and exhaustion at each viewport. No horizontal overflow appeared. The 360px view had 64px vertical scroll on the first new item and 433px at the largest admitted path; screenshots are full-page captures and do not prove physical-device usability.
- `node scripts/dev/plan-status.js lint`, `node scripts/dev/plan-status.js check plan-32`, and `git diff --check` passed. The manifest contains 9 ordered items and 18 admitted paths.

### Browser sample boundaries and access findings

The new mounted compact-item screenshots use high support, visual mode, and standard motion. They establish actual Next reach, the largest admitted visual subdivision, exhaustion, focus on the exhaustion notice, and return/re-entry. They do **not** establish compact-item browser use for medium support, linear view, both premise responses, reduced motion, keyboard or touch gestures, or compact-item local help/recovery/Replay/dirty Retry. Existing route witnesses exercise many of those shared behaviors on the preserved fixtures; the Plan 32 headless sweep covers every new item/path across condition and support configurations. Keep that distinction explicit when deciding learner acceptance. No physical Chromebook or assistive-technology testing was performed.

The route run repeated the already documented Plan 31 observation that a linear response remount can leave focus on `BODY`; this delivery does not claim response-focus retention or include a global focus rewrite. The new exhaustion witness confirms the separate final-set notice focus. No new load-bearing access failure was exposed by the compact-item browser sample; it is bounded evidence, not a broad access validation.

### Advisor consultation disposition

One read-only Sol-class review of the implemented diff ran at the explicitly requested `gpt-6.1-sol`, medium-effort setting. The advisor did not independently verify its runtime model identifier (its self-report was only “GPT-6”); the requested configuration was Sol-class medium, and no Astra consultation was used. The advisor was bounded/read-only with no fan-out. The immediate post-consultation working-tree check showed only this task's existing edits; the primary remained the sole writer. Consultation effort was reported as approximately 10–15 minutes and 30 artifacts reviewed.

| Finding | Disposition |
|---|---|
| P2: browser exhaustion was missing | **Addressed.** The dedicated capture now finishes all nine items at both viewport sizes and asserts the focused notice, hidden Next, enabled return, and stable re-entry item. |
| P2: compact-item mounted coverage was narrow | **Partially addressed; residual accepted for orchestration review.** Actual Next reach, first new item, 30-part path, exhaustion and re-entry are mounted. The report above names unsupported compact-item browser combinations rather than claiming the legacy route suite proves them. |
| P2: automated completion coverage was happy-path oriented | **Partially addressed.** The all-item/path sweep completes each path across every registered condition/support profile, while current fail-first tests reject bad premise truth, duplicate IDs/forms, out-of-range forms, bad answer positions, wrong revisions, and missing routes. Shared recovery/help/reset interactions remain evidenced primarily by existing legacy browser witnesses, not per-item compact data. |
| P3: set revision 1 wording implied runtime history | **Clarified.** The revision note above distinguishes historical proposal/Git state from the runtime set registry and states what replay does and does not encode. |

This is technical implementation evidence, not owner acceptance of the rendered screens, learner agency, readiness, or deployment. Plan status and any follow-on scope remain with the orchestrator/owner.

## Requirement 0 proposal and pre-source record

Date: 2026-10-10. This section records the initial proposal, which preceded the mechanism, instructional-policy, and batch-membership gate. Source work began only after the recorded approval; this section remains historical evidence.

## Preflight and scope

`node scripts/dev/plan-status.js check plan-32` returned `RUNNABLE: plan-32 is ready to implement`. This is a preflight result, not mechanism approval. I read the agent guide and implementer prompt, the full packet, the Plan 30 investigation/results/owner disposition/delivery review, Plan 26 lifecycle and replay contracts, Plan 31 delivery/focus evidence, the current app/content/replay implementation, and the applicable orchestration architecture disposition.

The checkout already contains orchestration-owned edits in `docs/development/plan-32-compact-authored-problem-batch.md` and the generated plan index, showing `in-progress`; I left them untouched. The current status tool still reports RUNNABLE. Status remains orchestration-owned.

## Current route, set, and replay baseline

The learner-visible practice is `sum-under-one`, set `unlike-addition-vetted-set` revision `1`, definition `phase-2-unlike-proper-addition-reflection` revision `3`, with two fixed items:

| Existing item | Fixture revision | Eligible targets | Exact result |
|---|---|---|---|
| `two-thirds-plus-one-fourth` | `curated-relatively-prime-addition-non-least` / `plan03-fixtures-v1` | 12, 24 | 11/12 |
| `one-half-plus-one-third` | `curated-relatively-prime-addition-one-half-one-third` / `plan26-fixtures-v1` | 6, 12 | 5/6 |

Plan 30's checked baseline reconstructed both existing fixtures and all 16 condition/path closures (2 items × 2 paths × 4 conditions). The current app admission reconstructs a fixture, performs exact content validation, validates authored task data, then checks every target against each registered condition before installation. Plan 26 provides the learner-triggered Next, retry/reset, refusal/exhaustion, return/re-entry, and replay lifecycle. Existing code and tests must remain the oracle for those contracts.

Curated replay envelopes identify fixture ID and `authoringRevision`, plus episode-definition ID/revision, support, active condition, and learner intents. They do not include set identity or materialized task data. `reconstructCurated()` rebuilds the named historical fixture from `PHASE1_GOLDEN_CASES`. Therefore the two existing fixture IDs/revisions, mathematical instances, task data, and definition revision must remain reconstructable byte-for-byte in meaning. New compact records need immutable item/task/recipe revisions and a stable reconstruction route; a changed recipe or authored policy requires a new revision. If ordered set membership changes, use a new set revision. Do not change the replay envelope or reinterpret legacy envelopes as a shortcut.

## Compact record and shared materializer proposal

Use a small, explicit record table and one deterministic materializer in `src/content/`. A record should carry:

- stable item and fixture IDs, item/authoring revision, recipe ID/revision;
- selector, profile, overlays, and exact operand wire forms;
- each eligible target denominator and explicit reviewed instructional inputs for that route: premise intent/misconception ID, two reflection distractor-intent IDs, and an authored correct-choice slot or other explicitly approved position policy;
- stable route/choice identities derived only from item identity, revision, route, and reviewed slot/ID.

The shared materializer should call the existing curated builder, exact fraction conversion/equivalence/operation algorithms, and validators. It may derive source forms, converted equivalent forms, operation result, premise truth, eligibility, and stable mechanical IDs. It must not choose a misconception, invent a pedagogical distractor, decide which premise should be false, or use input order/hash to conceal answer-position policy. Renderers continue to receive validated forms and never compute truth.

A readable output example, with instructional fields intentionally left open for review: for `1/2 + 1/5`, exact math gives eligible routes 10 and 20, left-operand equivalents 5/10 and 10/20, and sum 7/10. At each route the authored data must select a reviewed premise treatment and two distinct reviewed distractor intents; exact validation determines whether a displayed premise is yes/no and that exactly one of three reflection forms is equivalent. The premise treatment, distractor IDs/forms, and correct slot are not supplied by the experiment and remain approval items.

Plan 30's hash-selected false premise, off-by-one premise form, nearest-numerator distractors, and hash-selected correct slot remain experimental. A proposed rule set can draw from named reviewed misconceptions only after the owner approves those labels and their use. At minimum, keep one true and one false premise outcome across each two-route item, reject repeated mathematical distractor forms even when IDs differ, and keep exactly one equivalent reflection answer. No static or generated answer key is passed into a renderer.

## Bounded candidate inventory and proposed batch

I reran `node reports/development/plan-30-compact-content-authoring-investigation/experiment.mjs --verify`; `results.json` verified unchanged. A separate read-only probe regenerated the candidate operands and eligible routes from `inspectCandidateSpace()` and current `evaluateInstanceEligibility()` using the Plan 30 bounds: relatively-prime proper addition, no overlays, `curated-review`, denominator ≤30, scale factor ≤12, and canonical LCD plus 2×LCD alternate.

The inventory is 220 exact/content-valid candidates, 18 ordered candidates with two eligible paths, and 9 swap-equivalent mathematical classes. The 18 are a bounded candidate pool, not an approved bank:

| Swap class | Ordered candidates | Targets |
|---|---|---|
| 1 | 1/2 + 1/3; 1/3 + 1/2 | 6, 12 |
| 2 | 1/2 + 1/5; 1/5 + 1/2 | 10, 20 |
| 3 | 1/2 + 2/5; 2/5 + 1/2 | 10, 20 |
| 4 | 1/3 + 1/4; 1/4 + 1/3 | 12, 24 |
| 5 | 2/3 + 1/4; 1/4 + 2/3 | 12, 24 |
| 6 | 1/3 + 1/5; 1/5 + 1/3 | 15, 30 |
| 7 | 2/3 + 1/5; 1/5 + 2/3 | 15, 30 |
| 8 | 1/3 + 2/5; 2/5 + 1/3 | 15, 30 |
| 9 | 3/5 + 1/3; 1/3 + 3/5 | 15, 30 |

A varied seven-item membership proposal for review (not activation) is:

| Proposed item | Targets | Scale factors at LCD → 2×LCD | Exact result |
|---|---|---|---|
| 1/2 + 1/5 | 10, 20 | 5×2 → 10×4 | 7/10 |
| 1/2 + 2/5 | 10, 20 | 5×2 → 10×4 | 9/10 |
| 1/3 + 1/4 | 12, 24 | 4×3 → 8×6 | 7/12 |
| 1/3 + 1/5 | 15, 30 | 5×3 → 10×6 | 8/15 |
| 1/3 + 2/5 | 15, 30 | 5×3 → 10×6 | 11/15 |
| 2/3 + 1/5 | 15, 30 | 3×5 → 6×10 | 13/15 |
| 3/5 + 1/3 | 15, 30 | 3×5 → 6×10 | 14/15 |

This set spans operand numerator values 1–3, denominator pairs (2,5), (3,4), and (3,5), both operand orders, and scale factors up to 10 without exceeding current bounds. The 1/2 pair varies one numerator while holding the denominator pair; the 3/5 + 1/3 row makes operand order an explicit part of the proposal. It contains the seven distinct mathematical classes not already present in the current set. Both existing classes (`1/2 + 1/3` and `2/3 + 1/4`) are excluded as already registered. The swapped rows are reported in the inventory but excluded from this batch so operand reversals are not silently counted as additional distinct sums. These exclusions are provisional; membership belongs to the owner/orchestrator gate.

Plan 30 verified the aggregate counts: 342/440 paths are refused by current representation limits; 202/220 candidates have fewer than two eligible routes; 18 ordered rows / 9 swap classes meet the two-path requirement. The recipe component checks passed on 36/36 routes, but no experimental candidate was admitted, mounted, or fully completed. The verifier and probe do not constitute instructional review.

## Current admission gaps and narrow proposal

- `validateAuthoredMatchingChoices()` currently requires three choices and exactly one equivalent answer, but does not reject repeated non-equivalent forms under distinct IDs (Plan 30's negative control confirms the acceptance). It also needs the approved form-range/unique-form checks preserved.
- `evaluateTaskPathClosure()` still accepts `choices.length >= 2`; actual app admission currently runs the stricter authored validator first, so this is a latent contract mismatch rather than evidence that current registered items mount with two choices. Align closure with the exact same bounded authored-data checks that define presentable choices and premise completeness; do not create a parallel schema engine.
- `premise-checks.js` and `reflection-choices.js` duplicate fixture-to-authoring-revision maps. A single shared record lookup can remove this duplication if it is needed by the selected record storage. Retain old revision mappings and route data.
- The app resolves only fixtures in `PHASE1_GOLDEN_CASES`; the replay reconstructor does too. New data must be discoverable through both paths while the two old identities continue reconstructing unchanged.

## Coverage proposal after approval

Headless checks should inventory every admitted item/path and prove exact content validity, all eligible-unit coverage, both premise outcomes, unique presentation forms and exactly one equivalent choice. Complete the whole episode for every item/path under each applicable registered condition and both support profiles, including wrong-response recovery, concise help, matching reflection, resolve, retry/reset, replay reconstruction, return/re-entry, Next reach and final exhaustion. Include fail-first controls for wrong premise truth, duplicate item/route/choice IDs, duplicate mathematical distractors, multiple correct answers, missing path data, insufficient/out-of-range choices, and unsupported route admission. Reorder input enumeration and prove the semantic item/task output and identities are unchanged. Keep the old two replay envelopes as historical equality oracles.

Browser samples should be selected by risk rather than one copy of the same route per item: the 15/30 route at scale 10 for largest admitted unit/geometry; an operand-order sample; both premise outcomes; visual and linear presentations; high and medium support; normal and reduced motion; keyboard and browser touch-context use without dragging; real learner Next into new items; correct exhaustion; help/recovery, Replay, dirty Retry, reset and re-entry. Save screenshots and measurements at the packet's 360px reference and Chromebook-size viewport and report vertical scrolling and physical-device/AT limits. Existing Plan 31 notation-independent answer leakage and new-boundary motion witnesses remain regression guards.

A known access issue must stay visible: Plan 31 recorded that an incorrect linear response remount leaves active focus on `BODY`; it did not establish response focus retention. Plan 32 should capture/report the actual focus outcome when sampled. Do not claim retention or expand this into a global focus rewrite. If it blocks usable response/recovery for the proposed reach, return to the gate with that evidence and a bounded proposed resolution.

## Exact proposed write paths — approval required

No source path is authorized by this report. The proposed scope for gate review is:

- `src/content/data/compact-addition-records.js` (new): compact records and reviewed policy identifiers;
- `src/content/authored-problem-materializer.js` (new): one deterministic, versioned materializer;
- `src/content/authored-task-data.js`, `src/content/data/premise-checks.js`, `src/content/data/reflection-choices.js`, and `src/interaction/path-closure.js`: reuse one revision lookup and align admission/closure with presentation capability;
- `src/app/practice-types.js`, `src/app/app.js`, and, only if needed to reconstruct new identities without changing old envelopes, `src/interaction/replay.js`: fixed approved batch registration and reach;
- focused tests in existing tests or one new `tests/plan32-compact-authored-problem-batch.test.js`; evidence manifest/capture under `reports/development/plan-32-compact-authored-problem-batch/`.

Potential new records/materializer tests need to demonstrate every admitted item/path and full episode completion. Existing two fixture/revision records and replay meanings remain intact. No per-item app or renderer branches, random selection, new family, capacity expansion, dependency, framework, or renderer truth is proposed.

## Gate items / blockers

Source implementation is blocked pending explicit owner/orchestrator approval of: (1) the record/materializer and bounded admission/closure alignment; (2) premise and reflection instructional policy, including false-premise selection, distractor rationale/forms, and answer-position policy; and (3) proposed seven-item batch membership/exclusions and immutable set/replay versioning. The known `BODY` focus result should be reviewed against actual sampled behavior before any decision about a focus repair. No source changes have been made.

## Requirement 0 addendum — concrete policy and identity proposal

This is a concrete recommendation for owner review, not an adopted instructional policy, source authorization, or learner bank. The seven new items below and their per-route policies are suggestions. They have not been reviewed with learners or validated as effective instruction.

### Candidate named rules

**Premise rules:**

- `P-EQUIVALENT`: display the exact left-operand conversion to the selected denominator. `equalFractions()` determines the expected “yes” response.
- `P-ADJACENT-UNIT`: display the exact converted numerator minus one or plus one over the selected denominator. The signed offset is explicit per item/path. `equalFractions()` determines the expected “no” response. This is a near-miss check, not a claim about a measured learner misconception.

The proposed incorrect route uses `P-ADJACENT-UNIT`; its sign is chosen opposite to the reflection adjacent distractor for that route, so the same near-miss form does not appear again as a reflection option. Each item gets one exact premise and one false premise. False premises occur at the least denominator on four items and the alternate denominator on three; the fixed sequence is least, alternate, alternate, least, alternate, least, least. Thus neither path type makes “yes” or “no” universal. The 4/3 split is the closest balance possible across seven items; it remains a fixed authored distribution, not a probability or random policy.

**Reflection rules:**

- `R-CORRECT`: exact conversion of the left operand to the target denominator.
- `R-KEEP-NUMERATOR`: keep its original numerator while using the target denominator.
- `R-ADJACENT-UNIT`: exact converted numerator minus one or plus one, with the sign explicitly authored per item/path.

Each proposed path materializes exactly three options, all with the same denominator, pairwise distinct forms within the safe range, and exactly one exact equivalent answer. The current generic `validateAuthoredMatchingChoices()` contract is **at least three** options; this proposal leaves that general contract intact and makes **exactly three** the Plan 32 record/materialization policy. It does not add a correctness flag to rendered options.

These near-miss and keep-numerator choices are review hypotheses. They may make the reflection task too easy, overly numeric, or repetitive; the set has no learner evidence to show otherwise. In particular, one-off errors are not asserted as common for this age group. The owner may reject these named rules or require different evidence before source work.

### Exact ordered nine-item set and revisions

The proposed set keeps the existing two entries first and unchanged, then adds one orientation of each of the seven other distinct eligible mathematical classes. Operand reversals remain in the inventory but are not additional sums in this set.

| Order | Item ID | Fixture ID | Authoring revision | Task data revision | Inputs / targets |
|---:|---|---|---|---|---|
| 1 | `two-thirds-plus-one-fourth` | `curated-relatively-prime-addition-non-least` | `plan03-fixtures-v1` (preserve) | legacy authored rows (preserve) | 2/3 + 1/4; 12, 24 |
| 2 | `one-half-plus-one-third` | `curated-relatively-prime-addition-one-half-one-third` | `plan26-fixtures-v1` (preserve) | legacy authored rows (preserve) | 1/2 + 1/3; 6, 12 |
| 3 | `one-half-plus-one-fifth` | `curated-relatively-prime-addition-one-half-one-fifth` | `plan32-record-v1` | `plan32-task-data-v1` | 1/2 + 1/5; 10, 20 |
| 4 | `one-half-plus-two-fifths` | `curated-relatively-prime-addition-one-half-two-fifths` | `plan32-record-v1` | `plan32-task-data-v1` | 1/2 + 2/5; 10, 20 |
| 5 | `one-third-plus-one-fourth` | `curated-relatively-prime-addition-one-third-one-fourth` | `plan32-record-v1` | `plan32-task-data-v1` | 1/3 + 1/4; 12, 24 |
| 6 | `one-third-plus-one-fifth` | `curated-relatively-prime-addition-one-third-one-fifth` | `plan32-record-v1` | `plan32-task-data-v1` | 1/3 + 1/5; 15, 30 |
| 7 | `one-third-plus-two-fifths` | `curated-relatively-prime-addition-one-third-two-fifths` | `plan32-record-v1` | `plan32-task-data-v1` | 1/3 + 2/5; 15, 30 |
| 8 | `two-thirds-plus-one-fifth` | `curated-relatively-prime-addition-two-thirds-one-fifth` | `plan32-record-v1` | `plan32-task-data-v1` | 2/3 + 1/5; 15, 30 |
| 9 | `three-fifths-plus-one-third` | `curated-relatively-prime-addition-three-fifths-one-third` | `plan32-record-v1` | `plan32-task-data-v1` | 3/5 + 1/3; 15, 30 |

Proposed set identity is `unlike-addition-vetted-set` revision `2`; revision `1` remains the immutable two-item set record. The episode definition stays `phase-2-unlike-proper-addition-reflection` revision `3`. The new records use recipe ID `plan32-reviewed-addition` revision `1`. Every `(fixtureId, authoringRevision)` must resolve permanently to that exact immutable input record, recipe revision, and task-data revision; the resolver must never substitute the latest recipe. Any changed instructional input or materialization policy gets a new item/authoring and task-data revision; any recipe implementation change gets a new recipe revision; any set membership or order change gets a new set revision. The seven new records must be explicitly resolvable by both app admission and curated replay reconstruction. Keep both existing fixture/revision pairs and all their materialized premise and reflection forms byte-for-byte in meaning.

### Complete proposed new-item/path assignments

The forms below were generated read-only from the current candidate builder and exact math layer (`convertToDenominator()` and `equalFractions()`). `E` is `P-EQUIVALENT`; `A−`/`A+` is `P-ADJACENT-UNIT`; `K` is `R-KEEP-NUMERATOR`; `C` is `R-CORRECT`; and `R−`/`R+` is `R-ADJACENT-UNIT`. Option order is left to right, slots are one-based. No row is numerically sorted. The expected premise response is the exact equivalence result, not an authored truth flag.

| Item | Target | Premise policy, displayed form → expected response | Reflection options in displayed order (intent: form) | Correct slot |
|---|---:|---|---|---:|
| 1/2 + 1/5 | 10 (least) | A−: 4/10 → no | K: 1/10; R+: 6/10; C: 5/10 | 3 |
| 1/2 + 1/5 | 20 (alternate) | E: 10/20 → yes | R−: 9/20; C: 10/20; K: 1/20 | 2 |
| 1/2 + 2/5 | 10 (least) | E: 5/10 → yes | C: 5/10; K: 1/10; R−: 4/10 | 1 |
| 1/2 + 2/5 | 20 (alternate) | A−: 9/20 → no | C: 10/20; R+: 11/20; K: 1/20 | 1 |
| 1/3 + 1/4 | 12 (least) | E: 4/12 → yes | R−: 3/12; C: 4/12; K: 1/12 | 2 |
| 1/3 + 1/4 | 24 (alternate) | A+: 9/24 → no | C: 8/24; K: 1/24; R−: 7/24 | 1 |
| 1/3 + 1/5 | 15 (least) | A+: 6/15 → no | K: 1/15; C: 5/15; R−: 4/15 | 2 |
| 1/3 + 1/5 | 30 (alternate) | E: 10/30 → yes | K: 1/30; R+: 11/30; C: 10/30 | 3 |
| 1/3 + 2/5 | 15 (least) | E: 5/15 → yes | C: 5/15; K: 1/15; R+: 6/15 | 1 |
| 1/3 + 2/5 | 30 (alternate) | A+: 11/30 → no | K: 1/30; C: 10/30; R−: 9/30 | 2 |
| 2/3 + 1/5 | 15 (least) | A+: 11/15 → no | R−: 9/15; C: 10/15; K: 2/15 | 2 |
| 2/3 + 1/5 | 30 (alternate) | E: 20/30 → yes | K: 2/30; R+: 21/30; C: 20/30 | 3 |
| 3/5 + 1/3 | 15 (least) | A−: 8/15 → no | C: 9/15; K: 3/15; R+: 10/15 | 1 |
| 3/5 + 1/3 | 30 (alternate) | E: 18/30 → yes | R−: 17/30; K: 3/30; C: 18/30 | 3 |

The least-unit routes contain four “no” and three “yes” premise forms; alternate-unit routes contain three “no” and four “yes”. Correct reflection positions occur in slots 1/2/3 on 5/5/4 paths, respectively. The path assignment and option order are fixed data, not generated from hashes, candidate enumeration, numerical sorting, or learner performance. The checked candidate-level exact results are listed in the set table above. The exact outcome/control probe confirmed all 14 targets are currently eligible, all premise outcomes match `equalFractions()`, and each reflection row has three distinct safe forms with a non-monotonic numerator order. This is authoring-example verification only; it does not verify authored validator admission or learner presentation.

For preservation, the current two items keep their present authored outputs and choice order, rather than being rematerialized under these proposed rules:

| Existing item / target | Existing premise | Existing reflection choices; correct slot |
|---|---|---|
| 2/3 + 1/4, 12 | 7/12; no | 8/12, 7/12, 9/12; slot 2 |
| 2/3 + 1/4, 24 | 16/24; yes | 15/24, 16/24, 17/24; slot 2 |
| 1/2 + 1/3, 6 | 2/6; no | 2/6, 3/6, 4/6; slot 2 |
| 1/2 + 1/3, 12 | 6/12; yes | 5/12, 6/12, 7/12; slot 2 |

### Narrow data flow and admission alignment

Proposed dependency direction, with no implementation authorized:

```text
immutable compact record literals ──> pure versioned materializer ──> shared authored-content catalog/resolver
legacy fixture and raw premise/choice tables ─────────────────────────> shared authored-content catalog/resolver
shared resolver ──> authored validator / path closure / scene lookup / app admission / replay reconstruction
exact math and existing content builder ──> materializer and validators
```

Keep the compact record module data-only. The materializer may import that data plus the exact math/schema/content builder, but must not import the authored accessors or validator. One catalog resolver owns exact `(fixtureId, authoringRevision)` discovery and returns the fixture plus route task data; it may import legacy raw tables and materialized new records but must not import app, replay, scene, closure, or validators. Validators, path closure, scene, app, and replay consume the resolver; none is imported back into it. This gives app admission and historical replay the same exact identity lookup while avoiding a materializer↔accessor/validator cycle and duplicated revision maps.

The existing validator requires **at least three** matching choices, not exactly three. The proposed Plan 32 materializer emits exactly three; the batch-specific check should enforce exactly three and all three distinct forms, while the generic validator can retain its existing minimum-three contract. Before mount, premise validation should also require a fraction wire form with safe integer numerator/denominator, denominator equal to the path target, and `0 ≤ numerator ≤ denominator`. Current premise validation verifies identity, source, denominator field and exact truth, but does not apply the matching renderer's safe-form/range guard; a false improper premise could pass truth validation and then fail presentation. Path closure should use the same complete authored-data admission result rather than its current weaker two-choice presence check. These are bounded consistency checks; they do not justify a schema framework.

### Help closure for the proposed targets

Read-only inspection found no additional numeric help ceiling for 10, 12, 15, 20, 24, or 30. Denominator-finding help uses the source denominators dynamically; selected-unit wording names 12/24 and falls back to readable “N equal parts” wording for the other targets. Conversion help derives its source denominator and target from the active schedule; `classifyTransformHelpMultiplier()` compares the response with exact `scaleFactorForDenominator()` output. Proposed scale factors top out at 10, within the current eligibility limit of 12, and denominators top out at the fraction-bar limit of 30. This is source inspection only, not evidence that help routes work on every new mounted item. After approval, exercise finding help, selected-unit help, and task-local conversion help on representative 10/20 and 15/30 routes, including the 30-part visual/linear displays, and retain full item/path closure.

### Revised gate

This addendum supplies a recommended but unapproved rule set, path-by-path outputs, answer slots, complete ordered set, version mapping, import direction, and help review. Source remains blocked until the owner/orchestrator explicitly approves or amends the named premise and distractor rules, all 14 new path assignments and option positions, the exact nine-item order and revisions, and the bounded resolver/admission changes. No source, tests, registry, app selection, packet status, or learner content was changed by this addendum.

## Requirement 0 advisor declaration

This delivery is a proposal/report only and has no behavioral code, script, or schema artifact for a read-only advisor to critique; advisor consultation was not warranted for this docs-only Requirement 0 delivery. If the gate authorizes behavioral source work, reassess the current thread/provider capability and consult on the implemented diff before source delivery as required by the inherited advisor rule.

## Evidence executed in this turn

- Packet preflight: `RUNNABLE: plan-32 is ready to implement`.
- Plan 30 read-only experiment verifier: `results.json verified unchanged`; aggregate counts and corruption controls reproduced.
- Separate read-only candidate probe using `inspectCandidateSpace()`, `buildCuratedProblem()`, and current path eligibility: 220 candidates, 18 eligible ordered rows, 9 swap classes; the seven proposed rows' paths, scale factors, and exact results were read from the built instances above.
- Source inspection of current app admission, validators, path closure, authored accessors, practice set, replay identity and reconstruction; no production tests or browser routes were run in Requirement 0.
- Existing evidence inspected for Plan 26 lifecycle/replay and Plan 31 focus outcome. Physical Chromebook, physical touch, assistive technology, and post-response focus retention remain unverified.
