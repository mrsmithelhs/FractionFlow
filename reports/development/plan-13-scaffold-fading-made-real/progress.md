# Plan 13 implementation progress

- Date: 2026-10-02
- Packet status: left unchanged (`in-progress`)
- Implementation commit: `85f995a feat(plan-13): make scaffold fading reachable`
- Ready for orchestrator delivery review: **yes**

## Overall summary

Connected the entry-page reviewer gear to episode support configuration. The app now offers exactly the approved high and medium profiles, with complete maps for all six support dimensions. High support keeps all six dimensions high. Medium support lowers only `fractionBarModel` and `commonDenominator`; equivalent numerators, prediction, symbolic integration, and help/replay remain high.

The common-denominator consequence is reachable from the mounted entry controls: high support offers the existing denominator choices, while medium support presents numeric entry using the same `propose-common-denominator` intent and existing validation/recovery. The premise comparison consequence is projected in the instructional scene from `state.support.dimensions.fractionBarModel`; renderers consume that projection. High displays both bars. Medium withholds only the source bar, shows the source fraction in visible text, retains the new bar, and leaves the same premise question and yes/no choices available. The linear path retains its explicit source and presented fractions and premise choices.

The selected configuration is copied into a new episode and remains fixed for that episode. Retry starts fresh with the selected profile. Returning to entry permits a new reviewer selection, which is applied to a fresh episode on re-entry. Reload and recognized fragment launch use the high default. No persistence or query/fragment support override was added. Replay envelope v1 shape and registration remain unchanged; replay retains the full support map.

No math, authored premise content, content identity, response choices, or adaptive policy was changed. No packet status, orchestrator note, or generated packet index was edited in this implementation.

## Behavior and route evidence

The route matrix retains the original 29 rows and 31 executions, including the subtraction prototype witnesses, and adds 10 mounted-entry support routes for 39 rows and 41 executions total. The matched high/medium routes select the profile through the visible gear and compare decide, denominator-12 premise, and denominator-24 premise captures at the same viewport and motion condition. They assert the actual choice/input difference or actual source-bar/text difference, not only profile metadata.

At both support levels, route witnesses preserve the same authored task and decisions:

- Denominator 12: enter `8/12` and `3/12`, calculate `11/12`, then judge the false premise `2/3 -> 7/12`. The true and false judgements are both exercised at each support level.
- Denominator 24: enter `16/24` and `6/24`, calculate `22/24`, then judge the true premise `2/3 -> 16/24`. The true and false judgements are both exercised at each support level.
- The medium false-premise route enters an invalid denominator (`11`), checks the existing recovery feedback, then enters `12` and continues. A focused entry test checks the same correction path.

Matched screenshots and browser measurements are saved under [`evidence`](./evidence/):

- Reviewer gear: [`reviewer-gear-360x740.png`](./evidence/reviewer-gear-360x740.png)
- Decide: [`high-decide-360x740.png`](./evidence/high-decide-360x740.png), [`medium-decide-360x740.png`](./evidence/medium-decide-360x740.png)
- False premise, denominator 12: [`high-premise-false-12-360x740.png`](./evidence/high-premise-false-12-360x740.png), [`medium-premise-false-12-360x740.png`](./evidence/medium-premise-false-12-360x740.png)
- True premise, denominator 24: [`high-premise-true-24-360x740.png`](./evidence/high-premise-true-24-360x740.png), [`medium-premise-true-24-360x740.png`](./evidence/medium-premise-true-24-360x740.png)
- Complete bounds, participation, and lifecycle output: [`measurements.json`](./evidence/measurements.json)

## Per-beat measurements

`measurements.json` contains 32 records: eight beats × two support profiles × two viewport heights (360×740 and 360×752). The question and control coordinates below were identical at both heights. Question and active-control bounds are viewport-relative CSS pixels. “Controls” gives the first active control's top through the last active control's bottom. The scroll height column lists high/medium document heights.

