# Instructional Model

## Purpose

FractionFlow is designed to help learners develop both:

1. **conceptual understanding of fractions and fraction operations**, and
2. **efficient, increasingly independent symbolic fluency**.

These goals are complementary.

The project should not leave learners dependent on visual models, but it should also not ask them to memorize fraction procedures before the procedures have mathematical meaning.

The intended progression is:

**understand quantities and units → reason about equivalence → create common units → perform meaningful operations → connect representations → reduce scaffolding → develop efficient symbolic fluency**

This document defines what learners should understand, the instructional progression through which that understanding develops, important distinctions among problem types, likely misconceptions, and the evidence FractionFlow should use to interpret learner performance.

It does **not** define exact interface sequences, animation choreography, data structures, or software architecture.

---

# 1. Target Learners

The initial target learner is approximately upper-elementary age and is learning or consolidating:

- proper fractions;
- equivalent fractions;
- common denominators;
- addition and subtraction of fractions;
- mixed numbers;
- regrouping with mixed numbers.

The system should be useful both to learners encountering these ideas for the first time and to learners who have already been taught procedures but possess incomplete conceptual understanding.

A particularly important target case is the learner who can partially imitate algorithms such as:

> multiply the top and bottom by the same number

but does not yet reliably understand:

- why the resulting fraction is equivalent;
- why addition and subtraction require common denominators;
- what the denominator describes;
- what happens mathematically when a whole is regrouped;
- how symbolic procedures relate to fraction magnitude.

FractionFlow should therefore be able to support both **initial conceptual construction** and **conceptual repair**.

---

# 2. Core Instructional Commitments

The instructional model rests on several commitments.

## 2.1 Fractions are numbers

A fraction is not merely:

- part of a picture;
- two whole numbers separated by a line;
- a division problem waiting to happen;
- an instruction to shade pieces.

Fractions represent numerical quantities.

Learners should increasingly understand fractions as numbers that:

- have magnitude;
- can be placed on a number line;
- can be compared;
- can be renamed equivalently;
- can be combined and separated;
- can be greater than one;
- participate in arithmetic according to coherent numerical principles.

---

## 2.2 The denominator describes the unit

For a fraction

\[
\frac{a}{b},
\]

the denominator \(b\) determines the fractional unit:

\[
\frac{1}{b}.
\]

The numerator \(a\) counts how many of those units are present.

Thus:

\[
\frac{3}{5}
\]

means three units of size \(1/5\).

This unit interpretation should become central to fraction addition and subtraction.

The learner should eventually understand that:

\[
\frac{2}{7}+\frac{3}{7}
\]

can be directly combined because both quantities count sevenths.

By contrast:

\[
\frac{1}{3}+\frac{1}{4}
\]

initially counts two different kinds of units and therefore requires the fractions to be renamed using a common unit.

---

# 3. The Whole Is Foundational

Every fraction exists relative to a whole.

Learners should understand that:

- the same fraction can describe different absolute quantities when the wholes differ;
- equivalent-fraction comparisons require a consistent whole;
- visual models become misleading if the whole changes unnoticed;
- multiple wholes can be composed into mixed numbers and improper fractions.

Instruction should reinforce the question:

> What counts as one whole here?

especially when a representation could make that ambiguous.

---

# 4. Fraction Magnitude

Procedural competence should remain connected to magnitude.

Learners should develop intuition about:

- whether a fraction is near 0;
- near \(1/2\);
- near 1;
- greater than 1;
- larger or smaller than another fraction.

Useful reference points include:

\[
0,\qquad \frac12,\qquad 1
\]

and, when mixed numbers are involved, nearby whole numbers.

Magnitude reasoning should be integrated periodically into operational practice rather than confined to a separate unit.

For example, before or after solving:

\[
\frac{5}{6}+\frac{3}{8},
\]

a learner might recognize that the answer:

- must exceed 1;
- should be considerably less than 2.

This gives the learner a basis for detecting impossible symbolic answers.

---

