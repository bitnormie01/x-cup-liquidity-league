'use client';

import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';

import { teamPassportAbi } from './abis/team-passport';
import { xcupHookAbi } from './abis/xcup-hook';
import { xcupRegistryAbi } from './abis/xcup-registry';
import { deployments } from './deployments';
import { getMatchStateMeta } from './match-states';
import { teams, type Team } from './teams';

const ZERO_BIGINT = BigInt(0);
const MATCH_STATE_IDS = [0, 1, 2, 3, 4, 5] as const;
const REFRESH_INTERVAL_MS = 5000;

type ScoreTuple =
  | readonly [bigint, bigint, bigint, bigint]
  | {
      swapPoints: bigint;
      lpPoints: bigint;
      totalPoints: bigint;
      lastUpdatedAt: bigint;
    };

type MatchStateTuple =
  | readonly [number, string, bigint, boolean]
  | {
      state: number;
      reason: string;
      updatedAt: bigint;
      exists: boolean;
    };

export type LeagueTeamData = Team & {
  rank: number;
  swapPoints: bigint;
  lpPoints: bigint;
  totalPoints: bigint;
  lastUpdatedAt: bigint;
  fanCount: bigint;
  matchStateId: number;
  matchStateLabel: string;
  matchStateShortLabel: string;
  matchStateBadgeClassName: string;
  matchStateDotClassName: string;
  matchReason: string;
  matchUpdatedAt: bigint;
  activeFeeBps: number;
};

export function useLeagueData() {
  const readOptions = {
    refetchInterval: REFRESH_INTERVAL_MS,
  };

  const {
    data: teamReads,
    isLoading: isTeamReadsLoading,
    isError: isTeamReadsError,
    error: teamReadsError,
    refetch: refetchTeamReads,
  } = useReadContracts({
    contracts: teams.flatMap((team) => [
      {
        address: deployments.core.hook,
        abi: xcupHookAbi,
        functionName: 'getTeamScore',
        args: [team.teamId],
      },
      {
        address: deployments.core.registry,
        abi: xcupRegistryAbi,
        functionName: 'matchStateOfTeam',
        args: [team.teamId],
      },
      {
        address: deployments.core.teamPassport,
        abi: teamPassportAbi,
        functionName: 'teamFanCount',
        args: [team.teamId],
      },
    ]),
    query: readOptions,
  });

  const {
    data: feeReads,
    isLoading: isFeeReadsLoading,
    isError: isFeeReadsError,
    error: feeReadsError,
  } = useReadContracts({
    contracts: MATCH_STATE_IDS.map((state) => ({
      address: deployments.core.hook,
      abi: xcupHookAbi,
      functionName: 'feeForState',
      args: [state],
    })),
    query: readOptions,
  });

  const rows = useMemo(() => {
    const feesByState = new Map<number, number>();
    MATCH_STATE_IDS.forEach((state, index) => {
      const fee = readResult<number | bigint>(feeReads, index);
      feesByState.set(state, Number(fee ?? 0));
    });

    const unsorted = teams.map((team, index) => {
      const offset = index * 3;
      const score = normalizeScore(readResult<ScoreTuple>(teamReads, offset));
      const matchState = normalizeMatchState(readResult<MatchStateTuple>(teamReads, offset + 1));
      const fanCount = readResult<bigint>(teamReads, offset + 2) ?? ZERO_BIGINT;
      const matchMeta = getMatchStateMeta(matchState.state);

      return {
        ...team,
        rank: 0,
        swapPoints: score.swapPoints,
        lpPoints: score.lpPoints,
        totalPoints: score.totalPoints,
        lastUpdatedAt: score.lastUpdatedAt,
        fanCount,
        matchStateId: matchMeta.id,
        matchStateLabel: matchMeta.label,
        matchStateShortLabel: matchMeta.shortLabel,
        matchStateBadgeClassName: matchMeta.badgeClassName,
        matchStateDotClassName: matchMeta.dotClassName,
        matchReason: matchState.reason,
        matchUpdatedAt: matchState.updatedAt,
        activeFeeBps: feesByState.get(matchState.state) ?? 0,
      } satisfies LeagueTeamData;
    });

    return unsorted
      .sort(compareLeagueRows)
      .map((row, index) => ({
        ...row,
        rank: index + 1,
      }));
  }, [feeReads, teamReads]);

  return {
    rows,
    isLoading: isTeamReadsLoading || isFeeReadsLoading,
    isError: isTeamReadsError || isFeeReadsError,
    error: teamReadsError ?? feeReadsError,
    refetch: refetchTeamReads,
    refreshIntervalMs: REFRESH_INTERVAL_MS,
  };
}

export function compareLeagueRows(a: LeagueTeamData, b: LeagueTeamData) {
  const totalCompare = compareBigIntDesc(a.totalPoints, b.totalPoints);
  if (totalCompare !== 0) {
    return totalCompare;
  }
  const lpCompare = compareBigIntDesc(a.lpPoints, b.lpPoints);
  if (lpCompare !== 0) {
    return lpCompare;
  }
  const fanCompare = compareBigIntDesc(a.fanCount, b.fanCount);
  if (fanCompare !== 0) {
    return fanCompare;
  }
  return a.symbol.localeCompare(b.symbol);
}

export function formatPoints(value: bigint) {
  return value.toLocaleString('en-US');
}

export function formatFee(valueBps: number) {
  return `${valueBps} bps (${(valueBps / 100).toFixed(2)}%)`;
}

function compareBigIntDesc(a: bigint, b: bigint) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

function readResult<T>(data: unknown, index: number): T | undefined {
  if (!Array.isArray(data)) {
    return undefined;
  }
  const item = data[index];
  if (!item || typeof item !== 'object' || !('result' in item)) {
    return undefined;
  }
  return item.result as T;
}

function normalizeScore(score?: ScoreTuple) {
  if (!score) {
    return {
      swapPoints: ZERO_BIGINT,
      lpPoints: ZERO_BIGINT,
      totalPoints: ZERO_BIGINT,
      lastUpdatedAt: ZERO_BIGINT,
    };
  }
  if ('totalPoints' in score) {
    return {
      swapPoints: score.swapPoints,
      lpPoints: score.lpPoints,
      totalPoints: score.totalPoints,
      lastUpdatedAt: score.lastUpdatedAt,
    };
  }
  return {
    swapPoints: score[0],
    lpPoints: score[1],
    totalPoints: score[2],
    lastUpdatedAt: score[3],
  };
}

function normalizeMatchState(matchState?: MatchStateTuple) {
  if (!matchState) {
    return {
      state: 0,
      reason: '',
      updatedAt: ZERO_BIGINT,
      exists: false,
    };
  }
  if ('state' in matchState) {
    return {
      state: Number(matchState.state),
      reason: matchState.reason,
      updatedAt: matchState.updatedAt,
      exists: matchState.exists,
    };
  }
  return {
    state: Number(matchState[0]),
    reason: matchState[1],
    updatedAt: matchState[2],
    exists: matchState[3],
  };
}
