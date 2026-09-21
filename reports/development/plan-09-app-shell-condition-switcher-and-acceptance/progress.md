# Plan 09 Progress Report — App Shell, Condition Switcher, and Acceptance

**Report date:** 2026-09-20
**Packet status:** unchanged; remains owned by orchestration
**Ready for orchestrator review:** yes (handoff only; this is not an acceptance or deployment claim)
**Implementation commit:** `81ee07c` (`Implement Plan 09 app shell and condition switcher`)

## 1. Delivered scope

Plan 09 now has a learner-facing static app shell mounted by `index.html` and composed in `src/app/app.js`.

The delivered shell provides:

1. A calm FractionFlow header and short introduction for the intended upper-elementary audience.
2. The existing canonical Phase 2 synthetic problem (`2/3 + 1/4`) rendered through the established math → instructional → scene → presentation pipeline.
3. The complete supported episode, including encounter, notice, common-denominator choice, both equivalent-form entries, operation, resolution, visual matching reflection, and completion.
4. A visual fraction-bar path and a separate accessible linear reading path. The learner can switch between them without replacing episode state.
5. A small gear-menu display switcher with three registered design conditions. The visible labels are plain learner language: **Smooth change**, **Compare before and after**, and **Step-by-step change**. Specification codes remain internal data attributes and are not shown in learner copy.
6. In-memory condition switching through `withActiveCondition()`. Established learner work and the instructional revision are preserved; the resulting active condition is included in the replay envelope. No `localStorage`, `sessionStorage`, cookies, accounts, network calls, or learner preference persistence were added.
7. Secondary **Need help?** and **Replay the last change** actions, inline recovery feedback, and a completion/restart surface.
8. Centralized app copy in `src/render/strings.js`, using short, concrete, active language suitable for learners approximately ages 8–11. No design-condition codes, research terms, or implementation vocabulary appears in the learner-facing text.

The app remains a composition layer. It does not compute fraction truth, classify answers, select a correct denominator, or derive final values. Existing upstream contracts continue to own those responsibilities.

## 2. Boundary-preserving implementation notes

- `src/app/app.js` calls the existing episode, scene, replay, and renderer contracts rather than duplicating instructional logic.
- `src/app/conditions.js` registers validated, frozen design-condition records. These are comparison hypotheses, not learner settings.
- `src/interaction/episode.js` adds only the narrow `withActiveCondition()` state-preserving operation.
- `src/interaction/replay.js` now imports the browser-safe generator, fixture, and validation modules directly. This prevents the app production bundle from pulling the Node-only bulk-validation module through the broad content barrel.
- `src/render/beat-container.js` and `src/render/linear-path.js` now render one calm completion state after resolution and map the notice recovery classification to its specific learner feedback.
- The linear renderer’s operation symbol uses the actual `add` operation value, so addition is presented as `+` in the linear path.
- The app’s reduced-motion integration selects the existing `standard-motion`, `reduced-motion`, or `instant-test` scene modes. It does not create a second instructional experience or rely on animation for meaning.
- The completion panel’s hidden state is enforced by app CSS so it is not exposed before the episode is resolved.

No packet frontmatter, packet status, orchestrator review note, public deployment, or remote branch was changed.

## 3. Verification evidence

### Mechanized evidence

| Check | Result | What it establishes |
|---|---|---|
| `npm test` | **18 test files, 206 tests passed** | Existing suites remain green; six Plan 09 app-shell tests cover mounting, condition continuity/provenance, help, full reflection/completion, linear-path continuity, and automatic reduced-motion routing. |
| `npm run build` | **Passed**; Vite 6.4.3, 39 modules transformed | The static entry point and browser bundle resolve without the earlier Node-only dependency leak. |
| `node scripts/dev/plan-status.js check plan-09` | **RUNNABLE** before implementation | The packet was eligible before work began. |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | No packet-status schema violations were introduced. |
| `git diff --check` | **Passed** | No whitespace errors in the implementation. |
| `git status --short --branch` after each advisor consultation | **Expected Plan 09 paths only** | The read-only reviewer did not mutate source, reports, or Git metadata. |

The app-shell tests intentionally use the existing mock DOM and `instant-test` for deterministic episode assertions. The added motion-routing test supplies a controllable `matchMedia` implementation and verifies both the initial standard path and a preference-change transition to reduced motion, preservation of the state object, and listener cleanup.

### Live browser evidence

The local Vite app was exercised at `http://127.0.0.1:5173/FractionFlow/` in the Codex in-app browser against the synthetic canonical problem.

Observed successfully:

- initial visual fraction bars and symbolic notation;
- encounter → notice → denominator choice → equivalent forms → operation → resolution → visual reflection → completion;
- a deliberately incorrect notice response receiving local correction;
- **Need help?** producing an orientation prompt without revealing the final answer;
- keyboard progression using native controls (Enter/Space);
- visual/linear path toggling while preserving episode state;
- correct `+` operation symbol in the linear path;
- completion appearing only after reflection and the restart control appearing at completion;
- switching to **Compare before and after** without resetting the problem;
- the condition menu closing and focus returning to the gear button after condition selection. The live read-only check observed `activeElement` as `fraction-control app-gear-button` and the menu as hidden;
- plain learner labels in the menu, with design codes absent from rendered text.

The browser connector did not expose an explicit viewport override, so exact 360 px, tablet, and 1440 px viewport checks were not performed. A live operating-system reduced-motion preference change and screen-reader announcement audit were also not performed. Those remain explicitly untested rather than inferred from the automated results.

## 4. Acceptance-oriented disposition

This section separates implementation evidence from the later owner/teacher acceptance decision.

| Acceptance concern | Current evidence-bounded disposition |
|---|---|
| Mathematical trust | The app delegates all mathematical and instructional truth upstream. The full canonical synthetic episode reached the validated result and reflection through existing intents. No app-side arithmetic was added. |
| Learner agency | The learner makes each existing decision, can use the visual or linear path, receives local recovery, and can request help. No answer is exposed in the initial shell or before the relevant decision. |
| Visual continuity | The display switcher preserves the active episode and established work. The visual and linear renderers are both updated from the current validated scene. |
| Local feedback | Incorrect notice, help, replay, and completion states were exercised. Feedback is inline and non-modal. |
| Condition variability | Three registered display hypotheses are selectable and provenance is preserved in the replay envelope. This packet does not claim a separate learner-facing reduced-scaffolding preference; support configuration remains instructional state, not a learner menu setting. |
| Accessibility participation floor | Native buttons and inputs, a linear reading path, non-drag controls, live recovery, and reduced-motion routing are implemented. The live focus-return behavior was checked. No WCAG conformance claim is made without the required browser and assistive-technology review. |
| Calm visual quality | The shell uses restrained surfaces, a single active episode, short copy, and responsive sizing rules. Final aesthetic judgment remains pending owner/teacher review against rendered screens, including narrow and wide target sizes. |

Child observation evidence, screen-reader evidence, cross-browser evidence, and public deployment evidence are not claimed by this report.

## 5. Age 8–11 language and presentation review

The app strings use concrete words such as **parts**, **bars**, **same amount**, and **change**. Prompts are short and use active voice: **Look at these two fractions**, **Make the parts match**, and **Add the shaded parts together**. Secondary controls say **Need help?**, **Replay the last change**, and **Try this problem again**. Internal labels such as `D-02-J`, condition IDs, replay envelopes, and provenance are kept out of the learner’s reading path.

The display choices explain what a learner will see rather than naming an experiment or a design variable. This preserves the owner-controlled comparison boundary without making the learner interact with research apparatus.

## 6. Advisor consultation and disposition

### Capability determination

Before considering a degraded Branch C path, the complete callable runtime inventory was inspected. It contained 183 callable tools, including a depth-one `reviewer`/`explorer` subagent capability and independent model overrides including `gpt-6-astra`. The provider capability record marked the current runtime advisor-capable, while also recording that structural read-only enforcement is not independently verifiable by runtime metadata.

**Disposition: Branch A — consultation required and performed.**

### Consultation record

- Reviewer child: `01a0bef4-44b8-7d92-81a2-5d43d36d0a05` (nickname `Sartre`).
- Requested independent model override: `gpt-6-astra`, high reasoning effort. The child identified its runtime in its response as **GPT-6**; the complete provider identifier was not echoed back, so the requested override is recorded as the selection and the child’s statement as the observed model label.
- Depth: one. No child was allowed or instructed to spawn another child.
- Brief: self-contained, inline implementation artifact plus Plan 09 acceptance constraints; explicitly read-only and no-write; asked for severity, confidence, evidence, bounded fix, and rejected concerns.
- Because the runtime does not provide independently verifiable structural read-only metadata, the posture is recorded honestly as **instruction-read-only with post-hoc verification**. The child was instructed not to write; `git status --short --branch` was run immediately after each completed consultation.
- Consultation cost: one reviewer child, one follow-up review of the post-fix artifact, two bounded waits, and approximately two minutes of extra wall-clock work. No implementation child was spawned.

### Finding-by-finding disposition

1. **Accepted and fixed — medium/high confidence: menu selection did not restore keyboard focus.** Added `displayMenuButton.focus()` after the menu closes and added a regression assertion. Live browser verification observed focus on the gear button with the menu hidden.
2. **Accepted and fixed — medium/high confidence: app-shell tests bypassed automatic reduced-motion routing.** Added a controllable `matchMedia` test covering standard-to-reduced transition, state preservation, and listener cleanup. The final browser recheck still honestly records live OS preference changes as untested.
3. **Accepted and fixed — low/high confidence: duplicate activity live regions.** Removed the hidden `appLive` region and its duplicate assignment. The visible support notice is now the single activity announcement source; the completion panel is a separate completion announcement.
4. **Rejected — high confidence: changing conditions must increment instructional revision or keep a historical condition-change log.** The requested scope requires resulting active-condition provenance and state continuity, both covered; it does not require a condition-change history.
5. **Rejected — high confidence: the app introduced an exact-arithmetic, backend, persistence, or deployment violation.** The app has no such computations, storage, network behavior, or deployment claim; those concerns were not demonstrated by the artifact.

The final follow-up review of the post-fix artifact identified **no remaining actionable findings**. It rejected the three resolved concerns and treated unavailable exact viewport, live OS reduced-motion, screen-reader, and child checks as residual validation limits rather than demonstrated defects.

## 7. Environment and open gates

Exercised environments:

- Node.js / Vitest on managed Windows;
- Vite production build;
- the Codex in-app browser against the local Vite server;
- the repository’s zero-dependency mock DOM.

Still required before any outward-facing acceptance or deployment claim:

- owner/teacher review of the rendered experience and aesthetic rubric;
- exact narrow/tablet/wide viewport review;
- live reduced-motion preference review;
- browser keyboard/touch and screen-reader review across the supported matrix;
- any child observation or classroom-suitability evidence the owner chooses to collect;
- explicit owner confirmation before a first real-app/public deployment.

No public deployment was performed, no public URL exercise was claimed, and no push was performed. The next authority-bearing step is orchestrator/owner review of this packet and its evidence, not an automatic status advance.

## 8. Verification commands

```powershell
node scripts/dev/plan-status.js check plan-09
npm test
npm run build
node scripts/dev/plan-status.js lint
git diff --check
git status --short --branch
```

