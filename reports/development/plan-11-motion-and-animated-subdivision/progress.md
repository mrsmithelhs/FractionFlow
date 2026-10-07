# Plan 11 progress — Motion and animated subdivision

Date: 2026-10-04

Implementation commit: `9430c4c` (`feat(plan-11): animate fraction subdivision`)

## Summary

Implemented the approved animated in-place renderer path. The renderer now retains the bar root, track, fill, readout, and existing rational-position boundaries as it adds the boundaries for the new denominator. A finite Web Animations effect reveals only those newly added boundaries. It starts once when the mounted bar observes an accepted pre-form to post-form conversion, and again only when the learner activates **Show new parts** from Replay. The animation does not dispatch actions or change instructional state.

Replay continues to show its starting fraction until the learner asks to reveal the new parts. Reflection Inspection Mode remains a separate static presentation; its visual and linear Done Looking focus-restoration routes still pass. Reduced motion reaches the same fraction endpoint immediately and cancels a running effect. Juxtaposed and sequential comparison renderers remain static. No math, content, interaction, scene, condition registry, or packet status files were changed.

Bundle 1's parked label is restored to **Smooth change**, with the concrete description “The old parts split into smaller parts when you choose.” The obsolete parking comment is removed. This wording describes the observed action without presenting animation or in-place choreography as preferred; D-01 and D-02 remain open prototype variables.

The copy follows DECISION-004's grade 2–3 guidance: it names the familiar “old parts” and the action “split into smaller parts” without specification vocabulary.

## Browser evidence

The route matrix remains at **39 rows and 41 browser executions**. The prior route IDs are retained. Browser witnesses operate the mounted learner controls; they do not call the renderer directly. The new observer checks DOM identity for the root, track, fill, and old boundaries; it requires executed animation on each new boundary, samples partial paint, verifies settled geometry, and records question/control bounds and scroll position at rest, mid-motion, and settlement.

At 360×740 in `ROUTE-COND-1-TRANSFORM`, the whole track measured x=41, y=149, w=218, h=44; the fill measured x=43, y=151, w=142.656, h=40. At progress 0.186, a new boundary measured 7.44px of the 40px track height. It settled at 40px. Whole-track and fill geometry deltas were 0 throughout; both existing boundaries retained their DOM nodes, position, and 40px height. The active response controls stayed within the viewport. The measured question was y=420.72–471.09 and controls y=502.03–597.03, with scrollY=12.

At 360×752 in `ROUTE-REPLAY-COND-1`, the ordinary accepted conversion animated first. Replay then held the pre-state until the learner clicked **Show new parts**, which produced a second executed animation over nine new boundaries. The track remained x=41, y=161, w=218, h=44 and the fill x=43, y=163, w=142.656, h=40; old boundaries and these bounds had zero measured drift. The question and controls were visible at rest, mid-motion, and settlement. Before the reveal, controls ended at y=648.88; after the replay controls closed they ended at y=609.03, within the 752px viewport. The button was measured at a 24px-or-larger target before activation.

At denominator 24, both support profiles were exercised through real conversions. The 2/3→16/24 conversion added 21 boundaries; 1/4→6/24 added 20. Existing boundaries, track, and fill stayed fixed. Under high support, the right-side conversion began while the preceding left-side effect still had 21 running boundary animations. The medium-support route observed both conversions independently. Under reduced motion, both conversions reached 16/24 and 6/24 immediately with zero active animations and the same post-state semantics.

Static assertions cover juxtaposed and sequential presentations, reduced-motion output, rejected conversion, replay/reset/re-entry, and visual/linear reflection inspection. The visual and linear focus-restoration routes remain in the matrix. The shared no-motion witness now examines every fraction track in the selected view, refuses a missing configured root, and checks running animation on bar/inspection presentation while excluding interactive control feedback.

## Advisor consultation and disposition

**Branch A — consultation ran** for this real behavioral change.

