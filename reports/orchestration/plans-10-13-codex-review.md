## Bottom line

These packets have learned the vocabulary of Plan 09’s failure, but three of them do **not yet force evidence that the promised behavior is reachable from the real app**. As written, I would refuse to hand **Plan 11, Plan 12, and Plan 13** to an implementer. I would allow Plan 10 to proceed as a docs-only investigation after a modest gate/evidence amendment, but I would not let it become the reason the project delays all contact with actual learner use or all route-level verification.

I left the packets unchanged. I also checked the current composition code and re-ran the focused app/scene suites: **40 tests passed** and the production build passed. That confirms several Plan 09 repairs are now embodied in the code—for example, four registered conditions exist, the app-shell test genuinely clicks each condition through the gear menu, and the transform outputs have distinct structural renderings. It does not change the broader conclusion: those protections were added after the reachable-route failures, not because the packet system had required them in advance.

## 1. Do the new packets prevent the Plan 09 failure?

Not reliably yet. “Reachable,” “captured output,” “browser verification,” and “state the sequence” are all improvements over Plan 09’s earlier language, but they are still mostly **report instructions**. An implementer can satisfy them with a manually invoked internal state, a screenshot of a renderer in isolation, or a narrative of what would happen—precisely the gap that caused the repairs.

The missing load-bearing mechanism is an **executable reachability matrix**. For every claimed learner-visible behavior, the packet should require a row with:

| Required evidence | Why it matters |
|---|---|
| Registered context or condition ID | Prevents an unregistered/dead configuration from being credited. |
| Allowed starting surface | Distinguishes an actual app route from a direct factory call or injected test state. |
| Concrete user/reviewer action sequence | Makes “reachable” falsifiable. |
| Expected instructional state and observable output | Separates an internal flag from a visible product effect. |
| Negative control | Confirms the behavior is not permanently on, identical across conditions, or merely labelled differently. |
| Browser witness | Requires the trace to run from the mounted application at a named viewport and motion mode. |
| Automated route assertion where practical | Keeps a later refactor from returning the mechanism to dead code. |

A completion rule should say: **a behavior has not shipped unless an independent reviewer can start at the permitted entry point, perform the listed actions, and observe the specified difference.** `not run`, a direct internal invocation, or a report-only assertion is incomplete evidence—not a pass.

The current packets compare as follows:

| Packet | What is good | What still lets it become report theater | Required strengthening |
|---|---|---|---|
| **Plan 10** | It explicitly asks which content, generator change, and condition would reach each family; it requires code-level citations rather than speculation. | “What would reach it” can still be hypothetical. A family may be called reusable because symbols exist, with no executable current path or honest refusal proving the limit. | Require a reachability row for every “reuses existing motifs” classification, and an explicit current failure/refusal witness for every “needs new representation” classification. |
| **Plan 11** | It correctly identifies that static-vs-static reduced-motion parity was cheap evidence, and it requires same-beat standard/reduced output. | It does not require a trace that selects the animated condition through the app, reaches a conversion through normal actions, and proves a real mid-transition effect rather than a class, label, or screenshot staged by test code. | Require browser traces from condition selection → conversion → mid-transition → stable post-state → replay, in standard and reduced motion. Assert stable-whole geometry, visible standard-motion change, and a non-motion reduced-motion indication. |
| **Plan 12** | Entry, return, reset, and condition transport are all named explicitly. | It can prove a condition is present in replay data while accidentally always launching the default condition, or prove reset through a direct app call rather than the entry/return controls. It also omits an explicit focus contract. | Require entry → choose each registered condition → begin → observe its expected route signature; return mid-episode → re-enter → prove fresh state; and specify/verify focus placement after begin and after return. |
| **Plan 13** | It is the strongest of the four: it demands an actual reviewer sequence, same-beat captures, replay inclusion, and per-level agency comparison. | It never resolves where the reviewer is authorized to choose support, and it can still demonstrate a configured level through a test-only argument rather than a permitted app route. Its gate comes only after the cross-layer implementation. | Add a mechanism-confirmation gate that identifies the authorized upstream selector, every supported level’s action trace, its rendered differences, and the negative evidence that no renderer flag or learner-performance policy is involved. |