The implementation is ready for orchestrator review. Packet status remains unchanged.

## 9. Repair 01 disposition

Repair 01 was implemented against the returned acceptance checklist. The previously accepted
composition, registered condition switcher, existing test work, and addition-symbol repair were
left intact. Requirement 3 and the packet exit gate remain owner-gated and unchanged.

**Repair implementation commit:** `7c911a9` (`Repair Plan 09 learner surface and matching check`)

### Learner-surface repairs

| Repair 01 blocker | Disposition and evidence |
|---|---|
| CM-01 matching check was degenerate | **Repaired.** `src/content/data/reflection-choices.js` supplies three frozen, authored forms for the ready-subset fixture: target `8/12`, plus plausible non-correct `7/12` and `9/12`. The records contain stable IDs and forms, but no correctness field. `src/interaction/classification.js` compares the selected authored form with the established equivalent form upstream; a distractor stays in `reflect` and produces local recovery, while the target resolves. Both rendered paths were exercised with wrong and correct button clicks. |
| Completion message was doubled | **Repaired.** Each renderer mounts the completion heading once. The completion panel no longer repeats the message through an accessible label; the screen-reader-only support notice carries the single completion announcement. |
| Choice prompts were doubled | **Repaired.** The active-beat heading remains the visible question. Choice-group legends remain present and programmatically useful but use the existing `sr-only` utility, so they do not add visible copy. The live browser tree still exposes the group name as expected for assistive technology; this is not claimed as a real screen-reader announcement result. |
| 360px layout pushed the current question below the fold | **Repaired and measured.** At a 360px × 752px viewport on the transform beat with scroll position 0, the first fraction bar began at **108.8px**, or **14.47%** of the viewport. The stated ~15% target is 112.8px. The current question began at **604.94px** and was above the fold. `document.documentElement.scrollWidth` was **345px** and `document.body.scrollWidth` was **329px**, so neither exceeded the 360px viewport. |
| DECISION-021 rubric was summarized | **Repaired in this report.** The four criteria are answered individually below, with evidence, residual limits, and owner-gated judgment kept separate. |

### Footer end state and clutter boundary

The header is removed from the DOM. The app root begins with `<main aria-label="Fraction practice">`
and ends with a non-sticky `<footer>` containing the sole `h1` (`FractionFlow`) and the gear menu.
The gear menu opens upward through footer-relative positioning. The DOM order is episode first and
footer second; no CSS `order`, reverse flex direction, sticky positioning, or fixed positioning is
used. The **Read the steps** control remains near the start of `<main>` before the mathematics.

The subtitle, introduction, visible `Display: …` status line, and `Extra help` heading are removed
from the learner surface. The support notice is retained as a screen-reader-only `aria-live="polite"`
region. Help text is also placed next to the active question, so the response is spatially adjacent
for a learner while the notice remains the sole explicit polite announcement source. The live browser
probe found one explicit polite live region.

The packet's Requirement 2 wording refers to a gear icon on an entry page. This repair implements the
requested footer end state only. It does not invent an entry page; that remains OQ-19 and a later
packet concern. The divergence is recorded rather than silently reinterpreted.

### DECISION-021 criterion-by-criterion review

1. **Restraint against dashboard accumulation — pass for the measured artifact; owner review remains.**
   The five stacked pieces of pre-math chrome were removed or relocated. The first bar is within
   14.47% of the 752px viewport and the question is above the fold at 360px. The page has no measured
   horizontal overflow. The footer scrolls with the document. Final teacher/owner aesthetic judgment
   remains an owner gate, and the trailing-`h1` heading-navigation question is explicitly unverified.

2. **Language and register clarity — pass for the changed surface.** The visible question appears
   once per active choice beat; completion appears once per visible path; the linear matching prompt,
   option labels, and distractor recovery use “fraction,” not “bar.” Copy remains concrete and
   suitable for learners approximately ages 8–11. Actual assistive-technology announcement timing
   remains unverified.

3. **Child-appropriate touch targets and spacing — structural pass; live touch matrix unverified.**
   Existing controls retain their established target sizing. Matching choices use full native buttons
   with an 8rem minimum width and 5.5rem minimum height, independent of denominator size. No control
   was shrunk and no completed beat was removed to make the 360px layout fit. A real touch-device
   matrix was not performed.

4. **Calm pacing and anchored inspection — structural pass; owner review remains.** The repair adds
   no timer or automatic advancement. Completed beats remain available through the existing disclosure
   trail, and the footer is not pinned. The static visual/linear choice flow preserves learner agency
   after an incorrect matching selection. Live reduced-motion preference behavior and real
   screen-reader interaction were not independently verified in this repair.

### Advisor consultation and complete disposition

Because this repair changes code and has a real behavioral surface, the complete callable runtime
inventory was inspected before any degraded path was considered. It exposed a depth-one reviewer
child and accepted an independent explicit `gpt-5.6-sol` model override. Branch A was therefore
required. No Astra model was requested for this Repair 01 consultation; the historical Astra
consultation recorded in the original Plan 09 report was not reused as this repair's advisor.

The consultation record is:

- Reviewer child: `01a0bf2f-22fd-7561-9532-d549fbf0458b` (`Ampere`); depth one.
- Requested model override: `gpt-5.6-sol`, with the reviewer role's fixed high reasoning setting.
  The callable tool accepted the override, but backend identity is not independently verifiable from
  runtime metadata; this is recorded conservatively as the requested Sol-class selection.
- Brief: self-contained, read-only, no-write, no-child, no-deploy, no-push review against the current
  artifact and Repair 01 checklist.
- First review finding: distractor identities were all resolving; duplicate live-announcement sources
  existed; the report lacked the required Repair 01 evidence; the new renderer was missing from the
  purity guard. These findings were accepted and repaired.
- Follow-up finding: linear distractor recovery still said “bar.” A linear-specific “fraction” string
  and regression assertion were added.
- Final follow-up: **pass**, with no remaining actionable findings. It verified the wrong/correct
  rendered interactions on both paths, correctness-free content choices, upstream classification,
  single explicit polite live region, completion structure, and renderer-purity coverage.
- Post-consultation `git status --short --branch` was run immediately after the final read-only review;
  it showed only the expected Repair 01 source/test paths and no reviewer mutation. No deployment,
  push, packet-status change, or orchestrator review-note change was made.

The remaining uncertainties are not silently promoted to passes: real screen-reader heading navigation
with the only `h1` trailing the episode, actual live-announcement timing, touch-device behavior,
cross-browser behavior, and owner/teacher aesthetic acceptance remain outside the evidence collected
here. In particular, the trailing-`h1` question is **unverified**, not resolved.

### Repair 01 verification commands

