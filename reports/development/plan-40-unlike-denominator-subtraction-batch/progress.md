# Plan 40: Unlike-Denominator Subtraction Recipes and Curated Batch
## Final Implementation & Verification Delivery Report (Stages 1–5 / Requirements 0–4)

**Date:** 2026-10-19  
**Author:** Implementer Thread (Plan 40)  
**Status:** Implementation Complete — Awaiting Orchestrator Review & Packet Closure  
**Commits:**
- Requirement 0 (Review & Authoring Baseline): `8a2ef30`
- Checkpoint 1 (Stages 1–2: Pure Foundation & Replay Oracles): `4eba2d2`
- Checkpoint 2 (Stages 3–4: Render Layer, App Shell, & Integration Tests): `4ceb507`
- Stage 5 (Requirement 4: Browser Route Matrix, Falsification Seeds, Viewport Evidence, & Delivery): *current commit*

---

## 1. Executive Summary

Plan 40 delivers the complete, production-ready, browser-verified implementation of unlike-denominator fraction takeaway subtraction across three reusable pedagogical task recipes:
- `construct-equivalent` (both operands renamed to common denominator)
- `inspect-keep-repair` (candidate equivalent fraction evaluated, repaired or kept)
- `identify-side-construct` (only one operand requires renaming to common denominator)

All deliverables across Stages 1 through 5 (Requirements 0 through 4) are fully implemented and verified:
1. **Stage 1 (Content Data & Catalog Registration):**
   - 9 curated vetted subtraction items + 2 unprompted data-only holdouts.
   - Catalog association sets (`unlike-subtraction-vetted-set@1` and `plan40-data-only-holdouts@1`).
   - Exact task context resolution (`resolvePlan40SubtractionRecipeContext`).
2. **Stage 2 (Interaction State Machine & Replay Oracles):**
   - Exact 12-rule transition table with explicit `submit-subtraction-result` at `operate`.
   - `scene.meaning.takeaway` isolation (`null` during `encounter`, `decide`, and `transform`; active during `operate` and `resolve`).
   - `fractionflow.episode-replay/v6` format with full initial/completed state roundtrips and backwards compatibility across v1–v5.
3. **Stage 3 (Render Layer & Visual/Linear Parity):**
   - Suppressed `compactTarget` at `encounter` for `identify-side-construct`.
   - Preserved completed `transform` milestones inside `renderCompletedBeats` when `scene.meaning.takeaway` is active at `operate`/`resolve`.
   - Takeaway fraction bar rendering with CSS hatching for removed segments and full access parity.
4. **Stage 4 (App Shell & Navigation Wiring):**
   - Registered `PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE` (`unlike-denominator-subtraction`) in `PLAN40_PRACTICE_TYPES_V9`.
   - Wired all 7 integration seams in `src/app/app.js`: canonical instance resolution, initial state creation, Option B focus choreography, subtraction help toggling at `operate`, replay button suppression during active subtraction operate/resolve, draft preservation across visual/linear view toggles, and help placement.
5. **Stage 5 (Browser Route Matrix, Falsification Seeds, & Responsive Evidence):**
   - Registered `plan40-unlike-subtraction` in `tests/routes/plan34-context-map.json`.
   - Appended 8 production route rows to `tests/routes/route-matrix.json` under `production-default-v7`.
   - Full browser route matrix executed: **81 route rows, 83 browser executions, 0 failures**.
   - Implemented 4 non-tautological falsification seeds in `scripts/dev/run-route-matrix.js`: each detected by standard route expectation assertions with exit code 0.
   - Captured representative responsive screenshots and viewport layout measurements confirming `horizontalOverflow === false` across all viewports.

---

## 2. Requirement-by-Requirement Implementation & Verification Table

