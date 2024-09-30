// userService.ts

/// <reference path="../../src/types/global.d.ts" />
import { currentUser,setCurrentUser } from '../globalstate';
import { ConsoleTranscriptLogger, TurnContext, TeamsInfo } from 'botbuilder';

import {
  getUsers,
  createUser,
  createWallet,
  updateUser,
  getUserWallets,
} from './lnbitsService';

const adminKey = process.env.LNBITS_ADMINKEY as string;

interface CancellationToken {
  isCancellationRequested: boolean;
}

function sanitizeString(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}



export class UserService {
  private static instance: UserService;
  private users: Map<string, User> = new Map(); // Simple in-memory cache
  
  private constructor() {}



  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getUser(context: TurnContext): Promise<User> {
        const userId = context.activity.from.id;

    // Check if the user is already in memory (in-session)
    if (this.users.has(userId)) {
      return this.users.get(userId)!;
    }

    // Otherwise, create or fetch the user from the external service
    let currentUser: User;
    const userProfile = await this.getUserProfile(context, context.turnState.get('cancellationToken'));
    console.log('User profile:', userProfile);

    // Fetch user details from LNBits (assuming LNBits is an external service)
    const users: User[] = await getUsers(adminKey, {
      aadObjectId: userProfile.aadObjectId,
    });

    if (users.length < 1) {
      console.log('User does not exist ... creating a new one');
      const extra = {
        aadObjectId: userProfile.aadObjectId,
        profileImg:
          'https://hiberniaevros.sharepoint.com/_layouts/15/userphoto.aspx?AccountName=' +
          userProfile.userPrincipalName,
        privateWalletId: "",
        allowanceWalletId: "",
        userType: 'teammate',
      };
      const sanitizedDisplayName = sanitizeString(context.activity.from.name);
      currentUser = await createUser(
        adminKey,
        sanitizedDisplayName,
        'Private',
        userProfile.email, 
        'password1',
        extra,
      );

      // Create their allowance wallet
      const allowanceWallet = await createWallet(
        adminKey,
        currentUser.id,
        'Allowance',
      );
      currentUser = await updateUser(adminKey, currentUser.id, {
        allowanceWalletId: allowanceWallet.id,
        privateWalletId: currentUser.privateWallet?.id,
      });
    } else {
      currentUser = users[0];
    }

    // Store the user in memory to avoid fetching again during the session
    this.users.set(userId, currentUser);

    return currentUser;
  }
  public async getUserProfile(
    context: TurnContext,
    cancellationToken: CancellationToken,
  ): Promise<any> {
    const member = await TeamsInfo.getMember(context, context.activity.from.id);
    return member;
  }
}
