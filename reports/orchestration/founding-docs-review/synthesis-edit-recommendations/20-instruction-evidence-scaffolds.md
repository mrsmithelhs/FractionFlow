# Instruction, Evidence, Scaffolds, and Content-Path Recommendations

## 1. Scope

This file addresses the bundled cluster of instructional-evidence, scaffold-normalization, representation-bridge, denominator/content-path, and narrow terminology repairs identified in the review synthesis. It proposes specification edits only; it does not amend the founding documents or authorize implementation.

Deep reads:

- `docs/founding/00-principles.md`
- `docs/founding/01-instructional-model.md`
- `docs/founding/02-interaction-grammar.md`
- `docs/founding/03-math-and-content-model.md`
- `docs/founding/04-system-architecture.md`
- `docs/founding/05-quality-and-validation.md`
- `docs/founding/06-roadmap.md`
- `reports/orchestration/founding-docs-review/synthesis.md`
- `reports/orchestration/founding-docs-review/README.md`

Swept only for cross-document effects: `README.md`, `docs/project-seed.md`, `docs/README.md`, `docs/decision-log.md`, and the independent review reports in `reports/orchestration/founding-docs-review/`.

Intentionally outside scope: accessibility acceptance-floor work, static-only authorization and deployment mapping, animation versus static presentation, morphing versus side-by-side comparison, number-line timing, bridge frequency, prompt density, denominator ceilings, session dose, persistence timing, licensing, and any new instructional model or mastery threshold. The proposals preserve the existing mathematical-state → instructional-state → presentation pipeline and leave prototype variables unresolved.

## 2. Recommendation index

| ID | Target | Operation | Recommendation | Evidence status | Owner gate |
|---|---|---|---|---|---|
| 20-01 | `docs/founding/06-roadmap.md` §16/§25 | ADD | State the Phase 2 Stage-E slice's assumed learner/prerequisites and bound what its evidence can establish | ESTABLISHED | wording review |
| 20-02 | `docs/founding/01-instructional-model.md` §18/§26 | ADD | Distinguish supported construction, prediction, and independent transfer; preserve response provenance | ESTABLISHED | wording review |
| 20-03 | `docs/founding/01-instructional-model.md` §16 and `docs/founding/02-interaction-grammar.md` §33 | ADD | Require explicit connection-making at representation bridges while preserving prompt/frequency/density as prototype variables | ESTABLISHED | wording review |
| 20-04 | `docs/founding/02-interaction-grammar.md` §§21–22 | REPLACE + CROSS-REFERENCE | Make the Interaction Grammar the canonical owner of scaffold dimensions and levels; map, rather than merge away, the instructional evidence continuum | ESTABLISHED | wording review |
| 20-05 | `docs/founding/00-principles.md` §2 | REPLACE | Narrow the anti-simultaneity slogan so it protects attention without contradicting purposeful comparisons or symbolic co-presence | ESTABLISHED | wording review |
| 20-06 | `docs/founding/03-math-and-content-model.md` §§11, 59, 68–69 | REPLACE + ADD | Separate mathematically valid, instructionally supported, and representation-renderable denominators, with a safe continuation contract and no fixed ceilings | ESTABLISHED | wording review |
| 20-07 | `docs/founding/03-math-and-content-model.md` §§9, 52, 54–57 | ADD | Define narrow “simplify first” semantics without globally reducing every value or invalidating alternate paths | ESTABLISHED | wording review |
| 20-08 | `docs/founding/03-math-and-content-model.md` §55–§56 and `docs/founding/04-system-architecture.md` §§8–9, 36–37 | ADD | Require authored non-canonical paths to separate mathematical truth from pedagogical preference and to declare bounded coverage/fallback | ESTABLISHED | decision required |
| 20-09 | `docs/founding/05-quality-and-validation.md` §§68–69 | REPLACE | Repair the true-equality example and distinguish transient visual/intermediate states from mathematical equalities | ESTABLISHED | wording review |
| 20-10 | `docs/founding/03-math-and-content-model.md` §§11, 21–22, 61 | REPLACE | Normalize “instructionally preferred denominator” and transient regrouped/mixed-number terminology | ESTABLISHED | wording review |

