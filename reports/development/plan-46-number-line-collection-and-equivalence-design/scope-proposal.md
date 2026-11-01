# Plan 46 Requirement 0: bounded scope proposal

Status: proposed for orchestrator approval; not a task adoption or implementation authorization. Inspected HEAD: `b7a24f8e0d7983f8a19d6f1a00b3b1b9bada6578`. Preflight `node scripts/dev/plan-status.js check 46` returned RUNNABLE. Three untracked Plan 39 route receipts predate this work and are outside its scope.

## Starting seams and evidence

- `src/render/number-line-locate.js` currently manages one preview candidate, visual token/stepper and linear radio choices; pointer movement resolves an offered candidate, and cancellation restores the previous candidate. Its preview key identifies scene context. These are one-label seams, not evidence of a ready collection control.
- `src/app/app.js` captures and restores a single opaque number-line draft across view lifecycle; the Plan 39 `maintainability-checkpoint.md` describes app-owned draft/reset timing, renderer-owned preview/geometry and task-specific help/focus wiring. The investigation must trace interaction/state, exact-math and progression ownership before proposing a collection contract.
- Plan 39's maintainability checkpoint records repeated active-view, geometry, focus and receipt-verifier failures, and recommends bounded verifier ownership when another representation needs it. Its final Repair 04 review, acceptance and walkthrough pilot need closer inspection; none establishes this new task's touch, assistive-technology or learner outcomes. Roadmap 32–37 requires purposeful number-line use and meaningful representation continuity, not a token switch solely to satisfy a milestone.

## Two alternatives to examine

1. **Select a member, then choose its location**: retain three distinct member identities and a partial placement map; offer drag/tap plus a non-drag location control for the selected member. Investigate tethered labels sharing an exact anchor, one aggregate Check, revision and deterministic restoration. Feasibility would be falsified if source tracing shows no bounded authoritative member/location state and intent seam without making render geometry decide truth, or if equal values cannot share one exact offered candidate while retaining independent identity. Paper layouts can also expose an unavoidable selection or reading-order ambiguity; actual usability remains untested.
2. **Member-by-member location controls shown together**: three independently labelled location selectors with a shared line as feedback, still one aggregate Check. Feasibility would be falsified if bounded offered choices cannot be associated unambiguously with each member and exact shared anchor, or if required controls cannot fit the proposed narrow layout without hiding or implying placements. Paper fit is not proof of device or assistive-technology usability.

Prefer alternative 1 provisionally because it keeps the learner's production on the line while retaining direct controls; choose after tracing actual seams and access/recovery obligations. Neither alternative assumes each source denominator is the line partition count. All-equivalent collections will be explicitly included or deferred with a reason.

## Fixed investigation boundary

After approval: read the packet-routed Plan 29, 37, 39, 43 and phase-3 obligations, relevant founding and Roadmap sections; trace current exact fraction, offered-position, episode, draft, help, replay and progression seams at the then-current HEAD; reconcile any concurrent interface changes. Produce one concise recommendation and 4–6 compact examples checked with existing deterministic exact APIs, plus explicit capability rejection cases and a branch-to-evidence plan. Reuse existing primary evidence; only seek targeted external evidence if a specific gap could change the decision. No prototype, browser run, app test/build, source or harness change. Stop if the source trace requires a broader scope or a load-bearing owner decision. A first implementation slice remains a recommendation for a separately gated packet. Advisor consultation is not warranted for this report-only investigation; any separately justified review requires orchestrator direction and current Terra-medium policy.

**Requested gate:** approve this bounded investigation, or direct a specific refinement before dossier expansion. Owner adoption remains separate.
