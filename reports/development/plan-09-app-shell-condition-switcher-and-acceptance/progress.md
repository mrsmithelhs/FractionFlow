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
