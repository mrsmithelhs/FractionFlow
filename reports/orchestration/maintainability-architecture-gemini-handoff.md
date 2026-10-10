# Gemini handoff — FractionFlow maintainability and revision architecture review

## Optional delegation authorization

The owner explicitly authorizes **inherited-model subagents** if supported by your actual runtime. Use them as you judge useful; no delegation is required and no particular division of work is prescribed. Keep their activity within this review's read/report-only scope, with disjoint note paths where needed; you remain responsible for synthesis and verification.

Do not require a newer Gemini Pro model or assume it is available for delegation. Use the current configured lead model and supported inherited-model helpers. Record the runtime/model identity you can actually observe, separating requested settings from verified facts. Do not add a higher-tier model dependency as a prerequisite for delivering this review.

## Assignment and authority

Conduct an independent, skeptical review of FractionFlow's maintainability and revision workflow. The owner has approved this question:

> Which changes would make typical FractionFlow revisions easier to locate, understand, implement, and verify, while preserving mathematical authority, instructional behavior, accessibility, and replay compatibility?

Vue single-file components are one candidate, not the required conclusion. The owner knows Vue and values structured markup, styles and behavior organized into small understandable units. Examine whether this would improve actual revisions, and whether smaller vanilla modules/templates, clearer lifecycle ownership, documentation, agent instructions or verification tooling would provide more payoff.

This is a design review, not implementation. Read source/history and official external documentation as useful. You may run existing read-only inspections and existing checks if needed, stating exactly what they establish. Do not install dependencies, create a runtime prototype, change product source/tests/configuration, revise packets/decisions/status, initiate work, push or deploy. Do not contact other chats. Produce only your assigned review and optional notes. Source migration and experimental implementation require a subsequent approved packet.

Other agents may be working in the shared checkout. Record HEAD and working-tree state at the start/end; preserve all unowned edits. Use committed files when live changes would confound a finding, and identify the revision inspected.

## Inputs and orientation

Read `AGENTS.md` first. Then read:
- `reports/orchestration/maintainability-investigation-scoping.md`.
- The three `reports/orchestration/maintainability-plan-21-implementer-retrospective.md`, `maintainability-plan-25-implementer-retrospective.md` and `maintainability-plan-26-implementer-retrospective.md` reports.
- `docs/founding/00-principles.md`, `04-system-architecture.md`, `05-quality-and-validation.md` and relevant portions of the instructional model/interaction grammar/roadmap.
- `docs/development/README.md`, relevant decisions in `docs/decision-log.md`, and `docs/development/phase-3-follow-up-obligations.md`.
- Plan 25's `reports/development/plan-25-equivalent-fraction-conversion-help/delivery-review.md` and progress report.
- Plan 26's `reports/development/plan-26-vetted-addition-practice-and-next-problem/delivery-review.md`, `repair-01-review.md`, `repair-02-review.md` and progress report.
- Draft Plans 30/31 and Plan 19's mechanism requirements when considering sequencing.

Inspect current code as necessary: `src/app/app.js`, `src/app/styles.css`, `src/render/beat-container.js`, `linear-path.js`, `fraction-bar.js`, `controls.js`, `symbolic.js`, scene/state/definition/replay contracts, content admission and representative tests/browser tooling. These are starting points, not a mandatory full-repository sweep. Trace representative behaviors rather than reading every file indiscriminately.

Current context: Plan 26 is accepted and closed. It introduced a fixed two-item practice set and Next/Retry/reset behavior. Plan 25 added optional task-local conversion help. Plan 21 was a design investigation with no UI source changes, so it is not comparable implementation-cost evidence. The retrospectives are self-reports with artifact pointers, not measured token/time attribution or controlled framework comparisons. Verify load-bearing claims yourself and challenge orchestration's framing.

## Required analysis