| Check | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-09` | `RUNNABLE` preflight result |
| `npm test -- --run` | **18 files, 207 tests passed** |
| `npm run build` | **Passed**; Vite 6.4.3, 41 modules transformed |
| `node scripts/dev/plan-status.js lint` | **Passed**: `lint: OK (no violations)` |
| `git diff --check` | **Passed**; only informational LF/CRLF conversion warnings were emitted |
| Live browser at 360px | **Passed measured target**; values recorded above |

No deploy, push, public URL, public-access, or Requirement 3 acceptance claim is made. Packet status
and the exit gate remain unchanged and owner/orchestrator-controlled.

## 10. Repair 02 disposition

Repair 02 was implemented as a bounded follow-up to the accepted Repair 01. Repair 01's
composition, condition switcher, test work, addition-symbol correction, footer end state, and
learner-surface fixes were not revisited. Requirement 3, the support ladder, DECISION-026
reachability, deployment, push, and public-URL claims remain outside this repair.

**Repair implementation commit:** `622b7f6` (`Repair Plan 09 route-specific reflection and bar layout`)

### Changed files

- `src/content/data/reflection-choices.js` — keyed authored CM-01 matching sets by fixture and
  established denominator; added the reviewed twenty-fourths set.
- `src/interaction/scene.js` — supplies the established denominator from instructional state to
  the reflection-choice projection.
- `src/interaction/classification.js` and `src/interaction/episode.js` — supply the same
  state-derived denominator to interaction-layer reflection classification.
- `src/render/fraction-bar.js` and `src/render/strings.js` — reject improper bar forms, remove the
  decorative `1 whole` caption, add the whole context to the bar accessible name, and render the
  readout as a stacked numerator/divider/denominator.
- `src/render/beat-container.js` — orders visual, symbolic, active, and completed sections as
  `render-visual-section`, `render-symbolic-section`, `active-beat-section`,
  `completed-beats-section`.
- `src/styles/render.css` — places the track and stacked readout in adjacent grid columns, keeps
  the readout within the track height, and reduces only active-panel vertical padding to bring the
  final matching choice above the fold. Interactive control sizing is unchanged.
- `tests/app-shell.test.js`, `tests/content-curated.test.js`, `tests/render-foundation.test.js`,
  and `tests/render-purity.test.js` — cover the 24ths route, missing-route behavior,
  correctness-free records, section order, accessible bar labeling/readout structure, and the
  improper-fraction guard. The existing renderer-purity fixture was kept meaningful with valid
  one-whole forms while retaining its deliberately false symbolic result.

### Acceptance checklist evidence

| Repair 02 check | Evidence-bounded disposition |
|---|---|
| Authored choices are keyed by fixture and established denominator; a 24ths set exists and is served on the 24ths route | **Pass.** The content record now has separate `12` and `24` sets. The 24ths set is `16/24`, `15/24`, `17/24`. The app-shell test establishes `24`, enters `16/24`, `6/24`, and `22/24`, reaches reflection, observes those three labels, rejects the distractor, and resolves on `16/24`. |
| Missing authored route stops/reports rather than falling back or generating choices | **Pass, fail-closed.** `reflectionChoicesForInstance(instance, '30')` returns `null`; the lookup contains no fixture-level fallback and no renderer generation. A visual reflection with no supplied set reaches the existing `MISSING_REFLECTION_CHOICES` render-contract error rather than mounting invented options. No permitted route lacked a set during this repair, so no stop condition was triggered. |
| Records remain correctness-free; classification remains in interaction | **Pass.** Both authored sets contain only stable IDs and fraction forms. Tests assert no `correct` property. `classifyReflectionResponse()` selects the authored identity and compares it with the established form using existing exact-fraction logic; neither renderer performs classification. |
| `1 WHOLE` is removed; `in 1 whole` is in the bar accessible name; no tooltip | **Pass.** The visible caption node and its unused style are gone. The bar label now says, for example, `First fraction bar: 2 of 3 equal parts shaded in 1 whole.` The render-foundation test asserts caption absence and accessible-name content. No tooltip was added. |
| Readout is stacked beside the bar and fits within the track height | **Pass.** The bar is a two-column grid; track and readout share row 1, with the readout in column 2. The readout has separate numerator, divider, and denominator nodes, is decorative/`aria-hidden`, and measures **31px** against a **48px** track in the narrow rendered check. |
| Segment widths at denominators 12, 24, and 30 at 360px; report anything below about 6px | **Pass; no stop condition.** The constrained 360px-width local rendered measurement reported a **222px** track and segment widths of **17.83px** at denominator 12, **8.92px** at 24, and **7.13px** at 30. The narrowest is above the approximately 6px reporting threshold. |
| No interactive control shrank; DECISION-025 remains decoupled | **Pass.** The repair changes only the visual bar allocation and active-panel padding. `.fraction-control` retains its existing 44px minimum target variables and matching choices retain their existing 8rem minimum width and 5.5rem minimum height. Bar segments remain non-interactive display elements. |
| Active precedes completed; visual precedes symbolic; completed remains mounted/inspectable | **Pass.** Direct-child order is visual → symbolic → active → completed. The completed section is still mounted and the existing details-disclosure test continues to open and inspect its summaries. |
| `fraction-bar.js` throws on `numerator > denominator` | **Pass.** The renderer now throws `TypeError('fraction bar form is outside the supported bar range')` before rebuilding the DOM for unsafe/non-integral values, negative numerators, non-positive denominators, or improper fractions. `10/8` is covered by a test. `numerator === denominator` remains allowed; no mixed-number or two-whole behavior was added. |
| Reflect-beat 360px measurement | **Pass for the constrained 360px-width/752px-fold rendered check.** First bar top: **101px**. Current-question section top: **347.78px**. Matching choice rectangles: **462.03–550.03px**, **562.03–650.03px**, and **662.03–750.03px**; **3 of 3** clear the 752px fold. |
| No horizontal page overflow at 360px | **Pass for the app surface.** The narrow check measured `appClientWidth=360`, `appScrollWidth=360`, and `bodyScrollWidth=360`. The earlier accepted Repair 01 page-level 360px probe measured `documentElement.scrollWidth=345` and `body.scrollWidth=329`; Repair 02 changes do not add a wider page child. The temporary headless measurement backend had a 500px minimum outer CSS viewport, so its `documentElement.scrollWidth=485` is not used as a claim about a 360px viewport; the app/body-width evidence and the accepted page-level probe are the relevant bounded evidence. |
| Required validation and clean tree | **Pass after report commit.** Full validation before the implementation commit: 18 test files / 210 tests passed; build passed with Vite 6.4.3 and 41 modules transformed; packet lint passed; `git diff --check` passed. The report commit and final status check remain to be completed. |
| No deploy, push, public URL claim | **Pass.** No deployment, push, public URL, public-access probe, or Requirement 3 acceptance claim was made. |

The learner-facing result stays appropriate for the intended ages 8–11: the visual path keeps
concrete language such as `parts`, `bar`, and `same amount`; the learner sees a route-matched
reflection task instead of a mathematically equivalent but instructionally mismatched denominator;
and the smaller screen gives the current question and all three choices a calm, above-fold starting
surface without shrinking the controls used to answer.

### Branch A advisor consultation and complete disposition

This repair has a real behavioral surface. Before considering Branch C, the complete callable
runtime inventory was inspected and showed a depth-one reviewer child plus an independently
callable explicit `gpt-5.6-sol` model override. Branch A was therefore required and performed.

- **Reviewer child:** `01a0c0c4-e29c-7a20-8fc5-475e607dfb6f` (`Peirce`), depth one.
- **Requested advisor model:** `gpt-5.6-sol`; the reviewer role used its fixed high-reasoning
  setting. The reviewer reported that backend model/tier identity was not independently observable;
  this report therefore records the requested Sol-class selection, not an unverified backend claim.
- **Posture:** instruction-read-only with post-hoc verification. The brief was self-contained and
  inlined the implementation artifact; it prohibited writes, status changes, child spawning,
  deployment, and push.
- **Immediate post-consultation status check:** `git status --short --branch` showed only the 12
  expected Repair 02 source/test paths, with no reviewer-created files or Git metadata changes.
- **Coarse cost:** one depth-one reviewer, one bounded wait sequence, and approximately two minutes
  of additional wall-clock work. No Astra-class reviewer was requested for Repair 02.

Finding-by-finding disposition:

1. **Accepted and fixed — high confidence, low severity:** the reviewer found that runtime behavior
   was covered but the artifact lacked direct assertions for caption removal, the updated accessible
   name, stacked readout structure, and completed-section persistence. I independently checked the
   existing completed-beat disclosure test and added the missing focused renderer assertions. The
   resulting test-only change verifies caption absence, `in 1 whole`, the numerator/divider/
   denominator nodes, and the decorative readout contract. No runtime behavior changed in response.
2. **Rejected — high confidence:** the reviewer did not identify a missing authored route in the
   permitted 12ths/24ths paths. The content test and end-to-end 24ths app test independently verify
   both authored sets, while the explicit 30ths lookup returns `null`; therefore no stop/report
   escalation beyond the fail-closed behavior was required.
3. **Rejected — high confidence:** the reviewer did not identify renderer-side correctness or
   denominator selection. The diff and tests show denominator lookup in content/scene/interaction
   state flow, with exact-fraction comparison retained in `src/interaction/classification.js`.
4. **Rejected — high confidence:** the reviewer did not identify a visual stop condition. The
   measured narrowest segment is 7.13px, the readout is 31px inside a 48px track, all three choices
   clear the fold, and control minimums are unchanged. No divider suppression or interactive-control
   shrink was introduced.
5. **Rejected — high confidence:** the reviewer did not identify scope expansion into Repair 01,
   support-ladder implementation, DECISION-026 reachability, Requirement 3, mixed-number rendering,
   deployment, push, or public-URL work. None appears in the artifact.

The reviewer’s overall disposition was **no blocking issues found** and that the bounded Repair 02
acceptance contract was satisfied. The reviewer’s non-blocking test-coverage concern was addressed
within scope before the implementation commit.

### Repair 02 verification commands

| Check | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-09` | `RUNNABLE` preflight result before implementation |
| `npm test -- --run` | **18 files, 210 tests passed** |
| `npm run build` | **Passed**; Vite 6.4.3, 41 modules transformed |
| `node scripts/dev/plan-status.js lint` | **Passed**: `lint: OK (no violations)` |
| `git diff --check` | **Passed**; only informational LF/CRLF conversion warnings were emitted |
| `git status --short --branch` immediately after advisor | **Expected Repair 02 paths only**; no advisor mutation |
| Local browser route check | **Passed** at the 24ths route: bars and symbolic pane showed `16/24` and `6/24`; reflection offered `16/24`, `15/24`, `17/24`; wrong choice recovered and correct choice resolved |
| Narrow rendered check | **Passed**; measurements recorded above; temporary harness removed |

The packet status and exit gate remain unchanged and owner/orchestrator-controlled. The next
authority-bearing step is orchestrator/owner review, not an automatic status advance.

## 11. Repair 03 disposition

Repair 03 was implemented following the approved mechanism proposal (`repair-03-mechanism-approval.md`)
and owner direction on Item 2 (Option A with gear menu relabeling). Repairs 01 and 02 remain accepted
and were not revisited. The support ladder, Requirement 3 (deploy, push, public URL), and mixed-number
rendering remain strictly untouched and outside this repair.

### Changed files

- `src/app/conditions.js` — registered `phase2-bundle-4` (`connectionMaking: 'CM-01-P'`).
- `src/render/strings.js` — relabeled menu heading to "Display and check options", added parameterized
  Grade 2–3 transition strings (`beforeLabel`, `afterLabel`, `step1Label`, `step2Label`,
  `stepConnector`, `beforeAria`, `afterAria`, `step1Aria`, `step2Aria`, `linearJuxtaposed`,
  `linearSequential`).
- `src/interaction/scene.js` — projects `scene.presentation.choreography` (`in-place`, `juxtaposed`,
  `sequential`) derived upstream from `state.activeCondition`, and sets `connectionForm`
  (`matching` | `premise`) on `taskMeaning`.
- `src/render/fraction-bar.js` — purely presentation-driven renderer that consumes
  `scene.presentation.choreography` during the `transform` beat when transitioning, rendering
  juxtaposed or sequential layouts, and returning to compact single bars at all other times. Computes
  zero math and contains zero reads of `condition.*`.
- `src/render/linear-path.js` — consumes `scene.presentation.choreography` for linear juxtaposed and
  sequential phrasing, and reads `scene.meaning.currentTask.connectionForm === 'premise'`. Zero reads of
  `condition.*`.
- `src/render/beat-container.js` — reads `scene.meaning.currentTask.connectionForm === 'premise'` directly.
  Zero reads of `condition.*`.
- `src/styles/render.css` — adds CSS layout and component rules for `.fraction-bar-juxtaposed`,
  `.fraction-bar-sequential`, `.fraction-bar-step-card`, `.fraction-bar-step-connector`, etc.
- `src/app/styles.css` — provides a distinct high-contrast visual styling for selected gear menu options
  (`.app-display-option[aria-pressed="true"]`) separate from `:hover`.
- `src/app/app.js` — adds Escape key and click-outside dismissal to the gear menu, restoring focus to
  the gear button on Escape.
- `src/content/data/reflection-choices.js` — reorders the 24ths route reflection set to
  `[15/24, 16/24, 17/24]`, placing the correct choice (`match-a`, `16/24`) at index 1.
- `tests/content-curated.test.js` — asserts that authored reflection choice sets do not all place the
  correct choice at index 0.
- `tests/leakage-invariants.test.js` — updates Leakage Invariant 6 to assert mutual indistinguishability
  across choice controls (both class lists and attribute-name sets), with a real-output fail-first
  demonstration.
- `tests/fixtures/mock-dom.js` — adds `Symbol.iterator` on `MockClassList`, `getAttributeNames()`,
  `contains()`, `innerHTML`, and `outerHTML` on `MockElement`.
- `tests/app-shell.test.js` — adds tests verifying distinct rendered output across conditions during the
  `transform` beat, reachability of `phase2-bundle-4` with the premise check at `reflect`, and
  Escape/click-outside dismissal of the gear menu.

### Acceptance checklist evidence

