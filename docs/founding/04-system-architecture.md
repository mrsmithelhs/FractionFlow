# System Architecture

## Purpose

FractionFlow should be architected so that mathematical correctness, instructional behavior, visual presentation, and learner progression remain clearly separated.

The system should make it difficult for a presentation component to invent mathematics, difficult for a problem generator to improvise pedagogy, and difficult for changes to one visual representation to destabilize the rest of the learning model.

This document defines the conceptual technical architecture of FractionFlow:

- major system responsibilities;
- boundaries among those responsibilities;
- authoritative sources of state;
- data flow;
- static-hosting assumptions;
- content organization;
- deterministic generation;
- session and progress concepts;
- extensibility principles;
- failure boundaries;
- architectural non-goals.

It does not prescribe:

- a JavaScript framework;
- a CSS framework;
- exact directory names;
- specific classes or functions;
- database schemas;
- animation libraries;
- build tooling.

Those decisions may be made during implementation so long as they preserve the architecture defined here.

---

# 1. Architectural Goal

The core architectural goal is:

> Mathematical truth should flow outward into instruction and presentation, never be reconstructed inward from the interface.

Conceptually:

**Math model → problem instance → instructional state → scene state → presentation**

Learner actions flow in the opposite direction as requests or responses:

**learner action → interaction interpretation → instructional transition → mathematical validation**

The interface should never become the authoritative source of mathematical truth.

---

# 2. Static-First Product

The initial FractionFlow product should be capable of running as a static website.

A deployment environment such as GitHub Pages should be sufficient for the core learning experience.

The initial architecture should therefore avoid requiring:

- an application server;
- a database server;
- cloud functions;
- authentication;
- remote learner accounts;
- server-side problem generation;
- runtime generative AI;
- mandatory analytics infrastructure.

This constraint is intentional.

It supports:

- free hosting;
- privacy;
- reproducibility;
- reliability;
- offline-friendly future options;
- simple deployment;
- easier testing.

---

# 3. Static-First Does Not Mean Architecturally Rigid

The application should remain capable of later adding optional services without redesigning its mathematical or instructional core.

Possible future services could include:

- synchronized learner progress;
- teacher-created assignments;
- anonymous research telemetry;
- classroom management;
- shared devices;
- account-based settings.

Such services should integrate at the edges of the architecture.

They should not become prerequisites for:

- generating valid problems;
- validating answers;
- rendering representations;
- running instructional episodes.

---

# 4. Core Architectural Layers

FractionFlow should conceptually separate at least these responsibilities:

1. **Mathematical Core**
2. **Content and Problem Generation**
3. **Instructional Engine**
4. **Scene Model**
5. **Representation Renderers**
6. **Interaction Layer**
7. **Session and Progress Model**
8. **Application Shell**
9. **Persistence Adapters**

The implementation may combine some responsibilities physically where appropriate.

Their conceptual ownership should remain distinct.

---

# 5. Mathematical Core

The Mathematical Core is the authoritative source for exact fraction mathematics.

It owns operations such as:

- normalization;
- exact comparison;
- equivalence;
- common multiples;
- least common multiples;
- scale factors;
- addition;
- subtraction;
- simplification;
- mixed-number conversion;
- regrouping;
- result classification.

It must operate deterministically.

It must not depend on:

- visual state;
- learner-facing prose;
- browser dimensions;
- animation state;
- scaffold level.

The rules in `03-math-and-content-model.md` define its mathematical contract.

---

# 6. Mathematical Core Should Be Presentation-Agnostic

The Mathematical Core should not know whether a fraction will be displayed as:

- a bar;
- a number line;
- symbolic notation;
- a future representation.

For example, the core may establish:

\[
\frac23=\frac8{12}.
\]

It should not establish:

> draw eight blue rectangles.

The first is mathematics.

The second is presentation.

---

# 7. Content and Problem Generation

The Content and Problem Generation layer selects or constructs mathematically valid problem instances.

It should work from:

- named problem families;
- explicit constraints;
- instructional targets;
- controlled numeric ranges;
- representation feasibility constraints.

It should not begin with arbitrary random fractions and discover afterward whether they happen to be pedagogically useful.

---

# 8. Generated Problems Should Be Fully Classified Before Use

Before a generated problem enters an instructional episode, the system should already know relevant facts such as:

- problem family;
- denominator relationship;
- canonical common denominator;
- alternate valid common denominators;
- conversion factors;
- exact result;
- simplification status;
- regrouping requirement;
- result type;
- magnitude relationships;
- representation eligibility.

