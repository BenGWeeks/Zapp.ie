# Overview

Zapp.ie seamlessly integrates into Microsoft Teams, bringing a unique blend of Bitcoin micro-transactions and AI automation to enhance team collaboration and recognition. With Zapp.ie, you can effortlessly send Bitcoin-based rewards (Sats) to colleagues as a token of appreciation, automate recognition for positive behavior, and foster a more engaged and motivated workplace. Transform how your team acknowledges great work and builds a culture of gratitude directly within Teams.

# Getting Started with Zapp.ie

Zapp.ie integrates directly with Microsoft Teams to enhance collaboration and recognition through Bitcoin micro-transactions and AI-powered automation. Here’s how you can get started and use Zapp.ie effectively with your team:

## Prerequisite to use this sample

- [Node.js](https://nodejs.org/), supported versions: 18
- A Microsoft 365 tenant in which you have permission to upload Teams apps. You can get a free Microsoft 365 developer tenant by joining the [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [TeamsFx CLI](https://aka.ms/teams-toolkit-cli)

> Note: If you are using node 20, you can add following snippet in package.json to remove the warning of incompatibility. (Related discussion: https://github.com/microsoft/botbuilder-js/issues/4550)

```
"overrides": {
  "@azure/msal-node": "^2.6.0"
}
```

## Running Zapp.ie bot

### Run the app locally

- From VS Code:
  1. hit `F5` to start debugging. Alternatively open the `Run and Debug Activity` Panel and select `Debug in Teams (Edge)` or `Debug in Teams (Chrome)`.
- From TeamsFx CLI:
  1.  Install [dev tunnel cli](https://aka.ms/teamsfx-install-dev-tunnel).
  1.  Login with your M365 Account using the command `devtunnel user login`.
  1.  Start your local tunnel service by running the command `devtunnel host -p 3978 --protocol http --allow-anonymous`.
  1.  In the `env/.env.local` file, fill in the values for `BOT_DOMAIN` and `BOT_ENDPOINT` with your dev tunnel URL.
      ```
      BOT_DOMAIN=sample-id-3978.devtunnels.ms
      BOT_ENDPOINT=https://sample-id-3978.devtunnels.ms
      ```
  1.  Run command: `teamsapp provision --env local` .
  1.  Run command: `teamsapp deploy --env local` .
  1.  Run command: `teamsapp preview --env local` .

### Deploy the app to Azure

- From VS Code:
  1. Sign into Azure by clicking the `Sign in to Azure` under the `ACCOUNTS` section from sidebar.
  1. Click `Provision` from `LIFECYCLE` section or open the command palette and select: `Teams: Provision`.
  1. Click `Deploy` or open the command palette and select: `Teams: Deploy`.
- From TeamsFx CLI:
  1. Run command: `teamsapp auth login azure`.
  1. Run command: `teamsapp provision --env dev`.
  1. Run command: `teamsapp deploy --env dev`.

### Preview the app in Teams

- From VS Code:
  1. Open the `Run and Debug Activity` Panel. Select `Launch Remote (Edge)` or `Launch Remote (Chrome)` from the launch configuration drop-down.
- From TeamsFx CLI:
  1. Run command: `teamsapp preview --env dev`.

## Running Zapp.ie Web App (The Tabs in the bot)

- From VS Code:
  1. Navigate to the _Tabs_ directory
  2. Type `npm start`
