# Session Handoff — Orchestration State

Living pointer document (see `docs/agent-starting-prompts/orchestrator-prompt.md` § "Session Handoff File").
Orchestrator-owned; update in place before thread boundaries. Anchor dates, never countdowns.

First revision 2026-09-18. Rewritten 2026-09-19 when the specification phase closed. **Rewritten again
2026-09-29** at an orchestrator change: the prior revision stopped at `plan-09` Repair 01 on
2026-09-20, before Phase 2 closed, and patching it would have left a file describing a phase that no
longer exists.

## Orchestrator change — 2026-09-29

The owner is moving plan orchestration to **Codex** "for a while," from a Claude Code thread that ran
it from `plan-09` Repair 01 through `plan-16`'s drafting. Codex was primary through `plan-08` and
reviewed `plan-10`–`plan-13` adversarially on 2026-09-21
(`reports/orchestration/plans-10-13-codex-review.md`); that review was accepted almost entirely
(`plans-10-13-codex-review-disposition.md`) and is the reason `plan-14` exists.

Nothing is mid-review. Everything below is committed at or after `b654487`.

## Live state (as of 2026-09-29)

Authoritative status is `node scripts/dev/plan-status.js list` and the generated index in
`docs/development/README.md`. Trust those over this file.

| packet | status | note |
|---|---|---|
| `plan-09` | complete | **Phase 2 exit gate satisfied by owner disposition, 2026-09-21**, at `b418e8a`, public URL https://mrsmithelhs.github.io/FractionFlow/ |
| `plan-10` | complete | Phase 3 reach assessment. Headline: **demonstrated reach across exactly one of fourteen** §27/§28 targets |
| `plan-14` | complete | Browser route matrix. 20 routes: 19 pass, 1 known defect. All three enforcement paths re-verified with independent seeds |
| **`plan-12`** | **in-progress** | Entry page + the Inspection Mode focus repair. **Next action is at its Requirement 0 gate** |
| `plan-11` | draft | Motion / animated subdivision (D-01-A). Unblocked |
| `plan-15` | draft | Subtraction representation prototypes (OQ-25). Unblocked |
| `plan-16` | draft | Computed beat schedule (DECISION-034). Unblocked |
| `plan-13` | draft | Scaffold fading. Waits on `plan-12` |

### Recommended order after `plan-12`

1. **`plan-16`** — behavior-preserving refactor under the unedited route matrix. Every Phase 3 family
   needs it, so it precedes all of them. **Serial with `plan-12`**: both edit `beat-container.js` and
   `linear-path.js`.
2. **`plan-15`** can run **in parallel with anything** in a separate checkout. It is a standalone
   surface outside the learner app. Its only shared file is `tests/routes/route-matrix.json`.
3. **`plan-13`** once `plan-12` lands, since the entry-page gear menu is its support selector.
4. **`plan-11`** is independent and can slot in wherever there is capacity.
5. The first Phase 3 **family** packet — multi-whole bar and results crossing one whole
   (DECISION-032) — is **not drafted**. The owner asked to hold it until `plan-14` was certified; it now
   is. It should be written against `plan-16`'s schedule and the route matrix.

## What `plan-12` needs next

It is at **Requirement 0**, which is a propose-and-stop gate:

- **What the entry page holds beyond the name** — the one OQ-19 question DECISION-029 deliberately left
  open. The owner's stated intent is recorded in the packet: a "start screen / holding pen," name
  (possibly animated SVG with text fallback), a short learner-facing line, a small creator credit at
  the bottom, the gear, and practice-type buttons. **Only practice types that run may be offered** —
  today that is one. The holding-pen property comes from a registry, not from disabled buttons.
- **The focus contract**, including **Requirement 6**, the focus repair. Read its note on the obvious
  fix: widening the capture guard sends focus to the **Replay button**, not the choice group. The
  route matrix already rejects it.

When `plan-12` lands, `ROUTE-FOCUS-INSPECTION-RESTORE`'s `knownDefect` marker must be retired and its
assertion inverted. The runner fails if the marker survives the repair.

## Decisions since the last revision

DECISION-025 through **DECISION-034** are all new since 2026-09-19. The ones a fresh orchestrator must
hold in the foreground:

- **029** — entry page gates the episode; the gear lives there **and nowhere else**; retry and
  return-to-entry are both kept and must discard identical state.
- **030** — the gear also carries reviewer-selected **support level** (amends 019).
- **031** — practice types are URL-addressable **by fragment only**; conditions and support level are
  **never** in a URL.
- **032** — results crossing one whole use a **discrete multi-whole stack**, with four constraints.
  Constraint 3 matters most: nothing may show the result before the learner supplies it. A Gemini mock
  of this design did exactly that, twice.
- **033** — mixed numbers stay out of Phase 3; **a strategy is owed** before Phase 5 (OQ-24).
- **034** — the arc is a schedule computed **once** from the problem, never from learner actions.

Open questions of note: **OQ-23** (try another problem), **OQ-24** (no mixed-number pedagogy exists),
**OQ-25** (subtraction representation — `plan-15` gathers evidence, does not decide).

## What the owner actually chose (chat-only judgments, 2026-09-21 → 2026-09-29)

- Accepted the Phase 2 gate with **n = 0 children**, and with scaffold variability in a named weak
  state (the support ladder had no writer).
- Wants learner surfaces **uncluttered**: no redundant labels, no text restating an image, no
  explanatory chrome. The owner's first `plan-09` review was about exactly this, and it recurred in the
  Candidate 1 mock.
- Wants in-chat handoffs as **quotable blocks**, and wants trivial fixes done by the orchestrator rather
  than round-tripped ("It's one line — do that yourself").
- Deployed `b418e8a` personally and exercised it on Chrome, Edge, and Firefox on one laptop. **Pushing
  to `main` is deploying** — `deploy.yml` fires on push.
- Works with **high school** students. A feedback exercise is drafted at
  `reports/orchestration/student-feedback-questions.md`; its results are secondary-age evidence
  relevant to DECISION-016's repair learner, **not** child-usability evidence for the 8–11 target.
- Folded the focus repair into `plan-12` rather than a `plan-09` Repair 08.

## Standing cautions

- **The label-versus-body caution is not retired.** It was prematurely called "declining" on
  2026-09-20 and withdrawn. Codex's reformulation stands: it **changed shape**, from structural
  overclaim to post-repair verification overclaim. Retirement condition: several independently reviewed
  user-facing packets run against the common route matrix, and the matrix catches a seeded defect.
- **Verify focus, layout, and visibility with a real gesture, not just a real browser.** A
  programmatic `.click()` does not move focus. The Inspection Mode focus defect passed the mock harness
  *and* an orchestrator browser check that used synthetic clicks, and was found only by Playwright. The
  correction is appended to `plan-09`'s `focus-restore-review.md`.
- **Reachability, not existence.** Read `reports/orchestration/phase-2-unreachable-mechanisms.md`
  before planning. The question for any mechanism is what sequence of real actions reaches it.
- **Measure, do not sum.** `plan-10`'s first 360px budget was a component sum that missed 220px of
  existing chrome. Reference viewports are **360×740 and 360×752**.
- **Two implementer threads shared one checkout** on 2026-09-21. Nothing was lost because both staged
  by explicit path, but one described the other's live work as "pre-existing modified files." Parallel
  packets need separate worktrees. The owner has not formally decided this.
- `docs/decision-log.md` is **append-only**. Never hand-edit the packet table; run `render`. Status
  verbs are orchestrator/owner-only.
- Long heredocs have failed repeatedly in this environment. Write files with a file tool, or run a
  script from the scratchpad.
- `npm` and `node` were on PATH throughout the 2026-09-21 → 2026-09-29 sessions. The older note that
  they need `export PATH="/c/Program Files/nodejs:$PATH"` may be environment-specific.
- On managed Windows Codex tasks, `.git` writes can fail with `index.lock: Permission denied` when no
  lock exists. Diagnose read-only first. Never delete an absent lock; never treat elevation as push
  authorization.

## Where the project stands against the roadmap

`reports/orchestration/roadmap-position-2026-09-21.md`. Short version: on track, standing at the §89
checkpoint. The mathematics runs well ahead of the presentation — the content layer can generate
problems crossing one whole, and even Phase 5 decomposition, that no renderer can draw — so from here
every open question is a presentation question. §89's first question, "did learners understand the
visual transformation?", still has no answer.
