---
id: plan-41
title: Phase-Boundary Maintainability and Response Ownership Investigation
status: complete
resolution: "Owner adopted the refined bounded operate-response investigation direction by authorizing strengthened Plan 42 initiation (DECISION-048). Reports and orchestration disposition accepted; predicted maintenance benefits remain to be tested. No wider refactor, framework adoption or deployment authorized."
depends_on: [plan-40]
gate: "Investigation only after Plan 40 closure and owner Phase 3 checkpoint. Owner adoption of findings and a separately approved source packet are required for any refactor or framework experiment. Plan 39 activation waits for the investigation disposition and any adopted prerequisite refactor."
summary: >-
  Investigate response lifecycle ownership, practice admission and representation
  integration at the Phase 3 boundary. Trace representative maintenance changes,
  compare bounded structural options including a fair template/component option,
  and recommend one justified first slice with measurable follow-up-edit criteria.
  No production source changes or framework adoption.
---
# Plan 41: Phase-Boundary Maintainability and Response Ownership Investigation

## Packet Metadata

- Packet id: `plan-41`
- Status: (see frontmatter)
- Owner/model: single investigator, supervised by orchestrator
- Date: 2026-10-20
- Packet type: investigation and design recommendation
- Mutation level: report documents only; optional report-local diagnostic scripts
- Approval gate: adopted investigation scope; owner disposition before source work
- Depends on: `plan-40` closure and explicit owner Phase 3 checkpoint
- Expected artifacts: investigation, bounded source-slice recommendation and progress report

## Goal and reason

Determine whether a bounded structural change would make subsequent agent and
owner edits easier to understand and safer before number-line implementation.
The math → instructional state → presentation separation remains useful. Current
app, episode, scene and visual/linear coordinator files concentrate many duties;
draft/focus/help protocols cross DOM-selector boundaries and response wiring is
repeated across presentations. These are hypotheses to trace, not a blanket
judgment that large files or imperative DOM code are defective.

The owner approved this sequence adjustment: Plan 40 acceptance and Phase 3
checkpoint → Plan 41 investigation → separately approved justified refactor, if
any → Plan 39. Drafting this packet does not start it or close Plan 40.

## Authority and required references

Read `AGENTS.md`, `docs/agent-starting-prompts/implementer-prompt.md`,
`docs/development/README.md`, `docs/decision-log.md` (including DECISION-047),
`docs/development/packet-creation-guidance.md`, and
`reports/orchestration/session-handoff.md`.

Read the founding architecture, interaction grammar and quality/validation docs;
`reports/orchestration/maintainability-architecture-review-disposition.md` and
the Claude/Gemini reviews it synthesizes. Recheck their historical claims against
the post-Plan-40 baseline rather than treating them as current defects.
Read Plan 39 (`plan-39-number-line-locate-and-bar-bridge-batch.md`), the adopted
Plan 37 design/acceptance, and Plan 40's final accepted review/progress. Use
Plan 39's concrete requirements without redeciding its pedagogy or implementing it.

## Scope and protected contracts

Investigate these candidates, then rank them rather than approving all at once:

1. Response-region ownership of drafts, submission, help and focus targets across
   the app and visual/linear renderers.
2. Practice admission/task-context construction versus app shell and navigation.
3. Representation integration: the smallest interface needed to add the adopted
   line/bar bridge without growing another large coordinator branch.

Preserve exact math ownership, immutable instructional state, support selection,
learner agency, visible/accessibility parity, reduced motion, raw submitted forms,
historical replay identities and deterministic reconstruction. Presentation must
not acquire answer evaluation. Static deployment/privacy posture stays unchanged.
Do not unify intentionally different visual and linear explanations merely to
remove duplication. Do not erase historical version boundaries in a registry.

Allowed writes: only under
`reports/development/plan-41-phase-boundary-maintainability-investigation/`.
No `src/`, shared test/harness, package manifest/lock, packet status, architecture
guide, decision record or other acceptance-record edits. Optional diagnostic
scripts must be report-local, read-only toward the application and dependencies,
and leave no tracked generated evidence changes. No installs, environment
workarounds, migration, product prototypes, new learner behavior, push or deploy.

## Work plan and checkpoints

### Requirement 0 — establish the investigation baseline

