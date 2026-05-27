# X Cup Liquidity League PRD

**Project:** X Cup Liquidity League  
**Hackathon:** X Layer Build X: X Cup Hackathon  
**Version:** v1.0  
**Last updated:** 2026-05-25  
**Owner:** Anuj / hackathon team  
**Target delivery:** May 28, 2026, 23:59 UTC  
**Primary chain:** X Layer testnet first; mainnet optional if deployment is stable  
**Core primitive:** One reusable Uniswap v4 Hook attached to multiple country fan-token pools

---

## 1. Product Summary

X Cup Liquidity League is a World Cup-themed fan engagement protocol where each country/team has a tradable fan-token pool on X Layer. Fans support teams through real DeFi actions: swapping, adding liquidity, holding a Team Passport NFT, and participating during match-state windows. A single reusable Uniswap v4 Hook turns those pool actions into an on-chain tournament leaderboard.

**One-line pitch:**  
X Cup Liquidity League turns Uniswap v4 pools into a World Cup fan battle: every swap and liquidity add becomes verifiable team support on X Layer.

**Core product thesis:**  
The project is not a prediction market, betting app, or outcome wager. It is fan engagement infrastructure for sports-themed DeFi pools. Instead of asking users to bet on who wins a match, it asks users to prove fandom through on-chain liquidity and trading activity.

**Why the hook is the product:**  
The protocol’s scoring, loyalty discounts, anti-wash controls, match-state dynamic fees, and tournament treasury are all triggered by Uniswap v4 Hook callbacks:

- `beforeSwap`: applies dynamic fees, supporter discounts, and anti-wash penalties.
- `afterSwap`: records team support points from real swap activity.
- `afterAddLiquidity`: records liquidity support points from LP activity.
- Optional hook fee logic: accrues a small tournament treasury.

**Hackathon-ready MVP:**  
Build a focused 4-team version with mock country tokens (`BRA`, `ARG`, `FRA`, `GER`), a quote token (`xUSD`), one reusable Hook, Team Passport NFTs, a live leaderboard, match-state simulator, and a 1–3 minute demo showing on-chain support turning into team rankings.

---

## 2. Hackathon Fit

X Cup Liquidity League is designed around the hackathon’s scoring model and hard requirements.

### Required hackathon alignment

| Requirement | Product response |
|---|---|
| World Cup theme | Country/team fan pools, fan passports, tournament leaderboard, match-state windows |
| Built on X Layer | Deploy demo tokens, Team Passport NFT, leaderboard state, Hook, and V4 pools on X Layer testnet/mainnet |
| Uniswap v4 Hook mechanism | One reusable Hook powers dynamic fees, scoring, anti-wash logic, LP points, and event emission |
| Deployed V4 pool and Hook addresses | Submission includes Hook address, country pool IDs, token addresses, and explorer links |
| Dedicated X account | Account posts leaderboard updates, team standings, contract addresses, demo clip, and required tags |
| Active hackathon posting | Use daily posts: launch teaser, contract deployment, live leaderboard, final demo |

### Judging optimization

#### Innovation

X Cup Liquidity League differentiates from generic prediction markets by converting DeFi pool activity into fan competition. The product uses Hook callbacks as a tournament engine instead of merely adding a hook to a betting app. Innovation points come from:

- on-chain fan scoring from pool activity;
- a reusable multi-pool Hook;
- anti-wash scoring built directly into the Hook;
- Team Passport NFT loyalty layer;
- match-state fee modulation as a small MatchShield-inspired module.

#### Market potential

The product creates a simple fan funnel:

1. Pick a team.
2. Mint a Team Passport.
3. Swap or LP to support the team.
4. Watch leaderboard update.
5. Share team rank on X.

This can convert World Cup attention into repeated X Layer transactions without needing betting compliance, real sports-oracle integrations, or complex game theory.

#### Completion

The MVP is intentionally narrow:

- 4 teams, not 32.
- mock tokens, not real licensed assets.
- admin/mock match-state controller, not real oracle.
- one Hook, not multiple custom hooks.
- one dashboard, not full consumer app.

The demo can prove the core in under 90 seconds: wallet connects, user supports a team, Hook emits points, leaderboard changes, match event changes fee, another swap gets different fee, group winner emerges.

#### Demo video bonus

The demo should create one “wow” moment:

> A goal shock is triggered, the active pool fee visibly jumps, a fan swap still works, the Hook records support points, and the leaderboard changes live.

---

## 3. Problem

World Cup attention is massive, but most crypto sports products fall into predictable patterns:

- prediction markets;
- outcome betting;
- collectible cards;
- simple quests;
- off-chain leaderboards with weak verifiability.

These approaches have four hackathon weaknesses:

1. **They are crowded.** Many teams build “predict the winner” or “mint player cards.”
2. **They can look like gambling.** That creates unnecessary positioning risk.
3. **They often use the blockchain only for settlement.** The core experience may not require a Hook.
4. **They are hard to complete well in 3 days.** Real oracle data, fair markets, and game balancing are time sinks.

At the same time, Uniswap v4 Hooks enable pool-specific logic at key lifecycle points. A World Cup-themed project should exploit those callbacks directly: swaps and liquidity actions are already on-chain, verifiable, repeatable, and judge-friendly.

**User problem:**  
Fans want a simple way to support their team on-chain without understanding complex DeFi primitives or betting mechanics.

**Builder problem:**  
Hackathon judges need to see a working Hook, deployed addresses, on-chain verifiability, and differentiated gameplay.

**Protocol problem:**  
X Layer needs transaction-driving applications that can bring non-native users into the ecosystem through a theme they understand.

X Cup Liquidity League solves all three by making fan support a visible, on-chain tournament powered by Uniswap v4 Hook callbacks.

---

## 4. Target Users

### Primary users

#### 1. World Cup fans with wallets

- Want to support a country/team.
- Prefer a simple “pick team → swap → rank goes up” experience.
- Do not need to understand LP math.
- Shareable motivation: “I helped push Brazil to #1.”

#### 2. DeFi traders

- Understand swaps and pools.
- Want short-term activity around sports narratives.
- Care about visible pool stats, fees, and volume.

#### 3. Liquidity providers

- Add liquidity to a country pool to support a team.
- Earn LP support points.
- Benefit from match-state dynamic fees during high-volatility demo windows.

#### 4. Hackathon judges

- Need fast proof that the Hook is central.
- Need verifiable contract addresses and events.
- Evaluate code quality, innovation, and demo clarity.

### Secondary users

#### 1. X Layer ecosystem users

- Interested in new dApps using X Layer.
- Likely to test the app if token faucets and UX are simple.

#### 2. Sports communities and creators

- Could run country-specific fan campaigns.
- Future extension: creator leagues and watch-party pools.

#### 3. Protocol partners

- X Layer: transaction growth and ecosystem narrative.
- Uniswap: strong v4 Hook showcase.
- Flap/social partners: social distribution via fan battles.

---

## 5. Goals

### Product goals

1. Build a working World Cup-themed fan liquidity competition on X Layer.
2. Make the Uniswap v4 Hook the core application logic.
3. Convert swaps and LP adds into verifiable team leaderboard points.
4. Provide a Team Passport NFT that acts as identity, loyalty, and fee-discount layer.
5. Add anti-wash-trading controls to increase scoring credibility.
6. Integrate a minimal MatchShield dynamic fee module for live match states.
7. Deliver a polished frontend that judges can understand within 10 seconds.

### Technical goals

1. Deploy one reusable Hook usable across all team pools.
2. Deploy 4 mock country ERC-20 tokens and one mock quote token.
3. Create team pools using the Hook.
4. Implement and test:
   - `beforeSwap`;
   - `afterSwap`;
   - `afterAddLiquidity`;
   - team scoring;
   - supporter fee discounts;
   - anti-wash penalty;
   - match-state fee override;
   - treasury accrual events.
5. Emit events that make on-chain verification easy.
6. Keep contracts small enough to audit quickly.

### Hackathon goals

1. Show at least 4 successful team support actions on-chain.
2. Show at least 2 teams competing on the leaderboard.
3. Show at least 1 LP action affecting rankings.
4. Show at least 1 dynamic fee change from match-state simulation.
5. Submit with:
   - repo;
   - README;
   - deployment addresses;
   - demo video;
   - dedicated X account and tagged post;
   - Google Form before deadline.

---

## 6. Non-Goals

The MVP must stay ruthlessly scoped. The following are explicitly out of scope:

- No real-money betting.
- No prediction market.
- No payout based on real match outcome.
- No real sports data oracle dependency for MVP.
- No need for all 32 World Cup teams.
- No advanced DEX aggregator.
- No concentrated liquidity manager UI.
- No production-ready analytics indexer.
- No complex tokenomics.
- No governance token.
- No real branded/licensed FIFA assets.
- No player-card game.
- No cross-chain bridging.
- No mobile app.
- No AI agent in MVP.
- No guaranteed yield or profit language.
- No permissionless team creation in MVP.
- No fully automated sybil resistance.

