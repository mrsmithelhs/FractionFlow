# Disposition — Codex Review of Plans 10–13

- **Date:** 2026-09-21
- **Reviewed:** `reports/orchestration/plans-10-13-codex-review.md`
- **Disposition:** **Accepted almost entirely.** Five of five findings adopted; one recommendation
  adopted in a different form; one self-assessment of mine reversed.
- **Changes:** `plan-14` created; `plan-10`, `plan-11`, `plan-12`, `plan-13` amended at `b3ec8ad`.

The review was right about the thing that mattered most, and right in a way I would not have reached
on my own: the four packets had learned the *vocabulary* of the Phase 2 failure without acquiring a
mechanism that could catch it.

## 1 — Reachability language was report instruction, not a gate. **Accepted.**

The finding: "reachable," "state the sequence," and "captured output" can all be satisfied by prose,
a manually injected state, or a component screenshot — which is exactly how the four unreachable
mechanisms passed in the first place.

This is correct and it is the central defect. I wrote requirements that described the failure rather
than requirements that would trip over it.

**Action:** `plan-14 — Reachable Behavior Contract and Browser Route Matrix`, built to the review's
schema: registered configuration, permitted starting surface, concrete action sequence, expected
observable output, **negative control**, browser witness, named viewport and motion mode. Two
enforcement rules the review named and I had not:

- a registered configuration with **no route row is a failure**, not an omission;
- a row whose output is **identical to its negative control** is a failure.

The first would have caught the support ladder; the second would have caught the byte-identical
conditions on day one. `plan-11`, `plan-12`, and `plan-13` now depend on it.

The review also asked for the harness to be proven rather than trusted. `plan-14` cannot be accepted
until it catches a **deliberately seeded unreachable-behavior defect** and a **deliberately seeded
identical-output defect**, with both failures captured verbatim and both seeds reverted.

## 2 — Dependency graph. **Two of three accepted; one confirmed as drafted.**

**`plan-11` stays independent of `plan-10`** — the review agreed with the original graph and I keep
it. Its counter-argument was better than its concession, though: a stable-identity subdivision path is
foundational renderer work that could quietly become settled grammar. Adopted as a **mechanism
confirmation gate** plus explicit authority language scoping the animation to the existing
unlike-denominator conversion: *"a prototype arm made testable, not a visual grammar for families that
do not yet exist."*

**`plan-12` stays independent of `plan-10`, and gains a gate.** The review caught a real
self-contradiction: the packet said "resolve OQ-19" and "no new decisions" in the same document, while
OQ-19 explicitly needs *"a decision on whether an entry page ships at all, what it holds beyond the
name, whether it gates the episode or is merely passed through, and how a learner returns to it,"*
plus whether the gear belongs there. I had answered all five by fiat while instructing the implementer
not to decide anything. That is incoherent and it is the kind of incoherence an implementer resolves
by guessing.

`plan-12` now opens with **Requirement 0 — the OQ-19 mechanism proposal**, listing those five
questions verbatim as owner decisions, plus a **focus contract** the review correctly noted was
missing. Everything after it is conditional on approval.

**`plan-13` no longer depends on `plan-10`. Reversed.** My reasoning was that the reach assessment
should shape the support writer's interface so it is not built for one episode. The review's answer is
better: `plan-13`'s scope is two reachable levels *in the existing slice*, a docs-only dossier cannot
make a support setting reachable, and holding the first genuine repair of the owner-accepted weak
criterion behind a broad assessment is *"using architecture speculation to postpone behavior."* That
is a fair description of what I drafted. `plan-10` is now an input to generalizing the support model,
not a gate on proving the ladder has a writer.

## 3 — The DECISION-019 conflict. **Accepted. This is the best catch in the review.**

`plan-13` needed a reviewer-reachable support selector and I wrote that it should be *"consistent with
the reviewer-only switcher's existing boundary."* The review's verdict — *"that is not an
implementation contract; it is the unresolved design problem"* — is exactly right, and I checked it
against the sources rather than taking it on faith:

- **DECISION-019** confines the gear menu to *"one purpose in Phase 2"*: switching among the
  registered design conditions the prototype-variable register enumerates.
