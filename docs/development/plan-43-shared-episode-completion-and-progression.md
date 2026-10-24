---
id: plan-43
title: Shared Episode Completion and Direct Progression
status: delivered
depends_on: [plan-20, plan-35, plan-38, plan-40, plan-42]
gate: "Requirement 0: approve the shared completion/advance transaction, final-item behavior, focus, compatibility/versioning and evidence mechanism before source. Preserve substantive reflection. Technical verification and owner rendered-page/agency acceptance precede closure; deployment remains separate."
summary: >-
  Replace navigation-only Finish acknowledgments with direct learner-triggered
  Next problem after the last meaningful task, retaining inspectable results,
  genuine reflection, truthful final-item behavior, fresh-item state and
  historical replay. Establish one shared progression contract before the
  number-line layout repair, without adding content or new result explanations.
---
# Plan 43: Shared Episode Completion and Direct Progression

## Packet Metadata

- Packet id: `plan-43`
- Packet title: Shared Episode Completion and Direct Progression
- Status: (see frontmatter)
- Owner/model: one supervised implementation writer; recommended Luna medium
- Date: 2026-10-23
- Packet type: shared behavioral repair
- Mutation level: source, focused tests/harness, compatibility fixtures and local evidence
- Approval gate: Requirement 0 mechanism, technical review, owner rendered/agency acceptance
- Expected artifacts: mechanism proposal, shared progression behavior, compatibility evidence, branch-to-witness map and progress report

## Goal, evidence and sequence

After the learner completes the last meaningful task, keep the accepted result
visible and offer an action that actually moves to the next problem or returns
from the finished set. Remove the extra acknowledgment that only changes a
completion message and reveals another navigation button. Preserve substantive
reflection/premise questions and their required learner responses.

Owner adopted this behavior on 2026-10-23 (DECISION-050). The source audit at
591c84e traced current registrations, both renderer paths and state handlers:

| Live family | Affected records | Existing completion seam |
|---|---:|---|
| Addition construct, inspect/keep/repair and identify-side recipes | 13 | `finish-compact-episode` |
| Same-denominator addition | 1 | Finish dispatches `submit-resolution` |
| Same-denominator takeaway subtraction | 8 | `finish-compact-episode` |
| Unlike-denominator subtraction recipes | 9 | `finish-compact-episode` |
| Number-line placement revision 2 | 8 | `finish-compact-episode` |
| Older addition with meaningful reflection/premise check | 8 protected | Resolution leads to reflection, not immediately to another item |

The 39 affected records already show their accepted mathematical outcome before
Finish. Completion currently mostly replaces text and unlocks app navigation.
The older reflection paths also select a misleading Next Problem label for an
action that opens reflection. This audit is source-level evidence, not a claim
that every path has been replayed in a browser. Reconfirm the classification.

Dependencies provide accepted existing task/ownership contracts. Plan 39's technical
baseline includes Repair 03 and the separate tile-containment correction; it is
delivered pending further owner review. Do not depend on Plan 39 closure: its
Repair 04 must consume this packet, and requiring closure would create a sequence
deadlock. Freeze the current baseline at dispatch and serialize source ownership:
**Plan 43 → owner/orchestrator acceptance → Plan 39 Repair 04.** No concurrent editing
of the overlapping app, render, interaction or route files.

## Authority and reading

Read `AGENTS.md`, the implementer starting prompt, `docs/decision-log.md`
(DECISION-041/042/044/045/049/050), the development board, packet guidance, founding
interaction/architecture/quality contracts and this packet. Then inspect:

- `src/app/practice-types.js` and `src/app/app.js` — live identities, advance/reset, navigation and focus.
- `src/interaction/episode.js`, `episode-definition.js`, `scene.js`, `replay.js` and existing schedule/compatibility helpers.
- `src/render/beat-container.js`, `linear-path.js`, `number-line-locate.js`, `strings.js` and applicable response handles.
- Current route/context contracts in `tests/routes/`, the replay oracles and relevant app/recipe tests.
- Plan 39 `repair-03-orchestration-review.md`, `token-containment-review.md` and `repair-04-brief.md` under its report directory.

Preserve exact math → instructional state → presentation, deterministic
validation, assistance/provenance distinctions, access/reviewer settings,
privacy, static deployment, content identities and historical behavior. Use
existing deterministic helpers to solve/check test problems; do not ask an agent
to rederive routine arithmetic record by record.

