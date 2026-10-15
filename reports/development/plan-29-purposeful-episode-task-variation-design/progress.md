# Plan 29 Progress Report

Date: 2026-10-15

## Overall summary

Completed the bounded, documentation-only Plan 29 design dossier and committed
it as `10dbc9d` (`docs: propose purposeful episode task variants`). The proposal
uses one concept—preserving an amount while renaming it in supplied finer units—
and recommends two purposeful learner responsibilities: construct an
equivalent form, or inspect a supplied form and keep or repair it. It shows how
those tasks omit unrelated addition work while retaining exact mathematical
validation and a meaningful learner contribution.

The first proposed learner-reachable slice is one goal with three fixed,
reviewed target-12 records: construct `2/3 = 8/12`, keep `3/4 = 9/12`, and
repair `5/6 → 11/12` to `5/6 → 10/12`. The source-to-target scale factors vary
(4, 3, 2). This is explicitly a capability and guided-practice proposal, not
unfamiliar-item transfer evidence or an independent assessment. All task IDs
and contracts remain illustrative and unregistered.

The dossier starts no source follow-on, owner policy adoption, runtime
activation, or learner evaluation. Plan 29 remains `in-progress` for owner and
orchestrator receipt/disposition.

## Files changed and artifacts produced

- `docs/development/purposeful-task-variation-design/README.md` — scope,
  recommendation, current runtime boundary, variation limits, and the proposed
  first reachable slice.
- `docs/development/purposeful-task-variation-design/task-variants.md` — two
  concise task contracts with synthetic contrasts, before/help/recovery/after
  outlines, answer withholding, assistance, and visual/linear access notes.
- `docs/development/purposeful-task-variation-design/contract-and-evidence.md`
  — current capability map, proposed definition/task/replay identity, response
  and schedule boundaries, research limits, rival explanations, later evidence
  questions, and owner/source-follow-on brief.
- This progress report is committed separately after the dossier, per the
  packet's commit discipline.

## Orchestrator review and design decisions

The orchestrator reviewed the initial draft in
`reports/development/plan-29-purposeful-episode-task-variation-design/draft-review.md`.
The revised disposition found no remaining blocker and said the first goal,
target-12 scope, and three-record proposal were concrete enough for owner
disposition. It also recommended labeling the repeated construction/repair
source and answer as a capability/guided-practice demonstration, not transfer or
independent assessment. I varied the proposed repair record to `5/6 → 11/12`
with correction `10/12`, retained one target denominator, and included that
evidence limit in the dossier. The orchestrator confirmed this refinement
introduced no blocker.

Other review refinements applied:

- A same-numerator `change-top` on an already valid candidate normalizes to an
  unchanged valid mathematical outcome while preserving the submitted action
  in provenance. A different invalid correction remains a math error.
- The construction target partition is an unknown amount/unit template, so it
  does not visually imply zero.
- The “smaller parts” claim is limited to the proposed finer-unit examples.
- No requested app help is described only as unassisted-in-app work; it does not
  establish independent work.
- One fixed inspection task entry is distinguished from one physical gesture:
  repair involves an action and a numeric entry.
- The research table names study limits; no further literature survey was
  needed.

No source authorization or owner policy adoption was recorded. The existing
addition schedule and Plan 26 Next contract are not amended; any reuse of the
learner-triggered Next lifecycle remains a proposal for fixed pre-authored item
selection, not adaptive task-variant selection.

## Advisor consultation disposition

**Branch B — advisor consultation not warranted for this change.** The
`advisor-capable-providers.json` entry identifies this Codex subagent surface as
advisor-capable when a callable subagent tool is present, and one is available
here. This packet produced only design prose and no code, scripts, schemas, or
behavioral surface, so a separate Sol-class advisor critique was not
proportionate. The orchestrator reviewed the dossier and its refinements. The
read-only capability explorers used for source/reference inspection were not a
separate higher-tier advisor consultation.

## Commands run and results

- `node scripts/dev/plan-status.js check plan-29` — `RUNNABLE: plan-29 is ready
  to implement`.
- `node scripts/dev/plan-status.js lint` — `lint: OK (no violations)`.
- PowerShell local Markdown-target check across the three dossier files — all
  local relative Markdown targets resolved.
- Manual consistency review and targeted `rg` checks — confirmed the proposed
  examples, unknown target template, unassisted-in-app terminology, fixed Next
  boundary, and transfer/independent-assessment limits are stated consistently.
- `git diff --cached --check` — passed for the explicitly staged three-file
  dossier.
- `git show --check --stat --oneline --summary HEAD` — passed for dossier
  commit `10dbc9d`.
- No application tests or browser checks were run; this packet is prose-only and
  explicitly excludes source/runtime work.

## Problems encountered and resolution

