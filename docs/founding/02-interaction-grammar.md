# Interaction Grammar

## Purpose

FractionFlow should feel like a coherent mathematical environment rather than a collection of unrelated activities.

This document defines the recurring interaction patterns through which learners encounter problems, make decisions, receive feedback, move between representations, request support, and gradually work more independently.

Its purpose is to establish a small, reusable instructional grammar.

That grammar should be:

- predictable enough to reduce cognitive load;
- flexible enough to support different problem families;
- visually restrained;
- mathematically expressive;
- capable of fading as learners gain fluency.

This document owns the question:

> How should a FractionFlow learning episode behave and feel?

It does **not** define:

- mathematical truth or problem-generation rules;
- exact learning objectives;
- technical state structures;
- software architecture;
- test implementation;
- roadmap sequencing.

Those belong to other founding documents.

---

# 1. The Unit of Experience Is an Episode

The basic unit of interaction is a **learning episode**.

An episode is a short mathematical narrative centered on one problem, one conceptual comparison, or one transfer task.

An episode should feel complete enough to have a beginning, development, and resolution.

Typical episodes may involve:

- solving a fraction operation;
- constructing an equivalent fraction;
- choosing a common unit;
- predicting a transformation;
- translating between representations;
- checking the reasonableness of an answer.

An episode should not feel like a form with many fields to complete.

The learner should experience:

> one mathematical situation unfolding over time.

---

# 2. Episodes Have a Small Number of Narrative Beats

Most episodes should be composed from a small shared vocabulary of beats.

Not every episode needs every beat.

The canonical sequence is:

1. **Encounter**
2. **Notice**
3. **Decide**
4. **Transform**
5. **Operate**
6. **Resolve**
7. **Reflect**
8. **Continue**

These are conceptual roles, not necessarily visible labels.

---

# 3. Encounter

The learner first sees the mathematical situation in its simplest useful form.

The opening should establish:

- the problem;
- the relevant quantities;
- the current representation;
- the immediate task.

Avoid introducing all future steps at once.

For example, an unlike-denominator addition problem should not initially present:

- the original fractions;
- equivalent fractions;
- common-denominator controls;
- result boxes;
- a second representation;
- hints;
- simplification controls;

all simultaneously.

The learner should meet the problem before meeting the procedure.

---

# 4. Notice

Some episodes should pause before computation and invite the learner to identify something important.

Examples:

- Are these units already the same size?
- Will both fractions need to change?
- Is the answer likely to be greater than one?
- Will regrouping be necessary?
- Do these two forms represent the same amount?
- Which denominator could describe both quantities?

The purpose of the Notice beat is to direct attention.

It should be brief.

It should not become a recurring quiz ritual when no meaningful noticing is needed.

---

# 5. Decide

A learner should make the mathematical decision that matters before the system demonstrates its consequence whenever practical.

Possible decisions include:

- choosing a common denominator;
- supplying a scale factor;
- predicting an equivalent numerator;
- identifying whether regrouping is needed;
- selecting a valid comparison;
- estimating a result range;
- choosing where a fraction belongs on a number line.

The system should not perform a target reasoning step automatically and then ask the learner to repeat it symbolically afterward.

If a decision is instructional, the learner should ordinarily own it.

---

# 6. Transform

A transformation should make the consequence of the learner's reasoning visible.

Examples:

- a bar subdivides;
- number-line intervals refine;
- equivalent-fraction labels update;
- one whole decomposes into fractional units;
- pieces regroup into a whole;
- a visual quantity changes representation without changing value.

The Transform beat is one of FractionFlow's defining interaction patterns.

It should communicate:

> your mathematical choice caused this mathematically meaningful change.

Transformation should not feel like arbitrary interface movement.

---

# 7. Operate

Once quantities are in an appropriate form, the learner performs the operation.

This may involve:

- adding unit counts;
- subtracting unit counts;
- combining whole and fractional parts;
- removing fractional units;
- simplifying;
- locating a result.

At this stage, unnecessary scaffolding should not continue to explain earlier ideas unless the learner needs it.

For example, after both fractions have valid common denominators, the interface should not keep emphasizing how equivalence was achieved while the learner is simply adding numerators.

The focus should advance.

---

# 8. Resolve

The mathematical episode should visibly settle into its result.

Resolution may involve:

- combining visual pieces into a final quantity;
- arriving at a destination on the number line;
- composing fractional units into a whole;
- simplifying a fraction;
- allowing the symbolic result to become visually prominent.

