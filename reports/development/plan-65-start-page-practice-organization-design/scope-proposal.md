# Plan 65 — Requirement 0 scope proposal

Status: proposed for orchestrator scope approval; not a design decision or owner adoption. Source snapshot inspected: `366b531eb3308448f2c5ab3de8791fa9398dc950`. Preflight `node scripts/dev/plan-status.js check 65`: RUNNABLE. Source observations below are preliminary, not browser or assistive-technology validation.

## Compact capability and reachability inventory

The current entry shell builds standalone buttons from `PRACTICE_TYPES` in `src/app/practice-types.js` and `src/app/app.js`. Its present goal/fragment IDs are:

| Learner goal | Standalone fragment ID |
| --- | --- |
| Add with different denominators | `sum-under-one` |
| Add with the same denominator | `like-denominator-addition` |
| Subtract with the same denominator | `like-denominator-subtraction` |
| Subtract with different denominators | `unlike-denominator-subtraction` |
| Place fractions on a number line | `bar-to-line-same-amount` |
| Compare fractions | `symbolic-fraction-comparison` |
| Place fractions together on a number line | `number-line-collection` |
| Find distance between fractions | `fraction-distance` |
| Place fractions on a two-whole number line | `two-whole-location` |
| Make wholes and remaining pieces | `whole-plus-fraction-construction` |
| Find the end on a number line | `directed-number-line-endpoint` |

The shell places the first addition button before the gear in DOM order and the remaining buttons afterward. It separately offers “Compare fractions, then find a distance”: the authored manifest contains three comparisons followed by a comparison-and-distance episode; its place is not saved. It is not a fragment-backed registry type. The comparison practice record is optional and browser-local; its panel offers a comparison launch. About and creator credit follow the record. Fragment lookup decodes the hash and resolves a current practice type; detailed route, focus, failure and accessibility witnesses remain to be checked in the dossier. Return currently focuses the entry title in `app.js`. Settings include learner-relevant display/support options as well as inspection controls: their exact boundaries need tracing, not a blanket developer label.

## Proposed bounded comparison

Both options retain a clearly scoped default launch of the existing four-episode comparison/distance sequence, labelled “Compare fractions, then find a distance” with a short four-problem cue; no resume, personalization, history prerequisite or new selection policy. Both retain a secondary “Choose what to practice” path, existing supported fragments and identities, record, settings, About and credit.

1. **Dedicated browse view.** Start presents the authored sequence and “Choose what to practice”; the latter opens a goal-grouped view with a Back control and real mounted practice buttons. Tradeoff: a clear separation and room for descriptions, but an extra view and focus/return transition.
2. **Expandable browse section.** The same start actions reveal goal-grouped practice buttons in an accessible expandable section on the start page. Tradeoff: less navigation, but the page grows when expanded and focus/scroll and reflow require care.

Candidate groups to test against every current entry: add and subtract; compare and find distance; place and move on a number line; make wholes and parts. These are provisional learner-facing concepts, not a claim that grouping is settled. All current same/different denominator choices remain individually reachable within the relevant group; no unavailable goal appears as a teaser. Two hypothetical future families will be shown only as examples of placement, not as current offerings.

## Proposed dossier and gate

After scope approval, trace the registry, actual entry order, settings, supported fragments, route witnesses, session exits and return focus, record actions, About/credit, keyboard/linear paths and existing Plan 64 contract. Deliver a complete goal/fragment-to-control map, compare the two options and recommend one with literal clicks/copy, first-Tab and return-focus proposals, failure handling, first visit and no-history cases, narrow/Chromebook/enlarged-text arrangements including title overflow, and unrendered sketches clearly marked as proposals. Identify actual source/test owners and a separately authorized first implementation slice, with mounted browse-control witnesses and no forced hidden controls. Record evidence limits and migration risks; do not claim rendered, AT or learner validation.

No source, tests, dependencies, prototype, full build, scheduler, new content, status changes or deployment. Plan 64 is now marked complete in its packet; verify its accepted contract and current source during the dossier without changing its exit policy. No automatic advisor: this checkpoint is prose-only. Orchestrator scope approval is requested before any main dossier work; eventual owner adoption and a separate source packet remain required.

## Approved scope refinement

The orchestrator approved this scope in `scope-approval.md`. Primary emphasis remains an owner choice: compare the existing arithmetic-first launch against the authored comparison/distance session within the two layouts. Specify actual start destination and focus, including direct fragment and record-panel launches; do not silently return to a retained browse view. Grouping and copy remain concise. Plan 64's accepted shell contract and Plan 63's record boundaries govern.
