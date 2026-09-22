# Decision Log

This file records decisions that should guide future work. New entries should include a date and rationale.

**Append-only.** Do not edit or remove entries. If a decision is superseded, add a new entry that references the old one.

This file is orchestrator/owner-owned. Implementers propose but do not edit.

## Accepted decisions

Use this shape for accepted decisions:

```markdown
### DECISION-001 - Short decision title

**Date:** YYYY-MM-DD

**Decision:** What was decided.

**Rationale:** Why this decision is the right tradeoff for now.

**Supersedes / related:** Optional links to older decisions, packets, or resolved open questions.
```

### DECISION-001 - Use GitHub Actions for static GitHub Pages deployment

**Date:** 2026-09-18

**Decision:** FractionFlow deploys its static site through the repository's GitHub Actions
workflow. The workflow installs locked dependencies, runs the headless test command, builds
`dist/`, and deploys that generated artifact to GitHub Pages. Build output remains ignored and
is not a source-branch artifact.

**Rationale:** This gives the project a reproducible build-and-deploy path without repository
secrets, a publishing branch, a backend, or any runtime third-party origin. It also keeps
generated output separate from the repository's durable source and specifications. The Plan 01
smoke page was locally built and publicly verified over HTTPS; that evidence proves deployment
plumbing only, not learner-facing readiness, pedagogy, or accessibility.

**Supersedes / related:** `docs/development/plan-01-tooling-deployment-spike.md`; public smoke
URL: `https://mrsmithelhs.github.io/FractionFlow/`.

### DECISION-002 - Plan 03 content-contract and bulk-audit semantics

**Date:** 2026-09-18

**Decision:** Plan 03 uses operation-specific structural selectors for like-denominator,
nested-denominator, shared-factor, and relatively-prime addition/subtraction. Reducible-result
and crosses-one-whole are orthogonal overlays, with every allowed selector/overlay combination
declared explicitly; under the initial proper-fraction profile, crosses-one-whole is addition-only.
Problem instances use a common exact-mathematical contract with a discriminated generated-versus-
curated provenance section, an explicit result state, and immutable source content. The initial
development profile remains replaceable, but bulk reporting must distinguish sampled draws from
unique mathematical instances and report finite candidate-space coverage whenever practical.

**Rationale:** This maintains the founding distinction between mathematical structure and
cross-cutting result properties, avoids inventing generator history for curated fixtures, and
prevents a large sampled batch from being misread as broad content variety when a deliberately
narrow default profile has a small eligible state space.

**Supersedes / related:** `docs/development/plan-03-content-contracts-and-deterministic-generation.md`;
`reports/development/plan-03-content-contracts-and-deterministic-generation/mechanism-review.md`.

### DECISION-003 - Presentation posture: accessibility and learner-facing register

**Date:** 2026-09-19

**Decision:** Accessibility increases access to the learning experience; it does not replace the
experience with an explanatory control panel. The default learner experience optimizes for
mathematical clarity, calm hierarchy, low cognitive load, and efficient mouse/touch interaction.
Motion-enabled presentation may be the default; reduced-motion must remain available, discoverable,
and meaning-preserving without needing to feel identical. Mouse and touch may be the most prominent
interaction path while keyboard and non-precision alternatives remain viable for every required
decision. Accessibility semantics do not imply a large visible textual interface and may use
progressive disclosure. Basic participation must not depend on a hidden or teacher-only mode. Full
posture: `docs/presentation-posture.md` Part 1.

Part 2 of that document further rules that specification vocabulary is never learner-facing
vocabulary, that the research apparatus is never visible to the learner, and that the product never
asks a learner to produce research artifacts. Internal records keep the analytic vocabulary; the
separation runs between what is recorded and what is displayed.

**Rationale:** The founding documents already define accessibility as a participation floor rather
than a mandate that every access mode be equally prominent (`05-quality-and-validation.md` §44),
and already require calmness as functional (`00-principles.md` §18), a stable instructional
hierarchy (`02-interaction-grammar.md` §71), and over-scaffolding review
(`05-quality-and-validation.md` §20). This records how those contracts apply as the project enters
presentation layers, so accessibility is not misapplied as license for cognitive overload or an
explanatory-text-first interface — and equally, so "calm" is not misapplied as license to degrade
the floor. Part 2 exists because `plan-04` introduced a research apparatus the founding documents
were never written against: §33 guards mathematical jargon and §16 guards psychological overclaim,
but neither covers the vocabulary of conditions, transfer, provenance, and outcome measures.

**Supersedes / related:** `docs/presentation-posture.md`;
`docs/founding/05-quality-and-validation.md` §§33, 44; `docs/founding/02-interaction-grammar.md`
§§71–72; open questions OQ-13, OQ-14, OQ-15.

### DECISION-004 - Reading-level target for learner-facing text

**Date:** 2026-09-19

**Decision:** Learner-facing interface text targets approximately a grade 2–3 reading level — two
or more grades below the upper-elementary audience — so that reading is never the barrier to the
mathematics. The mathematical terms the episode teaches are exempt and are introduced with meaning
rather than avoided. The target is enforced through working rules (one idea per string, a prompt of
about 12 words, active voice, no conditionals in a prompt that asks for a response, concrete words,
no culture-dependent idiom) and human review — **not** through a readability formula. Full rules:
`docs/presentation-posture.md` Part 2.

**Rationale:** `05-quality-and-validation.md` §33 requires review for reading burden and age
appropriateness but sets no target, so nothing could be checked against it. Formula-based gating
was rejected because Flesch–Kincaid and its relatives produce meaningless scores below roughly 100
words; gating on one would have been a proxy metric of exactly the kind this project's guardrails
warn about.

**Supersedes / related:** `docs/presentation-posture.md` Part 2; resolves the target half of OQ-10;
`D-19`.

### DECISION-005 - Efficacy research is a sidequest, not a primary concern

**Date:** 2026-09-19

**Decision:** High-quality instructional-efficacy research may be advanced someday but is not a
primary concern and is not a gate on shipping. The project's realistic evidence ladder is solo
review, then a handful of children with parental permission, then possibly a single classroom with
teacher approval — all small-n, none randomized, none controlled, none powered. Consequently the
`plan-04` prototype-variable register is retained as a **disqualification** instrument rather than
a **selection** instrument: it can rule a condition out, it cannot rule one in, and its conclusion
rule will correctly and permanently return "consistent with A and B" for the selection question.
Claims name their evidence tier and n; "evidence shows X is better" is not an available sentence.
Full posture: `docs/evidence-posture.md`.

