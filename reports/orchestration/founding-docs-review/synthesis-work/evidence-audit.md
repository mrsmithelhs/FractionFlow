## Evidence audit

The external research materially supports several revisions, but it does not establish that FractionFlow’s proposed interaction design will work. The safest synthesis is to preserve the strongest curricular commitments, demote several UI “principles” to testable hypotheses, and avoid presenting adjacent-domain evidence as direct validation.

### Major research-dependent claims

| Claim / recommendation | Classification | Audit |
|---|---|---|
| General instructional animation has a small, heterogeneous advantage over static graphics | **Established**, at the general multimedia-literature level | The cited meta-analyses converge around \(g/d \approx .22-.37\), with high heterogeneity. This does **not** establish that static presentation is generally superior. |
| Animation is unlikely to add much for fraction equivalence because equivalence is conceptual/structural rather than kinematic | **Plausible interpretation** | Ploetzner et al.’s kinematic/conceptual distinction supports skepticism, but there is no direct fraction-equivalence comparison. “Animation is the weakest-supported bet” is fair; “animation does not help” is not established. |
| Prediction should become canonical and animation optional | **Design judgment grounded in indirect evidence** | The POE meta-analysis is strong but overwhelmingly science-based; its elementary subgroup is thin and another meta-analysis reportedly conflicts. It supports testing prediction-first, not assuming the reported \(g=.979\) transfers to upper-elementary fraction arithmetic. |
| A persistent before/after residue is preferable to an ephemeral morph | **Plausible design judgment** | Strongly consistent with transient-information theory and accessibility needs, but no cited fraction study compares these conditions. |
| Multiple representations require explicit connection-making support | **Established within a directly relevant but bounded research program** | Rau et al. provide the best-matched evidence: fractions, grades 3–6, classroom ITS studies. The general conclusion—co-exposure alone is insufficient and prompted mapping matters—is reliable. Generalization beyond that ITS should still be tested. |
| Every bridge should require a structured/menu-selected self-explanation | **Plausible recommendation** | The need for connection-making is supported; the claim that a short menu selection supplies the same learning mechanism as the studied self-explanation is untested. |
| Simultaneous side-by-side representations are superior to sequential presentation | **Unsupported / contested** | No cited study directly compares bar–number-line morphing, static juxtaposition, and sequential replacement. Spatial-contiguity findings apply most clearly to labels/symbols that must be integrated, not automatically to two complete representations. |
| Symbolic notation may remain co-present with one focal visual model | **Plausible and well aligned with spatial-contiguity evidence** | This is a much narrower and safer conclusion than authorizing two complete visual representations everywhere. |
| Interleaving representations should replace relatively infrequent bridges | **Plausible challenge, not an established prescription** | Rau’s result concerns alternation across problems in a set, not co-display or bridge frequency within an episode. It makes “bridges should be rare” unjustified as a settled principle, but does not determine the optimal frequency. |
| Morphing is beneficial because it externalizes representational correspondence | **Plausible hypothesis only** | No direct morph-versus-static evidence was found. Concreteness fading and translation-cost theory are analogies, not validation of the proposed bar→number-line mechanism. |
| Number-line work should occur earlier than Phase 4 | **Plausible and fairly strong roadmap recommendation** | Number-line magnitude evidence is meaningful, but the key RCT compared number lines with circular area models in younger learners on fraction comparison—not bars, unlike-denominator operations, or this product. The evidence supports early magnitude work; it does not prove a particular roadmap phase. |
| Bars should be anchored at zero and treated as length/measure models | **Design judgment with good theoretical fit** | Gunderson’s unidimensionality result makes this attractive, but it is not a direct experimental finding about FractionFlow-style bars. |
| Unit fractions are a sound foundation and LCD is not required by CCSS-M | **Established textual/curricular fact** | CCSS wording supports unit-fraction foundations and any common denominator; its formula uses denominator products. |
| Common-unit framing improves learning, early LCD emphasis causes difficulty, or mandatory simplification harms understanding | **Plausible curricular rationale, not established causal evidence** | The briefs explicitly found no experiment isolating these instructional choices. Present them as standards-aligned design rationale, not research-demonstrated effects. |
| Simplest form is not mathematically required for every answer | **Established standards/policy position** | Strong textual support; do not inflate it into a causal claim about learning. |
| No current free product supplies FractionFlow’s complete combination | **Plausible market-scan conclusion, not established absence** | The survey is useful reconnaissance, but the conclusion rests on non-exhaustive searching and, for several JS products, descriptions/repos rather than hands-on testing. |
| The Fractions Tutor “exists, works, and is unavailable” | **Partly established, partly overcompressed** | Its existence, published evaluations, and lack of obvious public access are supported. “Works” should be qualified as producing gains under the studied ITS/classroom conditions, not validation of FractionFlow’s design. |
| School Chromebooks frequently erase local progress | **Speculation / weakly supported prevalence claim** | The existence of enterprise policies enabling ephemeral users or clearing data is documented; their frequency in target classrooms was not established. This should motivate a deployment-context question, not a mandatory portable-state design. |
| Basic ARIA cannot preserve the learning value of a visual morph | **Reasonable design inference, not an empirical finding** | Accessibility standards establish equivalent access obligations, not that sonification or a particular narration is necessary. Gemini’s sonification proposal is speculative. |

