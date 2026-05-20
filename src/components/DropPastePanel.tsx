import { useState, type DragEvent } from "react";

type DropPastePanelProps = {
  csvText: string;
  fileLabel: string;
  onCsvTextChange: (csvText: string) => void;
  onLoadSample: () => void;
  onFileText: (fileName: string, csvText: string) => void;
};

export function DropPastePanel({ csvText, fileLabel, onCsvTextChange, onLoadSample, onFileText }: DropPastePanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  async function readDroppedFile(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    onFileText(file.name, text);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    void readDroppedFile(event.dataTransfer.files[0]);
  }

  return (
    <section className="panel intake-panel" id="intake">
      <div className="section-kicker">Intake</div>
      <h2>Drop a CSV file or paste rows directly.</h2>
      <p>
        The cleaner parses the file locally, applies profile rules, and keeps every issue visible before export.
      </p>

      <label
        className={isDragging ? "drop-zone dragging" : "drop-zone"}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => void readDroppedFile(event.target.files?.[0])}
        />
        <strong>{fileLabel}</strong>
        <span>Drag CSV here or click to choose a local file.</span>
      </label>

      <textarea
        className="csv-input"
        aria-label="Paste CSV input"
        value={csvText}
        spellCheck={false}
        onChange={(event) => onCsvTextChange(event.target.value)}
      />

      <div className="button-row">
        <button type="button" className="secondary-action" onClick={onLoadSample}>Reload fictional sample</button>
        <span>{csvText.split(/\r?\n/).filter(Boolean).length} visible lines</span>
      </div>
    </section>
  );
}
