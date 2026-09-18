# Math and Content Model

## Purpose

FractionFlow depends on a deterministic mathematical foundation.

Every generated problem, intermediate transformation, equivalent fraction, regrouping step, simplification, expected answer, and instructional classification must be derivable from exact mathematical rules rather than from generative language or presentation logic.

This document defines:

- the mathematical domain of the initial product;
- the canonical concepts and relationships the system must represent;
- mathematical invariants;
- problem families;
- meaningful difficulty dimensions;
- valid solution states and transformations;
- content-generation constraints;
- classifications needed by the instructional system;
- boundaries between mathematical truth and pedagogical choice.

This document owns the question:

> What does FractionFlow need to know about a fraction problem before anything is displayed?

It does **not** specify:

- screen layout;
- animation behavior;
- prompt wording;
- learner progression rules;
- storage formats;
- programming languages;
- software modules;
- testing technology.

Those belong elsewhere.

---

# 1. Mathematical Domain

The core FractionFlow domain includes:

- whole numbers necessary to support fraction operations;
- positive proper fractions;
- improper fractions produced during operations;
- mixed numbers;
- equivalent fractions;
- common multiples and common denominators;
- addition of fractions;
- subtraction of fractions;
- simplification;
- regrouping between whole and fractional units;
- comparisons and magnitude checks needed for instructional support.

The initial core product does not require:

- negative fractions;
- multiplication of fractions;
- division of fractions;
- algebraic rational expressions;
- irrational numbers;
- arbitrary decimal arithmetic;
- ratios as a separate mathematical domain.

Those may become future extensions.

---

# 2. Exact Arithmetic Is Required

All mathematical reasoning must use exact values.

FractionFlow must never depend on floating-point approximations to determine:

- equality of fractions;
- equivalence;
- correctness;
- common denominators;
- simplification;
- magnitude comparisons;
- final answers.

For example:

\[
\frac13
\]

must remain exactly \(1/3\), not an approximation such as \(0.333333\).

Approximate decimal representations may eventually be shown for instructional purposes, but they must not become the source of mathematical truth.

---

# 3. Canonical Fraction Concept

A fraction represents a rational quantity:

\[
\frac{n}{d}
\]

where:

- \(n\) is the numerator;
- \(d\) is the denominator;
- \(d \neq 0\).

Within the initial instructional domain, generated operands should generally use positive numerators and positive denominators.

The denominator defines the fractional unit:

\[
\frac1d.
\]

The numerator counts those units.

---

# 4. Proper, Improper, and Whole-Valued Fractions

A fraction should be classifiable as:

### Proper

\[
0<n<d.
\]

Example:

\[
\frac35.
\]

### Whole-valued

The numerator is a multiple of the denominator.

Example:

\[
\frac84=2.
\]

### Improper non-whole

\[
n>d
\]

and the fraction does not evaluate to a whole number.

Example:

\[
\frac74.
\]

These classifications matter because different instructional events may occur when a result:

- stays below one;
- reaches exactly one;
- crosses one;
- contains one or more whole units.

---

# 5. Mixed Numbers

A positive mixed number consists of:

- a nonnegative whole-number part \(w\);
- a proper fractional part \(n/d\).

It represents:

\[
w+\frac nd.
\]

For example:

\[
2\frac34
=
2+\frac34
=
\frac{11}{4}.
\]

A mixed number and its corresponding improper fraction are equivalent representations of the same quantity.

The system must be able to reason between these forms without treating one as more mathematically correct than the other.

---

# 6. Equivalent Fractions

Two fractions are equivalent when they represent the same rational number.

For nonzero \(k\):

\[
\frac nd
=
\frac{nk}{dk}.
\]

Equivalent fractions may therefore differ in:

- numerator;
- denominator;
- fractional unit size;

while preserving numerical value.

The system should distinguish between:

### Expansion

Renaming a fraction using smaller fractional units.

Example:

\[
\frac23=\frac8{12}.
\]

### Reduction

Renaming a fraction using larger fractional units.

Example:

\[
\frac8{12}=\frac23.
\]

Both are equivalence transformations.

---

# 7. Mathematical Invariants of Equivalence

Any valid equivalent-fraction transformation must preserve:

### Value

The represented number remains identical.

### Whole

The reference whole remains unchanged.

### Proportion

The selected amount relative to the whole remains unchanged.

### Scaling relationship

Numerator and denominator are multiplied or divided by the same valid factor.

A visual or symbolic state that violates any of these is mathematically invalid.

---

# 8. Simplest Form

A fraction is in simplest form when numerator and denominator share no common factor greater than 1.

For:

\[
\frac nd,
\]