## 3. Detailed recommendations

### 20-01 — Bound the Phase 2 learner and its evidence

**Target:** `docs/founding/06-roadmap.md` → `# 16. Phase 2 — The First Excellent Episode`

**Operation:** `ADD`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** The roadmap selects a Stage-E family (`2/3 + 1/4`) before the focused Stage A–D families are implemented, but does not say whether Phase 2 participants are expected to know those prerequisites. Without that statement, cold novice testing can be misread as interaction evidence and procedurally fluent testing can be misread as evidence of initial instruction.

**Current anchor/text:** The paragraph after `Phase 2 should implement a single complete learner-facing vertical slice for unlike-denominator proper-fraction addition.` The current text begins, `The first episode should be deliberately narrow.`

**Proposed wording:**

> **Phase 2 learner and evidence boundary**
>
> The first slice is an engineering and instructional prototype for an upper-elementary learner who has encountered, or can demonstrate readiness for, fractional units, simple equivalence, like-denominator addition, and the idea of a common unit. These are the prerequisite concepts represented by Stages A–D in the Instructional Model; Phase 2 does not assume that this slice is a first lesson for a learner with none of them. Before learner observation, record the participant's relevant prior exposure or use a short readiness check that does not teach the target episode.
>
> Evidence from this slice may establish mathematical correctness, representational continuity, interaction comprehensibility, learner agency, error recovery, and supported performance for the stated starting point. It may identify whether the episode is promising for conceptual construction or repair. It cannot by itself establish that a novice can learn the Stage A–E progression from this episode, that performance will persist, that independent transfer has occurred, or that a particular scaffold-fading rule is effective. Those claims require appropriately designed later checks.

**Rationale:** This preserves the deliberately narrow Stage-E engineering slice while making participant selection and inference boundaries auditable. It follows the target-learner distinction in `01-instructional-model.md` §1 and the staged dependency in §§16–19 without forcing an on-ramp into Phase 2.

**Conforming edits:** In §25, append to the exit gate: `The gate should report evidence separately for the stated starting point; it must not be described as proof of novice learning or durable transfer.` In `05-quality-and-validation.md` §52–§53, cross-reference the Phase 2 learner/evidence boundary when child observations are used. In `01-instructional-model.md` §19, add a cross-reference noting that the roadmap may prototype a later conceptual stage before all earlier families are productized.

**Preserves:** The Stage-E family, the first-slice purpose, the upper-elementary and conceptual-repair target, and the existing Phase 2 exit gate. It does not choose a diagnostic flow, reorder the roadmap, or claim efficacy.

**Conflicts or dependencies:** Depends on owner agreement about the words “readiness check” and the intended Phase 2 participant pool. It overlaps with accessibility and child-usability recommendations but does not resolve them.

**Verification:** Search for `Phase 2`, `first slice`, and `first excellent episode`; confirm each occurrence distinguishes engineering/usability evidence from novice-learning, persistence, or transfer claims. Confirm no new prerequisite numeric threshold appears elsewhere.

### 20-02 — Name evidence types and preserve response provenance

**Target:** `docs/founding/01-instructional-model.md` → `# 18. Explanation Without Excessive Verbal Burden`

**Operation:** `ADD`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** The current evidence list mixes an answer constructed with visible support, a prediction before demonstration, and an uncued transfer response. The canonical episode also permits entering `8/12` and `3/12` after subdivision is visible, while the fading rules later refer to “successful independent attempts” without requiring the record to show what support preceded them.

**Current anchor/text:** Immediately after `The learner's mathematical actions can themselves provide evidence of understanding.`

**Proposed wording:**

