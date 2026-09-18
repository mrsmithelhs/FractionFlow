# Research Brief 04 — Existing-Product Overlap

> **Provenance.** Produced by a read-only `researcher` subagent during the independent
> adversarial review of the FractionFlow founding documents (2026-09-17), commissioned by
> the Claude reviewer. Reproduced **verbatim** as returned; only HTML entity escapes have
> been decoded. See `../review-claude.md` §7 for how this was used, and
> `../research-report.md` for the lead reviewer's assessment of what is safe to rely on.
>
> **Caution.** The agent could not use these tools interactively — several PhET and Polypad
> pages are JS-rendered canvases that a text fetch cannot inspect. The load-bearing claim
> that **PhET's fraction sims contain no addition/subtraction of two fractions** rests on
> sim descriptions, repos and teacher guides rather than hands-on use. It is worth five
> minutes of direct verification before being relied on.
>
> **Pricing, feature and availability claims have a shelf life.** They were current as
> researched on 2026-09-17.

## Question put to the agent

Identify existing free or low-cost browser-based tools that overlap with FractionFlow's
distinctive combination: guided equivalence reasoning; unlike-denominator practice framed as
finding a common unit; linked bar/number-line/symbolic representations that transform into
one another; authored (non-AI) instructional narrative with deterministic exact math;
scaffold fading toward symbolic-only work; representation-transfer tasks; and a calm,
low-chrome interface with no points, badges, streaks or dashboards.

---

# Competitive Landscape Research: FractionFlow vs. Existing Free/Low-Cost Fraction Tools

## Method and confidence note

This is web-search-based research; I did not have hands-on access to run each tool interactively (several PhET/Polypad pages are JS-rendered canvases that plain text fetches can't inspect, so a few claims below rest on PhET's own marketing copy, GitHub repos, and third-party descriptions rather than direct interaction). Where I could not verify a claim independently across at least two sources, I've flagged it explicitly as uncertain rather than stated as fact.

---

## Tool-by-tool findings

### 1. PhET Interactive Simulations — Fractions: Intro, Fractions: Equality, Fractions: Mixed Numbers, Build a Fraction, Fraction Matcher

