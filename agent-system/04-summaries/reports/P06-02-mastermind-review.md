# Mastermind Review — P06-02

Reviewed by: `mastermind-chatgpt`  
Reviewed at: 2026-05-28T09:35Z  
Verdict: CHANGES REQUIRED — fix hook contribution read before advancing to P06-03.

## Review Basis

Manual review of the P06-02 implementation commit, frontend faucet/passport components, ABIs, team constants, report/state updates, and recorded build/dev validation. I did not manually execute wallet writes in MetaMask.

## Accepted Work

- Faucet panel exists and lists xUSD plus all four fan tokens.
- Faucet reads/writes are structured with wagmi hooks and receipt/refetch flow.
- Cooldown and balance display are implemented.
- Team selector exists and uses the expected four teams.
- Passport card handles disconnected, wrong-network, unminted, pending, and minted UI states.
- Minimal ABIs were added under `frontend/lib/abis/`.
- Page integration and screenshot/report validation were completed.

## Blocking Finding

`frontend/components/PassportCard.tsx` reads user contribution data using `getUserContribution`, and `frontend/lib/abis/xcup-hook.ts` declares a `getUserContribution(address,bytes32)` function.

The deployed contract does not expose `getUserContribution`. `XCupLiquidityLeagueHook` exposes the public mapping getter:

```solidity
contributions(address user, bytes32 teamId) returns (uint256 swapPoints, uint256 lpPoints, uint256 totalPoints, uint64 lastActionAt)
```

Because of this mismatch, the minted passport card contribution read will fail at runtime even though `pnpm build` passes.

## Required Fix

- Change `frontend/lib/abis/xcup-hook.ts` to declare `contributions`, not `getUserContribution`.
- Change `PassportCard.tsx` to call `functionName: 'contributions'`.
- Confirm tuple normalization still handles the returned data shape.
- Run `cd frontend && pnpm build`.
- Run dev server if practical.
- Update report/state with a P06-02 fix report.

## Decision

Do not proceed to P06-03 yet. Issue D18 as a narrow P06-02 revision/fix directive.
