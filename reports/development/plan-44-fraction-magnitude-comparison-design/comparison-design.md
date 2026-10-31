# Plan 44 — Fraction Magnitude Comparison Task and First-Slice Design

**Inspected source revision:** `0a5904f46980f3438323a7d8fba893b4a329b771` (2026-10-31)
**Scope approval:** [Requirement 0 approval](scope-approval.md)
**Status:** Recommended design for orchestration and owner disposition. This document does not adopt the task or authorize source work.

## Recommendation

Start with one short **compare two proper-fraction amounts using honest equal-whole bar models** task. The learner sees both source fractions and both equal-width wholes together, then makes one relation judgment: first amount is less, the amounts are equal, or the first amount is greater. The relation control uses complete spoken labels and an explicit **Check**. After acceptance, the app may show the familiar symbolic relation (`<`, `=`, or `>`) beside the retained models.

The models are intentionally visible before the response: reading their relative shaded amounts is the mathematical work. The scene may expose each fraction, its whole, partition count, and shaded amount to the visual and linear paths. It must not expose the computed relation, mark a correct choice, or include the relation in answer-bearing accessible text until acceptance. That boundary keeps the model-reading task honest without treating an intended representation as a leak.

Defer common-unit construction as the first task. Its learner contribution is valid when the explicit purpose is constructing equivalent units; in this first comparison slice it would repeat a familiar renaming responsibility, lengthen the interaction, and make representation eligibility depend on LCD capacity. For example, `3/5` and `3/7` have LCD 35, above the current Phase 2 fraction-bar ceiling of 30, while each source bar is within that ceiling. The exact core can compare them without constructing 35ths. The direct task is the smaller new responsibility: interpret two honest amounts and state their relation.

This is a design judgment supported by current mathematical and architectural fit. It is not evidence that model reading produces stronger learning, transfer, or engagement than symbolic comparison. Those questions remain for owner judgment and any separately authorized learner evaluation.

## Learner flow and copy

Use one interactive comparison step. Do not add an encounter acknowledgment or a second task that asks the learner to translate the same judgment into a symbol.

| State | Proposed experience |
|---|---|
| Compare | Show two equally wide, left-origin fraction bars with same-size wholes. Show the source fractions and meaningful names (“First fraction”, “Second fraction”). Prompt: **“Which amount is greater, or are they the same?”** Offer a relation group and a **Check** button. |
| Recovery | Keep the prompt, bars, and all three choices. For a wrong submitted response, say: **“Look at the shaded amounts in the same-size wholes. Try again.”** The learner may change a choice and Check again. Do not diagnose a misconception from one response, remove an option, change the schedule, or claim guessing has been prevented. |
| Requested help | Keep help optional and concise: **“Each bar shows one same-size whole. Compare the shaded amounts.”** The help identifies what to inspect without giving the relation. Record that help was requested as assistance provenance, not as a mastery judgment. |
| Accepted result | Retain both models and source forms. State the accepted relation once in words and notation, e.g. **“The first amount is greater. `2/3 > 3/5`.”** Equality uses the same grammar: **“The amounts are equal. `4/6 = 6/9`.”** Then offer the existing learner-triggered **Next problem**. At the end of the fixed set, offer **Back to start** directly. |

### Relation control and participation

Recommend one three-option native radio group with a visible prompt and full labels:

- **First fraction** (spoken label: “First fraction is greater”; submitted relation: greater)
- **Same amount** (spoken label: “Both fractions show the same amount”; submitted relation: equal)
- **Second fraction** (spoken label: “Second fraction is greater”; submitted relation: less)

Selection remains a draft until deliberate **Check**. The prompt supplies the comparison question, so the visible labels need not repeat it in three full sentences. Full spoken labels retain direction and equality; bare glyphs are not the pre-answer control. “Less” and “greater” in submitted state always compare the first fraction with the second, independently of option order. One selected relation is the learner’s complete judgment. Resolution may then display the corresponding symbolic statement automatically, with no second learner decision.

