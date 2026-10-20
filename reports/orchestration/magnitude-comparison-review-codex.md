# Skeptical review: fraction magnitude comparison

Date: 2026-10-19. Reviewer: Codex orchestrator. Target:
`docs/development/phase-4-magnitude-comparison-notes.md`.

## 1. Executive verdict

Proceed to a bounded design investigation, not the proposed three-support-level
implementation yet. Magnitude comparison fits the founding instructional model
and Phase 4 well. Keep strategy diversity, genuine equality items, exact algorithms
and the connection to nonnegative distance. Change the premise that visible
magnitude is inherently an answer giveaway. Drop the unsupported assurances about
H2 and the implication that common denominators are required to compare fractions.
Treat H1 as an unvalidated experiment, not the default high-support solution.

The design must distinguish two legitimate goals:

- **Reason about magnitude with a model:** reading which amount is greater from
  aligned bars or positions can be the intended mathematical work.
- **Construct or select a symbolic comparison strategy:** use a concise explicit
  strategy task or begin symbolically with requested assistance. Do not make the
  representation awkward merely to force an algorithm the task has not named.

Priority corrections before packet drafting:

1. Strategy, support and representation are separate design dimensions, not one
   Low/Medium/High ladder. More forced conversion is not automatically more help.
2. Shared numerator 15 produces denominators 25 and 27 for3/5 versus5/9. It is not
   a15-part model. A half benchmark alone cannot order two values above half.
3. H2 does not prevent visual comparison, and its claimed zero confusion risk is
   unsupported. H1's benefit and complement risk both remain hypotheses.
4. Distinguish unordered distance `max(a,b)-min(a,b)` from ordered `a-b` and from
   wording that already presupposes which operand is larger.
5. Do not solve a three-option guessing risk with compulsory extra episodes,
   performance-driven support changes or an unrecorded strategy restriction.

## 2. Fact-check: code, mathematics and research

### Actual capabilities and missing work

Read-only source inspection confirms:

| Area | Exists | Not established by that capability |
|---|---|---|
| `src/math/fraction.js` | BigInt exact `compareFractions`, `equalFractions`, `benchmarkFraction`, `compareToBenchmark`, LCD/scaling/conversion primitives | An instructional strategy chooser, comparison task or visual-capacity policy |
| `src/math/classify.js` | `classifyMagnitude` against useful benchmarks | A general closeness metric or automatic proof strategy |
| `src/math/mixed-number.js` | Exact mixed/improper conversions and `compareMixedNumbers` | Mixed-number comparison episode, accessible UI or unrestricted multi-whole representation |
| `src/interaction/support.js` | Six existing support dimensions | A comparison-strategy dimension, reachable Low support or permission to change support mid-episode |
| Content, episode definitions, schedule, replay, scene, render | Existing exact authored addition/subtraction mechanisms and explicit capability boundaries | Registered magnitude records/admission, `< = >` response grammar, comparison schedule, strategy provenance or comparison replay contract |

An existing renderer called comparison can mean before/after equivalence, not a
magnitude episode. Decide/transform code is useful precedent, not a drop-in new
workflow. Pure core comparison already determines the relation without requiring
common-denominator construction by the learner. Keeping a private expected
relation in instructional state is appropriate; projecting which option is correct
before the response is not. Candidate relation labels and source fraction data
must remain available. Client-side bundles cannot be made into secret answer keys;
the invariant is ordinary learner-visible/accessibility leakage, not obfuscation.

### Exact strategy checks

| Case | Exact reasoning | Limit or correction |
|---|---|---|
| Same denominator 3/8 vs 5/8 | Same-sized units; compare counts | Count is meaningful only with common whole/unit |
| Same positive numerator 3/5 vs 3/7 | Equal counts; fifths are larger than sevenths | With numerator 0 both amounts are zero; the strict inverse rule needs positivity |
|3/8 vs5/9 |3/8 <1/2 <5/9 | A shared separating benchmark settles this pair without LCD 72 |
|3/5 vs5/9 |27/45 >25/45; alternatively15/25 >15/27 | Common numerator 15 needs25/27 partitions, not15; within ceiling 30 is not proof of readability |
| Same pair, excess over half |1/10 >1/18, hence3/5 >5/9 | Merely saying both exceed half does not order them |
|4/5 vs7/8 | Missing amounts1/5 >1/8, so4/5 <7/8 | Reverse the residual order; do not compare missing-piece counts without size |