**Rationale:** The register's discriminating experiments assume randomized or counterbalanced
comparison, which this project will not run. Leaving that mismatch unrecorded would have produced
either a permanently blocked decision, waiting on a study that was never coming, or an overclaim
built on a handful of observations. Naming the ladder makes both failure modes visible. This does
not lower the accessibility floor or the mathematical-correctness bar: small-n evidence is *strong*
at participation-floor failures — one child unable to complete a required decision is conclusive —
and mathematical truth is established deterministically in `src/math/`.

**Supersedes / related:** `docs/evidence-posture.md`;
`docs/development/phase-2-first-slice-design/prototype-variable-register.md`; reframes OQ-01;
partially answers OQ-05; amends OQ-07; `06-roadmap.md` §16.

### DECISION-006 - Design conditions must be swappable at runtime in the deployed build

**Date:** 2026-09-19

**Decision:** The Phase 2 build must allow the provisional design condition to be swapped at
runtime in the deployed static build, so alternatives can be exercised during ordinary browser
testing without a rebuild. Conditions are selected **upstream** as an episode configuration and
presentation mode feeding the normal `mathematical state → instructional state → presentation`
pipeline — never as a renderer-level toggle — and the active condition is recorded in the replay
and defect-report envelope. Available conditions are enumerated in one registry so that no
condition exists only as dead code. The switcher is **not** the learner preference surface and must
not be merged with it. The reaching mechanism and whether it ships publicly are open as OQ-16.

**Rationale:** DECISION-005 establishes that the provisional condition is in practice the shipped
condition, which makes the architectural claim that conditions are swappable load-bearing rather
than aspirational. A runtime switcher makes that claim continuously testable and is the cheapest
available defense against the OQ-01 inertia risk. Selecting upstream rather than at the renderer
keeps the separation rule intact: `D-05` prompt density and `CM-01` prompt form change instructional
state, not merely presentation, so a render-layer flag would have crossed a layer boundary.

**Supersedes / related:** OQ-01; OQ-16;
`docs/development/phase-2-first-slice-design/scene-model-position.md`;
`docs/founding/04-system-architecture.md` §§41–42.

### DECISION-007 - Phase 2 provisional display and prompt condition bundle

**Date:** 2026-09-19

**Decision:** The provisional display and prompt condition for Phase 2 is Bundle 1:
1. **D-01 (Animated subdivision):** Animated subdivision transition showing the physical dividing of unit parts into common unit pieces at a calm, learner-paced speed; reduced-motion provides an instant, static equivalent preserving the identical semantic post-state and quantity invariance.
2. **D-02 (Semantic morph-in-place):** Transformation subdivides the fraction bar in place with anchored spatial continuity, avoiding vertical stacking and viewport crowding on mobile screens.
3. **D-05 (Focused key-beat prompts):** Structured prompts at core decision boundaries (Notice, Choose common denominator, Rename, Operate, Resolve) targeting grade 2–3 reading level (~12 words per prompt, active voice, concrete nouns) without conversational clutter or prompt fragmentation.
4. **CM-01 (Structured mapping check):** A low-motor, single-tap invariant verification check (e.g. "Is the shaded amount still the same? [Yes / No]") to explicitly probe correspondence without imposing written language or essay-typing burdens.

This bundle is labeled not-decided and swappable at runtime upstream per DECISION-006.

**Rationale:** Selected on pedagogical craft grounds and presentation posture rules rather than awaiting unfeasible statistical comparisons (DECISION-005). Morph-in-place preserves the founding principle of the stable whole and avoids mobile layout bloat. 1-tap structured mapping preserves invariant verification without violating the grade 2–3 reading/writing target (DECISION-004) or creating motor barriers on touch devices.

**Supersedes / related:** Resolves OQ-01; operationalizes DECISION-005 and DECISION-006; references `D-01`, `D-02`, `D-05`, `CM-01`, `docs/presentation-posture.md`.

### DECISION-008 - Representation-eligibility verdict and Phase 2 D-06 ceilings

**Date:** 2026-09-19

**Decision:** Representation-eligibility is computed deterministically upstream in `src/content/` (e.g. `checkBarEligibility`) before episode instantiation. For Phase 2, initial conservative fraction-bar ceilings are established: common denominator <= 24 and single-operand scale factor <= 8. Problem instances and paths within these bounds return `eligible`. Valid mathematical instances or learner-selected common denominators exceeding these bounds fail closed to `valid-but-outside-representation-capability` and transition to an authorized symbolic continuation rather than attempting illegible hairline rendering.

**Rationale:** Plan 03 previously left `representationFacts.eligibility` as the string `'deferred'`. Establishing an explicit content-layer capability function prevents the renderer from deciding eligibility, enforces the unidirectional pipeline (`content -> instructional -> presentation`), protects mobile viewports from unreadable hairline subdivision smudges, and cleanly supports both the canonical LCD (12) and alternate path (24) for the synthetic fixture while safely gating unbounded generated instances.

**Supersedes / related:** Resolves OQ-02; resolves the Phase 2 portion of `D-06`; `episode-definition.md` §2.

### DECISION-009 - Supported-environment matrix for Phase 2 (D-22)

**Date:** 2026-09-19

**Decision:** The supported-environment matrix for the Phase 2 implementation packet and public GitHub Pages verification is:
1. **Browsers / OS:** Modern evergreen Chrome/Chromium (Desktop, ChromeOS, Android), Safari (macOS, iOS/iPadOS), Firefox, and Edge.
2. **Viewports / Layout:** Responsive width range from 360px (mobile portrait / compact handhelds) through 768px–1024px (tablets / Chromebooks) to 1440px (desktop), reflowing cleanly without loss of controls or horizontal scrolling down to 320px.
3. **Input modalities:** Touch (tap/select with child-appropriate target sizing, zero precision dragging required), pointer/mouse, and full keyboard navigation (focus indicators, tab order, Enter/Space/Arrow activation).
4. **Motion:** Motion-enabled by default; full semantic and inspectable parity under `prefers-reduced-motion: reduce` (instant static transitions).
5. **Semantic accessibility:** Valid DOM ARIA semantics, inspectable linear reading order, and status announcements compatible with standard OS/browser screen readers (VoiceOver, NVDA, TalkBack, ChromeVox).
6. **Contrast and Zoom:** WCAG 2.1 AA contrast ratios (minimum 4.5:1 for body text, 3:1 for graphical controls and fraction bar boundaries); text scaling and browser zoom up to 200% without clipping or layout breakage.
7. **Explicit exclusions:** Legacy browsers (IE11, pre-Chromium Edge, outdated WebViews), custom audio/sound effect engines, native app shells/wrappers, and offline service worker/PWA caching (deferred under D-21).

**Rationale:** Aligns testing and verification obligations with actual elementary school and home hardware (Chromebooks, iPads, family phones, laptops) without imposing impossible testing matrices on a static-only, small-n project. Explicitly enumerating exclusions prevents scope creep and makes the participation floor concretely falsifiable.

