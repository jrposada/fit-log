_This guide assumes you are using a Linux system like WSL or Ubuntu._

## Prerequisites

1. NodeJS.

2. _Recommended_ NVM.

3. Android Studio and Android SDK.

4. Docker.

_For Mac_ You many need to manually add `docker` to `PATH` variable by adding the following to your profile file.

```
# Add Docker Desktop for Mac (docker)
export PATH="$PATH:/Applications/Docker.app/Contents/Resources/bin/"
```

5. [Configure AWS CLI](#configure-aws-cli)

6. _For WSL_ Extra Android Studio installation instructions.

    1. Update ENV variables in your profile.

    ```
    # Android Studio
    export ANDROID_HOME=/mnt/c/Users/jrpos/AppData/Local/Android/Sdk
    export WSLENV=ANDROID_HOME/p
    ```

    2. Run setup script

    ```
    ./scripts/setup.sh
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
aws dynamodb create-table \
    --table-name fit-log-development \
    --attribute-definitions AttributeName=PK,AttributeType=S AttributeName=SK,AttributeType=S \
    --key-schema AttributeName=PK,KeyType=HASH AttributeName=SK,KeyType=RANGE \
    --billing-mode PROVISIONED \
    --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \
    --endpoint-url http://localhost:3200
```

6. Seed local database with mock data (optional)

```
npm -w packages/dev-tools run start -- seed <user-id> --num-workouts 10 --num-climbs 15
```

Replace `<user-id>` with your test user ID. You can adjust the number of workouts and climbs as needed.

To clear all data from the database:

```
npm -w packages/dev-tools run start -- nuke
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

   Use the following template for your description:

   ```markdown
   ## Summary

   Explain your changes.
   ```

5. Wait for your changes to be approved.

### Deploy from local (test only)

1. `npm run build --workspace=packages/backend`
2. `npm run deploy --workspace=packages/backend`

## AWS Credentials

To test app functionality you will need access to an AWS account. If you do not have one you may request one to be created.

You can refresh you local AWS credentials by login into your SSO start url: https://d-xxxxxxxx.awsapps.com/start and copy the credentials into your local `~/.aws/credentials` file. You can change profile name as needed.

```
[default]
aws_access_key_id=...
aws_secret_access_key=...
aws_session_token=...
```

### How to create a User

1. Go to **IAM Identity Center**
2. Got to **Users** section and select **Add user**
3. Fill username and click **Next**
4. Add new user to group **FITLogDeveloper**
5. User should receive an email to setup their password and do their first login.
6. For subsequent access the will need IAM Identity Center's **AWS access portal URL**

### Configure AWS CLI

1. [Install AWS CLI 2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) Follow Linux instructions. _Don't forget to remove installer folder once you are done._

2. Add `region=eu-west-3` to profile configuration or credentials file.

## Troubleshooting

