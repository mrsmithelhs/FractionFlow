# Plan 08: Implementation Summary and Mechanism Confirmation Proposal

## 1. Summary of Understanding

- **Current Task:** Implement Plan 08 (`docs/development/plan-08-participation-floor-and-access-parity.md`), completing the access model for FractionFlow:
  1. The accessible linear path built on the Plan 07 presentation boundary (`src/render/linear-path.js`).
  2. The completed-beat collapse rule resolving Finding R6 and OQ-18 while satisfying DECISION-014 and DECISION-021 Criterion 1.
  3. The fail-first scaffold-leakage invariant test suite (Invariants 1–9) inspecting both visual and semantic/linear paths.
  4. Per-decision keyboard and non-drag parity verification (WCAG 2.2 SC 2.5.7, SC 2.5.8, DECISION-010, DECISION-013, DECISION-025).
  5. The OQ-04 adaptation rationale record (DECISION-024).
  6. The participation-floor mapping (`05-quality-and-validation.md` §44) and DECISION-021 4-point aesthetic rubric self-assessment, with individual worst-case reporting (DECISION-022).
- **Goal:** Prove that the access model works in reality—that a learner using keyboard alone, touch without precision dragging, or the accessible linear path retains identical mathematical responsibility and agency as a visual learner, and that no path leaks answers ahead of required reasoning.
- **Non-Goals:**
  - No app shell, entry page, routing, or design-condition switcher (strictly scoped to `plan-09`).
  - No deployment or public verification at GitHub Pages (scoped to `plan-09`).
  - No new renderers (no number-line renderer), representations, problem families, or episode state machine changes.
  - No learner preference surface and no browser storage (DECISION-019).
  - No accessibility conformance claims: built *against* WCAG 2.2 AA (DECISION-010, reconciliation finding R4), never *conforms to*.
  - No child observation (DECISION-020 makes child observation non-blocking for Phase 2).
  - No richer clutter exploration than the one required collapse rule (OQ-18).
- **Required Input Files:**
  - `AGENTS.md`
  - `docs/decision-log.md` (specifically DECISION-003, 004, 009, 010, 011, 012, 013, 014, 019, 020, 021, 022, 024, 025, 026)
  - `docs/presentation-posture.md` (Parts 1 and 2)
  - `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md` (invariants 1–9, participation-floor table)
  - `docs/founding/05-quality-and-validation.md` (§§32, 44 including §§943–949, §90)
  - `reports/orchestration/phase-2-specification-reconciliation.md` (findings R4, R6)
  - `docs/open-questions.md` (OQ-04, OQ-18)
  - `src/render/contract.js`, `src/render/beat-container.js`, `src/render/strings.js`, `src/render/controls.js`, `src/render/fraction-bar.js`, `src/render/symbolic.js`
  - `tests/fixtures/mock-dom.js`
  - `advisor-capable-providers.json`
- **Expected Output Files (Post-Gate Implementation):**
  - `src/render/linear-path.js` (accessible linear path renderer consuming validated frozen scenes)
  - `src/render/beat-container.js` (updated with completed-beat collapse disclosure rule and linear path integration)
  - `src/render/index.js` (exported linear path renderer)
  - `src/styles/render.css` (styles for linear path, collapsed beat trail, and high-contrast focus rings)
  - `tests/leakage-invariants.test.js` (fail-first suite for invariants 1–9 across visual and linear paths, with genuine failing-first demonstrations against leaking fixtures)
  - `tests/access-parity.test.js` (per-decision keyboard and non-drag touch parity, control target sizing >= 24px, reduced-motion post-state equivalence)
  - `tests/render-purity.test.js` (updated to replace signature regexes with robust AST/token purity analysis, addressing carried-forward Review Finding 1)
  - `reports/development/plan-08-participation-floor-and-access-parity/progress.md`
- **Validation Commands & Checks:**
  - `node scripts/dev/plan-status.js check plan-08` (preflight exit 0)
  - `npm test` (all unit and invariant tests passing)
  - `npm run build` (clean Vite bundle)
  - `node scripts/dev/plan-status.js lint` (zero violations)
