#!/usr/bin/env bash
set -euo pipefail

MESSAGE="${1:-}"
if [[ -z "$MESSAGE" ]]; then
  MESSAGE="$(cat)"
fi

TS="$(date -u +'%Y-%m-%d %H:%M:%SZ')"
TEXT="[X Cup Liquidity League][$TS] $MESSAGE"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
for ENV_FILE in "$REPO_ROOT/.telegram.env" "$SCRIPT_DIR/.telegram.env"; do
  if [[ -f "$ENV_FILE" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
    break
  fi
done

if [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]]; then
  curl -fsS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${TEXT}" >/dev/null || true
fi

printf '%s\n' "$TEXT"
