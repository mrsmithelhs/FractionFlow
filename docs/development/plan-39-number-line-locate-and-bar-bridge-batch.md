---
id: plan-39
title: First Number-Line Locate and Bar-to-Line Bridge Batch
status: draft
depends_on: [plan-35, plan-37, plan-38, plan-40, plan-41, plan-42]
gate: "Owner sequencing gate: Plan 40 + §31/§90 disposition, then Plan 41 investigation disposition and any separately adopted prerequisite refactor, precede Phase 4 activation (DECISION-047). Requirement 0: confirm readiness and approve exact wiring, admission, next sequential replay schema, and evidence mechanism before source. Staged technical review, owner rendered-page/agency acceptance and separate deployment gate."
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
- Approval gate: Owner sequencing gate (Option A: unlike-denominator subtraction + §31/§90 disposition precede Phase 4 activation unless owner explicitly reorders), Requirement 0 pre-source mechanism + §31/§90 checkpoint, staged technical reviews, owner rendered-page/agency acceptance, and separate deployment gate
- Expected artifacts: admitted eight-item bridge set, episode/scene/next-replay-schema path, SVG/DOM number-line and accessible linear renderers, browser route/seed evidence, and progress report

## Goal, dependencies and reason

Owner sequencing amendment (2026-10-20, DECISION-047): after Plan 40 closure and
the Phase 3 checkpoint, first complete and dispose Plan 41's maintainability
investigation. Any adopted prerequisite source refactor needs its own approved
packet and must finish before this packet starts; add that dependency when named.
Plan 41 closure alone does not silently authorize number-line implementation.

Plan 42 now names the proposed prerequisite operate-response pilot, including its
guard stage and maintenance evaluation. It remains draft pending owner adoption
and mechanism approval; this dependency records the proposed sequence without
authorizing source work. Its handle is a candidate pattern, not a required
numerator/denominator schema for the locate preview.

Implement `DECISION-046` and the adopted [Plan 37 design dossier](../../reports/development/plan-37-first-number-line-and-bar-bridge-design/owner-acceptance.md). FractionFlow's fraction-bar grammar now spans unlike-denominator addition (`plan-32`, `plan-34`, `plan-35`), like-denominator addition (`plan-20`), crossing one whole (`plan-17`), and like-denominator takeaway subtraction (`plan-38`). Under the owner-selected **Option A** sequence, Phase 3 bar-stability completion (unlike-denominator subtraction on bars plus a concise Roadmap §31 / §90 disposition) precedes activating Phase 4 number-line source code unless the owner explicitly chooses to reorder. Once activated, this packet addresses the foundational Phase 4 question (§§31–34, §90): connecting the **length of one shaded fraction bar** to the **coordinate distance from `0` on a `0`-to-`1` number line** using stable benchmarks (`0`, `1/2`, `1`).

- `plan-35` supplies the compact authored-record materialization, catalog registration, and versioned replay compatibility patterns.
- `plan-37` supplies the owner-accepted instructional, geometric, accessibility, and eight-item seed contract (`DECISION-046`).
- `plan-38` supplies the current like-denominator subtraction baseline (`production-default-v7` routes and `fractionflow.episode-replay/v5`).

This packet remains `status: draft` until the Option A Phase 3 prerequisite (or an explicit owner reordering decision) is satisfied. When promoted to `ready`, it delivers all eight curated bridge records through shared mechanisms without per-item behavioral branches or arithmetic regressions.

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
- Support-dependent density owned cleanly by the active episode support configuration across all 8 items:
  - **High support (`guided` / `high-support`):** `partitioned` density mode with full `1/b` selectable subdivision steps (`1/b` through `(b-1)/b`) across `[0, 1]` and taller benchmark ticks at `0`, `1/2`, `1`. For odd denominators (`b = 3`), the `1/2` benchmark tick is rendered as a **non-selectable visual reference anchor**, not an extra selectable partition step.
  - **Medium support (`prompted` / `medium-support`):** `sparse-benchmarks` density mode showing only `0`, `1/2`, and `1` benchmark ticks plus each item's 4 authored exact candidate positions (`1` target + `3` diagnostic distractors). Every record in the 8-item set must carry both its `partitionDenominator` (`b`) for High Support and its 4 exact `sparseCandidates` for Medium Support so the entire 8-item set works cleanly under either reviewer-selectable support profile without per-item mode overrides.