The MVP is a demo-quality but technically credible Hook project. Anything that does not help prove the Hook, leaderboard, anti-wash mechanism, dynamic fees, or fan journey should be cut.

---

## 7. MVP Scope

### Must Have

#### Contracts

1. `DemoFanToken.sol`
   - ERC-20 mock team tokens.
   - Deploy 4 tokens:
     - `BRA` — Brazil Fan Token
     - `ARG` — Argentina Fan Token
     - `FRA` — France Fan Token
     - `GER` — Germany Fan Token
   - Optional `mint(address to, uint256 amount)` restricted to owner/faucet.

2. `DemoQuoteToken.sol`
   - ERC-20 mock quote token:
     - `xUSD`
   - Faucet/mint functionality for demo users.

3. `TeamPassport.sol`
   - Soulbound ERC-721-style passport.
   - One passport per wallet.
   - Stores selected team.
   - Used by Hook for supporter discounts and point boosts.

4. `XCupLeagueRegistry.sol`
   - Maps PoolId to team ID.
   - Stores team metadata.
   - Stores match state per team/pool.
   - Stores authorized controller.
   - Provides read functions for frontend.

5. `XCupLiquidityLeagueHook.sol`
   - Single reusable Uniswap v4 Hook.
   - Implements:
     - `beforeSwap`;
     - `afterSwap`;
     - `afterAddLiquidity`.
   - Applies dynamic fees.
   - Records team points.
   - Applies anti-wash scoring.
   - Emits all scoring and fee events.

6. Optional but recommended: `TournamentTreasury.sol`
   - Receives small hook-fee accounting or displays accrued treasury values.
   - Can be simplified to event-only accounting if hook-fee implementation risk is high.

#### Pools

Create at least 4 team pools:

- `BRA/xUSD`
- `ARG/xUSD`
- `FRA/xUSD`
- `GER/xUSD`

If time is tight, deploy only 2 pools and keep 4 token/team entries in UI as “ready.” However, the preferred MVP is 4 pools because a leaderboard feels real only with multiple teams.

#### Frontend

1. Wallet connect.
2. X Layer network detection.
3. Token faucet panel.
4. Team selection and Team Passport mint.
5. Team leaderboard.
6. Team cards with:
   - team name;
   - ticker;
   - pool address/PoolId;
   - current points;
   - swap volume points;
   - LP points;
   - fan count;
   - current match state;
   - active fee.
7. Swap panel.
8. Liquidity support panel.
9. Match event simulator.
10. Anti-wash status panel.
11. Event log.
12. Contract addresses / on-chain proof panel.

#### Demo

The demo must show:

1. User mints passport for `BRA`.
2. User swaps `xUSD → BRA`.
3. `BRA` points increase.
4. Another user or same user adds liquidity to `ARG`.
5. `ARG` LP points increase.
6. Admin triggers `GOAL_SHOCK` for `BRA`.
7. `BRA` pool fee changes to `1.50%`.
8. Rapid repeat swap triggers reduced points or anti-wash warning.
9. Leaderboard updates and declares a temporary group leader.

### Should Have

- “Group Stage” view with rank 1–4.
- Team supporter count.
- User personal contribution score.
- Shareable X post text generator.
- Color-coded match states.
- Fee history table.
- Explorer links for each emitted event.
- README with a clear “Demo path.”

### Nice to Have

Only build if Must Have is done:

- 8-team tournament mode.
- Top supporter badges.
- Post-match “winner” NFT badge.
- Public leaderboard endpoint.
- Real oracle adapter interface stub.
- Creator watch-party mode.
- AI-generated match commentary for frontend only.

---

## 8. Core User Flow

### Flow A — First-time fan support

1. User opens the app.
2. App detects wallet/network.
3. If wallet is not on X Layer, app prompts to switch/add X Layer.
4. User claims demo `xUSD` from faucet.
5. User selects a team: `BRA`, `ARG`, `FRA`, or `GER`.
6. User mints a soulbound Team Passport.
7. Passport card shows:
   - wallet;
   - selected team;
   - loyalty discount;
   - user rank;
   - contribution score.
8. User swaps `xUSD → team token`.
9. Hook runs `beforeSwap`:
   - identifies pool;
   - reads team;
   - reads match state;
   - computes fee;
   - checks passport discount;
   - checks anti-wash penalty.
10. Swap executes.
11. Hook runs `afterSwap`:
   - calculates volume-based support points;
   - applies loyalty boost or anti-wash reduction;
   - updates team points;
   - updates user contribution;
   - emits `TeamPointsAwarded`.
12. Frontend updates leaderboard.

### Flow B — LP support

1. User selects a team pool.
2. User adds liquidity through supported UI path or scripted demo transaction.
3. Hook runs `afterAddLiquidity`.
4. Hook calculates LP support points from absolute liquidity delta / token amounts.
5. Team receives LP points.
6. User receives personal contribution points.
7. Leaderboard updates.
8. Event log shows transaction and emitted event.

### Flow C — Match-state fee modulation

1. Admin/demo controller selects a pool/team.
2. Admin triggers `LIVE_NORMAL`, `GOAL_SHOCK`, `RED_CARD`, `PENALTY`, or `FINAL_WHISTLE`.
3. Registry emits `MatchStateUpdated`.
4. Frontend updates current match state and active fee.
5. User swaps during that match state.
6. Hook runs `beforeSwap` and applies the mapped fee.
7. Event log shows `DynamicFeeApplied`.
8. User sees that the pool behavior changed because of a World Cup event.

### Flow D — Anti-wash protection

1. User performs a swap.
2. Hook records timestamp, block number, direction, and user activity bucket.
3. Same wallet rapidly reverses or repeats a swap in the same pool.
4. Hook detects suspicious behavior:
   - short time since last swap;
   - same pool;
   - opposite direction;
   - low net exposure;
   - repeated action inside cooldown.
5. Hook either:
   - reduces points to zero;
   - applies penalty multiplier;
   - applies higher fee;
   - emits `WashPenaltyApplied`.
6. Frontend shows:
   - “Swap executed, but support points were reduced due to cooldown.”

### Flow E — Judge demo path

1. Open dashboard.
2. Show 4 teams tied at 0.
3. Mint `BRA` passport.
4. Claim `xUSD`.
5. Swap into `BRA`.
6. Watch `BRA` jump to first.
7. Add liquidity to `ARG`.
8. Watch `ARG` gain LP points and catch up.
9. Trigger `GOAL_SHOCK` for `BRA`.
10. Show fee change to `1.50%`.
11. Execute second `BRA` swap.
12. Show fee event + points event.
13. Attempt rapid reverse swap.
14. Show anti-wash penalty.
15. Show contract addresses and explorer links.

---

## 9. Match States and Fee Policy

MatchShield-style dynamic fees are integrated as a module, not the whole product. The main product remains fan-liquidity competition.

### Match state enum

```solidity
enum MatchState {
    PRE_MATCH,
    LIVE_NORMAL,
    GOAL_SHOCK,
    RED_CARD,
    PENALTY,
    FINAL_WHISTLE
}
```

### Fee policy

| Match State | Description | Base LP Fee |
|---|---|---:|
| `PRE_MATCH` | Before kickoff; low volatility | 0.30% |
| `LIVE_NORMAL` | Match is active with normal flow | 0.50% |
| `GOAL_SHOCK` | Goal just happened; high sentiment volatility | 1.50% |
| `RED_CARD` | Disruptive event, directional sentiment shift | 1.00% |
| `PENALTY` | Immediate high-volatility event | 1.25% |
| `FINAL_WHISTLE` | Post-result trading burst | 0.75% |

### Supporter discount

A user with a Team Passport matching the traded team receives a small fee discount, capped so LP protection is not destroyed.

Example MVP discount:

| User condition | Discount |
|---|---:|
| No passport | 0 bps |
| Passport for same team | -5 bps |
| Passport + LP supporter | -10 bps |
| Anti-wash flagged | no discount; penalty fee may apply |

Example:

- `LIVE_NORMAL` base fee: 50 bps.
- Passport discount: 5 bps.
- Final applied fee: 45 bps.

### Anti-wash fee penalty

If the same wallet performs rapid repeated/reversal swaps in the same pool, the Hook applies:

- points multiplier: `0x`;
- optional fee penalty: `+25 bps`;
- emits `WashPenaltyApplied`.

The penalty must be capped. Maximum fee for MVP should be `200 bps` to avoid malicious or confusing behavior.

### Fee precedence

Applied fee should be computed in this order:

```text
baseFee = feeByMatchState[matchState]
discount = supporterDiscount(user, teamId)
penalty = antiWashPenalty(user, poolId, params)
finalFee = clamp(baseFee - discount + penalty, minFee, maxFee)
```

