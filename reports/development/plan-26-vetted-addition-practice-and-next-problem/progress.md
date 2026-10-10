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
