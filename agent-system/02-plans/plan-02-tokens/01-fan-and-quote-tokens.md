---
phase-id: P02-01
plan: P02
revised-on: 2026-05-26
---

# P02-01 — DemoFanToken + DemoQuoteToken

## Goal

Implement two ERC-20 contracts: one parameterized fan-token (deployed 4× later for BRA/ARG/FRA/GER) and one xUSD quote-token. Both inherit OpenZeppelin v5 `ERC20` + `Ownable`, with owner mint and a public faucet (cooldown to prevent demo griefing).

## Scope (In)

- `contracts/src/DemoFanToken.sol`:
  - inherits `ERC20`, `Ownable`.
  - constructor `(string name_, string symbol_, address owner_)` — passes `owner_` to `Ownable`.
  - `function mint(address to, uint256 amount) external onlyOwner`.
  - `function faucetMint(address to) external` — mints a fixed amount (suggested: `1_000 * 10**decimals()`) with a per-`to` cooldown (suggested 4 hours).
  - Storage: `mapping(address => uint256) public lastFaucetAt;` and `uint256 public constant FAUCET_AMOUNT = 1_000 ether;` plus `uint256 public constant FAUCET_COOLDOWN = 4 hours;`.
  - Revert with custom errors: `error FaucetCooldown(uint256 nextAvailableAt);`.
- `contracts/src/DemoQuoteToken.sol`:
  - same shape, hard-coded `name_ = "X Cup Demo USD"`, `symbol_ = "xUSD"`.
  - `mint`, `faucetMint` identical contract surface to DemoFanToken.
- Both contracts use `uint8 public constant decimals_ = 18;` via default ERC-20.

## Scope (Out)

- No transfer hooks, no fees, no rebasing, no permit (yet — only if we need it for frontend; P06 will tell us).
- No actual deployment of any instance — that's P05.
- No TeamPassport — that's P02-02.

## Acceptance Criteria

- [ ] `forge build` clean.
- [ ] Both contracts < 100 lines each (excluding NatSpec).
- [ ] `mint` reverts when called by non-owner.
- [ ] `faucetMint` mints exactly `FAUCET_AMOUNT` on first call.
- [ ] `faucetMint` reverts with `FaucetCooldown` if called within `FAUCET_COOLDOWN`.
- [ ] Custom errors used (not `require` with string).
- [ ] NatSpec `@notice` on every external function.

## Risks / Pitfalls

- OZ v5 `Ownable` constructor signature is `Ownable(address initialOwner)` — must pass it explicitly.
- Don't use `_mint` from `Ownable` confusion — it's an ERC-20 internal.
- Faucet must be permissioned-by-cooldown only; do NOT add allowlists or KYC.

## Reference

- Brief: "Contracts" table; "Constants Cheatsheet".
- PRD §11 "Contract 1 — DemoFanToken.sol" and "Contract 2 — DemoQuoteToken.sol".
