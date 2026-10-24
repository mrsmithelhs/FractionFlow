# Plan 43 Requirement 0 mechanism review

Date: 2026-10-24. Reviewed proposal commit 1b2fb27 against the packet and current
source. Plan43 is in-progress and preflight reports RUNNABLE. Existing unstaged
packet/index status-dispatch edits are left untouched. This review changes no
source, tests or fixtures and uses no additional advisor consultation.

## Disposition

The direction of Alternative A is supported: use one explicit continuation
transaction, retain existing instructional completion intents, keep results
inspectable and advance only on a learner action. Immediate acceptance resolution
and a schedule rewrite are unnecessary for this repair. However, the submitted
proposal is **not yet approved for source work**. Revise the proposal on the four
bounded points below, commit it, and return for orchestrator approval. No new
owner pedagogical decision or larger architecture investigation is requested.

## 1. Specify a valid shared progression contract

The proposed canAdvance/isExhausted formulas describe set position, not accepted
instructional eligibility. The descriptor must also distinguish: active task,
Continue to reflection, terminal accepted work awaiting navigation completion,
and already-resolved reflection. Reject premature actions in the app transaction
as well as hiding controls. Do not infer terminal acceptance merely from resolve.

The proposed renderer check cannot use currentTask.connectionForm to detect a
future reflection: scene.js taskMeaning sets that value only while already at
reflect, and null at resolve. Nor may a renderer read raw state.episodeDefinition.
Name a single upstream/app-owned policy or validated projection with the exact
descriptor/callback surface all renderers receive. The app owns item position;
instructional eligibility must follow validated episode/schedule/accepted state.
Do not copy definition lists into each renderer or invent another lesson engine.

Specify the exact completion adapter for each relevant existing response
contract. Plan20 submit-resolution requires its original proposed form payload;
a bare {type: 'submit-resolution'} is not equivalent to the current action. Keep
that payload and classification/provenance semantics outside the renderer.

## 2. Preserve historical witnesses, not just replay schemas

Proposal section5.1 and implementation step3 conflict with the packet by planning
to rewrite existing production route actions. Original routes, context mappings,
recordings and evidence are protected; add new current witnesses instead. The
route-contract tests pin old prefixes, including the first98 action objects.
Do not remove or regenerate those pins against new expected output.

The historical entry fixtures are not independently frozen app builds:
tests/fixtures/plan34-historical-entry.js and plan18-historical-entry.js import
the CURRENT app source. The number-line historical fixture does the same. Their
pinned registries/definitions do not automatically preserve old button behavior.
The runner also maps Plan34/35/38/40 rows to production-default-v7 and Repair02/03
rows to production-default-v8; a route prefix alone does not establish a historical
context. Identify actual matrix/context entries rather than guessed route names.

Propose the smallest explicit historical/current UI policy boundary at app
composition/test entries, or an actual frozen-build mechanism. Explain precisely
where old contexts run legacy navigation and new witnesses run production direct
navigation. Keep any compatibility switch out of learner settings and render-owned
mathematics. Preserve existing mappings/actions while adding current contexts and
discriminating guards; do not simply weaken context validation. List the exact
entry/builder/runner/contract changes and how the historical behavior is proved.

Retaining definition, set and replay versions is plausible for Alternative A if
the instructional schedules, accepted raw intents, payloads and resulting states
remain identical. Treat that as a hypothesis to verify with frozen oracles, not
as an established 100% compatibility result. No replay-v9 bump is required merely
because app navigation changes. Versioned alternatives could preserve old replay
too; Alternative B's greater scope is a reason to avoid it, not proof that old
reconstruction would inherently be impossible under every versioned design.

## 3. Complete the transaction, including final return and stale controls

The final-item section currently calls returnToEntry directly, bypassing the
internal completion recording promised in Alternative A. Specify both Next and
final Back to start transactions, including already-resolved reflection and the
single-item Plan20 case. Keep ordinary mid-task Return a cancellation/exit, not
an implicit successful completion. Do not mark a final task complete twice.

Preparing the next item before mutation is good. State how the pure completed
old-state candidate and destination are validated before installation; avoid
calling public dispatch in a way that renders/announces the obsolete completed
screen or focuses a header button before installing the next task. Define the
failure boundary and prove the old completed envelope from the transaction
without adding persistent storage or tracking. Preparation refusal leaves old
accepted work and history intact.

Specify a captured episode/context generation or equivalent stale-action check,
plus accepted-eligibility revalidation, so a detached button, double activation,
Retry or return/re-entry cannot advance a newly installed item. Merely promising
a double-click assertion is not a mechanism.

Reuse the established installFreshEpisode focus policy unless there is a concrete
reason to change it: episode landmark generally, with the existing takeaway-action
exception. The proposal's new general first-input/token focus rule is unnecessary;
the number-line tile is not a keyboard control. Keep focus targets connected and
visible, preserve first-Tab behavior, and specify result/action/refusal focus.

## 4. Correct inventory and evidence claims

The 39/8/47 counts match the live registry, but the examples in section5.2 do not.
two-thirds-plus-one-fourth and one-half-plus-one-third are current compact recipes,
not protected reflection records. The six relatively-prime reflection identities
are one-half-plus-one-fifth, one-half-plus-two-fifths, one-third-plus-one-fifth,
one-third-plus-two-fifths, two-thirds-plus-one-fifth and three-fifths-plus-one-third.
The shared-factor and crossing-whole examples are correct. Generate this inventory
from current registrations so the promised reflection tests target the right work.

Correction to the earlier orchestrator audit: app.js APP_RENDER_STRINGS already
overrides resolve.continueButton to Continue. Standalone renderer defaults can
still say Next Problem, but an incorrect production reflection label has not been
established. Preserve and test truthful production labels; do not claim a live
label defect based only on the standalone default string.

The proposal also describes some test plans as if they were falsification seeds.
Name actual injected behavioral defects and the ordinary assertions expected to
reject them; do not count an ordinary positive journey or a forced throw as a seed.
Preserve the packet's deterministic bank sweep versus deep browser sample and
separate clean/seed receipts. No broad suite is needed during this proposal repair.

## Advisor and next checkpoint

An unlisted harness name alone does not establish lack of advisor capability:
the provider guidance requires actual tool/model-selection evidence. Briefly state
whether this session can select a permitted higher-tier read-only advisor. If not,
orchestrator-gate-only mode is acceptable. No paid probe, substitution or Astra
consultation is requested. Keep the owner cost limit for any later consultation.

Revise only the proposal, including exact wiring, historical UI contexts, both
transactions and the corrected inventory/evidence plan. Commit the proposal and
stop. Orchestration will review that bounded revision before source authorization.
Plan39 Repair04 remains deferred; owner rendered acceptance and deployment stay
separate. No implementer packet-status or acceptance-record edits are authorized.
