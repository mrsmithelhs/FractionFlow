# FractionFlow project seed

This seed brief provides starting context for the customization agent and the first orchestrator. It records what is known and intended without preempting the technical and architectural decisions reserved for the first spikes.

## What this repository is

FractionFlow is a free, browser-based learning environment for practicing fraction addition and subtraction while strengthening the conceptual understanding that makes those procedures meaningful.

The interaction model centers on short, interactive mathematical narratives: the learner acts, observes mathematically meaningful transformations, and gradually assumes more responsibility for the reasoning.

FractionFlow is deliberately:
- **not** a worksheet generator;
- **not** a video library;
- **not** a manipulative sandbox;
- **not** an AI tutor.

## Defining properties

1. **Public and free by default.** The destination is a public GitHub Pages site anyone can use without friction. Because the repository and its remote are public, the public-remote PII boundary is absolute and applies to git history starting from the very first commit.
2. **The mathematics is the interface; the math core is the product.** A small, deterministic, exact-arithmetic fraction engine (handling equivalence, common units, addition/subtraction, regrouping, and simplification) is the load-bearing layer. All mathematical truth is computed there — never by the renderer, and never by a generative model. The system may generate problem instances; it must not invent mathematics.
3. **Static-only architecture.** No server, no accounts, and no backend. Everything the product needs must be hostable as static files on GitHub Pages. Any progress storage is local to the learner's browser.
4. **Learners are children.** Accessibility, calm design, readable typography, reduced-motion support, and appropriate touch targets are design inputs from the start, not compliance fixes retrofitted at the end.

## Scope discipline

The initial scope focuses on addition and subtraction of proper fractions and mixed numbers, with one unlike-denominator addition interaction reaching a high standard before breadth expands.

Explicit non-goals for this project:
- Learning Management System (LMS) features
- Full math curriculum coverage
- Generic manipulative platform
- Teacher dashboards
- Social or multiplayer features
- AI tutoring chatbots
- Reward-driven or gamified mechanics
- Formal assessment and grading

## Tooling intent (intent only, nothing installed)

The intended future toolchain is a Node-based dev environment producing a static build deployable to GitHub Pages.

Presumed, **not decided**:
- A component-oriented front-end with a build step;
- The math core implemented as a dependency-free, DOM-free module with property-based tests runnable headlessly in Node.

The specific build tool, test runner, and GitHub Pages deployment mechanism (deploying from a branch, `docs/` folder, or via GitHub Actions) are spike outputs, not initialization packet inputs. No build tooling, package manifest, or dependencies are installed during initialization.

## Proposed folder structure

This is a proposal to be ratified by the first spike, not an established decision:

```text
src/
  math/          # deterministic exact-arithmetic fraction engine — no DOM, no UI
  content/       # problem families, instance generation, seeds (inspectable data)
  interaction/   # episode/scaffold state machines (instructional state)
  render/        # fraction bars, number lines, symbolic notation (presentation)
  app/           # composition and routing
  styles/
tests/           # math property tests, interaction tests — node-runnable, no browser needed
docs/
  founding/      # durable design specifications (owner-added after customization)
scripts/dev/
reports/
```

This structure is ratified by the first spike rather than decided upfront because the build and deployment mechanism constrains where source, build output, and Pages-publishable content must sit. A structure decided first would risk needing to be redone.

## The separation rule

All system architecture is governed by a strict unidirectional pipeline:

`mathematical state → instructional state → presentation`

The render layer receives validated state and communicates it; it never computes mathematical truth. This rule serves as the architecture packet's first acceptance test.

## Seed packet outlines

These are prose outlines only. Do not create packet files (`plan-NN-*.md`) during initialization.

### Math core spike

Stand up the deterministic fraction engine: exact arithmetic, equivalence as renaming, common-unit denominators, addition/subtraction with regrouping, and simplification. Establish property-based tests (e.g., $a + (b - a) = b$; equivalence preserves magnitude; regrouping conserves quantity) and an inspectable problem-state schema. Headless with zero DOM. This is the foundation every later packet stands on.

### First learning episode spike

Implement one unlike-denominator addition episode: fraction-bar-first, scaffold fading, ask-before-tell, and reduced-motion honored — proven end-to-end in a browser before any second episode exists. One excellent interaction beats ten mediocre ones.

### GitHub Pages deploy spike

Verify build output published to the public GitHub Pages URL and working end-to-end with no backend. The deployment mechanism (branch vs. `docs/` vs. Actions) is decided and proven by this spike.

## Founding-documents note

The owner is authoring `00-principles.md` through `06-roadmap.md` separately and will place them into `docs/founding/` after this packet and the repository's one-time customization flow complete. Until then, references to the founding documents in `README.md` are forward pointers; this is expected and not a defect.
