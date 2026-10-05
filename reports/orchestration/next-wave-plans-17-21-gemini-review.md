# Independent Skeptical Review: FractionFlow Proposed Next Development Wave (Plans 17–21)

**Reviewer Model Identity:** Gemini 3.8 Flash (High)  
**Requested Provider/Model:** Gemini 3.8 Flash (High) (confirmed via runtime user settings change)  
**Repository State:** Commit `003cd2d` (`docs: draft next Phase 3 packet wave`), with working-tree in-flight modifications for `plan-11` noted and preserved uncommitted  
**Date:** 2026-10-04  
**Deliverable Path:** `reports/orchestration/next-wave-plans-17-21-gemini-review.md`

---

## 1. Overall Verdict: Substantially Redesign the Sequence

The proposed Phase 3 packet wave (`plan-17` through `plan-21`) contains valuable analysis and laudable restraint regarding static architecture and exact arithmetic. However, it should be **substantially redesigned in its sequencing, architectural assumptions, and packet packaging** before any implementation is authorized.

The proposal suffers from three fundamental structural weaknesses:

1. **A Severe Pedagogical & Invariant Defect in Plan 17 (`crossing-one-whole`):** By mandating that addend bars collapse and a multi-whole stack be mounted at the `operate` beat *before* the learner answers, Plan 17 pre-computes the combination and displays the answer visually, reducing addition to counting pre-drawn parts. Attempting to suppress numerical labels while displaying the shaded segments is a cosmetic patch that fails the scaffold-leakage boundary.
2. **An Unresolved Architectural Deadlock in Plan 18 (`nested-addition`):** DECISION-034 established that the beat schedule is frozen at construction based on canonical problem properties. For nested addition ($1/2 + 3/8$), selecting the valid alternate denominator $16$ requires *both* fractions to be transformed, but the frozen schedule contains only `transform-left`. Burying this load-bearing contradiction inside "Requirement 0" of an implementation packet halts the wave at step 2 and blocks subsequent independent work.
3. **Flawed Dependency Inversion:** Like-denominator addition (`plan-20`) is the foundational prerequisite to all fraction operations, directly proves the zero-renaming schedule delivered by Plan 16, requires zero new rendering mechanics, and carries no alternate-denominator conflict. Yet it is placed fourth, chained behind two high-risk, potentially deadlocked packets. Meanwhile, practice variety (`plan-21`), which addresses the application's most glaring usability bottleneck (having only one problem instance), is locked behind all four packets.

The sequence should be reordered and refactored so that low-risk, foundational increments ship first, load-bearing policy questions are decided by the owner *before* drafting implementation packets, and the multi-whole visualization is relocated to the result beat where it reinforces rather than preempts learner reasoning.

---

## 2. Findings (Ordered by Practical Importance)

### Finding 1 (Critical Pedagogical Defect & Scaffold Leakage): Displaying the Multi-Whole Stack at `operate` Preempts Learner Reasoning
* **Evidence:** `docs/development/plan-17-crossing-one-whole-addition.md:89–100`; `docs/decision-log.md:825–855` (DECISION-032); `docs/development/phase-3-generalization-design/crossing-one-whole.md:170–184`; `src/render/beat-container.js:430–453`.
* **Concrete Failure:** In the accepted proper-fraction episode ($2/3 + 1/4 = 11/12$), at the `operate` beat, the left bar ($8/12$) and right bar ($3/12$) remain mounted. The learner performs the addition $8 + 3 = 11$. No result fraction bar is rendered on screen at `operate` or at `resolve` (only the symbolic equation displays the result).
  Plan 17 and DECISION-032 mandate that for sums crossing one whole ($2/3 + 3/4 = 17/12$), the addend bars ($8/12$ and $9/12$) must be collapsed into text at `operate`, and the active stage must mount a discrete two-whole stack (Whole 1: $12/12$ shaded; Whole 2: $5/12$ shaded).
  This means the application *pre-combines* the quantities into full and partial wholes *before* the learner answers. The prompt asks: *"Add the shaded parts together. Total shaded parts out of 12:"*. The student is not adding $8$ and $9$; the software has already added them and regrouped them into $12$ and $5$. The student merely counts the pre-shaded segments ($12 + 5 = 17$).
  Constraint 3 of DECISION-032 attempts to patch this by forbidding numerical readouts on the stack before submission. But suppressing the text while rendering the exact shaded total fails the scaffold-leakage invariant (`D-16` / `05-quality-and-validation.md` §44): the visual model answers the question before the learner acts. Furthermore, hiding the addend bars removes the actual addends from view, breaking visual continuity with earlier beats.
