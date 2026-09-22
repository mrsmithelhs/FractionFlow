# Plan 14: Reachable Behavior Route Contract — Mechanism Proposal & Starting-Surface Rule

**Date:** 2026-09-21  
**Status:** Proposed (Requirement 1 Mechanism Gate)  
**Author:** Implementer Thread  
**Target Packet:** `docs/development/plan-14-reachable-behavior-route-contract.md`  
**Reference Materials:**  
- `reports/orchestration/phase-2-unreachable-mechanisms.md`  
- `reports/orchestration/plans-10-13-codex-review.md` (§1 and §4)  
- `docs/decision-log.md` (DECISION-006, 009, 010, 013, 014, 019, 021, 025, 026)  
- `tests/fixtures/mock-dom.js` and `tests/app-shell.test.js`  

---

## 1. Summary of Understanding

- **Current Task:** Fulfill Requirement 1 of Plan 14: propose the route-matrix schema and the starting-surface rule for orchestrator review and approval before any route is written.
- **The Core Problem:** Plan 09 shipped four mechanisms that were built, tested, and reachable by no learner. Each had a registry entry, passing tests, and an authored string. The tests passed because components were tested in isolation (constructing scenes directly or invoking renderers directly in mock environments). No test exercised the actual mounted application route or compared output against negative controls.
- **The Goal:** Make reachability verification an executable artifact rather than a manual habit. Create a declarative route matrix and a browser-backed harness that verifies claimed behaviors against real mounted controls in a real browser, enforces negative controls to prevent identical output, and fails if any registered configuration lacks a witness.
- **Non-Goals:**
  - No changes to `src/` (strictly read-only observation; zero application modifications).
  - No generic E2E testing framework or testing-framework side project.
  - No replacement of the existing 244 unit and contract tests.
  - No new learner-facing behavior, strings, or conditions.
  - No test artifacts, test globals, or test hooks in the deployed build.
- **Enforcement Rules (Non-Negotiable):**
  1. A registered configuration with no route row is an immediate failure.
  2. A row whose captured output is identical to its negative control is an immediate failure.
  3. A row marked `not run`, skipped, or using narrative description instead of automated assertion is an immediate failure.
- **Acceptance Gate:** The harness cannot be accepted on a green run alone. It requires deliberately seeding an unreachable-behavior defect and an identical-output defect, capturing both failure traces verbatim, reverting both seeds, and demonstrating a clean green suite.

---

## 2. Requirement 1 Proposal: The Route-Matrix Schema

The route matrix is stored as a declarative data file (`tests/routes/route-matrix.json` or `.js`), completely decoupled from the harness that executes it.

### 2.1 Schema Definition