1. Classify concrete effort/rework incidents: markup discoverability, module/cross-layer coupling, DOM lifecycle/focus/drafts, repeated visual/linear logic, contract drift, copy placement, verification gaps, evidence production, documentation/routing, scope/approval, and harness/environment. Include what the existing architecture made easy. Distinguish product defects from missing proof. Do not infer causal percentages from repair counts or file lengths.
2. Compare at least: retaining the stack with targeted improvements; smaller vanilla components/declarative templates; partial Vue component adoption; documentation/instruction/evidence-tooling changes. Suggest other options if they solve a demonstrated problem. Avoid framework popularity as evidence.
3. Trace the same four representative revisions for the strongest alternatives: (a) copy or stacked-fraction notation; (b) help open/close/recovery with focus and retained drafts; (c) another same-task authored problem; (d) subdivision reveal/glow motion. Show current ownership/files, proposed ownership/files, likely edit surface and defects that could still occur. A hypothetical trace is not an implemented comparison.
4. Assess semantic clarity, stable DOM identity, remounts, accessible names, zoom/layout, focus, animation cancellation/conservation, visual/linear parity, CSS ownership, test coupling, dependency/build/runtime costs and owner understandability. A framework can hide lifecycle as well as clarify markup; smaller files can scatter responsibilities. Preserve inspectable completed context and prevent future answers/controls from entering the DOM.
5. Consider whether tests currently favor implementation structure over learner behavior. Support this with actual examples; do not assume imperative DOM exists to optimize unit tests. Identify meaningful tests/witnesses to preserve through any migration, and tests whose coupling obstructs safe change.
6. Recommend the smallest useful intervention and, if warranted, one reversible pilot. Specify scope, seams, unchanged contracts, parity checks, rollback and the subsequent representative edit that would test maintenance benefit. Name observations that would falsify the claimed benefit. No pilot source work is authorized here.
7. Discuss sequencing relative to Plans 30/31/19. Say whether any work merits pausing and why, or whether the review can remain separate. Do not automatically turn an investigation into a blocking engine rewrite. Prioritize by demonstrated value, change risk and cost; label estimates and unknowns.

Fixed constraints: exact math remains upstream in the pure math core; instructional decisions remain in instructional state; renderers consume validated meaning and emit intents. Static GitHub Pages, no backend/accounts/advertising/tracking, no public learner data or secrets. Preserve concise calm learner UI, non-drag keyboard/touch access, reduced motion, replay identity/compatibility and owner acceptance gates. A component migration must not create a second source of instructional truth. Agent arithmetic is not a validation oracle.

## Output and completion

Write a self-contained review at **`reports/orchestration/maintainability-architecture-gemini-review.md`**. Optional working notes may go only under **`reports/orchestration/maintainability-architecture-gemini-notes/`**. Do not read the other reviewer's output before submitting your independent review.

Include:
- Reviewer/runtime identity, requested versus observed helper models if any, inspected commit/state, methods and untested limits.
- A clear verdict and prioritized recommendations.
- An incident/evidence table with source or commit pointers, verified observations, inferred causes and uncertainty.
- A comparison of alternatives using the four representative revisions.
- The proposed minimal intervention/pilot, falsification criteria and sequencing recommendation.
- Explicit pushback against the owner's/orchestrator's premise where evidence warrants it; unresolved owner decisions.
- Sources near external technical claims, using primary documentation. Report commands/checks actually run; do not imply browser/physical-device verification from source inspection.

Keep the review substantial enough to support a decision, but avoid an exhaustive generic architecture essay. The lead reviewer owns synthesis and verifies important delegated claims. Follow repository advisor-declaration requirements proportionally; optional helper research is not automatically a higher-tier advisor consultation.

Commit only your explicitly owned review/notes after they are final, per repository discipline; never stage unrelated work or push. If Git metadata permissions prevent a commit, report the limitation and preserve the files rather than changing ACLs or removing locks. Finish with a short chat summary naming the output file, recommendation and principal limits. Report writing authority does not authorize editing orchestrator records or packet completion status.
