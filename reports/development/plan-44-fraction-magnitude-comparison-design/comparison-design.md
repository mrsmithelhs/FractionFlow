# Plan 44 — Fraction Magnitude Comparison Task and First-Slice Design

**Source review baseline:** `0a5904f46980f3438323a7d8fba893b4a329b771`; scoped modules rechecked unchanged through `3677b51c82d011a39705fd1291a6d0c6d1b13a35` (2026-10-31)
**Scope approval:** [Requirement 0 approval](scope-approval.md)
**Status:** Recommended design for orchestration and owner disposition. This document does not adopt the task or authorize source work.

## Revision 1 recommendation

Start with one short **symbolic-first proper-fraction comparison** task. Keep both original fractions visible in stacked notation. Ask the learner to select one direct relation, `<`, `=`, or `>`, then press **Check**. Offer optional help: a concise comparison hint and a learner-selected source model for either operand. Before acceptance, at most one source bar is visible at a time. After acceptance, show both honest, same-size bars together as verification and offer direct progression.

This addresses the owner's concern with two pre-answer endpoints: the aligned pair appears only after the learner's independent symbolic judgment is accepted. A single requested model can anchor unit size, part count, or position relative to one-half, while the other source fraction stays symbolic. One model is a reasoning aid, not a complete comparison algorithm; a small authored hint makes useful next thought explicit for close or equivalent cases. No model is shown automatically, and no blank comparison bar is used.

Defer common-unit construction as the required task. Its learner contribution is valid when the explicit purpose is renaming, but it would add a conversion response before comparison. Keep a shared-unit hint available for close pairs such as `2/3` vs. `3/5`; the learner can use existing equivalence knowledge without a new mandatory conversion beat. Plan 39 is now closed, but benchmark-line comparison still requires a separate adopted task and source packet. The selected set includes a symbolic separating-benchmark example (`3/8 < 1/2 < 5/9`) that does not require drawing its LCD of 72.

This is a design recommendation, not evidence that symbolic-first work or one-model help produces stronger learning or transfer. The earlier direct aligned-bar recommendation was not owner-adopted. Its technical delivery review accepted the evidence and architecture trace, not the pedagogical task choice; the owner feedback now governs this revision.

## Learner flow and copy

Use one interactive comparison response. Do not ask for a verbal “first/same/second” choice after an inequality choice, or a second symbol conversion after a verbal choice. Do not add an encounter acknowledgment.

| State | Proposed experience |
|---|---|
| Compare | Show both original stacked fractions and first/second names. Prompt: **“Compare these fractions. Choose `<`, `=`, or `>`.”** Offer one relation group and **Check**. No model is initially shown. |
| Model request | Two optional controls say **“Model first fraction”** and **“Model second fraction.”** Either shows one honest fraction bar with a labeled whole and a one-half reference. Choosing the other replaces the current bar in the same region; both source expressions remain visible, but two source bars never appear before acceptance. Model selection is assistance, not an answer or response. |
| Useful hint | A task-authored hint names a next reasoning move, such as **“Can one half separate these amounts?”**, **“Both fractions count three parts. Compare the size of each part.”**, or **“These amounts are close. Could same-size parts help?”** Hints remain optional, do not fill in the relation, and do not insert a conversion-response beat. |
| Recovery | Keep the symbols, current single model (if requested), hint state, and all three relation choices. For a wrong submission, say: **“Check how the two amounts compare. You can revise your choice or inspect one fraction.”** The learner can change the relation, switch the one visible model, and Check again. Do not diagnose a misconception, disable a choice, change the schedule, or claim guessing has been prevented. |
| Accepted result | Retain the original source forms and selected relation. Show the truthful aligned pair of same-size bars only after acceptance, with a concise message such as **“The first amount is greater. `2/3 > 3/5`.”** For equality, show **“The amounts are equal. `4/6 = 6/9`.”** Then offer Plan 43's learner-triggered **Next problem**; after the fixed set, offer **Back to start** directly. |

