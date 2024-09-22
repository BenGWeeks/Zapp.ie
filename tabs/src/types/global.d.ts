// src/types/global.d.ts

interface Reward {
  image: string;
  name: string;
  shortDescription: string;
  link: string;
  price: number;
}

interface UserAccount {
  id: string;
  is_super_user: boolean;
  is_admin: boolean;
  username: string;
  email: string;
  balance_msat: number;
  transaction_count: number;
  wallet_count: number;
  last_payment: string;
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
  privateWallet: Wallet | null;
  allowanceWallet: Wallet | null;
}

type WalletType = 'Allowance' | 'Private';

interface Transaction {
  checking_id: string;
  pending: boolean;
  amount: number; // in millisatoshis (msats)
  fee: number;
  memo: string;
  time: number; // Unix timestamp
  extra: { [key: string]: any }; // JSON object
  wallet_id: string;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}
