// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DemoFanToken is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1_000 ether;
    uint256 public constant FAUCET_COOLDOWN = 4 hours;

    mapping(address => uint256) public lastFaucetAt;

    error FaucetCooldown(uint256 nextAvailableAt);

    /// @notice Creates a fan token with the provided name, symbol, and owner.
    constructor(string memory name_, string memory symbol_, address owner_) ERC20(name_, symbol_) Ownable(owner_) {}

    /// @notice Mints tokens to an address; callable only by the owner.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Mints a fixed faucet amount to an address after its cooldown expires.
    function faucetMint(address to) external {
        uint256 last = lastFaucetAt[to];
        if (last != 0 && block.timestamp < last + FAUCET_COOLDOWN) {
            revert FaucetCooldown(last + FAUCET_COOLDOWN);
        }

        lastFaucetAt[to] = block.timestamp;
        _mint(to, FAUCET_AMOUNT);
    }
}
