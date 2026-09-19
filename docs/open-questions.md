# Open Questions

This file lists questions that are **genuinely unresolved** - pending investigation, prototype, or owner decision. Resolved questions move to `docs/decision-log.md`.

## Scope of this file

This file holds **durable owner decisions that are not yet made**. It is a curated index, not a
catch-all.

- **Belongs here:** a fork the owner must resolve, where the choice shapes product, policy,
  privacy, scope, or audience.
- **Does not belong here:** packet-local findings (they live in the packet's report under
  `reports/development/`), implementation defects (repair notes or a new packet), and ordinary
  to-do items.
- **Relationship to the deferred register:** the 29 items `D-01`–`D-29` in
  `reports/orchestration/founding-docs-review/deferred-recommendations.md` remain the durable
  record of *why* each item was deferred and what evidence would settle it. This file does not
  restate them. It names which of them are **live now**, adds questions the founding review did
  not raise, and points at the rest.

Each entry carries a **Needs:** line stating what would actually resolve it. An entry with no
`Needs:` line is not yet a usable question.

---

## Live for Phase 2 — these block the implementation packet

> **Status: All items resolved or disposed of.** Every question originally in this section has been
> resolved, downgraded to implementation, dissolved, or reclassified per DECISION-024. There are
> no remaining blocking open questions for the Phase 2 implementation packet.

### OQ-01 — The first build must ship one display and prompt condition

`plan-04`'s register deliberately leaves `D-01` (animated vs static/key-frame), `D-02`
(morph / juxtapose / sequential), `D-05` (prompt density and prediction cadence), and `CM-01`
(connection-making prompt form) undecided, and the Scene Model position correctly forbids any one
of them becoming the architectural default. But Phase 2 must render something. Without an explicit
rule, the provisional choice gets made silently by whoever writes the first renderer and hardens
into a default by inertia — which is exactly the outcome the register exists to prevent.

**Resolved 2026-09-19 (DECISION-007, DECISION-012).** Phase 2 adopts Bundle 1 as its provisional condition:
animated subdivision (D-01-A) with static reduced-motion parity, semantic morph-in-place (D-02-M),
focused key-beat prompts (D-05), and a visual matching task with distractors (CM-01-M per DECISION-012).
Labeled not-decided and swappable at runtime upstream per DECISION-006.

**Source:** `reports/development/plan-04-first-vertical-slice-design-preparation/review.md`,
carried-forward item 1; `docs/evidence-posture.md`; DECISION-007; DECISION-012.

### OQ-02 — There is no representation-eligibility verdict to consume

Every `representationFacts.eligibility` value that Plan 03 produces is literally the string
`'deferred'` (`src/content/generator.js`), and `alternateRepresentationRecommendation` is `'none'`.
The episode definition requires an explicit capability check before rendering, but no verdict
exists to check against. This is entangled with `D-06` (concrete denominator and rendering
thresholds), which is also open.

**Resolved 2026-09-19 (DECISION-008, DECISION-011).** Eligibility is computed deterministically upstream in
`src/content/` (e.g. `checkBarEligibility`) before episode instantiation. Initial Phase 2 fraction-bar
ceilings are reconciled by DECISION-011 to LCD <= 30 and single-operand scale factor <= 12 (matching
the generator profile); valid mathematical instances or proposals exceeding these bounds fail closed
to `valid-but-outside-representation-capability` and transition to symbolic continuation.

**Source:** `docs/development/phase-2-first-slice-design/episode-definition.md` §2; `D-06`;
DECISION-008; DECISION-011.

### OQ-03 — The supported-environment matrix is deferred to a gate that has arrived

`D-22` is explicitly routed to "the implementation gate," and the accessibility plan lists every
environment dimension as *Untested; no matrix selected*. That gate is the Phase 2 packet. The
participation floor cannot be evidenced against an unnamed set of environments.

**Resolved 2026-09-19 (DECISION-009, DECISION-010).** Supported-environment matrix selected: modern evergreen
browsers (Chrome, Safari, Firefox, Edge across desktop, ChromeOS, iOS, Android), responsive viewports
360px–1440px with reflow to 320px, touch (no precision drag), pointer, keyboard, reduced-motion
instant transitions, built against WCAG 2.2 AA (including 2.5.7 Dragging Movements and 2.5.8 Target Size Minimum
per DECISION-010), contrast (4.5:1 text, 3:1 graphical), and 200% zoom. Explicit exclusions named (legacy
browsers, offline PWA, custom audio, native shells).

