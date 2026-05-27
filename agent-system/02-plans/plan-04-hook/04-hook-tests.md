---
phase-id: P04-04
plan: P04
revised-on: 2026-05-26
---

# P04-04 — Hook Full Test Suite

## Goal

Comprehensive Foundry tests for `XCupLiquidityLeagueHook`. Use v4-core test fixtures (`Deployers.sol`, `PoolManager`, mock tokens) for integration, plus targeted unit tests for fee / scoring / anti-wash math. Verify the hook integrates correctly with `XCupLeagueRegistry` and `TeamPassport`.

## Scope (In)

- `contracts/test/Hook.beforeSwap.t.sol`:
  - fee for each `MatchState` matches the table.
  - supporter passport reduces fee by 5 bps.
  - flagged user loses discount (per brief).
  - `MIN_FEE_BPS` and `MAX_FEE_BPS` clamps respected.
  - emits `DynamicFeeApplied` with correct breakdown.
- `contracts/test/Hook.afterSwap.t.sol`:
  - swap on registered pool awards correct `swapPoints`.
  - loyalty multiplier applied when user holds matching passport.
  - unregistered pool: no state change, no event.
  - `TeamPointsAwarded` event signature stable.
- `contracts/test/Hook.afterAddLiquidity.t.sol`:
  - positive `liquidityDelta` awards LP points × 1.5.
  - negative or zero delta: no points awarded.
  - `TeamPointsAwarded(... PointSource.LIQUIDITY ...)` emitted.
- `contracts/test/Hook.antiWash.t.sol`:
  - cooldown: two swaps within 60s → second flagged, points = 0.
  - reversal: swap, then opposite direction within 180s → flagged REVERSAL.
  - burst: 6 swaps in 10 min → 6th flagged BURST.
  - swap still executes when flagged.
  - `WashPenaltyApplied` fires only when flagged.
- `contracts/test/Hook.integration.t.sol`:
  - Use `Deployers` from v4-core test utils to spin up a PoolManager.
  - Deploy Registry, Passport, Hook (CREATE2 with mined salt OR use the v4 test-fixture pattern `deployCodeTo`).
  - Initialize one pool with the Hook attached and the dynamic-fee flag.
  - Mint passport, swap, add liquidity, change match state, swap again — assert end-to-end state.
- `forge coverage --report summary` on `XCupLiquidityLeagueHook.sol` ≥ 85%.

## Scope (Out)

- Treasury contract tests (optional contract; not built yet).
- Mainnet fork tests.
- Gas optimization passes.

## Acceptance Criteria

- [ ] `forge test --match-path 'test/Hook*.t.sol' -vvv` all pass.
- [ ] Coverage ≥ 85% on the Hook (paste row in report).
- [ ] Integration test exercises the full demo path on a local PoolManager.

## Risks / Pitfalls

- v4-core test fixtures change frequently. If `Deployers.sol` has shifted shape, fall back to a minimal manual setup and document why.
- Hook address flag requirements: in tests, `deployCodeTo(<hookCode>, address(<addressWithCorrectFlags>))` is the cleanest path. Foundry's `vm.etch` works as a fallback.
- If integration tests are too time-consuming to stabilize, ship them last and mark with `vm.skip(true)` ONLY with a `// re-enable in P05-03` comment + call-out in report.

## Reference

- Brief: full document (this is the most cross-cutting phase).
- PRD §11 Contract 5 (entire section), §10 FR4-FR9.
