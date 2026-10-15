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

## Repair 01

Date: 2026-10-15. Repair authority: the owner's explicit instruction to complete
the bounded Repair 01 in `delivery-review.md`. Packet preflight still reported
Plan 20 as `delivered` and blocked a new start; the authorized repair proceeded
without changing that status or its review notes.

The operate Help action now records one Plan 20 `request-task-help` instructional
intent at the current schedule entry. Its semantic projection identifies this
as local like-denominator operation help. Replay reconstructs the intent and
support history, and a subsequent response records the request in
`supportActions`. Closing the cue hides the copy without erasing exposure;
reopening it does not duplicate the request or invoke global help escalation.
The entered draft and task position survive open/close. Retry and Return clear
episode assistance and mounted support copy; re-entry starts fresh. The
return-path test exposed that the hidden support notice retained stale help
text, which was cleared along with the help cue.

The refreshed browser capture no longer repairs focus after Finish. The visual
workflow corrects the answer and finishes using page-level keyboard actions
from observed focus. The linear workflow taps its fields before browser-emulated
numeric entry; physical-device typing is not established. Three transient,
independent seeds (stale conversion copy, unlike-denominator recovery copy, and
an accessible answer label) each fail at the named pre-response absence
assertion, followed by a clean scan. The capture checks visible and hidden
mounted text, accessible answer attributes and nonempty form values, while
excluding structural `data-*` metadata. Ordinary scrolling measurements show
question and control reachability for wrong-Notice recovery, operation
recovery, help, accepted response and completion at the recorded narrow
viewports. The verifier requires these measurements and artifacts.

## Repair 01 verification and review

- `npm test`: 35 files and 359 tests passed, including 7 focused Plan 20 tests.
- `npm run build`: learner app and subtraction prototype builds passed.
- Evidence capture: 12 workflow states, both narrow entry layouts, and direct
  fragment launch refreshed from the final build. The Plan 20 evidence verifier
  passed.
- Browser route matrix: 59 executions passed across 57 rows, including both
  Plan 20 reduced-motion routes. The standard `npm run test:routes` attempt
  stopped at local Edge browser startup; rerunning the repository runner with
  its explicit Chrome channel completed the matrix successfully.
- `node scripts/dev/plan-status.js lint`: passed. `git diff --check`: passed.
- Advisor consultation: final read-only review requested `gpt-6-sol`, low
  effort, and found no actionable findings in the 13 repair paths. Runtime
  model identity was not independently exposed; read-only behavior was
  instruction-based and checked afterward through unchanged `git status`.
  The advisor made no edits or commits and did not rerun tests or routes.
- Scoped source/test/evidence commit: `37fd528` (`fix: record Plan 20
  operation help exposure`).

The Plan 20 packet remains `delivered`; no status or orchestrator review-note
change, push, or deployment was made. Technical re-review returns to FF Orch
12+. Owner acceptance of rendered learner screens and agency, physical device
or assistive-technology behavior, classroom readiness, and any deployment
remain outside this repair's evidence and authority.
