# Session Handoff — Orchestration State

Living pointer document (see `docs/agent-starting-prompts/orchestrator-prompt.md` § "Session Handoff File").
Orchestrator-owned; update in place before thread boundaries. Anchor dates, never countdowns.
First revision: 2026-09-18. Rewritten 2026-09-19 when the specification phase closed — the prior
revision was organized around an open specification phase and patching it would have misled.

## Live State (as of 2026-09-19)

Authoritative packet status is `node scripts/dev/plan-status.js list` and the generated index in
`docs/development/README.md` — trust those over this file.

- `plan-01` (toolchain/deployment spike): **complete**. Live HTTPS smoke page verified 2026-09-18.
  `DECISION-001` records the deployment mechanism. The remaining owner gate is publish only.
- `plan-02` (exact-arithmetic core): **complete**. Exact BigInt primitives, classifications,
  validators, response patterns, golden fixtures, two bounded repairs.
- `plan-03` (content contracts and deterministic generation): **complete**. Immutable problem
  instances, eight structural selectors, overlays, provenance, deterministic selection, bulk audit.
- `plan-04` (first-slice design dossier): **complete**, owner-accepted 2026-09-19.
- `plan-05` (instructional engine plus representation eligibility): **complete**, accepted on
  2026-09-19 after a bounded replay-definition repair. Registered immutable definition identities,
  including the selective-reflection variant, now reconstruct exactly through a JSON replay envelope.
- `plan-06` (Scene Model projection): **complete**, accepted on 2026-09-19 after a bounded
  scene-admission repair. The renderer-facing guard now admits only a complete canonical payload
  matching a fresh projection of current inputs and returns that fresh frozen projection.
- `plan-07` (renderer foundation and learner-facing strings): **complete**, accepted 2026-09-20
  after Repair 01. The render layer had been deriving candidate common denominators by arithmetic and
  duplicating the DECISION-011 ceiling; candidates now come from `candidateDenominatorsForInstance`
  in `src/content/eligibility.js`, projected into `scene.meaning.unitRelationship.candidateDenominators`
  and gated on both the `decide` beat and `support.dimensions.commonDenominator === high support`.
  Two test-quality findings were carried into `plan-08`; see
  `reports/development/plan-07-renderer-foundation/final-review.md`.
- `plan-08` (participation floor and access parity): **complete**, accepted 2026-09-20 after a
  documentation-only Repair 01. Delivered the accessible linear path on the `plan-07` boundary
  without renegotiating it, nine fail-first leakage invariants across both paths, focus-reachability
  and native-element access parity, and the completed-beat collapse rule. See
  `reports/development/plan-08-participation-floor-and-access-parity/final-review.md`.
- `plan-09` (app shell, condition switcher, deployed acceptance): **draft**. The last packet of the
  Phase 2 wave and the one carrying the owner gate.

## The Specification Phase Closed on 2026-09-19

A design-review session ran Batches A–D plus a correction batch and produced DECISION-007 through
DECISION-024. `DECISION-024` declares Phase 2 design and specification complete; the "Live for
Phase 2" section of `docs/open-questions.md` is verified empty of open blockers.

The decisions that most change how earlier artifacts must be read — a fresh thread should treat
these as foreground, not background:

- **DECISION-005** (`docs/evidence-posture.md`) — efficacy research is a sidequest. The evidence
  ladder is small-n and unrandomized, so the `plan-04` prototype-variable register is a
  **disqualification** instrument, never a selection one. Any thread reading that register as a plan
  to *select* a winner is reading it wrong.
- **DECISION-007 + 012 + 026** — Bundle 1 is the provisional shipped condition, chosen on design
  grounds because no study is coming. DECISION-007's CM-01 text is superseded: the check is a
  matching task with distractors whose expected answer is not always the reassuring one. Cite 012 and
  026 alongside 007, never 007 alone.
- **DECISION-003 + 004** (`docs/presentation-posture.md`) — accessibility posture, the learner-facing
  register rules, and a grade 2–3 reading target enforced by working rules rather than a formula.
- **DECISION-025** — fraction-bar segments are not interactive targets; control size is decoupled
  from denominator.