**Source:** `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md`;
`D-22`; DECISION-009; DECISION-010.

### OQ-04 — Accessibility accommodation versus instructional scaffold

`D-13` asks where an accommodation ends and a scaffold begins. The dossier requires that the
semantic/linear path "preserve the same mathematical responsibility" and never become an
answer-revealing fallback — but a learner who needs the linear path may genuinely need more
support, and the current rule gives no way to grant it without logging it as reduced independence.

**Downgraded to implementation decision 2026-09-19 (DECISION-024).** DECISION-013 (tap primary)
and DECISION-014 (beat-gated DOM lifecycle) establish the primary interaction and anti-leakage
boundaries. Any specific support adaptation on the linear path is decided and recorded with rationale
during implementation of that path, without blocking Phase 2 specification.

**Source:** `D-13`; participation-floor row 5 of the accessibility plan; DECISION-024.

### OQ-05 — Will a child ever be observed, and is Phase 2 acceptance conditional on it?

The entire prototype register turns on outcomes — pre-reveal prediction, immediate equivalence
reasoning, uncued transfer — that require learner observation. The evidence plan correctly makes
child evidence optional until an owner gate calls for it, and that gate has never been opened or
scheduled. If it never opens, every register entry is unrunnable and OQ-01's provisional condition
becomes permanent by default.

**Resolved 2026-09-19 (DECISION-020).** Phase 2 acceptance is achievable on solo review, automated
checks, and adult accessibility/instructional review, including public deployment verification. Child
observation is not a blocking precondition; small-n child evidence remains valuable post-acceptance
disqualification evidence on no fixed schedule per DECISION-005.

**Source:** `plan-04` review, carried-forward item 2; `05-quality-and-validation.md` §52;
`docs/evidence-posture.md`; DECISION-005; DECISION-020.

### OQ-06 — "Aesthetic coherence" is an exit-gate criterion with no mechanism

Roadmap §25 requires the first episode to feel "calm and deliberate rather than dashboard-like,"
and §23 demands disproportionate attention to whitespace, typography, timing, motion, and touch.
Nothing in the dossier or any packet plans how that is evidenced or by whom. As written it is
unfalsifiable at the gate.

**Resolved 2026-09-19 (DECISION-021).** Evaluated using a 4-point Owner/Teacher Review Rubric derived
from `docs/presentation-posture.md` review questions (restraint against dashboard accumulation,
DECISION-004 grade 2–3 reading rules, WCAG 2.2 SC 2.5.8 touch target sizing, and anchored calm pacing).
Any single violation is a blocking failure at the acceptance gate.

**Source:** `06-roadmap.md` §§23, 25; `docs/presentation-posture.md`; DECISION-021.

### OQ-07 — Tail reporting, not averages, for participation-floor outcomes

The register's conclusion rules turn on whether a condition causes a "meaningful regression" in
agency, inspectability, or participation-floor access. Those are tail events: one learner locked
out of a required decision matters regardless of the mean. Aggregate statistics would hide exactly
the failure the floor exists to catch.

**Resolved 2026-09-19 (DECISION-022).** For small-n observations, participation-floor and accessibility
outcomes must be reported at the individual level, reporting worst-case tail events; an aggregate mean
cannot mask an individual lockout. Aggregate metrics are permitted when sample sizes warrant them, but
must complement, never substitute for, worst-case individual reporting.

**Source:** `plan-04` review, carried-forward item 3; `docs/evidence-posture.md`; DECISION-005; DECISION-022.

### OQ-08 — The transfer task does not exist

"Uncued transfer on an appropriately changed but mathematically matched task" is a primary outcome
in all four register entries. Neither the episode definition nor Plan 03's covered family provides
such a task. A fresh denominator pair inside `relatively-prime-addition` is available; a
symbolic-only matched task is not.

**Dissolved 2026-09-19 (DECISION-024).** Uncued transfer is struck from the prototype-variable
register's primary outcomes because it is unmeasurable on a small-n disqualification evidence ladder
(DECISION-005). No transfer task is required or costed for Phase 2.

**Source:** `plan-04` review, carried-forward item 4; DECISION-005; DECISION-024.

### OQ-13 — Is drag an enhancement over a non-drag primary, or the primary with a non-drag fallback?

