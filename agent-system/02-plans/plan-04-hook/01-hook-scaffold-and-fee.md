---
phase-id: P04-01
plan: P04
revised-on: 2026-05-26
---

# P04-01 — Hook Scaffold + beforeSwap Dynamic Fee

## Goal

Stand up `XCupLiquidityLeagueHook.sol` inheriting `BaseHook` from v4-periphery. Implement `getHookPermissions()`, the constructor wiring (PoolManager + Registry + Passport), and the `beforeSwap` callback that computes the dynamic LP fee and emits `DynamicFeeApplied`. Anti-wash and scoring come in later phases — leave clean integration points.

## Scope (In)

- `contracts/src/XCupLiquidityLeagueHook.sol`:
  - inherits `BaseHook`.
  - constructor:
    ```solidity
    constructor(
        IPoolManager _pm,
        XCupLeagueRegistry _registry,
        TeamPassport _passport,
        address _owner
    ) BaseHook(_pm) Ownable(_owner) {
        registry = _registry;
        passport = _passport;
    }
    ```
  - immutable references: `XCupLeagueRegistry public immutable registry; TeamPassport public immutable passport;`
  - `getHookPermissions()` returns: `beforeSwap: true, afterSwap: true, afterAddLiquidity: true`, every other flag false.
  - fee table:
    ```solidity
    mapping(MatchState => uint24) public feeForState;
    constructor: feeForState[PRE_MATCH]=30; feeForState[LIVE_NORMAL]=50; feeForState[GOAL_SHOCK]=150; feeForState[RED_CARD]=100; feeForState[PENALTY]=125; feeForState[FINAL_WHISTLE]=75;
    ```
  - constants:
    ```solidity
    uint24 public constant MIN_FEE_BPS = 25;
    uint24 public constant MAX_FEE_BPS = 200;
    uint24 public constant PASSPORT_DISCOUNT_BPS = 5;
    uint24 public constant WASH_PENALTY_BPS = 25;
    ```
  - struct `FeeBreakdown { uint24 baseFeeBps; uint24 discountBps; uint24 penaltyBps; uint24 finalFeeBps; }`
  - `_beforeSwap(address sender, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData) internal override returns (bytes4, BeforeSwapDelta, uint24)`:
    - if pool not registered → return `(BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0)` (no override, no scoring).
    - resolve `user` (helper `_resolveUser(sender, hookData)` — if `hookData.length >= 20`, decode address; else `sender`).
    - resolve `teamId`, `matchState`.
    - compute `baseFee = feeForState[matchState]`.
    - compute `discount = passport.isSupporter(user, teamId) ? PASSPORT_DISCOUNT_BPS : 0`.
    - **stub** `penalty = 0` (real anti-wash comes in P04-03).
    - `finalFee = clamp(baseFee - discount + penalty, MIN_FEE_BPS, MAX_FEE_BPS)`.
    - emit `DynamicFeeApplied(poolId, teamId, user, matchState, baseFee, discount, penalty, finalFee)`.
    - return `(BaseHook.beforeSwap.selector, ZERO_DELTA, uint24(finalFee) | LPFeeLibrary.OVERRIDE_FEE_FLAG)`. (Use whatever symbol the installed v4 version exposes — most likely `LPFeeLibrary.OVERRIDE_FEE_FLAG`. If unavailable, fall back to `uint24(finalFee | 0x400000)` and document the value.)
- `_afterSwap` and `_afterAddLiquidity` exist but immediately return their selectors with no-op deltas. (Implementation lands in P04-02.)
- event:
  ```solidity
  event DynamicFeeApplied(PoolId indexed poolId, bytes32 indexed teamId, address indexed user, MatchState state, uint24 baseFeeBps, uint24 discountBps, uint24 penaltyBps, uint24 finalFeeBps);
  ```
- owner-only setters: `setFeeForState(MatchState, uint24)`, `setFeeBounds(uint24 minBps, uint24 maxBps)` — for tunability without redeployment.

## Scope (Out)

- No scoring logic — P04-02.
- No anti-wash state machine — P04-03.
- No tests beyond a compile check — P04-04 is the dedicated test phase.
- No deployment or salt-mining — that's P05.

## Acceptance Criteria

- [ ] `forge build` clean.
- [ ] `getHookPermissions()` returns exactly the three flags above.
- [ ] `beforeSwap` for an unregistered pool returns `(selector, ZERO_DELTA, 0)` without reverting.
- [ ] `beforeSwap` for a registered pool emits `DynamicFeeApplied` with correct breakdown for a passport-holder.
- [ ] Returned fee value carries the override flag (bit 0x400000 set, or the equivalent constant from `LPFeeLibrary`).
- [ ] `_afterSwap` and `_afterAddLiquidity` exist as no-op stubs (callable, won't revert).
- [ ] At least one compile-time check test (`HookCompile.t.sol`) instantiates the contract in a Foundry test (constructor only).

## Risks / Pitfalls

- The exact API surface for `BaseHook` differs between v4-periphery versions. If the abstract `_beforeSwap` signature doesn't match the PRD, follow the installed version's signature and document the actual signature in the report.
- The override-fee flag's name and bit-position has shifted across v4 revisions; use `LPFeeLibrary.OVERRIDE_FEE_FLAG` if it exists. If not, hard-code `0x400000` and add a code comment.
- `_resolveUser` is intentionally trivial here; later phases may pass user via `hookData` for router scenarios.

## Reference

- Brief: "Hook Callbacks", "Match States & Fees", "Constants Cheatsheet".
- PRD §11 "Contract 5 — XCupLiquidityLeagueHook.sol" and "Hook callback logic — beforeSwap".
