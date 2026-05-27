# 01-roles — Index

- `executor-prompt.md` — paste-ready system prompt for the Executor agent (Codex/Hermes in WSL).
- `mastermind-prompt.md` — paste-ready system prompt for the Mastermind agent (Claude Code on Windows).
- `handoff-protocol.md` — the rules that govern how the two agents exchange information.
- `directives/` — Mastermind writes per-phase directives here (one file per directive). Created on demand; safe to be empty at project start.

## How to start a new agent session

**Executor (in WSL Ubuntu):**
1. Open the Codex/Hermes CLI.
2. Paste the entire contents of `executor-prompt.md` as the initial system instruction.
3. Tell the agent: "Read agent-system/03-state/state-counter.md, then the active directive, then begin."

**Mastermind (Claude Code on Windows):**
1. Open Claude Code from the repo root.
2. Paste the entire contents of `mastermind-prompt.md` as the initial system instruction (or save it as your project's `CLAUDE.md`).
3. Tell the agent: "Pull the repo, read the latest report and the state counter, then issue the next directive."
