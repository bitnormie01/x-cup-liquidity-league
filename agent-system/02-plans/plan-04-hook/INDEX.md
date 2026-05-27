# Plan 04 — Hook (the core product)

This is the actual product. `XCupLiquidityLeagueHook.sol` is the Uniswap v4 Hook that:
1. Computes dynamic fee per swap (`beforeSwap`).
2. Awards swap support points (`afterSwap`).
3. Awards LP support points (`afterAddLiquidity`).
4. Penalizes wash trading (anti-wash logic touches all three).

## Phases

| ID | File | Goal |
|---|---|---|
| P04-01 | `01-hook-scaffold-and-fee.md` | Hook contract scaffold, `getHookPermissions()`, `beforeSwap` dynamic fee + `DynamicFeeApplied` event. |
| P04-02 | `02-after-swap-and-lp-scoring.md` | `afterSwap` swap-volume scoring + `afterAddLiquidity` LP scoring + `TeamPointsAwarded` events. |
| P04-03 | `03-anti-wash.md` | Anti-wash detection (cooldown / reversal / burst) + `WashPenaltyApplied` event + multiplier integration. |
| P04-04 | `04-hook-tests.md` | Full Foundry test suite using v4-core test fixtures; integration with Registry + Passport. |

## Exit Criteria

- `forge build` green.
- All four hook callbacks behave per Brief "Hook Callbacks" + PRD §11 Contract 5.
- Tests cover: fee computation per match state, supporter discount, wash penalty, swap points, LP points, unregistered pool no-op.
- Hook address satisfies the v4 hook-address flag requirements (correct prefix bits) — if it doesn't on first deploy attempt, P05 will use `HookMiner` to find a salt.

## Hand-off note for Plan 05

When Plan 04 finishes, the Hook's `address` flag bits matter for v4 pool creation. P05-02 must mine a CREATE2 salt that produces an address with `BEFORE_SWAP_FLAG | AFTER_SWAP_FLAG | AFTER_ADD_LIQUIDITY_FLAG`. Note this in the P04-04 report.
