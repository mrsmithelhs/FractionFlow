# Owner feedback: drag affordance and walkthrough capture

Date: 2026-10-22. Plan 39 remains delivered and unaccepted. This is investigation
and a proposed mechanism, not source authorization or rendered acceptance.

The owner reports that moving the fraction works but repeated drags after initial
placement often fail to snap. They request a live highlight of the nearest drop
target and suggest a brief finger/drag cue over the fraction. They also ask whether
Playwright can save screenshots during model browser walkthroughs.

## Reproduced defect

Parent used the built learner site, installed Playwright 1.63.0 and installed
headless Chrome at 1093×614. Through mounted controls, start number-line practice
and choose Place leftmost. Grab the placed fraction at its centre, move horizontally
to the half point while keeping the pointer's height, then release.

Observed: candidate remains partition-0-of-2 rather than moving to half. Pointer
y=257.546875; frame acceptance band y=262.859375..314.046875. The pointer misses
the invisible band by 5.3125px. The temporary browser/server were closed afterward.

Source explains this mismatch: setTokenPlacement anchors the resting token above
the axis using translate(-50%, -100%), while pointerup tests pointer coordinates
against the track frame. Drag movement centres the token on the pointer and does
not preserve the original grab offset. Existing tests mostly drag to the frame's
centre, so they did not exercise this natural horizontal repositioning path.

## Recommended Repair 03 mechanism

1. Preserve the initial grab offset so starting a drag does not jump the token.
   Define one visible placement anchor, preferably the token's bottom centre to
   agree with its resting position over the line. Use that anchor for both live
   eligibility and the final drop. Retain a forgiving two-axis acceptance band of
   at least 44px, aligned with the line; do not silently accept arbitrary page drops.
2. While dragging within the eligible region, mark the nearest OFFERED location
   with a clear neutral halo/ring. The marked location must be exactly the one
   that releasing now would choose. Outside the eligible region, clear the ring.
   Use the existing deterministic lower-location tie break. Never inspect
   correctness or use the accepted/correct-answer paint for this preview.
3. Remove the transient ring on release, cancel, Escape, lost capture, resize,
   view change and destruction. Keep explicit Check, pending-state preservation,
   recovery/reset, native radios and movement controls. No instructional state,
   mathematics, content, definition/replay identity or answer history changes.
4. An optional brief gesture cue can appear over the unplaced token on first
   entry, once rather than looping. It must demonstrate grabbing only, without
   moving the actual fraction toward an answer or selecting a location. Stop on
   interaction. Reduced motion gets a static cue. Do not introduce a new paragraph
   or persistent directions. Static grab affordance plus live highlight may prove
   sufficient; the gesture cue is lower priority than reliable placement.

Acceptance evidence must include natural horizontal repositioning after placement,
several grab positions, mouse and browser touch input, all candidate targets
including sparse nonendpoint sets, exact agreement between highlight and actual
drop, and no correctness-dependent snapping. Retain outside/cancel/resize/view/
reset checks. Include a deliberately broken anchor or highlight mismatch that the
ordinary browser assertion detects. Existing exact math does not need manual
re-verification. Use Luna for implementation and at most one consolidated Sol LOW
review unless a substantial unresolved issue justifies the owner's second-call
allowance. Owner rendered acceptance and deployment remain separate.

## Screenshot workflow recommendation

Playwright is already installed locally (1.63.0) and has produced existing route
and parent-review PNGs. Earlier walkthrough reviewers could see screenshots in
their harness; reliable local export from that particular browser session was not
established. This is not a demonstrated blanket subagent screenshot limitation.

Pilot one Playwright-owned session with a small fixed screenshot/coordinate-input/
keyboard driver. Save an image after meaningful actions and return it to the SAME
reviewer; let the reviewer choose actions from the image. The driver performs
capture/input only, with no second model interpreting intentions or replaying them
in another browser. Keep source, DOM queries, accessibility trees, internal state
and answer keys out of the review interface. Without tool restrictions, that
boundary remains instructional and must be reported honestly.

Do not assume Playwright can attach to the existing in-app tab; attachment requires
an explicitly supported connection. Prefer one owned browser for both actions and
capture. Test screenshot save-and-display plus one action before commissioning a
full run. Reuse existing package/browser installations; no new dependency or
harness configuration was installed or changed in this investigation. A reviewer
must not write arbitrary selector scripts to navigate its supposedly visual task.
