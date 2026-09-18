I'll start by reading the task prompt file.

I have the review brief. Let me launch targeted research in the background while I read the founding set.

Now let me check the surrounding repo context and run the publication/PII check.

I have everything I need. Here is the review.

---

# FractionFlow Founding Documents — Independent Adversarial Review

*Advisory only. No repository files were modified.*

---

## 1. Overall assessment

This is an unusually thoughtful founding set. The instructional core is right in the ways that matter most: fractions as numbers, the denominator as a unit size, equivalence as renaming rather than a symbolic trick, common denominators as common units, LCD as an efficiency rather than a requirement, regrouping as decomposition of a whole rather than borrowing, and correct-but-unsimplified as correct. Those are not fashionable positions — they are the positions the standards writers and the fraction-learning literature actually hold, and the documents arrive at them with reasons rather than by imitation. The architectural spine (`mathematical state → instructional state → presentation`, exact arithmetic, deterministic generation, no runtime LLM in the math loop) is the correct spine for this product and is stated crisply enough to test. The anti-pattern lists in `02` §74 and `03` §79 are among the most valuable pages in the set, because they are falsifiable.

What is most fragile is the **distinctive mechanism**, not the goals. The set bets its instructional identity on *animated transformation* — `00` §3 and §7, the "Transform" beat that `02` §6 calls "one of FractionFlow's defining interaction patterns," the bar→number-line morph in `02` §76. That bet is the least evidence-supported and the most expensive commitment in the entire specification. The animation meta-analyses put the effect at g ≈ 0.22–0.37 and concentrate it in *kinematic* learning goals, not conceptual/structural ones like ratio invariance; morph-vs-side-by-side has never been tested for fractions in this age band. Meanwhile the other thing the documents already do — **ask the learner to predict before revealing** — has one of the strongest effect sizes in this whole literature (POE meta-analysis g ≈ 0.98), and adding animation to it produced no measurable increment. The project has the right idea and has attached it to the wrong load-bearing wall.

The second fragility is that several rules are stated as settled principles when the underlying question is genuinely open or, in one case, is contradicted by a sibling document. "Multiple representations does not mean simultaneous representations" (`00` §2) cannot survive contact with `02` §19 and `04` §22, which require symbolic notation to be co-present and treat it as a representation. "Valid common denominator" is defined on written denominators rather than values (`03` §10/§59), which is mathematically wrong in general and is already encoded as a test invariant in `05` §4. And the founding set promises both authored deterministic narrative *and* first-class support for learner-chosen alternate paths without ever specifying what the authored narrative does when the learner leaves the canonical path.

The third fragility is scope shape, not scope size. The roadmap defines no publishable artifact short of the complete nine-phase core, while simultaneously requiring learner evidence from Phase 2 onward — and the seed brief's GitHub Pages deploy spike has no home in it at all. A free project with this much specification and no shipping milestone until everything is done is the failure mode I would worry about most.

**Do the documents provide a credible foundation for development? Yes.** The mathematics is sound (I checked every worked example; all are correct), the ownership boundaries are real, and the architecture is implementable. This is a stronger starting position than most projects ever reach.

**The most important single change before implementation:** demote animated transformation from defining mechanism to optional enhancement, and promote *prediction plus a persistent static before/after comparison* to the canonical design. This is the one change that is evidence-backed, reduces cost rather than adding it, and simultaneously dissolves four of the hardest feasibility problems in the set (responsive morphing, anchor preservation across layouts, reduced-motion equivalence, and screen-reader narration of motion). It also inverts the accessibility story in a healthy direction: the reduced-motion path stops being a degraded fallback and becomes the reference design.

---

## 2. Highest-priority findings

---

### Finding 1 — Animation is asked to carry the instructional load, but the evidence backs the prediction step, not the motion

**Severity:** High · **Confidence:** High

**Evidence — internal:** `00-principles.md` §3 ("Preserve the Mathematical Object Across Representations") and §7 ("Animation Must Carry Mathematical Meaning"); `02-interaction-grammar.md` §6 ("The Transform beat is one of FractionFlow's defining interaction patterns"), §17 ("Prefer Transformation Over Replacement"), §36, §38; `04-system-architecture.md` §43; `06-roadmap.md` §23, §34, §43. `00` §15 and `02` §29 already specify prediction-before-demonstration, but subordinate it to the animation ("ask the learner to make a prediction; *then* animate the mathematical consequence").

**Evidence — external:**
- Berney & Bétrancourt (2016), *Computers & Education* 101, 150–167: 140 comparisons, N = 7,036, pooled **g = 0.226** (95% CI 0.12–0.33), I² = 78%. Moderator: iconic/schematic animations outperform animations of *abstract* representations (analytic diagrams, formal notation) — a direct caution for animated symbolic fraction notation.
- Höffler & Leutner (2007), *Learning and Instruction* 17(6), 722–738: **d = 0.37**. Castro-Alonso, Ayres & Sweller (2019), *Educ. Psych. Review*: **g = 0.23**.
- Ploetzner, Berney & Bétrancourt (2020), *JCAL* 36, 838–860: animation's advantage is concentrated in building **kinematic** models (how something moves over time), not **conceptual** models. Fraction equivalence is a structural/conceptual claim about invariance under repartitioning — the category where animation's edge is weakest.
- Transient information effect (Sweller, Ayres & Kalyuga; Leahy & Sweller, *Learning and Instruction* 2012): animation loses and can reverse its advantage as sequence complexity grows, because the "before" state must be held in working memory while the "after" state arrives — which is precisely the comparison the equivalence animation exists to support.
- Tversky, Morrison & Bétrancourt (2002), *IJHCS* 57(4), 247–262 (apprehension principle) has largely held up: many apparent animation benefits were confounded with co-occurring interactivity or added content.
- Predict-Observe-Explain meta-analysis (Koyunlu Ünlü, 2024; 35 studies, N = 2,840): **g = 0.979**. Critically, implementation type (POE with vs. without technology/animation support) was **not** a significant moderator — animation added no reliable increment to prediction.
- The one directly age-matched fraction study (Hansen, Mavrikis, Holmes & Geraniou, 2015, iTalk2Learn *Fractions Lab*, 67 students aged 9–11) points to **learner-driven partitioning with live symbolic feedback** — direct manipulation, not watched animation — as what carries the understanding. Qualitative, no control condition.
- *Limitation:* nearly all strong quantitative evidence is from science education, not mathematics; there is **no** controlled comparison of animated subdivision vs. a static before/after pair for fraction equivalence. The transfer argument (Ploetzner et al.) predicts a *weaker* effect here than the pooled estimates, not a stronger one.

**Why it matters:** The documents have staked the project's distinctiveness on the most expensive and least-supported element, and made the cheapest, best-supported element (prediction) a decoration on top of it. Every hard feasibility problem in the set descends from this choice: responsive morphing, anchor preservation across layouts, reduced-motion parity, symbolic labels tracking moving objects, and screen-reader narration of transitions. If the motion is not the active ingredient, the project is paying its highest engineering and QA cost for its smallest instructional return — and paying it first, in Phase 2.

**Recommended response:** **Revise a founding document now.** `00-principles.md` §7 should own this. Restate the canonical pattern as: *predict → reveal the resulting state → leave both states inspectable side by side*, with animated transition as an optional, skippable, learner-triggered enhancement that must end in that same persistent residue. `02` §17 and §36 follow; `02` §37 ("Learners Should Be Able to Inspect the Result") is already correct and should be promoted from a supporting rule to the primary one. This does not weaken the founding vision — `00` §15, `01` §17, and `02` §29 already contain the evidence-backed half of it.

---

### Finding 2 — Multiple representations only help when connection-making is explicitly prompted, and the founding set systematically minimizes exactly that

**Severity:** High · **Confidence:** High

