# Contract Proof Hardening Report

## Summary

Completed an ad-hoc submission hardening pass focused on deployed-contract proof and judge confidence.

This pass did not change production contracts. It added a root-level `CONTRACT_PROOF.md`, corrected stale demo/media instructions around the disabled Add Support path, and updated Foundry verifier configuration to the OKLink Foundry endpoint.

## On-chain Verification

Fresh X Layer testnet RPC checks were run against `https://testrpc.xlayer.tech/terigon`.

```text
cast chain-id --rpc-url https://testrpc.xlayer.tech/terigon
1952
```

All tracked deployment addresses returned non-empty runtime bytecode:

```text
xUSD code_bytes=2451
BRA code_bytes=2451
ARG code_bytes=2451
FRA code_bytes=2451
GER code_bytes=2451
PoolManager code_bytes=19766
Registry code_bytes=5108
TeamPassport code_bytes=5045
Hook code_bytes=9340
LiquiditySeeder/V4PoolActionHelper code_bytes=5284
HookCreate2Deployer code_bytes=10443
```

Live reads confirmed:

- ERC-20 symbols, decimals, and owner for xUSD/BRA/ARG/FRA/GER.
- TeamPassport name/symbol/owner and `nextTokenId() == 1`.
- Registry owner/controller, four team IDs, and all four pool IDs registered.
- Hook wiring to PoolManager, Registry, and TeamPassport.
- Hook active fee table: `30, 50, 150, 100, 125, 75` bps.
- BRA score read: `(swapPoints=1, lpPoints=1500, totalPoints=1501, lastUpdatedAt=1779954762)`.
- Helper `manager()` points to the deployed project-owned PoolManager.

## Documentation Changes

- Added `CONTRACT_PROOF.md` with:
  - X Layer testnet network details.
  - OKLink links for every deployed address.
  - Runtime byte counts.
  - Live read proof.
  - Pool IDs.
  - Source-verification status.
  - OKLink Foundry verification commands and constructor args.
- Updated `README.md` to link the proof packet and clarify OKLink source-code publication status.
- Updated `DEMO.md`, `submission/video-script.md`, and `submission/recording-checklist.md` so judges are not instructed to click the disabled browser Add Support path.
- Updated `SUBMISSION.md` to point final form notes at `CONTRACT_PROOF.md`.
- Updated `contracts/foundry.toml` and `contracts/.env.example` from the old OKX explorer placeholder to the OKLink verification plugin URL.

## Validation

```text
forge fmt --check
PASS

forge build
PASS

forge test -vvv
PASS: 61 passed, 0 failed, 0 skipped
```

`forge build` still emits the existing demo faucet `block.timestamp` warnings.

## Source Verification Status

OKLink source publication was completed with Foundry using `--verifier oklink`, `--watch`, and the X Layer testnet OKLink plugin URL. The X Layer docs path did not require an API key.

Verified contracts:

- xUSD: `Pass - Verified`
- BRA: `Pass - Verified`
- ARG: `Pass - Verified`
- FRA: `Pass - Verified`
- GER: `Pass - Verified`
- PoolManager: `Pass - Verified`
- XCupLeagueRegistry: `Pass - Verified`
- TeamPassport: `Pass - Verified`
- XCupLiquidityLeagueHook: `Pass - Verified`
- V4PoolActionHelper: `Pass - Verified`
- HookCreate2Deployer: `Pass - Verified`

Official references used:

- OKLink API docs: `https://www.oklink.com/docs/en/`
- X Layer Foundry verification docs: `https://web3.okx.com/xlayer/docs/developer/verify-a-smart-contract/verify-with-foundry`
- OKLink X Layer Testnet verifier: `https://www.oklink.com/x-layer-testnet/verify-contract-preliminary`

## Caveats

- This remains an X Layer testnet deployment.
- The PoolManager is project-owned and disclosed.
- Browser Add Support is disabled for final-submission honesty; seeded LP proof is documented instead.
- Local `deployments/31337/` remains untracked and was not staged.
