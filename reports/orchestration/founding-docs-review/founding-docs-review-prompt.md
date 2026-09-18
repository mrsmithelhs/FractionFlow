# FractionFlow Founding Documents — Independent Adversarial Review

You are conducting an independent, skeptical review of the founding specifications for **FractionFlow**, a free browser-based fraction-learning project.

Your review is advisory only.

**Do not modify, create, delete, rename, or commit any repository files.**
**Place your complete review directly in the chat.**

You may inspect the repository and use available research/search tools. You may also delegate bounded research questions to lower-tier subagents if your environment supports that. Any subagent work must remain read-only with respect to the repository.

---

# 1. Materials to Review

The canonical founding documents are in:

`docs/founding/`

Read the complete founding set before reaching conclusions, including:

- `docs/founding/00-principles.md`
- `docs/founding/01-instructional-model.md`
- `docs/founding/02-interaction-grammar.md`
- `docs/founding/03-math-and-content-model.md`
- `docs/founding/04-system-architecture.md`
- `docs/founding/05-quality-and-validation.md`
- `docs/founding/06-roadmap.md`

You may inspect a short project README or nearby repository context when necessary to understand these documents, but the founding documents are the subject of this review.

Do not assume the specifications are correct merely because they are detailed or internally confident.

**Publication check.** This repository's remote is public. As you read, flag anything in the founding set (or the repository context you inspect) that must not be published to a public repository — personal information, student references, internal identifiers, secrets. Report such items as findings regardless of which review angle they fall under.

---

# 2. Fixed Project Goals

Do **not** critique the project merely for pursuing the following goals. Treat them as design constraints supplied by the project owner.

FractionFlow is intended to be:

- a **calm**, focused learning environment rather than a crowded educational dashboard;
- an **interactive fraction-practice system**;
- particularly useful for helping learners develop better fluency with **equivalent fractions and unlike denominators**;
- designed to connect visual/conceptual understanding to increasingly efficient **symbolic fraction reasoning**;
- capable of progressively reducing scaffolding as learners gain competence.

You may criticize any proposed mechanism for accomplishing these goals.

For example, you may argue that:

- a specified representation is poorly suited to a goal;
- the proposed sequencing is unsupported;
- the architecture is unnecessarily elaborate;
- animation may increase cognitive load;
- the progression may teach a misconception;
- a simpler interaction would better serve the same goal;
- the product scope is too broad or too narrow;
- an existing product already solves an important portion of the problem unusually well.

You should not simply argue that FractionFlow should abandon fraction practice, conceptual scaffolding, calm interaction, or progression toward symbolic fluency.

---

# 3. Review Posture

Approach the specifications as a critical peer reviewer, not as:

- an advocate trying to validate the design;
- a hostile critic trying to maximize the number of objections;
- an implementer obligated to accept all design decisions.

Your task is to determine:

> **Where are these specifications strong, where are they weak, and what should change before substantial development begins?**

Actively search for:

- unsupported assumptions;
- contradictions;
- hidden complexity;
- likely learner failure modes;
- technical impossibilities or awkwardness;
- specification gaps;
- unnecessary duplication;
- overengineering;
- under-specification;
- features whose costs exceed their likely instructional value.

But calibrate your conclusions.

A reasonable design tradeoff is not a defect merely because another choice exists.

---

# 4. Evidence Standard

The most valuable findings are evidence-backed.

Evidence may be either **internal** or **external**.

## Internal evidence

Examples:

- two founding documents specify incompatible behavior;
- a founding document contradicts `docs/project-seed.md` or the root `README.md` (scope, the
  `mathematical state → instructional state → presentation` separation rule, the proposed
  folder structure, or the three seed packet outlines) — the seed brief is what the first
  orchestrator will treat as operating context, so founding-doc/seed-brief conflicts are
  internal evidence even though the seed brief is not a founding document;
