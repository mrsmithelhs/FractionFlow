# Plan 11 delivery review — 2026-10-04

## Disposition

**Received and recorded as delivered; technical acceptance requires Repair 01.**
Implementation `9430c4c`, report `fbd9ad9`, reviewed against the approved mechanism
at `a472fc1`. Owner rendered-motion review and deployed-URL acceptance remain
separate. No push, deployment, source repair or D-01/D-02 preference is adopted.

The packet index is now current and lint passes. The implementer's stale-index
report describes concurrent orchestration edits already committed in `a205d0f` /
`8b1adfc`; it is not a Plan 11 delivery defect.

## Independently verified strengths

The implementation keeps root/track/fill and rational-position old-boundary nodes,
uses finite effects on introduced boundaries, and cleans up presentation without
instructional dispatch. Both animated bundles use the same in-place branch.
Static juxtaposed/sequential and reflection inspection paths remain separate.
Math/content/interaction/scene and registered condition identities are unchanged.
Renderer boundary alignment is presentation geometry, within the mechanism gate.

Rebuilt learner and prototype outputs; `npm test` passed 24 files / 280 tests;
the full Edge browser matrix passed 39 rows / 41 executions. Browser output
independently showed partial new-line geometry, unchanged track/fill/old boundaries,
both conversions, denominator 24, viewport-visible controls, standard Replay reveal,
reduced-mode interruption/restoration and retained focus/reset routes. The shared
subtraction verifier rejected its five seeds as expected and passed the clean 4/4 run.

A separate instruction-read-only reviewer inspected the renderer and witness scope
and ran a focused mock-DOM control probe. Orchestration independently repeated the
important findings in the real Edge route harness using actual learner controls.
No higher-tier/model identity verification is claimed for this review agent.

## Blocking findings

### 1 — New accepted conversion during Replay skips motion

`fraction-bar.js` gates accepted conversion on `!wasReplaying`, while both operand
renderers retain the episode's Replay flag. Reproduction: choose 12, submit left 8,
click Replay, enter right 3 and submit it while Replay is active. The correct right
form reaches operate, but eight new boundaries have zero executed animations.

Orchestration ran the existing `ROUTE-COND-1-REFLECT` with a browser-driver wrapper
inserting a real Replay click immediately before the fill of right numerator 3.
The route failed: `expected one executed animation per new boundary; found 0 for
8 boundaries`. No renderer/API dispatch fallback or source mutation was used.
The reviewer independently saw 8 animation calls without Replay and 0 with it in
a mounted mock-control probe; that probe is event evidence, not browser geometry.

Distinguish a genuinely new accepted endpoint transition from dismissal of an
already replayed conversion. Simply dropping the Replay guard could incorrectly
animate old content on help/dismissal/ordinary updates. The arithmetic endpoint is
correct; the defect is in the approved learner-triggered presentation behavior.

### 2 — Partial/settled motion witness admits visually defective effects

The intermediate witness compares a boundary against the outer track's 44px height,
although full-height boundaries occupy its 40px interior. A stationary full-height
boundary satisfies `40 < 44`; timing progress alone does not show subdivision.
The settled boundary height is recorded but not asserted against its actual layer.

Two independent browser-only failure seeds ran with page-init overrides, leaving
source/build files intact:

- Replace boundary keyframes with `scaleY(1) → scaleY(1)` while retaining duration:
  `ROUTE-COND-1-TRANSFORM` incorrectly passed 1/1. Its sample boundary was 40px high,
  full height, at timing progress about 0.187.
- Apply `bottom: 50%` only to newly animated boundaries: the same route incorrectly
  passed 1/1. A boundary grew but settled at 20px rather than the required 40px.

Require actual partial paint relative to the inner boundary layer and full settled
geometry of every introduced boundary, with measured tolerances. Persistent anchors
and nonzero timing progress alone cannot prove either observation. Both seeds must
fail for the intended reason, followed by a clean passing run.

### 3 — Reduced-motion Replay route is missing

`ROUTE-REPLAY-COND-1` executes in standard motion only. The reduced learner route
verifies ordinary 24ths conversions but not Replay's persistent pre-state and
explicit Show-new-parts endpoint. Binding mechanism approval requires both modes.
Add mounted-control reduced Replay evidence; do not simulate it by directly rendering
a prepared scene. Keep existing standard-motion and reflection-focus witnesses.

## Repair and remaining gates

Use `repair-01.md` for the bounded renderer/event and witness repairs. No new product
policy decision is necessary to restore the already approved mechanism. Re-review
after scoped implementation and updated progress-report commits; packet remains
delivered until technical and owner/deployed gates are satisfied.

Physical-device/AT and child usability remain untested. Full-frame animation judgment
belongs to the owner, not a duration or geometry proxy. Plan 22's known denominator
coverage repair remains necessary before the combined public release and is not
folded into this motion repair.

## Validation record

- Pure/unit tests: 280/280 passed.
- Learner/prototype builds: passed.
- Full current browser matrix: 41/41 passed before the adversarial variants above.
- Shared prototype seeded verifier: all specified seeds rejected; clean 4/4 passed.
- Independent adversarial outcomes: Replay/new-conversion variant fails as a live
  renderer defect; no-op and half-height seeds wrongly pass as witness defects.
- Packet lint and scoped diff checks: passed. Source tree unchanged by orchestration.
