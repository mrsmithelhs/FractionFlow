# Plan 42 guarded baseline A checkpoint

Date: 2026-10-20

Plan preflight: `node scripts/dev/plan-status.js check 42` → `RUNNABLE: plan-42 is ready to implement`.

Approved mechanism: `requirement-0-review.md` (parent-approved Requirement 0; Sol-medium read-only review).

Pre-guard source baseline: `246f770b40ddc8ede74b94f634e4a4d38b809485`.

Guard commit / baseline A: `d7936a71bbbb099fb9394a727bbac1d751e79afa` (`test: strengthen Plan 38 operate draft focus guard`).

## Changes in baseline A

- `tests/routes/route-matrix.json`: strengthened only `ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION`. It checks numerator and denominator raw values after each direction. A real pointer click focuses the primary numerator before pointer activation of the view toggle; after switching, focus must be on the newly mounted primary numerator. A separate keyboard Enter activation from the focused toggle checks both values and that focus remains on the toggle. This preserves the observed contract: pointer focus preservation targets the primary field only; denominator focus transfer is not promised.
- `scripts/dev/run-route-matrix.js`: added two scoped Plan 38 seeds at the pointer-switch boundary. One clears the newly mounted denominator after the app's toggle handler; one focuses that denominator after the handler. Both use the route's ordinary value/focus assertions and are counted as intended seed detections only when the expected assertion fails.
- `tests/route-contract.test.js`: registers the two named Plan 38 seeds.
- `tests/render-purity.test.js`: replaces the hand-maintained render filename list with a flat `.js` inventory of `src/render/`; the same math/content/arithmetic purity assertions now automatically include future top-level render modules, including the proposed response module. This matches the current flat `src/render/` layout; it is not a recursive nested-directory inventory.

No stale-node assertion repair was needed in the affected draft evidence: the browser route runner re-resolves page locators for each assertion, and `tests/plan38-rendered-subtraction.test.js` queries the newly mounted linear controls after the first switch and the newly mounted visual controls after switching back. The route previously lacked value/focus assertions; that gap is repaired here. No broader test cleanup was done.

## Exact verification

- `npm run build` — passed before browser guard execution. Vite built 64 production modules and the subtraction prototype; no `src/` file changed between that build and the browser checks, so the product under test was unchanged.
- Clean browser witness: `node scripts/dev/run-route-matrix.js --filter ROUTE-PLAN38-VIEW-TOGGLE-DRAFT-PRESERVATION --browser-channel chrome` — 1 route row / 1 browser execution passed. The route checks both raw fields after the pointer switch and after keyboard activation, pointer primary-field focus, and keyboard toggle focus. Actual result object: [guard-baseline-a-clean-route.json](evidence/guard-baseline-a-clean-route.json).
- Failing-first draft-loss probe: `node scripts/dev/run-route-matrix.js --plan38-witness-seed operation-draft-loss --browser-channel chrome` — 1 intended seed detected, 0 unexpected failures. The ordinary route assertion observed denominator `""`, expected `"8"`. Receipt: [guard-baseline-a-draft-loss-seed.json](evidence/guard-baseline-a-draft-loss-seed.json).
- Failing-first wrong-focus probe: `node scripts/dev/run-route-matrix.js --plan38-witness-seed operation-wrong-focus --browser-channel chrome` — 1 intended seed detected, 0 unexpected failures. The ordinary route assertion expected the linear numerator to be focused after pointer switching. Receipt: [guard-baseline-a-wrong-focus-seed.json](evidence/guard-baseline-a-wrong-focus-seed.json).
- `npx vitest run tests/route-contract.test.js tests/render-purity.test.js` — 2 files, 37 tests passed.
- `node --check scripts/dev/run-route-matrix.js` — passed.
- Route JSON parse plus unique action-step check — passed; 14 actions, 14 unique step numbers.
- `git diff --check` — passed.

The runner auto-selected managed Edge on its first attempt, but Edge closed during launch after failing to replace temporary profile site-list files under the sandbox temp path. The same focused browser checks completed with installed Chrome via explicit `--browser-channel chrome`; no application or route failure was reported by the Edge attempt.

The route runner rewrites the tracked Plan 38 route-summary artifact after a Plan 38 run. Before re-running to persist receipts here, the artifact's SHA-256 was `568DD3DE127F20123407CB12D9E722B8DA8132A6C312A8D5501D3060C5E0624F`. After all focused runs, only that exact file was restored from baseline A. Its SHA-256 again equals the recorded pre-run value, and its Git blob equals `HEAD:reports/development/plan-38-like-denominator-subtraction-batch/evidence/plan38-route-matrix-summary.json` (`6ecb3e2385ecc4536d3e1d31bab1e04f49b74aba`). The focused route contains no screenshot actions, so no historical screenshots or viewport measurements were generated or changed.

## Disposition

Stage 1 is delivered for orchestrator review at baseline A. This checkpoint does not authorize response-region extraction. No source/app modules, other route rows, historical fixtures/evidence, packet status, owner decisions, Plan 39 files, dependencies, or deployment state changed. The Stage 1 guard commit is separate from this checkpoint commit. Advisor disposition: the approved Requirement 0 mechanism received a Sol-medium read-only review; this implementation checkpoint is submitted for the parent's independent review, which retains advisor dispatch and the extraction gate.
