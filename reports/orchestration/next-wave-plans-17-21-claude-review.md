# Skeptical review: proposed next wave (Plans 17–21) — Claude reviewer

- Date: 2026-10-04
- Subject: the draft wave committed at `003cd2d` ("docs: draft next Phase 3 packet wave"): Plans 17–21, `roadmap-position-2026-10-04.md`, and the `session-handoff.md` update.
- Requested reviewer: Claude. The owner asked for Sonnet-class subagents if any were used.
- Identity observable at runtime: the Claude Code desktop harness reports the model as Opus 5.5 (`claude-opus-5-5`). I cannot verify that independently. **No subagents were used.** All reading, probing and browser checks were done in this one thread.
- Independence: I did not read the Gemini reviewer's file (`next-wave-plans-17-21-gemini-review.md` appeared untracked in the checkout during this review) or any earlier critique of this draft wave.
- Mutation: this report is the only file I wrote. I committed nothing, changed no status, and left the uncommitted Plan 11 work in the tree untouched.

---

## 1. Overall verdict

**Retain with changes. Keep Plan 17 first, and restructure the 18–21 tail.**

Doing crossing-one-whole first is defensible. It is one of the three practice types the owner named (Plan 12 §"owner has stated an intent", 2026-09-21). It reuses the accepted two-renaming arc unchanged, and DECISION-032 already settles its representation. I would not reorder it away from the front.

Before any of this wave is authorized, I would make four changes:

1. **Fix a confirmed, reachable defect in the existing practice before adding families.** In the "Less support" profile, a learner can type a valid common denominator that has no authored premise or reflection data, or that exceeds the bar's capability. Either way the episode reaches a dead end or throws at the reflection step, and the out-of-capability case is drawn by the bar anyway. Every proposed family multiplies this gap, and none of the packets' witnesses would catch it (F1).
2. **Get the owner's "what is a practice type?" decision before Plans 18–20.** As drafted, each of nested, shared-factor and like-denominator adds its own entry-page button. Principle 8, however, treats denominator relationship and renaming count as *dimensions of variation within practice*, and the owner named practice types at a coarser grain. Plan 21 owns that question, but it is sequenced last (F2).
3. **Name the concealed instructional work.** The reducer cannot finish any schedule other than two-renaming. Plan 20's scope omits that work, and Plan 18's rationale assumes Plan 17 generalizes family admission, which it probably will not (F3).
4. **Lift the two owner decisions out of the implementation chain.** Nested alternate-unit policy and practice-type/next-problem policy are docs-only and parallel-safe. Neither needs to wait behind source packets (F5).

None of these is a reason to discard the drafts. Most of their discipline is good (§5).

---

## 2. Findings, ordered by practical importance

Labels: **Confirmed** = reproduced or read directly in source. **Load-bearing question** = two plausible readings that need a decision. **Optional** = an improvement.

### F1 — Confirmed defect: valid denominators outside authored coverage or bar capability reach a dead end at reflection, and are drawn past the ceiling

**Evidence**

- In the browser, local Vite dev server, `#sum-under-one` with "Less support" and "Check the premise":
  - I entered denominator `36`, then `24/36`, `9/36` and `33/36`, all accepted.
  - The bars rendered with 36 segments each (aria-labels "24 of 36 equal parts…", "9 of 36…").
  - At reflection, the premise question appeared with no premise content. Both "Yes, it is the same amount" and "No, the amount changed" produced "Choose one of the options shown." **The episode cannot be completed.**
- Same path with "Smooth change" (CM-01-M): clicking Continue into reflection threw `Uncaught RenderContractError: linear matching requires at least three content-supplied choices` (`linear-path.js:632`). No reflection controls mounted. **Dead end.**
- Mechanism, at `003cd2d`:
  - `classification.js:104–109` classifies 36 as `valid-but-outside-representation-capability`.
  - `episode.js:355` marks the route `symbolic-continuation`. The committed bar guard (`fraction-bar.js:86–92`) has no denominator ceiling, so the bar draws anyway.
  - `premiseCheckForInstance` and `reflectionChoicesForInstance` return `null` for any denominator without authored data (`premise-checks.js:40–45`, `reflection-choices.js:49–54`). `classifyPremiseResponse` then returns `invalid-reflection-choice` for every answer (`classification.js:269–275`), and `beat-container.js` / `linear-path.js` throw `MISSING_REFLECTION_CHOICES`.
