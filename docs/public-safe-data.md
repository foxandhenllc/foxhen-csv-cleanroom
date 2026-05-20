# Public-Safe Data Policy

CSV Cleanroom is designed for demos, portfolio review, and client handoffs without exposing real records.

## Allowed Data

- Fictional names, companies, domains, phone numbers, and dates.
- Synthetic CSV fixtures created specifically for this repo.
- Public-safe examples that do not identify a customer, vendor, employee, lead, or private business process.
- Generic issue labels such as `invalid_email`, `duplicate`, `whitespace`, and `missing_required_value`.

## Prohibited Data

- Real customer exports, mailing lists, CRM rows, invoices, support tickets, or analytics dumps.
- Credentials, API keys, tokens, passwords, session cookies, or private URLs.
- Personal email addresses, phone numbers, addresses, health data, finance data, or employment records.
- Screenshots or reports copied from a private client workspace.

## Operating Rules

1. Run the browser app or CLI only against local files you are allowed to inspect.
2. Replace fixture data with synthetic equivalents before committing.
3. Review generated CSV, JSON, Markdown, screenshots, and README examples before publishing.
4. Keep the app static: no backend, auth, tracking pixels, upload endpoints, or external APIs.
5. Treat issue reports as potentially sensitive until they have been sanitized.

## Pre-Publish Checklist

- [ ] `fixtures/` contains synthetic data only.
- [ ] `docs/demo-screenshot.png` shows fictional rows only.
- [ ] README examples use fake records and local paths.
- [ ] `npm run smoke`, `npm run typecheck`, and `npm run build` pass.
- [ ] No secrets or customer identifiers appear in git diff.
