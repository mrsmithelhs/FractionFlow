# Plan 12 Progress Report

Date: 2026-09-30  
Starting revision: `c03ba5aa9e20b07f4e85d8acc2da604350b00cad`

## Summary

Implemented the owner-approved Requirement 0 proposal and Plan 12 entry/session behavior. The app opens on a restrained entry page with the FractionFlow title, the line “See how different-sized fraction parts fit together.”, one registry-driven practice button labeled “Add fractions with different denominators,” the reviewer gear, and a small “Created by an educator” credit. Only the practice type that currently runs is registered. The registry structure allows a future runnable practice type to be added by registration and content work; there are no disabled or promised future choices.

The page deliberately omits a catalogue, extra headings, metrics, counters, progress, saved preferences, accounts, and learner data. The reviewer menu remains reviewer-only, with condition and support-level controls, and exists only on the entry page.

## Route and state behavior

- The entry practice button begins the registered episode. A recognized practice fragment (for example `#sum-under-one`) launches that episode directly; an unrecognized fragment leaves the learner on the entry page without an error. Conditions and support configuration are not encoded in the fragment.
- The selected condition is passed into episode creation upstream, before rendering, and remains in the replay envelope. Route witnesses cover each registered condition with other conditions as negative controls, reviewer support configuration, direct recognized and unrecognized fragments, and fresh-state entry.
- “Return to entry” and “Try this problem again” are both reachable during the episode. Each discards the current episode and re-enters with fresh state. The route matrix compares their post-discard state rather than relying on a direct reset call.
- Browser focus contract: Begin and recognized-fragment launches put focus on the episode main region. Return puts focus on the entry title. The first Tab from the entry page reaches the practice button; normal Tab navigation can still reach the gear. This preserves keyboard access to reviewer settings.

## Inspection Mode focus repair

Both visual and linear paths now focus the first reflection choice control after “Done looking” remounts the reflection choices. The target is checked against the current episode subtree and visibility before focusing. It is not a restoration of a stale node, and it does not focus the choice-group container itself; the observed active element is the first choice control inside that group. A real browser click was used for both paths.

Observed `document.activeElement` values:

| Path | Before Replay | During Inspection Mode | After “Done looking” |
|---|---|---|---|
| Visual | `button.fraction-control.matching-choice-btn.control-choice-btn` | `button.fraction-control.app-done-looking-button` | `button.fraction-control.matching-choice-btn.control-choice-btn.inspection-focus-return-target` |
| Linear | `button.fraction-control.control-choice-btn` | `button.fraction-control.app-done-looking-button` | `button.fraction-control.control-choice-btn.inspection-focus-return-target` |

`ROUTE-FOCUS-INSPECTION-RESTORE` no longer has a `knownDefect` marker and now asserts restoration to the choice control. A second route witness covers the linear path.

## Rendered layout observations

Measurements are from a real browser viewport of 360×740 unless specified. These are implementation observations for owner review, not a declaration that the rendered-screen acceptance gate has passed.

| Surface | Before implementation | Current |
|---|---|---|
| Entry page | Not present | Document scroll height 740px; page box top 12px, bottom 728px, height 716px. Title bounds y=76–119, learner line y=129–171, practice button y=195–259 (64px high), gear y=12–56 (44px), credit y=678–728. No page overflow. |
| Episode | Baseline episode box y=20–720 (700px); document scroll height 817px | Episode box measured after episode focus at y=0–788 (788px); document scroll height 812px. The content is 48px taller than the viewport and the document is 72px taller. |

At 768×1024 and 1440×900 the measured episode document height matched the viewport (1024px and 900px respectively). The entry page also fit at 1440×900. The episode remains vertically scrollable at 360×740; that is a review item against DECISION-021 criteria 1 and 3, not a claim of acceptance.

The reviewer menu at 360×740 has bounds x=24–352 and y=64–526, height 462px, while the document remains 740px tall. It overlays the title, learner line, and part of the practice button while open; this is the popover footprint. The gear remains above it and reachable by keyboard. See the expanded-menu screenshot below for owner judgment.

Screenshots:

- [Entry page, 360px](screenshots/entry-360.png)
- [Entry page, 360px, reviewer menu open](screenshots/entry-360-gear-open.png)
- [Entry page, 1440px](screenshots/entry-1440.png)
- [Episode, 360px](screenshots/episode-360.png)
- [Episode, 1440px](screenshots/episode-1440.png)
- [Baseline episode, 360px](screenshots/episode-360-before.png)

## Interaction checks

- Keyboard-only browser journey: first Tab reached the practice button; Enter began and focused `MAIN.app-episode`; the episode was completed through keyboard navigation; Return to entry focused `H1.app-entry-title`.
- Touchscreen browser journey at 360px: tapped the practice button, tapped the episode Next control, and tapped Return to entry; all actions completed without dragging.
- Direct fragment launch: `#sum-under-one` opened the episode and focused `main.app-episode`. Unknown fragment `#not-a-real-practice` stayed on the entry page without an error.
- Gear/menu inspection: menu rendered on the entry page and is not mounted on the episode surface.

## Validation

- `npm test` — passed: 22 test files, 259 tests.
- `npm run build` — passed with Vite 6.4.3.
- `npm run test:routes` — passed: 28 route witnesses, 0 failures.
- `node scripts/dev/plan-status.js lint` — passed: no violations.
- `git diff --check` — passed.
- Browser route checks, real-click focus observations, keyboard-only and touchscreen journeys, and 360px layout measurements are described above.

## Problems and remaining risks

The 360px episode still requires vertical scrolling: its measured document exceeds the viewport by 72px. The expanded reviewer popover covers some entry content while open. Both states are captured for rendered-screen review. No math, content, or interaction-state modules were changed. No deployment or push was made.

The repository's advisor capability manifest was unavailable at `.codex/advisor-capable-providers.json`, so capability could not be confidently established. **Advisor disposition: degraded mode, orchestrator-gate-only (Branch C); no independent advisor consultation ran.**

## Review handoff

**Ready for orchestrator review: yes.** Source behavior, route assertions, required validation, browser observations, and screenshots are present. **Rendered-screen acceptance remains owner-gated** against DECISION-021 criteria 1 and 3; this report does not declare the entry or episode hierarchy accepted. Packet status remains `in-progress` and was not changed.