The resolved state should remain inspectable.

Avoid immediately replacing it with the next problem.

The learner should have a brief sense of:

> that is what happened.

---

# 9. Reflect

Reflection should be selective.

Useful reflection prompts include:

- Did the amount change when the fraction was renamed?
- Was your answer larger or smaller than one?
- Why did the denominator stay the same during the final addition?
- Could another common denominator also have worked?
- Where would this answer fall on a number line?
- Did you need the visual this time?

Reflection should not occur after every problem.

It should be used when it reinforces a concept, supports transfer, or helps consolidate a newly introduced structure.

The system should avoid turning successful practice into a sequence of mandatory explanation questions.

---

# 10. Continue

Moving to the next episode should be simple and calm.

The learner should not encounter an elaborate result screen after every item.

Useful possibilities include:

- a brief acknowledgement;
- a next-problem action;
- a small indication that support has decreased or difficulty has changed;
- a transition into a bridge episode.

Progression should feel continuous.

---

# 11. One Primary Mathematical Action at a Time

At each moment, one action should be visually and instructionally primary.

Examples:

- choose a common unit;
- enter the equivalent numerator;
- predict whether the point moves;
- combine the units;
- simplify the result.

Secondary views and actions such as:

- requesting help;
- changing representation;
- replaying a transformation;

may remain available when they serve the current comparison and do not create a competing task, but they should not compete visually with the primary task.

If the screen contains five equally prominent controls, the interaction grammar has failed.

---

# 12. The Current Question Should Be Obvious

The learner should rarely need to determine what the software wants.

The interface should make the current task clear through:

- placement;
- visual emphasis;
- concise language;
- available actions.

Prompt language should ordinarily be short enough to read at a glance.

Prefer:

> What denominator could both use?

over:

> Determine the least common denominator necessary to rewrite the following two fractions as equivalent fractions with matching denominators.

Precision matters, but verbosity is not precision.

---

# 13. Prompt Language Should Be Authored and Limited

Core instructional language should come from vetted prompt families.

Variation is useful when it prevents mechanical reading, but wording should not vary so widely that each problem feels linguistically unfamiliar.

For a given instructional intent, maintain a small set of reviewed phrasings.

For example, a common-unit prompt might vary among:

- What denominator could both fractions use?
- What size pieces could both amounts use?
- Choose a denominator that works for both.

These phrases are related but emphasize slightly different interpretations.

Language variation should be purposeful, not random decoration.

---

# 14. Mathematical Language Should Mature With the Learner

Early instructional language may emphasize meaning:

- same-sized pieces;
- rename;
- same amount;
- common unit.

Later language may increasingly use conventional terminology:

- equivalent fractions;
- common denominator;
- least common denominator;
- improper fraction;
- simplify;
- regroup.

The system should help learners connect intuitive meaning to formal vocabulary rather than permanently avoiding mathematical terminology.

---

# 15. Representations Should Behave Like Views of Shared State

When the learner changes representation, the problem should not restart.

A representation switch should preserve:

- the same quantities;
- completed reasoning;
- current progress;
- relevant learner decisions;
- the current mathematical state.

For example, if a learner has already established:

\[
\frac23=\frac8{12},
\]

switching from a bar to a number line should show the same equivalence, not return to the original unsolved state unless that reset is instructionally intentional.

Representations are different views of the same mathematics.

---

# 16. Representation Changes Should Be Rare Enough to Matter

FractionFlow should not switch representations merely for variety.

Most episodes should remain in one primary representation.

Representation changes should generally occur because:

- a new representation exposes an important idea;
- the learner requests another view;
- a bridge episode is intentionally testing transfer;
- the current representation has served its purpose.

The learner should experience representation changes as meaningful events rather than constant UI churn.

---

# 17. Prefer Transformation Over Replacement

When two representations have a meaningful structural relationship, prefer a visible transformation.

Examples:

- a bar becoming a number-line interval;
- subdivisions becoming tick marks;
- a selected endpoint becoming a number-line point;
- repeated fractional pieces regrouping into a whole;
- a model receding while its symbolic expression remains.

Hard cuts are appropriate when the relationship would be misleading or difficult to show clearly.

Animation should never imply a mathematical equivalence that is not actually present.

---

# 18. Maintain Visual Anchors During Transformation

Whenever possible, something should stay fixed while another feature changes.

Useful anchors include:

- total length;
- endpoint position;
- location relative to zero and one;
- the boundaries of one whole;
- the quantity already selected.

These anchors help learners perceive invariance.

