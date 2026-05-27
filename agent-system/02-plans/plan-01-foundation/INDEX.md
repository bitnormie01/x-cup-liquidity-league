# Plan 01 — Foundation

Set up the repo, install Foundry deps, and configure X Layer networks. This plan ends with a clean `forge build` on a placeholder contract and verified RPC connectivity.

## Phases

| ID | File | Goal |
|---|---|---|
| P01-01 | `01-repo-and-foundry.md` | Init repo + folder structure + Foundry + Uniswap v4 deps + OZ + forge-std. |
| P01-02 | `02-networks-and-env.md` | `foundry.toml` network entries, `.env.example` scaffold, deployer key strategy, RPC sanity check. |

## Exit Criteria

- `forge build` succeeds on a placeholder contract.
- `forge test` runs at least one trivial test green.
- `cast chain-id --rpc-url $XLAYER_TESTNET_RPC` returns `1952`.
- `.env.example` committed; `.env` gitignored.
- README has a "Networks" section.

## Time budget

~2–3 hours total. If P01-01 takes more than 2 hours, raise BLOCKED — something is wrong with the toolchain.
