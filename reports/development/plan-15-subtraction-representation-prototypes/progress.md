# Plan 15 — Subtraction Representation Prototypes

- **Date:** 2026-10-01
- **Packet status:** remains `in-progress` (unchanged by this implementation)
- **Preflight:** `node scripts/dev/plan-status.js check 15` returned `RUNNABLE`.
- **Delivery state:** ready for orchestrator delivery review. Rendered-screen acceptance remains owner-gated. This report does not select a representation or answer OQ-25.

## Summary

Built two learner-operable subtraction prototypes on a standalone page at
`prototypes/subtraction/`. The takeaway model marks each part removed from the
first quantity. The comparison model aligns both quantities and reveals the
gap. Each requires a learner-entered result and gives only plain correct or
retry feedback.

The prototype has a separate Vite root and output at
`dist/prototypes/subtraction/`. The complete build creates the learner build
first and then the prototype build; only the prototype build clears its own
output subtree. The learner app, interaction layer, renderers, and math core
were not modified. The prototype imports only the existing exact-arithmetic
module and holds local fixture index, removal count, gap visibility, answer,
and feedback state. It adds no persistence, analytics, or learner logging.

## What a learner does

The same four fixed synthetic examples appear in each representation. For
unlike denominators, the original equation and the correctly renamed equation
are both shown; renaming is supplied so this comparison isolates the
subtraction representation.

| Fixture | Supplied equation | Takeaway action and endpoint | Comparison action and endpoint |
| --- | --- | --- | --- |
| Like denominators | `4/7 − 1/7` | Press **Remove one part** once. One seventh stays marked as taken away; three sevenths remain. | Press **Show the gap** once. The aligned bars remain visible and a bracket marks the three-seventh gap. |
| Nested denominators | `5/6 − 1/3`, also shown as `5/6 − 2/6` | Press **Remove one part** twice. The two removed sixths stay marked; three sixths remain. | Press **Show the gap** once. The bracket marks the three-sixth gap. |
| Unlike denominators | `3/4 − 1/3`, also shown as `9/12 − 4/12` | Press **Remove one part** four times. The four removed twelfths stay marked; five twelfths remain. | Press **Show the gap** once. The bracket marks the five-twelfth gap. |
| Small difference | `5/8 − 1/2`, also shown as `5/8 − 4/8` | Press **Remove one part** four times. The four removed eighths stay marked; one eighth remains. | Press **Show the gap** once. The bracket marks the one-eighth gap. |

After the operation, the learner enters numerator and denominator separately.
Equivalent answers are accepted by the exact fraction core. A wrong or invalid
answer produces `Try again.` without resetting the operation mark; a correct
answer produces `That’s right.` No numeric difference is supplied in visible
text or accessible labels before submission.

## Draft SUB-01 register entry

> **Draft proposal for the orchestrator’s register; not yet recorded in the
> canonical register. Prototype output is not decided.**

### Live rivals

- **T — takeaway removal:** one amount with the subtrahend’s parts marked as
  removed; the parts left are the difference.
- **C — aligned comparison:** both amounts on one whole; the marked gap is the
  difference.

### Falsification observations

| Rival | Observation that would disqualify it for follow-up design |
| --- | --- |
| T | Repeated inability to connect the marked removed parts to the second amount, identify what remains, or say what the entered fraction counts; recurring confusion or retry/access burden that persists after the control’s action is understood. A single hesitation calls for inspection, not automatic disqualification. |
| C | Repeated inability to explain the bracket as the difference between the aligned amounts, or recurring confusion about which amount is larger or whether the gap represents addition; recurring answer or access burden that persists after the reveal action is understood. A single hesitation calls for inspection, not automatic disqualification. |

### Manipulated and held-constant variables

- **Manipulated:** representation and its corresponding action: repeated
  removal, one action per common-unit part in the subtrahend, versus a single
  gap reveal. The required action count intentionally differs and is part of
  the manipulation; it must be recorded as such, not described as matched.
- **Held constant:** fixture and exact result; original and supplied renamed
  equation; whole and segment widths for a given denominator; shared task
  instruction; numeric answer fields and submission opportunity; correct and
  retry feedback; target sizing; and the no-answer-leak rule. Action labels
  differ with the representation and are also recorded as part of the
  manipulation.

