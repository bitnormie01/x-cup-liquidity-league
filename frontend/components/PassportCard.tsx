'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { formatUnits, type Hex } from 'viem';
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { teamPassportAbi } from '@/lib/abis/team-passport';
import { xcupHookAbi } from '@/lib/abis/xcup-hook';
import { xLayerTestnet } from '@/lib/chains';
import { deployments, shortAddress } from '@/lib/deployments';
import { getTeamById, teams, type Team } from '@/lib/teams';
import { TeamLogo, TeamSelector } from './TeamSelector';

const ZERO_BIGINT = BigInt(0);

type PassportTuple =
  | readonly [Hex, bigint, boolean]
  | {
      teamId: Hex;
      mintedAt: bigint;
      exists: boolean;
    };

type ContributionTuple =
  | readonly [bigint, bigint, bigint, bigint]
  | {
      swapPoints: bigint;
      lpPoints: bigint;
      totalPoints: bigint;
      lastActionAt: bigint;
    };

type NormalizedContribution = {
  swapPoints: bigint;
  lpPoints: bigint;
  totalPoints: bigint;
  lastActionAt: bigint;
};

export function PassportCard() {
  const { address, isConnected, chain } = useAccount();
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const isWrongNetwork = isConnected && chain?.id !== xLayerTestnet.id;
  const readsEnabled = Boolean(address) && !isWrongNetwork;

  const {
    data: passportReads,
    refetch: refetchPassport,
    isLoading: isPassportLoading,
  } = useReadContracts({
    contracts: [
      {
        address: deployments.core.teamPassport,
        abi: teamPassportAbi,
        functionName: 'hasPassport',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
      {
        address: deployments.core.teamPassport,
        abi: teamPassportAbi,
        functionName: 'passportOf',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
      {
        address: deployments.core.teamPassport,
        abi: teamPassportAbi,
        functionName: 'tokenIdOf',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
    ],
    query: {
      enabled: readsEnabled,
    },
  });

  const hasPassport = readResult<boolean>(passportReads, 0) ?? false;
  const passport = readResult<PassportTuple>(passportReads, 1);
  const tokenId = readResult<bigint>(passportReads, 2);
  const passportTeamId = getPassportTeamId(passport);
  const mintedTeam = useMemo(() => getTeamById(passportTeamId), [passportTeamId]);

  const {
    data: contribution,
    refetch: refetchContribution,
    isLoading: isContributionLoading,
  } = useReadContract({
    address: deployments.core.hook,
    abi: xcupHookAbi,
    functionName: 'contributions',
    args: [address ?? '0x0000000000000000000000000000000000000000', passportTeamId ?? selectedTeam.teamId],
    query: {
      enabled: readsEnabled && Boolean(passportTeamId),
    },
  });

  const { data: hash, error: writeError, isPending: isWalletPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      void refetchPassport();
      void refetchContribution();
    }
  }, [isSuccess, refetchContribution, refetchPassport]);

  if (!isConnected) {
    return (
      <PassportShell>
        <EmptyState title="Connect wallet to pick a team" detail="Your passport locks one supporter team for this demo." />
      </PassportShell>
    );
  }

  if (isWrongNetwork) {
    return (
      <PassportShell>
        <EmptyState title="Switch to X Layer testnet to mint" detail="Passport minting is only enabled on chain ID 1952." />
      </PassportShell>
    );
  }

  if (hasPassport && mintedTeam) {
    const normalizedContribution = normalizeContribution(contribution);

    return (
      <PassportShell>
        <div className="rounded-md border border-emerald-300 bg-emerald-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-800">Your Team Passport is minted</p>
              <div className="mt-2 flex items-center gap-3">
                <TeamLogo symbol={mintedTeam.symbol} size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-okx">
                    {mintedTeam.name}
                  </h3>
                  <p className="text-sm text-neutral-700">
                    {mintedTeam.symbol} passport #{tokenId?.toString() ?? '--'}
                  </p>
                </div>
              </div>
            </div>
            <span className="w-fit rounded-md bg-pitch px-3 py-1 text-sm font-semibold text-white">
              Soulbound
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <ContributionStat label="Swap points" value={formatPoints(normalizedContribution.swapPoints)} />
          <ContributionStat label="LP points" value={formatPoints(normalizedContribution.lpPoints)} />
          <ContributionStat label="Total points" value={formatPoints(normalizedContribution.totalPoints)} />
        </div>

        <div className="rounded-md border border-line bg-[#fbfcfa] p-3 text-sm text-neutral-700">
          <p>Wallet: {address ? shortAddress(address) : '--'}</p>
          <p>
            Last action:{' '}
            {normalizedContribution.lastActionAt > ZERO_BIGINT
              ? new Date(Number(normalizedContribution.lastActionAt) * 1000).toLocaleString()
              : 'No activity yet'}
          </p>
          {isContributionLoading ? <p className="text-xs text-neutral-500">Refreshing contributions</p> : null}
        </div>
      </PassportShell>
    );
  }

  const isBusy = isWalletPending || isConfirming;

  return (
    <PassportShell>
      <div>
        <p className="mb-3 text-sm font-semibold text-neutral-700">Choose one supporter team</p>
        <TeamSelector selectedTeam={selectedTeam} onSelect={setSelectedTeam} disabled={isBusy} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-neutral-600">
          {isPassportLoading ? 'Checking passport state' : 'One passport per wallet. Transfers are disabled.'}
        </div>
        <button
          type="button"
          disabled={isBusy}
          className="w-fit rounded-md bg-okx px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          onClick={() => {
            writeContract({
              address: deployments.core.teamPassport,
              abi: teamPassportAbi,
              functionName: 'mintPassport',
              args: [selectedTeam.teamId],
            });
          }}
        >
          {isWalletPending ? 'Confirm in wallet' : isConfirming ? 'Minting' : 'Mint Passport'}
        </button>
      </div>

      <PassportStatus
        hash={hash}
        isSuccess={isSuccess}
        isReceiptError={isReceiptError}
        errorMessage={writeError?.message ?? receiptError?.message}
      />
    </PassportShell>
  );
}

