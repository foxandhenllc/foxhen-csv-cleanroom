# Client Brief Template

Use this template before customizing CSV Cleanroom for a buyer, portfolio sample, or internal team.

## Project Snapshot

- Client or demo name:
- Workflow type:
- Profile to use or create:
- Target users:
- Expected CSV source:
- Desired output format:

## Public-Safe Boundary

- Real data allowed in repo: No
- Synthetic fixture owner:
- Fields to mask or replace:
- Screenshot review owner:
- Notes that must not appear in docs or reports:

## Required Columns

| Column | Required? | Validation | Notes |
|---|---:|---|---|
| name | Yes | text/title casing | Replace with the workflow fields. |
| email | Yes | email/lowercase | Duplicate key for email lists. |
| website | No | URL | Adds `https://` when safe. |
| signup_date | No | date | Normalizes to `YYYY-MM-DD`. |
| phone | No | phone | Formats US numbers. |

## Acceptance Criteria

- [ ] CSV can be pasted and dragged into the UI.
- [ ] Selected profile catches missing required columns and values.
- [ ] Email, URL, date, and phone validation behave as expected.
- [ ] Duplicate rows are visible in the issue table.
- [ ] Cleaned CSV excludes blocked duplicate/error rows.
- [ ] JSON issue report and Markdown handoff export successfully.
- [ ] CLI command works with the agreed fixture.
- [ ] README and screenshot contain only public-safe synthetic data.

## Handoff Notes

- Final profile ID:
- Files changed:
- Validation commands run:
- Open questions:
