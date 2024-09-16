// userService.ts

/// <reference path="../../src/types/global.d.ts" />

import { TurnContext } from 'botbuilder';
import {
  getUsers,
  createUser,
  createWallet,
  updateUser,
} from './lnbitsService';

const adminKey = process.env.LNBITS_ADMINKEY as string;

export class UserService {
  private static instance: UserService;
  private users: Map<string, User> = new Map();

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getUser(context: TurnContext): Promise<User> {
    const userId = context.activity.from.id;
    if (this.users.has(userId)) {
      return this.users.get(userId)!;
    }

    let currentUser: User;

    // Fetch user details from LNBits
    const users: User[] = await getUsers(
      adminKey,
      //`{"aadObjectId":"${context.activity.from.aadObjectId}"}`,
      { aadObjectId: context.activity.from.aadObjectId },
    );

    if (users.length === 0) {
      console.log('User does not exist ... we need to create');
      console.log(context.activity.from);
      console.log(context.activity.channelData);
      console.log(context.activity.entities);
      // User does not exist, create the user
      const extra = {
        aadObjectId: context.activity.from.aadObjectId,
        profileImg:
          'https://hiberniaevros.sharepoint.com/_layouts/15/userphoto.aspx?AccountName=' +
          context.activity.from.properties?.email,
        privateWalletId: null,
        allowanceWalletId: null,
        userType: 'teammate',
      };

      currentUser = await createUser(
        adminKey,
        context.activity.from.name,
        //context.activity.from.properties?.email,
        'Private',
        'someone@somewhere.com', // TODO: Needs authentication from Mario.
        'password1',
        extra,
      );

      // Also create their allowance wallet
      const allowanceWallet = await createWallet(
        adminKey,
        currentUser.id,
        'Allowance',
      );

      currentUser = await updateUser(adminKey, currentUser.id, {
        allowanceWalletId: allowanceWallet.id,
        privateWalletId: currentUser.privateWallet.id,
      });
    } else {
      // User exists, get the first user from the array

      currentUser = users[0];

      // Check and create privateWallet if it doesn't exist
      console.log('currentUser.privateWallet', currentUser.privateWallet);
      console.log('currentUser.allowanceWallet', currentUser.allowanceWallet);
      console.log('currentUser.id', currentUser.id);

      let allowanceWallet = null;
      let privateWallet = null;

      if (!currentUser.privateWallet) {
        console.log('Creating private wallet for user:', currentUser.id);
        privateWallet = await createWallet(adminKey, currentUser.id, 'Private');
      }

      // Check and create allowanceWallet if it doesn't exist
      if (!currentUser.allowanceWallet) {
        console.log('Creating allowance wallet for user:', currentUser.id);
        allowanceWallet = await createWallet(
          adminKey,
          currentUser.id,
          'Allowance',
        );
      }

      console.log("Updating user's wallets ...");
      console.log('adminKey:', adminKey);
      console.log('currentUserr:', currentUser);
      console.log('currentUser.id:', currentUser.id);
      console.log('allowanceWallet:', allowanceWallet);
      console.log('privateWallet:', privateWallet);

      currentUser = await updateUser(adminKey, currentUser.id, {
        allowanceWalletId: allowanceWallet.id,
        privateWalletId: privateWallet.id,
      });
    }

    console.log('currentUser:', currentUser);

    return currentUser;
  }
}
