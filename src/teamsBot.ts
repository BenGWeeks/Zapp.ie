import {
  TeamsActivityHandler,
  TurnContext,
  SigninStateVerificationQuery,
  MemoryStorage,
  ConversationState,
  UserState,
  CardFactory,
  Middleware,
  MessageFactory,
} from "botbuilder";
import { SSOCommand, SSOCommandMap } from "./commands/SSOCommandMap"; // Adjust the import path as necessary
import { getWallets, ensureUserWallet, payInvoice, getWalletIdByUserId, createInvoice } from './components/lnbitsService'; // Import the payInvoice function

let globalWalletId: string | null = null;

// Define global variables
let globalZapAmount: number;
let globalMentionedUserId: string;
let globalMentionedUserName: string;

export class EnsureWalletMiddleware implements Middleware {
  async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    try {
      if (context.activity.type === 'message' || context.activity.type === 'conversationUpdate') {
        await this.ensureWallet(context);
      }
    } catch (error) {
      console.error('Error in EnsureWalletMiddleware:', error);
      await context.sendActivity('An error occurred while ensuring the wallet.');
    }

    // Continue with the next middleware or bot logic
    await next();
  }

  private async ensureWallet(context: TurnContext): Promise<void> {
    const userId = context.activity.from.id;
    const userName = context.activity.from.name;
    console.log(`User ID: ${userId}, User Name: ${userName}`);

    // Ensure the user has a wallet and get the wallet ID
    const walletId = await ensureUserWallet(userId, userName);

    if (walletId) {
      await context.sendActivity(`Wallet ID: ${walletId}`);
    } else {
      await context.sendActivity('Failed to ensure wallet.');
    }
  }
}

// Define specific commands
class SendZapsCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    const card = createZapCard();
    const message = MessageFactory.attachment(CardFactory.adaptiveCard(card));
    await context.sendActivity(message);
    async function sendZaps(context, message) {
      try {
        // Extract the mentioned user from the message
        const mentionedUser = message.entities.find(entity => entity.type === 'mention');
        
        if (!mentionedUser) {
          await context.sendActivity("Please mention a user to send zaps to.");
          return;
        }

        const userId = mentionedUser.mentioned.id;
        const userName = mentionedUser.mentioned.name;
    
        // Get the wallet ID by user ID
        const recipientWalletId = await getWalletIdByUserId(userId);
    
        if (!recipientWalletId) {
          await context.sendActivity(`Could not find a wallet for user ${userName}.`);
          return;
        }
    
        // Extract the amount from the message
        const amount = extractAmountFromMessage(message.text);
    
        // Create an invoice for the amount in the recipient's wallet
        const paymentRequest = await createInvoice(recipientWalletId, amount);
    
        if (!paymentRequest) {
          await context.sendActivity("Failed to create an invoice.");
          return;
        }
    
        // Pay the invoice
        const result = await payInvoice(paymentRequest);
    
        if (result && result.payment_hash) {
          const mention = {
            mentioned: {
              id: userId,
              name: userName
            },
            text: `<at>${userName}</at>`,
            type: 'mention'
          };
          
          await context.sendActivity(`Successfully sent ${amount} zaps to ${userName}.`);
        } else {
          await context.sendActivity("Failed to pay the invoice.");
        }
      } catch (error) {
        console.error("Error sending zaps:", error);
        await context.sendActivity("Sorry, something went wrong while sending zaps.");
      }
    }
    
    // Helper function to extract the amount from the message text
    function extractAmountFromMessage(text) {
      const amountMatch = text.match(/(\d+)/);
      return amountMatch ? parseInt(amountMatch[0], 10) : 0;
    }
  }
}

class ShowMyBalanceCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    try {
      await context.sendActivity("Showing your balance...");

      // Retrieve the user's GUID
      const userId = context.activity.from.aadObjectId || context.activity.from.id;

      // Call the getWallets function
      const wallets = await getWallets();