- Honest touch-target geometry across all denominators and support modes:
  - Measure actual inner track width inside `.app-episode` / `.active-beat-section` padding at `360px` viewport width and under `125%` zoom (`1093x614 @ DPR 1.25`), where usable track width is approximately `218px–278px`.
  - Guarantee `>= 44x44px` non-overlapping interactive hitboxes whenever adjacent selectable tick or candidate centers are `< 44px` apart (which includes High Support `b = 6` and `b = 8`, as well as Medium Support `1/6`-spaced candidate pairs in `bridge-07-one-third-med` and `bridge-08-five-sixths-med`), using staggered dual-tier `.tier-upper`/`.tier-lower` hit targets and/or a `>= 44x44px` discrete `- 1/b` / `+ 1/b` stepper control.
- Three-beat episode schedule (`encounter -> locate -> resolve`) with two-step selection (`select/preview candidate -> Check Position` dispatching `propose-number-line-location`) and zero drag dependency.
- Directional local recovery in `locate` comparing both `proposed` and `target` against `1/2`, local task help (`Need help?` / `Close help`), visual and accessible linear ("Read the steps") parity, and strict replay round-tripping using the next sequential replay schema version after the active baseline while preserving all prior replay versions.

### Out of scope (explicit non-goals)
- Do **not** build a general representation-switching plugin framework or convert existing addition/subtraction episodes onto number lines.
- Do **not** implement number-line addition/subtraction jumps, multi-whole `[0, 2]` number lines (crossing 1 remains a separate follow-up obligation), mixed numbers, or denominators `b > 8` on full-partitioned lines.
- Do **not** use pixel proximity or floating-point rounding to validate learner responses; all correctness and directional recovery must use exact `src/math/` rational APIs (`equalFractions`, `compareFractions`, `classifyMagnitude`, `benchmarkFraction`).
- Do **not** mark or announce *which* candidate on the number line is the correct target (`isTarget`, `isCorrect`, `data-correct`, `aria-current`, or a coarse 3-bucket answer giveaway) in candidate descriptors, DOM attributes, or screen-reader candidate labels before `resolve`. (The source bar and task prompt legitimately state the fraction being located; the non-leakage invariant forbids identifying which line candidate matches that target prior to `resolve`.)
- Do **not** push, deploy, or alter packet status.

---

## Requirement 0 — Pre-source mechanism proposal and baseline freeze (STOP GATE)

Before modifying any file under `src/`, run preflight and produce `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/requirement-0-proposal.md` (plus a deterministic probe script/receipt if helpful):

1. **Preflight & Baseline Verification:**
   - Run `node scripts/dev/plan-status.js check plan-39`, `node scripts/dev/plan-status.js lint`, `npm test`, `npm run build`, and `npm run test:routes`.
   - Record the exact git commit SHA, unit test count, route-matrix baseline, and highest existing replay schema version (`vN`, proposing `v(N+1)` for this packet).
   - Confirm that the Roadmap §31 / §90 prerequisite is satisfied in `docs/decision-log.md` before proposing source changes.
2. **Exact Wiring & Contract Proposal:**
   - Specify the exact module exports, record schema (including both `partitionDenominator` for High Support and 4 `sparseCandidates` for Medium Support on all 8 items), and `taskContext` structure for `plan37.bar-to-line-same-amount` (`revision: '1'`) and definition `phase-4-bar-to-line-same-amount` (`revision: '1'`).
   - Specify how `src/content/eligibility.js` admits `number-line` strictly for this bridge family while retaining `NOT_IN_PHASE_2` refusal for arithmetic families.
   - Specify how `src/interaction/episode.js`, `src/interaction/replay.js` (next sequential version `v(N+1)`), and `src/interaction/scene.js` project `meaning.numberLine` (`domain`, `densityMode`, `benchmarks`, `candidatePositions`, `acceptedPosition`, `alignmentGuideVisible`) with zero target-candidate identification prior to `resolve`, and with `1/2` rendered as a non-selectable benchmark reference on odd denominators (`b = 3`) in `partitioned` mode.
   - Specify the exact two-input directional recovery classification table using `compareFractions(proposed, target)`, `classifyMagnitude(proposed)`, and `classifyMagnitude(target)` so `wrong-side-of-half` vs. `too-low-same-side` / `too-high-same-side` is derived from comparing **both** `proposed` and `target` against `1/2`.
   - Measure actual usable track width inside card padding at `360px` and `125%` zoom (`~218px–278px`) and specify the exact touch-target geometry mechanism whenever adjacent candidate centers are `< 44px` apart (covering High Support `b = 6` and `b = 8` as well as Medium Support `1/6`-spaced candidates in `bridge-07-one-third-med` and `bridge-08-five-sixths-med`), plus how `Bar.left === Line.left` and `Bar.right === Line.right` are enforced in CSS/SVG layout.
   - Specify the non-leaking accessible linear radio-option copy for both `partitioned` (`Step k of b between 0 and 1`) and `sparse-benchmarks` (`Point A/B/C/D: ...`) modes, proving that distinct candidates on the same side of `1/2` (such as `1/6` vs. `1/3` in `bridge-07-one-third-med`, or `4/6` vs. `5/6` in `bridge-08-five-sixths-med`) have distinct, non-collapsing accessible descriptions that do not identify which candidate is the target.

