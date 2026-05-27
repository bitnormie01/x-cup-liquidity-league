# 04-summaries — Index

- `execution-log.md` — append-only one-line entries per phase (chronological).
- `reports/` — full Executor reports, one file per phase (or per re-run).
- `screenshots/` — frontend screenshots referenced from reports.

## Folder rules

- `reports/` and `screenshots/` are created the first time they're needed; safe to be empty at project start.
- Filenames in `reports/`: `<phase-id>.md` for the initial run; `<phase-id>-v2.md`, `<phase-id>-v3.md` for re-runs after BLOCKED/PARTIAL.
- Filenames in `screenshots/`: `<phase-id>-<short-view-label>.png` (kebab-case).
