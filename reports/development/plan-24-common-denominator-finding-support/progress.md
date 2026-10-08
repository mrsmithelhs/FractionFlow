# Plan 24 — Common Denominator Finding Support

Date: 2026-10-07
Packet preflight: `RUNNABLE`
Current stage: Requirement 0 investigation and mechanism proposal; source work has not started.

## Overall summary

The current registered practice is the curated `2/3 + 1/4` episode. Its decide
beat offers denominator suggestions under more support and a numeric entry under
less support. The existing `Need help?` action is mounted in the app-level support
panel after both the visual and linear hosts. A request records a generic help
level, which each renderer displays as a short paragraph in the active beat. The
action is not beside the denominator question or response.

I recommend one optional, task-local strategy cue that names multiplying the two
denominators as one way to find a common unit. The learner still submits a common
denominator through the existing response; the response is never scored as a
multiplication exercise. Valid non-least choices remain valid. After an assisted
choice, a short, denominator-only explanation is available in the completed
decide summary. This is a proposal for orchestration/owner review, not an approved
source mechanism. I am stopping before source work.

## Investigation evidence

### Current placement

A local Edge/Playwright browser observation advanced through the mounted encounter
and notice steps and verified the decide prompt before reading bounds. At both
360×740 and 360×752, the coordinates below were unchanged. The help button is 44px
tall; its top is 155.59px below the bottom of the active decide controls.

| Path and support | Question bounds | Response-control bounds | Existing help button top | Document height |
|---|---:|---:|---:|---:|
| Visual, more support | y=432.72–508.28 | y=539.22–583.22 | y=738.81 | 915px |
| Visual, less support | y=432.72–508.28 | y=539.22–634.22 | y=789.81 | 966px |
| Linear, more support | y=422.56–498.13 | y=532.13–576.13 | y=731.72 | 908px |
| Linear, less support | y=422.56–498.13 | y=532.13–627.13 | y=782.72 | 959px |

All eight browser observations reported a 360px document width and no horizontal
overflow. At both packet viewport heights, the existing help action begins below
the initial viewport. The response field/group and question fit in the initial
view. This measures browser CSS geometry, not physical-device behavior. A prior
visual baseline capture is available at
`reports/development/plan-13-scaffold-fading-made-real/evidence/medium-decide-360x740.png`;
it shows the global help control after the active task and completed-step area.
No new screenshot was captured for this Requirement 0 observation.

The initial live measurement attempt stopped at the opening encounter beat and
was discarded. The reported measurements are from the corrected run, which
explicitly checked that the active prompt contained “Choose a common denominator”.
The temporary measurement script was removed after use; no server or browser
process remains running.

### Current task and governing boundaries

- `src/app/practice-types.js` registers only `sum-under-one`, backed by the
  curated `2/3 + 1/4` practice. The supported authored denominator paths are 12
  and 24.
- High support presents eligible candidate denominators; medium support asks for
  a number from 1 to 99. Both use the existing `propose-common-denominator` path.
- `classifyCommonDenominatorResponse` and `evaluateTaskPathClosure` already
  distinguish invalid math from a valid but unsupported task path. Plan 22 keeps
  36 at denominator entry and permits recovery rather than mounting unsupported
  conversion/reflection work.
- DECISION-035 keeps internal task variations out of learner-facing taxonomy.
  DECISION-036 preserves valid common denominators and the honest task boundary.
  DECISION-037's focused nested renaming decision does not authorize general
  nested-family unit choice. DECISION-039 excludes a needless conversion check
  from like-denominator work. Plan 25 separately owns requested equivalent-
  numerator help.
- The founding instructional model treats denominators as units and leastness as
  an efficiency goal. Roadmap §§19/21/28 call for learner responsibility and
  layered help. OQ-27 and the design brief explicitly leave the source mechanism
  gated.

### Strategy comparison and recommendation

**Guided multiples:** Ask the learner to extend one denominator's multiples and
check whether a candidate is also a multiple of the other denominator. For 3 and
4, the search can reach 12. This makes “shared multiple” concrete, but needs
repeated substeps and may expose a growing list or encourage stopping only at the
first (least) shared multiple. Handling arbitrary counts would expand this packet.

