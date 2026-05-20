export const BUILT_IN_PROFILES = [
  {
    id: "email-list",
    label: "Email list",
    description: "Clean subscriber/contact exports before CRM or newsletter import.",
    requiredColumns: ["name", "email"],
    duplicateColumns: ["email"],
    outputColumns: ["name", "email", "website", "signup_date", "phone", "company"],
    fields: {
      name: { type: "text", label: "Name", required: true, casing: "title" },
      email: { type: "email", label: "Email", required: true },
      website: { type: "url", label: "Website" },
      signup_date: { type: "date", label: "Signup date" },
      phone: { type: "phone", label: "Phone" },
      company: { type: "text", label: "Company" },
    },
    aliases: {
      name: ["full_name", "full name", "contact_name", "contact name"],
      email: ["email_address", "email address", "e-mail", "mail"],
      website: ["url", "site", "domain"],
      signup_date: ["created_at", "created at", "joined", "join_date", "join date", "date"],
      phone: ["telephone", "mobile", "cell"],
      company: ["organization", "business", "account"],
    },
  },
  {
    id: "contact-import",
    label: "Contact import",
    description: "Prepare contact rows for a lightweight CRM import.",
    requiredColumns: ["first_name", "last_name", "email"],
    duplicateColumns: ["email"],
    outputColumns: ["first_name", "last_name", "email", "phone", "company", "website"],
    fields: {
      first_name: { type: "text", label: "First name", required: true, casing: "title" },
      last_name: { type: "text", label: "Last name", required: true, casing: "title" },
      email: { type: "email", label: "Email", required: true },
      phone: { type: "phone", label: "Phone" },
      company: { type: "text", label: "Company" },
      website: { type: "url", label: "Website" },
    },
    aliases: {
      first_name: ["first name", "fname"],
      last_name: ["last name", "lname", "surname"],
      email: ["email_address", "email address", "e-mail"],
      phone: ["telephone", "mobile", "cell"],
      company: ["organization", "business", "account"],
      website: ["url", "site", "domain"],
    },
  },
  {
    id: "content-inventory",
    label: "Content inventory",
    description: "Normalize URL, owner, and publish-date columns for content audits.",
    requiredColumns: ["title", "url"],
    duplicateColumns: ["url"],
    outputColumns: ["title", "url", "owner", "status", "published_at", "notes"],
    fields: {
      title: { type: "text", label: "Title", required: true },
      url: { type: "url", label: "URL", required: true },
      owner: { type: "text", label: "Owner", casing: "title" },
      status: { type: "text", label: "Status" },
      published_at: { type: "date", label: "Published at" },
      notes: { type: "text", label: "Notes" },
    },
    aliases: {
      title: ["headline", "page_title", "page title"],
      url: ["link", "website", "page_url", "page url"],
      owner: ["assignee", "editor"],
      status: ["state"],
      published_at: ["published", "published date", "date", "created_at", "created at"],
      notes: ["note", "comment", "comments"],
    },
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getProfile(profileId) {
  return BUILT_IN_PROFILES.find((profile) => profile.id === profileId) ?? BUILT_IN_PROFILES[0];
}

export function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  const source = csvText.replace(/^\uFEFF/, "");
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        currentCell += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell);
  rows.push(currentRow);

  return rows.filter((row, index) => index === 0 || row.some((cell) => cell.trim() !== ""));
}

