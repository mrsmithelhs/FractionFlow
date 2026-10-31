# Plan 45 — Checkpoint 1: Pure Content and Instructional Contract

Date: 2026-10-31  
Mechanism disposition: Requirement 1 pure-contract slice approved in
`mechanism-approval.md`. This artifact requests Checkpoint 1 review. Broad app,
render, condition-menu, route, and replay serialization work remains gated.

## Result

Materialized and validated the adopted 12-item batch, an exact-comparison
classifier, a comparison-only `compare -> resolve` episode schedule, and
instructional model/help/retry state. The implementation preserves raw ordered
forms, does not use an arithmetic operation, and does not put expected relation
or normalized identity into the resolver context used to build episode state.
No replay envelope was added and no app/render/route code was integrated.

## Owned files in this checkpoint

- `src/content/data/plan45-symbolic-fraction-comparison-records.js`
- `src/content/plan45-symbolic-fraction-comparison-task.js`
- `src/content/index.js`
- `src/interaction/episode-definition.js`
- `src/interaction/beat-schedule.js`
- `src/interaction/classification.js`
- `src/interaction/plan45-comparison-episode.js`
- `src/interaction/episode.js`
- `src/interaction/provenance.js`
- `src/interaction/index.js`
- `tests/content-plan45-symbolic-fraction-comparison.test.js`
- `tests/interaction-plan45-symbolic-fraction-comparison.test.js`

## Identity, record and exact validation contract

Fixed identities:

- Definition: `phase-4-symbolic-fraction-comparison@1`.
- Practice set: `symbolic-fraction-comparison-vetted-set@1`.
- Recipe: `symbolic-fraction-comparison@1`.
- Task data: `plan45-symbolic-fraction-comparison-task-data@1`.
- Record authoring: `plan45-record-v1`.
- Item IDs: `plan45-compare-01` through `plan45-compare-12`, in that fixed order.

Each strict-key authored record carries `itemId`, `authoringRevision`,
`taskDataId`, `taskDataRevision`, `recipeId`, `recipeRevision`, ordered
`sourceForms.first/second`, `teachingIntentId`, and `cueId`. No record has an
expected relation, answer, or correctness flag. Validation requires canonical
positive integer strings, `0 < numerator < denominator <= 10`, a registered
intent/cue, exact authoritative record identity, and unique ordered membership.
The all-item validator derives exact comparison with `compareFractions`, checks
4/4/4 relation balance, and returns aggregate counts only. It uses
`simplifyFraction` to derive normalized identity for validation evidence, but
that identity is not placed in episode task context or scene input. Raw source
forms and operand order remain intact.

The resolver's exact context keys are:

```text
practiceSetId, practiceSetRevision, itemId, authoringRevision,
definitionId, definitionRevision, recipeId, recipeRevision,
taskDataId,
taskDataRevision, sourceForms, teachingIntentId, cueId, hintContext
```

`hintContext` is strict and cue-specific:

- common-unit cue: `{ kind, denominator }`, with denominator from exact LCM;
- half cue: `{ kind, benchmark: "half" }`; validation confirms exact opposite
  sides of one half using `compareToBenchmark`, then strips per-operand results;
- same-denominator cue: `{ kind, denominator }`;
- same-count cue: `{ kind, numerator }`;
- complement cue: `{ kind }`;
- equivalence cue: `{ kind }`.

This avoids putting an equality identity or benchmark-side answer in the context
passed downstream. Invalid/missing/extra keys, unknown records, changed forms,
wrong set revisions, unsupported cue IDs, non-proper forms, and denominators
above 10 are rejected.

## Intent and state contract

The registered immutable schedule is exactly:

```text
[{ id: "compare", kind: "compare" }, { id: "resolve", kind: "resolve" }]
```

Wrong Check is recovery within `compare`; accepted comparison resolves directly
to `resolve`. There is no separate answer beat, recovery beat, or empty
progression/finish beat.

