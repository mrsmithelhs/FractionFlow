# Content Inventory and Reach Evidence

**Evidence baseline:** `28c317d1f189748336f10f6520c810f2bd6e3732`, 2026-10-09. The snapshot includes Plan 25's committed implementation and review artifacts; current route inventory is 51 rows / 53 browser executions according to the Plan 25 delivery record and orchestrator review. This is a code-and-artifact inventory, not a new browser run.

## Evidence layers

These labels answer different questions and must not be collapsed:

1. **Math valid:** exact operation and result facts hold.
2. **Content valid:** the fixture or generated instance satisfies the shared content schema, family and overlay contracts.
3. **Representation eligible:** each proposed path fits the current fraction-bar bounds: denominator at most 30 and scale factor at most 12. Math-valid paths beyond that boundary remain valid math and must be refused honestly.
4. **Instruction data ready:** the applicable task is fully authored, including premise/reflection facts where that definition requires them. A correct equation is not a substitute.
5. **Replay reconstructable:** stable content provenance and item-specific definition revision can reconstruct the same content and semantics. Existing curated replay code reconstructs fixtures by id/revision; authored premise/reflection tables are currently keyed by fixture id, so changing those tables in place can change replay meaning.
6. **Learner-app witnessed:** an actual mounted app route reaches the item through learner controls. A unit test, generated candidate or reviewer fragment alone does not establish this.

## Phase 1 addition fixtures

The Phase 1 golden set has seven addition fixtures. They pass curated construction/validation and have eligible canonical bar paths; fixture registration is not app admission. Only the relatively-prime fixture is an admitted learner item. `alternate` denotes a mathematically valid authored alternate denominator in the fixture, not a claim that a learner route currently accepts it.

| Fixture | Family and forms | Result / variety | Canonical and alternate units | Instruction data and reach |
|---|---|---|---|---|
| `curated-like-addition-proper` | like: `1/5 + 2/5` | `3/5`, proper, already simplified | 5; alternate 10 | Valid and bar-eligible, but no premise/reflection table and no learner route. Candidate only. |
| `curated-like-addition-reducible` | like: `1/6 + 3/6` | raw `4/6`, exact `2/3`, reducible proper result | 6; alternate 12 | Valid and bar-eligible; no authored task data or learner route. Candidate only; does not activate simplification. |
| `curated-like-addition-crossing-reducible` | like: `7/8 + 3/8` | raw `10/8`, exact `5/4`, reducible result crossing one | 8; alternate 16 | Valid and bar-eligible; no authored task data or learner route. Candidate only; crossing graphic and simplification activity remain separately gated. |
| `curated-nested-addition` | nested: `1/2 + 3/8` | `7/8`, proper, already simplified | 8; alternate 16 | Valid and bar-eligible; no premise/reflection table or episode admission. Candidate only. DECISION-037 applies if later admitted. |
| `curated-shared-factor-addition` | shared factor: `1/6 + 3/8` | `13/24`, proper, already simplified | 24; alternate 48 | Valid; canonical 24 is bar-eligible, alternate 48 is not (`denominator-ceiling-exceeded`). No premise/reflection data or learner route. Candidate only. |
| `curated-relatively-prime-addition-non-least` | relatively prime: `2/3 + 1/4` | `11/12`, proper, already simplified | LCD 12; authored alternate 24 | Content valid; both routes bar-eligible and have authored premise/reflection data. The sole currently registered and browser-witnessed practice item. |
| `curated-simplify-first-state` | nested: `2/4 + 1/2`, with a reviewed simplify-first transition available | raw `4/4`, exact 1 | 4; alternate 8 | Valid and bar-eligible, but a simplify-first instructional task is not approved. The reviewed transition does not establish the current operand form. Excluded from this authored-set increment. |

## Conditional second item for owner review

As a concrete, same-definition numeric candidate for a minimal Next demonstration, the dossier also checked `1/2 + 1/3 = 5/6` through curated content construction under `curated-review/1`. It has relatively-prime denominators, canonical LCD 6 with scale factors 3 and 2, and a valid alternate 12 with factors 6 and 4; both paths are representation-eligible. The check returned a content-valid instance. This candidate is **not** in `PHASE1_GOLDEN_CASES`, has no admitted fixture id/revision, has no authored premise or reflection data at 6 or 12, has no complete episode/browser route, and is not currently selectable. Its values are a proposal to illustrate a possible second item, not an approved problem or a claim of instructional readiness.

For the accepted fixture, the active app definition is `phase-2-unlike-proper-addition-reflection@3`. The premise and CM-01 reflection choice tables cover only that fixture at denominators 12 and 24. The route matrix and Plan 25 delivery report give learner-app witnesses for entry, full completion, visual/linear paths, conditions, recovery, help, replay, and retained retry/re-entry behavior. They do not show a Next-problem experience.

