# Plan 78 Requirement 0 — proposed mechanism

2026-11-07. Proposal for orchestration review; not an implementation or an owner acceptance. Preflight `node scripts/dev/plan-status.js check 78` returned RUNNABLE. Committed baseline on `main`: `527815ee2f6eb2b467951cb189ad4a9b9ec68c5f`. Three unrelated untracked Plan 39 route-run JSON files existed at preflight and are outside this work. Concurrent work can advance HEAD; recheck before integration.

## Task and identity

Place **Subtract mixed numbers** in the existing **Wholes and parts** chooser group, as a standalone four-item practice, not a featured rotation, session, scheduler, or history expansion. Use shared Next and final return. Proposed set/practice ID `mixed-number-subtraction-without-decomposition`, set revision `1`; definition `phase-5-mixed-number-subtraction-without-decomposition`, revision `1`; item IDs `plan78-subtract-01` through `plan78-subtract-04`, each revision `1`, in this immutable order:

| Item | Original operands | Accepted fields | Settled notation |
|---|---|---|---|
| 01 | 3 5/8 − 1 2/8 | 2, 3 | 2 3/8 |
| 02 | 3 3/8 − 1 3/8 | 2, 0 | 2 |
| 03 | 2 6/8 − 1 2/8 | 1, 4 | 1 4/8 |
| 04 | 2 1/8 − 1 1/8 | 1, 0 | 1 |

Store compact operand records separately from explicit ordered set membership, following Plan 77's narrow pattern. Live admission requires exact equality with a registered record and revision in this set, and context validation checks the entire resolved identity and operands. A task-specific offline validator checks schema, unique IDs, membership references/revisions and eligibility without admitting arbitrary records to the live task. Response and representation code consume derived values, never branch on item ID. Another eligible, reachable record would require data and membership changes plus a new set revision/replay policy, not an item-specific response branch; this proposal does not authorize publication of another batch.

## Admission and response

Each operand has canonical positive integer strings for whole, numerator and denominator; numerator is 1–7 and denominator exactly 8. Require left whole ≥ right whole and left numerator ≥ right numerator; derive with the existing exact mixed subtraction core and cross-check source-unit component subtraction and exact value. Reject malformed forms, zero parts, improper fractions, other denominators, whole deficit, fractional deficit and negative results; specifically reject positive `3 2/8 − 1 5/8` because it needs decomposition. Eligibility is separate from batch checks: assert the four exact ordered records/outcomes, two zero and two positive remainders, and C's authored 4/8, without using answer tables in response logic. Enforce reachable organized result whole ≤ 3 for the proposed draft limit. Preserve authored eighths even if reducible; do not import the addition validator.

Show both original amounts, initially blank **Whole units left** and **Eighth pieces left** fields, a visible fixed `/ 8`, and one Check. Edits accept raw strings up to 32 characters, retain the other field and clear stale feedback; checks are bound to draft revision. Blank is missing, including when the correct value is zero. Nonnegative ASCII digits only; values 0–3 wholes and 0–8 eighths inclusive. Missing and malformed/out-of-range inputs get distinct neutral, field-specific guidance, with out-of-range never labeled unequal. For valid inputs compare exact value first: unequal gets neutral retry; equal with 8 eighths gets organization guidance; equal with 0–7 eighths is accepted. B's `1, 8` is equal but requires organization; A's `1, 11` is out of range, not unequal. No silent normalization. Retry and view switching preserve raw draft and assistance; fresh attempt and Next reset both.

## Withholding, settled model, support and focus

Before acceptance expose only original operands, draft, neutral feedback, and optional general help: no computed difference, completed equation, app-generated removal/remainder model or answer-bearing names, hidden DOM or scene projection. Original operands naturally allow inference. After acceptance remove spent input/Check controls and use house success and progression. Show the starting wholes and an eight-cell fractional bar at a common unit width: mark exactly the subtrahend's whole units and occupied eighth cells as removed, distinguish remaining occupied cells and outside-start empty cells by labels/patterns as well as color. For B and D, explicitly communicate zero eighths remaining. Show the source-form accepted result; a concise linear equivalent names starting, removed, and remaining counts and the same result. No required selection, drag, confirmation or motion.

