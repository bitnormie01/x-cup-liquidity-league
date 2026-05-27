# Project Brief — X Cup Liquidity League

> Compressed PRD for fast agent onboarding. Full PRD: `project-idea/X_Cup_Liquidity_League_PRD.md`. Read that only when this file is insufficient.

## Index

1. [One-Line Pitch](#one-line-pitch)
2. [Thesis](#thesis)
3. [MVP Scope](#mvp-scope)
4. [Contracts](#contracts)
5. [Pools](#pools)
6. [Hook Callbacks](#hook-callbacks)
7. [Match States & Fees](#match-states--fees)
8. [Scoring Formulas](#scoring-formulas)
9. [Anti-Wash Rules](#anti-wash-rules)
10. [Demo Path](#demo-path)
11. [Network Info](#network-info)
12. [Submission Requirements](#submission-requirements)
13. [Hard No-Gos](#hard-no-gos)
14. [Constants Cheatsheet](#constants-cheatsheet)

## One-Line Pitch

X Cup Liquidity League turns Uniswap v4 pools into a World Cup fan battle: every swap and liquidity add becomes verifiable team support on X Layer.

## Thesis

NOT a prediction market, NOT betting, NOT outcome wagers. Fan-engagement infrastructure where pool activity (swaps + LP) = team score. The Uniswap v4 Hook is the product — its callbacks ARE the tournament engine.

## MVP Scope

- 4 mock country tokens: BRA, ARG, FRA, GER.
- 1 quote token: xUSD.
- 1 soulbound Team Passport NFT (one per wallet, picks a team).
- 1 reusable Hook attached to all 4 pools.
- 1 registry contract mapping pools↔teams + match state.
- 1 minimal Next.js dashboard.
- Admin/mock match-state controller (no real oracle).

## Contracts

| Contract | Purpose |
|---|---|
| `DemoFanToken.sol` | ERC-20, deployed 4× (BRA/ARG/FRA/GER). Owner mint + public faucet (cooldown). |
| `DemoQuoteToken.sol` | ERC-20 xUSD. Public faucet (1,000 xUSD per call). |
| `TeamPassport.sol` | Soulbound ERC-721, one per wallet, stores selected `teamId`. |
| `XCupLeagueRegistry.sol` | Team metadata + `PoolId → teamId` map + match state per team. |
| `XCupLiquidityLeagueHook.sol` | The single reusable v4 Hook (`beforeSwap` / `afterSwap` / `afterAddLiquidity`). |
| `TournamentTreasury.sol` (optional) | Event-accounted treasury counter. Build only if Plans 1–6 are green. |

## Pools

4 pools, all paired with xUSD:
- `BRA/xUSD`
- `ARG/xUSD`
- `FRA/xUSD`
- `GER/xUSD`

All pools share the same Hook address. **Dynamic-fee flag enabled** on every pool.

## Hook Callbacks

| Callback | Job |
|---|---|
| `beforeSwap` | Compute dynamic LP fee from (matchState + passportDiscount + antiWashPenalty). Override pool fee per swap. Emit `DynamicFeeApplied`. |
| `afterSwap` | Record swap support points to team + user contribution. Apply wash multiplier. Emit `TeamPointsAwarded` (+ `WashPenaltyApplied` if flagged). |
| `afterAddLiquidity` | Record LP support points (LP weight 1.5×). Emit `TeamPointsAwarded`. |

Hook permissions: `beforeSwap = true`, `afterSwap = true`, `afterAddLiquidity = true`. All other permission bits **false**.

## Match States & Fees

```solidity
enum MatchState { PRE_MATCH, LIVE_NORMAL, GOAL_SHOCK, RED_CARD, PENALTY, FINAL_WHISTLE }
```

| State | Base LP Fee |
|---|---:|
| PRE_MATCH | 0.30% (30 bps) |
| LIVE_NORMAL | 0.50% (50 bps) |
| GOAL_SHOCK | 1.50% (150 bps) |
| RED_CARD | 1.00% (100 bps) |
| PENALTY | 1.25% (125 bps) |
| FINAL_WHISTLE | 0.75% (75 bps) |

Final fee formula:
```
finalFee = clamp(baseFee - supporterDiscount + antiWashPenalty, MIN_FEE_BPS, MAX_FEE_BPS)
```

## Scoring Formulas

```
SWAP:    volumePoints  = normalizedQuoteVolume / POINT_UNIT
         loyaltyMult   = 12000 if passport.teamOf(user) == teamId else 10000   (bps)
         washMult      = 0 if flagged else 10000                                (bps)
         points        = volumePoints * loyaltyMult/10000 * washMult/10000

LP:      lpRaw         = normalizedLiquidity / LP_POINT_UNIT
         lpPoints      = lpRaw * LP_WEIGHT_BPS / 10000
```

MVP fallback: if exact quote-normalization is hard, use `|amountSpecified|` as the normalized volume and note this in the report.

## Anti-Wash Rules

Flag a swap if any of:
- Same user + same pool within **60 s** (cooldown violation)
- Opposite direction in same pool within **180 s** (reversal violation)
- More than **5 swaps** in same pool within **10 min** (burst violation)

When flagged:
- `pointsMultiplier = 0`
- Optional `feePenalty = +25 bps`
- Emit `WashPenaltyApplied(poolId, teamId, user, reason, penaltyBps, timestamp)`

Swap still executes; only points/fees adjusted.

## Demo Path

Judges should watch this in ~90 seconds:

1. Wallet connect on X Layer testnet.
2. Faucet `xUSD`.
3. Mint passport for BRA.
4. Swap `xUSD → BRA`. BRA jumps to #1 on leaderboard.
5. Add liquidity to ARG. ARG gains LP points and catches up.
6. Admin triggers `GOAL_SHOCK` on BRA. Pool fee visibly jumps to 1.50%.
7. Second BRA swap. Event log shows new fee + new points.
8. Rapid reverse swap. Anti-wash penalty fires; UI shows warning.
9. Show contract addresses + explorer links.

## Network Info

**X Layer testnet (primary):**
- RPC: `https://testrpc.xlayer.tech/terigon` (alt: `https://xlayertestrpc.okx.com/terigon`)
- Chain ID: `1952`
- Native symbol: OKB
- Explorer: https://www.okx.com/web3/explorer/xlayer-test

**X Layer mainnet (stretch only):**
- RPC: `https://rpc.xlayer.tech` (alt: `https://xlayerrpc.okx.com`)
- Chain ID: `196`
- Explorer: https://www.okx.com/web3/explorer/xlayer

## Submission Requirements

- Public repo with README.
- README must include: pitch, screenshots, architecture diagram, Hook callback notes, addresses (Hook + pools + tokens + registry + passport), X Layer network details, setup, demo script, limitations, future work, submission links.
- Demo video (1–3 min).
- Dedicated X account with tagged post.
- Google Form submission before **2026-05-28 23:59 UTC**.

## Hard No-Gos

- No real-money betting / prediction / wagers.
- No real sports oracle dependency.
- No licensed FIFA assets (mock teams only).
- No governance token / no real tokenomics.
- No cross-chain bridging, mobile app, AI agent.
- No more than 4 teams in MVP.
- No team-change on passport (one-and-done).
- No skipping the Hook — every team interaction MUST flow through `beforeSwap` / `afterSwap` / `afterAddLiquidity`.

## Constants Cheatsheet

```
MIN_FEE_BPS                 = 25      // 0.25%
MAX_FEE_BPS                 = 200     // 2.00%
PASSPORT_DISCOUNT_BPS       = 5
LP_SUPPORTER_DISCOUNT_BPS   = 5
WASH_PENALTY_BPS            = 25

POINT_UNIT                  = 1e18    // xUSD-equivalent
LP_POINT_UNIT               = 1e18
LP_WEIGHT_BPS               = 15000   // LP actions worth 1.5× swaps
LOYALTY_MULTIPLIER_BPS      = 12000
DEFAULT_MULTIPLIER_BPS      = 10000
WASH_MULTIPLIER_BPS         = 0

ANTI_WASH_COOLDOWN_SEC      = 60
ANTI_WASH_REVERSAL_SEC      = 180
ANTI_WASH_BURST_WINDOW_SEC  = 600
ANTI_WASH_BURST_MAX_SWAPS   = 5
```
