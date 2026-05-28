import { shortAddress } from '@/lib/deployments';
import { formatFee, formatPoints, type LeagueTeamData } from '@/lib/use-league-data';
import { TeamLogo } from './TeamSelector';

export function TeamCard({ team }: { team: LeagueTeamData }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <TeamLogo symbol={team.symbol} size="md" />
          <div>
            <h3 className="text-lg font-semibold">{team.symbol}</h3>
            <p className="text-sm text-neutral-600">{team.name}</p>
          </div>
        </div>
        <MatchStateBadge team={team} compact />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        <Metric label="Total" value={formatPoints(team.totalPoints)} />
        <Metric label="Swap" value={formatPoints(team.swapPoints)} />
        <Metric label="LP" value={formatPoints(team.lpPoints)} />
      </dl>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <Metric label="Fans" value={formatPoints(team.fanCount)} />
        <Metric label="Current Fee" value={formatFee(team.activeFeeBps)} />
      </dl>

      <div className="mt-4 rounded-md border border-line bg-[#fbfcfa] p-3 text-sm">
        <p className="font-semibold text-neutral-700">Pool proof</p>
        <p className="mt-1 text-neutral-600">
          Pool ID {shortAddress(team.poolId)} is listed with full contract details in the Proof section.
        </p>
      </div>
    </article>
  );
}

export function MatchStateBadge({
  team,
  compact = false,
}: {
  team: Pick<LeagueTeamData, 'matchStateBadgeClassName' | 'matchStateDotClassName' | 'matchStateLabel' | 'matchStateShortLabel'>;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold ${team.matchStateBadgeClassName}`}
    >
      <span className={`h-2 w-2 rounded-full ${team.matchStateDotClassName}`} />
      {compact ? team.matchStateShortLabel : team.matchStateLabel}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfcfa] p-3">
      <dt className="text-xs font-semibold uppercase text-neutral-500">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-neutral-900">{value}</dd>
    </div>
  );
}
