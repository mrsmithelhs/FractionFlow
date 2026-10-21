# Plan 39 Requirement 0 — Mechanism proposal

Date: 2026-10-21  
Status: proposal for parent mechanism review; no `src/`, test, runner, dependency, packet-status, or completion edits made.

## Preflight and frozen baseline

- `node scripts/dev/plan-status.js check 39` returned `RUNNABLE: plan-39 is ready to implement`; `node scripts/dev/plan-status.js lint` returned `lint: OK (no violations)`.
- Checkout HEAD is `d98a722`. `git status --short` was empty before this report. Comparing `436e54a` (Plan 42 production B) to HEAD for `src/`, `tests/`, `package.json`, `package-lock.json`, and `scripts/dev/run-route-matrix.js` returned no changed paths. The current task therefore reuses the accepted production-B baseline without rerunning the broad suite.
- Plan 42 records 496 passing unit tests at corrected production B in `parity-evidence.md`; `evidence/build-receipts.json` records successful learner and full builds at B; `evidence/production-b-route-matrix.json` records Chrome, 81 rows, 83 executions, 83 passed, zero failed. These are historical receipts at B, preserved because executable inputs and route runner are unchanged here; they are not new runs at `d98a722`.
- Live `src/interaction/replay.js` exports sequential schemas v1 through v6; v6 is the current maximum, so Plan 39 should reserve v7 for the bridge. Historical envelopes must retain their existing dispatch and serialized shapes.
- DECISION-046 explicitly leaves the §31 bar-stability and §90 representation checkpoints as prerequisites. Plan 40 owner acceptance adopts its bounded Phase 3 bar baseline and its `progress.md` includes the §31/§90 exit assessment, then authorizes readiness for Plan 39; Plan 42 owner acceptance records closure of the intervening maintenance pilot and authorizes Plan 39. DECISION-047/048 and Plan 39 frontmatter record the Option A sequence and satisfied prerequisite dispositions. This is sequencing readiness, not learner efficacy or broad denominator-capacity evidence.

## Proposed scope and exact ownership

Keep the existing pipeline: authored fractions and `src/math/` determine exact truth; the episode stores instructional response and recovery; scene projection withholds target identity until resolve; render modules communicate validated state. No pixel or floating-point comparison decides correctness.

Use the existing content modules and add only the packet's named files:

- `src/content/data/plan37-bar-to-line-bridge-records.js`: eight immutable records keyed `bridge-01-half-2` … `bridge-08-five-sixths-med`, each with the exact source bar fraction, `partitionDenominator` for high support, and exactly four `sparseCandidates` for medium support. Preserve `2/4` in item 05. Export the named record collection (no per-record behavior branches).
- `src/content/plan37-bar-to-line-bridge-task.js`: export task data `plan37-bar-to-line-same-amount@1`, practice set `bar-to-line-same-amount-vetted-set@1`, record validation, and exact candidate/source validation. Materialize via existing `authored-problem-materializer.js` and register through `authored-content-catalog.js`.
- `src/content/eligibility.js`: admit representation `number-line` only when the already-validated family/task identity is `bar-to-line-same-amount` and definition `phase-4-bar-to-line-same-amount@1`; keep arithmetic-family number-line results `NOT_IN_PHASE_2`. No global representation plugin or Phase 2 lifting.
- **Unary content path:** the inspected authored materializer validates a binary `left`/`right` record and arithmetic recipe; do not encode this location task as a fake `a + 0`, duplicate operand, or invented arithmetic result. Add a narrowly scoped bridge record validator/materializer and bridge catalog registration that returns one source fraction plus bridge identity/candidates and no binary `sourceForms`; dispatch only this family through it. Adapt the app's shared practice-session startup and replay entry using explicit bridge identity guards so it can construct the same episode shell from one authored source form. Preserve existing binary materializer, catalog, `contentIdentity` reconstruction, and replay contracts byte-for-byte for old families. If the current catalog's shape cannot admit a unary bridge without broad changes, stop and report the precise boundary for a separate mechanism decision rather than generalizing the whole catalog.
- `src/interaction/episode-definition.js`: register definition `phase-4-bar-to-line-same-amount@1` with frozen `encounter`, `locate`, `resolve` schedule. `episode.js` handles `acknowledge-bridge-encounter`, `propose-number-line-location`, `request-task-help`, and `finish-compact-episode`; only exact `equalFractions` reaches resolve. Wrong submissions stay in locate with exact proposed form and derived recovery classification.
- `src/interaction/replay.js`: introduce `REPLAY_V7_SCHEMA_VERSION`, bridge-only exact `taskContext`, bridge intent allowlist, and dispatch restrictions: Plan 39 definition requires v7; v7 is rejected for other definitions; earlier versions remain immutable. Context should identify practice-set/task-data revisions, item/fixture/authoring identity, definition identity, recipe identity and exact source form plus curated candidate data needed to reconstruct. Unconfirmed preview and help-open/close UI state are not learner intents and never serialize. Frozen full-state oracles should cover every item under both supports plus at least one prior v6 and older compatibility case, including completed replay.
- `src/interaction/scene.js`: project `meaning.numberLine` with `{domain:{lowerWhole:'0',upperWhole:'1'}, densityMode, benchmarks, candidatePositions, acceptedPosition, alignmentGuideVisible}`. Candidate descriptors contain only stable id, exact form, step index/count and benchmark relation. Do not include target/correct flags, target ids, or a target-specific candidate ordering. During encounter/locate accepted position stays null and guide false; resolve alone exposes accepted exact form and alignment guide.