**Product reasoning as a cue (recommended):** Suggest multiplying the two
denominators, but ask the learner for a common denominator. Do not add a separate
`3 × 4 = ?` quiz or grade denominator responses as multiplication answers. Thus
12 and 24 are both accepted as common denominators, while 36 reaches the existing
valid-but-unavailable boundary. For investigation only, denominators 4 and 6 show
the strategy tradeoff: their product 24 works, while 12 is a smaller shared
multiple. This comparison does not add a 4-and-6 learner route or broaden content
reach.

This is the smaller first mechanism for the registered problem and does not
require a new math primitive or a new intent. Exact response validity and task
closure remain upstream through the existing math/interaction path. It is not
evidence of general independent denominator discovery or a claim that product
reasoning is the most efficient strategy for all denominators.

## Proposed bounded mechanism — awaiting approval

1. **Closed:** keep the current common-denominator response available, with the
   single `Need help?` entry beside or immediately below it in both visual and
   linear paths. While decide is active, do not show a competing help button in
   the app-level support panel.
2. **Open:** the same button becomes `Close help`; show this single compact cue
   beside the response: **“Try multiplying 3 by 4 to find one common denominator.”**
   Keep the original prompt **“Choose a common denominator for both fractions.”**
   and its existing response control. This cue is one strategy, not a separate
   `3 × 4 = ?` quiz. Do not add a multiplication field, product grader, or
   denominator autofill.
3. The exact common-denominator response outcomes remain distinct:

   | Learner enters | Classification | Recovery/result and next state |
   |---|---|---|
   | 8 | Invalid: multiple of 4, not 3 | “8 is a multiple of 4, but not 3. Try another number.” Remain at decide; response control stays available. |
   | 10 | Invalid: multiple of neither | “10 is not a common denominator. Try another number.” Remain at decide. |
   | 12 | Valid, supported least choice | Accept existing response and advance to the first transform. |
   | 24 | Valid, supported non-least choice | Accept existing response and advance to the first transform. Never describe 24 as wrong for not equaling 3 × 4. |
   | 36 | Valid mathematically, unsupported here | Use Plan 22's “36 is a valid common denominator, but this practice cannot use it. Try another number.” Remain at decide; do not mount transform/reflection. |

   Use existing upstream `classifyCommonDenominatorResponse` and
   `evaluateTaskPathClosure`; renderers do not compute validity. The “product”
   is never a separately submitted or graded response.
   On 8/10, replace the initial cue with local recovery so the active task does
   not repeat the same hint. On 12/24, accept the original response, close the
   active help workspace as the beat advances, and begin transform. On 36, stay
   at decide with Plan 22's response recovery; do not mount the next task.
4. **After selection:** show the selected-unit explanation only if help was
   requested at decide. Once denominator submission advances to transform, put a
   closed native `<details>` disclosure in the completed decide summary:
   **“Why does 24 work?”** It opens to **“24 is 8 groups of 3 and 6 groups of
   4, so both fractions can use twenty-fourths.”** For 12, use **“12 is 4 groups
   of 3 and 3 groups of 4, so both fractions can use twelfths.”** These are
   denominator-only explanations; do not show `16/24` or `6/24`. Do not append
   explanation text to every transform or show it on unaided routes. Plan 25
   retains equivalent-numerator help.
5. Opening dispatches the existing `request-help` intent and uses its existing
   help/provenance history. Closing the inline workspace is presentation-only.
   The helper has no separate semantic substeps or learner input; the meaningful
   contribution is the existing common-denominator response. App-local
   `helpOpen` and the unsubmitted denominator draft are view-local UI state:
   preserve the draft across help remounts, close/reopen, and view switches, but
   omit it from episode truth and replay. Retry, return/re-entry and fresh
   episodes start closed with no stale draft.