**Evidence — internal:** `01-instructional-model.md` §18 ("Explanation Without Excessive Verbal Burden" — "the system should not turn fraction practice into a reading- or writing-heavy exercise," proposing non-verbal action as evidence instead); `02` §9 ("Reflection should not occur after every problem"), §32–33 (bridge episodes, "relatively infrequent"); `05` §59 ("Reflection Frequency Should Be Reviewed" — detect "repeated conceptual questions"). `00` §10 asks for representation transfer but frames it as "deliberate and occasional."

**Evidence — external:**
- Rau, Aleven & Rummel (2015), *Journal of Educational Psychology* 107(1), 30–46 — two classroom experiments, n = 112 sixth-graders and n = 152 fourth/fifth-graders, Fractions Tutor: multiple graphical representations outperformed a single representation **only when students were prompted to self-explain how the graphics mapped to numerator/denominator and to the symbolic procedure.** Unprompted co-exposure did not reliably beat a single representation.
- Rau, Aleven & Rummel (2017), *Instructional Science* 45(3), 331–357 (n = 74, grades 3–5): **sense-making-first beat fluency-first.** Building perceptual fluency through repeated exposure did *not* produce sense-making; explicit connection-making did enhance later fluency.
- Ainsworth (1999), *Computers & Education* 33(2): appreciating links across representations "is not automatic"; translation between representations is "complex and cognitively demanding."
- Rittle-Johnson, Loehr & Durkin (2017), *ZDM* 49(4): independent meta-analysis, small-to-moderate effects of prompted self-explanation on conceptual knowledge and transfer.
- *Limitation:* these findings come from one research program using an intelligent tutoring system; transfer to a different UI paradigm is plausible but unverified.

**Why it matters:** This is the best-evidenced, most directly on-point body of research for this exact product (same domain, same grade band, same design question), and it says the active ingredient in linked representations is the prompted explanation — the thing `01` §18 and `02` §9 are most careful to ration. The project could build every representation and every bridge correctly and still get the null result, because it withheld the mechanism.

The tension is resolvable without abandoning `01` §18's legitimate concern about reading burden: **structured/menu-selected self-explanation** ("The bar and the number line show the same amount because: [the shaded length is the same] / [the endpoint is at the same place] / [both have 12 pieces]") delivers the connection-making demand with near-zero reading load, and produces a machine-checkable response rather than prose.

**Recommended response:** **Revise a founding document now.** `01-instructional-model.md` §18 should own the revision: distinguish *verbal burden* (to be minimized) from *connection-making demand* (to be required at representation bridges). `02` §33 should then require every bridge episode to carry one structured connection-making prompt rather than a concise orienting cue. This is not optional polish; on current evidence it is the difference between bridges that work and bridges that are decorative — a risk `05` §58 already anticipates without naming the fix.

---

### Finding 3 — "Multiple representations does not mean simultaneous representations" contradicts the required co-presence of symbolic notation

**Severity:** High · **Confidence:** High

**Evidence — internal:** `00-principles.md` §2 states flatly, in bold: **"Multiple representations does not mean simultaneous representations."** The example list that precedes it explicitly names "an equation" among the things that must not compete. But:
- `02-interaction-grammar.md` §19: "Symbolic notation should not live in a separate answer panel disconnected from the visualization… symbols should remain spatially or conceptually associated with what they describe."
- `02` §44 (Symbolic Compression): the visual "becomes quieter" while "symbolic notation carries more of the final state" — both present, one receding.
- `02` §75 (canonical episode): the expression `2/3 + 1/4` and a fraction bar are on screen together throughout.
- `04-system-architecture.md` §22 closes the obvious escape hatch: "Symbolic Representation Is a Renderer Too… Symbols are one representation of the underlying mathematics."
- `06` §18: "The experience should not feel like: manipulate the picture, then separately fill in the worksheet."

**Why it matters:** `05` §78 makes founding-document conformance a design-review gate and instructs reviewers to reject features that violate principles including "one focal idea at a time." A reviewer applying `00` §2 literally must reject the canonical episode in `02` §75. Two reviewers reading the same two documents will reach opposite verdicts on the project's single most common screen. This is the kind of contradiction that gets resolved ad hoc in code and then hardens.

The intended rule is almost certainly "at most one *spatial/visual* model at a time" — but no document says so, and `04` §22 actively forbids that reading.

**Recommended response:** **Revise a founding document now.** `00-principles.md` §2 owns it. Restate as: *at most one spatial/visual model is focal at a time; symbolic notation is a persistent co-representation that is spatially integrated with the focal model and whose prominence varies inversely with visual support.* That version is also better supported — Schroeder & Cenkci (2018), *Educ. Psych. Review* 30, 679–701 (58 comparisons, n = 2,426, **g = 0.63**) finds integrated beats separated presentation for elements that must be read together, which is exactly the symbol-on-diagram case, and is *not* the same as the two-full-diagrams case the principle is really trying to prevent.

---

### Finding 4 — "Valid common denominator" is defined on written forms rather than values, is mathematically wrong in general, and is already encoded as a test invariant

**Severity:** High · **Confidence:** High

**Evidence — internal:**
- `03-math-and-content-model.md` §10: "a common denominator is any positive integer divisible by both \(b\) and \(d\)."
- `03` §59 (Common-Denominator Validation): "A proposed common denominator \(D\)… is valid when \(b \mid D\) and \(d \mid D\)."
- `03` §11: "The least common denominator corresponds to \(\operatorname{lcm}(b,d)\)."
- `05-quality-and-validation.md` §4 encodes both as invariants: "If \(D\) is accepted as a common denominator for \(b\) and \(d\), then \(b \mid D\) and \(d \mid D\)" and "No positive common denominator may be smaller than the accepted least common denominator."

**Counterexample:** For \(\tfrac36 + \tfrac14\), the rule requires \(D\) divisible by 6 and 4, i.e. \(D \in \{12, 24, \dots\}\), and sets LCD = 12. But \(\tfrac36 = \tfrac24\), so \(D = 4\) is a perfectly valid common denominator: \(\tfrac24 + \tfrac14 = \tfrac34\). The specification classifies a correct answer as invalid and reports a "least" common denominator that is not least. The correct condition is on the *reduced* denominators \(b', d'\): \(D\) is valid iff \(b' \mid D\) and \(d' \mid D\).

**Internal inconsistency:** `03` §60 defines equivalence correctly and by *value* (\(x/y \equiv n/d\) iff \(xd = ny\)). So the document validates equivalence on values and denominators on forms. The same form-dependence infects family classification: \(\tfrac36 + \tfrac14\) is "shared-factor, non-nested" by written denominators (`03` §12) and "nested" by value.

**Conflict with the instructional model:** `01` §32 explicitly lists "simplifying before or after an operation where appropriate" as a **valid alternative method**, and `03` §56 says the system "must never mark mathematically valid equivalence as incorrect." The §59 rule does exactly that for a learner who simplifies first.

**Why it matters:** By the project's own severity model (`05` §97), "correct answer systematically rejected" is **Critical**. The defect is currently masked by the generation convention in `03` §52 (operands ordinarily start in simplest form) — but §52 itself says unsimplified operands "may later be introduced deliberately," curated cases (`03` §66) are not covered by §52 at all, and `05` §4 would lock the wrong rule into the test suite, where it becomes very expensive to dislodge.

**Recommended response:** **Revise a founding document now.** `03-math-and-content-model.md` owns it. State once, prominently, that **all validity, classification, and LCD computation operate on reduced operand values, not written forms**, and correct §10, §11, §12, and §59 accordingly. `05` §4's two invariants must be restated in the same terms. This is a one-paragraph fix that prevents a class of latent defects.

---

### Finding 5 — A learner's valid common denominator can exceed what the active representation can render, and no document resolves the conflict

**Severity:** High · **Confidence:** High

