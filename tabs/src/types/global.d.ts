// src/types/global.d.ts
interface Zap {
  id: string;
  bolt11: string;
  from: string | null;
  to: string | null;
  memo: string;
  amount: number;
  wallet_id: string;
  time: number;
}

interface User {
  displayName: string;
  aadObjectId: string;
  email: string;
  receivingWallet: Wallet;
  sendingWallet: Wallet;
}

interface Wallet {
  id: string;
  name: string;
  adminkey: string;
  inkey: string;
  balance_msat: number;
}

type WalletType = 'Allowance' | 'Private';

declare module '*.svg' {
  const content: any;
  export default content;
}