| Requirement | Scope & Deliverables | Verification Command | Result |
|---|---|---|---|
| **Requirement 0**<br>Problem Catalog & Authoring Review | 11 authored records (9 vetted + 2 holdouts); verified LCM/subtraction invariants; authoring revisions pinned (`plan40-record-v1`). | Orchestrator Gate Review (`reports/development/plan-40-unlike-denominator-subtraction-batch/requirement-0-review.md`) | **Approved** (`8a2ef30`) |
| **Requirement 1**<br>Pure Foundation & Replay Invariants (Stages 1–2) | Content catalog records, interaction machine, scene takeaway projection, Replay v6 format with backward compatibility across v1–v5. | `node ./node_modules/vitest/vitest.mjs run tests/content-plan40-subtraction-recipes.test.js tests/interaction-plan40-subtraction-recipes.test.js tests/replay-plan40-v6-compatibility.test.js` | **Passed** (23/23 tests) |
| **Requirement 2**<br>Render Parity & Accessibility (Stage 3) | Visual & Linear renderers; suppressed encounter compact context for identify recipe; preserved transform milestones in completed beats; takeaway hatching. | `node ./node_modules/vitest/vitest.mjs run tests/render-plan40-subtraction-recipes.test.js` | **Passed** (6/6 tests) |
| **Requirement 3**<br>App Wiring & Interaction (Stage 4) | `unlike-denominator-subtraction` practice type; 7 seams in `src/app/app.js`; Option B focus; draft preservation across view toggle; leakage guard Invariant 10. | `node ./node_modules/vitest/vitest.mjs run tests/app-plan40-subtraction-recipes.test.js tests/leakage-invariants.test.js` | **Passed** (17/17 tests) |
| **Requirement 4**<br>Browser Route Matrix & Evidence (Stage 5) | 8 mounted browser routes; 4 falsification seeds; viewport measurements; contract test suite; Phase 3 Exit Assessment. | `node scripts/dev/run-route-matrix.js --filter ROUTE-PLAN40-`<br>`node ./node_modules/vitest/vitest.mjs run tests/routes-plan40-subtraction-recipes.test.js tests/route-contract.test.js` | **Passed** (8/8 routes, 32/32 tests) |

---

## 3. Browser Route Matrix Deliverables & Verification Receipts

### Route Matrix Declarations (`tests/routes/route-matrix.json` & `tests/routes/plan34-context-map.json`)
8 new production route rows were appended to `tests/routes/route-matrix.json` and mapped to `production-default-v7` in `tests/routes/plan34-context-map.json`:

| Route ID | Viewport | Motion Mode | Context | Verified Traversal Behavior |
|---|---|---|---|---|
| `ROUTE-PLAN40-UNLIKE-SUBTRACTION-HIGH-VISUAL-ALL` | 360x740 | standard | production-default-v7 | Complete full 9-item unlike subtraction sequence in visual view: encounter Next, transform conversions and candidate repairs, operate result submission, resolve Finish, gated Next problem advancement, exhaustion notice, return to entry, and re-entry. |
| `ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL` | 360x752 | reduced | production-default-v7 | Complete full 9-item sequence in linear view: linear transform, removal status without answer leak, operate submission, resolve Finish, gated Next, exhaustion, and re-entry under reduced motion. |
| `ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE` | 360x740 | standard | production-default-v7 | Deep witness on Item 1 (`1/2 - 1/5 = 5/10 - 2/10 = 3/10`): verifies visible takeaway track geometry, removed segments with `repeating-linear-gradient`, center hit tests, pre-resolution non-leakage, and exact difference submission (`3/10 is left.`). |
| `ROUTE-PLAN40-DEEP-SAMPLE-INSPECT-REPAIR` | 1366x768 | standard | production-default-v7 | Traverses items 1..3, deep witnesses Item 4 (`2/3 - 1/4 = 8/12 - 3/12 = 5/12`): repairs false candidate `5/12` to `8/12`, keeps valid candidate `3/12`, verifies takeaway track transition, and submits difference `5/12`. |
| `ROUTE-PLAN40-DEEP-SAMPLE-IDENTIFY-REDUCIBLE` | 360x752 | standard | production-default-v7 | Traverses items 1..6, deep witnesses Item 7 (`5/6 - 1/3 = 5/6 - 2/6 = 3/6`): verifies target context suppression at encounter, selects right side at decide, converts `1/3` to `2/6`, verifies replay button suppression at operate, submits simplified difference `1/2` (accepted without forced normalization), and verifies replay suppression at resolve. |
| `ROUTE-PLAN40-HELP-RECOVERY-VIEW-TOGGLE` | 360x740 | standard | production-default-v7 | Witnesses transform help toggle, operate view toggle draft preservation (visual → linear → visual), operate subtraction help toggle, wrong-answer recovery feedback (`Check the parts left. Try again.`), and correct submission. |
| `ROUTE-PLAN40-RESPONSIVE-VIEWPORTS` | 360x740 | standard | production-default-v7 | Responsive layout capture across encounter, transform, operate, help, and resolve beats with layout geometry assertions (`horizontalOverflow === false`). |
| `ROUTE-PLAN40-CHROMEBOOK-SCALED-VIEWPORT` | 1093x614 | standard | production-default-v7 | Chromebook CSS viewport (1366x768 at DPR 1.25) verifying full responsive layout containment and zero horizontal overflow. |