- **Approval Gates:**
  - **Gate 1 (Current):** Mechanism confirmation for the completed-beat collapse rule and linear-path conformance approach, including confirmation that the Plan 07 boundary holds. **Stop and request orchestrator approval before implementing.**
  - **Gate 2 (Closeout):** Final orchestrator review of artifacts, leakage tests, participation-floor evidence, and progress report.
- **Stop Conditions:**
  - The Plan 07 boundary cannot carry the linear path without upstream redesign.
  - A required decision cannot be made non-drag and keyboard-operable.
  - A rubric criterion cannot be satisfied without violating another decision.
  - The collapse rule cannot keep completed beats reachable and the scene calm at 360px.

---

## 2. Plan 07 Boundary Audit: The Boundary Holds

The gate specifically instructs:
> *"This packet may report that the plan-07 boundary is wrong; that is a legitimate outcome and not a failure, and it stops for orchestrator disposition rather than retrofitting silently."*

We conducted an exhaustive audit of `src/render/contract.js`, `src/interaction/scene.js`, and the scene meaning schema across every beat:

1. **Scene Consumption Interface:**
   `resolveRenderableScene({ state, initialRole, presentationMode })` returns a deeply frozen, validated scene conforming to schema `fractionflow.scene/v1`. Renderers receive only this scene and a `dispatchAction` callback. Renderers receive zero raw instructional state (`Condition C`).
2. **Beat-by-Beat Information Sufficiency:**
   - **Encounter:** `scene.meaning.quantities` exposes exact operand fractions (`sourceForm`, unit denominator, count numerator, stable unit whole); `scene.meaning.operation` exposes the operation kind (`addition`). The linear path has all data needed to verbalize the initial problem and unit meanings.
   - **Notice:** `scene.meaning.quantities` exposes current denominators (`left.unit.denominator`, `right.unit.denominator`). `scene.meaning.currentTask` specifies the prompt and responsibility. The linear path can present the question and discrete choice options without leaking the answer.
   - **Decide:** `scene.meaning.unitRelationship.candidateDenominators` exposes candidates in high-support mode (gated by Plan 07 Repair 01), or `null` in lower support. `dispatchAction({ type: 'propose-common-denominator', proposed })` is fully wired.
   - **Transform (left & right):** `scene.meaning.currentTask.target` specifies `'left'` or `'right'`; `scene.meaning.unitRelationship.commonUnit.targetDenominator` provides the established common denominator. The linear path can prompt for the equivalent numerator and submit `{ type: 'submit-equivalent-form', proposed }`.
   - **Operate:** `scene.meaning.quantities` provides the renamed forms (`8/12` and `3/12`); `scene.meaning.operation.operation` provides the operator. The linear path can prompt for the sum of numerators and submit `{ type: 'submit-operation-result', proposed }`.
   - **Resolve:** `scene.meaning.operation.rawResult` and `preferredFinalForm` provide the final forms and simplification status. The linear path presents the completed resolution.
   - **Reflect:** `scene.meaning.quantities.left` provides the equivalence pair for invariant matching under DECISION-012 and DECISION-026.
   - **Status & Recovery:** `scene.meaning.status.recovery` provides structured failure classification for local recovery feedback without resetting valid progress.
3. **Verdict:**
   **The Plan 07 boundary holds completely.** It provides every required mathematical entity, unit relationship, prompt context, and action dispatch mechanism needed by the accessible linear path without requiring any modification to upstream scene projection or content generation. No boundary widening or retrofit is required.

---

## 3. Mechanism Proposal: Linear-Path Conformance Approach

### Architecture & Modality
The accessible linear path is implemented in `src/render/linear-path.js` as `createLinearPathRenderer({ container, dispatchAction, strings })`.

