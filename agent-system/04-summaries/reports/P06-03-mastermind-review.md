# Mastermind Review — P06-03

Reviewed by: `mastermind-chatgpt`  
Reviewed at: 2026-05-28T10:00Z  
Verdict: CHANGES REQUIRED — fix match-state color mapping before advancing to P06-04.

## Review Basis

Manual review of commits `b0cc836` and `9dd2cfd`, `Leaderboard.tsx`, `TeamCard.tsx`, `use-league-data.ts`, `match-states.ts`, ABI changes, page integration, report/state updates, and recorded build/dev validation. I did not manually operate a browser wallet.

## Accepted Work

- Leaderboard component exists and renders team rows from live reads.
- Team cards exist and render all four teams from the same data source.
- Hook ABI was extended with `getTeamScore(bytes32)` and `feeForState(uint8)`.
- Registry ABI was added for `matchStateOfTeam(bytes32)`.
- TeamPassport fan counts are included.
- Sorting is deterministic: `totalPoints` desc, `lpPoints` desc, `fanCount` desc, then `symbol` asc.
- Active fee is shown with clear units.
- Pool IDs are displayed, and token explorer links are used instead of inventing unsupported pool URLs.
- 5-second polling is documented and acceptable for this phase.
- Build/dev validation and screenshot were recorded.

## Blocking Finding

The directive and phase plan require specific match-state color coding:

| State | Required Color |
|---|---|
| `PRE_MATCH` | gray |
| `LIVE_NORMAL` | green |
| `GOAL_SHOCK` | red |
| `RED_CARD` | orange |
| `PENALTY` | purple |
| `FINAL_WHISTLE` | blue |

Current `frontend/lib/match-states.ts` does not match this mapping:

- `GOAL_SHOCK` is sky/blue instead of red.
- `RED_CARD` is red instead of orange.
- `PENALTY` is amber instead of purple.
- `FINAL_WHISTLE` is stone/gray instead of blue.

This is a small visual/spec mismatch, not an architectural issue.

## Required Fix

- Update `frontend/lib/match-states.ts` to match the required color mapping.
- Keep labels, enum IDs, and fallback behavior unchanged unless necessary.
- Run `cd frontend && pnpm build`.
- Run the dev server check if practical.
- Create a short P06-03 fix report and update state/log.

## Decision

Do not proceed to P06-04 yet. Issue D20 as a narrow P06-03 color-map fix directive.
