# Plan 76 candidate ledger — preliminary, not vetted

The compact inputs in `candidates.json` are converted into the current Plan 40 record shape by `overlay.mjs`; inspect the overlay for the exact expansion. The isolated set is test-only. Differences below are validation evidence, not stored learner answer keys.

| Sources | Recipe / target | Raw difference | Coverage against Plan 40 vetted and holdout bank |
|---|---|---|---|
| 2/3 − 1/5 | construct / 15 | 7/15 | New construct target and 5×/3× factors. |
| 5/6 − 1/10 | construct / 30 | 22/30 | Shared-factor construct with reducible difference; original shared-factor construct uses 24. |
| 3/5 − 1/4 | construct / 20 | 7/20 | Different source forms and 4×/5× factors from target-20 construct. |
| 3/4 − 1/5 | inspect / 20 | 11/20 | Relatively prime, invalid right candidate; original relatively-prime inspect invalidates left. |
| 7/8 − 1/6 | inspect / 24 | 17/24 | Shared factor, invalid left, target 24. |
| 4/5 − 1/3 | inspect / 15 | 7/15 | Relatively prime, invalid left, new inspect target 15. |
| 7/8 − 1/4 | identify / 8 | 5/8 | Right side renamed at target 8; original right-side example uses 6. |
| 3/4 − 1/8 | identify / 8 | 5/8 | Left side renamed by 2 rather than original target-8 example's factor 4. |

`validation-results.json` records all canonical and generated alternate path eligibility. At their registered targets all eight passed curated fixture construction, instance validation, representation admission, recipe validation, explicit association resolution, episode completion and replay reconstruction. Four generated alternates are representation-eligible; this does not establish that each is a supported alternative recipe assignment: the identify recipe requires the other source denominator, and inspect stimuli are fixed to their target. These alternatives have not been independently exercised or rejected through the recipe validator. The eight rejection cases in the JSON passed their specified checks, including a mathematically valid over-ceiling target and reversed-negative operands.

The duplicate check currently compares exact ordered forms only against Plan 40 records and within this batch. A whole-catalog identity and mathematically equivalent-form audit remains open. Mounted visual/linear candidate controls, viewport/browser evidence, equivalent-answer and recovery scenarios, and publication-manifest and replay-membership analysis also remain open. Accordingly this ledger is a preliminary technical checkpoint, not an owner adoption recommendation.

## Reproduce isolated check

From the shared repository root, in one PowerShell session, create a fresh disposable directory `$isolated` outside the shared tree, then run:

```powershell
git archive 42da0062310949ba79d6932e713f353d02ede759 | tar -x -C $isolated
node reports/development/plan-76-unlike-subtraction-problem-bank-expansion/overlay.mjs $isolated
node reports/development/plan-76-unlike-subtraction-problem-bank-expansion/validate.mjs $isolated
```

Use a clean directory every time. The overlay inserts one data-driven block and test association into the disposable Plan 40 data module; it does not touch shared source. The candidate overlay is not a publication manifest. A new set that repeats historical items could make `findPlan40RecipeAssociationSet` ambiguous, since that helper returns a result only for exactly one matching set; no shared runtime solution is authorized here.
