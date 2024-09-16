// lnbitsService.ts

/// <reference path="../../src/types/global.d.ts" />

import dotenvFlow from 'dotenv-flow';

dotenvFlow.config({ path: './env' });
let globalWalletId: string | null = null;

//import dotenv from 'dotenv';
//dotenv.config();

const lnbiturl = process.env.LNBITS_NODE_URL as string;
const userName = process.env.LNBITS_USERNAME as string;
const password = process.env.LNBITS_PASSWORD as string;
//const adminkey = process.env.LNBITS_ADMINKEY as string; // This changes per wallet!

// LNBits API is documented here:
// https://demo.lnbits.com/docs/

export async function getAccessToken(
  username: string,
  password: string,
): Promise<string> {
  const response = await fetch(`${lnbiturl}/api/v1/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`Error creating access token (status: ${response.status})`);
  }

  const data = await response.json();
  return data.access_token;
}

const getWallets = async (
  adminKey: string,
  filterByName?: string,
  filterById?: string,
): Promise<Wallet[] | null> => {
  console.log(
    `getWallets starting ... (adminKey: ${adminKey}, filterByName: ${filterByName}, filterById: ${filterById}))`,
  );

  try {
    //const accessToken = await getAccessToken(`${userName}`, `${password}`);
    const response = await fetch(`${lnbiturl}/usermanager/api/v1/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        //Authorization: `Bearer ${accessToken}`,
        'X-Api-Key': adminKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error getting wallets response (status: ${response.status})`,
      );
    }

    const data: Wallet[] = await response.json();

    // If filter is provided, filter the wallets by name and/or id
    let filteredData = data;
    if (filterByName) {
      filteredData = filteredData.filter(wallet =>
        wallet.name.includes(filterByName),
      );
    }
    if (filterById) {
      filteredData = filteredData.filter(wallet => wallet.id === filterById);
    }

    // Map the wallets to match the Wallet interface
    const walletData: Wallet[] = await Promise.all(
      data.map(async (filteredData: any) => ({
        id: filteredData.id,
        admin: filteredData.admin,
        name: filteredData.name,
        adminkey: filteredData.adminkey,
        user: filteredData.user,
        inkey: filteredData.inkey,
        balance_msat: (
          await getWalletById(filteredData.user, filteredData.id)
        )?.balance_msat,
      })),
    );

    return walletData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getUserWallets = async (
  adminKey: string,
  userId: string,
): Promise<Wallet[] | null> => {
  console.log(
    `getUserWallets starting ... (adminKey: ${adminKey}, userId: ${userId})`,
  );

  try {
    const accessToken = await getAccessToken(`${userName}`, `${password}`);
    const response = await fetch(
      `${lnbiturl}/users/api/v1/user/${userId}/wallet`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          //'X-Api-Key': adminKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error getting users wallets response (status: ${response.status})`,
      );
    }

    const data: Wallet[] = await response.json();

    // Map the wallets to match the Wallet interface
    const walletData: Wallet[] = data.map((wallet: any) => ({
      id: wallet.id,
      admin: wallet.admin, // TODO: To be implemented. Ref: https://t.me/lnbits/90188
      name: wallet.name,
      adminkey: wallet.adminkey,
      user: wallet.user,
      inkey: wallet.inkey,
      balance_msat: wallet.balance_msat, // TODO: To be implemented. Ref: https://t.me/lnbits/90188
    }));

    return walletData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getUsers = async (
  adminKey: string,
  filterByExtra: { [key: string]: string }, // Pass the extra field as an object
): Promise<User[] | null> => {
  console.log(
    `getUsers starting ... (adminKey: ${adminKey}, filterByExtra: ${JSON.stringify(
      filterByExtra,
    )})`,
  );

  try {
    // URL encode the extra filter
    //const encodedExtra = encodeURIComponent(JSON.stringify(filterByExtra));
    const encodedExtra = JSON.stringify(filterByExtra);
    console.log('encodedExtra:', encodedExtra);

    const response = await fetch(
      `${lnbiturl}/usermanager/api/v1/users?extra=${encodedExtra}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': adminKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error getting users response (status: ${response.status})`,
      );
    }

    const data = await response.json();

    // Map the users to match the User interface
    const usersData: User[] = await Promise.all(
      data.map(async (user: any) => {
        let privateWallet = await getWalletById(
          adminKey,
          user.extra?.privateWalletId,
        );

        let allowanceWallet = await getWalletById(
          adminKey,
          user.extra?.allowanceWalletId,
        );

        return {
          id: user.id,
          displayName: user.name,
          aadObjectId: user.extra?.aadObjectId || null,
          email: user.email,
          privateWallet: privateWallet,
          allowanceWallet: allowanceWallet,
        };
      }),
    );

    console.log('getUsers usersData:', usersData);

    return usersData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createUser = async (
  adminKey: string,
  userName: string,
  walletName: string,
  email: string,
  password: string,
  extra: { [key: string]: string }, // Ensure extra is an object, not a string
): Promise<User | null> => {
  console.log(
    `createUser starting ... (adminKey: ${adminKey}, userName: ${userName}, email: ${email}, password: ${password}, extra: ${JSON.stringify(
      extra,
    )}))`,
  );

  try {
    // Prepare the request body
    const requestBody = {
      user_name: userName,
      wallet_name: walletName,
      email: email || '',
      password: password || '',
      extra: extra,
    };

    console.log(JSON.stringify(requestBody));

    const response = await fetch(`${lnbiturl}/usermanager/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': adminKey,
      },
      body: JSON.stringify(requestBody), // Stringify the request body
    });

    if (!response.ok) {
      throw new Error(
        `Error getting create user response (status: ${response.status})`,
      );
    }

    const user = await response.json();

    // Await the wallet promises
    const privateWallet = await getWalletById(
      user.id,
      user.extra?.privateWalletId,
    );
    const allowanceWallet = await getWalletById(
      user.id,
      user.extra?.allowanceWalletId,
    );

    // Map the user to match the User interface
    const userData: User = {
      id: user.id,
      displayName: user.name,
      profileImg:
        'https://hiberniaevros.sharepoint.com/_layouts/15/userphoto.aspx?AccountName=' +
        user.email, // TODO: Remove hardecoded URL
      aadObjectId: user.extra?.aadObjectId || null,
      email: user.email,
      privateWallet: privateWallet,
      allowanceWallet: allowanceWallet,
    };

    console.log('userData:', userData);

    return userData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getUser = async (
  adminKey: string,
  userId: string,
): Promise<User | null> => {
  console.log(
    `createUser starting ... (adminKey: ${adminKey}, userName: ${userName})`,
  );

  try {
    const response = await fetch(
      `${lnbiturl}/usermanager/api/v1/users/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': adminKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error getting user response (status: ${response.status})`,
      );
    }

    const user = await response.json();

    // Await the wallet promises
    const privateWallet = await getWalletById(
      user.id,
      user.extra?.privateWalletId,
    );
    const allowanceWallet = await getWalletById(
      user.id,
      user.extra?.allowanceWalletId,
    );

    // Map the user to match the User interface
    const userData: User = {
      id: user.id,
      displayName: user.name,
      profileImg: user.profileImg,
      aadObjectId: user.extra?.aadObjectId || null,
      email: user.email,
      privateWallet: privateWallet,
      allowanceWallet: allowanceWallet,
    };

    console.log('userData:', userData);

    return userData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const updateUser = async (
  adminKey: string,
  userId: string,
  extra: { [key: string]: string }, // Ensure extra is an object, not a string
): Promise<User | null> => {
  console.log(
    `updateUser starting ... (adminKey: ${adminKey}, userId: ${userName}, extra: ${extra}))`,
  );

  try {
    // Prepare the request body
    const requestBody = {
      extra: extra,
    };

    //const accessToken = await getAccessToken(`${userName}`, `${password}`);
    const response = await fetch(
      `${lnbiturl}/usermanager/api/v1/users/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${accessToken}`,
          'X-Api-Key': adminKey,
        },
        body: JSON.stringify(requestBody), // Stringify the request body
      },
    );

    if (!response.ok) {
      throw new Error(`Error getting response (status: ${response.status})`);
    }

    const data = await response.json();

    // Await the wallet promises
    const privateWallet = await getWalletById(
      adminKey,
      data.extra?.privateWalletId,
    );
    const allowanceWallet = await getWalletById(
      adminKey,
      data.extra?.allowanceWalletId,
    );

    // Map the user to match the User interface
    const userData: User = {
      id: data.id,
      displayName: data.name,
      profileImg: data.profileImg,
      aadObjectId: data.extra?.aadObjectId || null,
      email: data.email,
      privateWallet: privateWallet,
      allowanceWallet: allowanceWallet,
    };

    console.log('updateUser usersData:', userData);

    return userData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createWallet = async (
  adminKey: string,
  userId: string,
  walletName: string,
): Promise<Wallet | null> => {
  console.log(
    `createWallet starting ... (adminKey: ${adminKey}, userId: ${userId}, walletName: ${walletName}))`,
  );

  try {
    // Prepare the request body
    const requestBody = {
      user_id: userId,
      wallet_name: walletName,
    };

    //const accessToken = await getAccessToken(`${userName}`, `${password}`);
    const response = await fetch(`${lnbiturl}/usermanager/api/v1/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //Authorization: `Bearer ${accessToken}`,
        'X-Api-Key': adminKey,
      },
      body: JSON.stringify(requestBody), // Stringify the request body
    });

    if (!response.ok) {
      throw new Error(`Error getting response (status: ${response.status})`);
    }

    const data = await response.json();

    // Await the wallet promises
    const walletWithBalance = await getWalletById(data.user, data.id);

    // Map the wallet to match the Wallet interface
    const walletData: Wallet = {
      id: data.id,
      admin: data.admin,
      name: data.name,
      adminkey: data.adminkey,
      user: data.user,
      inkey: data.inkey,
      balance_msat: walletWithBalance?.balance_msat,
    };

    console.log('createWallet data:', walletData);

    return walletData;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getWalletDetails = async (inKey: string, walletId: string) => {
  console.log(
    `getWalletDetails starting ... (inKey: ${inKey}, walletId: ${walletId}))`,
  );
  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallets/${walletId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error getting wallet details (status: ${response.status})`,
      );
    }

    const data = await response.json();
    console.log('Wallet details:', data);

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getWalletBalance = async (inKey: string) => {
  console.log(`getWalletBalance starting ... (inKey: ${inKey})`);
  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallet`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error getting wallet balance (status: ${response.status})`,
      );
    }

    const data = await response.json();

    console.log('Balance:', data.balance / 1000); // Convert to Sats

    return data.balance / 1000; // return in Sats (not millisatoshis)
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getWalletName = async (inKey: string) => {
  console.log(`getWalletName starting ... (inKey: ${inKey})`);

  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallet`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting wallet name (status: ${response.status})`);
    }

    const data = await response.json();

    return data.name;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getPayments = async (inKey: string) => {
  console.log(`getPayments starting ... (inKey: ${inKey})`);

  try {
    const response = await fetch(`${lnbiturl}/api/v1/payments?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting payments (status: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getWalletPayLinks = async (inKey: string, walletId: string) => {
  console.log(
    `getWalletPayLinks starting ... (inKey: ${inKey}, walletId: ${walletId})`,
  );

  try {
    const response = await fetch(
      `${lnbiturl}/lnurlp/api/v1/links?all_wallets=false&wallet=${walletId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': inKey,
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Error getting paylinks for wallet (status: ${response.status})`,
      );
      return null;
    }

    const data = await response.json();

    //console.log('Paylinks:', data);

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// May need fixing!
const getWalletById = async (
  userId: string,
  id: string,
): Promise<Wallet | null> => {
  console.log(`getWalletById starting ... (userId: ${userId}, id: ${id})`);

  try {
    const accessToken = await getAccessToken(`${userName}`, `${password}`);
    const response = await fetch(
      `${lnbiturl}/users/api/v1/user/${userId}/wallet`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          //'X-Api-Key': adminKey,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Error getting wallet by ID response (status: ${response.status})`,
      );

      return null;
    }

    const data = await response.json();

    // Find the wallet with a matching inkey
    const filterWallets = data.find((wallet: any) => wallet.id === id);

    // Map the filterWallets to match the Wallets interface
    const walletsData: Wallet[] = data.map((filterWallets: any) => ({
      id: filterWallets.id,
      admin: filterWallets.admin, // TODO: Coming back as undefined.
      name: filterWallets.name,
      user: filterWallets.user,
      adminkey: filterWallets.adminkey,
      inkey: filterWallets.inkey,
      balance_msat: filterWallets.balance_msat,
    }));

    return walletsData[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};

// May need fixing!
const getWalletIdFromKey = async (inKey: string) => {
  console.log(`getWalletIdFromKey starting ... (inKey: ${inKey})`);

  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      console.error(
        `Error getting wallet ID from Key response (status: ${response.status})`,
      );

      return null;
    }

    const data = await response.json();

    // Find the wallet with a matching inkey
    const wallet = data.find((wallet: any) => wallet.inkey === inKey);

    if (!wallet) {
      console.error('No wallet found for this inKey.');
      return null;
    }

    // Return the id of the wallet
    return wallet.id;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getInvoicePayment = async (inKey: string, invoice: string) => {
  console.log('getInvoicePayment: Starting ...');
  try {
    const response = await fetch(`${lnbiturl}/api/v1/payments/${invoice}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error getting invoice payment (status: ${response.status})`,
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getPaymentsSince = async (lnKey: string, timestamp: number) => {
  console.log(
    `getPaymentsSince starting ... (lnKey: ${lnKey}, timestamp: ${timestamp})`,
  );

  // Note that the timestamp is in seconds, not milliseconds.
  try {
    // Get walletId using the provided apiKey
    const walletId = await getWalletIdFromKey(lnKey);

    const response = await fetch(
      `${lnbiturl}/api/v1/payments?wallet=${walletId}&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': lnKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error getting payments since ${timestamp} (status: ${response.status})`,
      );
    }

    const data = await response.json();

    // Filter the payments to only include those since the provided timestamp
    const paymentsSince = data.filter(
      (payment: { time: number }) => payment.time >= timestamp,
    );

    console.log(
      `getPaymentsSince count is ${paymentsSince.length} since ${timestamp}`,
    );

    return paymentsSince;
  } catch (error) {
    console.error(error);
    return error;
  }
};

// TODO: This method needs checking!
const createInvoice = async (
  lnKey: string,
  recipientWalletId: string,
  amount: number,
  memo: string,
  extra: object,
) => {
  console.log(
    `createInvoice starting ... (lnKey: ${lnKey}, recipientWalletId: ${recipientWalletId}, amount: ${amount}, memo: ${memo}, extra: ${extra})`,
  );

  try {
    const response = await fetch(`${lnbiturl}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': lnKey,
      },
      body: JSON.stringify({
        out: false,
        amount: amount,
        memo: memo,
        extra: extra,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating an invoice (status: ${response.status})`);
    }

    const data = await response.json();
    //console.log('createInvoice: data:', data);

    return data.payment_request;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const payInvoice = async (adminKey: string, paymentRequest: string) => {
  console.log(
    `payInvoice starting ... (adminKey: ${adminKey}, paymentRequest: ${paymentRequest})`,
  );

  try {
    const response = await fetch(`${lnbiturl}/api/v1/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': adminKey,
      },
      body: JSON.stringify({
        out: true,
        bolt11: paymentRequest,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error paying invoice (status: ${response.status})`);
    }

    const data = await response.json();
    //console.log('payInvoice: data:', data);

    return data;
  } catch (error) {
    return error;
  }
};

// TODO: This method needs checking!
const getWalletIdByUserId = async (adminKey: string, userId: string) => {
  console.log(
    `getWalletIdByUserId starting ... (adminKey: ${adminKey}, userId: ${userId})`,
  );

  try {
    const response = await fetch(
      `${lnbiturl}/api/v1/wallets?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': adminKey,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Error getting wallet ID from the user ID (status: ${response.status})`,
      );
    }

    const data = await response.json();
    console.log('getWalletIdByUserId: data:', data);

    return data.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  getWallets,
  createUser,
  getUser,
  updateUser,
  getUsers,
  getWalletName,
  getWalletById,
  getWalletBalance,
  getPayments,
  getWalletDetails,
  getWalletPayLinks,
  getUserWallets,
  getInvoicePayment,
  getPaymentsSince,
  createInvoice,
  createWallet,
  payInvoice,
  getWalletIdByUserId,
};
