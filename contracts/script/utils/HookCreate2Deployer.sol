// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {TeamPassport} from "../../src/TeamPassport.sol";
import {XCupLeagueRegistry} from "../../src/XCupLeagueRegistry.sol";
import {XCupLiquidityLeagueHook} from "../../src/XCupLiquidityLeagueHook.sol";

contract HookCreate2Deployer {
    function deploy(
        bytes32 salt,
        IPoolManager poolManager,
        XCupLeagueRegistry registry,
        TeamPassport passport,
        address owner
    ) external returns (XCupLiquidityLeagueHook hook) {
        hook = new XCupLiquidityLeagueHook{salt: salt}(poolManager, registry, passport, owner);
    }
}