### Outcome measures and observation conditions

Notice hesitation and rereading, whether the learner can predict the control’s
action, what the learner says a removed part or bracket means, what the entered
fraction counts, and when the learner changes an answer, requests help, retries,
or stops. Record representation order, fixture, prior fixture exposure, action
count, and individual participation or access burdens. Alternate which
representation comes first where practical because seeing a fixture once can
help on the second attempt. Timing and click count alone cannot favor a
representation.

### Conclusion rule

Report observed design problems and follow-up questions only. Do not report a
preference, efficacy claim, or winning representation from this prototype
comparison. High-school feedback can identify interaction issues but is not
target-age child-usability evidence.

## Observation guide and handling

The one-page behavior-focused guide is
[`observation-guide.md`](observation-guide.md). It asks about behavior rather
than preference, requests appropriate adult permission before observing a
child, recommends alternating order and tracking prior fixture exposure, and
states that evidence is for design rather than efficacy claims or formal
research. It limits retention to de-identified behavior, design impact, and
follow-up questions and excludes identifying details, recordings, screenshots,
student work, and other learner artifacts from the public repository. No real
observations were conducted or retained for this implementation.

## Rendered measurements and participation

Browser evidence is in [`evidence/`](evidence/): 16 screenshots cover all four
fixtures, both representations, and both requested viewport heights; the
measurements file has 32 records covering those fixture/representation/viewport
combinations under both standard and reduced motion. The screenshots are
standard-motion captures; both motion settings have measurements and executable
route witnesses.

At 360px viewport width, every bar whole measured 328px. Segment widths were
46.56px for sevenths, 54.33px for sixths, 27.16px for twelfths, and 40.75px for
eighths, consistently within each denominator across models. Across all 32
measurements, there was no horizontal or vertical document overflow; the
question and every visible control stayed in the viewport; and all measured
controls were at least 24×24px. The interactive operation, answer fields,
submit, and fixture selector were 44px tall; mode links were 40px tall. The
latest feedback bottom was at 703.69px, within both 740px and 752px viewport
heights. Standard transitions measured 0.18 seconds; reduced-motion transitions
measured 0 seconds while preserving the marked endpoint.

The browser participation script tabbed through the mode links, fixture
selector, and operation in both models, then completed operation and answer
entry by keyboard. It also activated the operation and focused the answer fields
with real Playwright touch `tap()` events in both models. Text was supplied to
the focused fields by Playwright because the headless browser has no mobile
operating-system keyboard; native on-device text entry was not tested.

## Route witnesses and build separation

The route matrix has 29 declarative rows: the 27 prior learner rows remain
unchanged in parsed content, and exactly two prototype rows were appended.
Each new row expands to standard and reduced motion, for 31 browser executions
in the full run. Both route witnesses activate their operation control, inspect
the operation-specific mark, enter the like-denominator answer, and assert
plain correct feedback. Reciprocal controls compare the post-operation visual
representation within the same motion mode; filtered runs include the
counterpart automatically.

`npm run test:routes` passed all 31 executions. A takeaway-only filtered run
expanded to both prototype rows × both motion modes and passed all four. The
route-contract tests cover row count/preservation, motion expansion, allowlisted
starting surfaces, unknown motion rejection, missing counterparts, and filtered
counterpart selection.

The full build emitted the learner bundle under `dist/assets/` and the separate
prototype page/assets under `dist/prototypes/subtraction/`. The learner bundle
was checked for prototype-only markers (`SUBTRACTION_FIXTURES`, `deriveFixture`,
`gap-marker`, `subtractAtCommonDenominator`, and `subtraction-prototype`); none
were present. The prototype output exists independently. `git diff -- src/`
was empty.

## Validation commands and results

- `npm test` — **23 files and 271 tests passed**.
- `npm run build` — learner build (44 modules) and prototype build (6 modules)
  succeeded into separate outputs.
- `npm run test:routes` — **31 passed, 0 failed** across 29 route rows.
- `node scripts/dev/run-route-matrix.js --filter ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY`
  — **4 passed, 0 failed**; reciprocal route and both motion modes included.
