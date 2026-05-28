// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Hooks} from "@uniswap/v4-core/libraries/Hooks.sol";

library HookFlagsHelper {
    function requiredFlags() internal pure returns (uint160) {
        return Hooks.BEFORE_SWAP_FLAG | Hooks.AFTER_SWAP_FLAG | Hooks.AFTER_ADD_LIQUIDITY_FLAG;
    }

    function hookMask() internal pure returns (uint160) {
        return Hooks.ALL_HOOK_MASK;
    }
}