- the same concept is defined differently in multiple canonical locations;
- a roadmap milestone depends on a capability the architecture does not support;
- the interaction grammar contradicts the instructional model;
- the proposed state model cannot preserve an interaction the specifications require;
- a quality criterion cannot actually be tested as described;
- the documents promise both behaviors A and B even though they cannot coexist;
- a concept lacks a clear canonical owner;
- the same normative material is repeated enough that specification drift is likely.

For internal findings, identify the relevant:

- file;
- section or heading;
- conflicting or problematic requirement.

Quote only enough text to make the issue clear.

## External evidence

Use external evidence when it can materially test an assumption.

Examples include:

- mathematics-education research;
- cognitive-science research;
- learning-science research;
- HCI and interaction-design research;
- accessibility standards and empirical accessibility work;
- child-development research;
- multimedia-learning research;
- educational technology evaluations;
- browser/platform constraints;
- privacy or child-data regulations;
- security guidance;
- studies of adaptive learning;
- existing products that substantially overlap FractionFlow's proposed niche.

Prefer, when available:

1. primary research;
2. systematic reviews or meta-analyses;
3. major research syntheses;
4. authoritative standards or official documentation;
5. high-quality secondary sources.

Distinguish clearly between:

- established evidence;
- plausible interpretation;
- expert/design judgment;
- speculation.

Do not decorate minor opinions with weak citations merely to make them appear stronger.

---

# 5. External Research Is Optional but Encouraged Where It Matters

You do not need to research every observation.

Use research selectively to test important hypotheses.

Examples:

- Do multiple linked representations improve fraction understanding, and under what conditions?
- Does visual scaffolding risk delaying symbolic fluency?
- Is the proposed use of number lines consistent with current fraction-learning evidence?
- Is explicit work with least common denominators pedagogically well sequenced?
- Does animation aid understanding of mathematical transformations, or can it create transient-information problems?
- Does scaffold fading work better under particular conditions?
- Does interleaving at the proposed stage help or hurt?
- Are there established fraction misconceptions that the documents overlook?
- Are there accessibility concerns specific to interactive mathematical graphics?
- Does an existing free tool already implement the proposed central experience unusually well?

If you delegate research, give subagents narrow questions rather than asking them to review the whole project independently.

---

# 6. Review Angles

Do not feel obligated to find a problem in every category.

Use these angles as lenses for investigation.

## A. Mathematics and mathematical fidelity

Examine:

- correctness of the mathematical model;
- equivalent-fraction reasoning;
- common denominator treatment;
- least-common-denominator treatment;
- simplification;
- mixed numbers;
- regrouping;
- magnitude reasoning;
- alternate valid solution paths;
- boundaries of the proposed mathematical domain.

Look especially for places where an instructional simplification could accidentally become false mathematics.

---

## B. Fraction pedagogy

Examine whether the proposed learning progression is well supported.

Consider:

- unit-fraction reasoning;
- part-whole models;
- number-line models;
- equivalence;
- denominator meaning;
- common-unit reasoning;
- mixed numbers;
- transition to procedural fluency;
- treatment of estimation and magnitude;
- likely misconceptions;
- conceptual repair for learners who already know brittle procedures.

Ask whether important prerequisite concepts are missing or misplaced.

---

## C. Cognitive science and cognitive load

Examine:

- working-memory demands;
- split attention;
- transient information;
- simultaneous versus sequential representations;
- prediction before demonstration;
- amount of prompting;
- scaffold fading;
- retrieval;
- interleaving;
- blocked practice;
- transfer;
- expertise reversal;
- over-scaffolding;
- unnecessary verbal burden.

A visually elegant sequence can still be cognitively poor.

---

## D. Representation design

Critically examine the proposed roles of:

- fraction bars;
- number lines;
- symbolic notation;
- future representations.

Ask:

- Does each representation expose what the specification claims?
- Are proposed morphs mathematically and perceptually meaningful?
- Could transitions imply false continuity?
- Does maintaining spatial anchors always make sense?
- Are there cases in which showing representations simultaneously would actually be superior to transforming between them?
- Does the strong preference against simultaneous representations go too far?
- Are there useful representations omitted from core scope?
- Are proposed visual denominator limits realistic?