**STOP after committing Requirement 0 artifacts under `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/` and wait for orchestrator approval.**

---

## Requirement 1 — Curated records, content materialization, and scoped eligibility (Stage 1)

1. Author the 8 curated records in `src/content/data/plan37-bar-to-line-bridge-records.js`, each defining its source bar fraction, `partitionDenominator` (`b` for High Support `partitioned` mode), and 4 exact `sparseCandidates` (for Medium Support `sparse-benchmarks` mode) so every item supports both High and Medium Support profiles:
   - `bridge-01-half-2` (`1/2`, `b = 2`)
   - `bridge-02-fourth-4` (`1/4`, `b = 4`)
   - `bridge-03-three-fourths-4` (`3/4`, `b = 4`)
   - `bridge-04-two-thirds-3` (`2/3`, `b = 3`)
   - `bridge-05-two-fourths-half` (`2/4`, `b = 4`, unreduced bar form preserved; equivalent target at `1/2`)
   - `bridge-06-three-eighths-8` (`3/8`, `b = 8`)
   - `bridge-07-one-third-med` (`1/3`, `b = 3`, sparse candidates `1/6, 1/3, 1/2, 2/3`)
   - `bridge-08-five-sixths-med` (`5/6`, `b = 6`, sparse candidates `2/6, 3/6, 4/6, 5/6`)
2. Register the practice set (`bar-to-line-same-amount-vetted-set@1`), task data (`plan37-bar-to-line-same-amount@1`), and validation helpers in `src/content/plan37-bar-to-line-bridge-task.js`.
3. Materialize the 8 fixtures through `src/content/authored-problem-materializer.js` and `src/content/authored-content-catalog.js`, preserving unreduced source forms (`2/4` in `bridge-05-two-fourths-half`) and validating all candidate fractions via `src/math/`.
4. Update `src/content/eligibility.js` so `number-line` representation eligibility is `ELIGIBLE` only for validated `bar-to-line-same-amount` bridge contexts, while all arithmetic selectors continue to return `NOT_IN_PHASE_2`.

---

## Requirement 2 — Episode state machine, directional recovery, and Replay schema (Stage 2)

1. Register `phase-4-bar-to-line-same-amount` (`revision: '1'`) in `src/interaction/episode-definition.js` with frozen schedule `['encounter', 'locate', 'resolve']`.
2. Implement intent handling in `src/interaction/episode.js`:
   - `acknowledge-bridge-encounter` (`encounter -> locate`)
   - `propose-number-line-location` (`locate -> resolve` when `equalFractions(proposed, target)` is true; otherwise remain in `locate` and record directional recovery classification using `compareFractions(proposed, target)`, `classifyMagnitude(proposed)`, and `classifyMagnitude(target)`—i.e., `at-endpoint` when `proposed` is `0` or `1`; `wrong-side-of-half` when `proposed` and `target` lie on different sides of `1/2` or one is `1/2` while the other is not; and `too-low-same-side` / `too-high-same-side` when both lie on the same side of `1/2`).
   - `request-task-help` (allowed in `locate`; idempotent provenance `established.help.locate = true`).
   - `finish-compact-episode` (`resolve -> status: 'resolved'`).