Recommended constants:

```text
MIN_FEE_BPS = 25      // 0.25%
MAX_FEE_BPS = 200     // 2.00%
PASSPORT_DISCOUNT_BPS = 5
LP_SUPPORTER_DISCOUNT_BPS = 5
WASH_PENALTY_BPS = 25
```

---

## 10. Functional Requirements

### FR1 — Team registration

**Requirement:** System must support registering teams and mapping each team to one or more pools.

**Acceptance criteria:**

- Admin can register 4 MVP teams.
- Each team has `teamId`, ticker, name, flag emoji/string, token address, enabled status.
- Each team can be mapped to a Uniswap v4 PoolId.
- Frontend can read all team metadata.

**Suggested function signatures:**

```solidity
function registerTeam(
    bytes32 teamId,
    string calldata name,
    string calldata symbol,
    address token,
    string calldata metadataURI
) external onlyOwner;

function setTeamEnabled(bytes32 teamId, bool enabled) external onlyOwner;

function getTeam(bytes32 teamId) external view returns (Team memory);
```

### FR2 — Pool registration

**Requirement:** System must map Uniswap v4 pools to team IDs so Hook callbacks can resolve which team receives points.

**Acceptance criteria:**

- Admin can map `PoolId` to `teamId`.
- Hook reverts or ignores scoring for unregistered pools.
- Frontend displays pool/team association.

**Suggested function signatures:**

```solidity
function registerPool(
    PoolId poolId,
    bytes32 teamId,
    Currency fanToken,
    Currency quoteToken
) external onlyOwner;

function poolToTeam(PoolId poolId) external view returns (bytes32 teamId);

function isPoolEnabled(PoolId poolId) external view returns (bool);
```

### FR3 — Team Passport mint

**Requirement:** A user can mint one non-transferable Team Passport selecting one team.

**Acceptance criteria:**

- One passport per wallet.
- Passport stores selected `teamId`.
- Passport is soulbound: transfer attempts revert.
- Passport exposes `teamOf(address user)`.
- Hook can read the passport during callbacks.
- User cannot change team in MVP, or can change only once with cooldown if implemented.

**Suggested function signatures:**

```solidity
function mintPassport(bytes32 teamId) external returns (uint256 tokenId);

function teamOf(address user) external view returns (bytes32 teamId);

function hasPassport(address user) external view returns (bool);

function tokenIdOf(address user) external view returns (uint256 tokenId);
```

**Soulbound behavior:**

```solidity
function transferFrom(address, address, uint256) public pure override {
    revert Soulbound();
}
```

### FR4 — Swap support scoring

**Requirement:** Swaps through registered pools must award support points to the pool’s team.

**Acceptance criteria:**

- `afterSwap` is called for registered pools.
- Hook calculates normalized volume points.
- Team total points increase.
- User contribution increases.
- Event is emitted with pool, team, user, volume, multiplier, points.
- Anti-wash flagged swaps receive zero or reduced points.

**Scoring formula:**

```text
volumePoints = normalizedQuoteVolume / POINT_UNIT
loyaltyMultiplier = 120% if passport team == pool team else 100%
washMultiplier = 0% if flagged else 100%
finalPoints = volumePoints * loyaltyMultiplier * washMultiplier
```

Recommended MVP constants:

```text
POINT_UNIT = 1e18 xUSD equivalent
LOYALTY_MULTIPLIER_BPS = 12000
DEFAULT_MULTIPLIER_BPS = 10000
WASH_MULTIPLIER_BPS = 0
```

For fast demo, if exact quote-normalization is hard, use absolute `amountSpecified` with a clear note: “MVP points use demo-token amount as normalized volume.”

### FR5 — LP support scoring

**Requirement:** Adding liquidity must award LP support points to the team.

**Acceptance criteria:**

- `afterAddLiquidity` records points for positive liquidity deltas.
- LP points are stored separately from swap points.
- Team total score includes both swap and LP points.
- User contribution includes LP points.
- Event is emitted.

**Scoring formula:**

```text
lpPoints = normalizedLiquidityAmount / LP_POINT_UNIT
finalTeamScore = swapPoints + (lpPoints * LP_WEIGHT_BPS / 10000)
```

Recommended constants:

```text
LP_WEIGHT_BPS = 15000    // LP actions are worth 1.5x swap actions
LP_POINT_UNIT = 1e18
```

### FR6 — Dynamic fee computation

**Requirement:** `beforeSwap` must calculate and apply an active fee using match state, supporter discount, and anti-wash penalty.

**Acceptance criteria:**

- Match state is readable per pool/team.
- Dynamic fee pool is configured correctly.
- Fee is returned or updated using Uniswap v4-supported dynamic fee mechanism.
- Event emitted with base fee, discount, penalty, final fee.
- Fee stays inside min/max bounds.

**Suggested function signatures:**

```solidity
function getActiveFeeBps(PoolId poolId, address user) public view returns (uint24);

function setFeeForState(MatchState state, uint24 feeBps) external onlyOwner;

function setFeeBounds(uint24 minFeeBps, uint24 maxFeeBps) external onlyOwner;
```

### FR7 — Match state simulator

**Requirement:** Admin/demo controller can update match state for a team/pool.

**Acceptance criteria:**

- UI exposes match-state buttons only in demo/admin mode.
- Contract emits state-change event.
- Hook reads new state on next swap.
- State updates are rate-limited to reduce spam.

**Suggested function signatures:**

```solidity
function setMatchState(
    bytes32 teamId,
    MatchState state,
    string calldata reason
) external onlyController;
```

### FR8 — Anti-wash-trading logic

**Requirement:** Hook must reduce scoring credibility for rapid repetitive or reversal behavior.

**MVP detection signals:**

- same wallet;
- same pool;
- swap within cooldown window;
- opposite direction from last swap;
- repeated low-amount transactions;
- more than N swaps in the same short window.

**Recommended MVP rules:**

```text
If user swaps in same pool within 60 seconds:
    mark cooldown violation
If user reverses direction in same pool within 180 seconds:
    mark reversal violation
If user performs >5 swaps in same pool within 10 minutes:
    mark burst violation
If any violation:
    pointsMultiplier = 0
    optional feePenalty = 25 bps
```

**Acceptance criteria:**

- Violations emit `WashPenaltyApplied`.
- Frontend shows warning.
- Swap still executes unless contract complexity requires revert.
- Leaderboard is not inflated by flagged swaps.

### FR9 — Tournament leaderboard

**Requirement:** Contract and frontend must expose team rankings.

**Acceptance criteria:**

- Team points are stored on-chain.
- Team scoring components are separately readable:
  - swap points;
  - LP points;
  - fan count;
  - total score.
- Frontend ranks teams descending by total score.
- “Group winner” can be shown off-chain in frontend from on-chain data.

**Suggested read functions:**

```solidity
function getTeamScore(bytes32 teamId) external view returns (TeamScore memory);

function getUserContribution(address user, bytes32 teamId) external view returns (UserContribution memory);

function getAllTeams() external view returns (bytes32[] memory);
```

### FR10 — Tournament treasury

**Requirement:** A small hook fee or event-accounted fee must accumulate into a visible tournament treasury.

**MVP options:**

**Option A — Event-only treasury accounting, lower risk:**  
The Hook emits `TreasuryFeeAccounted` based on notional volume. No actual token transfer. This is safer for 3 days if custom accounting creates integration risk.

**Option B — Real hook fee, higher impact:**  
Use custom accounting to collect a small fee into `TournamentTreasury`. Only implement if base Hook works.

**Recommended for hackathon:**  
Implement Option A first. Add Option B only if stable.

**Acceptance criteria:**

- UI shows “Tournament Treasury” counter.
- Events prove treasury accrual logic.
- README states whether treasury is event-accounted or token-settled.

### FR11 — Frontend dashboard

**Requirement:** A judge should be able to run the demo without reading code.

**Acceptance criteria:**

- Wallet connect works.
- X Layer network information is visible.
- User can claim demo tokens.
- User can mint Team Passport.
- User can select team and swap.
- User can trigger match state in demo mode.
- Leaderboard updates from contract reads/events.
- Contract addresses visible.
- UI displays explorer links.

### FR12 — README and submission readiness

**Requirement:** Repository must be understandable to AI and human judges.

**Acceptance criteria:**

README includes:

- one-line pitch;
- screenshots;
- architecture diagram;
- Hook callback explanation;
- deployed addresses;
- X Layer network details;
- setup instructions;
- demo script;
- known limitations;
- future extensions;
- submission links.

---

## 11. Smart Contract Requirements

### Contract 1 — `DemoFanToken.sol`

**Purpose:** Mock country fan tokens for MVP.

**Standard:** ERC-20.

**Constructor:**

```solidity
constructor(
    string memory name_,
    string memory symbol_,
    address owner_
) ERC20(name_, symbol_) Ownable(owner_) {}
```

