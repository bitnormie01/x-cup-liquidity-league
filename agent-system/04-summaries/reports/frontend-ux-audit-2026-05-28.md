# Frontend UX Audit — Required Hotfix

Reviewed by: `mastermind-chatgpt`  
Created at: 2026-05-28T13:35Z  
Status: ACTION REQUIRED

## Summary

User/developer manual testing found multiple frontend issues that must be fixed before final submission. This hotfix temporarily interrupts P07 completion because the current frontend is too technical for normal users and has at least one transaction path that can block wallet confirmation.

## Reported Issues

1. Explorer links/context currently use OKX Explorer; user wants all explorer links and UI copy ported to OKLink.
2. Country/team presentation needs proper country flag logos where necessary, not fragile emoji-only rendering.
3. The frontend reads as a technical dashboard instead of a normal-user game/demo. It needs clearer categorization and friendlier copy.
4. Button text/state after token approval is confusing; after approving, users have to click again or twice before the intended action appears.
5. Sections are not categorized clearly enough. Status, actions, and proof panels need clearer grouping.
6. `Add support` currently causes a wallet simulation/confirmation failure: wallet reports a third-party contract execution error and the confirm button is unavailable.
7. Font usage needs a consistent system across headings, body, labels, numbers, and code/address fields.
8. Responsive/interact states need cleanup so layout and buttons remain stable after user actions.

## Mastermind Decision

Create D26 as a frontend UX/refactor hotfix directive. Executor must first write a concise UX implementation plan, then apply the refactor. Do not continue P07 finalization until D26 is reviewed.
