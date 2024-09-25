import React from 'react';
import WalletAllwanaceMainComponent from './components/WalletAllwanaceMainComponent';

const Wallet: React.FC = () => {
  return (
    <div>
      <div>
        {/* <WalletAllowanceCard
          availableSats={2000000}
          availableAmountUSD={74.2}
          remainingSats={90000}
          spentSats={20000}
        />
        <WalletTransactionHistory />
        <WalletTransactionLog />
         */}

        <WalletAllwanaceMainComponent />
      </div>
    </div>
  );
};

export default Wallet;
