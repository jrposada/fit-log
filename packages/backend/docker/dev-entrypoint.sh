#!/usr/bin/env sh
#
# Container entrypoint for the `dev` Dockerfile target. The repo is
# bind-mounted at /repo (see docker-compose.yml's `backend` service) with
# node_modules on named volumes, so install + watch run here at container
# start rather than being baked into the image.
set -e

# No TTY in a container, so pnpm's interactive confirmations (e.g. removing
# node_modules when the store-dir changes) would otherwise abort the install.
export CI=true

cd /repo
# Without a pre-existing global pnpm config (as your host has), a fresh
# corepack-provisioned pnpm falls back to a store *inside* the current
# directory — which is /repo here, i.e. the bind-mounted repo root. Left
# alone that dumps an 800MB+ .pnpm-store onto your host. Pointing it at the
# pnpm-store named volume instead keeps it out of the bind mount and lets
# it persist as a real cache across container recreates.
pnpm install --frozen-lockfile --store-dir /pnpm-store
exec pnpm --filter @jrposada/fit-log-backend dev:server
