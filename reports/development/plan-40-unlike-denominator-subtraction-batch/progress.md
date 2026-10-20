# Plan 40: Unlike-Denominator Subtraction Recipes and Curated Batch
## Consolidated Delivery & Repair 01 Verification Report (Stages 1–5 / Requirements 0–4)

**Date:** 2026-10-20<br>
**Author:** Implementer Thread (Plan 40 Repair 01)<br>
**Lifecycle Status:** `delivered` (preflight check reports `BLOCKED: plan-40 has status "delivered"`, which is expected and authorized for repair under `repair-01-brief.md`; status is reserved for orchestrator verification).<br>
**Commits:**
- Initial Implementation & Stages 1–5 Baseline: `d9465b5`
- Repair 01 (Delivery Evidence, Concise Rendering, & Test Invariants): `dab636c`
- Repair 01 Report & Delivery Summary: *current commit*

---

## 1. Executive Summary & Repair 01 Overview

Plan 40 delivers the complete, browser-verified implementation of unlike-denominator fraction takeaway subtraction across three reusable pedagogical task recipes:
- `construct-equivalent` (both operands renamed to common denominator)
- `inspect-keep-repair` (candidate equivalent fraction evaluated, repaired or kept)
- `identify-side-construct` (only one operand requires renaming to common denominator)

Following the orchestrator's Stage 5 independent technical review (`orchestration-stage5-review.md`) and repair authorization brief (`repair-01-brief.md`), the implementation completed **Plan 40 Repair 01**, resolving all seven required items in a single consolidated repair:
1. **Viewport checks & saved evidence:** Implemented Plan 40 post-scroll question and control containment/intersection checks with documented 1.0px rounding tolerance, document dimensions, horizontal overflow in pixels (`horizontalOverflowPx === 0.00`), and measured DPR. Captured representative screenshots and measurements across all 4 target configurations: 360×740, 360×752 (linear path), 1366×768 (desktop largest admitted target 30 case), and 1093×614 @ DPR 1.25 (Chromebook).
2. **Values, lifecycle, & help witnesses:** Replaced existence-only assertions at both view switches with actual numerator and denominator values (`3` and `10`). Asserted fresh first-item identity (`1/2 - 1/5`) and cleared draft/work/help/recovery on re-entry. Added a mounted help sequence covering open, close, reopen, wrong submission while open, repeated wrong submission, close, and reopen after recovery with cue, button label, and `aria-expanded` agreement.
3. **Answer-leak sensitivity & seed invariants:** Derived prohibited result from exact core (`3/10`), seeded bare numeric notation without the word `Difference`, and verified the clean assertion rejects it (`unexpectedly contains text "3/10"`). Enforced the seed-run invariant in `runRouteMatrix` requiring exactly one intended detection, zero unintended failures, and exactly one route execution. Persisted separate clean and seed receipts.
4. **Data-only holdout rendering:** Ran both existing holdouts (`plan40-holdout-construct-half-third-6` and `plan40-holdout-inspect-three-fourths-one-sixth-12`) through visual and linear renderers across all beats under applicable configurations.
5. **Historical replay state comparison:** Verified full serialized reconstructed states match all 24 frozen v4/v5 oracle `expectedState` fixtures across all keys (16 v5 cases + 8 v4 cases).
6. **Bounded readability refinement:** Shortened visible operation input labels to `Numerator` and `Denominator` while retaining complete accessible names (`Numerator of amount left` / `Denominator of amount left`). Omitted redundant visible `Difference:` milestone in completed beats at resolve while preserving equation, prompt (`... is left.`), and inspectable history.
7. **Truthful delivery & Phase 3 exit assessment:** Documented actual artifacts, exact state field names, truthful measurements, honest browser vs physical/assistive claims, and framed Roadmap §31/§90 as an evidence synthesis and recommended owner disposition with retained obligations.

---

