# Plan 17 Requirement 0 — Mechanism proposal

Date: 2026-10-11. Status: proposed; source work is not authorized until FF Orch 12+ approves this mechanism.

## Preflight and observed baseline

- `node scripts/dev/plan-status.js check plan-17` returned `RUNNABLE: plan-17 is ready to implement`.
- The working tree was clean at `b27e69c` before this proposal.
- The live `PRACTICE_TYPES` source has one learner goal, `sum-under-one`, with label “Add fractions with different denominators”, set `unlike-addition-vetted-set@3`, and ten ordered item identities. The ten are `two-thirds-plus-one-fourth`, `one-half-plus-one-third`, `one-half-plus-one-fifth`, `one-half-plus-two-fifths`, `one-third-plus-one-fourth`, `one-third-plus-one-fifth`, `one-third-plus-two-fifths`, `two-thirds-plus-one-fifth`, `three-fifths-plus-one-third`, and `one-sixth-plus-one-fourth`. Existing item fixture, authoring, task-data, episode-definition, and denominator identities remain as currently registered in `src/app/practice-types.js` and the content catalog.
- The committed Plan 32 `legacy-baseline.json` predates Plan 32/19 and records the two-item revision-1 set; the Plan 32 `batch-manifest.json` records nine items at revision 2. Neither is the current baseline. The live practice-type registry is the current ten-item/revision-3 source of truth.
- `tests/routes/route-matrix.json` contains 54 route rows (199,044 bytes; SHA-256 `2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd`). Existing rows and assertions will be preserved; Plan 17 routes will be appended as separately identified rows.

## Current construction admission versus rendering capability

I constructed `2/3 + 3/4` using `buildCuratedProblem()` with selector `relatively-prime-addition`, overlay `crosses-one-whole`, profile `curated-review`, and `reviewedTransitions: []`. `validateProblemInstance()` returned valid. Its exact-content classification is `crossesWhole: true`, raw and exact result `17/12`, canonical denominator `12`, authored alternate `24`, and existing `representationFacts.wholeSpan` is `{ lowerWhole: "1", upperWhole: "2" }`. `evaluateInstanceEligibility()` reports denominator 12 and alternate 24 as eligible under the existing denominator 30 / scale-factor 12 bounds. The exact math APIs report the respective renamings `8/12 + 9/12` and `16/24 + 18/24`; `improperToMixed(createFraction(17, 12))` and the same API on `34/24` report `1 + 5/12` and `1 + 10/24`.

`createEpisode()` also currently constructs that content with the registered `phase-2-unlike-proper-addition-reflection@3` definition and the usual encounter → notice → decide → two transforms → operate → resolve → reflect schedule. This establishes construction admission under the existing selector/operation checks; it does not establish an approved crossing-specific definition or renderer capability. The current fraction-bar renderer explicitly rejects `numerator > denominator`, so the problem is admitted upstream while the one-whole bar renderer cannot truthfully display its result. Plan 17 must add a separate stack capability and must not remove that renderer guard or retrofit historical definition meaning.

## Proposed identity, selection, and authoring

Append one crossing fixture to the existing “Add fractions with different denominators” learner goal and its completion-gated Next route. Do not add a learner-facing family button. Preserve the existing ten item objects/order and advance the practice set to `unlike-addition-vetted-set@4`.

Proposed immutable identities:

- item: `two-thirds-plus-three-fourths`
- fixture: `curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths@plan17-record-v1`
- task data: `plan17-task-data-v1`
- recipe: `plan17-reviewed-crossing-addition@1`
- episode definition: `phase-3-crossing-one-whole-addition-reflection@1`
- selector/overlay: `relatively-prime-addition` / `crosses-one-whole`
- registered targets: canonical 12 and authored alternate 24 only

The new definition gets its own exact registered identity and explicit crossing/result-stack semantics. Its additional immutable content contract is exactly selector `relatively-prime-addition`, operation `add`, overlay `crosses-one-whole`, `crossesWhole: true`, fixture ID and authoring revision above, and `includeReflection: true`. Preserve every existing definition ID, revision, wire field, accepted constructor value, replay interpretation, and content admission meaning. Do not silently broaden the new definition to other fixtures, selectors, operations, overlays, or result classes. Resolve the definition by exact ID/revision before checking instance compatibility, following Plan 19’s per-item registered-definition lifecycle through initial creation, Next, Retry, and replay.

Use compact, immutable per-item authoring records and the Plan 32 materialization/catalog pattern, with a recipe-specific admission branch. Do not copy arithmetic into the new record or alter the Plan 19/32 recipes. Record these exact policies for each target:

| Target | Premise policy | Reflection rule order | Adjacent offset | Correct position |
|---:|---|---|---:|---:|
| 12 | `P-ADJACENT-UNIT`, offset `-1` → `7/12`, expected “no” | `R-CORRECT`, `R-KEEP-NUMERATOR`, `R-ADJACENT-UNIT` | `+1` | 1 |
| 24 | `P-EQUIVALENT` → `16/24`, expected “yes” | `R-KEEP-NUMERATOR`, `R-ADJACENT-UNIT`, `R-CORRECT` | `-1` | 3 |

Thus the 12 reflection forms are `8/12`, `2/12`, `9/12`; the 24 forms are `2/24`, `15/24`, `16/24`. Exact forms and truth are materialized and checked by the existing exact-math APIs. The unchanged left operand permits reusing its verified premise/reflection facts only where the actual forms and policies match. The changed right operand, right-side conversions (`9/12`, `18/24`), full equation, crossing result, and all path closure facts must be independently regenerated and checked, not inherited from canonical `2/3 + 1/4` task data.

## Upstream stack semantics and capability

Content and exact math remain authoritative. The interaction projection supplies a validated, JSON-safe stack model; renderers receive quantities and never calculate quotient, remainder, `crossesWhole`, path validity, or correctness. Reuse validated `representationFacts.wholeSpan` for the two-whole span. Use the existing exact arithmetic API `improperToMixed()` (and exact fraction constructors/conversions) upstream to supply the accepted path’s whole-row count, remainder count, and unit denominator. Do not derive these from pixel geometry or create a second renderer math rule.

Proposed projected shape, added under `scene.meaning.operation`:

```js
resultStack: null // before correct total acceptance, including after any wrong answer
// after correct acceptance:
resultStack: {
  kind: 'discrete-multi-whole',
  displayForm: { kind: 'fraction', numerator: '17', denominator: '12' },
  wholeSpan: { lowerWhole: '1', upperWhole: '2' }, // validated content fact
  wholeCount: '2',
  unitDenominator: '12',
  rows: [
    { id: 'whole-1', shadedUnits: '12', unitCount: '12' },
    { id: 'whole-2', shadedUnits: '5', unitCount: '12' },
  ],
}
```

The 24-path projection substitutes display form `34/24`, unit denominator `24`, and rows `24/24` then `10/24`. All numerator, denominator, count, span, and row fields on the scene wire are decimal strings, matching the current fraction wire schema; the discriminant and stable row IDs are strings. `resultStack` is explicitly `null` until `state.established.operation` contains the accepted correct response. Its validator rejects malformed wire fractions, absent/mismatched `wholeSpan`, a row count or unit count inconsistent with the exact upstream decomposition, non-identical row unit widths, a wrong raw-result/path denominator, or any out-of-capability quantity. It checks that row counts reconstruct the accepted exact fraction using existing exact math; the renderer only maps supplied rows and counts to equal-width whole bars and shaded segments.

The projection is derived solely from the accepted established operation plus exact content/path facts; it is regenerated canonically by `projectScene()` and covered by `assertSceneCurrent()`. Add the `operation.resultStack` key only for the new crossing definition; preserve the existing scene schema version and the exact projected JSON of every historical definition/route. Historical scenes keep their present field set and no result-stack DOM behavior. Currency derives from the existing canonical source context, including accepted operation state and episode-definition identity; mutation or stale scene use continues to fail `SCENE_INTEGRITY`/`STALE_SCENE` checks. The independent scene stack validator runs upstream of renderer mounting. Construction/path capability must reject unsupported rows or units before the episode advances into a state the renderer cannot represent.

For the approved fixture, the validated result models are:

| Path | Learner result form | Whole rows | Row unit count | Shading |
|---|---:|---:|---:|---:|
| 12 | `17/12` | 2 | 12 per row | 12/12, then 5/12 |
| 24 | `34/24` | 2 | 24 per row | 24/24, then 10/24 |

Each row has the same whole width and every segment is the same width across both rows. Preserve the path denominator in the raw improper form; do not simplify or replace it with mixed-number notation. The bounded multi-whole renderer capability is exactly this admitted construction: two positive rows maximum, common unit denominator 12 or 24, each operand within its validated single-whole denominator capability, and only authored/closed result paths. Unsupported whole counts, denominators, malformed quantities, and unclosed content fail upstream with typed reasons. Never clamp the fill, shrink the second whole, truncate a row, or make a narrow unit look smaller. `36` is mathematically a common denominator but exceeds the current representation ceiling; it is not an authoring path. Preserve separate outcomes for invalid mathematics, valid-but-outside renderer capability, and valid/renderable but missing authored task coverage.

