# Quality and Validation

## Purpose

FractionFlow must be trustworthy.

A learner should be able to assume that:

- the mathematics is correct;
- the visual model represents that mathematics faithfully;
- the instructional sequence asks them to do something meaningful;
- equivalent fractions remain equivalent;
- animations preserve quantity;
- feedback responds to what actually happened;
- accessibility adaptations preserve the same learning responsibility;
- repeated sessions behave predictably enough to review and debug.

This document defines the project's quality model and the evidence required before mathematical content, instructional patterns, visual representations, or learner-facing interactions should be considered ready.

It owns the question:

> How do we know FractionFlow is correct, coherent, usable, and instructionally faithful?

It does **not** prescribe:

- a testing framework;
- a CI provider;
- exact test filenames;
- browser-automation technology;
- a specific accessibility scanner;
- visual-regression tooling;
- code-coverage targets.

Those choices belong to implementation planning.

---

# 1. Quality Is Multidimensional

FractionFlow quality should not be reduced to:

> Does the code run?

A learning episode can execute without errors and still fail because:

- the fraction mathematics is wrong;
- the problem belongs to the wrong family;
- a scaffold gives away the target reasoning;
- an animation implies that quantity changed;
- a number-line point is misplaced;
- an alternate valid answer is rejected;
- the interface overwhelms attention;
- keyboard users cannot perform the intended reasoning;
- a visual transformation works only at one screen size.

Quality therefore includes at least:

1. mathematical correctness;
2. content-generation correctness;
3. instructional correctness;
4. representational fidelity;
5. interaction quality;
6. accessibility;
7. visual coherence;
8. deterministic reproducibility;
9. technical robustness;
10. integrated learner experience.

Each requires its own evidence.

---

# 2. Quality Gates Should Follow Architectural Boundaries

Validation should occur at multiple layers.

A useful hierarchy is:

### Layer 1 — Mathematical Core

Are the underlying mathematical facts exact?

### Layer 2 — Content and Problem Generation

Does each problem actually satisfy the family and constraints it claims to satisfy?

### Layer 3 — Instructional State

Does the episode give the learner the intended responsibility and respond appropriately?

### Layer 4 — Scene Meaning

Does the scene accurately describe what should be perceptible?

### Layer 5 — Representation Rendering

Does the visual or symbolic representation faithfully express the scene?

### Layer 6 — Interaction

Can the learner perform the intended mathematical action reliably?

### Layer 7 — Integrated Episode

Does the complete experience remain mathematically and instructionally coherent?

### Layer 8 — Session Experience

Does repetition, variation, scaffolding, and progression remain coherent across multiple episodes?

Failures should be detected as low in this hierarchy as practical.

---

# 3. Mathematical Correctness Is Non-Negotiable

A mathematical error is a critical defect.

Examples include:

- incorrect equivalence;
- incorrect least common multiple;
- invalid common denominator classified as valid;
- incorrect simplification;
- wrong mixed-number conversion;
- incorrect regrouping;
- incorrect comparison;
- incorrect final answer.

No amount of visual polish or instructional quality compensates for uncertain mathematics.

The Mathematical Core should be subject to the strongest automated validation in the project.

---

# 4. Mathematical Invariants

Tests should enforce invariants rather than relying only on hand-selected examples.

Important invariants include:

## Equivalence preservation

For valid nonzero scale factor \(k\):

\[
\frac nd=\frac{nk}{dk}.
\]

## Simplification preservation

Reducing a fraction by a common factor must preserve exact value.

## Addition correctness

For valid fractions:

\[
\frac ab+\frac cd
=
\frac{ad+bc}{bd}.
\]

## Subtraction correctness

\[
\frac ab-\frac cd
=
\frac{ad-bc}{bd}.
\]

within the supported nonnegative domain.

## Mixed-number equivalence

\[
w\frac nd
=
\frac{wd+n}{d}.
\]

## Regrouping preservation

\[
w\frac nd
=
(w-1)\frac{n+d}{d}
\]

when \(w>0\).

## Common denominator validity

If \(D\) is accepted as a common denominator for \(b\) and \(d\), then:

\[
b\mid D
\]

and:

\[
d\mid D.
\]

## Least common denominator minimality

No positive common denominator may be smaller than the accepted least common denominator.

Invariants should be validated across broad input ranges.

---

# 5. Exact Equality Must Be Tested Exactly

Fraction equality must not depend on approximate decimal equality.

Tests should intentionally include values whose decimal forms repeat or terminate awkwardly.

Examples include:

\[
\frac13,\quad
\frac27,\quad
\frac5{12},\quad
\frac7{15}.
\]

The testing strategy should make it difficult for floating-point shortcuts to enter mathematical validation unnoticed.

---

# 6. Edge Cases Must Be Deliberate

The core domain should explicitly test cases such as:

- equal operands;
- subtraction producing zero;
- sums producing exactly one;
- sums producing whole numbers greater than one;
- reducible raw results;
- already simplified results;
- nested denominators;
- shared-factor denominators;
- relatively prime denominators;
- mixed-number regrouping;
- composition into a new whole;
- multiple valid common denominators.

Edge cases should not be treated as accidental discoveries during UI testing.

---

# 7. Unsupported Mathematics Should Fail Clearly

If the current product does not support:

- negative results;
- zero denominators;
- arbitrarily large denominators;
- unsupported mixed-number structures;

such input should be rejected clearly at the appropriate boundary.

Unsupported states should not silently pass downstream and produce plausible-looking nonsense.

