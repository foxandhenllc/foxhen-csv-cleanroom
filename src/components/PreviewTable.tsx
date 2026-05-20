import type { CleanroomResult } from "../lib/csvCleanroom.js";

type PreviewTableProps = {
  result: CleanroomResult | null;
};

export function PreviewTable({ result }: PreviewTableProps) {
  const rows = result?.cleanedRows ?? [];
  const headers = result?.headers ?? [];

  return (
    <section className="panel" id="preview">
      <div className="section-kicker">Clean preview</div>
      <h2>Export-ready rows with safe normalization applied.</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {headers.map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={Math.max(1, headers.length)}>No clean rows are ready yet.</td>
              </tr>
            ) : (
              rows.slice(0, 10).map((row, rowIndex) => (
                <tr key={`cleaned-${rowIndex}`}>
                  {headers.map((header) => <td key={header}>{row[header]}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 10 ? <p className="table-note">Showing 10 of {rows.length} clean rows.</p> : null}
    </section>
  );
}