- **DECISION-019** — the gear menu holds the condition switcher only; Phase 2 ships no learner
  preference surface and stores nothing in the browser.

Full reconciliation, including the six findings and their dispositions:
`reports/orchestration/phase-2-specification-reconciliation.md`.

## The Packet Wave (draft, reviewed)

Sequenced along the pipeline so no packet is built against a stub — the project's named implementer
failure mode:

| Packet | Layer | Gate |
| --- | --- | --- |
| `plan-05` | `src/interaction/` engine **+ the `src/content/` eligibility evaluator**, no DOM | mechanism confirmation |
| `plan-06` | scene projection, no DOM | mechanism confirmation |
| `plan-07` | `src/render/` foundation, strings, bar and symbolic | three-path mechanism confirmation |
| `plan-08` | linear path, leakage invariants, parity, collapse rule, floor evidence | mechanism confirmation |
| `plan-09` | `src/app/` shell, switcher, deployed acceptance | owner gate |

Two things the review changed, and why they matter more than they look:

- **Eligibility moved into `plan-05`.** The first draft had `plan-05` instantiating episodes against
  a verdict `plan-06` would not create until later — a stub dependency, and precisely the failure the
  wave's ordering exists to prevent. OQ-02 places eligibility *before episode instantiation*, so the
  evaluator is now `plan-05`'s one deliberate cross-layer file ownership. `plan-06` consumes the
  verdict and enforces fail-closed behavior on it.
- **The renderer packet split in two.** Its internal milestone became a real packet boundary, placed
  between "the visible renderer looks plausible" (`plan-07`) and "the access model actually preserves
  agency" (`plan-08`). Reviewing those together would have put the orchestrator's judgment *after* the
  shared DOM architecture was committed, so a leakage or parity defect found later would force a
  retrofit of already-accepted work. `plan-07`'s mechanism gate must now specify the boundary against
  **all three** access paths, so the linear path is never left to join a two-path design.

`plan-08` is the highest-risk packet in the project. `plan-09` carries the roadmap §16 obligation to
exercise the slice at the public GitHub Pages URL, which `plan-01` proved only for a static page, and
its closeout now requires a dated owner disposition naming the evidence artifact, deployed revision,
and public URL.

## What the Owner Actually Chose (chat-only judgments)

- 2026-09-18: first packet set directly to `in-progress`, skipping `ready` — the status write is the
  assignment signal.
- 2026-09-18: the orchestrator may close a verified packet and advance the next when no owner
  decision is needed to start it.
- 2026-09-18: plan-02 stayed unified rather than split per Codex F5, with an internal milestone gate.
  Orchestrator call, owner may still veto.
- 2026-09-19: LCD ceiling raised to 30 over the recommended lower bound, accepting visual cramping at
  narrow widths because mobile is a lower-priority target than Chromebook, tablet, and desktop, and
  because scaffolding toward higher LCDs is wanted later.
- 2026-09-19: the condition switcher is a gear icon on the entry page, not a URL parameter — the
  owner's judgment being that most children will not click it.
- 2026-09-19: the gear menu carries **only** the condition switcher at this stage; assigning future
  preferences to it was explicitly withdrawn.
- 2026-09-19: connection-making checks must sometimes have an unexpected correct answer, or children
  click through them like a licence agreement.
- 2026-09-19: support for learners below the prerequisite boundary stays a *bounded* opportunity
  (OQ-17) — at most a calm message suggesting a teacher conversation. Explicitly not an obligation to
  teach basic arithmetic.

## Carried Into plan-09

1. **Two figures are design intent, not evidence.** The collapse rule's 48px folded height and 85%
   active-content claims were correctly labeled unmeasurable in `plan-08`, since the mock DOM has no
   layout geometry. `plan-09` runs in a real browser and owns turning them into measurements or
   dropping them.
2. **The DECISION-021 rubric is structurally self-assessed, not evaluated.** `plan-08` labeled it so
   explicitly and stated that `plan-09` does not inherit "rubric satisfied." The rubric is an
   acceptance-gate instrument with owner/teacher review as its authority, and `plan-09` is that gate.
3. **Enter/Space activation is untested.** `plan-08` verifies focus reachability and native element
   types; actual key activation is browser behavior deferred here.
