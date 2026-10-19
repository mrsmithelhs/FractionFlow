---
id: plan-39
title: First Number-Line Locate and Bar-to-Line Bridge Batch
status: ready
depends_on: [plan-35, plan-37, plan-38]
gate: "Requirement 0: confirm §31/§90 bridge readiness and approve exact wiring, admission/replay v6 and evidence mechanism before source. Staged technical review, owner rendered-page/agency acceptance and separate deployment gate."
superseded_by: null
resolution: null
summary: >-
  Implement the adopted Plan 37 (DECISION-046) 0-to-1 bar-to-number-line bridge
  task as one learner-reachable goal with eight curated records across high and
  medium support. Preserve exact rational evaluation, persistent bar-above-line
  endpoint alignment, two-step preview/confirm selection, 44x44px touch targets
  at 360px, directional recovery, non-leaking screen-reader step descriptions,
  and historical replay compatibility.
---
# Plan 39: First Number-Line Locate and Bar-to-Line Bridge Batch

## Packet Metadata

- Packet id: `plan-39`
- Packet title: First Number-Line Locate and Bar-to-Line Bridge Batch
- Status: (see frontmatter)
- Owner/model: single implementer / supervised orchestration
- Date: 2026-10-18
- Packet type: bounded learner feature, representation bridge, and authored batch
- Mutation level: source, compact data, tests, and local evidence; no remote writes
- Approval gate: Requirement 0 pre-source mechanism + §31/§90 checkpoint, staged technical reviews, owner rendered-page/agency acceptance, and separate deployment gate
- Expected artifacts: admitted eight-item bridge set, episode/scene/replay-v6 path, SVG/DOM number-line and accessible linear renderers, browser route/seed evidence, and progress report

## Goal, dependencies and reason

Implement `DECISION-046` and the adopted [Plan 37 design dossier](../../reports/development/plan-37-first-number-line-and-bar-bridge-design/owner-acceptance.md). FractionFlow's fraction-bar grammar now spans unlike-denominator addition (`plan-32`, `plan-34`, `plan-35`), like-denominator addition (`plan-20`), crossing one whole (`plan-17`), and like-denominator takeaway subtraction (`plan-38`). The next foundational question on the roadmap (§§31–34, §90) is whether a learner can connect the **length of one shaded fraction bar** to the **coordinate distance from `0` on a `0`-to-`1` number line** using stable benchmarks (`0`, `1/2`, `1`).

- `plan-35` supplies the compact authored-record materialization, catalog registration, and versioned replay compatibility patterns.
- `plan-37` supplies the owner-accepted instructional, geometric, accessibility, and eight-item seed contract (`DECISION-046`).
- `plan-38` supplies the current production baseline (`production-default-v7` routes and `fractionflow.episode-replay/v5`).

All three dependencies are complete. This packet delivers all eight curated bridge records through shared mechanisms without per-item behavioral branches or arithmetic regressions.

## Authority and required reading

Read:
- `AGENTS.md`
- `docs/agent-starting-prompts/implementer-prompt.md`
- `docs/decision-log.md` (`DECISION-035`, `DECISION-040`, `DECISION-042`, `DECISION-045`, `DECISION-046`)
- `docs/development/README.md` and `docs/development/packet-creation-guidance.md`
- `docs/founding/01-instructional-model.md`, `02-interaction-grammar.md`, `03-math-and-content-model.md`, `04-system-architecture.md`, `05-quality-and-validation.md`, and `06-roadmap.md` (§§31–37, §90)
- `docs/development/phase-3-follow-up-obligations.md`
- `reports/development/plan-37-first-number-line-and-bar-bridge-design/`:
  - `owner-acceptance.md`
  - `requirement-0-investigation.md`
  - `annotated-flow.md`
  - `design-contract.md`
  - `implementation-and-validation.md`

Inspect actual source and tests before proposing mechanisms; historical reports are not substitutes for live code inspection.

## Scope and non-goals

### In scope
- Implement one learner-reachable goal (**Place fractions on a number line** / `bar-to-line-same-amount`) backed by the fixed eight-item curated set (`bridge-01-half-2` through `bridge-08-five-sixths-med`) from Plan 37.
- Domain: proper fractions on the unit interval `[0, 1]` with denominators `b in {2, 3, 4, 6, 8}`, exact rational target and candidate coordinates (`{ kind: 'fraction', numerator, denominator }`), and primary benchmarks `0`, `1/2`, and `1`.
- Support-dependent density:
  - **High support (`guided`):** `partitioned` density mode with full `1/b` subdivision ticks across `[0, 1]`, taller benchmark ticks at `0`, `1/2`, `1`, and `>= 44x44px` interactive targets at `360px` viewport width (using staggered dual-tier tick hit targets or a `>= 44x44px` discrete step control when `b = 8`).
  - **Medium support (`prompted`):** `sparse-benchmarks` density mode showing only `0`, `1/2`, and `1` benchmark ticks plus the item's 4 exact candidate markers (`1` target + `3` diagnostic distractors) spaced with `>= 44x44px` hitboxes.