- Requested override: `gpt-6-sol`, low effort.
- Advisor's self-report: “GPT-6-based Codex agent.” The agent could not independently verify the exact model variant or effort, so the requested override is not represented as independently observed identity.
- Read-only posture: instruction-read-only in a shared workspace; the tool surface did not provide an independently enforceable read-only filesystem sandbox. Post-consultation verification found no advisor edits: `plan-11` still checked `RUNNABLE`, `git diff --check` was clean, and only the six implementation paths were modified/staged by this task.
- Cost: one short reviewer pass and one post-consultation verification; roughly a few minutes elapsed.

| Advisor finding | Independent verification and disposition | Result |
|---|---|---|
| The layout witness measured active controls only after settlement and compared viewport-relative bounds against a scroll-adjusted threshold, so it could miss controls below the viewport during motion. | **Accepted.** Inspected the observer and the Replay route's scroll action. The observer now records full question and control rectangles plus viewport size and scroll offsets before the click, at the sampled partial boundary frame, and after settlement. Visibility is checked against viewport-relative bounds (`0` through `innerHeight`). The final 39/41 browser matrix passed. | `scripts/dev/run-route-matrix.js` |
| The no-motion assertion queried only the first track and silently passed when the selected view had no matching root. | **Accepted.** Inspected the query and visual/linear reflection routes. The assertion now requires the configured root, scans all tracks under each selected root, counts track animations, and checks active animation targets in bar and reflection visual presentation. The full matrix passed; a temporary CSS animation on juxtaposed tracks made its route fail with two active animations. | `scripts/dev/run-route-matrix.js` |

Rejected findings: none. The advisor reported no confirmed renderer defect and did not rerun the browser matrix; browser measurements above are this implementation's run, not advisor-reproduced evidence.

### Problems observed and resolved

An early geometry assertion treated the outer bar-container height as conserved. Browser evidence showed that this container can shrink by about 40px when Replay's controls disappear after **Show new parts**; the persistent root node and the actual whole track/fill stay in place. The assertion now checks root identity and measures the conserved track/fill/boundary geometry, while separately measuring question/control visibility through the viewport. This keeps the witness focused on the approved invariant and still makes the small content reflow visible in the recorded rectangles.

Additional witness sensitivity checks were run with temporary, reverted mutations and a fresh build for each:

- Setting the boundary duration to zero made the standard-motion route fail because it found zero executed animations for nine new boundaries.
- Injecting an animation on the juxtaposed track made its static route fail with active visual animations.
- Removing the standard-motion guard made the reduced-motion route fail with 21 active animations.

After every probe, the temporary source/style change was restored and the normal production bundle rebuilt.

## Validation

- `npm test` — **24 files, 280 tests passed**.
- `npm run build` — learner app and subtraction prototype builds passed.
- `npm run test:routes` — **41 passed, 0 failed** across 39 route rows.
- `node scripts/dev/verify-subtraction-visual-witness.mjs` — all seeded defect cases were detected as designed (hidden, collapsed, and fully clipped: 4/4 expected failures; erased removal/comparison marks: 2/4 affected executions failed and each unaffected counterpart passed 2/2); clean restored run passed 4/4.
- `node scripts/dev/plan-status.js lint` — passed with no violations during implementation validation. A final rerun while preparing this report returned `ERROR: README index is stale — run "node scripts/dev/plan-status.js render" to regenerate`. At that point concurrent, unowned Plan 17–20 edits and a Plan 22 draft were present. I left the generated index unchanged rather than include their work in this packet.
- `node scripts/dev/plan-status.js check plan-11` — `RUNNABLE: plan-11 is ready to implement`.
- `git diff --check` — passed.

## Limits and remaining gate

The browser evidence is from the local Microsoft Edge/Playwright route harness at 360px width. Physical-device rendering, assistive-technology operation, and child usability were not tested. This report does not claim that the motion is calm, accepted, or preferred. The packet's owner review of the rendered motion against DECISION-021 criterion 4, including the required deployed-URL acceptance, remains pending. No deployment or push was performed or authorized here.

