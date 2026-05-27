---
phase-id: P06-04
plan: P06
revised-on: 2026-05-26
---

# P06-04 — Swap + LP Panels

## Goal

Build minimal swap (xUSD ↔ team token) and liquidity-support panels. These are the interactions that drive the on-chain leaderboard. UX can be crude — judges click 3 buttons and the leaderboard reacts.

## Scope (In)

- `components/SwapPanel.tsx`:
  - team selector (4 buttons).
  - direction toggle (xUSD → TEAM | TEAM → xUSD).
  - amount input (xUSD or team-token decimals).
  - "Approve" + "Swap" buttons. Two-step flow when allowance is insufficient.
  - swap is routed through a thin test router OR through the v4 PoolManager `unlock` callback pattern. **Decision:** ship the simplest path — copy the pattern from v4-core test fixtures (`SwapRouterNoChecks` or equivalent) and import into `frontend/lib/abis/`. If router-deploy is needed, add it to P05-02 as a small addendum and note in report.
  - shows expected fee (read from Hook, current match state) before submission.
  - on success: toast + leaderboard auto-refresh.
- `components/LiquidityPanel.tsx`:
  - team selector.
  - amount input (xUSD only — script computes the matching team-token side for full-range at `SQRT_PRICE_1_1`).
  - "Approve" + "Add Liquidity" buttons.
  - calls a small liquidity router contract (same as P05-02 used).
  - on success: toast + leaderboard auto-refresh.
- Wire both panels into `app/page.tsx` below the leaderboard.

## Scope (Out)

- Remove liquidity (we only need add for the demo).
- Slippage controls (set high default).
- Routing across multiple pools.
- TWAP / chart / price preview beyond the trivial.

## Acceptance Criteria

- [ ] Swap xUSD → BRA succeeds end-to-end against the testnet.
- [ ] After swap, leaderboard updates BRA's `swapPoints` (within one block).
- [ ] LP add on ARG succeeds; `lpPoints` updates.
- [ ] Active-fee preview matches the fee actually applied (within the bounds clamp).
- [ ] Screenshot saved: `agent-system/04-summaries/screenshots/P06-04-swap.png` and `...-liquidity.png`.

## Risks / Pitfalls

- v4 swap UX without periphery is the hardest UX in the project. **Strongly prefer** importing a v4-periphery `Swap` helper or pasting the test router from v4-core. Reinventing `PoolManager.unlock` from scratch in TS is risky — use a thin Solidity router and call `cast send` equivalents.
- Approvals are still ERC-20 (the v4 PoolManager pulls tokens via the unlock callback after the router transfers them).
- If running short on time, ship swap only; flag LP as "ready in code, demo via script" — the brief allows scripted LP for the judge demo.

## Reference

- Brief: "Demo Path" (steps 4–8); "Scoring Formulas".
- PRD §10 FR4, FR5, FR6.
