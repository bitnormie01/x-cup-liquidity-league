import type { Address, Hex } from 'viem';

import { deployments, type TeamSymbol } from './deployments';

export type Team = {
  symbol: TeamSymbol;
  name: string;
  flag: string;
  teamId: Hex;
  token: Address;
  poolId: Hex;
  currency0: Address;
  currency1: Address;
};

const flagBySymbol: Record<TeamSymbol, string> = {
  BRA: '🇧🇷',
  ARG: '🇦🇷',
  FRA: '🇫🇷',
  GER: '🇩🇪',
};

export const teams = deployments.teams.map((team) => ({
  symbol: team.symbol,
  name: team.name,
  flag: flagBySymbol[team.symbol],
  teamId: team.teamId,
  token: team.token,
  poolId: team.poolId,
  currency0: team.currency0,
  currency1: team.currency1,
})) satisfies Team[];

export const getTeamById = (teamId?: string) => teams.find((team) => team.teamId === teamId);

export const getTeamBySymbol = (symbol: TeamSymbol) => teams.find((team) => team.symbol === symbol);