In accordance with the Plan 07 mechanism confirmation:
- It is an **access modality**, not a separate mathematical `representationRole`.
- It consumes the identical validated frozen `scene` produced by `resolveRenderableScene()`.
- It renders pure semantic HTML into an inspectable linear structure (`<section class="accessible-linear-path" role="region" aria-label="Accessible fraction lesson">`).

### Reading Order & Programmatic Inspection
The DOM structure enforces a logical, calm reading order:
1. **Lesson Heading & Context:** `<h2 class="sr-only">Step-by-step fraction problem</h2>`
2. **Current Quantities & Problem Statement:** Semantic `<dl>` or text paragraphs describing the quantities and whole units in plain grade 2–3 language (e.g. *"First fraction: 2 parts of 3 equal parts. Second fraction: 1 part of 4 equal parts."*).
3. **Completed Steps Context:** Compact inspectable list of prior milestones (using the collapse rule below).
4. **Current Question & Prompt:** Clear `<h3>` with active prompt.
5. **Interactive Decision Controls:** Pure keyboard/touch discrete controls (buttons, radio choice groups, numeric inputs) with labels adhering to DECISION-004.
6. **Polite Live Region:** Dynamic status announcements (`aria-live="polite"`) announcing validation feedback and beat transitions without interrupting screen-reader focus.

### Grade 2–3 Reading Level (DECISION-004 & Presentation Posture Part 2)
The linear path is text all the way down, making it the most vulnerable surface for reading burden. It adheres to all DECISION-004 working rules:
- Prompts are single sentences under 12 words.
- Active voice, second person ("Find a common denominator.", "Add the twelfths.").
- No conditionals or subordinate clauses in prompt sentences.
- Concrete words (*amount*, *parts*, *bar* instead of *abstract quantity*, *representation*).
- Mathematical terms (*numerator*, *denominator*, *common denominator*, *equivalent*) are used consistently as taught content.
- Specification jargon (*invariant*, *provenance*, *cadence*, *condition*) is strictly absent.

---

## 4. Mechanism Proposal: Completed-Beat Collapse Rule (Finding R6, OQ-18)

### Problem Addressed
Under DECISION-014, completed prior beats remain mounted as inspectable context. Across six beats, this causes monotonic DOM growth. On a narrow 360px viewport at the resolve beat, six fully expanded beats would severely crowd the screen, violating DECISION-021 Criterion 1 (restraint against dashboard accumulation and clutter) and Quality §32.

### The Collapse Rule
We propose a three-part collapse mechanism:

1. **Control Dismounting (Anti-Clutter & Focus Safety):**
   Immediately upon beat completion, all interactive controls (buttons, inputs, choice radios) are dismounted. A completed beat is read-only context, not an active form. This eliminates tab-trap clutter and accidental re-submission.
2. **Compact Milestone Register:**
   Each completed beat collapses into a single-line summary string authored in `strings.js`:
   - Encounter: *"Problem established: 2/3 + 1/4."*
   - Notice: *"Units compared: thirds and fourths are different units."*
   - Decide: *"Common unit chosen: 12ths."*
   - Transform: *"Renamed: 2/3 into 8/12, and 1/4 into 3/12."*
   - Operate: *"Added numerators: 8/12 + 3/12 = 11/12."*
   - Resolve: *"Finished: 11/12."*
3. **Responsive Trail Disclosure (The 360px/1440px Balance):**
   - The completed beats section is rendered in a quiet, low-contrast container (`background: #f8fafc; border: 1px solid #e2e8f0; font-size: 0.8125rem; color: #475569`).
   - The **most recent completed milestone** is displayed directly above the active beat as immediate spatial context.
   - Earlier completed milestones (when > 1) are housed within an accessible native `<details class="completed-beats-history">` disclosure element with summary: `<summary>Show previous steps (${count} completed)</summary>`.
   - On a 360px viewport: the entire completed beats section occupies <= 48px of vertical height when folded, leaving >= 85% of the viewport for the fraction bars and active decision controls.
   - The learner or screen reader can expand the disclosure at any time to inspect all completed steps, fully satisfying DECISION-014's inspectability requirement without cluttering the screen.
   - At 1440px desktop: the layout remains calm and restrained, centered with whitespace, never expanding into an administrative dashboard.