Use keyboard-operable native radio behavior and a visible Check button. Make the full option rows at least `44 × 44 CSS px` tall/tappable, in line with the adopted Plan 37 number-line target precedent. If three rows do not fit side-by-side at a 360px viewport, stack them. No drag, precise pointing, or bar-segment interaction is required. Rendered review must check text wrapping, spacing, focus order, and touch geometry at 360px and a Chromebook-sized viewport; the proposal alone does not establish those dimensions.

The linear/accessibility path must expose the same task: name both source forms and each equal whole, describe numerator shaded parts among denominator equal parts, then offer the same first/second/same-amount relation options and Check. Do not announce “larger”, “smaller”, a benchmark region, a correct relation, or a checkmark state before a submitted response is accepted. Equivalent information remains available in accessible names after acceptance. A screen-reader user is not asked to infer a symbol’s direction from `<` or `>` alone.

### Worked journeys

**Journey A — recovery on a larger-numbers trap.** The screen shows `2/3` and `3/5` as shaded portions of equally wide wholes. The learner selects “Second fraction” and presses Check. Recovery says, “Look at the shaded amounts in the same-size wholes. Try again.” Both amounts stay visible and all choices remain enabled. The learner revises to “First fraction” and checks again. The accepted result retains the models and reads “The first amount is greater. `2/3 > 3/5`.” The next control advances one vetted item with fresh task state.

**Journey B — equality across unreduced forms.** The screen shows `4/6` and `6/9`, each in its own same-width whole. The shaded lengths end at the same location. The learner selects “Same amount” and checks. The accepted result says “The amounts are equal. `4/6 = 6/9`.” The learner can inspect both original forms and then choose Next. The equality response remains a full relation outcome; it is not a failed greater/less question.

The recovery wording and journeys are proposed copy, not rendered acceptance. No response removes another option, and no single wrong response is treated as evidence of a named misconception. Three options remain guessable; varied authored cases and non-punitive retries are design safeguards, not an anti-guessing guarantee.

## Illustrative exact-checked set

The proposed first authored batch contains **12 ordered pairs**, four exact outcomes per relation. Every displayed source denominator is at most 10; all entries are positive proper fractions. Ordered pairs are preserved because “first” and “second” are part of the response meaning. Same-denominator and same-positive-numerator cases illustrate useful amount comparisons inside the same task, without creating additional recipes.

| Item | First | Second | Exact relation | What it illustrates |
|---|---:|---:|---|---|
| Larger-integers trap | `2/3` | `3/5` | greater | Both integers in the second fraction are larger; its amount is smaller. |
| Larger-integers trap, swapped | `3/5` | `2/3` | less | Operand-order reversal changes the relation label. |
| Unreduced equality | `4/6` | `6/9` | equal | Equal values with distinct unreduced source forms. |
| Unreduced equality, swapped | `6/9` | `4/6` | equal | Equality remains equality under operand swap. |
| Equal integer gaps | `3/4` | `5/6` | less | Both denominator-minus-numerator gaps are 1 although the values differ. |
| Equal integer gaps, swapped | `5/6` | `3/4` | greater | Same pair makes relation orientation visible. |
| Smaller-gap trap | `2/3` | `7/10` | less | First gap is 1 and second gap is 3, yet the first amount is smaller. |
| Same denominator | `3/8` | `5/8` | less | Equal-size parts; shaded-part count distinguishes amount. |
| Same positive numerator | `3/5` | `3/7` | greater | Equal positive counts; fifths are larger parts than sevenths. |
| Smaller-gap trap, swapped | `7/10` | `2/3` | greater | Reverses the gap example without changing the underlying pair. |
| Equivalent forms | `4/8` | `1/2` | equal | Equivalent source forms with unlike denominators. |
| Equivalent forms, swapped | `1/2` | `4/8` | equal | Equality and order preservation. |

The relations and conversions in this table were derived with `createFraction`, `compareFractions`, `leastCommonDenominator`, and `convertToDenominator` from `src/math/index.js`. See the reproducible scoped probe [exact-examples.mjs](evidence/exact-examples.mjs) and its generated [exact-examples.json](evidence/exact-examples.json). The probe derives the 4/4/4 balance and checks that the common-unit conversions preserve exact relation; it contains no expected-answer table.