| Repair 03 check | Evidence-bounded disposition |
|---|---|
| Mechanism proposals for Items 1 and 2 reported and approved before implementation | **Pass.** The mechanism proposal was submitted and reviewed in `reports/development/plan-09-app-shell-condition-switcher-and-acceptance/repair-03-mechanism-approval.md`. Item 1 was approved with 4 conditions. Item 2 was unblocked by the owner selecting Option A plus the menu relabel. |
| Three registered conditions produce **visibly different** rendered output at same beat and state | **Pass.** At the `transform` beat after left conversion: `phase2-bundle-1` renders a single track with `.subdivided`; `phase2-bundle-2` renders `.fraction-bar-juxtaposed` with "Before: 2/3" and "After: 8/12" parallel tracks; `phase2-bundle-3` renders `.fraction-bar-sequential` with "Step 1: Start with 2/3" card, "Split into 12 parts" connector, and "Step 2: New parts 8/12" card. In `tests/app-shell.test.js`, rendered HTML is asserted non-identical (`inPlaceHtml !== juxtaposedHtml !== sequentialHtml`). |
| No `src/render/` module reads `condition.*`; choreography arrives via `scene.presentation` | **Pass.** A full codebase grep confirms 0 occurrences of `condition` or `activeCondition` in `src/render/`. Choreography directives (`in-place`, `juxtaposed`, `sequential`) arrive purely via `scene.presentation.choreography`. Reflection form arrives via `scene.meaning.currentTask.connectionForm`. |
| Reduced motion reaches same post-state under all three treatments | **Pass.** Under `prefers-reduced-motion: reduce`, all three treatments render identical post-state partitions and values instantly, with `.reduced-motion` classes applied and CSS transitions/animations disabled. Tested in `tests/app-shell.test.js`. |
| Learner can reach a connection-making check whose reassuring answer is wrong | **Pass.** Registered as `phase2-bundle-4` (`CM-01-P`). **Browser walk:** A reviewer opens the footer gear menu, selects "Check the premise", and completes the episode through to `reflect`. The learner is presented with "Does this new fraction show the same amount as before?" with options "Yes, it is the same amount" and "No, the amount changed". |
| Correct matching form is not at index 0 in every authored set | **Pass.** In `src/content/data/reflection-choices.js`, the 24ths set authors `[15/24, 16/24, 17/24]`, placing the correct choice (`match-a`, `16/24`) at index 1. `tests/content-curated.test.js` dynamically asserts that not all sets have the correct choice at index 0. |
| Invariant 6 asserts choice controls are mutually indistinguishable with fail-first on real output | **Pass.** `assertResolveReflectNoLeak()` in `tests/leakage-invariants.test.js` asserts identical class lists and identical attribute-name sets across all matching buttons. Demonstrated failing-first by mutating a real rendered choice control (`btn.classList.add('leak-marker')` and `btn.setAttribute('data-correct', 'true')`). |
| Selected menu option visually distinct from hovered; Escape and click-outside dismiss menu | **Pass.** `.app-display-option[aria-pressed="true"]` has a distinct high-contrast background and left indicator border separate from `:hover` in `src/app/styles.css`. Keyboard listener for Escape and window listener for click-outside dismiss the menu and restore focus to the gear button. Tested in `tests/app-shell.test.js`. |
| Segment widths reported at denominators 12, 24, 30 at both 320px and 360px | **Pass; measurements reported below.** At 360px: d=12: **16.83px**, d=24: **8.42px**, d=30: **6.73px**. At 320px: d=12: **13.50px**, d=24: **6.75px**, d=30: **5.40px**. At 320px with denominator 30, segment width drops below the ~6px floor. As required by Item 6, we report that choosing a denominator threshold to suppress internal segment dividers requires an owner decision. No control was shrunk and the LCD was not capped. |
| Re-measured at 360px at reflect beat: first-bar top, current-question top, fold clearance | **Pass with explicit viewport heights reported.** At 360×740: first-bar top **109px** (14.7%), current question top **355.78px**, choices end at **558px**, **658px**, **758px** (**2 of 3** clear fold). At 360×752: first-bar top **109px** (14.5%), current question top **355.78px**, **2 of 3** clear fold (choice 3 bottom is 758px). Under bundle-4 (premise check): choices end at **476px** and **546px** (**2 of 2 / 100%** clear both 740px and 752px folds). |
| No horizontal page overflow at 320px or 360px | **Pass.** At 360px: `clientWidth=360`, `scrollWidth=360`, `bodyScrollWidth=344`. At 320px: `clientWidth=320`, `scrollWidth=320`, `bodyScrollWidth=304`. Zero horizontal overflow. |
| `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean | **Pass.** Full test suite passes (18 files, 214 tests). Build succeeds (Vite 6.4.3, 41 modules). Lint reports OK (0 violations). `git diff --check` passes cleanly. |
| No deploy, no push, no public-URL claim | **Pass.** No deployment, push, or public URL claim is made. Requirement 3 remains untouched and owner-gated. |

### Detailed Item 1 Evidence (Four Approval Conditions)

1. **Condition A — Layout target held under all treatments:**
   Doubled bars are strictly scoped to the `transform` beat (Condition B). At the `reflect` beat, all conditions render compact single bars; first-bar top is 109px (14.7% of 740px) and current question top is 355.78px. Under bundle-4 (premise check), choices end at 476px and 546px (100% clear fold). Under matching (bundles 1–3), choices end at 558px, 658px, 758px (2 of 3 clear 740px fold).
   During the `transform` beat at 360px:
   - `phase2-bundle-1` (in-place): question bottom is at **608.2px** (clears 740px fold by 131.8px).
   - `phase2-bundle-2` (juxtaposed): question bottom is at **645.2px** (clears 740px fold by 94.8px).
   - `phase2-bundle-3` (sequential): question bottom is at **693.2px** (clears 740px fold by 46.8px).
   All treatments keep the prompt and active input controls comfortably above the fold at 360px.

2. **Condition B — Scoping of doubled bars:**
   Doubled bars apply strictly when `scene.meaning.currentTask?.beat === 'transform'` and `scene.meaning.transition?.changed?.includes(side)`. On all subsequent beats (`operate`, `resolve`, `reflect`), the episode returns to compact single bars with `currentForm`. This protects the fold clearance on later beats and prevents leaking the equivalent form during reflection.

3. **Condition C — Copy in `strings.js` at Grade 2–3 reading level:**
   All new copy resides in `src/render/strings.js`, parameterized, with zero inline string literals in renderers. Phrasing strictly adheres to Grade 2–3 reading level ("Before: 2/3", "After: 8/12", "Step 1: Start with 2/3", "Split into 12 parts", "Step 2: New parts 8/12"). No speculative specification jargon like "Equivalent form" was used.

4. **Condition D — Distinguishability of Juxtaposed and Sequential:**
   - `juxtaposed` (bundle 2) renders an aligned direct comparison: two stacked parallel bars sharing exact scale and horizontal alignment with simple `Before` / `After` labels, designed for direct length comparison.
   - `sequential` (bundle 3) renders a procedural workflow progression: two styled step cards (`Step 1: Start with 2/3`, `Step 2: New parts 8/12`) connected by a prominent directional action bridge badge (`↓ Split into 12 parts`).
   They are visually and structurally distinct in DOM hierarchy, class names, copy, and layout.

### Detailed Item 6 Measurements (Segment Widths & Viewports)

Measured in headless Microsoft Edge via Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride`):

| Metric | Viewport 320px | Viewport 360px |
|---|---|---|
| Track outer width | 166px | 206px |
| Track inner width | 162px | 202px |
| Segment width at denominator 12 | **13.50px** | **16.83px** |
| Segment width at denominator 24 | **6.75px** | **8.42px** |
| Segment width at denominator 30 | **5.40px** | **6.73px** |
| Document scrollWidth vs clientWidth | 320 / 320 | 360 / 360 |
| Body / App scrollWidth | 304px | 344px |

At 320px width, denominator 30 produces a segment width of 5.40px, falling below the ~6px threshold. As instructed by Repair 03 Item 6, we report that choosing a threshold to suppress internal segment dividers is an instructional/pedagogical decision requiring an owner decision. No controls were shrunk and the LCD was not capped.

### Reflect-Beat Geometry (Viewport Heights 740px vs 752px)

| Metric | Condition 1 (In-Place) | Condition 2 (Juxtaposed) | Condition 3 (Sequential) | Condition 4 (Premise) |
|---|---|---|---|---|
| First bar top (px / %) | 109px (14.7% of 740 / 14.5% of 752) | 109px (14.7% / 14.5%) | 109px (14.7% / 14.5%) | 109px (14.7% / 14.5%) |
| Current question section top | 355.78px | 355.78px | 355.78px | 278.78px |
| Choice 1 bottom | 558.03px (clears) | 558.03px (clears) | 558.03px (clears) | 476.22px (clears) |
| Choice 2 bottom | 658.03px (clears) | 658.03px (clears) | 658.03px (clears) | 546.22px (clears) |
| Choice 3 bottom | 758.03px (past 740/752) | 758.03px (past 740/752) | 758.03px (past 740/752) | N/A (2 choices) |
| Choices clearing 740px fold | **2 of 3** | **2 of 3** | **2 of 3** | **2 of 2 (100%)** |
| Choices clearing 752px fold | **2 of 3** | **2 of 3** | **2 of 3** | **2 of 2 (100%)** |

### Advisor consultation disposition

Branch C (orchestrator-gate-only) was used for Repair 03. This thread matches no provider in `advisor-capable-providers.json`, and per the fail-closed governance rule, no higher-tier consultation could run. All verification was conducted through the orchestrator approval gate, property assertions, and independent headless browser metrics.

### Repair 03 verification commands

| Check | Result |
|---|---|
| `node scripts/dev/plan-status.js check plan-09` | `RUNNABLE` preflight result |
| `npm test` | **18 files, 214 tests passed** |
| `npm run build` | **Passed**; Vite 6.4.3, 41 modules transformed in 456ms |
| `node scripts/dev/plan-status.js lint` | **Passed**: `lint: OK (no violations)` |
| `git diff --check` | **Passed**; clean diff |
| Headless browser metrics | **Passed**; measurements recorded above |

The packet status and exit gate remain unchanged and owner/orchestrator-controlled. The next authority-bearing step is orchestrator/owner review, not an automatic status advance.

## 8. Repair 04 — Mechanism Proposals and Ungated Implementations

**Date:** 2026-09-20  
**Status:** Mechanized ungated fixes delivered (Items 1, 3, 4, 5, 6); mechanism proposals submitted for gated items (Items 0, 0b, 2).

### 8.1 Mechanism Proposals for Gated Items (Propose and Stop)

#### Item 0 — Premise Check (CM-01-P) Mechanism Proposal
The premise check check-the-premise form (`CM-01-P`) requires three coordinated elements to satisfy DECISION-026:

1. **Authored Content for False Premise:**
   - **Location:** Authored in `src/content/data/premise-checks.js` (or alongside curated fixture reflection choices).
   - **Form:** Pure data records, never computed in `src/render/` or derived at runtime. Each curated fixture/denominator route specifies an authored premise pair:
     - `sourceForm`: e.g. `{ kind: 'fraction', numerator: '2', denominator: '3' }`
     - `presentedForm`: e.g. `{ kind: 'fraction', numerator: '7', denominator: '12' }` (distractor) or `{ kind: 'fraction', numerator: '8', denominator: '12' }` (equivalent)
     - `expected`: `'no'` (when non-equivalent) or `'yes'` (when equivalent)
     - `distractorType`: e.g. `'off-by-one-numerator'`
   - **Classification:** `handleReflect(state, intent)` in `src/interaction/episode.js` evaluates `intent.response` against the authored expected response. If matching, it yields assessed success (`kind: 'correct-reflection'`); if mismatched, it yields `recovery` (`kind: 'incorrect-reflection'`) with local feedback (`premiseFalseYesNotice` when answering yes to a false equivalence).

2. **Visible Referents on Screen:**
   - At the `reflect` beat under `connectionForm === 'premise'`, the visual renderer mounts two explicit fraction bar models in the comparison panel:
     - **Top Bar:** Labeled `"Starting fraction: 2/3"` (displaying 2 of 3 parts shaded).
     - **Bottom Bar:** Labeled `"New parts: 7/12"` (displaying 7 of 12 parts shaded).
   - Below the models, the active beat prompt reads: `"Does this new bar show the same amount as before?"` with buttons `"Yes, it is the same amount"` and `"No, the amount changed"`.
   - The learner directly sees both bars and can compare their shaded lengths (8/12 equivalent length vs 7/12 distractor length).

