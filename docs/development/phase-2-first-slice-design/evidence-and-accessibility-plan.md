# Evidence, Accessibility, Scaffold-Leakage, and Replay Plan

## Status and evidence boundary

This file is a plan for evidence collection and validation. No mechanized check,
human review, child observation, accessibility review, or learner outcome has
been conducted by Plan 04. A future implementation packet must turn the planned
checks into executable and reviewable evidence before making any acceptance
claim.

## Learner-prerequisite contract

### Intended starting point

The first slice is for an upper-elementary learner who has encountered, or can
demonstrate readiness for:

- a whole divided into equal fractional units;
- numerator and denominator meaning;
- simple equivalent fractions and the idea that renaming can preserve quantity;
- addition of like-denominator fractions; and
- the idea of a common unit or common denominator.

This is the Stages A–D prerequisite boundary in the Instructional Model. The
target slice exercises the Stage E-like task of renaming both fractions for
unlike-denominator addition; it does not claim to teach the full progression
from novice Stage A through Stage E.

### Readiness documentation before learner observation

Before any child observation, an owner-approved protocol must do one of the
following:

1. record only a de-identified, minimal description of relevant prior exposure;
   or
2. use a short readiness check that samples prerequisites without teaching the
   target episode.

The protocol must define adult permission, de-identification, data minimization,
retention, and removal handling before observation. No names, contact details,
identifiable screenshots, recordings, student work, or other learner artifacts
are to enter the public repository, issue tracker, fixtures, or deployment.
Synthetic, reconstructed, or already-public cases remain the default for
automated and regression work.

## What evidence from this slice may and may not establish

| Evidence question | This slice may establish, after the appropriate evidence is collected | This slice may not establish by itself |
| --- | --- | --- |
| Mathematical trust | Exact visible transformations, valid operation results, correct classification of canonical and covered valid alternate paths, and preservation of value across representations. | That every future family, denominator, representation, or renderer is mathematically correct. |
| Representational continuity | Whether the implemented bar/symbolic scenes and their semantic alternatives preserve the same validated quantity through the tested transition. | That a particular animation, choreography, or representation is generally superior before the prototype comparisons run. |
| Comprehensibility | Whether the stated starting-point participants and reviewers can identify the current question, unit relationship, and next action in the tested episode. | Universal comprehensibility, novice learning of prerequisites, or generalization to all ages/languages/devices. |
| Agency | Whether tested paths leave the declared mathematical decisions with the learner and whether help/replay returns control. | That an independent support configuration demonstrates independent transfer. |
| Error recovery | Whether tested invalid denominator, invalid equivalence, arithmetic, and unsimplified-result cases recover locally without discarding correct work. | That all misconception classes or future families have adequate recovery. |
| Supported performance | How the episode behaves for the stated prerequisite boundary under each tested support configuration. | Durable learning, persistence, instructional efficacy, or population-level effect. |
| Accessibility participation | Whether the planned first-slice environments meet the participation floor once mechanized, human, and (when conducted) child evidence are complete. | A WCAG conformance claim, universal accessibility, or usability in untested modes. |
| Transfer | Only the explicitly designed and separately recorded transfer response may provide transfer evidence. | Co-presence, a completed visual transition, or success after a reveal does not establish independent transfer. |
| Scaffold fading | Whether a tested lower-support variant retains the mathematical responsibility and remains usable. | Efficacy of a fading rule, adaptive placement, or session-level progression. |

The evidence record must use the separate response categories **supported
construction**, **prediction**, and **independent transfer**. It must never infer
independent transfer from the label `independent`, from a correct final answer
after help, or from two views being displayed together.

## Response-level provenance contract

Every assessed response in the implementation should retain enough structured
provenance for review and replay. The planned record includes:

- synthetic content identity: schema version, generator/profile version, seed or
  curated fixture ID and authoring revision, instance ID, selector, overlays,
  and exact source forms;
- proposed episode-definition ID/revision and the active support label plus
  each independent support dimension;
- active beat, expected responsibility, and active representation role;
- what was visible, supplied, prefilled, constrained, highlighted, or hidden
  before the response;
- prompt form and density, prediction opportunity, and connection-making demand;
- help, replay, reveal, correction, and retry actions before the response;
- learner action/value in a synthetic replay-safe form;
- math/content classification, including invalid, valid-least,
  valid-non-least, correct-unsimplified, or correct-simplified where relevant;
- whether the response was supported construction, prediction, or independent
  transfer; and
- resulting instructional and semantic scene state.

This is an episode/debug record, not a learner-facing history panel and not a
permission to store personal learner data. A future persistence decision is
outside this packet.

## Scaffold-leakage test plan sketch (D-16)

The implementation should serialize or otherwise expose a reviewable semantic
scene/prompt snapshot immediately before each required response. Fail-first
invariants should inspect the learner-visible visual and semantic/linear paths,
not merely screenshot pixels.

