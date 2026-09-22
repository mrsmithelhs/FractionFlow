Ran command: `git status`
Ran command: `git log -n 1 --oneline`
Ran command: `node scripts/dev/plan-status.js check plan-14`
Viewed plan-14-reachable-behavior-route-contract.md:1-243
Viewed phase-2-unreachable-mechanisms.md:1-154
Viewed plans-10-13-codex-review.md:1-126
Viewed package.json:1-20
Searched for files: *
Searched for files: *
Viewed index.html:1-13
Viewed main.js:1-9
Viewed conditions.js:1-82
Viewed app-shell.test.js:1-594
Ran command: `npm list --depth=0`
Checked task Check npm dependencies
Searched for "DECISION-019"
Viewed decision-log.md:1-100
Searched for "### DECISION-"
Viewed decision-log.md:100-250
Viewed decision-log.md:250-450
Viewed decision-log.md:450-600
Viewed mock-dom.js:1-440
Searched for files: *advisor*
Viewed advisor-capable-providers.json:1-37
Ran command: `where.exe msedge chrome`
Ran command: `Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"; Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe"`
Ran command: `Test-Path "node_modules/playwright"; Test-Path "node_modules/puppeteer"`
Ran command: `node --version; npm --version`
Searched for files: *plan-14*
Searched for files: *
Viewed plan-08-proposal.md:1-100
Searched for "CM-01-P"
Searched for "choreography"
Viewed beat-container.js:400-440
Searched for "premise"
Searched for "premise"
Ran command: `npm test`
Ran command: `npm run build; node scripts/dev/plan-status.js lint`
Created mechanism-proposal.md
Ran command: `git status`
Ran command: `git diff docs/decision-log.md docs/development/plan-12-entry-page-and-session-shape.md`
Ran command: `node scripts/dev/plan-status.js lint`
Ran command: `node scripts/dev/plan-status.js check plan-14`

# Plan 14: Reachable Behavior Route Contract — Requirement 1 Mechanism Gate Proposal