For equivalent fractions, particularly valuable anchors are:

- the same total length;
- the same shaded extent;
- the same number-line position.

---

# 19. Symbolic Notation Should Participate in the Narrative

Symbolic notation should not live in a separate answer panel disconnected from the visualization.

When possible, symbols should remain spatially or conceptually associated with what they describe.

Examples:

- a fraction label associated with its bar;
- a fraction label associated with a number-line point;
- an equivalent symbolic form changing as subdivision occurs;
- an equation becoming simpler as a visual operation resolves.

Symbols should gradually become more prominent as visual support fades.

The learner should experience visual and symbolic forms as connected descriptions of the same mathematics.

---

# 20. The System Should Sometimes Become Quiet

If a learner can perform a step independently, the interface should permit that step to happen without unnecessary narration.

A mature interaction may simply show:

\[
\frac23+\frac14
\]

and allow the learner to work.

The full narrative grammar remains available underneath, but does not need to announce itself.

The most advanced form of FractionFlow may look visually simpler than the introductory form.

---

# 21. Scaffolding Is a Set of Independent Supports

The Interaction Grammar is the canonical owner of the names and operational examples for episode support dimensions and support levels. Its support dimensions are independent axes; a level label is a concise description of the current combination, not a single global difficulty setting. The canonical labels for this document are **high support**, **medium support**, **low support**, and **independent**.

Other founding documents should use these labels when referring to an episode's support state. The Instructional Model owns the learner-facing meaning of evidence and growing independence; it may describe a continuum from supported construction through prediction and independent transfer, but it should not redefine these level names. The Roadmap owns when support capability is built, and Quality and Validation owns how support behavior and leakage are tested. None of these mappings creates a new instructional stage or implies that every learner moves through the labels in a fixed order.

Scaffolding should not be implemented as a single linear setting such as:

- easy;
- medium;
- hard.

Supports should be conceptually separable.

Examples include:

- showing or hiding a model;
- offering denominator choices;
- asking for a common denominator;
- supplying a scale factor;
- asking for a scale factor;
- supplying an equivalent numerator;
- showing a transformation automatically;
- requiring a prediction first;
- offering estimation prompts;
- revealing intermediate symbolic forms;
- allowing hints;
- automatically prompting simplification.

Different learners may need different supports for different problem structures.

---

# 22. Support Should Fade Within Familiar Interaction Patterns

Removing support should not mean replacing the interaction with a new interface.

Instead, familiar episodes should become progressively leaner.

For example:

### High support

The learner chooses a common denominator from options and watches the model subdivide.

### Medium support

The learner supplies the common denominator and equivalent numerators.

### Low support

The learner solves symbolically, with the model available only if requested.

### Independent

The learner solves without visible support.

The underlying mathematical episode remains recognizable throughout.

An `independent` support configuration does not by itself establish `independent transfer`; response provenance and task change still determine the evidence category.

---

# 23. Requested Help Should Preserve Agency

When a learner asks for help, the system should avoid immediately solving the entire problem.

Help should ordinarily reveal the smallest useful next support.

A possible progression is:

1. draw attention to the relevant issue;
2. offer a more concrete representation;
3. narrow the possible choices;
4. demonstrate one transformation;
5. provide a worked step only when needed.

A learner should often be able to resume control after one hint.

---

# 24. Help Should Not Punish the Learner

Requesting support should not:

- reduce a score in a dramatic way;
- trigger shame-oriented language;
- mark the learner as failing;
- produce excessive warning colors;
- block progress unnecessarily.

The system should treat support as part of learning.

---

# 25. Errors Should Interrupt Locally

When an error occurs, the interaction should respond near the point of failure.

If the learner enters an incorrect equivalent numerator, feedback should focus there.

The episode should not collapse into a generic:

> Incorrect. Try again.

Nor should it immediately reset the entire problem.

Preserve successful prior steps whenever possible.

---

# 26. Correct Work Should Stay Correct

Once a learner has correctly completed a meaningful step, later mistakes should not erase that achievement unless mathematical dependencies require it.

For example, if the learner correctly identifies 12 as a common denominator, that fact should remain established even if the subsequent numerator conversion is incorrect.

This preserves the narrative of reasoning.

It also helps feedback target the actual misconception.

---

# 27. Feedback Should Be Proportional

Not every correct response requires celebration.

Useful positive feedback may be:

- the mathematical transformation itself;
- a subtle confirmation;
- successful continuation;
- a short acknowledgement.

