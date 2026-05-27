---
phase-id: P05-03
plan: P05
revised-on: 2026-05-26
---

# P05-03 — Testnet Deploy + Verify

## Goal

Execute the full deploy on X Layer testnet (chain 1952). Capture every address. Attempt explorer verification (best-effort). Populate `deployments/xlayer-testnet/*.json` for the frontend to consume.

## Scope (In)

- Confirm `.env` is populated locally (do NOT commit it).
- Run, in order:
  ```
  forge script script/DeployTokens.s.sol --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
  forge script script/DeployCore.s.sol   --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
  forge script script/CreatePools.s.sol  --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
  forge script script/SeedLiquidity.s.sol --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
  ```
- Capture every address to `deployments/xlayer-testnet/{tokens,core,pools,seed}.json`. Commit these JSON files.
- Best-effort verification:
  ```
  forge verify-contract <addr> contracts/src/DemoFanToken.sol:DemoFanToken --chain 1952 --etherscan-api-key $OKX_EXPLORER_API_KEY
  ```
  If OKX explorer's verifier doesn't accept the Etherscan format, document the failure in the report — don't block.
- Update root `README.md`:
  - "Deployed Addresses" table populated for X Layer testnet.
  - Explorer link per contract.
- Run a manual smoke test: `cast call <hook> "getTeamScore(bytes32)" <braTeamId> --rpc-url xlayer_testnet` returns the zero struct.

## Scope (Out)

- Mainnet deploy (mark as `optional` in the report; only do if there's > 6 hours buffer before submission).
- Subgraph or indexer setup.
- Public faucet hosting.

## Acceptance Criteria

- [ ] All 4 deploy scripts succeed against X Layer testnet.
- [ ] `deployments/xlayer-testnet/*.json` committed.
- [ ] README "Deployed Addresses" filled.
- [ ] `cast chain-id --rpc-url xlayer_testnet` returns `1952` (re-confirm).
- [ ] At least one smoke `cast call` per contract succeeds and is recorded in the report.

## Risks / Pitfalls

- Testnet faucet / gas: ensure deployer wallet has enough OKB testnet before starting. If empty, request from the user — don't try to mine or auto-fund.
- Verification may simply not work on OKX explorer; if so, attach the source as a Gist link in the README and note it. Do NOT block submission.
- A failed mid-deploy leaves orphan contracts. If `DeployCore` fails, re-run `DeployTokens` is unnecessary but `DeployCore` should be re-run from clean — adjust scripts to short-circuit on already-deployed checks if needed (best practice but not blocking).

## Reference

- Brief: "Network Info", "Submission Requirements".
- PRD §12 "Network architecture".
