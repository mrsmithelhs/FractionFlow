# Plan 35 — reusable task recipes and authored batch

**Delivery progress report — 2026-10-17**  
**Scope:** implementation and evidence for the approved Plan 35 contract. This report is not owner classroom/rendered-screen acceptance, packet status closure, or deployment authorization.

## Result

Plan 35 implements three exact, registered addition-task recipes over a fixed 21-item production set while preserving the original 13-item prefix and eight legacy workflows. The generalized recipes reuse the existing exact arithmetic, content validation, episode, schedule, provenance, replay and compact rendering paths. Two additional records prove that the registry can admit new recipe data without behavioral changes; they remain in a strict test-only set and are not learner reachable.

Historical behavior remains versioned. Existing v1/v2/v3 replay meanings and fixtures are retained, including Plan 18's v3 restriction to historical set@6. The five compact Plan 34/18 prefix items use explicit new v4 associations in set@7 with their established learner responsibilities, forms, targets, candidates and schedules preserved. The other eight prefix workflows retain their original definitions.

## Recipe contract and production batch

The three fixed recipes are:

| Recipe | Learner task | Exactness and state guarantees |
|---|---|---|
| `full-addition.construct-equivalent@1` | Construct each required equivalent, submit one sum, finish. | Exact conversion derives required sides and forms; exact operation validation determines truth. |
| `full-addition.inspect-keep-repair@1` | For each fixed candidate, keep it or change its numerator; submit one sum and finish. | Candidate correctness is hidden until response. Exact equivalence/operation APIs determine truth; accepted, repaired, unchanged and provided forms retain provenance. |
| `full-addition.identify-side-construct@1` | Identify the side needing a different denominator, construct only that side, submit one sum, finish. | The target already appears on exactly one source operand; exact conversion identifies the other side. A wrong side recovers at the choice without changing the frozen required side. |

The schedule is selected and frozen before response. Recovery, support, help, view and replay do not select a new recipe or schedule. The learner's accepted operation form is retained. Help remains opt-in, local and answer withholding. No problem-specific reducer or answer table was added; exact APIs determine conversions, equivalence, candidate validity, totals and eligibility.

Set@7 retains all 13 original item IDs and their order, then appends the following eight items in this order:

| Appended item | Recipe / source forms | Target and task-specific detail |
|---|---|---|
| `plan35-construct-half-fifth-10` | Construct; `1/2 + 1/5` | 10; construct `5/10 + 2/10`, sum `7/10`. |
| `plan35-construct-three-fifths-third-30` | Construct; `3/5 + 1/3` | 30; construct `18/30 + 10/30`, sum `28/30` (`14/15`). |
| `plan35-inspect-third-eighth-24` | Inspect; `1/3 + 1/8` | 24; left `5/24` is false and repairs to 8; right `3/24` is equivalent and kept. |
| `plan35-inspect-fifth-third-30` | Inspect; `1/5 + 1/3` | 30; left `6/30` is equivalent (including a valid unchanged edit); right `11/30` is false and repairs to 10. |
| `plan35-identify-half-three-tenths-10` | Identify; `1/2 + 3/10` | 10; choose left and construct `5/10`. |
| `plan35-identify-three-tenths-half-10` | Identify; `3/10 + 1/2` | 10; mirrored required side is right. |
| `plan35-identify-third-five-twelfths-12` | Identify; `1/3 + 5/12` | 12; choose left and construct `4/12`. |
| `plan35-identify-five-twelfths-third-12` | Identify; `5/12 + 1/3` | 12; mirrored required side is right. |

Together with the reassociated prefix, recipe targets are construct 10/12/30, inspect 12/24/30, and identify 8/10/12. Both identify sides are represented. Production membership stays exactly 21 items; the set is not a required session length.

## Data-only authoring proof

The production registry has 13 recipe associations over the 21-item set: five reassociated prefix tasks and eight appended tasks. The data registry has 15 records total after the hold-out addition: those 13 plus two records in exact test-only set `plan35-data-only-holdouts@1`.

