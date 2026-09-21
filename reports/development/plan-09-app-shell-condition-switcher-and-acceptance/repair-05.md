# Plan 09 — Repair 05

- **Date:** 2026-09-20
- **Raised by:** the approved Repair 04 mechanism proposals, plus two findings from the Repair 04
  review
- **Status:** drafted, ready. Work from `3185fbf` or later.
- **Gate:** none. Items 1 and 2 were approved at the Repair 04 gate; implement them to the approved
  designs plus the conditions below. Anything that departs from those designs stops and reports.

This is intended to be the last repair before the packet's owner gate. It closes what can be closed;
what remains after it is `plan-10` work and owner decisions, both named at the end.

## Item 1 — The premise check (approved design, one condition)

Implement the Item 0 proposal from `repair-04-report.md` as written: authored cases in
`src/content/data/premise-checks.js` keyed on fixture and denominator; classification in
`handleReflect` against the authored `expectedResponse`; both bars mounted at the reflect beat so the
question has referents; framing copy so a deliberately wrong renaming does not read as a bug; no new
beat; the premise case id in the replay envelope.

**Condition — the premise must not always be false.** Every case in the proposal has
`isEquivalent: false` and `expectedResponse: 'no'`. A learner who only ever meets false premises
learns to answer "no" without looking, which is the same acknowledgement failure DECISION-026 exists
to prevent, merely inverted. DECISION-026 says connection-making checks *include* cases where the
reassuring answer is wrong — not that all of them are.

- Author at least one true case and one false case.
- Make which one the learner meets a property of the route or the case id, never a constant and never
  random.
- `strings.reflect.premiseExpectedYes` already exists for the true case and is currently dead; it
  should become live.

**Re-register `phase2-bundle-4` only when all of this works**, and delete the pin test in
`tests/app-shell.test.js` that asserts no `CM-01-P` condition is registered. Deleting that test is the
explicit signal the work is done; do not delete it before.

**Evidence required:** a test that fails against current code for each of the four failure modes —
answering the reassuring way on a false case produces recovery rather than completion; answering
correctly completes; the question's referents are mounted; the replay envelope names the case.

## Item 2 — The simplified final form (approved design, one condition)

Implement the Item 2 proposal: derive the simplified result upstream via `simplifyFraction`, project
it, and present it as a notice at the resolve beat. Notice, not choice.

**Condition — do not change what the learner is recorded as answering.** The proposal has the
continue button dispatch `submit-resolution` with `proposed: pref`, so a learner who worked in
twenty-fourths and reached `22/24` would have `11/12` recorded as their resolution. State plainly in
the report what is submitted and what provenance shows. If the learner produced `22/24`, the record
should say `22/24`, with the simplification noted alongside rather than substituted for it.

Also confirm that redefining `preferredFinalForm` does not change its meaning at the **reflect** beat,
where `state.established.resolution` is non-null and the current definition already returns the
learner's own submission.

No renderer computes a simplification.

## Item 3 — Choreography scoping

The separable half of Item 0b. It does not depend on `plan-10`'s animation work.

Repair 03's Condition B — mine — scoped choreography to `beat === 'transform'` with
`transition.changed.includes(side)`. The transition only exists *after* a conversion is established,
so at transform-left every condition renders identically, and the right operand's conversion is never
choreographed at all because `operate` is not a `transform` beat.

**Repair:** scope choreography to the beat at which a change *becomes established*, so the operand
whose conversion just completed shows its treatment — including the right operand at `operate`.

Constraints:

- **Only the most recently converted operand shows doubled bars**, as the proposal already suggests:
  at most three tracks at once. The 360px budget is the reason Repairs 01 and 02 exist.
- Re-measure at 360px under all three conditions at **every** beat where choreography now appears, and
  report against a stated viewport height. Sequential's Submit already sits at 746px at
  transform-right; if the same treatment at `operate` pushes a control below the fold, report it
  rather than shipping it.

## Item 4 — The inverted `incorrect-notice` branch

`beat-container.js:224` and `linear-path.js:239` branch on `classification.expectedMatches`, which
describes the mathematics rather than the learner's answer. When it is `true` — the denominators
genuinely match and the learner wrongly said "different" — the code renders "The parts are different
sizes. We need a common unit.", endorsing the error.

Unreachable in Phase 2, since only the relatively-prime fixture ships, and the reachable false side is
correct. But there is **no correct string for the true case**: both authored notice strings describe
unlike denominators.

**Repair:** either author the missing string for a like-denominator mistake, or collapse the branch to
the single reachable case with a comment naming what is missing and why. Do not leave a branch whose
true side is wrong. If you author the string, extend `tests/render-recovery.test.js` to cover
`expectedMatches: true` — it currently only exercises `false`.

## Item 5 — Close the guard's own drift

`tests/render-recovery.test.js` enumerates the seven recovery kinds by restating them, so a new kind
added to `classification.js` will not fail anything. The guard protects against producer/consumer
drift and can itself drift.

**Repair:** one test asserting that every `kind` the classifier can emit appears in the guard's table.
If that cannot be derived without restating the list a fourth time, say so in the report and explain
what would make it derivable.

## Acceptance checks

- [ ] A learner can reach a premise check whose reassuring answer is **wrong**, and another whose
      reassuring answer is right; both reachable in a browser by a stated sequence.
- [ ] Answering the reassuring way on a false case produces local recovery, not completion, shown by a
      test that fails against current code.
- [ ] Everything the premise question names is on screen when it is asked.
- [ ] `phase2-bundle-4` re-registered and the pin test deleted — or, if the work is incomplete, both
      left as they are.
- [ ] The simplified form appears as a notice at resolve; the learner's recorded resolution is what
      they produced; `preferredFinalForm`'s meaning at reflect is unchanged.
- [ ] Choreography shows the operand whose change just became established, including the right operand;
      at most three tracks at once.
- [ ] 360px re-measured under all three conditions at every beat where choreography appears, reported
      against a stated viewport height.
- [ ] No branch remains whose true side renders a wrong message.
- [ ] Every classifier kind is covered by the guard table, or the gap is explained.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] No deploy, no push, no public-URL claim.

## Not in scope

- **Animated subdivision.** `plan-10`. Preserving segment identity across a denominator change needs
  keyed reconciliation in a renderer four packets depend on. The bundle-1 copy was relabelled to
  "New parts only / The bar shows the new parts right away," which is what it does; restore the
  original wording when the animation exists.
- **The support ladder**, **OQ-19** (entry page), **OQ-20** (crossing one whole), and **replay**, which
  is an owner decision about what the button should promise.
- **Positive confirmation at `decide`.** `validLeast` and `validNonLeast` remain authored and
  unreachable; whether a correct denominator choice should be acknowledged is an owner decision, not
  an implementer one.
- **Requirement 3.** The deployed public exercise and the acceptance evidence packet remain
  owner-gated and follow this repair.
