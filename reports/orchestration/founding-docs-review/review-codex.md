## 1. Overall assessment

**FractionFlow has a credible instructional foundation, but I would make a small set of targeted revisions before substantial implementation.** Its strongest ideas are the distinction between numerical value and displayed form, common denominators as common units, acceptance of mathematically valid alternatives, local error recovery, and the separation of mathematical truth from presentation.

The documents also anticipate many familiar educational-software failures. They explicitly reject equating clicking with understanding, treating unsimplified answers as wrong, keeping capable learners trapped in tutorials, and claiming that attractive diagrams prove learning. Those commitments survive scrutiny.

The most fragile part is the translation from those commitments into **acceptance decisions**: what qualifies as independent reasoning, which access modes must work, what happens when a valid mathematical choice exceeds a representation’s limits, and what evidence justifies expanding the first episode into a larger product. The specifications are more precise about the desired experience than about these boundaries.

**The most important instructional change is to make the first slice distinguish supported success from independent understanding.** A learner correctly answering after counting a displayed subdivision has accomplished something useful, but that is different evidence from predicting the subdivision or constructing an equivalent fraction without it. The canonical examples need to preserve that distinction.

My coverage was:

- **Went deep on:** all seven founding documents, read completely; their mathematical contracts, interaction examples, architectural boundaries, validation requirements, and development sequence; conflicts with the seed brief and root README.
- **Swept only:** surrounding repository guidance, publication-sensitive content in the inspected files, current product overlap, and selected fraction-learning and accessibility research.
- **Not covered at all:** implemented application behavior, actual learner performance, runtime accessibility, device performance, deployed network behavior, dependency security, or a repository-history secrets audit. This was a specification review, not a product certification.

I also executed small arithmetic checks for the regrouping and alternate-denominator examples discussed below. These check the review’s counterexamples; they are not tests of a FractionFlow implementation.

**Publication check:** I found no publish-blocking personal information, identifiable student references, credentials, secrets, or private identifiers in the founding set and nearby context inspected. That conclusion does not extend to uninspected files or Git history.

No repository files were created, modified, deleted, renamed, staged, or committed.

## 2. Highest-priority findings

### F1. The founding documents weaken the repository’s static-only and no-tracking boundary

**Severity: High**  
**Confidence: High**  
**Evidence type: Verified specification conflict**