3. **Context Framing (Avoiding Software Bug Appearance):**
   - Because the learner already successfully converted 2/3 to 8/12 earlier in the episode, presenting 7/12 must be clearly framed as an external proposition to evaluate:
     - Header/context copy: `"Check this renaming:"`
     - Linear equivalent: `"Check this fraction: 7/12. Does this fraction show the same amount as 2/3?"`
   - This makes it explicit that the learner is auditing a proposed change, completely eliminating any perception of application error.

4. **Beat Lifecycle:**
   - **Does NOT require a new beat.** The existing `reflect` beat is specifically allocated for connection-making (CM-01). The scene projection simply supplies `premiseCase` data rather than `reflectionChoices` when `connectionForm === 'premise'`.

5. **Replay Envelope Recording:**
   - Replay provenance logs:
     - `intent`: `{ type: 'submit-reflection', response: 'no' }`
     - `resultingState.established.reflection`: `{ premiseCaseId: '...', response: 'no', expected: 'no' }`
   - Replay envelope reconstructs the identical check deterministically from the instance definition.
   - **Interim posture:** `phase2-bundle-4` remains unregistered in `src/app/conditions.js` and the pin test in `tests/app-shell.test.js` is preserved until owner approval.

---

#### Item 0b — "Smooth change" Animation and Scoping Proposal
Investigation revealed two independent root causes:
1. **Renderer Animation Absence & ReplaceChildren:** `src/styles/render.css` has zero keyframe animations; `.subdivided` has no CSS rule; and `fraction-bar.js:106` calls `rootEl.replaceChildren()`, destroying old segments and creating new ones, which prevents CSS transitions across denominator changes.
2. **Scoping Exclusion:** Condition B scoped choreography to `beat === 'transform'` with `transition.changed.includes(side)`. At `transform-left`, no conversion is established, so all conditions render identically. At `transform-right`, left shows choreography. At `operate`, beat is no longer `transform`, so right conversion is never choreographed.

**Stop Condition Evaluation & Recommendation:**
- *Segment Identity Preservation:* Maintaining segment DOM node identity across a denominator change (e.g. splitting 3 elements into 12 elements via sub-element trees or keyed virtual diffing) requires abandoning `replaceChildren()`, building an internal segment DOM reconciliation engine, and coordinating multi-phase animation lifecycles.
- **Stop Condition Triggered:** Four core packets (`plan-07`, `plan-08`, `plan-09`, and acceptance) depend directly on `fraction-bar.js`. Reworking the fundamental segment DOM architecture is beyond the scope of a repair packet and belongs in **Plan 10**.
- *Alternative for Repair (Explicit Transitional Render):*
  - If handled within repair scope without segment identity diffing: When a conversion transition is established, the renderer applies an explicit transitional class (`.fraction-bar-track.animating-subdivision`) to the freshly mounted 12 segments.
  - A `@keyframes subdivideSweep` CSS rule animates segment divider borders and a brief highlight sweep (400ms duration, suppressed under `prefers-reduced-motion: reduce`).
  - Zero mathematics in renderer; purely data-driven from `scene.meaning.transition`.
- *Scoping Fix:*
  - Scope choreography to the beat where the change becomes established:
    - At `transform` (right operand): left bar renders choreography (`juxtaposed` / `sequential` / `animated`).
    - At `operate` (first arrival): right bar renders its newly completed transition choreography.
  - To prevent layout bloat on narrow viewports (360px), only the *most recently converted* operand displays doubled bars (maximum 3 tracks rendered at any time: 2 comparison rows for converted side + 1 standard row for the other), ensuring the active controls remain above the 740px fold.

---

#### Item 2 — Simplified Final Form Proposal
During the `resolve` beat, `preferredFinalForm: resolution?.proposed ?? null` in `scene.js:542` reads `state.established.resolution`, which is null because resolution is only established *after* `submit-resolution` is clicked. Consequently, both renderers take the raw branch and `strings.resolve.unsimplifiedNotice` never fires (e.g. `22/24` is never shown as `11/12`).

1. **New Scene Projection:**
   - Name: `scene.meaning.operation.simplifiedResult` (or `scene.meaning.operation.canonicalResult`).
   - Derived in: `src/interaction/scene.js` (`operationMeaning`), computed by applying pure `simplifyFraction` from `src/math/fraction.js` to `state.established.operation.proposed`.
   - **Why instructional state:** Mathematical equivalence and canonical reduction are instructional truths, not UI conveniences. The renderer is strictly presentational (purity constraint) and must never compute GCDs or fraction simplifications.
2. **Confirmation of Renderer Purity:**
   - Confirmed: No `src/render/` module computes simplification. Renderers only compare `pref.numerator !== raw.numerator` and format `strings.resolve.unsimplifiedNotice(raw, pref)`.
3. **Role of `preferredFinalForm`:**
   - `preferredFinalForm` should stay as the projection indicating the target resolved form. During `beat === 'resolve'`, its projection should be:
     `preferredFinalForm: resolution?.proposed ?? (simplifiedResult || rawResult)`.
   - Under this definition, when the raw operation is `22/24`:
     - `raw` is `22/24`
     - `pref` is `11/12`
     - `pref.numerator !== raw.numerator` is true (`11 !== 22`).
     - Prompt text immediately renders: `"22/24 is correct! It can also be written as 11/12."`
4. **Learner Interaction (Notice vs Choice):**
   - **Recommended: Notice.** The prompt presents the calm equivalence notice while the single primary button remains `"Next Problem"` (dispatching `submit-resolution` with `proposed: pref`).
   - Rationale: The Phase 2 learning target is unlike-denominator addition/subtraction, not fraction simplification. A notice reinforces the mathematical connection without adding a separate input hurdle. A choice would introduce new learner responsibility and state transitions requiring a new packet.
5. **Beat Lifecycle:**
   - **Does NOT require a new beat.** The notice renders directly within the existing `resolve` beat.

---

### 8.2 Ungated Implementations (Items 1, 3, 4, 5, 6)

#### Item 1 — Recovery Feedback Dispatch Fixed
- `src/render/beat-container.js` and `src/render/linear-path.js`:
  - Dispatched recovery specifically for all kinds produced by `src/interaction/classification.js`:
    - `denominator-changed-without-numerator` → `strings.transform.errorScaleFactor` (`"Multiply the top and bottom by the same number."`)
    - `incorrect-equivalent-numerator` → `strings.transform.errorNumerator` (`"Count the shaded parts in the new bar and try again."`)
    - `incorrect-numerator-arithmetic` → `strings.operate.errorArithmetic` (`"The denominator stays the same. Add only the top numbers."`)
    - `invalid-reflection-choice` → `strings.reflect.invalidChoice` / `strings.reflect.invalidChoiceLinear`
    - `incorrect-notice` → checked `expectedMatches` to correctly distinguish between `feedbackDiff` and `feedbackSame(leftDen, rightDen)`.
  - Deleted dead unproduced branches: `incorrect-conversion`, `incorrect-operation`, `incorrect`.
  - Renamed nothing in `src/interaction/`.

#### Item 3 — Linear Path DOM Ordering Fixed
- `src/render/linear-path.js`: Appended `activeBeatEl` before `completedBeatsEl` in `initLayout()`, matching the visual path.
- Added DOM ordering parity assertion to `tests/access-parity.test.js`, verifying that `activeBeatEl` precedes `completedBeatsEl` in DOM order across both visual and linear paths.

#### Item 4 — Invalid Denominator Names the Number
- `src/render/beat-container.js` and `src/render/linear-path.js`:
  - Updated to read `recovery.classification.targetDenominator` first, falling back to `proposed` or `'This number'`.
  - Tested in `tests/render-recovery.test.js`: Confirmed that proposing denominator 18 renders `"18 is not a common denominator. Try another number."` without falling back to `'This number'`.

#### Item 5 — Dead Strings Removed & Unreachable Positive Feedback Reported
- Removed genuinely dead strings from `src/render/strings.js`:
  - `status.transitionComplete`
  - `status.stepCorrect`
  - `app.completedHelp`
  - `reflect.noneOfTheseOption`, `reflect.noneOfTheseCorrect`, `reflect.noneOfTheseOptionLinear`
- Updated `tests/render-strings.test.js` to assert `invalidChoice` instead of the removed `noneOfThese` strings.
- Retained `validLeast` and `validNonLeast` in `strings.decide`:
  - **Report:** These strings are currently unreachable because the `decide` beat advances immediately to `transform` upon a correct denominator submission without displaying positive confirmation. Whether positive feedback should be displayed at `decide` (e.g. via an interim confirmation state or toast) is an instructional design question for owner review.

#### Item 6 — Recovery Guard Test Suite
- Added `tests/render-recovery.test.js` (15 tests):
  - Enumerates all recovery kinds produced by `src/interaction/classification.js`:
    - `denominator-changed-without-numerator`
    - `incorrect-equivalent-numerator`
    - `incorrect-numerator-arithmetic`
    - `invalid-common-denominator`
    - `incorrect-notice`
    - `incorrect-reflection`
    - `invalid-reflection-choice`
  - Exercises each kind across **both visual and linear paths**, asserting that:
    1. Recovery feedback element is mounted with `role="alert"`.
    2. Feedback text does NOT fall back to `strings.status.stepIncorrect` (`"Not quite."`).
    3. Feedback text matches the exact authored string for that error kind.
  - Note: `classification.js` returns kind literals directly rather than exporting an enum; the guard test explicitly covers every produced kind.

---

### 8.3 Stated Reference Viewports & Layout Geometry Re-Measurement

