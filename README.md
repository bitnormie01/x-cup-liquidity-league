# X Cup Liquidity League

X Cup Liquidity League is a hackathon MVP that turns Uniswap v4 pool activity on X Layer into mock World Cup fan support points. This repository will contain the Foundry contracts, deployment scripts, and frontend dashboard built across the planned phases.

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