Packet status remains orchestrator-owned and unchanged. **Ready for orchestrator delivery review: yes.**

## Unowned working-tree files

The following untracked files were present outside this packet's scope. They were not opened, edited, staged, or committed:

- `docs/development/plan-22-denominator-path-closure-repair.md`
- `reports/orchestration/nested-addition-policy-decision-brief.md`
- `reports/orchestration/next-wave-plans-17-21-claude-review.md`
- `reports/orchestration/next-wave-plans-17-21-gemini-review.md`

These tracked plan files also had unowned working-tree edits at final report preparation; they were not opened, staged, committed, or changed by this task:

- `docs/development/plan-17-crossing-one-whole-addition.md`
- `docs/development/plan-18-nested-denominator-addition.md`
- `docs/development/plan-19-shared-factor-addition.md`
- `docs/development/plan-20-like-denominator-addition.md`
- `docs/development/plan-21-practice-variety-and-next-problem-design.md`

## Repair 01 — Replay trigger and motion witness closure

Date: 2026-10-04

Implementation commit: `2603fe1` (`fix(plan-11): close replay motion repair`)

### Changes and evidence

The in-place renderer now remembers the semantic pre/post endpoints it last rendered. A conversion animates when the supplied endpoints describe a new conversion on this side, the mounted bar still shows that conversion's pre-form, and the learner's current form is the post-form. This lets a new accepted right-side conversion animate after Replay while preventing an ordinary Replay dismissal, help update, repeated render, or mode/view restoration from replaying an old transition. The changed-side directive remains part of the acceptance guard. The endpoint history clears with renderer destruction.

`ROUTE-REPLAY-NEW-CONVERSION-COND-1` uses mounted controls for the direct regression: accept left 8/12, click Replay, then submit right 3/12. Edge observed eight executed new-boundary animations on the right. The previous left effect had zero running animations during the right conversion. It later Replay-held the new right transition, requested help, and asserted that help did not restart that established conversion. The route also asserts the settled 8/12 and 3/12 endpoints. It ran at 360×752.

`ROUTE-REPLAY-REDUCED-COND-1` uses mounted controls to accept 8/12, enter Replay and hold 2/3 without motion, then activate the real **Show new parts** button. The browser observer checks the endpoint immediately after the click and after two paint frames, zero running effects at both points, stable root/track/fill/layer and existing boundary identities and geometry, grid-aligned full-height boundaries, and retained right response-input identity/value/selection. The response input was not focused during the button activation; its DOM/value/selection remained stable and the active element remained connected. The route then re-enters Replay, accepts right 3/12 immediately under reduced motion, returns from the episode, and begins a fresh one; no stale Replay controls/effect remain, and the fresh bars are 2/3 and 1/4. It ran at 360×752.

The standard motion observer now measures partial boundary paint against the inner `.fraction-bar-boundary-layer` (40px in the 360px reference run), requiring a height strictly greater than 1px and at least 1px below the interior. The 360×740 witness sampled 7.41px/40px at progress 0.185. At settlement it verifies every new boundary is connected to the layer, spans its full height within 0.5px, and is centered at its rational grid position within 0.75px. Track/fill geometry is compared relative to the persistent bar root so an unrelated page scroll or task reflow does not masquerade as bar motion; question/control rectangles and scroll offsets remain recorded and checked against the viewport.

The route runner exposes reproducible browser-only sensitivity runs via `--motion-witness-seed`; no source or build mutation is needed. Each run requires exactly one failure at its named witness assertion. The two Repair 01 seeds failed as intended: `no-op-keyframes` at partial paint and `half-height-new-boundary` at full settled boundary geometry. Retained sensitivity checks also passed: `disabled-motion` was rejected for no executed boundary animation, `static-accidental-motion` was rejected by the static track witness, and `reduced-accidental-motion` was rejected by the reduced-motion track witness. The shared subtraction visual verifier retained its seeded outcomes and clean restored result.

