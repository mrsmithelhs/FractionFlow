# Plan 09 — Repair 03 Mechanism Review

- **Packet:** `plan-09` — App Shell, Condition Switcher, and Phase 2 Acceptance
- **Date:** 2026-09-20
- **Reviewing:** the implementer's Repair 03 mechanism proposal (Items 1 and 2), plus the ungated
  execution plan for Items 3–6
- **Decision:** **Item 1 approved with four conditions. Item 2 returned — the recommendation rests on
  a claim the decision log contradicts.** Items 3–6 approved with two notes.

## Item 1 — approved, with conditions

The architecture is right and reaches the correct answer for the right reason. `scene.presentation`
gains a `choreography` directive derived upstream from the active condition; renderers read
`scene.presentation.*` and never `condition.*`; the three treatments consume `transition.pre` and
`transition.post`, the `plan-06` contract that has never had a reader. The scope claim — no new beats,
no new instructional state, no new content — holds for the design as described.

Four conditions attach.

### Condition A — the layout target must hold under all three treatments

This is the largest risk in the proposal and it is not addressed. Juxtaposed and sequential both
**double the number of rendered bars**, and Repairs 01 and 02 exist precisely because vertical space
at 360px was the binding constraint. Two extra bar boxes at roughly 47px each, plus gaps, is a
conservative 110px.

Measured under the current build at 360×740, at the reflect beat, the three matching choices end at
555 / 655 / 755 — two of three already clear the fold. Adding 110px puts all three below it.

So: the Repair 02 acceptance target — first bar within roughly the top 15%, current question above
the fold at 360px — **must be met under every registered condition, not only under `in-place`.**
Report the measurement per condition. If a treatment cannot meet it, report that rather than shipping
it; a condition that only works on a wide screen is a finding, not a failure.

### Condition B — scope the doubled bars to the beat where the transition is the concern

`transitionMeaning` returns a non-null transition whenever `established.lastConversion` exists, which
persists through `operate`, `resolve`, and `reflect`. Rendered naively, juxtaposed and sequential
would keep showing before-and-after bars for the rest of the episode — consuming the reclaimed space
permanently and, worse, showing a "before" state that is no longer the learner's current concern.

Decide and state when the treatment applies. The narrow reading — the transition is displayed while
the transition is the current task, and the scene returns to current forms afterwards — is the one to
beat. Whatever you choose, say it explicitly in the report.

### Condition C — new learner-facing copy goes in `strings.js`, at the right reading level

The proposal writes treatment copy as inline template literals: `Before: {pre.numerator}/...`,
`Step 1: Start with ...`, `→ Subdivide into {post.denominator} parts →`,
`Step 2: Equivalent form ...`.

Two problems. DECISION-017 and DECISION-023 put **all** learner-facing copy in `src/render/strings.js`
with no inline literals in render components. And "Equivalent form" is specification register, not
grade 2–3 (DECISION-004); the strings catalog's own working rules allow `equivalent` only where it is
introduced with meaning. "Before" / "After" and "Step 1" / "Step 2" are fine. Parameterize
everything; hardcode no instance value.

### Condition D — bundles 2 and 3 must be distinguishable from each other

As described, both juxtaposed and sequential render a pre state and a post state; sequential adds
labels and a connector. That risks three conditions of which two look nearly alike, which fails the
purpose — the owner needs three **describably distinct** treatments in a browser.

Either make sequential genuinely staged — one step visible at a time, learner-advanced, endpoints
inspectable per DECISION-014 — or justify in the proposal why a labelled static progression reads as
meaningfully different from a side-by-side comparison. Do not ship two treatments the owner cannot
tell apart.

### One accepted change, with a constraint

Moving the premise-check detection out of `condition.connectionMaking` and into task meaning is the
right direction and consistent with the Separation Rule. But **do not sniff `promptId` substrings.**
The existing `promptId?.includes('premise')` fallback is fragile and should go, not spread. Add an
explicit field to `taskMeaning` (`scene.js:479`) — for example `connectionForm: 'matching' | 'premise'`
— set by the instructional layer. A renderer branching on an explicit enum is fine; a renderer doing
string archaeology on an identifier is not.

## Item 2 — returned for owner decision

The recommendation is for Option B, and the table's first stated reason is that Option A **"violates
DECISION-019."** It does not. DECISION-019's own text reads:

> the entry-page gear icon and its menu exist for one purpose in Phase 2: switching among the
> registered upstream design conditions that Plan 04's prototype-variable register enumerates
> (**D-01** display, **D-02** choreography, **D-05** prompt cadence, **CM-01** connection-making form)

`CM-01` is named as one of the four axes the menu exists to switch. Consequence 2 goes further,
giving the example label "Visual change: Smooth / Side-by-side / Step-by-step" and saying that the
codes "`D-01`, `CM-01`" are kept in internal data attributes — it anticipates a `CM-01` option in the
menu.

So Option A is not a violation of DECISION-019. It is the thing DECISION-019 authorizes.

**I made the same error.** My steer toward Option B in `repair-03.md` was based on the menu's heading
string, "Choose a display style," rather than on the decision that defines the menu. The heading is a
one-line fix in `strings.js`; the architecture was never display-only. The correction is mine before
it is the implementer's.

### The substantive objection to Option B, which the proposal does not raise

Under Option B the connection-making form becomes a function of the learner's denominator choice.
That creates a **provenance defect**: `state.activeCondition.connectionMaking` would still read
`CM-01-M` while the learner actually received the premise check, and the replay envelope records the
active condition. The instrument would misreport what happened.

It also confounds the comparison. A reviewer wanting to see premise-versus-matching would be changing
the mathematical route at the same time, and could never see premise paired with a route they chose
for other reasons.

Option B is still available, but only with a binding constraint: **the replay envelope must
truthfully record which connection-making form the learner actually received.** That means either the
route selection updates `activeCondition.connectionMaking`, or the form is recorded as its own field
that the envelope carries. Silence here would be worse than either option.

### Orchestrator recommendation, reversed from `repair-03.md`

**Option A**, plus a one-string relabel of the menu heading from "Choose a display style" to something
that covers both axes. It is what DECISION-019 describes, it keeps `activeCondition` truthful with no
new plumbing, and the objection I raised against it turns out to be an objection to a string.

A third option worth naming for the owner, not for this repair: make the menu two independent axes —
display/choreography × check form — instead of fixed bundles. That removes the arbitrary pairing
Option A creates, but DECISION-007 speaks in bundles and changing that is a decision, not a repair.

**The owner picks. Do not implement Item 2 until they have.**

## Items 3–6 — approved, two notes

- **Item 3.** `[15/24, 16/24, 17/24]` with the correct form at index 1 is fine, and the test must read
  the authored sets rather than restate them.
- **Item 4.** The proposal names `.control-choice-btn` or `.matching-choice-card`. The actual class is
  `.matching-choice-btn` (plus `control-choice-btn`); verify against real rendered output rather than
  from memory. The indistinguishability assertion must compare class lists **and** attribute-name
  sets, and the fail-first demonstration must mutate a real rendered option.
- **Items 5 and 6** are approved as written.

## Advisor posture

Branch C, orchestrator-gate-only, correctly reasoned from the fail-closed rule for a provider not in
`advisor-capable-providers.json`. This is the third Branch C packet and the first from this
provider. The verification burden sits entirely on this gate, which is the reason for the four
conditions above rather than a bare approval.

## Note on claim strength

"100% mathematical parity" and "Verified: across all modules in `src/render/`, no module **will** read
`condition.*`" both state as established what is in fact a design intention — the code has not been
written. The standing caution in the session handoff is about exactly this distance between a claim
and its evidence. Write the proposal's intentions as intentions; save "verified" for the report, after
the measurement.
