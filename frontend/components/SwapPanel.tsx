'use client';

import { useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits, type Address, type Hex } from 'viem';
import { useAccount, useReadContract, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { TeamSelector } from '@/components/TeamSelector';
import { erc20FaucetAbi } from '@/lib/abis/erc20-faucet';
import { v4PoolActionHelperAbi } from '@/lib/abis/v4-pool-action-helper';
import { xcupHookAbi } from '@/lib/abis/xcup-hook';
import { xcupRegistryAbi } from '@/lib/abis/xcup-registry';
import { xLayerTestnet } from '@/lib/chains';
import { deployments } from '@/lib/deployments';
import { getMatchStateMeta } from '@/lib/match-states';
import {
  addressToRawHookData,
  buildPoolKey,
  getInputSymbol,
  getInputToken,
  getOutputSymbol,
  getSwapZeroForOne,
  getSqrtPriceLimitX96,
  type SwapDirection,
} from '@/lib/pools';
import { teams, type Team } from '@/lib/teams';
import { formatFee } from '@/lib/use-league-data';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address;
const MATCH_STATE_IDS = [0, 1, 2, 3, 4, 5] as const;

type TransactionKind = 'approve' | 'swap';

export function SwapPanel() {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [direction, setDirection] = useState<SwapDirection>('xusdToTeam');
  const [amount, setAmount] = useState('');
  const [transactionKind, setTransactionKind] = useState<TransactionKind>('swap');
  const { address, chain, isConnected } = useAccount();
  const isWrongNetwork = isConnected && chain?.id !== xLayerTestnet.id;

  const inputToken = getInputToken(selectedTeam, direction);
  const inputSymbol = getInputSymbol(selectedTeam, direction);
  const outputSymbol = getOutputSymbol(selectedTeam, direction);
  const userAddress = address ?? ZERO_ADDRESS;

  const {
    data: tokenReads,
    refetch: refetchTokenReads,
    isLoading: isReadingToken,
  } = useReadContracts({
    contracts: [
      {
        address: inputToken,
        abi: erc20FaucetAbi,
        functionName: 'balanceOf',
        args: [userAddress],
      },
      {
        address: inputToken,
        abi: erc20FaucetAbi,
        functionName: 'allowance',
        args: [userAddress, deployments.core.liquiditySeeder],
      },
      {
        address: inputToken,
        abi: erc20FaucetAbi,
        functionName: 'decimals',
      },
    ],
    query: {
      enabled: Boolean(address) && !isWrongNetwork,
    },
  });

  const feePreview = useActiveFeePreview(selectedTeam);
  const { data: hash, error: writeError, isPending: isWalletPending, writeContract } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  const balance = readResult<bigint>(tokenReads, 0) ?? BigInt(0);
  const allowance = readResult<bigint>(tokenReads, 1) ?? BigInt(0);
  const decimals = readResult<number>(tokenReads, 2) ?? 18;
  const parsedAmount = useMemo(() => parseTokenAmount(amount, decimals), [amount, decimals]);
  const hasValidAmount = parsedAmount !== undefined && parsedAmount > BigInt(0);
  const hasAllowance = hasValidAmount ? allowance >= parsedAmount : false;
  const hasBalance = hasValidAmount ? balance >= parsedAmount : false;
  const zeroForOne = getSwapZeroForOne(selectedTeam, direction);
  const isBusy = isWalletPending || isConfirming;
  const isDisabled = !isConnected || isWrongNetwork || isBusy || !hasValidAmount || !hasBalance;

  useEffect(() => {
    if (isSuccess) {
      void refetchTokenReads();
    }
  }, [isSuccess, refetchTokenReads]);

  useEffect(() => {
    setTransactionKind('swap');
  }, [amount, direction, selectedTeam.symbol]);

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Support With a Swap</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Swap xUSD into a team token, or swap back, and watch the league react.
          </p>
        </div>
        <span className="w-fit rounded-md bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
          {feePreview.label}
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        <TeamSelector selectedTeam={selectedTeam} onSelect={setSelectedTeam} disabled={isBusy} />

        <div className="grid grid-cols-2 gap-2 rounded-md border border-line bg-[#fbfcfa] p-1">
          <DirectionButton
            isSelected={direction === 'xusdToTeam'}
            disabled={isBusy}
            label={`xUSD -> ${selectedTeam.symbol}`}
            onClick={() => setDirection('xusdToTeam')}
          />
          <DirectionButton
            isSelected={direction === 'teamToXusd'}
            disabled={isBusy}
            label={`${selectedTeam.symbol} -> xUSD`}
            onClick={() => setDirection('teamToXusd')}
          />
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-neutral-700">Input amount</span>
          <input
            value={amount}
            disabled={isBusy}
            inputMode="decimal"
            placeholder={`0.0 ${inputSymbol}`}
            className="rounded-md border border-line bg-white px-3 py-2 text-base outline-none transition focus:border-pitch disabled:bg-neutral-100"
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <div className="grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
          <Readout label={`${inputSymbol} balance`} value={`${formatToken(balance, decimals)} ${inputSymbol}`} />
          <Readout label="Approved for helper" value={`${formatToken(allowance, decimals)} ${inputSymbol}`} />
          <Readout label="You send" value={inputSymbol} />
          <Readout label="You receive" value={outputSymbol} />
        </div>

        {!hasBalance && hasValidAmount ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Amount exceeds the connected wallet balance.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={isDisabled}
            className="min-h-11 min-w-40 rounded-md bg-okx px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            onClick={() => {
              if (!parsedAmount) {
                return;
              }
              if (!hasAllowance) {
                setTransactionKind('approve');
                writeContract({
                  address: inputToken,
                  abi: erc20FaucetAbi,
                  functionName: 'approve',
                  args: [deployments.core.liquiditySeeder, parsedAmount],
                });
                return;
              }
              if (!address) {
                return;
              }
              setTransactionKind('swap');
              writeContract({
                address: deployments.core.liquiditySeeder,
                abi: v4PoolActionHelperAbi,
                functionName: 'swap',
                args: [
                  address,
                  buildPoolKey(selectedTeam),
                  {
                    zeroForOne,
                    amountSpecified: -parsedAmount,
                    sqrtPriceLimitX96: getSqrtPriceLimitX96(zeroForOne),
                  },
                  addressToRawHookData(address),
                ],
              });
            }}
          >
            {buttonLabel({ hasAllowance, inputSymbol, isWalletPending, isConfirming, outputSymbol, transactionKind })}
          </button>
          <StatusText
            hash={hash}
            hasAllowance={hasAllowance}
            inputSymbol={inputSymbol}
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

function DirectionButton({
  isSelected,
  disabled,
  label,
  onClick,
}: {
  isSelected: boolean;
  disabled: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={isSelected}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${
        isSelected ? 'bg-pitch text-white' : 'bg-white text-neutral-700 hover:bg-emerald-50'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function useActiveFeePreview(team: Team) {
  const { data: matchStateRead } = useReadContract({
    address: deployments.core.registry,
    abi: xcupRegistryAbi,
    functionName: 'matchStateOfTeam',
    args: [team.teamId],
    query: {
      refetchInterval: 5000,
    },
  });
  const { data: feeReads } = useReadContracts({
    contracts: MATCH_STATE_IDS.map((state) => ({
        address: deployments.core.hook,
        abi: xcupHookAbi,
        functionName: 'feeForState',
        args: [state],
      })),
    query: {
      refetchInterval: 5000,
    },
  });
  const matchState = normalizeMatchState(matchStateRead);
  const feeIndex = MATCH_STATE_IDS.findIndex((state) => state === matchState.state);
  const activeFee = readResult<number | bigint>(feeReads, feeIndex >= 0 ? feeIndex : 0);
  const meta = getMatchStateMeta(matchState.state);

  return {
    label: `${meta.shortLabel}: ${formatFee(Number(activeFee ?? 0))}`,
  };
}

type MatchStateTuple =
  | readonly [number, string, bigint, boolean]
  | {
      state: number;
      reason: string;
      updatedAt: bigint;
      exists: boolean;
    };

function normalizeMatchState(matchState?: MatchStateTuple) {
  if (!matchState) {
    return { state: 0 };
  }
  if ('state' in matchState) {
    return { state: Number(matchState.state) };
  }
  return { state: Number(matchState[0]) };
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
  hasAllowance,
  inputSymbol,
  kind,
  isSuccess,
  isError,
  errorMessage,
  isReading,
}: {
  hash?: Hex;
  hasAllowance: boolean;
  inputSymbol: string;
  kind: TransactionKind;
  isSuccess: boolean;
  isError: boolean;
  errorMessage?: string;
  isReading: boolean;
}) {
  if (isSuccess) {
    if (kind === 'approve') {
      return (
        <p className="text-sm text-emerald-700">
          {hasAllowance ? 'Approval ready. Press Swap next.' : 'Approval confirmed. Refreshing allowance.'}
        </p>
      );
    }
    return <p className="text-sm text-emerald-700">Swap confirmed. League data will refresh shortly.</p>;
  }
  if (isError || errorMessage) {
    return <p className="max-w-xl text-sm text-red-700">{errorMessage ?? 'Transaction failed'}</p>;
  }
  if (hash) {
    return <p className="text-sm text-neutral-600">{kind === 'approve' ? 'Approval submitted' : 'Swap submitted'}</p>;
  }
  if (isReading) {
    return <p className="text-sm text-neutral-600">Refreshing balance and allowance</p>;
  }
  return <p className="text-sm text-neutral-600">{hasAllowance ? 'Ready to swap.' : `Approve ${inputSymbol} first.`}</p>;
}

function buttonLabel({
  hasAllowance,
  inputSymbol,
  isWalletPending,
  isConfirming,
  outputSymbol,
  transactionKind,
}: {
  hasAllowance: boolean;
  inputSymbol: string;
  isWalletPending: boolean;
  isConfirming: boolean;
  outputSymbol: string;
  transactionKind: TransactionKind;
}) {
  if (isWalletPending) {
    return 'Confirm in wallet';
  }
  if (isConfirming) {
    return transactionKind === 'approve' ? 'Approving' : 'Swapping';
  }
  return hasAllowance ? `Swap to ${outputSymbol}` : `Approve ${inputSymbol}`;
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
