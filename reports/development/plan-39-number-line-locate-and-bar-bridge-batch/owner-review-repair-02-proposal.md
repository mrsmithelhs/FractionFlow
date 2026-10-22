# Plan 39 owner review — Repair 02 proposal

Date: 2026-10-21. Owner tried the local development site and did not accept the
new task. Plan 39 remains delivered awaiting repair, not complete. This record
supersedes any implication that technical delivery establishes learner usefulness.
It records owner feedback and an orchestrator proposal; the detailed replacement
mechanism is not yet approved. No source changes or new implementation run here.

Owner adoption (2026-10-21): owner approved the repair direction and authorized
execution with Luna implementation plus fresh browser walkthrough reviewers.
Plan reopened in-progress; exact mechanism investigation is now assigned to
`/root/plan39_repair02_luna`, with a parent stop before source. Target one
consolidated Sol read-only low/medium review, second only for a substantial
remaining issue. See `docs/workflows/browser-walkthrough-review.md` for the pilot.

## Owner findings

- Encounter repeats the request but provides only Continue. Merge it with actual
  placement rather than requiring an acknowledgment with no mathematical action.
- A bar aligned above the line reveals the matching point through its shaded
  endpoint. Symbolic fraction plus line is preferred before the response; reveal
  the aligned bar after a correct answer. A different source representation, such
  as a circle, is another possible later variation.
- Sparse linear descriptions are vague. Remove “Offered point,” use letter-first
  choices, and replace “preview” directions where no picture is present.
- The linear post-answer screen describes a generic bar and line, but does not
  explain why the learner's selected position matches the fraction.
- Pointer/finger placement with snapping should be supported. The movable token
  should start unplaced, outside the line, not on an arbitrary numeric answer.
- A later task could place three fractions before checking the collection.

## Proposed bounded repair to the current task

1. Start directly with one actionable prompt, stacked source fraction and line.
   Suggested prompt: “Place this fraction on the number line.” No separate
   learner-visible encounter acknowledgment. Do not merely auto-dispatch a hidden
   acknowledgment and claim the instructional contract is unchanged.
2. Withhold the shaded bar before acceptance, including hidden/accessibility DOM
   and source-bar-derived help. After a correct Check, reveal the aligned bar and
   connector as an inspectable explanation of the established equivalence. This
   is explanatory feedback rather than a decorative reward. Keep a meaningful
   numerical/unit connection in the linear result too.
3. Add pointer/touch placement and dragging with snapping to projected offered
   locations, preserving explicit Check. Start with the fraction token unplaced
   outside the line. Snapping chooses the nearest offered location, never the
   correct answer. Retain 44px non-drag controls and keyboard operation; drag must
   not be a dependency. Pointer cancellation/scrolling and view-switch/reset
   behavior need a bounded mechanism and real input witnesses.
4. Replace vague benchmark prose with precise, reusable descriptions of the
   represented unit/position. Recommended design direction: describe an equal
   subdivision scale once, then candidate distance from zero in those units,
   generated from exact upstream fractions. Example: “0 to 1 has 6 equal steps,”
   with “A: 1 step from 0,” “B: 2 steps from 0,” etc. The scale must represent
   every offered position exactly; derive a bounded common subdivision through
   exact math and validate its reading burden. This proposal is not permission
   for renderer math, approximation or unrestricted denominator growth.
5. Linear prompt: “Choose a location.” Keep letters, remove “Offered point.”
   Selection is pending until Check, but do not require learner-facing “preview”
   terminology to communicate that implementation distinction. Post-answer text
   must connect the chosen distance/unit to the source fraction, e.g. three
   quarter-length steps from zero reach three quarters. Avoid displaying a generic
   line description as the mathematical result or adding a mandatory reflection.

The precise scale is representation information, not a correctness flag. Do not
hide mathematical location information just to avoid an easy text match. Test
that descriptions distinguish positions mathematically, not merely through A/B
prefix uniqueness. Existing benchmark descriptors are algorithmic but too coarse
for a general scalable location contract.

## Gate and evidence implications

This revises the owner-adopted persistent-bar/encounter/description task contract.
Approve the revised instructional mechanism before source. Investigate definition,
task/scene and replay revision consequences explicitly: old envelopes must retain
their original meaning or have an explicit compatibility disposition, never replay
silently into the revised task. Preserve old arithmetic and all unrelated routes.

New evidence must prove no pre-answer aligned-bar cue; actual actionable initial
screen; actual drag/tap and keyboard/non-drag placement; unplaced initial token;
nearest-offered snapping independent of correctness; explicit Check; precise
accessible locations; meaningful visual/linear resolve feedback; help/recovery;
cancel/remount/reset; and required viewport layout. Deliberate failure controls
must exercise these goals rather than only assert generic selectors or counts.

Keep the current eight records and one-fraction responsibility unless owner
adopts a separate expansion. Defer circle representations and the three-fraction
collection task to their own design scope. Do not launch another implementation
or declare owner acceptance from this proposal alone. No push/deployment.