      if (wallets) {
        // Filter wallets containing the user's GUID in the name
        const filteredWallets = wallets.filter(wallet => wallet.name.includes(userId));
        console.log("Filtered Wallets:", filteredWallets);

        // Format the filtered wallets into an actionable card response
        const cardResponse = {
          type: "AdaptiveCard",
          body: filteredWallets.map(wallet => {
            let walletName = wallet.name;
            // Remove the GUID and the " - " separator
            walletName = walletName.replace(`${userId} - `, '');
            return {
              type: "TextBlock",
              text: `Name: ${walletName}\nTotal: ${wallet.balance_msat / 1000} Zaps`,
              weight: "Bolder",
              size: "Medium"
            };
          }),
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
        await context.sendActivity({ attachments: [CardFactory.adaptiveCard(cardResponse)] });
      }
    } catch (error) {
      console.error("Error in ShowMyBalanceCommand:", error);
      await context.sendActivity("Sorry, something went wrong while showing your balance.");
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
        // Regular expression to match GUIDs
        const guidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
// Filter wallets ending with "Receiving"
const filteredWallets = wallets.filter(wallet => wallet.name.toLowerCase().endsWith("receiving"));
console.log("Filtered Wallets:", filteredWallets);
    
// Sort wallets by balance_msat in descending order
const sortedWallets = filteredWallets.sort((a, b) => b.balance_msat - a.balance_msat);
    
        // Format the sorted wallets into an actionable card response
        const cardResponse = {
          type: "AdaptiveCard",
          body: filteredWallets.map(wallet => {
            let walletName = wallet.name;
            // Check if the wallet name contains a GUID
            const match = walletName.match(guidRegex);
            if (match) {
              // Remove the GUID and the " - " separator
              walletName = walletName.replace(`${match[0]} - `, '');
            }
            return {
              type: "TextBlock",
              text: `Name: ${walletName}\nTotal: ${wallet.balance_msat / 1000} Zaps`,
              weight: "Bolder",
              size: "Medium"
            };
          }),
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
        await context.sendActivity({ attachments: [CardFactory.adaptiveCard(cardResponse)] });
      }
    } catch (error) {
      console.error("Error showing leaderboard:", error);
      await context.sendActivity("Sorry, something went wrong while showing the leaderboard.");
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
      let mentions = TurnContext.getMentions(context.activity);
      const text = context.activity.text.trim();
      mentions = mentions.filter(mention => mention.mentioned.id !== context.activity.recipient.id);

  // Print out the list of mentions
  console.log("Mentions:", mentions);

  // Log the text variable
  console.log("Text:", text);

  const uniqueMentions = [];
  const mentionMap = new Map();
  mentions.forEach(mention => {
    if (!mentionMap.has(mention.mentioned.id)) {
      mentionMap.set(mention.mentioned.id, mention);
      uniqueMentions.push(mention);
    }
  });

  // Log the unique mentions
  console.log("Unique Mentions:", uniqueMentions);


      if (text.toLowerCase().includes("send zaps") && uniqueMentions.length > 0) {
        const mentionedUser = uniqueMentions[0].mentioned;
        globalMentionedUserName = mentionedUser.name;

        
    
        // Log the ObjectID of the mentioned user
    console.log("Mentioned User ObjectID:", mentionedUser.id);

        // Ensure the mentioned user is not the bot itself
        if (mentionedUser.id !== context.activity.recipient.id) {
          const sendZapsCommand = new SendZapsCommand();
          await sendZapsCommand.execute(context);
        } else {
          await context.sendActivity(MessageFactory.text('You cannot send zaps to the bot itself.'));
        }
      } else  {
        await context.sendActivity(MessageFactory.text('Invalid command or no valid mentions detected.'));
      }
        // Clear the mentions variable
      mentions = [];
    
      try {
        // Retrieve user information
        const userId = context.activity.from.aadObjectId || context.activity.from.id;
        const userName = context.activity.from.name;
    
        // Log user information
        console.log(`User Object ID: ${userId}`);
        console.log(`User Display Name: ${userName}`);
        const { receivingWalletId, sendingWalletId } = await ensureUserWallet(userId, userName);
    
   
        let txt = context.activity.text;
        // remove the mention of this bot
        const removedMentionText = TurnContext.removeRecipientMention(context.activity);
        if (removedMentionText) {
          // Remove the line break
          txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
        }

        
if (context.activity.value && context.activity.value.action === 'submitZaps') {
  const amount = context.activity.value.zapAmount;

  if (!amount || isNaN(amount)) {
    await context.sendActivity(MessageFactory.text('Invalid amount specified.'));
    return;
  }


  
  try {
    // Assuming recipientWalletId is known or retrieved from context
    const recipientWalletId = 'recipient-wallet-id'; // Replace with actual recipient wallet ID

    // Create an invoice
    const paymentRequest = await createInvoice(recipientWalletId, parseInt(amount));

    if (!paymentRequest) {
      await context.sendActivity(MessageFactory.text('Failed to create invoice.'));
      return;
    }

    // Pay the invoice
    const paymentResult = await payInvoice(paymentRequest);

    if (paymentResult) {
      await context.sendActivity(MessageFactory.text('Zaps submitted successfully!'));
    } else {
      await context.sendActivity(MessageFactory.text('Failed to submit zaps.'));
    }
  } catch (error) {
    console.error('Error handling submit zaps:', error);
    await context.sendActivity(MessageFactory.text('An error occurred while submitting zaps.'));
  }
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
      const userId = context.activity.from.id;
      const userName = context.activity.from.name;
      console.log(`User ID: ${userId}, User Name: ${userName}`);
  
      // Ensure the user has a wallet and get the wallet ID
      const walletId = await ensureUserWallet(userId, userName);
  
      if (walletId) {
        await context.sendActivity(`Wallet ID: ${walletId}`);
      } else {
        await context.sendActivity('Failed to ensure wallet.');
      }
    } catch (error) {
      console.error('Error in onSignInInvoke:', error);
      await context.sendActivity('An error occurred during sign-in.');
    }
  }
}
// Function to create an adaptive card
function createZapCard() {
  return {
    type: "AdaptiveCard",
    body: [
      {
        type: "TextBlock",
        text: `How many Zaps would you like to send to ${globalMentionedUserName}?`,
        weight: "bolder",
        size: "medium"
      },
      {
        type: "Input.Number",
        id: "zapAmount",
        placeholder: "Enter the number of zaps",
        min: 1
      },
      {
        type: "ActionSet",
        actions: [
          {
            type: "Action.Submit",
            title: "Send Zaps",
            data: {
              action: "submitZaps"
            }
          }
        ]
      }
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.2"
  };
}

// Assuming the message handler function is defined above
// Add the code to handle the "Submit Zaps" action here
