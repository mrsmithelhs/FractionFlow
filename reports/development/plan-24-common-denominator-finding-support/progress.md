# Plan 24 — Linear Context Compact Presentation Follow-up

Date: 2026-10-07
Packet status: `delivered` (unchanged; owner rendered-screen/agency acceptance remains pending)
Authorization: orchestrator-approved bounded follow-up to the delivered packet
Implementation/evidence commit: `56af948`

The required `node scripts/dev/plan-status.js check plan-24` preflight reports
`BLOCKED` because this already-delivered packet is no longer `ready` or
`in-progress`. The explicit orchestrator authorization for this bounded
post-delivery repair was followed; packet status was not changed.

## Overall summary

Replaced the linear path's repeated “Problem and Quantities” heading, ordinary
problem statement, and two operand bullets with one stacked expression sourced
from the scene's projected current forms. The premise-check state instead shows
compact “Starting fraction” and “New parts” rows sourced from the projected
premise case. Visual fraction pieces are hidden from duplicate assistive
technology announcements; each context has one named `role="math"` expression.

Transition/replay descriptions remain only for exceptional cases that add
before/after, sequence, or replay information. Ordinary in-place transition and
unchanged-side descriptions are omitted. Existing mathematical state,
instructional state, response/replay behavior, and symbolic renderer output
remain unchanged.

## Files changed and artifacts

- `src/render/linear-path.js` — compact ordinary/premise context and scoped
  transition details.
- `src/render/symbolic.js` — small exported notation helper with an opt-in
  decorative/hidden mode; existing symbolic renderer uses its original output
  through a compatibility wrapper.
- `src/styles/render.css` — compact context styling and replay highlight selector
  aligned with the new transition list.
- `tests/linear-context.test.js` — six focused projection, copy, replay, premise,
  and accessibility-structure tests.
- `tests/app-shell.test.js` — updated the view-switch assertion to verify the new
  expression name and absence of the removed “Problem:” copy.
- `tests/routes/route-matrix.json` — extended the premise reflection route to
  switch to linear access, request replay, and verify the premise math name plus
  the polite replay status.
- `scripts/dev/capture-plan-24-linear-context-evidence.mjs` — repeatable mounted
  browser capture and geometry/name checks for six states at both review heights.
- `reports/development/plan-24-common-denominator-finding-support/evidence/` — 12
  screenshots and `linear-context-measurements.json` with geometry and limits.

The repository's existing `reports/.../delivery-review.md` and the
orchestrator's mechanism record were left untouched.

## Verification and evidence

- Focused renderer/app tests: 45 tests passed across
  `linear-context.test.js`, `app-shell.test.js`, and `route-contract.test.js`.
- Full suite: `npm test` — 26 files and 302 tests passed.
- Build: `npm run build` — learner app and standalone subtraction prototype both
  built successfully.
- Browser route matrix: `npm run test:routes` — 48 browser executions passed
  across 46 route rows. The added `ROUTE-COND-4-REFLECT` witness reaches linear
  premise replay and asserts the premise accessible name, the polite live-region
  replay status, and no redundant transition list.
- Capture: `node scripts/dev/capture-plan-24-linear-context-evidence.mjs` — 12
  observations passed in Edge/Chromium at 360×740 and 360×752. Each used a real
  browser role query to assert one exact math name and checked horizontal
  overflow. Screenshots were captured for ordinary decide, juxtaposed transition,
  sequential transition, in-place replay, converted resolve, and premise
  comparison. Ordinary, premise, and in-place replay screenshots were visually
  inspected; the moved replay highlight is visible in the replay screenshot.
- `node scripts/dev/plan-status.js lint` — passed.
- `git diff --check` — passed.

The browser checks establish rendered DOM/browser accessibility-name computation
and measured layout only. No screen reader or other assistive technology,
physical device, learner observation, or efficacy study was used. Owner review of
the rendered screens and learner agency remains pending.

## Advisor consultation disposition

Branch A ran: the change modifies renderer behavior and has a real presentation
surface. Requested advisor class: Sol-class, light effort, not Astra. The advisor
reported “Sol-class as specified” but could not independently verify its runtime
model identifier or exact variant; this is recorded as self-reported, not
platform-verified. Consultation used an inline bounded artifact and
instruction-read-only posture with post-hoc verification. The
post-consultation `git status --short`, run after independent source and route
verification, showed only this implementer's scoped source, test, route, and
evidence changes; no advisor edits appeared.

1. **Premise replay may skip transition context (medium, conditional) — rejected
   as a defect after verification.** The premise branch returns before the
   linear-context transition list. The added browser route verified that this
   state is reachable; during replay the premise comparison remains named and
   visible, while `app.js` sets the replay control's `aria-pressed` state and
   updates `.app-support-notice[aria-live="polite"]` to “Take another look at the
   current bars and symbols.” The earlier renderer also prioritized premise
   context over operand transition descriptions. This is a distinct existing
   premise/replay presentation with replay status announced outside the context,
   so no extra operand copy was added. Independent verification: source inspection
   of `app.js`/`linear-path.js` and passing browser witness `ROUTE-COND-4-REFLECT`.
2. **Replay highlight lacked visual evidence (low) — accepted and checked.**
   Inspected the in-place replay screenshot at 360×740 after the CSS selector
   change; the changed fraction's starting-form/replay detail has the blue
   highlight treatment and fits the context card without horizontal overflow.
   This is a visual browser check, not assistive-technology evidence.

Consultation cost: one light-effort review turn, roughly three minutes. The
advisor did not inspect source files or browser artifacts; independent checks
above were performed in the primary thread.

## Problems encountered and resolution

- After restart, ordinary `git add --refresh -- .` still failed with
  `.git/index.lock: Permission denied`. Browser execution and scoped Git
  staging/commits succeeded using narrow elevation and explicit paths.
- The first full test run found one app-shell assertion still expecting the
  removed “Problem:” statement. Updated the assertion to check the projected math
  name and removed-copy absence; the full suite then passed.
- The first draft of the new route asserted visual-only reflection text after
  switching to linear replay. The focused browser run exposed that stale final
  assertion; the route now captures/asserts the actual linear premise/replay
  state, and its focused run plus the full matrix pass.

## Remaining risks and handoff

- No screen-reader speech check or owner judgment of pedagogical copy/calmness is
  claimed. The owner should inspect the 12 exact screenshots and decide rendered
  screen/agency acceptance.
- The packet remains `delivered`; no status or resolution fields were changed.
- No deployment or push was performed.
- Ready for orchestrator review: **yes**.
