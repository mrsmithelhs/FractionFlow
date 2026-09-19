# Pending merge into `docs/open-questions.md` and `docs/decision-log.md`

**Why this file exists:** a design-review session was live on 2026-09-19 when this content was
written. That session's prompt gives it write authority over both `docs/open-questions.md` and
`docs/decision-log.md`. Two agents appending to the same files concurrently is unsafe regardless
of care, so this content is staged here instead.

**How to use it:** when the design-review session hands back and its work is committed, the
orchestrator merges these entries into the two target files, then **deletes this file**. It is
self-liquidating; it is not a durable record.

**Do not** let this file accumulate additional queued content. If it is still here after the
design-review session closes, that is a defect.

---

## For `docs/decision-log.md`, under "Accepted decisions"

### DECISION-003 - Accessibility and presentation posture for learner-facing layers

**Date:** 2026-09-19

**Decision:** Accessibility increases access to the learning experience; it does not replace the
experience with an explanatory control panel. The default learner experience optimizes for
mathematical clarity, calm hierarchy, low cognitive load, and efficient mouse/touch interaction.
Motion-enabled presentation may be the default; reduced-motion must remain available,
discoverable, and meaning-preserving without needing to feel identical. Mouse and touch may be the
most prominent interaction path while keyboard and non-precision alternatives remain viable for
every required decision. Accessibility semantics do not imply a large visible textual interface and
may use progressive disclosure. Basic participation must not depend on a hidden or teacher-only
mode. The full posture, including the two-axis distinction it turns on and the participation-floor
boundary it does not relax, is `docs/accessibility-posture.md`.

**Rationale:** The founding documents already define accessibility as a participation floor and an
architectural capability rather than a mandate that every access mode be equally prominent
(`05-quality-and-validation.md` §44), and already require calmness as functional
(`00-principles.md` §18), a stable instructional hierarchy (`02-interaction-grammar.md` §71), and
over-scaffolding review (`05-quality-and-validation.md` §20). This decision records the owner's
reading of how those contracts apply as the project enters presentation layers, so that
accessibility work is not misapplied as license for cognitive overload, dashboard accumulation, or
an explanatory-text-first interface — and equally, so that "calm" is not misapplied as license to
degrade the floor.

**Supersedes / related:** `docs/accessibility-posture.md`;
`docs/founding/05-quality-and-validation.md` §44; `docs/founding/02-interaction-grammar.md`
§§71–72; open questions OQ-13, OQ-14, OQ-15.

---

## For `docs/open-questions.md`, under "Live for Phase 2"

### OQ-13 — Is drag an enhancement over a non-drag primary, or the primary with a non-drag fallback?

`05-quality-and-validation.md` §44 requires that every required learner decision be *completable*
without precision dragging. `docs/accessibility-posture.md` permits mouse and touch to be the most
efficient and visually prominent path. Both can be true of a design whose prominent path is
drag-based and whose non-drag path is a secondary fallback — the letter of the floor is satisfied
while the experience is drag-first.

That distinction is not academic for this product. Upper-elementary children on touch devices are
precisely the population for whom precision dragging fails, and the failure is silent: a child who
cannot place a drag target accurately does not report an accessibility problem, they just get the
answer wrong. This interacts with OQ-09 (who the first slice is actually for).

**Needs:** an owner rule stating whether drag is permitted only as an enhancement layered over a
non-drag primary interaction, or as a primary interaction with a non-drag alternative — and, if the
latter, what evidence would show the alternative is not second-class.

### OQ-14 — What may progressive disclosure hide, per beat, without either leaking or removing access?

`docs/accessibility-posture.md` endorses progressive disclosure so that accessibility semantics do
not become a wall of text. The `plan-04` scaffold-leakage invariants forbid the requested value
appearing as "accessible-only text" (invariant 2) and forbid answer-revealing alternatives in
either the visual or the semantic path (invariant 4). Meanwhile, content hidden from the
accessibility tree is not disclosed progressively — it is removed for that access path.

There is a narrow correct band here: present in the DOM, reachable on demand, not announced or
pre-revealed before the required response. Nobody has written the rule that defines it, and the
leakage tests cannot be authored without it.

**Needs:** a per-beat rule for what may be present-but-undisclosed in each access path, precise
enough for the D-16 fail-first invariants to test against.

### OQ-15 — How does a learner's access preference persist on a shared device with no accounts?

`docs/accessibility-posture.md` requires that basic participation not depend on a deeply hidden or
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
