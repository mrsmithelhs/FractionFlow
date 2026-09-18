# FractionFlow — External Research Report

**Compiled:** 2026-09-17
**Author:** Claude (Opus 5), lead reviewer, founding-documents review
**Source material:** four read-only `researcher` subagent briefs, reproduced verbatim in [`research/`](research/)
**Status:** Advisory. Supports [`review-claude.md`](review-claude.md) §6 and §7, but is intended to stand alone.

---

## What this is

During the independent adversarial review of the founding documents, I commissioned four
narrow research questions rather than one broad "evaluate FractionFlow" brief. The four
verbatim reports are preserved in [`research/`](research/):

| Brief | Question | Bears most on |
| --- | --- | --- |
| [01 — Animation vs. static graphics](research/01-animation-vs-static-graphics.md) | Does animating a mathematical transformation beat a static before/after pair? Does prediction-before-reveal work? | `00` §3, §7, §15 · `02` §6, §17, §29, §36–38 · `06` §23, §43 |
| [02 — Multiple representations](research/02-multiple-representations.md) | Simultaneous vs. sequential representations; do learners connect them spontaneously? | `00` §2, §10 · `01` §15–16, §18 · `02` §16, §19, §32–34 |
| [03 — Fraction pedagogy](research/03-fraction-pedagogy.md) | Number lines vs. area models; common units; LCD; misconceptions; simplification | `01` §4–7, §13, §19, §22 · `03` §11, §67 · `06` §32 |
| [04 — Existing-product overlap](research/04-existing-product-overlap.md) | Does a free tool already do this? | `00` §Purpose · `06` §2, §71 |

This report is the editorial layer the raw briefs lack: **what the evidence actually
supports, how confidently, and what each founding document should do about it.** Where I
disagree with a subagent's framing, I say so.

---

## How to read the briefs (important)

The four briefs are **subagent desk research, not a vetted literature review.** They are
worth preserving because they are specific, cited, and unusually honest about their own
limits — but three cautions apply before anything in them is cited in a founding document:

1. **One brief's tooling fabricated a citation.** In Brief 03, the agent's PDF fetch
   returned a wrong volume/issue/page for Hamdan & Gunderson (2017). The agent caught it by
   cross-checking PubMed, corrected it, and flagged it. That is the correct behaviour — but
   it means **every citation in these briefs should be verified against its DOI before it
   lands in a durable document.** This is exactly the discipline `05` §54 ("Do Not Overclaim
   Research Evidence") already asks for.
2. **PDF fetching failed on several primary sources.** The IES Practice Guide, the CCSS-M
   Progressions document, and Wu's fractions paper were all unreadable to the tooling. Claims
   attributed to them rest on secondary sources that quote them. The IES guide and the
   Progressions are the two most load-bearing documents for FractionFlow's instructional
   sequencing — both are free, and both are worth reading directly before the founding
   revisions land.
3. **Brief 03's agent reported a prompt-injection attempt** — a tool result containing a
   block styled as system instructions for a tool it did not have. It correctly disregarded
   it and reported it. No repository files were modified by any agent. I note it because it
   is a real characteristic of web research and the right thing to keep a record of.

The raw JSONL transcripts were cleaned up by the harness before they could be copied; the
final reports reproduced here are the complete substantive output.

---

## The seven findings that matter

### 1. Animation is the weakest-supported element of the founding design; prediction is the strongest

**Confidence: high.** Three independent meta-analyses converge on a small, heterogeneous
animation advantage — Höffler & Leutner (2007) d = 0.37; Berney & Bétrancourt (2016)
g = 0.226 across 140 comparisons, N = 7,036, I² = 78%; Castro-Alonso, Ayres & Sweller (2019)
g = 0.23. Ploetzner, Berney & Bétrancourt (2020) locate that advantage in **kinematic**
learning goals — how something moves through time — rather than **conceptual/structural**
ones. Fraction equivalence is a claim about invariance under repartitioning. There is no
motion to depict; subdividing a bar is a mathematical operation, not a physical process.
This is the category where animation's edge is weakest.

Berney & Bétrancourt add a moderator that cuts specifically at FractionFlow: animations of
**abstract** representations (formal notation, analytic diagrams) underperform iconic ones.
`02` §19 wants symbolic notation animated alongside the bar.

Against that, the **Predict-Observe-Explain** meta-analysis (Koyunlu Ünlü, 2024; 35 studies,
39 effects, N = 2,840) reports **g = 0.979** with low publication-bias evidence — and found
that adding technology or animation to the "observe" stage was **not** a significant
moderator (g = 1.019 without vs. 0.875 with). The active ingredient is the prediction, not
the reveal.

**What the documents should do:** `00` §7 owns this. Make *predict → reveal → leave both
states inspectable* the canonical pattern; animated transition becomes optional, skippable
and learner-triggered, always ending in a persistent static residue. `02` §37 ("Learners
Should Be Able to Inspect the Result") is already correct and should be promoted from a
supporting rule to the primary one.

**Why this is the highest-value change available:** it is the only revision in the whole
review that is evidence-backed *and* reduces cost. Responsive morphing, anchor preservation
across layouts, reduced-motion parity, symbolic labels tracking moving objects, and
screen-reader narration of transitions are all descendants of the animation bet. It also
inverts the accessibility story usefully: the reduced-motion path stops being a degraded
fallback and becomes the reference design.

**Transfer limitation, stated plainly:** almost all the quantitative evidence is from science
education, not mathematics, and none of it is fraction-specific. Brief 01 found **no
controlled comparison of animated subdivision vs. a static before/after pair for fraction
equivalence anywhere.** But the transfer argument (Ploetzner's kinematic/conceptual split)
predicts a *weaker* effect here than the pooled estimates, not a stronger one — so the
uncertainty does not rescue the animation bet.

---

### 2. Linked representations need explicit connection-making, and the documents ration exactly that

**Confidence: high. This is the most directly applicable evidence in the whole set** — same
domain, same grade band, same design question.

Rau, Aleven & Rummel (2015), *Journal of Educational Psychology* 107(1), 30–46, ran two
classroom experiments (n = 112 sixth-graders; n = 152 fourth/fifth-graders) with the
Fractions Tutor. Multiple graphical representations beat a single representation **only when
students were prompted to self-explain how the graphics mapped to numerator/denominator and
to the symbolic procedure.** Unprompted co-exposure did not reliably help.

Rau, Aleven & Rummel (2017), *Instructional Science* 45(3), 331–357 (n = 74, grades 3–5)
tested the follow-up question directly: **sense-making-first beat fluency-first.** Repeated
perceptual exposure did not produce sense-making; explicit connection-making did produce
later fluency. Ainsworth (1999) supplies the theory — "appreciating the links across multiple
representations is not automatic," and translation between representations is "complex and
cognitively demanding." Rittle-Johnson, Loehr & Durkin (2017) corroborate the mechanism
meta-analytically.

This cuts both ways for the founding set, and it is worth being precise about which way:

- It **supports** `00` §2's rejection of passive co-display. Showing two representations
  together is not the active ingredient. That instinct is right.
- It **challenges** `01` §18 ("Explanation Without Excessive Verbal Burden") and `02` §9
  ("Reflection should not occur after every problem"). The one intervention shown to make
  linked representations work in this exact population is the thing those sections most
  carefully ration.

**The tension is resolvable without abandoning either.** `01` §18's concern is *reading and
writing load*, which is a legitimate equity concern for struggling readers and multilingual
learners. Connection-making does not require prose. A **structured, menu-selected**
self-explanation — *"The bar and the number line show the same amount because: [the shaded
length is the same] / [the endpoint is at the same place] / [both have 12 pieces]"* —
delivers the demand at near-zero reading cost and yields a machine-checkable response rather
than an essay. That is my recommendation, not a claim about how Rau's tutor was implemented.

**What the documents should do:** `01` §18 owns the distinction between *verbal burden* (to
be minimized) and *connection-making demand* (to be required at bridges). `02` §33 then
requires every bridge episode to carry one structured connection-making prompt instead of a
concise orienting cue. Without this, `05` §58's own worry — that a bridge might be
"decorative rather than instructional" — is the predicted outcome rather than a risk.

---

### 3. "Bars before number lines" survives; deferring the number line to Phase 4 does not

**Confidence: medium-high**, and this is where I most want to correct my own subagent.

Brief 03 concludes that evidence "does not support 'bars must precede number lines
developmentally'" and points to Hamdan & Gunderson (2017), *Developmental Psychology* 53(3),
587–596 — an RCT in which number-line training beat area-model training on a later symbolic
fraction-comparison task. That is a real and important result, and the theoretical backing is
strong: Siegler, Thompson & Schneider (2011) make magnitude the organising construct of
numerical development, the IES Practice Guide (Siegler et al., 2010, NCEE 2010-4039) treats
number lines as cross-cutting rather than late, and Fuchs et al. (2017) built five successful
at-risk RCTs on the measurement interpretation.

**But the losing condition in Hamdan & Gunderson was a *circle*, not a bar** — and Gunderson
et al. (2019) isolate **unidimensionality** as the active feature. A fraction bar *is*
unidimensional. So this evidence does not indict the bar; if anything it recommends it, and
it recommends something more specific than the founding documents currently say.

What the evidence does indict is the **sequencing**. `06` defers the number line to Phase 4,
after the entire proper-fraction operation domain is built on bars — while `01` §19 Stage A
("Fractional units and magnitude") is the foundation of the whole progression, `01` §4
requires magnitude to be "integrated periodically into operational practice," and `06` §3
lists fractional units as a core instructional goal that `06` §66's Core Content Coverage
then omits entirely. The product's stated primary target (`01` §1) is the learner who can
imitate "multiply top and bottom" without understanding what the denominator describes.
That learner's deficit *is* Stage A. The roadmap builds Stage E first and Stage A never.

**What the documents should do:**

- `06` §66 must include fractional-unit and magnitude content; schedule Stage A/B focused
  episodes in Phase 3, where `06` §28 nearly does this already.
- Move basic number-line magnitude work into Phase 3; let Phase 4 be bridges and number-line
  *operations* rather than first contact.
- **The specific representational refinement worth making** (`01` §14.1 owns it, `02` §18
  follows): specify the fraction bar as a **length/measure model anchored at 0**, with
  shading always accumulating from the left origin — not as a "shade k of n boxes"
  part-whole model. `01` §14.1 already notes that the bar's "linear structure creates a
  useful conceptual bridge toward number lines"; this makes that structural rather than
  incidental. It is nearly free, it is what the unidimensionality evidence favours, and it
  turns the bar→number-line bridge into an axis relabel rather than a bespoke morph.

---

### 4. The documents' position on LCD and simplification is not just defensible — it is the standards writers' own

**Confidence: high for the textual claims; the causal claims are design rationale, not RCT findings.**

CCSS-M 5.NF.A.1's own worked example is `2/3 + 5/4 = 8/12 + 15/12 = 23/12`, and the general
method stated *inside the standard* is `a/b + c/d = (ad + bc)/bd` — the **product** of the
denominators, not the LCD. Curricular guidance built on the CCSS-M Progressions goes further:
finding a least common denominator "is a distraction from understanding algorithms for adding
or subtracting fractions." On simplification, there is no CCSS-M standard requiring lowest
terms, and lead writer William McCallum is on record: *"The question is, 'Why?' It's not
mathematically important."*

So `01` §7 ("Least Common Denominators Are an Efficiency, Not the Concept"), `01` §13, `03`
§57 and `03` §83 are all well-founded. These are positions many otherwise-good products get
wrong. **They should survive the revision pass intact.**

Two refinements the evidence suggests:

- **Say why the canonical path diverges from the standard.** `03` §55 designates the LCD as
  the canonical instructional path. That is the *right* choice for a visual model — the LCD
  keeps subdivisions renderable where the product of denominators often does not — but it is
  not what the standard models, and the reason should be written down rather than left to
  look like an oversight.
- **The product-of-denominators path is not an edge case; it is what many learners will be
  taught.** A learner applying the standard's own formula to the golden case `5/6 − 3/8`
  (`05` §49) offers 48. A bar in 48 parts at phone width is roughly 8 px per part. This is
  the collision documented as Finding 5 in `review-claude.md`, and this brief is what makes
  it a modal case rather than a hypothetical.

**Caveat worth honouring:** Brief 03 found **no** experimental study comparing LCD-first
against any-denominator instruction. The "early LCD emphasis causes difficulty" claim is
standards-writer rationale, corroborated across many curricular guides, not a measured
effect. Cite it as authoritative curricular guidance — which it is — and not as an RCT.

---

### 5. The bridge-frequency rule is asserted, and the one relevant study points the other way

**Confidence: medium** — the study is directly relevant but tests an adjacent question.

`02` §16 ("Representation Changes Should Be Rare Enough to Matter"), `02` §32 (bridges
"relatively infrequent"), `02` §34 and `01` §16 all assert that stable practice runs should
dominate and representation changes should be rare. No evidence is offered.

Rau, Aleven & Rummel (2013), *IJAIED* 23, with **n = 230 fourth- and fifth-graders**, found
that **interleaved practice across representations produced higher learning rates than
blocked practice.**

**The scope caveat matters and I want to be careful with it:** Rau tested alternation *across
problems in a set*, not co-display on one screen. This challenges the founding set's **bridge
frequency**, not its one-focal-model rule. The two are separable, and the documents currently
conflate them.

`06` §55 already has the right instinct — "Bridge frequency should eventually be informed by
learner use and review." `02` §32 should stop stating it as a settled principle and mark it
as a tuned parameter. This is a prototype question (see `review-claude.md` §9), not a
specification question.

---

### 6. Morphing is untested — it is a hypothesis wearing the clothes of a principle

**Confidence: high that the evidence is absent.**

Brief 02 searched specifically for a comparison of an animated morph between two fraction
representations against static side-by-side or sequential presentation in grades 3–6, and
found nothing. Brief 01 independently found nothing for animated partitioning vs. a static
pair. The design pattern is untested.

It is not *unreasonable* — three literatures converge to make it a principled hypothesis:
concreteness fading (Fyfe, McNeil, Son & Goldstone, 2014) is fundamentally gradual and
sequential and does beat both holding either extreme constant and abrupt switching;
Ainsworth's translation-cost analysis says the correspondence should be externalised rather
than left for the learner to infer; and spatial contiguity (Schroeder & Cenkci, 2018;
58 comparisons, n = 2,426, **g = 0.63**) favours integration for elements that must be read
together.

But `00` §3, `02` §17 and `06` §34 present it as near-axiomatic, and the architecture's most
expensive requirement rests on it. **Label it a hypothesis, prototype it, and do not let
Phase 2 depend on its being true.**

One genuine complication worth recording: Beege et al. (2019) found an **inverted U** for
spatial contiguity — extreme proximity crowds unrelated elements and reverses the benefit.
"Keep the label on the bar," yes. "Cram everything together," no.

---

### 7. The competitive gap is real, and the closest analogue is a research system nobody can use

**Confidence: medium-high** — but see the verification note below.

Brief 04's landscape survey found no single free tool delivering FractionFlow's combination,
and the fragmentation is specific rather than rhetorical:

- **Calm, free, account-free manipulative sandboxes** — PhET's five fraction sims, The Math
  Learning Center's two apps, Toy Theater, Didax, Mathigon Polypad — meet the calm/free bar
  and several handle equivalence-by-subdivision well. Polypad even has a "Rename" action
  philosophically close to `00` §4. But **none of them contains an addition or subtraction
  operation on two fractions at all.** The entire common-unit task is absent. They are silent
  tools needing a teacher wrapped around them.
- **Khan Academy** is the closest free *practice* match on the narrow visual-plus-symbolic
  unlike-denominator task, and is disqualified on exactly the axes FractionFlow defines
  itself against: account required for tracked use, plus energy points, badges, streaks,
  avatars and mastery dashboards (confirmed active 2025–26).
- **Desmos Classroom** contains teacher-authored activities that get closest to the actual
  arc, but they are crowd-quality-variable and need a teacher-hosted session code.
- **Illustrative Mathematics / Open Up Resources** is the closest match in *pedagogical
  philosophy* — Grade 5 Unit 6 teaches common denominators via equivalent-fraction diagrams
  — but it is a print-first, teacher-led curriculum whose interactive layer sits behind paid
  or educator-verified platforms.
- **The most useful finding is a negative one.** Rau, Aleven & Rummel's **Fractions Tutor**
  — the one system explicitly engineered around sequencing multiple linked fraction
  representations with self-explanation prompts, studied with 3,000+ fourth and fifth graders
  — **is not publicly accessible.** It lives behind CTAT/TutorShop research infrastructure.
  The system closest to FractionFlow's ambition exists, works, and is unavailable to any
  child.

**Two implications worth acting on:**

1. **The project is justified more clearly than the founding documents claim for
   themselves.** `00`'s Purpose section is modest about this. The gap is demonstrable.
2. **Mine the research program rather than rediscover it.** The Fractions Tutor's software is
   locked away; its *findings* are published. Rau, Aleven & Rummel (2009 / 2013 / 2015 /
   2017) bear directly on representation sequencing and connection-making prompts — findings
   2 and 5 above. This is the single best-value reading the project could do before Phase 2.

**Verification note:** the claim that PhET's fraction sims contain no addition/subtraction
operation is load-bearing for the "gap is real" conclusion and rests on sim descriptions,
repos and teacher guides rather than hands-on use. Five minutes with the sims would settle
it. Pricing and feature claims throughout Brief 04 were current on 2026-09-17 and will decay.

---

## What this evidence does *not* settle

Honest accounting, since `05` §54 asks for exactly this distinction:

| Question | Status |
| --- | --- |
| Does animated subdivision beat a static before/after pair *for fractions*? | **No direct evidence exists.** Prototype it. |
| Does bar→number-line morphing clarify equivalence better than side-by-side? | **No direct evidence exists.** Prototype it. |
| How often should bridge episodes occur? | One relevant study (interleaving > blocking), adjacent question. Tune it. |
| Does the common-unit *framing* improve learning, vs. being standards-aligned? | Curricular design principle, not a measured effect. |
| Does mandatory simplification harm understanding? | Standards-writer rationale, not an RCT. |
| Is FractionFlow's specific design effective? | **Nothing here bears on this.** `05` §54 is right: research-informed ≠ research-validated. |

The founding documents should keep making the distinction `05` §54 already draws. Nothing in
these briefs licenses a claim that FractionFlow works. What they license is a claim that
certain design choices are better-supported than others — and, in the case of animation, that
the project's defining bet is its least-supported one.

---

## Reading list, in priority order

If the owner reads only a few things before the founding revisions land:

1. **Rau, Aleven & Rummel (2015)**, *Journal of Educational Psychology* 107(1), 30–46 — why
   linked representations need prompted connection-making. The most directly applicable paper
   that exists for this product.
2. **IES Practice Guide**, *Developing Effective Fractions Instruction for K–8* (Siegler et
   al., 2010, NCEE 2010-4039) — free, authoritative, and the sequencing backbone. The
   subagent could not parse it; read it directly.
3. **Ploetzner, Berney & Bétrancourt (2020)**, *JCAL* 36, 838–860 — the kinematic/conceptual
   distinction that decides the animation question.
4. **CCSS-M Progressions, Number and Operations—Fractions** — free; settles LCD and
   simplification at the source rather than through a secondary curricular guide.
5. **Hamdan & Gunderson (2017)**, *Developmental Psychology* 53(3), 587–596, with
   **Gunderson et al. (2019)**, *JECP* — the number-line RCT and the unidimensionality
   follow-up that together justify designing the bar as a length model.
6. **Koyunlu Ünlü (2024)**, POE meta-analysis — the effect size that should reorder `00` §7
   and `00` §15.

---

## Provenance and method

Four `researcher` subagents were dispatched in parallel with narrow, self-contained briefs
(reproduced at the head of each file in [`research/`](research/)). Each was read-only with
respect to the repository; none modified any file. Per the review brief's delegation
guidance, no agent was asked to "review FractionFlow" — the project-level synthesis is mine,
and the findings above are my reading of their material, including where I disagree with it
(§3 most substantially).

Total subagent cost: roughly 416,000 tokens across 169 tool calls.