# 5. Equivalent Fractions

Equivalent fractions are a central conceptual dependency for unlike-denominator operations.

Learners should understand that equivalent fractions represent the **same quantity using different fractional units**.

For example:

\[
\frac23=\frac46=\frac8{12}.
\]

These are not approximately equal and are not merely produced by a symbolic rule. They are exactly the same number.

---

## 5.1 Subdivision interpretation

If each third is divided into four equal smaller pieces, then:

\[
\frac13=\frac4{12}.
\]

Therefore two thirds becomes:

\[
\frac23=\frac8{12}.
\]

The pieces have changed size and therefore the number of pieces needed to describe the same amount has changed.

The amount itself has not changed.

---

## 5.2 Multiplication-by-one interpretation

Learners should eventually connect subdivision to:

\[
\frac23\times\frac44=\frac8{12}.
\]

Because:

\[
\frac44=1,
\]

the numerical value remains unchanged.

This symbolic formulation should emerge from the equivalence concept rather than serve as its sole justification.

---

## 5.3 Equivalent fractions as renaming

Instruction should favor language such as:

- rename;
- same amount;
- same number;
- different-sized units;
- equivalent form;

rather than implying that a fraction has somehow been transformed into a different quantity.

---

# 6. Common Denominators as Common Units

The common-denominator procedure should be grounded in the idea of common units.

Suppose:

\[
\frac23+\frac14
\]

is to be calculated.

Thirds and fourths are different unit sizes.

The learner needs a unit that can describe both quantities exactly.

Twelfths work:

\[
\frac23=\frac8{12}
\]

and

\[
\frac14=\frac3{12}.
\]

The operation then becomes:

\[
\frac8{12}+\frac3{12}.
\]

Now both numerators count the same kind of unit.

This conceptual structure should precede or accompany procedural language such as:

- common denominator;
- least common denominator;
- least common multiple.

---

# 7. Least Common Denominators Are an Efficiency, Not the Concept

Learners do not need to choose the least possible common denominator in order to understand fraction addition or subtraction correctly.

For example:

\[
\frac13+\frac14
\]

could validly be renamed using twelfths, twenty-fourths, thirty-sixths, or another common subdivision.

The least common denominator is valuable because it usually makes computation easier.

Instruction should therefore distinguish:

### Conceptual requirement

Use a denominator that produces a valid common unit.

### Efficiency goal

Prefer a convenient or least common denominator when the learner is ready to do so.

A learner who correctly constructs equivalent fractions using a non-minimal common denominator has demonstrated more important understanding than a learner who mechanically identifies an LCD without understanding why it is needed.

---

# 8. Addition as Combining Like Units

Fraction addition should preserve the learner's existing understanding of addition.

Addition means combining quantities.

Once the fractional units match:

\[
\frac{a}{d}+\frac{b}{d}
=
\frac{a+b}{d}.
\]

The denominator remains \(d\) because the size of the units has not changed.

Only the number of those units has changed.

The learner should eventually be able to explain why:

\[
\frac27+\frac37=\frac57
\]

rather than:

\[
\frac5{14}.
\]

The central reasoning is:

> two sevenths plus three sevenths gives five sevenths.

This is structurally similar to:

> two meters plus three meters gives five meters.

---

# 9. Subtraction as Removing or Measuring Difference

Fraction subtraction should retain familiar meanings of subtraction.

Depending on context or representation, subtraction may mean:

- removing part of a quantity;
- moving backward;
- determining the difference between two quantities;
- determining how much remains.

Once units match:

\[
\frac{a}{d}-\frac{b}{d}
=
\frac{a-b}{d}.
\]

As with addition, the denominator remains unchanged because the unit size remains unchanged.

Unlike-denominator subtraction therefore requires common units for the same reason that unlike-denominator addition does.

---

# 10. Mixed Numbers

Mixed numbers should be understood as quantities composed of whole-number and fractional parts.

For example:

\[
2\frac34
\]

means:

\[
2+\frac34.
\]

