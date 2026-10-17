# Plan 34 learner copy and layout repair

Date: 2026-10-17. This bounded repair updates the inspect-candidate learner surface while leaving the Plan 34 task mechanism, candidate data, classification, replay, help, draft, and focus behavior intact.

The prompt now asks, “Does this new fraction show the same amount as the first fraction?” or names the second fraction for the right-side task. The separate visible label was removed. Each view places the single compact stacked candidate fraction directly in the controls beneath the question, followed by Keep and Change top number. The compact variant keeps the fraction rule at its intrinsic width. Its accessible math name is “New fraction [numerator] over [denominator],” and Keep identifies “new fraction” using the same spoken fraction form. Internal candidate/proposal terms and identifiers remain unchanged.

## Evidence

- `npm test -- --run tests/plan34-rendered-task-patterns.test.js` passed: 3 tests. The mounted visual and linear checks assert the exact prompt, one candidate fraction, its accessible name, no visible Proposal label, the Keep accessible name, candidate-before-Keep ordering, and preservation of help, draft, focus, and repair behavior.
- `npm run build` passed for the learner app and subtraction prototype.
- The focused mounted route `ROUTE-PLAN34-INSPECT-LINEAR-DEEP` passed in installed Chrome against production-default-v5 (1 execution, 0 failures). The route runner's exact question assertion was updated in the appended Plan 34 row; the 57 historical route objects were not changed.
- A separate installed-Chrome browser capture completed the first construct and reached the second identity's inspect task. It verified the question, fraction and Keep accessible names, candidate placement directly in the controls, absence of visible proposal wording, intrinsic 22-pixel fraction rule width, and zero page errors in both views at 360×740 and 360×752. Screenshots and measured bounds are in `evidence/plan34-copy-repair-*.png` and `evidence/plan34-copy-repair-measurements.json`.

The four captures show no horizontal overflow. Mobile documents extend to 824 CSS pixels in linear view and 950 CSS pixels in visual view, so the controls require vertical scrolling. This is browser evidence at the stated viewports; it does not establish physical-device, assistive-technology, or classroom suitability. The full 63-execution Plan 34 route matrix was not rerun for this copy/layout repair.

## Parent verification and disposition

Implementation/evidence commit: `4f067c7`. Parent independently passed the mounted
Plan34 and shared-string tests (15 tests), packet lint and diff check. An independent
installed-Chrome journey verified both views' visible question, absence of the old
word, math and Keep accessible names, and intrinsic fraction rule width (22.03 CSS
pixels). Parent then submitted a valid repair and verified the second-fraction
question, with zero page errors. The screenshot review initially caught a stretched
rule; the existing compact variant repaired that without a CSS redesign.

No additional advisor consultation was warranted for this mechanical wording and
presentation adjustment: instructional interactions and schemas did not change.
The orchestrator reviewed source and actual browser behavior. Prior broader Plan34
Sol reviews remain recorded separately. The Luna child requested default-role
`gpt-6-luna` medium configuration; runtime model identity is not independently
observable. It stopped before parent staging and commits.

Plan34 remains delivered with owner rendered acceptance pending. Nothing was
pushed or deployed. Historical report terminology and internal candidate/proposal
identifiers are retained; this repair changes learner-facing language only.
