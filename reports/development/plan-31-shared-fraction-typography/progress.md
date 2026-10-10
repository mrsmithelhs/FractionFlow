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
   had independent fail-first seeds. I verified the checker requires an
   existing active section, recognizes structured fractions and slash/“over”
   text, and now scans attributes on the active section as well as descendants
   with whitespace-tolerant matching. The test now proves rejection of a
   structured 11/12 leak and an `aria-label` leak seeded directly on the active
   section. The raw-text branch is not separately seeded in this harness; it
   remains a limitation of that specific test witness, not a claimed
   independently proven path.
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
