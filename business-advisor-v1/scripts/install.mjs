#!/usr/bin/env node

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(__dirname, "..");
const skillName = path.basename(skillDir);

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--target") {
      args.target = argv[index + 1];
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function defaultTarget() {
  if (process.env.CODEX_HOME) return path.join(process.env.CODEX_HOME, "skills");
  return path.join(os.homedir(), ".codex", "skills");
}

function printHelp() {
  console.log(`Usage:
  node scripts/install.mjs [--target <skills-dir>]

Default target:
  \${CODEX_HOME}/skills when CODEX_HOME is set
  ~/.codex/skills otherwise`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const targetRoot = path.resolve(args.target || defaultTarget());
  const destination = path.join(targetRoot, skillName);

  await fs.mkdir(targetRoot, { recursive: true });
  await fs.rm(destination, { recursive: true, force: true });
  await fs.cp(skillDir, destination, {
    recursive: true,
    filter: (source) => !source.includes(`${path.sep}node_modules${path.sep}`),
  });

  console.log(
    JSON.stringify(
      {
        installed: true,
        skill: skillName,
        destination,
        next: `Use $${skillName} or ask the agent to use ${destination}/SKILL.md`,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