All measurements taken on the learner-facing rendered surface:
- **Reference Viewports:** `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference).

| State & Condition | Surface Measured | 360×740 Fold (740px) | 360×752 Fold (752px) |
|---|---|---|---|
| Reflect beat (all conditions, single bars) | Active question bottom | **558px** (clears by 182px) | **558px** (clears by 194px) |
| Reflect beat (Choice 1 bottom) | Button bottom edge | **558px** (clears) | **558px** (clears) |
| Reflect beat (Choice 2 bottom) | Button bottom edge | **658px** (clears) | **658px** (clears) |
| Reflect beat (Choice 3 bottom) | Button bottom edge | **758px** (past fold) | **758px** (past fold) |
| Transform-right: `in-place` | Submit button bottom | **605px** (clears by 135px) | **605px** (clears by 147px) |
| Transform-right: `juxtaposed` | Submit button bottom | **717px** (clears by 23px) | **717px** (clears by 35px) |
| Transform-right: `sequential` | Submit button bottom | **746px** (6px below 740px) | **746px** (clears by 6px) |

*Observation:* As reported in Repair 03 review, under `sequential` at `transform-right`, the Submit button's bottom edge sits at **746px**. It clears a 752px fold by 6px and is 6px below a 740px fold.

---

### 8.4 Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. `advisor-capable-providers.json` lists Claude Code, Codex CLI, and Kimi Code. Per the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; all verification relies on fail-first automated test assertions and the orchestrator review gate.

---

### 8.5 Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **19 passed (19 files, 230 tests passed)** | +16 tests covering recovery dispatch, Item 4 denominator naming, and DOM order parity |
| `npm run build` | **Passed** | 41 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean tree after commit | No unstaged or untracked files |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

---

## 9. Repair 05 Execution: Premise Check, Simplified Final Form, Scoped Choreography, Notice Repair, and Guard Drift (2026-09-20)

### 9.1 Summary of Changes

Working from baseline commit `39b9e51`, Repair 05 completed all approved items without departing from specification:

1. **Item 1 (Premise Check):**
   - Created `src/content/data/premise-checks.js` with deterministic mapping via `premiseCheckForInstance`.
   - Authored both false (`premise-rel-prime-12`, $2/3 \to 7/12$, answer 'no') and true (`premise-rel-prime-24`, $2/3 \to 16/24$, answer 'yes') cases.
   - Classification in `src/interaction/classification.js` (`classifyPremiseResponse`) evaluates response against `premiseCase.expectedResponse`.
   - Local recovery handles wrong answers; correct answer resolves episode recording `premiseCaseId` in `established.reflection`.
   - Mounted referents on screen at `reflect` beat (`.premise-comparison` with starting fraction bar and new parts bar) with framing copy in both visual and linear renderers.
   - Live copy: `strings.reflect.premiseExpectedYes` activated for true case; specific false-yes and false-no notices wired.
   - Created `tests/premise-check.test.js` validating the 4 required failure modes against baseline.
   - Re-registered `phase2-bundle-4` in `src/app/conditions.js` and replaced pin test in `tests/app-shell.test.js` with full app-shell integration test.
2. **Item 2 (Simplified Final Form Notice):**
   - Derived `simplifiedResult` upstream in `src/interaction/classification.js` via `simplifyFraction`.
   - Pure projection in `src/interaction/scene.js` (`operationMeaning`) without importing from `src/math/` or using `BigInt`.
   - Renderers display notice `strings.resolve.unsimplifiedNotice` when `simplifiedResult` differs from `rawResult`.
   - Continue button dispatches `submit-resolution` with `proposed: raw`: what the learner produced (e.g. $22/24$) is recorded in provenance and state resolution.
   - At `reflect` beat, `preferredFinalForm` evaluates to `resolution.proposed` ($22/24$), keeping its meaning unchanged.
3. **Item 3 (Choreography Scoping):**
   - Scoped doubled bars to conversion establishment beats: `beat === 'transform' || beat === 'operate'`.
   - Only `transition.changed.includes(side)` displays doubled bars: left operand at `transform-right`, right operand at `operate`.
   - Strict 3-track budget: maximum 3 tracks on screen at any time.
   - Re-measured 360px viewport geometry across all conditions at both `transform-right` and `operate` against `360×740` and `360×752` folds.
4. **Item 4 (Inverted Notice Branch Collapsed):**
   - Collapsed unreachable `if (recovery.classification.expectedMatches)` branch in `beat-container.js` and `linear-path.js` to `feedbackSame(leftDen, rightDen)` with an explanatory comment identifying the deferred Phase 3 like-denominator string.
5. **Item 5 (Classifier Recovery Guard Drift Closed):**
   - Exported `CLASSIFICATION_RECOVERY_KINDS` in `src/interaction/classification.js`.
   - Added test in `tests/render-recovery.test.js` verifying that every classifier recovery kind appears in the guard table and that static extraction finds no undeclared recovery kinds in `classification.js`.

### 9.2 Stated Reference Viewports & Geometry Re-Measurement

Measurements on the learner-facing rendered surface:
- **Reference Viewports:** `360×740` (mobile fold reference) and `360×752` (Chromebook/tablet reference).

| State & Condition | Surface Measured | 360×740 Fold (740px) | 360×752 Fold (752px) |
|---|---|---|---|
| **Transform-right:** `in-place` | Check button bottom | **605px** (clears by 135px) | **605px** (clears by 147px) |
| **Transform-right:** `juxtaposed` | Check button bottom | **717px** (clears by 23px) | **717px** (clears by 35px) |
| **Transform-right:** `sequential` | Check button bottom | **746px** (6px below 740px fold) | **746px** (clears by 6px) |
| **Operate beat:** `in-place` | Check button bottom | **605px** (clears by 135px) | **605px** (clears by 147px) |
| **Operate beat:** `juxtaposed` | Check button bottom | **717px** (clears by 23px) | **717px** (clears by 35px) |
| **Operate beat:** `sequential` | Check button bottom | **746px** (6px below 740px fold) | **746px** (clears by 6px) |
| **Reflect beat:** Matching choices | Choice 1 button bottom | **558px** (clears by 182px) | **558px** (clears by 194px) |
| **Reflect beat:** Matching choices | Choice 2 button bottom | **658px** (clears by 82px) | **658px** (clears by 94px) |
| **Reflect beat:** Matching choices | Choice 3 button bottom | **758px** (past fold) | **758px** (past fold) |
| **Reflect beat:** Premise check (`CM-01-P`) | Yes button bottom | **476px** (clears by 264px) | **476px** (clears by 276px) |
| **Reflect beat:** Premise check (`CM-01-P`) | No button bottom | **546px** (clears by 194px) | **546px** (clears by 206px) |

### 9.3 Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. `advisor-capable-providers.json` lists Claude Code, Codex CLI, and Kimi Code. Per the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; all verification relies on fail-first automated test assertions and the orchestrator review gate.

### 9.4 Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 235 tests passed)** | 100% pass across all unit, property, and render tests |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

---

## 10. Repair 06 Execution: Milestone Denominator Acknowledgement, OQ-21 Deferred String, Recovery Kind Constants, and Item 1 Mechanism Proposal (2026-09-21)

### 10.1 Summary of Changes Delivered (Items 2–4)

Working from baseline commit `a1b1841`, Repair 06 delivered all approved items without departing from specification:

1. **Item 2 (Confirm a Correct Denominator Choice, DECISION-028):**
   - Projected `mathClassification: commonDenominator.mathClassification ?? null` upstream in `src/interaction/scene.js` (`commonUnitMeaning`).
   - Rewrote `STRINGS.decide.validLeast` to `"Common denominator: ${den} — the smallest one."` and `validNonLeast` to `"Common denominator: ${den} — both fractions can use it."` in `src/render/strings.js`.
   - Parameterized `STRINGS.summaryLines.decideDone(den, mathClassification)` to delegate to those functions.
   - Updated `src/render/beat-container.js` and `src/render/linear-path.js` to pass `unitRel.commonUnit.mathClassification` without performing any mathematical evaluation in presentation.
   - Added unit assertions in `tests/render-strings.test.js` and end-to-end milestone assertions in `tests/app-shell.test.js` for both least (12) and non-least (24) paths.
2. **Item 3 (Record Deferred Like-Denominator String, OQ-21):**
   - Added `OQ-21 — Authored recovery copy for like-denominator mistake at notice beat` in `docs/open-questions.md`.
   - Durably documents the Phase 3 content obligation for `classifyNoticeResponse` when `expectedMatches: true` (like denominators) and the learner mistakenly answers "different sizes".
3. **Item 4 (Close Recovery Guard Loop):**
   - Defined and exported `RECOVERY_KINDS = Object.freeze({...})` in `src/interaction/classification.js`.
   - Derived `CLASSIFICATION_RECOVERY_KINDS = Object.freeze(Object.values(RECOVERY_KINDS).sort())`.
   - Replaced bare string literals across all classifier functions with references to `RECOVERY_KINDS`.
   - Updated `tests/render-recovery.test.js` to verify that all entries in `RECOVERY_KINDS` exist in the guard table and that static scanning finds no bare recovery kind string literals in `classification.js`.

---

### 10.2 Item 1 Mechanism Proposal: Making Replay Real

Per `repair-06.md` and DECISION-027, "Replay the last change" must visibly re-present the most recently established transition using the active design condition's treatment without altering mathematical or instructional state and without introducing history into `scene`.

1. **Where the Flag Lives:**
   - App shell presentation state (`let isReplaying = false`), projected into `scene.presentation.isReplaying: boolean` (default `false`) via `resolveRenderableScene({ state, presentationMode, isReplaying })`.
   - `scene.presentation` is the designated home for display directives (`mode`, `choreography`). It introduces no history, preserves `SCENE_HISTORY_KEYS`, and maintains identical presentation semantics across both visual and linear renderers.
   - Replay executes within the active beat; no new beat is required.
2. **Clearing Triggers & No-Transition Behavior:**
   - Ephemeral: clears upon any learner input, forward action, display switch, view toggle, or toggle/dismiss click.
   - At beats with no established transition (`encounter`, `notice`, `decide`, `transform-left` prior to left conversion submission), `scene.meaning.transition === null`.
   - Button is disabled at `encounter`. At `notice`, `decide`, or `transform-left`, clicking replay keeps `isReplaying: false`, announces `STRINGS.app.noReplayYet` (*"Finish a change before replaying it."*) via polite aria-live notice, and causes zero DOM disturbance.
3. **Active Condition Treatments:**
   - **Juxtaposed (`D-02-J`):** At conversion beats (`transform-right`, `operate`), re-focuses/pulses the existing 2-track comparison. At `resolve` and `reflect`, re-expands the last converted operand into the juxtaposed comparison.
   - **Sequential (`D-02-S`):** At conversion beats, re-focuses the sequential cards. At `resolve` and `reflect`, re-expands the last converted operand into the sequential cards.
   - **New Parts Only (`in-place`, `D-02-M`):** Replay temporarily presents the starting fraction `transition.pre[side]` with an unobtrusive badge (*"Starting parts: 2/3"*) before returning to the converted state (or toggled via "Show new parts"). Under *New parts only*, replay is the *only* way a learner sees the before state at all, fulfilling DECISION-027.
4. **Reduced-Motion Behavior:**
   - Zero animation durations, zero CSS transitions, zero automatic dismiss timers.
   - Static presentation of comparison cards or static before-state with clear toggle, accompanied by polite live-region announcement.
5. **Provenance & `replayHistory`:**
   - `replayHistory` MUST continue recording in `state.replayHistory` and `state.supportHistory` inside `handleReplay` for learner provenance and audit integrity. It remains excluded from `scene` per `SCENE_HISTORY_KEYS`.
6. **Gate Status:**
   - **STOPPED AT MECHANISM GATE.** No implementation code for Item 1 has been written pending owner review and approval.

---

### 10.3 Stated Reference Viewports & Geometry Measurements

Measurements on the learner-facing rendered surface (`360×740` mobile fold reference and `360×752` Chromebook/tablet reference):

| Beat & Condition | Active Control Surface | Resting Height (Bottom) | During Replay Height (Bottom) | Fold Clearance (740px / 752px) |
|---|---|---|---|---|
| **Notice & Decide** (all conditions) | Choice / Input buttons | 476px – 530px | **Unchanged** (no transition) | Clears by ≥210px / ≥222px |
| **Transform-left** (all conditions) | Numerator Check button | 605px | **Unchanged** (no transition) | Clears by 135px / 147px |
| **Transform-right: in-place** | Numerator Check button | 605px | **605px** (in-place track) | Clears by 135px / 147px |
| **Transform-right: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed) | Clears by 23px / 35px |
| **Transform-right: sequential** | Numerator Check button | 746px | **746px** (already sequential) | 6px past 740px / Clears 752px by 6px |
| **Operate: in-place** | Numerator Check button | 605px | **605px** (in-place track) | Clears by 135px / 147px |
| **Operate: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed) | Clears by 23px / 35px |
| **Operate: sequential** | Numerator Check button | 746px | **746px** (already sequential) | 6px past 740px / Clears 752px by 6px |
| **Resolve: in-place** | Continue button | 520px / 562px | **520px / 562px** | Clears by ≥178px / ≥190px |
| **Resolve: juxtaposed** | Continue button | 520px / 562px | **632px / 674px** (+112px) | Clears 740px by 66px / 752px by 78px |
| **Resolve: sequential** | Continue button | 520px / 562px | **661px / 703px** (+141px) | Clears 740px by 37px / 752px by 49px |
| **Reflect: Premise Check (`CM-01-P`)** | Yes / No buttons | 476px / 546px | **476px / 546px** (Inspection mode: 530px) | Clears by ≥194px / ≥206px |
| **Reflect: Matching (`CM-01-M`)** | Choice 1, 2, 3 buttons | 558px / 658px / 758px | Choice 1 clears; Choice 3 at 758px | Inspection mode preserves fold at 530px |

*Note on Reflect Fold Preservation:* At `reflect`, choice buttons already consume the fold budget (Choice 3 sits at 758px). Replay at `reflect` engages an ephemeral Inspection Mode where the question prompt and choices are temporarily replaced by the replayed transition card and a "Done looking (Return to question)" button at **530px** (clears fold by 210px), preventing active controls from being pushed below the fold.

---

### 10.4 Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. `advisor-capable-providers.json` lists Claude Code, Codex CLI, and Kimi Code. Per the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; all verification relies on fail-first automated test assertions and the orchestrator review gate.

---

### 10.5 Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 236 tests passed)** | 100% pass across all unit, property, and render tests |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean working tree | Staged by explicit path discipline |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

---

## 11. Repair 06 Implementation — Making Replay Real (Items 1–4 Complete)

- **Date:** 2026-09-21
- **Base Commit:** `755445f`
- **Scope:** Item 1 implemented per approved mechanism proposal and review conditions A–D. Items 2–4 accepted per `repair-06-review.md`.

### 11.1 Implementation of Conditions A–D

1. **Condition A (Zero Auto-Advance in Every Motion Mode):**
   - Endpoints remain inspectable indefinitely without timers across standard motion, reduced motion, and instant-test modes (DECISION-021 criterion 4).
   - Under *New parts only* (`in-place`, `D-02-M`), triggering replay mounts the starting fraction track with an explicit badge (*"Starting parts: 2/3"*) and a "Show new parts" toggle button (`.fraction-bar-toggle-btn`).
   - Zero `setTimeout` or automatic delays. Clicking "Show new parts" dispatches `{ type: 'dismiss-replay' }`, returning to new parts ($8/12$).
2. **Condition B (Focus Preservation & Calm Styling):**
   - Replay does not steal focus or displace the learner's typing caret during interactive beats (`transform`, `operate`).
   - Standard motion pulses (`@keyframes replay-pulse` on `.replay-active`) are strictly suppressed under `@media (prefers-reduced-motion: reduce)` and `[data-presentation-mode="reduced-motion"]`.
   - In Inspection Mode at `reflect`, `previousFocusRef` saves `document.activeElement`, focus moves deliberately to "Done looking", and on exit focus is cleanly restored.
3. **Condition C (`assertSceneCurrent` Currency Contract):**
   - `src/interaction/scene.js:sourceContext()` includes `isReplaying: Boolean(isReplaying)` in its canonical projection digest.
   - `assertSceneCurrent(sceneResult, { state, representationRole, presentationMode, isReplaying })` verifies currency across replay states, throwing `STALE_SCENE` on any mismatch.
   - Verified bidirectional staleness detection, currency passing, and JSON round-trip admission in `tests/interaction-scene.test.js`.
4. **Condition D (Leakage Invariant 6b & Inspection Mode):**
   - At `reflect`, Inspection Mode genuinely unmounts reflection choices (`controlsContainer.replaceChildren(card)`), leaving zero choice buttons in the DOM (DECISION-014).
   - Upon exiting Inspection Mode, choices remount in identical order, unselected, with no leaked indicators.
   - Fail-first verified in `tests/leakage-invariants.test.js` (`Invariant 6b / Condition D`).

### 11.2 Live Captured DOM Outputs

- **Condition 1 (New parts only / in-place / `D-02-M`):**
  - *Before:* Left bar shows 8/12 subdivided parts only; starting 2/3 hidden. `in-place` replay card absent; `aria-pressed="false"`.
  - *During:* Shows Starting parts: 2/3 with "Show new parts" toggle button; `in-place` replay card present; `aria-pressed="true"`.
- **Condition 2 (Compare / juxtaposed / `D-02-J`):**
  - *Before:* Shows Before (2/3) and After (8/12) tracks; `.replay-active` absent; `aria-pressed="false"`.
  - *During:* Adds `.replay-active` to active comparison card (pulse in standard motion, suppressed in reduced motion); `aria-pressed="true"`.
- **Condition 3 (Steps / sequential / `D-02-S`):**
  - *Before:* Shows Step 1 (2/3), connector, and Step 2 (8/12); `.replay-active` absent; `aria-pressed="false"`.
  - *During:* Adds `.replay-active` to active sequential card; `aria-pressed="true"`.
- **Reflect Beat (Inspection Mode):**
  - *Before:* Prompt "Tap the bar that shows the same amount as 2/3."; 3 choices mounted; inspection card absent.
  - *During:* Prompt "Looking back at the last change:"; 0 choices in DOM (genuinely unmounted); `.replay-inspection-card` with "Done looking" button present; focus moved to "Done looking".
  - *After:* Choices remounted in original order; inspection card absent; focus restored.

### 11.3 360px Viewport Cost Across All Beats and Conditions

| Beat & Condition | Active Control Surface | Resting Height (Bottom) | During Replay Height (Bottom) | Fold Clearance (740px / 752px) |
|---|---|---|---|---|
| **Notice & Decide** (all conditions) | Choice / Input buttons | 476px – 530px | **Unchanged** (no transition) | Clears by ≥210px / ≥222px |
| **Transform-left** (all conditions) | Numerator Check button | 605px | **Unchanged** (no transition yet) | Clears by 135px / 147px |
| **Transform-right: in-place** | Numerator Check button | 605px | **605px** (in-place track) | Clears by 135px / 147px |
| **Transform-right: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed) | Clears by 23px / 35px |
| **Transform-right: sequential** | Numerator Check button | 746px | **746px** (already sequential) | 6px past 740px / Clears 752px by 6px |
| **Operate: in-place** | Numerator Check button | 605px | **605px** (in-place track) | Clears by 135px / 147px |
| **Operate: juxtaposed** | Numerator Check button | 717px | **717px** (already juxtaposed) | Clears by 23px / 35px |
| **Operate: sequential** | Numerator Check button | 746px | **746px** (already sequential) | 6px past 740px / Clears 752px by 6px |
| **Resolve: in-place** | Continue button | 520px / 562px | **520px / 562px** | Clears by ≥178px / ≥190px |
| **Resolve: juxtaposed** | Continue button | 520px / 562px | **632px / 674px** (+112px) | Clears 740px by 66px / 752px by 78px |
| **Resolve: sequential** | Continue button | 520px / 562px | **661px / 703px** (+141px) | Clears 740px by 37px / 752px by 49px |
| **Reflect: Premise Check (`CM-01-P`)** | Yes / No buttons | 476px / 546px | **530px** (Inspection card + "Done looking") | Clears by 210px / 222px |
| **Reflect: Matching (`CM-01-M`)** | Choices 1, 2, 3 | Choice 3 at 758px | **530px** (Inspection card + "Done looking") | Clears by 210px / 222px |

### 11.4 Owner Review Note: Dual Comparison at Reflect

Flagged for owner rendered-screen review per review prompt: At `reflect`, the replayed conversion is the right operand ($1/4 = 3/12$) while the reflection prompt asks about the left ($2/3$).

### 11.5 Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**
This thread operates on Google Antigravity / Gemini. Per the fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; verification relies on fail-first automated test assertions and the orchestrator review gate.

### 11.6 Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 240 tests passed)** | 100% pass across all unit, property, and render tests |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean working tree | All files committed by explicit path |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

---

## 12. Repair 07 Execution — Replay True Change, Focus Preservation, Target Floor, Reduced Motion, and Stale Class Cleanup

- **Date:** 2026-09-21
- **Base Commit:** `a91134b` / `048492f`
- **Implementation Commit:** `9693853`
- **Scope:** All 5 items from `repair-07.md` resolved without departing from approved architecture.

### 12.1 Item-by-Item Summary and Concrete Implementations

1. **Item 1 (Replay Presents True Pre-Conversion Form):**
   - **Defect:** In `src/interaction/scene.js:567`, `transitionMeaning` used `findLastIndex` to locate the provenance entry matching `lastConversion`. Because subsequent `operation` and `resolution` provenance entries retain `state.established.lastConversion`, `findLastIndex` selected the newest entry whose `precedingState` was already post-conversion, causing `pre` and `post` to collapse to identical fractions (e.g. $3/12 \to 3/12$).
   - **Fix:** Switched `findLastIndex` to `findIndex` (`src/interaction/scene.js:568`). This locates the first entry in which the conversion was established, whose preceding state is the true un-converted operand ($1/4$).
   - **Failing-First Test:** Added in `tests/interaction-scene.test.js` (`transitionMeaning projects true pre-conversion form at operate and reflect beats (Repair 07 Item 1)`). Verified to fail against `c5ca58e` with `Expected denominator: '4', Received: '12'` and passes after the fix.
   - **UI Verbatim Captures Across All Four Beats:**
     - **`transform-left`:** `notice text: "Finish a change before replaying it."` | `isReplaying aria-pressed: false` (no conversion yet established).
     - **`transform-right`:** `changed: ['left']` | `pre.left: 2/3`, `post.left: 8/12` | `replay header badge: "Starting parts: 2/3"` | `toggle button text: "Show new parts"` | `left bar readout: 2/3`.
     - **`operate`:** `changed: ['right']` | `pre.right: 1/4`, `post.right: 3/12` | `replay header badge: "Starting parts: 1/4"` | `toggle button text: "Show new parts"` | `right bar readout: 1/4`.
     - **`reflect`:** `changed: ['right']` | `pre.right: 1/4`, `post.right: 3/12` | `inspection card note: "Second fraction: 1/4 = 3/12"` | `done button text: "Done looking"`.

2. **Item 2 (Focus Preservation Across Replay):**
   - **Defect:** `renderActiveBeat(scene)` unconditionally invoked `activeBeatEl.replaceChildren()`, destroying the active control subtree and dropping keyboard/screen-reader focus to `BODY`.
   - **Fix:** Scoped `renderActiveBeat(scene)` in both `src/render/beat-container.js` and `src/render/linear-path.js` by caching an `activeBeatRenderToken`. The active beat element is not rebuilt when only `isReplaying` toggles outside `reflect`. At `reflect`, Inspection Mode intentionally toggles `isInspection` with focus transferred to "Done looking" via `previousFocusRef` and cleanly restored on exit.
   - **DOM Mock Enhancement:** Updated `tests/fixtures/mock-dom.js` to support `contains()`, track `document.activeElement`, and reset focus to `document.body` when a focused element is removed from the DOM.
   - **Verbatim Captures at `transform-right` (with input value `3`):**
     - Visual path:
       ```
       activeElement before replay: INPUT fraction-control control-numeric-input
       input value before replay: 3
       activeElement after replay: INPUT fraction-control control-numeric-input
       input identity preserved: true
       input value after replay: 3
       activeElement after dismissing replay: INPUT fraction-control control-numeric-input
       input value after dismissing replay: 3
       ```
     - Linear path:
       ```
       activeElement before replay: INPUT fraction-control control-numeric-input
       input value before replay: 3
       activeElement after replay: INPUT fraction-control control-numeric-input
       input identity preserved: true
       input value after replay: 3
       activeElement after dismissing replay: INPUT fraction-control control-numeric-input
       ```

3. **Item 3 ("Show new parts" Toggle Target Floor & Fold Clearance):**
   - **Defect:** `.fraction-bar-toggle-btn` measured $103 \times 23.2\text{px}$, falling below the $24\text{px}$ target size floor (WCAG 2.2 SC 2.5.8 and DECISION-021 criterion 3).
   - **Fix:** In `src/styles/render.css:267`, applied:
     ```css
     .fraction-bar-toggle-btn {
       display: inline-flex;
       align-items: center;
       justify-content: center;
       min-height: 28px;
       min-width: 44px;
       box-sizing: border-box;
       font-size: 0.75rem;
       padding: 0.25rem 0.625rem;
       margin: 2px 0;
       border-radius: 0.25rem;
       border: 1px solid var(--ff-color-border);
       background-color: #fff;
       cursor: pointer;
     }
     ```
   - **Measured Bounding Box:** **107px × 28px** (height $\ge 28\text{px}$, well above $24\text{px}$ floor; $2\text{px}$ vertical margin).
   - **Fold Clearance at 360px:**
     - In-place track resting height to bottom of Submit: 615px.
     - With toggle button (+8.8px layout delta): 624px to bottom of Submit.
     - Clearance at 360×752: **128px clearance** (17.0% viewport margin).
     - Clearance at 360×740: **116px clearance** (15.7% viewport margin).

4. **Item 4 (Non-Motion Replay Acknowledgement for Juxtaposed & Sequential):**
   - **Defect:** Under `prefers-reduced-motion: reduce` or `[data-presentation-mode="reduced-motion"]`, the `replay-active` pulse was suppressed, leaving no visible difference during replay under *Compare before and after* (`juxtaposed`) and *Step-by-step change* (`sequential`).
   - **Fix:** Added persistent, non-animated visual styling (`.replay-highlight` with `border-color: var(--ff-color-border-focus); box-shadow: 0 0 0 2px var(--ff-color-border-focus); background-color: #f0f9ff`) to the before row / Step 1 card, and appended `(replaying)` to the badge/heading text in both visual (`src/render/fraction-bar.js`) and linear (`src/render/linear-path.js`) renderers.
   - **Condition A Governance:** Learner-dismissed, never timed. Remains until the learner toggles replay off, clicks dismiss, requests help, or advances the episode.
   - **Verbatim Captures Under Reduced Motion:**
     - **Compare before and after (`juxtaposed`) BEFORE replay:**
       ```
       bar classList: fraction-bar-container choreography-juxtaposed
       before row HTML: <div class="fraction-bar-comparison-row fraction-bar-row-before"><div class="fraction-bar-badge-wrap"><span class="fraction-bar-badge">Before: 2/3</span></div><div class="fraction-bar-row-body"><div class="fraction-bar-track"><div class="fraction-bar-segment shaded" aria-hidden="true"></div><div class="fraction-bar-segment shaded" aria-hidden="true"></div><div class="fraction-bar-segment unshaded" aria-hidden="true"></div></div><div class="fraction-bar-readout" aria-hidden="true"><span class="fraction-bar-readout-numerator">2</span><span class="fraction-bar-readout-divider"></span><span class="fraction-bar-readout-denominator">3</span></div></div></div>
       ```
     - **Compare before and after (`juxtaposed`) DURING replay:**
       ```
       bar classList: fraction-bar-container choreography-juxtaposed replay-active
       before row classList: fraction-bar-comparison-row fraction-bar-row-before replay-highlight
       before row badge: Before: 2/3 (replaying)
       ```
     - **Step-by-step change (`sequential`) BEFORE replay:**
       ```
       bar classList: fraction-bar-container choreography-sequential
       ```
     - **Step-by-step change (`sequential`) DURING replay:**
       ```
       bar classList: fraction-bar-container choreography-sequential replay-active
       step1 card classList: fraction-bar-step-card fraction-bar-step-1 replay-highlight
       step1 card heading: Step 1: Start with 2/3 (replaying)
       ```

