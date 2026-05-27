---
phase-id: P03-02
plan: P03
revised-on: 2026-05-26
---

# P03-02 — Registry Tests

## Goal

Foundry tests for `XCupLeagueRegistry`: full registration + match-state lifecycle, controller permissions, every revert path. Target ≥ 95% line coverage on the registry.

## Scope (In)

- `contracts/test/XCupLeagueRegistry.t.sol`:
  - happy-path team registration emits `TeamRegistered`.
  - duplicate team registration reverts with `TeamAlreadyRegistered`.
  - `bytes32(0)` team id reverts with `InvalidTeamId`.
  - zero token address reverts with `InvalidToken`.
  - pool registration before team exists reverts with `TeamNotRegistered`.
  - duplicate pool registration reverts with `PoolAlreadyRegistered`.
  - `getTeamByPool` returns correct teamId after registration.
  - `getTeamIds` returns insertion order across 3 sequential registrations.
  - `setMatchState` by controller emits `MatchStateUpdated`.
  - `setMatchState` by non-controller reverts with `NotController`.
  - `setController` by owner emits `ControllerUpdated` and updates effective permissions.
  - `setController` by non-owner reverts.
  - `getMatchStateByPool` returns the right state for the right team.
- Use `vm.expectRevert`, `vm.expectEmit`.
- `forge coverage --report summary` on `XCupLeagueRegistry.sol` ≥ 95%.

## Scope (Out)

- No integration tests with Hook (that's P04-04).
- No fuzz.

## Acceptance Criteria

- [ ] `forge test --match-contract XCupLeagueRegistryTest -vvv` all pass.
- [ ] Coverage row pasted in report.
- [ ] All revert paths tested.

## Risks / Pitfalls

- `PoolId.wrap(bytes32(uint256(1)))` for synthetic pool ids in tests is fine — Hook integration uses real PoolIds later.
- `Currency.wrap(address(0))` is a valid value (native ETH) — for test purposes use mock token addresses.

## Reference

- Brief: "Contracts".
- PRD §10 FR1, FR2, FR7.