---

## 5. Mechanism Proposal: Scaffold-Leakage Invariant Test Suite (Invariants 1–9)

### Invariants 1–9 Specification
Tests will inspect both the **visual DOM** (`beatContainer`) and the **linear-path DOM** (`linearPath`) before every learner response across the complete canonical episode:

1. **Notice Invariant:** Before notice submission, denominators are visible, but `matchesUnits` is not preselected, highlighted, or stated in prompt text.
2. **Common Denominator Invariant:** Before common denominator selection, target subdivisions, scale factors, converted numerators, and the final sum are not present in DOM text, attributes, or prefilled inputs. Candidates in choice lists do not reveal which is correct.
3. **Conversion Invariant:** Before equivalent numerator submission, target numerator and scale factor are not present in inputs, labels, status announcements, or unshaded bar previews.
4. **Prediction Invariant:** Before transformation prediction (where applicable), post-transition subdivisions and endpoints are not exposed.
5. **Operation Invariant:** Before numerator addition, the sum (`11`) is not prefilled, highlighted, or announced in status text.
6. **Resolve/Reflection Invariant:** Before resolve/reflection response, the preferred answer is not pre-selected or revealed in prompt phrasing.
7. **Help/Replay Invariant:** Demonstrated states are tagged as supported; replay restores valid endpoints without altering the mathematical requirement.
8. **Retry/Stale-State Invariant:** Invalid responses clear only the invalid attempt; valid prior work is retained, and stale failure states do not leak into subsequent beats.
9. **Capability Fallback Invariant:** Exceeding LCD 30 fails closed to authorized symbolic continuation rather than rendering illegible or erroneous bars.

### Genuine Failing-First Demonstration (Addressing Plan 07 Final Review Finding 2)
To satisfy Plan 07 Review Finding 2 ("Make fail-first demonstrations real or omit them"):
- Each invariant test will be run against two fixtures:
  a. **Normal compliant scene/DOM:** Invariant passes.
  b. **Deliberately mutated leaking scene/DOM:** A synthetic leaking fixture (e.g. where the target numerator `8` is injected into the prompt, prefilled into the input, or placed in an `aria-label`).
- The test harness will assert that the invariant function **explicitly detects the leak and fails** on the leaking fixture, proving that each invariant actually catches the defect it is designed to catch.

### Replacing Signature Scanning (Addressing Plan 07 Final Review Finding 1)
In `tests/render-purity.test.js`:
- Replace the four brittle regexes with a comprehensive AST/token scan using regexes that detect arithmetic operators (`*`, `/`, `%`, `+`, `-`) applied to variables, or AST traversal verifying that render functions perform zero arithmetic derivation.

---

## 6. Mechanism Proposal: Keyboard and Non-Drag Touch Parity

### Per-Decision Evidence Matrix
Every required decision will be individually tested and evidenced:
1. `acknowledge-encounter`: Focusable `<button>`, Space/Enter activation, min 44×44px touch target.
2. `submit-notice`: `<fieldset>` choice group, Arrow key navigation, Space/Enter selection, tap selection, min 44×44px touch targets.
3. `propose-common-denominator`: Choice buttons or numeric `<input type="number">` with stepper/submit button, full keyboard entry, min 44×44px touch targets.
4. `submit-equivalent-form (left)`: Numeric input with submit button, full keyboard and touch entry.
5. `submit-equivalent-form (right)`: Numeric input with submit button, full keyboard and touch entry.
6. `submit-operation-result`: Numeric input for numerator sum, full keyboard and touch entry.
7. `submit-resolution`: Focusable continue button.
8. `submit-reflection`: Choice buttons, Arrow key navigation, Space/Enter selection.