* **Smallest Useful Correction:** Relocate the multi-whole stack to the `resolve` (result) beat. At `operate`, keep the addend bars mounted ($8/12$ and $9/12$) so the learner adds the like units with visual evidence intact, identical to proper-fraction addition. Upon submitting $17/12$, the episode advances to `resolve`, where the multi-whole stack appears to visually validate the sum, illustrate the improper fraction as whole units plus remainder, and connect to the calm statement that $17/12$ is $1\text{ whole and } 5/12$. This eliminates answer leakage, removes the need to collapse addends during `operate`, and prevents the 4-bar mobile viewport squeeze.

---

### Finding 2 (Critical Architectural Deadlock): Plan 18 Conceals a Fatal Conflict Between DECISION-034 and Alternate Units
* **Evidence:** `docs/development/plan-18-nested-denominator-addition.md:67–82`; `docs/decision-log.md:907–949` (DECISION-034); `src/interaction/beat-schedule.js:13–38`; `src/interaction/episode.js:367–404`; `src/interaction/classification.js:174`.
* **Concrete Failure:** Plan 16 implemented DECISION-034, which strictly specifies:
  1. The beat schedule is computed *once* at episode construction from problem properties (`canonicalRenaming`) and frozen.
  2. The schedule is *never* re-derived during an episode; re-derivation is adaptive sequencing (reserved for Phases 6–7).
  For $1/2 + 3/8$, the least common denominator is $8$. `canonicalRenaming` is `{ left: true, right: false }`. The computed schedule is:
  `encounter → notice → decide → transform-left → operate → resolve → reflect`.
  At `decide`, common denominator $16$ is fully eligible under DECISION-011 (denominators $\le 30$, scale factors $\le 12$). Under DECISION-028, valid non-least denominators are accepted as correct without penalty.
  However, choosing $16$ requires converting *both* $1/2 \to 8/16$ and $3/8 \to 6/16$. But the frozen schedule contains no `transform-right` entry! After `transform-left` converts $1/2 \to 8/16$, `advanceSchedule` moves straight to `operate`. At `operate`, `convertedRight` is still $3/8$. The denominators do not match, causing `classifyOperationResponseForEpisode` to fail or reject the sum.
  If the engine re-derives the schedule to inject `transform-right`, it violates DECISION-034. If it rejects $16$, it violates DECISION-028 and penalizes valid mathematics for software convenience. If the schedule includes `transform-right` by default, choosing LCD $8$ forces a redundant, confusing conversion of $3/8 \to 3/8$.
* **Consequence of Proposed Packaging:** Plan 18 acknowledges this as a "load-bearing nested decision" in prose, but packages it as "Requirement 0: Discriminating investigation and decision; stop" inside a feature packet. An implementer assigned Plan 18 cannot write code until the owner resolves this policy. Because Plans 19, 20, and 21 are chained behind Plan 18, the entire wave halts.
* **Smallest Useful Correction:** Remove this architectural policy question from Plan 18's implementation scope. Issue a dedicated, compact decision brief to the owner *before* initiating nested addition. The owner must choose between:
  * *(Option A)* Amending DECISION-034 to allow the schedule to be determined at `decide` once the learner selects a target denominator.
  * *(Option B)* Pre-scheduling both transformation beats for any unlike problem, with conditional no-op bypass if an operand already matches the chosen unit.
  * *(Option C)* Framing the nested denominator decision around whether one denominator already works (e.g. "Can we use 8?"), bounding the task to the LCD path while acknowledging other multiples.

---

### Finding 3 (Flawed Delivery Sequence): Inversion of Risk and Unnecessary Serialization
* **Evidence:** `reports/orchestration/roadmap-position-2026-10-04.md:32–47`; frontmatter `depends_on` in Plans 17–21; `docs/founding/01-instructional-model.md:105–125` (Stages C & D).
* **Concrete Failure:** The draft wave sequences packets as:
  `Plan 17 (crossing) → Plan 18 (nested) → Plan 19 (shared factor) → Plan 20 (like denominator) → Plan 21 (variety)`.
  This is backwards:
  1. **Like-Denominator Addition (`plan-20`) is artificially delayed:** Like-denominator addition ($2/7 + 3/7 = 5/7$) is Stage C in the Instructional Model, prerequisite to unlike addition. Technically, it requires zero renamings, directly exercises Plan 16's zero-renaming schedule, uses the existing fraction bar without multi-whole stack risk, has no alternate-denominator conflict, and resolves OQ-21 (notice recovery copy). It is the safest, cleanest, most natural immediate increment. Placing it fourth, behind two unresolved packets, makes no technical or pedagogical sense.
  2. **Shared-Factor Addition (`plan-19`) has no dependency on Plan 18:** For $1/6 + 1/4 = 5/12$, both operands require renaming whether the learner chooses LCD $12$ or alternate $24$. It has *no* nested schedule conflict. Yet Plan 19 is declared dependent on Plan 18.
  3. **False Serialization via `depends_on`:** Frontmatter `depends_on` marks hard blockers that `plan-status.js check` enforces. Chaining them sequentially creates false blockers.
