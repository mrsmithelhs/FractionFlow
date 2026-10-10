# Practice-Type Model Proposal

**Status:** Owner proposal. The goal-based direction is adopted in DECISION-035; exact labels, mapping, staged activation, and control count are still open.

## Design inputs

Principle 8 says familiarity should come from a consistent response grammar, while variation should make learners think about mathematically meaningful changes: values, operation, denominator relationship, how many fractions need renaming, regrouping, crossing a whole, representation transfer, and support. It cautions against interface novelty that spends working memory. DECISION-035 likewise says denominator relationships are not themselves a button taxonomy and unavailable practice stays absent.

The current app has one runnable control:

| Current label | Internal family | Current item and definition | Reach status |
|---|---|---|---|
| Add fractions with different denominators | relatively-prime addition; selected authored fixture `curated-relatively-prime-addition-non-least` | `phase-2-unlike-proper-addition-reflection@3` | Reachable from entry. The 12ths and authored 24ths routes have premise/reflection data and current browser evidence. |

This is **one current control**, not a decision that all future addition belongs under this label. The two approved direction decisions do not define the eventual taxonomy.

## Candidate family mapping

| Mathematical work | Learner-goal placement to consider | Evidence and boundary |
|---|---|---|
| Relatively-prime unlike-denominator addition, proper result | Add fractions with different denominators | One accepted fixture and definition are runnable now. Additional numeric candidates are not automatically authored. |
| Nested-denominator addition, proper result | Same unlike-denominator goal; no separate “nested denominator” control | DECISION-037 selects a focused one-renaming task. Plan 18 remains draft and its execution mechanism must be approved. |
| Shared-factor addition, proper result | Same unlike-denominator goal; no “shared-factor” control | A shared factor gives a meaningful LCD-versus-product contrast. Plan 19 is draft; candidate fixture's alternate 48ths exceed today's bar ceiling and it has no authored premise/reflection data. |
| Like-denominator addition, proper result | Either a separate “Add fractions with the same denominator” goal or a later broader “Add fractions” goal | The authored `1/5 + 2/5` fixture is valid but has no active learner route. DECISION-039's first task intentionally has no conversion reflection. Plan 20 remains draft. |
| Addition whose result is greater than one | Either a targeted “Add fractions that make more than one whole” goal or a meaningful variation inside a denominator-based goal | This is a learner-meaningful result/magnitude change in Principle 8 and a Roadmap §30 variety dimension. The accepted multi-whole representation exists, but no Plan 17 route is delivered. Keep separate from an activated mixed-number task. |
| Reducible addition results | Variation within an approved addition goal only after learner task and authored coverage are accepted | Exact arithmetic and overlays can produce reducible forms; no active simplification lesson is authorized. The `simplify-first` fixture is out of this packet's set. |
| Subtraction or focused concepts | No entry control in this proposal | Subtraction requires its own representation and instructional acceptance. Focused concepts have separate goals and authored task requirements; no route is inferred from arithmetic support. |

## Goal models for owner comparison

| Model | Learner-facing choices | Staged activation | What a learner can intentionally seek | Main question to settle |
|---|---|---|---|---|
| **One broad addition goal** (candidate label: “Add fractions”) | Eventually one addition control | Requires an owner-defined coverage point before broadening the existing label; otherwise the label promises work the set cannot yet offer | Learner begins addition, but may receive zero-, one-, or two-renaming items and proper or above-one results in the selected set | Does mixing those tasks support the intended practice, or hide the concept the learner/teacher wants to focus on? |
| **Targeted addition goals** (candidate labels: “Add fractions with different denominators,” “Add fractions with the same denominator,” and “Add fractions that make more than one whole”) | Up to three controls, but only as each accepted set becomes available | Each goal appears only after it has a complete, reachable set and an agreed Next policy | Learner can choose denominator relationship or above-one result practice without adaptation or random selection | Above-one items cross denominator relationships, so decide whether sets may overlap and how duplicates across goals are described. |
| **Current goal plus additive goals** | Keep the current one; add targeted goal controls only when approved | Most directly supports staged delivery while keeping the present label precise | Present reach remains honest; later learners can choose additional goals | Decide whether nested/shared-factor families join the current goal through the future selection mechanism or whether a new broader label is needed first. |

The targeted model is not automatically calmer because it has more controls, and the broad model is not automatically calmer because it has fewer. Evaluate the labels, the task mixture, and the learner's reason for choosing a goal. A set can contain tasks with different renaming counts and results only if the owner approves that mix and each item carries its own definition identity and applicable conditions. A single broad button must not be treated as permission to choose a random or adaptive route.

## Provisional mapping and current control count

For the present release, keep the current label and **one** control. In all future mappings, group nested and shared-factor cases inside an appropriate unlike-denominator learner goal, not as taxonomy buttons. Treat like-denominator and above-one cases as explicit owner choices: they can be targeted goals or admitted as variations within a broader addition goal. Keep unavailable work absent until it has complete instruction and route evidence.

This dossier does **not** recommend a final future control count. A targeted mapping could have three addition controls; a broad mapping could have one. Both are proposals, not adopted policy. No subtraction button is proposed as reachable now.

## Per-item semantic identity requirement

A learner goal is not an episode definition. Each admitted set entry should point to:

- stable content identity (for curated content: fixture id and authoring revision, with exact ordered source forms, selector/overlays, and content identity; generated content, if later authorized, also needs generator version and seed);
- registered episode-definition id **and revision**;
- active condition/support applicability for that item; and
- required authored premise/reflection data and representation/path eligibility.

The current registry stores a single fixture and one definition per goal. It cannot yet safely bind multiple fixtures with different schedules to one practice goal. This is why the selection mechanism packet must precede Plan 18/19 learner reach where those families join an existing goal. Do not generalize the app into a curriculum engine as part of Plan 21.