simplest form requires:

\[
\gcd(n,d)=1.
\]

Example:

\[
\frac6{8}
\]

is equivalent to:

\[
\frac34,
\]

which is in simplest form.

Simplification is a preferred canonical representation, not a change in value.

---

# 9. Canonical Numerical Value and Display Form Are Distinct

FractionFlow should conceptually distinguish:

### Numerical value

The exact rational number.

### Current form

The numerator and denominator currently being used to describe it.

### Preferred final form

The conventional simplified fraction or mixed number used for final presentation when appropriate.

For example, during a problem the same exact quantity might appear as:

\[
\frac12,
\qquad
\frac36,
\qquad
\frac6{12}.
\]

The current instructional state may intentionally use an unsimplified form.

The system must therefore never silently simplify every fraction merely because a simpler form exists.

---

# 10. Common Denominators

For fractions:

\[
\frac ab
\qquad\text{and}\qquad
\frac cd,
\]

a common denominator is any positive integer divisible by both \(b\) and \(d\).

A common denominator provides a fractional unit that can represent both quantities exactly.

There may be infinitely many valid common denominators.

For example, for denominators 3 and 4:

- 12;
- 24;
- 36;
- 48;

are all valid.

---

# 11. Least Common Denominator

The least common denominator corresponds to:

\[
\operatorname{lcm}(b,d).
\]

It is usually computationally efficient, but it is not the only mathematically valid denominator.

FractionFlow should distinguish:

- **valid common denominator**;
- **least common denominator**;
- **pedagogically convenient denominator**.

These may coincide, but they are conceptually different.

---

# 12. Denominator Relationships

The relationship between operand denominators is one of the most important content classifications.

Two denominators should be classifiable as follows.

## Same

\[
b=d.
\]

Example:

\[
\frac27+\frac37.
\]

No renaming is required.

---

## Nested

One denominator divides the other.

Example:

\[
3\mid 12.
\]

Thus:

\[
\frac23+\frac5{12}
\]

requires only the thirds to be renamed.

---

## Shared-factor, non-nested

The denominators share a factor greater than 1, but neither divides the other.

Example:

\[
6 \text{ and } 8.
\]

Their least common denominator is 24 rather than their product 48.

---

## Relatively prime

The denominators share no factor greater than 1.

Example:

\[
3 \text{ and } 4.
\]

Their least common denominator is their product.

These relationships should remain available as explicit problem metadata.

---

# 13. Scale Factors for Common Units

If target denominator \(D\) is a valid multiple of \(d\), then the scale factor for:

\[
\frac nd
\]

is:

\[
k=\frac Dd.
\]

The equivalent fraction is:

\[
\frac{nk}{D}.
\]

A valid conversion therefore requires that:

- \(D\) is divisible by \(d\);
- \(k\) is a positive integer;
- numerator and denominator are scaled consistently.

This relationship should be directly knowable from mathematical state.

---

# 14. Like-Denominator Addition

For:

\[
\frac ad+\frac bd,
\]

the exact result before simplification is:

\[
\frac{a+b}{d}.
\]

The denominator remains \(d\).

The result may be:

- proper;
- exactly one;
- improper;
- reducible;
- already simplest.

These are separate classifications.

---

# 15. Unlike-Denominator Addition

For:

\[
\frac ab+\frac cd,
\]

the fractions must be expressed using a common denominator before the unit counts can be directly combined.

Using a valid common denominator \(D\):

\[
\frac ab=\frac{x}{D}
\]

and:

\[
\frac cd=\frac{y}{D}.
\]

Then:

\[
\frac{x}{D}+\frac{y}{D}
=
\frac{x+y}{D}.
\]

The system must know both:

- a mathematically valid common-unit pathway;
- the exact resulting rational value.

It may also know multiple valid pathways.

---

# 16. Like-Denominator Subtraction

For:

\[
\frac ad-\frac bd,
\]

with:

\[
a\ge b,
\]

the result before simplification is:

\[
\frac{a-b}{d}.
\]

Core generated problems should ordinarily avoid negative results unless negative fractions later become an explicit instructional extension.

---

# 17. Unlike-Denominator Subtraction

For:

\[
\frac ab-\frac cd,
\]

the operands must first be expressed using a common denominator.

Using \(D\):

\[
\frac ab=\frac{x}{D}
\]

and:

\[
\frac cd=\frac{y}{D}.
\]

Then:

\[
\frac{x-y}{D}.
\]

Core generated problems should ensure:

\[
\frac ab\ge\frac cd
\]

unless negative answers are intentionally introduced in a future scope.

---

# 18. Mixed-Number Addition

For:

