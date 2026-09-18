# Development Roadmap

## Purpose

This roadmap defines a staged path from the FractionFlow founding specifications to a coherent, useful, free learning product.

It is intentionally not a detailed implementation plan.

It does not prescribe:

- coding tasks;
- agent assignments;
- pull-request structure;
- sprint duration;
- frameworks;
- exact file organization;
- staffing;
- development tooling.

Instead, it defines:

- what capabilities should exist before others are attempted;
- what the core instructional product must contain;
- what should deliberately wait;
- what evidence should permit expansion;
- where major design assumptions should be reconsidered.

The roadmap is designed around one central development principle:

> **Build one excellent instructional pathway through the architecture before building many adequate ones.**

FractionFlow should expand from validated patterns rather than from parallel feature accumulation.

---

# 1. Roadmap Status

This document is the initial roadmap.

It should evolve as development reveals:

- genuine technical constraints;
- weaknesses in the founding model;
- learner usability findings;
- representation limitations;
- better simplifications.

The roadmap should remain subordinate to the founding principles.

Changing the order of development is expected.

Quietly changing the instructional purpose of the project is not.

---

# 2. What Counts as the Core Product

The core FractionFlow product is a free browser-based experience in which a learner can practice:

- equivalent fractions;
- addition of proper fractions;
- subtraction of proper fractions;
- common denominators;
- mixed-number addition;
- mixed-number subtraction;
- regrouping;
- simplification;

while moving, when appropriate, among:

- fraction bars;
- number lines;
- symbolic notation.

The product should support a progression from:

- highly scaffolded conceptual reasoning

toward:

- efficient symbolic computation.

The core should remain:

- deterministic;
- testable;
- accessible;
- calm;
- usable without an account;
- compatible with static hosting.

### Roadmap stage vocabulary

A **prototype** is a disposable or narrowly scoped implementation used to test a design or technical hypothesis; it may be incomplete and is not a release claim. A **useful limited product** is a deliberately bounded, publicly usable experience whose stated pathway works and whose limitations are explicit; it need not cover the whole core domain. A **substantial core release** is the bounded product described in §71, after the core content, accessibility, privacy, static-deployment, and integration evidence required by this roadmap has been reviewed. These labels describe evidence and scope; they do not create a separate “MVP” milestone or authorize expansion.

---

# 3. Core Instructional Goals

A core-ready FractionFlow should provide meaningful support for the learner who needs to understand:

### Fractional units

Why denominators identify different unit sizes.

### Equivalence

Why:

\[
\frac23=\frac8{12}
\]

rather than merely how to produce the symbols.

### Common units

Why fractions with unlike denominators must be renamed before their unit counts are combined.

### Addition and subtraction

How fraction operations retain ordinary meanings of combining, removing, and finding difference.

### Mixed numbers

How whole-number and fractional quantities fit into one numerical system.

### Regrouping

Why one whole can be renamed as fractional units.

### Magnitude

How to notice whether an answer is reasonable.

### Representation transfer

How the same number persists across visual and symbolic forms.

### Symbolic fluency

How to eventually perform these operations efficiently without requiring visible models.

---

# 4. Core Product Goals Beyond Instruction

The initial public product should also demonstrate:

- responsive use on typical phones, tablets, laptops, and school Chromebooks;
- touch and keyboard usability;
- reduced-motion support;
- deterministic problem reproduction;
- local operation without a backend;
- reliable static deployment;
- coherent help and error handling;
- sufficient content variety for repeated practice;
- clear boundaries between mathematics, instruction, and rendering.

These are core requirements, not stretch polish.

---

# 5. What the Core Product Does Not Need

Core release does not require:

- learner accounts;
- teacher accounts;
- classrooms;
- assignments;
- cloud synchronization;
- remote databases;
- generative AI;
- natural-language tutoring;
- dashboards;
- leaderboards;
- badges;
- streak systems;
- social features;
- multiplication or division of fractions;
- every possible visual representation;
- broad K–12 mathematics coverage.

The absence of these features is deliberate.

---

# 6. Core Development Strategy

Development should move through three broad stages:

### Prove

Demonstrate that the mathematical architecture and one complete instructional interaction work exceptionally well.

### Generalize

Extend the validated interaction system across the founding fraction domain.

### Compose

Turn individual successful episodes into coherent sessions with fading scaffolds, representation bridges, review, and progression.

Only after those stages should major stretch capabilities compete for attention.

---

# 7. The First Vertical Slice

The first deep implementation should center on a carefully selected canonical problem family:

> **addition of two proper fractions with unlike denominators where both fractions require renaming.**

A canonical example is:

\[
\frac23+\frac14.
\]

This family is a useful first slice because it requires FractionFlow to demonstrate many of its defining ideas:

- fractional units;
- equivalence;
- common denominators;
- mathematical transformation;
- learner prediction;
- exact validation;
- visual subdivision;
- symbolic connection;
- addition of like units;
- scaffold fading.

It is complex enough to test the vision without initially requiring mixed-number regrouping.

---

