# Plan 10 — Dossier Review

- **Date:** 2026-09-21
- **Reviewed:** `b1f63f7`, `36da082` — `docs/development/phase-3-generalization-design/`
- **Decision:** **Accepted, with one correction required before owner disposition.** The assessment is
  the best-evidenced document this project has produced. The OQ-20 recommendation is sound; the
  arithmetic supporting it is not.

## What the dossier establishes

**The headline is the finding:** demonstrated reach across **exactly one** problem family, out of
fourteen §27 and §28 targets.

| classification | §27 | §28 | total |
|---|:-:|:-:|:-:|
| demonstrated reuse | 1 | 0 | **1** |
| plausible reuse | 2 | 2 | 4 |
| needs a new beat | 2 | 4 | 6 |
| needs a representation the bar cannot give | 3 | 0 | 3 |

That is a sobering answer to §26's question and it is almost certainly the right one. The grammar was
built for relatively-prime addition with both operands renamed, and the dossier says so without
softening it.

**The refusal witnesses are real.** I verified one independently rather than accepting the transcript:
`src/render/fraction-bar.js:90` throws `TypeError: fraction bar form is outside the supported bar
range` on `numerator > denominator`, exactly as reported.

**The best artifact in the dossier is the silent-corruption demonstration** for Family 7. If the guard
were removed, `createTrackAndReadout({ numerator: 10, denominator: 8 })` builds eight segments, shades
all eight, and prints `10 / 8` beside a bar that is byte-identical to `8/8`. *"The renderer lies to the
learner, collapsing an improper fraction greater than one into a single full unit."* That sentence is
why OQ-20 is a representation question and not a CSS fix, and no amount of prose would have made the
case as well as the captured behavior does.

**§5's honesty statement is the requirement honored, not performed:** on how a bar should represent
subtraction — *"We cannot know which representation is pedagogically effective for children without
building and observing prototypes of both. Asserting that one is superior in specification prose is
guesswork."* That is the correct answer and the dossier resists giving a confident one.

**Requirement 2 met.** Three candidates for crossing one whole, each with what it preserves and costs,
a stated recommendation (discrete multi-whole stack), and an argument that it accommodates Phase 5
mixed numbers without forcing them into Phase 3 — the same renderer, a different readout mode.

**Requirement 4 met.** Every carried Phase 2 debt is mapped to its owning packet with the interface
named, including which are prerequisites and which are orthogonal.

**Mixed numbers:** recommends against admitting them to Phase 3 as an operational or input type,
keeping §§38–44 and the §91 checkpoint intact while letting the resolve beat state calmly that
`10/8 is 1 whole and 2/8`. That is the right shape — it serves the owner's "adding with a sum above
one" practice type without importing a phase.

## The correction — the 360px budget is a sketch, not a measurement

`crossing-one-whole.md` §4 gives a spatial budget for the `operate` beat at 360×640:

```
TOTAL CONSUMED HEIGHT:                    320px
REMAINING VIEWPORT MARGIN (to 640px fold): 320px
```

Measured against the deployed application at 360×640, at that same beat:

```
Submit button bottom:   541px
clearance to 640 fold:   99px
one bar height:          47px   (the budget assumes 40px)
page scroll height:     905px
```

The budget is a sum of the components the new design adds. It omits the chrome the beat already
carries — the milestone lines, the "Show previous steps" disclosure, the help and replay footer, the
app footer — which is 220px of the discrepancy.

**The recommendation survives.** Adding a second whole bar at the measured 47px plus an 8px gap puts
Submit's bottom near 596px, still inside the 640px fold. But the margin is roughly **44px, not 320px**,
and that changes the standing of §4's mitigation: collapsing the addend bars into the completed-steps
summary at `operate` is **load-bearing**, not a tidy extra. Without it the beat is tight; with it there
is real room.

Required before owner disposition:

1. Re-derive the budget from a **measurement of the running application** at the beat, plus the delta
   the design adds — not from a component sum.
2. State the mitigation as required rather than optional, and measure the beat with it applied.
3. Use the project's established reference viewports, **360×740 and 360×752**. `plan-09` measured
   against those throughout, and 640 is a fourth number with no stated reason.

This is a page of work, not a repair.

## Two smaller notes, neither blocking

- **`sequencing-proposal.md` puts `plan-13` in the precursor layer.** `plan-13` is worth doing and is
  owner-accepted as the weak §25 criterion, but nothing in Phase 3 is blocked on it — the dossier's own
  debt table calls the support ladder a prerequisite only "for lower support." Sequence it for its own
  reasons, not as a Phase 3 gate.
- **Family 1's remedy — a data-driven beat schedule keyed on `renamingCount`** — is the most
  consequential architectural proposal in the dossier, and it is stated in one line inside a family
  row. It deserves to be a named design question in its own right when Phase 3 packets are drafted:
  a fixed seven-beat arc becoming a computed schedule touches every beat-gated mount and every
  scaffold-leakage invariant.

## Advisor

Branch C, fail-closed, on the ground that the thread matches no provider in
`advisor-capable-providers.json`. Correct procedure, and proportionate for a docs-only packet.

## Standing

The dossier is accepted subject to the §4 budget correction. The recommendation, the classifications,
and the reach limits stand as written and need no rework. When the corrected budget lands, this goes to
the owner for disposition of the OQ-20 recommendation and the mixed-number position, which are the two
decisions the dossier exists to inform.
