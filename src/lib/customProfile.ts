import { parseCsv, type CleanroomField, type CleanroomProfile, type FieldType } from "./csvCleanroom.js";

const profileStorageKey = "foxhen-csv-cleanroom-custom-profile-v1";

const fieldTypeHints: Array<{ pattern: RegExp; type: FieldType }> = [
  { pattern: /e-?mail|email/i, type: "email" },
  { pattern: /url|website|site|link|domain/i, type: "url" },
  { pattern: /date|created|updated|joined|published/i, type: "date" },
  { pattern: /phone|mobile|cell|tel/i, type: "phone" },
];

export function canonicalizeCustomColumn(header: string) {
  const canonical = header.trim().toLowerCase().replace(/[\s-]+/g, "_").replace(/[^a-z0-9_]/g, "");
  return canonical || "column";
}

export function extractHeaders(csvText: string) {
  return parseCsv(csvText)[0]?.map((header) => header.trim()).filter(Boolean) ?? [];
}

export function createCustomProfileFromHeaders(headers: string[]): CleanroomProfile {
  const fields: Record<string, CleanroomField> = {};
  const outputColumns: string[] = [];
  const duplicateColumns: string[] = [];
  const aliases: Record<string, string[]> = {};

  headers.forEach((header) => {
    const column = canonicalizeCustomColumn(header);
    const hintedType = fieldTypeHints.find((hint) => hint.pattern.test(header))?.type ?? "text";
    fields[column] = {
      type: hintedType,
      label: header,
      required: hintedType === "email",
      casing: hintedType === "text" && /name|owner|contact|client/i.test(header) ? "title" : undefined,
    };
    outputColumns.push(column);
    aliases[column] = [header];
    if (hintedType === "email" || /id|key/i.test(header)) {
      duplicateColumns.push(column);
    }
  });

  return {
    id: "custom-local",
    label: "Custom local profile",
    description: "Editable browser-only profile inferred from the active CSV header row.",
    requiredColumns: outputColumns.filter((column) => fields[column].required),
    duplicateColumns: duplicateColumns.slice(0, 2),
    outputColumns,
    fields,
    aliases,
  };
}

export function loadCustomProfile() {
  try {
    const saved = window.localStorage.getItem(profileStorageKey);
    return saved ? (JSON.parse(saved) as CleanroomProfile) : null;
  } catch {
    return null;
  }
}

export function saveCustomProfile(profile: CleanroomProfile | null) {
  try {
    if (!profile) {
      window.localStorage.removeItem(profileStorageKey);
      return;
    }
    window.localStorage.setItem(profileStorageKey, JSON.stringify(profile));
  } catch {
    // localStorage can be unavailable in private or restricted browser contexts.
  }
}
