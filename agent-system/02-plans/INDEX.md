# 02-plans — Index

Plans are sequential. Phases inside a plan are sequential. After completing the last phase of a plan, advance to phase 01 of the next plan.

## Plans

| ID | Folder | Title | Phases | Demo-Critical? |
|---|---|---|---|---|
| P01 | `plan-01-foundation/` | Foundation | 2 | yes |
| P02 | `plan-02-tokens/` | Tokens & Passport | 3 | yes |
| P03 | `plan-03-registry/` | Registry | 2 | yes |
| P04 | `plan-04-hook/` | Hook (the core product) | 4 | yes (essential) |
| P05 | `plan-05-deployment/` | Deployment | 3 | yes |
| P06 | `plan-06-frontend/` | Frontend | 5 | yes |
| P07 | `plan-07-submission/` | Submission | 3 | yes |

Total: 7 plans, 22 phases.

## Plan-Level Reading Order

For each plan: read its `INDEX.md` first to understand the plan's intent and exit criteria, then the active phase file. Phase files are self-contained but assume the brief is already loaded.

## Authority

- The **Mastermind** owns these files. The Executor reads them but does not edit them.
- If reality forces a plan change, the Mastermind edits the phase file, bumps the `revised-on` line in the file's YAML front-matter, and notes the change in the next directive.

## Phase File Front-Matter Convention

Every phase file starts with:

```yaml
---
phase-id: PXX-YY
plan: PXX
revised-on: YYYY-MM-DD
---
```

If `revised-on` differs from the original creation date, the Executor must re-read the file before acting.
