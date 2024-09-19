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
  extra: [];
}

interface ZapRewards {
  image: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
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

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

type NostrZapRewards = {
  image: string,
  name: string,
  shortDescription: string,
  link: string,
  price: number,
};
declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
