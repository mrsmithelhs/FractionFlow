# Plan 07 — Mechanism Gate Decision

- **Packet:** `plan-07` — Renderer Foundation and Learner-Facing Strings
- **Proposal reviewed:** `reports/development/plan-07-renderer-foundation/plan-07-proposal.md`
- **Date:** 2026-09-19
- **Decision:** **Approved to proceed, with four conditions.** Conditions A and B must be resolved in
  the delivered work; C and D must be resolved in the boundary before renderer code is written.

## The gated question is answered, and answered well

The packet's gate required ratifying or rejecting the renderer-over-same-scene architecture in
writing, and answering whether the accessible linear path inherits the fraction-bar capability
verdict. The proposal ratifies the architecture on a category distinction — representation roles are
mathematical models (bar, number line, symbolic), while the accessible linear path is an access
modality through which the active model is perceived — and answers the capability question **yes**.

I checked the reasoning against the code rather than accepting it:

- `evaluateProposedPathEligibility` (`src/content/eligibility.js:182`) sets `continuation: 'symbolic'`
  whenever a path is `INELIGIBLE`, and `'episode-definition'` otherwise. There is no dead-end refusal.
- `eligibility.symbolic` is unconditionally `ELIGIBLE` (`src/content/eligibility.js:148`), so the
  symbolic continuation can never itself refuse.
- `capabilityFor` (`src/interaction/scene.js:394`) attaches that continuation to the fraction-bar
  refusal as `{ representationRole: 'symbolic', route: 'symbolic-continuation' }`.

So the orchestrator concern that raised this question — that a learner on the linear path would be
denied content by a legibility ceiling that has no force over text — **does not hold**, and the
proposal's reason is better than the concern. An ineligible bar path is an episode-level envelope,
not a per-learner lockout: every learner transitions to symbolic continuation together. Declining to
inherit the verdict would fork the instructional state machine by access mode and would require the
engine to know whether a learner uses assistive technology. That is the correct answer, and the
packet's gate has done its job by forcing it into writing.

## Conditions

### A — `validLeast` hardcodes the canonical instance (must fix)

In the proposed strings table:

```javascript
validLeast: (den) => `12 works! That is the smallest common denominator.`,
```

The function takes `den` and ignores it, hardcoding `12`. That is correct only for `2/3 + 1/4` and
wrong for every other eligible instance. The episode definition requires the design to be reusable
across eligible instances and to "not require one-off application logic," and the canonical example
is explicitly content data rather than an application path.

This is small, but it is the canonical instance leaking into reusable code — the exact failure mode
the dossier warned about — and it appears in the first artifact where it could.

### B — The strings shape does not satisfy DECISION-026 (must fix)

The `reflect` block supports one task form: *"Tap the bar that shows the same amount as X"* with
distractors. That satisfies DECISION-012. It does not satisfy DECISION-026, which requires that the
connection check **also include cases where the expected or habitual answer is not the correct one**,
so that a learner cannot succeed by always selecting the reassuring option.

As proposed, every reflect instance has a correct matching bar to find. The strings table has no
shape for a check-the-premise case — one where a presented transformation is genuinely incorrect and
the learner's job is to identify that, or where no option matches.

DECISION-026's constraint still applies to whatever form is chosen: the case must be mathematically
honest and calm, presenting a genuinely incorrect transformation rather than a trick of wording,
ambiguous framing, or a misleading visual.

### C — Part 1 and Part 2 contradict each other on who holds instructional state (resolve first)

Part 1 states that renderers do not call `projectScene()` independently and that the container
invokes it once per episode state. Part 2's shared invariant 2 states that **every consumer**
executes `assertSceneCurrent(sceneResult, { state, representationRole, presentationMode })` before
mounting or updating.

`assertSceneCurrent` requires `state`. If every renderer calls it, every renderer holds the full
instructional state — which undercuts the purity claim in the same section and hands three
components the raw material for computing what they are forbidden to compute.

Resolve toward Part 1: the container validates once through `assertSceneCurrent`, and renderers
receive only the returned frozen scene. Renderers should not be able to reach instructional state at
all. State this explicitly in the approved boundary so `plan-08` inherits it unambiguously.

### D — Make the role switch data-driven, not container logic (resolve first)

The proposal says the container projects using "the episode's active primary representation role
(which is `fraction-bar` for Phase 2 episodes, or `symbolic` during symbolic continuation)." Episode
state does not carry a representation role — `projectScene` takes it as a separate argument — so
something outside instructional state selects it.

That is acceptable, because the scene-model position classifies active representation as
configuration rather than instructional state. But "the container picks the role" is one sentence
away from "the presentation layer decides representation," which would cross the separation rule.

State in the boundary that the switch to symbolic is driven by the refusal's own
`continuation.representationRole` value, not by container heuristics. The container reads the
refusal and re-projects with what the refusal names.

## Minor, not conditions

- `` `How many ${den}ths are shaded?` `` and `` `Total ${den}ths` `` render as "How many 12ths are
  shaded?" A screen reader will voice "12ths" unpredictably, and the construction is awkward at a
  grade 2–3 target. Consider a form that reads naturally in both paths. Not a blocker; worth one pass
  during authoring.
- `role="img"` on the bar makes its internal structure opaque to assistive technology, which is
  consistent with DECISION-025 and with the linear path carrying the semantic burden — but it means
  `plan-08` bears the entire semantic load. That is the architecture working as designed; noted so it
  is not a surprise later.

## What is solid and should not be revisited

- The category distinction between representation model and access modality is a genuinely good piece
  of architectural reasoning and should be carried into `plan-08` verbatim.
- Capability refusals are routed to continuation before entering any renderer, so no renderer ever
  receives a refusal.
- Beat-by-beat mounting is enumerated concretely per beat, with explicit prohibition of
  `aria-hidden`, `display:none`, `visibility:hidden`, and opacity-based pre-mounting.
- Learner intent leaves through `dispatchAction` payloads; renderers never update instructional state.
- The collapse rule — active beat expanded, completed beat reduced to a compact summary line that
  stays keyboard and screen-reader reachable while its input controls are dismounted — satisfies both
  DECISION-014 and DECISION-021 criterion 1, and is appropriately modest per OQ-18.
- Control sizing is decoupled from denominator, with a 44×44px target above the 24×24px minimum.