The route matrix now has **41 rows / 43 executions** (the former 39/41 baseline plus the two Replay journeys). Existing juxtaposed/sequential static controls and visual/linear Inspection Mode **Done looking** focus routes remain present and pass. High- and medium-support routes both pass in the full matrix.

### Advisor consultation and disposition

**Branch A — consultation ran** for this behavioral repair.

- Requested advisor override: `gpt-6-sol`, low effort. The advisor self-reported as a “GPT-6 based Codex agent”; its exact model ID and effort were not independently observable, so the requested override is not recorded as verified identity.
- Posture: instruction-read-only, with post-hoc verification. The tool did not expose a structurally read-only filesystem sandbox. The reviewer was depth 1 and instructed not to write or delegate. The immediate post-review check showed no advisor-authored files or edits; packet lint and `git diff --check` passed, and only the four scoped implementation files were modified before commit.
- Cost: one short reviewer pass and several minutes of coordination.

| Advisor finding | Independent verification and disposition | Result |
|---|---|---|
| Distinguish a new accepted endpoint transition after Replay from dismissal of the old Replay transition. | **Accepted.** Inspected the semantic endpoint signature and `lastDisplayedForm` guard, then ran the direct real-control route. Right 3/12 started eight boundary animations; the left Replay conversion had zero concurrent animations. Help after Replay did not restart the right conversion. | `src/render/fraction-bar.js`; `tests/routes/route-matrix.json` |
| Measure partial paint against the inner layer and require every new boundary to settle full-height at its grid position. | **Accepted.** Inspected the observer and ran both browser-only geometry seeds. No-op keyframes failed at the partial-paint assertion; the half-height boundary failed at the settled geometry assertion. The clean routes passed. | `scripts/dev/run-route-matrix.js` |
| Verify reduced Replay through the mounted learner control, including anchors, response input, focus applicability, and reset/re-entry. | **Accepted.** Ran the reduced journey in Edge. The Show control produced 8/12 immediately with no running effect; track/fill/layer and old-boundary geometry were unchanged; response input/value/selection remained stable. Return and re-entry showed 2/3 and 1/4 without stale Replay. | `scripts/dev/run-route-matrix.js`; `tests/routes/route-matrix.json` |
| A missing concurrent-left selector could falsely count as zero old animations; the new reset/re-entry must actually leave and re-enter; no-op/half-height tests must fail at their intended checks. | **Accepted.** The observer now errors on a missing concurrent container and schema validation requires the selector. The route uses Return then Practice. Seed CLI mode checks for exactly one matching failure and no other failures. | `scripts/dev/run-route-matrix.js`; `tests/route-contract.test.js`; `tests/routes/route-matrix.json` |

Rejected findings: none. The advisor reviewed the diff only; the validation runs below are implementer evidence, not advisor runs.

### Validation and gates

- `npm test` — **24 files, 280 tests passed**.
- `npm run build` — learner and subtraction-prototype builds passed.
- `npm run test:routes -- --quiet` — **43 passed, 0 failed**, 41 route rows, 43 browser executions in local Microsoft Edge. This retains both support profiles, the static juxtaposed/sequential routes, both visual/linear Inspection Mode focus routes, and the standard Replay route.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed no-op-keyframes` — intended partial-paint failure detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed half-height-new-boundary` — intended settled-geometry failure detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed disabled-motion` — missing executed animation detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed static-accidental-motion` — accidental static motion detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed reduced-accidental-motion` — accidental reduced-motion animation detected.
- `node scripts/dev/verify-subtraction-visual-witness.mjs` — all hidden, collapsed, fully clipped, erased-removal-mark, and erased-comparison-gap-mark seeded outcomes were detected; clean restored run passed **4/4**.
- `node scripts/dev/plan-status.js lint` — passed with no violations.
- `git diff --check` — passed.
- Post-review `node scripts/dev/plan-status.js check plan-11` — reports `BLOCKED: plan-11 has status "delivered" — not ready or in-progress`. The owner explicitly authorized this named Repair 01 despite the delivered packet preflight. Packet status was left unchanged; no status/index file was edited.

The implementation commit is `2603fe1`. This progress report is committed separately as the final task commit. No Plan 22 file was edited, staged, or committed. No push or deployment was performed. The prior owner gate for rendered-motion judgment and deployed-URL acceptance remains pending. Browser checks do not establish physical-device behavior, assistive-technology behavior, or child usability.

**Ready for delivery re-review: yes.**

## Divider-core contrast repair

Date: 2026-10-07

### Changes and rendered evidence

Newly introduced subdivision boundaries now use an explicit temporary dark core
(`--ff-bar-boundary-core: #0b1020`) under the existing blue halo. The core remains
at baseline white through the 560ms reveal, darkens during the existing 80ms
arrival, and returns to white during the existing 920ms fade. The boundary uses
explicit white paint at the beginning, reveal endpoint, and final endpoint, so
completion and cancellation restore normal paint. No boundary size or position,
track, fill, whole outline, existing boundary, or empty-cell paint changed. The
accepted-conversion and learner-activated Replay ownership remains unchanged.

