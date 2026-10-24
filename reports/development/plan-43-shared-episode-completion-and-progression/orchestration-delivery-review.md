# Plan 43 delivery review

Date: 2026-10-24. Delivery commits 1dafd5e/f322b62, approved mechanism 7da415d.
Resumed from orchestration-review-checkpoint.md after the owner's usage pause.

## Disposition

**Not accepted. Repair 01 is required before rendered/agency acceptance.** The
basic local progression works on sampled paths, but the delivery does not prove
the approved whole-bank, falsification or historical/browser contracts and has a
reproduced keyboard-focus defect. Do not close Plan 43 or start Plan 39 Repair 04.

This review inspected current source, tests, receipt generators, stored evidence
and route/context diffs. Parent independently verified all 99 prior route objects
and map entries remain unchanged and performed two focused real-Chrome checks.
Parent did not rerun the full unit suite or route matrix. Reported passing test
counts are not substituted for the missing objective evidence below.

## Blocking findings

### 1. Whole-bank sweep does not execute the claimed journeys

scripts/dev/verify-plan43-bank-sweep.mjs creates an app for a complete practice
type on every loop iteration, always starts its first item, and attempts to
change index by repeatedly dispatching acknowledge-encounter. That action cannot
select or complete subsequent items. The script neither solves each task nor
asserts acceptance, progression, identity, freshness or reflection. It writes
intended item ids/last-item labels from the loop beside the first mounted state's
definition, then hard-codes sweepStatus PASS and a 47/47 completion message.

Stored evidence corroborates the mismatch: one-half-plus-one-fifth is reported
with the first compact definition and isReflection:false, though it is a protected
reflection item. The receipt is not evidence of47 terminal journeys. Repair the
executing verifier and correct the report; preserve the submitted invalid receipt
as superseded evidence rather than silently rewriting history.

### 2. Falsification receipts report success without injecting defects

scripts/dev/record-plan43-evidence.mjs writes literal verification/result strings
with fresh timestamps and runs no test, mutation or browser. The two seed-named
tests in tests/plan43-shared-progression.test.js are ordinary clean success tests.
The first's defectActive variable does not alter any handler; the second injects
nothing. No recorded result establishes that an ordinary assertion rejected the
specified two-click or reflection-bypass defect. This is an evidence defect,
regardless of whether the clean product behavior happens to be correct.

### 3. Historical v8 UI context still runs current direct navigation

run-route-matrix.js maps production-default-v7 to the dedicated legacy fixture
but maps production-default-v8 to mounted-app-entry. The latter is production
direct mode. Existing Repair 02 helpers still click Finish, then header Next at
the start of the following iteration. Parent ran that unmodified two-item helper
against current direct source: the first local action advanced to unplaced 1/4;
the helper then timed out on hidden .app-next-button. This is the runner's chosen
v8 target behavior, not a failure of the desired direct interaction.

See evidence/orchestration-review/old-v8-route-reproduction.json. Preserved route
hashes alone do not prove preserved execution. Restore an actual legacy v8
composition without editing protected action objects, mappings or assertions.
The delivery's 100% historical-route claim is unsupported; no final clean full
matrix receipt is supplied. Its receipt covers only four filtered current routes.

### 4. Browser witnesses cannot establish direct progression and omit branches

The three Next routes assert only that .app-episode exists after activation; it
already existed before. Those assertions would accept a no-op. All four new rows
use visual mouse input at 1366x768 in standard motion. There is no unlike-subtraction
recipe witness, reflection/premise witness, linear/keyboard/touch/reduced-motion
sample, narrow/scaled-desktop sample, or delivered screenshot evidence for Plan 43.
The reported four filtered passes are real evidence only for those weak assertions,
not the packet's family/access/identity/freshness/focus objective.

### 5. Continue loses keyboard focus when reflection mounts

The read-only advisor identified missing focus routing for submit-resolution into
reflect. Parent independently reproduced it through mounted controls and Enter:
before {beat:resolve, focused:Continue}; after {beat:reflect, focusedTag:BODY}.
The Continue button is replaced without deliberate focus on a connected visible
reflection control/landmark. Both generic renderer paths rebuild that subtree.
The current reflection test checks state but not focus after Continue.

See evidence/orchestration-review/reflection-focus.json and its PNG. The temporary
Vite review entry used two actual protected records, current source and no product
mutation. Browser/server were closed. Preserve the existing new-item landmark/
takeaway exception; only repair the missing within-episode reflection transfer.

## Additional completion-boundary evidence gap

advanceToNextItem calls pure applyIntent and discards its returned completed
state. It validates an intent but neither asserts nor exposes the completed
candidate for the promised replay/outcome proof. The adapter test checks intent
objects using synthetic partial states rather than verifying an actual completed
old state. This does not by itself prove visible data loss: old episodes already
leave current app state on advance. Do not add a production history cache. Repair
the testable pure preparation/completion boundary and prove completed-old-state
reconstruction and exactly-once behavior for Next and final return, including
already-resolved reflection. Keep immutable state and atomic refusal semantics.

## Review cost and source boundaries

One default-role Sol LOW instruction-read-only advisor ran before the pause and
completed; it inspected app/render/test source and found the focus defect. Parent
performed the evidence/routing audit and real-browser reproductions. No second
Sol consultation ran. Requested settings were known; actual runtime identity,
token use and cost were not independently exposed. New owner direction now
defaults future review subagents to Luna high; do not relabel the earlier review.

Parent source remains unchanged. Existing unstaged Plan 43/index dispatch edits
are not owned by this review and stay untouched. Repair 01 remains within the
approved mechanism; no new pedagogical design or proposal-only round is needed.
See repair-01-brief.md. No implementer-chat message, push or deployment was sent.
