# Handoff Protocol — Executor ↔ Mastermind

> The single source of truth for how the two agents exchange information. If a process question isn't answered here, halt and ask before proceeding.

## Index

1. [Channels](#channels)
2. [The Loop](#the-loop)
3. [Directive File Spec](#directive-file-spec)
4. [Report File Spec](#report-file-spec)
5. [Git Workflow](#git-workflow)
6. [Commit Message Convention](#commit-message-convention)
7. [State Updates](#state-updates)
8. [Conflict Resolution](#conflict-resolution)
9. [Phase ID & Directive ID Schema](#phase-id--directive-id-schema)
10. [Failure Modes](#failure-modes)

## Channels

Everything happens through **the repo**. No Slack, no DMs, no chat history. If it isn't in a file, it didn't happen.

| Agent | Writes to | Reads from |
|---|---|---|
| Mastermind | `01-roles/directives/`, `03-state/`, `02-plans/**` (rare), review appendix on reports | `00-brief/`, `02-plans/**`, `03-state/`, `04-summaries/**`, `git log`, `git diff`, source code |
| Executor | source code, `04-summaries/reports/`, `04-summaries/execution-log.md`, `04-summaries/screenshots/`, `03-state/` | `00-brief/`, `01-roles/`, `02-plans/**`, `03-state/`, the current directive |

## The Loop

```
┌──────────────────┐    directive file     ┌──────────────────┐
│    Mastermind    │ ────────────────────► │     Executor     │
│  (read + plan)   │                       │ (code + commit)  │
└────────┬─────────┘                       └─────────┬────────┘
         │                                           │
         │  git pull                                 │  git push
         │ ◄───── report + commits + state ─────────┤
         │                                           │
         ▼                                           ▼
   review + next directive                  wait for next directive
```

**One cycle = one phase.** Never overlap two phases. If parallel work is needed, spawn a second Executor on a separate branch — but that requires an explicit cross-branch directive from the Mastermind.

## Directive File Spec

**Path:** `agent-system/01-roles/directives/D<n>-<phase-id>.md`
**Template:** `agent-system/05-templates/mastermind-directive-template.md`

Required fields (YAML front-matter + body):
- `directive-id` (e.g. `D17`)
- `phase-id` (e.g. `P04-02`)
- `created-at` (ISO 8601 UTC)
- `time-budget-hours` (rough)
- `revision` (1 on first issue, 2+ on re-issue after BLOCKED/PARTIAL)

Required body sections:
- **Goal** — 1–3 sentences.
- **Scope (In)** — bullet list of in-scope work.
- **Scope (Out)** — bullet list explicitly excluded.
- **Reference Files** — paths to brief/phase/PRD sections.
- **Acceptance Criteria** — checkbox list of testable outcomes.
- **Constraints** — version pins, file restrictions, "don't touch X".
- **Unblock Hints** — required only when `revision >= 2`.

The Executor MUST treat the directive as the contract for this phase. If reality contradicts it, raise `BLOCKED`.

## Report File Spec

**Path:** `agent-system/04-summaries/reports/<phase-id>.md` (initial run)
**Subsequent run for the same phase:** `<phase-id>-v2.md`, `<phase-id>-v3.md`, …
**Template:** `agent-system/05-templates/executor-report-template.md`

Required fields (YAML front-matter):
- `phase-id`
- `directive-id`
- `status` ∈ {`DONE`, `PARTIAL`, `BLOCKED`}
- `completed-at` (ISO 8601 UTC)
- `executor-session` (label so we can trace which Codex/Hermes run produced this)

Required body sections:
- **Summary** — 3–10 sentences plain English. What was built, key decisions, end result.
- **Commits** — table of SHA + message.
- **Files Changed** — table of path + line deltas.
- **Tests** — commands run + pass/fail.
- **Deployed Addresses** — only if applicable, otherwise `N/A`.
- **Risks / Caveats** — 1–3 bullets.
- **Open Questions** — required when status ≠ DONE.
- **Suggested Next** — Executor's recommendations (Mastermind may ignore).
- **Screenshots** — required for any frontend phase.

One report per phase per run. Never overwrite a prior report.

## Git Workflow

- **Default branch:** `main`.
- Direct commits to `main` are fine for hackathon speed.
- **Exception:** If a phase is risky/large (e.g. all of Plan 4), the Executor creates `wip/<phase-id>`, opens a PR, the Mastermind reviews via PR diff, the Executor merges after directive approval.
- The Executor always `git push` after the final report commit.
- The Mastermind always `git pull` before reviewing or writing a directive.

## Commit Message Convention

```
[<phase-id>] <imperative-summary>
```

Examples:
- `[P02-01] add DemoFanToken + xUSD with faucet mint`
- `[P04-03] implement anti-wash cooldown + emit WashPenaltyApplied`
- `[P04-03] report + state update`
- `[mm] directive D14 for P04-04`
- `[merge] reconcile state-counter after Executor swap`

Rules:
- Imperative mood (`add`, not `added`).
- Lowercase summary except for proper nouns and contract names.
- Multi-commit phases: every commit prefixed with the same phase ID.
- The **last commit** of a phase is always `[<phase-id>] report + state update`.

## State Updates

`agent-system/03-state/state-counter.md` is updated by:

| Event | Who | What changes |
|---|---|---|
| New directive issued | Mastermind | `Active Phase`, `Active Directive`, `Next Directive ID` += 1, `Last Updated By/At` |
| Phase completed | Executor | `Last Completed Phase`, `Last Commit SHA`, `Active Phase` (→ next or `AWAITING_DIRECTIVE`), `Last Updated By/At` |
| Phase blocked | Executor | `Open Blockers` (append), `Active Phase` status note, `Last Updated By/At` |
| Phase reopened (fix-up) | Mastermind | Re-issue directive at higher `revision`, set state to `IN_PROGRESS` again |

If counter and reality disagree, the most recent commit on `main` wins. Raise the discrepancy in the next directive/report.

## Conflict Resolution

| Conflict | Resolution |
|---|---|
| Spec ambiguity in a phase file | Executor writes `BLOCKED` report listing options. Mastermind picks via next directive (and amends phase file if the ambiguity was structural). |
| Scope drift in a commit | Mastermind issues a revert directive (`git revert <sha>`) OR amends the phase file to legitimize the drift. Never silently fixed by re-editing. |
| Merge conflict in `agent-system/` | The most recent state-counter wins. Other files merged line-by-line. Add a `[merge]` commit and note it in the next report. |
| Re-opened phase | Mastermind issues `D<new>-<phase-id>.md` with `revision: 2+`. Executor produces `<phase-id>-v2.md`. Phase ID never changes. |
| Disagreement on approach | Mastermind always wins. Executor implements as directed and may note objections in the report's "Suggested Next" section. |

## Phase ID & Directive ID Schema

- **Phase ID:** `P<plan>-<phase>` with both two-digit padded. Examples: `P01-01`, `P04-03`, `P07-02`.
- **Directive ID:** `D<n>` monotonically increasing across the whole project. Never reused. First directive is `D1`.
- One phase may receive multiple directives (initial + fix-up). The phase ID stays constant; directive IDs change. The mapping lives implicitly in the directive filename (`D17-P04-02.md` reads as "directive 17, addressing phase P04-02").

## Failure Modes

| Failure | Detection | Recovery |
|---|---|---|
| Executor never pushes the report | Mastermind sees commits but no `reports/<phase-id>.md` | Issue a directive demanding the report. Do not advance. |
| State counter stale | `git log -1` shows a later phase than `Last Completed Phase` | Mastermind reconciles in their next state-counter edit and notes it. |
| Mastermind edits source code by accident | Executor sees changes outside `agent-system/` in `[mm]`-prefixed commit | Executor `git revert <sha>`, raises in next report under "Risks". |
| Executor coalesces two phases | One report covers two phase IDs | Mastermind splits retroactively: writes both reports under the appropriate phase IDs (this is the ONLY case where Mastermind writes Executor content). |
| Mastermind issues directive before previous report exists | Executor pulls and sees new directive but no prior report on `main` | Executor pushes the missing report first, THEN executes the new directive. |
