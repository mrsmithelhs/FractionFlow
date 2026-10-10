# Plan 26 delivery review

Date: 2026-10-10. Disposition: **bounded Repair 01 required before technical
acceptance**. Reviewed implementation `92e13db` and progress report `aed852a`.
Root set Plan 26 to `delivered` on receipt; that records receipt, not acceptance.
Owner rendered-screen/agency acceptance and publication remain separate.

## Findings

1. **Matching admission does not satisfy the actual presentation contract.**
   `src/content/authored-task-data.js` accepts two choices, while both
   `src/render/beat-container.js` and `src/render/linear-path.js` require at least
   three. It also accepts an incorrect choice above one whole, which the visual
   matching-choice renderer refuses. One equivalent choice and unique IDs alone
   do not establish that the authored task can render. The current authored rows
   are valid; this is a defect in the required corrupt-data refusal mechanism.

   A read-only reviewer used an in-memory module fault to remove the second
   fixture's third choice on both paths. Mounted Next replaced the completed
   first episode; continuing reached an active reflection with
   `MISSING_REFLECTION_CHOICES` and no active controls. Root inspected the
   admission/consumer contracts and independently executed the original validator
   against a two-choice array and an outside-whole distractor. Both returned
   true; the actual visual renderer rejected the latter. This was algorithmic
   fault testing, not manual fraction verification. Repair must refuse before
   state/index/UI replacement and preserve the completed episode and replay.
2. **Required Plan 26 browser coverage and durable rendered evidence are missing.**
   The three new rows cover only the default visual, more-support,
   standard-motion configuration. The implementer confirmed no Plan 26-specific
   reduced-motion full journey, touch-context gestures, real-browser corrupt-data
   refusal, or first Tab after Next/Retry. Other-condition/support/view evidence
   is primarily mock-DOM dispatch and admission/reconstruction, not sequential
   browser participation. No screenshots or measurement artifacts were saved;
   dimensions are reported from console output, with captures held only in memory.
   Existing matrix routes remain valuable regressions but do not cover the new
   item's navigation and reset under the missing configurations.

## Independently verified strengths and checks

- Candidate construction otherwise precedes state/index replacement. Navigation
  remains app-owned; episode definition and replay schema were not changed.
- Revision-aware accessors preserve the old authored rows. The new fixture's
  mathematical construction and authoring use shared upstream code rather than
  fixture-specific lesson branches. Its future per-item authoring cost is
  distinguished from the one-time navigation lifecycle in the report.
- Focused Plan 26 and route-contract suites: 29 tests passed. Existing
  provenance/replay suite: 8 tests passed, including historical replay oracles.
  Both learner and subtraction-prototype builds passed.
- Root compared parsed route rows against `318c79f`: all 51 prior rows are
  identical and remain in order. No legacy witness was weakened.
- Root reran all three Plan 26 Edge routes: 3/3 passed. Sandbox Edge launch failed
  before routes ran; the narrowly escalated same command succeeded. Measurements
  reproduced no horizontal overflow, 394px narrow vertical scroll range and 27px
  larger-viewport range. These describe a reflection screen and an initial screen,
  respectively, not a sweep of the second item or all configurations. The narrow
  active-control region extends below the initial viewport; scrolling is allowed.
- Read-only reviewer found no additional blocking code issue in the bounded
  app/content audit. Root independently checked its confirmed contract mismatch;
  its full in-memory fault journey was not separately rerun by root. No source
  was edited by this review.

## Disposition and limits

`repair-01.md` authorizes the bounded admission correction and missing evidence.
The owner has authorized bidirectional Plan 26 corrections with FF Impl 26 until
its work is done. Do not reopen DECISION-041, add problems or an authoring engine,
or introduce random selection. Keep the exact-math authority and automated checks;
agent prose is not an arithmetic oracle. CSS changes used the actual existing
`src/app/styles.css`; the mechanism review's `src/styles/render.css` path was a
routing error, not a requirement to create a second stylesheet.

No physical Chromebook, physical touch/typing, assistive-technology, transfer or
engagement evidence is established. Technical acceptance remains pending repair;
owner acceptance remains pending saved screens and sequential participation review.
No push or deployment. This prose-only review does not require an implementer
advisor consultation; the repair inherits that consultation/disposition contract.