> Evidence should be labeled by the responsibility actually completed:
>
> - **supported construction:** the learner constructs or selects a valid state while the relevant representation, cue, supplied value, or help layer remains available;
> - **prediction:** the learner commits to a consequence before the corresponding transformation or answer is revealed;
> - **independent transfer:** the learner applies the underlying relationship in a changed representation, problem structure, or reduced-support condition without the target answer being made available first.
>
> These categories are complementary, not interchangeable. Supported construction can show that the learner can act on a visible relationship; prediction can show anticipation of a consequence; independent transfer can show that the relationship is available beyond the demonstrated path. A correct final answer alone does not identify which evidence occurred.
>
> When learner evidence is reviewed, preserve response provenance in plain terms: what was visible or supplied before the response, whether the learner had predicted before demonstration, whether help or replay was used, whether the response followed a correction or retry, and whether the task was a stable-practice, bridge, or reduced-support task. This is an evidence-description contract, not a required event schema or a mastery threshold.

**Rationale:** The distinction is directly supported by the existing prediction, transfer, scaffold-leakage, and independent-attempt language. Provenance prevents a supported count-after-reveal from being reported as prediction or an inherited bridge endpoint from being reported as uncued transfer.

**Conforming edits:** In `02-interaction-grammar.md` §75, label the highly supported equivalent-numerator step as `supported construction` and the advanced entry as `reduced-support` or `independent` only when its actual prior support satisfies the definition. In `05-quality-and-validation.md` §§17–19 and §103, require reviewers to record the evidence type and preceding support when judging learner responsibility or scaffold leakage. In `06-roadmap.md` §47, replace bare `successful independent attempts` with `successful independent attempts whose preceding support and response provenance are known`.

**Preserves:** Existing evidence examples, agency-preserving support, and the principle that explanation need not be lengthy. It does not set attempt counts, reveal timing, prompt density, or fading thresholds.

**Conflicts or dependencies:** The exact storage/telemetry representation remains an architecture decision; this proposal specifies the language reviewers need, not a data model. Overlaps with 20-01 and 20-03.

**Verification:** Search for `independent`, `prediction`, `transfer`, `successful`, `help`, and `replay`; confirm claims about independence are accompanied by a provenance condition and that supported performance is not silently relabeled.

### 20-03 — Make bridge connection-making explicit

**Target:** `docs/founding/01-instructional-model.md` → `# 16. Stable Practice and Bridge Experiences`

**Operation:** `ADD`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** The documents say that bridges connect representations and preserve an invariant, but do not make learner connection-making an explicit responsibility. A transition can therefore be visually polished while the learner merely watches it.

**Current anchor/text:** After `This balance supports both fluency and flexible understanding.`

**Proposed wording:**

> A bridge should include an explicit opportunity for the learner to make the correspondence, such as identifying, predicting, matching, placing, or otherwise stating what remains the same and what has changed. The learner should not receive credit for independent transfer solely because the system displayed two views or completed a transition. The exact prompt form, timing, frequency, and density remain prototype variables to be tested in the Interaction Grammar and validated against the evidence contract.

**Rationale:** This repairs the gap identified in the synthesis while retaining the existing “occasional bridge” and one-focal-idea commitments. It requires connection-making, not a particular prompt, layout, animation, or schedule.

**Conforming edits:** In `02-interaction-grammar.md` §33, replace the opening paragraph with: `A bridge episode should make the learner's correspondence-making observable and should make explicit what remains invariant.` Add the same prototype-variable sentence after the `Same amount. New view.` example. In `06-roadmap.md` §34, change `ask one concise transfer question` to `provide one explicit learner connection-making opportunity`; retain the current example as illustrative rather than mandatory. In `05-quality-and-validation.md` §102, add a check that the learner has an observable correspondence responsibility.

**Preserves:** The current bar/number-line example, stable practice, occasional bridges, and unresolved timing/frequency/density questions. It does not decide animation, side-by-side display, or number-line timing.

