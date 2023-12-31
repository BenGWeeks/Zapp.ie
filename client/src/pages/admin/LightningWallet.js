import React, { useState } from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';

const LightningWallet = () => {
  const [walletName, setWalletName] = useState('');
  const [walletPassword, setWalletPassword] = useState('');

  const createWallet = async () => {
    const response = await fetch('https://api.zebedee.io/v0/wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.REACT_APP_ZEBEDEE_API_KEY,
      },
      body: JSON.stringify({
        name: walletName,
        password: walletPassword,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Lightning Wallet</h1>
      <TextField label="Wallet Name" value={walletName} onChange={(e, newValue) => setWalletName(newValue)} />
      <TextField label="Wallet Password" value={walletPassword} onChange={(e, newValue) => setWalletPassword(newValue)} />
      <PrimaryButton onClick={createWallet}>Create Wallet</PrimaryButton>
    </div>
  );
};

export default LightningWallet;
