---
name: openclaud-github-audit
description: Audit GitHub repositories, pull requests, and codebases for project architecture, performance, security, reliability, maintainability, and code quality. Use when asked to review a GitHub project, perform technical due diligence, identify systemic risks, assess design quality, inspect hotspots, or produce a prioritized engineering audit report with concrete findings and remediation advice.
---

# OpenClaud GitHub Audit

Perform a repository audit as a senior engineer doing technical due diligence. Optimize for specific findings, architectural judgment, and actionable remediation instead of generic style commentary.

Read [references/audit-checklists.md](references/audit-checklists.md) when you need detailed review prompts for architecture, performance, security, and quality. Read [references/report-template.md](references/report-template.md) when you need a consistent output structure.

## Workflow

1. Establish scope.
Determine whether the request targets the whole repository, a subdirectory, a branch diff, or a pull request. If the request is ambiguous, infer the broadest safe scope and state that assumption.

2. Build repository context.
Inspect top-level structure, package manifests, build files, CI config, deployment config, test layout, and primary entrypoints. Identify the runtime model, major dependencies, architectural boundaries, and critical data flows before judging implementation details.

3. Choose the audit depth.
Default to a balanced audit across:
- project architecture
- performance and scalability
- security and secrets handling
- code quality and maintainability

Increase depth in the area most relevant to the repository domain. Example: security for auth/payment/data systems; performance for APIs, data pipelines, realtime systems, or frontend rendering hotspots.

4. Review from system to code.
Start with architecture and operational shape, then drill into risky modules, critical paths, and repeated patterns. Prefer evidence from actual code, tests, config, and CI over assumptions.

5. Produce prioritized findings.
Focus on material issues:
- broken or fragile architecture boundaries
- performance bottlenecks or scaling risks
- security flaws or unsafe defaults
- correctness risks
- maintainability hazards that will compound over time

Do not pad the report with trivial naming or formatting comments unless they indicate a broader engineering problem.

## Audit Heuristics

Use these heuristics while reviewing:

- Prefer system-level risks over isolated style nits.
- Prefer user-impacting or operationally expensive issues over theoretical concerns.
- Treat missing observability, missing tests on critical flows, and unsafe defaults as meaningful findings.
- Distinguish confirmed defects from plausible risks. Label inferred risks clearly.
- When evidence is incomplete, say what you inspected and what prevented stronger conclusions.
- Trace problems back to root causes such as poor boundaries, weak ownership, missing contracts, or absent automation.

## What To Inspect

Inspect the following in roughly this order:

### 1. Architecture

- module and service boundaries
- dependency direction and layering
- configuration and environment handling
- data flow, state management, and side-effect control
- coupling between domain logic, transport, persistence, and UI
- deployment and operational assumptions

### 2. Performance

- obvious hot paths, synchronous bottlenecks, N+1 patterns, repeated I/O
- expensive serialization, parsing, rendering, or network chatter
- cache strategy, batching, pagination, backpressure, and concurrency limits
- algorithmic complexity in frequently executed paths
- startup, bundle size, memory, or database access patterns where relevant

### 3. Security

- authentication, authorization, and tenant isolation
- input validation and output encoding
- injection risks, unsafe deserialization, SSRF, path traversal, and XSS/CSRF classes where relevant
- secret management, token handling, and credential leakage
- dependency and supply-chain exposure visible from manifests and workflows
- insecure defaults in CI/CD, cloud config, or local tooling

### 4. Code Quality

- duplication, dead abstractions, and unclear ownership
- missing tests around critical behavior
- poor error handling and retry behavior
- non-deterministic behavior, race conditions, and hidden global state
- unclear APIs, weak contracts, and surprising side effects
- documentation gaps that materially slow maintenance

## Evidence Standard

For each finding, include:

- severity: `critical`, `high`, `medium`, or `low`
- concise title
- why it matters
- concrete evidence with file references
- likely impact
- remediation direction

When possible, cite exact files and lines. If line numbers are unavailable, cite the smallest useful file or module scope.

## Output Rules

Lead with findings, not summary. Order by severity and expected impact. Keep each finding concise but technically defensible.

Use this structure unless the user requests a different format:

1. Findings
2. Open questions or assumptions
3. Brief overall assessment

If no significant findings are present, say so explicitly and then call out residual risks, blind spots, or test gaps.

## Review Style

- Be direct and specific.
- Avoid vague advice like "improve architecture" without naming the broken boundary or tradeoff.
- Suggest remediation that matches the codebase maturity; do not prescribe large rewrites unless the current design justifies it.
- Separate strategic issues from tactical fixes.
- Prefer incremental, high-leverage improvements.

## Example Triggers

Use this skill for prompts like:

- "Audit this GitHub repo before we adopt it."
- "Review this codebase for architecture and security risks."
- "Perform technical due diligence on this project."
- "Find performance bottlenecks and maintainability issues in this repository."
- "Audit this PR for systemic problems, not just style."
