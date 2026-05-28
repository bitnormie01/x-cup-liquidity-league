---
directive-id: D25
phase-id: P07-02
created-at: 2026-05-28T13:20Z
revision: 2
---

# Directive — D25 for P07-02 Finalize Links

## Goal

Finalize P07-02 after human publishing is complete. Update repo docs with real external URLs for the demo video, X post, and X account handle. Add hosted frontend URL only if one exists.

## Required user inputs

Do not proceed until the user provides at least:

- Demo video URL
- X post URL
- X account handle

Optional:

- Hosted frontend URL

## Scope

Update:

- `SUBMISSION.md`
- `README.md` submission links section
- `DEMO.md` URL section only if a hosted frontend URL exists
- `agent-system/04-summaries/reports/P07-02-final.md`
- `agent-system/04-summaries/execution-log.md`
- `agent-system/03-state/state-counter.md`
- `agent-system/03-state/phase-status.md`

## Rules

- Do not invent URLs.
- Do not mark P07-02 DONE unless both demo video URL and X post URL exist.
- If hosted frontend URL is missing, keep local-demo wording and do not block P07-02 solely for that.
- Verify links by opening them if the environment supports it. If not, state that link verification was not possible.

## Final state if URLs exist

- `P07-02 = DONE`
- Active phase advances to `P07-03 — Final submission form`
- Active phase status `AWAITING_DIRECTIVE`
- Active directive `D25`
- Next directive ID `D26`

Final commit:

`[P07-02] finalize submission links`
