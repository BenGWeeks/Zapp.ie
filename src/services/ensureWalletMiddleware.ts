import { Middleware, TurnContext } from 'botbuilder';
import { ensureUserWallet } from './lnbitsService';

export class EnsureWalletMiddleware implements Middleware {
  async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    console.log('EnsureWalletMiddleware: onTurn called'); // Logging

    if (context.activity.type === 'message' || context.activity.type === 'conversationUpdate') {
      console.log('EnsureWalletMiddleware: Processing activity type:', context.activity.type); // Logging

      const userId = context.activity.from.id;
      const userName = context.activity.from.name;

      // Ensure the user has a wallet and get the wallet ID
      const walletId = await ensureUserWallet(userId, userName);

      if (walletId) {
        await context.sendActivity(`Wallet ID: ${walletId}`);
      } else {
        await context.sendActivity('Failed to ensure wallet.');
      }
    }

    // Continue with the next middleware or bot logic
    await next();
  }
}