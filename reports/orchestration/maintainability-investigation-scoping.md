# Maintainability investigation: initial scoping

Date: 2026-10-10. Initial observations, not an architecture decision or migration
authorization. Owner requested discussion before a Claude/Gemini skeptical-review
handoff is written.

## Question

Which changes would reduce the cost and regression risk of typical FractionFlow
revisions, for the owner and for agents, while preserving the established math,
instructional state, accessibility and static deployment contracts?

Evaluate presentation architecture, module boundaries, DOM ownership/lifecycle,
documentation, agent instructions and verification workflow as rival or combined
causes. Vue single-file components are a candidate, not the predetermined answer.

## Initial artifact observations

- Current `src/render/beat-container.js` is 1,047 lines, `linear-path.js` 848,
  `fraction-bar.js` 687 and `src/app/app.js` 973. These are current line counts,
  not measured maintenance costs. Presentation is predominantly imperative DOM
  construction; inspect locality/ownership rather than treating size as proof.
- Plan 25's delivery review independently reproduced focus loss when opening
  helper controls remounted the active response. App and both renderers share
  lifecycle responsibilities; clearer markup alone does not specify focus.
- Plan 26's original delivery review found admission accepting data the renderers
  refused, plus incomplete saved browser participation/layout evidence. Its two
  repairs include evidence work as well as a production validation correction.
- Plan 21 was an investigation/design dossier, not a source implementation;
  compare its effort by category rather than counting it as a markup rewrite.
- This scoping pass also found an incorrect stylesheet path in the newly drafted
  Plan 31 brief. The actual stylesheet is `src/app/styles.css`; corrected inline.
  That is a documentation/routing failure attributable to orchestration, not
  evidence that the source architecture alone causes navigation difficulty.

## Requested evidence

Owner-authorized messages were delivered to FF Impl 26, FF Impl 21 and FF Impl 25.
Each was asked to examine its own history, provide concrete easy/difficult incidents
with artifact pointers, distinguish observed causes from hypothetical improvements,
and avoid fabricated time/token estimates. Each owns only its named retrospective
under `reports/orchestration/maintainability-plan-NN-implementer-retrospective.md`.
Source changes, packet/status changes and commits were excluded. Root will inspect
the outputs; no return-message permission workaround is needed.

All three requested reports arrived during this scoping turn and were read by
root. Their incident pointers align with the inspected Plan 25/26 delivery
reviews and Plan 21's progress record. They are retrospective self-reports,
not measured effort or a controlled architecture comparison. Plan 25 identifies
real cross-layer help/replay complexity and remount focus loss; Plan 26 emphasizes
admission-contract drift and evidence repair; Plan 21 emphasizes distributed
admission discovery and proposal/governance costs. Both understandable pure APIs
and potential presentation-locality improvements should remain visible in review.
Do not infer a percentage of effort attributable to any cause from these accounts.

## Proposed review comparisons

Compare the current architecture with smaller vanilla modules/declarative templates,
a bounded Vue component migration, and documentation/instruction/harness changes.
Other alternatives are welcome when justified by specific incidents. Consider
stable DOM identity and input drafts, focus, animation cancellation/conservation,
visual/linear parity, future-answer DOM leakage, accessible names, CSS ownership,
test coupling and dependency/build costs. Keep deterministic truth upstream.

Use the same representative revisions for each option: copy/notation change,
help open-close-recovery, an added same-task problem, and a motion change. Ask what
files must be understood/edited, which responsibilities move, which defects could
still occur, and what a smallest reversible pilot would test. Distinguish measured
evidence from predictions; total repair counts alone cannot identify a cause.

No reviewer handoff, framework selection, dependency installation or production
migration is authorized by this scoping note. Do not pause accepted packet work
automatically; discuss whether the investigation changes sequencing after the
retrospectives and independent reviews. This prose-only scoping does not warrant
an advisor consultation.
