import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";

const tempDir = mkdtempSync(join(tmpdir(), "csv-cleanroom-smoke-"));
const cleanedPath = join(tempDir, "cleaned.csv");
const reportPath = join(tempDir, "report.json");
const fixturePath = "fixtures/dirty-email-list.csv";

try {
  const result = spawnSync(
    process.execPath,
    ["bin/csv-cleanroom.mjs", fixturePath, "--profile", "email-list", "--out", cleanedPath, "--report", reportPath],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr || result.stdout);

  const cleanedCsv = readFileSync(cleanedPath, "utf8");
  const report = JSON.parse(readFileSync(reportPath, "utf8"));

  assert.match(cleanedCsv, /avery@example\.com/);
  assert.match(cleanedCsv, /https:\/\/example\.com/);
  assert.match(cleanedCsv, /\(555\) 010-2000/);
  assert.equal(report.summary.totalRows, 5);
  assert.equal(report.summary.cleanedRows, 2);
  assert.ok(report.issues.some((issue) => issue.type === "duplicate"));
  assert.ok(report.issues.some((issue) => issue.type === "invalid_email"));
  assert.ok(report.issues.some((issue) => issue.type === "missing_required_value"));

  console.log("Smoke test passed: CLI cleaned fixture and emitted issue report.");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
