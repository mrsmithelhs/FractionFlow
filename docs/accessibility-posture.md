# Accessibility and Presentation Posture

**Status:** owner guidance, recorded 2026-09-19. Subordinate to the founding documents; it
changes none of them. It governs how implementers and reviewers apply the existing accessibility
contracts as the project moves into presentation layers.

**Authority:** owner decision, relayed through the `plan-04` implementer thread and reconciled by
orchestration. Presentation-layer packets should cite this file alongside
`docs/founding/05-quality-and-validation.md` §44 and `docs/founding/02-interaction-grammar.md`
§§71–72.

## The posture

Accessibility should increase access to the learning experience, not replace the experience with
an explanatory control panel.

- The default learner experience optimizes for mathematical clarity, calm visual hierarchy, low
  cognitive load, and efficient mouse/touch interaction.
- Motion-enabled presentation is permitted and may be the default where it communicates
  mathematical meaning.
- Reduced-motion presentation must remain available and must preserve the same mathematical
  meaning, learner responsibility, and inspectable endpoint. It need not feel identical.
- Mouse and touch may be the most efficient and visually prominent interaction path. Keyboard and
  non-precision alternatives must remain viable for every required decision, but need not be the
  primary interaction style.
- Accessibility semantics and linear alternatives do not imply a large visible textual interface.
  They expose the relevant mathematical meaning and available action for that access path, using
  progressive disclosure or secondary presentation where appropriate.
- Optional presentation preferences may be configured outside the core learner scene, but basic
  participation must not depend on a deeply hidden or teacher-only mode. A learner needing
  keyboard, non-drag, reduced-motion, or semantic access should be able to discover and use the
  equivalent path without being routed through a separate application.
- Accessible alternatives preserve the learner's mathematical responsibility. They never announce
  the answer the visual path asks the learner to determine.
- Continue to avoid dashboard accumulation, prompt fragmentation, tutorial lock-in, hint
  avalanches, and visible support that overwhelms the primary mathematical object and the current
  question.

This posture is consistent with the founding documents as written. They define accessibility as a
participation floor and an architectural capability
(`05-quality-and-validation.md` §44), require calmness as a functional property
(`00-principles.md` §18), fix the instructional hierarchy across screen sizes
(`02-interaction-grammar.md` §71), and treat over-scaffolding as a quality defect
(`05-quality-and-validation.md` §20). Nothing in them requires every access mode to be equally
prominent, or the most accessibility-heavy presentation to be the default.

## Two axes that must not be conflated

This is the most important distinction in this document, and the one most likely to be lost.

**Axis A — presentation mode (accessibility).** Whether the interface runs motion-enabled or
reduced-motion. This posture settles Axis A: motion-enabled may be the default; reduced-motion
must remain available, discoverable, and meaning-preserving.

**Axis B — instructional display condition (`D-01`).** Whether the equivalent-renaming
*transformation* is communicated by animated subdivision or by a static/key-frame comparison.
This is an open prototype variable. `plan-04`'s register forbids selecting a winner, and this
posture does not select one.

A build can be motion-enabled by default on Axis A while presenting the transformation as static
key frames on Axis B. The two are independent.

> Recording "motion may be the default" resolves Axis A only. It does **not** resolve `D-01`, and
> must not be cited as having done so.

`D-02` (morph / juxtapose / sequential), `D-05` (prompt density and prediction cadence), and
`CM-01` (connection-making prompt form) are likewise untouched by this posture. See
`docs/open-questions.md` OQ-01 for why an undecided variable can still harden into a default by
inertia — this posture is exactly the kind of statement through which that happens if the axes are
blurred.

## What this posture does not relax

The posture governs **prominence, default, and verbosity**. It never governs **whether a required
decision is completable**. The `05-quality-and-validation.md` §44 participation floor stands
unchanged and in full:

- every required learner decision and response completable without precision dragging, using
  keyboard-operable controls and a non-drag touch or equivalent path;
- usable with motion reduced or disabled, without hiding mathematical meaning in animation;
- mathematical meaning and available actions conveyed through semantic, programmatically
  inspectable content and an accessible linear alternative where the visual scene alone is
  insufficient;
- focus, reading order, labels, status changes, contrast, text size, and responsive layout
  reviewed for the supported environments; and
- the accessible path preserves the same mathematical responsibility and does not reveal a
  response the visual path asks the learner to reason out.

"Not primary" and "not equally prominent" are permitted. "Not available," "not discoverable," and
"not equivalent in responsibility" are not.

## Review question

For each added label, description, control, or support element, in each access path:

> Does this make the current mathematical object, the current question, or the available action
> clearer for this access path — or is it merely exposing more information because it is
> technically possible?

Apply it in both directions per feature: whether the default visual/touch path is clear, efficient,
and cognitively restrained; and whether the equivalent keyboard, non-drag, reduced-motion, or
semantic path preserves participation and agency.

This question is also the best candidate mechanism the project currently has for the roadmap §25
**aesthetic coherence** exit criterion, which `docs/open-questions.md` OQ-06 records as having no
review mechanism.

## Unresolved tensions this posture creates

The posture is coherent, but three of its statements collide with existing contracts in ways that
need an owner decision before presentation code is written. They are queued as OQ-13, OQ-14, and
OQ-15 for `docs/open-questions.md`, held in
`reports/orchestration/pending-open-questions-merge.md` until the live design-review session hands
back that file (see the note in that file).

1. **Drag as enhancement, or drag as primary?** §44 requires that required decisions be
   *completable* without precision dragging. If the prominent path is drag-based and the non-drag
   path is a fallback, the letter is satisfied while the designed experience is drag-first — and
   upper-elementary children on touch devices are precisely the population for whom precision
   dragging fails.
2. **Progressive disclosure versus the scaffold-leakage invariants.** The posture endorses
   progressive disclosure so that accessibility semantics do not become a wall of text. But the
   `plan-04` leakage invariants forbid the requested value appearing as "accessible-only text," and
   forbid answer-revealing alternatives in either the visual or the semantic path — while hiding
   content from the accessibility tree removes access entirely.
3. **Preference persistence without accounts.** Participation must not depend on a hidden or
   teacher-only mode, but the project is static-only with no accounts, so preferences live in
   browser storage on a possibly-shared classroom device.

## Scope

This is guidance for implementation and review. It is not a founding-document change, and not a
request to initiate formal accessibility conformance work or learner-efficacy research.