# 8. Why Not Start With Every Problem Type

A broad first implementation would make it difficult to determine why the design works or fails.

If development begins simultaneously with:

- proper addition;
- proper subtraction;
- mixed numbers;
- bars;
- number lines;
- circles;
- adaptive sequencing;
- progress tracking;

then each weakness can be compensated for by another layer of complexity.

The first vertical slice should expose the underlying quality of the core idea.

---

# 9. Phase 0 — Specification Readiness

Development should not begin from the founding documents merely because they exist.

Before substantive implementation, the founding set should undergo deliberate review.

Phase 0 should establish confidence that:

- ownership boundaries among documents are understandable;
- major contradictions have been resolved;
- the core product is appropriately scoped;
- the founding mathematics is sound;
- the interaction vision is coherent;
- architectural boundaries are implementable;
- the roadmap has not accidentally promoted stretch goals into core requirements.

This phase may result in revisions to any founding document.

---

# 10. Phase 0 Exit Condition

Move into implementation when the project has an agreed answer to:

> What are we trying to prove with the first working FractionFlow episode?

The answer should be substantially more specific than:

> that we can build a fraction website.

A strong answer is closer to:

> A learner can reason through an unlike-denominator fraction addition problem, visibly preserve quantity while constructing equivalent fractions, and progress from a bar-supported interpretation toward a correct symbolic solution without the interface becoming cluttered or doing the reasoning for them.

---

# 11. Phase 1 — Mathematical Foundation

The first implementation phase should establish the deterministic mathematical substrate.

This includes sufficient capability to support:

- exact fractions;
- simplification;
- equivalence;
- comparison;
- greatest common factors;
- least common multiples;
- valid common denominators;
- equivalent-fraction conversion;
- addition;
- subtraction;
- mixed-number conversion where useful for future compatibility;
- deterministic validation of intermediate responses.

The goal is not yet to build the learner experience.

The goal is to create mathematical state that the learner experience can trust.

**Static deployment spike.** During Phase 1, establish and record the chosen static deployment mechanism, including the build-output path and a harmless published smoke check. This spike proves deployment plumbing only; it does not prove that the learner-facing experience works.

---

# 12. Phase 1 Content Model

Phase 1 should also establish an initial formal expression of:

- problem instances;
- problem families;
- canonical instructional pathways;
- alternate valid pathways;
- denominator relationships;
- result classifications;
- representation feasibility;
- deterministic generation.

This implementation should embody `03-math-and-content-model.md` without attempting to implement every future family immediately.

---

# 13. Phase 1 Initial Problem Families

At minimum, the mathematical/content foundation should be exercised against:

- like-denominator addition;
- like-denominator subtraction;
- nested-denominator addition;
- nested-denominator subtraction;
- shared-factor unlike denominators;
- relatively prime unlike denominators;
- reducible results;
- results crossing one whole.

Mixed-number logic may be implemented sufficiently to validate the mathematical model even if its learner-facing episodes come later.

---

# 14. Phase 1 Should Have No Need for Visual Mathematics

It should be possible to validate all mathematical facts before a fraction bar exists.

For a problem such as:

\[
\frac23+\frac14,
\]

the system should already know:

- denominator relationship;
- valid common denominators;
- least common denominator;
- scale factors;
- equivalent numerators;
- raw result;
- simplified result;
- magnitude facts;
- alternate valid pathways.

The visual system should later consume those facts.

---

# 15. Phase 1 Exit Gate

Before moving on:

- exact arithmetic should be trustworthy;
- major invariants should be tested;
- problem-family classification should be reliable;
- generated examples should survive bulk validation;
- alternate valid answers should be representable;
- canonical examples should be reproducible.

If mathematics remains uncertain, visual development should not be used to hide that uncertainty.

---

# 16. Phase 2 — The First Excellent Episode

Phase 2 should implement a single complete learner-facing vertical slice for unlike-denominator proper-fraction addition.

The first slice is an engineering and instructional prototype for an upper-elementary learner who has encountered, or can demonstrate readiness for, fractional units, simple equivalence, like-denominator addition, and the idea of a common unit. These are the prerequisite concepts represented by Stages A–D in the Instructional Model; Phase 2 does not assume that this slice is a first lesson for a learner with none of them. Before learner observation, record the participant's relevant prior exposure or use a short readiness check that does not teach the target episode.

Evidence from this slice may establish mathematical correctness, representational continuity, interaction comprehensibility, learner agency, error recovery, and supported performance for the stated starting point. It may identify whether the episode is promising for conceptual construction or repair. It cannot by itself establish that a novice can learn the Stage A–E progression from this episode, that performance will persist, that independent transfer has occurred, or that a particular scaffold-fading rule is effective. Those claims require appropriately designed later checks.

The Phase 2 slice must also be published through the chosen static deployment path and exercised at the public GitHub Pages URL with no backend. Local success and a successful asset smoke check are not substitutes for this end-to-end check.

The first episode should be deliberately narrow.

It should demonstrate the foundational interaction arc:

**encounter → notice → decide → transform → operate → resolve**