The mounted Edge witness observed the core, halo, and settled white paint on new
boundaries. It also checked old-boundary core paint before, during, and after the
effect; reduced-motion interruption and Replay require baseline white with no
halo or running effect. Static/juxtaposed/sequential and reflection Inspection
Mode routes remain static, and the existing visual and linear Inspection Mode
focus-return checks still pass.

Rendered evidence was captured at 360px viewport width for both 8/12 and 16/24.
Each arrival and mid-fade screenshot shows newly introduced lines in both the
shaded and unshaded regions. The browser sampled every new boundary before and
after each mid-fade screenshot; the maximum RGB channel drift during capture was
14 for 12 parts and 13 for 24 parts, within the 24-channel evidence bound. The
observed arrival samples were `rgb(14, 19, 35)` and mid-fade samples were
`rgb(187, 189, 193)` for 12 parts and `rgb(189, 190, 195)` for 24 parts. These
are rendered candidate evidence for owner review; no contrast ratio or screenshot
is treated as an accessibility-conformance result.

The screenshots and compact browser sample record are in
`reports/development/plan-11-motion-and-animated-subdivision/evidence/`:

- `ROUTE-REPLAY-NEW-CONVERSION-COND-1-denominator-12-arrival.png`
- `ROUTE-REPLAY-NEW-CONVERSION-COND-1-denominator-12-mid-fade.png`
- `ROUTE-SUPPORT-MEDIUM-DECIDE-denominator-24-arrival.png`
- `ROUTE-SUPPORT-MEDIUM-DECIDE-denominator-24-mid-fade.png`
- `contrast-evidence.json`

### Advisor review and validation

**Read-only advisor review ran.** The first review found that old-boundary core
paint was not yet compared through the whole effect and that static/reduced
checks rejected only the exact peak color. Both findings were accepted: old
boundaries are now compared against their captured baseline before/during/after,
and static/reduced routes require baseline white. The advisor's follow-up review
found no blockers. A final review noted the screenshot timing bound compared only
one boundary; the witness was tightened to compare every new boundary by key,
and the advisor confirmed that this closes the evidence gap. The review runtime
did not expose a specific model or tier identity; no validation was delegated.

- `npm test` — **24 files, 283 tests passed**.
- `npm run build` — learner and subtraction-prototype builds passed.
- `npm run test:routes` — **43 passed, 0 failed**, preserving 41 route rows / 43 executions and both support profiles.
- All eight motion sensitivity seeds — each produced one intended failure and zero unrelated failures, including independent glow suppression and core suppression that retains the halo.
- `node scripts/dev/verify-subtraction-visual-witness.mjs` — seeded defects detected; restored static run passed **4/4**.
- `node scripts/dev/plan-status.js lint` and `git diff --check` — passed.
- `node scripts/dev/plan-status.js check plan-11` — still reports `BLOCKED` because the packet status remains `delivered`; status was not changed.

