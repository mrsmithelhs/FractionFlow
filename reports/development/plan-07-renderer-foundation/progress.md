# Plan 07 Progress Report — Renderer Foundation and Learner-Facing Strings

**Report date:** 2026-09-19  
**Packet status:** unchanged; remains `in-progress` and is owned by orchestration  
**Ready for orchestrator review:** yes  

---

## 1. Summary

Implemented the renderer foundation in `src/render/` and presentation styles in `src/styles/` as approved in `reports/development/plan-07-renderer-foundation/mechanism-approval.md` (commit `9554f02`). 

The implementation:
1. Establishes the shared scene-consumption boundary (`src/render/contract.js`) that enforces renderer purity (renderers receive only deeply frozen scenes and zero instructional state; Condition C) and data-driven role switching driven strictly by `refusal.continuation.representationRole` (Condition D).
2. Centralizes all learner-facing copy into `src/render/strings.js` adhering to Grade 2–3 reading level working rules, zero specification jargon, parameterized `validLeast(den)` (Condition A), and full support for both DECISION-012 visual matching with distractors and DECISION-026 check-the-premise tasks (Condition B).
3. Provides a display-only fraction-bar renderer (`src/render/fraction-bar.js`) strictly conforming to DECISION-025 (bar segments are non-interactive display surfaces; no click/tap/tabindex on segments).
4. Provides a truthful symbolic notation renderer (`src/render/symbolic.js`) that never displays false stable equality (Quality doc §68).
5. Provides discrete, non-drag interactive controls (`src/render/controls.js`) designed against WCAG 2.2 AA (SC 2.5.7 non-drag, SC 2.5.8 minimum target size ≥ 24×24px, 44×44px default touch targets, decoupled from denominator per DECISION-025).
6. Provides a beat-gated mounting container (`src/render/beat-container.js`) strictly enforcing DECISION-014 (unreached beats and future values are never mounted in the DOM) and the completed-beat collapse rule (Finding R6, DECISION-021 criterion 1).
7. Adds comprehensive automated contract suites in `tests/render-strings.test.js`, `tests/render-purity.test.js`, and `tests/render-foundation.test.js`.

The implementation is built **against WCAG 2.2 AA** (reconciliation finding R4); no unevidenced conformance claims are made.

---

## 2. Approved Three-Path Boundary & How the Linear Path Was Accounted For

The three-path mechanism proposal was approved with four conditions in `mechanism-approval.md`. The core boundary principles:

1. **Category Distinction (Model vs. Modality)**:
   - Representation roles in `src/interaction/scene.js` (`fraction-bar`, `symbolic`, `number-line`) are mathematical models.
   - The accessible linear alternative is an **access modality / participation path** through which the active model is perceived.
   - Therefore, the linear path is a **renderer over the same scene**, not a separate representation role.
2. **Capability Inheritance**:
   - The linear renderer inherits the fraction-bar capability verdict because an ineligible fraction-bar path (LCD > 30 per DECISION-011) is an episode-level envelope boundary, not a per-learner lockout.
   - Sighted and assistive-technology learners transition to symbolic continuation together via the refusal's continuation data (`{ representationRole: 'symbolic', route: 'symbolic-continuation' }`), preserving identical mathematical responsibility (`05-quality-and-validation.md` §44).
3. **Condition C Resolution (State Purity)**:
   - The episode container validates the scene once via `resolveRenderableScene()` / `assertSceneCurrent()`.
   - Renderers receive **only** the returned fresh, deeply frozen `scene`. Renderers do not receive or hold episode state, preventing renderers from computing mathematical truth or eligibility.
4. **Condition D Resolution (Data-Driven Role Switch)**:
   - `resolveRenderableScene()` inspects `refusal.continuation?.representationRole`. When fraction-bar refuses due to presentation ceilings, it automatically re-projects for the named continuation role (`symbolic`) without container heuristics.

---

## 3. Module Map

```
src/render/
├── strings.js             # Centralized learner-facing copy catalog (DECISION-017, DECISION-023)
├── contract.js            # Shared boundary contract, scene resolution, and validation
├── controls.js            # Discrete, keyboard-operable, touch-accessible controls (>=24x24px, DECISION-010, 013)
├── fraction-bar.js        # Display-only fraction bar renderer (DECISION-025)
├── symbolic.js            # Pure symbolic notation renderer with truthful equality
├── beat-container.js      # Beat-gated mounting container and completed-beat collapse manager
└── index.js               # Render layer barrel export

src/styles/
└── render.css             # Presentation styles built against WCAG 2.2 AA

tests/
├── fixtures/
│   └── mock-dom.js        # Zero-dependency headless DOM fixture for testing
├── render-strings.test.js # String linting, register separation, reading level, Condition A & B
├── render-purity.test.js  # Purity by construction, determinism, Condition C scene boundaries
└── render-foundation.test.js # Beat mounting, anti-leakage, collapse rule, controls, reduced motion
```

