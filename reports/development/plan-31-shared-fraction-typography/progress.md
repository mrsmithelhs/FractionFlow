# Plan 31 implementation progress

Date: 2026-10-10  
Implementer: FF Impl 31

## Overall summary

Implemented shared compact stacked-fraction typography for ordinary and
persistent bar readouts, and for linear matching questions and choice buttons.
The notation sizes to its wider numeral with font-relative padding while the
existing outer bar-readout lane remains reserved. Linear matching reads its
fraction form from the validated scene and exposes a complete fieldset legend
and choice names. Visual fraction pieces are hidden from the accessibility tree
where their complete spoken equivalent is already provided. No math, admission,
content, or explanatory copy was added.

Requirement 0 was approved before source edits in
`mechanism-review.md`. Plan 31 remains in progress; this report does not change
packet status or constitute owner rendered-screen acceptance.

## Files changed

- `src/render/symbolic.js`
- `src/render/fraction-bar.js`
- `src/render/linear-path.js`
- `src/render/strings.js`
- `src/styles/render.css`
- `tests/render-foundation.test.js`
- `tests/app-shell.test.js`
- `tests/render-strings.test.js`
- `tests/routes/route-matrix.json`
- `tests/route-contract.test.js`
- Evidence capture script, measurements, and 19 rendered screenshots under
  `reports/development/plan-31-shared-fraction-typography/evidence/`

The route contract's exact focus selector was updated to include the new
presentation class while retaining the same restored native choice button as
the active element. Its real-browser route assertion was not weakened.

## Artifacts and rendered evidence

`evidence/measurements.json` records the Edge/Playwright browser, viewport
method, layout overflow, readout and divider boxes, accessible legends and
choice names, and wider-host sizing probes. The 19 screenshots cover the
ordinary 12ths readout and persistent 12ths/24ths readouts and matching screens
at 360x740, 360x752, 1366x768, and an 180x370 effective viewport equivalent to
200% zoom over 360x740. The latter is a viewport approximation; browser zoom UI
itself was not exercised.

The measured readout lane remains 48 CSS px. At the tested 12ths/24ths values,
the divider tracks the wider numeral (17.89 CSS px for the two-digit examples)
instead of stretching to the lane or a wider 320px host. Screens show the
question words wrapping while each stacked fraction stays together. The
measured layouts report no horizontal overflow. The keyboard capture uses Enter
on a focused native choice button and records the resulting feedback state.
Reduced-motion captures were taken for persistent 12ths/24ths scenarios.

## Commands run and results

- `node scripts/dev/plan-status.js check plan-31` — RUNNABLE; no packet status
  mutation was made.
- `npm exec vitest -- run tests/render-foundation.test.js tests/app-shell.test.js tests/render-strings.test.js tests/leakage-invariants.test.js` — passed, 4 files / 51 tests before the final oracle update.
- `npm exec vitest -- run tests/render-foundation.test.js` — passed, 1 file / 7 tests after adding the active-section accessible-attribute fail-first case.
- `npm test` — passed, 28 files / 322 tests after updating the approved route
  contract selector.
- `npm run build` — passed for the learner application and subtraction
  prototype.
- `node scripts/dev/plan-status.js lint` — passed; no violations.
- `node scripts/dev/run-route-matrix.js` through the route runner with Edge —
  the full matrix ran; its only failure was the old exact active-element class
  selector for the linear matching choice. After updating the route and
  contract oracle, the affected `ROUTE-FOCUS-INSPECTION-RESTORE-LINEAR` route
  was rerun in Edge and passed 1/1. The full matrix was not rerun after that
  focused rerun.
- `node reports/development/plan-31-shared-fraction-typography/evidence/capture-plan31-typography.mjs`
  in Edge — passed; 19 screenshots and measurements regenerated.
- `git diff --check` and `git diff --cached --check` — passed. Git printed only
  expected Windows LF-to-CRLF notices.

## Advisor consultation and disposition

One bounded pre-delivery review was run because the change affects rendering,
accessibility semantics, and route behavior.

- Requested model: `gpt-6-astra`, reviewer role.
- Observed model: advisor reported “Codex based on GPT-6”; the exact variant
  was not exposed in its session metadata, so the requested tier was not
  independently verified.
- Posture: instruction-read-only with post-hoc verification. Platform metadata
  did not structurally guarantee read-only. The immediate post-consultation
  `git status --short` showed only the primary implementer's expected files;
  no advisor edits were present.
- Cost: one advisor turn, approximately a few minutes elapsed.

Findings and disposition:

1. **Long notation wider than its lane.** The advisor noted that
   `max-width: 100%` can cap the wrapper while nowrap numerals remain wider than
   a very narrow host. I verified the CSS and measurements: the tested Plan 31
   one- and two-digit forms fit, their dividers track the wider numeral, and a
   320px host does not stretch them. Accepted as a residual boundary outside
   the demonstrated forms; no content or sizing expansion was made.
2. **Hidden visual heading.** The advisor noted that the visible `h3` is
   `aria-hidden`, removing it from heading navigation. I verified the visual
   heading and complete semantic question are separate and that the existing
   fieldset legend carries the full question and structured fraction in one
   coherent phrase. Accepted as the packet's approved semantic composition;
   screen-reader announcement and heading-navigation behavior remain untested.