- Three-beat episode schedule (`encounter -> locate -> resolve`) with two-step selection (`select/preview candidate -> Check Position`) and zero drag dependency.
- Directional local recovery in `locate`, local task help (`Need help?` / `Close help`), visual and accessible linear ("Read the steps") parity, and strict replay round-tripping (`fractionflow.episode-replay/v6`) while preserving `v1`–`v5`.

### Out of scope (explicit non-goals)
- Do **not** build a general representation-switching plugin framework or convert existing addition/subtraction episodes onto number lines.
- Do **not** implement number-line addition/subtraction jumps, multi-whole `[0, 2]` number lines (crossing 1 remains a separate follow-up obligation), mixed numbers, or denominators `b > 8` on full-partitioned lines.
- Do **not** use pixel proximity or floating-point rounding to validate learner responses; all correctness and directional recovery must use exact `src/math/` rational APIs (`equalFractions`, `compareFractions`, `classifyMagnitude`, `benchmarkFraction`).
- Do **not** leak the target fraction coordinate, target index, or a coarse 3-bucket answer giveaway in DOM attributes or screen-reader labels before `resolve`.
- Do **not** push, deploy, or alter packet status.

---

## Requirement 0 — Pre-source mechanism proposal and baseline freeze (STOP GATE)

Before modifying any file under `src/`, run preflight and produce `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/requirement-0-proposal.md` (plus a deterministic probe script/receipt if helpful):

1. **Preflight & Baseline Verification:**
   - Run `node scripts/dev/plan-status.js check plan-39`, `node scripts/dev/plan-status.js lint`, `npm test`, `npm run build`, and `npm run test:routes`.
   - Record the exact git commit SHA, unit test count, and route-matrix baseline (`73` route rows / `75` browser executions).
2. **Exact Wiring & Contract Proposal:**
   - Specify the exact module exports, record schema, and 12-key (or task-specific) `taskContext` structure for `plan37.bar-to-line-same-amount` (`revision: '1'`) and definition `phase-4-bar-to-line-same-amount` (`revision: '1'`).
   - Specify how `src/content/eligibility.js` admits `number-line` strictly for this bridge family while retaining `NOT_IN_PHASE_2` refusal for arithmetic families.
   - Specify how `src/interaction/episode.js`, `src/interaction/replay.js` (`v6`), and `src/interaction/scene.js` project `meaning.numberLine` (`domain`, `densityMode`, `benchmarks`, `candidatePositions`, `acceptedPosition`, `alignmentGuideVisible`) with zero pre-resolution answer leakage.
   - Specify the exact `360px` touch-target mechanism for `b = 8` (`bridge-06-three-eighths-8`) so every interactive control meets `>= 44x44px` without overlapping hitboxes, and verify how `Bar.left === Line.left` and `Bar.right === Line.right` are enforced in CSS/SVG layout.
   - Specify the non-leaking accessible linear radio-option copy for both `partitioned` (`Step k of b between 0 and 1`) and `sparse-benchmarks` (`Point A/B/C/D: ...`) modes, proving that distinct candidates on the same side of `1/2` (such as `1/6` vs. `1/3` in `bridge-07-one-third-med`, or `4/6` vs. `5/6` in `bridge-08-five-sixths-med`) have distinct, non-collapsing accessible descriptions that do not name the target fraction `a/b`.

**STOP after committing Requirement 0 artifacts under `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/` and wait for orchestrator approval.**

---

## Requirement 1 — Curated records, content materialization, and scoped eligibility (Stage 1)

1. Author the 8 curated records in `src/content/data/plan37-bar-to-line-bridge-records.js`:
   - `bridge-01-half-2` (`1/2`, high support, partitioned)
   - `bridge-02-fourth-4` (`1/4`, high support, partitioned)
   - `bridge-03-three-fourths-4` (`3/4`, high support, partitioned)
   - `bridge-04-two-thirds-3` (`2/3`, high support, partitioned)
   - `bridge-05-two-fourths-half` (`2/4`, high support, partitioned, unreduced bar form preserved)
   - `bridge-06-three-eighths-8` (`3/8`, high support, partitioned)
   - `bridge-07-one-third-med` (`1/3`, medium support, sparse benchmarks with candidates `1/6, 1/3, 1/2, 2/3`)
   - `bridge-08-five-sixths-med` (`5/6`, medium support, sparse benchmarks with candidates `2/6, 3/6, 4/6, 5/6`)
