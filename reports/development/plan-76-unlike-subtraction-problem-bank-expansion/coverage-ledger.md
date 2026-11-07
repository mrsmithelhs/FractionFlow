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

`validation-results.json` records canonical and generated alternate eligibility and the record-validator disposition for each alternate. At their registered targets all eight passed fixture construction, instance validation, representation admission, recipe validation, explicit association resolution, episode completion and replay reconstruction. Four alternates are representation-eligible: construct 15→30 passes record validation but is not registered or exercised as an alternate episode; inspect 15→30 rejects its fixed-target stimulus; both identify 8→16 reject because both sides would require renaming. The other four alternates exceed the representation ceiling. Record-validator acceptance does not override the exact registered target in context resolution: only the eight registered targets are proposed for this batch. Eight specified negative checks passed, including an over-ceiling target and reversed-negative operands.

`audit-results.json` compares normalized ordered operands against 39 resolvable binary fixtures among 93 current practice item entries and all 11 Plan 40 records, including holdouts. It found one same-operand addition item (2/3 + 1/5); the proposed operation is subtraction. Fifty-four entries were unary or lacked a resolvable binary fixture via this route, so this is not an exhaustive whole-catalog proof. Candidate item identities were checked against live items; Plan 40 record, fixture/revision and stimulus identities were checked against its existing records, while catalog initialization also rejects duplicate registered fixture identities. A broader catalog/stimulus audit remains a publication review obligation.

All eight candidates were mounted in the repository's mock DOM in both renderers at operate, with a wrong visual submission followed by a reduced equivalent linear submission. A real Chromium run at 360×740 mounted five representative candidates in a dedicated renderer harness: construct with reducible result, inspect invalid on each side, and identify each required side. The harness advances earlier beats using intents and tests actual operate controls, marked segments, wrong-answer retention and linear resolution; it does not test earlier controls, application view switching, learner-menu launch, screen-reader speech, or a physical device. `browser-results.json` and `browser-inspect-360.png` capture this bounded observation. The initial browser launch lacked the sandboxed Playwright executable; the successful run used the installed local Chrome via `PLAN76_BROWSER`.

`publication-proposal.json` proposes v2, retaining nine exact historical item identities plus eight candidates; it is not registered. The isolated overlay instead registers a separate candidate-only set and passes that explicit identity to the resolver, leaving v1 unchanged. In a later shared implementation, adding historical items to both v1 and v2 makes `findPlan40RecipeAssociationSet` return null for those items. Propagating an explicit set identity where needed, preserving v1 lookup and replay, and deciding any menu/scheduler/local-record consequences are separately owned integration work. Do not activate the proposed manifest until those seams and owner adoption are resolved.

## Reproduce isolated check

From the shared repository root, in one PowerShell session, create a fresh disposable directory `$isolated` outside the shared tree, then run:

```powershell
git archive 42da0062310949ba79d6932e713f353d02ede759 | tar -x -C $isolated
node reports/development/plan-76-unlike-subtraction-problem-bank-expansion/overlay.mjs $isolated
node reports/development/plan-76-unlike-subtraction-problem-bank-expansion/validate.mjs $isolated
node reports/development/plan-76-unlike-subtraction-problem-bank-expansion/audit.mjs $isolated
$env:PLAN76_BROWSER = 'C:\Program Files\Google\Chrome\Application\chrome.exe' # or omit for installed Playwright Chromium
node reports/development/plan-76-unlike-subtraction-problem-bank-expansion/browser.mjs $isolated reports/development/plan-76-unlike-subtraction-problem-bank-expansion
```

Use a clean directory every time. The overlay inserts one data-driven block and test association into the disposable Plan 40 data module; it does not touch shared source. The candidate overlay is not a publication manifest. Browser execution needs Playwright plus a usable Chromium executable; its screenshot is synthetic harness evidence, not a live deployment or learner observation.