- `node scripts/dev/capture-subtraction-evidence.mjs` — **16 screenshots and
  32 measurements** captured; keyboard and touch paths completed in both models.
- `node scripts/dev/plan-status.js check 15` — `RUNNABLE`.
- `node scripts/dev/plan-status.js lint` — `lint: OK (no violations)`.
- `git diff --check` — passed; Git printed only its expected LF-to-CRLF working
  copy notices.
- Route baseline comparison against `HEAD` — prior 27 parsed rows unchanged;
  current total 29, with only the two intended prototype rows appended.

## Problems encountered and resolutions

- The first route-contract test draft expected baseline control rows in the
  declarative matrix. The runner creates those baseline captures dynamically,
  so the check was narrowed to strict missing-counterpart handling for the new
  same-motion controls while existing learner-route checks were retained.
- An early visual layout exceeded the approved viewport budget by 16px. The
  prototype spacing was tightened, then remeasured in the final browser capture;
  all 32 final records meet the viewport bounds above.
- The initial advisor brief contained two transcription errors: it showed a
  nonexistent `state.operationStatus` reference and omitted the actual operation
  clicks from the route rows. The advisor’s first findings were therefore based
  on the inaccurate brief. I corrected the inline artifact and requested a
  second read-only assessment before recording the disposition below.

## Advisor disposition

- **Requested model:** `gpt-6.1-sol`, medium effort, through the depth-one
  read-only advisor call.
- **Observed identity:** the advisor self-reported that it could not
  independently confirm the model override and identified itself only as
  Codex based on GPT-6. The call-site requested model/effort are observable;
  the exact runtime model and effort are not independently verified.
- **Effective posture:** instruction-read-only with post-hoc verification; no
  structural read-only guarantee is available. The primary remained the sole
  writer. Immediate `git status --short` checks after both advisor responses
  showed only the primary’s existing Plan 15 files and no advisor changes.
- **Finding 1 — claimed takeaway crash from `state.operationStatus`: rejected.**
  Independent verification: inspected the actual `main.js` handler and confirmed
  it references the defined `operationStatus` DOM element, updates the removal
  count, and calls `render()`. The actual build’s full route and evidence runs
  completed the takeaway action. Reason: the cited bad reference existed only
  in my inaccurate inline review excerpt. Result: corrected the review excerpt;
  no source change was needed.
- **Finding 2 — claimed absence of operation witnesses: rejected.**
  Independent verification: inspected both actual matrix rows; each clicks the
  operation, enters `3/7`, submits, and asserts correct feedback plus its own
  operation mark. The runner captures the visual DOM after actions, compares
  reciprocal controls by motion mode, auto-includes the counterpart under a
  route filter, and fails on a missing or identical capture. Full and filtered
  browser runs passed. Reason: the actual operation path and post-operation
  representation are witnessed; the omission was in my first inline excerpt.
  Result: corrected the brief; no route or runner change was needed. The advisor
  confirmed on reassessment that this post-operation capture meets the approved
  actual-representation criterion.
- **Cost:** two advisor responses (initial critique and corrected reassessment),
  roughly a few minutes of review and coordination.

## Remaining review items

- The owner still needs to accept both rendered screens. This report does not
  satisfy that gate or choose between the representations.
- No real learner observations were run. Any later observation must follow the
  guide’s permission and de-identification requirements.
- The prototypes remain local/static artifacts; no deployment was performed.

## Changed files and commits

The implementation commit contains the standalone surface, isolated build,
route-runner/matrix extension, model tests, observation guide, screenshots, and
measurements. No packet status field was changed and nothing was pushed.

- Implementation and evidence: `61b9f67` — `feat: add Plan 15 subtraction prototypes`
- Progress report: this document, committed separately after implementation as the final repository action.

**Ready for orchestrator delivery review: yes. Rendered-screen acceptance remains owner-gated.**

## Repair 01 addendum (2026-10-01)

This addendum records the bounded repair authorized after delivery review. It
supersedes the earlier report's stale `in-progress` state and its statement
that a 0.18-second transition was measured. The packet remains `delivered`;
the earlier 0.18-second value was a configured CSS duration, not executed
motion. Those unused transitions have been removed, and the refreshed evidence
records observed browser events instead.

