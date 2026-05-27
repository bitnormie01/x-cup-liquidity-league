# Plan 06 — Frontend

Next.js + wagmi + viem dashboard that lets a judge run the demo path in ~90 seconds. Minimal, fast, judge-friendly. No animations, no fancy charts.

## Phases

| ID | File | Goal |
|---|---|---|
| P06-01 | `01-nextjs-and-wallet.md` | Next.js + Tailwind + wagmi + viem + RainbowKit (or injected) + X Layer network detection. |
| P06-02 | `02-faucet-and-passport-ui.md` | Faucet panel (xUSD + fan tokens) + Team Passport mint card. |
| P06-03 | `03-leaderboard-and-team-cards.md` | Leaderboard table + team cards (points, fans, match state, active fee). |
| P06-04 | `04-swap-and-lp-panels.md` | Swap panel (xUSD ↔ team token) + liquidity-support panel. |
| P06-05 | `05-match-sim-and-event-log.md` | Match-state admin/demo controller + event log + contract proof panel. |

## Exit Criteria

- `pnpm build` succeeds.
- `pnpm dev` serves a working dashboard at localhost:3000.
- Connecting a wallet on X Layer testnet shows live team scores from the on-chain registry/hook.
- The demo path runs end-to-end without code edits.
- A screenshot of every major panel saved under `agent-system/04-summaries/screenshots/`.

## Conventions

- TypeScript strict mode.
- All on-chain reads via `wagmi` hooks (`useReadContract`, `useReadContracts`); writes via `useWriteContract` + `useWaitForTransactionReceipt`.
- Addresses loaded from `frontend/lib/deployments.ts` which imports the JSONs committed in P05-03.
- No backend / no Vercel function / no API route — pure client app.
