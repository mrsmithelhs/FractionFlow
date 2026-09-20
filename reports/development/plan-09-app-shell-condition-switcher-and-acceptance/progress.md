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
