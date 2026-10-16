---
id: plan-33
title: About FractionFlow and Use Guide
status: in-progress
depends_on: [plan-12, plan-13, plan-31]
gate: "Owner initiation; Requirement 0 approves concise copy, accurate privacy/settings claims, page navigation and exact paths before source work. Technical and owner rendered-page acceptance before completion; deployment separate."
summary: >-
  Add a small About page reachable from the app entry, describing FractionFlow,
  how to practice, support choices and current answers/progress privacy behavior.
  Include a few accessible visual examples and keep the guide maintainable as
  the product changes without expanding the learner entry page.
---
# Plan 33: About FractionFlow and Use Guide

## Packet Metadata

- Packet id: `plan-33`
- Owner/model: implementer (single writer) / orchestration
- Date: 2026-10-14
- Packet type: feature / explanatory content
- Mutation level: source and learner-facing local content
- Depends on: accepted entry/focus, reachable support and shared typography
- Expected artifacts: About page/navigation, concise copy, accessible visual examples,
  targeted verification/screens and `reports/development/plan-33-about-and-use-guide/progress.md`

## Goal

Provide an optional page explaining what FractionFlow is, how to use its current
practice and support controls, and what happens to answers/progress. It should be
useful to someone supporting a learner without naming teachers/parents as the
audience; learners may read it too. The page can evolve with delivered behavior.

The owner requested this page on 2026-10-14 and explicitly identifies support
selection as a lasting useful feature. Other gear controls currently serve review
and testing as well as use; their eventual deployment disposition is not settled.

## Non-goals

No lesson, new practice family, task variation, storage, accounts, analytics,
tracking, consent flow, legal-policy document, installation tutorial, framework
migration, settings retirement/redesign, new motion, deployment or efficacy claim.
Do not turn the entry into an explanatory landing page or add an automatic intro.

## Authority and contracts

Read AGENTS, the implementer prompt, founding principles, instructional model,
architecture/privacy constraints, current entry/support/typography contracts,
`docs/development/README.md`, and the current runtime/build/host configuration.
Verify behavior against artifacts. Preserve the first-Tab practice-button contract,
registered fragment launches, return/re-entry semantics, reduced motion, static
hosting, and math -> instruction -> presentation. No model-authored mathematical
truth or future product features presented as current.

## Requirement 0 — Investigate, propose, stop

Run packet preflight after owner initiation. Inspect the then-current entry,
settings/help, state lifecycle, network/storage usage and static asset routing.
Propose the complete short page copy, placement/navigation/return/focus mechanism,
one or two example visuals, and exact file list. A standalone static page is a
candidate; compare against the smallest existing app-page mechanism without a
router/framework migration. Explain how relative asset paths work on Pages.

Provide a compact claim-to-evidence list for answers/progress privacy and each
setting described. Source inspection on 2026-10-14 found no learner-state storage
or tracking APIs in `src`; this is an orientation observation, not a substitute
for implementation-time verification. Stop for mechanism/copy approval before
source work. The packet does not decide which reviewer-only controls ship later.

## Requirement 1 — A concise useful page

Cover only these reader questions, using short paragraphs or a small list:

- What is it? A browser fraction-practice site connecting pictures, equal-sized
  parts and calculation. Describe only currently reachable operations/tasks;
  do not advertise subtraction prototypes as released learner practice.
- How do I use it? Start a practice, answer through the controls, request help
  when needed, inspect/replay changes, and use Next/Retry/return as currently offered.
- What does support do? Explain More support / Less support in plain language.
  It is a presentation/help choice, not an ability score or proven mastery measure.
  Describe current effects accurately and how to select it before practice.
- What is saved or tracked? Explain current answers/progress behavior and reload
  reset plainly. No accounts, learner tracking or app-managed persistent answer/
  progress storage. Do not promise "no data anywhere" or "nothing ever stored":
  distinguish the app's learner-data behavior from ordinary hosting/browser data.
  A simple candidate is: "FractionFlow doesn't track learners or save answers or
  progress between visits. Reloading the page starts a fresh practice."

Aim initially for about 200-300 words total, treating this as a design budget rather
than a reason to omit needed truth. Do not repeat headings as opening sentences,
describe the same visual twice, include internal plan/condition IDs, or write an
educational-method manifesto. Do not promise improved outcomes without evidence.

Useful display settings may receive one brief description if warranted; leave
review/test-mode detail out unless it helps someone operate the current site.
State future setting decisions as unresolved in the report, not as product copy.

## Requirement 2 — Optional entry and accessible examples

Add one unobtrusive About link from the entry and an obvious return-to-practice
link/action. Keep the practice button primary and first in entry keyboard access;
recheck the initial 360x740 entry fit and heading/return behavior. About can scroll
naturally. No modal, automatic tour, or extra practice-start step.

Use one or two small visual examples drawn from validated existing representations
and shared intrinsic fraction typography: for example equal-part bars/renaming
or a multi-whole result. Keep them static, concise and accessible, with equivalent
non-visual meaning and no redundant captions. Reuse an existing safe display
helper or locally generated static asset rather than building another math engine.
No remote embeds, learner information, real-user screenshots or new dependencies
solely for these illustrations.

Do not pre-mount the guide or example answers in hidden episode DOM. Separate
navigation must preserve instructional answer-withholding and ordinary reset
behavior. No future lesson/example data in active/inactive practice siblings.

## Scope and maintenance

Limit changes to a small About content/page module or static HTML, entry link,
shared styling/typography if needed, build routing if required, relevant tests
and this packet's evidence/report. Exact paths are approved at Requirement 0.
Single writer; no overlap with concurrent app-source work. It can be scheduled
between source packets once entry/composition ownership is free.

Keep copy in one identifiable place. Record update triggers: reachable practice
goals, meaningful gear/support changes, navigation, help and any separately
approved progress/storage change. Recheck privacy claims before such changes
ship. The page must describe current behavior rather than silently become stale.
This packet authorizes no persistence policy change.

## Validation and stop conditions

Verify actual entry -> About -> practice keyboard and pointer journeys, direct
static route/assets at the Pages base path, current fragment launches, no accidental
episode advancement or pre-mounted answer leakage, and sensible mobile/Chromebook
layout. Inspect rendered text for redundancy and controls for reachability; capture
entry plus About at 360x740 and 1366x768. Record ordinary About scrolling honestly.
Check current privacy/storage claims against source and a bounded browser run.
Run relevant tests, build, existing route checks affected by entry navigation,
packet lint and diff check. Avoid tests that merely mirror literal prose.

Stop on blocked preflight, inaccurate/load-bearing privacy claims, unsettled
settings disposition or an additional required write path. Surface decisions;
do not invent permanent deployment settings. Owner approves the rendered page.
Commit scoped work by explicit paths, progress report last; never change packet
completion status, push or deploy. Codex advisors may use only Sol-class read-only
low/medium effort; no Astra or forced high-effort defaults. If unavailable or not
warranted, record the applicable consultation/degraded-mode disposition explicitly.
