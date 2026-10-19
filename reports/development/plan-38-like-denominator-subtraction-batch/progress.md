# Plan 38: Like-Denominator Takeaway Subtraction Batch
## Final Implementation & Verification Delivery Report (Stages 1–6)

**Date:** 2026-10-18  
**Author:** Implementer Thread (Plan 38)  
**Status:** Complete — Orchestrator Verified & Owner Accepted  
**Commits:**
- Checkpoint 1 (Pure Foundation, Stages 1–3): `98c61e3`
- Checkpoint 2 (Render Components, Scoped CSS, & App Integration, Stages 4–5): `241964a`
- Checkpoint 3 (Route Matrix, Falsification Seeds, Viewport Captures, & Delivery, Stage 6): `2db8a69`

---

## 1. Executive Summary

Plan 38 delivers the complete, production-ready, browser-based implementation of the 8 like-denominator fraction takeaway subtraction practice items specified in Plan 36.

All deliverables across Stages 1 through 6 are fully implemented and verified:
1. **Stage 1 (Content & Fixtures):** Scoped subtraction profile (`plan36-subtraction-review`), 8 deterministic records (`PLAN36_SUBTRACTION_RECORDS`), task context validation, and curated authored fixtures.
2. **Stage 2 (Interaction State Machine & Schedule):** 3-beat frozen schedule (`encounter → operate → resolve`), Replay v5 schema with `takeaway` role and answer withholding, and exact subtraction operation evaluation with raw/submitted form provenance.
3. **Stage 3 (Scene Model & Projection):** Truthful scene model with `takeaway` projection, cell partition classification (`starting`, `remaining`, `removed`, `outside-start`), and zero leakage of difference or counts prior to resolution.
4. **Stage 4 (Render Components & Scoped CSS):** Dedicated takeaway fraction bar (`createTakeawayBar`) with SVG/CSS hatching for removed parts, fieldset-grouped fraction response inputs with zero-numerator support, linear path removal status during operate, and localized instructional strings.
5. **Stage 5 (App Integration & Focus Choreography):** Vetted practice type registration in `src/app/practice-types.js` (`like-denominator-subtraction`), draft preservation across visual/linear toggles, local help cues, replay suppression, and focus routing.
6. **Stage 6 (Browser Route Matrix, Falsification Seeds, & Viewport Captures):**
   - Added 8 production routes to `tests/routes/route-matrix.json` and `tests/routes/plan34-context-map.json` under `production-default-v7`.
   - Full route matrix: **73 route rows, 75 browser executions, 0 failures**.
   - Implemented 5 falsification seeds in `scripts/dev/run-route-matrix.js`: all 5 seeds successfully detected by intended assertions with exit code 0.
   - Captured responsive screenshots and layout metrics for 360x740, 360x752, 1366x768, and 125% zoom emulation (1093x614 at DPR 1.25). Zero horizontal overflow measured across all configurations.

---

## 2. Part 1 Review Refinements (Applied at Checkpoint 3 Start & Refined at Acceptance)

Before executing Stage 6 browser verification, all three refinements requested in the Checkpoint 2 review were implemented, and subsequently refined upon owner screenshot review (see Section 9):

1. **Linear-Path Removal Status & Context-Specific Resolve Prompt (`src/render/linear-path.js`, `src/render/beat-container.js`, & `src/render/strings.js`):**
   - Added `strings.subtraction.removalStatus(rightNum, leftNum, den)` (`"${rightNum}/${den} is taken away from ${leftNum}/${den}."`) rendered in `.linear-takeaway-removal-status` during `operate` only (`removalStatus === 'marked' && !accepted`), and omitted `.linear-takeaway-unit-context` (`"One whole, ${d} equal parts"`).
   - Updated `strings.subtraction.thatAmountLeft(num, den)` (`"${num}/${den} is left."`) so the `resolve` prompt in both Visual and Linear views displays the learner's accepted fraction form.
   - Verified that pre-resolution strings never leak the remaining numerator or answer count.