A problem should not enter presentation in a partially understood mathematical state.

---

# 9. Curated and Generated Content Share the Same Contract

FractionFlow should support both:

- procedurally generated problem instances;
- deliberately curated instructional cases.

Both should conform to the same mathematical content contract.

A curated problem should not require one-off presentation logic merely because it was authored by hand.

Likewise, generated problems should not receive weaker validation than curated ones.

---

# 10. Deterministic Generation

Problem generation should be reproducible.

Given the same relevant inputs, including any seed, the system should be capable of recreating:

- the same problem;
- the same mathematical classification;
- the same canonical solution path.

This does not require every learner session to be predictable in advance.

It requires randomness to be controllable.

---

# 11. Seeds Are Part of Reproducibility, Not Pedagogy

A random seed may determine which eligible instance is selected.

It should not determine mathematical truth or alter instructional rules.

The same problem instance should have the same mathematical interpretation regardless of how it was reached.

---

# 12. Instructional Engine

The Instructional Engine determines what mathematical responsibility currently belongs to the learner.

It owns concepts such as:

- current episode type;
- current narrative beat;
- current scaffold state;
- which learner response is expected;
- whether help has been requested;
- which instructional step follows a response;
- whether a representation bridge is appropriate;
- whether an episode is resolved.

It should implement the instructional vision defined by:

- `01-instructional-model.md`;
- `02-interaction-grammar.md`.

---

# 13. The Instructional Engine Does Not Calculate Mathematics

The Instructional Engine may ask:

> Is this proposed denominator valid?

It should obtain that answer from mathematical state or the Mathematical Core.

It should not independently calculate divisibility rules.

Likewise, it may ask:

> Does this problem require decomposition?

It should consume the classification already established by the mathematical/content layers.

This prevents instructional logic from becoming a second mathematics implementation.

---

# 14. Instructional State and Mathematical State Are Different

A mathematical problem may contain many facts that are not currently instructional.

For:

\[
\frac23+\frac14,
\]

the system may mathematically know:

\[
\frac23=\frac8{12}
\]

and:

\[
\frac14=\frac3{12}.
\]

But instructional state may intentionally reveal neither yet.

Therefore the architecture should distinguish:

### What is mathematically known

from:

### What the learner has established

and:

### What the system is currently showing.

This distinction is essential.

---

# 15. Learner-Established State

The system should preserve meaningful learner accomplishments within an episode.

Examples:

- learner identified a valid common denominator;
- learner correctly converted one operand;
- learner recognized regrouping is necessary;
- learner successfully estimated that the result exceeds one.

These facts belong to instructional state.

They should not be inferred later merely from whatever happens to be visible on screen.

---

# 16. Scene Model

The Scene Model represents what mathematical objects and relationships should currently be perceptible.

It should act as a bridge between instructional state and representation-specific rendering.

Conceptually, the Scene Model may express ideas such as:

- these two quantities are currently active;
- this whole is divided into thirds;
- this quantity is selected;
- these thirds are being re-expressed as twelfths;
- this number-line point represents the same quantity;
- these units are ready to combine;
- this whole is being decomposed.

The exact data structure is deferred.

---

# 17. Scene Model Should Describe Meaning, Not Pixels

The Scene Model should avoid being defined primarily in terms such as:

- x = 420;
- width = 187;
- color = blue;
- animation frame = 26.

Those are rendering concerns.

Instead, scene state should express mathematical and instructional relationships.

A renderer should determine how those relationships fit the current device and representation.

---

# 18. Representation Renderers

Each representation should have a renderer responsible for expressing approved scene state.

Initial renderers are expected to include:

- fraction bars;
- number lines;
- symbolic notation.

Future renderers may include additional representations.

A renderer should know how to depict its representation faithfully.

It should not decide:

- what problem to generate;
- what common denominator to use;
- whether the learner is correct;
- which instructional beat comes next.

---

# 19. Renderers Must Not Become Mini-Applications

Each renderer should behave as a representation of shared state, not as an independent widget with its own competing workflow.

Avoid architectures where:

- the bar component has one notion of problem state;
- the number-line component has another;
- the symbolic component independently tracks answers.

There should be one authoritative episode state.

Representations consume it.

---

# 20. Representations Should Not Synchronize With Each Other Directly

A bar renderer should not tell a number-line renderer what changed.

Instead:

1. learner action changes instructional state;
2. instructional state produces updated scene meaning;
3. relevant renderers consume that state.

This prevents fragile webs of component-to-component synchronization.

It also supports the founding principle of avoiding multiple parallel widgets.

---

# 21. Representation Changes Should Preserve Shared Mathematical Identity

If a quantity is shown first as a bar and later on a number line, the architecture should retain a shared conceptual identity for that quantity.

The new renderer should not recreate a merely similar value from presentation text.

This supports meaningful transformations and stable learner state.

---

# 22. Symbolic Representation Is a Renderer Too

Symbolic notation should not be treated as the application's hidden "real" state while visual models are decorations.

Symbols are one representation of the underlying mathematics.

This makes it easier to support:

- visual-first episodes;
- symbolic-first episodes;
- scaffold fading;
- representation bridges.

The mathematical model remains deeper than every representation.

---

# 23. Interaction Layer

The Interaction Layer interprets learner actions in terms of the current instructional responsibility.

It may receive actions such as:

- numeric entry;
- choice selection;
- point placement;
- request for help;
- request for another representation;
- replay request;
- continue.

It translates those actions into meaningful instructional events.

---

# 24. Controls Should Not Encode Mathematical Rules

For example, a denominator input should collect a proposed value.

It should not contain its own rule for deciding whether that denominator is valid.

Validation belongs downstream.

This keeps alternate input mechanisms behaviorally consistent.

---

# 25. Interaction Methods Should Be Replaceable

The same mathematical responsibility may eventually be expressed through:

- keyboard entry;
- touch selection;
- dragging;
- accessible alternative controls.

These input methods should converge on the same underlying learner action.

Accessibility should therefore not require a separate mathematical pathway.

---

# 26. Session Model

A session is a bounded sequence of learning episodes.

The Session Model may track information such as:

- current episode;
- recent problem families;
- support usage;
- recent success;
- representation history;
- concepts recently practiced;
- whether a bridge episode is due;
- session progress.

The exact sequencing algorithm belongs to later implementation.

---

# 27. Session State Is Not the Same as Learner Mastery

Temporary session information should not automatically be treated as durable evidence about a learner.

For example:

- three correct responses today;
- one requested hint;
- one error on a denominator;

are observations.

A longer-term learner model may infer broader tendencies from repeated observations, but the architecture should keep this distinction explicit.

---

# 28. Learner Progress Model

If FractionFlow tracks learning over time, progress should be represented by meaningful instructional dimensions rather than a single global level.

Potential dimensions include:

- equivalence;
- common-unit selection;
- nested-denominator operations;
- both-denominator conversion;
- magnitude reasoning;
- mixed-number composition;
- mixed-number decomposition;
- symbolic independence;
- representation transfer.

This follows the instructional principle that learners may need different support for different structures.

---

# 29. Progress Models Should Be Optional to Core Operation

The website should still provide coherent practice if no durable learner history exists.

A first-time visitor should not require an account or prior data.

Likewise, clearing local data should not break the application.

---

# 30. Persistence Is an Adapter

Persistence should sit at the edge of the architecture.

The learning system may produce durable information such as:

- preferences;
- learner progress summaries;
- recent session information;
- selected curriculum scope.

A persistence adapter may store this:

- locally in the browser;
- eventually in a remote service;
- or nowhere.

The core instructional logic should not care where the data is stored.

---

# 31. Local Persistence Is Preferred Initially

Where durable state improves the core product, initial implementation should prefer local browser storage.

Potential examples include:

- reduced-motion preference beyond system settings;
- recent progress;
- selected learner settings;
- session resumption.

The application should remain useful without remote identity.

---

# 32. Application Shell

The Application Shell owns the minimal surrounding product experience.

Possible responsibilities include:

- entering practice;
- selecting a broad practice goal;
- resuming a session;
- basic settings;
- informational pages;
- accessibility preferences;
- parent or teacher configuration if later added.

The shell should remain subordinate to the learning scene.

It should not grow into a dashboard by default.

---

# 33. Practice Scene and Application Shell Should Be Visually Distinct in Responsibility

Once an episode begins, nonessential application controls should recede.

The practice scene should not continuously display:

- navigation grids;
- statistics;
- skill menus;
- settings panels;
- account information.

The architecture should make it possible for the learning surface to remain focused even if the application shell grows later.

---

# 34. Authored Content

Vetted instructional content should live as durable project assets rather than being generated dynamically.

Examples may include:

- prompt families;
- hint layers;
- reflection prompts;
- instructional episode definitions;
- curated bridge episodes;
- representation annotations;
- misconception-targeted feedback.

These assets should be reviewable independently of application code where practical.

---

# 35. Content and Logic Should Be Distinguishable

Authored instructional language should not be scattered unpredictably through rendering logic.

Likewise, mathematical rules should not be embedded in prose templates.

The project should make it possible to answer:

> Where does this explanation come from?

and:

> Where does this mathematical fact come from?

without searching the entire codebase.

---

# 36. Episode Definitions

An episode definition should conceptually describe:

- instructional purpose;
- eligible problem family;
- learner responsibilities;
- system responsibilities;
- relevant narrative beats;
- allowable scaffolds;
- valid representation roles;
- completion conditions.

It should not need to restate the mathematics of the problem family.

That belongs to the Math and Content Model.

---

# 37. Episode Definitions Should Be Reusable

A strong episode definition should work across many valid problem instances.

For example, an unlike-denominator equivalence episode should not need a unique implementation for:

\[
\frac23+\frac14
\]

and:

\[
\frac35+\frac16.
\]

Differences in mathematical state should be supplied through problem data.

The episode provides the instructional grammar.

---

# 38. Avoid One-Off Problem Code

A particularly elegant curated problem may deserve curated content.

It should not ordinarily require custom application logic.

If many problems require one-off code, the architecture probably lacks an appropriate reusable abstraction.

---

# 39. State Should Flow in One Direction

The preferred conceptual flow is:

**content → instructional state → scene → renderer**

Learner interaction produces events that return to instructional logic.

Avoid architectures where visible components mutate shared mathematical data independently.

Unidirectional state flow makes:

- testing;
- replay;
- debugging;
- deterministic behavior;
- representation switching

substantially easier.

---

# 40. Events Should Describe Learner Intent

Interaction events should represent meaningful learner actions rather than presentation-specific details where practical.

Prefer conceptual events such as:

- proposed common denominator;
- submitted equivalent numerator;
- requested hint;
- selected comparison;
- placed fraction location.

Avoid making higher layers depend on low-level details such as:

- clicked rectangle 14;
- dragged SVG group 6;
- pressed button with CSS identifier X.

Renderers and controls translate low-level interaction into meaningful events.

---

# 41. Episode History Should Be Reconstructable

For debugging and review, it should be possible to reconstruct important events in an episode.

A useful conceptual history might contain:

- generated problem identity;
- initial scaffold state;
- learner responses;
- hints requested;
- representation changes;
- instructional transitions;
- final resolution.

This need not become a learner-facing history panel.

It is an architectural capability.

---

# 42. Replay and Reproducibility

A reported issue should ideally be reproducible from enough information to reconstruct:

- problem instance;
- episode definition;
- scaffold state;
- relevant learner actions.

This is especially important for visual transformations.

A bug report should not need to say:

> It happened once with some fractions but I can't reproduce it.

---

# 43. Visual Animation Should Be Derived From State Transitions

Animation should represent a transition:

**known scene state A → known scene state B**

The animation should not itself determine state B.

For example:

1. the Mathematical Core establishes that thirds become twelfths;
2. the Instructional Engine authorizes the transformation;
3. scene state changes from thirds to twelfths;
4. the renderer animates the visible transition.

At no point should animation code calculate that there ought to be twelve parts.

---

# 44. Animation Completion Must Not Define Mathematical Completion

The mathematical transition should be conceptually complete independent of frame timing.

Animations may:

- be skipped;
- use reduced motion;
- complete instantly during testing;
- run at different durations.

The mathematical state must remain identical.

---

# 45. Reduced Motion Should Use the Same State Path

Reduced-motion presentation should not require separate mathematical or instructional logic.

Only the visual transition changes.

For example:

- standard mode may visibly subdivide a bar;
- reduced-motion mode may transition directly to the subdivided state with a restrained emphasis.

Both should end in exactly the same scene.

---

# 46. Responsive Layout Should Be Renderer Responsibility

Mathematical state should not depend on screen size.

A narrow phone and a wide desktop should represent the same mathematical quantities.

Renderers may adapt:

- orientation;
- label placement;
- spacing;
- amount of simultaneous annotation.

They should not alter mathematical meaning.

---

# 47. Representation Eligibility

Not every problem needs to be eligible for every representation.

The content layer should be able to indicate that a particular problem is:

- suitable for a bar;
- suitable for a number line;
- symbolically straightforward;
- unsuitable for a future circle representation due to density.

