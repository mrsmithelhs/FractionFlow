# Plan 26 implementation progress

Date: 2026-10-10

Disposition: implementation and evidence prepared for technical and owner review. Plan status remains `in-progress`.

## Gate and scope

Plan 26 preflight returned `RUNNABLE`. Requirement 0 investigation was recorded in
`mechanism-review.md`; FF Orch 12+ approved the bounded execution mechanism in
commit `a1520f8` before source edits. DECISION-041 remains accepted and was not
reopened. No packet status, decision, review disposition, publication, or deploy
was changed.

Implementation is limited to the approved fixed set and lifecycle:

1. `2/3 + 1/4`, unchanged, first.
2. `1/2 + 1/3 = 5/6`, second.

The second item is fixture
`curated-relatively-prime-addition-one-half-one-third@plan26-fixtures-v1`,
registered as `one-half-plus-one-third` in set
`unlike-addition-vetted-set@1`. It retains
`phase-2-unlike-proper-addition-reflection@3` and the existing replay schema.
Navigation is app-owned. No generated practice, family, task, beat schedule,
session, replay envelope, progress storage, or learner tracking was added.

## Content admission and behavior

The admitted common denominators are 6 (scale factors 3 and 2) and 12 (scale
factors 6 and 4). The authored matching records preserve stable `match-a/b/c`
identities: `2/6`, `3/6`, `4/6` for sixths; and `5/12`, `6/12`, `7/12` for
twelfths. The matching validator confirms exactly one equivalent choice for
each path. Premise records use `2/6` as false/no and `6/12` as true/yes. Their
answers are checked with exact math-core fraction equality rather than trusted
from metadata. Eligible-path closure and every registered condition are checked
before a set item can start or advance.

Both premise and matching accessors check the fixture and authoring revision.
Missing, unknown, or mismatched revisions and missing denominator routes return
`null`. The prior fixture's facts and object identities were left unchanged.

Next is available only after the active episode resolves. The app constructs and
validates the candidate before it changes the current index, episode, or transient
UI state. A corrupt candidate shows a focused recovery notice and leaves the
known completed episode and its replay identity in place. Retry rebuilds the
active item. Return and re-entry rebuild the first item. Successful resets clear
episode work, replay/helper UI, drafts, schedule bookkeeping, and pending focus
preservation while retaining the selected condition, support level, and access
view. An injected test instance remains outside the registered set and has no
Next or exhaustion state.

At final completion the Next control is absent and one status reads “You’ve tried
both problems.” Retry and Back to start remain available. Focus moves to the
episode landmark after a successful reset, to the exhaustion status only on the
completion transition, and to refusal after a failed Next. An ordinary app
rerender does not move focus from the learner's current control.

## Verified evidence

- `npm test`: 28 test files, 319 tests passed. The Plan 26 suite has 8 tests for
  exact admission/truth validation, revision and route refusal, replay
  reconstruction at both denominators and condition types, mounted Next/Retry/
  return/re-entry, injected-instance isolation, exhaustion focus, and transactional
  refusal.
- `npm run build`: learner app and subtraction prototype builds succeeded.
- `node scripts/dev/plan-status.js lint`: `lint: OK (no violations)`.
- `node scripts/dev/plan-status.js check 26`: `RUNNABLE: plan-26 is ready to implement`.
- Focused Plan 26 Edge routes: 3 passed, including no Next before reflection is
  completed, the full two-item/keyboard-Next/exhaustion/return journey, and the
  larger CSS viewport witness.
- Full Edge route matrix: 56 browser executions passed across 54 route rows.
  It includes the existing reduced-motion, focus, Inspection Mode, and support
  profile coverage plus the three Plan 26 rows. The Plan 26 journey used Edge at
  the narrow 360x740 CSS viewport, visible fraction-track data to verify operands
  actually change, keyboard Enter on Next, then mounted return and re-entry.
- Route contract: 54 rows, 52 learner routes, and 56 expanded executions. No
  existing route row or oracle was weakened.
- `git diff --check` passed. The only working changes are the scoped Plan 26
  implementation, tests, route checks, and this report.

### Rendered viewport measurements

Measurements came from Microsoft Edge with Playwright CSS viewports, default
browser zoom, and the app's rendered DOM. These are CSS viewport observations;
1366x768 is a representative Chromebook-sized CSS viewport, not a physical
Chromebook test.