\[
A\frac ab+B\frac cd,
\]

the system should know at least two mathematically valid views:

### Component view

\[
(A+B)+\left(\frac ab+\frac cd\right).
\]

### Improper-fraction view

Convert both mixed numbers to improper fractions and add.

These methods are mathematically equivalent.

The initial instructional model may prefer one representation in particular contexts, but the content model should recognize both as valid.

---

# 19. Composition During Mixed-Number Addition

When the fractional sum is at least one whole:

\[
\frac xy\ge1,
\]

one or more whole units can be composed.

For example:

\[
\frac{11}{8}
=
1+\frac38.
\]

The system should know:

- how many complete wholes are contained in the fractional result;
- the remaining fractional amount;
- whether the remainder requires simplification.

Composition is an exact regrouping relationship.

---

# 20. Mixed-Number Subtraction

For:

\[
A\frac ab-B\frac cd,
\]

the system must determine whether direct component subtraction is possible after common-unit conversion.

If the minuend fractional component is at least as large as the subtrahend fractional component, no whole-unit decomposition is necessary.

If it is smaller, regrouping is required.

---

# 21. Decomposition During Mixed-Number Subtraction

Suppose a mixed number contains:

\[
A\frac{x}{D}
\]

and the fractional component is too small for the required subtraction.

One whole may be renamed as:

\[
\frac DD.
\]

Thus:

\[
A\frac{x}{D}
=
(A-1)\frac{x+D}{D}.
\]

For example:

\[
3\frac28
=
2\frac{10}{8}.
\]

This relationship is an equivalence transformation and must preserve exact quantity.

---

# 22. Regrouping Classification

Mixed-number problems should explicitly indicate whether they require:

### No regrouping

Fractional parts can be operated upon directly after necessary denominator conversion.

### Composition

Addition of fractional parts creates at least one additional whole.

### Decomposition

Subtraction requires renaming a whole as fractional units.

These are instructionally distinct problem structures.

---

# 23. Result Forms

Every generated operation should be classifiable by result form.

Useful categories include:

- zero;
- proper fraction;
- exactly one;
- whole number greater than one;
- improper fraction;
- mixed number.

It should also be known whether the raw result:

- is already simplified;
- requires simplification;
- can be expressed as a whole;
- crosses a whole-number boundary.

---

# 24. Benchmark Magnitudes

For instructional reasoning, the system should be able to compare quantities exactly against useful benchmarks such as:

\[
0,
\qquad
\frac12,
\qquad
1,
\qquad
2,
\]

and nearby whole numbers for mixed-number operations.

A problem may therefore carry facts such as:

- both operands are greater than \(1/2\);
- the sum must exceed 1;
- the minuend is between 3 and 4;
- the exact result is between 1 and 2.

These are deterministic mathematical facts, not generated explanations.

---

# 25. Reasonableness Bounds

Where useful, a problem should support exact derivation of broad answer bounds.

For example:

\[
\frac58+\frac47
\]

has both operands greater than \(1/2\), therefore:

\[
\frac58+\frac47>1.
\]

Both operands are less than 1, therefore the sum is less than 2.

Thus:

\[
1<\text{result}<2.
\]

Such bounds can support estimation episodes and error checking.

---

# 26. Validity and Efficiency Must Be Separate

The content model must distinguish:

### Mathematically valid

A transformation or answer preserves exact mathematical truth.

### Conventionally simplified

The result is expressed in simplest conventional form.

### Efficient

The chosen method minimizes unnecessary arithmetic or transformation.

### Instructionally preferred

The method best serves the current learning target.

These concepts must not be collapsed into one notion of "correct."

For example, using 24 as the common denominator of 3 and 4 is mathematically valid but less efficient than using 12.

---

# 27. Problem Instance

A problem instance should be understood conceptually as containing enough deterministic information to reconstruct its mathematical meaning.

At minimum, it should identify:

- operation;
- operand values;
- operand forms;
- denominator relationship;
- exact result;
- simplified result;
- relevant equivalence transformations;
- common-denominator possibilities;
- regrouping requirements;
- result classification;
- applicable problem family.

Additional metadata may support instruction.

The eventual implementation schema is not specified here.

---

# 28. Problem Family

A **problem family** is a mathematically meaningful category of problems sharing an instructional structure.

Problem families should be defined by mathematical relationships, not merely by visual appearance.

For example:

> proper-fraction addition with unlike nested denominators

is a useful family.

By contrast:

> fractions with denominators below 10

is only a numeric constraint and does not describe the instructional structure.

---

# 29. Core Problem Family: Like-Denominator Proper Addition

Characteristics:

- both operands proper;
- denominators equal;
- no equivalence transformation needed;
- numerators are combined;
- result may remain proper or cross one whole.

Possible subcategories:

- result proper;
- result exactly one;
- result improper;
- result requires simplification.

---

# 30. Core Problem Family: Like-Denominator Proper Subtraction

Characteristics:

- both operands proper;
- denominators equal;
- minuend at least as large as subtrahend;
- no equivalence transformation required.

Possible subcategories:

- positive proper result;
- zero result;
- result requires simplification.

---

# 31. Core Problem Family: Nested-Denominator Addition

Characteristics:

- denominators differ;
- one denominator divides the other;
- only one operand requires renaming to reach the least common denominator.

Example:

\[
\frac12+\frac38.
\]

This family provides a relatively simple introduction to common units.

---

# 32. Core Problem Family: Nested-Denominator Subtraction

Characteristics:

- denominators differ;
- one denominator divides the other;
- one operand requires renaming;
- result remains nonnegative.

Example:

\[
\frac56-\frac13.
\]

---

# 33. Core Problem Family: Shared-Factor Addition

Characteristics:

- denominators differ;
- neither denominator divides the other;
- denominators share a nontrivial factor;
- both operands usually require renaming.

Example:

\[
\frac16+\frac38.
\]

The least common denominator is smaller than the denominator product.

This family supports later efficiency reasoning.

---

# 34. Core Problem Family: Shared-Factor Subtraction

Characteristics mirror shared-factor addition, with a nonnegative result.

Example:

\[
\frac56-\frac38.
\]

---

# 35. Core Problem Family: Relatively Prime Addition

Characteristics:

- denominators share no factor greater than 1;
- both fractions require renaming;
- least common denominator equals denominator product.

Example:

\[
\frac23+\frac14.
\]

---

# 36. Core Problem Family: Relatively Prime Subtraction

Characteristics mirror relatively prime addition.

Example:

\[
\frac56-\frac14.
\]

---

# 37. Core Problem Family: Mixed Addition Without Composition

Characteristics:

- one or both operands are mixed numbers;
- fractional components can be added;
- resulting fractional component remains less than one;
- no additional whole is formed.

---

# 38. Core Problem Family: Mixed Addition With Composition

Characteristics:

- one or both operands are mixed numbers;
- fractional components sum to at least one;
- one or more additional wholes are composed.

This family should retain information about whether:

- denominators already match;
- one fractional component requires conversion;
- both require conversion.

---

# 39. Core Problem Family: Mixed Subtraction Without Decomposition

Characteristics:

- mixed-number subtraction;
- after denominator conversion, the minuend fractional component is large enough;
- no whole must be renamed.

---

# 40. Core Problem Family: Mixed Subtraction With Decomposition

Characteristics:

- mixed-number subtraction;
- after necessary conversion, the minuend fractional part is smaller;
- one whole must be decomposed into fractional units.

This family may contain additional denominator complexity and should therefore be parameterized carefully.

---

# 41. Focused Equivalence Problems

Not all problems need to be full operations.

Equivalent-fraction problem families may include:

### Complete the numerator

\[
\frac23=\frac?{12}.
\]

### Complete the denominator

\[
\frac34=\frac9{?}.
\]

### Identify the scale factor

\[
\frac35\rightarrow\frac{?}{20}.
\]

### Judge equivalence

Determine whether two forms represent the same value.

### Generate an equivalent form

Produce a valid equivalent fraction under a specified constraint.

These may support prerequisite understanding and conceptual repair.

---

# 42. Focused Common-Unit Problems

Possible content families include:

- identify one valid common denominator;
- identify the least common denominator;
- distinguish valid from invalid common denominators;
- determine which operand or operands need renaming;
- compare two valid common denominators for efficiency.

These tasks isolate common-unit reasoning from full arithmetic.

---

# 43. Focused Magnitude Problems

Possible families include:

- compare two fractions;
- place a fraction relative to \(0\), \(1/2\), and \(1\);
- determine whether a sum exceeds one;
- estimate the interval containing a result;
- identify an obviously unreasonable answer.

These support the magnitude goals defined in the Instructional Model.

---

# 44. Focused Regrouping Problems

Before or alongside full mixed-number subtraction, content may isolate the equivalence:

\[
3\frac14
=
2\frac54.
\]

or:

\[
4\frac28
=
3\frac{10}{8}.
\]

These problems should emphasize renaming rather than arithmetic complexity.

---

# 45. Representation-Transfer Content

A transfer problem must still be grounded in exact mathematical state.

Examples include:

- identify the number-line location corresponding to a fraction bar;
- match an equivalent symbolic label to a fixed quantity;
- identify which visual state preserves the original value;
- convert a mixed-number quantity between symbolic forms.

