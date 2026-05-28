import { ContractProofPanel } from '@/components/ContractProofPanel';
import { EventLog } from '@/components/EventLog';
import { FaucetPanel } from '@/components/FaucetPanel';
import { Leaderboard } from '@/components/Leaderboard';
import { LiquidityPanel } from '@/components/LiquidityPanel';
import { MatchStateSimulator } from '@/components/MatchStateSimulator';
import { NetworkBadge } from '@/components/NetworkBadge';
import { PassportCard } from '@/components/PassportCard';
import { SwapPanel } from '@/components/SwapPanel';
import { WalletButton } from '@/components/WalletButton';
import { xLayerExplorerName, xLayerExplorerUrl } from '@/lib/chains';
import { deployments } from '@/lib/deployments';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f8f4] text-okx">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-6 sm:px-8 lg:px-10">
        <header className="grid gap-6 border-b border-line pb-7 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="mb-3 inline-flex rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
              Start Here
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-okx sm:text-5xl">
              X Cup Liquidity League
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-7 text-neutral-700">
              Pick a country, claim demo tokens, and support your team while Uniswap v4 hook logic adjusts points and
              fees in real time on X Layer testnet.
            </p>
            <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
              <HeroStep title="1. Get tokens" detail="Claim xUSD and team tokens from testnet faucets." />
              <HeroStep title="2. Pick a team" detail="Mint one soulbound passport for your supporter identity." />
              <HeroStep title="3. Support" detail="Swap to move points, fees, and activity in the live league." />
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start lg:flex-col lg:items-end">
            <WalletButton />
            <NetworkBadge />
          </div>
        </header>

        <SectionIntro
          eyebrow="Step 1"
          title="Get Demo Tokens"
          detail="Start by funding the connected wallet with xUSD and team tokens."
        />
        <section>
          <FaucetPanel />
        </section>

        <SectionIntro
          eyebrow="Step 2"
          title="Pick Your Team"
          detail="Mint one Team Passport so your wallet has a supporter identity."
        />
        <section>
          <PassportCard />
        </section>

        <SectionIntro
          id="support"
          eyebrow="Step 3"
          title="Support Your Team"
          detail="Use swaps for the live demo. Liquidity support is shown as deployment proof until the browser path is safe."
        />
        <section className="grid gap-4 xl:grid-cols-2">
          <SwapPanel />
          <LiquidityPanel />
        </section>

        <SectionIntro
          eyebrow="Live League"
          title="Scores and Match Fees"
          detail="Rows refresh every few seconds from the deployed hook, registry, and passport contracts."
        />
        <Leaderboard />

        <SectionIntro
          eyebrow="Live Activity"
          title="Recent On-chain Events"
          detail="The activity feed polls a bounded recent-block window on X Layer testnet."
        />
        <section>
          <EventLog />
        </section>

        <SectionIntro
          eyebrow="Admin Controls"
          title="Match-State Demo"
          detail="Open with ?admin=1 in production. Only the registry controller or owner can write."
        />
        <section>
          <MatchStateSimulator />
        </section>

        <SectionIntro
          id="proof"
          eyebrow="Proof"
          title="Technical Details"
          detail="Addresses, pool IDs, and the project-owned PoolManager disclosure live here for review."
        />
        <section>
          <ContractProofPanel />
        </section>

        <footer className="flex flex-col gap-2 border-t border-line py-5 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <span>xUSD, BRA, ARG, FRA, and GER deployments are loaded for chain {deployments.chainId}.</span>
          <a
            className="font-semibold text-pitch underline-offset-4 hover:underline"
            href={xLayerExplorerUrl}
            rel="noreferrer"
            target="_blank"
          >
            {xLayerExplorerName}
          </a>
        </footer>
      </div>
    </main>
  );
}

function HeroStep({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-3 shadow-panel">
      <p className="font-semibold text-okx">{title}</p>
      <p className="mt-1 leading-6 text-neutral-600">{detail}</p>
    </div>
  );
}

function SectionIntro({ detail, eyebrow, id, title }: { detail: string; eyebrow: string; id?: string; title: string }) {
  return (
    <div id={id} className="scroll-mt-6 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-pitch">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold text-okx">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{detail}</p>
    </div>
  );
}
