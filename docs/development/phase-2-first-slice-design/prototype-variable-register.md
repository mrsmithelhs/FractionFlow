# Prototype-Variable Register

## Register status

Every entry below is a live prototype comparison. Under DECISION-005, this
register functions as a **disqualification instrument** rather than a selection
instrument.

Under DECISION-007, Phase 2 adopts **Bundle 1** as its provisional build condition
on design grounds:
- D-01: Animated subdivision (A) with static reduced-motion parity;
- D-02: Semantic morph-in-place (M);
- D-05: Focused key-beat prompts;
- CM-01: Structured mapping check (M) via visual matching task with distractors (DECISION-012).

This provisional bundle remains labeled not-decided in both code and reports.
Per DECISION-006, design conditions must be swappable at runtime upstream in the
deployed static build (accessed via the entry-page gear menu per DECISION-019).
The entries below define the live rival hypotheses and falsification observations
that would disqualify a condition if observed.

Per DECISION-020, child observation is not a blocking gate on Phase 2 acceptance;
informal small-n child evidence serves as post-acceptance disqualification evidence.
Per DECISION-022, participation-floor and accessibility reporting for small-n
observations must report worst-case individual tail events rather than aggregates.
Per DECISION-024, uncued transfer is struck from primary outcomes as unmeasurable
on this evidence ladder, and the Phase 2 specification phase is declared complete.

## Shared experimental contract

All comparisons should use the same validated Plan 03 instance record, the same
episode responsibility map, and the same exact mathematical endpoint. The
canonical synthetic `2/3 + 1/4` record may anchor a first prototype, but a result
that only holds for one numerical instance is not enough to settle a display
question.

Unless an entry explicitly varies it, hold constant:

- problem family, operation, source forms, exact result, and authored path;
- learner readiness/prior exposure band and instructions;
- active support label and every support dimension not under study;
- learner control, required decisions, input mechanism, error recovery, help,
  replay, and response-provenance logging;
- prediction opportunity and final inspectable mathematical state;
- wording except for the controlled prompt-form variable;
- viewport/layout class, text scale, input modality, and time available; and
- reduced-motion and semantic/linear access conditions, evaluated separately
  rather than silently treating them as the visual default.

Primary outcomes are prediction before reveal, immediate equivalence reasoning,
and help/replay use. (Note: uncued transfer was struck from primary outcomes per
DECISION-024 as unmeasurable on a small-n disqualification evidence ladder.)
Secondary outcomes include comprehension, agency, error recovery, response time
interpreted cautiously, and accessibility-specific failures. Completion speed or
click count alone cannot select a condition.

For every experiment, record whether the response was supported construction
or prediction; what was visible or supplied; whether help, replay, correction, or
retry preceded it; and whether the task remained the same stable episode or changed
representation.

## D-01 — Animated transformation versus static/key-frame comparison

**Prototype output — not decided by this dossier.**

### Live rivals

- **A — animated transformation:** a restrained, learner-controlled subdivision
  transition helps the learner perceive how the stable whole is re-expressed in
  a common unit.
- **B — static/key-frame comparison:** a persistent pre/post or key-frame
  comparison gives better inspection and lowers motion-related distraction while
  preserving the same mathematical meaning.

The founding contract requires prediction where it matters, an inspectable final
state, and reduced-motion equivalence. Those requirements are held constant;
they do not select A or B.

### Falsification observations

| Rival | Observation that would falsify the rival |
| --- | --- |
| A | In matched trials, animation does not improve prediction or immediate equivalence reasoning and produces a meaningful regression in inspection, agency, accessibility, or replay comprehension while static/key-frame does not. |
| B | In matched trials, static/key-frame does not preserve or improve inspection and produces a meaningful regression in prediction or immediate equivalence reasoning while animation does not, with no compensating accessibility or agency advantage. |

### Manipulated and held-constant variables

- **Manipulated:** transformation presentation condition: animated subdivision
  versus static/key-frame comparison.
- **Held constant:** same pre-state (`2/3` and `1/4`), same proposed target
  common unit, same learner prediction prompt, same post-state, same final
  inspectability, same control to continue/replay, same semantic labels, same
  support and error behavior, and the same accessible reduced-motion endpoint.

