# Plan 85 — second staging and bridge checkpoint

Status: **for orchestration review; no publication approved**. Baseline `e3507cde52abc8d959c9f881441fc92ed8371f35`; `plan-85` preflight returned RUNNABLE. This wave writes only report-local candidate data, disposable probes and evidence. `git diff --exit-code e3507cd -- src` confirmed no production source change. The live registry, memberships, replay resolvers and progression remain unchanged. Counts below are source-level membership counts, not evidence that a learner traversed every item.

## Newly staged candidates

| Family | Live IDs | Additional report-local candidates | Distinct total under the stated task key | Admission evidence |
|---|---:|---:|---:|---|
| Unlike addition (Plan 35) | 21 | 15 | 30 | Unmodified validator and authored fixture materialization in an isolated source copy; 15/15 accepted. |
| Unlike subtraction (Plan 40) | 17 | 13 | 30 | Unmodified problem and recipe validators in an isolated source copy; 13/13 accepted. Two pre-existing holdouts are separate from both counts. |
| Number-line collection (Plan 50) | 4 | 26 | 30 | Existing record validator accepts all 30 directly; candidates remain outside the current resolver. |
| Directed endpoint (Plan 59) | 6 | 24 | 30 | Existing validator accepted all 30 in an isolated copy whose disposable registry contains the candidates. |

The report-local JSON and matching `plan35-staging.mjs`, `plan40-staging.mjs`, `plan50-staging.mjs`, and `plan59-staging.mjs` scripts contain candidate data and reproduce the bounded checks from the repository root. The scripts for Plans 35, 40 and 59 copy `src/` into a temporary directory, add only candidate fixture/data records to that disposable copy and call the **unchanged copied** validators. No candidate is admitted to the production catalog or active set. Plan 50's record validator accepts a record independently of membership, while its normal context resolver rejects every candidate. The endpoint normal resolver also rejects every candidate. Plan 35/40 context resolvers reject candidates absent a membership association. Tests of malformed denominator, non-common target, altered fixture forms, zero movement or unregistered identity provide negative controls; `plan40-admission-results.json` records seven worker checks. Copies are reconstructed and removed by the scripts; they do not prove new-version replay, production launch, or browser usability.

Plan 35 has a material counting distinction: the 21 live IDs represent **15 distinct unordered exact operand pairs** under the conservative rule that does not credit an addition reversal or recipe/ID alone as a new numerical task. Six pairs repeat or reverse; 15 new pairs bring the distinct count to 30. Retaining all 21 live IDs as a prefix and adding all 15 would produce a 36-item fixed set, not 30. Some recipe branches or operand roles might make repeated forms instructionally different; owner review would need to decide that before using a less conservative key. Candidates span targets 14, 18, 20 and 21, but four inspect examples all place the valid converted form on the same side; change or rebalance this before publication. They use only relatively-prime addition, so they do not establish cross-recipe balance.

Plan 40 has 17 distinct ordered live operand pairs, two separately retained historical holdouts, and 13 candidates distinct from both groups. The proposed candidates cover construct, inspect and identify-side branches, but require editorial balance and rendered review. Plan 50 compares the sorted **exact-value multiset** of its three members, so different IDs, input order or cosmetic equivalent notation do not add to the count. Its sample includes distinct positions and equivalence pairs, and deliberately avoids repeated zero or one as an equivalence pair. Plan 59 compares exact starting amount, direction and movement; the 24 staged candidates are split 12 add / 12 subtract and include denominators 4, 6 and 8. Candidate order in all four files is a staging order, not an approved learning sequence.

## Sixteen-type interim ledger

This is a checkpoint inventory, not the completed delivery ledger. “Staged” means additional records, not live records; `?` means a task-aware maximum or publication seam remains unresolved. Standalone registry counts are from `PRACTICE_TYPES`. Composed sessions consume existing tasks and do not add bank items. The earlier `coverage-ledger.md` and `capacity-seam-audit.md` retain recipe, source and historical-resolution details.

