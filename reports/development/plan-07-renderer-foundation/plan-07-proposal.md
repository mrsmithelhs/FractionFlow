# Plan 07: Implementation Summary and Three-Path Mechanism Confirmation Proposal

## 1. Summary of Understanding

- **Current Task:** Implement Plan 07 (`docs/development/plan-07-renderer-foundation.md`), establishing the presentation foundation in `src/render/` and `src/styles/`: the shared scene-consumption boundary, the beat-mounting contract, the centralized learner-facing strings table (`src/render/strings.js`), the fraction-bar renderer, the symbolic renderer, and the discrete non-drag control structure.
- **Goal:** Establish a shared presentation boundary that consumes validated scenes from `assertSceneCurrent()` and mounts them by beat, author the complete learner-facing string inventory, and build the fraction-bar and symbolic renderers. Crucially, the boundary must be designed and verified so that all three paths—visual fraction bar, symbolic notation, and accessible linear alternative—satisfy it equally, ensuring that `plan-08` can join the linear path without renegotiating the boundary.
- **Non-Goals:**
  - No mathematical or instructional logic in `src/render/` (no denominators, scale factors, equivalences, sums, or correctness evaluations computed here; no renderer decides the next beat).
  - No accessible linear path implementation (deliberately scoped to `plan-08`).
  - No scaffold-leakage invariant suite implementation (built to satisfy the contract here; formally tested and proven in `plan-08`).
  - No completed-beat collapse implementation or rubric self-assessment (scoped to `plan-08`).
  - No app shell, entry page, routing, condition switcher, or deployment (`plan-09`).
  - No learner preference surface and no browser storage (DECISION-019).
  - No number-line renderer, no new problem families, no session or progress features.
  - No accessibility conformance claims; built *against* WCAG 2.2 AA (DECISION-010, reconciliation finding R4), never *conforming to*.
- **Required Input Files:**
  - `src/interaction/scene.js`, `src/interaction/episode.js`, `src/interaction/index.js`
  - `docs/development/plan-07-renderer-foundation.md`
  - `docs/decision-log.md` (specifically DECISION-003, 004, 007, 010, 011, 012, 013, 014, 017, 019, 021, 023, 025, 026)
  - `docs/presentation-posture.md` (Parts 1 and 2)
  - `docs/development/phase-2-first-slice-design/episode-definition.md` §6
  - `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md`
  - `docs/founding/02-interaction-grammar.md` §§12, 71–72
  - `docs/founding/05-quality-and-validation.md` §§20, 32, 33, 44, 90
  - `reports/orchestration/phase-2-specification-reconciliation.md` (findings R1, R2, R4)
- **Expected Output Files (Post-Gate Implementation):**
  - `src/render/strings.js` (centralized learner copy)
  - `src/render/contract.js` / `src/render/scene-consumer.js` (shared boundary and beat mounting)
  - `src/render/fraction-bar.js` (display-only fraction-bar renderer)
  - `src/render/symbolic.js` (integrated symbolic notation renderer)
  - `src/render/controls.js` (discrete non-drag keyboard/touch controls)
  - `src/render/index.js` (render barrel)
  - `src/styles/render.css` (presentation styles)
  - `tests/render-foundation.test.js`, `tests/render-strings.test.js`, `tests/render-purity.test.js`
  - `reports/development/plan-07-renderer-foundation/progress.md`
- **Validation Commands & Checks:**
  - `node scripts/dev/plan-status.js check plan-07`
  - `npm test` (including newly authored renderer purity, mounting, control sizing, and strings linting tests)
  - `npm run build`
  - `node scripts/dev/plan-status.js lint`
- **Approval Gates:**
  - **Gate 1 (Current):** Three-path mechanism confirmation proposal covering the shared boundary, beat-mounting contract, semantic contract, strings table shape, and resolving the orchestrator's specific question regarding representation roles and capability verdicts. **Stop and wait for approval.**
  - **Gate 2 (Delivery):** Advisor consultation disposition and orchestrator artifact review.
