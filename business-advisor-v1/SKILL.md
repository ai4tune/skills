---
name: business-advisor-v1
description: Generate boss-facing Chinese business research reports from a user research question. Use when the user asks to research an industry, market, policy, customer, competitor, product opportunity, or AI application opportunity and wants a Markdown report with a Research Plan, concrete business analysis, AI implementation suggestions, recommendations, risks, and source notes. Supports OpenAI-compatible gateways through OPENAI_API_KEY, OPENAI_BASE_URL, and OPENAI_MODEL.
---

# Business Advisor

Use this skill to produce a lightweight Deep Research-style business report for enterprise owners.

The workflow is fixed:

1. Convert the user's request into JSON matching `schemas/input.schema.json`.
2. Generate a Research Plan.
3. Generate a Markdown report.
4. Preserve the source boundary: if no `sourceMaterials` are provided, state that the report did not use external search.

## Input

Minimum input:

```json
{
  "question": "帮我研究天津木地板行业未来三年的趋势。",
  "focusAreas": ["竞争格局", "价格变化", "AI应用机会"]
}
```

When search or fetched pages are available, pass them as `sourceMaterials`:

```json
{
  "question": "帮我研究天津SPC地板未来三年的市场趋势",
  "focusAreas": ["竞争", "价格", "AI机会"],
  "sourceMaterials": [
    {
      "title": "资料标题",
      "url": "https://example.com",
      "content": "网页摘要或正文片段"
    }
  ]
}
```

## Run

From this skill directory:

```bash
node scripts/run.mjs --input examples/tianjin-flooring.input.json --dry-run
```

With an OpenAI-compatible API:

```bash
OPENAI_API_KEY=your_key OPENAI_MODEL=gpt-4.1 \
node scripts/run.mjs --input examples/tianjin-flooring.input.json
```

With a custom gateway:

```bash
OPENAI_API_KEY=your_gateway_key \
OPENAI_BASE_URL=https://your-gateway.example.com/v1 \
OPENAI_MODEL=your_model \
node scripts/run.mjs --input examples/tianjin-flooring.input.json
```

## Output

The runner prints JSON:

```json
{
  "researchPlan": "...",
  "reportMarkdown": "...",
  "sourceCount": 0,
  "model": "gpt-4.1"
}
```

Return `reportMarkdown` to the user unless they explicitly ask for the raw JSON.

## Quality Rules

- Do not fabricate real links, policies, reports, ratings, or company evidence.
- If no `sourceMaterials` are provided, the `# 来源` section must say the report did not use external search.
- Keep the report useful for a business owner: conclusion first, concrete analysis, clear recommendations, and AI opportunities split into immediate, needs-validation, and not-recommended.
- AI suggestions should include an implementation path, not just a list of ideas: business scenario, first step, required data or team support, and 2-4 week validation metric.
- When appropriate, mention external AI consulting, implementation partners, or lightweight prototype support as one option, but keep the language neutral and avoid promotional claims.
- Do not broaden this skill into crawler, workflow, memory, or multi-agent logic. Add those as later versions.
