---
phase-id: P05-02
plan: P05
revised-on: 2026-05-26
---

# P05-02 — Pools & Seed Liquidity

## Goal

Create the 4 Uniswap v4 pools (BRA/ARG/FRA/GER each paired with xUSD) with the dynamic-fee flag enabled and the Hook attached. Register every pool in the Registry. Seed initial liquidity so swaps work end-to-end during the demo.

## Scope (In)

- `contracts/script/CreatePools.s.sol`:
  - reads addresses from `deployments/<chain>/{tokens,core}.json`.
  - for each fan token, build a `PoolKey`:
    ```solidity
    PoolKey memory key = PoolKey({
        currency0: Currency.wrap(min(token0, token1)),
        currency1: Currency.wrap(max(token0, token1)),
        fee: LPFeeLibrary.DYNAMIC_FEE_FLAG,    // 0x800000 — pool fee is dynamic
        tickSpacing: 60,
        hooks: IHooks(address(hook))
    });
    ```
  - call `poolManager.initialize(key, SQRT_PRICE_1_1, "")` for each.
  - call `registry.registerPool(key.toId(), teamId, Currency.wrap(fanToken), Currency.wrap(xUSD))`.
  - writes `deployments/<chain>/pools.json` mapping `teamId → PoolId + key`.
- `contracts/script/SeedLiquidity.s.sol`:
  - mint `xUSD` and each fan token to the deployer (or use the faucet).
  - add a small full-range liquidity position per pool via the v4 periphery position manager (or direct PoolManager `modifyLiquidity` if periphery is too heavy). MVP target: ~$1000 worth of liquidity per side at SQRT_PRICE_1_1.
  - writes `deployments/<chain>/seed.json` capturing tx hashes and resulting liquidity.
- Local-only sanity: run all three scripts (`DeployTokens → DeployCore → CreatePools → SeedLiquidity`) on anvil end-to-end. Capture logs.

## Scope (Out)

- Mainnet deployment.
- Concentrated liquidity UI / ranged positions — full-range only for MVP.
- Position manager UX — scripts manage liquidity, not a UI.
- Cross-pool routing / aggregator.

## Acceptance Criteria

- [ ] All 4 pools initialize without revert on local anvil.
- [ ] All 4 pools registered in Registry (`isRegisteredPool` returns true).
- [ ] Seed liquidity tx succeeds for all 4 pools; balances reflect on-chain.
- [ ] `pools.json` written with PoolId per team.
- [ ] One swap on each pool succeeds after seeding (sanity check, can be a single `cast send` per pool).

## Risks / Pitfalls

- v4 `DYNAMIC_FEE_FLAG` value: it's `0x800000` historically. Confirm against the installed `LPFeeLibrary`.
- `Currency` ordering matters in v4 (`currency0 < currency1` by address). Sort before constructing `PoolKey`.
- Initial sqrt price `SQRT_PRICE_1_1` is `79228162514264337593543950336`. Hardcode it as a constant.
- `modifyLiquidity` is permissionless but requires settle-and-take dance through `PoolManager.unlock`. If periphery isn't available, use `lib/v4-core/src/test/PoolModifyLiquidityTest.sol`'s pattern (it's a test helper but useful for scripts too).

## Reference

- Brief: "Pools", "Hook Callbacks" (dynamic-fee flag context).
- PRD §10 FR2; §12 data flow diagrams.