6. Do not add helper intents, persisted state, a math primitive, or a new top-level
   beat. Therefore no episode-definition revision or replay-schema change is
   proposed: registered revision 1 and revision 2 keep their existing reducer
   intent contracts and full replay behavior; `request-help` remains the only
   assistance intent. Existing response provenance records help history and
   classifies the later response as supported-construction. Their existing
   `INTENT_KEYS` whitelist continues to allow the existing `request-help` and
   common-denominator intents and reject unknown intent shapes; no new helper
   intent is admitted. If source work proves that a new semantic intent/state is
   necessary, stop for a revision-3 mechanism decision rather than adding it
   under this proposal.

### Candidate exact implementation scope after approval

- Validated selected-unit/help-request projection and learner strings:
  `src/interaction/scene.js` and `src/render/strings.js`. Project the per-beat
  help request from existing `helpHistory` and selected-unit proof values from
  the validated denominator classification; renderers only format those values.
- One visible help entry point, app-local open/draft state, and visual/linear
  rendering/layout:
  `src/app/app.js`, `src/render/beat-container.js`, `src/render/linear-path.js`,
  `src/app/styles.css`, and `src/styles/render.css`.
- Focused tests: `tests/interaction-episode.test.js`,
  `tests/interaction-scene.test.js`, `tests/interaction-provenance-replay.test.js`,
  `tests/route-contract.test.js`, and additive witnesses in
  `tests/routes/route-matrix.json`. Add a Plan 24 evidence-capture script only if
  needed to produce repeatable visual/linear measurements and screenshots.
- No new helper file and no change to `src/interaction/episode-definition.js`, `src/interaction/episode.js`,
  `src/interaction/provenance.js`, `src/interaction/replay.js`, or `src/math/` is
  proposed. Existing request-help history, response provenance, replay, exact
  common-denominator classification and Plan 22 task-path closure should own
  behavior. If approved behavior cannot be implemented within those contracts,
  stop and propose that change separately before adding state or a math primitive.

## Falsifying evidence proposed for the post-approval implementation

- On the actual mounted decide task, prove the one visible help entry is adjacent
  to the response area in visual and linear paths at 360×740 and 360×752. Capture
  screenshots and measured question, response, help-button, and open-workspace
  bounds; include document overflow and control/touch-target bounds.
- Show common-denominator response semantics, not a product quiz: reject one-sided
  8 with targeted recovery, reject 10 as non-common, accept 12 and 24, and keep
  valid-but-unavailable 36 at the Plan 22 boundary. Complete the authored route
  without supplied equivalent numerators.
- Open and close help with a nonempty, unsubmitted denominator draft and verify
  the exact value remains. Verify reset, return/re-entry, and replay have no stale
  helper state. Compare full replay results for existing definition revisions.
- Prove rev1/rev2 learner-intent shapes and reconstructed states remain unchanged:
  no helper intent is introduced, and app-local `helpOpen`/draft state never
  enters replay.
- Verify keyboard, non-drag touch, reduced-motion and linear participation using
  real mounted controls/gestures. Include negative controls for answer leakage,
  duplicate help entries, invalid promotion, unavailable-path advance, and lost
  input. State browser/physical-device and assistive-technology limits.
- Run focused and full tests/build/routes, packet lint, and `git diff --check` only
  after mechanism approval and source implementation.

## Advisor consultation disposition

**Branch B — advisor-capable, consultation not warranted for this gate.** A
callable subagent tool is available in this Codex surface; the capability file
marks Codex subagent tier override as advisor-capable, with structural read-only
not verifiable. This artifact is a prose-only Requirement 0 investigation, so a
behavioral artifact consultation is not yet warranted. After approved behavioral
source work, run the required Sol-class read-only consultation under the owner's
authorization, inline the actual diff, and record the requested/observed model,
instruction-read-only posture, immediate post-consultation status check, every
finding's disposition, and coarse cost.

## Commands and results

- `node scripts/dev/plan-status.js check plan-24` — **RUNNABLE** before and after
  the restart.
- `git status --short` — empty before this report was created.
- Read-only `rg`/PowerShell inspection of the required Plan 24 references, current
  task registration, help reducer/projection/renderers, exact math APIs, replay
  identity, route/test locations, and Plan 22/13 evidence — completed.
- Local headless Edge/Playwright UI observation — eight corrected mounted decide
  measurements across two support profiles, two views and two viewport heights;
  results are tabulated above. This was a UI measurement, not a test-suite run.