Reflection may be added selectively.

---

# 17. Phase 2 Primary Representation

The fraction bar should be the primary visual representation for the initial vertical slice.

The bar should establish:

- one stable whole;
- current fractional units;
- selected quantity;
- meaningful subdivision;
- invariant total quantity;
- common units;
- combination.

The first slice does not need every representation.

---

# 18. Phase 2 Symbolic Integration

Symbolic notation should be present as part of the mathematical narrative.

The first vertical slice should establish that:

- visual and symbolic state refer to the same mathematics;
- symbols update because of learner-established transformations;
- the symbolic solution eventually becomes capable of standing on its own.

The experience should not feel like:

> manipulate the picture, then separately fill in the worksheet.

---

# 19. Phase 2 Core Learner Responsibilities

For the first highly supported episode, the learner should meaningfully participate in decisions such as:

- recognizing unlike units;
- choosing a common denominator;
- constructing equivalent fractions;
- combining like units.

The system may support those decisions.

It should not quietly make them all before the learner acts.

---

# 20. Phase 2 Must Include Local Error Recovery

The vertical slice should support at least important error cases such as:

- invalid common denominator;
- correct denominator but incorrect equivalent numerator;
- denominator changed without corresponding numerator conversion;
- incorrect numerator arithmetic;
- correct but unsimplified answer where relevant.

The first slice is not complete if it only works along the happy path.

---

# 21. Phase 2 Must Include Help

The learner should be able to become stuck and recover.

At least one layered help path should demonstrate:

- orientation rather than answer revelation;
- additional visual support;
- preservation of correct prior work;
- return of mathematical responsibility to the learner.

This is necessary to prove the interaction model, not merely an optional enhancement.

---

# 22. Phase 2 Must Include Reduced Scaffolding

The same underlying problem family should also be expressible with less support.

The first vertical slice should therefore prove at least an early version of scaffold fading.

For example:

### Supported form

- bar visible;
- common-unit reasoning explicitly prompted;
- transformations shown.

### Reduced-support form

- learner supplies more intermediate state;
- visual remains quieter.

### Symbolic form

- learner may solve without automatic visual expansion.

The exact adaptive rules can wait.

The architectural ability to fade should not.

---

# 23. Phase 2 Must Be Visually Excellent Before Breadth

This phase should receive disproportionate attention to:

- whitespace;
- typography;
- timing;
- visual anchors;
- motion;
- mobile layout;
- touch interaction;
- keyboard interaction;
- prompt brevity;
- result pacing.

The goal is to discover what FractionFlow should feel like.

One excellent episode should become the visual and interaction reference for later expansion.

---

# 24. Phase 2 Explicit Non-Goals

Do not require this phase to include:

- number lines;
- mixed numbers;
- long-term learner progress;
- adaptive session planning;
- many prompt themes;
- gamification;
- teacher features;
- dozens of problem types.

The vertical slice should remain small enough to refine deeply.

---

# 25. Phase 2 Exit Gate

Expansion should wait until the first episode demonstrates:

### Mathematical trust

Every visible transformation is correct.

### Learner agency

The learner makes meaningful decisions.

### Visual continuity

Equivalent-fraction transformation visibly preserves quantity.

### Local feedback

Incorrect work can be corrected without resetting the problem.

### Scaffold variability

The experience can become leaner.

### Accessibility

The first complete episode meets the accessibility participation floor in `05-quality-and-validation.md`, with mechanized checks and human accessibility review recorded separately from any child-usability evidence. Untested modes remain explicitly untested.

### Learner evidence

The gate reports evidence separately for the stated starting point; it is not proof of novice learning, durable transfer, or instructional efficacy. Child observations, when conducted, follow the permission, de-identification, and fixture boundary in `05-quality-and-validation.md`.

### Aesthetic coherence

The experience feels calm and deliberate rather than dashboard-like.

If the first slice is merely functional, the project should improve it before generalizing it.

---

# 26. Phase 3 — Generalize the Fraction-Bar Language

Once the first episode works, expand the fraction-bar interaction grammar across proper-fraction operations.

The goal is not to invent new interfaces.

The goal is to discover how far the existing interaction language can stretch.

---

# 27. Phase 3 Problem Expansion

Add support for:

- like-denominator addition;
- like-denominator subtraction;
- nested-denominator addition;
- nested-denominator subtraction;
- shared-factor unlike denominators;
- relatively prime unlike denominators;
- results crossing one whole;
- simplification.

These should reuse established motifs wherever possible.

---

# 28. Phase 3 Focused Concept Episodes

Introduce targeted episodes that isolate important concepts when full operations would add unnecessary load.

Examples include:

- construct an equivalent fraction;
- identify a valid common denominator;
- identify the least common denominator;
- determine which fraction needs renaming;
- determine whether a result should exceed one;
- simplify an equivalent result.

These should use the same overall product language rather than become disconnected mini-games.

---

# 29. Phase 3 Error Coverage

Expand response classification and local recovery across the new families.

Priority should go to common meaningful patterns rather than exhaustive invention of every wrong answer.