The converted forms are audit evidence only; this task does not display or ask learners to construct them. One audit conversion, `3/5` and `3/7` to denominator 35, exceeds the current Phase 2 fraction-bar ceiling. Its two source bars, with denominators 5 and 7, remain within that ceiling. This is why comparison-task eligibility must check the representations actually used, rather than reject every pair whose LCD would be too large for a common-unit bar.

### Proposed first-slice eligibility

- Accept only positive proper fraction source forms (`0 < numerator < denominator`) for this first slice.
- Limit each source denominator to 10 in the initial fixed batch. This is a conservative slice bound below the current Phase 2 bar ceiling (`maxDenominator: 30`); it is not a claim that every denominator through 30 is readable at every viewport.
- Give both bars the same whole width and the same left-to-right origin. Each bar partitions its own whole into the denominator’s equal pieces and shades the source numerator count. No reversed shading, unequal wholes, or answer-obscuring offset is permitted.
- Compute relation and any equality identity from exact math. The authored record contains intent and source forms, not an answer key.
- Do not require a common denominator, a benchmark classification, or a simplified display form for eligibility. The comparison does not depend on a shared partition count.
- Keep task eligibility, representation capability, and support as separate validation results. A future broader denominator range requires actual visual and accessible capacity evidence; a number-line capability is not inferred from this bar task.

The 12 examples cover all three relations, swaps, unreduced equality, a larger-integers counterexample, equal numerator/denominator-gap cases, and same-denominator/same-positive-numerator comparisons. They do not test zero numerators, improper fractions, mixed numbers, values above one, arbitrary denominator capacity, or learner transfer to symbolic-only comparison. Those remain outside this first task.

## First implementation contract recommendation

Owner adoption of the learner task, relation grammar, and support consequences must precede any implementation packet. If adopted, a first packet should own a single proper-fraction comparison recipe and the 12-item fixed batch below. It should not add a generic strategy planner, common-unit construction, line comparison, a compare-and-difference operation, or adaptive selection.

### State and source boundaries

1. **Math:** Reuse `compareFractions` and, where content validation needs a mathematical identity, `simplifyFraction`. Both are pure exact APIs. Do not add a new arithmetic `operation: 'compare'`; relation is an instructional task. The current `createFraction` domain is nonnegative values with positive denominators, and this slice narrows that further to positive proper fractions.
2. **Authored task content:** Add a small comparison-specific record and validator near the current content task modules. Proposed record fields are `itemId`, `authoringRevision`, `taskDataId/revision`, `recipeId/revision`, ordered `first`/`second` source fraction wires, and declared purpose `direct-honest-bar-reading`. The record must not store `expectedRelation` or a correctness flag. A validator should derive exact relation, proper-fraction eligibility, source-denominator bound, and equal-whole-bar eligibility from the inputs.
3. **Source form vs. identity:** Preserve each unreduced source form exactly for learner display and replay. Derive a normalized rational identity separately through the math core for equality and duplicate checks; never replace authored/displayed `4/6` or `6/9` with a simplified form. Preserve order in item and replay identity, because swapping operands changes `<` to `>`.
4. **Instruction and response:** Add a bounded comparison task definition/schedule and a `less | equal | greater` submitted response classification using exact expected relation. Keep response correctness upstream of presentation. Make the response preview a draft until explicit Check; classify a wrong submitted choice for local recovery without changing the fixed item schedule or support configuration.
5. **Scene:** Extend the scene contract with the two source amounts, honest equal-whole bar data, prompt/control semantics, assistance state, draft/submitted relation, and accepted result. Before accepted response, the scene contains no correctness-bearing relation field or selected-answer marker. The same invariant must hold in the accessible/linear projection. Expected truth may live in instructional state for classification; ordinary presentation/accessibility projections may not reveal it before Check and acceptance.
6. **Rendering and ownership:** Reuse current symbolic-fraction and fraction-bar presentation primitives where their contracts fit. Add one comparison response region/control, rather than comparison branches inside unrelated arithmetic controls. The visual and linear renderers consume validated scene data and dispatch raw learner intent; they do not call math APIs. Follow Plan 42 ownership: app owns draft capture/reset, view choice, help-open state, and focus timing; the response region owns current control composition and raw intent wiring; the renderer shell owns recovery feedback. Do not perform a broad response-framework extraction for this slice.
7. **Progression:** One accepted relation directly yields the useful result and local Next action. Use Plan 43’s accepted progression/return behavior for the fixed set: one learner activation advances to the next distinct vetted identity with fresh state; after the final result, Back to start appears directly. Do not add an empty Finish acknowledgment.

