# Plan 19 Requirement 0 — Shared-Factor Addition Mechanism Proposal

Date: 2026-10-11. This is a proposal and read-only investigation record. No source, test, route, registry, packet-status, or owner-disposition files were changed. Source work is not authorized until FF Orch 12+ records mechanism approval.

## Overall summary

Plan 19 is runnable (`node scripts/dev/plan-status.js check plan-19` returned `RUNNABLE: plan-19 is ready to implement`). The proposed learner increment is one tenth item, `1/6 + 1/4`, appended after the existing nine items in `unlike-addition-vetted-set` revision `3`. Keep the nine current items in their present order and preserve every existing fixture, recipe, task-data, episode-definition, and replay identity.

The existing exact math and content APIs support the requested canonical 12-unit and alternate 24-unit routes. Both are within the current fraction-bar capability. The recipe should be a versioned Plan 19 extension that reuses Plan 32's compact record/materializer/catalog pattern while keeping Plan 32 recipe `plan32-reviewed-addition@1` explicitly limited to relatively-prime addition.

## Current architecture inspected

- `src/content/authored-content-catalog.js` already resolves an exact `(fixtureId, authoringRevision)` with no “latest” fallback. Plan 32 materialized entries carry their pinned recipe and task-data revision. The premise and reflection accessors both resolve through that catalog, so the same record can serve app admission, path closure, scene lookups, and replay content reconstruction.
- `src/content/authored-problem-materializer.js` currently validates Plan 32 records only for `curated-review`, overlay-free `relatively-prime-addition`; it derives premise and reflection forms with exact math and checks all eligible paths. It must gain a separate recipe/selector admission for the new record while retaining the old recipe's exact selector and revision meaning. The shared rule-based materialization functions may be reused; no per-problem app or render branch is needed.
- `src/app/app.js` resolves fixture and task data per item in `canonicalInstance()`, obtains the item's registered definition for admission/path closure, and reconstructs through `registeredItemEpisode()` for entry, `Next`, and `Retry`. Today `registeredItemEpisode()` rejects an item definition that differs from the practice-wide definition, and `createInitialState()` always passes the practice-wide definition. The bounded proposal is to have each registered item resolve and pass its own exact definition through admission, episode creation, `Next`, and `Retry`; keep the practice-level definition as the existing fallback for injected instances.
- `src/interaction/episode.js` first verifies a supplied definition against `getEpisodeDefinition(id, revision)`, including full semantic equality, but its content-family guard is hard-coded to the current relatively-prime addition definition. Change the order narrowly: resolve/verify the registered definition first, then admit only content whose validated selector and operation equal that registered definition's selector and operation. Do not accept caller-provided selector/operation fields or weaken the registered semantic-equality check.
- `src/interaction/replay.js` records and resolves the exact episode-definition identity and exact curated fixture/revision. The new identities can use that existing reconstruction path; no replay schema or fallback is proposed. Validate a new-definition replay and frozen pre-existing replay oracles after approval.
- Existing denominator choice already distinguishes invalid math, valid-but-outside-representation, and valid-but-outside-authored-coverage. Plan 22 closure keeps a valid but unavailable path at `decide` with local recovery. Reuse that policy for this family and retain condition-specific matching/premise data checks.

## Proposed immutable identities and authored record

| Role | Proposed identity |
|---|---|
| Learner item | `one-sixth-plus-one-fourth` |
| Curated fixture | `curated-shared-factor-addition-one-sixth-one-fourth@plan19-record-v1` |
| Task data | `plan19-task-data-v1` |
| Materialization recipe | `plan19-reviewed-shared-factor-addition@1` |
| Registered episode definition | `phase-2-shared-factor-addition-reflection@3` |
| Practice set | `unlike-addition-vetted-set@3` |

The fixture request is `profileId: curated-review`, `selector: shared-factor-addition`, `overlays: []`, with left `1/6` and right `1/4`. Keep recipe identity distinct from authoring and task-data identities. Pin all three in the compact record and exact catalog; revisions never fall forward to newer content or materializer policy. The episode definition is a newly registered identity, operation `add`, selector `shared-factor-addition`, same approved beat sequence and reflection behavior as the existing revision-3 addition definition. It must not alter the semantics of `phase-2-unlike-proper-addition-reflection@3`.

The practice-set revision `3` preserves the current nine item objects and order exactly, then appends this item as position 10. The first item remains `two-thirds-plus-one-fourth`; exhaustion is after the new tenth item. Entry still starts with the existing small learner goal; the learner reaches later items only with completion-gated `Next`. Preserve current refusal announcement/focus behavior, return/re-entry, and retry reset behavior.

## Exact mathematical facts and response oracles

I ran a read-only Node probe using the repository's existing `createFraction`, `leastCommonDenominator`, `convertToDenominator`, `addAtCommonDenominator`, `equalFractions`, `validateCommonDenominator`, `evaluateProposedPathEligibility`, and episode classification APIs. It built a proposal-only `shared-factor-addition` instance; no fixture was registered or written.

