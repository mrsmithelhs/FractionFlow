# Purposeful episode task variation — initial research and design brief

Date: 2026-10-09. Owner-requested investigation; research/design proposals below
are not source approval, an adaptive policy, learner-study authorization or an
efficacy claim. DECISION-041's authored-set/Next contract remains separate.

## Finding

There is grounded support for varying relevant mathematical comparisons, strategy
selection and guidance. Direct fraction studies also show that trained success can
fail to transfer. Evidence for long-term engagement from task-format variety is
weaker than evidence for particular learning mechanisms. None of the reviewed
studies tests FractionFlow's precise combination of mutable episode components,
fixed mathematical invariants and familiar interface. Treat that combination as a
design hypothesis. This is a bounded initial literature review, not a systematic
review or exhaustive estimate of effects across learners.

## Evidence inspected

Read-only researcher collected primary sources; orchestration independently checked
load-bearing findings through university manuscripts, publisher abstracts and
author-provided abstracts in ERIC. Full-text availability varies as stated below.
No learner data or observations were collected.

| Primary source | Population, mechanism and reported outcome | Applicability and limit |
|---|---|---|
| Rittle-Johnson & Star (2009), *Compared to what? The effects of different comparisons on conceptual knowledge and procedural flexibility for equation solving.* [Harvard abstract/manuscript](https://dash.harvard.edu/entities/publication/73120378-9609-6bd4-e053-0100007fdf3b) | 162 grade 7/8 students compared equivalent problems, different problem types or different methods for the same equation. Method comparison best supported conceptual knowledge and procedural flexibility; problem-type comparison also helped. | Supports explicitly comparing relevant mathematical features. Algebra, not fractions; exposure to different widgets does not reproduce the studied mechanism. Root checked the university abstract; no engagement claim. |
| Rohrer, Dedrick, Hartwig & Cheung (2020), *A randomized controlled trial of interleaved mathematics practice.* [Author manuscript](https://uweb.cas.usf.edu/~drohrer/pdfs/Rohrer_et_al_2020JEdPsych.pdf), [accessible submitted manuscript](https://files.eric.ed.gov/fulltext/ED595322.pdf) | Preregistered cluster trial in 54 seventh-grade classes, with periodic assignments over four months. Interleaved practice required selecting strategies from problems. An unannounced test one month later favored interleaving: 61% versus 38%, reported d = 0.83. | Evidence for delayed performance in the tested mathematics, not arbitrary within-episode task changes, far transfer or learner engagement. Root verified the author-provided result and accessible full-text availability. This is not permission to add Phase 7 scheduling. |
| Hamdan & Gunderson (2017), *The Number Line Is a Critical Spatial-Numerical Representation: Evidence From a Fraction Intervention.* [Temple manuscript](https://sites.temple.edu/cognitionlearning/files/2017/05/Hamdan-Gunderson-2017.pdf), [author-provided ERIC abstract](https://eric.ed.gov/?id=EJ1131166) | Second- and third-graders received number-line, area-model or nonnumerical training. Both mathematical groups improved on their trained representation; only number-line training transferred to an untrained fraction magnitude comparison. | Direct fraction evidence, but magnitude transfer does not establish arithmetic transfer or make representations interchangeable. Root verified indexed manuscript/abstract; direct PDF fetch timed out. Number-line activation retains its existing roadmap gate. |
| Nuraydin, Stricker & Schneider (2022), *No transfer effect of a fraction number line game on fraction understanding or fraction arithmetic: A randomized controlled trial.* [Trier full text](https://www.uni-trier.de/fileadmin/fb1/prof/PSY/PAE/Team/Schneider/NuraydinEtAl2022_FractionGame.pdf) | 188 grade 5–8 students played a number-line game, scaffolded game or active control. Grade 5/6 gains on trained 0–1 estimation did not transfer to 0–5 estimation, fraction comparison or arithmetic; grade 7/8 showed no effects. | A discriminating counterexample to equating episode success with transfer. Feedback without direct fraction instruction differs from richer instruction. Root checked full-text abstract and discussion; gameplay alone does not establish engagement. |
| Reisslein, Sullivan & Reisslein (2007), *Learner Achievement and Attitudes under Different Paces of Transitioning to Independent Problem Solving.* [Publisher abstract](https://onlinelibrary.wiley.com/doi/abs/10.1002/j.2168-9830.2007.tb00914.x) | Engineering freshmen learned circuit analysis. Retention depended on prior knowledge: low-knowledge learners benefited from slow fading; high-knowledge learners from faster or immediate transition. | Supports investigating guidance matched to readiness. Adult engineering evidence cannot specify a fraction fading policy. Root verified publisher abstract only; attitude outcomes were not established by the inspected text. |
| Høgheim & Reber (2015), *Supporting interest of middle school students in mathematics through context personalization and example choice.* [Publisher abstract](https://www.sciencedirect.com/science/article/pii/S0361476X15000120) | 736 middle-school students learned probability. Context personalization and example choice improved situational interest for learners with low initial interest; effects depended on interest/competence. No performance effect was reported. | Engagement evidence concerns contextual choice, not interchangeable episode tasks. Sustained voluntary return and long-term engagement were not established. Root verified the indexed publisher abstract; live fetch was blocked, so full methods/subgroup estimates remain unreviewed. |

## Existing roadmap fit

- [Principle 8](../../docs/founding/00-principles.md#8-repetition-should-create-familiarity-variation-should-create-thought)
  expressly combines a familiar interaction grammar with meaningful variation.
  Variation in values, denominator relationships, operations, renaming, whole
  crossing, representation transfer and scaffolding is already intended. Interface
  novelty is not itself the objective.
- Roadmap [§28](../../docs/founding/06-roadmap.md#28-phase-3-focused-concept-episodes)
  names different learner decisions: construct equivalence, find a valid/least
  denominator, identify the operand needing renaming, predict crossing one and
  simplify. [§30](../../docs/founding/06-roadmap.md#30-phase-3-content-variety)
  separately concerns numerical/structural content variety. The new question asks
  how those learner responsibilities can vary purposefully within or across tasks.
- The instructional model's representation-transfer discussion requires active
  correspondence; simultaneous pictures or a transition do not establish transfer.
  Its §30 puts interleaving after initial stability. The [Phase 3 exit gate](../../docs/founding/06-roadmap.md#31-phase-3-exit-gate)
  already asks which interactions generalize and which prompts become repetitive.
- Number-line bridges remain Phase 4; evidence-driven fading remains Phase 6;
  session composition/interleaving/retrieval remains Phase 7. This research does
  not move those implementation gates forward.

## Design inference: preserve meaning and grammar, vary responsibility

Keep exact mathematical truth, amount preservation, common-unit validity and
answer classification invariant. Keep familiar fraction notation, control styles,
help placement, submission/recovery conventions and participation alternatives.
Do not require every episode to repeat every decision: like-denominator addition
does not need a decorative conversion; DECISION-039's reflection omission remains
intentional. A new task should add a necessary learning action, not extra prose.

Select an authored task/definition before constructing the episode, then freeze
its schedule. Current definitions are not a general library of interchangeable
tasks. New response types, diagnosis/prediction semantics or schedules need explicit
definition, answer, recovery, identity/replay and leakage contracts before source
work. Do not randomize beats, infer a new schedule from errors, or introduce an
adaptive policy by calling it variety.

Illustrative candidates for later design review, not approved learner tasks:

| Candidate | Intended reasoning | What must not substitute for that reasoning |
|---|---|---|
| Construct `2/3 = ?/12` | Preserve amount while changing the unit | Showing the completed shaded/numeric answer first |
| Judge and repair `2/3 → 7/12` | Detect a transformation that changes amount, then construct a valid form | A predictable yes/no answer or a helper that supplies the repair |
| Compare 12 and 24 as common units for `2/3 + 1/4` | Distinguish validity from efficiency/leastness | Marking a valid non-least unit wrong; requiring a written essay |
| Choose which operand needs renaming for `1/2 + 3/8` | Recognize the available common unit and unnecessary work | Forcing two conversions just to repeat the canonical arc |
| Predict whether an authored sum exceeds one | Use magnitude before calculating | Showing a countable combined result before the prediction |

These are alternatives to evaluate, not requirements to put every task into every
episode. The first investigation should use the familiar bar/symbolic language,
one concise question at a time and existing input/choice conventions. Design a
small progression from supported construction to purposeful comparison/diagnosis
and an independent check. Its exact order and frequency are proposals, not a
universal prescription derived from the studies above.

## Bounded next design checkpoint and falsification

Begin a docs-only task-variant design now; bring the recommended small set to owner
review before a focused-concept implementation or the Phase 3 exit gate. It need
not delay Plan 26. For each variant record target concept, prerequisites, changed
learner responsibility, invariant context, concise prompt, response/recovery,
answer withholding, assistance provenance, authored coverage and replay boundary.
Separate a task variant from changing numbers, reducing support or adding a
foundational representation. OQ-28 and the follow-up register retain this obligation.

Any later evaluation proposal should distinguish these rival explanations:

| Claim | Discriminating observation to propose at a separately authorized evaluation gate |
|---|---|
| The learner learned equivalence rather than a cue/answer pattern | Unseen numbers and reversed operand order, with help/answer cues withheld |
| Comparison builds strategy flexibility | Learner selects a valid strategy in a new case where alternatives differ in suitability |
| Representation transfer occurred | An untrained representation/response task with explicit source/target correspondence; changed numbers alone are insufficient |
| Interest increased rather than only novelty or extra clicks | Learner-reported interest/frustration and willingness to continue after familiarity, considered separately from achievement |
| Variety suits learner needs rather than adding load | Review prerequisite knowledge, reading/control burden and usable recovery; compare supported and independent work without imposing universal fading |

These are proposed evidence designs, not experiments conducted or authorized here.
Technical routes can prove answer withholding, exact classification, agency,
focus and reset; they cannot prove learning, transfer or engagement. Any participant
work requires a separate owner decision and privacy review; never commit learner
data or introduce tracking. No source, learner study, push or deployment occurred.

Advisor declaration: consultation not warranted for this docs-only research and
planning record. Read-only research and roadmap agents informed it; their results
were checked against primary sources and current founding documents. Remaining
uncertainty is explicitly preserved rather than converted into product efficacy.
