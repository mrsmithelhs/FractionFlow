# Scene Model Design Position

## Position for D-20

For the first slice, the Scene Model should be a pure semantic projection of:

1. validated problem and mathematical state from the Plan 03 content contract;
2. current instructional state, including the active beat, learner-established
   decisions, support configuration, help/replay state, and expected response;
3. the active representation role and reviewed capability; and
4. an explicit presentation mode such as standard motion, reduced motion, or an
   instantaneous test transition.

The Scene Model is not a second source of mathematical or instructional truth.
It expresses what relationships should currently be perceptible: for example,
that the two quantities are active, that the whole is divided into thirds and
fourths, that the validated target common unit is twelfths, or that the current
forms are ready for like-unit addition. A renderer receives that semantic scene
and decides layout and visual detail.

The exact data structure remains deferred. This is a design position about
ownership and authority, not an implementation schema.

## Source inputs and derived fields

| Source or derived item | Authority | Scene use |
| --- | --- | --- |
| Exact operand and result values, current forms, preferred forms | Mathematical/content state | Quantity, unit, count, equivalence, and operation meaning. |
| Canonical/alternate path facts and validation classifications | Mathematical/content state | Valid transformation options and valid/invalid status; the scene never recomputes them. |
| Active beat and expected response | Instructional state | What must be perceptible and what must remain hidden until the learner responds. |
| Learner-established denominator, scale factor, numerator, and operation work | Instructional state | Preserved accomplishment and the next supported responsibility. |
| Support label and independent support dimensions | Instructional state | Which controls, prompts, model details, and help/replay affordances may be present. |
| Active representation and capability result | Configuration/content capability | Which semantic representation roles can be rendered and which continuation is needed. |
| Reduced-motion or test transition mode | Presentation configuration | How a known state transition is shown; never what the destination state is. |
| Layout coordinates, color, typography, DOM order, animation frames | Renderer | Not Scene Model authority. These are downstream presentation details. |

The projection should be recomputed from canonical inputs, learner decisions, and
current instructional position. A materialized scene snapshot may exist for a
render pass, transition comparison, replay log, or performance cache, but it
must be treated as derived and disposable. It must carry or be associated with
enough source revision/context to detect staleness; it must never be edited as a
replacement for the source state.

## Architectural decisions

These are architecture consequences of the founding state-ownership contracts,
not empirical claims about which instructional display learners prefer.

### A. One semantic projection between instructional logic and renderers

The pipeline is:

```text
validated content/math state → instructional state → semantic Scene Model → renderer(s)
                                      ↑                         ↓
                               learner-intent events       accessible presentation
```

Learner events return to the Instructional Engine. A bar renderer, symbolic
renderer, or accessible linear renderer does not mutate shared mathematical state
or maintain a competing episode workflow. This keeps representation switching,
testing, and replay deterministic.

### B. The Scene Model describes meaning, not pixels

Scene concepts should state relationships such as "this quantity is two thirds
of the stable whole" or "these forms are validated equivalents in a twelfth
unit." They should not make `x`, `width`, `color`, or `animationFrame` the
authority for meaning. The renderer chooses a responsive arrangement that
faithfully expresses the semantic state.

### C. A transition has known endpoints

For an equivalent-renaming transition, the content/math contract and
Instructional Engine establish the target form first. The Scene Model then
describes a known pre-state and known post-state. Animation, a key-frame
sequence, a direct reduced-motion change, or a test-time instant transition may
show that transition, but none may calculate or authorize the post-state.

### D. Source state and learner accomplishments stay upstream

The scene may show that the learner has established denominator `12`, left
equivalent form `8/12`, or a valid operation result. It must not infer those
accomplishments from pixels or from a renderer callback. Current form, accepted
transitions, support use, retries, and expected response remain in the
appropriate content/instructional record.

### E. Capability and accessibility are semantic inputs

Before a scene is sent to a representation renderer, the system performs the
reviewed capability check. The scene retains enough unit/count/whole and task
meaning to produce a semantic, linear alternative. An alternate access mode uses
the same instructional responsibility; it does not become an answer-revealing
fallback.

## Rejected architectural alternatives

The alternatives below are rejected as architecture for this slice. Their
rejection does not require learner-outcome evidence because each conflicts with
the state-ownership and reproducibility contracts.

| Alternative | Why it is rejected architecturally |
| --- | --- |
| Renderer-owned mathematical or episode state | It would make bars, symbolic notation, and accessible output competing authorities, allowing visible components to disagree about exact value, validity, or the next beat. |
| Independently mutable Scene Model store | It would create a drifting copy of derived state and require manual synchronization. Canonical content, learner decisions, and instructional position should be stored upstream; derived scene meaning should be recomputed. |
| Pixel coordinates or animation frames as scene authority | Pixel/layout data cannot state mathematical identity and would make responsive layout, reduced motion, replay, and accessibility depend on incidental presentation details. |
| Animation callback as the event that creates mathematical state | It would make mathematical completion depend on frame timing and make skipped, reduced-motion, and test transitions unsafe. |
| Direct renderer-to-renderer synchronization | It bypasses shared semantic state and makes representation switching order-dependent. All renderers must receive the same scene projection. |
| Scene Model as a learner-history database | Episode history and learner-established accomplishments belong to instructional state/replay data. Putting them in the scene would mix source history with a display projection and encourage UI-state architecture. |
| Prose-only scene state | Free text cannot reliably carry exact units, values, task status, or accessible relationships. Presentation text should receive structured mathematical values rather than reconstructing them from strings. |

## Empirical hypotheses routed elsewhere

The following are deliberately not architectural decisions:

- whether animated subdivision, static/key-frame comparison, or another display
  condition better supports prediction and immediate equivalence reasoning;
- whether morphing, deliberate juxtaposition, or sequential replacement makes
  invariant relationships more understandable across layouts;
- how much prompt density and prediction cadence preserve attention without
  creating fatigue or guessing loops; and
- whether no connection prompt, a structured mapping prompt, or a brief
  explanation prompt better produces explicit representation correspondence.

Those are learner-outcome questions. They are registered with rival hypotheses,
held constants, discriminating experiments, and conclusion rules in
[`prototype-variable-register.md`](prototype-variable-register.md). The Scene
Model must be expressive enough to represent each condition without making any
one condition the architectural default.

## Consequences for implementation review

When a Phase 2 implementation packet is eventually drafted, its scene tests
should be able to demonstrate that:

1. identical source and instructional inputs produce identical semantic scene
   meaning across renderers;
2. no renderer computes a denominator, exact result, or correctness outcome;
3. a reduced-motion or instant transition reaches the same post-state as the
   standard transition;
4. stale or unsupported capability inputs fail closed before rendering;
5. the scene exposes the semantic information needed for the accessible linear
   alternative; and
6. replay can reconstruct the source instance, episode definition, support state,
   and learner-intent action sequence without treating pixels as the source.

These are future implementation and validation obligations, not claims that the
checks have already run.
