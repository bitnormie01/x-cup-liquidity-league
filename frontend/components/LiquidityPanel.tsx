'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits, type Address, type Hex } from 'viem';
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { TeamSelector } from '@/components/TeamSelector';
import { erc20FaucetAbi } from '@/lib/abis/erc20-faucet';
import { v4PoolActionHelperAbi } from '@/lib/abis/v4-pool-action-helper';
import { xLayerTestnet } from '@/lib/chains';
import { deployments } from '@/lib/deployments';
import {
  FULL_RANGE_TICK_LOWER,
  FULL_RANGE_TICK_UPPER,
  ZERO_BYTES32,
  addressToRawHookData,
  buildPoolKey,
} from '@/lib/pools';
import { teams, type Team } from '@/lib/teams';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address;

type TransactionKind = 'approveXusd' | 'approveTeam' | 'liquidity';

export function LiquidityPanel() {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [amount, setAmount] = useState('');
  const [transactionKind, setTransactionKind] = useState<TransactionKind>('liquidity');
  const { address, chain, isConnected } = useAccount();
  const isWrongNetwork = isConnected && chain?.id !== xLayerTestnet.id;
  const userAddress = address ?? ZERO_ADDRESS;

  const {
    data: tokenReads,
    refetch: refetchTokenReads,
    isLoading: isReadingToken,
  } = useReadContracts({
    contracts: [
      {
        address: deployments.tokens.xUSD,
        abi: erc20FaucetAbi,
        functionName: 'balanceOf',
        args: [userAddress],
      },
      {
        address: deployments.tokens.xUSD,
        abi: erc20FaucetAbi,
        functionName: 'allowance',
        args: [userAddress, deployments.core.liquiditySeeder],
      },
      {
        address: deployments.tokens.xUSD,
        abi: erc20FaucetAbi,
        functionName: 'decimals',
      },
      {
        address: selectedTeam.token,
        abi: erc20FaucetAbi,
        functionName: 'balanceOf',
        args: [userAddress],
      },
      {
        address: selectedTeam.token,
        abi: erc20FaucetAbi,
        functionName: 'allowance',
        args: [userAddress, deployments.core.liquiditySeeder],
      },
      {
        address: selectedTeam.token,
        abi: erc20FaucetAbi,
        functionName: 'decimals',
      },
    ],
    query: {
      enabled: Boolean(address) && !isWrongNetwork,
    },
  });

  const { data: hash, error: writeError, isPending: isWalletPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const xusdBalance = readResult<bigint>(tokenReads, 0) ?? BigInt(0);
  const xusdAllowance = readResult<bigint>(tokenReads, 1) ?? BigInt(0);
  const xusdDecimals = readResult<number>(tokenReads, 2) ?? 18;
  const teamBalance = readResult<bigint>(tokenReads, 3) ?? BigInt(0);
  const teamAllowance = readResult<bigint>(tokenReads, 4) ?? BigInt(0);
  const teamDecimals = readResult<number>(tokenReads, 5) ?? 18;

  const parsedXusdAmount = useMemo(() => parseTokenAmount(amount, xusdDecimals), [amount, xusdDecimals]);
  const parsedTeamAmount = useMemo(() => parseTokenAmount(amount, teamDecimals), [amount, teamDecimals]);
  const hasValidAmount =
    parsedXusdAmount !== undefined &&
    parsedTeamAmount !== undefined &&
    parsedXusdAmount > BigInt(0) &&
    parsedTeamAmount > BigInt(0);
  const hasXusdAllowance = hasValidAmount ? xusdAllowance >= parsedXusdAmount : false;
  const hasTeamAllowance = hasValidAmount ? teamAllowance >= parsedTeamAmount : false;
  const hasBalances = hasValidAmount ? xusdBalance >= parsedXusdAmount && teamBalance >= parsedTeamAmount : false;
  const isBusy = isWalletPending || isConfirming;
  const isDisabled = !isConnected || isWrongNetwork || isBusy || !hasValidAmount || !hasBalances;

  useEffect(() => {
    if (isSuccess) {
      void refetchTokenReads();
    }
  }, [isSuccess, refetchTokenReads]);

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Liquidity Support</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Demo full-range support using matching xUSD and team-token amounts.
          </p>
        </div>
        <span className="w-fit rounded-md bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-800">
          Full range
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        <TeamSelector selectedTeam={selectedTeam} onSelect={setSelectedTeam} disabled={isBusy} />

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-neutral-700">xUSD side amount</span>
          <input
            value={amount}
            disabled={isBusy}
            inputMode="decimal"
            placeholder="0.0 xUSD"
            className="rounded-md border border-line bg-white px-3 py-2 text-base outline-none transition focus:border-pitch disabled:bg-neutral-100"
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
          MVP liquidity uses the same displayed amount for xUSD and {selectedTeam.symbol}. The helper call sends
          `liquidityDelta = parsed xUSD amount` across ticks {FULL_RANGE_TICK_LOWER} to {FULL_RANGE_TICK_UPPER}.
        </div>

        <div className="grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
          <Readout label="xUSD balance" value={`${formatToken(xusdBalance, xusdDecimals)} xUSD`} />
          <Readout label="xUSD allowance" value={`${formatToken(xusdAllowance, xusdDecimals)} xUSD`} />
          <Readout
            label={`${selectedTeam.symbol} balance`}
            value={`${formatToken(teamBalance, teamDecimals)} ${selectedTeam.symbol}`}
          />
          <Readout
            label={`${selectedTeam.symbol} allowance`}
            value={`${formatToken(teamAllowance, teamDecimals)} ${selectedTeam.symbol}`}
          />
        </div>

        {!hasBalances && hasValidAmount ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Amount exceeds the connected wallet balance on at least one side.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={isDisabled}
            className="rounded-md bg-okx px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            onClick={() => {
              if (!parsedXusdAmount || !parsedTeamAmount) {
                return;
              }
              if (!hasXusdAllowance) {
                setTransactionKind('approveXusd');
                writeContract({
                  address: deployments.tokens.xUSD,
                  abi: erc20FaucetAbi,
                  functionName: 'approve',
                  args: [deployments.core.liquiditySeeder, parsedXusdAmount],
                });
                return;
              }
              if (!hasTeamAllowance) {
                setTransactionKind('approveTeam');
                writeContract({
                  address: selectedTeam.token,
                  abi: erc20FaucetAbi,
                  functionName: 'approve',
                  args: [deployments.core.liquiditySeeder, parsedTeamAmount],
                });
                return;
              }
              if (!address) {
                return;
              }
              setTransactionKind('liquidity');
              writeContract({
                address: deployments.core.liquiditySeeder,
                abi: v4PoolActionHelperAbi,
                functionName: 'modifyLiquidity',
                args: [
                  address,
                  buildPoolKey(selectedTeam),
                  {
                    tickLower: FULL_RANGE_TICK_LOWER,
                    tickUpper: FULL_RANGE_TICK_UPPER,
                    liquidityDelta: parsedXusdAmount,
                    salt: ZERO_BYTES32,
                  },
                  addressToRawHookData(address),
                ],
              });
            }}
          >
            {buttonLabel({
              hasXusdAllowance,
              hasTeamAllowance,
              isWalletPending,
              isConfirming,
              transactionKind,
            })}
          </button>
          <StatusText
            hash={hash}
            kind={transactionKind}
            isSuccess={isSuccess}
            isError={isReceiptError}
            errorMessage={writeError?.message ?? receiptError?.message}
            isReading={isReadingToken}
          />
        </div>
      </div>
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfcfa] p-3">
      <p className="text-xs font-semibold uppercase text-neutral-500">{label}</p>
      <p className="mt-1 break-words font-mono text-sm text-neutral-900">{value}</p>
    </div>
  );
}

