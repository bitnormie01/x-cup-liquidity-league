---
phase-id: P06-02
plan: P06
revised-on: 2026-05-26
---

# P06-02 — Faucet + Passport UI

## Goal

Build two panels: a faucet panel that lets a user claim xUSD + any fan token, and a Team Passport mint card.

## Scope (In)

- `components/FaucetPanel.tsx`:
  - lists xUSD and each fan token (BRA/ARG/FRA/GER).
  - "Claim" button per token → `useWriteContract` calling `faucetMint(connectedAddress)`.
  - shows `FAUCET_AMOUNT` (read from contract) and remaining cooldown (compute from `lastFaucetAt`).
  - disables the button + shows "Cooldown — try again in Xm" if blocked.
  - on success, toast + refetch user balances.
- `components/PassportCard.tsx`:
  - if no wallet connected → "Connect wallet to mint a Team Passport".
  - if wallet but no passport → team selector (4 buttons: BRA/ARG/FRA/GER) + "Mint Passport" button → calls `mintPassport(teamId)`.
  - if passport exists → show team name, token id, "Soulbound" label, and the user's `swapPoints`/`lpPoints`/`totalPoints` for that team (read from Hook's `getUserContribution`).
- `components/TeamSelector.tsx` (small): a row of 4 cards (flag emoji + name), single-select.
- `lib/teams.ts`: constants for the 4 teams (`teamId`, name, symbol, flag emoji `🇧🇷 🇦🇷 🇫🇷 🇩🇪`).
- ABIs: generate or hand-write JSON ABIs for `DemoFanToken`, `DemoQuoteToken`, `TeamPassport`. Place under `frontend/lib/abis/`.
- Integrate both panels into `app/page.tsx`.

## Scope (Out)

- Leaderboard (P06-03).
- Swap/LP panels (P06-04).
- Match-state simulator (P06-05).
- Team change UI — explicit non-goal per brief.

## Acceptance Criteria

- [ ] Faucet panel claims xUSD + fan tokens; cooldown UI works.
- [ ] Passport mint succeeds for a team; soulbound transfer attempted via UI is impossible (no transfer UI exposed).
- [ ] After mint, panel reflects passport state without page reload.
- [ ] User contribution numbers render (zero before any activity is fine).
- [ ] Screenshot saved: `agent-system/04-summaries/screenshots/P06-02-faucet-passport.png`.

## Risks / Pitfalls

- `useWaitForTransactionReceipt` + refetch pattern is the cleanest way to refresh balances after writes. Avoid `setTimeout`.
- Computing cooldown remaining: `nextAvailableAt = lastFaucetAt + FAUCET_COOLDOWN`. If `block.timestamp` is hard to get in the browser, use `Date.now() / 1000` — drift is irrelevant for UX.
- Team ids must match the contract: `keccak256(bytes("BRA"))` etc. Compute once in `lib/teams.ts` using viem's `keccak256` + `toBytes`.

## Reference

- Brief: "Demo Path" (steps 2–3); "Constants Cheatsheet".
- PRD §14 UX Requirements — Hero, Passport, Faucet sections.
