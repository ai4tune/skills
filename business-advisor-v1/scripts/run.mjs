#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillDir = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--input") {
      args.input = argv[index + 1];
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node skills/business-advisor-v1/scripts/run.mjs --input <input.json> [--dry-run]

Environment:
  OPENAI_API_KEY    Required unless --dry-run is used.
  OPENAI_BASE_URL   Optional. Defaults to https://api.openai.com/v1
  OPENAI_MODEL      Optional. Defaults to gpt-4.1`);
}

function assertInput(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Input must be a JSON object");
  }
  if (typeof input.question !== "string" || input.question.trim().length < 6) {
    throw new Error("Input field question must be a string with at least 6 characters");
  }
  if (input.focusAreas !== undefined && !Array.isArray(input.focusAreas)) {
    throw new Error("Input field focusAreas must be an array when provided");
  }
  if (input.sourceMaterials !== undefined && !Array.isArray(input.sourceMaterials)) {
    throw new Error("Input field sourceMaterials must be an array when provided");
  }
}

async function readText(relativePath) {
  return fs.readFile(path.join(skillDir, relativePath), "utf8");
}

function fillTemplate(template, values) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => values[key] ?? "");
}

function formatFocusAreas(focusAreas = []) {
  if (!focusAreas.length) return "未指定";
  return focusAreas.map((item) => `- ${item}`).join("\n");
}

function formatSourceMaterials(sourceMaterials = []) {
  if (!sourceMaterials.length) {
    return "未提供外部搜索资料。";
  }

  return sourceMaterials
    .map((source, index) => {
      const title = source.title || `资料 ${index + 1}`;
      const url = source.url ? `\nURL: ${source.url}` : "";
      return `## ${index + 1}. ${title}${url}\n\n${source.content || ""}`;
    })
    .join("\n\n");
}

async function callChatCompletions({ systemPrompt, userPrompt, model }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is required unless --dry-run is used");

  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Model request failed: ${response.status} ${body}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Model response did not contain message content");
  return content;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.input) {
    printHelp();
    process.exit(args.help ? 0 : 1);
  }

  const input = JSON.parse(await fs.readFile(args.input, "utf8"));
  assertInput(input);

  const model = process.env.OPENAI_MODEL || "gpt-4.1";
  const systemPrompt = await readText("prompts/system.md");
  const researchPlanTemplate = await readText("prompts/research-plan.md");
  const reportTemplate = await readText("prompts/report.md");
  const values = {
    QUESTION: input.question.trim(),
    FOCUS_AREAS: formatFocusAreas(input.focusAreas),
    SOURCE_MATERIALS: formatSourceMaterials(input.sourceMaterials),
  };

  const researchPlanPrompt = fillTemplate(researchPlanTemplate, values);

  if (args.dryRun) {
    const placeholderPlan = "DRY_RUN_RESEARCH_PLAN";
    const reportPrompt = fillTemplate(reportTemplate, {
      ...values,
      RESEARCH_PLAN: placeholderPlan,
    });
    console.log(JSON.stringify({ model, systemPrompt, researchPlanPrompt, reportPrompt }, null, 2));
    return;
  }

  const researchPlan = await callChatCompletions({
    systemPrompt,
    userPrompt: researchPlanPrompt,
    model,
  });
  const reportPrompt = fillTemplate(reportTemplate, {
    ...values,
    RESEARCH_PLAN: researchPlan,
  });
  const reportMarkdown = await callChatCompletions({
    systemPrompt,
    userPrompt: reportPrompt,
    model,
  });

  console.log(
    JSON.stringify(
      {
        researchPlan,
        reportMarkdown,
        sourceCount: input.sourceMaterials?.length ?? 0,
        model,
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
