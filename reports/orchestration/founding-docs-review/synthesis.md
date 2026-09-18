# FractionFlow Founding Documents — Review Synthesis

This synthesis is advisory. It weighs four mutually blind reviews and one research package against the founding text. It does not treat reviewer agreement as proof, and it does not treat a solitary finding as weak merely because the other reviewers missed it.

The most important distinction across the record is between an **internal-text defect** and an **untested design hypothesis**. The founding set has several real wording, ownership, and acceptance-contract gaps. It does **not** have evidence that animation fails, that simultaneous representations are generally superior, that bars should be displaced by number lines, or that the proposed interaction is instructionally effective. Those questions still require a working slice.

## 1. Sources synthesized

All files below were read completely. Founding-document passages carrying major findings were checked against the source text rather than accepted from reviewer paraphrases.

- `reports/orchestration/founding-docs-review/founding-docs-review-prompt.md` — common brief for all reviewers; supplied the same review angles, examples of false success, and required structure, so it is also evidence of likely common-mode convergence.
- `reports/orchestration/founding-docs-review/review-claude.md` — independent adversarial review with extensive external research integration and twelve numbered findings; strongest on breadth and research caveats, but sometimes converts indirect evidence into a confident redesign.
- `reports/orchestration/founding-docs-review/review-codex.md` — independent adversarial review with five selective findings, explicit deep/swept/not-covered boundaries, and small arithmetic checks; generally the most conservative about mitigations and prototype uncertainty.
- `reports/orchestration/founding-docs-review/review-gemini.md` — independent adversarial review with eight numbered findings and web research; useful for surfacing implementation stress points, but several severities and causal claims exceed the cited evidence.
- `reports/orchestration/founding-docs-review/review-kimi.md` — independent adversarial review with twelve numbered findings and selective research; strong on internal normalization and roadmap questions, with some recommendations that expand beyond the demonstrated gap.
- `reports/orchestration/founding-docs-review/research-report.md` — Claude's editorial synthesis of four delegated research briefs; not an independent fifth review, because it was commissioned by and used in `reports/orchestration/founding-docs-review/review-claude.md`.
- `reports/orchestration/founding-docs-review/research/01-animation-vs-static-graphics.md` — desk-research brief on animation, transience, prediction, and fraction-specific evidence; explicitly reports no direct fraction animation-versus-static comparison and flags domain-transfer limits.
- `reports/orchestration/founding-docs-review/research/02-multiple-representations.md` — desk-research brief on simultaneous/sequential representations and connection-making; the most directly applicable research brief, while explicitly distinguishing across-problem interleaving from same-screen co-display.
- `reports/orchestration/founding-docs-review/research/03-fraction-pedagogy.md` — desk-research brief on number lines, common units, LCD, misconceptions, and simplification; useful but uneven because several primary PDFs were unavailable and one bad citation extraction had to be caught and corrected.
- `reports/orchestration/founding-docs-review/research/04-existing-product-overlap.md` — documentation-based competitive survey; useful reconnaissance, but not hands-on validation of several JavaScript-rendered tools and subject to feature, access, and pricing drift.
- `docs/founding/00-principles.md` — verified project principles, scope language, representation rules, accessibility commitments, privacy posture, and document-ownership rules.
- `docs/founding/01-instructional-model.md` — verified conceptual progression, representation roles, misconception model, evidence continuum, fading rules, and target-learner statements.
- `docs/founding/02-interaction-grammar.md` — verified episode beats, transformation rules, scaffold dimensions, accessibility behavior, canonical episode, bridge, help, and fading examples.
- `docs/founding/03-math-and-content-model.md` — verified exact-math definitions, denominator rules, current-form/value distinctions, alternate paths, generation constraints, error classification, representation feasibility, and canonical examples.
- `docs/founding/04-system-architecture.md` — verified static-first boundary, expanded pipeline, conceptual layers, scene/render separation, persistence model, accessibility semantics, and bridge data flow.
- `docs/founding/05-quality-and-validation.md` — verified invariants, false-success defenses, accessibility gates, representation limits, child review, alternate-path validation, representation switching, and durable validation-asset rules.
- `docs/founding/06-roadmap.md` — verified phase sequence, first-slice purpose, Phase 2 exit gate, Phase 3 breadth, Phase 4 number lines, Phase 6 fading, Phase 8 persistence, Phase 9 integration, and stretch services.
- `README.md` — light context for the public-repository, no-tracking, account-free, static-site posture.
- `docs/project-seed.md` — light but authoritative context for the static-only defining constraint, proposed structure, separation rule, first-episode spike, and GitHub Pages deployment spike.

## 2. Convergent findings

### 2.1 The accessibility commitment lacks a sufficiently explicit acceptance floor

**Raised by:** Claude, Codex, Gemini, and Kimi.  
**Evidence status:** **Established** as a specification gap; particular alternative interactions remain **Judgment** pending prototypes.  
**Convergence assessment:** Mixed. Accessibility was heavily primed by the shared prompt, but the reviewers found distinct concrete gaps.

`docs/founding/00-principles.md` §17 qualifies screen-reader interpretation with "where feasible." `docs/founding/05-quality-and-validation.md` §38 similarly uses "where reasonably feasible," while `docs/founding/06-roadmap.md` §25 requires the first slice to work through the "intended access modes" without naming a minimum set. At the same time, `docs/founding/02-interaction-grammar.md` §72 and `docs/founding/05-quality-and-validation.md` §§40–44 correctly require alternatives to preserve learner responsibility rather than reveal the answer.

The verified gap is not that FractionFlow is already inaccessible. It is that two implementers could choose materially different completion standards: one could require a complete agency-preserving path through keyboard, non-drag touch, reduced motion, and screen-reader use; another could treat labels plus keyboard-operable controls as sufficient.

The founding set should name the minimum first-slice access modes and make one complete accessible episode an early feasibility gate. It should not preselect Gemini's sonification proposal, assume keyboard stepping solves a single-pointer requirement, or claim that every access mode must reproduce identical sensory evidence. The acceptance question is whether each mode preserves the intended mathematical responsibility.

### 2.2 The first Stage-E slice needs an explicit learner-prerequisite and evidence contract

**Raised by:** all four reviewers.  
**Evidence status:** The sequence is **Established**; the predicted usability confound is **Plausible**.  
**Convergence assessment:** Mostly independent observation within a prompt-primed area.