### High-support candidate policy conflict requiring gate reconciliation

The Plan 39 scope bullet currently specifies selectable interior steps `1/b`…`(b-1)/b`, while the adopted Plan 37 scene example includes `0/b`…`b/b`, its seed table includes endpoint distractors, and Plan 39 requires reachable `at-endpoint` recovery. Recommend making all partition positions including endpoints selectable for high support. This preserves the adopted reference design and makes endpoint recovery reachable; the owning mechanism gate should reconcile the Plan 39 wording before source work. For odd `b=3`, the separate `1/2` benchmark remains a visual, non-selectable anchor: it is not a partition candidate. Exact duplicate coordinates (e.g. `2/4` and the half benchmark) must not produce duplicate candidate controls.

## Episode response, recovery, and preview ownership

Let `c = compareFractions(proposed, target)`, and derive each magnitude via `classifyMagnitude` against the exact half benchmark (using `benchmarkFraction('half')` as the comparator input where needed). Apply recovery precedence:

| Condition | Classification |
|---|---|
| proposed equals target | accept; transition locate → resolve (not a recovery) |
| proposed is exactly 0 or 1 | `at-endpoint` |
| proposed and target are on different sides of 1/2, including exactly-half versus non-half | `wrong-side-of-half` |
| both are below half and `c < 0` | `too-low-same-side` |
| both are below half and `c > 0` | `too-high-same-side` |
| both are above half and `c < 0` | `too-low-same-side` |
| both are above half and `c > 0` | `too-high-same-side` |
| both equal half but differ in raw representation | equality accepts via `equalFractions`; no recovery |

The preview is UI state, not instructional truth. Plan 42 shows the actual seam: app-local drafts/focus flags in `src/app/app.js`; `createOperateResponse` builds and validates mounted controls and exposes read/write/focus lifecycle in `src/render/operate-response.js`; beat renderers own operation control construction and disposal. MAINT42B asks Plan 39 to assess preview fit; the operation-region pattern is evidence and a candidate, not a forced fraction-shaped schema or permission for all-region extraction.

Proposed narrow fit: a `createNumberLineLocateRegion(...)` in a new `src/render/number-line-locate.js` owns candidate selection controls, native radio group for linear view, selected candidate exact-form read, preview read/write, submit dispatch, current mounted-control validation, and `dispose()` invalidation. The app owns an opaque task-local preview handle/value plus focus timing and reset policy, following the operation-local handle lifecycle only where useful; do not parse a fraction form in generic app orchestration. Visual/linear region adapters may expose the same narrow handle shape or a shared region when that avoids duplicate selection semantics; no remount-token, recovery-shell, or other-region refactor. Renderer owner remount/disposal always invalidates handles. View changes capture/write preview before replacing the region and restore it after mount; leaving locate, accepted submit, retry, next item, exhaustion, or return clears it. Help open/close stays app-local and does not enter replay. Focus transitions remain shell/app-owned and deterministic.

## Density, geometry, labels, and alignment

