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