`docs/founding/01-instructional-model.md` §19 orders Stage A magnitude, Stage B equivalence, Stage C like-denominator operations, and Stage D nested-denominator work before Stage E, where both operands need renaming. `docs/founding/06-roadmap.md` §7 deliberately chooses the Stage-E-like family `2/3 + 1/4` as the first deep implementation, while the focused prerequisite families arrive in Phase 3.

That is not inherently a bad engineering slice. The roadmap calls it the first **deep implementation**, not the first curriculum lesson for every child, and `docs/founding/01-instructional-model.md` §1 includes conceptual-repair learners who may already know procedures. The gap is what Phase 2 learner observation is allowed to prove. Testing a prerequisite-naive learner cold could confound interaction difficulty with missing instruction; testing only procedurally fluent learners cannot establish that the episode teaches novices.

The narrow repair is to state the assumed learner for the slice, screen or document participant prerequisites, and distinguish interaction/usability evidence from instructional-sequence evidence. Adding a tiny equivalence on-ramp is an option, not a review-mandated scope expansion.

### 2.3 The evidence model does not yet cleanly distinguish supported performance from independent reasoning

**Raised by:** all four reviewers, through different examples.  
**Evidence status:** **Established** that response provenance is underspecified; the magnitude of the learning risk is **Plausible**.  
**Convergence assessment:** Strong common-mode risk because the common prompt explicitly named answer-revealing visuals, guessing, choreography learning, and false fluency.

Codex's canonical-example reading is the most useful formulation. In `docs/founding/02-interaction-grammar.md` §75, the learner may enter equivalent numerators only after subdivision into twelfths is visible. Counting eight and three selected twelfths is valid supported work, but it is not the same evidence as predicting those numerators before the transformation. In §76, an inherited endpoint can make placement perceptually available without proving fresh transfer. Claude and Kimi add the attempt-history problem: constrained-choice success after retries can enter a fading decision without being first-attempt evidence. Gemini adds the risk of ritual prediction prompts and prompt fatigue.

The documents already recognize scaffold leakage in `docs/founding/05-quality-and-validation.md` §19 and warn that bridges must test transfer in §58. What is missing is evidence provenance: whether an answer preceded or followed reveal, whether a hint or replay was used, how many attempts occurred, and whether the task was cued construction, prediction, or uncued transfer. Exact mastery thresholds and prompt counts belong to prototyping.

### 2.4 Valid mathematics, supported input, and renderable input need one learner-facing contract

**Raised by:** Claude, Codex, and Gemini.  
**Evidence status:** **Established** clarification gap; hard numeric limits are **Judgment**.  
**Convergence assessment:** Strong prompt echo; Codex's mitigation analysis is important.

`docs/founding/03-math-and-content-model.md` §56 and `docs/founding/05-quality-and-validation.md` §66 require supported noncanonical denominators to remain mathematically correct throughout the subsequent work. But `docs/founding/03-math-and-content-model.md` §§59 and 68, `docs/founding/04-system-architecture.md` §§47–48, and `docs/founding/05-quality-and-validation.md` §§7 and 46 already allow instructional input bounds and representation-specific feasibility limits. The specifications therefore do **not** require every positive multiple to be accepted or every accepted denominator to be rendered as a literal bar.

The residual gap is learner-facing behavior. If a denominator is mathematically valid in the relevant path but unsupported in the current episode or unreadable in the current representation, the interface must not label it mathematically wrong. It needs a clear continuation: a bounded supported alternative, a symbolic continuation, a representation change, or another reviewed policy.

Gemini's suggested desktop/mobile ceilings of 24 and 16 are invented prototype values, not evidence. Exact thresholds should remain outputs of responsive and accessibility testing.

### 2.5 The anti-simultaneity slogan is more absolute than its controlling paragraph

**Raised by:** Claude, Gemini, and Kimi; Codex supplied the counter-reading.  
**Evidence status:** **Established** wording ambiguity, not an established behavioral contradiction.  
**Convergence assessment:** Strong common-mode echo; the shared prompt specifically asked whether the preference against simultaneous representations went too far.

`docs/founding/00-principles.md` §2 says representations should not **ordinarily compete** for attention and expressly permits the system to "deliberately juxtapose them for one clearly defined comparison." It then ends with the bold slogan, "Multiple representations does not mean simultaneous representations." Elsewhere, `docs/founding/02-interaction-grammar.md` §§19 and 44 require symbolic notation to remain connected with a focal visual, and `docs/founding/04-system-architecture.md` §22 correctly calls symbols a representation.

The paragraph already contains the intended design: one focal mathematical question, no uncontrolled parallel competition, symbolic co-presence when useful, and deliberate comparison when it serves one defined purpose. The bold sentence can be quoted out of context and should be narrowed. The reviews do not establish that full visual representations should generally be side by side.

### 2.6 Animation and morphing are hypotheses, not validated active ingredients

**Raised by:** all four reviewers, but with incompatible remedies.  
**Evidence status:** **Established** that direct evidence is absent; claims that animation should be canonical, optional, or replaced are **Judgment**.  
**Convergence assessment:** Very strong common-mode echo because the prompt repeatedly foregrounded animation, transience, anchors, and side-by-side alternatives.

The research package found small, heterogeneous general animation effects and no controlled fraction-specific comparison of animated subdivision with a static before/after condition. It also found no direct bar-to-number-line morph versus juxtaposition study. The directly relevant multiple-representation research supports explicit connection-making; it does not select morphing, sequential replacement, or simultaneous full-representation display.

Claude therefore overreaches when it calls a prediction-plus-static-pair redesign "evidence-backed" as a complete replacement. Gemini overreaches further by calling the fixed-anchor bridge a critical geometric impossibility. Kimi and Codex are better calibrated: retain the hypothesis, require inspectable and reduced-motion paths, and test it.

The first slice should compare matched conditions: same prediction prompt, same content, same learner control, and the same final inspectable state. Compare animated subdivision with static/key-frame comparison; later compare morph, deliberate juxtaposition, and sequential swap with an explicit connection-making prompt and an uncued transfer task.

### 2.7 Scaffold vocabulary and ownership are already drifting

**Raised by:** Claude and Kimi directly; Gemini raised broader duplication.  
**Evidence status:** **Established**.  
**Convergence assessment:** Moderately independent; the shared prompt asked about normalization, but the exact list differences are concrete.

`docs/founding/00-principles.md` §6 lists eight scaffold dimensions, `docs/founding/02-interaction-grammar.md` §21 lists twelve, and `docs/founding/06-roadmap.md` §46 lists nine. `docs/founding/01-instructional-model.md` §26 defines an evidence continuum while `docs/founding/02-interaction-grammar.md` §22 defines a support-provision ladder; those are defensibly different axes, but the documents do not say so.

This is the clearest demonstrated normalization defect. `docs/founding/02-interaction-grammar.md` should own the scaffold dimensions and reachable support profiles. `docs/founding/00-principles.md` and `docs/founding/06-roadmap.md` should reference that owner instead of maintaining independent lists. `docs/founding/01-instructional-model.md` should own what the learner's evidence means; `docs/founding/02-interaction-grammar.md` should own what support is presented. Claude's further claim that all theoretical combinations must be reachable is not established by the documents.

### 2.8 Persistence has opposing failure modes that need an explicit later-phase identity policy

**Raised by:** all four reviewers in some form.  
**Evidence status:** The missing identity/reset semantics are **Established**; the prevalence of ephemeral school profiles is **Speculation** in this record; moving persistence earlier is **Judgment**.  
**Convergence assessment:** Mixed and useful: reviewers identified both state loss and state contamination.

One learner may lose local progress when browser data is cleared; another may inherit somebody else's faded scaffolds on a shared device. `docs/founding/04-system-architecture.md` §§28–31 correctly makes progress optional and persistence an adapter. `docs/founding/06-roadmap.md` intentionally proves within-session fading and composition before returning-learner continuity in Phase 8.

The earlier phases are not logically untestable without persistence: fading and mixed retrieval can be observed in controlled sessions. The documents should nevertheless say whether each gate is within-session or cross-session and preserve "whose evidence is this?" as a Phase 8 design question. Gemini's portable URL/passphrase proposal is a new privacy, integrity, and usability surface, not a necessary fix.

### 2.9 Magnitude is foundational, but the evidence does not dictate a wholesale roadmap reorder

**Raised by:** all four reviewers, with different conclusions.  
**Evidence status:** Magnitude's foundational role is **Established** internally; moving number lines to a specific phase is **Plausible/Judgment** and depends partly on works-elsewhere evidence.  
**Convergence assessment:** Prompt-induced topic with genuine divergence.

`docs/founding/01-instructional-model.md` makes fractional units and magnitude Stage A and calls for periodic magnitude reasoning. `docs/founding/06-roadmap.md` includes magnitude goals but does not introduce number lines until Phase 4. The research supports number-line magnitude work, but the key causal comparison cited used circular area models, not linear fraction bars, and did not test this product's sequence.

The safe conclusion is narrower than "number lines must move to Phase 3." Keep magnitude explicit from the beginning, design bars as unidimensional quantities rather than mere box counts, and run a disposable early number-line magnitude/benchmark probe before investing heavily in bar-only breadth. Use that evidence to decide roadmap timing.

### 2.10 The seed's deployment spike lacks an explicit roadmap home

**Raised by:** Claude directly and Codex through the prototype/limited-MVP distinction.  
**Evidence status:** **Established** mapping omission; requiring a Phase 3 public MVP is **Judgment**.  
**Convergence assessment:** Limited but concrete.

`docs/project-seed.md` defines a GitHub Pages deployment spike and says the build/deployment mechanism helps ratify repository structure. `docs/founding/06-roadmap.md` lists reliable static deployment as a core goal but does not schedule deployment review until Phase 9 integration. Phase 9 is called the first **substantial** stable core release; that wording does not prohibit prototype deployments earlier.

The roadmap should explicitly map the seed deployment spike into Phase 1 or Phase 2 and distinguish a deployed prototype, a useful limited product, and the mature core. The reviews do not prove that the owner must commit to a Phase 3 public MVP.

### 2.11 Publication and product-overlap checks have narrow, useful conclusions

**Raised by:** all four reviewers.  
**Evidence status:** **Established** only within the inspected material; the market-wide absence claim is **Plausible**.  
**Convergence assessment:** Entirely prompt-induced.

No reviewer found publish-blocking PII, student records, credentials, or secrets in the founding documents and nearby context it inspected. This is not a Git-history or full-repository secrets audit.

No reviewer established a current free product with FractionFlow's complete combination. That supports continued exploration, but it is not proof of uniqueness. Several product claims came from documentation rather than direct use, and product features, access, and pricing drift. The durable statement should be "no strong duplicate was established in this survey."

### 2.12 Explicit connection-making is better supported than any particular display choreography

**Raised by:** Claude directly and Kimi in its representation/research analysis; the research package supplies the strongest external corroboration.  
**Evidence status:** **Established** within a bounded but directly relevant fraction-tutor research program; a required prompt form or frequency is **Judgment**.  
**Convergence assessment:** Partly common-mode because the prompt asked about multiple representations, but the mechanism is more specific than the prompt's simultaneous-versus-sequential framing.

The directly relevant studies summarized in `reports/orchestration/founding-docs-review/research/02-multiple-representations.md` found that co-exposure alone did not reliably produce representational connection-making; prompted mapping and self-explanation mattered. This supports `docs/founding/05-quality-and-validation.md` §58's concern that bridges test transfer rather than decorate the episode.

The owner should preserve a connection-making demand at bridge episodes, but not assume that a menu choice, free-response explanation, or prompt at every bridge is already validated. Compare no prompt, a short structured mapping, and a brief learner-generated explanation, then inspect uncued transfer.

### 2.13 Off-canonical paths and the authored-content budget need a bounded coverage rule

**Raised by:** Claude and Kimi.  
**Evidence status:** **Established** behavior/coverage gap; the projected combinatorial burden is **Plausible**.  
**Convergence assessment:** Independent internal observations from the alternate-path and content-governance angles.

`docs/founding/02-interaction-grammar.md` §65 promises authored narrative patterns, while `docs/founding/03-math-and-content-model.md` §56 and `docs/founding/05-quality-and-validation.md` §66 require valid alternate denominators to continue correctly. Kimi separately observes that family × error × hint × support combinations can outrun the review budget.