Literal learner-intent wires:

```text
{ type: "request-comparison-model", side: "first" | "second" }
{ type: "request-comparison-help", helpKind: "reasoning" | "notation" }
{ type: "submit-fraction-comparison", proposed: "<" | "=" | ">" }
```

All intent shapes are exact-key validated. A malformed side, help kind, relation,
or extra field refuses without coercion. The first valid model request sets
`assistance.modelChoice`. Repeating that same side is an explicit strict no-op
(no extra intent or assistance-history entry); requesting the opposite side
raises `COMPARISON_MODEL_LOCKED` without mutating state. The app must reject stale
response handles by episode generation before dispatch; generation guards are an
app responsibility and are not simulated in the pure reducer.

Help and model requests append actual wires to `intentHistory` and an
`assistanceHistory` event with `helpKind` or selected `side` and the authored
`cueId`. Disclosure visibility and the unsent relation draft are deliberately
absent from this mathematical/instructional state; the app will own them. A wrong
relation appends the submitted intent and a generic `incorrect-comparison`
recovery/retry record, leaves the schedule at position 0, retains all relation
choices, and preserves the model lock. Recovery carries no expected relation.
The classifier keeps exact truth upstream. Accepted state records the exact
submitted glyph and unchanged ordered source forms, then moves to `resolve` at
schedule position 1. Response provenance stores the classification internally;
it is not renderer input. Every comparison response is conservatively tagged
`supported-construction`; assistance therefore cannot be misreported as
independent mastery.

State shape at a high level:

```text
schemaVersion/status/revision/episodeDefinition/taskContext/activeCondition
beatSchedule/schedulePosition/support/beat/expectedResponse
established: { comparison: null | { acceptedRelation, sourceForms } }
assistance: { modelChoice: null | "first" | "second" }
assistanceHistory/intentHistory/retryHistory/responseProvenance/lastRecovery
```

`expectedResponse` contains the one relation response responsibility and fixed
three choices. Unsubmitted relation draft is app-owned. Neither it nor this
state's task context contains an expected relation or correct-option marker.

## Cue and support contract

The task module defines one authored reasoning cue per item family and a separate
notation cue, “The open side faces the greater amount.” Close-pair help receives
an exact-derived common-unit denominator; the copy names that unit only and
never supplies converted numerators. The half cue is “Could one half separate
these two amounts?” and renderer-facing context does not include which operand
lies on either side. Equality help asks whether two names could describe the same
amount. The optional More strategy cue is “Try a benchmark or compare same-size
parts.” The same task, help and one-model limit apply to More and Less. Neither
profile auto-selects or auto-shows a model. Only the existing high/medium support
labels are admitted.

## Condition/capability disposition

The source has a task-local static capability and truthful default condition.
Only `D-05-focused-key-beats` applies. `D-01-A/B` describe change/side-by-side
display styles, `D-02-M/J/S` describe transformation choreography, and
`CM-01-M/P` describe reflection/connection behavior; this fixed static comparison
does none of those things. The constructor rejects those incompatible condition
codes instead of labeling the task with them. It does not change the global
reviewer menu. At later registration, the app will need a narrow adapter that
uses the static task condition for this task while preserving global settings for
other practice types. This capability is not yet mounted in the app.

## Replay and historical compatibility proposal (not implemented)

No new version is emitted at this checkpoint. Existing replay v1-v8 code and all
historical replay fixtures/oracles remain untouched. The candidate v9 outer
envelope keeps the current exact outer shape:

```text
schemaVersion, contentIdentity, episodeDefinition, support, activeCondition,
learnerIntents, taskContext
```

Proposed comparison `contentIdentity` exact keys:

```text
schemaVersion: "fractionflow.comparison-content-identity/v1"
id: "symbolic-fraction-comparison-vetted-set@1/plan45-compare-NN"
source: "curated"
reconstruction: {
  kind: "plan45-symbolic-fraction-comparison",
  practiceSetId, practiceSetRevision, itemId, authoringRevision
}
```