export function cleanCsvText(csvText, profileInput = "email-list") {
  const profile = typeof profileInput === "string" ? getProfile(profileInput) : profileInput;
  const parsedRows = parseCsv(csvText);
  const [rawHeaders = [], ...dataRows] = parsedRows;
  const headerMap = buildHeaderMap(rawHeaders, profile);
  const knownColumns = new Set([...profile.outputColumns, ...Object.keys(headerMap.canonicalToRaw)]);
  const outputHeaders = [...profile.outputColumns, ...Object.keys(headerMap.canonicalToRaw).filter((header) => !profile.outputColumns.includes(header))];
  const issues = [];

  if (rawHeaders.length === 0 || rawHeaders.every((header) => header.trim() === "")) {
    issues.push(createIssue({
      rowNumber: 1,
      column: "",
      severity: "error",
      type: "missing_header",
      message: "CSV needs a header row before it can be cleaned.",
    }));
  }

  for (const requiredColumn of profile.requiredColumns) {
    if (!knownColumns.has(requiredColumn) || !headerMap.canonicalToRaw[requiredColumn]) {
      issues.push(createIssue({
        rowNumber: 1,
        column: requiredColumn,
        severity: "error",
        type: "missing_required_column",
        message: `Required column "${labelFor(profile, requiredColumn)}" is missing from the CSV header.`,
        suggestion: `Add a ${labelFor(profile, requiredColumn)} column.`,
      }));
    }
  }

  const seenDuplicateKeys = new Map();
  const rowResults = dataRows.map((cells, rowIndex) => {
    const rowNumber = rowIndex + 2;
    const raw = {};
    const cleaned = {};
    const rowIssues = [];

    rawHeaders.forEach((header, headerIndex) => {
      const canonical = headerMap.rawIndexToCanonical[headerIndex] ?? canonicalizeHeader(header);
      raw[canonical] = cells[headerIndex] ?? "";
    });

    for (const column of outputHeaders) {
      const field = profile.fields[column] ?? { type: "text", label: humanize(column) };
      const originalValue = raw[column] ?? "";
      const { value, issues: valueIssues } = cleanFieldValue(originalValue, field, column, rowNumber, profile);
      cleaned[column] = value;
      rowIssues.push(...valueIssues);
    }

    for (const requiredColumn of profile.requiredColumns) {
      if (headerMap.canonicalToRaw[requiredColumn] && cleaned[requiredColumn].trim() === "") {
        rowIssues.push(createIssue({
          rowNumber,
          column: requiredColumn,
          severity: "error",
          type: "missing_required_value",
          message: `${labelFor(profile, requiredColumn)} is required for this profile.`,
          original: raw[requiredColumn] ?? "",
        }));
      }
    }

    const duplicateKey = profile.duplicateColumns.map((column) => cleaned[column]?.toLowerCase().trim()).filter(Boolean).join("::");
    if (duplicateKey) {
      const firstRowNumber = seenDuplicateKeys.get(duplicateKey);
      if (firstRowNumber) {
        rowIssues.push(createIssue({
          rowNumber,
          column: profile.duplicateColumns.join("+"),
          severity: "error",
          type: "duplicate",
          message: `Duplicate ${profile.duplicateColumns.map((column) => labelFor(profile, column)).join(" + ")}; first seen on row ${firstRowNumber}.`,
          original: duplicateKey,
          suggestion: `Review against row ${firstRowNumber} and keep one record.`,
        }));
      } else {
        seenDuplicateKeys.set(duplicateKey, rowNumber);
      }
    }

    const hasError = rowIssues.some((issue) => issue.severity === "error");
    const hasWarning = rowIssues.some((issue) => issue.severity === "warning");
    issues.push(...rowIssues);

    return {
      rowNumber,
      raw,
      cleaned,
      issues: rowIssues,
      status: hasError ? "blocked" : hasWarning ? "needs_review" : "clean",
    };
  });

  const hasHeaderError = issues.some((issue) => issue.rowNumber === 1 && issue.severity === "error");
  const cleanedRows = hasHeaderError ? [] : rowResults.filter((row) => row.status !== "blocked").map((row) => row.cleaned);
  const summary = summarize(profile, dataRows.length, cleanedRows.length, issues);

  return {
    profile,
    headers: outputHeaders,
    rawHeaders,
    rows: rowResults,
    cleanedRows,
    issues,
    summary,
  };
}

export function stringifyCsv(rows, headers) {
  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsvCell(row[header] ?? "")).join(","));
  }
  return `${lines.join("\n")}\n`;
}

export function buildIssueReport(result) {
  return {
    generatedAt: new Date().toISOString(),
    profile: {
      id: result.profile.id,
      label: result.profile.label,
      description: result.profile.description,
    },
    summary: result.summary,
    cleanedHeaders: result.headers,
    issues: result.issues,
  };
}

