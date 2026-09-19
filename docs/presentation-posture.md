# Presentation Posture

Owner guidance on how the founding contracts apply as the project moves into learner-facing
layers. Two sections: **accessibility posture** and **learner-facing register**.

**Status:** owner guidance, recorded 2026-09-19. Subordinate to the founding documents; it
changes none of them.

**Authority:** owner decision, relayed through the `plan-04` implementer thread and reconciled by
orchestration. Presentation-layer packets should cite this file alongside
`docs/founding/05-quality-and-validation.md` §44 and `docs/founding/02-interaction-grammar.md`
§§71–72.

# Part 1 — Accessibility posture

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

# Part 2 — Learner-facing register

Recorded 2026-09-19, after the owner asked whether the project's docs prevent the language of
academic research from reaching the product.

They do not, adequately. The founding documents guard against *mathematical* jargon and against
*psychological overclaim*. They say nothing about the vocabulary of the research apparatus, because
until `plan-04` the project had no research apparatus to leak.

## What already protects the learner

- `05-quality-and-validation.md` §33 (Language Quality) requires learner-facing language to be
  reviewed for age appropriateness, brevity, unnecessary jargon, and unnecessary reading burden.
- `05-quality-and-validation.md` §16 (Error Classification Must Be Humble) forbids overclaiming
  psychological certainty, contrasting an acceptable "These denominators were added instead of
  being made into the same unit" against a less acceptable "You think denominators should always
  be added."
- `05-quality-and-validation.md` §90 requires the product be "child-appropriate without being
  childish."
- `00-principles.md` §4 requires terminology to follow meaning rather than substitute for it.

## What does not protect the learner

**Nothing separates the analytic register from the learner-facing register.** §33 was written
against mathematical jargon. Words like *invariant*, *transfer*, *condition*, *provenance*,
*support configuration*, *prediction cadence*, and *evidence category* are not mathematical
jargon, and would pass a §33 review conducted by someone thinking about fractions. No rule anywhere
in the repository states that the vocabulary of the specification must not become the vocabulary of
the interface.

**The `plan-04` dossier treats wording only as an experimental control.** Every appearance of
"wording" in the prototype-variable register is an instruction to hold it constant across
conditions. That is methodologically correct and entirely silent on whether the wording is any good
for a ten-year-old.

**Nothing states that the research apparatus is invisible to the learner.** The founding documents
barely mention research at all. The comparison machinery lives in `reports/orchestration/` and in
the `plan-04` dossier, and no document draws the boundary — because nobody needed to until the
dossier existed.

This is not hypothetical. The episode definition's Reflect beat currently reads:

> State or match the invariant that the quantity stayed the same while the description changed.

That is the specification register, in the document an implementer is meant to build prompts from.
A child-facing equivalent is closer to *"Is it still the same amount?"*

## The rules

1. **Specification vocabulary is not learner-facing vocabulary.** The episode definition, scene
   model, register, and evidence plan describe the system to its builders. Learner-facing strings
   are authored separately, against a child-facing standard, and are never lifted from a
   specification document because the specification happened to phrase the idea first.
2. **The research apparatus is never visible to the learner.** No condition label, variant name,
   experimental framing, preference-between-versions prompt, or outcome-measure vocabulary appears
   in the interface. A learner using FractionFlow is doing mathematics, not participating in a
   study, and the interface must never suggest otherwise.
3. **The product never asks a learner to produce research artifacts.** It does not ask a child to
   describe how well a transition worked, to rate a representation, or to have an adult record
   observations. Where learner observation happens under the
   `05-quality-and-validation.md` §52 protocol, the adult observer records out of band — the
   product itself stays silent about being observed.
4. **A reflection prompt is a mathematical question, not an outcome measure.** The register may
   define what a reflection response is *evidence of*; the prompt the learner reads asks about
   quantity, unit, or amount in plain words.
5. **Internal records keep the analytic vocabulary.** Response provenance, evidence categories, and
   support configuration are recorded exactly as
   `05-quality-and-validation.md` §510 and the dossier require. The separation runs between what is
   *recorded* and what is *displayed*, not between what is precise and what is vague.

## Review question for Part 2

> Would a ten-year-old reading this string know what to do, without knowing anything about how the
> system is built or why it is being studied?

Applies to every learner-visible string, including accessible names, status announcements, help
text, and the semantic/linear path — which `docs/open-questions.md` OQ-10 notes is the surface most
exposed to reading burden, since it is text all the way down.

## Related open questions

- **OQ-10** — no reading-burden target exists for learner-facing text. Part 2 sets the register
  boundary; it does not set a reading level. Both are needed.
- **OQ-06** — the §25 aesthetic-coherence criterion still has no review mechanism; the two review
  questions in this document are the best candidates the project currently has.

# Scope

This is guidance for implementation and review. It is not a founding-document change, and not a
request to initiate formal accessibility conformance work or learner-efficacy research.
