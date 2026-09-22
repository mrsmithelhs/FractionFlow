# Phase 3 Implementation Sequencing Proposal

## Review Status

- **Status:** Proposal for owner review (`plan-10`).
- **Context:** Sized against the historical observation that Phase 2 required five implementation packets (`plan-05` through `plan-09`) and seven sequential repairs to eliminate unreachable code and rendering bugs.
- **Governing Guardrail:** Avoid monolithic implementation packets. Every packet must produce a bounded, verifiable, learner-reachable increment witnessed by the `plan-14` route matrix.

---

## 1. The Lesson of Phase 2: Why Sizing and Sequencing Matter

Phase 2 established the core vertical slice (`2/3 + 1/4 = 11/12`), but review revealed four critical mechanisms that were built, tested, and unreachable (`reports/orchestration/phase-2-unreachable-mechanisms.md`):
1. The support ladder had no writer.
2. DECISION-026 had no reachable premise check form.
3. The condition switcher changed no pixels (byte-identical rendering).
4. The fraction bar threw or quietly corrupted results $> 1$ (OQ-20).

Phase 3 is far larger: **eight problem families** and **six focused concept episodes**. Attempting to build Phase 3 in one or two monolithic waves would multiply these failure modes across fourteen targets.

To ensure stability, maintain high velocity, and prevent unreachable code, Phase 3 must be broken into **independently deliverable packets** where each step builds upon verified, reachable precursors.

---

## 2. Precursor Foundation Layer

Phase 3 implementation should not begin in application source until the following four active infrastructure packets are completed and accepted:

```
+--------------------------------------------------------------------------------+
|                         PRECURSOR FOUNDATION WAVE                              |
+---------------------+-------------------+------------------+-------------------+
|       plan-14       |      plan-12      |     plan-13      |      plan-11      |
| Route Matrix Harness| Entry Page Door   | Support Ladder   | Motion Subdivision|
| (Enforces reach)    | (Hosts practices) | (Fading writer)  | (D-01-A animated) |
+---------------------+-------------------+------------------+-------------------+
```

1. **`plan-14` (Reachable Behavior Contract & Browser Route Matrix):**
   *Why First:* Provides the automated harness that fails if a new configuration, family, or beat has no reachable route or renders byte-identically to an alternative.
2. **`plan-12` (Entry Page & Session Shape):**
   *Why Essential:* Implements the application front door (DECISION-029). The entry page is where the learner or reviewer selects practice types (e.g., "Adding with a sum above one"). Without `plan-12`, new Phase 3 problem families have no clean entry point.
3. **`plan-13` (Scaffold Fading Made Real):**
   *Why Essential:* Connects `state.support` to the entry page gear menu (DECISION-030), enabling lower-support options (e.g. numeric denominator entry) to be exercised across Phase 3 families.
4. **`plan-11` (Motion and Animated Subdivision):**
   *Why Essential:* Closes `D-01-A`, delivering the real partition-splitting animation that visual transformations rely on.

---

## 3. Recommended Phase 3 Packet Sequence

Once the precursor foundation is in place, Phase 3 executes in six bounded implementation packets:

```
                          [ Precursor Layer Accepted ]
                                       |
                                       v
             +---------------------------------------------------+
             | Packet 3.1: Multi-Whole Bar & Crossing-One-Whole  |
             | Unblocks OQ-20; enables "sum > 1" practice type   |
             +-------------------------+-------------------------+
                                       |
                                       v
             +---------------------------------------------------+
             | Packet 3.2: Unlike-Denominator Addition Wave      |
             | Shared-factor & nested addition; asymmetric beats |
             +-------------------------+-------------------------+
                                       |
                                       v
             +---------------------------------------------------+
             | Packet 3.3: Like-Denominator Addition & OQ-21     |
             | Zero-renaming bypass; authored notice copy        |
             +-------------------------+-------------------------+
                                       |
                                       v
             +---------------------------------------------------+
             | Packet 3.4: Subtraction Grammar & Representation  |
             | Representation spike (takeaway vs difference)     |
             +-------------------------+-------------------------+
                                       |
                                       v
             +---------------------------------------------------+
             | Packet 3.5: Interactive Simplification Beat       |
             | Active learner reduction; reducible-result overlay|
             +-------------------------+-------------------------+
                                       |
                                       v
             +---------------------------------------------------+
             | Packet 3.6: Focused Concept Episodes (§28)        |
             | Equivalence, LCD selection, benchmark estimation  |
             +---------------------------------------------------+
```

---

