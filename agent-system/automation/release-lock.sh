#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

LOCK_BRANCH="${LOCK_BRANCH:-agent-lock/executor}"
LOCK_PATH="agent-system/automation/locks/executor.json"
WORKER_ID="${WORKER_ID:-$(hostname)-$$}"
REMOTE="${REMOTE:-origin}"

if ! git ls-remote --exit-code --heads "$REMOTE" "$LOCK_BRANCH" >/dev/null 2>&1; then
  echo "lock-already-absent"
  exit 0
fi

git fetch -q "$REMOTE" "$LOCK_BRANCH:refs/remotes/$REMOTE/$LOCK_BRANCH"
OWNER="$(git show "$REMOTE/$LOCK_BRANCH:$LOCK_PATH" 2>/dev/null | python3 -c 'import json,sys; print(json.load(sys.stdin).get("worker_id", ""))' 2>/dev/null || true)"

if [[ -n "$OWNER" && "$OWNER" != "$WORKER_ID" && "${FORCE_RELEASE:-0}" != "1" ]]; then
  echo "lock-owned-by-$OWNER; refusing release as $WORKER_ID"
  exit 1
fi

git push -q "$REMOTE" ":refs/heads/$LOCK_BRANCH" || true
echo "lock-released"
