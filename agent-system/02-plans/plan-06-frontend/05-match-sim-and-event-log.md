---
phase-id: P06-05
plan: P06
revised-on: 2026-05-26
---

# P06-05 — Match-State Simulator + Event Log + Contract Proof

## Goal

Three panels that complete the demo:
1. Match-state simulator (admin/demo controller buttons).
2. Live event log (last N hook events).
3. Contract proof panel (addresses + explorer links).

## Scope (In)

- `components/MatchStateSimulator.tsx`:
  - team selector.
  - 6 buttons, one per `MatchState` (`PRE_MATCH`, `LIVE_NORMAL`, `GOAL_SHOCK`, `RED_CARD`, `PENALTY`, `FINAL_WHISTLE`).
  - "Reason" text field (optional, default "demo").
  - calls `registry.setMatchState(teamId, state, reason)` if connected wallet is the controller; otherwise show "Connect as controller to use this panel".
  - visible only in dev mode by default OR behind a `?admin=1` URL flag.
- `components/EventLog.tsx`:
  - subscribes to logs (viem `watchContractEvent` or `useWatchContractEvent`) for:
    - `Hook.DynamicFeeApplied`
    - `Hook.TeamPointsAwarded`
    - `Hook.WashPenaltyApplied`
    - `Registry.MatchStateUpdated`
  - displays last 20 events: timestamp, event name, key fields, explorer tx link.
  - color/icon per event type.
- `components/ContractProofPanel.tsx`:
  - lists every deployed contract address (token × 5, registry, passport, hook, pool × 4) with explorer links.
  - reads from `lib/deployments`.
  - includes the chain id and network name.
- Wire all three into `app/page.tsx` below the swap/LP panels.

## Scope (Out)

- Persistent event history (in-memory only; lost on reload — acceptable for demo).
- Event filtering UI.
- Treasury display (treasury is optional — only add a tile if the contract was deployed).

## Acceptance Criteria

- [ ] Match-state simulator works for the controller wallet.
- [ ] Event log shows real-time events from the Hook within ~5 s of the tx.
- [ ] Contract proof panel renders all addresses with working explorer links.
- [ ] Full demo path (faucet → passport → swap → LP → goal_shock → swap → rapid-reverse) runs from the UI alone.
- [ ] Screenshot saved per panel.

## Risks / Pitfalls

- `useWatchContractEvent` on viem can be flaky on the public testnet RPC. Fall back to polling `getLogs` every 5 s.
- Match-state simulator buttons spam-clicking can rate-limit the RPC. Disable each button for 3 s after click.
- Don't ship the admin panel without the gate — judges should see it (`?admin=1`), random testnet visitors should not.

## Reference

- Brief: "Demo Path", "Match States & Fees".
- PRD §14 UX Requirements — Match Event Simulator, Event Log, Contract Addresses Panel.