The instructional engine may then select among valid choices.

A renderer should not be forced to display content outside its validated range.

---

# 48. Capability Should Be Explicit

The system should know what each representation and episode type can support.

For example, a renderer may support:

- proper fractions through a certain visual complexity;
- mixed numbers;
- transformation from denominator \(d_1\) to \(d_2\);
- operation movement.

Unsupported combinations should be excluded before rendering.

Do not rely on presentation components failing gracefully after receiving inappropriate content.

---

# 49. Feature Extension Pattern

A new mathematical feature should generally require changes in this order:

1. extend the mathematical/content model;
2. establish problem-family classifications;
3. define instructional responsibilities;
4. define episode grammar;
5. establish scene concepts;
6. add or extend renderers;
7. validate the complete pathway.

Do not begin by adding a new visual widget and then retrofit mathematical meaning around it.

---

# 50. New Representations Are Plugged Into Shared Meaning

Adding a future representation should not require rewriting existing problem logic.

A new representation should consume mathematical and scene concepts already present, or motivate a carefully reviewed extension to them.

If adding a representation requires duplicating the mathematics, the architecture has failed.

---

# 51. New Problem Families Should Reuse Interaction Grammar

Adding a new fraction family should not automatically require an entirely new UI.

Where possible, existing motifs such as:

- choose;
- predict;
- transform;
- combine;
- remove;
- regroup;
- simplify

should be reused.

Architecture should favor compositional growth rather than feature-specific mini-applications.

---

# 52. Runtime Generative AI Is Outside the Core Architecture

FractionFlow's core practice experience should not require an LLM.

A runtime generative model should not determine:

- mathematical correctness;
- problem transformations;
- instructional sequencing;
- hints;
- visual state;
- animation state.

Future experimentation with generative features should remain optional and isolated from the deterministic instructional core.

---

# 53. Development-Time AI Does Not Alter Product Architecture

Agents may help:

- generate code;
- generate tests;
- draft content;
- inspect behavior;
- propose designs.

Anything produced this way must conform to the same deterministic product contracts.

The fact that development uses AI does not justify runtime uncertainty.

---

# 54. Error Boundaries

The architecture should distinguish major classes of failure.

### Mathematical failure

A derived fraction, result, comparison, or classification is incorrect.

This is critical.

### Instructional failure

Mathematics is correct, but the learner is asked the wrong thing or shown inappropriate support.

### Scene failure

The intended instructional state is correct, but the scene description misrepresents it.

### Rendering failure

The scene meaning is correct, but its visual rendering is incorrect or inaccessible.

### Interaction failure

The learner's intended action is incorrectly interpreted.

### Persistence failure

Progress or preferences fail to save or load.

These distinctions should make defects easier to isolate.

---

# 55. Mathematical Failures Should Be Impossible to Hide Visually

A beautiful visual should never compensate for uncertain mathematics.

If mathematical state is invalid, the affected episode should fail safely rather than silently inventing a plausible display.

The exact production behavior will be specified later, but correctness takes precedence over continuity.

---

# 56. Development Builds Should Be Inspectable

During development and review, the system should make hidden state inspectable.

Reviewers should be able to determine:

- mathematical facts;
- problem family;
- instructional beat;
- learner responsibility;
- scaffold state;
- scene state;
- renderer.

This diagnostic capability should not become part of the normal learner-facing interface.

---

# 57. Human-Readable Specifications

Important project content should remain understandable outside the running application where practical.

Examples include:

- problem-family definitions;
- episode definitions;
- prompt families;
- curated cases;
- capability declarations.

This supports:

- review;
- maintenance;
- agent-assisted development;
- pedagogical inspection;
- version control.

Opaque binary or tool-specific formats should not become the sole source of instructional truth.

---

# 58. Version Control Is the Durable Source of Product Truth

The repository should contain the authoritative definitions of:

- mathematics;
- instructional content;
- representations;
- authored episodes;
- validation assets;
- configuration.

Generated deployment artifacts are disposable.

The repository should be sufficient to explain and rebuild the product.

---

# 59. Build-Time Generation Is Acceptable

Static hosting does not require every asset to be handwritten.

Build processes may generate:

- indexes;
- validated content bundles;
- derived metadata;
- optimized assets;
- deployment files.

Generated artifacts should be reproducible from version-controlled sources.

---

# 60. Dependencies Should Earn Their Complexity

External libraries may be used where they provide substantial value.

