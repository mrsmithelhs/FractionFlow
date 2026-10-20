---
id: plan-40
title: Unlike-Denominator Subtraction Recipes and Curated Batch
status: delivered
depends_on: [plan-35, plan-38]
gate: "Requirement 0: approve exact renaming-to-takeaway operate transition, recipe/record schema, 8-to-10 item batch + holdouts, and replay v6 contract before source changes. Staged technical review, owner rendered-page/agency acceptance, and Roadmap §31/§90 Phase 3 exit disposition."
summary: >-
  Complete Phase 3 proper-fraction bar coverage by combining Plan 35's three
  reusable renaming recipes (construct, inspect/keep/repair, and identify-side)
  with Plan 38's takeaway subtraction operation across nested, shared-factor,
  and relatively-prime unlike-denominator subtraction. Deliver a compact vetted
  batch under "Subtract fractions with different denominators", prove data-only
  holdout extension, and record the Roadmap §31/§90 Phase 3 exit disposition.
---
# Plan 40: Unlike-Denominator Subtraction Recipes and Curated Batch

## Packet Metadata

- Packet id: `plan-40`
- Packet title: Unlike-Denominator Subtraction Recipes and Curated Batch
- Status: (see frontmatter)
- Owner/model: single implementer / supervised orchestration
- Date: 2026-10-19
- Packet type: bounded Phase 3 feature completion, reusable subtraction recipes, and curated batch
- Mutation level: source, compact data, tests, and local evidence; no remote writes
- Approval gate: Requirement 0 pre-source mechanism and batch approval, staged technical reviews, owner rendered-page/agency acceptance, Roadmap §31/§90 Phase 3 exit disposition, and separate deployment gate
- Expected artifacts: approved Requirement 0 proposal + math/admission probe, compact unlike-denominator subtraction batch + data-only holdouts, episode/scene/replay-v6 path, visual and accessible linear takeaway-after-renaming rendering, browser route/seed evidence, and progress report with §31/§90 Phase 3 exit summary

## Goal, dependencies and reason

Complete the owner-selected **Option A** Phase 3 sequence before activating Phase 4 number-line source code (`plan-39`). FractionFlow now supports:
- Unlike-denominator proper addition across three reusable compact recipes (`construct-equivalent`, `inspect-keep-repair`, `identify-side-construct`) in `plan-35` (`DECISION-042`, `DECISION-044`); and
- Like-denominator takeaway subtraction (`encounter -> operate -> resolve`) with hatched removal marks, exact-equivalent acceptance, and concise visual/linear copy in `plan-38` (`DECISION-045`).

What remains for Roadmap §§27, 29–31 ("The fraction-bar representation should now function as a coherent language across proper-fraction addition and subtraction") is **unlike-denominator proper subtraction** across `nested-denominator-subtraction`, `shared-factor-subtraction`, and `relatively-prime-subtraction`.

- `plan-35` supplies the compact record materialization, the three renaming recipes (`construct`, `inspect`, `identify`), and the data-only holdout verification pattern.
- `plan-38` supplies the owner-accepted takeaway subtraction semantics, hatched removal bar representation, exact-equivalent response validation, and concise visual/linear copy (`"How much is left?"`, `"${rightNum}/${den} is taken away from ${leftNum}/${den}."`, `"${num}/${den} is left."`).

Both dependencies are complete. Extending the three renaming recipes to subtraction and transitioning into the takeaway operation once the common unit is established completes Phase 3 bar-model coverage for proper-fraction operations and directly informs the Roadmap §31 / §90 checkpoint.

## Authority and required reading

