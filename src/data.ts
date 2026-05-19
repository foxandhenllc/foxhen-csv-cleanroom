export const sample = {
  "repoName": "foxhen-csv-cleanroom",
  "title": "CSV Cleanroom",
  "subtitle": "Data cleanup and export sample",
  "serviceLine": "CSV and spreadsheet cleanup",
  "heroTitle": "Clean messy CSVs without hiding the rules.",
  "heroCopy": "A fictional cleanroom for deduping rows, validating schema, fixing field formats, quarantining issues, and preparing an export handoff.",
  "primaryAction": "Clean sample",
  "secondaryAction": "Inspect rules",
  "repositoryUrl": "https://github.com/foxandhenllc/foxhen-csv-cleanroom",
  "liveDemoUrl": "https://foxhen-csv-cleanroom.vercel.app",
  "theme": {
    "accent": "#2b6653",
    "accent2": "#e59f62",
    "ink": "#071611",
    "soft": "#e9f8f2",
    "warm": "#fff0df",
    "surface": "#fffaf4",
    "muted": "#5c667a",
    "border": "rgba(7, 18, 31, 0.12)"
  },
  "metrics": [
    {
      "label": "Rows processed",
      "value": "2,480",
      "note": "sample file"
    },
    {
      "label": "Duplicates found",
      "value": "142",
      "note": "merge review"
    },
    {
      "label": "Export health",
      "value": "97%",
      "note": "+41 pts"
    }
  ],
  "stages": [
    {
      "label": "Profile",
      "detail": "Inspect columns, missing values, duplicate keys, and suspicious formats.",
      "status": "ready",
      "owner": "Data",
      "index": 1
    },
    {
      "label": "Clean",
      "detail": "Normalize dates, names, categories, and numeric fields with visible rules.",
      "status": "active",
      "owner": "Studio",
      "index": 2
    },
    {
      "label": "Quarantine",
      "detail": "Separate uncertain rows so good data can still move forward.",
      "status": "waiting",
      "owner": "Owner",
      "index": 3
    },
    {
      "label": "Export",
      "detail": "Package clean CSV, reject report, and transformation notes.",
      "status": "queued",
      "owner": "Ops",
      "index": 4
    }
  ],
  "workItems": [
    {
      "title": "Date formats",
      "detail": "Normalize mixed month/day strings",
      "status": "ready"
    },
    {
      "title": "Duplicate emails",
      "detail": "Cluster near-identical contacts",
      "status": "active"
    },
    {
      "title": "Unknown region",
      "detail": "Waiting on mapping approval",
      "status": "waiting"
    },
    {
      "title": "Export bundle",
      "detail": "Queued for final QA",
      "status": "queued"
    }
  ],
  "deliverables": [
    {
      "title": "Field profile",
      "detail": "Before-after health for each column."
    },
    {
      "title": "Rule ledger",
      "detail": "Readable cleaning rules and sample affected rows."
    },
    {
      "title": "Export pack",
      "detail": "Clean file, quarantine file, and handoff notes."
    }
  ],
  "timeline": [
    {
      "time": "0-1 hr",
      "detail": "Profile schema and issue count"
    },
    {
      "time": "1-6 hrs",
      "detail": "Apply cleaning rules and quarantine uncertain rows"
    },
    {
      "time": "6-8 hrs",
      "detail": "QA export and write handoff"
    }
  ],
  "proof": [
    "Strong fit for 24-48 hour data cleanup contracts.",
    "Makes quality control visible to non-technical buyers.",
    "No uploaded or real customer data is present."
  ]
} as const;

export type StageStatus = "ready" | "active" | "waiting" | "queued";
export type DemoStage = (typeof sample.stages)[number];
export type WorkItem = (typeof sample.workItems)[number];
