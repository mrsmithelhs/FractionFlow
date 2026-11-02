# Plan 52 surface and announcement proposal

Date: 2026-11-01. **Proposed; awaiting orchestrator approval before source changes.**
Inventory is source inspection, not a new rendered or assistive-technology observation.
Plan50 and Plan51 owner acceptance are the success baseline; the earlier audit is
bounded evidence, not authorization for an indiscriminate copy rewrite.

## Exact surface matrix

| Surface and outcome | Current source | Proposed bounded result / preserved content |
|---|---|---|
| Arithmetic, visual and linear success (`beat-container.js:385, 780`; `linear-path.js:514, 910`) | Resolve headings vary by result, equivalence, or premise; sometimes a real reflection is still active. | Where an instruction is genuinely complete, use one compact green “That's right.” acknowledgment. Keep raw/simplified equivalence, result/amount and premise explanation as separate mathematical content where present; retain an active reflection prompt and its controls. Do not add an acknowledgment to each intermediate beat. If an individual heading cannot be separated without altering instructional state or duplicating math, leave it and raise it at review. |
| Arithmetic retry (`beat-container.js:415`; `linear-path.js:550`) | Pale red `recovery-feedback`, `role=alert`; classification-specific messages. | Retain specific existing messages and their local placement; use shared subdued retry styling. Preserve one-sided denominator explanation, amount-preservation, arithmetic, reflection and subtraction guidance. No generic replacement. |
| Arithmetic incomplete/helper (`beat-container.js:689`; `linear-path.js:795`) | Empty multiplier “Enter a whole number to keep going.” is styled as red error; wrong multiplier has a specific red error. | Empty stays that wording, with neutral guidance; wrong multiplier retains its existing specific wording and retry treatment. Optional help and accepted multiplier cue stay local and neutral/accent-soft. |
| Arithmetic valid but unavailable (`beat-container.js:440`; `linear-path.js:575`) | Correct common denominator receives truthful limitation text in the same red recovery panel. | Preserve “is a valid common denominator, but this practice cannot use it. Try another number.” exactly, with neutral attention, not incorrect styling. Preserve existing input association and focus behavior. |
| Unary number line (`number-line-locate.js:737, 793, 900`; `strings.js:80`) | Current accepted repair uses “That's right.” green; earlier route has “The same amount is on the number line.”; location-specific alert retry, neutral help. | Keep accepted treatment and accepted bar/point/description. Where the earlier completed prompt is still used, align its acknowledgment only if math description remains independently present. Keep each location-specific retry and help wording; apply retry styling to evaluation, not help. No added incomplete verdict for an unselected preview. |
| Symbolic comparison and Plan49 helper (`plan45-comparison.js:145, 199, 241, 313`) | Plain “That's right.” heading with verified expression/models; amber status retry; no selection returns focus to first radio; helper has specific errors and truthful >144 limitation. | Give existing success heading the compact green treatment; retain expression, paired models and direct progression. Apply shared retry treatment to existing relation/helper incorrect messages; neutral attention for valid-but-unavailable helper and dependent-work-cleared notice. Keep helper accepted forms, specific explanations and selection behavior; no new incomplete message. |
| Collection (`number-line-collection.js:20–50, 83`) | Accepted green “All placed correctly.”; incomplete “Place the unplaced fractions before checking.”; incorrect “Check the marked placements. You can move any fraction.”; per-member details. | Success unchanged. Neutral incomplete; shared retry for incorrect summary only, preserving all per-member correct/unplaced/check details and `aria-describedby`. Keep placement-changed text and optional placement help; no new copy or grading. |
| Distance comparison (`plan51-distance.js:49–104`) | Accepted green “That's right.”, accepted relation/distance, source-unit verification/models; feedback/refusal status associated with response fields. | Success and mathematical verification unchanged. Style existing incorrect feedback as retry and refusal/incomplete guidance neutral when distinguishable from existing presentation inputs; preserve exact copy and associations. If current presentation data cannot distinguish these without new classification/state, leave styling unchanged and report rather than infer. Optional model help remains neutral. |
| Navigation refusal (`app/app.js:674, 993`) | Focusable status near navigation reports failure. | Preserve truthful message and placement; neutral attention if a demonstrated style mismatch exists. Do not represent navigation failure as incorrect mathematics. |

## Proposed shared contract and exact scope

Success uses the already accepted `#f1faf4` background, `#b8d3c3` border,
dark text, 0.75rem × 1rem padding, 0.5rem radius and 1.15rem/600 emphasis
(`app/styles.css:297,1036`). One short acknowledgment; do not duplicate it in
a second heading/status. Retry uses the existing subdued `#fef2f2` / `#fecaca` /
`#991b1b` palette and existing compact `render.css` spacing, consistently applied
only to incorrect outcomes. Incomplete and truthful unavailable/navigation
attention use a neutral surface and readable text; optional help retains its
existing neutral/accent-soft presentation. Text conveys the outcome without color.
No blanket rewrite of `strings.js` is proposed; only the completed unary prompt
or arithmetic acknowledgment wording above may need copy changes, preserving
explanations as content.

Proposed source scope is feedback branches in `src/render/beat-container.js`,
`linear-path.js`, `number-line-locate.js`, `plan45-comparison.js`,
`number-line-collection.js`, `plan51-distance.js`, `src/render/strings.js` only
if needed, `src/styles/render.css`, `src/app/styles.css`, and only local navigation
or outcome announcement wiring in `src/app/app.js` if inspection shows it is
necessary. Use small shared classes rather than a generic renderer. Existing
episode data and classifications are inputs, never changed. The actual diff may
be smaller. No prototype subtraction-page migration or global focus redesign.

## Focus, announcements and verification

Preserve the current connected target, visible outline and input descriptions for
each route. One deliberate outcome announcement path: collection Check already
focuses its feedback; propose removing its `role=status` for checked incomplete
and incorrect outcomes as well as accepted, while retaining a polite status for
the separate placement-changed update that does not focus feedback. Keep the
member-list live behavior and associations, checking that it does not repeat the
summary. Navigation refusal already focuses its notice: remove its live role only
if every path that updates it is verified to focus it; otherwise preserve the
existing mechanism and report the exception. For Plan39/45/51 and arithmetic,
retain existing local focus and `alert`/`status` and field associations initially;
inspect each changed outcome for duplicated text or an identical focused/live
target and make only a narrowly justified local adjustment. In particular Plan51
success focuses Next, not a duplicate success live region; its field-associated
retry/refusal must remain discoverable. No claim of actual screen-reader speech
without observing it.

After approval, use existing journeys to sample applicable success, wrong and
incomplete states, help/unavailable and navigation, visual and linear paths at
360px and Chromebook width. Check retained math and active tasks, one visible
acknowledgment, direct progression, connected focus/associations, visible focus,
and horizontal overflow. Run focused tests, then proportionate suite/build and
browser checks for the actual shared diff; record source assertions versus browser
observations and AT/physical-device limits separately. Stop for source concurrency,
contract drift or a required state change. A single cold default-role Terra-medium
read-only review is available only if substantial and justified under the current
policy; no Sol/Astra, substitution or fan-out. Owner rendered acceptance is separate.

Preflight: `node scripts/dev/plan-status.js check 52` returned RUNNABLE. At start,
three untracked Plan39 repair03 route receipts were present and are unrelated; leave
them untouched. No source changes have been made. Proposal checkpoint only; not
ready for implementation until orchestration approves the exact contract.
