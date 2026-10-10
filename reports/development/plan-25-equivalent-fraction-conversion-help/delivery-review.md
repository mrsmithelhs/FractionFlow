# Plan 25 delivery review — 2026-10-09

## Disposition

Accepted after the bounded focus repair in `24b2297`, reported in `ab7612e`.
The interaction mechanism, legacy compatibility, learner copy and repaired mounted
focus behavior satisfy the applicable delivery gates. The initial finding and its
independent reproduction are retained below; final repair evidence follows them.

Owner authority was checked directly in the implementer chat: the owner said
“I like the edit,” asked whether help was mandatory, received the correct optional-
help explanation, then authorized sending the report and closure if orchestration
agrees. This permits closure after technical repair; no additional owner decision
is needed for the focus correction. It does not authorize deployment or establish
physical-device, assistive-technology or learner-observation evidence.

## P2 — Opening requested help loses keyboard focus (repaired)

At `src/app/app.js:374–375`, opening transform help dispatches the scoped request
without focusing its remounted response. The render-token change removes the active
controls in both renderers; the Help button is reattached without restoring focus.
This contradicts the opening-focus contract in `progress.md`.

Independent headless Edge observations against the latest production build, with
360×740 viewport and actual keyboard Enter activation of Need help?, gave:

| Access path | Active element after opening | Active element after subsequent Tab |
|---|---|---|
| Visual | BODY | transform-help-multiplier-left |
| Linear | BODY | linear-transform-help-multiplier-left |

Repair the opening branch to focus the connected visible current transform response
after dispatch. Reopening requested/incorrect help should focus the multiplier;
reopening accepted help should focus the existing numerator. Keep entered drafts,
close-button focus and unrelated renders unchanged. Add failing-first mounted
keyboard/click evidence for both paths and reopening states, plus a focused shell
assertion. No new instructional mechanism, copy or mathematical rule is required.

## Verification completed

- Independently reran the current suite: 27 files / 311 tests passed.
- Independently rebuilt learner and subtraction-prototype outputs successfully.
- Exact pre-mutation oracle verifier passed all four revision-1/2 completion states
  at denominators 12/24 and all four revision-2 refusal/closure cases.
- Packet preflight reports RUNNABLE; packet lint passes.
- Read-only interaction audit checked revision-3 scoped assistance, legacy rejection
  of new intents, assistance provenance, stale-side separation, malformed values,
  main-response independence and dynamic arithmetic with a noncanonical fixture.
- Read-only app/render audit checked draft restoration, accepted-factor handoff,
  current-entry reset and parity, and identified the focus defect above.
- Personally inspected refreshed requested-help and incorrect-multiplier screenshots
  at 360×740. They show one associated helper question, supporting equation once,
  retained incorrect input and no main numerator field during the multiplier decision.
- Independently reran the full browser matrix against the final copy/accessibility
  build: 52/52 executions passed across 50 rows. Edge's sandboxed temporary-profile
  launch failed; the narrow elevated local-browser run succeeded. The existing
  matrix passing despite the observed focus defect demonstrates its missing assertion.

The interaction suite's literal serialized `16/24` absence checks are a weak proxy
for structured answer withholding. Current source inspection and rendered control
checks support withholding; the literal checks alone do not prove it. Zero,
noncanonical and stale-right-factor behavior were independently probed, rather
than claimed as committed regression coverage. These are nonblocking coverage limits.

## Limits

Browser observations use desktop Edge and emulated viewports; no physical Chromebook,
native mobile keyboard, assistive-technology or learning-efficacy claim follows.
The requested advisor model was not independently attested. Existing approved
accepted-factor copy remains; alternative subdivision copy is not a closure condition.
No source was edited by orchestration, and no push or deployment was performed.

## Repair re-review and closure — 2026-10-09

Reviewed the committed repair: only the transform-help opening branch adds a focus
handoff to the connected current response after dispatch. Close-button behavior,
copy, math, instructional state and unrelated renders remain unchanged. Existing
visual requested-help evidence is strengthened and a linear focus route is added.

- Independently reran the focused app-shell, task-help and route-contract suites:
  3 files / 48 tests passed against the repaired source.
- Independently exercised the repaired production build in real Edge with keyboard
  activation and clicks: 16 operand cases spanning both operands, targets 12/24,
  visual/linear views and standard/reduced motion. All 64 connected, visible,
  active-element assertions passed through opening, incorrect-state reopening,
  accepted-factor handoff and accepted-state reopening. Nonempty main and multiplier
  drafts survived the transitions; multiplier acceptance did not submit conversion.
- Independently completed two non-drag touch-context helper journeys, visual and
  linear, with reduced motion. Values were filled after tapping inputs; this does
  not establish native mobile-keyboard behavior or physical-device participation.
- Implementer's repaired full suite/build/lint/diff evidence passes; full browser
  matrix is 53/53 executions across 51 rows. Failing-first assertions rejected the
  old focus behavior in mounted and real-browser checks before the fix.
- Reviewed narrow requested/recovery screenshots and the 1280×800 requested screen
  for actual visible copy and placement. The focus-only repair did not change them.

No remaining blocking defect was found. Owner acceptance and conditional closure
authority were independently verified from the direct human turns described above.
Plan 25 may be marked complete with its written resolution. This accepts the bounded
optional-help delivery, not alternative subdivision wording, new content, efficacy,
physical-device/AT claims or publication. The existing coverage limits remain recorded.
