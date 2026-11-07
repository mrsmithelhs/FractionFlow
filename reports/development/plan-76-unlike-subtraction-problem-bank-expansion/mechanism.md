# Plan 76 Requirement 0: proposed mechanism

Status: proposal for orchestration approval; no candidates have been authored or admitted. Baseline: `42da0062310949ba79d6932e713f353d02ede759` on `main`; `node scripts/dev/plan-status.js check 76` returned RUNNABLE and `node scripts/dev/plan-status.js lint` passed. Three unrelated untracked Plan 39 route-run JSON files existed at preflight and are outside this scope. This is a source baseline, not a claim that the full test suite or browser was run.

## Proposed coverage grid

Author eight distinct records after approval, using the existing compact Plan 40 input shape. These are coverage slots, not chosen operands or validated records. Each must show its concrete gain over both the nine vetted records and two holdouts in `src/content/data/plan40-reusable-subtraction-recipes-records.js`.

| Slot | Recipe | Relationship | Intended variation and comparison to existing bank |
|---|---|---|---|
| 1 | construct | relatively prime | A different admissible scale-factor pair and operand forms from the current target-10/20 construct items and target-10 holdout. |
| 2 | construct | shared factor | Different factor pair and reducible raw difference from the current target-24 construct item. |
| 3 | construct | relatively prime or shared factor | Different positive difference form, preferably an eligible authored alternate target if both renamings remain required. |
| 4 | inspect/keep/repair | relatively prime | Invalid right stimulus; current relatively-prime vetted example has invalid left. |
| 5 | inspect/keep/repair | shared factor | Invalid left stimulus and a different target or multiplier from existing shared-factor examples. |
| 6 | inspect/keep/repair | either two-side relationship | Valid and invalid stimulus forms and a raw difference distinct from existing inspect items and holdout; vary reducibility. |
| 7 | identify-side | nested | Right operand renamed, a distinct source/target pair from the single current right-side example. |
| 8 | identify-side | nested | Left operand renamed, a distinct factor or raw difference from the current left-side examples. |

Slots are targets for selection, not promises of admission. If no candidate for a slot passes the existing machinery, replace it with another distinct admissible slot within six to nine and explain the substitution; do not change product logic to force admission. Candidate selection is not evidence of learning benefit.

## Bounds and duplicates

Use `curated-review@1` source denominators from `{2,3,4,5,6,7,8,10,12}`, nonzero proper source forms, positive proper difference, and selector-consistent relationships. Preserve the profile's admission and overlay rules; reducible results require the correct `reducible-result` overlay. A target must be a mathematically valid common denominator, a canonical or authored alternate path of the instance, at most 30, with each scale factor at most 12. Identify targets equal the untouched operand denominator and rename exactly one side; construct and inspect rename both. Inspect has exactly one equivalent and one inequivalent candidate, each at the target and within its numerator bounds. These are intersecting conditions, not a guarantee that any arbitrary selection is admissible.

Reject duplicate item, fixture/revision, and stimulus/revision identities across the entire existing catalog and proposed batch. Reject exact ordered source-form pairs even with a different recipe, target or stimulus, including Plan 40 holdouts. Also flag mathematically equivalent ordered operand pairs in different notation for review and exclude them from this batch; subtraction order is significant. Compare actual catalog and records at the pinned baseline and repeat against the integration baseline before any later publication.

## Reproducible validation after approval

1. Create report-local compact data and a deterministic validation entry point. In a disposable checkout pinned to the baseline, apply an exact, recorded overlay registering the candidate fixtures, records and a separate test association set through the existing Plan 40 registry seams; record overlay diff/hash, checkout SHA, commands, and outputs in the Plan 76 evidence directory. Do not modify the shared checkout's registries, routes, or historical evidence. If the isolation cannot be made, stop short of claiming registered or mounted validation.
2. For every candidate, build the curated instance as in `tests/content-plan40-subtraction-recipes.test.js`; run `validateProblemInstance`, exact math and `evaluateProposedPathEligibility` for canonical and every authored alternate path, then `validatePlan40SubtractionRecipeRecord` and registered context resolution. Derive differences and equivalence from math, never learner-record answer keys. Enumerate applicable paths, distinguishing ineligible/outside-coverage paths from admitted recipe paths; exercise each admitted path and authored inspect alternative through the existing episode and replay machinery.
3. Include falsification checks that must fail if an invalid record is accepted: non-common or over-ceiling target, reversed unequal operands/negative result, wrong required side or unsupported recipe, mismatched fixture, and inspect stimuli with zero or two correct alternatives. Test the intended error at the appropriate admission layer, not merely any thrown error. Check uniqueness against existing records and within the batch. Persist per-record coverage, expected rejection, observed result, and exact derived arithmetic in a ledger.
4. In the isolated checkout use existing mounted controls and a bounded browser harness to traverse discriminating construct, inspect (both invalid sides), identify (both required sides), and reducible-result examples in visual and linear views, including transition to takeaway, wrong-answer recovery and equivalent answer; capture route/viewport, assertions and evidence only under Plan 76. If a browser path cannot be exercised, state the precise gap. Run relevant `content-plan40`, `interaction-plan40`, `render-plan40`, `app-plan40`, and `replay-plan40-v6-compatibility` tests, packet lint and scoped diff checks; document exact commands and outcomes.

The validator resolves fixtures from the catalog and the context resolver requires registered record/set membership, so merely importing detached data cannot prove end-to-end acceptance. The disposable overlay must register all three rather than bypass these checks. Demonstrate one data-driven overlay for the batch, with no per-item runtime branches. Keep the overlay itself and its reproducible application instructions reviewable; it is not a shared integration change.

## Identity, replay and publication

Existing `unlike-subtraction-vetted-set@1`, its order, record identities and `plan40-data-only-holdouts@1` stay immutable. Propose a new set revision and explicit ordered manifest mapping historical identities unchanged plus new versioned identities. Verify v6 export/import and continuation with the isolated association; preserve existing v1–v5 and v6 compatibility tests. Registration and replay resolve exact set/revision/item associations, so preserving old associations and replay lookup is a real integration seam, not automatic proof of compatibility. Check for ambiguous membership in `findPlan40RecipeAssociationSet` when proposing the new revision and record how callers choose an explicit identity. Menu, scheduler, featured rotation and local record coverage are separately owned. Owner batch adoption, integration and live publication are separate gates; this proposal authorizes none of them.

Advisor disposition: consultation not warranted for this prose-only Requirement 0 proposal; no advisor ran. Any later behavioral delivery is subject to orchestration's authorization and applicable review requirements.
