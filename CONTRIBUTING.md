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

## Adding a 3D model to a climb

3D models are preprocessed from a Sketchfab download (OBJ + UDIM textures) into a single GLB file and served as static assets.

### 1. Download the model from Sketchfab

On the model page, click **Download** and choose the **Original** format. You will receive a ZIP containing `lowpoly.obj` and UDIM texture tiles named `texture_XXXX.jpg`.

### 2. Run the preprocessing command

```bash
pnpm cli process-model \
  --input <path-to-zip> \
  --output packages/backend/.data/public/models/<model-name>.glb \
  --tile-size 1024
```

This command:
- Extracts the OBJ geometry from the ZIP.
- Stitches the UDIM texture tiles into a single atlas using `sharp`.
- Remaps UV coordinates so they map into the stitched atlas.
- Converts OBJ + MTL → GLB via `obj2gltf`.

`--tile-size` controls the per-tile resolution in the stitched atlas (default `1024`). Lower values produce smaller files; `512` is sufficient for most cases.

### 3. Link the model to the climb

Set `model3dUrl` to the relative path on the climb document in MongoDB:

```
models/<model-name>.glb
```

The backend resolves it to a full URL at query time using `PUBLIC_FILES_BASE_URL`.

### 4. Verify

Open the climb detail screen in the mobile app. A 3D viewer should appear below the climb image, with pinch-to-zoom and rotation via OrbitControls.

### TODO: 3D hold and spline editing

Interactive editing of holds and splines on the 3D model is not yet implemented. It requires:

- **Schema migration** — `Hold` stores normalized 2D `{x, y}`. 3D holds need `{x, y, z}` in model space. All existing hold data and every read/write path must be migrated.
- **Raycasting** — Tapping the model must cast a ray against the mesh to get the surface intersection point (Three.js `Raycaster`).
- **Gesture conflict resolution** — OrbitControls and tap-to-place share the same touch surface. A mode toggle (orbit vs. edit) is needed, controlled from the React Native side via `postMessage` into the WebView.
- **Bidirectional WebView ↔ React Native state** — Hold/spline placements happen inside the WebView; results must flow back out via `postMessage` into React Hook Form.
- **3D spline editing** — Control-point handles for `THREE.CatmullRomCurve3` need to be draggable without conflicting with orbit.

---

## Troubleshooting

## Components

- [HX711](https://electronperdido.com/shop/sensores/fuerza/modulo-de-pesaje-electronico-hx711/) [Datasheet](https://electronperdido.com/wp-content/uploads/2015/10/HX711-datasheet.pdf)
- [ESP32 Wifi + Bluetooth](https://electronperdido.com/shop/esp32-esp8266/modulo-esp32-dual-wifi-bluetooth/)
- [Load cell 20Kg](https://electronperdido.com/shop/sensores/fuerza/celda-de-carga-20kg/): Input Red-Black (5-10V) | Signal Green-White (1 mV/V ± 150 μV/V)