The system should distinguish at least:

- conceptual conversion errors;
- common-denominator errors;
- arithmetic errors;
- simplification status;
- valid alternate pathways.

---

# 30. Phase 3 Content Variety

This phase should create enough vetted and generated content that practice does not depend on a tiny collection of examples.

Variety should include meaningful differences in:

- denominator relationships;
- scale factors;
- result forms;
- simplification;
- magnitude.

Numeric variety should remain constrained enough to preserve visual clarity.

---

# 31. Phase 3 Exit Gate

The fraction-bar representation should now function as a coherent language across proper-fraction addition and subtraction.

Before adding a second foundational representation, the project should know:

- which interactions generalize well;
- which interactions became awkward;
- which scaffolds are genuinely useful;
- which prompts became repetitive;
- where visual density becomes problematic.

This information should shape the next phase.

---

# 32. Phase 4 — Number Lines and Representation Bridges

The number line should enter after the fraction-bar model is stable.

Its purpose is not to increase visual variety.

It should add distinct mathematical meaning:

- fractions as numbers;
- magnitude;
- location;
- equivalence as identical position;
- addition and subtraction as movement or distance;
- mixed-number continuity across whole-number boundaries.

---

# 33. Phase 4 First Number-Line Goals

Initial number-line work should focus on a limited number of strong uses:

### Equivalence

Different fraction labels occupying the same point.

### Magnitude

Placement relative to zero, one-half, and one.

### Addition

Movement forward by a fractional quantity.

### Subtraction

Movement backward or measuring difference.

The project does not need to force every existing bar episode onto a number line.

---

# 34. Phase 4 Bridge Episodes

This phase should establish the first polished representation-bridge experiences.

A strong canonical bridge may begin with:

\[
\frac23=\frac8{12}.
\]

A fraction bar and its fixed endpoint can transition toward a number line while preserving the represented quantity.

The bridge should provide one explicit learner connection-making opportunity rather than merely show a completed correspondence. The exact prompt form, timing, frequency, and density remain prototype variables.

---

# 35. Phase 4 Representation Switching

The architecture should now prove that shared mathematical and instructional state survives changing representation.

Test representation changes:

- before solving;
- during equivalence work;
- after conversion;
- after resolution.

The learner's established reasoning should not disappear merely because the view changes.

---

# 36. Phase 4 Stable Practice

Number-line experiences should include enough repeated use for the representation to become familiar.

Do not introduce the number line only as an occasional novelty.

Learners should have opportunities to reason directly within it.

---

# 37. Phase 4 Exit Gate

The project should now be able to demonstrate:

> the same fraction is not merely drawn two different ways; it remains the same mathematical object across representations.

This is a major FractionFlow milestone.

Before moving forward:

- representation bridges should be clear;
- number-line geometry should be trustworthy;
- transfer tasks should require actual learner reasoning;
- representation switching should preserve episode state;
- representation variety should not have produced interface clutter.

---

# 38. Phase 5 — Mixed Numbers and Whole Boundaries

After proper-fraction operations are stable across foundational representations, expand into mixed numbers.

This phase introduces important conceptual complexity:

- several wholes;
- improper fractions;
- crossing whole-number boundaries;
- composition;
- decomposition.

These should build on the existing equivalence model rather than introduce unrelated algorithms.

---

# 39. Phase 5 Mixed-Number Foundations

First establish:

- mixed number as whole plus fraction;
- improper fraction as equivalent numerical form;
- location of mixed numbers on number lines;
- representation of multiple wholes with bars.

Learners should see continuity between:

\[
2\frac34
\]

and:

\[
\frac{11}{4}.
\]

---

# 40. Phase 5 Mixed Addition Without Composition

Introduce mixed-number addition in cases where the fractional parts do not form another whole.

The interaction should preserve the familiar separation of:

- whole-number quantities;
- fractional quantities.

Avoid adding regrouping complexity immediately.

---

# 41. Phase 5 Composition

Next introduce additions in which fractional units form another whole.

The visual language should make perceptible that:

\[
\frac88=1.
\]

The resulting whole should emerge from existing quantity rather than appear as an unexplained carry.

---

# 42. Phase 5 Mixed Subtraction Without Decomposition

Establish mixed-number subtraction in cases where the fractional component of the minuend is already sufficient.

This gives learners stable practice with mixed-number subtraction before decomposition is introduced.

---

# 43. Phase 5 Decomposition

Then introduce the crucial regrouping structure.

For example:

\[
3\frac28
=
2\frac{10}{8}.
\]

This should be treated as another equivalence transformation.

The learner should be able to see:

- one whole being renamed;
- fractional unit count increasing;
- total quantity remaining unchanged.

This interaction deserves the same degree of design care as the original unlike-denominator equivalence slice.

---

# 44. Phase 5 Exit Gate

Mixed-number work should not be considered mature merely because symbolic answers are correct.

The project should demonstrate that:

- whole boundaries remain visually stable;
- composition is understandable;
- decomposition is understandable;
- improper and mixed forms preserve numerical identity;
- bars and number lines remain coherent;
- regrouping builds on equivalence rather than appearing as a separate trick.

---

# 45. Phase 6 — Scaffold System and Independence

Earlier phases should prove that scaffolds can vary.

Phase 6 should turn this capability into a coherent system.

The goal is to support movement from:

**supported understanding**

to:

**independent symbolic work.**

---

# 46. Scaffold Dimensions

The project should now formalize independent support dimensions such as (canonical operational labels: high support, medium support, low support, and independent; see `02-interaction-grammar.md` §22):

- representation visible or hidden;
- common-denominator choices provided or generated by learner;
- scale factor supplied or requested;
- equivalent numerator supplied or requested;
- prediction requested or omitted;
- animation automatic or contingent;
- hint availability;
- simplification prompt;
- magnitude check.

These should not collapse into one global difficulty switch.

---

# 47. Scaffold Fading Rules

Develop an initial deterministic policy for deciding when support may fade.

The policy should be based on meaningful evidence such as:

- repeated accurate equivalence work;
- correct common-unit selection;
- successful independent attempts whose preceding support and response provenance are known;
- successful transfer;
- reduced help use.

The first policy may be simple.

It should be inspectable and deterministic.

---

# 48. Scaffold Return

Support should also be capable of returning.

A learner may be highly independent with:

- like denominators

while still needing help with:

- mixed-number decomposition.

The system should avoid one global assumption of learner level.

---

# 49. Optional Expansion

By this phase, learners should increasingly encounter symbolic-first problems.

When needed, they can expand them into:

- fraction bars;
- number lines;
- hints.

The learner should not need to leave the problem and enter a separate tutorial.

---

# 50. Phase 6 Exit Gate

The product should demonstrate the learning arc:

> I used to need the visual. Now I can solve this without it, but I can still ask for it when I need it.

That transition is one of FractionFlow's core outcomes.

---

# 51. Phase 7 — Session Composition

Once individual episodes and scaffolds are mature, compose them into intentionally structured practice sessions.

A session should not be a random queue.

It should have instructional rhythm.

---

# 52. Initial Session Rhythm

A useful general sequence may resemble:

**orient → focused practice → vary → bridge → consolidate → mixed retrieval**

Not every session needs every component.

The important shift is from isolated episodes to deliberate composition.

---

# 53. Stable Runs

Sessions should include short runs in which:

- representation remains familiar;
- interaction mechanics remain stable;
- target mathematics receives repeated attention.

This supports fluency.

---

# 54. Meaningful Variation

After initial stability, vary dimensions such as:

- denominator relationship;
- result form;
- scaffold level;
- operation.

Do not vary every dimension simultaneously.

---

# 55. Bridge Placement

Representation bridges should occur intentionally.

They should be:

- infrequent enough to remain meaningful;
- common enough to develop transfer.

Bridge frequency should eventually be informed by learner use and review.

---

# 56. Mixed Retrieval

Previously learned structures should periodically return after intervening content.

This helps distinguish:

- immediate procedural imitation

from:

- retained knowledge.

Mixed review should begin only after adequate focused practice.

---

# 57. Session End

A session should have a natural stopping point.

It should not rely on endless scrolling or infinite practice.

The learner should be able to finish a short coherent body of work.

Longer practice can consist of additional sessions.

Session dose, pause behavior, stopping cues, and completion acknowledgement are Phase 7 prototype variables. The phase should compare a small number of bounded compositions and record what makes a session feel finishable without turning the founding documents into a fixed problem count, time limit, or reward loop. Until that work is reviewed, “short coherent body of work” is a design aim, not a quantitative acceptance threshold.

---

# 58. Phase 7 Exit Gate

A complete FractionFlow session should feel composed rather than generated.

Learners should encounter:

- repetition without monotony;
- variety without chaos;
- challenge without abruptness;
- visual support without dependency.

At this point, FractionFlow begins to become a product rather than a collection of excellent interactions.

Phase 7 continuity means continuity within one active session: episode order, local review, scaffold behavior, and a natural session close should be coherent without durable learner history.

---

# 59. Phase 8 — Local Progress and Cross-Session Continuity

Once session behavior is credible, Phase 8 may add modest durable local progress where it improves learning. This is the first roadmap phase that evaluates continuity across later visits. It is not required for first-visit core practice, and it must remain usable after local data is cleared and without identity or network services.

The initial goal is not a comprehensive student model.

It is continuity across later visits, without creating a comprehensive student model.

---

# 60. Core Local Progress

Useful locally persisted information may include:

- recently practiced concepts;
- recent evidence of independence;
- scaffold tendencies;
- session completion;
- representation familiarity;
- basic learner preferences.

The exact model should remain modest.

---

# 61. No Account Requirement

The core product should remain fully usable:

- on first visit;
- after clearing local data;
- without identity;
- without network services beyond loading the static site.

Local progress should improve the experience rather than unlock it.

---

# 62. Progress Should Remain Multidimensional

Avoid reducing progress to:

- Level 7;
- 83%;
- Bronze/Silver/Gold.

