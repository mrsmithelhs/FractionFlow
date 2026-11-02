# Plan 53 bounded placement investigation

2026-11-02. The owner directed keeping eighths and investigating placement further.
This is synthetic Chrome evidence, not a finding about physical fingers, assistive
technology or learners. `evidence/precision-probe.mjs` and its JSON receipt record
the experiments; `evidence/lifecycle-probe.mjs` covers a separate access/reset walk.

At 360×740 the [0,2] line measured 246 px (15.375 px per eighth); with a 150%
root font it measured 190 px (11.875 px per eighth); at 200% root font it measured
134 px (8.375 px per eighth). At 1093×614 DPR 1.25 it
measured 906.8125 px (56.676 px per eighth). At each configuration an off-center
grab, 17 px left of the tile center, was released on each side of the 9/10 midpoint
by 0.12 candidate intervals. The highlight and committed candidate agreed with the
respective side. Emulated off-center touch committed step 11, a subsequent touch
cancel retained that placement, and document scroll position did not change in that
drag sample. A large Move left control corrected it by one step; measured controls
were at least 44×44 CSS px. Synthetic fourths taps on both sides of one boundary
selected distinct candidates, endpoint tiles and their fraction glyphs remained
inside their bounds, and 0, 1, 2 benchmark labels were present. The controls
remained available at all four settings. No horizontal document overflow appeared
in these samples; the 200% sample needed normal vertical scrolling to reach the line.

The lifecycle walk observed an incorrect response and open help preserved through
visual/linear switches, revision clearing retry, acceptance and reset to an unplaced
state with help closed. It does not establish screen-reader speech or physical touch.
The tests do not cover every boundary, device, pointer offset, scroll environment,
or motor pattern. A synthetic exact-coordinate drag is not a usability study.

Recommendation: retain the existing nearest-candidate highlight and large step
correction path within the approved mechanism; no new precision aid is justified by
these bounded event observations. The narrow and enlarged-text density remains an
owner/device usability judgment, not a demonstrated passing finger target. Continue
the remaining implementation evidence and owner rendered review only after the
orchestrator dispositions this finding. No snap hysteresis, magnification, candidate
removal, viewport-dependent admission or auto-check is proposed.
