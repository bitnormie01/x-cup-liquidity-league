// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IHooks} from "@uniswap/v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {Currency} from "@uniswap/v4-core/types/Currency.sol";
import {BalanceDelta} from "@uniswap/v4-core/types/BalanceDelta.sol";
import {PoolId} from "@uniswap/v4-core/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/types/PoolKey.sol";
import {Test} from "forge-std/Test.sol";
import {TeamPassport} from "../src/TeamPassport.sol";
import {XCupLeagueRegistry} from "../src/XCupLeagueRegistry.sol";
import {XCupLiquidityLeagueHook} from "../src/XCupLiquidityLeagueHook.sol";

contract HookScoringTest is Test {
    XCupLeagueRegistry internal registry;
    TeamPassport internal passport;
    XCupLiquidityLeagueHook internal hook;

    address internal owner = address(0xA11CE);
    address internal poolManager = address(0xBEEF);
    address internal alice = address(0xA11);
    address internal bob = address(0xB0B);
    address internal unauthorized = address(0xBAD);
    address internal fanToken = address(0xA0D);
    address internal quoteToken = address(0xB0A);

    bytes32 internal constant BRA = "BRA";

    PoolKey internal key;
    PoolKey internal unregisteredKey;
    PoolId internal poolId;

    event TeamPointsAwarded(
        PoolId indexed poolId,
        bytes32 indexed teamId,
        address indexed user,
        XCupLiquidityLeagueHook.PointSource source,
        uint256 rawAmount,
        uint256 multiplierBps,
        uint256 points
    );

    function setUp() public {
        registry = new XCupLeagueRegistry(owner);
        passport = new TeamPassport(owner);
        hook = new XCupLiquidityLeagueHook(IPoolManager(poolManager), registry, passport, owner);

        key = PoolKey({
            currency0: Currency.wrap(fanToken),
            currency1: Currency.wrap(quoteToken),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(hook))
        });
        poolId = key.toId();

        unregisteredKey = PoolKey({
            currency0: Currency.wrap(address(0xA0E)),
            currency1: Currency.wrap(address(0xB0C)),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(address(hook))
        });

        vm.startPrank(owner);
        registry.registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");
        registry.registerPool(poolId, BRA, key.currency0, key.currency1);
        vm.stopPrank();
    }

    function test_BeforeSwapRevertsForNonPoolManager() public {
        vm.prank(unauthorized);
        vm.expectRevert(XCupLiquidityLeagueHook.CallerNotPoolManager.selector);
        hook.beforeSwap(unauthorized, key, _swapParams(1e18), "");
    }

    function test_AfterSwapRevertsForNonPoolManager() public {
        vm.prank(unauthorized);
        vm.expectRevert(XCupLiquidityLeagueHook.CallerNotPoolManager.selector);
        hook.afterSwap(unauthorized, key, _swapParams(-1e18), BalanceDelta.wrap(0), "");
    }

    function test_AfterAddLiquidityRevertsForNonPoolManager() public {
        vm.prank(unauthorized);
        vm.expectRevert(XCupLiquidityLeagueHook.CallerNotPoolManager.selector);
        hook.afterAddLiquidity(
            unauthorized, key, _liquidityParams(1e18), BalanceDelta.wrap(0), BalanceDelta.wrap(0), ""
        );
    }

    function test_AfterSwapAwardsTeamAndUserPoints() public {
        IPoolManager.SwapParams memory params = _swapParams(-2e18);
        uint256 expectedPoints = 2;

        vm.expectEmit(true, true, true, true, address(hook));
        emit TeamPointsAwarded(
            poolId,
            BRA,
            alice,
            XCupLiquidityLeagueHook.PointSource.SWAP,
            2e18,
            hook.DEFAULT_MULTIPLIER_BPS(),
            expectedPoints
        );

        vm.prank(poolManager);
        hook.afterSwap(alice, key, params, BalanceDelta.wrap(0), "");

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        XCupLiquidityLeagueHook.UserContribution memory contribution = hook.getUserContribution(alice, BRA);

        assertEq(teamScore.swapPoints, expectedPoints);
        assertEq(teamScore.totalPoints, expectedPoints);
        assertEq(teamScore.lastUpdatedAt, uint64(block.timestamp));
        assertEq(contribution.swapPoints, expectedPoints);
        assertEq(contribution.totalPoints, expectedPoints);
        assertEq(contribution.lastActionAt, uint64(block.timestamp));
    }

    function test_AfterSwapLoyaltyMultiplier() public {
        vm.prank(bob);
        passport.mintPassport(BRA);

        vm.prank(poolManager);
        hook.afterSwap(alice, key, _swapParams(-10e18), BalanceDelta.wrap(0), "");

        vm.prank(poolManager);
        hook.afterSwap(bob, key, _swapParams(-10e18), BalanceDelta.wrap(0), "");

        XCupLiquidityLeagueHook.UserContribution memory nonSupporter = hook.getUserContribution(alice, BRA);
        XCupLiquidityLeagueHook.UserContribution memory supporter = hook.getUserContribution(bob, BRA);

        assertEq(nonSupporter.swapPoints, 10);
        assertEq(supporter.swapPoints, 12);
        assertEq(supporter.swapPoints, nonSupporter.swapPoints * 12 / 10);
    }

    function test_AfterSwapUnregisteredPoolIsNoOp() public {
        vm.prank(poolManager);
        hook.afterSwap(alice, unregisteredKey, _swapParams(-3e18), BalanceDelta.wrap(0), "");

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        XCupLiquidityLeagueHook.UserContribution memory contribution = hook.getUserContribution(alice, BRA);

        assertEq(teamScore.totalPoints, 0);
        assertEq(contribution.totalPoints, 0);
    }

    function test_AfterAddLiquidityAwardsLPPoints() public {
        uint256 expectedPoints = 3;

        vm.expectEmit(true, true, true, true, address(hook));
        emit TeamPointsAwarded(
            poolId,
            BRA,
            alice,
            XCupLiquidityLeagueHook.PointSource.LIQUIDITY,
            2e18,
            hook.LP_WEIGHT_BPS(),
            expectedPoints
        );

        vm.prank(poolManager);
        hook.afterAddLiquidity(alice, key, _liquidityParams(2e18), BalanceDelta.wrap(0), BalanceDelta.wrap(0), "");

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        XCupLiquidityLeagueHook.UserContribution memory contribution = hook.getUserContribution(alice, BRA);

        assertEq(teamScore.lpPoints, expectedPoints);
        assertEq(teamScore.totalPoints, expectedPoints);
        assertEq(teamScore.lastUpdatedAt, uint64(block.timestamp));
        assertEq(contribution.lpPoints, expectedPoints);
        assertEq(contribution.totalPoints, expectedPoints);
        assertEq(contribution.lastActionAt, uint64(block.timestamp));
    }

    function test_AfterAddLiquidityNegativeDeltaIsNoOp() public {
        vm.prank(poolManager);
        hook.afterAddLiquidity(alice, key, _liquidityParams(-1), BalanceDelta.wrap(0), BalanceDelta.wrap(0), "");

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        XCupLiquidityLeagueHook.UserContribution memory contribution = hook.getUserContribution(alice, BRA);

        assertEq(teamScore.totalPoints, 0);
        assertEq(contribution.totalPoints, 0);
    }

    function test_AfterAddLiquidityUnregisteredPoolIsNoOp() public {
        vm.prank(poolManager);
        hook.afterAddLiquidity(
            alice, unregisteredKey, _liquidityParams(2e18), BalanceDelta.wrap(0), BalanceDelta.wrap(0), ""
        );

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        XCupLiquidityLeagueHook.UserContribution memory contribution = hook.getUserContribution(alice, BRA);

        assertEq(teamScore.totalPoints, 0);
        assertEq(contribution.totalPoints, 0);
    }

    function test_GetTeamScoreAndGetUserContributionReturnPopulatedAfterActivity() public {
        vm.prank(poolManager);
        hook.afterSwap(alice, key, _swapParams(-2e18), BalanceDelta.wrap(0), "");

        vm.prank(poolManager);
        hook.afterAddLiquidity(alice, key, _liquidityParams(2e18), BalanceDelta.wrap(0), BalanceDelta.wrap(0), "");

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        XCupLiquidityLeagueHook.UserContribution memory contribution = hook.getUserContribution(alice, BRA);

        assertEq(teamScore.swapPoints, 2);
        assertEq(teamScore.lpPoints, 3);
        assertEq(teamScore.totalPoints, 5);
        assertEq(contribution.swapPoints, 2);
        assertEq(contribution.lpPoints, 3);
        assertEq(contribution.totalPoints, 5);
        assertEq(teamScore.lastUpdatedAt, uint64(block.timestamp));
        assertEq(contribution.lastActionAt, uint64(block.timestamp));
    }

    function _swapParams(int256 amountSpecified) internal pure returns (IPoolManager.SwapParams memory) {
        return IPoolManager.SwapParams({zeroForOne: true, amountSpecified: amountSpecified, sqrtPriceLimitX96: 1});
    }

    function _liquidityParams(int256 liquidityDelta) internal pure returns (IPoolManager.ModifyLiquidityParams memory) {
        return IPoolManager.ModifyLiquidityParams({
            tickLower: -120, tickUpper: 120, liquidityDelta: liquidityDelta, salt: bytes32(0)
        });
    }
}