- The exercised files (`src/interaction`, `src/content`, `beat-container.js`, `linear-path.js`) are byte-identical to `003cd2d` in the working tree. The uncommitted Plan 11 diff does not touch the guard or the reflection paths.
- This violates `05-quality-and-validation.md` §46. That section says a valid-but-outside-capability case must not be "passed to an ineligible renderer", and must be tested separately from "outside the current episode's supported path".
- It is reachable because Plan 13 (accepted 2026-10-04) put numeric denominator entry behind "Less support". No route row types a non-authored denominator: all ten premise/support rows use 12 or 24.

**Why it matters for this wave**

- Plan 17 (`2/3 + 3/4`) and Plan 19 (`1/6 + 1/4`) inherit the out-of-capability case (36 and above).
- Plan 18's existing nested fixture (`1/2 + 3/8`) is worse. My engine probe shows 24 is *eligible and outside authored coverage*, so the dead end happens well inside the bar's capability.
- Plan 17's line "fail closed upstream … rather than clamp, shrink or truncate a stack" assumes a capability-refusal path that does not work today.

**Disposition**

- Before Plan 17, and before any release that ships Plan 13's "Less support", a small repair should decide and implement one policy for (a) eligible-but-unauthored and (b) beyond-ceiling denominators. Options include declining with honest feedback, a working symbolic continuation, or an authored generic check derived from exact math. The policy is an owner/mechanism decision. I am not choosing it here.
- Add a registry invariant: for each registered practice, every eligible valid denominator has authored data or is covered by the approved policy. Add one browser row per practice that types an out-of-coverage denominator.
- If the owner prefers not to add a packet, Plan 17 Requirement 0 must absorb this explicitly. The defect lives in the existing practice, though, so a separate repair is cleaner.

### F2 — Load-bearing owner decision: the wave makes each mathematical family an entry-page button before deciding what a practice type is

**Evidence**

- Plan 18 (scope "entry registry"), Plan 19 (checklist: "reachable from entry and recognized fragment") and Plan 20 ("entry registry … fragment launch") each register a practice type. The entry page shows one button per type (`practice-types.js`, DECISION-031).
- After Plan 20 the entry page would show five buttons, each running exactly one fixture.
- The owner's named practice types (Plan 12) are: sum below one, sum above one, and mixed numbers.
- `00-principles.md` §8 lists "relationships between denominators", "whether one or both fractions require renaming" and "whether a result crosses a whole-number boundary" as *meaningful variation inside a practice rhythm* ("theme → repetition → meaningful variation"), not as separate menus.
- §22.6 asks "What should disappear or become simpler if this is added?"
- The owner's standing preference is an uncluttered learner surface.
- Plan 21, which owns content selection and OQ-23, depends on Plans 17–20. So the button-per-family structure would be built before it is designed.

**Consequence**

- "Nested" and "shared-factor" are teacher taxonomy. A learner choosing between "nested-denominator addition" and "shared-factor addition" buttons is clutter, and it defeats Roadmap §30's variety goal: one fixture per button gives no practice variety, only "Try this problem again".
- Plan 19 in particular adds no new schedule, renderer, beat or condition behavior. Its whole learner value is a second problem with different denominators, which is exactly what OQ-23's "try another problem" would deliver inside the existing practice.
- Teacher-addressable links (DECISION-031) might justify some family buttons. The owner should make that call, not inherit it by default.

**Disposition.** Pull one narrow decision forward as a docs-only brief, parallel-safe with Plan 11: *is a practice type a learner-meaningful goal holding several vetted instances, or a mathematical family with one fixture?* Shape Plans 18–20 by the answer. If it is the former, Plan 19 becomes content within "different denominators", delivered with the next-problem increment rather than as a feature packet.

