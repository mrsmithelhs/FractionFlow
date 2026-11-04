---
id: plan-62
title: House Episode Presentation Contract and Comparison Alignment
status: draft
depends_on: [plan-52, plan-60]
gate: "Approve representative surface inventory, flexible presentation contract and exact first-slice changes before source. Serialize shared edits after Plan60 repair/closure; owner rendered acceptance and deployment remain separate."
superseded_by: null
resolution: null
summary: >-
  Define reusable presentation rules with explicit response-layout variants,
  then harmonize ordinary comparison and comparison-then-distance without
  changing their instructional responsibilities. Preserve the accepted feedback
  contract and record other deviations as bounded follow-ups, not a global restyle.
---
# Plan 62: House Episode Presentation Contract and Comparison Alignment

## Packet Metadata

- Packet id: `plan-62`
- Packet title: House Episode Presentation Contract and Comparison Alignment
- Status: (see frontmatter)
- Owner/model: one implementer; orchestrator mechanism review; owner rendered acceptance
- Date: 2026-11-03
- Packet type: bounded presentation contract and first implementation slice
- Mutation level: approved presentation documentation, renderer markup and scoped CSS
- Approval gate: inventory/contract/source scope before implementation; rendered acceptance
- Expected artifacts: surface-proposal.md, presentation-contract.md, evidence, progress.md

## Goal and evidence

Make the location and visual meaning of instructions, mathematical expressions,
feedback, working areas, help, responses and progression predictable across episodes.
Keep explicit variants for relation choices, numeric construction and direct
placement; do not require identical screens for different mathematical tasks.

The owner's Plan60 review and bounded Terra source audit found ordinary comparison
and comparison-then-distance differ in outer alignment, response grouping, Help/Check
order and the unanswered expression's missing question-mark separator. They reuse
standalone renderers, so these are shared presentation differences rather than a
session-controller defect. Intentional instructional differences must remain.
The audit is a bounded sample, not proof that all episode types have been inspected.

Plan52 already governs feedback semantics and styling. Extend it with arrangement
rules, not a competing feedback vocabulary or a UI framework migration. The session
entry button's stretch is assigned to Plan60 Repair02 and excluded here.

## References, sequencing and ownership

Read AGENTS.md, implementer-prompt.md, decision-log.md, development board, founding
instruction/grammar/accessibility/architecture contracts, Plan43 progression and
Plan52 packet, surface approval and owner acceptance. Read
`reports/orchestration/house-presentation-audit-and-scope.md`, Plan60 mechanism,
current repair/review/acceptance and actual source; refresh baseline before starting.

Depends on accepted feedback and Plan60 closure to serialize shared CSS/app/render
work. This is engineering ordering, not a learner prerequisite. No concurrent shared
presentation writer. Plan61's report-only history work is separate and unadopted.

Own reports under
`reports/development/plan-62-house-episode-presentation-contract/`; after mechanism
approval, the exact named renderer/CSS surfaces and one compact maintained contract
at `docs/design/episode-presentation-contract.md` (confirm location at gate). Keep a
proposal copy in the report before writing canonical design documentation. Describe
implemented/adopted rules separately from deferred variants and exceptions.

Expected first source slice: `src/render/plan45-comparison.js`,
`src/render/plan51-distance.js`, their exact style rules in `src/app/styles.css`,
and focused tests/browser witnesses. A small shared presentation helper is allowed
only if the proposal identifies real duplication and ownership. Do not create a
universal renderer or general component registry. Do not edit session navigation,
entry, manifest, content/math/reducers, support/help policy, replay or storage.

## Requirement 0 — inventory, propose and stop

Run preflight; pin source HEAD. Inspect representative reachable states of the two
comparison renderers, one numeric/conversion task and one placement task. Include
initial response, optional help open, retry, success and next responsibility where
they exist; use a compact surface matrix, not every item or historical screenshot.
Cover visual and linear participation, noting different cues without redesigning
them. Trace markup, computed style and focus ownership for load-bearing claims.

Submit `surface-proposal.md` and proposed `presentation-contract.md`: exact shared
rules, task-specific variants, intentional exceptions, before/after arrangements,
source ownership and verification plan. State what the learner actually does in
each state and which elements are active. Stop for orchestration approval before
source. Relay load-bearing pedagogical choices to the owner; do not change a task
to make its layout fit. No new educational research/advisor pass at this paper gate.

## Requirement 1 — compact flexible contract

Specify stable visual hierarchy, spacing/width tokens and typography, then explicit
layout variants. A region need not become a visible box or heading. Avoid unnecessary
cards, duplicated instructions and explanatory UI about how the interface works.