**Conflicts or dependencies:** Depends on 20-02's evidence labels. Any proposal to set bridge frequency or a mandatory prompt format is intentionally unresolved.

**Verification:** Search for `bridge`, `transfer`, and `same amount`; confirm every normative bridge description names a learner connection-making opportunity while leaving frequency and exact prompt mechanics open.

### 20-04 — Normalize scaffold ownership and map the evidence continuum

**Target:** `docs/founding/02-interaction-grammar.md` → `# 21. Scaffolding Is a Set of Independent Supports` and `# 22. Support Should Fade Within Familiar Interaction Patterns`

**Operation:** `REPLACE + CROSS-REFERENCE`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** Scaffold dimensions and support levels appear in the Principles, Interaction Grammar, Instructional Model, Roadmap, and Validation documents with slightly different labels. The result risks treating “high/medium/low/independent,” “highly guided/partially guided/independent,” and “supported understanding → independent symbolic work” as competing models.

**Current anchor/text:** The complete `# 21` examples and the four level headings under `# 22` in `02-interaction-grammar.md`.

**Proposed wording:**

> The Interaction Grammar is the canonical owner of the names and operational examples for episode support dimensions and support levels. Its support dimensions are independent axes; a level label is a concise description of the current combination, not a single global difficulty setting. The canonical labels for this document are **high support**, **medium support**, **low support**, and **independent**.
>
> Other founding documents should use these labels when referring to an episode's support state. The Instructional Model owns the learner-facing meaning of evidence and growing independence; it may describe a continuum from supported construction through prediction and independent transfer, but it should not redefine the Interaction Grammar's level names. The Roadmap owns when support capability is built, and Quality and Validation owns how support behavior and leakage are tested. None of these mappings creates a new instructional stage or implies that every learner moves through the labels in a fixed order.

**Rationale:** `00-principles.md` §26 already requires canonical ownership. This mapping preserves the existing independent-support model and the instructional evidence continuum while preventing list drift and accidental invention of a new ladder.

**Conforming edits:** In `01-instructional-model.md` §20, replace `highly guided / partially guided / independent` with `high support / medium support / low support / independent (see the Interaction Grammar)` where scaffold level is listed. In `06-roadmap.md` §46, add `(canonical operational labels: high support, medium support, low support, independent)` and cross-reference §22. In `05-quality-and-validation.md` §§22 and 103, state that each Interaction Grammar support dimension is tested independently and that evidence labels are not scaffold-level synonyms. In `00-principles.md` §6, retain the examples but add `Operational names and episode combinations belong to the Interaction Grammar.`

**Preserves:** Independent supports, optional help, return of support, learner-specific variation, and the existing conceptual progression. It does not choose adaptive rules or collapse evidence into a scalar score.

**Conflicts or dependencies:** Requires the owner to accept the four existing Interaction Grammar labels as canonical. If the owner wants different labels, that is a decision-required rename across all conforming edits.

**Verification:** Search all founding docs for `highly guided`, `partially guided`, `medium support`, `low support`, `supported understanding`, and `independent`; confirm labels are either canonical Interaction Grammar terms or explicitly identified as evidence/progression language.

### 20-05 — Narrow the anti-simultaneity slogan

**Target:** `docs/founding/00-principles.md` → `# 2. One Focal Idea at a Time`

**Operation:** `REPLACE`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** The bold sentence can be read as contradicting the same paragraph's permission to juxtapose representations for a defined comparison and the Interaction Grammar's requirement that symbolic notation participate in the narrative.

**Current anchor/text:** `**Multiple representations does not mean simultaneous representations.**`

**Proposed wording:**

> **Multiple representations do not require simultaneous competing full views.**

**Rationale:** This retains the attention and calmness rule while distinguishing competing parallel presentations from a purposeful bridge, symbolic co-presence, or one clearly defined comparison. It is an editorial repair, not a decision for or against side-by-side or animated presentation.

