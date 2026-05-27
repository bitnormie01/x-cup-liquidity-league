---
phase-id: P03-01
plan: P03
revised-on: 2026-05-27
---

# P03-01 — XCupLeagueRegistry Implementation

## Goal

Implement `XCupLeagueRegistry.sol`: the shared metadata store mapping teams ↔ pools and holding per-team match state. No Hook references — the Hook will read this in P04.

## Scope (In)

- `contracts/src/XCupLeagueRegistry.sol`:
  - imports: v4 `PoolId` and `Currency`, plus OZ `Ownable`. Use the import path that matches the repository's current remapping. With `@uniswap/v4-core/` already remapped to `contracts/lib/v4-core/src/`, the expected paths are `@uniswap/v4-core/types/PoolId.sol` and `@uniswap/v4-core/types/Currency.sol`.
  - enum:
    ```solidity
    enum MatchState { PRE_MATCH, LIVE_NORMAL, GOAL_SHOCK, RED_CARD, PENALTY, FINAL_WHISTLE }
    ```
  - structs `Team`, `PoolConfig`, `MatchStateData` per PRD §11 Contract 4.
  - storage:
    - `mapping(bytes32 => Team) public teams;`
    - `mapping(PoolId => PoolConfig) public poolConfig;`
    - `mapping(bytes32 => MatchStateData) public matchStateOfTeam;`
    - `bytes32[] public teamIds;`
    - `address public controller;`
  - functions (all per PRD §11):
    - `registerTeam(bytes32 teamId, string name, string symbol, address token, string metadataURI) onlyOwner`
    - `registerPool(PoolId poolId, bytes32 teamId, Currency fanToken, Currency quoteToken) onlyOwner`
    - `setMatchState(bytes32 teamId, MatchState state, string reason) onlyController`
    - `setController(address newController) onlyOwner`
    - `getTeamIds() view returns (bytes32[] memory)`
    - `getTeamByPool(PoolId poolId) view returns (bytes32 teamId)`
    - `getMatchStateByPool(PoolId poolId) view returns (MatchState)`
    - `isRegisteredPool(PoolId poolId) view returns (bool)`
  - events (per PRD §11): `TeamRegistered`, `PoolRegistered`, `MatchStateUpdated`, `ControllerUpdated`.
  - custom errors for every revert path: `TeamAlreadyRegistered`, `TeamNotRegistered`, `PoolAlreadyRegistered`, `InvalidTeamId`, `InvalidToken`, `NotController`, etc.
  - validation (per PRD §11):
    - `teamId != bytes32(0)`.
    - team must exist before pool registration for it.
    - token addresses cannot be zero.
    - pool cannot be re-registered.
    - match-state updates only by controller (initially owner; settable later).
- modifier `onlyController()` that checks `msg.sender == controller || msg.sender == owner()`.
- `setController` constructor default: set `controller = msg.sender` in constructor body so initial owner can act as controller until rotated.

## Scope (Out)

- No Hook integration. The Hook will import this in P04.
- No scoring data (that lives in the Hook).
- No frontend reads (P06).
- No rate-limiting on `setMatchState` (PRD calls it out as "recommended" but skip for MVP and note in report).

## Acceptance Criteria

- [ ] `forge build` clean.
- [ ] `registerPool` reverts with `TeamNotRegistered` if team unknown.
- [ ] `registerTeam` reverts on duplicate.
- [ ] `setMatchState` reverts when called by a non-controller, non-owner.
- [ ] `getTeamIds()` returns insertion-ordered list.
- [ ] Every revert uses a custom error.

## Risks / Pitfalls

- `PoolId` is a `bytes32`-like user-defined type in v4-core; use it directly — don't convert to `bytes32`.
- `Currency` is also a UDVT in v4-core (`Currency.wrap(address)`).
- `setController` is dangerous; do NOT add a renounce path in MVP.

## Reference

- Brief: "Contracts" table; "Match States & Fees".
- PRD §10 FR1, FR2, FR7; §11 "Contract 4 — XCupLeagueRegistry.sol".