| Responsibility | Shared expectation | Variation to preserve |
| --- | --- | --- |
| Active task | One concise instruction and clear mathematical referent | Different operations, quantities and stages |
| Expression | Existing intrinsic stacked fractions, consistent relation/operator alignment | Unknown separator versus accepted relation; task-specific notation |
| Feedback | Plan52 success/retry/incomplete/help/attention meaning and associations | Specific mathematical guidance and active reflection |
| Working area | Consistent outer alignment, spacing and relationship to the task | Bars, lines, construction and linear/text equivalents |
| Response | Clear group and consistent Check/control treatment | Relation choice, numeric fields, direct placement controls |
| Help | Predictable nearby location and truthful open/close behavior | Different assistance contents and reveal rules |
| Progression | Plan43 semantics, deliberate Next and recognizable return | Genuine next mathematical responsibility |

Recommend one default ordering of help/response/Check, with concise justified
exceptions for direct manipulation or numeric work. Preserve DOM/reading/keyboard
order agreement; do not fix visual order alone with CSS. Specify how narrow layouts
wrap, how enlarged text grows, and where long mathematical content can differ from
ordinary copy. No fixed-height clipping, tiny controls or global layout assertions
that force every task to fit one viewport. Preserve useful vertical scrolling.

Each rule must identify a current owner or a small reusable style/helper. Future
implementers should be able to select a variant without inventing unrelated spacing
or adding a new framework. The contract's proposed but unmigrated portions must be
explicitly labeled. No broad legacy conversion or compulsory identical DOM.

## Requirement 2 — comparison first slice

After approval, align ordinary Plan45/49 comparison and Plan51's initial comparison
stage: consistent outer width/centering, mathematical expression with a visible
unanswered `?`, relation choices, Help placement and Check grouping. Reuse accepted
comparison presentation where suitable; verify the accepted relation uses the same
visual treatment. Keep the separator decorative as appropriate and supply a clear
accessible question through the task/group label, without duplicate announcements.

Preserve Plan51's separate distance stage and numeric fraction response; use the
approved numeric variant rather than copying relation controls. Do not show the
distance answer, comparison answer, extra model or later content early. Preserve
help state, draft inputs, field associations, retry semantics, focus and current
Next behavior. Do not harmonize by adding another step, hiding help, removing
learner decisions or moving task logic into a renderer.

Changes apply to standalone and composed-session launches of these tasks. Test both;
do not imply session-only impact. Inventory other episode deviations as actionable
follow-ups with reason/severity and recommended small batches; do not repair them
in this packet. No new task content, entry redesign or Plan60 lifecycle refactor.

## Requirement 3 — evidence and delivery

Capture matched initial comparison, help/retry and accepted/distance states at narrow
360×740 and Chromebook1093×614, plus a meaningful enlarged-text sample. Reuse current
content, with pointer and keyboard/linear journeys. Inspect alignment, actual gaps,
control order, wrap, focus visibility, hit targets and overflow. Class names alone
are not visual proof. Preserve old receipts and identify exact source under test.

Verify both standalone families and the composed-session transition into distance,
including assistance, draft preservation, retry, accepted result and Next. Preserve
reduced motion, visible response controls and Plan52 announcement/description paths.
Do not claim physical-device or actual AT behavior from headless evidence.

Add focused regression assertions for the contract's load-bearing claims, and one
or two targeted failing-first checks where ordinary assertions must reject a missing
separator or incorrect control arrangement. No generic screenshot infrastructure
or large seed framework. Choose existing evidence mechanisms first.

Run focused tests while editing; final suite/build/lint/diff and one isolated
historical browser matrix if shared renderer branches change. Do not repeat the full
matrix on every style iteration. Use one consolidated cold default-role Terra-medium
read-only review if the final markup/helper work is substantial, none automatically
for mechanical CSS; no duplicate orchestrator pass, Sol/Astra, substitution or child
fan-out. Record consultation disposition and requested/observed limitations honestly.

## Checklist and authority

- [ ] Inventory and exact contract/source scope approved before implementation.
- [ ] Shared rules and justified variants are actionable, with clear ownership.
- [ ] Comparison slice consistent in standalone and session, task differences intact.
- [ ] Help/drafts/focus/feedback/reading order and mathematics preserved.
- [ ] Narrow, Chromebook and enlarged-text rendered evidence supports the claims.
- [ ] Maintained contract distinguishes implemented rules from deferred migration.
- [ ] Scoped progress, checks and precise coverage/uncertainty recorded.

Coordinate Git and source windows; stage explicit owned paths, commit progress.md
separately last. Implementers do not change packet status, acceptance or orchestration
records. Stop for scope/contract conflict or a needed instructional-state change.
Owner rendered acceptance and deployment remain separate. No push or Bootstrap writes.