| Standalone type | Live IDs | Additional staged | Known distinct capacity / blocker and smallest follow-up |
|---|---:|---:|---|
| Unlike addition | 21 | 15 | 30 conservative pairs including 15 live pairs; fixture/association v8 and replay need separate design. |
| Like addition | 1 | 0 | Current exact singleton contract; broader capacity and a safe versioned seam unknown. Investigate the fixed definition/fixture contract. |
| Like subtraction | 8 | 0 | Capacity ?; fixed v1 record/fixture set needs a historical versioned seam audit. |
| Unlike subtraction | 17 | 13 | 30 ordered live-plus-candidate pairs, plus two separate prior holdouts; review v3 fixture registration and replay. |
| Bar-to-line same amount | 8 | 0 | Capacity ?; exact fixtures, candidate choices and historical definition/membership need audit. |
| Symbolic comparison | 12 | 0 | Capacity ?; authored cues and ordered revision-one registry need review and a versioned membership design. |
| Number-line collection | 4 | 26 | 30 distinct exact-value multisets validated; current fixed-v1 resolver needs a versioned seam for publication. |
| Fraction distance | 4 | 0 | At most 31 unordered proper endpoint pairs in sixths/eighths under the conservative key; two current entries reverse the same pair. Establish safe candidate staging and versioned replay. |
| Two-whole location | 8 | 0 | At most 17 distinct exact amounts on the allowed eighth lattice; 30 needs a separately reviewed representation/task expansion. |
| Whole-plus-fraction construction | 6 | 0 | At most 9 exact amounts on current halves/fourths range under amount key; determine whether a different written unit meaningfully changes the work before any broader target. |
| Directed endpoint | 6 | 24 | 30 distinct ordered start/direction/amount keys validated in a disposable registry; production fixed-v1 resolver needs versioning. |
| Mixed addition without regrouping | 4 | 0 | Exact registered four-item v1 pool; separate data and historical resolver before expanding. |
| Mixed addition with regrouping | 2 | 28 | 30 distinct operand pairs staged in existing inactive data; v1 replay is fixed and needs versioning. |
| Mixed subtraction without decomposition | 4 | 26 | 30 distinct directed pairs staged in inactive data; fixed-v1 replay needs versioning. |
| Mixed subtraction with decomposition | 4 | 26 | 30 distinct directed pairs staged in inactive data; fixed-v1 replay needs versioning and result-distribution review. |
| Mixed-to-improper bridge | 4 | 0 | Eleven current-limit written forms represent at most seven exact amounts; 30 requires separately approved wider representation bounds. |

Some existing IDs repeat an exact amount or pair, so live ID count is not necessarily a task-aware unique count. The missing capacities and remaining families still need evidence before delivery; this table is not a claim that all 16 types meet their targets.

## Bridge comparison

The [wave-two evidence](bridge-wave2/README.md) is a disposable mock, not the application. At 360×740 it compares the **same 1 9/10 point** at both ranges and both root text sizes. Full 0–2 tick spacing was 12.30px normal / 10.30px at 200%; full 0–3 was 8.19px / 6.86px. Sparse 0–3 retained the point and whole benchmarks, but its near-whole tick remained close to the benchmark. Marker and whole-label bounding boxes intersected at 0–3 for both full and sparse variants, and at 0–2 with enlarged text. Bbox intersection does not by itself prove painted text is obscured; sequential benchmark labels did not overlap. The mock's heading was made wrap-safe; the earlier 4px overflow came from the mock heading and is **withdrawn** as a line or product finding.

The witness asserts actual hidden result on initial display, after selection before Check and after wrong Check; correct answer, equal visual/linear explanation, selected and accepted state through resizes, tick/benchmark/marker ratios and wrap-safe heading. Ten synthetic cases passed on an independent rerun, including a 1366px viewport proxy and constrained card. The screen reader/accessibility tree, production renderer, actual browser zoom, physical devices and learners were not tested. A production-faithful follow-up must evaluate marker/label treatment, fallback and capability inputs before wider bounds or publication.

## Verification and process record

- Four local staging scripts ran successfully: Plan 35 `21 live IDs / 15 unique + 15 staged = 30`, Plan 40 `17 + 13 = 30` with two separate holdouts, Plan 50 `4 + 26 = 30`, and Plan 59 `6 + 24 = 30`. Each script performs validator, duplicate, negative and current-membership checks as applicable. Plan 50/59 existing interaction tests passed (14 tests). Packet lint passed.
- Three Luna-medium children worked concurrently with the lead, using three separate external scratch folders: Plan 35, Plan 40 and bridge. The lead owned report files, two additional families, cross-family verification and integration; no child wrote to shared repository files or delegated further. Effective peak was four agents including the lead.
- Both arithmetic investigations initially stopped at the fixture-catalog obstacle. Orchestration had authorized isolated materialization, so the lead redirected them to a disposable copied graph; the lead then built and reran independent compact reproducers against report-local JSON and the current source copy. The Plan 35 worker also corrected guessed historical export names. Isolated record validation is not equivalent to registered production membership.
- The bridge witness initially recorded rather than asserted some required properties. It was revised to assert actual result hiding, geometry and resize behavior, and to separate bounding-box intersection from visual occlusion. The lead reran the corrected report-local witness and inspected a representative screenshot. Earlier stale screenshots were excluded from this wave.
- No full test suite or build was repeated for this report-local-only wave. At the previous staging checkpoint, a full suite had two console lifecycle failures and the isolated console rerun passed; contention was possible but not established. No new shared browser/build runs overlapped here. No physical-device, browser-zoom, assistive-technology or learner testing occurred.

No next wave, live membership change, resolver change, production bridge change, push, deployment, or status closure is authorized by this checkpoint. Existing unrelated Plan 39/40 evidence modifications remain untouched.
