// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {IERC20Minimal} from "@uniswap/v4-core/interfaces/external/IERC20Minimal.sol";
import {IUnlockCallback} from "@uniswap/v4-core/interfaces/callback/IUnlockCallback.sol";
import {IPoolManager} from "@uniswap/v4-core/interfaces/IPoolManager.sol";
import {Currency, CurrencyLibrary} from "@uniswap/v4-core/types/Currency.sol";
import {BalanceDelta, BalanceDeltaLibrary} from "@uniswap/v4-core/types/BalanceDelta.sol";
import {PoolKey} from "@uniswap/v4-core/types/PoolKey.sol";

contract V4PoolActionHelper is IUnlockCallback {
    using CurrencyLibrary for Currency;
    using BalanceDeltaLibrary for BalanceDelta;

    enum Action {
        MODIFY_LIQUIDITY,
        SWAP
    }

    struct ModifyLiquidityData {
        address payer;
        PoolKey key;
        IPoolManager.ModifyLiquidityParams params;
        bytes hookData;
    }

    struct SwapData {
        address payer;
        PoolKey key;
        IPoolManager.SwapParams params;
        bytes hookData;
    }

    IPoolManager public immutable manager;

    error NotPoolManager(address caller);
    error ERC20TransferFailed(address token, address from, address to, uint256 amount);

    constructor(IPoolManager manager_) {
        manager = manager_;
    }

    function modifyLiquidity(
        address payer,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external returns (BalanceDelta delta) {
        bytes memory result = manager.unlock(
            abi.encode(Action.MODIFY_LIQUIDITY, abi.encode(ModifyLiquidityData(payer, key, params, hookData)))
        );
        return abi.decode(result, (BalanceDelta));
    }

    function swap(address payer, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData)
        external
        returns (BalanceDelta delta)
    {
        bytes memory result =
            manager.unlock(abi.encode(Action.SWAP, abi.encode(SwapData(payer, key, params, hookData))));
        return abi.decode(result, (BalanceDelta));
    }

    function unlockCallback(bytes calldata data) external override returns (bytes memory) {
        if (msg.sender != address(manager)) {
            revert NotPoolManager(msg.sender);
        }

        (Action action, bytes memory encodedData) = abi.decode(data, (Action, bytes));

        if (action == Action.MODIFY_LIQUIDITY) {
            ModifyLiquidityData memory modifyData = abi.decode(encodedData, (ModifyLiquidityData));
            (BalanceDelta delta,) = manager.modifyLiquidity(modifyData.key, modifyData.params, modifyData.hookData);
            _settleDelta(modifyData.key, modifyData.payer, delta);
            return abi.encode(delta);
        }

        SwapData memory swapData = abi.decode(encodedData, (SwapData));
        BalanceDelta swapDelta = manager.swap(swapData.key, swapData.params, swapData.hookData);
        _settleDelta(swapData.key, swapData.payer, swapDelta);
        return abi.encode(swapDelta);
    }

    function _settleDelta(PoolKey memory key, address payer, BalanceDelta delta) internal {
        int128 amount0 = delta.amount0();
        int128 amount1 = delta.amount1();

        if (amount0 < 0) _settle(key.currency0, payer, _abs(amount0));
        if (amount1 < 0) _settle(key.currency1, payer, _abs(amount1));
        if (amount0 > 0) manager.take(key.currency0, payer, _abs(amount0));
        if (amount1 > 0) manager.take(key.currency1, payer, _abs(amount1));
    }

    function _settle(Currency currency, address payer, uint256 amount) internal {
        if (currency.isAddressZero()) {
            manager.settle{value: amount}();
            return;
        }

        manager.sync(currency);
        IERC20Minimal token = IERC20Minimal(Currency.unwrap(currency));
        if (payer == address(this)) {
            if (!token.transfer(address(manager), amount)) {
                revert ERC20TransferFailed(address(token), address(this), address(manager), amount);
            }
        } else {
            if (!token.transferFrom(payer, address(manager), amount)) {
                revert ERC20TransferFailed(address(token), payer, address(manager), amount);
            }
        }
        manager.settle();
    }

    function _abs(int128 amount) internal pure returns (uint256 result) {
        int256 value = int256(amount);
        assembly ("memory-safe") {
            let mask := sar(255, value)
            result := sub(xor(value, mask), mask)
        }
    }
}
