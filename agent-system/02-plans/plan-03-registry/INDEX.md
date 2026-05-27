# Plan 03 — Registry

Build `XCupLeagueRegistry.sol`: the shared config that maps teams ↔ pools and holds per-team match state. The Hook reads from this on every callback.

## Phases

| ID | File | Goal |
|---|---|---|
| P03-01 | `01-registry-implementation.md` | Full `XCupLeagueRegistry.sol` (data, events, registration, match-state, read functions). |
| P03-02 | `02-registry-tests.md` | Foundry tests for all registration paths, controller permissions, and match-state transitions. |

## Exit Criteria

- `forge build` green.
- Registry compiles standalone (no Hook dependency yet — Hook is P04).
- Tests cover: team registration, pool registration, controller transitions, match-state updates, every revert path.
- `MatchState` enum order matches the brief.
