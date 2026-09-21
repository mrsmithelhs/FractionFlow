# Plan 09 — Repair 04 Review

- **Date:** 2026-09-20
- **Reviewed:** `fb0c633`, `3885667`, and `repair-04-report.md`
- **Decision:** **Ungated items accepted.** Item 0b's stop-and-report is correct and accepted as a
  `plan-10` referral. Items 0 and 2 proposals are **approved with conditions**.

## The ungated work is right, and it is the largest learner-facing improvement in the packet

Verified by driving the running app, not from the report. Every one of these rendered **"Not quite."**
before this repair:

| learner error | now rendered |
|---|---|
| says "same size" when units differ | "Look at the parts: one bar has 3 equal parts and one has 4 equal parts." |
| submits `2` for `2/3` → twelfths | "Multiply the top and bottom by the same number." |
| submits `7` for `2/3` → twelfths | "Count the shaded parts in the new bar and try again." |
| submits `10` for `8/12 + 3/12` | "The denominator stays the same. Add only the top numbers." |

Both paths. The linear path now mounts `active-beat-section` before
`completed-beats-section`, confirmed live, so the access-parity regression Repair 02 introduced is
closed.

`tests/render-recovery.test.js` is a real guard: table-driven over every produced kind, run against
both paths, asserting the specific authored string **and** `not` the generic fallback. The invalid
denominator names the number, with `18` asserted present and `'This number'` asserted absent.

230 tests, build, and lint pass independently; tree clean.

**The reported geometry now matches mine to the pixel** — 605 / 717 / 746 for the three treatments,
and the reflect-beat third choice at 758px reported as past the fold at both reference heights. Last
round these figures were 72px optimistic. Noted, because it is the correction I asked for and it was
made without argument.

## Finding 1 — the new `incorrect-notice` branch is inverted on its true side

`beat-container.js:224` and `linear-path.js:239` now branch on `classification.expectedMatches`.
That field is `instance.classification.denominator.relationship === 'same'` — it describes the
**mathematics**, not the learner's answer. So `expectedMatches === true` means the denominators
*do* match, the learner wrongly said "different sizes," and the code renders:

> "The parts are different sizes. We need a common unit."

That endorses the learner's error and sends them to find a common denominator they do not need.

Two mitigations and one real problem. It is unreachable in Phase 2 — only the relatively-prime
fixture ships, so `expectedMatches` is always `false` — and the false side, which is what runs today,
is correct and was verified above. But `tests/render-recovery.test.js:171` only exercises
`expectedMatches: false`, so the branch is untested, and **there is no correct string for the true
case**: `feedbackDiff` and `feedbackSame` both describe unlike denominators. The branch needs copy
that does not exist.

**Not a blocker for this packet.** Record it, and either author the missing string or collapse the
branch back to the one reachable case with a comment saying why.

## Finding 2 — the guard's list of kinds is a third copy

The suite enumerates the seven kinds by restating them. It protects against producer/consumer drift
and can itself drift: a new kind added to `classification.js` will not fail anything. The repair note
allowed a restatement if derivation was impractical, but asked that the report say so; it does not.

**Suggested follow-on, one test:** assert that every `kind` the classifier can emit appears in the
guard's table. Cheap, and it closes the loop the guard was built for.

## Item 0 proposal — approved with one condition

The design is sound: authored `premise-checks.js` keyed on fixture and denominator, classification in
`handleReflect` against an authored `expectedResponse`, both bars mounted at the reflect beat so the
question has referents, and framing copy — "Check this renaming:" — so a deliberately wrong `7/12`
does not read as a bug. No new beat, and the replay envelope records the premise case id. All four
things the repair asked for.

**Condition: the premise case must not always be false.** Every authored case in the proposal has
`isEquivalent: false` and `expectedResponse: 'no'`. A learner who meets only false premises learns to
answer "no" without looking — the same acknowledgement failure DECISION-026 exists to prevent, merely
inverted. The decision's wording is that connection-making checks *include* cases where the
reassuring answer is wrong, not that all of them are. Author both, and make which one the learner
meets a property of the route or case id rather than a constant. `premiseExpectedYes` already exists
for the true case and would otherwise stay dead.

## Item 0b — stop condition correctly triggered

Preserving segment identity across a denominator change means replacing `replaceChildren()` with
keyed reconciliation and a two-phase animation lifecycle in a renderer four packets depend on. That
is `plan-10`, and reporting it was the right call rather than attempting it here.

**On the offered smaller alternative** — a `@keyframes subdivideSweep` highlight over freshly built
segments: decline it for now. It would make "Smooth change" *look* answered without the bars actually
changing smoothly, which is a third way of making a label look true. If the animation is deferred,
the honest interim is to fix the **label**, not to decorate. That is an owner call.

**The scoping fix is separable and should not wait for `plan-10`.** Choreographing the operand whose
change just became established — including the right operand at `operate` — is independent of how the
subdivision animates, and it is the half of the defect that is mine. It can land in a repair.

## Item 2 proposal — approved with one condition

Deriving a simplified result upstream via `simplifyFraction` and presenting it as a notice is the
right shape, and "notice, not choice" is the correct call for a packet whose learning target is
unlike-denominator addition.

**Condition: do not change what the learner is recorded as answering.** The proposal has the button
dispatch `submit-resolution` with `proposed: pref`, so a learner who worked in twenty-fourths and
reached `22/24` would have `11/12` recorded as their resolution. State plainly what is submitted and
what provenance shows; if the learner produced `22/24`, that is what the record should say, with the
simplification noted alongside. Also confirm that redefining `preferredFinalForm` does not change its
meaning at the reflect beat, where `resolution.proposed` is non-null.

## Advisor posture

Branch C again, fail-closed, correctly reasoned. Fourth consecutive packet without an advisor, and the
verification burden continues to sit on this gate.
