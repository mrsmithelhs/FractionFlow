# Plan 17 Repair 01 re-review

Date: 2026-10-11. Repair `10ab185`; report `b44e679`.
Disposition: product corrections supported; bounded Repair 02 required before
technical acceptance. Packet stays delivered.

Root inspected the repaired constructor/CSS, current capture/verifier and screens.
Five independent focused suites passed (35 tests), including constructor refusal
for substituted operands and legacy admission. The committed artifact verifier
passes with immutable baseline and exact original route-object equality.

Root ran the current capture in local Edge from a copy changing only relative
paths/output to ignored review output. Its first touch scenario passed actual
geometry, leakage and restoration assertions, then failed during JSON writing:
`Converting circular structure to JSON`. The cycle is
`accepted.scaleConservation.accepted.layout -> accepted`; capture lines 623/625
attach a parent layout object to its own descendant. A saved JSON verifier pass
does not establish current capture reproducibility. Root therefore did not reach
the subsequent keyboard scenario in that run.

Repair 01 also required a seed that resizes both result rows equally and fails
cross-state scale conservation. Current falsification still resizes the second
row only and tests equality within the result; no both-row conservation seed or
verifier assertion was found.

Root inspected the canonical accepted screenshot. The new result stack readout
and completed symbolic equation already show 17/12, but the active paragraph
repeats `The answer is 17/12.`. This is redundant learner copy in the new feature
composition. Retain needed alternate-path final-form information, but shorten
the canonical acceptance cue before owner review.

Other repaired mechanisms improve the actual objective: exact API oracles,
isolated stacked/spoken/arbitrary-attribute seeds, real response keyboard recovery,
touch gesture records and reciprocal presentation samples. Existing physical-
device/native typing/AT limits remain. See `repair-02.md` for the small remaining
scope; no new model consultation is needed solely for these evidence/copy fixes.
