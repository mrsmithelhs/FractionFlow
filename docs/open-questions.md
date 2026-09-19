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

These cannot be deferred past the Phase 2 implementation packet. They are interdependent: the
display condition constrains the environment matrix, which constrains the accessibility evidence,
which depends on the representation-eligibility verdict.

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
instant transitions, WCAG 2.2 AA conformance (including 2.5.7 Dragging Movements and 2.5.8 Target Size Minimum
per DECISION-010), contrast (4.5:1 text, 3:1 graphical), and 200% zoom. Explicit exclusions named (legacy
browsers, offline PWA, custom audio, native shells).

**Source:** `docs/development/phase-2-first-slice-design/evidence-and-accessibility-plan.md`;
`D-22`; DECISION-009; DECISION-010.

### OQ-04 — Accessibility accommodation versus instructional scaffold

`D-13` asks where an accommodation ends and a scaffold begins. The dossier requires that the
semantic/linear path "preserve the same mathematical responsibility" and never become an
answer-revealing fallback — but a learner who needs the linear path may genuinely need more
support, and the current rule gives no way to grant it without logging it as reduced independence.

**Needs:** a rule for when an access adaptation may change what the learner is asked to do, and how
that is recorded so it is not silently read as weaker performance.

**Source:** `D-13`; participation-floor row 5 of the accessibility plan.

### OQ-05 — Will a child ever be observed, and is Phase 2 acceptance conditional on it?

The entire prototype register turns on outcomes — pre-reveal prediction, immediate equivalence
reasoning, uncued transfer — that require learner observation. The evidence plan correctly makes
child evidence optional until an owner gate calls for it, and that gate has never been opened or
scheduled. If it never opens, every register entry is unrunnable and OQ-01's provisional condition
becomes permanent by default.

**Partially answered 2026-09-19 (DECISION-005).** Children will be observed: informally, at small
n, with permission, on no fixed schedule. The standing position for the four prototype variables in
the meantime is set by DECISION-005 and OQ-01.

**Needs:** the narrower remaining question — whether any child observation is a *precondition* of
Phase 2 acceptance, or whether Phase 2 may be accepted on solo review plus mechanized and human
checks.

**Source:** `plan-04` review, carried-forward item 2; `05-quality-and-validation.md` §52;
`docs/evidence-posture.md`.

### OQ-06 — "Aesthetic coherence" is an exit-gate criterion with no mechanism

Roadmap §25 requires the first episode to feel "calm and deliberate rather than dashboard-like,"
and §23 demands disproportionate attention to whitespace, typography, timing, motion, and touch.
Nothing in the dossier or any packet plans how that is evidenced or by whom. As written it is
unfalsifiable at the gate.

**Needs:** a review mechanism — most plausibly an owner/teacher review rubric, since owner/teacher
review is this project's final authority on anything learner-facing.

**Source:** `06-roadmap.md` §§23, 25; `plan-04` review, inline correction 3.

### OQ-07 — Tail reporting, not averages, for participation-floor outcomes

The register's conclusion rules turn on whether a condition causes a "meaningful regression" in
agency, inspectability, or participation-floor access. Those are tail events: one learner locked
out of a required decision matters regardless of the mean. Aggregate statistics would hide exactly
the failure the floor exists to catch.

**Amended 2026-09-19 (DECISION-005).** This matters more under a small-n ladder, not less: at an n
of five, every observation *is* the tail and there is no mean worth reporting.

**Needs:** a reporting rule requiring per-condition worst-case and individual-level results for
participation-floor-relevant outcomes.

**Source:** `plan-04` review, carried-forward item 3; `docs/evidence-posture.md`.

### OQ-08 — The transfer task does not exist

"Uncued transfer on an appropriately changed but mathematically matched task" is a primary outcome
in all four register entries. Neither the episode definition nor Plan 03's covered family provides
such a task. A fresh denominator pair inside `relatively-prime-addition` is available; a
symbolic-only matched task is not.

