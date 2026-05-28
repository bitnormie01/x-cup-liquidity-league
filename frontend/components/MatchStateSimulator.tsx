'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Address, Hex } from 'viem';
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { TeamSelector } from '@/components/TeamSelector';
import { xcupRegistryAbi } from '@/lib/abis/xcup-registry';
import { xLayerTestnet } from '@/lib/chains';
import { deployments, shortAddress } from '@/lib/deployments';
import { matchStates, type MatchStateId } from '@/lib/match-states';
import { teams, type Team } from '@/lib/teams';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address;
const COOLDOWN_MS = 3000;

export function MatchStateSimulator() {
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV !== 'production');
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [reason, setReason] = useState('demo');
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const { address, chain, isConnected } = useAccount();
  const isWrongNetwork = isConnected && chain?.id !== xLayerTestnet.id;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      setIsVisible(new URLSearchParams(window.location.search).get('admin') === '1');
    }
  }, []);

  const { data: registryReads, refetch: refetchRegistryReads } = useReadContracts({
    contracts: [
      {
        address: deployments.core.registry,
        abi: xcupRegistryAbi,
        functionName: 'controller',
      },
      {
        address: deployments.core.registry,
        abi: xcupRegistryAbi,
        functionName: 'owner',
      },
    ],
    query: {
      enabled: isVisible,
      refetchInterval: 10000,
    },
  });

  const controller = readResult<Address>(registryReads, 0) ?? ZERO_ADDRESS;
  const owner = readResult<Address>(registryReads, 1) ?? ZERO_ADDRESS;
  const normalizedAddress = address?.toLowerCase();
  const canWrite =
    Boolean(normalizedAddress) &&
    (normalizedAddress === controller.toLowerCase() || normalizedAddress === owner.toLowerCase());

  const { data: hash, error: writeError, isPending: isWalletPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    setCooldownUntil(Date.now() + COOLDOWN_MS);
    void refetchRegistryReads();
    const timer = window.setTimeout(() => setCooldownUntil(0), COOLDOWN_MS);
    return () => window.clearTimeout(timer);
  }, [isSuccess, refetchRegistryReads]);

  const isCooldown = cooldownUntil > Date.now();
  const isBusy = isWalletPending || isConfirming || isCooldown;
  const disabledReason = useMemo(() => {
    if (!isConnected) {
      return 'Connect as controller/owner to use this panel.';
    }
    if (isWrongNetwork) {
      return 'Switch to X Layer testnet to update match state.';
    }
    if (!canWrite) {
      return 'Connect as controller/owner to use this panel.';
    }
    return '';
  }, [canWrite, isConnected, isWrongNetwork]);

  if (!isVisible) {
    return null;
  }

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Match-State Simulator</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Controller-only demo control for registry match states.
          </p>
        </div>
        <span className="w-fit rounded-md bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
          Admin gated
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        <TeamSelector selectedTeam={selectedTeam} onSelect={setSelectedTeam} disabled={isBusy} />

        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <Readout label="Controller" value={shortAddress(controller)} />
          <Readout label="Owner" value={shortAddress(owner)} />
        </div>

        {disabledReason ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            {disabledReason}
          </div>
        ) : null}

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-neutral-700">Reason</span>
          <input
            value={reason}
            disabled={isBusy}
            className="rounded-md border border-line bg-white px-3 py-2 text-base outline-none transition focus:border-pitch disabled:bg-neutral-100"
            onChange={(event) => setReason(event.target.value)}
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(matchStates) as unknown as `${MatchStateId}`[]).map((key) => {
            const state = Number(key) as MatchStateId;
            const meta = matchStates[state];
            return (
              <button
                key={state}
                type="button"
                disabled={!canWrite || isWrongNetwork || isBusy}
                className={`rounded-md border px-3 py-3 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${meta.badgeClassName}`}
                onClick={() => {
                  setCooldownUntil(0);
                  writeContract({
                    address: deployments.core.registry,
                    abi: xcupRegistryAbi,
                    functionName: 'setMatchState',
                    args: [selectedTeam.teamId, state, reason.trim() || 'demo'],
                  });
                }}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${meta.dotClassName}`} />
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>

        <StatusText
          hash={hash}
          isWalletPending={isWalletPending}
          isConfirming={isConfirming}
          isCooldown={isCooldown}
          isSuccess={isSuccess}
          isError={isReceiptError}
          errorMessage={writeError?.message ?? receiptError?.message}
        />
      </div>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfcfa] p-3">
      <p className="text-xs font-semibold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 font-mono text-sm text-neutral-900">{value}</p>
    </div>
  );
}

function StatusText({
  hash,
  isWalletPending,
  isConfirming,
  isCooldown,
  isSuccess,
  isError,
  errorMessage,
}: {
  hash?: Hex;
  isWalletPending: boolean;
  isConfirming: boolean;
  isCooldown: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
}) {
  if (isWalletPending) {
    return <p className="text-sm text-neutral-600">Confirm match-state update in wallet.</p>;
  }
  if (isConfirming) {
    return <p className="text-sm text-neutral-600">Waiting for match-state confirmation.</p>;
  }
  if (isCooldown) {
    return <p className="text-sm text-emerald-700">Update confirmed. Controls cooling down briefly.</p>;
  }
  if (isSuccess) {
    return <p className="text-sm text-emerald-700">Match-state update confirmed.</p>;
  }
  if (isError || errorMessage) {
    return <p className="max-w-xl text-sm text-red-700">{errorMessage ?? 'Match-state update failed.'}</p>;
  }
  if (hash) {
    return <p className="text-sm text-neutral-600">Match-state update submitted.</p>;
  }
  return <p className="text-sm text-neutral-600">Select a team and state to broadcast a registry update.</p>;
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
