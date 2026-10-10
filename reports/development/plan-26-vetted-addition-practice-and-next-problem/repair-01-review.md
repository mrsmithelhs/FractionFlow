# Plan 26 Repair 01 re-review

Date: 2026-10-10. Reviewed `ac0078a` and `0a0c9c3`.
Disposition: **production admission correction accepted; bounded evidence-only
Repair 02 required before overall technical acceptance**. Packet remains
`delivered`. No additional problem, selection policy, mathematical algorithm or
product behavior is requested.

## Verified repair and evidence

The validator now matches the existing choice-count and supported bar-range
contracts. A read-only reviewer traced both module faults through the mounted
production Next handler and verified that completed state/replay remain intact
and same-app clean recovery succeeds. Root inspected those tests and reran the
10-test Plan 26 suite plus 8 historical provenance/replay tests: 18/18 passed.
Both learner and prototype builds passed.

Root independently reran the complete new Edge evidence script: five
representative configurations at two viewports, plus two refusal cases, succeeded
with 78 records and 64 screenshots. A temporary copy changed only the output
directory to ignored `dist/plan26-root-review`; the committed captures were not
overwritten and the temporary script was removed. Root algorithmically checked
that the recorded post-scroll question and active-control boxes fit the viewport
in all ten reflection cases. These were live reruns followed by artifact checks,
not a new manual arithmetic oracle.

Root viewed eight representative saved screens: new-item entry, first-item
Next-ready, linear matching, visual premise, final exhaustion, linear false
premise, refusal and dirty pre-Retry help. No new answer disclosure, clipped
representation or duplicate task heading/question was found in that sample.
Screens are full-document captures; narrow pages still require ordinary scroll.
This is sampled visual review, not pixel review of all 64 files or owner acceptance.

The existing completed-problem feedback and separate set-exhaustion message
describe different completion scopes. Disabled baseline Help/Replay controls and
the visual premise's brief lead-in remain visible; this repair introduced no new
explanatory block. Owner sequential screen/agency judgment remains separate.

## Remaining evidence omissions and disposition

- **Sequential touch is not established.** The sole touchscreen tap is on Next.
  Lesson controls and return/re-entry are mouse clicks, Retry belongs to a
  separate keyboard configuration, and refusal has no touch context. Root
  corrected the report's broader gesture wording inline. Complete a bounded
  sequential touch journey using the same production UI.
- **Reset proof needs small additions.** Full independently constructed fresh
  state is checked for dirty second-item Retry in the mock-DOM suite. Next and
  return/re-entry inspect selected fields, and the browser's dirty Retry covers
  only the first item. Both dirty helpers close Replay before Retry. Extend
  exact snapshot comparisons to Next and return/re-entry, and exercise a dirty
  second-item browser Retry while Replay is active, with draft/input/UI cleanup.
  This supplements existing reset guarantees rather than re-proving math.
- **Scroll measurements are useful but weakly guarded.** The live rerun's ten
  post-scroll cases fit; the evidence runner itself only asserts horizontal
  overflow. Add small question/control reachability guards after scrolling so
  later broken vertical layouts cannot still report a successful capture run.

The read-only reviewer recommended a browser state observer for full-state
comparisons. Root does not require duplicating those exact checks inside a
production bundle: independent mounted full-state tests plus real browser
UI/reset/gesture checks are proportionate for this shared reset mechanism.
No production observation API is authorized or needed. Repair 02 specifies that
bounded composition of evidence and does not ask for a larger Cartesian matrix.

Advisor identity remains as reported: requested tier and observed generic model
self-identification are distinct. Root's own read-only review did not modify
source. No physical device/typing, AT, transfer, engagement, push or deployment
claim is established. This prose-only review does not warrant another advisor;
the test/evidence repair inherits the packet's advisor declaration/disposition.