| Beat | Question top–bottom | High controls top–bottom | Medium controls top–bottom | Document height high / medium |
|---|---:|---:|---:|---:|
| encounter | 428.72–453.91 | 484.84–528.84 | 484.84–528.84 | 812 / 812 |
| notice | 428.72–479.09 | 510.03–610.03 | 510.03–610.03 | 913 / 913 |
| decide | 428.72–504.28 | 535.22–579.22 | 583.22–630.22 | 923 / 974 |
| transform-left | 428.72–479.09 | 558.03–605.03 | 558.03–605.03 | 968 / 968 |
| transform-right | 428.72–479.09 | 558.03–605.03 | 558.03–605.03 | 968 / 968 |
| operate | 428.72–479.09 | 538.03–585.03 | 538.03–585.03 | 929 / 929 |
| resolve | 428.72–453.91 | 484.84–528.84 | 484.84–528.84 | 873 / 873 |
| reflect | high: 512.78–588.34; medium: 475.78–551.34 | 619.28–733.28 | 582.28–696.28 | 1077 / 1040 |

All 32 measurements report document width 360px, no horizontal overflow, and vertical overflow requiring ordinary page scrolling. Every active question and active control is within the viewport at both heights. The full scene extends below the viewport on reflection and on medium-support denominator entry; the active task controls themselves remain in view. Lower non-active page content therefore still uses normal vertical scrolling.

## Participation, focus, reset, and replay

The browser evidence records successful completion at both support levels for keyboard interaction, touch-context interaction, reduced-motion preference, and linear-path participation. Focus was on the reviewer gear after profile selection and on the episode after start. Existing route witnesses for replay input/DOM identity, visual and linear “Done looking” focus return, and entry keyboard order remain in the matrix and passed. Retry retained medium support and cleared the prior episode's beats. Reload selected high by default. Returning to entry restored focus to the entry title; changing to high and re-entering created a fresh high-support episode.

The touch path used Playwright touch events in a touch-enabled browser context. It did not use a physical device or native on-screen keyboard. Keyboard evidence used browser key events with focus placed on mounted controls by the automation harness. No assistive technology or screen reader was tested. These are browser participation checks, not evidence of physical-device or assistive-technology acceptance.

Replay tests JSON-round-trip a v1 envelope with each complete six-dimension profile and compare the reconstructed full episode state. Existing replay coverage, including legacy replay oracles and retry behavior, also passed. The packet's existing recognized-fragment launch path calls episode construction with the app's high default; support is not read from the fragment.

## Files changed

- App selection and profile registry: `src/app/app.js`, `src/app/index.js`, `src/app/support-levels.js`.
- Configuration and upstream projection: `src/interaction/support.js`, `src/interaction/scene.js`.
- Projected visual and linear render identity, source-bar behavior, and styling: `src/render/beat-container.js`, `src/render/linear-path.js`, `src/styles/render.css`.
- Route runner and matrix: `scripts/dev/run-route-matrix.js`, `tests/routes/route-matrix.json`.
- Tests: `tests/app-shell.test.js`, `tests/entry-page.test.js`, `tests/interaction-provenance-replay.test.js`, `tests/interaction-scene.test.js`, `tests/route-contract.test.js`, `tests/support-configuration.test.js`.
- Browser evidence capture: `scripts/dev/capture-plan-13-evidence.mjs` and the eight files in `reports/development/plan-13-scaffold-fading-made-real/evidence/`.

## Validation performed

- Preflight `node scripts/dev/plan-status.js check plan-13`: `RUNNABLE: plan-13 is ready to implement` (also rechecked after the implementation commit).
- Focused support, entry, scene, replay, and route-contract tests: 57 passed.
- `npm test`: 24 test files and 278 tests passed.
- `npm run build`: learner build and subtraction prototype build passed.
- `npm run test:routes`: all 41 expanded executions passed across 39 matrix rows, including retained prior routes and Plan 15 prototype witnesses.
- `node scripts/dev/capture-plan-13-evidence.mjs`: completed with seven screenshots, 32 beat measurements, and eight participation records.
- `node scripts/dev/plan-status.js lint`: OK, no violations.
- `git diff --check` and staged diff check: passed.
- Packet frontmatter remains `in-progress`; no status setter was run and no push or deployment occurred.

