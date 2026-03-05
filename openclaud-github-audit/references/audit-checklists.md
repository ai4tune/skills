# Audit Checklists

Use these prompts to deepen the audit only where needed. Do not dump the full checklist into the final answer.

## Architecture

- Identify the main execution model: monolith, service-oriented, job-based, event-driven, CLI, frontend app, library, or hybrid.
- Check whether domain logic is separated from transport, persistence, framework glue, and UI concerns.
- Check whether configuration, secrets, and environment branching are centralized and testable.
- Check whether ownership boundaries are visible from directories, packages, or modules.
- Check for circular dependencies, god modules, or shared utility layers that hide coupling.
- Check whether external integrations are wrapped behind stable interfaces.
- Check whether failure paths and operational assumptions are explicit.

## Performance

- Find loops that trigger repeated network, filesystem, or database access.
- Find unbounded in-memory aggregation, buffering, or caching.
- Find heavy work on request/response paths, render paths, or synchronous startup paths.
- Check for missing pagination, batching, streaming, or concurrency control.
- Check whether cache invalidation, TTL, and consistency behavior are explicit.
- Check whether retry logic can amplify load or create thundering herds.
- Check whether the code measures latency, throughput, queue depth, or resource usage anywhere meaningful.

## Security

- Check how authN and authZ are enforced, and whether sensitive paths bypass shared guards.
- Check whether untrusted input crosses shell, SQL, template, serializer, URL fetch, or filesystem boundaries.
- Check whether secrets appear in source, tests, examples, logs, workflows, or default config.
- Check whether tokens are scoped, rotated, redacted, and stored safely.
- Check CI workflows, release pipelines, and dependency update practices for obvious supply-chain risk.
- Check whether multi-tenant data, role checks, and object ownership are verified server-side.
- Check whether security-relevant events are logged without leaking sensitive data.

## Code Quality

- Find duplicated business rules implemented in multiple modules.
- Find unclear public APIs, surprising side effects, or mutation-heavy flows.
- Find catch-all error handling that hides failures or drops context.
- Find missing tests around auth, money, data integrity, migrations, async jobs, or parsing.
- Find dead code, stale feature flags, or abandoned abstractions that increase cognitive load.
- Find weak typing, weak validation, or unchecked assumptions at boundaries.
- Find docs or onboarding gaps that would block safe maintenance.

## Severity Calibration

- `critical`: likely exploitable, data-lossy, outage-prone, or fundamentally unsafe
- `high`: serious production, security, or scaling risk with clear impact
- `medium`: meaningful design or implementation issue that should be planned and fixed
- `low`: localized issue, cleanup opportunity, or weak signal of broader debt

## Good Findings

Prefer findings that:

- connect code evidence to operational impact
- explain the root cause, not just the symptom
- suggest a realistic remediation path
- identify repeated patterns, not one-off nits
