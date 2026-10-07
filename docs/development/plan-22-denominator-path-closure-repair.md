---
id: plan-22
title: Denominator Path Closure Repair
status: in-progress
depends_on: [plan-13, plan-14]
gate: "Requirement 0: verify the live denominator coverage/capability defect and approve the DECISION-036 task-boundary mechanism before source work. Preserve valid-answer classification and verify identity/replay compatibility. Technical and owner behavior acceptance; release separately authorized."
summary: >-
  Repair a reachable dead end introduced by numeric denominator entry: a valid
  denominator can lack authored reflection data or exceed bar capability while
  still advancing to conversion and reflection. Preserve mathematical validity,
  enforce representation eligibility, and guarantee an honest completable path.
---
# Plan 22: Denominator Path Closure Repair

## Packet Metadata

- Packet id: `plan-22`
- Packet title: Denominator Path Closure Repair
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-10-04
- Packet type: repair
- Mutation level: source / learner-facing local behavior
- Approval gate: verified mechanism, owner policy if changed, technical and owner behavior acceptance
- Depends on: `plan-13`, `plan-14`
- Expected artifacts: bounded interaction/scene/render closure, meaningful tests/routes and report

## Goal and why this packet exists

The accepted canonical practice with medium support accepts 36 as a mathematically
valid common denominator, allows `24/36`, `9/36`, `33/36` and final `11/12`, then
reaches reflection without content for either connection-making form. Matching
cannot mount choices; premise answers cannot finish. The content eligibility verdict
already says this denominator is outside the bar's reviewed capability, yet the
presentation continues drawing it. Claude reproduced the browser dead ends and an
independent orchestration pure probe confirmed the state path. This is an existing
practice repair, not a prerequisite feature invented for the new wave.

## Non-goals and dependencies

No new families, support levels, animation redesign, generic content generation,
new session policy, mathematical ceiling, arbitrary rejection of valid arithmetic,
unnecessary definition churn or deployment. A fallback changing registered task
semantics must explain identity/replay compatibility at the gate; do not keep an
incompatible identity merely to avoid a revision. Return for scope approval if needed.
Complete Plans 13/14 supply the writer and witnesses.
Plan 11 is not a hard dependency: this repair must precede its combined public release,
so requiring Plan 11's deployed acceptance would create a circular release blocker.
Serialize overlapping source/route writes after Plan 11's implementation commit and
technical handoff, or use an explicitly coordinated isolated workspace. Do not repair
or stage its in-flight changes as part of this packet.

## Authority and contracts

Read `AGENTS.md`, `docs/decision-log.md` (008,011,028), `docs/development/README.md`,
Quality §46, the Plan 13 report and delivery review, the two next-wave reviews and
`reports/orchestration/next-wave-plans-17-21-review-disposition.md`.
Inspect eligibility, denominator classification/handling, reflection data, scene,
visual/linear renderers and the existing route runner. Representation bounds are
capability limits, not mathematical limits. DECISION-036 amends Decisions 008/011 for the current demo: implement honest
task-bounded recovery now. Broader symbolic continuation remains a follow-up review
when content/capability coverage expands.

## Scope

Existing canonical practice and its two connection-making conditions, high/medium
configuration, upstream path coverage/capability transport and downstream consumption,
tests and mounted browser routes. Identify exact changed files at Requirement 0.
Do not broaden into family expansion or change owner/orchestrator disposition records.

## Implementation Requirements

### Requirement 0 — Reproduce and propose the adopted boundary; stop

Run preflight. Reproduce the 36 path through both conditions using pure state and
real mounted controls. Record mathematical validity, authored coverage, rendering
verdict, continuation and actual end state separately. Inspect the eligible-but-
unauthored category too: the nested fixture's 24 path is a useful pure content
example but is not a live registered family today. Do not admit nested content here.
Verify all reachable canonical paths, including 12/24, and identify any denominator-
dependent authored subjects and distractors. Apply DECISION-036: propose an upstream
admission check that distinguishes valid-but-unsupported units from mathematical
errors before advancing to unsupported work. Keep the response field usable for
another unit and preserve retry/return paths and clear focus. Derive the reviewed
coverage from the actual definition, condition and capability, not a global hardcoded
12/24 rule. Never label a valid common unit mathematically wrong or coerce it.
Obtain mechanism approval before source changes; the owner policy is already adopted.
Explain replay/identity compatibility, including prior unsupported-unit envelopes.
Do not extrapolate an ad hoc infinite set of authored prompts.

### Requirement 1 — Honest closure and fail-closed presentation

Retain mathematical classifications and configuration/replay provenance. Every accepted
path through a registered practice must reach its defined completion or the explicitly
approved task boundary with usable recovery/return; no null premise, missing choices,
dead-end answer control, or unsupported bar mounting. The approved task boundary
must prevent unsupported advance in visual and linear paths. Respect upstream
role/capability wherever presentation remains reachable; do not call fraction-bar
renderers unconditionally when the scene forbids them. A linear-view toggle alone
is not a usable recovery path. A renderer-local numerical ceiling is not
a substitute for upstream ownership. Preserve canonical 12/24 semantics and existing
correct-answer acknowledgement. Do not coerce a proposal to a different denominator.

### Requirement 2 — Failing-first coverage beyond authored examples

Add browser routes entering 36 under medium support for matching and premise conditions,
and assert the approved outcome at the task boundary and after recovery through mounted controls. Include the
linear route and reduced motion, recovery, retry and return focus. Test mathematically
invalid input separately from valid-but-unsupported task coverage and representation
ineligibility. Add a registration/path-closure check: an accepted path has applicable
authored data or an executable approved fallback/boundary. It need not enumerate
unbounded integers or require all denominators to have stored data. Seed removal of
the coverage/eligibility enforcement and require a meaningful witness failure.
Retain existing route assertions and legacy replay behavior. Capture narrow-screen
behavior of the repaired path; do not claim untested physical-device or AT outcomes.

## Work plan and validation checklist

Investigate → mechanism/owner gate → scoped repair → pure and mounted failing-first
evidence → full tests/build/routes, packet lint and diff check → commits/report.

- [ ] 36 reproduction and the approved outcomes are independently observable in both conditions.
- [ ] Invalid math, unauthored coverage and ineligible presentation remain distinct.
- [ ] No out-of-capability bar, silent coercion or reflection dead end; closure seed rejected.
- [ ] Existing 12/24 routes and legacy replay pass; required evidence and report exist.
- [ ] No unrelated files changed; gates honored; Plan 11 work preserved.
- [ ] `reports/development/plan-22-denominator-path-closure-repair/progress.md` exists.

## Stop Conditions and authority

Stop on blocked preflight, overlapping writer scope, changed settled contract,
load-bearing undecided policy or validation requiring family/generalization work.
Implementer does not set status, edit disposition records or declare completion/
readiness to ship. Apply inherited advisor declaration/disposition, report against
the objective, commit explicit scoped paths and the report last, never push/deploy.

## Progress Report

Record reproduction, approved policy/mechanism, exact repaired paths and residual
coverage, browser/state evidence, negative seeds, legacy compatibility, advisor
disposition, owner acceptance and separately pending release.
