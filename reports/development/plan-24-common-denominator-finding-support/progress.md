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

I recommend one optional, task-local help workspace that starts with the product
of the two denominators as a reliable common-unit route. It keeps the learner's
normal denominator choice as a separate action, preserves mathematically valid
non-least choices, and gives a short denominator-only explanation of the chosen
unit. This is a proposal for orchestration/owner review, not an approved source
mechanism. I am stopping before source work.

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

**Product reasoning (recommended first route):** Ask the learner to calculate
`3 × 4`. This takes one learner contribution and always supplies a valid common
unit for positive denominators. It can be larger than needed, so other valid
choices must remain accepted. For investigation only, denominators 4 and 6 show
the distinction: their product 24 works, while 12 is a smaller shared multiple.
This comparison does not add a 4-and-6 learner route or broaden content reach.

The product route is the smaller first mechanism for the registered problem and
does not require a new math primitive. Exact response validity and task closure
remain upstream through the existing math/interaction path. It is not evidence
of general independent denominator discovery or a claim that product reasoning
is the most efficient strategy for all denominators.

## Proposed bounded mechanism — awaiting approval

1. Keep the current unaided response available. Move/route its single `Need
   help?` entry into the active decide region beside or immediately below the
   denominator response in both visual and linear paths. Do not show a competing
   help button in the app-level support panel while decide is active.
2. On request, open a compact local workspace with one learner response at a
   time. Suggested first prompt: **“Multiply the two bottom numbers. What is
   3 × 4?”** Do not auto-fill or submit the main denominator response.
3. If the learner enters an invalid one-sided candidate such as 8, use exact
   upstream classification to explain that it fits groups of 4 but not groups
   of 3. For a valid, supported alternative such as 24, acknowledge it as valid;
   do not mark it wrong because it is not the product or least denominator. For a
   valid but unavailable candidate such as 36, preserve Plan 22's current local
   boundary and recovery. Do not recommend continuing into missing task data.
4. After the learner manually chooses a supported denominator, show one compact
   denominator-only reason, for example: **“12 works: 3 × 4 = 12 and 4 × 3 =
   12. Both fractions can use twelfths.”** Parameterize this from the selected
   denominator and exact upstream relationship. Do not show converted numerator
   forms or pre-answer the following transform task. A 24 reason may name only
   denominator relationships (`3 × 8 = 24`, `4 × 6 = 24`), not `16/24` or
   `6/24`; Plan 25 retains numerator-construction help.
5. Closing help, reopening it, or switching between visual and linear views must
   preserve any unsubmitted main denominator draft. Treat that draft as
   view-local UI input, not mathematical truth or replayed learner work. Reset it
   and all helper substeps on retry, return/re-entry, or a fresh episode.
6. Record requested assistance and learner-provided substeps in instructional
   provenance so later response evidence is marked assisted. Keep completed
   instructions replaced by the next substep rather than accumulating a recipe.
   Use no new top-level beat, support profile, menu of algorithms, automatic
   advance, persistence, or newly reachable family.

### Candidate exact implementation scope after approval

- Pure instructional state, intents, task-local help history and decide response:
  `src/interaction/episode.js` and `src/interaction/provenance.js`.
- Definition identity and replay compatibility: `src/interaction/episode-definition.js`
  and `src/interaction/replay.js`; preserve registered revision 1 and revision 2
  behavior/oracles, and add a new revision only if the accepted intent/state
  contract requires it. Do not broaden replay schema without evidence.
- Validated projection and learner strings: `src/interaction/scene.js` and
  `src/render/strings.js`.
- One local help entry point and visual/linear rendering/layout:
  `src/app/app.js`, `src/render/beat-container.js`, `src/render/linear-path.js`,
  `src/app/styles.css`, and `src/styles/render.css`.
- Focused tests: `tests/interaction-episode.test.js`,
  `tests/interaction-scene.test.js`, `tests/interaction-provenance-replay.test.js`,
  `tests/route-contract.test.js`, and additive witnesses in
  `tests/routes/route-matrix.json`. Add a Plan 24 evidence-capture script only if
  needed to produce repeatable visual/linear measurements and screenshots.
- No `src/math/` change is proposed. Existing exact common-denominator
  classification and Plan 22 task-path closure should own validity. If approved
  behavior cannot be implemented with those APIs, stop and propose that change
  separately before adding a math primitive.

## Falsifying evidence proposed for the post-approval implementation

- On the actual mounted decide task, prove the one visible help entry is adjacent
  to the response area in visual and linear paths at 360×740 and 360×752. Capture
  screenshots and measured question, response, help-button, and open-workspace
  bounds; include document overflow and control/touch-target bounds.
- Show a learner contribution (product 12), manual denominator submission, and
  continued authored completion without supplied equivalent numerators.
- Exercise wrong 10, one-sided 8, valid non-least 24, and valid-but-unavailable
  36. Require distinct mathematical classifications and useful local recovery;
  demonstrate that 36 never mounts unsupported conversion/reflection content.
- Open and close help with a nonempty, unsubmitted denominator draft and verify
  the exact value remains. Verify reset, return/re-entry, and replay have no stale
  helper state. Compare full replay results for existing definition revisions.
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
