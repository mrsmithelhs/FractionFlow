# Short composed magnitude practice: proposed design

2026-11-02 · Report-only investigation · Source baseline `142dcfbb99856386f966863a33fb61ce293a0aa1`; orchestration scope approval is `scope-approval.md`. The proposal and exact probe were checkpointed at `4122f6b`. Neither the composition, its dose, nor source implementation is adopted. This is one candidate, as expressly allowed by scope approval; no second composition is needed to fill a comparison quota.

## Purpose and eligibility

Offer a learner who already understands fraction comparison, equal-sized parts, equivalent fractions and subtraction as distance a short optional practice: make relation judgments, then use a relation for a new pair to find the distance between its amounts. Familiarity with the existing response controls and help is assumed, not inferred from app data. This is not an introductory lesson, a placement decision, a universal dose, or evidence of mastery or transfer. Keep the existing independent first-visit practice entry available.

The accepted candidate inventory is broader than this selection. Plan 45/49 comparison admits proper positive fractions with source denominators at most 10 and offers optional comparison construction; Plan 51 distance admits unequal proper fractions in matching sixths or eighths and requires compare then distance. Plan 50 asks for three positions together on an admitted [0,1] lattice, including equivalence; Plan 53 locates a fraction across [0,2] then verifies with equal-unit bars. Plan 29 adopted a design direction; the implemented Plan 35 addition and Plan 40 subtraction recipes offer distinct responsibilities on their own admitted records, including construct, inspect/repair and side-selection variants where supported. These are not interchangeable responses or support capabilities. They remain candidates for separate considered sessions, subject to their own admission checks, not automatic members here. Plans 54–56 provide no prerequisite draft or adopted session member.

## One four-episode pilot

| Order | Existing identity and raw forms | Exact API result | Intended continuity and change |
|---|---|---|---|
| 1 | Plan 45/49 `plan45-compare-02`: 5/8, 3/8 | `>` | Familiar same-unit relation, with the first amount greater. |
| 2 | `plan45-compare-08`: 3/8, 5/8 | `<` | Same eighths and amounts reversed; the direction must be considered again. |
| 3 | `plan45-compare-11`: 4/8, 1/2 | `=` | Still compare magnitude, but written source units differ and equality is now the answer. This is a meaningful change, not the same denominator relationship. |
| 4 | Plan 51 `distance-01`: 2/8, 6/8 | `<`; distance 4/8, range 2–6 eighths | A new, unequal same-unit pair. Its own comparison is made once, then retained while the learner gives a distance. The previous equality is neither reused as the new answer nor repeated as a question. |

Record contexts and exact math were resolved using the existing APIs in `evidence/record-probe.mjs`, not mental arithmetic. The Plan 45 record set is `symbolic-fraction-comparison-vetted-set@1`, recipe `symbolic-fraction-comparison@1`; the underlying Plan 45 context is definition revision 1, while the live Plan 49 comparison context/episode definition is revision 2. Distance is `fraction-distance@1`, `phase-4-fraction-distance@1`, `common-unit-distance@1`; original ordered forms and record revision remain part of identity. A record resolver accepting each record does **not** prove that a cross-type manifest or its launch currently exists. The full Plan 45 registered batch is twelve ordered records; these four session references do not change or claim to be that batch. The per-episode compare→resolve and compare→distance→resolve schedules remain intact; a session selects episodes, never omits beats.

The first two offer a small stable run; the third tests the proposal's ability to accommodate equivalence in the familiar relation task, and the fourth deliberately changes the responsibility to measuring a gap while returning to eighths. Equality to unequal values, different to common source units, different task-specific help, and an added fractional response are real changes. This is not a single-variable experiment. In particular, the third-to-fourth jump might be too abrupt; remove or move the equality episode, or shorten the pilot, only after owner choice and evidence, not automatic adaptation. Three earlier episodes do not establish stabilization. Four is merely a testable, bounded initial dose; actual learner observation may show fatigue, confusion, insufficient practice, or a better stopping point. No mandatory mixed retrieval, prediction of effectiveness, streak, points, countdown or pressure is proposed.

At the accepted third result, the action may say **“Next: compare and find the distance”**. It leads directly to the new task and its existing first comparison prompt, without an intermediate page. The new pair is visibly new; the existing distance prompt then asks for its distance after its relation is accepted. This cue is proposed copy, not a new extra mathematical question. Review whether the label is concise and truthful in rendered context. Retain Plan 52 feedback and the task's own accepted result; no duplicate instructions or empty Finish.