3. Extend `src/interaction/replay.js` with the next sequential replay schema version (`fractionflow.episode-replay/v(N+1)` approved at Requirement 0):
   - Require that version for `phase-4-bar-to-line-same-amount` episodes and reject earlier versions for bridge tasks and the new version for non-bridge tasks.
   - Keep all historical replay versions bit-for-bit compatible.
   - Never serialize unconfirmed candidate preview state or help open/close UI toggles into `learnerIntents`.

---

## Requirement 3 — Scene projection and non-leakage invariants (Stage 3)

1. Update `src/interaction/scene.js` to lift the `number-line` refusal strictly for validated `phase-4-bar-to-line-same-amount` states and project `scene.meaning.numberLine`:
   - `domain: { lowerWhole: '0', upperWhole: '1' }`
   - `densityMode: 'partitioned' | 'sparse-benchmarks'` (derived from the active episode support configuration: `guided` -> `'partitioned'`, `prompted` -> `'sparse-benchmarks'`)
   - `benchmarks`: frozen array for `0`, `1/2`, `1` (with `1/2` marked as a non-selectable visual reference anchor in `partitioned` mode when `b` is odd, such as `b = 3`)
   - `candidatePositions`: frozen array of selectable candidate descriptors (`id`, `form`, `stepIndex`, `totalSteps`, `benchmarkRelation`) with **no boolean `isTarget` or `isCorrect` flag** identifying which candidate matches the source bar.
   - `acceptedPosition`: `null` during `encounter` and `locate`; populated only at `resolve`.
   - `alignmentGuideVisible`: `false` during `encounter` and `locate`; `true` at `resolve`.
2. **Checkpoint 1 Stop Condition:** After completing Stages 1–3 and unit tests (`tests/plan39-content-bridge.test.js` and `tests/interaction-plan39-bridge.test.js`), commit and **STOP for Orchestrator Checkpoint 1 Review** before modifying any file under `src/render/`, `src/styles/`, or `src/app/`.

---

## Requirement 4 — Visual & linear renderers, endpoint alignment, and app integration (Stages 4–5)

1. **Visual Number-Line Renderer (`src/render/number-line.js`, `src/render/beat-container.js`, `src/styles/render.css`):**
   - Render the reference fraction bar persistently above the `0`-to-`1` number line in a shared alignment frame so `Bar.left === Line.left` and `Bar.right === Line.right` (`|Δx| <= 1px` across `360px`, `1366px`, and `125%` zoom viewports).
   - Label only the primary benchmarks `0`, `1/2`, and `1` permanently on the line track so labels never collide at `360px`.
   - Implement two-step selection in `locate`: tapping or keyboard-selecting a candidate previews it (updating the preview readout and highlighting the candidate marker) and enables `Check Position` (`.control-submit-btn`), which dispatches `propose-number-line-location`.
   - Guarantee `>= 44x44px` non-overlapping interactive hitboxes for every selectable candidate/control at `360px` width and `125%` zoom whenever adjacent candidate centers are `< 44px` apart (including High Support `b = 6` and `b = 8` and Medium Support `1/6`-spaced candidates).
   - At `resolve`, render the vertical alignment connector between the right edge of the shaded bar (`a/b`) and the confirmed point on the number line, and display concise resolution copy (`"${num}/${den} is at this point on the line."`).
   - Respect `prefers-reduced-motion: reduce` and `instant-test` mode with zero required animations.
2. **Accessible Linear Path (`src/render/linear-path.js`, `src/render/strings.js`):**
   - Render the bridge context and a native radio group (`input[type="radio"]`) for candidate selection during `locate`, paired with `Check Position` and `Need help?` / `Close help`.
   - Ensure radio labels describe structural step or benchmark-relative order without identifying which candidate is the target or collapsing two candidates into identical descriptions.
3. **App Integration & Draft/Focus Choreography (`src/app/practice-types.js`, `src/app/index.js`):**
   - Register the learner goal in `src/app/practice-types.js` (`id: 'bar-to-line-same-amount'`, label: `'Place fractions on a number line'`).
   - Preserve unconfirmed candidate preview selection, open/closed help state, and recovery feedback across Visual <-> Linear view switches (`Read the steps` / `Show the picture`).
   - Route focus deterministically across `encounter -> locate -> recovery -> help toggle -> resolve -> Next / Exhaustion / Retry / Return`.
