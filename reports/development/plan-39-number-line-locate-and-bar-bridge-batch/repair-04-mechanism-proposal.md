# Plan 39 Repair 04 mechanism proposal

Date: 2026-10-24

Status: Requirement 0 investigation proposal; stopped for orchestrator approval before source mutation.

## 1. Smallest source/layout changes and their ownership

- `src/render/number-line-locate.js` (Render layer ownership):
  - Wraps the beat prompt heading (`.active-beat-prompt`) and the starting tray (`.plan39-token-tray`) inside an introductory header region (`.plan39-header-region.plan39-intro-header`) during the locate beat.
  - Moves the starting tray (`.plan39-token-tray`) and unplaced draggable tile (`.plan39-repair-token`) out of `.plan39-representation-stack` and into the intro header region.
  - Updates `setTokenPlacement(candidateId)`:
    - When unplaced (`candidateId == null`), appends `token` into `.plan39-token-tray` with inline positioning styles cleared, centered, with `strings.plan39Repair02.tokenNotPlaced` aria-label.
    - When placed (`candidateId != null`), moves `token` into `.plan39-representation-stack` at candidate coordinates (`position: absolute`, `translate(-50%, -100%)`, `zIndex: 3`), with `strings.plan39Repair02.tokenPlaced` aria-label.
    - Preserves an empty `.plan39-token-tray` in the header without leaving a duplicate token, maintaining its layout dimensions so the header does not jump or collapse.
  - In accepted state (`accepted === true` on correct Check):
    - Replaces the intro header with the accepted result header (`.plan39-header-region.plan39-accepted-header`), displaying "That’s right." on the left (`.active-beat-prompt.plan39-accepted-text`) and a borderless, read-only compact stacked fraction on the right (`.plan39-accepted-fraction-wrapper` wrapping `createSymbolicFraction(..., { variant: 'compact' })` without individual tile border, grab cursor, hover, or focus affordances).
    - Updates `makeBar` so that the accepted bar inside `.plan39-representation-stack` renders only the bar visual (`.plan39-bar-visual`) without repeating the stacked fraction over the bar's left edge.
    - Preserves `.plan39-resolution-description` below the stack.
    - Preserves the local progression control (`.plan39-finish`) with label supplied by `getProgression()` ("Next problem" / "Back to start").
- `src/app/styles.css` (Presentation layer ownership):
  - `.plan39-header-region`: flex header with generous spacing and alignment.
  - `.plan39-intro-header`: header container for the instruction prompt and starting tray.
  - `.plan39-token-tray`: pale yellow background (`#fefce8`), subtle dashed border (`1.5px dashed #ca8a04`), rounded corners (`0.5rem`), padding (`0.25rem 0.5rem`), min-width/height (`60px` / `54px`) to preserve layout stability when empty. Clearly outside the number-line coordinate region.
  - `.plan39-repair-token`: opaque white background (`#ffffff`), rounded border (`2px solid var(--app-border)`), grab cursor (`cursor: grab`), grabbing cursor during drag (`cursor: grabbing`). Media-query scoped hover feedback (`@media (hover: hover)` light gray `#f1f5f9`), avoiding sticky hover on touch. Intrinsic content sizing and touch target minimums preserved.
  - `.plan39-accepted-header`: soft light green background (`#f1faf4`), soft border (`1px solid #b8d3c3`), rounded corners (`0.5rem`), padding (`0.75rem 1rem`).
  - `.plan39-accepted-fraction-wrapper`: borderless, read-only fraction presentation inheriting header background with no hover or grab cursor.
  - Vertical separation: adds 20–24 CSS px clear space between the bar's lower edge (`.plan39-bar-track`) and the axis line of `.plan39-axis-frame` within `.plan39-representation-stack`. Preserves aligned zero and one coordinates and the SVG connector overlay (`.plan39-accepted-connector`).
- `src/math/`, `src/content/`, `src/interaction/`: zero changes. Upstream mathematical and instructional contracts remain pure and unchanged.

## 2. Responsive behavior for the starting tray and accepted result

- Wide viewports (> 32rem / desktop):
  - Introductory header (`.plan39-intro-header`): `display: flex; justify-content: space-between; align-items: center; gap: 1rem;` placing the instruction prompt on the left and the compact starting tray on the right.
  - Accepted header (`.plan39-accepted-header`): `display: flex; justify-content: space-between; align-items: center; gap: 1rem;` with "That's right." on the left and borderless stacked fraction on the right.
- Narrow viewports (<= 32rem / mobile, e.g. 360x740, 360x752):
  - Introductory header: wraps with `flex-wrap: wrap; gap: 0.5rem;`, placing the starting tray below the instruction prompt, aligned toward the right (`margin-left: auto;`), maintaining clear vertical separation from the number-line region below.
  - Accepted header: wraps cleanly without squeezing typography, preserving font sizing and touch targets.

