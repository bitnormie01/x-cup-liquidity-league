---
phase-id: P02-03
plan: P02
revised-on: 2026-05-26
---

# P02-03 — Token Tests

## Goal

Foundry tests for `DemoFanToken`, `DemoQuoteToken`, and `TeamPassport`. Cover happy path + every revert path. Target ≥ 95% line coverage on these three files.

## Scope (In)

- `contracts/test/DemoFanToken.t.sol`:
  - constructor sets `name`/`symbol`/owner.
  - `mint` happy path.
  - `mint` reverts when called by non-owner.
  - `faucetMint` mints `FAUCET_AMOUNT` on first call.
  - `faucetMint` reverts with `FaucetCooldown` inside cooldown.
  - `faucetMint` succeeds after `vm.warp(block.timestamp + FAUCET_COOLDOWN + 1)`.
- `contracts/test/DemoQuoteToken.t.sol`:
  - symbol equals `"xUSD"`.
  - mirror the DemoFanToken test cases (these are nearly identical contracts).
- `contracts/test/TeamPassport.t.sol`:
  - mint happy path increments `teamFanCount`.
  - mint with `bytes32(0)` reverts.
  - double-mint by same wallet reverts.
  - `transferFrom` reverts with `Soulbound`.
  - `safeTransferFrom` (both overloads) reverts with `Soulbound`.
  - `isSupporter` returns true for the correct team, false otherwise.
  - `teamOf` returns `bytes32(0)` for non-holders.
- All tests use `forge-std/Test.sol`. No mocks needed (these contracts are leaf-level).
- Run `forge coverage --report summary` and paste the row for each contract in the report.

## Scope (Out)

- No fuzz tests yet (MVP can skip; add only if time).
- No integration tests with the registry/hook (those land in P03-02 and P04-04).

## Acceptance Criteria

- [ ] `forge test --match-contract '(DemoFanToken|DemoQuoteToken|TeamPassport)Test' -vvv` all pass.
- [ ] Per-file coverage ≥ 95% (paste `forge coverage --report summary` in report).
- [ ] No `vm.skip(true)` without a comment referencing a future phase.

## Risks / Pitfalls

- `forge coverage` is slow on first run; budget extra time.
- OZ v5 default `tokenURI` may revert for unknown token IDs — that's fine, don't test against it.

## Reference

- Brief: "Contracts" table.
- PRD §10 FR3.