| CSS viewport | Document size | Horizontal overflow | Vertical scroll range | Observed rendered boxes |
|---|---:|---:|---:|---|
| 360x740 | 360x1134 | None (`scrollWidth=360`) | 394 px | Question 234x50.38 px; active controls 234x288 px; fraction track 218x44 px; view switch 155.81x44 px |
| 1366x768 | 1366x795 | None (`scrollWidth=1366`) | 27 px | Question 692x25.19 px; active controls 692x44 px; fraction track 676x44 px; view switch 155.81x44 px |

At 360x740 the active controls extend about 50 px below the initial viewport and
the document provides a 394 px vertical scroll range; the question, controls,
tracks, and view switch remain in the rendered document without horizontal
overflow. At 1366x768 the measured task and controls fit within the viewport, with
27 px of ordinary document scroll range. Route assertions enforce visible
minimum sizes for tracks and controls. The browser route invoked Playwright's
scroll-into-view behavior, but the document stayed at `scrollY=12`; a physical
wheel or touch-scroll gesture was not measured. No browser zoom variation,
physical touch hardware, physical Chromebook, or assistive technology was tested.
The Plan 26 completion journey is a standard-motion run; reduced motion behavior
is covered by existing matrix routes, not a second full Plan 26 journey. Browser
route clicks are mounted non-drag interactions; the Next action was separately
activated with keyboard Enter.

## Architecture note for future bounded work

The one-time work is the app-owned fixed-set lifecycle: resolve a registered
identity, check completion, prepare the next episode before replacement, clear
per-episode UI state, and handle exhaustion/refusal/focus. A future third vetted
item would mainly add a new immutable fixture, its supported identity/revision,
and authored premise/reflection rows with matching validation/tests. The runtime
navigation does not branch on fixture identity; the explicit fixture/revision
maps live with authored task data. A test helper selects an expected matching
response by fixture identity, but it is not learner runtime behavior.

The repeated premise/reflection choices could be represented more compactly in a
future authoring tool, but that abstraction is outside this packet. The current
authoring bottleneck is choosing pedagogically useful, truth-valid premise and
matching forms for every admitted denominator and assigning stable identities;
fraction arithmetic and set navigation are already shared. Any authoring
abstraction should be a separate bounded content/validation proposal after this
set is accepted, with no automatic generation of learner practice.

## Advisor consultation disposition

- Requested: `gpt-6-astra` reviewer at depth 1.
- Observed: advisor reported “Codex, based on GPT-6” from its runtime
  instructions. It could not independently verify the exact deployed model
  variant; the requested tier is therefore recorded as unverified by the
  advisor's self-report.
- Effective posture: instruction-read-only with post-hoc verification. The
  provider's capability record says the workspace sandbox cannot structurally
  enforce read-only behavior for a Codex child. The brief prohibited edits and
  further delegation. The immediate post-consultation status/diff check showed no
  additional files or changes beyond the primary's scoped working set.
- Findings and disposition:
  1. Advisor reported no blocking defect and requested an injected-instance
     regression test. Accepted. Added a mounted test that completes an injected
     instance, confirms Next/exhaustion remain unavailable, and checks Retry
     against a separately constructed fresh episode; targeted and full tests pass.
  2. Advisor corrected the route evidence: the second browser journey uses the
     alternate 12ths path, not canonical sixths. Accepted and reflected above;
     no source change was needed.
  3. Advisor noted the brief's sample distractor `1/6` did not match the actual
     authored record. Verified current data: choices are `2/6`, `3/6`, `4/6`,
     with `3/6` as the sole equivalent form. The report now records the actual
     artifact; no source change was needed.
- Rejected findings: none.
- Cost: one reviewer turn, approximately one minute of additional wall time.
  The reviewer performed a static critique and did not rerun tests or routes.

## Remaining review boundary

Implementation and evidence are ready for FF Orch 12+ technical review and the
separate owner rendered-screen/agency acceptance. This report does not assert
independent transfer, physical-device or assistive-technology performance,
publication readiness, or Plan 26 completion. No push or deploy occurred.

## Repair 01 update — technical submission for re-review

