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
