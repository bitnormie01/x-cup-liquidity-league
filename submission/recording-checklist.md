# Recording Checklist

## Wallet and Network

- [ ] Use a fresh wallet or a wallet whose faucet cooldown is available.
- [ ] Fund the wallet with enough X Layer testnet OKB for gas.
- [ ] Confirm X Layer testnet is selected.
- [ ] Confirm chain ID is `1952`.
- [ ] Confirm wallet popups do not expose private keys or seed phrases.

## Local Frontend

- [ ] Run:

```bash
cd frontend
pnpm dev --hostname 127.0.0.1 --port 3000
```

- [ ] Open normal URL: `http://127.0.0.1:3000`
- [ ] Open admin URL: `http://127.0.0.1:3000?admin=1`
- [ ] Keep terminal tabs with `.env`, private key, shell history, or deployment secrets closed.

## Rehearsal

- [ ] Connect wallet.
- [ ] Claim xUSD from faucet.
- [ ] Claim BRA or another fan token if needed.
- [ ] Mint BRA Team Passport.
- [ ] Swap xUSD -> BRA.
- [ ] Add liquidity support to ARG.
- [ ] Trigger BRA GOAL_SHOCK from the admin panel using controller/owner wallet.
- [ ] Watch leaderboard update after swap/liquidity.
- [ ] Watch Event Log for hook/registry events.
- [ ] Show Contract Proof panel.

## Recording Quality

- [ ] Record at 1080p.
- [ ] Use browser zoom 100%.
- [ ] Hide bookmarks or tabs with private data.
- [ ] Keep only the repo, frontend, and wallet confirmation windows visible.
- [ ] Have the fallback narration ready if wallet or RPC confirmations are slow.