## Scope

In scope: current completion transitions, truthful control labels, local primary
continuation, final-item return/exhaustion, focus and stale-action guards; the
minimal scene/definition/replay/set revision work justified at the gate; affected
shared renderer wiring and discriminating tests/evidence.

Out of scope: Plan 39's yellow tray, green header, hover and graphic-spacing work;
new explanations, summaries, rewards, content, tasks, adaptation or randomization;
removing reflection; math changes; framework/dependency changes; general app
rearchitecture; persistence, telemetry, remote writes or deployment. Do not alter
old accepted packets' statuses or rewrite their acceptance records.

## Requirement 0 — investigate, propose, stop

Run packet preflight before starting. Record current HEAD, clean/shared-tree
ownership, live family counts and the before/after meaning of each ending.
Write `reports/development/plan-43-shared-episode-completion-and-progression/mechanism-proposal.md`
and stop before source, test-harness or fixture mutation. The proposal must name:

1. The authoritative completion condition, the recorded intent/state boundary,
   and the transaction for Next and final-item return. Decide whether acceptance
   or explicit continuation records completion; make this coherent across current
   families without attributing a new mathematical response to the learner.
2. Which layer owns eligibility, item preparation, completion and focus. Use one
   shared behavior contract rather than another fixture-id/definition-id decision
   list in every renderer. A shared contract does not require a new universal
   lesson engine or identical DOM across views.
3. Definition, set and replay revision policy, with exact compatibility boundaries.
   Inspect the existing latest versions; do not guess the next number. A label
   change alone and a changed intent/schedule contract are different cases.
4. Current versus historical route contexts, protected recordings and meaningful
   negative controls. Explain the final-item UI, including the one-item addition
   set, and how a failed next-item preparation preserves the accepted result.

Orchestrator mechanism approval is required before implementation. Owner questions
are relayed through orchestration if a load-bearing choice remains unresolved.

## Requirement 1 — completion and useful progression

- Once the last required mathematical/reflection response is accepted, retain
  the useful result and expose **Next problem** in the local action area below
  it. One activation starts the next vetted item; it does not reveal a second
  Next/Finish action. Avoid duplicate visible Next controls in local/header areas.
- Keep the accepted result inspectable until an explicit action; no timer,
  automatic item advance, empty Finish acknowledgment or new text to justify one.
- Do not unlock Next before every required task is satisfied. Preserve reflection
  and premise questions in all applicable conditions/supports. An action leading
  to another task says **Continue**, not Next problem.
- On the last item, including a single-item set, show the existing concise
  exhaustion/completion meaning and a local **Back to start** action. Return to
  the existing entry choices. No silent wrap, nonexistent Next, extra Finish set
  acknowledgment or newly invented summary page.
- Keep result mathematics, equivalent forms, representations and instructional
  help intact. A changed status label alone is not an additional learning outcome.

## Requirement 2 — state, navigation and access

- Advance exactly one identity and install fresh state: no old answers, drafts,
  pending location, help, recovery, replay/animation or inspection work. Preserve
  selected access view and reviewer settings under the existing applicability rules.
- Prevent stale controls/double activation from skipping an item. Prepare and
  validate the destination before discarding accepted work. If preparation fails,
  retain the inspectable result, coherent completion/history and existing refusal
  treatment; retries must not duplicate completion or advance unexpectedly.
- Keep normal mid-task Return and Retry semantics. End-of-set return/re-entry
  starts the stable first registered item. No persistence or new progress tracking.
- Keyboard, mouse and browser touch can use the continuation. Focus reaches the
  accepted result/action deliberately; after Next it reaches the new task, not
  a detached old button or a leftover header control. Preserve meaningful
  announcements, reduced motion and the non-drag number-line alternatives.
- Do not dispatch a hidden legacy Finish from render, effects or a timer to
  unlock navigation. An approved explicit continuation transaction may record
  completion internally; document and test its intent/history meaning.

## Requirement 3 — compatibility and historical evidence

Preserve reconstruction of existing envelopes and registered historical
definitions, including Plan 39 revision1/v7 and revision2/v8 and preceding recipe
contracts. Do not change old schedules/expected states or update frozen expected
outputs to make new behavior appear compatible. Pin historical routes to real
historical entry/definition contexts when current controls change; preserve their
action objects, mappings and artifacts. Append/version current witnesses under
the approved mechanism, without keeping hidden Finish elements for old selectors.

