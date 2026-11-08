# Plan 91 Requirement 0 — scope proposal

**Status: proposed; awaiting orchestration approval before investigation.** Baseline: `81f9ed048e997fe4aebf44f34f6dcb63723fb637` on `main`; working tree clean at preflight. `node scripts/dev/plan-status.js check 91` returned RUNNABLE. This proposal identifies entry points, not verified eligibility, learner outcomes, or adopted policy.

## Public candidate boundaries

- Symbolic comparison: practice type `symbolic-fraction-comparison`, set `symbolic-fraction-comparison-vetted-set` revision `1`, items `plan45-compare-01` through `plan45-compare-12`; see `src/app/practice-types.js` and `src/content/data/plan45-symbolic-fraction-comparison-records.js`.
- Unlike-denominator subtraction: practice type `unlike-denominator-subtraction`, set `unlike-subtraction-vetted-set` revision `2`, exactly `PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2.itemIds` in `src/content/data/plan40-reusable-subtraction-recipes-records.js`: the nine Plan 40 construct, inspect and identify items plus the eight explicitly listed Plan 76 additions. Investigate each exact identity and its recipe, admission and fit; membership alone is not proof of eligibility. Revision 3, review variants and data-only holdouts are excluded.
- Inventory other public episode types for later coverage only. The proposed first history-informed design and successor remain confined to the two named families; existing routes stay supported.

## Contracts and work proposed after approval

The working hypothesis is a finite, mathematically connected goal with candidate selection at each role, informed cautiously by optional local observations. It must generate materially different identities and task mixes for the same goal, preserve direct Start with remembering on or off, and use fresh-record selection on the next Start after Clear. This is a hypothesis to test, not an adopted design.

1. **Pools and curriculum — Luna-medium, read-only:** inventory exact two-family members, task demands, equivalent-form connections and plausible role alternatives; map standards separately from demand and learner evidence. Inventory other public episode types without admitting them. Flag held material and any insufficient candidate diversity.
2. **Scheduler and lifecycle — Luna-medium, read-only:** inspect Plan 90's catalog, policy and evidence, `src/app/magnitude-session.js`, `managed-family-entry.js`, `managed-fit.js`, and their actual integration and tests. Trace direct Start, seeded reproducibility, admission versus mathematical validation versus measured fit, fallback, suffix recheck, active draft, retry, exit and existing routes. Identify constraints and counterexamples, not runtime changes.
3. **Local record — Luna-medium, read-only:** inspect adopted Plans 61, 63 and 66 and `src/app/comparison-record*.js` plus actual event producers, storage and tests. Trace opt-in, stored identities and sequence semantics, event visibility, retries, views, old/partial records, storage failure, Clear and cross-tab behavior. Propose investigation questions for an expanded observation and use contract; do not collect new data.

Workers have disjoint read-only assignments, do not delegate, and report source locations, uncertainties and counterexamples. The lead verifies consequential claims and owns synthesis, generated examples and the single gated successor brief. The lead also reads the packet's required project references and standards after approval. Any separate reports are scoped and coordinated with one writer per path. No worker is dispatched before this gate.

## Falsification cases for the proposed policy

- Several seeds with the same goal yield the same identities and role mix, or only rearrange a fixed itinerary: the policy has not demonstrated generated variety.
- A comparison item and subtraction item share words or denominators but lack a defensible mathematical connection, or a candidate's measured fit excludes it: reject the pairing or offer a coherent shorter/alternate visit; an empty pool needs a safe outcome.
- Repeated retries, view changes or repeated appearances of one item masquerade as independent first-response evidence; an assisted recovery is interpreted as unaided first success; an old comparison-only sequence is treated as all-problem time. Each would invalidate the evidence rule.
- Success on easy comparable items is treated as proof of success on a harder variant, or sparse/conflicting observations drive a confident recommendation. Test easy/harder variants and distinct comparable identities with explicit uncertainty.
- A recent return and an older review produce identical priorities despite intervening practice, or review crowds out underexplored work. Compare same-seed inputs with different histories and state the testable gaps and weights.
- Clear during an active draft, a pending selection, or another open tab allows old evidence to affect the next Start, loses current work, or changes remembering contrary to existing control semantics. Also exercise remembering off and storage failure.
- A fit change or failed preparation replaces the active task or draft, or a required unavailable role causes a broken visit. Test rechecking the future suffix and safe fallback.

## Gate and delivery

Stop here for orchestration review. No investigation, source changes, expanded observation, held-content exposure, deployment or owner adoption is authorized by this proposal. After approval, produce report-only evidence and an implementation brief with reproducible seeds and versioned inputs, same-seed history comparisons, multiple-seed variety, fresh/sparse/stronger/recent/older/off/cleared cases, and mounted and regression checks. Owner adoption of the design and expanded observation/use contract remains separate from a successor implementation assignment.
