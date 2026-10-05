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