## Advisor disposition

One read-only pre-delivery consultation was run because this change has a user-facing behavioral surface. Requested override: `gpt-6.1-sol`, medium effort. The advisor reported its identity as “GPT-6 based Codex” and stated it could not attest to a more specific runtime model variant. Thus the requested model is recorded, but the exact override was not independently observable.

The child platform did not expose a verifiable structural read-only capability. The consultation was instruction-read-only with post-hoc verification: its bounded prompt prohibited edits and further delegation; the advisor said its critique used the inline excerpts and was not an independent repository inspection. Immediately afterward `git status --short` showed only the expected Plan 13 working changes and `git diff --check` reported no whitespace issues. No advisor-originated changes were observed; the primary remained the sole writer. Cost: one advisor turn, approximately two minutes.

The advisor reported no confirmed correctness defect. Its verification priorities and dispositions were:

| Advisor priority | Independent verification and disposition | Resulting change |
|---|---|---|
| Verify retry retains a fixed episode profile and entry selection cannot alter the active episode. | Accepted. `startPractice` constructs state from the selected profile; the gear is only mounted on entry; the episode stores its configuration. Entry tests cover medium retry retention and a changed selection on fresh re-entry. | No code change required. |
| Confirm matched routes preserve operands, task, choices, and wrong-denominator recovery. | Accepted. Inspected the matched route assertions for both premise cases: they assert source/presented fractions, the same question, and both response choices. The medium denominator-12 route asserts recovery before correction; all four judgements per profile are present. | No code change required. |
| Verify replay-v1 and prior route/fragment compatibility. | Accepted. Tests retain envelope schema `fractionflow.episode-replay/v1`, compare full state after JSON round-trip, and preserve the original 29 route rows / 31 executions before the ten additions. App initialization defaults to high before recognized-fragment episode start. | No code change required. |
| Check source text order and focus boundaries; record actual AT/device limits. | Accepted. The source reference is visible DOM text outside the bar image; existing entry tests and browser capture check selection/start/return focus. The evidence states that physical-device typing and assistive technology were not tested. | No code change required; limitations remain explicit. |
| Owner must still judge the visual and agency tradeoff. | Accepted and retained as the delivery gate. The screenshots show the actual matched premise comparison; technical evidence does not decide whether the support change is appropriate for learners. | Owner rendered-screen and agency acceptance remain required. |

No advisor finding was rejected. The advisor's conclusion is not treated as packet acceptance.

## Problems and remaining gates

The sandbox denied ordinary Git index writes (`.git/index.lock: Permission denied`) even though no lock file existed; the harmless `git add --refresh -- .` probe confirmed the metadata-write restriction. Repository guidance allowed a narrowly scoped elevation, which successfully staged and committed only the explicit Plan 13 implementation/evidence paths. No ACL was changed.

The owner must review the rendered high/medium screens and make the required agency acceptance decision. This implementation does not close OQ-22 or claim Roadmap §22 is satisfied. Delivery review should also confirm the intended premise-comparison demand and the entry-menu descriptions. Packet status remains owner/orchestrator-controlled.

## Orchestration delivery update — 2026-10-04

Technical review accepted the implementation. The owner said the screenshots were OK, subject to the question wording now applied exactly: `Does the "New parts" bar show the same amount as the starting fraction?` The existing text assertions were updated; seven screenshots, 32 measurements, and eight participation records were regenerated. The reflection row above reflects the new wording. All questions/controls fit in the captured state with the recorded scroll position; ordinary page scrolling remains.

Route-accounting clarification: the prior 29 route IDs and 31 executions were retained, but four high-premise rows gained explicit support selection, additional assertions, and broader captures. Their original assertions and reciprocal targets remain; they were not byte-identical rows. Orchestration's copy edit then changed only literal question assertions. Independent suite/build/all 41 executions and packet lint/diff checks passed after the edit. See `delivery-review.md` and `owner-disposition.md` for evidence and bounded acceptance; no push or deployment was made.