The scoped renderer and evidence commit is `54928b9` (`feat(plan-11): add temporary dark divider core`). This progress report is committed separately as the final task commit. Plan 22 was untouched. No push or deployment was performed. Owner rendered acceptance remains open for the captured appearance; physical-device and assistive-technology behavior were not assessed.

**Ready for re-review: yes.**

## Repair 02 — whole-position conservation and populated reduced Replay

Date: 2026-10-04

### Changes and evidence

The renderer now preserves the actual layout footprint of the left Replay column after its button and badge are dismissed. It clears their children, changes the wrapper into an empty `aria-hidden` layout reserve, and retains its measured pixel height. If Replay is entered again, it reuses that node and rebuilds the real controls. The reserve has no text, focusable descendants, pointer behavior, or visible decoration. In the clean Edge reproduction, the prior dismissal reduced `.fraction-bars-wrapper` from 147.84375px to 108px, moving the following right bar upward 39.84375px. The retained column prevents that reflow while leaving the accepted whole and fill endpoints unchanged.

The standard motion witness now captures the whole track and shaded fill in document coordinates (`getBoundingClientRect()` plus the measured `scrollX`/`scrollY`) before the click, during partial paint, and after settlement. It compares x, y, width, and height at all three points within 0.5px. Root-relative track/fill and existing-boundary checks remain supplementary. In the repaired direct right-conversion route, the whole's document box was x=41px, y=264.84375px, width=218px, height=44px before, during, and after the motion. The fill stayed at x=43px, y=266.84375px, width=53.5px, height=40px. Page scroll changed from y=248px to y=209px, while the corrected document positions and local anchor deltas stayed at zero. The partial new boundary painted to 7.45px of the 40px interior at progress 0.185; every new boundary settled connected, full-height, and aligned to its supplied grid.

The durable `whole-bar-translation` browser seed translates the right bar root 12px horizontally after its new-boundary animation starts on route step 12. It failed once at the conservation assertion with x drift 12px for both whole and fill, and zero y or dimension drift; no unrelated failure was reported. The five earlier seeds remain present and each produced exactly one intended failure at its named check.

The reduced Replay route now enters the correct unsubmitted right answer `8` and selects its full text `[0,1]` before using the mounted **Show new parts** button. The production input is `type=number`, whose browser selection values are `null`; for this browser-only selection witness, the same mounted node is temporarily changed to `type=text`, then its identity, value, and selection are checked immediately and after two paint frames. The click remains a real Playwright click. The observer records that the mounted button received focus during the click and that the final active element remains connected after the button is removed. The reduced route also measures right whole/fill document positions before and after accepting 3/12 during left Replay: both document boxes had zero x/y/width/height drift, with zero running animations and all boundaries on the full supplied grid. Return/re-entry still yields fresh 2/3 and 1/4 bars.

Static juxtaposed and sequential presentations and both visual and linear Inspection Mode focus-return routes remain in the full route matrix. Both high- and medium-support routes remain covered. The matrix remains at **41 rows / 43 browser executions**, preserving the earlier 39-row / 41-execution baseline and the two previously added Plan 11 Replay journeys.

### Advisor consultation and disposition

**Branch A — consultation ran.** Requested advisor override: `gpt-6-sol` at low effort. The advisor reported only “GPT-6 based Codex agent”; its exact model identifier and effective effort were not independently observable. The consultation was instruction-read-only with post-hoc verification; structural read-only access was not established by platform metadata. The advisor was depth 1 and did not write or spawn children; the primary remained the only writer.

