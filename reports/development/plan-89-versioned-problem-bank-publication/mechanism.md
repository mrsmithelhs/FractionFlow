# Plan 89 Requirement 0 — publication mechanism proposal

**Status: proposed for orchestration and owner decision; no source changes authorized by this document.** Baseline: `9330395887372faeb7232802ab8201d473de50ff` (Plan 89 packet commit). `node scripts/dev/plan-status.js check plan-89` returned RUNNABLE. Plan 85 owner acceptance covers staging, not publication. Existing unrelated Plan 39 and 40 evidence modifications were present at preflight and are outside this work.

## Pilot: exact records, associations and sequence

The authoritative full operands, inspect stimuli and identities are [Plan 85's candidate JSON](../plan-85-cross-recipe-problem-bank-expansion/plan40-candidates.json). Propose retaining its exact item IDs, unique fixture IDs, `plan85-isolated-v1` authoring revision, recipe IDs, target denominators, inspect stimulus IDs/revisions and candidate forms. In the table the item prefix is `plan85-isolated-`; the fixture is exactly `isolated-plan85-` plus the remainder of the item ID. All use `curated-review` and the shown selector; `R` means the `reducible-result` overlay, otherwise overlays are empty. These are distinct new fixtures generated from the existing profile/selector with the candidate's own operands, **not** the IDs of existing golden fixtures, whose operands differ. For inspect records preserve the JSON's deliberately incorrect candidate forms and verify each keep/repair classification against exact arithmetic.

| Append order | Item suffix | Operands → target | Recipe / selector | Overlay or side |
|---:|---|---|---|---|
| 1 | construct-five-sixths-one-fourth-12 | 5/6 − 1/4 → 12 | construct / shared-factor-subtraction | — |
| 2 | construct-five-eighths-one-sixth-24 | 5/8 − 1/6 → 24 | construct / shared-factor-subtraction | — |
| 3 | construct-seven-tenths-one-third-30 | 7/10 − 1/3 → 30 | construct / relatively-prime-subtraction | — |
| 4 | construct-four-fifths-one-sixth-30 | 4/5 − 1/6 → 30 | construct / relatively-prime-subtraction | — |
| 5 | inspect-seven-eighths-one-third-24 | 7/8 − 1/3 → 24 | inspect / relatively-prime-subtraction | — |
| 6 | inspect-four-fifths-one-half-10 | 4/5 − 1/2 → 10 | inspect / relatively-prime-subtraction | — |
| 7 | inspect-five-sixths-one-fifth-30 | 5/6 − 1/5 → 30 | inspect / relatively-prime-subtraction | — |
| 8 | inspect-five-eighths-one-third-24 | 5/8 − 1/3 → 24 | inspect / relatively-prime-subtraction | — |
| 9 | identify-five-eighths-one-fourth-8 | 5/8 − 1/4 → 8 | identify / nested-denominator-subtraction | right |
| 10 | identify-three-fourths-one-half-4 | 3/4 − 1/2 → 4 | identify / nested-denominator-subtraction | right |
| 11 | identify-seven-twelfths-one-third-12 | 7/12 − 1/3 → 12 | identify / nested-denominator-subtraction | R, right |
| 12 | identify-two-thirds-one-sixth-6 | 2/3 − 1/6 → 6 | identify / nested-denominator-subtraction | R, left |
| 13 | identify-five-sixths-one-half-6 | 5/6 − 1/2 → 6 | identify / nested-denominator-subtraction | R, right |

The recipe names are respectively `unlike-subtraction.construct-equivalent`, `unlike-subtraction.inspect-keep-repair`, and `unlike-subtraction.identify-side-construct`. The proposed sequence is the staged order, not a demonstrated pedagogical progression; editorial approval must cover both records and order. Before integration run exact admission and operand/result checks and identity, stimulus and ordered-equivalent duplicate audits across the live catalog and holdouts; stop and return any collisions or unsupported records for decision, not silently substitute. Preserve cross-operation overlap separately.

Propose immutable `unlike-subtraction-vetted-set` revision `3`: exact v2 order (the nine v1 items followed by eight Plan 76 items) plus the 13 rows above, giving 30. Keep v1, v2 and the separate two-item holdout set byte/value-equivalent in membership and order. Register v3 in `PLAN40_RECIPE_ASSOCIATION_SETS` with existing explicit `(setId, revision, itemId)` resolution. Do not use the item-only helper to infer a revision for shared members: it intentionally becomes ambiguous. Record/fixture/stimulus registration and all-record admission are distinct from chooser exposure.

## Exposure and real-path review proposal

**Preferred decision requested:** register v3 but leave the ordinary chooser bound to v2 and its 17 items. Fixed Next would make a complete v3 run 30 items, with the first new item at position 18; do not expose that longer default run without separate owner approval or a later approved short-draw policy. This packet does not implement Plan 87 scheduling/draw policy. Authored sessions, featured scheduling and existing practice records remain unchanged. After registration the ledger should say staged 13, registered v3 30, default-reachable v2 17; these are prospective figures, not present behavior.

For review, construct a separate test-only mounted app using `createApp({ practiceTypes })` in `src/app/app.js`, with a v3 practice type assembled from the very same registered v3 membership/records and ordinary episode definition used by the production path. Use the actual chooser, `startPractice`, Next and `resolvePlan40SubtractionRecipeContext`, carrying the v3 set identity; do not inject a replacement resolver, synthetic task context or altered membership. The regular app retains its v2 chooser. Witness the last carried-forward item (position 17) → first new item (18), fresh draft and retry, construct/inspect/identify, equivalent accepted response, visual/linear view, and final item/end-of-set behavior; cover narrow and enlarged-text views and report browser and accessibility limits. Reaching position 18 is intentional test navigation, not a proposed learner shortcut. If the app injection seam cannot exercise the unmodified launch/resolver end-to-end, stop and seek a revised mechanism rather than claiming equivalence. The separate app is a review harness, never an extra production chooser option.

## Historical witnesses and admission

Before source changes capture committed-baseline v6 Plan 40 envelopes and expected reconstructed state, including v1 and v2 carried-forward and v2-only representatives. After registration compare reconstructed state and full set identity against the baseline; also replay v3 carried-forward and new items with newly created envelopes. Reject a v3-only item under v1/v2, unknown or wrong set/revision, holdout under a practice set, and a wrong fixture/stimulus association. Confirm pre-existing older supported readers and holdout isolation; verify actual consumers before proposing any shared resolver change. Run deterministic all-30 admission and completion, duplicate and fixture inventory, focused and full tests, build, affected browser routes, packet lint and scoped diff checks. Historical reconstruction is a separate claim from mounted learner experience.

## Second batch — only after pilot review and authorization

The three source data files already contain 30 staged tasks each; only their listed v1 members are materialized for current practice. Proposed v2 preserves each v1 order and appends remaining existing IDs in numerical order, pending editorial and exposure decisions:

| Family | Source data and current set | v1 → proposed v2 | Smallest family-specific work |
|---|---|---|---|
| Plan 74 regrouping addition | `src/content/data/plan74-mixed-addition.js`; `mixed-number-addition-with-regrouping` | `plan74-add-01`–`02` → `01`–`30` | Add frozen v2 membership and revision-aware materialization/resolution in `src/content/plan74-mixed-addition-task.js`; preserve eighths, regrouping and response bounds. |
| Plan 78 subtraction without decomposition | `src/content/data/plan78-mixed-subtraction.js`; `mixed-number-subtraction-without-decomposition` | `plan78-subtract-01`–`04` → `01`–`30` | Equivalent v2 membership and resolver in `src/content/plan78-mixed-subtraction-task.js`; retain no-decomposition and existing representation bounds. |
| Plan 82 subtraction with decomposition | `src/content/data/plan82-mixed-subtraction.js`; `mixed-number-subtraction-with-decomposition` | `plan82-subtract-01`–`04` → `01`–`30` | Equivalent v2 membership and resolver in `src/content/plan82-mixed-subtraction-task.js`; retain required decomposition and existing representation bounds. |

At baseline the family resolvers materialize v1 and accept item ID alone; `src/app/app.js` and `src/interaction/replay.js` call them without set identity. Proposed smallest shared integration forwards and validates explicit set ID/revision from the practice type and saved envelope through each family resolver and context validator, without changing episode definitions or envelope schema unless tests reveal a necessary change requiring renewed approval. Capture baseline v17 (Plan 74), v18 (Plan 78), and v19 (Plan 82) saved envelopes and expected full states; after changes reconstruct each unchanged, plus v2 carried-forward and new items, and reject wrong revisions, sets and nonmembers. Audit every staged task for exact operands, identity and duplicates; examine zero/nonzero remainders where supported and repeated results. For each family mount the same isolated chooser/launch/resolver technique with v2 while default remains v1 unless separately approved. Review actual new envelopes, not just fixture construction. Do not increase model bounds.

## Ownership, gates and evidence

Lead owns shared `src/app/practice-types.js`, `src/app/app.js`, `src/interaction/replay.js`, registration integration, serial shared validation, and consolidated review. Following pilot approval, disjoint read-only preparation may inventory Plan 74, 78 and 82 separately; family implementation ownership is limited to its data/task/tests and separate report path, serialized where shared files intersect. Only one copied-source or fixture writer at a time, after resolving and verifying a disposable destination within its designated scratch directory; never write copied data into source accidentally. Browser and full-suite runs are serial. No workers or source writes are authorized by this proposal alone.

Decision sequence: (1) orchestration and owner approve exact pilot mechanism, sequence and held exposure; (2) implement and review the Plan 40 pilot, including actual mounted and historical evidence; (3) only after pilot review authorize the bounded mixed-family batch and its exposure policy; (4) owner reviews integrated rendered journeys. Separate approval is needed before changing default exposure. Keep Plan 87, broader architecture, new representation bounds and deployment out of scope. This is a proposal; no production reach, replay success, rendered behavior or learner benefit has been established here.
