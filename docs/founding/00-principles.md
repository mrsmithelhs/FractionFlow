# Founding Principles

## Purpose

This project is a free, browser-based learning environment for practicing fraction addition and subtraction while strengthening the conceptual understanding that makes those procedures meaningful.

The system is intended especially for learners who can benefit from seeing mathematical ideas represented concretely before being asked to manipulate them symbolically. It should help a learner move from visual and conceptual reasoning toward efficient symbolic work without treating those as separate kinds of mathematics.

The project is not primarily a worksheet generator, a video lesson library, a virtual-manipulative sandbox, or an AI tutor. Its distinctive goal is to create short, interactive mathematical narratives in which a learner acts, observes mathematically meaningful transformations, and gradually assumes more responsibility for the reasoning.

This document defines the principles that constrain all other specifications and implementation decisions.

---

# 1. The Mathematics Is the Interface

The central object on screen should be the mathematical idea currently under consideration.

A fraction bar, number line, mixed number, equation, or equivalent-fraction transformation should not be treated as content placed inside a conventional application dashboard. The mathematical representation itself should carry as much of the interaction as possible.

Prefer:

- touching or selecting a mathematical object;
- subdividing an existing fraction bar;
- moving or marking a point on a number line;
- transforming one representation into another;
- entering a missing mathematical value directly where it belongs.

Avoid unnecessary application chrome such as:

- persistent control panels;
- collections of independent widgets;
- toolbars that expose every available operation;
- status cards;
- instructional sidebars;
- dashboards;
- persistent explanatory panels.

The application should feel more like an interactive mathematical illustration than a productivity application.

---

# 2. One Focal Idea at a Time

At any moment, the learner should be able to answer:

> What am I thinking about right now?

The interface should ordinarily present one primary mathematical question, decision, or transformation at a time.

Multiple representations may exist within the system, but they should not ordinarily compete simultaneously for attention.

For example, a learner should not be expected to coordinate:

- a fraction bar,
- a pie chart,
- a number line,
- an equation,
- and a hint panel

all changing in parallel.

When multiple representations are educationally valuable, the system should normally transition between them or deliberately juxtapose them for one clearly defined comparison.

**Multiple representations does not mean simultaneous representations.**

---

# 3. Preserve the Mathematical Object Across Representations

When changing representations, preserve continuity.

The learner should experience:

> This is the same mathematical quantity viewed differently.

rather than:

> Here is a second diagram about the same problem.

Whenever reasonably possible, representations should transform into one another in a way that exposes their relationship.

Examples include:

- a fraction bar subdividing while its total length remains unchanged;
- a shaded length flattening into a number line while its endpoint remains fixed;
- a point remaining stationary while additional number-line subdivisions appear;
- visual fraction pieces combining and then resolving into symbolic notation;
- one whole in a mixed number being regrouped into fractional units without appearing to create or destroy quantity.

Animation should emphasize invariants:

- the amount did not change;
- the point did not move;
- the whole remained the same;
- only the unit or name changed.

Representation changes are instructional events, not visual effects.

---

# 4. Equivalent Fractions Are Renamings, Not Tricks

Equivalent fractions should be presented as different descriptions of the same quantity.

The system should help learners understand ideas such as:

\[
\frac{2}{3}=\frac{8}{12}
\]

before reducing the process to the procedural shorthand of multiplying numerator and denominator by the same number.

Visual transformations should make clear that:

- each existing unit is subdivided into smaller equal units;
- the number of selected pieces changes because the size of the pieces changes;
- the total represented amount remains invariant;
- multiplying by a fraction such as \(4/4\) is multiplication by one.

The phrase "common denominator" should be connected to the more fundamental idea of choosing a **common unit size**.

Procedural vocabulary may be taught, but terminology should follow meaning rather than substitute for it.

---

# 5. Procedures Should Grow Out of Meaning

The system should not force a choice between conceptual understanding and computational fluency.

