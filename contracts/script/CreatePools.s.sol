// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {IHooks} from "@uniswap/v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/libraries/LPFeeLibrary.sol";
import {Currency} from "@uniswap/v4-core/types/Currency.sol";
import {PoolId} from "@uniswap/v4-core/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/types/PoolKey.sol";
import {XCupLeagueRegistry} from "../src/XCupLeagueRegistry.sol";

contract CreatePools is Script {
    uint160 internal constant SQRT_PRICE_1_1 = 79228162514264337593543950336;
    int24 internal constant TICK_SPACING = 60;

    struct PoolTeam {
        string symbol;
        bytes32 teamId;
        address fanToken;
        address quoteToken;
        PoolKey key;
        PoolId poolId;
    }

    function run() external {
        string memory outputDir = _deploymentDir();
        string memory tokensJson = vm.readFile(string.concat(outputDir, "/tokens.json"));
        string memory coreJson = vm.readFile(string.concat(outputDir, "/core.json"));

        address quoteToken = vm.parseJsonAddress(tokensJson, ".quote.address");
        address poolManager = vm.parseJsonAddress(coreJson, ".poolManager");
        address registry = vm.parseJsonAddress(coreJson, ".registry");
        address hook = vm.parseJsonAddress(coreJson, ".hook");

        PoolTeam[] memory teams = _readTeams(tokensJson, quoteToken, hook);

        vm.startBroadcast();
        for (uint256 i = 0; i < teams.length; i++) {
            IPoolManager(poolManager).initialize(teams[i].key, SQRT_PRICE_1_1);
            XCupLeagueRegistry(registry)
                .registerPool(
                    teams[i].poolId, teams[i].teamId, Currency.wrap(teams[i].fanToken), Currency.wrap(quoteToken)
                );
        }
        vm.stopBroadcast();

        vm.writeFile(string.concat(outputDir, "/pools.json"), _poolsJson(poolManager, registry, hook, teams));
    }

    function _readTeams(string memory tokensJson, address quoteToken, address hook)
        internal
        pure
        returns (PoolTeam[] memory teams)
    {
        teams = new PoolTeam[](4);
        teams[0] = _readTeam(tokensJson, 0, quoteToken, hook);
        teams[1] = _readTeam(tokensJson, 1, quoteToken, hook);
        teams[2] = _readTeam(tokensJson, 2, quoteToken, hook);
        teams[3] = _readTeam(tokensJson, 3, quoteToken, hook);
    }

    function _readTeam(string memory tokensJson, uint256 index, address quoteToken, address hook)
        internal
        pure
        returns (PoolTeam memory team)
    {
        string memory prefix = string.concat(".teams[", vm.toString(index), "]");
        string memory symbol = vm.parseJsonString(tokensJson, string.concat(prefix, ".symbol"));
        address fanToken = vm.parseJsonAddress(tokensJson, string.concat(prefix, ".address"));
        PoolKey memory key = _buildPoolKey(fanToken, quoteToken, hook);

        team = PoolTeam({
            symbol: symbol,
            teamId: keccak256(bytes(symbol)),
            fanToken: fanToken,
            quoteToken: quoteToken,
            key: key,
            poolId: key.toId()
        });
    }

    function _buildPoolKey(address fanToken, address quoteToken, address hook) internal pure returns (PoolKey memory) {
        (address currency0, address currency1) = fanToken < quoteToken ? (fanToken, quoteToken) : (quoteToken, fanToken);

        return PoolKey({
            currency0: Currency.wrap(currency0),
            currency1: Currency.wrap(currency1),
            fee: LPFeeLibrary.DYNAMIC_FEE_FLAG,
            tickSpacing: TICK_SPACING,
            hooks: IHooks(hook)
        });
    }

    function _deploymentDir() internal view returns (string memory) {
        return string.concat("../deployments/", vm.toString(block.chainid));
    }

    function _poolsJson(address poolManager, address registry, address hook, PoolTeam[] memory teams)
        internal
        view
        returns (string memory)
    {
        return string.concat(
            "{\n",
            '  "chainId": ',
            vm.toString(block.chainid),
            ",\n",
            '  "poolManager": "',
            vm.toString(poolManager),
            '",\n',
            '  "registry": "',
            vm.toString(registry),
            '",\n',
            '  "hook": "',
            vm.toString(hook),
            '",\n',
            '  "fee": ',
            vm.toString(LPFeeLibrary.DYNAMIC_FEE_FLAG),
            ",\n",
            '  "tickSpacing": ',
            vm.toString(TICK_SPACING),
            ",\n",
            '  "teams": [\n',
            _poolTeamJson(teams[0], true),
            _poolTeamJson(teams[1], true),
            _poolTeamJson(teams[2], true),
            _poolTeamJson(teams[3], false),
            "  ]\n",
            "}\n"
        );
    }

    function _poolTeamJson(PoolTeam memory team, bool addComma) internal pure returns (string memory) {
        return string.concat(
            '    { "symbol": "',
            team.symbol,
            '", "teamId": "',
            vm.toString(team.teamId),
            '", "poolId": "',
            vm.toString(PoolId.unwrap(team.poolId)),
            '", "fanToken": "',
            vm.toString(team.fanToken),
            '", "quoteToken": "',
            vm.toString(team.quoteToken),
            '", "currency0": "',
            vm.toString(Currency.unwrap(team.key.currency0)),
            '", "currency1": "',
            vm.toString(Currency.unwrap(team.key.currency1)),
            '" }',
            addComma ? "," : "",
            "\n"
        );
    }
}
