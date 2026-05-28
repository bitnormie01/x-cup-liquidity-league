import { xLayerExplorerUrl } from '@/lib/chains';
import { shortAddress } from '@/lib/deployments';
import { formatFee, formatPoints, type LeagueTeamData } from '@/lib/use-league-data';

export function TeamCard({ team }: { team: LeagueTeamData }) {
  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            {team.flag}
          </span>
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
        <Metric label="Active Fee" value={formatFee(team.activeFeeBps)} />
      </dl>

      <div className="mt-4 rounded-md border border-line bg-[#fbfcfa] p-3 text-sm">
        <p className="font-semibold text-neutral-600">Pool ID</p>
        <code className="mt-1 block break-all text-xs text-neutral-900">{team.poolId}</code>
        <a
          className="mt-3 inline-flex font-semibold text-pitch underline-offset-4 hover:underline"
          href={`${xLayerExplorerUrl}/address/${team.token}`}
          rel="noreferrer"
          target="_blank"
        >
          Token explorer
        </a>
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

export function PoolIdLink({ team }: { team: Pick<LeagueTeamData, 'poolId' | 'token'> }) {
  return (
    <div className="flex flex-col gap-1">
      <code className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-800">
        {shortAddress(team.poolId)}
      </code>
      <a
        className="text-xs font-semibold text-pitch underline-offset-4 hover:underline"
        href={`${xLayerExplorerUrl}/address/${team.token}`}
        rel="noreferrer"
        target="_blank"
      >
        Token explorer
      </a>
    </div>
  );
}
