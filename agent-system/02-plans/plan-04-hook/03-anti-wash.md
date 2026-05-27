---
phase-id: P04-03
plan: P04
revised-on: 2026-05-26
---

# P04-03 — Anti-Wash Logic

## Goal

Add the anti-wash state machine to the Hook: detect cooldown/reversal/burst violations, set `washMult = 0` for flagged swaps, optionally add `+25 bps` fee penalty in `beforeSwap`, and emit `WashPenaltyApplied` from `afterSwap`.

## Scope (In)

- Extend `XCupLiquidityLeagueHook.sol`:
  - enum:
    ```solidity
    enum WashReason { NONE, COOLDOWN, REVERSAL, BURST, LOW_VALUE_SPAM }
    ```
  - struct:
    ```solidity
    struct UserPoolActivity {
        uint64 lastSwapAt;
        uint64 windowStartAt;
        uint32 swapsInWindow;
        bool lastZeroForOne;
        uint256 lastAmountAbs;
    }
    struct AntiWashStatus { bool isFlagged; WashReason reason; uint24 penaltyBps; uint16 pointsMultiplierBps; }
    ```
  - storage:
    ```solidity
    mapping(address => mapping(PoolId => UserPoolActivity)) public userPoolActivity;
    uint64 public constant ANTI_WASH_COOLDOWN_SEC      = 60;
    uint64 public constant ANTI_WASH_REVERSAL_SEC      = 180;
    uint64 public constant ANTI_WASH_BURST_WINDOW_SEC  = 600;
    uint32 public constant ANTI_WASH_BURST_MAX_SWAPS   = 5;
    ```
  - `_previewAntiWash(address user, PoolId poolId, IPoolManager.SwapParams calldata params) internal view returns (AntiWashStatus memory)`:
    - read `UserPoolActivity` (do NOT mutate).
    - if `block.timestamp - lastSwapAt < ANTI_WASH_COOLDOWN_SEC` → `COOLDOWN`, multiplier 0, penalty `WASH_PENALTY_BPS`.
    - else if `block.timestamp - lastSwapAt < ANTI_WASH_REVERSAL_SEC && params.zeroForOne != lastZeroForOne` → `REVERSAL`.
    - else if `swapsInWindow + 1 > ANTI_WASH_BURST_MAX_SWAPS && block.timestamp - windowStartAt < ANTI_WASH_BURST_WINDOW_SEC` → `BURST`.
    - else → `NONE`, multiplier `10000`, penalty `0`.
  - `_updateAntiWashState(address user, PoolId poolId, IPoolManager.SwapParams calldata params) internal returns (AntiWashStatus memory)`:
    - compute via `_previewAntiWash`.
    - mutate: roll the window (`if block.timestamp - windowStartAt >= ANTI_WASH_BURST_WINDOW_SEC: reset windowStartAt and swapsInWindow=1` else `swapsInWindow += 1`), set `lastSwapAt = block.timestamp`, set `lastZeroForOne = params.zeroForOne`, set `lastAmountAbs = absVal`.
  - integrate into `_beforeSwap`: replace the `penalty = 0` stub with `penalty = preview.penaltyBps;` and replace `discount = ...` with discount only if `!preview.isFlagged` (flagged users lose discount per brief).
  - integrate into `_afterSwap`: replace `washMult = DEFAULT_MULTIPLIER_BPS;` with `washMult = status.pointsMultiplierBps;` where `status = _updateAntiWashState(...)`.
  - after the existing `TeamPointsAwarded` emit, if `status.isFlagged`, emit:
    ```solidity
    emit WashPenaltyApplied(poolId, teamId, user, status.reason, status.penaltyBps, block.timestamp);
    ```
- event:
  ```solidity
  event WashPenaltyApplied(PoolId indexed poolId, bytes32 indexed teamId, address indexed user, WashReason reason, uint24 feePenaltyBps, uint256 timestamp);
  ```
- public read:
  ```solidity
  function previewAntiWash(address user, PoolId poolId, IPoolManager.SwapParams calldata params) external view returns (AntiWashStatus memory);
  ```
  (For the frontend's anti-wash status panel.)

## Scope (Out)

- `LOW_VALUE_SPAM` detection — leave the enum value but do not implement detection. (Note in report.)
- Hard revert on flagged swaps — the brief says swap still executes; only points/fees are adjusted.
- Sybil resistance beyond per-address checks — out of scope (acknowledged in PRD §6 Non-goals).

## Acceptance Criteria

- [ ] `forge build` clean.
- [ ] Two consecutive swaps within 60s in the same pool: second one flagged `COOLDOWN`, points = 0, fee penalty applied.
- [ ] Swap, then reverse swap within 180s: second one flagged `REVERSAL`.
- [ ] 6 swaps in same pool within 10 min: 6th flagged `BURST`.
- [ ] Flagged swap still executes (no revert).
- [ ] `previewAntiWash` view does not mutate state.
- [ ] `WashPenaltyApplied` event fires on flagged swaps only.

## Risks / Pitfalls

- `_previewAntiWash` MUST be `view`; do not call it inside `_updateAntiWashState` and rely on its return — duplicate the computation inline to avoid stale-state issues. Simpler: factor out a pure helper `_computeStatus(activity, now, params)`.
- Window-rolling math is easy to get wrong off-by-one. Reset window on entry if expired; increment after reset.
- Time-based bugs: in tests, always `vm.warp` explicitly; never rely on real time.

## Reference

- Brief: "Anti-Wash Rules", "Match States & Fees" (penalty integration).
- PRD §10 FR8, §11 Hook storage + events.
