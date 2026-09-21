# Plan 09 — Repair 06 Review

- **Date:** 2026-09-21
- **Reviewed:** `a5e64bb`, `a0dabfc`
- **Decision:** **Items 2–4 accepted. Item 1 proposal approved with four conditions.** The gate was
  honored — no replay implementation code was written.

## Items 2–4 accepted

**Item 2 implements DECISION-028 exactly.** Verified in the browser on both routes and both paths:

| choice | milestone |
|---|---|
| 12 (least) | "Common denominator: 12 — the smallest one." |
| 24 (valid, not least) | "Common denominator: 24 — both fractions can use it." |

The non-least form makes no mention that a smaller denominator exists, which was the part of the
decision most easily got wrong. `mathClassification` is projected upstream in `commonUnitMeaning`
(`scene.js:522`) and `decideDone(den, mathClassification)` selects the string; the renderer computes
nothing. `validLeast` and `validNonLeast` are reachable for the first time.

**Item 3** records the gap as OQ-21 with the reaching classifier state named and a candidate string
sketched. It is now in a durable document rather than a code comment.

**Item 4 closes the loop properly.** `RECOVERY_KINDS` is a frozen map, the classifiers reference its
constants instead of literals, and `CLASSIFICATION_RECOVERY_KINDS` derives from `Object.values()`.
Adding a kind without listing it is now impossible rather than merely tested for — which is what the
repair asked for and more than it would have accepted.

236 tests, build, and lint pass independently; tree clean.

## Item 1 — approved with four conditions

The proposal is the most thorough this packet has received. `isReplaying` as an ephemeral
`scene.presentation` directive is the right allocation and the argument distinguishing it from a
history log is correct. `noReplayYet` becomes intentional guidance rather than an error branch. The
Inspection Mode answer at `reflect` — replacing the question with a comparison card and a "Done
looking" control at 530px, rather than stacking bars above three choices already reaching 758px — is a
genuinely good solve. Layout is measured per beat per condition against stated viewports.

Four conditions.

### Condition A — nothing auto-advances, in any motion mode

§1.3 proposes that under *New parts only*, the track re-presents the before state and "after a
2-second inspection pause ... transitions back to the new parts."

DECISION-021 criterion 4 requires endpoints to remain "inspectable indefinitely **without
auto-advancing**," and `02-interaction-grammar.md` requires transitions to be learner-triggered. A
timed return is exactly what both forbid, and a 2-second window is short for a ten-year-old who is
still working out what changed.

The proposal already offers the right mechanism — a "Show new parts" toggle — and applies it under
reduced motion. **Make it the behavior in every mode.** Replay ends when the learner ends it.

### Condition B — replay must not take focus

§1.3 describes replay as "focuses/pulses the left comparison card." A learner may be mid-entry in the
numerator input when they trigger replay from the footer. Moving focus to a display card would strip
their caret and, for a screen-reader user, interrupt the control they were operating.

Replay re-displays; it does not move focus. The one exception is Inspection Mode at `reflect`, where
the question is genuinely replaced — there focus must move deliberately to the "Done looking" control
and return to the previously focused element on exit, which §1.5 already specifies. Say so for the
non-inspection cases too.

Any pulse must be suppressed under reduced motion, as the proposal states.

### Condition C — `assertSceneCurrent` has to learn the new input

`projectScene` gains `isReplaying`, and `assertSceneCurrent(sceneResult, { state, representationRole,
presentationMode })` re-projects to verify currency. Unless it also receives `isReplaying`, that check
either throws on a legitimate replay scene or silently stops comparing the field. The proposal does
not mention it.

State how the currency contract changes and make sure the existing scene-contract tests still mean
what their names say.

### Condition D — verify Inspection Mode against the leakage invariants

Inspection Mode unmounts the reflection prompt and choices and mounts a comparison card in their
place. DECISION-014's beat-gated mounting and leakage Invariant 6 both bear on that: the choices must
be genuinely unmounted rather than hidden in the DOM, nothing about which choice is correct may
survive the round trip, and the choices must return in their original state and order.

Run the leakage suite against a replaying reflect scene and report it, rather than reasoning that it
is fine.

**Also worth stating in the report:** at `reflect` the replayed conversion is the right operand
(`1/4 = 3/12`) while a premise check is asking about the left (`2/3` versus `7/12`). No leak, but two
different comparisons on one screen is a comprehension risk for the intended reader. Name it for the
owner's rendered-screen review.

## Where the packet stands

After Item 1 lands, the implementer work on `plan-09` is finished. What remains is entirely owner
action and is listed in the packet: authorization for the first deploy of application behavior, the
public-URL exercise, the §25 acceptance evidence packet, the DECISION-021 rubric against rendered
screens, and a dated disposition naming the reviewed artifact, the deployed revision, and the public
URL. Only the owner declares the Phase 2 exit gate satisfied.

Carried forward and not blocking: animated subdivision (`plan-10`), the support ladder, OQ-19,
OQ-20, OQ-21.

## Standing note

Second consecutive repair in which the label-versus-body pattern did not appear. The gate was
honored without prompting, the measurements reproduced, and Item 4 was hardened beyond what was
asked. The rate did finally decline.