2. **Full Help-Toggle & Repeated Wrong Answer Sequence (`tests/plan38-rendered-subtraction.test.js` & `tests/routes/route-matrix.json`):**
   - Expanded unit and route tests to verify the exact 7-step sequence:
     `open help → close help → reopen help → submit wrong answer → submit identical wrong answer → close help → reopen help`
   - Verified that error recovery feedback (`Check the parts left. Try again.`), help cue visibility, and input focus remain properly synchronized in both visual and linear views.

3. **Single `role="img"` on Container (`src/render/fraction-bar.js` & `src/styles/render.css`):**
   - Removed redundant `role="img"` and `aria-label` from `.fraction-bar-takeaway-track`, keeping a single `role="img"` with descriptive `aria-label` on `.fraction-bar-takeaway-container`.
   - Added `display: block;` to `.fraction-bar-takeaway-container` in `src/styles/render.css` to ensure full CSS visibility and accessibility parity.

---

## 3. Stage 6 Browser Route Matrix Deliverables

### Route Matrix Integration
8 new production route rows were appended to `tests/routes/route-matrix.json` and mapped to `production-default-v7` in `tests/routes/plan34-context-map.json`:

| Route ID | Viewport | Motion Mode | Context | Verified Traversal Behavior |
|---|---|---|---|---|
| `ROUTE-PLAN38-SUBTRACTION-HIGH-VISUAL-ALL-8` | 360x740 | standard | production-default-v7 | Complete 8-item sequence in visual view: encounter Take away, operate submission, resolve Finish, gated Next, exhaustion return, and re-entry. |
| `ROUTE-PLAN38-SUBTRACTION-MEDIUM-LINEAR-ALL-8` | 360x752 | reduced | production-default-v7 | Complete 8-item sequence in linear view: non-visual removal status during operate, keyboard/pointer response, resolve Finish, gated Next, exhaustion, and re-entry. |
| `ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE` | 360x740 | standard | production-default-v7 | Advance to item 6 (`6/9 - 6/9 = 0/9`), verify visible hatching geometry, center hit tests, pre-resolution non-leakage, and zero result submission (`0/9 is left.`). |
| `ROUTE-PLAN38-DEEP-SAMPLE-REDUCIBLE-DIFFERENCE` | 360x740 | standard | production-default-v7 | Advance to item 3 (`7/10 - 3/10`), verify linear removal status (`3/10 is taken away from 7/10.`), submit simplified fraction `2/5` (`2/5 is left.`), verify acceptance without forced normalization. |
| `ROUTE-PLAN38-HELP-TOGGLE-REPEATED-ERROR` | 360x740 | standard | production-default-v7 | Execute open help → close help → reopen help → wrong answer → identical wrong answer → close → reopen sequence in browser. |
| `ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION` | 360x740 | standard | production-default-v7 | Fill draft `3/8` in visual view, toggle to linear view, verify draft preserved, edit to `1/4`, toggle back to visual view, verify draft preserved. |
| `ROUTE-PLAN38-REDUCED-MOTION-NO-ANIMATION` | 360x740 | reduced | production-default-v7 | Verify that takeaway removal marking under reduced motion runs zero CSS/WAAPI animations. |
| `ROUTE-PLAN38-RESPONSIVE-VIEWPORTS` | 360x740 | standard | production-default-v7 | Measure layout geometry, verify zero horizontal overflow, and capture encounter, operate, help, and resolve screenshots. |

### Full Route Matrix Execution Result
- Command: `node scripts/dev/run-route-matrix.js`
- Route rows: **73 rows** (65 baseline + 8 Plan 38)
- Executions: **75 browser executions** (all passed)
- Known defects: **0**
- Failed: **0**
- Execution receipts recorded in `reports/development/plan-38-like-denominator-subtraction-batch/evidence/plan38-route-matrix-summary.json`.

---

## 4. Falsification Seeds Verification Receipts

Five independent falsification seeds were added to `scripts/dev/run-route-matrix.js` under `--plan38-witness-seed <seed>`. Each was run in isolation to confirm fail-closed detection by the intended assertion:

