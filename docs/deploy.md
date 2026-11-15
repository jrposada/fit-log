# Deploying the backend

The production backend runs as a docker compose stack on a free Oracle Cloud ARM VM, behind Caddy for HTTPS. `<host>` below is the DuckDNS hostname, e.g. `fitlog.duckdns.org`.

| Path                   | Served by                |
| ---------------------- | ------------------------ |
| `https://<host>/api`   | backend                  |
| `https://<host>/files` | backend (uploaded files) |
| `https://<host>/auth`  | Keycloak                 |

Only Caddy publishes ports (80, 443). Mongo, Redis, Postgres and Keycloak are reachable only over the compose network.

Files: `packages/backend/docker-compose.prod.yml`, `packages/backend/deploy/Caddyfile`, `packages/backend/.prod.example.env`, `packages/backend/keycloak/realm-export.prod.json`.

The backend image (`ghcr.io/jrposada/fit-log-backend:latest`) is built by the manual **Backend image** workflow (`.github/workflows/backend-image.yml`). It is never built on the VM. Make the GHCR package public, or run `docker login ghcr.io` on the VM.

## One-time setup

### 1. Oracle Cloud VM

1. Sign up for Oracle Cloud. **The home region can't be changed later**: Always Free ARM instances only run there, and popular regions are often out of ARM capacity.
2. Upgrade the account to **Pay-As-You-Go**. It stays €0 within the Always Free limits, and Oracle reclaims idle Always Free instances on free-tier-only accounts.
3. Create an instance: image **Ubuntu 22.04**, shape **`VM.Standard.A1.Flex`** (Ampere ARM), with a public IPv4 address and your SSH key. If creation fails with "out of host capacity", retry later or try another availability domain.

### 2. Open ports 80 and 443

Both layers must allow them, or Let's Encrypt validation fails silently:

1. **VCN security list:** in the instance's subnet, add ingress rules for TCP 80 and TCP 443 from `0.0.0.0/0`.
2. **The VM's own iptables:** Oracle's Ubuntu images insert a `REJECT` rule into `INPUT`. Add the `ACCEPT` rules above it:

   ```bash
   sudo iptables -L INPUT --line-numbers   # note the line number of the REJECT rule, e.g. 6
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   ```

### 3. Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"   # log out and back in afterwards
docker compose version
```

### 4. DuckDNS

Sign in at [duckdns.org](https://www.duckdns.org), register a subdomain, and set its IP to the VM's public IP. Check with `dig +short <host>`.

### 5. Repo and env file

```bash
git clone https://github.com/jrposada/fit-log.git
cd fit-log/packages/backend
cp .prod.example.env .env.prod
```

Edit `.env.prod`:

- Replace `fitlog.duckdns.org` with `<host>` in `FITLOG_HOST`, `KEYCLOAK_ENDPOINT` and `PUBLIC_FILES_BASE_URL`.
- Set strong values for `KEYCLOAK_ADMIN_PASSWORD` and `KEYCLOAK_DB_PASSWORD`.

`KEYCLOAK_ENDPOINT` must be exactly `https://<host>/auth`. Keycloak puts it in every token's `iss` claim, and the backend rejects any token whose issuer differs.

`.env.prod` exists only on the VM. It is gitignored; never commit it.

### 6. Start the stack

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f caddy
```

Wait until Caddy logs that it obtained the certificate for `<host>`.

### 7. Create your account

Registration is off and the realm has no users. Open `https://<host>/auth/admin`, sign in with `KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`, switch to the `FIT Log` realm, and create your user under **Users**. Set a non-temporary password under **Credentials**, and fill in email, first name and last name (the backend requires `email` and `name` claims).

## Updating

After publishing a new image with the **Backend image** workflow:

```bash
cd fit-log
git pull
cd packages/backend
docker compose -f docker-compose.prod.yml --env-file .env.prod pull
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Changing the realm

`--import-realm` skips a realm that already exists, so edits to `realm-export.prod.json` have no effect after the first boot. Either make the change in the admin console, or reset Keycloak's database. **That deletes all Keycloak users**:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod down
docker volume rm backend_keycloak-db-data   # <compose project>_keycloak-db-data; see `docker volume ls`
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Verifying

```bash
# OIDC discovery: issuer must be https://<host>/auth/realms/FIT%20Log
curl -s "https://<host>/auth/realms/FIT%20Log/.well-known/openid-configuration" | jq -r .issuer

# Protected endpoint: 401 without a token
curl -s -o /dev/null -w '%{http_code}\n' https://<host>/api/me

# ...and 200 with one
TOKEN=$(curl -s -X POST "https://<host>/auth/realms/FIT%20Log/protocol/openid-connect/token" \
  -d grant_type=password -d client_id=fit-log-mobile \
  -d username=<email> -d password=<password> | jq -r .access_token)
curl -s -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $TOKEN" https://<host>/api/me
```

Uploaded files are served from `https://<host>/files/...` (the `imageUrl` returned by `POST /api/images`). 3D reconstruction isn't available in this image: a submitted job ends `failed` and the backend keeps running.