The current responsive route evidence measures a 360px viewport with a 234px prompt/control area in the sampled Plan 38/40 finish state. Plan 37 estimated a 312px track by subtracting only 48px of outer margin, but the active card also has internal padding; that estimate is not reliable for Plan 39. Plan 40's 1093×614 scaled viewport has a 692px prompt/control width and vertical scrolling, showing why actual track bounds must be measured independently from viewport width. A number-line track does not yet exist, so exact Plan 39 bar/line measurements cannot be honestly claimed in Requirement 0. The runner must record the mounted `.app-episode`/`.active-beat-section` inner track width and both bar/line edge coordinates in the later staged browser work at 360×740/752, 1366×768, and 1093×614 @ DPR 1.25; do not substitute these unrelated current controls for the new track.

Use a shared alignment frame with one measured content width and same inline padding for the persistent bar and line SVG/HTML track; put both endpoints at the same frame edges and attach labels/connectors outside the measured track. Assert actual `getBoundingClientRect()` edge deltas <=1px, with SVG viewBox and CSS width both derived from the same frame. The bar shade endpoint and line candidate x coordinate use presentation ratios for drawing only; mathematical equality remains exact in `src/math/`.

At usable width 218–278px, partition intervals are: b=6, 36.3–46.3px; b=8, 27.25–34.75px. Medium sixth-spaced candidates are likewise 36.3–46.3px apart. When adjacent center spacing is below 44px, use deterministic alternating upper/lower hit-target tiers with each clickable target at least 44×44px; adjacent controls in the same tier are two or more partition steps apart. Stagger b=6 too whenever measured track width is under 264px. At b=8 stagger all; sparse sixth candidates use the same alternating layout when measured spacing is under 44px. Edge candidates need full-size hit targets within the padded control frame, with track extending enough inside that frame to keep target boxes non-overlapping; if that cannot be met, use a single >=44px stepper/roving position control instead of shrinking or overlapping targets. This decision is a rendered-geometry gate, not something CSS arithmetic alone proves.

The visual track permanently labels only `0`, `1/2`, `1`; in b=3, half is a non-selectable anchor between partition ticks. High support uses selectable partition positions (subject to the endpoint-policy gate above). Medium support uses the four authored exact candidates, without adding fake binary/arithmetic operations. Linear mode uses native radio labels `Step k of b between 0 and 1` for partition choices, and distinct `Point A/B/C/D: <exact candidate form>` labels for sparse choices. Candidate descriptions may state exact candidate values because values do not identify the target; do not use target-relative “too low”, side buckets, selection prechecks, or labels copied from the prompt. This ensures 1/6 vs 1/3 and 4/6 vs 5/6 remain distinguishable without indicating which matches the bar.

## Stage and evidence plan

1. Requirement 0 mechanism disposition and packet-wording reconciliation; no source before parent approval.
2. Stage 1: fixed records, catalog materialization, scoped eligibility; content tests.
3. Stage 2: definition, exact intent/recovery and v7 replay; historical plus frozen bridge oracle tests.
4. Stage 3: scene projection and withholding invariants; complete those tests and stop for Checkpoint 1 before any renderer/styles/app edit.
5. Stages 4–5: visual and linear controls, aligned bar/line, app focus/help/preview lifecycle; mounted tests and bounded 360/125%-zoom Chrome geometry/accessibility probe. Then stop at Checkpoint 2 before any route-matrix edits.
6. Stage 6: append new routes only, preserve historical row/context mappings, implement five falsification seeds, snapshot and restore exact prior evidence artifacts, capture bounded new evidence, and write final progress. Never infer owner rendered-page/agency acceptance or deployment authorization from technical checks.

Baseline route evidence already requires explicit Chrome; the recorded Edge launch failure is not grounds to alter the runner. Existing root Playwright dependencies are to be reused; do not install packages. No advisor consultation was warranted for this report-only Requirement 0 proposal; parent owns the requested read-only Sol mechanism review and any later advisor disposition before source work.

## Gate questions for parent

1. Approve or revise the scoped opaque task-local preview handle and ownership split described above.
2. Reconcile high-support endpoint candidates with the adopted Plan 37 contract and Plan 39 interior-only packet bullet.
3. Approve exact v7 context and frozen oracle inventory before Stage 1/2 implementation.
4. Treat geometry numbers here as calculations against the packet's measured usable-width range; require mounted Plan 39 track measurements at the later gates because no Plan 39 track exists yet.
5. Keep bridge materialization unary and scoped; authorize only the minimal app/catalog/replay adaptation needed to start and reconstruct this practice family, with no fake binary arithmetic payload and no old-contract changes.

No source edits, tests, route runs, packet status changes, owner rendered-page acceptance, or deployment were performed under Requirement 0.