Revision pin updates may be necessary, but authored mathematical problem records
must not gain bespoke navigation code. Report any compatibility conflict rather
than making a silent migration or broadening into a registry refactor.

## Requirement 4 — objective-based validation

Separate whole-bank deterministic coverage from deep browser witnesses:

- Sweep all current registered records with existing deterministic journey helpers.
  Prove the required final task, acceptance/continuation boundary, fresh next state
  and last-item behavior. Verify meaningful reflection is still required on the
  eight protected records. Explain actual versus unavailable condition coverage.
- Deep browser paths cover each addition recipe, same-denominator addition,
  same-denominator subtraction, each unlike-subtraction recipe, number-line
  placement, and matching/premise reflection. Distribute visual/linear, keyboard,
  mouse/touch-context and reduced-motion coverage across those branches; do not
  create an exhaustive viewport × item × input cross-product.
- Assert accepted information before continuation; one real Next activation
  installs the next identity, fresh response controls and correct focus. Cover
  incorrect response, premature advance, double/stale activation, preparation
  refusal, one-item exhaustion, multi-item exhaustion and return/re-entry.
- Save discriminating accepted/after-advance screenshots for the goal families.
  Include 360x740, 360x752, 1366x768 and actual 1093x614 at DPR1.25 in the deep
  sample. Preserve readable fractions and existing motion/drag/containment checks.
- Demonstrate that ordinary assertions reject a seeded two-click/no-op Next and
  premature continuation before a required reflection. Keep clean and seeded
  receipts separate; a seed process exiting nonzero is not sufficient evidence.
- Finish with relevant unit/integration tests, sequential learner/prototype build,
  the final clean full route matrix, compatibility checks, packet lint and diff
  check. Do not repeat full suites on every draft without a new reason. Isolate
  new evidence and restore regenerated historical outputs before committing.

Provide a family/branch-to-witness map and separate verified behavior from source
inference, browser emulation and untested physical-device/assistive-technology
behavior. Passing counts alone do not establish the learner-facing objective.

## Execution, review and stop conditions

Recommended implementation: one cold default-role Luna-medium writer, no
implementation-child fan-out. Codex advisors are Sol-class read-only at low or
medium effort; target one consolidated LOW review, second only for a substantial
remaining issue. No Astra or silent model substitution. Follow repository advisor
capability/disposition requirements; report a limitation if allowed settings cannot
be honored. Routine follow-up verification stays with the orchestrator.

A separately dispatched independent implementer chat may be a browser-walkthrough
pilot candidate only with explicit owner authorization. This packet does not
create that chat or grant implementation-child fan-out. If walkthrough delegation
is authorized, use bounded Luna screenshot-only observations under the current
workflow/pilot log, retain capability failures and verify owned-session cleanup.
Such observations supplement tests and owner judgment; they are not learner data.

Stop on a failed preflight, overlapping writer, unapproved mechanism, missing
historical reconstruction, scope-changing failure or unresolved owner decision.
Never weaken the harness, redefine mathematical/pedagogical contracts, set packet
status/completion, edit owner/orchestrator acceptance, or declare ready to ship.
Never push or deploy. Commit explicit scoped paths; write/commit progress last.

## Validation checklist and report

- [ ] Mechanism approved before source; required artifacts and compatibility evidence exist.
- [ ] Each affected family has direct useful progression, protected reflection remains substantive.
- [ ] One-click next, freshness, focus, refusal and final-item behavior verified.
- [ ] Frozen historical meaning/evidence retained; current witnesses distinguish clean and seeded runs.
- [ ] Relevant tests/build/final matrix, packet lint and diff check pass; no unrelated edits.
- [ ] Progress report exists with objective evidence, branch map, commands, advisor disposition and limits.
- [ ] Technical review and owner rendered/agency gates honored; no status, remote or deployment writes by implementer.

Write `reports/development/plan-43-shared-episode-completion-and-progression/progress.md`.
Orchestrator verifies artifacts and sets status. Owner accepts rendered behavior.
Only then may Plan 39 Repair 04 consume the shared progression without redesigning it.
Acceptance here covers progression and labels; it does not close Plan 39 or accept
its remaining visual defects. Those remain explicitly assigned to Repair 04.
