# Plan 11 mechanism review

- Date: 2026-10-04.
- Baseline: `8d5805f`, including the owner's committed Plan 11 in-progress change; working tree clean.
- Decision: approved with the binding clarifications below. This clears source work, not motion acceptance or deployment.
- Preflight independently returned RUNNABLE. No source files changed or tests run at this gate.
- A delegated read-only review traced renderer, app update, scene transition, and replay paths. Orchestration checked packet scope, presentation posture, condition registry, and Repair 06 Condition A.

## Persistent rendering and conserved geometry

Keep the scene contract unchanged. Read the existing validated conversion endpoints and presentation/condition directives. No math/content/instructional/scene edits, new instructional state, or calculation of equivalence is authorized.

The substantive repair is track continuity: the renderer already retains its outer root but recreates the track every update. Preserve root, track, whole outline, shaded extent, and existing partition boundaries in the animated in-place path. Updating child segments is acceptable only if those visual anchors remain stable. A stable fill/track with a separate boundary layer is an approved implementation option. Determine newly introduced versus existing boundaries from alignment of the supplied denominator grids as presentation geometry, not a new source of mathematical truth.

Animate only new subdivision boundaries. Existing boundaries must not fade away and reappear; no fill movement/resizing, whole translation, readout animation, pulse, or unrelated beat/recovery/milestone motion. Verify whole bounds and shaded endpoint before, during, and after motion, including both operand conversions and non-least denominator 24. Preserve touch target sizes and focused response controls.

Use the registered animated in-place arm (existing D-01-A/D-02-M directives), rather than inventing a renderer-owned condition flag. Bundle 1 is the main witness; Bundle 4 already carries the same display/choreography pair, so its ordinary conversion bars follow that arm too. Its premise-check display does not animate. Preserve registered IDs/revisions and prototype status. If implementation requires Bundle 1 and Bundle 4 to interpret identical directives differently, stop and propose that explicit contract change first.

## Exactly when motion may start

On a mounted bar that already displays the pre-form, a newly accepted equivalent-form response may animate the new boundaries once. The response can advance immediately to the next task, so do not gate solely on the name of the current beat. Keep renderer-local endpoint/display bookkeeping; do not use fresh scene object identity or the persistent `changed` field as an event trigger. Mounting an already-converted scene renders its current endpoint statically.

Recovery, help, later beats, support/profile updates, changing views, and repeated renders must not replay an established conversion. Reset bookkeeping on renderer destruction or a genuinely reset/new episode. Rapid successive learner submissions may settle/supersede the previous presentation, but must not mutate or queue instructional responses. Motion completion never advances a beat, dismisses content, focuses a control, or dispatches an action.

Use a finite restrained boundary effect; CSS or Web Animations may finish the effect without changing readable content or mounts. Do not use timers to stage a new view or remove a scaffold. Allowed scheduling may establish paint frames for the effect only; no animation callback governs learning flow. Switching to reduced motion during an effect settles immediately at the same current endpoint and cancels pending visual work. Switching back to standard does not animate an old conversion spontaneously. Destroy/replacement must cancel pending effects.

## Replay and Inspection Mode

Repair 06 Condition A remains binding in all motion modes. Replay displays the starting parts indefinitely; it does not immediately run a timed pre-to-post sequence. The learner's existing **Show new parts** action reveals the post-state, with new-boundary animation in standard motion and immediate display under reduced motion. Both endpoints remain indefinitely inspectable via existing controls. Keep the same underlying bar anchors across this reveal; do not let replay wrappers/headers move or rescale the whole while it animates. Preserve input DOM/value/caret and ordinary replay focus behavior.

Reflection's existing Inspection Mode remains the static starting-form inspection with **Done looking**. It builds a separate track in `beat-container.js`; this gate does not add a new animation/toggle there. Preserve first-choice focus on Done-looking exit in both visual and linear paths, and keep the choices genuinely unmounted during inspection. Report normal conversion/replay animation separately from static reflection inspection; do not claim animated reflect coverage.

This is a necessary scope clarification, not permission to redesign replay. Bounded renderer helper/integration changes in `src/render/beat-container.js` are allowed only if needed for the existing animated-arm mount/update connection; no Inspection Mode redesign.

## Reduced motion, copy, and access

Use the same known post-state/semantics in standard, reduced, and instant-test rendering. Reduced motion suppresses the effect and preserves a concise meaningful indication of the partition change, using existing fraction/transition framing where possible. No information needed for reasoning may be carried only by opacity/timing, and no new explanatory panel is authorized. The linear path remains a static agency-preserving alternative.

Restore or rewrite Bundle 1's parked label/description to describe observed behavior in concrete language, removing its obsolete parking comment. Do not promote animation or in-place choreography as preferred; D-01 and D-02 remain open prototype variables.

## Required executable evidence

Refresh validation against the current 39-row/41-execution baseline after Plan 13, retaining existing assertions and support/focus/reset behavior. Add mounted-control routes that select the animated arm, submit a real conversion, observe actual in-flight boundary change, observe the stable endpoint, enter Replay's persistent pre-state, and activate Show new parts. Cover both motion preferences and both conversions; include the denominator-24 path. Use matched juxtaposed/sequential controls that remain static.

Configured CSS duration, class presence, or a screenshot alone cannot prove motion. Observe executed animation/transition activity and intermediate boundary paint, while measuring conserved outline/fill geometry. Check that disabling the effect makes the standard-motion witness fail, and that accidental motion in reduced/static controls fails. Capture the real DOM identities to prove persistent root/track, not merely equal dimensions of replaced nodes. Do not change task actions or inject animation through direct renderer calls to create evidence.

At 360x740 and 360x752, measure rest and in-flight states wherever the effect runs, with actual question/control bounds and scroll positions. Do not create new layout chrome or require a full one-screen episode; an effect may not push an active control out of the visible task. Exercise both support profiles, interruption by reduced-motion changes, rapid actions, help/rejected responses, and return/re-entry sufficiently to verify no stale/restarted effects. Preserve equivalent reachable states and replay/reset semantics.

Run unit tests, complete learner/prototype build, full browser matrix, shared runner's seeded visual verifier if modified, packet lint, and diff check. Record pre-delivery advisor disposition and explicit evidence limits. Commit scoped implementation and progress report last; status stays orchestrator-owned. Stop if conservation, unchanged scene ownership, or existing replay endpoints cannot be preserved.

The packet's deployed-URL owner acceptance requirement remains in force. Source approval and local checks authorize no push/deployment; obtain explicit owner authorization for the concrete reviewed release before publishing. Owner subsequently judges motion against DECISION-021 criterion 4, not a duration declaration or implementer preference.