The first review pass identified two concrete defects, both independently reproduced by inspecting the changed route and renderer behavior and both accepted: (1) the measured Replay reserve could remain when a fresh episode had no transition; the renderer now removes that reserve on reset, and the return/re-entry route asserts its absence and the ordinary 108px two-bar stack; (2) the reduced-motion selection witness temporarily changed the mounted response input to `type=text` but did not restore it before a later conversion; the route now restores `type=number` before filling/submitting that response. The advisor re-read the updated diff and found **no remaining blocking issue**. It independently checked that the document-coordinate witness includes scroll correction and compares before/during/settled positions, that the new 12px translation seed targets the conservation assertion, that reduced Replay uses a real click with nonempty selected content, and that static and both Inspection Mode routes remain present. No findings were rejected; the two initial findings were accepted and repaired. The advisor did not independently run tests, builds, or browser routes.

Post-consultation `git status --short` showed only the seven scoped Plan 11 files (six implementation/test files and this report); no Plan 22 file or advisor-authored change appeared. `git diff --check` passed. The post-consultation packet check still reports `BLOCKED: plan-11 has status "delivered" — not ready or in-progress`; no packet status changed. Review cost was one follow-up review cycle after the initial pass, roughly a few minutes of elapsed review time.

### Validation and gates

- `npm test` — **24 files, 280 tests passed**.
- `npm run build` — learner and subtraction-prototype builds passed.
- `npm run test:routes` — **43 passed, 0 failed**, 41 route rows / 43 executions in local Microsoft Edge. This includes both support profiles, static juxtaposed/sequential routes, and both Inspection Mode focus routes.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed no-op-keyframes` — intended partial-paint failure detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed half-height-new-boundary` — intended settled-geometry failure detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed disabled-motion` — missing executed animation detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed static-accidental-motion` — accidental static motion detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed reduced-accidental-motion` — accidental reduced-motion animation detected.
- `node scripts/dev/run-route-matrix.js --motion-witness-seed whole-bar-translation` — 12px whole/fill document-position change rejected by the conservation assertion; one intended seed failure, zero unrelated failures.
- `node scripts/dev/verify-subtraction-visual-witness.mjs` — hidden, collapsed, fully clipped, erased-removal-mark, and erased-comparison-gap-mark seeded outcomes detected; clean restored run passed **4/4**.
- `node scripts/dev/plan-status.js lint` — passed with no violations.
- `git diff --check` — passed.
- `node scripts/dev/plan-status.js check plan-11` — still reports `BLOCKED: plan-11 has status "delivered" — not ready or in-progress`. The named repair was explicitly authorized; status was not changed.

Only the permitted renderer, renderer CSS, route runner, route contract test, app-shell test, and this progress report are in scope. No Plan 22 files were changed. No push or deployment was performed. Physical-device behavior, assistive-technology behavior, owner rendered-motion judgment, and deployed-URL acceptance remain outside this browser evidence.

**Ready for technical re-review: yes.**

The six implementation/test files were committed as `82fcd51` (`fix(plan-11): preserve subdivision position after replay`). This report is being committed separately as the final task commit.

## Divider-glow enhancement — bounded composite boundary effect

Date: 2026-10-06

### Changes and browser evidence

Each newly introduced subdivision boundary now runs one finite WAAPI effect: the approved 560ms reveal, an approximately 80ms restrained highlight arrival, then a 920ms fade back to baseline (1560ms total). The accepted-conversion and learner-activated **Show new parts** Replay guards remain in place. The same cancellation owner still removes the complete effect when a new conversion supersedes it, the renderer is destroyed, or reduced motion is selected. Under reduced motion the endpoint appears immediately with no glow. No state, scene, content, or instructional behavior changed.

The browser route witness now separately observes partial reveal paint, the full-height/grid-aligned post-arrival highlight, and the settled unhighlighted boundary. It verifies that existing boundaries stay unhighlighted and unmoved, the track and fill preserve both local and scroll-corrected document coordinates, and the question and active controls remain visible. On denominator 24 at 360px viewport width, both support profiles had an 8.906px minimum center gap; the observed glow half-outset was approximately 3.4–3.5px with 8.906px edge clearance, and the fit assertion passed. Whole and fill document positions had zero drift during reveal, highlight, and settlement.

The highlight-interruption witness now records the browser preference-change time and each active animation's remaining duration before switching media preference. It requires the reduced-motion media query to change before the effect could naturally end, then requires the renderer's settled class, zero active animations, and baseline shadows within two frames, with a 50ms margin still remaining at the completed observation. The immediate media-query witness and later renderer-class witness are separate because the class update is asynchronous.

The route matrix remains at **41 rows / 43 browser executions**, preserving the earlier **39-row / 41-execution** baseline plus the two Replay journeys. The full matrix passed on local Microsoft Edge with both high- and medium-support profiles. Juxtaposed and sequential presentations remained static; visual and linear Inspection Mode focus-return routes passed. Reduced-motion Replay retained its nonempty unsubmitted right answer and known selection while the mounted **Show new parts** button retained real-click focus behavior.

All seven motion sensitivity seeds produced exactly one intended failure and zero unrelated failures: `no-op-keyframes`, `half-height-new-boundary`, `disabled-motion`, `static-accidental-motion`, `reduced-accidental-motion`, `whole-bar-translation`, and `glow-suppressed`. The glow-suppression seed failed specifically at the post-arrival highlight assertion while observing full-height new boundaries. The shared subtraction visual verifier again detected all seeded outcomes and passed its restored static run 4/4.

### Advisor consultation and disposition

**Branch A — consultation ran.** Requested advisor override: `gpt-6-sol` at medium effort. The reviewer self-reported “Codex based on GPT-6” and could not attest to a more specific model or tier; requested override is recorded separately from this unverified runtime identity. The advisor was a depth-1 read-only reviewer; it stated that it made no edits, spawned no agents, or ran validation. The immediate post-consultation status check showed only the five scoped implementation/test files modified. The primary remained the sole writer.

The first review identified a gap because the highlight-interruption route did not establish that an effect was running at the preference change. The next review found a race between that snapshot and the browser media update. A third review found that the two-frame cancellation sample could occur after the captured natural end. All three findings were accepted. The witness now snapshots active effect count and minimum remaining time, verifies the media query changed within that remaining time, and timestamps the completed two-frame state/paint sample, requiring at least 50ms before natural completion. The final read-only review found no blocking issue; it found the capture order closes the timing concern. One exploratory implementation check initially used the renderer class as an immediate media-change marker; the matrix exposed its asynchronous update, so the check now observes `matchMedia` immediately and checks the class in the settled sample. No advisor finding was rejected. The advisor did not independently run tests, builds, or browser routes. Consultation cost was four reviewer turns (initial pass plus three focused follow-ups), roughly several minutes of review time.

Post-consultation `git status --short` contained only the five scoped implementation/test files; the progress report is the only additional intended change. `node scripts/dev/plan-status.js check plan-11` continues to report `BLOCKED: plan-11 has status "delivered" — not ready or in-progress`; the named enhancement was authorized and status remains unchanged.

### Validation and gates

- `npm test` — **24 files, 281 tests passed**.
- `npm run build` — learner and subtraction-prototype builds passed.
- `npm run test:routes` — **43 passed, 0 failed**, 41 route rows / 43 browser executions, including both support profiles, static presentations, and both Inspection Mode focus routes.
- All seven motion sensitivity seeds above — each detected once at its intended assertion with zero unrelated failures.
- `node scripts/dev/verify-subtraction-visual-witness.mjs` — seeded outcomes detected; clean restored run passed **4/4**.
- `node scripts/dev/plan-status.js lint` and `git diff --check` — passed.
- `node scripts/dev/plan-status.js check plan-11` — remains blocked because packet status is `delivered`; status was not changed.

No Plan 22 files were changed. No push or deployment was performed. Physical-device behavior, assistive-technology behavior, owner rendered-motion judgment, and deployed-URL acceptance remain outside this browser evidence. Delivery review remains pending.

The scoped glow implementation was committed as `b3b6f85` (`feat(plan-11): highlight new subdivision boundaries`). This progress report is committed separately as the final task commit.

**Ready for delivery re-review: yes.**
