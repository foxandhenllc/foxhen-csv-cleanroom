# Customization Guide

Use this guide to adapt CSV Cleanroom for a public-safe service demo or internal utility.

## Change the Sample Data

- Edit `src/data/sampleCsv.ts` to change the browser demo fixture.
- Edit `fixtures/dirty-email-list.csv` when the CLI smoke test fixture should change.
- Keep every row fictional and rerun `npm run smoke` after fixture changes.

## Add or Update a Profile

Profiles live in `src/lib/csvCleanroom.js` so the browser app and CLI share the same rules.

Each profile includes:

- `id`: CLI and UI identifier, such as `email-list`.
- `requiredColumns`: columns that must exist and contain values.
- `duplicateColumns`: normalized columns used for duplicate detection.
- `outputColumns`: cleaned export order.
- `fields`: validation and normalization rules for `text`, `email`, `url`, `date`, or `phone`.
- `aliases`: alternate header names that should map to canonical output columns.

After editing profiles, run:

```bash
npm run smoke
npm run typecheck
npm run build
```

## Change the UI Copy

- `src/App.tsx` controls the page structure and primary messaging.
- `src/data/sampleCsv.ts` includes use cases and public-safe guardrails shown on the page.
- `src/styles.css` controls the visual system.

## Change Export Behavior

- Browser download buttons are in `src/exporters/downloads.ts`.
- Shared CSV, JSON, and Markdown builders are in `src/lib/csvCleanroom.js`.
- CLI argument handling is in `bin/csv-cleanroom.mjs`.

## Recommended Client Adaptation

1. Pick one narrow workflow, such as newsletter cleanup or CRM import prep.
2. Create a synthetic dirty CSV that demonstrates realistic mistakes.
3. Tune required columns and duplicate keys for that workflow.
4. Capture a fresh screenshot after the UI is updated.
5. Keep the README honest about local-only processing and public-safe sample data.
