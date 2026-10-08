# Plan 24 — Linear Context Compact Presentation Follow-up

Date: 2026-10-07
Packet status: `delivered` (unchanged; owner rendered-screen/agency acceptance remains pending)
Authorization: orchestrator-approved bounded follow-up to the delivered packet
Implementation/evidence commit: `56af948`
Owner-directed prompt/evidence repair commit: `1c62d23`

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

After owner screen review, removed the repeated linear premise instruction and
made the preferred question the visible native fieldset legend associated with
the Yes/No responses: `Does the "New parts" fraction show the same amount as the
starting fraction?` The visual renderer's existing question and framing
remain unchanged. Corrected the evidence capture so “ordinary-decide” stops
before the learner selects a denominator.

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
- `src/render/strings.js` — updated only the linear premise question wording;
  existing visual premise wording remains intact.
- `src/styles/render.css` — compact context styling and replay highlight selector
  aligned with the new transition list.
- `tests/linear-context.test.js` — six focused projection, copy, replay, premise,
  and accessibility-structure tests.
- `tests/app-shell.test.js` — updated the view-switch assertion and added a
  mounted check for one visible response-group legend in linear premise review,
  while checking the visual prompt remains unchanged.
- `tests/routes/route-matrix.json` — extended the premise reflection route to
  switch to linear access, request replay, and verify the premise math name plus
  the polite replay status.
- `scripts/dev/capture-plan-24-linear-context-evidence.mjs` — repeatable mounted
  browser capture and geometry/name checks for six states at both review heights.
  It now asserts the decide question/group, candidate choices, and absence of
  transform inputs before labeling the screenshot ordinary-decide.
- `reports/development/plan-24-common-denominator-finding-support/evidence/` — 12
  screenshots and `linear-context-measurements.json` with geometry and limits.

The repository's existing `reports/.../delivery-review.md` and the
orchestrator's mechanism record were left untouched.

## Verification and evidence

- Focused renderer/app tests: 46 tests passed across
  `linear-context.test.js`, `app-shell.test.js`, and `route-contract.test.js`.
- Full suite: `npm test` — 26 files and 303 tests passed.
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
  comparison. Ordinary-decide now records the exact decide question, marks
  `taskBeat: decide`, verifies the denominator choice group is mounted, and
  verifies no transform input exists. Premise-comparison records the single
  visible fieldset legend with the approved wording. Both states were visually
  inspected after refreshing all 12 screenshots; in-place replay remains
  visually inspected and the moved replay highlight is visible.
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
- The new mounted test initially used `firstChild`, which this mock DOM does not
  implement. Replaced that check with the legend's parent relation; all focused
  and full tests passed.
- A build attempted concurrently with tests and browser capture hit `EPERM`
  creating the subtraction prototype output directory. The serial `npm run
  build` rerun completed both app and prototype builds successfully.

## Remaining risks and handoff

- No screen-reader speech check or owner judgment of pedagogical copy/calmness is
  claimed. The owner should inspect the 12 exact screenshots and decide rendered
  screen/agency acceptance.
- The packet remains `delivered`; no status or resolution fields were changed.
- No deployment or push was performed.
- Ready for orchestrator review: **yes**.

## Owner-directed follow-up repair and advisor disposition

The owner reviewed the screenshots and requested two bounded repairs: remove the
duplicated linear premise question while retaining one visible response-group
question with the exact preferred wording, and correct the mislabeled
ordinary-decide capture. Both repairs were authorized despite delivered packet
status. No math, instruction state, intent, replay behavior, or packet status was
changed.

A second Branch A consultation ran on the final linear premise question and
evidence-capture changes. Requested advisor class was Sol-class, light effort,
not Astra. The advisor reported Sol-class but could not independently verify its
runtime model identifier or variant. Review posture was instruction-read-only
with post-hoc verification. The post-consultation `git status --short` showed
only the scoped source, test, capture, and evidence files changed by the primary;
no advisor edits appeared.

- **One visible response-group legend — accepted, no issue.** The advisor found
  no blocker. Independent verification: mounted app-shell test asserts exactly
  one visible `.active-beat-prompt`, that it is the fieldset legend with the
  requested text, and that no separate premise framing/header remains; the real
  browser capture confirms its rendered question and one group name.
- **Visual wording unchanged — accepted, no issue.** Source change is limited to
  linear renderer composition and the linear-specific string. The mounted test
  checks the existing visual “Check this renaming:” framing and bar question.
- **Decide capture fidelity — accepted, no issue.** The advisor suggested
  narrowing the candidate locator to the visible response group. Implemented the
  `.active-beat-controls .control-choice-fieldset .control-choice-btn` scope and
  reran the capture successfully for all 12 viewport/state combinations.
- **Potential interaction/replay regression — rejected based on current evidence.**
  Change only alters linear reflection question composition and capture setup;
  the condition-4 route retains its pre-replay legend assertion and replay
  checks. Full app tests and all 48 route executions passed.

The advisor did not inspect source files, screenshots, or browser output. Its
findings were independently checked against the mounted test, source, screenshots,
and route results. No assistive-technology speech check is claimed.
