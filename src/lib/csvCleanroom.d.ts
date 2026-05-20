export type FieldType = "text" | "email" | "url" | "date" | "phone";
export type IssueSeverity = "error" | "warning" | "info";
export type RowStatus = "clean" | "needs_review" | "blocked";

export type CleanroomField = {
  type: FieldType;
  label?: string;
  required?: boolean;
  casing?: "title";
};

export type CleanroomProfile = {
  id: string;
  label: string;
  description: string;
  requiredColumns: string[];
  duplicateColumns: string[];
  outputColumns: string[];
  fields: Record<string, CleanroomField>;
  aliases?: Record<string, string[]>;
};

export type CleanroomIssue = {
  rowNumber: number;
  column: string;
  severity: IssueSeverity;
  type: string;
  message: string;
  original?: string;
  suggestion?: string;
};

export type CleanroomRow = {
  rowNumber: number;
  raw: Record<string, string>;
  cleaned: Record<string, string>;
  issues: CleanroomIssue[];
  status: RowStatus;
};

export type CleanroomSummary = {
  profileId: string;
  totalRows: number;
  cleanedRows: number;
  blockedRows: number;
  issueCount: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  duplicateCount: number;
  missingRequiredColumnCount: number;
};

export type CleanroomResult = {
  profile: CleanroomProfile;
  headers: string[];
  rawHeaders: string[];
  rows: CleanroomRow[];
  cleanedRows: Record<string, string>[];
  issues: CleanroomIssue[];
  summary: CleanroomSummary;
};

export const BUILT_IN_PROFILES: CleanroomProfile[];
export function getProfile(profileId: string): CleanroomProfile;
export function parseCsv(csvText: string): string[][];
export function cleanCsvText(csvText: string, profileInput?: string | CleanroomProfile): CleanroomResult;
export function stringifyCsv(rows: Record<string, string>[], headers: string[]): string;
export function buildIssueReport(result: CleanroomResult): {
  generatedAt: string;
  profile: Pick<CleanroomProfile, "id" | "label" | "description">;
  summary: CleanroomSummary;
  cleanedHeaders: string[];
  issues: CleanroomIssue[];
};
export function buildMarkdownHandoff(result: CleanroomResult): string;
