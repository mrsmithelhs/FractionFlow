# Proposed episode presentation contract — not yet approved or implemented

This paper proposal extends, does not replace, Plan52's accepted feedback meaning and Plan43's deliberate progression. It is a flexible selection guide; unmigrated episodes remain current behavior until separately approved. Mathematical and instructional state remains upstream of presentation.

## Shared hierarchy and ownership

- Active task: one concise instruction and clear mathematical referent, with no duplicate explanatory interface copy. Renderer owns wording and appropriate task heading.
- Expression: intrinsic stacked fractions (`src/render/symbolic.js`) and existing `.plan45-expression` centered alignment, `clamp(1rem, 6vw, 3rem)` spacing; unknown decorative `?`, accepted relation exposed in meaningful spoken form. Long mathematical content may wrap or scroll locally when necessary, never clip. Renderer supplies accessible task/group question without repeating decorative glyph.
- Outer working column: for comparison slice use existing `.plan45-comparison` / scoped Plan51 equivalent, `min(100%, 48rem)`, auto inline margins, border-box, 1rem grid gap. These are a proposed starting token set, not a requirement to constrain a number line or construction workspace. Use existing app typography, intrinsic fraction sizing and readable 1.2–1.6rem prompt scale; no fixed-height clipping.
- Feedback: reuse Plan52 success, retry, attention/incomplete and optional-help semantics and styles, associated inputs/fieldset and existing focus/live path. Preserve specific mathematical guidance and active reflection. No new classification or redundant success sentence. Region is not necessarily a box or heading.
- Working area: aligned with its task, space using existing 0.5rem control, 0.75rem grouped response and 1rem region gaps; retain models only when state permits and equivalent linear descriptions.
- Default active sequence: expression/instruction, conditional feedback or working material, optional Help, response, Check. Keep DOM, reading and keyboard order consistent; do not CSS-reorder. Help is near its work, disclosure truthfully indicates open/closed and does not conceal required work. Region-level structure can vary; no universal DOM.
- Progression: preserve current Plan43 responsibility, deliberate Next/recognizable return and active reflection; no automatic advance or fabricated step. App owns navigation/focus; renderer owns visible progression control.

## Variants and justified exceptions

1. **Relation choice:** centered fieldset with accessible question and native radio choices; Check centered directly beneath; optional Help precedes it. Maintain selected draft and cue/model policy. Existing `.plan45-relation-*` and `.plan45-response-region` are the first-slice owners.
2. **Numeric/construction:** associated labeled inputs and relevant draft/work stay together; natural wrapping with Check following them. Help may follow fields/draft and precede Check, as in Plan58, where entering values creates the work. Plan51 distance keeps its numerator/denominator identity and existing draft/focus; this proposed variant is not a migration of Plan58.
3. **Direct placement:** working line/target and pointer or non-drag alternatives precede Help and Check; selection control is part of working area. Preserve equivalent linear choice and movement semantics. Plan53 remains unmigrated.

At narrow widths and enlarged text, allow groups and help controls to wrap, widths to shrink, heights to grow, and page to scroll vertically; retain usable focus indicators and at least existing 44px minimum targets. Do not force every task into one viewport or replace intrinsic mathematical geometry with fixed-height overflow. Test actual computed geometry and focus, not class names. The known entry-title issue is separate.

Only the comparison/distance implementation is proposed for this packet. Numeric and placement examples document intended flexibility, not adoption or certification of existing episodes. Canonical destination proposed: `docs/design/episode-presentation-contract.md` after gate; future migration requires separate scope and evidence.
