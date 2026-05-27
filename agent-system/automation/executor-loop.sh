#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

WORKER_ID="${WORKER_ID:-$(hostname)-hermes}"
INTERVAL_SECONDS="${EXECUTOR_INTERVAL_SECONDS:-60}"
PROMPT_FILE="${EXECUTOR_PROMPT_FILE:-agent-system/automation/prompts/executor-autoloop.md}"
LOG_DIR="agent-system/automation/logs"
EXECUTOR_AGENT_CMD="${EXECUTOR_AGENT_CMD:-codex exec --skip-git-repo-check --sandbox workspace-write --dangerously-bypass-hook-trust --json -}"
mkdir -p "$LOG_DIR"

notify() { agent-system/automation/notify.sh "$*"; }

notify "Executor loop started: $WORKER_ID on $(hostname)."

while true; do
  git fetch origin main >/dev/null 2>&1 || true
  git checkout main >/dev/null 2>&1 || true
  if ! git pull --ff-only origin main >/dev/null 2>&1; then
    notify "Executor $WORKER_ID could not fast-forward main. Sleeping."
    sleep "$INTERVAL_SECONDS"
    continue
  fi

  STATE="$(grep '| Active Phase Status |' agent-system/03-state/state-counter.md | sed -E 's/.*`([^`]+)`.*/\1/' || true)"
  PHASE="$(grep '| Active Phase |' agent-system/03-state/state-counter.md | sed -E 's/.*`([^`]+)`.*/\1/' || true)"
  DIRECTIVE="$(grep '| Active Directive |' agent-system/03-state/state-counter.md | sed -E 's/.*`([^`]+)`.*/\1/' || true)"

  case "$STATE" in
    PENDING|IN_PROGRESS)
      ;;
    AWAITING_REVIEW|AWAITING_DIRECTIVE|BLOCKED|DONE)
      sleep "$INTERVAL_SECONDS"
      continue
      ;;
    *)
      notify "Executor $WORKER_ID found unknown state '$STATE' for phase '$PHASE'."
      sleep "$INTERVAL_SECONDS"
      continue
      ;;
  esac

  if [[ -f "agent-system/04-summaries/reports/${PHASE}.md" || -f "agent-system/04-summaries/reports/${PHASE}-v2.md" ]]; then
    sleep "$INTERVAL_SECONDS"
    continue
  fi

  if ! WORKER_ID="$WORKER_ID" agent-system/automation/claim-lock.sh >/tmp/xcll-claim-$WORKER_ID.log 2>&1; then
    sleep "$INTERVAL_SECONDS"
    continue
  fi

  notify "Executor $WORKER_ID claimed $PHASE / $DIRECTIVE."
  TS="$(date -u +%Y%m%dT%H%M%SZ)"
  OUT="$LOG_DIR/executor-${WORKER_ID}-${PHASE}-${TS}.log"

  set +e
  timeout "${EXECUTOR_RUN_TIMEOUT:-5400}" bash -lc "$EXECUTOR_AGENT_CMD" < "$PROMPT_FILE" > "$OUT" 2>&1
  CODE=$?
  set -e

  git status --short > "$LOG_DIR/executor-${WORKER_ID}-${PHASE}-${TS}.status" || true

  if [[ $CODE -eq 0 ]]; then
    git pull --ff-only origin main >/dev/null 2>&1 || true
    git push origin main >/dev/null 2>&1 || notify "Executor $WORKER_ID completed but push failed for $PHASE. Log: $OUT"
    notify "Executor $WORKER_ID finished $PHASE. Log: $OUT"
    WORKER_ID="$WORKER_ID" agent-system/automation/release-lock.sh >/dev/null 2>&1 || true
  elif [[ $CODE -eq 124 ]]; then
    notify "Executor $WORKER_ID timed out on $PHASE. Lock will be released for failover. Log: $OUT"
    WORKER_ID="$WORKER_ID" agent-system/automation/release-lock.sh >/dev/null 2>&1 || true
  else
    if grep -qiE 'rate limit|quota|too many requests|429|exhausted' "$OUT"; then
      notify "Executor $WORKER_ID likely hit rate limit on $PHASE. Releasing lock for backup executor. Log: $OUT"
      WORKER_ID="$WORKER_ID" agent-system/automation/release-lock.sh >/dev/null 2>&1 || true
    else
      notify "Executor $WORKER_ID failed on $PHASE with exit $CODE. Releasing lock. Log: $OUT"
      WORKER_ID="$WORKER_ID" agent-system/automation/release-lock.sh >/dev/null 2>&1 || true
    fi
  fi

  sleep "$INTERVAL_SECONDS"
done