**Evidence — internal, two rules that cannot both hold:**
- *Must accept:* `03` §56 — "The content model must never mark mathematically valid equivalence as incorrect solely because it differs from the canonical path." `05` §66 — "the system should accept the mathematics; subsequent equivalence and arithmetic should follow that denominator correctly… The interface should not force the learner back to the canonical path."
- *Must not render:* `03` §68 (visual feasibility as a content constraint, "maximum visual subdivision count"); `04` §48 — "Unsupported combinations should be excluded before rendering. Do not rely on presentation components failing gracefully"; `05` §46 — "It is better to reject an unsuitable pairing than to render an unreadable fraction model."

Both fire in the **first vertical slice**. `06` §19 makes "choosing a common denominator" a Phase 2 learner responsibility; `06` §20 enumerates the error cases Phase 2 must handle and "valid but unrenderable" is not among them.

**Concretely:** CCSS-M 5.NF.A.1's own worked general method is \(\tfrac ab + \tfrac cd = \tfrac{ad+bc}{bd}\) — the *product* of the denominators. A learner taught that method will offer 48 for the golden case \(\tfrac56 - \tfrac38\) (`05` §49). A fraction bar partitioned into 48 parts at 375 px is roughly 8 px per part. The system must either render something illegible, silently override a correct answer, or switch representations unannounced — each violating a different founding rule.

**Why it matters:** This is not an edge case; it is the modal behaviour of a procedurally-fluent learner following the standard method, colliding with the project's own golden test case, in its first shipped interaction.

**Recommended response:** **Revise a founding document now**, then **test during the first vertical slice.** `02-interaction-grammar.md` should own the resolution, with a supporting constraint in `03`. Pick one policy explicitly: (a) when a visual model is active, constrain the *offered* denominator set and exercise full alternate-path acceptance only in symbolic mode — stating that limitation openly; (b) accept any valid \(D\), keep the visual at a renderable denominator, and carry the learner's larger unit symbolically; or (c) accept and compress to symbolic with an explicit cue. Any of these is defensible. Silence is not.

---

### Finding 6 — Authored deterministic narrative and learner-chosen alternate paths are both promised; off-canonical-path behaviour is unspecified

**Severity:** High · **Confidence:** High

**Evidence — internal:** `02` §65 ("Deterministic Narrative, Variable Instances" — "It should not improvise new pedagogical narratives at runtime"); `04` §34 (authored content as durable assets: prompt families, hint layers, misconception-targeted feedback); `03` §55 — a canonical instructional path provides "a stable sequence for authored explanations." Against this: `03` §56 and `05` §66 require first-class support for a learner-chosen non-canonical denominator, and `01` §32 blesses improper-fraction vs. component methods for mixed numbers as equally valid.

**Why it matters:** Authored hint layers, prompts, and misconception feedback are keyed to the canonical path ("we chose twelfths…"). The moment a learner chooses 24, the authored content is either wrong, generic, or absent — and the documents forbid generating a replacement at runtime. The likely outcome in implementation is quiet path-forcing, which is precisely the `03` §79 anti-pattern "canonical-path absolutism" the set warns against. The cost also compounds: authored content must now be written per *family × beat × scaffold level × path*, and `05` §36 requires equivalence review across prompt variants. No phase in `06` budgets content authoring as a workstream at all.

**Recommended response:** **Revise a founding document now.** `02-interaction-grammar.md` owns it. Specify how authored content parameterises over the learner's actual path: authored prompts should reference the *learner-established* denominator symbolically rather than naming a canonical one, and the set should state which beats have path-independent authored content and which are canonical-only (and therefore unavailable off-path, with an explicit degraded behaviour). Related: `06` should name content authoring and review as a first-class Phase 3 activity with a bounded initial prompt inventory.

---

### Finding 7 — The roadmap defines no publishable product short of the complete core, while requiring learner evidence long before it

**Severity:** High · **Confidence:** High

**Evidence — internal:** `06` §2 defines the core as the full domain; §71 sets the first substantial release at Phase 9 after all nine phases; §72 treats public availability as beginning there. Yet `05` §52 requires testing with actual members of the target age range "before being considered mature," and `06` §89 (Decision Checkpoint after the first slice) asks "Did learners understand the visual transformation?" — a question that cannot be answered without learner access.

**Conflict with the seed brief:** `docs/project-seed.md` lists three seed packets — math core spike, first learning episode spike, and a **GitHub Pages deploy spike** ("The deployment mechanism… is decided and proven by this spike"). The roadmap has phases matching the first two and **no deployment phase at all**; static deployment appears only as a Phase 9 integration-review item (`06` §65). The seed brief also states that the folder structure "is ratified by the first spike rather than decided upfront *because the build and deployment mechanism constrains where source, build output, and Pages-publishable content must sit*" — so deferring deployment to Phase 9 defers a decision the seed brief says blocks the repository layout.

**Why it matters:** For a free project, the gap between "specification complete" and "anything exists that a child can use" is the single largest risk to the project's survival. The roadmap as written makes that gap nine phases long. It also leaves the project unable to satisfy its own evidence requirements, and postpones the deployment decision past the point where it constrains structure.

**Recommended response:** **Revise a founding document now.** `06-roadmap.md` owns it. (a) Move the deploy spike into Phase 1 or Phase 2 — it is a day of work and it unblocks both learner testing and the folder-structure ratification. (b) Define an explicit **useful MVP** at the end of Phase 3: bar-based proper-fraction addition and subtraction across all four denominator relationships, with fading and local error recovery, publicly deployed. That is already a genuinely useful free tool and nothing comparable exists (see §7 below). Reserve "core release" for Phase 9 as currently defined. Note in `docs/project-seed.md` that its three seed packets map to Phases 1–2 plus deployment.

---

### Finding 8 — Fraction magnitude is a stated prerequisite that the roadmap never schedules, and the number line is deferred past the point the evidence supports

**Severity:** High · **Confidence:** Medium-High

**Evidence — internal:** `01` §19 Stage A ("Fractional units and magnitude") is the foundation of the entire progression, and `01` §4 requires magnitude reasoning to be "integrated periodically into operational practice." `06` §3 lists "Fractional units — why denominators identify different unit sizes" as a core instructional goal. But `06` §66 (Core Content Coverage) omits it entirely, and no phase schedules Stage A content. Magnitude first appears at **Phase 4** (`06` §33), after the entire proper-fraction operation domain has been built. The roadmap's first learner-facing content (`06` §7) is Stage **E** — the hardest of the early stages.

**Evidence — external:**
- IES Practice Guide, *Developing Effective Fractions Instruction for K–8* (Siegler et al., 2010, NCEE 2010-4039): number lines are a **central, cross-cutting** recommendation (Rec. 2, moderate evidence), used from early on rather than as a later representation that area models build toward.
- Siegler, Thompson & Schneider (2011), *Cognitive Psychology* 62, 273–296: magnitude representation is the organising construct for numerical development, whole numbers and fractions alike.
- Hamdan & Gunderson (2017), *Developmental Psychology* 53(3), 587–596: RCT with 2nd–3rd graders; **number-line training produced significantly larger gains on symbolic fraction comparison than circular area-model training.** Gunderson et al. (2019), *JECP*: **unidimensionality** is the active ingredient.
- Fuchs et al. (2017), *Journal of Learning Disabilities* 50(6), 631–639: five RCTs with at-risk learners built on the *measurement* interpretation.

**Calibration — what this does and does not say:** It does **not** show bars are inferior. A fraction bar is a *unidimensional length* model, so Gunderson's unidimensionality result arguably supports it; the losing condition in Hamdan & Gunderson was a **circle**. "Bars before number lines" survives as a representational choice. What is **not** supported is deferring magnitude and the number line until after all bar-based operation work is complete, when the project's own model calls magnitude a Stage A prerequisite and the target learner is precisely the one with weak magnitude sense.

