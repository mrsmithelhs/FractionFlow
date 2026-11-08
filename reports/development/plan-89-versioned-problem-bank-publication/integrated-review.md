# Plan 89 — integrated publication review

**Technical delivery for orchestration and owner review.** The Plan 40 pilot was accepted by orchestration; the three mixed-number banks are now registered as revision 2 and remain held out of the default chooser. These are fixed registration sequences, not evaluated instructional progressions. No expanded set is currently offered by the ordinary chooser. No deployment or Plan 87 draw/scheduling change is included.

## Exposure ledger

| Family | Previously staged additional items now registered | Registered expanded set | Ordinary chooser today | First new position if whole expanded set is later activated |
|---|---:|---|---|---:|
| Plan 40 unlike subtraction | 13 | v3, 30 | v2, 17 | 18 |
| Plan 74 regrouping addition | 28 | v2, 30 | v1, 2 | 3 |
| Plan 78 subtraction without decomposition | 26 | v2, 30 | v1, 4 | 5 |
| Plan 82 subtraction with decomposition | 26 | v2, 30 | v1, 4 | 5 |

The registered totals include the unchanged historical prefixes. “Staged additional” is a count of the previously accepted candidates now registered, not an extra unregistered pool. The held chooser means none of these newly added IDs is default-reachable. A future default activation would make each fixed run 30 items and needs separate approval; a short-draw mechanism is Plan 87 work.

## Replay and exact records

The new v2 lists are explicit frozen memberships of the 30 existing authored records, with the exact v1 prefix. Each family retains the v1 export used by the default chooser. App launch and v17/v18/v19 replay now forward the set ID and revision to family resolvers; existing envelope schemas, episode definitions and representation bounds are unchanged. Completed pre-change witnesses including help and learner actions were captured at `cd4c60f086805eff6737e9cfa831c9c8337a71c9`; [mixed-baseline-oracles.json](mixed-baseline-oracles.json) is frozen. `plan89-mixed-replay.test.js` reconstructs each historical state exactly, completes and round-trips every one of the 90 v2 records, and rejects wrong sets, revisions, item membership and tampered reconstruction identity. V1/v2 carried-forward item identities are intentionally distinct even when the operands match.

Each family has 30 distinct operand pairs under its staged family key (unordered for Plan 74 addition, ordered for Plans 78 and 82 subtraction). [Mixed inventory](mixed-inventory.json) records repeated results: Plan 74 has 9 zero and 21 nonzero fractional remainders; Plan 78 has 3 zero and 27 nonzero; Plan 82 has 30 nonzero fractional remainders, consistent with its required decomposition. Repeated results do not imply duplicate operand pairs or validated educational variety. All admitted records remain within their existing response and representation bounds.

## Mounted evidence

[The v2 witness](mixed-mounted-witness.mjs) mounts a separate report-local app through the real `createFractionFlowApp` injection seam, using actual v2 records and ordinary chooser, resolver, renderer and controls. Chrome traversed all 30 items of each family twice: 360×740 visual and 1093×740 linear with root text enlarged to 200% by CSS. In each it observed the old-to-new boundary, fresh draft, wrong-answer recovery on the first new item, all items' accepted answers, final “Back to start,” and return. [Observations](mixed-mounted-observations.json) and first-new/end screenshots record the six runs. Zero and nonzero results and repeated results appear in these full traversals. Separately, [the default-app witness](mixed-default-observations.json) used the normal Vite entry and chooser and completed the unchanged 2/4/4-item v1 sets to their real end. Neither harness adds an app route to the production build. Actual browser zoom, physical devices, screen-reader speech and learner outcomes were not tested; CSS enlargement is not browser zoom.

Plan 40's separate [pilot review](pilot-review.md) records the v3 visual/linear journey, historical replay, the three cleared cross-family overlaps, and eight isolated protected-route checks. Existing authored sessions and scheduler settings were not edited; the full suite includes their tests, but this report does not claim an additional end-to-end journey for every protected route.

Final validation after tightening explicit identity: `npm test -- --maxWorkers=1` passed 95 files and 726 tests; the seven focused mixed-family files passed 31 tests; `npm run build` passed with the existing large-chunk warning; packet lint and scoped diff checks passed. The final browser runs were repeated after the identity change. There are no Plan 74/78/82 route-matrix rows under those plan IDs; the mounted real-control journeys above cover those families rather than asserting a route-matrix run. The first baseline capture attempt requested the wrong Plan 82 help kind and failed before writing; after correcting it to renaming help, all three completed witnesses captured and replayed exactly.

## Remaining Plan 85 families

The smallest next step for unlike addition is a fixture/legacy identity and versioned replay proposal; like addition needs a reusable-recipe and replay investigation. Like subtraction needs a versioned design for its fixed-eight materializer. Symbolic comparison needs revisioned membership preserving its fixed batch and optional help; collection, distance and directed endpoint each need their own historical-membership and replay proposal. Bar-to-line, two-whole location and whole-plus-fraction construction have documented current representation ceilings and require separate scope decisions before expansion. Mixed addition without regrouping needs a versioned data/admission seam; the mixed-to-improper bridge has four staged records and seven distinct amounts within current bounds, with any wider representation separately gated. See the accepted [Plan 85 owner packet](../plan-85-cross-recipe-problem-bank-expansion/owner-review-packet.md) for family-specific counts and limitations; these are next-step recommendations, not authorization to modify them.

## Review and limits

Three Luna-medium workers handled disjoint family source/test files sequentially, without copied-source writes or fan-out; the lead integrated shared app/replay wiring, replaced a data-derived Plan 74 list with fixed membership, checked the Plan 78 revision-stamping issue identified by orchestration, and ran integration evidence serially. Final review also tightened incomplete explicit set identities to fail closed; older calls that omit the entire identity retain v1 behavior. Requested worker model was selected in the tool but not independently self-reported. No higher-tier advisor consultation ran; the behavioral delivery uses **orchestrator-gate-only** review. Orchestration and owner rendered review remain required. Pre-existing Plan 39/40 evidence modifications were left untouched.
