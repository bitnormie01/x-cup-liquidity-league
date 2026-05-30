# Demo Video Script

Target: 1-3 minutes, 1080p screen recording, browser zoom 100%, wallet popups visible only when needed.

## Setup Before Recording

- Start the frontend locally:

```bash
cd frontend
pnpm dev --hostname 127.0.0.1 --port 3000
```

- Open normal demo: `http://127.0.0.1:3000`
- Open admin demo: `http://127.0.0.1:3000?admin=1`
- Use a wallet on X Layer testnet with OKB for gas.
- Keep private keys, `.env`, terminal history, and wallet seed UI off screen.

## Timestamped Shot List

### 0:00-0:10 — Repo and README proof

Visual: GitHub repo or local README at the project title, screenshots, architecture, deployment table, and `CONTRACT_PROOF.md`.

Caption/voice-over:

> This is X Cup Liquidity League: a World Cup-style fan battle built on X Layer with Uniswap v4 hooks. The repo includes the demo walkthrough, deployed addresses, screenshots, contract proof, and live read checks.

### 0:10-0:20 — Contract proof panel

Visual: Frontend Contract Proof panel showing chain ID `1952`, PoolManager disclosure, token links, core contract links, and pool IDs.

Caption/voice-over:

> The demo runs on X Layer testnet. The contract proof panel exposes every address judges need: tokens, registry, passport, hook, helper, and all four pool IDs. This deployment uses a project-owned PoolManager on testnet because no canonical X Layer testnet PoolManager was confirmed.

### 0:20-0:30 — Wallet connect

Visual: Connect wallet, show X Layer testnet network badge.

Caption/voice-over:

> Connect a browser wallet on X Layer testnet. A fresh wallet is best because faucet cooldown is four hours.

### 0:30-0:42 — Faucet claim

Visual: Faucet panel; claim xUSD, then claim BRA if needed.

Caption/voice-over:

> Claim demo xUSD for pool actions. Claim a team token such as BRA if you want to show reverse swap behavior.

### 0:42-0:52 — Team Passport

Visual: Team Passport panel; select BRA and mint.

Caption/voice-over:

> Mint a soulbound Team Passport for BRA. The hook checks supporter status and can apply a small fee discount.

### 0:52-1:05 — Leaderboard before swap

Visual: Leaderboard and team cards before action.

Caption/voice-over:

> The leaderboard reads live hook scores, fan counts, match state, active fee, and pool IDs.

### 1:05-1:20 — Swap panel action

Visual: Swap xUSD -> BRA. Show approval if needed, then swap. After receipt, return to leaderboard.

Caption/voice-over:

> Swap xUSD into BRA through the deployed V4PoolActionHelper. The swap routes through PoolManager and the hook awards swap points.

### 1:20-1:35 — Add Support proof

Visual: Add Support panel for ARG, then Live League LP points and `CONTRACT_PROOF.md`.

Caption/voice-over:

> Browser Add Support is paused because wallet simulation can fail on the MVP liquidity-settlement path. The deployed pools were seeded on testnet, LP points are live, and the proof file documents the on-chain reads.

### 1:35-1:50 — Admin match-state update

Visual: Admin URL with Match-State Simulator; select BRA; trigger GOAL_SHOCK.

Caption/voice-over:

> From the admin URL, a controller or owner wallet can update match state. Switching BRA to GOAL_SHOCK changes the active fee read by the hook.

### 1:50-2:05 — Event log

Visual: Event Log panel after actions.

Caption/voice-over:

> The event log decodes recent hook and registry events: dynamic fees, points awarded, wash penalties, and match-state updates.

### 2:05-2:20 — Anti-wash fallback / reverse swap

Visual: Try a rapid reverse swap if balances and confirmations allow; otherwise show anti-wash explanation in hook callback section of README.

Caption/voice-over:

> Rapid reversal attempts can trigger anti-wash handling. If the wallet or RPC is slow, the implemented hook path is still visible in code and events are shown when transactions land.

### 2:20-2:40 — Close on proof

Visual: Return to README and Contract Proof panel.

Caption/voice-over:

> The project is demo-ready: contracts deployed on X Layer testnet, frontend panels wired to those contracts, and all proof links recorded in the repository.

## Slow Transaction Fallback

If browser transactions are slow during recording:

- Show the P05-03 smoke-swap proof in `agent-system/04-summaries/reports/P05-03-v3.md`.
- Show `CONTRACT_PROOF.md` for bytecode, registry, pool, hook, and OKLink proof.
- Show the live leaderboard and event log panels.
- State clearly: "Full frontend write paths are implemented; this clip is using already-deployed testnet state while wallet confirmations are pending."
- Do not claim a pending transaction succeeded until the wallet receipt confirms.