- **Stop Conditions:**
  - The linear path's requirements cannot be stated well enough to specify the shared boundary.
  - A required decision cannot be made non-drag and keyboard-operable.
  - Authoring a string at grade 2–3 appears to require changing what the learner is asked to do.
  - Mounting a beat correctly appears to require pre-mounting a future value.

---

## 2. Three-Path Mechanism Confirmation Proposal

### Part 1: Ratification and Architecture of the Linear Path (Answering the Orchestrator's Question)

#### The Orchestrator's Question
> `REPRESENTATION_ROLES` in `src/interaction/scene.js` is `['fraction-bar', 'symbolic', 'number-line']`. There is no role for the accessible linear path. So the implicit architecture is that the linear path is a **renderer over the same scene**, not a distinct representation role.
> - Which role does a linear renderer request?
> - Does the linear path inherit that role's capability verdict? (e.g. fraction-bar refusal for LCD > 30 per DECISION-011).
> - Requesting `symbolic` instead sidesteps that refusal but makes the linear path an alternative to the symbolic view rather than to the bar.
> - Ratify or reject the renderer-over-same-scene architecture in writing, and answer these consequences.

#### Ratification & Architectural Resolution
We **ratify** that the accessible linear path is a **renderer over the same scene**, NOT a separate `representationRole`.

1. **Category Distinction: Representation Model vs. Access Modality**
   - In mathematics education and cognitive psychology, a *representation* is a mathematical model of quantity and relation. `fraction-bar` (continuous area model), `number-line` (continuous linear measurement model), and `symbolic` (formal notation) are distinct mathematical representation models.
   - The *accessible linear alternative* is an **access modality / participation path** through which the learner perceives the active mathematical representation and completes the required reasoning in a programmatically inspectable reading order (`episode-definition.md` §6, `docs/founding/05-quality-and-validation.md` §44).
   - Placing `accessible-linear` into `REPRESENTATION_ROLES` would confuse mathematical models with accessibility modalities, implying that an assistive-technology user is studying a different mathematical representation rather than an accessible view of the same mathematical object.

2. **Which Role Does a Linear Renderer Request?**
   - Individual renderers **do not** call `projectScene()` independently with conflicting roles.
   - In the runtime pipeline, `projectScene({ state, representationRole, presentationMode })` is invoked once per episode state by the episode container/orchestrator using the episode's **active primary representation role** (which is `fraction-bar` for Phase 2 episodes, or `symbolic` during symbolic continuation).
   - The resulting validated, fresh, deeply frozen scene (`scene.meaning`) is consumed simultaneously by:
     - The **visual renderer** (`fraction-bar`),
     - The **symbolic renderer** (`symbolic`), and
     - The **accessible linear renderer** (`linear-alternative`, in `plan-08`).
   - The linear renderer consumes the active scene projected for that primary representation.

3. **Does the Linear Path Inherit That Role's Capability Verdict?**
   - **Yes, and inheriting the verdict is mathematically and instructionally required.**
   - Here is why:
     - Under DECISION-008 and DECISION-011, the LCD <= 30 and scale factor <= 12 ceiling bounds the *fraction-bar representation model* in Phase 2.
     - When a problem instance or learner-chosen common denominator exceeds LCD 30, the fraction-bar model cannot render it legibly. The system issues a capability refusal (`valid-but-outside-representation-capability`) with an authorized continuation to `symbolic-continuation`.
     - In that continuation, the visual learner is **not** kept on the fraction bar; the visual learner is transitioned to the symbolic representation.
     - Sighted and screen-reader learners alike are transitioned to symbolic continuation together. The linear path over the symbolic scene then presents that exact symbolic continuation in an accessible linear reading order.
     - If the linear path did *not* inherit the fraction-bar refusal, a screen-reader learner would be kept on a partitioned 60-part fraction bar described in text while a sighted learner was transitioned to symbolic notation. That would:
       a. Fork the instructional state machine across access modes (violating the unidirectional pipeline: `mathematical state → instructional state → presentation`).
       b. Require the instructional engine to know whether the user has a visual disability (violating DECISION-003: "Basic participation must not depend on a deeply hidden or teacher-only mode... A learner needing keyboard, non-drag, reduced-motion, or semantic access should be able to discover and use the equivalent path without being routed through a separate application").
       c. Violate `05-quality-and-validation.md` §44 ("the accessible path preserves the same mathematical responsibility and does not reveal a response that the visual path asks the learner to reason out") and `02-interaction-grammar.md` §72 ("Alternative interaction modes should retain the same instructional responsibilities").
   - Therefore, the legibility ceiling is an envelope boundary for the fraction-bar *episode*, not a discriminatory lockout. Both the visual and linear renderers share the identical capability verdict. No changes to `REPRESENTATION_ROLES` or `src/interaction/scene.js` are required.

