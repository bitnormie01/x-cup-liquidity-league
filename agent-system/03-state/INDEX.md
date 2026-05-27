# 03-state — Index

- `state-counter.md` — the live cursor (which plan + phase is active, last commit, next directive id).
- `phase-status.md` — the full status grid across all plans/phases.

## Update rules

| Event | Updater | Files |
|---|---|---|
| Mastermind issues directive | Mastermind | `state-counter.md` (bump `Next Directive ID`, set `Active Phase`) |
| Executor completes phase | Executor | `state-counter.md` (`Last Completed Phase`, `Active Phase` → next), `phase-status.md` (tick the row), `04-summaries/execution-log.md` (append line) |
| Phase blocked | Executor | `state-counter.md` (`Open Blockers` list) |

If the state files disagree with the latest commit on `main`, the latest commit wins.