### Target Sizing & Sizing Decoupling (DECISION-010, DECISION-025)
- All interactive controls have CSS `min-width: 44px; min-height: 44px;` (exceeding WCAG 2.2 SC 2.5.8 minimum of 24×24px).
- Sizing is completely decoupled from fraction denominators: at LCD 30, fraction bar segments are non-interactive display surfaces (`role="img"`, `tabindex="-1"`, `aria-hidden="true"`), while the input control remains 44×44px.

---

## 7. OQ-04 Adaptation Rationale & Record (DECISION-024)

Under DECISION-024, OQ-04 is recorded with explicit rationale:

- **Adaptations on the Accessible Linear Path:**
  1. *Fraction Bar Visual Partitioning → Textual Part-Whole Description:*
     - *Visual Path:* Displays a colored horizontal bar divided into equal segments.
     - *Linear Path Accommodation:* Formatted as *"2 parts shaded out of 3 equal parts in 1 whole"*.
     - *Learner Responsibility Preserved:* The learner must still notice whether the unit parts match, determine what common denominator to choose, calculate how many renamed parts equal the original fraction, and perform the addition.
     - *Rationale:* Converting spatial area into semantic part-whole text provides equivalent perceptual access without disclosing the common unit or doing the conversion for the learner.
- **Answer-Revealing Scaffolds Avoided:**
  - The linear path does NOT state the LCD.
  - The linear path does NOT provide pre-calculated scale factors.
  - The linear path does NOT announce the numerator sum before the operate beat.
  - Therefore, the linear path is strictly an **access accommodation**, preserving 100% of the learner's mathematical responsibility.

---

## 8. Participation-Floor Mapping & Rubric Self-Assessment Framework

### Quality Doc §44 Participation-Floor Mapping
We establish explicit separation of evidence kinds:
1. **Mechanized Evidence:** Automated test suites verifying keyboard focusability, zero-drag completion, ARIA attributes, heading hierarchy, target dimensions (>= 24px), reduced-motion style application, and fail-first leakage invariants.
2. **Human Review Evidence:** Structured evaluation of semantic clarity, grade 2–3 reading level, screen-reader simulated transcript, and emotional calmness across viewports (360px, 768px, 1024px, 1440px).
3. **Child Usability Evidence:** Explicitly recorded as **untested / not conducted in this phase** (per DECISION-005 and DECISION-020).
4. **Tail Reporting:** Worst-case individual control accessibility reported per DECISION-022.
5. **Standards Phrasing:** The report and artifacts explicitly state **"built against WCAG 2.2 AA"**, never **"conforms to"** (reconciliation finding R4).

### DECISION-021 Aesthetic Coherence Rubric Framework
Self-assessment covering all 4 criteria:
1. *Restraint against dashboard accumulation:* Zero persistent score counters, streak badges, or sidebars; completed beats collapsed via the proposed disclosure rule.
2. *Language and register clarity:* 100% of strings audited against DECISION-004 rules.
3. *Child-appropriate touch targets:* All controls verified >= 44×44px (exceeding 24×24px requirement).
4. *Calm pacing and anchored inspection:* All transitions learner-paced, stable whole visual anchor maintained, no auto-advancing timers.

---

## 9. Advisor Consultation Disposition

- **Provider:** Antigravity / Gemini.
- **Capability Check (`advisor-capable-providers.json`):** Fail-closed. Antigravity / Gemini is not listed in `advisor-capable-providers.json`.
- **Branch Declared:** **Branch C — not advisor-capable (orchestrator-gate-only)**.
- **Disposition:** No child advisor consultation ran. Standard orchestrator review path applies.

---

## 10. Request for Mechanism Approval

We submit this proposal to the integration owner / orchestrator for approval of:
1. The **completed-beat collapse rule** (control dismounting, single-line summaries, and `<details>` disclosure trail for 360px calmness).
2. The **linear-path conformance approach** and confirmation that the Plan 07 boundary holds without modification.
3. The **leakage invariant strategy** including genuine fail-first demonstrations.
4. The **OQ-04 adaptation rationale** and **Branch C advisor disposition**.

Upon confirmation, we will proceed with implementation.