**Cost/account:** Free, open source, no account, no login, works offline-downloadable. ([phet.colorado.edu](https://phet.colorado.edu/en/simulations/fractions-equality))
**Type:** Manipulative sandbox ("Lab"/"Intro" screens: drag pieces, build shapes/numbers) + a matching/building **game** with star ratings and difficulty levels ([phet.colorado.edu/fraction-matcher](https://phet.colorado.edu/en/simulations/fraction-matcher), [phet.colorado.edu/build-a-fraction](https://phet.colorado.edu/en/simulations/build-a-fraction)).
**Covers:** Equivalence via subdividing shapes/pieces (close to "renaming/subdivision" spirit); shape, numeral, and (in Equality/Matcher) a number-line target are shown together and update in sync as you manipulate a fraction.
**Does NOT cover:** Across repeated searches (site descriptions, GitHub READMEs, teacher-guide references) I found **no evidence that any of these five sims contains an addition or subtraction operation on two fractions at all** — they build, compare, equate, and convert improper↔mixed, but never combine two unlike fractions into a sum/difference. That means the entire "common unit for combining fractions" task — the heart of FractionFlow's proposed content — is simply absent from the PhET fraction suite. There's also no authored narrative (these are silent, discovery-based tools by design), no scaffold-fade arc (discrete game levels, not a fading single sequence), and no explicit representation-transfer task type.
**Verdict:** Best-in-class free manipulative/equivalence sandbox; **not a competitor on the addition/subtraction-with-unlike-denominators task** at all.

### 2. The Math Learning Center — Fractions app & Number Line app

**Cost/account:** Free, no login, no points/badges — described as "open-ended" tools. ([mathlearningcenter.org/apps/fractions](https://www.mathlearningcenter.org/apps/fractions), [apps.mathlearningcenter.org/number-line](https://apps.mathlearningcenter.org/number-line/))
**Type:** Two **separate** blank-canvas manipulative sandboxes — one for bar/circle fraction models, one for number lines. They are not linked to each other in the same session; a student would model a bar in one app and a number line in a different app, i.e., a "side-by-side" arrangement rather than a single transforming representation.
**Covers:** Calm interface, no gamification, denominators up to 100.
**Does NOT cover:** No built-in tasks, no correctness checking, no narrative, no scaffold fade, no addition mechanic, no common-unit framing — it's a drawing tool, not an instructional sequence.
**Verdict:** Exemplary calm/free interface, zero pedagogy — someone (a teacher) has to build the lesson around it.

### 3. Didax / Toy Theater virtual manipulatives

**Cost/account:** Free, no account. ([toytheater.com/fraction-strips](https://toytheater.com/fraction-strips/), [didax.com/math/virtual-manipulatives](https://www.didax.com/math/virtual-manipulatives.html))
**Type:** Pure manipulative widgets (fraction strips, circles, tiles) — no lessons, no tasks, no checking.
**Verdict:** Same category as MLC apps — calm, free, but a raw tool, not a guided environment. Not a serious competitor to the combination in question.

### 4. Mathigon Polypad (and Mathigon "Courses")

**Cost/account:** Completely free, no login required. ([polypad.amplify.com](https://polypad.amplify.com/), Mathigon FAQ)
**Type:** Virtual-manipulative canvas ("mathematical playground"). Notably it has a **"Rename" action** for fraction bars that is conceptually close to FractionFlow's "equivalence as renaming" framing — a genuine point of philosophical overlap worth flagging. But per the Polypad "Working with Fractions" lesson page ([polypad.amplify.com/lesson/fraction](https://polypad.amplify.com/lesson/fraction)), the fraction content is a short list of **teacher-facilitation prompts** ("project a fraction to the class," "discuss in groups"), not a self-contained, learner-facing guided narrative. No fading scaffold, no transfer tasks, no built-in addition-with-unlike-denominators walkthrough.
Separately, Mathigon has a library of full **narrated, interactive "Courses"** (its "textbook of the future" format, which genuinely does use authored prose + embedded interactive widgets in a fading-scaffold arc). I checked the course catalog directly ([mathigon.org/courses](https://mathigon.org/courses)) and **there is no dedicated fractions-arithmetic course for upper elementary** — the catalog is middle/high-school topics (geometry, primes, probability, fractals, etc.). So the *format* Mathigon uses is a real existence-proof that "authored narrative + transforming manipulative" is buildable at scale, but the *content* doesn't exist for this task.
**Verdict:** Calm, free, no-login sandbox with one genuinely resonant feature (rename-based equivalence); not a guided instructional sequence for unlike-denominator addition/subtraction.

### 5. Khan Academy

**Cost/account:** Free; many videos viewable without login, but exercises/mastery tracking require a free account. ([khanacademy.org/.../add-and-subtract-fractions-different-denominators](https://www.khanacademy.org/math/arithmetic/x18ca194a:add-and-subtract-fractions-different-denominators))
**Type:** Video lessons (human-narrated, not AI-generated, at least for the core fraction content) + a mastery-based drill/practice engine, including a specific "Visually add and subtract fractions" exercise using a pie/rectangle model tied to a numeric answer box. ([khanacademy.org/.../using-visuals-to-add-and-subtract-fractions-with-unlike-denominators](https://www.khanacademy.org/math/cc-fifth-grade-math/imp-fractions-3/imp-visually-adding-and-subtracting-fractions-with-unlike-denominators/e/using-visuals-to-add-and-subtract-fractions-with-unlike-denominators-))
**Covers:** This is the single strongest partial match I found for the specific "linked visual + symbolic, unlike-denominator addition" task — it explicitly teaches finding the LCM/common denominator and pairs a visual model with the symbolic operation.
**Does NOT cover:** Confirmed still active as of 2025–2026: energy points, badges (including new "streak" and "Black Hole" badges), and mastery/course levels ([support.khanacademy.org — energy points, badges, avatars](https://support.khanacademy.org/hc/en-us/articles/202487710-What-are-energy-points-badges-and-avatars), [Khan Academy badges update posts](https://support.khanacademy.org/hc/en-us/community/posts/31179818817549-Update-New-BLACK-HOLE-badge-and-more)) — i.e., exactly the points/badges/streaks/dashboard apparatus FractionFlow explicitly rejects. Scaffolding is mastery-unlock based, not a deliberate visual→symbolic fade within one problem arc; no explicit "common unit" language confirmed; no representation-transfer task genre; requires an account for the parts that track progress.
**Verdict:** Closest single free "practice" match on the narrow visual+symbolic unlike-denominator task, but disqualified by exactly the gamification/account features FractionFlow is designed to avoid, and it's a drill engine rather than a renaming/common-unit conceptual narrative.

### 6. Illustrative Mathematics / Open Up Resources

**Cost/account:** Curriculum content is free OER (CC BY) — PDFs are genuinely free to download. ([access.openupresources.org](https://access.openupresources.org/curricula), [illustrativemathematics.org resource hub](https://illustrativemathematics.org/resource-hub/)) However, the **polished interactive/digital student experience** is generally delivered through paid or "educator-verified" platforms — Kendall Hunt's "IM Certified" digital site (requires registering and being verified as an educator) or Amplify/Kiddom's paid v.360 platform. ([im.kendallhunt.com](https://im.kendallhunt.com/), [Kendall Hunt IM pricing](https://k12.kendallhunt.com/sites/default/files/k12upload/Illustrative%20Mathematics%20Price%20List.pdf))
**Covers:** Grade 5 lessons (e.g., Unit 6, Lessons 10 & 13) explicitly teach finding a common denominator via equivalent-fraction diagrams before adding/subtracting unlike fractions — pedagogically the closest philosophical match to FractionFlow's "common unit" framing and "renaming" approach to equivalence that I found anywhere. ([curriculum.illustrativemathematics.org grade 5 unit 6 lesson 13](https://curriculum.illustrativemathematics.org/k5/teachers/grade-5/unit-6/lesson-13/lesson.html))
**Does NOT cover:** It is a **teacher-led classroom curriculum with print/PDF tasks and discussion protocols**, not a self-serve, account-free browser practice environment with interactive linked bar/number-line/symbolic widgets that transform. A lone student/family cannot just open a browser and get the guided interactive experience for free without a school's platform license or teacher-verified account.
**Verdict:** Best pedagogical-philosophy match; not a comparable product (it's a print-first curriculum, not a static browser app).

### 7. CK-12

**Cost/account:** Free but **requires a free account** to use FlexBooks/PLIX/Adaptive Practice. ([ck12.org](https://www.ck12.org/))
**Type:** FlexBook text + PLIX interactive widgets + adaptive-practice drill.
**Verdict:** Violates "account-free." Covers unlike-denominator addition procedurally with some interactive elements, but is a mixed drill/reference library, not a single guided narrative arc; I could not confirm or rule out whether its explanatory text is human-authored vs. templated/AI-assisted, so I flag this as unverified rather than claim either way.

### 8. Desmos Classroom fraction activities

**Cost/account:** Free, but **fundamentally teacher-orchestrated** — a lone student cannot self-navigate an activity without a teacher-generated class/session code; some activities are essentially inaccessible to an unaccompanied learner outside a hosted session. ([student.desmos.com](https://www.student.desmos.com/), search on session-code requirement)
**Covers:** Several individual teacher-authored activities do closely resemble FractionFlow's target arc — e.g. "Adding and Subtracting Fractions with Pictures (Unlike Denominators) Part 1 & 2" moves from pictorial support toward more symbolic screens, and "Adding Fractions Progression and Practice" explicitly scaffolds toward a symbolic "Challenge Creator" at the end. ([teacher.desmos.com/.../609c5917dc7cad8a502b490f](https://teacher.desmos.com/activitybuilder/custom/609c5917dc7cad8a502b490f), [teacher.desmos.com/.../5c93cccc84b46a0cafcc679d](https://teacher.desmos.com/activitybuilder/custom/5c93cccc84b46a0cafcc679d))
**Does NOT cover:** These are **individual-teacher-authored, crowd-quality-variable activities**, not a centrally vetted product; they live inside a bigger teacher tool rather than being a standalone destination; and, critically, they are not usable by a self-directed, account-free learner without an adult hosting a session.
**Verdict:** The closest single artifact to FractionFlow's specific "fade from picture to symbol on unlike denominators" arc that I found anywhere in this research — but disqualified from being a real "existing product" competitor because it isn't self-serve or centrally vetted, and requires a teacher session.

### 9. NCTM Illuminations

**Cost/account:** Free, no account. Many original Flash tools died with Flash's 2021 end-of-life, but some (including "Equivalent Fractions" and "Fraction Game") have been rebuilt/kept in HTML5. ([nctm.org/Illuminations Interactives](https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Equivalent-Fractions/), [nctm.org Fraction Game](https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Fraction-Game/))
**Covers:** Simple, calm, single-purpose applets (build equivalent fraction, place on number line).
**Does NOT cover:** No addition/subtraction operation, no narrative, no scaffold fade — legacy single-concept tools, much diminished from the site's earlier scope.
**Verdict:** Minor, calm, but narrow — not a serious competitor.

### 10. Brilliant

**Cost/account:** Requires a free account signup; free tier unlocks only the first 2–3 lessons of any course before hitting a "daily key" paywall. ([brilliant.org/courses/math-fundamentals](https://brilliant.org/courses/math-fundamentals/), nibble-app pricing summary)
**Verdict:** Weak match — violates account-free and isn't genuinely free beyond a preview; general-audience course, not upper-elementary-fraction-specific. Excluded as not a serious competitor.

### 11. DragonBox (Numbers/Algebra, via Kahoot!)

**Cost/account:** Subscription-based through Kahoot! (from ~$3/month) with only a 7-day free trial; no standalone "DragonBox Fractions" product currently exists in the lineup. ([dragonbox.com/products](https://dragonbox.com/products), [kahoot.com/dragonbox](https://kahoot.com/home/learning-apps/dragonbox/))
**Verdict:** Paid/gamified contrast case; not free, not fraction-addition-specific. Excluded as weak match.

### 12. Slice Fractions (Ululab)

**Cost/account:** $3.99 on iOS, free on Android, plus a free experimental web build on Kongregate. ([ululab press kit](https://ululab.com/press-kit-slice-fractions/), Kongregate listing)
**Verdict:** A physics-puzzle game (halving ice blocks) aimed at younger learners' intuitive fraction sense; not focused on symbolic unlike-denominator addition/subtraction or common-unit reasoning, and is a gamified puzzle product, not an instructional narrative. Contrast case, not a real overlap.

### 13. Motion Math Fractions

**Status:** Discontinued as a standalone consumer product; the Motion Math line was folded into the paid i-Ready platform (Curriculum Associates) around 2020 and is no longer independently purchasable. ([EdSurge review](https://www.edsurge.com/news/2015-10-23-motion-math-the-definitive-review), i-Ready wiki)
**Verdict:** Not currently accessible as a free/low-cost standalone tool — excluded.

### 14. Carnegie Learning / Rau, Aleven & Rummel "Fractions Tutor"

**What it is:** An academic intelligent tutoring system (example-tracing tutor, built with CMU's Cognitive Tutor Authoring Tools) explicitly designed around research questions on **sequencing multiple linked graphical representations of fractions**, with self-explanation prompts — i.e., mechanically the closest thing to FractionFlow's ambition that exists anywhere in the literature. Used in studies with 3,000+ 4th/5th graders. ([Rau, Aleven & Rummel AIED 2009 paper](http://www.cs.cmu.edu/~marau/RauAlevenRummel_AIED2009.pdf), [Springer chapter on multiple representations](https://link.springer.com/chapter/10.1007/978-3-642-39112-5_107))
**Public access:** **Not publicly available.** It is deployed through CTAT/TutorShop infrastructure, and current CTAT documentation directs anyone wanting access to "contact tutorshop-support" — this is a research-lab deployment model (controlled classroom studies), not an open consumer product, and I found no independent public URL where a family/teacher could just start using it today. It also does not appear to be a shipped Carnegie Learning commercial product under that name — it's an academic CMU system historically associated with the Cognitive Tutor lineage, not something in Carnegie Learning's current catalog.
**Verdict:** Important negative finding — the one system explicitly engineered to do what FractionFlow proposes is real, published, and effective in research, but it is **locked out of public reach**, reinforcing that no one has shipped this as an accessible product.

### 15. ASSISTments

**Cost/account:** Free public service (WPI/ASSISTments Foundation); has "Skill Builder" problem sets including fractions with uncommon denominators. ([assistments.org](https://www.assistments.org/), [ASSISTments problem set example](https://app.assistments.org/find/problemSets/PSABPP6Q))
**Type:** A problem-delivery/homework platform (teachers assign; students typically need a class/login) with per-item hints. Content quality and pedagogical depth vary by problem author; it's a delivery layer, not itself an authored visual-representation environment.
**Verdict:** Not self-serve/account-free in practice, and not built around linked-representation instructional narrative — weak match, mentioned for completeness.

### 16. Prodigy / IXL / Freckle — gamified contrast cases

- **Prodigy:** Free RPG-style base game with energy points/pets/cosmetic premium tier; math content (including fractions) is secondary to the game loop. ([prodigygame.com](https://www.prodigygame.com/main-en))
- **IXL:** $9.95–$19.95/month, "virtual awards" and a "treasure hunt" gamified structure. ([ixl.com/math](https://www.ixl.com/math))
- **Freckle:** Free basic tier exists; premium tiers require sales contact for pricing.

**Verdict:** All three are exactly the kind of points/badges/dashboard-driven drill engines FractionFlow's design brief explicitly rejects; none foreground common-unit reasoning or representation transformation as pedagogy. Useful only as the intended contrast class, not as overlap candidates.

---

## Bottom line

**No single existing free tool delivers the full combination.** The specific combination FractionFlow claims — authored (non-AI) narrative teaching equivalence as renaming/subdivision, explicit common-unit framing for unlike-denominator addition/subtraction, linked bar/number-line/symbolic representations that *transform into* each other rather than sit side by side, scaffold fading toward symbolic-only work, representation-transfer tasks, and a calm non-gamified/account-free interface — does not exist today as one product. What exists instead is a fragmented landscape:

- **Free, account-free, calm manipulative sandboxes** (PhET's five fraction sims, MLC's Fractions/Number Line apps, Toy Theater, Didax, Mathigon Polypad) nail the "calm, no accounts, no gamification" bar and the equivalence/subdivision *representation* — but **none of them contain an addition/subtraction-of-unlike-fractions operation at all**, let alone a common-unit narrative or a scaffold-fade arc. They are silent tools that need a teacher or curriculum wrapped around them.
- **Khan Academy** is the closest single free *practice* match on the narrow visual+symbolic unlike-denominator addition task, but it is account-based and — confirmed still active in 2025–2026 — carries exactly the energy-points/badges/streaks/dashboard apparatus FractionFlow is designed to avoid, and its scaffolding is mastery-unlock-based rather than a deliberate representation-fading narrative.
- **Desmos Classroom teacher activities** get closest to the actual pedagogical arc (picture-support fading toward symbolic, unlike denominators) but are individually teacher-authored (variable quality, not centrally vetted) and require a teacher-hosted session code — not self-serve or account-free for a lone learner.
- **Illustrative Mathematics / Open Up Resources** is the closest match in *written pedagogical philosophy* (common-denominator-via-diagram reasoning) but is a teacher-led print/PDF curriculum; its polished digital/interactive layer sits behind paid or educator-verified platforms, not a free static browser app.
- The one system explicitly built by researchers to solve this exact problem — **Rau, Aleven & Rummel's Fractions Tutor** — is real, published, and shown effective with linked multiple representations, but is **not publicly accessible**; it lives behind CTAT/TutorShop research infrastructure.
- **DragonBox, Slice Fractions, Motion Math, Brilliant, Prodigy, IXL, Freckle, CK-12, ASSISTments** are all disqualified individually on cost, account requirement, gamification, or simply not addressing this specific skill with this specific pedagogy.

So the gap claimed by FractionFlow's design brief is **real and specific**: the pieces (calm manipulatives, a common-unit-based curriculum philosophy, a research-validated linked-representation tutor, and a few teacher-made pictorial-to-symbolic activities) all exist separately, scattered across products with mismatched cost/account/gamification profiles — but no one has shipped them together as a single free, account-free, static, non-gamified browser tool.

---

## Key file/URL references

No local repository files were relevant to this research task (it is external competitive-landscape research); all sources are external URLs, listed inline above and compiled below.

### Sources

- [PhET — Fractions: Equality](https://phet.colorado.edu/en/simulations/fractions-equality)
- [PhET — Fractions: Mixed Numbers](https://phet.colorado.edu/en/simulations/fractions-mixed-numbers)
- [PhET — Fraction Matcher](https://phet.colorado.edu/en/simulations/fraction-matcher)
- [PhET — Build a Fraction](https://phet.colorado.edu/en/simulations/build-a-fraction)
- [Math Learning Center — Fractions app](https://www.mathlearningcenter.org/apps/fractions)
- [Math Learning Center — Number Line app](https://apps.mathlearningcenter.org/number-line/)
- [Toy Theater — Fraction Strips](https://toytheater.com/fraction-strips/)
- [Didax — Virtual Manipulatives for Math](https://www.didax.com/math/virtual-manipulatives.html)
- [Mathigon/Polypad — Working with Fractions lesson](https://polypad.amplify.com/lesson/fraction)
- [Mathigon — Course Library](https://mathigon.org/courses)
- [Khan Academy — Add and subtract fractions (different denominators)](https://www.khanacademy.org/math/arithmetic/x18ca194a:add-and-subtract-fractions-different-denominators)
- [Khan Academy — Visually add and subtract fractions (practice)](https://www.khanacademy.org/math/cc-fifth-grade-math/imp-fractions-3/imp-visually-adding-and-subtracting-fractions-with-unlike-denominators/e/using-visuals-to-add-and-subtract-fractions-with-unlike-denominators-)
- [Khan Academy Help Center — energy points, badges, avatars](https://support.khanacademy.org/hc/en-us/articles/202487710-What-are-energy-points-badges-and-avatars)
- [Illustrative Mathematics Grade 5, Unit 6 Lesson 13 (teacher demo)](https://curriculum.illustrativemathematics.org/k5/teachers/grade-5/unit-6/lesson-13/lesson.html)
- [Open Up Resources — Curriculum Access](https://access.openupresources.org/curricula)
- [Illustrative Mathematics via Kendall Hunt](https://im.kendallhunt.com/)
- [CK-12 Foundation](https://www.ck12.org/)
- [Desmos — Adding and Subtracting Fractions with Pictures (Unlike Denominators) Part 1](https://teacher.desmos.com/activitybuilder/custom/609c5917dc7cad8a502b490f)
- [Desmos — Adding Fractions Progression and Practice](https://teacher.desmos.com/activitybuilder/custom/5c93cccc84b46a0cafcc679d)
- [Desmos Classroom student join](https://www.student.desmos.com/)
- [NCTM Illuminations — Equivalent Fractions](https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Equivalent-Fractions/)
- [NCTM Illuminations — Fraction Game](https://www.nctm.org/Classroom-Resources/Illuminations/Interactives/Fraction-Game/)
- [Brilliant — Math Fundamentals course](https://brilliant.org/courses/math-fundamentals/)
- [DragonBox products](https://dragonbox.com/products)
- [Ululab — Slice Fractions press kit](https://ululab.com/press-kit-slice-fractions/)
- [EdSurge — Motion Math review](https://www.edsurge.com/news/2015-10-23-motion-math-the-definitive-review)
- [Rau, Aleven & Rummel (2009), AIED — Fractions Tutor paper (PDF)](http://www.cs.cmu.edu/~marau/RauAlevenRummel_AIED2009.pdf)
- [Springer — How to Use Multiple Graphical Representations... Fractions Tutor](https://link.springer.com/chapter/10.1007/978-3-642-39112-5_107)
- [CTAT Documentation/Tutorials](https://tat.pact.cs.cmu.edu/CMUCTAT/CTAT/docs/tutorials-and-doc.html)
- [ASSISTments](https://www.assistments.org/)
- [ASSISTments example problem set](https://app.assistments.org/find/problemSets/PSABPP6Q)
- [Prodigy Math](https://www.prodigygame.com/main-en)
- [IXL Math](https://www.ixl.com/math)
