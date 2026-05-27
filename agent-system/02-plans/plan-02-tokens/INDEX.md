# Plan 02 — Tokens & Passport

Build the three token-layer contracts: 4 country ERC-20s (BRA/ARG/FRA/GER), 1 xUSD quote ERC-20, and the soulbound TeamPassport NFT.

## Phases

| ID | File | Goal |
|---|---|---|
| P02-01 | `01-fan-and-quote-tokens.md` | `DemoFanToken.sol` and `DemoQuoteToken.sol` with owner-mint + public faucet (cooldown). |
| P02-02 | `02-team-passport.md` | `TeamPassport.sol` — soulbound ERC-721, one per wallet, stores `teamId`. |
| P02-03 | `03-token-tests.md` | Foundry tests for both token types + passport (transfer reverts, faucet cooldown, fan-count increments). |

## Exit Criteria

- `forge build` green.
- `forge test --match-contract '(DemoFanToken|DemoQuoteToken|TeamPassport)Test' -vvv` all pass.
- All three contracts have NatSpec on public functions.
- No floating pragmas (`pragma solidity 0.8.26;` exactly, or whatever P01-01 pinned).
