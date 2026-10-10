# Plan 30 delivery review

Date: 2026-10-10. Orchestrator-owned review of implementation/evidence `136c988`
and progress report `1d58986`.

## Disposition

Technically accepted as a bounded investigation after inline report corrections.
Plan 30 remains delivered. Owner acceptance and production adoption are separate;
no production source, additional learner items, random selection or deployment
is authorized by this review. The implementer is stopped.

## Independent evidence

Root ran `node reports/development/plan-30-compact-content-authoring-investigation/experiment.mjs --verify`.
It reproduced the committed JSON byte-for-byte without rewriting it: 220
exact/content-valid ordered candidates, 110 operand-swap classes, 440 considered
paths, 98 eligible and 342 refused. Eighteen candidates met the current two-path
requirement; their 36 authored routes passed the existing premise and matching
validators. A separate root probe using the existing generator, builder and
eligibility APIs directly confirmed nine operand-swap classes among those 18.
These are offline component checks, not mounted episode or learner observations.

Root inspected the runner's materialization, baseline reconstruction, corruption
controls, serialization and read-only verification mode. The controls rejected
incorrect premise truth, duplicate choice IDs, multiple equivalent answers,
incomplete eligible-path coverage and missing authored data. The missing-data
seed removes discovery for the fixture, rather than one selectively missing
route. Repeated non-equivalent distractor forms with distinct IDs remain accepted
by the existing validator; this is a documented quality gap, not an approved
change to distractor policy. Current app admission also calls the authored
validator, so the separate closure-contract drift is latent rather than evidence
that current accepted learner routes admit defective choices.

Root confirmed that mathematical identity excludes temporary fixture provenance
and ordering, while target ordering and recipe choices use stable values/hashes.
There is no executable candidate-reordering regression in this delivery.

A fresh-context read-only reviewer found no blocking behavioral defect in the
experiment or bounded adoption recommendation. Its reporting findings were
accepted and corrected. Root executed the experiment; the reviewer did not.
Production tests/build/browser routes were not rerun for report-only corrections.

## Corrections and limits

The saved JSON contains aggregates and three examples. Full candidate/path rows
are computed in memory, not persisted as a complete ledger. Reports now say so.

The 26,434 versus 5,634 byte comparison uses abbreviated explicit path summaries
and a compact recipe description that excludes executable recipe code. Its
78.7% reduction describes those experimental representations, not equivalent
complete production storage or measured authoring-time savings.

The current progress report removes a machine account identifier. It remains in
earlier local commit `1d58986`; publishing reachable history would retain it.
Resolve that publication hygiene with the owner before a public push. Root did
not rewrite history or push.

## Recommended next scope

Accept compact input plus deterministic materialization as the direction to
prove in a separately approved source increment. Use one reviewed same-task item
to establish the authoring contract, shared validation and immutable identities;
retain the existing two registered items unchanged. Do not activate all 18
experimental candidates or build a general schema framework on this evidence.
Misconception, distractor, premise-unit and answer-position policies still need
instructional approval; exact algorithms own mathematical truth.

Resolve the admission/presentation contract alignment at Plan 19's mechanism
gate before family source work. Plan 31 typography is independent and can be
the next UI assignment. The Phase 3 follow-up register retains non-Vue ownership,
guard coverage and evidence-capture improvements as bounded future work.