### Load-bearing absence-of-evidence reasoning

These conclusions rely materially on “we did not find an example/study,” so they must remain provisional:

- **No direct fraction animation comparison exists.** This supports labeling animation/morphing unvalidated, not concluding static is better.
- **No direct morph-versus-side-by-side study exists.** This supports prototyping, not choosing either condition in the founding documents.
- **No product combines all target attributes.** The competitive-gap conclusion remains provisional until the closest products are directly exercised against a fixed workflow matrix.
- **No experimental LCD-first comparison was found.** This prevents causal claims about harm; it does not weaken the standards-text conclusion that LCD is unnecessary.
- **No bars-before-number-lines source was found.** Lack of support does not prove the opposite sequence; the cited number-line evidence also does not directly compare against linear bars.

### “Works elsewhere” reasoning that should be bounded

- POE effects from science education do not directly validate a fraction-app prediction loop.
- Spatial-contiguity effects for diagrams and labels do not establish that two full fraction representations should be shown simultaneously.
- Concreteness fading does not establish that a bar should continuously morph into a number line.
- Fraction Tutor findings do not validate FractionFlow’s authored narrative, animation, or independent browser context.
- Number-line interventions and tutor-supported RCTs do not determine the optimal order or interaction mechanics in a self-directed static web app.
- Mathigon’s authored-interactive format is an engineering existence proof, not evidence that FractionFlow’s content design will be instructionally effective.

### Contested or unresolved claims and discriminating evidence

1. **Animated subdivision versus static comparison**

   Run matched conditions with the same prediction prompt, explanatory content, pacing opportunity, and final static residue. Compare:

   - immediate equivalence judgment;
   - delayed transfer to a fresh denominator;
   - explanation of why quantity stayed constant;
   - ability to predict the new numerator before seeing partitions;
   - replay/help use;
   - reduced-motion and nonvisual usability.

2. **Morph versus juxtaposition versus sequential swap**

   Compare all three with the same explicit connection-making prompt. Follow with an uncued transfer task in which inherited endpoint alignment cannot reveal the answer. This separates perceived correspondence from true transfer.

3. **Connection-making prompt format**

   Compare no prompt, structured menu mapping, and brief learner-generated explanation. If menu selection performs no better than co-exposure or produces recognition without transfer, it is not an adequate substitute for the studied self-explanation mechanism.

4. **Bridge frequency**

   Compare blocked and interleaved representation schedules across otherwise matched problem sets. Do not infer this from a one-screen morph test.

5. **Number-line timing**

   Add a small early magnitude/benchmark family and compare later symbolic comparison and operation transfer against bar-only practice. The question is whether early magnitude work adds value, not whether number lines should replace bars.

