# Contributing to CSV Cleanroom

CSV Cleanroom is a local-first CSV cleanup tool. Contributions should keep the browser app, CLI, fixtures, and docs public-safe and easy to inspect.

## Good First Contributions

- Add a validation profile for a common import workflow.
- Improve CLI examples and report output docs.
- Add edge-case fixture rows for dates, URLs, phones, or duplicate detection.
- Improve accessibility labels, table/card copy, or keyboard flow.
- Add tests around profile behavior in `src/lib/csvCleanroom.js`.

## Development

```bash
npm install
npm run smoke
npm run typecheck
npm run build
```

`npm run smoke` runs the CLI against `fixtures/dirty-email-list.csv` and verifies cleaned CSV plus JSON report output.

## Public-Safe Data Rules

- Use synthetic names, companies, domains, phone numbers, dates, and rows.
- Do not commit real customer exports, mailing lists, CRM rows, analytics dumps, screenshots from private workspaces, credentials, personal contact data, or private URLs.
- Review generated CSV, JSON, Markdown, screenshots, and README examples before publishing.
- Keep the app local-first: no backend, auth, tracking pixels, upload endpoints, or external APIs.

See `docs/public-safe-data.md` for the full policy.

## Profile Contributions

Profiles live in `src/lib/csvCleanroom.js` so the browser app and CLI share rules.

When adding a profile:

1. Define required columns, duplicate keys, output columns, aliases, and field validation.
2. Add or update synthetic fixture data.
3. Run `npm run smoke`, `npm run typecheck`, and `npm run build`.
4. Update README/docs if the profile changes user-facing behavior.