function StatusText({
  hash,
  kind,
  isSuccess,
  isError,
  errorMessage,
  isReading,
}: {
  hash?: Hex;
  kind: TransactionKind;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  isReading: boolean;
}) {
  if (isSuccess) {
    return <p className="text-sm text-emerald-700">{successLabel(kind)}</p>;
  }
  if (isError || errorMessage) {
    return <p className="max-w-xl text-sm text-red-700">{errorMessage ?? 'Transaction failed'}</p>;
  }
  if (hash) {
    return <p className="text-sm text-neutral-600">{submittedLabel(kind)}</p>;
  }
  if (isReading) {
    return <p className="text-sm text-neutral-600">Refreshing balances and allowances</p>;
  }
  return <p className="text-sm text-neutral-600">Approve both tokens if needed, then add support.</p>;
}

function buttonLabel({
  hasXusdAllowance,
  hasTeamAllowance,
  isWalletPending,
  isConfirming,
  transactionKind,
}: {
  hasXusdAllowance: boolean;
  hasTeamAllowance: boolean;
  isWalletPending: boolean;
  isConfirming: boolean;
  transactionKind: TransactionKind;
}) {
  if (isWalletPending) {
    return 'Confirm in wallet';
  }
  if (isConfirming) {
    return pendingLabel(transactionKind);
  }
  if (!hasXusdAllowance) {
    return 'Approve xUSD';
  }
  if (!hasTeamAllowance) {
    return 'Approve team token';
  }
  return 'Add support';
}

function pendingLabel(kind: TransactionKind) {
  if (kind === 'approveXusd') {
    return 'Approving xUSD';
  }
  if (kind === 'approveTeam') {
    return 'Approving team token';
  }
  return 'Adding support';
}

function submittedLabel(kind: TransactionKind) {
  if (kind === 'approveXusd') {
    return 'xUSD approval submitted';
  }
  if (kind === 'approveTeam') {
    return 'Team-token approval submitted';
  }
  return 'Liquidity support submitted';
}

function successLabel(kind: TransactionKind) {
  if (kind === 'approveXusd') {
    return 'xUSD approval confirmed';
  }
  if (kind === 'approveTeam') {
    return 'Team-token approval confirmed';
  }
  return 'Liquidity support confirmed';
}

function parseTokenAmount(value: string, decimals: number) {
  if (!value.trim()) {
    return undefined;
  }
  try {
    return parseUnits(value, decimals);
  } catch {
    return undefined;
  }
}

function formatToken(value: bigint, decimals: number) {
  const formatted = formatUnits(value, decimals);
  const [whole, fraction = ''] = formatted.split('.');
  const trimmed = fraction.slice(0, 4).replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole;
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