Representation mechanics belong to the Interaction Grammar, but the underlying quantities and equivalences belong here.

---

# 46. Difficulty Dimensions

Difficulty should be modeled through multiple mathematically meaningful dimensions.

No single scalar "difficulty" should erase these distinctions.

Important dimensions include:

- denominator relationship;
- denominator size;
- numerator size;
- number of operands requiring conversion;
- scale-factor size;
- whether a common denominator is obvious;
- operation;
- result crossing a whole;
- simplification requirement;
- mixed-number presence;
- composition requirement;
- decomposition requirement;
- number of sequential transformations;
- arithmetic burden;
- representation-transfer demand.

A later sequencing system may combine these dimensions, but their underlying distinctions should remain available.

---

# 47. Denominator Size Is Not Sufficient Difficulty

Consider:

\[
\frac12+\frac{7}{16}
\]

versus:

\[
\frac27+\frac35.
\]

The first includes a larger denominator but has a simple nested relationship.

The second has smaller numbers but requires finding a common unit for relatively prime denominators.

Therefore difficulty must not be based primarily on numerical size.

---

# 48. Arithmetic Burden Should Be Controlled

When teaching a fraction concept, unrelated arithmetic difficulty should ordinarily remain modest.

For example, an introductory common-denominator task should not require difficult multiplication facts unless those facts are themselves relevant.

Problem generation should control:

- scale factors;
- intermediate numerators;
- whole-number sums;
- whole-number differences.

The fraction concept should remain the primary source of challenge.

---

# 49. Content Generation Must Be Constraint-Based

Generated problems should come from explicit constraints associated with a problem family.

The system should not generate arbitrary fractions and then hope they form a useful instructional problem.

A problem family may constrain:

- denominator relationship;
- numerator ranges;
- whether results cross a whole;
- whether simplification occurs;
- whether regrouping is required;
- whether common denominators remain manageable;
- whether intermediate values remain child-appropriate.

Generation should therefore begin with the intended mathematical structure.

---

# 50. Generation Should Avoid Accidental Complexity

A generated problem may satisfy one intended property while accidentally introducing several others.

For example, a problem intended to practice denominator conversion might accidentally:

- produce an improper result;
- require simplification;
- cross a whole;
- contain large multiplication facts.

Unless those are intentional, the generator should reject such an instance.

Every generated problem should be checked against its intended instructional profile.

---

# 51. Generation Should Also Avoid Trivial Degeneracy

Some randomly generated instances may technically fit a family while removing the intended reasoning.

Examples include:

- an operand equal to zero when zero is not the focus;
- two "different" denominators that accidentally reduce to an easier relationship after operand simplification;
- subtraction producing zero too frequently;
- equivalent fractions already written with matching denominators in an unlike-denominator family;
- mixed numbers with zero fractional components.

Such cases may be useful intentionally, but should not appear accidentally.

---

# 52. Operands Should Generally Begin in Meaningful Form

Unless simplification itself is being taught, generated starting operands should ordinarily be in simplest form.

For example, prefer:

\[
\frac23
\]

over:

\[
\frac46
\]

as a starting operand in an addition problem.

This avoids introducing unnecessary ambiguity about whether simplification should occur before the target skill.

Unsimplified operands may later be introduced deliberately for strategy flexibility.

---

# 53. Results May Intentionally Require Simplification

Result simplification can be a meaningful part of an episode.

For example:

\[
\frac14+\frac14
=
\frac24
=
\frac12.
\]

Problem metadata should distinguish:

- result already simplest;
- result reducible;
- result whole-valued.

Simplification may be included or excluded intentionally based on the instructional purpose.

---

# 54. Multiple Valid Solution Paths

A single problem may admit several valid mathematical paths.

For example:

\[
\frac13+\frac14
\]

may use:

\[
12,\ 24,\ 36,\ldots
\]

as common denominators.

Similarly, a mixed-number operation may be solved through:

- component reasoning;
- improper fractions.

The content model should preserve the distinction between:

- canonical instructional path;
- alternate valid path;
- invalid path.

It should not define one valid pathway as mathematical truth merely because the curriculum prefers it.

---

# 55. Canonical Instructional Path

For reproducibility and vetted visuals, a problem may have a designated **canonical instructional path**.

For unlike-denominator operations, this will often use the least common denominator.

A canonical path provides:

- a stable visual transformation;
- a stable sequence for authored explanations;
- predictable testing;
- reproducible episodes.

Canonical does not mean uniquely valid.

This distinction should remain explicit.

---

# 56. Alternate Common Denominators