### F3 — Confirmed: concealed instructional work, and a mis-stated precursor

**Evidence**

- **Zero renaming (Plan 20):**
  - `state.established.commonDenominator` starts `null` (`episode.js:674`) and is set only by `handleDecide` (`episode.js:362`).
  - A schedule without `decide` reaches `handleOperate`, which dereferences `state.established.commonDenominator.targetDenominator` (`episode.js:408`) and throws `TypeError`. The same is true of `handleResolve` (`:432`) and `handleReflect` (`:465`).
- **One renaming (Plan 18):** `classifyOperationResponseForEpisode` parses both conversions (`classification.js:166–167`), so a `null` unrenamed side throws. The CM-01-M reflection target is `conversions.left` (`episode.js:495`), and the visual prompt always names the left operand (`beat-container.js`, matching branch). The mirrored case `3/8 + 1/2`, which Plan 18 requires, has no left conversion to reflect on.
- Plan 16's own delivery review (`reports/development/plan-16-computed-beat-schedule/delivery-review.md:25`) says synthetic one-sided and zero-renaming schedules "are configuration tests, not executable learner-family acceptance", and that operation prerequisites "remain later family work".
  - Plan 20's scope names "scene and renderer consumption of the existing zero-renaming schedule" and omits reducer changes.
  - Plan 18's Requirement 0 is framed entirely around the alternate-unit conflict.
- **Admission:** `assertInstance` admits by comparing against the Phase 2 constant (`episode.js:154–157`), not the supplied definition's selector. My probe constructs `2/3 + 3/4` (selector `relatively-prime-addition`, overlay `crosses-one-whole`) under the existing `phase-2-unlike-proper-addition` definition with no refusal. The only refusal is the renderer's guard.
  - So Plan 17 Requirement 0's "capture … construction refusal" describes something that does not exist at the instructional layer.
  - The legacy *proper*-addition identity silently admits improper-result content.
  - Plan 18's rationale, "Plan 17 establishes the new-definition admission/replay path", probably will not hold: Plan 17 can register a new identity without ever touching family admission.

**Disposition**

- Plan 17 Requirement 0 should record that construction is *accepted*, and decide whether definitions declare their admissible result range so the legacy definition refuses crossing content. The replay oracle covers only the canonical instance, so tightening it is low-risk; verify that.
- The first packet that lands a non-two-renaming schedule should name the reducer and reflection generalization in Requirement 0, including a common unit implied by the problem when there is no decide beat, an unrenamed operand, and a reflection subject that is not always "left".
- Correct Plan 18's dependency rationale.

### F4 — Load-bearing question (Plan 17): what is on stage at `operate`, and what non-visual learners receive

**Evidence**

- DECISION-032 constraint 1 dismounts the addend bars "on entering `operate`" and dedicates the stage to the stack. Constraint 3 forbids stating the total before the learner supplies it.
- Today the scene deliberately withholds result data until the operation is established. `wholeSpan` is `null` until `established.operation` exists (`scene.js:289–310`), and `operationMeaning` returns `rawResult: null` (`scene.js:563–573`). In the canonical episode, the learner sees the two converted addend bars at `operate` and combines them.
- Plan 17 Requirement 1 says "the countable visual quantity is allowed". Taken together, these imply a *new pre-answer projection of the combined quantity*. That changes the learner's `combine-like-units` responsibility (`episode.js:69`) from combining two visible quantities to counting a picture the system has already combined.
- The two-whole stack also reveals that the sum exceeds one. That is Roadmap §28's focused concept "determine whether a result should exceed one", although the button label already gives it away.
- Accessibility: Plan 17 withholds numerical readouts from accessible names. `05-quality-and-validation.md` §44, however, requires the accessible path to "preserve the same mathematical responsibility". A sighted learner can count segments. A screen-reader learner needs equivalent countable information (for example per-whole counts) that is not the total. Withholding everything breaks parity in the other direction.

**Disposition.** Requirement 0 should state this choice and show screens of the options, not settle it inside the implementation. Possible options:

- (a) A pre-answer combined stack, as DECISION-032's text implies, with addend contributions visually distinguishable.
- (b) Keep the two converted addend bars at `operate` and replace them with the stack only after the learner's total. This keeps the constraint's purpose (never four bars) but contradicts its literal timing, so it needs owner approval as a reading of DECISION-032.

Either way, specify the non-visual equivalent and add a witness that it neither states the total nor withholds the countable quantity.

### F5 — Sequencing: owner decisions are serialized behind source packets

**Evidence**

- The nested alternate-unit decision sits inside Plan 18 Requirement 0, so `depends_on: [plan-17]` makes it wait for Plan 17's full delivery and owner acceptance.
- Plan 21's decision brief waits for Plans 17–20.
- Both are docs-only and could run while Plan 11 holds the shared render files.
- The nested conflict is already reachable in the default "More support" profile, not just through typing. The existing curated fixture `curated-nested-addition` (`1/2 + 3/8`) authors 16 as its alternate, so `candidateDenominatorsForInstance` offers [8, 16]. "Less support" also admits 24 (probe: eligible, `outside-authored-coverage`).

**Disposition**

- Extract the nested policy brief now. Plan 18's two rivals are reasonable. Add a third that the roadmap itself supplies: make the nested decide-step "which fraction needs renaming?" (§28 focused concept 4), with the frozen schedule unchanged.
  - That keeps a real mathematical decision without rejecting valid denominators *as answers to a question that was never asked*, and without amending DECISION-034.
  - It does change the task, so it is the owner's call.
  - State the falsifier: a learner who would have chosen 16 is never given that opening, and whether that loses something the project values is an instructional judgment.
- Start the practice-type half of Plan 21 now (F2). The content inventory can still wait for accepted families.

### F6 — Gating: the wave has no release checkpoint, but Plan 17 needs one

**Evidence**

- Plan 17 depends on Plan 11 being `complete`. Plan 11's mechanism review keeps "deployed-URL owner acceptance" in force.
- By the local tracking ref (not refreshed in this review), `main` is 36 commits ahead of `origin/main` (`ef172ca`, Plan 14). Accepted Plans 12, 13 and 16 are undeployed.
- Every draft says "deployment separately authorized", but nothing schedules a deployment. Plan 17 therefore cannot start until an unscheduled owner action happens.

**Disposition.** Make an explicit, owner-authorized release checkpoint after Plan 11's technical acceptance and the F1 repair, before Plan 17. It also gives the owner a deployed build for the multi-browser check they ran at `b418e8a`, and for the optional high-school feedback exercise. This is a deployment gate, not an observation gate. DECISION-020 makes child observation non-blocking, and I am not proposing to change that.

### F7 — Optional (Plan 17 fixture and labels)

- `2/3 + 3/4` repeats the canonical decide step (3 and 4 → 12 or 24) and the canonical left conversion (2/3 → 8/12).
  - CM-01 reflection and premise data are keyed to the left operand, so the canonical facts for 2/3 are *true* for this fixture and could be reused verbatim.
  - Plan 17's "do not reuse false facts from the canonical episode" is therefore aimed at the wrong thing. The real requirement is to verify the facts per fixture.
  - The reflection would check nothing new.
  - The isolation is good engineering. Either accept the reuse explicitly or pick a fixture with a different left operand, keeping 2-whole geometry and no simplification beat.
- Next to a sum-above-one button, the existing label "Add fractions with different denominators" becomes ambiguous, since both use different denominators. Owner screen review should consider relabelling it.
- Plan 17's "Specify where quotient/remainder facts come from validated exact math": they already exist as `representationFacts.wholeSpan` (probe: `{lowerWhole: "1", upperWhole: "2"}`). Point the implementer there to avoid a second derivation.

### F8 — Witness gaps: tests that could pass while the product is wrong

