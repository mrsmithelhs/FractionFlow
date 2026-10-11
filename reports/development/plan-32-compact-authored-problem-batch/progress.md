# Plan 32 — Requirement 0 Proposal and Pre-source Report

Date: 2026-10-10. Status: Requirement 0 delivered to orchestration; waiting at the mechanism, instructional-policy, and batch-membership gate. No production source, tests, registry, learner content, packet status, or browser evidence was changed or generated.

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

## Advisor declaration

This delivery is a proposal/report only and has no behavioral code, script, or schema artifact for a read-only advisor to critique; advisor consultation was not warranted for this docs-only Requirement 0 delivery. If the gate authorizes behavioral source work, reassess the current thread/provider capability and consult on the implemented diff before source delivery as required by the inherited advisor rule.

## Evidence executed in this turn

- Packet preflight: `RUNNABLE: plan-32 is ready to implement`.
- Plan 30 read-only experiment verifier: `results.json verified unchanged`; aggregate counts and corruption controls reproduced.
- Separate read-only candidate probe using `inspectCandidateSpace()`, `buildCuratedProblem()`, and current path eligibility: 220 candidates, 18 eligible ordered rows, 9 swap classes; the seven proposed rows' paths, scale factors, and exact results were read from the built instances above.
- Source inspection of current app admission, validators, path closure, authored accessors, practice set, replay identity and reconstruction; no production tests or browser routes were run in Requirement 0.
- Existing evidence inspected for Plan 26 lifecycle/replay and Plan 31 focus outcome. Physical Chromebook, physical touch, assistive technology, and post-response focus retention remain unverified.