---

# 8. Generated Content Must Be Validated Before Presentation

Every procedurally generated problem should satisfy its declared constraints before it can be used.

For example, a problem classified as:

> nested-denominator subtraction without regrouping

must actually satisfy all of those properties.

Generation should be followed by validation.

The generator should not be assumed correct merely because it generated the problem.

---

# 9. Problem-Family Validation

For every problem family, automated validation should check the defining characteristics.

Examples:

### Like-denominator addition

- denominators equal;
- operation addition.

### Nested denominators

- denominators differ;
- one divides the other.

### Shared-factor non-nested

- denominators differ;
- neither divides the other;
- greatest common divisor greater than one.

### Relatively prime

- greatest common divisor equals one.

### Mixed subtraction with decomposition

- mixed-number structure valid;
- after required denominator conversion, minuend fractional part is smaller than subtrahend fractional part.

A family name should be a verifiable mathematical claim.

---

# 10. Generated Problems Should Be Audited in Bulk

For each generation family, the project should be able to generate large batches and inspect them automatically.

Bulk validation should detect:

- invalid family membership;
- unintended negative answers;
- unexpectedly large intermediate values;
- excessive visual complexity;
- accidental simplification complications;
- unintended regrouping;
- repeated identical patterns;
- poor distribution across intended subcategories.

This is especially important because individual generated examples may look fine while the distribution is poor.

---

# 11. Generation Distribution Matters

Correct individual problems can still produce a weak practice experience if generation is badly distributed.

Examples include:

- too many denominators of 2 and 4;
- nearly all subtraction answers close to zero;
- repeated use of the same scale factor;
- very few problems where both operands require conversion;
- excessive repetition of one result structure.

Generation should therefore be reviewed not only for validity but for instructional variety.

The exact distribution policies belong to later sequencing design, but validation should make those distributions visible.

---

# 12. Curated Content Requires Review Too

Hand-authored content is not inherently safer than generated content.

Curated problems, hints, bridge episodes, and reflection prompts should be checked for:

- mathematical correctness;
- instructional fit;
- language clarity;
- representation feasibility;
- consistency with founding principles.

Human authors can introduce errors just as code can.

---

# 13. Canonical Paths Must Be Verified Independently

If a problem contains a canonical instructional path, every transformation in that path must be independently valid.

For example:

\[
\frac23+\frac14
\]

might contain:

\[
\frac23=\frac8{12}
\]

and:

\[
\frac14=\frac3{12}.
\]

Each equivalence must be validated rather than trusted because it belongs to a curated path.

---

# 14. Alternate Valid Paths Must Be Tested

FractionFlow explicitly recognizes multiple mathematically valid approaches.

Validation should therefore include cases such as:

- non-least common denominators;
- correct unsimplified results;
- equivalent improper fractions;
- equivalent mixed-number forms;
- valid alternate regrouping forms where applicable.

A system that accepts only its own canonical pathway is not mathematically robust.

---

# 15. Incorrect Paths Should Also Be Tested

Validation should include known incorrect response patterns.

Examples:

\[
\frac13+\frac14=\frac27
\]

or:

\[
\frac23=\frac2{12}.
\]

The goal is to verify that:

- invalid states are rejected;
- recognized response patterns are classified correctly;
- correct prior work remains preserved;
- feedback does not misidentify a later arithmetic error as an equivalence error.

---

# 16. Error Classification Must Be Humble

When the system recognizes a mathematical response pattern, validation should ensure that learner-facing language does not overclaim psychological certainty.

Acceptable:

> These denominators were added instead of being made into the same unit.

Less acceptable:

> You think denominators should always be added.

The system may identify what happened mathematically.

It should avoid claiming direct knowledge of the learner's beliefs.

---

# 17. Instructional Validation

An episode can be mathematically correct but instructionally wrong.

Review should ask:

- Is the learner making the intended decision?
- Has the system already revealed the answer?
- Is the prompt targeting the intended concept?
- Does the scaffold preserve useful thinking?
- Is the episode unnecessarily fragmented?
- Does support return control to the learner?
- Does a reflection prompt add value?
- Is the learner being asked to explain something already demonstrated for them?

Instructional validation requires human judgment in addition to automated checks.

---

# 18. Learner Responsibility Must Be Reviewable

Every episode type should make it possible to identify:

### Learner responsibility

What reasoning or action is the learner expected to perform?

### System responsibility

What information or transformation is the system expected to provide?

A review should reject episodes in which those responsibilities are unclear.

If the learner is supposedly practicing common-denominator selection but the system automatically selects the denominator, the episode does not meet its stated purpose.

---

# 19. Scaffold Leakage

Validation should specifically look for **scaffold leakage**: situations where a visual, prompt, label, or animation unintentionally reveals information the learner is meant to determine.

Examples include:

- twelfth subdivisions appearing before the learner chooses 12;
- a converted numerator becoming visible while it is still being asked for;
- a highlighted number-line destination revealing the expected placement;
- a regrouping animation occurring before the learner predicts whether regrouping is required.

This kind of defect may produce excellent apparent accuracy while destroying learning value.

---

# 20. Over-Scaffolding Should Be Treated as a Quality Defect

An episode may technically work while asking too many tiny questions.

Review should ask whether steps can be removed without losing instructional value.

Signs of over-scaffolding include:

- learner mainly copies visible values;
- every arithmetic operation becomes its own screen;
- the system asks for facts that are already obvious from labels;
- the learner cannot express a known strategy efficiently.