- **Authored-path blindness.** Route rows type only canonical and authored denominators, which is how F1 survived Plan 13's review. Each family packet should add the F1 invariant and an out-of-coverage row.
- **Condition inapplicability (Plan 20).** For like-denominator content, all three display conditions act only on `transform`, and both connection-making forms check a renaming. All four registered conditions then produce identical episodes, and Plan 14's rule fails a route that matches its alternative. Plan 20 raises premise applicability but needs a route-contract policy for conditions that are legitimately inapplicable to a practice. Without one, someone will add surfaces to make the routes differ, which Plan 20 itself prohibits.
- **Target misconception.** For DECISION-016's learner, the important like-denominator error is adding across (`2/7 + 3/7 = 5/14`). Plan 20 says "arithmetic recovery" in general. Name this case as the required witness.
- **Plan 17's strong falsifiers** (one-whole truncation, resized second whole, pre-answer leakage) are well chosen. Add the F4 non-visual parity check and an out-of-capability denominator.

---

## 3. Preferred sequence

| Step | Work | Why here |
|---|---|---|
| 0 (now, docs-only, parallel with Plan 11) | **Brief A:** practice-type model (F2), the front slice of Plan 21. **Brief B:** nested decide-task / alternate-unit policy (F5), extracted from Plan 18 Requirement 0. | Owner decisions that shape later packets; neither touches source. |
| 1 | Plan 11 delivery and technical acceptance | Already underway; it owns `fraction-bar.js`. |
| 2 | **Repair: denominator coverage closure** for the existing practice (F1), plus a registry invariant and a route row | A confirmed defect in accepted code; every family multiplies it. |
| 3 | **Owner-authorized release checkpoint** (F6); Plan 11 deployed acceptance | Unblocks Plan 17's dependency; ships accepted work. |
| 4 | Plan 17, with an amended Requirement 0 (F3 admission facts, F4 operate/access options, F7 fixture note) | Owner-named practice type; reuses the two-renaming arc. |
| 5 | Like-denominator (Plan 20), with reducer generalization and condition-inapplicability policy named | First non-two-renaming schedule without the DECISION-034 policy conflict; OQ-21; the add-across misconception. |
| 6 | Nested (Plan 18), implementing Brief B | The decision is already made, so the packet is implementation, not deliberation. |
| 7 | Shared-factor and more instances, per Brief A (likely vetted content plus "try another problem" inside the existing practice: the Plan 21 follow-on) | Variety is the real Phase 3 §30 debt; avoids a taxonomy button. |

Steps 5 and 6 could be swapped. I prefer like-denominator first because it separates generalizing the reducer from the schedule-policy question. That ordering matters less than steps 0, 2 and 3.

---

## 4. Decisions that genuinely require the owner

1. **Practice-type model (F2).** Learner goals holding several vetted instances, or one button per mathematical family? Are teacher-addressable family links (DECISION-031) wanted?
2. **Nested decide-task policy (F5).** Canonical-unit-only with honest feedback, a general choice under an amended construction contract (this would amend DECISION-034), or a "which fraction needs renaming?" task. Any amendment to DECISION-034 is owner-only.
3. **Out-of-coverage and out-of-capability denominator policy (F1).** This is a learner-facing behavior change on the existing practice.
4. **Plan 17's operate presentation (F4).** A pre-answer combined stack versus the stack appearing after the learner's total. The second needs an owner reading of DECISION-032 constraint 1's timing.
5. **Release checkpoint (F6).** Whether and when to push. Pushing is deploying.
6. **Condition applicability (Plan 20).** What the reviewer gear means for a practice where its conditions do not apply.
7. **OQ-25 (outside this wave, but on the Phase 3 critical path).** Under DECISION-005, small-n observation can only *disqualify* a subtraction representation, never select one. If neither prototype is disqualified, OQ-25 needs an owner judgment, not more waiting. Half of §27 is subtraction, so the owner may want to name a date or criterion for deciding without observation.

---

## 5. What the proposal gets right and should keep

