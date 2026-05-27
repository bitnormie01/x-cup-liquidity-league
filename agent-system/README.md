# X Cup Liquidity League — Agent Orchestration System

> Two-role build pipeline for the X Layer hackathon. **Executor** (Codex/Hermes in WSL) writes code; **Mastermind** (Claude Code on the Windows host) reviews and directs. Every file in this folder is shared, durable state — it survives agent swaps mid-flight.

## TL;DR

- **Repo source-of-truth:** the Executor's commits.
- **Plan source-of-truth:** the phase files under `02-plans/`.
- **State source-of-truth:** `03-state/state-counter.md`.
- **Loop:** Mastermind drafts a directive → Executor patches + commits + writes a report → Mastermind pulls + reviews → next directive.

## Index

| Folder | Purpose |
|---|---|
| `00-brief/` | Condensed PRD any agent can read in 5 minutes. |
| `01-roles/` | System prompts for the two agents + the handoff protocol + directive files. |
| `02-plans/` | All plans, each broken into sequential phases. |
| `03-state/` | Current cursor (which plan/phase is live) + status table. |
| `04-summaries/` | Append-only log + per-phase reports + screenshots. |
| `05-templates/` | Fill-in templates for directives and reports. |
| `automation/` | Optional autonomous loop scripts for one Mastermind plus failover Hermes Executors. |

## First-Time Onboarding (any agent — read top-down)

1. `00-brief/project-brief.md` — what we're building. (5 min)
2. Your role: `01-roles/executor-prompt.md` or `01-roles/mastermind-prompt.md`. (3 min)
3. `01-roles/handoff-protocol.md`. (2 min)
4. `03-state/state-counter.md` — where the project is right now. (1 min)
5. The active phase file the state counter points to. (3 min)
6. Begin your role-specific workflow.

Total onboarding cost: ~15 minutes of reading. Designed to fit in a single fresh context window.

## The Loop (one cycle = one phase)

```
┌──────────────────┐    directive file     ┌──────────────────┐
│    Mastermind    │ ────────────────────► │     Executor     │
│   (read + plan)  │                       │  (code + commit) │
└────────┬─────────┘                       └─────────┬────────┘
         │                                           │
         │  git pull                                 │  git push
         │ ◄───── report + commits + state ─────────┤
         │                                           │
         ▼                                           ▼
   review + next directive                  wait for next directive
```

## Automation

For hands-off execution across the local machine plus a Cloud Shell backup worker, see `automation/README.md`.

The automation layer keeps the same repo protocol: one Mastermind writes/reviews directives, while Hermes Executors claim a GitHub-backed lock before implementing a phase. This prevents both Executors from editing the same phase at the same time and allows backup takeover when the active worker stalls or rate-limits.

## Conventions

- **Filenames:** kebab-case, two-digit prefix where order matters.
- **Phase IDs:** `P<plan>-<phase>` zero-padded, e.g. `P04-02` = Plan 4, Phase 2.
- **Directive IDs:** `D<n>` monotonically increasing across the whole project; never reused.
- **Report files:** `04-summaries/reports/<phase-id>.md` (and `<phase-id>-v2.md` if reopened).
- **Directive files:** `01-roles/directives/D<n>-<phase-id>.md`.
- **Commit messages:** `[<phase-id>] <imperative-summary>` — e.g. `[P02-01] add DemoFanToken with faucet mint`.

## Hard Rules

- ✗ Mastermind does NOT write code or edit `contracts/`, `frontend/`, `script/`, `test/`. Only writes to `01-roles/directives/`, `03-state/`, and (rarely) `02-plans/**`.
- ✗ Executor does NOT modify `00-brief/`, `01-roles/{executor,mastermind}-prompt.md`, or any `02-plans/**` file. Those belong to the Mastermind.
- ✗ No phase is "done" until: the report file exists, the state counter is bumped, the execution log has a new line, and all changes are pushed.

## Plans Map

See `02-plans/INDEX.md` for full detail.

1. **P01 Foundation** — repo, Foundry, X Layer config.
2. **P02 Tokens** — DemoFanToken × 4, DemoQuoteToken, TeamPassport.
3. **P03 Registry** — XCupLeagueRegistry.
4. **P04 Hook** — XCupLiquidityLeagueHook + tests (the actual product).
5. **P05 Deployment** — scripts, pools, testnet deploy.
6. **P06 Frontend** — Next.js dashboard.
7. **P07 Submission** — demo, README, video, form.

## Deadline

Hackathon submission: **2026-05-28 23:59 UTC**. Optimize for working > perfect.
