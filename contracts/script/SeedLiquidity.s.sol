// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script} from "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IHooks} from "@uniswap/v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/libraries/LPFeeLibrary.sol";
import {TickMath} from "@uniswap/v4-core/libraries/TickMath.sol";
import {Currency} from "@uniswap/v4-core/types/Currency.sol";
import {PoolId} from "@uniswap/v4-core/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/types/PoolKey.sol";
import {DemoFanToken} from "../src/DemoFanToken.sol";
import {DemoQuoteToken} from "../src/DemoQuoteToken.sol";
import {V4PoolActionHelper} from "./utils/V4PoolActionHelper.sol";

contract SeedLiquidity is Script {
    int24 internal constant TICK_SPACING = 60;
    int256 internal constant LIQUIDITY_DELTA = 1_000 ether;
    uint256 internal constant MINT_AMOUNT = 20_000 ether;

    struct SeedTeam {
        string symbol;
        bytes32 teamId;
        address fanToken;
        address quoteToken;
        PoolKey key;
        PoolId poolId;
    }

    struct SeedResult {
        string symbol;
        PoolId poolId;
        int256 liquidityDelta;
        uint256 fanTokenAmount;
        uint256 quoteTokenAmount;
    }

    function run() external {
        string memory outputDir = _deploymentDir();
        string memory tokensJson = vm.readFile(string.concat(outputDir, "/tokens.json"));
        string memory coreJson = vm.readFile(string.concat(outputDir, "/core.json"));
        string memory poolsJson = vm.readFile(string.concat(outputDir, "/pools.json"));

        address quoteToken = vm.parseJsonAddress(tokensJson, ".quote.address");
        address poolManager = vm.parseJsonAddress(coreJson, ".poolManager");
        address hook = vm.parseJsonAddress(coreJson, ".hook");
        SeedTeam[] memory teams = _readTeams(poolsJson, quoteToken, hook);

        vm.startBroadcast();
        address deployer = msg.sender;
        V4PoolActionHelper helper = new V4PoolActionHelper(IPoolManager(poolManager));

        DemoQuoteToken(quoteToken).mint(deployer, MINT_AMOUNT * teams.length);
        IERC20(quoteToken).approve(address(helper), type(uint256).max);

        SeedResult[] memory results = new SeedResult[](teams.length);
        for (uint256 i = 0; i < teams.length; i++) {
            DemoFanToken(teams[i].fanToken).mint(deployer, MINT_AMOUNT);
            IERC20(teams[i].fanToken).approve(address(helper), type(uint256).max);

            uint256 fanBefore = IERC20(teams[i].fanToken).balanceOf(deployer);
            uint256 quoteBefore = IERC20(quoteToken).balanceOf(deployer);
            helper.modifyLiquidity(
                deployer,
                teams[i].key,
                IPoolManager.ModifyLiquidityParams({
                    tickLower: TickMath.minUsableTick(TICK_SPACING),
                    tickUpper: TickMath.maxUsableTick(TICK_SPACING),
                    liquidityDelta: LIQUIDITY_DELTA,
                    salt: bytes32(uint256(i + 1))
                }),
                abi.encodePacked(deployer)
            );

            results[i] = SeedResult({
                symbol: teams[i].symbol,
                poolId: teams[i].poolId,
                liquidityDelta: LIQUIDITY_DELTA,
                fanTokenAmount: fanBefore - IERC20(teams[i].fanToken).balanceOf(deployer),
                quoteTokenAmount: quoteBefore - IERC20(quoteToken).balanceOf(deployer)
            });
        }

        vm.stopBroadcast();

        vm.writeFile(string.concat(outputDir, "/seed.json"), _seedJson(address(helper), results));
    }

    function _readTeams(string memory poolsJson, address quoteToken, address hook)
        internal
        pure
        returns (SeedTeam[] memory teams)
    {
        teams = new SeedTeam[](4);
        teams[0] = _readTeam(poolsJson, 0, quoteToken, hook);
        teams[1] = _readTeam(poolsJson, 1, quoteToken, hook);
        teams[2] = _readTeam(poolsJson, 2, quoteToken, hook);
        teams[3] = _readTeam(poolsJson, 3, quoteToken, hook);
    }

    function _readTeam(string memory poolsJson, uint256 index, address quoteToken, address hook)
        internal
        pure
        returns (SeedTeam memory team)
    {
        string memory prefix = string.concat(".teams[", vm.toString(index), "]");
        string memory symbol = vm.parseJsonString(poolsJson, string.concat(prefix, ".symbol"));
        bytes32 teamId = vm.parseJsonBytes32(poolsJson, string.concat(prefix, ".teamId"));
        address fanToken = vm.parseJsonAddress(poolsJson, string.concat(prefix, ".fanToken"));
        PoolKey memory key = _buildPoolKey(fanToken, quoteToken, hook);

        team = SeedTeam({
            symbol: symbol, teamId: teamId, fanToken: fanToken, quoteToken: quoteToken, key: key, poolId: key.toId()
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

    function _seedJson(address helper, SeedResult[] memory results) internal view returns (string memory) {
        return string.concat(
            "{\n",
            '  "chainId": ',
            vm.toString(block.chainid),
            ",\n",
            '  "liquiditySeeder": "',
            vm.toString(helper),
            '",\n',
            '  "teams": [\n',
            _seedTeamJson(results[0], true),
            _seedTeamJson(results[1], true),
            _seedTeamJson(results[2], true),
            _seedTeamJson(results[3], false),
            "  ]\n",
            "}\n"
        );
    }

    function _seedTeamJson(SeedResult memory result, bool addComma) internal pure returns (string memory) {
        return string.concat(
            '    { "symbol": "',
            result.symbol,
            '", "poolId": "',
            vm.toString(PoolId.unwrap(result.poolId)),
            '", "liquidityDelta": "',
            vm.toString(result.liquidityDelta),
            '", "fanTokenAmount": "',
            vm.toString(result.fanTokenAmount),
            '", "quoteTokenAmount": "',
            vm.toString(result.quoteTokenAmount),
            '" }',
            addComma ? "," : "",
            "\n"
        );
    }
}
