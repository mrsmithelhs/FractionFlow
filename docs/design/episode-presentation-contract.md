# Episode presentation contract

Plan 62 implements these arrangements for ordinary comparison and comparison-then-distance; other episodes retain their current presentation until separately reviewed and migrated. Plan 52 owns feedback meaning and Plan 43 owns deliberate progression. This document adds arrangement, not instructional state or mathematical truth.

## Shared responsibilities

Present one concise active instruction and a clear mathematical referent. Use intrinsic stacked fractions and align an unknown decorative separator or accepted relation between the quantities. Expose the task and relation meaning accessibly without announcing the decorative question mark. Do not reveal answers or models before their instructional state permits.

Keep working material aligned with its task. A region need not be a card or heading. Use the existing app typography, readable prompt scale, 1rem region spacing, 0.75rem grouped-response spacing and 0.5rem control spacing as starting points. The comparison column is centered, up to 48rem and no wider than its available container. Other working surfaces may need more space. Let mathematical content retain intrinsic size; avoid fixed-height clipping.

Keep Plan 52 success, retry, incomplete/attention and optional help meanings, specific guidance, associations and existing focus/announcement paths. Keep Plan 43's deliberate Next or return and any active reflection. Do not introduce a step merely for visual uniformity.

Default reading and keyboard order is task and expression, conditional feedback/working material, optional Help, response, then Check. Help stays near the work and accurately exposes its native state. DOM, visible and keyboard order must agree. Numeric construction and direct manipulation can put their working controls before Help when those controls create the working area.

## Response variants

- **Relation choice — implemented for comparison and the first distance stage.** A labeled radio group and Check form a centered unit; Help precedes the response. The question mark is decorative; accepted relation retains its spoken meaning. Model selection and task-specific support remain distinct.
- **Numeric distance — implemented for Plan 51.** Help precedes labeled numerator and denominator fields and Check. The fields wrap naturally and retain their drafts, descriptions and stage-specific feedback. This is a separate mathematical responsibility after comparison.
- **Numeric construction — intended, not migrated here.** Inputs, draft representation, Help and Check may form a task-specific sequence because entry creates the work. Preserve field labels and incomplete versus zero.
- **Direct placement — intended, not migrated here.** The line, placement controls and linear alternative are the working area; Help and Check may follow them. Preserve pointer and non-drag participation and the same mathematical decision.

At narrow widths or enlarged text, allow controls to wrap, regions to grow and the page to scroll vertically. Preserve visible focus and at least existing 44px control targets. Avoid requiring all work to fit one viewport; inspect actual geometry and reading order. The separate entry-title overflow at 200% root text on a 360px viewport remains a follow-up.

## Current implementation map

`src/render/symbolic.js` owns fractions; `src/render/plan45-comparison.js` and `src/render/plan51-distance.js` own their task-specific markup. Existing `.plan45-expression`, `.plan45-relation-*` and `.plan45-response-region` rules in `src/app/styles.css` provide the current relation presentation; `.plan51-distance` and `.plan51-response` own distance-specific column and numeric form. These names describe today's implementation, not a required DOM or a general framework. App-level routing retains focus and progression ownership. Other episodes and any future shared abstraction require their own bounded review.