Read:
- `AGENTS.md`
- `docs/agent-starting-prompts/implementer-prompt.md`
- `docs/decision-log.md` (`DECISION-035`, `DECISION-040`, `DECISION-042`, `DECISION-044`, `DECISION-045`, `DECISION-046`)
- `docs/development/README.md` and `docs/development/packet-creation-guidance.md`
- `docs/founding/01-instructional-model.md`, `02-interaction-grammar.md`, `03-math-and-content-model.md`, `04-system-architecture.md`, `05-quality-and-validation.md`, and `06-roadmap.md` (§§26–31, §90)
- `docs/development/phase-3-follow-up-obligations.md`
- `docs/development/plan-35-reusable-task-recipes-and-authored-batch.md` and `reports/development/plan-35-reusable-task-recipes-and-authored-batch/progress.md`
- `docs/development/plan-38-like-denominator-subtraction-batch.md` and `reports/development/plan-38-like-denominator-subtraction-batch/progress.md`

Inspect actual source and tests before proposing mechanisms; do not rely on report summaries alone.

## Scope and non-goals

### In scope
- Implement one learner-reachable goal (**Subtract fractions with different denominators** / `unlike-denominator-subtraction`) backed by a compact reviewed batch (`unlike-subtraction-vetted-set@1`, 8–10 curated items) plus 2 test-only data holdouts (`plan40-data-only-holdouts@1`).
- Support all three unlike-denominator subtraction structural selectors (`nested-denominator-subtraction`, `shared-factor-subtraction`, `relatively-prime-subtraction`) across three reusable subtraction recipes:
  1. `unlike-subtraction.construct-equivalent`: `encounter -> transform-left -> transform-right -> operate -> resolve` (two-renaming problems across `relatively-prime-subtraction` and `shared-factor-subtraction`).
  2. `unlike-subtraction.inspect-keep-repair`: `encounter -> transform-left -> transform-right -> operate -> resolve` (two-renaming problems with versioned authored candidate stimuli containing one valid and one invalid candidate).
  3. `unlike-subtraction.identify-side-construct`: `encounter -> select-renaming-side (decide) -> transform-<side> -> operate -> resolve` (`nested-denominator-subtraction` in **both** operand orders: when the minuend `left` needs renaming to match `right.denominator`, and when the subtrahend `right` needs renaming to match `left.denominator`).
- Coherent renaming-to-takeaway visual and linear progression:
  - During `encounter`, `decide` (when present), and `transform`, display the two fraction bars (`left` minuend and `right` subtrahend) and their renaming to the shared `targetDenominator` (`a'/d` and `b'/d`), reusing `plan-35`'s transform controls, local multiplier help, and recovery.
  - Once the common unit `d = targetDenominator` is established, transition into `operate` (`"How much is left?"`) using the takeaway model on the renamed common-unit quantity (`a'/d` with `b'/d` marked as removed via hatching in Visual view, and `"${b'}/${d} is taken away from ${a'}/${d}."` in Linear view during `operate` only).
  - Accept any exact-equivalent fraction response for the difference (`equalFractions(submitted, rawDifference)`), preserve distinct `rawResultForm` (`(a' - b')/d`) and `submittedForm`, and display `"${submitted.numerator}/${submitted.denominator} is left."` at `resolve` with no redundant unit-context prose or automatic equivalence paragraph.
- Local task help and recovery across both `transform` (equivalent-fraction multiplier help) and `operate` (takeaway counting/subtraction help), preserving drafts and open/closed help state across wrong answers and Visual <-> Linear view switches.
- Strict replay round-tripping (`fractionflow.episode-replay/v6`) while preserving `v1`–`v5` replay envelopes bit-for-bit.

### Out of scope (explicit non-goals)
- Do **not** implement negative differences, improperoperands, mixed-number borrowing/regrouping, or automatic simplification lessons.
- Do **not** add standalone `notice`, common-denominator discovery (`decide` for two-renaming recipes), or `reflect` beats to these compact recipes.
- Do **not** add an extra `Take away` button beat if the learner has already completed `encounter` and `transform` beats—or if a `Take away` sub-action is considered, evaluate both options explicitly at Requirement 0 and keep the schedule short (`encounter -> [decide] -> transform -> operate -> resolve`).
- Do **not** modify number-line eligibility (`plan-39` owns Phase 4 number-line activation).
- Do **not** push, deploy, or alter packet status.

---

## Requirement 0 — Pre-source mechanism proposal, batch probe, and baseline freeze (STOP GATE)