### Relation control and participation

Compare the two candidate controls:

| Control | Benefit | Tradeoff |
|---|---|---|
| Direct `<`, `=`, `>` choice (recommended) | The single response records the relation in the notation being practiced and directly links a magnitude decision to its symbolic comparison. | Children may reverse `<` and `>` even when their magnitude judgment is sound; full meanings, clear operand order, and optional notation help are needed. |
| “First fraction” / “Same amount” / “Second fraction” | Shorter labels express which amount is greater without relying on glyph direction. | Symbolic inequality appears only in feedback, so this response does not ask learners to select the relation notation. It remains a valid owner alternative if reducing symbol-direction demand is the priority. |

Recommend one native radio group that shows each complete comparison, such as `2/3 < 3/5`, with a short visible meaning and full accessible name: “First fraction is less than the second”; “The fractions are the same amount”; “First fraction is greater than the second.” Keep first/second order stable. Selection stays a draft until deliberate **Check**. The optional notation hint is **“The open side faces the greater amount.”** It explains symbol direction without identifying the correct option. The accepted response itself is the one symbolic relation judgment; there is no separate verbal choice.

Use keyboard-operable native radio behavior and a visible Check button. Make option targets at least `44 × 44 CSS px` in line with the adopted Plan 37 target precedent. If labeled choices do not fit side-by-side at 360px, stack them. No drag, precise pointing, or bar-segment interaction is required. Rendered review must check text wrapping, spacing, focus order, model switching, and touch geometry at 360px and a Chromebook-sized viewport; this proposal establishes no rendered result.

The linear/accessibility path exposes both source forms in reading order and the same inequality response, with full spoken meanings rather than isolated glyphs. Model controls identify which one source fraction they will show; the selected model announces its whole, equal-part count, shaded-part count, and half benchmark. Switching models replaces that description and invalidates the previous model. Before acceptance, neither path announces the expected relation, a correct option, or correctness feedback. After acceptance, both paths expose the full comparison and aligned verification models. Visual, keyboard, touch, and screen-reader participation all retain the single magnitude judgment.

### Worked journeys

**Journey A — close pair, one model, useful help, and recovery.** The screen begins with `2/3` and `3/5`, no bars, and the three direct inequality choices. The learner requests a model for the first fraction; one bar for `2/3` appears. A hint says, “These amounts are close. Could same-size parts help?” The learner selects `2/3 < 3/5` and presses Check. Recovery says, “Check how the two amounts compare. You can revise your choice or inspect one fraction.” The learner requests the second model; `3/5` replaces `2/3` in the single model region while the original choice remains editable. The learner recognizes `2/3` and `3/5` as `10/15` and `9/15`, changes to `2/3 > 3/5`, and Checks. Only after acceptance do both honest aligned bars appear beside the retained source forms, followed directly by Next.

**Journey B — a separating benchmark.** The screen begins with `3/8` and `5/9`; no relation is shown. The learner requests a model for the first fraction, which shows `3/8` below the labeled one-half reference. The optional hint asks, “Can one half separate these amounts?” The learner reasons that `5/9` is above one-half and selects `3/8 < 5/9`. Check accepts the single relation judgment. The system then shows the aligned bars and the accepted result. The denominator-72 audit conversion is not shown; the learner used a separating benchmark, not a constructed denominator.

Equality remains explicit. For `4/6` and `6/9`, a requested model can anchor either source amount; optional help asks whether the two names could describe the same amount. One `=` selection resolves the task without a separate equivalence response. Copy and journeys remain proposals, not rendered acceptance. No choice is removed after an error; three options remain guessable, and no anti-guessing or efficacy claim is made.

## Illustrative exact-checked set

The proposed first authored batch contains **12 ordered pairs**, four exact outcomes per relation. Every source denominator is at most 10; all entries are positive proper fractions. The set includes same-unit, same-count, equal-gap, shared-benchmark, equivalent-value, and larger-integer reasoning. Ordered pairs are preserved because first/second order is part of the relation response.