---

## 4. Full Learner-Facing String Inventory

All learner-facing strings live in `src/render/strings.js`. No inline strings exist in components.

### Reviewable Inventory

| String Key / Path | String Content or Template | Working Rules / Posture Traceability |
|---|---|---|
| `encounter.prompt` | `"Look at these two fractions."` | Grade 2–3, 5 words, active voice. |
| `encounter.barAriaLabel(side, num, den)` | `"${side} fraction bar: ${num} of ${den} equal parts shaded."` | Descriptive accessible name; natural phrasing. |
| `encounter.wholeLabel` | `"1 whole"` | Concrete anchor. |
| `notice.prompt` | `"Do these two fractions have the same size parts?"` | Grade 2–3, 9 words, direct question. |
| `notice.options.same` | `"Yes, same size"` | Clear binary choice. |
| `notice.options.different` | `"No, different sizes"` | Clear binary choice. |
| `notice.feedbackDiff` | `"The parts are different sizes. We need a common unit."` | Humble feedback (Quality doc §16). |
| `notice.feedbackSame` | `"Look at the parts: one bar has thirds and one has fourths."` | Local orientation cue. |
| `decide.prompt` | `"Choose a common denominator for both fractions."` | Grade 2–3, 7 words, teaching term used with meaning. |
| `decide.optionAriaLabel(den)` | `"Common denominator ${den}"` | Accessible button label. |
| `decide.invalidDenominator(den)` | `"${den} is not a common denominator. Try another number."` | Humble error feedback, identifies broken idea. |
| `decide.validNonLeast(den)` | `"${den} works! Both fractions can use this denominator."` | Valid non-least acceptance without false error. |
| `decide.validLeast(den)` | `"${den} works! That is the smallest common denominator."` | **Condition A fixed:** Parameterized by `den`, never hardcoding 12. |
| `transform.prompt(side, den)` | `"Rename the ${side} fraction with ${den} equal parts."` | Active voice, concrete verb. |
| `transform.scaleFactorPrompt(mult)` | `"Multiply the top and bottom by ${mult}."` | Clear instruction. |
| `transform.equivalentNumeratorPrompt(den)` | `"How many of the ${den} equal parts are shaded?"` | Minor note addressed: natural phrasing, no awkward "${den}ths". |
| `transform.errorNumerator` | `"Count the shaded parts in the new bar and try again."` | Local feedback; preserves established denominator. |
| `transform.errorScaleFactor` | `"Check the number you multiply by to make the new denominator."` | Local orientation. |
| `operate.prompt` | `"Add the shaded parts together."` | Grade 2–3, 5 words. |
| `operate.inputLabel(den)` | `"Total shaded parts out of ${den}:"` | Natural fraction addition prompt. |
| `operate.errorArithmetic` | `"The denominator stays the same. Add only the top numbers."` | Addresses common misconception. |
| `resolve.prompt` | `"Here is your final answer."` | Settles the episode. |
| `resolve.summary(num, den)` | `"The answer is ${num}/${den}."` | Exact result. |
| `resolve.unsimplifiedNotice(raw, simp)` | `"${raw} is correct! It can also be written as ${simp}."` | Distinguishes unsimplified from invalid. |
| `resolve.continueButton` | `"Next Problem"` | Calm progression. |
| `reflect.matchingPrompt(target)` | `"Tap the bar that shows the same amount as ${target}."` | DECISION-012 visual matching task. |
| `reflect.matchingOptionLabel(num, den)` | `"Bar with ${num} of ${den} equal parts shaded"` | Accessible option description. |
| `reflect.matchingCorrect` | `"That is the same amount! The parts changed size, but the shaded amount stayed the same."` | Invariant reinforcement. |
| `reflect.matchingDistractor` | `"This bar has a different shaded amount. Look closely at the shaded length."` | Distractor guidance. |
| `reflect.premisePrompt` | `"Does this new bar show the same amount as before?"` | **Condition B fixed (DECISION-026):** Check-the-premise task. |
| `reflect.premiseOptions.yes` | `"Yes, it is the same amount"` | Premise choice. |
| `reflect.premiseOptions.no` | `"No, the amount changed"` | Premise choice. |
| `reflect.premiseExpectedNo` | `"Good eye! The amount changed, so these fractions are not equivalent."` | **Condition B fixed (DECISION-026):** Habitual reassuring "yes" is incorrect. |
| `reflect.premiseFalseYesNotice` | `"Look closely: the shaded length became longer. It is not the same amount."` | Non-reassuring feedback. |
| `reflect.premiseExpectedYes` | `"Correct! The parts are smaller, but the total shaded amount is the same."` | Invariant confirmation. |
| `reflect.noneOfTheseOption` | `"None of these bars show the same amount"` | **Condition B fixed (DECISION-026):** Non-reassuring distractor option. |
| `reflect.noneOfTheseCorrect` | `"Correct! None of those bars show the same shaded amount."` | Accurate premise check. |
| `controls.check` | `"Check"` | Standard action. |
| `controls.help` | `"Need help?"` | Agency-preserving help request. |
| `controls.tryAgain` | `"Try Again"` | Local retry. |
| `controls.next` | `"Next"` | Calm progression. |
| `status.transitionComplete(side, den)` | `"The ${side} bar is now divided into ${den} parts."` | ARIA polite status announcement. |
| `status.stepCorrect` | `"Correct."` | Concise feedback. |
| `status.stepIncorrect` | `"Not quite."` | Calm feedback. |
| `summaryLines.*` | Compact step summaries (`"Units do not match."`, etc.) | Reconciliation Finding R6 collapse lines. |