2. Register the practice set (`bar-to-line-same-amount-vetted-set@1`), task data (`plan37-bar-to-line-same-amount@1`), and validation helpers in `src/content/plan37-bar-to-line-bridge-task.js`.
3. Materialize the 8 fixtures through `src/content/authored-problem-materializer.js` and `src/content/authored-content-catalog.js`, preserving unreduced source forms (`2/4` in `bridge-05-two-fourths-half`) and validating all candidate fractions via `src/math/`.
4. Update `src/content/eligibility.js` so `number-line` representation eligibility is `ELIGIBLE` only for validated `bar-to-line-same-amount` bridge contexts, while all arithmetic selectors continue to return `NOT_IN_PHASE_2`.

---

## Requirement 2 — Episode state machine, directional recovery, and Replay v6 (Stage 2)

1. Register `phase-4-bar-to-line-same-amount` (`revision: '1'`) in `src/interaction/episode-definition.js` with frozen schedule `['encounter', 'locate', 'resolve']`.
2. Implement intent handling in `src/interaction/episode.js`:
   - `acknowledge-bridge-encounter` (`encounter -> locate`)
   - `submit-line-position` (`locate -> resolve` when `equalFractions(proposed, target)` is true; otherwise remain in `locate` and record directional recovery classification using `compareFractions(proposed, target)` and `classifyMagnitude(proposed)`—e.g. `at-endpoint`, `wrong-side-of-half`, `too-low-same-side`, `too-high-same-side`).
   - `request-task-help` (allowed in `locate`; idempotent provenance `established.help.locate = true`).
   - `finish-compact-episode` (`resolve -> status: 'resolved'`).
3. Extend `src/interaction/replay.js` with `fractionflow.episode-replay/v6`:
   - Require `v6` for `phase-4-bar-to-line-same-amount` episodes and reject `v1`–`v5` for bridge tasks and `v6` for non-bridge tasks.
   - Keep `v1`–`v5` replay paths bit-for-bit compatible.
   - Never serialize unconfirmed candidate preview state or help open/close UI toggles into `learnerIntents`.

---

## Requirement 3 — Scene projection and non-leakage invariants (Stage 3)

1. Update `src/interaction/scene.js` to lift the `number-line` refusal strictly for validated `phase-4-bar-to-line-same-amount` states and project `scene.meaning.numberLine`:
   - `domain: { lowerWhole: '0', upperWhole: '1' }`
   - `densityMode: 'partitioned' | 'sparse-benchmarks'`
   - `benchmarks`: frozen array for `0`, `1/2`, `1`
   - `candidatePositions`: frozen array of candidate descriptors (`id`, `form`, `stepIndex`, `totalSteps`, `benchmarkRelation`) with **no boolean `isTarget` or `isCorrect` flag**.
   - `acceptedPosition`: `null` during `encounter` and `locate`; populated only at `resolve`.
   - `alignmentGuideVisible`: `false` during `encounter` and `locate`; `true` at `resolve`.
2. **Checkpoint 1 Stop Condition:** After completing Stages 1–3 and unit tests (`tests/plan39-content-bridge.test.js` and `tests/interaction-plan39-bridge.test.js`), commit and **STOP for Orchestrator Checkpoint 1 Review** before modifying any file under `src/render/`, `src/styles/`, or `src/app/`.

---

## Requirement 4 — Visual & linear renderers, endpoint alignment, and app integration (Stages 4–5)

1. **Visual Number-Line Renderer (`src/render/number-line.js`, `src/render/beat-container.js`, `src/styles/render.css`):**
   - Render the reference fraction bar persistently above the `0`-to-`1` number line in a shared alignment frame so `Bar.left === Line.left` and `Bar.right === Line.right` (`|Δx| <= 1px` across `360px`, `1366px`, and `125%` zoom viewports).
   - Label only the primary benchmarks `0`, `1/2`, and `1` permanently on the line track so labels never collide at `360px`.
   - Implement two-step selection in `locate`: tapping or keyboard-selecting a candidate previews it (updating the preview readout and highlighting the candidate marker) and enables `Check Position` (`.control-submit-btn`).
   - Guarantee `>= 44x44px` interactive hitboxes for every candidate/control at `360px` width, including `b = 8` (`bridge-06-three-eighths-8`).
   - At `resolve`, render the vertical alignment connector between the right edge of the shaded bar (`a/b`) and the confirmed point on the number line, and display concise resolution copy (`"${num}/${den} is at this point on the line."`).
   - Respect `prefers-reduced-motion: reduce` and `instant-test` mode with zero required animations.