**Why it matters:** The product's stated primary target (`01` §1) is the learner who can imitate "multiply top and bottom" but does not understand what the denominator describes. That learner's deficit is Stage A. The roadmap builds Stage E first and Stage A never.

**Recommended response:** **Revise a founding document now.** (a) `06` §66 must include fractional-unit and magnitude content; schedule Stage A/B focused episodes in Phase 3 alongside the operation work already there (`06` §28 nearly does this). (b) Move basic number-line magnitude work into Phase 3 and treat Phase 4 as bridges and number-line *operations*, not first contact. (c) **A representational refinement worth making explicitly** (`01` §14.1 owns it, `02` §18 follows): specify the fraction bar as a **length/measure model anchored at 0**, with shading always accumulating from the left origin — not as a "shade k of n boxes" part-whole model. This is nearly free, is what the unidimensionality evidence favours, and makes the bar→number-line bridge an axis relabel rather than a bespoke morph, which also mitigates Finding 11.

---

### Finding 9 — Several likely false-success modes are unguarded, and one generation rule actively removes the items that would detect them

**Severity:** High · **Confidence:** Medium-High

**Evidence — internal:**
1. **Guessable constrained choices.** `02` §39 and §51 use small constrained choices ("Could 6, 8, or 12 work for both?") as a core scaffold. `01` §28 bases fading on "repeated correct predictions" and `01` §17 endorses larger/smaller/same predictions — base rates of 33–50%. No document defines a minimum evidence threshold that accounts for guessing, and no document specifies **first-attempt-only** scoring, while `02` §25/§26 explicitly support retry with prior work preserved. A learner can reach "Fluent" (`01` §26) by elimination.
2. **The generator excludes the discriminating instances.** `03` §51 ("Generation Should Also Avoid Trivial Degeneracy") instructs the generator to reject "equivalent fractions already written with matching denominators in an unlike-denominator family," among other no-op cases. But these no-op instances are exactly what distinguishes a learner who *checks whether renaming is needed* from one who has learned the choreography. `00` §8 and `02` §65 make the interaction deliberately repetitive and authored; `02` §74 lists "Prompt fragmentation" and "Tutorial lock-in" as anti-patterns but not *script-following*. `01` §34 gestures at transfer but proposes no mechanism.
3. **No distractor rationale.** `05` §19 (scaffold leakage) and `05` §36 (prompt variant equivalence) are thorough, but nothing requires the options in a constrained choice to map to documented misconceptions — even though `01` §22 already contains the misconception list that would supply them.

**Why it matters:** These three combine into the specific false-success mode this product is most exposed to: a learner who reliably executes the beat sequence, guesses well among three plausible denominators, is never shown an item where the expected next beat does not apply, and is faded into symbolic-only work on that evidence. The system would report success.

**Recommended response:** **Revise a founding document now** (cheap, three sentences), then **test during the first vertical slice.**
- `01-instructional-model.md` §28 owns the evidence rule: fading evidence is **first-attempt only**, and constrained-choice evidence requires a threshold that accounts for the guess rate.
- `03-math-and-content-model.md` should add a **"check-the-premise" problem family** whose correct response is *no renaming needed / already simplest / no regrouping needed*, and require its presence in mixed practice — currently §51 forbids exactly these as accidental degeneracy, so the rule needs to distinguish *accidental* from *deliberate* no-op instances.
- `02` §39 should require every constrained-choice option set to have a documented distractor rationale keyed to `01` §22.

**One bonus, mechanizable:** `05` §19 names scaffold leakage as a defect class but proposes no detection method, leaving the most important review criterion in the set unfalsifiable. Because `04` §64 requires scene state to carry semantic content, leakage becomes an automatable invariant: *at beat N, the serialized scene and prompt must not contain the value the learner is being asked to produce.* I would put that sentence in `05` §19 — it converts an aspiration into a test.

---

### Finding 10 — The scaffold configuration space is unbounded, required to be independently reviewable, and canonically defined in three places that disagree

**Severity:** Moderate-High · **Confidence:** High

**Evidence — internal:** Three normative-flavoured lists of scaffold dimensions, none identical:
- `00-principles.md` §6 — 8 dimensions.
- `02-interaction-grammar.md` §21 — 12 dimensions (adds scale-factor supply/request, estimation prompts, intermediate symbolic forms, automatic simplification prompt).
- `06-roadmap.md` §46 — 9 dimensions ("the project should now formalize independent support dimensions such as…"), dropping intermediate symbolic forms, renaming estimation to "magnitude check."

`00` §26 assigns "how support changes during an episode" to the Interaction Grammar, so `06` §46 is defining something it does not own. Meanwhile `02` §21 insists scaffolding "should not be implemented as a single linear setting," `05` §22 requires "each scaffold dimension should be independently reviewable," and `05` §87–88 add per-scaffold and per-fading acceptance criteria.

**Why it matters:** Twelve largely independent dimensions is on the order of 10³–10⁴ reachable configurations, each crossed with ~6 episode beats, 3 representations, ~9 error classes, reduced motion, keyboard, touch, and responsive breakpoints. `05` §22's independence requirement makes that the review unit. For a free project this is not a large QA surface; it is an unbounded one. Three divergent canonical lists is the early symptom.

**Recommended response:** **Revise a founding document now.** `02-interaction-grammar.md` §21 becomes the single canonical list; `00` §6 and `06` §46 reference it rather than restating. Then add the missing constraint: the independent dimensions are the *internal representation*, but only a small **enumerated set of named scaffold profiles** is reachable and is the unit of validation. `02` §22 already sketches four (High / Medium / Low / Independent) — promote that to the normative structure, and let `05` §22's independence requirement apply to *transitions between profiles* rather than to the full cross-product. This preserves the multidimensional model `01` §28 rightly insists on while making it testable.

---

### Finding 11 — Mid-episode representation switching is mandated for validation, but the number-line scene for a two-operand operation is never defined

**Severity:** Moderate-High · **Confidence:** High

**Evidence — internal:** `05` §70 requires testing representation switching "before any work; after common denominator selection; after one conversion; after both conversions; after resolution" — i.e., at every stage of a two-operand addition episode. `02` §15 requires the switch to preserve quantities, completed reasoning, and learner decisions. `06` §35 makes this a Phase 4 exit requirement.

But no document defines what the number-line rendering of a partially-solved \( \tfrac23 + \tfrac14 \) *is*. On a bar model these are two quantities each relative to its own whole; the canonical bridge in `02` §76 morphs exactly **one** quantity. On a number line, addition is sequential displacement from a single origin (`06` §33: "Movement forward by a fractional quantity") — a different geometry, with a different anchor, and no one-to-one correspondence with two side-by-side unit bars. Mixed numbers make it worse: several whole-bars versus one continuous axis (`06` §39 wants both).

**Why it matters:** A validation requirement exists for a behaviour whose specification does not. This is a foundational gap by the review's own test (`§11` of the brief): the project does not yet know what it wants the screen to show, not merely how to build it.

**Recommended response:** **Revise a founding document now**, then **test during the first vertical slice.** `02-interaction-grammar.md` owns it: define, per representation, the canonical scene for a two-operand operation, and state which episode states have a defined cross-representation correspondence. `05` §70 should then test switching only at those states. Note that Finding 8's recommendation — a bar anchored at 0 as a length model — makes the single-quantity correspondence trivial and narrows this problem to the two-operand case specifically.

---

### Finding 12 — Child usability testing is mandated, validation assets are required to be durable, and the repository is public — with no consent or data-handling protocol

**Severity:** Moderate-High · **Confidence:** High