### Required pre-response invariants

1. **Notice:** before the learner answers whether units match, the prompt may
   expose the source denominators and bars, but it must not mark the correct
   notice response as selected or replace the question with an explanation.
2. **Common denominator:** before the denominator response, target subdivisions,
   scale factors, converted numerators, and the final operation result must not
   appear as selected, prefilled, uniquely highlighted, or accessible-only text.
   A constrained choice list may contain candidate values, including a valid
   target, but the scene must not reveal which candidate is correct.
3. **Equivalent numerator/scale factor:** before each requested conversion
   response, the target numerator and scale factor must not be present in the
   answer slot, hidden accessible label, status text, or post-state scene. The
   source form and the mathematical responsibility may remain visible.
4. **Prediction:** before a transformation prediction, no post-transition
   subdivision, target numerator, endpoint, or answer-revealing alternative may
   be exposed in either the visual or semantic/linear path.
5. **Operation:** before numerator addition is requested, the raw sum/result
   must not appear as a prefilled value, status announcement, highlighted
   option, or accessible description.
6. **Resolve/reflection:** before a simplification or connection response, the
   preferred final form or explanatory response must not be supplied as the
   requested answer. A prior validated result may remain visible only when the
   active question does not ask the learner to reproduce it.
7. **Help/replay:** a revealed or demonstrated state is tagged as supported;
   it cannot be counted as an uncued prediction. Replay must restore known
   endpoints and must not silently alter the mathematical or instructional
   response requirement.
8. **Retry/stale-state:** after an invalid response, the scene must retain
   correct prior work while clearing only the invalid pending response. A stale
   post-state from an earlier attempt must not answer the next question.
9. **Capability fallback:** a valid path outside authored coverage or renderer
   capability must be classified as valid-but-outside-coverage, not converted
   into an invalid answer or passed into an unsupported scene.

### Planned failure reporting

Each failed invariant should report the episode definition, content identity,
beat, support configuration, response index, semantic snapshot field that leaked,
and whether the leak occurred in the visual path, semantic/linear path, or both.
The report should preserve a synthetic replay fixture and avoid learner artifacts.

These are planned checks only. No scene or prompt model exists yet, so no result
is claimed here.

## Accessibility participation-floor plan

The participation floor is a future Phase 2 acceptance gate. The following maps
each required floor item to a planned mechanism and separately named evidence.

| Participation-floor requirement | Planned mechanism | Mechanized evidence | Human review | Child usability evidence |
| --- | --- | --- | --- | --- |
| Required decisions without precision dragging | Use keyboard-operable buttons/choices and numeric or structured fraction entry for denominator, equivalent forms, operation, help, replay, and continue. Provide a non-drag touch/equivalent control path. | Focus reachability, activation, form validation, and no-drag path regression checks. | Complete the full episode with keyboard and touch-equivalent paths; confirm the same decisions, not answer revelation. | If conducted, observe motor effort, target size, accidental activation, and whether the control communicates its role; retain only de-identified findings. |
| Motion reduced or disabled without losing meaning | Use one state transition path with a reduced-motion presentation that reaches the same semantic post-state and retains a meaningful indication of what changed. | Compare standard, reduced-motion, and instant/test endpoints and status changes. | Inspect whether the transformation still communicates quantity preservation and learner control. | If conducted, observe whether learners can follow the change without relying on motion. |
| Semantic, programmatically inspectable meaning and linear alternative | Expose quantity, numerator, denominator, whole, current task, available action, status, and pre/post relationship in structured semantics and a readable linear order. | Inspect labels, roles, names, reading-order fixtures, status announcements, and stale-state behavior. | Use the semantic/linear path through the complete episode and compare responsibility with the visual path. | If conducted, observe wording, navigation, and whether the linear path remains a reasoning task. |
| Focus, reading order, labels, status, contrast, text size, responsive layout | Define a candidate supported-environment matrix at the implementation gate; test structural semantics and responsive hierarchy in each chosen environment. | Keyboard/focus, label, status, contrast, zoom/text-size, and responsive regression checks. | Walk the complete episode at selected widths and text scales, including error/help/replay states. | If conducted, observe obstruction, rereading, target size, and affordance confusion. |
| Same mathematical responsibility across access modes | Keep the same source state, instructional state, expected response, and validation; vary only presentation/input access. | Compare serialized responsibility and response contracts across visual, keyboard, touch-equivalent, and semantic/linear modes. | Review whether any access mode supplies a result that another mode asks the learner to reason out. | If conducted, observe whether the alternative feels like a usable route rather than a stripped-down answer display. |

No row is satisfied by a scanner alone. The Phase 2 gate must record
mechanized checks, human accessibility review, and child evidence separately;
child evidence is optional until the applicable owner/roadmap gate calls for it,
but it cannot be silently substituted by adult review.

## Supported-environment matrix: open D-22 question

