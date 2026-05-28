// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "@uniswap/v4-core/libraries/Hooks.sol";
import {Test} from "forge-std/Test.sol";
import {TeamPassport} from "../src/TeamPassport.sol";
import {XCupLeagueRegistry} from "../src/XCupLeagueRegistry.sol";
import {XCupLiquidityLeagueHook} from "../src/XCupLiquidityLeagueHook.sol";

contract HookCompileTest is Test {
    function test_ConstructorSetsHookPermissions() public {
        address owner = address(0xA11CE);
        XCupLeagueRegistry registry = new XCupLeagueRegistry(owner);
        TeamPassport passport = new TeamPassport(owner);

        XCupLiquidityLeagueHook hook =
            new XCupLiquidityLeagueHook(IPoolManager(address(0xBEEF)), registry, passport, owner);

        Hooks.Permissions memory permissions = hook.getHookPermissions();

        assertFalse(permissions.beforeInitialize);
        assertFalse(permissions.afterInitialize);
        assertFalse(permissions.beforeAddLiquidity);
        assertTrue(permissions.afterAddLiquidity);
        assertFalse(permissions.beforeRemoveLiquidity);
        assertFalse(permissions.afterRemoveLiquidity);
        assertTrue(permissions.beforeSwap);
        assertTrue(permissions.afterSwap);
        assertFalse(permissions.beforeDonate);
        assertFalse(permissions.afterDonate);
        assertFalse(permissions.beforeSwapReturnDelta);
        assertFalse(permissions.afterSwapReturnDelta);
        assertFalse(permissions.afterAddLiquidityReturnDelta);
        assertFalse(permissions.afterRemoveLiquidityReturnDelta);
    }
}
