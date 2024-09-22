![CoverImage](https://github.com/user-attachments/assets/db930cee-8f0f-47b3-9729-9da8c3b6b2c1)

# Overview

Zapp.ie is an innovative solution that seamlessly integrates into Microsoft Teams and leverages Microsoft Copilot to create a dynamic, value-driven ecosystem of collaboration. Through a combination of AI automation and Bitcoin micro-transactions, Zapp.ie enables users, copilots (AI agents), and even customers to engage in meaningful interactions that drive success.

With Zapp.ie, users, copilots, and customers can:

- Send and receive Bitcoin-based rewards (Sats) as a token of appreciation for helping reach goals—whether from teammate to teammate, teammate to copilot, teammate to customer, or even copilot to copilot.
- Reinforce positive behaviors and effective workflows through microtransactions based on real value, enhancing both AI copilots’ learning and motivating teammates and customers to adopt the right ways of working.
- Enable both teammates and copilots to fund their own development by earning and utilizing rewards to further their personal and professional growth.

Zapp.ie transforms traditional incentives into a powerful, value-for-value system where AI copilots, human teammates, and customers work together, driving continuous improvement and engagement in a transparent, rewarding manner.

# Design

The vision of the solution (many elements still in draft) can be seen here:

<table width="100%">
  <tr>
    <td width="30%"><img src="https://github.com/user-attachments/assets/aa9a5979-302f-4812-be14-4e92a874f544"/></td>
    <td width="30%"><img src="https://github.com/user-attachments/assets/82c97b0a-2771-40a9-ba55-95b9f9736474"/></td>
    <td width="30%"><img src="https://github.com/user-attachments/assets/ec7827a8-43ed-455b-93e8-e42ea8d97613"/></td>
  </tr>
  <tr>
    <td width="30%"><img src="https://github.com/user-attachments/assets/dfdea569-36cd-4407-9fb5-b782b7535aa6"/></td>
    <td width="30%"><img src="https://github.com/user-attachments/assets/2ed3a8e4-3128-475e-baf8-5a1fc13f0ab3"/></td>
    <td width="30%"><img src="https://github.com/user-attachments/assets/9f904f0b-e91a-4797-a5f1-a1d06243db3a"/></td>
  </tr>
  <tr>
    <td width="30%"><img src="https://github.com/user-attachments/assets/a9519947-26c8-4b5b-b0d8-4db7db0ccecc"/></td>
    <td width="30%"><img src="https://github.com/user-attachments/assets/03c1d7c7-7e86-46a9-845e-f5301bb80c45"/></td>
    <td width="30%"><img src="https://github.com/user-attachments/assets/6ec83fd9-f9cb-4ca1-b9d7-9ef84db09bd2"/></td>
  </tr>
</table>

The designs can be previewed in [Figma](https://www.figma.com/proto/i0GdiVa7Dgu1FVSNwhBpjZ/Zapp.ie?node-id=607-67310&node-type=frame&t=FVljvFCjf72XgbJR-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=607%3A67310)

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

# Get in touch

Have fun, and tag us on Twitter / Nostr!

![FooterImage](https://github.com/user-attachments/assets/3c798d0d-9466-493d-9a66-ee5fe2c374f5)