`05-quality-and-validation.md` §44 requires that every required learner decision be *completable*
without precision dragging. `docs/presentation-posture.md` permits mouse and touch to be the most
efficient and visually prominent path. Both can be true of a design whose prominent path is
drag-based and whose non-drag path is a secondary fallback — the letter of the floor is satisfied
while the experience is drag-first.

That distinction is not academic for this product. Upper-elementary children on touch devices are
precisely the population for whom precision dragging fails, and the failure is silent: a child who
cannot place a drag target accurately does not report an accessibility problem, they just get the
answer wrong. This interacts with OQ-09.

**Resolved 2026-09-19 (DECISION-013).** Direct tap/click selection and keyboard navigation are the
primary interaction modes for all required learner decisions. Dragging is never required to complete
any decision; if implemented, it operates strictly as an optional progressive enhancement that mirrors
discrete tap actions. Conforms to WCAG 2.2 AA SC 2.5.7 per DECISION-010.

**Source:** `docs/presentation-posture.md` Part 1; DECISION-010; DECISION-013.

### OQ-14 — What may progressive disclosure hide, per beat, without either leaking or removing access?

`docs/presentation-posture.md` endorses progressive disclosure so that accessibility semantics do
not become a wall of text. The `plan-04` scaffold-leakage invariants forbid the requested value
appearing as "accessible-only text" (invariant 2) and forbid answer-revealing alternatives in
either the visual or the semantic path (invariant 4). Meanwhile, content hidden from the
accessibility tree is not disclosed progressively — it is removed for that access path.

There is a narrow correct band here: present in the DOM, reachable on demand, not announced or
pre-revealed before the required response. Nobody has written the rule that defines it, and the
leakage tests cannot be authored without it.

**Resolved 2026-09-19 (DECISION-014).** The DOM and accessibility tree lifecycle is beat-gated:
unreached beats and future mathematical values/answers are not mounted in the DOM at all until
reached (preventing virtual cursor leaks). Within the current beat, secondary scaffolds (hints,
orienting cues) are disclosed on-demand upon explicit request, simultaneously mounting to visual
and semantic trees with support provenance logged.

**Source:** `docs/presentation-posture.md` Part 1; `D-16`; DECISION-014.

### OQ-15 — How does a learner's access preference persist on a shared device with no accounts?