Reserve stronger celebration for meaningful milestones rather than every numerator addition.

The learner should come to experience mathematical resolution itself as satisfying.

---

# 28. Failure States Should Remain Calm

Incorrect responses should not cause:

- shaking interfaces;
- loud negative sounds;
- red-screen states;
- disappearing work;
- mocking language;
- exaggerated emotional feedback.

A wrong answer is part of the mathematical conversation.

Visual feedback may clearly indicate a mismatch without turning it into a performance event.

---

# 29. Prediction Should Precede Demonstration When It Matters

For key concepts, the learner should often predict before seeing the transformation.

Examples:

> Will the amount get larger, smaller, or stay the same?

> If each third is split into four parts, how many pieces will the whole have?

> Will we need to regroup?

The subsequent transformation should then confirm or challenge the prediction.

This pattern should be used selectively for conceptually meaningful moments.

---

# 30. The System Should Not Over-Question

Interaction count is not a measure of instructional quality.

Avoid decomposing a simple problem into so many micro-prompts that the learner becomes a clerk for the software.

For example, an experienced learner should not necessarily be forced through:

1. identify denominator one;
2. identify denominator two;
3. choose common denominator;
4. enter first multiplier;
5. enter second multiplier;
6. enter first numerator;
7. enter second numerator;
8. add numerators;
9. copy denominator;
10. simplify.

A novice may benefit from some of these steps.

A fluent learner should not be trapped by them.

---

# 31. A Step Exists Only If It Carries Learning Value

Before introducing an interactive step, ask:

> What reasoning does this step expose?

If the answer is merely:

> it breaks the algorithm into smaller pieces,

that may not be sufficient.

The step should ideally reveal:

- a decision;
- an invariant;
- a relationship;
- a misconception;
- an efficiency;
- a transfer of understanding.

Purely clerical steps should be combined or omitted where possible.

---

# 32. Bridge Episodes

A bridge episode deliberately connects representations.

Its purpose is not primarily computational practice.

Examples include:

- solving with a bar and then locating the result on a number line;
- watching a bar become a number line and predicting where its endpoint will remain;
- converting a mixed-number visual into symbolic notation;
- starting with symbols and constructing the corresponding visual;
- comparing two representations and identifying which features correspond.

Bridge episodes should be relatively infrequent compared with routine practice.

Their distinctiveness helps make the representation change memorable.

---

# 33. Bridge Episodes Should Preserve the Conceptual Thread

A bridge episode should make the learner's correspondence-making observable and should make explicit what remains invariant.

For example:

> Same amount. New view.

or an equivalent concise cue may orient the learner.

The new representation should inherit enough visual structure from the previous one that the relationship is perceptible.

Bridge episodes should not feel like unrelated bonus activities.

The exact prompt form, timing, frequency, and density remain prototype variables to be tested in the Interaction Grammar and validated against the evidence contract.

---

# 34. Stable Practice Runs

Repeated practice should often occur in short runs with a stable representational language.

A run might contain:

- several bar-based problems;
- a bridge episode;
- several number-line or more symbolic problems.

The exact sequence belongs to instructional progression and roadmap decisions.

The interaction principle is:

> familiarity first, then deliberate variation.

This supports both fluency and transfer.

---

# 35. Variation Should Be Controlled

The system may vary:

- numerical values;
- denominator relationships;
- operation;
- problem structure;
- scaffold level;
- prompt wording;
- representation;
- reflection question.

It should avoid varying all of these simultaneously unless transfer is specifically being assessed.

A learner should usually be able to identify what changed mathematically.

---

# 36. Transition Timing Should Be Deliberate

Mathematically meaningful transformations should be slow enough to perceive and fast enough to avoid impatience.

The goal is not cinematic spectacle.

Timing should support noticing:

- what changed;
- what stayed fixed;
- what the learner caused.

Repeated animations should become more concise when learners no longer need extended observation.

The implementation may eventually tune timing, but the instructional principle is that motion should be legible.

---

# 37. Learners Should Be Able to Inspect the Result

After an important transformation, the final state should remain visible.

Do not depend on the learner remembering a transient animation.

For example, after subdividing thirds into twelfths, the learner should be able to inspect the resulting twelfths before proceeding.

Animations explain transitions.

Static states support reasoning.

Both matter.

---

# 38. Replay Should Be Available for Important Transformations

Some transformations may warrant replay.

Useful candidates include:

- equivalent-fraction subdivision;
- regrouping a whole;
- a representation bridge;
- combination across a whole-number boundary.