### Full Route Matrix Execution Result
- Command: `node scripts/dev/run-route-matrix.js`
- Route rows: **81 rows** (73 baseline + 8 Plan 40)
- Browser executions: **83 browser executions** (all passed)
- Known defects: **0**
- Failed: **0**
- Execution receipts recorded in `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-route-matrix-summary.json`.

---

## 4. Falsification Seeds Verification Receipts

Four independent, non-tautological falsification seeds were implemented in `scripts/dev/run-route-matrix.js` under `--plan40-witness-seed <seed>`.

In strict adherence to §2.2 of `checkpoint-2-review.md`, each seed mutates live DOM/CSS in the browser page *before* the route's standard expectation check runs, and is detected by the **normal route expectation assertion** (never by a synthetic `if (seed)` throw):

| Seed Key | DOM Mutation Mechanism | Target Normal Assertion | Exit Code | Detection Receipt |
|---|---|---|---|---|
| `erased-takeaway-hatch-after-transform` | Injects CSS removing `background-image` from `.fraction-bar-segment.removed` | `visibleGeometry` assertion for `.app-visual-view .fraction-bar-segment.removed` with `repeating-linear-gradient` | `0` | `intended assertion detected seed: erased-takeaway-hatch-after-transform; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" visible geometry assertion failed for ".app-visual-view .fraction-bar-segment.removed": found 2, expected at least 2 visible items of 10x20px with background image containing "repeating-linear-gradient" with a visible center hit; 2 were hidden, clipped, unpainted, undersized, or missing required paint.` |
| `addition-wording-in-subtraction` | Appends ` + ` into `.app-visual-view .active-beat-section` | `notContainsText` assertion for `+` | `0` | `intended assertion detected seed: addition-wording-in-subtraction; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-section" unexpectedly contains text "+".` |
| `premature-difference-leak` | Appends ` Difference: 3/10` into `.app-visual-view .active-beat-prompt` | `notContainsText` assertion for `Difference:` | `0` | `intended assertion detected seed: premature-difference-leak; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector ".app-visual-view .active-beat-section" unexpectedly contains text "Difference:".` |
| `missing-operate-fraction-inputs` | Replaces `.active-beat-controls` HTML with `<button class="control-btn">Finish</button>` (bypassing inputs) | `hasSelector` assertion for `#operate-fraction-numerator-input` | `0` | `intended assertion detected seed: missing-operate-fraction-inputs; Route "ROUTE-PLAN40-DEEP-SAMPLE-CONSTRUCT-OPERATE" assertion failed: selector "#operate-fraction-numerator-input" not found.` |

Every seed execution confirmed **1 intended seed failure detected** and **0 unintended failures**.

---

## 5. Responsive Viewport Measurements & Screenshot Evidence

Layout measurements were recorded in `reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-viewport-measurements.json` verifying zero horizontal overflow (`horizontalOverflow: false`), positive element geometry (`visible: true`), and full viewport containment:

| Viewport | Mode / Configuration | Measured Size | Horizontal Overflow | Prompt Visible | Controls Visible | Captured Evidence Files |
|---|---|---|---|---|---|---|
| **360x740** | Visual view, standard motion | 360 x 740 px | `false` | `true` | `true` | `encounter-360x740.png`<br>`transform-360x740.png`<br>`operate-hatch-360x740.png`<br>`help-360x740.png`<br>`resolve-360x740.png` |
| **360x752** | Linear view, reduced motion | 360 x 752 px | `false` | `true` | `true` | Measured in `ROUTE-PLAN40-UNLIKE-SUBTRACTION-MEDIUM-LINEAR-ALL` |
| **1366x768** | Visual wide, desktop | 1366 x 768 px | `false` | `true` | `true` | Measured in `ROUTE-PLAN40-DEEP-SAMPLE-INSPECT-REPAIR` |
| **1093x614** | Chromebook 125% zoom emulation | 1093 x 614 px | `false` | `true` | `true` | Measured in `ROUTE-PLAN40-CHROMEBOOK-SCALED-VIEWPORT` |

