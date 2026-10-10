# Plan 30 — Compact Content Authoring Investigation

**Date:** 2026-10-10 (environment date)
**Purpose:** Measure marginal per-item authoring for the accepted relatively-prime proper-addition task, separate from Plan 26's one-time set/Next lifecycle, and compare explicit route records with a deterministic experimental recipe.
**Status boundary:** Investigation only. Candidate records below are synthetic and unregistered. They are not approved instructional content, do not enter the learner set, and do not authorize a source change.

## Findings

Plan 26's navigation, reset, exhaustion/refusal, focus, and set identity are one-time lifecycle work. A subsequent item in the same episode definition does not need its own renderer or episode implementation. It still requires a fixture/content identity, practice-item metadata, complete premise and matching records for each eligible path, compatibility with registered conditions/support, and evidence for the installed learner route.

For the current two-item set, the repeated records are spread across `src/content/data/phase1-golden-cases.js`, `src/app/practice-types.js`, `src/content/data/premise-checks.js`, and `src/content/data/reflection-choices.js`. The premise and matching-choice accessors each maintain a separate fixture-to-authoring-revision map. This duplicates identity knowledge and creates a drift opportunity. The fixture and path records repeat source forms, targets, and presentation forms that exact algorithms can derive. The item ID/revision, selection of which premise is intentionally wrong, task purpose, misconception/distractor intent, choice identity stability, route applicability, and review of the visible options remain authored decisions.

Existing validation is layered; passing one layer does not establish the next:

1. `buildCuratedProblem()` and `validateProblemInstance()` use the existing exact math/content machinery for truth, family membership, path conversions, and provenance.
2. `evaluateInstanceEligibility()` adds the Phase 2 fraction-bar limits: denominator at most 30 and scale factor at most 12.
3. `validateAuthoredTaskData()` compares an explicit expected denominator list to all representation-eligible canonical/authored paths, checks premise truth and matching-choice IDs/form shape, requires exactly one equivalent choice, and requires both `yes` and `no` premise outcomes. It does not reject repeated non-equivalent distractor forms under different IDs.
4. `evaluateTaskPathClosure()` combines path eligibility, authored coverage, and the active condition's reflection availability.
5. App admission (`canonicalInstance()` in `src/app/app.js`) validates the registered item through the earlier layers and checks each registered condition and target path before the item is installed. None of the experiment-only identities is discoverable there.

There is latent closure drift: `validateAuthoredMatchingChoices()` and both renderers require at least three choices, while `evaluateTaskPathClosure()` treats two matching choices with the required basic shape as available. Current app admission first runs authored-task validation, so this investigation does not establish failure of the two already registered items. It does show that closure alone is not a sufficient authored-data admission check. The experiment did not repair this contract.

## Bounded reproducible experiment

Run from the repository root:

```powershell
node reports/development/plan-30-compact-content-authoring-investigation/experiment.mjs --verify
```

The default `--verify` mode is read-only: it recomputes the experiment, requires byte-for-byte equality with the checked-in `results.json`, and prints the counts and corruption-control outcomes without replacing the file. To deliberately regenerate after inspecting a diff, pass `--write-results`. It imports the existing content builder, finite-space enumerator, exact/content validator, representation eligibility, authored premise/choice component checks, composite authored-data validator, registered practice/condition definitions, and path closure. It adds no production validation or arithmetic.

| Bound | Value |
|---|---|
| Selector / overlays | `relatively-prime-addition` / none |
| Generation profile | `curated-review/1` |
| Candidate enumeration | Entire `inspectCandidateSpace().eligibleCandidates` array, in source order |
| Task route requirement | At least two eligible common-unit paths, with one `yes` and one `no` premise outcome |
| Representation limit | Existing Phase 2 denominator 30 / scale factor 12 |
| Learner/student data | None |

### Observed counts