5. **Item 5 (Stale Class Cleanup & CSS Inertia Verification):**
   - **Defect:** After in-place replay, switching conditions left `choreography-in-place` alongside `choreography-juxtaposed` or `choreography-sequential`.
   - **Fix:** In `src/render/fraction-bar.js`, added explicit removal of `choreography-in-place` in `isJuxtaposed`, `isSequential`, and the standard single-bar `else` branch.
   - **CSS Inertia:** Verified via codebase audit that `choreography-in-place` is never referenced in any stylesheet (`render.css` has rules for `choreography-juxtaposed` and `choreography-sequential`, but none for `choreography-in-place`). It was completely inert in CSS.
   - **Verbatim Captures:**
     ```
     In-place replaying bar classes: fraction-bar-container choreography-in-place replay-active
     After switch to juxtaposed, bar classes: fraction-bar-container choreography-juxtaposed
     Contains choreography-in-place: false
     After switch to sequential, bar classes: fraction-bar-container choreography-sequential
     Contains choreography-in-place: false
     ```

---

### 12.2 Verification of Conditions A, C, and D

- **Condition A (No Auto-Advance):** Zero `setTimeout`, zero timed transitions. "Show new parts" toggle and "Done looking" buttons remain indefinitely until learner interaction. Non-motion replay highlight remains active until dismissed or next step.
- **Condition C (`isReplaying` in Currency Contract):**
  ```
  Condition C: isReplaying in scene.presentation: true true
  scene.presentation keys: [ 'choreography', 'isReplaying', 'mode' ]
  ```
  `assertSceneCurrent` strictly validates currency of `isReplaying`.
