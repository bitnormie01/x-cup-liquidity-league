---
phase-id: P02-02
plan: P02
revised-on: 2026-05-26
---

# P02-02 — TeamPassport (Soulbound)

## Goal

Build `TeamPassport.sol`: a soulbound (non-transferable) ERC-721 where each wallet can mint exactly one passport that selects a `teamId`. The Hook will read this to apply supporter discounts and loyalty multipliers.

## Scope (In)

- `contracts/src/TeamPassport.sol`:
  - inherits `ERC721`, `Ownable` (OZ v5).
  - storage:
    ```solidity
    struct PassportData { bytes32 teamId; uint64 mintedAt; bool exists; }
    mapping(address => PassportData) public passportOf;
    mapping(bytes32 => uint256) public teamFanCount;
    mapping(address => uint256) public tokenIdOf;
    uint256 public nextTokenId;
    ```
  - functions:
    - `mintPassport(bytes32 teamId) external returns (uint256 tokenId)` — reverts if user already has a passport; reverts if `teamId == bytes32(0)`; increments `teamFanCount[teamId]`; emits `PassportMinted(fan, tokenId, teamId)`.
    - `teamOf(address fan) external view returns (bytes32)` — returns `bytes32(0)` if none.
    - `hasPassport(address fan) external view returns (bool)`.
    - `isSupporter(address fan, bytes32 teamId) external view returns (bool)` — true iff `passportOf[fan].exists && passportOf[fan].teamId == teamId`.
  - soulbound: override `_update` (OZ v5 hook) to revert on any transfer where `from != address(0) && to != address(0)`. Use custom error `error Soulbound();`.
  - **No team change in MVP** — `teamId` is set at mint and immutable.
- Events:
  ```solidity
  event PassportMinted(address indexed fan, uint256 indexed tokenId, bytes32 indexed teamId);
  ```

## Scope (Out)

- No metadata URI logic beyond the trivial OZ default (or omit `tokenURI` override).
- No team-change function.
- No batch mint.
- No registry coupling — Passport is independent of the registry. The Hook reads both separately.

## Acceptance Criteria

- [ ] `forge build` clean.
- [ ] Any transfer attempt reverts with `Soulbound`.
- [ ] `mintPassport` reverts with `bytes32(0)`.
- [ ] Double-mint by same wallet reverts.
- [ ] `teamFanCount[teamId]` increments correctly.
- [ ] Custom errors only — no `require(..., "...")`.
- [ ] NatSpec on every external function.

## Risks / Pitfalls

- OZ v5 replaced `_beforeTokenTransfer` with `_update`. Use `_update` (`function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address)`) and check `_ownerOf(tokenId) != address(0)` to distinguish mint from transfer.
- `mintPassport` must call `_safeMint` to ensure ERC721Receiver compatibility, but `_safeMint` will trigger `_update`. Make sure the soulbound check exempts mints (where `from == address(0)`).
- Do not couple to the registry here; this contract knows nothing about pools.

## Reference

- Brief: "Contracts" table; "Hook Callbacks" (so you understand how Passport is read).
- PRD §11 "Contract 3 — TeamPassport.sol".