**Evidence — internal:** `05` §52 ("Child Usability Review") requires testing "with actual members of the target age range," observing where learners hesitate, what confuses them, when they request help. `05` §77 ("Validation Assets Are Durable Project Assets") requires important review cases and acceptance examples to live in version control and explicitly *not* to exist "only in an issue description… in screenshots… in temporary agent context." `reports/` is a tracked directory in a repository whose remote is public. `AGENTS.md` guardrail 8 and the root `README.md` make the PII boundary absolute: "Never commit personal information, learner or student data."

**Why it matters:** Two founding requirements push observational data about identifiable children toward version control, and a third absolutely forbids it. Beyond the repo boundary, nothing in the founding set addresses consent for observing children, what may be recorded, retention, or — if the owner tests with students they teach — the separate school/district approval and FERPA-adjacent boundary that raises. This is the one place where the project's admirable privacy posture has a live gap, and it is in the very activity `05` mandates.

**Recommended response:** **Revise a founding document now.** `05-quality-and-validation.md` §52 should own a short usability protocol: consent expectations, that observations are recorded as **de-identified design findings only**, that no recordings/screenshots containing children or their work enter the repository, and an explicit carve-out from §77's durability requirement for usability data. Add one referring sentence to `00-principles.md` §21 so the privacy principle covers the project's own research activity, not just the product's data handling.

---

## 3. Cross-document conflicts and normalization issues

The set's normalization is genuinely better than most. Ownership boundaries in `00` §26 are real and mostly respected; `01` §21 explicitly defers problem families to `03`; `05` §80 correctly refuses to restate requirements it only tests. The conflicts below are the exceptions.

**Contradictions (each treated as a finding above):**
- `00` §2 vs. `02` §19/§44/§75, `04` §22, `06` §18 — simultaneous representations (Finding 3).
- `03` §59 vs. `03` §60 — denominator validity on forms vs. equivalence on values (Finding 4). `03` §11's "LCD corresponds to lcm(b,d)" inherits the same defect.
- `03` §56 / `05` §66 vs. `03` §68 / `04` §48 / `05` §46 — accept-any-valid-denominator vs. representation density limits (Finding 5).
- `02` §65 vs. `03` §56 / `01` §32 — authored narrative vs. learner-chosen paths (Finding 6).
- `05` §52 / `05` §77 vs. the public-repo PII boundary (Finding 12).
- `06` §3 vs. `06` §66 — fractional units listed as a core goal, absent from core content coverage (Finding 8).

**Duplicated normative material:**
- **Scaffold dimensions** defined three times with three different memberships (`00` §6, `02` §21, `06` §46) — Finding 10. This is the clearest drift risk in the set.
- **Misconception/error lists** appear in `00` §14, `01` §22, `03` §62 with different granularity and membership. Ownership *is* stated (`03` §62: "The Instructional Model owns interpretation"), which is good — but the lists should cross-reference explicitly so a reviewer knows `03` §62 is deliberately a subset (machine-detectable response patterns) rather than an out-of-date copy.
- **Review-question sets** appear in `00` §29, `02` §80, `03` §84, `04` §90, `05` §100–103, and `06` §89–94 — roughly 90 questions across six documents with substantial overlap. Consolidating the *reviewer-facing* subset into `05` (which owns "how correctness and quality are demonstrated") would reduce drift and make the gate usable.

**Roadmap / seed-brief mismatches:**
- The seed brief's **GitHub Pages deploy spike** has no corresponding roadmap phase (Finding 7). *This requires a change to `06-roadmap.md`; a cross-reference note in `docs/project-seed.md` would also help.*
- The seed brief's proposed folder structure has six `src/` areas; `04` §4 names nine conceptual layers (no `scene/`, `session/`, or `persistence/` folder). The seed brief already defers structure to the first spike, so this is not a defect — but the spike should be told explicitly to reconcile the two, and `04` §4 should note that conceptual layers need not be physical folders (it says "may combine some responsibilities physically," which is close enough).

**Terminology:**
- "Least common denominator" is used where "least common multiple of the written denominators" is meant (`03` §11) — folded into Finding 4.
- `01` favours "rename"; `03` uses "conversion" (§13, §38) for the same operation. Minor, but `05` §34 lists terminology consistency as a quality gate, so the canonical pair should be named.
- "Improper fraction" is used throughout; some current curricula prefer "fraction greater than one." A deliberate choice is fine — it should just be a choice, recorded in `01`.

**One illustrative-example defect worth fixing while you're in the file:** `05` §68 warns that the interface must never display sequences "such as \( \tfrac23 + \tfrac14 = \tfrac8{12} + \tfrac14 \)… unless the entire displayed equality is mathematically true." But that equality *is* true (\(\tfrac23 = \tfrac8{12}\)). The example undercuts the rule it illustrates and will confuse an implementer. A genuine false-equality example would be \( \tfrac23 + \tfrac14 = \tfrac8{12} \) shown mid-transition.

**And one test-design nit:** the golden case `3¼ − 1⅝ = 1⅝` (`05` §49, `03` §81) is degenerate — the result equals the subtrahend, so a regression that returns the subtrahend passes. Worth swapping for something like `3¼ − 1⅞ = 1⅜`.

---

## 4. Assumptions that survived scrutiny

I challenged each of these and concluded the documents are right.

**"Static hosting should remain sufficient for the core product."** Unreservedly correct. Deterministic exact arithmetic, local generation, local validation, and local persistence genuinely need no server. `04` §84's refusal to prebuild a backend, and `06` §93's checkpoint questions before any backend, are exactly the right discipline. This decision also delivers the project's strongest privacy position almost for free.

**"Deterministic authored narrative is preferable to runtime generative explanation."** Correct, and more strongly than the documents argue. A runtime LLM would make every finding in §2 above harder: it would destroy reproducibility (`00` §24), make `05`'s entire validation model inapplicable, and introduce a non-zero rate of confidently wrong fraction mathematics into a product whose whole value proposition is trustworthiness. `04` §52 and §53 draw the line in exactly the right place — including the observation that development-time AI does not license runtime uncertainty. The cost is real (Finding 6), but the choice is right.

**"LCD is an efficiency, not the concept."** Strongly supported, and better supported than the documents claim. CCSS-M 5.NF.A.1's own worked example is \(\tfrac23 + \tfrac54 = \tfrac8{12} + \tfrac{15}{12}\) and its stated general method is \(\tfrac{ad+bc}{bd}\) — the *product*, not the LCD. Curricular guidance built on the CCSS-M Progressions goes further: finding a least common denominator "is a distraction from understanding algorithms for adding or subtracting fractions." `01` §7's framing is not just defensible, it is the standards-writers' own position. *(One consequence worth stating: `03` §55 designates LCD as the canonical instructional path, which diverges from the standard's default for good visual reasons. Say why, in `03` §55.)*

**"Correct but unsimplified is correct."** `01` §13, `03` §57, `03` §83, and `05` §65 get this exactly right and are backed by standards-writer commentary on record (McCallum, on simplest form: *"It's not mathematically important"*). Many otherwise good products get this wrong.

**Scaffold fading toward symbolic work.** Supported by the concreteness-fading literature (Fyfe, McNeil, Son & Goldstone, 2014, *Educ. Psych. Review* 26(1), 9–25; Fyfe, McNeil & Borjas, 2015, *Learning and Instruction* 35): gradual progression from concrete to symbolic outperforms holding either extreme constant *and* outperforms abrupt switching, with benefit concentrated in lower-prior-knowledge learners. `01` §28's insistence that fading attach to skills and structures rather than a global learner level, and `02` §78's "same system becoming less intrusive, not progression through unrelated modes," are both well-judged. The one gap is the *evidence* fading is based on (Finding 9).

**Co-presence alone is not the active ingredient in multiple representations.** The negative half of `00` §2 is well supported — Ainsworth (1999), Rau et al. (2015, 2017). Showing two representations together does not produce connection-making on its own. This is the right instinct; it just needs the positive half (Finding 2) and the symbolic-notation carve-out (Finding 3).