Internally, the system should preserve meaningful distinctions such as:

- equivalence;
- common units;
- mixed-number decomposition;
- representation transfer;
- symbolic independence.

Learner-facing display of those dimensions can remain minimal.

---

# 63. Phase 8 Exit Gate

Returning learners should experience sensible continuity after Phase 8 local continuity is enabled, without the site becoming a progress dashboard.

The core learning scene should remain visually dominant.

---

# 64. Phase 9 — Core Product Integration

This phase prepares FractionFlow for a stable public core release.

Its purpose is not to add major instructional concepts.

It is to integrate, simplify, and harden.

---

# 65. Core Product Integration Review

Review the full product for:

- duplicated interactions;
- redundant prompts;
- inconsistent terminology;
- unnecessary navigation;
- accumulated controls;
- visual inconsistency;
- session pacing;
- representation switching;
- scaffold behavior;
- responsiveness;
- accessibility;
- static deployment, as a recheck and hardening of the Phase 1 mechanism spike and Phase 2 public end-to-end proof rather than the first deployment evidence;
- performance.

Release preparation should also record the unresolved owner decision about licensing the code, instructional content, visual assets, and other repository materials. Do not infer reuse permission from “free” access, and do not treat this roadmap item as selecting or creating a license.

This phase should aggressively remove unnecessary complexity.

---

# 66. Core Content Coverage

By this stage, core content should include meaningful practice across:

- equivalent fractions;
- common units;
- proper-fraction addition;
- proper-fraction subtraction;
- denominator relationships;
- simplification;
- magnitude checks;
- mixed-number addition;
- mixed-number subtraction;
- composition;
- decomposition;
- representation transfer;
- symbolic independence.

Not every combination needs equal volume.

The important structures should be represented intentionally.

---

# 67. Core Representation Coverage

The core release should deeply support:

- fraction bars;
- number lines;
- symbolic notation.

No additional foundational representation is required for core release.

Three well-integrated representations are preferable to six shallow ones.

---

# 68. Core Accessibility Review

Before release, complete integrated review of:

- keyboard use;
- touch;
- reduced motion;
- color independence;
- semantic accessibility;
- responsive layout;
- alternatives to precision dragging.

Accessibility defects that prevent core mathematical participation should be treated as release issues.

The core release must meet the accessibility participation floor in `05-quality-and-validation.md`. Mechanized results, human accessibility review, and child-usability evidence must remain separate evidence records; none may be reported as proof of the others, and untested modes remain explicitly untested.

---

# 69. Core Performance Review

Ensure that typical school and home hardware can comfortably run:

- bar transformations;
- number-line interactions;
- representation bridges;
- session transitions.

The product should not require a high-end device to appear elegant.

---

# 70. Core Privacy Review

Confirm that the public core:

- does not require personal information;
- does not silently depend on tracking services;
- stores only justified local information;
- remains usable without persistent progress.

The static core should remain usable when optional external origins are unavailable and should not silently depend on tracking services.

---

# 71. Core Release Definition

FractionFlow reaches its first substantial release when it provides:

> a coherent, trustworthy pathway from visual fraction understanding through addition and subtraction of proper fractions and mixed numbers toward increasingly independent symbolic work.

The release should feel intentionally bounded.

It does not need to look like a complete mathematics platform.

Public availability alone does not establish a substantial core release. The release state must be named alongside its covered pathway, known limitations, and evidence status. Any learner observation used as release evidence remains de-identified design evidence under `05-quality-and-validation.md`; raw learner records and identifiable artifacts are not release assets, and the observation is not proof of instructional efficacy.

---

# 72. Core Release Is Not the End of Validation

Public availability should produce new evidence.

Post-release work should pay attention to:

- where learners ask for help;
- where they abandon episodes;
- which prompts confuse;
- where representation switches help or hinder;
- which scaffolds persist too long;
- whether learners actually move toward symbolic independence.

Any telemetry used for this purpose should follow explicit privacy review.

Direct observation and voluntary feedback may be sufficient initially.

---

# 73. Stretch Goal Category — Additional Representations

Possible additional representations include:

- circles;
- discrete sets;
- measurement contexts;
- clocks;
- recipes;
- physical-piece metaphors.

A new representation should enter only when it provides a distinct instructional benefit.

It should not be added merely to increase visual variety.

---

# 74. Stretch Goal Category — Richer Contexts

FractionFlow may eventually include mathematical contexts such as:

- measurement;
- cooking;
- distance;
- time;
- construction;
- sharing.

Context should clarify mathematics rather than create excessive reading.

Word problems should not become mandatory wrappers around every operation.

---

# 75. Stretch Goal Category — Broader Fraction Operations

Later mathematical expansion may include:

- multiplication;
- division;
- fractions of sets;
- compound fraction reasoning.

These should receive their own instructional design rather than simply attaching new operators to the existing UI.

---

# 76. Stretch Goal Category — Decimals and Percentages

FractionFlow may eventually connect:

\[
\frac12=0.5=50\%.
\]

