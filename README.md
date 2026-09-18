# FractionFlow

A calm, interactive fraction-practice environment that helps learners move from visual
understanding to efficient symbolic computation. Free to use, browser-based, no accounts
and no advertising — designed to be published as a static site on GitHub Pages.

## Project status

This project is currently in the design and specification phase.

The initial scope focuses on addition and subtraction of proper fractions and mixed
numbers, with particular attention to:

- equivalent fractions;
- common denominators as common units;
- fraction bars and number lines;
- meaningful transitions between visual and symbolic representations;
- scaffolded practice that gradually fades toward independent symbolic work;
- deterministic, testable mathematics and vetted instructional interactions.

## Founding documents

The project's durable design specifications live in `docs/founding/`.

| Document | Owns |
| --- | --- |
| `docs/founding/00-principles.md` | Project-wide principles, constraints, and non-goals |
| `docs/founding/01-instructional-model.md` | Learning goals, conceptual progression, and mastery |
| `docs/founding/02-interaction-grammar.md` | Learning episodes, representation transitions, scaffolding, and interaction behavior |
| `docs/founding/03-math-and-content-model.md` | Deterministic mathematics, problem families, and content structure |
| `docs/founding/04-system-architecture.md` | Technical boundaries and organization |
| `docs/founding/05-quality-and-validation.md` | Mathematical, instructional, visual, and accessibility validation |
| `docs/founding/06-roadmap.md` | Development sequence, core scope, and stretch goals |

Each durable concept has one canonical home. Documents reference one another rather
than duplicate definitions. The founding documents are added as the project's first
durable content, after the repository's one-time Bootstrap customization flow
completes.

## Guiding idea

The mathematics should be the interface.

The project favors a small number of carefully connected representations, meaningful
transformations, one focal idea at a time, and progressively less scaffolding as
learners gain fluency.

See `docs/founding/00-principles.md` for the project's founding constraints and design
philosophy.

## Repository orientation

This repository is a [Bootstrap](https://github.com/mrsmithelhs/Bootstrap) consumer:
work proceeds in bounded, packet-tracked agent handoffs, and durable decisions are
recorded rather than left in conversation.

- `docs/project-seed.md` — the seed brief: what this project is, its defining
  constraints, tooling intent, and proposed structure.
- `BOOTSTRAP-PROMPT.md` — drives the one-time customization flow (placeholder
  resolution, template activation). Run once, then it is done.
- `docs/decision-log.md` / `docs/open-questions.md` — durable decision and
  question records.
- `docs/development/` — the packet board (live after customization completes).

## Privacy and data boundary

This is a **public** repository. Never commit personal information, learner or student
data, account credentials, analytics keys, or deployment secrets.

The product's own posture matches: no accounts, no advertising, no learner tracking.
Any progress storage is local to the learner's browser, and remote-storage features
would require an explicit privacy design (see `docs/founding/00-principles.md`,
principles 20–21, when it lands).
