_This guide assumes you are using a Linux system like WSL or Ubuntu._

## Prerequisites

1. NodeJS.

2. _Recommended_ NVM.

3. Android Studio and Android SDK.

4. Docker.

_For Mac_ You need to manually add `docker` to `PATH` variable by adding the following to your profile file.

```
# Add Docker Desktop for Mac (docker)
export PATH="$PATH:/Applications/Docker.app/Contents/Resources/bin/"
```

6. _For WSL_ Extra Android Studio installation instructions.

    1. Update ENV variables in your profile.

    ```
    # Android Studio
    export ANDROID_HOME=/mnt/c/Users/jrpos/AppData/Local/Android/Sdk
    export WSLENV=ANDROID_HOME/p
    ```

    2. Run setup script

    ```
    ./scripts/wsl-setup.sh
    ```

    3. Update Android Studio terminal to WSL's: Settings > Tools > Terminal > Shell Path

## Getting started

1. Clone repository through ssh `git@github.com:jrposada/fit-log.git`

2. Install dependencies `pnpm install && pnpm exec husky`

3. Look for `.example.env` files. Create a new `.env` file for each of them and fill all the data.

4. Run app in development mode

```
pnpm --filter <app-name> dev
```

5. Initialize local database

```
pnpm cli setup data
```

To clear all data from the database:

```
pnpm cli setup nuke --nuke
```

## Contributing

1. Pull latest `beta` branch.

   ```bash
   git checkout beta
   git pull
   ```

2. Create branch name. Branch name must follow pattern `[feat|fix|chore]/<short-description>`. For example `feat/dynamo-db-request` or `fix/incorrect-aws-credentials`

3. Make your changes and publish branch.

4. Open Pull Request against `beta`. Make sure to include a short description of your changes. Make sure your PR title follow's pattern `[feat|fix|chore]: <short-description>`. For example `feat: dynamo-db-request` or `fix: incorrect-aws-credentials`.

5. Wait for your changes to be approved.

## Troubleshooting

### Running the mobile app on a physical device

When the app runs on a real device (e.g. via Expo Go), `localhost` resolves to
the **phone itself**, not your dev machine. The login page may load, but
submitting credentials or calling the API fails with a "cannot connect to
server" error. This happens because the env files point at `localhost`.

Fix it by pointing the relevant URLs at your machine's LAN IP — the address on
the network the device shares with you (an iPhone USB/tethering connection uses
the `172.20.10.x` range; plain WiFi uses your router's subnet):

```bash
pnpm set-dev-ip          # auto-detect the default-route IP
pnpm set-dev-ip <ip>     # or force a specific IP, e.g. 172.20.10.2
```

This rewrites three lines:

- `packages/app-mobile/.env` → `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_KEYCLOAK_URL`
- `packages/backend/.env` → `KEYCLOAK_ENDPOINT`

`KEYCLOAK_ENDPOINT` is also passed to Keycloak as `KC_HOSTNAME_URL`, which
controls both the login page's links and the JWT issuer claim. When the IP
changes, the script **recreates the Keycloak container itself** so the new host
takes effect — you don't need to do that step manually.

It can't restart the dev servers you run in your own terminals, so after the
script finishes, restart both so they re-read the new host:

```bash
# Backend — re-reads KEYCLOAK_ENDPOINT for the issuer + JWKS
pnpm --filter @jrposada/fit-log-backend dev

# Expo — clean cache, since EXPO_PUBLIC_* vars are bundled at build time
pnpm --filter @jrposada/fit-log-app-mobile exec expo start -c
```

The IP is assigned per session (especially over tethering), so re-run
`pnpm set-dev-ip` whenever it changes.

## Components

- [HX711](https://electronperdido.com/shop/sensores/fuerza/modulo-de-pesaje-electronico-hx711/) [Datasheet](https://electronperdido.com/wp-content/uploads/2015/10/HX711-datasheet.pdf)
- [ESP32 Wifi + Bluetooth](https://electronperdido.com/shop/esp32-esp8266/modulo-esp32-dual-wifi-bluetooth/)
- [Load cell 20Kg](https://electronperdido.com/shop/sensores/fuerza/celda-de-carga-20kg/): Input Red-Black (5-10V) | Signal Green-White (1 mV/V ± 150 μV/V)
