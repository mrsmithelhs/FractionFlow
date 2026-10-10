# Plan 21 Implementer Retrospective: Revision Cost Evidence

**Purpose:** Report what Plan 21 does and does not show about understanding and maintaining FractionFlow. This is a retrospective from one documentation-and-analysis assignment, not a general codebase audit or a comparison of frameworks.

**Scope note:** Plan 21 made no production-code, test, or harness changes. It is therefore weak evidence about the relative maintainability of the JavaScript-rendered UI and a component architecture. The observations below concern the real work performed: tracing admission, producing bounded evidence, revising a proposal, coordinating owner gates, and handling a Git environment restriction. Any proposed improvement is labeled as speculation.

## Incidents

### 1. Establishing what “available problem” meant required following several separate layers

**Observed task and evidence.** I had to distinguish seven registered Phase 1 addition fixtures from the single problem actually admitted and reachable in the app. That required checking the fixture table and construction/validation path (`src/content/data/phase1-golden-cases.js`, `src/content/curated.js`), the practice registry (`src/app/practice-types.js`), representation eligibility (`src/content/eligibility.js`), authored premise/reflection data (`src/content/authored-task-data.js`), and the mounted-route evidence summarized in the Plan 25 artifacts. The resulting distinction is recorded in Plan 21's [content inventory](../../docs/development/phase-3-practice-variety-design/content-inventory.md) and [progress report](../development/plan-21-practice-variety-and-next-problem-design/progress.md). The inventory found all seven fixtures content-valid and canonical-path eligible, but only `2/3 + 1/4` had the authored task data and accepted app route.

**What made it harder / what was straightforward.** The code was understandable once each layer was located. The effort came from the admission contract being distributed across multiple registries and data tables; “valid fixture” did not mean “learner can select it.” The pure construction and eligibility functions made narrow read-only checks direct. No UI markup needed to be understood for this inventory.

**Classification.** This is evidence of a cross-module discovery cost and a product-admission distinction, not a confirmed learner-facing defect. The current restriction to one admitted item was intentional and documented.

**Retrospective speculation.** A read-only admission report that joins fixture identity, definition/revision, authored task-data coverage, representation paths, and route witnesses could make future authoring packets easier to scope. A content template could also prompt authors for the fields that currently live in separate places. Either could reduce repeated repository archaeology; this assignment did not implement or validate that improvement. A Vue component or smaller render modules would not address this particular cost.

**Evidence pointers.** Dossier commit `f8cbfa7`; final report commit `902800b`; current-at-the-time baseline `28c317d1f189748336f10f6520c810f2bd6e3732`. The dossier and report are historical snapshots; later Plan 26 work has since changed the learner set.

### 2. A generator probe was easy to express, but its output needed careful evidence labels

**Observed task and evidence.** To assess generated variety, I sampled 40 fixed seeds across four addition selectors and four allowed overlay combinations: 640 requested draws through `generateProblem`, `inspectCandidateSpace`, `validateProblemInstance`, and `evaluateInstanceEligibility`. Every draw generated and passed content validation; repeated numeric draws occurred, and some valid candidates were refused by the current representation capacity. The sample and bounds are documented in the [content inventory](../../docs/development/phase-3-practice-variety-design/content-inventory.md) and summarized in the [progress report](../development/plan-21-practice-variety-and-next-problem-design/progress.md).

**What made it harder / what was straightforward.** The deterministic pure APIs made the probe straightforward to structure. The reasoning burden was classifying outcomes correctly: a generator refusal, a valid draw, a representation-path refusal, and a missing authored lesson are different results. The advisor later flagged wording that risked conflating generation failure with representation capacity; I rechecked the sample and corrected the report. This was an evidence-presentation defect, not a failure of the generator. The probe was ephemeral; no reusable script was retained, so another investigator would need to reconstruct it from the documented parameters.

**Classification.** The sample exposed a limitation of treating generated mathematical instances as learner-ready content. It did not expose a defect in the current learner app, and it did not test mounted routes or learner outcomes.

**Retrospective speculation.** A reusable analysis command that emits separately labeled generation, content-validation, representation-eligibility, and authoring counts could reduce both manual summarization and category errors in future capacity studies. A test harness would help only if a later packet needs repeatable regression coverage; Plan 21 did not call for tests. This probe does not justify replacing the app's UI architecture.

**Evidence pointers.** `f8cbfa7` and `902800b`; probe details and explicit non-claims are in [content-inventory.md](../../docs/development/phase-3-practice-variety-design/content-inventory.md).

### 3. Advisor review found proposal gaps that a reusable contract checklist might have caught earlier

**Observed task and evidence.** The first complete dossier needed a concrete candidate order and clearer handling for settings or task dimensions that do not apply, focus destinations on Retry/Next/exhaustion/refusal, and separate labels for generator failures versus representation refusals. The read-only advisor identified these five issues; I independently checked them and revised the dossier. The accepted findings and changes are itemized in the [Plan 21 progress report](../development/plan-21-practice-variety-and-next-problem-design/progress.md). The dossier was committed as `f8cbfa7`; review clarifications followed in orchestrator commit `8074ce8`.