Quality includes restraint.

---

# 21. Under-Scaffolding Should Also Be Detected

The opposite problem occurs when learners are expected to perform conceptual leaps that have not been supported.

Possible signs include:

- symbolic procedures appear before equivalence is established;
- regrouping appears without connection to whole-unit decomposition;
- representation transfer is demanded before both representations are familiar;
- hints jump directly from problem to final solution.

Validation should examine both excess and insufficiency of support.

---

# 22. Scaffold Fading Must Preserve the Task

As scaffolds are removed, the underlying mathematical responsibility should remain coherent.

A lower-support version should not accidentally become a different problem.

For example, removing a bar should not also remove the need to select a denominator unless that is an intentional progression.

Each scaffold dimension should be independently reviewable.

---

# 23. Representation Fidelity

A representation is correct only if it preserves the mathematics it claims to depict.

Validation must examine visual truth.

For fraction bars:

- the whole must remain stable;
- partitions must be equal;
- selected regions must correspond to the numerator;
- subdivision must preserve total selected length.

For number lines:

- spacing must reflect equal numerical intervals;
- fraction positions must be proportional;
- equivalent fractions must occupy identical positions;
- movement during operations must have correct magnitude and direction.

For symbolic notation:

- labels must match underlying values;
- equal signs must represent true equality;
- transformations must not skip invalid steps.

---

# 24. Visual Accuracy Must Not Depend on Eyeballing

Where geometry carries mathematical meaning, validation should use deterministic relationships rather than subjective visual inspection alone.

For example:

- a \(3/4\) point should derive from exact relative position;
- subdivision boundaries should derive from denominator count;
- bar lengths representing equal quantities should be identical within rendering tolerances.

Human visual review remains important, but mathematical geometry should be testable.

---

# 25. The Whole Must Be Tested as an Invariant

For any visual transformation involving equivalence, validation should explicitly confirm that the whole remains unchanged.

This is especially important for:

- responsive resizing;
- representation transitions;
- mixed-number scenes;
- future circles or discrete sets.

A visual transformation that accidentally resizes one operand relative to another can teach false mathematics even if labels remain correct.

---

# 26. Representation Transitions Require Special Review

Transitions between representations are high-value and high-risk.

Reviewers should inspect:

- what remains visually anchored;
- whether quantity appears to change;
- whether the learner can perceive the correspondence;
- whether labels update at the correct time;
- whether the transition is still understandable with reduced motion;
- whether the final state is independently correct.

The transition should make a relationship clearer, not merely look impressive.

---

# 27. Animation Is Explanatory, Not Authoritative

Validation must ensure that skipping an animation does not change mathematical or instructional outcome.

The following should all produce equivalent final state:

- standard animation;
- reduced-motion transition;
- instantaneous transition used in testing;
- replay.

If mathematical state depends on animation timing, architecture has been violated.

---

# 28. Animation Must Be Inspectable Before and After

Important transformations should have clearly valid:

- pre-transition state;
- post-transition state.

The animation explains the relationship between them.

Validation should not focus solely on the moving frames.

A learner who misses the motion should still be able to inspect the resulting mathematics.

---

# 29. Motion Should Be Reviewed for Meaning

Every significant animation should answer:

> What mathematical relationship does this motion communicate?

Good answers include:

- subdivision;
- regrouping;
- movement along a number line;
- combining equal units.

If the answer is:

> it makes the screen feel more dynamic,

the motion should probably be removed.

---

# 30. Visual Coherence Is a Quality Requirement

FractionFlow's visual design should be reviewed for:

- clear hierarchy;
- restraint;
- sufficient whitespace;
- readable typography;
- stable spatial relationships;
- absence of competing focal points;
- consistency across episodes.

The goal is not merely attractiveness.

The visual system should direct attention toward the current mathematical idea.

---

# 31. One-Focus Review

For every major learner state, a reviewer should be able to answer:

> What should the learner look at first?

If several elements compete equally, the scene should be reconsidered.

This is a useful human-review criterion because crowdedness often emerges gradually as features accumulate.

---

# 32. Dashboard Creep Should Be Audited

As the product evolves, review should specifically look for accumulated interface elements such as:

- persistent progress indicators;
- multiple tool panels;
- permanent representation selectors;
- hint cards;
- explanatory sidebars;
- settings buttons;
- reward indicators.

Each may appear harmless individually.

Collectively, they can undermine the founding design.

Periodic review should ask:

> What can be removed from the learner's immediate visual field?

---

# 33. Language Quality

Learner-facing language should be reviewed for:

- mathematical accuracy;
- brevity;
- age appropriateness;
- consistency;
- unnecessary jargon;
- unnecessary reading burden;
- accidental ambiguity.

Prompt wording should not alter mathematical meaning.

---

# 34. Terminology Consistency

Important terms should be used consistently.

Examples include:

- equivalent fraction;
- common denominator;
- common unit;
- simplify;
- regroup;
- whole;
- numerator;
- denominator.

Informal language may accompany formal terminology, but the project should avoid contradictory metaphors.

---

# 35. Formal and Intuitive Language Must Stay Connected

Review should ensure that informal phrasing does not become mathematically misleading.

For example:

> same-sized pieces

can support common-denominator reasoning.

But the system should eventually connect that phrase to:

> common denominator.

Likewise:

> rename the fraction

should eventually connect to:

> equivalent fraction.

Language should build toward mathematical literacy.

---