Offer optional concise unit help, e.g. “Think about the whole units and eighth pieces in each number. Which amount is taken away?” An unfilled eight-part unit may illustrate the unit without solving the item. Both views offer the same decisions and help, and More/Less must accurately describe any identical aids. Fix support at start; record help requests separately from panel visibility and retain assistance provenance on retry/reconstruction. Return focus to the invoking Help control when dismissed; preserve caret/focus on edit and view transitions where applicable, announce feedback once, and move focus to the shared accepted/progression target on acceptance. Use existing house conventions and verify actual focus behavior in the mounted app.

## Replay and integration

Propose a new replay envelope version after checking the current highest version at integration; it must freeze definition, set/item revisions, full validated context, fixed support/condition and ordered edit/help/check intents, reconstruct only the registered exact context, reject tampering and stale revisions, and reproduce draft, assistance and settled state. Do not reinterpret or modify historical envelope versions; exercise existing historical fixtures. No result is exposed through the pre-acceptance scene, DOM or accessible labels, even though trusted episode arithmetic may derive it internally.

Expected shared files requiring an assigned write window **as well as** mechanism approval:

- `src/app/practice-types.js`, `src/app/entry-projection.js`, `src/app/app.js`, `src/app/styles.css` — chooser, launch, mount, presentation.
- `src/interaction/episode-definition.js`, `src/interaction/episode.js`, `src/interaction/scene.js`, `src/interaction/replay.js` — definition, dispatch, projection and versioned replay.
- `tests/plan43-shared-progression.test.js` only if its existing exact registry assertions require an update; otherwise keep it read-only. Any other shared test or route-matrix edit needs a separately identified scope/window before editing.

Proposed Plan 78-owned files after mechanism approval: `src/content/data/plan78-mixed-subtraction.js`, `src/content/plan78-mixed-subtraction-task.js`, `src/interaction/plan78-mixed-subtraction-episode.js`, `src/interaction/plan78-mixed-subtraction-scene.js`, `src/render/plan78-mixed-subtraction.js`, `tests/interaction-plan78-mixed-subtraction.test.js`, and this packet's report/evidence folder. These can be developed independently of the shared window only after mechanism approval; integration and browser routes require shared coordination. If inspection reveals another shared edit is necessary, stop and request an amended window. Plan 79 is proposing concurrently: orchestration should coordinate overlap, especially replay and shared integration, and assign order/version after both proposals.

## Planned verification and gate

Test admission, malformed and boundary cases, exact outcomes/source 4/8, independent batch coverage, all response classifications and stale checks, help/retry/view state, withholding in scene and DOM/accessibility, accepted visual/linear parity, progression and fresh reset, replay round trips/tampering and historical replay. Run focused tests, full suite, build, relevant browser routes, packet lint, link and scoped diff checks. Browser witnesses: A and B at 360 × 740, normal and 200% root text, initial, recovery/help and settled; inspect fixed denominator, measured equal widths and eighth cells, focus, labels and overflow. Also representative Chromebook width, keyboard, linear completion, non-drag touch emulation, and mounted C/D. Record screenshots and observations, separating root text scaling from browser zoom and emulation from physical devices, screen-reader speech and learner evidence.

Stop before source changes for mechanism approval; shared changes also require an assigned write window. Owner rendered review and packet status remain with orchestration/owner. Advisor consultation not warranted for this proposal-only, docs-only checkpoint; a bounded read-only Terra-medium advisor for later behavioral implementation runs only if orchestration authorizes it. No runtime, browser, learner, or historical replay validation is claimed here.