Potential examples include:

- animation;
- accessibility utilities;
- exact arithmetic;
- build tooling;
- testing.

However, FractionFlow should avoid dependency accumulation merely for developer convenience.

A dependency should be evaluated against:

- bundle impact;
- maintenance;
- longevity;
- accessibility;
- static-host compatibility;
- whether it encourages architectural violations.

---

# 61. Framework Choice Is Deferred

The founding architecture should not assume:

- React;
- Vue;
- Svelte;
- vanilla JavaScript;
- another framework.

Implementation agents may compare options later.

Framework choice should support the architecture rather than define it.

In particular, component-based tooling must not encourage FractionFlow to become a collection of simultaneous independent widgets.

---

# 62. Visual Technology Is Deferred

The architecture does not prescribe:

- SVG;
- Canvas;
- HTML/CSS;
- WebGL.

Different representations may legitimately use different technologies.

The chosen method must support:

- mathematical precision;
- smooth meaningful transformations;
- responsive design;
- accessibility;
- testability;
- reduced motion.

---

# 63. Representation Technology Should Not Leak Upward

The Instructional Engine should not need to know whether fraction bars are drawn with SVG or HTML.

Likewise, content generation should not depend on DOM geometry.

This preserves replaceability.

---

# 64. Accessibility Semantics Should Be Architectural

The scene and interaction layers should preserve enough semantic information to generate accessible alternatives.

For example, a fraction point should be knowable as:

> three fourths at location three fourths

rather than existing only as a pixel coordinate.

A bar segment should retain:

- its unit;
- its count;
- its relationship to the whole.

This makes accessibility feasible without reverse-engineering graphics.

---

# 65. Localization Should Be Possible Without Changing Mathematics

Although localization is a stretch goal, architecture should avoid entangling mathematical logic with English prose.

Authored language should be separable from:

- exact values;
- episode transitions;
- correctness rules.

This allows future translation without forking the mathematical system.

---

# 66. Presentation Text Should Receive Structured Mathematical Values

Instructional text should not reconstruct notation by parsing display strings.

It should receive meaningful mathematical data and format it appropriately.

For example, a prompt should know it is referring to the denominator 12, not scrape "12" from rendered HTML.

---

# 67. Formatting Is Not Mathematical State

The same value might later appear as:

- stacked fraction notation;
- spoken text;
- accessible linear notation;
- localized text.

Formatting should remain downstream from exact mathematical meaning.

---

# 68. Application State Should Be Minimal

Do not store derived facts redundantly if they can be reliably reproduced from canonical state.

Redundant state creates opportunities for disagreement.

For example, if a problem instance already defines exact operands and common-denominator facts, a renderer should not maintain its own alternate copies.

This follows the project's broader normalization principle.

---

# 69. Derived State Should Be Recomputed, Not Synchronized Manually

Where reasonable, store:

- canonical inputs;
- learner decisions;
- current instructional position.

Derive:

- visual labels;
- eligibility;
- equivalent display forms;
- presentation states.

Avoid manually keeping many copies of the same information synchronized.

---

# 70. Cache Only for Performance, Never Authority

If derived state is cached for speed, the cache remains disposable.

A cache must never become the only place a mathematical or instructional fact exists.

---

# 71. No Hidden Global Mode

Avoid architectures based on a large global flag such as:

- beginner mode;
- advanced mode;
- visual mode.

These tend to create tangled conditional behavior.

Instead, support explicit dimensions such as:

- current problem family;
- scaffold configuration;
- active representation;
- learner responsibility.

This better matches the multidimensional instructional model.

---

# 72. Configuration Should Be Explicit

Practice contexts may eventually specify things such as:

- eligible problem families;
- denominator ranges;
- representation preferences;
- scaffold policy;
- simplification expectations;
- session length.

Such configuration should be explicit and inspectable.

Avoid behavior that depends on unexplained implicit application state.

---

# 73. Defaults Should Produce a Coherent Experience

Although configuration may grow, FractionFlow should have a strong default learning path.

A user should not need to understand the architecture or configure twenty options before practicing.

Complexity belongs beneath the surface.

---

# 74. Teacher Configuration Should Not Become Learner UI

If future teacher or parent tools expose detailed controls, those controls should live outside the learning scene.

The core learner interface should remain calm.

Architecture should preserve this separation from the beginning.

---

# 75. Analytics Are Optional

Core application behavior should not depend on telemetry.

If analytics are later introduced, they should observe well-defined events rather than become intertwined with learning logic.

