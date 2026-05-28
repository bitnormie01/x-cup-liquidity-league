'use client';

import { useEffect } from 'react';
import { formatUnits, type Address, type Hex } from 'viem';
import { useAccount, useReadContracts, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { erc20FaucetAbi } from '@/lib/abis/erc20-faucet';
import { xLayerTestnet } from '@/lib/chains';
import { deployments } from '@/lib/deployments';
import { teams } from '@/lib/teams';

type FaucetToken = {
  symbol: string;
  name: string;
  address: Address;
};

const faucetTokens: FaucetToken[] = [
  {
    symbol: 'xUSD',
    name: 'X Cup Demo USD',
    address: deployments.tokens.xUSD,
  },
  ...teams.map((team) => ({
    symbol: team.symbol,
    name: `${team.name} Fan Token`,
    address: team.token,
  })),
];

const ZERO_BIGINT = BigInt(0);

export function FaucetPanel() {
  const { isConnected, chain } = useAccount();
  const isWrongNetwork = isConnected && chain?.id !== xLayerTestnet.id;

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Faucet</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Claim demo xUSD and team tokens for the connected wallet.
          </p>
        </div>
        <span className="w-fit rounded-md bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
          4 hour cooldown
        </span>
      </div>

      <div className="mt-4 divide-y divide-line">
        {faucetTokens.map((token) => (
          <FaucetTokenRow key={token.symbol} token={token} isWrongNetwork={isWrongNetwork} />
        ))}
      </div>
    </section>
  );
}

function FaucetTokenRow({ token, isWrongNetwork }: { token: FaucetToken; isWrongNetwork: boolean }) {
  const { address, isConnected } = useAccount();
  const { data, refetch, isLoading: isReading } = useReadContracts({
    contracts: [
      {
        address: token.address,
        abi: erc20FaucetAbi,
        functionName: 'balanceOf',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
      {
        address: token.address,
        abi: erc20FaucetAbi,
        functionName: 'FAUCET_AMOUNT',
      },
      {
        address: token.address,
        abi: erc20FaucetAbi,
        functionName: 'FAUCET_COOLDOWN',
      },
      {
        address: token.address,
        abi: erc20FaucetAbi,
        functionName: 'lastFaucetAt',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
      {
        address: token.address,
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

  useEffect(() => {
    if (isSuccess) {
      void refetch();
    }
  }, [isSuccess, refetch]);

  const balance = readResult<bigint>(data, 0);
  const faucetAmount = readResult<bigint>(data, 1);
  const cooldown = readResult<bigint>(data, 2);
  const lastFaucetAt = readResult<bigint>(data, 3);
  const decimals = readResult<number>(data, 4) ?? 18;

  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const nextAvailableAt =
    lastFaucetAt && cooldown && lastFaucetAt > ZERO_BIGINT
      ? lastFaucetAt + cooldown
      : ZERO_BIGINT;
  const cooldownRemaining =
    nextAvailableAt > nowSeconds ? Number(nextAvailableAt - nowSeconds) : 0;
  const isCooldownActive = cooldownRemaining > 0;
  const isBusy = isWalletPending || isConfirming;
  const isDisabled = !isConnected || isWrongNetwork || isBusy || isCooldownActive;

  return (
    <div className="grid gap-3 py-4 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{token.symbol}</h3>
          <span className="text-sm text-neutral-600">{token.name}</span>
        </div>
        <p className="mt-1 text-sm text-neutral-600">
          Balance: {formatTokenAmount(balance, decimals)} {token.symbol}
        </p>
      </div>

      <div className="text-sm text-neutral-700">
        <p>
          Faucet amount: {formatTokenAmount(faucetAmount, decimals)} {token.symbol}
        </p>
        <p className={isCooldownActive ? 'font-medium text-amber-800' : 'text-emerald-700'}>
          {isCooldownActive
            ? `Available in ${formatDuration(cooldownRemaining)}`
            : isConnected
              ? 'Ready to claim'
              : 'Connect wallet to claim'}
        </p>
        {isReading && isConnected ? <p className="text-xs text-neutral-500">Refreshing reads</p> : null}
      </div>

      <div className="flex flex-col items-start gap-2 lg:items-end">
        <button
          type="button"
          disabled={isDisabled}
          className="rounded-md bg-okx px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
          onClick={() => {
            if (!address) {
              return;
            }
            writeContract({
              address: token.address,
              abi: erc20FaucetAbi,
              functionName: 'faucetMint',
              args: [address],
            });
          }}
        >
          {isWalletPending ? 'Confirm in wallet' : isConfirming ? 'Claiming' : 'Claim'}
        </button>
        <TransactionStatus
          hash={hash}
          isSuccess={isSuccess}
          isReceiptError={isReceiptError}
          errorMessage={writeError?.message ?? receiptError?.message}
        />
      </div>
    </div>
  );
}

function TransactionStatus({
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
    return <p className="max-w-72 text-xs text-emerald-700">Claim confirmed</p>;
  }
  if (isReceiptError || errorMessage) {
    return <p className="max-w-72 text-xs text-red-700">{errorMessage ?? 'Claim failed'}</p>;
  }
  if (hash) {
    return <p className="max-w-72 text-xs text-neutral-600">Transaction submitted</p>;
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

function formatTokenAmount(value: bigint | undefined, decimals: number) {
  if (value === undefined) {
    return '--';
  }
  const formatted = formatUnits(value, decimals);
  const [whole, fraction = ''] = formatted.split('.');
  const trimmed = fraction.slice(0, 4).replace(/0+$/, '');
  return trimmed ? `${whole}.${trimmed}` : whole;
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.ceil((totalSeconds % 3600) / 60);
  if (hours <= 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}
