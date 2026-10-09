# Independent review — next wave after Plan 24 (reviewer: claude)

Date: 2026-10-07. Review of `reports/orchestration/next-wave-after-plan-24-proposal.md`.
Advice only: this report does not amend owner policy, initiate packets, approve source
mechanisms or authorize deployment.

## Reviewer identity and repository state

- **Runtime identity:** this session reports itself as Claude Code running model
  `claude-opus-5-5` (Opus 5.5). That is what my runtime states. I cannot verify it
  independently.
- **Delegation.** Four read-only helper agents were used. Three Sonnet "explorer" agents
  covered: the code needed for Next and selection; the Plan 24/25 mechanism and approval
  records; and the text of Plans 17–20, 23 and the follow-up register. One Haiku
  "researcher" agent covered Chromebook screen and zoom facts. These models were
  requested, not verified. I re-checked every load-bearing claim myself against the files.
  The findings below say which facts I checked directly.
- **HEAD at start and end:** `39a7672` ("test: capture Plan 25 legacy replay baselines").
- **Proposal file:** unchanged since `79c6666`. `git diff 79c6666 --` shows nothing, and
  that commit is the file's only one. Commits after it (`8fbebe2`, `1ffe66f`, `cfbfc7e`,
  `39a7672`) belong to the Plan 25 gate and baselines. They are not part of the proposal.