Run `node scripts/dev/plan-status.js check plan-41` before starting. Stop on a
nonzero result. Record HEAD, working-tree ownership and Plan 40 acceptance record.
Do not disturb another writer. Read required references and write a short scope
note identifying representative traces, output plan and expected cost. Stop for
orchestrator confirmation before deeper investigation. This is a research-scope
gate, not approval to refactor. Escalate missing Phase 3 disposition explicitly.

### Requirement 1 — trace actual editing responsibilities

Use three representative maintenance cases: fraction-response copy/control
revision; help/draft/focus behavior across view switch and reset; and integration
of the adopted Plan 39 task/representation. For the third, mark predicted edits
as predictions. Trace actual call/data ownership with paths/symbols and identify
files that genuinely require edits versus those merely read for context.

Include one compact problem-record-only addition as a control case: distinguish
content scaling already achieved from costs of a new task or representation.
Use exact validators/math; do not spend agent effort re-proving sample arithmetic.
Separate verified defects, maintenance hazards and untested hypotheses. Line
counts, duplicated text, test counts and agent impressions are supporting signals,
not measures of edit difficulty. Separate evidence workflow failures (such as
stale builds or weak assertions) from source-organization causes.

### Requirement 2 — compare options and recommend one first slice

Compare the current design with a focused vanilla ownership extraction and a
template/component alternative. Vue is a legitimate candidate, not a predetermined
winner or rejected option. Compare alternatives on the same representative
response-region seam; do not substitute an easy menu component. Ground any
framework/version/tooling claims in current official sources if researched.
Do not install or build an alternative in this packet. Label predicted benefits
and costs; if evidence cannot distinguish options, recommend a separately gated
controlled pilot rather than inventing performance/token estimates.

Deliver a responsibility map and comparison covering reading locality, duplicated
behavior, explicit lifecycle interfaces, renderer differences, testing/browser
costs, replay risks, owner markup readability and reversible migration steps.
Do not invent a generic plugin system or extract everything by file length.

Recommend one coherent first slice, or explain why no refactor is justified.
Specify concrete module ownership/interface sketches, existing callers, protected
contracts, excluded work, rollback and checks. Rank the other candidates as later
work or unnecessary. Make explicit which proposed work should precede Plan 39
and which should wait for number-line implementation evidence.

### Requirement 3 — define a falsifiable follow-up edit and stop

Specify a small subsequent maintenance revision that would exercise the selected
seam after a refactor, without adding a pedagogical task. Before/after evaluation
must record files/concepts needed, duplicate edits, ownership clarity, owner
readability and actual browser behavior for draft/help/focus/reset. Do not use
fewer lines, an agent's confidence or passing unit tests as the sole criterion.
Account for investigator familiarity and model/context differences; report costs
only if observed and comparable. This packet designs the evaluation, not runs a
source refactor. Preserve frozen replay and learner-behavior oracles in the
recommended future validation plan without freezing incidental markup forever.

## Outputs, validation and reporting

Write `investigation.md`, `recommended-source-slice.md` and `progress.md` under
the report directory; keep overlapping explanation in one place and link it.
Include an evidence → finding → recommendation table, unresolved owner choices,
limitations, and a clear source-approval stop. Reports may conclude that a source
packet or controlled comparison is needed; they cannot authorize it themselves.

- [ ] Requirement 0 scope confirmation and baseline are recorded.
- [ ] Three maintenance traces plus the data-only control are source-backed.
- [ ] Alternatives address the same seam; predictions are labeled.
- [ ] One first slice/no-change recommendation and follow-up-edit criteria exist.
- [ ] Required artifacts exist; reference paths resolve.
- [ ] `node scripts/dev/plan-status.js lint` and `git diff --check` pass.
- [ ] No unrelated/source/dependency/evidence files changed; approval gate honored.

No blanket full browser/test rerun is required for report-only findings. If a
diagnostic executes existing tests, state what it establishes and preserve
generated outputs. Follow the repository consultation declaration contract.
Codex children may be bounded Luna low/medium; Sol advisors must remain read-only
at low/medium. No Astra, implementation-child fan-out or silent substitution.
Use delegation only where it reduces work or supplies useful independent context.

Commit scoped report artifacts with explicit paths; commit progress last. The
implementer may not change packet completion/status or orchestrator/owner records,
or declare the feature ready to ship. Report against editing objectives and stop.
The owner/orchestrator retains adoption, source-packet authorization, Plan 39
sequencing, rendered acceptance and deployment gates.
