# D26 Frontend Refactor Plan

## 1. Current UX Problem Summary

The frontend works as a technical dashboard but is confusing for normal users: proof/address details appear too early, explorer copy points to broken OKX Explorer context, team icons rely on emoji flags, approval success states are ambiguous, and Add Support can lead to a broken wallet simulation path.

## 2. Target Normal-User Information Architecture

Make the app feel like a playable demo: explain the game first, then guide the user through tokens, team choice, support actions, live standings, live activity, admin-only controls, and finally technical proof.

## 3. Homepage Section Order

1. Hero / Start Here
2. Step 1 — Get Demo Tokens
3. Step 2 — Pick Your Team
4. Step 3 — Support Your Team
5. Live League
6. Live Activity
7. Admin Demo Controls
8. Proof / Technical Details

## 4. OKLink Explorer Migration Plan

Replace frontend explorer branding with OKLink. Verified URL patterns:

- Address: `https://www.oklink.com/x-layer-testnet/address/<address>` — HTTP 200 for xUSD.
- Transaction: `https://www.oklink.com/x-layer-testnet/tx/<txHash>` — HTTP 200 for the P05-03 smoke transaction.
- Rejected: `https://www.oklink.com/x-layer-test/...` — HTTP 404.

Update `frontend/lib/chains.ts` and all frontend links/copy that use the explorer base.

## 5. Team Flag/Logo Plan

Replace emoji-only flags with CSS team badges that use country-code text and team/country color cues. Do not add external images or licensed assets. Use the same badge helper in selectors, leaderboard rows, cards, swap, and passport flows.

## 6. Approve -> Action Transaction-State Plan

Use separate transaction phase state for approvals and actions. After approval receipt, refetch allowance and show "Approval confirmed. Preparing action..." until allowance is sufficient. Once sufficient, button label changes to `Swap` or, if support remains disabled, no transaction action appears.

## 7. Add Support Fix/Disable Plan

Do not leave a broken Add Support button. Convert the browser liquidity panel into an honest disabled demo-proof panel for this build, explaining that seeded LP support already proves the hook path and that browser LP support is disabled until wallet simulation is validated.

## 8. Files Expected To Change

- `frontend/app/page.tsx`
- `frontend/app/globals.css`
- `frontend/lib/chains.ts`
- `frontend/lib/teams.ts`
- `frontend/components/TeamSelector.tsx` (shared CSS team badge helper)
- `frontend/components/TeamCard.tsx`
- `frontend/components/Leaderboard.tsx`
- `frontend/components/FaucetPanel.tsx`
- `frontend/components/PassportCard.tsx`
- `frontend/components/SwapPanel.tsx`
- `frontend/components/LiquidityPanel.tsx`
- `frontend/components/EventLog.tsx`
- `frontend/components/ContractProofPanel.tsx`
- D26 report/state/log files
