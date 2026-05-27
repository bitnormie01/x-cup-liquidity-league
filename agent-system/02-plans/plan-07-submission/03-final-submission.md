---
phase-id: P07-03
plan: P07
revised-on: 2026-05-26
---

# P07-03 — Final Submission Form

## Goal

Fill the hackathon's Google Form with every required field, save confirmation, and archive all submission artifacts in `SUBMISSION.md`.

## Scope (In)

- Create `SUBMISSION.md` at repo root listing:
  - Project name.
  - 1-line pitch.
  - Repo URL.
  - Deployed frontend URL.
  - Video URL.
  - X post URL.
  - X account handle.
  - All deployed addresses (X Layer testnet; mainnet if shipped).
  - Hook address (explicit).
  - Demo path (link to DEMO.md).
  - Team member contacts (user provides).
- Fill the Google Form (URL in `hackathon-details.md`). Take a screenshot of the confirmation page; save as `agent-system/04-summaries/screenshots/P07-03-form-confirmation.png`.
- Verify every link in `SUBMISSION.md` resolves (paste each into a browser).
- Final `git status` clean; final `git push`.
- Update state counter: `Last Completed Phase = P07-03`, `Active Phase = AWAITING_DIRECTIVE`. Mastermind closes the loop with a final acknowledgment commit.

## Scope (Out)

- Post-submission marketing.
- Anything not explicitly required by the form.

## Acceptance Criteria

- [ ] `SUBMISSION.md` complete and every link verified.
- [ ] Google Form submitted with confirmation screenshot.
- [ ] Final repo state pushed.
- [ ] State counter set to `AWAITING_DIRECTIVE`.
- [ ] At least 4 hours of buffer before the **2026-05-28 23:59 UTC** deadline.

## Risks / Pitfalls

- Form fields sometimes require specific URL formats (no `?utm_*`, no trailing slash). Test in a fresh browser tab.
- Don't paste private keys or `.env` contents into the form.
- If a field requires "demo wallet address with funds," provide a fresh wallet seeded via faucet, not a deployer.

## Reference

- Brief: "Submission Requirements".
- `hackathon-details.md`.
