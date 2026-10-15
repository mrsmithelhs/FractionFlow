# Plan 20 implementation progress

Date: 2026-10-15  
Implementer disposition: scoped implementation and evidence complete; returned to FF Orch 12+ for delivery review. Packet status was not changed.

## Delivered

Added the separate one-item `Add fractions with the same denominator` practice goal for the authored `2/7 + 3/7` task. Admission is tied to the registered item and exact original operand forms. The accepted Notice establishes a task-local shared unit; no common-denominator choice or conversion is recorded. Exact operation and resolution accept `5/7` and equivalent unsimplified `10/14`, while the incorrect `5/14` response is recoverable with the learner's entered values retained.

Both visual and linear paths use the shared accessible numerator/denominator response control and one Check action. Local mathematical help is available beside the fields. Replay, reflection, and Next are unavailable for this one-item task; successful completion offers Finish and moves focus to the app landmark. The prior unlike-denominator goal retains its identity and item order. Its first-Tab route remains intact, with the additional goal reachable as the second practice choice.

The implementation also preserves compact equivalent-answer feedback, truthful submitted-form summaries and provenance, draft recovery across rerender/view changes, reset behavior, and supported high/medium profiles. The added entry style hook is shared by both choices while the original compatibility selector remains on the existing goal.

## Approved scope and commits

- `20d190eff230676d9685693ba3ba04f64212966b` — `feat: add like-denominator fraction addition practice`
- `b25e481` — `test: strengthen Plan 20 launch and absence evidence`

The work follows the Requirement 0 mechanism review and its bounded implementation approval in `mechanism-review.md`. The narrowly approved additional paths were `src/interaction/provenance.js`, `tests/entry-page.test.js`, and `src/app/styles.css`, each limited to the specific provenance, entry-cardinality/reachability, and shared-choice styling needs recorded in that review. The final route correction replaces an earlier incorrect absence selector with the actual mounted `#decide-common-denominator-input` and adds direct fragment-launch evidence. It does not change frozen route objects or the runner.

## Verification and evidence

- `npm test`: 35 files passed, 357 tests passed.
- `npm run build`: passed for the learner app and subtraction prototypes (verified during implementation before the delivery commits).
- Full Playwright route matrix using the repository's Chrome browser channel: 59 browser executions passed across 57 route rows. The two Plan 20 rows passed in reduced-motion mode. The frozen preimplementation route prefix and its assertions remain intact; no original unlike-goal route object was rewritten.
- Final evidence capture against the committed build with `node reports/development/plan-20-like-denominator-addition/evidence/capture-plan20-like-denominator-addition.mjs`: 12 workflow states, two narrow entry layouts, and direct fragment launch captured. `node reports/development/plan-20-like-denominator-addition/evidence/verify-plan20-like-denominator-addition.mjs` passed checks for both learner paths, wrong-Notice and `5/14` recovery, accepted `10/14`, help, numeric fields, skipped-control absence, no reflection, and completion.
- `node scripts/dev/plan-status.js lint`: passed.
- `git diff --check`: passed.

Artifacts are in `evidence/`, including the capture and verifier scripts, browser measurements, entry screenshots at 360×740 and 360×752, fragment-entry screenshot, and visual/linear workflow screenshots. The visual path records keyboard correction and completion. The linear path records non-drag tap actions; numeric input remains browser-emulated. Browser evidence demonstrates the tested Chrome Playwright configuration, viewport, and interaction steps. It does not establish behavior on physical Chromebook hardware, with assistive technology, or with learners in classroom use.

## Advisor consultation and limits

The explicitly authorized read-only advisor consultation ran against commits `20d190e` and `b25e481` with requested configuration `gpt-6-sol`, low effort. The advisor reported no actionable findings after inspecting the scoped implementation and evidence. It confirmed that its runtime did not independently expose observed model identity; therefore requested identity is recorded, while observed identity remains unconfirmed. The advisor reported identical before/after `git status --short` observations and made no edits, staging actions, or commits. The status contained concurrent Plan 29 dossier work only; that work was not modified or staged for Plan 20.

No packet status change, push, or deployment was made. Owner rendered-screen/agency acceptance and any deployment decision remain separate gates. The next action is FF Orch 12+ review of these commits and the evidence before the owner decides whether to accept and close Plan 20.