These are exact deductions, not learner-observation findings. The notes' core
numerical examples are sound; the attached mandate's15-part inference is not.
Common-denominator and same-denominator comparison overlap conceptually. Call the
five listed approaches a useful authoring taxonomy, not the unique five strategies
established by all the named research traditions.

### Research strength and boundaries

- The [IES/WWC fractions practice guide](https://ies.ed.gov/ncee/WWC/PracticeGuide/15/Published)
  recommends number lines as a central representational tool and rates its broader
  fractions-as-numbers recommendation moderate evidence. This supports magnitude
  work; it does not validate H1/H2/H3 or this app's support progression.
- [Gunderson et al. (2019)](https://pubmed.ncbi.nlm.nih.gov/31374537/) randomly
  assigned 148 second/third graders to brief training conditions. Its preregistered
  results favored a thin horizontal number-line condition over square area and
  square number-line conditions for subsequent magnitude comparison. Pure-line
  benefits also appeared in an exploratory fidelity analysis. This is not proof
  that any line beats a one-dimensional fraction bar, nor a test of reversed bars.
- [Clarke and Roche (2009)](https://doi.org/10.1007/s10649-009-9198-9) examined
  sixth-graders' comparison strategies; benchmark/residual thinking distinguished
  successful reasoning, and same-numerator cases could be difficult. This is
  descriptive strategy evidence, not a causal evaluation of this proposed sequence.
  The publisher full text was not retrieved here; this assessment uses the
  research child's source inspection and available study metadata. Do not claim
  its detailed coding scheme was independently reproduced.
- [Braithwaite and Siegler (2018)](https://pubmed.ncbi.nlm.nih.gov/28229555/)
  supports concern about whole-number-biased fraction reasoning, with developmental
  and task differences. Do not treat a single wrong click as diagnosis of that bias.

No direct primary evidence was located establishing that H1 causes complement
errors or prevents shortcutting, or that H2/H3 improve learning. Those remain
specific design hypotheses. The proposal's 'makes the learner want a common unit',
'zero risk' and 'satisfying reveal' claims need hypothesis language. Do not infer
motivation, engagement or durable transfer from an attractive transition.

## 3. Representations and the support proposal

| Option | What is mathematically honest | Main concern | Recommendation |
|---|---|---|---|
| Aligned normal bars/common line | Stable unit, direct magnitude correspondence | May not establish symbolic strategy use | Keep as default for a model-reading comparison task; don't call intended perception cheating |
| H1 opposite-origin shading | Shaded length remains the stated fraction if wholes match | From the left, the reversed boundary is at1-x. It changes the reading convention; conversion alone does not remove that difference | Optional bounded hypothesis test only. Restore a consistent convention for final comparison; no default rollout |
| H2 offset normal bars | Equal whole widths and truthful lengths can be preserved | Relative lengths remain visible without common origins; displacement creates extra comparison effort rather than proof of reasoning | Describe as reduced alignment cue, not withheld magnitude. Remove zero-risk claim. Prefer static optional alignment to a new required animation |
| H3 unit template/one anchor | Can model the unit without revealing a second fill | Missing shading can read as zero, and one anchor is not a complete visual comparison | Explicitly identify the second quantity as not yet represented, retain its symbolic value, and use only when unit construction is the target |

Neither H1 nor H2 guarantees hidden magnitude. Equal wholes must stay honest;
unequal wholes are unsuitable if the task compares quantities in the same unit.
Discrete circles are not intrinsically invalid fraction models: differently sized
sets can represent proportions, but fixed-size pieces from different totals do
not provide a valid direct same-whole quantity comparison. Reject that proposed
use, not every discrete-set representation.

Recommend two initially bounded task recipes: direct model-based relation and
symbolic relation with requested reasoning assistance. A common-unit construction
recipe can follow when explicitly useful. Do not make a high-support episode
longer solely because the label says high. Medium one-anchor and Low symbolic are
plausible alternatives, not demonstrated points on a validated fading scale.
Only high/medium are currently reachable through registered controls; Low needs
its own configuration and agency contract if ever made reachable. No global
support writer or automatic fading is authorized by these notes.

The opposite-origin complement question is especially a task-validity concern:
correct value with a reversed fill is mathematically valid, but observed errors
could reflect the new graphic convention rather than fraction understanding.
Screen readers need not simulate an avoidable visual obstacle to make that fair.

## 4. Recipes, strategy diversity and subtraction

Use a compact authored comparison record with stable item/source identities,
recipe/strategy-purpose identity, permitted representation/capacity and registered
configuration. Derive relation, common-unit witnesses and benchmark/residual facts
through exact APIs; never author the expected answer twice. Choose a recipe before
responses and freeze its schedule under DECISION-034. Do not build a universal
strategy planner or force all five strategies into one episode.

Useful separate purposes:

- **Compare magnitudes:** show two amounts and ask one relation question. Correct
  model reading counts as mathematical work; an optional explanation is not a
  second mandatory assessment.
- **Compare using a named structure:** same denominator, same positive numerator,
  or a separating benchmark. Select a small batch where that structure genuinely
  resolves the comparison; include its boundary counterexamples in validation.
- **Construct common units to justify comparison:** learner supplies meaningful
  equivalent forms, then compares; use legible targets and omit irrelevant steps.
- **Choose a useful method:** a later strategy-selection recipe where multiple
  methods are valid, with task adherence separate from mathematical correctness.

For 3/5 vs 5/9, benchmark excess or common numerator is a legitimate alternative
to 45ths. Do not mark a correct relation wrong because a learner chose another
valid strategy, unless the explicit task is practicing a named method; even then
separate incomplete task evidence from mathematical error. Close fractions do
not universally require LCD. A sparse line can avoid drawing 45 ticks, but very
close coordinates can still collide on a finite display; larger denominator
support requires geometric evidence, not a claim of arbitrary line capacity.

### Comparison-to-difference bridge

For an unordered pair, neutral wording is **How far apart are these amounts?**
Compare if needed, establish order, then compute `max(a,b)-min(a,b)` using exact
nonnegative subtraction. Include equality: gap zero, neither amount is larger.
Preserve original A/B labels while showing the selected subtraction order; do not
silently swap operands in the learner's original expression.

**How much greater is A than B?** already presupposes an order. It is not equivalent
to an unordered absolute difference when A<B. Ordered A-B must not silently become
its absolute value. Signed subtraction is a future extension: the current exact
fraction subtraction rejects negative outcomes, so a negative-result task needs
an explicit signed-number/domain contract, not merely different copy.

A compare-then-gap recipe can have one compare response and one numerical gap
response, with a short finish. Do not append it to every comparison. Standalone
magnitude is useful first, but a separate `< = >` screen is not mathematically
required whenever subtraction already has an appropriate order. Sequence by the
learning purpose rather than claiming a universal prerequisite.

## 5. Accessibility, recovery and broader number types

Accessible source descriptions must give the same mathematical data as sighted
models: named A/B fractions, shared reference whole, partition/shading or exact
position context as appropriate. Speaking 'two thirds' is not leaking the answer
to 'compare two thirds and three fifths'; announcing 'A is greater' is. Do not
hide source numerators, denominator units or one operand from assistive technology.
Do not reduce the linear task to ambiguous three-bucket position descriptions.

Use a native relation group and explicit Check with preview selection ungraded.
Name options as complete comparisons ('first fraction is less than the second',
'equal to', 'greater than') so isolated symbols do not depend on visual orientation.
Preserve selections, requested help and recovery through view changes; keep one
visible question, intrinsic stacked fractions and concise, distinct error copy.

Three choices cannot prevent guessing absolutely. Include true equality cases,
left/right reversals, common-component and non-common-component pairs, and
counterexamples to superficial numerator/denominator cues. Never disable a
remaining choice to manufacture success. Record first/subsequent submitted
attempts and actual assistance locally in existing provenance, not as mastery
claims or new telemetry. Use specific non-answer-bearing recovery and opt-in
help; no lockouts, timers, obligatory prose explanations or punitive input burden.
A branch after error must be authored recovery within the fixed task, not a
silently revised schedule/support level. Route to another recipe only through
an explicit approved learner choice/configuration contract.

For improper/mixed numbers, first compare whole-number parts; when equal, compare
fractional remainders. Derive all conversions via the exact core and preserve
source forms. A `[0,1]` line is not enough. Use equal-scale multi-whole stacks or
a bounded line domain that covers both quantities. Do not independently stretch
each operand to its own full width. Multiple same-scale bars can still compare
improper lengths; the issue is capacity and convention, not that reversed shading
is mathematically defined only below 1. Mixed notation must use unambiguous whole
plus stacked fractional part, with equivalent accessible names. Neither the
existing core nor Plan 17 proves a full mixed comparison task or `[0,2+]` line UI.

## 6. Recommended sequence and concrete decisions

Preserve the current Plan 40 -> §31/§90 disposition -> Plan 39 implementation
boundary. Plan 39 is now draft with a Plan 40 dependency; the earlier sequence drift
has been corrected in current packet metadata. Preparatory magnitude research can
run concurrently as read-only design, but does not authorize a second source writer
or move number-line activation ahead of those gates.

Afterward, prefer:

1. **One bounded comparison design packet:** define the initial purpose, response,
   accessibility and small rival representation set. Choose one principal strategy
   family, compare a direct honest-model baseline against symbolic/requested-help,
   and retain H1 as an optional falsifiable experiment rather than a prerequisite.
2. **One proper-fraction vertical slice and varied compact batch:** initially use
   existing high/medium only, unless a separate Low activation contract is adopted.
   Include `<`, `=`, `>` and swapped operands. Reuse exact comparison and compact
   authoring, but implement explicit admission/scene/replay and accessible control
   contracts. Avoid a Cartesian family-by-strategy-by-support rollout.
3. **A separate compare-and-gap recipe:** reuse the accepted comparison response
   and subtraction meaning when useful; validate unordered order/zero explicitly.
4. **Later improper/mixed expansion:** separate representation/domain/admission
   decisions and multi-whole bridge evidence; no implied current authority.

The first investigation should settle: is the target model reading, symbolic
reasoning, a named comparison method, or flexible method selection? Which source
information is available in each view? What does help add? What constitutes an
acceptable response versus strategy evidence? Which fraction/geometry bounds are
admitted? These answers should precede animation, a new Low profile or an elaborate
anti-guessing mechanism.

For an eventual empirical H1/H2/H3 comparison, use matched values/whole sizes,
balanced relation directions and equal cases; observe graphic interpretation,
strategy explanation, corrections, response burden and transfer to ordinary bars
or symbols. Faster correct clicking alone does not establish unit reasoning.
No learner study, data collection or efficacy claim is authorized here.

## Review procedure and limits

Inspected the primary notes, named packets, project seed, relevant founding
sections and live math/content/interaction/render seams. Two cold-context
Luna-medium default-role children performed read-only research and source/math
fact-checking; neither wrote files or launched children. Parent checked core
claims and primary-source abstracts/official guidance, and ran one inline,
read-only Node probe of the existing exact APIs: common-numerator25/27 conversion,
LCD45, both inputs above half, residual order, separating benchmark, complement
comparison and negative-subtraction rejection all passed. No probe file was made.
No full-text systematic
literature review, new learner observation, product tests/builds/routes, browser
captures or source edits were undertaken. Findings distinguish direct code facts,
exact deductions, research findings and design hypotheses. Another Plan 40 writer
is active; only this review file is authored/staged/committed. Requested models
and effort are recorded; runtime identity and comparative cost were not verified.
