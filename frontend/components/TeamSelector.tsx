'use client';

import { teams, type Team } from '@/lib/teams';

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
            <span className="text-2xl" aria-hidden="true">
              {team.flag}
            </span>
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