**Needs:** the transfer item named and authored, or the outcome removed from the register, before
the experiments are costed.

**Source:** `plan-04` review, carried-forward item 4.

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

`docs/presentation-posture.md` requires that basic participation not depend on a deeply hidden or
teacher-only mode: a learner needing keyboard, non-drag, reduced-motion, or semantic access should
be able to discover and use that path themselves. The project is static-only with no accounts
(`00-principles.md`; DECISION-001), so any persisted preference lives in browser storage on a
device that may be shared by a class.

Both failure directions are real: a persisted preference carries one child's reduced-motion or
keyboard setting to the next child at the same machine, and a non-persisted preference makes a
learner who needs it re-select it every session. This is entangled with `D-10` (shared-device
identity, reset, guest-save) and `D-11` (portable progress token), both currently deferred past
Phase 2 — which may no longer be the right classification if Phase 2 ships a preference control.

**Needs:** an owner decision on whether access preferences are per-session and set within the
scene, or persisted locally — and if persisted, what resets them on a shared device. If this forces
`D-10` earlier, say so explicitly rather than letting Phase 2 improvise a storage behavior.

### OQ-16 — How is the design-condition switcher reached, and does it ship publicly?

DECISION-006 requires that the provisional design condition be swappable at runtime in the deployed
build, so alternatives can be exercised in ordinary browser testing rather than rebuilt. The
mechanism is open, and it collides with a rule this project just set.

`docs/presentation-posture.md` Part 2 rule 2 states that the research apparatus is never visible to
the learner. A visible app-root menu offering "morph / juxtapose / sequential" would violate that
directly. So the switcher and the learner preference surface (OQ-15) are **two different surfaces**
that must not be merged: preferences are discoverable by design, conditions are not.

**Resolved 2026-09-19 (DECISION-015).** The design-condition switcher is reached via a settings gear
icon on the application's entry page (`src/app/`). This menu houses upstream condition switching and
future preferences (motion, contrast, audio). Condition options inside this menu use plain-language
descriptions of visual/interaction styles (or a distinct Reviewer/Teacher grouping) to ensure research
apparatus does not confuse learners, keeping specification codes in internal data attributes.

**Source:** DECISION-006; `docs/presentation-posture.md` Part 2; DECISION-015.

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

**Needs:** an owner statement of the primary learner for the product as a whole — distinct from
the Phase 2 slice's deliberately narrow prerequisite boundary — so `D-08` and `D-09` can be
sequenced against something.

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

**Needs:** the remaining half — who authors learner-facing strings, who reviews them against the
target and the register rules, and at what point in a packet that happens. A target nobody is
assigned to apply is not yet a control.

### OQ-11 — What is the stopping rule for specification?

As of 2026-09-19 the repository holds roughly 3,700 lines of source (all of it in `src/math/` and
`src/content/`; `src/app/`, `src/interaction/`, `src/render/`, and `src/styles/` are empty) against
roughly 45,800 lines of documentation and reports. No child has seen anything, and no learner-facing
pixel exists. This is defensible for a declared design-and-specification stage, and the founding
documents are the product's spine rather than overhead. But every one of those 45,800 lines encodes
an assumption about a learner nobody has observed, and the ratio is the project's main standing
risk.

**Needs:** an owner position on what triggers the shift from specifying to building — most usefully
expressed as a rule about what Phase 2 is allowed to leave unspecified, rather than a target ratio.

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

---

## Process / workflow

### OQ-12 — Advisor consultation has not yet been exercised on a behavioral packet

`plan-01` ran a full consultation; `plan-04` was correctly Branch B (docs-only). The convention's
stated risk is a Branch B declaration on a packet that does have a behavioral surface. Phase 2 will
be the first substantial learner-facing behavioral packet, and the first real test of the
convention.

**Needs:** nothing yet — this is a watch item for the Phase 2 review, recorded so it is not
forgotten.