| Target | Exact conversions | Exact operation result | Math/path oracle |
|---:|---|---|---|
| 12, least | `1/6 → 2/12`; `1/4 → 3/12` | `5/12` | denominator: `valid-common-denominator`; left conversion: `correct-equivalent-form`; operation: `correct-simplified`; path is canonical and representation-eligible |
| 24, alternate | `1/6 → 4/24`; `1/4 → 6/24` | `10/24` | denominator: `valid-common-denominator`; left conversion: `correct-equivalent-form`; operation: `correct-unsimplified`; path is an authored alternate and representation-eligible |
| 36, negative numeric proposal | `6/36`; `9/36` | `15/36` | mathematically valid but outside fraction-bar capability (denominator ceiling 30); denominator decision must use Plan 22 local recovery and must not establish an unsupported path |
| 18, negative numeric proposal | n/a | n/a | invalid common denominator (`18` is not divisible by `4`); ordinary invalid-math recovery |

For both eligible paths, a left conversion that changes only the denominator to `1/12` or `1/24` classifies as `denominator-changed-without-numerator`; a correct conversion is classified as `correct-equivalent-form`. Adding one to the exact common-unit numerator (`6/12` or `11/24`) classifies as `incorrect-numerator-arithmetic`. The alternate raw sum `10/24` remains the existing unsimplified result classification; keep the existing final-form interaction and do not introduce a new simplification lesson. Use the math/episode APIs again in tests for any expected final-form acceptance; do not hand-maintain response truth tables as a new source of mathematical truth.

## Complete premise and reflection policy proposal

Use the existing Plan 32 vocabulary and make every instructional choice explicit in the record. The premise source is always the authored left operand `1/6`; compute truth with `equalFractions()` and require the authored response to match it. The two paths deliberately retain both response outcomes.

| Target | Premise policy and displayed form | Expected premise response | Reflection options in display order | Correct slot |
|---:|---|---|---|---:|
| 12 | `P-ADJACENT-UNIT`, offset `+1`: `3/12` | No | `match-a` `1/12` (`R-KEEP-NUMERATOR`); `match-b` `2/12` (`R-CORRECT`); `match-c` `3/12` (`R-ADJACENT-UNIT`, offset `+1`) | 2 |
| 24 | `P-EQUIVALENT`: `4/24` | Yes | `match-a` `4/24` (`R-CORRECT`); `match-b` `1/24` (`R-KEEP-NUMERATOR`); `match-c` `5/24` (`R-ADJACENT-UNIT`, offset `+1`) | 1 |

The probe confirmed premise equivalence `false/true` respectively and exact choice equivalence `[false,true,false]` and `[true,false,false]`; each path has three distinct in-range forms and exactly one equivalent choice. Keep record-authored order and correct position; do not sort options or derive positions from hashes. Continue to validate safe form shape, target denominator, numerator range, uniqueness, exactly one correct reflection form, and the premise's fixture/source/target identity. Existing answer withholding, scene projection, and concise learner wording remain unchanged; no correctness flag or answer position should be exposed in learner-facing choice records.

## Catalog, definition, lifecycle, and compatibility mechanism

1. Add a separate compact record collection and recipe admission for `plan19-reviewed-shared-factor-addition@1`. Reuse Plan 32's exact math materialization for `P-EQUIVALENT`, `P-ADJACENT-UNIT`, `R-CORRECT`, `R-KEEP-NUMERATOR`, and `R-ADJACENT-UNIT`. Keep Plan 32 records and `plan32-reviewed-addition@1` unchanged and rejected for any non-relatively-prime selector.
2. Add the new materialized entry to the shared exact-version authored catalog. The catalog remains the sole exact resolver for fixture and task data; accessors, admission, path closure, and replay do not get copied per-family maps.
3. Register the new immutable shared-factor addition episode definition. Preserve the old definition identities and complete semantic checks. In episode construction, compare validated `instance.request.selector` and `.operation` against the already verified registered definition, rather than comparing against one global definition.
4. Resolve each practice item's exact definition when validating authored path closure and constructing its episode. Use that same item-definition route for `Next` and `Retry`; the existing lifecycle already rebuilds through one method. Return/re-entry starts at the set's first item as today. Replay reconstructs the exact fixture revision and registered definition from its envelope.
5. Maintain the Plan 32 set's prior revision identity and all nine current items. The new set revision `3` is the only set membership/order revision. Preserve the current practice entry label and controls; do not add a family button.

## Numeric boundaries and refusal policy

