# X Cup Liquidity League

X Cup Liquidity League turns Uniswap v4 pool activity on X Layer into mock World Cup fan support points: swaps and liquidity adds flow through a reusable hook, update team scores, and demonstrate dynamic match-state fees without betting, wagers, or licensed sports assets.

## Networks

### X Layer testnet

- Chain ID: `1952`
- Primary RPC: `https://testrpc.xlayer.tech/terigon`
- Fallback RPC: `https://xlayertestrpc.okx.com/terigon`
- Explorer: `https://www.okx.com/web3/explorer/xlayer-test`

### X Layer mainnet

- Chain ID: `196`
- Primary RPC: `https://rpc.xlayer.tech`
- Fallback RPC: `https://xlayerrpc.okx.com`
- Explorer: `https://www.okx.com/web3/explorer/xlayer`

### Contracts environment setup

```bash
cd contracts && cp .env.example .env
```

Fill the required keys in `contracts/.env`; the deployer private key is managed by the user and must not be committed.

## X Layer Testnet Deployment

Explorer base: `https://www.okx.com/web3/explorer/xlayer-test`

| Artifact | Address / ID | Explorer |
|---|---|---|
| xUSD | `0x89AD049BbeD753E9213970Ea7F0727f85825e262` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0x89AD049BbeD753E9213970Ea7F0727f85825e262) |
| BRA | `0xC03713D4B186A2f762A6b301b8F805739a671bb3` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0xC03713D4B186A2f762A6b301b8F805739a671bb3) |
| ARG | `0x28b1F6d00177F6565310e9849aC1fe27FD6781d4` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0x28b1F6d00177F6565310e9849aC1fe27FD6781d4) |
| FRA | `0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0xf6A9f29Cac7F2e4353FE9378807014cCD32841EB) |
| GER | `0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0x8Aaf86dBc2922409F32693290cb7b88D5F3DAA32) |
| TeamPassport | `0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0xaBf3AB75ac2B8d54E005C97e0f63fbeB82258358) |
| XCupLeagueRegistry | `0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0x5a1F521cAbc5b3b84518593C3EE09b7F978c2E50) |
| XCupLiquidityLeagueHook | `0xea906F6E7D63D96E4D6782b6260a7a11587144c0` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0xea906F6E7D63D96E4D6782b6260a7a11587144c0) |
| PoolManager | `0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0x89EB7997ec0A7862ae25bAf44302cf2ac1554bD5) |
| V4PoolActionHelper | `0x693c37af40d21c5c0B4b34151a234D69919F1407` | [address](https://www.okx.com/web3/explorer/xlayer-test/address/0x693c37af40d21c5c0B4b34151a234D69919F1407) |

| Pool | Pool ID |
|---|---|
| BRA/xUSD | `0xac226e1ee3a5d5b56d33dbb8760019d5f2d59635bed752085d705ce2bece4380` |
| ARG/xUSD | `0xc59461cd61690d3b48635a550962c7f9491530eb4c181c435e51ba6c03c8f9cd` |
| FRA/xUSD | `0xa2a46908c90ebf39ed2f12938d0e29b5b3f4a94f09281ea9f99fc860368b65c8` |
| GER/xUSD | `0x1929af06898f12a50752e87f1e7bc370d77754f3006ec8ead85764ef4df808f6` |

Deployment manifests are committed under `deployments/1952/` and `deployments/xlayer-testnet/`.

## Reproduce Deployment

```bash
cd contracts
cp .env.example .env
# set XLAYER_TESTNET_RPC, DEPLOYER_PRIVATE_KEY, and DEPLOY_OWN_POOL_MANAGER=true

forge script script/DeployTokens.s.sol --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
DEPLOY_OWN_POOL_MANAGER=true forge script script/DeployCore.s.sol --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
forge script script/CreatePools.s.sol --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
forge script script/SeedLiquidity.s.sol --rpc-url xlayer_testnet --private-key $DEPLOYER_PRIVATE_KEY --broadcast
```

## Known Limitations

- Demo tokens have no monetary value and are owner-mintable for local/testnet seeding.
- Teams are mock country labels only; the project uses no FIFA or licensed tournament assets.
- Match state is admin-controlled for the MVP and does not use a sports oracle.
- X Layer testnet had no confirmed canonical Uniswap v4 PoolManager for this deployment, so this MVP uses a clearly disclosed project-owned PoolManager.
- Seeded v4 liquidity positions are owned by the deployed `V4PoolActionHelper`, which is a script/demo helper rather than production LP infrastructure.
- OKX explorer verification was not completed in this run because no `OKX_EXPLORER_API_KEY` was available and the configured endpoint returned HTML to Foundry's Etherscan-compatible probe during broadcasts.