- No repository tests/builds were run. No source files or packet lifecycle fields
  were changed.

## Files and artifacts

- Created: `reports/development/plan-24-common-denominator-finding-support/progress.md`
  (this Requirement 0 report and mechanism proposal).
- Source files changed: none.
- New screenshots/evidence files: none. The live geometry measurements above are
  recorded in this report; the cited Plan 13 screenshot is pre-existing.

## Problems encountered

- Before the computer restart, ordinary shell startup failed with
  `helper_unknown_error: setup refresh had errors`. After the owner's restart,
  the same ordinary PowerShell path launched successfully; preflight and working-
  tree inspection were rerun.
- The first live browser attempt measured the opening encounter instead of the
  decide step. It was discarded, and the corrected observation advanced through
  encounter and notice, verified the decide prompt, and then measured the bounds.
- The corrected local Edge run required the elevated shell because the sandboxed
  launch could not create Edge's temporary profile. The elevated run was limited
  to localhost UI measurement; it left no script, server, or browser process.

## Remaining gates and status

Ready for orchestrator mechanism review: **yes**. Source implementation: **not
authorized until this mechanism gate is approved**. Owner rendered-screen and
agency acceptance, technical delivery review, packet status changes, and
deployment remain separate gates. No child/learner usability or efficacy claim
is made from browser automation.

---

## Post-approval implementation and delivery evidence (2026-10-07)

The orchestrator's written Requirement 0 approval is recorded in the handoff
material referenced above. I implemented that bounded mechanism without changing
the packet's lifecycle fields, episode definition, reducer, math layer, replay
schema, or task provenance contracts.

### Implemented behavior

- The existing **Need help** control moves into the active decide controls in
  either visual or linear view, beside the denominator response. Opening it records
  the existing `request-help` intent and reveals one local prompt. It does not
  enter the learner's current response, auto-submit, list every matching number,
  or supply later equivalent numerators. Closing the prompt adds no help intent.
- The unsubmitted denominator and its focus survive open/close and visual/linear
  switches. Fresh practice, retry, return, and leaving decide clear the local help
  state and draft. The app-local state is not part of replay or episode history.
- A one-sided multiple such as 8 receives targeted recovery; 10 remains an
  ordinary non-common denominator; 12 and authored alternate 24 remain valid;
  valid but unavailable 36 remains blocked at the Plan 22 task-path boundary.
  When help was requested, the completed task can disclose a closed explanation
  of the selected unit using the validated authored scale factors. It does not
  reveal the upcoming converted numerators.
- The help control now exposes `aria-expanded` and `aria-controls` while the
  prompt is present; the prompt is a polite status region. Unit tests assert the
  open/closed relationships. No screen reader was used, so announcement behavior
  remains unverified in assistive technology.

### Advisor consultation disposition

**Branch A — consultation ran.** Requested `gpt-6-sol`; the advisor self-reported
Sol-class, while the exact runtime variant could not be verified from the tool
surface. The bounded critique was instruction-read-only; structural read-only
could not be verified, so I checked the working tree immediately after
consultation. That check showed only the primary implementer's known Plan 24
source/test changes and evidence artifacts; no advisor-created or unexpected
files appeared. The primary remained the sole writer.

1. **Replay drift concern — rejected as inapplicable.** The advisor hypothesized
   that local open-help state could survive a replay rewind. Independent source
   inspection of `handleReplay` in `src/interaction/episode.js` shows it only
   appends replay/support history at the current beat; it does not rewind or
   replace episode state. In `src/app/app.js`, replay only toggles the current
   scene at a beat with an established conversion. Help open state is cleared
   when leaving decide and on fresh practice, retry, and return. There is no
   replay cursor or rewind path for this state to survive.
2. **Help discoverability/accessibility concern — accepted and changed.** The
   advisor noted that a live cue without an explicit expanded relationship left
   the button's state unclear to assistive technology. The cue now has a stable
   id and `role="status"`; while it is visible, the button has
   `aria-expanded="true"` and references it with `aria-controls`. Tests cover
   open and closed states. Actual assistive-technology behavior remains untested.