Date: 2026-10-10. This addendum records the bounded repair authorized in
`repair-01.md`. The root-controlled packet status remains `delivered`; no status,
owner decision, review disposition, publication or deployment was changed.
DECISION-041 remains accepted, and no additional practice content or selection
behavior was introduced.

### Admission and transactional refusal

`validateAuthoredMatchingChoices` now requires at least three choices and checks
the supported fraction-bar range before mathematical equivalence: safe-integer
numerator and denominator, numerator from zero through denominator, and positive
denominator. This matches the existing visual renderer's contract while
preserving exact wire/math validation, choice identity and the exactly-one-
equivalent rule.

Failing-first tests showed that two choices did not previously throw and that a
mounted Next accepted the corrupt second item. The repaired tests cover both a
two-choice fault and a 7/6 distractor. Before Next, they save the completed first
episode and replay envelope; after refusal, both identities remain unchanged,
the refusal notice receives focus, and Retry and return remain enabled. Clearing
the test-only module fault permits a successful Next. No production fault flag
or test data was added.

Admission tests also reject a negative numerator, unsafe integer numerator or
denominator, noninteger numerator, and a nonpositive denominator. They accept
the inclusive presentation boundaries 0/6 and 6/6. The checks keep the exact
fraction contract separate from the renderer's bounded fraction-bar range.

The reset regression now accumulates a wrong notice response, accepted
conversion work, an incorrect equivalent numerator, task-local help and a
multiplier draft, and active Replay state. Retry is compared by full deep
equality with an independently constructed fresh episode; the draft, recovery
feedback and Replay state are cleared.

### Browser evidence

The new reproducible Edge script is
`evidence/capture-plan26-repair-01.mjs`. It runs five representative journeys
across the four registered conditions and collectively covers both views,
support profiles, standard/reduced motion, second-item denominators 6 and 12,
and both premise outcomes. It includes a keyboard journey that tabs from the
view control to Next before activating it with Enter. During Repair 01, the
touch-enabled context used an actual non-drag `touchscreen.tap` for Next while
its lesson controls and return/re-entry used mouse clicks; Retry was exercised
in the separate keyboard configuration. Root identified that gap during Repair
01 re-review. Repair 02 addresses it below. Browser text entry is automated.

The runner writes only selected journey metadata and names filtered outputs
separately. A refusal-only capture wrote its own file while the canonical
five-journey measurement file remained unchanged.

The refusal browser harness changes only the served JavaScript response in
memory to simulate each corrupt authored record. It confirms that the completed
reflection remains rendered, refusal copy is concise, focus moves to the notice,
Retry and return remain available, and view/motion rerenders do not repeatedly
steal focus. The separate mounted module-fault tests establish replay identity
preservation and same-app recovery after the injected fault is cleared.

The Edge run produced 64 screenshots and 78 measurement/focus records in
`evidence/`. Captures record CSS viewport, default zoom context, device-pixel
ratio, view, condition, support, motion, current scroll position, question and
control boxes, navigation, expression, document overflow, and visible copy.
Each journey is represented at 360x740 and 1366x768. Screens include the new
item, reflection before response, completed/Next-ready first item, exhaustion,
refusal and Retry's pre-reset work; additional records capture reflection
controls at the initial and scrolled positions. Screens reviewed at both sizes
show no duplicated lesson heading, exposed matching answer or spent Next state.
The narrow reflection controls extend below the first viewport but become fully
reachable by ordinary scrolling. All captures report zero horizontal overflow.

The route matrix was not edited. Parsed rows excluding the three existing
Plan 26 rows compare equal and in order to all 51 rows at `318c79f`.

### Repair verification and limits

- Focused Plan 26 suite: 10 tests passed, including both failing-first admission
  cases, mounted faults, refusal and recovery.
- Full suite: 28 test files and 321 tests passed.
- `npm run build`: learner and subtraction-prototype builds passed.
- Full Edge matrix: 56 executions passed across 54 route rows.
- `node scripts/dev/plan-status.js lint`: passed.
- `git diff --check`: passed.
- Baseline comparison: all 51 pre-Plan 26 route rows equal `318c79f`.

Edge viewport evidence is not physical Chromebook or mobile-device evidence.
Automated text entry is not native mobile-keyboard evidence. No assistive-
technology behavior, learning transfer, engagement or publication readiness is
claimed. Owner rendered-screen/agency acceptance remains separate from this
technical repair submission.