*Reclassified out of the Phase 2 blocking section to [Deferred past Phase 2](#oq-15--how-does-a-learners-access-preference-persist-on-a-shared-device-with-no-accounts) per DECISION-024.*

### OQ-16 — How is the design-condition switcher reached, and does it ship publicly?

DECISION-006 requires that the provisional design condition be swappable at runtime in the deployed
build, so alternatives can be exercised in ordinary browser testing rather than rebuilt. The
mechanism is open, and it collides with a rule this project just set.

`docs/presentation-posture.md` Part 2 rule 2 states that the research apparatus is never visible to
the learner. A visible app-root menu offering "morph / juxtapose / sequential" would violate that
directly. So the switcher and the learner preference surface (OQ-15) are **two different surfaces**
that must not be merged: preferences are discoverable by design, conditions are not.

**Resolved 2026-09-19 (DECISION-015, superseded by DECISION-019).** The design-condition switcher is
reached via a settings gear icon on the application entry page (`src/app/`). Per DECISION-019 the menu
holds the condition switcher **only** in Phase 2 — no learner or application preferences are assigned
to it at this stage — so DECISION-006 surface separation is preserved rather than modified, and the
whole menu is the reviewer surface. Condition options use plain-language, child-safe descriptions of
visual and interaction style, with specification codes kept in internal data attributes. Condition
selection does not persist across sessions.

**Source:** DECISION-006; `docs/presentation-posture.md` Part 2; DECISION-015; DECISION-019.

---

## Audience aim — raised 2026-09-19, not from the founding review

These were opened by the orchestrator after `plan-04` closed, on the question of whether the
project is still aimed at the learner it says it serves. They are not derived from `D-01`–`D-29`.

### OQ-09 — Who is the first slice actually for?

The project describes itself as helping learners move from visual understanding to efficient
symbolic computation. But Phase 2 targets a learner who **already has** fractional units,
numerator/denominator meaning, simple equivalence, like-denominator addition, and the idea of a
common unit (Stages A–D). "A student learning fractions" and "a student who has the prerequisites
and is learning to add unlike denominators" are different audiences, and the second is
considerably narrower. The child who is most visibly struggling with fractions often lacks exactly
the Stage A–D prerequisites the slice assumes.

This is a legitimate scoping choice for one vertical slice, and the roadmap is honest about it.
The open question is what it implies for the product: whether the primary learner is the initial
learner or the conceptually-repairing learner determines what Phase 3 builds first, and `D-08`
(first-run placement) and `D-09` (backward routing to prerequisites) are both downstream of it.

**Resolved 2026-09-19 (DECISION-016).** The primary learner for the product as a whole is the
conceptually-repairing upper-elementary learner (grades 4–6) who has encountered fractions in school
but lacks conceptual understanding or struggles with operations. The platform functions as an intervention
and visual sense-making environment; first-run placement (`D-08`) and backward routing (`D-09`) orient
around targeted visual repair of prerequisites.

**Source:** `docs/founding/01-instructional-model.md`; DECISION-016.

### OQ-10 — Who authors and reviews learner-facing strings, and when?

`D-19` names readability targets and prompt-length limits as deferred, and no packet owns them. The
first slice's entire learner-facing surface is text: prompts, help layers, status announcements,
error recovery, and the semantic/linear alternative that the accessibility floor depends on. All of
it is currently specified in adult technical prose. If prompts are authored at adult reading level,
an upper-elementary child cannot participate regardless of how correct the mathematics is — and the
linear path, which exists precisely to preserve access, would fail hardest.

**Target resolved 2026-09-19 (DECISION-004):** approximately grade 2–3, with the mathematical terms
the episode teaches exempt, enforced by working rules and human review rather than a readability
formula. See `docs/presentation-posture.md` Part 2. `docs/presentation-posture.md` Part 2 also rules
that specification vocabulary is never learner-facing vocabulary.

**Workflow resolved 2026-09-19 (DECISION-017, DECISION-023):** Implementers author all learner-facing
strings in a centralized table (`src/render/strings.js` per DECISION-023) against the DECISION-004
working rules; orchestrators and owners review and gate them during packet verification before acceptance.

**Source:** `docs/presentation-posture.md` Part 2; DECISION-004; DECISION-017; DECISION-023.

### OQ-11 — What is the stopping rule for specification?

As of 2026-09-19 the repository holds roughly 3,700 lines of source (all of it in `src/math/` and
`src/content/`; `src/app/`, `src/interaction/`, `src/render/`, and `src/styles/` are empty) against
roughly 45,800 lines of documentation and reports. No child has seen anything, and no learner-facing
pixel exists. This is defensible for a declared design-and-specification stage, and the founding
documents are the product's spine rather than overhead. But every one of those 45,800 lines encodes
an assumption about a learner nobody has observed, and the ratio is the project's main standing
risk.

**Resolved 2026-09-19 (DECISION-018).** The specification phase stops immediately after Batch D
(exit-gate criteria). Phase 2 specifies only state contracts, transition rules, scene projections,
and accessibility invariants; layout coordinates, visual styling, and animation tuning are left
to implementation discovery. All post-slice features (session dose `D-07`, multi-episode progression,
placement `D-08`, backward routing `D-09`, shared identity `D-10`, portable tokens `D-11`) remain deferred.

**Source:** DECISION-018.

---

## Deferred past Phase 2

These are recorded in full in `reports/orchestration/founding-docs-review/deferred-recommendations.md`
and are **not** live for the Phase 2 implementation packet. Listed here so they are not rediscovered
as new findings.

- **Instructional sequencing:** `D-03` number-line timing, `D-04` bridge frequency and
  blocked/interleaved schedules, `D-09` backward routing to prerequisite episodes.
- **Session and progression:** `D-07` session dose and completion behavior, `D-08` first-run
  placement (see OQ-09), `D-10` shared-device identity, `D-11` portable progress token,
  `D-12` replay across generator revisions.
- **Content and evidence:** `D-14` misconception candidates, `D-15` undefined partial number-line
  scenes, `D-17` golden-case diversity (largely addressed in `plan-02`), `D-18` content-authoring
  workload and review budget, `D-19` standards alignment (readability portion is now OQ-10).
- **Release and policy:** `D-21` offline resilience and service worker, `D-23` license selection,
  `D-24` public privacy statement, `D-25` share-link schema, `D-26` supply-chain and browser
  security controls, `D-27` public-MVP timing.
- **Already addressed:** `D-16` scaffold-leakage invariants (planned in the `plan-04` dossier) and
  `D-20` Scene Model projection (answered by the `plan-04` scene-model position). Both remain open
  only in the sense that no implementation exists to satisfy them.

### OQ-15 — How does a learner's access preference persist on a shared device with no accounts?

`docs/presentation-posture.md` requires that basic participation not depend on a deeply hidden or
teacher-only mode: a learner needing keyboard, non-drag, reduced-motion, or semantic access should
be able to discover and use that path themselves. The project is static-only with no accounts
(`00-principles.md`; DECISION-001), so any persisted preference lives in browser storage on a
device that may be shared by a class.

Both failure directions are real: a persisted preference carries one child's reduced-motion or
keyboard setting to the next child at the same machine, and a non-persisted preference makes a
learner who needs it re-select it every session. This is entangled with `D-10` (shared-device
identity, reset, guest-save) and `D-11` (portable progress token), both currently deferred past
Phase 2.

**Reclassified to Deferred Past Phase 2 2026-09-19 (DECISION-024).** DECISION-019 removed the
premise: Phase 2 ships no in-app learner preference surface and stores nothing in the browser. Every
§44 floor item is met by always-on design or by an OS/browser preference the app honors rather than
hosts. This question becomes live again when the first in-app learner preference is introduced.

**Needs:** an owner decision on whether access preferences are per-session and set within the
scene, or persisted locally — and if persisted, what resets them on a shared device. When in-app
preferences are introduced post-Phase 2, resolve alongside `D-10` and `D-11`.

**Source:** `docs/presentation-posture.md` Part 1; `D-10`; `D-11`; DECISION-019; DECISION-024.

---

## Deferred opportunities — not blocking Phase 2

Opportunities the owner deliberately wants held open rather than closed. They are not blockers and
must not become scope creep inside Phase 2; each names the minimum Phase 2 owes it, which is
usually very little.

### OQ-17 — A bounded exit for learners below the prerequisite boundary

DECISION-016 names the primary learner as one who may hold persistent misconceptions, including
adding denominators across. The episode's stated prerequisites include the idea of a common unit,
which such a learner plausibly lacks, and DECISION-016's own remedy — backward routing to
prerequisite episodes — is `D-09`, deferred past Phase 2. A learner who stalls on equivalence
therefore has nowhere to go.

The owner's position is explicit and bounded: keep the product focused on the identified learner,
and **do not** let this become an obligation to teach basic arithmetic. The opportunity is a
graceful exit, not a curriculum. At minimum, a learner who repeatedly cannot proceed could be
told, calmly and without blame, that this might be a good thing to talk through with a teacher —
common denominators and common units by name, so the conversation has a starting point.

**Phase 2 owes this:** nothing beyond not foreclosing it. The episode's error-recovery and help
paths should leave room for such a message to be added later without restructuring.

**Needs:** a decision on whether the bounded message ships at all, what triggers it, and how it
avoids reading as failure or as a dead end. Resolve alongside `D-08` and `D-09` rather than
separately.

### OQ-18 — Creative approaches to completed-beat clutter

DECISION-014 keeps completed beats mounted as inspectable context. DECISION-021 criterion 1 blocks
acceptance on a scene that competes with the fraction bar and the current question. Across six
beats on a narrow viewport those two pull against each other, and founding `05-quality-and-validation.md`
§32 asks what can be removed from the learner's immediate visual field.

The owner reads this as a design opportunity rather than a constraint problem, and wants the space
held open for good UX options: a completed beat might collapse to a compact line, fold into a
reviewable trail, fade to a quieter register, or resolve some other way that keeps it reachable
without keeping it loud. Inspectable need not mean full-size and fully expanded.

**Phase 2 owes this:** one working collapse behavior that satisfies both DECISION-014 (completed
beats remain reachable and inspectable) and DECISION-021 criterion 1 (the scene stays calm). The
renderer packet must ship *a* rule. It does not have to ship the best one.

**Needs:** exploration of richer options once the first slice runs and the clutter is observable
rather than hypothetical. A candidate for a later design pass with real screens in front of the
owner.

---

## Process / workflow

### OQ-12 — Advisor consultation has not yet been exercised on a behavioral packet

`plan-01` ran a full consultation; `plan-04` was correctly Branch B (docs-only). The convention's
stated risk is a Branch B declaration on a packet that does have a behavioral surface. Phase 2 will
be the first substantial learner-facing behavioral packet, and the first real test of the
convention.

**Needs:** nothing yet — this is a watch item for the Phase 2 review, recorded so it is not
forgotten.