It also corresponds to:

\[
\frac{11}{4}.
\]

Learners should understand these as equivalent representations of the same number rather than unrelated notation systems.

Instruction should preserve connections among:

- whole numbers;
- mixed numbers;
- improper fractions;
- visual quantities;
- locations on a number line.

---

# 11. Mixed-Number Addition

Mixed-number addition should initially support decomposition into:

- whole-number quantities;
- fractional quantities.

For example:

\[
2\frac13+1\frac14
\]

can be understood as:

\[
(2+1)+\left(\frac13+\frac14\right).
\]

This interpretation makes the continuity with ordinary addition explicit.

When the fractional sum exceeds one whole, learners should understand the result as composing fractional units into an additional whole.

For example:

\[
2\frac34+1\frac58
\]

can produce a fractional component greater than one:

\[
\frac68+\frac58=\frac{11}{8}
=
1\frac38.
\]

The newly composed whole is not an arbitrary "carry." It is a regrouping of enough fractional units to make one whole.

---

# 12. Mixed-Number Subtraction and Regrouping

Regrouping in mixed-number subtraction is a major conceptual target.

For example:

\[
3\frac14-1\frac58
\]

cannot subtract the fractional parts directly after renaming:

\[
3\frac28-1\frac58.
\]

One whole can be renamed as eight eighths:

\[
3\frac28
=
2+\frac88+\frac28
=
2\frac{10}{8}.
\]

The subtraction can then proceed.

The learner should understand regrouping as **renaming one whole in fractional units**, not as a mysterious borrowing operation.

This is the same equivalence principle used elsewhere in fraction arithmetic.

---

# 13. Simplification

Simplification should be understood as another act of renaming.

For example:

\[
\frac8{12}=\frac23.
\]

Neither form is more numerically correct.

The simplified form is usually preferred because it expresses the same quantity using larger fractional units and smaller integers.

Instruction should distinguish:

- correctness of a fraction value;
- convention or efficiency of expressing it in simplest form.

The system should not communicate that an unsimplified but equivalent answer is mathematically false.

It may instead recognize the value as correct and then ask the learner to rename it more simply.

---

# 14. Representational Roles

FractionFlow's foundational representations have complementary instructional purposes.

This document defines what they are intended to teach. Exact transitions among them belong to the Interaction Grammar.

---

## 14.1 Fraction bars

Fraction bars are particularly suited to helping learners understand:

- a fixed whole;
- fractional units;
- subdivision;
- equivalence;
- common units;
- combining pieces;
- removing pieces;
- composing a whole from fractional units;
- regrouping a whole.

Their linear structure also creates a useful conceptual bridge toward number lines.

---

## 14.2 Number lines

Number lines are particularly suited to helping learners understand:

- fractions as numbers rather than merely pieces of objects;
- fraction magnitude;
- ordering;
- equivalence as identical location;
- addition as movement;
- subtraction as movement or distance;
- improper fractions;
- mixed numbers;
- relationships among fractions and whole numbers.

---

## 14.3 Symbolic notation

Symbolic notation is not merely an assessment format.

It is an important mathematical representation because it provides:

- precision;
- compactness;
- generality;
- computational efficiency;
- conventional mathematical communication.

The long-term goal is not to replace symbolic mathematics with pictures.

The goal is for symbols to become meaningful enough that many problems can eventually be solved symbolically without requiring visible models.

---

# 15. Representation Transfer

Understanding within one representation does not guarantee understanding in another.

A learner may be able to identify \(3/4\) in a shaded rectangle yet struggle to locate \(3/4\) on a number line.

FractionFlow should therefore treat **translation among representations as a learning goal in its own right**.

Examples of transfer include:

- matching a symbolic fraction to a visual quantity;
- locating a visually represented fraction on a number line;
- recognizing that two visual forms represent the same number;
- predicting what subdivision will preserve a quantity;
- explaining a symbolic equivalence through a visual representation;
- solving symbolically after previously solving analogous problems visually.