Replay should be secondary and unobtrusive.

It should not clutter every routine interaction.

---

# 39. Input Should Match the Mathematical Task

Choose interaction forms based on the reasoning being elicited.

Examples:

### Small constrained choice

Useful for:

- larger / smaller / same;
- regrouping needed / not needed;
- selecting among plausible common denominators.

### Numeric entry

Useful for:

- equivalent numerators;
- denominators;
- arithmetic results.

### Placement

Useful for:

- number-line location;
- ordering.

### Construction or selection

Useful for:

- choosing subdivisions;
- identifying corresponding visual regions.

Interaction should not become elaborate merely because richer mechanics are technically possible.

If a proposed input is mathematically valid but outside the current episode's supported path or the selected representation's reviewed capability, the learner-facing continuation must identify that activity or view boundary rather than report the mathematics as incorrect. Continue, switch, or defer only through a reviewed path; do not silently coerce the value or pass an ineligible state to a renderer.

---

# 40. Dragging Should Be Used Sparingly

Dragging can be satisfying when it directly expresses mathematical structure, such as moving a point or combining pieces.

However, it also introduces motor and accessibility demands.

Important reasoning should not depend exclusively on precision dragging.

When dragging is used, alternative interaction methods should be available.

The project should prefer mathematical clarity over manipulability for its own sake.

---

# 41. Visual Emphasis Should Follow Instructional Attention

Only the mathematically relevant parts of the representation should be strongly emphasized.

If the learner is selecting a common unit, emphasize:

- subdivisions;
- denominator relationships.

If the learner is adding numerators, emphasize:

- selected equal-size units.

If the learner is checking magnitude, emphasize:

- zero;
- one;
- nearby benchmark points.

Visual hierarchy should shift as the mathematical focus shifts.

---

# 42. Previous Information May Recede

Once a step is understood, its details may become visually quieter.

For example:

- conversion multipliers may fade after equivalent fractions are established;
- construction guides may recede after the model is built;
- prompts may disappear once answered;
- visual models may reduce prominence once symbolic work begins.

This keeps attention on the current task while preserving enough context for coherence.

---

# 43. Do Not Build a Persistent History Panel by Default

The learner should not need a dashboard showing every completed step.

The mathematical scene itself should preserve enough history to understand the current state.

If previous steps need to remain inspectable, they should be incorporated into the mathematical narrative rather than stored in a separate audit log.

---

# 44. Symbolic Compression

One recurring narrative pattern should be **compression**.

As understanding develops within an episode:

- a visual transformation establishes meaning;
- intermediate reasoning becomes settled;
- the visual representation becomes quieter;
- symbolic notation carries more of the final state.

This models the transition from concrete reasoning toward efficient mathematical representation.

Compression should not erase meaning prematurely.

---

# 45. Expansion on Demand

The inverse pattern should also exist.

A symbolic problem may expand into a visual representation when the learner requests help or when the system detects a need for more concrete support.

The learner should experience:

> show me what this means

rather than:

> send me to a different lesson.

Expansion should preserve the same problem state.

---

# 46. Representation Requests Should Not Feel Like Failure

A learner may choose:

> Show as a bar.

or:

> Show on a number line.

These actions should be framed as tools for thinking.

An unsupported-but-mathematically-valid state should receive a reviewed continuation rather than an incorrect-answer message.

The system should not signal that a learner has fallen back to a lower mode.

---

# 47. The Representation Selector Should Remain Secondary

If a representation selector exists, it should not dominate the interface.

The system should generally establish an appropriate primary representation.

Learners may have access to alternate views, but FractionFlow should not feel like a graphics editor in which choosing a visualization type is the central task.

---

# 48. Mixed Numbers Should Preserve Whole Boundaries

When mixed numbers are visualized, whole-number boundaries should remain perceptually stable.

An intermediate regrouped state is a learner-established exact transformation; a mixed-number form is a settled representation with a whole-number part and proper fractional part. Regrouping should make visible that:

- one whole is being renamed;
- no quantity is lost;
- no quantity is created.

The visual language should avoid making regrouping appear like digit borrowing.

---

# 49. Crossing a Whole Should Be a Meaningful Moment

When addition produces enough fractional units to form another whole, the interaction should allow the learner to perceive that composition.

For example, eight eighths should visibly constitute one whole.

This should not necessarily become a dramatic event, but it is conceptually important enough to deserve clear representation when scaffolding is active.

---

# 50. Simplification Should Feel Like Renaming, Not Correction

