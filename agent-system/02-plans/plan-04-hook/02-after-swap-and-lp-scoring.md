---
phase-id: P04-02
plan: P04
revised-on: 2026-05-26
---

# P04-02 — afterSwap + afterAddLiquidity Scoring

## Goal

Implement `_afterSwap` (volume-based team support points) and `_afterAddLiquidity` (LP support points × 1.5 weight). Wire the team and per-user score storage. Emit `TeamPointsAwarded` from both.

## Scope (In)

- Extend `contracts/src/XCupLiquidityLeagueHook.sol`:
  - enums:
    ```solidity
    enum PointSource { SWAP, LIQUIDITY, BONUS, PENALTY }
    ```
  - structs:
    ```solidity
    struct TeamScore { uint256 swapPoints; uint256 lpPoints; uint256 totalPoints; uint64 lastUpdatedAt; }
    struct UserContribution { uint256 swapPoints; uint256 lpPoints; uint256 totalPoints; uint64 lastActionAt; }
    ```
  - storage:
    ```solidity
    mapping(bytes32 => TeamScore) public scores;
    mapping(address => mapping(bytes32 => UserContribution)) public contributions;
    ```
  - constants:
    ```solidity
    uint256 public constant POINT_UNIT = 1e18;
    uint256 public constant LP_POINT_UNIT = 1e18;
    uint256 public constant LP_WEIGHT_BPS = 15000;
    uint256 public constant LOYALTY_MULTIPLIER_BPS = 12000;
    uint256 public constant DEFAULT_MULTIPLIER_BPS = 10000;
    ```
  - `_afterSwap`:
    - registered-pool guard (no-op for unregistered).
    - resolve `user`, `teamId`.
    - `uint256 normalizedVolume = _normalizeSwapVolume(key, params, delta);` — MVP version: take `uint256(int256(params.amountSpecified < 0 ? -params.amountSpecified : params.amountSpecified))`. Document the simplification in NatSpec.
    - `uint256 loyaltyMult = passport.isSupporter(user, teamId) ? LOYALTY_MULTIPLIER_BPS : DEFAULT_MULTIPLIER_BPS;`
    - `uint256 washMult = DEFAULT_MULTIPLIER_BPS;` (anti-wash overrides this in P04-03).
    - `uint256 points = normalizedVolume * loyaltyMult / 10_000 * washMult / 10_000 / POINT_UNIT;`
    - update `scores[teamId]` and `contributions[user][teamId]`; set `lastUpdatedAt`/`lastActionAt`.
    - emit `TeamPointsAwarded(poolId, teamId, user, PointSource.SWAP, normalizedVolume, loyaltyMult, points)`.
    - return `(BaseHook.afterSwap.selector, 0)`.
  - `_afterAddLiquidity`:
    - registered-pool guard.
    - skip if `params.liquidityDelta <= 0` (only positive additions count).
    - resolve `user`, `teamId`.
    - `uint256 normalizedLiquidity = uint256(int256(params.liquidityDelta));` (MVP normalization; document).
    - `uint256 points = normalizedLiquidity * LP_WEIGHT_BPS / 10_000 / LP_POINT_UNIT;`
    - update `scores[teamId].lpPoints` and `totalPoints`; update `contributions[user][teamId].lpPoints` and `totalPoints`.
    - emit `TeamPointsAwarded(poolId, teamId, user, PointSource.LIQUIDITY, normalizedLiquidity, LP_WEIGHT_BPS, points)`.
    - return `(BaseHook.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA)`.
- event:
  ```solidity
  event TeamPointsAwarded(PoolId indexed poolId, bytes32 indexed teamId, address indexed user, PointSource source, uint256 rawAmount, uint256 multiplierBps, uint256 points);
  ```
- read helpers:
  ```solidity
  function getTeamScore(bytes32 teamId) external view returns (TeamScore memory);
  function getUserContribution(address user, bytes32 teamId) external view returns (UserContribution memory);
  ```

## Scope (Out)

- Anti-wash logic — P04-03 (the `washMult = DEFAULT_MULTIPLIER_BPS` line stays as a stub; do not gate scoring on real flagging yet).
- Quote-currency-only normalization — MVP uses absolute amount; quote-aware normalization is a future improvement (note in NatSpec).
- Treasury accrual — optional, not this phase.

## Acceptance Criteria

- [ ] `forge build` clean.
- [ ] `_afterSwap` updates `scores[teamId].swapPoints` and `totalPoints` for a registered pool.
- [ ] `_afterAddLiquidity` updates `scores[teamId].lpPoints` (weighted 1.5×) and `totalPoints`.
- [ ] Both emit `TeamPointsAwarded` with the documented `PointSource`.
- [ ] Unregistered pool calls return cleanly with no state change.
- [ ] `getTeamScore` and `getUserContribution` return populated structs after activity.

## Risks / Pitfalls

- `liquidityDelta` is an `int128` (or `int256` in some v4 versions) — cast carefully and check sign.
- The points math uses sequential `*` and `/`; order matters to avoid truncation. Multiply before divide.
- `BalanceDeltaLibrary.ZERO_DELTA` may live under a different path in your installed v4 version — adjust the import.

## Reference

- Brief: "Scoring Formulas", "Constants Cheatsheet".
- PRD §10 FR4, FR5; §11 Hook callbacks `afterSwap` and `afterAddLiquidity`.