3. **Authored factor projection concern — accepted as a verified dependency; no
   production change needed.** The advisor questioned whether selected-unit
   factors could be detached from authored paths. Independent inspection of
   `src/content/validation.js` confirms each path is checked with exact common
   denominator validation, exact conversions/results, and contract comparison
   against regenerated canonical and alternate paths; the instance's full
   classification must match the recomputed classification. I added scene tests
   asserting canonical 12 factors (4 and 3) and authored alternate 24 factors
   (8 and 6).

Coarse consultation cost: one additional advisor turn, roughly one minute. The
advisor did not edit files or run commands.

### Verification and captured artifacts

- `npm test` — **25 files and 293 tests passed** after the accessibility update.
- `npm run build` — **passed** for both the learner application and subtraction
  prototype.
- `node scripts/dev/run-route-matrix.js --filter ROUTE-PLAN24` — **2/2 passed**.
- `node scripts/dev/run-route-matrix.js` — **48/48 browser executions passed**
  across 46 route rows, including Plan 22 boundary witnesses.
- `node scripts/dev/capture-plan-24-evidence.mjs` — **20 screenshots and
  measurements captured** for high/medium support, visual/linear views, and
  360×740 / 360×752 viewports. The repeatable capture script and results live in
  `scripts/dev/capture-plan-24-evidence.mjs` and this report's `evidence/`
  directory. Measurements show no horizontal document overflow, and the
  denominator question, response, and help button remain together. In medium
  support the full open cue extends roughly 26–46 pixels below the tested
  viewport, depending on height/view; a short scroll is needed to read all of it.
  This is recorded for the owner screen review rather than treated as fully
  above-the-fold copy.
- `node scripts/dev/plan-status.js lint` — **OK, no violations**;
  `node scripts/dev/plan-status.js check plan-24` — **RUNNABLE**;
  `git diff --check` — **no whitespace errors** (Git emitted only its usual
  LF-to-CRLF working-copy notices).
- Normal sandbox Edge launch still fails while writing the temporary profile
  (`error = -5`). The repository's local Playwright/Edge commands passed when
  retried through narrowly elevated execution. The original post-restart shell
  issue no longer occurs; tests and both builds also passed without elevation.

### Commit, remaining limits, and handoff

- Scoped implementation and evidence commit: `1d4b141` — `Implement Plan 24
  common denominator help`.
- Git metadata writes remain restricted in the ordinary sandbox: `.git/index.lock`
  was absent, and `git add --refresh -- .` still returned `Permission denied`.
  The documented elevated path staged only the explicit Plan 24 paths and made
  the local commit. No push was performed.
- Evidence uses Playwright on desktop Edge. Touch was a Playwright tap in a
  touch-enabled browser context; keyboard used a mounted control. No physical
  device, native on-screen keyboard, assistive technology, or learner study was
  used. No independent-discovery or efficacy claim is made.
- Implementation is ready for orchestrator technical delivery review. Owner
  rendered-screen/agency acceptance, packet status change, and deployment remain
  separate gates. This implementer did not edit packet frontmatter or review
  dispositions.

---

## Delivery Repair 01 (2026-10-07)

Addressed the two bounded findings in `delivery-review.md` without changing
instructional state, renderer mathematics, replay, or the learner family surface.

- **Projected denominator copy:** `findingHelpCue` is now a string formatter
  taking the left/right source denominators from the current projected scene.
  The app uses its latest scene when placing the cue after a view switch. The
  canonical 3-by-4 wording is unchanged. A mounted-app test supplies only a
  test-local 1/2 + 1/3 curated instance and verifies 2-by-3 copy; scene tests
  verify both canonical and noncanonical denominator projections. This fixture
  is not reachable from the learner practice registry.
- **Comparable route controls:** restored `sameMotionMode: true` to
  `ROUTE-PLAN22-36-MATCHING-VISUAL`. Both Plan 24 routes now use
  `standard-motion`, matching their support-profile decide comparators, and mark
  `sameMotionMode: true`. A route-contract assertion checks all three route and
  target pairs.
- Existing screenshots were not regenerated because the canonical cue text and
  rendered layout remain unchanged.

### Repair advisor disposition

