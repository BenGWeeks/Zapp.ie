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
  filterByName?: string,
  filterById?: string,
): Promise<Wallet[] | null> => {
  console.log(
    `getWallets starting ... (filterByName: ${filterByName}, filterById: ${filterById}))`,
  );

  try {
    const accessToken = await getAccessToken(`${userName}`, `${password}`);
    const response = await fetch(`${lnbiturl}/api/v1/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        //'X-Api-Key': apiKey,
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

    return filteredData;
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
const getWalletId = async (inKey: string) => {
  console.log(`getWalletId starting ... (inKey: ${inKey})`);

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
        `Error getting wallet ID response (status: ${response.status})`,
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
        'Content-Type': 'application/json'
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
    const walletId = await getWalletId(lnKey);

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

const checkWalletExists = async (
  //apiKey: string,
  walletName: string,
): Promise<Wallet | null> => {
  console.log(`checkWalletExists starting ... (walletName: ${walletName},)`);

  const wallets = await getWallets(walletName);
  let wallet = null;
  if (wallets) {
    wallet = wallets.find((wallet: any) => wallet.name === walletName);
  }
  console.log('checkWalletExists: wallet:', wallet);
  return wallet;
};

// TODO: This method needs checking!
const createWallet = async (
  apiKey: string,
  objectID: string,
  displayName: string,
) => {
  console.log(
    `createWallet starting ... (apiKey: ${apiKey}, objectID: ${objectID}, displayName: ${displayName})`,
  );
  
  try {
    const url = `${lnbiturl}/api/v1/wallet`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${displayName}- ${objectID} - Receiving`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating wallet (${response.statusText})`);
    }

    const data = await response.json();
    //console.log('createWallet: data:', data);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function ensureMatchingUserWallet(
  aadObjectId: string,
  displayName: string,
  walletType: WalletType,
): Promise<Wallet | null> {
  console.log(
    `ensureMatchingUserWallet starting ... (aadObjectId: ${aadObjectId}, objectID: ${displayName}, walletType: ${walletType})`,
  );

  try {
    //const apiKey = await getAccessToken(userName, password); // Assuming getAccessToken returns the API key

    let walletName = null;
    if (walletType == 'Sending') {
      walletName = `${displayName} - ${aadObjectId} - Sending`;
    } else {
      walletName = `${displayName} - ${aadObjectId} - Receiving`;
    }

    // Check if the Receiving wallet exists
    const wallet = await checkWalletExists(walletName);

    return wallet;
  } catch (error) {
    console.error(`Error ensuring user wallets (${error})`);
    throw error;
  }
}

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
  getWalletName,
  getWalletId,
  getWalletBalance,
  getPayments,
  getWalletDetails,
  getWalletPayLinks,
  getInvoicePayment,
  getPaymentsSince,
  createInvoice,
  createWallet,
  checkWalletExists,
  ensureMatchingUserWallet,
  payInvoice,
  getWalletIdByUserId,
};
