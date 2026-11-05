---
id: plan-63
title: Optional Local Comparison Practice Record
status: in-progress
depends_on: [plan-61, plan-60, plan-62]
gate: "Approve observation/privacy/storage/UI mechanism before source; verify pure record and persistence checkpoint before mounted integration. Owner rendered acceptance and deployment remain separate."
summary: >-
  Implement opt-in browser-local comparison activity across standalone and
  composed-session launches, with bounded normalized observations, inspect/clear/
  stop controls and factual descriptions. Preserve ephemeral unfinished sessions,
  ordinary practice without history and separate later skill-inference/adaptation gates.
---
# Plan 63: Optional Local Comparison Practice Record

## Packet Metadata

- Packet id: `plan-63`
- Packet title: Optional Local Comparison Practice Record
- Status: (see frontmatter)
- Owner/model: one implementer; orchestrator mechanism/checkpoint review; owner rendered acceptance
- Date: 2026-11-03
- Packet type: bounded local continuity implementation
- Mutation level: local record/adapter, app observation boundary and compact record UI
- Approval gate: mechanism, pure persistence checkpoint, technical and rendered acceptance
- Expected artifacts: mechanism.md, record/adapter tests, evidence, progress.md

## Goal, adoption and sequence

The owner adopted Plan61's reviewed recommendations on 2026-11-03. Its design,
synthetic cases, orchestration review and owner acceptance govern. Deliver an
optional practice record that accurately describes observed comparison activity,
without turning it into a mastery model or automatic practice selector.

Cover the existing Plan45/49 comparison responsibility under its current live
definition in standalone practice AND the composed Plan60 session. Capture task
observations without saving a session position or unfinished work for resumption.
Do not exclude session launches silently; stop if the boundary cannot be made sound.

Run after Plan60 closure and Plan62's accepted presentation slice to serialize
shared app/render/CSS and apply the agreed house contract. These are engineering
dependencies, not learner prerequisites. Plan56 support policy is not adopted here.

## References, ownership and exclusions

Read AGENTS.md, implementer-prompt.md, decision-log.md, development board, founding
principles §§19–21, architecture §§27–31 and Roadmap local-progress/adaptation gates.
Read adopted Plan61 dossier/cases/review/acceptance, current Plan60 lifecycle and
Plan62 presentation contract, Plan52 feedback and Plan49 assistance/replay behavior.
Inspect actual comparison transitions, app lifetime/remount, task identity, help,
support and optional construction before selecting an observation boundary.

Own small pure record normalization/projection and local-storage adapter modules,
the exact approved app-level observation/controls and necessary scoped UI/styles,
focused tests/evidence, and approved privacy wording. Name paths at the mechanism
gate. Keep responsibilities distinct without a broad app refactor or universal
event bus. Storage is an edge adapter; renderers do not classify math or infer skill.

No new task/content, mathematics, instructional/support/help policy, session manifest,
adaptive selection, randomization, automatic fading, mastery score, streaks, rewards,
accounts, names, learner profiles, analytics, server, cloud/export/sync, dependency,
resumption, Bootstrap writes, push or deployment. No full intent/replay persistence,
raw submitted text or background network activity. No Phase8 completion claim.

## Requirement 0 — investigate, propose and stop

Run preflight, pin source and refresh accepted dependencies. Persist mechanism.md
with exact observation events and fields, live item/definition/support/cue identity,
assistance timing, lifetime/restart/replay/deduplication, adapter/transaction strategy,
retention, compatibility, clear/stop/failure semantics and precise source ownership.
Propose an implementation cap (30 is the adopted provisional starting proposal,
not an educational threshold) and explain why each field is needed.

Provide literal concise copy and arrangements for enabling, inspecting, clearing,
stopping and unavailable storage. Show first visit, returning/shared-browser case,
valid retry then correction and an unresolved exit. No repeated ownership prompts
during practice; no claim that a browser profile or confirmation identifies a child.
Explain when personal-looking descriptions are suppressed or phrased as this
browser's activity. Preserve easy no-history use and avoid enlarging the entry
page into a dashboard. Stop for mechanism approval before source.

## Requirement 1 — pure record and persistence checkpoint

Implement only the approved pure normalization/projection, bounded record and edge
adapter first. Store allowlisted normalized classifications and minimal identities,
assistance categories, sequence and local deduplication/lifetime data; never raw
answers, arbitrary input, replay envelopes or free-form learner fields. Validate
lengths, types, allowed keys and revisions on reads and writes. Unknown historical
meaning is excluded from summaries; do not silently upgrade old assisted evidence.

Record the first valid relation response and later accepted/unresolved outcome
without requiring success. Invalid/blank, stale and technical failures are not
incorrect mathematical responses. A launch without a valid response records nothing.
Capture model/help/construction assistance before the relevant response; unknown
timing must remain unknown or ineligible, not less-assisted by default. Retrying the
same episode updates its one record; restart creates a fresh episode without double
emission of the retired one. Repeated items are not independent breadth evidence.