**Minimizing verbal load as an equity decision.** `01` §18's insistence that mathematical action can serve as evidence of reasoning, and `02` §12's preference for short prompts, are a genuinely strong position for multilingual learners and struggling readers — a large share of the target population. It needs the Finding 2 refinement, but the underlying instinct is right and I would not want it lost.

**Exact arithmetic, never floating point.** `03` §2 and `05` §5 — obviously correct, and `05` §5's instruction to deliberately test repeating-decimal values so floating-point shortcuts cannot slip in unnoticed is a nice piece of adversarial test design.

**The anti-pattern catalogues.** `02` §74 and `03` §79 are the most reusable pages in the set. "Animation theater," "representation carousel," "number-size difficulty," "renderer mathematics," "canonical-path absolutism" — these are concrete, recognisable, and reviewable. Keep them.

---

## 5. Missing or underdeveloped concerns

### Should be fixed before development

**No LICENSE file exists.** The repository has no license. A public repository with no license is "all rights reserved" by default — nobody may legally fork, reuse, or contribute, which contradicts the free/open framing in `README.md` and `00` §20. *Owner: a `LICENSE` file at root, plus one sentence in `00-principles.md` §20 stating the licensing intent. Consider separate licenses for code (e.g. MIT/Apache-2.0) and for authored instructional content (e.g. CC BY), which is the norm for OER-adjacent projects.*

**No security posture at all.** `05` has no security section; `04` §60 covers dependency evaluation only on bundle/maintenance grounds. For a static site the realistic risks are narrow but real, and cheap to close now: (1) **supply chain** — a compromised npm dependency injects code into the built bundle that ships to children; mitigate with a committed lockfile, pinned versions, and a deliberately small dependency set (which `04` §60 already wants for other reasons); (2) **third-party origins** — a CDN or Google Fonts request leaks every child's IP address to a third party, quietly undoing the privacy posture in `00` §21; self-host everything; (3) **CSP** — GitHub Pages cannot set response headers, so a `<meta http-equiv="Content-Security-Policy">` is the available control; (4) **future share links** (`06` §78) — any URL-encoded practice configuration must be validated against the same content contract as generated problems before use, never trusted as a payload. *Owner: a short section in `04-system-architecture.md`, with a release gate in `05`.*

**No accessibility conformance target.** `00` §17, `05` §37–44, and `06` §68 describe accessibility activities thoroughly but never name a standard. For a product whose plausible route into classrooms is school procurement, "WCAG 2.2 AA" is a one-line commitment that changes what "accessibility validated" (`05` §81) means from a judgement call into a checkable claim. *Owner: `00-principles.md` §17, tested per `05` §37.*

**The accessible alternative to number-line placement may not be achievable as specified.** `02` §72 requires the accessible alternative to "still require the learner to determine the location," and `05` §40 says it must not "simply reveal the answer" — while suggesting "keyboard movement among valid positions." But stepping among valid positions *hands the learner the partition*, which for a placement task may be the exact scaffold being withheld from pointer users. The honest options are: make the task numeric/ordinal for everyone (which is accessible by construction and arguably a better mathematical task), or accept that the two modes assess slightly different things and say so. *Owner: `02-interaction-grammar.md` §72; prototype in Phase 2 rather than specify further.*

**Shared devices.** `04` §31 and `06` §59–61 prefer local browser persistence, and `06` §61 requires the product to work after clearing local data. But school Chromebook carts and shared home tablets mean learner B inherits learner A's faded scaffolds — a novice landing in symbolic-only mode with no visible cause. Nothing in the founding set addresses "whose progress is this?" *Owner: `04-system-architecture.md` §30–31. The account-free answer is either an explicit lightweight local profile selector, or defaulting persistence off with opt-in continuity. This is a Phase 8 design input, but the decision belongs in the architecture now because it shapes the persistence adapter.*

**No backward routing to prerequisites.** `03` §76 defines concept dependencies and `01` §26 defines an evidence continuum, but nothing consumes the dependency graph *downward*: if a learner repeatedly fails equivalence inside an addition episode, no document specifies routing to a focused equivalence episode. Combined with the absence of any entry probe, the project's stated primary target — the learner with fluent procedure and broken concept (`01` §1) — is routed by procedural success straight into the symbolic-only mode that hides the gap. `01` §37 ("Avoid False Fluency") names the risk and supplies no mechanism. *Owner: `01-instructional-model.md`. The cheapest fix: require that fading evidence include at least one conceptual probe (magnitude or invariance), not procedural accuracy alone.*

**Gap thinking is missing from the misconception model.** `01` §22 covers ten misconception families well, including whole-number bias (§22.4) and equivalence-as-change (§22.5). It omits **gap thinking** — comparing the numerator–denominator *difference* rather than the ratio, e.g. judging ¾ and ⅘ equal because "both are one piece from the whole." This is documented as unusually persistent (Pearn & Stephens, 2004; ERIC ED520918 — "the first variation to appear and the last to disappear") and is directly relevant to a product built on magnitude and equivalence. Cheap to add; it also supplies good distractors for Finding 9. *Owner: `01-instructional-model.md` §22.*

### Can reasonably wait

**Curriculum alignment.** No CCSS-M codes appear anywhere. Mapping Stages A–K to 3.NF.A.1, 4.NF.A.1, 4.NF.B.3, 5.NF.A.1 and 5.NF.A.2 costs an afternoon, gives teachers a reason to trust and find the product, and gives the progression external validation. *Owner: `01`. Can land with the MVP rather than before code.*

**Reading level and multilingual learners.** `05` §33 asks for "age appropriateness" without a target. Naming a readability ceiling and a maximum prompt length would make `05` §33 testable and directly serves the population `01` §18 is already protecting.

**Content-authoring workload.** Prompt families × problem families × beats × scaffold levels × paths (Finding 6) is the workstream most likely to stall a free project, and no phase in `06` owns it.

**Scene Model's status.** `04` §4 lists it as a layer and §16 calls it a model, but `04` §68–70 insist derived state be recomputed rather than stored. If the Scene Model is a pure projection of (problem, instructional state, active representation), say so — otherwise implementers will build a second state store, which is exactly what §68 forbids.

**Offline resilience.** `05` §74 requires core practice to survive network loss "once required assets are loaded," but nothing mentions a service worker. School wifi is flaky; a PWA shell is cheap and fits the static architecture.

**Session dose.** `06` §57 requires "a natural stopping point" without saying how long a session is. Classroom practice blocks are 10–20 minutes; that constraint shapes session composition in Phase 7.

**Teacher share-links.** `06` §78 lists reproducible practice configurations encoded in a link as a *stretch* goal. It is nearly free given deterministic generation, preserves the static architecture, and is the single most likely adoption lever for the product ("go do 20 minutes of unlike denominators"). Worth reconsidering as core-adjacent once the MVP exists — not before.

### Publication check

**The founding set is clean.** I scanned the full repository for email addresses, credentials, keys, tokens, absolute local paths, student references, and named individuals. Nothing sensitive is present; the only matches were the PII *rules* themselves in `AGENTS.md`, `README.md`, and `CUSTOMIZATION-CHECKLIST.md`. Git authorship uses a GitHub noreply address. The mathematical examples contain no real-world context that could identify anyone.

Two non-PII observations:

- `advisor-capable-providers.json` (root) publishes detailed notes on a vendor's *unreleased/experimental* CLI behaviour, including an environment-variable flag name, an unreleased API beta identifier, and details described as read out of strings embedded in a shipped binary. This is not PII or a secret and it is not a violation of anything the documents state — but publishing reverse-engineered details of an unshipped vendor feature on a public repo is a judgement call, and it may not have been made deliberately. Worth a conscious decision.
- Repository legibility: a visitor arriving at a "free fraction learning tool" encounters `BOOTSTRAP-PROMPT.md`, `CUSTOMIZATION-CHECKLIST.md`, `.codex/`, `.bootstrap-adoption.json`, and agent-role prompts before they encounter anything about fractions. Harmless, but it raises the bar for a contributor or a curious teacher. Consider moving process scaffolding under a subdirectory when the project goes public.

