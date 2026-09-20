# Plan 08 — Mechanism Gate Decision

- **Packet:** `plan-08` — Participation Floor and Access Parity
- **Proposal reviewed:** `reports/development/plan-08-participation-floor-and-access-parity/plan-08-proposal.md` (`2f5f0e3`)
- **Date:** 2026-09-20
- **Decision:** **Approved to proceed, with six conditions.**

## The boundary verdict is accepted, provisionally

The proposal reports that the `plan-07` boundary holds completely and needs no upstream change. That
is accepted as the working assumption, and it is the answer the split was built to obtain honestly.

It remains a claim made before the linear path exists. If implementation contradicts it, say so and
stop — the packet gate names that as legitimate evidence, and reversing this verdict mid-packet is a
better outcome than quietly widening the boundary to preserve it.

## Conditions

### 1 — Use the existing parameterized summary strings; do not author new hardcoded ones

The proposal's collapse-summary examples are *"Units compared: thirds and fourths are different
units,"* *"Common unit chosen: 12ths,"* and *"Renamed: 2/3 into 8/12 and 1/4 into 3/12."*

Every one of those hardcodes the canonical instance. This is the defect repaired three times in
`plan-07` — `validLeast`, `feedbackSame`, the `|| '12'` fallback — and it would be a regression to
reintroduce it in new strings.

`src/render/strings.js:129` already has a `summaryLines` block, fully parameterized: `decideDone(den)`,
`transformDone(side, initial, converted)`, `operateDone(sum)`, `resolveDone(result)`. Use those.
Extend them if the collapse rule needs more, parameterized in the same style.

Also avoid `"12ths"`. The `${den}ths` construction was already removed once in `plan-07` for awkward
screen-reader voicing, and the linear path is precisely where that matters most.

### 2 — The AST purity check has no parser, and needs a different approach

The proposal commits to "robust AST/token purity analysis." The project has exactly two dev
dependencies, `vite` and `vitest`. There is no parser, and a hand-rolled tokenizer is likely to
reproduce the weakness it is meant to fix.

A dev dependency is possible but is its own gate — `plan-02` set the precedent that one narrowly
justified dependency requires explicit approval. Do not add one inside this packet without asking.

**Preferred alternative, which needs no parser and is rename-proof:** prove purity behaviorally by
feeding the renderer a scene whose mathematical fields are *mutually inconsistent* — candidates of
`['7', '9']` for an instance whose real candidates are `['12', '24']`, a common unit that does not
match the operands, an operation result that is arithmetically wrong. A pure renderer displays
exactly what it was handed. A renderer that computes anything will disagree with the scene, and the
assertion fails. Renaming a variable cannot defeat that, and neither can rewriting the arithmetic in
a different form.

If you still want a static check alongside it, fine — but it must not be the primary evidence, and
it must not carry a name broader than what it verifies.

### 3 — The 48px and 85% claims cannot be evidenced here

The proposal states the folded completed section occupies ≤ 48px vertically and leaves ≥ 85% of
screen height for the active content. `tests/fixtures/mock-dom.js` has no layout geometry, so nothing
in this packet's suite can measure either number.

State them as design intent, not verified properties, and say so in the progress report. Real
measurement belongs to `plan-09`, which exercises the slice in a browser at the public URL. Reporting
an unmeasurable number as satisfied is the pattern this project has already been bitten by twice.

### 4 — OQ-04: answer `none` if nothing changes what the learner is asked

The proposal records the adaptation as "transforming horizontal visual bar areas into plain
part-whole descriptions." That is a modality translation, not an adaptation in OQ-04's sense. OQ-04
asks whether an access adaptation may change *what the learner is asked to do* and how that is
recorded so it is not read as weaker performance.

If the linear path asks for the same decisions with the same responsibility — which your own
rationale says it does — then the honest record is **`none`**, with the modality translation noted
separately as not constituting an adaptation. The packet explicitly permits `none`. Record whichever
is true, but do not let a translation occupy the slot reserved for a responsibility change.

### 5 — Say explicitly what happens to the tautological fail-first test

Carried finding 2 from the `plan-07` review concerns `tests/render-purity.test.js:381`, which writes
the defect into a string literal and asserts the literal matches a regex for it. The proposal
promises genuine fail-first for the *new* invariant suite, which is right, but says nothing about
that existing test.

Either make it real — run the actual check against actual prior content, for example
`git show 4f26887:src/render/beat-container.js` — or delete it. A test that cannot fail is worse than
no test, because it reads as proof. State which you did and why.

### 6 — Confirm the linear path renders the check-the-premise form

DECISION-026 requires the connection check to include cases where the expected answer is not the
reassuring one, and `strings.js` carries both the matching form and the `premise*` strings for it.
The proposal's reading-order sketch does not mention the reflect beat's premise form.

Confirm it is rendered in the linear path, and that a learner on that path can identify an incorrect
transformation as readily as a learner on the visual path. This is the decision the owner asked for
personally, and the linear path is where it is easiest to lose.

## What is right and should not be revisited

- The linear path as an access modality over the same validated scene, consuming the frozen result of
  `assertSceneCurrent()` rather than re-projecting — consistent with the `plan-07` architecture.
- Native `<details>` for the older-milestone trail: keyboard-operable, screen-reader reachable, and
  inspectable without being loud. That satisfies DECISION-014 and DECISION-021 criterion 1 together,
  and is appropriately modest per OQ-18.
- Dismounting completed-beat controls on advance, which removes tab-trap clutter and accidental
  re-submission at once.
- "Fails when and only when a leak is present" is exactly the right shape for the invariant suite —
  it tests both directions rather than only the presence of a failure.
- 44×44px controls, above the 24×24px floor, with sizing decoupled from denominator.
- Branch C declaration, consistent with `plan-07` and correctly fail-closed.
