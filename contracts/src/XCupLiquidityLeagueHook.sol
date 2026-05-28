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
    uint256 public constant POINT_UNIT = 1e18;
    uint256 public constant LP_POINT_UNIT = 1e18;
    uint256 public constant LP_WEIGHT_BPS = 15000;
    uint256 public constant LOYALTY_MULTIPLIER_BPS = 12000;
    uint256 public constant DEFAULT_MULTIPLIER_BPS = 10000;

    mapping(XCupLeagueRegistry.MatchState => uint24) public feeForState;
    mapping(bytes32 => TeamScore) public scores;
    mapping(address => mapping(bytes32 => UserContribution)) public contributions;

    enum PointSource {
        SWAP,
        LIQUIDITY,
        BONUS,
        PENALTY
    }

    struct TeamScore {
        uint256 swapPoints;
        uint256 lpPoints;
        uint256 totalPoints;
        uint64 lastUpdatedAt;
    }

    struct UserContribution {
        uint256 swapPoints;
        uint256 lpPoints;
        uint256 totalPoints;
        uint64 lastActionAt;
    }

    struct FeeBreakdown {
        uint24 baseFeeBps;
        uint24 discountBps;
        uint24 penaltyBps;
        uint24 finalFeeBps;
    }

    error FeeOutOfRange(uint24 feeBps);
    error HookNotImplemented();
    error CallerNotPoolManager();

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

    event TeamPointsAwarded(
        PoolId indexed poolId,
        bytes32 indexed teamId,
        address indexed user,
        PointSource source,
        uint256 rawAmount,
        uint256 multiplierBps,
        uint256 points
    );

    modifier onlyPoolManager() {
        if (msg.sender != address(poolManager)) {
            revert CallerNotPoolManager();
        }
        _;
    }

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

    function getTeamScore(bytes32 teamId) external view returns (TeamScore memory) {
        return scores[teamId];
    }

    function getUserContribution(address user, bytes32 teamId) external view returns (UserContribution memory) {
        return contributions[user][teamId];
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
    ) external onlyPoolManager returns (bytes4, BalanceDelta) {
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
    ) external onlyPoolManager returns (bytes4, BeforeSwapDelta, uint24) {
        return _beforeSwap(sender, key, params, hookData);
    }

    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external onlyPoolManager returns (bytes4, int128) {
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

    /// @dev MVP scoring uses absolute `amountSpecified` as normalized volume; quote-aware normalization is deferred.
    function _afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta,
        bytes calldata hookData
    ) internal returns (bytes4, int128) {
        PoolId poolId = key.toId();
        if (!registry.isRegisteredPool(poolId)) {
            return (IHooks.afterSwap.selector, int128(0));
        }

        address user = _resolveUser(sender, hookData);
        bytes32 teamId = registry.getTeamByPool(poolId);

        uint256 normalizedVolume = _absInt256(params.amountSpecified);
        uint256 loyaltyMult = passport.isSupporter(user, teamId) ? LOYALTY_MULTIPLIER_BPS : DEFAULT_MULTIPLIER_BPS;
        uint256 washMult = DEFAULT_MULTIPLIER_BPS; // TODO(P04-03): replace with anti-wash multiplier.
        // forge-lint: disable-next-line(divide-before-multiply)
        uint256 points = (normalizedVolume * loyaltyMult / 10_000) * washMult / 10_000 / POINT_UNIT;

        TeamScore storage ts = scores[teamId];
        ts.swapPoints += points;
        ts.totalPoints += points;
        ts.lastUpdatedAt = uint64(block.timestamp);

        UserContribution storage uc = contributions[user][teamId];
        uc.swapPoints += points;
        uc.totalPoints += points;
        uc.lastActionAt = uint64(block.timestamp);

        emit TeamPointsAwarded(poolId, teamId, user, PointSource.SWAP, normalizedVolume, loyaltyMult, points);

        return (IHooks.afterSwap.selector, int128(0));
    }

    /// @dev MVP scoring normalizes positive `liquidityDelta` directly to points.
    function _afterAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta,
        BalanceDelta,
        bytes calldata hookData
    ) internal returns (bytes4, BalanceDelta) {
        PoolId poolId = key.toId();
        if (!registry.isRegisteredPool(poolId)) {
            return (IHooks.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
        }
        if (params.liquidityDelta <= 0) {
            return (IHooks.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
        }

        address user = _resolveUser(sender, hookData);
        bytes32 teamId = registry.getTeamByPool(poolId);

        // forge-lint: disable-next-line(unsafe-typecast)
        uint256 normalizedLiquidity = uint256(params.liquidityDelta);
        uint256 points = normalizedLiquidity * LP_WEIGHT_BPS / 10_000 / LP_POINT_UNIT;

        TeamScore storage ts = scores[teamId];
        ts.lpPoints += points;
        ts.totalPoints += points;
        ts.lastUpdatedAt = uint64(block.timestamp);

        UserContribution storage uc = contributions[user][teamId];
        uc.lpPoints += points;
        uc.totalPoints += points;
        uc.lastActionAt = uint64(block.timestamp);

        emit TeamPointsAwarded(poolId, teamId, user, PointSource.LIQUIDITY, normalizedLiquidity, LP_WEIGHT_BPS, points);

        return (IHooks.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
    }

    function _resolveUser(address sender, bytes calldata hookData) internal pure returns (address) {
        if (hookData.length >= 20) {
            return address(bytes20(hookData[:20]));
        }

        return sender;
    }

    function _absInt256(int256 v) internal pure returns (uint256) {
        if (v < 0) {
            // forge-lint: disable-next-line(unsafe-typecast)
            return uint256(-v);
        }

        // forge-lint: disable-next-line(unsafe-typecast)
        return uint256(v);
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
