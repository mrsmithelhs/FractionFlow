# Plan 04 — Orchestrator Review

- **Packet:** `plan-04` — First Vertical Slice — Design and Evidence Preparation
- **Review date:** 2026-09-19
- **Reviewed commits:** `0171d97` (dossier), `6e78271` (progress report)
- **Status at review:** `delivered` (set by the orchestrator on receipt, before verification)
- **Recommendation:** accept, subject to the owner acceptance gate, with the three
  corrections below already applied inline and four items carried into the Phase 2
  implementation packet.

## What was verified, and how

Verification was performed against repository truth, not against the report's own
summary.

| Claim in the delivery | How it was checked | Result |
| --- | --- | --- |
| Exactly five dossier files, no others | directory listing; `git show --stat` on both commits | Confirmed: 5 files, 1112 insertions, plus the report in its own commit. Nothing outside the two authorized paths. |
| Episode definition covers every `04-system-architecture.md` §36 field | read §36 (lines 705–718) and mapped field-by-field to dossier sections 1–9 | Confirmed: all nine fields present, each with substantive content rather than a heading. |
| Canonical instance `relatively-prime-addition__none__2__3__1__4` | read `instanceId()` in `src/content/schema.js:121` and the curated fixture in `src/content/data/phase1-golden-cases.js:131` | Confirmed: the id string is exactly what the implemented builder produces for that fixture. Not invented. |
| Alternate non-LCD path uses denominator 24 | curated fixture carries `alternateDenominator: '24'`; `buildPathFacts` in `src/content/analysis.js:214` emits one `alternate-valid` path | Confirmed. |
| `2/3 → 16/24`, `1/4 → 6/24`, `22/24`, preferred `11/12` | arithmetic checked against the fixture's `exactResult` | Confirmed. |
| Support labels are the canonical ones | `02-interaction-grammar.md:467` names **high support / medium support / low support / independent** as canonical | Confirmed: the dossier uses those exact labels and correctly repeats §524's warning that an `independent` configuration is not `independent transfer`. |
| Accessibility plan maps the §44 floor | `05-quality-and-validation.md:931–949` lists five floor items | Confirmed: the plan's table has exactly those five rows, and keeps mechanized / human / child evidence in separate columns as §943–949 requires. |
| Prototype register covers D-01, D-02, D-05, CM-01 with full falsification structure | read each entry against the packet's checklist and `deferred-recommendations.md` | Confirmed: each entry carries rivals, a per-rival falsifying observation, manipulated and held-constant variables, outcome measures, real-world variation dimensions, a discriminating experiment for **every** live pair (three pairs each for D-02, D-05, CM-01), and a conclusion rule that writes "consistent with A and B" and names a next experiment. |
| No deferred question decided | searched the dossier for selections among the deferred mechanics | Confirmed: no winner is selected anywhere. The founding mandates that *are* fixed (prediction before a material reveal, inspectable final state, reduced-motion equivalence) are cited as held-constant invariants rather than re-decided — which is the correct handling. |
| Working tree clean; status untouched by the implementer | `git status --short`; packet frontmatter history | Confirmed. |

Two additional judgments worth recording:

- **The falsification structures are real, not decorative.** The D-01 entry
  explicitly refuses to let completion speed or click count select a condition;
  CM-01 encodes the synthesis confound that co-presence of bar and symbol is not
  itself evidence of correspondence. These are the failure modes the check exists
  to catch, and the register catches them.
- **Advisor disposition is Branch B — compliant.** This packet produced only
  prose. There is no code, script, schema, or other behavioral surface for an
  advisor to critique, so "not warranted" is within the boundary rather than at
  it. No reflection note is authored for Branch B.

## Corrections applied inline (Tier 1)

These are docs-only corrections made during review. None decides a deferred
question, and none changes the design.

