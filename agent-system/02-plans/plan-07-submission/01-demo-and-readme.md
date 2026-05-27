---
phase-id: P07-01
plan: P07
revised-on: 2026-05-26
---

# P07-01 — Demo Path Doc + README

## Goal

Write `DEMO.md` (the exact judge-walkthrough) and bring the root `README.md` to full submission quality.

## Scope (In)

- `DEMO.md` at repo root:
  - "Pre-requisites" — wallet on X Layer testnet, some OKB testnet, browser, etc.
  - "URL" — link to the deployed frontend (Vercel or local) and the admin URL (`?admin=1`).
  - Numbered steps (mirror Brief "Demo Path"):
    1. Open URL → wallet connect.
    2. Faucet xUSD.
    3. Mint passport for BRA.
    4. Swap xUSD → BRA. Watch leaderboard.
    5. Add liquidity to ARG. Watch leaderboard.
    6. Open admin URL, trigger GOAL_SHOCK on BRA, observe fee change.
    7. Swap BRA again, observe new fee + event log.
    8. Rapid reverse swap, observe wash penalty.
    9. Show ContractProofPanel (or jump to "Deployed Addresses" in README).
  - "Expected timing": ~90 seconds for steps 1–9 if RPC is healthy.
  - "Troubleshooting": stuck tx, wrong network, faucet cooldown.
- Root `README.md`:
  - Pitch (1 line + 1 paragraph).
  - Screenshots (link to `agent-system/04-summaries/screenshots/`).
  - Architecture diagram (mermaid block — copy from PRD §12 high-level architecture, simplified).
  - Hook callback explanation (1 paragraph + table — from Brief).
  - Deployed addresses table (X Layer testnet, optional mainnet).
  - Networks section (already from P01-02).
  - Setup instructions:
    ```
    # Contracts
    cd contracts && forge build && forge test
    # Deploy (testnet)
    forge script script/DeployTokens.s.sol --rpc-url xlayer_testnet --broadcast
    # Frontend
    cd frontend && pnpm install && pnpm dev
    ```
  - Demo script (link to DEMO.md).
  - Known limitations (use Brief "Hard No-Gos" + technical caveats from reports).
  - Future extensions (use PRD §7 "Nice to Have").
  - Submission links (X post, video, form confirmation — fill in P07-02/03).
  - License (MIT recommended; user can override).

## Scope (Out)

- API docs (`forge doc`) — out of scope for hackathon.
- Subgraph instructions.
- Production deploy guide.

## Acceptance Criteria

- [ ] `DEMO.md` written and tested by walking through it with a fresh wallet.
- [ ] `README.md` covers every item from Brief "Submission Requirements".
- [ ] Architecture diagram renders on GitHub (test by pushing and viewing in browser).
- [ ] All addresses match `deployments/xlayer-testnet/*.json`.

## Risks / Pitfalls

- Mermaid diagrams sometimes fail to render on GitHub when nested fence is wrong. Keep it simple, one diagram.
- The faucet cooldown can break the demo: include a "Use a fresh wallet" tip in DEMO.md.
- Screenshot files must be committed and referenced with relative paths.

## Reference

- Brief: "Submission Requirements", "Demo Path".
- PRD §14 UX, §10 FR12.