**Branch A — read-only consultation ran.** Requested `gpt-6-sol`; the advisor
self-reported GPT-6 Sol-class but could not verify the exact runtime variant. The
review was limited to the inline code summary and diff; structural read-only was
not verifiable, so the primary performed the required post-consultation status
check. It showed only the six expected Repair 01 files, with no unexpected or
advisor-authored changes. The primary was the sole writer.

1. **Dynamic cue concern — accepted as repaired.** The advisor found the
   projected-denominator formatter and mounted noncanonical app test
   discriminating against fixed 3-by-4 copy. It noted the test would not alone
   enforce the projection boundary after a future code change; the implementation
   directly reads `scene.meaning.unitRelationship.sourceDenominators`, and scene
   tests verify the noncanonical values enter projection.
2. **Motion comparator concern — accepted as repaired.** The advisor confirmed
   the Plan 22 comparator restoration and Plan 24 route/target motion alignment
   described in the supplied diff. The route contract checks those pairs; the
   reported full browser matrix passed. The advisor did not inspect or execute
   the browser run.
3. **Retained-scene concern — rejected for the reviewed call paths, with a
   residual condition.** The advisor found that render refreshes the cached
   projected scene, while view switching and opening help leave projected source
   denominators unchanged. Revisit this assumption if a future action changes
   the active problem or recovery state without rendering.

Coarse repair consultation cost: one additional advisor turn, roughly one minute.
The advisor did not access files, run commands, or make changes.

### Repair verification and commit

- `npm test` — **25 files and 295 tests passed**.
- `npm run build` — **passed** for the learner app and subtraction prototype.
- `node scripts/dev/run-route-matrix.js --filter ROUTE-PLAN24` — **4/4 passed**,
  including both matched-motion support-profile comparison routes.
- `node scripts/dev/run-route-matrix.js` — **48/48 passed** across 46 route rows,
  including the restored Plan 22 comparator.
- `node scripts/dev/plan-status.js lint` — **OK**;
  `node scripts/dev/plan-status.js check plan-24` — **RUNNABLE**;
  `git diff --check` — **clean**.
- The ordinary Edge browser launch still cannot write its temporary sandbox
  profile (`error = -5`); focused and full browser runs passed with the narrow
  elevated local Edge path.
- Repair commit: `e437933` — `Repair Plan 24 dynamic help cue and route controls`.
  The progress report is being committed separately as the final scoped commit.
  No push or packet-status change was made.

---

## Delivery Repair 02 (2026-10-07; latest)

The orchestrator's explicit bounded Repair 02 authorization is recorded in
`delivery-review.md`. It asks for one visible task question at decide and
transform, preserving actual accessible names, and refreshed cross-view,
cross-profile evidence. `node scripts/dev/plan-status.js check plan-24` now returns
`BLOCKED` because the packet is `delivered`; I proceeded only under that explicit
repair authorization and left packet status and review dispositions unchanged.

### Implemented behavior

- Visual and linear renderers now present the decide prompt on the actual response
  label (numeric input) or fieldset legend (candidate choices). The redundant
  prompt heading is not mounted for decide.
- At transform, the actionable equivalent-parts question is the input label and
  the earlier separate “Rename the … fraction …” instruction is not mounted.
  Other beats retain their heading prompts. Native input-label and
  fieldset-legend relationships remain intact.
- Added prompt typography for those labels/legends so they preserve the task
  question's visual hierarchy. No math, instructional state, replay, help,
  draft/focus, task-family, or motion logic changed.
- Added a mounted app test covering high/medium support, visual/linear views, and
  12/24. It checks exactly one prompt, actual label/legend association, and the
  target-specific transform question. The route matrix checks the medium input
  and high-support fieldset legend on Plan 24, and checks Plan 22's transform
  label plus absence of the removed heading copy.

### Rendered evidence

The refreshed capture contains 52 screenshots/measurements across 360×740 and
360×752, high and medium support, and visual and linear views. It includes help
closed/open states (8 each), medium one-sided-8 recovery (4), transform states
for 12 and 24 (16), and opened selected-unit explanations for 12 and 24 (16).
The capture also checks Playwright-computed accessible names: `group` named by
the visible legend for high-support choices and `spinbutton` named by the visible
label for numeric responses. It records native label/legend association,
question count, duplicate-header presence, and question/response/help/cue bounds.

