'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

import { TeamSelector } from '@/components/TeamSelector';
import { xLayerTestnet } from '@/lib/chains';
import { teams, type Team } from '@/lib/teams';

export function LiquidityPanel() {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const { chain, isConnected } = useAccount();
  const isWrongNetwork = isConnected && chain?.id !== xLayerTestnet.id;

  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Add Support</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Liquidity support is proven on-chain, but the browser action is paused for this build.
          </p>
        </div>
        <span className="w-fit rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
          Demo proof only
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        <TeamSelector selectedTeam={selectedTeam} onSelect={setSelectedTeam} />

        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Wallet simulation can fail on the MVP `modifyLiquidity` path because the helper uses low-level Uniswap v4
          settlement. To avoid a broken button in the judge flow, browser Add Support is disabled here. The four pools
          were already seeded during deployment, and LP points remain visible in Live League.
        </div>

        <div className="grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
          <Readout label="Selected team" value={`${selectedTeam.symbol} / xUSD`} />
          <Readout label="Pool proof" value="Seeded on X Layer testnet" />
          <Readout label="Wallet" value={!isConnected ? 'Connect to swap first' : isWrongNetwork ? 'Wrong network' : 'Ready for swap demo'} />
          <Readout label="Support action" value="Disabled in browser MVP" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled
            className="min-h-11 rounded-md bg-neutral-400 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed"
          >
            Add Support Paused
          </button>
          <p className="text-sm text-neutral-600">Use Swap for the live wallet demo; use Proof for seeded LP evidence.</p>
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
