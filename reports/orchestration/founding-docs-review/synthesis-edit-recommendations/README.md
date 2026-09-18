# Synthesis Edit-Recommendation Format

## Purpose

This folder holds implementation-ready proposals for improving the FractionFlow founding documents after the independent-review synthesis. These files are advisory inputs for a later reconciliation and owner-review pass. They do not amend the founding documents, settle owner decisions, or authorize implementation.

## Write boundary

Each recommendation agent:

- owns exactly one assigned recommendation file in this folder;
- may read throughout the repository to verify context and wording;
- must not edit a founding document, the synthesis, another recommendation file, or any other repository file;
- must not change packet status, commit, push, install software, or modify the environment;
- must not rely on another recommendation agent's output unless its assignment explicitly says to do so; and
- must leave contested design hypotheses as questions or prototype variables rather than silently deciding them.

## File naming

Use a two-digit ordering prefix and a short kebab-case cluster name:

```text
NN-short-cluster-name.md
```

## Required document structure

Every recommendation file must use the following sections.

### 1. Scope

State:

- the recommendation cluster addressed;
- the exact repository files read deeply;
- files swept only for cross-document effects; and
- topics intentionally left outside the assignment.

### 2. Recommendation index

Provide a table with these columns:

| ID | Target | Operation | Recommendation | Evidence status | Owner gate |
|---|---|---|---|---|---|

Use stable IDs formed from the file prefix plus a two-digit sequence, such as `20-01`.

Allowed operations are `ADD`, `DELETE`, `REPLACE`, `MOVE`, `SPLIT`, and `CROSS-REFERENCE`. Use more than one only when the edit is genuinely compound.

Evidence status must be one of:

- `ESTABLISHED`: directly supported by repository evidence or an already-adopted project constraint;
- `PLAUSIBLE`: supported direction, but the exact wording or placement involves bounded judgment;
- `JUDGMENT`: an editorial or architectural recommendation that should be evaluated on coherence rather than treated as an empirical fact; or
- `SPECULATION`: not ready for a definite edit and normally belongs in the deferred section instead.

The `Owner gate` column must say either `wording review`, `decision required`, or `none`. A proposal that would create or resolve a product decision must use `decision required`; do not disguise it as an editorial change.

### 3. Detailed recommendations

Create one subsection per recommendation, using this template:

```markdown
### ID — Short title

**Target:** `docs/founding/NN-name.md` → `exact heading or unique anchor`

**Operation:** `ADD | DELETE | REPLACE | MOVE | SPLIT | CROSS-REFERENCE`

**Evidence status:** `ESTABLISHED | PLAUSIBLE | JUDGMENT`

**Owner gate:** `wording review | decision required | none`

**Problem:** Explain the concrete ambiguity, contradiction, omission, or maintenance risk.

**Current anchor/text:** Quote the smallest exact passage needed to locate the edit. For an addition, name the heading and the sentence after which it belongs.

**Proposed wording:**

> Give exact, paste-ready Markdown. For deletion, quote exactly what should be removed. For a move, identify both source and destination and state whether the wording changes.

**Rationale:** Connect the proposed wording to the synthesis and the canonical project constraints. Separate factual support from editorial judgment.

**Conforming edits:** List any other founding-document passages that would become inconsistent, redundant, or in need of a cross-reference. If none, say `None identified`.

**Preserves:** State the nearby commitments, open questions, and non-goals that this change deliberately does not alter.

**Conflicts or dependencies:** Identify likely overlap with another recommendation cluster or a prerequisite owner decision. If none, say `None identified`.

**Verification:** Give concrete checks a later editor can perform after applying the change, including searches for superseded wording and cross-document consistency checks.
```

If one conceptual repair requires edits in several founding documents, keep it as one recommendation with one primary target and explicitly enumerated conforming edits. Split it only when the edits can be accepted independently.

### 4. Deferred or rejected changes

List relevant synthesis ideas that were inspected but not promoted into definite change proposals. For each, state why: unresolved evidence, owner decision, prototype question, outside scope, or insufficient benefit.

This section is required even if it contains only `None`.

### 5. Suggested application order

Give the file-level sequence a later editing pass should follow. Note dependencies between recommendations and identify any edits that should be accepted or rejected together.

## Recommendation quality rules

1. Recommend only changes that are a definite improvement in clarity, internal consistency, testability, safety, or decision hygiene.
2. Use exact headings and the smallest useful current-text quotation. Do not rely on line numbers alone because the documents will move during later editing.
3. Supply paste-ready wording. A diagnosis without exact replacement or insertion text is incomplete.
4. Keep the proposal as narrow as the identified defect. Do not rewrite a whole section to repair one sentence.
5. Preserve the pipeline `mathematical state → instructional state → presentation`, exact deterministic arithmetic, static deployment, local-only learner data, child-centered accessibility, and owner control.
6. Do not convert research hypotheses or prototype variables into canonical requirements. In particular, do not settle animation versus static presentation, morphing versus side-by-side comparison, bridge frequency, number-line timing, fixed denominator ceilings, pixel anchors, persistence timing, or prompt density unless an existing owner decision already settles the point.
7. Do not invent quantitative thresholds, compliance claims, research citations, learner outcomes, or implementation details that the repository does not support.
8. Treat external research as exceptional. If explicitly authorized and used, record the dated source and explain why repository evidence was insufficient. Otherwise work from repository evidence.
9. Flag overlap honestly. Independent files may conflict; do not pre-reconcile by weakening or hiding a recommendation.
10. Use repository-relative paths throughout so the proposal remains portable.

## Later reconciliation contract

A later pass should compare recommendation IDs, group compatible edits, expose conflicts, and route load-bearing decisions to the owner before changing any founding document. Presence in this folder means “specific proposal ready for evaluation,” not “approved change.”