The intended progression is:

**meaning → guided procedure → increasingly independent procedure → fluency**

Learners should eventually become capable of efficiently performing symbolic fraction arithmetic without constructing or viewing a model for every problem.

Visual models therefore function as **scaffolds and explanatory representations**, not permanent requirements.

A successful learner should need less visible support over time.

The system should not implicitly teach that a symbolic solution is less legitimate, less sophisticated, or incomplete because no diagram accompanied it.

---

# 6. Scaffolds Should Fade

Support should be removable in small, meaningful increments.

Examples of scaffold dimensions include:

- whether a visual representation is visible;
- whether possible common denominators are supplied;
- whether the learner must identify a common denominator;
- whether equivalent-fraction numerators are supplied;
- whether subdivisions appear automatically;
- whether the learner must predict a transformation before seeing it;
- whether the application asks intermediate questions;
- whether a visual explanation is presented automatically or available only on request.

The preferred direction of progress is toward greater learner responsibility.

Do not create separate "easy" and "real math" experiences. The same mathematical environment should become quieter as mastery develops.

A useful design test is:

> What can disappear from this interaction once the learner understands it?

---

# 7. Animation Must Carry Mathematical Meaning

Animation is justified when motion communicates a mathematical relationship that would otherwise be harder to perceive.

Appropriate uses include:

- subdividing units;
- preserving position while relabeling an equivalent fraction;
- joining equal-size pieces during addition;
- removing pieces during subtraction;
- moving forward or backward on a number line;
- regrouping a whole into fractional units;
- transforming one representation into another.

Animation should not be added merely to make the application feel lively.

Avoid:

- decorative bouncing;
- unnecessary card movement;
- arbitrary transitions;
- excessive celebratory effects;
- motion that obscures the mathematical state.

Important transformations should generally occur **because of learner reasoning**.

Whenever practical:

1. ask the learner to make a prediction or choice;
2. record the response;
3. animate the mathematical consequence.

The animation then becomes feedback rather than passive entertainment.

Reduced-motion preferences must be supported without removing mathematical information.

---

# 8. Repetition Should Create Familiarity; Variation Should Create Thought

The system should establish a consistent interaction grammar.

A learner who has solved several problems should increasingly understand:

- what kind of response is expected;
- how equivalent-fraction transformations behave;
- what subdivision means;
- how addition and subtraction are represented;
- what happens when support is requested.

This consistency conserves working memory for mathematics.

Variation should occur primarily in mathematically meaningful dimensions:

- numerator and denominator values;
- operation;
- relationships between denominators;
- whether one or both fractions require renaming;
- whether regrouping is required;
- whether a result crosses a whole-number boundary;
- representation used for a deliberate transfer task;
- amount of scaffolding.

Avoid superficial variation that forces learners to repeatedly decode the interface.

The desired rhythm is closer to:

**theme → repetition → meaningful variation → transfer**

than to randomized novelty.

---

# 9. Representation Variety Should Be Purposeful

Representations are not interchangeable decorations.

Each representation should earn its place by exposing a useful mathematical structure.

The initial foundational representations are expected to be:

### Fraction bars

Particularly useful for:

- part-whole relationships;
- unit size;
- equivalence through subdivision;
- common denominators;
- visually combining quantities;
- regrouping.

### Number lines

Particularly useful for:

- fractions as numbers;
- magnitude;
- equivalence as identical location;
- addition and subtraction as movement or distance;
- mixed numbers;
- relationships to whole numbers.

### Symbolic notation

Essential for:

- concise mathematical communication;
- generalization;
- efficient computation;
- eventual fluency.

Additional representations should be introduced only when they provide a distinct instructional benefit.

Possible future representations might include:

- circles;
- sets of discrete objects;
- measurement contexts;
- clocks;
- recipes;
- physical-piece metaphors.

The project should prefer a few representations used deeply over many representations used superficially.

---

# 10. Representation Transfer Is a Skill

