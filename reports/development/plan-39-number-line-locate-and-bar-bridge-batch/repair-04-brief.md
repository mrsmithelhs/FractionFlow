# Plan 39 Repair 04 — starting tray, accepted result and direct progression

Date: 2026-10-23. Owner-approved design, prepared for implementation handoff.
This turn authorizes writing this brief, not launching source work or another
chat. Plan 39 stays delivered and unaccepted. Before execution, orchestration
must authorize the bounded repair and resolve its status/preflight window.
The implementer then investigates and proposes the mechanism before source work.
Owner rendered-page/agency acceptance and deployment remain separate gates.

## Evidence and adopted decisions

Owner's local use showed three problems: the unplaced tile sits centrally above
the line and can look already correct; the accepted fraction is cramped above
the bar's left edge; and Finish merely removes itself and exposes Next problem.
Owner selected result-header option 1 and a distinct starting tray. They also
requested a light green accepted presentation without an individual fraction
border, and a light gray hover affordance on the draggable tile.

Current source corroborates these seams: src/render/number-line-locate.js creates
the token and resolve controls; src/app/app.js gates next-item navigation on
resolved status; src/app/styles.css owns the Plan39 layout. The fixed-height overflow was separately
repaired in 27c2eaf, with verification in token-containment-review.md. Preserve it.
Starting baseline for this brief is 5f92b06; recheck HEAD and concurrent ownership
at dispatch. Do not treat earlier full-run counts as current proof after changes.

## Required learner behavior

1. **Distinct starting area.** Put the instruction on the left and a compact
   starting tray on the right of the introductory row at wider widths. The tray
   has a pale yellow background, a subtle dashed border, rounded corners and
   enough internal padding to contain the white fraction tile and grabbing cue.
   Keep it outside and clearly separated from the number-line coordinate region:
   no apparent initial placement, target marker or implied answer at one half.
   At narrow widths, wrap the tray below the instruction, aligned toward the
   right, with clear separation from the line. Start without another label or
   paragraph. Once moved, do not leave a duplicate draggable fraction in the tray.
   Preserve prior-placement restoration on an invalid/canceled drop; this does
   not introduce a new drag-back-to-tray reset interaction.
2. **Draggable affordance.** The unplaced or pending placed tile is opaque white,
   with its existing rounded border. On a device with real hover capability, use
   a light gray hover background plus the grab cursor; retain grabbing feedback
   during drag. Avoid a sticky hover state on touch. Preserve a clear visible
   keyboard focus treatment wherever the tile/control is actually focusable;
   do not add a meaningless tab stop or make hover necessary to use the task.
   Keep the existing non-drag controls, cue lifecycle and reduced-motion behavior.
   The tile sizes to its content and remains above line paint; do not restore
   fixed dimensions that spill or clip fraction text.
3. **Accepted result header.** After a correct Check, show "That's right." on
   the left and the stacked fraction on the right of one generously padded,
   light green result-header region. Match the starting tray's corner treatment,
   fraction typography and visual rhythm. Remove the individual border/tile
   treatment around this accepted fraction: it is a read-only amount, without
   grab, hover, focus or dragging affordances. The header itself may use a soft
   background without a dashed starting-area outline. Green denotes acceptance,
   never an unsubmitted placement. Retain explicit textual success so color is
   not the sole signal. Wrap cleanly at narrow widths without squeezing the type.
4. **Separated, aligned graphics.** Below that header, give the bar and number
   line distinct vertical space; begin with about 20–24 CSS pixels of clear space
   between the bar's lower edge and the axis, then verify rendered readability.
   Preserve the same horizontal zero and one coordinates and the connector from
   the shaded endpoint to the accepted point. Do not shorten one representation
   independently or add heavy separate cards, repeated labels or captions.
   Retain the existing useful unit-relationship explanation, without adding a
   new paragraph merely to justify progression.
5. **One useful progression action.** Replace Finish with Next problem below
   the accepted explanation. One activation opens the next registered item in
   fresh initial state; it must not merely expose another button or move the
   continuation action into the upper-right navigation. Keep the accepted result
   inspectable until activation, with no timer. Only one visible Next problem
   action is needed for this task. On the final item retain truthful existing
   exhaustion behavior and a meaningful return action; propose the exact final
   state at the mechanism gate. Do not offer a nonexistent next item or invent
   an extra summary/Finish set screen. Preserve equivalent linear-path access,
   announcement of acceptance, and deliberate focus at the new task on advance.

## Requirement 0 — mechanism and compatibility stop

Read the packet, this brief, token-containment-review.md, the Repair03 review,
and current relevant source/tests. Propose the smallest ownership/layout changes,
responsive behavior and completion-to-advance transaction, then stop for
orchestrator approval. In particular:

- Explain which state/intent records completion, when it occurs, and how Next
  advances exactly once. Do not auto-dispatch the old Finish action from render
  or a timer just to unlock app navigation. Mathematical/instructional truth
  remains upstream; renderers do not decide success or advance registered items.
- Preserve historical definition/replay semantics, including revision1/v7 and
  revision2/v8. Determine whether this change needs the next sequential current
  definition/replay revision; justify it rather than assuming either outcome.
  No relabeling old envelopes or silently editing their expected behavior.
- Identify historical versus current route contexts. Preserve historical action
  objects/mappings and evidence; add/version current witnesses as needed when
  their old Finish action no longer describes current behavior. Do not weaken
  tests or preserve a hidden Finish control to make old selectors pass.
- Bound scope to this number-line task. No new content batch, representations,
  performance adaptation, framework, dependencies or unrelated navigation changes.

## Acceptance evidence and execution limits

Show initial, pending placement, accepted result and next-item states at 360x740,
360x752, 1366x768, and 1093x614 at actual DPR1.25. Verify fraction containment,
normal and enlarged type, tray/line separation, matched endpoints/connector, and
question/active-control visibility at a common documented viewport position.
Retain high/less-support paths, keyboard/non-drag operation, browser touch,
reduced motion, grip preservation, live ring/drop agreement, cancellation,
wide-window resizing, help, view switching, retry, return and last-item behavior.
Assert the accepted explanation is visible before Next and that one real Next
activation advances one item with fresh state and deliberate focus. Wrong Check
must not show green acceptance, answer bar or an enabled continuation action.

Use a small number of targeted negative controls for the new contracts: old tile
overflow, an unplaced tile effectively sitting at a line target, and a Next
action that only exposes another Next/Finish step should be rejected by ordinary
assertions. Retain applicable existing seeds without rerunning unchanged broad
suites at every draft. Finish with appropriate unit tests, sequential build,
final clean matrix, packet lint and diff check; distinguish seeded runs from the
clean receipt. Isolate new evidence and restore regenerated historical artifacts.

Recommended execution remains one Luna-medium default-role implementation writer,
with no implementation-child fan-out, no Astra and no model substitution. Use one
consolidated Sol read-only LOW review; a second only for a substantial unresolved
issue. Routine repair verification stays with orchestration. A bounded Luna
screenshot-driven walkthrough may be authorized at dispatch; read the existing
walkthrough workflow and pilot log first, and persist capability failures as well
as successes. An independent implementer-chat pilot needs a separate explicit
launch and child-delegation authorization; this brief does not create that chat.

Commit scoped source/evidence, then repair-04-progress.md last. Report actual
objective coverage, limitations and advisor disposition. Never change packet
status, owner acceptance or deployment records as an implementer; never push.