The concrete supported-environment matrix is intentionally open. The following
are test dimensions to select and record later, not a current support claim:

| Dimension | Candidate test condition | Status in Plan 04 |
| --- | --- | --- |
| Browser/OS | Owner-selected current desktop and mobile browser combinations used by the Phase 2 implementation target | Untested; no matrix selected |
| Layout | Narrow phone, wide phone/tablet, and desktop-width layouts | Untested |
| Input | Keyboard-only, touch without precision dragging, and ordinary pointer where available | Untested |
| Motion | Default motion and reduced/disabled motion | Untested |
| Semantic access | Screen-reader/linear reading path selected by the implementation gate | Untested |
| Text and contrast | Owner-selected text-size/zoom and contrast review conditions | Untested |
| Performance | At least one lower-performance target if it is in the selected support scope | Untested |

No concrete WCAG standard, browser support promise, dedicated keypad, audio
requirement, or universal-accessibility claim is selected in this dossier.

## Evidence collection sequence for Phase 2

When the implementation exists, the evidence packet should proceed in this
order:

1. validate exact content and scene endpoint facts against synthetic fixtures;
2. run scaffold-leakage and response-provenance checks before human review;
3. run the selected keyboard, touch-equivalent, reduced-motion, semantic, focus,
   reading-order, contrast, text-size, and responsive checks;
4. conduct a human instructional/accessibility review of the complete episode,
   including errors, help, replay, alternate valid path, and reduced motion;
5. if the owner gate calls for child usability, complete the permission and
   de-identification protocol, document readiness, collect only needed
   interaction evidence, and keep it separate from the first two evidence kinds;
6. exercise the complete episode at the public GitHub Pages URL with no backend,
   as `docs/founding/06-roadmap.md` §16 requires; local success and an asset
   smoke check are explicitly not substitutes for this end-to-end check;
7. record prototype outcomes without converting them into product decisions until
   the owner/orchestrator reviews the falsification record; and
8. report allowed claims and residual untested modes separately.

### Exit-gate criteria this plan does not carry

The claim table above follows the Phase 2 evidence boundary of
`docs/founding/06-roadmap.md` §16. The §25 exit gate additionally requires
**aesthetic coherence** — that the experience feels calm and deliberate rather
than dashboard-like — alongside the §23 attention to whitespace, typography,
timing, anchors, motion, mobile layout, and touch/keyboard interaction. No
mechanism or evidence kind for that criterion is planned here. The Phase 2
implementation packet must carry it; this dossier neither plans it nor claims it
is satisfied.

## Replay and defect-report plan

### Minimum synthetic defect envelope

A reported issue should be reconstructable from:

- content schema/version;
- generated seed and generator/profile version, or curated fixture ID and
  authoring revision;
- instance ID, family selector, operation, overlays, and source forms;
- episode-definition ID/revision;
- support label and independent support dimensions;
- active representation and presentation mode, including reduced motion;
- viewport/layout and input mode when relevant;
- ordered learner-intent action sequence, including responses, help, replay,
  corrections, retries, and continuation choices; and
- the expected and observed semantic scene/instructional transitions.

The canonical Plan 03 instance can be reconstructed from the curated fixture
`curated-relatively-prime-addition-non-least` or its instance ID
`relatively-prime-addition__none__2__3__1__4`. A generated instance must include
its seed and relevant generator/profile versions. The replay harness must rebuild
the validated content record, instantiate the episode definition and support
configuration, feed the action sequence, and compare classifications and scene
endpoints.

### Defect categories

The report should identify the earliest failing boundary:

- mathematical/content validation;
- instructional responsibility or transition;
- scene meaning/projection;
- renderer fidelity/layout;
- interaction/input/focus;
- accessibility semantics or agency parity;
- valid-but-outside-authored-coverage handling; or
- reproducibility/tooling.

A valid non-LCD path rejected only because it has no authored choreography is a
coverage/continuation defect, not a mathematical defect. A correct unsimplified
result rejected solely for not matching the preferred final form is a result
classification defect.

### Privacy and regression handling

The default defect artifact is synthetic and contains no personal learner data.
If a child observation reveals a defect, retain only a de-identified interaction
summary and reconstruct the regression with a synthetic or public fixture. A
meaningful defect should gain a durable synthetic regression case after the owner
reviews scope and handling.

## Explicitly untested in Plan 04

- application behavior, render fidelity, interaction behavior, or build output;
- any child observation or learner outcome;
- any browser/OS/assistive-technology support claim;
- any mechanized accessibility, semantic, contrast, focus, or reduced-motion
  result;
- any animation, choreography, prompt-density, prediction-cadence, or
  connection-prompt comparison;
- novice prerequisite learning, persistence, independent transfer, fading-rule
  efficacy, or instructional efficacy; and
- number-line bridges, session dose, placement, identity, persistence, backend,
  public-release, or privacy-statement behavior.
