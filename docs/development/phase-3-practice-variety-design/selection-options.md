# Authored-Set and Selection Options

**Decision direction:** DECISION-040 already selects a small reviewed authored set and a learner-triggered Next action. This file compares mechanics and proposes admission rules; it does not reopen that source/control choice or authorize generated learner draws.

## Minimum set admission

An item should enter a learner-selectable set only after all of these are recorded for that exact item:

1. exact content identity and immutable authoring revision;
2. registered episode-definition id/revision and completed-state semantics;
3. applicable condition and support profiles, including any intentional equality of outputs;
4. validated math and authored content;
5. canonical and offered alternate path eligibility, with honest refusal/recovery for unsupported valid proposals;
6. complete premise/reflection/help data that the definition actually uses; and
7. mounted learner routes for each admitted path, wrong/recovery behavior, reset, replay, access parity, and capability refusal.

The first set cannot deliver “different” with one item. Today one item is admitted and only one learner goal exists. A Next control should not be exposed for a set that has no second reviewed item.

## Two selection mechanisms

| Property | Fixed authored order (initial candidate) | Bounded generator draw (later candidate only) |
|---|---|---|
| Source and learner-facing explanation | “Another reviewed problem in this practice set.” Each item is known before release. | “A problem selected from reviewed rules” only if generation, content, task data, and visible capability all pass. Math generation alone cannot support this wording. |
| Reproducibility | Stable ordered identities; repeat same sequence and failure exactly. | Stable only with generator/schema/profile versions and seed, plus authored task-data and eligibility versions. |
| Variety | Bounded by authored inventory; author can deliberately cover denominator relationship, scale, result form, reducibility and magnitude. | Can draw more numeric cases, but without deduplication it repeats. Each 40-draw sample contained 2–13 duplicate draws beyond its unique ordered operand pairs. |
| Authorship burden | High per item; reviewers can inspect prompt, premise/reflection alternatives and refusal behavior. | High if every selected instance still needs authored instruction. A generation success is not a shortcut for these decisions. |
| Failure behavior | Admission blocks incomplete items before they enter the list; exhaustion is predictable. | Needs finite attempt bound, duplicate detection, path and authored-data refusal reasons, and explicit exhaustion. Never loop until something works or fall back to unsuitable content. |
| Learner reach | Compatible with a small set and a clear “Next problem” action. | Not authorized until authored selection demonstrates reset, refusal, access and replay, then a separate investigation/mechanism gate is accepted. |

**Initial recommendation:** keep the fixed authored-set mechanism already selected by DECISION-040. Freeze the item list/order in a reviewed artifact. Let Next select a different item in that list only after the current episode is actually complete. On exhaustion, report that the learner reached the end of that set and offer a return to practice choices. Do not wrap to item one silently; do not substitute a generated item.

### Conditional first two-item list

The current admitted inventory is too small to offer Next. If the owner accepts a same-definition numeric increment, the smallest concrete candidate list is:

1. **First:** the existing `2/3 + 1/4 = 11/12` fixture, retaining its current canonical 12ths and authored 24ths routes.
2. **Second (proposed only):** `1/2 + 1/3 = 5/6`, with canonical 6ths and alternate 12ths. A read-only content check confirms that the current curated builder accepts the math/content facts and that both paths fit current fraction-bar limits. The fixture identity, premise and reflection choices for both denominators, registered route, conditions, reset/replay behavior, and browser witnesses are all still missing.

This two-item list is not admitted. After owner acceptance of the contract and candidate, a bounded follow-on packet may author and validate the second item's missing identity, task data and routes while implementing selection. Full admission is required before learner exposure, not before that authoring work can begin. The candidate preserves the current learner goal and episode definition; it adds numeric variation, not denominator-relationship, result-form, reducibility, or magnitude breadth. If the owner prefers a family-level concept change instead, defer the second entry until that family and its definition are accepted and implemented. Do not pull a valid fixture from Plans 17–20 into the set before those gates.

For each retained condition/support choice, the selector should accept an item only when the item declares that profile supported, intentionally equivalent, or not applicable. A genuinely not-applicable task dimension is valid and does not silently change the learner's selected configuration. An item that declares the selected profile unsupported is skipped during the finite successor search; if no compatible different item remains, show a clear “No more problems in this set for these settings” state and offer practice choices or an explicit settings change. Missing/corrupt authored data or an invalid path is a distinct admission failure: do not silently skip it or mount another item; stop on the known completed surface, explain that this problem is unavailable, and provide a return action.

This is a proposal for owner disposition, including order and exhaustion, not an adopted learner policy. It needs an identity-aware selection mechanism before it can become source code.

## Order, duplicates, and variety

A deterministic order makes individual differences explainable, but the owner must choose whether the first item is always the current canonical fixture and whether ordering is pedagogical or simply stable. Do not label an order “progression” unless an instructional sequence is accepted.

For initial fixed lists, require a Next target with a different vetted content identity and different ordered numeric operands/result or a clearly authored change in task purpose. An ID change alone can disguise a repeated numeric problem. Across a broader set, audit meaningful variety in denominator relationships, scale factors, raw result forms, reducibility, and magnitude. The current tiny set cannot establish Roadmap §30 breadth.

If the learner's selected goal is “different denominators,” nested and shared-factor items are variations within it, not separate taxonomy controls. Like-denominator and above-one items need the goal-model choice in [practice-type-model.md](practice-type-model.md). A set may have task-specific definitions, but it cannot attach a single goal-wide episode definition to items with different schedule behavior.

## Rival claims and falsifying observations

| Claim | What would falsify it in a future review |
|---|---|
| A fixed authored list is easy to audit and replays the intended task. | Change an authored premise/reflection answer without a new immutable item revision and observe old replay accept different semantics; or repeat the same numeric item under a new ID and call it meaningful variety. |
| A Next action changes the problem. | Complete one episode and click Next; observe the same ordered operands/result, same content identity, or unchanged work/input/help state. |
| Candidate math can be admitted when representation is eligible. | Select a valid content instance whose chosen/alternate route exceeds bar capacity or lacks its definition's authored reflection and observe the app advance instead of refusing/recovering. |
| A bounded generator draw can supply variety. | Request consecutive draws under the declared seed/order rules and observe repeated numeric problems, missing authored data, unsupported valid units, or unbounded retry. The current 40-draw duplicates already falsify any unconditional novelty claim. |
| One broad addition goal feels focused and calm. | The selected set mixes zero-, one-, and two-renaming tasks or proper and above-one results without a learner-understood goal, or its label implies all those tasks before they are runnable. No learner observation is claimed here; this is a design-review falsifier for later rendered/owner acceptance. |

## Follow-up triggers

Revisit bounded generated learner practice only after the authored Next route has browser witnesses for stable retry, different Next identity, no leaked work, refusal/exhaustion, access parity and replay reconstruction, and before the Phase 3 §31 exit gate. Revisit broader denominator paths when the set or capability bounds expand. Keep general nested common-unit choice behind the follow-up obligation after the focused one-renaming route works in both operand orders. A new generation investigation and mechanism gate must precede activation.