Students should sometimes be asked to translate between representations rather than merely observe multiple forms.

Examples:

- locate a bar-model fraction on a number line;
- predict where an equivalent fraction will appear before tick marks are added;
- identify the symbolic fraction represented by a visual quantity;
- predict how a fraction bar will change when its denominator changes;
- reconstruct a visual model from symbolic information.

These interactions should be deliberate and occasional.

Most routine practice should occur within a stable representation long enough for the learner to develop fluency.

Representation changes should often appear as **bridge episodes** between periods of stable practice rather than as constant switching.

---

# 11. The Whole Must Remain Stable

Fraction representations are meaningful only relative to a clearly understood whole.

Visual designs must avoid accidentally changing the apparent whole while demonstrating equivalence or operations.

Particular caution is required when using:

- resizable objects;
- circles of different sizes;
- discrete sets;
- puzzle-piece metaphors;
- mixed numbers containing several wholes.

If a visual representation makes it difficult to determine what constitutes one whole, it should be redesigned or rejected.

This principle takes priority over visual novelty.

---

# 12. Deterministic Mathematics, Authored Instruction

The system must never depend on a generative language model to determine:

- whether an answer is mathematically correct;
- what an equivalent fraction is;
- what common denominators are valid;
- what a resulting fraction should be;
- how regrouping works;
- what mathematical state an animation should display.

All mathematical state must be computed deterministically using exact arithmetic.

Likewise, core instructional explanations and transformations should come from authored and reviewed interaction patterns rather than runtime-generated prose.

The system may generate **instances**, but not invent mathematics.

A useful rule is:

> The system improvises problem instances, not mathematical explanations.

Problem generation, feedback, visual states, and progression rules must therefore be testable and reproducible.

---

# 13. Separate Mathematical Truth From Presentation

The same mathematical state should be capable of being rendered in multiple ways without recalculation by the renderer.

Conceptually:

**mathematical state → instructional state → presentation**

A visual component should not determine mathematical truth.

An animation should not derive the next fraction.

Instructional wording should not calculate an answer.

The presentation layer receives validated state and communicates it.

This separation supports:

- correctness;
- testing;
- alternate representations;
- accessibility;
- future interface changes;
- safer agent-assisted development.

Exact implementation boundaries belong in the system architecture specification, but this separation is a founding principle.

---

# 14. Errors Are Instructional Information

Incorrect answers should not be treated merely as failures to be replaced by the correct answer.

When feasible, the system should distinguish meaningful error categories.

Examples include:

- adding denominators;
- changing a denominator without changing the numerator;
- finding a valid denominator but converting incorrectly;
- treating unlike units as like units;
- regrouping a whole incorrectly;
- confusing equivalent fractions with larger or smaller quantities;
- arithmetic errors after the fraction concept has been handled correctly.

Feedback should target the smallest conceptual or procedural step that needs attention.

The application should avoid immediately revealing an entire worked solution when a smaller intervention could preserve productive thinking.

Incorrect attempts should also not trigger shame-oriented presentation, punitive language, or exaggerated failure states.

---

# 15. Ask Before Telling When Reasonable

When a learner is capable of predicting a mathematical transformation, the application should often ask first.

For example:

> If thirds are divided into four smaller pieces each, what denominator will we have?

is generally preferable to immediately animating thirds into twelfths and then explaining the result.

Likewise:

> Will this point move when \(2/3\) is renamed as \(8/12\)?

can make an equivalence animation more meaningful.

This does not mean every animation needs a question.

Prompts should be used where prediction directs attention to the concept being learned, not merely to increase interaction count.

---

# 16. Preserve Productive Struggle Without Creating Friction

A learner should sometimes need to think before receiving assistance.

However, difficulty should come from the mathematics rather than from:

- interpreting an unusual interface;
- discovering hidden controls;
- remembering arbitrary interaction conventions;
- excessive typing;
- precision dragging;
- confusing animations;
- unnecessary reading.