**Functions:**

```solidity
function mint(address to, uint256 amount) external onlyOwner;

function faucetMint(address to) external;
```

**MVP behavior:**

- Owner deploys and pre-mints to deployer.
- `faucetMint` can be public with cooldown or only owner-controlled.
- Keep token simple; no taxes, no custom transfer logic.

---

### Contract 2 — `DemoQuoteToken.sol`

**Purpose:** Mock stable/quote token for all team pools.

**Symbol:** `xUSD`.

**Functions:**

```solidity
function mint(address to, uint256 amount) external onlyOwner;

function faucetMint(address to) external;
```

**Demo default:**  
Faucet gives `1,000 xUSD` per wallet.

---

### Contract 3 — `TeamPassport.sol`

**Purpose:** Soulbound fan identity NFT.

**Data model:**

```solidity
struct PassportData {
    bytes32 teamId;
    uint64 mintedAt;
    uint64 lastTeamChangeAt;
    bool exists;
}
```

**Storage:**

```solidity
mapping(address => PassportData) public passportOf;
mapping(bytes32 => uint256) public teamFanCount;
mapping(uint256 => address) public ownerOfToken;
mapping(address => uint256) public tokenIdOf;
uint256 public nextTokenId;
```

**Events:**

```solidity
event PassportMinted(
    address indexed fan,
    uint256 indexed tokenId,
    bytes32 indexed teamId
);

event TeamChanged(
    address indexed fan,
    bytes32 indexed oldTeamId,
    bytes32 indexed newTeamId
);
```

**Functions:**

```solidity
function mintPassport(bytes32 teamId) external returns (uint256 tokenId);

function teamOf(address fan) external view returns (bytes32);

function hasPassport(address fan) external view returns (bool);

function isSupporter(address fan, bytes32 teamId) external view returns (bool);
```

**Transfer restrictions:**

All transfer methods must revert:

```solidity
error Soulbound();

function transferFrom(address from, address to, uint256 tokenId) public pure override {
    revert Soulbound();
}

function safeTransferFrom(address from, address to, uint256 tokenId) public pure override {
    revert Soulbound();
}
```

**MVP team-change policy:**  
Recommended: no team changes. This makes the concept cleaner and avoids gameability.

---

### Contract 4 — `XCupLeagueRegistry.sol`

**Purpose:** Shared configuration, team metadata, pool mapping, match state.

**Data structures:**

```solidity
enum MatchState {
    PRE_MATCH,
    LIVE_NORMAL,
    GOAL_SHOCK,
    RED_CARD,
    PENALTY,
    FINAL_WHISTLE
}

struct Team {
    bytes32 teamId;
    string name;
    string symbol;
    address token;
    string metadataURI;
    bool enabled;
    uint64 createdAt;
}

struct PoolConfig {
    PoolId poolId;
    bytes32 teamId;
    Currency fanToken;
    Currency quoteToken;
    bool enabled;
    uint64 registeredAt;
}

struct MatchStateData {
    MatchState state;
    uint64 updatedAt;
    string reason;
    address updatedBy;
}
```

**Storage:**

```solidity
mapping(bytes32 => Team) public teams;
mapping(PoolId => PoolConfig) public poolConfig;
mapping(bytes32 => MatchStateData) public matchStateOfTeam;
bytes32[] public teamIds;

address public controller;
```

**Events:**

```solidity
event TeamRegistered(
    bytes32 indexed teamId,
    string name,
    string symbol,
    address token
);

event PoolRegistered(
    PoolId indexed poolId,
    bytes32 indexed teamId,
    Currency fanToken,
    Currency quoteToken
);

event MatchStateUpdated(
    bytes32 indexed teamId,
    MatchState state,
    uint256 timestamp,
    string reason,
    address indexed updatedBy
);

event ControllerUpdated(address indexed oldController, address indexed newController);
```

**Functions:**

```solidity
function registerTeam(
    bytes32 teamId,
    string calldata name,
    string calldata symbol,
    address token,
    string calldata metadataURI
) external onlyOwner;

function registerPool(
    PoolId poolId,
    bytes32 teamId,
    Currency fanToken,
    Currency quoteToken
) external onlyOwner;

function setMatchState(
    bytes32 teamId,
    MatchState state,
    string calldata reason
) external onlyController;

function setController(address newController) external onlyOwner;

function getTeamIds() external view returns (bytes32[] memory);

function getTeamByPool(PoolId poolId) external view returns (bytes32 teamId);

function getMatchStateByPool(PoolId poolId) external view returns (MatchState);

function isRegisteredPool(PoolId poolId) external view returns (bool);
```

**Validation:**

- `teamId != bytes32(0)`.
- team must exist before pool registration.
- token addresses cannot be zero.
- pool cannot be registered twice unless explicitly updating.
- match-state updates only from controller/owner.

---

### Contract 5 — `XCupLiquidityLeagueHook.sol`

**Purpose:** Core Uniswap v4 Hook.

**Responsibilities:**

1. Set dynamic LP fee before swap.
2. Apply supporter discount.
3. Apply anti-wash penalty.
4. Record swap support points after swap.
5. Record LP support points after add liquidity.
6. Emit transparent scoring and fee events.

**Constructor dependencies:**

```solidity
constructor(
    IPoolManager poolManager_,
    XCupLeagueRegistry registry_,
    TeamPassport passport_,
    address owner_
) BaseHook(poolManager_) Ownable(owner_) {}
```

**Hook permissions:**

```solidity
function getHookPermissions()
    public
    pure
    override
    returns (Hooks.Permissions memory)
{
    return Hooks.Permissions({
        beforeInitialize: false,
        afterInitialize: false,
        beforeAddLiquidity: false,
        afterAddLiquidity: true,
        beforeRemoveLiquidity: false,
        afterRemoveLiquidity: false,
        beforeSwap: true,
        afterSwap: true,
        beforeDonate: false,
        afterDonate: false,
        beforeSwapReturnDelta: false,
        afterSwapReturnDelta: false,
        afterAddLiquidityReturnDelta: false,
        afterRemoveLiquidityReturnDelta: false
    });
}
```

**Callback signatures:**

Exact import paths may vary depending on chosen Uniswap v4 template, but PRD target behavior is:

```solidity
function beforeSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata hookData
)
    external
    override
    returns (bytes4, BeforeSwapDelta, uint24);

function afterSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    BalanceDelta delta,
    bytes calldata hookData
)
    external
    override
    returns (bytes4, int128);

function afterAddLiquidity(
    address sender,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata params,
    BalanceDelta delta,
    BalanceDelta feesAccrued,
    bytes calldata hookData
)
    external
    override
    returns (bytes4, BalanceDelta);
```

**Important implementation note:**  
Use the official Uniswap v4 template/version selected by the team and adjust signatures to match installed package versions. The target callbacks remain `beforeSwap`, `afterSwap`, and `afterAddLiquidity`.

---

### Hook callback logic — `beforeSwap`

**Purpose:** Determine fee and anti-wash status before swap.

**Inputs:**

- `sender`
- `PoolKey key`
- `SwapParams params`
- `hookData`

**Derived values:**

```solidity
PoolId poolId = key.toId();
bytes32 teamId = registry.getTeamByPool(poolId);
address user = resolveUser(sender, hookData);
MatchState state = registry.getMatchStateByPool(poolId);
bool supporter = passport.isSupporter(user, teamId);
AntiWashStatus status = previewAntiWash(user, poolId, params);
uint24 fee = computeFee(poolId, teamId, user, state, status);
```

**Pseudo-code:**

```solidity
function _beforeSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata hookData
)
    internal
    override
    returns (bytes4, BeforeSwapDelta, uint24)
{
    PoolId poolId = key.toId();

    if (!registry.isRegisteredPool(poolId)) {
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }

    address user = _resolveUser(sender, hookData);
    bytes32 teamId = registry.getTeamByPool(poolId);
    MatchState state = registry.getMatchStateByPool(poolId);

    AntiWashStatus memory wash = _previewAntiWash(user, poolId, params);

    FeeBreakdown memory fb = _computeFeeBreakdown(
        poolId,
        teamId,
        user,
        state,
        wash
    );

    emit DynamicFeeApplied(
        poolId,
        teamId,
        user,
        state,
        fb.baseFeeBps,
        fb.discountBps,
        fb.penaltyBps,
        fb.finalFeeBps
    );

    return (
        BaseHook.beforeSwap.selector,
        BeforeSwapDeltaLibrary.ZERO_DELTA,
        _withOverrideFlag(fb.finalFeeBps)
    );
}
```

**Fee behavior:**

- Use dynamic fee pool configuration.
- Return fee override from `beforeSwap` if using per-swap dynamic fee.
- If implementation complexity blocks fee override, fallback to `updateDynamicLPFee` call pattern and document it.