**Conforming edits:** In `02-interaction-grammar.md` §11, retain the one-primary-action rule but replace any implication that a secondary representation cannot remain available with `Secondary views may be present when they serve the current comparison and do not create a competing task.` In `04-system-architecture.md` §§19–22, use `competing workflow` rather than `simultaneous representation` when describing renderer boundaries. In `01-instructional-model.md` §15, retain transfer as a deliberate task.

**Preserves:** One focal question, calm design, purposeful transitions, and unresolved representation mechanics. It does not settle animation versus static, morphing versus side-by-side, or bridge density.

**Conflicts or dependencies:** None identified beyond the explicit overlap with future representation-prototype decisions.

**Verification:** Search for `simultaneous`, `side-by-side`, `juxtapose`, `competing`, and `one primary`; confirm no absolute sentence forbids a deliberate comparison or symbolic co-presence.

### 20-06 — Add a denominator validity/support/renderability contract

**Target:** `docs/founding/03-math-and-content-model.md` → `# 11. Least Common Denominator` and `# 59. Common-Denominator Validation`

**Operation:** `REPLACE + ADD`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** The math model distinguishes valid, least, and pedagogically convenient denominators, and the architecture distinguishes representation eligibility, but the learner-facing behavior when a value is mathematically valid yet unsupported by the current episode or renderer is not explicit. A valid answer must not be called mathematically wrong merely because the current path cannot display it.

**Current anchor/text:** The list under `# 11` ending in `pedagogically convenient denominator`, plus `# 59` paragraphs `The system should therefore distinguish` and `Instructional policy may decide how broad a range to accept.`

**Proposed wording:**

> FractionFlow should distinguish three questions about a proposed denominator or resulting state:
>
> 1. **Mathematical validity:** does the denominator satisfy the exact divisibility/equivalence rules and preserve quantity?
> 2. **Instructional support:** is this state admitted by the current episode, authored path, and current learner responsibility?
> 3. **Representation renderability:** can the selected representation show this valid state clearly and accessibly under its reviewed capability?
>
> These questions must not be collapsed. A state may be mathematically valid but outside the current episode's supported path, or valid and supported mathematically but ineligible for the selected renderer. In either case, learner-facing behavior must preserve the distinction: acknowledge mathematical validity when known, explain that the current activity or view cannot continue with that state, and offer a reviewed continuation such as an eligible representation, a bounded alternate path, or a return to symbolic work. It must not label the mathematics incorrect, silently coerce the value, or pass an ineligible state to a renderer.
>
> Exact acceptance ranges and representation thresholds remain representation- and prototype-specific validation outputs; this contract does not set fixed ceilings.

**Rationale:** This joins the existing exact validation (§59), representation eligibility (§§68–69), and architecture capability contract without inventing numeric limits. It gives the learner a safe, non-shaming continuation and keeps the renderer from becoming a second mathematics engine.

**Conforming edits:** In `04-system-architecture.md` §§8, 47–48, add `mathematical validity`, `instructional support`, and `representation eligibility` as separate pre-render checks. In `02-interaction-grammar.md` §39 and §46, specify that unsupported-but-valid input receives a reviewed continuation rather than an incorrect-answer message. In `05-quality-and-validation.md` §66, test valid/noncanonical, unsupported, and non-renderable cases separately.

**Preserves:** Non-least common denominators, local-only/static architecture, representation-specific feasibility, exact thresholds deferred to validation, and no fixed denominator ceiling.

**Conflicts or dependencies:** Requires an owner-approved wording for what continuation options are available in the first implementation; the proposal does not choose one. Overlaps with any separate accessibility-floor recommendation.

**Verification:** Search for `valid`, `supported`, `eligible`, `render`, and `unsupported`; confirm every rejection path identifies which of the three questions failed and that no fixed ceiling has been added.

### 20-07 — Define narrow “simplify first” semantics

