#!/usr/bin/env bash
#
# Configures the dev env files with a LAN IP reachable from a physical device.
#
# On a real device, "localhost" points at the phone itself, so the API and
# Keycloak must be addressed by the dev machine's IP on the network the device
# shares (USB tethering -> 172.20.10.x, or plain WiFi). This rewrites the three
# host-bearing lines so you don't have to edit them by hand each session.
#
# Usage:
#   ./scripts/set-dev-ip.sh            # auto-detect the default-route IP
#   ./scripts/set-dev-ip.sh 172.20.10.2  # force a specific IP
#
set -euo pipefail

API_PORT=3100
KEYCLOAK_PORT=3380

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
MOBILE_ENV="$ROOT/packages/app-mobile/.env"
BACKEND_ENV="$ROOT/packages/backend/.env"

detect_ip() {
  # macOS: IP of the interface carrying the default route.
  if command -v route >/dev/null 2>&1 && command -v ipconfig >/dev/null 2>&1; then
    local iface
    iface="$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')"
    if [ -n "${iface:-}" ]; then
      ipconfig getifaddr "$iface" 2>/dev/null && return 0
    fi
  fi
  # Linux / WSL: source IP chosen for an outbound route.
  if command -v ip >/dev/null 2>&1; then
    ip route get 1.1.1.1 2>/dev/null | awk '{for(i=1;i<=NF;i++) if($i=="src"){print $(i+1); exit}}' && return 0
  fi
  return 1
}

IP="${1:-}"
if [ -z "$IP" ]; then
  IP="$(detect_ip || true)"
fi

if [ -z "$IP" ]; then
  echo "Could not auto-detect a LAN IP. Pass one explicitly: ./scripts/set-dev-ip.sh <ip>" >&2
  exit 1
fi

if ! [[ "$IP" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Refusing to use '$IP' — not an IPv4 address." >&2
  exit 1
fi

# Replace a KEY=... line in place, failing loudly if the key is missing.
set_kv() {
  local file="$1" key="$2" value="$3"
  if [ ! -f "$file" ]; then
    echo "  skip  $file (not found)" >&2
    return 0
  fi
  if ! grep -q "^${key}=" "$file"; then
    echo "  warn  $key not present in $file — leaving untouched" >&2
    return 0
  fi
  perl -i -pe "s|^${key}=.*|${key}=${value}|" "$file"
  echo "  set   $key=${value}"
}

echo "Using IP: $IP"
echo "$MOBILE_ENV:"
set_kv "$MOBILE_ENV" EXPO_PUBLIC_API_BASE_URL "http://${IP}:${API_PORT}/api"
set_kv "$MOBILE_ENV" EXPO_PUBLIC_KEYCLOAK_URL "http://${IP}:${KEYCLOAK_PORT}"
# Note the previous Keycloak host so we only recreate the container when it
# actually changes (the recreate is the slow part).
prev_kc="$(grep '^KEYCLOAK_ENDPOINT=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- || true)"
new_kc="http://${IP}:${KEYCLOAK_PORT}"
echo "$BACKEND_ENV:"
set_kv "$BACKEND_ENV" KEYCLOAK_ENDPOINT "$new_kc"

# Recreate Keycloak when its host changed: it bakes KEYCLOAK_ENDPOINT into
# KC_HOSTNAME_URL (the login page's links) and the JWT issuer claim, neither of
# which updates without a fresh container. The compose stack uses the "fit-log"
# project name (see backend's dev:db script), so target that explicitly.
if [ "$new_kc" = "$prev_kc" ]; then
  echo "Keycloak host unchanged — no recreate needed."
elif ! command -v docker >/dev/null 2>&1; then
  echo "  warn  docker not found — recreate Keycloak manually once available." >&2
else
  echo "Recreating Keycloak (KC_HOSTNAME_URL changed)..."
  if ! (cd "$ROOT/packages/backend" && docker compose -p fit-log up -d --force-recreate keycloak); then
    echo "  warn  Keycloak recreate failed; run it yourself:" >&2
    echo "          cd packages/backend && docker compose -p fit-log up -d --force-recreate keycloak" >&2
  fi
fi

cat <<EOF

Done. Restart the two dev servers so they re-read the new host — the script
can't restart processes it didn't start:

  - Backend (re-reads KEYCLOAK_ENDPOINT for the issuer + JWKS):
      pnpm --filter @jrposada/fit-log-backend dev
  - Expo, with a clean cache (EXPO_PUBLIC_* are bundled at build time):
      pnpm --filter @jrposada/fit-log-app-mobile exec expo start -c
EOF
