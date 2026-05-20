import { useMemo, useState } from "react";
import { buildMarkdownHandoff, type CleanroomResult } from "../lib/csvCleanroom.js";
import { downloadCleanedCsv, downloadIssueReport, downloadMarkdownHandoff } from "../exporters/downloads";

type ExportPanelProps = {
  result: CleanroomResult | null;
};

export function ExportPanel({ result }: ExportPanelProps) {
  const [copied, setCopied] = useState(false);
  const markdown = useMemo(() => (result ? buildMarkdownHandoff(result) : ""), [result]);
  const disabled = !result;

  async function copyMarkdown() {
    if (!markdown || !navigator.clipboard) return;
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="panel export-panel" id="export">
      <div>
        <div className="section-kicker">Export</div>
        <h2>Package cleaned data, JSON findings, and a Markdown handoff.</h2>
        <p>
          Cleaned CSV excludes blocking error rows. The JSON and Markdown exports preserve the full issue trail.
        </p>
      </div>

      <div className="export-actions">
        <button type="button" className="primary-action" disabled={disabled} onClick={() => result && downloadCleanedCsv(result)}>Export cleaned CSV</button>
        <button type="button" className="secondary-action" disabled={disabled} onClick={() => result && downloadIssueReport(result)}>Export JSON report</button>
        <button type="button" className="secondary-action" disabled={disabled} onClick={() => result && downloadMarkdownHandoff(result)}>Export Markdown</button>
        <button type="button" className="secondary-action" disabled={disabled} onClick={() => void copyMarkdown()}>{copied ? "Copied handoff" : "Copy handoff"}</button>
      </div>

      <pre className="cli-card">
        <code>node bin/csv-cleanroom.mjs input.csv --profile email-list --out cleaned.csv --report report.json</code>
      </pre>

      <textarea
        className="handoff-preview"
        aria-label="Markdown handoff preview"
        value={markdown || "Load or paste CSV data to generate a Markdown handoff."}
        readOnly
      />
    </section>
  );
}