---

## 6. Research findings

**Animation vs. static graphics — directly challenges the project's defining mechanism.** Three converging meta-analyses (Höffler & Leutner 2007, d = 0.37; Berney & Bétrancourt 2016, g = 0.226, N = 7,036; Castro-Alonso et al. 2019, g = 0.23) put the animation advantage at small and highly heterogeneous. Ploetzner, Berney & Bétrancourt (2020) locate the effect in **kinematic** rather than **conceptual** learning goals. Berney & Bétrancourt additionally find animations of *abstract* representations underperform iconic ones — relevant to animated symbolic notation. The transient information effect predicts that a disappearing morph is worst precisely where before/after comparison is the point. *Applies directly; limitation: no fraction-specific controlled comparison exists, and the domain-transfer argument predicts a weaker effect here, not a stronger one.*

**Prediction before demonstration — the strongest effect in this review.** Predict-Observe-Explain meta-analysis (Koyunlu Ünlü, 2024; 35 studies, 39 effects, N = 2,840): **g = 0.979**, low publication-bias evidence. Animation/technology support was **not** a significant moderator. *Applies to `00` §15, `01` §17, `02` §29 — which the documents already have. Limitations: science-education corpus, elementary estimates rest on few effects, and one prior meta-analysis (Gustina et al. 2023) reports a conflicting low elementary estimate.*

**Multiple representations require explicit connection-making.** Rau, Aleven & Rummel (2015), *JEP* 107(1), 30–46 (n = 112 and n = 152, grades 4–6) and (2017), *Instructional Science* 45(3), 331–357 (n = 74, grades 3–5): multiple graphical representations beat a single representation **only with self-explanation prompting**; sense-making-first beat fluency-first. Ainsworth (1999) supplies the theory; Rittle-Johnson et al. (2017) corroborate the mechanism meta-analytically. *This is the most directly applicable evidence in the review — same domain, same grade band, same design question. Limitation: one research program, ITS format.*

**Representation sequencing — evidence points the other way from the documents.** Rau, Aleven & Rummel (2013), *IJAIED* 23 (n = 230, grades 4–5): **interleaved practice across representations produced higher learning rates than blocked practice.** `02` §16 ("Representation Changes Should Be Rare Enough to Matter"), §32 (bridges "relatively infrequent"), §34, and `01` §16 assert the opposite without evidence. *Important scope caveat: Rau tested alternation across problems in a set, not co-display on one screen, so this challenges bridge frequency, not the one-focal-model rule. `06` §55 already says bridge frequency "should eventually be informed by learner use" — the right instinct; `02` §32 should stop stating it as settled.*

**Morphing vs. side-by-side — untested.** No study compares an animated morph between two fraction representations against static side-by-side or sequential presentation in grades 3–6. `00` §3's "representations should transform into one another" is a **literature-consistent design hypothesis**, not a finding. It is defensible by analogy (concreteness fading is fundamentally gradual and sequential; Ainsworth's translation-cost analysis says the correspondence should be externalised rather than inferred), but the documents present it as near-axiomatic across `00` §3, `02` §17, and `06` §34. *Recommendation: label it as a hypothesis and prototype it; do not let the architecture's most expensive requirement rest on it.*

**Number line vs. area models.** IES Practice Guide (Siegler et al., 2010, NCEE 2010-4039) makes number lines cross-cutting; Siegler, Thompson & Schneider (2011) make magnitude the organising construct; **Hamdan & Gunderson (2017), *Developmental Psychology* 53(3), 587–596** is the key causal study — number-line training beat *circular* area-model training on symbolic fraction comparison; Gunderson et al. (2019) isolate **unidimensionality** as the active feature; Fuchs et al. (2017) build five successful at-risk RCTs on the measurement interpretation. *Applies to Finding 8. Important limitation, stated plainly: the losing condition was a circle, not a bar. A fraction bar is unidimensional, so this evidence does not indict bars — it indicts deferring magnitude, and it favours designing the bar as a length model.*

**Common denominators, LCD, and simplification.** CCSS-M 5.NF.A.1 exact text uses the product of denominators; Progressions-derived curricular guidance calls LCD-finding "a distraction"; McCallum on record that lowest terms is "not mathematically important." 3.NF.A.1 builds fractions from unit fractions, supporting the common-unit framing. *These are standards/policy positions and curricular design rationale, not RCT findings — I found no experiment isolating LCD-first vs. any-denominator instruction. They should be cited as authoritative curricular guidance, which is what they are.*

**Split attention / spatial contiguity.** Schroeder & Cenkci (2018), *Educ. Psych. Review* 30, 679–701: 58 comparisons, n = 2,426, integrated beats separated, **g = 0.63**. Supports `02` §19's symbol-integrated-with-diagram requirement. *Contested boundary condition: Beege et al. (2019), Frontiers in Education, find an inverted U — extreme proximity crowds unrelated elements and reverses the benefit. So "keep the label on the bar" yes; "cram everything together" no.*

**Fraction misconceptions.** The documents' `01` §22 list is well-aligned with the literature (whole-number bias: Ni & Zhou, 2005, *Educational Psychologist* 40(1), 27–52; the add-tops-add-bottoms error, with the classic NAEP ¹²⁄₁₃ + ⁷⁄₈ item where ~24% of 8th graders chose the correct estimate). The notable omission is **gap thinking** (Pearn & Stephens; ERIC ED520918). *Directly applicable; the misconception literature is mature and stable.*

---

## 7. Existing-product comparison

**No existing free tool delivers the proposed combination, and the gap is specific rather than rhetorical.** The landscape fragments cleanly:

- **Free, account-free, calm manipulative sandboxes** — PhET's fraction suite (Intro, Equality, Mixed Numbers, Build a Fraction, Fraction Matcher), The Math Learning Center's Fractions and Number Line apps, Toy Theater, Didax, Mathigon Polypad. These meet the calm/free/no-account bar and several handle equivalence-by-subdivision well; Polypad even has a "Rename" action philosophically close to `00` §4. But across repeated searching, **none of the PhET fraction sims appears to contain an addition or subtraction operation on two fractions at all** — they build, compare, equate, and convert, but never combine unlike fractions. The entire common-unit task is absent. MLC's two apps are separate tools that cannot link a bar to a number line in one session. These are silent tools that need a teacher wrapped around them.
- **Khan Academy** is the closest single free *practice* match on the narrow visual-plus-symbolic unlike-denominator task, including a "visually add and subtract fractions" exercise. It is disqualified on exactly the axes FractionFlow defines itself against: it requires an account for the tracked parts, and carries energy points, badges, streaks, avatars, and mastery dashboards (confirmed active 2025–26). Its scaffolding is mastery-unlock based, not a deliberate representation fade within one problem arc.
- **Desmos Classroom** contains individual teacher-authored activities that get closest to the actual arc (pictorial support fading toward symbolic on unlike denominators), but they are crowd-quality-variable, not centrally vetted, and require a teacher-hosted session code — unusable by a self-directed learner.
- **Illustrative Mathematics / Open Up Resources** is the closest match in *pedagogical philosophy* — Grade 5 Unit 6 teaches common denominators via equivalent-fraction diagrams before operating. But it is a teacher-led print/PDF curriculum; the polished interactive layer sits behind paid or educator-verified platforms.
- **The most important finding here is a negative one.** Rau, Aleven & Rummel's **Fractions Tutor** — the one system explicitly engineered around sequencing multiple linked fraction representations with self-explanation prompts, studied with 3,000+ 4th/5th graders — **is not publicly accessible.** It lives behind CTAT/TutorShop research infrastructure. The system closest to FractionFlow's ambition exists, works, and is unavailable to any child.
- **DragonBox, Slice Fractions, Motion Math, Brilliant, Prodigy, IXL, Freckle, CK-12, ASSISTments** are each disqualified individually on cost, account requirement, gamification, teacher-mediation, or simply not addressing this skill with this pedagogy.

