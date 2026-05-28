---
directive-id: D26
phase-id: FRONTEND-HOTFIX
created-at: 2026-05-28T13:40Z
priority: CRITICAL
revision: 1
---

# Directive — D26 Frontend UX Hotfix

## Context

Manual user/developer testing found major frontend issues after P07-02. This hotfix interrupts final submission work. Do not continue P07-03 until this frontend patch is complete and reviewed.

The current frontend is functional but too technical for normal users, has confusing approve/action state transitions, weak categorization, broken explorer-link context, fragile flag rendering, and a broken `Add support` wallet simulation path.

## Goal

Refactor the frontend into a normal-user playable demo, fix transaction-state UX, remove or safely gate the broken liquidity-support transaction, replace explorer context with OKLink after verifying the correct URL format, and improve categorization, copy, typography, responsiveness, and interaction feedback.

## Mandatory first step — write plan before implementation

Before editing frontend implementation files, create:

```text
agent-system/04-summaries/reports/D26-frontend-refactor-plan.md
```

This plan must be concise and include:

1. Current UX problem summary.
2. Target normal-user information architecture.
3. Exact sections to show on the homepage and their order.
4. Explorer-link migration plan from OKX Explorer to OKLink.
5. Team flag/logo plan.
6. Transaction-state plan for approve -> action transitions.
7. `Add support` fix plan.
8. Files expected to change.

After writing the plan, implement it in the same working session. No need to wait for Mastermind before implementing unless the plan reveals a blocker.

## Required UX refactor plan

Use this target structure for the homepage:

1. **Hero / Start Here**
   - Plain-language pitch.
   - Primary CTA: connect wallet / start playing.
   - Small network badge.
   - Hide technical deployment proof from the top.

2. **Step 1 — Get Demo Tokens**
   - Faucet panel.
   - Copy should explain: "Claim free demo tokens to play. They have no real value."

3. **Step 2 — Pick Your Team**
   - Passport panel.
   - Explain soulbound passport in normal words: "Your wallet supports one team for this demo."

4. **Step 3 — Support Your Team**
   - Swap panel as the main working interaction.
   - Liquidity support must be either fixed or converted into a clearly labelled script/demo-only panel if wallet confirmation remains broken.

5. **Live League**
   - Leaderboard and team cards.
   - Use simple labels: Rank, Team, Points, Fans, Match Status, Current Fee.

6. **Live Activity**
   - Event log.

7. **Admin Demo Controls**
   - Gated by `?admin=1`.

8. **Proof / Technical Details**
   - Contract proof panel at the bottom.
   - Addresses and pool IDs belong here, not at the top.

## Required fixes

### 1. Port explorer links/context to OKLink

User says OKX Explorer links are not working and wants OKLink.

- Replace frontend explorer naming/copy from OKX Explorer to OKLink.
- Replace explorer URL builders throughout frontend.
- Verify the exact OKLink X Layer testnet URL pattern before committing.
- If OKLink does not expose a working X Layer testnet route, document the attempted URL patterns in the report and use the closest working OKLink route. Do not keep broken links silently.
- Update README/SUBMISSION only if they contain frontend-facing explorer copy affected by this change.

Do not guess blindly. Test at least one address and one tx URL manually or with curl if possible.

### 2. Proper country flag logos

Emoji flags rendered as missing boxes in screenshots. Replace emoji-only team icons with reliable visual badges.

Acceptable approach under time pressure:

- Add CSS-based circular flag badges or gradient badges for BRA/ARG/FRA/GER.
- Use stable text fallback inside badge: BRA, ARG, FRA, GER.
- Do not depend on external image CDNs.
- Do not use licensed FIFA/World Cup assets.

If adding SVGs, place them under:

```text
frontend/public/teams/
```

Use simple original flag-inspired shapes only.

### 3. Rewrite technical copy for normal users

Replace jargon-heavy visible text.

Examples:

- "V4PoolActionHelper" -> "game transaction helper" or hide entirely in proof only.
- "Project-owned PoolManager" -> keep only in Proof section and explain: "testnet demo infrastructure".
- "Pool ID" -> show only in proof/details.
- "liquidityDelta" -> never show to normal users.
- "afterAddLiquidity" -> only in technical/proof docs, not user action panels.
- "Exact-input" -> "Swap this amount".

Maintain technical accuracy in the README/proof area, but the main app should feel like a playable demo.

### 4. Fix approve -> action button state

Current UX forces confusing repeat clicks after approval. Fix all transaction panels so state transitions are obvious.

