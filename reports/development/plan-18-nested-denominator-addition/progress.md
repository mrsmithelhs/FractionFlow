# Plan 18 implementation progress

Date: 2026-10-17. Technical delivery was verified by the parent and committed
in `c8623b3`. Plan 18 is delivered for owner review; owner rendered-screen and
learner-agency acceptance and any deployment remain pending.

## Delivered behavior

The new set@6 is the unchanged eleven-item set@5 prefix followed by two exact
operand-order records: `1/2 + 3/8` and `3/8 + 1/2`. Each task follows the fixed
five-step schedule: encounter, select which fraction needs new parts for
eighths, transform that one side, add, and resolve. The untouched eighths form
remains the provided operand in the scene and provenance; only the selected
operand is recorded as learner-constructed. No denominator-entry, Notice, or
reflection step is introduced.

This is the focused side-identification task adopted in DECISION-037/044.
Other valid common units, including 16 and 24, are outside its offered responses;
they are not mathematical errors. The [Requirement 0 proposal](requirement-0-proposal.md)
and [exact-engine trace](investigation-results.json) preserve that distinction.
General common-unit choice remains follow-up work rather than a hidden task
restriction in a denominator-entry question.

Plan18 replay uses its exact-shaped v3 envelope and pins the raw forms, record
and authoring revisions, definition and task-data revisions, target denominator,
required side, and selected set membership. Legacy v1/v2 replay shapes and
oracles remain preserved. Plan34 task association accepts only the exact v5/v6
set identities and membership appropriate to its selected revision, retaining
its existing two-renaming admission and null compatibility behavior.

## Verification evidence

The parent ran `npm test -- --run`: 42 files and 386 tests passed. `npm run
build` passed for both the learner application and subtraction prototype. The
full Chrome route matrix passed 65 executions across 63 rows; its two new
production deep routes traverse normal entry and visible Next controls through
the unchanged prefix, both new items, exhaustion, Return, and reentry. The high
route uses visual view and touch-context actions; the medium route selects the
actual medium profile and uses linear view with keyboard activation. All four
production question/control captures fit within the 360×740 viewport, and the
routes report no horizontal overflow. Other document content requires ordinary
vertical scrolling.

The two intended failure seeds each stop at their named assertion, with a
separate receipt and log: wrong transform side detects the changed untouched
eighths numerator, and stale denominator control detects the unexpected
denominator input. The final clean route receipt is distinct from those seeds.

The mounted Stage2 fixture sweep covered both orders, visual and linear views,
and 360×740 / 360×752 at high support (eight cases). The Stage3 unshipped visual
fixture sweep covered both orders under standard and reduced motion at actual
medium support (four cases). These fixture sweeps complement the production
routes; they do not claim additional production reach. Native animation
instrumentation confirmed six WAAPI boundary calls on the selected side for
each standard conversion and Replay, zero calls on the untouched side, and
zero WAAPI calls or CSS animation/transition events under reduced motion.
Existing motion observations verified partial, highlighted, and settled
boundaries and document-coordinate whole/fill conservation. Reduced Replay
retained the connected operation input and its value.

The parent-arranged Sol medium read-only reviews ran at the three staged gates;
findings and repairs are recorded in the review files. Requested configuration
was supplied, but runtime model identity was not independently observable. No
Astra consultation or child fan-out occurred. Browser evidence is from Chrome
automation: touch-context values were automation-supplied, and there was no
physical-device, assistive-technology, or native on-touch-keyboard test.

## Evidence links

- [Clean production route receipt](evidence/route-matrix-results.json)
- [Wrong-transform-side seed receipt](evidence/plan18-seed-wrong-transform-side-receipt.json)
- [Stale-denominator-control seed receipt](evidence/plan18-seed-stale-denominator-control-receipt.json)
- [Stage2 mounted sweep results](stage2-chrome-smoke-results.json)
- [Stage3 WAAPI and reduced-motion sweep results](stage3-visual-motion-results.json)
- [Stage3 visual sweep runner](stage3-visual-motion-smoke.mjs)
- [Production high/visual side-choice screenshot](evidence/route-plan18-production-high-visual-complete-side-choice.png)
- [Production high/visual conversion and Replay screenshot](evidence/route-plan18-production-high-visual-complete-conversion-replay.png)
- [Production medium/linear side-choice screenshot](evidence/route-plan18-production-medium-linear-reduced-side-choice.png)
- [Production medium/linear conversion and Replay screenshot](evidence/route-plan18-production-medium-linear-reduced-conversion-replay.png)
- [Stage3 standard-motion screenshot, first order](evidence/stage3-nested-one-half-plus-three-eighths-standard-replay-740.png)
- [Stage3 reduced-motion screenshot, mirrored order](evidence/stage3-nested-three-eighths-plus-one-half-reduced-replay-740.png)
- [Stage1 review](stage-1-review.md), [Stage2 review](stage-2-review.md), [Stage3 review](stage-3-review.md), and [parent orchestration validation](orchestration-validation.json)

The parent verified that all 61 existing route IDs and executable selectors,
methods, values, and assertions are unchanged. Only current-production v5
labels/captions were corrected to v6; historical v4 assignments remain. Four
prior Plan34 generated evidence artifacts were restored to their accepted
versions after route validation.

The verified implementation/evidence checkpoints are commits `601d076`
(mechanism), `abec1a3` (frozen replay oracles), `4af9556` (pure foundation),
`24060e0` (mounted UI), and `c8623b3` (route evidence and delivery record).
No push or deployment was performed, and no subsequent plan was started.
