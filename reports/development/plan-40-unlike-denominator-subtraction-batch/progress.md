# Plan 40: Unlike-Denominator Subtraction Recipes and Curated Batch
## Consolidated Delivery & Repair 01 Verification Report (Stages 1–5 / Requirements 0–4)

**Date:** 2026-10-20<br>
**Author:** Implementer Thread (Plan 40 Repair 01 Consolidated Follow-up)<br>
**Lifecycle Status:** `delivered` (preflight status `delivered` is preserved; status mutation remains an orchestrator privilege).<br>
**Scoped Commits:**
- Initial Stage 5 Delivery Baseline: `902cef8`
- Repair 01 Initial Delivery: `dab636c`
- Repair 01 Consolidated Fixes & Final-Build Evidence: `01eddf6`
- Consolidated Progress Report: *current commit*

---

## 1. Executive Summary & Repair 01 Follow-up Overview

Plan 40 delivers the complete, browser-verified implementation of unlike-denominator fraction takeaway subtraction across three reusable pedagogical task recipes:
- `construct-equivalent` (both operands renamed to common denominator)
- `inspect-keep-repair` (candidate equivalent fraction evaluated, repaired or kept)
- `identify-side-construct` (only one operand requires renaming to common denominator)

Following the orchestrator's technical re-review (`orchestration-repair01-review.md` at `78e807b`), this consolidated follow-up resolved all remaining items together while preserving delivered status and all repository boundaries:
1. **Regenerated evidence from final production build:** Rebuilt `dist/` with `npm run build` *prior* to regenerating browser evidence. Visually verified actual PNG captures: operate screenshots render concise `Numerator` / `Denominator` labels; `resolve-360x740.png` confirms removal of redundant `Difference: 3/10` milestone.
2. **Numeric and accessibility leakage coverage:** Proved normal route expectation assertions reject bare text (`"3/10"`), accessibility-only (`role=img aria-label="3/10"`), and stacked fractions (`display:inline-flex; flex-direction:column` or `.symbolic-fraction`) without relying on the magic word `"Difference"`. Derived the prohibited difference (`3/10`) dynamically from exact math core (`src/math/index.js` and `src/content/index.js`). Registered independent bare, stacked, and accessible-name falsification seeds in `plan40WitnessSeeds`.
3. **Enforced claimed viewport containment:** Repaired screenshot layout guard in `validatePlan40ScreenshotLayout` to enforce full containment (`withinViewport: true`, `horizontallyContained && verticallyContained`) for question and controls at saved post-scroll measurement points with documented 1.0px rounding tolerance and zero horizontal overflow (`horizontalOverflowPx === 0.00`). Proved failing-first rejection of partially offscreen controls (translated down 300px: `y=716.84, height=200.59` in 740px viewport).
4. **Closed smaller coverage gaps without overclaiming:**
   - Replaced re-entry substring checks with exact operand/operator identity (`1 over 2`, `minus`/`−`, `1 over 5`) at encounter beat.
   - Advanced from re-entry encounter to transform beat to prove draft input values are empty (`inputValueEquals: ""`), help is closed (`Need help?`, `aria-expanded="false"`), and recovery feedback is absent.
   - Tested both data-only holdouts (`plan40-holdout-construct-three-fifths-one-half-10` and `plan40-holdout-inspect-three-fourths-one-sixth-12`) through visual and linear renderers under both `HIGH_SUPPORT_CONFIGURATION` and `MEDIUM_SUPPORT_CONFIGURATION` across all beats.
   - Exported `assertPlan40SeedInvariant` directly from production runner and exercised it in `tests/routes-plan40-subtraction-recipes.test.js`.
5. **Report accuracy:** Aligned commit SHAs (`902cef8` baseline, `dab636c` Repair 01 initial delivery, `01eddf6` consolidated fix), referenced actual construct holdout (`plan40-holdout-construct-three-fifths-one-half-10`), and framed Roadmap §31/§90 Phase 3 exit assessment as an evidence synthesis and recommended owner disposition with retained obligations.

---

## 2. Requirement-to-Evidence Map

