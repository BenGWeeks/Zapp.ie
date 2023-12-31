import React, { useState, useEffect } from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';

const LightningWallet = () => {
  const [apiKey, setApiKey] = useState('');
  const [balance, setBalance] = useState(0);

  const saveApiKey = async () => {
    // Save the API key
    console.log(apiKey);

    // Fetch the balance from the Zebedee API
    const response = await fetch('https://api.zebedee.io/v0/wallet/balance', {
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
    });
    const data = await response.json();
    setBalance(data.balance);
  };

  // Fetch the balance when the component mounts
  useEffect(() => {
    saveApiKey();
  }, []);

  return (
    <div>
      <h1>Lightning Wallet</h1>
      <TextField label="Zebedee API Key" value={apiKey} onChange={(e, newValue) => setApiKey(newValue)} />
      <PrimaryButton onClick={saveApiKey}>Save API Key</PrimaryButton>
      <p>Balance: {balance}</p>
    </div>
  );
};

export default LightningWallet;