**What made it harder / what was straightforward.** A fresh reviewer was useful at checking whether the proposal was complete as a contract. The issues were visible in the written tables and could be repaired without touching app code. They were omissions or ambiguities in the proposal and evidence language, not discovered UI defects. Focus review here specified future witnesses; no real browser gestures were run for Plan 21.

**Classification.** This was missing verification/design evidence at the proposal stage. It is not evidence that the existing rendering modules are inherently hard to change.

**Retrospective speculation.** A lightweight “selection and transition contract” template could prompt for candidate order, applicability, identity, focus, exhaustion, refusal, and evidence boundaries before advisor review. Better implementer instructions might also ask authors to distinguish an inapplicable option from missing/corrupt authored data. These would likely reduce review rework on similar packets; this one dossier is not enough to prove the benefit.

**Evidence pointers.** Advisor disposition and changes in `reports/development/plan-21-practice-variety-and-next-problem-design/progress.md`; orchestrator review commit `8074ce8`; dossier commit `f8cbfa7`.

### 4. Owner/orchestrator clarifications changed how the proposal framed the follow-on work

**Observed task and evidence.** During the investigation, the orchestrator clarified that the follow-on packet could author the second candidate and implement selection together, as long as complete admission happened before learner exposure. Other clarifications distinguished goal-model alternatives from a staging variant and retained reviewer selections when a setting dimension was inapplicable. Those instructions changed the way the dossier framed a non-circular next step and its comparison. The conversation record contains the follow-up messages; the resulting scope is reflected in `8074ce8` and the dossier/progress artifacts.

**What made it harder / what was straightforward.** This effort came from resolving owner policy and packet sequencing, not from tracing app code. The precise owner gate was necessary because Plan 21 was intentionally investigatory and could not decide product policy. Once clarified, it was straightforward to state the admission-before-exposure boundary. The work did not establish that all of the broad 640-draw analysis was necessary to add a second authored item.

**Classification.** This is approval/scope overhead rather than a software defect or missing UI verification. Some clarification is inherent in owner-controlled product decisions; treating it as a code-architecture problem would be misleading.

**Retrospective speculation.** Starting prompts could state the non-circular rule more prominently: a follow-on may author and admit a candidate while building the selection path, but may not expose it until admission is complete. A decision brief that names the exact alternatives under owner review could also reduce back-and-forth. Instructions cannot remove the need for owner judgment, and the Plan 21 record alone cannot establish how much coordination would have been avoided.

**Evidence pointers.** FF Impl 21 conversation `01a123b0-9a9e-7792-b061-fe53e579ab71`; orchestrator review commit `8074ce8`; owner disposition and Plan 26 contract are recorded later and are not evidence that Plan 21 itself implemented selection. Plan 21 commits: `f8cbfa7`, `902800b`.

### 5. Git staging hit a managed-Windows metadata boundary

**Observed task and evidence.** Ordinary `git add` failed with `.git/index.lock: Permission denied`. I verified that no lock file existed, inspected the effective identity and `.git` ACL, and tried the repository-prescribed harmless `git add --refresh -- .` probe; that also failed. A narrowly elevated explicit-path staging/commit succeeded. The commands and outcome are recorded in the Plan 21 progress report. No application files or permissions were changed to work around it.

**What made it harder / what was straightforward.** This added a separate environment-diagnosis and retry step after the documents were ready. It had no relationship to source layout or rendering. The repository guide gave a safe procedure, and the scoped elevation resolved it without removing a lock or altering ACLs.

**Classification.** Environment/tooling friction, not a product defect, maintainability issue, or test-harness failure.

**Retrospective speculation.** A clearer platform message or supported narrow Git-metadata write path could make this less surprising. Moving to Vue, splitting render modules, or changing tests would not help.

**Evidence pointers.** Plan 21 progress report, “Scoped Git metadata write” row; dossier and report commits `f8cbfa7` and `902800b`.

## Overall reading

Plan 21 gives modest evidence that the pure content APIs are understandable enough to support a bounded read-only analysis. It also shows a real discovery cost when deciding whether a fixture is actually admitted: relevant facts are distributed across content, practice, authored-data, representation, replay, and route artifacts. It provides no valid comparison between the current JavaScript-generated markup and Vue or another UI architecture, because I did not implement a UI change, debug a mounted state/DOM lifecycle, or run browser routes in this packet.

Of the recorded effort, the clearest maintainability opportunity suggested by this assignment is an explicit, reusable admission inventory and better packet templates for evidence/transition contracts. The probe itself was enabled by small deterministic functions. The Git issue was environmental; owner policy work was governance; neither should be counted as UI revision cost. These are leads for the broader review, not architecture conclusions.

## Validation and boundaries

- This report is based on the Plan 21 task history and its committed dossier/progress report, plus current source locations used to identify the code paths. It does not reconstruct wall-clock time or token usage.
- Plan 21 preflight and packet lint passed at the time; no application tests or browser routes were run because the assigned work was docs-only.
- No production changes, tests, dependencies, packet-status changes, commits, or pushes were made for this retrospective.
