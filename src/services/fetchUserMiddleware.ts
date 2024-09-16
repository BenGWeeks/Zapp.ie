import { Middleware, TurnContext } from 'botbuilder';
import { UserService } from './userService';

export class FetchUserMiddleware implements Middleware {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  async onTurn(context: TurnContext, next: () => Promise<void>): Promise<void> {
    console.log('FetchUserMiddleware: onTurn called'); // Logging

    if (
      context.activity.type === 'message' ||
      context.activity.type === 'conversationUpdate'
    ) {
      const user = await this.userService.getUser(context);
      context.turnState.set('user', user);
    }

    // Continue with the next middleware or bot logic
    await next();
  }
}
