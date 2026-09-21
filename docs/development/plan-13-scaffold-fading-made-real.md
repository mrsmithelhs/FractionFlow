---
id: plan-13
title: Scaffold Fading Made Real
status: draft
depends_on: [plan-10]
gate: "Owner reviews at least two support levels on rendered screens and confirms that the reduced-support form still asks the learner to reason rather than displaying the answer. The mechanism is the deliverable; the adaptive policy is not."
superseded_by: null
resolution: null
summary: >-
  Give the four-level support ladder a writer. src/interaction/support.js builds
  high / medium / low / independent across six dimensions; state.support is
  assigned once and never updated, so no learner reaches any level but the first.
  Make at least two levels reachable and visibly different, starting with OQ-22's
  lower-support premise check, and answer Roadmap §22's "architectural ability to
  fade" with behavior rather than with a type.
---

# Plan 13: Scaffold Fading Made Real

## Packet Metadata

- Packet id: `plan-13`
- Packet title: Scaffold Fading Made Real
- Status: (see frontmatter)
- Owner/model: implementer (single) / orchestration
- Date: 2026-09-21
- Packet type: feature
- Mutation level: user-facing release
- Approval gate: owner review of at least two support levels on rendered screens, with an explicit agency check
- Depends on: `plan-10` (the reach assessment must say whether support level is an axis across the Phase 3 families before the ladder's writer is built, so the writer is not built for one episode)
- Expected artifacts: `src/interaction/` and `src/app/` changes; at least two reachable support levels; OQ-22 addressed; progress report

## Goal

Answer the weakest criterion in the accepted Phase 2 evidence. Roadmap §22 asks the slice to prove
*"at least an early version of scaffold fading"* — the architectural ability to fade, not the adaptive
rules. `src/interaction/support.js` builds a four-level ladder across six dimensions.
`state.support` is assigned once at `episode.js:629` with every dimension pinned at `high support`,
and nothing ever writes it again; `src/app/app.js` never passes a label. The type exists; the behavior
does not. This packet gives it a writer.

## Non-goals

- **No adaptive rules.** *Which* support level a given learner receives, and when it changes, is out of
  scope. Roadmap §22: "The exact adaptive rules can wait. The architectural ability to fade should
  not." This packet builds the ability; it does not decide the policy.
- **No performance tracking, no mastery model, no placement, no progress.** D-07 through D-11 stay
  deferred.
- **No content changes.** Premise content, reflection choices, and family contracts stay as they are;
  support varies the *support*, not the mathematics.
- **No new problem families.**
- **No new decisions.** If the work exposes one, report it.

## Depends on

`plan-10` accepted. The reach assessment decides whether support level is an axis that the §27
families and §28 focused concept episodes share. Building the ladder's writer before that answer risks
building a writer shaped around one episode, which is the same mistake as a mechanism nothing reaches.

## Why this packet exists

This is the one §25 criterion the owner accepted in a stated weak condition, on 2026-09-21, with the
gap named rather than papered over. It is also the first of four findings in
`reports/orchestration/phase-2-unreachable-mechanisms.md`, whose closing line is the reason this packet
exists at all: *"a mechanism's existence is not evidence that anything reaches it."*

**OQ-22** supplies the first concrete case. The check-the-premise task currently shows both bars —
"Starting fraction: 2/3" above "New parts: 7/12" — so the comparison is visually obvious. A
lower-support form withholds that: show only the new bar, or drop to the linear/symbolic presentation,
and ask the same question. That is a genuine fading axis proposed from watching the thing run, not
from the specification.

## Authority and contracts

Required reading:

- `AGENTS.md`; `docs/decision-log.md` — DECISION-005, 006, 012, 016, 019, 021, 026 especially
- `docs/founding/06-roadmap.md` §22
- `docs/founding/05-quality-and-validation.md` — "Accessibility Must Preserve Agency"
- `docs/open-questions.md` — OQ-22
- `reports/orchestration/phase-2-unreachable-mechanisms.md`
- `docs/development/phase-3-generalization-design/` — the accepted `plan-10` dossier

Contracts this packet must preserve:

- **Support is instructional configuration, selected upstream** (DECISION-006). It is not a renderer
  flag and it does not travel backwards from presentation.
- **The Separation Rule** — `mathematical state → instructional state → presentation`.
- **DECISION-026 holds at every support level.** The premise check's reassuring answer must still
  sometimes be wrong; a lower-support form must not become an easier form by becoming a predictable
  one.
- **Agency across access modes.** `05-quality-and-validation.md` is explicit that an adaptation is not
  sufficient if it turns "learner reasons about the answer" into "software tells the learner the
  answer." **The same test applies to fading in reverse:** a reduced-support form must remove
  *support*, not remove the learner's ability to participate.
- **The participation floor holds at every support level.** Keyboard, non-drag touch, reduced motion,
  and the linear path are not scaffolds to be faded.
- **No history in the scene.**

## Scope

### In scope

- `src/interaction/support.js` and `src/interaction/episode.js` — make `state.support` writable from
  upstream episode configuration rather than pinned at construction.
- `src/app/` — the means by which a support level is selected, consistent with the reviewer-only
  switcher's existing boundary.
- `src/interaction/scene.js` — projecting support-dependent instructional state, if the scene does not
  already carry what the renderers need.
- The presentation consequences of at least two levels, including OQ-22's lower-support premise check.
- Tests covering every reachable level, not merely the mechanism that selects them.

### Out of scope

- `src/math/` and `src/content/data/` — no changes.
- Any rule that changes support level based on learner performance.

## Implementation Requirements

### Requirement 1 — The ladder has a writer

Required behavior:

- `state.support` is set from upstream episode configuration and is reachable at more than one level by
  an actual sequence of actions a reviewer can perform.
- **State the sequence.** The report must say, concretely, what a reviewer does to reach each level.
  "It is configurable" is not an answer; `plan-09` shipped four mechanisms that were configurable and
  unreachable.
- Support level appears in the replay envelope alongside the active condition.

Constraints:

- Support level does not change mid-episode as a result of learner performance. If the architecture
  makes that easy, leave it unbuilt and say so.

### Requirement 2 — At least two levels are visibly different

Required behavior:

- At least two support levels produce materially different learner-facing experiences, demonstrated by
  captured output at the same beat under each.
- OQ-22's lower-support premise check is one of them: the same question, asked with the side-by-side
  bars withheld.
- The difference is in support — prompts, visible intermediate state, available help — not in the
  mathematics, the correct answer, or the content.

### Requirement 3 — Agency survives the fade

Required behavior:

- At every implemented level, the learner still makes the same decisions. Compare the decisions
  required, not merely the pixels rendered, and say so explicitly per level.
- DECISION-026 verified at the lower level: the reassuring answer is still sometimes wrong.
- The participation floor verified at every implemented level — keyboard completion, non-drag touch,
  reduced motion, and the linear path.

### Requirement 4 — Layout at every level

Required behavior:

- 360px measured at every beat under every implemented support level, against a stated viewport
  height. A lower-support form usually shows less and should cost less; confirm rather than assume.

## Validation Checklist

- [ ] `state.support` written from upstream configuration; the reviewer's action sequence to reach each
      level is stated concretely.
- [ ] At least two levels reachable and materially different, with captured output at the same beat.
- [ ] OQ-22's lower-support premise check implemented.
- [ ] DECISION-026 holds at every implemented level.
- [ ] Decisions required by the learner compared per level and stated.
- [ ] Participation floor verified at every implemented level.
- [ ] Support level appears in the replay envelope.
- [ ] 360px measured per beat per level, against a stated viewport height.
- [ ] No changes to `src/math/` or `src/content/data/`.
- [ ] `npm test`, `npm run build`, `node scripts/dev/plan-status.js lint` pass; tree clean.
- [ ] Progress report exists at `reports/development/plan-13-scaffold-fading-made-real/progress.md`.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report if:

- Making `state.support` writable appears to require presentation to inform instructional state.
- A reduced-support level cannot be built without removing a decision from the learner rather than
  removing support for it.
- The participation floor cannot be held at a lower support level.
- Fewer than two levels can be made meaningfully different without content changes.

## Implementer Authority Boundaries

- Status verbs belong to the orchestrator and owner.
- **The implementer may not declare scaffold fading proven, or §22 satisfied.** Whether the
  architectural ability to fade has been demonstrated is the owner's judgement, informed by
  orchestrator verification.
- **Reachability is the deliverable, not configurability.** A level that exists in the type system and
  cannot be reached by a sequence of actions is not delivered.
- Layout, focus, and visibility claims must come from a browser, not the test harness.

## Advisor Consultation

Inherited from `AGENTS.md`. Instructional surface and a user-facing release; record a full disposition
or a named degraded mode.

## Commit and Concurrency Guidance

Stage by explicit path; never `git add -A`. **Never push without explicit owner authorization.**
Mode A. Never delete a lock file.

## Progress Report

`reports/development/plan-13-scaffold-fading-made-real/progress.md`

Minimum contents: summary; how support is written and the concrete action sequence reaching each
level; captured output at the same beat under each level; the per-level decision comparison; the
DECISION-026 verification at the lower level; participation-floor evidence per level; 360px
measurements per beat per level; commands; problems; remaining risks; advisor disposition; ready for
orchestrator review yes/no.
