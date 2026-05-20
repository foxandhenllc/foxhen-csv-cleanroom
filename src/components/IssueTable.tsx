import type { CleanroomIssue } from "../lib/csvCleanroom.js";

type IssueTableProps = {
  issues: CleanroomIssue[];
};

export function IssueTable({ issues }: IssueTableProps) {
  return (
    <section className="panel" id="issues">
      <div className="section-kicker">Issue table</div>
      <h2>Every validation finding stays audit-friendly.</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Row</th>
              <th>Column</th>
              <th>Severity</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan={5}>No issues detected in the current CSV.</td>
              </tr>
            ) : (
              issues.slice(0, 80).map((issue, issueIndex) => (
                <tr key={`${issue.rowNumber}-${issue.column}-${issue.type}-${issueIndex}`}>
                  <td>{issue.rowNumber}</td>
                  <td>{issue.column || "CSV"}</td>
                  <td><span className={`severity ${issue.severity}`}>{issue.severity}</span></td>
                  <td>{issue.type}</td>
                  <td>
                    {issue.message}
                    {issue.suggestion ? <small>Suggested: {issue.suggestion}</small> : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