### Outcome measures

- prediction before the transformation is revealed;
- immediate reasoning that the amount stayed equal while the unit description
  changed;
- whether the learner can inspect and identify the post-state after a missed or
  skipped transition;
- uncued transfer to a fresh denominator pair or symbolic-only matched task (struck per DECISION-024; unmeasurable on small-n ladder);
- help and replay use, including whether replay restores agency or becomes a
  substitute for prediction; and
- adult and child evidence of motion burden, meaning, and access, recorded
  separately from mechanized checks.

### Real-world variation dimensions

Learner readiness and prior exposure to equivalent fractions; reduced-motion
preference; keyboard, touch, and screen-reader/linear access; narrow and wide
layouts; device performance; denominator pair and scale-factor size; and whether
the learner enters after an error or a help request.

### Discriminating experiments

| Live pair | Minimum discriminating experiment |
| --- | --- |
| A vs B | Randomize matched learners or counterbalance within a bounded synthetic episode set. Keep content, prediction, endpoint, controls, support, and replay identical. Compare prediction, immediate equivalence reasoning, fresh-form transfer, help/replay use, and access/agency defects. Repeat with reduced-motion enabled so the same semantic endpoint is tested. |

### Conclusion rule

Favor neither condition from completion metrics alone. A condition can be
considered provisionally better only if it improves the preregistered primary
learning outcomes without an unacceptable regression in agency, inspectability,
error recovery, or participation-floor access. If the evidence does not
falsify both rivals, record **consistent with A and B** and name the next
experiment, such as a larger denominator-pair set, a narrower layout, or a
separate reduced-motion comparison.

## D-02 — Transformation choreography

**Prototype output — not decided by this dossier.**

### Live rivals

- **M — semantic morph:** a continuous transition with meaningful semantic
  anchors makes continuity of the quantity easier to perceive.
- **J — deliberate juxtaposition:** pre-state and post-state are shown together
  long enough for direct comparison.
- **S — sequential replacement:** the old state recedes and the new state becomes
  active in a controlled sequence, reducing simultaneous visual load.

The comparison is about choreography, not whether equivalent value is preserved.
Semantic anchors are relationships or labeled quantities, not a commitment to
fixed pixel coordinates across responsive layouts.

### Falsification observations

| Rival | Observation that would falsify the rival |
| --- | --- |
| M | Morphing causes learners to miss or misidentify the invariant relationship, particularly on narrow layouts or reduced motion, and does not recover that loss through replay or final inspection where J or S does. |
| J | Juxtaposition adds comparison burden or prompt fragmentation without improving invariant identification, immediate equivalence reasoning, or transfer relative to M or S. |
| S | Sequential replacement makes the relationship appear to be a value change or removes necessary comparison context, producing worse invariant identification or transfer than M or J. |

### Manipulated and held-constant variables

- **Manipulated:** choreography M, J, or S for the same validated transition.
- **Held constant:** semantic pre/post endpoints, stable whole, common-unit
  values, explicit connection-making demand, prediction timing, final
  inspectable state, control/replay, input, support, wording, and accessible
  description. The same choreography must be represented in a reduced-motion
  equivalent before it can be compared fairly.

### Outcome measures

- identification of what stayed invariant and what changed;
- immediate equivalence reasoning after the transformation;
- delayed or fresh-form uncued transfer (struck per DECISION-024; unmeasurable on small-n ladder);
- errors attributable to visual comparison or missing context;
- help/replay use and whether replay is sufficient to inspect the relationship;
- comprehensibility and agency across viewport and input variants; and
- semantic/linear access parity, not just visual completion.

### Real-world variation dimensions

Narrow versus wide layout; visual attention and prior bar-model familiarity;
reduced-motion setting; screen-reader/linear alternative; touch versus keyboard;
denominator-pair size; and whether the learner is seeing the transformation
before or after a correction.

### Discriminating experiments

| Live pair | Minimum discriminating experiment |
| --- | --- |
| M vs J | Keep a connection-making prompt, endpoints, and final comparison time fixed; compare invariant identification, immediate reasoning, transfer, and access defects. |
| M vs S | Keep the semantic anchors and endpoint inspection identical; compare whether continuous versus sequential change affects perceived quantity preservation and replay use. |
| J vs S | Keep total exposure time and all prompts fixed; compare direct comparison accuracy, cognitive burden, and transfer when both states are co-present versus temporally separated. |