**Repository State:** Commit `199c104`  
**Artifact Created:** [`reports/development/plan-14-reachable-behavior-route-contract/mechanism-proposal.md`](file:///c:/AI/FractionFlow/reports/development/plan-14-reachable-behavior-route-contract/mechanism-proposal.md)  
**Status:** **PROPOSE AND STOP** (Gate 1: Mechanism Confirmation)

---

## 1. Summary of Understanding

- **Context & Diagnosis:** In Phase 2, `plan-09` shipped four mechanisms that were built, tested, and reachable by no learner ([`phase-2-unreachable-mechanisms.md`](file:///c:/AI/FractionFlow/reports/orchestration/phase-2-unreachable-mechanisms.md)). Passing tests gave false confidence because components were tested in isolation (scenes were mocked, renderers were invoked directly, or properties were asserted without comparing rendered DOM outputs across alternative conditions).
- **Core Objective:** Turn reachability verification into an executable, automated artifact rather than an ad hoc manual review habit. Formulate a declarative route matrix data file and a browser-backed execution harness that executes routes against the real mounted application, enforces negative controls to prevent identical output, and fails if any registered configuration has no route.
- **Scope Constraints:**
  - `src/` is strictly **out of scope** (pure read-only observation; no code modifications).
  - Zero test hooks, globals, or synthetic test data attributes added to the deployed build.
  - No generic E2E framework expansion or testing-framework side projects.
  - Implementer does not alter packet frontmatter status verbs or edit orchestrator notes.

---

## 2. The Route-Matrix Schema

The route matrix is stored as a declarative JSON data file (`tests/routes/route-matrix.json`), completely decoupled from the execution harness.

### Schema Fields & Requirements

| Field | Type | Purpose & Semantic Invariant |
|---|---|---|
| `id` | `string` | Unique identifier (e.g. `ROUTE-COND-01`, `ROUTE-REPLAY-02`). |
| `behavior` | `string` | Falsifiable, plain-language description of the learner-visible capability claimed. |
| `configuration` | `string` | Real registered condition ID (from `src/app/conditions.js`, e.g. `phase2-bundle-1`), support level, or presentation mode. |
| `startingSurface` | `string` | Where the route starts. Must be an authorized entry point under the Starting-Surface Rule (`mounted-app-entry` or `mounted-app-entry-with-dispatch-fallback`). |
| `viewport` | `{ width: int, height: int }` | Explicit viewport geometry (e.g. `360x640` for mobile portrait, `1024x768` for tablet, `1440x900` for desktop per DECISION-009). Named, never assumed. |
| `motionMode` | `enum` | `'standard-motion'` or `'reduced-motion'`. Named, never assumed. |
| `witness` | `enum` | `'browser'` or `'harness'`. `'browser'` is **mandatory** for any layout, focus, visibility, or motion claim. `'harness'` is permitted only for non-browser semantic DOM assertions. |
| `actions` | `array` | Concrete ordered reviewer sequence of steps through mounted controls (`click`, `type`, `pressKey`, `focus`, or `dispatch-fallback`). |
| `expect` | `object` | Verifiable DOM/semantic assertions and captured target element for negative control comparison. |
| `negativeControl` | `object` | Declares the alternative route ID, condition, or baseline state that must **not** produce identical output. |

---

## 3. The Starting-Surface Rule (The Load-Bearing Line)

### The Rule

> **A route witness must start at the mounted application entry point (`createFractionFlowApp({ root }).mount()` in a clean document or the served `index.html` page). Every required step must be driven by user interactions through mounted controls in the DOM.**
> 
> **Dispatching an action directly to the running application (`app.dispatch(action)`) is permitted ONLY as an explicit fallback where no mounted UI control exists for that step, or where an upstream configuration setting has no interactive control. Constructing a scene object, instantiating a renderer directly, or injecting synthetic DOM nodes is strictly prohibited.**

### The Line Drawn Explicitly

| Level | Execution Surface / Technique | Status | Rationale |
|---|---|---|---|
| **Level 1** | Loading `index.html` in a real browser or mounting `createFractionFlowApp({ root })` in a clean root DOM element; clicking buttons, typing in numeric inputs, navigating via keyboard. | **PERMITTED (Default)** | Authentic learner/reviewer path. Proves end-to-end reachability from user input to screen. |
| **Level 2** | Starting from mounted application root, but dispatching an action via `app.dispatch(action)` to advance across beats where no direct UI button exists or to fast-forward through already-witnessed predecessor beats. | **PERMITTED (Strictly Bound Fallback)** | The mounted application is the receiver. The action flows through the real `createEpisodeMachine`, triggers the real `renderApp()` loop, executes real scene projection, and updates the real mounted DOM. |
| **Level 3** | Constructing a scene object via `createScene(...)` or `resolveRenderableScene(...)` and inspecting the scene object directly. | **PROHIBITED** | Bypasses the application shell, DOM mounting, event handling, and rendering pipeline. Verifies a projection helper, not reachability. |
| **Level 4** | Calling renderer functions directly (`renderFractionBar(container, scene)`, `renderLinearPath(container, scene)`, etc.). | **PROHIBITED (Hard Red Line)** | Directly invents the presentation context. Bypasses the upstream pipeline (`mathematical state → instructional state → presentation`). Fails to prove whether the app ever calls the renderer. |
| **Level 5** | Injecting synthetic DOM elements, mutating element styles, or altering classes from test code. | **PROHIBITED** | Fakes presentation state that no application code produced. |

### Why Drawing the Line Here Is Non-Negotiable

In Phase 2, the four unreachable mechanisms were caused by testing at **Levels 3 and 4**:
1. **The Condition Switcher:** Unit tests verified that `data-choreography-code` was written and that `REGISTERED_CONDITIONS` was frozen. But because no test mounted the app under Condition 2 and compared its DOM to Condition 1, all three conditions rendered byte-identically without anyone noticing.
2. **The Recovery Dispatcher:** Classifier functions and renderer string functions were tested independently in isolation and passed with 100% coverage. But in the running app, the classifier produced `incorrect-transform` while the renderer checked for `transform-error`, resulting in generic `"Not quite."` messages across all errors.
3. **The Focus Guard:** `mock-dom.js` passed because it could not model `document.hidden`, masking that the focus guard disabled itself in backgrounded tabs.

By drawing the line at **Levels 1 and 2**:
- The application shell is always mounted.
- Every state transition must be processed by the actual episode state machine (`src/interaction/episode.js`).
- Every view update must be projected through `resolveRenderableScene()` and rendered through the real DOM update loop (`app.js`).
- If an intermediate step uses `app.dispatch()`, it must be declared in the route row under `method: 'dispatch-fallback'`. It is never an excuse to construct detached scenes.

---

## 4. The Three Non-Negotiable Enforcement Rules

1. **Rule 1 — Registered Configuration Coverage:**
   The harness dynamically inspects `REGISTERED_CONDITIONS` from `src/app/conditions.js`. Every registered condition ID (`phase2-bundle-1`, `phase2-bundle-2`, `phase2-bundle-3`, `phase2-bundle-4`) MUST have at least one declared route witness row in the matrix.
   *Failure behavior:* Immediate fatal error (`FATAL: Registered configuration '<id>' has no declared route witness in the matrix.`).
2. **Rule 2 — Negative Control Diversity (Anti-Identical Output):**
   For every row declaring a `negativeControl`:
   The harness captures the target DOM subtree (e.g. `.app-visual-view` or `.recovery-feedback`) under the subject route. It then captures the same target DOM subtree under the negative control route. If the two captured outputs are byte-identical or structurally identical, the harness fails immediately.
   *Failure behavior:* Immediate fatal error (`FATAL: Route '<id>' produced identical output to its negative control '<targetRouteIdOrConfig>'.`).
3. **Rule 3 — Non-Execution & Narrative Rejection:**
   Every declared row must be executed. If a row is marked `skipped`, if execution does not complete (`not run`), or if a row's witness is a narrative text description rather than executable assertions against captured output, the harness fails immediately.
   *Failure behavior:* Immediate fatal error (`FATAL: Route '<id>' was not executed or contains non-falsifiable narrative witness.`).

---

## 5. Requirement 3 Scope & Initial Behavioral Finding

Requirement 3 requires route rows witnessing the behaviors shipped in `plan-09`:
- Four registered conditions with distinct rendered structure.
- Replay producing visible differences in each condition (or recorded honestly where it is text/highlight only).
- Wrong answer recovery at `transform` and `operate` producing distinct messages (and neither matching the generic `"Not quite."`).
- Premise check completing on the correct answer and recovering on the reassuring-but-wrong answer on both visual and linear routes.
- Reduced motion reaching the same states with preserved mathematical meaning.
- Linear path completing every required decision.
- Focus surviving replay at an interactive beat and returning to choice group on exiting Inspection Mode.

### Critical Finding on Condition 4 (`phase2-bundle-4`)
- **Plan 14 Text:** *"Each of the four registered conditions produces a distinct rendered structure at a conversion beat, each with the other three as negative controls."*
- **Observed Application Code:** In `src/app/conditions.js` and `src/interaction/scene.js`, `phase2-bundle-4` has `choreography: 'D-02-M'` (in-place) and `connectionMaking: 'CM-01-P'`. At the **conversion beat** (`transform`), `phase2-bundle-4` uses in-place subdivision and renders **identically** to `phase2-bundle-1`.
- **Shipped Reality:** `phase2-bundle-4`'s distinct structural rendering is at the **reflection beat** (`reflect`), where it renders the premise check (`.premise-comparison`, "Check this renaming:", "Does this new bar show the same amount as before?") whereas Bundles 1–3 render matching choice bars (`.matching-choice-btn`).
- **Proposed Resolution:**
  - Bundles 1, 2, and 3 produce distinct rendered structures at the **conversion beat** (`transform`), each with the others as negative controls.
  - Bundle 4 produces a distinct rendered structure at the **reflection beat** (`reflect`), with Bundle 1 (matching choices) as its negative control.
  - This faithfully witnesses the application behavior that actually shipped without modifying `src/`.

---

## 6. Seeded Defect Catches (Requirement 4 Plan)

Before acceptance, the harness will be proven by:
1. **Seeding Defect 1 (Unreachable Behavior):** Add a dummy entry `phase2-bundle-5` to `src/app/conditions.js` without a route matrix row. Execute the harness and capture the exact failure on Rule 1 verbatim. Revert the seed.
2. **Seeding Defect 2 (Identical Output):** Temporarily force `choreography === 'juxtaposed'` in `src/render/fraction-bar.js` to render the in-place DOM structure. Execute the harness and capture the negative control failure on Rule 2 verbatim. Revert the seed.
3. **Clean Verification:** Run the harness against the clean repository and verify all tests pass green.

---

## 7. Execution Architecture: Lightweight Headless Browser Runner

To execute the browser witnesses against the built static application (`dist/index.html` via `npm run build`) without introducing heavy framework overhead or shipped seams:
- **Runner Strategy:** A lightweight Node script (`scripts/dev/run-route-matrix.js`) driving the installed Microsoft Edge or Google Chrome (`msedge.exe` / `chrome.exe`) in headless mode (`--headless=new`) via Chrome DevTools Protocol (CDP) over Node 26's native `WebSocket` and `fetch`.
- **Advantages:** Zero new npm production dependencies, zero shipped seams in `src/`, instant startup, and direct execution against the production build with full access to `document.activeElement`, real CSS styling, and `prefers-reduced-motion`.

---

## 8. Advisor Consultation Posture

- **Capability:** Capable via Antigravity subagent invocation.
- **Branch:** Branch A applies to the behavioral scripts in Requirement 2 & 3. A pre-delivery read-only consultation will be conducted against the implemented harness before final handover.
- **Current Gate Posture:** Mechanism proposal only; no code changes have been made.

---

## 9. Gate Request & Next Steps

This concludes **Requirement 1**. In accordance with the gate contract, I have stopped and await orchestrator approval of:
1. The route-matrix schema.
2. The Starting-Surface Rule (the boundary between mounted DOM interaction, bounded dispatch fallback, and prohibited scene/renderer construction).
3. The resolution regarding Condition 4's distinct beat (`reflect` vs `transform`).

Once approved, I will proceed to implement Requirement 2 (the harness and enforcement rules) and Requirement 3 (the route rows).