Such expansion could provide rich representation-transfer opportunities.

It should not distract the founding release from fraction operations.

---

# 77. Stretch Goal Category — Teacher and Parent Configuration

Possible future tools include:

- selecting eligible problem families;
- assigning a practice focus;
- controlling session length;
- choosing whether simplification is required;
- creating reproducible practice links;
- viewing limited progress summaries.

These tools should remain outside the learner's primary mathematical scene.

---

# 78. Stretch Goal Category — Shareable Practice Configurations

A useful lightweight extension might allow a teacher or parent to create a reproducible practice configuration encoded in a link or other portable form.

This could preserve the static-only founding architecture while allowing targeted practice; it does not authorize a backend or remote learner data.

Such functionality should be considered before building full account infrastructure.

---

# 79. Stretch Goal Category — Cloud Progress

Cloud synchronization may eventually be valuable when learners use multiple devices, but it remains outside the founding product boundary.

It would require an explicit owner-approved charter change, evidence that local progress is valuable enough to synchronize, and a renewed privacy and operational review.

Adding remote identity would introduce:

- privacy concerns;
- authentication;
- operational complexity;
- data retention responsibilities.

Those costs require a concrete benefit.

---

# 80. Stretch Goal Category — Classroom Features

Possible later classroom functionality includes:

- teacher-created practice sets;
- anonymous or pseudonymous session codes;
- assignment completion;
- aggregated skill information.

FractionFlow should resist becoming a full LMS.

Classroom functionality should remain focused on the learning experience it uniquely provides.

---

# 81. Stretch Goal Category — Localization

FractionFlow could eventually support additional languages.

The deterministic mathematical system should make this feasible without altering mathematical behavior.

Localization would require review of:

- mathematical terminology;
- prompt length;
- text direction where applicable;
- spoken or accessible notation.

---

# 82. Stretch Goal Category — Optional Audio

Audio may eventually support:

- pronunciation;
- accessibility;
- younger readers.

It should remain optional and should not become the only carrier of mathematical information.

---

# 83. Stretch Goal Category — Carefully Chosen Motivation Systems

If learners need additional motivation, the project may later investigate:

- session completion acknowledgement;
- visible growth in independence;
- personal milestones;
- low-pressure progress cues.

Any reward system should be evaluated against the founding preference for capability-driven progress.

Badges, streaks, currencies, and similar systems should not be assumed necessary.

---

# 84. Stretch Goal Category — Adaptive Sequencing

More sophisticated deterministic adaptation may eventually select episodes based on:

- recent error patterns;
- support dependence;
- retention;
- transfer;
- problem-family performance.

This should come after the project understands enough actual learner behavior to justify complexity.

Early adaptation can remain intentionally simple.

---

# 85. Stretch Goal Category — Research and Evaluation

If FractionFlow becomes sufficiently mature, the project may support more formal study of questions such as:

- whether linked representations improve transfer;
- whether bridge episodes improve equivalence understanding;
- whether scaffold fading improves symbolic independence;
- which visual models best support particular learners.

Research instrumentation should be designed ethically and separately from core product requirements.

---

# 86. Stretch Goal Category — Runtime AI

Runtime generative AI is not part of the founding product.

If explored later, possible roles might include optional language support around a deterministic core.

Any such feature must not become authoritative for:

- mathematical truth;
- answer validation;
- equivalence;
- problem generation constraints;
- visual state.

A generative feature should be removable without damaging core practice.

---

# 87. Features to Resist Without Strong Evidence

The following should face a high bar:

- learner chatbots;
- avatars;
- virtual economies;
- public profiles;
- social comparison;
- leaderboards;
- daily streak pressure;
- complex skill dashboards;
- elaborate account hierarchies;
- AI-generated runtime explanations;
- constant visual themes;
- dozens of visualization modes.

Some might eventually be useful.

None are implied by FractionFlow's instructional goals.

---

# 88. Do Not Prebuild Stretch Infrastructure

The architecture should permit extension.

Development should not spend major effort implementing unused abstraction solely because a future stretch feature might need it.

Examples include:

- cloud user schemas before accounts exist;
- universal course-authoring frameworks;
- plugin architectures for hypothetical representations;
- generic AI-provider interfaces;
- complex analytics pipelines.

Build for known requirements while preserving clean boundaries.

---

# 89. Decision Checkpoint — After the First Vertical Slice

Before generalization, ask:

- Did learners understand the visual transformation?
- Does the bar actually clarify equivalence?
- Is the learner making enough decisions?
- Is the interaction too slow?
- Is the screen still too crowded?
- Is the symbolic connection convincing?
- Does help preserve agency?
- Can the same interaction become substantially quieter?

If the answers expose foundational weakness, revise before expanding.

---

# 90. Decision Checkpoint — Before Number Lines

Ask:

- Has the bar model become stable enough to serve as a reference representation?
- What specific learning problem will the number line solve?
- Which transfers are important enough to warrant bridge episodes?
- Can the transition be made perceptually clear?
- Will number-line work reduce dependence on part-whole imagery?

