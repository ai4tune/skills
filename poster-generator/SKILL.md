---
name: poster-generator
description: create marketing posters from a one-line request by guiding a short intake conversation, extracting the real brief, proposing a poster plan first, and then generating the final poster. use when the user wants an activity poster, campaign poster, promotion poster, recruitment poster, or announcement poster; when the user provides scattered event details and wants ai to summarize title and key selling points; or when qr codes, logos, and brand colors may need to be placed into the design.
---

# Poster Generator

Turn a loose poster request into a controlled two-step workflow: first produce a concise poster plan, then generate the final poster only after the plan is confirmed.

## Default workflow

1. Determine whether the user is asking for a poster, flyer, campaign visual, or promotional image.
2. Extract everything already provided from the user's message before asking follow-up questions.
3. Ask only for the minimum missing information needed to make a usable poster plan.
4. Produce a poster plan using the structure in `references/poster-brief-template.md`.
5. Wait for user confirmation or edits.
6. Generate the final poster using the confirmed plan and the layout rules in `references/layout-rules.md`.

## Intake rules

Start from the user's original wording. Do not ask the user to fill a long form.

Extract these fields when available:
- poster goal
- audience
- event or campaign name
- title candidate
- subtitle candidate
- key points
- event time
- location
- call to action
- visual style
- brand color
- has qr code
- has logo

Ask follow-up questions only for the most important gaps. Prioritize in this order:
1. event time or deadline
2. core offer or message
3. whether qr code or logo should be placed
4. preferred style or brand color

When information is sparse, ask at most 3 focused questions in one turn.

## Mandatory constraints

Do not generate the final poster until a poster plan has been shown.

If event timing is materially important and still missing, ask for it before the final poster.

If the user mentions a qr code, treat it as an optional uploaded asset and explicitly remind yourself that it must remain complete, sharp, and scannable in the final design.

If the user mentions a logo, treat it as an optional uploaded asset and preserve its proportions. Do not crop, stretch, redraw, or turn it into decorative noise.

If the user provides long raw copy, summarize it into poster-ready language instead of pasting everything verbatim.

Keep the poster copy concise:
- one strong title
- one short subtitle or support line
- up to 3 key points
- one clear call to action

## Plan-first behavior

Always present a poster plan before image generation.

The plan should include:
- communication goal
- title
- subtitle or support line
- up to 3 key points
- style direction
- layout recommendation
- logo placement recommendation when relevant
- qr code placement recommendation when relevant
- confirmation items

If the user has already provided enough detail, do not keep interviewing. Move directly to the poster plan.

## Final generation behavior

When the user confirms the plan, generate a final poster prompt that is faithful to the confirmed plan and the rules in `references/layout-rules.md` and `references/style-presets.md`.

The final poster prompt should:
- preserve the intended information hierarchy
- keep title and date highly legible
- preserve whitespace around qr codes
- keep logos secondary to the main message
- use the requested style or the closest preset
- avoid overcrowding and long text blocks

If the user did not specify style, choose the most suitable preset from `references/style-presets.md` based on the campaign type and audience.

## Output format for the planning step

Use the template in `references/poster-brief-template.md`.
Adapt wording naturally, but keep the same sections and decision logic.

## Reference files

- Use `references/poster-brief-template.md` for the structure of the plan.
- Use `references/layout-rules.md` for placement and hierarchy rules.
- Use `references/style-presets.md` when converting a vague style request into a visual direction.
- Use `references/workflow.md` for condensed workflow examples.
