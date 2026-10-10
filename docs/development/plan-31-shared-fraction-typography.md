---
id: plan-31
title: Shared Fraction Typography
status: draft
depends_on: [plan-11, plan-26]
gate: "Requirement 0 presentation mechanism confirmation before source work; technical and owner rendered-screen acceptance; deployment separately authorized."
superseded_by: null
resolution: null
summary: >-
  Give bar readouts an intrinsically sized stacked fraction and reuse structured
  fraction notation in linear matching questions and buttons, preserving geometry,
  readable wrapping and coherent accessible names.
---
# Plan 31: Shared Fraction Typography

## Packet Metadata

- Packet id: `plan-31`
- Packet title: Shared Fraction Typography
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-10
- Packet type: presentation
- Mutation level: bounded renderer/style/verification changes
- Approval gate: mechanism, technical and owner rendered-screen acceptance
- Expected artifacts: shared notation changes, targeted tests/routes and matched screenshots

## Goal and why this packet exists

The owner observed that bar-label fraction lines span their reserved lane, while
the larger symbolic expression sizes its lines to the numerals. The owner also
suggested stacked fractions in the linear reflection question and matching-choice
buttons. Apply one consistent content-width rule, preserving the reserved lane
that protects bar geometry. Use structured forms rather than slash notation where
the notation can fit comfortably within these specific surfaces.

## Non-goals and dependencies

No mathematics, new task, content admission, navigation, instructional prose
rewrite, general text parser or global replacement of every slash fraction. No
mixed-number learner task or new dependency. Record future mixed-number grouping
requirements without implementing a new pedagogy. Plans 11/26 supply accepted
motion geometry and the two-item content baseline; Plan 30 is independent.

## Authority and scope

Read `AGENTS.md`, `docs/decision-log.md`, `docs/development/README.md`, the
typography follow-up, and Plan 11/26 technical dispositions. Inspect
`src/render/symbolic.js`, `src/render/fraction-bar.js`, `src/render/linear-path.js`,
choice rendering hooks, `src/styles/render.css` (fraction/renderer typography),
`src/app/styles.css` (app chrome) and relevant structured scene
forms/tests. Own only the necessary renderer/style and focused verification files
identified at the mechanism gate, plus this packet's evidence/report folder.
Preserve exact math → instructional state → presentation, raw learner-visible
forms, accessible paths and historical replay. No source concurrency on shared files.

## Implementation requirements

### Requirement 0 — Inspect, propose and stop

Run preflight and capture a representative baseline. Propose a shared notation
helper/variant and exact write paths. Each divider's width is the larger numeral's
intrinsic width plus a small shared font-relative padding, independent of its host
width. Preserve the outer bar-readout reserve; size only its inner notation.
Inspect both ordinary and persistent bar-readout constructors and their lane
sizing; preserving only the persistent layout does not establish all-mode geometry.
Describe inline baseline/line-height/wrapping, button targets, structured scene
inputs and coherent spoken names. If a needed form is absent from the scene,
propose a minimal projection addition; never parse prompt prose to recover math.
Obtain mechanism approval before source changes.

### Requirement 1 — Bounded presentation

Reuse the existing symbolic helper and choice hooks for bar labels, the source
fraction in linear matching questions, and their fraction-choice buttons. Keep
words free to wrap; keep each numerator/denominator pair together. Accessible
names must read the fraction once and retain the full question/choice meaning.
Typography must not change math truth, reveal an answer or add explanatory text.

### Requirement 2 — Rendered verification

Verify one- and two-digit numerator/denominator combinations, including differing
digit widths, both current items and 12/24 forms. Measure intrinsic divider widths
and ensure hosts cannot stretch them. Preserve whole/fill positions through
conversion and Replay using existing document-coordinate assertions. Check both
360px reference viewports and a representative Chromebook-size viewport, plus
200% browser zoom or equivalent effective viewport with the method stated.
Inspect matched bar-label and linear question/button screenshots for wrapping,
line spacing and focus; exercise keyboard choices and reduced-motion routes.
Stacked markup changes text serialization: preserve equivalent semantic assertions
when slash-based text checks become unsuitable. No-future-answer checks must prove
their inspected target exists and must detect leaked fraction values independently
of slash notation; demonstrate rejection of a seeded leak. Retain legacy route
coverage and invariant meaning rather than mechanically preserving obsolete text
serialization. Run meaningful targeted tests, normal
tests/build/routes, packet lint and diff check; broad visual proof comes from
rendered evidence, not just DOM classes. Report physical-device/AT limits honestly.

## Validation checklist

- [ ] Shared sizing rule and accessible notation verified against rendered output.
- [ ] Bar geometry, learner flow, replay identity and legacy route assertions preserved.
- [ ] Required screenshots/measurements and `reports/development/plan-31-shared-fraction-typography/progress.md` exist.
- [ ] Mechanism and owner gates honored; no unrelated files changed.

## Stop conditions and implementer authority

Stop on blocked preflight, needed instructional changes, unavailable structured
forms requiring broader architecture, or a material readability/geometry tradeoff.
Do not set status, edit orchestrator records or self-certify completion/readiness
to ship. Report against the actual objective, apply inherited advisor declaration
and disposition rules, commit explicit owned paths and commit progress last.
No push or deployment.
