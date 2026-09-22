# Roadmap Position — 2026-09-21

- **Asked by the owner:** where are we against the founding roadmap, and have we diverged?
- **Short answer:** on track, at the checkpoint the roadmap put here on purpose. The one real
  divergence is **inside** Phase 2 and the roadmap anticipated it.

## Where we actually are

`docs/founding/06-roadmap.md` §99 gives each phase a question to answer:

| phase | its question | status |
|---|---|---|
| Phase 0 — specification readiness | — | complete (`plan-01`) |
| Phase 1 — mathematical foundation | *Can the mathematical foundation be trusted?* | complete (`plan-02`, `plan-03`) |
| **Phase 2 — the first excellent episode** | *Can one FractionFlow episode fulfill the founding vision?* | **exit gate declared satisfied by the owner, 2026-09-21, at `b418e8a`** |
| Phase 3 — generalize the grammar | *Does the interaction grammar generalize?* | design assessment in flight (`plan-10`) |
| Phases 4–9 | — | not started, correctly |

Nine packets, three phases, no phase skipped and none started early. §89's decision checkpoint — *after
the first vertical slice, before generalization* — is exactly where this project is standing, and
`plan-10` is that checkpoint being answered rather than assumed.

## The divergence, and it is real

**The mathematics ran far ahead of the presentation, and the gap is now the project's defining
feature.**

§13 asked Phase 1 to exercise eight problem families. It does, and more:

```
STRUCTURAL_SELECTOR_IDS  like/nested/shared-factor/relatively-prime × addition and subtraction  (8)
OVERLAY_IDS              reducible-result, crosses-one-whole
src/math/mixed-number.js createMixedNumber, mixedToImproper, improperToMixed, composeMixedNumber,
                         regroupForSubtraction, addMixedNumbers, subtractMixedNumbers
```

§13's closing line permitted this: *"Mixed-number logic may be implemented sufficiently to validate the
mathematical model even if its learner-facing episodes come later."* It was taken up, and then some —
`regroupForSubtraction` is decomposition, which is **Phase 5 §43**.

Meanwhile the learner-facing slice is one episode, one family, proper fractions, sum below one. The
renderer refuses to draw a result crossing one whole (OQ-20) even though `crosses-one-whole` is a
registered content overlay the generator can already produce.

So: **the content layer can generate problems the presentation layer cannot show.** That is not drift
from the roadmap — §14 explicitly wanted Phase 1 to have no need for visual mathematics — but it does
mean the project's constraint has moved. For two phases the question was "is the mathematics right."
From here it is "what can a learner see," and every open question on the board is a presentation
question: OQ-20 the bar crossing one whole, OQ-22 lower-support forms, animated subdivision, the entry
page.

## On the three practice types

The owner is right that the project ought to support them; the roadmap says where each one lives:

| practice type | roadmap home |
|---|---|
| adding with a sum below one | **Phase 2** — built and deployed |
| adding with a sum above one | **Phase 3 §27**, "results crossing one whole" |
| adding/subtracting mixed numbers | **Phase 5 §§38–44**, with its own §91 checkpoint before it starts |

They are development targets, not inventions. The mathematics for all three already exists. What does
not exist is the representation for two of them, and §91 requires a decision checkpoint before
mixed numbers begin — so the entry page should be built to *accept* those practice types, and must not
advertise them before they run.

## Where the roadmap has been followed unusually closely

- **§8, "why not start with every problem type."** Phase 2 stayed one episode through nine packets and
  seven repairs, under real pressure to widen.
- **§23, visually excellent before breadth.** Four packets of the nine went to presentation, accessibility,
  and clutter rather than capability. Repair 01 removed 37% of the 360px viewport. That is the section
  being obeyed at cost.
- **§88, do not prebuild stretch infrastructure.** No accounts, no storage, no analytics, no adaptive
  engine, no service worker. `plan-14` is the nearest thing to infrastructure and it is a verification
  harness for behavior that already ships.
- **§25's own closing line** — *"If the first slice is merely functional, the project should improve it
  before generalizing it."* Seven repairs is what that sentence looks like when it is honored.

## Where we have quietly gone beyond the roadmap, and should say so

1. **A four-level support ladder exists that §22 did not ask for.** §22 wanted "at least an early
   version of scaffold fading" in Phase 2; the full scaffold system is **Phase 6 §§45–48**.
   `src/interaction/support.js` builds six dimensions across four levels — Phase 6 shape, built in
   Phase 2, and written by nothing. `plan-13` gives it a writer; it should not grow further until
   Phase 6.
2. **The design-condition switcher is not in the roadmap at all.** It comes from `plan-04`'s
   prototype-variable register and DECISION-019 — a project invention for comparing display treatments.
   Justified, and worth naming as an addition rather than an instruction being followed.
3. **`plan-14` is not a roadmap phase.** It answers a failure this project actually had. §1 explicitly
   permits this: *"Changing the order of development is expected."*

## What §1 permits and what it forbids

> *"The roadmap should remain subordinate to the founding principles. Changing the order of development
> is expected. Quietly changing the instructional purpose of the project is not."*

Every divergence above is order, scope-depth, or verification. None touches instructional purpose: the
learner still recognizes unlike units, chooses the common denominator, constructs both equivalents, and
combines them, and the system still does not make those decisions for them.

## The honest weak point

§89's checkpoint asks eight questions before generalization. Seven have adult answers. The first —
**"Did learners understand the visual transformation?"** — has none, because **n = 0 children**. §99
says each phase should *reduce uncertainty before increasing scope*, and Phase 2's uncertainty about
comprehension is exactly where it started.

That is not a roadmap divergence; DECISION-020 made child observation non-blocking deliberately. But it
is the thing that most changes what Phase 3 should contain, and it is the cheapest evidence left
unclaimed. The student feedback exercise at `reports/orchestration/student-feedback-questions.md`
reaches an adjacent population, not the target age.

## Summary

Largely on track, and unusually disciplined about the parts of the roadmap that are easy to skip. One
structural imbalance — mathematics well ahead of presentation — which the roadmap licensed and which
now defines what the next phases are for. Two capability additions beyond the current phase (the
support ladder, the condition switcher), both named. And one piece of evidence the roadmap wants and
the project has not got.
