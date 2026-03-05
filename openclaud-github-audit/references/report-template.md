# Audit Report Template

Use this template when the user asks for a formal audit report or when a consistent structure will help.

## Findings

### [severity] Short finding title

Why it matters:
One or two sentences describing the impact in production, security, maintainability, or delivery speed.

Evidence:
- `path/to/file`
- relevant function, module, workflow, or config detail

Recommended fix:
State the smallest credible remediation. If the issue is architectural, describe the target boundary or control point.

## Open Questions / Assumptions

- State any important uncertainty that could change the conclusion.
- State which areas were not inspected deeply.

## Overall Assessment

- Summarize the repository's engineering posture in 2-4 sentences.
- Name the top 1-3 risks worth addressing first.

## Optional Additions

Add these only if useful:

- `Strengths`: note well-designed areas briefly
- `Risk register`: group findings by theme
- `30/60/90 day plan`: sequence remediation work