---

### Hook callback logic — `afterSwap`

**Purpose:** Award swap support points.

**Inputs:**

- `sender`
- `PoolKey key`
- `SwapParams params`
- `BalanceDelta delta`
- `hookData`

**Pseudo-code:**

```solidity
function _afterSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    BalanceDelta delta,
    bytes calldata hookData
)
    internal
    override
    returns (bytes4, int128)
{
    PoolId poolId = key.toId();

    if (!registry.isRegisteredPool(poolId)) {
        return (BaseHook.afterSwap.selector, 0);
    }

    address user = _resolveUser(sender, hookData);
    bytes32 teamId = registry.getTeamByPool(poolId);

    AntiWashStatus memory wash = _updateAntiWashState(user, poolId, params);

    uint256 normalizedVolume = _normalizeSwapVolume(key, params, delta);
    uint256 multiplierBps = _getSwapMultiplier(user, teamId, wash);
    uint256 points = normalizedVolume * multiplierBps / 10_000 / POINT_UNIT;

    scores[teamId].swapPoints += points;
    scores[teamId].totalPoints += points;
    contributions[user][teamId].swapPoints += points;
    contributions[user][teamId].lastActionAt = uint64(block.timestamp);

    emit TeamPointsAwarded(
        poolId,
        teamId,
        user,
        PointSource.SWAP,
        normalizedVolume,
        multiplierBps,
        points
    );

    if (wash.isFlagged) {
        emit WashPenaltyApplied(
            poolId,
            teamId,
            user,
            wash.reason,
            wash.penaltyBps,
            block.timestamp
        );
    }

    return (BaseHook.afterSwap.selector, 0);
}
```

**Volume normalization options:**

For MVP:

```text
If xUSD is token0/token1 and delta exposes xUSD amount:
    use absolute xUSD delta.
Else:
    use absolute params.amountSpecified as demo-normalized volume.
```

Do not block demo on perfect volume normalization.

---

### Hook callback logic — `afterAddLiquidity`

**Purpose:** Award LP support points.

**Pseudo-code:**

```solidity
function _afterAddLiquidity(
    address sender,
    PoolKey calldata key,
    IPoolManager.ModifyLiquidityParams calldata params,
    BalanceDelta delta,
    BalanceDelta feesAccrued,
    bytes calldata hookData
)
    internal
    override
    returns (bytes4, BalanceDelta)
{
    PoolId poolId = key.toId();

    if (!registry.isRegisteredPool(poolId)) {
        return (BaseHook.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
    }

    if (params.liquidityDelta <= 0) {
        return (BaseHook.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
    }

    address user = _resolveUser(sender, hookData);
    bytes32 teamId = registry.getTeamByPool(poolId);

    uint256 normalizedLiquidity = _normalizeLiquidity(delta, params.liquidityDelta);
    uint256 points = normalizedLiquidity * LP_WEIGHT_BPS / 10_000 / LP_POINT_UNIT;

    scores[teamId].lpPoints += points;
    scores[teamId].totalPoints += points;
    contributions[user][teamId].lpPoints += points;
    contributions[user][teamId].lastActionAt = uint64(block.timestamp);

    emit TeamPointsAwarded(
        poolId,
        teamId,
        user,
        PointSource.LIQUIDITY,
        normalizedLiquidity,
        LP_WEIGHT_BPS,
        points
    );

    return (BaseHook.afterAddLiquidity.selector, BalanceDeltaLibrary.ZERO_DELTA);
}
```

---

### Hook storage

```solidity
enum PointSource {
    SWAP,
    LIQUIDITY,
    BONUS,
    PENALTY
}

enum WashReason {
    NONE,
    COOLDOWN,
    REVERSAL,
    BURST,
    LOW_VALUE_SPAM
}

struct TeamScore {
    uint256 swapPoints;
    uint256 lpPoints;
    uint256 bonusPoints;
    uint256 penaltyPoints;
    uint256 totalPoints;
    uint64 lastUpdatedAt;
}

struct UserContribution {
    uint256 swapPoints;
    uint256 lpPoints;
    uint256 totalPoints;
    uint64 lastActionAt;
}

struct UserPoolActivity {
    uint64 lastSwapAt;
    uint64 windowStartAt;
    uint32 swapsInWindow;
    bool lastZeroForOne;
    uint256 lastAmountAbs;
}

struct FeeBreakdown {
    uint24 baseFeeBps;
    uint24 discountBps;
    uint24 penaltyBps;
    uint24 finalFeeBps;
}

struct AntiWashStatus {
    bool isFlagged;
    WashReason reason;
    uint24 penaltyBps;
    uint16 pointsMultiplierBps;
}
```

### Hook events

```solidity
event DynamicFeeApplied(
    PoolId indexed poolId,
    bytes32 indexed teamId,
    address indexed user,
    MatchState matchState,
    uint24 baseFeeBps,
    uint24 discountBps,
    uint24 penaltyBps,
    uint24 finalFeeBps
);

event TeamPointsAwarded(
    PoolId indexed poolId,
    bytes32 indexed teamId,
    address indexed user,
    PointSource source,
    uint256 rawAmount,
    uint256 multiplierBps,
    uint256 points
);

event WashPenaltyApplied(
    PoolId indexed poolId,
    bytes32 indexed teamId,
    address indexed user,
    WashReason reason,
    uint24 feePenaltyBps,
    uint256 timestamp
);

event LeaderboardUpdated(
    bytes32 indexed teamId,
    uint256 totalPoints,
    uint256 swapPoints,
    uint256 lpPoints
);

event TreasuryFeeAccounted(
    PoolId indexed poolId,
    bytes32 indexed teamId,
    address token,
    uint256 notionalAmount,
    uint256 treasuryPoints
);
```

### Hook read functions

```solidity
function getTeamScore(bytes32 teamId) external view returns (TeamScore memory);

function getUserContribution(
    address user,
    bytes32 teamId
) external view returns (UserContribution memory);

function getUserPoolActivity(
    address user,
    PoolId poolId
) external view returns (UserPoolActivity memory);

function previewFee(
    PoolId poolId,
    address user
) external view returns (FeeBreakdown memory);

function previewAntiWash(
    address user,
    PoolId poolId
) external view returns (AntiWashStatus memory);
```

### Contract 6 — `TournamentTreasury.sol` optional

**Purpose:** Visible tournament treasury/reserve.

**MVP recommendation:**  
Use event-accounted treasury first. If real token collection is stable, add this.

**Functions:**

```solidity
function recordAccrual(
    PoolId poolId,
    bytes32 teamId,
    address token,
    uint256 amount
) external onlyHook;

function balanceByTeam(bytes32 teamId, address token) external view returns (uint256);
```

---

## 12. Technical Architecture

### High-level architecture

```text
Frontend
  ├─ Wallet/network manager
  ├─ Faucet panel
  ├─ Passport mint flow
  ├─ Team leaderboard
  ├─ Swap module
  ├─ Liquidity support module
  ├─ Match-state simulator
  ├─ Anti-wash status panel
  ├─ Event log
  └─ Contract proof panel

X Layer smart contracts
  ├─ DemoFanToken: BRA
  ├─ DemoFanToken: ARG
  ├─ DemoFanToken: FRA
  ├─ DemoFanToken: GER
  ├─ DemoQuoteToken: xUSD
  ├─ TeamPassport
  ├─ XCupLeagueRegistry
  ├─ XCupLiquidityLeagueHook
  └─ Optional TournamentTreasury

Uniswap v4
  ├─ PoolManager
  ├─ BRA/xUSD pool
  ├─ ARG/xUSD pool
  ├─ FRA/xUSD pool
  ├─ GER/xUSD pool
  └─ Shared reusable Hook
```

### Data flow — swap

```text
User signs swap
  ↓
Swap router / PoolManager
  ↓
XCupLiquidityLeagueHook.beforeSwap
  ├─ resolves pool → team
  ├─ reads match state
  ├─ checks passport
  ├─ previews anti-wash status
  └─ returns dynamic fee override
  ↓
Core swap executes
  ↓
XCupLiquidityLeagueHook.afterSwap
  ├─ normalizes volume
  ├─ updates anti-wash state
  ├─ calculates points
  ├─ updates team score
  ├─ updates user contribution
  └─ emits events
  ↓
Frontend event listener updates leaderboard
```

### Data flow — LP add

```text
User adds liquidity
  ↓
PoolManager modifies liquidity
  ↓
XCupLiquidityLeagueHook.afterAddLiquidity
  ├─ resolves pool → team
  ├─ normalizes liquidity contribution
  ├─ applies LP weighting
  ├─ updates team LP score
  ├─ updates user contribution
  └─ emits TeamPointsAwarded
```

### Data flow — match state