**Target:** `docs/founding/03-math-and-content-model.md` → `# 9. Canonical Numerical Value and Display Form Are Distinct`

**Operation:** `ADD`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** The documents correctly separate numerical value, current form, and preferred final form, but a “simplify first” strategy can be read either as a local accepted transformation or as a global requirement that all operands always be reduced. That ambiguity matters for denominator relationships and alternate valid paths.

**Current anchor/text:** After `The system must therefore never silently simplify every fraction merely because a simpler form exists.`

**Proposed wording:**

> If an episode explicitly offers or requests **simplify first**, that phrase means: apply a learner-visible, exact equivalence transformation to the specified operand or intermediate state before the next instructional step. It does not mean that every operand or intermediate value must be globally reduced, nor that a non-simplified current form is invalid. The instructional state should retain both the exact value and the learner-established current form so later denominator relationships are evaluated from the state actually being used. A simplification may be preferred for the episode while alternate exact paths remain mathematically valid unless the episode's stated responsibility intentionally constrains the path.

**Rationale:** This is the narrowest repair consistent with §§9, 52, and 54–57: it prevents accidental global reduction while making a deliberate local strategy inspectable. It does not prescribe whether a particular future episode should offer simplify-first.

**Conforming edits:** In `03-math-and-content-model.md` §52, replace `This avoids introducing unnecessary ambiguity about whether simplification should occur before the target skill.` with `This avoids introducing ambiguity unless the episode explicitly makes simplification part of the target skill.` In `04-system-architecture.md` §§14–15, add that learner-established current form is preserved after an accepted simplify-first transformation. In `05-quality-and-validation.md` §§14 and 65, test a local simplify-first path alongside an unsimplified but exact path.

**Preserves:** Exact value, current-form/preferred-form separation, correct unsimplified answers, and multiple valid solution paths. It does not require all values to be reduced.

**Conflicts or dependencies:** The episode-level decision to offer simplify-first remains a content/owner choice. It must not be inferred from this wording.

**Verification:** Search for `simplify first`, `silently simplify`, `current form`, and `preferred final form`; confirm every simplify-first use is local and explicit rather than global.

### 20-08 — Govern authored non-canonical paths without changing mathematical truth

**Target:** `docs/founding/03-math-and-content-model.md` → `# 55. Canonical Instructional Path`

**Operation:** `ADD`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `decision required`

**Problem:** The math model says canonical does not mean uniquely valid and recognizes non-least denominators, while the architecture requires reusable authored episodes. It does not yet state how a curated path may teach one preferred route without implying that authored hints and feedback cover every valid route.

**Current anchor/text:** After `Canonical does not mean uniquely valid.`

**Proposed wording:**

> An authored path is a pedagogical selection layered over mathematical truth. Its prompts, transformations, hints, and expected intermediate states must declare whether they are: (a) required mathematical conditions, (b) the canonical route the episode explains, or (c) optional support for that route. A non-canonical mathematically valid response must be validated by the Math and Content Model independently of whether the authored path has a matching explanation.
>
> For each authored episode, content review must state the covered valid paths and the behavior for a valid path outside that coverage: continue with a generic exact response, switch to a reviewed alternate path, offer a supported continuation, or defer the state with an explicit learner-facing explanation. The episode may intentionally teach one path, but it must not turn missing authored coverage into a claim that the alternate mathematics is wrong.

**Rationale:** This makes the separation in §54 operational and aligns with architecture §§8–9 and 36–37. It is a bounded coverage contract, not a requirement to author the full cross-product of paths.

**Conforming edits:** In `04-system-architecture.md` §36, add `covered valid paths and reviewed fallback behavior` to episode-definition information. In §37, clarify that reuse applies across valid instances while path coverage may be parameterized. In `05-quality-and-validation.md` §§12–14 and §66, require one covered canonical case and one valid non-canonical case for each adopted path policy. In `02-interaction-grammar.md` §52, ensure hints do not imply that a canonical hint is the only valid route.

