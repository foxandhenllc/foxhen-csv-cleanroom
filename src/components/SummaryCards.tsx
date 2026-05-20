import type { CleanroomResult } from "../lib/csvCleanroom.js";

type SummaryCardsProps = {
  result: CleanroomResult | null;
};

export function SummaryCards({ result }: SummaryCardsProps) {
  const summary = result?.summary;
  const cards = [
    { label: "Rows parsed", value: summary?.totalRows ?? 0, note: "data rows" },
    { label: "Clean export", value: summary?.cleanedRows ?? 0, note: "ready rows" },
    { label: "Blocked", value: summary?.blockedRows ?? 0, note: "needs review" },
    { label: "Issues", value: summary?.issueCount ?? 0, note: `${summary?.errorCount ?? 0} errors` },
  ];

  return (
    <div className="summary-grid" aria-label="CSV cleaning summary">
      {cards.map((card) => (
        <article key={card.label} className="summary-card">
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.note}</small>
        </article>
      ))}
    </div>
  );
}