# 36. Prompt Variants Require Equivalence Review

If several authored prompts serve the same instructional intent, reviewers should ensure that they really ask the same thing.

A wording variation should not accidentally:

- reveal more information;
- require more reading;
- change the conceptual target;
- introduce a different interpretation.

Variety must not create inconsistent difficulty.

---

# 37. Accessibility Is a Quality Gate

Core learning interactions should not be considered complete if they work only for a typical mouse-and-screen user.

Validation should include:

- keyboard use;
- touch use;
- reduced motion;
- screen-reader semantics where appropriate;
- color-independent meaning;
- readable contrast;
- focus visibility;
- non-drag alternatives;
- responsive layouts.

Accessibility should be tested throughout development, not postponed.

---

# 38. Keyboard Validation

Every required learner action should be possible without a mouse where reasonably feasible.

Review should include:

- entering answers;
- selecting choices;
- requesting hints;
- changing representation when allowed;
- continuing;
- interacting with number-line tasks through an accessible alternative.

Focus order should follow the instructional sequence rather than DOM accidents.

---

# 39. Touch Validation

Core interactions should be practical on touch devices.

Review should examine:

- target size;
- spacing;
- precision requirements;
- accidental activation;
- dragging tolerance;
- screen obstruction by virtual keyboards.

An interaction that works only with precise mouse movement is not sufficient.

---

# 40. Dragging Requires an Equivalent Alternative

If dragging is used to express mathematical reasoning, reviewers should confirm that a non-drag method preserves the same reasoning.

The alternative should not simply reveal the answer.

For example, placing \(3/4\) on a number line might support:

- dragging a point;
- keyboard movement among valid positions;
- another accessible placement mechanism.

All methods should test location understanding.

---

# 41. Reduced Motion Validation

Reduced-motion behavior should preserve:

- mathematical starting state;
- mathematical ending state;
- meaningful indication of what changed;
- learner control.

It should remove or compress motion, not remove instructional content.

---

# 42. Color Independence

Color may reinforce distinctions but should not be the sole carrier of meaning.

For example, two operands should remain distinguishable through:

- position;
- labels;
- patterns;
- outlines;
- structural relationships;

even if color perception differs.

---

# 43. Screen-Reader Meaning

Where visual content is essential, the project should define what equivalent semantic information is necessary.

A screen reader may not reproduce every visual effect, but it should not encounter meaningless unlabeled graphics.

Important objects should expose concepts such as:

- quantity;
- numerator;
- denominator;
- selected amount;
- number-line position;
- current task.

The exact technical implementation may vary.

---

# 44. Accessibility Must Preserve Agency

An accessible adaptation is not sufficient if it changes:

> learner reasons about the answer

into:

> software tells the learner the answer.

Validation should compare instructional responsibility across access modes.

---

# 45. Responsive Validation

Core episodes should be reviewed across a useful range of screen sizes.

Validation should examine:

- whether mathematical objects remain legible;
- whether labels collide;
- whether important quantities fall below the fold unexpectedly;
- whether primary and secondary controls retain hierarchy;
- whether animations still communicate relationships;
- whether visual pieces become too small.

Responsive behavior must preserve instructional meaning.

---

# 46. Representation Limits Must Be Enforced

If a particular renderer becomes unclear above a certain complexity, the content system should prevent inappropriate instances from reaching it.

Validation should confirm these capability boundaries.

It is better to reject an unsuitable pairing than to render an unreadable fraction model.

---

# 47. Deterministic Reproduction Is Required for Defects

A meaningful defect report should ideally be reproducible from:

- problem identity or seed;
- problem family;
- episode definition;
- scaffold state;
- learner action sequence.

Testing infrastructure should support replaying such cases.

Reproducibility is especially important for:

- generated problems;
- animation bugs;
- adaptive scaffold changes;
- alternate valid answers.

---

# 48. Regression Cases Should Be Preserved

When a meaningful defect is found, it should generally produce a durable regression case.

Examples:

- a valid denominator was rejected;
- \(6/8\) was incorrectly marked wrong instead of unsimplified;
- regrouping produced the wrong mixed number;
- a number-line point shifted during an equivalence transition;
- a mobile layout obscured the active prompt.

The project should accumulate protection against repeating important failures.

---

# 49. Curated Golden Cases

A small set of especially important episodes should receive unusually thorough validation.

These may include canonical cases such as:

### Equivalent fraction

\[
\frac12=\frac24.
\]

### Nested denominator addition

\[
\frac12+\frac38.
\]

### Relatively prime addition

\[
\frac23+\frac14.
\]

### Shared-factor subtraction

\[
\frac56-\frac38.
\]

### Crossing a whole

\[
\frac78+\frac38.
\]

### Mixed-number decomposition

\[
3\frac14-1\frac58.
\]

These cases can serve as shared reference points for:

- mathematical testing;
- visual review;
- accessibility review;
- interaction review;
- regression comparison.

---

# 50. Golden Cases Should Not Become the Only Tests

Beautiful canonical examples can hide broader problems.

Bulk generation and property-based validation remain necessary.

Golden cases provide depth.

Generated validation provides breadth.

Both are needed.

---

# 51. Human Pedagogical Review

Some questions cannot be fully automated.

Human review should examine whether:

- the learner's attention is directed appropriately;
- the amount of support is sensible;
- the wording is understandable;
- animation communicates the intended concept;
- the episode feels coherent;
- the learner has real agency;
- the interaction is unnecessarily tedious.