---

## E. Interaction and UX design

Examine:

- the narrative-beat model;
- one-focus-at-a-time principle;
- help behavior;
- local error recovery;
- learner agency;
- prompt density;
- repeated interaction fatigue;
- representation switching;
- replay;
- transition timing;
- input mechanics;
- touch behavior;
- symbolic entry;
- progression toward quieter interfaces.

Ask whether repeated narrative choreography could become tedious or predictable in a harmful way.

---

## F. Accessibility and inclusive design

Examine:

- keyboard access;
- screen readers;
- touch targets;
- precision interactions;
- reduced motion;
- color reliance;
- mathematical semantics for graphics;
- readable notation;
- zoom and responsive behavior;
- motor accessibility;
- cognitive accessibility;
- reading burden;
- learners with low vision;
- learners with dyscalculia or other learning differences;
- multilingual learners.

Identify cases where an "equivalent accessible interaction" may be substantially harder to build than the documents imply.

---

## G. Child-centered and classroom usability

Consider realistic use by approximately upper-elementary learners.

Ask:

- Will instructions be understandable?
- Will learners wait passively for animation?
- Will they game prompts?
- Will repetitive episodes become irritating?
- Is the experience practical on school Chromebooks?
- How does it behave in short practice sessions?
- Can a child recover after becoming confused?
- Is there enough motivational structure without clutter?
- Is the interface perhaps too austere for sustained voluntary use?
- Is the proposed learner independence model realistic?

Distinguish classroom practicality from abstract UI elegance.

---

## H. Technical architecture

Critically examine:

- separation of mathematical, instructional, scene, and renderer state;
- whether the proposed boundaries are actually useful;
- whether there are too many conceptual layers;
- deterministic generation;
- reproducibility;
- static hosting;
- persistence;
- event/state architecture;
- representation transitions;
- testing seams;
- framework independence;
- expansion paths.

Look for both:

- dangerous coupling;

and:

- excessive abstraction.

The architecture should not receive credit merely for having many cleanly named layers.

---

## I. Feasibility of the interaction vision

Some proposed experiences may sound elegant in prose but prove awkward in real implementation.

Investigate issues such as:

- morphing a bar into a number line responsively;
- maintaining meaningful anchors across layouts;
- animating equivalence while preserving accessibility;
- keeping symbolic notation spatially tied to moving objects;
- dynamic fraction typography;
- mixed-number regrouping animations;
- restoring episode state when changing representation;
- reduced-motion equivalents;
- responsive geometry on small screens.

Flag places where the specification demands something disproportionately difficult for its instructional payoff.

---

## J. Testing and validation

Examine whether the quality model is:

- sufficient;
- realistically achievable;
- excessively broad;
- missing important forms of testing;
- duplicative of other specifications.

Consider:

- property-based mathematical tests;
- generator distribution tests;
- visual regression;
- accessibility testing;
- browser testing;
- usability testing;
- pedagogical validation;
- deterministic replay.

Identify criteria that sound rigorous but cannot realistically establish what they claim.

---

## K. Security

Even though the initial product is static-first, consider:

- dependency and supply-chain risk;
- third-party scripts;
- content injection;
- URL/configuration parsing;
- local persistence;
- cross-site scripting;
- future teacher-created content;
- future shareable configurations;
- future backend expansion;
- deployment security.

Do not manufacture severe threats where the static architecture genuinely keeps risk low.

---

## L. Privacy and child data

Examine:

- local persistence;
- analytics;
- future progress synchronization;
- telemetry;
- identifiable versus non-identifiable learning data;
- child privacy concerns;
- implications of possible classroom use.

Where relevant, investigate regulatory or policy concerns such as COPPA, FERPA, school procurement expectations, or similar obligations.

Distinguish present risks from risks introduced only by stretch goals.