**Is building FractionFlow justified? Yes, and more clearly than the founding documents claim for themselves.** The pieces exist separately — calm free manipulatives with no operations, a common-unit curriculum philosophy locked in print, a research-validated linked-representation tutor locked in a lab, and a handful of teacher-made activities locked behind session codes. Nobody has shipped them together as a free, account-free, non-gamified static browser tool.

**One strategic implication worth acting on:** the closest analogue to what this project wants to build is a *published* research system. Its design decisions and empirical results (Rau, Aleven & Rummel 2009/2013/2015/2017) are available even though the software is not. The project should mine that program deliberately rather than rediscover it — particularly on representation sequencing and connection-making prompts, where its findings bear directly on Findings 2 and on `02` §32.

*Caveat on this section: this is web-research-based; several tools are JS-rendered canvases that could not be inspected interactively. The PhET "no addition operation" claim rests on sim descriptions, repos, and teacher-guide references rather than hands-on use, and is worth five minutes of direct verification before it is relied on.*

---

## 8. Pre-development revision recommendations

Deliberately short. Everything else in this review can wait for implementation or prototyping.

1. **Rebalance animation and prediction.** — `00-principles.md` §7 (with `02` §17, §36, §37 following). Make *predict → reveal → persistent side-by-side before/after* the canonical pattern; animated transition becomes an optional, skippable enhancement ending in that same residue. *This is the highest-value change in the list: it is evidence-backed, it reduces cost, and it dissolves four feasibility problems at once.*

2. **Fix the common-denominator definition.** — `03-math-and-content-model.md` §10, §11, §12, §59, and the two corresponding invariants in `05` §4. All validity, classification, and LCD computation operate on **reduced operand values**, not written forms.

3. **Resolve the simultaneous-representations contradiction.** — `00-principles.md` §2. "At most one spatial/visual model is focal at a time; symbolic notation is a persistent co-representation."

4. **Decide what happens when a learner's valid denominator exceeds the renderer's density limit.** — `02-interaction-grammar.md`, with a supporting constraint in `03`. Any of the three policies in Finding 5; not silence. This fires in Phase 2.

5. **Require structured connection-making at bridges, and distinguish it from verbal burden.** — `01-instructional-model.md` §18, then `02` §33. Menu-selected, not free text.

6. **Define a Phase-3 MVP and move the deploy spike to Phase 1–2.** — `06-roadmap.md` §71, §7, and a new early-phase deployment item. *Note in `docs/project-seed.md` how its three seed packets map onto the revised phases.*

7. **Schedule Stage A content and pull basic number-line magnitude work into Phase 3.** — `06-roadmap.md` §66 and §32; specify the bar as a length model anchored at 0 in `01` §14.1 / `02` §18.

8. **Bound the scaffold space and de-duplicate the list.** — `02-interaction-grammar.md` §21 becomes canonical; `00` §6 and `06` §46 reference it. Add named scaffold profiles as the validation unit.

9. **Close the false-success holes.** — `01` §28 (first-attempt-only evidence, guess-rate-aware thresholds), `03` §51 (deliberate "check-the-premise" family, distinguished from accidental degeneracy), `02` §39 (distractor rationale keyed to `01` §22), `05` §19 (the scene-serialization leakage invariant).

10. **Add the missing project-level basics.** — A `LICENSE` file; a short security-posture section in `04`; a named accessibility conformance target in `00` §17; a child-usability consent-and-data protocol in `05` §52.

---

## 9. Questions best answered by prototyping rather than specification

These should become explicit empirical questions for the first vertical slice, not further specification debate.

1. **Does the subdivision animation beat a static before/after pair for perceiving invariance?** Build both, A/B them with a handful of children. This is the single highest-value experiment available, because the answer determines how much of the architecture's hardest machinery is worth building. (Finding 1.)
2. **Does the bar→number-line morph clarify equivalence more than a well-cued side-by-side comparison?** Untested in the literature; do not settle it in Markdown. (Research §5.)
3. **What is the tolerable prompt density per problem?** The canonical episode in `02` §75 contains five to six learner inputs for one addition. Watch where children disengage. `02` §30 already names the risk; only observation can locate the threshold.
4. **How often should bridge episodes occur?** `02` §32 says "infrequent"; Rau et al. (2013) found frequent alternation beat blocking. Make this a tuned parameter, not a principle.
5. **Is twelfths legible and manipulable on a 375 px phone?** The first slice's canonical example (`2/3 + 1/4` → twelfths) is near the visual-density limit on the smallest supported device, on the first thing built. Worth checking whether a nested first slice (`1/2 + 3/8` → eighths) would be a better Phase 2 subject: it is visually easier *and* instructionally earlier (Stage D rather than Stage E).
6. **Can a keyboard user place a fraction on a number line without being handed the partition?** Build the accessible path in Phase 2, not Phase 9. If it cannot be done, the task should change for everyone. (§5.)
7. **Do children wait passively through the Transform beat, or do they predict?** `05` §52 already lists "whether they predict before animations or merely wait" as an observation target. It is the behavioural test of Finding 1.
8. **Does the fading feel like the same system getting quieter, or like changing modes?** `02` §78 asserts the former. Only a child can say.

---

## 10. Bottom line

**Preserve:** the instructional core — units, renaming, common units, LCD-as-efficiency, regrouping-as-decomposition, correct-but-unsimplified. The determinism and exact-arithmetic commitments, and the refusal to let a language model near mathematical truth. The static-first architecture and the privacy posture it buys. The `mathematical state → instructional state → presentation` separation. The two anti-pattern catalogues. The prediction-before-demonstration pattern, which is the best-evidenced idea in the set. And the restraint — this project's willingness to say no to badges, streaks, dashboards, and accounts is not aesthetic preference; it is what makes it different from everything that already exists.

**Change now:** the animation bet. Make prediction plus a persistent before/after comparison the canonical pattern and let animation be an enhancement — it is better supported, cheaper, more accessible, and it resolves most of the feasibility risk in one move. Fix the common-denominator definition before it is encoded into tests. Resolve the simultaneous-representations contradiction, because `05` §78 turns it into a review gate that currently returns two different answers. Decide what happens when a learner's correct denominator cannot be drawn. Give the project a shippable milestone at Phase 3 and a deployment path in Phase 1 — a free project that cannot ship for nine phases is the likeliest way this ends. Schedule magnitude. Add a license. And require structured connection-making at bridges, because on the best available evidence it is the difference between linked representations that work and linked representations that decorate.

**Leave unresolved for prototyping:** whether morphing beats side-by-side; how often bridges should occur; how many prompts per problem a ten-year-old tolerates; whether twelfths work on a phone; whether the fade feels continuous. These are empirical questions wearing specification clothing, and the founding set is already long enough that arguing them further in prose has a negative expected return. `06` §9–10 (Phase 0) is exactly right that the project should know what it is trying to prove with the first episode. The answer should be: *that a child predicts, sees, and understands an equivalence they caused* — not that the morph is beautiful.

One closing note on the set as a whole. Roughly 12,400 lines and ~500 numbered normative sections is a great deal of specification for a project with no code, and `05` §78 asks reviewers to check conformance against all of it. The contradictions in this review are not random — they are what happens when a normative surface grows past the point where one person can hold it. The most durable thing the owner could do alongside the ten revisions above is extract a short normative core from each document — twenty to thirty testable rules apiece — and explicitly mark the remainder as rationale and illustration. That would not lose anything. It would make `00` §26's normalization goal, and `05` §79's defence against specification drift, actually achievable.