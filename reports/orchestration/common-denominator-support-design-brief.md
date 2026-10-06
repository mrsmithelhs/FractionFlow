# Finding a common denominator — proposed support design

Date: 2026-10-06. Owner raised the distinction between checking a proposed
denominator and helping learners determine one. This is an investigation/design
brief, not an adopted mechanism, new support profile, implementation assignment
or amendment of the existing family/denominator-path policies.

## Verified objective and current gap

Instructional model §§6–7 grounds common denominators in common units and makes
leastness an efficiency goal rather than a correctness requirement. Stage F names
recognizing relationships and finding useful common multiples. Roadmap §19 names
choosing a denominator, §21 names layered help, and §28 explicitly lists valid-
and least-common-denominator concept tasks. The objective exists in the founding
documents; the learner method is not yet concretely delivered.

In the current decide renderer, high support selects from projected candidates;
medium support submits a positive number for classification. Successful selection
advances toward conversion. The help renderer displays one generic hint string
according to the projected help level. This supplies neither a validated sequence
of learner calculations nor a concrete proof of why the selected unit fits both
denominators. Existence of a help button or a denominator validator is not evidence
that learners can discover a denominator.

References: `src/render/beat-container.js` decide and active-beat-help paths;
`src/render/strings.js` app.helpLevels; `src/interaction/episode.js` handleHelp;
`docs/founding/01-instructional-model.md` §§6–7 and Stage F; Roadmap §§19/21/28.

## Proposed instructional progression

Teach the criterion first: the new number must be a whole-number multiple of each
original denominator, so each original part can split into a whole number of new
equal parts. A common factor can help find a convenient common multiple; the common
factor itself is not the target denominator. Equivalent-numerator construction
remains its own learner responsibility.

Candidate strategies for investigation, not three simultaneous learner controls:

- Recognize an already available unit when one denominator divides the other.
- Multiply the denominators to obtain a valid common multiple; explain why each
  original denominator divides the product. The product can be larger than needed.
- Build/check multiples to find a shared number, then consider efficiency. Formal
  factor decomposition or gcd-based algorithms can follow if the intended learner
  and prerequisite evidence justify them; do not require them for a valid answer.

Example for the proposed shared-factor fixture: denominators 4 and 6 admit both
24 (product) and 12 (smaller shared multiple). This is a design example, not a claim
that the learner app currently launches that fixture. The existing 3-and-4 episode
admits 12 and 24 but cannot by itself contrast product with a smaller common multiple.

## Proposed high-support consequence

After a learner selects an available denominator, offer a compact proof linked to
parts. For selected 12 with original denominators 3 and 4, denominator-only relations
`3 × 4 = 12` and `4 × 3 = 12` explain why both units can use twelfths. If needed,
use a single unit-part subdivision rather than converting and shading both operand
bars before their responses. Do not supply 8/12 and 3/12 or undermine transform's
answer-withholding contract. Determine whether a brief optional Why this number
inspection, a local learner check, or a small stable proof best fits the calm UI;
do not automatically insert a long explanation or a timed screen.

## Proposed medium-support assistance

Keep unaided entry available. Use one task-local Need help entry point; avoid a
second competing help system. On request, open a small guided workspace in the
same task. Investigate the smallest route that requires meaningful thought: for
example, learners supply some multiples, identify a shared number and verify its
whole-number relationship to both original units before choosing to use it.
Do not simply reveal complete matching lists or autofill/submit the final answer.
Local error recovery, keyboard/non-drag touch/linear access, closing/returning to
the original input and focus need a concrete mechanism. Early help can cue a
strategy; a worked example is a later support rung, honestly marked as assisted.

The authored unit proof/workspace must respect the same selected practice's task
coverage/capability boundary (DECISION-036/Plan 22). A product remains mathematically
valid even if a particular picture or authored practice cannot use it. Never teach
only what fits the current bars or recommend a path that ends in a missing task.
The focused nested side-identification task in DECISION-037 does not become general
unit choice, and like-denominator tasks should not acquire needless conversions.

## Architecture and evidence questions before source work

Help calculations/response classification belong in exact math, instructional
substeps/provenance in the pure interaction layer, and projected presentation in
the renderers. Renderer-owned correctness or assistance state is not authorized.
Determine whether local help substeps fit the current decide beat and frozen
schedule; do not silently add top-level beats or change support configuration.
Record assisted versus independent work and replay/reset identity implications.

Required discriminating evidence: a learner must contribute information the helper
has not already supplied; valid non-least work stays valid; wrong multiples and
one-sided candidates get useful local recovery; selected-number explanations do
not leak later numerator answers; no stale helper/answer survives retry or re-entry.
Include product-vs-smaller-unit, nested and unsupported-but-valid cases in the
investigation without promoting unimplemented families to live reach.

A small investigation should propose one bounded first support mechanism and its
falsifying browser checks, then stop for owner/orchestrator mechanism approval.
Revisit before claiming medium-support denominator independence or closing the
§28 common-denominator concepts. This brief creates no new hard dependency on
existing draft packets and does not fold the work into the motion enhancement or
Plan 22's path-closure repair.

## Research context and limits

The IES/WWC fractions practice guide recommends helping learners understand why
fraction computation procedures make sense; its common-denominator guidance
includes discussing why the product of denominators supplies a common denominator.
This supports investigating a concept-linked process, not a claim that this proposed
UI improves learning. No learners were observed and no efficacy claim is made.

- https://ies.ed.gov/ncee/WWC/PracticeGuide/15/Published
- https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/fractions_pg_093010.pdf

The practice-guide overview and indexed PDF excerpt were retrieved on 2026-10-06;
opening the full PDF timed out. Do not imply a full-paper review from that excerpt.
Advisor consultation is not warranted for this prose-only investigation record.
