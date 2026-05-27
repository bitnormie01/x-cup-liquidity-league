---
phase-id: P01-02
plan: P01
revised-on: 2026-05-26
---

# P01-02 — Networks & Env Config

## Goal

Wire `foundry.toml` with X Layer testnet + mainnet endpoints, scaffold `.env.example`, document the deployer key strategy, and verify RPC connectivity from the workstation.

## Scope (In)

- Append to `contracts/foundry.toml`:
  ```toml
  [rpc_endpoints]
  xlayer_testnet = "${XLAYER_TESTNET_RPC}"
  xlayer_mainnet = "${XLAYER_MAINNET_RPC}"

  [etherscan]
  xlayer_testnet = { key = "${OKX_EXPLORER_API_KEY}", url = "https://www.okx.com/web3/explorer/xlayer-test/api", chain = 1952 }
  xlayer_mainnet = { key = "${OKX_EXPLORER_API_KEY}", url = "https://www.okx.com/web3/explorer/xlayer/api",      chain = 196  }
  ```
  (If OKX does not expose an Etherscan-compatible verifier, leave a `TODO` comment and continue — don't block on verification config.)
- Create `contracts/.env.example`:
  ```
  XLAYER_TESTNET_RPC=https://testrpc.xlayer.tech/terigon
  XLAYER_MAINNET_RPC=https://rpc.xlayer.tech
  DEPLOYER_PRIVATE_KEY=
  OKX_EXPLORER_API_KEY=
  ```
- Update root `README.md` with a "Networks" section listing chain IDs, RPC URLs, explorer URLs, and the `cp .env.example .env` instruction.
- Verify connectivity from the Executor's shell:
  ```bash
  cast chain-id --rpc-url $XLAYER_TESTNET_RPC
  ```
  Expected output: `1952`. Record the output verbatim in the report.

## Scope (Out)

- No actual deployment.
- No deployer wallet creation — the user manages keys; the Executor never generates one.
- No frontend env vars (those land in P06-01).

## Acceptance Criteria

- [ ] `contracts/foundry.toml` has both `[rpc_endpoints]` entries.
- [ ] `contracts/.env.example` committed; `.env` gitignored (verify with `git status` after touching `.env`).
- [ ] `cast chain-id --rpc-url $XLAYER_TESTNET_RPC` returns `1952` (paste in report).
- [ ] README has a "Networks" section.

## Risks / Pitfalls

- OKX testnet RPC sometimes returns 502. Retry; if persistently failing, fall back to `https://xlayertestrpc.okx.com/terigon` and note the swap in the report.
- Etherscan verification config may differ from OKX — do NOT block this phase on getting verification working. That's a P05 problem.

## Reference

- Brief: "Network Info".
- PRD §12 "Network architecture".
