# Plan 89 pilot — pre-integration audit stop

At baseline `fd97c687af922b9e341212c5e2c8d4502fd855fa`, Plan 85's `plan40-staging.mjs` passed its disposable-copy admission and ordered-operand comparison: 13 staged candidates, 17 live Plan 40 records and two holdouts. The frozen pre-change `baseline-v6-oracles.json` contains three initial-state v6 envelope/reconstruction witnesses for v1, a carried-forward v2 item, and a v2-only item, each checked for exact state equality at capture; the previously committed Plan 79 oracle additionally contains a completed v1 episode. No source file has been changed.

The approved mechanism requires stopping for any equivalent ordered subtraction collision. Comparing each candidate's reduced ordered pair to the Plan 79 catalog inventory found these three distinct candidate-to-existing matches, independently confirmed against the current data files:

| Plan 85 candidate | Existing subtraction | Normalized ordered operands | Existing task |
|---|---|---|---|
| `plan85-isolated-identify-five-eighths-one-fourth-8` | `takeaway-8-5-minus-2` | 5/8, 1/4 | Plan 36 like-denominator subtraction, authored 5/8 − 2/8 |
| `plan85-isolated-identify-three-fourths-one-half-4` | `three-fourths-subtract-two-fourths` | 3/4, 1/2 | Plan 59 directed endpoint, authored 3/4 − 2/4 |
| `plan85-isolated-identify-five-sixths-one-half-6` | `five-sixths-subtract-three-sixths` | 5/6, 1/2 | Plan 59 directed endpoint, authored 5/6 − 3/6 |

The Plan 36 source is `src/content/data/plan36-like-denominator-subtraction-records.js`; Plan 59 source is `src/content/data/plan59-directed-endpoint-records.js`. These are distinct task types and authored forms, not duplicates within Plan 40 itself. The Plan 79 inventory is historical and its comparison does not establish a comprehensive audit of families added since that inventory. Plan 85's own admission comparison covers only Plan 40 live records and holdouts. The complete cross-registry identity/fixture/stimulus and current-family collision audit remains open; do not infer clearance from this partial check. A distance activity also shares the 5/6, 1/2 pair but is a different operation/task and is not one of the three subtraction collisions.

Request orchestration disposition of these exact matches before registration. The proposal preserves the accepted staged records; no replacement, suppression, or publication is implied. The approved default exposure hold, pilot-only gate and no public review route remain in force. No mounted witness, post-change replay, full tests, build, or pilot integration has run. Advisor consultation is not warranted for this documentation and baseline capture; the later behavioral delivery retains its review gate. Existing unrelated Plan 39/40 evidence changes remain untouched.
