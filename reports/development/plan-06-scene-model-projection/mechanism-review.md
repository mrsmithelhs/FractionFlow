# Plan 06 Mechanism Review

**Review date:** 2026-09-19  
**Verdict:** Approved with binding implementation clarifications  
**Implementation authority:** The implementer may begin Plan 06 source work within the packet's
write scope. This approval does not authorize a renderer, DOM, application shell, condition
switcher, deployment work, packet-status work, or a change to Plan 02, Plan 03, or Plan 05 facts.

## Approved core mechanism

Implement a pure semantic Scene Model in `src/interaction/scene.js`, exported through the existing
interaction barrel. It receives validated Plan 05 episode state, an explicit representation role,
and an explicit presentation mode, and emits an immutable discriminated union: a renderable semantic
scene or a fail-closed refusal. It copies validated content and learner-established instructional
facts without computing mathematical truth, eligibility, transitions, coordinates, animation frames,
or learner-facing strings. A scene is a disposable derived snapshot, never mutable source state.

The projection's role is to make current semantic relationships perceptible for later renderers and
the linear path while leaving the instructional engine as the sole authority for beats, responses,
support use, recovery, and learner accomplishments. Standard-motion, reduced-motion, and instant-test
modes may change only presentation of known endpoints; they must have identical semantic endpoints.

## Binding clarifications

1. **Support is current semantic input, not scene history.** The scene must carry the validated
   support configuration and current support consequence needed by a downstream consumer (including
   `nextResponseSupport` when applicable), while excluding `intentHistory`, `completedBeats`,
   `helpHistory`, `replayHistory`, `retryHistory`, and response-provenance arrays. It must project the
   Plan 05 help state as supplied and must not decide the unresolved help-ladder reset policy.

2. **Capability refusal must not invent a continuation.** Use an explicit role-to-verdict mapping.
   A requested number-line role is `not-in-phase-2` and must produce a fail-closed Phase 2
   scope/capability refusal with no fabricated symbolic continuation. Emit a continuation only when
   the resolved upstream verdict itself supplies one, such as an established fraction-bar path whose
   rendering verdict is `ineligible`. Keep unavailable role, valid-but-outside-authored-coverage, and
   valid-but-outside-representation-capability distinct.

3. **Staleness is an enforceable, canonical contract.** Do not call ordinary `JSON.stringify()` a
   canonical key. Build canonical JSON-wire scene copies and a deterministic recursively key-sorted
   derivation serialization; reject malformed or non-wire inputs before projection. Export an explicit
   current-scene assertion/guard, not merely advisory documentation. Tests must put that guard before
   stub-consumer delivery and prove that stale scenes and refusal results never reach a consumer.

4. **Whole semantics distinguish operands from results.** An operand's stable whole is not the
   content record's `representationFacts.wholeSpan`, which describes raw-result magnitude. Preserve a
   stable-whole identity/relationship for each proper operand. Copy a result whole span only into
   operation/result meaning after that result is learner-established. Add a crossing-one fixture that
   proves an operand never inherits the result's whole span.

5. **Demonstrate condition expressiveness without taking Plan 09.** Test every currently declared
   D-01, D-02, D-05, and CM-01 arm, including the matching-with-distractors CM-01 form, and show that
   they retain one structural scene schema. These are contract fixtures only: do not build the runtime
   switcher, persistence, learner-facing labels, or a second condition registry. Plan 09 remains
   responsible for the runtime registry and its reviewer-facing switcher. The projection copies an
   upstream condition; it never chooses one.

6. **Established-only disclosure remains strict.** Current forms, operation/result meaning, transition
   endpoints, and preferred final form may appear only when the corresponding Plan 05 establishment
   authorizes them. Capability validation and source-context comparison may inspect upstream data, but
   no unreached mathematical value may enter a renderable scene.

## Required validation emphasis

In addition to the packet checklist, demonstrate all six Scene Model obligations with the approved
guard boundary: deterministic projection across consumers; no downstream mathematical authority;
equal semantic endpoints across presentation modes; stale/refused state rejected before a consumer;
enough structured meaning for the later linear path; and replayable source/instructional meaning with
no presentation state as authority. The delivery requires Branch A advisor consultation under the
already-determined instruction-read-only, post-hoc-verified posture.
