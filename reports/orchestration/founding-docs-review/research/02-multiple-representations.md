# Research Brief 02 — Simultaneous vs. Sequential Multiple Representations

> **Provenance.** Produced by a read-only `researcher` subagent during the independent
> adversarial review of the FractionFlow founding documents (2026-09-17), commissioned by
> the Claude reviewer. Reproduced **verbatim** as returned; only HTML entity escapes have
> been decoded. See `../review-claude.md` §6 for how this was used, and
> `../research-report.md` for the lead reviewer's assessment of what is safe to rely on.
>
> **Caution.** This is desk research by a subagent, not a vetted literature review. Two
> highly relevant Springer papers were paywalled and are cited from abstracts only; the
> agent flags this explicitly. Honour those flags before citing anything here in a founding
> document.
>
> **This is the most directly applicable of the four briefs** — same domain (fractions),
> same grade band (3–6), same design question (linked representations).

## Question put to the agent

What does the research evidence say about SIMULTANEOUS vs SEQUENTIAL presentation of
multiple external representations in mathematics learning, specifically for fractions in
upper elementary (grades 3–6)?

Sub-questions: (1) does side-by-side beat one-at-a-time; (2) what do split-attention and
spatial contiguity say about co-presenting a visual model and symbolic notation; (3) do
learners spontaneously connect representations or is explicit support required; (4) does
the evidence support the rule "multiple representations does not mean simultaneous
representations," and that representations should morph rather than sit side by side?

---

I have gathered sufficient material to answer the research question. I was unable to retrieve full text for a few paywalled Springer articles (noted below), but cross-referencing abstracts, secondary summaries, and several fully-accessible primary sources gives a solid, well-triangulated picture. Here is the compiled report.

---

# Simultaneous vs. Sequential Multiple External Representations for Fractions (Grades 3–6): Research Report

## Bottom line up front (answering sub-question 4)

**The evidence supports the *negative* half of the design rule strongly, and the *positive* half only as a plausible inference, not an established finding.**

