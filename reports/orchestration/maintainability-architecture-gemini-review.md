# Independent Architecture and Maintainability Review

**Reviewer / Runtime Identity:** Gemini 3.8 Flash (High) (operating in Antigravity agentic runtime). Lead reviewer performed single-threaded read-only source and history audits; no delegated subagents were spawned.  
**Inspected Baseline:** Commit [`703a64f`](file:///c:/AI/FractionFlow/reports/orchestration/maintainability-architecture-gemini-handoff.md) (`docs: add separate Claude and Gemini maintainability review handoffs`). Working tree verified clean before inspection.  
**Review Type:** Architecture, maintainability, and revision workflow evaluation. **Not authorization for source implementation, dependency installation, or framework migration.**  
**Output Target:** `reports/orchestration/maintainability-architecture-gemini-review.md`

---

## 1. Executive Summary and Verdict

### 1.1 The Core Question and Verdict
The repository owner framed the guiding question:
> *Which changes would make typical FractionFlow revisions easier to locate, understand, implement, and verify, while preserving mathematical authority, instructional behavior, accessibility, and replay compatibility?*

**Verdict: Do not migrate to Vue single-file components (SFCs).**  
Adopting Vue SFCs would solve almost none of the actual rework incidents observed in recent packets, while introducing substantial toolchain bloat, asynchronous lifecycle hazards for keyboard focus, and severe disruption to FractionFlow’s sub-4-second, zero-runtime-dependency test harness.

The empirical evidence from Plans 21, 24, 25, and 26 demonstrates that the friction in typical revisions does not stem from "vanilla JavaScript vs. Vue." Rather, friction clusters at four distinct seams:
1. **Ad-hoc DOM lifecycle and focus handoffs:** Renderers destroy and rebuild active DOM subtrees via `replaceChildren()`, wiping input drafts and dropping keyboard focus to `document.body` (e.g. Plan 25’s P2 focus defect).
2. **Contract drift across module boundaries:** Data validators and presentation renderers make unaligned assumptions about admissible choices and whole-number bounds (e.g. Plan 26’s Finding 1 admission defect).
3. **Monolithic file composition and DOM reparenting:** Files such as [`src/app/app.js`](file:///c:/AI/FractionFlow/src/app/app.js) (974 lines), [`src/render/beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js) (1,048 lines), and [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js) (849 lines) mix multiple responsibilities, duplicate ~100 lines of completed-beat and recovery logic, and imperatively pluck and reparent DOM nodes (e.g. moving `helpButton` between support panels and active controls).
4. **Verification and evidence-production debt:** Test suites pass mock-DOM assertions while failing to persist durable multi-viewport screenshots, touch-target verification, and container scroll bounds (e.g. Plan 26’s Repairs 01 and 02).

### 1.2 Prioritized Recommendations
Instead of a framework rewrite, the repository should execute four targeted, high-payoff interventions:

1. **Extract Shared Presentation Subcomponents in Vanilla JS (Immediate, High Value, Zero Risk):**
   - Extract the ~100 lines of duplicated milestone extraction and `<details>` disclosure logic shared between `beat-container.js` and `linear-path.js` into a shared `src/render/components/completed-beats.js`.
   - Extract recovery alert formatting into a shared `src/render/components/recovery-feedback.js`.
   - Build a standalone, intrinsically sized stacked fraction component `src/render/components/fraction-notation.js` to directly fulfill [Plan 31](file:///c:/AI/FractionFlow/docs/development/plan-31-shared-fraction-typography.md).
2. **Implement an Explicit Focus and Transient UI State Coordinator (High Value, Low Risk):**
   - Centralize transient input drafts (`commonDenominatorDraft`, `transformDrafts`) into an explicit `src/app/ui-state.js` module.
   - Replace manual `input.focus()` patches with a declarative `src/app/focus-coordinator.js` that maps state/beat transitions to target focus elements, preventing remount focus drops without requiring async framework schedulers.
   - Eliminate physical DOM reparenting of `helpButton`; render task-local help controls within their natural containers.
3. **Unify Content Admission and Renderer Capability Contracts (High Value, Low Risk):**
   - Unify the admission checks in [`src/content/authored-task-data.js`](file:///c:/AI/FractionFlow/src/content/authored-task-data.js) and the renderer constraints in `beat-container.js` / `linear-path.js` under a single shared schema. If a renderer requires $\ge 3$ choices and bars $\le 1$ whole, the upstream admission validator must enforce those exact invariants.
4. **Standardize Browser Journey Evidence Tooling (Medium Value, Low Risk):**
   - Solidify the Playwright evidence helper developed in Plan 26 into a reusable test utility (`scripts/dev/evidence-runner.js`) that captures declared multi-viewport screenshots, logs touch-event delivery, and validates viewport containment out of the box.

---

## 2. Methodology, Inspected Baseline, and Verified Facts

### 2.1 Identity and Environment
- **Lead Reviewer:** Gemini 3.8 Flash (High), executed via the Antigravity system.
- **Provider Capability & Advisor Declaration:** In accordance with repository commit discipline and advisor consultation guidance (`AGENTS.md`), this review is a design, architecture, and workflow review containing no production code changes. An implementer advisor consultation is therefore **not warranted** for this prose-only deliverable.
- **Subagents:** None invoked. Single-threaded lead review maintained full context integrity across all documents and source files.

### 2.2 Execution Verification
The following read-only commands were executed and verified against the local working copy:
- `git status -s`: Clean working copy (0 modified, 0 untracked files).
- `git rev-parse HEAD`: [`703a64f6ed18dcc7027f67a03b83daf37a9f534e`](file:///c:/AI/FractionFlow/reports/orchestration/maintainability-architecture-gemini-handoff.md).
- `node scripts/dev/plan-status.js lint`: Exited 0 (`lint: OK (no violations)`).
- `npm test`: Exited 0; **28 test files passed (321 total tests)** in **3.11 seconds** (`vitest run --passWithNoTests`).

### 2.3 Untested Limits
- Observations of layout, scroll bounds, and touch gestures rely on the committed Playwright/Edge evidence artifacts from Plan 25 and Plan 26 (`reports/development/plan-25-*/`, `reports/development/plan-26-*/`).
- No live browser sessions were launched during this turn, and no physical Chromebook or assistive-technology hardware was operated.

---

## 3. Incident and Evidence Analysis

To ground architectural evaluation in verified facts rather than subjective impressions, we classify key rework incidents from recent development packets ([Plan 21](file:///c:/AI/FractionFlow/reports/orchestration/maintainability-plan-21-implementer-retrospective.md), [Plan 22](file:///c:/AI/FractionFlow/docs/development/plan-22-denominator-path-closure-repair.md), [Plan 24](file:///c:/AI/FractionFlow/docs/development/plan-24-common-denominator-finding-support.md), [Plan 25](file:///c:/AI/FractionFlow/reports/orchestration/maintainability-plan-25-implementer-retrospective.md), and [Plan 26](file:///c:/AI/FractionFlow/reports/orchestration/maintainability-plan-26-implementer-retrospective.md)).

### 3.1 Incident Classification Table

| ID | Packet & Pointer | Category | Verified Observation | Inferred Cause | Would Vue SFCs Prevent This? | Would Modular Vanilla / Tooling Prevent This? |
|---|---|---|---|---|---|---|
| **INC-1** | Plan 25, commit [`24b2297`](file:///c:/AI/FractionFlow/reports/development/plan-25-equivalent-fraction-conversion-help/delivery-review.md#L19-L38), Delivery Review P2 | **DOM Lifecycle & Focus** | Opening transform help dispatched `request-task-help`, which remounted response controls via `replaceChildren()`. Keyboard focus dropped to `document.body` on both visual and linear views. | Destructive subtree replacement on render token change; lack of post-render focus handoff contract in `app.js`. | **No.** Vue's `v-if` also drops focus to `body` when an element unmounts, and does not autofocus new elements without explicit `v-focus` or `nextTick()` hooks. | **Yes.** An explicit focus coordinator and non-destructive DOM updating preserves or explicitly redirects focus. |
| **INC-2** | Plan 26, commit [`92e13db`](file:///c:/AI/FractionFlow/reports/development/plan-26-vetted-addition-practice-and-next-problem/delivery-review.md#L10-L26) $\to$ [`ac0078a`](file:///c:/AI/FractionFlow/reports/development/plan-26-vetted-addition-practice-and-next-problem/repair-01-review.md#L10-L16) | **Contract Drift** | `validateAuthoredMatchingChoices` accepted 2 choices and $> 1$ whole distractors; renderers required $\ge 3$ choices and visual bar refused $> 1$ whole. Corrupt data would cause blank active reflection. | Upstream content validator developed separately from presentation renderer constraints; no shared contract schema. | **No.** Vue components consume props; if prop validation fails or receives malformed data, Vue fails at render time just like vanilla JS. | **Yes.** A shared capability/admission schema shared between `src/content/` and `src/render/` catches mismatch fail-first. |
| **INC-3** | Plan 26, Delivery Review Finding 2 $\to$ Repair 01 & 02 ([`7e9ed1e`](file:///c:/AI/FractionFlow/reports/development/plan-26-vetted-addition-practice-and-next-problem/repair-02-review.md)) | **Evidence & Tooling Gap** | Initial delivery had passing unit/mock tests but lacked saved multi-viewport screenshots, touch tap proof, and scroll bounds checking. | Test runner and route matrix treated ephemeral execution as sufficient evidence; no default artifact persistence. | **No.** UI frameworks have no relationship to Playwright browser evidence pipelines. | **Yes.** Reusable evidence scripts with automatic artifact saving and geometric bounds assertions eliminate this rework. |
| **INC-4** | Plan 25, commit [`99244b2`](file:///c:/AI/FractionFlow/reports/development/plan-25-equivalent-fraction-conversion-help/progress.md#L148-L161) | **Copy Placement & Semantics** | Helper initially duplicated the equation/prompt; visual review caught the defect. Solved by splitting into question label and `aria-describedby` supporting text. | Iterative UI design refinement between owner, orchestration, and implementer. | **No.** Content copy hierarchy and accessibility associations require visual and AT judgment regardless of templating. | **Yes.** Standardizing control schemas with `supportingText` in `controls.js` prevents future recurrence. |
| **INC-5** | Plan 21, Retrospective Incident 1 ([`f8cbfa7`](file:///c:/AI/FractionFlow/reports/orchestration/maintainability-plan-21-implementer-retrospective.md#L9-L20)) | **Cross-Module Discovery** | Determining whether a fixture was learner-admitted required tracing 5 separate files across content, practice registry, eligibility, authored data, and routes. | Admission status is distributed across decoupled subsystems without a single queryable index. | **No.** Vue is a view-layer library; it has no reach into content registries or static route admission. | **Yes.** A read-only admission inventory tool (`plan-30`) directly addresses this discovery cost. |
| **INC-6** | `beat-container.js` (lines 120–216) vs `linear-path.js` (lines 170–250) | **Repeated Logic** | ~100 lines of identical milestone extraction, `<details>` collapse disclosure creation, and summary text generation duplicated across two renderers. | Two separate renderers implemented as standalone monoliths rather than composing shared presentation components. | **Partially.** Vue components can be shared, but creating `.vue` files is not required to share JS modules. | **Yes.** Extracting `completed-beats.js` and `recovery-feedback.js` in vanilla JS completely eliminates this duplication. |
| **INC-7** | `src/app/app.js` (lines 721–788) | **DOM Reparenting Hacks** | `updateHelpPlacement()` physically unmounts `helpButton` from `.app-support-controls` and appends it into `.active-beat-controls` during `decide`/`transform` beats. | Architecture treated `helpButton` as a single shared singleton DOM element rather than allowing beat containers to declare their own help affordances. | **No.** Vue encourages declarative rendering, but if a singleton is forced into two different places, awkward slot/portal logic is needed. | **Yes.** Decompose help buttons into declarative components rendered in their natural parent containers. |
| **INC-8** | Plan 21, Plan 25, Plan 26 | **Environment & Sandboxing** | Windows sandbox denied Git index lock writes during staging; Edge sandbox denied temporary browser user-data directory writes. | Platform-specific sandbox and ACL restrictions on managed Windows environments. | **No.** Irrelevant to UI framework. | **No.** Operational documentation and elevation wrappers are the only solution. |

### 3.2 What the Existing Architecture Made Easy
Any maintainability critique must acknowledge what FractionFlow's founding architecture already does exceptionally well:
1. **Mathematical Authority is Absolute and Incorruptible:** The pure exact-arithmetic core ([`src/math/`](file:///c:/AI/FractionFlow/src/math/)) has zero DOM dependencies and executes 10,000 randomized property-based invariant tests in milliseconds. In every packet investigated, arithmetic truth was never questioned, corrupted, or recomputed in presentation.
2. **Instructional State is Deterministic and Replayable:** The episode state machine ([`src/interaction/`](file:///c:/AI/FractionFlow/src/interaction/)) and replay envelope system ([`createReplayEnvelope`](file:///c:/AI/FractionFlow/src/interaction/provenance.js)) allowed Plan 25 and Plan 26 to test full state equivalence across Next, Retry, and re-entry with mathematical certainty.
3. **The Scene Model Cleanly Decouples Instruction from Render:** The pure projection ([`resolveRenderableScene`](file:///c:/AI/FractionFlow/src/render/contract.js)) completely isolates mathematical progression from DOM rendering. Renderers never guess what comes next; they consume frozen scenes.
4. **Blazing-Fast Headless Testing via Custom Mock DOM:** FractionFlow's lightweight in-house [`mock-dom.js`](file:///c:/AI/FractionFlow/tests/fixtures/mock-dom.js) (440 lines) allows 321 comprehensive unit, integration, and accessibility tests to run in **3.11 seconds**. This is an astonishing developer-velocity asset that heavy browser-emulation libraries would destroy.

---

## 4. Evaluation of Alternatives

We compare four distinct architectural alternatives across maintainability, defect prevention, performance, and long-term complexity.

```
+----------------------------------------------------------------------------------------------------+
|                                COMPARISON OF ARCHITECTURAL ALTERNATIVES                            |
+------------------------------------+----------------------------------+----------------------------+
| Alternative                        | Key Strengths                    | Primary Risks & Tradeoffs  |
+------------------------------------+----------------------------------+----------------------------+
| 1. Retain Current Stack            | - Zero migration cost            | - Monoliths remain large   |
|    (Status quo + ad-hoc fixes)     | - Preserves 3s test suite        | - High cognitive load      |
|                                    | - Proven stability               | - Duplication persists     |
+------------------------------------+----------------------------------+----------------------------+
| 2. Modular Vanilla Components &    | - Eliminates ~100 lines duplicate| - Requires deliberate      |
|    Explicit Lifecycle Coordination | - Fixes focus & draft lifecycle  |   architectural discipline |
|    (RECOMMENDED)                   | - Keeps zero dependencies        | - Manual DOM assembly      |
|                                    | - Preserves 3s mock-DOM tests    |   in smaller chunks        |
+------------------------------------+----------------------------------+----------------------------+
| 3. Partial Vue 3 SFC Adoption      | - Declarative HTML templates     | - High toolchain footprint |
|    (Candidate under review)        | - Scoped CSS in single file      | - Breaks 3s mock-DOM tests |
|                                    | - Reactive state binding         | - Async focus timing bugs  |
|                                    |                                  | - Risk of state leakage    |
+------------------------------------+----------------------------------+----------------------------+
| 4. Tooling & Documentation Only    | - Improves evidence quality      | - Does not address         |
|    (Process changes only)          | - Reduces discovery friction     |   underlying DOM lifecycle |
|                                    | - Low code touch                 |   or file bloat            |
+------------------------------------+----------------------------------+----------------------------+
```

### Alternative 1: Retain the Current Stack with Targeted Ad-Hoc Fixes
- **Description:** Maintain the existing monolithic files (`app.js`, `beat-container.js`, `linear-path.js`) and continue patching edge cases (such as the focus patch in commit `24b2297`).
- **Pros:** Zero upfront migration effort; no risk of breaking existing route matrix selectors or test suites.
- **Cons:** High cognitive load on future implementers. Files exceeding 1,000 lines encourage accidental regressions. The root causes of focus loss, duplicate milestone logic, and DOM reparenting hacks remain in the codebase.

### Alternative 2: Modular Vanilla Components with Declarative Templates & Focus Coordinator (RECOMMENDED)
- **Description:** Refactor presentation into small, single-responsibility pure JS modules without introducing any external runtime libraries.
  1. Extract shared presentation subcomponents (`completed-beats.js`, `recovery-feedback.js`, `fraction-notation.js`).
  2. Centralize transient UI state in `ui-state.js` (drafts, open/close flags).
  3. Introduce a declarative `focus-coordinator.js` that synchronously executes focus handoffs upon state transitions.
  4. Standardize control rendering using lightweight template builders or clean element factories.
- **Pros:**
  - **Zero runtime dependencies:** Preserves FractionFlow's static, pure architectural posture.
  - **Preserves Test Velocity:** Fully compatible with [`mock-dom.js`](file:///c:/AI/FractionFlow/tests/fixtures/mock-dom.js), keeping the entire test suite running in ~3 seconds.
  - **Solves the Actual Defects:** Directly addresses INC-1 (focus drops), INC-6 (repeated logic), and INC-7 (DOM reparenting).
  - **Low Blast Radius:** Can be introduced incrementally, file by file, with zero breakage to upstream interaction or math engines.
- **Cons:** Requires deliberate architectural discipline when authoring DOM updates.

### Alternative 3: Partial Vue Single-File Component Adoption
- **Description:** Introduce Vue 3 runtime and `@vitejs/plugin-vue`. Rewrite `beat-container.js`, `linear-path.js`, and `controls.js` as Vue SFCs (`.vue` files) with `<template>`, `<script setup>`, and `<style scoped>`.
- **Pros:**
  - Declarative markup eliminates imperative `document.createElement()` and `appendChild()` calls.
  - Scoped CSS keeps component styling co-located.
  - Reactive bindings (`v-model`) handle local input state cleanly.
  - Highly familiar and comfortable for the repository owner.
- **Cons & Critical Risks:**
  1. **Destroys the Lightweight Test Harness:** Vue 3 components cannot mount or run on FractionFlow's custom 440-line `mock-dom.js`. Testing Vue SFCs requires installing `@vue/test-utils` and either `happy-dom` or `jsdom`. This introduces thousands of npm package dependencies, increases node_modules weight, and will inflate test execution times from 3 seconds to 15–30+ seconds.
  2. **Asynchronous Lifecycle and Focus Fragility:** Vue renders asynchronously using a microtask queue (Virtual DOM diffing). When an element conditionally unmounts via `v-if`, focus immediately reverts to `document.body`. To focus a newly mounted input, developers must use `nextTick()` or custom directives. This creates subtle race conditions and timing bugs with keyboard users, screen readers, and automated Playwright tests.
  3. **Risk of Instructional Truth Slippage:** Vue's reactive primitives (`ref`, `reactive`) make it tempting for implementers to store instructional state or step progression inside component local state, violating the founding architectural constraint: *Mathematical state $\to$ Instructional state $\to$ Scene model $\to$ Presentation*.
  4. **Scaffold-Leakage Hazard (Condition 1 / DECISION-014):** In Vue, developers frequently use `v-show` instead of `v-if`, or render elements with hidden bindings. If unearned mathematical values or future answers are rendered into the DOM, they fail the strict scaffold-leakage invariants.
  5. **Mass Route Matrix Disruption:** Playwright tests in [`tests/routes/route-matrix.json`](file:///c:/AI/FractionFlow/tests/routes/route-matrix.json) target exact CSS selectors and DOM structures. Rewriting in Vue risks altering wrapper tags, IDs, and element hierarchies across 54 route rows.

### Alternative 4: Documentation, Instruction, and Evidence-Tooling Only
- **Description:** Leave application code unchanged. Improve agent prompt instructions, add checklists for admission contracts, and provide standardized scripts for browser route evidence capture.
- **Pros:** Zero risk to application source code; directly prevents INC-3 (evidence gaps) and INC-5 (discovery costs).
- **Cons:** Leaves the 1,000-line monolithic files and DOM lifecycle traps untouched. Code-level bugs like INC-1 (focus drops) will inevitably recur when new features are added.

---

## 5. Tracing Four Representative Revisions

To test the alternatives objectively, we trace four concrete revisions representing typical maintenance tasks across the repository.

```
+----------------------------------------------------------------------------------------------------+
|                                    REPRESENTATIVE REVISION MATRIX                                  |
+--------------------------+-----------------------+------------------------+------------------------+
| Revision Scenario        | Current Architecture  | Modular Vanilla (Alt 2)| Vue SFC (Alt 3)        |
+--------------------------+-----------------------+------------------------+------------------------+
| (a) Stacked-fraction     | Edit: 5 files         | Edit: 3 files          | Edit: 3 files          |
|     notation (Plan 31)   | High drift risk       | Clean shared component | Scoped CSS component   |
+--------------------------+-----------------------+------------------------+------------------------+
| (b) Help open/recovery & | Edit: 7 files         | Edit: 4 files          | Edit: 4 files          |
|     focus (Plan 25)      | Wipes DOM; focus lost | Synchronous focus hook | Async nextTick focus;  |
|                          | Imperative reparenting| No reparenting         | v-if drops focus       |
+--------------------------+-----------------------+------------------------+------------------------+
| (c) Another same-task    | Edit: 5 content files | Edit: 5 content files  | Edit: 5 content files  |
|     problem (Plan 26)    | 0 render files        | 0 render files         | 0 render files         |
|                          | Drift at validator    | Prevented by schema    | Drift still possible   |
+--------------------------+-----------------------+------------------------+------------------------+
| (d) Subdivision reveal   | Edit: 4 files         | Edit: 3 files          | Edit: 3 files          |
|     motion (Plan 11)     | Direct DOM math       | Dedicated math helper  | Complex v-for / SVG;   |
|                          | Custom transitions    | Clean CSS keyframes    | WAAPI still required   |
+--------------------------+-----------------------+------------------------+------------------------+
```

### 5.1 Revision (a): Copy or Stacked-Fraction Notation ([Plan 31](file:///c:/AI/FractionFlow/docs/development/plan-31-shared-fraction-typography.md))
- **Task:** Render intrinsically sized stacked fraction notation (divider width matches numerals, not host lane) in bar readouts, linear matching questions, and choice buttons.
- **Current Architecture Trace:**
  - *Files touched:* [`src/render/strings.js`](file:///c:/AI/FractionFlow/src/render/strings.js), [`src/render/symbolic.js`](file:///c:/AI/FractionFlow/src/render/symbolic.js), [`src/render/fraction-bar.js`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js), [`src/render/linear-path.js`](file:///c:/AI/FractionFlow/src/render/linear-path.js), [`src/render/matching-choice.js`](file:///c:/AI/FractionFlow/src/render/matching-choice.js), [`src/app/styles.css`](file:///c:/AI/FractionFlow/src/app/styles.css).
  - *Defects that can occur:* Bar readout divider spans outer 3rem reserve; linear buttons stretch fraction lines; screen readers announce duplicate strings if `aria-label` is not unified.
- **Modular Vanilla Trace (Alt 2):**
  - *Files touched:* Create `src/render/components/fraction-notation.js`; update `fraction-bar.js`, `linear-path.js`, `styles.css`.
  - *Ownership:* Pure functional helper creates `<span role="math" class="fraction-notation">` with intrinsic `width: fit-content` CSS rules.
  - *Defects prevented:* Centralizes spoken name (`aria-label="${n} over ${d}"`) and visual geometry in one tested component.
- **Vue SFC Trace (Alt 3):**
  - *Files touched:* Create `FractionNotation.vue`; import into `FractionBar.vue`, `LinearPath.vue`, `MatchingChoice.vue`.
  - *Ownership:* Component encapsulates template and scoped CSS.
  - *Defects that can still occur:* CSS line wrapping, font-size relative padding, and screen-reader accessibility issues are CSS/DOM problems that Vue does not solve.

### 5.2 Revision (b): Task Help Open/Close/Recovery with Focus and Retained Drafts ([Plan 25](file:///c:/AI/FractionFlow/reports/development/plan-25-equivalent-fraction-conversion-help/progress.md))
- **Task:** Add local assistance for finding equivalent numerators ($3 \times ? = 24$), retaining unsubmitted drafts, maintaining focus upon open/close, and withholding answers.
- **Current Architecture Trace:**
  - *Files touched:* 5 interaction files (`episode.js`, `classification.js`, `scene.js`, etc.), `app.js`, `beat-container.js`, `linear-path.js`, `styles.css`.
  - *Defects that occurred:* Opening help remounted the response via `replaceChildren()`, resetting focus to `document.body` (P2 defect). `app.js` had to reparent `helpButton` imperatively.
- **Modular Vanilla Trace (Alt 2):**
  - *Files touched:* Interaction files remain unchanged. Create `src/app/ui-state.js` for transient drafts; create `src/app/focus-coordinator.js`. Render help controls inline within `task-help.js`.
  - *Ownership:* Synchronous focus handoff executed immediately on state transition; inputs update in place without clearing the parent section.
  - *Defects prevented:* Focus loss is impossible because DOM is patched non-destructively, and focus transitions are guarded by explicit assertions.
- **Vue SFC Trace (Alt 3):**
  - *Files touched:* Interaction files unchanged. `TaskHelp.vue`, `ActiveBeat.vue`, `App.vue`.
  - *Defects that can still occur:* Using `v-if="isOpen"` causes Vue to unmount elements from the DOM, dropping focus to `document.body`. To restore focus, developers must use `nextTick(() => inputRef.value?.focus())`. If timing fails or animations delay mount, focus is lost. If drafts are not bound to an external store, unmounting clears user input.

### 5.3 Revision (c): Authoring Another Same-Task Problem ([Plan 26](file:///c:/AI/FractionFlow/reports/development/plan-26-vetted-addition-practice-and-next-problem/progress.md), [Plan 19](file:///c:/AI/FractionFlow/docs/development/plan-19-shared-factor-addition.md), [Plan 30](file:///c:/AI/FractionFlow/docs/development/plan-30-compact-content-authoring-investigation.md))
- **Task:** Author and admit another relatively-prime addition problem ($1/2 + 1/3 = 5/6$) with Next/Retry/exhaustion lifecycle.
- **Current Architecture Trace:**
  - *Files touched:* [`src/content/data/phase1-golden-cases.js`](file:///c:/AI/FractionFlow/src/content/data/phase1-golden-cases.js), [`src/content/authored-task-data.js`](file:///c:/AI/FractionFlow/src/content/authored-task-data.js), [`src/app/practice-types.js`](file:///c:/AI/FractionFlow/src/app/practice-types.js), `tests/plan26-practice-set.test.js`, `route-matrix.json`.
  - *Render code touched:* **Zero lines.** Renderers are completely problem-agnostic.
  - *Defects that occurred:* Admission validator accepted 2 choices; renderers required $\ge 3$ choices (Finding 1). Evidence lacked saved screenshots (Finding 2).
- **Modular Vanilla Trace (Alt 2) & Vue SFC Trace (Alt 3):**
  - *Files touched:* Identical to current. **Zero UI component files are touched.**
  - *Defects prevented:* A UI framework migration provides **zero benefit** for authoring new problems. The real solution is Plan 30’s unified validation schema and standardized evidence scripts.

### 5.4 Revision (d): Subdivision Reveal and Motion ([Plan 11](file:///c:/AI/FractionFlow/docs/development/plan-11-motion-and-animated-subdivision.md))
- **Task:** Animate fraction bar subdivision smoothly in standard motion, or instantly in reduced motion, preserving unit whole length and shaded quantity.
- **Current Architecture Trace:**
  - *Files touched:* [`src/render/fraction-bar.js`](file:///c:/AI/FractionFlow/src/render/fraction-bar.js) (688 lines), `styles.css`, `contract.js`, `app.js`.
  - *Defects that can occur:* Fill bar width desyncs from segments; reduced-motion fails to skip transitions; rapid replay interrupts active transitions.
- **Modular Vanilla Trace (Alt 2):**
  - *Files touched:* Separate static track layout from dynamic subdivision animation: `src/render/fraction-bar/track.js` and `subdivision-animator.js`.
  - *Ownership:* Clean separation of DOM partitioning from CSS transition management.
- **Vue SFC Trace (Alt 3):**
  - *Files touched:* `FractionBar.vue`.
  - *Defects that can still occur:* Vue’s `<Transition>` component is built for enter/leave DOM nodes, not continuous geometric coordinate morphing. Calculating proportional pixel widths and boundary lines still requires direct DOM math or CSS variables.

---

## 6. Detailed Architectural and Quality Assessment

### 6.1 Semantic Clarity and Locality
- **Finding:** Currently, understanding active beat presentation requires reading both [`src/render/beat-container.js`](file:///c:/AI/FractionFlow/src/render/beat-container.js) (lines 247–600) and [`src/app/app.js`](file:///c:/AI/FractionFlow/src/app/app.js) (lines 670–788) because state, drafts, and help buttons are split between them.
- **Evaluation:** Splitting files into smaller vanilla components (`completed-beats.js`, `active-beat.js`, `task-help.js`) provides high locality without introducing `.vue` compilation.

### 6.2 Stable DOM Identity, Remounts, and Focus Management
- **The Core Invariant:** Keyboard learners, screen reader users, and browser automation depend on stable DOM identity. When state updates, existing elements must not be needlessly torn down.
- **The Pitfall of `replaceChildren()`:** In `beat-container.js:289`, `activeBeatEl.replaceChildren()` destroys all children whenever `activeBeatRenderToken` changes. This was the direct catalyst for Plan 25's focus loss.
- **Why Vue Does Not Automatically Fix This:** In Vue, conditional rendering via `v-if` also destroys and recreates DOM elements. When a focused element is unmounted by `v-if`, the browser automatically reverts focus to `document.body`. Vue does not provide automatic focus restoration out of the box; developers must manually coordinate `nextTick(() => el.focus())`. Vanilla JS can perform synchronous focus handoffs immediately after surgical DOM updates.

### 6.3 Test Coupling: Implementation Structure vs. Learner Behavior
A critical finding of this review is that FractionFlow's unit test suites currently suffer from **excessive structural coupling**:
- **Examples of Over-Coupling:**
  - [`tests/app-shell.test.js`](file:///c:/AI/FractionFlow/tests/app-shell.test.js) (lines 40–43): Asserts exact child tag hierarchies: `expect(root.querySelector('.fractionflow-app').children[0].tagName).toBe('MAIN')`.
  - `tests/app-shell.test.js` (lines 55–57): Clicks buttons by nth index: `root.querySelectorAll('.app-visual-view .control-choice-btn')[1].click()`.
  - `tests/access-parity.test.js`: Checks internal class names and direct element properties rather than accessible queries.
- **Impact on Refactoring:** If presentation markup is restructured (whether in Vue or vanilla components), dozens of unit tests will break solely because container tags or class names changed, even when learner-facing behavior and accessibility remain 100% intact.
- **Recommendation:** Tests should query elements by **accessible role and name** (e.g., button with label "Notice: different sized parts") rather than CSS class names and array indices. Meaningful invariant tests ([`tests/leakage-invariants.test.js`](file:///c:/AI/FractionFlow/tests/leakage-invariants.test.js), [`tests/math-core.test.js`](file:///c:/AI/FractionFlow/tests/math-core.test.js), [`tests/route-contract.test.js`](file:///c:/AI/FractionFlow/tests/route-contract.test.js)) must be preserved without alteration.

### 6.4 Dependency, Build, and Toolchain Costs
- **Current Footprint:**
  - Runtime dependencies: **0**.
  - Static bundle size: Extremely light (~40 kB JS).
  - Test run time: **3.11 seconds** for 321 tests across 28 files using `mock-dom.js`.
- **Projected Vue 3 Footprint:**
  - Runtime dependencies: `vue` (~34 kB min/gzip).
  - Dev dependencies: `@vitejs/plugin-vue`, `@vue/test-utils`, `happy-dom` or `jsdom`.
  - Test run time: 15–30+ seconds due to DOM emulation overhead.
  - Increased risk of dependency version drift and breaking changes in static GitHub Pages deployments.

---

## 7. Minimal Intervention and Reversible Pilot Proposal

### 7.1 Recommended Minimal Intervention (Production Improvement)
The recommended minimal intervention consists of three bounded refactoring steps within the existing vanilla architecture:

1. **Step 1: Unify Completed Beats and Feedback Subcomponents**
   - Create `src/render/components/completed-beats.js` and `src/render/components/recovery-feedback.js`.
   - Replace duplicated code in `beat-container.js` and `linear-path.js`.
   - *Verification:* `npm test` passes with zero behavioral or DOM diffs.
2. **Step 2: Implement Plan 31 Shared Fraction Typography**
   - Create `src/render/components/fraction-notation.js` for intrinsically sized stacked fractions.
   - Use it in bar readouts and linear matching choices.
3. **Step 3: Centralize Focus and Transient State Coordination**
   - Create `src/app/ui-state.js` and `src/app/focus-coordinator.js`.
   - Remove manual `getVisibleTransformInput()?.focus()` patches and DOM reparenting in `app.js`.

### 7.2 Specification for a Reversible Pilot (If Owner Insists on Testing Vue)
If the owner explicitly decides to pilot Vue SFCs, the pilot **must be strictly isolated** to a non-mathematical, non-instructional surface to ensure zero risk to core learning logic.

- **Pilot Candidate:** The **Reviewer Display Menu / Condition Switcher** (`src/app/display-menu.js` or `ReviewerMenu.vue`).
- **Seam:** The component receives `conditions`, `selectedCondition`, and an `onSelect` callback. It emits events; it never computes mathematics or owns instructional state.
- **Rollback Criteria:** If adding Vue requires replacing `mock-dom.js` across existing test suites, increases test run time beyond 10 seconds, or introduces focus trap defects on Escape/Tab navigation, the pilot must be immediately rolled back.
- **Falsification Criteria for Vue's Claimed Benefit:** The hypothesis that "Vue SFCs reduce revision rework" is **falsified** if:
  1. Implementing a subsequent revision (e.g. Plan 31 typography) still requires custom CSS intrinsic sizing and accessibility wiring.
  2. Focus management after conditional rendering (`v-if`) requires more lines of boilerplate (`nextTick`, refs) than a vanilla focus coordinator.
  3. Total test suite execution time doubles.

---

## 8. Sequencing and Project Roadmap Alignment

```
                                  RECOMMENDED SEQUENCING
                                  
   +-------------------------------------------------------------------------+
   | Plan 30: Compact Content Authoring Investigation (Draft - Docs/Offline) |
   | -> Informs candidate bank, admission schemas, and batch validation     |
   +-------------------------------------------------------------------------+
                                        |
                                        v
   +-------------------------------------------------------------------------+
   | Plan 31: Shared Fraction Typography (Draft - Presentation Polish)       |
   | -> Pilots the first modular vanilla subcomponent (fraction-notation.js) |
   +-------------------------------------------------------------------------+
                                        |
                                        v
   +-------------------------------------------------------------------------+
   | Presentation Refactoring: Extract completed-beats.js & focus-coord.js   |
   | -> Eliminates ~100 lines duplicate; stabilizes DOM lifecycle & focus    |
   +-------------------------------------------------------------------------+
                                        |
                                        v
   +-------------------------------------------------------------------------+
   | Plan 19: Shared-Factor Addition (1/6 + 1/4 = 5/12)                      |
   | -> Expands problem families using clean admission and modular renderers |
   +-------------------------------------------------------------------------+
```

### 8.1 Sequencing Relative to Plans 30, 31, and 19
- **Do NOT pause accepted packet work for an architecture rewrite.** A major framework migration right now would freeze pedagogical progress on Roadmap Phase 3 for weeks with zero educational benefit.
- **Plan 30 (Compact Content Authoring Investigation):** Should proceed immediately. It investigates offline authoring recipes and batch validation, directly addressing the admission and discovery friction exposed in Plan 21 and Plan 26.
- **Plan 31 (Shared Fraction Typography):** Should proceed immediately. It can serve as the natural proving ground for the modular vanilla component pattern (`fraction-notation.js`).
- **Plan 19 (Shared-Factor Addition):** Remains sequenced after Plan 30's authoring investigation, utilizing the accepted Next/Retry lifecycle from Plan 26.

---

## 9. Explicit Pushback and Unresolved Owner Decisions

### 9.1 Pushback on the Premise: "Vue SFCs Would Reduce Revision Friction"
We push back directly against the assumption that Vue SFCs would have significantly reduced the effort or rework in recent packets:
1. **Plan 26 had two repairs:** Finding 1 was an upstream admission validator defect; Finding 2 was missing Playwright evidence artifacts and scroll checks. Vue SFCs would have prevented **0%** of that rework.
2. **Plan 25 had one P2 repair:** Focus loss upon remount. In Vue, `v-if` conditional unmounting drops focus to `document.body` exactly as `replaceChildren()` did. Vue does not automatically solve focus management.
3. **Plan 21 had discovery and governance costs:** Discovering admission criteria across 5 files. Vue is a presentation library and has zero effect on content admission or governance.

### 9.2 Unresolved Owner Decisions
The following architectural and product decisions remain with the owner:
1. **Decision on Framework Boundary:** Does the owner accept retaining the zero-runtime-dependency vanilla architecture with modular presentation components, or does the owner mandate a Vue SFC spike? (Recommendation: Retain vanilla architecture).
2. **Standardization of Accessible Queries in Tests:** Does the owner approve refactoring `tests/app-shell.test.js` to query by accessible roles and labels rather than brittle CSS selectors (`children[0].tagName`)? (Recommendation: Yes, in a bounded follow-up).
3. **Plan 30 and Plan 31 Initiation:** Does the owner authorize opening draft Plan 30 and Plan 31 for implementer assignment? (Recommendation: Yes).

---

## 10. Technical References and Declarations

### 10.1 Primary Documentation References
- **Vue 3 Asynchronous Reactivity & Lifecycle:** [Vue.js Official Documentation — Reactivity in Depth & `nextTick`](https://vuejs.org/api/general.html#nexttick). Notes that DOM updates in Vue are buffered asynchronously; programmatic focus on newly mounted DOM elements must await tick completion.
- **W3C WCAG 2.2 SC 2.4.3 (Focus Order):** [W3C Understanding SC 2.4.3](https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html). Requires logical, preserved focus transitions without accidental resets to the root document.
- **WHATWG DOM Specification — Focus Navigation:** [HTML Living Standard § 7.4.2 Focus Processing Model](https://html.spec.whatwg.org/multipage/interaction.html#focus-processing-model). Defines that removing a focused element from the document resets the active element to `body`.

### 10.2 Final Review Declaration
This review was conducted independently through direct source inspection, commit history analysis, and test suite execution in the FractionFlow repository. No external chats were consulted. The analysis is complete and self-contained.