If a learner supplies a valid non-least common denominator, the system should be able to recognize it as valid.

For example:

\[
24
\]

is a valid common denominator for thirds and fourths.

The instructional response may later highlight:

\[
12
\]

as more efficient.

The content model must never mark mathematically valid equivalence as incorrect solely because it differs from the canonical path.

---

# 57. Equivalent Answer Recognition

Mathematical correctness should be based on exact value.

Therefore answers such as:

\[
\frac6{8}
\]

and:

\[
\frac34
\]

represent the same numerical result.

The system may distinguish:

- correct and simplified;
- correct but not simplified;
- incorrect.

Likewise:

\[
1\frac12
\]

and:

\[
\frac32
\]

are equivalent.

Instructional expectations may prefer one form, but equivalence should be recognized.

---

# 58. Intermediate-Step Validation

When the learner supplies an intermediate value, the system should be able to validate that step independently.

Examples include:

- proposed common denominator;
- proposed scale factor;
- proposed equivalent numerator;
- regrouped mixed-number form;
- unsimplified operation result;
- simplified result.

This supports local feedback.

Final-answer correctness should not be the only mathematically inspectable state.

---

# 59. Common-Denominator Validation

A proposed common denominator \(D\) for denominators \(b\) and \(d\) is valid when:

\[
b\mid D
\]

and:

\[
d\mid D.
\]

The system should therefore distinguish:

- invalid;
- valid;
- least valid;
- valid but unusually large.

Instructional policy may decide how broad a range to accept.

---

# 60. Equivalent-Fraction Validation

A proposed fraction:

\[
\frac xy
\]

is equivalent to:

\[
\frac nd
\]

when:

\[
xd=ny.
\]

This exact relationship allows equivalence to be validated independently of the particular method the learner used.

---

# 61. Mixed-Number Equivalence Validation

A proposed mixed number:

\[
w\frac nd
\]

represents:

\[
\frac{wd+n}{d}.
\]

Any regrouped or converted form should be validated by exact equality with the original quantity.

This permits the system to recognize multiple correct regrouping forms where appropriate.

---

# 62. Error Pattern Classification

The mathematical layer should make it possible to recognize common incorrect structures without claiming certainty about the learner's mental state.

Possible detectable patterns include:

- numerator and denominator both added;
- denominator changed while numerator stayed fixed;
- numerator changed with incorrect scale factor;
- common denominator invalid;
- correct denominator but incorrect equivalent numerator;
- correct conversions but arithmetic error;
- correct unsimplified result;
- incorrect regrouping quantity;
- mathematically equivalent alternate form.

These are response classifications, not psychological diagnoses.

The Instructional Model owns interpretation.

---

# 63. Do Not Infer More Than the Mathematics Shows

If a learner enters:

\[
\frac27
\]

for:

\[
\frac13+\frac14,
\]

the system may recognize that the response matches the pattern:

\[
\frac{1+1}{3+4}.
\]

It should not claim with certainty:

> You believe numerators and denominators should always be added independently.

The response supports an instructional hypothesis, not definitive knowledge of the learner's thinking.

---

# 64. Content Metadata Should Support Review

A generated problem should be describable in a way that permits human reviewers to understand why it belongs in a sequence.

Useful conceptual metadata includes:

- family;
- denominator relationship;
- common denominator;
- scale factors;
- regrouping type;
- result type;
- simplification status;
- magnitude range;
- intended target concept;
- likely alternate valid paths.

The implementation format belongs to the architecture specification.

---

# 65. Content Should Be Reproducible

A generated problem sequence should be reproducible from known inputs.

Reproducibility supports:

- debugging;
- pedagogy review;
- regression testing;
- sharing examples;
- comparing revisions.

Random selection may be used, but the mathematical content should never become irrecoverably random.

---

# 66. Curated Cases and Generated Cases Should Coexist

Not every valuable problem should be procedurally generated.

FractionFlow may contain:

### Generated cases

Useful for:

- routine practice;
- spacing;
- varied numerical instances.

### Curated cases

Useful for:

- particularly elegant equivalence relationships;
- bridge episodes;
- misconceptions;
- benchmark reasoning;
- visually informative transformations;
- demonstrations of strategy efficiency.

A curated problem can be valuable precisely because its numbers reveal something particularly clearly.

---

# 67. Some Numbers Are Pedagogically Better Than Others

Mathematically valid does not imply equally useful instructionally.

For early fraction work, denominators such as:

- 2;
- 3;
- 4;
- 5;
- 6;
- 8;
- 10;
- 12;

often permit understandable relationships and manageable visual subdivisions.

Larger or awkward denominators may be introduced later when they serve a clear purpose.

