# Research Brief 01 — Animation vs. Static Graphics for Mathematical Transformations

> **Provenance.** Produced by a read-only `researcher` subagent during the independent
> adversarial review of the FractionFlow founding documents (2026-09-17), commissioned by
> the Claude reviewer. Reproduced **verbatim** as returned; only HTML entity escapes have
> been decoded. See `../review-claude.md` §6 for how this was used, and
> `../research-report.md` for the lead reviewer's assessment of what is safe to rely on.
>
> **Caution.** This is desk research by a subagent, not a vetted literature review. Several
> citations are explicitly flagged below as search-synthesis rather than
> primary-source-verified. Honour those flags before citing anything here in a founding
> document.

## Question put to the agent

What is the evidence on ANIMATION vs STATIC GRAPHICS for learning mathematical
transformations, and what are the known failure modes of instructional animation?

Sub-questions: (1) meta-analytic evidence and moderators; (2) the transient information
effect and its mitigations; (3) the apprehension principle and whether Tversky et al.'s
critique held up; (4) math-specific evidence on animating fraction equivalence; (5) whether
"predict before you see the animation" has empirical support.

---

# Research Report: Animation vs. Static Graphics for Learning Mathematical Transformations

## Scope note

This is desk research synthesizing meta-analyses and primary studies via web search/fetch, cross-referenced with the FractionFlow repo's design constraints (`C:\AI\FractionFlow\AGENTS.md`, section 5.4: "reduced-motion support" is a foundational, not retrofitted, design input; static-only architecture; child-centered calm design). No repo files were modified.

---

## 1. Meta-analytic evidence: animation vs. static graphics — overall effect and moderators

Three well-cited, mutually-replicating meta-analyses converge on a **small, heterogeneous, condition-dependent advantage** for animation:

