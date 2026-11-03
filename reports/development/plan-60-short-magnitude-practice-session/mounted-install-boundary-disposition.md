# Plan 60 mounted installation failure boundary

2026-11-02. Reviewed investigation/progress `1a86633` / `1d7d59b` and current
installFreshEpisode/render lifecycle. Orchestration authorizes the bounded approach
below. No detached renderer staging or broad transactional rendering refactor.

The pure-checkpoint request to test installation failures was too broad if read as
requiring exact rollback after arbitrary DOM/renderer destruction. Existing task
rendering is not transactional. This disposition distinguishes expected preparation
failures from unexpected post-commit display defects rather than claiming rollback.

1. Before committing, resolve/validate the authoritative destination, support/condition,
   public episode and applicable pure scene/capability. No mutation/destruction of
   current episode, draft/help/index or DOM during preparation. Expected refusal,
   invalid candidate, stale ticket and injected preparation failure preserve the
   old state exactly, including failed restart. Use existing neutral retry/return.
2. Keep session model commit and app selection/generation synchronization small and
   synchronous, without arbitrary caller callbacks, further content resolution or
   rendering inside the controller commit. Check captured identities/generations
   before commit; don't advance index on failed preparation or duplicate activation.
3. Treat subsequent renderer/DOM construction as post-commit presentation. If it
   unexpectedly throws, invalidate/end the session and return safely to the existing
   practice entry with one neutral actionable display-failure notice. Clear stale
   controls and do not show completion, silently skip, auto-retry, persist progress
   or claim the prior work/screen was preserved. No complex rollback/recreation of
   previous renderer internals. Preserve standalone usability and prevent recursion
   through the same broken session renderer during fallback.
4. Exercise an actual injected display failure after commit separately from preparation
   failure: safe visible entry, no active session/partial problem, no stale Next and
   fresh session start possible after defect removal. Record this as a fail-safe,
   not transactional rollback. Old episode retention applies to preparation failure;
   ephemeral unfinished work may be lost on an unexpected display defect.

This clarifies an exceptional error boundary, not a new learner task, persistence
policy or planned feature. Keep changes limited to session admission/install/fallback
and necessary existing app seams. Stop if a general render refactor is still needed.
Resume mounted work with original hash/dialog/support/focus requirements. Existing
focused restart/invalid/stale tests pass per implementer; final independent artifact
verification remains. No extra advisor at this checkpoint; consolidated delivery
review and owner complete-session acceptance/deployment remain separate.