- **The register contains four axes** — D-01 display, D-02 choreography, D-05 prompt cadence, CM-01
  connection-making form. **Support level is not among them.**

So there is no authorized surface. An implementer facing that gap would have added support to the gear
menu, or accepted a constructor argument — reproducing the precise failure the packet exists to
repair. `plan-13` is now **blocked on an owner decision** stated in its gate, with the three
unacceptable resolutions named explicitly.

## 4 — Is `plan-10` displacement activity? **Accepted in part; gate narrowed.**

The review's judgement — not displacement in itself, but displacement if treated as the only next move
or as a blanket prohibition — is right, and my gate was written too broadly. It said no Phase 3
implementation packet could be *drafted* until the dossier was accepted.

Narrowed to: no Phase 3 **problem-family** implementation packet may be **assigned**, and the gate
explicitly does not block `plan-11`, `plan-12`, `plan-13`, or `plan-14`.

`plan-10` also gained the review's distinction between **demonstrated reuse** (an executable current
path, in `plan-14`'s row shape) and **plausible reuse** (symbols exist), plus a required **refusal
witness** — the actual captured failure — for every "needs a representation the bar cannot give" row.
A dossier can repeat the Phase 2 failure in prose as easily as code can repeat it in a registry.

On the review's learner-evidence recommendation: a small owner-run exercise is already drafted at
`reports/orchestration/student-feedback-questions.md`. It is high school students rather than the 8–11
target range, so it cannot close the `n = 0 children` gap — but DECISION-016 names the repair learner
as the product's primary audience, and that is who these students resemble. Nonblocking, as the review
asks.

## 5 — "The rate did finally decline." **Withdrawn.**

I wrote that in `repair-06-review.md`, reviewing Items 2–4. The very next artifact — Repair 06 Item 1 —
described the reflect card as showing `1/4 = 3/12` while its own pasted capture read `3/12 = 3/12`. I
flagged that one round later, so the claim did not survive contact; but the review's diagnosis is
sharper than my retraction was.

Its formulation: **the failure mode did not decline, it changed shape** — from broad structural
overclaim to *post-repair verification overclaim*. That describes the record better than "declining"
did. Repair 06's report claimed four things that were false and one of them was printed inside its own
evidence; Repair 07 then claimed a focus restoration that landed on `BODY`; the same Condition B was
claimed and unmet twice.

I accept the proposed retirement condition in full, and it is a good one because it is falsifiable:
**the caution stands until several independently reviewed user-facing packets run against a common
route matrix, and the matrix itself catches a deliberately seeded unreachable or identical-output
defect.** `plan-14`'s acceptance criteria are written to produce exactly that evidence.

## Where I differ

**One, on packaging.** The review offered its missing packet either as a packet or as *"a binding gate
amendment shared by Plans 11–13."* I took the packet. A contract without a harness is more words, and
more words is the failure mode under discussion.

**Two, on numbering.** The review proposed `Plan 10A`. Packet ids in this repository are creation
order, not execution order — `plan-04` was a design packet sitting between implementation packets — and
the dependency graph is what the tooling actually enforces. So it is `plan-14`, and it runs first.
Execution order is now:

```
plan-14  route contract         (no dependencies beyond plan-09)
plan-10  Phase 3 dossier        (independent; can run in parallel)
plan-11  motion                 (needs plan-14)
plan-12  entry page             (needs plan-14 + an owner OQ-19 decision at its gate)
plan-13  scaffold fading        (needs plan-14, plan-12, and an owner decision before it starts)
```

**Three, a caveat I would add to the review's own standard.** A green route matrix is not a claim that
the project is free of unreachable mechanisms — it covers *declared* behaviors, and the declaration is
the fallible part. `plan-14`'s authority boundaries say so in those terms, because the next version of
this failure is a behavior nobody thought to declare.

## Two decisions now owed by the owner

1. **OQ-19 — the entry page.** Five questions, at `plan-12`'s Requirement 0. The implementer proposes;
   the owner decides. `plan-12` cannot start without it.
2. **The reviewer support-selection surface.** DECISION-019 does not authorize one and support level is
   not a register axis. This needs a new decision-log entry, and `plan-13` is blocked until it exists.
   If the answer is the entry page, `plan-13` waits on `plan-12`; if it is something else, the
   dependency changes.