The product should remain fully functional when analytics are disabled.

---

# 76. Privacy by Architecture

Because the initial system can operate locally:

- no personal identity is required;
- problem generation is local;
- answer checking is local;
- visual rendering is local;
- progress can remain local.

Future features should preserve this baseline where possible.

Remote services should be additions, not retroactive requirements.

---

# 77. Testing Should Follow Architectural Boundaries

Detailed validation belongs to `05-quality-and-validation.md`, but architecture should make isolated testing possible.

At minimum, it should be possible to test independently:

- exact mathematics;
- problem generation;
- problem classification;
- instructional transitions;
- scene generation;
- representation rendering;
- user interaction interpretation;
- persistence.

If everything can only be tested through a browser click sequence, the architecture is too entangled.

---

# 78. Renderers Should Be Testable From Known Scene State

A representation should be capable of receiving a known scene and producing predictable output.

This enables review of cases such as:

- \(2/3\) represented in thirds;
- \(2/3\) represented as \(8/12\);
- a regrouped mixed number;
- equivalent points on a number line.

Testing should not require regenerating an entire learner session for every visual check.

---

# 79. Instructional Transitions Should Be Testable Without Animation

Given:

- problem state;
- scaffold state;
- learner response;

it should be possible to determine the next instructional state without running a visual animation.

This protects pedagogical logic from presentation dependencies.

---

# 80. Content Should Be Testable in Bulk

Generated content should be amenable to large-scale validation.

For example, the project should eventually be able to generate many instances from each problem family and verify that:

- family constraints hold;
- results are exact;
- canonical transformations are valid;
- excluded accidental complexities do not appear.

The architecture should support this naturally.

---

# 81. Failure Should Be Localized

An issue in one optional representation should not prevent symbolic practice from functioning if the mathematics and instructional state remain valid.

Likewise:

- persistence failure should not invalidate the current problem;
- optional analytics failure should not interrupt learning;
- optional enrichment content should not destabilize core episodes.

Architecture should contain failures where reasonable.

---

# 82. Core and Stretch Architecture

The first implementation need not realize every possible architectural extension.

## Core

The architecture must strongly support:

- deterministic fraction mathematics;
- constrained problem generation;
- authored episode patterns;
- fraction bars;
- number lines;
- symbolic notation;
- scaffold variation;
- deterministic validation;
- local sessions;
- static deployment.

## Stretch

The architecture should permit later addition of:

- durable learner profiles;
- teacher configuration;
- cloud synchronization;
- localization;
- richer representations;
- more advanced mathematics;
- optional anonymous telemetry;
- classroom assignment workflows.

Core implementation should not be delayed merely to prebuild every stretch capability.

---

# 83. Avoid Premature Generalization

FractionFlow should not begin by building a universal mathematics engine, universal tutoring engine, or general visualization framework.

Its abstractions should arise from demonstrated needs in fraction learning.

A good architecture is extensible.

It does not need to be infinitely generic.

---

# 84. Avoid Premature Backend Design

Do not introduce servers merely because future features might someday require them.

The static-first architecture is both sufficient and advantageous for the founding scope.

A backend should enter the architecture only when a concrete feature justifies:

- cost;
- privacy impact;
- operational complexity;
- failure modes;
- maintenance.

---

# 85. Avoid UI-State Architecture

The project should not be organized primarily around:

> what components are currently on screen?

Instead, the stronger question is:

> what mathematical and instructional state currently exists?

The screen is a projection of that state.

This distinction is central to avoiding dashboard-like development.

---

# 86. Avoid Parallel Widget Architecture

An architecture such as:

- FractionBarWidget;
- NumberLineWidget;
- EquationWidget;
- HintWidget;
- StepWidget;

each maintaining their own state and listening to one another is contrary to the founding vision.

FractionFlow should instead have:

- one episode;
- one authoritative state;
- one current mathematical focus;
- whichever representations are presently appropriate.

Components may exist technically.

They should not become independent instructional actors.

---

# 87. Avoid Business Logic in Animation Callbacks

The application should not rely on logic such as:

> when this animation finishes, calculate the next equivalent fraction.

The next mathematical state should already be known.

Animation completion may permit the next interaction to become available, but it should not establish mathematical truth.

---

# 88. Avoid Prose as State

The system should never need to parse:

> "eight twelfths"

or:

> "Try finding a common denominator"

in order to determine what state the learner is in.

Instructional prose describes state.

It does not define it.