Before modifying any file under `src/`, run preflight and produce `reports/development/plan-40-unlike-denominator-subtraction-batch/requirement-0-proposal.md` plus a deterministic math/admission probe script (`requirement-0-probe.mjs` and `requirement-0-probe-results.json`):

1. **Preflight & Baseline Verification:**
   - Run `node scripts/dev/plan-status.js check plan-40`, `node scripts/dev/plan-status.js lint`, `npm test`, `npm run build`, and `npm run test:routes`.
   - Record the exact git commit SHA, unit test count (`47` files / `439` tests), and route-matrix baseline (`73` route rows / `75` browser executions).
   - Freeze deterministic `v5` replay oracles for `plan-38` (`tests/fixtures/plan38-v5-replay-oracles.json`) alongside the existing `plan35-v4-replay-oracles.json`.
2. **Mathematical & Profile Admission Probe:**
   - Verify how `src/content/generator.js` and `src/content/profiles.js` (`curated-review` vs. `plan36-subtraction-review` or a dedicated profile) admit `nested-denominator-subtraction`, `shared-factor-subtraction`, and `relatively-prime-subtraction` across positive proper differences (including both irreducible and `reducible-result` overlays, and optionally an equal-value unreduced/renamed zero boundary only if appropriate).
   - Propose an exact 9-item (or 8–10 item) curated batch (`unlike-subtraction-vetted-set@1`) plus 2 test-only data holdouts (`plan40-data-only-holdouts@1`) covering:
     - At least 3 distinct target denominators per recipe (`construct`, `inspect`, `identify`);
     - `nested-denominator-subtraction` (`identify`) in **both** operand orders (left needs renaming vs. right needs renaming);
     - Both `relatively-prime-subtraction` and `shared-factor-subtraction` across `construct` and `inspect`;
     - Varied valid/invalid candidate sides in `inspect` (`left` invalid vs. `right` invalid);
     - Both irreducible and reducible raw differences (`reducible-result` overlay).
3. **Renaming-to-Takeaway Transition & Exact Wiring Proposal:**
   - Specify how `operate` presents the takeaway model once `transform` completes:
     - **Recommended direct transition:** Entering `operate` after `transform` immediately displays the renamed common-unit takeaway bar (`a'/d` with `b'/d` hatched as removed, preserving the renamed operand context) and focuses `#operate-fraction-numerator-input` (`"How much is left?"`), avoiding an extra button-click beat after multi-step renaming while preserving the exact takeaway visual and linear semantics from `plan-38`.
   - Specify the exact module paths, record schema, `taskContext` keys, episode definition (`phase-3-reusable-subtraction-recipes@1`), scene projection (`scene.meaning.operation` / `takeawayBar` at `operate` and `resolve`), and replay schema (`fractionflow.episode-replay/v6`).

**STOP after committing Requirement 0 artifacts under `reports/development/plan-40-unlike-denominator-subtraction-batch/` and wait for orchestrator approval.**

---

## Requirement 1 — Curated records, recipe validation, and data-only holdouts (Stage 1)

1. Author the curated records and 2 holdout records in `src/content/data/plan40-subtraction-recipe-records.js` and register fixtures in `src/content/authored-problem-materializer.js` and `src/content/authored-content-catalog.js`.
2. Implement `src/content/plan40-subtraction-recipe-task.js` validating:
   - Exact recipe identity (`unlike-subtraction.construct-equivalent`, `unlike-subtraction.inspect-keep-repair`, `unlike-subtraction.identify-side-construct`), selector (`nested-denominator-subtraction`, `shared-factor-subtraction`, `relatively-prime-subtraction`), and `operation === 'subtract'`.
   - Exact common-denominator validity (`validateCommonDenominator`), required renaming side(s), positive/nonnegative proper difference (`subtractAtCommonDenominator`, `validateOperationResult`), representation eligibility (`evaluateProposedPathEligibility`), and `inspect` candidate rules (one valid, one invalid).
3. Prove that the 2 holdout records (`plan40-data-only-holdouts@1`) execute end-to-end through the exact same validation, episode, scene, replay, and render code with zero per-item branches.