### More/Less support consequences

Use the two currently registered choices, **More support** (`high-support`) and **Less support** (`medium-support`). Do not register a Low or independent profile. For this model-reading task, both levels retain the same two honest models, exact fraction labels, equal-whole meaning, three full relation choices, explicit Check, and 44px touch affordance. Removing the models under Less support would change the mathematical task into symbolic comparison, so it is outside this contract.

Recommend a task-local cue difference while preserving the same decision: More support starts with the short unit cue, “Each bar shows one same-size whole,” and keeps the concise on-demand help immediately available. Less support opens with the shorter question and leaves the same help available on request. Both access paths must receive the mathematical information each sighted bar conveys, even when Less support uses less visual coaching. Keep the item set, relation distribution, bar geometry, retry rule, and schedule fixed across support levels. Never infer learner skill, choose examples adaptively, or use support selection as a denominator-capacity proxy.

The registered support profiles currently define broad dimensions such as `fractionBarModel`, `commonDenominator`, and `helpAndReplay`; the comparison-specific cue contract does not exist. A source packet should map the cue difference locally and explicitly, avoiding a global dimension change unless implementation evidence shows that the current configuration cannot express it cleanly. Review both profiles in mounted visual and linear use before claiming parity.

### Recovery and acceptance cases

The first source slice should be accepted against named behavior, not only DOM presence:

- Every authored item derives one exact `<`, `=`, or `>` relation from current math APIs; all 12 records pass task and representation eligibility.
- The selected 12-item batch has exactly four examples per relation, preserves each ordered item identity, and includes both heuristic counterexamples plus unreduced equality and swaps.
- Before Check, neither visual nor linear scene/projection reveals the relation, a correct option, or relation-specific feedback. The intended bars and their full source descriptions are available.
- A correct selection is only accepted after Check, then resolves to the exact words/symbols while retaining the models and original forms. Equality resolves and progresses normally.
- A wrong Check shows concise non-answer-bearing recovery, preserves the current item and all choices, permits a changed retry, and records the actual submitted attempt/help provenance without mastery claims.
- Keyboard can select each option and Check; touch can activate full 44px rows and Check without dragging; focus returns to the intended active control after recovery and moves to the result/Next path after acceptance.
- Both More/Less configurations keep the same mathematical task and fixed schedule while applying their adopted prompt/help cue. Resizing and 200% zoom must not hide the models, choices, or Check.
- Next advances exactly one item to fresh encounter state; the last item offers Back to start directly.
- Replay reconstructs old tasks unchanged and reconstructs the new task from stable authored identity and original forms. The future schema decision must be made against the actual implementation baseline; no replay version is assigned here.

Separate future evidence branches: deterministic math/content checks for every authored record; mounted visual and linear checks for response/recovery/progression; rendered accessibility and geometry checks at narrow and Chromebook layouts; and owner review of final copy/visual fidelity. Use the gap, equality, swap, and same-denominator seeds above as discriminating records. A screenshot or unit test alone cannot establish physical-device behavior, assistive-technology compatibility, learner understanding, or engagement.

## Current source and compatibility trace

The inspection was bounded to the seams below. Current behavior is stated at inspected HEAD `0a5904f`; filenames and schema labels in the Phase 4 notes were treated as leads and checked against current files.

