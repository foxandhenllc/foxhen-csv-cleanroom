# CSV Cleanroom

Local CSV cleanup utility from **Fox & Hen**. Paste or drag in a CSV, choose a profile, review issues, and export cleaned rows plus an issue report.

[![Build](https://github.com/foxandhenllc/foxhen-csv-cleanroom/actions/workflows/build.yml/badge.svg)](https://github.com/foxandhenllc/foxhen-csv-cleanroom/actions/workflows/build.yml)

![CSV Cleanroom demo screenshot](docs/demo-screenshot.png)

## Live Demo

- Demo: [https://freetoolsforpeople.com/csv-cleanroom](https://freetoolsforpeople.com/csv-cleanroom)
- Repository: [https://github.com/foxandhenllc/foxhen-csv-cleanroom](https://github.com/foxandhenllc/foxhen-csv-cleanroom)
- License: [MIT](LICENSE)

## What It Does

- Accepts CSV by drag/drop, file picker, or paste.
- Supports cleaning profiles for email lists, contact imports, and content inventories.
- Parses rows locally and validates email, URL, date, and US phone fields.
- Detects duplicate keys, missing required columns, missing required values, whitespace, and casing issues.
- Shows a sortable-style issue table and cleaned-data preview in the browser.
- Exports cleaned CSV, JSON issue report, and Markdown handoff.
- Includes a local Node CLI for repeatable fixture/client handoffs.

## Why Local-First

Many CSV cleanup tasks involve lists that should not be uploaded to a random service: lead exports, contact imports, content inventories, and handoff spreadsheets. CSV Cleanroom keeps parsing and exports local, uses synthetic fixtures in the repo, and documents public-safe adaptation rules so teams can fork the utility without exposing private records.

## Screenshots

The screenshot above shows the browser app with fictional rows, issue counts, validation findings, and export controls. Refresh `docs/demo-screenshot.png` after meaningful UI changes.

## Use Cases

- Newsletter or email-list import cleanup.
- CRM contact dedupe before migration.
- Content inventory URL/date normalization.
- Public-safe proof of a spreadsheet QA workflow.

## CLI Usage

```bash
node bin/csv-cleanroom.mjs fixtures/dirty-email-list.csv \
  --profile email-list \
  --out cleaned.csv \
  --report report.json \
  --markdown handoff.md
```

Available profiles:

- `email-list`
- `contact-import`
- `content-inventory`

## Local Development

```bash
npm install
npm run dev
npm run smoke
npm run typecheck
npm run build
```

`npm run smoke` runs the CLI against `fixtures/dirty-email-list.csv` and verifies cleaned CSV plus JSON report output.

CI runs typecheck, smoke test, and production build through `.github/workflows/build.yml`.

## Client Customization

- Update browser fixture/use-case copy in `src/data/sampleCsv.ts`.
- Add or change profiles in `src/lib/csvCleanroom.js` so UI and CLI stay in sync.
- Adjust browser downloads in `src/exporters/downloads.ts`.
- Use `docs/client-brief-template.md` before adapting the tool for a buyer.
- Follow `docs/public-safe-data.md` before committing screenshots, fixtures, or reports.

See `docs/customization-guide.md` for profile and export customization details.

## Contributing

Useful first contributions include new validation profiles, edge-case synthetic fixtures, CLI examples, accessibility improvements, and tests around profile behavior.

- Start with [CONTRIBUTING.md](CONTRIBUTING.md).
- See the focused [ROADMAP.md](ROADMAP.md).
- Use GitHub issue templates for public-safe profile requests and quality improvements.

## Public-Safe Scope

CSV Cleanroom is a static React + TypeScript + Vite app with a local Node CLI. It has no backend, auth, tracking, upload endpoint, credentials, or real data. All committed fixtures and screenshots must remain fictional.
## SEO / AIO Discoverability

**Plain-language answer:** Use this repo to clean and validate CSVs locally with profiles, duplicate detection, issue reports, cleaned exports, and a Node CLI.

**Who it helps:** operators, marketers, and developers cleaning CSVs before imports or handoffs.

**Search intents covered:**

- CSV cleanup tool
- browser CSV validator
- local CSV cleaner CLI
- email list import cleaner

**Why this repo is useful:** It keeps data cleanup transparent and auditable without uploading private files to a backend.