Before denominator entry hardens, prototype one supported non-LCD path through feedback and help. Then state which content is parameterized over the learner-established state, which beats receive full authored variants, and what reviewed generic fallback is allowed. This is a coverage policy, not a demand to author every cross-product cell.

### 2.14 The misconception catalog has at least two credible candidates for later inclusion

**Raised by:** Claude and Gemini for gap thinking; Gemini alone for tick-mark counting.  
**Evidence status:** **Plausible**, externally grounded.  
**Convergence assessment:** Moderately independent, although the prompt explicitly asked for missing misconceptions.

Gap thinking is relevant to equivalence and magnitude; tick-mark counting is directly relevant once number-line tasks ship. The owner should review both against `docs/founding/01-instructional-model.md` §22 and add detection/feedback rules only when the associated content can actually produce and distinguish those errors.

### 2.15 Session dose and stopping behavior remain unspecified

**Raised by:** Claude and Gemini.  
**Evidence status:** **Established** that `docs/founding/06-roadmap.md` §57 names a natural stopping point without specifying a dose; the need for a fixed problem or time count is **Judgment**.  
**Convergence assessment:** Limited but concrete.

This does not require a pre-development number such as five problems or ten minutes. It does require Phase 7 to treat pause, completion, and classroom-sized use as explicit prototype variables rather than letting an endless stream emerge by default.

### 2.16 Licensing and a minimal static-app security posture need owner decisions

**Raised by:** Claude and Kimi.  
**Evidence status:** The absence of a root license is **Established**; dependency, third-party-origin, and future URL-input risks are **Plausible** and feature-dependent.  
**Convergence assessment:** Independent missing-perspective findings.

A public repository without a license does not grant the reuse rights that an open educational project may intend. That intent belongs in `docs/founding/00-principles.md`, with the actual license as a root artifact. A minimal security posture belongs in `docs/founding/04-system-architecture.md` before dependency adoption; strict schema validation for shareable URL configurations can wait until the `docs/founding/06-roadmap.md` §78 stretch feature is designed.

## 3. Contested and divergent points

### 3.1 Animation: demote now or retain pending evidence?

**Case for demotion:** Claude argues that animation's evidence is small and indirect, while prediction and persistent comparison are cheaper and more accessible. It would make prediction → reveal → inspectable before/after the canonical form and motion optional.

**Case for retention:** Kimi and Codex note that the current documents already require prediction, stable end states, replay, reduced motion, and hard cuts when a transformation would mislead. Nothing in the literature tests the exact FractionFlow comparison.

**Discriminating experiment:** matched animated and static/key-frame versions with identical prompts and final residue; measure pre-reveal prediction, immediate equivalence reasoning, delayed fresh-form transfer, help/replay use, and accessibility across reduced-motion and nonvisual modes.

**Synthesis:** label animation as a hypothesis and test it. Do not canonize either animation or static juxtaposition from this record.

### 3.2 Simultaneous representations: contradiction, carve-out, or general prescription?

**Case for a contradiction:** Claude and Kimi point to the bold anti-simultaneity sentence, the inclusion of equations in its example, and the canonical symbol-plus-visual episode.

**Case against:** Codex points to the immediately preceding permission for deliberate juxtaposition and the controlling "ordinarily compete" language. Symbol-plus-visual integration need not mean two full models compete.

**Discriminating evidence:** edit the slogan for internal consistency now; then compare morph, side-by-side, and sequential conditions with the same connection-making prompt. Co-presence alone is not a valid test because the research says learners need explicit mapping support.

**Synthesis:** wording repair now; display policy remains a prototype question.

### 3.3 Common-denominator validity on current forms versus reduced values

**Claude's case:** for `3/6 + 1/4`, simplifying first permits `1/2 + 1/4 = 2/4 + 1/4`; therefore it calls 4 a valid denominator for the values and says all validity, LCD, and family classification should use reduced denominators.

**Countercase:** `docs/founding/03-math-and-content-model.md` deliberately distinguishes numerical value from current display form and normally starts generated operands reduced. For the current written forms `3/6` and `1/4`, 4 is not reachable by the direct integer expansion modeled by the common-denominator step. It becomes available after an explicit simplify-first transformation changes the current form.

**Discriminating specification/probe:** introduce an unsimplified curated operand and test both paths. Require the state model to record an accepted simplification before validating a denominator against the new current forms. Check whether family metadata is intended to describe original authored forms, current learner-established forms, reduced values, or more than one of those.

**Synthesis:** there is a path/state clarification worth making, but Claude's global "all classification on reduced values" rewrite would erase meaningful form distinctions and is not established as the correct repair.

### 3.4 Fixed endpoints: critical geometric impossibility or bounded renderer problem?

**Gemini's case:** a bar filling one viewport and a number line with a different domain, padding, and scale cannot always preserve one literal screen coordinate without distorting magnitude.

**Countercase:** the actual documents say "whenever possible," list several possible anchors, define scenes as meaning rather than pixels, permit hard cuts, and require only an "appropriate spatial anchor." A proper-fraction bar and a `[0,1]` line can be aligned; a mixed-number bridge can choose a different anchor or transition.

**Discriminating experiment:** responsive geometry prototypes at narrow, zoomed, and mixed-number layouts, with learner observation of what remained invariant.

**Synthesis:** retain as a renderer/prototype constraint. Reject the Critical "geometric impossibility" label unless the owner truly intends universal pixel immobility across arbitrary domains.

### 3.5 Static-only scope versus optional future services

**Codex's case:** `docs/project-seed.md` and the repository guide make static-only, no-backend operation a defining constraint, while `docs/founding/00-principles.md` §20, `docs/founding/04-system-architecture.md` §3, and `docs/founding/06-roadmap.md` §§79–80 contemplate accounts, telemetry, synchronization, and classroom services after justification.

**Other reviewers' case:** Claude, Gemini, and Kimi praise the static-first core and read those later services as safely stretch-gated, not approved core architecture.

**Discriminating owner decision:** decide whether these passages record hypothetical possibilities requiring a future charter change or an already-approved direction awaiting justification.

**Synthesis:** current authority favors the first reading. Clarify that remote identity, telemetry, learner data, or a backend is out of the present project scope unless the owner explicitly changes the defining constraint. This is an authorization-boundary repair, not evidence that the current implementation will contain a backend.