The Plan 09 record is particularly clear on this point. The condition switcher originally had a valid registry, state persistence in the replay envelope, and green tests, while all visible outputs were byte-identical. The repair only became trustworthy once the review actually selected each condition in the running application and compared the resulting DOM/behavior. [The unreachable-mechanisms record](/C:/AI/FractionFlow/reports/orchestration/phase-2-unreachable-mechanisms.md) is right about the diagnosis; the new packets need to turn that diagnosis into a required artifact rather than repeat it as a slogan.

## 2. Is the dependency graph right?

### Plan 11 does not wait on Plan 10

**The case for the current graph:** Plan 11 is narrowly about the existing episode and an already registered `D-01-A` condition. It does not need a cross-family answer to animate one established renaming. In fact, the future reach assessment would be more honest if it can assess a working animated arm rather than a permanently static placeholder. I would not make Plan 11 depend on Plan 10.

**The case against:** replacing `replaceChildren()` with a stable-identity subdivision path is foundational renderer work. It could quietly become the visual grammar that Plan 10 later treats as settled across families. The better fix is not a Plan 10 dependency; it is a **Plan 11 mechanism gate** that limits the animation to the existing unlike-denominator conversion, preserves the current scene contract, and explicitly says it makes a prototype arm testable rather than authoritative.

### Plan 12 does not wait on Plan 10

**The case for the current graph:** an entry page, deliberate start, and clean return are app-shell composition concerns. They do not need a decision about mixed numbers, crossing one whole, or the eventual Phase 3 family order.

**The case against:** Plan 12 is not merely rearranging title placement. It chooses a session shape, defines where reviewers select configuration, and creates the natural location for future reviewer-only controls. Its current text says both “resolve OQ-19” and “no new decisions,” while [OQ-19](/C:/AI/FractionFlow/docs/open-questions.md) still says the owner must decide whether an entry page ships, whether it gates the episode, how return works, and whether the gear belongs there. The packet has already chosen answers—entry page, one Begin control, and a return that discards state—without an owner mechanism decision.

So Plan 12 should not wait on Plan 10, but it **must stop at a short owner-approved mechanism proposal** before source work. That proposal should settle the entry-page/return shape and focus behavior. Otherwise the implementer is being asked to make the unresolved decision while being told not to make decisions.

### Plan 13 waits on Plan 10

**The case for the current graph:** if support fading is meant to become an axis shared across Phase 3 families, it is sensible to understand those families before making the support writer’s interface permanent. This avoids another “works only for the first fixture” abstraction.

**The stronger case against:** Plan 13’s concrete product scope is not a Phase 3 generalization engine; it is “make at least two support levels reachable” in the existing slice, starting with OQ-22. Plan 10 is a docs-only assessment and cannot by itself make a support setting reachable. Holding the first genuine repair of the owner-accepted weak Phase 2 criterion behind a broad dossier risks using architecture speculation to postpone behavior.

More importantly, Plan 13 has an unaddressed dependency on **Plan 12 or an explicit alternative owner decision**. DECISION-019 says the gear menu is condition-only. Plan 13 nevertheless needs a reviewer-reachable upstream support selector. It cannot silently place support into the gear, cannot make it a learner preference, and should not smuggle it through a test-only constructor. The packet’s phrase “consistent with the reviewer-only switcher’s existing boundary” is not an implementation contract; it is the unresolved design problem.

My recommendation is:

- Add an owner mechanism decision for the legitimate reviewer-only support-selection surface.
- Make Plan 13 depend on that decision and, if the entry page is its home, on Plan 12.
- Keep Plan 10 as an input to later generalization of the support model, not as the sole prerequisite for proving that the current ladder finally has a writer.

## 3. Is Plan 10 the right next packet, or displacement activity?

It is **not displacement activity by itself**. The project has a real, load-bearing unanswered question: the current fraction bar loudly refuses a result over one whole because silently drawing `10/8` as a full `8/8` bar would be mathematically dishonest. [OQ-20](/C:/AI/FractionFlow/docs/open-questions.md) correctly frames that as a representation and instructional question, not a CSS fix. The Phase 3 family/episode reach assessment is also the right way to avoid inventing eight episodes against a grammar tested only by one addition problem.

But Plan 10 becomes displacement if it is treated as the **only** next move or as a blanket prohibition on drafting any practical follow-on work. It produces no new learner path, no new user evidence, and no direct correction to the unresolved support-ladder weakness. Its current gate also says no Phase 3 implementation packet may even be drafted until the dossier is accepted; that is broader than necessary.

I would narrow its authority:

- Keep its OQ-20 and grammar-reach investigation.
- Require it to distinguish demonstrated reuse from plausible reuse.
- Let it inform Phase 3 family packets.
- Do **not** let it delay the route-level verification work, the entry-page owner choice, or the support-selection design decision.
- Pair it with a small, nonblocking owner-run child/learner observation opportunity when one is practical. That need not be formal research and should not block engineering under DECISION-020, but zero-child evidence should remain a planning fact that shapes what claims the project makes.

## 4. The packet missing entirely

The immediate missing packet is a **browser-backed interaction-route contract and regression harness**.

Call it something like:

> **Plan 10A — Reachable Behavior Contract and Browser Route Matrix**

Its job would not be generic “add end-to-end testing.” It would encode the hard-won Plan 09 lesson:

- enumerate every registered design condition;
- enumerate every reviewer-reachable support level once that exists;
- execute each declared action sequence through mounted app controls;
- assert the intended observable DOM/semantic distinction and relevant negative controls;
- exercise wrong-answer recovery, replay, motion/reduced-motion behavior, return/reset, and condition changes through ordinary routes;
- capture named browser evidence for layout, focus, and visibility claims that cannot be trusted to the mock DOM;
- fail when a registered condition has no declared route witness or when a route produces the same output as its purported alternative.

This should be deliberately narrow. It should not turn FractionFlow into a testing-framework side project or a synthetic child-usability study. But without a route contract, the same category of defect will recur: a clean primitive, a passing unit test, a reassuring label, and no learner path.

A separate, lower-priority nonblocking packet could prepare an owner-run small-n observation protocol and question set. That would help prevent product expansion from outrunning learner evidence, but it should not become a formal-research prerequisite or a gate that freezes the project.

## 5. Where the new orchestration was too easily satisfied

The “label promises more than its body delivers” caution should **not** be considered to be declining yet.

There is real improvement. The later Plan 09 repairs were often reviewed by driving the app, not merely reading the report. The current app-shell tests now directly select all four registered conditions and assert distinct rendered structures; they also exercise replay across conditions. That is materially better than the earlier situation.

But the claimed trend is not supported by the repair record:

- Repair 01 correctly said its own implementation claims held, but it also discovered that the prior Plan 08 credit for DECISION-026 had rested on `premisePromptLinear` merely existing. That is the original pattern, carried forward into Plan 09.
- Repair 03 fixed condition reachability but initially accepted a premise check whose two answers both completed the episode. The form became reachable before it became a meaningful check.
- Repair 04 found a recovery branch that was both semantically inverted and untested because the Phase 2 fixture could not reach it. Again: the branch existed; the body did not prove what the label implied.
- Repair 06’s initial report claimed the replay transition, focus behavior, control sizing, and reduced-motion result were correct. The subsequent review found an identical `pre`/`post` replay, destroyed focus, a sub-24px control, and invisible reduced-motion replay. One defect was printed in the report’s own evidence while the prose described the intended result instead.
- Repair 07 then found that the Repair 06 focus-restoration condition was still false at `reflect`: focus went to `BODY`, not back to the matching choice. The review explicitly notes that the intended behavior had been claimed twice without being observed.

That is not a declining rate; it is evidence that the failure mode changed from broad structural overclaim to **post-repair verification overclaim**. The distinction matters, but it is not enough to retire the caution.

I would preserve the standing caution until the project has several independently reviewed user-facing packets using a common route matrix and the matrix itself catches a deliberately seeded unreachable or identical-output defect. Until then, the correct posture is: a green test suite, a named behavior, an authored string, or a report capture is evidence of a component—not proof that a learner can reach and use the capability.

## Recommended disposition before assignment

1. **Amend Plan 10** with explicit reachability-witness requirements, then it may proceed as docs-only investigation.
2. **Do not assign Plan 11** until it has a mechanism-confirmation gate and an explicit browser route matrix for the animated condition, replay, standard motion, and reduced motion.
3. **Do not assign Plan 12** until the owner resolves OQ-19’s actual choices and the packet specifies focus/reset/condition-route evidence.
4. **Do not assign Plan 13** until an owner-approved, DECISION-019-compatible reviewer support-selection route exists; add a mechanism gate and likely a dependency on Plan 12 if the entry page is that route.
5. Draft the small, focused **reachable-behavior route-contract packet** before the next user-facing implementation packet, or make its required matrix a binding gate amendment shared by Plans 11–13.