The exact `taskContext` keys are the resolver keys above. Replay must resolve the
identity to the authoritative record, compare every revision and both raw ordered
forms, validate support/condition/intent wires, and replay only the chronology of
actual help/model/Check requests. It must reject v1-v8 envelopes that claim the
comparison definition and reject comparison v9 under any other definition. It
must not migrate/relabel old envelopes, add unsubmitted drafts, or synthesize
missing model requests. Round-trip witnesses should cover fresh state, either
first-side lock, duplicate same-side no-op, help, wrong then corrected response,
equality, and both operand orders; pre-existing v1-v8 oracles must still replay
identically. The v9 identity/wire and these compatibility tests remain subject to
orchestrator approval before replay code is changed.

## App/render/progression boundary for the next gated stage

The renderer still cannot receive this state directly. A later pure scene
projection must return original source forms, current learner draft, `modelChoice`
and at most one chosen source model before acceptance, while omitting internal
classification/provenance, normalized identities, expected relation, and any
per-option correctness. Accepted scene may carry the accepted relation and paired
verification. Linear and visual projections must enforce the same boundary.

Following Plan 42, the app should own an opaque comparison response handle and
the raw unsent glyph draft. Proposed response region `compare` surface:

```text
readDraft() -> raw glyph | empty
writeDraft(raw glyph | empty) -> accepted/refused
focusPrimary() -> current connected control | false
```

The handle is scoped to item ID, schedule position, schedule-entry ID, prompt ID,
and episode generation. App owns view choice, help disclosure open state, draft
capture/restore, stale-handle rejection and focus timing; the response region
owns the native relation group/Check control and dispatches only raw intents.
The episode's model choice persists through renderer remount because it is
instructional state. Help requests and model requests stay distinct assistance
provenance.

Current shared progression eligibility recognizes terminal operation/number-line
acceptance and resolved reflection. Plan 45 resolves on the accepted relation,
so integration should add a `resolved-comparison` descriptor case to the existing
Plan 43 shared progression path, using the same preparation transaction,
generation guard, one-step fresh install, local Next/final Back, and focus policy.
Since comparison is already `status: resolved`, the transaction should treat it
like accepted reflection and not dispatch another completion intent. This stage
adds no second progression implementation.

## Validation and evidence

Commands run:

- `node scripts/dev/plan-status.js check 45` — `RUNNABLE`.
- `npx vitest run tests/content-plan45-symbolic-fraction-comparison.test.js tests/interaction-plan45-symbolic-fraction-comparison.test.js tests/interaction-episode.test.js tests/interaction-provenance-replay.test.js tests/content-plan40-subtraction-recipes.test.js tests/interaction-plan40-subtraction-recipes.test.js` — 6 files, 47 tests passed.
- `git diff --check` — passed.

The new tests derive each of the 12 actual registered item relations through the
exact classifier, verify each item resolves under its actual identity, preserve
raw forms, test 4/4/4 balance and <=10 source denominators, validate hint targets,
reject malformed records/contexts/intents, and exercise lock/no-op/refusal,
wrong/revised response, equality, and More/Less invariants. Existing interaction,
provenance/replay and Plan 40 tests passed as compatibility witnesses. No route
matrix, context map, fixture, replay schema, or historical artifact changed.

No build, route matrix, browser, mounted renderer, device, or accessibility run
was conducted: those are outside this checkpoint. No Terra pass was used here;
the authorized single Terra-medium read-only pass remains for the settled
substantial implementation after integration. No Sol/Astra, substitution, or
child fan-out occurred.

## Gate

**Stop here for Checkpoint 1 approval.** Do not begin app, renderer, condition
menu, route, or replay-v9 integration until orchestration approves the pure
contract and its candidate context/envelope/interface wires.
