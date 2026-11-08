# Plan 85 bridge wave 2 — disposable narrow comparison

## Scope and reproduction

This report-local folder contains an isolated synthetic mock copied from the earlier Plan 85 bridge probe. No production file was edited. The mock does not execute the FractionFlow renderer, episode state machine, production styles, or accessibility semantics. Playwright Chromium drove the mock; `witness.mjs` imports the checkout's Playwright package. Run `node witness.mjs` from this folder with repository dependencies installed and Chromium available; set `PLAN85_CHROME_PATH` for a local browser executable. Outputs are `observations.json` and three screenshots per case (selected, accepted visual, accepted linear).

`probe.html` and `witness.mjs` are the reproducible source. The probe adds explicit benchmark centering and a wrap-safe title to make the geometry and heading measurable. Those are mock-only controls; they are not product fixes. Mathematical enumeration is retained in `../bridge-evidence/`; this wave did not change it.

## Matrix and measurements

The same 1 9/10 point is compared on 0–2 and 0–3 at 360×740 with 100% and 200% root font size. Full and sparse 0–3 variants are tested at both sizes. Additional cases include a two-whole midpoint, 2 9/10 at 200%, a denominator-9 Chromebook-width proxy (1366px), and a 328px constrained card. The 200% setting changes root text size, not browser zoom. Chromebook remains viewport-only; constrained card is not equivalent to browser zoom.

At normal root size, the same 1 9/10 point has 21 ticks / 12.30px minimum spacing on 0–2, versus 31 / 8.19px on 0–3. At 200%, the values are 21 / 10.30px and 31 / 6.86px. Sparse 0–3 has five marks (four whole benchmarks and selected fractional tick) and 6.88px spacing at 200%; it retains the same 206px axis. The checked CSS positions place each tick, whole benchmark, and selected marker at the expected ratio across the range.

The title is explicitly set to wrap at the mock's body text size. Its scroll width equals its available width (286px) in each 360px case. With that heading control in place, document horizontal overflow measured 0px in all cases. An earlier mock draft showed 4px overflow because the title itself exceeded its box; that result is withdrawn and must not be attributed to the axis or product. This follow-on therefore does not establish browser-zoom overflow behavior.

## Marker and label geometry

The witness separately measures axis-aligned bounding-box intersection between the marker and benchmark-label boxes, and marker/tick boxes. This is a geometry overlap detector only: it does not inspect stacking order, clipping, opacity, or pixel paint, so 'occlusion' below means bbox intersection, not confirmed visible paint obstruction. The marker covers the selected tick by design; this is distinct from label-box intersection. Sequential label-box overlap is also measured separately.

For 1 9/10 on 0–2, there is no marker/benchmark-label occlusion at normal root size; at 200%, the enlarged marker covers the 2 label. On 0–3, the marker covers the 2 label at both 100% and 200%. Sparse 0–3 also covers the 2 label at both sizes, so reducing the count of fractional ticks does not prevent this near-whole collision. The 2 9/10 sample covers the 3 label at 200%. Benchmark labels do not overlap sequentially in these sampled cases.

## Explicit witness assertions

`observations.json` includes a top-level assertion record. The witness now fails if: the result is visible on initial mount, after selecting but before Check, or after a wrong Check; a wrong Check accepts; selected radio/state is lost across pre-acceptance resize; the accepted result panel or accepted state is lost across resize; visual and linear explanation text differs; tick, benchmark, or selected-marker positions deviate from the expected range ratios; title content exceeds its box; or document overflow appears. All ten matrix cases passed these assertions. Initial, selected-before-Check, and wrong-answer visibility are checked by both the `.hidden` class and computed display/zero layout box. Accepted panel visibility is checked through the class and computed display.

## Interpretation and unresolved limits

This mock shows that wider scales increase full-tick density at narrow widths, and that sparse ticks alone do not stop a near-whole marker from covering its benchmark label. It also shows that marker size can make the 0–2 near-whole case collide at 200% even when it does not at normal root size. These measurements do not establish production-renderer behavior or learner interpretation. Actual browser zoom, physical Chromebook rendering, keyboard-only interaction, assistive-technology output, focus order, and learner comprehension remain unobserved. A production-faithful prototype and rendered/accessibility review remain necessary before recommending a wider publication boundary or per-task capability policy.