---

### Part 2: Shared Scene-Consumption Boundary

A single shared contract governs how any renderer consumes a scene:

```typescript
// Shared Renderer Interface
interface RendererContract {
  mount(container: HTMLElement, context: RenderContext): RenderInstance;
}

interface RenderContext {
  scene: Scene;                           // Validated, frozen scene from assertSceneCurrent()
  dispatchAction: (intent: object) => void; // Learner intent dispatcher
  strings: StringsCatalog;                // Centralized learner strings
}

interface RenderInstance {
  update(nextScene: Scene): void;         // Pure update from next valid scene
  destroy(): void;                        // Teardown and DOM cleanup
}
```

#### Shared Invariants:
1. **Purity**:
   - `render()` and `update()` take `scene.meaning` and project DOM deterministically.
   - Given the exact same scene, identical DOM is produced.
   - Zero mathematical computation: no renderer computes a denominator, scale factor, equivalence, sum, or correctness verdict. All values are read directly from `scene.meaning.quantities`, `scene.meaning.unitRelationship`, `scene.meaning.currentTask`, and `scene.meaning.operation`.
2. **Admission Guard**:
   - Every consumer executes `assertSceneCurrent(sceneResult, { state, representationRole, presentationMode })` before mounting or updating.
   - Stale scenes and capability refusals throw or route to continuation before entering any renderer.
3. **Immutability**:
   - The renderer never mutates `scene` or its children.
   - User inputs are communicated outward solely by dispatching learner-intent payloads (e.g. `{ intent: 'propose-common-denominator', targetDenominator: '12' }`) via `dispatchAction`. The renderer never updates instructional state directly.

---

### Part 3: Beat-Mounting Contract & Lifecycle

The DOM and accessibility tree lifecycle is strictly beat-gated (DECISION-014):

#### 1. Strict Anti-Leakage Mounting Rules
- **Unreached beats and future values NEVER exist in the DOM.**
  - `aria-hidden="true"`, `display: none`, `visibility: hidden`, or opacity-based hidden pre-mounting of future answers, target denominators, converted numerators, raw results, or preferred final forms is strictly prohibited.
- **Beat-by-Beat Availability**:
  - `encounter`: Mounts initial proper fraction expressions and initial bars (`left` with `3` parts / `2` shaded, `right` with `4` parts / `1` shaded). No future common denominator choices exist.
  - `notice`: Mounts the prompt asking if units match, and the discrete Notice choice controls (DECISION-007 / D-05). No common denominator choices or subdivision lines exist.
  - `decide`: Mounts common denominator prompt and candidate choice list (`12`, `24`, etc.). Target subdivision lines, scale factors, converted numerators, and operation slots do not exist in the DOM.
  - `transform`: Common denominator is established. Displays the subdivided bars (12 parts each). Mounts scale factor / equivalent numerator controls for the active target operand. The operation sum slot does not exist.
  - `operate`: Equivalent fractions are established (\(8/12\) and \(3/12\)). Mounts the numerator addition prompt and input control. The preferred final form and simplification controls do not exist.
  - `resolve`: Operation result (\(11/12\)) is established. Mounts result confirmation / simplification reasoning and continue button.
  - `reflect` (selective): Mounts the visual matching invariant check with distractors (DECISION-012, DECISION-026).

