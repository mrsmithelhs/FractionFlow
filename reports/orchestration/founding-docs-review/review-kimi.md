I'll conduct this review directly (read-only, no subagents, no repo changes). First, let me survey the materials.

Now reading the founding documents.

All founding documents are read. Now I'll run targeted external research on the highest-stakes assumptions, plus a quick PII scan of the docs.

# FractionFlow Founding Documents — Independent Adversarial Review

Scope of review: all seven founding documents (`00-principles` through `06-roadmap`), plus `docs/project-seed.md` and `README.md` as context. No repository files were modified. External research was used selectively on the highest-stakes assumptions (number-line evidence, animation/transient-information, multiple representations, existing products, COPPA posture).

**Publication check:** I scanned the founding set, seed brief, and README for personal information, names, emails, URLs, and secrets. The founding documents are clean — no PII, no student references, no internal identifiers. Nothing found that must be withheld from the public remote.

---

## 1. Overall assessment

The founding set is unusually strong in the dimensions most projects get wrong: the mathematics is specified exactly and correctly (I verified every worked canonical example in `03` — including `3 1/4 − 1 5/8 → 2 10/8 − 1 5/8 = 1 5/8` and the non-minimal-denominator case `1/3 + 1/4` via 24 — all are mathematically sound); the validity/efficiency/preference distinction (`03` §26) is exactly the right conceptual separation and is consistently honored; the misconception catalog (`01` §22) covers the well-documented error patterns, including whole-number bias, which research confirms is the dominant failure mode in unlike-denominator work. The architecture document's insistence on one authoritative mathematical truth with representations as projections is the correct load-bearing decision, and the quality document's "scaffold leakage" concept (`05` §19) is a genuinely sharp catch that most edtech specs never articulate.

The most fragile parts are not the mathematics but three things: (1) the accessibility story for animated transformation — the documents require reduced-motion and screen-reader equivalents that "preserve the relationship" between states, but never confront that the relationship is precisely what motion communicates, and the natural static fallback (before/after juxtaposition or key-frame sequences) collides with the anti-simultaneity principle; (2) the cross-session story — the product's defining success state ("I used to need the picture; now I don't") requires durable memory of scaffold state, yet local persistence is deferred to Phase 8, after the phases whose exit gates describe fading and retrieval; and (3) vocabulary normalization around scaffolds, where three documents maintain three different non-identical normative lists, exactly the drift pattern `00` §26 was written to prevent.

The documents do provide a credible foundation for development. The single most important change before implementation: **reconcile the "no simultaneous representations" stance with the symbolic-co-presence design and with accessibility requirements, and move minimal cross-session scaffold continuity earlier in the roadmap** — both are cheap to fix in Markdown now and expensive to discover in Phase 4–7.

---

## 2. Highest-priority findings

### Finding 1 — The anti-simultaneity principle is overstated and internally in tension with the rest of the design

**Severity:** High · **Confidence:** High

**Evidence (internal).** `00-principles.md` §2 states flatly: "**Multiple representations does not mean simultaneous representations**," and its own example of what a learner should *not* coordinate includes "an equation" alongside a bar, pie chart, and number line. But `02-interaction-grammar.md` §19 ("Symbolic Notation Should Participate in the Narrative"), §44 ("Symbolic Compression"), and `06-roadmap.md` §18 all require symbolic notation to be visibly present and spatially tied to the visual model *throughout* episodes — symbols are explicitly supposed to "become more prominent as visual support fades," which means symbol + visual co-presence is the norm, not the exception. As written, a Phase 2 implementer applying §2 literally could conclude the canonical episode example (`02` §75, which shows the expression and the bar together) violates a founding principle.