### Surface and rendered-witness repair

The completed removal/gap button is now hidden after its final action, which
removes it from visible content and keyboard order. The redundant
`.model-note` paragraphs and completed-action badge text are gone. The
inspectable bars/removal marks/bracket remain, with one short visible answer
instruction. The final removal or gap-reveal click/keyboard activation focuses
the numerator field. A nested-denominator keyboard path confirms the
intermediate takeaway action keeps its button focused and its first removal
mark; retries preserve operation marks and do not move focus.

Both prototype route witnesses now assert visible dimensions and actual paint.
Their representation capture contains rendered bar, segment, pseudo-element,
and gap geometry/styles, without visible text or wrapper classes in the
serialized capture. Takeaway additionally requires its removed segment's
computed background image to contain the hatch pattern. Browser-only seeded
styles exercise three defects:

- Hidden bars/gaps: **4/4** filtered prototype executions fail a visible
  geometry assertion.
- Collapsed bars/gaps/marks: **4/4** filtered executions fail a visible
  geometry assertion.
- Erased takeaway removal hatch: **2/2** takeaway executions fail the
  required-paint assertion; the reciprocal comparison executions pass **2/2**.
- After all seeded runs and disposal of their browser contexts/styles, a clean
  browser run passes **4/4** executions.

These seeded styles are injected into isolated browser pages and are not
written to source or build output. The advisor's erased-mark finding and the
correction are detailed under Advisor disposition below.

The existing 27 learner route rows are preserved exactly as parsed JSON values
from the pre-repair `HEAD`. The matrix remains 29 declarative rows and expands
to 31 executions, including both prototype witnesses under standard and
reduced motion. Filtered takeaway selection still includes its reciprocal
comparison route and passes all four executions.

### Refreshed evidence and participation

The refreshed evidence folder contains 16 rendered screenshots for four
fixtures × two representations × two viewport heights (360×740 and 360×752);
the screenshots show the standard-motion static endpoint. Its measurement file
contains 32 fixture/representation/viewport/motion records across standard and
reduced-motion browser preferences. All 32 records show zero document
overflow, zero `transitionrun` events, zero `animationstart` events, zero
active animations, and no visible spent operation control. At 360px viewport
width, each whole remains 328px wide. The rendered operation status retains
“Enter the difference.”

Participation evidence uses the nested-denominator fixture for each model.
Keyboard evidence confirms the first takeaway removal is intermediate, its
button remains visible and focused, and the final operation focuses the
numerator. Once complete, the operation button is absent from the tab sequence:
the observed previous/next tab stops are the fixture selector and numerator.
Both prototype operations also completed with Playwright touch gestures, and
their answer controls measured 44px high. Text entry was supplied by the
browser driver; native mobile-device keyboard entry remains untested.

The draft SUB-01 register entry and handling rules remain in the original
report above; `observation-guide.md` remains the one-page guide. No real
learner observations were run or retained. This work does not select a
representation or satisfy owner review of the rendered screens.

### Advisor disposition

- **Branch A: consultation ran.** Requested `gpt-6.1-sol` at medium effort
  through one depth-one read-only advisor call. The advisor's final response
  identified itself as a Codex agent based on GPT-6; it could not independently
  confirm the more specific model override or service tier. The requested call
  settings are observable, but the exact runtime identity is not independently
  verified.
- **Effective posture:** instruction-read-only with post-hoc verification.
  The platform did not establish a structural read-only guarantee. The brief
  prohibited writes and child agents; the advisor reported no files written,
  the primary remained sole writer, and the subsequent status inspection showed
  only the recognized Plan 15 implementation/evidence paths.
- **R1 — completed controls and focus; accepted as satisfied.** The advisor
  inspected the implementation and confirmed the spent button is hidden, the
  duplicate note removed, final-action focus handled in the operation branches,
  and intermediate/retry focus behavior retained. The refreshed keyboard and
  touch participation record verifies the final focus and completed tab order.
