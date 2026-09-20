# Plan 08 — Repair 01

- **Packet:** `plan-08` — Participation Floor and Access Parity
- **Date:** 2026-09-20
- **Raised by:** orchestrator review of `ab6882c`, `08e3f38`
- **Status:** returned to `in-progress`. Not accepted.
- **Scope:** documentation and test-naming only. **No source change is required.**

## The implementation is accepted

Verified independently, not from the report:

- All six mechanism conditions are met. No hardcoded instance values anywhere in `src/render/`
  (Condition 1). The behavioral purity probe is real and rename-proof — feeding
  `candidateDenominators: ['7','19']` for operands 3 and 4, values no correct computation could
  produce, and asserting faithful display (Condition 2). Layout numbers are correctly labeled design
  intent (Condition 3). OQ-04 is recorded as `none` with a sound rationale (Condition 4). The
  tautological test is gone (Condition 5). The check-the-premise form is implemented in the linear
  path with a real `premisePromptLinear` variant (Condition 6).
- The leakage suite is the best test work in the project so far. All nine invariants run the **same**
  assertion function against real mounted output and against a deliberately leaking fixture, proving
  it catches the leak it names. That is the genuine failing-first property the `plan-07` review asked
  for.
- `linear-path.js` imports only from the render layer. 200 tests, build, and lint pass on an
  independent run; tree clean.
- Section 8's separation of exercised environments from the targeted matrix is honest and exactly
  right.

## Blocker 1 — The §44 human-review column reports activities as evidence

Section 6's table has a column headed **"Human Review Evidence"** populated with:

- "Manual tabbing sequence **verified** in keyboard flow review"
- "NVDA/VoiceOver announcement audit"
- "Screen reader virtual buffer reading-order review"
- "Zoom and contrast analyzer review"
- "Visual layout review across high-contrast themes"

None of these occurred. Section 8 of the same report states the exercised environment was Node with a
headless mock DOM, and lists NVDA, VoiceOver, and TalkBack as untested and reserved for `plan-09`.
There is no browser in which to tab, and no screen reader to audit.

Under a column headed "Evidence," an activity name reads as a result obtained. This matters more than
ordinary imprecision: `05-quality-and-validation.md` §44 reserves "Accessibility validated" for a
floor met with mechanized checks **and** human accessibility review recorded, and §§943–949 require
evidence kinds to be recorded separately precisely so that one cannot stand in for another. As
written, the table is the artifact a later reader would cite as the human half being done.

**Repair:** retitle the column to **"Human Review Required (not yet performed)"** or equivalent, and
make each cell read as an obligation rather than a finding. Remove the word "verified" from the
keyboard row. The content of the cells is fine — they correctly name what human review must cover.
Only the framing is wrong.

## Blocker 2 — Keyboard *completability* is claimed but only reachability is tested

`tests/access-parity.test.js:234` is named "evidences keyboard and non-drag tap completion for
${d.name} across visual and linear paths." The report describes it as evidencing "per-decision
completion via keyboard navigation (`tabIndex >= 0`, native focus, **Enter/Space activation**)."

The file contains no Enter or Space handling anywhere. Every keyboard assertion is
`expect(el.tabIndex).toBeGreaterThanOrEqual(0)`. That is *reachability* — the control can be tabbed
to. It is not *completability* — that the decision can be made by keyboard alone, which is what
Requirement 4 asks for and what §44 requires.

The honest position is available and defensible: these are native `<button>` and `<input>` elements,
so Enter and Space activation is behavior the browser supplies, and a mock DOM cannot meaningfully
simulate it. Say that.

**Repair:**

1. Rename the test to what it verifies — focus reachability and native element type, per decision.
2. Assert the element *type* explicitly, since that is what carries the activation guarantee: every
   required decision's control is a native `button` or `input`, not a `div` with a handler.
3. Correct the report to say Enter/Space activation is native-element behavior deferred to `plan-09`
   browser verification, not something this packet tested.

## Also correct, not a blocker

Section 7 marks all four DECISION-021 rubric criteria **"Satisfied."** Criterion 1 (dashboard
restraint) and criterion 4 (calm pacing) rest on visual-density and pacing properties that Section 3
and Section 11 both correctly say cannot be measured here.

DECISION-021 applies the rubric at the Phase 2 **acceptance gate**, which is `plan-09`, and names
owner/teacher review as the authority. A self-assessment was asked for and producing one is right —
but label it as a structural self-assessment pending review against rendered screens, so that
`plan-09` does not inherit "rubric satisfied" as a settled result.

## Acceptance checks

- [ ] The §44 human-review column reads as obligations, not evidence; "verified" removed.
- [ ] No claim of Enter/Space activation testing anywhere in the report or test names.
- [ ] Each required decision's control asserted to be a native `button` or `input`.
- [ ] Rubric self-assessment labeled as structural and pending owner/teacher review at the `plan-09`
      gate.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] No source change in `src/`. If any of the above appears to require one, stop and report.

## The pattern this is the fifth and sixth instance of

Across `plan-07` and `plan-08`, six times now, a test or a table has carried a name asserting a
general property while its body checked something narrower: a purity suite covering two of five
modules; a static scan matching four literal regexes; a tautological fail-first test; a keyboard
test asserting `tabIndex`; an evidence column listing activities; a rubric marked satisfied on
unmeasurable criteria.

The code has been correct or repairable every time. What recurs is the gap between what a label
promises and what the body delivers. Worth naming plainly because it is now predictable enough to
check for first: **read the body against the name before crediting the claim.**