| Seed Key | Description / Mutation | Target Assertion / Failure Substring | Exit Code | Detection Receipt |
|---|---|---|---|---|
| `erased-removal-marks` | Removes `repeating-linear-gradient` hatch pattern from removed segments | `with background image containing "repeating-linear-gradient"` | `0` | `intended assertion detected seed: erased-removal-marks; Route "ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE" visible geometry assertion failed for ".app-visual-view .fraction-bar-segment.removed"` |
| `clipped-takeaway-bar` | Applies `clip-path: inset(100%) !important` to `.fraction-bar-takeaway-track` | `visible geometry assertion failed for ".app-visual-view .fraction-bar-takeaway-track"` | `0` | `intended assertion detected seed: clipped-takeaway-bar; Route "ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE" visible geometry assertion failed for ".app-visual-view .fraction-bar-takeaway-track"` |
| `premature-answer-leak` | Injects premature answer label `"0/9 is left."` before learner submission | `selector ".app-visual-view .active-beat-prompt" unexpectedly contains text "0/9 is left."` | `0` | `intended assertion detected seed: premature-answer-leak; Route "ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE" assertion failed: selector ".app-visual-view .active-beat-prompt" unexpectedly contains text "0/9 is left."` |
| `addition-semantics` | Injects addition operator `+` into the active beat section | `selector ".app-visual-view .active-beat-section" unexpectedly contains text "+"` | `0` | `intended assertion detected seed: addition-semantics; Route "ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE" assertion failed: selector ".app-visual-view .active-beat-section" unexpectedly contains text "+"` |
| `action-as-answer` | Bypasses learner fraction entry after `Take away` by replacing `.active-beat-controls` with a premature `Finish` button (removing `#operate-fraction-numerator-input`) | `selector "#operate-fraction-numerator-input" not found.` | `0` | `intended assertion detected seed: action-as-answer; Route "ROUTE-PLAN38-DEEP-SAMPLE-ZERO-DIFFERENCE" assertion failed: selector "#operate-fraction-numerator-input" not found.` |

---

## 5. Responsive Viewport Measurements & Screenshot Evidence

Layout measurements were captured using `scripts/dev/capture-plan38-subtraction-evidence.mjs` and verified against zero horizontal overflow (`horizontalOverflow: false`), positive element boxes (`visible: true`), and full viewport containment (`withinViewport: true` and `intersectsViewport: true`):

| Viewport | Mode / Configuration | Measured Document Size | Horizontal Overflow | Prompt Within Viewport | Controls Within Viewport | Captured Evidence Files |
|---|---|---|---|---|---|---|
| **360x740** | Visual view, standard motion | 360 x 740 px | `false` | `true` | `true` | `encounter-360x740.png`<br>`operate-hatch-360x740.png`<br>`help-360x740.png`<br>`resolve-360x740.png` |
| **360x752** | Linear view, reduced motion | 360 x 752 px | `false` | `true` | `true` | `linear-encounter-360x752.png`<br>`linear-operate-360x752.png`<br>`linear-help-360x752.png`<br>`linear-resolve-360x752.png` |
| **1366x768** | Visual wide, desktop Chromebook | 1366 x 768 px | `false` | `true` | `true` | `wide-encounter-1366x768.png`<br>`wide-operate-1366x768.png` |
| **1093x614 @ DPR 1.25** | 125% zoom emulation | 1093 x 614 px | `false` | `true` | `true` | `zoom-operate-1093x614-dpr125.png` |

All measurements (`visible`, `intersectsViewport`, `withinViewport`) and bounding box geometries are persisted in `reports/development/plan-38-like-denominator-subtraction-batch/evidence/plan38-viewport-measurements.json`.

---

## 6. Comprehensive Verification Summary

| Verification Command | Scope | Result | Details |
|---|---|---|---|
| `cmd.exe /c "npm test"` | Entire test suite | **Passed** | 47 test files passed, 439 tests passed, 0 failures |
| `cmd.exe /c "npx vitest run tests/route-contract.test.js"` | Route matrix schema & contract | **Passed** | 26 tests passed, 0 failures |
| `cmd.exe /c "npm run build"` | Production distribution build | **Passed** | Vite built app bundle (325.95 kB js / 20.85 kB css) with 0 errors |
| `node scripts/dev/run-route-matrix.js` | Complete browser route matrix | **Passed** | 73 route rows, 75 executions, 75 passed, 0 failed |
| `node scripts/dev/run-route-matrix.js --plan38-witness-seed <seed>` | 5 falsification seeds | **Passed** | All 5 seeds detected with exit code 0 |
| `node scripts/dev/capture-plan38-subtraction-evidence.mjs` | Viewports & zoom captures | **Passed** | 11 measurements and screenshots captured |
| `node scripts/dev/plan-status.js lint` | Packet schema & frontmatter | **Passed** | Lint OK, 0 violations |
| `node scripts/dev/plan-status.js check plan-38` | Packet state | **Passed** | RUNNABLE (prior to completion) |