*Deferrals:* None. All learner-facing strings for the Phase 2 slice are fully authored and tested. Any specialized screen-reader text for the accessible linear alternative in `plan-08` will reference this catalog or extend it per the approved boundary.

---

## 5. Renderer Purity Evidence

Tested by construction in `tests/render-purity.test.js`:
- **Arbitrary Input Test**: A synthetic scene carrying arbitrary/non-standard fraction values (5/17) was supplied. The fraction-bar renderer rendered exactly 17 equal segments with 5 shaded without calculating divisibility, prime status, or eligibility.
- **No Sum Calculation**: A scene prior to operation establishment (with `rawResult: null`) was passed to the symbolic renderer. The renderer produced `2/3 + 1/4` and did not calculate or display `= 11/12`. When the established raw result was added to the scene, the renderer displayed `= 11/12` directly from `scene.meaning.operation.rawResult`.
- **Condition C Scene Admission**: Tests verify that renderers reject mutable or malformed objects and require deeply frozen scenes from `assertSceneCurrent()`. Renderers do not take `state` and cannot access mathematical core functions.
- **Determinism**: Given two distinct renderers and identical scenes, byte-for-byte identical DOM structures, attributes, and class lists are generated.

---

## 6. Beat-Mounting & Anti-Leakage Evidence

Tested in `tests/render-foundation.test.js`:
- **DECISION-014 Compliance (Zero Future Leaks)**:
  - During `encounter`: target common denominator choices, conversion inputs, and operation sum slots do not exist in the DOM (not merely hidden; queried elements are strictly `null`).
  - During `notice`: common denominator choices, conversion inputs, and operation sum slots do not exist in the DOM.
  - During `decide`: conversion inputs and operation sum slots do not exist in the DOM.
  - During `transform`: operation sum slots do not exist in the DOM.
  - During `operate`: resolution continue controls do not exist in the DOM.
- **Prohibition of Hidden Answer Leaks**:
  - The DOM contains no `aria-hidden="true"` or `display: none` elements holding future unestablished values.
- **Reconciliation Finding R6 / DECISION-021 Criterion 1 (Collapse Rule)**:
  - When advancing from `notice` to `decide`, prior beats collapse to compact summary lines (`"Problem established."`, `"Units do not match."`).
  - Prior interactive input controls (such as the Notice choice buttons) are completely dismounted from the DOM, preventing viewport clutter and stale interactions.

---

## 7. Control Sizing & Non-Drag Parity Evidence

Tested in `tests/render-foundation.test.js`:
- **DECISION-025 (Display-Only Bar)**:
  - Fraction-bar segments are verified to have no click listeners, no focusability (`tabIndex === -1`), and `aria-hidden="true"`.
  - The bar container has `role="img"` with descriptive `aria-label`.