---

# 89. Avoid URL or Navigation Proliferation for Episode Steps

A learning episode should generally remain one continuous interaction.

Do not model each narrative beat as a separate page or route unless a strong need emerges.

The learner should perceive continuity.

---

# 90. Architectural Review Questions

When evaluating a proposed implementation design, ask:

1. Where does mathematical truth live?
2. Can presentation code alter it?
3. Where is problem-family membership determined?
4. Who decides the learner's current responsibility?
5. How does a renderer know what to show?
6. Could another renderer consume the same mathematical state?
7. Are learner accomplishments stored independently of visual appearance?
8. Is the same fact duplicated in several layers?
9. Can the episode be reproduced?
10. Can the mathematics be tested without rendering?
11. Can instructional transitions be tested without animation?
12. Can visuals be tested from known scene states?
13. Can core practice run without a server?
14. Can a future optional service be added without infecting the core?
15. Has a component become an independent mini-application?
16. Could the architecture encourage dashboard accumulation?

If the answers are unclear, the design needs further normalization.

---

# 91. Canonical Data Flow Example

Consider:

\[
\frac23+\frac14.
\]

### Content selection

The system chooses a problem from the relatively-prime unlike-denominator addition family.

### Mathematical state

The Mathematical Core establishes facts including:

\[
\operatorname{lcm}(3,4)=12
\]

\[
\frac23=\frac8{12}
\]

\[
\frac14=\frac3{12}
\]

and:

\[
\frac8{12}+\frac3{12}=\frac{11}{12}.
\]

### Instructional state

The current episode determines that the learner is responsible for selecting a common denominator.

The equivalent numerators have not yet been established by the learner.

### Scene state

The scene describes two quantities currently represented in thirds and fourths.

### Renderer

A fraction-bar renderer depicts those quantities.

### Learner action

The learner proposes 12.

### Validation

The Mathematical Core confirms that 12 is a valid common denominator.

### Instructional transition

The learner has now established the common unit.

The episode moves to equivalent-fraction construction.

### Scene transition

The quantities are prepared to be shown subdivided into twelfths.

### Animation

The renderer visually performs that already-established transformation.

At no point does the animation decide what the denominator should be.

---

# 92. Canonical Representation Bridge Example

A learner has established:

\[
\frac23=\frac8{12}.
\]

The Instructional Engine begins a bridge episode.

### Existing state

The quantity is already known exactly.

### Scene transition

The scene changes from:

> quantity expressed as a bar with a fixed endpoint

to:

> same quantity expressed relative to a number-line interval.

### Renderer transition

The visual system preserves an appropriate spatial anchor and changes representation.

### Mathematical state

Unchanged.

### Learner state

Previous accomplishments remain intact.

This demonstrates the architectural meaning of:

> change the representation, not the mathematical object.

---

# 93. Canonical Help Example

A learner incorrectly attempts:

\[
\frac13+\frac14=\frac27.
\]

### Interaction layer

Captures the proposed answer.

### Mathematical validation

Determines it is incorrect and recognizes that it matches a detectable numerator-plus-numerator / denominator-plus-denominator response pattern.

### Instructional engine

Chooses an appropriate local support step.

### Scene

Emphasizes the differing unit sizes.

### Renderer

Shows or strengthens the approved representation.

The renderer does not diagnose the misconception.

The instructional engine does not invent the mathematical classification.

Each layer contributes its own responsibility.

---

# 94. Architectural Character

If the architecture succeeds, FractionFlow should be able to evolve substantially while retaining a stable core.

Developers should be able to:

- improve bar animation without rewriting fraction arithmetic;
- add a number-line interaction without duplicating answer validation;
- alter scaffold sequencing without changing mathematical truth;
- add curated problems without creating one-off components;
- replace a rendering technology without rewriting instruction;
- add local persistence without altering the episode model;
- add an optional backend without making it responsible for core learning.

The architecture should make the pedagogically desirable implementation the easiest implementation to maintain.

---

# 95. Final Architectural Contract

FractionFlow should have:

**one mathematical truth,  
one authoritative episode state,  
many possible problem instances,  
a small number of authored instructional patterns,  
and multiple representations that project shared meaning.**

The architecture should discourage:

**duplicated mathematics,  
parallel instructional widgets,  
presentation-owned state,  
runtime pedagogical improvisation,  
and unnecessary infrastructure.**

The learner should experience a simple mathematical interaction.

The simplicity should be made possible by disciplined structure beneath it.