---

## M. Performance and platform constraints

Consider:

- low-end Chromebooks;
- phones;
- browser support;
- animation performance;
- SVG/Canvas/HTML tradeoffs where relevant;
- large bundles;
- static hosting;
- offline resilience;
- assistive technology.

Flag architectural decisions that might make the desired visual polish expensive or fragile.

---

## N. Maintainability and project sustainability

Ask:

- Is the specification set understandable enough for future contributors?
- Are too many abstractions being introduced before experience justifies them?
- Will authored episode families become expensive to maintain?
- Could prompt/hint variations multiply combinatorially?
- Will every problem family require specialized review?
- Could representation transitions create a very large QA surface?
- Is the project maintainable as a free project?

---

## O. Specification architecture and normalization

The founding set intentionally tries to avoid redundancy.

Review whether it succeeds.

Identify:

- repeated normative definitions;
- unclear ownership;
- circular dependencies;
- contradictions;
- concepts with no owner;
- concepts owned by multiple documents;
- sections that would be better referenced than restated.

Do **not** criticize repetition that is genuinely useful orientation or a concise contextual reminder.

Focus on repetition likely to create specification drift.

---

## P. Roadmap and scope

Examine:

- whether the vertical-slice strategy is sound;
- whether phases occur in the right order;
- whether a supposedly later capability is actually required earlier;
- whether mixed numbers enter too early or too late;
- whether number lines enter too late or too early;
- whether scaffold adaptation is postponed too long;
- whether the roadmap overcommits to features before learner testing;
- whether "core" is too large for a credible initial product;
- whether some stretch feature should actually be core.

Distinguish:

- prototype;
- useful MVP;
- mature core release.

The roadmap does not necessarily need to use the same threshold for all three.

---

## Q. Existing-product overlap

Investigate whether existing free or low-cost tools substantially cover the proposed experience.

Do not merely list fraction websites.

Ask whether another product already provides the distinctive combination of:

- guided equivalence reasoning;
- unlike-denominator practice;
- linked visual and symbolic representations;
- vetted transformations;
- scaffold fading;
- representation transfer;
- calm focused interaction.

If a strong overlap exists, explain:

- what it covers;
- what FractionFlow would still add;
- whether building FractionFlow remains justified.

Duplication alone is not a decisive objection. A different instructional design can justify a new product.

---

## R. Missing perspectives

Actively look for important review dimensions not listed above.

Examples might include:

- licensing;
- open-source sustainability;
- localization;
- ethics;
- equity;
- mathematical notation standards;
- curriculum alignment;
- device sharing;
- parental usability;
- teacher setup burden;
- observability/debugging;
- long-term content governance.

Add categories where needed.

---

# 7. Challenge Central Design Assumptions

Give particular attention to assumptions repeated across the founding documents.

Examples include:

> one focal representation is usually better than simultaneous representations;

> representations should transform into one another where possible;

> fraction bars should precede number lines in development;

> common denominators should be framed primarily as common units;

> scaffolds should fade toward symbolic-only work;

> deterministic authored narrative is preferable to runtime generative explanation;

> the first major vertical slice should be unlike-denominator addition;

> static hosting should remain sufficient for the core product;

> problem instances should be generated while instructional narratives remain authored;

> calmness requires removing persistent progress and motivational UI.

Do not assume these are correct because multiple specifications repeat them.

Test them.

If you agree, say why.

If you disagree, identify a better alternative.

---

# 8. Look for Specification-Induced Blind Spots

Detailed specifications can accidentally make later reviewers think only inside the proposed system.

Try to step outside it.

Ask questions such as:

- Is the project solving the right subproblem?
- Would a different instructional sequence be substantially simpler?
- Is animation being asked to carry too much of the pedagogy?
- Would direct manipulation sometimes be better than narrative progression?
- Would side-by-side comparison sometimes outperform morphing?
- Could paper-like symbolic annotation be more useful than some visual transformations?
- Does the product need to teach more prerequisite fraction magnitude before operations?
- Is simplification receiving disproportionate attention?
- Would free construction sometimes be better than constrained prompts?
- Could the product become overly tutorialized rather than useful for practice?

