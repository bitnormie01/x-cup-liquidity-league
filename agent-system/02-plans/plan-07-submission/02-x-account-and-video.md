---
phase-id: P07-02
plan: P07
revised-on: 2026-05-26
---

# P07-02 — X Account + Demo Video

## Goal

Record a 1–3 minute demo video and publish it. Post the project on the dedicated X account with the hackathon's required tags. These are submission-blocking artifacts.

## Scope (In)

- **Video (executor produces; user uploads if Executor lacks credentials):**
  - 1–3 minutes.
  - Hits every step of `DEMO.md`.
  - Optional captions or voice-over (voice-over is bonus; muted screen recording also fine).
  - Export as MP4 1080p.
  - Upload to YouTube (unlisted is OK) or Loom; capture the public URL.
  - If the Executor cannot record (no camera/screen access in WSL), produce a `script.md` with exact timing/shots/cuts and a `BLOCKED` flag asking the user to record. The user has explicit ownership of this step.
- **X account post:**
  - Confirm required hashtags from `hackathon-details.md` (already in the repo). At minimum include the hackathon's primary tag.
  - Post body:
    - 1-line pitch.
    - Link to video.
    - Link to repo.
    - Link to deployed frontend.
    - Hook address + 1-2 example pool addresses.
    - Hashtags + required @ tags.
  - Schedule the post or publish immediately based on hackathon rules.
  - Save the post URL to `SUBMISSION.md` (created in P07-03).

## Scope (Out)

- Engagement growth / scheduled threads — submission only.
- Multiple language captions.
- Audio editing beyond a single take.

## Acceptance Criteria

- [ ] Video URL exists and is publicly viewable.
- [ ] X post live with required tags and link to repo + video.
- [ ] Both URLs captured in `SUBMISSION.md`.

## Risks / Pitfalls

- Recording from WSL is hard. Default plan: Executor produces a script; user records.
- X may rate-limit new accounts; warm the account a day before by posting once benign.
- Hashtag spelling matters — copy from the hackathon's announcement, do not paraphrase.

## Reference

- Brief: "Submission Requirements".
- PRD §2 "Required hackathon alignment".
- `hackathon-details.md` at repo root.
