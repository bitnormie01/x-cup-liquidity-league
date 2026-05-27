#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

LOCK_BRANCH="${LOCK_BRANCH:-agent-lock/executor}"
LOCK_PATH="agent-system/automation/locks/executor.json"
LOCK_TTL_SECONDS="${LOCK_TTL_SECONDS:-3600}"
WORKER_ID="${WORKER_ID:-$(hostname)-$$}"
REMOTE="${REMOTE:-origin}"

ACTIVE_PHASE="$(grep '| Active Phase |' agent-system/03-state/state-counter.md | sed -E 's/.*`([^`]+)`.*/\1/' || true)"
ACTIVE_DIRECTIVE="$(grep '| Active Directive |' agent-system/03-state/state-counter.md | sed -E 's/.*`([^`]+)`.*/\1/' || true)"
NOW_EPOCH="$(date -u +%s)"
NOW_ISO="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"

if git ls-remote --exit-code --heads "$REMOTE" "$LOCK_BRANCH" >/dev/null 2>&1; then
  TMPDIR="$(mktemp -d)"
  trap 'rm -rf "$TMPDIR"' EXIT
  git fetch -q "$REMOTE" "$LOCK_BRANCH:refs/remotes/$REMOTE/$LOCK_BRANCH"
  if git show "$REMOTE/$LOCK_BRANCH:$LOCK_PATH" > "$TMPDIR/lock.json" 2>/dev/null; then
    CLAIMED_AT="$(python3 - "$TMPDIR/lock.json" <<'PY'
import json,sys
from datetime import datetime, timezone
try:
    d=json.load(open(sys.argv[1]))
    s=d.get('claimed_at','')
    dt=datetime.fromisoformat(s.replace('Z','+00:00'))
    print(int(dt.timestamp()))
except Exception:
    print(0)
PY
)"
    AGE=$(( NOW_EPOCH - CLAIMED_AT ))
    if (( CLAIMED_AT > 0 && AGE < LOCK_TTL_SECONDS )); then
      echo "lock-held"
      cat "$TMPDIR/lock.json"
      exit 1
    fi
  fi
  echo "stale-lock: deleting $LOCK_BRANCH"
  git push -q "$REMOTE" ":refs/heads/$LOCK_BRANCH" || true
fi

BASE="$(git rev-parse "$REMOTE/main")"
TMP_BRANCH="lock-${WORKER_ID//[^A-Za-z0-9_.-]/-}-$$"
git checkout -q -B "$TMP_BRANCH" "$BASE"
mkdir -p "$(dirname "$LOCK_PATH")"
cat > "$LOCK_PATH" <<JSON
{
  "worker_id": "$WORKER_ID",
  "phase_id": "$ACTIVE_PHASE",
  "directive_id": "$ACTIVE_DIRECTIVE",
  "claimed_at": "$NOW_ISO",
  "ttl_seconds": $LOCK_TTL_SECONDS
}
JSON
git add "$LOCK_PATH"
git -c user.name="${GIT_AUTHOR_NAME:-0xJaadu}" -c user.email="${GIT_AUTHOR_EMAIL:-dumpbunny4@gmail.com}" commit -q -m "[lock] executor claim $ACTIVE_PHASE by $WORKER_ID"

if git push -q "$REMOTE" "HEAD:refs/heads/$LOCK_BRANCH"; then
  git checkout -q main
  git branch -D "$TMP_BRANCH" >/dev/null 2>&1 || true
  echo "lock-acquired"
  exit 0
fi

git checkout -q main
git branch -D "$TMP_BRANCH" >/dev/null 2>&1 || true
echo "lock-race-lost"
exit 1
