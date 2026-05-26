import { useMemo, useState } from "react";
import { CustomProfileBuilder } from "./components/CustomProfileBuilder";
import { DropPastePanel } from "./components/DropPastePanel";
import { ExportPanel } from "./components/ExportPanel";
import { IssueTable } from "./components/IssueTable";
import { PreviewTable } from "./components/PreviewTable";
import { ProfilePicker } from "./components/ProfilePicker";
import { SummaryCards } from "./components/SummaryCards";
import { profiles } from "./data/profiles";
import { publicSafeNotes, sampleCsv, useCases } from "./data/sampleCsv";
import { loadCustomProfile, saveCustomProfile } from "./lib/customProfile";
import { cleanCsvText } from "./lib/csvCleanroom.js";
import type { CleanroomProfile } from "./lib/csvCleanroom.js";
import "./styles.css";

function App() {
  const [selectedProfileId, setSelectedProfileId] = useState("email-list");
  const [customProfile, setCustomProfile] = useState<CleanroomProfile | null>(() => loadCustomProfile());
  const [csvText, setCsvText] = useState(sampleCsv);
  const [fileLabel, setFileLabel] = useState("Fictional sample CSV loaded");

  const availableProfiles = useMemo(() => (customProfile ? [...profiles, customProfile] : profiles), [customProfile]);
  const selectedProfile = availableProfiles.find((profile) => profile.id === selectedProfileId) ?? availableProfiles[0];
  const result = useMemo(() => (csvText.trim() ? cleanCsvText(csvText, selectedProfile) : null), [csvText, selectedProfile]);

  function handleFileText(fileName: string, text: string) {
    setFileLabel(fileName);
    setCsvText(text);
  }

  function reloadSample() {
    setFileLabel("Fictional sample CSV loaded");
    setCsvText(sampleCsv);
  }

  function handleCustomProfileChange(profile: CleanroomProfile | null) {
    setCustomProfile(profile);
    saveCustomProfile(profile);
    if (!profile && selectedProfileId === "custom-local") {
      setSelectedProfileId("email-list");
    }
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="https://foxandhenllc.com">
          <span className="brand-mark">F&amp;H</span>
          <span>
            <strong>Fox &amp; Hen</strong>
            <small>CSV Cleanroom</small>
          </span>
        </a>
        <nav>
          <a href="#intake">Intake</a>
          <a href="#issues">Issues</a>
          <a href="#preview">Preview</a>
          <a className="nav-button" href="https://github.com/foxandhenllc/foxhen-csv-cleanroom">Repository</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div>
            <p className="service-line">Local CSV cleanup</p>
            <h1>Clean and validate CSVs in your browser.</h1>
            <p className="lede">
              Paste or drop a CSV, pick a validation profile, review issues, and export cleaned rows. Nothing uploads.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#intake">Clean a CSV</a>
              <a className="secondary-action" href="#issues">Review issues</a>
            </div>
          </div>
          <aside className="hero-console">
            <span className="console-label">Active profile</span>
            <strong>{selectedProfile.label}</strong>
            <p>{selectedProfile.description}</p>
            <SummaryCards result={result} />
          </aside>
        </section>

        <section className="workflow-grid">
          <div className="panel profile-panel">
            <div className="section-kicker">Profiles</div>
            <h2>Pick the validation rules that match the handoff.</h2>
            <ProfilePicker profiles={availableProfiles} selectedProfileId={selectedProfileId} onSelectProfile={setSelectedProfileId} />
            <CustomProfileBuilder
              csvText={csvText}
              customProfile={customProfile}
              onCustomProfileChange={handleCustomProfileChange}
              onSelectCustomProfile={() => setSelectedProfileId("custom-local")}
            />
          </div>

          <DropPastePanel
            csvText={csvText}
            fileLabel={fileLabel}
            onCsvTextChange={setCsvText}
            onFileText={handleFileText}
            onLoadSample={reloadSample}
          />
        </section>

        <section className="use-case-strip" aria-label="CSV Cleanroom use cases">
          {useCases.map((useCase) => (
            <article key={useCase}>
              <span>Good for</span>
              <strong>{useCase}</strong>
            </article>
          ))}
        </section>

        <section className="results-grid">
          <IssueTable issues={result?.issues ?? []} />
          <PreviewTable result={result} />
        </section>

        <ExportPanel result={result} />

        <section className="panel public-safe-panel">
          <div>
            <div className="section-kicker">Local by default</div>
            <h2>Browser app plus local CLI. No backend required.</h2>
          </div>
          <div className="safety-list">
            {publicSafeNotes.map((note) => <span key={note}>{note}</span>)}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
