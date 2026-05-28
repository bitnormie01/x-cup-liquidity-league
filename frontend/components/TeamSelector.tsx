'use client';

import type { TeamSymbol } from '@/lib/deployments';
import { teams, type Team } from '@/lib/teams';

const badgeClassBySymbol: Record<TeamSymbol, string> = {
  BRA: 'bg-emerald-700 text-yellow-200 ring-yellow-300',
  ARG: 'bg-sky-100 text-sky-800 ring-sky-300',
  FRA: 'bg-blue-700 text-white ring-red-400',
  GER: 'bg-neutral-900 text-yellow-200 ring-red-500',
};

const sizeClassBySize = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
};

export function TeamSelector({
  selectedTeam,
  onSelect,
  disabled = false,
}: {
  selectedTeam: Team;
  onSelect: (team: Team) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {teams.map((team) => {
        const isSelected = selectedTeam.symbol === team.symbol;

        return (
          <button
            key={team.symbol}
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            className={`flex items-center gap-3 rounded-md border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isSelected
                ? 'border-pitch bg-emerald-50 text-pitch'
                : 'border-line bg-white text-okx hover:border-emerald-300 hover:bg-emerald-50'
            }`}
            onClick={() => onSelect(team)}
          >
            <TeamLogo symbol={team.symbol} size="sm" />
            <span>
              <span className="block font-semibold">{team.symbol}</span>
              <span className="block text-sm text-neutral-600">{team.name}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function TeamLogo({
  symbol,
  size = 'md',
}: {
  symbol: TeamSymbol;
  size?: keyof typeof sizeClassBySize;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-md font-bold ring-2 ring-inset ${sizeClassBySize[size]} ${badgeClassBySymbol[symbol]}`}
    >
      {symbol}
    </span>
  );
}