**Supersedes / related:** Resolves OQ-03; resolves `D-22`; `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md`.

### DECISION-010 - Adopt WCAG 2.2 AA as accessibility standard

**Date:** 2026-09-19

**Decision:** The project adopts WCAG 2.2 AA as its accessibility standard, superseding the
WCAG 2.1 reference in DECISION-009. This explicitly activates Criterion 2.5.7 (Dragging Movements —
providing an alternative that does not require dragging for any required action) and Criterion 2.5.8
(Target Size Minimum — minimum 24x24 CSS pixels with sufficient spacing, designed with child-appropriate
margins).

**Rationale:** The project's founding principles require that required learner decisions be completable
without precision dragging and with child-appropriate touch targets. WCAG 2.1 lacked formal success
criteria for dragging movements and minimum target sizes; adopting WCAG 2.2 AA aligns the project's
formal compliance standard directly with its core accessibility posture (DECISION-003;
`docs/presentation-posture.md`) and provides explicit normative criteria for OQ-13 and Batch B.

**Supersedes / related:** Supersedes the WCAG standard specification in DECISION-009; resolves OQ-03;
informs OQ-13; `docs/presentation-posture.md`.

### DECISION-011 - Reconcile Phase 2 presentation ceilings (LCD <= 30, scale factor <= 12)

**Date:** 2026-09-19

**Decision:** The presentation-layer eligibility ceilings for fraction-bar rendering in Phase 2 are
set to: common denominator <= 30 and single-operand scale factor <= 12, superseding the conservative
limits (24 and 8) in DECISION-008. Valid mathematical instances or proposals exceeding these bounds
fail closed to `valid-but-outside-representation-capability` and route to authorized symbolic continuation.

**Rationale:** Reconciles presentation eligibility with the content layer's generator profile
(`src/content/profiles.js:17-18`, `maxAlternateScaleFactor: 12n`), eliminating the contradiction where
the content layer asserted a supported alternate path that the renderer rejected. A sweep of the 6
relatively-prime pairs in `phase1-dev-default` under these ceilings confirms that all 6 pairs have
renderable canonical paths (including (5,6) with LCD 30), and 4 of 6 pairs (2,3; 2,5; 3,4; 3,5) have
renderable non-LCD alternate paths (such as alternate denominator 30 for 3,5). Paths with denominators
above 30 (such as alternate 40 for 4,5 and alternate 60 for 5,6) fail closed to symbolic continuation,
preventing illegible hairline subdivision on mobile viewports.

**Supersedes / related:** Supersedes DECISION-008; resolves OQ-02 and Phase 2 portion of `D-06`;
`episode-definition.md` §2.

### DECISION-012 - Instantiate CM-01-M as visual matching task with distractors

**Date:** 2026-09-19

**Decision:** In the provisional condition bundle (DECISION-007), the connection-making prompt form
(CM-01-M) is instantiated as a visual matching task with distractors — e.g. *"Tap the bar that shows the
same amount as 2/3"*, presenting the target bar (8/12) alongside plausible distractors (such as 7/12 or
9/12). It is not a binary "Is the shaded amount still the same? [Yes / No]" verification.

**Rationale:** A binary verification whose correct answer is always "Yes" rapidly degenerates into a
ritualized trial that measures compliance rather than equivalence reasoning, collapsing toward Rival N
while bearing Rival M's label. Because the prototype register is a disqualification instrument
(DECISION-005), an undisqualifiable task is an empirical dead end. Presenting a visual matching choice
preserves 1-tap, low-motor, no-keyboard, grade 2–3 reading accessibility while providing a genuine,
falsifiable measurement of whether the learner recognizes quantity preservation across unit renaming.

**Supersedes / related:** Narrows and clarifies DECISION-007 (CM-01 arm); resolves OQ-01;
`prototype-variable-register.md`.

### DECISION-013 - Tap/direct-select as primary interaction; drag as optional enhancement

**Date:** 2026-09-19

**Decision:** Direct tap/click selection and keyboard navigation are the primary interaction modes
for all required learner decisions and inputs (noticing unit match, choosing common denominator,
renaming, operating on numerators, and invariant matching). Dragging is never required to complete
any decision. If drag-and-drop or continuous slider manipulation is implemented, it operates strictly
as an optional progressive enhancement that mirrors the discrete tap/click actions and shares the
exact same underlying instructional state transitions.

**Rationale:** Fulfills WCAG 2.2 AA Success Criterion 2.5.7 (Dragging Movements) and founding
accessibility contracts (`05-quality-and-validation.md` §44). Precision dragging is a known, silent
failure mode for upper-elementary children on touchscreens (tablets, Chromebooks, phones), where
inaccurate drops lead to false mathematical errors. Making tap/select primary guarantees that motor
dexterity is never a barrier to demonstrating mathematical understanding.

**Supersedes / related:** Resolves OQ-13; conforms to DECISION-010 (WCAG 2.2 AA SC 2.5.7);
`docs/presentation-posture.md` Part 1.

### DECISION-014 - Beat-gated DOM lifecycle and on-demand scaffold disclosure

**Date:** 2026-09-19

**Decision:** The DOM and accessibility tree lifecycle is strictly gated by the active instructional beat:
1. **Unreached beats and future mathematical values** (target denominators, scale factors, converted
   numerators, operation sums, and preferred final forms) are **not mounted in the DOM at all** until
   the instructional engine reaches that beat. Pre-mounting with `aria-hidden` or `display: none` is
   forbidden for future unreached answers.
2. **Current beat:** Mounts only the current question, active mathematical representations, and
   unanswered choice/input controls. Completed prior beats remain mounted as inspectable context.
3. **Secondary scaffolds:** Hints, orienting cues, and representation aids are disclosed on-demand
   only upon explicit learner request (e.g. activating a help button), simultaneously updating the visual
   scene and accessibility tree while logging support provenance.

**Rationale:** Reconciles progressive disclosure (`docs/presentation-posture.md` Part 1) with the
scaffold-leakage invariants (`D-16`; `evidence-and-accessibility-plan.md` §§98–132). Screen-reader virtual
cursors and DOM inspection frequently expose pre-mounted hidden elements, leaking future answers and
failing automated invariants. Beat-gated mounting makes scaffold leakage structurally impossible while
keeping the accessibility tree concise, focused, and in parity with the visual scene.

**Supersedes / related:** Resolves OQ-14; operationalizes `D-16` scaffold-leakage invariants;
`docs/presentation-posture.md` Part 1.

### DECISION-015 - Entry-page gear icon and settings menu for condition switching and future preferences

**Date:** 2026-09-19