### 3.6 Does persistence need to move earlier?

**Case for moving it:** Kimi reads the Phase 6 success statement and spaced/retrieval language as inherently cross-session.

**Case for retaining the sequence:** Phase 6 can demonstrate fading over multiple problems and Phase 7 can demonstrate intervening practice inside a controlled session; Phase 8 explicitly owns returning-learner continuity.

**Discriminating evidence:** state whether each gate is within-session or cross-session. Only then assess whether a minimal persistence slice is required earlier.

**Synthesis:** clarify the gates; do not add portable identity or cloud-adjacent mechanisms by default.

### 3.7 Broad de-duplication versus targeted normalization

**Case for broad reduction:** Claude and Gemini see a roughly 12,000-line normative surface, repeated canonical examples, and many review lists as an imminent drift risk.

**Case for restraint:** Codex and Kimi note that repeated examples often orient each document locally and that validation restating what it tests can be useful. The most concrete drift found is in nonidentical scaffold lists, not in the repeated `2/3 + 1/4` example itself.

**Discriminating audit:** identify repeated passages that yield different behavior or ownership; normalize those. Do not count repeated tokens as a proxy for conflicting norms.

**Synthesis:** perform targeted normalization now, especially scaffolds and roadmap ownership. Defer a wholesale rewrite until implementation shows which rationale and examples developers actually use.

### 3.8 Number-line timing and bridge frequency

**Earlier case:** Claude and Kimi cite magnitude research and the internal Stage-A dependency to recommend earlier number-line work.

**Current-order case:** Gemini sees bar-first sequencing as defensible; Codex says the engineering strategy survives but should receive an early disposable second-representation probe.

**Discriminating experiments:** a small early magnitude/benchmark family versus bar-only work; blocked versus interleaved representation schedules across matched problem sets. Do not infer bridge frequency from a same-screen morph experiment.

**Synthesis:** preserve bar-first implementation for now, make magnitude explicit, and use early probes to decide whether Phase 4 is too late.

## 4. Single-reviewer findings

These findings are preserved unranked. Their solitary status neither strengthens nor weakens them. Several are valid questions; several remedies go beyond the evidence.

### From `reports/orchestration/founding-docs-review/review-claude.md`

- **Current-form denominator semantics:** preserve as a narrower `docs/founding/03-math-and-content-model.md` / `docs/founding/05-quality-and-validation.md` state-path question, not the claimed High mathematical defect requiring all classification on reduced values. **Evidence: Plausible gap; proposed global remedy: Judgment.**
- **Deliberate check-the-premise cases:** `docs/founding/03-math-and-content-model.md` §51 excludes accidental no-op cases; it does not explicitly require intentional cases that detect choreography-following. Add such a family only if the evidence model needs it. **Evidence: Plausible; recommendation: Judgment.**
- **Automatable scaffold-leakage invariant:** scene/prompt serialization could be checked to ensure it does not contain the value currently requested. **Evidence: Plausible engineering recommendation.**
- **Undefined partial number-line scenes:** `docs/founding/05-quality-and-validation.md` §70 requires switching after one conversion and other intermediate states, but `docs/founding/02-interaction-grammar.md` does not define every two-operand number-line scene. **Evidence: Established requirement/specification mismatch; Phase 4 ownership.**
- **Child-usability protocol:** consent, de-identification, retention, and the school/district boundary are not stated. However, `docs/founding/05-quality-and-validation.md` §77's durable-assets rule does not actually require raw child notes in version control. **Evidence: Plausible governance gap; alleged internal contradiction rejected.**
- **Golden-case weakness:** the result in one regrouping case equals the subtrahend, so one narrow regression could pass incorrectly. **Evidence: Plausible test-design improvement, not a founding defect.**
- **No backward routing to prerequisites:** persistent failure inside an operation has no specified route to a focused prerequisite episode. **Evidence: Plausible; defer to sequencing design unless it affects the first slice.**
- **Public-repository process clutter and provider-note publication:** useful repository-governance observations, but outside the founding-document synthesis and not PII findings. **Evidence: Judgment; owner decision outside this revision pass.**

### From `reports/orchestration/founding-docs-review/review-codex.md`

- **Static-only versus static-first authorization boundary:** strong internal-text observation; requires an owner decision and alignment across `docs/founding/00-principles.md`, `docs/founding/04-system-architecture.md`, `docs/founding/06-roadmap.md`, `docs/project-seed.md`, and `README.md`. **Evidence: Established ambiguity.**
- **Mixed-number terminology:** distinguish normalized mixed numbers from transient regrouped whole-plus-fraction forms such as `2 10/8`. **Evidence: Established terminology gap; Low impact.**
- **Replay across revisions:** a seed may not reproduce a problem after generator/content changes; versioning or a sufficient problem snapshot may be needed. **Evidence: Plausible architecture requirement when replay becomes durable.**
- **Accessibility accommodations versus instructional scaffolds:** persistent large text, spoken notation, or alternate input should not be treated as evidence of weak fraction understanding. **Evidence: Plausible and important evidence-model distinction.**
- **Synthetic regression fixtures:** real learner episode histories should not automatically become public validation assets. **Evidence: Plausible privacy safeguard; aligns with the repository's absolute PII boundary.**

### From `reports/orchestration/founding-docs-review/review-gemini.md`

- **Tick-mark counting:** a genuine misconception candidate not named in `docs/founding/01-instructional-model.md` §22; review it before number-line implementation. Gap thinking is separately covered as a convergent finding in §2.14. **Evidence: Plausible and externally grounded.**
- **Literal fixed-coordinate impossibility:** rejected as a meaning-changing reading of the source; preserve only the responsive-geometry prototype question. **Evidence for the claimed Critical defect: Speculation.**
- **Portable progress passport:** not established by the existence of enterprise data-clearing policies. It introduces new privacy, integrity, and usability concerns. **Evidence: Speculation/design proposal.**
- **Fixed denominator ceilings:** useful prototype parameters, not founding values. **Evidence: Speculation.**
- **Dedicated mobile keypad:** a possible implementation response to keyboard obstruction, not a pre-development requirement. **Evidence: Judgment.**
- **Audio sonification:** a possible research avenue, not an accessibility requirement derived from the reviewed text or evidence. **Evidence: Speculation.**
- **Three-stage/five-stage/nine-layer contradiction:** rejected. These are progressively elaborated abstraction levels, and `docs/founding/04-system-architecture.md` explicitly allows physical combination of responsibilities. **Evidence for contradiction: Speculation.**