1. **`representationFacts.eligibility` is literally `deferred`.** The episode
   definition referred to a content record that passes "representation capability
   checks" and named the Plan 03 record as the source of
   representation-feasibility facts. In the implemented generator
   (`src/content/generator.js:365–381`) every eligibility verdict is the string
   `'deferred'` and `alternateRepresentationRecommendation` is `'none'`. There is
   no capability verdict to consume today. A Phase 2 implementer reading the
   original wording would have gone looking for a check that does not exist.
   `episode-definition.md` §2 now states the boundary precisely and assigns the
   verdict — and its relationship to the still-open D-06 ceilings — to Phase 2.

2. **Where validity for an unenumerated denominator actually comes from.** The
   dossier requires that a valid path outside authored coverage never be reported
   as mathematical error (correct, per `04-system-architecture.md:921`), but it
   also said the engine "must not independently calculate validity" while naming
   the instance record as the source of paths. The record enumerates only one
   alternate denominator; a learner choosing 36 is validated by
   `validateCommonDenominator` (`src/math/validation.js:36`), which classifies any
   common denominator as `valid-least` or `valid-non-least`. §2 now says that
   calling the exact math contract *is* the compliant behavior, and that the
   engine is not limited to the record's enumerated paths. Without this, a literal
   reading of the original sentence would have produced exactly the defect the
   fallback class exists to prevent.

3. **Two missing pieces of the Phase 2 evidence obligation.** The evidence
   sequence now includes exercising the complete episode at the public GitHub
   Pages URL with no backend, which `06-roadmap.md` §16 mandates in terms that
   explicitly reject local success and asset smoke checks as substitutes; the
   dossier had no deployed-URL step at all. A new "Exit-gate criteria this plan
   does not carry" subsection records that §25's **aesthetic coherence** criterion
   (and the §23 attention it depends on) has no planned mechanism or evidence kind
   here, and must be carried by the implementation packet. The omission was not a
   packet violation — the packet's Requirement 3 enumerates the §16 evidence
   boundary, which the dossier followed exactly — but the gap is real, and would
   otherwise have surfaced at the exit gate instead of at design time.

## Carried into the Phase 2 implementation packet

These are not defects in this dossier. They are consequences of its deferrals
that the next packet must resolve, and they should not be rediscovered.

1. **The first build has to ship one condition.** The register correctly refuses
   to select among animated/static (D-01), morph/juxtapose/sequential (D-02),
   prompt cadence (D-05), and connection-prompt form (CM-01). The scene-model
   position correctly requires that no condition become the architectural
   default. But Phase 2 must render *something*. The implementation packet needs
   an explicit rule: a provisional build condition chosen for runnability, labeled
   in the code and in the report as not-decided, and swappable without touching
   mathematical or instructional state. Absent that rule, the provisional choice
   will be made silently and will harden into a default by inertia.

2. **The register's experiments may have no participants.** Its primary outcomes
   — pre-reveal prediction, immediate equivalence reasoning, uncued transfer —
   require learner observation, while the evidence plan correctly makes child
   evidence optional until an owner gate calls for it. The register does not say
   what holds if that gate never opens. The implementation packet should state the
   standing position for that case (most likely: all four variables remain open,
   the provisional condition stays labeled provisional, and no product default is
   claimed).

3. **Tails, not means.** The conclusion rules turn on a "meaningful regression" in
   agency, inspectability, or participation-floor access. Those are tail events:
   one learner locked out of a required decision matters regardless of the mean.
   The implementation packet should require per-condition worst-case and
   individual-level reporting for participation-floor-relevant outcomes, not
   aggregate statistics.

4. **The transfer task is not authored anywhere.** "Uncued transfer on an
   appropriately changed but mathematically matched task" is a primary outcome in
   every register entry, but neither the episode definition nor Plan 03's covered
   family provides such a task. A fresh denominator pair inside
   `relatively-prime-addition` is available; a symbolic-only matched task is not.
   The implementation packet should name what the transfer item actually is before
   the register's experiments are costed.

## Validation checklist result

Every box in the packet's Validation Checklist is satisfied, with items 1–10
verified independently above. Item 11 (the approval gate) is satisfied in the
sense that the dossier was presented for review and no Phase 2 implementation
packet was drafted; the owner acceptance half of that gate is still open at the
time of this review.
