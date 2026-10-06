# Plan 11 divider-glow mechanism review

Date: 2026-10-06. Reviewed the implementer's clean, no-source-change investigation
and detailed proposal from the completed FF Impl 11 turn, plus the owner-pasted
report. Existing technically accepted baseline: implementation `82fcd51` and report
`c93934d`; glow proposal committed in `eccfc10`.

## Decision

**Approved for bounded implementation with the requirements below.** This explicitly
amends the original appearance-only motion approval to permit one restrained
post-arrival highlight on newly introduced boundaries. It authorizes no pulse,
whole/fill/old-line effect, instructional timing or product-default selection.
Plan 11 remains delivered; the named enhancement is authorized despite that status,
without changing status to make preflight runnable. Technical and owner rendered/
deployed acceptance apply to the enhanced candidate. No push or deployment.

## Approved mechanism and scope

Use one finite composite Web Animations timeline per new boundary, owned by the
existing active-animation set and cancellation path. Preserve the existing 560ms
reveal and its easing; after full-height arrival, bring in a soft highlight over
roughly 80ms and fade it back over roughly 920ms. Approximate total: 1560ms. Use
boundary-only transform and paint such as background color/box shadow; do not
animate any layout property or change the supplied grid/whole/fill dimensions.
Use phase keyframes/easing so the longer duration does not stretch the reveal.

Keep the genuine-new-conversion and explicit Show new parts guards unchanged.
No effect restarts on help, established Replay dismissal, rerender, restored view,
or mode restoration. Both animated bundles obey their same upstream directives.
Juxtaposed/sequential and reflection Inspection Mode remain static. A reduction
of motion preference, superseding presentation or renderer destruction cancels
the whole effect and returns to normal endpoint paint. Reduced motion starts with
the immediate endpoint and no animated glow. No callback delays controls, changes
instructional state, focuses, mounts/dismisses learner content or advances a task.

Permitted files: `src/render/fraction-bar.js`, narrowly related paint rules/tokens
in `src/styles/render.css`, `scripts/dev/run-route-matrix.js`, relevant
`tests/route-contract.test.js`/`tests/app-shell.test.js` checks and existing Plan 11
rows in `tests/routes/route-matrix.json` where necessary, plus packet progress and
browser evidence. Explain any additional test path before adding it. No math,
content, interaction, scene, definition, support-policy, Plan 22/23 or orchestrator
review-file edits. Preserve other writers' work and stage only explicit paths.

## Binding verification

1. Observe three distinct phases through mounted learner actions: actual partial
   reveal; full-height/grid-aligned new boundaries with visible post-arrival highlight;
   and settled normal paint with no running boundary effects. Geometry alone cannot
   prove glow, and glow alone cannot prove reveal.
2. Existing whole/fill document-coordinate conservation and local boundary checks
   apply before, during reveal, during highlight and after settlement. Measure active
   question/control visibility and scroll. Preserve old boundary paint and geometry.
3. Adapt the runner's sampling to the reveal phase rather than total-timeline progress.
   Replace any settlement wait too short for the full effect with a bounded observed-
   completion deadline based on the full timeline plus sensible rendering slack.
   Do not remove settlement, partial-height or conservation assertions to pass.
4. Keep all six existing motion seeds at their intended failures. Add glow-suppression
   evidence that preserves the reveal and fails specifically at highlight visibility;
   clean runs must pass. Static/reduced negative controls must reject highlight effects.
5. Check reduced-motion interruption during highlight as well as reveal, then restore
   standard motion without restarting old work. Normal paint must return on cancellation
   and destruction, with no stale glow/reserve after fresh entry.
6. Verify the restrained highlight does not obscure adjacent narrow parts or clip at
   denominator 24 and 360px. Preserve genuine accepted-conversion, Replay, native input
   continuity, reserve/reset and both Inspection Mode focus witnesses. Make the appearance
   available for owner review; screenshots alone cannot establish temporal behavior.

Run meaningful focused checks, full tests, learner/prototype builds, full browser
matrix, seven motion seeds, shared subtraction verifier, packet lint and diff check.
Follow the inherited advisor consultation/disposition contract. Commit bounded
implementation and the updated progress report last. Stop for delivery re-review.

## Coordination and evidence limits

The original dispatch succeeded; the receiver's return-send failed. Read-thread
inspection confirmed a failed send and the final report; the stated automatic-
review authorization rationale comes from the implementer's report, not a raw
review trace. No rejected send was retried. The owner requested a Bootstrap intake
investigation of this direction/provenance boundary. Implementation can report its
result in its own chat; orchestration can retrieve it through read/wait tools.
This does not grant the receiver new outbound messaging authority.

No tests were run for this prose-only mechanism disposition. Prior Repair 02
technical acceptance does not automatically accept the changed visual behavior.
Advisor consultation is not warranted for this prose-only review. Owner motion
judgment and publication authorization remain separate; Plan 22 still precedes
the combined release.
