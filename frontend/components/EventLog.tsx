'use client';

import { useEffect, useMemo, useState } from 'react';
import { parseEventLogs, type Address, type Hex } from 'viem';
import { usePublicClient } from 'wagmi';

import { xcupHookAbi } from '@/lib/abis/xcup-hook';
import { xcupRegistryAbi } from '@/lib/abis/xcup-registry';
import { xLayerExplorerName, xLayerExplorerUrl, xLayerTestnet } from '@/lib/chains';
import { deployments, shortAddress } from '@/lib/deployments';
import { getMatchStateMeta } from '@/lib/match-states';
import { teams } from '@/lib/teams';

const POLL_INTERVAL_MS = 5000;
const BLOCK_WINDOW = BigInt(100);
const MAX_EVENTS = 20;

type EventRow = {
  id: string;
  name: string;
  teamSymbol: string;
  user?: Address;
  details: string;
  txHash: Hex;
  blockNumber: bigint;
  logIndex: number;
};

export function EventLog() {
  const publicClient = usePublicClient({ chainId: xLayerTestnet.id });
  const [events, setEvents] = useState<EventRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    async function poll() {
      if (!publicClient) {
        return;
      }
      try {
        setError('');
        const latestBlock = await publicClient.getBlockNumber();
        const fromBlock = latestBlock > BLOCK_WINDOW ? latestBlock - BLOCK_WINDOW : BigInt(0);
        const [hookLogs, registryLogs] = await Promise.all([
          publicClient.getLogs({
            address: deployments.core.hook,
            fromBlock,
            toBlock: latestBlock,
          }),
          publicClient.getLogs({
            address: deployments.core.registry,
            fromBlock,
            toBlock: latestBlock,
          }),
        ]);
        const rows = [
          ...parseRows(deployments.core.hook, hookLogs, xcupHookAbi),
          ...parseRows(deployments.core.registry, registryLogs, xcupRegistryAbi),
        ]
          .sort((a, b) => {
            if (a.blockNumber === b.blockNumber) {
              return b.logIndex - a.logIndex;
            }
            return a.blockNumber > b.blockNumber ? -1 : 1;
          })
          .slice(0, MAX_EVENTS);

        if (isMounted) {
          setEvents(rows);
          setIsLoading(false);
        }
      } catch (pollError) {
        if (isMounted) {
          setError(pollError instanceof Error ? pollError.message : 'Unable to load events.');
          setIsLoading(false);
        }
      }
    }

    void poll();
    const timer = window.setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, [publicClient]);

  const statusText = useMemo(() => {
    if (isLoading) {
      return 'Loading recent events';
    }
    if (error) {
      return 'Event polling error';
    }
    return `Polling last ${BLOCK_WINDOW.toString()} blocks every ${POLL_INTERVAL_MS / 1000}s`;
  }, [error, isLoading]);

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <h2 className="text-xl font-semibold">Live Activity</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Recent score, fee, anti-wash, and match-state events from X Layer testnet.
          </p>
        </div>
        <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
          {statusText}
        </span>
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</div>
      ) : null}

      {isLoading ? (
        <div className="mt-4 rounded-md border border-line bg-[#fbfcfa] p-4 text-sm text-neutral-600">
          Loading recent contract events
        </div>
      ) : null}

      {!isLoading && !error && events.length === 0 ? (
        <div className="mt-4 rounded-md border border-line bg-[#fbfcfa] p-4 text-sm text-neutral-600">
          No supported hook or registry events found in the recent block window.
        </div>
      ) : null}

      {!isLoading && !error && events.length > 0 ? (
        <div className="mt-4 divide-y divide-line">
          {events.map((event) => (
            <article key={event.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{event.name}</h3>
                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">
                    {event.teamSymbol}
                  </span>
                  {event.user ? (
                    <code className="rounded-md bg-[#fbfcfa] px-2 py-1 text-xs text-neutral-700">
                      {shortAddress(event.user)}
                    </code>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-6 text-neutral-700">{event.details}</p>
              </div>
              <a
                className="w-fit rounded-md border border-line px-3 py-2 text-sm font-semibold text-pitch underline-offset-4 hover:underline"
                href={`${xLayerExplorerUrl}/tx/${event.txHash}`}
                rel="noreferrer"
                target="_blank"
              >
                {xLayerExplorerName} {shortAddress(event.txHash)}
              </a>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function parseRows(address: Address, logs: readonly unknown[], abi: typeof xcupHookAbi | typeof xcupRegistryAbi) {
  const parsed = parseEventLogs({
    abi,
    logs: logs as Parameters<typeof parseEventLogs>[0]['logs'],
    strict: false,
  });

  return parsed
    .filter((event) =>
      ['DynamicFeeApplied', 'TeamPointsAwarded', 'WashPenaltyApplied', 'MatchStateUpdated'].includes(event.eventName),
    )
    .map((event) => {
      const args = event.args as Record<string, unknown>;
      const teamId = typeof args.teamId === 'string' ? args.teamId : '';
      const user = typeof args.user === 'string' ? (args.user as Address) : undefined;
      const txHash = event.transactionHash ?? (`0x${'0'.repeat(64)}` as Hex);
      return {
        id: `${address}-${txHash}-${event.logIndex ?? 0}`,
        name: event.eventName,
        teamSymbol: teamSymbolForId(teamId),
        user,
        details: formatEventDetails(event.eventName, args),
        txHash,
        blockNumber: event.blockNumber ?? BigInt(0),
        logIndex: event.logIndex ?? 0,
      } satisfies EventRow;
    });
}

function formatEventDetails(eventName: string, args: Record<string, unknown>) {
  if (eventName === 'DynamicFeeApplied') {
    return `State ${stateLabel(args.state)}; base ${formatNumber(args.baseFeeBps)} bps, discount ${formatNumber(
      args.discountBps,
    )} bps, penalty ${formatNumber(args.penaltyBps)} bps, final ${formatNumber(args.finalFeeBps)} bps.`;
  }
  if (eventName === 'TeamPointsAwarded') {
    return `${sourceLabel(args.source)} points ${formatNumber(args.points)} from raw amount ${formatNumber(
      args.rawAmount,
    )} at multiplier ${formatNumber(args.multiplierBps)} bps.`;
  }
  if (eventName === 'WashPenaltyApplied') {
    return `Wash reason ${washReasonLabel(args.reason)}; fee penalty ${formatNumber(
      args.feePenaltyBps,
    )} bps at ${formatNumber(args.timestamp)}.`;
  }
  if (eventName === 'MatchStateUpdated') {
    return `State ${stateLabel(args.state)}; reason "${String(args.reason ?? '')}"; updated at ${formatNumber(
      args.updatedAt,
    )}.`;
  }
  return 'Supported event observed.';
}

function teamSymbolForId(teamId: string) {
  return teams.find((team) => team.teamId.toLowerCase() === teamId.toLowerCase())?.symbol ?? 'Unknown team';
}

function stateLabel(value: unknown) {
  return getMatchStateMeta(Number(value ?? 0)).label;
}

function sourceLabel(value: unknown) {
  const labels = ['Swap', 'Liquidity', 'Bonus', 'Penalty'];
  return labels[Number(value ?? 0)] ?? `Source ${String(value)}`;
}

function washReasonLabel(value: unknown) {
  const labels = ['None', 'Cooldown', 'Reversal', 'Burst', 'Low-value spam'];
  return labels[Number(value ?? 0)] ?? `Reason ${String(value)}`;
}

function formatNumber(value: unknown) {
  if (typeof value === 'bigint') {
    return value.toLocaleString('en-US');
  }
  if (typeof value === 'number') {
    return value.toLocaleString('en-US');
  }
  return String(value ?? '--');
}