**Preserves:** Canonical reproducibility, exact validation, alternate common denominators, and the distinction between content and logic. It does not make every alternate path a required instructional route.

**Conflicts or dependencies:** `decision required` for the fallback policy adopted by a given episode family; this proposal enumerates choices but does not select one. Overlaps with 20-06.

**Verification:** Search for `canonical`, `alternate`, `valid path`, `fallback`, and `unsupported`; confirm no authored prompt equates canonical with mathematically valid and every adopted episode records its coverage boundary.

### 20-09 — Repair equality and transient-state wording

**Target:** `docs/founding/05-quality-and-validation.md` → `# 68. Symbolic Equality Must Be Truthful` and `# 69. Temporary Visual States Must Not Teach False Equality`

**Operation:** `REPLACE`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** The current example `2/3 + 1/4 = 8/12 + 1/4` is mathematically true, so presenting it as a sequence that must never appear undermines the equality rule. The following section also needs to distinguish a temporary geometric transition from an intermediate mathematical form rather than implying every transient visual is a mathematical equality.

**Current anchor/text:** The displayed equation under §68 and the opening paragraph under §69.

**Proposed wording:**

> Visual and symbolic review should ensure that the interface never displays a **false stable equality**, such as:
>
> \[
> \frac23+\frac14=\frac8{12}+\frac4{12}
> \]
>
> when the second term has not yet been converted. The equality shown here is false because the right-hand side is \(1\), while the left-hand side is \(11/12\); layout should make each accepted intermediate state explicit.
>
> A temporary visual transition may depict motion between accepted states, but it should not be labeled or laid out as a stable mathematical equality until the corresponding state has been established. If an in-between graphic is not itself a mathematical state, use layout, annotation, or sequencing that makes that status clear.

**Rationale:** The current example is true because changing \(2/3\) to \(8/12\) preserves its value. The replacement is false because \(8/12 + 4/12 = 1\), not \(11/12\). The rule is about false equalities and ambiguous sequencing, not about forbidding a true one-operand conversion.

**Conforming edits:** Replace the current §68 text with the corrected equation and explanatory paragraph above. In §69, use `temporary visual transition` and `accepted intermediate mathematical state` consistently. In `03-math-and-content-model.md` §§19–22 and §61, use `intermediate regrouped state` for a learner-established transformation and reserve `mixed-number form` for a valid representation with a whole-number part and proper fractional part.

**Preserves:** The requirement that equal signs be truthful, stable post-animation states, and exact equality validation. It does not settle animation choreography.

**Conflicts or dependencies:** This recommendation overlaps 20-10's terminology repair; apply the equality repair and terminology repair together so “temporary” does not imply “mathematically false.”

**Verification:** Evaluate every equality in the replacement text exactly. Search §68 for `2/3 + 1/4`; confirm the true equality is not prohibited and the false example is actually false. Search for `temporary`, `intermediate`, `regrouped`, and `mixed-number` to confirm terms are used consistently.

### 20-10 — Normalize preferred-denominator and regrouping terminology

**Target:** `docs/founding/03-math-and-content-model.md` → `# 11. Least Common Denominator`, `# 21. Decomposition During Mixed-Number Subtraction`, and `# 61. Mixed-Number Equivalence Validation`

**Operation:** `REPLACE`

**Evidence status:** `ESTABLISHED`

**Owner gate:** `wording review`

**Problem:** `Pedagogically convenient denominator` is listed without a durable definition and duplicates the already defined notion `instructionally preferred`. Separately, “regrouped or converted form” can blur an intermediate learner-established state with a final mixed-number representation.

**Current anchor/text:** The §11 list item `pedagogically convenient denominator`; §61 sentence `Any regrouped or converted form should be validated by exact equality with the original quantity.`

**Proposed wording:**

