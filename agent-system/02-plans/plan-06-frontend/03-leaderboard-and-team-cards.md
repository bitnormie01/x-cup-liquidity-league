---
phase-id: P06-03
plan: P06
revised-on: 2026-05-26
---

# P06-03 — Leaderboard + Team Cards

## Goal

Build the live leaderboard table and the per-team cards. Both read from the Hook and Registry. This is the visual centerpiece of the demo.

## Scope (In)

- `components/Leaderboard.tsx`:
  - columns: Rank, Team (flag + name), Total Points, Swap Points, LP Points, Fans, Match State, Active Fee, Pool / Explorer link.
  - sort descending by `totalPoints`. Tie-breakers: `lpPoints` desc, then `fanCount` desc.
  - data: `useReadContracts` batched call to:
    - Hook `getTeamScore(teamId)` for each of the 4 teams.
    - Registry `matchStateOfTeam(teamId)`.
    - Hook `getActiveFeeBps(poolId, address(0))` (or compute client-side from state + bounds — pick one, document).
    - Passport `teamFanCount(teamId)`.
    - Pool addresses from `lib/deployments`.
  - auto-refetch every 5 s and on each new block (`useBlockNumber` subscription).
- `components/TeamCard.tsx`:
  - name, ticker, flag.
  - pool address (truncated) with explorer link.
  - current points (total + breakdown).
  - fan count.
  - current match state (color-coded: PRE_MATCH gray, LIVE_NORMAL green, GOAL_SHOCK red, RED_CARD orange, PENALTY purple, FINAL_WHISTLE blue).
  - active fee in %.
- `app/page.tsx`: leaderboard above the team cards grid (4-up on desktop, 1-up on mobile).
- Loading / empty / error states for all reads.

## Scope (Out)

- Personal contribution detail per team (already on PassportCard).
- Charts, sparklines, history (PRD calls them "should-have" but not MVP).
- Real-time push (polling + block subscription is enough).

## Acceptance Criteria

- [ ] Leaderboard renders 4 rows with live data from the registered pools.
- [ ] Sort is stable and correct.
- [ ] Color-coded match state on team cards.
- [ ] Refetches without a manual reload after a swap is performed via P06-04.
- [ ] Screenshot saved: `agent-system/04-summaries/screenshots/P06-03-leaderboard.png`.

## Risks / Pitfalls

- `useReadContracts` returns a tuple per call; type the result narrowly.
- Active-fee computation: if you can't easily compute it client-side, just read the current `matchState` and look up `feeForState[state]` (read from Hook). The brief allows this simplification.
- Polling too aggressively burns RPC quota. 5 s is fine.

## Reference

- Brief: "Demo Path", "Match States & Fees".
- PRD §14 UX Requirements — Leaderboard, Team Cards.