### From `reports/orchestration/founding-docs-review/review-kimi.md`

- **Entry/placement model:** the product targets both initial and conceptual-repair learners but does not define first-run placement. The gap is real; a game-like diagnostic or new roadmap phase is only one possible answer. **Evidence: Plausible foundational question; remedy: Judgment.**
- **"Pedagogically convenient denominator":** `docs/founding/03-math-and-content-model.md` §11 introduces the term without defining or reusing it. **Evidence: Established editorial/ownership gap.**
- **Additional misconception candidates:** mixed-number juxtaposition read as multiplication and cross-multiplication leakage deserve review before corresponding content ships. **Evidence: Plausible.**
- **Plain-language privacy statement:** useful release artifact even if the product collects no learner data; hosting-log wording should be legally and technically verified before publication. **Evidence: Judgment with prudent rationale.**
- **Share-link schema validation:** a correct security requirement if `docs/founding/06-roadmap.md` §78's shareable configurations are implemented. **Evidence: Established general security principle; defer with the stretch feature.**
- **Evidence continuum versus support ladder:** preserve as part of the scaffold normalization repair; they are different axes and need an explicit mapping. **Evidence: Established documentation gap.**

## 5. Reviewer-reliability notes

### Shared common-mode risk

Mutual blindness prevented reviewers from copying one another, but it did not make their priors independent. All four received a prompt that explicitly asked whether animation carries too much pedagogy, simultaneous representations may be better, the first slice is mistimed, multiple-choice prompts invite guessing, and the roadmap delays important capabilities. Convergence on those subjects raises investigation priority; it is not four independent discoveries of the same defect.

The research package also must not be counted as an additional vote for Claude's findings. `reports/orchestration/founding-docs-review/research-report.md` was produced by the Claude review process and then used in `reports/orchestration/founding-docs-review/review-claude.md`.

### `reports/orchestration/founding-docs-review/review-codex.md`

Codex's claims about supported versus independent evidence and denominator feasibility preserve the nearby source mitigations, and its morphing and bridge-frequency conclusions remain prototype questions. Its static-only authorization finding is textually grounded. Its statement that no critical mathematical defect was found should not be treated as proof that none exists; it simply reflects its reviewed set.

### `reports/orchestration/founding-docs-review/review-kimi.md`

Kimi is strongest on scaffold-list drift and the prerequisite-label repair. It overstates the need for cross-session persistence before Phase 8: the roadmap can test fading and mixed retrieval within sessions. Its placement-flow proposal is a design expansion, not the only consequence of the entry-model question.

### `reports/orchestration/founding-docs-review/review-claude.md`

Claude provides the richest research integration and records important limitations. Three conclusions need reduced weight:

- It turns the absence of direct fraction animation evidence into a confident static-first redesign. The research supports testing, not choosing the winner.
- It calls the written-denominator definition generally mathematically wrong. The actual ambiguity is how current forms change after an accepted simplify-first step.
- It links child observation to the durable validation-assets rule, but `docs/founding/05-quality-and-validation.md` §77 says, "Important test cases, curated review cases, and acceptance examples" belong in version control; it does not say raw learner observations do.

Claude's deployment-map omission, scaffold-list drift, off-path authoring question, and correction to the equality example remain useful.

### `reports/orchestration/founding-docs-review/review-gemini.md`

Gemini's Critical/High labels for fixed-coordinate impossibility and simultaneous-display claims are not supported after checking the quoted source passages.

- The specification says scenes describe "meaning, not pixels" (`docs/founding/04-system-architecture.md` §17) and asks for an "appropriate spatial anchor" (§92); Gemini attacks a universal literal pixel rule the source does not contain.
- It describes the anti-simultaneity stance as dogmatic while omitting the same paragraph's permission to "deliberately juxtapose" representations.
- It omits `docs/founding/03-math-and-content-model.md` §59's statement that instructional policy may bound acceptance and §68's explicit threshold deferral when presenting the denominator problem as an irresolvable contradiction.
- It attributes a direct simultaneous-display result to the Rau line of work even though the research brief says that comparison was not directly tested.
- It says static graphics or persistent traces consistently outperform animation, while the cited meta-analyses report a small, heterogeneous pooled animation advantage.
- Its hard denominator ceilings, sonification, portable progress token, and required keypad are redesign proposals without validating evidence.

### Source-text corrections worth carrying forward

- `docs/founding/05-quality-and-validation.md` §68 warns against a sequence using `2/3 + 1/4 = 8/12 + 1/4`, but that equality is true. Replace it with an actually false stable equality or clarify that the warning concerns misleading intermediate presentation, not the equality shown.
- The bold anti-simultaneity slogan should be edited so it cannot override its own paragraph's qualified rule.
- The scaffold-dimension lists should have one canonical owner.
- The reviewed materials were publication-clean within the inspected scope; no reviewer performed a complete Git-history or deployed-system audit.

## 6. Evidence-status audit

The labels below apply to the finding and to the proposed response separately. "Established" means the internal text or verified research directly supports the claim; it does not mean FractionFlow's learning effectiveness is established.