The [project seed, “Defining properties”](../../../docs/project-seed.md#L17) establishes a **static-only** architecture: no server, accounts, or backend, with progress stored locally. Its “Scope discipline” also identifies teacher dashboards as a project non-goal.

The founding set uses materially different language:

- [00-principles.md, §20, “Free and Low-Friction by Default”](../../../docs/founding/00-principles.md#L539) makes static hosting a preference and allows future accounts, servers, analytics, and synchronization when justified.
- [04-system-architecture.md, §3, “Static-First Does Not Mean Architecturally Rigid”](../../../docs/founding/04-system-architecture.md#L86) explicitly anticipates synchronized progress, research telemetry, classroom management, and account settings.
- [06-roadmap.md, §§79–80](../../../docs/founding/06-roadmap.md#L1379) places cloud progress and classroom functionality on the stretch roadmap.
- [README.md, “Privacy and data boundary”](../../../README.md#L65) says there is no learner tracking, while also contemplating remote storage after privacy design.

**Why it matters:** An implementer could reasonably interpret a future service as an already-approved architectural direction that merely needs justification. The seed and agent guidance instead make it a change to the project’s defining constraints. Those are different authorization boundaries, particularly for a product intended for children.

This is not a claim that an ordinary persistence interface is overengineering or that a future backend is inherently unacceptable. The defect is uncertainty about what the owner has decided.

**Recommended response: Revise a founding document now.**

Make **00-principles.md** the canonical owner of the product boundary. My recommendation is to preserve static-only operation and local progress as the standing contract, and label accounts, remote learner data, telemetry, and classroom tracking as **out of scope unless the owner explicitly revises that contract**.

Then align the architecture, roadmap, **project seed and root README** in the same owner pass. Privacy review should accompany a future scope decision, not silently substitute for one.

### F2. Accessibility is a stated gate without a sufficiently firm acceptance floor

**Severity: High**  
**Confidence: High**  
**Evidence type: Verified specification gap, supported by an authoritative standard**

The commitments are strong, but qualifiers weaken them at the point of acceptance:

- [00-principles.md, §17](../../../docs/founding/00-principles.md#L465) promises screen-reader interpretation “where feasible.”
- [05-quality-and-validation.md, §38, “Keyboard Validation”](../../../docs/founding/05-quality-and-validation.md#L827) qualifies required keyboard actions with “where reasonably feasible.”
- [05-quality-and-validation.md, §43, “Screen-Reader Meaning”](../../../docs/founding/05-quality-and-validation.md#L906) requires useful semantics, but does not establish when a complete nonvisual learning path is necessary.
- [06-roadmap.md, Phase 2 exit gate](../../../docs/founding/06-roadmap.md#L550) requires the “intended access modes” to work without defining the minimum intended modes.

An implementer could satisfy these passages by making controls keyboard accessible and graphics labeled while leaving the actual reasoning task inaccessible.

There is also a specific testing trap: [05-quality-and-validation.md, §40](../../../docs/founding/05-quality-and-validation.md#L861) gives keyboard movement as a dragging alternative. Keyboard access is necessary, but it does not by itself satisfy the separate requirement for a non-drag **single-pointer** alternative under WCAG 2.2. A touchscreen user may need taps rather than either dragging or a physical keyboard. [W3C explanation of SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)

**Why it matters:** Accessibility can change the instructional mechanism. A number-line control that announces the target’s exact answer, or an alternative that lets a learner copy the fraction already stated in the prompt, may be operable while testing a different skill.

**Recommended response: Revise now, and prove feasibility in the first slice.**

Use **00-principles.md** for the commitment and **05-quality-and-validation.md** for acceptance. I recommend WCAG 2.2 AA as the technical baseline, alongside the project’s stronger requirement to preserve mathematical agency. This is a proposed quality target, not a legal-compliance conclusion. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Require an end-to-end first-slice review covering:

- keyboard operation;
- touch operation without precision dragging;
- screen-reader use;
- reduced motion;
- zoom/reflow and readable mathematical notation.

The exact implementation can remain deferred. Whether a core learning task must work through those modes should not.

### F3. The canonical examples blur supported construction, prediction, and transfer

**Severity: Moderate**  
**Confidence: High about the ambiguity; Medium about its eventual learning impact**  
**Evidence type: Internal instructional tension**

In [02-interaction-grammar.md, §75, “A Canonical Episode Example”](../../../docs/founding/02-interaction-grammar.md#L1490), the system:

1. asks for a common denominator;
2. subdivides the quantities into twelfths;
3. then asks for the equivalent numerators.

A learner can potentially count eight selected twelfths and three selected twelfths. That is a legitimate **supported unit-counting task**. It does not establish that the learner could predict the equivalent numerators before seeing the subdivision.

Similarly, [§76, “A Canonical Bridge Example”](../../../docs/founding/02-interaction-grammar.md#L1568) preserves an endpoint while asking where it belongs on a number line. An aligned endpoint can support a useful invariance demonstration, but can also make the location answer perceptually available.

The quality document correctly warns against precisely this kind of confusion in [§19, “Scaffold Leakage”](../../../docs/founding/05-quality-and-validation.md#L495) and [§58, “Bridge Episodes Should Actually Test Transfer”](../../../docs/founding/05-quality-and-validation.md#L1201).

**Why it matters:** The reference episode is likely to become the implementation template. If all correct responses become equivalent evidence of understanding, the system could fade support on the strength of counting, recognition, or predictable interface choreography.

I am **not** recommending that helpful visuals be hidden whenever they make a question easier. Supporting reasoning is their purpose. The missing distinction is what the response demonstrates.

**Recommended response: Revise the canonical examples now; test their effectiveness during the first slice.**

Let **02-interaction-grammar.md** explicitly distinguish:

- **Supported construction:** inspect and count the transformed units.
- **Prediction:** supply the numerator before the relevant transformation is shown.
- **Independent transfer:** locate or reconstruct the quantity in a fresh representation without an answer-position cue.

Let **01-instructional-model.md** own how these observations inform fading. A response after a hint, replay, or revealing transformation should retain that context.

Apply the same disclosure rules to visible labels, accessible names, and announcements. The architectural example of a point described as “three fourths at location three fourths” is appropriate in some states and answer-revealing in others. [04-system-architecture.md, §64](../../../docs/founding/04-system-architecture.md#L1206)

### F4. The roadmap tests breadth before some of its most consequential assumptions

**Severity: Moderate**  
**Confidence: Medium**  
**Evidence type: Verified sequencing; design judgment about risk**

The roadmap sensibly starts with a narrow unlike-denominator addition episode. However:

- Phase 3 generalizes the bar language across proper-fraction operations before the second foundational representation enters. [06-roadmap.md, §§26–32](../../../docs/founding/06-roadmap.md#L586)
- The coherent scaffold policy arrives in Phase 6, after mixed-number work. [§45](../../../docs/founding/06-roadmap.md#L891)
- Deliberate session composition arrives in Phase 7. [§51](../../../docs/founding/06-roadmap.md#L983)

These are reasonable timings for **maturing** those systems. They are late timings for first discovering whether repetition is tolerable, the second representation fits the scene model, or reduced support produces useful independent work.

The documents do include an early learner checkpoint in [§89](../../../docs/founding/06-roadmap.md#L1541), so this is not a finding that learner review is absent.

**Why it matters:** A beautiful individual episode can still make an exhausting practice session. A reusable bar architecture can still prove awkward when asked to preserve unfinished work across a number-line switch.

**Recommended response: Revise the roadmap now, with a small change rather than a reordering of the whole project.**

Have **06-roadmap.md** distinguish:

- **Prototype:** one family, several variants, error recovery, supported and symbolic forms.
- **Useful limited MVP:** a short coherent practice run for a stated learner starting point.
- **Mature core:** the full proper-fraction and mixed-number scope already described.

Before substantial Phase 3 expansion, run a brief repeated-practice trial and a disposable second-representation probe. This does not require polished number-line operations, a complete adaptive engine, or early mixed-number work.

Also state the first slice’s assumed prerequisites. Building the software first around a demanding both-denominator conversion problem is defensible; making that the default starting lesson for every novice is a separate decision.

### F5. Valid mathematics, supported input, and renderable input need one explicit behavioral contract

**Severity: Moderate**  
**Confidence: High**  
**Evidence type: Partially mitigated specification gap**

[05-quality-and-validation.md, §66](../../../docs/founding/05-quality-and-validation.md#L1339) requires subsequent work to follow a valid non-minimal denominator and generally forbids forcing the learner back to the canonical path.

At the same time:

- [03-math-and-content-model.md, §§68–69](../../../docs/founding/03-math-and-content-model.md#L1682) allows representation-specific limits.
- [04-system-architecture.md, §§47–48](../../../docs/founding/04-system-architecture.md#L899) excludes unsupported representation combinations.
- [03-math-and-content-model.md, §59](../../../docs/founding/03-math-and-content-model.md#L1474) permits instructional policy to bound accepted denominators.
- [05-quality-and-validation.md, §7](../../../docs/founding/05-quality-and-validation.md#L254) explicitly permits rejecting arbitrarily large denominators.

Those last two passages substantially mitigate the apparent conflict. **The specifications do not require unlimited denominators.**

The remaining behavioral question is illustrated by:

\[
\frac23+\frac14
=\frac{800}{1200}+\frac{300}{1200}
=\frac{1100}{1200}.
\]

The choice is mathematically valid. A literal bar divided into 1,200 pieces would be unsuitable for the intended interaction.

**Why it matters:** Without a clear distinction, one implementation may say “wrong denominator,” another may silently substitute 12, and another may admit a path that it cannot finish displaying.

**Recommended response: Add a short acceptance contract before implementing denominator entry.**

Let **03-math-and-content-model.md** distinguish mathematical validity from supported input. Let **02-interaction-grammar.md** own the learner-facing response, with architecture supplying capability information.

The contract should establish that:

- a supported non-minimal choice is followed consistently;
- a mathematically valid but unsupported choice is not called mathematically wrong;
- the interface explains the limitation and offers a usable continuation;
- input size is bounded before expensive conversion or rendering;
- changing viewport or access mode does not silently invalidate accepted work.

Exact numeric limits can remain prototype outputs.

## 3. Cross-document conflicts and normalization issues

The ownership map is sensible. The main normalization problem is that some behavior is defined most precisely in a document that is supposed to validate it.

| Issue | Assessment | Canonical correction |
|---|---|---|
| Static-only versus static-first, and no tracking versus optional telemetry | Substantive scope conflict; F1 | Decide in **00**, then align **04**, **06**, the seed and README. |
| Non-minimal denominator continuation | **05 §66** adds a stronger behavioral rule than the broad validity language in **03** | Put continuation behavior in **02**; have **05** test it. |
| Supported construction versus independent prediction | The canonical episode in **02 §75** needs a clearer relationship to the leakage rules in **05 §19** | Clarify the example in **02**, with evidence interpretation owned by **01**. |
| Accessibility qualifications versus release gates | “Where feasible,” “where appropriate,” and “intended access modes” leave different acceptance interpretations | Commitment in **00**, measurable acceptance in **05**. |
| Mixed-number terminology | **03 §5** defines a proper fractional part, while **§21** and **§81** require regrouped forms such as \(2\frac{10}{8}\) | Add a brief distinction in **03** between a normalized mixed number and a regrouped whole-plus-fraction form. |

The mixed-number point is **Low severity**, not a mathematical defect. The equality is correct, the required transient form is explicitly shown, and the document already forbids silently simplifying away intentionally studied forms. A future schema must preserve the regrouped form, but no broken schema currently exists. [Mixed-number definition](../../../docs/founding/03-math-and-content-model.md#L171), [regrouping requirement](../../../docs/founding/03-math-and-content-model.md#L684), [regrouped-form validation](../../../docs/founding/03-math-and-content-model.md#L1523)

One small editorial repair: [05-quality-and-validation.md, §68](../../../docs/founding/05-quality-and-validation.md#L1367) uses

\[
\frac23+\frac14=\frac8{12}+\frac14
\]

in its warning about displayed equality. This equality is true. The surrounding conditional does not make the text mathematically false, but the example is ineffective as a warning against false equality. Show an explicitly invalid example alongside the valid partial-conversion example.

I would **not** undertake a wholesale documentation rewrite before the prototype. Repeated reminders about the stable whole, exact arithmetic, and learner agency often serve useful local purposes. Concentrate normalization on rules whose independent restatement could produce different behavior.

## 4. Assumptions that survived scrutiny

**Common denominators as common units.** This is the right central explanation for adding and subtracting fractional unit counts. The documents also correctly distinguish numerical validity from choosing an efficient denominator.

**Equivalent answers remain correct.** Separating value, current form, and preferred final form is one of the strongest decisions in the set. It supports both honest feedback and preservation of meaningful intermediate work.

**A bar-first engineering slice.** Bars expose subdivision and common units clearly, and the first slice exercises much of the intended architecture. This is defensible as a development strategy. It does not establish that bars should precede number lines in every learner’s instruction.

**One focal mathematical question.** The principles do not actually ban simultaneous representations: [00 §2](../../../docs/founding/00-principles.md#L43) expressly allows deliberate juxtaposition for a defined comparison. That flexibility is valuable. Preserve it.

**Morphing as an option, not an obligation.** [02 §17](../../../docs/founding/02-interaction-grammar.md#L388) permits hard cuts when a transformation would be misleading or unclear. I would retain that escape clause and give static comparison equal standing in prototype trials.

**Authored instruction with generated instances.** For this bounded arithmetic domain, determinism makes mathematical and instructional review much more manageable. Runtime generative explanation adds no necessary capability to the founding goal.

**Conceptual architectural layers.** Nine named responsibilities initially look elaborate, but [04 §4](../../../docs/founding/04-system-architecture.md#L110) explicitly permits combining them physically. I found no basis for demanding nine packages, services, or frameworks. A compact implementation with these ownership boundaries is reasonable.

**Animation independent of mathematical completion.** Known before-and-after state, shared reduced-motion paths, and animation-free transition testing are strong safeguards.

**Fading with optional support.** The documents avoid a simple global level and explicitly treat help requests as useful information rather than failure. Retain those protections.

**Calmness without a reward system.** There is no reason to require points, streaks, or dashboards. However, calmness should still permit an understandable goal, a stopping point, and a brief sense of accomplishment; the session model already allows these.

I also tested two potential mathematical objections that **did not become findings**:

- Regrouping \(3\frac28\) as \(2\frac{10}{8}\) preserves value exactly.
- Simplifying \(\frac24+\frac36\) to \(\frac12+\frac12\) is a valid alternative path. The common-multiple rules need not reject it when applied to the current forms; the documents already recognize reduction and alternate valid paths.

## 5. Missing or underdeveloped concerns

**Resolve before substantial development:**

- The product boundary, accessibility floor, and evidence distinctions in F1–F3.
- The first slice’s learner starting point: what familiarity with equal parts, fraction notation, and multiplication facts is assumed, and what happens when those prerequisites are absent.
- A minimal supported-input policy. This is a behavior decision; it does not require final schemas or numeric thresholds.

**Resolve when the relevant capability is introduced:**

- **Shared-browser progress.** [04 §31](../../../docs/founding/04-system-architecture.md#L614) and [06 §§59–63](../../../docs/founding/06-roadmap.md#L1086) describe continuity without specifying whether the next person at the same browser inherits the previous person’s support settings. A device’s history is not necessarily a learner’s history. Before persistence ships, provide a clear fresh-session/reset policy and decide whether guest use saves anything.
- **Accessibility accommodations versus instructional scaffolds.** Persistent large text, spoken notation, or an alternative input method should not become evidence that a learner lacks fraction understanding. The evidence model should distinguish these from answer-revealing assistance.
- **Reproducibility across revisions.** A seed alone may cease to reproduce a problem after generator or content changes. When replay is implemented, retain version information or a sufficient problem snapshot, not merely a seed.
- **Private observations versus public regression fixtures.** Episode histories may contain actual learner responses. The architecture’s debugging history and the quality document’s durable regression assets should be connected by an explicit synthetic/reconstructed-fixture policy, not automatic publication of real session records.
- **Basic security controls.** During tooling and input implementation, address dependency provenance, safe text rendering, bounded parsing, validation of locally stored data, and minimal deployment permissions. The static architecture reduces the attack surface; it does not make those controls unnecessary. I found no present exploit to report.
- **Licensing and asset provenance.** Check licenses when choosing libraries, fonts, illustrations, or reusable instructional material. Product overlap does not imply permission to reuse another tool’s assets.
- **Low-reading-burden recovery.** Test whether learners can understand help without an adult translating it, especially when the fraction difficulty coexists with reading difficulty. Full localization can remain stretch work.

I would not require a cloud privacy program, formal efficacy study, universal content-authoring system, or comprehensive learner model before the first slice.

## 6. Research findings

The research supports much of the instructional direction. It does **not** settle the proposed visual choreography or the precise fading policy.

| Evidence | What it suggests for FractionFlow | Important limitation |
|---|---|---|
| **Siegler and colleagues, WWC practice guide, 2010** | The guide gives moderate evidence ratings to treating fractions as numbers and helping learners understand why computational procedures work. It recommends number lines as a central representational tool. This supports meaningful magnitude and number-line work. [WWC guide](https://ies.ed.gov/ncee/WWC/PracticeGuide/15/Published) | It does not establish that FractionFlow’s sequence, bar-first development order, or morphing interface is optimal. |
| **Fuchs et al., 2013, randomized intervention with 259 at-risk fourth graders** | A 12-week intervention emphasizing measurement interpretations improved conceptual and procedural fraction outcomes. This strengthens the case for magnitude and measurement reasoning alongside part-whole models. [Primary paper](https://files.eric.ed.gov/fulltext/ED552737.pdf) | This was a multicomponent, tutor-supported intervention. Its results cannot be attributed to a single representation or transferred directly to independent browser practice. |
| **Rau, Aleven and Rummel, 2014, fractions tutor study with 230 fourth- and fifth-grade students** | Interleaved graphical representations outperformed blocked schedules on several measures. Accompanying think-aloud work found connections between representations when explicitly prompted. This challenges treating long stable runs as inherently superior and supports explicit correspondence tasks. [Research record and abstract](https://www.research-collection.ethz.ch/items/e3ece448-3094-43d3-aeb4-b3617a1a192c) | It studied representation schedules across problems, not simultaneous versus sequential displays inside a single morph. It does not justify constant switching or a particular bridge frequency. |
| **van de Pol, Volman and Beishuizen, 2010, scaffolding review** | Scaffolding involves responsiveness to performance, fading, and transfer of responsibility. Merely removing a picture is insufficient. This supports the documents’ contingent, skill-specific approach. [Review](https://doi.org/10.1007/s10648-010-9127-6) | Much of the evidence concerns teacher–student interaction. It supplies no validated FractionFlow mastery threshold or automatic fading algorithm. |
| **W3C WCAG 2.2 and supporting guidance** | Accessibility needs testable criteria beyond useful labels: keyboard operation, non-drag pointer alternatives, focus, reflow, semantics, and other applicable requirements. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Technical conformance does not prove that an accessible alternative elicits the same mathematical reasoning. That requires instructional review. |

The important unresolved research question is **whether the anchored transformation improves learning enough to justify its cost compared with a prompted static comparison**. Neither the evidence examined nor the specifications establish that superiority.

Likewise, “introduce, stabilize, then interleave” is a plausible starting policy, not a research-established universal sequence. Difficulty during practice and durable learning are not interchangeable outcomes.

## 7. Existing-product comparison

**I did not establish a full duplicate of FractionFlow’s intended combination.** I did find substantial overlap with its manipulatives and equivalence demonstrations.

This comparison is based on official product material, not hands-on runtime or accessibility testing.

| Product | Established overlap | What remains distinctive or unverified |
|---|---|---|
| **Polypad** | Its fraction guidance explicitly covers equivalent fractions and unlike-denominator operations. The Rename action produces equivalent fractions and is recommended for explaining common denominators. [Working with Fractions](https://polypad.amplify.com/lesson/fraction) | The reviewed material did not establish the complete integrated progression from guided conversion through contingent support fading to independent symbolic work and number-line transfer. This is the closest functional comparison. |
| **Math Learning Center Fractions and Number Line apps** | Fractions provides bar/circle models, labels, comparison, and operations. Number Line supports fraction intervals, jumps, and equivalence/comparison work. [Fractions overview](https://apps.mathlearningcenter.org/fractions/info/info-about.html), [Number Line](https://www.mathlearningcenter.org/apps/number-line) | The reviewed sources describe separate tools rather than FractionFlow’s proposed authored progression across them. |
| **PhET Fractions: Equality** | Official material identifies equivalent fractions, improper fractions, and number-line content. [Simulation page](https://phet.colorado.edu/en/simulations/fractions-equality) | The inspected material did not establish the unlike-denominator arithmetic and fading workflow. Those capabilities were not runtime tested. |

FractionFlow therefore needs to earn its value through **the quality of the guided practice and the learner’s eventual independence**. Rendering fraction bars or animating equivalent fractions is already well covered.

Building it remains justified as a testable instructional proposition. A strong early comparison would ask whether learners can recover from confusion and then solve a fresh problem independently with less adult orchestration than an existing manipulative activity requires.

## 8. Pre-development revision recommendations

I would keep the owner revision pass selective:

1. **Resolve the product boundary.**  
   **Owner: 00-principles.md.** Align **04**, **06**, the seed and README. Distinguish standing constraints from hypothetical future scope changes.

2. **Define the accessibility acceptance floor.**  
   **Owner: 05-quality-and-validation.md**, with the commitment in **00**. Make the first complete accessible episode a feasibility test, not a late labeling task.

3. **Clarify what the canonical responses demonstrate.**  
   **Owner: 02-interaction-grammar.md**, with evidence interpretation in **01**. Separate supported counting, prediction, and independent transfer; make disclosure consistent across visual and nonvisual presentation.

4. **Add a minimal valid-versus-supported-input contract.**  
   **Owner: 03-math-and-content-model.md**, with learner-facing behavior in **02**. Specify the treatment of valid but unsupported denominators without selecting every numeric limit now.

5. **Separate prototype, limited MVP, and mature core.**  
   **Owner: 06-roadmap.md.** Preserve the narrow first family, but test a short practice run and a small second-representation path before extensive generalization.

The mixed-number terminology and equality example can be corrected in that pass as small clarifications. They do not justify delaying the project for a larger specification exercise.

## 9. Questions best answered by prototyping rather than specification

| Hypothesis | A useful prototype test | Evidence that would challenge the design |
|---|---|---|
| Subdivision communicates equivalence rather than just piece counting | Follow a supported example with a fresh numerator prediction before subdivision and a quantity-invariance question | The learner succeeds only when the new pieces can be counted, or believes the quantity grew |
| The anchored bridge supports transfer | Compare a prompted morph with a prompted static comparison, then ask for placement on a fresh line without the inherited endpoint cue | Correct performance disappears when the spatial cue is removed |
| The narrative remains tolerable through repetition | Observe a short run containing supported, reduced-support, error-recovery, and symbolic episodes | Learners predict the interface sequence, click through prompts, or spend more time waiting than reasoning |
| Fading preserves understanding | Offer comparable work with less support, keep help available, and revisit the skill after intervening items | Immediate success does not survive a fresh form or a short delay |
| Accessible alternatives preserve agency | Complete the same episode using screen reader, keyboard, and non-drag touch interactions; inspect what information each exposes | An access mode reveals the answer or substitutes copying for the intended reasoning |
| One-focus presentation reduces burden | Compare sequential disclosure with a restrained side-by-side comparison where both show the same mathematical relationship | Learners repeatedly need to recover a previous state or cannot remember what changed |
| The constrained generator offers meaningful variety | Inspect a complete practice run, including correct answers and plausible wrong choices | Learners exploit a repeated answer position, always choose the denominator product, or infer the operation from superficial patterns |
| The interface is usable on school devices | Test the actual target Chromebook class, a narrow layout, zoom, and the on-screen keyboard | Labels collide, fractional targets demand precision, or input becomes obscured |

These trials should include at least one learner who already knows a brittle procedure and one who needs more conceptual support. A result that works for one starting point should not automatically become the default for both.

The first cycle need not demonstrate long-term efficacy. It should reveal whether the proposed interaction deserves further investment and identify what kind of success is actually being observed.

## 10. Bottom line

**Preserve** the common-unit explanation, exact arithmetic, value/form distinction, authored instruction, calm presentation, local recovery, valid alternative methods, and optional support.

**Change now** the inconsistent scope boundary, qualified accessibility gate, and ambiguous evidence in the canonical examples. Add a small contract for supported inputs and a clearer distinction between an exploratory slice, a useful limited product, and the mature core.

**Leave unresolved for prototyping** the preferred transition style, simultaneous versus sequential comparison, prompt density, bridge frequency, visual denominator limits, and fading thresholds.

I found **no verified critical mathematical defect** in the founding set. The project’s main risk is building a polished and internally consistent experience that produces convincing supported performance without enough evidence of independent fraction reasoning. The next stage should be designed to expose that possibility early, while the interaction is still small enough to change.