Hints and scaffolds should become available before frustration overwhelms the instructional value of the task.

The system should distinguish between:

**productive mathematical difficulty**

and

**software difficulty**.

Only the first is desirable.

---

# 17. Accessibility Is Part of the Learning Design

Accessibility should not be treated as final-stage compliance work.

The core interactions should support:

- keyboard operation;
- touch operation;
- reasonable screen-reader interpretation where feasible;
- sufficient contrast;
- readable type;
- reduced motion;
- layouts usable on small screens;
- interaction targets appropriate for children;
- clear focus states;
- alternatives to precision-dependent dragging.

Visual distinctions should not rely exclusively on color.

Animations should leave behind a stable state that can be inspected after motion ends.

The project should favor interactions that can be made broadly accessible over interactions whose educational value depends on difficult-to-access mechanics.

---

# 18. Calmness Is a Functional Requirement

The interface should protect attention.

Whitespace, typography, pacing, and restraint are instructional tools.

The system should avoid unnecessary:

- badges;
- points;
- streak counters;
- confetti;
- progress dashboards;
- avatars;
- side quests;
- decorative panels;
- notifications;
- competing calls to action.

This does not require the system to be sterile.

Warmth, humor, satisfying motion, visual polish, and occasional celebration are welcome when they support the learner's experience.

The design goal is **delight without distraction**.

---

# 19. Progress Should Be Felt Primarily as Growing Capability

The learner's strongest evidence of progress should be:

- needing fewer prompts;
- solving harder problem structures;
- working more efficiently;
- requesting fewer visual supports;
- moving confidently between representations;
- recognizing unreasonable answers;
- completing symbolic work independently.

External progress systems may eventually supplement these experiences, but they should not become the primary reason to continue.

A learner should ideally notice:

> I used to need the picture for this. Now I don't.

That is a major success state.

---

# 20. Free and Low-Friction by Default

The project is intended to be freely usable.

The core learning experience should not require:

- payment;
- advertising;
- account creation;
- student personal information;
- a school-managed deployment;
- proprietary software.

A static-hosting-compatible architecture such as GitHub Pages is preferred where it does not compromise the instructional goals.

Core practice should work locally in the browser whenever reasonably possible.

Future features requiring accounts, servers, analytics, synchronization, or cloud persistence should justify the additional complexity and privacy implications.

---

# 21. Privacy Should Follow Data Minimization

The system should collect no learner data merely because collection is technically convenient.

If progress can be stored locally, that should generally be preferred over requiring an account.

If future features introduce remote storage, the project must explicitly define:

- what information is collected;
- why it is necessary;
- how long it is retained;
- who can access it;
- how it can be deleted.

The core instructional product should remain useful without surveillance.

---

# 22. Content Expansion Must Preserve Coherence

New problem types, representations, animations, or features should not be added merely because they are easy to implement.

Before adding something, ask:

1. What learning need does this address?
2. Which existing representation or interaction cannot address it adequately?
3. Does it introduce a new interaction convention?
4. Does it increase cognitive load?
5. Can an existing interaction be extended instead?
6. What should disappear or become simpler if this is added?

A mature product may contain fewer visible features than an early prototype.

That is acceptable and often desirable.

---

# 23. Quality Before Breadth

One excellent learning sequence is more valuable than a large collection of mediocre ones.

Early development should therefore prioritize making a very small number of interactions:

- mathematically correct;
- visually clear;
- enjoyable to use;
- pedagogically defensible;
- accessible;
- thoroughly tested.

A representative unlike-denominator addition interaction should reach a high standard before the project expands aggressively into many problem types.

Breadth should be earned through reusable, validated patterns.

---

# 24. Determinism Should Enable Reproducibility

A generated practice session should be capable of being reproduced from known inputs such as a seed, problem specification, or stored sequence.

This supports:

- debugging;
- automated testing;
- pedagogical review;
- comparing interface revisions;
- sharing problematic examples;
- regression testing.