```text
Admin/demo UI clicks "Goal Shock"
  ↓
XCupLeagueRegistry.setMatchState(teamId, GOAL_SHOCK, reason)
  ↓
MatchStateUpdated emitted
  ↓
Frontend updates match card
  ↓
Next swap through team pool
  ↓
Hook reads GOAL_SHOCK and applies 1.50% fee
```

### Network architecture

#### X Layer mainnet

```text
Network name: X Layer mainnet
RPC URL: https://rpc.xlayer.tech or https://xlayerrpc.okx.com
Chain ID: 196
Token symbol: OKB
Block explorer: https://www.okx.com/web3/explorer/xlayer
```

#### X Layer testnet

```text
Network name: X Layer testnet
RPC URL: https://testrpc.xlayer.tech/terigon or https://xlayertestrpc.okx.com/terigon
Chain ID: 1952
Token symbol: OKB
Block explorer: https://www.okx.com/web3/explorer/xlayer-test
```

### Recommended tech stack

#### Smart contracts

- Solidity `^0.8.24` or compatible with chosen Uniswap v4 template.
- Foundry for build/test/deploy.
- OpenZeppelin for ERC-20/ERC-721/Ownable primitives.
- Uniswap v4-core and v4-periphery/template.

#### Frontend

- Next.js or Vite React.
- TypeScript.
- wagmi + viem.
- RainbowKit or simple injected wallet connector.
- Tailwind CSS.
- Event reads via viem logs or direct contract calls.

#### Deployment scripts

- Foundry scripts:
  - `DeployTokens.s.sol`
  - `DeployRegistryPassportHook.s.sol`
  - `CreatePools.s.sol`
  - `SeedLiquidity.s.sol`
  - `DemoScenario.s.sol`

### Repository structure

```text
x-cup-liquidity-league/
  contracts/
    src/
      DemoFanToken.sol
      DemoQuoteToken.sol
      TeamPassport.sol
      XCupLeagueRegistry.sol
      XCupLiquidityLeagueHook.sol
      TournamentTreasury.sol
    script/
      DeployTokens.s.sol
      DeployCore.s.sol
      CreatePools.s.sol
      SeedDemo.s.sol
    test/
      Hook.beforeSwap.t.sol
      Hook.afterSwap.t.sol
      Hook.afterAddLiquidity.t.sol
      AntiWash.t.sol
      Passport.t.sol
  frontend/
    app/
      page.tsx
      team/[teamId]/page.tsx
    components/
      Leaderboard.tsx
      TeamCard.tsx
      PassportCard.tsx
      SwapPanel.tsx
      LiquidityPanel.tsx
      MatchStateSimulator.tsx
      EventLog.tsx
      ContractProofPanel.tsx
    lib/
      chains.ts
      contracts.ts
      hooks.ts
      format.ts
  README.md
  DEMO.md
  SUBMISSION.md
```

---

## 13. Data Model

### Team

```typescript
type Team = {
  teamId: `0x${string}`;
  name: string;
  symbol: string;
  token: `0x${string}`;
  metadataURI: string;
  enabled: boolean;
  createdAt: bigint;
};
```

Example teams:

```text
BRA = keccak256("BRA")
ARG = keccak256("ARG")
FRA = keccak256("FRA")
GER = keccak256("GER")
```

### PoolConfig

```typescript
type PoolConfig = {
  poolId: `0x${string}`;
  teamId: `0x${string}`;
  fanToken: `0x${string}`;
  quoteToken: `0x${string}`;
  enabled: boolean;
  registeredAt: bigint;
};
```

### TeamScore

```typescript
type TeamScore = {
  swapPoints: bigint;
  lpPoints: bigint;
  bonusPoints: bigint;
  penaltyPoints: bigint;
  totalPoints: bigint;
  lastUpdatedAt: bigint;
};
```

### UserContribution

```typescript
type UserContribution = {
  swapPoints: bigint;
  lpPoints: bigint;
  totalPoints: bigint;
  lastActionAt: bigint;
};
```

### Passport

```typescript
type Passport = {
  owner: `0x${string}`;
  tokenId: bigint;
  teamId: `0x${string}`;
  mintedAt: bigint;
  exists: boolean;
};
```

### MatchStateData

```typescript
enum MatchState {
  PRE_MATCH = 0,
  LIVE_NORMAL = 1,
  GOAL_SHOCK = 2,
  RED_CARD = 3,
  PENALTY = 4,
  FINAL_WHISTLE = 5
}

type MatchStateData = {
  state: MatchState;
  updatedAt: bigint;
  reason: string;
  updatedBy: `0x${string}`;
};
```

### FeeBreakdown

```typescript
type FeeBreakdown = {
  baseFeeBps: number;
  discountBps: number;
  penaltyBps: number;
  finalFeeBps: number;
};
```

### AntiWashStatus

```typescript
enum WashReason {
  NONE = 0,
  COOLDOWN = 1,
  REVERSAL = 2,
  BURST = 3,
  LOW_VALUE_SPAM = 4
}

type AntiWashStatus = {
  isFlagged: boolean;
  reason: WashReason;
  penaltyBps: number;
  pointsMultiplierBps: number;
};
```

### Frontend derived leaderboard row

```typescript
type LeaderboardRow = {
  rank: number;
  teamId: `0x${string}`;
  name: string;
  symbol: string;
  totalPoints: bigint;
  swapPoints: bigint;
  lpPoints: bigint;
  fanCount: bigint;
  currentState: MatchState;
  activeFeeBps: number;
  poolId: `0x${string}`;
};
```

---

## 14. UX Requirements

The UI must make three things instantly obvious:

1. fans are competing by team;
2. swaps/LP actions update the on-chain leaderboard;
3. the Uniswap v4 Hook controls scoring and fees.

### Visual principle

The app should feel like a World Cup scoreboard fused with a DeFi pool dashboard.

### Main screen sections

#### Header

Required:

- Product name: `X Cup Liquidity League`
- Subtitle: `World Cup fan battles powered by Uniswap v4 Hooks on X Layer`
- Wallet connect button
- X Layer network badge
- Link to contracts/readme

#### Hero explainer

Copy:

```text
Pick a team. Mint your Team Passport. Swap or LP through its Uniswap v4 pool. The Hook converts your activity into live leaderboard points.
```

Must include three small chips:

- `No betting`
- `On-chain fan support`
- `Reusable v4 Hook`

#### Team Passport card

States:

1. No wallet connected.
2. Wallet connected, no passport.
3. Passport minted.

No passport state:

- Team selector.
- `Mint Passport` button.
- Explanation: “Soulbound fan identity. Gives supporter fee discount and point boost.”

Minted state:

- Selected team.
- Token ID.
- Supporter discount.
- Personal contribution score.
- “Soulbound” label.

#### Leaderboard

Columns:

- Rank
- Team
- Total Points
- Swap Points
- LP Points
- Fans
- Match State
- Active Fee
- Pool/Explorer link

Sorting:

- Descending by total points.
- Tie-breaker: LP points, then fan count.

#### Team cards

Each team card should show:

- country/team name;
- token ticker;
- score;
- current fee;
- current match state;
- “Support” button;
- mini progress bar;
- pool ID short hash.

#### Swap panel

Required fields:

- from token;
- to token;
- amount;
- estimated fee;
- supporter discount;
- anti-wash warning;
- expected points;
- swap button.

Before swap, show:

```text
This swap supports BRA and may award ~X points. Rapid repeat/reversal swaps may receive 0 points.
```

#### Liquidity support panel

MVP can be simplified:

- amount inputs;
- “Add demo liquidity” button;
- estimated LP points;
- explanation: “LP support earns 1.5x points because it strengthens team liquidity.”

If full LP UI is risky, include a scripted admin/demo button that sends the add-liquidity transaction and clearly label it as demo.

#### Match-state simulator

Visible in demo/admin mode.

Buttons:

- Pre-Match
- Live
- Goal Shock
- Red Card
- Penalty
- Final Whistle

Each button:

- sends `setMatchState`;
- updates state card;
- updates fee preview.

#### Anti-wash panel

Show per connected user:

- last swap time;
- cooldown status;
- swap burst count;
- whether next swap is eligible for points.

Simple labels:

- `Clean`
- `Cooldown active`
- `Reversal risk`
- `Burst limit hit`

#### Event log

Must show:

- `PassportMinted`
- `MatchStateUpdated`
- `DynamicFeeApplied`
- `TeamPointsAwarded`
- `WashPenaltyApplied`
- `LeaderboardUpdated`

Each event row:

- event name;
- team;
- points/fee;
- short tx hash;
- explorer link.

#### Contract proof panel

List:

- Hook address
- Registry address
- Passport address
- Token addresses
- Pool IDs
- Chain ID
- Explorer links
- GitHub link

### UX acceptance criteria

A judge should be able to answer these within 10 seconds:

- What is the product?  
  “A World Cup liquidity leaderboard.”

- Why does it need Uniswap v4 Hooks?  
  “The Hook records points and changes fees from swap/liquidity callbacks.”

