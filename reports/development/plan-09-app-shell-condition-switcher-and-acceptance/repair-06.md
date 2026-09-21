# Plan 09 — Repair 06

- **Date:** 2026-09-20
- **Raised by:** owner decision on the replay button's promise; the standing `decide`-confirmation
  question; two observations from the Repair 05 review
- **Status:** drafted. Work from the accepted Repair 05 (`f25bdd1`) or later.
- **Gate:** mechanism confirmation for Item 1 only. Item 2 is pending an owner confirmation noted
  below. Items 3–4 need no gate.

Intended as the last repair before the owner gate.

## Item 1 — Make replay real (mechanism gate)

Today "Replay the last change" appends to `replayHistory` and `supportHistory`, prints one sentence,
and changes nothing visible. Its only state effect feeds `evidenceCategory`'s `independent-transfer`
branch, which also requires `support.label === 'independent'` — never true, since support is pinned at
`high support`. So the button has no effect anywhere.

**It is specified, so removing it is not free.** `02-interaction-grammar.md` §38, "Replay Should Be
Available for Important Transformations," names *equivalent-fraction subdivision* as its first
candidate — exactly this episode — and requires replay to be "secondary and unobtrusive," which the
footer placement already satisfies.

**The architectural objection does not apply.** Replay does not need `replayHistory`, which
`SCENE_HISTORY_KEYS` rightly forbids in the scene. It needs to re-present `transition.pre` and
`transition.post`, which the scene already projects and which Repair 03 and Repair 05 taught both
renderers to consume.

Required behavior:

- "Replay the last change" re-presents the most recently established transition using the **active
  condition's treatment**, so the same control means the same thing under every condition.
- Under **New parts only**, this is the only way a learner sees the before state at all, which is what
  makes the control earn its place rather than duplicate what is already shown.
- The episode's mathematical and instructional state is unchanged by a replay. It is a re-display, not
  a re-run.

Required in the proposal:

- Where the replay flag lives. It is presentation state, not instructional state, and it must not
  become history in the scene. Say whether it belongs in the app shell, in `scene.presentation`, or
  elsewhere, and why.
- When it clears, and what a learner sees if they replay at a beat with no established transition.
  `strings.app.noReplayYet` exists for that case and is currently reachable only as an error.
- Reduced-motion behavior.
- The 360px cost at every beat where a replay can be triggered, measured under all three conditions
  against a stated viewport height. A replay that pushes the active control below the fold is worse
  than no replay.
- Whether `replayHistory` should keep recording. It is the right provenance whether or not the visual
  works; say so explicitly rather than leaving it ambiguous.

**Stop and report** if this needs a new beat, or if it cannot be done without putting history into the
scene.

## Item 2 — Confirm a correct denominator choice (pending owner confirmation)

**This item is not authorized yet.** The orchestrator recommended it and the owner has not confirmed.
Do not implement it until the handoff says so explicitly.

A correct denominator choice currently advances in silence. The learner does get a ✓ milestone reading
"Common denominator: 12", so this is not nothing — but `strings.decide.validLeast` and `validNonLeast`
are authored, unreachable, and carry mathematical information the milestone does not: that 12 is the
*smallest* common denominator.

The recommended shape is to **parameterize the existing milestone line rather than add an element**:

> Common denominator: 12 — the smallest one.
> Common denominator: 24 — both fractions can use it.

Why this shape: zero new vertical space at the beat with the tightest budget, no new element, no new
beat, and it respects DECISION-021 criterion 1. It names the LCD concept exactly when the learner
earned it, and it does not scold the non-least route.

The plumbing exists. `src/math/validation.js:80` already computes
`classification: 'valid-least' | 'valid-non-least'`, and the interaction layer captures it as
`mathClassification`. `commonUnitMeaning` (`scene.js:514`) simply does not project it. Add the field
upstream; the renderer selects a string and computes nothing.

`validLeast` and `validNonLeast` get rewritten to fit the milestone slot rather than deleted.

## Item 3 — Record the deferred like-denominator string

Repair 05 collapsed the `incorrect-notice` branch and named the gap in a code comment: there is no
authored string for a learner who wrongly answers "different" on a like-denominator problem. That is
the right call, and a code comment is the wrong place for it to live — nothing in the docs records
that Phase 3 owes it.

**Repair:** add it to `docs/open-questions.md` under deferred opportunities, or to the packet report,
naming what is missing and which classifier state reaches it. One paragraph. No code change.

## Item 4 — Close the last step of the recovery-guard loop

`CLASSIFICATION_RECOVERY_KINDS` is exported and the guard derives from it, so guard and list cannot
drift. The list itself is still hand-maintained, so a kind introduced inside a classifier function and
not added to the list still escapes both.

**Repair:** have the classifiers take their `kind` values from the list — a frozen map or named
constants — so that adding a kind without listing it is impossible rather than merely tested for. If
that is more invasive than it sounds, report why and leave the guard as it is; this is a small
hardening, not a defect.

## Acceptance checks

- [ ] Mechanism proposal for Item 1 reported and approved before implementation.
- [ ] "Replay the last change" visibly re-presents the last established transition under all three
      conditions, demonstrated by captured output before and after a replay.
- [ ] Replay changes no mathematical or instructional state.
- [ ] No replay history enters the scene.
- [ ] 360px measured under all three conditions at every beat where replay can be triggered, reported
      against a stated viewport height.
- [ ] Item 2 implemented **only if** the handoff authorizes it; if authorized, the milestone line
      names least versus non-least, the renderer computes nothing, and `validLeast` / `validNonLeast`
      are reachable.
- [ ] The deferred like-denominator string is recorded in a durable document, not only in a comment.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] No deploy, no push, no public-URL claim.

## Not in scope

- **Animated subdivision** (`plan-10`). Bundle 1 stays "New parts only" until it exists.
- **The support ladder**, **OQ-19** (entry page), **OQ-20** (crossing one whole).
- **Requirement 3.** The deployed public exercise, the §25 acceptance evidence packet, and the
  DECISION-021 rubric against rendered screens are owner-gated and follow this repair.
