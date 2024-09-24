import React from "react";
import WalletAllowanceCard from "./components/WalletAllowanceCard";
import WalletYourWalletInfoCard from "./components/WalletYourWalletInfoCard";
import WalletTransactionHistory from "./components/WalletTransactionHistory";
import WalletTransactionLog from "./components/WalletTransactionLog";

const YourWallet: React.FC = () => {


  return (
    <div className="app-container">
      <WalletYourWalletInfoCard />
      <WalletTransactionHistory />
      <WalletTransactionLog />
    </div>
  );
};

export default YourWallet;