### Conclusion rule

Do not call a choreography superior because it is more polished or faster. A
provisional selection requires a clear outcome advantage with no unacceptable
agency, accessibility, or inspectability regression across the stated variation
dimensions. If the comparisons leave two or more rivals plausible, write
**consistent with M and J**, **consistent with M and S**, or **consistent with J
and S** as applicable, and name the next experiment that separates them. If all
three remain plausible, record **consistent with M, J, and S** and expand the
layout or learner-readiness probe before changing the architecture.

## D-05 — Prompt density and prediction cadence

**Prototype output — not decided by this dossier.**

### Live rivals

- **L — sparse/key-moment prompts:** ask for prediction before the material
  transformation and use a concise resolution/reflection prompt, leaving the
  rest of the episode quiet.
- **H — dense beat prompts:** ask at each meaningful decision boundary, such as
  unit matching, denominator selection, each renaming, operation, and result.
- **C — conditional prompts:** prompt at key moments and add or remove prompts
  based on visible response uncertainty, error, help, or support configuration.

These are candidate cadences only. The dossier does not choose an adaptive rule,
session dose, or fading threshold.

### Falsification observations

| Rival | Observation that would falsify the rival |
| --- | --- |
| L | Sparse prompts omit necessary evidence of the learner's intended decision, produce avoidable guessing, or materially weaken prediction/equivalence reasoning while denser/conditional prompts improve those outcomes without unacceptable burden. |
| H | Dense prompting creates fatigue, fragmented attention, copying, or over-scaffolding and does not improve the primary outcomes over sparse/conditional prompting. |
| C | Conditional prompting is inconsistent or opaque, changes the task across learners in a way that obscures evidence, or fails to improve outcomes and burden relative to a stable sparse or dense cadence. |

### Manipulated and held-constant variables

- **Manipulated:** number and timing of learner-facing prompts, including whether
  prompts are fixed at key moments or conditionally added.
- **Held constant:** mathematical responsibility, content, display condition,
  support label, help/replay, input, error recovery, connection-making prompt
  form, final state, and the wording of prompts that remain in all conditions.
  A prompt must not be removed in a way that changes the required mathematical
  decision without recording that as a separate scaffold variable.

### Outcome measures

- pre-reveal prediction quality and willingness to predict;
- immediate equivalence reasoning and operation reasoning;
- uncued transfer after a prompt-free or changed-format task (struck per DECISION-024; unmeasurable on small-n ladder);
- prompt rereads, skipped prompts, guessing loops, fatigue, and over/under-
  scaffolding observations;
- help/replay requests and whether they correspond to a useful next support;
- agency and comprehensibility; and
- response provenance sufficient to distinguish a prompted answer from an
  independently volunteered one.

### Real-world variation dimensions

Learner readiness and attention span; early versus reduced-support episode;
touch, keyboard, and linear access; narrow viewport; first exposure versus
familiar repeated family; error and help states; and whether the transformation
is animated or static in a separately controlled comparison.

### Discriminating experiments

| Live pair | Minimum discriminating experiment |
| --- | --- |
| L vs H | Counterbalance the same learner across matched instances with identical display and support. Compare prediction, immediate reasoning, transfer, burden, help/replay, and evidence completeness. |
| L vs C | Hold the same key moments constant and vary only conditional additions after an error or help request. Compare whether extra prompts repair evidence without introducing inconsistent task demands. |
| H vs C | Compare fixed dense prompts with conditionally added prompts under the same error/help opportunities. Inspect whether conditional prompts preserve evidence while reducing unnecessary burden. |

### Conclusion rule

A cadence is provisionally supported only when it preserves the intended learner
decisions, produces usable response evidence, and improves the primary outcomes
without prompt fatigue or answer leakage. If the evidence cannot separate two
cadences, write **consistent with L and H**, **consistent with L and C**, or
**consistent with H and C**, then name a next experiment that targets the
uncertain state (for example, a help-after-error case). Do not promote a
conditional rule into a product default from this dossier.

## CM-01 — Connection-making prompt form

