---
id: plan-17
title: Crossing-One-Whole Addition
status: draft
depends_on: [plan-11, plan-12, plan-13, plan-14, plan-16, plan-22]
gate: "Requirement 0: approve semantic stack projection, answer withholding, capability bounds, registry identity, and measured layout mechanism before source work. Technical and owner rendered-screen/agency acceptance before completion; deployment separately authorized."
superseded_by: null
resolution: null
summary: >-
  Deliver the first new Phase 3 practice: unlike-denominator addition whose sum
  exceeds one, using the decided discrete multi-whole stack. Preserve unit size,
  learner-supplied totals, existing conditions, and accessible participation.
---
# Plan 17: Crossing-One-Whole Addition

## Packet Metadata

- Packet id: `plan-17`
- Packet title: Crossing-One-Whole Addition
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-04
- Packet type: feature
- Mutation level: source / learner-facing local behavior
- Approval gate: mechanism, technical delivery, and owner screen/agency acceptance
- Depends on: `plan-11`, `plan-12`, `plan-13`, `plan-14`, `plan-16`, `plan-22`
- Expected artifacts: bounded content/interaction/render/app changes, tests and browser evidence, packet progress report

## Goal

Make one vetted crossing-one-whole addition episode reachable from the entry page.
The primary proposed fixture is `2/3 + 3/4 = 17/12`: it reuses two-renaming addition
and avoids making a new simplification lesson part of the first crossing increment.
This is one practice type, not generated practice or all crossing families.

## Non-goals

Subtraction, mixed-number inputs or instruction, a simplification beat, new support
levels, adaptive policy, session sequencing, persistence, and deployment are excluded.

## Depends on

The entry and support writers, route harness, frozen schedule, and actual motion
must be accepted first. Plan 11 is currently in progress; drafting this packet does
not authorize starting it while that dependency is incomplete. Plan 22 repairs
the live numeric-denominator coverage/capability dead end before expansion and
before a combined public release. Plan 21's early owner practice-type disposition
must precede adding a new entry surface; it is a named policy gate, not a requirement
that every future content-inventory task be finished. Other family packets are not
technical dependencies. Implement source packets one writer at a time.

## Why this packet exists

The math/content layers can describe a sum above one; the learner app cannot draw
it truthfully or launch it. Removing the existing range guard alone silently draws
an improper amount as one fully shaded whole. DECISION-032 decides the representation
but does not implement it.

## Authority and contracts

Read `AGENTS.md`, `docs/decision-log.md` (032–034), `docs/open-questions.md` (20, 24),
`docs/development/README.md`, Roadmap §§26–31, the Plan 10 dossier's
`crossing-one-whole.md`, and the Plan 11/13/16 mechanism and delivery reviews.
The dossier's layout sums are historical projections, not acceptance evidence;
DECISION-032's four constraints govern where proposal wording conflicts.

Preserve math → instructional state → presentation; definition/replay compatibility;
immutable support and schedule; beat leakage and participation floors; fragment-only
practice addressing; and the existing canonical practice.

## Scope

In scope: `src/content/` fixture and eligibility work, `src/interaction/` definition,
validation and semantic projection, `src/render/` multi-whole bars and choices,
`src/app/practice-types.js` and bounded composition/layout, relevant tests and
`tests/routes/route-matrix.json`. State the exact file list at the mechanism gate.
Do not change mathematical truth, the motion mechanism, other practice semantics,
the standalone subtraction prototypes, or owner/orchestrator disposition records.

## Implementation Requirements

### Requirement 0 — Investigate and propose; stop

Run packet preflight. Capture the then-current route baseline and actual construction
acceptance/refusal separately from renderer refusal. At the reviewed baseline the
existing relatively-prime definition admits this crossing fixture; do not invent an
instructional refusal or assume a new definition also generalizes family admission.
Propose registered definition identity, admissible selector/result semantics, vetted
fixture and alternate-denominator routes, upstream semantic stack data, capability
limits for operands/results/choice distractors, and answer-withholding rules.
Specify where quotient/remainder facts come from validated exact math; renderers
consume supplied quantities, never become a second math engine. Explain how the
last conversion animation, operate collapse, Replay and reflection share layout.
Tightening the legacy definition's accepted result range is a semantic change,
not automatically authorized by this new identity; propose and verify compatibility
before adopting it. Reuse existing validated `representationFacts.wholeSpan` where
applicable instead of inventing a second mathematical derivation.
State the intended operate responsibility explicitly: DECISION-032 permits a
countable combined stack, while today's task names combining addend quantities.
Explain the proposed upstream pre-answer projection and whether contributions
remain identifiable. Give a concrete non-visual equivalent that exposes the needed
quantity information without announcing the total; hiding all countable information
is not participation parity. Present the agency tradeoff and the alternative of
retaining addends until the answer for owner consideration. The latter changes
DECISION-032 timing and cannot be adopted without an owner amendment. No categorical
leakage finding or automatic relocation to resolve is assumed here.
Return for approval before source edits. A prototype variable is not settled by
this proposal. If an upstream math addition is necessary, return for scope review.