| Item | First | Second | Exact relation | What it illustrates |
|---|---:|---:|---|---|
| Larger-integers trap | `2/3` | `3/5` | greater | Both integers in the second fraction are larger; its amount is smaller. |
| Same denominator, swapped | `5/8` | `3/8` | greater | Reversing same-unit operands reverses the relation. |
| Unreduced equality | `4/6` | `6/9` | equal | Equal values with distinct unreduced source forms. |
| Unreduced equality, swapped | `6/9` | `4/6` | equal | Equality remains equality under operand swap. |
| Equal integer gaps | `3/4` | `5/6` | less | Both denominator-minus-numerator gaps are 1 although the values differ. |
| Equal integer gaps, swapped | `5/6` | `3/4` | greater | Same pair makes relation orientation visible. |
| Smaller-gap trap | `2/3` | `7/10` | less | First gap is 1 and second gap is 3, yet the first amount is smaller. |
| Same denominator | `3/8` | `5/8` | less | Equal-size parts; shaded-part count distinguishes amount. |
| Same positive numerator | `3/5` | `3/7` | greater | Equal positive counts; fifths are larger parts than sevenths. |
| Separating-half benchmark | `3/8` | `5/9` | less | `3/8 < 1/2 < 5/9`; benchmark reasoning settles the relation. |
| Equivalent forms | `4/8` | `1/2` | equal | Equivalent source forms with unlike denominators. |
| Equivalent forms, swapped | `1/2` | `4/8` | equal | Equality and order preservation. |

The relations, conversions, and half-benchmark case were derived with `createFraction`, `compareFractions`, `compareToBenchmark`, `leastCommonDenominator`, and `convertToDenominator` from `src/math/index.js`. See the scoped probe [exact-examples.mjs](evidence/exact-examples.mjs) and [exact-examples.json](evidence/exact-examples.json). It derives the 4/4/4 balance and checks common-unit relation preservation; it contains no expected-answer table.

Converted forms are audit evidence only; the task does not display or require their construction. `3/8` and `5/9` have an audit LCD of 72, beyond the current Phase 2 bar ceiling of 30, yet the source fractions are within the proposed symbolic task's denominator bound and are compared by the separating half benchmark. `3/5` and `3/7` also have an LCD of 35; those source forms remain eligible for the direct relation task. Eligibility must follow the representation actually used.

### Proposed first-slice eligibility

- Accept only positive proper fraction source forms (`0 < numerator < denominator`) for this first slice.
- Limit each source denominator to 10 in the initial fixed batch. This is a conservative slice bound below the current Phase 2 bar ceiling (`maxDenominator: 30`); it is not a claim that every denominator through 30 is readable at every viewport.
- Before acceptance, render no model by default. If requested, show only the selected source fraction as one ordinary left-to-right bar of a labeled unit whole, optionally with a truthful one-half reference mark. Switching from first to second replaces the current bar; it never accumulates a second source model. After acceptance, render both models on equal-width wholes with the same left-to-right origin. No reversed shading, unequal wholes, or answer-obscuring offset is permitted.
- Compute relation and any equality identity from exact math. The authored record contains intent and source forms, not an answer key.
- Do not require a common denominator, a benchmark classification, or a simplified display form for eligibility. The comparison response does not depend on a shared partition count; optional authored hints can suggest a benchmark, shared unit, same-unit count, same-count unit-size, or equivalence check.
- Keep task eligibility, representation capability, and support as separate validation results. A future broader denominator range requires actual visual and accessible capacity evidence; a number-line capability is not inferred from this bar task.

The 12 examples cover all three relations, swaps, unreduced equality, a larger-integers counterexample, two denominator-gap traps, same-denominator/same-positive-numerator reasoning, and one separating-half case. They do not test zero numerators, improper fractions, mixed numbers, values above one, arbitrary denominator capacity, or learner transfer beyond this fixed symbolic-first task. Those remain outside this first slice.

