---
phase-id: P01-01
plan: P01
revised-on: 2026-05-26
---

# P01-01 — Repo & Foundry Setup

## Goal

Bootstrap a Foundry project under `contracts/`, install Uniswap v4 dependencies, OpenZeppelin, and forge-std. End with `forge build` and `forge test` green on a placeholder contract.

## Scope (In)

- `git init` at repo root if not already initialized.
- Create the directory layout:
  ```
  contracts/
    src/
    script/
    test/
    foundry.toml
    remappings.txt
  frontend/        # empty placeholder for now
  agent-system/    # already present, do not modify
  README.md        # one-paragraph stub
  .gitignore
  ```
- Install Foundry deps via `forge install --no-commit`:
  - `uniswap/v4-core`
  - `uniswap/v4-periphery` (provides `BaseHook`)
  - `OpenZeppelin/openzeppelin-contracts` (v5.x)
  - `foundry-rs/forge-std`
- Configure `contracts/remappings.txt` so all four resolve under their canonical import paths.
- Place a `contracts/src/Placeholder.sol`:
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.26;
  contract Placeholder { uint256 public x; function setX(uint256 v) external { x = v; } }
  ```
- Place a matching `contracts/test/Placeholder.t.sol` with one trivial assertion exercising `setX`.
- `.gitignore` must exclude: `out/`, `cache/`, `broadcast/`, `node_modules/`, `.env`, `frontend/.next/`, `frontend/node_modules/`, `.DS_Store`.

## Scope (Out)

- No real contracts yet (DemoFanToken etc. is P02).
- No deployment scripts (P05).
- No frontend scaffolding (P06).
- No network entries (P01-02).
- No README content beyond a 2-line stub.

## Acceptance Criteria

- [ ] `cd contracts && forge build` exits 0 with no errors.
- [ ] `cd contracts && forge test -vvv` runs the placeholder test green.
- [ ] `git status` clean after final commit.
- [ ] `cat contracts/foundry.toml` shows the solc version matching whatever v4-periphery's contracts pin to (likely `0.8.26`).
- [ ] `cd contracts && forge remappings` lists all four installed deps with sane targets.
- [ ] `.gitignore` blocks `.env`, `out/`, `cache/`, `broadcast/`, `node_modules/`.

## Risks / Pitfalls

- v4-periphery may pin a specific solc version; align `foundry.toml` (`solc_version = "0.8.26"`) to it. If versions clash, take the periphery pin.
- `BaseHook` lives in v4-periphery, not v4-core — remember **both** installs.
- OpenZeppelin v5 changed `Ownable` to require a constructor arg; later phases must pass `msg.sender` explicitly. Note this in the report if you hit it now.
- `forge install` may fetch a default tag that doesn't match the deployed v4 version on X Layer. Prefer the latest tagged release; if unsure, pin and document the version in the report.

## Reference

- Brief: "Contracts" table.
- PRD §12 "Recommended tech stack" and "Repository structure".
