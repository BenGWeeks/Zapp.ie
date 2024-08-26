// src/types/global.d.ts

interface Wallet {
  id: string;
  name: string;
  adminkey: string;
  inkey: string;
  balance_msat: number;
}

type WalletType = 'Sending' | 'Receiving';
