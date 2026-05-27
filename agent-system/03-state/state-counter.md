# State Counter

> Single source of truth for "where are we right now?" Updated by the Executor at phase end and by the Mastermind when issuing a new directive.

## Cursor

| Field | Value |
|---|---|
| Active Plan | `P02` — Tokens |
| Active Phase | `P02-02` — TeamPassport (soulbound) |
| Active Phase Status | `IN_PROGRESS` |
| Active Directive | `D4` |
| Last Completed Phase | `P02-01` |
| Last Commit SHA | `a4b7616` |
| Next Directive ID | `D5` |
| Last Updated By | `mastermind-wsl` |
| Last Updated At | 2026-05-27T14:05Z |

## Status Legend

- `PENDING` — no directive issued yet for this phase.
- `IN_PROGRESS` — directive issued, Executor working.
- `AWAITING_REVIEW` — Executor pushed report, Mastermind hasn't reviewed.
- `BLOCKED` — Executor reported BLOCKED, awaits new directive.
- `DONE` — Mastermind reviewed and accepted.
- `AWAITING_DIRECTIVE` — phase finished, Mastermind hasn't issued the next one yet.

## Open Blockers

(Empty until something blocks. Format: `- <phase-id> | <one-line description> | <directive-id-that-introduced-it>`)

## Notes

- See `phase-status.md` for the full grid across all plans.
- After updating this file, also append a row to `../04-summaries/execution-log.md`.
- This file is the cursor. The grid is the dashboard. The log is the history.
