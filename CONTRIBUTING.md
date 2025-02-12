_This guide assumes you are using a Linux system like WSL or Ubuntu._

## Prerequisites

1. NodeJS.
2. _Recommended_ NVM.

## Getting started

1.  Clone repository through ssh `git@github.com:jrposada/fit-log.git`
2.  Install dependencies `npm i`
3.  Setup husky `npx husky`
4.  Execute code locally `npm run dev`

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

## Troubleshooting