**Decision:** The design-condition switcher is reached via a settings gear icon located on the
application's entry page (`src/app/`). Activating the gear icon opens a settings menu. This menu serves
as the container for:
1. **Design/Review Conditions:** Swapping among registered upstream episode conditions (D-01 animated/static,
   D-02 morph/juxtapose/sequential, D-05 prompt cadence, CM-01 connection-making) in the deployed build
   per DECISION-006.
2. **Future Settings:** Housing future learner and application preferences (such as reduced motion,
   contrast, audio toggles, and session options) as they are introduced.

To preserve Presentation Posture Part 2 Rule 2 (the research apparatus is never visible to the learner),
condition options inside this menu must use plain-language, child-safe descriptions of visual/interaction
styles (e.g. "Visual change: Smooth / Side-by-side / Step-by-step") **and** be clearly grouped under a
distinct "Reviewer / Teacher Options" section, with raw specification codes (`D-01`, `CM-01`, etc.) kept
in internal data attributes rather than user-facing strings.

*Clarification 2026-09-19, owner-authorized:* the conjunction above was recorded as "or" and is corrected
to "and" on the day of entry. With "or", relabeling alone satisfied the rule and condition switching sat
beside learner preferences with no separation — dissolving DECISION-006's surface-separation rule rather
than narrowing it as this entry's Supersedes line states. Both the plain-language register and the
distinct grouping are required.

**Rationale:** Provides an intuitive, discoverable, and touch-accessible reaching mechanism on static
GitHub Pages across desktop, tablet, and mobile devices without requiring URL manipulation or devtools
consoles. Consolidates settings architecture early into an entry-page gear menu that scales to future
preferences while strictly guarding the learner-facing register against academic and specification jargon.

**Supersedes / related:** Resolves OQ-16; modifies the surface separation rule in DECISION-006 by hosting
conditions and preferences in one entry-page menu with internal section/register separation;
`docs/presentation-posture.md` Part 2.

### DECISION-016 - Primary learner profile: conceptually-repairing upper-elementary learner

**Date:** 2026-09-19

**Decision:** The primary learner for FractionFlow as a whole is an upper-elementary learner (grades 4–6)
who has encountered fractions and addition/subtraction in school, but lacks conceptual grounding, relies
on fragile rote procedures, or holds persistent misconceptions (such as adding numerators and denominators
across). The product is an intervention and sense-making environment rather than an introductory first-exposure
curriculum.

Consequently, first-run placement (`D-08`) and backward routing (`D-09`) are oriented around diagnostic entry
and targeted visual repair: when a learner struggles with unlike addition, the system routes backward to
prerequisite equivalence or unit-partitioning episodes as repair interventions, rather than forcing a linear
progression from unit fractions.

**Rationale:** The project's founding mission is practicing fraction addition and subtraction calmly and
effectively. Novice learners approaching fractions for the first time require extensive physical manipulatives
and introductory sharing contexts; upper-elementary learners struggling with operations need visual models
to understand *why* common denominators are required and *how* equivalent renaming preserves quantity.
Scoping to the conceptually-repairing learner provides a stable anchor for curriculum sequencing in Phase 3
and beyond.

**Supersedes / related:** Resolves OQ-09; guides future resolution of `D-08` and `D-09`;
`docs/founding/01-instructional-model.md`.

### DECISION-017 - Learner string authoring and review workflow

**Date:** 2026-09-19

**Decision:** The authoring and verification lifecycle for learner-facing text is assigned as follows:
1. **Centralized table:** All learner-facing strings (prompts, guidance, status announcements, accessible
   descriptions, button labels, error recovery messages) must be authored in a centralized content table
   (e.g. `src/content/strings.js` or an episode string catalog), not scattered inline in renderer components.
2. **Implementer authoring:** The implementer drafts all episode strings in this table against the working
   rules in DECISION-004 and Presentation Posture Part 2 (grade 2–3 reading level, ~12 words per prompt,
   active voice, concrete words, no specification vocabulary).
3. **Review gate:** Reviewing strings against the working rules and child-comprehension review questions is
   a mandatory, blocking gate in the implementer's progress report and orchestrator review before packet
   acceptance.

**Rationale:** Resolves the operational half of OQ-10. Establishing a concrete authoring location and gating
step ensures that DECISION-004 is enforced as an active control rather than an aspirational policy, preventing
adult specification terminology from leaking into the interface.

**Supersedes / related:** Resolves remaining half of OQ-10; complements DECISION-004;
`docs/presentation-posture.md` Part 2.

### DECISION-018 - Specification stopping rule and transition to implementation

**Date:** 2026-09-19

**Decision:** The project transitions from design-and-specification to implementation immediately upon
completion of Batch D (resolving Phase 2 exit-gate criteria). The Phase 2 implementation packet specifies
only mathematical state contracts, instructional state machines, scene projections, and accessibility
invariants; it leaves concrete visual tuning, layout coordinates, CSS styling, and animation durations to
be discovered and refined in running code. All post-slice features (session dose `D-07`, multi-episode
progression, placement `D-08`, backward routing `D-09`, shared-device identity `D-10`, portable tokens `D-11`)
remain strictly deferred.

**Rationale:** Resolves OQ-11. With ~3,700 lines of source code and ~45,800 lines of documentation, further
prose specification risks designing speculative abstractions that cannot be validated without running software.
Drawing a hard boundary at Batch D allows the project to produce its first working vertical slice and test
its architectural pipeline against reality.

**Supersedes / related:** Resolves OQ-11; gates Phase 2 implementation packet creation.

### DECISION-019 - Gear menu holds the design-condition switcher only

**Date:** 2026-09-19

**Decision:** Supersedes DECISION-015. The entry-page gear icon and its menu exist for **one purpose
in Phase 2**: switching among the registered upstream design conditions that Plan 04's
prototype-variable register enumerates (D-01 display, D-02 choreography, D-05 prompt cadence, CM-01
connection-making form), per DECISION-006 and the Bundle 1 provisional condition of DECISION-007 and
DECISION-012.

No learner or application preferences are assigned to this menu at this stage. Reduced motion,
contrast, audio, and session options are **not** placed here by this decision. The menu is a
plausible future home for such settings, but that is a later decision, not a current allocation.

Consequently:

1. **DECISION-006's surface-separation rule is preserved, not modified.** DECISION-015's Supersedes
   line claimed to modify it by hosting conditions and preferences together. With preferences removed,
   nothing is merged and the original rule stands intact: the condition switcher is not the learner
   preference surface.