The initial content system should permit deliberate control over denominator sets rather than treating every integer equally.

---

# 68. Visual Feasibility Is a Content Constraint

Because FractionFlow uses vetted visual representations, mathematical generation must respect visual legibility.

A denominator may be mathematically appropriate but visually poor if it requires:

- excessive subdivisions;
- tiny indistinguishable pieces;
- dense tick marks;
- cluttered labels.

The content model should therefore support constraints such as:

- maximum practical denominator for a given representation;
- maximum visual subdivision count;
- alternate representation recommendation.

Exact thresholds belong to later design and validation work.

---

# 69. Representation Feasibility Can Differ

A fraction may be suitable for one representation and awkward in another.

For example:

- twelfths may remain quite clear in a long bar;
- twelfths may be more crowded in a small circle;
- larger mixed numbers may fit naturally on a number line but poorly as repeated circles.

The content model should permit representation-specific eligibility without changing the mathematics.

---

# 70. Whole Consistency Must Be Knowable

For any visual state, the mathematical content must establish what represents one whole.

This may include:

- one bar length;
- one interval from integer \(n\) to \(n+1\);
- one complete circle;
- one complete collection when discrete-set representations are eventually used.

Presentation may vary, but the mathematical reference whole must remain unambiguous.

---

# 71. Number-Line State

For number-line representations, the content model should support exact facts such as:

- interval start;
- interval end;
- unit partition;
- exact fraction location;
- equivalent labels occupying the same point;
- operation start point;
- operation displacement;
- operation endpoint.

The renderer should consume these facts rather than infer them independently.

---

# 72. Bar-Model State

For bar representations, the content model should support exact facts such as:

- whole length as one unit;
- denominator partition count;
- selected numerator count;
- equivalent subdivision relationship;
- combined unit count;
- regrouped whole count.

Again, the visual layer should not invent these relationships.

---

# 73. Symbolic Transformation State

A symbolic episode may require a sequence such as:

\[
\frac23+\frac14
\]

\[
=\frac8{12}+\frac3{12}
\]

\[
=\frac{11}{12}.
\]

Each equality must be mathematically valid independently.

The system should not treat symbolic text as an arbitrary string generated for display.

---

# 74. Intermediate Forms Should Be Intentional

There may be several possible symbolic intermediate forms.

For example:

\[
2\frac34+1\frac58
\]

could proceed through component addition or improper fractions.

A canonical episode should choose an intentional path.

The system should avoid producing inconsistent mixtures of methods unless comparison itself is the instructional goal.

---

# 75. Content Constraints Should Protect Conceptual Focus

A problem intended to teach one idea should minimize unrelated complications.

Examples:

### Teaching equivalence

Prefer values where multiplication facts are manageable.

### Teaching common units

Avoid unnecessary mixed-number regrouping.

### Teaching regrouping

Avoid unusually difficult denominator relationships initially.

### Teaching symbolic independence

Previously understood mathematical structures may be combined more freely.

Content selection should serve the intended focus.

---

# 76. Concept Dependencies

Important conceptual dependencies include:

### Fraction operations depend on unit interpretation.

### Unlike-denominator operations depend on equivalence.

### Common-denominator reasoning depends on common multiples.

### Mixed-number regrouping depends on equivalence between one whole and \(d/d\).

### Efficient LCD selection depends on denominator relationships.

### Simplification depends on equivalence and common factors.

The content model should make these relationships visible to sequencing systems without defining the learner progression itself.

---

# 77. Core Content Boundaries for the Initial Product

The initial content system should support denominators and values sufficient to provide rich practice without unnecessary numerical complexity.

Exact numeric limits should be determined through design and validation, but early development should favor:

- manageable denominators;
- modest scale factors;
- visually legible subdivisions;
- child-appropriate whole-number arithmetic;
- positive results;
- mixed numbers with modest whole-number parts.

The goal is depth across meaningful problem structures, not maximal numeric range.

---

# 78. Stretch Content

Possible later mathematical expansion includes:

- multiplication of fractions;
- division of fractions;
- negative rational numbers;
- decimals;
- percentages;
- ratios and proportions;
- measurement conversion;
- fraction word problems;
- fractions of sets;
- open-ended strategy comparison.

These should extend the existing exact-value model rather than require a fundamentally different notion of mathematical truth.

---

# 79. Content Anti-Patterns

The following should be avoided.

## Arbitrary random fractions

Generate operands first and classify them afterward without regard to instructional structure.

## Floating-point truth

Determine correctness using decimal approximations.

## Renderer mathematics

Let visual code independently calculate subdivisions or equivalent fractions.

## Canonical-path absolutism