- **Höffler & Leutner (2007)**, *Learning and Instruction* 17(6), 722–738, DOI: 10.1016/j.learninstruc.2007.09.013 — 76 pair-wise comparisons from 26 studies (1973–2003). Overall **d = 0.37** (small-to-medium) favoring animation. [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0959475207001077), [LearnTechLib](https://www.learntechlib.org/p/100698/)
- **Berney & Bétrancourt (2016)**, *Computers & Education* 101, 150–167 — 140 comparisons from 61 studies, N=7,036. Overall **Hedges' g = 0.226** (95% CI 0.12–0.33), "small" by Cohen's convention. I confirmed this directly from the primary-source PDF. Key moderators, quoted from the paper:
  - **Pacing control**: system-paced (no learner control) animations outperformed learner-paced ones (g = 0.309 for system-paced vs. lower for learner-controlled), a counter-intuitive finding the authors attribute to system pacing not impeding integration despite the "transient nature of animation, frequently seen as a drawback."
  - **Representational abstraction**: iconic/realistic/schematic animations beat abstract-representation animations (analytic pictures, formal notation, diagrams) — g = 0.245 vs. lower, QB = 6.357, p = .042. This is a caution flag for FractionFlow: **symbolic/abstract fraction notation animated may show weaker benefit than a concrete, iconic bar/area representation.**
  - High heterogeneity (I² = 78.38%) means the pooled effect is not a reliable design guarantee on its own — moderators matter more than the average.

  [Primary PDF via ResearchGate/UNIGE](https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf), [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0360131516301336)
- **Castro-Alonso, Ayres & Sweller (2019)** — 46 studies, 82 effect sizes, N=5,474: overall **g = 0.23**, essentially replicating Berney & Bétrancourt. [Educational Psychology Review](https://link.springer.com/article/10.1007/s10648-019-09469-1) (via search synthesis; not independently primary-verified)

**The most important recent reframing** is **Ploetzner, Berney & Bétrancourt (2020)**, *Journal of Computer Assisted Learning* 36, 838–860 — a re-analysis/review arguing the three meta-analyses' modest pooled effects mask a real distinction: animation's advantage is concentrated where learners must build a **kinematic model** (a mental representation of *how something moves/changes over time*), not where they must learn a **conceptual model** (the underlying principle/structure). "Teaching of conceptual models is not a specific strength of animations… the educational strength of animations resides in the teaching of kinematic models." [Journal of Computer Assisted Learning](https://onlinelibrary.wiley.com/doi/full/10.1111/jcal.12476), also discussed in the follow-up reanalysis paper Höffler et al., *Instructional Science* (2021) 49:497–514, "When learning from animations is more successful than learning from static pictures: learning the specifics of change." [Springer](https://link.springer.com/article/10.1007/s11251-021-09541-w), [PDF mirror](https://d-nb.info/1244480126/34)

**Implication for a fraction tutor**: fraction equivalence (2/3 = 8/12) is fundamentally a **conceptual/structural** claim (invariance of ratio under partitioning), not a **kinematic** one (there is no real-world motion to depict — subdividing a bar is a mathematical operation, not a physical process). Per Ploetzner et al.'s reframing, this is exactly the category where animation's meta-analytic advantage is weakest and least reliable.

---

## 2. The transient information effect

Established by **Sweller, Ayres & Kalyuga** and elaborated by **Leahy & Sweller**: information is "transient" when it disappears before the learner can adequately process and integrate it with what follows, forcing costly retention-in-working-memory of earlier elements while new elements are processed. Animation and narration are the classic transient formats; static text/diagrams are "permanent" by contrast. [ScienceDirect (Cognitive load theory, the transient information effect and e-learning)](https://www.sciencedirect.com/science/article/abs/pii/S0959475212000369), [Wiley (Singh 2012, segmentation and transient text)](https://onlinelibrary.wiley.com/doi/10.1002/acp.2885)

Key empirical/design conclusion found across sources: **animation retains its edge over static graphics for short/simple transient sequences but loses it (or reverses) as sequence length/complexity grows**, because working memory is overloaded. "If students find information is complex, it should not be presented in transient form."

**Established mitigations** (converging across multiple sources):

- **Segmentation**: breaking a continuous animation into learner-paced chunks. **Spanjers et al. (2011)** found segmented animations outperformed continuous ones for novices but not for higher-prior-knowledge learners — an expertise-reversal pattern.
- **Learner pacing / self-pacing**: **Mayer & Chandler (2001)**, *Journal of Educational Psychology* 93, 390–397 — segmenting a narrated lightning-formation animation into learner-controlled stop points improved transfer (the classic empirical basis for the "segmenting principle"). Note the tension: Berney & Bétrancourt's later meta-analysis found system-paced animations *outperformed* learner-paced ones in the pooled data — the literature is **not fully consistent** on pacing control, and effects likely interact with domain/prior knowledge.
- **Static residue / permanent trace**: leaving a static end-state or key-frame visible after the animation completes, so learners can re-inspect it without re-running transient motion. Directly relevant to a fraction bar transformation, where the final partitioned bar (the "residue") is what carries the durable evidence of invariance.
- **Cueing/signaling**: visual highlighting of task-relevant regions during an animation reduces extraneous load and improves comprehension, per a meta-analysis and meta-regression (**PLOS ONE**, "The more total cognitive load is reduced by cues, the better retention and transfer") — though effects interact in complex ways with interactivity; cues can sometimes act as *additional* perceptual load. [PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0183884), [de Koning dissertation, attention cueing](https://repub.eur.nl/pub/17496/Proefschrift%20Bjorn%20de%20Koning_inclusief%20omslag.pdf)

**Flag**: the pacing-control literature is genuinely contested (Mayer & Chandler's classic learner-control benefit vs. Berney & Bétrancourt's pooled system-pacing advantage vs. Adesope & Nesbit 2012 finding no consistent benefit of control). Treat "give the learner a pause/replay button" as a plausible mitigation, not a guaranteed win.

---

## 3. The apprehension principle (Tversky, Morrison & Bétrancourt, 2002)

**Tversky, B., Morrison, J. B., & Bétrancourt, M. (2002). "Animation: can it facilitate?"** *International Journal of Human-Computer Studies*, 57(4), 247–262. DOI: 10.1006/ijhc.2002.1017. [Stanford HCI PDF](https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf), [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1071581902910177)

Core claims, verified from the primary PDF:

- **Congruence Principle**: the structure and content of the graphic should correspond to the structure and content of the concept being conveyed (not merely decorate it).
- **Apprehension Principle**: the graphic must be accurately *perceivable* and appropriately *conceivable* — i.e., animation frequently fails not because motion is inherently bad, but because **most animations are too fast or too complex to be accurately perceived**, and because many continuous real-world processes are mentally represented by people as **discrete steps** anyway — so an animation that shows continuous motion may fight against how learners naturally chunk the event.
- Their meta-review of prior animation-vs-static studies found systematic **confounds**: apparent animation benefits in earlier literature were frequently attributable to co-occurring extra content, interactivity, or narration rather than to motion itself — a methodological critique, not just a cognitive one.
- Their prescription: animation is justified mainly when the represented event is genuinely continuous/dynamic and when interactivity (pause, rewind, replay, learner control) is available to offset the perception problem.

**Has it held up?** Broadly, yes, though refined rather than overturned. The subsequent 20+ years of meta-analytic work (§1) is consistent with their skepticism about a general "animation advantage" — pooled effect sizes are small (g ≈ 0.2–0.4), heterogeneous, and contingent on exactly the moderators Tversky et al. predicted (representation type, interactivity/pacing, complexity). Lowe's subsequent empirical work on **selective/salience-driven processing of complex animations** (Lowe, 2003, "Animation and learning: Selective processing of information in dynamic graphics," *Learning and Instruction* 13, 157–176) independently confirmed the apprehension-style concern: learners attend to what's *perceptually salient* in an animation, not necessarily what's *task-relevant*, and risk missing important structure unless attention is redirected (cueing). [Search synthesis of Lowe 2003 findings](https://www.sciencedirect.com/science/article/abs/pii/S095947521100020X) — I was unable to fetch Lowe (2003) as a primary source directly; this is second-hand synthesis and should be treated as **corroborating but not independently verified**.

---

## 4. Math-specific evidence: fraction equivalence, invariance, and transformation animation

This is the **thinnest** part of the evidence base — I found no controlled experiment isolating "animated partitioning" vs. "static before/after pair" specifically for fraction equivalence with a clean effect-size comparison. What exists:

**a) Kong, S. C., & Kwok, L. F. (2005). "A cognitive tool for teaching the addition/subtraction of common fractions: a model of affordances."** *Computers & Education* 45(2), 245–265. [ERIC EJ697801](https://eric.ed.gov/?id=EJ697801), [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0360131504001897)

- Design offers a **choice** between "intentional slow-down animation of the partitioning/regrouping process" and an "instantaneous" option, explicitly so learners can "pick up the idea of using the same unit to compare fraction equivalence and see the inverse relationship between number of parts and size of a part."
- This is a **design-based, qualitative case study** (12 subjects, five 2-hour sessions) — not a randomized comparison of animated vs. instantaneous partitioning, so it cannot support a causal claim about which is better. It does, however, corroborate the idea that **learner choice/control over whether to see the transformation unfold** is a plausible design lever, consistent with segmenting/pacing principles in §2.

**b) Hansen, Mavrikis, Holmes & Geraniou (2015). "Designing interactive representations for learning fraction equivalence."** iTalk2Learn project (Fractions Lab). [Primary PDF, fully read](https://www.italk2learn.eu/wp-content/uploads/2015/11/Designing-interactive-representations-for-learning-fraction-equivalence.pdf)

- 67 students, ages 9–11 (directly in FractionFlow's target age range), using a **partitioning tool** where students manipulate a rectangle/number-line/measuring-jug representation, splitting it and watching the fraction symbol update live, "changing the denominator and numerator while leaving the original whole intact — something not previously possible without destroying the original" with physical manipulatives.
- Findings are qualitative/descriptive, not an animation-vs-static RCT: a case study ("George") shows a student overcoming a "x/y = 1/xy" misconception through **interactive, learner-driven partitioning** with immediate symbolic feedback; 73% of students in a familiarization task referenced the symbol-change caused by the partitioning action; 25% of all 67 students spontaneously cited "the representations" (rectangle-partitioning) as what helped them understand equivalence.
- The authors' interpretive claim: the tool's value lies in its **dynamic, learner-controlled nature and the direct link between graphical action and symbolic update** — not narrated/system-paced animation per se. This is closer to a **direct-manipulation / interactive-transformation** paradigm than to a passively-watched animation, and the evidence quality is exploratory (no control condition, no static-only comparison group).

**c) No meta-analysis or RCT specific to "morph/continuous transformation vs. static before/after" for rational-number invariance was located.** This sub-question is best characterized as an evidence gap, filled currently only by design-based/qualitative work and by extrapolation from the general (non-math) animation literature in §1–3.

**Bottom line for 4**: There is no strong direct evidence that watching an animated subdivision of a fraction bar produces better perceived invariance than a well-designed static before/after pair. What evidence exists points toward **learner-controlled, interactive partitioning with live symbol feedback** (not narrated/passive animation) as the mechanism plausibly doing the work in the one directly relevant primary study (Hansen et al.), and toward giving learners a **choice** of animated vs. instant transformation (Kong & Kwok) rather than forcing either.

---

## 5. Prediction-before-animation / generation effect

**a) Predict-Observe-Explain (POE)** — the most directly relevant, best-evidenced strategy for "predict before you see."

- **Koyunlu Ünlü, Z. (2024). "Effect of the Predict-Observe-Explain (POE) Strategy on Achievement in Science Education: A Meta-Analysis Study."** *Van Yüzüncü Yıl University Journal of Education* 21(3), 893–920. DOI: 10.33711/yyuefd.1570041. I read this paper's full text directly. 35 studies (39 independent effects), N=2,840. **Overall Hedges' g = 0.979** (95% CI 0.771–1.188, p<.001) — a "high" effect by Thalheimer & Cook's classification, with low evidence of publication bias (fail-safe N = 5,503; Egger's test non-significant). [DergiPark](https://dergipark.org.tr/en/download/article-file/4299696)
  - Moderator: **field of science** matters significantly (physics/biology/astronomy g≈0.76–0.83; chemistry g=1.33; geology g=0.22 — low, attributed to less-active hands-on engagement).
  - Moderator: **implementation type** (POE alone vs. technology/animation-supported POE) was **not** a significant moderator (g=1.019 vs. 0.875) — i.e., adding animation/simulation to the observe stage did not reliably increase POE's benefit over POE alone, which weakens the case that "prediction + animation" beats "prediction + static observation."
  - Moderator: **education level** significant — university/high school g≈1.10–1.23 (very high), elementary g=1.015 (high, but only 5 of 39 effects), middle school/preschool g≈0.5 (medium) — the elementary-level estimate is thin (small k, and it is a **science**, not math, domain).
  - Two prior, less rigorous meta-analyses are cited concordantly: Gustina et al. (2023, 70 studies incl. math and science, medium effect, more effective in math than science, elementary "very low" effect — directly conflicting with Koyunlu Ünlü's own elementary estimate, plausibly because Gustina's set mixed disciplines) and Nurshafara (2022, physics only, g=0.995).
- **Mechanism per the theory** (Kearney 2004; White & Gunstone 1992): the prediction stage surfaces existing beliefs/misconceptions and requires justification; the explanation stage forces reconciliation between prediction and observation — a form of the **generation effect** (self-generated content is retained better than passively received content) combined with cognitive-conflict resolution.

**b) Related generation-effect and self-explanation literature**: **Fiorella & Mayer (2015)**, "Eight Ways to Promote Generative Learning," and follow-on work — predicting/explaining before or during instruction is one of several validated "generative activities," alongside teaching, self-explaining, and drawing. [Fiorella & Mayer PDF](https://bootcampmilitaryfitnessinstitute.com/wp-content/uploads/2016/01/eight-ways-to-promote-generative-learning-fiorella-mayer-2015.pdf) This is a broader synthesis, not animation-specific, so it corroborates the mechanism but doesn't isolate "predict, then watch an animation" as a unique paradigm.

**c) Hegarty's mental-animation work** (Hegarty & Just 1993; Hegarty, Kriz & Cate 2003; Kriz & Hegarty 2004/2007): predicting motion from a static mechanical diagram engages "mental animation" and *reveals* what a learner does/doesn't understand, functioning as a diagnostic and a generative act in its own right. Notably, **Hegarty et al. (2003)** found that multiple **static** frames showing key phases of a device's operation *improved* mental-model construction and comprehension compared to a single external animation — direct evidence, in a non-math domain, that a well-chosen sequence of static states can beat animation for building a durable mental model. [Search synthesis](https://www.researchgate.net/publication/259703620_The_Roles_of_Mental_Animations_and_External_Animations_in_Understanding_Mechanical_Systems) — not independently primary-source-verified in this session; treat as corroborating, not confirmed.

**Bottom line for 5**: Prediction-before-observation (POE) has one of the stronger, more consistent effect sizes in this whole research area (g≈0.98 pooled, replicated across three independent meta-analyses with roughly convergent magnitude), and is domain-general and mechanistically well-motivated (generation effect + misconception surfacing). But **the "animation" component of POE is not what drives the effect** — Koyunlu Ünlü's own moderator analysis found technology/animation support added no significant increment over POE implemented without technology. This suggests: **build in a predict-then-check step, regardless of whether the "check" is animated or a static reveal.** No POE study located here was math-specific for fraction equivalence — this is again a domain-transfer inference, not direct math evidence.

---

## Cross-cutting flags on evidence quality

- **Thin/contested**: sub-question 4 (fraction-equivalence-specific animation research) — essentially no controlled comparisons found; only two design-based/qualitative studies (Kong & Kwok 2005; Hansen et al. 2015), neither randomized, neither isolating animation-vs-static as the manipulated variable.
- **Contested**: learner-pacing/control effects (§2) — Mayer & Chandler's classic self-pacing benefit sits awkwardly against Berney & Bétrancourt's pooled finding favoring system-paced animation, and against Adesope & Nesbit's null finding on control. Treat pacing-control benefits as plausible, not settled.
- **Domain-transfer risk**: almost all strong quantitative evidence (Höffler & Leutner, Berney & Bétrancourt, Castro-Alonso et al., Koyunlu Ünlü's POE meta-analysis) comes from **science education** (physics, chemistry, biology, mechanical systems), not mathematics, and rarely from rational-number/fraction content specifically. Applying these effect sizes to fraction-equivalence instruction is an **analogical inference**, reinforced by the Ploetzner et al. (2020) kinematic/conceptual distinction, which argues the analogy should predict a *weaker* animation benefit for a conceptual/structural target like fraction equivalence than for the mechanical/scientific processes in most of the underlying studies.
- **Unverified secondary sources**: Lowe (2003) and Hegarty et al. (2003) findings above were retrieved via search synthesis, not primary-document fetch — I flag these as corroborating rather than confirmed within this session.

---

## Bottom line: when is animated transformation worth its cost vs. a static before/after pair?

Based on the converging meta-analytic evidence (§1–2), the largely-held-up apprehension critique (§3), the absence of direct math-specific support (§4), and the strength of the prediction-effect literature (§5):

1. **The general "animation helps" effect is real but small (g≈0.2–0.4) and is concentrated in kinematic learning goals** (how something moves/changes in time) — not conceptual/structural goals like fraction equivalence. Per Ploetzner, Berney & Bétrancourt (2020), a fraction-equivalence transformation is closer to the conceptual end of that spectrum, where animation's meta-analytic edge is weakest.
2. **Transience is a real cost.** A continuous morph from 2/3 to 8/12 that disappears without leaving a durable static trace risks overloading working memory exactly when the learner needs to compare the "before" and "after" states to perceive invariance — which is the whole point of the exercise. If animation is used, it should **end in and be replaceable by a persistent static residue** (the fully-partitioned bar, side by side with the original), consistent with both the transient-information mitigations (§2) and FractionFlow's own reduced-motion accessibility commitment (`AGENTS.md` §5.4).
3. **Interactive, learner-driven partitioning with live symbolic feedback** (Hansen et al. 2015's Fractions Lab, in the same 9–11 age band as FractionFlow's target) is the one directly relevant, age-matched study, and its qualitative signal favors *learner-controlled manipulation* over either passive animation or a purely static pair. This is a distinct design from "watch an animation" — it is closer to direct manipulation.
4. **The strongest, most consistent, best-replicated effect in this whole review is not animation but prediction-before-observation** (POE, g≈0.98 pooled across three meta-analyses) — and critically, adding animation/technology to POE did not significantly increase its benefit over POE done without technology. This argues for spending design budget on **a predict-then-reveal interaction pattern** rather than on animating the reveal itself.

**Practical recommendation for a browser-based fraction tutor (upper elementary, reduced-motion-first, static architecture)**: prefer a **static before/after comparison pair, paired with a prediction prompt** ("What do you think will happen if we cut each piece into 4 smaller pieces? Will the amount shaded change?") as the default, evidence-backed, low-cost, accessibility-aligned pattern. Reserve a *brief, skippable, learner-triggered* transformation animation (not autoplay) — ending in a static residue that stays on screen for comparison — as an optional scaffold for learners who show signs of not perceiving the partitioning operation from the static pair alone, rather than as the default instructional path. This aligns with the moderator evidence (iconic > abstract representations; system control is contested; residue matters), respects the repo's existing reduced-motion-first constraint, and does not overclaim math-specific animation evidence that does not yet exist.

---

## References (with links found)

- Höffler, T. N., & Leutner, D. (2007). Instructional animation versus static pictures: A meta-analysis. *Learning and Instruction*, 17(6), 722–738. https://doi.org/10.1016/j.learninstruc.2007.09.013 — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0959475207001077)
- Berney, S., & Bétrancourt, M. (2016). Does animation enhance learning? A meta-analysis. *Computers & Education*, 101, 150–167. — [Primary PDF](https://tecfa.unige.ch/perso/sandra/pdf/Earli2016_berney_betrancourt_FINAL.pdf), [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0360131516301336)
- Castro-Alonso, J. C., Ayres, P., & Sweller, J. (2019). Meta-analysis on dynamic vs. static visualizations. — [Educational Psychology Review](https://link.springer.com/article/10.1007/s10648-019-09469-1)
- Ploetzner, R., Berney, S., & Bétrancourt, M. (2020). A review of learning demands in instructional animations. *Journal of Computer Assisted Learning*, 36, 838–860. — [Wiley](https://onlinelibrary.wiley.com/doi/full/10.1111/jcal.12476)
- Höffler et al. reanalysis (2021). "When learning from animations is more successful than learning from static pictures." *Instructional Science*, 49, 497–514. — [Springer](https://link.springer.com/article/10.1007/s11251-021-09541-w), [PDF](https://d-nb.info/1244480126/34)
- Sweller, Ayres & Kalyuga; Leahy & Sweller — transient information effect. — [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0959475212000369), [Wiley (Singh 2012)](https://onlinelibrary.wiley.com/doi/10.1002/acp.2885)
- Mayer, R. E., & Chandler, P. (2001). When learning is just a click away. *Journal of Educational Psychology*, 93, 390–397.
- Tversky, B., Morrison, J. B., & Bétrancourt, M. (2002). Animation: can it facilitate? *International Journal of Human-Computer Studies*, 57(4), 247–262. https://doi.org/10.1006/ijhc.2002.1017 — [Primary PDF](https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf)
- Lowe, R. (2003). Animation and learning: Selective processing of information in dynamic graphics. *Learning and Instruction*, 13, 157–176. — [search synthesis only]
- Kong, S. C., & Kwok, L. F. (2005). A cognitive tool for teaching the addition/subtraction of common fractions. *Computers & Education*, 45(2), 245–265. — [ERIC](https://eric.ed.gov/?id=EJ697801), [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0360131504001897)
- Hansen, A., Mavrikis, M., Holmes, W., & Geraniou, E. (2015). Designing interactive representations for learning fraction equivalence. iTalk2Learn. — [Primary PDF](https://www.italk2learn.eu/wp-content/uploads/2015/11/Designing-interactive-representations-for-learning-fraction-equivalence.pdf)
- Koyunlu Ünlü, Z. (2024). Effect of the Predict-Observe-Explain (POE) Strategy on Achievement in Science Education: A Meta-Analysis Study. *Van Yüzüncü Yıl University Journal of Education*, 21(3), 893–920. https://doi.org/10.33711/yyuefd.1570041 — [DergiPark](https://dergipark.org.tr/en/download/article-file/4299696)
- Fiorella, L., & Mayer, R. E. (2015). Eight Ways to Promote Generative Learning. — [PDF](https://bootcampmilitaryfitnessinstitute.com/wp-content/uploads/2016/01/eight-ways-to-promote-generative-learning-fiorella-mayer-2015.pdf)
- Hegarty, M., Kriz, S., & Cate, C. (2003). The roles of mental animations and external animations in understanding mechanical systems. *Cognition and Instruction*, 21(4), 325–360. — [search synthesis only]

Relevant local file consulted: `C:\AI\FractionFlow\AGENTS.md` (confirms reduced-motion support and calm design are foundational constraints relevant to the recommendation above).