| Layer | Current evidence | Consequence for the proposed slice |
|---|---|---|
| Exact math | `src/math/fraction.js` exports `compareFractions`, `equalFractions`, `leastCommonDenominator`, `convertToDenominator`, `benchmarkFraction`, and `compareToBenchmark`; `src/math/classify.js` exports `classifyMagnitude`. `src/math/index.js` re-exports these. `createFraction` accepts nonnegative numerator / positive denominator and preserves the input form; `simplifyFraction` is explicit. | Exact magnitude comparison already exists. A common-denominator student construction is not necessary for truth. No new compare arithmetic operation is needed. |
| Content and eligibility | `src/content/family-definitions.js` registers addition and subtraction families only. `src/content/eligibility.js` exposes Phase 2 bar limits of denominator 30 and scale factor 12, and validates operation-specific common-denominator paths. Existing task-specific modules show how a small authored identity/context can be resolved and checked. `src/content/schema.js` keeps wire source forms, while `formKey`/`canonicalSerialize` preserve raw JSON form rather than normalize mathematical equivalence. | There is no comparison record or comparison eligibility contract. Add a bounded task-specific content path; preserve raw forms and derive a separate normalized identity. The existing LCD/scale validator is not a comparison-task eligibility validator. |
| Instruction and schedule | `src/interaction/episode-definition.js` registers arithmetic tasks plus Plan 37’s distinct bar-to-line family. `src/interaction/beat-schedule.js` has explicit family branches and the generic route rejects operations outside `add`/`subtract`. `src/interaction/classification.js` contains conversion, operation-result, reflection and premise classifiers, but no magnitude-relation response classifier. | A new comparison task can have its own fixed compare response schedule and classifier. Do not force a comparison learner task through the arithmetic operation enum or the addition/subtraction beats. |
| Scene and rendering | `src/interaction/scene.js` validates/project-scopes task meaning, support consequences, current-task identity, operation meaning and a specific Plan 37 number-line meaning. `src/render/fraction-bar.js` renders mathematical parts from scene data; `src/render/symbolic.js` supplies accessible fraction notation; `src/render/controls.js` supplies buttons, fraction input and a fieldset choice builder. `src/render/beat-container.js` and `src/render/linear-path.js` host active visual and linear paths. | Reuse math-neutral bar/fraction primitives where their current contracts fit, and add a bounded relation group. Add scene leakage rules for the intentionally model-visible relation task. Do not move relation calculation into renderer code. The existing generic choice helper creates buttons, so a native radio group may need a focused control addition. |
| Support and response ownership | `src/app/support-levels.js` registers only More/high and Less/medium. `src/interaction/support.js` has six generic dimensions; the medium profile lowers `fractionBarModel` and `commonDenominator`, while other dimensions remain high. Plan 42’s [`ownership-map.md`](../plan-42-operate-response-ownership-pilot/ownership-map.md) assigns draft/focus/help policy to app, current controls/raw intents to the region, and recovery feedback to the shell. | Support is already two-level and multidimensional; there is no comparison-specific cue. Preserve bars and response across both support levels, map one local cue difference, and retain Plan 42's state/control ownership instead of adding global framework state. |
| Replay and identity | `src/interaction/replay.js` currently defines replay versions v1–v8. v7 is bridge-only; v8 is the Plan 39 bridge-repair definition. Replay identity validation preserves authored source forms and reconstructs registered content/definition revisions. | A comparison definition/content identity is absent. Preserve all existing envelopes and fixtures. The next version or use of an existing task-context version is an implementation-gate decision after a concrete baseline; this dossier assigns no version number. |

The Phase 4 notes’ broad claim that exact compare APIs already exist is confirmed. Their old inventory is incomplete for present replay versions and current task-specific paths; it is not copied as a current version contract. The claim that the existing content operation family admits comparison is false at this HEAD. The source confirms reusable exact math and representation primitives with bounded, expected gaps in task admission, response state, scene meaning, control wiring, and replay identity.

### Plan 39 boundary

