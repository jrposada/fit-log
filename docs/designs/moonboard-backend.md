# Design: Moonboard Backend Sync

## Context

Fit-log wants to sync Moonboard problems into its own DB so they appear in the Climbing tab as regular Climbs. Moonboard credentials are server configuration (env vars), not per-user settings. A background cron job handles the sync automatically.

Depends on: none  
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

### Moonboard Service — `backend/src/services/moonboard.ts`

1. **Login** — POST `https://www.moonboard.com/Account/Login` with form-encoded credentials. Extracts `_MoonBoard` and `__RequestVerificationToken` session cookies.
2. **Session cache** — In-memory singleton `{ cookies, expiresAt }`, TTL 2h. Re-authenticates on expiry or 401/403.
3. **Fetch problems** — GET `/Problem/GetProblems` with session cookies.
4. **Fetch benchmarks** — GET `/Problem/GetBenchmarkProblems` with session cookies.

### Data Mapping (Moonboard → fit-log)

Moonboard concepts map to existing fit-log models:

| Moonboard | fit-log |
|-----------|---------|
| Board brand | `Location` named `"Moonboard"`, `source: 'system'` |
| Board setup (e.g. "2016", "2019") | `Sector` under Moonboard Location, `source: 'system'` |
| Problem | `Climb` under the relevant Sector, keyed on `sourceId` |

`Location`, `Sector`, and `Climb` models gain a mandatory `source: string` field (default `'user'` for existing records — no migration script needed). `Climb` gains `sourceId?: string` as the upsert deduplication key.

### Sync Job — `backend/src/jobs/moonboard-sync.ts`

- Runs once on server startup and on a daily cron (e.g. `0 3 * * *`).
- Fetches problems + benchmarks, maps to fit-log models, bulk-upserts on `sourceId`.
- Logs success/failure; does not crash the server on error.
- Use `node-cron` if available, otherwise a scheduled `setTimeout`.

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

1. Server starts with `MOONBOARD_USERNAME` / `MOONBOARD_PASSWORD` set → sync runs, no crash.
2. After sync: Climbs with `sourceId` visible under "Moonboard" Location in Climbing tab.
3. Re-running sync does not duplicate Climbs.
4. Server starts without env vars → sync is skipped silently.
