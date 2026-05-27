---
phase-id: P05-01
plan: P05
revised-on: 2026-05-26
---

# P05-01 — Deploy Scripts

## Goal

Write Foundry scripts that deploy the full stack in a deterministic, replayable order. Use CREATE2 with salt mining for the Hook so its address satisfies v4's hook-flag requirements.

## Scope (In)

- `contracts/script/DeployTokens.s.sol`:
  - deploys `DemoQuoteToken` once.
  - deploys `DemoFanToken` four times with `(name, symbol)`:
    - `("Brazil Fan Token", "BRA")`
    - `("Argentina Fan Token", "ARG")`
    - `("France Fan Token", "FRA")`
    - `("Germany Fan Token", "GER")`
  - prints all addresses; writes to `deployments/<chain>/tokens.json`.
- `contracts/script/DeployCore.s.sol`:
  - deploys `XCupLeagueRegistry`.
  - deploys `TeamPassport`.
  - mines a CREATE2 salt for `XCupLiquidityLeagueHook` so the deployed address has bits `BEFORE_SWAP_FLAG | AFTER_SWAP_FLAG | AFTER_ADD_LIQUIDITY_FLAG` set in the low bytes. Use the `HookMiner.find` helper if available in v4-periphery test utils; otherwise write a minimal local salt-search loop in the script.
  - deploys the Hook via CREATE2 with that salt and the resolved constructor args.
  - calls `registry.registerTeam(teamId, name, symbol, token, "")` for each of the 4 teams (where `teamId = bytes32(uint256(uint160(token)))` is fine; or `keccak256(bytes(symbol))` — pick one and document).
  - writes addresses to `deployments/<chain>/core.json`.
- `contracts/script/utils/HookFlagsHelper.sol` (or similar): a tiny lib that exposes the three flag-bit constants the v4 install uses (read from `Hooks.sol`).
- All scripts are runnable via:
  ```
  forge script script/DeployTokens.s.sol --rpc-url $XLAYER_TESTNET_RPC --private-key $DEPLOYER_PRIVATE_KEY --broadcast
  ```
- Pre-flight: scripts must `forge script ... --rpc-url <anvil> --broadcast` successfully on a local anvil fork before any testnet attempt.

## Scope (Out)

- Actual testnet deployment (P05-03).
- Pool creation (P05-02).
- Verification logic (best-effort in P05-03).
- Multi-chain support — only X Layer testnet matters for MVP.

## Acceptance Criteria

- [ ] `forge script script/DeployTokens.s.sol --fork-url <local anvil>` succeeds; tokens.json written.
- [ ] `forge script script/DeployCore.s.sol --fork-url <local anvil>` succeeds; core.json written.
- [ ] Hook address bits match required flags (assertion inside the script).
- [ ] No hardcoded addresses; all values flow through env vars or prior JSON.
- [ ] `deployments/` directory committed with `.gitkeep`; actual JSONs added in P05-03.

## Risks / Pitfalls

- CREATE2 deployer address is needed for HookMiner. Foundry's default is `address(this)` inside `vm.broadcast` — make sure the salt search uses the same.
- v4 hook flags' exact bit constants vary by version. Use the `Hooks` library's named constants, not hard-coded bytes.
- Salt search can be slow on first run. Cache the salt + computed address into the script (commented out) for reuse during testing.
- `forge script` deploy ordering: tokens first, then core, then pools (P05-02). The script outputs are the inputs to the next script.

## Reference

- Brief: "Contracts", "Pools".
- PRD §12 "Deployment scripts".