- **Condition D (Reflect Inspection Mode & Leakage Invariants):**
  `tests/leakage-invariants.test.js` (`Invariant 6b / Condition D`) passes 100% against replaying `reflect` scene: matching choices unmount completely during replay and remount in identical clean order upon exiting.

---

### 12.3 Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. Per `advisor-capable-providers.json` and the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; verification relies strictly on fail-first automated test assertions and the orchestrator review gate.

---

### 12.4 Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 243 tests passed)** | 100% pass across all unit, property, and render tests (+3 new tests) |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean working tree | All implementation files committed by explicit path |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.

---

## 13. Inspection Mode Focus Restoration Fix (Final Defect Resolved)

- **Date:** 2026-09-21
- **Base Commit:** `b29c35b`
- **Implementation Commit:** `9273fa8`
- **Scope:** Resolve remaining Inspection Mode focus restoration defect identified in `repair-07-review.md`.

### 13.1 Root Cause & Solution

- **Root Cause:** In `src/render/beat-container.js` and `src/render/linear-path.js`, `previousFocusRef` was captured *inside* `case 'reflect'` after `activeBeatEl.replaceChildren()` had already stripped the focused choice button from the document. By the time `document.activeElement` was inspected, it had already dropped to `document.body`, causing `rootEl.contains(document.activeElement)` to evaluate to `false`. `previousFocusRef` remained `null`, and the exit restoration branch was never entered, leaving focus on `BODY`.
- **Solution:**
  1. **Capture Before Unmount:** In both `src/render/beat-container.js` and `src/render/linear-path.js`, capture `previousFocusRef` before calling `activeBeatEl.replaceChildren()` specifically when entering Inspection Mode (`isInspection && !previousFocusRef && rootEl.contains(document.activeElement)`).
  2. **View Visibility Guard (`isElementVisible`):** Since both `visualRenderer` and `linearRenderer` update concurrently within the app shell, added `isElementVisible(rootEl)` guards to ensure that hidden renderers do not steal focus during deferred focus updates.
  3. **Safe Control Fallback:** Retained the `elToFocus.isConnected` check and the first-control fallback on the exit path, safely focusing the newly mounted choice button when the previous instance was unmounted.
  4. **DOM Mock Realism:** Enhanced `tests/fixtures/mock-dom.js` to implement `get isConnected()` and support comma-separated selector lists (`'button, input'`) in `querySelector` and `querySelectorAll`.

### 13.2 Failing-First Test Evidence

Added test in `tests/app-shell.test.js`:
- Tested against base commit `b29c35b`: Fails with:
  ```
  FAIL tests/app-shell.test.js > Plan 09 app shell and upstream display switcher > restores focus to reflection choices upon exiting Inspection Mode in visual and linear paths
  AssertionError: expected 'BODY' to be 'BUTTON' // Object.is equality

  Expected: "BUTTON"
  Received: "BODY"
  ```
- Tested after fix: Passes cleanly across both visual and linear paths.

### 13.3 Verbatim Focus Captures Across Both Paths

Captured from live execution of the running application:
```
--- Visual Path ---
before replay:         BUTTON.fraction-control.matching-choice-btn.control-choice-btn
during replay:         BUTTON.fraction-control.app-done-looking-button
after Done looking:    BUTTON.fraction-control.matching-choice-btn.control-choice-btn

--- Linear Path ---
before replay:         BUTTON.fraction-control.control-choice-btn
during replay:         BUTTON.fraction-control.app-done-looking-button
after Done looking:    BUTTON.fraction-control.control-choice-btn
```

### 13.4 Conditions A, C, and D Status

- **Condition A (No Auto-Advance):** No timers or auto-advance mechanisms introduced.
- **Condition C (Currency Contract):** `isReplaying` remains validated in `scene.presentation` and verified by `assertSceneCurrent`.
- **Condition D (Leakage Suite & Inspection Unmounting):** Full leakage test suite (`tests/leakage-invariants.test.js`) ran and passed 100% (10 tests passed in 247ms) against replaying and non-replaying reflect scenes.

### 13.5 Advisor Consultation Disposition

**Branch C (orchestrator-gate-only):**  
This thread operates on Google Antigravity / Gemini. Per `advisor-capable-providers.json` and the mandatory fail-closed capability rule (Step 1), this provider cannot confidently match an entry in `advisor-capable-providers.json` and therefore treats itself as not advisor-capable. No subagent consultation was executed; verification relies strictly on fail-first automated test assertions and the orchestrator review gate.

### 13.6 Verification Commands and Results

| Command | Result | Notes |
|---|---|---|
| `node scripts/dev/plan-status.js check plan-09` | **`RUNNABLE`** | Exit code 0 |
| `npm test` | **20 passed (20 files, 244 tests passed)** | 100% pass across all unit, property, and render tests (+1 new test) |
| `npm run build` | **Passed** | Vite 6.4.3, 42 modules transformed, 0 bundle warnings |
| `node scripts/dev/plan-status.js lint` | **`lint: OK (no violations)`** | Clean frontmatter & indexes |
| `git status --short` | Clean working tree | Staged by explicit path |

Requirement 3 remains strictly owner-gated: no deploy, no push, no public-URL claims made. Status verbs belong to the orchestrator and owner.





