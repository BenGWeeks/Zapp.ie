// src/types/global.d.ts

interface Reward {
  id: string;
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
  receivingWallet: Wallet;
  sendingWallet: Wallet;
  userType: UserType;
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


declare module '*.svg' {
  const content: any;
  export default content;
}

type WalletType = 'Sending' | 'Receiving';
type UserType = 'teammate'| 'admin' | 'copilot'| 'customer';