- **DECISION-013 & WCAG 2.2 SC 2.5.7 (No Dragging)**:
  - All decisions (Notice selection, Common Denominator selection, Equivalent Numerator entry, Numerator addition, Resolution, and Reflection) operate through discrete buttons and numeric inputs. Zero dragging interactions exist.
- **DECISION-010 & DECISION-021 Criterion 3 (Target Sizing)**:
  - All interactive controls apply `.fraction-control` with minimum touch targets meeting and exceeding WCAG 2.2 SC 2.5.8 (≥ 24×24 CSS px, default 44×44 CSS px for touch).
  - Control sizing is strictly decoupled from denominator count; testing confirms that a 30-part bar does not reduce control size.

---

## 8. Reduced-Motion Parity Evidence

Tested in `tests/render-foundation.test.js`:
- Projections under `standard-motion` and `reduced-motion` were rendered.
- Both renderers produced identical semantic accessibility labels, identical segment counts (3), and identical shaded segment counts (2).
- The reduced-motion renderer applied the `.reduced-motion` class to disable transition animations while preserving the identical inspectable post-state (Quality doc §41).

---

## 9. Advisor Consultation Disposition — Branch C

- **Capability Determination (fail-closed per AGENTS.md Step 1)**:
  - The thread checked `advisor-capable-providers.json` (version 3). The file lists `claude-code`, `codex-cli`, and `kimi-code`.
  - This execution environment runs on the Antigravity desktop agent harness, which is not listed in `advisor-capable-providers.json`.
  - Applying Step 1's fail-closed rule: *"If you cannot confidently match yourself to an entry in that file, treat yourself as not advisor-capable."*
- **Branch**: **Branch C — not advisor-capable / degraded mode (orchestrator-gate-only)**.
- **Declaration**: No subagent advisor consultation ran; the standard orchestrator gate applies as the verification authority.

---

## 10. Validation Commands and Results

| Command | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-07` | `RUNNABLE: plan-07 is ready to implement` (exit 0) |
| `npx vitest run tests/render-strings.test.js` | 6 passed (all string rules, Conditions A & B) |
| `npx vitest run tests/render-purity.test.js` | 4 passed (purity by construction, determinism, Condition C) |
| `npx vitest run tests/render-foundation.test.js` | 6 passed (mounting lifecycle, anti-leakage, collapse, Condition D) |
| `npm test` | **15 test files passed, 171 tests passed** (clean run, zero failures) |
| `npm run build` | Vite build passed in 42ms; `dist/index.html` built cleanly |
| `node scripts/dev/plan-status.js lint` | `lint: OK (no violations)` |
| `git status` | Only expected files committed; working tree clean |

---

## 11. Problems Encountered and Resolutions

1. **Compound CSS Selector Matching in Test DOM**:
   - *Problem*: The initial test selector `.fraction-bar-segment.shaded` failed because the lightweight mock DOM expected single-class selectors.
   - *Resolution*: Updated `matchesSelector` in `tests/fixtures/mock-dom.js` to split compound class names and verify all classes are present.
2. **Event preventDefault Handling**:
   - *Problem*: In headless testing, Synthetic click events dispatched on mock buttons lacked `event.preventDefault()`.
   - *Resolution*: Added `preventDefault()` to mock DOM click events and guarded `if (event && typeof event.preventDefault === 'function')` in `controls.js`.
3. **Intent Proposed Shape for Common Denominator**:
   - *Problem*: Test initially supplied a bare string `'12'` for `propose-common-denominator`, but Plan 05's `assertWireFraction()` requires a fraction wire object (`{ kind: 'fraction', numerator: '12', denominator: '1' }`).
   - *Resolution*: Formatted proposed common denominators as valid wire fraction objects in both `beat-container.js` and test fixtures.

---

## 12. Remaining Risks or Follow-Ups

- `plan-08` will join the accessible linear alternative to this foundation boundary and execute the nine fail-first scaffold-leakage invariants across both visual and linear paths.
- `plan-08` will also conduct the comprehensive WCAG 2.2 AA participation-floor and aesthetic coherence rubric self-assessment.
- Condition switching and runtime registry integration remain cleanly deferred to `plan-09`.

---

## 13. Ready for Orchestrator Review

**Yes.** All Plan 07 requirements, checklist items, and the four mechanism-approval conditions (A, B, C, D) are implemented, verified by automated tests, and committed. No packet frontmatter or generated index files were modified.
