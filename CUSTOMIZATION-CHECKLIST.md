# Customization Checklist

Every project-specific template token listed below must be resolved in the customization targets before Bootstrap is usable. This file is the authoritative list; it may retain the literal token names as checklist labels after customization.

The customizing agent reads your project and resolves each item. Items it cannot determine from the project are marked `[UNRESOLVED]` and presented to the owner.

**The agent must not invent policy.** If a placeholder requires an owner decision, the agent surfaces it here and stops rather than guessing.

After the agent finishes, the owner reviews this file. Every item should be resolved or explicitly deferred with a reason.

---

## Required: project identity

| Placeholder | Where used | Resolved Value |
|---|---|---|
| `{{PROJECT_NAME}}` | AGENTS.md.template, CLAUDE.md.template, orchestrator prompt, implementer prompt, design-review prompt | `FractionFlow` |
| `{{ONE_LINER}}` | AGENTS.md.template, orchestrator prompt, implementer prompt, design-review prompt | `FractionFlow is a calm, browser-based learning environment for practicing fraction addition and subtraction, designed to help learners move from visual understanding to efficient symbolic computation without accounts or advertising.` |
| `{{STAGE}}` | AGENTS.md.template, orchestrator prompt, implementer prompt, design-review prompt | `design and specification phase` |

## Required: project structure

| Placeholder | Where used | Resolved Value |
|---|---|---|
| `{{AREA_MAP_TABLE}}` | AGENTS.md.template | Populated with key project areas: Math Core (`src/math/`), Content (`src/content/`), Interaction (`src/interaction/`), Render (`src/render/`), App (`src/app/`), and Founding Docs (`docs/founding/`). |
| `{{REPO_STRUCTURE}}` | AGENTS.md.template | Tree listing top-level directories: `.claude/`, `.codex/`, `docs/`, `reports/`, `scripts/`, and planned `src/` & `tests/`. |
| `{{ROUTING_TABLE}}` | AGENTS.md.template | Populated with topic mappings: `docs/project-seed.md`, founding documents in `docs/founding/` (`00-principles.md` through `06-roadmap.md`), `docs/workflows/packet-tracking-system.md`, and `docs/development/packet-creation-guidance.md`. |

## Required: technical

| Placeholder | Where used | Resolved Value |
|---|---|---|
| `{{KEY_COMMANDS}}` | AGENTS.md.template | Documented that build and test commands will be established by the initial tooling spike (no `package.json` installed during initial design and specification phase). Included packet-status commands (`list`, `check`, `lint`, `render`, `set`) and noted planned `npm run dev:console` command hub. |
| `{{ARCHITECTURE_CONSTRAINTS}}` | AGENTS.md.template | 1. **Strict Unidirectional Pipeline**: `mathematical state → instructional state → presentation`. Render layer never computes math truth.<br>2. **Deterministic Exact Arithmetic Core**: `src/math/` is pure logic, zero DOM, zero UI dependencies, zero generative AI in the math loop.<br>3. **Static-Only GitHub Pages Architecture**: No server, no backend, no accounts. All assets deploy statically. Progress persistence is strictly browser-local.<br>4. **Child-Centered Accessibility & Calm Design**: Accessibility, readability, reduced-motion, and touch targets are foundational day-one design inputs. |

## Required: contracts and data rules

| Placeholder | Where used | Resolved Value |
|---|---|---|
| `{{PROJECT_SPECIFIC_DATA_RULES}}` | AGENTS.md.template guardrails section | `Public repository PII boundary is absolute: Never commit personal information, learner or student data, account credentials, analytics keys, or deployment secrets. The product posture is strictly static with no accounts, no advertising, and no learner tracking; any progress storage must remain local to the learner's browser.` |
| `{{PROJECT_SPECIFIC_CONTRACTS}}` | orchestrator prompt | 1. **The Separation Rule**: Strict unidirectional pipeline `mathematical state → instructional state → presentation`.<br>2. **Deterministic Exact Arithmetic Core**: All math truth computed deterministically in pure `src/math/`.<br>3. **Static-Only GitHub Pages Deployment**: No server/accounts/backend; browser-local progress.<br>4. **Canonical Specifications Home**: `docs/founding/` owns durable specs once added; docs reference one another rather than duplicate.<br>5. **Child-Centered Accessibility**: Reduced motion, accessible typography, and child-appropriate touch targets. |

---

## Required: what NOT to copy (Bootstrap-self exclusion list)