## First implementation contract recommendation

Owner adoption of the learner task, relation grammar, and support consequences must precede any implementation packet. If adopted, a first packet should own a single proper-fraction comparison recipe and the 12-item fixed batch below. It should not add a generic strategy planner, common-unit construction, line comparison, a compare-and-difference operation, or adaptive selection.

### State and source boundaries

1. **Math:** Reuse `compareFractions` and, where content validation needs a mathematical identity, `simplifyFraction`. Both are pure exact APIs. Do not add a new arithmetic `operation: 'compare'`; relation is an instructional task. The current `createFraction` domain is nonnegative values with positive denominators, and this slice narrows that further to positive proper fractions.
2. **Authored task content:** Add a small comparison-specific record and validator near the current content task modules. Proposed record fields are `itemId`, `authoringRevision`, `taskDataId/revision`, `recipeId/revision`, ordered `first`/`second` source fraction wires, symbolic-first purpose, and an optional authored `helpCueId`. The record must not store `expectedRelation` or a correctness flag. A validator should derive exact relation, proper-fraction eligibility, source-denominator bound, and single-source-model eligibility from the inputs.
3. **Source form vs. identity:** Preserve each unreduced source form exactly for learner display and replay. Derive a normalized rational identity separately through the math core for equality and duplicate checks; never replace authored/displayed `4/6` or `6/9` with a simplified form. Preserve order in item and replay identity, because swapping operands changes `<` to `>`.
4. **Instruction and response:** Add a bounded comparison task definition/schedule and a `less | equal | greater` submitted response classification using exact expected relation. Keep response correctness upstream of presentation. Make the response preview a draft until explicit Check; classify a wrong submitted choice for local recovery without changing the fixed item schedule or support configuration.
5. **Scene:** Extend the scene contract with the two source amounts, optional single-source bar selection/model, prompt/control semantics, assistance state, learner's draft/submitted relation, and accepted verification result. Before acceptance, the scene may carry the learner's own selected relation and one requested model; it must not carry correctness status, expected relation, or relation-specific feedback. After acceptance, it may carry the accepted relation and paired aligned verification models. Apply the same information boundary to the accessible/linear projection. Expected truth belongs upstream for classification; the renderer never computes it.
6. **Rendering and ownership:** Reuse current symbolic-fraction and fraction-bar presentation primitives where their contracts fit. Add one comparison response region/control, rather than comparison branches inside unrelated arithmetic controls. The visual and linear renderers consume validated scene data and dispatch raw learner intent; they do not call math APIs. Follow Plan 42 ownership: app owns draft capture/reset, view choice, help-open state, and focus timing; the response region owns current control composition and raw intent wiring; the renderer shell owns recovery feedback. Do not perform a broad response-framework extraction for this slice.
7. **Progression:** One accepted relation directly yields the useful result and local Next action. Use Plan 43’s accepted progression/return behavior for the fixed set: one learner activation advances to the next distinct vetted identity with fresh state; after the final result, Back to start appears directly. Do not add an empty Finish acknowledgment.

### More/Less support consequences

Use the two currently registered choices, **More support** (`high-support`) and **Less support** (`medium-support`). Do not register a Low or independent profile. Both levels begin with the same symbolic operands and direct inequality response. Both may request the same single source model, authored task hint, full accessibility meaning, 44px controls, and fixed batch. Model switching always replaces the prior model; support does not permit two simultaneous pre-answer source bars.

More support may include a brief, non-answering cue that offers a comparison move, such as “Try a benchmark or a shared unit. You can model one amount.” Less support opens with the shorter comparison prompt and leaves those same supports available by request. The task-local hint remains authored and specific to the item; no hint or model is automatically selected from a learner's past response. Keep item order, relation distribution, response grammar, retry rule, and model-switching rule fixed across support levels. Do not use support as a denominator-capacity or mastery proxy.