3. **Leak detector evidence.** The advisor asked whether active-section
   attributes and whitespace were covered and whether text/attribute branches
   had independent fail-first seeds. Repair 01 restores whole-root and
   descendant scanning for structured, raw-text, and accessible-attribute
   branches; it keeps the active-section existence requirement and has separate
   outside-active sibling seeds for raw text and `aria-label` leakage. See the
   Repair 01 evidence section below for the focused suite result.
4. **Route result qualification.** The advisor requested clear separation of
   the full run and the focused rerun. The commands above record the original
   selector mismatch and the subsequent 1/1 filtered route result. The
   connected/current restored choice focus assertion remains present.

## Problems, residual risks, and follow-up

- Physical Chromebook, actual browser zoom UI, touch hardware, and assistive
  technology were not tested.
- The narrow effective viewport shows wrapping and no horizontal overflow,
  but page content naturally extends below the viewport and requires vertical
  scrolling.
- The notation's intrinsic sizing is verified for the Plan 31 forms captured;
  arbitrary very long numerals were not tested.
- Owner rendered-screen/agency acceptance remains outstanding. Deployment is
  separately gated.

## Commit and readiness

- Implementation and evidence commit: `4e1e8b11a54b3090a3933025a1a7fc37f6bff975`
- Ready for orchestrator review: **yes**
- Packet completion status: unchanged (`in-progress`).

## Repair 01 execution — 2026-10-10

The orchestrator authorized the bounded evidence repair while Plan 31 remained
`delivered`. I changed only `tests/render-foundation.test.js` and files under
this packet's `evidence/` directory so far; this progress report is the final
owned path to commit. No product source, route matrix, other test, root review,
handoff, or packet status was changed.

### Answer-withholding guard

The helper still requires an active beat, then scans the inspected root and all
descendants for structured fractions, raw text, and accessible-label
attributes. Existing active structured and active accessible-label leak seeds
remain. Two independent fail-first seeds now place a raw `11/12` answer and an
`aria-label` answer in a sibling completed-beats region outside the active
section; each is rejected. The clean scene and each branch's existing checks
remain passing.

Command:

```text
npm exec vitest -- run tests/render-foundation.test.js tests/app-shell.test.js tests/render-strings.test.js tests/leakage-invariants.test.js
```

Result: 4 files passed, 51 tests passed. The subsequent full `npm test` run also
passed all 28 files and 322 tests.

### Second-item rendered evidence

The capture starts with the current first item (`2/3 + 1/4`), completes its
operation and reflection, verifies Next is withheld until reflection completion,
then activates the mounted Next control with Enter. At 360×740 and 1366×768 the
sequence witness reaches the current second item (`1/2 + 1/3`) and records focus
on the episode landmark. The actual admitted denominator paths captured are
sixths (`3/6 + 2/6`) and twelfths (`6/12 + 4/12`). For each path and viewport,
the saved set includes a bar readout and a linear matching prompt/choice screen;
the 12ths narrow path adds an Enter-activated recovery screen. Original packet
captures remain present. There are 28 screenshots total, including nine
second-item captures and four Next sequence witnesses.

The evidence script compares the bar's rendered source forms and visible
readout numerators/denominators with the expected equivalent forms. It checks
the linear prompt's structured `1/2`, all structured choice forms, the exact
group legend, and the complete accessible choice names. Measurements show the
48px bar label lane remains fixed, every visible divider equals its wider
padded numerator/denominator box (maximum measured difference 0px), and no
captured layout has horizontal overflow. Narrow-screen content wraps and
continues below the viewport. The wider 1366px host does not stretch the compact
notation.

Keyboard witness: Enter on the final 12ths choice produces visible recovery
feedback. The clicked choice is replaced by the response render, and the
document's active element is `BODY` afterward. The capture records this observed
focus outcome instead of claiming the original node or focus survives. Keyboard
activation is evidenced; post-response focus retention is not established by
this Plan 31 repair and no source change was authorized for it.

### Validation and disposition

- `node --check reports/development/plan-31-shared-fraction-typography/evidence/capture-plan31-typography.mjs` — passed.
- `node reports/development/plan-31-shared-fraction-typography/evidence/capture-plan31-typography.mjs` — Edge capture completed; 28 screenshots written and measurement JSON regenerated.
- `npm test` — 28 files and 322 tests passed.
- `node scripts/dev/plan-status.js lint` — passed; packet status unchanged.
- `git diff --check` — passed (only expected CRLF conversion notices).

The already committed `tests/route-contract.test.js` expectation and route matrix
both include the intentional `linear-matching-choice-btn` class while retaining
the connected first-choice focus assertion; no edit to that file was needed.
The request for that test-file change was separately authorized by the
orchestrator, but inspection showed it was already present and the full suite
passes. No product defect was confirmed by this repair. Physical Chromebook,
assistive technology, actual browser zoom UI, touch hardware, and post-response
focus retention remain unverified. Owner rendered-screen/agency acceptance is
still pending. Packet status remains `in-progress`/delivered as controlled by
the orchestrator.

Repair 01 implementation and evidence commit: `4ccf6a5`. This report must be
committed last. Ready to return to the orchestrator for review: yes.
