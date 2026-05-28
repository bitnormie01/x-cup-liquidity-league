// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IHooks} from "@uniswap/v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/libraries/LPFeeLibrary.sol";
import {Currency} from "@uniswap/v4-core/types/Currency.sol";
import {BalanceDelta} from "@uniswap/v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta} from "@uniswap/v4-core/types/BeforeSwapDelta.sol";
import {PoolId} from "@uniswap/v4-core/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/types/PoolKey.sol";
import {Vm} from "forge-std/Vm.sol";
import {Test} from "forge-std/Test.sol";
import {TeamPassport} from "../src/TeamPassport.sol";
import {XCupLeagueRegistry} from "../src/XCupLeagueRegistry.sol";
import {XCupLiquidityLeagueHook} from "../src/XCupLiquidityLeagueHook.sol";

contract HookAntiWashTest is Test {
    XCupLeagueRegistry internal registry;
    TeamPassport internal passport;
    XCupLiquidityLeagueHook internal hook;

    address internal owner = address(0xA11CE);
    address internal poolManager = address(0xBEEF);
    address internal alice = address(0xA11);
    address internal fanToken = address(0xA0D);
    address internal quoteToken = address(0xB0A);

    bytes32 internal constant BRA = "BRA";
    uint256 internal constant BASE_TIME = 1_000;
    bytes32 internal constant WASH_EVENT_SIG =
        keccak256("WashPenaltyApplied(bytes32,bytes32,address,uint8,uint24,uint256)");

    PoolKey internal key;
    PoolId internal poolId;

    event DynamicFeeApplied(
        PoolId indexed poolId,
        bytes32 indexed teamId,
        address indexed user,
        XCupLeagueRegistry.MatchState state,
        uint24 baseFeeBps,
        uint24 discountBps,
        uint24 penaltyBps,
        uint24 finalFeeBps
    );
    event WashPenaltyApplied(
        PoolId indexed poolId,
        bytes32 indexed teamId,
        address indexed user,
        XCupLiquidityLeagueHook.WashReason reason,
        uint24 feePenaltyBps,
        uint256 timestamp
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

        vm.startPrank(owner);
        registry.registerTeam(BRA, "Brazil", "BRA", fanToken, "ipfs://bra");
        registry.registerPool(poolId, BRA, key.currency0, key.currency1);
        vm.stopPrank();
    }

    function test_FirstSwapIsNotFlagged() public {
        vm.warp(BASE_TIME);

        vm.recordLogs();
        _afterSwap(alice, _swapParams(true, -1e18));
        Vm.Log[] memory logs = vm.getRecordedLogs();

        assertFalse(_containsWashPenalty(logs));

        vm.warp(BASE_TIME + 181);
        XCupLiquidityLeagueHook.AntiWashStatus memory status =
            hook.previewAntiWash(alice, poolId, _swapParams(true, -1e18));

        assertFalse(status.isFlagged);
        assertEq(uint8(status.reason), uint8(XCupLiquidityLeagueHook.WashReason.NONE));
        assertEq(status.penaltyBps, 0);
        assertEq(status.pointsMultiplierBps, uint16(hook.DEFAULT_MULTIPLIER_BPS()));
    }

    function test_CooldownViolationFlagsSecondSwap() public {
        vm.warp(BASE_TIME);
        _afterSwap(alice, _swapParams(true, -1e18));

        vm.warp(BASE_TIME + 30);
        vm.recordLogs();
        _afterSwap(alice, _swapParams(true, -1e18));
        Vm.Log[] memory logs = vm.getRecordedLogs();

        assertTrue(_containsWashPenalty(logs));

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        XCupLiquidityLeagueHook.UserContribution memory contribution = hook.getUserContribution(alice, BRA);
        XCupLiquidityLeagueHook.AntiWashStatus memory status =
            hook.previewAntiWash(alice, poolId, _swapParams(true, -1e18));

        assertEq(teamScore.swapPoints, 1);
        assertEq(contribution.swapPoints, 1);
        assertTrue(status.isFlagged);
        assertEq(uint8(status.reason), uint8(XCupLiquidityLeagueHook.WashReason.COOLDOWN));
        assertEq(status.pointsMultiplierBps, 0);
    }

    function test_ReversalViolationFlags() public {
        vm.warp(BASE_TIME);
        _afterSwap(alice, _swapParams(true, -1e18));

        vm.warp(BASE_TIME + 100);
        vm.expectEmit(true, true, true, true, address(hook));
        emit WashPenaltyApplied(
            poolId, BRA, alice, XCupLiquidityLeagueHook.WashReason.REVERSAL, hook.WASH_PENALTY_BPS(), block.timestamp
        );
        _afterSwap(alice, _swapParams(false, -1e18));

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        assertEq(teamScore.swapPoints, 1);
    }

    function test_BurstViolationFlagsSixthSwap() public {
        vm.warp(BASE_TIME);
        for (uint256 i = 0; i < 5; i++) {
            _afterSwap(alice, _swapParams(true, -1e18));
            vm.warp(block.timestamp + 70);
        }

        vm.expectEmit(true, true, true, true, address(hook));
        emit WashPenaltyApplied(
            poolId, BRA, alice, XCupLiquidityLeagueHook.WashReason.BURST, hook.WASH_PENALTY_BPS(), block.timestamp
        );
        _afterSwap(alice, _swapParams(true, -1e18));

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        (,, uint32 swapsInWindow,,) = hook.userPoolActivity(alice, poolId);

        assertEq(teamScore.swapPoints, 5);
        assertEq(swapsInWindow, 6);
    }

    function test_BeforeSwapAppliesPenaltyAndStripsDiscountForFlaggedUser() public {
        vm.warp(BASE_TIME);
        vm.prank(alice);
        passport.mintPassport(BRA);
        _afterSwap(alice, _swapParams(true, -1e18));

        vm.warp(BASE_TIME + 30);
        vm.expectEmit(true, true, true, true, address(hook));
        emit DynamicFeeApplied(
            poolId, BRA, alice, XCupLeagueRegistry.MatchState.PRE_MATCH, 30, 0, hook.WASH_PENALTY_BPS(), 55
        );

        vm.prank(poolManager);
        (bytes4 selector, BeforeSwapDelta delta, uint24 fee) = hook.beforeSwap(alice, key, _swapParams(true, -1e18), "");

        assertEq(selector, IHooks.beforeSwap.selector);
        assertEq(BeforeSwapDelta.unwrap(delta), 0);
        assertEq(fee & LPFeeLibrary.REMOVE_OVERRIDE_MASK, 55);
        assertTrue(fee & LPFeeLibrary.OVERRIDE_FEE_FLAG != 0);
    }

    function test_PreviewAntiWashIsViewOnly() public {
        vm.warp(BASE_TIME);
        _afterSwap(alice, _swapParams(true, -1e18));

        (uint64 lastSwapAtBefore, uint64 windowStartAtBefore, uint32 swapsInWindowBefore, bool lastZeroForOneBefore,) =
            hook.userPoolActivity(alice, poolId);

        vm.warp(BASE_TIME + 30);
        hook.previewAntiWash(alice, poolId, _swapParams(true, -1e18));

        (uint64 lastSwapAtAfter, uint64 windowStartAtAfter, uint32 swapsInWindowAfter, bool lastZeroForOneAfter,) =
            hook.userPoolActivity(alice, poolId);

        assertEq(lastSwapAtAfter, lastSwapAtBefore);
        assertEq(windowStartAtAfter, windowStartAtBefore);
        assertEq(swapsInWindowAfter, swapsInWindowBefore);
        assertEq(lastZeroForOneAfter, lastZeroForOneBefore);
    }

    function test_BurstWindowRollsAfter10Minutes() public {
        vm.warp(BASE_TIME);
        for (uint256 i = 0; i < 5; i++) {
            _afterSwap(alice, _swapParams(true, -1e18));
            vm.warp(block.timestamp + 70);
        }

        vm.warp(BASE_TIME + hook.ANTI_WASH_BURST_WINDOW_SEC());
        vm.recordLogs();
        _afterSwap(alice, _swapParams(true, -1e18));
        Vm.Log[] memory logs = vm.getRecordedLogs();

        XCupLiquidityLeagueHook.TeamScore memory teamScore = hook.getTeamScore(BRA);
        (, uint64 windowStartAt, uint32 swapsInWindow,,) = hook.userPoolActivity(alice, poolId);

        assertFalse(_containsWashPenalty(logs));
        assertEq(teamScore.swapPoints, 6);
        assertEq(windowStartAt, uint64(block.timestamp));
        assertEq(swapsInWindow, 1);
    }

    function test_FlaggedSwapStillUpdatesActivityTimestamps() public {
        vm.warp(BASE_TIME);
        _afterSwap(alice, _swapParams(true, -1e18));

        vm.warp(BASE_TIME + 30);
        _afterSwap(alice, _swapParams(true, -2e18));

        (uint64 lastSwapAt,, uint32 swapsInWindow, bool lastZeroForOne, uint256 lastAmountAbs) =
            hook.userPoolActivity(alice, poolId);

        assertEq(lastSwapAt, uint64(block.timestamp));
        assertEq(swapsInWindow, 2);
        assertTrue(lastZeroForOne);
        assertEq(lastAmountAbs, 2e18);
    }

    function _afterSwap(address user, IPoolManager.SwapParams memory params) internal {
        vm.prank(poolManager);
        hook.afterSwap(user, key, params, BalanceDelta.wrap(0), "");
    }

    function _containsWashPenalty(Vm.Log[] memory logs) internal pure returns (bool) {
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].topics.length > 0 && logs[i].topics[0] == WASH_EVENT_SIG) {
                return true;
            }
        }
        return false;
    }

    function _swapParams(bool zeroForOne, int256 amountSpecified)
        internal
        pure
        returns (IPoolManager.SwapParams memory)
    {
        return IPoolManager.SwapParams({zeroForOne: zeroForOne, amountSpecified: amountSpecified, sqrtPriceLimitX96: 1});
    }
}
