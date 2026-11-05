# Plan 65 — Proposed reachability map

Proposed, not implemented. Source basis `src/app/practice-types.js` (`PRACTICE_TYPES`), `src/app/app.js` (`createShell`, fragment resolver, `returnToEntry`), `src/app/magnitude-session.js`, `src/app/comparison-record-panel.js`; snapshot `366b531eb3308448f2c5ab3de8791fa9398dc950`. Goal names below are current labels, not claims of new capabilities. The recommended layout exposes only admitted types in the expanded Choose section and uses the same registry identities; fragments remain direct routes.

| Proposed group | Existing button label | Registry ID and supported fragment | Proposed route |
| --- | --- | --- | --- |
| Add and subtract | Add fractions with different denominators | `sum-under-one` / `#sum-under-one` | Primary action and Choose → group → same goal |
| Add and subtract | Add fractions with the same denominator | `like-denominator-addition` / `#like-denominator-addition` | Choose → group → goal |
| Add and subtract | Subtract fractions with the same denominator | `like-denominator-subtraction` / `#like-denominator-subtraction` | Choose → group → goal |
| Add and subtract | Subtract fractions with different denominators | `unlike-denominator-subtraction` / `#unlike-denominator-subtraction` | Choose → group → goal |
| Compare and distance | Compare fractions | `symbolic-fraction-comparison` / `#symbolic-fraction-comparison` | Choose → group → goal; also Practice record → View record → Practice comparison when offered |
| Compare and distance | Find the distance between fractions | `fraction-distance` / `#fraction-distance` | Choose → group → goal |
| Compare and distance | Compare fractions, then find a distance | Session manifest `short-magnitude-practice`, not a standalone fragment | Choose → group → session; 3 comparisons and 1 comparison/distance episode |
| Number lines | Place fractions on a number line | `bar-to-line-same-amount` / `#bar-to-line-same-amount` | Choose → group → goal |
| Number lines | Place fractions together on a number line | `number-line-collection` / `#number-line-collection` | Choose → group → goal |
| Number lines | Place fractions on a two-whole number line | `two-whole-location` / `#two-whole-location` | Choose → group → goal |
| Number lines | Find the end on a number line | `directed-number-line-endpoint` / `#directed-number-line-endpoint` | Choose → group → goal |
| Wholes and parts | Make wholes and remaining pieces | `whole-plus-fraction-construction` / `#whole-plus-fraction-construction` | Choose → group → goal |

Exact session and standalone items and identities remain owned by their existing manifest/registry, not this table. If the owner selects the session as primary, it is additionally available there and the addition goal remains in Choose. Do not interpret a fragment as a session resume link. Unknown or malformed fragments are not new goals. Direct fragment admission and hash-change handling must retain their existing behavior, including the session's leave confirmation when applicable.

| Secondary capability | Current source boundary | Proposed access and preservation |
| --- | --- | --- |
| Optional comparison record | `comparison-record-panel.js`, controller and storage | Start → Practice record; remembering remains opt-in/local, with shared-browser and loss language; view, stop, clear, reset, errors and comparison launch remain. No practice prerequisite or unfinished-session storage. |
| Support | `support-levels.js`, app gear | Start → Settings → More support / Less support; preserve existing profile and applicability. |
| Inspection conditions | `conditions.js`, app gear | Start → Settings → clearly distinguished inspection choices, preserving existing condition rules rather than presenting them as universal learner settings. |
| About and attribution | `app.js`, `about.html` | Start → About FractionFlow; retain creator credit in start content. |
| Accessible episode participation | app view switch and task renderers | Every launch retains existing keyboard, visual/linear, support, Help and reduced-motion paths; route organization does not itself certify them. |

Two **hypothetical examples only**, not current capabilities: a future equivalent-fractions task could be assigned a new “Equivalent fractions” group in Choose; a future number-line estimation family could join Number lines. Either needs its own admitted registry capability, accessible label, identity, tests and owner-approved content; neither adds a first-screen button merely by existing in a plan.

Source inspection establishes the IDs and control wiring above, not successful current browser execution of every route. A later implementation must verify actual mounted launches and focus, including fragment and record routes, against real episode identities; preserve the pinned historical route contracts or explicitly migrate them under their own rules.
