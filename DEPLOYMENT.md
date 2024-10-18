# Deployment and Authentication Setup

## Prerequisites

- Node.js and npm installed
- AWS account and configured AWS CLI
- GitHub repository with your React application
- Google Developer account with a registered app and client ID

## Deployment Steps

1. Install AWS Amplify CLI:

   ```
   npm install -g @aws-amplify/cli
   ```

2. Initialize Amplify in your project:

   ```
   amplify init
   ```

3. Set up hosting and connect your GitHub repository via the Amplify Console

4. Commit and push your changes to GitHub. Amplify will automatically start a new build.

## Setting up Authentication with AWS Cognito and Google Sign-In

1. Add authentication to your Amplify project:

   ```
   amplify add auth
   ```

   Choose "Default configuration" and select your preferred sign-in method.

2. Push the changes to AWS:

   ```
   amplify push
   ```

3. In the Amazon Cognito console:
   a. Find your User Pool
   b. Go to "Sign-in experience" and choose "Add identity provider"
   c. Select "Google" and enter your Google Client ID and Secret
   d. For "Authorized scopes", enter: `profile email openid`
   e. Save your changes

4. Update your app client:
   a. In Cognito, go to "App integration" > "App client list"
   b. Select the `clientWeb` app client
   c. Under "Hosted UI", add Google as an identity provider
   d. Add your app's domain to "Allowed callback URLs"

5. In the Google Cloud Console:
   a. Add your app's domain to "Authorized JavaScript origins"
   b. Add your app's domain + '/callback' to "Authorized redirect URIs"

[... keep any remaining relevant content ...]

## Setting up Google Authentication

[... keep the existing Google Authentication setup steps ...]

## Updating the React Application

[... keep the existing React application update steps ...]

## Monitoring and Managing Your Deployment

1. Go to the AWS Amplify Console in your browser.
2. Select your app to view its status, deployment history, and settings.
3. You can manually redeploy, view logs, and manage environment variables from here.

Remember, with continuous deployment set up, pushing changes to your connected GitHub branch will automatically trigger a new build and deployment in Amplify.
