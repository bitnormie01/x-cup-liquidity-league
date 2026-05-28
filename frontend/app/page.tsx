import { FaucetPanel } from '@/components/FaucetPanel';
import { NetworkBadge } from '@/components/NetworkBadge';
import { PassportCard } from '@/components/PassportCard';
import { WalletButton } from '@/components/WalletButton';
import { xLayerExplorerUrl } from '@/lib/chains';
import { deployments, shortAddress } from '@/lib/deployments';

const placeholders = [
  {
    title: 'Leaderboard + Team Cards',
    phase: 'P06-03',
    detail: 'Live team scores, fans, match state, and active fee views.',
  },
  {
    title: 'Swap + Liquidity Support',
    phase: 'P06-04',
    detail: 'Judge-facing swap and LP flows against the deployed pools.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8f4] text-okx">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
              X Layer testnet
            </div>
            <h1 className="text-4xl font-semibold tracking-normal text-okx sm:text-5xl">
              X Cup Liquidity League
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-7 text-neutral-700">
              World Cup fan battles powered by Uniswap v4 Hooks on X Layer
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start lg:flex-col lg:items-end">
            <WalletButton />
            <NetworkBadge />
          </div>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Deployment Status</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Static P05-03 manifests loaded from the committed X Layer testnet deployment.
                </p>
              </div>
              <span className="w-fit rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
                Project-owned PoolManager
              </span>
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatusRow label="Chain ID" value={String(deployments.chainId)} />
              <StatusRow label="PoolManager mode" value={deployments.poolManagerMode} />
              <StatusRow label="Registry" value={shortAddress(deployments.core.registry)} />
              <StatusRow label="Hook" value={shortAddress(deployments.core.hook)} />
              <StatusRow label="PoolManager" value={shortAddress(deployments.core.poolManager)} />
              <StatusRow label="TeamPassport" value={shortAddress(deployments.core.teamPassport)} />
            </dl>

            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
              No canonical X Layer testnet Uniswap v4 PoolManager was confirmed for P05-03, so
              the testnet deployment uses the project-owned PoolManager disclosed in the README.
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <h2 className="text-xl font-semibold">Team Pools</h2>
            <div className="mt-4 divide-y divide-line">
              {deployments.teams.map((team) => (
                <div key={team.symbol} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{team.symbol}</p>
                    <p className="text-sm text-neutral-600">{team.name}</p>
                  </div>
                  <code className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-800">
                    {shortAddress(team.poolId)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <FaucetPanel />
          <PassportCard />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {placeholders.map((item) => (
            <article key={item.title} className="rounded-lg border border-line bg-white p-5 shadow-panel">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-pitch text-sm font-semibold text-white">
                {item.phase.slice(-2)}
              </div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.detail}</p>
            </article>
          ))}
        </section>

        <footer className="flex flex-col gap-2 border-t border-line py-5 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <span>xUSD, BRA, ARG, FRA, and GER deployments are loaded for chain 1952.</span>
          <a
            className="font-semibold text-pitch underline-offset-4 hover:underline"
            href={xLayerExplorerUrl}
            rel="noreferrer"
            target="_blank"
          >
            OKX Explorer
          </a>
        </footer>
      </div>
    </main>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-[#fbfcfa] p-3">
      <dt className="text-xs font-semibold uppercase text-neutral-500">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-neutral-900">{value}</dd>
    </div>
  );
}