Representation transfer should demonstrate that the learner possesses an underlying concept rather than merely familiarity with one diagram format.

---

# 16. Stable Practice and Bridge Experiences

Most practice should allow learners to work within a stable representational environment long enough to develop fluency.

Periodic **bridge experiences** should deliberately require translation or reinterpretation.

The instructional rhythm should therefore include both:

### Stable practice

Repeated use of a familiar representation or procedure to reduce unnecessary cognitive load and strengthen a developing skill.

### Bridge experiences

Occasional tasks that ask:

> Does the same mathematical idea still make sense in another representation?

This balance supports both fluency and flexible understanding.

Exact sequencing and interaction mechanics belong elsewhere.

---

# 17. Productive Prediction

Whenever appropriate, learners should predict important mathematical consequences before seeing them demonstrated.

Useful predictions include:

- whether an equivalent-fraction transformation changes the amount;
- whether a point will move on a number line;
- how many smaller pieces will replace one larger piece;
- whether an answer will exceed one whole;
- whether regrouping will be necessary;
- whether a proposed answer is reasonable.

Prediction helps distinguish active reasoning from passive observation.

Predictions need not always require formal numeric answers. Conceptual choices such as:

- larger;
- smaller;
- same;
- less than one;
- greater than one;

can reveal meaningful understanding.

---

# 18. Explanation Without Excessive Verbal Burden

Conceptual understanding does not require learners to produce lengthy written explanations for every problem.

FractionFlow should seek evidence of reasoning through multiple forms, including:

- selecting a valid unit;
- making a correct prediction;
- placing a point;
- completing an equivalence;
- rejecting an invalid transformation;
- recognizing an invariant;
- choosing a reasonable estimate;
- successfully transferring between representations.

Short explanatory prompts may be valuable, but the system should not turn fraction practice into a reading- or writing-heavy exercise unnecessarily.

The learner's mathematical actions can themselves provide evidence of understanding.

---

# 19. Instructional Progression

The following progression describes conceptual dependencies, not a rigid sequence that every learner must traverse identically.

---

## Stage A: Fractional units and magnitude

Learners should understand:

- a whole can be divided into equal units;
- the denominator identifies the unit size;
- the numerator counts those units;
- fractions have magnitude;
- larger denominators create smaller unit fractions when the whole is fixed.

Representative understandings include:

\[
\frac15 < \frac13
\]

because fifths are smaller than thirds.

---

## Stage B: Equivalence

Learners should understand:

- subdivisions can change without changing quantity;
- equivalent fractions occupy the same numerical location;
- numerator and denominator change together in predictable ways;
- multiplying numerator and denominator by the same nonzero whole number preserves value.

Representative understanding:

\[
\frac12=\frac24=\frac36.
\]

---

## Stage C: Like-denominator operations

Learners should add and subtract fractions whose units already match.

Focus:

- numerator as unit count;
- denominator as unit identity;
- denominator remains unchanged;
- answer magnitude makes sense.

Representative examples:

\[
\frac27+\frac37
\]

and

\[
\frac79-\frac29.
\]

---

## Stage D: Unlike denominators with nested units

One denominator is already a multiple of the other.

Examples:

\[
\frac12+\frac38
\]

or:

\[
\frac56-\frac13.
\]

These problems provide a useful first application of equivalence because only one fraction needs to be renamed.

---

## Stage E: Unlike denominators requiring both fractions to be renamed

Examples:

\[
\frac23+\frac14
\]

and:

\[
\frac56-\frac38.
\]

Learners identify or construct a common unit and correctly rename both fractions.

---

## Stage F: Efficiency with common denominators

Learners become increasingly efficient at:

- recognizing denominator relationships;
- identifying useful common multiples;
- choosing least common denominators when advantageous;
- reducing unnecessary work.

This stage emphasizes efficiency after conceptual validity has been established.

---

## Stage G: Results crossing a whole

Addition may produce improper fractions or new whole numbers.

Learners should recognize:

\[
\frac78+\frac38
=
\frac{10}{8}
=
1\frac28
=
1\frac14.
\]

The additional whole emerges from composing enough fractional units.

---

## Stage H: Mixed-number operations without regrouping

Learners combine or subtract:

- whole-number parts;
- fractional parts;

without needing to exchange a whole.

---

## Stage I: Mixed-number addition with composition

Fractional parts combine to form one or more additional wholes.

Learners interpret this as composing units, not merely carrying digits.

---

## Stage J: Mixed-number subtraction with regrouping

A whole must be renamed into fractional units.

This should be connected explicitly to earlier equivalent-fraction reasoning.

---

## Stage K: Increasing symbolic independence

Learners solve increasingly many problems without automatically displayed representations.

Visual support remains available when useful.

Mastery is indicated partly by the learner's ability to perform efficiently without requiring every conceptual scaffold to remain visible.

---

# 20. Difficulty Is Multidimensional

Problem difficulty should not be represented solely by the sizes of numerators and denominators.

Important dimensions include:

### Denominator relationship

- same denominators;
- one denominator divides the other;
- denominators share a nontrivial factor;
- relatively prime denominators.

### Number of transformations required

- no fractions renamed;
- one fraction renamed;
- both fractions renamed.

### Operation

- addition;
- subtraction.

### Result structure

- proper fraction;
- whole number;
- improper fraction;
- mixed number.

### Regrouping

- none;
- composition into a whole;
- decomposition of a whole.

### Simplification

- already simplest;
- easy common factor;
- more demanding simplification.

### Representation demand

- familiar representation;
- translation between representations;
- symbolic-only work.

### Scaffold level

- highly guided;
- partially guided;
- independent.

### Arithmetic burden

- simple numerator arithmetic;
- larger intermediate values;
- multiple conversions.

Problem sequencing should vary these dimensions intentionally rather than assuming that "larger denominator" automatically means "harder problem."

---

# 21. Problem Families

Problem generation should draw from explicit instructional families.

The Math and Content Model will formally define those families, but instructionally meaningful categories should include at least:

- like-denominator proper-fraction addition;
- like-denominator proper-fraction subtraction;
- unlike denominators with one nested denominator;
- unlike denominators requiring both operands to change;
- addition producing more than one whole;
- subtraction without regrouping;
- mixed-number addition without regrouping;
- mixed-number addition requiring composition;
- mixed-number subtraction without regrouping;
- mixed-number subtraction requiring decomposition;
- simplification tasks;
- equivalent-fraction tasks;
- common-unit identification;
- magnitude and estimation checks;
- representation-transfer tasks.

These families should allow the system to reason about what skill is being practiced rather than treating every fraction expression as interchangeable.

---

# 22. Misconceptions and Error Models

FractionFlow should recognize that many incorrect responses are systematic and meaningful.

The goal is not to diagnose every possible mathematical misconception automatically, but the instructional model should distinguish recurring patterns.

---

## 22.1 Adding or subtracting denominators

Example:

\[
\frac13+\frac14=\frac27.
\]

Possible underlying issue:

The learner is treating numerator and denominator as independent whole numbers rather than understanding fractional units.

Instructional response should return attention to unit size.

---

## 22.2 Changing only the denominator

Example:

\[
\frac23=\frac2{12}.
\]

Possible underlying issue:

The learner recognizes the need for a target denominator but does not understand equivalence.

Instructional response should emphasize that subdividing changes the count of selected pieces as well as total pieces.

---

## 22.3 Applying different scaling factors inconsistently

Example:

\[
\frac23=\frac8{9}.
\]

Possible underlying issue:

The learner knows both numerator and denominator must change but has not internalized multiplication by one.

---

## 22.4 Treating a larger denominator as a larger fraction

Example:

Believing:

\[
\frac18>\frac14
\]

because \(8>4\).

Possible underlying issue:

Whole-number reasoning is being incorrectly transferred to fractional unit size.

---

