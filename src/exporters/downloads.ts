import {
  buildIssueReport,
  buildMarkdownHandoff,
  stringifyCsv,
  type CleanroomResult,
} from "../lib/csvCleanroom.js";

export function downloadCleanedCsv(result: CleanroomResult) {
  downloadTextFile("csv-cleanroom-cleaned.csv", stringifyCsv(result.cleanedRows, result.headers), "text/csv;charset=utf-8");
}

export function downloadIssueReport(result: CleanroomResult) {
  downloadTextFile("csv-cleanroom-issues.json", `${JSON.stringify(buildIssueReport(result), null, 2)}\n`, "application/json;charset=utf-8");
}

export function downloadMarkdownHandoff(result: CleanroomResult) {
  downloadTextFile("csv-cleanroom-handoff.md", buildMarkdownHandoff(result), "text/markdown;charset=utf-8");
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mimeType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
