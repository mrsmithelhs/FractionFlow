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
- `plan-05` through `plan-08`: **draft**, the Phase 2 implementation wave, committed at `4bb2879`.
  Awaiting a packet-wave review the owner is soliciting from the prior orchestrator thread.

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

## The Packet Wave (draft, pending review)

Sequenced along the pipeline so no packet is built against a stub — the project's named implementer
failure mode:

| Packet | Layer | Gate |
| --- | --- | --- |
| `plan-05` | `src/interaction/` instructional engine, no DOM | mechanism confirmation |
| `plan-06` | scene projection + eligibility verdict, no DOM | mechanism confirmation |
| `plan-07` | `src/render/` renderers, strings, participation floor | mechanism + internal milestone |
| `plan-08` | `src/app/` shell, switcher, deployed acceptance | owner gate |

`plan-07` is the highest-risk packet in the project so far and the first to touch a child-visible
surface. `plan-08` carries the roadmap §16 obligation to exercise the slice at the public GitHub
Pages URL, which `plan-01` proved only for a static page.

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

## Standing Cautions (expensive rediscoveries avoided)

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

The owner is soliciting a packet-wave review from the prior orchestrator thread and will then decide
which thread oversees implementation. Until that lands, `plan-05` through `plan-08` stay `draft`.

On review completion: fold accepted suggestions into the packets, run `check plan-05`, promote it,
and take the owner's `ready` versus `in-progress` choice. Then hold the mechanism-confirmation gate
firmly — it is the guardrail that has worked every time it was used in this project, and the one
whose absence produced overclaims.

Three things the reviewing thread should be pointed at specifically: whether four packets is the
right granularity or `plan-07` should split again; whether `plan-06`'s separation from `plan-05` is
worth its coordination cost; and whether `plan-08`'s owner gate is specified tightly enough to stop
an implementer declaring the exit gate satisfied.
