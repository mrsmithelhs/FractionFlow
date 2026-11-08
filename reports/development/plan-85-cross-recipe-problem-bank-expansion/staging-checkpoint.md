# Plan 85 — staged batches and isolated bridge checkpoint

Status: **orchestration review; publication remains gated**. Owner authorized staging Plans 74/78/82 and an isolated bridge probe. Source baseline before this wave was `0a6b4ac`; `plan-85` preflight returned RUNNABLE. No active set, app registry, replay resolver, production renderer or production bridge bounds changed.

## Three staged pools

| Family | Existing live | New staged only | Total data / distinct operand pairs | Distinct exact results | Live set |
|---|---:|---:|---:|---:|---:|
| Plan 74 mixed addition with regrouping | 2 | 28 | 30 / 30 | 11 | v1: 2 |
| Plan 78 mixed subtraction without decomposition | 4 | 26 | 30 / 30 | 13 | v1: 4 |
| Plan 82 mixed subtraction with decomposition | 4 | 26 | 30 / 30 | 10 | v1: 4 |

Data and unchanged v1 sets live in the three corresponding `src/content/data/plan74-mixed-addition.js`, `plan78-mixed-subtraction.js` and `plan82-mixed-subtraction.js` files. Additions use eighths and whole operands 1–2 for Plans 74/78 and 1–3 for Plan 82, within the approved bounded subsets. Plan 74 has 15 equal-whole and 15 1-and-2-whole pairings, 11 result values and a fractional sum through 14 eighths. Plan 78 has both zero and nonzero remainders, with result whole parts 0, 1 and 2; Plan 82 covers three new whole-pair arrangements and 10 exact results. Counts include the old records. Addition deduplication ignores operand reversal; subtraction preserves operand order. IDs, answer order and spelling do not create separate counts.

Editorial limits: these are numerical variations of the same eighths tasks, not 30 different task designs. Several adjacent staged records are similar and the Plan 82 result 0 6/8 occurs seven times. Data array order is **not** an approved publication sequence. A future publication batch needs a deliberate varied membership order and human review, not a mechanical append. No staged record is currently launchable, so this checkpoint does not prove the 30-item live target or learner experience.

`tests/plan85-staged-mixed-banks.test.js` checks every data record with the existing strict batch validator, 30 unique task-aware pairs, exact unchanged v1 item IDs and app registry IDs, rejection of every staged ID by the current resolver, and negative controls for duplicate IDs, invalid denominator and unknown membership. Existing Plan 77 v17 frozen replay, Plan 74/78/82 episode/replay, and shared progression tests passed. A Chromium chooser journey mounted each of the three **existing live** types with no page errors; it did not launch staged records.

## Smallest proposed versioned publication mechanism — not approved

Retain each v1 data definition, membership and task identity; add an immutable v2 set, preserving the original v1 prefix, then select v2 for new launches. Update each task module to resolve by `(setId, setRevision, itemId, itemRevision)` against retained set definitions rather than its single fixed v1 array; keep strict full-batch validation and Plan 74's result-whole ≤4 authoring check. Update the three replay v17/v18/v19 reconstruction paths to pass the envelope's existing set revision while preserving v1 schema and meaning; update `src/app/practice-types.js` for the new active membership and identity. Verify old saved envelopes, new envelopes, invalid/cross-revision identities, launch, order and final exhaustion, plus first newly reachable record and representative views. Exact final implementation and file scope require a separate gate; no replay schema expansion is assumed.

The owner still needs to choose how much of each staged pool becomes a fixed set. A 30-item active set places the first new record at position 3, 5 or 5 if old prefixes are retained, and delays exhaustion to item 30. Leaving v1 active keeps 2/4/4 live and makes staged records unreachable. Plan 87's short draw is not current behavior. Orchestration must reconcile the varied-order goal with the approved fixed-set choice before publication.

## Isolated bridge probe

The reproducible report-local [bridge-evidence](bridge-evidence/README.md) is a disposable mock, not the production application. Its exact enumeration yields 11 written forms / 7 amounts for denominators 2,4,8 with one whole; 45 / 31 for denominators 2–10 with one whole; and 90 / 62 for denominators 2–10 with one or two wholes. Additional denominators give 24 distinct amounts within the one-whole interval; extending to two wholes adds 31 translated amounts. These are mathematical counts, not admitted or usable content.

At 360×740 normal root size, same point 1 9/10 on a 246px axis had 21 full ticks / 12.3px minimum spacing on 0–2, versus 31 / 8.19px on 0–3. At 200% root size the 0–3 axis was 206px, with 6.86px minimum spacing, 4px document overflow and a wrapped 135px toggle. At a 1366px Chromebook-width proxy, the denominator-9 0–3 axis was 782px with 28 ticks / 28.95px minimum spacing. Sampled whole labels did not overlap. A sparse mock retained the selected fraction tick plus four whole benchmarks, but its selected tick remained close to the whole benchmark; no universal legibility claim follows.

The mock kept four distinct same-denominator choices within the displayed range, rejected a wrong check without revealing the result, and showed matching whole-count arithmetic in visual and linear views after correct Check. Selection and acceptance survived the tested mock resizes and view toggle. An initial mock erroneously ended its axis one whole early and offered an out-of-range distractor; both were corrected and all reported measurements were rerun. The 200% observation is root text scaling, not browser zoom; the constrained-box case is not a zoom test; the Chromebook is a viewport proxy. The mock does not exercise production behavior, focus, assistive-technology speech, physical devices or learner comprehension. No universal-versus-wide production eligibility boundary can yet be justified. Further work needs a separately reviewed, production-faithful prototype, usable fallback and actual rendering/accessibility evidence before any wider bounds or capability policy.

## Checks and review

- Targeted tests: 37 existing tests across five files passed; three new whole-bank staging tests passed. They verify specific boundaries and replay, not learner outcomes.
- Browser: three current chooser-to-episode mounts succeeded; no page errors observed. No staged item was mounted.
- Full `npm test`: 89 files / 705 tests passed, but `tests/dev-console.test.js` had two failures: a 20-second helper lifecycle timeout and a related startup assertion. An isolated rerun of that file passed all 17 tests; the original full run remains a failure and contention is only a possible explanation, not a proven cause.
- `npm run build` passed, with the existing Vite large-chunk warning; packet lint passed. Probe witness was independently rerun from its report directory with local Chromium. It records mock measurements and state; manual inspection identified scale and choice defects in earlier drafts, which were corrected before this evidence was saved.
- One bounded read-only review was requested with Luna-medium configuration; the reviewer could not independently verify its actual model. It found no blocking staging correctness issue, and noted the narrow eighths-based variety. Lead independently checked the source, batch counts, live boundary and probe. No higher-tier advisor consultation ran; this is an orchestration-gated intermediate staging checkpoint, not delivery or owner acceptance.

Unrelated pre-existing Plan 39/40 evidence modifications and untracked files remain outside this work. No push, deployment, status closure, content publication or production-bound change occurred.
