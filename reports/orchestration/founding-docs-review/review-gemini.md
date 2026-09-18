Viewed founding-docs-review-prompt.md:1-800
Viewed founding-docs-review-prompt.md:801-987
Searched for files: *
Searched for files: *
Viewed README.md:1-74
Viewed project-seed.md:1-96
Viewed 00-principles.md:1-784
Viewed 01-instructional-model.md:1-800
Viewed 01-instructional-model.md:801-1554
Viewed 02-interaction-grammar.md:1-800
Viewed 02-interaction-grammar.md:801-1600
Viewed 02-interaction-grammar.md:1601-1694
Viewed 03-math-and-content-model.md:1-800
Viewed 03-math-and-content-model.md:801-1600
Viewed 03-math-and-content-model.md:1601-2218
Viewed 04-system-architecture.md:1-800
Viewed 04-system-architecture.md:801-1600
Viewed 04-system-architecture.md:1601-1823
Viewed 05-quality-and-validation.md:1-800
Viewed 05-quality-and-validation.md:801-1600
Viewed 05-quality-and-validation.md:1601-2157
Viewed 06-roadmap.md:1-800
Viewed 06-roadmap.md:801-1600
Viewed 06-roadmap.md:1601-1827
Viewed decision-log.md:1-32
Viewed open-questions.md:1-12
Searched for files: *
Searched for files: *
Searched for files: *
Used tool: search_web
Used tool: search_web
Used tool: search_web
Used tool: search_web

# FractionFlow Founding Documents — Independent Adversarial Review

**Reviewer Posture:** Independent, skeptical peer review  
**Scope of Review:** `docs/founding/00-principles.md` through `06-roadmap.md`, with context from `docs/project-seed.md` and `README.md`  
**Repository State:** Design and specification phase; advisory only (no repository files modified or committed)

---

### Publication & PII Audit

A thorough audit of the canonical founding documents (`docs/founding/00-principles.md` through `docs/founding/06-roadmap.md`), the seed brief (`docs/project-seed.md`), and the repository configuration was conducted against public repository safety standards.