2. **The whole menu is the reviewer surface.** The DECISION-015 clarification requiring both
   plain-language labels *and* a distinct "Reviewer / Teacher Options" grouping is superseded by the
   simpler arrangement: the menu is reviewer-facing in its entirety. Condition options still use
   plain-language, child-safe descriptions of visual and interaction style (e.g. "Visual change:
   Smooth / Side-by-side / Step-by-step") with specification codes (`D-01`, `CM-01`) kept in internal
   data attributes, because a curious learner may open it.
3. **Condition selection does not persist across sessions.** A reload returns to the provisional
   default condition. This keeps Phase 2 free of any browser-stored state and prevents a switched
   condition from following one user to the next on a shared device.

**Rationale:** Plan 04's register exists to compare visual composition arrangements, and the gear menu
was introduced to make that comparison exercisable in the deployed build. Attaching unrelated future
preferences to it in the same decision widened the surface beyond its purpose and created a
preference-storage obligation that Phase 2 does not otherwise have.

Phase 2 needs no learner preference surface at all. Every `05-quality-and-validation.md` §44
participation-floor item is met either by always-on design — keyboard operability and non-drag
interaction (DECISION-013), semantic DOM and linear reading order, preserved responsibility across
paths — or by an operating-system and browser preference the application honors rather than hosts:
`prefers-reduced-motion` for motion, browser zoom and text scaling for text size. Nothing on the floor
depends on a control the learner must find. That satisfies DECISION-003's requirement that basic
participation never depend on a hidden or teacher-only mode more strongly than a menu would, because
it depends on no menu at all.

**Supersedes / related:** Supersedes DECISION-015 and its 2026-09-19 clarification; restores
DECISION-006 unmodified; related to DECISION-007, DECISION-012, DECISION-013; narrows OQ-15, whose
formal disposition belongs to Batch D; updates OQ-16.

### DECISION-020 - Phase 2 acceptance conditions and child observation gate

**Date:** 2026-09-19

**Decision:** Phase 2 acceptance is achievable upon solo review, automated/mechanized verification,
and adult accessibility and instructional review, including deployment verification at the public
GitHub Pages URL. Child observation is not a blocking gate on Phase 2 acceptance. Informal, small-n
child observations with parental permission remain valuable post-acceptance disqualification evidence
that may occur on no fixed schedule per DECISION-005.

**Rationale:** Resolves OQ-05. The accessibility participation floor (`05-quality-and-validation.md` §44)
is a design and review obligation verified deterministically and via expert accessibility review, not
an empirical research finding. Small-n child evidence serves strictly to disqualify broken conditions
rather than select winners. Requiring child observation as a blocking gate would create an indefinite
scheduling deadlock for an open-source static learning project without altering the mathematical or
architectural validity of the vertical slice.

**Supersedes / related:** Resolves OQ-05; clarifies `docs/founding/06-roadmap.md` §§16, 25;
references DECISION-005.

### DECISION-021 - Owner/Teacher aesthetic coherence review rubric

**Date:** 2026-09-19

**Decision:** The Roadmap §25 exit-gate criterion of "aesthetic coherence" (and §23 attention to
restraint, calm, whitespace, and layout) is evaluated using a 4-point Owner/Teacher Review Rubric
derived from `docs/presentation-posture.md`. Any single violation is a blocking failure at the Phase 2
acceptance gate:
1. **Restraint against dashboard accumulation:** No competing metrics, secondary counters, progress
   meters, or persistent chrome may clutter the scene or compete with the fraction bar and current question.
2. **Language and register clarity:** All learner-facing strings must pass DECISION-004 working rules
   (grade 2–3 reading level, ~12 words per prompt, active voice, concrete words, zero specification or
   research terminology).
3. **Child-appropriate touch targets and spacing:** Interactive controls must comply with WCAG 2.2
   SC 2.5.8 (>= 24x24px) with generous visual margins to prevent accidental touches.
4. **Calm pacing and anchored inspection:** Visual transitions must be learner-triggered, calm, and
   spatially anchored in the stable whole, with endpoints remaining inspectable indefinitely without auto-advancing.

**Rationale:** Resolves OQ-06. Replaces an unfalsifiable qualitative slogan with a concrete, binary
checklist. Linking failure directly to presentation-posture review questions ensures that "calm" is an
actionable architectural standard that implementers can design against and reviewers can enforce.

**Supersedes / related:** Resolves OQ-06; operationalizes `docs/founding/06-roadmap.md` §§23, 25;
`docs/presentation-posture.md`.

### DECISION-022 - Reporting rules for participation-floor and accessibility outcomes

**Date:** 2026-09-19

**Decision:** For all small-n learner observations (solo review, small group of children, single classroom),
reporting of participation-floor and accessibility outcomes must be conducted at the individual level,
reporting worst-case tail events. An aggregate mean or percentage success rate cannot be used to mask an
individual access lockout (such as one child unable to operate a control).

Aggregate statistics are permitted when sample sizes warrant them, and this rule does not foreclose larger
testing if it becomes possible and warranted later; however, aggregate metrics must complement, never
substitute for, worst-case individual access reporting.

**Rationale:** Resolves OQ-07. At small sample sizes (n approx 5), statistical averages are uninformative
and misleading. A single child locked out by a motor or reading barrier is a complete failure of the
participation floor. Requiring individual and tail-first reporting honors the disqualification role of
evidence under DECISION-005 while preserving the option for larger studies in the future.

**Supersedes / related:** Resolves OQ-07; references DECISION-005; `docs/evidence-posture.md`.

### DECISION-023 - Relocate centralized learner strings to `src/render/strings.js`

**Date:** 2026-09-19

**Decision:** The centralized catalog for learner-facing copy mandated by DECISION-017 is located at
`src/render/strings.js`, superseding the `src/content/strings.js` path in DECISION-017. All other provisions
of DECISION-017 (centralized table, implementer authoring, blocking review gate against DECISION-004 rules)
stand unchanged.

**Rationale:** Conforms to the repository area map (`AGENTS.md:21-24`). `src/content/` owns exact
arithmetic, instance generation, and problem seeds, with zero DOM and zero UI dependencies. Learner-facing
copy is presentation state that serves both the graphical rendering layer and the accessible linear
alternative. Placing strings in `src/render/` maintains the clean architectural boundary of the math core
and content pipeline.

**Supersedes / related:** Amends the file location in DECISION-017; `AGENTS.md`.

### DECISION-024 - Disposition of remaining Phase 2 blockers and specification completion

**Date:** 2026-09-19

**Decision:** Formally disposes of the remaining items in the Phase 2 blocking section of
`docs/open-questions.md`:
1. **OQ-08 (Transfer task): Dissolved.** Uncued transfer is struck from the prototype register's primary
   outcomes because it is unmeasurable on a small-n disqualification evidence ladder (DECISION-005). No
   transfer task is required for Phase 2.
2. **OQ-04 (Accommodation vs scaffold): Downgraded to implementation decision.** Relegated to code
   authoring for the accessible linear path; any support adaptation is decided and recorded with rationale
   during implementation per DECISION-018.
3. **OQ-15 (Preference persistence on shared devices): Reclassified to Deferred Past Phase 2.** Phase 2
   ships no in-app learner preference surface (DECISION-019); floor items are satisfied by always-on design
   or native OS/browser settings. OQ-15 becomes live only when in-app learner preferences are introduced.

With OQ-01 through OQ-03, OQ-05 through OQ-07, OQ-13, OQ-14, and OQ-16 resolved by accepted decisions,
and OQ-04, OQ-08, and OQ-15 disposed of above, the Phase 2 blocking section is empty. Per DECISION-018,
the **Phase 2 design and specification phase is declared complete**, clearing the way for orchestrator
reconciliation and implementation packet drafting.

**Supersedes / related:** Amends DECISION-018; dissolves OQ-08; downgrades OQ-04; reclassifies OQ-15;
updates `prototype-variable-register.md`.

### DECISION-025 - Fraction-bar segments are not interactive targets

**Date:** 2026-09-19

**Decision:** Individual fraction-bar segments are **not** tap, click, or focus targets. The bar is a
display surface. Every required learner decision — noticing the unit mismatch, choosing a common
denominator, supplying scale factors and equivalent numerators, operating, matching, and resolving —
is made through discrete controls, choice lists, or numeric entry, each sized and spaced per WCAG 2.2
SC 2.5.8 (DECISION-010) independently of how many parts the bar is divided into.

**Rationale:** Resolves finding R2 of `reports/orchestration/phase-2-specification-reconciliation.md`.
Without this rule the decision set was self-contradicting at its extremes: DECISION-011 permits an LCD
of 30, DECISION-009 supports a 360px viewport, and DECISION-021 criterion 3 makes a sub-24px target a
blocking acceptance failure. A 30-part bar at 360px yields roughly 12px per segment, so a
segment-interactive design would have been rejected by the project's own acceptance gate using content
its own ceiling permits.

Decoupling target size from denominator also means the visual cramping the owner accepted at high LCD
on narrow screens stays what it was intended to be — a *visual discrimination* tradeoff — rather than
silently becoming a motor-accessibility failure. Segment count may grow with the mathematics; control
size may not shrink with it.

**Supersedes / related:** Resolves reconciliation finding R2; constrains DECISION-013; depends on
DECISION-010 and DECISION-021; bounds DECISION-011 and DECISION-009.

### DECISION-026 - Connection-making checks include check-the-premise cases

**Date:** 2026-09-19

**Decision:** The CM-01 connection-making check, instantiated as a matching task with plausible
distractors by DECISION-012, must also include cases where the expected or habitual answer is **not**
the correct one. A learner must not be able to succeed by always selecting the reassuring option.
Where a yes/no or confirm-style form is used at all, the correct answer varies across instances.

**Rationale:** Completes finding R1. DECISION-012 removed the invariant-yes form because it was
undisqualifiable; this decision removes the deeper failure the invariant-yes form exposed. A check whose
answer never changes is dismissed the way a license agreement is dismissed — clicked through to make it
go away — and it then measures compliance rather than understanding, which is useless to a register
that exists only to disqualify (DECISION-005).

This activates, for the connection-making check only, the check-the-premise recommendation recorded
under `D-05` in `reports/orchestration/founding-docs-review/deferred-recommendations.md`: deliberate
items that reveal choreography-following rather than reasoning. `D-05`'s broader questions of prompt
density and cadence remain deferred and are not reopened here.

Constraint: a check-the-premise case must remain mathematically honest and calm. It presents a genuinely
incorrect transformation to be identified, never a trick of wording, ambiguous framing, or a deliberately
misleading visual. Founding rule `05-quality-and-validation.md` §16 continues to apply — the system
reports what happened mathematically and does not claim knowledge of the learner's beliefs.

**Supersedes / related:** Completes reconciliation finding R1; extends DECISION-012; narrowly activates
the `D-05` check-the-premise recommendation; related to DECISION-005 and `05-quality-and-validation.md`
§16.

### DECISION-027 - The replay control is built, not removed or relabelled

**Date:** 2026-09-20

**Decision:** "Replay the last change" re-presents the most recently established transition using the
active design condition's treatment. It is a re-display and changes no mathematical or instructional
state. It is not removed, and it is not relabelled to describe the sentence it currently prints.

**Rationale:** `plan-09` review found the control inert — it appends to `replayHistory` and
`supportHistory`, prints one sentence, and changes nothing visible. Its only state effect feeds
`evidenceCategory`'s `independent-transfer` branch, which also requires `support.label ===
'independent'`, never true while support is pinned at `high support`.

Two facts decided this. `02-interaction-grammar.md` §38, "Replay Should Be Available for Important
Transformations," names *equivalent-fraction subdivision* as its first candidate — precisely this
episode — and requires replay to be secondary and unobtrusive, which the footer placement satisfies.
Removing the control would therefore have been a deviation from a founding document, not a free
simplification.

And the architectural objection dissolved on inspection. Replay does not need `replayHistory`, which
`SCENE_HISTORY_KEYS` rightly forbids in the scene. It needs to re-present `transition.pre` and
`transition.post`, which the scene has projected since `plan-06` and which both renderers learned to
consume in Repairs 03 and 05. The control is cheap now because that work already happened.

Under the "New parts only" condition, replay is the only way a learner sees the before state at all,
so the control earns its place rather than duplicating what is already on screen.

**Supersedes / related:** implements `02-interaction-grammar.md` §38; depends on the transition
contract from `plan-06` and its consumption in `plan-09` Repairs 03 and 05; related to DECISION-014.

### DECISION-028 - A correct common denominator is acknowledged in the milestone line

**Date:** 2026-09-20

**Decision:** A valid common-denominator choice is acknowledged by parameterizing the existing
completed-beat milestone line, not by adding a control, a beat, or a new element:

- least: "Common denominator: 12 — the smallest one."
- valid but not least: "Common denominator: 24 — both fractions can use it."

The non-least form does not mention that a smaller denominator exists.

**Rationale:** The app gave targeted feedback on wrong answers and nothing but a checkmark on right
ones, and `strings.decide.validLeast` and `validNonLeast` were authored but unreachable. What they add
beyond the checkmark is mathematical: that the chosen denominator is the *smallest*, which is the LCD
concept named at the moment the learner earns it.

The milestone slot was chosen over a confirmation message at the beat because `decide` has the
tightest vertical budget in the episode, three repairs were spent reclaiming that space, and
DECISION-021 criterion 1 blocks acceptance on chrome that competes with the current question. Folding
the acknowledgement into a line that already exists costs nothing.

The non-least wording is deliberate. Both routes are mathematically valid and the episode supports
both; a learner who chooses 24 is not making a mistake and is not told they made one.

No mathematics moves into the renderer. `src/math/validation.js` already computes
`classification: 'valid-least' | 'valid-non-least'` and the instructional layer captures it; only the
scene projection was missing.

**Supersedes / related:** makes `strings.decide.validLeast` and `validNonLeast` reachable; constrained
by DECISION-021 criterion 1 and DECISION-004; related to DECISION-011.

### DECISION-029 - The app has an entry page that gates the episode, and the gear lives there

**Date:** 2026-09-21

**Decision:** Resolves OQ-19. FractionFlow opens on an **entry page** carrying the app's name. The
learner must act on it to begin; it is not a splash that passes through. Consequently:

1. **The entry page gates the episode.** Arriving at the app is not the same as arriving mid-problem.
   The episode is entered deliberately.
2. **The reviewer's gear menu lives on the entry page only**, and is not reachable while an episode is
   being worked. Switching a design condition therefore means starting a fresh episode. This makes
   DECISION-019's requirement — that switching never alters the learner's established work —
   structurally impossible to violate rather than a rule to be honored, and it removes the reviewer
   control from the learner's work surface, where the Phase 2 rendered screens showed the menu
   overlapping the completion message.
3. **"Try this problem again" is retained**, alongside a control that returns to the entry page. The
   two are kept because they serve different intentions — retry this problem, versus leave it — and
   **they must discard exactly the same episode state**, asserted by a route witness rather than by
   inspection. Two notions of reset that diverge is a defect; two labels over one discard is not.
4. **The app title returns to the entry page** as the primary identity. Its placement on the episode
   surface is whatever the instructional hierarchy and the `plan-09` Repair 01 clutter boundary allow,
   which may be the footer as now or may be nothing at all.
5. **What the entry page holds beyond the name** is not settled here. It stays a mechanism-gate
   proposal in `plan-12`, to be judged on rendered screens, because it is a restraint question and
   DECISION-021 criterion 1 applies to the entry page exactly as it applies to the episode.

No accounts, no storage, no persistence, no progress. Condition selection still does not survive a
reload. Static-only (DECISION-001).

**Rationale:** The footer title and the floating gear were both adopted in `plan-09` Repair 01 as
explicit workarounds for a page that did not exist, and both were recorded as temporary at the time.
OQ-19 asked five questions; the owner answered four on 2026-09-21 and deliberately left the fifth
where it can be judged against real screens.

Confining the gear to the entry page was the least obvious of the four and the most load-bearing. It
converts a behavioral guarantee into a structural one, which is the same move that closed several
`plan-09` defects: the reliable way to keep a mechanism from doing harm is to make the harmful path
unreachable rather than to forbid it.

**Supersedes / related:** Resolves OQ-19; constrains DECISION-019 by relocating the menu without
widening its purpose; preserves DECISION-001, DECISION-006, DECISION-021 criterion 1; governs
`plan-12`; makes `plan-13` depend on `plan-12`.

### DECISION-030 - The gear menu also carries reviewer-selected support level

**Date:** 2026-09-21

**Decision:** Amends DECISION-019. The gear menu's purpose widens from *"switching among the registered
upstream design conditions that Plan 04's prototype-variable register enumerates"* to **switching among
reviewer-selected instructional configuration**, of which the register's four axes (D-01 display, D-02
choreography, D-05 prompt cadence, CM-01 connection-making form) and **support level** are the members
in this phase.

Everything else in DECISION-019 stands unchanged:

- The menu remains **reviewer-facing in its entirety**. Support level is not a learner preference, and
  this amendment does not create one. DECISION-006's surface-separation rule is untouched.
- Plain-language labels; specification codes stay in internal data attributes.
- **No persistence across reload.** A reload returns to the default support level as it returns to the
  default condition.
- No learner or application preferences — reduced motion, contrast, audio, and session options remain
  outside this menu.

Support level is selected **upstream, as episode configuration**, and reaches presentation only through
instructional state. It is not a renderer flag, and per DECISION-029 it is chosen on the entry page
before an episode begins, so it does not change under a learner mid-episode.

**This amendment authorizes a surface, not a policy.** Which support level a given learner receives,
and whether it ever changes in response to performance, is out of scope here and in `plan-13`.

**Rationale:** `src/interaction/support.js` builds a four-level ladder across six dimensions;
`state.support` is written once at construction with every dimension pinned at `high support` and never
updated. Roadmap §22 asks the slice to demonstrate "the architectural ability to fade," and the owner
accepted that §25 criterion in a stated weak condition on 2026-09-21 precisely because the ladder has
no writer.

A reviewer-reachable selector is what the ladder lacks, and DECISION-019 as written did not authorize
one: support level is not among the register's four axes. The three ways an implementer would have
closed that gap unaided were all unacceptable — quietly extending the gear beyond its stated purpose,
making support a learner preference, or accepting a test-only constructor argument, which is the exact
unreachable-mechanism failure `plan-13` exists to repair. Naming the widening in a decision is the
honest version of the first of those.

The alternative considered was adding support level to the prototype-variable register, which would
have made it gear-eligible under DECISION-019 unamended. That was rejected as heavier than the need:
the register exists to hold rival hypotheses with falsification observations and conclusion rules, and
this phase wants to *demonstrate* that fading is architecturally possible, not to adjudicate between
support designs. If support level later becomes a variable the project means to falsify, it can be
registered then.

**Supersedes / related:** Amends DECISION-019; preserves DECISION-006 unmodified; depends on
DECISION-029 for the surface's location; unblocks `plan-13`; related to DECISION-016 and Roadmap §22.

### DECISION-031 - Practice types are addressable by URL fragment; conditions and learner state are not

**Date:** 2026-09-21

**Decision:** The entry page's practice types are addressable by a **URL fragment** — for example
`https://…/FractionFlow/#sum-under-one` — so that a teacher can hand out a link that opens a chosen
kind of practice directly.

Constraints, all of them load-bearing:

1. **Fragment only.** Not a path segment, which would need a server-side rewrite the static
   deployment path does not have (DECISION-001), and not a query string, so that nothing about the
   link is ever sent to a server or logged by one.
2. **Practice type only.** The fragment names *what kind of problem*, and nothing else.
3. **The design-condition switcher is explicitly NOT URL-addressable.** No `#bundle-2`, no condition in
   any part of the URL. DECISION-019 requires condition selection not to persist across a reload
   precisely so a switched condition cannot follow one user to the next on a shared device; a shareable
   link would restore exactly the stickiness that decision removed. The same exclusion applies to
   support level under DECISION-030. Both stay reviewer choices made on the entry page, in that
   session, and nowhere else.
4. **No learner state in the URL, ever** — no progress, no answers, no attempt counts, no identifiers.
   This restates `plan-12`'s existing prohibition rather than softening it.
5. **An unrecognized or malformed fragment opens the entry page normally**, with no error shown to the
   learner. A stale link from a future practice type that does not exist yet must be indistinguishable
   from arriving at the front door.
6. **A fragment naming a practice type that exists must actually start it.** This is a route claim and
   belongs in `plan-14`'s matrix like any other; a fragment that silently lands on the entry page
   instead is the same defect as a dead button.

**Rationale:** The owner is a teacher who will hand this to students, and "use this link" is the
realistic distribution mechanism for a static site with no accounts. Retrofitting addressability after
the entry page is built is more disruptive than allowing for it while it is being designed, and the
cost now is small: the entry page already has to decide which practice type to start.

The exclusions matter more than the feature. A URL is the most durable and most shareable state a
static application has, which makes it exactly the wrong place for anything the project has
deliberately kept non-persistent. Conditions and support levels are reviewer instruments for
comparison; making them linkable would turn a deliberate session choice into something that spreads.

**Supersedes / related:** Extends DECISION-029's entry page; preserves DECISION-001 and DECISION-019
point 3; constrains DECISION-030; governs `plan-12`; witnessed by `plan-14`; related to OQ-23, whose
"try another problem" control will select from the same practice-type registry.

### DECISION-032 - Results crossing one whole use a discrete multi-whole stack

**Date:** 2026-09-21

**Decision:** Resolves **OQ-20**. A result greater than one is drawn as a **discrete multi-whole
stack**: one bar per whole, stacked vertically, every unit segment the same pixel width in every bar
(`plan-10` dossier, `crossing-one-whole.md`, Candidate 1). `7/8 + 3/8` renders as a full bar of eight
eighths above a bar with two of eight shaded.

Adopted because it is the only candidate that preserves **length conservation** — one eighth is the
same width anywhere on the screen — while letting a learner count the improper quantity directly
(ten eighths) and while avoiding horizontal scrolling or microscopic segments at 360px.

Four constraints attach, and they are part of the decision:

1. **Collapsing the addend bars at `operate` is required, not optional.** Two addend bars plus a
   two-whole result stack is four bars and roughly 200px of visual elements. On entering `operate`, the
   addend bars are dismounted from the active stage and collapsed into the completed-beats summary as
   compact text, per DECISION-014.
2. **The multi-whole stack must be sized against the choreography conditions, not only at rest.** The
   `plan-10` correction found that a juxtaposed or sequential replay adds comparison rows of 47–112px
   at the same beat, which can push the active control to **701–746px** — past the 740px fold. The
   Phase 3 packet implementing this must measure the stack **under every registered condition with a
   replay active**, not only in the default condition at rest.
3. **Nothing on the stack may state the result the learner is being asked to produce.** Before the
   learner responds at `operate`, no element may display the improper total or its mixed equivalent.
   The visual shows the quantity; the learner supplies the count. This is the scaffold-leakage boundary
   and it is the specific risk this representation carries, because the answer is legible from the
   picture in a way it was not for a proper-fraction sum.
4. **Row labels stay in learner language.** Register terms such as "Completed Whole" or "Partial
   Remainder" fail DECISION-004 and DECISION-021 criterion 2. Where a label is needed at all, it is
   plain ("Whole 1", "Whole 2"), and a per-row count that merely restates the readout beside it is
   removed — the `plan-09` Repair 02 finding that "1 WHOLE" was redundant with the image applies here
   unchanged.

**Learner-facing notation in Phase 3 remains the improper fraction.** The input asks for the total
count of eighths; the readout shows `10/8`. The resolve beat may calmly state that `10/8 is 1 whole
and 2/8` as information, which is not the same as requiring mixed-number computation (DECISION-033).

**Rationale:** The current renderer does not merely lack this capability; it lies about it. With its
guard removed, `createTrackAndReadout({ numerator: 10, denominator: 8 })` builds eight segments, shades
all eight, and prints `10 / 8` beside a bar byte-identical to `8/8`. The guard at
`src/render/fraction-bar.js:90` is honest refusal, and OQ-20 asks what to draw instead.

Candidate 2 (a continuous extended track) and Candidate 3 (a solid whole-tile accumulator) were
considered and are recorded in the dossier. The stack was preferred because it keeps the unit visible
and countable at the boundary, which is the thing being taught.

**Supersedes / related:** Resolves OQ-20; governs the Phase 3 packet implementing results crossing one
whole; depends on DECISION-014 for the collapse mechanism; constrained by DECISION-009, DECISION-021
criteria 1 and 2, and DECISION-025; accommodates DECISION-033.

### DECISION-033 - Mixed numbers stay out of Phase 3, and Phase 5 owes a strategy

**Date:** 2026-09-21

**Decision:** Mixed numbers do **not** enter Phase 3 as an operational type, an input type, or a
required learner notation. Phase 3 operations conclude in improper form. Roadmap §§38–44 keep mixed
numbers as Phase 5, behind the §91 decision checkpoint.

Permitted in Phase 3: a calm informational statement at `resolve` that `10/8 is 1 whole and 2/8`. That
is a reading of the picture the learner already has, not a computation they are asked to perform.

**The owner's condition is recorded as an obligation, not a deferral:** *"if we don't have a good
strategy for them yet, we can keep them out of Phase 3. But we will need a strategy."* There is
currently no mixed-number instructional strategy anywhere in the project — only the mathematics
(`src/math/mixed-number.js`, including `regroupForSubtraction`, which is Phase 5 §43 decomposition) and
five roadmap sections describing what the phase must cover.

So: **the strategy is owed before Phase 5 begins, and §91 is where it is written.** The Phase 3 work on
DECISION-032 must not foreclose it, and the dossier argues it does not — the multi-whole stack is
structurally the mixed-number visual already (`1 + 2/8`), needing only a different readout mode, so
Phase 5 reuses the renderer rather than replacing it.

**Rationale:** Admitting mixed numbers to Phase 3 would impose input parsing, symbolic-row layout,
classification, recovery copy, and regrouping interaction across all four layers, for a phase whose
question is whether the existing grammar generalizes across *proper-fraction* operations. It would also
bypass §91, a checkpoint the roadmap placed deliberately.

Keeping them out is not a judgement that they are unimportant. `src/math/mixed-number.js` is complete
and §13 explicitly permitted building it early; what does not exist is any account of how a learner
should meet them.

**Supersedes / related:** Confirms Roadmap §24 and §§38–44; preserves the §91 checkpoint; related to
DECISION-032, which must accommodate rather than foreclose; raises OQ-24.

## Proposed but not yet accepted

Use the same `**Date:** YYYY-MM-DD` field for proposals, using the proposal date.

*(Implementer proposals waiting for owner review go here.)*