Automated capture checks found 0 horizontal-overflow states, 0 missing computed
accessible names, 0 broken native question-response associations, 0 duplicate
visible task questions, and 0 question/response/help/cue controls outside the
viewport in the captured states. In the 360×740 medium visual open-help sample,
the question, input, button, and cue occupy y=405.78–481.34, 489.34–536.34,
552.34–596.34, and 612.34–699.52 respectively. No horizontal scrolling is
needed. Representative refreshed screenshots were inspected visually; the
question precedes its response and help, and the help cue/recovery remain within
the task region. These exact-string and geometry checks do not by themselves
establish that the wording is instructionally restrained or clear. The owner
will make that rendered-copy judgment during the separately gated screen review.

### Advisor consultation disposition

**Branch A — Sol-class read-only consultation ran.** Requested Sol class, not
Astra. The advisor self-reported Sol-class but could not verify its exact
runtime variant. It reviewed the inline implementation and validation summary;
it did not inspect repository files, browser output, screenshots, or assistive
technology. Structural read-only could not be verified, so this was
instruction-read-only with post-hoc verification. Immediately after its response,
`git status --short` showed only the primary implementer's recognized Repair 02
source, test, capture, and evidence changes (including the eight intentional
removals of superseded screenshot filenames); no advisor or unexpected changes
appeared. The primary was the sole writer.

1. **Computed accessible-name test gap — accepted and repaired.** The advisor
   correctly noted that native `label for` and `fieldset`/`legend` relationship
   checks do not detect an overriding accessible name. The refreshed Playwright
   capture now requires exactly one `spinbutton` or `group` with the exact visible
   question as its computed accessible name in every captured state. This checks
   browser accessibility computation; it is not a screen-reader test.
2. **Heading landmark concern — rejected as a blocker.** Decide/transform
   questions directly label their response controls, while other beats retain
   their headings. A repository search found no `aria-labelledby` reference to
   these active prompt/header classes. Actual assistive-technology navigation
   was not tested.
3. **Cross-plan regression concern — rejected on the supplied evidence.** The
   rendering change is limited to decide/transform question placement in the two
   renderers, while the Plan 22 route now checks its actual equivalent-parts
   label and absence of the obsolete prompt. No math/state/replay changes were
   made.

No blocking finding remained. Coarse consultation cost: one advisor turn,
approximately four minutes. The advisor's critique was limited to the inline
artifact and does not constitute independent browser or screen-reader review.

### Validation and current gates

- `npm test` — **25 files and 296 tests passed**.
- `npm run build` — **passed** for learner and subtraction-prototype builds.
- `npm run test:routes -- --filter PLAN24` — **4/4 browser executions passed**.
- `npm run test:routes` — **48/48 browser executions passed** across 46 route
  rows, including Plan 22 boundary and transform routes.
- `node scripts/dev/capture-plan-24-evidence.mjs` — **52 screenshot/measurement
  states captured**, with the semantic, computed accessible-name, and viewport
  geometry checks described above.
- `node scripts/dev/plan-status.js lint` — **OK**; `git diff --check` — **no
  whitespace errors** (only Git's LF-to-CRLF working-copy notices).
- Ordinary test, build, and lint commands worked after the computer restart. The
  ordinary Edge route/capture launch still failed creating its temporary profile
  (`error = -5`); scoped local browser commands passed using the narrowly
  elevated path. `.git/index.lock` was absent, but the read-only `git add
  --refresh -- .` probe still returned `Permission denied`; scoped staging and
  commit therefore require the repository's documented Git-metadata elevation.

Implementation/evidence commit: `d85cf7d` — `Remove duplicate Plan 24 task
prompts`. This progress report is committed separately as the final scoped
commit. The packet remains `delivered`; technical re-review and owner inspection
of representative rendered states remain outstanding. No push, deployment,
packet-status change, or owner acceptance is claimed. No physical device, native
keyboard, assistive technology, or learner study was used, and no efficacy or
independent-discovery claim is made.