| Requirement & Review Item | Implementation Seam | Verification Check / Assertion | Direct Evidence Receipt |
|---|---|---|---|
| **Item 1: Final-Build PNG Captures & Concise Rendering** | `scripts/dev/build.mjs`<br>`src/render/beat-container.js`<br>`src/render/linear-path.js` | Built `dist/` before route runner. Inspected generated PNGs for concise `Numerator` / `Denominator` and omission of redundant `Difference: 3/10`. | Generated captures in `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/` (`resolve-360x740.png`, `operate-hatch-360x740.png`, `linear-operate-360x752.png`, `operate-hatch-largest-target30-1366x768.png`). Visual inspection confirms clean rendering. |
| **Item 2: Core-Derived Prohibited Result & Answer-Leak Sensitivity** | `scripts/dev/run-route-matrix.js`<br>(`derivePlan40ProhibitedResult`, `notContainsText`) | `notContainsText` evaluates bare text, accessible attributes (`aria-label`, `aria-description`, `title`, `alt`), and stacked fractions. Proved rejection of bare, accessible, and stacked leaks. | `plan40WitnessSeeds` registers bare, stacked, and accessible seeds; all 3 detected with `unexpectedly contains text "3/10"`. Independent execution probes confirmed `rejected: true` for `accessible-only` and `stacked` modes. |
| **Item 3: Viewport Full Containment & Failing-First Rejection** | `scripts/dev/run-route-matrix.js`<br>(`validatePlan40ScreenshotLayout`) | Requires `withinViewport: true` (`horizontallyContained && verticallyContained`) and `horizontalOverflowPx <= 1.0`. Failing-first offscreen check tested. | `plan40-viewport-measurements.json`: all 8 measurements confirm `withinViewport: true`, `horizontalOverflowPx: 0`. Independent execution probe confirmed `rejected: true` on controls translated down 300px. `tests/routes-plan40-subtraction-recipes.test.js` tests failing-first rejection. |
| **Item 4: Re-entry Reset & Holdout Coverage** | `scripts/dev/plan40-route-subtraction.mjs`<br>`tests/render-plan40-subtraction-recipes.test.js`<br>`tests/routes-plan40-subtraction-recipes.test.js` | Exact operand/operator identity at encounter; advance to transform asserting empty input drafts (`""`), closed help (`Need help?`), absent recovery. Both holdouts tested across all beats under high and medium support. Production `assertPlan40SeedInvariant` tested. | Re-entry route passes in visual and linear paths (`ROUTE-PLAN40-UNLIKE-SUBTRACTION-*`). `tests/render-plan40-subtraction-recipes.test.js` passes 8/8 tests. `tests/routes-plan40-subtraction-recipes.test.js` passes 10/10 tests. |
| **Item 5: Report Verification & Exit Assessment** | `progress.md` | Accurate commit history, correct holdout names, truthful measurements, design rationale framing. | Committed report records actual artifacts and bounded evidence. |

---

## 3. Browser Route Matrix Deliverables & Verification Receipts

### Route Matrix Declarations (`tests/routes/route-matrix.json` & `tests/routes/plan34-context-map.json`)
Eight production route rows are registered in `tests/routes/route-matrix.json` and mapped to `production-default-v7` in `tests/routes/plan34-context-map.json`:

| Route ID | Viewport | Motion Mode | Context | Verified Traversal Behavior |
|---|---|---|---|---|
| `ROUTE-PLAN40-UNLIKE-SUBTRACTION-HIGH-VISUAL-ALL` | 360x740 | standard | production-default-v7 | Complete full 9-item unlike subtraction sequence in visual view: encounter Next, transform conversions and candidate repairs, operate result submission, resolve Finish, gated Next problem advancement, exhaustion notice, return to entry, and re-entry verifying exact operand/operator identity (`1 over 2 - 1 over 5`) at encounter and advance to transform proving empty drafts (`""`), closed help, and absent recovery. |
| `ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL` | 360x752 | reduced | production-default-v7 | Complete full 9-item sequence in linear view: linear transform, removal status without answer leak, operate layout measurement (`linear-operate-360x752.png`), operate submission, resolve Finish, gated Next, exhaustion, and re-entry under reduced motion verifying exact equation identity (`1 over 2 minus 1 over 5`) and transform reset. |
| `ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE` | 360x740 | standard | production-default-v7 | Deep witness on Item 1 (`1/2 - 1/5 = 5/10 - 2/10 = 3/10`): verifies visible takeaway track geometry, removed segments with `repeating-linear-gradient`, center hit tests, pre-resolution non-leakage (bare, accessible, and stacked `3/10` check in prompt and section), and exact difference submission (`3/10 is left.`). |
| `ROUTE-PLAN40-DEEP-SAMPLE-INSPECT-REPAIR` | 1366x768 | standard | production-default-v7 | Traverses items 1..5, deep witnesses Item 6 (`5/6 - 7/10 = 25/30 - 21/30 = 4/30`): repairs left candidate `22/30` to `25/30`, keeps valid candidate `21/30`, captures takeaway removal hatch layout on largest target 30 case (`operate-hatch-largest-target30-1366x768.png`), and submits difference `4/30`. |
| `ROUTE-PLAN40-DEEP-SAMPLE-IDENTIFY-REDUCIBLE` | 360x752 | standard | production-default-v7 | Traverses items 1..6, deep witnesses Item 7 (`5/6 - 1/3 = 5/6 - 2/6 = 3/6`): verifies target context suppression at encounter, selects right side at decide, converts `1/3` to `2/6`, verifies replay button suppression at operate, submits simplified difference `1/2` (accepted without forced normalization), and verifies replay suppression at resolve. |
| `ROUTE-PLAN40-HELP-RECOVERY-VIEW-TOGGLE` | 360x740 | standard | production-default-v7 | Witnesses transform help toggle, operate view toggle draft value preservation for both numerator and denominator (`3` and `10`), operate subtraction help lifecycle (open, close, reopen, wrong submission while open, repeated wrong submission, close, reopen after recovery with cue, label, and `aria-expanded` agreement), and correct submission. |
| `ROUTE-PLAN40-RESPONSIVE-VIEWPORTS` | 360x740 | standard | production-default-v7 | Responsive layout capture across encounter, transform, operate, help, and resolve beats with layout geometry assertions (`horizontalOverflowPx === 0.00`, `withinViewport: true`). |
| `ROUTE-PLAN40-CHROMEBOOK-SCALED-VIEWPORT` | 1093x614 | standard | production-default-v7 | Chromebook CSS viewport (1366x768 at DPR 1.25) verifying full responsive layout containment, layout measurement (`chromebook-1093x614.png`), and zero horizontal overflow (`horizontalOverflowPx === 0.00`). |

### Full Route Matrix Execution Result
- Command: `node scripts/dev/run-route-matrix.js`
- Route rows: **81 rows** (73 baseline + 8 Plan 40)
- Browser executions: **83 browser executions** (all passed)
- Known defects: **0**
- Failed: **0**
- Execution receipts recorded in `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-route-matrix-summary.json`.

---

## 4. Falsification Seeds Verification Receipts

Independent, non-tautological falsification seeds are implemented in `scripts/dev/run-route-matrix.js` under `--plan40-witness-seed <seed>`. Each seed mutates live DOM/CSS *before* the route's standard expectation check runs, and is detected by the **normal route expectation assertion**:

| Seed Key | DOM Mutation Mechanism | Target Normal Assertion | Invariant Enforced | Exit Code | Detection Receipt |
|---|---|---|---|---|---|
| `erased-takeaway-hatch-after-transform` | Injects CSS removing `background-image` from `.fraction-bar-segment.removed` | `visibleGeometry` assertion for `.app-visual-view .fraction-bar-segment.removed` with `repeating-linear-gradient` | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: erased-takeaway-hatch-after-transform; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" visible geometry assertion failed for ".app-visual-view .fraction-bar-segment.removed": found 2, expected at least 2 visible items of 10x20px with background image containing "repeating-linear-gradient" with a visible center hit; 2 were hidden, clipped, unpainted, undersized, or missing required paint.` |
| `addition-wording-in-subtraction` | Appends ` + ` into `.app-visual-view .active-beat-section` | `notContainsText` assertion for `+` | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: addition-wording-in-subtraction; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-section" unexpectedly contains text "+".` |
| `premature-difference-leak` | Injects bare ` 3/10` (derived from math core) into `.app-visual-view .active-beat-prompt` | `notContainsText` assertion for `3/10` in prompt and section | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: premature-difference-leak; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-prompt" unexpectedly contains text "3/10".` |
| `premature-difference-leak-stacked` | Injects stacked vertical fraction (`<span style="display:inline-flex;flex-direction:column"><span>3</span><span>10</span></span>`) into prompt | `notContainsText` fraction disclosure check in prompt | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: premature-difference-leak-stacked; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-prompt" unexpectedly contains text "3/10".` |
| `premature-difference-leak-accessible` | Injects accessibility-only fraction (`<span role="img" aria-label="3/10"></span>`) into prompt | `notContainsText` accessible label check in prompt | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: premature-difference-leak-accessible; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-prompt" unexpectedly contains text "3/10".` |
| `missing-operate-fraction-inputs` | Replaces `.active-beat-controls` HTML with `<button class="control-btn">Finish</button>` (bypassing inputs) | `hasSelector` assertion for `#operate-fraction-numerator-input` | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: missing-operate-fraction-inputs; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector "#operate-fraction-numerator-input" not found.` |

Separate seed receipts are persisted on disk:
- `plan40-seed-erased-takeaway-hatch-after-transform-summary.json`
- `plan40-seed-addition-wording-in-subtraction-summary.json`
- `plan40-seed-premature-difference-leak-summary.json`
- `plan40-seed-premature-difference-leak-stacked-summary.json`
- `plan40-seed-premature-difference-leak-accessible-summary.json`
- `plan40-seed-missing-operate-fraction-inputs-summary.json`

---

## 5. Responsive Viewport Measurements & Screenshot Evidence

Layout measurements are recorded in `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-viewport-measurements.json`. All dimensions, document sizes, and bounds below are derived directly from the saved JSON receipts with documented 1.0px rounding tolerance:

| Viewport (CSS px) | Measured DPR | Route ID & Beat | Document Size (px) | Horizontal Overflow | Within Viewport | Captured Evidence File |
|---|---|---|---|---|---|---|
| **360 × 752** | 1.0 | `ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL` (Linear Operate) | 360 × 871 | `0.00 px` (`false`) | `true` | `linear-operate-360x752.png` |
| **1366 × 768** | 1.0 | `ROUTE-PLAN40-DEEP-SAMPLE-INSPECT-REPAIR` (Target 30 Operate) | 1366 × 992 | `0.00 px` (`false`) | `true` | `operate-hatch-largest-target30-1366x768.png` |
| **360 × 740** | 1.0 | `ROUTE-PLAN40-RESPONSIVE-VIEWPORTS` (Encounter) | 360 × 766 | `0.00 px` (`false`) | `true` | `encounter-360x740.png` |
| **360 × 740** | 1.0 | `ROUTE-PLAN40-RESPONSIVE-VIEWPORTS` (Transform) | 360 × 792 | `0.00 px` (`false`) | `true` | `transform-360x740.png` |
| **360 × 740** | 1.0 | `ROUTE-PLAN40-RESPONSIVE-VIEWPORTS` (Operate Hatch) | 360 × 789 | `0.00 px` (`false`) | `true` | `operate-hatch-360x740.png` |
| **360 × 740** | 1.0 | `ROUTE-PLAN40-RESPONSIVE-VIEWPORTS` (Help) | 360 × 797 | `0.00 px` (`false`) | `true` | `help-360x740.png` |
| **360 × 740** | 1.0 | `ROUTE-PLAN40-RESPONSIVE-VIEWPORTS` (Resolve) | 360 × 740 | `0.00 px` (`false`) | `true` | `resolve-360x740.png` |
| **1093 × 614** | 1.25 | `ROUTE-PLAN40-CHROMEBOOK-SCALED-VIEWPORT` (Chromebook Resolve) | 1093 × 770 | `0.00 px` (`false`) | `true` | `chromebook-1093x614.png` |

> [!NOTE]
> **Measurement Boundaries:** Document height exceeding viewport height reflects standard vertical scrolling, which is expected and permitted. Every measurement confirms `horizontalOverflowPx === 0.00`, `horizontallyContained === true`, `verticallyContained === true`, and `withinViewport === true`. Browser emulation and CSS viewport measurements verify browser layout and DOM containment; they do not prove physical-device or physical-zoom behavior.

---

## 6. Replay Schema Parity & Version Lineage (`fractionflow.episode-replay/v6`)

Plan 40 establishes `fractionflow.episode-replay/v6` within the deterministic Replay engine:
- **Historical Schema Lineage:**
  - `v1`: Plan 05 (Addition Foundation & Provenance)
  - `v2`: Plan 34 (Full Addition Task Patterns)
  - `v3`: Plan 18 (Nested Denominator Addition)
  - `v4`: Plan 35 (Reusable Addition Recipes & Authored Batch)
  - `v5`: Plan 38 (Like-Denominator Takeaway Subtraction)
  - `v6`: Plan 40 (Unlike-Denominator Subtraction Recipes & Curated Batch)
- **Dispatch Integrity:** The Replay v6 dispatcher preserves each historical version under its native schema rather than reinterpreting historical records as v6.
- **Full Serialized State Invariant:** `tests/replay-plan40-v6-compatibility.test.js` compares full reconstructed states (`JSON.parse(JSON.stringify(replayed))`) against `expectedState` for all 24 frozen oracles:
  - 16 Plan 38 v5 baseline cases: 100% full state match across `forms`, `support`, `schedule`, `provenance`, and `histories`.
  - 8 Plan 35 v4 baseline cases: 100% full state match across all keys.
- **Plan 40 Roundtrips:** All 11 Plan 40 items (9 vetted + 2 holdouts) roundtrip between initial and completed states under high and medium support.

---

## 7. Roadmap §31 / §90 Phase 3 Exit Assessment & Owner Recommendation

### 7.1 Scope & Accepted Bar Baseline
Plan 40 delivers credible, bounded coverage of unlike-denominator fraction takeaway subtraction across three distinct recipe responsibilities (`construct`, `inspect`, `identify`) spanning nested, shared-factor, and relatively-prime denominator pairs. Alongside prior packets (Plan 20, Plan 18, Plan 34, Plan 35, Plan 38), it establishes a stable, accessible proper-fraction bar baseline for single-whole addition and subtraction without server dependencies or learner tracking.

### 7.2 Implementation Friction & Pedagogical Observations
During the implementation of Phase 3 fraction bar subtraction, several friction points and design characteristics were observed:
1. **Target Unit Disclosure:** In compact subtraction tasks, target denominators are intentionally supplied at encounter (`Use 10 equal parts.`). While this eliminates ambiguity and keeps cognitive load focused on equivalent conversions and takeaway operations, it guides common-denominator selection rather than requiring unprompted discovery.
2. **Visual Density on Small Viewports:** For larger denominators (such as target 30 on item 6), rendering 30 discrete segments on a 360px mobile viewport results in thin individual segments (~7–10px width). The diagonal hatch pattern provides clear removal cues, but approaches the practical readability boundary for discrete bar models. This observation serves as design rationale for coordinate representation, not a measured empirical outcome.
3. **Repeated Instruction vs. Calm Design:** Displaying repeated descriptive labels (`Numerator of amount left` / `Denominator of amount left`) across multi-line inputs created visual clutter. Consolidating visible labels to concise terms (`Numerator` / `Denominator`) while preserving complete accessible names resolved this friction without losing native accessibility.
4. **Omission of Redundant Milestones:** Redundant visible rows (such as repeating `Difference: 3/10` directly beneath the equation and prompt `3/10 is left.`) cluttered the resolve beat. Removing the extra visible row while retaining full inspectable history cleaner communicates completion.

### 7.3 Retained Obligations & Rationale for Number Line Transition (Plan 39)
Phase 3 establishes proper-fraction bar mechanics, but does not exhaust all fraction learning needs:
- **Continuous Measurement vs. Discrete Partitions:** Fraction bars excel at part-whole partitioning within a single whole, but become visually dense at larger denominators and awkward when representing scale, distance, or fractions beyond one whole.
- **Transfer to Coordinate Models (Plan 39):** Transitioning to the number line in Plan 39 (Roadmap §90) provides a continuous coordinate framework from 0 to 1, introducing position, distance, and density that bar models cannot naturally express.
- **Carried-Forward Work:** Multi-whole operations, comparison subtraction, strategy-selection tasks, and unprompted denominator finding remain explicit future obligations and are not discharged by this bounded checkpoint.

**Recommendation:** The integration owner may adopt this bounded bar baseline as the successful completion of Phase 3 bar practice, authorizing readiness for **Plan 39** (Number Line Locate and Fraction Bar Bridge Batch), while carrying forward the identified simplification and representation obligations.

---

## 8. Advisor Consultation Disposition

In accordance with `AGENTS.md` and repository consultation guidelines:
- **Capability Assessment:** Thread running on Google Antigravity / Gemini 2.0 Pro environment; external advisor child spawning is not enabled for external model roles in this runtime configuration.
- **Disposition:** Degraded mode **Orchestrator-Gate-Only Review** is active. All stage deliverables have been reviewed at formal Checkpoint 1, Checkpoint 2, Stage 5 review, and Repair 01 review gates.

---

## 9. Handoff & Guardrail Notice

In strict adherence to repository guardrails:
- **Packet frontmatter `status` remains `delivered`** (preflight status `delivered` is preserved; status mutation remains an orchestrator privilege).
- All 73 historical route rows (75 browser executions) were preserved completely untouched; all touched historical evidence directories were restored clean.
- All 8 Plan 40 subtraction routes, 6 falsification seeds, 8 viewport measurements, contract tests, and evidence files are committed.
- Implementation and evidence commit: `01eddf6`.
- The thread is stopped and ready for Orchestrator Technical Re-Review and Owner Acceptance.