export function buildMarkdownHandoff(result) {
  const report = buildIssueReport(result);
  const issueRows = result.issues.slice(0, 40).map((issue) => (
    `| ${issue.rowNumber} | ${issue.column || "CSV"} | ${issue.severity} | ${issue.type} | ${issue.message.replace(/\|/g, "\\|")} |`
  ));

  return [
    `# CSV Cleanroom Handoff`,
    "",
    `**Profile:** ${report.profile.label}`,
    `**Generated:** ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Total rows: ${report.summary.totalRows}`,
    `- Cleaned rows ready to export: ${report.summary.cleanedRows}`,
    `- Blocked rows: ${report.summary.blockedRows}`,
    `- Issues: ${report.summary.issueCount} (${report.summary.errorCount} errors, ${report.summary.warningCount} warnings, ${report.summary.infoCount} info)`,
    `- Duplicates detected: ${report.summary.duplicateCount}`,
    "",
    "## Handoff Notes",
    "",
    "- Cleaned CSV excludes rows with blocking errors or duplicate keys.",
    "- Warning and info rows are included after safe normalization.",
    "- This report is generated locally in the browser or CLI; no data leaves the machine.",
    "",
    "## Issue Table",
    "",
    "| Row | Column | Severity | Type | Message |",
    "|---:|---|---|---|---|",
    ...(issueRows.length ? issueRows : ["| — | — | — | — | No issues detected. |"]),
    "",
  ].join("\n");
}

function summarize(profile, totalRows, cleanedRows, issues) {
  const count = (predicate) => issues.filter(predicate).length;
  return {
    profileId: profile.id,
    totalRows,
    cleanedRows,
    blockedRows: Math.max(0, totalRows - cleanedRows),
    issueCount: issues.length,
    errorCount: count((issue) => issue.severity === "error"),
    warningCount: count((issue) => issue.severity === "warning"),
    infoCount: count((issue) => issue.severity === "info"),
    duplicateCount: count((issue) => issue.type === "duplicate"),
    missingRequiredColumnCount: count((issue) => issue.type === "missing_required_column"),
  };
}

function cleanFieldValue(originalValue, field, column, rowNumber, profile) {
  const issues = [];
  let value = String(originalValue ?? "");
  const trimmed = value.trim();
  const collapsed = trimmed.replace(/\s+/g, " ");

  if (value !== trimmed || trimmed !== collapsed) {
    issues.push(createIssue({
      rowNumber,
      column,
      severity: "warning",
      type: "whitespace",
      message: `${labelFor(profile, column)} has extra whitespace.`,
      original: value,
      suggestion: collapsed,
    }));
  }

  value = collapsed;
  if (value === "") {
    return { value, issues };
  }

  if (field.type === "email") {
    const lower = value.toLowerCase();
    if (lower !== value) {
      issues.push(createIssue({
        rowNumber,
        column,
        severity: "warning",
        type: "casing",
        message: `${labelFor(profile, column)} should be lowercase.`,
        original: value,
        suggestion: lower,
      }));
    }
    value = lower;
    if (!EMAIL_PATTERN.test(value)) {
      issues.push(createIssue({
        rowNumber,
        column,
        severity: "error",
        type: "invalid_email",
        message: `${labelFor(profile, column)} is not a valid email address.`,
        original: originalValue,
      }));
    }
  }

  if (field.type === "url") {
    const normalizedUrl = normalizeUrl(value);
    value = normalizedUrl.value;
    issues.push(...normalizedUrl.issues.map((issue) => ({ ...issue, rowNumber, column, message: `${labelFor(profile, column)} ${issue.message}` })));
  }

  if (field.type === "date") {
    const normalizedDate = normalizeDate(value);
    if (normalizedDate) {
      if (normalizedDate !== value) {
        issues.push(createIssue({
          rowNumber,
          column,
          severity: "info",
          type: "date_normalized",
          message: `${labelFor(profile, column)} was normalized to ISO format.`,
          original: value,
          suggestion: normalizedDate,
        }));
      }
      value = normalizedDate;
    } else {
      issues.push(createIssue({
        rowNumber,
        column,
        severity: "error",
        type: "invalid_date",
        message: `${labelFor(profile, column)} is not a recognized date.`,
        original: originalValue,
      }));
    }
  }

  if (field.type === "phone") {
    const normalizedPhone = normalizePhone(value);
    if (normalizedPhone) {
      if (normalizedPhone !== value) {
        issues.push(createIssue({
          rowNumber,
          column,
          severity: "info",
          type: "phone_normalized",
          message: `${labelFor(profile, column)} was normalized.`,
          original: value,
          suggestion: normalizedPhone,
        }));
      }
      value = normalizedPhone;
    } else {
      issues.push(createIssue({
        rowNumber,
        column,
        severity: "error",
        type: "invalid_phone",
        message: `${labelFor(profile, column)} is not a recognized US phone number.`,
        original: originalValue,
      }));
    }
  }

  if (field.type === "text" && field.casing === "title") {
    const titleCased = titleCase(value);
    if (titleCased !== value && (value === value.toUpperCase() || value === value.toLowerCase())) {
      issues.push(createIssue({
        rowNumber,
        column,
        severity: "warning",
        type: "casing",
        message: `${labelFor(profile, column)} casing looks inconsistent.`,
        original: value,
        suggestion: titleCased,
      }));
      value = titleCased;
    }
  }

  return { value, issues };
}

