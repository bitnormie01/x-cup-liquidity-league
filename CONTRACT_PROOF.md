# Contract Proof

Last checked: 2026-05-30 04:18 UTC

This file is the judge-facing contract proof packet for X Cup Liquidity League. It combines the committed deployment manifests, fresh X Layer testnet RPC reads, OKLink links, and completed OKLink source verification.

## Network

| Field | Value |
|---|---|
| Network | X Layer Testnet |
| Chain ID | `1952` |
| RPC used for checks | `https://testrpc.xlayer.tech/terigon` |
| Explorer base | `https://www.oklink.com/x-layer-testnet` |
| Deployment manifests | `deployments/xlayer-testnet/*.json` and `deployments/1952/*.json` |
| PoolManager mode | Project-owned testnet PoolManager |

## Deployed Runtime Code

All addresses below returned non-empty runtime bytecode from X Layer testnet.

| Component | Contract | Address | Runtime bytes | OKLink |
|---|---|---:|---:|---|
| xUSD | `DemoQuoteToken` | `0x89AD049BbeD753E9213970Ea7F0727f85825e262` | 2,451 | [address](https://www.oklink.com/x-layer-testnet/address/0x89AD049BbeD753E9213970Ea7F0727f85825e262) |
| BRA | `DemoFanToken` | `0xC03713D4B186A2f762A6b301b8F805739a671bb3` | 2,451 | [address](https://www.oklink.com/x-layer-testnet/address/0xC03713D4B186A2f762A6b301b8F805739a671bb3) |
| ARG | `DemoFanToken` | `0x28b1F6d00177F6565310e9849aC1fe27FD6781d4` | 2,451 | [address](https://www.oklink.com/x-layer-testnet/address/0x28b1F6d00177F6565310e9849aC1fe27FD6781d4) |
| FRA | `DemoFanToken` | `0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB` | 2,451 | [address](https://www.oklink.com/x-layer-testnet/address/0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB) |
| GER | `DemoFanToken` | `0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32` | 2,451 | [address](https://www.oklink.com/x-layer-testnet/address/0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32) |
| PoolManager | `PoolManager` | `0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5` | 19,766 | [address](https://www.oklink.com/x-layer-testnet/address/0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5) |
| Registry | `XCupLeagueRegistry` | `0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50` | 5,108 | [address](https://www.oklink.com/x-layer-testnet/address/0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50) |
| Passport | `TeamPassport` | `0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358` | 5,045 | [address](https://www.oklink.com/x-layer-testnet/address/0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358) |
| Hook | `XCupLiquidityLeagueHook` | `0xea906F6E7D63D96E4D6782b6260a7a11587144c0` | 9,340 | [address](https://www.oklink.com/x-layer-testnet/address/0xea906F6E7D63D96E4D6782b6260a7a11587144c0) |
| Helper | `V4PoolActionHelper` | `0x693c37af40d21c5c0B4b34151a234D69919F1407` | 5,284 | [address](https://www.oklink.com/x-layer-testnet/address/0x693c37af40d21c5c0B4b34151a234D69919F1407) |
| Deploy utility | `HookCreate2Deployer` | `0x7d887404e350df334d903498f39ab40423633d62` | 10,443 | [address](https://www.oklink.com/x-layer-testnet/address/0x7d887404e350df334d903498f39ab40423633d62) |

## Live Contract Read Proof

### Token metadata

| Token | Symbol read | Decimals | Owner |
|---|---|---:|---|
| xUSD | `xUSD` | 18 | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| BRA | `BRA` | 18 | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| ARG | `ARG` | 18 | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| FRA | `FRA` | 18 | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| GER | `GER` | 18 | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |

### Passport

| Read | Value |
|---|---|
| `name()` | `X Cup Team Passport` |
| `symbol()` | `XCUP-PASS` |
| `owner()` | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| `nextTokenId()` | `1` |

### Registry

| Read | Value |
|---|---|
| `owner()` | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| `controller()` | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| `getTeamIds()` | BRA, ARG, FRA, GER team IDs present |
| `isRegisteredPool(BRA)` | `true` |
| `isRegisteredPool(ARG)` | `true` |
| `isRegisteredPool(FRA)` | `true` |
| `isRegisteredPool(GER)` | `true` |

### Hook wiring and live state

| Read | Value |
|---|---|
| `poolManager()` | `0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5` |
| `registry()` | `0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50` |
| `passport()` | `0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358` |
| `owner()` | `0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B` |
| `feeForState(0)` | `30` bps |
| `feeForState(1)` | `50` bps |
| `feeForState(2)` | `150` bps |
| `feeForState(3)` | `100` bps |
| `feeForState(4)` | `125` bps |
| `feeForState(5)` | `75` bps |
| `getTeamScore(BRA)` | `(swapPoints=1, lpPoints=1500, totalPoints=1501, lastUpdatedAt=1779954762)` |

### Helper wiring

| Read | Value |
|---|---|
| `V4PoolActionHelper.manager()` | `0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5` |

## Pool IDs

| Pool | Pool ID |
|---|---|
| BRA/xUSD | `0xac226e1ee3a5d5b56d33dbb8760019d5f2d59635bed752085d705ce2bece4380` |
| ARG/xUSD | `0xc59461cd61690d3b48635a550962c7f9491530eb4c181c435e51ba6c03c8f9cd` |
| FRA/xUSD | `0xa2a46908c90ebf39ed2f12938d0e29b5b3f4a94f09281ea9f99fc860368b65c8` |
| GER/xUSD | `0x1929af06898f12a50752e87f1e7bc370d77754f3006ec8ead85764ef4df808f6` |

## Source Verification Status

Status: **OKLink source-verified on X Layer testnet.**

The deployed contracts were checked on-chain for runtime bytecode and live reads, then submitted to OKLink with Foundry. Every contract listed below returned `Pass - Verified`.

Pool IDs are not standalone contracts and cannot be source-verified on OKLink. They are verified through `XCupLeagueRegistry.isRegisteredPool(poolId) == true` and the committed deployment manifests.

| Component | Address | OKLink verification result |
|---|---|---|
| xUSD | `0x89AD049BbeD753E9213970Ea7F0727f85825e262` | `Pass - Verified` |
| BRA | `0xC03713D4B186A2f762A6b301b8F805739a671bb3` | `Pass - Verified` |
| ARG | `0x28b1F6d00177F6565310e9849aC1fe27FD6781d4` | `Pass - Verified` |
| FRA | `0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB` | `Pass - Verified` |
| GER | `0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32` | `Pass - Verified` |
| PoolManager | `0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5` | `Pass - Verified` |
| Registry | `0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50` | `Pass - Verified` |
| TeamPassport | `0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358` | `Pass - Verified` |
| Hook | `0xea906F6E7D63D96E4D6782b6260a7a11587144c0` | `Pass - Verified` |
| Helper | `0x693c37af40d21c5c0B4b34151a234D69919F1407` | `Pass - Verified` |
| HookCreate2Deployer | `0x7d887404e350df334d903498f39ab40423633d62` | `Pass - Verified` |

Useful links:

- OKLink X Layer Testnet browser verifier: https://www.oklink.com/x-layer-testnet/verify-contract-preliminary
- OKLink API docs: https://www.oklink.com/docs/en/
- X Layer Foundry verification docs: https://web3.okx.com/xlayer/docs/developer/verify-a-smart-contract/verify-with-foundry

Compiler settings used by this repo:

| Setting | Value |
|---|---|
| Solidity | `0.8.26` |
| EVM version | `cancun` |
| Optimizer | enabled |
| Optimizer runs | `200` |

### Foundry command template

```bash
cd contracts

forge verify-contract \
  --chain 1952 \
  --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  <address> <source-path>:<contract-name> \
  --constructor-args <abi-encoded-constructor-args> \
  --watch
```

### Main verification targets

Use `cast abi-encode` to produce constructor args.

```bash
# xUSD
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0x89AD049BbeD753E9213970Ea7F0727f85825e262 src/DemoQuoteToken.sol:DemoQuoteToken \
  --constructor-args "$(cast abi-encode 'constructor(address)' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# BRA
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0xC03713D4B186A2f762A6b301b8F805739a671bb3 src/DemoFanToken.sol:DemoFanToken \
  --constructor-args "$(cast abi-encode 'constructor(string,string,address)' 'Brazil Fan Token' 'BRA' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# ARG
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0x28b1F6d00177F6565310e9849aC1fe27FD6781d4 src/DemoFanToken.sol:DemoFanToken \
  --constructor-args "$(cast abi-encode 'constructor(string,string,address)' 'Argentina Fan Token' 'ARG' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# FRA
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB src/DemoFanToken.sol:DemoFanToken \
  --constructor-args "$(cast abi-encode 'constructor(string,string,address)' 'France Fan Token' 'FRA' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# GER
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32 src/DemoFanToken.sol:DemoFanToken \
  --constructor-args "$(cast abi-encode 'constructor(string,string,address)' 'Germany Fan Token' 'GER' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# PoolManager
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5 lib/v4-core/src/PoolManager.sol:PoolManager \
  --constructor-args "$(cast abi-encode 'constructor(address)' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# Registry
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50 src/XCupLeagueRegistry.sol:XCupLeagueRegistry \
  --constructor-args "$(cast abi-encode 'constructor(address)' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# Passport
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358 src/TeamPassport.sol:TeamPassport \
  --constructor-args "$(cast abi-encode 'constructor(address)' 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# Hook
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0xea906F6E7D63D96E4D6782b6260a7a11587144c0 src/XCupLiquidityLeagueHook.sol:XCupLiquidityLeagueHook \
  --constructor-args "$(cast abi-encode 'constructor(address,address,address,address)' 0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5 0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50 0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358 0xE1Cc29641C37D2C61eBBCee22A5ffa70aaCbD67B)" --watch

# Helper
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0x693c37af40d21c5c0B4b34151a234D69919F1407 script/utils/V4PoolActionHelper.sol:V4PoolActionHelper \
  --constructor-args "$(cast abi-encode 'constructor(address)' 0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5)" --watch

# HookCreate2Deployer
forge verify-contract --chain 1952 --verifier oklink \
  --verifier-url https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TESTNET \
  0x7d887404e350df334d903498f39ab40423633d62 script/utils/HookCreate2Deployer.sol:HookCreate2Deployer --watch
```

## Integrity Notes

- This is a testnet demo deployment; tokens are faucet/demo assets and have no value.
- The PoolManager is project-owned and disclosed because no canonical X Layer testnet PoolManager was confirmed during deployment.
- The frontend proof panel links to the same deployed addresses listed here.
- `deployments/31337/` is local anvil output and is intentionally not part of the committed X Layer testnet proof.
