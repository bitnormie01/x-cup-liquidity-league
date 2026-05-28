// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IHooks} from "@uniswap/v4-core/interfaces/IHooks.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {Hooks} from "@uniswap/v4-core/libraries/Hooks.sol";
import {LPFeeLibrary} from "@uniswap/v4-core/libraries/LPFeeLibrary.sol";
import {BalanceDelta, BalanceDeltaLibrary} from "@uniswap/v4-core/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "@uniswap/v4-core/types/BeforeSwapDelta.sol";
import {PoolId} from "@uniswap/v4-core/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/types/PoolKey.sol";
import {TeamPassport} from "./TeamPassport.sol";
import {XCupLeagueRegistry} from "./XCupLeagueRegistry.sol";

contract XCupLiquidityLeagueHook is IHooks, Ownable {
    IPoolManager public immutable poolManager;
    XCupLeagueRegistry public immutable registry;
    TeamPassport public immutable passport;

    uint24 public constant MIN_FEE_BPS = 25;
    uint24 public constant MAX_FEE_BPS = 200;
    uint24 public constant PASSPORT_DISCOUNT_BPS = 5;
    uint24 public constant WASH_PENALTY_BPS = 25;

    mapping(XCupLeagueRegistry.MatchState => uint24) public feeForState;

    struct FeeBreakdown {
        uint24 baseFeeBps;
        uint24 discountBps;
        uint24 penaltyBps;
        uint24 finalFeeBps;
    }

    error FeeOutOfRange(uint24 feeBps);
    error HookNotImplemented();

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

    constructor(IPoolManager _pm, XCupLeagueRegistry _registry, TeamPassport _passport, address _owner)
        Ownable(_owner)
    {
        poolManager = _pm;
        registry = _registry;
        passport = _passport;

        feeForState[XCupLeagueRegistry.MatchState.PRE_MATCH] = 30;
        feeForState[XCupLeagueRegistry.MatchState.LIVE_NORMAL] = 50;
        feeForState[XCupLeagueRegistry.MatchState.GOAL_SHOCK] = 150;
        feeForState[XCupLeagueRegistry.MatchState.RED_CARD] = 100;
        feeForState[XCupLeagueRegistry.MatchState.PENALTY] = 125;
        feeForState[XCupLeagueRegistry.MatchState.FINAL_WHISTLE] = 75;
    }

    function getHookPermissions() public pure returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: true,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: true,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveLiquidityReturnDelta: false
        });
    }

    function setFeeForState(XCupLeagueRegistry.MatchState state, uint24 feeBps) external onlyOwner {
        if (feeBps < MIN_FEE_BPS || feeBps > MAX_FEE_BPS) {
            revert FeeOutOfRange(feeBps);
        }

        feeForState[state] = feeBps;
    }

    function beforeInitialize(address, PoolKey calldata, uint160) external pure returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure returns (bytes4) {
        revert HookNotImplemented();
    }

    function beforeAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata)
        external
        pure
        returns (bytes4)
    {
        revert HookNotImplemented();
    }

    function afterAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes calldata hookData
    ) external pure returns (bytes4, BalanceDelta) {
        return _afterAddLiquidity(sender, key, params, delta, feesAccrued, hookData);
    }

    function beforeRemoveLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        bytes calldata
    ) external pure returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterRemoveLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) external pure returns (bytes4, BalanceDelta) {
        revert HookNotImplemented();
    }

    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external returns (bytes4, BeforeSwapDelta, uint24) {
        return _beforeSwap(sender, key, params, hookData);
    }

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external pure returns (bytes4, int128) {
        return _afterSwap(sender, key, params, delta, hookData);
    }

    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        revert HookNotImplemented();
    }

    function afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        revert HookNotImplemented();
    }

    function _beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata,
        bytes calldata hookData
    ) internal returns (bytes4, BeforeSwapDelta, uint24) {
        PoolId poolId = key.toId();
        if (!registry.isRegisteredPool(poolId)) {
            return (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
        }

        bytes32 teamId = registry.getTeamByPool(poolId);
        XCupLeagueRegistry.MatchState state = registry.getMatchStateByPool(poolId);
        address user = _resolveUser(sender, hookData);
        uint24 base = feeForState[state];
        uint24 discount = passport.isSupporter(user, teamId) ? PASSPORT_DISCOUNT_BPS : 0;
        uint24 penalty = 0; // TODO(P04-03): apply anti-wash penalty.
        uint24 finalFee = _computeFee(base, discount, penalty);

        emit DynamicFeeApplied(poolId, teamId, user, state, base, discount, penalty, finalFee);

        return
            (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, finalFee | LPFeeLibrary.OVERRIDE_FEE_FLAG);
    }

    function _afterSwap(address, PoolKey calldata, IPoolManager.SwapParams calldata, BalanceDelta, bytes calldata)
        internal
        pure
        returns (bytes4, int128)
    {
        // TODO(P04-02): implement swap scoring.
        return (IHooks.afterSwap.selector, int128(0));
    }

    function _afterAddLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) internal pure returns (bytes4, BalanceDelta) {
        // TODO(P04-02): implement LP scoring.
        return (IHooks.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
    }

    function _resolveUser(address sender, bytes calldata hookData) internal pure returns (address) {
        if (hookData.length >= 20) {
            return address(bytes20(hookData[:20]));
        }

        return sender;
    }

    function _computeFee(uint24 base, uint24 discount, uint24 penalty) internal pure returns (uint24) {
        int256 raw = int256(uint256(base)) - int256(uint256(discount)) + int256(uint256(penalty));

        if (raw < int256(uint256(MIN_FEE_BPS))) {
            return MIN_FEE_BPS;
        }
        if (raw > int256(uint256(MAX_FEE_BPS))) {
            return MAX_FEE_BPS;
        }

        // forge-lint: disable-next-line(unsafe-typecast)
        return uint24(uint256(raw));
    }
}
