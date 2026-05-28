'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

import { shortAddress } from '@/lib/deployments';

type EthereumWindow = Window & {
  ethereum?: unknown;
};

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [hasInjectedWallet, setHasInjectedWallet] = useState(false);

  useEffect(() => {
    setHasInjectedWallet(Boolean((window as EthereumWindow).ethereum));
  }, []);

  const injectedConnector = useMemo(
    () => connectors.find((connector) => connector.id === 'injected') ?? connectors[0],
    [connectors],
  );

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-okx">
          {shortAddress(address)}
        </span>
        <button
          className="rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
          type="button"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        className="rounded-md bg-okx px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        type="button"
        disabled={!hasInjectedWallet || !injectedConnector || isPending}
        onClick={() => {
          if (injectedConnector) {
            connect({ connector: injectedConnector });
          }
        }}
      >
        {isPending ? 'Connecting' : hasInjectedWallet ? 'Connect Wallet' : 'No Wallet Detected'}
      </button>
      {error ? <p className="max-w-72 text-xs text-red-700">{error.message}</p> : null}
    </div>
  );
}