Mark a valid alternative method incorrect because it differs from the preferred sequence.

## Silent simplification

Automatically reduce forms that are intentionally being studied.

## Accidental difficulty stacking

Allow a simple target concept to acquire multiple unrelated complications.

## Number-size difficulty

Assume larger denominators automatically imply a harder problem.

## Visual impossibility

Generate mathematically valid problems that cannot be represented clearly in the active visual system.

---

# 80. Canonical Example: Unlike-Denominator Addition

Consider:

\[
\frac23+\frac14.
\]

The mathematical content includes:

### Operands

\[
\frac23,\qquad\frac14.
\]

### Classification

- proper fractions;
- addition;
- unlike denominators;
- relatively prime denominators.

### Least common denominator

\[
12.
\]

### Scale factors

\[
3\rightarrow12: \times4
\]

\[
4\rightarrow12: \times3.
\]

### Equivalent forms

\[
\frac23=\frac8{12}
\]

\[
\frac14=\frac3{12}.
\]

### Raw result

\[
\frac{11}{12}.
\]

### Final result

\[
\frac{11}{12}.
\]

### Result properties

- proper;
- less than 1;
- already simplest.

### Alternate valid denominators

\[
24,\ 36,\ 48,\ldots
\]

The interaction layer may decide which of these facts to expose.

The mathematical model must know them independently.

---

# 81. Canonical Example: Mixed-Number Subtraction With Decomposition

Consider:

\[
3\frac14-1\frac58.
\]

### Initial values

\[
3\frac14,
\qquad
1\frac58.
\]

### Fractional denominators

4 and 8.

### Denominator relationship

Nested.

### Common unit

Eighths.

### Converted minuend

\[
3\frac28.
\]

### Subtrahend

\[
1\frac58.
\]

### Regrouping requirement

Decomposition required because:

\[
\frac28<\frac58.
\]

### Equivalent regrouped minuend

\[
3\frac28
=
2\frac{10}{8}.
\]

### Subtraction

\[
2\frac{10}{8}-1\frac58
=
1\frac58.
\]

### Final result

\[
1\frac58.
\]

The visual and instructional systems may reveal these states gradually.

They must not invent them.

---

# 82. Canonical Example: Valid but Non-Minimal Common Denominator

Consider:

\[
\frac13+\frac14.
\]

A learner chooses 24.

The system should know:

### 24 is valid

because both:

\[
3\mid24
\]

and:

\[
4\mid24.
\]

### Converted forms

\[
\frac13=\frac8{24}
\]

\[
\frac14=\frac6{24}.
\]

### Result

\[
\frac{14}{24}
=
\frac7{12}.
\]

### Efficiency fact

12 is the least common denominator.

Therefore 24 is:

- mathematically valid;
- non-minimal;
- less efficient than 12 for this problem.

This distinction is essential to useful feedback.

---

# 83. Canonical Example: Correct but Unsimplified Result

Consider:

\[
\frac14+\frac14.
\]

Raw operation result:

\[
\frac24.
\]

Simplified result:

\[
\frac12.
\]

If a learner answers:

\[
\frac24,
\]

the mathematical state is:

- correct value;
- valid operation result;
- not simplest form.

It is not simply "wrong."

---

# 84. Content Review Questions

When adding a problem family or generation rule, reviewers should ask:

1. What mathematical structure does this family isolate?
2. What exact invariants must always hold?
3. Which transformations are valid?
4. Which transformations are canonical but not uniquely valid?
5. What accidental complications must generation avoid?
6. What meaningful subcategories exist?
7. What intermediate learner responses can be validated?
8. What alternate correct answers should be accepted?
9. What visual constraints affect usable instances?
10. What metadata does instruction need from this family?

If these answers are unclear, the family is not yet specified well enough for implementation.

---

# 85. Final Mathematical Contract

For every FractionFlow problem, the deterministic mathematical system should be able to answer:

- What exact quantities are present?
- What forms currently represent them?
- Are those forms equivalent?
- What kind of fractional units are being counted?
- What denominator relationship exists?
- What common denominators are valid?
- What is the least common denominator?
- What conversion factors are valid?
- Which operands require renaming?
- Is regrouping required?
- What intermediate forms are mathematically valid?
- What is the exact result?
- Is the result simplified?
- What alternate forms represent the same result?
- What broad magnitude facts are true?
- What problem family does this instance belong to?
- What mathematically valid alternate solution paths exist?

Presentation and instruction may choose to reveal only a small subset of this information.

The mathematical foundation should nevertheless know the complete, exact answer.

FractionFlow should never need to ask a visual component, a language model, or a learner-facing explanation what the mathematics is.