| Test-only item | Exact fixture and forms | Task binding |
|---|---|---|
| `plan35-holdout-construct-fifth-sixth-30` | `curated-plan35-holdout-one-fifth-one-sixth-construct@plan35-record-v1`; `1/5 + 1/6` | Construct target 30, `task-data@2`; exact forms `6/30 + 5/30 = 11/30`. |
| `plan35-holdout-inspect-half-fifth-20` | `curated-plan35-holdout-half-fifth-inspect@plan35-record-v1`; `1/2 + 1/5` | Inspect target 20, stimulus `plan35-stim-holdout-half-fifth-20@1`, `task-data@2`; left `9/20` is false, right `4/20` true. Exact operation result is `14/20` (`7/10`). |

Relative to accepted foundation `46790ad`, the only source change for this proof was `src/content/data/plan35-addition-recipe-records.js` (24 insertions, 1 deletion). Each new fixture is derived from one authoritative compact numerical task row; task association and fixture source forms are bound to that row instead of retyped independently. The generic resolver and replay require the exact registered set and item/task-data membership. There is no null-set or arbitrary-set compatibility path, and neither hold-out is in learner practice types or the 21-item set.

The reusable authoring procedure is: add one compact numerical record row; derive its fixture/source forms from that row; register the exact recipe, target, task-data revision and any stimulus; add an explicit exact set association; then use the existing generic registry-discovery and exact-arithmetic validation/sweep. A new registered test-only association can be exercised without changing resolver, reducer, schedule, replay or rendering behavior. The existing sweep discovers all 15 records under actual high and medium profiles, completes/replays them and exercises applicable recovery.

## Versioning and historical compatibility

The new recipe definition uses replay envelope v4. It is warranted by the new strict definition/context contract and association meaning; v2 already contains target, candidate and stimulus fields. V4 reuses the established context fields and explicitly binds ordered `sourceForms`. Reconstruction requires those forms to match both content identity and the exact fixture; selected set, item, definition, recipe, task data, target, sides and stimulus membership are exact registered identities. Unknown, missing, extra, forged or incompatible associations fail closed.

Existing v1 legacy meaning, v2 Plan 34 meaning and v3 Plan 18 meaning remain unchanged. In particular, v3 remains tied to historical set@6, target 8 and its exact required side; set@7 was not added to v3. A frozen pre-edit Plan 18 v3 oracle covers initial and completed states in both operand orders. Existing v1/v2 fixtures were left unchanged. The five reassociated prefix tasks have semantic differential checks against historical responsibilities and forms. Historical Plan 18 journeys are pinned as a coherent set@6 page, registry, data and helper; current journeys use explicit set@7/v7 imports.

The original 63 route objects, including executable actions and assertions, compare deep-equal to baseline `201235e`; exactly two Plan 35 deep-route rows were appended. The eight legacy prefix workflows retain their prior definitions and behavior.

## Mounted behavior and evidence

The mounted set@7 app uses data-derived task associations. Shared compact controls support the three recipes without item-specific UI branches. A narrow parity repair extends the established compact-help visibility rule to generalized construct/inspect beats outside decide/transform; identify behavior and task-local transform help remain as specified. The repair was verified at construct encounter/operate/resolve and inspect operate/resolve.

Focused native Chrome evidence is in `plan35-focused-browser-results.json`, produced by `capture-plan35-focused-browser-evidence.mjs`. It records 14 journey records (eight distinct task identities plus supplemental checks), seven measurements, and two separately labeled seed/clean receipts. Coverage includes construct/inspect/identify, targets 10/12/24/30, both identify sides, high/medium support, visual/linear views, response recovery, help, completion, Replay visibility, reset, touch taps and an inspect task completed using Tab, Enter and keyboard text entry without pointer or programmatic focus jumps. Construct@10 checks that a wrong multiplier is rejected while the numerator remains withheld, the correct multiplier is accepted, and a later wrong numerator recovers.