> Replace the §11 list with:
>
> - **valid common denominator**;
> - **least common denominator**;
> - **instructionally preferred denominator** (the denominator selected because it best serves the current learning target, representation, or authored path; it remains mathematically valid but is not a separate kind of mathematical truth).
>
> Replace the §61 sentence with:
>
> `Any proposed mixed-number form, improper-fraction conversion, or intermediate regrouped state should be validated by exact equality with the original quantity. The validation must preserve the distinction between a transient instructional state and the preferred final display form.`

**Rationale:** The first replacement removes an undefined synonym and points to the existing §26 taxonomy. The second makes the validation target precise without changing any arithmetic or representation policy.

**Conforming edits:** In `03-math-and-content-model.md` §26, add `See §11 for the denominator-specific application of “instructionally preferred.”` In §22, retain `composition` and `decomposition` as the canonical classifications and state that `regrouping` is the umbrella process. In `02-interaction-grammar.md` §48, use `intermediate regrouped state` when describing the transition and `mixed-number form` for its settled representation.

**Preserves:** Existing composition/decomposition semantics, exact equality, and preferred-final-form distinction. It does not choose terminology for learner-facing copy beyond these specification labels.

**Conflicts or dependencies:** None identified beyond 20-09's adjacent validation wording.

**Verification:** Search for `pedagogically convenient`, `instructionally preferred`, `regrouped form`, and `mixed-number form`; confirm the undefined phrase is gone and the same terms distinguish process, intermediate state, and final representation.

## 4. Deferred or rejected changes

- Fixed denominator ceilings, bridge frequency, prompt frequency, prompt density, and number-line timing: deferred as prototype variables; no numeric or schedule requirement is proposed here.
- Animation versus static presentation, morphing versus side-by-side comparison, and any claim that one is instructionally superior: deferred pending matched prototypes.
- A mandatory bridge prompt format or generated explanation: deferred; 20-03 requires observable connection-making but leaves form open.
- A new “evidence ladder” or instructional stage: rejected; 20-04 maps existing support labels and evidence categories without adding a model.
- Treating the Phase 2 slice as a universal first lesson, or requiring a diagnostic onboarding flow: rejected as scope expansion; 20-01 bounds the claim instead.
- Globally simplifying every operand before every operation: rejected; 20-07 defines only an explicit local simplify-first strategy.
- Requiring authored coverage for every mathematically valid non-canonical path: rejected as disproportionate; 20-08 requires declared coverage and safe fallback only.
- Gap-thinking and tick-counting remain plausible misconception candidates, but no founding-document edit is presently recommended: defer them pending discriminating task evidence and an owner decision.
- Accessibility minimum-mode acceptance, static-only authorization, and deployment-spike mapping: inspected for overlap but intentionally left to their own recommendation clusters.

## 5. Suggested application order

1. Apply 20-09 and 20-10 first so equality and terminology are stable before other edits quote them.
2. Apply 20-06 and 20-07 to establish the mathematical distinctions among exact value, current form, preferred form, validity, support, and renderability.
3. Apply 20-08 and resolve the episode-family fallback policy before authoring non-canonical hints or alternate paths.
4. Apply 20-04 to normalize scaffold labels and ownership; then update the conforming references in the Instructional Model, Roadmap, Principles, and Validation documents.
5. Apply 20-02 and 20-03 together so evidence labels and bridge connection-making use the same provenance language.
6. Apply 20-01 and update the Phase 2 exit wording after the evidence contract is in place.
7. Apply 20-05 as a small principles-level wording repair, then run the cross-document simultaneity search.
8. Route 20-08 through an explicit owner decision; the other edits can receive wording review, but none should be treated as implementation authorization.

After editing, run exact-equality checks for every revised mathematical example, search for superseded scaffold and denominator terminology, and inspect the full set for preserved unresolved prototype variables. The recommendations should be accepted as a coherent evidence/content contract; do not silently accept only the most convenient portions of 20-02, 20-03, and 20-04 while retaining the old ambiguous labels.
