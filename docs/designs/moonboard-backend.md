# Design: Moonboard Backend Sync

> **Status: blocked on upstream API discovery.** The SDK and CLI are written
> and shaped correctly, but every Moonboard endpoint we know of is unreachable
> (see [Current Blocker](#current-blocker)). Work resumes once we capture
> request shapes from the current official MoonBoard mobile app.

## Context

Fit-log wants to sync Moonboard problems into its own DB so they appear in the Climbing tab as regular Climbs. Moonboard credentials are server configuration (env vars), not per-user settings. Because no Moonboard endpoint is publicly callable today, sync is **CLI-driven and run manually** — there is no automatic cron job.

Depends on: capturing the live MoonBoard mobile API (see Current Blocker)  
Required by: `moonboard-profile-screen`

---

## Problem

There is no way to access Moonboard problems inside fit-log.

## Goal

- Authenticate with Moonboard using server-side credentials.
- Sync problems and benchmarks into fit-log's DB as Climbs on a daily schedule.

---

## Architecture

### Moonboard Credentials

Stored as environment variables on the server — no DB storage, no UI:
- `MOONBOARD_USERNAME`
- `MOONBOARD_PASSWORD`

The sync job is a no-op if either variable is unset.

### Moonboard SDK — `packages/moonboard-sdk`

The SDK targets the legacy MoonBoard **mobile** API at
`restapimoonboard.ems-x.com` (no Cloudflare, OAuth2 password grant), based on
reverse-engineering done by [`spookykat/MoonBoard`](https://github.com/spookykat/MoonBoard).
Current shape:

1. **Login** — `POST /token` with form body
   `grant_type=password&username=…&password=…&client_id=com.moonclimbing.mb`,
   UA `MoonBoard/1.0`. Returns `{access_token, refresh_token}`.
2. **Fetch problems** — `GET /v1/_moonapi/problems/v3/{layout}/{angle}/{cursor}?v=8.3.4`
   with `Authorization: BEARER <token>`. Cursor is the last `apiId` seen;
   page size is 5000.
3. **Iterate setups** — repeat per (holdset, angle): MoonBoard 2016, Masters
   2017 @ 40°/25°, Masters 2019 @ 40°/25°, Mini MoonBoard 2020 @ 40°.
4. **Benchmarks** — not a separate endpoint; each problem carries an
   `isBenchmark` flag.
5. **Refresh** — on 401/403, `POST /token` with
   `grant_type=refresh_token&refresh_token=…&client_id=com.moonclimbing.mb`,
   retry once.

The web flow (`www.moonboard.com`, `_MoonBoard` cookie) is **not used**: that
host now sits behind Cloudflare's bot-management JS challenge and the
underlying website no longer exposes the problems list as JSON (only dashboard
stats endpoints remain). An earlier Playwright/Patchright headless-browser
prototype confirmed both points.

### Current Blocker

`restapimoonboard.ems-x.com` was retired by Moonboard alongside the release of
their new official mobile app:

- Every path (`/`, `/token`, `/v1/_moonapi/...`) now returns `HTTP 200` with
  `content-length: 0` from a Caddy front. No app behind it.
- Historical note: per
  [spookykat/MoonBoard#6](https://github.com/spookykat/MoonBoard/issues/6),
  the host briefly returned `{"error":"Obsolete", "error_description":"This
  version of the MoonBoard app is now obsolete, please download the new
  MoonBoard app from the store."}` before being silenced entirely.
- No public repo has rev-eng'd the new app's API; all 2024-2025 forks still
  point at the dead host.

The SDK code is shaped correctly for an OAuth2 + paginated-list flow and is
expected to need only **URL + field renames** once we have the new endpoints —
not a structural rewrite.

### Unblock Workflow (when we're ready to resume)

To discover the new MoonBoard mobile API:

1. Install **Proxyman** (macOS) or **mitmproxy** on the dev laptop.
2. Install + trust the proxy's root CA on a real phone running the **new**
   official MoonBoard app. (Stock devices work *only* if the app doesn't pin
   its TLS cert — otherwise a rooted Android with Frida + objection or a
   jailbroken iOS with SSL Kill Switch is required.)
3. Route the phone through the proxy and exercise: login, open problems list,
   filter by holdset/angle, open a problem detail, view benchmarks.
4. For each request capture: full URL, method, headers (esp. `Authorization`,
   `User-Agent`, any `x-…` custom headers), request body, and a sample
   response payload.
5. Drop those captures into a ticket — the SDK update is then a mechanical
   change: swap `API_HOST`, `CLIENT_ID`, `API_VERSION`, the `/token` body
   shape, and the `/v1/_moonapi/problems/...` URL template in
   `packages/moonboard-sdk/src/index.ts`. Pagination strategy may need to
   change too (e.g. opaque cursor vs `apiId`).

If TLS pinning blocks step 2 and no rooted/jailbroken device is available, the
fallback is to seed from a static historical snapshot (see e.g. the
`problems_2023_01_30.zip` attached to spookykat#6) and ship the
profile-screen feature against stale data.

### Data Mapping (Moonboard → fit-log)

Moonboard concepts map to existing fit-log models:

| Moonboard | fit-log |
|-----------|---------|
| Board brand | `Location` named `"Moonboard"`, `source: 'system'` |
| Board setup (e.g. "2016", "2019") | `Sector` under Moonboard Location, `source: 'system'` |
| Problem | `Climb` under the relevant Sector, keyed on `sourceId` |

`Location`, `Sector`, and `Climb` models gain a mandatory `source: string` field (default `'user'` for existing records — no migration script needed). `Climb` gains `sourceId?: string` as the upsert deduplication key.

### CLI Fetch Command — `dev-tools moonboard fetch`

A new `moonboard` command group in the `dev-tools` CLI with a `fetch` subcommand:

```
pnpm dev-tools moonboard fetch > packages/dev-tools/src/commands/seed/mock-data/moonboard-problems.json
```

- Reads `MOONBOARD_USERNAME` / `MOONBOARD_PASSWORD` from `.env`
- Authenticates with Moonboard and fetches problems + benchmarks
- Outputs combined JSON to stdout

The resulting file is committed to the repo. `setup data` reads it to seed Moonboard problems into the local dev DB — no live Moonboard credentials needed during normal dev setup.

The command lives in `packages/dev-tools/src/commands/moonboard/`, registered in `dev-tools/src/index.ts`.

### Seeder Integration

A `seedMoonboardProblems()` function reads `mock-data/moonboard-problems.json` and upserts Location ("Moonboard"), Sectors, and Climbs with `source: 'system'` and `sourceId` as the dedup key — same mapping logic as the production cron job.

`setup data` in `commands/setup/setup.ts` calls `seedMoonboardProblems()` at the end of its flow, so after every nuke + re-seed, Moonboard problems are available without extra steps.

All existing mock-data factory functions need `source: 'user'` added once the field becomes required:

- `mock-data/locations.ts` — add `source: 'user'` to `fakeLocation()`
- `mock-data/sectors.ts` — add `source: 'user'` to `fakeSector()`
- `mock-data/climbs.ts` — add `source: 'user'` to `fakeClimb()`

---

## Key Decisions

- **Env vars over DB** — this is a personal deployment; no need for per-user credential management or encryption.
- **Single session cache** — one Moonboard account serves the whole instance.
- **Reuse Location/Sector/Climb** — Moonboard problems surface in the existing Climbing UI without new screens.
- **Upsert on `moonboardId`** — safe repeated syncs; user edits to synced climbs are not overwritten.

---

## Model Changes

| File | Change |
|------|--------|
| `backend/src/models/location.ts` | Add `source: string` (required, default `'user'`) |
| `backend/src/models/sector.ts` | Add `source: string` (required, default `'user'`) |
| `backend/src/models/climb.ts` | Add `source: string` (required, default `'user'`), `sourceId?: string` |

No changes to `User` model or `MeResponse`.

---

## Verification

Once the API discovery step is done and the SDK is pointed at the new
endpoints:

1. `pnpm dev-tools moonboard fetch > .../moonboard-problems.json` exits 0 and
   produces a non-empty JSON file with the new shape
   (`{ setups: [{ setup, problems }, …] }`).
2. `dev-tools setup data` re-seeds the local DB without error; Climbs with
   `source: 'system'` and `sourceId` show up under the "Moonboard" Location
   in the Climbing tab.
3. Running `setup data` twice in a row does not duplicate Climbs (upsert on
   `sourceId` works).
4. The CLI fails cleanly (non-zero exit, useful error) when
   `MOONBOARD_USERNAME` / `MOONBOARD_PASSWORD` are unset.
