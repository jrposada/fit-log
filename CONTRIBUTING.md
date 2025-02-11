# FIT Log developer guide

_This guide assumes you are using a Linux system like WSL or Ubuntu._

## Prerequisites

## Getting started

```bash
# Install project node dependencies
npm i
# Launch local full-stack in debug mode
npm run dev
```

## Contributing

1. Pull latest `beta` branch.

   ```bash
   git checkout beta
   git pull
   ```

2. Create branch name. Branch name must follow pattern `[feat|fix]/<short-description>`. For example `feat/dynamo-db-request` or `fix/incorrect-aws-credentials`

3. Make your changes and publish branch.

4. Open Pull Request against `beta`. Make sure to include a short description of your changes. Make sure your PR title follow's pattern `[feat|fix]: <short-description>`. For example `feat: dynamo-db-request` or `fix: incorrect-aws-credentials`.

   Use the following template for your description:

   ```markdown
   ## Summary

   Explain your changes.
   ```

5. Wait for your changes to be approved.

## AWS Credentials

To test app functionality you will need access to an AWS account. If you do not have one you may request one to be created.

You can refresh you local AWS credentials by running the following command. Make sure to update the profile name to match one configured in your local machine.

```bash
aws sso login --profile <your-profile>
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

2. Configure AWS CLI with IAM Identity Center profile

   ```bash
   aws configure sso
   ```

   ```
   SSO session name (Recommended): jrposada-sso
   SSO start URL [None]: https://d-806701903d.awsapps.com/start/#
   SSO region [None]: eu-west-3
   ```

   Choose `FITLogDeveloper` role and `eu-west-3` region when prompted.

   For the profile name you can use whatever you prefer. For this guide we have used `fit-log-dev`

   Run `aws dynamodb list-tables --profile fit-log-dev` to test your setup.

   If everything goes correctly you should see a list of DynamoDB tables and you `~/.aws/config` file should look something like:

   ```
   [profile fit-log-dev]
   sso_session = jrposada-sso
   sso_account_id = <account-id>
   sso_role_name = FITLogDeveloper
   region = eu-west-3
   output = json

   [sso-session jrposada-sso]
   sso_start_url = https://d-806701903d.awsapps.com/start/#
   sso_region = eu-west-3
   sso_registration_scopes = sso:account:access
   ```

## Troubleshooting