- **R2 — removed mark could lose its visual distinction; accepted and
  repaired.** The advisor injected a page-only CSS defect that made removed
  parts use the ordinary shaded fill and removed the hatch/pseudo-mark; all
  four then-current filtered routes passed. I independently verified the
  described failure, changed the takeaway witness to require the rendered
  repeating hatch, and added an `erased-removal-mark` seed. The rerun rejects
  both takeaway motion modes for missing hatch paint while both comparison
  modes pass; hidden/collapsed seeds fail all four route executions, followed
  by a clean 4/4 pass.
- **R3 — configured duration is not executed motion; accepted as satisfied.**
  Unused transition declarations were removed. The evidence now records
  `transitionrun`, `animationstart`, and active animation counts; all remain
  zero under both browser motion preferences.
- **Cost:** one bounded advisor review and one repair/reverification cycle,
  completed within this implementation turn.

### Repair validation and handoff

- `npm test` — **23 test files, 271 tests passed**.
- `npm run build` — learner build (**44 modules**) and standalone prototype
  build (**6 modules**) succeeded in separate outputs.
- `npm run test:routes` — **31 passed, 0 failed**, across 29 rows.
- `node scripts/dev/run-route-matrix.js --filter ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY`
  — **4 passed, 0 failed**, with reciprocal comparison and both motion modes.
- `node scripts/dev/verify-subtraction-visual-witness.mjs` — expected seeded
  failures and subsequent clean **4/4** success as recorded above.
- `node scripts/dev/capture-subtraction-evidence.mjs` — **16 screenshots and
  32 measurements** refreshed; keyboard/touch evidence completed for both
  models.
- Measurement JSON audit — 32 records across all four fixtures, both
  representations, both viewport heights, and both motion modes; zero
  overflow, executed motion, visible spent control, or missing answer
  instruction.
- `node scripts/dev/plan-status.js lint` — `lint: OK (no violations)`.
- `git diff --check` and staged diff check — passed; only expected Windows
  line-ending/config ignore warnings were printed.
- `node scripts/dev/plan-status.js list` — Plan 15 remains `delivered`.
  The required preflight returned `BLOCKED` because the packet was already
  delivered; the user's explicit Repair 01 authorization allowed this bounded
  repair without lifecycle mutation.

Implementation and refreshed evidence were committed first as `9254ae5`
(`fix: repair Plan 15 subtraction prototype evidence`). This report addendum
is being committed separately as the final repository action. No packet
status was changed, and nothing was pushed or deployed. The work returns for
technical re-review; rendered-screen acceptance remains owner-gated.

## Repair 02 addendum (2026-10-02)

This bounded follow-up repairs the two remaining R2 witness gaps in
`repair-01-review.md`. It changes only the browser route runner, seeded visual
verifier, two prototype route assertions, and their route-contract test. The
prototype UI, focus code, CSS/static endpoints, math, learner bundle, and first
27 learner routes were not changed. Screenshots and layout measurements were
not regenerated because neither the rendered product nor measurement script
changed.

### Rendered witness changes

The comparison `.gap-marker` assertion now requires its rendered background
image to contain the repeating hatch, a center point that resolves through
`document.elementFromPoint` to the marker or its descendant, and at least one
positive-width border side with a contrast ratio of 3:1 or greater against
the nearest nontransparent ancestor background. The exact white fill/border
seed therefore fails even though the marker retains its box dimensions and
the route still has a `.gap-marker` element. This tests the rendered bracket
and hatch without using labels or class-name differences as proof.

Required bar, removed-segment, and gap-marker graphics also have a bounded
center hit test. The exact ancestor `clip-path: inset(100%)` seed preserves
computed styles and layout boxes but removes the graphics from hit testing, so
all four route/motion executions fail their visible-geometry assertion. The
check is intentionally bounded to the static Plan 15 prototype selectors; it
does not introduce a repository-wide visibility framework.

The failing-first verifier retains all three earlier defects and adds the two
new review seeds:

```css
.gap-marker { background: white !important; border-color: white !important; }
#representation-visual { clip-path: inset(100%) !important; }
```

Observed results from `node scripts/dev/verify-subtraction-visual-witness.mjs`:

- Hidden graphics: **4/4** prototype executions fail.
- Collapsed graphics: **4/4** fail.
- Erased takeaway removal mark: takeaway fails **2/2**; unaffected comparison
  passes **2/2**.
- Erased comparison bracket/hatch: comparison fails **2/2**; unaffected
  takeaway passes **2/2**.
- Fully clipped representation: **4/4** fail.
- After the seeded runs, fresh unseeded browser contexts pass the clean routes
  **4/4**.

The original 27 learner route rows remain exactly equal to their parsed JSON
values at the pre-repair `HEAD`; the matrix remains 29 rows and 31 complete
browser executions. The filtered reciprocal prototype run passes all four
executions. The existing static endpoint, keyboard-focus, and touch behavior
evidence is untouched.

### Advisor disposition

- **Branch A: consultation ran.** Requested `gpt-6.1-sol` at medium effort in
  a depth-one read-only advisor call. The advisor identified itself as a Codex
  agent based on GPT-6, but could not independently verify a specific model
  SKU, service tier, or higher-tier relationship. The call-site model and
  effort request are known; the exact runtime identity is not independently
  verified.
- **Effective posture:** instruction-read-only with post-hoc verification.
  Structural read-only was not verifiable. The brief prohibited writes and
  further agents; the advisor reported no writes. The immediate post-review
  `git status --short` showed only the four expected Repair 02 files, and the
  primary remained sole writer.
- **White comparison-gap seed — accepted as a valid failure case, fix
  confirmed.** The advisor confirmed the white shorthand removes the gradient
  and the white border loses contrast against the white card. Primary browser
  evidence shows both comparison motion modes fail the paint/contrast check
  while both unaffected takeaway modes pass. No further code change was
  requested after review.
- **Fully clipped representation seed — accepted as a valid failure case,
  fix confirmed.** The advisor confirmed that unchanged rectangles and paint
  declarations can survive the clip, while center-point hit testing observes
  that the graphic is no longer rendered at that location. Primary browser
  evidence shows all four route/motion executions fail, followed by a clean
  4/4 pass. No further code change was requested after review.
- **Earlier seeds and restored run — accepted as preserved.** The advisor
  inspected that all earlier seeds remain and their expected unaffected-route
  pass counts are enforced. The primary reran the complete expanded verifier.
- **Recorded limitations:** center-point hit testing does not prove every
  pixel is visible and can accept partial clipping that leaves the center
  exposed. The border check accepts one sufficiently contrasting side and
  assumes the current prototype's opaque RGB ancestor background; the gradient
  assertion does not independently measure stripe contrast. These bounds
  address the exact fully-clipped and erased-white seeds against the existing
  static prototype CSS and do not claim a general paint oracle.
- **Cost:** one bounded advisor response and one implementation/verification
  cycle, completed within this turn.

### Validation and handoff

- `npm test` — **23 files and 271 tests passed**.
- `npm run build` — learner build (**44 modules**) and separate prototype
  build (**6 modules**) passed.
- `npm run test:routes` — **31 passed, 0 failed** across 29 rows.
- `node scripts/dev/run-route-matrix.js --filter ROUTE-PROTOTYPE-SUBTRACTION-TAKEAWAY`
  — **4 passed, 0 failed**, including reciprocal comparison and both motion
  modes.
- `node scripts/dev/verify-subtraction-visual-witness.mjs` — all five seeded
  outcomes matched the required route/motion failures and unaffected-route
  passes; clean run passed **4/4**.
- Parsed route comparison — **29 total rows**, with the original 27 learner
  rows unchanged.
- `node scripts/dev/plan-status.js lint` — `lint: OK (no violations)`;
  `git diff --check` and staged diff check passed.
- `node scripts/dev/plan-status.js list` — Plan 15 remains `delivered`. The
  preflight reported `BLOCKED` because the packet is already delivered; the
  user's explicit Repair 02 request authorized this scoped follow-up without
  changing its status.

Implementation and verification changes were committed first as `1848419`
(`test: reject clipped Plan 15 subtraction graphics`). This Repair 02 report
addendum is committed separately as the final repository action. No status
was changed, and nothing was pushed or deployed. **Ready for technical
re-review: yes; owner rendered-screen acceptance remains pending.**
