import React from "react";
import WalletAllowanceCard from "./components/WalletAllowanceCard";
import WalletMainPage from "./components/WalletMainPage";
import WalletTransactionHistory from "./components/WalletTransactionHistory";
import WalletTransactionLog from "./components/WalletTransactionLog";

const Wallet: React.FC = () => {
 
  
  return (
    <div>
        <div>
     
        {/* <WalletMainPage/> */}
        <WalletAllowanceCard
        availableSats={2000000}
        availableAmountUSD={74.2}
        remainingSats={90000}
        spentSats={1000000}
      />

      
      <WalletTransactionHistory />
      <WalletTransactionLog />


    </div>

    </div>
  );
};

export default Wallet;