## 22.5 Treating equivalent fractions as changed quantities

A learner may successfully compute:

\[
\frac23=\frac8{12}
\]

while believing that \(8/12\) is larger because the numbers are larger.

This is procedural success without conceptual equivalence.

Transfer and magnitude tasks can help expose the distinction.

---

## 22.6 Correct common denominator, incorrect equivalent numerator

Example:

\[
\frac23=\frac?{12}
\]

with an incorrect numerator.

This should be distinguished from failing to identify a useful common denominator.

The two errors represent different instructional needs.

---

## 22.7 Operation correct after conversion, conversion incorrect

The learner may correctly add the converted numerators but have generated an invalid equivalent fraction.

Feedback should target the conversion rather than reteaching addition.

---

## 22.8 Regrouping as digit manipulation

A learner may know a memorized mixed-number subtraction routine without understanding that a whole has been renamed in fractional units.

Instruction should reconnect regrouping to equivalence.

---

## 22.9 Failing to simplify

A mathematically correct but unsimplified answer is not the same error as an incorrect numerical result.

The system should preserve this distinction.

---

## 22.10 Unreasonable answers accepted uncritically

Example:

Obtaining:

\[
\frac23+\frac14=\frac{11}{3}
\]

without noticing that the result is implausibly large.

This indicates a need for stronger magnitude and estimation connections.

---

# 23. Feedback Should Target the Earliest Broken Idea

When a multi-step problem goes wrong, feedback should identify the earliest meaningful point at which the learner's reasoning diverged.

For example, in:

\[
\frac23+\frac14,
\]

a learner might:

1. select 12 as a common denominator;
2. correctly convert \(2/3\) to \(8/12\);
3. incorrectly convert \(1/4\) to \(4/12\);
4. correctly calculate \(8+4=12\).

The useful intervention concerns Step 3.

The fact that the final answer is incorrect does not mean every stage should be retaught.

This principle supports precise scaffolding and avoids replacing the learner's successful reasoning with a complete worked solution.

---

# 24. Distinguish Conceptual Errors From Arithmetic Errors

FractionFlow should avoid interpreting every incorrect answer as a fraction-concept failure.

For example, a learner who correctly constructs:

\[
\frac23=\frac8{12}
\]

and

\[
\frac14=\frac3{12}
\]

but computes:

\[
8+3=12
\]

has made a whole-number arithmetic error.

That requires a different response from a learner who attempts:

\[
\frac23+\frac14=\frac3{7}.
\]

The instructional state should preserve evidence of correctly completed fraction reasoning even when a later arithmetic error occurs.

---

# 25. Mastery Is More Than Final-Answer Accuracy

A learner should not be considered conceptually secure solely because final answers are frequently correct.

Evidence of stronger understanding includes the ability to:

- recognize equivalent fractions;
- generate equivalent fractions;
- identify common units;
- explain or demonstrate why quantities remain equal after renaming;
- predict whether an answer should be greater or less than benchmark values;
- transfer quantities among representations;
- detect unreasonable results;
- perform operations with decreasing support;
- solve analogous problems symbolically after visual practice.

Final-answer accuracy remains important, but it is one part of a broader evidence model.

---

# 26. Evidence of Emerging Understanding

The system may interpret understanding along a continuum.

## Heavily supported

The learner succeeds when:

- relevant representations are already visible;
- choices are constrained;
- intermediate transformations are supplied.

## Guided

The learner can supply:

- missing denominators;
- scaling factors;
- equivalent numerators;
- intermediate arithmetic.

## Independent with optional support

The learner solves the problem without required scaffolding but may request a representation or hint.

## Fluent

The learner:

- selects appropriate procedures efficiently;
- solves accurately;
- recognizes denominator relationships;
- identifies unreasonable outcomes;
- rarely requires conceptual support.

## Flexible

The learner additionally demonstrates:

- representation transfer;
- magnitude reasoning;
- alternative valid common denominators;
- explanation of equivalence;
- ability to recover from unfamiliar presentation.