* **Smallest Useful Correction:** Reorder the wave:
  1. **Step 1:** Like-Denominator Addition (former Plan 20).
  2. **Step 2:** Shared-Factor Addition (former Plan 19).
  3. **Step 3 (in parallel):** Owner Decision Brief on Nested Schedules, unblocking Nested Addition (former Plan 18).
  4. **Step 4:** Crossing-One-Whole Addition (former Plan 17, with multi-whole stack at `resolve`).
  5. **Step 5 (unblocked immediately):** Practice Variety & Next-Problem Investigation (former Plan 21).

---

### Finding 4 (Concealed Scope): Missing Content Fixtures, Reflection Data, and Family Admission
* **Evidence:** `src/content/data/phase1-golden-cases.js`; `src/content/data/premise-checks.js`; `src/content/data/reflection-choices.js`; `src/interaction/episode.js:154–157`; `src/interaction/episode-definition.js:25–53`.
* **Concrete Failure:** The draft packets understate the prerequisite work needed across content and interaction layers:
  1. **Proposed Fixtures Do Not Exist:** Plan 17 proposes $2/3 + 3/4 = 17/12$. This fixture does not exist in `phase1-golden-cases.js`. Plan 20 proposes $2/7 + 3/7 = 5/7$, which also does not exist in curated golden cases.
  2. **Reflection and Premise Data Missing:** `premise-checks.js` and `reflection-choices.js` only author data for `curated-relatively-prime-addition-non-least`. If reflection is enabled for any new fixture without authored entries, `beat-container.js:725` throws `MISSING_REFLECTION_CHOICES`, and `classifyPremiseResponse` returns `INVALID_REFLECTION_CHOICE`, trapping the learner.
  3. **Hardcoded Family Guard in Episode Engine:** `src/interaction/episode.js:154–157` explicitly asserts:
     ```javascript
     if (instance.request.selector !== PHASE2_EPISODE_DEFINITION.selector
       || instance.request.operation !== PHASE2_EPISODE_DEFINITION.operation) {
       throw new EpisodeConstructionError('UNSUPPORTED_CONTENT_FAMILY', ...);
     }
     ```
     `PHASE2_EPISODE_DEFINITION.selector` is hardcoded to `'relatively-prime-addition'`. Any instance with selector `like-denominator-addition`, `nested-denominator-addition`, or `shared-factor-addition` is immediately rejected at construction.
* **Smallest Useful Correction:** Every family packet must include explicit tasks to: (a) author and validate the curated fixture in `phase1-golden-cases.js`, (b) author corresponding premise/reflection data or explicitly set `includeReflection: false`, and (c) generalize `assertInstance` in `src/interaction/episode.js` to validate against the admitted selector in the episode definition rather than a hardcoded Phase 2 constant.

---

### Finding 5 (Inapplicable Reviewer Conditions in Zero-Renaming Episodes): Gear Menu Disconnect in Plan 20
* **Evidence:** `docs/development/plan-20-like-denominator-addition.md:63–69`; `docs/decision-log.md:173–184` (DECISION-007); `src/app/app.js:182–237`.
* **Concrete Failure:** DECISION-006 and DECISION-019 establish that the entry-page gear menu lets reviewers swap design conditions:
  * `D-01` (subdivision animation: smooth vs. static),
  * `D-02` (renaming choreography: in-place vs. juxtaposed vs. sequential),
  * `CM-01` (connection-making check: matching vs. premise).
  All three conditions govern the *equivalent-fraction renaming transformation*. In like-denominator addition ($2/7 + 3/7$), there is no common-denominator selection, no subdivision, and no equivalent renaming.
  If a reviewer selects `D-02-J` (juxtaposed) or `CM-01-P` (premise check) and enters a like-denominator episode, none of those conditions can execute. Furthermore, if `CM-01-P` or `CM-01-M` is triggered at `reflect`, what is being checked? There was no renaming. Asking "Does $2/7$ equal $2/7$?" is trivial compliance.
  Plan 20 lines 67–68 notes: *"If that requires an owner condition-policy decision, obtain it at this gate."* This should not be left open during implementation.