The learner supplies a numeric total, so there is no multiple-choice distractor set for the total. The registered reflection distractors are the only choices: constrain them to the authored 12/24 path, at least three distinct forms, exactly one equivalent answer, safe fractions within one whole, and an authored correct position validated by exact math. Do not leak correctness metadata to a renderer.

## Answer withholding, timing, and layout

At operate, both converted addends remain mounted and available in visual and linear views. The projected result-stack field, result readout, total, mixed equivalent, and result-derived completed-step text remain absent/null until the exact correct total is accepted. A wrong response changes recovery feedback only and retains the addends. The mounted-root guard must inspect both visual and linear siblings, inactive/hidden descendants, labels, names, summaries, and live regions before and after wrong responses; a result-leak seed must fail that same guard before restoration passes.

Use a single primary quantity region with one active representation at a time. The mounting rules are:

| State | Mounted primary quantity | Answer/control and return behavior |
|---|---|---|
| Operate before submission | The two converted addend bars / equivalent linear expression; `resultStack: null` | Numeric total input. No combined result data or result readout in either mounted sibling. |
| Wrong total | Same two addends / expression; still `resultStack: null` | Existing local arithmetic recovery. Input is cleared/recovered by current behavior; no stack or result summary mounts. |
| Correct total accepted; resolve | Replace both addends with the validated two-row result stack and concise completed-step text | Existing resolve continuation. The accepted path denominator and raw improper form remain pinned. |
| Reflection matching | Keep the result stack as the primary quantity; do not remount either addend bar | Existing authored matching choices; no extra whole bars. |
| Reflection premise | Swap the result stack out of the primary region and mount the existing two-bar source/new-parts premise comparison (maximum two bars) | Existing yes/no premise controls and authored forms. After successful reflection, return to the accepted result stack in the resolved state. The linear view uses the same source/new-parts forms in its current compact comparison. |
| Active conversion Replay / Inspection Mode | Temporarily replace the current primary region with the selected conversion’s existing before/after endpoints, under the same width and unit geometry; never mount the answer stack before acceptance | Conversion Replay uses only the last accepted conversion endpoints from `scene.meaning.transition`. “Show new parts” dismisses the transform/operate replay and restores that beat’s normal view. During reflection, Replay is Inspection Mode: it replaces the matching or premise content with those same last-conversion endpoints; “Done Looking” restores the exact reflection variant (including whether it was matching or premise). Preserve common-denominator and conversion drafts across visual/linear view changes, existing conversion animation timing, and focus restoration after both visual and linear Inspection Mode dismissal to the first matching choice or premise response control. Retain the existing view-toggle focus and draft restoration paths; do not add forced focus in keyboard route evidence. |

In all rows, an inactive view does not contain a duplicate result stack or result text. The visual and linear renderers switch the same upstream-selected presentation state; they do not infer answer timing. This new-definition-specific presentation leaves historical task reflection unchanged and prevents two addends plus a two-row stack from ever appearing together.

Keep learner copy short. Use existing question and recovery patterns, remove any redundant row-count wording, and do not add explanatory paragraphs to compensate for the new representation.

## Premise/reflection coverage and failure behavior

Admission requires exact fixture validation, exact 12/24 eligibility, authored task-data validation, and `evaluateTaskPathClosure()` success for every registered condition, both support profiles, and both paths. Update the current `handleDecide()` closure gate to key on exact registered definition identity (or its explicit capability field), not merely the current list of definition revision strings, so this new revision-1 definition receives the same pre-advance coverage check as existing reflection definitions. The 12/24 results alone do not establish this closure. Test missing authored records as unavailable-task-path recovery; test a valid common denominator with no authored task or with representation overflow as the correct typed boundary; test an invalid common denominator separately. No route may proceed to an absent premise/reflection task or render unsupported content. These are runtime/report boundaries, not evidence for general generated crossing practice.

## Exact proposed write scope

Subject to the orchestrator’s approval, source ownership is limited to:

- `src/content/data/crossing-addition-records.js` — reviewed compact Plan 17 record.
- `src/content/authored-problem-materializer.js` — explicit Plan 17 recipe admission/materialization using existing exact math.
- `src/content/authored-content-catalog.js` — exact fixture/task identity resolution.
- `src/app/practice-types.js` — append the item and set revision 4 under the existing goal.
- `src/interaction/episode-definition.js` — register the new exact crossing definition without changing historical definitions.
- `src/interaction/episode.js` — exact definition/content admission, Plan 17’s exact fixture/overlay/crossing contract, and the identity-based pre-advance authored path-closure gate.
- `src/interaction/scene.js` — validated, gated stack projection and answer-withholding semantics.
- `src/render/contract.js`, `src/render/fraction-bar.js`, `src/render/beat-container.js`, `src/render/linear-path.js` — validated quantity consumption and shared stack presentation; preserve single-whole behavior for all old routes.
- `src/styles/render.css` — stack geometry and responsive styling only.
- `tests/content-crossing-addition.test.js`, `tests/interaction-crossing-addition.test.js`, `tests/render-crossing-addition.test.js`, `tests/app-crossing-addition.test.js` — focused authoring, admission, projection, rendering, and mounted app regressions.
- `tests/plan19-shared-factor-addition.test.js`, `tests/plan32-compact-authored-problem-batch.test.js` — update only assertions pinned to the prior live set revision and ten-item live count; retain exact historical prefixes, authored records, and replay identity assertions.
- `tests/routes/route-matrix.json` — append Plan 17 routes only; do not edit or weaken existing route rows/assertions.
- `reports/development/plan-17-crossing-one-whole-addition/evidence/` — bounded capture script, JSON measurements, and owner screenshots.
- `reports/development/plan-17-crossing-one-whole-addition/evidence/capture-plan17-crossing-addition.mjs` — mounted route capture, visual/linear Reflection Inspection Mode and return evidence, viewport measurements, and non-vacuous failure-seed orchestration.
- `reports/development/plan-17-crossing-one-whole-addition/evidence/verify-plan17-crossing-addition.mjs` — checks saved captures, measurements, question/control bounds, required help text, real-tab recovery records, restored clean runs, and named falsifying-seed outcomes.
- `reports/development/plan-17-crossing-one-whole-addition/progress.md` — final implementation evidence, written and committed last.

If integration reveals that `src/math/` must change to produce a required validated quantity, stop and return for scope review as the packet requires. No math, prompt/string, app-fragment, route-harness, other recipe, definition history, subtraction, motion, decision-log, packet-status, or orchestrator-disposition edits are included in this proposal.

## Bounded evidence plan after approval

1. Preserve all 54 current route rows and prove old item, route, and replay identities still resolve. Traverse the registered learner goal and actual completion-gated Next to the appended item; exercise retry, return, clean re-entry, reset, and recognized fragment addressing.
2. Verify both 12 and 24 with every registered condition and both support profiles. Cover rest, last conversion animation/settled endpoint, operate before answer, wrong-answer recovery, accepted result, Replay, resolve, reflection, and retry/reset. Use the exact math/content API outputs as the form/count oracle.
3. At 360×740 and 360×752, record actual `scrollHeight`/scroll position, question and control bounds/reachability, horizontal overflow, both row widths, each segment width, and painted shaded counts. Include Replay-active routes under every registered condition as required by DECISION-032. Capture each required state and retain owner-review screenshots. Report vertical scrolling honestly; confirm the question and required controls remain reachable by scrolling.
4. Cover both high and medium support in visual and linear participation; reduced motion; real keyboard navigation and recovery with sequential Tab presses (no forced focus); touch activation without dragging; help open/close and correct help text; Replay; and reset. Missing help content must fail assertions rather than be skipped.
5. Add non-vacuous mounted falsification runs: (a) remove the second whole’s remainder row to reject one-whole truncation, (b) resize the second whole to reject unequal whole widths, and (c) inject result data into a pre-answer hidden/inactive sibling to reject answer leakage. Each must fail the same mounted witness, restore in `finally`, and then pass cleanly. Test wrong learner answers independently from a temporary corrupted rendered-fact seed; the former verifies recovery/withholding, the latter verifies display fidelity.
6. Run the packet-required `npm test`, `npm run build`, full `npm run test:routes`, packet lint, and `git diff --check` after source approval. Report what each witness observes; do not claim physical Chromebook, native touch, or assistive-technology behavior without direct testing.

## Advisor mode

No advisor/subagent was used for this prose-only Requirement 0 refinement. The repository-root `advisor-capable-providers.json` identifies Codex as advisor-capable when a subagent tool is present; this surface provides one. The provider record does not structurally verify read-only behavior, so any later behavioral consultation must be instruction-read-only with post-hoc status/diff verification, explicitly request a Sol-class model at low or medium effort, and use the bounded critique-only artifact brief. If the selected mechanism cannot honor that setting, report orchestrator-gate-only. No Astra or high-effort consultation is proposed.

## Approval requested

Approve or correct this proposal’s exact identities, set revision, path policies, two-row stack contract and limits, answer-withholding gate, shared layout/Replay contract, typed coverage/capability boundaries, and write paths. No source changes have been made. I will wait for FF Orch 12+ mechanism approval before proceeding.