These categories should not necessarily appear as labels to the learner. They describe the instructional model.

---

# 27. Scaffold Use Is Evidence, Not Failure

Requesting a scaffold should not be treated as equivalent to answering incorrectly.

A learner who independently recognizes:

> I don't understand this symbolically; show me the bar.

is demonstrating useful metacognitive behavior.

The system should therefore distinguish:

- incorrect reasoning;
- uncertainty;
- deliberate support requests;
- successful supported reasoning;
- successful independent reasoning.

Over time, decreasing support dependence can provide evidence of growing fluency.

---

# 28. Scaffold Fading Should Be Evidence-Based

Support should not disappear merely because a learner has completed a fixed number of problems.

Fading should be justified by evidence such as:

- repeated correct predictions;
- reliable equivalent-fraction construction;
- accurate common-unit selection;
- successful independent work;
- successful representation transfer;
- stable performance across more than one problem family.

Likewise, support may return when a new problem structure creates genuine conceptual demand.

Instruction should avoid the simplistic model:

> Level 1 has pictures; Level 2 doesn't.

A learner may need little support for like-denominator addition while still requiring substantial support for regrouping mixed numbers.

Scaffolding should therefore attach primarily to **skills and problem structures**, not to a single global learner level.

---

# 29. Retrieval and Spacing

Once a concept has begun to stabilize, it should reappear after intervening practice rather than only in uninterrupted blocks.

For example, after a learner develops success with:

- nested denominators,

later practice should occasionally revisit them while the learner is working on:

- both-denominator conversion;
- mixed numbers;
- symbolic fluency.

This helps determine whether learning persists outside the immediate instructional context.

The system should eventually support mixed review that preserves conceptual distinctions while requiring learners to recognize what kind of problem they are facing.

---

# 30. Interleaving Should Follow Initial Stability

Randomly mixing problem types too early can create unnecessary difficulty.

A learner should generally receive enough focused practice to understand a new structure before that structure is heavily interleaved with others.

A useful broad pattern is:

**introduce → focused practice → meaningful variation → mixed retrieval**

This avoids both extremes:

- endless blocked repetition;
- premature randomization.

---

# 31. Fluency Includes Strategy Selection

Efficient fraction computation is not merely faster execution of one universal algorithm.

A fluent learner may notice that:

\[
\frac12+\frac38
\]

requires only renaming \(1/2\), while:

\[
\frac23+\frac14
\]

requires a common unit for both.

A learner may also recognize convenient relationships mentally.

The system should reward mathematically efficient reasoning rather than requiring unnecessary procedural steps once understanding is secure.

Scaffolding should not become a cage.

---

# 32. Valid Alternative Methods

Where mathematically valid, the system should avoid implying that only one path is legitimate.

Examples include:

- using a non-least common denominator;
- converting mixed numbers to improper fractions;
- operating on whole and fractional parts separately;
- simplifying before or after an operation where appropriate.

The instructional model may prefer certain approaches at particular developmental stages because they expose useful concepts.

Preference should not be confused with mathematical exclusivity.

The system should distinguish:

- invalid reasoning;
- valid but inefficient reasoning;
- valid alternative reasoning.

---

# 33. Estimation and Reasonableness

Fraction arithmetic should periodically include questions that can be answered without exact calculation.

Examples:

\[
\frac{5}{8}+\frac{4}{7}
\]

is clearly greater than 1 because both fractions exceed \(1/2\).

Similarly:

\[
4\frac18-2\frac78
\]

must be somewhat greater than 1 but less than 2.

Such reasoning helps learners:

- build magnitude intuition;
- detect computation errors;
- avoid treating algorithms as disconnected symbol manipulation.

Estimation should supplement exact arithmetic rather than replace it.

---

# 34. Transfer Beyond the Training Pattern

A learner who succeeds only when a problem looks exactly like previous practice may possess fragile knowledge.

FractionFlow should periodically test whether the learner can apply concepts when:

- the representation changes;
- labels are partially removed;
- a different valid common denominator is offered;
- the problem appears in mixed-number form;
- the same quantity appears as an improper fraction;
- the order or visual orientation changes;
- a reasonable-answer question is posed instead of direct computation.

Transfer tasks should remain mathematically focused and should not depend on interface novelty for difficulty.

---

# 35. Avoid Over-Scaffolding

A scaffold can become counterproductive if it performs the reasoning that the learner should perform.

Examples include:

- automatically selecting the common denominator before the learner has practiced doing so;
- automatically converting both fractions while claiming to practice equivalent fractions;
- animating regrouping before asking the learner whether it is needed;
- displaying every intermediate step indefinitely.

The relevant question is:

> What mathematical decision is the learner responsible for making?

Every instructional episode should preserve meaningful learner responsibility.

---

# 36. Avoid False Conceptualism

Visual activity alone does not guarantee conceptual learning.

A learner can click pieces, watch animations, and manipulate bars without reasoning about the underlying mathematics.

Therefore visual interactions should be tied to mathematical decisions such as:

- predicting;
- selecting;
- matching;
- constructing;
- comparing;
- estimating;
- explaining through action.

The project should not assume that an attractive visual is educational merely because it depicts fractions.

---

# 37. Avoid False Fluency

Rapid correct answers can also hide brittle knowledge.

A learner may have memorized:

> multiply, multiply, add

without understanding:

- why equivalence preserves quantity;
- why denominators must match;
- whether the resulting magnitude is reasonable.

FractionFlow should occasionally probe conceptual structure even after symbolic performance improves.

The goal is **meaningful fluency**, not permanent conceptual interrogation and not blind speed.

---

# 38. Core Initial Instructional Scope

The initial instructional product should deeply support:

- proper fractions;
- equivalent fractions;
- common denominators;
- addition of proper fractions;
- subtraction of proper fractions;
- mixed numbers;
- addition of mixed numbers;
- subtraction of mixed numbers;
- regrouping;
- simplification;
- fraction bars;
- number lines;
- symbolic notation;
- representation transfer;
- magnitude and reasonableness checks;
- progressive scaffold fading.

The initial system does not need to encompass all fraction mathematics.

---

# 39. Instructional Stretch Areas

Possible later expansion includes:

- multiplication of fractions;
- division of fractions;
- fractions of sets;
- ratios;
- decimal-fraction connections;
- percentage connections;
- richer measurement contexts;
- word problems;
- additional visual representations;
- strategy comparison;
- more sophisticated adaptive sequencing.

These should be added only after the core fraction-addition/subtraction model is coherent and validated.

The Roadmap determines when or whether these areas enter development.

---

# 40. Instructional Success Criteria

FractionFlow is succeeding instructionally when learners increasingly demonstrate that they can:

1. interpret denominators as defining fractional units;
2. interpret numerators as counting those units;
3. compare fraction magnitudes reasonably;
4. recognize and construct equivalent fractions;
5. understand that equivalent-fraction transformations preserve quantity;
6. explain or demonstrate why unlike denominators require common units;
7. add and subtract fractions meaningfully;
8. understand mixed numbers as numerical quantities;
9. interpret regrouping as renaming a whole;
10. simplify without treating unsimplified equivalents as numerically wrong;
11. move among visual and symbolic representations;
12. detect obviously unreasonable answers;
13. solve with progressively less external support;
14. choose efficient symbolic strategies when ready;
15. retain and transfer these understandings beyond a single practiced format.

---

# 41. The Desired Learning Arc

The long-term learner experience should move approximately from:

> I can see what this fraction means.

to:

> I can see why these fractions are equivalent.

to:

> I understand why these units must match before I combine them.

to:

> I know how to rename them.

to:

> I can perform the operation.

to:

> I can tell whether my answer makes sense.

to:

> I can do this efficiently without needing the picture.

The disappearance of the picture is not the abandonment of conceptual understanding.

It is evidence that the picture has done its job.