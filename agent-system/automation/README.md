# Autonomous Agent Loop

This folder contains the optional automation layer for the X Cup Liquidity League build.

Goal:
- one Mastermind loop reviews reports and issues directives;
- two Hermes Executor loops act as failover workers;
- only one Executor can work at a time;
- if an Executor stalls or rate-limits, the other can take over after the lock expires;
- Telegram alerts fire when human attention is needed.

## Roles

Mastermind:
- run only one instance;
- uses Claude Code print mode;
- reviews `agent-system/04-summaries/reports/**`;
- writes directives under `agent-system/01-roles/directives/**`;
- updates `agent-system/03-state/state-counter.md`;
- never edits implementation source.

Executor:
- run one or more instances;
- uses Hermes one-shot mode;
- claims the distributed executor lock before work;
- implements the active directive;
- writes reports, state updates, commits, and pushes.

## Distributed lock

The Executor lock is a GitHub branch:

`agent-lock/executor`

`claim-lock.sh` creates this branch with lock metadata. If another Executor sees a fresh lock, it waits. If the lock is older than `LOCK_TTL_SECONDS` (default 3600), a backup Executor may delete it and claim work.

## Required tools

Each environment should have:

- git
- gh authenticated to the repo account
- foundry (`forge`, `cast`)
- tmux
- Codex CLI for Codex-based Mastermind and Executor workers
- Hermes for legacy Executor workers, only if overriding `EXECUTOR_AGENT_CMD`
- Claude Code for legacy Mastermind workers, only if overriding `MASTER_AGENT_CMD`

## Codex agent commands

By default, both loops run Codex CLI:

```bash
codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox --dangerously-bypass-hook-trust --json -
```

Override either role if needed:

```bash
export MASTER_AGENT_CMD='codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox --dangerously-bypass-hook-trust --json -'
export EXECUTOR_AGENT_CMD='codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox --dangerously-bypass-hook-trust --json -'
```

The prompts under `agent-system/automation/prompts/` define the role behavior, so two Codex processes can act as separate Mastermind and Executor agents.

## Optional alert env vars

```bash
export TELEGRAM_BOT_TOKEN='123:abc'
export TELEGRAM_CHAT_ID='123456789'
```

If these are absent, notifications print to stdout only.

## Start on the main WSL machine

```bash
cd /home/bitnormie01/x-cup-liquidity-league

export WORKER_ID=executor-wsl
export TELEGRAM_BOT_TOKEN='...'
export TELEGRAM_CHAT_ID='...'

chmod +x agent-system/automation/*.sh

tmux new-session -d -s xcll-mastermind './agent-system/automation/mastermind-loop.sh'
tmux new-session -d -s xcll-executor-wsl './agent-system/automation/executor-loop.sh'
```

## Start on Cloud Shell

```bash
git clone https://github.com/bitnormie01/x-cup-liquidity-league.git
cd x-cup-liquidity-league

export WORKER_ID=executor-cloudshell
export TELEGRAM_BOT_TOKEN='...'
export TELEGRAM_CHAT_ID='...'

chmod +x agent-system/automation/*.sh

tmux new-session -d -s xcll-executor-cloud './agent-system/automation/executor-loop.sh'
```

## Monitor

```bash
tmux capture-pane -t xcll-mastermind -p -S -80
tmux capture-pane -t xcll-executor-wsl -p -S -80

git log --oneline -20
git status --short --branch
```

Logs are written under:

`agent-system/automation/logs/`

That folder is gitignored.

## Stop

```bash
tmux kill-session -t xcll-mastermind || true
tmux kill-session -t xcll-executor-wsl || true
tmux kill-session -t xcll-executor-cloud || true
```

If a lock is stuck and you are sure no Executor is active:

```bash
FORCE_RELEASE=1 WORKER_ID=manual ./agent-system/automation/release-lock.sh
```

or delete the remote lock branch directly:

```bash
git push origin :refs/heads/agent-lock/executor
```

## Safety rules

- Never run two Masterminds.
- Executors must not work unless they acquire the lock.
- Executors should not bypass the directive/phase protocol.
- Do not commit `.env`, keys, deployer wallets, or private RPC URLs.
- Avoid co-author trailers in autonomous commits.
