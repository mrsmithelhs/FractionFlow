# Plan 09 — Deployed Public Exercise Record

- **Date:** 2026-09-21
- **Public URL:** https://mrsmithelhs.github.io/FractionFlow/
- **Deployed revision:** `b418e8a`
- **Workflow run:** 35598507910 (succeeded)
- **Authorization:** owner pushed `main` and reported the deploy; this record documents it.

## Revision confirmation

`main` and `origin/main` are in sync at `b418e8a`. The deployed page loads
`assets/index-DeRLIr4n.js`, which is the same content hash produced by the local `npm run build` at
that revision. The deployed bundle is the reviewed one — not inferred from the run log.

## Exercised at the public URL

### By the owner, on their device

- **Browsers:** Chrome at 1080p (full episode); Edge and Firefox at varying viewport widths (basic
  path).
- **Complete episode:** encounter through resolve, including the selective reflect.
- **Error and recovery:** an incorrect number of parts when renaming `2/3`; useful recovery message
  returned, problem not reset.
- **Alternate valid path:** the twenty-fourths route — `16/24 + 6/24 = 22/24`, acknowledged as
  "22/24 is correct! It can also be written as 11/12."
- **All four gear-menu conditions** exercised; each produced a different, useful step configuration.

### By the orchestrator, against the same deployed URL

Driven in the built-in browser to close the two Requirement 3 coverage items the owner's pass did not
name.

- **Help request**, two beats, hint rather than answer — agency preserved:

  | beat | help text added |
  |---|---|
  | decide | "Look at the parts in each bar. What do you notice?" |
  | transform | "Think about one whole and the size of each part." |

- **Replay under *New parts only*** at `transform-right`:

  ```
  resting:  8 12 | 1 4 | 8 12 + 1 4 | Rename the second fraction with 12 equal parts...
  replay:   Starting parts: 2/3 | Show new parts | 2 3 | 1 4 | 8 12 + 1 4 | ...
  ```

  The before state is reachable only this way in this condition.

- **Inspection Mode focus restore**, with `document.hidden` forced to `true` — the condition that the
  pre-`b418e8a` guard failed:

  ```
  before replay:        BUTTON.control-choice-btn
  during replay:        BUTTON.app-done-looking-button
  after "Done looking": BUTTON.control-choice-btn
  ```

## Not covered

- **The reduced-motion path at the public URL.** `matchMedia('(prefers-reduced-motion: reduce)')`
  reported `false` in every session driven here, and neither the browser pane nor the owner's pass set
  the OS preference. The reduced-motion presentation was verified locally at `b90084b` — the replay
  acknowledgement is static styling plus a text change, with no dependence on the suppressed pulse —
  but that is a local verification, not a deployed exercise. It is the one named Requirement 3
  coverage item outstanding.
- **Screen readers.** No assistive technology was run against the deployed slice. Semantics were
  inspected; announcement behavior in a real screen reader is untested.
- **Touch hardware.** Non-drag touch parity was verified structurally and by emulation, not on a
  physical touch device.
- **Browsers beyond Chrome, Edge, and Firefox on one Windows laptop.** Safari on macOS and
  iOS/iPadOS, named in the supported-environment matrix, is untested. Chromebook hardware is untested.
- **n = 1 adult, 0 children.**

## Standing

This record is evidence, not acceptance. The §25 criterion-by-criterion packet, the DECISION-021
rubric against rendered screens, and the dated owner disposition remain, and are listed in
`owner-gate-checklist.md`.