Prove explicit opt-in, bounded retention, inspect/stop/clear and truthful write
failure behavior. Specify stopping versus deletion and retained opt-in preference
unambiguously. Clear must defeat stale-tab writers and remove learner observations;
justify any minimal coordination state required without retaining deleted records.
Do not promise atomicity from localStorage read-modify-write. Use a supported,
tested transaction/coordination strategy; when unavailable, disable remembering
gracefully and keep practice usable rather than claim a save or silently lose races.
No dependency or broad multi-browser framework to solve this boundary.

Pure tests must cover Plan61 adversarial cases, malformed/incompatible records,
quota/disabled adapter, deduplication, clear races and failure without data resurrection.
Use synthetic values only. Present the checkpoint and stop for orchestration approval
before mounting UI or wiring real episodes. Pure tests do not prove browser persistence.

## Requirement 2 — task-keyed observation and optional UI

After checkpoint approval, wire observations from successful validated instructional
transitions, keeping exact math authoritative. Cover the same task in both standalone
and composed launches. Sessions must not own the persistence adapter; a task record
must not serialize session ordinal/navigation or allow a reload to resume practice.
Handle retry, eventual acceptance, exit, restart, Next, view/help changes, destroy/
remount and stale callbacks without duplicate or post-clear writes. Avoid abandoning
valid incorrect evidence when the learner leaves before success.

Offer short factual recorded-activity descriptions and a voluntary route back to
comparison. No automatic task assignment or claim of stable strength/weakness.
Prefer individual observations in this first slice; aggregate wording needs an
explicit rule at the gate and must not imply independent reasoning or transfer.
Use stored order only: no claim of days, forgetting, current ability or optimal
review timing. Keep the record interpretable when assistance was used.

Use the house presentation/feedback rules and accessible labels, focus and reading
order. History must never block starting practice or completing a task. Keep controls
near their purpose rather than add explanatory paragraphs to episodes. Inspect/clear
must not expose malformed stored HTML/text. Preserve local history optionality when
storage is disabled, corrupt, cleared externally or private browsing discards data.

Update About/privacy and any directly conflicting public claims to accurately state
optional local records, no accounts/remote learner history and ephemeral unfinished
work. Propose exact canonical consistency edits at the mechanism gate; do not rewrite
founding pedagogy or claim durability. Preserve the distinction between application
learner storage and ordinary technical activity handled by browsers/site hosting.

## Requirement 3 — verification and delivery

Exercise real controls in a persistent browser context: first visit with no opt-in,
enable, valid incorrect then corrected relation, help/model/construction assistance,
unresolved exit, standalone/session comparison, reload and view/stop/clear. Inspect
actual storage to prove bounded normalized data and absence of raw input/session
resume. Use synthetic arbitrary pasted input where applicable to test exclusion.

Run two-tab clear/write and duplicate scenarios against the real chosen adapter,
disabled/unavailable/failure paths, incompatible seeded data and same-app teardown/
remount. The recorder must not make an old callback affect a fresh record generation.
Demonstrate one failing-first ordinary assertion catching an intentionally introduced
duplicate or stale-write defect; restore and pass clean. No generalized seed platform.

Capture narrow360×740 and Chromebook1093×614 record/controls, meaningful enlarged text,
keyboard/linear participation and unobstructed practice. Owner reviews both optional
history experience and no-history use. Browser automation is not learner/AT evidence.
No learner study or efficacy claim is required or authorized.

Focused tests while editing; final suite/build/lint/diff and one isolated historical
matrix for shared integration, with durable source-pinned receipts. Do not repeat
broad runs per copy iteration. This substantial behavioral boundary warrants one
consolidated cold default-role Terra-medium read-only reviewer after it settles;
orchestration does not duplicate that pass. No Sol/Astra, silent substitution or
implementation-child fan-out; record requested/observed capabilities and disposition.

## Checklist and authority

- [ ] Mechanism and pure checkpoint approved before respective source/integration.
- [ ] Optional normalized observations cover standalone and session comparison.
- [ ] Valid retries/unresolved outcomes retained, duplicates and stale writes rejected.
- [ ] Assistance/version/shared-browser uncertainty and ordered descriptions truthful.
- [ ] Clear/stop/failure and no-history practice verified in actual browser storage.
- [ ] No unfinished-session resume, raw input, remote data, inference or adaptation.
- [ ] Public wording and house presentation accurate; owner rendered review pending.
- [ ] Scoped evidence/progress, checks, reviewer disposition and limits recorded.

Reports belong under
`reports/development/plan-63-optional-local-comparison-practice-record/`. Coordinate
source/Git windows; stage explicit owned paths and commit progress.md separately
last. Implementers cannot change status, acceptance or orchestration records.
Stop for scope/contract conflict, unavailable storage guarantees or a load-bearing
owner choice. No push/deployment; rendered acceptance and deployment remain separate.