The project should not pretend that automated correctness testing alone proves instructional quality.

---

# 52. Child Usability Review

Whenever practical, learner-facing interactions should be tested with actual members of the target age range before being considered mature.

Useful observations include:

- where learners hesitate;
- which prompts require rereading;
- whether they notice intended transformations;
- whether they understand what controls do;
- whether they predict before animations or merely wait;
- when they request help;
- when visuals become unnecessary;
- whether interactions feel repetitive or confusing.

The goal is not merely to ask:

> Did you like it?

Observation of behavior is often more informative.

---

# 53. Small-Sample Testing Still Has Value

Early usability work does not need to be a formal research study to reveal obvious design failures.

A few learners can expose:

- unclear wording;
- invisible affordances;
- excessive steps;
- misleading animation;
- interaction friction.

Such feedback should be treated as design evidence, not proof of instructional efficacy.

---

# 54. Do Not Overclaim Research Evidence

FractionFlow may be informed by established research on:

- visual representations;
- fraction magnitude;
- number lines;
- equivalence;
- scaffold fading;
- multiple representations.

That does not mean FractionFlow itself is research-validated.

Project language should distinguish:

### Research-informed design

from:

### Empirically validated effectiveness of this product.

Claims should match available evidence.

---

# 55. Future Efficacy Evaluation

If FractionFlow eventually seeks evidence of instructional effectiveness, useful questions may include:

- Does conceptual accuracy improve?
- Does transfer between representations improve?
- Does symbolic accuracy improve?
- Does scaffold dependence decrease?
- Does magnitude estimation improve?
- Does learning persist after delay?
- Does FractionFlow outperform ordinary drill for targeted learners?

These are future evaluation questions, not requirements for initial development.

---

# 56. Session-Level Quality

Even individually excellent problems can form a poor session.

Session review should examine:

- repetition;
- variety;
- cognitive load;
- scaffold changes;
- bridge frequency;
- problem-family balance;
- pacing;
- whether too many difficult structures occur consecutively;
- whether conceptual prompts become monotonous.

The session should feel composed rather than randomly assembled.

---

# 57. Stable Practice Should Actually Feel Stable

When the instructional intent is focused practice, validation should ensure that unnecessary dimensions are not changing constantly.

For example, a run intended to consolidate nested denominators should not also cycle through:

- different representations every problem;
- radically different prompt styles;
- unfamiliar input mechanics.

The learner should be able to focus on the target mathematics.

---

# 58. Bridge Episodes Should Actually Test Transfer

A bridge episode should require some learner reasoning across representations.

Simply showing the same answer twice is not transfer practice.

Review should ask:

- What correspondence is the learner expected to notice?
- What prediction or action reveals that understanding?
- Does the learner need to reinterpret the same mathematical object?

If not, the bridge may be decorative rather than instructional.

---

# 59. Reflection Frequency Should Be Reviewed

Reflection is valuable when used selectively.

Too much reflection can make practice slow and verbal.

Validation should detect:

- repeated conceptual questions after mastery;
- mandatory explanation after trivial problems;
- reflection prompts that add no new evidence.

A useful reflection should justify its interruption.

---

# 60. Help Quality

Hints should be reviewed for progression.

A hint sequence should generally move from less explicit to more explicit support.

Validation should ensure that:

- the first hint does not immediately solve the problem;
- later hints do not contradict earlier language;
- the learner can resume work after help;
- multiple hints do not create a wall of text;
- the final explanation is mathematically correct.

---

# 61. Hint Escalation Should Be Deterministic

For a given episode state and hint request history, the help progression should be predictable.

This supports:

- review;
- testing;
- accessibility;
- learner expectations.

Hints should not vary unpredictably in helpfulness.

---

# 62. Correctness Feedback Should Be Specific

The system should distinguish cases such as:

### Correct and complete

### Correct but unsimplified

### Valid alternate pathway

### Correct fraction reasoning with arithmetic error

### Invalid equivalent fraction

### Invalid common denominator

### Incorrect final result

These should not all collapse into:

> correct

or:

> incorrect.

---

# 63. Feedback Should Preserve Successful Work

Regression testing should explicitly verify that later errors do not unnecessarily erase correct prior steps.

If the learner correctly chooses the common denominator but enters one wrong numerator:

- the denominator should remain established;
- correct prior conversion may remain established;
- feedback should focus on the incorrect conversion.

This behavior is central to the interaction model.

---

# 64. Feedback Should Not Leak Future Answers

A local error message should help with the current broken idea without automatically revealing:

- remaining conversions;
- final numerator;
- simplification;
- final answer.

Validation should inspect feedback for accidental answer leakage.

---

# 65. Simplification Feedback Requires Care

If the learner supplies:

\[
\frac68
\]

when:

\[
\frac34
\]

is preferred, feedback should acknowledge exact correctness before requesting simplification.

This distinction should be tested across fraction and mixed-number forms.

---

# 66. Alternate Common Denominators Require Care

If the learner uses a correct denominator other than the canonical LCD:

- the system should accept the mathematics;
- subsequent equivalence and arithmetic should follow that denominator correctly;
- optional efficiency feedback may later discuss a smaller denominator.

The interface should not force the learner back to the canonical path unless the episode explicitly practices least-common-denominator selection.

---

# 67. Efficiency Feedback Must Not Redefine Correctness

A mathematically valid but inefficient method is not an incorrect method.

Validation should ensure that optimization language remains secondary to truth.

Prefer distinctions such as:

> That works. Can you find a smaller common denominator?

over:

> Incorrect denominator.

---

# 68. Symbolic Equality Must Be Truthful

Every displayed equal sign is a mathematical assertion.

Visual and symbolic review should ensure that the interface never displays sequences such as:

\[
\frac23+\frac14=\frac8{12}+\frac14
\]

during a transition unless the entire displayed equality is mathematically true.

If partial work is being shown, layout should make clear what has and has not yet been transformed.

This is particularly important during animations.

---

# 69. Temporary Visual States Must Not Teach False Equality

Animations may temporarily show intermediate geometric motion.

Those states must not imply a false mathematical relationship.

If a transition requires an abstract visual in-between state, labels or layout should avoid presenting it as a stable mathematical equality.

---

# 70. Representation Switching Must Preserve Learner Work

Validation should test switching representations at multiple episode stages:

- before any work;
- after common denominator selection;
- after one conversion;
- after both conversions;
- after resolution.

The switch should preserve appropriate instructional state.

Representation switching should not:

- reset correct work;
- expose hidden answers;
- duplicate learner actions;
- create contradictory labels.

---

# 71. Expansion and Compression Must Be Symmetric in Meaning

When a symbolic problem expands into a visual scaffold and later compresses back into symbols:

- quantity must remain identical;
- learner-established work must remain intact;
- no new mathematical facts should appear without justification.

The visual scaffold should explain existing mathematics, not replace it with a different solution.

---

# 72. Performance Quality

The learning experience should remain responsive enough that interaction feels causally connected to learner action.

Particular attention should be given to:

- input response;
- scene transitions;
- representation changes;
- animation start;
- mobile performance.

An educational animation that starts noticeably late can weaken the perceived relationship between reasoning and consequence.

Exact performance budgets may be established later.

---

# 73. Slow Devices Matter

Because FractionFlow is intended to be free and broadly accessible, validation should not assume recent high-end hardware.

The core experience should remain usable on:

- typical school Chromebooks;
- ordinary phones;
- modest laptops.

Visual sophistication should not require powerful hardware.

---

# 74. Network Failure Should Not Break Core Practice

For a static-first application, core mathematical practice should remain available once required assets are loaded.

Future optional remote services should fail gracefully.

Examples:

- analytics unavailable;
- cloud progress unavailable;
- optional external content unavailable.

These should not make answer checking or local learning impossible.

---

# 75. Persistence Failure Should Be Non-Catastrophic

If local progress cannot be saved:

- the current episode should still work;
- mathematical state should remain valid;
- the learner should not lose the ability to practice.

Persistence enhances continuity.

It should not control correctness.

---

# 76. Quality of Diagnostic Information

Development builds should expose enough internal information to diagnose failures efficiently.

Useful diagnostic state includes:

- seed;
- problem family;
- operands;
- canonical result;
- denominator relationship;
- instructional beat;
- scaffold configuration;
- learner-established state;
- active representation.

This should remain separate from the learner-facing interface.

---

# 77. Validation Assets Are Durable Project Assets

Important test cases, curated review cases, and acceptance examples should live in version control.

They should not exist only:

- in an issue description;
- in a developer's memory;
- in screenshots;
- in temporary agent context.

Durable validation examples help maintain consistency across contributors and models.

---

# 78. Founding-Document Conformance

Quality review should include conformance to the founding documents.

A feature may be technically excellent yet violate the product vision.

Reviewers should ask whether it conflicts with principles such as:

- one focal idea at a time;
- deterministic mathematics;
- representations as shared views;
- scaffold fading;
- calmness;
- purposeful representation variety;
- learner agency.

Founding-document violations should be treated as design defects, not merely stylistic disagreements.

---

# 79. Specification Drift

As implementation progresses, code may expose ambiguities or contradictions in the founding specifications.

When that happens:

1. identify the canonical owning document;
2. resolve the ambiguity there;
3. update dependent references;
4. then implement the clarified behavior.

Do not let implementation quietly become the de facto specification.

---

# 80. Validation Should Not Duplicate Specifications

The quality system should test requirements owned elsewhere rather than restating all of them.

For example:

- `03-math-and-content-model.md` defines what a nested denominator relationship is;
- this document requires tests proving that classification is correct.

Likewise:

- `02-interaction-grammar.md` defines local error handling;
- this document requires review proving the implementation behaves that way.

This distinction supports normalization.

---

# 81. Feature Acceptance Levels

A useful quality model distinguishes several states.

## Prototype

The concept can be explored, but correctness or polish is incomplete.

## Mathematically validated

Underlying mathematics and content constraints are reliable.

## Interaction validated

Instructional state and learner responsibilities behave correctly.

## Representation validated

Visual and symbolic representations faithfully express the mathematics.

## Accessibility validated

Core interactions meet agreed accessibility expectations.

## Integrated candidate

The complete episode is ready for realistic learner review.

## Core-ready

The feature has passed required automated, human, regression, and usability checks for inclusion in the core product.

Not every experimental feature needs to reach the final state.

---

# 82. Definition of Done Should Depend on Feature Type

Different features require different evidence.

### Mathematical operation

Needs strong automated invariant testing.

### Problem family

Needs family validation and bulk-generation review.

### Prompt family

Needs language and instructional review.

### Representation

Needs mathematical, visual, responsive, and accessibility validation.

### Episode

Needs instructional-flow and integrated testing.

### Bridge episode

Needs representation-transition and transfer review.

### Persistence feature

Needs failure and privacy review.