The full native Chrome matrix in `plan35-route-matrix-summary.json` has 65 route rows and 67 executions, all passed with zero known defects: 49 historical-v4, 2 historical-v6, 12 current-v7 and 4 prototype executions. Two production-default-v7 deep journeys traverse all 21 set members through mounted controls, gate Next on completion, and verify exhaustion, return and re-entry. This full-set traversal is separate from the focused sample sweep.

The target-30 conversion witness samples actual partial reveal, highlighted boundary and settled paint. The final highlight sample requires progress at least 0.41 and observed the dark core at `rgb(14, 19, 35)`; changed operand geometry is checked at each phase and the untouched operand whole/fill geometry and boundary count remain stable. The conversion settles at full boundary height with no running animation. This is a sampled witness, not every-frame or every-pixel proof. A matched reduced-motion target-30 conversion starts with draft `18`, reaches `18/30` immediately and invokes no boundary WAAPI. Separately, linear medium identify Replay preserves draft `7` on the same operation-input node across toggles. That does not establish reduced-visual Replay continuity.

The same answer-withholding assertion is used for the clean and seeded states. Injected `8/24` triggers its intended failure; removing the seed produces the clean pass. Final viewport measurements cover 360x740, 360x752, 1366x768 and a labeled 125%-equivalent CSS viewport/DPR emulation (1093x614 at DPR 1.25). After ordinary vertical scroll where needed, the question and required controls fit within 0.5px tolerance and no horizontal document overflow was measured. The screenshot named `plan35-construct-10-transform-help-360x740.png` shows the help entry control closed, not an open panel.

The optional static-page request `/favicon.ico` returned 404 (`resourceType: Other`). No required app assets or requests failed and no page errors occurred; therefore this report does not claim zero browser console errors. The 1366x768 viewport is Chromebook-sized CSS emulation, and the 1093x614/DPR1.25 case is viewport/DPR emulation, not physical hardware or browser zoom. No physical Chromebook, assistive technology, classroom suitability or learning efficacy was tested.

## Validation and review disposition

Parent independently verified the full test suite (44 files, 402 tests), both production builds, packet lint, route contract tests, the native prefix smoke, route preservation and final focused evidence (14 journeys, seven measurements, two seed/clean receipts). The 65-row/67-execution route matrix passed. The focused C2 receipt has no page errors and separately identifies the optional favicon 404.

The requested implementation configuration was Luna, medium effort. Runtime model identity was not independently observable. A Sol low-effort, read-only review was arranged; the final `stage-c2-review.md` records acceptance of the repaired evidence with no remaining blocker. The advisor did not run tests; verification is reported from the persisted artifacts and parent-run checks.

Earlier bounded findings and dispositions remain in `stage-a-review.md`,
`stage-b-data-only-holdouts.md` and `stage-c1-review.md`. They include admission
and identity validation repairs, the exact data-only diff proof, target-specific
help/copy and Replay gating. The C1 injected-instance regression finding was
withdrawn after parent demonstrated the same limitation in the baseline. The
C2 motion and seeded-withholding findings were repaired, independently rerun
and accepted. These records distinguish accepted repairs from rejected or
pre-existing findings rather than implying a finding-free implementation.

Committed checkpoints: shared foundation `46790ad`, data-only hold-outs
`110493e`, mounted wiring `201235e`, browser evidence/Help parity `45019d1`.
The final report is committed after delivery records and packet-status handling.

## Owner review samples

- [Construct target10 encounter](plan35-construct-10-360x740.png).
- [Construct target10 conversion with local help entry](plan35-construct-10-transform-help-360x740.png).
- [Inspect target30 at360x740](plan35-inspect-30-360x740.png).
- [Inspect target30 in labeled zoom-equivalent viewport](plan35-inspect-30-zoom-emulation.png).

Parent has recorded Plan35 as delivered after technical review. Owner rendered-screen/agency acceptance and deployment approval remain separate and pending. Plans 36 and 37 remain design drafts only; this work does not authorize or claim their implementation. No push, deployment, Bootstrap operation or dependency/settings change occurred. Parent owns final status and commit handling.