- Is it gambling?  
  “No. It scores fan activity, not match predictions.”

- Is it deployed?  
  “Yes. Contract addresses are visible.”

- Can I see on-chain proof?  
  “Yes. Events and explorer links are visible.”

---

## 15. Success Metrics

### Hackathon completion metrics

| Metric | Target |
|---|---:|
| Hook deployed on X Layer testnet/mainnet | 1 |
| Registered team pools | 4 target; 2 minimum |
| Successful hooked swaps | 4+ |
| Successful LP add events | 1+ |
| Team Passport mints | 2+ |
| Match-state fee changes demonstrated | 2+ states |
| Anti-wash penalty demonstrated | 1+ |
| Demo video duration | 1–3 minutes |
| README completeness | 100% checklist |
| Contract addresses included | all deployed contracts |

### Product demo metrics

| Metric | Target |
|---|---:|
| Time to understand concept | <10 seconds |
| Time from wallet connect to first support action | <60 seconds |
| Time to show leaderboard update | <15 seconds after tx confirmation |
| Number of visible hook-driven events | 5+ |
| Number of teams visible | 4 |
| Number of “wow” moments | 2 |

### Innovation metrics

- One Hook reused across multiple pools.
- At least three callback-driven behaviors:
  - dynamic fee;
  - swap scoring;
  - LP scoring;
  - anti-wash penalty.
- No prediction-market mechanics.
- Team Passport creates composable identity/loyalty layer.

### Market-potential metrics

- X share text generated.
- Country/team identity is prominent.
- Leaderboard gives repeated reason to return.
- Demo supports “community can rally team” narrative.

---

## 16. Acceptance Criteria

The MVP is complete when all Critical criteria and at least 80% of Important criteria are done.

### Critical

- [ ] `XCupLiquidityLeagueHook` deployed on X Layer testnet or mainnet.
- [ ] Hook is attached to at least 2 Uniswap v4 pools.
- [ ] At least 2 team fan tokens and `xUSD` are deployed.
- [ ] Team Passport can be minted.
- [ ] `beforeSwap` computes dynamic fee using match state.
- [ ] `afterSwap` awards team points.
- [ ] `afterAddLiquidity` awards LP points or scripted LP action is demonstrated.
- [ ] Anti-wash penalty can be triggered and emits event.
- [ ] Frontend displays leaderboard from contract state.
- [ ] Demo shows match-state fee change.
- [ ] Contract addresses and explorer links are in UI/README.
- [ ] Demo video recorded.
- [ ] Dedicated X account/post prepared.
- [ ] Google Form submitted before deadline.

### Important

- [ ] 4 teams deployed and visible.
- [ ] 4 team pools initialized.
- [ ] Event log auto-updates.
- [ ] User contribution score visible.
- [ ] Fee preview before swap.
- [ ] Token faucet works.
- [ ] README includes architecture diagram.
- [ ] Submission post tags `@XLayerOfficial`, `@Uniswap`, and `@flapdotsh` if required by current terms.
- [ ] UI is mobile-responsive enough for video recording.

### Nice

- [ ] 8 teams.
- [ ] Fee history table.
- [ ] Top fan ranking.
- [ ] Treasury counter.
- [ ] X share card.
- [ ] Real hook-fee token collection.
- [ ] Public deployed frontend URL.

---

## 17. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|---|---:|---:|---|
| Uniswap v4 Hook deployment complexity | High | High | Start from official v4 Hook template; implement minimal callbacks first |
| Dynamic fee override integration issues | High | Medium | Make scoring Hook work first; if override fails, use documented dynamic-fee update path or simulate fee preview with event proof |
| Pool creation takes too long | High | Medium | Deploy 2 pools minimum; mock remaining teams in UI only if needed |
| LP add flow is hard in frontend | Medium | High | Use script-driven LP transaction and show event proof |
| Anti-wash logic creates false positives | Medium | Medium | Penalize points, not swap execution; keep logic transparent |
| Project looks like wash-trading incentive | High | Medium | Emphasize anti-wash, point caps, no rewards/payouts, demo-only tokens |
| Project looks like gambling | High | Low | Avoid predictions, odds, payouts, wagers, and “bet” language |
| Hook fee custom accounting breaks swaps | High | Medium | Use event-accounted treasury first; only implement real collection after core is stable |
| Frontend too large for 3 days | Medium | High | Build one dashboard page; no full routing except optional team detail |
| X Layer RPC/testnet instability | High | Medium | Test deployment early; keep local Anvil demo fallback for video, but submit X Layer addresses |
| AI judges miss value proposition | Medium | Medium | README must explicitly map features to judging criteria and Hook callbacks |
| Human judges do not understand points | Medium | Medium | Visual leaderboard and demo narration must be simple |
| Security concerns in Hook | High | Medium | No external calls except trusted registry/passport reads; no unbounded loops; cap fees; owner controls limited |

### Security constraints

- No unbounded iteration inside Hook callbacks.
- No arbitrary external calls inside callbacks except known registry/passport.
- Fee values must be capped.
- Anti-wash logic must not revert normal users unless necessary.
- Pool registration must be owner-only.
- Match-state updates must be controller-only.
- Passport transfers must revert.
- Avoid storing large strings in high-frequency Hook path.
- Events should be verbose; storage should be minimal.

---

## 18. Implementation Plan

Deadline: **May 28, 2026, 23:59 UTC**. Plan assumes roughly 3 days from May 25, 2026.

### Day 1 — Contracts first

**Goal:** Local tests proving the Hook drives scoring and fee logic.

#### Morning

- Initialize Foundry project.
- Install dependencies:
  - Uniswap v4-core/periphery/template;
  - OpenZeppelin;
  - forge-std.
- Create contracts:
  - `DemoFanToken.sol`;
  - `DemoQuoteToken.sol`;
  - `TeamPassport.sol`;
  - `XCupLeagueRegistry.sol`;
  - `XCupLiquidityLeagueHook.sol`.

#### Midday

- Implement team registration.
- Implement pool registration.
- Implement Team Passport mint.
- Implement match-state enum and fee table.
- Implement score storage.

#### Afternoon

- Implement `beforeSwap`:
  - resolve pool;
  - team mapping;
  - match-state fee;
  - supporter discount;
  - anti-wash preview;
  - fee event.
- Implement `afterSwap`:
  - volume normalization;
  - points calculation;
  - anti-wash update;
  - event emission.

#### Evening

- Implement `afterAddLiquidity`.
- Write tests:
  - passport mint;
  - team/pool registration;
  - match-state fee calculation;
  - swap points;
  - LP points;
  - anti-wash cooldown.
- Freeze feature scope.

**Day 1 exit criteria:**

- Contracts compile.
- Core tests pass locally.
- Hook callbacks are selected and wired.
- README draft includes architecture.

---

### Day 2 — Deploy, create pools, prove on-chain

**Goal:** X Layer deployment and on-chain proof.

#### Morning

- Add X Layer testnet configuration.
- Deploy tokens:
  - `xUSD`;
  - `BRA`;
  - `ARG`;
  - `FRA`;
  - `GER`.
- Deploy:
  - `TeamPassport`;
  - `XCupLeagueRegistry`;
  - `XCupLiquidityLeagueHook`.

#### Midday

- Create/initialize V4 pools with Hook:
  - `BRA/xUSD`;
  - `ARG/xUSD`;
  - `FRA/xUSD`;
  - `GER/xUSD`.
- Register teams and pools in registry.
- Seed initial liquidity.
- Run first swap through a hooked pool.

#### Afternoon

- Trigger match-state update.
- Run swap under new fee.
- Add liquidity transaction.
- Trigger anti-wash scenario.
- Capture transaction hashes.

#### Evening

- Verify contracts if explorer supports it.
- Create `deployments/xlayer-testnet.json`.
- Update README addresses.
- Write `DEMO.md` with exact transaction sequence.

**Day 2 exit criteria:**

- Hook address is deployed.
- At least 2 pools work; 4 preferred.
- At least 1 swap event and 1 scoring event exist on X Layer.
- Deployment addresses are final enough for frontend.

---

### Day 3 — Frontend, polish, video, submission

**Goal:** A clean dashboard and winning demo narrative.

#### Morning

- Build dashboard shell:
  - wallet connect;
  - network detection;
  - contract config;
  - team cards;
  - leaderboard.
- Add token faucet.
- Add Team Passport mint.
- Add contract reads.

#### Midday

- Add swap panel.
- Add match-state simulator.
- Add LP support/script button.
- Add event log.
- Add contract proof panel.

#### Afternoon

- Run full demo script.
- Fix UX blockers.
- Add loading/confirmation states.
- Add explorer links.
- Add anti-wash warning.

#### Evening

- Record 1–3 minute demo video.
- Create dedicated X account/post.
- Final README polish.
- Submit Google Form.
- Pin final post with required tags.

