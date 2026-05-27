---
directive-id: D0
phase-id: P00-00
created-at: 2026-05-26T00:00Z
time-budget-hours: 1.5
revision: 1
---

# Directive — D0 for <phase-id>

## Goal

<1–3 sentences. The user-visible outcome of this phase. What "done" looks like in plain English.>

## Scope (In)

- <specific, actionable bullet>
- <specific, actionable bullet>

## Scope (Out)

- <bullet — explicitly NOT this phase, deflect to phase ID where it lives>
- <bullet>

## Reference Files

- `agent-system/00-brief/project-brief.md` (sections: <list>)
- `agent-system/02-plans/plan-XX-name/<phase-file>.md`
- `project-idea/X_Cup_Liquidity_League_PRD.md` (sections: <only if brief is insufficient>)

## Acceptance Criteria

- [ ] <testable outcome>
- [ ] <testable outcome>
- [ ] Report file `agent-system/04-summaries/reports/<phase-id>.md` exists and is fully filled.
- [ ] State counter updated; execution log appended.
- [ ] All work pushed to `main` (or `wip/<phase-id>` for risky phases).

## Constraints

- <e.g. "Do not modify the registry — that's P03.">
- <e.g. "Use OpenZeppelin v5 ERC-20, no custom token logic.">
- <e.g. "Solidity 0.8.26 only.">

## Unblock Hints

(Required only when `revision >= 2`. Otherwise: `N/A`.)

- <hint that addresses the previous BLOCKED report>
