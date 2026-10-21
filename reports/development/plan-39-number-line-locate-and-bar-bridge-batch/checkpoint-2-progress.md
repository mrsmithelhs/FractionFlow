# Plan 39 Checkpoint 2 — rendered bridge progress

This checkpoint records Stages 4–5 only. It adds the mounted visual/linear number-line region, app view/help/preview wiring, scoped styles, focused app tests, and a bounded installed-Chrome probe. It does not add or alter route-matrix files, packet status, or acceptance records.

## Implemented behavior

- The app stores only the opaque preview handle `{ contextKey, candidateId }`. Each active number-line region owns reads, writes, candidate control lookup, and submission. A region validates the handle against its current context and reacquires the exact form from the current scene at Check Position. Hidden regions report preview unavailable; visible regions missing current controls throw an observable error. View toggles save from the old active region and restore through the new active region; local renderer handles clear when context changes or the beat leaves `locate`.
- Visual choices are mapped buttons that move/highlight the corresponding number-line point as an unconfirmed preview. Linear choices are native radio buttons with arrow-key behavior. Both support the full candidate set (including high-support endpoints), retain 44px minimum targets, and require explicit Check Position before proposal. Selecting a visual or linear choice does not submit.
- The visual bar and number line use the same 0–1 inline frame. At resolve, a renderer-owned overlay joins the shaded-bar endpoint to the accepted point. The connector refreshes after a previously hidden view is revealed. Ratios are used only for presentation geometry; exact equality and accepted-position facts remain upstream.
- The app projects bridge scenes with `representationRole: 'number-line'` through a bridge-only initial-role choice; other episode scene-role defaults remain `fraction-bar`.
- After the learner finishes, the number-line region shows a concise resolved statement and removes the spent Finish action. The app’s existing gated Next/Return navigation owns completion navigation; the final record exposes exhaustion notice instead of a Next control.

## Verification

- Focused tests: `npm test -- --run tests/app-plan39-number-line.test.js tests/plan39-bar-to-line-bridge.test.js tests/render-purity.test.js` — 18 tests passed.
- Full test suite after final source/test changes: `npm test` — 56 files, 503 tests passed.
- Builds after final source changes: `npm run build` and `npm run build:prototype` both passed.
- Installed Chrome 155.0.8059.81, via the report-local script `evidence/checkpoint-2/bounded-plan39-browser-probe.mjs`, exercised high b=8, high b=3, medium item 07, and medium item 08 at 360×740 DPR 1 with touch/reduced-motion context and 1093×614 DPR 1.25 with reduced-motion context. Both visual and linear views were sampled, as were touch tapping on visual mapped choices, native radio arrow-key navigation, explicit Check Position, finish, and final navigation state.
- Across all eight scenario/viewport pairs, all candidate hitboxes were at least 44×44 CSS px, pairwise rectangles had no overlap, and each center hit its intended button/label after normal `scrollIntoView`. At 360px the bar/line endpoint deltas were 0.03 CSS px; at 1093×614 DPR 1.25 they were 0.01 CSS px. Resolve connector endpoint deltas to the shaded-bar endpoint and accepted point were both 0 CSS px in every sampled case. The measured connector length was 85.30 CSS px at 360px and 166.58 CSS px at 1093px.
- `Check Position` remained the only submission control before finish (`finish` absent until correct Check); after finish, all scenarios had zero spent Finish controls. The first three records exposed Next; final record `bridge-08-five-sixths-med` exposed the existing exhaustion notice and no Next control.
- The full-page screenshots show correct vertical scrolling at the tested viewport heights. Candidate controls are below the number-line figures, so the whole locate region does not fit in the initial 614px desktop viewport; the page scrolls through the full control set. At 360×740 the prompt and high-density b=8 choices remain legible and horizontally contained, while vertical scrolling is needed to reach the complete choice list and Check. The probe records initial prompt/control viewport containment separately from scroll-reachable target geometry.

## Evidence files

- `evidence/checkpoint-2/bounded-plan39-browser-probe.mjs`
- `evidence/checkpoint-2/results/results.json`
- Representative locate captures: `evidence/checkpoint-2/results/high-b8-360x740-dpr1-locate.png` and `evidence/checkpoint-2/results/high-b8-1093x614-dpr1.25-locate.png`
- Resolve captures for all four sampled records at both viewport settings: `evidence/checkpoint-2/results/*-resolve.png`

The browser evidence is desktop Chrome with configured touch emulation and keyboard operation. It does not establish physical-device behavior, assistive-technology conformance, learner agency acceptance, owner-rendered-page acceptance, route-matrix acceptance, or deployment readiness. Those gates remain separate. Stages 4–5 are ready for parent review; implementation stops before route-matrix additions and final captures.