The registered profiles currently define broad dimensions such as `fractionBarModel`, `commonDenominator`, and `helpAndReplay`; a comparison-specific cue contract does not exist. A source packet should project the chosen support cue downstream from instructional configuration through scene meaning. The renderer must not invent support policy. Preserve Plan 42 ownership: the app owns help-open state/draft/focus policy; the response region owns model/help controls and raw intents; the shell owns recovery feedback. Review both profiles in mounted visual and linear use before claiming parity.

### Recovery and acceptance cases

The first source slice should be accepted against named behavior, not only DOM presence:

- Every authored item derives one exact `<`, `=`, or `>` relation from current math APIs; all 12 records pass task and representation eligibility.
- The selected 12-item batch has exactly four examples per relation, preserves each ordered item identity, and includes both heuristic counterexamples plus unreduced equality and swaps.
- Before Check, neither visual nor linear scene/projection reveals the expected relation, correctness status, or relation-specific feedback. Both source forms remain visible; a requested model shows at most one source amount.
- Selecting first/second source model replaces the current model, does not submit a relation, and does not alter the response draft or schedule. The model’s accessible description matches the rendered value and benchmark marks.
- A relation selection is only evaluated after Check. Correct relation resolves to words/symbols and then reveals the aligned pair with original forms. Equality resolves and progresses normally.
- A wrong Check shows concise non-answer-bearing recovery, preserves the current item and all choices, permits changed response/model selection, and records actual submitted attempt/help provenance without mastery claims.
- Keyboard can select each relation and Check; touch can activate full 44px rows and Check without dragging; focus returns to the intended active control after recovery and moves to the result/Next path after acceptance.
- Both More/Less configurations keep the same symbolic task and fixed schedule while applying their adopted cue. Resizing and 200% zoom must not hide operands, choices, a requested model, or Check.
- Next advances exactly one item to fresh encounter state; the last item offers Back to start directly.
- Replay reconstructs old tasks unchanged and reconstructs the new task from stable authored identity and original forms. The future schema decision must be made against the actual implementation baseline; no replay version is assigned here.

Separate future evidence branches: deterministic math/content checks for every authored record; mounted visual and linear checks for response/recovery/progression; rendered accessibility and geometry checks at narrow and Chromebook layouts; and owner review of final copy/visual fidelity. Use the gap, equality, swap, and same-denominator seeds above as discriminating records. A screenshot or unit test alone cannot establish physical-device behavior, assistive-technology compatibility, learner understanding, or engagement.

## Current source and compatibility trace

The initial bounded source trace was at `0a5904f`. At revision time, HEAD is `3677b51c82d011a39705fd1291a6d0c6d1b13a35`; a scoped diff confirmed the math/content/interaction/support/bar/control files listed below have no changes since that trace. The current Plan 39 packet and owner-acceptance records were refreshed separately. Filenames and schema labels in the Phase 4 notes were treated as leads and checked against source.