## 2. Requirement-by-Requirement Implementation & Verification Table

| Requirement | Scope & Deliverables | Verification Command | Result |
|---|---|---|---|
| **Requirement 0**<br>Problem Catalog & Authoring Review | 11 authored records (9 vetted + 2 holdouts); verified LCM/subtraction invariants; authoring revisions pinned (`plan40-record-v1`). | Orchestrator Gate Review (`reports/development/plan-40-unlike-denominator-subtraction-batch/requirement-0-review.md`) | **Approved** (`8a2ef30`) |
| **Requirement 1**<br>Pure Foundation & Replay Invariants (Stages 1–2) | Content catalog records, interaction machine, scene takeaway projection, Replay v6 format with backward compatibility across v1–v5 and full serialized state equality for 24 frozen oracles. | `npm test -- tests/content-plan40-subtraction-recipes.test.js tests/interaction-plan40-subtraction-recipes.test.js tests/replay-plan40-v6-compatibility.test.js` | **Passed** (23/23 tests) |
| **Requirement 2**<br>Render Parity & Readability (Stage 3) | Visual & Linear renderers; concise visible labels with complete accessible names; omitted redundant visible Difference milestone at resolve; takeaway hatching; data-only holdout rendering across visual/linear journeys. | `npm test -- tests/render-plan40-subtraction-recipes.test.js` | **Passed** (8/8 tests) |
| **Requirement 3**<br>App Wiring & Lifecycle (Stage 4) | `unlike-denominator-subtraction` practice type; 7 seams in `src/app/app.js`; Option B focus; draft values preserved across view toggle; mounted help lifecycle sequence; leakage guard Invariant 10. | `npm test -- tests/app-plan40-subtraction-recipes.test.js tests/leakage-invariants.test.js` | **Passed** (17/17 tests) |
| **Requirement 4**<br>Browser Route Matrix & Evidence (Stage 5) | 8 mounted browser routes; 4 falsification seeds with bare leak sensitivity; seed-run invariants; 8 viewport measurements across 4 viewports; contract test suite; Roadmap §31/§90 exit assessment. | `node scripts/dev/run-route-matrix.js`<br>`npm test -- tests/routes-plan40-subtraction-recipes.test.js tests/route-contract.test.js` | **Passed** (83/83 executions, 35/35 tests) |

---

## 3. Browser Route Matrix Deliverables & Verification Receipts

### Route Matrix Declarations (`tests/routes/route-matrix.json` & `tests/routes/plan34-context-map.json`)
Eight production route rows are registered in `tests/routes/route-matrix.json` and mapped to `production-default-v7` in `tests/routes/plan34-context-map.json`:

| Route ID | Viewport | Motion Mode | Context | Verified Traversal Behavior |
|---|---|---|---|---|
| `ROUTE-PLAN40-UNLIKE-SUBTRACTION-HIGH-VISUAL-ALL` | 360x740 | standard | production-default-v7 | Complete full 9-item unlike subtraction sequence in visual view: encounter Next, transform conversions and candidate repairs, operate result submission, resolve Finish, gated Next problem advancement, exhaustion notice, return to entry, and re-entry verifying fresh first-item identity (`1/2 - 1/5`) and cleared state. |
| `ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL` | 360x752 | reduced | production-default-v7 | Complete full 9-item sequence in linear view: linear transform, removal status without answer leak, operate layout measurement (`linear-operate-360x752.png`), operate submission, resolve Finish, gated Next, exhaustion, and re-entry under reduced motion. |
| `ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE` | 360x740 | standard | production-default-v7 | Deep witness on Item 1 (`1/2 - 1/5 = 5/10 - 2/10 = 3/10`): verifies visible takeaway track geometry, removed segments with `repeating-linear-gradient`, center hit tests, pre-resolution non-leakage (bare `3/10` check in prompt and section), and exact difference submission (`3/10 is left.`). |
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