### Packet 3.1: Multi-Whole Fraction Bar & Results Crossing One Whole (OQ-20)
- **Scope:**
  - Implement Candidate 1 (Discrete Multi-Whole Stack) from [`crossing-one-whole.md`](crossing-one-whole.md).
  - Remove `numerator > denominator` throws from `src/render/fraction-bar.js` and `src/render/matching-choice.js`.
  - Update `src/interaction/scene.js` to project multiple unit bars for improper fraction quantities.
  - Enable `crosses-one-whole` overlay for addition in the generator and curated sets (`curated-like-addition-crossing-reducible`).
  - Wire the entry page (`plan-12`) to offer **"Adding with a sum above one"** as an active practice type.
- **Verification Gate:**
  - Route matrix witnesses end-to-end execution of `7/8 + 3/8 = 10/8`.
  - Visual verification of stacked bars on 360px viewport against DECISION-021 rubric.

---

### Packet 3.2: Unlike-Denominator Addition Generalization (Shared-Factor & Nested)
- **Scope:**
  - Refactor `src/interaction/episode.js` and `episode-definition.js` to accept `shared-factor-addition` and `nested-denominator-addition`.
  - Implement asymmetric transformation handling: for nested addition ($\frac{1}{2} + \frac{3}{8}$), automatically bypass the transform beat for the operand that already matches the LCD.
  - Author reflection choices in `src/content/data/reflection-choices.js` for shared-factor fixture ($24\text{ths}$) and nested fixture ($8\text{ths}$).
- **Verification Gate:**
  - Route matrix witnesses both canonical LCD and alternate routes for shared-factor and nested addition.

---

### Packet 3.3: Like-Denominator Addition & Notice Mistake Recovery (OQ-21)
- **Scope:**
  - Add `like-denominator-addition` to episode state machine.
  - Implement zero-renaming fast path: advance from `notice` directly to `operate`.
  - Author pedagogical recovery copy for `expectedMatches === true` in `src/render/strings.js:notice` (resolving OQ-21).
  - Add test coverage in `tests/render-recovery.test.js` for like-denominator notice recovery.
- **Verification Gate:**
  - Route matrix witnesses correct like-denominator flow and wrong-choice notice recovery.

---

### Packet 3.4: Subtraction Interaction Grammar & Representation
- **Scope:**
  - Conduct a bounded representation spike comparing visual takeaway (dimming/striking out segments) versus visual comparison (difference highlight). Owner review on rendered screens selects the paradigm.
  - Author subtraction strings in `src/render/strings.js:operate` ("Subtract the shaded parts", "Remaining shaded parts").
  - Generalize state machine for `like-denominator-subtraction`, `nested-denominator-subtraction`, `shared-factor-subtraction`, and `relatively-prime-subtraction`.
- **Verification Gate:**
  - Route matrix witnesses all four subtraction families.

---

### Packet 3.5: Interactive Simplification Beat & Reducible Results
- **Scope:**
  - Introduce an interactive **Simplify Beat** (`operate → simplify → resolve`) replacing the current passive report in `resolve`.
  - Implement learner input control for simplified numerator and denominator.
  - Connect `simplifyFraction` and math classification in `src/interaction/classification.js`.
  - Activate `reducible-result` overlay across all problem families.
- **Verification Gate:**
  - Route matrix witnesses correct simplification and unsimplified recovery.

---

### Packet 3.6: Phase 3 Focused Concept Episodes (Roadmap §28)
- **Scope:**
  - Implement the six targeted concept episodes:
    1. Construct an equivalent fraction (isolated `transform`).
    2. Identify a valid common denominator (with distractor generation).
    3. Identify the least common denominator (distinguishing LCD from multiples).
    4. Determine which fraction needs renaming (nested denominator concept).
    5. Determine whether a result should exceed one (benchmark estimation Notice beat).
    6. Simplify an equivalent result (isolated `simplify`).
  - Wire practice selection on the entry page.
- **Verification Gate:**
  - Route matrix witnesses each of the six concept episodes.

---

## 4. Risk Mitigation Table

| Risk Identified from Phase 2 | Phase 3 Architectural Control |
|---|---|
| **Unreachable Registry Entries:** Code exists in a registry or table but no learner path reaches it. | `plan-14` route matrix enforces that every registered family, condition, and support level must have an executable browser witness. |
| **Identical Output Across Options:** Settings switcher changes attributes without changing pixels. | Route matrix negative controls assert that distinct options produce distinct DOM trees. |
| **Silent Renderer Corruption:** Renderer produces misleading drawings (e.g. 10/8 looking like 8/8). | Packet 3.1 resolves OQ-20 first with strict multi-whole validation before crossing content is exposed. |
| **Asymmetric Transformation Lockout:** Two-step transform forces redundant conversions on nested fractions. | Packet 3.2 explicitly re-architects the state machine for dynamic renaming counts ($0, 1$, or $2$). |
| **Cognitive Overload on Mobile:** Multi-bar stacks push inputs below the fold on 360px viewports. | Layout budget strictly enforced: addend bars collapse into summary text when result stack appears. |
