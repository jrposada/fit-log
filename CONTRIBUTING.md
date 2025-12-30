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

2. Install dependencies `npm i && npx husky`

3. Look for `.example.env` files. Create a new `.env` file for each of them and fill all the data.

4. Run app in development mode

```
npm -w packages/<app-name> run dev
```

5. Initialize local database

```
npm run cli nuke
```

To clear all data from the database:

```
npm run cli nuke
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