- **Working tree (another agent's in-flight Plan 25 work, left untouched).**
  - At start: modified `src/app/app.js`, `src/interaction/{classification,episode-definition,episode,provenance,scene}.js`,
    `src/render/{beat-container,controls,linear-path,strings}.js` and `tests/app-shell.test.js`;
    untracked `tests/plan25-task-help.test.js`.
  - During the review, `tests/route-contract.test.js` and `tests/routes/route-matrix.json`
    were also modified, and a Plan 25 evidence script appeared. Final state is recorded
    in §7.
  - I treat all of this as unreviewed in-flight work. Where code mattered, I read the
    committed version (`git show HEAD:<path>`) or files the tree had not modified.
    One helper agent read working-tree copies of the modified files; I re-checked its
    load-bearing claims against HEAD or against unmodified files.

---

## 1. Overall verdict

**Keep the direction, but resequence and re-scope.** The proposal correctly finishes
Plan 25, puts selection and Next ahead of more one-problem demonstrations, and keeps the
remaining Phase 3 work in view. It does not record three facts that change how the wave
should be cut:

1. **Next needs a set of problems, and today's code supports only a narrow one.**
   - Under current limits, only **9** relatively-prime, proper-result addition problems
     (today's 2/3 + 1/4 included) have both high-support denominator choices available.
   - They use just four denominator pairs: (2,3), (2,5), (3,4), (3,5).
   - Each new problem needs hand-written reflection and premise data for two denominators.
   - So Next will first give *repetition of one problem type*, not *variety*. That is
     useful, but it should be named honestly.
2. **Shared-factor and nested content can only reach learners through a selection
   mechanism.** DECISION-035 says these are variations inside a goal, not new buttons.
   But a practice type currently holds exactly one `fixtureId` and one episode definition.
   - So Plans 19 and 18 depend on Plan 26 for learner reach. The proposal does not say so.
   - If Plan 26 is built for a one-definition set, Plans 18 and 19 will have to rebuild it.
3. **Plan 27 (Chromebook capacity) targets the wrong limit.**
   - The bar area has a fixed CSS maximum width of `48rem`. A Chromebook in landscape is
     wider than that, so device width does not change bar size there.
   - What limits denominators in a single device-independent policy is the 360px phone
     floor, plus Chromebook *viewport height*.
   - The repository's "360×752 Chromebook reference" is portrait-shaped. It does not
     represent a landscape Chromebook screen.

A smaller instructional point: the approved Plan 25 wording, "Multiply the top by 8, too,"
is the shortcut that Principle §4 says should come *after* meaning. A one-phrase,
unit-language version fits within the approved mechanism (Finding 5).

---

## 2. What should remain unchanged

- **Finish Plan 25 before any new learner-source packet.** Its approved mechanism avoids
  asking for the numerator twice (`mechanism-review.md:11-16`). It separates scoped task
  help from generic help escalation (`:20-28`) and pins legacy replay with full-state
  oracles before any change (`:61-66`). That is sound engineering.
- **Next before family expansion.** DECISION-040's authored set and learner-triggered
  Next is the right first step for variety. Its contract — Retry keeps the problem, Next
  changes it, no automatic advance or persistence — is right as written.
- **Plan 21 as a docs-only investigation now.** All its dependencies are complete. It
  needs only owner initiation (`plan-status.js check plan-21` reports draft status,
  not blocked dependencies).
- **No generator activation, adaptive selection, sessions or progress** in this wave.
- **"Acceptance discipline learned from Plan 24"** (proposal lines 78–93). This is the most
  useful part of the proposal. Keep it, with the additions in Findings 4 and 9.
- **Plan 23 stays independent and off the learner path.**
- **Refreshing stale draft prose before assigning.** I confirmed the staleness:
  - Plan 17 lines 45–47 still say Plan 11 owner acceptance is pending and describe
    Plan 22 as an upcoming repair.
  - `phase-3-follow-up-obligations.md:5` still calls Plans 24–25 drafts.

---

## 3. Prioritized findings

Severity scale: **High** = would cause rework or a misleading claim if not settled before
drafting. **Medium** = should be settled before source approval. **Low** = clean-up or
watch item.

### F1 — Next will give repetition, not variety, unless the candidate pool is stated and planned for
**Severity: High (proposal defect). Confidence: high.**

**Evidence**
- Practice registry: `src/app/practice-types.js:7-14` (HEAD) has one type and one
  `fixtureId`.
- The episode refuses any family other than `relatively-prime-addition`
  (`episode-definition.js:28` selector; agent-cited `episode.js:157-160`). The profile
  pool is {2,3,4,5,6,7,8,10,12} (`src/content/profiles.js:24`).
- Bar limits are denominator ≤ 30 and scale factor ≤ 12 (`src/content/eligibility.js:17-23`).
  The alternate denominator is always 2 × LCD (`src/content/analysis.js:121-131`).
- High support needs two eligible candidates; with fewer, it falls back to typed entry
  (agent-cited `eligibility.js:214-216`, `scene.js:569-574`).
- Reflection and premise data exist only for 2/3 + 1/4, at 12 and 24
  (`src/content/data/reflection-choices.js:10-41`, `premise-checks.js:11-34`). There is
  no fallback.

**What I verified**
- I ran a read-only probe through the real `validateCuratedFixture` and
  `candidateDenominatorsForInstance`, without registering anything.
- **110** proper-result relatively-prime problems validate as fixtures.
- Only **9** have two eligible denominator choices:
  - 1/2+1/3
  - 1/2+1/5 and 1/2+2/5
  - 1/3+1/4 and 2/3+1/4
  - 1/3+1/5, 1/3+2/5, 1/3+3/5 and 2/3+1/5
- In those 9:
  - The least common denominators are 6, 10, 12 and 15.
  - The scale factors are 2–5.
  - The common denominator is always the product of the two denominators.
  - Every result is below one.
- Problems such as 1/4+1/5 drop out because the alternate, 40, is above 30. 1/2+1/7
  drops out because its alternate needs a scale factor of 14.

**Consequence**
- A first set of "three to five" is feasible.
- But in that set, Plan 24's "multiply the denominators" cue always gives the least
  answer, and every problem has the same two-conversion shape.
- Roadmap §30's "meaningful differences in denominator relationships, scale factors,
  result forms" is barely touched.
- The owner may read "Next works" as "practice has variety". It will not have variety
  yet.
- Admitting problems outside the 9 gives inconsistent high support: some problems
  offer choices and some ask for typed entry, at the same support level.

**Smallest correction**
- Plan 21's content inventory should publish this exact pool and the reason each excluded
  problem drops out.
- The owner then chooses the first set from it, knowing it is a "repetition" set.
- State which limit (alternate = 2 × LCD, ceiling 30, scale ≤ 12) would have to change
  to widen the pool, and route that question to the capacity work (F4).

**What would weaken this:** a decision that high support may use typed entry for some
problems. Or a different alternate-denominator rule (not 2 × LCD) adopted in Plan 21.

### F2 — Plans 18 and 19 really do depend on the selection mechanism; Plan 26 must allow mixed problem shapes
**Severity: High (proposal defect). Confidence: high.**

**Evidence**
- DECISION-035 says nested and shared-factor problems are variations within a goal.
- Proposal line 44 says shared-factor content should "join an appropriate existing goal".
- But each practice type carries one `fixtureId` and one `episodeDefinition`
  (`practice-types.js:8-13`).
- Shared-factor content cannot start under the current definition: its selector is fixed
  to `relatively-prime-addition`. Plan 19 itself names this guard gap (`plan-19:71-72`).
- Nested content (Plan 18) needs a one-renaming schedule. Like-denominator content
  (Plan 20) has no reflection (DECISION-039). These are different definitions and
  different schedule shapes.

**Consequence**
- After Plan 26, adding a shared-factor or nested problem "to the goal" means adding an
  item whose episode definition differs from its neighbours.
- If Plan 26 stores a set as a plain list of fixture IDs under one definition, Plans 18
  and 19 must rework the selection code, its routes and its replay assumptions.
- The proposal's "numbers are scope identifiers, not an execution dependency chain"
  (line 37) is true for Plan 17, which is a distinct goal. It is false for 18 and 19,
  whose only DECISION-035-compliant route to learners is the set.

**Smallest correction**
- Record that Plans 18 and 19 depend on Plan 26 for learner reach. Reviewer-only
  fragments are not learner reach.
- Require Plan 21 and Plan 26 to define a set entry as at least {content identity,
  episode definition id/revision}. Prove it with a test-only second definition, even if
  the first live set uses one definition.

**What would weaken this:** an owner decision to give shared-factor or nested practice its
own entry button. That is a DECISION-035 amendment, which I do not recommend.

### F3 — Plan 19 should become a content increment of the set, not a standalone family packet
**Severity: Medium (sequencing/scope). Confidence: medium-high.**

**Evidence**
- Plan 19's distinct work is three things: a bounded selector-admission change, one
  authored shared-factor fixture (1/6 + 1/4) and its reflection/premise data.
- It reuses the two-renaming schedule, the renderer and the learner goal. The helper
  agent found these points at `plan-19` lines 41–46, 69–76 and 83–85; I checked
  lines 60–80.

**Consequence**
- Run as a standalone packet with its own entry, it has nowhere to appear (F2). After
  Plan 26 it is small.
- It is also the cheapest way to get a *different denominator relationship* into the
  Next set. For example, the product of 4 and 6 is 24, but 12 is least. That is the
  first case where Plan 24's product cue is valid but not least, and where a learner's
  denominator reasoning can actually be seen.

**Smallest correction**
- Retarget Plan 19 as "add shared-factor items to the sum-under-one set". It should
  come immediately after Plan 26 — before Plan 17 if the owner values variety in the
  existing goal over a second goal.
- Keep its own mechanism gate for selector admission.

**What would weaken this:** if Plan 21 finds that shared-factor items need learner copy
or reflection behaviour too different to sit beside relatively-prime items.

### F4 — Plan 27's framing misses the limits that actually bind
**Severity: Medium-High (proposal defect). Confidence: medium.** Code facts are verified;
platform facts are web-sourced (see §7).

**Evidence**
- The bar container is limited to `max-width: 48rem` (`src/styles/render.css:50`, `:791`),
  which is 768 CSS px.
- DECISION-009's supported environment starts at 360px and must reflow down to 320px
  (`docs/decision-log.md:201`).
- DECISION-034 and the follow-up register forbid viewport-derived admission
  (`phase-3-follow-up-obligations.md:15`).
- The repository's "Chromebook reference" viewport is 360×752, a portrait shape
  (Plan 09 reports; Plan 24 evidence filenames).
- Plan 24 measured only 360×740 and 360×752 (Plan 24 `measurements.json`, per the helper
  agent and the evidence file names I listed).

**Consequence**
- **Width.** On any Chromebook used in landscape, the bar width is set by the app's own
  768px cap, not by the device. Raising the cap is a design choice.
- **Denominator limit.** A single device-independent policy is limited by the narrowest
  supported width.
  - At about 300px of usable bar width, 24 parts are about 12px each and 48 parts about
    6px.
  - That small width, not the Chromebook, decides which denominators are readable for
    everyone.
- **Height.** A typical 11.6-inch 1366×768 school Chromebook very likely has less than
  740px of viewport height once browser controls and the shelf take their share. That is
  an inference that has not been measured (see §7).
  - So the existing "fold" checks at 740/752 may be optimistic for Chromebooks.
  - This matters most for Plan 17's stacked wholes plus replay rows. DECISION-032 already
    measured 701–746px.
- **Policy risk.** A "Chromebook capacity" policy that admits larger denominators where
  the screen is wide would break both deterministic episodes and narrow/linear access. The
  proposal rules out viewport-dependent validity, which is correct. But it does not say
  what *else* could raise capacity: a different narrow-screen layout, a symbolic path, or
  a higher floor.

**Smallest correction**
Reframe Plan 27 as **"denominator capacity at the supported floor, and Chromebook height
check"**. Deliverables:
1. Part-width arithmetic and rendered samples at 320/360px, and at the 768px cap, for
   denominators 24–60.
2. A landscape Chromebook viewport check at 100% and at a larger display size, measuring
   vertical fit for the current episode and the Plan 17 stack.
3. A short owner policy brief. Option A: keep one floor-bound ceiling. Option B: accept a
   different narrow-layout representation. Option C: raise the participation floor. B and
   C are policy amendments.

Run the height part before Plan 17's mechanism gate.

**What would weaken this:** measured Chromebook viewport heights at or above 740px at the
default display size, or an owner decision that phones are not a supported learner device
for larger denominators. The latter is an amendment of the 360px floor.

### F5 — Plan 25's approved prompt is the procedural shorthand; check unit wording at owner acceptance
**Severity: Medium (instructional; not a mechanism defect). Confidence: medium.**

**Evidence**
- The approved helper first asks `3 × ? = 24`. It then replaces that with "Multiply the
  top by 8, too." (`plan-25 mechanism-review.md:11-13`).
- The current transform strings already include "Multiply the top and bottom by
  ${mult}." (HEAD `src/render/strings.js:79-81`).
- Principle §4 asks for "each existing unit is subdivided into smaller equal units" to be
  understood *before* the multiply-top-and-bottom shorthand (`00-principles.md:102-125`).
- The committed Plan 24 screenshot of the 24ths conversion screen
  (`plan24-high-visual-transform-24-360x740.png`) shows the 2/3 bar still in thirds
  before the answer. No subdivided picture carries the meaning at the moment the helper
  speaks.
- The main question is already in unit language: "How many parts out of 24 make the same
  amount as 2/3?"

**Consequence**
- A stuck learner can finish with help by following two arithmetic instructions without
  connecting the 8 to "each third becomes 8 smaller parts".
- That teaches the rule that Principle §4 asks to delay.
- The proposal's own rule — help should "contribute reasoning rather than repeat the prompt
  or answer it" (line 82) — is only partly met.

**Smallest correction (copy only, inside the approved mechanism)**
- After the learner's factor is accepted, say for example "So each third splits into 8
  parts." in place of "Multiply the top by 8, too."
- The learner still works out 2 × 8 in the main field. No extra control, transcript or
  answer is added.
- The owner should judge this at Plan 25's rendered-screen acceptance, read beside the
  main question.

**What would weaken this:** if owner review finds that "parts" wording is ambiguous next
to the target-denominator question, or that the helper is reached mostly by learners who
already understand subdivision and only need the arithmetic step.

### F6 — Subtraction is deferred without a trigger, although the next step is cheap and docs-only
**Severity: Medium (roadmap obligation). Confidence: high.**

**Evidence**
- Four of §27's eight families are subtraction. OQ-25 calls it "half the phase"
  (`open-questions.md`).
- Plan 15's prototypes were owner-accepted on 2026-10-02, with both representations left
  open.
- The proposal places subtraction "after the near-term wave" (lines 66–70) with no trigger.
  The follow-up register lists it outside its trigger table (lines 29–31).
- The prior disposition says the owner "can make a product judgment with stated limits"
  without an observation gate (`next-wave-plans-17-21-review-disposition.md:136-140`).

**Consequence**
- The near-term wave is five or six serialized source packets. Without a trigger,
  subtraction's representation choice slips past all of them.
- Separately, Plan 20's zero-renaming reducer work is also the base for like-denominator
  subtraction. Without a subtraction decision, Plan 20 cannot be shaped to serve both.

**Smallest correction**
- Draft the "small decision dossier" now as docs-only work alongside Plan 25 and Plan 21.
  Do not rebuild prototypes or collect learner data.
- Give it a concrete trigger: an owner representation choice (or an explicit "not yet",
  with a reason) before Plan 20's mechanism gate.

**What would weaken this:** an owner judgment that subtraction should wait until after the
fraction-bar addition goals are complete. That is a legitimate choice; it should be
recorded rather than left implicit.

### F7 — Plan 28 cannot be properly tested with today's reachable content
**Severity: Medium (sequencing/value). Confidence: medium-high.**

**Evidence**
- All 9 problems reachable before shared-factor/nested work have LCD = product (F1).
- Plan 28 proposes comparing "product/shared-multiple reasoning" (proposal line 58).
- OQ-27 asks for a process for finding a common denominator.

**Consequence**
- Where the product is always least, every strategy gives the same answer. A design or
  rendered check run on these problems cannot tell a shared-multiple process apart from
  the product cue Plan 24 already provides.
- Drafting Plan 28 "after Plan 25's mechanism is stable" puts investigation effort ahead
  of the content that would make it meaningful.

**Smallest correction**
- Defer drafting Plan 28 until at least one shared-factor item (F3) or nested item is
  reachable through Next.
- Then plan it together with §28's "identify a valid / least common denominator" focused
  concept tasks, rather than as a separate helper track.

**What would weaken this:** if the owner sees an urgent classroom need for discovery help on
the current problem, e.g. learners typing 7 or 24 without a reason. A narrower copy fix
inside Plan 24's cue would then be the proportionate response.

### F8 — Plan 26 needs several decisions and prerequisites the proposal does not name
**Severity: Medium (pre-drafting gaps). Confidence: high for verified items.**

1. **When Next is offered.** DECISION-040 says "learner-triggered" but not *when*.
   - The current app disables Help and Replay once a problem is solved (agent-cited
     `app.js:523-529`).
   - The Plan 22 unavailable-unit boundary already offers "another entry, retry or return"
     (DECISION-036).
   - If Next is offered mid-problem, it becomes a skip button. If it is offered only after
     solving, a learner stuck at a boundary has no Next.
   - This is an owner decision (§5, D1).
2. **Learner copy for new units.** The unit names are hard-coded for 12 and 24
   (HEAD `strings.js:55`, "twelfths"/"twenty-fourths"). Other denominators fall back to
   "N equal parts".
   - Plan 24's explanation would then read "so both fractions can use 10 equal parts".
   - Every admitted denominator (6, 10, 12, 15, 20, 24, 30) needs reviewed names under
     DECISION-017.
3. **Help evidence beyond 12/24.**
   - Plan 24 and Plan 25 compute their cues from the actual numbers. But evidence exists
     only for 2/3 + 1/4 at 12 and 24 (Plan 24 `delivery-review.md:49-52`; Plan 25 scope
     line 46).
   - Plan 26 must show helper copy and recovery for each admitted problem and
     denominator, not assume them.
4. **Authored data and replay.**
   - Reflection and premise data are keyed by `fixtureId` only (`reflection-choices.js:10`,
     `premise-checks.js:11`).
   - Replay rebuilds the fixture by `fixtureId` + `authoringRevision`
     (`src/interaction/replay.js:188-191`, verified). The authored reflection/premise data
     are not part of that identity.
   - So if a set item's reflection choices are edited during owner review, older histories
     replay against the new data with no error.
   - Plan 26 should version authored data alongside the fixture (or include it in
     identity), and should only *append* fixtures. The 2/3 + 1/4 fixture is pinned by the
     Plan 16/22/25 oracles.
5. **Route stability.**
   - All 48 routes start from the single practice button (`route-matrix.json`). Many
     hard-code 12/24 numerators.
   - Entry, fragment, return and re-entry must always start at item 1, and Next must be
     reached only by pressing Next. Otherwise the identical-capture Retry/return route
     (agent-cited `route-matrix.json:1357`) breaks.
   - This is a design constraint, not a defect. Plan 21 should state it.
6. **Serialization.** Plan 26 will edit `src/app/app.js`, which Plan 25 is editing now.
   Plan 21's read-only inspection should anchor to Plan 25's *committed* delivery, not to
   today's moving tree.

**What would weaken this:** none of these is speculative. Items 1 and 2 are owner and copy
decisions. Items 3–6 are engineering obligations whose absence would show up only after
source work had started.

### F9 — Practice-dose and repetition risk once Next exists
**Severity: Low-Medium (instructional risk). Confidence: medium.**

**Evidence**
- Support level is chosen by a reviewer only (DECISION-030). There is no fading across
  problems (adaptive fading is Phase 6).
- The canonical arc includes premise and reflection checks.

**Consequence**
- A learner pressing Next five times repeats the same full high-support arc, including the
  same kind of premise and reflection question, five times.
- Principle §8's "theme → repetition" is served. Its "increasingly independent procedure"
  (Principle §5) cannot happen inside the app yet.
- Roadmap §31 asks which prompts became repetitive. With no learner observations, nobody
  will find out.

**Smallest correction**
- In Plan 26's owner acceptance, run all set items back to back in one sitting and judge
  repetitiveness.
- Record a revisit trigger for (a) whether premise/reflection repeat on every item and
  (b) when learner-visible fading should be planned.
- Do not add adaptation now.

**What would weaken this:** owner rendered review finding the five-item run calm and not
tedious.

### F10 — Plan 17 can proceed separately, but as a one-problem goal it is a demonstration
**Severity: Low-Medium. Confidence: medium.**

**Evidence**
- Plan 17 scopes one fixture, 2/3 + 3/4 (`plan-17` lines 29–35, 130–137).
- The proposal lets it proceed independently of Plan 26 (line 42).

**Consequence**
- A second learner-goal button that always shows the same problem.
- With Plan 26's contract available, Plan 17 could ship as a short set instead.
- Crossing candidates with two eligible denominators exist in the same four denominator
  pairs, e.g. 1/2+2/3, 1/2+3/5, 2/3+3/4 and 2/3+2/5. I enumerated these by hand from the
  same limits, not by probe.

**Smallest correction**
- Let the owner choose: Plan 17 before Plan 26 as an accepted single-problem
  demonstration, or after Plan 26 with ≥3 items.
- In either case, run F4's Chromebook height check before Plan 17's layout gate.

**What would weaken this:** an owner priority on the above-one goal as a visible demonstration
for a near-term classroom use.

### F11 — Housekeeping (verified)
**Severity: Low.**

- Plans 17–20 still list `plan-11` and `plan-22` as prerequisites and describe Plan 22 as
  future work. The follow-up register line 5 lists Plans 24–25 as drafts.
- Plans 17–20 do not mention Plan 24 or Plan 25 help at all.
  - Plans 17 and 19 (two conversions) should say they *inherit* both helpers.
  - Plans 18 and 20 should say which helpers are *omitted*, and why. Plan 18 skips one
    conversion; Plan 20 skips both decide and transform.
  - The proposal says this in general (line 40); the packet drafts should carry it.
- Plan 23 is harmless and independent. It touches only `package.json` among shared files.
  - Its value to a one-person owner who deploys by pushing is modest.
  - It is reasonable to leave as optional work for whenever an agent is idle. It should
    not be counted as part of "the wave".

---

## 4. Recommended sequence and packet boundaries

Source writers stay one at a time. Docs-only work can run alongside them.

| Step | Work | Type | Notes |
|---|---|---|---|
| now (docs) | **Plan 21, narrowed** | investigation | Priority deliverables: (a) the exact candidate pool and why problems drop out (F1); (b) set-entry identity including episode definition (F2); (c) the Next contract — when it is offered, exhaustion, focus, config carry-over, item-1 start (F8). Content inventory of *future* families can be brief. Anchor to Plan 25's committed delivery. |
| now (docs) | **Subtraction decision dossier** | owner brief | Uses existing Plan 15 prototypes and SUB-01. Trigger: decision (or recorded "not yet") before Plan 20's gate (F6). |
| now (docs) | Refresh stale prose in 17–20 and the follow-up register | orchestration | Include inherit/omit statements for Plans 24/25 help (F11). |
| 1 | **Plan 25** to delivery and owner acceptance | source | Add the unit-wording check at acceptance (F5). |
| 2 | **Plan 27, reframed** (floor capacity + Chromebook height) | investigation | Can run during Plan 25/26 source work in disjoint files. Must finish before Plan 17's layout gate (F4). |
| 3 | **Plan 26** — sum-under-one set + Next | source | 4–5 items chosen from the 9-problem pool. Set entries carry the definition. Unit-name copy. Helper evidence per item. Versioned authored data (F8). |
| 4 | **Plan 19, retargeted** — shared-factor items into the set | source | First real variety in denominator relationship (F3). |
| 5 | **Plan 17** — above-one goal, ideally as a short set | source | Or earlier as an accepted single demonstration, if the owner prefers (F10). |
| 6 | **Plan 20** — zero-renaming execution | source | Shape the reducer so like-denominator subtraction can reuse it, if the owner's subtraction decision supports that. |
| 7 | **Plan 18** — focused nested task as set item(s) | source | Builds on Plan 20's variable-conversion reducer work. |
| later | **Plan 28** | investigation | Trigger: a shared-factor or nested item is reachable (F7). |
| optional | **Plan 23** | tooling | Any idle slot; not a wave item. |

**On 17 → 20 → 19 → 18.** As a preference this is defensible, but only one link in it is a
real dependency: 18's variable-conversion work benefits from 20's. The proposal's order
leaves Plan 19 waiting behind two more expensive packets, although after Plan 26 it is the
cheapest way to add variety. I recommend **26 → 19 → (17 | 20) → 18**. The 17-or-20 choice
is a product priority for the owner:
- 17 if the above-one goal matters more;
- 20 if subtraction is coming soon.

---

## 5. Owner decisions needed

Settle these before drafting or source approval. Items marked **(amendment)** would change
an existing accepted decision.

- **D1 — When Next appears.** Options:
  - only after a solved problem (recommended);
  - also at the Plan 22 unavailable-unit boundary;
  - at any time.

  "Any time" makes Next a skip control.
- **D2 — Exhaustion.** After the last item, either cycle back calmly to item 1, or show a
  short "you've tried all of these" with Retry/return. Both are deterministic. The second
  is more honest about a small set.
- **D3 — First set composition.**
  - Pick 4–5 items from the 9-problem pool (F1).
  - Decide whether easy items such as 1/2 + 1/3 belong.
  - Decide whether every item must offer two high-support choices. Recommended: yes, for
    consistent support.
- **D4 — Plan 19's shape.** Fold shared-factor content into the sum-under-one set as the
  step after Plan 26 (recommended), rather than as a standalone route.
- **D5 — Plan 17 timing.** An accepted single-problem demonstration before Plan 26, or a
  short set after it.
- **D6 — Capacity policy direction for Plan 27.** Keep one ceiling bound by the narrow floor;
  allow a different narrow-screen representation **(amendment)**; or raise the
  participation floor **(amendment of the 360/320px requirement)**. Plan 27 should inform
  this choice, but the owner should know the three options before it is drafted.
- **D7 — Subtraction representation (OQ-25).** Make a product judgment with stated limits,
  or record why not yet, before Plan 20's gate.
- **D8 — Plan 25 wording.** Procedural ("Multiply the top by 8, too") or unit language
  ("Each third splits into 8 parts"), judged at rendered acceptance.

---

## 6. Deferrals with revisit triggers

| Deferred item | Revisit trigger |
|---|---|
| Wider denominator variety (raising the 2 × LCD / ≤30 / ≤12 limits) | When Plan 27's floor-capacity brief is accepted, or if the owner finds the first set too repetitive at Plan 26 acceptance. |
| Plan 28 / guided common-denominator discovery (OQ-27) | First shared-factor or nested item reachable through Next; plan with §28 focused concepts. |
| General nested common-unit choice | Unchanged from the follow-up register: after the focused nested task works in both orders. |
| Bounded generated practice | Unchanged: after Next demonstrates reset/refusal/access/replay. Add: and after unit-name copy covers generated denominators. |
| Reflection and premise frequency across a set | Plan 26 owner acceptance of a back-to-back run (F9). |
| Learner-visible fading across problems (Phase 6) | After two or more goals have working sets; plan before the §31 exit review, not during it. |
| Simplification (§27) and reducible results | After Plan 19 adds the first family that naturally produces reducible sums. Shared-factor sums such as 1/6+1/3 = 3/6 do. |
| Subtraction implementation | After D7; then a like-denominator subtraction slice reusing Plan 20's reducer. |
| Mixed numbers, number lines, sessions, progress | Unchanged roadmap boundaries (§§31, 91; Phases 7–8). |
| Plan 23 dev console | Any idle agent slot; owner interest. |

---

## 7. Verification performed, gaps and residual uncertainty

**Performed directly**
- Read: the proposal; Plans 21 and 25 in full; DECISION-031–040; OQ-23, OQ-24, OQ-25 and
  OQ-27; the follow-up register; Roadmap §§26–31; Principles §§4, 5 and 8; the Plan 25
  mechanism review in full and the Plan 25 proposal sections; and Plan 19's
  Requirement 0 and Plan 17's Depends-on and Requirement 1–2 text.
- Inspected at HEAD: `practice-types.js`, the episode-definition selector, the
  transform/unit-name strings, `replay.js` reconstruction, eligibility limits,
  `profiles.js`, `analysis.js` alternate rule, family definitions, reflection/premise
  data and CSS max-widths.
- Ran a read-only Node probe that imported `src/content/curated.js` and `eligibility.js`
  from the working tree. Those files are unmodified by the in-flight work. It enumerated
  candidate fixtures; it wrote only to my scratchpad, outside the repo.
- Checked `plan-status.js list` and `check plan-21` / `check plan-17`.
- Viewed one committed Plan 24 screenshot (24ths conversion screen, 360×740).
- Confirmed the proposal file is unchanged since `79c6666`.

**Delegated and spot-checked**
- Line-level claims about `app.js`, `episode.js`, `scene.js` and the route matrix come
  from a helper that read working-tree copies; they are marked "agent-cited" above. I
  confirmed the single-type registry, selector, authored-data keying, replay lookup and
  eligibility limits myself.
- Plan 25/24 approval facts: I re-read Plan 25's `mechanism-review.md` myself.

**Chromebook platform facts.** F4 depends on these. The researcher agent read some pages
directly; others it saw only as search snippets. Its main points:
- **Common school models are 11.6-inch 1366×768.**
  - Read directly: Dell's Chromebook 3110 2-in-1 display spec.
  - Search snippets only: Lenovo 100e Gen 3 and 300e Yoga Gen 4, Acer 311 C722,
    HP Chromebook 11 G9 EE and Dell 3120. The manufacturer pages did not load.
  - 14-inch 1920×1080 education models exist but appear less common.
- **Several are convertible touch models**, such as the 300e Yoga and the Dell 3110/3120
  2-in-1s. So emulated touch and tablet-mode orientation matter.
- **Browser zoom vs display size (Google Chromebook Help, read directly:
  support.google.com/chromebook/answer/6320705).**
  - Ctrl +/− (browser zoom) enlarges only the page.
  - Ctrl+Shift +/− (display size) changes everything on screen, including tabs and the
    shelf.
  - Both shrink the CSS viewport. The resulting widths are arithmetic, not a Google
    statement.
- **Not verified:**
  - the default display scale for 1366×768 panels (100% is assumed, not sourced);
  - the pixel height of ChromeOS's tab strip, address bar and shelf.

**What this means for F4**
- Its *width* argument rests only on the verified 768px CSS cap and a landscape screen
  being wider than that.
- Its *height* concern is an unmeasured inference: 768 physical pixels minus unmeasured
  browser and shelf UI is very likely below the 740/752 "fold" references, but no one has
  measured it.
- Hence F4 recommends a measurement, not a policy change, and its confidence is medium.

**Not done**
- No browser run of the app.
- No assistive-technology or physical-device testing.
- No tests run: the shared tree is mid-change, and a full run would test unreviewed
  Plan 25 work.
- No learner observations.
- The crossing-problem candidates in F10 were enumerated by hand.
- I did not read the other reviewer's report for this round.
- I read the 2026-10-04 disposition only after forming the findings above. It did not
  change them, though it confirmed that 17-first was chosen because crossing reuses the
  two-conversion flow. That reason still holds, but it predates Next becoming the
  priority.

**Final repository state**
- HEAD is still `39a7672`, and the proposal is still unchanged since `79c6666`.
- Compared with the start, the working tree has these Plan 25 changes in flight. They are
  not mine, and I left them untouched:
  - `tests/route-contract.test.js` modified;
  - `tests/routes/route-matrix.json` modified;
  - two untracked Plan 25 evidence files, `verify-pre-mutation-oracles.mjs` and
    `verification-pre-mutation-oracles.json`.
- My only write is this untracked report. It is not staged or committed.