## 3. Current Plan 43 progression interface consumed

- Consumes `getProgression()` wired through `src/app/app.js` -> `createNumberLineLocateRenderer`:
  - `computeProgressionDescriptor()` provides `{ phase, actionKind, label, notice, onAction }`.
  - In direct navigation mode:
    - For non-final items (`activePracticeItemIndex < items.length - 1`), returns `actionKind: 'advance'`, `label: 'Next problem'`, `onAction: () => advanceToNextItem(capturedGeneration)`.
    - For the final item (`activePracticeItemIndex === items.length - 1`), returns `actionKind: 'return'`, `label: 'Back to start'`, `notice: 'You finished all problems in this set.'`, `onAction: () => returnFromCompletedSet(capturedGeneration)`.
  - In legacy navigation mode (`navigationMode === 'legacy-acknowledged'`), returns `actionKind: 'none'`, falling back to standard `Finish` button dispatching `finish-compact-episode`.
- Renderer binds this descriptor to the single progression button (`.plan39-finish`), positioned below `.plan39-resolution-description`.
- Inspectability is preserved: no automatic timer, no header-duplicate Next button. The result remains displayed until learner activation.
- Focus policy: Plan 43 handles deliberate focus on the progression button upon resolution, and deliberate focus on the fresh episode landmark upon advance.

## 4. Historical/current route contexts and compatibility boundaries

- Historical v7 / revision 1 routes (rows 82–91):
  - Preserved intact using the dedicated historical fixture (`tests/fixtures/plan39-historical-v7-entry.html`) with legacy navigation mode. No selectors or behaviors altered.
- Repair 02 boundary routes (rows 92–98):
  - Preserved intact. Retaining `.plan39-finish` selector ensures seamless compatibility with existing route scripts that click `.plan39-finish` to advance items.
- Repair 03 anchor witness (row 99):
  - Preserved intact. Exercises natural horizontal repositioning from an already placed token, agreement with live nearest ring, and Escape/window-resize cancellation.
- Plan 43 shared progression routes (rows 100–110):
  - Row 110 specifically exercises number-line advance (`ROUTE-PLAN43-NUMBER-LINE-DIRECT-ADVANCE-01`), which asserts `.plan39-finish` has label "Next problem" and advances fresh to item 2.
- Repair 04 current witness:
  - Adds an isolated witness script (`scripts/dev/plan39-repair04-witness.mjs`) to verify new layout and affordances without mutating historical routes or fixtures.

## 5. Focused rendered assertions, negative controls and final validation

- Assertions:
  - Unplaced initial state: Starting tray sits in intro header, outside number-line hit band (clear vertical separation >= 16px or beside heading at wide widths); pale yellow background (`#fefce8`), subtle dashed border, rounded corners; draggable white tile contained, minimum touch target >= 48px, grab cursor, hover feedback on fine pointers; no implied answer at 1/2, check button disabled.
  - Pending placement state: Tile positioned at candidate coordinate in stack; tray remains empty; invalid drop / Escape / window-resize restores prior state; Check button enabled; no green header or answer bar visible.
  - Accepted result: Displayed only after correct Check; light green header (`#f1faf4`), soft border (`#b8d3c3`), "That’s right." on left, borderless stacked fraction on right; answer bar visible with 20–24 CSS px clear space to axis; connector links shaded bar endpoint to number-line point; resolution description present; progression button says "Next problem" (or "Back to start" on final item).
  - Direct progression: Clicking Next problem once advances to item 2 with fresh state and deliberate focus; final item completes to start with exhaustion notice.
- Negative controls:
  - NC-1 (Starting tray separation): Seed unplaced tile inside number-line hit band; assert rejects unplaced tile overlapping line hit band.
  - NC-2 (Premature green / bar): Seed green accepted header or answer bar appearing before correct Check (unplaced, pending, or wrong Check); assert ordinary checks fail.
  - NC-3 (Progression redundancy): Seed progression action merely exposing a second Finish/Next step instead of advancing item; assert ordinary advance checks fail.
  - NC-4 (Tile overflow): Tile forced to 44px clipping fraction text; assert containment check fails.
- Validation sequence:
  - Unit tests: `cmd.exe /c "npm test"` (531 tests in 57 files).
  - Sequential builds: `cmd.exe /c "npm run build"`.
  - Targeted Repair 04 browser witness across 4 viewports (360x740, 360x752, 1366x768, 1093x614 @ DPR 1.25).
  - Targeted negative control runs demonstrating exact detection.
  - Route matrix: single final clean run with outputs isolated in `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/repair04-current/`.
  - Packet lint: `node scripts/dev/plan-status.js lint`.
  - Git diff check against baseline.
  - Bounded browser walkthrough pilot & consolidated Luna HIGH read-only code review.
