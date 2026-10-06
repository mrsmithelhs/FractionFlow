# New-divider glow proposal

Date: 2026-10-06. Owner feedback: likes Smooth change and the descending lines;
requests feasibility of a brief glow around the new lines after arrival, about one
second. This records a proposed enhancement, not source approval, deployed acceptance
or selection of D-01/D-02 as a product default. Repair 02 technical acceptance still
applies to the existing `82fcd51` implementation until behavior changes.

## Proposed presentation

Keep the existing learner-triggered subdivision reveal and conserved geometry.
Once the new lines reach full height, give only those lines one soft, restrained
highlight, then fade it back to their ordinary appearance over approximately one
second. No flashing, repeated pulse, whole-bar glow, moving/resized fill or old-line
effect. The final unhighlighted endpoint stays inspectable indefinitely.

The effect stays renderer-owned, reading the same validated transition and upstream
animated in-place directives. Accepted new conversions and explicit Replay Show new
parts may start it. Help, rerenders, old work, view restoration and static Inspection
Mode must not. Both existing animated bundles follow the same directive contract;
juxtaposed/sequential modes stay static. No new learner chrome or explanatory copy.

Reduced motion reaches the existing endpoint immediately with no glow animation.
Meaning remains available through persistent boundaries and current copy. A switch
to reduced motion, superseding presentation or renderer destruction cancels reveal
and glow and settles to normal paint. No effect completion dispatches instruction,
advances a task, changes focus, mounts/dismisses content or delays response controls.

## Mechanism gate before source work

Propose whether a single bounded Web Animations timeline or separately tracked
reveal/highlight effects best preserve the current cancellation/event guards.
Use paint properties that cannot alter the supplied grid or whole/fill geometry.
Avoid clipping or an overlap that obscures small parts at denominator 24. Identify
exact renderer/CSS/witness/test paths and the amended mechanism wording: the prior
approval authorized only boundary appearance, so this adds a specifically scoped
post-arrival highlight rather than silently treating all decorative motion as allowed.

Browser witnesses must establish the actual reveal, the post-arrival highlight and
return to ordinary paint, using mounted learner actions. Update settlement timing
to reflect the full bounded effect without weakening partial-paint assertions or
letting a no-op reveal pass because the glow ran. Keep all six motion seeds,
whole/fill document-coordinate conservation, reduced/static negative controls,
Replay/input/focus/reset evidence and narrow-screen question/control visibility.
Add a meaningful highlight-suppression seed or equivalent falsifying check.

Obtain mechanism approval before implementation. After delivery, technical re-review
and owner rendered judgment apply to the enhanced candidate. No push or deployment;
the separate Plan 22 denominator-path repair still precedes a combined public release.
