# Content authoring and scale — orchestration position

Date: 2026-10-10. Owner questions whether each new problem needs substantial code
and proposes compact datasets plus broad testing, anticipating later random
selection. This is a source-backed assessment and planning recommendation, not
approval of a new schema, template engine, generated learner content or random
selection. Plan 26's source scope remains unchanged.

## Current architecture and actual bottleneck

Reviewed committed baseline `a1520f8` and Plan 21's dated inventory; Plan 26 is
actively changing content files, so its partial edits are not delivered evidence.
Exact arithmetic, content construction, conversion/help relationships and episode
transitions are generic. A curated mathematical fixture is a small record of
identity/revision, two operand forms, family/profile/overlays and expected test facts.
`src/content/curated.js` sends those records through the shared builder/validator.
There is no new renderer or episode definition required for another problem using
the same already supported task semantics.

The less scalable part is authored instructional data. Premise and matching-choice
maps repeat forms, denominator-route records and stable response identities for
each fixture. Such data is small in storage, but its manual authoring and validation
cost can grow. Plan 26 is also implementing the first set/Next/exhaustion/refusal/
reset lifecycle; that one-time work must not be mistaken for the cost of every later
problem. Its initial second item tests whether canonical arithmetic and copy were
accidentally assumed, while isolating navigation from bulk authoring changes.

The expected direction is shared math/episode/render logic plus compact problem
records and a small number of reviewed task profiles. Repeated per-item branches
in math, episode, renderer or help would be a warning; real changes in task/family
semantics need explicit contracts, rather than being hidden as data substitutions.

## Existing scale evidence and its boundary

Plan 21 recorded 640 deterministic draws over four addition selectors and allowed
overlays, all content-valid in that sample. It also recorded duplicates, representation
refusals and missing instructional coverage. This shows that mathematical/content
candidate generation is already available; it does not show 640 learner-ready tasks.
See `docs/development/phase-3-practice-variety-design/content-inventory.md`.

The current narrow relatively-prime profile is smaller after requiring both
denominator paths to fit: Plan 21 records 18 ordered candidates / 9 cases after
collapsing operand swaps under its two-choice criterion. Do not promise an arbitrary
large admitted bank without measuring the desired profiles, task-data coverage,
result requirements and representation bounds. Distinct seeds also do not guarantee
different mathematical problems.

## Recommended follow-on after the Next lifecycle is accepted

1. Inventory the marginal work for adding several same-task items: compact inputs,
   authored records, registry entries, validations and witnesses. Compare manually
   listed records with deterministic expansion of a few reviewed content recipes.
   Do not generalize a framework before identifying which duplication is real.
2. Prototype the authoring design on a bounded synthetic candidate batch. Compute
   arithmetic/conversions with the existing exact core, not hand-copied results or
   renderer arithmetic. Keep instructional choices explicit: which operand to ask
   about, misconception/distractor rule, permitted units and task/reflection purpose.
   Check unique choices, one intended correct matching choice, plausible valid forms,
   and exact truth of premise expectations. Avoid making outcome or answer position
   predictable through a uniform recipe.
3. Preserve old immutable authored rows and replay meaning. A recipe that contributes
   task data must have deterministic, versioned output/choice identity. Materialized
   reviewed data and runtime derivation are alternatives to investigate; neither is
   adopted here. Pure content expansion is not generative AI in the mathematics loop.
4. Sweep every candidate/admitted path for math, eligibility, authored closure, help,
   response/recovery and replay. Use broad headless completion checks plus deep browser
   journeys on discriminating structural/layout cases and a stated rendering sweep.
   Report all-item versus sampled browser coverage honestly; neither raw math counts
   nor a screenshot of one item proves the entire bank usable.
5. Admit the reviewed bank separately from activating random selection. Deterministic
   selection/reconstruction, duplicate avoidance and exhaustion/refusal still need
   their own mechanism; no adaptive/session policy follows from a larger dataset.

The recommended next artifact is a bounded compact-authoring and batch-validation
investigation at the authored-Next acceptance checkpoint, with Plan 26's measured
authoring burden and Plan 29's task design as inputs where relevant. Larger offline
candidate sweeps can inform design earlier; they do not require premature learner
activation. Keep family expansion and task variants distinct from adding values to
an already accepted task.

## Communication and limits

Owner directly authorizes Plan 26 bidirectional communication until that thread's
work is done. FF Impl 26 received the concern and a request to identify one-time
lifecycle work versus later per-item data/testing cost in its delivery report.
No new source work, additional fixtures or source refactor was requested.

Root performed read-only source/document inspection, not a new bulk run, browser
test or Plan 26 delivery review. The 640-draw and candidate counts are explicitly
the accepted Plan 21 analysis, not fresh measures of current in-flight code.
Advisor consultation is not warranted for this prose-only position. No learner
data, push or deployment.
