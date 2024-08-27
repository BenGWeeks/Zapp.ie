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

// New command for showing leaderboard
export class ShowLeaderboardCommand extends SSOCommand {
  async execute(context: TurnContext): Promise<void> {
    try {
      //await context.sendActivity('Showing leaderboard...');
      console.log('Showing leaderboard...');

      // Call the getWallets function
      const wallets = await getWallets();

      if (wallets) {
        // Regular expression to match GUIDs
        const guidRegex =
          /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
        // Filter wallets ending with "Receiving"
        const filteredWallets = wallets.filter(wallet =>
          wallet.name.toLowerCase().endsWith('receiving'),
        );
        console.log('Filtered Wallets:', filteredWallets);

        // Sort wallets by balance_msat in descending order
        const sortedWallets = filteredWallets.sort(
          (a, b) => b.balance_msat - a.balance_msat,
        );

        // Format the sorted wallets into an actionable card response
        const cardResponse = {
          type: 'AdaptiveCard',
          body: filteredWallets.map(wallet => {
            let walletName = wallet.name;
            // Check if the wallet name contains a GUID
            const match = walletName.match(guidRegex);
            if (match) {
              // Remove the GUID and the " - " separator
              walletName = walletName.replace(`${match[0]} - `, '');
              // Remove the "- Receiving" suffix
              walletName = walletName.replace(` - Receiving`, '');
            }
            return {
              type: 'TextBlock',
              text: `${walletName}\nTotal: ${wallet.balance_msat / 1000} Zaps`,
              weight: 'Bolder',
              size: 'Medium',
            };
          }),
          actions: [
            {
              type: 'Action.OpenUrl',
              title: 'View Wallets',
              url: 'https://localhost:3000/wallets',
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
      console.error('Error showing leaderboard:', error);
      await context.sendActivity(
        'Sorry, something went wrong while showing the leaderboard.',
      );
    }
  }
}