function PassportShell({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="border-b border-line pb-4">
        <h2 className="text-xl font-semibold">Pick Your Team</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Mint one soulbound passport so your swaps and support count for that team.
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfcfa] p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600">{detail}</p>
    </div>
  );
}

function ContributionStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfcfa] p-3">
      <p className="text-xs font-semibold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 font-mono text-sm text-neutral-900">{value}</p>
    </div>
  );
}

function PassportStatus({
  hash,
  isSuccess,
  isReceiptError,
  errorMessage,
}: {
  hash?: Hex;
  isSuccess: boolean;
  isReceiptError: boolean;
  errorMessage?: string;
}) {
  if (isSuccess) {
    return <p className="text-sm text-emerald-700">Passport minted. Refreshing passport state.</p>;
  }
  if (isReceiptError || errorMessage) {
    return <p className="text-sm text-red-700">{errorMessage ?? 'Passport mint failed'}</p>;
  }
  if (hash) {
    return <p className="text-sm text-neutral-600">Mint transaction submitted.</p>;
  }
  return null;
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

function getPassportTeamId(passport?: PassportTuple): Hex | undefined {
  if (!passport) {
    return undefined;
  }
  if ('teamId' in passport) {
    return passport.teamId;
  }
  return passport[0];
}

function normalizeContribution(contribution?: ContributionTuple): NormalizedContribution {
  if (!contribution) {
    return {
      swapPoints: ZERO_BIGINT,
      lpPoints: ZERO_BIGINT,
      totalPoints: ZERO_BIGINT,
      lastActionAt: ZERO_BIGINT,
    };
  }
  if ('swapPoints' in contribution) {
    return {
      swapPoints: contribution.swapPoints,
      lpPoints: contribution.lpPoints,
      totalPoints: contribution.totalPoints,
      lastActionAt: contribution.lastActionAt,
    };
  }
  return {
    swapPoints: contribution[0],
    lpPoints: contribution[1],
    totalPoints: contribution[2],
    lastActionAt: contribution[3],
  };
}

function formatPoints(value: bigint) {
  const formatted = formatUnits(value, 18);
  const [whole, fraction = ''] = formatted.split('.');
  const trimmed = fraction.slice(0, 4).replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole;
}
