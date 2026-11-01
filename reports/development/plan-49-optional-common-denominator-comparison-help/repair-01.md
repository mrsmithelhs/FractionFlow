# Plan 49 Repair 01 — delivery for re-review

Date: 2026-11-01. Scope follows `delivery-review.md`; owner rendered/task acceptance and packet status remain separate.

## Corrections

The helper now uses the shared `createSymbolicFraction` compact stacked notation for source fractions in numerator questions and both sides of each accepted equation. Labels remain associated with their inputs; no parallel slash-form equation or extra explanatory paragraph was added. The narrow screenshot was visually inspected and shows stacked source and accepted fractions. The browser's computed textbox names were checked for both “2 over 3” and “3 over 5.”

The prior pure/projection-only seed claims in `delivery.md` are historical and are superseded by the replacement `tests/plan49-falsification-seeds.test.js` and `evidence/falsification-seeds.json`. A single ordinary verifier inspects the actual mounted visual task, its public episode state and rendered symbolic fractions. It checks withholding/model count, accepted-row presence and target-reset behavior, source and accepted form fidelity, and equivalence using the exact core. Each seed first passes that verifier clean, mutates the mounted DOM that the verifier consumes, records its real assertion failure, removes the mutation, and passes the same verifier again: an unconstructed second form, a displayed 11/15 in place of accepted 10/15, and an old accepted row reinserted after target revision. This is mounted mock-DOM evidence, not a browser-injected defect or a claim that the reducer accepted 11/15.

`evidence/tab-journey.mjs` records a genuine sequential Tab path from the comparison screen through the help disclosure, construction entry, target Check and first renaming Check. It verifies connected focus at transitions and computed input names; `tab-journey.json` records the traversed focus sequence. It uses real browser keyboard events, not direct focus of each target. It is one bounded path, not a screen-reader or physical-keyboard test. The existing current-app keyboard/tap and high-denominator journeys were rerun and their measurements/screenshots refreshed for the typography change. At 360x740, after scrolling, the helper question/input/Check were within the viewport with no horizontal overflow; the wide sample used 1093x614 DPR 1.25. The page still requires vertical scrolling and owner layout judgment.

## Validation

- Focused three-file run: 8 tests passed for mounted seeds, comparison controls and public replay.
- Final `npm test`: 66 files / 584 tests passed.
- Final sequential `npm run build`: learner and prototype builds passed.
- Final clean isolated `node scripts/dev/run-route-matrix.js --browser-channel msedge --quiet`: 116 existing rows / 118 browser executions passed; actual output is `evidence/repair-01-route-matrix-run.log`. Existing historical route output was not overwritten. These existing rows are separate from the new helper browser and Tab journeys.
- Current-app `browser-journeys.mjs`, `boundary-journey.mjs` and `tab-journey.mjs` passed against the local server; screenshots `narrow-second.png`, `chromebook-second.png` and `lcd72.png` were refreshed. Automated text filling in the earlier keyboard/tap journeys remains distinct from the new Tab journey's keyboard typing.
- `node scripts/dev/plan-status.js lint` and staged diff check passed. The three unrelated untracked Plan 39 route-run files remain untouched.

No additional advisor ran, as directed for this bounded repair. Physical-device, assistive-technology, learner-understanding and efficacy evidence remain unavailable. No packet status, push or deployment changes were made.