| Measure | Observed |
|---|---:|
| Content-profile candidates enumerated | 220 |
| Existing exact/content validation passed | 220 / 220 |
| Unique ordered problems | 220 |
| Swap-equivalent classes | 110 (110 ordered pairs collapse) |
| Candidate paths considered | 440 |
| Representation-eligible paths | 98 |
| Representation-refused paths | 342 |
| Candidates with zero / one / two eligible paths | 140 / 62 / 18 |
| Candidates with complete two-path experimental authoring | 18 ordered (9 swap-equivalent) |
| Candidates refused by the two-path task requirement | 202 |
| Recipe-generated route records validated with existing premise/choice component checks | 36 / 36 |
| Recipe premise truth checks / matching-choice checks passed | 36 / 36; 36 / 36 |

The 202 item-level refusals are not generator or exact-math failures: all 220 generated candidates passed the existing core checks. The current presentation ceiling leaves too few eligible paths to satisfy this task's two-path/both-premise-outcome contract for 202 candidates. At the path level, 342 of 440 canonical/alternate rows are representation-refused. The runner computes each candidate's exact forms and per-path eligibility/reasons in memory. `results.json` saves aggregate outcomes and three example record sets; it does not persist the full per-candidate ledger.

The script also reconstructed the two **currently registered** Plan 26 items from their registered fixtures. Both passed the same constituent checks used before app installation: `validateProblemInstance()`, `validateAuthoredTaskData()`, and `evaluateTaskPathClosure()` for every target denominator and all four registered conditions: 2 items × 2 paths × 4 conditions = 16 available closures total. This is a current-data gate reconstruction, not a mounted app/browser run. It is separate from the experimental 220-item finite-space sweep.

### Explicit records versus a recipe

The three examples in `results.json` include both an explicit summary (premise IDs/outcomes and three choice records per path) and the compact per-item recipe inputs. For example, `1/2 + 1/3` is enumerated with eligible targets 6 and 12. The compact input records the item/revision, operands, and which denominator gets the intentionally incorrect premise. In this experiment, that route is **selected by a stable hash of item identity**, not independently authored by an educator. Existing `convertToDenominator()` computes the equivalent form. Existing `equalFractions()` computes premise truth. The experiment materializes choice IDs and two in-range non-equivalent options under a fixed recipe version; the correct position derives from item identity and denominator rather than enumeration order. The other sample operands are `1/2 + 1/5` and `1/2 + 2/5`.

The recipe is deliberately a probe, not an instructional recommendation. The per-item `intentionallyIncorrectPremiseDenominator` is a reviewable proposal field, but this experiment generates it from item identity rather than demonstrating an educator's choice. The materializer cannot decide which misconception is useful. The off-by-one premise, nearest-numerator distractors, and hash-selected correct-choice position are unreviewed experimental rules. In particular, a uniform distractor rule could produce pedagogically weak alternatives. Educator review must choose the misconception, distractor rationale, option wording/placement policy, and whether each item belongs in the task before any future implementation.

The compact JSON representation of 18 full-path experiment items is 5,057 bytes for item inputs plus 577 bytes for one recipe description (5,634 bytes total). The paired explicit fixture-and-path summaries are 26,434 bytes. Those summaries include premise IDs/outcomes and choices, but omit full premise source/presented forms and other premise metadata; the recipe description is not its executable implementation. The measured 78.7% reduction therefore compares these abbreviated experimental representations, not equivalent complete production records or total implementation/storage cost. It is not a measurement of author time, review effort, integration cost, or learning value. The comparison also excludes app/registry entries. The component checks demonstrate that repetitive values can be derived; the byte comparison does not establish that a recipe is cheaper to maintain after pedagogical review.

### Negative controls and observed gaps

The script exercised existing validators against corrupt data:

| Defect injected | Existing result |
|---|---|
| Wrong authored premise truth | Rejected with `premise truth mismatch`. |
| Reused matching-choice ID | Rejected with `matching choice identity is invalid`. |
| Two equivalent answer forms under distinct IDs | Rejected with `exactly one equivalent form`. |
| Same non-equivalent distractor form under distinct IDs | Accepted. This is a distinct gap: uniqueness is enforced for IDs and the correct equivalence count, not for displayed distractor forms. |
| Omitted an eligible denominator from `expectedDenominators` | Rejected with `eligible path identity mismatch`. |
| Missing premise record for a listed eligible route | Rejected with `missing premise data`. |

The known closure threshold mismatch is also confirmed by current source contracts, but no custom monkey-patched closure experiment was run: the existing admission pipeline already calls the stricter authored-task check before closure. Do not treat closure's two-choice acceptance as proof that the current app installs two-choice data.

## Authoring cost by category

| One-time Plan 26 work | Repeated per-item work for this task |
|---|---|
| Set/Next transaction, completion gate, exhaustion/refusal, reset, focus, return/re-entry, and preserved settings | Stable fixture identity/revision and one ordered practice-item record |
| Lifecycle/UI behavior and tests independent of the operand pair | Operand forms and current task configuration |
| Shared admission path wired into app startup/Next | A per-item instructional choice about premise outcomes/misconception and reflection purpose |
| Shared replay envelope/episode definition | Complete path availability and a stable versioned choice identity for each admitted route |
| Shared renderers and help/response machinery | Human review of distractor meaning, plausible alternatives, wording/order, and representational suitability |

Exact arithmetic, path conversions, operation truth, equivalence truth, denominator eligibility, and stable mechanical keys can be derived. Instructional intent and learner-facing suitability still need review. A compact recipe reduces repeated wire data; it does not remove the work of deciding whether the item teaches the intended idea or closes every path.

## Smallest adoption increment to consider

After technical review and owner acceptance, the narrowest useful source follow-up is a separate packet for **one additional** same-definition proper-addition item (for example the experimental `1/2 + 1/5` candidate), using a versioned compact item record and one deterministic materializer for already reviewed route data. Keep the existing two authored items immutable. Do not adopt the entire 18-item batch, add a generic schema/recipe framework, or activate generated/random learner selection.

The follow-up should centralize or mechanically reconcile the two duplicated fixture-to-authoring-revision checks only if its selected storage model makes that the smallest way to prevent premise/choice identity drift. It should preserve separate explicit semantic inputs and derived outputs: the author supplies the reviewed misconception/premise route and distractor policy; the exact core derives truth/forms. Recipe version, fixture ID, item ID, route, and choice IDs must remain stable for a content revision. Persisted semantic inputs or a changed deterministic policy/order must not silently change content under an existing identity; any change in materialized instructional data creates a new authoring identity/revision. Old fixture rows and replay meaning remain intact. No episode-definition/replay-envelope migration follows from this experiment.

That packet would need all-item/all-eligible-path headless closure across every registered condition and support level, including correct completion, wrong-response recovery, optional help, reflection completion, final resolve, reset, and replay identity. Add discriminating browser samples for the tightest denominator/scale/choice geometry, one alternative route, premise `yes` and `no`, matching reflection, help, standard and reduced motion, visual and linear access, keyboard and touch-context operation, refusal, retry, and re-entry. This is proposed coverage; Plan 30 did not execute whole-episode candidates or browser journeys for the 18 proposals.

## Executed versus proposed coverage

**Executed here:** full finite candidate enumeration; exact/content validation for every candidate; both path rows and eligibility reasons for every candidate; premise and matching component validation for all 36 recipe-generated routes of the 18 two-path proposals; negative controls; current registered-item authored validation and condition-specific path closure.

**Not executed here:** episode completion for any experimental candidate; all-item/path closure for unregistered identities; mounted app admission/Next with new data; browser rendering, geometry, help, motion, access, focus, reset or re-entry for a candidate; assistive technology or physical device behavior; pedagogical/distractor review; learner readiness. Math validity and component authored-data checks do not establish these properties.

No production source/tests/schema/registry/task-data changes were made. Plan 30 remains at its owner/orchestrator acceptance gate.