- `18`: invalid math; preserve invalid common-denominator recovery.
- `36`: mathematically valid but beyond the denominator ceiling; preserve Plan 22's `valid-but-unavailable-task-path` recovery at `decide`, with no established denominator, unsupported bar, conversion, or reflection.
- Eligible-but-unauthored coverage cannot be represented by a distinct numeric proposal for this complete fixture within the current 30-part capability: the only common multiples at or below 30 are 12 and 24, both of which this proposal authors. Cover that independent Plan 22 boundary with a failing-first fixture-bound negative control that retains the exact same math and eligible 24 path but removes its task-data record. It must refuse 24 as unavailable authored task coverage before advancing. Also test a wrong `selector` or wrong operation against the new registered definition and a forged definition object; each must be refused. This makes the category distinction observable without inventing another learner path or mislabeling 36.

## Exact proposed write paths after mechanism approval

Source, tests, and evidence paths are proposed only; none is authorized now.

- `src/content/data/shared-factor-addition-records.js` — new immutable per-item record.
- `src/content/authored-problem-materializer.js` — bounded recipe-specific extension reusing common rule/materialization helpers; retain the Plan 32 recipe's selector constraint.
- `src/content/authored-content-catalog.js` — register exact materialized identity with no fallback.
- `src/app/practice-types.js` — append one item, set revision `3`, preserve existing nine entries.
- `src/interaction/episode-definition.js` — register the new exact shared-factor definition identity.
- `src/interaction/episode.js` — bounded registered-definition selector/operation admission.
- `src/app/app.js` — pass the item's registered definition through admission, creation, Next, and Retry while preserving injected-instance fallback.
- `tests/plan19-shared-factor-addition.test.js` — exact record, boundaries, definition integrity, and per-item lifecycle/replay checks.
- `tests/route-contract.test.js` and `tests/routes/route-matrix.json` — preserve all existing assertions and add a completion-gated ninth-to-tenth item route.
- `scripts/dev/capture-plan-19-evidence.mjs` — mounted browser journeys and viewport evidence, if existing capture helpers cannot express the required route without weakening prior rows.
- `reports/development/plan-19-shared-factor-addition/progress.md` — this Requirement 0 proposal; update after any later approved work, committing it last.

If source inspection during the approved implementation shows additional required paths, stop and send the exact path plus reason for approval before editing it.

## Discriminating mounted evidence and negative controls after approval

- Prove the tenth item is learner-reachable by completing each of the preceding nine and advancing only with their mounted, completion-gated `Next`; verify the new item is selected, item order is intact, and the tenth item's completion hides `Next` and announces/focuses exhaustion as the established route requires.
- Exercise 12 and 24 through mounted visual and linear paths. Cover high and medium support, standard and reduced motion, keyboard-only decisions, non-drag touch actions, wrong denominator recovery, left/right conversion recovery, arithmetic recovery, authored premise/reflection outcomes, task-local denominator/conversion help, Replay with draft preservation, dirty Retry reset, return to entry, and re-entry. Include active Replay at the 24-part path.
- Capture at 360x740 and 1366x768; measure controls and 12/24-part bars, report horizontal overflow and vertical scrolling separately, and inspect the full mounted root for answer leaks across text, attributes, hidden siblings, and inactive regions. Preserve concise controls and task-local help.
- Retain pre-existing route rows and Plan 32's nine-item evidence. Check old fixture/task data and replay identity meaning against frozen oracles; verify an old relatively-prime definition does not admit this shared-factor item and the new registered definition does not admit relatively-prime content unless separately registered.
- Seed failure-first controls: change the 12 premise false fact to true; change the 24 premise true fact to false; replace a conversion numerator with a wrong scale; duplicate/corrupt a reflection form or correct position; remove the 24 task-data catalog entry; and tamper with registered definition semantics. Each witness must reject/refuse the corrupt state. Verify 36 remains blocked at `decide`, 18 stays ordinary invalid math, and 24 with missing fixture-bound task data is classified as valid math but unavailable authored work.
- Preserve the known numeric-response remount / `BODY` focus behavior as a limitation. Do not add a global focus rewrite or claim continuous focus. Capture reachable keyboard recovery and the existing focus behavior explicitly. Physical Chromebook, native touch/keyboard, assistive technology, browser zoom, and learner outcomes remain untested unless separately observed.

## Validation, consultation, and remaining gate

- Read `AGENTS.md`, the implementer prompt, Plan 19, the three required Plan 32 records, and the relevant set/definition/catalog/episode/app/math/closure/replay contracts.
- Ran `node scripts/dev/plan-status.js check plan-19`: runnable.
- Ran a read-only Node exact-math and response-classification probe; outputs are recorded above. No tests or browser routes were run for Requirement 0.
- Advisor consultation was not warranted for this docs-only mechanism proposal. Behavioral source work is not authorized; the named orchestrator gate is the review path. Any later behavioral implementation must reassess capability and the Sol-class low/medium/read-only restriction before delivery.
- No blocker to the proposal. The load-bearing next gate is FF Orch 12+'s explicit mechanism approval. Stop here until that approval is recorded; RUNNABLE alone does not authorize source edits.