- Well-supported: simply co-displaying two representations does **not** automatically help, and can create extra cognitive cost ("translation" burden) that upper-elementary students cannot resolve on their own. Multiple representations reliably beat a single representation *only* when paired with explicit connection-making support (self-explanation prompts, sense-making instruction) — not from co-presence alone.
- Not directly tested: I found no controlled study that compares an animated "morph" (bar model visually transforming into a number line) against a static side-by-side display for fractions in grades 3–6. "Morphing" as a design solution is a reasonable synthesis of adjacent literatures (concreteness fading + spatial contiguity + Ainsworth's translation-cost analysis), but it is a **design hypothesis to pilot**, not a citable empirical result. Treat it as a strong inference, not a proven principle.

---

## Sub-question 1: Does simultaneous (side-by-side) presentation beat sequential/one-at-a-time presentation?

This is the weakest-evidenced sub-question, largely because most fraction studies don't cleanly test *spatial co-presence on one screen* — they test something adjacent: whether to use one representation type or several across a problem set, and how often to switch between them.

- **Ainsworth's DeFT framework** (Ainsworth, 2006, *Learning and Instruction*, 16(3), 183–198) lists "co-presence" as one of several *design parameters* (alongside number, form, sequence) that designers must decide on — it treats co-presence as a lever, not a universal recommendation. Ainsworth's own earlier paper is more cautionary (see sub-question 2/3).
- **Rau, Aleven, Rummel & colleagues' Fractions Tutor program** (Carnegie Mellon, >3,000 students, grades 4–6) is the most direct empirical body of work here, but it tests **temporal sequencing of representations across a problem set** (blocked vs. interleaved), not simultaneous on-screen co-display:
  - Rau, Rummel, Aleven, Pacilio & Tunc-Pekkan (2012), *ICLS Proceedings*, and the follow-up Rau, Aleven & Rummel (2013), *International Journal of Artificial Intelligence in Education*, 23(1–4) — [DOI 10.1007/s40593-013-0011-7](https://link.springer.com/article/10.1007/s40593-013-0011-7): with 230 4th/5th graders, **interleaved (frequently alternating) practice across representations produced higher learning rates than blocked practice** (staying with one representation for an extended stretch).
  - This supports "switch often" over "stay in one representation a long time," but is **silent** on whether both representations should be visible *at the same instant*.
- **Virtual manipulatives literature**: Moyer-Packenham & Westenskow (2013), *International Journal of Virtual and Personal Learning Environments*, 4(3), 35–50, meta-analyzed 66 reports (82 effect sizes) and found a moderate overall effect (g ≈ 0.34) for virtual manipulatives on achievement, and identified "simultaneous linking" (dynamically linked representations that update together) as one of several affordances associated with learning benefits. This is suggestive but the review does not isolate "simultaneous linking" with its own effect size against a "sequential" comparison condition — it's a qualitative affordance code, not an experimental factor.

**Assessment:** No strong, direct RCT evidence answers "side-by-side co-display beats one-at-a-time" for fraction bar + number line in this age band. The closest empirical analogue (interleaving) favors frequent *switching* over long blocks of one representation — which is compatible with either a sequential-alternation design or a morph, but does not itself validate simultaneous co-display.

## Sub-question 2: What do split-attention / spatial contiguity say about co-presenting a visual model and symbolic notation?

- **Spatial contiguity principle** (Mayer; Ayres & Sweller, "The Split-Attention Principle in Multimedia Learning," ch. in *Cambridge Handbook of Multimedia Learning* — [PDF](https://www.davidlewisphd.com/courses/EDD8121/readings/2006-AyersSweller.pdf)) is well established: when two information sources *must* be mentally integrated to make sense of a single idea, keeping them physically close (or literally merged, e.g., labels placed directly on a diagram rather than in a separate legend) reduces extraneous cognitive load versus forcing learners to search and cross-reference.
- **Meta-analytic confirmation**: Schroeder & Cenkci (2018), *Educational Psychology Review*, 30, 679–701 — [DOI 10.1007/s10648-018-9435-9](https://link.springer.com/article/10.1007/s10648-018-9435-9) — 58 comparisons, n=2,426, integrated designs beat separated designs with g = 0.63 (large, well-established effect).
- **Important scope caveat**: this principle is about avoiding *needless physical/temporal separation of parts that are already meant to be read as one explanation* (e.g., a diagram and its caption/label). It is not a direct endorsement of showing two *distinct, self-sufficient* representations (a full bar model AND a full number line) simultaneously — that is a different problem (see Ainsworth's "translation" cost below), closer to redundancy/complementary-representation design than to split-attention per se.
- **Contested nuance**: Beege, Wirzberger, Nebel, Schneider, Schmidt & Rey (2019), *Frontiers in Education* — "Spatial Continuity Effect vs. Spatial Contiguity Failure" ([full text](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2019.00086/full); corrigendum 2020) — found an **inverted-U**, not a monotonic "closer is always better" relationship: extreme proximity crowds *unrelated* elements together too, inducing costly "micro-switching," so a medium distance outperformed both very-close and very-far conditions in two experiments (Ns 98 and 85). This is a genuine complication to the textbook spatial-contiguity story and should be flagged as **contested/boundary-condition evidence**, not as overturning the main effect.

**Assessment:** Cognitive load theory clearly argues against arbitrarily separating parts that belong together, and for tight integration of labels/annotations with the diagram they describe. It does **not** straightforwardly argue for permanently co-displaying two whole, distinct representations — that is governed more by Ainsworth's "translation cost" analysis (below) than by split-attention per se, and even simple proximity has diminishing/reversing returns at extremes.

## Sub-question 3: Do learners spontaneously connect representations, or is explicit support required?

This is the best-evidenced sub-question, with converging primary studies specifically in fractions, grades 3–6.

- **Theoretical claim (Ainsworth)**: Ainsworth (1999), *Computers & Education*, 33(2), 131–152 ([PDF](https://compassproject.net/Sadhana/teaching/readings/ainsworth.pdf)) explicitly states that **"appreciating the links across multiple representations is not automatic"** and that simultaneous presentation of two representations "evokes translation processes which are complex and cognitively demanding" — translation should only be induced when it serves the learning goal, precisely because it is hard for learners.
- **Direct empirical test in fractions, grades 4–6**: Rau, Aleven & Rummel (2015), *Journal of Educational Psychology*, 107(1), 30–46 — two classroom experiments (n=112 sixth-graders; n=152 fourth/fifth-graders) with the Fractions Tutor. Central finding: **multiple graphical representations (MGR) produced better conceptual learning than a single representation (SGR) only when students were prompted to self-explain how the graphics related to the numerator/denominator and to the symbolic procedure.** Unprompted co-exposure to multiple representations did not reliably outperform a single representation.
- **Direct empirical test in fractions, grades 3–5**: Rau, Aleven & Rummel (2017), *Instructional Science*, 45(3), 331–357 — [DOI 10.1007/s11251-017-9403-7](https://link.springer.com/article/10.1007/s11251-017-9403-7) — n=74, grades 3–5. Found support for a "sense-making-first" hypothesis (explicit verbal explanation of how representations map to each other) over a "fluency-first" hypothesis (repeated perceptual exposure building automatic fluency without explanation): **sense-making competencies enhanced later perceptual fluency, but fluency-building alone did not produce sense-making.** In other words, passive/repeated visual co-exposure is not a substitute for explicit conceptual connection-making instruction.
- **Convergent synthesis**: Rau & Matthews (2017), *ZDM Mathematics Education*, 49(4), 531–544 ([PDF mirror](https://web.education.wisc.edu/pmatthews/wp-content/uploads/sites/35/2012/11/Rau_Matthews_ZDM_2017.pdf), partially garbled in extraction) reviews these findings and frames "helping students interpret individual representations and construct connections among them" as a necessary, non-automatic instructional design task — i.e., multiple representations can *confuse* students absent this support.
- **General mechanism corroboration**: Rittle-Johnson, Loehr & Durkin (2017), *ZDM Mathematics Education*, 49(4), 599–611 — a meta-analysis of self-explanation prompting in mathematics broadly — found small-to-moderate effects of prompted self-explanation on procedural knowledge, conceptual knowledge, and transfer, reinforcing (from a separate literature) that explicit prompting-for-explanation, not passive exposure, drives the benefit.

**Assessment:** This is the most solid, directly relevant, and internally consistent evidence base in the whole report — multiple primary studies from the same well-cited research program (plus an independent meta-analysis on the same instructional mechanism) converge: **connection-making across fraction representations is not spontaneous for grades 3–6 and requires explicit scaffolding** (prompts, questions asking students to map features across representations).

## Sub-question 4: Does the evidence support "morphing" over side-by-side presentation?

No paper I located directly studies an animated morph/transform of one fraction representation into another versus static side-by-side display in this age group. This specific design pattern is untested in the retrieved literature. However, three literatures converge to make it a *principled hypothesis*:

1. **Concreteness fading** (Fyfe, McNeil, Son & Goldstone, 2014, *Educational Psychology Review*, 26(1), 9–25, [DOI 10.1007/s10648-014-9249-3](https://link.springer.com/article/10.1007/s10648-014-9249-3); and Fyfe, McNeil & Borjas, 2015, *Learning and Instruction*, 35, 104–120) shows that **gradually, sequentially transforming a concrete representation toward a symbolic one** (fading, not simultaneous display of both) outperforms holding either extreme constant, and outperforms abrupt switching — with benefit concentrated for lower-prior-knowledge learners. Applications to fractions specifically use fraction bars fading from physical objects → pictures → symbols. This is the closest existing empirical paradigm to "morphing," and it is fundamentally **sequential/gradual**, not simultaneous. Caveat: concreteness fading is about fading features *within* one representation type toward abstraction, not necessarily about linking two *different* representation types (bar model ↔ number line) — so transfer to your specific design is an analogy, not a direct precedent.
2. **Ainsworth's translation-cost analysis** (1999, 2006) predicts that forcing learners to self-generate the correspondence between two static, simultaneously-shown representations is exactly the "complex, cognitively demanding" translation work that should not be assumed away — a morph that visibly demonstrates the correspondence (rather than requiring the learner to infer it) is a plausible way to externalize and reduce that translation burden, consistent with (but not proven by) this theory.
3. **Spatial contiguity / split-attention** (Schroeder & Cenkci, 2018) favors integrated over separated presentation of things that must be read together — a morph guarantees continuous referential correspondence, which is one way (untested) to satisfy this principle without the "spatial contiguity failure" risk of cramming two full diagrams together (Beege et al., 2019).

**Net assessment for sub-question 4:** Treat "multiple representations ≠ simultaneous representations" as **well-supported** (co-presence alone is not the active ingredient; explicit support is). Treat "representations should morph into one another rather than sit side by side" as a **literature-consistent design hypothesis worth piloting inside FractionFlow**, not as an established finding — I could not find a study isolating morph-vs-side-by-side-vs-sequential-swap for fractions in grades 3–6, and it deserves local testing (e.g., think-aloud or A/B comparison) before being treated as settled.

---

## Where evidence is thin, contested, or uncertain (explicit flags)

- **Thin/absent**: direct tests of animated "morphing" transitions between two distinct fraction representations (bar↔number line) in grades 3–6. This is inference, not evidence.
- **Contested**: the strong "closer is always better" reading of spatial contiguity is complicated by the inverted-U finding in Beege et al. (2019) — proximity has a ceiling and can reverse when unrelated content is nearby too.
- **Scope mismatch to flag**: much of the Rau et al. "sequencing" evidence concerns *which representation to use per problem across a series* (interleaved vs. blocked), which is a curriculum-sequencing question, not strictly the same as *what to show on one screen for one problem*. Don't over-read "interleaving beats blocking" as "sequential-on-one-screen beats simultaneous-on-one-screen" — they are related but distinct design levers.
- **Access limitation**: I could not retrieve full text of Rau (2017, *Educational Psychology Review*, "Conditions for the Effectiveness of Multiple Visual Representations in Enhancing STEM Learning," [DOI 10.1007/s10648-016-9365-3](https://link.springer.com/article/10.1007/s10648-016-9365-3)) or the 2024 systematic review/meta-analysis "The More the Better? ... More than Two External Representations in STEM Education" ([DOI 10.1007/s10648-024-09958-y](https://link.springer.com/article/10.1007/s10648-024-09958-y)) beyond abstracts — both are Springer-paywalled and my fetch attempts were blocked (403/redirect to login). Both are highly relevant (the first proposes seven moderating hypotheses for when multiple representations help; the second is presumably the most current meta-analytic word on representation *count*) and should be obtained via institutional access if a more definitive answer is needed on effect-size moderators.
- **Population caveat**: several of the most directly on-point studies (Rau et al. 2015, 2017) used the Fractions Tutor, an ITS — findings about needing explicit self-explanation prompts may be somewhat tied to that instructional format; transfer to a different UI paradigm (e.g., a game-like app like FractionFlow) is plausible but not verified.

---

## Key sources (not exhaustive bibliography — items actually used above)

- [Ainsworth (1999), "The functions of multiple representations," Computers & Education 33(2)](https://compassproject.net/Sadhana/teaching/readings/ainsworth.pdf)
- [Ainsworth (2006), "DeFT: A conceptual framework...," Learning and Instruction 16(3)](https://nschwartz.yourweb.csuchico.edu/Ainsworth_2006_Learning-and-Instruction.pdf)
- [Ayres & Sweller, "The Split-Attention Principle in Multimedia Learning"](https://www.davidlewisphd.com/courses/EDD8121/readings/2006-AyersSweller.pdf)
- [Schroeder & Cenkci (2018), Educational Psychology Review 30](https://link.springer.com/article/10.1007/s10648-018-9435-9)
- [Beege et al. (2019/2020), Frontiers in Education](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2019.00086/full)
- [Rau, Aleven & Rummel (2013), IJAIED 23](https://link.springer.com/article/10.1007/s40593-013-0011-7)
- Rau, Rummel, Aleven, Pacilio & Tunc-Pekkan (2012), ICLS Proceedings — [ResearchGate](https://www.researchgate.net/publication/275213090_How_to_schedule_multiple_graphical_representations_A_classroom_experiment_with_an_intelligent_tutoring_system_for_fractions)
- Rau, Aleven & Rummel (2015), Journal of Educational Psychology 107(1) — [ResearchGate](https://www.researchgate.net/publication/221297417_Intelligent_Tutoring_Systems_with_Multiple_Representations_and_Self-Explanation_Prompts_Support_Learning_of_Fractions)
- [Rau, Aleven & Rummel (2017), Instructional Science 45(3)](https://link.springer.com/article/10.1007/s11251-017-9403-7)
- [Rau & Matthews (2017), ZDM Mathematics Education 49(4)](https://link.springer.com/article/10.1007/s11858-017-0846-8)
- [Rittle-Johnson, Loehr & Durkin (2017), ZDM Mathematics Education 49(4)](https://link.springer.com/article/10.1007/s11858-017-0834-z)
- [Fyfe, McNeil, Son & Goldstone (2014), Educational Psychology Review 26(1)](https://link.springer.com/article/10.1007/s10648-014-9249-3)
- Fyfe, McNeil & Borjas (2015), Learning and Instruction 35 — [ResearchGate](https://www.researchgate.net/publication/268692319_Benefits_of_concreteness_fading_for_children's_mathematics_understanding)
- Moyer-Packenham & Westenskow (2013), Int'l J. of Virtual and Personal Learning Environments 4(3) — [ERIC](https://eric.ed.gov/?id=EJ1154970)
- [Rau (2017), Educational Psychology Review 29(4) — abstract only, paywalled](https://link.springer.com/article/10.1007/s10648-016-9365-3)
- ["The More the Better?" (2024), Educational Psychology Review — abstract only, paywalled](https://link.springer.com/article/10.1007/s10648-024-09958-y)

No local FractionFlow repository files were consulted for this task since it was scoped as external literature research only.