If a learner obtains:

\[
\frac{6}{8},
\]

the system may recognize it as correct before asking whether it can be expressed more simply.

The transition to:

\[
\frac34
\]

should preserve quantity.

Avoid feedback implying that \(6/8\) was numerically wrong.

---

# 51. Hints Should Be Layered

Hints should become progressively more explicit.

A useful conceptual sequence is:

### Orient

Direct attention:

> Look at the size of the pieces.

### Recall

Activate known knowledge:

> What has to be true before we can combine the numerators?

### Constrain

Reduce possibilities:

> Could 6, 8, or 12 work for both?

### Represent

Show or strengthen a model.

### Demonstrate

Reveal a specific transformation.

### Explain

Provide the relevant mathematical reasoning.

The system need not always use all levels.

---

# 52. Hints Should Resume the Episode, Not Replace It

After receiving help, the learner should return to the next meaningful decision.

A hint should not typically transform the remaining episode into passive viewing.

The learner should retain ownership whenever possible.

Hints and expected intermediate states should not imply that a canonical hint is the only valid route. Authored episodes must declare their covered valid paths and a reviewed continuation for a valid path outside that coverage; missing authored coverage must not be presented as mathematical incorrectness.

---

# 53. Reflection Should Sometimes Compare Methods

Once learners are ready, occasional prompts may expose strategy choices.

Examples:

- Why was 12 more convenient than 24?
- Which fraction needed renaming here?
- Could you have solved this without changing both fractions?
- Was the visual model useful on this problem?

These should support metacognition and efficiency.

They should not introduce competitive ranking among mathematically valid methods.

---

# 54. The Interface Should Support Pauses

The learner should have time to inspect and think.

Avoid:

- automatic progression that removes a result too quickly;
- countdown timers in core learning;
- pressure to respond before the learner is ready.

Practice efficiency may eventually be measured, but speed should not dominate early conceptual learning.

---

# 55. Sound, if Used, Should Be Optional and Subtle

The system should not depend on sound for mathematical understanding.

If sound is introduced later, it should:

- reinforce state changes gently;
- never carry unique instructional information;
- be optional;
- avoid constant reward sounds.

FractionFlow should work comfortably in a classroom with many devices active.

---

# 56. Celebration Should Be Sparse and Earned

Possible moments for stronger acknowledgement include:

- completing a difficult new problem structure independently;
- successfully transferring between representations;
- solving a problem without a scaffold previously needed;
- reaching a meaningful learning milestone.

Routine correct arithmetic should usually receive routine confirmation.

---

# 57. The Learner Should Not Need to Manage the Curriculum

The system should decide an appropriate next episode within the selected practice context.

Avoid making young learners continuously choose among:

- skill categories;
- difficulty tiers;
- visual modes;
- scaffold settings;
- practice modes.

Some configuration may exist outside the core episode, especially for parents or teachers, but the learner experience should remain focused.

---

# 58. Session-Level Rhythm

A session should have a sense of rhythm without requiring an elaborate game structure.

A possible pattern is:

**orient → practice → vary → bridge → practice → consolidate**

The exact sequence may differ.

The important interaction principle is that the learner should not receive an endless undifferentiated stream of problems.

Short changes in instructional purpose can preserve attention without adding visual clutter.

---

# 59. New Concepts Should Change the Mathematics More Than the Interface

When a learner progresses to a more advanced problem structure, the interface should remain familiar where possible.

For example, moving from:

- like denominators

to:

- nested denominators

should primarily introduce the mathematical need for renaming.

It should not also introduce an entirely new navigation structure and interaction vocabulary.

Novel mathematics already consumes cognitive resources.

---

# 60. Familiar Controls Should Behave Consistently

If a learner uses:

- replay;
- hint;
- alternate representation;
- continue;
- numeric entry;

these should behave consistently across episodes.

Interface conventions should be learned once.

---

# 61. A Visual Model Is Not Automatically a Scaffold

A visual representation may sometimes be the primary mathematical medium rather than assistance.

For example, a bridge episode may intentionally require reasoning with a number line.

The system should distinguish:

- representation as the task;
- representation as explanation;
- representation as optional support.

This distinction matters when interpreting learner behavior.

---

# 62. An Interaction Can Reveal Understanding Without Producing a Final Answer

Some episodes may end after the learner successfully:

- identifies an equivalent fraction;
- chooses a common unit;
- predicts a transformation;
- places a quantity;
- compares magnitudes.

Not every episode must culminate in full computation.