| Finding or recommendation | Finding status | Recommendation status | Evidence-discipline note |
|---|---|---|---|
| Accessibility qualifiers leave the first-slice floor ambiguous | **Established** | Name minimum modes and test a complete accessible episode: **Judgment strongly supported by project constraints** | Standards support testable access; they do not select sonification or another particular mechanism. |
| Phase 2 uses a Stage-E family before earlier instructional stages are built | **Established** | State prerequisites and limits of learner evidence: **Plausible** | Does not prove the engineering slice must move. |
| Canonical examples can record supported counting as if it were prediction/transfer | **Plausible**, grounded in the shown order | Record reveal/hint/attempt provenance: **Plausible** | Requires learner observation to establish actual false success. |
| Valid, supported, and renderable denominators are not connected by one learner-facing policy | **Established** | Add a three-part contract and continuation behavior: **Plausible** | Existing bounds mitigate the alleged contradiction; exact ceilings remain prototype outputs. |
| Anti-simultaneity sentence is too absolute | **Established** | Narrow the sentence, retain one-focus policy: **Plausible** | Spatial-contiguity evidence does not establish two-full-model co-display. |
| Animation/morphing superiority is unvalidated | **Established evidence gap** | Run matched prototypes: **Plausible** | **Absence-of-evidence flag:** no direct comparison means test, not reject. |
| Prediction has a large POE effect in cited research | **Established in the cited, mostly science-domain corpus** | Assume the same magnitude for fraction practice: **Speculation** | **Works-elsewhere flag:** domain and elementary-subgroup transfer are limited. |
| Explicit connection-making improves multi-representation fraction learning | **Established within a bounded, directly relevant research program** | Require a specific menu-selected prompt at every bridge: **Judgment** | The mechanism is supported; that exact prompt format and frequency are not. |
| Off-canonical authored paths lack a bounded content-coverage rule | **Established gap at the behavior boundary** | Prototype one alternate path and define parameterized/fallback coverage: **Plausible** | Does not require a fully authored cross-product. |
| Gap thinking and tick-mark counting are credible missing misconception candidates | **Plausible**, externally grounded | Add them when relevant content can distinguish the errors: **Plausible** | Gap thinking was raised by two reviewers; tick-counting by one. |
| Session dose and stopping behavior are unspecified | **Established** | Fix a problem/time count before development: **Judgment** | Treat dose, pause, and completion as Phase 7 prototype variables. |
| Licensing intent is not expressed through a repository license | **Established** | Record intent and add the appropriate license: **Judgment requiring an owner decision** | “Free to use” and open-source/OER reuse rights are not identical. |
| Minimal dependency and URL-input security posture is absent | **Plausible, feature-dependent gap** | Add core rules before dependencies; defer share-link validation until that feature: **Plausible** | Static architecture narrows risk but does not remove supply-chain or parsing risk. |
| Bridge frequency should be higher because interleaving won | **Plausible challenge** | Set a new frequency in the founding docs: **Judgment** | **Works-elsewhere flag:** across-problem interleaving is not same-screen bridge frequency. |
| Scaffold lists differ and ownership is unclear | **Established** | Make `docs/founding/02-interaction-grammar.md` canonical and map evidence separately: **Plausible** | Targeted normalization is supported; wholesale de-duplication is not. |
| Magnitude deserves early attention | **Established internally and research-aligned** | Move number lines to Phase 3: **Judgment** | **Works-elsewhere flag:** key comparison used circles, not bars, and did not test this roadmap. |
| Phase 6–7 may imply cross-session persistence | **Plausible but contested** | Move persistence earlier: **Judgment** | Stable/retrieval language supports the inference, but the gates can also be interpreted and tested within-session. |
| Shared devices create loss/contamination risks | **Plausible** | Preserve identity/reset as a Phase 8 decision: **Plausible** | Ephemeral-policy prevalence was not established. |
| Seed deployment spike has no explicit roadmap phase | **Established** | Map it into Phase 1–2: **Plausible** | A deployed prototype does not require a Phase 3 public MVP. |
| Static-only seed and future-service language have different authorization implications | **Established ambiguity** | Make future backend/data services require an explicit charter change: **Plausible, owner-dependent** | This is a scope decision, not a technical inference. |
| Common-denominator rules mishandle simplify-first paths | **Plausible** | Validate against learner-established current forms after explicit transformation: **Plausible** | Claude's universal reduced-value rewrite is not established. |
| Authored hints may not cover off-canonical paths | **Established gap at the behavior boundary** | Parameterize or declare reviewed degradation by beat: **Judgment** | Needs a content prototype before estimating authoring cost. |
| Raw child observations are forced into version control | **Speculation / not supported by text** | Add a consent/de-identification protocol anyway: **Prudent Judgment** | The privacy policy is useful; the alleged internal contradiction is not. |
| No existing product duplicates FractionFlow | **Plausible survey result** | Use uniqueness as a load-bearing justification: **Speculation** | **Absence-of-evidence flag:** closest products were not all tested hands-on. |
| Unit-fraction foundation and LCD-not-required are standards-aligned | **Established textual/curricular fact** | Claim common-unit framing causes better learning: **Speculation** | No isolated causal comparison was found. |
| Correct-but-unsimplified answers can be mathematically correct | **Established** | Preserve current design: **Plausible** | Do not inflate standards rationale into a causal learning claim. |
| Fixed-coordinate bridge is universally impossible | **Speculation** | Replace it now with projection guides: **Judgment** | Test responsive geometry; source already permits alternative anchors and hard cuts. |
| Pipeline definitions contradict | **Speculation / rejected** | No change beyond an optional explanatory cross-reference: **Judgment** | Three, five, and nine items serve different abstraction levels. |

## 7. Triage table for the owner

This table is intentionally selective. It separates cheap specification repairs from questions that should earn their answer through a vertical slice.

