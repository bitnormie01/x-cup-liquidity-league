#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

INTERVAL_SECONDS="${MASTER_INTERVAL_SECONDS:-60}"
PROMPT_FILE="${MASTER_PROMPT_FILE:-agent-system/automation/prompts/mastermind-autoloop.md}"
LOG_DIR="agent-system/automation/logs"
mkdir -p "$LOG_DIR"

notify() { agent-system/automation/notify.sh "$*"; }

notify "Mastermind loop started on $(hostname)."

while true; do
  git fetch origin main >/dev/null 2>&1 || true
  git checkout main >/dev/null 2>&1 || true
  git pull --ff-only origin main >/dev/null 2>&1 || {
    notify "Mastermind could not fast-forward main. Human git intervention needed."
    sleep "$INTERVAL_SECONDS"
    continue
  }

  STATE="$(grep '| Active Phase Status |' agent-system/03-state/state-counter.md | sed -E 's/.*`([^`]+)`.*/\1/' || true)"
  PHASE="$(grep '| Active Phase |' agent-system/03-state/state-counter.md | sed -E 's/.*`([^`]+)`.*/\1/' || true)"

  case "$STATE" in
    AWAITING_REVIEW|AWAITING_DIRECTIVE|PENDING|BLOCKED|DONE)
      ;;
    IN_PROGRESS)
      sleep "$INTERVAL_SECONDS"
      continue
      ;;
    *)
      notify "Mastermind found unknown state '$STATE' for phase '$PHASE'. Human review needed."
      sleep "$INTERVAL_SECONDS"
      continue
      ;;
  esac

  if [[ "$PHASE" == "AWAITING_DIRECTIVE" && "$STATE" == "DONE" ]]; then
    notify "Build appears complete or awaiting final user directive. Mastermind loop pausing."
    exit 0
  fi

  TS="$(date -u +%Y%m%dT%H%M%SZ)"
  OUT="$LOG_DIR/mastermind-$TS.log"
  set +e
  claude -p "$(cat "$PROMPT_FILE")" \
    --max-turns "${CLAUDE_MAX_TURNS:-14}" \
    --output-format json \
    --dangerously-skip-permissions \
    ${CLAUDE_EXTRA_ARGS:-} > "$OUT" 2>&1
  CODE=$?
  set -e

  if [[ $CODE -ne 0 ]]; then
    notify "Mastermind Claude Code run failed with exit $CODE. Log: $OUT"
    sleep "$INTERVAL_SECONDS"
    continue
  fi

  git pull --ff-only origin main >/dev/null 2>&1 || true
  if ! git push origin main >/dev/null 2>&1; then
    notify "Mastermind could not push after run. Log: $OUT"
  fi

  if grep -qiE 'human input|user input|blocked|needs user|needs private key|needs funds|telegram' "$OUT"; then
    notify "Mastermind may need attention for phase $PHASE. Log: $OUT"
  fi

  sleep "$INTERVAL_SECONDS"
done