---

## 7. Advisor Consultation Disposition

**Branch C — not advisor-capable (fail-closed, orchestrator-gate-only review)**

- **Step 1 Capability Check:** Per `AGENTS.md` and the Implementer Starting Prompt, this thread consulted `advisor-capable-providers.json`. The active provider environment is not listed as advisor-capable. Under the required fail-closed rule, this thread treats itself as not advisor-capable.
- **Mode Selected:** Branch C (orchestrator-gate-only review).
- **Declaration:** No autonomous advisor consultation ran for Plan 38 Checkpoint 3. The orchestrator review gate applies to this complete delivery.

---

## 8. Handoff & Guardrail Notice

In strict adherence to repository guardrails:
- **The implementer has NOT changed packet frontmatter `status` to `complete`.** The packet remains at its valid schema state for orchestrator review.
- All historical route matrix rows, reports, and contexts were preserved untouched.
- All 8 Plan 38 subtraction routes and 5 falsification seeds are committed and verified.
- The thread is stopped and ready for Orchestrator Verification and Packet Acceptance.

---

## 9. Orchestrator Verification, Owner Copy Refinements, & Acceptance Record

- **Date:** 2026-10-18
- **Reviewer:** Orchestrator (with Owner screenshot review & copy approval)
- **Owner Screenshot Review & Copy Refinements Applied:**
  Following inspection of the Stage 6 evidence captures (specifically `linear-resolve-360x752.png`), the owner approved three copy/presentation refinements, which were applied directly and re-verified across unit tests, browser routes, falsification seeds, and recaptured screenshots:
  1. **Removed `.linear-takeaway-unit-context` (`"One whole, ${d} equal parts"`):** Removed from `src/render/linear-path.js` and `src/render/strings.js` so the Linear ("Read the steps") context box displays the symbolic expression cleanly without distracting partition-count prose.
  2. **Non-visual Linear removal status during `operate` only:** Replaced `"The amount 2/8 is marked as removed from the starting amount."` (which implied a visual mark not shown in the Linear view and lingered into `resolve`) with **`"${rightNum}/${den} is taken away from ${leftNum}/${den}."`**, rendered only during `operate` (`removalStatus === 'marked' && !accepted`) and omitted at `resolve` once the full equation (`5/8 − 2/8 = 3/8`) is displayed.
  3. **Context-specific `resolve` prompt (`"${num}/${den} is left."`):** Replaced the static `"That amount is left."` prompt at `resolve` in both Visual (`src/render/beat-container.js`) and Linear (`src/render/linear-path.js`) views with the learner's accepted fraction form (`"${accepted.numerator}/${accepted.denominator} is left."`, e.g., `"3/8 is left."`, `"2/5 is left."`, `"0/9 is left."`, `"0/1 is left."`).
- **Verification Receipts Post-Refinement:**
  - `cmd.exe /d /s /c "npm test"`: 47 test files, 439 tests passed.
  - `cmd.exe /d /s /c "npm run build"`: Both main and subtraction prototype builds succeeded with 0 errors.
  - `node scripts/dev/run-route-matrix.js --plan38-witness-seed=premature-answer-leak`: Exit 0 (seed detected on `"0/9 is left."` leak and all 75 route executions passed).
  - `node scripts/dev/capture-plan38-subtraction-evidence.mjs`: All 11 responsive/zoom screenshots and `plan38-viewport-measurements.json` recaptured and visually verified (`linear-resolve-360x752.png`, `linear-operate-360x752.png`, `linear-encounter-360x752.png`, `resolve-360x740.png`).
- **Packet Status Disposition:** Marked `complete` via `node scripts/dev/plan-status.js set plan-38 complete`.