| Layer | Current evidence | Consequence for the proposed slice |
|---|---|---|
| Exact math | `src/math/fraction.js` exports `compareFractions`, `equalFractions`, `leastCommonDenominator`, `convertToDenominator`, `benchmarkFraction`, and `compareToBenchmark`; `src/math/classify.js` exports `classifyMagnitude`. `src/math/index.js` re-exports these. `createFraction` accepts nonnegative numerator / positive denominator and preserves the input form; `simplifyFraction` is explicit. | Exact magnitude comparison already exists. A common-denominator student construction is not necessary for truth. No new compare arithmetic operation is needed. |
| Content and eligibility | `src/content/family-definitions.js` registers addition and subtraction families only. `src/content/eligibility.js` exposes Phase 2 bar limits of denominator 30 and scale factor 12, and validates operation-specific common-denominator paths. Existing task-specific modules show how a small authored identity/context can be resolved and checked. `src/content/schema.js` keeps wire source forms, while `formKey`/`canonicalSerialize` preserve raw JSON form rather than normalize mathematical equivalence. | There is no comparison record or comparison eligibility contract. Add a bounded task-specific content path; preserve raw forms and derive a separate normalized identity. The existing LCD/scale validator is not a comparison-task eligibility validator. |
| Instruction and schedule | `src/interaction/episode-definition.js` registers arithmetic tasks plus Plan 37’s distinct bar-to-line family. `src/interaction/beat-schedule.js` has explicit family branches and the generic route rejects operations outside `add`/`subtract`. `src/interaction/classification.js` contains conversion, operation-result, reflection and premise classifiers, but no magnitude-relation response classifier. | A new comparison task can have its own fixed compare response schedule and classifier. Do not force a comparison learner task through the arithmetic operation enum or the addition/subtraction beats. |
| Scene and rendering | `src/interaction/scene.js` validates/project-scopes task meaning, support consequences, current-task identity, operation meaning and a specific Plan 37 number-line meaning. `src/render/fraction-bar.js` renders mathematical parts from scene data; `src/render/symbolic.js` supplies accessible fraction notation; `src/render/controls.js` supplies buttons, fraction input and a fieldset choice builder. `src/render/beat-container.js` and `src/render/linear-path.js` host active visual and linear paths. | Reuse math-neutral bar/fraction primitives where their current contracts fit, add one optional single-source model and its replacement behavior, plus a bounded relation group. Add scene checks for answer secrecy before Check and aligned verification only after acceptance. Do not move relation calculation into renderer code. The existing generic choice helper creates buttons, so a native radio group may need a focused control addition. |
| Support and response ownership | `src/app/support-levels.js` registers only More/high and Less/medium. `src/interaction/support.js` has six generic dimensions; the medium profile lowers `fractionBarModel` and `commonDenominator`, while other dimensions remain high. Plan 42’s [`ownership-map.md`](../plan-42-operate-response-ownership-pilot/ownership-map.md) assigns draft/focus/help policy to app, current controls/raw intents to the region, and recovery feedback to the shell. | Support is already two-level and multidimensional; there is no comparison-specific cue. Project the adopted support cue from instructional configuration through the scene. Preserve Plan 42's state/control ownership and avoid renderer-owned support policy. |
| Replay and identity | `src/interaction/replay.js` currently defines replay versions v1–v8. v7 is bridge-only; v8 is the Plan 39 bridge-repair definition. Replay identity validation preserves authored source forms and reconstructs registered content/definition revisions. | A comparison definition/content identity is absent. Preserve all existing envelopes and fixtures. The next version or use of an existing task-context version is an implementation-gate decision after a concrete baseline; this dossier assigns no version number. |

The Phase 4 notes’ broad claim that exact compare APIs already exist is confirmed. Their old inventory is incomplete for present replay versions and current task-specific paths; it is not copied as a current version contract. The existing content operation family does not admit comparison at the inspected source revision. Reusable exact math and presentation primitives are available; expected gaps remain in task admission, response state, optional-model state, scene meaning, control wiring, and replay identity.

### Plan 39 boundary

Plan 39 source contains a bar-to-line task, dedicated renderer, app wiring, and replay v7/v8 support. Plan 39 is now complete: the owner accepted the final Repair 04 appearance after technical acceptance and closed the packet. That acceptance preserves the reviews' limits; it does not claim physical-device or assistive-technology trials. Plan 37’s 0-to-1 design is owner-adopted, while multi-whole transfer and larger-denominator obligations remain. Plan 43’s owner acceptance is complete and supports direct Next/final return within its documented coverage. A benchmark-to-line comparison remains a distinct future task and needs its own adopted design and source packet; Plan 39 closure does not activate it.

## Later seams, owner decisions, and evidence limits

Retain these separate seams without activating them:

