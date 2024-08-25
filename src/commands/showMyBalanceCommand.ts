import { SSOCommand, SSOCommandMap } from './SSOCommandMap';
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
} from 'botbuilder';
import {
  getWallets,
  ensureMatchingUserWallet,
  payInvoice,
  getWalletIdByUserId,
  createInvoice,
} from '../services/lnbitsService';

export class ShowMyBalanceCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    try {
      //await context.sendActivity('Showing your balance...');
      console.log('Showing your balance...');

      // Retrieve the user's GUID
      const userId =
        context.activity.from.aadObjectId || context.activity.from.id;

      // Call the getWallets function
      const wallets = await getWallets();

      if (wallets) {
        // Filter wallets containing the user's GUID in the name
        const filteredWallets = wallets.filter(wallet =>
          wallet.name.includes(userId),
        );
        console.log('Filtered Wallets:', filteredWallets);

        // Format the filtered wallets into an actionable card response
        const cardResponse = {
          type: 'AdaptiveCard',
          body: filteredWallets.map(wallet => {
            let walletName = wallet.name;
            // Remove the GUID and the " - " separator
            walletName = walletName.replace(`${userId} - `, '');
            return {
              type: 'TextBlock',
              text: `Name: ${walletName}\nBalance: ${
                wallet.balance_msat / 1000
              } Sats`,
              weight: 'Bolder',
              size: 'Medium',
            };
          }),
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'View Wallets',
              url: 'http://localhost:3000/users',
            },
          ],
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          version: '1.2',
        };

        // Send the formatted card as an activity
        await context.sendActivity({
          attachments: [CardFactory.adaptiveCard(cardResponse)],
        });
      }
    } catch (error) {
      console.error('Error in ShowMyBalanceCommand:', error);
      await context.sendActivity(
        'Sorry, something went wrong while showing your balance.',
      );
    }
  }
}