Four independent, non-tautological falsification seeds are implemented in `scripts/dev/run-route-matrix.js` under `--plan40-witness-seed <seed>`.

Each seed mutates live DOM/CSS in the browser page *before* the route's standard expectation check runs, and is detected by the **normal route expectation assertion** (never by a synthetic throw inside the runner):

| Seed Key | DOM Mutation Mechanism | Target Normal Assertion | Invariant Enforced | Exit Code | Detection Receipt |
|---|---|---|---|---|---|
| `erased-takeaway-hatch-after-transform` | Injects CSS removing `background-image` from `.fraction-bar-segment.removed` | `visibleGeometry` assertion for `.app-visual-view .fraction-bar-segment.removed` with `repeating-linear-gradient` | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: erased-takeaway-hatch-after-transform; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" visible geometry assertion failed for ".app-visual-view .fraction-bar-segment.removed": found 2, expected at least 2 visible items of 10x20px with background image containing "repeating-linear-gradient" with a visible center hit; 2 were hidden, clipped, unpainted, undersized, or missing required paint.` |
| `addition-wording-in-subtraction` | Appends ` + ` into `.app-visual-view .active-beat-section` | `notContainsText` assertion for `+` | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: addition-wording-in-subtraction; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-section" unexpectedly contains text "+".` |
| `premature-difference-leak` | Injects bare ` 3/10` (no word `Difference`) into `.app-visual-view .active-beat-prompt` | `notContainsText` assertion for `3/10` in prompt and section | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: premature-difference-leak; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-prompt" unexpectedly contains text "3/10".` |
| `missing-operate-fraction-inputs` | Replaces `.active-beat-controls` HTML with `<button class="control-btn">Finish</button>` (bypassing inputs) | `hasSelector` assertion for `#operate-fraction-numerator-input` | 1 detection, 0 failed, 1 execution | `0` | `intended assertion detected seed: missing-operate-fraction-inputs; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector "#operate-fraction-numerator-input" not found.` |

Separate seed receipts are persisted on disk:
- `plan40-seed-erased-takeaway-hatch-after-transform-summary.json`
- `plan40-seed-addition-wording-in-subtraction-summary.json`
- `plan40-seed-premature-difference-leak-summary.json`
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
2. **Visual Density on Small Viewports:** For larger denominators (such as target 30 on item 6), rendering 30 discrete segments on a 360px mobile viewport results in thin individual segments (~7–10px width). The diagonal hatch pattern provides clear removal cues, but approaches the practical readability boundary for discrete bar models.
3. **Repeated Instruction vs. Calm Design:** As noted in Repair 01, displaying repeated descriptive labels (`Numerator of amount left` / `Denominator of amount left`) across multi-line inputs created visual clutter. Consolidating visible labels to concise terms (`Numerator` / `Denominator`) while preserving complete accessible names accessibly resolved this friction without losing native access.
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
- **Capability Assessment:** Thread running on Google Antigravity / Gemini 2.0 Pro environment; advisor child spawning is not enabled for external model roles in this runtime configuration.
- **Disposition:** Degraded mode **Orchestrator-Gate-Only Review** is active. All stage deliverables have been reviewed at formal Checkpoint 1, Checkpoint 2, Stage 5 review, and Repair 01 review gates.

---

## 9. Handoff & Guardrail Notice

In strict adherence to repository guardrails:
- **Packet frontmatter `status` remains `delivered`** (preflight status `delivered` is authorized for repair; status mutation remains an orchestrator privilege).
- All 73 historical route rows (75 browser executions) were preserved completely untouched; all touched historical evidence directories were restored clean.
- All 8 Plan 40 subtraction routes, 4 falsification seeds, 8 viewport measurements, contract tests, and evidence files are committed.
- Scoped implementation commit: `dab636c`.
- The thread is stopped and ready for Orchestrator Technical Re-Review and Owner Acceptance.
