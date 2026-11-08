# Plan 85 Requirement 0 — baseline coverage ledger

Baseline: commit `0f55651e9b6c7164b15ad2f149ddf0bbea517ecd`. Preflight `node scripts/dev/plan-status.js check plan-85`: RUNNABLE. Counts below are the lengths of the imported `PRACTICE_TYPES` items arrays, not a browser journey or a claim about all admissible records. Each is an active membership and source-level launchable count; pool counts and total capacity are not established by these numbers. They are a conservative attainable floor, not a forecast of new content.

| Standalone registry ID | Active / source-level reachable | Recipe / data owner | Known bounds and dependencies; further capacity |
|---|---:|---|---|
| sum-under-one | 21 | Plan 35, `data/plan35-addition-recipe-records.js`; legacy fixtures | Relatively prime, nested, shared-factor addition; target common denominator, proper result; historical fixture/materializer dependencies. Exact capacity and presentation bounds require enumeration. |
| like-denominator-addition | 1 | Plan 20 records and fixture | Same denominator; legacy fixture/definition tied to the item. Additional data-only capacity not established. |
| like-denominator-subtraction | 8 | Plan 36 data and task | Same-denominator takeaway; registered set and item required. Capacity not established. |
| unlike-denominator-subtraction | 17 | Plan 40 data and task, membership v2 | Relatively prime, nested, shared-factor subtraction; positive proper result, common target denominator. Historical records and replay matter. Capacity not established. |
| bar-to-line-same-amount | 8 | Plan 37 data and task; Plan 39 repaired definition | Authored source forms and candidates; exact authoritative registry equality. Preserve historical and repaired definitions. Capacity not established. |
| symbolic-fraction-comparison | 12 | Plan 45 data and task | Authored pairs and cues; exact comparison; authoritative ordered registry. Capacity not established. |
| number-line-collection | 4 | Plan 50 data and task | Three members, lattice 4/6/8, distinct placements and valid lattice positions; per-record authored forms. Capacity not established. |
| fraction-distance | 4 | Plan 51 data and task | Ordered distinct fractions in same units, denominators 6 or 8; exact distance derived. Capacity not established. |
| two-whole-location | 8 | Plan 53 data and task | 0–2 line, denominators 2/4/8, numerator 0–2d. Capacity before task-aware equivalence: at most 17 distinct tick positions, not 30. |
| whole-plus-fraction-construction | 6 | Plan 58 data and task | Denominators 2/4, numerator 0–2d. At most 9 distinct amounts across these forms; check whether task distinctions warrant a narrower count. |
| directed-number-line-endpoint | 6 | Plan 59 data and task | Addition/subtraction, denominators 4/6/8, same-unit proper positive start and amount, endpoint strictly between 0 and 1. Capacity not established. |
| mixed-number-addition-without-regrouping | 4 | Plan 72 inline records/task | Positive mixed operands, same denominator, proper parts, sum of parts below one; admission explicitly requires equality to existing record. Presentation bounds and safe versioned expansion need investigation; no data-only capacity assumed. |
| mixed-number-addition-with-regrouping | 2 | Plan 74 data/task | Eighths, proper parts, fractional sum at least 8 and below 16; organized result whole at most 4. Capacity not established. |
| mixed-number-subtraction-without-decomposition | 4 | Plan 78 data/task | Eighths, first whole and numerator each at least second; result whole at most 3. Capacity not established. |
| mixed-number-subtraction-with-decomposition | 4 | Plan 82 data/task | Eighths, first whole greater and numerator smaller; result whole at most 3. Capacity not established. |
| mixed-to-improper-bridge | 4 | Plan 84 data/task and explicit v1 set | One whole, denominator 2/4/8, proper nonzero fraction; four same-denominator distinct options, one correct, numerators ≤2d. Eleven written forms represent seven amounts; under amount-based duplicate rule at most seven, not 30. Wider bounds are investigation only. |

Paths above are relative to `src/content/` unless otherwise stated; the app registry and membership wiring are in `src/app/practice-types.js`. Each count is the current minimum demonstrably present, not a verified maximum or a promise that 30 is attainable. Existing per-record authored fixtures, choices, cues, task data and exact record equality must be audited before assigning write scope. In particular, several older families lack an established versioned publication seam. Changing validators, renderer, replay schema or progression to manufacture capacity requires escalation.

Composed sessions are separate: they consume existing tasks, not additional standalone bank entries. Their fixed manifests and scheduler selections must remain unchanged and be checked at integration. No learner or browser reachability was measured for this inventory.

**Unresolved before authoring:** Pool versus active counts, exact numerical and presentation constraints, and enumerated attainable capacity for most rows remain unverified. The conservative floors above are not the full Requirement 0 capacity assessment. A read-only capacity audit must complete and return to orchestration before any family whose bounds or publication seam are unclear is authored.