Focused conceptual episodes may reduce overload and target specific dependencies.

---

# 63. Routine Practice Should Eventually Become Fast

Once a learner has demonstrated understanding, the interaction grammar should permit efficient repetition.

Advanced practice should not require waiting through mandatory animations or answering conceptual prompts already mastered.

The system should be able to collapse toward:

**problem → work → answer → brief feedback → next problem**

while retaining optional expansion when needed.

---

# 64. The Best Advanced Scaffold May Be Available but Invisible

A mature learner may see only the symbolic problem while still having access to:

- show bar;
- show number line;
- hint;
- replay conceptual explanation.

This supports independence without removing the safety net.

The availability of support does not require its constant visibility.

---

# 65. Deterministic Narrative, Variable Instances

The narrative structure of an episode should come from authored patterns.

The system may vary:

- mathematical values;
- which problem family is instantiated;
- scaffold presence;
- which reviewed prompt variant is used;
- whether a bridge episode is inserted.

It should not improvise new pedagogical narratives at runtime.

This supports:

- mathematical reliability;
- predictable learning;
- testing;
- accessibility review;
- visual polish;
- reproducibility.

---

# 66. Each Episode Type Should Have a Clear Instructional Responsibility Map

For any episode, it should be possible to state:

> The learner is responsible for deciding X.

> The system is responsible for showing Y.

For example:

### Early unlike-denominator addition

Learner responsibility:

- recognize unlike units;
- choose a common denominator;
- supply equivalent numerators;
- perform addition.

System responsibility:

- preserve the whole;
- visualize subdivision;
- confirm equivalence;
- represent the final combination.

Later versions may move more responsibility to the learner.

This boundary should be explicit when episode patterns are authored.

---

# 67. Episode Complexity Should Be Budgeted

A single episode should avoid combining too many novel demands.

A learner encountering a new denominator relationship should not simultaneously face:

- a new representation;
- unfamiliar wording;
- a new input mechanism;
- regrouping;
- and a transfer question

unless that complexity is explicitly intentional.

A useful design question is:

> How many things are new in this episode?

Usually, the answer should be small.

---

# 68. Elegance Through Reuse

The project should prefer a limited repertoire of high-quality interactions used repeatedly in different mathematical contexts.

Examples of reusable interaction motifs include:

- choose;
- predict;
- subdivide;
- place;
- combine;
- remove;
- regroup;
- rename;
- compare;
- compress;
- expand.

New interaction mechanics should be introduced only when existing ones cannot express the learning goal clearly.

The project should resist accumulating one-off mini-games.

---

# 69. Artistry Should Serve Continuity

Visual polish should reinforce the sense that mathematical objects persist through the episode.

Good opportunities for artistic care include:

- smooth subdivision;
- stable alignment;
- meaningful spatial continuity;
- restrained typography;
- clear whole-number boundaries;
- graceful transitions between visual and symbolic forms;
- satisfying composition of pieces into wholes.

Artistry should help the learner perceive structure.

It should not compete with the structure.

---

# 70. Whitespace Is Instructional Space

Empty space is not wasted screen area.

It can:

- isolate the current problem;
- reduce competition for attention;
- make transformations legible;
- allow mathematical objects to feel important;
- accommodate motion without crowding.

Do not fill available space merely because the device is large.

---

# 71. Responsive Design Should Preserve Hierarchy

On different screen sizes, the layout may reorganize, but the instructional hierarchy should remain:

1. mathematical object;
2. current question;
3. response mechanism;
4. secondary support.

Responsive design should not turn a calm desktop experience into a stacked list of controls on mobile.

The composition should remain intentional.

---

# 72. Accessibility Should Preserve the Narrative

Alternative interaction modes should retain the same instructional responsibilities.

For example, if a learner cannot drag a point on a number line, an accessible alternative should still require the learner to determine the location rather than simply reveal it.

Reduced-motion alternatives should preserve:

- initial state;
- transformed state;
- relationship between them.

Accessibility adaptations should preserve mathematical agency.

---

# 73. The Interaction Grammar Should Be Testable as a Design System

Even though this document is not a technical specification, episode patterns should be explicit enough that reviewers can ask:

- Is the learner responsible for the intended decision?
- Did the representation preserve quantity?
- Did feedback target the local error?
- Did the scaffold reveal too much?
- Did the representation change have a reason?
- Was more than one focal task competing for attention?
- Did the episode become unnecessarily verbose?
- Could the visual support have faded sooner?

