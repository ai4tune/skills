# Workflow Examples

## Example A: one-line request with missing details

User request:
"Make me a poster for a spring campaign, tech blue style."

Expected behavior:
1. Extract the initial intent: campaign poster, likely promotional, tech-blue style.
2. Ask only the most useful follow-up questions:
   - what is the main offer or message?
   - what is the campaign date or deadline?
   - do you have a qr code or logo to place?
3. Produce a poster plan.
4. Wait for confirmation.
5. Generate the final poster after confirmation.

## Example B: long source text plus optional assets

User request:
"Use this event intro to make a poster. I also have a qr code and logo."

Expected behavior:
1. Summarize the source into poster-ready copy.
2. Avoid copying long paragraphs.
3. Produce a poster plan with:
   - title
   - subtitle
   - up to 3 key points
   - time block
   - qr code placement
   - logo placement
4. Confirm any missing date, disclaimer, or brand-color requirement.
5. Generate the final poster only after the plan is accepted.

## Example C: enough detail already provided

User request:
"Create a recruitment poster for the ai co-learning meetup, title 'Join AI Co-Learning Club', every Saturday at 2 pm, community hall, youthful gradient style, qr code bottom right, logo top left."

Expected behavior:
1. Do not ask unnecessary questions.
2. Move directly to the poster plan.
3. Confirm only high-risk items if needed.
4. Generate the final poster after user approval.