4. **Checkpoint 2 Stop Condition:** After completing Stages 4–5, rendered/mounted tests (`tests/plan39-rendered-bridge.test.js`), and a bounded headless browser geometry/accessibility verification of `360px` and `125%` zoom hit-target spacing and endpoint alignment (without editing `tests/routes/route-matrix.json` yet), commit and **STOP for Orchestrator Checkpoint 2 Review** before running Stage 6 route-matrix additions and final evidence captures.

---

## Requirement 5 — Browser route matrix, falsification seeds, and viewport evidence (Stage 6)

1. Preserve all existing route rows, browser executions, and their context mappings unchanged.
2. Append bounded Plan 39 browser routes to `tests/routes/route-matrix.json` and `tests/routes/plan34-context-map.json`:
   - Full 8-item traversal in visual view (`ROUTE-PLAN39-BRIDGE-VISUAL-ALL-8`, High Support `partitioned`) and linear view (`ROUTE-PLAN39-BRIDGE-LINEAR-ALL-8`, Medium Support `sparse-benchmarks`) with gated `Next`, exhaustion notice, and return/re-entry.
   - Deep samples covering unreduced equivalence (`2/4` at `1/2`), `b = 3` odd-denominator non-selectable `1/2` benchmark (`bridge-04-two-thirds-3`), `b = 6` / `b = 8` `360px` touch-target geometry (`bridge-06-three-eighths-8`), medium-support `1/6`-spaced sparse benchmarks (`bridge-07-one-third-med` / `bridge-08-five-sixths-med`), directional recovery (`at-endpoint`, `wrong-side-of-half`, `too-low-same-side`, `too-high-same-side`) + help toggle + view-switch preview preservation, and reduced-motion execution.
   - Responsive viewport layout measurements (`360x740`, `360x752`, `1366x768`, and `1093x614 @ DPR 1.25`) verifying zero horizontal overflow, `withinViewport: true` for prompt and controls, and strict bar-to-line endpoint alignment (`|Bar.left - Line.left| <= 1` and `|Bar.right - Line.right| <= 1`).
3. Implement failing-first witness seeds in `scripts/dev/run-route-matrix.js` under `--plan39-witness-seed <seed>`:
   - `misaligned-endpoints`: shifts number-line track horizontally relative to the reference bar and fails the endpoint alignment assertion.
   - `premature-target-leak`: marks or announces which candidate is the target during `locate` before submission and fails the non-leakage assertion.
   - `undersized-touch-target`: shrinks `b = 8` / `1/6`-spaced candidate hitboxes below `44px` at `360px` width and fails the visible geometry / touch-hitbox assertion.
   - `single-tap-auto-submit`: bypasses the two-step preview/confirm gate and fails the `locate` preview-before-submit assertion.
   - `coarse-bucket-sr-collapse`: collapses distinct linear candidate labels into identical bucket strings and fails the linear distinct-description assertion.
4. Capture representative screenshots and `plan39-viewport-measurements.json` under `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/`, restore any historical evidence files touched during full route-matrix runs, and write `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/progress.md`.

## Validation checklist

- [ ] Option A sequencing / §31 & §90 readiness confirmed and Requirement 0 proposal approved before any `src/` edits.
- [ ] All 8 curated bridge records materialize and validate through exact `src/math/` APIs with no per-item code branches, supporting both High (`partitioned`) and Medium (`sparse-benchmarks`) support modes.
- [ ] Bar and number-line endpoints align (`0` under left bar edge, `1` under right bar edge) and all interactive targets meet `>= 44x44px` without overlap at `360px` and `125%` zoom.
- [ ] Two-step selection (`propose-number-line-location`), two-input directional recovery (`classifyMagnitude(proposed)` + `classifyMagnitude(target)`), local help toggle, and preview preservation across view switches work cleanly.
- [ ] Historical replay schemas and all existing route rows pass without regression; the new sequential replay schema round-trips all 8 bridge items.
- [ ] All 5 `--plan39-witness-seed` falsification seeds fail their intended assertions and exit `0` under seed detection.
- [ ] Required report exists at `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/progress.md`.
- [ ] No unrelated files are modified; implementer does not flip packet status to `complete`.

## Implementer authority boundaries

- Do **not** flip packet `status` to `complete` or edit orchestrator/owner review dispositions.
- Do **not** declare the feature "complete," "ready to ship," or "done."
- Report against the objective with verifiable artifacts and geometry/route receipts, not proxy test counts.
- Follow the inherited advisor-consultation declaration and commit-discipline rules in `AGENTS.md`.
