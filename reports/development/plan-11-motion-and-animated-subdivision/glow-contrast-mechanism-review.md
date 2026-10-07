# Glow contrast mechanism review

Date: 2026-10-07. Orchestration retrieved the latest completed output directly
from FF Impl 11. This record approves a bounded mechanism, not rendered acceptance.

## Copy repair

Commit `8752fad` implements the exact owner-approved recovery: “Not the same amount
yet. Try a different number of parts.” Both renderers use the shared string while
retaining the parameterized equivalence question. Independent review inspected
the complete source diff and ran the string/recovery tests: 26 passed. No glow
source changed in this commit. Full builds and 43 routes are implementer-reported,
not independently rerun for this small copy correction. No blocking copy defect.

## Approved contrast mechanism

Approve a temporary `#0b1020` core on newly introduced dividing lines only, with
the existing blue halo. Keep the existing 1560ms timeline: 560ms reveal, 80ms
highlight arrival, 920ms fade. Core starts at the existing white, darkens during
arrival, then returns to normal paint with the halo's fade. Specify all core paint
keyframes explicitly so cancellation and settlement restore the baseline without
stale inline paint. Do not alter line width, location, whole, fill, outline, old
boundaries or empty-cell paint. Preserve existing trigger/cancellation ownership.

The implementer's nominal color calculations support investigating this candidate;
they do not establish actual thin-line visibility or accessibility conformance.
Rendered acceptance requires evidence on both filled and empty regions at 12 and
24 parts, including the fading phase. Preserve the existing halo bounds; no new
geometric outset or merging adjacent lines. Reduced motion has neither temporary
darkening nor glow. Static presentations and Inspection Mode stay unchanged.

Browser witnesses must prove the new core paint during highlight and return to
baseline on completion/cancellation, along with existing reveal, document-coordinate
conservation, input/focus/reset and negative controls. A core-suppression seed that
preserves the halo must fail specifically at the contrast assertion. Nominal contrast
ratios alone are insufficient. Supply matched rendered evidence for owner review.

The named contrast repair is authorized despite Plan 11's delivered status; do not
change status or broaden into Plan 22/24, instructional changes or deployment.
Existing scoped source approval and commit/report discipline apply. Re-review the
candidate; owner partial acceptance remains partial. Advisor consultation was not
warranted for this prose-only orchestration review.