* **Smallest Useful Correction:** Explicitly specify in Plan 20 that like-denominator addition uses an episode definition with `includeReflection: false` (already supported by `episode-definition.js`), and document that transformation conditions (`D-01`, `D-02`, `CM-01`) naturally do not apply to zero-renaming problems. Negative control assertions in the route matrix must verify that skipped controls and conditions are cleanly absent rather than asserting false differences.

---

### Finding 6 (Premature Serialization of Practice Variety): Plan 21 Delayed Unnecessarily
* **Evidence:** `docs/development/plan-21-practice-variety-and-next-problem-design.md:5, 26–28`; `docs/open-questions.md:495–516` (OQ-23); Roadmap §30.
* **Concrete Failure:** FractionFlow's single most conspicuous defect today is that the application offers exactly one problem instance (`2/3 + 1/4`). Once completed, the learner can only click "Try this problem again" (retrying identical numbers) or "Back to start".
  Plan 21 is an *investigation* packet that produces a design dossier (`docs/development/phase-3-practice-variety-design/`) analyzing candidate fixtures and deterministic generation, and proposing a contract for "try another problem" (OQ-23). It changes no application code.
  Chaining Plan 21 to depend on Plans 17, 18, 19, and 20 delays resolving OQ-23 until the end of Phase 3 addition expansion. The design of next-problem selection, seed handling, and reset contracts does not require waiting for multi-whole or nested addition to be implemented in code. In fact, knowing the next-problem contract should guide how fixtures and seeds are structured for new families.
* **Smallest Useful Correction:** Make Plan 21 an independent investigation that can proceed in parallel with the first implementation increments.

---

### Finding 7 (Dormant Subtraction Evidence Track): Plan 15 Prototypes Remain Unobserved
* **Evidence:** `reports/orchestration/roadmap-position-2026-10-04.md:59–68`; `docs/open-questions.md:544–572` (OQ-25); Roadmap §27.
* **Concrete Failure:** Roadmap §27 assigns four subtraction families to Phase 3 (like, nested, shared-factor, and relatively prime subtraction). Subtraction represents 50% of Phase 3's family breadth.
  Plan 15 delivered standalone reviewer prototypes of takeaway vs. comparison representations. However, zero participant observations have occurred ($n = 0$), and OQ-25 remains unresolved.
  The proposed wave focuses exclusively on addition (Plans 17–20). If subtraction prototypes sit unreviewed while addition expands, the project risks hitting the Phase 3 exit gate without having resolved the representation for half the curriculum.
* **Smallest Useful Correction:** Establish a clear review milestone: during the addition wave, the owner reviews the Plan 15 prototypes with high school students or informal learners (using the existing observation guide) to record a disposition on OQ-25.

---

### Finding 8 (Working Tree In-Flight State): Uncommitted Plan 11 Modifications
* **Evidence:** `git status` output; `git diff tests/route-contract.test.js`; test failure in `tests/route-contract.test.js:14`.
* **Concrete Finding:** The current working tree contains uncommitted, in-progress modifications from Plan 11 (`scripts/dev/run-route-matrix.js`, `src/render/fraction-bar.js`, `src/render/strings.js`, `src/styles/render.css`, `tests/route-contract.test.js`, `tests/routes/route-matrix.json`).
  A syntax error exists in `tests/route-contract.test.js` (`require` of a module containing top-level `await`), causing `npm test` to fail 1 of 24 test suites.
  Per AGENTS.md guardrails and commit discipline, this review must leave those files untouched and must not attempt to repair or commit them. However, no new implementation packet (Plan 17 or any reordered equivalent) can begin until Plan 11 is delivered, reviewed, and committed, leaving a clean working tree.

---

## 3. Preferred Next Sequence and Reasoning

The development sequence should be reorganized into the following bounded, logically sound stages:

```
                      [ Plan 11 Delivered & Clean Working Tree ]
                                         |
     +-----------------------------------+-----------------------------------+
     |                                                                       |
     v                                                                       v
[ Packet 3.1: Like-Denominator Addition ]               [ Parallel Track: OQ-23 Variety & Next-Problem Design ]
(Former Plan 20: 0-renaming schedule proof,             (Former Plan 21: docs-only dossier, candidate sweep,
 OQ-21 notice recovery, no multi-whole risk)             reset semantics; independent of family implementations)
     |                                                                       |
     v                                                                       |
[ Packet 3.2: Shared-Factor Addition ]                                       |
(Former Plan 19: 1/6 + 1/4 = 5/12; 2 renamings                               |
 on all paths; generalizes family admission)                                 |
     |                                                                       |
     +-----------------------------------+-----------------------------------+
                                         |
                                         v
               [ Owner Decision Gate: Nested Schedule Policy (DECISION-034) ]
               (Resolves alternate denominator 16 vs frozen schedule for 1/2 + 3/8)
                                         |
                                         v
                     [ Packet 3.3: Nested-Denominator Addition ]
                     (Former Plan 18: executes approved schedule policy)
                                         |
                                         v
                     [ Packet 3.4: Crossing-One-Whole Addition ]
                     (Former Plan 17, REDESIGNED: multi-whole stack at resolve,
                      preserving addends at operate and avoiding answer leakage)
                                         |
                                         v
                     [ Packet 3.5: Implementation of Next-Problem UX ]
                     (Implements the approved Plan 21 contract across Phase 3 families)
```

### Detailed Rationale for the Preferred Sequence:

1. **Step 1: Like-Denominator Addition (Redesigned Plan 20):**
   * *Why First:* It is the lowest-risk, most direct proof of Plan 16’s zero-renaming schedule. It requires no multi-whole rendering, no subdivision animations, and avoids the alternate-denominator conflict. It resolves OQ-21 (notice recovery copy) and gives the entry page a second, mathematically distinct practice button immediately.
   * *Required Refinements:* Explicitly set `includeReflection: false` for like-denominator addition; document that transformation conditions do not apply; generalize `assertInstance` in `src/interaction/episode.js` to admit this family.

2. **Step 2: Shared-Factor Addition (Redesigned Plan 19):**
   * *Why Second:* It expands unlike addition to non-coprime denominators ($1/6 + 1/4 = 5/12$). Unlike nested addition, both operands require renaming on all paths (12ths or 24ths), so the schedule is always two renamings. It generalizes the family admission and multi-practice registry without hitting the DECISION-034 conflict.

3. **Step 3 (Parallel / Blocking Gate): Owner Policy Decision on Nested Schedules:**
   * *Why Separated:* Before drafting or starting code for nested addition, the owner must decide how a frozen schedule reconciles with valid alternate denominators requiring additional renamings. Resolving this via an explicit brief prevents stalling implementers.

4. **Step 4: Nested-Denominator Addition (Redesigned Plan 18):**
   * *Why Fourth:* Executes the owner's decided policy on nested denominators with known architectural contracts.

5. **Step 5: Crossing-One-Whole Addition (Redesigned Plan 17):**
   * *Why Fifth:* Moving multi-whole rendering here gives time to implement the pedagogical fix: rendering the multi-whole stack at `resolve` rather than `operate`. The two-renaming pipeline and family admission will already be mature, isolating multi-whole layout risk to a single packet.

6. **Parallel Track: Practice Variety & Next-Problem Design (Plan 21):**
   * *Why Parallel:* As a docs-only investigation, it can proceed independently. It provides the UX specification for how learners move between problems, ready for implementation once multiple families exist.

---

## 4. Decisions That Genuinely Require the Owner

The following five forks require explicit owner direction:

1. **Alternate Denominators vs. Frozen Schedule in Nested Addition:**
   * *The Conflict:* For $1/2 + 3/8$, denominator $8$ needs 1 conversion (`transform-left`). Denominator $16$ is valid under DECISION-011 and DECISION-028, but needs 2 conversions. DECISION-034 forbids re-deriving the schedule during an episode.
   * *Owner Choice:*
     * *A:* Amend DECISION-034 to allow the schedule to be determined at the `decide` beat based on the learner's chosen denominator.
     * *B:* Pre-schedule both transformation beats, bypassing the unchanged operand dynamically with an automated confirmation.
     * *C:* Reframe the nested task to focus on the LCD (e.g. "Can we use 8?"), providing informative feedback on multiples like 16 without launching a 2-step renaming arc.

