'use client';

import { useState } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

import { xLayerTestnet } from '@/lib/chains';

export function NetworkBadge() {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [switchError, setSwitchError] = useState<string | null>(null);

  if (!isConnected) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
        Wallet disconnected
      </div>
    );
  }

  const isCorrectNetwork = chain?.id === xLayerTestnet.id;

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div
        className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${
          isCorrectNetwork
            ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
            : 'border-red-300 bg-red-50 text-red-800'
        }`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isCorrectNetwork ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        />
        {isCorrectNetwork ? 'X Layer Testnet' : chain?.name ?? 'Wrong network'}
      </div>
      {!isCorrectNetwork ? (
        <button
          className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={isPending}
          onClick={() => {
            setSwitchError(null);
            try {
              switchChain(
                { chainId: xLayerTestnet.id },
                {
                  onError: (error) => setSwitchError(error.message),
                },
              );
            } catch (error) {
              setSwitchError(error instanceof Error ? error.message : 'Switch request failed.');
            }
          }}
        >
          {isPending ? 'Switching' : 'Switch to X Layer Testnet'}
        </button>
      ) : null}
      {switchError ? <p className="max-w-80 text-xs text-red-700">{switchError}</p> : null}
    </div>
  );
}
