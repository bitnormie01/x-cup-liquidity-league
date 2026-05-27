# State Counter

> Single source of truth for "where are we right now?" Updated by the Executor at phase end and by the Mastermind when issuing a new directive.

## Cursor

| Field | Value |
|---|---|
| Active Plan | `P02` — Tokens |
| Active Phase | `P02-03` — Token tests |
| Active Phase Status | `IN_PROGRESS` |
| Active Directive | `D5` |
| Last Completed Phase | `P02-02` |
| Last Commit SHA | `0cfd21c` |
| Next Directive ID | `D6` |
| Last Updated By | `mastermind-wsl` |
| Last Updated At | 2026-05-27T14:30Z |

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
