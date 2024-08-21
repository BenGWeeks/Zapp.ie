import { TurnContext, TeamsActivityHandler } from 'botbuilder';
import { SSOCommandMap } from './SSOCommandMap'; // Adjust the import path as necessary

export class TeamsBot extends SSOCommandMap {
  constructor() {
    super();
  }

  public async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    if (context.activity.type === 'message') {
      let txt = context.activity.text;
      // remove the mention of this bot
      const removedMentionText = TurnContext.removeRecipientMention(context.activity);
      if (removedMentionText) {
        // Remove the line break
        txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
      }

      // Check for specific commands and call corresponding functions
      if (txt.includes("send zaps")) {
        await this.sendZaps(context);
      } else if (txt.includes("show my balance")) {
        await this.showMyBalance(context);
      } else if (txt.includes("withdraw zaps")) {
        await this.withdrawZaps(context);
      }
    }

    // Ensure the next BotHandler is run
    await next();
  }

  private async sendZaps(context: TurnContext): Promise<void> {
    // Implementation for sending zaps
  }

  private async showMyBalance(context: TurnContext): Promise<void> {
    // Implementation for showing balance
  }

  private async withdrawZaps(context: TurnContext): Promise<void> {
    // Implementation for withdrawing zaps
  }
}