---

## Requirement 2 — Episode state machine, Scene projection, and Replay v6 (Stages 2–3)

1. Register `phase-3-reusable-subtraction-recipes` (`revision: '1'`) in `src/interaction/episode-definition.js` and `src/interaction/beat-schedule.js`:
   - `construct` and `inspect`: `['encounter', 'transform-left', 'transform-right', 'operate', 'resolve']`
   - `identify`: `['encounter', 'select-renaming-side', 'transform-<requiredSide>', 'operate', 'resolve']`
2. In `src/interaction/episode.js`:
   - Reuse the proven `encounter`, `decide` (`select-renaming-side`), and `transform` (`construct` / `inspect` + multiplier help) handlers for renaming the required operand(s) to `targetDenominator`.
   - At `operate`, validate submitted fraction responses against the exact difference `subtractAtCommonDenominator(left, right, targetDenominator)` using `equalFractions`, recording both `rawResultForm` (at `targetDenominator`) and `submittedForm` (the learner's accepted equivalent form), and supporting `request-task-help` (`established.help.operate = true`).
3. In `src/interaction/scene.js`:
   - During `encounter`, `decide`, and `transform`, project the two operand bars (`left` and `right`) and their conversion state cleanly with `operation.kind = 'subtract'`.
   - At `operate` and `resolve`, project the takeaway bar model (`takeawayBar` with `totalParts = targetDenominator`, `initialShadedParts = leftAtTarget.numerator`, `removedParts = rightAtTarget.numerator`, `remainingParts = rawDifference.numerator`, `removalStatus = 'marked'`) alongside the renamed quantities so the learner sees `b'/d` taken away from `a'/d` on the common unit `d`.
   - Withhold `rawResult`, `preferredFinalForm`, and `remainingParts` answer labels prior to `resolve`.
4. Extend `src/interaction/replay.js` with `fractionflow.episode-replay/v6` for `phase-3-reusable-subtraction-recipes@1` while keeping `v1`–`v5` immutable and verified against frozen oracles.
5. **Checkpoint 1 Stop Condition:** After completing Stages 1–3 and unit tests (`tests/plan40-subtraction-recipes.test.js`), commit and **STOP for Orchestrator Checkpoint 1 Review** before modifying `src/render/`, `src/styles/`, or `src/app/`.

---

## Requirement 3 — Visual & linear renderers and app integration (Stages 4–5)

1. **Visual & Linear Renderers (`src/render/beat-container.js`, `src/render/linear-path.js`, `src/render/strings.js`):**
   - Ensure `encounter`, `decide`, and `transform` prompts and milestone summaries use subtraction-appropriate wording (e.g., `"−"` operator, never `"add"` or `"sum"`).
   - At `operate`, render the marked takeaway bar in Visual view and `"${rightConvertedNum}/${targetDen} is taken away from ${leftConvertedNum}/${targetDen}."` in Linear view (during `operate` only, omitted at `resolve`), with prompt `"How much is left?"`, fraction inputs (`#operate-fraction-numerator-input` / `#operate-fraction-denominator-input` and linear equivalents), and local takeaway help (`"Count only the shaded parts without removal marks."` in Visual; concise renamed-unit takeaway cue in Linear).
   - At `resolve`, display the completed subtraction equation using the learner's accepted `submittedForm` and prompt `"${submitted.numerator}/${submitted.denominator} is left."` with `Finish` / `Next problem`.
2. **App Integration (`src/app/practice-types.js`, `src/app/index.js`):**
   - Register learner goal `unlike-denominator-subtraction` (**"Subtract fractions with different denominators"**) backed by `unlike-subtraction-vetted-set@1`.
   - Preserve drafts, open/closed help state, and recovery feedback across wrong submissions and Visual <-> Linear view toggles across both `transform` and `operate` beats.
3. **Checkpoint 2 Stop Condition:** After completing Stages 4–5, rendered/mounted tests (`tests/plan40-rendered-subtraction.test.js`), and a bounded headless browser check of visual/linear rendering at `360px` and `1366px`, commit and **STOP for Orchestrator Checkpoint 2 Review** before Stage 6 route-matrix additions.

---

## Requirement 4 — Browser route matrix, falsification seeds, viewport evidence, and §31/§90 summary (Stage 6)

1. Preserve all existing `73` route rows / `75` browser executions and historical evidence files unchanged.
2. Append bounded Plan 40 browser routes to `tests/routes/route-matrix.json` and `tests/routes/plan34-context-map.json`:
   - Full vetted-set traversal in Visual view (`ROUTE-PLAN40-UNLIKE-SUBTRACTION-HIGH-VISUAL-ALL`) and Linear view (`ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL`) covering all 3 recipes (`construct`, `inspect`, `identify` in both orders), gated `Next`, exhaustion notice, and return/re-entry.
   - Deep samples witnessing:
     - `inspect-keep-repair` candidate repair + transition to marked takeaway bar at `operate`;
     - `identify-side-construct` in both left-renaming and right-renaming orders;
     - Reducible difference submitted in simplified form (`2/5` or `1/3` etc.) vs. common-unit form;
     - Transform help -> operate takeaway help -> repeated wrong answer -> view-switch draft preservation;
     - Responsive viewport layout measurements (`360x740`, `360x752`, `1366x768`, and `1093x614 @ DPR 1.25`) asserting zero horizontal overflow and `withinViewport: true` for prompt and controls.
3. Implement failing-first witness seeds in `scripts/dev/run-route-matrix.js` under `--plan40-witness-seed <seed>`:
   - `erased-takeaway-hatch-after-transform`: strips hatch gradient on `.fraction-bar-segment.removed` at `operate` and fails the visible geometry paint assertion.
   - `addition-wording-in-subtraction`: injects addition operator/copy (`+` or `Sum:`) during subtraction `transform`/`operate` and fails the subtraction semantics assertion.
   - `premature-difference-leak`: leaks the remaining fraction label before `operate` submission and fails the non-leakage assertion.
   - `missing-operate-fraction-inputs`: bypasses fraction entry after `transform` by omitting `#operate-fraction-numerator-input` and fails the `hasSelector` assertion.
4. Capture representative screenshots and `plan40-viewport-measurements.json` (with `withinViewport: true` assertions) under `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/`, restore any touched historical evidence files, and write `reports/development/plan-40-unlike-denominator-subtraction-batch/progress.md` including a concise **Roadmap §31 / §90 Phase 3 Exit Assessment** section for owner review.

## Validation checklist

- [ ] Requirement 0 proposal, batch probe, and `plan38-v5-replay-oracles.json` approved before any `src/` edits.
- [ ] All curated batch items and 2 data-only holdout items materialize and execute through shared `construct`, `inspect`, and `identify` subtraction recipe code with zero per-item branches.
- [ ] Both operand orders work for `nested-denominator-subtraction` (`identify-side-construct`).
- [ ] `operate` cleanly presents the takeaway model on the renamed common unit `targetDenominator` in both Visual and Linear views without leaking the answer or repeating distractions.
- [ ] Historical `v1`–`v5` replay oracles and all existing 73 route rows / 75 executions pass without regression; `v6` replay round-trips all Plan 40 items.
- [ ] All 4 `--plan40-witness-seed` falsification seeds fail their intended assertions and exit `0` under seed detection.
- [ ] All responsive/zoom captures assert `withinViewport: true` for prompt and controls.
- [ ] Required report exists at `reports/development/plan-40-unlike-denominator-subtraction-batch/progress.md` with the Roadmap §31 / §90 Phase 3 exit summary.
- [ ] No unrelated files are modified; implementer does not flip packet status to `complete`.

## Implementer authority boundaries

- Do **not** flip packet `status` to `complete` or edit orchestrator/owner review dispositions.
- Do **not** declare the feature "complete," "ready to ship," or "done."
- Report against the objective with verifiable artifacts and geometry/route receipts, not proxy test counts.
- Follow the inherited advisor-consultation declaration and commit-discipline rules in `AGENTS.md`.