Bootstrap tracks its own development using the same packet system it ships. That means Bootstrap's own copy of this folder contains **live, Bootstrap-specific content that must never be copied into a new project**:

| Do NOT copy | Copy instead |
|---|---|
| `docs/development/README.md` (Bootstrap's own live packet index) | `docs/development/README.md.template` (the empty index - rename it per below) |
| `docs/decision-log.md` and `docs/open-questions.md` (Bootstrap's own live governance records) | `docs/decision-log.md.template` and `docs/open-questions.md.template` (empty portable scaffolds - rename them per below) |
| `docs/development/plan-*.md` (Bootstrap's own meta-packets, e.g. `plan-01-bootstrap-sync-ledger-and-drift-audit.md`) | nothing — a new project starts with zero packets and creates its own from `docs/development/packet-template.md` |
| `reports/development/plan-*/` (Bootstrap's own packet reports) | nothing — a new project's reports folder starts empty |
| `reports/advisor-consultation-reflections/` and `reports/advisor-consultation-reflections-rollup.md` (Bootstrap-self reflection archive and rollup) | nothing — a new project's reports folder starts without Bootstrap-self reflection data |
| `reports/fleet-scans/` (Bootstrap-self fleet-triage reports) | nothing — a new project's reports folder starts without Bootstrap's fleet reports |
| `bootstrap-capabilities.json`, `docs/bootstrap-capabilities.md`, `CHANGELOG.md`, `docs/bootstrap-adoption-schema.md`, `docs/bootstrap-sync.md`, `scripts/bootstrap-audit.js`, `scripts/bootstrap-adopt-copy.js`, `scripts/bootstrap-adoption-inventory.js`, `scripts/bootstrap-advisor-reflections.js`, `scripts/bootstrap-advisor-reflections.test.js` | these are Bootstrap-self sync tooling (used to audit and adopt into *consumers* of Bootstrap) — they belong only in Bootstrap, not in the consumer being instantiated |
| `scripts/bootstrap-fleet-scan.js` and `scripts/bootstrap-fleet-scan.test.js` (Bootstrap-self fleet evidence tooling) | nothing — fleet scanning operates over Bootstrap's whole consumer registry and is not consumer-adoptable |
| `bootstrap-adopters.json`, `scripts/bootstrap-consumer-registry.js`, `scripts/bootstrap-consumer-registry.test.js`, `docs/bootstrap-consumer-registry.md`, `scripts/bootstrap-dev-console.js`, `scripts/bootstrap-dev-console.test.js`, `scripts/bootstrap-fleet-console.js`, `scripts/bootstrap-fleet-console.html`, `scripts/bootstrap-fleet-console.test.js` | Bootstrap-self consumer registry data, tooling, and dev consoles (plan-19/plan-21/plan-34); keep the ignored local data and Bootstrap-self implementation, tests, and documentation out of consumer initialization |
| `docs/bootstrap-dev/` (Bootstrap-self orchestrator/implementer starting prompts, **and the `incoming/` cross-project proposal drop folder**) | nothing — these are for working on Bootstrap itself, not on the project being instantiated; the consumer uses `docs/agent-starting-prompts/*` instead |
| `.claude/settings.local.json` (Bootstrap local settings) | nothing — these are for working on Bootstrap itself; the consumer's environment handles its own local settings (beyond basic scope; added for manual-fallback safety) |

Everything in the initializer allowlist (`scripts/bootstrap-init.js`) is project-agnostic and meant to be copied. Treat that allowlist as the source of truth for manual fallback setup rather than inferring portability from the repository tree.

This exclusion is what keeps Bootstrap usable as a template source while also being its own tracked project: new-project instantiation must still yield a clean empty packet index, never Bootstrap's own backlog.

## Required: capability selection (`.bootstrap-adoption.json`)

Bootstrap is not "copy everything and forget it" — it ships a **capability ledger** (`bootstrap-capabilities.json`), and a new project is supposed to be **born tracked**: every capability gets a recorded position before setup is reported done, not silently assumed.

*(Note: If the project was initialized using `bootstrap-init.js`, a starter `.bootstrap-adoption.json` manifest already exists in the root, and the capability definitions are summarized in `docs/development/bootstrap-capabilities-summary.md`. Read the summary and the manifest to verify the entries and versions and resolve any "deferred" states with the owner, rather than generating the file from scratch using `bootstrap-capabilities.json` or `docs/bootstrap-adoption-schema.md` which are absent.)*

1. **Read capability definitions.** If initialized via `bootstrap-init.js`, read them from the local `docs/development/bootstrap-capabilities-summary.md`. If manual fallback, read `bootstrap-capabilities.json` from your upstream copy of the Bootstrap repo. For each capability entry, walk it in this order and apply the matching default — defaults exist so most projects don't have to deliberate on every entry, but every entry still gets a recorded decision, not a silent skip:
   - **`channel: "core"`** — default is **adopt**. Declining a core capability is a real policy decision (every core entry's `declineGuidance` says it isn't recommended) — record it only on an **explicit owner statement** in this checklist, never on the agent's own judgment.
   - **`channel: "recommended"`** — default is **adopt**, but present the capability's `purpose` and `declineGuidance` to the owner for confirmation before finalizing. The owner may decline by citing the `declineGuidance` reason or their own.
   - **`channel: "optional"`** — default is **ask, don't take silently**. Do not adopt an optional capability without an explicit owner "yes."
   - **`adoptionKind: "project-specific-pattern"`** — Bootstrap ships no files for these (e.g. `dev-console-hub`); record whether the owner intends to build the pattern, for the manifest's sake. There is nothing to copy or decline either way.
2. **Check `dependsOn` before finalizing.** If a capability is being marked `adopted` while any capability in its `dependsOn` list is `declined` or otherwise absent, that is an incoherent manifest (e.g. adopting `packet-status-set-verb` while declining `packet-status-system`). **Do not auto-resolve this** — flag the conflict to the owner and wait for a decision (adopt the dependency too, or decline the dependent capability as well).
3. **Leftover files from a declined capability are not deleted.** The agent does not selectively remove a declined capability's `portableFiles` from the freshly copied tree — that is a destructive operation this flow deliberately does not perform. Instead, **print a one-line note per declined capability whose files are still present** (e.g. "declined `dev-console-hub` — no files shipped for this one" or "declined `decision-log` — `docs/decision-log.md` is still present; remove manually if undesired") so the owner knows to clean up by hand if they want to. This is not a correctness problem: `bootstrap-audit.js` treats `declined` as silent regardless of what the behavioral probe finds, so leftover files never produce a false drift signal later.
4. **Emit or Update `.bootstrap-adoption.json`** at the project root, covering every capability in the ledger — not just the adopted ones. (If initialized via `bootstrap-init.js`, verify and update the existing file; if manual fallback, emit a new one). Per the schema in `docs/bootstrap-adoption-schema.md` (consult upstream if manual):
   - Top level: `lastBootstrapAudit` (today's date), `bootstrapVersion` (the `version` field from the ledger, read mechanically).
   - Each entry: `capability` (the ledger id), `state` (`adopted`, `declined` or `deferred` per the decisions above), and for `adopted` entries, **`capabilityVersion`** set to that capability's own version from the ledger.
   - `declined` entries carry the owner's actual stated rationale in `localRationale` — never an invented or generic one.
   - `sourceCommit` may be omitted.
5. **Validate before reporting done**: confirm `.bootstrap-adoption.json` parses as valid JSON and every entry has the required fields per `docs/bootstrap-adoption-schema.md` (consult upstream if manual). A full tracked-mode `bootstrap-audit.js` self-audit against the new project is optional extra confidence, not required.

### Capability Decisions

| Capability | Channel | Adoption Kind | Version | State | Rationale / Notes |
|---|---|---|---|---|---|
| `packet-status-system` | core | verbatim | 1.4.0 | adopted | Core packet tracking tooling (`plan-status.js`). |
| `packet-status-set-verb` | core | verbatim | 1.0.0 | adopted | Atomic set verb for lifecycle changes. |
| `dev-console-hub` | recommended | project-specific-pattern | 1.1.0 | adopted | Planned for implementation during tooling spike. |
| `agent-starting-prompts` | core | configurable | 1.7.0 | adopted | Prompts configured for FractionFlow. |
| `falsification-check` | recommended | verbatim | 3.0.0 | adopted | Review discipline for investigation packets. |
| `reports-archive` | core | configurable | 1.0.0 | adopted | Progress report folder conventions. |
| `root-agent-guide` | core | configurable | 1.0.0 | adopted | Canonical `AGENTS.md` and pointer `CLAUDE.md`. |
| `decision-log` | recommended | configurable | 1.1.0 | adopted | Append-only decision log and open questions. |
| `subagent-delegation` | recommended | configurable | 2.0.0 | adopted | Owner-approved adoption; rosters intact in `.claude/` and `.codex/`. |
| `review-response-tiers` | recommended | verbatim | 1.0.0 | adopted | Owner-approved adoption; managed block intact in orchestrator prompt. |
| `advisor-consultation` | core | verbatim (managed prose) | 1.0.3 | adopted | Core thread-level consultation contract. |
| `commit-discipline` | core | verbatim (managed prose) | 2.1.0 | adopted | Core git commit rules and concurrency modes. |

**Conflicts and leftovers:**
- `dependsOn` checks: **0 conflicts detected**. All adopted capabilities have their required dependencies adopted.
- Declined capabilities: **0 declined**. No leftover files require cleanup notes.
- Manifest file: `.bootstrap-adoption.json` is updated and validated against the adoption schema.

## Checklist: file actions

After resolving all placeholders, the customizing agent must:

- [x] Replace every listed project-specific token in the initialized `*.template` files and role-specific starting prompts. Literal token names may remain in `BOOTSTRAP-PROMPT.md` and this checklist where they describe the setup process.
- [x] Rename `AGENTS.md.template` → `AGENTS.md`.
- [x] Rename `CLAUDE.md.template` → `CLAUDE.md`.
- [x] Rename `docs/README.md.template` → `docs/README.md`.
- [x] Rename `docs/decision-log.md.template` → `docs/decision-log.md`.
- [x] Rename `docs/open-questions.md.template` → `docs/open-questions.md`.
- [x] Rename `docs/development/README.md.template` → `docs/development/README.md`.
- [x] Confirm none of the "Do NOT copy" files above were copied in (Bootstrap's own `docs/development/README.md`, its `plan-*.md` packets, its `reports/development/plan-*/` folders, its sync-tooling files, or `docs/bootstrap-dev/`).
- [x] Confirm `.claude/agents/` contains the four roster definitions (`explorer.md`, `reviewer.md`, `researcher.md`, `implementer.md`) and is left intact.
- [x] Confirm `.codex/agents/` contains `reviewer.toml`, `researcher.toml`, and `implementer.toml`, and that no project `explorer.toml` shadows Codex's built-in explorer.
- [x] Verify that the `subagent-delegation` managed-prose block in `AGENTS.md` is left intact and not de-templated.
- [x] Walk the capability-selection procedure above; record an explicit `adopted`/`declined`/`deferred` decision for every capability in the local capabilities summary (or upstream ledger for manual fallback); resolve any `dependsOn` conflicts with the owner rather than auto-resolving.
- [x] Emit `.bootstrap-adoption.json` at the project root covering every capability; confirm it parses as valid JSON with the required fields.
- [x] Note any declined capability whose files are still physically present, for the owner's awareness (not automatically deleted). (None declined).
- [x] Run `node scripts/dev/plan-status.js render` first (even with no packets, this regenerates the index between markers).
- [x] Run `node scripts/dev/plan-status.js lint` from the project root. It should exit 0 (no packets exist yet). If it fails, fix the issue before reporting done.
- [x] Present this checklist to the owner with every item marked as resolved, unresolved, or deferred.

## Checklist: owner review

After the agent finishes:

- [ ] Every listed project-specific token is replaced in customization targets or explicitly marked unresolved for owner review.
- [ ] `.template` suffixes are gone from all initialized files.
- [ ] `lint` exits 0.
- [ ] `AGENTS.md` correctly describes the project.
- [ ] The 8 guardrails in `AGENTS.md` are present and make sense for this project.
- [ ] `{{PROJECT_SPECIFIC_DATA_RULES}}` reflects your actual privacy/asset constraints.
- [ ] `{{PROJECT_SPECIFIC_CONTRACTS}}` reflects your actual durable contracts.
- [ ] No source-project-specific content leaked in. If this folder came from another project, run a grep for that project's name, area names, platform names, and domain-specific vocabulary; confirm hits are only inside marked example callouts or in the checklist instruction itself.
- [ ] `.bootstrap-adoption.json` exists, covers every ledger capability, and every `declined`/etc. entry's rationale is something you actually said — not something the agent invented.
- [ ] Any `dependsOn` conflict the agent flagged has been resolved by you, not silently picked by the agent.

---

## Notes

The `scripts/dev/plan-status.js` file does not contain placeholders — it is already project-agnostic. It discovers packets by scanning `docs/development/plan-*.md` relative to its own location.

The `docs/workflows/packet-tracking-system.md` file does not contain placeholders — it is already written in project-agnostic language.
