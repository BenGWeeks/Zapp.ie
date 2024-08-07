import {
  TeamsActivityHandler,
  TurnContext,
  SigninStateVerificationQuery,
  MemoryStorage,
  ConversationState,
  UserState,
  CardFactory
} from "botbuilder";
import { SSOCommand, SSOCommandMap } from "./commands/SSOCommandMap"; // Adjust the import path as necessary
import { getWallets } from './components/lnbitsService';

// Define specific commands
class SendZapsCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    try {
      await context.sendActivity("Sending zaps...");
    } catch (error) {
      console.error("Error in SendZapsCommand:", error);
    }
  }
}

class ShowMyBalanceCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    try {
      await context.sendActivity("Showing your balance...");
    } catch (error) {
      console.error("Error in ShowMyBalanceCommand:", error);
    }
  }
}

class WithdrawZapsCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    try {
      await context.sendActivity("Withdrawing zaps...");
    } catch (error) {
      console.error("Error in WithdrawZapsCommand:", error);
    }
  }
}

// New command for showing leaderboard
class ShowLeaderboardCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    try {
      await context.sendActivity("Showing leaderboard...");

      // Call the getWallets function
      const wallets = await getWallets();

      if (wallets) {
        // Sort wallets by balance_msat in descending order
        const sortedWallets = wallets.sort((a, b) => b.balance_msat - a.balance_msat);

        // Format the sorted wallets into an actionable card response
        const cardResponse = {
          type: "AdaptiveCard",
          body: sortedWallets.map(wallet => ({
            type: "TextBlock",
            text: `Wallet: ${wallet.name}\nBalance: ${wallet.balance_msat / 1000} satoshis`,
            weight: "Bolder",
            size: "Medium"
          })),
          actions: [
            {
              type: "Action.OpenUrl",
              title: "View Wallets",
              url: "https://example.com/wallets"
            }
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.2"
        };

        // Send the formatted card as an activity
        await context.sendActivity({
          attachments: [CardFactory.adaptiveCard(cardResponse)]
        });
      } else {
        await context.sendActivity("No wallets found.");
      }
    } catch (error) {
      console.error("Error in ShowLeaderboardCommand:", error);
      await context.sendActivity("An error occurred while showing the leaderboard.");
    }
  }
}

export class TeamsBot extends TeamsActivityHandler {
  conversationState: ConversationState;
  userState: UserState;

  constructor() {
    super();

    // Define the state store for your bot.
    const memoryStorage = new MemoryStorage();

    // Create conversation and user state with in-memory storage provider.
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);

    // Register commands
    SSOCommandMap.register("send zaps", new SendZapsCommand());
    SSOCommandMap.register("show my balance", new ShowMyBalanceCommand());
    SSOCommandMap.register("withdraw my zaps", new WithdrawZapsCommand());
    SSOCommandMap.register("show leaderboard", new ShowLeaderboardCommand());

    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");

      try {
        let txt = context.activity.text;
        // remove the mention of this bot
        const removedMentionText = TurnContext.removeRecipientMention(
          context.activity
        );
        if (removedMentionText) {
          // Remove the line break
          txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
        }

        // Trigger command by IM text
        const command = SSOCommandMap.get(txt);
        if (command) {
          await command.execute(context);
        } else {
          await context.sendActivity("Command not recognized.");
        }
      } catch (error) {
        console.error("Error in onMessage handler:", error);
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      try {
        const membersAdded = context.activity.membersAdded;
        for (let cnt = 0; cnt < membersAdded.length; cnt++) {
          if (membersAdded[cnt].id) {
            await context.sendActivity("Welcome to the sso bot sample!");
            break;
          }
        }
      } catch (error) {
        console.error("Error in onMembersAdded handler:", error);
      }
      await next();
    });
  }

  async run(context: TurnContext) {
    try {
      await super.run(context);

      // Save any state changes. The load happened during the execution of the Dialog.
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
    } catch (error) {
      console.error("Error in run method:", error);
    }
  }

  async handleTeamsSigninVerifyState(
    context: TurnContext,
    query: SigninStateVerificationQuery
  ) {
    try {
      console.log(
        "Running dialog with signin/verifystate from an Invoke Activity."
      );
      // Your logic here for handling signin verify state
    } catch (error) {
      console.error("Error in handleTeamsSigninVerifyState:", error);
    }
  }

  async handleTeamsSigninTokenExchange(
    context: TurnContext,
    query: SigninStateVerificationQuery
  ) {
    try {
      // Your logic here for handling token exchange
    } catch (error) {
      console.error("Error in handleTeamsSigninTokenExchange:", error);
    }
  }

  async onSignInInvoke(context: TurnContext) {
    try {
      // Your logic here for handling sign-in invoke
    } catch (error) {
      console.error("Error in onSignInInvoke:", error);
    }
  }
}