| Finding cluster | Recommended disposition | Canonical owner of the change |
|---|---|---|
| Static-only defining constraint versus optional backend/data-service language | **Revise a founding document now**: state whether such services require an explicit future charter change; align context files in the same owner pass | `docs/founding/00-principles.md`, then conforming edits in `docs/founding/04-system-architecture.md`, `docs/founding/06-roadmap.md`, `docs/project-seed.md`, and `README.md` |
| Accessibility acceptance floor | **Revise a founding document now**: name the minimum first-slice access modes and agency-preserving acceptance question | Commitment in `docs/founding/00-principles.md`; acceptance in `docs/founding/05-quality-and-validation.md`; Phase 2 gate in `docs/founding/06-roadmap.md` |
| Phase 2 learner prerequisites and what its testing can prove | **Revise a founding document now**: label the slice as an engineering/instructional prototype for a stated learner starting point | `docs/founding/06-roadmap.md`, informed by `docs/founding/01-instructional-model.md` |
| Supported construction versus prediction/independent transfer | **Revise a founding document now**: name the evidence categories and preserve response provenance | Evidence interpretation in `docs/founding/01-instructional-model.md`; episode examples in `docs/founding/02-interaction-grammar.md`; tests in `docs/founding/05-quality-and-validation.md` |
| Valid versus supported versus renderable denominator | **Revise a founding document now**: specify non-shaming rejection/continuation without choosing fixed thresholds | Mathematical distinctions in `docs/founding/03-math-and-content-model.md`; learner-facing behavior in `docs/founding/02-interaction-grammar.md`; validation in `docs/founding/05-quality-and-validation.md` |
| Anti-simultaneity slogan | **Revise a founding document now**: distinguish competing full visual models, symbolic co-presence, and deliberate comparison | `docs/founding/00-principles.md` |
| Scaffold list drift and evidence/support ladder mapping | **Revise a founding document now**: make one list canonical and reference it elsewhere | `docs/founding/02-interaction-grammar.md`, with meaning of evidence in `docs/founding/01-instructional-model.md` |
| Current-form behavior after simplify-first work | **Investigate before development** of unsimplified-operand paths; add a narrow state/path rule, not a global reduced-value rewrite | `docs/founding/03-math-and-content-model.md`, tested in `docs/founding/05-quality-and-validation.md` |
| Off-canonical authored prompts and hints | **Investigate before development** of denominator entry: prototype one non-LCD path through help and recovery | `docs/founding/02-interaction-grammar.md`, with authored-content structure in `docs/founding/04-system-architecture.md` |
| Explicit connection-making at representation bridges | **Test in the first vertical slice**: compare no prompt, structured mapping, and brief generated explanation before standardizing prompt format or frequency | `docs/founding/01-instructional-model.md`, with episode behavior in `docs/founding/02-interaction-grammar.md` |
| GitHub Pages deployment spike and prototype/MVP/core terminology | **Revise a founding document now**: map the seed spike into an early phase; do not pre-commit to a Phase 3 public MVP unless the owner wants one | `docs/founding/06-roadmap.md`, with a mapping note in `docs/project-seed.md` |
| Child usability governance and synthetic regression fixtures | **Revise a founding document now**: require appropriate permission; minimize and de-identify retained notes; never commit identifiable or raw learner records; use synthetic/reconstructed public fixtures | `docs/founding/05-quality-and-validation.md`, referring to `docs/founding/00-principles.md` privacy policy |
| Animation, morphing, juxtaposition, and fixed anchors | **Test in the first vertical slice** with matched conditions and stable end states; label the choice a hypothesis until then | Experiment and behavior in `docs/founding/02-interaction-grammar.md`; evidence criteria in `docs/founding/05-quality-and-validation.md`; checkpoint in `docs/founding/06-roadmap.md` |
| Prompt density, guessing, reveal timing, and transfer | **Test in the first vertical slice**; collect first-attempt/reveal/help provenance before setting fading thresholds | `docs/founding/01-instructional-model.md`, `docs/founding/02-interaction-grammar.md`, and `docs/founding/05-quality-and-validation.md` |
| Early magnitude/number-line timing and bridge frequency | **Test in the first vertical slice** or a disposable adjacent probe; defer roadmap reordering until evidence exists | `docs/founding/06-roadmap.md` |
| Partial two-operand representation switching | **Investigate before development** of Phase 4 switching; restrict required switch points to specified meaningful correspondences | `docs/founding/02-interaction-grammar.md`, then `docs/founding/05-quality-and-validation.md` |
| Persistence timing, shared-device identity, and reset behavior | **Defer** implementation to its roadmap phase, while clarifying that earlier gates are within-session and recording the later owner decision | `docs/founding/04-system-architecture.md` and `docs/founding/06-roadmap.md` |
| First-run placement for novice versus repair learners | **Investigate before development** of session composition; do not add a diagnostic flow by default | `docs/founding/01-instructional-model.md`, scheduled in `docs/founding/06-roadmap.md` if adopted |
| Session dose, pause, and completion | **Defer** fixed values until Phase 7 prototyping; keep a natural stopping point as an explicit acceptance question | `docs/founding/06-roadmap.md` |
| Gap thinking and tick-mark counting | **Defer** implementation until relevant equivalence/magnitude/number-line content, while adding them to the owner review list now | `docs/founding/01-instructional-model.md` |
| Licensing intent | **Revise a founding document now** if open-source/OER reuse is intended; the resulting root license is a separate repository artifact | `docs/founding/00-principles.md` |
| Plain-language public privacy statement | **Defer** the external artifact until release preparation while recording it in the release checklist now | `docs/founding/06-roadmap.md` |
| Dependency provenance and third-party-origin posture | **Investigate before development** of tooling and dependency adoption | `docs/founding/04-system-architecture.md` |
| Share-link URL/configuration validation | **Defer** until the stretch share-link capability is designed | `docs/founding/06-roadmap.md` |

## 8. Bottom line

Preserve the mathematical and instructional spine: exact deterministic arithmetic; separation of value, current form, and preferred final form; equivalence as renaming; common denominators as common units; LCD as an efficiency rather than a correctness condition; correct-but-unsimplified work remaining correct; regrouping as decomposition of a whole; authored and reproducible instruction; local recovery; calm presentation; and the outward flow from mathematical truth to instructional state to presentation. The reviews and research did not uncover a verified core arithmetic error in the founding examples, and they did not establish a current product that makes this project redundant.

Change now what is cheap to clarify and expensive to improvise in code: the static-only authorization boundary; the minimum accessibility floor; the Phase 2 learner and evidence contract; the distinction among supported construction, prediction, and transfer; the valid/supported/renderable-input response; the anti-simultaneity slogan; scaffold ownership; the early deployment-spike mapping; and a short child-usability/privacy protocol. Correct the true-equality example in `docs/founding/05-quality-and-validation.md` §68 while making that pass. These are specification repairs, not a wholesale redesign.

Leave the disputed mechanics to prototyping. The record does not decide whether animation beats static key frames, whether a bar should morph into or sit beside a number line, how often bridges should occur, how many prompts a learner will tolerate, what denominator density remains legible, or whether number-line work should move earlier. Build matched versions, preserve an inspectable state, require explicit connection-making, and measure uncued transfer rather than interface completion. That is the shortest path from a detailed design hypothesis to evidence the owner can actually use.

The founding set is credible enough to support a narrow implementation after the owner resolves the cheap authorization and acceptance ambiguities above. The largest risk is not bad fraction arithmetic. It is mistaking a polished supported performance for independent understanding—or mistaking a research-motivated interface preference for a research-established fact.