## Session contract to evaluate in a later source packet

Entry says **“Compare fractions, then find a distance.”** Offer start and an ordinary route back to existing practice. Four ordered entries are authored and reproducible; no seed or selection algorithm. Preserve learner-selected More/Less support as a fixed explicit episode configuration where each task supports it. Both task implementations admit the existing high/medium profiles, but their actual cues and help are task-specific: Plan 49 optional common-denominator construction is not a promise that Plan 51 offers it; Plan 51 has its own comparison/model and distance help, with a supplied distance cue at high support. Do not silently substitute a capability, switch support based on performance, or label a supported response independent. Keep access/view choice and reduced-motion behavior through transitions, and focus a meaningful new task heading or first appropriate control; confirm exact focus targets and announcements in rendered review.

On incorrect or incomplete submission, preserve current episode identity, entered work as supported by the task, task-local help and correction. A retry is work on that same record and stage; distinguish this from the existing explicit restart/reset of the current episode, which clears that episode's work but does not select a new record. Accepted work remains inspectable. Deliberate Next prepares the next record and only installs it after successful preparation; then its fresh task state owns its own identity. Do not force an automatic advance. After the fourth episode's accepted result show one modest acknowledgment and **“Back to practice”**, with the result still available until return; no empty Finish or fake Next at exhaustion. A new session entry starts at the first record, with no learner history inferred.

An ordinary early exit is always available, without penalty or a completion claim. Before a destructive in-tab exit, use a concise warning only where needed: **“Leave this practice? Your place will not be saved.”** with **“Stay”** and **“Leave”**. Keep the current episode and draft if Stay is chosen. Tab close, browser reload and external navigation cannot reliably be intercepted; explain the loss at entry or exit rather than promising a browser warning. The proposed session index, task state and unsent drafts live only in the active tab; reload, closing it or leaving the session loses them. Returning starts the deterministic sequence from the beginning. No session storage, localStorage, profile, analytics, account or silent durable resume is introduced. Existing browser/system access preferences are separate from session progress; do not claim this proposal changes their current persistence.

If destination preparation fails, retain the accepted old result and index, disclose **“The next problem could not be opened. Try again or return to practice.”**, and keep a safe retry/return route. Do not advance the index, clear state or silently skip. Stale actions from a prior episode must be refused. Once the session returns or resets, invalidate its controls. If there is no next entry, render the final return rather than treating normal exhaustion as an error.

### Two proposed journeys

1. The learner starts, chooses a relation for 5/8 and 3/8, corrects an incorrect choice in place, and sees acceptance. Next opens the reversed pair; then equality. The third accepted screen's forward label names the coming distance. The new pair receives its own relation response, followed by the distance response and accepted result. The learner reads the acknowledgment and returns. Help requests and response provenance remain attached to their original episodes; this journey is a design, not an observed walk.
2. The learner opens optional comparison help during the second pair, enters an unfinished response and selects Leave. The warning offers Stay or Leave. Stay preserves the active work; Leave returns to practice and discards the session. On a later fresh start, the first pair returns. A reload during the distance episode likewise loses its unsaved position and drafts, with no restoration claim. An unexpected destination failure leaves the prior accepted result visible and offers retry or return.

### Unmeasured layout sketches

Narrow viewport, reflow vertically (not a rendering or accessibility test):

```text
Compare fractions, then find a distance     [Leave]
Compare these fractions
        4/8     [ <  =  > ]     1/2
[Help]                       [Check]
Accepted result
[Next: compare and find the distance]
```

Chromebook-width distance stage, same semantic order, space permitting:

```text
Compare and find the distance                      [Leave]
2/8  <  6/8  (your accepted comparison)
How far apart are the amounts?    [numerator / denominator] [Check]
[Help]             [optional model/linear controls where provided]
```

Sketches are schematic copy and layout targets, not literal finished component specifications. Preserve each existing stage's withholding, task-specific labels and controls. Check reflow, zoom, touch, keyboard, screen-reader focus and announcements in future rendered work; no claim of physical-device or assistive-technology verification follows here.

## Minimal source recommendation and missing contracts