Randomness may provide variety, but randomness should never make correctness difficult to reproduce.

---

# 25. The System Should Be Inspectable

Where practical, mathematical and pedagogical state should be expressible in human-readable data.

A problem should have an inspectable description of facts such as:

- operands;
- operation;
- denominator relationship;
- canonical equivalent forms;
- expected result;
- simplification state;
- regrouping requirements;
- current instructional responsibility;
- active representation.

This benefits testing and maintenance and makes it easier to determine whether an apparent problem originates in:

- mathematics;
- sequencing;
- instructional logic;
- or presentation.

The exact schema belongs elsewhere.

The principle here is that important behavior should not exist only as opaque UI state.

---

# 26. Normalize the Specifications

Durable concepts should have one canonical owner.

Other project documents should reference that source rather than restating it.

The intended ownership boundaries are:

- **Founding Principles:** project-wide constraints and values;
- **Instructional Model:** what learners should understand and how competence develops;
- **Interaction Grammar:** how instructional episodes behave and feel;
- **Math and Content Model:** deterministic mathematical concepts, problem families, and content structure;
- **System Architecture:** software boundaries and technical organization;
- **Quality and Validation:** how correctness and quality are demonstrated;
- **Roadmap:** what is built when.

These boundaries are intended to reduce specification drift.

For example:

- this document may state that scaffolds should fade;
- the Instructional Model should define what fading means educationally;
- the Interaction Grammar should define how support changes during an episode;
- the Architecture document should define how scaffold state is represented technically;
- the Validation document should define how scaffold behavior is tested;
- the Roadmap should determine when those capabilities are implemented.

Later documents should **extend these principles into their own domains rather than reproduce them wholesale**.

---

# 27. Resolve Conflicts Upward

These founding principles constrain all later specifications.

When an implementation convenience conflicts with an instructional principle, convenience does not automatically win.

When later documents appear to conflict:

1. determine whether they actually describe different concerns;
2. identify which document owns the disputed concept;
3. resolve the contradiction in the owning document;
4. update references rather than duplicating competing rules.

If a feature genuinely requires violating a founding principle, that should trigger an explicit reconsideration of the principle rather than a silent exception in code.

---

# 28. Non-Goals

The initial project is not intended to become:

- a general-purpose learning management system;
- a general mathematics curriculum;
- a generic virtual-manipulative platform;
- a teacher dashboard suite;
- a social network;
- an AI tutoring chatbot;
- a video-first instructional product;
- a reward-driven educational game;
- an assessment or grading platform;
- a replacement for a teacher;
- a repository of every possible fraction representation.

These may overlap with future opportunities, but they should not distort the design of the core fraction-learning experience.

---

# 29. A Short Decision Test

When considering a design or implementation choice, ask:

### Mathematical
Does it preserve mathematical truth and make the relevant relationship clearer?

### Instructional
Does it help the learner think, or merely show more information?

### Attentional
What will the learner look at first?

### Representational
Does this representation reveal something useful that the existing one does not?

### Interaction
Can the learner understand what to do without learning unnecessary software conventions?

### Progression
Can this support eventually disappear?

### Architectural
Is mathematical truth still independent of the presentation?

### Complexity
Could a smaller or quieter solution accomplish the same instructional goal?

### Validation
Can we reliably test that this behaves correctly?

If a proposed feature performs poorly on several of these questions, it should probably be simplified, deferred, or rejected.

---

# 30. Core Product Character

If the project succeeds, a learner should experience it as:

- calm;
- focused;
- responsive;
- predictable without being monotonous;
- visually coherent;
- mathematically trustworthy;
- willing to help without constantly interrupting;
- increasingly unnecessary as a scaffold.

The desired experience is not:

> The software showed me five ways to solve fractions.

It is closer to:

> I saw what the fractions were doing, I made the decisions, and eventually I didn't need the pictures anymore.