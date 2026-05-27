# Plan 05 — Deployment

Foundry scripts that deploy all contracts, create the 4 v4 pools with the Hook attached, and seed initial liquidity on X Layer testnet.

## Phases

| ID | File | Goal |
|---|---|---|
| P05-01 | `01-deploy-scripts.md` | Foundry scripts: token deploy, registry/passport/hook deploy with CREATE2 salt mining. |
| P05-02 | `02-pools-and-seed.md` | Create 4 dynamic-fee pools (BRA/ARG/FRA/GER vs xUSD), seed liquidity, register pools in Registry. |
| P05-03 | `03-testnet-deploy.md` | Execute the deploy on X Layer testnet, capture addresses, attempt verification, populate `deployments/xlayer-testnet.json`. |

## Exit Criteria

- All deploy scripts run on a local anvil fork without revert.
- Live testnet deployment captures every address in a structured JSON for the frontend to consume.
- README's "Deployed Addresses" section populated (or referenced from the JSON).
- Hook address has the correct flag bits.
