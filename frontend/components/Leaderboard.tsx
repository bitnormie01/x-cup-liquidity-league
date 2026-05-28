'use client';

import { MatchStateBadge, TeamCard } from '@/components/TeamCard';
import { TeamLogo } from '@/components/TeamSelector';
import { formatFee, formatPoints, useLeagueData } from '@/lib/use-league-data';

export function Leaderboard() {
  const { rows, isLoading, isError, error, refreshIntervalMs } = useLeagueData();

  return (
    <>
      <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
        <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Live League</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Team rankings update from swaps, liquidity support, fan passports, and match state.
            </p>
          </div>
          <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
            Refreshes every {refreshIntervalMs / 1000}s
          </span>
        </div>

        {isError ? (
          <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            {error instanceof Error ? error.message : 'Unable to load leaderboard reads.'}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-4 rounded-md border border-line bg-[#fbfcfa] p-4 text-sm text-neutral-600">
            Loading live team data
          </div>
        ) : null}

        {!isLoading && !isError && rows.length === 0 ? (
          <div className="mt-4 rounded-md border border-line bg-[#fbfcfa] p-4 text-sm text-neutral-600">
            No team data loaded.
          </div>
        ) : null}

        {!isLoading && !isError && rows.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-neutral-500">
                  <Th>Rank</Th>
                  <Th>Team</Th>
                  <Th align="right">Points</Th>
                  <Th align="right">Fans</Th>
                  <Th>Status</Th>
                  <Th>Current Fee</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((team) => (
                  <tr key={team.symbol} className="border-t border-line">
                    <Td>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-pitch text-sm font-semibold text-white">
                        {team.rank}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <TeamLogo symbol={team.symbol} size="sm" />
                        <div>
                          <p className="font-semibold">{team.symbol}</p>
                          <p className="text-xs text-neutral-600">{team.name}</p>
                        </div>
                      </div>
                    </Td>
                    <Td align="right">{formatPoints(team.totalPoints)}</Td>
                    <Td align="right">{formatPoints(team.fanCount)}</Td>
                    <Td>
                      <MatchStateBadge team={team} />
                    </Td>
                    <Td>{formatFee(team.activeFeeBps)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {!isLoading && !isError && rows.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {rows.map((team) => (
            <TeamCard key={team.symbol} team={team} />
          ))}
        </section>
      ) : null}
    </>
  );
}

function Th({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th className={`border-b border-line px-3 py-3 font-semibold ${align === 'right' ? 'text-right' : 'text-left'}`}>
      {children}
    </th>
  );
}

function Td({ children, align = 'left' }: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <td className={`border-b border-line px-3 py-4 align-middle ${align === 'right' ? 'text-right font-mono' : ''}`}>
      {children}
    </td>
  );
}
