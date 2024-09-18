import React from "react";
import WalletAllowanceCard from "./components/WalletAllowanceCard";
import WalletTransactionHistory from "./components/WalletTransactionHistory";
import WalletTransactionLog from "./components/WalletTransactionLog";

const Wallet: React.FC = () => {


  return (
    <div>
      <div>
        <WalletAllowanceCard
          availableSats={2000000}
          availableAmountUSD={74.2}
          remainingSats={90000}
          spentSats={20000}
        />
        <WalletTransactionHistory />
        <WalletTransactionLog />
      </div>
    </div>
  );
};

export default Wallet;
