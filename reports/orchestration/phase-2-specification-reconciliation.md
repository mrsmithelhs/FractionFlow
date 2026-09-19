# Phase 2 Specification Reconciliation

Skeptical orchestrator pass over DECISION-001 through DECISION-024, performed 2026-09-19 after
the design-review session declared the Phase 2 blocking section empty (DECISION-024).

Verified before writing: `node scripts/dev/plan-status.js lint` clean; working tree clean; the
"Live for Phase 2" section of `docs/open-questions.md` contains no remaining `Needs:` line.

## What holds together

Crediting coherence matters here, because most of this set is sound and the findings below are
seams, not a verdict on the whole.

- **The evidence chain is genuinely coherent.** DECISION-005 (small-n ladder, disqualification
  only) → DECISION-007 (provisional bundle chosen on design grounds rather than awaiting a study)
  → DECISION-006 (runtime swappability makes that provisionality real) → DECISION-019 (switcher
  scoped to conditions only, nothing persisted). Each step follows from the one before, and the
  chain closes: the register's inability to select a winner is answered by a mechanism rather than
  by a deferral.
- **DECISION-011 correctly reconciles a cross-layer contradiction.** It aligns the presentation
  eligibility ceiling with `maxAlternateScaleFactor` in `src/content/profiles.js`, ending a state
  where the content layer recorded alternate paths the renderer would have refused.
- **DECISION-013 and DECISION-014 are mutually consistent and well reasoned.** Tap-primary plus
  beat-gated mounting makes scaffold leakage structurally impossible rather than test-detectable,
  which is a stronger guarantee than `D-16` asked for.
- **DECISION-021 replaced an unfalsifiable criterion with a falsifiable one.** This was the
  specific risk flagged before Batch D, and the outcome went the right way.

## Findings

Ranked by cost of discovering them late. None blocks drafting the next packet wave; R2, R3, and
R6 must be disposed of before the renderer packet is drafted.

### R2 — The denominator ceiling and the touch-target rule can collide (highest)

Four decisions interact:

- DECISION-011 permits LCD up to 30.
- DECISION-009 supports viewports from 360px, reflowing to 320px.
- DECISION-010 and DECISION-021 criterion 3 require interactive controls at ≥ 24×24 CSS px
  (WCAG 2.2 SC 2.5.8) "with generous visual margins."
- DECISION-013 makes tap/click primary for all required decisions, naming *renaming* among them.

If fraction-bar segments are themselves tap targets, a bar at LCD 30 on a 360px viewport yields
roughly 12px per segment — half the required minimum. DECISION-021 makes any single violation a
**blocking** acceptance failure, so the decision set as recorded can produce a build that its own
acceptance gate rejects, using content its own ceiling permits.

Nothing currently states whether segments are individually interactive. That is the gap.

Cheapest resolution, and probably the intended design: declare that bar segments are **not**
individual tap targets — all required decisions occur through discrete controls, choice lists, or
numeric entry, with the bar as a display surface. This also sits comfortably with DECISION-013.
Alternatives: narrow the supported viewport floor; invoke the WCAG 2.5.8 "essential" exception
explicitly in rubric criterion 3; or scale the LCD ceiling by viewport. The owner accepted visual
cramping at high LCD on narrow screens, which is a *discrimination* tradeoff — it was not a ruling
about touch targets, and should not be read as one.

### R3 — The product's primary learner may not meet the first slice's own prerequisites

DECISION-016 names the primary learner as one who "holds persistent misconceptions (such as adding
numerators and denominators across)." The episode definition's stated prerequisites include simple
equivalence, like-denominator addition, and *the idea of a common unit*. A learner who adds
denominators across plausibly lacks that last one.

Roadmap §16's "has encountered, or can demonstrate readiness for" keeps this from being a formal
contradiction, but the practical gap is real: DECISION-016's own remedy — backward routing to
prerequisite episodes — is `D-09`, deferred past Phase 2. In Phase 2 a repair learner who stalls on
equivalence has nowhere to go.

Disposition needed: the implementation packet should state plainly that Phase 2 serves the *ready
subset* of the primary learner, and that repair entry and backward routing are Phase 3+. Without
that sentence the first slice will be judged against a learner it was not built for — including by
the owner, at the acceptance gate.

### R6 — Beat-gated mounting accumulates, and clutter is a blocking criterion

DECISION-014 item 2 keeps "completed prior beats mounted as inspectable context." Across encounter
→ notice → decide → transform → operate → resolve, the scene grows monotonically. DECISION-021
criterion 1 blocks acceptance on anything that "clutters the scene or competes with the fraction
bar and current question," and founding §32 asks what can be removed from the learner's immediate
visual field.

On a 360px viewport at the resolve beat, five completed beats plus two bars plus symbolic notation
is a plausible clutter failure — again against a binary blocking criterion.

Disposition needed: a rule for what a completed beat *collapses to*. Inspectable does not have to
mean full-size and fully expanded; a completed beat could reduce to a compact line that remains
reachable. Whatever the answer, it belongs in the renderer packet's requirements rather than being
discovered at the acceptance gate.

### R1 — DECISION-007's CM-01 text is superseded but still reads as authoritative

DECISION-007 item 4 describes CM-01 as a single-tap yes/no ("Is the shaded amount still the same?").
DECISION-012 replaced that with a matching task carrying plausible distractors, for good reason: a
yes/no whose answer is invariably "yes" is undisqualifiable and therefore useless to a register
that exists only to disqualify.

The log is append-only, so DECISION-007 correctly remains unedited, and the prototype-variable
register reflects DECISION-012. But an implementer reading the bundle in DECISION-007 alone will
build the yes/no. The implementation packet must cite DECISION-012 alongside DECISION-007 wherever
the bundle is referenced.

### R4 — "Adopts WCAG 2.2 AA" is a target, and must not become an unevidenced claim

`D-22` deliberately avoided an unverified conformance claim. DECISION-010 says the project "adopts
WCAG 2.2 AA as its accessibility standard" and DECISION-021 calls it a "formal compliance standard."
As a design target this is correct and useful. As a public statement it would be a conformance
claim, which DECISION-005's rule ("claims name their evidence tier") and
`05-quality-and-validation.md` §44 (nothing is "Accessibility validated" until the floor is met with
mechanized *and* human review recorded) both constrain.

No defect today — but the implementation packet and any public copy should say *built against*
WCAG 2.2 AA, not *conforms to*, until evidence exists.

### R5 — The transfer strike is half-applied in the register

Carried forward from the Batch D review, unresolved. `prototype-variable-register.md` annotates the
outcome-measure bullets as struck (lines 102, 169, 240, 316) but leaves transfer live in the
falsification observations and discriminating experiments (lines 119, 153–154, 186, 188, 259,
299–301, 332, 334). The criteria that would disqualify a rival still rest on a measure the register
declares unmeasurable — and disqualification is the register's only remaining function under
DECISION-005.

Mechanical cleanup; assign it to the first packet in the wave.

## Disposition summary

| Finding | Needs | When |
| --- | --- | --- |
| R2 | Owner ruling: are bar segments tap targets? | Before the renderer packet is drafted |
| R3 | One paragraph in the implementation packet scoping Phase 2 to the ready subset | At packet drafting |
| R6 | A collapse rule for completed beats | Before the renderer packet is drafted |
| R1 | Cite DECISION-012 wherever DECISION-007's bundle is referenced | At packet drafting |
| R4 | "Built against," never "conforms to," until evidenced | At packet drafting and in public copy |
| R5 | Sweep the register's falsification rows and experiment cells | First packet of the wave |