**Evidence (external).** The research the principle gestures at is actually more nuanced than the flat statement. Rau's Fractions Tutor experiments found that *multiple visual* representations helped only when paired with self-explanation prompts, and notably delivered them **one visual at a time across activities** — which supports FractionFlow's sequential-visual design. But symbol-plus-graphic linking presented together with explicit connection prompts is precisely the condition under which multiple representations work. [Rau & Matthews, ZDM 2017](https://website.education.wisc.edu/rau-lab/pubs/RauMatthews2017_ZDM.pdf "citation")

**Why it matters.** This is the kind of sentence future agents and contributors will quote to reject correct designs — including the design's own canonical episodes — or to reject the static before/after juxtaposition that Finding 2 needs.

**Recommended response.** Revise `00-principles.md` §2 now (it owns the principle): scope the restriction to *competing visual representations*, explicitly carve out (a) symbolic notation co-present with the active visual, and (b) deliberate juxtaposition for one defined comparison — the escape hatch exists in §2's last line but contradicts the bolded absolute. `02` §19/§44 should then reference rather than appear to violate the principle.

---

### Finding 2 — Reduced-motion and screen-reader equivalents of morphing transformations are required but mechanically undefined

**Severity:** High · **Confidence:** High

**Evidence (internal).** `02-interaction-grammar.md` §72 requires reduced-motion alternatives to preserve "initial state; transformed state; **relationship between them**." `00-principles.md` §17 requires reduced motion "without removing mathematical information." `05-quality-and-validation.md` §41 repeats the requirement. But the subdivision relationship (each third *becomes* four twelfths) is exactly what the animation's motion carries; two static endpoints show *that* a change happened, not the mapping. The natural accessible fallbacks — before/after side-by-side, or a static key-frame sequence — are simultaneous multi-state displays that sit uncomfortably with `00` §2 (Finding 1) and are never named anywhere in the founding set. Screen-reader semantics (`05` §43) are deferred with "the exact technical implementation may vary," but an ARIA live-region narration of a morphing SVG is a genuinely hard, research-grade design problem, not an implementation detail.

**Evidence (external).** The transient-information literature is directly on point: animation imposes working-memory costs because prior frames vanish, and the documented countermeasures are self-pacing, segmentation, and **static key-frame sequences** — all persistent, inspectable states. [Wong, Leahy, Marcus & Sweller, Learning and Instruction 2012](https://eric.ed.gov/?id=EJ978021 "citation"), [Höffler & Leutner meta-analysis, Learning and Instruction 2007](https://link.springer.com/article/10.1007/s11423-012-9276-z "citation") FractionFlow already embodies two of these (inspectable end states, `02` §37; replay, `02` §38; learner-pausing, `02` §54) — what is missing is the acknowledgment that the *accessible* form of a transformation is structurally different from the animated form, not just a faster/slower version of it.

**Why it matters.** Accessibility is a founding input, not a stretch goal (`00` §17, seed constraint 4). If the Phase 2 vertical slice discovers that "the same scene with restrained emphasis" (`04` §45) loses the subdivision mapping, the fix will reshape scene modeling — which is core architecture.

**Recommended response.** Explicitly investigate before development, and add to `02-interaction-grammar.md` (which owns interaction behavior) a named mechanism — e.g., an "inspection view" presenting the pre/post states as a deliberate comparison — with `05` §41 requiring it as the reduced-motion/screen-reader evidence of relationship. Make this a Phase 2 exit-gate item, not a Phase 9 review item.

---

### Finding 3 — Scaffold vocabulary is owned by no one and is already drifting

**Severity:** Moderate · **Confidence:** High

**Evidence (internal).** Three documents maintain three different normative lists of scaffold dimensions: `00-principles.md` §6 lists 8 dimensions; `02-interaction-grammar.md` §21 lists 12; `06-roadmap.md` §46 lists 9. They overlap but are not identical (e.g., "estimation prompts" and "simplification prompt" appear in `02`/`06` but not `00`; "subdivisions appear automatically" appears in `00` but not `06`). Separately, `01-instructional-model.md` §26 defines a five-level evidence continuum (Heavily supported / Guided / Independent with optional support / Fluent / Flexible) while `02` §22 defines a four-level support ladder (High / Medium / Low / Independent) — two ladders, no mapping between them. `00` §26's own example says the Interaction Grammar should define how support changes during an episode, which makes `02` §21 the presumptive owner.

**Why it matters.** This is precisely the specification-drift pattern the normalization principle exists to prevent. When Phase 6 implements "the scaffold dimensions," three canonical answers exist.

**Recommended response.** Revise now: `02-interaction-grammar.md` §21 becomes the single canonical scaffold-dimension list; `00` §6 and `06` §46 convert their lists to illustrative references. Add one sentence in `01` §26 or `02` §22 mapping the evidence continuum to the support ladder (they are different axes — evidence vs. provision — and should say so).

---

### Finding 4 — The product's defining outcome needs cross-session continuity that the roadmap schedules last

**Severity:** Moderate · **Confidence:** High (internal logic), Medium (sequencing judgment)

**Evidence (internal).** The signature success state — `00-principles.md` §19: "I used to need the picture for this. Now I don't" — and the evidence-based fading rules (`01` §28: "stable performance across more than one problem family"; `01` §29 retrieval after intervening practice) describe a *cross-session* phenomenon. But `06-roadmap.md` places durable local progress in Phase 8, *after* Phase 6 (scaffold fading system, whose exit gate quotes "I used to need the visual") and Phase 7 (mixed retrieval). Without persistence, a returning learner restarts at full scaffold every visit, and "spacing" can only ever be within-session — a much weaker form of the retrieval practice the instructional model invokes.

**Why it matters.** Phases 6 and 7 will either quietly build a throwaway in-session scaffold model and then rebuild it in Phase 8, or their exit gates will be unverifiable as written.

**Recommended response.** Revise `06-roadmap.md`: either (a) pull a minimal continuity slice (persist scaffold state per problem family locally) into Phase 5–6, which fits the static/local architecture and needs no accounts, or (b) explicitly scope Phase 6–7 gates as within-session and say so. Also note a wrinkle for `04` §28/§31: on shared school Chromebooks, local progress conflates different children — the fading policy needs a stated answer to "whose evidence is this?" even if the answer is "this browser profile, best effort."

---

### Finding 5 — The first vertical slice pedagogically presupposes Stages A–D, but those episodes don't exist yet

**Severity:** Moderate · **Confidence:** High

**Evidence (internal).** `06-roadmap.md` §7 chooses "addition of two proper fractions with unlike denominators where **both** fractions require renaming" (relatively prime, e.g. `2/3 + 1/4`) as the Phase 2 slice. In `01-instructional-model.md` §19's own progression this is Stage E, dependent on Stage B (equivalence), Stage C (like-denominator operations), and Stage D (nested denominators) — yet the like/nested/equivalence-focused episodes are Phase 3 work (`06` §27–28). Meanwhile `05` §52 requires child usability testing during Phase 2. A naive target-age learner handed the Phase 2 episode cold will fail at the equivalence step, and the usability data will confound "the episode design is wrong" with "the prerequisites were never taught."

**Why it matters.** The engineering rationale for the choice is sound (it exercises the most architecture). The risk is interpreting Phase 2 learner testing as evidence about the instructional vision when it can only be evidence about the interaction shell for learners who already understand equivalence.

**Recommended response.** Test during the first vertical slice, with one sentence added to `06` §7/§25 stating the slice's assumed learner (already equivalence-competent) and how usability participants will be screened — or add a minimal "construct an equivalent fraction" focused episode to Phase 2 scope so the slice has an honest on-ramp. Owning document: `06-roadmap.md`.

---

### Finding 6 — No entry/placement model: the system decides the curriculum but never learns where the learner starts

**Severity:** Moderate · **Confidence:** Medium

**Evidence (internal).** `02-interaction-grammar.md` §57 ("The Learner Should Not Need to Manage the Curriculum") and `04-system-architecture.md` §29 (first-time visitor needs nothing) together imply the system picks the first episode for an unknown learner. But `01` §1 explicitly targets two populations — initial learners and conceptual-repair learners who already partially imitate algorithms. A single fixed entry point is wrong for one of them: repair learners forced through Stage A unit-fraction work will experience exactly the "tutorial lock-in" anti-pattern `02` §74 names. No diagnostic, placement task, or parent/teacher start-point selection exists anywhere in core scope (`06` §77 puts teacher configuration in stretch).

**Why it matters.** This is a foundational gap (the project doesn't yet know what behavior it wants), not an implementation detail: it determines whether the first-run experience is one episode or a placement flow.

**Recommended response.** Revise `01-instructional-model.md` (owns competence development) with one section defining the entry model — the cheapest credible option is a short, calm, game-like placement run of focused concept episodes (`03` §41–43 families already exist for this), or an explicit "I've done this before" self-selection of starting stage. Roadmap should assign it a phase.

---

### Finding 7 — Magnitude instruction lacks its best-evidence representation until Phase 4

**Severity:** Moderate · **Confidence:** Medium

**Evidence (internal).** Magnitude and benchmark reasoning are core goals (`01` §4, §33; `03` §24–25) practiced on bars through Phase 3; the number line — which `00` §9 and `01` §14.2 themselves identify as *the* magnitude representation — enters in Phase 4 (`06` §32).

**Evidence (external).** Fraction magnitude understanding, measured via number-line estimation, is a robust predictor of later mathematics achievement, and brief number-line training improved fraction magnitude performance where area-model training did not transfer. [Hamdan & Gunderson 2017, summarized in an IES-funded intervention report](https://files.eric.ed.gov/fulltext/EJ1352984.pdf "citation"), [Torbeyns et al. 2015, Learning and Instruction](https://siegler.tc.columbia.edu/wp-content/uploads/2019/02/2015-Torbeyns-etal-Bridging-facsimile.pdf "citation") The IES practice guide recommends number lines for fraction magnitude in grades 3–6 and specifically *double number lines* for making unlike-denominator equivalence visible. [WWC/IES, Assisting Students Struggling with Mathematics](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC-PraxGuide-Elementary-Math-Summary-508c.pdf "citation")

**Why it matters.** Bar-first build sequencing is defensible (bars carry subdivision mechanics), and I do not recommend reversing it. But if magnitude probes in Phase 3 run only on bars, the project will be teaching its most predictive skill through its weaker representation for the entire middle of the roadmap.

**Recommended response.** Test during the first slice / early Phase 3: consider pulling one minimal number-line magnitude episode family (placement relative to 0, 1/2, 1 — no operations, no bridges) into late Phase 3. This is a smaller commitment than full Phase 4 and directly de-risks the roadmap's biggest pedagogical bet. Owning document: `06-roadmap.md`; `06` §90's checkpoint already contains the right questions.

---

### Finding 8 — False-success guardrails don't cover guessing loops

**Severity:** Moderate · **Confidence:** Medium

**Evidence (internal).** The false-success surface is otherwise well covered: scaffold leakage (`05` §19), visual dependency (`02` §74), false conceptualism (`01` §36), false fluency (`01` §37). The gap: `02` §39 endorses "small constrained choice" inputs (e.g., selecting among plausible common denominators), and nothing anywhere addresses rapid trial-and-error — a child clicking 6, then 8, then 12 produces a "correct common-denominator selection" that feeds the fading evidence model (`01` §28) as if it were reasoning. Error classification (`03` §62) catalogs *wrong answer shapes*, not *attempt process*.

**Why it matters.** Scaffold fading is evidence-based; corrupted evidence corrupts the fading decision, and this is the cheapest corruption channel in the design.

**Recommended response.** Revise `03-math-and-content-model.md` §62 (or `01` §28) to add process-level classifications — e.g., multiple rapid failed attempts on a constrained choice are evidence of guessing, not of partial understanding — and let `02` §23 define the response (offer a hint rather than allow a fourth guess). Moderate effort, belongs before Phase 6 hardens the fading policy.

---

### Finding 9 — Authored-content combinatorics will strain the quality model

**Severity:** Moderate · **Confidence:** Medium (design judgment)

**Evidence (internal).** Multiply the authored surfaces: 6 hint levels (`02` §51) × ~9 error classifications (`01` §22) × 10+ problem families (`03` §29–44) × prompt-variant sets (`02` §13) × scaffold states. `05` §36, §60–61 then require equivalence review, escalation determinism, and language review for all of it. The founding set specifies quality *requirements* but never scopes an authoring budget or a tiering (which families get full hint towers vs. generic fallback). Phase 3 (`06` §27–30) promises broad family and error coverage in one phase.

**Why it matters.** The likeliest failure mode of the whole plan is not bad math but authorial exhaustion: hint towers that are thin, duplicated, or quietly undeterministic, discovered at Phase 3 scale.

**Recommended response.** Explicitly investigate before Phase 3: define in `05-quality-and-validation.md` (or a content-governance note in `04` §34) which (family × error × scaffold) cells get fully authored hint towers and which get a reviewed generic path. Also adopt a content-template discipline (hints parameterized by mathematical state, `04` §66 already supports this) so the combinatorics collapse into templates × data rather than prose × cells.

---

### Finding 10 — Math/content model minor items

**Severity:** Low · **Confidence:** High

**Evidence (internal).** (a) `03-math-and-content-model.md` §11 introduces "**pedagogically convenient denominator**" as a third concept alongside valid/least — it is never defined, used, or referenced again; an orphan concept awaiting drift. (b) The misconception catalog (`01` §22) omits two well-documented patterns relevant to scope: mixed-number juxtaposition read as multiplication (`2 3/4` as `2 × 3/4`), and cross-multiplication leakage into addition — since `03` §62 makes this list the anchor for implemented error classification, additions later will look like afterthoughts. (c) Seed-brief consistency: the seed's proposed `src/` folders (math/content/interaction/render/app) have no obvious home for the Scene Model, Session Model, and Persistence layers of `04` §4 — not a contradiction (the seed explicitly defers ratification to the first spike), but the spike should be told to reconcile them.

**Recommended response.** Revise `03` §11 (define or delete the third denominator concept) and extend `01` §22 during the owner pass; note the folder/layer mapping in the spike brief. Low urgency.

---

### Finding 11 — Privacy posture is sound; two small forward notes

**Severity:** Low · **Confidence:** High

**Evidence (external).** Because the core product collects nothing and stores only locally, COPPA's obligations are largely not triggered — the Rule applies to operators who *collect* personal information from children. The FTC nonetheless recommends that child-directed sites post a privacy policy even when they collect nothing, so parents can verify practices. [FTC, Complying with COPPA FAQ C.1](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions "citation") Two residual points: GitHub Pages as the hosting third party keeps server logs (a fact worth one honest sentence in that policy), and the 2025 COPPA amendments (full compliance by April 2026) raise the cost of the *stretch* telemetry/cloud goals — which the roadmap already gates behind privacy review (`06` §72, §79).

**Recommended response.** Add "publish a plain-language privacy statement (nothing leaves the device)" to the `06` §70 core privacy review checklist. Owning document: `06-roadmap.md`. Retain the current design otherwise — the no-collection architecture is a genuine compliance asset.

---

### Finding 12 — Security: low present risk, one forward flag

**Severity:** Low · **Confidence:** High

The static, dependency-skeptical (`04` §60), no-accounts posture keeps current risk genuinely low — I will not manufacture threats. One forward flag: `06` §78's shareable practice links will introduce URL/configuration parsing, the classic injection/XSS vector for static apps. When that stretch feature is designed, it needs a strict schema-validation rule (parse, validate, reject — never interpolate into DOM/HTML). A single sentence in `06` §78 suffices. Also note the repo currently carries no LICENSE file — for a public project inviting classroom use and agent-assisted contribution, "no license" means "all rights reserved," which quietly blocks the reuse the project implies it wants.

---

## 3. Cross-document conflicts and normalization issues

Beyond Findings 1 and 3 (the two real ones):

- **Scaffold/support vocabulary** (Finding 3) is the only systematic normalization defect. The lists in `00` §6, `02` §21, `06` §46, plus the two unmapped ladders in `01` §26 and `02` §22, are exactly the drift-prone duplication `00` §26 warns about.
- **Anti-simultaneity vs. symbolic co-presence** (Finding 1) is the only true behavioral contradiction: `00` §2 as written forbids what `02` §19/§44 and `06` §18 require.
- **Benign repetition I checked and would not flag:** the `2/3 + 1/4` canonical example recurring across all documents is deliberate and valuable anchoring; "correct work stays correct" appearing in `02` §26 (behavior) and `05` §63 (test requirement) is proper owner/validator separation; error-pattern lists in `01` §22 (interpretation) vs. `03` §62 (classification) are explicitly disclaimed as different concerns.
- **Roadmap/spec mismatch:** the Phase 6–7 exit gates vs. Phase 8 persistence (Finding 4) is the only sequencing inconsistency I found. `03` §11's orphan concept (Finding 10a) is the only dangling definition.
- Terminology ("renaming," "common unit," "composition/decomposition," "episode," "beat," "bridge") is otherwise remarkably consistent across ~12,000 lines — the normalization effort mostly succeeded.

---

## 4. Assumptions that survived scrutiny

I actively challenged each of the following and found them defensible or strong:

1. **"Representations should transform rather than multiply."** The strongest external evidence in the project's favor: multiple visuals helped only with connection prompts, and the successful tutor delivered one visual at a time across activities. [Rau & Matthews 2017](https://website.education.wisc.edu/rau-lab/pubs/RauMatthews2017_ZDM.pdf "citation") The flaw is the overstated phrasing (Finding 1), not the design.
2. **"Ask before telling / prediction before animation."** Aligned with generative-learning and mental-animation findings — prediction from static states improved comprehension more than passive viewing, and self-pacing is a documented countermeasure to transient load. [Hegarty et al., summarized in AJET](https://ajet.org.au/index.php/AJET/article/download/885/163/3039 "citation"), [Wong et al. 2012](https://eric.ed.gov/?id=EJ978021 "citation") The docs' inspectable-end-state (`02` §37) and replay (`02` §38) rules are textbook transient-information countermeasures.
3. **"Equivalence as renaming; common denominators as common units; LCD as efficiency."** Matches current fraction-pedagogy consensus and directly targets documented whole-number-bias errors. [Error-patterns study, 4th grade](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5690543/ "citation")
4. **"Deterministic authored narrative over runtime generative explanation."** For a child-facing math product, this is simply correct on correctness, testability, privacy, and cost grounds; the stretch-gated AI posture (`06` §86) is the right hedge.
5. **"Interleaving follows initial stability."** Consistent with blocked-then-interleaved findings in fraction tutors and the wider interleaving literature; the docs avoid both extremes explicitly (`01` §30).
6. **"Static hosting suffices for core."** Nothing in the core instructional loop requires a server; the privacy and reliability benefits are real (Finding 11).
7. **Bar-first build order (with a caveat).** Bars genuinely carry subdivision/regrouping mechanics better; the caveat — magnitude's best representation arrives late — is Finding 7, a timing adjustment rather than a reversal.
8. **Scaffold fading, evidence-based and skill-attached.** Matches worked-example fading and expertise-reversal research; the docs unusually also guard the *over*-scaffolding direction (`01` §35, `05` §20).

---

## 5. Missing or underdeveloped concerns

**Should be addressed before development:**

- Reduced-motion/screen-reader mechanism for transformations (Finding 2).
- Entry/placement model (Finding 6).
- Scaffold-vocabulary normalization (Finding 3).
- A one-paragraph curriculum anchor (e.g., CCSS 3.NF/4.NF/5.NF mapping) in `01` — not to constrain design, but to define "upper-elementary" expectations and ease classroom credibility. Cheap to add now, annoying to retrofit.
- A LICENSE file and the plain-language privacy statement (Findings 11–12).

**Can reasonably wait for implementation or learner testing:**

- Dyscalculia and learning-difference accommodations beyond current accessibility lists (research suggests magnitude-focused design helps these learners, which the design already does).
- Device-sharing semantics for local progress (needed by Phase 8, flagged now via Finding 4).
- Fraction/mixed-number symbolic *input* mechanics on keyboard and mobile (genuinely awkward, but an implementation-detail problem the first slice will force).
- Prompt/hint authoring budget and tiering (Finding 9 — needed by Phase 3, not Phase 1).
- Localization, motivational structure, audio — correctly stretch-gated already.

---

## 6. Research findings

1. **Fraction magnitude and number lines.** Fraction magnitude knowledge (measured by number-line estimation) predicts later mathematics achievement bidirectionally through grades 4–6; number-line training transferred to untrained magnitude tasks where area-model training did not. Directly supports FractionFlow's magnitude goals and number-line inclusion; cuts slightly against Phase-4-only timing (Finding 7). Limitation: effects are from tutor/intervention studies, not this product; transfer to a self-directed web app is unproven. [Torbeyns et al. 2015](https://siegler.tc.columbia.edu/wp-content/uploads/2019/02/2015-Torbeyns-etal-Bridging-facsimile.pdf "citation"), [IES/WWC practice guide](https://ies.ed.gov/ncee/wwc/Docs/PracticeGuide/WWC-PraxGuide-Elementary-Math-Summary-508c.pdf "citation"), [Dyson et al. 2018 via ERIC](https://files.eric.ed.gov/fulltext/EJ1352984.pdf "citation")
2. **Animation and transient information.** Animations can outperform statics for short, simple segments but impose working-memory costs as interactivity rises; countermeasures are self-pacing, segmentation, and persistent key frames. FractionFlow's prediction-first, inspectable-end-state, replay design embodies these; the gap is the accessible non-animated form of the *relationship* (Finding 2). Limitation: most studies are adult/older-student procedural content, not child fraction semantics. [Wong et al. 2012](https://eric.ed.gov/?id=EJ978021 "citation"), [Ayres & Paas 2007 via Springer](https://link.springer.com/article/10.1007/s11423-012-9276-z "citation")
3. **Multiple representations.** Benefits are conditional on learners actively making connections (self-explanation prompts); one-visual-at-a-time sequencing with prompts worked. Strongly supports the bridge-episode design and `01` §36's "false conceptualism" warning. [Rau & Matthews 2017](https://website.education.wisc.edu/rau-lab/pubs/RauMatthews2017_ZDM.pdf "citation")
4. **Error patterns.** Whole-number bias dominates unlike-denominator errors; magnitude-focused tutoring outperformed part-whole-focused core instruction for low achievers. Validates the misconception catalog's center of gravity. [NCBI/PMC error-patterns study](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5690543/ "citation")
5. **COPPA.** No collection → largely out of scope; privacy policy still recommended; 2025 amendments raise stretch-goal costs. [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions "citation"), [Davis Polk on 2026 enforcement](https://www.davispolk.com/insights/client-update/ftc-prioritizes-coppa-enforcement-new-compliance-obligations-take-effect "citation")

---

## 7. Existing-product comparison

No strong duplicate of the distinctive combination exists.

- **PhET (Fractions: Intro, Equality, Mixed Numbers, Build a Fraction)** — free, excellent, Chromebook-friendly exploratory sims covering equivalence with bars, circles, and number lines. But they are sandboxes: no authored narrative, no operations practice with error classification, no scaffold fading, no symbolic-independence arc. Closest on visuals, farthest on pedagogy.
- **The Fractions Tutor (Rau, Aleven, Rummel)** — the closest *instructional* relative: step-level hints, multiple representations, self-explanation prompts, research-validated learning gains. It is a research platform, not a maintained free public product, and its UX is tutor-form style rather than calm narrative. It validates the design space rather than occupying it. [Rau et al., AIED 2009](https://www.semanticscholar.org/paper/Intelligent-Tutoring-Systems-with-Multiple-and-of-Rau-Aleven/94fc47be9a795b27c0b3b5608ca599b27bc04bba "citation")
- **Khan Academy and worksheet-adjacent sites** — unlike-denominator practice with hints and occasional number-line items, but no linked morphing representations, no unit-first conceptual model, account-centric and dashboard-shaped.

What FractionFlow would still add: vetted quantity-preserving transformations, evidence-based scaffold fading, bridge episodes as first-class transfer tasks, and the calm aesthetic. Building it remains justified. The honest caveat: PhET demonstrates how high the free-product polish bar already is for the visual layer alone, and FractionFlow plans to add narrative, adaptivity, and accessibility on top — with a volunteer-scale maintenance budget. That is a sustainability risk (see Finding 9), not a duplication problem.

---

## 8. Pre-development revision recommendations

Prioritized, selective — each with its owning document:

1. **`00-principles.md` §2** — rescope anti-simultaneity to competing *visual* representations; carve out symbolic co-presence and deliberate comparison juxtaposition. (Finding 1)
2. **`02-interaction-grammar.md` §72 + `05` §41** — define the named accessible mechanism (inspection/key-frame comparison view) that carries transformation relationships without motion, and make it a Phase 2 gate. (Finding 2)
3. **`02-interaction-grammar.md` §21** — make it the canonical scaffold-dimension list; convert `00` §6 and `06` §46 to references; map `01` §26's evidence continuum to `02` §22's support ladder. (Finding 3)
4. **`06-roadmap.md`** — pull minimal local scaffold-state continuity forward of (or into) Phase 6, or explicitly scope Phase 6–7 gates as within-session; note shared-device semantics. (Finding 4)
5. **`06-roadmap.md` §7/§25** — state the Phase 2 slice's assumed learner prerequisites and the usability-testing screening plan. (Finding 5)
6. **`01-instructional-model.md`** — add a short entry/placement section. (Finding 6)
7. **`03-math-and-content-model.md` §11, §62** — define or delete "pedagogically convenient denominator"; add process-level (guessing) classification hooks. (Findings 8, 10)

Deliberately *not* pre-development work: Finding 7 (prototype question), Finding 9 (needed by Phase 3), Findings 11–12 (small checklist additions).

---

## 9. Questions best answered by prototyping rather than specification

1. Does the subdivision animation (thirds → twelfths) actually read as "same amount, smaller pieces" to a 9-year-old — perceptually, not in principle?
2. Is the bar→number-line morph perceptible as identity-preserving, or does side-by-side juxtaposition beat it? (This also resolves Finding 2's mechanism choice.)
3. What prompt density do real children tolerate before the Notice/Reflect beats become a ritual they click through? (`05` §52 already plans to observe "whether they predict before animations or merely wait" — that is the right instrument.)
4. Does spatial symbol–visual tying (labels attached to bars/points) measurably help, or is clean adjacency enough? Determines how much dynamic-fraction-typography engineering is justified.
5. Can keyboard/screen-reader users perform number-line placement with the *same* reasoning demand as draggers — and what does that control actually look like?
6. Does a minimal number-line magnitude episode in Phase 3 move estimation behavior earlier? (Finding 7)
7. Do constrained-choice denominator prompts survive contact with guessers? (Finding 8)

---

## 10. Bottom line

**Preserve:** the exact-arithmetic contract and the validity/efficiency/preference separation; the misconception-centered error model; prediction-before-transformation; authored-deterministic narrative; bar-first-then-number-line representation strategy; static-first/no-accounts posture; the scaffold-leakage and false-conceptualism guardrails. These are the design's spine, and the external evidence I found supports more of it than it threatens.

**Change now (Markdown-cheap):** fix the overstated anti-simultaneity principle; name the non-animated mechanism that carries transformation relationships for reduced-motion and screen-reader users; normalize the scaffold vocabulary to one owner; pull minimal cross-session continuity ahead of the phases whose exit gates assume it; state the first slice's assumed learner; add an entry/placement model; delete or define the one orphan concept; add a license and a privacy-statement checklist item.

**Leave unresolved for prototyping:** whether morphing beats juxtaposition, prompt-density tolerance, the accessible placement control, and the magnitude-timing question. The roadmap's own checkpoint discipline (`06` §89–94) is well designed for exactly these — the founding set's biggest risk is not any single wrong decision but its quality bar colliding with its authoring budget at Phase 3 scale.

---

One note on process: per the prompt's constraints I made no repository changes and used no subagents; all seven founding documents, the seed brief, and the README were read in full, and every internal citation above was verified against the files in this session.
