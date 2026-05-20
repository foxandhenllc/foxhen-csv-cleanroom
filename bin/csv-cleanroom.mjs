#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BUILT_IN_PROFILES,
  buildIssueReport,
  buildMarkdownHandoff,
  cleanCsvText,
  stringifyCsv,
} from "../src/lib/csvCleanroom.js";

const args = process.argv.slice(2);

function printHelp() {
  console.log(`CSV Cleanroom

Usage:
  node bin/csv-cleanroom.mjs <file.csv> --profile email-list --out cleaned.csv --report report.json

Options:
  --profile <id>    ${BUILT_IN_PROFILES.map((profile) => profile.id).join(", ")}
  --out <path>      Cleaned CSV output path
  --report <path>   JSON issue report output path
  --markdown <path> Optional Markdown handoff output path
  --help            Show this help
`);
}

function readOption(name, fallback = "") {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? fallback : fallback;
}

function readPositionals() {
  const positionals = [];
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.startsWith("--")) {
      index += 1;
    } else {
      positionals.push(arg);
    }
  }
  return positionals;
}

if (args.includes("--help") || args.length === 0) {
  printHelp();
  process.exit(args.includes("--help") ? 0 : 1);
}

const inputPath = readPositionals()[0];
const profileId = readOption("--profile", "email-list");
const outPath = readOption("--out");
const reportPath = readOption("--report");
const markdownPath = readOption("--markdown");

if (!inputPath || !outPath || !reportPath) {
  printHelp();
  process.exit(1);
}

try {
  const profile = BUILT_IN_PROFILES.find((candidate) => candidate.id === profileId);
  if (!profile) {
    throw new Error(`Unknown profile "${profileId}". Available profiles: ${BUILT_IN_PROFILES.map((candidate) => candidate.id).join(", ")}`);
  }

  const csvText = readFileSync(inputPath, "utf8");
  const result = cleanCsvText(csvText, profile);
  const cleanedCsv = stringifyCsv(result.cleanedRows, result.headers);
  const report = buildIssueReport(result);

  writeFileSync(outPath, cleanedCsv);
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  if (markdownPath) {
    writeFileSync(markdownPath, buildMarkdownHandoff(result));
  }

  console.log([
    `Profile: ${profile.label}`,
    `Rows: ${result.summary.totalRows}`,
    `Cleaned: ${result.summary.cleanedRows}`,
    `Blocked: ${result.summary.blockedRows}`,
    `Issues: ${result.summary.issueCount}`,
    `Cleaned CSV: ${outPath}`,
    `Issue report: ${reportPath}`,
  ].join("\n"));
} catch (error) {
  const cliName = dirname(fileURLToPath(import.meta.url)).split("/").at(-1) ?? "csv-cleanroom";
  console.error(`${cliName}: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
