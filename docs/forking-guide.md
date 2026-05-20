# CSV Cleanroom Forking Guide

Use this guide to adapt the demo without introducing private data or hidden dependencies.

## Public-Safe Sample Scenario

- Service line: CSV and spreadsheet cleanup
- Demo promise: clean fictional CSV rows, validate common field types, detect duplicates, and export handoff files.
- Runtime: static React/Vite browser app plus local Node CLI
- Data posture: no backend, no auth, no upload endpoint, no external API calls

## Replace First

1. Edit `src/data/sampleCsv.ts` for the browser fixture and visible use cases.
2. Edit or add profiles in `src/lib/csvCleanroom.js`.
3. Keep every fixture row synthetic; do not paste customer exports, emails, credentials, invoices, logs, or screenshots.
4. Refresh `docs/demo-screenshot.png` after visual changes.
5. Rerun `npm run smoke`, `npm run typecheck`, and `npm run build`.

## Buyer Credibility Checklist

- The hero states that processing is local and public-safe.
- The selected profile catches missing required columns and invalid values.
- The issue table explains duplicate, whitespace, casing, email, URL, date, and phone findings.
- Export buttons produce cleaned CSV, JSON issue report, and Markdown handoff files.
- CLI usage in the README works with the committed fixture.

## Starter Adaptation Brief

Fork CSV Cleanroom as a public-safe client demo for CSV and spreadsheet cleanup. Keep all records fictional, tune the profile rules in `src/lib/csvCleanroom.js`, update `src/data/sampleCsv.ts`, and publish only after smoke, typecheck, and build pass.