Plan 39 source contains a bar-to-line task, dedicated renderer, app wiring, and replay v7/v8 support. Repair 04 implementation is recorded, but the latest technical finishing review identifies an unresolved tray-shrink/axis-jump defect; Plan 39 remains in progress, with technical and owner rendered acceptance and deployment still gated. Its number-line task is not described here as accepted rendered behavior. Plan 37’s 0-to-1 design is owner-adopted, while its documented prerequisites and wider-denominator/multi-whole obligations remain. Plan 43’s owner acceptance is complete and supports direct Next/final return, subject to the technical review’s recorded coverage limits. Any comparison-to-line task, line-based benchmark slice, or Plan 39 dependent source work remains a later, separately approved packet after Plan 39 closure.

## Later seams, owner decisions, and evidence limits

Retain these separate seams without activating them:

- **Benchmark-to-line comparison:** revisit only after Plan 39 closure and a separate design/source packet. Keep line domain, density, exact location choices, accessibility and bar-to-line transfer explicit.
- **Comparison then unsigned distance:** later design may ask “How far apart are these amounts?” and derive `max(a,b) − min(a,b)` with exact nonnegative subtraction. Preserve original operand labels, include zero distance, and do not let order appear as an assumption in the prompt.
- **Crossing-one / multi-whole / improper / mixed values:** retain the Phase 3 follow-up obligations and Phase 5 domain gates. The current proper-fraction task does not prove a `[0,2]` line, mixed comparison, signed subtraction, or transfer across wholes.
- **Broader denominator coverage:** no automatic increase follows from the exact core or a future number line. Measure rendered bar readability and accessible parity at actual viewport/zoom before extending beyond the first batch.
- **Independent symbolic comparison or method choice:** useful later if the learning objective is method selection or symbolic magnitude reasoning. Do not fold either into this model-reading response or count the model-reading task as evidence for symbolic independence.

Recommend the owner adopt the following answers before any source packet:

1. Adopt the direct honest-bar model-reading task as the first comparison purpose, with one `less/equal/greater` judgment and the 12 ordered, exact-checked examples as a bounded initial set. Choosing common-unit construction instead adds a separate conversion responsibility and requires its own target/partition eligibility decision.
2. Adopt full spoken first/second/equal relation labels, keyboard-operable radio choices, deliberate Check, and at least 44px touch rows. This keeps relation meaning explicit without asking for a second symbol-direction judgment.
3. Use both existing More/Less levels with identical models, choices, batch and fixed schedule; More includes a short unit cue and readily available optional help, Less uses the shorter prompt and the same on-demand help. Do not add Low support or couple support to denominator size.
4. Keep line comparison, common-unit construction, and compare-and-distance as future recipes. No new arithmetic compare operation or replay version is adopted by Plan 44.

If the owner selects a task whose purpose is independent symbolic comparison, the visible models must move to post-response verification and the source task/scene contract must change accordingly. That choice would be a different task intent and should be resolved before implementation.

**Evidence limits:** The exact probe establishes the mathematical relations and conversion invariance for these examples. Code tracing establishes reusable APIs and current architectural seams. Neither proves model readability at target layouts, screen-reader operation, the best learner copy, that one support cue is preferable, anti-guessing effectiveness, comprehension, persistence, or transfer. The existing Phase 4 notes/reviews and accepted Plan 29/37/42/43 artifacts are the primary design evidence reused here; no broad literature search, new learner observation, product prototype, browser capture, build, or learner study was conducted.

## Review disposition

Advisor consultation was not warranted for this report-only investigation. The scoped `.mjs` file is a disposable exact-math evidence probe with no product/runtime behavioral surface. Orchestrator review and owner design adoption remain required before any implementation packet.

## Orchestration copy refinement (2026-10-31)

After delivery, orchestration shortened the visible option rows to First fraction / Same amount / Second fraction while preserving full spoken meaning and explicit first-relative-to-second state mapping. It also corrected the shared-whole wording to same-size wholes. These are recommended copy refinements for owner adoption, not a changed mathematical task or accepted product surface. Avoid adding separate headings or explanations that repeat the active question.