A single generic checklist is unlikely to be sufficient.

---

# 83. Core Instructional Features Require Higher Scrutiny

Features central to the founding learning model deserve the deepest review.

These include:

- equivalent-fraction transformations;
- common-unit selection;
- bar subdivision;
- number-line equivalence;
- mixed-number regrouping;
- scaffold fading;
- representation bridges.

These are where FractionFlow's distinctive instructional value lives.

They should not receive less scrutiny than peripheral settings or application-shell features.

---

# 84. Stretch Features Must Not Regress Core Quality

A future feature should be rejected or redesigned if it materially harms:

- focus;
- load time;
- accessibility;
- mathematical clarity;
- privacy;
- learner agency;
- architectural separation.

Expansion is not automatically progress.

---

# 85. Validation of New Representations

Before a new visual representation becomes part of the product, reviewers should answer:

1. What mathematical relationship does it reveal?
2. What does it reveal better than existing representations?
3. What misconceptions might it accidentally reinforce?
4. What defines one whole?
5. How does equivalence appear?
6. How does it behave with mixed numbers?
7. What are its practical denominator limits?
8. How does it support accessibility?
9. What does transfer to or from this representation require?
10. Does its benefit justify added interaction complexity?

A representation should earn inclusion.

---

# 86. Validation of New Interaction Mechanics

Before introducing a new interaction type, ask:

1. What mathematical reasoning does it capture?
2. Could an existing interaction motif capture the same reasoning?
3. Does it introduce motor difficulty?
4. Does it create accessibility complications?
5. Does it require new instructions?
6. Will learners need to remember it later?
7. Does it improve learning enough to justify the new convention?

Interaction novelty has a cognitive cost.

---

# 87. Validation of New Scaffolds

For any scaffold, reviewers should ask:

- What difficulty does this scaffold address?
- What reasoning remains with the learner?
- When should the scaffold appear?
- When should it disappear?
- Can it be requested voluntarily?
- Does it leak answers?
- Can performance without it eventually be observed?

A scaffold without a fading path risks becoming dependency.

---

# 88. Validation of Fading

Scaffold fading should be tested as carefully as scaffold introduction.

Review should confirm that:

- support can actually disappear;
- the learner still understands the task;
- removed support does not leave orphaned controls or wording;
- optional help remains coherent;
- symbolic work becomes more efficient.

The advanced state should feel intentionally simple, not incomplete.

---

# 89. Validation of Session Composition

A session-level review should inspect a complete run rather than isolated problems.

Questions include:

- Is the learner seeing enough repetition to stabilize a concept?
- Is meaningful variation introduced before monotony?
- Are bridges appropriately spaced?
- Does difficulty rise too abruptly?
- Do scaffolds change coherently?
- Are problem families mixed at sensible times?
- Are reflection prompts overused?
- Does the session end at a reasonable point?

This review should occur even if every individual episode has already passed.

---

# 90. Qualitative Experience Review

Some of FractionFlow's goals are aesthetic and experiential.

Reviewers should explicitly consider whether the product feels:

- calm;
- elegant;
- direct;
- coherent;
- trustworthy;
- responsive;
- child-appropriate without being childish;
- visually polished without being showy.

These qualities are not fully reducible to automated tests, but they are still product requirements.

---

# 91. Beauty Should Not Mask Friction

A polished animation should not excuse:

- unnecessary waiting;
- excessive interaction;
- unclear controls;
- repetitive narration;
- visual density.

Quality review should distinguish aesthetic pleasure from instructional effectiveness.

The ideal is that the two reinforce each other.

---

# 92. Simplicity Should Be Tested

Reviewers should periodically attempt subtraction rather than addition:

- remove a control;
- remove a label;
- remove a prompt;
- remove a panel;
- remove a step;
- shorten wording.

If learning remains equally clear or improves, the simpler version should usually win.

Simplicity is not achieved automatically.

It requires active maintenance.

---

# 93. Adversarial Review

Major milestones should invite reviewers to actively search for:

- mathematical counterexamples;
- alternate valid solutions;
- accessibility failures;
- misleading visuals;
- specification contradictions;
- unnecessary complexity;
- edge cases;
- opportunities for false learner success;
- places where scaffolds do the thinking.

Review should not merely confirm that the intended design appears to work.

It should attempt to break the assumptions behind it.

---

# 94. Independent Review Is Valuable

Where practical, important specifications and implementations should be reviewed by someone or something that did not produce them.

Independent review is especially useful for:

- fraction mathematics;
- mixed-number regrouping;
- problem generators;
- accessibility;
- new representations;
- instructional explanations.

Familiarity can make errors difficult to see.

---

# 95. Automated and Human Review Are Complementary

Automation is strongest at:

- exact correctness;
- invariants;
- regression;
- large input spaces;
- reproducibility.

Human review is strongest at:

- instructional coherence;
- visual meaning;
- language;
- cognitive load;
- elegance;
- learner experience.

Neither should be treated as sufficient by itself.

---

# 96. Release Confidence

A release should provide high confidence that:

- core mathematics is unchanged or intentionally changed;
- generated content remains valid;
- golden cases still behave correctly;
- accessibility has not materially regressed;
- core representations remain faithful;
- common learner pathways have been exercised;
- no unresolved critical mathematical defects remain.

Release confidence should come from accumulated evidence, not optimism.

---

# 97. Severity of Defects

A useful conceptual severity model is:

## Critical

Could teach incorrect mathematics, corrupt mathematical state, or make core practice unusable.