### Requirement 1 — Truthful stack and learner responsibility

Use equal-width wholes stacked vertically, with equal segment widths for the same
denominator. Preserve the raw improper form and unit count. At `operate`, retire
active addend bars into compact inspectable completed-step text. Before a learner
supplies the total, withhold numerical result readouts and mixed equivalents from
visible text, accessible names, live regions, summaries and hidden mounted content.
The countable visual quantity is allowed; an answer-bearing label is not.
Keep labels short and omit redundant per-row counts. Preserve existing final-form
behavior rather than invent a simplify beat. Beyond supported bounds, fail closed
upstream with an explicit reason rather than clamp, shrink or truncate a stack.

### Requirement 2 — Reachable registered practice

Add one plain-language entry button for the runnable sum-above-one practice and
its recognized fragment launch. Keep unavailable families absent. Preserve the
existing practice definition identities/revisions and replay oracle; give new
semantics their own registered identity. Exercise canonical denominator 12 and
a vetted alternative (proposed 24), both support profiles, local recovery, help,
Replay, reflection, retry, return and clean re-entry through mounted controls.
Premise/reflection data must be vetted for this content; do not reuse false facts
from the canonical `2/3 + 1/4` episode. Reuse is allowed when verified facts genuinely
match (this fixture retains the same left operand); new equations and right-side
facts still need validation. Missing authored data is a gate issue. Author and
validate the proposed fixture explicitly; it is not a currently stored golden case.
For each admitted path, verify condition-specific authored coverage or the approved
Plan 22 continuation/boundary, not just denominator eligibility. Add typed out-of-
coverage/capability routes; 12/24 alone cannot prove this property. Entry labels must
distinguish the two learner goals plainly, under the approved practice-type model.

### Requirement 3 — Browser geometry and access

Measure both reference viewports, 360×740 and 360×752, under every registered
condition with Replay active as DECISION-032 requires, plus rest, operate before
answer, resolve and reflection. Record actual scrolling and question/control
bounds, horizontal overflow, whole/segment widths and painted shaded counts.
Observe the Plan 11 transition before operate retires the addends. Cover high and
medium support, keyboard, non-drag browser touch, linear path and reduced motion.
Do not claim physical-device typing or assistive-technology evidence unless tested.
Supply screenshots for owner review. Ordinary vertical scrolling is reported;
hidden or unreachable controls and changing the whole's scale are defects.

## Work plan and validation checklist

After mechanism approval: implement the bounded increment; verify exact state and
projection; add reciprocal browser witnesses and failure seeds; run `npm test`,
`npm run build`, full `npm run test:routes`, packet lint and `git diff --check`.

- [ ] Existing route rows/assertions are preserved; additions are separately identified.
- [ ] Browser witnesses reject a one-whole truncation, resized second whole, and answer leakage before submission; clean runs pass.
- [ ] Non-visual quantity/agency parity and accepted-path closure are witnessed; no total announced before response and no unsupported renderer mount.
- [ ] Required artifacts and measured screenshots exist; access and recovery journeys reach completion.
- [ ] No unrelated files changed and all approval gates honored.
- [ ] Progress report exists at `reports/development/plan-17-crossing-one-whole-addition/progress.md`.

## Stop Conditions and authority

Stop on a blocked preflight, unresolved representation/identity/capability decision,
unexpected dependency, changed settled contract, or validation failure requiring
broader scope. Do not set packet status, edit orchestrator notes, or declare the
feature complete/ready to ship. Report against the actual objective, not test counts.
Apply the inherited advisor declaration/disposition contract. Commit scoped work by
explicit paths, commit the progress report last, never push or deploy.

## Progress Report

Record approved mechanism, files/commits, exact fixture/path coverage, legacy replay
checks, falsifying seeds, geometry and scroll measurements, participation evidence,
advisor declaration/disposition, limits and remaining owner gates.