function normalizeUrl(value) {
  const issues = [];
  let normalized = value;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
    issues.push(createIssue({
      severity: "info",
      type: "url_scheme_added",
      message: "was given an https:// scheme.",
      original: value,
      suggestion: normalized,
    }));
  }

  try {
    const url = new URL(normalized);
    if (!url.hostname.includes(".") || /\s/.test(url.hostname)) {
      throw new Error("Invalid host");
    }
    return { value: url.toString().replace(/\/$/, ""), issues };
  } catch {
    issues.push(createIssue({
      severity: "error",
      type: "invalid_url",
      message: "is not a valid URL.",
      original: value,
    }));
    return { value, issues };
  }
}

function normalizeDate(value) {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoMatch) {
    return isValidDateParts(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3])) ? value : "";
  }

  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if (slashMatch) {
    const month = Number(slashMatch[1]);
    const day = Number(slashMatch[2]);
    const year = Number(slashMatch[3]);
    if (!isValidDateParts(year, month, day)) {
      return "";
    }
    return formatDateParts(year, month, day);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  return formatDateParts(parsed.getUTCFullYear(), parsed.getUTCMonth() + 1, parsed.getUTCDate());
}

function normalizePhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return "";
}

function isValidDateParts(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

function formatDateParts(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildHeaderMap(headers, profile) {
  const aliasToCanonical = {};
  for (const [canonical, aliases] of Object.entries(profile.aliases ?? {})) {
    aliasToCanonical[canonicalizeHeader(canonical)] = canonical;
    for (const alias of aliases) {
      aliasToCanonical[canonicalizeHeader(alias)] = canonical;
    }
  }
  for (const column of Object.keys(profile.fields)) {
    aliasToCanonical[canonicalizeHeader(column)] = column;
  }

  const canonicalToRaw = {};
  const rawIndexToCanonical = {};
  headers.forEach((header, index) => {
    const canonical = aliasToCanonical[canonicalizeHeader(header)] ?? canonicalizeHeader(header);
    rawIndexToCanonical[index] = canonical;
    canonicalToRaw[canonical] = header;
  });

  return { canonicalToRaw, rawIndexToCanonical };
}

function canonicalizeHeader(header) {
  return String(header ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_").replace(/[^a-z0-9_]/g, "");
}

function titleCase(value) {
  return value.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

function labelFor(profile, column) {
  return profile.fields[column]?.label ?? humanize(column);
}

function humanize(value) {
  return String(value).replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function createIssue(issue) {
  return {
    rowNumber: issue.rowNumber ?? 0,
    column: issue.column ?? "",
    severity: issue.severity,
    type: issue.type,
    message: issue.message,
    original: issue.original,
    suggestion: issue.suggestion,
  };
}

function escapeCsvCell(value) {
  const cell = String(value ?? "");
  return /[",\n\r]/.test(cell) ? `"${cell.replace(/"/g, "\"\"")}"` : cell;
}