**Day 3 exit criteria:**

- Public repo ready.
- Frontend deployed or local demo recorded.
- Demo video recorded.
- Submission checklist complete.
- X post published.

---

## 19. Demo Script

Target length: **90–150 seconds**.

### Demo title

```text
X Cup Liquidity League — World Cup fan battles powered by Uniswap v4 Hooks on X Layer
```

### Scene 1 — Setup, 0:00–0:15

Show dashboard with 4 teams at zero or near-zero points.

Narration:

```text
This is X Cup Liquidity League. It is not a betting app. It is a World Cup fan battle where every swap and liquidity action through a Uniswap v4 pool becomes on-chain team support.
```

Show:

- Hook address.
- X Layer testnet/mainnet badge.
- 4 team leaderboard.

### Scene 2 — Mint Team Passport, 0:15–0:30

Action:

- Connect wallet.
- Select Brazil.
- Mint Team Passport.

Narration:

```text
First I pick my team and mint a soulbound Team Passport. This gives my wallet supporter identity, a small fee discount, and a points boost when I support Brazil.
```

Show:

- `PassportMinted` event.
- Passport card.

### Scene 3 — Swap support, 0:30–0:50

Action:

- Claim `xUSD`.
- Swap `xUSD → BRA`.

Narration:

```text
Now I swap through the Brazil pool. The Uniswap v4 Hook runs before the swap to compute the active fee, then after the swap it converts my volume into team points.
```

Show:

- `DynamicFeeApplied`.
- `TeamPointsAwarded`.
- Brazil moves to #1.

Wow moment #1:

```text
Leaderboard updates from the Hook event.
```

### Scene 4 — LP support, 0:50–1:10

Action:

- Add liquidity to Argentina pool or run script.
- Show Argentina gaining LP points.

Narration:

```text
Fans can also support teams by strengthening liquidity. LP support is weighted higher because it improves market depth, not just trading volume.
```

Show:

- `TeamPointsAwarded` with `PointSource.LIQUIDITY`.
- Argentina climbs.

### Scene 5 — Match event fee shock, 1:10–1:35

Action:

- Trigger `GOAL_SHOCK` for Brazil.
- Show fee changes from normal to `1.50%`.
- Execute another swap.

Narration:

```text
During a goal shock, the same Hook changes the pool fee to protect LPs during match-driven volatility. This MatchShield module makes the league feel live without turning it into gambling.
```

Show:

- `MatchStateUpdated`.
- `DynamicFeeApplied` with 150 bps.
- Swap succeeds.

Wow moment #2:

```text
The pool behavior changes because of a World Cup event.
```

### Scene 6 — Anti-wash proof, 1:35–1:55

Action:

- Attempt rapid reverse/repeat swap.
- Show warning/penalty.

Narration:

```text
To prevent fake fan activity, the Hook detects rapid repeat or reversal swaps. The trade can still execute, but leaderboard points are reduced to zero.
```

Show:

- `WashPenaltyApplied`.
- “0 points awarded” or reduced points.

### Scene 7 — Close, 1:55–2:15

Show:

- Final leaderboard.
- Contract addresses.
- Explorer links.

Narration:

```text
X Cup Liquidity League turns Uniswap v4 Hook callbacks into fan engagement infrastructure: swaps, liquidity, dynamic fees, anti-wash scoring, and a live on-chain tournament leaderboard on X Layer.
```

End frame:

```text
Built for X Layer Build X: X Cup Hackathon
```

---

## 20. Future Extensions

Only mention these after MVP is working.

### Real match oracle

- Integrate sports data provider.
- Replace admin match-state controller.
- Automatic event windows:
  - goal shock for 10 minutes;
  - penalty for 5 minutes;
  - final whistle for 15 minutes.

### 32-team tournament

- Full World Cup groups.
- Knockout bracket.
- Team progression visualizations.
- Seasonal reset.

### Fan rewards

- Non-financial badges.
- Top supporter NFTs.
- Shareable proof cards.
- No outcome-based payouts.

### Creator watch parties

- Creators host team-specific watch rooms.
- Pool activity powers watch-party rankings.
- Hook can split optional hook fees to creator/community treasury.

### AI commentary layer

- AI summarizes on-chain fan momentum.
- “Brazil fans are surging after the goal shock.”
- Pure frontend/analytics extension, not needed for core MVP.

### Advanced anti-abuse

- Net exposure scoring.
- Wallet age heuristics.
- Minimum notional thresholds.
- Cross-pool wash detection.
- Sybil-resistant supporter badges.

### Real hook-fee treasury

- Implement actual hook-fee collection.
- Route small fee to tournament treasury.
- Use treasury for grants, badges, or community rewards.

### Public API/indexer

- Lightweight indexer for leaderboard.
- Public JSON endpoint.
- Social embeds for X posts.

---

## 21. Submission Checklist

### Product

- [ ] Project name finalized: `X Cup Liquidity League`.
- [ ] One-line pitch finalized.
- [ ] No betting/prediction-market framing.
- [ ] 4-team MVP implemented or 2-team minimum if time constrained.
- [ ] Team Passport works.
- [ ] Leaderboard works.
- [ ] Match-state simulator works.
- [ ] Anti-wash scenario works.

### Smart contracts

- [ ] `DemoQuoteToken` deployed.
- [ ] `DemoFanToken` deployed for each team.
- [ ] `TeamPassport` deployed.
- [ ] `XCupLeagueRegistry` deployed.
- [ ] `XCupLiquidityLeagueHook` deployed.
- [ ] V4 pools created with Hook attached.
- [ ] Pool IDs recorded.
- [ ] Hook events emitted on X Layer.
- [ ] Contracts verified if possible.
- [ ] Deployment JSON committed.

### Required Hook proof

- [ ] `beforeSwap` is implemented and demonstrated.
- [ ] `afterSwap` is implemented and demonstrated.
- [ ] `afterAddLiquidity` is implemented and demonstrated.
- [ ] Dynamic fee event shown.
- [ ] Team points event shown.
- [ ] Anti-wash penalty event shown.
- [ ] LP points event shown.

### Frontend

- [ ] Wallet connect.
- [ ] X Layer chain detection.
- [ ] Faucet.
- [ ] Passport mint.
- [ ] Leaderboard.
- [ ] Team cards.
- [ ] Swap panel.
- [ ] Liquidity support panel or scripted demo button.
- [ ] Match-state simulator.
- [ ] Event log.
- [ ] Contract proof panel.
- [ ] Explorer links.

### README

- [ ] Project summary.
- [ ] Hackathon fit.
- [ ] Architecture diagram.
- [ ] Hook callback explanation.
- [ ] Contract addresses.
- [ ] Pool IDs.
- [ ] Setup instructions.
- [ ] Deployment instructions.
- [ ] Demo instructions.
- [ ] Known limitations.
- [ ] Future extensions.
- [ ] Security notes.
- [ ] No-gambling disclaimer.

### Demo video

- [ ] 1–3 minutes.
- [ ] Shows team selection.
- [ ] Shows passport mint.
- [ ] Shows swap support.
- [ ] Shows leaderboard update.
- [ ] Shows LP support.
- [ ] Shows match-state fee change.
- [ ] Shows anti-wash penalty.
- [ ] Shows contract addresses/explorer links.
- [ ] Ends with clear pitch.

### X / social

- [ ] Dedicated X account created.
- [ ] Bio includes X Cup Liquidity League.
- [ ] At least one build-in-public post.
- [ ] Final submission post includes demo video/GitHub.
- [ ] Tags `@XLayerOfficial`.
- [ ] Tags `@Uniswap` and `@flapdotsh` if required by current terms.
- [ ] Posts consistently during remaining hackathon period.

### Submission

- [ ] GitHub repo public or accessible.
- [ ] Demo video uploaded.
- [ ] Deployed frontend URL available if possible.
- [ ] Contract addresses included.
- [ ] Google Form submitted before May 28, 2026, 23:59 UTC.
- [ ] Wallet address for prize provided if required.
- [ ] Team member info complete.

---

## Source Notes

This PRD was structured to match the attached MatchShield PRD reference while adapting it to the larger X Cup Liquidity League scope. External implementation constraints are based on:

- OKX X Layer Build X: X Cup Hackathon public page: https://web3.okx.com/xlayer/build-x-hackathon/xcup
- Uniswap v4 Hooks documentation: https://developers.uniswap.org/docs/protocols/v4/concepts/hooks
- Uniswap v4 Dynamic Fees documentation: https://developers.uniswap.org/docs/protocols/v4/concepts/dynamic-fees
- Uniswap v4 Custom Accounting / Hook Fees documentation: https://developers.uniswap.org/docs/protocols/v4/guides/custom-accounting
- X Layer network information: https://web3.okx.com/xlayer/docs/developer/build-on-xlayer/network-information