#### 2. Completed-Beat Context & The Finding R6 Collapse Rule
- Completed beats remain mounted as inspectable context (DECISION-014 item 2).
- **Collapse Rule (satisfying reconciliation finding R6 and DECISION-021 criterion 1)**:
  - To prevent dashboard accumulation and vertical viewport blowout on 360px screens at the `operate` and `resolve` beats:
  - A completed beat transitions from its active expanded form (which included prompt, large discrete controls, and options) to a **calm, compact summary line** (e.g. `Common unit: 12` or `2/3 = 8/12`).
  - Active beats receive primary visual focus, large touch targets, and full prompt prominence (Interaction Grammar §11, §71).
  - Completed beats remain fully inspectable and reachable by screen reader and keyboard, but their prior interactive input controls are dismounted upon beat completion.

#### 3. Error Recovery & Retry Lifecycle
- If an invalid proposal is submitted, `scene.meaning.status.recovery` reflects the classification (e.g. `invalid-common-denominator` or `incorrect-numerator`).
- The active beat displays humble, local feedback near the input (Quality doc §16, §63), clears the invalid pending value, preserves all established prior work, and keeps focus on the active input.

---

### Part 4: Semantic Contract Across All Three Paths

All three paths—visual fraction bar, symbolic notation, and accessible linear alternative—must satisfy this shared contract:

| Criterion | Visual Fraction-Bar Path | Symbolic Notation Path | Accessible Linear Alternative (Plan 08) |
|---|---|---|---|
| **Mathematical Object** | Rendered `<svg>` or `<div class="fraction-bar-display">` with equal unit partitions and shaded extent. | Mathematical fraction expression \(\frac{n}{d}\) with semantic horizontal fraction bar and distinct numerator/denominator elements. | Structured text hierarchy (`role="region"` / `<section>`): operand fractions, total equal parts, and shaded parts. |
| **Interactivity** | **Segments are NOT interactive** (DECISION-025). Bar is a pure display surface. `role="img"`, `tabindex="-1"`. | Display surface for established forms. Non-interactive except when active beat hosts a symbolic entry field. | Text all the way down. Screen-reader accessible reading order. |
| **Controls** | Sized and spaced independently of denominator (WCAG 2.2 SC 2.5.8 ≥ 24×24px, target 44×44px). | Sized and spaced independently of denominator (≥ 24×24px). | Accessible button / radio list / numeric input elements with explicit accessible names. |
| **Input Modality** | Tap/click and full keyboard navigation (DECISION-013, WCAG 2.2 SC 2.5.7 non-drag). No dragging. | Tap/click and full keyboard navigation. No dragging. | Full keyboard navigation (Tab/Shift+Tab, Enter/Space/Arrows). No dragging. |
| **Motion Mode** | Axis A: Motion-enabled by default. Axis B: Reduced motion provides instant static subdivision to identical endpoint. | Instant static updates on state establishment. | Screen-reader live region (`role="status"`, `aria-live="polite"`) announces transitions without motion. |
| **Agency / Responsibility** | Learner makes every required decision; never auto-revealed before attempt. | Mirrors established state; never previews unreached steps. | Same responsibility: announces the question and options, NEVER announces the correct answer. |

---

### Part 5: Centralized Learner-Facing Strings Table Shape (`src/render/strings.js`)

Per DECISION-017 and DECISION-023, all learner-facing copy lives in `src/render/strings.js`. No inline strings exist in components.

#### Working Rules Compliance (DECISION-004 & Presentation Posture Part 2):
- Grade 2–3 reading target.
- Prompts run to ~12 words; help text to ~25 words.
- Active voice, present tense, second person ("you").
- Concrete nouns ("bar", "parts", "amount") rather than abstract jargon ("representation", "invariant").
- Mathematical terms taught by the episode are exempt and introduced with meaning (*numerator*, *denominator*, *common denominator*, *equivalent*, *whole*).
- Zero specification or research apparatus jargon (*no* "cadence", "scaffold", "provenance", "condition", "D-01", "CM-01", "register").
- Connection-making check instantiated as visual matching with distractors whose answer is not always the reassuring one (DECISION-012, DECISION-026).

