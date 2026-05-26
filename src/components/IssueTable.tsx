import type { CleanroomIssue } from "../lib/csvCleanroom.js";

type IssueTableProps = {
  issues: CleanroomIssue[];
};

export function IssueTable({ issues }: IssueTableProps) {
  return (
    <section className="panel issue-panel" id="issues">
      <div className="section-kicker">Issue table</div>
      <h2>Issues to fix before export.</h2>
      <div className="issue-list" role="list" aria-label="CSV validation findings">
        {issues.length === 0 ? (
          <p className="empty-note">No issues detected in the current CSV.</p>
        ) : (
          issues.slice(0, 80).map((issue, issueIndex) => (
            <article className="issue-card" role="listitem" key={`${issue.rowNumber}-${issue.column}-${issue.type}-${issueIndex}`}>
              <div className="issue-card-topline">
                <span>Row {issue.rowNumber}</span>
                <span>{issue.column || "CSV"}</span>
                <span className={`severity ${issue.severity}`}>{issue.severity}</span>
              </div>
              <strong>{issue.type}</strong>
              <p>{issue.message}</p>
              {issue.suggestion ? <small>Suggested: {issue.suggestion}</small> : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