Plans 17–20 are still draft packets. Their Phase 1 fixtures are useful candidate content but do not count as accepted family delivery. Plan 17's crossing-one-whole addition goal, Plans 18/19's joining of nested/shared-factor items, and Plan 20's no-renaming task each still have their own mechanism and route gates. A definition-specific episode schedule must not be guessed from the current fixture registry.

## Bounded deterministic sample

An ephemeral, read-only probe used the current `generateProblem`, `inspectCandidateSpace`, `validateProblemInstance`, and `evaluateInstanceEligibility` contracts. It enumerated all allowed overlay combinations for the four addition selectors and sampled 40 deterministic seeds for each combination:

- **Profile:** `curated-review/1` (denominator pool 2, 3, 4, 5, 6, 7, 8, 10, 12; proper operands; canonical scale ceiling 12; no zero operands).
- **Seed labels:** `plan21-bounded-v1:0` through `plan21-bounded-v1:39`, repeated independently for each selector/overlay pair.
- **Scope:** four selectors × four allowed overlay sets = 16 requests, 640 requested draws. Every generated draw validated as content; no generation refusals occurred in this bounded sample. Some generated instances had representation paths refused by current capacity limits, summarized below.
- **Measured:** candidate-space cardinality, unique ordered operand pairs and duplicates, denominator relationship, canonical denominator, scale-factor range, raw-result form, reducibility, whole crossing, and fraction-bar path eligibility/refusal reasons.
- **Not measured:** instructional authoring, browser suitability, learner choice, actual app reach, universal pool coverage, student performance, or full eligible-space statistics beyond the candidate-space cardinality returned by the generator.

| Family | Overlay candidate cardinalities (eligible candidates) | Unique ordered numeric pairs in each 40-draw sample | Sample variety and capability result |
|---|---|---|---|
| Like denominator | none 76; reducible 119; crossing 76; reducible+crossing 71 (raw space 570) | 29–34 | Denominators 4–12; both scales 1; all sampled canonical and alternate paths eligible. Proper/improper and reducible variants matched requested overlays. |
| Nested denominator | none 88; reducible 148; crossing 88; reducible+crossing 100 (raw space 964) | 27–35 | Denominators 4–12; scale factors ranged 1–6; all sampled canonical and alternate paths eligible. All four requested result categories appeared as specified. |
| Shared factor | none 152; reducible 218; crossing 152; reducible+crossing 200 (raw space 1178) | 35–38 | Canonical denominators ranged 12–60; scales 2–6. Canonical bar eligibility was 22–28/40 depending on overlay; only 2–5/40 alternate paths were eligible. Refusal reason: denominator above 30. |
| Relatively prime | none 220; reducible 188; crossing 220; reducible+crossing 188 (raw space 1644) | 35–38 | Canonical denominators ranged 12–84; scales reached 12. Canonical eligibility was 7–16/40; alternate eligibility 1–4/40. Refusal reasons included denominator above 30 and left/right scale factors above 12. |

Duplicate counts ranged from 2 to 13 per 40 draws, depending on request. This directly falsifies a claim that a bounded generator draw guarantees a new numeric problem. A unique seed or a different generated id is not by itself meaningful numeric variety.

An independent owner/orchestration probe recorded in [the next-wave disposition](../../../reports/orchestration/next-wave-after-plan-24-review-disposition.md) enumerated 220 ordered no-overlay proper-result relatively-prime candidates under the same `curated-review` bounds; 110 pairs collapse when operand swaps are identified. Of those, 18 ordered candidates (9 swap-equivalent cases) meet its two-choice criterion. Those nine are candidates, not nine authored or runnable problems. The dossier preserves that bounded assumption rather than generalizing the number to all content profiles or set sizes.

## Discriminating cases and exclusions

- **A repeated numeric draw:** the seed sample repeated between 2 and 13 times per 40 draws. A generated seed cannot serve as proof that Next changed the learner's math task.
- **Eligible math with missing authored data:** `curated-nested-addition` has exact math and an eligible bar path, but no authored premise/reflection routes. Content validity alone cannot admit it to the current reflection-enabled episode.
- **A valid alternate unit beyond capacity:** `curated-shared-factor-addition` has a valid LCD route at 24 and a valid alternate at 48; the latter exceeds the current denominator ceiling. Preserve the math truth, use only a fully authored supported route, and provide the DECISION-036/Plan 22 boundary if a learner proposes the unsupported path.
- **A mathematically supported candidate not yet instructional:** `curated-simplify-first-state` is arithmetically and visually supportable but asks for a task not authorized by this packet.
- **A proper result that does not reach the whole-crossing concept:** the current canonical `11/12` result is not evidence for crossing-one-whole practice.
- **An improper result that does not authorize mixed numbers:** `10/8` and `5/4` fixture facts do not turn on mixed-number input or operational practice, which remain outside this increment.

The sample excludes subtraction, arbitrary denominator inputs beyond the current generated profile, future focused concepts, active simplification lessons, mixed-number operations, unreviewed task-copy hypotheses, and generated learner selection. It does not establish §30 variety or any child-facing efficacy claim.