6. **Competitive gap**

   Manually test the closest products against a fixed workflow: unlike-denominator operation, explicit equivalence/renaming, common-unit explanation, visual-symbolic linkage, learner action, scaffold fading, transfer task, cost/login/gamification. Until then, describe the gap as “not found in this survey.”

7. **Local persistence on school devices**

   Gather a bounded sample of actual intended deployment policies or conduct a short return-session test on representative managed Chromebooks. Policy capability alone does not establish prevalence.

## Research-source reliability

- **Research Brief 02, multiple representations:** strongest of the four. It is directly matched by domain and age, clearly distinguishes interleaving across problems from simultaneous on-screen display, and explicitly labels morphing untested.
- **Research Brief 01, animation:** useful and reasonably cautious for the general multimedia evidence, but indirect for fraction learning. Its pacing literature is explicitly contested. The POE result should not be treated as a fraction-specific effect size.
- **Research Brief 03, fraction pedagogy:** valuable but uneven. Several primary PDFs were unavailable; some claims rely on secondary quotations, and the researcher reports catching a fabricated citation from its own extraction tool. Use verified CCSS text and the cross-checked Hamdan citation; independently verify Wu, the Progressions quotation, and any precise causal language before putting them into founding documents.
- **Research Brief 04, product overlap:** useful landscape reconnaissance, not a market audit. Current product features, access requirements, pricing, and the absence of operations need direct verification before becoming durable claims.
- **research-report.md:** the best synthesis of the four briefs because it corrects overreach and records limitations. Its seven headline recommendations nevertheless mix fact and design judgment; confidence labels should not erase those distinctions.

## Reviewer reliability

- **Codex:** most consistently calibrated. It separates internal defects from empirical uncertainty, treats morphing and bridge frequency as prototype questions, and avoids overstating the product scan. High reliability for synthesis.
- **Claude:** strongest research integration and source caveats; it identifies the most consequential distinctions. However, some “High confidence” recommendations—especially making static before/after canonical and requiring a prompt at every bridge—remain design judgments, not directly established findings.
- **Kimi:** strong internal-document analysis and generally honest limitations. Two external conclusions should not be carried forward as facts: that the evidence supports “interleaving follows initial stability,” and that no collection means COPPA is largely irrelevant without a more careful operator/third-party analysis. Its claim that the successful representation research supports transformation rather than co-presence is also more inferential than stated.
- **Gemini:** weakest research reliability. Specific concerns:

  - It attributes to Rau et al. a direct finding that simultaneous co-presence with dynamic linking significantly improves transfer; the research brief says the simultaneous-versus-sequential question was not directly tested.
  - Its Rau citation metadata appears inconsistent with the directly relevant 2015 *Journal of Educational Psychology* study cited elsewhere.
  - It says static graphics or persistent traces “consistently outperform” continuous animation, which overstates meta-analyses that report a small pooled animation advantage with moderators.
  - It calls fixed-coordinate morphing “geometrically impossible”; the real issue is that a fixed screen coordinate can become misleading or require incompatible scale/layout choices, not that it is universally impossible.
  - Its proposed denominator ceilings (\(D\le16/24\)) are invented prototype parameters, not evidence-based thresholds.
  - Its claims that LCM memorization is the primary source of the add-numerators/add-denominators error and that common-unit framing transfers to rational expressions are unsupported overextensions.
  - It treats the number line as the single most effective tool while also claiming the evidence validates deferral to Phase 4; neither follows cleanly from the cited studies.

## Concise conclusion

The synthesis can safely say:

- The curricular core—unit fractions, equivalence as renaming, common denominators as common units, LCD as optional efficiency, and correct-but-unsimplified answers—is standards-aligned and defensible.
- Explicit connection-making between representations has the strongest direct empirical support.
- Prediction-first, early magnitude work, and persistent inspectable states are promising, evidence-informed choices.
- Animation, morphing, bridge frequency, simultaneous full-representation display, prompt format, and precise roadmap timing remain hypotheses requiring bounded prototypes.
- The competitive gap is plausible but not yet verified closely enough to be a load-bearing justification.

The most important evidence-discipline edit is to stop using “research supports” where the record only supports “research motivates testing.”