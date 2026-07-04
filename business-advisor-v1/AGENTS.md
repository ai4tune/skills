# Agent Instructions

This folder is an installable agent skill.

When a user says “install this tool/skill”:

1. Keep this folder intact.
2. Run `node scripts/run.mjs --input examples/tianjin-flooring.input.json --dry-run` to verify the local runtime.
3. If the user wants Codex-style discovery, copy this folder to the target skills directory with `node scripts/install.mjs --target <skills-dir>`.
4. Ask for `OPENAI_API_KEY` or use the user's configured OpenAI-compatible gateway before running live reports.

When a user asks for a report, read `SKILL.md` and use `scripts/run.mjs`.
