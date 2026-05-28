export type MatchStateId = 0 | 1 | 2 | 3 | 4 | 5;

export type MatchStateMeta = {
  id: number;
  label: string;
  shortLabel: string;
  badgeClassName: string;
  dotClassName: string;
};

export const matchStates: Record<MatchStateId, MatchStateMeta> = {
  0: {
    id: 0,
    label: 'Pre-match',
    shortLabel: 'Pre',
    badgeClassName: 'border-neutral-300 bg-neutral-100 text-neutral-800',
    dotClassName: 'bg-neutral-500',
  },
  1: {
    id: 1,
    label: 'Live normal',
    shortLabel: 'Live',
    badgeClassName: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    dotClassName: 'bg-emerald-600',
  },
  2: {
    id: 2,
    label: 'Goal shock',
    shortLabel: 'Goal',
    badgeClassName: 'border-red-300 bg-red-50 text-red-800',
    dotClassName: 'bg-red-600',
  },
  3: {
    id: 3,
    label: 'Red card',
    shortLabel: 'Red',
    badgeClassName: 'border-orange-300 bg-orange-50 text-orange-800',
    dotClassName: 'bg-orange-600',
  },
  4: {
    id: 4,
    label: 'Penalty',
    shortLabel: 'Penalty',
    badgeClassName: 'border-purple-300 bg-purple-50 text-purple-800',
    dotClassName: 'bg-purple-600',
  },
  5: {
    id: 5,
    label: 'Final whistle',
    shortLabel: 'Final',
    badgeClassName: 'border-blue-300 bg-blue-50 text-blue-800',
    dotClassName: 'bg-blue-600',
  },
};

export const unknownMatchState: MatchStateMeta = {
  id: -1,
  label: 'Unknown',
  shortLabel: 'Unknown',
  badgeClassName: 'border-neutral-300 bg-white text-neutral-700',
  dotClassName: 'bg-neutral-400',
};

export const getMatchStateMeta = (state?: number) => {
  if (state === undefined || !(state in matchStates)) {
    return unknownMatchState;
  }
  return matchStates[state as MatchStateId];
};
