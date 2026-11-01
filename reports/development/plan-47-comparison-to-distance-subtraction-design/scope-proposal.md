# Plan 47 — Requirement 0 scope proposal

Date: 2026-11-01. Status: proposed; awaiting orchestrator approval. This is an investigation scope, not task adoption or a source authorization.

Preflight: `node scripts/dev/plan-status.js check 47` returned RUNNABLE. Initial inspected checkout HEAD: `61abcb14553314273d9cb52da9d18c3066aff61a`. Plan 50 is concurrent; identify the commit of each subsequent source inspection and refresh affected seams against accepted Plan 45 delivery before a source recommendation is dispatchable. Three unrelated untracked Plan 39 route receipts were present and are outside this scope.

## Candidate first tasks

1. **Comparison then symbolic distance (provisional preference):** learner chooses the relation between the original fractions, then, for unequal pairs, computes how far apart they are. An aligned model can be requested as help or shown after the distance response, subject to an explicit anti-reveal design. Equality may end after comparison if a compulsory zero answer adds no meaningful work. This would preserve computation as the learner's work; it requires proving that useful help can be honest without giving away the gap.
2. **Comparison then read a measured interval:** learner chooses the relation, then reads the length of the interval between the two amounts from a measured line. This makes the distance meaning visible but is representation reading, not independent symbolic computation. Investigate whether existing line semantics and unit labeling can support it within a small first slice; reject it if endpoint labels, scale, or partition capacity make the task misleading or trivial.

These are pedagogical alternatives, not claims that either produces better learning. Both must preserve original first/second identities while deriving larger-minus-smaller, distinguish distance from removing an amount, avoid a signed result, and honor Plan 44's one chosen model while comparison is pending. Prefer common-unit initial pairs if that keeps the first task short and reduces a separate renaming burden; test rather than assume this is feasible.

## Bounded inspection and reuse

Read the packet's routed founding and Roadmap 32–37 material; Plan 15 prototypes/acceptance, Plan 36 task, Plans 38/40 source boundaries, Plan 44 adopted contract, Phase 4 magnitude notes/reviews, Plan 43 progression, and Plan 39 final acceptance/maintainability. Use Plan 45 owner acceptance, delivery/repair evidence and its adopted comparison task as baseline, distinguishing prototype, design, and accepted source. Inspect only relevant exact fraction APIs (`src/math/fraction.js` and exports), comparison and subtraction task/episode construction, scene/classification/replay/progression ownership, and bar/line/linear access and response seams needed to establish the recommendation. Verify concrete examples with existing exact APIs, not handwritten results. Reuse existing evidence as evidence of its original bounded scope, not as proof of a new task.

## Falsifiers and stopping point

- **Math/order:** swaps produce different unsigned distances, equality is nonzero, source labels/forms are lost, or exact APIs cannot compare and subtract without an unapproved signed/absolute operation.
- **Units/representation:** unequal whole scales, partition count mistaken for part size, interval endpoint mistaken for length, or a common partition exceeds actual readable capacity; do not infer a rendered LCD from symbolic feasibility.
- **Response/help:** a prefilled gap, text alternative, feedback, or model exposes the answer before a computation response; comparison is presupposed; an equality branch compels empty work; recovery/view changes erase accepted comparison or change the chosen model. A truthful helpful representation that necessarily reveals the answer would falsify the preferred computation claim and require a revised recommendation.
- **Feasibility:** the proposed task needs a new general strategy engine, renderer arithmetic, incompatible replay/navigation, or a broad source change; stop and surface the boundary rather than prescribe it as small.

Use existing project evidence first. External research only if an identified unresolved gap would change the task choice or first slice; state the question and seek orchestrator agreement before expanding research. Stop when both candidates have been checked against these discriminators and one bounded recommendation, its risks and owner choices can be specified. No browser work, prototypes, app tests/builds, dependencies, learner study, or source changes in this investigation. Code traces and design reasoning cannot establish comparative learner benefit.

Advisor consultation: not warranted for this report-only design; no behavioral code, script, or schema change is authorized here. Any separately justified review follows orchestrator direction and current Terra-medium policy, without Sol/Astra or substitution.
