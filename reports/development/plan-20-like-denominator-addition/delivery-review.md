# Plan 20 delivery review and Repair 01

Date: 2026-10-15. Candidate: implementation `20d190e`, correction `b25e481`,
report `8b782ba`. Disposition: delivered; bounded repair required before technical
acceptance. Owner rendered/agency acceptance remains separate.

## Findings

1. **Operation-help exposure is absent from instructional history.** In
   `src/app/app.js`, the Plan 20 operate Help branch toggles `activityNotice` and
   rerenders without dispatching an intent. Thus opening the guidance cannot
   add help/support history or replay intents. Response provenance cannot
   distinguish this assistance from an otherwise identical unassisted response.
   This is a product defect against truthful actual-work/assistance provenance.
2. **Some capture claims exceed the actions observed.** The evidence capture
   explicitly calls `element.focus()` on `.app-episode` after Finish before
   asserting its focus. Its keyboard correction uses locator-targeted presses
   that can focus the target automatically, and Finish is clicked. These do not
   establish the claimed keyboard completion. The route matrix has a separate
   unforced Finish focus assertion; that useful evidence does not make the
   capture's forced assertion valid.
3. **The required failing-first absence witness is missing.** The packet requires
   a stale conversion or unlike-denominator recovery-text seed that the browser
   witness rejects. The delivered capture/verifier contains no such seeded run.
   Its text scan also excludes hidden content and does not establish withholding
   across all mounted textual/accessibility surfaces. Recorded rectangles and
   horizontal-overflow checks alone do not establish narrow-screen vertical
   reachability of questions and response controls.

The existing matrix already covers return/re-entry, and its linear route enters
canonical `5/7`; do not duplicate these solely to increase counts. Equivalent
`10/14` is a legitimate correction of `5/14` and must remain accepted.

## Authorized bounded Repair 01

- Record requested local arithmetic help through instructional intents/history,
  with replay reconstruction and subsequent response provenance. Closing help
  must not erase exposure; repeated requests must not invoke unrelated global
  escalation. Preserve entered drafts, task position, and current concise copy.
  Reset/retry must clear episode assistance truthfully. Add focused behavioral
  regression coverage for assisted versus unassisted submissions and replay.
- Remove capture-side focus repair. Observe actual focus after Finish. Capture
  a real keyboard correction and completion using page keyboard actions from
  observed focus, with assertions before activation; no locator focus shortcuts
  within the claimed keyboard segment. Tap numeric fields before tool-assisted
  touch-context text entry and keep physical-device typing explicitly untested.
- Add the packet-required independent stale-content/recovery failure seeds;
  demonstrate rejection at the intended assertion and a clean restored run.
  Check relevant mounted text, hidden text and accessible answer surfaces without
  mistaking structural grid metadata for learner answers. Keep seeds transient.
- Measure and assert question/control reachability through ordinary scrolling
  at both prescribed viewports, including recovery/help/completion. Full-page
  screenshots are supporting evidence, not proof that controls fit the viewport.
  Refresh affected screenshots/measurements and correct participation claims.

Repair scope is existing approved Plan 20 source paths plus focused tests and
its evidence scripts/artifacts. A narrowly scoped interaction help/provenance
change is authorized; no new help workflow or general support framework.
Preserve old routes, identities, exact arithmetic, current task grammar and all
unlike-denominator behavior. Do not weaken tests/runner. Report a scope-expanding
mechanism before edits. Plan 20 remains delivered; this explicit repair authority
applies despite the status preflight block. Implementer never changes status.

Run focused regressions, full tests/build/routes, failure seeds and clean evidence,
packet lint and diff check. Only Sol-class read-only advisors at low/medium effort
are allowed; no Astra or forced-high roles. If unavailable, use orchestrator-gate-
only review and record the limitation. Commit scoped repair, then progress report
last. No push/deployment. Return for technical re-review and owner acceptance.

## Evidence and limits of this review

Root inspected scoped source, routes, capture/verifier and sample entry/recovery
screenshots. Four focused test files passed (44 tests), and the delivered saved-
artifact verifier passed during review. These results do not cure the findings
above. A read-only source reviewer requested with Sol-class medium settings
identified the assistance-history defect; root independently checked the actual
app branch and interaction intent handling. No fresh browser run or physical
device/assistive-technology verification is claimed by this review. The broad
357-test/59-execution results remain implementer-reported delivery evidence.

## Repair 01 technical re-review

Date: 2026-10-15. Candidate repair `37fd528`, report `27cd929`.
Disposition: technically accepted; owner rendered-screen/agency acceptance pending.
Plan 20 remains delivered. Repair authority was the orchestrator's explicit bounded
instruction under the owner's existing supervision authorization; no new packet
start or status change was authorized by the implementer.

Root inspected all four source/test diffs and the revised capture/verifier. Local
operate help now dispatches the existing task-help intent under exact Plan 20
eligibility, records exposure in support history, projects the proper task-help
kind and preserves it in subsequent response provenance/replay. Closing the cue
does not remove exposure; reopening is idempotent. Reset clears history and stale
mounted support copy. The regression tests exercise assisted versus unassisted
responses, actual mounted controls, draft retention and replay reconstruction.

Root independently ran four focused files: 46 tests passed. Root then copied the
committed capture and verifier into ignored `dist/plan20-root-review/evidence/`,
adjusting only the capture's relative script import for that output depth. The
fresh Chrome browser run captured 12 workflow states, both entry layouts and
fragment launch; the verifier passed on those freshly generated artifacts.
The run rejected each of the three independent content/accessibility seeds and
passed after restoration. Actual page keyboard correction/completion, unforced
Finish focus, tapped-field touch-context entry and ordinary-scroll reachability
passed. Root inspected fresh visual help and linear accepted-response screenshots.
No route matrix changes were made by this repair (diff against `b25e481` empty).
Packet lint and diff check passed; the tracked tree was clean before this note.

The implementer reports full 359-test/build/59-route success through explicit
Chrome after an Edge startup failure. Root did not rerun those full suites;
the independent fresh browser capture and targeted tests above are the root's
verification boundary. Physical-device typing, assistive technology, classroom
readiness and learning outcomes remain unverified. Owner acceptance is the next
gate; no completion, push, deployment or Plan 34 source initiation follows from
technical acceptance alone.