### Advisor consultation disposition

Repair 01 used a read-only higher-tier reviewer. The reviewer found no blocking
source or mounted-test defect and identified a low-priority evidence-runner
issue: a filtered run could write a partial journey list to the canonical
measurement path. That correction is applied: filtered runs now record their
filter and selected journeys in a separate filename, while a full run alone
writes the canonical file. The reviewer also recommended tighter numeric-range
cases and keyboard navigation that does not rely on Playwright's locator
auto-focus; both were added. I reran the full suite, build, route matrix and
full browser evidence after these corrections. The reviewer did not independently
rerun those commands. The reviewer did not receive permission to edit files,
change packet status, publish or deploy.

## Repair 02 update — evidence-only submission for re-review

Date: 2026-10-10. This addendum addresses the bounded gaps listed in
`repair-01-review.md` and authorized in `repair-02.md`. The admission fix remains
accepted. No product source, route row, packet status, owner decision, review
disposition, publication or deployment changed.

### Sequential touch journey

The existing medium-support linear journey now uses Playwright touchscreen taps
for settings, entry, encounter and lesson controls, final reflection answer,
Next, Retry, the exhaustion view toggle, return and re-entry. Each target is
scrolled into the CSS viewport, checked for visible bounds, and paired with a
one-shot click-path observer that confirms the event reached that mounted
target. Numeric fields are tapped, with click delivery confirmed, before
automated text entry. This remains automated browser touch context, not
physical-device or native-keyboard evidence.

The full five-configuration/two-viewport Edge run recorded 100 confirmed touch
actions. The touch journey includes a dirty Retry on the second item while
Replay remains active: it records the incorrect notice response, accepted
conversion help, an incorrect numerator followed by an accepted numerator, a
right-side multiplier draft, and active Replay. After Retry, the browser checks
the fresh second-item encounter and operands, absence of numeric/helper/recovery/
Replay residue, retained condition/support/view settings, episode focus and the
first Tab destination. It then completes the set, returns, and re-enters; checks
confirm the original first-item operands, clean encounter UI, retained settings,
view and focus.

### Independent state and scroll evidence

The mounted journey test now compares the Next state to an independently
constructed `createEpisode` for `secondInstance()` using the original episode
definition, condition and support. After return/re-entry it compares the full
state to a newly constructed episode from the saved original first-item content
and configuration, and checks original operand identity plus clean mounted UI.

After each of the ten existing reflection scrolls, the browser evidence runner
asserts that the full question and active-control bounding boxes have positive
size and fit within the CSS viewport. It continues to record dimensions and
horizontal overflow, without requiring page scroll to be zero.

The refreshed canonical evidence contains 184 measurement/focus/action records
and 68 screenshots across the same five configurations and two viewport sizes.
All 100 touch records confirm the intended target received the click, and all
ten post-scroll question/control checks passed. A touch-only filtered run wrote
its 120 records to a separate filtered measurement file without replacing the
canonical five-journey result.

### Verification and advisor disposition

- Focused Plan 26 suite: 10 tests passed, including full fresh-state comparisons
  for Next, Retry and return/re-entry.
- Full suite: 28 test files and 321 tests passed.
- `npm run build`: learner and subtraction-prototype builds passed.
- Full Edge matrix: 56 executions passed across 54 route rows.
- Full Repair 02 Edge evidence: five journeys at two viewports; 184 records and
  68 screenshots.
- `node scripts/dev/plan-status.js lint` and `git diff --check`: passed.
- Parsed route baseline check: all 51 pre-Plan-26 rows remain exactly equal and
  ordered as at `318c79f`.

A read-only higher-tier advisor reviewed the Repair 02 test/verifier diff and
found no additional blocking gap after identifying two corrections: touch the
final reflection response and require full question/control bounds within the
viewport. Both are applied and the full evidence was refreshed. The advisor ran
read-only `rg`, `Get-Content`, `git diff` and `git status` inspections only; it
ran no tests, builds, route matrix, browser capture or mutation commands. The
requested model was `gpt-6-astra`; the advisor self-identified as Codex based on
GPT-6 and could not independently verify the exact deployed variant. The advisor
did not edit files or change status. Owner rendered-screen/agency acceptance is
separate. Physical touch devices, native keyboards, assistive technology,
learning transfer and engagement remain untested.
