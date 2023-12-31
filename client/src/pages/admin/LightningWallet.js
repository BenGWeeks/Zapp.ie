import React, { useState, useEffect } from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';

const LightningWallet = () => {
  const [balance, setBalance] = useState(0);

  const saveApiKey = async () => {
    // Save the API key
    console.log(apiKey);

    // Fetch the balance from the Zebedee API
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/zebedee/balance`, {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.log('There was a problem with the fetch operation: ' + error.message);
    }
  };

  // Fetch the balance when the component mounts
  useEffect(() => {
    saveApiKey();
  }, []);

  return (
    <div>
      <h1>Lightning Wallet</h1>
      <p>Balance: {balance}</p>
    </div>
  );
};

export default LightningWallet;