The repository's harmless `git add --refresh -- .` metadata probe failed with
`.git/index.lock: Permission denied`. Following the repository instructions, I
used narrowly scoped elevation to stage only the three Plan 29 dossier paths,
verified the staged path list and diff check, and committed only those paths.
No lock file or ACL was changed.

Concurrent, unowned Plan 20 source work was present in the shared tree and was
left untouched and unstaged. At report preparation, the observed paths were:

- `src/app/app.js`
- `src/app/practice-types.js`
- `src/content/authored-content-catalog.js`
- `src/content/authored-problem-materializer.js`
- `src/content/data/plan20-like-denominator-addition-records.js`
- `src/interaction/classification.js`
- `src/interaction/episode-definition.js`
- `src/interaction/episode.js`
- `src/interaction/provenance.js`
- `src/interaction/scene.js`
- `src/render/beat-container.js`
- `src/render/controls.js`
- `src/render/linear-path.js`
- `src/render/strings.js`

## Remaining risks and follow-ups

- Owner disposition is still needed for the concept, task grammar, shorter
  responsibility set, first reachable goal, fixed authored mapping/Next
  relationship, and bounded help reuse.
- Any accepted source follow-on still needs a separately approved structural
  contract for task identity, fixed schedule/completion, exact response
  classification, assistance/provenance, replay/reset, answer withholding, and
  both visual and linear paths.
- The proposed records do not demonstrate learning, transfer, independence,
  interest, or willingness to return. Participant evaluation and privacy review
  remain separate gates.
- Current browser evidence does not establish physical-device or
  assistive-technology behavior.

## Ready for orchestrator review

Yes. The dossier is committed at `10dbc9d` for technical receipt and owner
policy disposition. No packet status field was changed, and no push was made.

## Owner-directed full-operation alignment addendum (2026-10-15)

After technical delivery review, the owner authorized a bounded documentation
addendum to test whether the same construct and inspect/keep/repair
responsibilities can support purposeful variation within full addition
practice. The plan remained `delivered`; the addendum did not reopen the packet
or authorize source, schema, selection, decision-log, or runtime work.

The integrated proposal is in
`docs/development/purposeful-task-variation-design/scale-and-integration-addendum.md`,
with aligned references in its `README.md` and `contract-and-evidence.md`. It
uses the existing canonical, Plan 26, and Plan 32 target-12 addition items to
show pattern/item compatibility. The proposed first learner-facing mapping is
canonical to construct and Plan 26 plus Plan 32 to inspect/keep/repair. This is
a fixed-mapping proposal, not an adopted assignment; the six-pair matrix is
compatibility evidence, not a recommendation to repeat all items under both
patterns. A future constrained sampler remains a separate policy question.

The orchestrator reviewed the first addendum commit, `46ddae4`, and requested
final consistency refinements. The revised proposal now states that encounter
acknowledgment remains mandatory while target-denominator context needs no
separate acknowledgment; the learner submits the complete sum once at
`operate`; and `resolve` displays the accepted exact result and finishes or
continues without another numeric response. For a two-renaming item, the compact
pattern has five schedule entries including encounter and resolve; the current
reflection-enabled route has eight, or seven without reflection. The proposal
also spells out a versioned definition/practice-set association to existing
item identities and preserves legacy definitions and replay meanings.

The narrowed structural proposal is new-definition-only: a registered new
pattern may provide a fixed schedule for the selected item, while legacy
problem-derived schedules remain unchanged. This is a proposed DECISION-034
amendment, not an adopted decision. Authored inspect-candidate truth remains
distinct from learner performance, and constructed, kept, repaired, and
item-provided forms retain distinct provenance. A false candidate kept by the
learner is recorded as failed classification without inventing a repair.

The final consistency refinements were committed as `2fe254f` (`docs: clarify
Plan 29 full-operation patterns`) after the addendum dossier commit `46ddae4`.
The orchestrator review and owner-intent boundaries are recorded in
`reports/development/plan-29-purposeful-episode-task-variation-design/alignment-addendum-direction.md`.
No new Sol-class advisor consultation was warranted for this prose-only
alignment; the owner-directed review was performed by the orchestrator. This
does not change the earlier consultation disposition for the initial dossier.

## Current validation and disposition

- `node scripts/dev/plan-status.js lint` — `lint: OK (no violations)`.
- `node scripts/dev/plan-status.js check 29` — reports `BLOCKED` because the
  packet is already `delivered`; the addendum correctly leaves it delivered.
- Local Markdown links in the addendum dossier resolve, and the scoped Git diff
  check passes.
- No application tests or browser checks were run: this is documentation-only
  work, with no source or runtime changes.
- Owner adoption of the full-operation pattern contract and any source follow-on
  remain pending. No decision, packet status, or learner-facing behavior was
  changed; no push was made.