- **Benchmark-to-line comparison:** Plan 39 is now closed. A line-based comparison remains a separate future design/source task with its own line domain, density, exact choices, accessibility, and transfer contract.
- **Comparison then unsigned distance:** later design may ask “How far apart are these amounts?” and derive `max(a,b) − min(a,b)` with exact nonnegative subtraction. Preserve original operand labels, include zero distance, and do not let order appear as an assumption in the prompt.
- **Crossing-one / multi-whole / improper / mixed values:** retain the Phase 3 follow-up obligations and Phase 5 domain gates. The current proper-fraction task does not prove a `[0,2]` line, mixed comparison, signed subtraction, or transfer across wholes.
- **Broader denominator coverage:** no automatic increase follows from the exact core or a future number line. Measure rendered bar readability and accessible parity at actual viewport/zoom before extending beyond the first batch.
- **Broader method choice or symbolic transfer:** later tasks may examine choosing among valid comparison strategies or transfer beyond this fixed symbolic-first task. Do not turn the initial authored hint into a universal strategy planner or treat completion as evidence of independent transfer.

Recommend the owner adopt the following answers before any source packet:

1. Adopt a symbolic-first response where the learner directly selects `<`, `=`, or `>` once, with full spoken meanings, deliberate Check, optional notation help, and at most one requested source model at a time. The verbal First/Same/Second control remains an alternative if lowering symbol-direction demand outweighs explicit notation choice.
2. Let the learner choose which fraction to model. Switching replaces the current single source model and leaves both symbolic operands and any relation draft intact; never show an unshaded comparator. Reveal the paired honest bars only after acceptance.
3. Adopt the 12 ordered exact-checked examples as the bounded first batch. They include less/equal/greater, swaps, unreduced equality, larger-integer and denominator-gap counterexamples, same-unit/same-count reasoning, and a separating-half benchmark. Do not require a shared-unit response on close/equivalent pairs.
4. Use the existing More/Less levels with the same task and fixed batch; More offers a brief comparison-move cue, while Less leaves the same help/model available on request. The source packet must flow the support choice through instructional configuration and scene state, not renderer policy.
5. Defer benchmark-to-line, unsigned distance, crossing-one/multi-whole, mixed values, and a strategy chooser. No compare arithmetic operation or replay version is adopted here.

**Evidence limits:** The exact probe establishes the listed relations, benchmark signs, and conversion invariance. Code tracing establishes reusable APIs and current architectural seams. Neither proves single-model help is useful for every pair, symbol-direction copy is effective, model rendering is readable, screen-reader operation works, or the task improves comprehension, persistence, or transfer. The Phase 4 notes/reviews and accepted Plan 29/37/42/43 artifacts remain the reused design evidence; no new literature search, learner observation, product prototype, browser capture, build, or study was conducted.

## Revision history

### Superseded revision 0 — direct model-reading comparison

Commit `37eaf70` recommended showing two aligned fraction bars before response, with one verbal less/equal/greater judgment; its exact probe and design remain in that commit's history. The owner did not adopt that task. [Owner feedback](owner-feedback-revision-01.md) identifies the deciding concern: two visible endpoints let learners read which is farther right, and revision 0 showed the inequality only after success rather than asking learners to select it. The owner authorized this bounded symbolic-first revision.

### Technical review of revision 0

[Orchestration review](orchestration-review.md) technically accepted the dossier as a recommendation and confirmed the exact probe output byte-for-byte. That disposition did not adopt the learner task. It also proposed an attributed visible-copy refinement to First fraction / Same amount / Second fraction with full spoken meanings and explicit mapping. Revision 1 retains this as the alternate response candidate, compares it with direct inequality selection, and recommends a single inequality judgment for owner disposition.

## Review disposition for revision 1

This is a report-only revision. No advisor consultation or new broad research was warranted. The updated scoped exact probe is used as deterministic math evidence, not a product test or behavior surface. Orchestration review and owner design adoption remain required before any implementation packet.
