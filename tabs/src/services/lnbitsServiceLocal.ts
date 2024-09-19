// lnbitsService.ts

// LNBits API is documented here:
// https://demo.lnbits.com/docs/

const userName = process.env.REACT_APP_LNBITS_USERNAME;
const password = process.env.REACT_APP_LNBITS_PASSWORD;
const nodeUrl = process.env.REACT_APP_LNBITS_NODE_URL;

// Store token in localStorage (persists between page reloads)
let accessToken = localStorage.getItem('accessToken');

export async function getAccessToken(username: string, password: string) {
  console.log(
    `getAccessToken starting ... (username: ${username}, filterById: ${password}))`,
  );
  if (accessToken) {
    console.log('Using cached access token');
    return accessToken;
  } else {
    console.log('No cached access token found');
  }

  try {
    const response = await fetch(`${nodeUrl}/api/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      //credentials: 'omit', // No cookies sent or accepted
    });

    console.log('Request URL:', response.url);
    console.log('Request Status:', response.status);
    console.log('Request Headers:', response.headers);

    if (!response.ok) {
      throw new Error(
        `Error creating access token (status: ${response.status}): ${response.statusText}`,
      );
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not in JSON format');
    }

    // Parse the response as JSON
    const data = await response.json();

    // Check if the expected data is available
    if (!data || !data.access_token) {
      throw new Error('Access token is missing in the response');
    }

    // Store the access token in memory (string type)
    accessToken = data.access_token;
    console.log('Access token fetched and stored');

    return accessToken;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in getAccessToken:', error.message);
    } else {
      console.error('Unexpected error in getAccessToken:', error);
    }
    throw error; // Re-throw the error to handle it elsewhere
  }
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
    const response = await fetch(`/api/v1/wallets`, {
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

    const data: Wallet[] = (await response.json()) as Wallet[];

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
    throw error;
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
    const response = await fetch(`/users/api/v1/user/${userId}/wallet`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        //'X-Api-Key': adminKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error getting users wallets response (status: ${response.status})`,
      );
    }

    const data: Wallet[] = await response.json();

    // Map the wallets to match the Wallet interface
    let walletData: Wallet[] = data.map((wallet: any) => ({
      id: wallet.id,
      admin: wallet.admin || '', // TODO: To be implemented. Ref: https://t.me/lnbits/90188
      name: wallet.name,
      adminkey: wallet.adminkey,
      user: wallet.user,
      inkey: wallet.inkey,
      balance_msat: wallet.balance_msat, // TODO: To be implemented. Ref: https://t.me/lnbits/90188
      deleted: wallet.deleted,
    }));

    // Now remove the deleted wallets.
    const filteredWallets = walletData.filter(
      wallet => wallet.deleted !== true,
    );

    return filteredWallets;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUsers = async (
  adminKey: string,
  filterByExtra: { [key: string]: string } | null, // Pass the extra field as an object
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
      `/usermanager/api/v1/users?extra=${encodedExtra}`,
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

    console.log('getUsers data:', data);

    // Map the users to match the User interface
    const usersData: User[] = await Promise.all(
      data.map(async (user: any) => {
        const extra = user.extra || {}; // Provide a default empty object if user.extra is null

        let privateWallet = null;
        let allowanceWallet = null;

        if (user.extra) {
          privateWallet = await getWalletById(user.id, extra.privateWalletId);
          allowanceWallet = await getWalletById(
            user.id,
            extra.allowanceWalletId,
          );
        }

        return {
          id: user.id,
          displayName: user.name,
          aadObjectId: extra.aadObjectId || null,
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
    throw error;
  }
};

const getWalletDetails = async (inKey: string, walletId: string) => {
  console.log(
    `getWalletDetails starting ... (inKey: ${inKey}, walletId: ${walletId}))`,
  );

  try {
    const response = await fetch(`/api/v1/wallets/${walletId}`, {
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

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getWalletBalance = async (inKey: string) => {
  console.log(`getWalletBalance starting ... (inKey: ${inKey})`);

  try {
    const response = await fetch(`/api/v1/wallet`, {
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

    return data.balance / 1000; // return in Sats (not millisatoshis)
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getWalletName = async (inKey: string) => {
  console.log(`getWalletName starting ... (inKey: ${inKey})`);

  try {
    const response = await fetch(`/api/v1/wallet`, {
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
    throw error;
  }
};

const getPayments = async (inKey: string) => {
  console.log(`getPayments starting ... (inKey: ${inKey})`);

  try {
    const response = await fetch(`/api/v1/payments?limit=100`, {
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
      `/lnurlp/api/v1/links?all_wallets=false&wallet=${walletId}`,
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

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getWalletById = async (
  userId: string,
  id: string,
): Promise<Wallet | null> => {
  console.log(`getWalletById starting ... (userId: ${userId}, id: ${id})`);

  try {
    const accessToken = await getAccessToken(`${userName}`, `${password}`);

    const response = await fetch(`/users/api/v1/user/${userId}/wallet`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        //'X-Api-Key': adminKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Error getting wallet by ID (status: ${response.status}): ${response.statusText}`,
      );

      return null;
    }

    // Check if response has content and is in JSON format
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not in JSON format');
    }

    const data = await response.json();

    // Find the wallet with a matching inkey that are not deleted.
    const filteredWallets = data.filter(
      (wallet: any) => wallet.deleted !== true,
    );
    const matchingWallet = filteredWallets.find(
      (wallet: any) => wallet.id === id,
    );
    //console.log('matchingWallet: ', matchingWallet);

    if (!matchingWallet) {
      console.error(`Wallet with ID ${id} not found.`);
      return null;
    }

    // Map the filterWallets to match the Wallets interface
    const walletData: Wallet = {
      id: matchingWallet.id,
      admin: matchingWallet.admin ?? null, // TODO: Coming back as undefined.
      name: matchingWallet.name,
      user: matchingWallet.user,
      adminkey: matchingWallet.adminkey,
      inkey: matchingWallet.inkey,
      balance_msat: matchingWallet.balance_msat,
      deleted: matchingWallet.deleted,
    };

    return walletData;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in getWalletById:', error.message);
    } else {
      console.error('Unexpected error in getWalletById:', error);
    }
    throw error;
  }
};

// May need fixing!
const getWalletId = async (inKey: string) => {
  console.log(`getWalletId starting ... (inKey: ${inKey})`);

  try {
    const response = await fetch(`/api/v1/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      console.error(`Error getting wallet ID (status: ${response.status})`);
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
    throw error;
  }
};

const getInvoicePayment = async (lnKey: string, invoice: string) => {
  console.log(
    `getInvoicePayment starting ... (inKey: ${lnKey}, invoice: ${invoice})`,
  );

  try {
    const response = await fetch(`/api/v1/payments/${invoice}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': lnKey,
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
    throw error;
  }
};

const getWalletZapsSince = async (
  inKey: string,
  timestamp: number,
): Promise<Zap[]> => {
  console.log(
    `getWalletZapsSince starting ... (lnKey: ${inKey}, timestamp: ${timestamp})`,
  );

  // Note that the timestamp is in seconds, not milliseconds.
  try {
    // Get walletId using the provided apiKey
    //const walletId = await getWalletId(lnKey);

    const response = await fetch(`/api/v1/payments?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': inKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error getting payments since ${timestamp} (status: ${response.status})`,
      );
    }

    const data = await response.json();

    // Filter the payments to only include those since the provided timestamp
    const paymentsSince = data.filter(
      (payment: { time: number }) => payment.time > timestamp,
    );

    // Map the payments to match the Zap interface
    const zapsData: Zap[] = paymentsSince.map((payment: any) => ({
      id: payment.id || payment.checking_id,
      bolt11: payment.bolt11,
      from: payment.extra?.from?.id || null,
      to: payment.extra?.to?.id || null,
      memo: payment.memo,
      amount: payment.amount,
      wallet_id: payment.wallet_id,
      time: payment.time,
      extra: payment.extra,
    }));

    console.log('Zaps:', zapsData);

    return zapsData;
  } catch (error) {
    console.error(error);
    throw error;
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
    const response = await fetch(`/api/v1/payments`, {
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

    return data.payment_request;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const payInvoice = async (adminKey: string, paymentRequest: string) => {
  console.log(
    `payInvoice starting ... (adminKey: ${adminKey}, paymentRequest: ${paymentRequest})`,
  );

  try {
    const response = await fetch(`/api/v1/payments`, {
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

    return data;
  } catch (error) {
    throw error;
  }
};

const createWallet = async (
  apiKey: string,
  objectID: string,
  displayName: string,
) => {
  console.log(
    `createWallet starting ... (apiKey: ${apiKey}, objectID: ${objectID}, displayName: ${displayName})`,
  );

  try {
    const url = `/api/v1/wallet`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${displayName}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating wallet (${response.statusText})`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// TODO: This method needs checking!
const getWalletIdByUserId = async (adminKey: string, userId: string) => {
  console.log(
    `getWalletIdByUserId starting ... (adminKey: ${adminKey}, userId: ${userId})`,
  );

  try {
    const response = await fetch(`/api/v1/wallets?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': adminKey,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error getting wallet ID from the user ID (status: ${response.status})`,
      );
    }

    const data = await response.json();

    return data.id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getNostrRewards = async (adminKey: string, stallId: string): Promise<NostrZapRewards[]> => {
  console.log('Getting products ...');
  try {
    const response = await fetch(`/nostrmarket/api/v1/stall/product/${stallId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': adminKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Error getting products (status: ${response.status})`);
    }

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (contentType && contentType.includes('application/json')) {
      const data: NostrZapRewards[] = await response.json();
      console.log('Products:', data);
      return data;
    } else {
      const text = await response.text(); // Capture non-JSON responses
      console.log('Non-JSON response:', text);
      throw new Error(`Expected JSON, but got: ${text}`);
    }
  } catch (error) {
    console.error('Error fetching rewards:', error);
    throw error;
  }
};

export {
  getUsers,
  getWallets,
  getWalletName,
  getWalletId,
  getWalletBalance,
  getPayments,
  getWalletDetails,
  getWalletPayLinks,
  getInvoicePayment,
  getWalletZapsSince,
  createInvoice,
  createWallet,
  payInvoice,
  getWalletIdByUserId,
  getUserWallets,
  getNostrRewards,
};