Each row in the route matrix represents one falsifiable learner-visible behavior claim:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "FractionFlow Route Matrix Schema",
  "type": "object",
  "required": ["version", "routes"],
  "properties": {
    "version": { "type": "string" },
    "routes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "id",
          "behavior",
          "configuration",
          "startingSurface",
          "viewport",
          "motionMode",
          "witness",
          "actions",
          "expect",
          "negativeControl"
        ],
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier, e.g. ROUTE-COND-01, ROUTE-REPLAY-02"
          },
          "behavior": {
            "type": "string",
            "description": "Plain-language statement of the learner-visible capability being claimed."
          },
          "configuration": {
            "type": "string",
            "description": "The exact registered condition ID (from src/app/conditions.js, e.g. phase2-bundle-1), support level, or mode."
          },
          "startingSurface": {
            "type": "string",
            "enum": ["mounted-app-entry", "mounted-app-entry-with-dispatch-fallback"],
            "description": "Permitted entry point. Strictly constrained by the Starting-Surface Rule."
          },
          "viewport": {
            "type": "object",
            "required": ["width", "height"],
            "properties": {
              "width": { "type": "integer" },
              "height": { "type": "integer" }
            },
            "description": "Explicit viewport geometry (e.g. 360x640 mobile portrait, 1024x768 tablet, 1440x900 desktop per DECISION-009)."
          },
          "motionMode": {
            "type": "string",
            "enum": ["standard-motion", "reduced-motion"],
            "description": "Explicit motion environment (never assumed)."
          },
          "witness": {
            "type": "string",
            "enum": ["browser", "harness"],
            "description": "'browser' is required for any layout, focus, visibility, or motion claim. 'harness' is permitted only for non-browser semantic DOM assertions."
          },
          "actions": {
            "type": "array",
            "description": "Concrete ordered reviewer sequence through mounted app controls.",
            "items": {
              "type": "object",
              "required": ["step", "method"],
              "properties": {
                "step": { "type": "integer" },
                "description": { "type": "string" },
                "method": {
                  "type": "string",
                  "enum": ["click", "type", "pressKey", "focus", "dispatch-fallback"]
                },
                "target": {
                  "type": "string",
                  "description": "DOM selector or accessible role/name query."
                },
                "value": {
                  "type": ["string", "number", "object"],
                  "description": "Input value, key name, or action payload (for dispatch-fallback only)."
                }
              }
            }
          },
          "expect": {
            "type": "object",
            "required": ["capture", "assertions"],
            "description": "The observable output or semantic state that must result.",
            "properties": {
              "capture": {
                "type": "object",
                "required": ["target", "type"],
                "properties": {
                  "target": { "type": "string", "description": "DOM selector to capture for negative control comparison." },
                  "type": { "type": "string", "enum": ["innerHTML", "outerHTML", "textContent", "activeElementSelector", "attribute"] },
                  "attribute": { "type": "string" }
                }
              },
              "assertions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["type"],
                  "properties": {
                    "type": {
                      "type": "string",
                      "enum": [
                        "containsText",
                        "notContainsText",
                        "hasSelector",
                        "notHasSelector",
                        "attributeEquals",
                        "activeElementEquals"
                      ]
                    },
                    "target": { "type": "string" },
                    "value": { "type": "string" }
                  }
                }
              }
            }
          },
          "negativeControl": {
            "type": "object",
            "required": ["comparison", "targetRouteIdOrConfig"],
            "description": "The alternative configuration or state that must NOT produce the same output.",
            "properties": {
              "targetRouteIdOrConfig": {
                "type": "string",
                "description": "ID of another route row or configuration whose captured output serves as the negative control."
              },
              "comparison": {
                "type": "string",
                "enum": ["notIdenticalCapture", "notIdenticalText", "notIdenticalDOMStructure"]
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 3. The Starting-Surface Rule (The Load-Bearing Line)

### 3.1 The Rule

> **A route witness must start at the mounted application entry point (`createFractionFlowApp({ root }).mount()` against a clean document or the served `index.html` page). Every required step must be driven by user interactions through mounted controls in the DOM.**
> 
> **Dispatching an action directly to the running application (`app.dispatch(action)`) is permitted ONLY as an explicit fallback where no mounted UI control exists for that step, or where an upstream configuration setting has no interactive control. Constructing a scene object, instantiating a renderer directly, or injecting synthetic DOM nodes is strictly prohibited.**

### 3.2 The Line Drawn Explicitly

| Level | Action / Surface | Status | Rationale |
|---|---|---|---|
| **Level 1** | Loading `index.html` in browser or mounting `createFractionFlowApp({ root })` in a clean root element; clicking buttons, typing in numeric inputs, navigating via keyboard. | **PERMITTED (Default)** | Authentic learner/reviewer path. Proves end-to-end reachability from user input to screen. |
| **Level 2** | Starting from mounted application root, but dispatching an action via `app.dispatch(action)` to advance across beats where no direct UI button exists or to fast-forward through already-witnessed predecessor beats. | **PERMITTED (Bound Fallback)** | The mounted application is the receiver. The action flows through the real `createEpisodeMachine`, triggers the real `renderApp()` loop, executes real scene projection, and updates the real mounted DOM. |
| **Level 3** | Constructing a scene object via `createScene(...)` or `resolveRenderableScene(...)` and inspecting the scene object directly. | **PROHIBITED** | Bypasses the application shell, DOM mounting, event handling, and rendering pipeline. Verifies a projection helper, not reachability. |
| **Level 4** | Calling renderer functions directly (`renderFractionBar(container, scene)`, `renderLinearPath(container, scene)`, etc.). | **PROHIBITED (Hard Red Line)** | Directly invents the presentation context. Bypasses the upstream pipeline (`mathematical state → instructional state → presentation`). Fails to prove whether the app ever calls the renderer. |
| **Level 5** | Injecting synthetic DOM elements, mutating element styles, or altering classes from test code. | **PROHIBITED** | Fakes presentation state that no application code produced. |

### 3.3 Why the Line Falls Exactly Here

In Phase 2, the four unreachable mechanisms were caused by testing at **Levels 3 and 4**:
1. **The Condition Switcher:** Unit tests verified that `data-choreography-code` was written and that `REGISTERED_CONDITIONS` was frozen. But because no test mounted the app under Condition 2 and compared its DOM to Condition 1, all three conditions rendered byte-identically without anyone noticing.
2. **The Recovery Dispatcher:** Classifier functions were tested with unit tests; renderer string functions were tested with unit tests. Both passed with 100% coverage. But in the mounted app, the classifier produced `incorrect-transform` while the renderer looked for `transform-error`, resulting in generic `"Not quite."` messages across all errors.
3. **The Focus Guard:** `mock-dom.js` passed because it could not model `document.hidden`, masking that the focus guard disabled itself in backgrounded tabs.

By drawing the line at **Levels 1 and 2**:
- The application shell is always mounted.
- Every state transition must be processed by the actual episode state machine (`src/interaction/episode.js`).
- Every view update must be projected through `resolveRenderableScene()` and rendered through the real DOM update loop (`app.js`).
- If an intermediate step uses `app.dispatch()`, it must be declared in the route row under `method: 'dispatch-fallback'`. It is never an excuse to construct detached scenes.

---

## 4. The Three Non-Negotiable Enforcement Rules

The harness will enforce three absolute invariants:

1. **Rule 1 — Registered Configuration Completeness:**
   Before executing routes, the harness reads `REGISTERED_CONDITIONS` from `src/app/conditions.js`.
   Every registered configuration ID (`phase2-bundle-1`, `phase2-bundle-2`, `phase2-bundle-3`, `phase2-bundle-4`) MUST have at least one corresponding row in the matrix where `configuration === registeredId`.
   *Failure behavior:* If any registered configuration lacks a row, the harness fails immediately with exit code 1:
   `FATAL: Registered configuration '<id>' has no declared route witness in the matrix.`

2. **Rule 2 — Negative Control Diversity (Anti-Identical Output):**
   For every row declaring a `negativeControl`:
   The harness captures the target DOM subtree (e.g. `.app-visual-view` or `.recovery-feedback`) under the subject route.
   It then captures the same target DOM subtree under the negative control route.
   If the two captured representations are byte-identical or structurally identical, the harness fails immediately with exit code 1:
   `FATAL: Route '<id>' produced identical output to its negative control '<targetRouteIdOrConfig>' (hash: <hash>). Both rendered: <snippet>`

3. **Rule 3 — Non-Execution & Narrative Rejection:**
   Every declared row must be executed.
   If a row is marked `skipped`, if execution does not complete, or if a row's `witness` is a narrative text description rather than executable assertions against captured output, the harness fails immediately with exit code 1:
   `FATAL: Route '<id>' was not executed or contains non-falsifiable narrative witness.`

---

## 5. Requirement 3 Behavioral Scope & Initial Finding

Requirement 3 requires route rows witnessing the behaviors shipped in Plan 09:

1. **Four Registered Conditions:**
   - `phase2-bundle-1` (In-place subdivision): at `transform` beat, renders `.fraction-bar-segment.subdivided`, no `.choreography-juxtaposed`, no `.choreography-sequential`.
   - `phase2-bundle-2` (Juxtaposed): at `transform` beat, renders `.choreography-juxtaposed`, `.fraction-bar-row-before`, `.fraction-bar-row-after` ("Before: 2/3", "After: 8/12").
   - `phase2-bundle-3` (Sequential): at `transform` beat, renders `.choreography-sequential`, `.fraction-bar-step-1`, `.fraction-bar-step-2`, `.fraction-bar-step-connector` ("Step 1: Start with 2/3", "Step 2: New parts 8/12").
   - `phase2-bundle-4` (Premise Check): at `reflect` beat, renders `.premise-comparison`, "Check this renaming:", "Does this new bar show the same amount as before?".

   > **Finding regarding Requirement 3 text vs shipped reality:**  
   > Plan 14 Requirement 3 states: *"Each of the four registered conditions produces a distinct rendered structure at a conversion beat, each with the other three as negative controls."*  
   > However, inspecting `src/app/conditions.js` and `src/interaction/scene.js`:  
   > `phase2-bundle-4` has `choreography: 'D-02-M'` (in-place) and `connectionMaking: 'CM-01-P'`.  
   > Therefore, at the **conversion beat** (`transform`), `phase2-bundle-4` renders identically to `phase2-bundle-1` (`in-place`). Its distinct rendered structure appears at the **reflection beat** (`reflect`), where it renders the premise check while bundles 1–3 render matching choice bars.  
   > **Proposed Resolution:**  
   > - Conditions 1, 2, and 3 produce distinct rendered structures at the **conversion beat** (`transform`), each with the others as negative controls.  
   > - Condition 4 produces a distinct rendered structure at the **reflection beat** (`reflect`), with Condition 1 (matching choices) as its negative control.  
   > This accurately reflects the shipped code without modifying `src/`.

2. **Replay Visible Difference:**
   - In-place (`bundle-1`): renders toggle card `.fraction-bar-in-place-replay` with "Starting parts: 2/3" and "Show new parts" button.
   - Juxtaposed (`bundle-2`): activates `.choreography-juxtaposed.replay-active` and `.replay-highlight` with `(replaying)` badge.
   - Sequential (`bundle-3`): activates `.choreography-sequential.replay-active` and `.replay-highlight` with `(replaying)` heading.
   - Negative control for each: the same beat with replay inactive.

3. **Wrong-Answer Recovery Distinction:**
   - Wrong answer at `transform`: triggers transform recovery feedback (e.g. guidance on finding equal parts).
   - Wrong answer at `operate`: triggers operate recovery feedback (e.g. guidance on numerator sum).
   - Negative control: output of transform error !== output of operate error, and neither equals generic "Not quite."

4. **Premise Check Recovery vs Completion:**
   - Under `bundle-4` at `reflect`:
     - Answering "Yes" (reassuring but wrong on false premise): triggers recovery feedback ("Look closely: the shaded length became longer...") and keeps episode active (`status: 'active'`).
     - Answering "No" (correct on false premise): completes episode (`status: 'resolved'`).
     - Negative control: "Yes" response does NOT complete the episode.

5. **Reduced-Motion Semantic Parity:**
   - Under `prefers-reduced-motion: reduce`: track has `.reduced-motion`, visual state preserves quantity meaning without CSS transition delay.
   - Negative control: standard motion contains animation/transition styles.

6. **Linear Path Complete Decision Parity:**
   - Linear path completes every decision: encounter, notice, decide, transform (left & right), operate, resolve, reflect.
   - Negative control: incomplete path does not reach resolved status.

7. **Focus Restoration (Browser Witness):**
   - Focus survives replay toggle during numeric input at interactive beat (`document.activeElement` preserved).
   - Exiting Inspection Mode via "Done looking" restores focus to reflection choices.
   - Negative control: unmanaged focus reverts to `BODY`.

---

## 6. Seeded Defect Catches (Requirement 4 Plan)

To satisfy the acceptance requirement:
1. **Seeded Defect 1 — Unreachable Behavior:**
   - Temporarily add a dummy configuration `phase2-bundle-5` to `src/app/conditions.js` without adding a row to the route matrix.
   - Execute the harness.
   - Capture verbatim output proving the harness fails immediately on Rule 1:  
     `FATAL: Registered configuration 'phase2-bundle-5' has no declared route witness in the matrix.`
   - Revert `src/app/conditions.js`.

2. **Seeded Defect 2 — Identical Output:**
   - Temporarily modify `src/render/fraction-bar.js` so that `choreography === 'juxtaposed'` renders the in-place markup (simulating the Plan 09 failure).
   - Execute the harness.
   - Capture verbatim output proving the harness fails on Rule 2:  
     `FATAL: Route 'ROUTE-COND-02' produced identical output to its negative control 'ROUTE-COND-01'.`
   - Revert `src/render/fraction-bar.js`.

3. **Clean Baseline:**
   - Run the harness against the clean repository and demonstrate 100% green pass.

---

## 7. Execution Architecture: Lightweight Browser Runner

To execute the matrix against a real browser without bloated dependencies or shipped seams:
- **Build Target:** Runs against the production Vite build (`dist/index.html` via `npm run build`).
- **Runner Options:**
  - Option A: Native Node 26 script launching installed Microsoft Edge / Google Chrome (`msedge.exe` / `chrome.exe`) in headless mode (`--headless=new --remote-debugging-port=...`) via Chrome DevTools Protocol over Node's native `WebSocket`. (Zero extra npm packages, fast, lightweight).
  - Option B: Vitest browser mode or `@playwright/test` devDependency driving installed Edge/Chrome.
- **Harness CLI:** `node scripts/dev/run-route-matrix.js` (and npm script `npm run test:routes`).

---

## 8. Advisor Consultation Declaration

- **Capability:** This thread is running via Antigravity with available higher-tier subagent delegation.
- **Branch:** Branch A applies to the behavioral implementation (the harness script and route runner in Requirement 2 & 3). A pre-delivery read-only consultation will be conducted against the actual harness code before final handover.
- **Current Posture:** At this Requirement 1 mechanism gate, we are presenting this design proposal and stopping. No code has been altered.

---

## 9. Gate Request

We request orchestrator review and approval of:
1. The route-matrix schema structure.
2. The Starting-Surface Rule (the boundary between mounted app interaction, bounded dispatch fallback, and prohibited scene/renderer construction).
3. The resolution regarding Condition 4's distinct beat (reflect beat vs conversion beat).
4. Authorization to proceed to Requirement 2 (harness implementation) and Requirement 3 (route rows).