4. **Screen readers, real viewports, and contrast tooling are all untested.** `plan-08` Section 8
   separates exercised environments from the DECISION-009 target matrix honestly. `plan-09` is the
   first packet with a browser.

## Standing Cautions (expensive rediscoveries avoided)

- **Watch for a label that promises more than its body delivers — now six instances across
  `plan-07` and `plan-08`, with no decline in rate.** A purity suite named for renderer purity that
  imported two of five modules and missed the one that computed; a static scan named for the absence
  of derived mathematics that matched four literal regexes; a "fail-first" test that wrote the defect
  into a string literal and asserted the literal matched a regex for it; a keyboard-*completion* test
  asserting only `tabIndex`; a column headed "Human Review Evidence" listing reviews that never
  happened; a rubric marked "Satisfied" on criteria the same report called unmeasurable. Every time
  the suite was green and the underlying code was sound — the defect was always the distance between
  a claim and its evidence. **Read the body against the name, and check which modules a test actually
  imports, before crediting any general claim.** Assume it recurs in `plan-09`.

- **The orchestrator's own recurring failure mode here has been hand-derived arithmetic.** A family
  sweep computed by hand omitted `maxCanonicalScaleFactor`, producing a wrong eligible set that was
  handed to the owner as evidence; the design-review agent's figures, computed with
  `inspectCandidateSpace`, were right. Run the code. The correction is recorded in the Batch A/B
  exchange and in `phase-2-specification-reconciliation.md`.
- `docs/decision-log.md` is **append-only**. Supersede with a new entry; never amend in place. One
  same-day clarification to DECISION-015 was made with an explicit dated, owner-authorized note, and
  that is the only acceptable form of in-place edit.
- Never hand-edit the packet table between the `plan-index` markers in `docs/development/README.md`;
  run `render`. `set` lints atomically and refuses bad writes.
- Status verbs (`delivered`, `complete`, `superseded`, `parked`) are orchestrator/owner-only.
- `npm`/`node` are not on Git Bash PATH here; use `export PATH="/c/Program Files/nodejs:$PATH"`.
- Heredocs with `<<'EOF'` have failed twice in this environment on long Markdown payloads. Write the
  file with the Write tool, or use `python -c` with the content in a scratchpad file.
- `docs/agent-starting-prompts/design-review-prompt.md` is a **mixed file**: only the
  `bootstrap:commit-discipline v2` block (lines 17–39) is Bootstrap-managed. Project-local edits
  elsewhere are safe, and one was made 2026-09-19 requiring batches to brief before asking.
- Bootstrap intake notes are left **untracked** in `C:\AI\Bootstrap` by convention; a Bootstrap
  orchestrator sweeps them. Do not commit there.
- On managed Windows Codex tasks, source writes can succeed while `.git` metadata writes fail with
  `index.lock: Permission denied` and no lock present. Diagnose read-only first, then narrow
  elevation for an explicit-path stage/commit. Never delete an absent lock; never treat elevation as
  push authorization.
- A design-review agent was observed reading host-level session transcript logs mid-session to
  recover its own batch instructions, which means the assignment had fallen out of context. Restate
  the batch assignment at each boundary, or keep sessions shorter.

## Next Orchestration Move

`plan-09` is the last packet of the Phase 2 wave and the only one carrying an **owner** gate. It
composes the shell and the reviewer-only condition switcher, then exercises the slice at the public
GitHub Pages URL as roadmap §16 requires — the first time real application behavior crosses the
deployment path that `plan-01` proved only for a static page.

Three things to hold when it runs:

- **Publishing is outward-facing.** The packet requires owner confirmation before the first deploy of
  application behavior, and push authority is separately owner-gated. Neither is a formality.
- **Only the owner declares the exit gate satisfied**, via a dated disposition naming the reviewed
  acceptance-evidence artifact, the deployed revision, and the public URL. The implementer stops at
  "ready for orchestrator review"; the orchestrator may set `delivered` and verify, and that is all.
- **It is the first packet with a browser**, so it inherits everything the headless packets could not
  measure. See "Carried Into plan-09" above.

Per the owner convention, report board state and needed owner action on completion, then advance the
next packet if it needs no owner decision. Never push without explicit authorization.