The fixed goals constrain the destination, not the proposed route.

---

# 9. Look for False Success

One of the most important review tasks is to identify ways FractionFlow might appear to work while learners have not learned the intended mathematics.

Examples include:

- visuals reveal the answer;
- repeated choreography teaches interface prediction rather than fraction reasoning;
- multiple-choice denominator prompts permit guessing;
- animation creates recognition without recall;
- students can follow transformations without understanding invariance;
- scaffold fading occurs after procedural memorization rather than conceptual learning;
- success in one representation does not transfer;
- students learn the site's generated problem patterns;
- immediate feedback prevents durable retrieval.

Identify likely false-success modes and how the specifications could guard against them.

---

# 10. Look for False Difficulty

Also identify cases where FractionFlow might make mathematics harder than necessary.

Examples include:

- excessive micro-prompts;
- unnecessary representation changes;
- long animations;
- overformal language;
- interactions that demand precision unrelated to mathematics;
- forcing an instructional pathway after learners already understand it;
- asking conceptual questions so often that practice loses fluency.

Difficulty should primarily come from the mathematics.

---

# 11. Distinguish Foundational Problems From Implementation Details

This review occurs before detailed development planning.

Do not demand that founding documents specify every:

- function;
- state object;
- breakpoint;
- animation duration;
- browser target;
- storage schema.

However, do flag missing detail when a founding decision cannot be evaluated without it.

A useful distinction is:

### Foundational gap

The project does not yet know what behavior it wants.

### Implementation detail

The behavior is clear; engineers can reasonably determine how to implement it later.

Do not confuse the two.

---

# 12. Required Output Structure

Place the complete review directly in chat.

Use the following structure.

## 1. Overall assessment

In a few paragraphs, characterize the founding design.

Address:

- what appears strongest;
- what appears most fragile;
- whether the documents provide a credible foundation for development;
- the most important thing you would change before implementation.

Do not give a numeric score.

---

## 2. Highest-priority findings

Present the most consequential findings first.

For each finding include:

### Finding

A concise descriptive title.

### Severity

Use one of:

- **Critical** — likely to cause incorrect mathematics, major instructional harm, or architectural failure if left unresolved;
- **High** — substantial risk to core project goals;
- **Moderate** — meaningful weakness that deserves consideration before or during development;
- **Low** — useful improvement but not a major blocker;
- **Observation** — noteworthy tradeoff or unresolved question rather than a defect.

### Confidence

Use:

- **High**
- **Medium**
- **Low**

### Evidence

Identify internal specification evidence and/or external evidence.

For internal evidence, cite exact file paths and relevant headings.

For external evidence, provide source links or citations and publication information where practical.

### Why it matters

Explain the likely consequence.

### Recommended response

Recommend one of:

- revise a founding document now;
- explicitly investigate before development;
- test during the first vertical slice;
- defer until later;
- retain the current design.

When recommending a specification change, identify which founding document should canonically own it.

---

## 3. Cross-document conflicts and normalization issues

Identify:

- contradictions;
- duplicated normative material;
- unclear ownership;
- terminology drift;
- roadmap/spec mismatches.

If you find no important conflicts, say so.

Do not invent conflicts merely to populate this section.

---

## 4. Assumptions that survived scrutiny

Identify several important design choices that you actively challenged but ultimately found reasonable or strong.

Explain briefly why.

This section is important: adversarial review should not erase evidence in favor of the design.

---

## 5. Missing or underdeveloped concerns

Identify issues the founding documents give insufficient attention to.

Separate:

- issues that should be fixed before development;
- issues that can reasonably wait until implementation or learner testing.

---

## 6. Research findings

If you performed external research, summarize the strongest relevant evidence.

For each major source or body of evidence explain:

- what question it addresses;
- what it suggests;
- how directly it applies to FractionFlow;
- important limitations.

Do not provide a generic bibliography disconnected from the review.

---

## 7. Existing-product comparison

If you found substantial overlap with existing products, summarize it here.

Focus on whether they actually duplicate FractionFlow's intended distinctive learning experience.

If no strong duplicate was found, say so rather than padding the section with weak matches.

---

## 8. Pre-development revision recommendations

Provide a short prioritized set of changes you would make to the founding documents **before coding begins**.

For each, identify the owning document.

Keep this list selective.

Do not turn every moderate observation into mandatory pre-development work.

---

## 9. Questions best answered by prototyping rather than specification

Some uncertainties cannot be settled well in Markdown.

Identify the most important hypotheses that should be tested during the first working vertical slice.

Examples might include:

- whether the subdivision animation is perceptually clear;
- whether prompt density is tolerable;
- whether representation morphing clarifies equivalence;
- whether children understand the intended visual anchor;
- whether the symbolic/visual transition feels coherent.

These should become empirical prototype questions rather than endless specification debates.

---

## 10. Bottom line

Conclude with a concise answer to:

> If you were advising the project owner before development began, what would you preserve, what would you change now, and what would you deliberately leave unresolved for prototyping?

---

# 13. Review Discipline

Keep the following rules throughout the review.

### Do not mutate the repository.

Your output belongs only in chat.

### Review independently.

Do not assume another reviewer will catch an issue.

### Do not perform criticism theater.

More findings do not make a better review.

### Do not reward detail for its own sake.

A long specification can still be wrong.

### Do not penalize intentional deferral.

Founding documents need not contain implementation plans.

### Do not treat personal preference as evidence.

Identify when a recommendation is primarily design judgment.

### Do not assume cited research proves this exact product will work.

Explain transfer limitations.

### Do not assume existing products eliminate the value of FractionFlow.

Compare the distinctive instructional proposition.

### Do not assume novelty proves value either.

If a proposed feature is new but weakly justified, say so.

### Prefer actionable criticism.

When possible, identify a concrete specification revision, prototype experiment, or research question.

---

# 14. Research Delegation Guidance

If you can spawn lower-tier research subagents, use them for narrow questions such as:

- "Find recent reviews of number-line instruction for fraction magnitude in upper-elementary students."
- "Investigate evidence comparing simultaneous and sequential multiple representations in mathematics learning."
- "Find research on animation versus static diagrams for mathematical transformation learning."
- "Audit the proposed privacy model against current U.S. child-privacy considerations for a static educational website."
- "Search for existing free tools that combine guided unlike-denominator practice with linked bar, number-line, and symbolic representations."
- "Investigate accessibility guidance for interactive mathematical SVGs and number-line placement tasks."

Do not delegate:

> Review FractionFlow.

The lead reviewer should synthesize the project-level conclusions.

---

# 15. Final Standard

The best review is not the one that finds the most faults.

The best review leaves the project owner with a clearer distinction among:

- **things that are genuinely wrong or dangerous;**
- **things that are plausible but need evidence;**
- **things that should be tested through prototyping;**
- **things that are reasonable design choices;**
- **things that can safely wait.**

Review FractionFlow aggressively enough to expose weak assumptions, but fairly enough that strong ideas survive intact.

---

# 16. What Happens After This Review

You are not being asked to apply any change. After this review, the disposition flow is:

1. The project owner triages each finding (accept / reject / defer) — a finding's
   severity is the reviewer's recommendation, not an automatic mandate.
2. The owner revises the founding documents directly; they are owner-authored and have
   no packet board or orchestrator yet.
3. Only after the revisions land does the repository's orchestrator spin up and the
   first packets get written — so nothing here should assume the founding documents
   are frozen canon.

If a finding would require a change to `docs/project-seed.md` or the root `README.md`
rather than a founding document, say so explicitly; those files are edited in the same
owner pass.