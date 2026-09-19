# Phase 2 First-Slice Design Dossier

## Review status

> **Status note added 2026-09-19.** Plan 04 is owner-accepted and complete; the owner approval gate
> referenced below is satisfied. This dossier is the historical design proposal and remains binding for
> Phase 2 only as constrained by later accepted decisions, the Phase 2 reconciliation, and the active
> implementation packet. In a conflict, the later decision and packet govern. See
> `docs/decision-log.md` and `reports/orchestration/phase-2-specification-reconciliation.md`.

This is a design proposal for owner and orchestrator review under `plan-04`. It is
not an implementation, an acceptance record, a WCAG conformance claim, or a
decision that closes any deferred prototype variable. The packet remains subject
to the owner approval gate in `docs/development/plan-04-first-vertical-slice-design-preparation.md`.

## Purpose and scope

This dossier prepares one narrow Phase 2 vertical slice: unlike-denominator
proper-fraction addition in which both operands must be renamed to a common unit.
The fraction bar is the primary representation and symbolic notation participates
in the same episode. The design is reusable across eligible Plan 03 instances;
`2/3 + 1/4` is the canonical worked example, not a one-off application path.

The dossier translates the founding contracts into a reviewable episode design,
scene-model position, evidence plan, accessibility plan, replay plan, and
prototype-variable register. It intentionally does not write application code or
choose among the deferred display and prompt mechanics.

## Claim boundaries

The dossier may establish design intent and a future validation plan. It does not
establish that:

- the episode has been implemented or observed;
- the visual transformation is understandable, accessible, or effective;
- a learner can learn Stages A–E from this episode as a novice;
- independent transfer, persistence, fading efficacy, or instructional efficacy
  has been demonstrated;
- any fixed denominator/rendering ceiling, session dose, first-run placement,
  persistence policy, identity policy, number-line timing, license, privacy
  statement, or deployment choice has been decided; or
- any prototype condition is preferred.

The accessibility section plans mechanized checks, human review, and child
usability evidence as separate evidence kinds. Untested modes remain explicitly
untested until the Phase 2 implementation and acceptance work supplies evidence.

## Dossier map

| File | Review purpose |
| --- | --- |
| [`episode-definition.md`](episode-definition.md) | Reusable episode definition, responsibilities, beats, supports, representation roles, authored path coverage, fallback class, and completion conditions. |
| [`scene-model-position.md`](scene-model-position.md) | Architectural position on the Scene Model as a projection, with rejected architectural alternatives separated from empirical hypotheses. |
| [`prototype-variable-register.md`](prototype-variable-register.md) | Undecided comparisons for D-01, D-02, D-05, and the connection-making prompt form, each with a falsification plan. |
| [`evidence-and-accessibility-plan.md`](evidence-and-accessibility-plan.md) | Prerequisite and evidence contract, provenance requirements, scaffold-leakage and replay plans, accessibility participation-floor plan, and untested modes. |

## Canonical content contract used by this dossier

The episode consumes a validated Plan 03
`fractionflow.problem-instance/v1` record with the structural selector
`relatively-prime-addition`. The selector describes proper operands, relatively
prime denominators, two canonical renamings, and an LCD equal to the denominator
product. The content record remains the owner of exact mathematical truth; this
dossier only assigns instructional responsibilities around that truth.

For the curated synthetic example, Plan 03 supplies:

- source forms `2/3` and `1/4`;
- canonical LCD path `2/3 = 8/12`, `1/4 = 3/12`, then `8/12 + 3/12 = 11/12`;
- alternate valid non-LCD path `2/3 = 16/24`, `1/4 = 6/24`, then
  `16/24 + 6/24 = 22/24`; and
- exact result `11/12`, with the alternate raw result recognized as equivalent
  and correct but unsimplified.

The dossier does not recalculate these facts, replace the content record, or
require every mathematically valid common denominator to have an authored visual
choreography. It specifies what the future episode must do when a valid path is
outside authored coverage.

## Review checklist

Before the owner/orchestrator considers the dossier for acceptance, review that:

- every Episode Definition field from System Architecture §36 is present;
- learner and system responsibilities remain separable at every required beat;
- the LCD path and a non-LCD valid path are covered without canonical-path
  absolutism;
- valid-but-outside-coverage behavior is not reported as mathematical error;
- the Scene Model position preserves `mathematical state → instructional state →
  presentation` and does not create a drifting second state store;
- D-01, D-02, D-05, and the connection-making prompt-form question remain
  explicitly undecided and carry complete falsification structures;
- allowed and disallowed evidence claims are not conflated;
- the accessibility plan maps every participation-floor item to a mechanism and
  separately names mechanized, human, and child evidence; and
- no dossier statement silently closes a deferred recommendation or an owner
  gate.

## Governing references

- `docs/founding/03-math-and-content-model.md` §§27, 35, 54–61, 68–69, 80–83
- `docs/founding/01-instructional-model.md` §§16–19, 25–28, 32, 34–35
- `docs/founding/02-interaction-grammar.md` §§21–24, 29, 31–33, 37–40, 51–52,
  66, 75–78
- `docs/founding/04-system-architecture.md` §§12–22, 36–48, 64, 66–71
- `docs/founding/05-quality-and-validation.md` §§17–22, 26–29, 37–44, 47–52
- `docs/founding/06-roadmap.md` §§16–25
- `reports/orchestration/founding-docs-review/deferred-recommendations.md`
  items D-01, D-02, D-05, D-16, D-20, and D-22