Requirements:

- If allowance is insufficient, button says `Approve <TOKEN>`.
- After approval tx is confirmed, automatically refetch allowance.
- After allowance is sufficient, button changes to `Swap` or `Add Support` without requiring a confusing duplicate approval.
- If refetch is delayed, show `Approval confirmed. Preparing action...`.
- Separate approve and action buttons if that is clearer.
- Do not reuse stale `hash`/receipt state in a way that makes a previous approval success look like swap success.

### 5. Fix or safely disable `Add support`

User reports `Add support` wallet simulation fails with: third-party contract execution error; confirm button unavailable.

Likely causes may include v4 liquidity math/magnitude, helper call simulation failure, insufficient token side, or frontend params incompatible with wallet simulation.

Required outcome:

- Do not leave a broken clickable `Add support` button.
- First attempt a safe fix:
  - Use a small default amount suggestion such as `0.001`.
  - Add clear balance/allowance checks.
  - Ensure both token approvals are completed before the support call.
  - Use known seeded full-range ticks.
  - If possible, use the same magnitude that worked in scripts or a documented safe preset.
- If wallet simulation still fails or cannot be validated, convert LiquidityPanel into a non-clickable "Demo support via deployment script" proof/explanation panel with:
  - what it does
  - why it is disabled in browser for this build
  - where LP points can be seen
  - no broken transaction button

This is critical: a disabled honest panel is better than a broken wallet transaction.

### 6. Categorization and layout

- Group panels into user journey cards.
- Use section headers with step numbers.
- Move Contract Proof to bottom.
- Use collapsible/details styling for advanced proof if useful.
- Avoid overwhelming users with addresses on first screen.

### 7. Typography consistency

Define a consistent text system in Tailwind/CSS:

- headings: semibold, consistent sizes
- body: one readable sans-serif stack
- labels: small uppercase or medium label style
- numbers/addresses: monospace only for addresses/hash/pool IDs
- buttons: consistent height, radius, font weight

Do not introduce remote fonts. Use system font stack.

### 8. Responsiveness and interaction feedback

- Test mobile/narrow layout mentally and through browser if possible.
- Buttons should not jump width after click.
- Pending states should keep layout stable.
- Long addresses/pool IDs must wrap without breaking layout.
- Panels should stack cleanly on mobile.

## Files likely to change

Likely frontend files:

```text
frontend/app/page.tsx
frontend/app/globals.css
frontend/lib/chains.ts
frontend/lib/deployments.ts
frontend/lib/teams.ts
frontend/lib/pools.ts
frontend/components/*
```

Docs/report files:

```text
agent-system/04-summaries/reports/D26-frontend-refactor-plan.md
agent-system/04-summaries/reports/D26-frontend-ux-hotfix.md
agent-system/04-summaries/execution-log.md
agent-system/03-state/state-counter.md
agent-system/03-state/phase-status.md
```

## Validation

Run:

```bash
cd frontend
pnpm build
pnpm dev --hostname 127.0.0.1 --port 3000
curl -I http://127.0.0.1:3000
```

Capture screenshots if practical:

```text
agent-system/04-summaries/screenshots/D26-home-refactor.png
agent-system/04-summaries/screenshots/D26-play-flow.png
agent-system/04-summaries/screenshots/D26-proof-section.png
```

If browser-wallet testing is available, test:

- connect wallet
- approve token
- confirm button changes after approval
- swap button appears without duplicate approval confusion
- liquidity panel is either safely working or disabled honestly

If no browser wallet is available, document that limitation clearly.

## Report

Create:

```text
agent-system/04-summaries/reports/D26-frontend-ux-hotfix.md
```

Include:

- UX plan summary
- files changed
- explorer migration result and tested URL patterns
- approve-state fix details
- liquidity-panel decision: fixed or disabled/partial
- validation outputs
- remaining manual test checklist

## State updates

This is an emergency frontend hotfix, not a normal phase. Update state honestly:

- Active Plan remains `P07 — Submission`
- Active Phase remains `P07-02 — X account + demo video` or note `FRONTEND-HOTFIX`
- Active Directive = `D26`
- Active Phase Status = `AWAITING_REVIEW` when complete
- Next Directive ID = `D27`

Append execution log row.

Final commit:

```text
[D26] frontend UX hotfix
```

## Scope Out

- No contract changes.
- No new deployment unless absolutely unavoidable and approved by a clear blocker report.
- No P07-03 form submission.
- No fake hosting/video/X links.
- No licensed sports/FIFA assets.