- **Findings:** **Clean.** No personal identifiable information (PII), student or educator records, API keys, deployment secrets, internal network identifiers, or proprietary credentials were found.
- **Note on Remote Identifiers:** The repository remote points to `mrsmithelhs/FractionFlow`, which reflects the public GitHub account context and poses no privacy risk. The public-remote boundary defined in [00-principles.md:L560-575](../../../docs/founding/00-principles.md#L560-L575) is respected.

---

## 1. Overall Assessment

The founding specifications for **FractionFlow** represent an uncommonly ambitious, conceptually rich, and mathematically rigorous design for an elementary mathematics tool. Its greatest strength lies in its **philosophical and mathematical discipline**: the insistence on a deterministic, exact-arithmetic core completely decoupled from presentation logic ([03-math-and-content-model.md](../../../docs/founding/03-math-and-content-model.md)); the refusal to use runtime generative LLMs for mathematical truth; the elegant conceptual framing of common denominators as "common unit sizes" rather than arbitrary algorithmic rules ([01-instructional-model.md:L250-293](../../../docs/founding/01-instructional-model.md#L250-L293)); and the commitment to an ad-free, account-free, calm interface that fades scaffolds toward symbolic independence ([00-principles.md:L145-168](../../../docs/founding/00-principles.md#L145-L168)).

However, the specifications exhibit several **critical fragilities**:

1. **Physical and Geometrical Impossibilities in Proposed Morphs:** The documents repeatedly mandate that when a fraction bar transforms into a number line, its endpoint must remain "spatially fixed" to demonstrate invariance ([00-principles.md:L86-87](../../../docs/founding/00-principles.md#L86-L87), [02-interaction-grammar.md:L406-427](../../../docs/founding/02-interaction-grammar.md#L406-L427)). In responsive web design—particularly once number lines span beyond $1$ to support mixed numbers—maintaining an identical screen-coordinate anchor while changing axis domains is a geometric fallacy that will distort the unit scale and teach false spatial relationships.
2. **Dogmatic Anti-Simultaneous Representation Bias:** The founding documents assert that *"Multiple representations does not mean simultaneous representations"* ([00-principles.md:L65](../../../docs/founding/00-principles.md#L65)) and enforce serial replacement (morphing). This directly conflicts with cognitive science on representational connection-making (Ainsworth, 2006; Rau, Aleven, & Rummel, 2015), which shows that simultaneous, spatially contiguous juxtaposition with active visual signaling is often superior for novice sense-making, whereas sequential replacement strains working memory via the transient information effect.
3. **The Novice Usability Paradox in Phase 2:** The Roadmap ([06-roadmap.md:L205-233](../../../docs/founding/06-roadmap.md#L205-L233)) selects Stage E (unlike denominators where *both* fractions require renaming, e.g., $2/3 + 1/4$) as its very first vertical slice, while postponing like denominators (Stage C) and nested denominators (Stage D) to Phase 3. While this tests the full technical pipeline, it creates an instructional paradox: the first prototype cannot be validated with real novice learners because they lack the prerequisite concepts.
4. **Extreme Specification Volume and Duplication:** Spanning over 12,000 lines across 7 documents and ~540 numbered sections, the specifications repeat the exact same examples ($2/3 + 1/4 = 8/12 + 3/12 = 11/12$; $3\frac{1}{4} - 1\frac{5}{8}$) and anti-pattern lists across nearly every document. This severe lack of normalization creates an imminent danger of specification drift during implementation.

**Credibility as a Foundation:** The documents provide a **highly credible architectural and mathematical foundation**, but an **over-choreographed and partially conflicting interaction specification**. 

**Most Important Pre-Development Change:** Relax the dogmatic insistence on single-focal sequential morphing to permit side-by-side visual comparison during bridge episodes, and resolve the geometric impossibility of "fixed-coordinate anchors" across different mathematical scales.

---

## 2. Highest-Priority Findings

---

### Finding 1: Geometric and Representational Fallacy in "Fixed Coordinate Anchors" Across Scales
* **Severity:** **Critical**
* **Confidence:** **High**
* **Evidence:**
  * *Internal:* [00-principles.md:L86-87](../../../docs/founding/00-principles.md#L86-L87) (*"a shaded length flattening into a number line while its endpoint remains fixed"*); [02-interaction-grammar.md:L406-427](../../../docs/founding/02-interaction-grammar.md#L406-L427) (Principle 18: *"Maintain Visual Anchors During Transformation... useful anchors include total length, endpoint position"*); [02-interaction-grammar.md:L1578-1585](../../../docs/founding/02-interaction-grammar.md#L1578-L1585) (*"preserve the bar's total length... endpoint remains fixed... transform the bar into a line while the endpoint remains fixed"*); [04-system-architecture.md:L1731-1734](../../../docs/founding/04-system-architecture.md#L1731-L1734).
  * *External:* Tversky, Morrison, & Betrancourt (2002), *Animation: can it facilitate?*; W3C SVG 2 Coordinate Transformations.
* **Why It Matters:** A fraction bar represents a part-whole area bounded within $[0, 1]$ (or $[0, W]$), typically scaled to fill the available component container width. A number line is a continuous 1D coordinate axis that includes padding, origins, arrows, and an axis domain that extends from $0$ to at least $1$ (for proper fractions) or $0$ to $2, 3,$ or $4$ (for mixed numbers).
  If a $[0, 1]$ fraction bar for $2/3$ occupies $300\text{ px}$ on screen, its endpoint is at $x = 200\text{ px}$. If it morphs into a number line displaying the interval $[0, 2]$ (essential for Phase 5 mixed numbers or sums crossing 1), the number line's unit length is $150\text{ px}$, placing $2/3$ at $x = 100\text{ px}$. If the endpoint remains "fixed" at $x = 200\text{ px}$, the unit scale of the number line must stretch dynamically or break linearity, directly teaching false mathematics. Even on a $[0, 1]$ number line, axis margins and tick-label padding prevent exact pixel coincidence. Promising that "the point does not move" across representations conflates screen-pixel coordinates with mathematical coordinate space.
* **Recommended Response:** **Revise founding documents now.** Canonical owner: [docs/founding/02-interaction-grammar.md](../../../docs/founding/02-interaction-grammar.md) (with conforming edits to `00-principles.md` and `04-system-architecture.md`). Replace the requirement of a "spatially fixed physical endpoint" with *scale-aligned projection lines* or *synchronized bounding guides* that visually map the bar length to the number-line interval without forcing pixel immobility across different scales.

---

### Finding 2: Rejection of Simultaneous Co-Present Representations Violates Cognitive Contiguity
* **Severity:** **High**
* **Confidence:** **High**
* **Evidence:**
  * *Internal:* [00-principles.md:L50-66](../../../docs/founding/00-principles.md#L50-L66) (*"Multiple representations does not mean simultaneous representations... interface should ordinarily present one primary mathematical question... at a time"*); [02-interaction-grammar.md:L256-278](../../../docs/founding/02-interaction-grammar.md#L256-L278) (*"One Primary Mathematical Action at a Time"*); [02-interaction-grammar.md:L388-404](../../../docs/founding/02-interaction-grammar.md#L388-L404) (preferring morphing over replacement or side-by-side juxtaposition).
  * *External:* 
    * Ainsworth, S. (2006). *DeFT: A conceptual framework for considering learning with multiple representations.* Learning and Instruction, 16(3), 183-198.
    * Rau, M. A., Aleven, V., & Rummel, N. (2015). *Successful learning with multiple graphical representations.* Computers & Education, 86, 101-112.
    * Sweller, J., & Ayres, P. (2014). *The transient information effect.* In *Cognitive Load Theory*.
* **Why It Matters:** The specification correctly seeks to prevent "dashboard clutter." However, it overcorrects into dogmatic serialism. When a learner is asked to make connections between representations (e.g., in a Bridge Episode, [02-interaction-grammar.md:L685-719](../../../docs/founding/02-interaction-grammar.md#L685-L719)), replacing the bar with a number line forces the learner to hold the prior representation in working memory while interpreting the new one. This triggers the **transient information effect**, adding extraneous cognitive load. Rau et al. (2015) demonstrated in randomized trials with fraction learners that sense-making connection prompts require *simultaneous co-presence* with dynamic linking (e.g., highlighting corresponding parts simultaneously) so students can inspect the relational mapping at their own pace without memory decay.
* **Recommended Response:** **Revise founding documents now.** Canonical owner: [docs/founding/00-principles.md](../../../docs/founding/00-principles.md) (§2) and [docs/founding/02-interaction-grammar.md](../../../docs/founding/02-interaction-grammar.md) (§32). Clarify that while routine operational practice features a single focal representation, bridge and transfer episodes explicitly permit calm, vertically stacked, simultaneous juxtaposition with linked highlighting.

---

### Finding 3: Dynamic Acceptance of Non-Minimal Common Denominators Collides with Visual Feasibility Limits
* **Severity:** **High**
* **Confidence:** **High**
* **Evidence:**
  * *Internal:* [03-math-and-content-model.md:L1400-1411](../../../docs/founding/03-math-and-content-model.md#L1400-L1411) (*"The content model must never mark mathematically valid equivalence as incorrect solely because it differs from the canonical path"*); [03-math-and-content-model.md:L2079-2135](../../../docs/founding/03-math-and-content-model.md#L2079-L2135) (accepting 24, 36, 48 for $1/3 + 1/4$); [03-math-and-content-model.md:L1682-1701](../../../docs/founding/03-math-and-content-model.md#L1682-L1701) (*"Visual Feasibility Is a Content Constraint... maximum practical denominator"*); [04-system-architecture.md:L900-915](../../../docs/founding/04-system-architecture.md#L900-L915).
  * *External:* WCAG 2.2 Success Criterion 2.5.8 (Target Size — Minimum); Apple Human Interface Guidelines / Android Material Design touch targets ($48\times 48\text{ dp}$).
* **Why It Matters:** Suppose a learner calculating $1/3 + 1/4$ supplies $24$ or $48$ as the common denominator. Under §56 and §82, the system *must* accept 24 or 48 as valid. Under §72, the bar renderer must depict this subdivision. But on a mobile viewport ($360\text{ px}$ width) with a bar width of $300\text{ px}$, dividing into $48$ parts yields slices of $6.25\text{ px}$ width! Individual partition borders ($1\text{ px}$ each) will consume $16\%$ of the entire bar area, rendering ticks illegible, slice shading imperceptible, and touch selection impossible. If the renderer clamps or refuses to draw 48, it breaks the pipeline; if it draws 48, it violates visual feasibility (§68) and accessibility.
* **Recommended Response:** **Revise founding documents now.** Canonical owner: [docs/founding/03-math-and-content-model.md](../../../docs/founding/03-math-and-content-model.md) (§56, §68) and [docs/founding/02-interaction-grammar.md](../../../docs/founding/02-interaction-grammar.md). Formally specify the **Visual Threshold Rule**: for visual episodes, the system accepts valid non-minimal denominators up to a hard visual ceiling ($D \le 24$ on desktop, $D \le 16$ on mobile). If a student enters a valid denominator exceeding the visual ceiling, the system validates the mathematics symbolically, gently explains that the amount is too fine to draw clearly in bars, and gives the learner the choice to either use the LCD for the visual model or switch to a symbolic-only resolution.

---

### Finding 4: Phase 2 Vertical Slice Creates an Unviable Novice Usability Evaluation
* **Severity:** **High**
* **Confidence:** **Medium**
* **Evidence:**
  * *Internal:* [01-instructional-model.md:L675-792](../../../docs/founding/01-instructional-model.md#L675-L792) (Conceptual Progression: Stage A $\to$ B $\to$ C $\to$ D $\to$ E); [06-roadmap.md:L205-233](../../../docs/founding/06-roadmap.md#L205-L233) (Phase 2 Vertical Slice: Stage E, $2/3 + 1/4$); [06-roadmap.md:L594-611](../../../docs/founding/06-roadmap.md#L594-L611) (Phase 3 adds Stages C & D); [06-roadmap.md:L551-584](../../../docs/founding/06-roadmap.md#L551-L584) (Phase 2 Exit Gate requiring learner testing).
  * *External:* IES Practice Guide (Siegler et al., 2010), Recommendation 3: Step-by-step conceptual grounding; Cognitive Load Theory (Sweller, 2011).
* **Why It Matters:** The Phase 2 exit gate requires empirical usability review with target learners ([05-quality-and-validation.md:L1087-1124](../../../docs/founding/05-quality-and-validation.md#L1087-L1124)). But an upper-elementary learner who has not mastered like-denominator addition (Stage C) or nested denominators (Stage D, where only one fraction changes) cannot succeed at double-renaming (Stage E) without experiencing cognitive overload from prerequisite deficits. Testing Phase 2 on novices will produce false negatives against the UI; testing it on older students who already know the algorithm tests procedural recall rather than conceptual construction.
* **Recommended Response:** **Revise founding documents now.** Canonical owner: [docs/founding/06-roadmap.md](../../../docs/founding/06-roadmap.md) (§7, §16). Explicitly document that the Phase 2 vertical slice tests **conceptual repair** with learners who have already encountered fraction addition algorithms, OR broaden Phase 2 to implement a paired 2-problem slice: one nested denominator ($1/2 + 3/8$) followed by one relatively prime denominator ($2/3 + 1/4$).

---

### Finding 5: Accessibility of Non-Visual Equivalence Cannot Rely on Geometric Metaphors
* **Severity:** **High**
* **Confidence:** **High**
* **Evidence:**
  * *Internal:* [00-principles.md:L465-489](../../../docs/founding/00-principles.md#L465-L489) (Accessibility as Learning Design); [02-interaction-grammar.md:L1411-1426](../../../docs/founding/02-interaction-grammar.md#L1411-L1426) (*"Accessibility should preserve the narrative... preserve mathematical agency"*); [04-system-architecture.md:L1206-1224](../../../docs/founding/04-system-architecture.md#L1206-L1224); [05-quality-and-validation.md:L906-937](../../../docs/founding/05-quality-and-validation.md#L906-L937).
  * *External:* 
    * W3C WAI-ARIA Graphics Module 1.0; 
    * WCAG 2.2 Success Criterion 1.1.1 (Non-text Content);
    * Cryer, H., & Home, S. (2011). *Exploring accessibility of mathematical diagrams for visually impaired students.* RNIB Centre for Accessible Information.
* **Why It Matters:** The founding specifications state that screen-reader users must experience the same narrative of invariance and reasoning without the system doing the thinking for them. However, FractionFlow’s core pedagogical mechanism is *perceptual invariance through animated continuous visual subdivision* (seeing the shaded area remain static while cuts appear). For a screen-reader user, an ARIA announcement stating: *"The bar now has 12 pieces and 8 are selected"* presents only the static end-state. The sensory evidence of invariance is lost, reducing the accessible experience to a numeric entry form.
* **Recommended Response:** **Explicitly investigate before development.** Canonical owner: [docs/founding/05-quality-and-validation.md](../../../docs/founding/05-quality-and-validation.md) (§43) and [docs/founding/02-interaction-grammar.md](../../../docs/founding/02-interaction-grammar.md) (§72). Formulate an explicit auditory/textual narrative design for non-visual learners: e.g., using audio sonification (rhythmic ticking corresponding to subdivision frequencies) or a structured verbal inquiry model that explains the subdivision step-by-step rather than pretending visual graphics can be made 1:1 accessible through basic ARIA labels.

---

### Finding 6: School Chromebook Ephemeral Profile Wiping Breaks Scaffold Fading and Continuity
* **Severity:** **Moderate**
* **Confidence:** **High**
* **Evidence:**
  * *Internal:* [00-principles.md:L551-575](../../../docs/founding/00-principles.md#L551-L575) (Static, no accounts, local storage only); [04-system-architecture.md:L614-627](../../../docs/founding/04-system-architecture.md#L614-L627) (Local persistence preferred); [06-roadmap.md:L1086-1144](../../../docs/founding/06-roadmap.md#L1086-L1144) (Phase 8 Local Progress and Continuity).
  * *External:* Google Chrome Enterprise Policy Reference: `DeviceEphemeralUsersEnabled` and `ClearBrowsingDataOnExitList`.
* **Why It Matters:** In K-12 school districts, student Chromebooks are frequently configured with ephemeral profiles or automated browser data wiping on logout. In a strictly local-storage static app, a student's session history, scaffold fading levels, and mastery evidence will be deleted at the end of each class period. When the student returns the next day, the system will treat them as a first-time novice, resetting faded scaffolds back to introductory visual hand-holding.
* **Recommended Response:** **Revise founding documents now.** Canonical owner: [docs/founding/04-system-architecture.md](../../../docs/founding/04-system-architecture.md) (§30-31) and [docs/founding/06-roadmap.md](../../../docs/founding/06-roadmap.md) (§60-63). Introduce a zero-backend, privacy-preserving **Portable State Mechanism**: allow students to resume progress via an encrypted/compact base64 URL hash or a human-readable 4-word "progress passport" that can be copied or written down without requiring accounts, logins, or cloud storage.

---

### Finding 7: Missing Core Misconceptions: Gap Thinking and Tick-Mark Counting
* **Severity:** **Moderate**
* **Confidence:** **High**
* **Evidence:**
  * *Internal:* [01-instructional-model.md:L941-1084](../../../docs/founding/01-instructional-model.md#L941-L1084) (Misconceptions catalog); [03-math-and-content-model.md:L1543-1592](../../../docs/founding/03-math-and-content-model.md#L1543-L1592) (Error pattern classification).
  * *External:* 
    * Ni, Y., & Zhou, Y. D. (2005). *Teaching and learning fraction and rational numbers: The origins and implications of whole number bias.* Educational Psychologist, 40(1), 27-52.
    * Siegler, R. S., et al. (2010). *Developing effective fractions instruction for kindergarten through 8th grade.* IES Practice Guide (NCEE 2010-4039).
* **Why It Matters:** While §22 covers adding denominators and scaling errors, it omits two pervasive fraction failure modes:
  1. **Gap Thinking:** When comparing fractions or evaluating equivalence, students compare the difference between numerator and denominator (e.g., claiming $3/4 = 7/8$ because both are "missing one piece", or $7/8 < 3/4$ because eighths are smaller than fourths).
  2. **Tick-Mark Counting:** On number lines, students routinely count the tick marks instead of the unit intervals (e.g., counting marks $0, 1/3, 2/3, 1$ as 4 items, concluding the line is partitioned into fourths).
* **Recommended Response:** **Revise founding documents now.** Canonical owner: [docs/founding/01-instructional-model.md](../../../docs/founding/01-instructional-model.md) (§22) and [docs/founding/03-math-and-content-model.md](../../../docs/founding/03-math-and-content-model.md) (§62). Add explicit error detection rules and feedback responses for Gap Thinking and Tick-Mark Counting.

---

### Finding 8: Excessive Micro-Prompting Risks "Prediction Gaming" and Interaction Fatigue
* **Severity:** **Moderate**
* **Confidence:** **Medium**
* **Evidence:**
  * *Internal:* [00-principles.md:L415-436](../../../docs/founding/00-principles.md#L415-L436) (Principle 15: Ask Before Telling); [02-interaction-grammar.md:L616-633](../../../docs/founding/02-interaction-grammar.md#L616-L633) (§29: Prediction Should Precede Demonstration); [02-interaction-grammar.md:L1490-1541](../../../docs/founding/02-interaction-grammar.md#L1490-L1541) (§75: Canonical Episode Example with 7+ sequential decision beats).
  * *External:* Aleven, V., et al. (2016). *Instruction based on adaptive learning technologies.* In *Handbook of Research on Learning and Instruction*.
* **Why It Matters:** Prompting learners with 3-choice questions before an animation (e.g., *"Will the amount get larger, smaller, or stay the same?"*) quickly becomes a ritual where students blindly click "same" without reasoning. Simultaneously, breaking a single addition problem into 7 micro-questions (Notice $\to$ Decide unit $\to$ Predict invariance $\to$ Enter numerator $1$ $\to$ Enter numerator $2$ $\to$ Combine $\to$ Reflect) creates severe interaction fatigue, degrading the calm environment into a mechanical clerical sequence.
* **Recommended Response:** **Test during the first vertical slice.** Canonical owner: [docs/founding/02-interaction-grammar.md](../../../docs/founding/02-interaction-grammar.md) (§29-31). Eliminate 3-choice trivial invariance prompts during routine practice. Reserve prediction prompts strictly for structural milestones (e.g., predicting whether a sum crosses $1$ or whether regrouping will be needed).

---

## 3. Cross-Document Conflicts and Normalization Issues

1. **Pipeline Layer Definition Contradiction:**
   * `docs/project-seed.md` (L70-74), `AGENTS.md` (L147-151), and `00-principles.md` (L368-369) specify a **3-stage pipeline**:
     $$\text{mathematical state} \longrightarrow \text{instructional state} \longrightarrow \text{presentation}$$
   * In contrast, `04-system-architecture.md` (L45) specifies a **5-stage pipeline**:
     $$\text{Math model} \longrightarrow \text{problem instance} \longrightarrow \text{instructional state} \longrightarrow \text{scene state} \longrightarrow \text{presentation}$$
   * And `04-system-architecture.md` (L110-128) lists **9 distinct architectural layers** (adding Interaction Layer, Session/Progress Model, Application Shell, and Persistence Adapters).
   * *Resolution:* Reconcile the phrasing in `project-seed.md` and `00-principles.md` by explicitly noting that the 3-stage formulation is the high-level conceptual rule, while `04-system-architecture.md` owns the normative 5-stage data-flow pipeline and 9-layer component hierarchy.

2. **Scene Model Responsibility Overlap with Instructional State:**
   * In `04-system-architecture.md` (§14, L331-344), the Instructional Engine is defined as deciding *"what the system is currently showing."*
   * But in `04-system-architecture.md` (§16-17, L365-398), the Scene Model is defined as representing *"what mathematical objects and relationships should currently be perceptible... describing meaning, not pixels."*
   * *Resolution:* Clearly designate `04-system-architecture.md` §16 as owning visual semantics: the Instructional Engine decides *learner agency and pedagogical visibility rules*, while the Scene Model translates those rules into an abstract, renderer-agnostic geometric scene graph.

3. **Massive Content Duplication and Specification Drift Risk:**
   * The canonical problem $2/3 + 1/4 = 8/12 + 3/12 = 11/12$ is defined and dissected in full detail across **all seven documents**: `00` (§4), `01` (§6), `02` (§75), `03` (§80), `04` (§91), `05` (§49), and `06` (§7).
   * The mixed-number example $3\frac{1}{4} - 1\frac{5}{8} = 2\frac{10}{8} - 1\frac{5}{8} = 1\frac{5}{8}$ is duplicated across `01` (§12), `02` (§48), `03` (§81), `04` (§43), `05` (§49), and `06` (§43).
   * Lists of anti-patterns (anti-dashboards, anti-gamification) are repeated across `00`, `02`, `03`, `04`, and `05`.
   * *Resolution:* Conduct an owner normalization pass. Move normative mathematical examples exclusively to `03-math-and-content-model.md`, narrative choreography exclusively to `02-interaction-grammar.md`, and replace duplicate occurrences with concise cross-references.

---

## 4. Assumptions That Survived Scrutiny

During the adversarial review, several core assumptions were rigorously challenged but found to be robust, well-reasoned, and worth defending:

1. **Exact Deterministic Fraction Core with Zero DOM / Zero Floating-Point Arithmetic:**
   * *Challenge:* Why build a custom exact arithmetic engine instead of standard JavaScript `Number` math with epsilon rounding or an existing math library?
   * *Defense:* Floating-point math inevitably creates binary rounding artifacts ($1/3 \to 0.3333333333333333$). In fraction education, $1/3$ is an exact rational quantity. A zero-dependency, pure exact arithmetic core running headlessly in Node enables exhaustive property-based testing ($a/b + c/d = (ad+bc)/bd$) and ensures absolute determinism. This design choice is unimpeachable.
2. **Exclusion of Runtime Generative AI / LLM Tutors:**
   * *Challenge:* Would a natural language tutor or conversational LLM provide more personalized, responsive assistance for confused children?
   * *Defense:* LLMs are non-deterministic, prone to subtle mathematical hallucination, introduce significant latency, require costly server infrastructure/API tokens, and open severe child-privacy/COPPA vulnerabilities. Authored, reviewed prompt families and deterministic state machines provide mathematically trustworthy, reproducible, and instantaneous instruction at zero operating cost.
3. **Framing Common Denominators as "Common Unit Sizes":**
   * *Challenge:* Why not teach the standard Least Common Multiple (LCM) algorithm directly, which is faster and scales to algebra?
   * *Defense:* Modern mathematics education research (Wu, 2001, 2008; Beckmann, 2017) demonstrates that memorizing LCM algorithms without unit meaning is the primary source of the "add numerators and add denominators" error ($1/3 + 1/4 = 2/7$). Grounding common denominators in unit resizing creates durable mental models that transfer to polynomial rational expressions.
4. **Treating Mixed-Number Regrouping as Equivalence ($1 = d/d$) Rather than Digit Borrowing:**
   * *Challenge:* Why not teach children to convert all mixed numbers to improper fractions, subtract, and convert back?
   * *Defense:* Converting to improper fractions (e.g., $15\frac{1}{8} - 9\frac{7}{8} \to 121/8 - 79/8$) leads to severe arithmetic burden and errors with larger whole numbers. Grounding decomposition in $3\frac{2}{8} = 2 + 8/8 + 2/8 = 2\frac{10}{8}$ reinforces that regrouping in fractions is identical in principle to regrouping in base-10, preserving mathematical coherence.
5. **Static GitHub Pages Deployment Architecture:**
   * *Challenge:* Does a static-only architecture unnecessarily cripple the product by preventing user accounts, classrooms, and cloud sync?
   * *Defense:* Static hosting guarantees that the product remains completely free, private, zero-maintenance, and impervious to server downtime or funding exhaustion. For an educational public good, this posture guarantees longevity.

---

## 5. Missing or Underdeveloped Concerns

### Issues to Address Before Development Begins:
1. **Responsive Viewport Density Limits:** The specifications lack clear numeric thresholds for when fraction bars become unreadable. A maximum denominator cutoff for mobile screens (e.g., $D \le 12$ on viewports $< 400\text{ px}$; $D \le 24$ on desktop) must be formally specified in `03-math-and-content-model.md`.
2. **Definition of "Session End" and Completion Criteria:** `06-roadmap.md` §57 states that a session should have a natural stopping point rather than an endless stream. However, nowhere is it specified how long a session lasts (e.g., 5 problems? 10 minutes?), how completion is signaled, or how a child safely pauses.
3. **Specification of Input Mechanics for Symbolic Entry:** The interaction grammar leaves symbolic input vague. On mobile devices, triggering the system soft keyboard covers half the screen and causes severe viewport jitter. A dedicated, calm on-screen math keypad (digits, fraction bar, backspace) must be specified for mobile viewports.

### Issues That Can Safely Wait for Implementation or Prototyping:
1. **Exact Animation Curves and Durations:** Easing curves (e.g., cubic-bezier) and exact millisecond timings are best tuned empirically during the Phase 2 spike.
2. **Audio/Earcon Styling:** Non-essential audio feedback can wait until core visual-spatial interactions are validated.
3. **Problem Generation Seed Hashing:** The specific PRNG algorithm (e.g., Mulberry32 vs. xoshiro128) is a standard implementation detail for the Math Core spike.

---

## 6. Research Findings

### 1. The Transient Information Effect in Dynamic Educational Animations
* **Sources:** Sweller & Ayres (2014); Lowe (2003, 2004); Betrancourt (2005).
* **Question Addressed:** Does continuous animation of mathematical transformations improve student learning compared to static representations?
* **Findings:** Animation of complex continuous transformations imposes significant cognitive load because transient information vanishes as the animation progresses. Learners frequently suffer from the "illusion of understanding"—they perceive smooth motion and assume they understand the underlying process, but fail post-tests of recall and problem solving. Static, user-paced graphics or animations with persistent visual traces (leaving ghosted outlines of the original units) consistently outperform continuous ephemeral morphs.
* **Application to FractionFlow:** FractionFlow’s reliance on animated subdivisions and morphs must not rely on fleeting motion. When a fraction bar subdivides, ghosted tick marks or visual brackets showing the original partition boundaries must remain permanently visible after the motion stops.

### 2. Learning with Multiple Representations (MGRs) in Mathematics
* **Sources:** Rau, Aleven, & Rummel (2015); Ainsworth (2006).
* **Question Addressed:** Should multiple representations be shown sequentially or simultaneously?
* **Findings:** In studies using the *Fractions Tutor*, Rau et al. found that students do not automatically induce connections across representations when presented serially. Active connection-making requires **sense-making support before perceptual fluency building**. Simultaneous presentation of two representations with coordinated visual cues (e.g., color-coded brackets mapping a $1/3$ bar directly to the $0$ to $1/3$ interval on a number line) significantly improves conceptual transfer compared to isolated sequential views.
* **Application to FractionFlow:** Supports revising `00-principles.md` and `02-interaction-grammar.md` to allow deliberate side-by-side co-presence during Bridge Episodes.

### 3. Number Lines and the Linear Representation of Fraction Magnitude
* **Sources:** Siegler, Fazio, Bailey, & Schneider (2013); IES Practice Guide (Siegler et al., 2010).
* **Question Addressed:** When and how should number lines be introduced relative to part-whole area models?
* **Findings:** Area models (bars and circles) strongly support initial part-whole understanding and unit subdivision, but can trap students in viewing fractions as "parts of pizzas" rather than actual numbers with magnitude. Number lines are the single most effective tool for overcoming the whole-number bias and developing magnitude understanding.
* **Application to FractionFlow:** Validates FractionFlow’s progression from fraction bars (Phase 2–3) to number lines (Phase 4), but reinforces that number lines must focus on *magnitude placement relative to benchmarks ($0, 1/2, 1$)* rather than simply copying bar subdivision mechanics.

---

## 7. Existing-Product Comparison

An analysis of leading free fraction-learning environments confirms that FractionFlow’s proposed combination is distinctive, but highlights key boundary distinctions:

| Product | Strengths | Limitations Relative to FractionFlow |
| :--- | :--- | :--- |
| **The Math Learning Center (MLC) Fractions & Number Line Apps** | Free, browser-based, no login. Superb visual fraction bars and number lines with custom partition sliders. | **Pure manipulative sandboxes.** No automated problem generation, no instructional narrative, no scaffold fading, and no step-level validation. Requires a live teacher to direct the lesson. |
| **PhET Interactive Simulations (Fraction Matcher, Fractions Intro)** | High visual polish, engaging game mechanics, excellent interactive balance scales and area models. | **Exploratory simulation / game matching.** Does not guide students through multi-step unlike-denominator operations ($2/3 + 1/4$), does not fade scaffolds toward symbolic notation, and does not provide structured local error feedback. |
| **Khan Academy** | Comprehensive curriculum coverage, extensive practice sets, strong mastery tracking. | **Standard worksheet/drill UI with static video hints.** Exercises rely on static diagrams and multiple-choice inputs; lacks interactive transforming representations where the math *is* the interface. |
| **Desmos Classroom / Amplify** | Highly interactive, screen-by-screen conceptual progressions with dynamic representations. | **Classroom/teacher-centric.** Designed for teacher dashboards and synchronized cohort pacing, not an independent, self-contained, calm practice tool with automatic scaffold fading. |

**Conclusion:** FractionFlow has a **clear and valuable niche**: an independent, calm, free, browser-based learning environment that combines deterministic problem generation, interactive transforming representations, and systematic scaffold fading toward symbolic fluency. Existing tools are either unguided sandboxes (MLC, PhET) or static procedural drills (Khan Academy). FractionFlow's value proposition is fully justified.

---

## 8. Pre-Development Revision Recommendations

Before the orchestrator initializes the first implementation packets, the project owner should apply the following prioritized revisions directly to the founding documents:

1. **Fix the Representational Fallacy of Fixed-Coordinate Morphs:**
   * *Owning Document:* [docs/founding/02-interaction-grammar.md](../../../docs/founding/02-interaction-grammar.md) (§18, §76) and [docs/founding/00-principles.md](../../../docs/founding/00-principles.md) (§3).
   * *Action:* Replace the mandate that "the endpoint remains spatially fixed during transformation" with a requirement for **scale-aligned projection guides** or vertical alignment brackets connecting representations, acknowledging that coordinate domains change between bars and number lines.
2. **Authorize Purposeful Simultaneous Co-Presence During Bridge Episodes:**
   * *Owning Document:* [docs/founding/00-principles.md](../../../docs/founding/00-principles.md) (§2) and [docs/founding/02-interaction-grammar.md](../../../docs/founding/02-interaction-grammar.md) (§32).
   * *Action:* Explicitly permit calm, vertically stacked, simultaneous representations during Bridge Episodes to facilitate active connection-making without transient memory loss.
3. **Establish the Visual Feasibility & Non-LCD Input Threshold:**
   * *Owning Document:* [docs/founding/03-math-and-content-model.md](../../../docs/founding/03-math-and-content-model.md) (§56, §68).
   * *Action:* Add an explicit rule governing valid non-minimal common denominators that exceed visual rendering limits ($D > 24$), routing them gracefully to symbolic resolution rather than crashing the visual renderer.
4. **Catalogue Missing Misconceptions (Gap Thinking & Tick Counting):**
   * *Owning Document:* [docs/founding/01-instructional-model.md](../../../docs/founding/01-instructional-model.md) (§22) and [docs/founding/03-math-and-content-model.md](../../../docs/founding/03-math-and-content-model.md) (§62).
   * *Action:* Formally document error patterns and instructional responses for Gap Thinking ($3/4 = 7/8$) and Tick-Mark Counting on number lines.
5. **Clarify Phase 2 Evaluation Target Learner Cohort:**
   * *Owning Document:* [docs/founding/06-roadmap.md](../../../docs/founding/06-roadmap.md) (§7, §16, §25).
   * *Action:* Document that Phase 2 user testing targets **conceptual repair** with upper-elementary learners who have already been introduced to fraction operations, OR pair the slice with an introductory nested-denominator problem ($1/2 + 3/8$).
6. **Specify a Zero-Backend Portable State Mechanism:**
   * *Owning Document:* [docs/founding/04-system-architecture.md](../../../docs/founding/04-system-architecture.md) (§30-31).
   * *Action:* Define a URL hash or compact passphrase export to preserve student progress across ephemeral school Chromebook sessions.
7. **Editorial De-Duplication Pass:**
   * *Owning Document:* All files in `docs/founding/`.
   * *Action:* Strip repeated narrative walkthroughs and anti-pattern lists; centralize them in their canonical owners.

---

## 9. Questions Best Answered by Prototyping Rather Than Specification

The following questions should not be debated further in markdown; they must be answered empirically during the Phase 1 and Phase 2 implementation spikes:

1. **Perceptual Legibility of Bar Subdivision:** Does an animated subdivision of thirds into twelfths actually convey multiplication by $4/4$, or does it look like arbitrary visual slicing? Does a static before-and-after with ghosted lines convey the concept more clearly than motion?
2. **Touch-Target Feasibility for Twelfths on Mobile:** Can an upper-elementary child reliably select individual twelfths on a $360\text{ px}$ smartphone screen, or does touch inaccuracy demand a zoom/magnification affordance?
3. **Optimal Prompt Density Threshold:** How many interactive questions can precede the final addition before a learner disengages and begins guessing?
4. **Legibility of In-Place Symbolic Updates:** Does updating symbolic notation directly beneath an animated bar feel natural, or does split attention between the bar and the equation cause learners to miss what changed?
5. **Mobile Virtual Keyboard Obstruction:** Does entering numbers via an on-screen custom number pad preserve the calm visual hierarchy, or does it crowd the fraction bar on small screens?

---

## 10. Bottom Line

* **What to Preserve:** 
  The core vision is exceptionally strong. Preserve the **deterministic, exact-arithmetic mathematical core**; the framing of **common denominators as common unit sizes**; the **fading of scaffolds toward independent symbolic computation**; the **strict unidirectional pipeline** ($\text{math} \to \text{instruction} \to \text{scene} \to \text{render}$); the **calm, ad-free, account-free static architecture**; and the treatment of **mixed-number regrouping as equivalence**.
* **What to Change Now:**
  Eliminate the mathematically and geometrically impossible **"fixed physical coordinate endpoint"** requirement for cross-representation morphs; relax the ban on **simultaneous representations** to permit side-by-side juxtaposition during Bridge Episodes; define the **Visual Threshold Rule** for non-minimal denominators; add **Gap Thinking** and **Tick-Mark Counting** to the misconception catalog; design a **zero-backend portable state mechanism** for school Chromebooks; and clarify that the Phase 2 vertical slice is evaluated as a **conceptual repair** tool.
* **What to Leave for Prototyping:**
  Animation timing curves, easing functions, mobile touch hit-box tolerances, and the exact balance between user-paced stepping versus automated animation.

The founding specifications provide an outstanding foundation. Once these calibrated revisions land, FractionFlow will be ready for the orchestrator to spin up and begin implementation of Phase 1.