The Quality and Validation document should turn these questions into review criteria.

---

# 74. Anti-Patterns

The following patterns should be treated with suspicion.

## Dashboard accumulation

Several independent panels all displaying related mathematical state.

## Representation carousel

Switching among visuals mainly to create variety.

## Animation theater

The system performs the reasoning while the learner watches.

## Prompt fragmentation

Every arithmetic micro-step becomes a separate question.

## Tutorial lock-in

Advanced learners remain forced through introductory scaffolds.

## Hint avalanche

One incorrect response triggers a full worked solution.

## Decorative gamification

Points, badges, streaks, and effects dominate the mathematical scene.

## Silent state changes

A fraction or representation changes without making the mathematical cause perceptible.

## Interface novelty as difficulty

Harder levels introduce new controls instead of harder mathematics.

## Visual dependency

Learners never receive opportunities to work efficiently without models.

---

# 75. A Canonical Episode Example

Consider:

\[
\frac23+\frac14.
\]

A highly supported episode might follow this grammar:

### Encounter

Present the expression and a clear visual representation.

### Notice

Ask whether the units already match.

### Decide

Ask the learner to choose a common denominator.

### Transform

Subdivide the existing quantities into twelfths while preserving their amounts.

### Decide

Ask for the equivalent numerators.

This is **supported construction**: the learner enters values after the subdivision and relevant relationship remain visible.

### Operate

Ask how many twelfths there are altogether.

### Resolve

Combine the quantities and settle on:

\[
\frac{11}{12}.
\]

### Reflect

Occasionally ask:

> Did either original amount change when we renamed it?

### Continue

Move naturally into the next episode.

A more advanced learner might experience the same mathematical structure as:

### Encounter

\[
\frac23+\frac14
\]

### Decide and operate

Enter:

\[
\frac8{12}+\frac3{12}=\frac{11}{12}.
\]

This is a reduced-support or independent configuration only when the preceding support and response provenance satisfy the evidence contract; the configuration label alone does not establish independent transfer.

### Resolve

Confirm.

The underlying mathematics is the same.

The interaction grammar has compressed.

---

# 76. A Canonical Bridge Example

A learner has just established:

\[
\frac23=\frac8{12}
\]

using a bar.

A bridge episode might:

1. preserve the bar's total length;
2. invite the learner to predict where the endpoint belongs on a number line;
3. transform the bar into a line while the endpoint remains fixed;
4. introduce twelfth tick marks;
5. reveal that \(2/3\) and \(8/12\) occupy the same point;
6. ask one concise transfer question;
7. return to ordinary practice.

The purpose is not to add another visualization.

The purpose is to strengthen the invariant:

> same number, different description.

---

# 77. A Canonical Help Example

A learner attempts:

\[
\frac13+\frac14
\]

and enters:

\[
\frac27.
\]

The system should not immediately display the correct solution.

A possible support sequence is:

### Orient

> These fractions count different-sized pieces.

### Represent

Show or emphasize thirds and fourths.

### Ask

> What would need to match before we combine the counts?

### Continue

Let the learner choose a common unit and resume the episode.

The support returns control to the learner as early as possible.

---

# 78. A Canonical Fading Example

The same learner may encounter similar denominator relationships over time.

### Early

Visible bars, prompted common unit, animated subdivision.

### Developing

Bars appear only after the learner selects a denominator.

### Independent

No bar is initially shown.

### Fluent

The learner solves symbolically with optional support available.

The experience should feel like the same system becoming less intrusive, not like progression through unrelated modes.

---

# 79. The Desired Interaction Character

A FractionFlow episode should feel:

- focused;
- calm;
- legible;
- responsive;
- mathematically purposeful;
- visually continuous;
- forgiving without becoming permissive;
- structured without becoming mechanical.

The learner should usually feel that they are acting upon mathematics, not operating educational software.

The strongest version of the experience is:

> I made a mathematical choice, I saw what that choice meant, and then I used what I understood to keep going.

---

# 80. Final Design Test

Before accepting a new interaction pattern, ask:

1. What is the learner thinking about?
2. What decision belongs to the learner?
3. What does the system reveal?
4. What mathematical relationship does the interaction make visible?
5. What remains invariant?
6. Why is this representation being used?
7. Could anything disappear from the screen?
8. Is the interaction still useful when the scaffold fades?
9. Does the learner retain control after an error or hint?
10. Could this interaction be expressed using an existing motif instead of inventing a new one?

If those questions do not have clear answers, the interaction should be simplified before implementation.