---

## 6. Replay Schema Parity (`fractionflow.episode-replay/v6`)

Plan 40 extends the deterministic Replay contract to `fractionflow.episode-replay/v6`:
- Supports both addition (`sum`) and subtraction (`takeaway`) semantic roles in episode metadata and records.
- Records exact learner submissions (`rawSubmittedForm`) and mathematical evaluations (`acceptedFraction`).
- Backwards compatibility: Replay v6 accepts and cleanly deserializes historical oracles from v1 (Plan 5), v2 (Plan 18), v3 (Plan 34), v4 (Plan 35), and v5 (Plan 38).
- Verified via `tests/replay-plan40-v6-compatibility.test.js`: all 11 Plan 40 items (9 vetted + 2 holdouts) roundtrip perfectly between initial and completed states.

---

## 7. Roadmap §31 / §90 Phase 3 Exit Assessment

With the completion and verification of Plan 40, the repository achieves the milestone defined in Roadmap §31 and §90 for **Phase 3: Proper-Fraction Addition and Subtraction Practice**:

### 7.1 Arithmetic Family Coverage
Phase 3 content families are now completely authored, vetted, rendered, and verified in both visual and linear paths:
1. **Like-Denominator Addition:** Plan 20 (`like-denominator-addition`, vetted set of like-unit additions).
2. **Unlike-Denominator Addition:**
   - *Nested Denominators:* Plan 18 & Plan 26 (`unlike-addition-vetted-set` with one-side conversion).
   - *Shared-Factor & Relatively-Prime Denominators:* Plan 34 & Plan 35 (`construct-equivalent`, `inspect-keep-repair`, `identify-side-construct` task patterns).
   - *Crossing One Whole:* Plan 17 & Plan 21 (sum exceeding one whole with overflow representation).
3. **Like-Denominator Subtraction:** Plan 38 (`like-denominator-subtraction`, 8 vetted items with takeaway model, zero-difference support, and simplified fraction acceptance).
4. **Unlike-Denominator Subtraction:** Plan 40 (`unlike-denominator-subtraction`, 9 vetted items spanning `construct`, `inspect`, and `identify` recipes across nested, shared-factor, and relatively-prime pairs).

### 7.2 Invariant & Architecture Compliance
- **Zero Math Leakage:** Scaffolds, prompts, headers, and linear status boxes never leak target denominators, remaining counts, or difference answers prior to resolution (verified by `tests/leakage-invariants.test.js` across all 10 invariants).
- **Access Parity & Calm Design:** All 9 items execute with full keyboard, touch, reduced-motion, and screen-reader accessibility parity across both Visual and Linear representations.
- **Exact Deterministic Arithmetic:** Zero floating-point arithmetic or AI in the math loop; exact `BigInt` fraction operations govern mathematical truth.
- **Static GitHub Pages Deployment:** Fully static local storage architecture with zero server dependencies or learner accounts.

### 7.3 Queued Option A Follow-Up
The exit of Phase 3 proper-fraction arithmetic clears the prerequisite path for **Plan 39**: *Number Line Locate and Fraction Bar Bridge Batch*. Plan 39 will introduce the first `0`-to-`1` number-line representation, providing coordinate-based fraction location and a dual-representation bridge connecting discrete bar partitions to continuous measurement coordinates.

---

## 8. Advisor Consultation Disposition

In accordance with `AGENTS.md` and repo consultation guidelines:
- **Capability Assessment:** Thread running on Google Antigravity / Gemini 2.0 Pro environment; advisor child spawning is not enabled for external model roles in this runtime configuration.
- **Disposition:** Degraded mode **Orchestrator-Gate-Only Review** is active. All stage deliverables have been reviewed at formal Checkpoint 1, Checkpoint 2, and Final Review gates.

---

## 9. Handoff & Guardrail Notice

In strict adherence to repository guardrails:
- **The implementer has NOT changed packet frontmatter `status` from `ready` to `complete`.** The packet remains at its valid schema state for orchestrator verification and packet acceptance.
- All historical route rows (73 rows / 75 executions) were preserved completely untouched; all touched historical evidence files were restored clean.
- All 8 Plan 40 subtraction routes, 4 falsification seeds, viewport measurements, contract tests, and evidence files are committed.
- The thread is stopped and ready for Orchestrator Verification and Packet Acceptance.
