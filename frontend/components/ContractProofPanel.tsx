import { xLayerExplorerUrl, xLayerTestnet } from '@/lib/chains';
import { deployments, shortAddress } from '@/lib/deployments';

const tokenRows = [
  { label: 'xUSD', address: deployments.tokens.xUSD },
  { label: 'BRA', address: deployments.tokens.BRA },
  { label: 'ARG', address: deployments.tokens.ARG },
  { label: 'FRA', address: deployments.tokens.FRA },
  { label: 'GER', address: deployments.tokens.GER },
];

const coreRows = [
  { label: 'PoolManager', address: deployments.core.poolManager },
  { label: 'XCupLeagueRegistry', address: deployments.core.registry },
  { label: 'TeamPassport', address: deployments.core.teamPassport },
  { label: 'XCupLiquidityLeagueHook', address: deployments.core.hook },
  { label: 'LiquiditySeeder helper', address: deployments.core.liquiditySeeder },
];

export function ContractProofPanel() {
  return (
    <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
      <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Contract Proof</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Deployed X Layer testnet contracts and pool IDs for judge verification.
          </p>
        </div>
        <span className="w-fit rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
          Project-owned PoolManager
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-md border border-line bg-[#fbfcfa] p-4">
          <h3 className="font-semibold">Network</h3>
          <dl className="mt-3 grid gap-3">
            <ProofMetric label="Name" value={xLayerTestnet.name} />
            <ProofMetric label="Chain ID" value={String(deployments.chainId)} />
          </dl>
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
            P05-03 did not confirm a canonical X Layer testnet Uniswap v4 PoolManager, so this
            deployment uses the project-owned PoolManager shown here.
          </div>
        </div>

        <div className="grid gap-4">
          <AddressGroup title="Tokens" rows={tokenRows} />
          <AddressGroup title="Core Contracts" rows={coreRows} />
        </div>
      </div>

      <div className="mt-4 rounded-md border border-line bg-[#fbfcfa] p-4">
        <h3 className="font-semibold">Pool IDs</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {deployments.teams.map((team) => (
            <div key={team.symbol} className="rounded-md border border-line bg-white p-3">
              <p className="text-sm font-semibold">
                {team.symbol} / xUSD <span className="text-neutral-500">({team.name})</span>
              </p>
              <code className="mt-2 block break-all text-xs text-neutral-800">{team.poolId}</code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AddressGroup({ title, rows }: { title: string; rows: { label: string; address: string }[] }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfcfa] p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <a
            key={row.label}
            className="rounded-md border border-line bg-white p-3 transition hover:border-emerald-300 hover:bg-emerald-50"
            href={`${xLayerExplorerUrl}/address/${row.address}`}
            rel="noreferrer"
            target="_blank"
          >
            <p className="text-xs font-semibold uppercase text-neutral-500">{row.label}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-pitch">{shortAddress(row.address)}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProofMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <dt className="text-xs font-semibold uppercase text-neutral-500">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-neutral-900">{value}</dd>
    </div>
  );
}
