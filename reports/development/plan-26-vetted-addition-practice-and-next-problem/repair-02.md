# Plan 26 Repair 02 — finish the bounded participation/reset witness

Date: 2026-10-10. Root explicitly authorizes this evidence-only repair under the
owner's standing Plan 26 correction permission. Packet remains `delivered`;
ordinary new-work preflight is blocked, but this repair authorization applies.
Read `repair-01-review.md`. The production admission correction is accepted.

## Small remaining changes

1. In the existing touch-enabled journey, use real non-drag touchscreen taps for
   lesson controls and navigation, including Retry and return/re-entry. Tap inputs
   before automated text entry, and label that text entry honestly. Scroll a
   target into the CSS viewport before tapping and verify the gesture reaches
   the intended mounted control. Keep mouse/keyboard journeys unchanged. A touch
   refusal run is optional; do not claim it unless actually exercised. No physical
   touch-device or native keyboard claim follows.
2. Extend the existing focused mounted tests with complete independently
   constructed fresh-state equality after Next and return/re-entry, preserving
   legitimate content/configuration differences. Reuse `createEpisode`, fixture
   construction and the accepted exact core; do not manually recompute math or
   compare against a copy of the resulting app state. Existing dirty second-item
   Retry already provides an exact snapshot check.
3. Add one dirty second-item browser Retry using the shared journey helper. Start
   with accepted conversion work, an incorrect response, task-local help/input
   draft and active Replay; do not close Replay before Retry. Assert fresh second
   operands/encounter, no old numeric/helper fields, no recovery/Replay residue,
   retained view/settings, landmark focus and first Tab. After return/re-entry,
   assert the original operand identity and clean starting UI as well as focus.
   This closes the browser-visible part without adding a production state hook.
4. After the existing reflection scroll, assert positive question/control bounds
   within the CSS viewport (or each control demonstrably reachable through
   scrolling), and preserve horizontal-overflow checks. Do not impose zero page
   scroll. Retain the same five representative configurations/two sizes; no
   larger coverage matrix or new mathematical task is needed.

Owned: the existing evidence script/artifacts, focused Plan 26 tests and progress
report. No product source change is requested. Keep root review/status/handoff
files untouched. Preserve the corrected distinction between touchscreen taps,
mouse clicks and automated text entry; distinguish mounted state tests from
browser UI checks. Refresh evidence affected by these changes using the existing
canonical/filtered-output discipline. Include a concise advisor disposition for
the changed behavioral tests/verifier, and state which commands the advisor ran.

Run focused checks, the existing evidence script, normal tests/build/browser
matrix, packet lint and diff check. Preserve all prior route rows/oracles. Commit
only owned files, report last; send results to FF Orch 12+ and stop for re-review.
Do not change packet status, push/deploy, expand scope or claim owner acceptance.
