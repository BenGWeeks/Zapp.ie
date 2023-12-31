import React, { useState } from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';

const LightningWallet = () => {
  const [apiKey, setApiKey] = useState('');

  const saveApiKey = () => {
    // Save the API key
    console.log(apiKey);
  };

  return (
    <div>
      <h1>Lightning Wallet</h1>
      <TextField label="Zebedee API Key" value={apiKey} onChange={(e, newValue) => setApiKey(newValue)} />
      <PrimaryButton onClick={saveApiKey}>Save API Key</PrimaryButton>
    </div>
  );
};

export default LightningWallet;