#### Table Shape (`src/render/strings.js`):
```javascript
export const STRINGS = Object.freeze({
  encounter: {
    prompt: 'Look at these two fractions.',
    barLabel: (side, num, den) => `${side} bar: ${num} out of ${den} equal parts shaded.`,
    wholeLabel: '1 whole',
  },
  notice: {
    prompt: 'Do these two fractions have the same size parts?',
    options: {
      yes: 'Yes, same size',
      no: 'No, different sizes',
    },
    feedbackDiff: 'The pieces are different sizes. We need a common unit.',
  },
  decide: {
    prompt: 'Choose a common denominator for both fractions.',
    optionAriaLabel: (den) => `Denominator of ${den}`,
    invalidDenominator: (den) => `${den} is not a common denominator. Try another number.`,
    validNonLeast: (den) => `${den} works! Both fractions can use this denominator.`,
    validLeast: (den) => `12 works! That is the smallest common denominator.`,
  },
  transform: {
    prompt: (side, den) => `Rename the ${side} fraction using ${den} equal parts.`,
    scaleFactorPrompt: (side, mult) => `Multiply top and bottom by ${mult}.`,
    equivalentNumeratorPrompt: (side, den) => `How many ${den}ths are shaded?`,
    errorNumerator: 'Check the number of shaded parts after dividing.',
  },
  operate: {
    prompt: 'Add the shaded parts together.',
    inputLabel: (den) => `Total ${den}ths`,
    errorArithmetic: 'The denominator stays the same. Add only the top numbers.',
  },
  resolve: {
    prompt: 'Here is your final answer.',
    preferredForm: (num, den) => `The answer is ${num}/${den}.`,
    unsimplifiedNotice: (raw, simp) => `${raw} is correct! It can also be written as ${simp}.`,
    continueButton: 'Next Problem',
  },
  reflect: {
    prompt: (target) => `Tap the bar that shows the same amount as ${target}.`,
    optionLabel: (num, den) => `Bar with ${num} out of ${den} parts shaded`,
    distractorExplanation: 'This bar has a different shaded amount. Look closely at the total shaded length.',
  },
  controls: {
    check: 'Check',
    help: 'Need help?',
    tryAgain: 'Try Again',
  },
  status: {
    transitionComplete: (side, den) => `The ${side} bar is now divided into ${den} parts.`,
    stepSuccess: 'That is correct.',
  },
});
```

---

### Part 6: Concrete File Structure in `src/render/`

```
src/render/
├── strings.js             # Centralized learner-facing copy catalog (DECISION-017, 023)
├── contract.js            # Shared renderer interfaces, scene consumption, and assertion guards
├── beat-container.js      # Beat-gated mounting container and completed-beat collapse manager
├── fraction-bar.js        # Pure fraction-bar renderer (display-only SVG/HTML, DECISION-025)
├── symbolic.js            # Pure symbolic notation renderer
├── controls.js            # Discrete, keyboard-operable, touch-accessible controls (>=24x24px, DECISION-010, 013)
└── index.js               # Render layer barrel export
```

---

## 3. Pre-Flight Verification & Current Status

- Checked packet status: `node scripts/dev/plan-status.js check plan-07` → `RUNNABLE: plan-07 is ready to implement`.
- Lint status: `node scripts/dev/plan-status.js lint` → `lint: OK (no violations)`.
- Full test suite: `npm test` → 12 test files, 155 tests passing.
- Working tree: clean.

Per the Plan 07 approval gate:
> *"Before any renderer is built, the implementer proposes the shared scene-consumption boundary, the beat-mounting contract, and the semantic contract — specified so that the visual, symbolic, and accessible linear paths all satisfy it — plus the strings table shape, and stops for approval."*

I have stopped here and await your confirmation or revisions on this mechanism proposal before implementing any renderer code.