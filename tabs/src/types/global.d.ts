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

interface Wallet {
  id: string;
  admin: string;
  name: string;
  user: string;
  adminkey: string;
  inkey: string;
  balance_msat: number;
  deleted: boolean;
}

interface User {
  id: string;
  displayName: string;
  profileImg: string;
  aadObjectId: string;
  email: string;
  privateWallet: Wallet;
  allowanceWallet: Wallet;
}

type WalletType = 'Allowance' | 'Private';

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