Examples:

- false equivalence;
- wrong answer accepted;
- correct answer systematically rejected;
- quantity-changing animation presented as equivalence.

## High

Substantially undermines instructional meaning, accessibility, or a core workflow.

Examples:

- scaffold gives away target answer;
- keyboard users cannot complete core episode;
- regrouping representation is misleading.

## Moderate

Creates confusion, inefficiency, or inconsistent behavior without fundamentally corrupting learning.

Examples:

- poor prompt wording;
- excessive repetition;
- mobile label overlap.

## Minor

Cosmetic or peripheral issue with little instructional consequence.

Severity should reflect learning impact, not merely software inconvenience.

---

# 98. Mathematical Defects Block Release

Any unresolved critical mathematical defect affecting core supported content should block release.

The project should maintain a higher tolerance for:

- missing stretch features;
- minor visual polish issues;
- incomplete optional enhancements;

than for uncertain mathematics.

---

# 99. Instructional Defects May Also Block Release

A mathematically correct feature should still be withheld if it predictably teaches the wrong idea.

Examples include:

- an equivalence animation that appears to enlarge the fraction;
- a common-denominator scaffold that makes denominator matching seem arbitrary;
- regrouping presented only as digit borrowing despite the founding model.

Mathematical truth and instructional truthfulness are both required.

---

# 100. Acceptance Questions for a Core Episode

Before a core episode is considered ready, reviewers should be able to answer yes to questions such as:

### Mathematics

- Are every operand, transformation, and result exact?
- Are alternate equivalent answers handled correctly?

### Instruction

- Is the learner doing the reasoning the episode claims to teach?
- Does feedback target the earliest broken step?

### Representation

- Does the visual preserve the whole and the quantity?
- Are transitions mathematically faithful?

### Interaction

- Is the current task obvious?
- Can the learner act without unnecessary software friction?

### Scaffolding

- Does support help without doing too much?
- Can it fade?

### Accessibility

- Can the same learning responsibility be completed through supported access modes?

### Visual design

- Is there one clear focus?
- Can anything unnecessary be removed?

### Reproducibility

- Can the episode be reconstructed for debugging and review?

If several answers are uncertain, the episode is not ready.

---

# 101. Acceptance Questions for a Problem Family

Before a problem family is considered mature, reviewers should know:

- its exact defining mathematical properties;
- valid subcategories;
- excluded accidental complexities;
- generation constraints;
- visual feasibility;
- canonical and alternate valid pathways;
- expected error classifications;
- applicable representations;
- bulk-generation behavior.

The family should be understandable independently of any one problem instance.

---

# 102. Acceptance Questions for a Representation

Before a representation is considered mature:

- Is one whole unambiguous?
- Are quantities spatially accurate?
- Can equivalent fractions remain visibly equivalent?
- Can it represent its supported problem families clearly?
- Are density limits known?
- Is it responsive?
- Is it accessible?
- Does it have a meaningful role distinct from existing representations?
- Can transitions into and out of it preserve shared mathematical identity?

---

# 103. Acceptance Questions for a Scaffold

Before a scaffold is considered mature:

- What problem does it solve?
- What does the learner still have to reason about?
- Can it appear without exposing future answers?
- Can it disappear cleanly?
- Can learner success with and without it be distinguished?
- Does requesting it preserve dignity and agency?
- Is it accessible?

---

# 104. Core Validation Suite

The initial core product should ultimately have durable validation coverage for at least:

- equivalent-fraction expansion and reduction;
- common-denominator identification;
- least common denominator;
- alternate common denominators;
- like-denominator addition;
- like-denominator subtraction;
- nested-denominator addition and subtraction;
- shared-factor addition and subtraction;
- relatively prime addition and subtraction;
- simplification;
- sums crossing one;
- mixed-number addition;
- mixed-number composition;
- mixed-number subtraction;
- decomposition/regrouping;
- fraction-bar states;
- number-line states;
- symbolic states;
- representation bridges;
- scaffold fading;
- local feedback;
- alternate valid answers;
- keyboard and touch interaction;
- reduced-motion behavior;
- responsive layouts;
- deterministic replay.

---

# 105. Stretch Validation Areas

As the product grows, validation may expand to:

- long-term progress modeling;
- adaptive sequencing;
- localization;
- teacher-created configurations;
- cloud synchronization;
- telemetry;
- new mathematical domains;
- additional representations.

Stretch validation should build on the same foundational contracts rather than inventing separate quality models.

---

# 106. Validation Documentation Should Stay Normalized

This document defines the project's quality philosophy and acceptance expectations.

Specific future artifacts may include:

- automated test suites;
- curated golden cases;
- accessibility checklists;
- representation review rubrics;
- release checklists;
- browser/device matrices;
- usability protocols.

Those artifacts should reference this document rather than reproduce it wholesale.

---

# 107. Final Quality Contract

FractionFlow should be considered trustworthy only when its parts agree.

The mathematics must agree with the content classification.

The content classification must agree with the instructional episode.

The instructional episode must agree with the scene.

The scene must agree with the representation.

The representation must agree with what the learner perceives.

The learner's action must be interpreted according to the intended mathematical responsibility.

The feedback must agree with what actually happened.

And all of this should remain reproducible enough to inspect when something goes wrong.

The goal is not a product with no bugs.

The goal is a product whose architecture, specifications, and validation practices make **silent mathematical and instructional errors difficult to create, difficult to hide, and difficult to repeat**.