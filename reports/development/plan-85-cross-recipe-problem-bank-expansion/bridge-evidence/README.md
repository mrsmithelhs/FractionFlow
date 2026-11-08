# Plan 85 bridge probe — isolated evidence, corrected option bounds

## Artifacts and limits
`probe.html` is disposable mock UI. It uses Plan 84 CSS geometry values copied by reference from `src/app/styles.css`; it does not run production styles, renderer, scene, state machine, or accessibility semantics. `witness.mjs` reruns the full matrix and asserts every set has four distinct same-denominator options between zero and `max*d`, exactly one correct option, wrong-answer withholding, and identical whole-count explanations in visual and linear states. `observations.json` stores choices, states, labels, control bounds, geometry and explanations. The PNGs capture selected and accepted visual/linear states at the specified viewport before post-acceptance resize.

To reproduce, run `python enumerate.py` and `node witness.mjs` from this directory with the repository's Playwright dependencies installed. The witness uses Playwright's default Chromium unless `PLAN85_CHROME_PATH` names a local browser executable. It writes observations and screenshots here. The `-360` suffix is historical: the Chromebook case uses a 1366px viewport, as recorded in `observations.json`.

## Corrected options and explanation
All candidate values are within 0..max*d and distinct, including 2 9/10 on 0–3: choices are 27/10, 28/10, 29/10, and 30/10; 31/10 is excluded. The correct option index is computed and asserted exactly once. The selected correct form is shown only after Check. Both accepted views use the same explicit arithmetic, e.g. “2 wholes are 20/10. Add 9/10: 20/10 + 9/10 = 29/10.” Linear text names all whole benchmarks through the selected max endpoint.

## Exact arithmetic enumeration
- Denominators {2,4,8}, whole 1: 11 written forms / 7 reduced forms / 7 exact amounts.
- Denominators 2–10, whole 1: 45 / 31 / 31.
- Denominators 2–10, wholes 1 and 2: 90 / 62 / 62.
Per-denominator detail is in `enumeration.json`. These are mathematical capacities, not authored tasks.

## Browser mock observations
At exactly 360×740, normal root size: content 328px, axis 246px, no horizontal overflow. The same 1 9/10 point on 0–2 had 21 full ticks and 12.3px minimum spacing; on 0–3 it had 31 ticks and 8.19px spacing. The 2-whole midpoint and constrained 328px content-box examples on 0–3 also had 31 ticks / 8.19px. The 2-whole near-one case at 200% root text had axis 206px, 31 ticks, 6.86px minimum spacing and 4px horizontal overflow; its toggle wrapped to 135px height. The Chromebook-width proxy at 1366px had content 864px, axis 782px, 28 ticks (d9/0–3), and 28.95px minimum spacing. Normal controls were about 46px high. No pair of whole benchmark labels overlapped in sampled layouts. The sparse 0–3 mock retains whole benchmarks and only the selected fraction tick (5 ticks); it is an exploratory density variant, not a production recommendation.

Witness sequence captures selected state at 360, resizes while selected, returns to 360, checks the correct option, captures visual and linear accepted states, then resizes after acceptance. All state survived. The candidate correctness/bounds and matched explanation assertions passed in all seven cases.

## Unverified
200% means root font size, not browser zoom. The constrained case sets a 328px card width. The Chromebook width is a viewport proxy, not a physical device. Measurements and screenshots apply to this mock only; production behavior, focus, accessibility, real device rendering, learner comprehension and screen-reader output remain unverified. No production files were modified.
