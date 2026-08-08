#!/usr/bin/env bash
# vps-up.sh — start the Heirloom TEE stack on the VPS.
#
# Run ON the VPS, from ~/heirloom. Everything is prebuilt: the images were
# built on the workstation and shipped with `docker save | ssh docker load`,
# because `go build` and `npm ci` would OOM a 1 GiB box that is already running
# something else.
#
# Prerequisite: config/proxy/extension_proxy.coston2.docker.toml must contain
# the real indexer DB credentials from the hackathon Telegram pinned message.
# The `indexer-reader` values printed in the older docs are dead — a proxy that
# cannot reach the indexer looks exactly like a broken registration.
set -euo pipefail

cd "$(dirname "$0")/.."

GREEN='\033[0;32m'; RED='\033[0;31m'; NC='\033[0m'
log() { echo -e "${GREEN}[vps-up]${NC} $*"; }
die() { echo -e "${RED}[vps-up] ERROR:${NC} $*" >&2; exit 1; }

CFG="config/proxy/extension_proxy.coston2.docker.toml"
[[ -f "$CFG" ]] || die "$CFG missing — copy the .example and fill in the [db] block."
grep -q "<indexer-db-host>" "$CFG" && die "$CFG still has placeholder DB credentials."

[[ -f config/extension.env ]] || die "config/extension.env missing — run heirloom-register.sh first."
log "$(cat config/extension.env | grep EXTENSION_ID)"

docker image inspect heirloom-extension:v0.1.0 >/dev/null 2>&1 \
    || die "heirloom-extension:v0.1.0 not loaded. Ship it: docker save … | ssh … docker load"
docker image inspect local/tee-proxy:latest >/dev/null 2>&1 \
    || die "local/tee-proxy:latest not loaded."

# Loopback-only. The proxy API is unauthenticated; Caddy fronts it on 443.
# Docker writes its own iptables rules and bypasses ufw, so binding 0.0.0.0 here
# would be internet-facing on a host without an NSG in front of it.
export EXT_PROXY_EXTERNAL_BIND="127.0.0.1:6674"
export EXT_PROXY_INTERNAL_BIND="127.0.0.1:6673"
export REDIS_BIND="127.0.0.1:6382"

log "Starting redis, ext-proxy, extension-tee..."
docker compose -f docker-compose.yaml -f docker-compose.coston2.yaml up -d --no-build

log "Waiting for the proxy to answer on loopback..."
for i in $(seq 1 60); do
    if curl -sf http://127.0.0.1:6674/info >/dev/null 2>&1; then
        log "Proxy is up."
        curl -s http://127.0.0.1:6674/info | head -c 800
        echo ""
        echo ""
        log "Public URL check (this is the path the data providers use):"
        curl -sf https://sly.southafricanorth.cloudapp.azure.com/info >/dev/null \
            && log "https://sly.southafricanorth.cloudapp.azure.com/info OK" \
            || die "Public URL is not answering — fix before registering the TEE machine."
        exit 0
    fi
    sleep 2
done

echo ""
die "Proxy did not come up in 120s. Check: docker compose logs ext-proxy"