2. **Accessible Linear Path (`src/render/linear-path.js`, `src/render/strings.js`):**
   - Render the bridge context and a native radio group (`input[type="radio"]`) for candidate selection during `locate`, paired with `Check Position` and `Need help?` / `Close help`.
   - Ensure radio labels describe structural step or benchmark-relative order without leaking the target fraction or collapsing two candidates into identical descriptions.
3. **App Integration & Draft/Focus Choreography (`src/app/practice-types.js`, `src/app/index.js`):**
   - Register the learner goal in `src/app/practice-types.js` (`id: 'bar-to-line-same-amount'`, label: `'Place fractions on a number line'`).
   - Preserve unconfirmed candidate preview selection, open/closed help state, and recovery feedback across Visual <-> Linear view switches (`Read the steps` / `Show the picture`).
   - Route focus deterministically across `encounter -> locate -> recovery -> help toggle -> resolve -> Next / Exhaustion / Retry / Return`.
4. **Checkpoint 2 Stop Condition:** After completing Stages 4–5 and rendered/mounted tests (`tests/plan39-rendered-bridge.test.js`), commit and **STOP for Orchestrator Checkpoint 2 Review** before running Stage 6 route-matrix additions and browser screenshot captures.

---

## Requirement 5 — Browser route matrix, falsification seeds, and viewport evidence (Stage 6)

1. Preserve all existing `73` route rows / `75` browser executions and their context mappings unchanged.
2. Append bounded Plan 39 browser routes to `tests/routes/route-matrix.json` and `tests/routes/plan34-context-map.json`:
   - Full 8-item traversal in visual view (`ROUTE-PLAN39-BRIDGE-VISUAL-ALL-8`) and linear view (`ROUTE-PLAN39-BRIDGE-LINEAR-ALL-8`) with gated `Next`, exhaustion notice, and return/re-entry.
   - Deep samples covering unreduced equivalence (`2/4` at `1/2`), `b = 8` `360px` touch-target geometry (`bridge-06-three-eighths-8`), medium-support sparse benchmarks (`bridge-07-one-third-med` / `bridge-08-five-sixths-med`), directional recovery + help toggle + view-switch preview preservation, and reduced-motion execution.
   - Responsive viewport layout measurements (`360x740`, `360x752`, `1366x768`, and `1093x614 @ DPR 1.25`) verifying zero horizontal overflow and strict bar-to-line endpoint alignment (`|Bar.left - Line.left| <= 1` and `|Bar.right - Line.right| <= 1`).
3. Implement failing-first witness seeds in `scripts/dev/run-route-matrix.js` under `--plan39-witness-seed <seed>`:
   - `misaligned-endpoints`: shifts number-line track horizontally relative to the reference bar and fails the endpoint alignment assertion.
   - `premature-target-leak`: marks or announces the target coordinate during `locate` before submission and fails the non-leakage assertion.
   - `undersized-touch-target`: shrinks `b = 8` candidate hitboxes below `44px` at `360px` width and fails the visible geometry / touch-hitbox assertion.
   - `single-tap-auto-submit`: bypasses the two-step preview/confirm gate and fails the `locate` preview-before-submit assertion.
   - `coarse-bucket-sr-collapse`: collapses distinct linear candidate labels into identical bucket strings and fails the linear distinct-description assertion.
4. Capture representative screenshots and `plan39-viewport-measurements.json` under `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/`, restore any historical evidence files touched during full route-matrix runs, and write `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/progress.md`.

## Validation checklist

- [ ] Requirement 0 proposal and §31/§90 readiness check approved before any `src/` edits.
- [ ] All 8 curated bridge records materialize and validate through exact `src/math/` APIs with no per-item code branches.
- [ ] Both `partitioned` (high support) and `sparse-benchmarks` (medium support) modes work in visual and linear views.
- [ ] Bar and number-line endpoints align (`0` under left bar edge, `1` under right bar edge) and all interactive targets meet `>= 44x44px` at `360px`.
- [ ] Two-step selection, directional recovery, local help toggle, and preview preservation across view switches work cleanly.
- [ ] Historical `v1`–`v5` replay and all existing 73 route rows / 75 executions pass without regression; `v6` replay round-trips all 8 bridge items.
- [ ] All 5 `--plan39-witness-seed` falsification seeds fail their intended assertions and exit `0` under seed detection.
- [ ] Required report exists at `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/progress.md`.
- [ ] No unrelated files are modified; implementer does not flip packet status to `complete`.

## Implementer authority boundaries

- Do **not** flip packet `status` to `complete` or edit orchestrator/owner review dispositions.
- Do **not** declare the feature "complete," "ready to ship," or "done."
- Report against the objective with verifiable artifacts and geometry/route receipts, not proxy test counts.
- Follow the inherited advisor-consultation declaration and commit-discipline rules in `AGENTS.md`.
