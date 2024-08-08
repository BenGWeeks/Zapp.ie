// lnbitsService.ts
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config({ path: './env' });
let globalWalletId: string | null = null;

const lnbiturl: string = process.env.LNBITS_NODE_URL as string;
const userName = process.env.LNBITS_USERNAME as string;
const password = process.env.LNBITS_PASSWORD as string;
const adminkey = process.env.LNBITS_ADMINKEY as string;

export async function getAccessToken(username: string, password: string): Promise<string> {
  const response = await fetch(`${lnbiturl}/api/v1/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}


const getWallets = async () => {
  try {
    const accessToken = await getAccessToken(`${userName}`, `${password}`);
    const response = await fetch(`${lnbiturl}/api/v1/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        //'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getWalletDetails = async (apiKey: string, walletId: string) => {
  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallets/${walletId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getWalletBalance = async (apiKey: string) => {
  console.log("Getting balance ...");
  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallet`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.balance / 1000;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getWalletName = async (apiKey: string) => {
  console.log("Getting name ...");
  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallet`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.name;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getPayments = async (apiKey: string) => {
  console.log("Getting balance ...");
  try {
    const response = await fetch(`${lnbiturl}/api/v1/payments?limit=100`, 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

const getWalletPayLinks = async (invoiceKey: string, walletId: string) => {
  try {
    const response = await fetch(`${lnbiturl}/lnurlp/api/v1/links?all_wallets=false&wallet=${walletId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': invoiceKey,
      },
    });

    if (!response.ok) {
      console.error(`getWalletPayLinks Error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('getWalletPayLinks Error:', error);
    return null;
  }
};

const getWalletId = async (apiKey: string) => {
  console.log("getWalletId: Starting ...");
  try {
    const response = await fetch(`${lnbiturl}/api/v1/wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`getWalletId error: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Find the wallet with a matching inkey
    const wallet = data.find((wallet: any) => wallet.inkey === apiKey);

    if (!wallet) {
      console.error('getWalletId: No wallet found for this apiKey');
      return null;
    }

    // Return the id of the wallet
    return wallet.id;
  } catch (error) {
    console.error('getWalletId error:', error);
    return null;
  }
};

const getInvoicePayment = async (apiKey: string, invoice: string) => {
  console.log("getInvoicePayment: Starting ...");
  try {
    const response = await fetch(`${lnbiturl}/api/v1/payments/${invoice}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`getInvoicePayment error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('getInvoicePayment error:', error);
    return false;
  }
};

const getPaymentsSince = async (apiKey: string, timestamp: number) => {
  console.log("getPaymentsSince: Starting ...");
  // Note that the timestamp is in seconds, not milliseconds.
  try {
    // Get walletId using the provided apiKey
    const walletId = await getWalletId(apiKey);

    const response = await fetch(`${lnbiturl}/api/v1/payments?wallet=${walletId}&limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`getPaymentsSince error: ${response.status}`);
    }

    const data = await response.json();

    // Filter the payments to only include those since the provided timestamp
    const paymentsSince = data.filter((payment: { time: number }) => payment.time >= timestamp);

    console.log(`getPaymentsSince count is ${paymentsSince.length} since ${timestamp}`);

    return paymentsSince;
  } catch (error) {
    console.error('getPaymentsSince error:', error);
    return [];
  }
};

const createInvoice = async (apiKey: string) => {
  console.log("createInvoice: Starting ...");
  try {
    // Get the pay links for the wallet
    // Get walletId using the provided apiKey
    const walletId = await getWalletId(apiKey);

    if (!walletId) {
      console.error('createInvoice: No wallet found for this apiKey');
      return null;
    }

    const payLinks = await getWalletPayLinks(apiKey, walletId);

    // Check if there are any pay links
    if (!payLinks || payLinks.length === 0) {
      console.error('createInvoice: No pay links found for this wallet');
      return null;
    }

    // Use the id of the first pay link for that wallet
    const payLinkId = payLinks[0].id;

    const response = await fetch(`${lnbiturl}/lnurlp/api/v1/links/${payLinkId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
    });

    if (!response.ok) {
      console.error(`createInvoice error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.lnurl;
  } catch (error) {
    console.error('createInvoice error:', error);
    return null;
  }
};

const checkWalletExists = async (apiKey: string, walletName: string) => {
  const wallets = await getWallets();
  if (wallets) {
    const wallet = wallets.find((wallet: any) => wallet.name === walletName);
    return wallet ? wallet.id : null;
  }
  return null;
};

const createWallet = async (apiKey: string, objectID: string, displayName: string) => {
  console.log("createWallet: Starting ...");
  try {
    const url = `${lnbiturl}/api/v1/wallet`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${objectID} - ${displayName}`
      }),
    });

    if (!response.ok) {
      throw new Error(`Error creating wallet: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
};

async function ensureUserWallet(objectID: string, displayName: string): Promise<string | null> {
  try {
    const apiKey = await getAccessToken(userName, password); // Assuming getAccessToken returns the API key
    const walletName = `${objectID} - ${displayName}`;
    const walletId = await checkWalletExists(apiKey, walletName);


    if (walletId) {
      return walletId;
    }

    const url = `${lnbiturl}/api/v1/wallet?api-key=${adminkey}`;
    console.log(`Attempting to create wallet at URL: ${url}`);

    const requestBody = {
      name: `${objectID} - ${displayName}`
    };

    console.log(`Request Body:`, JSON.stringify(requestBody));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error in ensureUserWallet:', error);
    return null;
  }
}


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
  ensureUserWallet,
  
};