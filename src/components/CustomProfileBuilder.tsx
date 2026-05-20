import type { ChangeEvent } from "react";
import { createCustomProfileFromHeaders, extractHeaders } from "../lib/customProfile";
import type { CleanroomProfile, FieldType } from "../lib/csvCleanroom.js";

type CustomProfileBuilderProps = {
  csvText: string;
  customProfile: CleanroomProfile | null;
  onCustomProfileChange: (profile: CleanroomProfile | null) => void;
  onSelectCustomProfile: () => void;
};

const fieldTypes: FieldType[] = ["text", "email", "url", "date", "phone"];

export function CustomProfileBuilder({
  csvText,
  customProfile,
  onCustomProfileChange,
  onSelectCustomProfile,
}: CustomProfileBuilderProps) {
  const headers = extractHeaders(csvText);
  const profile = customProfile ?? (headers.length ? createCustomProfileFromHeaders(headers) : null);

  function createFromCsv() {
    if (!headers.length) return;
    const nextProfile = createCustomProfileFromHeaders(headers);
    onCustomProfileChange(nextProfile);
    onSelectCustomProfile();
  }

  function updateColumn(column: string, event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    if (!profile) return;
    const field = profile.fields[column];
    const target = event.target;
    let nextProfile = profile;

    if (target.name === "type") {
      nextProfile = {
        ...profile,
        fields: {
          ...profile.fields,
          [column]: { ...field, type: target.value as FieldType },
        },
      };
    }

    if (target.name === "required") {
      const required = (target as HTMLInputElement).checked;
      nextProfile = {
        ...profile,
        fields: {
          ...profile.fields,
          [column]: { ...field, required },
        },
        requiredColumns: required
          ? Array.from(new Set([...profile.requiredColumns, column]))
          : profile.requiredColumns.filter((requiredColumn) => requiredColumn !== column),
      };
    }

    if (target.name === "duplicate") {
      const duplicate = (target as HTMLInputElement).checked;
      nextProfile = {
        ...profile,
        duplicateColumns: duplicate
          ? Array.from(new Set([...profile.duplicateColumns, column]))
          : profile.duplicateColumns.filter((duplicateColumn) => duplicateColumn !== column),
      };
    }

    if (target.name === "export") {
      const exported = (target as HTMLInputElement).checked;
      nextProfile = {
        ...profile,
        outputColumns: exported
          ? Array.from(new Set([...profile.outputColumns, column]))
          : profile.outputColumns.filter((outputColumn) => outputColumn !== column),
      };
    }

    onCustomProfileChange(nextProfile);
  }

  return (
    <div className="custom-profile-builder">
      <div className="custom-profile-topline">
        <div>
          <strong>Custom browser-only profile</strong>
          <span>Infer rules from the active CSV header, then choose required fields, duplicate keys, and exported columns.</span>
        </div>
        <div className="button-row compact">
          <button type="button" className="secondary-action" disabled={!headers.length} onClick={createFromCsv}>
            Detect from CSV
          </button>
          <button type="button" className="text-action" disabled={!customProfile} onClick={() => onCustomProfileChange(null)}>
            Clear custom profile
          </button>
        </div>
      </div>

      {profile ? (
        <div className="custom-profile-table" role="table" aria-label="Custom CSV profile columns">
          <div className="custom-profile-row header" role="row">
            <span>Column</span>
            <span>Type</span>
            <span>Required</span>
            <span>Duplicate key</span>
            <span>Export</span>
          </div>
          {profile.outputColumns.concat(Object.keys(profile.fields).filter((column) => !profile.outputColumns.includes(column))).map((column) => (
            <div key={column} className="custom-profile-row" role="row">
              <span>{profile.fields[column]?.label ?? column}</span>
              <select name="type" value={profile.fields[column]?.type ?? "text"} onChange={(event) => updateColumn(column, event)}>
                {fieldTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <label>
                <input
                  name="required"
                  type="checkbox"
                  checked={profile.requiredColumns.includes(column)}
                  onChange={(event) => updateColumn(column, event)}
                />
              </label>
              <label>
                <input
                  name="duplicate"
                  type="checkbox"
                  checked={profile.duplicateColumns.includes(column)}
                  onChange={(event) => updateColumn(column, event)}
                />
              </label>
              <label>
                <input
                  name="export"
                  type="checkbox"
                  checked={profile.outputColumns.includes(column)}
                  onChange={(event) => updateColumn(column, event)}
                />
              </label>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-note">Paste or upload a CSV with a header row to build a custom validation profile.</p>
      )}
    </div>
  );
}