- **Investigate-and-stop at every Requirement 0**, with mechanism, technical, owner-screen and deployment gates kept separate. Observation is not claimed or invented, consistent with DECISION-020.
- **One practice increment per packet**, with "register only content that runs" and fail-closed capability language. This is the right lesson from `phase-2-unreachable-mechanisms.md`.
- **DECISION-032's four constraints carried as requirements**, including measuring under every condition with Replay active at both reference viewports.
- **The nested/DECISION-034 conflict surfaced honestly and not silently resolved.** It is real and reachable (F5 strengthens it).
- **Fixture choices that avoid smuggling in a simplification lesson.** `2/3 + 3/4` rather than the dossier's `7/8 + 3/8`, which combined zero renaming, crossing and reducibility.
- **Plan 21 as investigation**, with rival claims, falsifiers, discriminating cases, no generator activation and no efficacy claims. Its structure is good; only its timing (F2/F5) and dependency set need changing.
- **Plans 18–20 explicitly forbid** visiting hidden beats, auto-submitting conversions, and adding surfaces just to make support profiles look different.
- **The roadmap position's honesty**: one registered practice, a 39/41 route baseline to refresh, and Phase 3 "not near its exit gate".

---

## 6. Review coverage, checks run, and uncertainties

**Read in full:** `AGENTS.md`; Plans 17–21; `roadmap-position-2026-10-04.md`; `session-handoff.md`; `docs/development/README.md`; decision-log entries 005, 016, 020, 026–034; OQ-19 through OQ-26; Plan 10 `crossing-one-whole.md` and `sequencing-proposal.md`; Plan 11 `mechanism-review.md`; the relevant parts of Plan 16's `delivery-review.md`.

**Read at `003cd2d`:** `beat-schedule.js`, `episode-definition.js`, `episode.js`, `classification.js`, `support.js`, `eligibility.js`, `curated.js`, `premise-checks.js`, `reflection-choices.js`, `practice-types.js`, `support-levels.js`, the relevant parts of `scene.js`, `beat-container.js`, `linear-path.js`, `fraction-bar.js`, `app.js`, and the Plan 16 schedule tests.

**Read in part:** founding documents, by targeted section only: Principles §§8, 15, 22, 23; Roadmap §§8, 26–31, 89–91; Quality §§43–46. I did not read all 12k lines, and `packet-creation-guidance.md` only via its headings.

**Commands and checks**

- `git log`, `git status`, `git diff --stat`, and `git diff --quiet 003cd2d -- src/interaction src/content src/math` (unchanged); `git show 003cd2d:<file>` for source reads; `git rev-list --count origin/main..003cd2d` (36, by the local tracking ref, not fetched).
- `node scripts/dev/plan-status.js lint` → OK. `check plan-17` … `plan-21` → all BLOCKED (draft), as expected.
- A scratchpad engine probe (`probe.mjs`, outside the repo) against the pure modules:
  - `2/3 + 3/4` with the crossing overlay constructs under the Phase 2 definition.
  - The nested, like-denominator and shared-factor fixtures are refused (`UNSUPPORTED_CONTENT_FAMILY`).
  - Nested schedule and denominator eligibility: 8 canonical; 16 authored alternate; 24 eligible but unauthored. The mirrored renaming flags were also checked.
  - A typed 36 dead-ends at reflection in the pure reducer.
- Browser checks through the local dev server (`fractionflow-dev`, stopped afterwards), driven with real clicks and keys. Two F1 reproductions, under the premise and matching conditions. These ran on the working tree, which includes uncommitted Plan 11 work, but every exercised file is unchanged from `003cd2d`.
- **Not run:** `npm test`, `npm run build`, `npm run test:routes`. The shared tree carries in-progress Plan 11 edits to the route matrix and runner, so results would describe neither `003cd2d` nor a reviewed state, and this review does not depend on them.

**Material uncertainties**

- Plan 11 has advanced past `003cd2d` only as uncommitted work. I did not evaluate it. F3/F4's interaction with its final renderer is unknown.
- I did not check whether the deployed URL exposes "Less support". By the tracking ref, Plan 13 is not deployed, so F1 likely affects no live learner yet.
- F2 is a product judgment grounded in Principle 8 and the owner's named practice types. If the owner wants teacher-facing family links, separate buttons may be right.
- F4's two options are both consistent with *some* reading of DECISION-032. Only rendered screens and the owner can choose between them.