Consider one versioned authored manifest consisting only of an ordered list of four references: practice type, original set and revision, record and revision where applicable, definition and revision, recipe and revision, and explicit supported configuration. Reference the existing authoritative registries; do not copy truth, alter raw forms, invent record IDs, renumber replay schemas, or treat a selected subset as the original full set. Fail closed on unknown/stale/mismatched references and unintended duplicate identity. Reconstruct the identical ordered list from the manifest; no random seed or adaptive mechanism. Preserve each episode's own context, task-local state, response/help provenance and historical replay envelope; session navigation is separate ephemeral orchestration and is not a new mastery record. Exact serialization and migration of any future session identity require a separate gate.

`src/app/practice-types.js` registers comparison and distance as separate types and full ordered sets; `src/app/app.js` resolves the task-specific contexts in `createInitialState`, and `prepareProgressionTransaction` advances an index within one `practiceType.items` array. Its prepare-before-install, exhaustion, failure and generation protections are relevant precedents, not proof of cross-type support. A new small session-level admission/launch adapter and index contract would need to select each referenced type and create a fresh episode, preserve the old accepted state until destination preparation succeeds, and distinguish normal final return from failure. Do not force a mixed list into a single existing set or replace task state with a session record. Resolve how UI exposes entry, exit and transition cue; how explicit restart differs from fresh session; how access/focus and support are carried truthfully; and how episode replay remains independently valid. These seams require source inspection and a separate approved implementation packet, not a universal curriculum engine.

## Branch-to-evidence plan and falsifiers

| Branch / claim | Minimum later evidence and failure condition |
|---|---|
| Manifest admission and stable reconstruction | Exercise all four actual registered references, revisions, configuration and repeated reconstructions; reject altered/unknown reference and unintentional duplicate. Failure: changed or unregistered content launches or order drifts. |
| Episode and task integrity | Assert original context/provenance and each complete beat schedule, task-local help and support; check same-unit and equality rules. Failure: skipped comparison/distance, changed raw form, unavailable help promised, or assisted work relabeled independent. |
| Retry, restart and Next | Check wrong and incomplete responses retain current identity; explicit restart freshens only current episode; correct response stays until deliberate Next and creates exactly the next identity. Failure: auto-advance, state loss, duplicate/skip, or stale callback mutation. |
| Transition and final stop | Inspect the equality-to-new-pair cue, one comparison on that new pair, accepted distance, final acknowledgment/return and exhaustion. Failure: surprise or duplicate comparison, empty Finish, fake Next, or missing result. |
| Exit, reload and navigation failure | Exercise Stay, Leave, reload and failed destination preparation; monitor session-related durable writes. Failure: lost work on Stay, old result lost on failure, silent resume, incorrect continuation or durable session progress. |
| Access and presentation | Render visual/linear, keyboard, focus and announcements, zoom/narrow and reduced-motion paths; inspect task-specific support. Failure: lost focus, unreachable action, misleading support or clipped/duplicated instructions. Sampled browser evidence is not proof of physical devices or real assistive technology. |
| Learner experience | Later appropriately authorized observation of complete runs and early exits can assess burden, transition comprehension and finishability; independent follow-up would be needed for retention. Failure signals can motivate revision, but completion, synthetic tests and owner inspection do not establish learning or retention. |

## Evidence limits and owner choices

Founding instructional model §§29–30 calls for focused practice before heavy interleaving; interaction grammar §58 and Roadmap §§51–58 describe variable rhythm and a natural close, not a numeric dose. Quality §89 calls for review of a complete session. These project design principles are not a study establishing that this exact sequence works. No new literature search was authorized or needed to state this bounded hypothesis; no spacing/interleaving efficacy claim is made. The probe verifies deterministic context resolution and exact math only, not a mounted session, episode replay, accessibility or learner effect. Its first execution failed due to an incorrect relative import; fixed and rerun successfully.

Owner decisions for a later gate: (1) purpose/prerequisite and eligible task pool; (2) these four records and pilot dose, including whether the equality jump earns its cost; (3) transition wording and truthful task-specific support; (4) early exit, reload loss, fresh entry and final acknowledgment; (5) the minimal session manifest/launch subset and its evidence before any source packet. Plan 54 may later inform a separately adopted construction extension; Plan 55 may later inform representation continuity; Plan 56 may later address support semantics. None blocks this dossier or supplies an assumed decision. Paper approval does not close Phase 7, authorize Phase 8 progress persistence, source work, release or deployment.
