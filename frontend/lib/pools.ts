import type { Address, Hex } from 'viem';

import { deployments } from './deployments';
import type { Team } from './teams';

export const DYNAMIC_FEE_FLAG = 8388608;
export const TICK_SPACING = 60;
export const ZERO_FOR_ONE_SQRT_PRICE_LIMIT_X96 = BigInt(4295128740);
export const ONE_FOR_ZERO_SQRT_PRICE_LIMIT_X96 = BigInt(
  '1461446703485210103287273052203988822378723970341',
);
export const FULL_RANGE_TICK_LOWER = -887220;
export const FULL_RANGE_TICK_UPPER = 887220;
export const ZERO_BYTES32 = `0x${'0'.repeat(64)}` as Hex;

export type PoolKey = {
  currency0: Address;
  currency1: Address;
  fee: number;
  tickSpacing: number;
  hooks: Address;
};

export type SwapDirection = 'xusdToTeam' | 'teamToXusd';

export function buildPoolKey(team: Team): PoolKey {
  return {
    currency0: team.currency0,
    currency1: team.currency1,
    fee: DYNAMIC_FEE_FLAG,
    tickSpacing: TICK_SPACING,
    hooks: deployments.core.hook,
  };
}

export function getInputToken(team: Team, direction: SwapDirection) {
  return direction === 'xusdToTeam' ? deployments.tokens.xUSD : team.token;
}

export function getOutputSymbol(team: Team, direction: SwapDirection) {
  return direction === 'xusdToTeam' ? team.symbol : 'xUSD';
}

export function getInputSymbol(team: Team, direction: SwapDirection) {
  return direction === 'xusdToTeam' ? 'xUSD' : team.symbol;
}

export function getSwapZeroForOne(team: Team, direction: SwapDirection) {
  const inputToken = getInputToken(team, direction).toLowerCase();
  return team.currency0.toLowerCase() === inputToken;
}

export function getSqrtPriceLimitX96(zeroForOne: boolean) {
  return zeroForOne ? ZERO_FOR_ONE_SQRT_PRICE_LIMIT_X96 : ONE_FOR_ZERO_SQRT_PRICE_LIMIT_X96;
}

export function addressToRawHookData(address: Address) {
  return address as Hex;
}