2. **Pedagogical Relocation of the Multi-Whole Stack (Amending DECISION-032):**
   * *The Issue:* DECISION-032 Constraint 1 mandates collapsing addends and mounting the result stack at `operate`. This leaks the answer visually before the learner calculates the sum.
   * *Owner Choice:* Amend DECISION-032 to keep addend bars visible during `operate` (consistent with proper addition) and mount the multi-whole stack at `resolve` to illustrate the sum and explain the improper/mixed relationship.

3. **Reflection & Condition Applicability for Zero-Renaming Families:**
   * *The Issue:* Like-denominator addition has no renaming transformation.
   * *Owner Choice:* Confirm that like-denominator addition omits the reflection beat (`includeReflection: false`), and confirm that the reviewer gear menu's transformation options (`D-01`, `D-02`, `CM-01`) are documented as inactive for zero-renaming problems.

4. **Next-Problem Selection Mechanism (OQ-23 Direction):**
   * *The Issue:* How does "Try another problem" choose the next instance?
   * *Owner Choice:* Guide Plan 21's recommendation: a curated deterministic sequence, a constrained generator draw, or reviewer/teacher selection from the entry page.

5. **Observation Milestone for Subtraction Prototypes (OQ-25):**
   * *The Issue:* Plan 15 prototypes (takeaway vs. comparison) have zero observations.
   * *Owner Choice:* Authorize an informal observation pass (e.g. with high school students or solo teacher review) to select the subtraction representation before Phase 3 addition concludes.

---

## 5. What the Proposal Gets Right and Should Preserve

The draft wave demonstrates several strong alignments with FractionFlow principles that must be retained:

1. **Refusal to Weaken Exact Arithmetic:** Math core contracts in `src/math/` remain pure, deterministic, and DOM-free. No renderer calculates mathematical truth.
2. **Static-Only, Zero-PII Discipline:** No remote servers, accounts, tracking, or cloud storage are introduced. Practice addressing remains URL-fragment-only (DECISION-031).
3. **Refusal to Silently Truncate or Scale Multi-Whole Bars:** Plan 17 correctly rejects shrinking segment widths or truncating improper fractions into a single whole, upholding length conservation (Candidate 1 of DECISION-032).
4. **Preservation of the Route Matrix Witness Discipline:** All draft packets require full browser route witnesses covering both viewports ($360\times 740$ and $360\times 752$), both support profiles, recovery paths, keyboard navigation, and reduced motion.
5. **Separation of Mechanism and Policy Gates:** Requirement 0 mechanism approval before source code edits is consistently enforced across all packets.
6. **Honest Refusal Over Speculative Feature Creep:** Mixed numbers remain firmly excluded from Phase 3 operations per DECISION-033, and adaptive sequencing remains excluded per DECISION-034.

---

## 6. Review Coverage, Commands Run, and Material Uncertainties

### Checks and Commands Run:
* `git status`: Identified in-flight, uncommitted modifications for Plan 11 across 6 files in the working directory.
* `git log -n 5 --oneline`: Confirmed commit baseline `003cd2d` (`docs: draft next Phase 3 packet wave`).
* `node scripts/dev/plan-status.js list`: Verified effective status of all packets (`plan-11` in-progress, `plan-17`–`21` draft).
* `node scripts/dev/plan-status.js check plan-17`: Confirmed plan-17 exits code 1 (BLOCKED: status draft, dependency in-progress).
* `npm test`: Executed Vitest test suite (23 suites passed, 261 tests passed; 1 suite failed due to in-flight Plan 11 syntax in `tests/route-contract.test.js`).
* `git diff tests/route-contract.test.js`: Confirmed failure is localized to Plan 11's work-in-progress.
* Deep inspection of `src/interaction/episode.js`, `src/interaction/beat-schedule.js`, `src/interaction/scene.js`, `src/render/fraction-bar.js`, `src/render/beat-container.js`, `src/app/app.js`, `src/app/practice-types.js`, and data registries.

### Material Uncertainties:
1. **Plan 11 Final Timing:** When Plan 11 completes and is accepted, will any changes to `fraction-bar.js` or `route-matrix.json` affect the baseline assumptions for multi-whole or like-denominator routes? (The route baseline will need to be re-measured post-Plan 11).
2. **Owner Preference on Mobile Fold Clearance:** If the multi-whole stack is rendered at `resolve` as recommended, does the owner prefer addend bars to stay mounted as compact context during `resolve`, or collapse into the summary section at `resolve`?
3. **Student Feedback Demographics:** Results from the secondary-student feedback exercise (`reports/orchestration/student-feedback-questions.md`) will illuminate usability of controls and motion, but remain secondary-age evidence rather than target-age 8–11 evidence.
