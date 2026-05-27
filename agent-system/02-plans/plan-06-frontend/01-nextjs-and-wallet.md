---
phase-id: P06-01
plan: P06
revised-on: 2026-05-26
---

# P06-01 — Next.js + Wallet + Network

## Goal

Bootstrap a Next.js (App Router) + TypeScript + Tailwind project under `frontend/`, install wagmi + viem + RainbowKit (or a lightweight injected-only connector), and add X Layer testnet detection with a "switch network" CTA.

## Scope (In)

- `pnpm create next-app` (or equivalent) producing:
  ```
  frontend/
    app/
      layout.tsx
      page.tsx
    lib/
      chains.ts
      wagmi-config.ts
      deployments.ts
    components/
      WalletButton.tsx
      NetworkBadge.tsx
    public/
    tailwind.config.ts
    next.config.mjs
    package.json
    tsconfig.json
  ```
- Tailwind set up with sensible defaults (dark mode `class`, container centered).
- `lib/chains.ts` exports an X Layer testnet chain object:
  ```ts
  export const xLayerTestnet = {
    id: 1952,
    name: 'X Layer Testnet',
    nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
    rpcUrls: { default: { http: ['https://testrpc.xlayer.tech/terigon'] } },
    blockExplorers: { default: { name: 'OKX Explorer', url: 'https://www.okx.com/web3/explorer/xlayer-test' } },
    testnet: true,
  } as const satisfies Chain
  ```
- `lib/wagmi-config.ts` configures wagmi with this chain + a public client.
- `lib/deployments.ts` imports the JSONs from `../contracts/deployments/xlayer-testnet/*.json` and re-exports as typed objects (use `import` of JSON in tsconfig with `"resolveJsonModule": true`).
- `WalletButton`: shows Connect / Disconnect / shortened address; uses RainbowKit or a barebones `useConnect` flow.
- `NetworkBadge`: shows the connected chain and a "Switch to X Layer testnet" button when on the wrong network.
- `app/page.tsx`: header with product name, subtitle ("World Cup fan battles powered by Uniswap v4 Hooks on X Layer"), wallet button, network badge, and three placeholder slots (faucet/passport/leaderboard — implemented in later phases).
- Environment file `frontend/.env.example`:
  ```
  NEXT_PUBLIC_XLAYER_TESTNET_RPC=https://testrpc.xlayer.tech/terigon
  ```

## Scope (Out)

- Any read/write of contracts (P06-02+).
- Match-state simulator (P06-05).
- Mainnet config (testnet only for MVP).

## Acceptance Criteria

- [ ] `cd frontend && pnpm install && pnpm dev` boots without error.
- [ ] Wallet connect works against MetaMask in a normal browser.
- [ ] Switching to a non-X-Layer network shows the badge in "wrong network" state.
- [ ] `pnpm build` succeeds.
- [ ] No console errors on load.

## Risks / Pitfalls

- RainbowKit pulls a heavy dep tree. If install latency hurts iteration, use a minimal `@wagmi/core` injected connector and skip RainbowKit. Document the choice.
- Importing JSON from outside the Next.js root (`../contracts/deployments/`) needs `tsconfig.json` `"include"` to cover it. Easier: copy JSONs into `frontend/lib/deployments/` via a tiny script run in CI/dev.
- Strict mode + React 19 may surface effect-double-run; design components to be effect-idempotent.

## Reference

- Brief: "Network Info", "Demo Path" (first three steps).
- PRD §14 UX Requirements.