**Prototype output — not decided by this dossier.**

Co-presence of a bar and symbolic notation is not by itself evidence that a
learner made the correspondence. This variable holds the display and asks
whether an explicit connection-making demand should be absent, structured, or
briefly explanatory.

### Live rivals

- **N — no explicit connection prompt:** co-present, semantically labeled bar
  and symbolic forms may be sufficient while reducing interruption.
- **M — structured mapping prompt:** ask the learner to identify or match what
  remains the same and what changed, such as matching `2/3` with `8/12`.
- **E — brief explanation prompt:** ask the learner for a short explanation of
  why the quantity is unchanged after renaming.

The response format must be appropriate to the access mode and must not turn a
language-production burden into a mathematical prerequisite without an
equivalent path.

### Falsification observations

| Rival | Observation that would falsify the rival |
| --- | --- |
| N | Co-presence without an explicit demand yields weaker evidence of correspondence and weaker immediate reasoning or fresh-form transfer than M or E, without a compensating reduction in burden that matters to the target episode. |
| M | Matching/identification does not improve correspondence or transfer over no prompt and adds avoidable guessing or interaction burden compared with E or N. |
| E | Brief explanation adds language or motor burden without improving correspondence, reasoning, or transfer beyond structured mapping or no prompt, including when an equivalent response mode is provided. |

### Manipulated and held-constant variables

- **Manipulated:** no explicit prompt, structured mapping/identification, or
  brief explanation.
- **Held constant:** same visual and symbolic co-presence, mathematical content,
  transformation choreography, prediction timing, support, final state,
  language/reading level, response opportunity duration, help/replay, and
  accessibility-equivalent response mechanisms.

### Outcome measures

- immediate identification of equivalent quantities;
- explanation or demonstration of why the quantity stayed equal;
- uncued transfer to a fresh representation or fresh denominator pair (struck per DECISION-024; unmeasurable on small-n ladder);
- guessing, burden, response refusal, and language/motor access issues;
- whether the prompt preserves learner agency rather than telling the answer; and
- provenance showing whether the response was prompted, supported, corrected, or
  genuinely uncued.

### Real-world variation dimensions

Reading/language ability; keyboard, touch, speech-independent, and linear
semantic access; prior equivalence exposure; visual versus symbolic preference;
narrow layout; and supported construction versus reduced-support work.

### Discriminating experiments

| Live pair | Minimum discriminating experiment |
| --- | --- |
| N vs M | Keep both representations co-present and all display variables fixed; compare explicit correspondence and fresh-form transfer against interaction burden. |
| N vs E | Keep the same co-presence and response time; compare whether a brief explanation adds evidence of invariant understanding beyond silent co-presence without language-driven confounding. |
| M vs E | Use equivalent low-language response alternatives where possible; compare mapping accuracy, explanation of the invariant, transfer, and burden. |

### Conclusion rule

The prompt form is provisionally favored only if it produces stronger evidence of
the intended correspondence or transfer without revealing the answer or
excluding learners through avoidable response burden. If the data do not separate
two conditions, explicitly write **consistent with N and M**, **consistent with
N and E**, or **consistent with M and E**, and name the next experiment. If all
three remain plausible, write **consistent with N, M, and E** and test a task
where co-presence, matching, and explanation make different predictions.

## Deferred items not activated by this slice

- **D-03:** number-line timing is outside the first slice.
- **D-04:** bridge frequency and blocked/interleaved representation schedules
  are not instantiated because the slice uses fraction bars plus integrated
  symbolic notation, not a number-line bridge.
- **D-06:** no fixed denominator or rendering ceiling is set; capability checks
  remain an implementation requirement.
- **D-07:** no session dose or completion-time rule is set.
- **D-08, D-10, D-11, D-12:** first-run placement, identity, persistence, and
  shared-device policies are outside this dossier except for the Plan 03 content
  version/provenance needed for replay.
- **D-22:** no concrete WCAG conformance or supported-environment matrix is
  selected here; the accessibility plan names the evidence needed to choose and
  review one later.

No deferred item in this section has been promoted or decided. Any later
promotion must name the item, evidence, owner, smallest experiment, non-goals,
outcome-based validation, and applicable privacy/accessibility/deployment gates.