The number line should enter to deepen the model, not satisfy a roadmap checkbox.

---

# 91. Decision Checkpoint — Before Mixed Numbers

Ask:

- Is equivalence sufficiently coherent to support regrouping?
- Are whole boundaries visually stable?
- Can existing interaction motifs express composition and decomposition?
- Does mixed-number work require a new interaction pattern, or can existing patterns be extended?

Mixed numbers should build on the system rather than fork it.

---

# 92. Decision Checkpoint — Before Adaptive Progress

Ask:

- What evidence has actual learner use produced?
- Which supports genuinely need adaptation?
- Can simpler session rules solve the problem?
- What will the system infer, and how certain is that inference?
- Can behavior remain explainable and deterministic?

Adaptive complexity should be earned.

---

# 93. Decision Checkpoint — Before Any Backend

Ask:

- What user need cannot reasonably be met locally?
- Is persistence across devices important enough?
- Is identity actually required?
- Could a shareable configuration solve the need?
- What new privacy obligations arise?
- What ongoing operational work appears?

A backend is a product commitment, not merely a technical upgrade, and this checkpoint does not authorize one. Any backend requires an explicit owner-approved charter change.

---

# 94. Decision Checkpoint — Before Any New Foundational Representation

Ask:

- What does this representation teach that bars and number lines do not?
- Is that instructional need common enough?
- Can learners transfer into and out of it?
- Will it create new UI conventions?
- Can it meet accessibility requirements?
- Is visual novelty being mistaken for instructional diversity?

Reject representations that cannot answer these questions convincingly.

---

# 95. Roadmap Prioritization Rule

When choosing between:

- expanding breadth;
- improving a core interaction;

prefer improvement when the core interaction remains materially below the desired standard.

When choosing between:

- adding a new representation;
- strengthening transfer between existing ones;

prefer transfer unless the new representation fills a clear conceptual gap.

When choosing between:

- adding motivational chrome;
- reducing mathematical friction;

prefer reducing friction.

When choosing between:

- adding infrastructure;
- improving learning;

prefer the learner unless infrastructure is genuinely blocking progress.

---

# 96. Core Before Stretch

A useful test for proposed work is:

> Would FractionFlow still fail its founding promise if this feature never existed?

If yes, it is probably core.

If no, it is probably stretch or optional.

For example:

### Core

Correct equivalent-fraction animation.

### Core

Scaffold fading.

### Core

Mixed-number regrouping.

### Stretch

Cloud accounts.

### Stretch

Circle models.

### Stretch

Teacher dashboards.

This distinction should remain visible as development proceeds.

---

# 97. Core Does Not Mean Crude

"Core" should not be interpreted as:

- barely functional;
- visually unfinished;
- inaccessible;
- pedagogically unreviewed.

FractionFlow's distinctive value lies in interaction quality.

Therefore visual polish, clarity, accessibility, and instructional coherence belong in the core definition.

---

# 98. Stretch Does Not Mean Unimportant

A stretch goal may eventually become highly valuable.

The distinction means:

> The founding instructional promise can be fulfilled without depending on this feature.

Stretch goals should be reconsidered after the core product produces evidence about real use.

---

# 99. Roadmap Should Favor Learning From Development

Each major phase should answer a question.

### Phase 1

Can the mathematical foundation be trusted?

### Phase 2

Can one FractionFlow episode fulfill the founding vision?

### Phase 3

Does the interaction grammar generalize across proper-fraction operations?

### Phase 4

Can multiple representations genuinely strengthen understanding rather than create clutter?

### Phase 5

Can the equivalence model extend coherently into mixed-number regrouping?

### Phase 6

Can scaffolds fade toward genuine independence?

### Phase 7

Can successful episodes form coherent practice sessions?

### Phase 8

Can continuity improve without turning the product into a dashboard?

### Phase 9

Can the complete product remain elegant after all core capabilities are integrated?

Each phase should reduce uncertainty before increasing scope.

---

# 100. Expected Core Release Shape

A learner arriving at the initial mature FractionFlow site should be able to begin practicing with very little setup.

During practice, the learner should encounter:

- mathematically selected problems;
- concise prompts;
- one primary representation at a time;
- meaningful visual transformations when needed;
- local feedback;
- optional help;
- occasional representation bridges;
- fading visual support;
- increasing symbolic independence.

The site should not require the learner to understand:

- its architecture;
- its problem families;
- its scaffold model;
- its sequencing system.

Complexity should remain underneath the experience.

---

# 101. What Success at the End of the Roadmap Looks Like

The core roadmap succeeds if FractionFlow can support a learner moving from:

> I don't understand why these denominators have to change.

through:

> I can see that the fractions are being renamed without changing their amounts.

through:

> I know what common unit to use and how to make the equivalent fractions.

through:

> I can add and subtract fractions and mixed numbers accurately.

through:

> I can tell whether my answer makes sense.

to:

> I usually don't need the visual anymore, but I know what the symbols mean.

That is the product the roadmap is intended to build.

Everything else should justify itself by helping that happen.
