/// <reference path="./types/global.d.ts" />
import {
  TeamsActivityHandler,
  TurnContext,
  SigninStateVerificationQuery,
  MemoryStorage,
  ConversationState,
  UserState,
  CardFactory,
  MessageFactory
} from 'botbuilder';
import {  SSOCommandMap } from './commands/SSOCommandMap';
import { SendZapCommand, SendZap } from './commands/sendZapCommand';
import { ShowMyBalanceCommand } from './commands/showMyBalanceCommand';
import { WithdrawFundsCommand } from './commands/withdrawFundsCommand';
import { ShowLeaderboardCommand } from './commands/showLeaderboardCommand';
import {
  getUser,
  getWalletBalance,
} from './services/lnbitsService';

//Reward Name Constants

import { getRewardName } from './services/fetchRewardsName';

let globalRewardName: string;

(async () => {
  globalRewardName = await getRewardName();
  console.log(`Reward Name is `, JSON.stringify(globalRewardName));
})();


const adminKey = process.env.LNBITS_ADMINKEY as string;

interface CancellationToken {
  isCancellationRequested: boolean;
}

let userSetupFlag = false;

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
    SSOCommandMap.register('send zap', new SendZapCommand());
    SSOCommandMap.register('show my balance', new ShowMyBalanceCommand());
    SSOCommandMap.register('withdraw my zaps', new WithdrawFundsCommand());
    SSOCommandMap.register('show leaderboard', new ShowLeaderboardCommand());

    this.onMessage(async (context, next) => {
      console.log('Running onMessage ...');
      const botId = context.activity.recipient.id; // Bot's ID
      const senderId = context.activity.from.id; // Sender's ID

      // Check if the sender is the bot itself
      if (senderId === botId) {
        // Skip processing the bot's own messages
        await next();
        return;
      }

      try {
        let textMessage = context.activity.text || '';
        const mentions = TurnContext.getMentions(context.activity);
    
        // Check if the bot is mentioned
        const botMentioned = mentions.some(mention => mention.mentioned.id === botId);
    
        let failedRecipients: string[] = [];

        if (botMentioned) {
          // Remove the mention from the text
          mentions.forEach(mention => {
            if (mention.mentioned.id === botId) {
              textMessage = textMessage.replace(mention.text, '').trim();
            }
          });
        }
    
        if (
          context.activity.value &&
          context.activity.value.action === 'submitZaps'
        ) {
          const currentUser = context.turnState.get('user');
    
          let receiverIds = context.activity.value.zapReceiverId;
          if (typeof receiverIds === 'string' && receiverIds.indexOf(',') > -1) {
            receiverIds = receiverIds.split(',').map((id: string) => id.trim());
          } else if (typeof receiverIds === 'string') {
            receiverIds = [receiverIds];
          }
    
          const zapMessage = context.activity.value.zapMessage;
          const zapAmount = context.activity.value.zapAmount;
    
          if (!currentUser.allowanceWallet.id) {
            throw new Error('No sending wallet found.');
          }
    
          let successfulRecipients: string[] = [];
    
          for (const recId of receiverIds) {
            const receiver = await getUser(adminKey, recId);
    
            if (!receiver.privateWallet) {
              //throw new Error('Receiver wallet not found.');
              failedRecipients.push(receiver.displayName || `User ID: ${recId}`);
              continue;
            }
    
            await SendZap(
              currentUser,
              receiver,
              zapMessage,
              zapAmount,
              context,
              false,
              globalRewardName
            );
    
            successfulRecipients.push(receiver.displayName);
          }
          const bulletReceivers = successfulRecipients
            .map((name) => `- ${name}`)
            .join('\n');

            const bulletFailed = failedRecipients.length ? failedRecipients.map((name) => `- ${name}`).join('\n') : 'None';

          //fetch remainingBalance
          const remainingBalance = await getWalletBalance(currentUser.allowanceWallet.inkey);
          console.log('Remaining Balance:', remainingBalance);
          
          // Assuming zapAmount is the amount sent to each receiver
          const totalAmountSent = receiverIds.length * zapAmount;

          // Update adaptive card to read-only with list of recipients
          const updatedCard = {
            type: 'AdaptiveCard',
            body: [
              {
                type: 'TextBlock',
                text: `Zap sent!`,
                weight: 'Bolder',
                size: 'Large',
                color: 'Good',
              },
              {
                type: 'TextBlock',
                text: `**Successful Receivers:**\n${bulletReceivers}`,
                wrap: true
              },
              ...(failedRecipients.length > 0
                ? [
                    {
                      type: 'TextBlock',
                      text: `**Failed Receivers:**\n${bulletFailed}`,
                      wrap: true,
                      color: 'Attention',
                    },
                  ]
                : []),
              {
                type: 'TextBlock',
                text: `**Message:** ${zapMessage}`,
                wrap: true
              },
              {
                type: 'TextBlock',
                text: `**Amount (${globalRewardName}):** ${zapAmount}`,
                wrap: true
              },
              
              {
                type: 'TextBlock',
                text: `Total Amount (Sats): ${totalAmountSent}`,
                wrap: true,
                color: 'Good',
              },
              {
                type: 'TextBlock',
                text: `**Remaining Amount (${globalRewardName}):** ${remainingBalance}`,
                wrap: true,
                color: 'Good',
              },
            ],
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.2',
          };
    
          const updatedMessage = MessageFactory.attachment(CardFactory.adaptiveCard(updatedCard));
          updatedMessage.id = context.activity.replyToId;
          await context.updateActivity(updatedMessage); 
          await context.sendActivity(
            `Awesome! You sent ${context.activity.value.zapAmount} ${globalRewardName} to your colleague with a zap!`,
          );

        }
    
        // Trigger command by IM text
         if(textMessage){
        const command = SSOCommandMap.get(textMessage.toLowerCase());
        if (command) {
          await command.execute(context);
        } else {
            await context.sendActivity(
              "D'oh! I'm sorry, but I didn't recognize that command. But don't worry, I'm always getting better!",
            );
          }}
        } catch (error) {
          console.error('Error in onMessage handler:', error.message);
          await context.sendActivity(
            `${error.message}`,
          );
        }  

        await next();
        });

    //this.onMembersAdded(async (context, next) => {
    this.onCommand(async (context, next) => {
    ;
  })}

  async run(context: TurnContext) {
    try {
      await super.run(context);

      // Save any state changes. The load happened during the execution of the Dialog.
      await this.conversationState.saveChanges(context, false);
      await this.userState.saveChanges(context, false);
    } catch (error) {
      console.error('Error in run method:', error);
      await context.sendActivity(error);
    }
  }

  async handleTeamsSigninVerifyState(
    context: TurnContext,
    query: SigninStateVerificationQuery,
  ) {
    try {
      console.log(
        'Running dialog with signin/verifystate from an Invoke Activity.',
      );
      // Your logic here for handling signin verify state
    } catch (error) {
      console.error('Error in handleTeamsSigninVerifyState:', error);
    }
  }

  async handleTeamsSigninTokenExchange(
    context: TurnContext,
    query: SigninStateVerificationQuery,
  ) {
    try {
      // Your logic here for handling token exchange
    } catch (error) {
      console.error('Error in handleTeamsSigninTokenExchange:', error);
    }
  }

  async onSignInInvoke(context: TurnContext) {
    try {
      const userId = context.activity.from.id;
      const userName = context.activity.from.name;
      console.log(`User ID: ${userId}, User Name: ${userName}`);

      // Ensure the user has a wallet and get the wallet ID
      /*
      const wallet = await ensureMatchingUserWallet(
        userId,
        userName,
        'Sending',
      );

      if (wallet.id) {
        await context.sendActivity(`Wallet ID: ${wallet.id}`);
      } else {
        await context.sendActivity('Failed to ensure wallet.');
      }
      */
    } catch (error) {
      console.error('Error in onSignInInvoke:', error);
      await context.sendActivity('An error occurred during sign-in.');
    }
  }
}
