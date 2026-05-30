# X Cup Liquidity League Demo

One-line promise: connect a wallet, support a team through swaps, change match state, and watch hook-driven scores, fees, proof, and events update live.

## Prerequisites

- Browser wallet with X Layer testnet support.
- X Layer testnet selected.
- Small amount of X Layer testnet OKB for gas.
- Fresh wallet recommended because demo token faucet cooldown is 4 hours.

## URL

- Hosted frontend: TBD — run locally for now.
- Local frontend: `http://127.0.0.1:3000`
- Admin URL: `http://127.0.0.1:3000?admin=1`

Run locally:

```bash
cd frontend
pnpm install
pnpm dev --hostname 127.0.0.1 --port 3000
```

## 90 Second Walkthrough

Expected timing is about 90 seconds if RPC responses and wallet confirmations are healthy.

1. Open the frontend at `http://127.0.0.1:3000` and connect a browser wallet on X Layer testnet.
2. In the Faucet panel, claim xUSD.
3. Claim BRA or another fan token if needed for reverse/demo flows.
4. In the Team Passport panel, select BRA and mint the BRA passport.
5. In the Swap panel, swap xUSD -> BRA and watch the leaderboard/event log update.
6. Show the Add Support panel for ARG. Browser Add Support is paused in the final UX because wallet simulation can fail on the MVP liquidity path; point to seeded LP proof and LP points in Live League instead.
7. Open the admin URL `http://127.0.0.1:3000?admin=1` and trigger GOAL_SHOCK for BRA from the Match-State Simulator. The connected wallet must be the registry controller or owner.
8. Swap BRA again and observe the active-fee preview and event-log change.
9. Rapidly reverse swap if balances allow, then observe whether the anti-wash penalty event or fee penalty appears.
10. Show the Contract Proof panel with deployed addresses, explorer links, pool IDs, chain ID, and project-owned PoolManager disclosure.

## Troubleshooting

- Wrong network: switch the wallet to X Layer testnet, chain ID `1952`.
- No testnet OKB: fund the wallet with enough OKB to pay gas.
- Faucet cooldown: use a fresh wallet or wait for the 4 hour cooldown to expire.
- Wallet approval pending: confirm token approvals before retrying swap actions.
- X Layer RPC/event log delay: wait a few seconds; the event log polls a bounded recent-block window.
- Admin panel hidden: open the frontend with `?admin=1`.
- Admin write disabled: connect the registry controller or owner wallet.

## Known Caveats

- Demo tokens have no value.
- Teams are mock country labels only.
- The X Layer testnet deployment uses a project-owned PoolManager because no canonical testnet PoolManager was confirmed.
- Event log uses bounded recent-block polling.
- Browser Add Support is disabled for final-submission honesty; seeded LP proof remains visible in Live League and [CONTRACT_PROOF.md](CONTRACT_PROOF.md).
- Browser-wallet testing should be performed again before final video recording.
- No hosted app, demo video, X post, or final submission form exists yet.
